import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, FilePenLine, Images, Search, Send, UsersRound } from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import type { MaterialAsset } from '../material-center/types';
import type { ExecutionAction } from '../../data/unifiedStore';
import type { Note, Project } from '../../data/projectStore';
import type { ExecutionTask } from './ExecutionCenter/types';
import { INITIAL_EXECUTION_TASKS } from './ExecutionCenter/mockData';
import { MaterialBatchReviewWorkbench } from './ExecutionCenter/MaterialBatchReviewWorkbench';
import { OperatorTaskWorkbench } from './ExecutionCenter/OperatorTaskWorkbench';
import { TaskDetailView } from './ExecutionCenter/TaskDetailView';
import { formatChineseDate } from '../../utils/formatDate';

type DomainTab = 'content' | 'material' | 'publish';
type QueueMode = 'action' | 'waiting' | 'completed';

interface ExecutionCenterProps {
  onAssetsAccepted?: (assets: MaterialAsset[]) => void;
}

const domainOf = (task: ExecutionTask): DomainTab => {
  if (task.operatorCategory === 'anomaly' || task.operatorCategory === 'publish') return 'publish';
  if (task.operatorCategory === 'material' && task.materialType === 'returned_shooting_asset') return 'material';
  return 'content';
};

const belongsToMode = (task: ExecutionTask, mode: QueueMode) => {
  if (mode === 'completed') return task.status === '已完成';
  if (task.status === '已完成' || task.status === '已取消') return false;
  if (mode === 'waiting') return task.isTeamExecuting || task.isSystemProcessing;
  if (!task.isMeWaiting) return false;
  if (task.operatorCategory === 'material') {
    return task.materialType === 'returned_shooting_asset' || task.materialType === 'matched_library_asset';
  }
  if (task.operatorCategory === 'publish') return false;
  return true;
};

const domainLabel: Record<DomainTab, string> = { content: '笔记处理', material: '素材任务', publish: '发布任务' };
const domainDescription: Record<DomainTab, string> = {
  content: '只收纳需要人工修改或确认后，笔记才能继续流转的事项。',
  material: '审核任务回传结果；不合格项直接退回原任务继续执行。',
  publish: '正常发布在等待外部中跟踪，这里只处理逾期、账号或回传异常。'
};

const createDirectTask = (note: Note, project: Project, action: ExecutionAction): ExecutionTask => {
  const labelMap: Record<ExecutionAction, string> = {
    edit_content: '修改内容', replace_material: '选图/换图', create_material_task: '创建素材任务',
    view_material_task: '查看素材任务', review_material: '验收素材', handle_publish_error: '处理发布异常'
  };
  const category = action === 'handle_publish_error' ? 'anomaly' : action === 'review_material' || action === 'view_material_task' ? 'material' : 'content';
  const id = `direct-${note.id}-${action}`;
  return {
    id,
    title: `${labelMap[action]} · ${note.title}`,
    operatorCategory: category,
    categoryLabel: category === 'content' ? '笔记确认' : category === 'material' ? '素材待办' : '异常处理',
    status: '待执行', actionType: action, projectId: project.id, projectName: project.name,
    noteId: note.id, noteTitle: note.title, targetAccount: note.account || note.participant || '待匹配账号', accountType: note.type,
    operatorActionSummary: labelMap[action], reasonForIntervention: '操盘手从笔记列表主动发起操作，不依赖系统提醒。',
    deadlineLabel: '普通', isBlocked: false, waitingParty: '操盘手', waitingRole: 'operator', isMeWaiting: true,
    isTeamExecuting: false, isSystemProcessing: false, createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    primaryActionLabel: labelMap[action], currentOccurrence: `正在处理笔记《${note.title}》的${labelMap[action]}操作。`,
    confirmedFacts: ['笔记及方案上下文已载入', '当前动作不会改变既有方案逻辑'],
    nextStepAfterAction: action === 'create_material_task' ? '下发后进入等待外部；素材回传后才进入素材任务审核。' : '完成后重新校验笔记完整度，满足条件后进入待发笔记池。',
    draftTitle: note.title, draftBody: note.body || '', tags: note.tags || [],
    selectedCoverUrl: note.selectedMaterials?.find(item => item.isCover)?.url || note.recommendedMaterials?.[0]?.url,
    selectedMaterialAssets: (note.selectedMaterials || []).map(item => ({ id: item.id, title: item.title, category: '使用场景', url: item.url, source: '素材中心', matchScore: 100, tags: [], isRecommendedCover: item.isCover })),
    materialType: category === 'material' ? 'returned_shooting_asset' : undefined,
    materialSubItems: category === 'material' ? [{ id: note.materialTask?.id || `material-${note.id}`, requirement: note.materialTask?.reqs || '补齐笔记所需真实场景素材', isRequired: true, uploadedAssets: [], autoCheckResult: '等待素材任务回传', manualStatus: '待验收' }] : undefined,
    timelineEvents: [{ id: `event-${id}`, time: '刚刚', actor: '操盘手', action: `从笔记列表发起${labelMap[action]}` }]
  };
};

export function ExecutionCenter({ onAssetsAccepted }: ExecutionCenterProps) {
  const { currentProject, executionNavTarget, clearExecutionNavTarget, updateNoteStatus, clearNoteIssue } = useProjectStore();
  const [tasks, setTasks] = useState<ExecutionTask[]>(INITIAL_EXECUTION_TASKS);
  const [domain, setDomain] = useState<DomainTab>('content');
  const [queueMode, setQueueMode] = useState<QueueMode>('action');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeDirectAction, setActiveDirectAction] = useState<ExecutionAction | undefined>();

  const counts = useMemo(() => ({
    content: new Set(tasks.filter(task => domainOf(task) === 'content' && belongsToMode(task, 'action')).map(task => task.noteId || task.id)).size,
    material: tasks.filter(task => domainOf(task) === 'material' && belongsToMode(task, 'action')).length,
    publish: tasks.filter(task => domainOf(task) === 'publish' && belongsToMode(task, 'action')).length,
    waiting: tasks.filter(task => belongsToMode(task, 'waiting')).length,
    completed: tasks.filter(task => belongsToMode(task, 'completed')).length
  }), [tasks]);
  const projects = useMemo(() => Array.from(new Set(tasks.map(task => task.projectName))), [tasks]);
  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (domainOf(task) !== domain || !belongsToMode(task, queueMode)) return false;
    if (projectFilter !== 'all' && task.projectName !== projectFilter) return false;
    const keyword = searchKeyword.trim().toLowerCase();
    return !keyword || [task.title, task.noteTitle, task.targetAccount, task.waitingParty, task.projectName].some(value => value.toLowerCase().includes(keyword));
  }), [domain, projectFilter, queueMode, searchKeyword, tasks]);
  const presentationTasks = useMemo(() => {
    if (domain !== 'content' || queueMode !== 'action') return filteredTasks;
    const tasksByNote = new Map<string, ExecutionTask[]>();
    filteredTasks.forEach(task => {
      const key = task.noteId || task.id;
      tasksByNote.set(key, [...(tasksByNote.get(key) || []), task]);
    });
    return Array.from(tasksByNote.values()).map(noteTasks => (
      noteTasks.find(task => task.operatorCategory === 'content') || noteTasks[0]
    ));
  }, [domain, filteredTasks, queueMode]);
  const selectedTask = useMemo(() => presentationTasks.find(task => task.id === selectedTaskId) ?? presentationTasks[0] ?? null, [presentationTasks, selectedTaskId]);
  const activeTask = useMemo(() => tasks.find(task => task.id === activeTaskId) ?? null, [activeTaskId, tasks]);
  const activeQueue = useMemo(() => activeTask ? tasks.filter(task => domainOf(task) === domainOf(activeTask) && belongsToMode(task, queueMode)) : [], [activeTask, queueMode, tasks]);
  const materialBatchTasks = useMemo(() => selectedTask && domain === 'material' ? filteredTasks.filter(task => task.projectId === selectedTask.projectId && task.materialType === 'returned_shooting_asset') : [], [domain, filteredTasks, selectedTask]);

  useEffect(() => {
    if (!executionNavTarget) return;
    if (executionNavTarget.taskId) {
      const task = tasks.find(item => item.id === executionNavTarget.taskId);
      if (task) { setDomain(domainOf(task)); setQueueMode(belongsToMode(task, 'waiting') ? 'waiting' : belongsToMode(task, 'completed') ? 'completed' : 'action'); setSelectedTaskId(task.id); }
      clearExecutionNavTarget(); return;
    }
    const { noteId, action } = executionNavTarget;
    if (!noteId || !action) { clearExecutionNavTarget(); return; }
    const expectedDomain: DomainTab = action === 'handle_publish_error' ? 'publish' : action === 'review_material' || action === 'view_material_task' ? 'material' : 'content';
    const existing = tasks.find(item => item.noteId === noteId && domainOf(item) === expectedDomain);
    if (existing) {
      setDomain(expectedDomain); setQueueMode('action'); setSelectedTaskId(existing.id);
      if (expectedDomain !== 'material') { setActiveTaskId(existing.id); setActiveDirectAction(action); }
      clearExecutionNavTarget(); return;
    }
    const note = currentProject?.notes.find(item => item.id === noteId);
    if (note && currentProject) {
      const directTask = createDirectTask(note, currentProject, action);
      setTasks(current => current.some(item => item.id === directTask.id) ? current : [directTask, ...current]);
      setDomain(expectedDomain); setQueueMode('action'); setSelectedTaskId(directTask.id);
      if (expectedDomain !== 'material') { setActiveTaskId(directTask.id); setActiveDirectAction(action); }
    }
    clearExecutionNavTarget();
  }, [clearExecutionNavTarget, currentProject, executionNavTarget, tasks]);

  const handleUpdateTask = (updated: ExecutionTask) => {
    setTasks(current => current.map(task => task.id === updated.id ? updated : task));
    if (updated.status !== '已完成' || !updated.noteId) return;
    const action = updated.actionType || (updated.operatorCategory === 'content' ? 'edit_content' : updated.operatorCategory === 'anomaly' ? 'handle_publish_error' : 'review_material');
    if (action === 'edit_content' || action === 'replace_material' || action === 'create_material_task') {
      const selectedMaterials = (updated.selectedMaterialAssets ?? []).map((material, index) => ({ id: material.id, title: material.title, url: material.url, isCover: updated.selectedCoverUrl ? updated.selectedCoverUrl === material.url : index === 0 }));
      updateNoteStatus(updated.projectId, updated.noteId, { title: updated.draftTitle, body: updated.draftBody, tags: updated.tags, contentStatus: '已确认', selectedMaterials: selectedMaterials.length ? selectedMaterials : undefined, materialStatus: updated.generatedMaterialTasks?.length ? '待收集' : selectedMaterials.length ? '已齐' : undefined });
      clearNoteIssue(updated.projectId, updated.noteId);
    } else if (action === 'handle_publish_error') clearNoteIssue(updated.projectId, updated.noteId);
  };

  const handleMaterialTasksChange = (updatedTasks: ExecutionTask[]) => {
    const updatedMap = new Map(updatedTasks.map(task => [task.id, task]));
    setTasks(current => current.map(task => updatedMap.get(task.id) ?? task));
    updatedTasks.forEach(task => {
      if (!task.noteId) return;
      const needsReshoot = task.materialSubItems?.some(item => item.manualStatus === '需补拍');
      updateNoteStatus(task.projectId, task.noteId, { materialStatus: needsReshoot ? '待收集' : '已齐' });
      if (!needsReshoot) clearNoteIssue(task.projectId, task.noteId);
    });
    setQueueMode(updatedTasks.some(task => task.status === '执行中') ? 'waiting' : 'completed');
    setSelectedTaskId(updatedTasks[0]?.id ?? null);
  };

  const handleNextTask = (currentTask: ExecutionTask, queue: ExecutionTask[]) => {
    if (queue.length < 2) return;
    const index = queue.findIndex(task => task.id === currentTask.id);
    const next = queue[(index + 1) % queue.length];
    setSelectedTaskId(next.id); setActiveTaskId(next.id); setActiveDirectAction(undefined);
  };

  const switchDomain = (nextDomain: DomainTab) => {
    setDomain(nextDomain);
    setQueueMode('action');
    setSelectedTaskId(null);
    setActiveTaskId(null);
    setActiveDirectAction(undefined);
  };

  const workspaceNavigation = (
    <div className="flex shrink-0 items-center gap-1">
      <nav className="flex items-center gap-0.5 rounded-lg bg-surface-subtle p-0.5" aria-label="执行任务类型">
        {(Object.keys(domainLabel) as DomainTab[]).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => switchDomain(tab)}
            className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${domain === tab ? 'bg-neutral-950 text-white shadow-sm' : 'text-text-secondary hover:bg-surface-1 hover:text-text-main'}`}
          >
            {domainLabel[tab]} <span className="opacity-65">{counts[tab]}</span>
          </button>
        ))}
      </nav>
      <button type="button" onClick={() => { setQueueMode('waiting'); setActiveTaskId(null); }} className="rounded-md px-2 py-1 text-[9.5px] text-text-tertiary hover:bg-hover-bg hover:text-text-main">等待 {counts.waiting}</button>
      <button type="button" onClick={() => { setQueueMode('completed'); setActiveTaskId(null); }} className="rounded-md px-2 py-1 text-[9.5px] text-text-tertiary hover:bg-hover-bg hover:text-text-main">记录</button>
    </div>
  );

  if (queueMode === 'action') {
    const workspaceTask = activeTask && domainOf(activeTask) === domain && belongsToMode(activeTask, 'action') ? activeTask : selectedTask;
    if (!workspaceTask) {
      return (
        <div className="flex h-full min-h-0 flex-1 flex-col bg-page-bg">
          <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5">{workspaceNavigation}</div>
          <div className="flex flex-1 items-center justify-center text-center">
            <div><CheckCircle2 size={30} className="mx-auto text-emerald-500" /><div className="mt-3 text-[13px] font-semibold text-text-main">当前没有需要处理的事项</div><p className="mt-1 text-[10px] text-text-tertiary">新的人工任务出现后，会直接进入对应工作台。</p></div>
          </div>
        </div>
      );
    }

    if (domain === 'material') {
      return <MaterialBatchReviewWorkbench workspaceNavigation={workspaceNavigation} projectName={workspaceTask.projectName} tasks={materialBatchTasks} onTasksChange={handleMaterialTasksChange} onAssetsAccepted={onAssetsAccepted} />;
    }

    const onSelectWorkspaceTask = (task: ExecutionTask) => {
      setSelectedTaskId(task.id);
      setActiveTaskId(task.id);
      setActiveDirectAction(undefined);
    };
    const nextTask = presentationTasks.length > 1 ? () => handleNextTask(workspaceTask, presentationTasks) : undefined;
    const commonProps = {
      task: workspaceTask,
      initialAction: activeDirectAction,
      categoryQueue: filteredTasks,
      onSelectTask: onSelectWorkspaceTask,
      onBack: () => { setActiveTaskId(null); setActiveDirectAction(undefined); },
      workspaceNavigation,
      onUpdateTask: handleUpdateTask,
      onNextTask: nextTask
    };
    const noteWorkbench = workspaceTask.operatorCategory === 'content' || workspaceTask.materialType === 'matched_library_asset';
    return noteWorkbench ? <TaskDetailView {...commonProps} /> : <OperatorTaskWorkbench {...commonProps} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-page-bg">
      <header className="shrink-0 border-b border-border-default bg-surface-1 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div><h1 className="text-[19px] font-semibold tracking-tight text-text-main">执行中心</h1><p className="mt-1 text-[11.5px] text-text-secondary">只处理方案运行中必须由操盘手完成的修改、审核与异常纠偏。</p></div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQueueMode('waiting')} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10.5px] font-medium ${queueMode === 'waiting' ? 'border-neutral-900 bg-neutral-950 text-white' : 'border-border-default bg-surface-1 text-text-secondary'}`}><UsersRound size={13} />等待外部 <span className="opacity-70">{counts.waiting}</span></button>
            <button type="button" onClick={() => setQueueMode('completed')} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10.5px] font-medium ${queueMode === 'completed' ? 'border-neutral-900 bg-neutral-950 text-white' : 'border-border-default bg-surface-1 text-text-secondary'}`}><CheckCircle2 size={13} />处理记录</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <nav className="flex gap-1 rounded-xl bg-surface-subtle p-1" aria-label="执行任务类型">
            {(Object.keys(domainLabel) as DomainTab[]).map(tab => {
              const Icon = tab === 'content' ? FilePenLine : tab === 'material' ? Images : Send;
              const active = domain === tab && queueMode === 'action';
              return <button key={tab} type="button" onClick={() => { setDomain(tab); setQueueMode('action'); setSelectedTaskId(null); }} className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11.5px] font-medium ${active ? 'bg-surface-1 text-text-main shadow-sm ring-1 ring-border-default' : 'text-text-secondary hover:text-text-main'}`}><Icon size={13} />{domainLabel[tab]}<span className={`rounded-full px-1.5 py-0.5 text-[9px] ${active ? 'bg-neutral-900 text-white' : 'bg-white text-text-tertiary'}`}>{counts[tab]}</span></button>;
            })}
          </nav>
          <div className="flex items-center gap-2">
            <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)} className="rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[10.5px] text-text-secondary"><option value="all">全部方案</option>{projects.map(project => <option key={project}>{project}</option>)}</select>
            <label className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" /><input value={searchKeyword} onChange={event => setSearchKeyword(event.target.value)} placeholder="搜索笔记、账号或执行人" className="w-56 rounded-lg border border-border-default bg-surface-1 py-2 pl-8 pr-3 text-[10.5px] outline-none focus:border-border-strong" /></label>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[330px] shrink-0 overflow-y-auto border-r border-border-default bg-surface-1">
          <div className="border-b border-border-default px-4 py-3"><div className="flex items-center justify-between text-[11px] font-semibold text-text-main"><span>{queueMode === 'action' ? domainLabel[domain] : queueMode === 'waiting' ? '等待外部' : '处理记录'}</span><span className="text-text-tertiary">{presentationTasks.length}项</span></div><p className="mt-1 text-[9.5px] leading-4 text-text-tertiary">{queueMode === 'action' ? domainDescription[domain] : queueMode === 'waiting' ? '员工、KOC或系统正在推进，无需操盘手判断。' : '仅用于回看任务结论和流转记录。'}</p></div>
          <div className="space-y-1.5 p-2.5">
            {presentationTasks.map(task => {
              const active = selectedTask?.id === task.id;
              return <button key={task.id} type="button" onClick={() => { setSelectedTaskId(task.id); if (domain === 'content' && queueMode === 'action') { setActiveTaskId(task.id); setActiveDirectAction(undefined); } }} className={`w-full rounded-xl border p-3 text-left ${active ? 'border-neutral-900 bg-surface-subtle' : 'border-transparent hover:bg-hover-bg'}`}><div className="flex items-start gap-2">{active ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-label="当前选中" /> : <span className="w-2 shrink-0" />}<div className="min-w-0 flex-1"><div className="line-clamp-2 text-[11.5px] font-semibold leading-5 text-text-main">{task.noteTitle}</div><div className="mt-1 truncate text-[9.5px] text-text-tertiary">{task.operatorActionSummary}</div><div className="mt-2 flex items-center justify-between gap-2 text-[9px] text-text-tertiary"><span className="truncate">{task.projectName} · {task.targetAccount}</span><span className={task.deadlineLabel === '已逾期' ? 'font-medium text-rose-600' : ''}>{formatChineseDate(task.deadline, true) || task.deadline || '未设置'}</span></div></div></div></button>;
            })}
            {presentationTasks.length === 0 ? <div className="px-4 py-12 text-center"><CheckCircle2 size={22} className="mx-auto text-emerald-500" /><div className="mt-2 text-[11px] font-medium text-text-main">当前没有需要处理的事项</div><p className="mt-1 text-[9.5px] leading-4 text-text-tertiary">系统会在确实需要人工介入时，才把任务放到这里。</p></div> : null}
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden">
          {selectedTask ? domain === 'material' && queueMode === 'action' ? (
            <MaterialBatchReviewWorkbench projectName={selectedTask.projectName} tasks={materialBatchTasks} onTasksChange={handleMaterialTasksChange} onAssetsAccepted={onAssetsAccepted} />
          ) : (
            <div className="h-full overflow-y-auto p-6"><div className="mx-auto max-w-4xl space-y-4">
              <section className="rounded-xl border border-border-default bg-surface-1 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><div className="text-[10px] text-text-tertiary">{selectedTask.projectName} · {selectedTask.targetAccount}</div><h2 className="mt-1.5 text-[17px] font-semibold text-text-main">{selectedTask.operatorActionSummary}</h2><p className="mt-2 text-[11.5px] leading-5 text-text-secondary">{queueMode === 'waiting' ? selectedTask.currentOccurrence : selectedTask.reasonForIntervention}</p></div><span className={`rounded-md px-2 py-1 text-[9.5px] ${selectedTask.isMeWaiting ? 'bg-amber-50 text-amber-800' : selectedTask.status === '已完成' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-subtle text-text-secondary'}`}>{selectedTask.isMeWaiting ? '待我处理' : selectedTask.status === '已完成' ? '已完成' : '等待外部'}</span></div><div className="mt-4 flex items-center gap-2 border-t border-border-default pt-4 text-[10.5px] text-text-tertiary"><Clock3 size={13} />{formatChineseDate(selectedTask.deadline, true) || selectedTask.deadline || '未设置截止时间'}<span className="mx-1">·</span>下一步：{selectedTask.nextStepAfterAction}</div></section>
              <section className="rounded-xl border border-border-default bg-surface-1 p-5"><h3 className="text-[12px] font-semibold text-text-main">已确认信息</h3><div className="mt-3 grid gap-2 md:grid-cols-2">{selectedTask.confirmedFacts.map((fact, index) => <div key={`${selectedTask.id}-${index}`} className="flex gap-2 rounded-lg bg-surface-subtle p-3 text-[10.5px] leading-5 text-text-secondary"><CheckCircle2 size={13} className="mt-1 shrink-0 text-emerald-600" />{fact}</div>)}</div></section>
              <section className="rounded-xl border border-border-default bg-surface-1 p-5"><div className="flex items-center justify-between gap-3"><div><h3 className="text-[12px] font-semibold text-text-main">任务进程</h3><p className="mt-1 text-[9.5px] text-text-tertiary">任务流转和历史动作保留在执行中心，内部Agent过程不占用主界面。</p></div>{queueMode === 'action' ? <button type="button" onClick={() => setActiveTaskId(selectedTask.id)} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[10.5px] font-semibold text-white">{selectedTask.primaryActionLabel}<ArrowRight size={12} /></button> : null}</div><div className="mt-4 space-y-2">{selectedTask.timelineEvents.slice().reverse().map(event => <div key={event.id} className="flex gap-3 border-l border-border-default pl-3 text-[10px] leading-5"><span className="w-24 shrink-0 text-text-tertiary">{formatChineseDate(event.time, true) || event.time}</span><span className="text-text-secondary">{event.actor} · {event.action}</span></div>)}</div></section>
            </div></div>
          ) : <div className="flex h-full items-center justify-center text-center"><div><CheckCircle2 size={30} className="mx-auto text-emerald-500" /><div className="mt-3 text-[13px] font-semibold text-text-main">当前队列已处理完</div><p className="mt-1 text-[10px] text-text-tertiary">新的人工任务会在需要判断时出现。</p></div></div>}
        </main>
      </div>
    </div>
  );
}
