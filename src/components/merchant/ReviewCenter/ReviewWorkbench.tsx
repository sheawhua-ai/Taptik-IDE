import React, { useState, useRef } from "react";
import { 
  Plus, Calendar, Search, PanelLeftClose, PanelLeftOpen, RefreshCw, 
  Download, Layers, CheckCircle2, Clock, ShieldAlert, Sparkles,
  FileText, Check, AlertCircle, Info, ChevronRight, History, ChevronDown, FileCode, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INITIAL_REVIEW_TASKS } from "./mockData";
import { ReviewTask, SuggestedAction } from "./types";
import { ReviewTaskList } from "./ReviewTaskList";
import { SinglePageReviewReport } from "./SinglePageReviewReport";
import { VersionHistoryDrawer } from "./VersionHistoryDrawer";
import { CreateReviewTaskModal } from "./CreateReviewTaskModal";
import { ActionDetailModal } from "./ActionDetailModal";
import { ExportReportModal } from "./ExportReportModal";
import { ApplyPlanModal } from "./ApplyPlanModal";
import { ApplyNoteModal } from "./ApplyNoteModal";

interface ReviewWorkbenchProps {
  onNavigateToExecution?: () => void;
}

export function ReviewWorkbench({ onNavigateToExecution }: ReviewWorkbenchProps) {
  // State
  const [tasks, setTasks] = useState<ReviewTask[]>(INITIAL_REVIEW_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(INITIAL_REVIEW_TASKS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [scopeFilter, setScopeFilter] = useState("全部");

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [selectedActionDetail, setSelectedActionDetail] = useState<SuggestedAction | null>(null);
  const [actionForPlanModal, setActionForPlanModal] = useState<SuggestedAction | null>(null);
  const [actionForNoteModal, setActionForNoteModal] = useState<SuggestedAction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRerunning, setIsRerunning] = useState(false);

  // Expandable data spec ref & state
  const dataSpecRef = useRef<HTMLDivElement>(null);
  const [isDataSpecExpanded, setIsDataSpecExpanded] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const handleCreateTask = (newTask: ReviewTask) => {
    setTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
    showToast("复盘任务创建成功，正在生成复盘，完成后将自动更新。");
  };

  // Open appropriate modal based on action type
  const handleOpenApplyModal = (action: SuggestedAction) => {
    if (action.actionType === "plan") {
      setActionForPlanModal(action);
    } else {
      setActionForNoteModal(action);
    }
  };

  // Confirm applying plan action
  const handleConfirmApplyPlan = (targetType: "new_plan" | "existing_plan", targetPlanName: string) => {
    if (!actionForPlanModal) return;
    const label = targetType === "new_plan" ? "已纳入下一期方案" : `已纳入《${targetPlanName}》`;
    setTasks(prev => prev.map(task => {
      if (task.id !== selectedTaskId) return task;
      return {
        ...task,
        suggestedActions: task.suggestedActions.map(action => {
          if (action.id === actionForPlanModal.id) {
            return {
              ...action,
              appliedStatus: "in_plan",
              appliedDestinationLabel: label,
            };
          }
          return action;
        }),
      };
    }));
    setActionForPlanModal(null);
    showToast(label);
  };

  // Confirm applying note action
  const handleConfirmApplyNote = (targetType: "next_batch" | "specific_draft", targetNoteTitle: string) => {
    if (!actionForNoteModal) return;
    const label = targetType === "next_batch" ? "已应用到后续笔记" : `已应用到《${targetNoteTitle}》`;
    setTasks(prev => prev.map(task => {
      if (task.id !== selectedTaskId) return task;
      return {
        ...task,
        suggestedActions: task.suggestedActions.map(action => {
          if (action.id === actionForNoteModal.id) {
            return {
              ...action,
              appliedStatus: targetType === "next_batch" ? "in_note" : "in_specific_note",
              appliedDestinationLabel: label,
            };
          }
          return action;
        }),
      };
    }));
    setActionForNoteModal(null);
    showToast(label);
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
          activeVersionId: "v2",
        };
      }));
      showToast("复盘分析已重新生成完毕");
    }, 1500);
  };

  const handleSwitchVersion = (versionId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== selectedTaskId) return t;
      return {
        ...t,
        activeVersionId: versionId,
      };
    }));
    const verName = currentTask.historyVersions.find(v => v.id === versionId)?.versionName || "目标版本";
    showToast(`已切换至 ${verName}`);
  };

  const handleScrollToDataSpec = () => {
    setIsDataSpecExpanded(true);
    setTimeout(() => {
      dataSpecRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="flex-1 flex overflow-hidden relative bg-surface-base font-sans select-none">
      
      {/* Toast notification - Top-right compact auto-dismiss */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, x: 20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-5 right-6 z-50 px-3.5 py-2 bg-neutral-900/90 backdrop-blur-md text-white text-[12px] rounded-xl shadow-xl flex items-center gap-2 border border-neutral-700/80 font-medium"
          >
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
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

      {/* Right Column: Detail Content Area (Single Page Vertical Report) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-subtle">
        
        {/* Top Header */}
        <div className="bg-surface-1 border-b border-border-default px-6 py-4 shrink-0 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Title & Status */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[17px] md:text-[18px] font-bold text-text-main tracking-tight truncate">
                  {currentTask.title}
                </h1>
                
                {/* Status Badge */}
                {currentTask.status === "completed" && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-md">
                    已完成
                  </span>
                )}
                {currentTask.status === "analyzing" && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold rounded-md flex items-center gap-1">
                    <RefreshCw size={11} className="animate-spin" />
                    <span>分析中</span>
                  </span>
                )}
                {currentTask.status === "exception" && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold rounded-md">
                    {currentTask.statusText}
                  </span>
                )}
                {currentTask.status === "pending_confirmation" && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold rounded-md">
                    待确认
                  </span>
                )}
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-2.5 text-[12px] text-text-tertiary">
                <span className="flex items-center gap-1 text-text-secondary">
                  <Calendar size={13} className="text-text-tertiary" />
                  <span>{currentTask.dateRange.start} 至 {currentTask.dateRange.end}</span>
                  {/* Data Scope Info Icon Trigger */}
                  <button
                    onClick={handleScrollToDataSpec}
                    title="点击查看数据范围与统计口径说明"
                    className="p-0.5 hover:bg-hover-bg rounded text-text-tertiary hover:text-btn-main transition-colors inline-flex items-center ml-0.5"
                  >
                    <Info size={13} />
                  </button>
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
                <span className="flex items-center gap-1.5 text-text-tertiary">
                  <span>更新于 {currentTask.updatedAt}</span>
                  {/* Version Badge Button Trigger */}
                  <button
                    onClick={() => setIsVersionDrawerOpen(true)}
                    className="px-2 py-0.5 bg-surface-subtle hover:bg-hover-bg border border-border-default hover:border-btn-main rounded-md text-[11px] font-bold text-btn-main flex items-center gap-1 transition-all shadow-2xs"
                    title="点击打开版本历史快照抽屉"
                  >
                    <History size={11} />
                    <span>版本 {currentTask.historyVersions.length}</span>
                    <ChevronRight size={11} />
                  </button>
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Secondary Action Button: Re-run */}
              <button
                onClick={handleRerunAnalysis}
                disabled={isRerunning}
                className="px-3.5 py-2 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main rounded-xl text-[12.5px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw size={13} className={isRerunning ? "animate-spin text-btn-main" : "text-text-tertiary"} />
                <span>{isRerunning ? "重跑分析中..." : "重新分析"}</span>
              </button>

              {/* Primary Action Button: Export Report with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12.5px] font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download size={14} />
                  <span>导出报告</span>
                  <ChevronDown size={13} />
                </button>

                {isExportDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsExportDropdownOpen(false)} />
                    <div className="absolute right-0 mt-1 w-44 bg-surface-1 border border-border-default rounded-xl shadow-lg z-50 py-1 text-xs">
                      <button
                        onClick={() => {
                          setIsExportDropdownOpen(false);
                          setIsExportModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-surface-subtle text-text-main flex items-center gap-2 font-medium transition-colors"
                      >
                        <FileCode size={13} className="text-btn-main" />
                        <span>导出HTML报告</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsExportDropdownOpen(false);
                          window.print();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-surface-subtle text-text-main flex items-center gap-2 font-medium transition-colors border-t border-border-subtle"
                      >
                        <Printer size={13} className="text-btn-main" />
                        <span>下载PDF</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Single Page Vertical Report Scrollport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <SinglePageReviewReport
              task={currentTask}
              onActionDetail={(action) => setSelectedActionDetail(action)}
              onApplyAction={handleOpenApplyModal}
              dataSpecRef={dataSpecRef}
              isDataSpecExpanded={isDataSpecExpanded}
              onToggleDataSpec={() => setIsDataSpecExpanded(!isDataSpecExpanded)}
            />
          </div>
        </div>
      </div>

      {/* Version History Side Drawer */}
      <VersionHistoryDrawer
        isOpen={isVersionDrawerOpen}
        onClose={() => setIsVersionDrawerOpen(false)}
        task={currentTask}
        onSwitchVersion={handleSwitchVersion}
      />

      {/* Create Task Modal */}
      <CreateReviewTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Action SOP & Detail Modal */}
      <ActionDetailModal
        action={selectedActionDetail}
        onClose={() => setSelectedActionDetail(null)}
        onApplyAction={handleOpenApplyModal}
      />

      {/* Apply to Project Plan Modal */}
      <ApplyPlanModal
        action={actionForPlanModal}
        projectName={currentTask.projectNames[0] || "当前项目"}
        isOpen={!!actionForPlanModal}
        onClose={() => setActionForPlanModal(null)}
        onConfirm={handleConfirmApplyPlan}
      />

      {/* Apply to Follow-up Notes Modal */}
      <ApplyNoteModal
        action={actionForNoteModal}
        projectName={currentTask.projectNames[0] || "当前项目"}
        isOpen={!!actionForNoteModal}
        onClose={() => setActionForNoteModal(null)}
        onConfirm={handleConfirmApplyNote}
      />

      {/* Export Report Modal (HTML / PDF) */}
      <ExportReportModal
        task={currentTask}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}
