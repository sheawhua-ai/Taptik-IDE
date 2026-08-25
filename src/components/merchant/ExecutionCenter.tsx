import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import { ExecutionCategory, ExecutionTask } from './ExecutionCenter/types';
import { INITIAL_EXECUTION_TASKS } from './ExecutionCenter/mockData';
import { OperatorTaskWorkbench } from './ExecutionCenter/OperatorTaskWorkbench';
import { TaskDetailView } from './ExecutionCenter/TaskDetailView';
import { ExecutionAction } from '../../data/unifiedStore';
import { formatChineseDate } from '../../utils/formatDate';

const requiresOperatorAction = (task: ExecutionTask) =>
  task.isMeWaiting && task.operatorCategory !== 'publish';

const isActivePublishTask = (task: ExecutionTask) =>
  task.operatorCategory === 'publish' && task.publishStage !== '观察中' &&
  (task.isTeamExecuting || task.isSystemProcessing);

export function ExecutionCenter() {
  const { currentProject, executionNavTarget, clearExecutionNavTarget, updateNoteStatus, clearNoteIssue } = useProjectStore();

  // Tasks state
  const [tasks, setTasks] = useState<ExecutionTask[]>(INITIAL_EXECUTION_TASKS);
  
  // Selection and Active Task
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeDirectAction, setActiveDirectAction] = useState<ExecutionAction | undefined>();

  // Filter Axes
  const [selectedCategory, setSelectedCategory] = useState<ExecutionCategory>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [queueView, setQueueView] = useState<'operator' | 'background'>('operator');

  // Available Project Names for filter dropdown
  const projectOptions = useMemo(() => {
    const names = new Set<string>();
    tasks.forEach(t => names.add(t.projectName));
    if (currentProject?.title) names.add(currentProject.title);
    return Array.from(names);
  }, [tasks, currentProject]);

  // Category counts for the tabs
  const categoryCounts = useMemo(() => {
    const base = tasks.filter(t => {
      if (t.status === '已完成' || t.status === '已取消') return false;
      if (queueView === 'operator') return requiresOperatorAction(t);
      return t.operatorCategory === 'publish'
        ? isActivePublishTask(t)
        : (t.isTeamExecuting || t.isSystemProcessing);
    });
    return {
      all: base.length,
      content: base.filter(t => t.operatorCategory === 'content').length,
      material: base.filter(t => t.operatorCategory === 'material').length,
      publish: base.filter(t => t.operatorCategory === 'publish').length,
      anomaly: base.filter(t => t.operatorCategory === 'anomaly').length
    };
  }, [tasks, queueView]);

  const backgroundFlowCount = useMemo(() => tasks.filter(task =>
    task.status !== '已完成' && task.status !== '已取消' && (
      task.operatorCategory === 'publish'
        ? isActivePublishTask(task)
        : (task.isTeamExecuting || task.isSystemProcessing)
    )
  ).length, [tasks]);

  const operatorTodoCount = useMemo(() => tasks.filter(task =>
    task.status !== '已完成' &&
    task.status !== '已取消' &&
    requiresOperatorAction(task)
  ).length, [tasks]);

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. 主队列只展示不能自动继续的人工决策；正常发布与回传进入“执行动态”。
      const belongsToView = queueView === 'operator'
        ? requiresOperatorAction(task)
        : task.operatorCategory === 'publish'
        ? isActivePublishTask(task)
        : (task.isTeamExecuting || task.isSystemProcessing);
      if (!belongsToView || task.status === '已完成' || task.status === '已取消') {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        if (task.operatorCategory !== selectedCategory) return false;
      }

      // 3. Project Filter
      if (selectedProjectFilter !== 'all') {
        if (task.projectName !== selectedProjectFilter) return false;
      }

      // 4. Search Keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(kw);
        const matchAccount = task.targetAccount.toLowerCase().includes(kw);
        const matchParty = task.waitingParty.toLowerCase().includes(kw);
        const matchSummary = task.operatorActionSummary?.toLowerCase().includes(kw);
        if (!matchTitle && !matchAccount && !matchParty && !matchSummary) return false;
      }

      return true;
    });
  }, [tasks, selectedCategory, selectedProjectFilter, searchKeyword, queueView]);

  // Active Task Object
  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  // Active task's category queue
  const activeCategoryQueue = useMemo(() => {
    if (!activeTask) return [];
    return tasks.filter(t =>
      t.operatorCategory === activeTask.operatorCategory &&
      t.status !== '已完成' &&
      t.status !== '已取消' &&
      (activeTask.isMeWaiting || activeTask.status === '已完成'
        ? t.isMeWaiting
        : (t.isTeamExecuting || t.isSystemProcessing))
    );
  }, [tasks, activeTask]);

  useEffect(() => {
    if (!executionNavTarget) return;

    if (executionNavTarget.taskId) {
      const task = tasks.find(item => item.id === executionNavTarget.taskId);
      if (task) setActiveTaskId(task.id);
      clearExecutionNavTarget();
      return;
    }

    const { noteId, action } = executionNavTarget;
    if (!noteId || !action) {
      clearExecutionNavTarget();
      return;
    }

    const materialActions: ExecutionAction[] = ['view_material_task', 'review_material'];
    const expectedCategory = action === 'handle_publish_error'
      ? 'anomaly'
      : materialActions.includes(action)
      ? 'material'
      : 'content';
    const existingTask = tasks.find(item => item.noteId === noteId && item.operatorCategory === expectedCategory);

    setActiveDirectAction(action);
    if (existingTask) {
      setActiveTaskId(existingTask.id);
      clearExecutionNavTarget();
      return;
    }

    const note = currentProject?.notes?.find(item => item.id === noteId);
    if (!note || !currentProject) {
      clearExecutionNavTarget();
      return;
    }

    const labelMap: Record<ExecutionAction, string> = {
      edit_content: '修改内容',
      replace_material: '选图/换图',
      create_material_task: '创建素材任务',
      view_material_task: '查看素材任务',
      review_material: '验收素材',
      handle_publish_error: '处理发布异常'
    };
    const nextStepMap: Record<ExecutionAction, string> = {
      edit_content: '确认后重新检查标签与素材完整度，满足条件才进入待发笔记池。',
      replace_material: '确认后素材写入当前笔记，并重新检查是否满足待发条件。',
      create_material_task: '下发后进入执行动态；素材回传时再进入操盘手验收队列。',
      view_material_task: '查看不会改变任务状态；如需调整，可在素材任务中重新下发要求。',
      review_material: '验收通过的素材写入当前笔记；需补拍的镜头返回执行动态。',
      handle_publish_error: '异常恢复后继续原发布流程；方案逻辑不会因此自动改变。'
    };
    const directTaskId = `direct-${noteId}-${action}`;
    const directTask: ExecutionTask = {
      id: directTaskId,
      title: `${labelMap[action]} · ${note.title}`,
      operatorCategory: expectedCategory,
      categoryLabel: expectedCategory === 'content' ? '笔记确认' : expectedCategory === 'material' ? '素材待办' : '异常处理',
      status: '待执行',
      actionType: action,
      projectId: currentProject.id,
      projectName: currentProject.name,
      noteId: note.id,
      noteTitle: note.title,
      targetAccount: note.account || note.participant || '待匹配账号',
      accountType: note.type,
      operatorActionSummary: labelMap[action],
      reasonForIntervention: '操盘手从笔记列表主动发起操作，不依赖待办提醒。',
      deadlineLabel: '普通',
      isBlocked: false,
      waitingParty: '操盘手',
      waitingRole: 'operator',
      isMeWaiting: true,
      isTeamExecuting: false,
      isSystemProcessing: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      primaryActionLabel: labelMap[action],
      currentOccurrence: `正在处理笔记《${note.title}》的${labelMap[action]}操作。`,
      confirmedFacts: ['笔记及方案上下文已载入', '本次操作不会制造异常提醒'],
      nextStepAfterAction: nextStepMap[action],
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
      materialType: expectedCategory === 'material'
        ? action === 'replace_material' ? 'matched_library_asset' : 'returned_shooting_asset'
        : undefined,
      materialSubItems: expectedCategory === 'material' ? [{
        id: note.materialTask?.id || `material-${note.id}`,
        requirement: note.materialTask?.reqs || '补齐笔记所需真实场景素材',
        isRequired: true,
        uploadedAssets: [],
        autoCheckResult: note.materialTask?.status === '待验收' ? '素材已回传，等待人工验收' : '素材任务执行中，等待回传',
        manualStatus: note.materialTask?.status === '待验收' ? '待验收' : '待验收'
      }] : undefined,
      timelineEvents: [{ id: `event-${directTaskId}`, time: '刚刚', actor: '操盘手', action: `从方案中心发起${labelMap[action]}` }]
    };
    setTasks(previous => previous.some(item => item.id === directTaskId) ? previous : [directTask, ...previous]);
    setActiveTaskId(directTaskId);
    clearExecutionNavTarget();
  }, [executionNavTarget, tasks, currentProject, clearExecutionNavTarget]);

  // Find next task in category queue
  const handleSelectNextTask = () => {
    if (!activeTask || activeCategoryQueue.length === 0) return;
    const currentIndex = activeCategoryQueue.findIndex(t => t.id === activeTask.id);
    if (currentIndex >= 0 && currentIndex < activeCategoryQueue.length - 1) {
      setActiveTaskId(activeCategoryQueue[currentIndex + 1].id);
      setActiveDirectAction(undefined);
    } else if (activeCategoryQueue.length > 0) {
      setActiveTaskId(activeCategoryQueue[0].id);
      setActiveDirectAction(undefined);
    }
  };

  // Update task handler
  const handleUpdateTask = (updated: ExecutionTask) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (updated.status !== '已完成' || !updated.noteId) return;

    const action = updated.actionType || (
      updated.operatorCategory === 'content' ? 'edit_content' :
      updated.operatorCategory === 'material'
        ? updated.materialType === 'matched_library_asset' ? 'replace_material' : 'review_material'
        : updated.operatorCategory === 'publish' ? 'publish_confirm' : 'handle_publish_error'
    );
    const contextNote = currentProject?.notes.find(note => note.id === updated.noteId);

    if (action === 'edit_content' || action === 'replace_material' || action === 'create_material_task') {
      const hasGeneratedMaterialTasks = Boolean(updated.generatedMaterialTasks?.length);
      const selectedMaterials = (updated.selectedMaterialAssets || []).map((material, index) => ({
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
        selectedMaterials: selectedMaterials.length > 0 ? selectedMaterials : undefined,
        materialStatus: hasGeneratedMaterialTasks ? '待收集' : selectedMaterials.length > 0 ? '已齐' : undefined
      });
      clearNoteIssue(updated.projectId, updated.noteId);
    } else if (action === 'review_material' || action === 'view_material_task') {
      const requiresReshoot = updated.materialSubItems?.some(item => item.manualStatus === '需补拍');
      updateNoteStatus(updated.projectId, updated.noteId, {
        materialStatus: requiresReshoot ? '待收集' : '已齐',
        materialTask: contextNote?.materialTask ? {
          ...contextNote.materialTask,
          status: requiresReshoot ? '执行中' : '已验收'
        } : undefined
      });
      if (!requiresReshoot) clearNoteIssue(updated.projectId, updated.noteId);
    } else if (action === 'publish_confirm') {
      updateNoteStatus(updated.projectId, updated.noteId, {
        publishStatus: '已发布',
        publishLink: updated.returnedData?.publishUrl
      });
      clearNoteIssue(updated.projectId, updated.noteId);
    } else if (action === 'handle_publish_error') {
      clearNoteIssue(updated.projectId, updated.noteId);
    }
  };

  // If a task is active, render TaskDetailView
  if (activeTask) {
    const integratedNoteActions: ExecutionAction[] = ['edit_content', 'replace_material', 'create_material_task'];
    const useIntegratedNoteWorkbench = activeTask.operatorCategory === 'content' || Boolean(
      (activeDirectAction && integratedNoteActions.includes(activeDirectAction)) ||
      (activeTask.actionType && integratedNoteActions.includes(activeTask.actionType))
    );

    if (useIntegratedNoteWorkbench) {
      return (
        <TaskDetailView
          task={activeTask}
          initialAction={activeDirectAction}
          categoryQueue={activeCategoryQueue}
          onSelectTask={(task) => { setActiveTaskId(task.id); setActiveDirectAction(undefined); }}
          onBack={() => { setActiveTaskId(null); setActiveDirectAction(undefined); }}
          onUpdateTask={handleUpdateTask}
          onNextTask={activeCategoryQueue.length > 1 ? handleSelectNextTask : undefined}
        />
      );
    }

    return (
      <OperatorTaskWorkbench
        task={activeTask}
        initialAction={activeDirectAction}
        categoryQueue={activeCategoryQueue}
        onSelectTask={(task) => { setActiveTaskId(task.id); setActiveDirectAction(undefined); }}
        onBack={() => { setActiveTaskId(null); setActiveDirectAction(undefined); }}
        onUpdateTask={handleUpdateTask}
        onNextTask={activeCategoryQueue.length > 1 ? handleSelectNextTask : undefined}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-y-auto">
      
      {/* 1. Header Section */}
      <div className="px-6 py-5 bg-surface border-b border-border-default shrink-0">
        <div>
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary tracking-tight">
              执行中心
            </h1>
            <p className="text-[13px] text-text-secondary mt-1">
              只呈现无法自动继续的决策、验收与纠偏 · 其余流程在后台运行
            </p>
          </div>

        </div>
      </div>

      {/* 2. Filter & Tools Bar */}
      <div className="px-6 py-3.5 bg-surface border-b border-border-default sticky top-0 z-10 space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border-subtle">
            <button
              type="button"
              onClick={() => { setQueueView('operator'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                queueView === 'operator' && selectedCategory === 'all'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              待我处理 ({operatorTodoCount})
            </button>

            <button
              type="button"
              onClick={() => { setQueueView('background'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                queueView === 'background' && selectedCategory === 'all'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              执行动态 ({backgroundFlowCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('content')}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                selectedCategory === 'content'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {queueView === 'operator' ? '内容风险' : '内容生成'} ({categoryCounts.content})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('material')}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                selectedCategory === 'material'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {queueView === 'operator' ? '素材决策' : '素材执行'} ({categoryCounts.material})
            </button>

            {queueView === 'background' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('publish')}
                className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                  selectedCategory === 'publish'
                    ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                发布任务 ({categoryCounts.publish})
              </button>
            )}

            {queueView === 'operator' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('anomaly')}
                className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                  selectedCategory === 'anomaly'
                    ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                异常纠偏 ({categoryCounts.anomaly})
              </button>
            )}
          </div>

          {/* Right Tools: Project Selector, Search */}
          <div className="flex items-center gap-2.5">
            
            {/* Project Filter */}
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 text-[12.5px] bg-surface border border-border-default rounded-lg text-text-primary focus:outline-none focus:border-neutral-900"
            >
              <option value="all">全部方案</option>
              {projectOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索任务、账号或执行人..."
                className="pl-8 pr-3 py-1.5 text-[12.5px] bg-surface border border-border-default rounded-lg text-text-primary focus:outline-none focus:border-neutral-900 w-52 placeholder:text-text-tertiary"
              />
              <Search size={14} className="absolute left-2.5 top-2 text-text-tertiary" />
            </div>

          </div>

        </div>

      </div>

      {/* 3. Task List Section */}
      <div className="p-6 space-y-4 max-w-6xl w-full">
        <div className="flex items-center justify-between text-[12px] text-text-secondary px-1">
          <span>{queueView === 'operator' ? `待处理 ${filteredTasks.length} 项` : `执行动态 ${filteredTasks.length} 项`}</span>
          <span>{queueView === 'operator' ? '仅显示必须由你操作后才能继续的事项' : '发布任务与其他执行中的事项不会计入待我处理'}</span>
        </div>

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center bg-surface border border-border-default rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-[14px] font-semibold text-text-primary">
              {queueView === 'operator' ? '当前暂无待操盘手处理的事项' : '当前暂无执行中的事项'}
            </div>
            <div className="text-[12.5px] text-text-secondary max-w-md mx-auto">
              {queueView === 'operator' ? '当前分类下暂无需要人工判断的任务。' : '当前分类下没有员工、KOC 或 Agent 正在执行的事项。'}
            </div>
          </div>
        )}

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => { setActiveTaskId(task.id); setActiveDirectAction(undefined); }}
                className="p-4 bg-surface rounded-xl border border-border-default hover:border-border-strong transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-subtle text-text-secondary border border-border-subtle">
                          {task.operatorCategory === 'content' && (queueView === 'operator' ? '内容风险' : '内容生成')}
                          {task.operatorCategory === 'material' && (queueView === 'operator' ? '素材决策' : '素材执行')}
                          {task.operatorCategory === 'publish' && '发布任务'}
                          {task.operatorCategory === 'anomaly' && '异常纠偏'}
                        </span>
                        <span className="text-[11.5px] text-text-tertiary">{task.noteTitle}</span>
                        {task.isBlocked && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            阻断流转
                          </span>
                        )}
                        {queueView === 'background' && task.operatorCategory === 'publish' && task.publishExecutorType && <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200">{task.publishExecutorType}</span>}
                        {queueView === 'background' && task.operatorCategory === 'publish' && task.publishStage && <span className="px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200">{task.publishStage}</span>}
                        {queueView === 'background' && task.operatorCategory !== 'publish' && <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200">{task.isSystemProcessing ? 'Agent 处理中' : '员工执行中'}</span>}
                      </div>
                      <div className="text-[14.5px] font-semibold text-text-primary group-hover:text-black transition-colors">{task.operatorActionSummary}</div>
                      <div className="text-[12.5px] text-text-secondary leading-5">{queueView === 'operator' ? task.reasonForIntervention : task.currentOccurrence}</div>
                      <div className="pt-1 flex items-center gap-4 text-[11.5px] text-text-tertiary">
                        <span>账号：<strong className="text-text-secondary font-medium">{task.targetAccount}</strong></span>
                        {queueView !== 'operator' && <span>当前执行：<strong className="text-text-secondary font-medium">{task.waitingParty}</strong></span>}
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          <span className={task.deadlineLabel === '已逾期' ? 'text-rose-600 font-medium' : ''}>
                            {formatChineseDate(task.deadline, true) || task.deadline || '未设置'} {task.deadlineLabel && `(${task.deadlineLabel})`}
                          </span>
                        </span>
                      </div>
                  </div>
                  <div className="shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTaskId(task.id);
                        setActiveDirectAction(undefined);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-1 ${queueView === 'operator' ? 'text-white bg-action-primary hover:bg-action-primary-hover' : 'text-text-secondary bg-surface-subtle border border-border-default hover:bg-hover-bg'}`}
                    >
                      <span>{queueView === 'operator' ? task.primaryActionLabel : '查看进度'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

      </div>

    </div>
  );
}
