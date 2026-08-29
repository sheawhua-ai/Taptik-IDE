import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Image as ImageIcon,
  Layers3,
  RotateCcw,
  Search,
  Send,
  Sparkles,
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
  tasks: ExecutionTask[];
  followUpTasks?: ExecutionTask[];
  onOpenFollowUp?: (task: ExecutionTask) => void;
  onTasksChange: (tasks: ExecutionTask[]) => void;
  onAssetsAccepted?: (assets: MaterialAsset[]) => void;
  workspaceNavigation?: React.ReactNode;
}

const RESHOOT_REASONS = ['主体或产品不清晰', '画面不符合要求', '存在水印或截图痕迹', '真实性表达不足'];
const OPTIMIZE_ACTIONS = ['统一裁切为3:4', '尺寸规范化', '去除水印', '按模板贴字'];

const makeKey = (taskId: string, subItemId: string) => `${taskId}:${subItemId}`;

const getInitialDecision = (subItem: MaterialSubItem): DraftDecision => ({
  decision: subItem.manualStatus === '已通过' ? '已通过' : subItem.manualStatus === '需补拍' ? '需补拍' : '待判断',
  reason: subItem.reshootReason ?? '',
  keepAsAvailable: !subItem.isRequired
});

const getSubmittedCount = (task: ExecutionTask) => (
  (task.materialSubItems ?? []).reduce((sum, item) => sum + item.uploadedAssets.length, 0)
);

const toMaterialAsset = (item: ReviewItem, keepAsAvailable: boolean): MaterialAsset | null => {
  const uploaded = item.subItem.uploadedAssets[0];
  if (!uploaded) return null;
  const isReserved = Boolean(item.task.noteId) && item.subItem.isRequired && !keepAsAvailable;
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
    tags: ['实拍素材', item.task.accountType, isReserved ? '已绑定笔记' : '项目可用'],
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
        comment: isReserved ? '验收通过并绑定当前笔记' : '验收通过并进入项目素材池'
      }
    }
  };
};

export function MaterialBatchReviewWorkbench({
  tasks,
  followUpTasks = [],
  onOpenFollowUp,
  onTasksChange,
  onAssetsAccepted,
  workspaceNavigation
}: MaterialBatchReviewWorkbenchProps) {
  const [selectedTaskId, setSelectedTaskId] = useState(() => tasks[0]?.id ?? '');
  const [taskQuery, setTaskQuery] = useState('');
  const activeTask = tasks.find(task => task.id === selectedTaskId) ?? tasks[0];
  const visibleTasks = useMemo(() => {
    const query = taskQuery.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter(task => [task.title, task.targetAccount, task.projectName]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query)));
  }, [taskQuery, tasks]);

  const allReviewItems = useMemo<ReviewItem[]>(() => tasks.flatMap(task => (
    (task.materialSubItems ?? []).map(subItem => ({ key: makeKey(task.id, subItem.id), task, subItem }))
  )), [tasks]);
  const reviewItems = useMemo(() => allReviewItems.filter(item => item.task.id === activeTask?.id), [activeTask?.id, allReviewItems]);
  const [decisions, setDecisions] = useState<Record<string, DraftDecision>>(() => Object.fromEntries(
    allReviewItems.map(item => [item.key, getInitialDecision(item.subItem)])
  ));
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [sharedReason, setSharedReason] = useState(RESHOOT_REASONS[0]);
  const [replacementExecutor, setReplacementExecutor] = useState('保持原执行人');
  const [showContext, setShowContext] = useState(false);
  const [showReshootPanel, setShowReshootPanel] = useState(false);
  const [showBatchOptimize, setShowBatchOptimize] = useState(false);
  const [optimizeAction, setOptimizeAction] = useState(OPTIMIZE_ACTIONS[0]);
  const [notice, setNotice] = useState<string | null>(null);
  const taskIds = useMemo(() => tasks.map(task => task.id).join('|'), [tasks]);

  useEffect(() => {
    setSelectedTaskId(current => tasks.some(task => task.id === current) ? current : tasks[0]?.id ?? '');
    setSelectedKeys(new Set());
    setShowContext(false);
    setShowReshootPanel(false);
    setShowBatchOptimize(false);
    setDecisions(current => Object.fromEntries(allReviewItems.map(item => [item.key, current[item.key] ?? getInitialDecision(item.subItem)])));
  }, [allReviewItems, taskIds, tasks]);

  const counts = useMemo(() => reviewItems.reduce((result, item) => {
    const decision = decisions[item.key]?.decision ?? '待判断';
    if (decision === '已通过') result.accepted += 1;
    else if (decision === '需补拍') result.reshoot += 1;
    else result.pending += 1;
    return result;
  }, { accepted: 0, reshoot: 0, pending: 0 }), [decisions, reviewItems]);

  const requiredPending = reviewItems.some(item => (
    item.subItem.isRequired && (decisions[item.key]?.decision ?? '待判断') === '待判断'
  ));

  const updateDecision = (key: string, patch: Partial<DraftDecision>) => {
    setDecisions(current => ({
      ...current,
      [key]: { ...(current[key] ?? { decision: '待判断', reason: '', keepAsAvailable: false }), ...patch }
    }));
  };

  const toggleSelected = (key: string) => {
    setSelectedKeys(current => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const applyToSelection = (decision: Exclude<ReviewDecision, '待判断'>) => {
    if (selectedKeys.size === 0) {
      setNotice('请先选择素材。');
      return;
    }
    setDecisions(current => {
      const next = { ...current };
      selectedKeys.forEach(key => {
        const existing = next[key] ?? { decision: '待判断', reason: '', keepAsAvailable: false };
        next[key] = { ...existing, decision, reason: decision === '需补拍' ? sharedReason : '' };
      });
      return next;
    });
    setSelectedKeys(new Set());
  };

  const openReshootPanel = () => {
    if (selectedKeys.size === 0) {
      setNotice('请先选择需要退回的素材。');
      return;
    }
    setShowBatchOptimize(false);
    setShowReshootPanel(true);
  };

  const confirmReshoot = () => {
    applyToSelection('需补拍');
    setShowReshootPanel(false);
  };

  const selectAiPassed = () => {
    setSelectedKeys(new Set(reviewItems.filter(item => {
      const uploaded = item.subItem.uploadedAssets[0];
      return uploaded?.technicalCheck.resolutionValid && uploaded.technicalCheck.noWatermark;
    }).map(item => item.key)));
  };

  const submitBatchOptimize = () => {
    if (selectedKeys.size === 0) {
      setNotice('请先选择需要修改的素材。');
      return;
    }
    setNotice(`已将 ${selectedKeys.size} 张素材加入“${optimizeAction}”批量处理，完成后回到本任务继续审核。`);
    setShowBatchOptimize(false);
    setSelectedKeys(new Set());
  };

  const submitReview = () => {
    if (!activeTask) return;
    if (requiredPending) {
      setNotice('必拍素材仍有未判断项。');
      return;
    }

    const acceptedAssets = reviewItems.flatMap(item => {
      const draft = decisions[item.key];
      if (draft?.decision !== '已通过') return [];
      const asset = toMaterialAsset(item, draft.keepAsAvailable);
      return asset ? [asset] : [];
    });

    const materialSubItems = (activeTask.materialSubItems ?? []).map(subItem => {
      const draft = decisions[makeKey(activeTask.id, subItem.id)] ?? getInitialDecision(subItem);
      return {
        ...subItem,
        manualStatus: draft.decision === '待判断' ? '待验收' : draft.decision,
        reshootReason: draft.decision === '需补拍' ? draft.reason || sharedReason : undefined
      } as MaterialSubItem;
    });
    const needsReshoot = materialSubItems.some(item => item.manualStatus === '需补拍');
    const updatedTask: ExecutionTask = {
      ...activeTask,
      status: needsReshoot ? '执行中' : '已完成',
      waitingParty: needsReshoot ? (replacementExecutor === '保持原执行人' ? activeTask.targetAccount : replacementExecutor) : '已完成',
      waitingRole: needsReshoot ? 'team' : 'completed',
      isMeWaiting: false,
      isTeamExecuting: needsReshoot,
      materialSubItems,
      timelineEvents: [...activeTask.timelineEvents, {
        id: `review-${activeTask.id}-${Date.now()}`,
        time: '刚刚',
        actor: '操盘手',
        action: needsReshoot ? '本轮审核完成，补拍项已退回原任务' : '本轮素材全部验收通过'
      }]
    };

    onTasksChange([updatedTask]);
    if (acceptedAssets.length > 0) onAssetsAccepted?.(acceptedAssets);
    setNotice(counts.reshoot > 0
      ? `${counts.accepted} 张通过，${counts.reshoot} 张退回原任务重做。`
      : `${counts.accepted} 张素材已通过并进入素材中心。`);
  };

  if (!activeTask) {
    return (
      <div className="workspace-shell execution-workspace flex h-full min-h-0 flex-col bg-page-bg">
        <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5">{workspaceNavigation}</div>
        <div className="flex flex-1 items-center justify-center text-center">
          <div><CheckCircle2 size={28} className="mx-auto text-emerald-500" /><div className="mt-3 text-[13px] font-medium text-text-main">没有待审核素材任务</div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-shell execution-workspace flex h-full min-h-0 flex-col bg-page-bg">
      <header className="workspace-header flex shrink-0 items-center justify-between border-b border-border-default bg-surface-1">
        {workspaceNavigation}
        <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
          <span>{tasks.length} 项待审核</span>
          {followUpTasks.length > 0 ? (
            <button type="button" onClick={() => onOpenFollowUp?.(followUpTasks[0])} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 font-medium text-amber-800">待跟进 {followUpTasks.length}</button>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="workspace-sidebar w-[320px] shrink-0 overflow-hidden border-r border-border-default bg-surface-1 flex flex-col">
          <div className="workspace-sidebar-header space-y-3 border-b border-border-default">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">素材任务</h2>
              <span className="text-[13px] text-text-tertiary">{visibleTasks.length} 项</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input value={taskQuery} onChange={(event) => setTaskQuery(event.target.value)} placeholder="搜索任务或账号..." className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-[320px]">
            {visibleTasks.map(task => {
              const selected = task.id === activeTask.id;
              const requiredCount = task.materialSubItems?.length ?? 0;
              const submittedCount = getSubmittedCount(task);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setSelectedKeys(new Set());
                    setShowContext(false);
                    setShowReshootPanel(false);
                    setShowBatchOptimize(false);
                  }}
                  className={`w-full text-left px-4 py-3.5 transition-colors border-b border-border-subtle relative ${selected ? 'bg-surface-subtle' : 'bg-transparent hover:bg-hover-bg text-text-main'}`}
                >
                  {selected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />}
                  <div className={`text-[13px] line-clamp-1 ${selected ? 'font-semibold text-text-main' : 'font-medium text-text-main'}`}>{task.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[13px] text-text-tertiary tabular-nums">
                    <span className="flex min-w-0 items-center gap-1 truncate"><UserRound size={10} />{task.targetAccount}</span>
                    <span className="shrink-0">已交 {submittedCount}/{requiredCount}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
                  <span>{activeTask.noteId ? '笔记素材任务' : '项目级素材任务'}</span>
                  <span>·</span>
                  <span className="truncate">{activeTask.targetAccount}</span>
                  <span>·</span>
                  <span>{activeTask.deadline || '未设置截止'}</span>
                </div>
                <h2 className="mt-1 truncate text-[14px] font-semibold text-text-main">{activeTask.title}</h2>
                <div className="mt-2 flex items-center gap-1.5 text-[13px] text-text-tertiary" aria-label="素材任务流程">
                  {['已下发', '已领取', '已回传', '待审核'].map((step, index) => (
                    <React.Fragment key={step}>
                      <span className={index === 3 ? 'font-semibold text-text-main' : 'text-emerald-700'}>{step}</span>
                      {index < 3 ? <span className="h-px w-5 bg-border-strong" /> : null}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => setShowContext(current => !current)} className={`flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[13px] ${showContext ? 'border-neutral-900 bg-neutral-950 text-white' : 'border-border-default text-text-secondary hover:bg-hover-bg'}`}>
                任务详情 <ChevronDown size={11} className={showContext ? 'rotate-180' : ''} />
              </button>
            </div>
            {showContext ? (
              <div className="mt-3 grid gap-2 rounded-lg bg-surface-subtle p-3 text-[13px] leading-4 text-text-secondary md:grid-cols-2">
                <div><span className="text-text-tertiary">处理依据：</span>{activeTask.reasonForIntervention}</div>
                <div><span className="text-text-tertiary">下一步：</span>{activeTask.nextStepAfterAction}</div>
              </div>
            ) : null}
          </div>

          <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[13px] text-text-tertiary">已选 {selectedKeys.size}</span>
              <button type="button" onClick={() => setSelectedKeys(new Set(reviewItems.map(item => item.key)))} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg">全选</button>
              <button type="button" onClick={selectAiPassed} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg">选中预检通过</button>
              <button type="button" onClick={() => applyToSelection('已通过')} className="rounded-lg bg-neutral-950 px-2.5 py-1.5 text-[13px] font-medium text-white">批量通过</button>
              <button type="button" onClick={openReshootPanel} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg">退回重拍</button>
              <button type="button" onClick={() => { setShowBatchOptimize(current => !current); setShowReshootPanel(false); }} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg"><Sparkles size={11} />批量优化</button>
            </div>
            {showReshootPanel ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-surface-subtle p-2">
                <RotateCcw size={13} className="text-text-tertiary" />
                <select value={sharedReason} onChange={event => setSharedReason(event.target.value)} className="rounded-md border border-border-default bg-surface-1 px-2 py-1.5 text-[13px] text-text-secondary">
                  {RESHOOT_REASONS.map(reason => <option key={reason}>{reason}</option>)}
                </select>
                <select value={replacementExecutor} onChange={event => setReplacementExecutor(event.target.value)} className="rounded-md border border-border-default bg-surface-1 px-2 py-1.5 text-[13px] text-text-secondary">
                  <option>保持原执行人</option><option>改派备用员工</option><option>改派备用KOC</option>
                </select>
                <button type="button" onClick={confirmReshoot} className="rounded-md bg-neutral-950 px-3 py-1.5 text-[13px] text-white">确认退回要求</button>
              </div>
            ) : null}
            {showBatchOptimize ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-surface-subtle p-2">
                <Layers3 size={13} className="text-text-tertiary" />
                <select value={optimizeAction} onChange={event => setOptimizeAction(event.target.value)} className="rounded-md border border-border-default bg-surface-1 px-2 py-1.5 text-[13px] text-text-secondary">
                  {OPTIMIZE_ACTIONS.map(action => <option key={action}>{action}</option>)}
                </select>
                <button type="button" onClick={submitBatchOptimize} className="rounded-md bg-neutral-950 px-3 py-1.5 text-[13px] text-white">加入处理</button>
              </div>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
            <div className="grid gap-3 xl:grid-cols-2">
              {reviewItems.map(item => {
                const draft = decisions[item.key] ?? getInitialDecision(item.subItem);
                const uploaded = item.subItem.uploadedAssets[0];
                const selected = selectedKeys.has(item.key);
                const aiPassed = Boolean(uploaded?.technicalCheck.resolutionValid && uploaded?.technicalCheck.noWatermark);
                return (
                  <article
                    key={item.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSelected(item.key)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleSelected(item.key);
                      }
                    }}
                    className={`cursor-pointer rounded-xl border bg-surface-1 p-3 transition-colors ${selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-border-default hover:border-border-strong'}`}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '190px' }}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-subtle">
                        {uploaded ? <img src={uploaded.url} alt={item.subItem.requirement} className="h-full w-full object-cover" /> : <ImageIcon size={22} className="m-auto text-text-tertiary" />}
                        <span className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border ${selected ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-white bg-white/90 text-transparent'}`}><Check size={12} /></span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-2 py-1 text-[13px] ${aiPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{aiPassed ? '预检通过' : '重点检查'}</span>
                          <span className="ml-auto text-[13px] text-text-tertiary">{uploaded?.resolution || '待回传'}</span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-text-main">{item.subItem.requirement}</h3>
                        <details className="mt-1 text-[13px] text-text-tertiary" onClick={event => event.stopPropagation()}>
                          <summary className="cursor-pointer select-none">预检详情</summary>
                          <p className="mt-1 leading-4">{item.subItem.autoCheckResult}</p>
                        </details>
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={event => { event.stopPropagation(); updateDecision(item.key, { decision: '已通过', reason: '' }); }} className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${draft.decision === '已通过' ? 'bg-neutral-950 text-white' : 'border border-border-default text-text-secondary'}`}>通过</button>
                          <button type="button" onClick={event => { event.stopPropagation(); updateDecision(item.key, { decision: '需补拍', reason: draft.reason || sharedReason }); }} className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${draft.decision === '需补拍' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'border border-border-default text-text-secondary'}`}>打回</button>
                        </div>
                      </div>
                    </div>
                    {draft.decision === '需补拍' ? (
                      <input value={draft.reason} onClick={event => event.stopPropagation()} onChange={event => updateDecision(item.key, { reason: event.target.value })} placeholder="补充重拍要求" className="mt-2 w-full rounded-lg border border-border-default px-3 py-2 text-[13px] outline-none focus:border-border-strong" />
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>

          <footer className="shrink-0 border-t border-border-default bg-surface-1 px-4 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 text-[13px]">
                <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 size={12} />通过 {counts.accepted}</span>
                <span className="flex items-center gap-1 text-rose-600"><RotateCcw size={12} />打回 {counts.reshoot}</span>
                <span className="flex items-center gap-1 text-text-tertiary"><Clock3 size={12} />未判断 {counts.pending}</span>
              </div>
              <span className="ml-auto text-[13px] text-text-tertiary">通过的素材入库；退回项沿原任务继续执行</span>
              <button type="button" onClick={submitReview} disabled={requiredPending} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35"><Send size={12} />提交审核</button>
            </div>
          </footer>
        </main>
      </div>

      {notice ? <div className="fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2.5 text-[13px] text-white shadow-xl">{notice}</div> : null}
    </div>
  );
}
