import React from "react";
import { Plus, Search, Calendar, PanelLeftClose, AlertTriangle, CheckCircle2, Clock, Sparkles, Layers } from "lucide-react";
import { ReviewTask } from "./types";
import { formatChineseDate } from "../../../utils/formatDate";

interface ReviewTaskListProps {
  tasks: ReviewTask[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
  onOpenCreateModal: () => void;
  onCloseSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  scopeFilter: string;
  setScopeFilter: (val: string) => void;
}

export function ReviewTaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  onOpenCreateModal,
  onCloseSidebar,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  scopeFilter,
  setScopeFilter,
}: ReviewTaskListProps) {
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchProjects = t.projectNames.some((p) => p.toLowerCase().includes(q));
      if (!matchTitle && !matchProjects) return false;
    }

    if (statusFilter === "分析中" && t.status !== "analyzing") return false;
    if (statusFilter === "已完成" && t.status !== "completed") return false;
    if (statusFilter === "数据不足" && t.status !== "exception") return false;

    if (scopeFilter === "单方案" && t.mode !== "single") return false;
    if (scopeFilter === "多方案" && t.mode !== "multi") return false;

    return true;
  });

  return (
    <div className="h-full w-[320px] bg-surface-1 border-r border-border-default flex flex-col shrink-0 z-10 overflow-hidden font-sans">
      {/* Header & Actions */}
      <div className="p-4 border-b border-border-default space-y-3 shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-[15px] font-semibold text-text-main tracking-tight">复盘任务</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-btn-main text-white text-[12px] font-medium hover:bg-btn-main-hover transition-colors shadow-2xs"
              title="新建复盘任务"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>新建复盘</span>
            </button>
            <button
              onClick={onCloseSidebar}
              title="收起任务列表"
              className="w-7 h-7 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={13} />
          <input
            type="text"
            placeholder="搜索复盘任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[12.5px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-1 pt-0.5">
          {["全部", "分析中", "已完成", "数据不足"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              title={st === "数据不足" ? "关键数据缺失或授权中断，无法形成可靠结论时认定" : undefined}
              className={`px-2 py-1 text-[11px] rounded-md font-medium transition-colors ${
                statusFilter === st
                  ? "bg-btn-main text-white"
                  : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Scope Filter Sub-row */}
        <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-0.5">
          <div className="flex gap-1.5">
            {["全部范围", "单方案", "多方案"].map((sc) => {
              const active = (sc === "全部范围" && scopeFilter === "全部") || scopeFilter === sc;
              return (
                <button
                  key={sc}
                  onClick={() => setScopeFilter(sc === "全部范围" ? "全部" : sc)}
                  className={`hover:text-text-main transition-colors ${active ? "text-text-main font-semibold underline underline-offset-4" : "text-text-tertiary"}`}
                >
                  {sc}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-text-disabled">共 {filteredTasks.length} 项</span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border-subtle">
        {filteredTasks.length === 0 ? (
          <div className="p-6 text-center text-text-tertiary text-[12.5px] space-y-3">
            <div className="w-10 h-10 rounded-full bg-surface-subtle border border-border-default mx-auto flex items-center justify-center text-text-disabled">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-medium text-text-secondary">还没有复盘任务</p>
              <p className="text-[11.5px] text-text-tertiary mt-0.5">
                你可以创建一个复盘任务，按方案、复盘方向和观察窗口生成复盘结果
              </p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="px-3 py-1.5 bg-btn-main text-white rounded-lg text-[12px] font-medium hover:bg-btn-main-hover transition-colors"
            >
              + 新建复盘
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isSelected = task.id === selectedTaskId;

            // Status style & tag
            let statusBadge = (
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] rounded-md font-medium">
                已完成
              </span>
            );
            if (task.status === "analyzing") {
              statusBadge = (
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10.5px] rounded-md font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  分析中
                </span>
              );
            } else if (task.status === "exception") {
              statusBadge = (
                <span className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10.5px] rounded-md font-medium">
                  数据不足
                </span>
              );
            }

            return (
              <button
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`w-full text-left p-3.5 transition-all relative group ${
                  isSelected
                    ? "bg-surface-subtle"
                    : "bg-transparent hover:bg-hover-bg text-text-main"
                }`}
              >
                {/* Left Active Indicator line */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-btn-main" />
                )}

                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[13px] line-clamp-1 ${
                      isSelected ? "font-semibold text-text-main" : "font-medium text-text-main"
                    }`}
                  >
                    {task.title}
                  </span>
                  {statusBadge}
                </div>

                {/* Date range */}
                <div className="flex items-center gap-1 text-[11.5px] text-text-secondary mb-1">
                  <Calendar size={12} className="text-text-tertiary shrink-0" />
                  <span className="truncate">{formatChineseDate(task.dateRange.start)} 至 {formatChineseDate(task.dateRange.end)}</span>
                </div>

                {/* Project Summary & Update time */}
                <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-0.5">
                  <span className="truncate max-w-[140px] flex items-center gap-1" title={task.projectNames.join(', ')}>
                    <Layers size={11} className="shrink-0 text-text-disabled" />
                    <span>{task.projectNames.length} 个方案 · {task.projectNames[0]}</span>
                  </span>
                  <span>{task.updatedAt}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
