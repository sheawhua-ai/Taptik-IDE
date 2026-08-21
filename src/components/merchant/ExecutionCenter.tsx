import React, { useState } from "react";
import { Search, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { InteractionWorkbench } from "../rings/InteractionWorkbench";

const STAGE_TABS = [
  { id: "all", label: "全部" },
  { id: "content", label: "内容确认" },
  { id: "assets", label: "素材审核" },
  { id: "publish", label: "发布处理" },
  { id: "interaction", label: "互动与线索" },
];

export function ExecutionCenter() {
  const { enrichedActionTasks } = useProjectStore();

  const [activeWorkbench, setActiveWorkbench] = useState<string | null>(null);
  const [selectedStageTab, setSelectedStageTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // All pending tasks across all projects
  const pendingTasks = enrichedActionTasks.filter((t) => t.status === "pending");

  // Filtered tasks by stage tab and search query
  const filteredTasks = pendingTasks.filter((t) => {
    if (selectedStageTab !== "all" && t.impactedStage !== selectedStageTab) {
      return false;
    }
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

  // Sorting: 1. 阻断 (Blocker) 2. 已逾期 (Overdue) 3. 即将到期 (Expiring soon) 4. 普通待办
  const todayStr = new Date().toISOString().slice(0, 10);

  const getTaskPriorityScore = (t: any) => {
    const isBlocker = t.severity === "blocker";
    const isOverdue = t.plannedDate < todayStr;
    const isExpiringSoon = t.plannedDate === todayStr;

    if (isBlocker) return 4;
    if (isOverdue) return 3;
    if (isExpiringSoon) return 2;
    return 1;
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const scoreA = getTaskPriorityScore(a);
    const scoreB = getTaskPriorityScore(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.plannedDate.localeCompare(b.plannedDate);
  });

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "content":
        return "内容确认";
      case "assets":
        return "素材审核";
      case "publish":
        return "发布处理";
      case "interaction":
        return "互动与线索";
      default:
        return "通用待办";
    }
  };

  // Render Workbenches when clicked
  if (activeWorkbench === "content") {
    return <ContentReviewWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "assets") {
    return <ShootingAndUploadWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "publish") {
    return <PublishExceptionWorkbench onClose={() => setActiveWorkbench(null)} onBack={() => setActiveWorkbench(null)} fromSource="execution" />;
  }
  if (activeWorkbench === "interaction") {
    return <InteractionWorkbench onClose={() => setActiveWorkbench(null)} />;
  }

  return (
    <div className="h-full w-full bg-page-bg p-6 md:p-8 overflow-y-auto text-text-main">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-extrabold text-text-main">待办事项</h1>
            <span className="px-3 py-0.5 rounded-full text-[12px] font-bold bg-btn-main text-white">
              共 {pendingTasks.length} 项待处理
            </span>
          </div>
        </div>

        {/* Lightweight Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-1 px-4 py-2 rounded-xl border border-border-default ">
          {/* Type tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {STAGE_TABS.map((tab) => {
              const count =
                tab.id === "all"
                  ? pendingTasks.length
                  : pendingTasks.filter((t) => t.impactedStage === tab.id).length;
              const isActive = selectedStageTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStageTab(tab.id)}
                  className={`relative py-2 text-[13px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "text-text-main"
                      : "text-text-secondary hover:text-text-main"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium ${
                      isActive ? "bg-surface-2 text-text-main" : "bg-surface-2 text-text-tertiary"
                    }`}
                  >
                    {count}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-logo" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
            <input
              type="text"
              placeholder="搜索待办..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-page-bg border border-border-default rounded-xl text-[13px] outline-none focus:bg-surface-1 focus:border-neutral-400 transition-all"
            />
          </div>
        </div>

        {/* Todo List */}
        {sortedTasks.length > 0 ? (
          <div className="space-y-3">
            {sortedTasks.map((task, idx) => {
              const score = getTaskPriorityScore(task);
              const isTopPriority = idx === 0 && score >= 2;
              const isOverdue = task.plannedDate < todayStr;
              const isExpiringSoon = task.plannedDate === todayStr;

              return (
                <div
                  key={task.id}
                  onClick={() => setActiveWorkbench(task.impactedStage)}
                  className="bg-surface-1 rounded-xl p-4 border border-border-default hover:border-neutral-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Line 1: Title + Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-text-main group-hover:text-info transition-colors truncate">
                        {task.issueMessage}
                      </h3>

                      {isTopPriority && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-warning-light text-warning border-warning-light shrink-0">
                          <Sparkles size={11} className="text-warning" />
                          建议优先
                        </span>
                      )}

                      {task.severity === "blocker" && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-danger-light text-danger border-danger-light shrink-0">
                          阻断
                        </span>
                      )}

                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-danger-light text-danger border-danger-light shrink-0">
                          已逾期
                        </span>
                      )}

                      {isExpiringSoon && !isOverdue && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-warning-light text-warning border border-warning-light shrink-0">
                          即将到期
                        </span>
                      )}
                    </div>

                    {/* Line 2: Stage Type · Project Name */}
                    <div className="text-[12.5px] font-medium text-text-tertiary flex items-center gap-2">
                      <span className="font-bold text-text-secondary">{getStageLabel(task.impactedStage)}</span>
                      <span>·</span>
                      <span className="text-text-secondary truncate">{task.projectName}</span>
                    </div>

                    {/* Line 3: Detail / Waiting status / Deadline */}
                    <div className="text-[12px] text-text-tertiary flex items-center gap-3 flex-wrap">
                      {task.waitOn && (
                        <span className="text-warning font-medium bg-warning-light px-2 py-0.5 rounded border border-warning-light">
                          等待 {task.waitOn}
                        </span>
                      )}
                      {!task.waitOn && task.noteTitle && (
                        <span className="truncate">关联：{task.noteTitle}</span>
                      )}
                      <span>截止时间：{task.plannedDate}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveWorkbench(task.impactedStage);
                      }}
                      className="px-5 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[13px] font-bold transition-all  flex items-center gap-1"
                    >
                      处理
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface-1 rounded-xl p-12 border border-border-default text-center flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 size={40} className="text-success mb-1" />
            <h3 className="text-[16px] font-bold text-text-main">当前没有待处理事项</h3>
            <p className="text-[13px] text-text-tertiary max-w-sm leading-relaxed">
              新的内容确认、素材审核、发布异常或互动任务会出现在这里。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

