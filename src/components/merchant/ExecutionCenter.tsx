import React, { useState, useMemo } from 'react';
import { 
  Search, CheckCircle2, AlertCircle, Clock, Filter, 
  RefreshCw, CheckSquare, Square, ChevronRight, User, 
  Tag, Calendar, Sparkles, Send, RotateCcw, Pin, ShieldCheck,
  AlertTriangle, ChevronDown, Check, ArrowRight, CornerDownRight,
  MoreHorizontal, Users, Bot, UserCheck, Layers, FileText, Camera,
  Share2, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import { ExecutionCategory, ExecutionTask } from './ExecutionCenter/types';
import { INITIAL_EXECUTION_TASKS } from './ExecutionCenter/mockData';
import { TaskDetailView } from './ExecutionCenter/TaskDetailView';
import { BatchActionModal } from './ExecutionCenter/BatchActionModal';

export function ExecutionCenter() {
  const { currentProject } = useProjectStore();

  // Tasks state
  const [tasks, setTasks] = useState<ExecutionTask[]>(INITIAL_EXECUTION_TASKS);
  
  // Selection and Active Task
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Filter Axes
  const [selectedCategory, setSelectedCategory] = useState<ExecutionCategory>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Batch Action Modal state
  const [batchActionType, setBatchActionType] = useState<'remind' | 'change_assignee' | 'extend_deadline' | 'cancel_task' | null>(null);

  // Available Project Names for filter dropdown
  const projectOptions = useMemo(() => {
    const names = new Set<string>();
    tasks.forEach(t => names.add(t.projectName));
    if (currentProject?.title) names.add(currentProject.title);
    return Array.from(names);
  }, [tasks, currentProject]);

  // Statistics calculation for the 3 top metrics
  const stats = useMemo(() => {
    const needMyActionTasks = tasks.filter(t => t.isMeWaiting && t.status !== '已完成' && t.status !== '已取消');
    const todayDeadlineTasks = needMyActionTasks.filter(t => t.deadlineLabel === '今日到期' || t.deadlineLabel === '已逾期');
    const blockedTasks = needMyActionTasks.filter(t => t.isBlocked);

    return {
      needMyActionCount: needMyActionTasks.length,
      todayDeadlineCount: todayDeadlineTasks.length,
      blockedCount: blockedTasks.length
    };
  }, [tasks]);

  // Category counts for the tabs
  const categoryCounts = useMemo(() => {
    const base = tasks.filter(t => t.status !== '已完成' && t.status !== '已取消');
    return {
      all: base.filter(t => t.isMeWaiting).length,
      content: base.filter(t => t.isMeWaiting && t.operatorCategory === 'content').length,
      material: base.filter(t => t.isMeWaiting && t.operatorCategory === 'material').length,
      publish: base.filter(t => t.isMeWaiting && t.operatorCategory === 'publish').length,
      anomaly: base.filter(t => t.isMeWaiting && t.operatorCategory === 'anomaly').length
    };
  }, [tasks]);

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Only show tasks requiring operator action / pending
      if (!task.isMeWaiting || task.status === '已完成' || task.status === '已取消') {
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
  }, [tasks, selectedCategory, selectedProjectFilter, searchKeyword]);

  // Active Task Object
  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  // Active task's category queue
  const activeCategoryQueue = useMemo(() => {
    if (!activeTask) return [];
    return tasks.filter(t => t.operatorCategory === activeTask.operatorCategory && t.status !== '已完成' && t.status !== '已取消');
  }, [tasks, activeTask]);

  // Find next task in category queue
  const handleSelectNextTask = () => {
    if (!activeTask || activeCategoryQueue.length === 0) return;
    const currentIndex = activeCategoryQueue.findIndex(t => t.id === activeTask.id);
    if (currentIndex >= 0 && currentIndex < activeCategoryQueue.length - 1) {
      setActiveTaskId(activeCategoryQueue[currentIndex + 1].id);
    } else if (activeCategoryQueue.length > 0) {
      setActiveTaskId(activeCategoryQueue[0].id);
    }
  };

  // Selection handlers
  const handleToggleSelectTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };

  // Update task handler
  const handleUpdateTask = (updated: ExecutionTask) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  // Batch update handler
  const handleBatchUpdateTasks = (updatedList: ExecutionTask[]) => {
    setTasks(prev => {
      const map = new Map(updatedList.map(u => [u.id, u]));
      return prev.map(t => map.has(t.id) ? map.get(t.id)! : t);
    });
    setSelectedTaskIds([]);
    setBatchActionType(null);
  };

  // If a task is active, render TaskDetailView
  if (activeTask) {
    return (
      <TaskDetailView
        task={activeTask}
        categoryQueue={activeCategoryQueue}
        onSelectTask={(task) => setActiveTaskId(task.id)}
        onBack={() => setActiveTaskId(null)}
        onUpdateTask={handleUpdateTask}
        onNextTask={activeCategoryQueue.length > 1 ? handleSelectNextTask : undefined}
      />
    );
  }

  // Selected tasks array for batch modal
  const selectedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-y-auto">
      
      {/* 1. Header Section */}
      <div className="px-6 py-5 bg-surface border-b border-border-default shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary tracking-tight">
              执行中心
            </h1>
            <p className="text-[13px] text-text-secondary mt-1">
              聚焦操盘手决策、验收与纠偏 · 员工正在执行的任务不默认占满工作台
            </p>
          </div>

          {/* 3 Focused Stats */}
          <div className="flex items-center gap-3">
            
            {/* Stat 1: 待操盘手处理 */}
            <div className="px-3.5 py-2 rounded-lg bg-surface-subtle border border-border-default min-w-[100px]">
              <div className="text-[11.5px] text-text-tertiary">待操盘手处理</div>
              <div className="text-[18px] font-semibold text-text-primary mt-0.5 tabular-nums">
                {stats.needMyActionCount} <span className="text-[12px] font-normal text-text-secondary">项</span>
              </div>
            </div>

            {/* Stat 2: 今日截止 */}
            <div className="px-3.5 py-2 rounded-lg bg-surface-subtle border border-border-default min-w-[100px]">
              <div className="text-[11.5px] text-text-tertiary">今日截止</div>
              <div className={`text-[18px] font-semibold mt-0.5 tabular-nums ${stats.todayDeadlineCount > 0 ? 'text-amber-800' : 'text-text-primary'}`}>
                {stats.todayDeadlineCount} <span className="text-[12px] font-normal text-text-secondary">项</span>
              </div>
            </div>

            {/* Stat 3: 阻断中 */}
            <div className="px-3.5 py-2 rounded-lg bg-surface-subtle border border-border-default min-w-[100px]">
              <div className="text-[11.5px] text-text-tertiary">阻断流转</div>
              <div className={`text-[18px] font-semibold mt-0.5 tabular-nums ${stats.blockedCount > 0 ? 'text-rose-600' : 'text-text-primary'}`}>
                {stats.blockedCount} <span className="text-[12px] font-normal text-text-secondary">项</span>
              </div>
            </div>

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
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              全部待办 ({categoryCounts.all})
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
              笔记确认 ({categoryCounts.content})
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
              素材待办 ({categoryCounts.material})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('publish')}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                selectedCategory === 'publish'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              发布核销 ({categoryCounts.publish})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('anomaly')}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                selectedCategory === 'anomaly'
                  ? 'bg-surface text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              异常处理 ({categoryCounts.anomaly})
            </button>
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

        {/* Batch Operation Bar (when items selected) */}
        {selectedTaskIds.length > 0 && (
          <div className="p-2.5 bg-surface-subtle border border-border-default rounded-lg flex items-center justify-between text-[12.5px] animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-primary">
                已选中 <strong>{selectedTaskIds.length}</strong> 项任务
              </span>
              <button
                type="button"
                onClick={() => setSelectedTaskIds([])}
                className="text-text-tertiary hover:text-text-primary underline text-[11.5px]"
              >
                取消全选
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBatchActionType('remind')}
                className="px-3 py-1 bg-surface hover:bg-surface-hover border border-border-default rounded-md text-text-primary font-medium transition-colors"
              >
                批量发送催促提醒
              </button>
              <button
                type="button"
                onClick={() => setBatchActionType('change_assignee')}
                className="px-3 py-1 bg-surface hover:bg-surface-hover border border-border-default rounded-md text-text-primary font-medium transition-colors"
              >
                批量调整负责人
              </button>
              <button
                type="button"
                onClick={() => setBatchActionType('extend_deadline')}
                className="px-3 py-1 bg-surface hover:bg-surface-hover border border-border-default rounded-md text-text-primary font-medium transition-colors"
              >
                批量调整截止时间
              </button>
              <button
                type="button"
                onClick={() => setBatchActionType('cancel_task')}
                className="px-3 py-1 bg-surface hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-medium transition-colors"
              >
                批量标记不再需要
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 3. Task List Section */}
      <div className="p-6 space-y-4 max-w-6xl">
        
        {/* Table Header / Select all */}
        <div className="flex items-center justify-between text-[12px] text-text-secondary px-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllVisible}
              className="text-text-tertiary hover:text-text-primary flex items-center gap-1.5"
            >
              {selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0 ? (
                <CheckSquare size={15} className="text-neutral-900" />
              ) : (
                <Square size={15} />
              )}
              <span>全选可见 ({filteredTasks.length})</span>
            </button>
          </div>
          <span>点击任务进入单条协作或处理</span>
        </div>

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center bg-surface border border-border-default rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-[14px] font-semibold text-text-primary">
              当前暂无待操盘手处理的事项
            </div>
            <div className="text-[12.5px] text-text-secondary max-w-md mx-auto">
              当前分类下暂无需要您人工介入或确认的任务，所有团队流程均在有序推进中。
            </div>
          </div>
        )}

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id);
            const isBatchGroup = task.isBatchGroup;

            return (
              <div
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={`p-4 bg-surface rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected 
                    ? 'border-neutral-900 ring-1 ring-neutral-900/10' 
                    : 'border-border-default hover:border-border-strong'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left checkbox & Main Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelectTask(task.id, e)}
                      className="mt-0.5 text-text-tertiary hover:text-text-primary shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-neutral-900" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      
                      {/* Top tags & Category */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Operator Category badge */}
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-subtle text-text-secondary border border-border-subtle">
                          {task.operatorCategory === 'content' && '笔记确认'}
                          {task.operatorCategory === 'material' && '素材验收'}
                          {task.operatorCategory === 'publish' && '发布核销'}
                          {task.operatorCategory === 'anomaly' && '异常处理'}
                        </span>

                        {/* Project name */}
                        <span className="text-[12px] text-text-tertiary">
                          {task.projectName}
                        </span>

                        {/* Blocked Badge */}
                        {task.isBlocked && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            阻断流转
                          </span>
                        )}

                        {/* Anomaly Badge */}
                        {task.isAnomaly && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            异常警报
                          </span>
                        )}

                        {/* Batch Group Badge */}
                        {isBatchGroup && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-900 text-white">
                            批量任务 ({task.batchGroupCount} 篇)
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div className="text-[14.5px] font-semibold text-text-primary group-hover:text-black transition-colors flex items-center gap-2">
                        <span>{task.title}</span>
                      </div>

                      {/* Operator Action Summary & Reason */}
                      <div className="text-[12.5px] text-text-secondary leading-snug">
                        <strong className="text-text-primary">动作要求：</strong>{task.operatorActionSummary}
                        {task.reasonForIntervention && (
                          <span className="text-text-tertiary ml-2">（{task.reasonForIntervention}）</span>
                        )}
                      </div>

                      {/* Batch Children Preview / Details snippet */}
                      {isBatchGroup && task.batchChildrenPreview && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {task.batchChildrenPreview.map((item) => (
                            <span key={item.id} className="px-2 py-1 bg-surface-subtle rounded text-[11.5px] text-text-secondary border border-border-subtle flex items-center gap-1">
                              <span>{item.account}: {item.title}</span>
                              <span className="text-[10px] text-text-tertiary">({item.status})</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom row: Account, Waiting Role, Deadline */}
                      <div className="pt-2 flex items-center gap-4 text-[12px] text-text-tertiary">
                        <span>目标账号：<strong className="text-text-secondary font-medium">{task.targetAccount}</strong></span>
                        <span>等待：<strong className="text-text-secondary font-medium">{task.waitingParty}</strong></span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          <span className={task.deadlineLabel === '已逾期' ? 'text-rose-600 font-medium' : ''}>
                            {task.deadline} {task.deadlineLabel && `(${task.deadlineLabel})`}
                          </span>
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Right Primary Action Button */}
                  <div className="shrink-0 flex flex-col items-end justify-between h-full pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTaskId(task.id);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-white bg-action-primary hover:bg-action-primary-hover transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>
                        {task.operatorCategory === 'content' ? (isBatchGroup ? '逐篇确认' : '确认笔记') :
                         task.operatorCategory === 'material' ? '验收素材' :
                         task.operatorCategory === 'publish' ? '核销归档' :
                         '处理异常'}
                      </span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Batch Action Modal */}
      {batchActionType && (
        <BatchActionModal
          actionType={batchActionType}
          selectedTasks={selectedTasks}
          onClose={() => setBatchActionType(null)}
          onSuccess={handleBatchUpdateTasks}
        />
      )}

    </div>
  );
}
