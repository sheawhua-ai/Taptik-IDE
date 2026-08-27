import React, { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  History,
  Image as ImageIcon,
  RotateCcw,
  Send,
  UserRound
} from 'lucide-react';
import type { MaterialAsset } from '../../material-center/types';
import type { ExecutionTask, MaterialSubItem } from './types';

type ReviewDecision = '待判断' | '已通过' | '需补拍';

interface DraftDecision {
  decision: ReviewDecision;
  reason: string;
  keepAsAvailable: boolean;
}

interface ReviewItem {
  key: string;
  task: ExecutionTask;
  subItem: MaterialSubItem;
}

interface MaterialBatchReviewWorkbenchProps {
  projectName: string;
  tasks: ExecutionTask[];
  onTasksChange: (tasks: ExecutionTask[]) => void;
  onAssetsAccepted?: (assets: MaterialAsset[]) => void;
  workspaceNavigation?: React.ReactNode;
}

const RESHOOT_REASONS = ['主体或产品不清晰', '画面不符合镜头要求', '存在水印或截图痕迹', '真实性表达不足'];

const makeKey = (taskId: string, subItemId: string) => `${taskId}:${subItemId}`;

const getInitialDecision = (subItem: MaterialSubItem): DraftDecision => ({
  decision: subItem.manualStatus === '已通过' ? '已通过' : subItem.manualStatus === '需补拍' ? '需补拍' : '待判断',
  reason: subItem.reshootReason ?? '',
  keepAsAvailable: !subItem.isRequired
});

const toMaterialAsset = (item: ReviewItem, keepAsAvailable: boolean): MaterialAsset | null => {
  const uploaded = item.subItem.uploadedAssets[0];
  if (!uploaded) return null;
  const isReserved = item.subItem.isRequired && !keepAsAvailable;

  return {
    id: `MAT-ACCEPTED-${item.task.id}-${item.subItem.id}`,
    name: `${item.task.noteTitle} · ${item.subItem.requirement}`,
    url: uploaded.url,
    aspectRatio: '3:4',
    fileType: 'image',
    fileSize: uploaded.fileSize,
    resolution: uploaded.resolution,
    category: 'publish_material',
    status: isReserved ? 'reserved' : 'available',
    materialUse: item.subItem.id.includes('1') ? 'cover' : 'body_image',
    sourceType: 'task_upload',
    sourceLabel: `任务回传 · ${item.task.targetAccount}`,
    uploader: item.task.targetAccount,
    uploadTime: uploaded.uploadTime,
    sourceProject: item.task.projectName,
    tags: ['实拍素材', item.task.accountType, isReserved ? '已绑定笔记' : '备用素材'],
    vectorDescription: item.subItem.requirement,
    usageRelation: isReserved ? {
      noteId: item.task.noteId,
      noteTitle: item.task.noteTitle,
      projectId: item.task.projectId,
      projectName: item.task.projectName,
      accountName: item.task.targetAccount,
      usageState: 'reserved',
      reservationTime: '刚刚'
    } : undefined,
    performance: { hasBackendData: false, performanceType: 'none' },
    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: item.task.noteTitle,
        product: '方案关联产品',
        scene: item.subItem.requirement,
        composition: '符合发布素材基础要求',
        lightingColor: uploaded.technicalCheck.lightingQuality
      },
      manualAcceptance: {
        operatorName: '当前操盘手',
        time: '刚刚',
        passed: true,
        comment: isReserved ? '验收通过并绑定当前笔记' : '验收通过并保留为可用素材'
      }
    }
  };
};

export function MaterialBatchReviewWorkbench({
  projectName,
  tasks,
  onTasksChange,
  onAssetsAccepted,
  workspaceNavigation
}: MaterialBatchReviewWorkbenchProps) {
  const reviewItems = useMemo<ReviewItem[]>(() => tasks.flatMap(task =>
    (task.materialSubItems ?? []).map(subItem => ({
      key: makeKey(task.id, subItem.id),
      task,
      subItem
    }))
  ), [tasks]);

  const [decisions, setDecisions] = useState<Record<string, DraftDecision>>(() => Object.fromEntries(
    reviewItems.map(item => [item.key, getInitialDecision(item.subItem)])
  ));
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [sharedReason, setSharedReason] = useState(RESHOOT_REASONS[0]);
  const [replacementExecutor, setReplacementExecutor] = useState('保持原执行人');
  const [showHistory, setShowHistory] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const counts = useMemo(() => reviewItems.reduce((result, item) => {
    const decision = decisions[item.key]?.decision ?? '待判断';
    if (decision === '已通过') result.accepted += 1;
    else if (decision === '需补拍') result.reshoot += 1;
    else result.pending += 1;
    return result;
  }, { accepted: 0, reshoot: 0, pending: 0 }), [decisions, reviewItems]);

  const requiredPending = reviewItems.some(item => item.subItem.isRequired && (decisions[item.key]?.decision ?? '待判断') === '待判断');

  const updateDecision = (key: string, patch: Partial<DraftDecision>) => {
    setDecisions(current => ({
      ...current,
      [key]: { ...(current[key] ?? { decision: '待判断', reason: '', keepAsAvailable: false }), ...patch }
    }));
  };

  const applyToSelection = (decision: Exclude<ReviewDecision, '待判断'>) => {
    if (selectedKeys.size === 0) {
      setNotice('请先选择要批量处理的素材。');
      return;
    }
    setDecisions(current => {
      const next = { ...current };
      selectedKeys.forEach(key => {
        const existing = next[key] ?? { decision: '待判断', reason: '', keepAsAvailable: false };
        next[key] = {
          ...existing,
          decision,
          reason: decision === '需补拍' ? sharedReason : ''
        };
      });
      return next;
    });
    setSelectedKeys(new Set());
  };

  const selectAiPassed = () => {
    setSelectedKeys(new Set(reviewItems
      .filter(item => item.subItem.uploadedAssets[0]?.technicalCheck.resolutionValid && item.subItem.uploadedAssets[0]?.technicalCheck.noWatermark)
      .map(item => item.key)));
  };

  const submitReview = () => {
    if (requiredPending) {
      setNotice('必拍镜头仍有未判断项，请先给出结论。');
      return;
    }

    const acceptedAssets = reviewItems.flatMap(item => {
      const draft = decisions[item.key];
      if (draft?.decision !== '已通过') return [];
      const asset = toMaterialAsset(item, draft.keepAsAvailable);
      return asset ? [asset] : [];
    });

    const updatedTasks = tasks.map(task => {
      const materialSubItems = (task.materialSubItems ?? []).map(subItem => {
        const draft = decisions[makeKey(task.id, subItem.id)] ?? getInitialDecision(subItem);
        return {
          ...subItem,
          manualStatus: draft.decision === '待判断' ? '不需要' : draft.decision,
          reshootReason: draft.decision === '需补拍' ? draft.reason || sharedReason : undefined
        } as MaterialSubItem;
      });
      const needsReshoot = materialSubItems.some(item => item.manualStatus === '需补拍');
      return {
        ...task,
        status: needsReshoot ? '执行中' : '已完成',
        waitingParty: needsReshoot ? (replacementExecutor === '保持原执行人' ? task.waitingParty : replacementExecutor) : '已完成',
        waitingRole: needsReshoot ? 'team' : 'completed',
        isMeWaiting: false,
        isTeamExecuting: needsReshoot,
        materialSubItems,
        timelineEvents: [
          ...task.timelineEvents,
          {
            id: `review-${task.id}-${Date.now()}`,
            time: '刚刚',
            actor: '操盘手',
            action: needsReshoot ? '提交本批审核，补拍项已退回原任务' : '提交本批审核，素材已全部验收通过'
          }
        ]
      } as ExecutionTask;
    });

    onTasksChange(updatedTasks);
    if (acceptedAssets.length > 0) onAssetsAccepted?.(acceptedAssets);
    setNotice(counts.reshoot > 0
      ? `审核已提交：${counts.accepted}张入库，${counts.reshoot}张退回补拍。`
      : `审核已提交：${counts.accepted}张素材已进入正式素材池。`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-page-bg">
      <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {workspaceNavigation}
            <div className="min-w-0">
              <div className="truncate text-[10px] text-text-tertiary">{projectName}</div>
              <h2 className="truncate text-[14px] font-semibold text-text-main">素材审核</h2>
            </div>
            <div className="hidden items-center gap-2 text-[9.5px] text-text-tertiary md:flex">
              <span>待判断 {counts.pending}</span><span>·</span><span className="text-emerald-700">通过 {counts.accepted}</span><span>·</span><span className="text-rose-600">补拍 {counts.reshoot}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowContext(current => !current)} className={`rounded-lg border px-2.5 py-1.5 text-[10px] ${showContext ? 'border-neutral-900 bg-neutral-950 text-white' : 'border-border-default text-text-secondary hover:bg-hover-bg'}`}>审核依据</button>
            <button type="button" onClick={() => setShowHistory(current => !current)} className="flex items-center gap-1.5 rounded-lg border border-border-default px-2.5 py-1.5 text-[10px] text-text-secondary hover:bg-hover-bg">
              <History size={12} />记录{showHistory ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          </div>
        </div>
      </div>

      {showContext ? (
        <div className="shrink-0 border-b border-border-default bg-surface-subtle px-4 py-2 text-[10px] leading-4 text-text-secondary">
          系统已预检清晰度、水印和尺寸；本批来自 {tasks.length} 个原任务、共 {reviewItems.length} 个镜头。操盘手只需判断是否满足对应笔记，审核通过后按原笔记绑定。
        </div>
      ) : null}

      {showHistory ? (
        <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2">
          <div className="grid gap-2 md:grid-cols-2">
            {tasks.flatMap(task => task.timelineEvents.slice(-2).map(event => (
              <div key={event.id} className="rounded-lg bg-surface-subtle px-3 py-2 text-[10px] text-text-secondary">
                <span className="text-text-tertiary">{event.time}</span> · {event.actor} · {event.action}
              </div>
            )))}
          </div>
        </div>
      ) : null}

      <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={selectAiPassed} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[10px] font-medium text-text-main hover:bg-hover-bg">选中预检通过</button>
          <button type="button" onClick={() => applyToSelection('已通过')} className="rounded-lg bg-neutral-950 px-2.5 py-1.5 text-[10px] font-medium text-white">批量通过</button>
          <button type="button" onClick={() => applyToSelection('需补拍')} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[10px] font-medium text-text-main hover:bg-hover-bg">批量补拍</button>
          <select value={sharedReason} onChange={event => setSharedReason(event.target.value)} className="ml-auto rounded-lg border border-border-default bg-surface-1 px-2.5 py-1.5 text-[10px] text-text-secondary">
            {RESHOOT_REASONS.map(reason => <option key={reason}>{reason}</option>)}
          </select>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
        <div className="space-y-2.5">
          {reviewItems.map(item => {
            const draft = decisions[item.key] ?? getInitialDecision(item.subItem);
            const uploaded = item.subItem.uploadedAssets[0];
            const selected = selectedKeys.has(item.key);
            const aiPassed = Boolean(uploaded?.technicalCheck.resolutionValid && uploaded?.technicalCheck.noWatermark);
            return (
              <article key={item.key} className={`rounded-xl border bg-surface-1 p-3 transition-colors ${selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-border-default'}`} style={{ contentVisibility: 'auto', containIntrinsicSize: '128px' }}>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedKeys(current => {
                      const next = new Set(current);
                      if (next.has(item.key)) next.delete(item.key); else next.add(item.key);
                      return next;
                    })}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-subtle text-left"
                    aria-label={selected ? '取消选择素材' : '选择素材'}
                  >
                    {uploaded ? <img src={uploaded.url} alt={item.subItem.requirement} className="h-full w-full object-cover" /> : <ImageIcon size={22} className="m-auto text-text-tertiary" />}
                    <span className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border ${selected ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-white bg-white/90 text-transparent'}`}><Check size={12} /></span>
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-surface-subtle px-2 py-1 text-[9.5px] text-text-secondary">{item.task.noteTitle}</span>
                      <span className="flex items-center gap-1 text-[9.5px] text-text-tertiary"><UserRound size={11} />{item.task.targetAccount}</span>
                      <span className={`ml-auto rounded-md px-2 py-1 text-[9.5px] ${aiPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{aiPassed ? 'AI预检通过' : '需重点检查'}</span>
                    </div>
                    <h3 className="mt-1.5 text-[12px] font-semibold text-text-main">{item.subItem.requirement}</h3>
                    <details className="mt-1 text-[9.5px] text-text-tertiary">
                      <summary className="cursor-pointer select-none">查看预检详情</summary>
                      <p className="mt-1 leading-4">{item.subItem.autoCheckResult}</p>
                    </details>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => updateDecision(item.key, { decision: '已通过', reason: '' })} className={`rounded-lg px-3 py-1.5 text-[10px] font-medium ${draft.decision === '已通过' ? 'bg-neutral-950 text-white' : 'border border-border-default text-text-secondary'}`}>通过</button>
                      <button type="button" onClick={() => updateDecision(item.key, { decision: '需补拍', reason: draft.reason || sharedReason })} className={`rounded-lg px-3 py-1.5 text-[10px] font-medium ${draft.decision === '需补拍' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'border border-border-default text-text-secondary'}`}>要求补拍</button>
                      {!item.subItem.isRequired && draft.decision === '已通过' ? (
                        <label className="ml-auto flex items-center gap-2 text-[10px] text-text-secondary">
                          <input type="checkbox" checked={draft.keepAsAvailable} onChange={event => updateDecision(item.key, { keepAsAvailable: event.target.checked })} />保留为可用素材
                        </label>
                      ) : null}
                    </div>
                    {draft.decision === '需补拍' ? (
                      <input value={draft.reason} onChange={event => updateDecision(item.key, { reason: event.target.value })} placeholder="补充此镜头的补拍要求" className="mt-2 w-full rounded-lg border border-border-default px-3 py-2 text-[10px] outline-none focus:border-border-strong" />
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border-default bg-surface-1 px-4 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 text-[10.5px]">
            <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 size={13} />已通过 {counts.accepted}</span>
            <span className="flex items-center gap-1 text-rose-600"><RotateCcw size={13} />补拍 {counts.reshoot}</span>
            <span className="flex items-center gap-1 text-text-tertiary"><Clock3 size={13} />未判断 {counts.pending}</span>
          </div>
          {counts.reshoot > 0 ? (
            <select value={replacementExecutor} onChange={event => setReplacementExecutor(event.target.value)} className="ml-auto rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[10px] text-text-secondary">
              <option>保持原执行人</option><option>改派备用员工</option><option>改派备用KOC</option>
            </select>
          ) : <span className="ml-auto text-[9.5px] text-text-tertiary">判断暂存于当前页面，提交后才写回任务</span>}
          <button type="button" onClick={() => setNotice('审核草稿已保存。')} className="rounded-lg border border-border-default px-3 py-2 text-[10.5px] font-medium text-text-secondary">保存草稿</button>
          <button type="button" onClick={submitReview} disabled={requiredPending} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[10.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35"><Send size={12} />提交本批审核</button>
        </div>
      </div>

      {notice ? <div className="fixed bottom-6 left-1/2 z-[180] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2.5 text-[10.5px] text-white shadow-xl">{notice}</div> : null}
    </div>
  );
}
