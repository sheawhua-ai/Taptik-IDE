import React, { useState } from "react";
import { 
  Plus, Calendar, Search, PanelLeftClose, PanelLeftOpen, RefreshCw, 
  Download, Share2, Layers, CheckCircle2, Clock, ShieldAlert, Sparkles,
  FileText, Check, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INITIAL_REVIEW_TASKS } from "./mockData";
import { ReviewTask, AgentPipelineNode, SuggestedAction } from "./types";
import { ReviewTaskList } from "./ReviewTaskList";
import { ReviewOverviewTab } from "./ReviewOverviewTab";
import { ReviewDetailsTab } from "./ReviewDetailsTab";
import { ReviewHistoryTab } from "./ReviewHistoryTab";
import { CreateReviewTaskModal } from "./CreateReviewTaskModal";
import { AgentLogDrawer } from "./AgentLogDrawer";
import { DataSupplementModal } from "./DataSupplementModal";
import { ActionDetailModal } from "./ActionDetailModal";
import { ExportReportModal } from "./ExportReportModal";

interface ReviewWorkbenchProps {
  onNavigateToExecution?: () => void;
}

export function ReviewWorkbench({ onNavigateToExecution }: ReviewWorkbenchProps) {
  // State
  const [tasks, setTasks] = useState<ReviewTask[]>(INITIAL_REVIEW_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(INITIAL_REVIEW_TASKS[0].id);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "history">("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [scopeFilter, setScopeFilter] = useState("全部");

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgentForLog, setSelectedAgentForLog] = useState<AgentPipelineNode | null>(null);
  const [isDataSupplementModalOpen, setIsDataSupplementModalOpen] = useState(false);
  const [selectedActionDetail, setSelectedActionDetail] = useState<SuggestedAction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRerunning, setIsRerunning] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const handleCreateTask = (newTask: ReviewTask) => {
    setTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
    setActiveTab("overview");
    showToast("复盘任务创建成功，专职 Agent 正在并发分析中");
  };

  const handleToggleActionSync = (actionId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== selectedTaskId) return task;
      return {
        ...task,
        suggestedActions: task.suggestedActions.map(action => {
          if (action.id === actionId) {
            const nextState = !action.inExecutionCenter;
            showToast(nextState ? "已成功同步至【执行中心】待办任务" : "已从执行中心移除");
            return { ...action, inExecutionCenter: nextState };
          }
          return action;
        }),
      };
    }));
  };

  const handleConfirmStep = (stepId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== selectedTaskId) return task;
      return {
        ...task,
        progressSteps: task.progressSteps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              type: "completed",
              statusLabel: "已完成",
              description: "操盘手已确认并下发至策略建议生成流程",
            };
          }
          return step;
        }),
      };
    }));
    showToast("已确认该环节处理");
  };

  const handleRerunAnalysis = () => {
    setIsRerunning(true);
    showToast("已触发重新分析，Agent 正在重新抓取与测算数据...");
    setTimeout(() => {
      setIsRerunning(false);
      setTasks(prev => prev.map(task => {
        if (task.id !== selectedTaskId) return task;
        return {
          ...task,
          status: "completed",
          statusText: "已完成",
          updatedAt: "刚刚",
          progressSteps: task.progressSteps.map(s => ({
            ...s,
            type: "completed",
            statusLabel: "已完成",
          })),
        };
      }));
      showToast("复盘数据重跑完成，已生成最新分析版本");
    }, 1800);
  };

  const handleSupplementSuccess = () => {
    setTasks(prev => prev.map(task => {
      if (task.id !== selectedTaskId) return task;
      return {
        ...task,
        status: "completed",
        statusText: "已完成",
        progressSteps: task.progressSteps.map(step => {
          if (step.type === "blocked") {
            return {
              ...step,
              type: "completed",
              statusLabel: "已完成",
              description: "授权已刷新，全量数据采集与漏斗校验已补齐完毕",
            };
          }
          return step;
        }),
      };
    }));
    showToast("数据修复成功，分析流水线已恢复全量运行");
  };

  const handleSwitchVersion = (versionId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== selectedTaskId) return task;
      return {
        ...task,
        activeVersionId: versionId,
      };
    }));
    showToast(`已切换至指定历史版本`);
  };

  return (
    <div className="flex-1 flex overflow-hidden relative bg-surface-base font-sans select-none">
      
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900 text-white text-[12.5px] rounded-xl shadow-lg flex items-center gap-2 border border-neutral-700"
          >
            <Sparkles size={14} className="text-btn-main" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Middle Column: Review Task List */}
      <motion.div
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.2 }}
        className="shrink-0 overflow-hidden"
      >
        <ReviewTaskList
          tasks={tasks}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          scopeFilter={scopeFilter}
          setScopeFilter={setScopeFilter}
        />
      </motion.div>

      {/* Collapsed Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute left-2 top-4 z-20 w-8 h-8 rounded-lg bg-surface-1 border border-border-default hover:bg-hover-bg flex items-center justify-center text-text-secondary shadow-xs transition-colors"
          title="展开任务列表"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* Right Column: Detail Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-subtle">
        
        {/* Top Header */}
        <div className="bg-surface-1 border-b border-border-default px-6 py-4 shrink-0 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Title & Status */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-[18px] font-semibold text-text-main tracking-tight truncate">
                  {currentTask.title}
                </h1>
                
                {/* Status Badge */}
                {currentTask.status === "completed" && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium rounded-md">
                    已完成
                  </span>
                )}
                {currentTask.status === "analyzing" && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium rounded-md flex items-center gap-1">
                    <RefreshCw size={11} className="animate-spin" />
                    <span>分析中</span>
                  </span>
                )}
                {currentTask.status === "exception" && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[11px] font-medium rounded-md">
                    {currentTask.statusText}
                  </span>
                )}
                {currentTask.status === "pending_confirmation" && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium rounded-md">
                    待确认
                  </span>
                )}
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 text-[12px] text-text-tertiary">
                <span className="flex items-center gap-1 text-text-secondary">
                  <Calendar size={13} className="text-text-tertiary" />
                  <span>{currentTask.dateRange.start} 至 {currentTask.dateRange.end}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <Layers size={13} className="text-text-tertiary" />
                  <span>{currentTask.projectNames.join('、')}</span>
                </span>
                <span>·</span>
                <span className="px-1.5 py-0.5 bg-surface-subtle border border-border-default text-text-secondary rounded text-[11px]">
                  目标：{currentTask.targetObjectiveLabel}
                </span>
                <span>·</span>
                <span>更新于 {currentTask.updatedAt}</span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRerunAnalysis}
                disabled={isRerunning}
                className="px-3 py-1.5 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main rounded-xl text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw size={13} className={isRerunning ? "animate-spin text-btn-main" : "text-text-tertiary"} />
                <span>{isRerunning ? "重跑分析中..." : "重新分析"}</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main rounded-xl text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download size={13} className="text-text-tertiary" />
                <span>导出报告</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mt-4 -mb-4 border-t border-border-subtle pt-2.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2.5 text-[13px] font-semibold transition-colors relative ${
                activeTab === "overview"
                  ? "text-text-main"
                  : "text-text-tertiary hover:text-text-main"
              }`}
            >
              <span>概览</span>
              {activeTab === "overview" && (
                <motion.div
                  layoutId="reviewTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-btn-main"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2.5 text-[13px] font-semibold transition-colors relative ${
                activeTab === "details"
                  ? "text-text-main"
                  : "text-text-tertiary hover:text-text-main"
              }`}
            >
              <span>分析详情</span>
              {activeTab === "details" && (
                <motion.div
                  layoutId="reviewTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-btn-main"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2.5 text-[13px] font-semibold transition-colors relative flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "text-text-main"
                  : "text-text-tertiary hover:text-text-main"
              }`}
            >
              <span>版本历史</span>
              <span className="px-1.5 py-0.2 bg-surface-subtle border border-border-default text-text-tertiary text-[10.5px] rounded-full">
                {currentTask.historyVersions.length}
              </span>
              {activeTab === "history" && (
                <motion.div
                  layoutId="reviewTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-btn-main"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeTab === "overview" && (
              <ReviewOverviewTab
                task={currentTask}
                onSupplementData={() => setIsDataSupplementModalOpen(true)}
                onToggleActionSync={handleToggleActionSync}
                onActionDetail={(action) => setSelectedActionDetail(action)}
                onSwitchVersion={handleSwitchVersion}
              />
            )}

            {activeTab === "details" && (
              <ReviewDetailsTab
                task={currentTask}
                onOpenExecutionCenter={onNavigateToExecution}
              />
            )}

            {activeTab === "history" && (
              <ReviewHistoryTab
                task={currentTask}
                onSwitchVersion={handleSwitchVersion}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateReviewTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Agent Reasoning Log Drawer */}
      <AgentLogDrawer
        agent={selectedAgentForLog}
        onClose={() => setSelectedAgentForLog(null)}
      />

      {/* Data Supplement / Anomaly Fix Modal */}
      <DataSupplementModal
        isOpen={isDataSupplementModalOpen}
        onClose={() => setIsDataSupplementModalOpen(false)}
        onSuccess={handleSupplementSuccess}
      />

      {/* Action SOP & Detail Modal */}
      <ActionDetailModal
        action={selectedActionDetail}
        onClose={() => setSelectedActionDetail(null)}
        onToggleSync={handleToggleActionSync}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        task={currentTask}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}
