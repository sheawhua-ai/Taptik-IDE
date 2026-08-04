import React, { useState, useEffect } from "react";
import { 
  PenTool, Image as ImageIcon, Send, MessageSquare, AlertTriangle, 
  ChevronRight, CheckCircle2, Search, Filter, ArrowLeft, User, Calendar, Clock, RotateCcw
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { InteractionWorkbench } from "../rings/InteractionWorkbench";

export function ExecutionCenter() {
  const { 
    projects, 
    enrichedActionTasks, 
    resolveActionTask, 
    jumpToProject, 
    executionNavTarget,
    setExecutionNavTarget
  } = useProjectStore();

  const [activeWorkbench, setActiveWorkbench] = useState<string | null>(null);

  // Filters
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(
    executionNavTarget?.projectId || "all"
  );
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("all"); // all, content, assets, publish, interaction
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all"); // all, today, week
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all"); // all, blocker, wait_external
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync nav target if changed from outside
  useEffect(() => {
    if (executionNavTarget?.projectId) {
      setSelectedProjectFilter(executionNavTarget.projectId);
    }
  }, [executionNavTarget]);

  // All pending tasks across all projects
  const pendingTasks = enrichedActionTasks.filter((t) => t.status === "pending");

  // Extract assignees list
  const assignees = Array.from(new Set(pendingTasks.map((t) => t.assignee))).filter(Boolean);

  // Filtered pending tasks
  const filteredTasks = pendingTasks.filter((t) => {
    // Project filter
    if (selectedProjectFilter !== "all" && t.projectId !== selectedProjectFilter) {
      return false;
    }
    // Stage filter
    if (selectedStageFilter !== "all" && t.impactedStage !== selectedStageFilter) {
      return false;
    }
    // Assignee filter
    if (selectedAssigneeFilter !== "all" && t.assignee !== selectedAssigneeFilter) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter === "blocker" && t.severity !== "blocker") {
      return false;
    }
    if (selectedStatusFilter === "wait_external" && (!t.waitOn || t.waitOn.length === 0)) {
      return false;
    }
    // Date filter
    if (selectedDateFilter === "today") {
      const today = new Date().toISOString().slice(0, 10);
      if (t.plannedDate > today) return false;
    }
    // Search query
    if (
      searchQuery &&
      !t.issueMessage.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.noteTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort tasks: Blocker first, then date/time
  const sortedFilteredTasks = [...filteredTasks].sort((a, b) => {
    const aBlocker = a.severity === "blocker" ? 1 : 0;
    const bBlocker = b.severity === "blocker" ? 1 : 0;
    if (aBlocker !== bBlocker) return bBlocker - aBlocker;
    return a.plannedDate.localeCompare(b.plannedDate);
  });

  const topFocusTask = sortedFilteredTasks[0];

  // Group counts by stage
  const pendingContentTasks = pendingTasks.filter((t) => t.impactedStage === "content");
  const pendingAssetTasks = pendingTasks.filter((t) => t.impactedStage === "assets");
  const pendingPublishTasks = pendingTasks.filter((t) => t.impactedStage === "publish");
  const pendingInteractionTasks = pendingTasks.filter((t) => t.impactedStage === "interaction");

  const stageCategories = [
    {
      id: "content",
      title: "内容确认",
      icon: PenTool,
      count: pendingContentTasks.length,
      topTask: pendingContentTasks[0]
    },
    {
      id: "assets",
      title: "素材与回传",
      icon: ImageIcon,
      count: pendingAssetTasks.length,
      topTask: pendingAssetTasks[0]
    },
    {
      id: "publish",
      title: "发布任务与异常",
      icon: Send,
      count: pendingPublishTasks.length,
      topTask: pendingPublishTasks[0]
    },
    {
      id: "interaction",
      title: "互动与线索",
      icon: MessageSquare,
      count: pendingInteractionTasks.length,
      topTask: pendingInteractionTasks[0]
    }
  ];

  if (activeWorkbench === "content") {
    return <ContentReviewWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "assets") {
    return <ShootingAndUploadWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "publish") {
    return <PublishExceptionWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "interaction") {
    return <InteractionWorkbench onClose={() => setActiveWorkbench(null)} />;
  }

  const targetProject = projects.find((p) => p.id === selectedProjectFilter);

  return (
    <div className="h-full w-full bg-[#f8f9fa] p-8 overflow-y-auto text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[22px] font-extrabold text-neutral-900">执行中心</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-neutral-900 text-white">
                全系统共 {pendingTasks.length} 项待处理
              </span>
            </div>
            <p className="text-[13px] text-neutral-500">
              集中式 ActionTask 任务池：跨项目统一调度、筛选与批量处理
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Return to Project button if navigated from Project Center */}
            {executionNavTarget?.projectId && (
              <button
                onClick={() => jumpToProject(executionNavTarget.projectId)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[13px] font-bold rounded-xl transition-all flex items-center gap-1.5 border border-neutral-200"
              >
                <ArrowLeft size={16} />
                返回项目：{targetProject?.name || "项目中心"}
              </button>
            )}

            <button 
              onClick={() => {
                setSelectedProjectFilter("all");
                setSelectedStageFilter("all");
                setSelectedAssigneeFilter("all");
                setSelectedDateFilter("all");
                setSelectedStatusFilter("all");
                setSearchQuery("");
                if (setExecutionNavTarget) setExecutionNavTarget(null);
              }}
              className="px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[13px] font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <RotateCcw size={14} />
              重置筛选
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-wrap items-center gap-3 text-[13px]">
          {/* Project Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-medium">项目:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-neutral-800 outline-none focus:border-neutral-400"
            >
              <option value="all">全部项目 ({pendingTasks.length}项)</option>
              {projects.map((p) => {
                const pCount = pendingTasks.filter((t) => t.projectId === p.id).length;
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} ({pCount}项)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Stage Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-medium">类型:</span>
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-neutral-800 outline-none focus:border-neutral-400"
            >
              <option value="all">全部类型</option>
              <option value="content">内容确认 ({pendingContentTasks.length})</option>
              <option value="assets">素材与回传 ({pendingAssetTasks.length})</option>
              <option value="publish">发布任务与异常 ({pendingPublishTasks.length})</option>
              <option value="interaction">互动与线索 ({pendingInteractionTasks.length})</option>
            </select>
          </div>

          {/* Assignee Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-medium">负责人:</span>
            <select
              value={selectedAssigneeFilter}
              onChange={(e) => setSelectedAssigneeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-neutral-800 outline-none focus:border-neutral-400"
            >
              <option value="all">全部负责人</option>
              {assignees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Status/Blocker Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-medium">状态:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-neutral-800 outline-none focus:border-neutral-400"
            >
              <option value="all">全部状态</option>
              <option value="blocker">仅阻断卡点</option>
              <option value="wait_external">仅等待外部</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            <input
              type="text"
              placeholder="搜索任务/笔记/项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:bg-white focus:border-neutral-400 text-[13px]"
            />
          </div>
        </div>

        {/* Focus Card ("现在处理") */}
        {topFocusTask ? (
          <div>
            <h2 className="text-[15px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-neutral-900" />
              优先推荐处理
            </h2>
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs flex flex-col relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {topFocusTask.projectName}
                  </span>
                  <span className="text-[12px] font-bold text-neutral-500">
                    [{topFocusTask.noteTitle}]
                  </span>
                </div>
                
                {topFocusTask.severity === "blocker" ? (
                  <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                    阻断卡点
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                    待确认
                  </span>
                )}
              </div>

              <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="space-y-2 flex-1 min-w-[300px]">
                  <h3 className="text-[18px] font-extrabold text-neutral-900">
                    {topFocusTask.issueMessage}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-neutral-500">
                    <span className="flex items-center gap-1"><User size={13}/> 负责人: <strong className="text-neutral-800">{topFocusTask.assignee}</strong></span>
                    <span className="flex items-center gap-1"><Calendar size={13}/> 截止日期: <strong className="text-neutral-800">{topFocusTask.plannedDate}</strong></span>
                    {topFocusTask.waitOn && (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                        <Clock size={12}/> 等待: {topFocusTask.waitOn}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => resolveActionTask(topFocusTask.id)}
                    className="px-4 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-xl text-[13px] font-bold transition-colors"
                  >
                    快捷完成
                  </button>
                  <button
                    onClick={() => setActiveWorkbench(topFocusTask.impactedStage)}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    去工作区处理 <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
                优先级计算依据：阻断执行 ＞ 截止时间 ＞ 关联影响范围
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-neutral-200 shadow-2xs text-center flex flex-col items-center">
            <CheckCircle2 size={44} className="text-emerald-500 mb-3" />
            <h2 className="text-[17px] font-bold text-neutral-900 mb-1">当前条件下暂无待处理 ActionTask</h2>
            <p className="text-[13px] text-neutral-500">已处理完成或无符合当前筛选条件的任务。</p>
          </div>
        )}

        {/* 4 Category Workbenches Inbox Grid */}
        <div>
          <h2 className="text-[15px] font-bold text-neutral-900 mb-3">各阶段待办统计与直达</h2>
          <div className="grid grid-cols-2 gap-4">
            {stageCategories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setActiveWorkbench(cat.id)}
                className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs hover:border-neutral-400 transition-all cursor-pointer flex flex-col justify-between group min-h-[150px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <cat.icon size={18} className="text-neutral-800" />
                      <h3 className="text-[15px] font-bold text-neutral-900">{cat.title}</h3>
                    </div>
                    <div className="text-[18px] font-extrabold text-neutral-900 leading-none">
                      {cat.count} <span className="text-[12px] font-normal text-neutral-500">项</span>
                    </div>
                  </div>
                  
                  {cat.count > 0 && cat.topTask ? (
                    <div>
                      <div className="text-[13px] font-bold text-neutral-800 line-clamp-1 mb-1">
                        {cat.topTask.issueMessage}
                      </div>
                      <div className="text-[12px] text-neutral-500 line-clamp-1">
                        关联笔记：{cat.topTask.noteTitle} ({cat.topTask.assignee})
                      </div>
                    </div>
                  ) : (
                    <div className="text-[13px] text-neutral-400 flex items-center gap-1.5 mt-2">
                      <CheckCircle2 size={14} /> 暂无待处理事项
                    </div>
                  )}
                </div>

                <div className="text-[12px] font-bold text-neutral-500 group-hover:text-neutral-900 flex items-center gap-1 transition-colors pt-3 border-t border-neutral-100">
                  进入工作区处理 <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Filtered ActionTask Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h2 className="text-[15px] font-bold text-neutral-900">
              任务列表 ({sortedFilteredTasks.length} 项)
            </h2>
            <span className="text-[12px] text-neutral-500 font-medium">
              实时同步全系统最新处理结果
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 text-[12px]">
                  <th className="p-3.5 font-bold">任务说明</th>
                  <th className="p-3.5 font-bold">所属项目</th>
                  <th className="p-3.5 font-bold">关联笔记</th>
                  <th className="p-3.5 font-bold">负责人</th>
                  <th className="p-3.5 font-bold">截止日期</th>
                  <th className="p-3.5 font-bold">状态/卡点</th>
                  <th className="p-3.5 font-bold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedFilteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3.5 font-bold text-neutral-900">
                      {task.issueMessage}
                    </td>
                    <td className="p-3.5 text-neutral-700 font-medium">
                      {task.projectName}
                    </td>
                    <td className="p-3.5 text-neutral-700">
                      <div className="font-medium line-clamp-1">{task.noteTitle}</div>
                      <div className="text-[11px] text-neutral-400">{task.accountName}</div>
                    </td>
                    <td className="p-3.5 text-neutral-800 font-medium">
                      {task.assignee}
                    </td>
                    <td className="p-3.5 text-neutral-700 font-medium">
                      {task.plannedDate}
                    </td>
                    <td className="p-3.5">
                      {task.severity === "blocker" ? (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-red-100 text-red-800 border border-red-200">
                          阻断
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                          待确认
                        </span>
                      )}
                      {task.waitOn && (
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-neutral-100 text-neutral-600">
                          等待:{task.waitOn}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => resolveActionTask(task.id)}
                        className="px-2.5 py-1 text-[12px] font-bold bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded transition-colors"
                      >
                        完成
                      </button>
                      <button
                        onClick={() => setActiveWorkbench(task.impactedStage)}
                        className="px-3 py-1 text-[12px] font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded transition-colors"
                      >
                        处理
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
