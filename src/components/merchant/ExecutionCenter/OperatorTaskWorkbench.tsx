import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bot, Camera, Check,
  CheckCircle2, Clock, Info, Search, Send, ShieldCheck, X
} from 'lucide-react';
import type { ExecutionAction } from '../../../data/unifiedStore';
import type { ExecutionTask, LibraryMaterialItem, MaterialSubItem } from './types';
import { getProjectLibraryMaterials, MOCK_STAFF_MEMBERS } from './materialMockData';
import { formatChineseDate } from '../../../utils/formatDate';

interface OperatorTaskWorkbenchProps {
  task: ExecutionTask;
  categoryQueue: ExecutionTask[];
  initialAction?: ExecutionAction;
  onSelectTask: (task: ExecutionTask) => void;
  onBack: () => void;
  workspaceNavigation?: React.ReactNode;
  onUpdateTask: (task: ExecutionTask) => void;
  onNextTask?: () => void;
}

type WorkbenchMode = ExecutionAction | 'publish_confirm' | 'progress';

function getWorkbenchMode(task: ExecutionTask, initialAction?: ExecutionAction): WorkbenchMode {
  if (initialAction) return initialAction;
  if (task.actionType) return task.actionType;
  if (!task.isMeWaiting && task.status !== '已完成') return 'progress';
  if (task.operatorCategory === 'content') return 'edit_content';
  if (task.operatorCategory === 'material') {
    return task.materialType === 'matched_library_asset' ? 'replace_material' : 'review_material';
  }
  if (task.operatorCategory === 'publish') return 'publish_confirm';
  return 'handle_publish_error';
}

function getAnomalyOptions(task: ExecutionTask) {
  return [
    '人工确认已发布',
    '发送催办',
    '中止发布'
  ];
}


function ManualPublishFlow({ task }: { task: ExecutionTask }) {
  const steps = ['内容就绪', '已通知', '已领取', '待发布', '已回传'];
  const currentIndex = task.returnedData?.publishUrl ? 4 : task.publishStage === '待发布' || task.anomalyType === 'publish_overdue' ? 3 : 2;
  return (
    <div className="mt-3 border-t border-border-default pt-3">
      <div className="flex flex-wrap items-center gap-2 text-[13px]" aria-label="人工发布流程">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <span className={index === currentIndex ? 'font-semibold text-text-main' : index < currentIndex ? 'text-emerald-700' : 'text-text-tertiary'}>{step}</span>
            {index < steps.length - 1 ? <span className="h-px w-7 bg-border-strong" /> : null}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-text-tertiary">系统只负责发送笔记包、提醒、换人、改期和回传核验，不会代替人工发布。</p>
    </div>
  );
}

export function OperatorTaskWorkbench({
  task,
  categoryQueue,
  initialAction,
  onSelectTask,
  onBack,
  workspaceNavigation,
  onUpdateTask,
  onNextTask
}: OperatorTaskWorkbenchProps) {
  const [mode, setMode] = useState<WorkbenchMode>(() => getWorkbenchMode(task, initialAction));
  const [feedback, setFeedback] = useState('');
  
  // State for content edit
  const [draftTitle, setDraftTitle] = useState(task.draftTitle || '');
  const [draftBody, setDraftBody] = useState(task.draftBody || '');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  
  // State for material selection
  const [libraryMaterials] = useState<LibraryMaterialItem[]>(getProjectLibraryMaterials());
  const [selectedMaterials, setSelectedMaterials] = useState<LibraryMaterialItem[]>(task.selectedMaterialAssets || []);
  
  // State for material tasks
  const [taskRequirement, setTaskRequirement] = useState(task.reasonForIntervention || '');
  const [assignee, setAssignee] = useState(MOCK_STAFF_MEMBERS[0].name);
  const [taskDeadline, setTaskDeadline] = useState('今天 18:00');
  
  // State for publish
  const [publishUrl, setPublishUrl] = useState(task.returnedData?.publishUrl || '');
  
  // State for anomalies
  const [resolution, setResolution] = useState(getAnomalyOptions(task)[0]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [replacementPublisher, setReplacementPublisher] = useState('备用KOC_小丸子');
  
  // Sidebar logic
  const [queueQuery, setQueueQuery] = useState('');

  const isMaterialFollowUp = task.operatorCategory === 'material' && task.materialType !== 'matched_library_asset';
  
  const queue = useMemo(() => categoryQueue.filter(item => {
    if (initialAction === 'handle_publish_error' || task.operatorCategory === 'anomaly') {
      return item.isAnomaly;
    }
    return item.operatorCategory === task.operatorCategory;
  }), [categoryQueue, task.operatorCategory, initialAction, task.isAnomaly]);
  
  useEffect(() => {
    setMode(getWorkbenchMode(task, initialAction));
    setResolution(getAnomalyOptions(task)[0]);
    setResolutionNote('');
  }, [task, initialAction]);


  const isComplete = task.status === '已完成';

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2400);
  };

  const completeTask = (updates: Partial<ExecutionTask>, message: string) => {
    const completedAction = ['edit_content', 'replace_material', 'create_material_task', 'view_material_task', 'review_material', 'handle_publish_error'].includes(mode)
      ? mode as ExecutionAction
      : task.actionType;
    onUpdateTask({
      ...task,
      ...updates,
      actionType: completedAction,
      status: '已完成',
      isMeWaiting: false,
      waitingRole: 'completed',
      waitingParty: '已完成',
      timelineEvents: [
        ...task.timelineEvents,
        { id: `finish-${Date.now()}`, time: '刚刚', actor: '操盘手', action: message }
      ]
    });
    if (onNextTask) {
      showFeedback(`${message}，准备进入下一个任务`);
      window.setTimeout(onNextTask, 600);
    } else {
      showFeedback(`${message}，全部处理完毕`);
    }
  };

  const toggleMaterial = (material: LibraryMaterialItem) => {
    setSelectedMaterials(previous => previous.some(item => item.id === material.id)
      ? previous.filter(item => item.id !== material.id)
      : [...previous, material]
    );
  };

  const [materialItems, setMaterialItems] = useState(task.materialSubItems || []);
  const updateMaterialStatus = (id: string, newStatus: MaterialSubItem['manualStatus'], reason?: string) => {
    setMaterialItems(prev => prev.map(item => item.id === id ? { ...item, manualStatus: newStatus, reshootReason: reason } : item));
  };
  
  const resolveAnomaly = () => {
    const isPublishAnomaly = task.anomalyType === 'publish_overdue' || task.anomalyType === 'executor_account_unavailable';
    
    if (!isPublishAnomaly) {
      completeTask({ anomalyReason: `${resolution}${resolutionNote ? `：${resolutionNote}` : ''}`, isAnomaly: false, isBlocked: false }, '已确认异常处理方案');
      return;
    }
    
    if (resolution === '人工确认已发布') {
      onUpdateTask({
        ...task,
        status: '执行中',
        actionType: undefined,
        operatorCategory: 'publish',
        categoryLabel: '发布与回传',
        isAnomaly: false,
        anomalyReason: undefined,
        isBlocked: false,
        isMeWaiting: false,
        isTeamExecuting: true,
        publishStage: '已回传',
        currentOccurrence: '操盘手已人工确认发布成功。',
        returnedData: {
           ...task.returnedData,
           publishUrl: task.returnedData?.publishUrl || 'https://xhslink.com/manual-confirm'
        },
        timelineEvents: [
          ...task.timelineEvents,
          { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: '人工确认已发布' }
        ]
      });
      showFeedback('已确认该任务发布成功');
      return;
    }

    const stopped = resolution === '中止发布';
    const actionMessage = resolution;
    
    onUpdateTask({
      ...task,
      actionType: undefined,
      operatorCategory: stopped ? task.operatorCategory : 'publish',
      categoryLabel: stopped ? task.categoryLabel : '发布与回传',
      status: stopped ? '已取消' : '执行中',
      isAnomaly: false,
      anomalyReason: `${actionMessage}${resolutionNote ? `：${resolutionNote}` : ''}`,
      isBlocked: false,
      isMeWaiting: false,
      isTeamExecuting: !stopped,
      isSystemProcessing: false,
      waitingRole: stopped ? 'completed' : 'team',
      waitingParty: stopped ? '本轮已停止' : task.targetAccount,
      publishStage: stopped ? task.publishStage : '待发布',
      currentOccurrence: stopped
        ? '已中止该发布任务，该笔记重新释放回待领取笔记池。'
        : `已发送催办，等待账号所有者操作。`,
      timelineEvents: [
        ...task.timelineEvents,
        { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: actionMessage }
      ]
    });
    showFeedback(stopped ? '已中止发布并释放笔记名额' : `已发送催办提醒`);
  };

  const filteredQueue = queue.filter(item => {
    // 隐藏未领取的任务（例如待领取且没有 assignee 的情况）
    if (item.publishStage === '待领取' || !item.assignee?.name) {
      return false;
    }
    const query = queueQuery.trim().toLowerCase();
    return !query || [item.noteTitle, item.targetAccount, item.projectName]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query));
  }).sort((a, b) => {
    const score = (label: string | undefined) => {
      if (label === '已逾期') return 4;
      if (label === '今日到期') return 3;
      if (label === '即将到期') return 2;
      return 1;
    };
    return score(b.deadlineLabel) - score(a.deadlineLabel);
  });
  
  const isPublishWorkbench = mode === 'publish_confirm' || mode === 'handle_publish_error';

  const renderMaterialSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border-default bg-surface-subtle px-4 py-3">
        <div>
          <div className="text-[13px] font-semibold text-text-main">已选 {selectedMaterials.length} 张</div>
          <div className="text-[13px] text-text-tertiary mt-0.5">第一张作为封面；推荐结果需人工确认，不会自动写入笔记。</div>
        </div>
        <span className="text-[13px] rounded-md border border-border-default bg-surface-1 px-2 py-1 text-text-secondary">建议 3–6 张</span>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {libraryMaterials.map(material => {
          const selected = selectedMaterials.some(item => item.id === material.id);
          return (
            <button key={material.id} onClick={() => toggleMaterial(material)} className={`text-left overflow-hidden rounded-xl border bg-surface-1 transition-all ${selected ? 'border-neutral-900 ring-1 ring-neutral-900/10' : 'border-border-default hover:border-border-strong'}`}>
              <div className="relative h-32 bg-surface-subtle">
                <img src={material.url} alt={material.title} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-neutral-950/80 px-2 py-0.5 text-[13px] text-white">匹配 {material.matchScore}%</span>
                {selected && <span className="absolute right-2 top-2 rounded-full bg-neutral-950 p-1 text-white"><Check size={12} /></span>}
              </div>
              <div className="p-3">
                <div className="truncate text-[13px] font-medium text-text-main">{material.title}</div>
                <div className="mt-1 text-[13px] text-text-tertiary">{material.category} · {material.source}</div>
              </div>
            </button>
          );
        })}
      </div>
      <PrimaryAction
        label={`确认采用 ${selectedMaterials.length} 张素材`}
        hint="确认后素材才会写入当前笔记；不会影响其他已生成或已发布内容。"
        disabled={selectedMaterials.length === 0}
        onClick={() => completeTask({ selectedMaterialAssets: selectedMaterials, selectedCoverUrl: selectedMaterials[0]?.url }, '已确认笔记素材选择')}
      />
    </div>
  );

  const renderCreateMaterialTask = () => (
    <div className="space-y-4 max-w-2xl">
      <label className="block space-y-1.5">
        <span className="text-[13px] font-medium text-text-secondary">需要补拍什么</span>
        <textarea value={taskRequirement} onChange={event => setTaskRequirement(event.target.value)} rows={5} className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[13px] leading-6 outline-none focus:border-border-strong" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-[13px] font-medium text-text-secondary">执行人</span>
          <select value={assignee} onChange={event => setAssignee(event.target.value)} className="w-full rounded-xl border border-border-default bg-surface-1 px-3 py-2.5 text-[13px] outline-none">
            {MOCK_STAFF_MEMBERS.map(member => <option key={member.id}>{member.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[13px] font-medium text-text-secondary">截止日期</span>
          <select value={taskDeadline} onChange={event => setTaskDeadline(event.target.value)} className="w-full rounded-xl border border-border-default bg-surface-1 px-3 py-2.5 text-[13px] outline-none">
            <option>明天 18:00</option>
            <option>后天 18:00</option>
            <option>3天后 18:00</option>
          </select>
        </label>
      </div>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-[13px] text-blue-900">下发后该事项进入“执行动态”，等待素材回传期间不会继续占用操盘手待办。</div>
      <PrimaryAction
        label="下发素材任务"
        hint={`将任务发送给 ${assignee}，回传后再进入素材验收。`}
        disabled={!taskRequirement.trim() || !assignee || !taskDeadline}
        onClick={() => completeTask({
          generatedMaterialTasks: [...(task.generatedMaterialTasks || []), { id: `shoot-${Date.now()}`, requirement: taskRequirement, assignee, deadline: taskDeadline, status: '已派发' }]
        }, '已下发素材任务，等待执行人回传')}
      />
    </div>
  );

  const renderMaterialReview = () => (
    <div className="space-y-3">
      {materialItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong bg-surface-subtle px-4 py-10 text-center">
          <Camera size={24} className="mx-auto text-text-tertiary" />
          <div className="mt-2 text-[13px] font-medium text-text-main">素材还在执行或等待回传</div>
          <div className="mt-1 text-[13px] text-text-tertiary">当前不需要操盘手判断，可在执行动态中查看进度。</div>
        </div>
      ) : materialItems.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border-default bg-surface-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-semibold text-text-main">镜头 {index + 1} · {item.requirement}</div>
              <div className="mt-1 text-[13px] text-text-tertiary">系统预检：{item.autoCheckResult}</div>
            </div>
            <span className={`shrink-0 rounded-md px-2 py-1 text-[13px] ${item.manualStatus === '已通过' ? 'bg-emerald-50 text-emerald-800' : item.manualStatus === '需补拍' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>{item.manualStatus}</span>
          </div>
          {item.uploadedAssets.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {item.uploadedAssets.map(asset => <img key={asset.id} src={asset.url} alt={asset.filename} className="h-28 w-36 rounded-lg border border-border-default object-cover" />)}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button onClick={() => updateMaterialStatus(item.id, '已通过')} className="rounded-lg bg-neutral-950 px-3 py-1.5 text-[13px] font-medium text-white">验收通过</button>
            <button onClick={() => updateMaterialStatus(item.id, '需补拍')} className="rounded-lg border border-border-default bg-surface-1 px-3 py-1.5 text-[13px] font-medium text-text-secondary">要求补拍</button>
          </div>
        </div>
      ))}
      {materialItems.length > 0 && (
        <PrimaryAction
          label="完成本次素材验收"
          hint="需要补拍的镜头回到执行动态；全部通过后才会计入笔记素材。"
          disabled={materialItems.some(item => item.manualStatus === '待验收')}
          onClick={() => completeTask({ materialSubItems: materialItems }, materialItems.some(item => item.manualStatus === '需补拍') ? '已提交验收结果并下发补拍' : '素材已全部验收通过')}
        />
      )}
    </div>
  );

  const renderPublish = () => (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-xl border border-border-default bg-surface-1 p-4 space-y-2 text-[13px]">
        <div className="flex justify-between"><span className="text-text-tertiary">发布账号</span><strong>{task.publisherName || task.targetAccount}</strong></div>
        <div className="flex justify-between"><span className="text-text-tertiary">发布方式</span><strong>{task.publishType || '账号手动发布'}</strong></div>
        <div className="flex justify-between"><span className="text-text-tertiary">发布计划</span><strong>{formatChineseDate(task.publishContent?.scheduleTime || task.deadline, true) || task.publishContent?.scheduleTime || task.deadline || '待确认'}</strong></div>
      </div>
      <PrimaryAction
        label="推送通知提醒执行"
        hint="系统将向发布账号发送执行通知提醒，任务继续处于执行中，等待其最终操作回传。"
        disabled={false}
        onClick={() => {
            onUpdateTask({
                ...task,
                timelineEvents: [
                    ...task.timelineEvents,
                    { id: `remind-${Date.now()}`, time: '刚刚', actor: '操盘手', action: `催促 ${task.publisherName || task.targetAccount} 尽快执行发布` }
                ]
            });
            showFeedback(`已向 ${task.publisherName || task.targetAccount} 推送提醒`);
        }}
      />
    </div>
  );
  const renderAnomaly = () => {
    const finalOptions = getAnomalyOptions(task);
    
    let buttonLabel = '确认操作';
    let hint = '';
    if (resolution === '人工确认已发布') {
      buttonLabel = '确认已发布';
      hint = '人工确认后将直接进入已回传状态并流转至下一步。';
    } else if (resolution === '发送催办') {
      buttonLabel = '确认发送催办';
      hint = '系统将通过已绑定的微信或企微向账号所有者下发催办指令。';
    } else if (resolution === '中止发布') {
      buttonLabel = '确认中止并释放';
      hint = '中止后，该用户已领取的任务将被回收，释放后供其他人再次领取。';
    }

    return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        {finalOptions.map(option => (
          <button key={option} onClick={() => setResolution(option)} className={`w-full rounded-xl border p-3 text-left text-[13px] ${resolution === option ? 'border-neutral-900 bg-surface-subtle' : 'border-border-default bg-surface-1'}`}>
            <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border ${resolution === option ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-border-strong'}`}>{resolution === option && <Check size={10} />}</span>
            {option}
          </button>
        ))}
      </div>
      
      <textarea value={resolutionNote} onChange={event => setResolutionNote(event.target.value)} rows={4} placeholder="补充处理说明（选填）" className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[13px] outline-none" />
      <PrimaryAction
        label={buttonLabel}
        hint={hint}
        onClick={resolveAnomaly}
      />
    </div>
  );
  };

  const renderProgress = () => (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="text-[13px] font-semibold text-blue-900">当前由 {task.waitingParty} 处理中</div>
        <p className="mt-1.5 text-[13px] leading-5 text-blue-800">{task.currentOccurrence}</p>
      </div>
      <div className="rounded-xl border border-border-default bg-surface-1 p-4">
        <div className="text-[13px] font-semibold text-text-main">最近进度</div>
        <div className="mt-3 space-y-3">
          {task.timelineEvents.slice().reverse().map(event => (
            <div key={event.id} className="flex gap-3 text-[13px]"><span className="w-28 shrink-0 text-text-tertiary">{formatChineseDate(event.time, true) || event.time}</span><span className="text-text-secondary">{event.actor} · {event.action}</span></div>
          ))}
        </div>
      </div>
      <button onClick={onBack} className="rounded-lg border border-border-default bg-surface-1 px-4 py-2 text-[13px] font-medium text-text-secondary">返回执行动态</button>
    </div>
  );

  const renderWorkbench = () => {
    if (isComplete) return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
        <div className="mt-3 text-[15px] font-semibold text-emerald-900">当前操作已完成</div>
        <div className="mt-1 text-[13px] text-emerald-800">{task.nextStepAfterAction}</div>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={onBack} className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-[13px] font-medium text-emerald-900">返回执行中心</button>
          {onNextTask && <button onClick={onNextTask} className="rounded-lg bg-emerald-700 px-4 py-2 text-[13px] font-medium text-white">处理下一项</button>}
        </div>
      </div>
    );
    if (mode === 'edit_content') return renderWorkbench();
    if (mode === 'replace_material') return renderMaterialSelection();
    if (mode === 'create_material_task') return renderCreateMaterialTask();
    if (mode === 'review_material' || mode === 'view_material_task') return renderMaterialReview();
    if (mode === 'publish_confirm') return renderPublish();
    if (mode === 'handle_publish_error') return renderAnomaly();
    return renderProgress();
  };

  return (
    <div className="workspace-shell execution-workspace flex h-full min-h-0 flex-1 flex-col bg-canvas">
      <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">{workspaceNavigation ?? <button onClick={onBack} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg hover:text-text-main" aria-label="返回执行中心"><ArrowLeft size={17} /></button>}</div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="workspace-sidebar hidden w-[320px] shrink-0 overflow-hidden border-r border-border-default bg-surface-1 lg:flex lg:flex-col">
          <div className="workspace-sidebar-header space-y-3 border-b border-border-default">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">{mode === 'progress' ? '执行进展' : isMaterialFollowUp ? '待跟进素材任务' : '待处理发布任务'}</h2>
              <span className="text-[13px] text-text-tertiary">{filteredQueue.length} 项</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input value={queueQuery} onChange={(event) => setQueueQuery(event.target.value)} placeholder="搜索笔记或账号..." className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-[320px]">
            {filteredQueue.map(item => {
              const selected = item.id === task.id;
              return (
                <button key={item.id} onClick={() => onSelectTask(item)} className={`w-full text-left px-4 py-3.5 transition-colors border-b border-border-subtle relative ${selected ? 'bg-surface-subtle' : 'bg-transparent hover:bg-hover-bg text-text-main'}`}>
                  {selected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />}
                  <div className={`text-[13px] line-clamp-1 ${selected ? 'font-semibold text-text-main' : 'font-medium text-text-main'}`}>{item.noteTitle}</div>
                  
                  {/* METADATA LINE: Task Format, Assignee, Anomaly, Stalled Duration */}
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
                      <span className={`shrink-0 rounded px-1.5 py-0.5 font-medium ${item.accountType === '品牌主号' ? 'bg-blue-50 text-blue-700' : item.accountType === 'KOC' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'}`}>
                        {item.accountType || '未知账号'}
                      </span>
                      <span className="truncate">
                        领取人：{item.assignee?.name || '未知'}
                      </span>
                    </div>

                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="workspace-stage min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl space-y-4">
            {mode === 'progress' ? (
              <section className="workspace-surface workspace-context rounded-xl border border-border-default bg-surface-1 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-medium text-text-tertiary">当前执行任务</div>
                    <div className="mt-1 text-[14px] font-semibold text-text-main">{task.operatorActionSummary}</div>
                    <div className="mt-1 text-[13px] text-text-secondary">{task.currentOccurrence}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {task.publishExecutorType && <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[13px] font-medium text-blue-700">{task.publishExecutorType}</span>}
                    {task.publishStage && <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[13px] font-medium text-amber-800">{task.publishStage}</span>}
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 border-t border-border-default pt-3 text-[13px] text-text-tertiary"><ArrowRight size={13} className="mt-0.5 shrink-0" /><span>下一步：{task.nextStepAfterAction}</span></div>
                {isPublishWorkbench ? <ManualPublishFlow task={task} /> : null}
              </section>
            ) : (
              <section className="workspace-surface workspace-context rounded-xl border border-border-default bg-surface-1 p-4 mb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-bold text-text-main truncate">{task.noteTitle}</h3>
                    <div className="mt-1 flex items-center gap-2 text-[13px] text-text-tertiary">
                      <span>所属项目：{task.projectName}</span>
                    </div>
                  </div>
                  <button className="shrink-0 rounded bg-brand-logo px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-brand-logo/90">查看笔记详情</button>
                </div>
                <div className="mt-4 rounded-lg bg-surface-subtle p-3">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <div className="text-[12px] text-text-tertiary">账号/领取人</div>
                      <div className="mt-1 text-[13px] font-medium text-text-main">{task.assignee?.name || task.targetAccount || '未知'}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-text-tertiary">认领/分配时间</div>
                      <div className="mt-1 text-[13px] font-medium text-text-main">{task.assignee?.claimTime || task.assignee?.assignedTime || '未知'}</div>
                    </div>
                    {task.deadline && (
                      <div>
                        <div className="text-[12px] text-text-tertiary">最晚发布时间</div>
                        <div className="mt-1 text-[13px] font-medium text-text-main">{task.deadline}</div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
            {renderWorkbench()}
          </div>
        </main>

      </div>

      {feedback && <div className="fixed bottom-5 left-1/2 z-[300] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2.5 text-[13px] text-white shadow-xl">{feedback}</div>}
    </div>
  );
}

function PrimaryAction({ label, hint, disabled, onClick }: { label: string; hint: string; disabled?: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-default bg-surface-1 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[13px] leading-5 text-text-tertiary">{hint}</div>
      <button disabled={disabled} onClick={onClick} className="shrink-0 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-35">{label}</button>
    </div>
  );
}
