import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  FilePenLine,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  Search,
  Send,
  Users,
  X
} from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import type { ExecutionAction } from '../../data/unifiedStore';
import type { Note, Project } from '../../data/projectStore';
import type { MaterialAsset } from '../material-center/types';
import { INITIAL_EXECUTION_TASKS } from './ExecutionCenter/mockData';
import { MaterialBatchReviewWorkbench } from './ExecutionCenter/MaterialBatchReviewWorkbench';
import { OperatorTaskWorkbench } from './ExecutionCenter/OperatorTaskWorkbench';
import { TaskDetailView } from './ExecutionCenter/TaskDetailView';
import { TaskProgressDrawer } from './ExecutionCenter/TaskProgressDrawer';
import type { ExecutionTask } from './ExecutionCenter/types';

type DomainTab = 'content' | 'material' | 'publish';


interface ExecutionCenterProps {
  onAssetsAccepted?: (assets: MaterialAsset[]) => void;
}

interface ProjectScope {
  id: string;
  name: string;
  taskCount: number;
}

function ProjectScopePicker({ projects, value, onChange }: { projects: ProjectScope[]; value: string; onChange: (projectId: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const current = projects.find(project => project.id === value);
  const visibleProjects = projects.filter(project => project.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="relative ml-1">
      <button type="button" onClick={() => setOpen(currentOpen => !currentOpen)} className={`flex max-w-[220px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-[13px] font-medium ${open || value !== 'all' ? 'border-neutral-900 bg-surface-1 text-text-main' : 'border-border-default text-text-secondary hover:bg-hover-bg'}`}>
        <FolderKanban size={11} /><span className="truncate">{current?.name || '全部项目'}</span>
      </button>
      {open ? (
        <>
          <button type="button" aria-label="关闭项目筛选" onClick={() => setOpen(false)} className="fixed inset-0 z-[270] cursor-default" />
          <div className="absolute left-1/2 top-full z-[280] mt-2 w-[340px] -translate-x-1/2 rounded-xl border border-border-default bg-surface-1 p-2 shadow-dialog">
            <div className="flex items-center gap-2 border-b border-border-default px-2 pb-2">
              <Search size={13} className="text-text-tertiary" />
              <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索项目" className="min-w-0 flex-1 bg-transparent py-1 text-[13px] outline-none" />
              {query ? <button type="button" onClick={() => setQuery('')} className="text-text-tertiary"><X size={12} /></button> : null}
            </div>
            <div className="mt-1 max-h-64 overflow-y-auto">
              {[{ id: 'all', name: '全部项目', taskCount: projects.reduce((sum, project) => sum + project.taskCount, 0) }, ...visibleProjects].map(project => (
                <button key={project.id} type="button" onClick={() => { onChange(project.id); setOpen(false); setQuery(''); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left hover:bg-hover-bg">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-text-main">{project.name}</span>
                  <span className="text-[13px] text-text-tertiary">{project.taskCount} 项</span>
                  {value === project.id ? <Check size={12} className="text-text-main" /> : <span className="w-3" />}
                </button>
              ))}
              {visibleProjects.length === 0 && query ? <div className="px-3 py-8 text-center text-[13px] text-text-tertiary">没有匹配项目</div> : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

const domainLabel: Record<DomainTab, string> = {
  content: '笔记处理',
  material: '素材任务',
  publish: '发布任务'
};

const domainOf = (task: ExecutionTask): DomainTab => {
  if (task.operatorCategory === 'anomaly' && task.anomalyType === 'material_reshoot_overdue') return 'material';
  if (task.operatorCategory === 'anomaly' || task.operatorCategory === 'publish') return 'publish';
  if (task.operatorCategory === 'material' && task.materialType === 'returned_shooting_asset') return 'material';
  return 'content';
};

const belongsToAction = (task: ExecutionTask) => {
  if (task.status === '已完成' || task.status === '已取消' || !task.isMeWaiting) return false;
  if (task.operatorCategory === 'material') {
    return task.materialType === 'returned_shooting_asset' || task.materialType === 'matched_library_asset';
  }
  return task.operatorCategory !== 'publish';
};

const createDirectTask = (note: Note, project: Project, action: ExecutionAction): ExecutionTask => {
  const labelMap: Record<ExecutionAction, string> = {
    edit_content: '修改内容',
    replace_material: '选图/换图',
    create_material_task: '创建素材任务',
    view_material_task: '查看素材任务',
    review_material: '验收素材',
    handle_publish_error: '处理发布异常'
  };
  const category = action === 'handle_publish_error'
    ? 'anomaly'
    : action === 'review_material' || action === 'view_material_task'
      ? 'material'
      : 'content';
  const id = `direct-${note.id}-${action}`;
  return {
    id,
    title: `${labelMap[action]} · ${note.title}`,
    operatorCategory: category,
    categoryLabel: category === 'content' ? '笔记确认' : category === 'material' ? '素材待办' : '异常处理',
    status: '待执行',
    actionType: action,
    projectId: project.id,
    projectName: project.name,
    noteId: note.id,
    noteTitle: note.title,
    targetAccount: note.account || note.participant || '待匹配账号',
    accountType: note.type,
    operatorActionSummary: labelMap[action],
    reasonForIntervention: '操盘手从笔记列表主动发起操作。',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    primaryActionLabel: labelMap[action],
    currentOccurrence: `正在处理笔记《${note.title}》的${labelMap[action]}操作。`,
    confirmedFacts: ['笔记及方案上下文已载入', '当前动作不会改变既有方案逻辑'],
    nextStepAfterAction: action === 'create_material_task'
      ? '下发后进入任务进展；素材回传后进入素材审核。'
      : '完成后重新校验笔记完整度，满足条件后进入待发笔记池。',
    draftTitle: note.title,
    draftBody: note.body || '',
    tags: note.tags || [],
    selectedCoverUrl: note.selectedMaterials?.find(item => item.isCover)?.url || note.recommendedMaterials?.[0]?.url,
    selectedMaterialAssets: (note.selectedMaterials || []).map(item => ({
      id: item.id,
      title: item.title,
      category: '使用场景',
      url: item.url,
      source: '素材中心',
      matchScore: 100,
      tags: [],
      isRecommendedCover: item.isCover
    })),
    materialType: category === 'material' ? 'returned_shooting_asset' : undefined,
    materialSubItems: category === 'material' ? [{
      id: note.materialTask?.id || `material-${note.id}`,
      requirement: note.materialTask?.reqs || '补齐笔记所需真实场景素材',
      isRequired: true,
      uploadedAssets: [],
      autoCheckResult: '等待素材任务回传',
      manualStatus: '待验收'
    }] : undefined,
    timelineEvents: [{ id: `event-${id}`, time: '刚刚', actor: '操盘手', action: `从笔记列表发起${labelMap[action]}` }]
  };
};

export function ExecutionCenter({ onAssetsAccepted }: ExecutionCenterProps) {
  const {
    currentProject,
    executionNavTarget,
    clearExecutionNavTarget,
    updateNoteStatus,
    clearNoteIssue
  } = useProjectStore();
  const [tasks, setTasks] = useState<ExecutionTask[]>(INITIAL_EXECUTION_TASKS);
  
  const [domain, setDomain] = useState<DomainTab>('content');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeDirectAction, setActiveDirectAction] = useState<ExecutionAction | undefined>();
  const [progressOpen, setProgressOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  const projects = useMemo<ProjectScope[]>(() => {
    const grouped = new Map<string, ProjectScope>();
    tasks.forEach(task => {
      const current = grouped.get(task.projectId);
      if (current) current.taskCount += 1;
      else grouped.set(task.projectId, { id: task.projectId, name: task.projectName, taskCount: 1 });
    });
    return Array.from(grouped.values());
  }, [tasks]);
  const scopedTasks = useMemo(() => selectedProjectId === 'all' ? tasks : tasks.filter(task => task.projectId === selectedProjectId), [selectedProjectId, tasks]);
  const actionTasks = useMemo(() => scopedTasks.filter(belongsToAction), [scopedTasks]);
  const counts = useMemo(() => ({
    content: new Set(actionTasks.filter(task => domainOf(task) === 'content').map(task => task.noteId || task.id)).size,
    material: scopedTasks.filter(task => domainOf(task) === 'material' && task.status !== '已完成' && task.status !== '已取消').length,
    publish: actionTasks.filter(task => domainOf(task) === 'publish').length,
    progress: scopedTasks.filter(task => task.status !== '已完成' && task.status !== '已取消').length
  }), [actionTasks, scopedTasks]);
  const domainTasks = useMemo(() => actionTasks.filter(task => domainOf(task) === domain), [actionTasks, domain]);
  const presentationTasks = useMemo(() => {
    if (domain !== 'content') return domainTasks;
    const tasksByNote = new Map<string, ExecutionTask[]>();
    domainTasks.forEach(task => {
      const key = task.noteId || task.id;
      tasksByNote.set(key, [...(tasksByNote.get(key) || []), task]);
    });
    return Array.from(tasksByNote.values()).map(noteTasks => (
      noteTasks.find(task => task.operatorCategory === 'content') || noteTasks[0]
    ));
  }, [domain, domainTasks]);
  const selectedTask = useMemo(
    () => presentationTasks.find(task => task.id === selectedTaskId) ?? presentationTasks[0] ?? null,
    [presentationTasks, selectedTaskId]
  );
  const activeTask = useMemo(() => tasks.find(task => task.id === activeTaskId) ?? null, [activeTaskId, tasks]);
  const materialActionTasks = useMemo(
    () => scopedTasks.filter(task => (
      task.status !== '已完成'
      && task.status !== '已取消'
      && domainOf(task) === 'material'
      && task.materialType === 'returned_shooting_asset'
    )),
    [scopedTasks]
  );
  const materialFollowUpTasks = useMemo(
    () => actionTasks.filter(task => domainOf(task) === 'material' && task.operatorCategory === 'anomaly'),
    [actionTasks]
  );
  const recommendedTask = useMemo(() => {
    const deadlineWeight: Record<NonNullable<ExecutionTask['deadlineLabel']>, number> = {
      '已逾期': 0,
      '今日到期': 1,
      '即将到期': 2,
      '普通': 3
    };
    return [...actionTasks].sort((left, right) => (
      (deadlineWeight[left.deadlineLabel || '普通'] - deadlineWeight[right.deadlineLabel || '普通'])
      || Number(Boolean(right.isBlocked)) - Number(Boolean(left.isBlocked))
      || right.createdAt.localeCompare(left.createdAt)
    ))[0] || null;
  }, [actionTasks]);
  const flowCounts = useMemo(() => ({
    team: scopedTasks.filter(task => task.status !== '已完成' && task.status !== '已取消' && task.isTeamExecuting).length,
    system: scopedTasks.filter(task => task.status !== '已完成' && task.status !== '已取消' && task.isSystemProcessing).length,
    risk: scopedTasks.filter(task => task.status !== '已完成' && task.status !== '已取消' && (task.isBlocked || task.deadlineLabel === '已逾期')).length
  }), [scopedTasks]);

  const openActionTask = (task: ExecutionTask, action?: ExecutionAction) => {
    const nextDomain = domainOf(task);
    if (selectedProjectId !== 'all' && selectedProjectId !== task.projectId) setSelectedProjectId(task.projectId);
    setDomain(nextDomain);
    setSelectedTaskId(task.id);
    setActiveDirectAction(action);
    setActiveTaskId(nextDomain === 'material' ? null : task.id);
    
  };

  useEffect(() => {
    if (!executionNavTarget) return;
    if (executionNavTarget.taskId) {
      const task = tasks.find(item => item.id === executionNavTarget.taskId);
      if (task) {
        if (belongsToAction(task)) openActionTask(task);
        else setProgressOpen(true);
      }
      clearExecutionNavTarget();
      return;
    }

    const { noteId, action } = executionNavTarget;
    if (!noteId || !action) {
      clearExecutionNavTarget();
      return;
    }
    const expectedDomain: DomainTab = action === 'handle_publish_error'
      ? 'publish'
      : action === 'review_material' || action === 'view_material_task'
        ? 'material'
        : 'content';
    const existing = tasks.find(item => item.noteId === noteId && domainOf(item) === expectedDomain);
    if (existing) {
      if (belongsToAction(existing)) openActionTask(existing, action);
      else setProgressOpen(true);
      clearExecutionNavTarget();
      return;
    }

    const note = currentProject?.notes.find(item => item.id === noteId);
    if (note && currentProject) {
      const directTask = createDirectTask(note, currentProject, action);
      setTasks(current => current.some(item => item.id === directTask.id) ? current : [directTask, ...current]);
      openActionTask(directTask, action);
    }
    clearExecutionNavTarget();
  }, [clearExecutionNavTarget, currentProject, executionNavTarget, tasks]);

  const handleUpdateTask = (updated: ExecutionTask) => {
    setTasks(current => current.map(task => task.id === updated.id ? updated : task));
    if (updated.status !== '已完成' || !updated.noteId) return;
    const action = updated.actionType || (
      updated.operatorCategory === 'content'
        ? 'edit_content'
        : updated.operatorCategory === 'anomaly'
          ? 'handle_publish_error'
          : 'review_material'
    );
    if (action === 'edit_content' || action === 'replace_material' || action === 'create_material_task') {
      const selectedMaterials = (updated.selectedMaterialAssets ?? []).map((material, index) => ({
        id: material.id,
        title: material.title,
        url: material.url,
        isCover: updated.selectedCoverUrl ? updated.selectedCoverUrl === material.url : index === 0
      }));
      updateNoteStatus(updated.projectId, updated.noteId, {
        title: updated.draftTitle,
        body: updated.draftBody,
        tags: updated.tags,
        contentStatus: '已确认',
        selectedMaterials: selectedMaterials.length ? selectedMaterials : undefined,
        materialStatus: updated.generatedMaterialTasks?.length
          ? '待收集'
          : selectedMaterials.length
            ? '已齐'
            : undefined
      });
      clearNoteIssue(updated.projectId, updated.noteId);
    } else if (action === 'handle_publish_error') {
      clearNoteIssue(updated.projectId, updated.noteId);
    }
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
    setSelectedTaskId(null);
  };

  const switchDomain = (nextDomain: DomainTab) => {
    setDomain(nextDomain);
    setSelectedTaskId(null);
    setActiveTaskId(null);
    setActiveDirectAction(undefined);
  };

  

  const handleNextTask = (currentTask: ExecutionTask, queue: ExecutionTask[]) => {
    if (queue.length < 2) return;
    const index = queue.findIndex(task => task.id === currentTask.id);
    openActionTask(queue[(index + 1) % queue.length]);
  };

  const workspaceNavigation = (
    <div className="flex shrink-0 items-center gap-1">
<nav className="flex items-center gap-0.5 rounded-lg bg-surface-subtle p-0.5" aria-label="执行任务类型">
        {(Object.keys(domainLabel) as DomainTab[]).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => switchDomain(tab)}
            className={`rounded-md px-2 py-1 text-[13px] font-medium transition-colors ${domain === tab ? 'bg-neutral-950 text-white shadow-sm' : 'text-text-secondary hover:bg-surface-1 hover:text-text-main'}`}
          >
            {domainLabel[tab]} <span className="opacity-65">{counts[tab]}</span>
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => setProgressOpen(true)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-text-tertiary hover:bg-hover-bg hover:text-text-main"
      >
        <Activity size={11} />任务进展 {counts.progress}
      </button>
      <ProjectScopePicker
        projects={projects}
        value={selectedProjectId}
        onChange={projectId => {
          setSelectedProjectId(projectId);
          setSelectedTaskId(null);
          setActiveTaskId(null);
          setActiveDirectAction(undefined);
        }}
      />
    </div>
  );

  const workspaceTask = activeTask && domainOf(activeTask) === domain && belongsToAction(activeTask)
    ? activeTask
    : selectedTask;

  let workspace: React.ReactNode;
  if (!workspaceTask) {
    workspace = (
      <div className="flex h-full min-h-0 flex-1 flex-col bg-page-bg">
        <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5">{workspaceNavigation}</div>
        <div className="flex flex-1 items-center justify-center text-center">
          <div>
            <CheckCircle2 size={30} className="mx-auto text-emerald-500" />
            <div className="mt-3 text-[13px] font-semibold text-text-main">当前没有需要处理的事项</div>
            <p className="mt-1 text-[13px] text-text-tertiary">领取、执行和历史记录可在任务进展中查看。</p>
          </div>
        </div>
      </div>
    );
  } else if (domain === 'material') {
    workspace = workspaceTask.operatorCategory === 'anomaly' ? (
      <OperatorTaskWorkbench
        task={workspaceTask}
        categoryQueue={domainTasks}
        onSelectTask={task => openActionTask(task)}
        onBack={() => setActiveTaskId(null)}
        workspaceNavigation={workspaceNavigation}
        onUpdateTask={handleUpdateTask}
      />
    ) : (
      <MaterialBatchReviewWorkbench
        tasks={materialActionTasks}
        followUpTasks={materialFollowUpTasks}
        onOpenFollowUp={task => openActionTask(task)}
        onTasksChange={handleMaterialTasksChange}
        onAssetsAccepted={onAssetsAccepted}
        workspaceNavigation={workspaceNavigation}
      />
    );
  } else {
    const onSelectWorkspaceTask = (task: ExecutionTask) => openActionTask(task);
    const nextTask = presentationTasks.length > 1
      ? () => handleNextTask(workspaceTask, presentationTasks)
      : undefined;
    const commonProps = {
      task: workspaceTask,
      initialAction: activeDirectAction,
      categoryQueue: domainTasks,
      onSelectTask: onSelectWorkspaceTask,
      onBack: () => {
        setActiveTaskId(null);
        setActiveDirectAction(undefined);
      },
      workspaceNavigation,
      onUpdateTask: handleUpdateTask,
      onNextTask: nextTask
    };
    const noteWorkbench = workspaceTask.operatorCategory === 'content' || workspaceTask.materialType === 'matched_library_asset';
    workspace = noteWorkbench ? <TaskDetailView {...commonProps} /> : <OperatorTaskWorkbench {...commonProps} />;
  }


  return (
    <>
      {workspace}
      <TaskProgressDrawer
        open={progressOpen}
        tasks={scopedTasks}
        onClose={() => setProgressOpen(false)}
        onGoToTask={task => {
          setProgressOpen(false);
          openActionTask(task);
        }}
      />
    </>
  );
}
