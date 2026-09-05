import React, { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleSlash2,
  Clock3,
  Eye,
  Image as ImageIcon,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  UserRound,
  X
} from 'lucide-react';
import type { MaterialAsset } from '../../material-center/types';
import type { ExecutionTask, MaterialSubItem, UploadedAsset } from './types';

type ReviewDecision = '待判断' | '已通过' | '需补拍' | '不采用';
type TaskQueue = '全部' | '待执行' | '待审核';

interface DraftDecision {
  decision: ReviewDecision;
  reason: string;
  keepAsAvailable: boolean;
}

interface ReviewItem {
  key: string;
  task: ExecutionTask;
  subItem: MaterialSubItem;
  asset?: UploadedAsset;
  assetIndex: number;
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

const makeKey = (taskId: string, subItemId: string, assetId?: string) => `${taskId}:${subItemId}:${assetId ?? 'missing'}`;

const getInitialDecision = (subItem: MaterialSubItem, asset?: UploadedAsset): DraftDecision => {
  if (!asset) return { decision: '待判断', reason: '', keepAsAvailable: false };
  return {
    decision: asset.reviewStatus === '已通过' || asset.reviewStatus === '需补拍' || asset.reviewStatus === '不采用'
      ? asset.reviewStatus
      : subItem.manualStatus === '已通过' || subItem.manualStatus === '需补拍' || subItem.manualStatus === '不需要'
        ? subItem.manualStatus === '不需要' ? '不采用' : subItem.manualStatus
        : '待判断',
    reason: asset.reviewReason ?? subItem.reshootReason ?? '',
    keepAsAvailable: !subItem.isRequired
  };
};

const getSubmissionSummary = (task: ExecutionTask) => {
  const subItems = task.materialSubItems ?? [];
  return {
    requirementCount: subItems.length,
    fulfilledCount: subItems.filter(item => item.uploadedAssets.length > 0).length,
    assetCount: subItems.reduce((sum, item) => sum + item.uploadedAssets.length, 0)
  };
};

const hasReturnedAssets = (task: ExecutionTask) => (task.materialSubItems ?? [])
  .some(item => item.uploadedAssets.length > 0);

const getTaskQueue = (task: ExecutionTask): Exclude<TaskQueue, '全部'> => (
  hasReturnedAssets(task) ? '待审核' : '待执行'
);

const isTechnicalCheckPassed = (asset?: UploadedAsset) => Boolean(
  asset?.technicalCheck.resolutionValid
  && asset.technicalCheck.noWatermark
  && ['正常', '良好'].includes(asset.technicalCheck.lightingQuality)
);

const toMaterialAsset = (item: ReviewItem, keepAsAvailable: boolean): MaterialAsset | null => {
  const uploaded = item.asset;
  if (!uploaded) return null;
  const isReserved = Boolean(item.task.noteId) && item.subItem.isRequired && !keepAsAvailable;
  return {
    id: `MAT-ACCEPTED-${item.task.id}-${item.subItem.id}-${uploaded.id}`,
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
  const [taskQueue, setTaskQueue] = useState<TaskQueue>('全部');
  const activeTask = tasks.find(task => task.id === selectedTaskId) ?? tasks[0];
  const visibleTasks = useMemo(() => {
    const query = taskQuery.trim().toLowerCase();
    return tasks.filter(task => (taskQueue === '全部' || getTaskQueue(task) === taskQueue) && (!query || [task.title, task.targetAccount, task.projectName]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query))));
  }, [taskQuery, taskQueue, tasks]);

  const allReviewItems = useMemo<ReviewItem[]>(() => tasks.flatMap(task => (
    (task.materialSubItems ?? []).flatMap(subItem => {
      if (subItem.uploadedAssets.length > 0) {
        return subItem.uploadedAssets.map((asset, assetIndex) => ({
          key: makeKey(task.id, subItem.id, asset.id),
          task,
          subItem,
          asset,
          assetIndex
        }));
      }
      return subItem.isRequired ? [{
        key: makeKey(task.id, subItem.id),
        task,
        subItem,
        assetIndex: -1
      }] : [];
    })
  )), [tasks]);
  const reviewItems = useMemo(() => allReviewItems.filter(item => item.task.id === activeTask?.id), [activeTask?.id, allReviewItems]);
  const [decisions, setDecisions] = useState<Record<string, DraftDecision>>(() => Object.fromEntries(
    allReviewItems.map(item => [item.key, getInitialDecision(item.subItem, item.asset)])
  ));
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [sharedReason, setSharedReason] = useState(RESHOOT_REASONS[0]);
  const [replacementExecutor, setReplacementExecutor] = useState('保持原执行人');
  const [showContext, setShowContext] = useState(false);
  const [reshootItemKey, setReshootItemKey] = useState<string | null>(null);
  const [reshootDraftReason, setReshootDraftReason] = useState('');
  const [previewItemKey, setPreviewItemKey] = useState<string | null>(null);
  const [showReviewConfirmation, setShowReviewConfirmation] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const taskIds = useMemo(() => tasks.map(task => task.id).join('|'), [tasks]);

  useEffect(() => {
    setSelectedTaskId(current => tasks.some(task => task.id === current) ? current : tasks[0]?.id ?? '');
    setSelectedKeys(new Set());
    setShowContext(false);
    setReshootItemKey(null);
    setReshootDraftReason('');
    setPreviewItemKey(null);
    setShowReviewConfirmation(false);
    setNotice(null);
    setDecisions(current => Object.fromEntries(allReviewItems.map(item => [item.key, current[item.key] ?? getInitialDecision(item.subItem, item.asset)])));
  }, [allReviewItems, taskIds, tasks]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const counts = useMemo(() => reviewItems.reduce((result, item) => {
    const decision = decisions[item.key]?.decision ?? '待判断';
    if (decision === '已通过') result.accepted += 1;
    else if (decision === '需补拍') result.reshoot += 1;
    else if (decision === '不采用') result.unused += 1;
    else result.pending += 1;
    return result;
  }, { accepted: 0, reshoot: 0, unused: 0, pending: 0 }), [decisions, reviewItems]);

  const missingRequiredCount = reviewItems.filter(item => item.subItem.isRequired && !item.asset).length;
  const pendingReturnedCount = reviewItems.filter(item => item.asset && (decisions[item.key]?.decision ?? '待判断') === '待判断').length;
  const completionBlocked = false;
  const selectableKeys = useMemo(() => reviewItems.filter(item => Boolean(item.asset)).map(item => item.key), [reviewItems]);
  const allSelectableSelected = selectableKeys.length > 0 && selectableKeys.every(key => selectedKeys.has(key));
  const previewItem = previewItemKey ? reviewItems.find(item => item.key === previewItemKey) : undefined;
  const reshootItem = reshootItemKey ? reviewItems.find(item => item.key === reshootItemKey) : undefined;
  const activeQueue = getTaskQueue(activeTask);
  const queueCounts = useMemo(() => ({
    pending: tasks.filter(task => getTaskQueue(task) === '待执行').length,
    review: tasks.filter(task => getTaskQueue(task) === '待审核').length
  }), [tasks]);

  const updateDecision = (key: string, patch: Partial<DraftDecision>) => {
    setNotice(null);
    setDecisions(current => ({
      ...current,
      [key]: { ...(current[key] ?? { decision: '待判断', reason: '', keepAsAvailable: false }), ...patch }
    }));
  };

  const toggleAccepted = (key: string) => {
    const isAccepted = decisions[key]?.decision === '已通过';
    updateDecision(key, {
      decision: isAccepted ? '待判断' : '已通过',
      reason: ''
    });
  };

  const toggleSelected = (key: string) => {
    const item = reviewItems.find(candidate => candidate.key === key);
    if (!item?.asset) return;
    setNotice(null);
    setSelectedKeys(current => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const applyToSelection = (decision: Exclude<ReviewDecision, '待判断' | '不采用'>) => {
    if (selectedKeys.size === 0) {
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
    setNotice(null);
  };

  const openSingleReshoot = (key: string) => {
    setSelectedKeys(new Set());
    setNotice(null);
    setReshootDraftReason(decisions[key]?.reason || sharedReason);
    setReshootItemKey(key);
  };

  const confirmSingleReshoot = () => {
    if (!reshootItemKey) return;
    if (!reshootDraftReason.trim()) {
      setNotice('请填写具体的重拍要求。');
      return;
    }
    updateDecision(reshootItemKey, { decision: '需补拍', reason: reshootDraftReason.trim() });
    setReshootItemKey(null);
    setReshootDraftReason('');
    setNotice('已记录重拍要求；提交审核后将发给执行者。');
  };

  const selectAiPassed = () => {
    setNotice(null);
    setSelectedKeys(new Set(reviewItems.filter(item => (
      isTechnicalCheckPassed(item.asset)
      && (decisions[item.key]?.decision ?? '待判断') === '待判断'
    )).map(item => item.key)));
  };

  const remindExecutor = () => {
    const updatedTask: ExecutionTask = {
      ...activeTask,
      timelineEvents: [...activeTask.timelineEvents, {
        id: `remind-${activeTask.id}-${Date.now()}`,
        time: '刚刚',
        actor: '操盘手',
        action: `催促 ${activeTask.targetAccount} 尽快执行并回传素材`
      }]
    };
    onTasksChange([updatedTask]);
    setNotice(`已催促 ${activeTask.targetAccount}`);
  };

  const submitReview = () => {
    if (!activeTask) return;
    if (completionBlocked) {
      setNotice(missingRequiredCount > 0
        ? `还有 ${missingRequiredCount} 项必拍素材未回传，暂时无法完成验收。`
        : `还有 ${pendingReturnedCount} 张已回传素材未给出结论。`);
      return;
    }

    const acceptedAssets = reviewItems.flatMap(item => {
      const draft = decisions[item.key];
      if (draft?.decision !== '已通过') return [];
      const asset = toMaterialAsset(item, draft.keepAsAvailable);
      return asset ? [asset] : [];
    });

    const materialSubItems = (activeTask.materialSubItems ?? []).map(subItem => {
      const reviewedAssets = subItem.uploadedAssets.map(asset => {
        const draft = decisions[makeKey(activeTask.id, subItem.id, asset.id)] ?? getInitialDecision(subItem, asset);
        return {
          ...asset,
          reviewStatus: draft.decision === '待判断' ? '待验收' : draft.decision,
          reviewReason: draft.decision === '需补拍' ? draft.reason || sharedReason : undefined,
          reviewedBy: '当前操盘手',
          reviewedAt: '刚刚',
          reshootAiReview: draft.decision === '需补拍'
            ? { status: '待复核', summary: '等待补拍回传后，按原要求与本轮重拍要求自动复核' }
            : undefined
        } as UploadedAsset;
      });
      const assetDecisions = reviewedAssets.map(asset => asset.reviewStatus);
      const manualStatus: MaterialSubItem['manualStatus'] = assetDecisions.includes('需补拍')
        ? '需补拍'
        : assetDecisions.includes('已通过')
          ? '已通过'
          : assetDecisions.length > 0 && assetDecisions.every(status => status === '不采用')
            ? '不需要'
            : subItem.manualStatus;
      return {
        ...subItem,
        uploadedAssets: reviewedAssets,
        manualStatus,
        reshootReason: manualStatus === '需补拍'
          ? reviewedAssets.find(asset => asset.reviewStatus === '需补拍')?.reviewReason || sharedReason
          : undefined,
        reshootRequirement: manualStatus === '需补拍'
          ? reviewedAssets.find(asset => asset.reviewStatus === '需补拍')?.reviewReason || sharedReason
          : undefined
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
        action: needsReshoot
          ? `本轮验收完成：通过 ${counts.accepted} 张，退回补拍 ${counts.reshoot} 张，不采用 ${counts.unused} 张`
          : `本轮验收完成：通过 ${counts.accepted} 张，不采用 ${counts.unused} 张`
      }]
    };

    onTasksChange([updatedTask]);
    if (acceptedAssets.length > 0) onAssetsAccepted?.(acceptedAssets);
    setShowReviewConfirmation(false);
    setNotice(counts.reshoot > 0
      ? `${counts.accepted} 张通过，${counts.reshoot} 张退回补拍，${counts.unused} 张不采用。`
      : `${counts.accepted} 张素材已入库，${counts.unused} 张不采用。`);
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
            <div className="grid grid-cols-3 rounded-lg bg-surface-subtle p-0.5" aria-label="素材任务状态筛选">
              {(['全部', '待执行', '待审核'] as TaskQueue[]).map(queue => (
                <button key={queue} type="button" onClick={() => setTaskQueue(queue)} className={`rounded-md px-2 py-1.5 text-[12px] font-medium ${taskQueue === queue ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-main'}`}>
                  {queue}{queue === '待执行' ? ` ${queueCounts.pending}` : queue === '待审核' ? ` ${queueCounts.review}` : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-[320px]">
            {visibleTasks.map(task => {
              const selected = task.id === activeTask.id;
              const submission = getSubmissionSummary(task);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setSelectedKeys(new Set());
                    setShowContext(false);
                    setReshootItemKey(null);
                    setNotice(null);
                  }}
                  className={`w-full text-left px-4 py-3.5 transition-colors border-b border-border-subtle relative ${selected ? 'bg-surface-subtle' : 'bg-transparent hover:bg-hover-bg text-text-main'}`}
                >
                  {selected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />}
                  <div className={`text-[13px] line-clamp-1 ${selected ? 'font-semibold text-text-main' : 'font-medium text-text-main'}`}>{task.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[13px] text-text-tertiary tabular-nums">
                    <span className="flex min-w-0 items-center gap-1 truncate"><UserRound size={10} />{task.targetAccount}</span>
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[12px] ${getTaskQueue(task) === '待审核' ? 'bg-amber-50 text-amber-700' : 'bg-surface-subtle text-text-secondary'}`}>{getTaskQueue(task)}</span>
                  </div>
                  <div className="mt-1 text-right text-[12px] text-text-tertiary">{submission.fulfilledCount}/{submission.requirementCount} 项 · {submission.assetCount} 张</div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {activeQueue === '待审核' ? <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[13px] text-text-tertiary">已选 {selectedKeys.size}</span>
              <button
                type="button"
                onClick={() => {
                  setNotice(null);
                  setSelectedKeys(allSelectableSelected ? new Set() : new Set(selectableKeys));
                }}
                disabled={selectableKeys.length === 0}
                className="rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg disabled:cursor-not-allowed disabled:opacity-35"
              >{allSelectableSelected ? '清空' : '全选'}</button>
              <button type="button" onClick={selectAiPassed} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg">选中技术预检通过</button>
              <button type="button" onClick={() => applyToSelection('已通过')} disabled={selectedKeys.size === 0} className="rounded-lg bg-neutral-950 px-2.5 py-1.5 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-35">验收通过{selectedKeys.size > 0 ? `（${selectedKeys.size}）` : ''}</button>
              <button type="button" disabled title="需接入素材中心 AI 编辑链路后开放" className="flex cursor-not-allowed items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-tertiary opacity-50"><Sparkles size={11} />AI 优化待接入</button>
            </div>
          </div> : null}

          <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
            {activeQueue === '待执行' ? (
              <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm">
                <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Clock3 size={20} /></span><div><h3 className="text-[16px] font-semibold text-text-main">等待执行者回传素材</h3><p className="mt-1 text-[13px] leading-6 text-text-secondary">任务已发送给 {activeTask.targetAccount}。回传前无需审核，你可以催促执行或在“执行进程”中查看处理记录。</p></div></div>
                <div className="mt-5 space-y-2">{(activeTask.materialSubItems ?? []).map((item, index) => <div key={item.id} className="flex gap-3 rounded-xl bg-surface-subtle p-3 text-[13px]"><span className="text-text-tertiary">{index + 1}</span><span className="flex-1 text-text-main">{item.requirement}</span><span className="shrink-0 text-text-tertiary">待回传</span></div>)}</div>
                <div className="mt-5 flex items-center justify-between border-t border-border-default pt-4"><span className="text-[12px] text-text-tertiary">截止：{activeTask.deadline || '未设置'}</span><button type="button" onClick={remindExecutor} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white"><BellRing size={13} />催促执行</button></div>
              </div>
            ) : <div className="grid gap-3 xl:grid-cols-2">
              {reviewItems.map(item => {
                const draft = decisions[item.key] ?? getInitialDecision(item.subItem, item.asset);
                const uploaded = item.asset;
                const selected = selectedKeys.has(item.key);
                const aiPassed = isTechnicalCheckPassed(uploaded);
                return (
                  <article
                    key={item.key}
                    className={`rounded-xl border bg-surface-1 p-3 transition-colors ${selected ? 'border-neutral-900 ring-1 ring-neutral-900' : draft.decision === '已通过' ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-border-default hover:border-border-strong'}`}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '190px' }}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-subtle">
                        {uploaded ? (
                          <button type="button" onClick={() => setPreviewItemKey(item.key)} aria-label={`预览${item.subItem.requirement}`} className="group h-full w-full">
                            <img src={uploaded.url} alt={item.subItem.requirement} className="h-full w-full object-cover" />
                            <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"><Eye size={12} /></span>
                          </button>
                        ) : <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-text-tertiary"><ImageIcon size={22} /><span className="text-[11px]">待回传</span></div>}
                        {uploaded ? (
                          <button
                            type="button"
                            onClick={() => toggleSelected(item.key)}
                            aria-label={`${selected ? '取消选择' : '选择'}${item.subItem.requirement}${item.assetIndex > 0 ? `第${item.assetIndex + 1}张` : ''}`}
                            aria-pressed={selected}
                            className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border shadow-sm ${selected ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-white bg-white/95 text-transparent hover:text-text-tertiary'}`}
                          ><Check size={13} /></button>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-2 py-1 text-[13px] ${uploaded ? aiPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800' : 'bg-surface-subtle text-text-tertiary'}`}>{uploaded ? aiPassed ? '技术预检通过' : '技术预检异常' : '必拍素材待回传'}</span>
                          {item.assetIndex > 0 ? <span className="text-[12px] text-text-tertiary">第 {item.assetIndex + 1} 张</span> : null}
                          <span className="ml-auto text-[13px] text-text-tertiary">{uploaded?.resolution || '待回传'}</span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-text-main">{item.subItem.requirement}</h3>
                        <details className="mt-1 text-[13px] text-text-tertiary">
                          <summary className="cursor-pointer select-none">预检详情</summary>
                          <p className="mt-1 leading-4">{item.subItem.autoCheckResult}</p>
                        </details>
                        {uploaded ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              aria-pressed={draft.decision === '已通过'}
                              aria-label={draft.decision === '已通过' ? `取消验收通过：${item.subItem.requirement}` : `验收通过：${item.subItem.requirement}`}
                              onClick={() => toggleAccepted(item.key)}
                              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${draft.decision === '已通过' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'border border-border-default text-text-secondary'}`}
                            >{draft.decision === '已通过' ? <><CheckCircle2 size={12} />已通过 <span className="ml-1 text-emerald-600/70">取消</span></> : '验收通过'}</button>
                            <button type="button" onClick={() => openSingleReshoot(item.key)} className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${draft.decision === '需补拍' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'border border-border-default text-text-secondary'}`}>要求重拍</button>
                          </div>
                        ) : <p className="mt-2 text-[12px] leading-5 text-amber-700">该项属于必拍要求，需要执行人补充回传后才能完成验收。</p>}
                      </div>
                    </div>
                    {draft.decision === '需补拍' ? <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700"><RotateCcw size={11} />重拍要求：{draft.reason}</div> : null}
                  </article>
                );
              })}
            </div>}
          </div>

          {activeQueue === '待审核' ? <footer className="shrink-0 border-t border-border-default bg-surface-1 px-4 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 text-[13px]">
                <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 size={12} />通过 {counts.accepted}</span>
                <span className="flex items-center gap-1 text-rose-600"><RotateCcw size={12} />打回 {counts.reshoot}</span>
                <span className="flex items-center gap-1 text-text-tertiary"><Clock3 size={12} />未判断 {counts.pending}</span>
              </div>
              <span className="ml-auto text-[13px] text-text-tertiary">未验收的素材将自动放入素材中心【备选库】板块</span>
              <button type="button" onClick={() => setShowReviewConfirmation(true)} disabled={completionBlocked} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35"><Send size={12} />完成审核并流转</button>
            </div>
          </footer> : null}
        </main>
      </div>

      {previewItem?.asset ? (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/70 p-6" role="dialog" aria-modal="true" aria-label="素材大图预览" onClick={() => setPreviewItemKey(null)}>
          <div className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()}>
            <button type="button" onClick={() => setPreviewItemKey(null)} aria-label="关闭预览" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"><X size={17} /></button>
            <div className="min-h-0 flex-1 bg-neutral-950 p-4"><img src={previewItem.asset.url} alt={previewItem.subItem.requirement} className="mx-auto max-h-[68vh] max-w-full object-contain" /></div>
            <div className="grid gap-2 border-t border-border-default p-4 text-[13px] text-text-secondary md:grid-cols-3">
              <div className="md:col-span-2"><span className="text-text-tertiary">拍摄要求：</span>{previewItem.subItem.requirement}</div>
              <div><span className="text-text-tertiary">尺寸：</span>{previewItem.asset.resolution}</div>
              <div className="md:col-span-3"><span className="text-text-tertiary">技术预检：</span>{previewItem.subItem.autoCheckResult}</div>
            </div>
          </div>
        </div>
      ) : null}

      {reshootItem?.asset ? (
        <div className="fixed inset-0 z-[315] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="reshoot-title">
          <div className="w-full max-w-xl rounded-2xl border border-border-default bg-surface-1 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3"><div><h3 id="reshoot-title" className="text-[16px] font-semibold text-text-main">要求重拍这张素材</h3><p className="mt-1 text-[13px] text-text-tertiary">重拍必须逐张处理，避免要求错配。</p></div><button type="button" onClick={() => setReshootItemKey(null)} aria-label="关闭重拍窗口" className="text-text-tertiary"><X size={18} /></button></div>
            <div className="mt-4 flex gap-3 rounded-xl bg-surface-subtle p-3"><img src={reshootItem.asset.url} alt="待重拍素材" className="h-20 w-20 rounded-lg object-cover" /><div className="min-w-0 text-[13px]"><div className="text-[12px] text-text-tertiary">原拍摄要求</div><p className="mt-1 leading-5 text-text-main">{reshootItem.subItem.requirement}</p></div></div>
            <label className="mt-4 block text-[13px] font-medium text-text-main">本次重拍要求</label>
            <div className="mt-2 flex flex-wrap gap-2">{RESHOOT_REASONS.map(reason => <button key={reason} type="button" onClick={() => setReshootDraftReason(reason)} className="rounded-full border border-border-default px-2.5 py-1 text-[12px] text-text-secondary hover:border-border-strong">{reason}</button>)}</div>
            <textarea value={reshootDraftReason} onChange={event => setReshootDraftReason(event.target.value)} rows={3} placeholder="说明哪里不符合、需要如何重拍" className="mt-2 w-full resize-none rounded-lg border border-border-default px-3 py-2 text-[13px] outline-none focus:border-border-strong" />
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50 p-3 text-[12px] leading-5 text-violet-800"><Bot size={15} className="mt-0.5 shrink-0" /><span>执行者再次回传后，AI 将同时按“原拍摄要求 + 本次重拍要求”自动复核是否满足；不满足会继续标记异常，再交由你决定。</span></div>
            <div className="mt-5 flex items-center justify-between"><select value={replacementExecutor} onChange={event => setReplacementExecutor(event.target.value)} className="rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] text-text-secondary"><option>保持原执行人</option><option>改派备用员工</option><option>改派备用KOC</option></select><div className="flex gap-2"><button type="button" onClick={() => setReshootItemKey(null)} className="rounded-lg border border-border-default px-4 py-2 text-[13px] text-text-secondary">取消</button><button type="button" onClick={confirmSingleReshoot} className="flex items-center gap-1 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white">确认重拍要求<ChevronRight size={13} /></button></div></div>
          </div>
        </div>
      ) : null}

      {showReviewConfirmation ? (
        <div className="fixed inset-0 z-[310] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="material-review-confirm-title">
          <div className="w-full max-w-md rounded-2xl border border-border-default bg-surface-1 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><h3 id="material-review-confirm-title" className="text-[16px] font-semibold text-text-main">确认完成本次审核？</h3><p className="mt-1 text-[13px] leading-5 text-text-tertiary">通过素材将准备完成并进入待发布；需补拍项将自动回到执行任务中。</p></div>
              <button type="button" onClick={() => setShowReviewConfirmation(false)} aria-label="关闭确认窗口" className="text-text-tertiary hover:text-text-main"><X size={18} /></button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-emerald-50 p-3 text-center"><div className="text-[20px] font-semibold text-emerald-700">{counts.accepted}</div><div className="mt-1 text-[12px] text-emerald-700">通过并入库</div></div>
              <div className="rounded-xl bg-rose-50 p-3 text-center"><div className="text-[20px] font-semibold text-rose-700">{counts.reshoot}</div><div className="mt-1 text-[12px] text-rose-700">退回补拍</div></div>
            </div>
            <p className="mt-4 rounded-xl bg-surface-subtle p-3 text-[12px] leading-5 text-text-secondary">通过素材将进入素材中心；笔记级必拍素材会同时绑定当前笔记。补拍项继续沿原素材任务执行。</p>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowReviewConfirmation(false)} className="rounded-lg border border-border-default px-4 py-2 text-[13px] text-text-secondary">返回检查</button><button type="button" onClick={submitReview} className="rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white">确认流转</button></div>
          </div>
        </div>
      ) : null}

      {notice ? <div className="fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2.5 text-[13px] text-white shadow-xl">{notice}</div> : null}
    </div>
  );
}
