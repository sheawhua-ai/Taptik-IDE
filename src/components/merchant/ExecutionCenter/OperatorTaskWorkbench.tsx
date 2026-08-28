import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bot, Camera, Check,
  CheckCircle2, Clock, Info, Send, ShieldCheck, X
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
  if (task.anomalyType === 'publish_overdue') {
    return ['催促当前发布人', '更换发布人后继续', '调整发布排期', '本轮不再继续'];
  }
  if (task.anomalyType === 'executor_account_unavailable') {
    return ['更换执行人或账号后继续', '调整发布排期', '本轮不再继续'];
  }
  return ['重新执行并保留当前方案', '更换执行人或账号后继续', '本轮不再继续'];
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
  const mode = getWorkbenchMode(task, initialAction);
  const isMaterialFollowUp = task.anomalyType === 'material_reshoot_overdue';
  const [showContext, setShowContext] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.draftTitle || task.noteTitle || '');
  const [draftBody, setDraftBody] = useState(task.draftBody || '');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [newTag, setNewTag] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<LibraryMaterialItem[]>(task.selectedMaterialAssets || []);
  const [materialItems, setMaterialItems] = useState<MaterialSubItem[]>(task.materialSubItems || []);
  const [taskRequirement, setTaskRequirement] = useState(task.materialSubItems?.[0]?.requirement || '补齐笔记所需的真实使用场景与产品细节素材');
  const [assignee, setAssignee] = useState(MOCK_STAFF_MEMBERS[0]?.name || '待指定');
  const [taskDeadline, setTaskDeadline] = useState('明天 18:00');
  const [publishUrl, setPublishUrl] = useState(task.returnedData?.publishUrl || '');
  const [resolution, setResolution] = useState(() => getAnomalyOptions(task)[0]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [replacementPublisher, setReplacementPublisher] = useState('备用KOC_小丸子');
  const [agentQuestion, setAgentQuestion] = useState('');
  const [agentAnswer, setAgentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setShowContext(false);
    setDraftTitle(task.draftTitle || task.noteTitle || '');
    setDraftBody(task.draftBody || '');
    setTags(task.tags || []);
    setNewTag('');
    setSelectedMaterials(task.selectedMaterialAssets || []);
    setMaterialItems(task.materialSubItems || []);
    setTaskRequirement(task.materialSubItems?.[0]?.requirement || '补齐笔记所需的真实使用场景与产品细节素材');
    setAssignee(MOCK_STAFF_MEMBERS[0]?.name || '待指定');
    setTaskDeadline('明天 18:00');
    setPublishUrl(task.returnedData?.publishUrl || '');
    setResolution(getAnomalyOptions(task)[0]);
    setResolutionNote('');
    setReplacementPublisher('备用KOC_小丸子');
    setAgentQuestion('');
    setAgentAnswer('');
  }, [task.id]);

  const libraryMaterials = useMemo(() => {
    return getProjectLibraryMaterials(task.projectId).slice(0, 6);
  }, [task.projectId]);

  const queue = categoryQueue.filter(item =>
    item.status !== '已完成' &&
    item.status !== '已取消' &&
    (!isMaterialFollowUp || item.anomalyType === 'material_reshoot_overdue') &&
    (mode === 'progress' ? !item.isMeWaiting : item.isMeWaiting)
  );
  const projectGroups = useMemo(() => {
    const groups = new Map<string, { projectId: string; projectName: string; tasks: ExecutionTask[] }>();
    queue.forEach(item => {
      const current = groups.get(item.projectId);
      if (current) current.tasks.push(item);
      else groups.set(item.projectId, { projectId: item.projectId, projectName: item.projectName, tasks: [item] });
    });
    return Array.from(groups.values());
  }, [queue]);
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
        { id: `done-${Date.now()}`, time: '刚刚', actor: '操盘手', action: message }
      ]
    });
    showFeedback(message);
  };

  const resolveAnomaly = () => {
    const isPublishAnomaly = task.anomalyType === 'publish_overdue' || task.anomalyType === 'executor_account_unavailable';
    if (!isPublishAnomaly) {
      completeTask({ anomalyReason: `${resolution}${resolutionNote ? `：${resolutionNote}` : ''}`, isAnomaly: false, isBlocked: false }, '已确认异常处理方案');
      return;
    }

    const stopped = resolution === '本轮不再继续';
    const changedPublisher = resolution.includes('更换');
    const nextPublisher = changedPublisher ? replacementPublisher : task.targetAccount;
    const actionMessage = changedPublisher
      ? `已更换发布人：${nextPublisher}`
      : resolution === '催促当前发布人'
      ? `已催促当前发布人：${task.targetAccount}`
      : resolution;

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
      waitingParty: stopped ? '本轮已停止' : nextPublisher,
      publishStage: stopped ? task.publishStage : '待发布',
      currentOccurrence: stopped
        ? '操盘手已决定本轮不再继续发布。'
        : `${actionMessage}，任务已恢复到执行动态，等待手动发布与链接回传。`,
      timelineEvents: [
        ...task.timelineEvents,
        { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: actionMessage }
      ]
    });
    showFeedback(stopped ? '本轮发布任务已停止' : `${actionMessage}，已恢复执行`);
  };

  const toggleMaterial = (material: LibraryMaterialItem) => {
    setSelectedMaterials(previous => previous.some(item => item.id === material.id)
      ? previous.filter(item => item.id !== material.id)
      : [...previous, material]);
  };

  const updateMaterialStatus = (id: string, status: MaterialSubItem['manualStatus']) => {
    setMaterialItems(previous => previous.map(item => item.id === id ? { ...item, manualStatus: status } : item));
  };

  const renderContentWorkbench = () => (
    <div className="space-y-4">
      {task.complianceRisk && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex gap-2.5 text-[12px] text-amber-900">
          <ShieldCheck size={16} className="shrink-0 mt-0.5" />
          <div><strong>确认前需处理：</strong>{task.complianceRisk}</div>
        </div>
      )}
      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-text-secondary">标题</span>
        <input value={draftTitle} onChange={event => setDraftTitle(event.target.value)} className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-2.5 text-[13px] text-text-main outline-none focus:border-border-strong" />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-text-secondary">正文</span>
        <textarea value={draftBody} onChange={event => setDraftBody(event.target.value)} rows={12} className="w-full resize-none rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[13px] leading-6 text-text-main outline-none focus:border-border-strong" />
      </label>
      <div className="space-y-2">
        <div className="text-[12px] font-medium text-text-secondary">标签</div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button key={tag} onClick={() => setTags(tags.filter(item => item !== tag))} className="rounded-lg border border-border-default bg-surface-subtle px-2.5 py-1.5 text-[11.5px] text-text-secondary">#{tag} ×</button>
          ))}
          <div className="flex items-center gap-1">
            <input value={newTag} onChange={event => setNewTag(event.target.value)} placeholder="新增标签" className="w-24 rounded-lg border border-border-default px-2.5 py-1.5 text-[11.5px] outline-none" />
            <button onClick={() => { if (newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag(''); } }} className="rounded-lg bg-surface-subtle border border-border-default px-2.5 py-1.5 text-[11.5px]">添加</button>
          </div>
        </div>
      </div>
      <PrimaryAction
        label="确认内容并继续"
        hint="确认后重新检查素材完整度；素材齐全才会进入待发笔记池。"
        disabled={!draftTitle.trim() || !draftBody.trim() || tags.length === 0}
        onClick={() => completeTask({ draftTitle, draftBody, tags }, '已确认内容，进入下一项完整度检查')}
      />
    </div>
  );

  const renderMaterialSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border-default bg-surface-subtle px-4 py-3">
        <div>
          <div className="text-[12.5px] font-semibold text-text-main">已选 {selectedMaterials.length} 张</div>
          <div className="text-[11.5px] text-text-tertiary mt-0.5">第一张作为封面；推荐结果需人工确认，不会自动写入笔记。</div>
        </div>
        <span className="text-[11px] rounded-md border border-border-default bg-surface-1 px-2 py-1 text-text-secondary">建议 3–6 张</span>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {libraryMaterials.map(material => {
          const selected = selectedMaterials.some(item => item.id === material.id);
          return (
            <button key={material.id} onClick={() => toggleMaterial(material)} className={`text-left overflow-hidden rounded-xl border bg-surface-1 transition-all ${selected ? 'border-neutral-900 ring-1 ring-neutral-900/10' : 'border-border-default hover:border-border-strong'}`}>
              <div className="relative h-32 bg-surface-subtle">
                <img src={material.url} alt={material.title} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-neutral-950/80 px-2 py-0.5 text-[10px] text-white">匹配 {material.matchScore}%</span>
                {selected && <span className="absolute right-2 top-2 rounded-full bg-neutral-950 p-1 text-white"><Check size={12} /></span>}
              </div>
              <div className="p-3">
                <div className="truncate text-[12px] font-medium text-text-main">{material.title}</div>
                <div className="mt-1 text-[10.5px] text-text-tertiary">{material.category} · {material.source}</div>
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
        <span className="text-[12px] font-medium text-text-secondary">需要补拍什么</span>
        <textarea value={taskRequirement} onChange={event => setTaskRequirement(event.target.value)} rows={5} className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[13px] leading-6 outline-none focus:border-border-strong" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-[12px] font-medium text-text-secondary">执行人</span>
          <select value={assignee} onChange={event => setAssignee(event.target.value)} className="w-full rounded-xl border border-border-default bg-surface-1 px-3 py-2.5 text-[12.5px] outline-none">
            {MOCK_STAFF_MEMBERS.map(member => <option key={member.id}>{member.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[12px] font-medium text-text-secondary">截止日期</span>
          <select value={taskDeadline} onChange={event => setTaskDeadline(event.target.value)} className="w-full rounded-xl border border-border-default bg-surface-1 px-3 py-2.5 text-[12.5px] outline-none">
            <option>明天 18:00</option>
            <option>后天 18:00</option>
            <option>3天后 18:00</option>
          </select>
        </label>
      </div>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-[12px] text-blue-900">下发后该事项进入“执行动态”，等待素材回传期间不会继续占用操盘手待办。</div>
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
          <div className="mt-1 text-[11.5px] text-text-tertiary">当前不需要操盘手判断，可在执行动态中查看进度。</div>
        </div>
      ) : materialItems.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border-default bg-surface-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[12.5px] font-semibold text-text-main">镜头 {index + 1} · {item.requirement}</div>
              <div className="mt-1 text-[11.5px] text-text-tertiary">系统预检：{item.autoCheckResult}</div>
            </div>
            <span className={`shrink-0 rounded-md px-2 py-1 text-[10.5px] ${item.manualStatus === '已通过' ? 'bg-emerald-50 text-emerald-800' : item.manualStatus === '需补拍' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>{item.manualStatus}</span>
          </div>
          {item.uploadedAssets.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {item.uploadedAssets.map(asset => <img key={asset.id} src={asset.url} alt={asset.filename} className="h-28 w-36 rounded-lg border border-border-default object-cover" />)}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button onClick={() => updateMaterialStatus(item.id, '已通过')} className="rounded-lg bg-neutral-950 px-3 py-1.5 text-[11.5px] font-medium text-white">验收通过</button>
            <button onClick={() => updateMaterialStatus(item.id, '需补拍')} className="rounded-lg border border-border-default bg-surface-1 px-3 py-1.5 text-[11.5px] font-medium text-text-secondary">要求补拍</button>
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
      <div className="rounded-xl border border-border-default bg-surface-1 p-4 space-y-2 text-[12.5px]">
        <div className="flex justify-between"><span className="text-text-tertiary">发布账号</span><strong>{task.publisherName || task.targetAccount}</strong></div>
        <div className="flex justify-between"><span className="text-text-tertiary">发布方式</span><strong>{task.publishType || '账号手动发布'}</strong></div>
        <div className="flex justify-between"><span className="text-text-tertiary">发布计划</span><strong>{formatChineseDate(task.publishContent?.scheduleTime || task.deadline, true) || task.publishContent?.scheduleTime || task.deadline || '待确认'}</strong></div>
      </div>
      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-text-secondary">小红书笔记链接</span>
        <input value={publishUrl} onChange={event => setPublishUrl(event.target.value)} placeholder="粘贴发布后的笔记链接" className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-2.5 text-[13px] outline-none focus:border-border-strong" />
      </label>
      <PrimaryAction
        label="确认发布结果"
        hint="确认后系统提取平台笔记 ID，进入关键词收录与发布后数据回传。"
        disabled={!publishUrl.trim()}
        onClick={() => completeTask({ returnedData: { ...(task.returnedData || {}), publishUrl } }, '已确认发布链接并进入数据回传')}
      />
    </div>
  );

  const renderAnomaly = () => (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[12px] text-rose-800">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <span className="line-clamp-2">{task.anomalyReason || task.currentOccurrence}</span>
      </div>
      <div className="space-y-2">
        {getAnomalyOptions(task).map(option => (
          <button key={option} onClick={() => setResolution(option)} className={`w-full rounded-xl border p-3 text-left text-[12.5px] ${resolution === option ? 'border-neutral-900 bg-surface-subtle' : 'border-border-default bg-surface-1'}`}>
            <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border ${resolution === option ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-border-strong'}`}>{resolution === option && <Check size={10} />}</span>
            {option}
          </button>
        ))}
      </div>
      {resolution.includes('更换') && (task.anomalyType === 'publish_overdue' || task.anomalyType === 'executor_account_unavailable') && (
        <label className="block space-y-1.5 rounded-xl border border-border-default bg-surface-1 p-3">
          <span className="text-[11.5px] font-medium text-text-secondary">选择新的发布人</span>
          <select value={replacementPublisher} onChange={event => setReplacementPublisher(event.target.value)} className="w-full rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[12.5px] outline-none focus:border-border-strong">
            <option value="备用KOC_小丸子">备用KOC_小丸子</option>
            <option value="静安店李店长">静安店李店长</option>
            <option value="操盘手代发">操盘手代发</option>
          </select>
        </label>
      )}
      <textarea value={resolutionNote} onChange={event => setResolutionNote(event.target.value)} rows={4} placeholder="补充处理说明（选填）" className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[12.5px] outline-none" />
      <PrimaryAction
        label={task.anomalyType === 'publish_overdue' ? '确认并恢复发布任务' : '确认处理方案'}
        hint="只处理当前异常；如需改变后续运营逻辑，应返回方案中心进行专家定制。"
        onClick={resolveAnomaly}
      />
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="text-[12.5px] font-semibold text-blue-900">当前由 {task.waitingParty} 处理中</div>
        <p className="mt-1.5 text-[12px] leading-5 text-blue-800">{task.currentOccurrence}</p>
      </div>
      <div className="rounded-xl border border-border-default bg-surface-1 p-4">
        <div className="text-[12px] font-semibold text-text-main">最近进度</div>
        <div className="mt-3 space-y-3">
          {task.timelineEvents.slice().reverse().map(event => (
            <div key={event.id} className="flex gap-3 text-[11.5px]"><span className="w-28 shrink-0 text-text-tertiary">{formatChineseDate(event.time, true) || event.time}</span><span className="text-text-secondary">{event.actor} · {event.action}</span></div>
          ))}
        </div>
      </div>
      <button onClick={onBack} className="rounded-lg border border-border-default bg-surface-1 px-4 py-2 text-[12px] font-medium text-text-secondary">返回执行动态</button>
    </div>
  );

  const renderWorkbench = () => {
    if (isComplete) return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
        <div className="mt-3 text-[15px] font-semibold text-emerald-900">当前操作已完成</div>
        <div className="mt-1 text-[12px] text-emerald-800">{task.nextStepAfterAction}</div>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={onBack} className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-[12px] font-medium text-emerald-900">返回执行中心</button>
          {onNextTask && <button onClick={onNextTask} className="rounded-lg bg-emerald-700 px-4 py-2 text-[12px] font-medium text-white">处理下一项</button>}
        </div>
      </div>
    );
    if (mode === 'edit_content') return renderContentWorkbench();
    if (mode === 'replace_material') return renderMaterialSelection();
    if (mode === 'create_material_task') return renderCreateMaterialTask();
    if (mode === 'review_material' || mode === 'view_material_task') return renderMaterialReview();
    if (mode === 'publish_confirm') return renderPublish();
    if (mode === 'handle_publish_error') return renderAnomaly();
    return renderProgress();
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-canvas">
      <header className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">{workspaceNavigation ?? <button onClick={onBack} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg hover:text-text-main" aria-label="返回执行中心"><ArrowLeft size={17} /></button>}</div>
          <div className="flex items-center gap-2">
            {task.deadline && <span className="hidden md:flex items-center gap-1 text-[11.5px] text-text-tertiary"><Clock size={13} />{formatChineseDate(task.deadline, true) || task.deadline}</span>}
            <button onClick={() => setShowContext(!showContext)} className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium flex items-center gap-1.5 ${showContext ? 'border-neutral-900 bg-neutral-950 text-white' : 'border-border-default bg-surface-1 text-text-secondary'}`}><Info size={14} />{mode === 'progress' ? '任务详情' : '判断依据'}</button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[300px] shrink-0 overflow-y-auto border-r border-border-default bg-surface-1 lg:block">
          <div className="border-b border-border-default px-4 py-3 text-[11px] font-medium text-text-secondary">{mode === 'progress' ? '执行进展' : isMaterialFollowUp ? '待跟进素材任务' : '待处理发布任务'} <span className="ml-1 text-text-tertiary">{queue.length}</span></div>
          <div className="space-y-3 p-2">
            {projectGroups.map(group => (
              <section key={group.projectId}>
                <div className="flex items-center justify-between px-2 py-1 text-[10px] text-text-tertiary"><span className="truncate">{group.projectName}</span><span>{group.tasks.length}</span></div>
                <div className="space-y-1">
                  {group.tasks.map(item => (
                    <button key={item.id} onClick={() => onSelectTask(item)} className={`w-full rounded-xl border p-3 text-left ${item.id === task.id ? 'border-neutral-900 bg-surface-subtle' : 'border-transparent hover:bg-hover-bg'}`}>
                      <div className="flex items-center gap-1.5 text-[9.5px] text-text-tertiary">
                        <span className="rounded-md bg-surface-1 px-1.5 py-0.5">{isMaterialFollowUp ? '素材补拍' : item.publishExecutorType === '内容包KOC发布' ? '笔记包' : '单篇笔记'}</span>
                        {item.isBlocked ? <span className="text-amber-700">待介入</span> : null}
                      </div>
                      <div className="mt-1.5 line-clamp-2 text-[11.5px] font-semibold leading-5 text-text-main">{item.noteTitle}</div>
                      <div className="mt-1 truncate text-[10px] text-text-secondary">{item.operatorActionSummary}</div>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[9.5px] text-text-tertiary"><span className="truncate">{item.targetAccount}</span><span className="shrink-0">{formatChineseDate(item.deadline, true) || item.deadline || '待排期'}</span></div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-5 xl:p-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {mode === 'progress' ? (
              <section className="rounded-xl border border-border-default bg-surface-1 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-medium text-text-tertiary">当前执行任务</div>
                    <div className="mt-1 text-[14px] font-semibold text-text-main">{task.operatorActionSummary}</div>
                    <div className="mt-1 text-[12px] text-text-secondary">{task.currentOccurrence}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {task.publishExecutorType && <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10.5px] font-medium text-blue-700">{task.publishExecutorType}</span>}
                    {task.publishStage && <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10.5px] font-medium text-amber-800">{task.publishStage}</span>}
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 border-t border-border-default pt-3 text-[11.5px] text-text-tertiary"><ArrowRight size={13} className="mt-0.5 shrink-0" /><span>下一步：{task.nextStepAfterAction}</span></div>
              </section>
            ) : (
              <section className="rounded-xl border border-border-default bg-surface-1 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-text-tertiary"><span>{task.projectName}</span><span>·</span><span className="truncate">{task.noteTitle}</span><span>·</span><span>{task.targetAccount}</span></div>
                    <div className="mt-1.5 text-[14px] font-semibold text-text-main">{task.operatorActionSummary}</div>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-medium ${task.isBlocked ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-surface-subtle text-text-secondary border border-border-default'}`}>{task.isBlocked ? '待介入' : '待处理'}</span>
                </div>
              </section>
            )}
            {renderWorkbench()}
          </div>
        </main>

        {showContext && (
          <aside className="w-[340px] shrink-0 overflow-y-auto border-l border-border-default bg-surface-1 p-4 hidden md:block">
            <div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold text-text-main">{mode === 'progress' ? '任务信息与记录' : '判断依据与协助'}</h2><button onClick={() => setShowContext(false)} className="p-1 text-text-tertiary"><X size={15} /></button></div>
            <div className="mt-4 space-y-4">
              <section className="rounded-xl bg-surface-subtle p-3">
                <div className="text-[11px] font-medium text-text-tertiary">介入原因</div>
                <p className="mt-2 text-[11.5px] leading-5 text-text-secondary">{task.reasonForIntervention}</p>
                <div className="mt-2 flex items-start gap-2 border-t border-border-default pt-2 text-[10.5px] text-text-tertiary"><ArrowRight size={12} className="mt-0.5 shrink-0" /><span>{task.nextStepAfterAction}</span></div>
              </section>
              <section>
                <div className="text-[11px] font-medium text-text-tertiary">系统已确认</div>
                <div className="mt-2 space-y-2">{task.confirmedFacts.map((fact, index) => <div key={index} className="flex gap-2 text-[11.5px] leading-5 text-text-secondary"><CheckCircle2 size={13} className="mt-1 shrink-0 text-emerald-600" /><span>{fact}</span></div>)}</div>
              </section>
              {task.strategyContext && (
                <section className="rounded-xl bg-surface-subtle p-3">
                  <div className="text-[11px] font-medium text-text-tertiary">方案上下文</div>
                  <div className="mt-2 text-[11.5px] leading-5 text-text-secondary">{task.strategyContext.intent}</div>
                  <div className="mt-2 flex flex-wrap gap-1">{task.strategyContext.searchKeywords.map(keyword => <span key={keyword} className="rounded bg-surface-1 border border-border-default px-1.5 py-0.5 text-[10px] text-text-tertiary">{keyword}</span>)}</div>
                </section>
              )}
              <section>
                <div className="text-[11px] font-medium text-text-tertiary">Agent 与操作记录</div>
                <div className="mt-2 space-y-2">{task.timelineEvents.slice(-4).map(event => <div key={event.id} className="text-[10.5px] leading-4 text-text-tertiary"><span className="mr-1">{formatChineseDate(event.time, true) || event.time}</span><strong className="font-medium text-text-secondary">{event.actor}</strong> · {event.action}</div>)}</div>
              </section>
              {mode !== 'progress' && <section className="rounded-xl border border-border-default p-3">
                <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-text-main"><Bot size={14} />向 Agent 追问</div>
                {agentAnswer && <div className="mt-2 rounded-lg bg-surface-subtle p-2.5 text-[11px] leading-5 text-text-secondary">{agentAnswer}</div>}
                <textarea value={agentQuestion} onChange={event => setAgentQuestion(event.target.value)} rows={3} placeholder="询问判断依据，不会自动执行操作" className="mt-2 w-full resize-none rounded-lg border border-border-default px-2.5 py-2 text-[11px] outline-none" />
                <button onClick={() => { if (agentQuestion.trim()) { setAgentAnswer(`已结合当前笔记、方案上下文和系统检查进行分析：${task.reasonForIntervention}。最终仍需由操盘手确认。`); setAgentQuestion(''); } }} className="mt-2 flex items-center gap-1 rounded-lg bg-neutral-950 px-3 py-1.5 text-[11px] text-white"><Send size={11} />发送</button>
              </section>}
            </div>
          </aside>
        )}
      </div>

      {feedback && <div className="fixed bottom-5 left-1/2 z-[300] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2.5 text-[12px] text-white shadow-xl">{feedback}</div>}
    </div>
  );
}

function PrimaryAction({ label, hint, disabled, onClick }: { label: string; hint: string; disabled?: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-default bg-surface-1 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[11.5px] leading-5 text-text-tertiary">{hint}</div>
      <button disabled={disabled} onClick={onClick} className="shrink-0 rounded-lg bg-neutral-950 px-4 py-2 text-[12px] font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-35">{label}</button>
    </div>
  );
}
