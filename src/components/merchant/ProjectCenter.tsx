import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Calendar, AlertTriangle, CheckCircle2, History, 
  MoreHorizontal, Settings, FileText, Check, ChevronRight, X,
  ExternalLink, QrCode, FileSpreadsheet, Trash2, Camera, User, 
  BarChart2, Lightbulb, Link2, ChevronDown, ChevronUp, AlertCircle, 
  PanelLeftClose, PanelLeftOpen, Upload, Sparkles, Target, ShieldAlert, 
  Layers, Clock, RefreshCw, Users, Eye, ArrowRight, Package
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { Project, Note } from "../../data/projectStore";
import { 
  calculateProjectPipeline, 
  getUnifiedBusinessStatus, 
  getStatusStyleClass, 
  UnifiedBusinessStatus,
  getActionTextForIssue
} from "../../utils/noteStatus";

import { NoteDetailDrawer } from "./ProjectCenter/NoteDetailDrawer";
import { StrategyProtocolDrawer } from "./ProjectCenter/StrategyProtocolDrawer";
import { AccountQueueDrawer } from "./ProjectCenter/AccountQueueDrawer";
import { ProjectQuestionnaireDrawer } from "../rings/ProjectQuestionnaireDrawer";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { CreateProjectWorkstation } from "./CreateProjectWorkstation";
import { LandingPageSettingsModal } from "./LandingPageSettingsModal";
import { BatchNoteGeneratorModal } from "./BatchNoteGeneratorModal";
import { AddSingleNoteModal } from "./AddSingleNoteModal";
import { ProjectMaterialsTab } from "./ProjectMaterialsTab";

export function ProjectCenter({ 
  setWorkflowTab, 
  hasData, 
  activeProjectId 
}: { 
  setWorkflowTab?: (tab: string) => void; 
  hasData?: boolean; 
  activeProjectId?: string; 
}) {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    currentProject, 
    enrichedActionTasks,
    deleteProject
  } = useProjectStore();

  // Navigation state
  const [activeTab, setActiveTab] = useState<"概览" | "内容与发布" | "素材" | "数据">("概览");
  const [contentSubView, setContentSubView] = useState<"by_note" | "by_account">("by_note");
  const [dataSubView, setDataSubView] = useState<"summary" | "by_note" | "by_account">("summary");

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectFilterStatus, setProjectFilterStatus] = useState<string>("全部");

  // Expanded accounts in By Account View
  const [expandedAccountIds, setExpandedAccountIds] = useState<Record<string, boolean>>({
    "brand_1": true,
    "kos_1": true,
    "matrix_1": false
  });

  // Drawers & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("tap_tik_project_sidebar");
    return saved ? JSON.parse(saved) : true;
  });

  const [activeNoteDetail, setActiveNoteDetail] = useState<Note | null>(null);
  const [selectedAccountForQueue, setSelectedAccountForQueue] = useState<{
    name: string;
    type: string;
    persona: string;
    notes: Note[];
  } | null>(null);

  const [showStrategyDrawer, setShowStrategyDrawer] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showProjectQuestionnaire, setShowProjectQuestionnaire] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showOperationLogs, setShowOperationLogs] = useState(false);
  const [showImportSelect, setShowImportSelect] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState<"file" | "feishu" | "single" | null>(null);
  const [showBatchAIGenerator, setShowBatchAIGenerator] = useState(false);
  const [activeWorkbench, setActiveWorkbench] = useState<"content" | "assets" | "publish" | "create_project" | null>(null);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);

  // Auto-refresh timestamp
  const [isRefreshingProgress, setIsRefreshingProgress] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("刚刚");
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    localStorage.setItem("tap_tik_project_sidebar", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleRefreshProgress = () => {
    if (isRefreshingProgress) return;
    setIsRefreshingProgress(true);
    setTimeout(() => {
      setIsRefreshingProgress(false);
      setLastUpdatedTimestamp(Date.now());
      setLastUpdatedText("刚刚");
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedMinutes = Math.floor((Date.now() - lastUpdatedTimestamp) / 60000);
      if (elapsedMinutes < 1) {
        setLastUpdatedText("刚刚");
      } else if (elapsedMinutes < 60) {
        setLastUpdatedText(`${elapsedMinutes}分钟前`);
      } else {
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        setLastUpdatedText(`${elapsedHours}小时前`);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [lastUpdatedTimestamp]);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 bg-[#F7F8FA]">
        请选择左侧项目或新建项目
      </div>
    );
  }

  // Workbenches
  if (activeWorkbench === "content") return <ContentReviewWorkbench onClose={() => setActiveWorkbench(null)} />;
  if (activeWorkbench === "assets") return <ShootingAndUploadWorkbench onClose={() => setActiveWorkbench(null)} />;
  if (activeWorkbench === "publish") return <PublishExceptionWorkbench onClose={() => setActiveWorkbench(null)} onBack={() => setActiveWorkbench(null)} fromSource="project" />;
  if (activeWorkbench === "create_project") return <CreateProjectWorkstation onClose={() => setActiveWorkbench(null)} onCreate={() => setActiveWorkbench(null)} />;

  const pipeline = calculateProjectPipeline(currentProject.notes || []);

  // Filtered projects for sidebar
  const filteredProjects = projects.filter((p) => {
    if (projectSearchQuery && !p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())) return false;
    if (projectFilterStatus !== "全部" && p.status !== projectFilterStatus) return false;
    return true;
  });

  // Action Tasks for this project
  const projectPendingTasks = enrichedActionTasks.filter(
    (t) => t.projectId === currentProject.id && t.status === "pending"
  );
  const primaryProjectTask = projectPendingTasks[0];
  const secondaryProjectTasksCount = projectPendingTasks.length > 1 ? projectPendingTasks.length - 1 : 0;

  const handleTaskAction = (task: any) => {
    if (task.impactedStage === "content") setActiveWorkbench("content");
    else if (task.impactedStage === "assets") setActiveWorkbench("assets");
    else if (task.impactedStage === "publish") setActiveWorkbench("publish");
  };

  // Notes filtering
  const allNotes = currentProject.notes || [];
  const filteredNotes = allNotes.filter((note) => {
    const uStatus = getUnifiedBusinessStatus(note);
    if (statusFilter !== "全部") {
      if (statusFilter === "异常" && uStatus !== "异常") return false;
      if (statusFilter === "待准备" && !["内容生成中", "待内容确认", "待素材", "内容已就绪", "笔记占位", "等待消费者领取", "消费者进行中"].includes(uStatus)) return false;
      if (statusFilter === "待发布" && uStatus !== "待发布" && uStatus !== "等待账号执行") return false;
      if (statusFilter === "发布识别中" && uStatus !== "发布识别中") return false;
      if (statusFilter === "观察中" && uStatus !== "观察中") return false;
      if (statusFilter === "已完成" && uStatus !== "观察完成") return false;
      if (statusFilter === uStatus) return true;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (note.title || "").toLowerCase().includes(q);
      const matchAccount = (note.account || "").toLowerCase().includes(q);
      const matchType = (note.type || "").toLowerCase().includes(q);
      if (!matchTitle && !matchAccount && !matchType) return false;
    }
    return true;
  });

  // Stats calculation for the compact status summary line
  const counts = {
    all: allNotes.length,
    preparing: allNotes.filter(n => ["内容生成中", "待内容确认", "待素材", "内容已就绪", "笔记占位", "等待消费者领取", "消费者进行中"].includes(getUnifiedBusinessStatus(n))).length,
    pendingPublish: allNotes.filter(n => ["待发布", "等待账号执行"].includes(getUnifiedBusinessStatus(n))).length,
    detecting: allNotes.filter(n => getUnifiedBusinessStatus(n) === "发布识别中").length,
    observing: allNotes.filter(n => getUnifiedBusinessStatus(n) === "观察中").length,
    completed: allNotes.filter(n => getUnifiedBusinessStatus(n) === "观察完成").length,
    exception: allNotes.filter(n => getUnifiedBusinessStatus(n) === "异常").length,
  };

  // Account grouping for "按账号" view
  const controlledAccounts = [
    {
      id: "brand_1",
      name: "特唯普官方旗舰店",
      type: "品牌官方号",
      persona: "品牌权威、质检保障与答疑",
      planCount: 4,
      publishedCount: 2,
      queueCount: 2,
      waitingExecCount: 1,
      observingCount: 1,
      exceptionCount: 0,
      nextPlannedDate: "2026-08-15 18:00",
      notes: allNotes.filter(n => n.type?.includes("品牌") || n.account?.includes("官方")),
    },
    {
      id: "kos_1",
      name: "特唯普上海静安店 (张店长)",
      type: "员工KOS / 店长号",
      persona: "门店专家、换粮经验与日常答疑",
      planCount: 6,
      publishedCount: 3,
      queueCount: 3,
      waitingExecCount: 1,
      observingCount: 2,
      exceptionCount: 1,
      nextPlannedDate: "2026-08-16 12:00",
      notes: allNotes.filter(n => n.type?.includes("店长") || n.type?.includes("KOS") || n.account?.includes("店长")),
    },
    {
      id: "matrix_1",
      name: "金毛养宠避坑指南 (矩阵号)",
      type: "自有矩阵号",
      persona: "垂直犬种经验分享与产品测评",
      planCount: 4,
      publishedCount: 1,
      queueCount: 3,
      waitingExecCount: 1,
      observingCount: 0,
      exceptionCount: 0,
      nextPlannedDate: "2026-08-17 19:30",
      notes: allNotes.filter(n => n.type?.includes("矩阵")),
    },
  ];

  // Consumer package groups for "消费者发布池"
  const consumerPackages = [
    {
      id: "pkg_1",
      name: "幼犬换粮体验官测评内容包",
      type: "消费者KOC · 笔记包",
      planSlots: 10,
      claimed: 4,
      questionnaireFilled: 4,
      notesGenerated: 4,
      photosUploaded: 3,
      photosPassed: 3,
      published: 2,
      incomplete: 2,
      exceptions: 0,
      needContactCount: 1,
      validUntil: "2026-08-20",
      notes: allNotes.filter(n => n.isNotePackage || n.type?.includes("KOC") || n.type?.includes("消费者")),
    }
  ];

  return (
    <div className="h-full w-full flex bg-[#F7F8FA] text-[#111827] relative overflow-hidden font-sans">
      
      {/* LEFT: Collapsible Project List */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-[#EAECF0] flex flex-col shrink-0 z-10 overflow-hidden"
          >
            <div className="p-4 border-b border-[#EAECF0] space-y-3 w-[280px]">
              <div className="flex justify-between items-center">
                <h2 className="text-[15px] font-bold text-[#111827]">项目列表</h2>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveWorkbench("create_project")}
                    className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-2xs"
                    title="新建项目"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    title="收起项目列表" 
                    className="w-7 h-7 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-[#667085]"
                  >
                    <PanelLeftClose size={16} />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索项目..." 
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 rounded-xl text-[13px] outline-none focus:bg-white focus:ring-1 focus:ring-neutral-300"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {["全部", "进行中", "已结束"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setProjectFilterStatus(status)}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium transition-colors ${
                      projectFilterStatus === status ? "bg-neutral-900 text-white" : "bg-neutral-100 text-[#667085] hover:bg-neutral-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 w-[280px]">
              {filteredProjects.map((proj) => {
                const projTasks = enrichedActionTasks.filter(t => t.projectId === proj.id && t.status === "pending");
                const blockers = projTasks.filter(t => t.severity === "blocker");
                const errors = projTasks.filter(t => t.actionType === "ResolvePublishError" || t.issueMessage?.includes("异常"));
                
                let statusText = "按计划推进";
                let statusClass = "text-[#667085]";
                
                if (errors.length > 0) {
                  statusText = `${errors.length}项异常待处理`;
                  statusClass = "text-rose-600 font-bold";
                } else if (blockers.length > 0) {
                  statusText = `${blockers.length}项阻断 · 待跟进`;
                  statusClass = "text-rose-600 font-bold";
                } else if (projTasks.length > 0) {
                  statusText = `${projTasks.length}项待跟进`;
                  statusClass = "text-neutral-600";
                }

                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      selectedProjectId === proj.id 
                        ? "bg-neutral-100 border-neutral-200" 
                        : "bg-transparent hover:bg-neutral-50 border-transparent text-[#111827]"
                    }`}
                  >
                    <div className={`text-[13px] line-clamp-1 mb-1 ${selectedProjectId === proj.id ? 'font-bold text-[#111827]' : 'font-medium'}`}>{proj.name}</div>
                    <div className="text-[11px] text-[#667085] mb-1">{proj.status}</div>
                    <div className={`text-[11px] ${statusClass}`}>{statusText}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT: Main Project Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F8FA] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-white border-b border-[#EAECF0] shrink-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                title="展开项目列表"
                className="w-8 h-8 flex items-center justify-center border border-[#EAECF0] rounded-xl text-[#667085] hover:text-[#111827] hover:bg-neutral-50 transition-colors"
              >
                <PanelLeftOpen size={16} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[18px] font-extrabold text-[#111827]">{currentProject.name}</h1>
                <span className="text-[12px] text-[#667085] bg-neutral-100 px-2 py-0.5 rounded-md font-medium">{currentProject.status}</span>
                <span className="text-[12px] text-[#667085] flex items-center gap-1.5"><Calendar size={12} /> {currentProject.startDate} 至 {currentProject.endDate}</span>
              </div>
              <div className="text-[13px] text-[#667085]">
                {currentProject.description || "验证真实换粮体验与店长专业解释能否提高有效咨询"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLandingPage(true)}
              className="px-3.5 py-1.5 bg-white border border-[#EAECF0] hover:bg-neutral-50 hover:border-neutral-300 text-[13px] font-bold text-neutral-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <QrCode size={14} className="text-neutral-600" />
              <span>落地页推广</span>
            </button>

            {/* More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                title="更多项目操作"
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-transparent hover:border-[#EAECF0] transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#EAECF0] rounded-xl shadow-lg z-50 py-1.5 text-[13px]">
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2 text-[#111827] font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowProjectSettings(true); }}
                    >
                      <Settings size={14} className="text-neutral-500" />
                      <span>编辑项目信息</span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center justify-between text-[#111827] font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowProjectQuestionnaire(true); }}
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-neutral-500" />
                        <span>项目问卷配置</span>
                      </div>
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-medium">
                        {currentProject.landingPageSettings?.questionnaireQuestions?.length || 4}题
                      </span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2 text-[#111827] font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowOperationLogs(true); }}
                    >
                      <History size={14} className="text-neutral-500" />
                      <span>操作记录</span>
                    </button>
                    <div className="my-1.5 border-t border-[#EAECF0]" />
                    <button 
                      onClick={() => { setShowMoreMenu(false); setShowArchiveConfirm(true); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      <span>归档项目</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Level-2 Primary Tabs */}
        <div className="px-6 bg-white border-b border-[#EAECF0] flex gap-6 text-[14px] font-medium shrink-0">
          {(["概览", "内容与发布", "素材", "数据"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 relative font-bold ${activeTab === tab ? "text-neutral-900" : "text-[#667085] hover:text-[#111827]"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="projectCenterTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-900" />
              )}
            </button>
          ))}
        </div>

        {/* Main View Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1240px] mx-auto p-6 space-y-6">
            
            {/* ======================================================== */}
            {/* 1. 概览 TAB                                             */}
            {/* ======================================================== */}
            {activeTab === "概览" && (
              <div className="space-y-6">
                
                {/* 5.1 当前关注 (Current Focus) */}
                <div className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
                      <AlertCircle size={16} className={primaryProjectTask ? "text-rose-600" : "text-emerald-600"} /> 
                      当前关注
                    </h3>
                    <span className="text-[12px] text-[#667085]">
                      {primaryProjectTask ? "需人工处理事项" : "当前节奏正常"}
                    </span>
                  </div>

                  {primaryProjectTask ? (
                    <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                            <span>{primaryProjectTask.issueMessage || "待处理事项"}</span>
                            {primaryProjectTask.severity === "blocker" && (
                              <span className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded">
                                阻断
                              </span>
                            )}
                          </div>
                          <div className="text-[12.5px] text-neutral-600 flex flex-wrap gap-x-4 gap-y-1">
                            <div>关联：<strong className="text-neutral-800">{primaryProjectTask.noteTitle || "当前项目"}</strong></div>
                            <div>等待方：<strong className="text-neutral-800">{primaryProjectTask.waitOn || "操盘手确认"}</strong></div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleTaskAction(primaryProjectTask)}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[12.5px] font-bold rounded-xl transition-colors shadow-2xs shrink-0 flex items-center gap-1"
                        >
                          立即处理 <ChevronRight size={14} />
                        </button>
                      </div>

                      {/* Secondary Tasks (Collapsible) */}
                      {secondaryProjectTasksCount > 0 && (
                        <div className="pt-2 border-t border-rose-200/60">
                          <button 
                            onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                            className="text-[12px] font-bold text-rose-800 hover:underline flex items-center gap-1"
                          >
                            {isTasksExpanded ? "收起其他待办" : `另有 ${secondaryProjectTasksCount} 项需要跟进`}
                            {isTasksExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>

                          {isTasksExpanded && (
                            <div className="mt-2 space-y-2 pl-2 border-l-2 border-rose-300">
                              {projectPendingTasks.slice(1).map((task) => (
                                <div key={task.id} className="flex items-center justify-between text-[12px] py-1">
                                  <span className="font-medium text-neutral-800">{task.issueMessage}</span>
                                  <button
                                    onClick={() => handleTaskAction(task)}
                                    className="text-neutral-900 font-bold hover:underline"
                                  >
                                    处理
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-[13px] text-neutral-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>当前节奏正常，所有任务按规划推进中。</span>
                      </div>
                      <span className="text-[12px] text-neutral-500 font-medium">下一发布节点：今日 18:00 (店长号)</span>
                    </div>
                  )}
                </div>

                {/* 5.2 内容与发布概览 (Compact Pipeline Summary Bar) */}
                <div className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#111827]">内容与发布概览</h3>
                    <div className="flex items-center gap-2 text-[12px] text-[#667085]">
                      <span>更新时间：{lastUpdatedText}</span>
                      <button 
                        onClick={handleRefreshProgress}
                        disabled={isRefreshingProgress}
                        title="刷新项目数据"
                        className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <RefreshCw size={13} className={isRefreshingProgress ? "animate-spin text-neutral-900" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* 1-Line Clean Clickable Status Capsules */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {[
                      { label: "全部", count: counts.all, filter: "全部" },
                      { label: "内容准备中", count: counts.preparing, filter: "待准备" },
                      { label: "待发布", count: counts.pendingPublish, filter: "待发布" },
                      { label: "发布识别中", count: counts.detecting, filter: "发布识别中" },
                      { label: "观察中", count: counts.observing, filter: "观察中" },
                      { label: "已完成", count: counts.completed, filter: "已完成" },
                      { label: "异常", count: counts.exception, filter: "异常", isAlert: counts.exception > 0 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setStatusFilter(item.filter);
                          setActiveTab("内容与发布");
                          setContentSubView("by_note");
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-[12.5px] font-bold transition-all flex items-center gap-2 ${
                          item.isAlert
                            ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                            : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-white hover:border-neutral-300 shadow-2xs"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-md text-[11px] ${
                          item.isAlert ? "bg-rose-600 text-white" : "bg-neutral-200/70 text-neutral-800"
                        }`}>
                          {item.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5.3 本轮方案 (Current Round Strategy Summary) */}
                <div className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAECF0] pb-3">
                    <h3 className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
                      <Target size={16} className="text-neutral-700" />
                      本轮运营方案
                    </h3>
                    <button 
                      onClick={() => setShowStrategyDrawer(true)}
                      className="px-3 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[12px] font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      查看完整本轮方案 <ChevronRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
                    <div className="p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-100 space-y-1">
                      <div className="text-neutral-500 font-medium">核心问题</div>
                      <div className="font-bold text-neutral-900 leading-relaxed">
                        {currentProject.strategyProtocol?.coreProblem || currentProject.goal || "解决幼犬换粮软便挑食顾虑，建立搜索词拦截卡位"}
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-100 space-y-1">
                      <div className="text-neutral-500 font-medium">内容方法</div>
                      <div className="font-bold text-neutral-900 leading-relaxed">
                        {currentProject.strategyProtocol?.solutionSummary || "店长专业科普 + 消费者真实体验 + 动态问卷笔记包"}
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-100 space-y-1">
                      <div className="text-neutral-500 font-medium">主体结构与观察</div>
                      <div className="font-bold text-neutral-900 leading-relaxed">
                        品牌官方号 (2) + 店长号 (5) + KOC笔记包 (10-13) · 观察14天
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* 2. 内容与发布 TAB                                       */}
            {/* ======================================================== */}
            {activeTab === "内容与发布" && (
              <div className="space-y-5">
                
                {/* View Switcher + Filter Controls */}
                <div className="bg-white rounded-2xl p-4 border border-[#EAECF0] shadow-2xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    
                    {/* View mode toggle: 按笔记 (默认) | 按账号 */}
                    <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
                      <button
                        onClick={() => setContentSubView("by_note")}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                          contentSubView === "by_note"
                            ? "bg-white text-neutral-900 shadow-2xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        按笔记
                      </button>
                      <button
                        onClick={() => setContentSubView("by_account")}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                          contentSubView === "by_account"
                            ? "bg-white text-neutral-900 shadow-2xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        按账号
                      </button>
                    </div>

                    {/* Right actions: Search + New Note */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="搜索标题、账号或类型..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 w-[220px] bg-neutral-50 border border-neutral-200 rounded-xl text-[12.5px] outline-none focus:bg-white focus:border-neutral-400 transition-colors"
                        />
                      </div>

                      <button
                        onClick={() => setShowImportSelect(true)}
                        className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-xl text-[12.5px] font-bold hover:bg-neutral-800 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Plus size={13} /> 新建内容
                      </button>
                    </div>
                  </div>

                  {/* Status Capsule Filters */}
                  {contentSubView === "by_note" && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-100">
                      {[
                        { label: "全部", count: counts.all, filter: "全部" },
                        { label: "待准备", count: counts.preparing, filter: "待准备" },
                        { label: "待发布", count: counts.pendingPublish, filter: "待发布" },
                        { label: "发布识别中", count: counts.detecting, filter: "发布识别中" },
                        { label: "观察中", count: counts.observing, filter: "观察中" },
                        { label: "已完成", count: counts.completed, filter: "已完成" },
                        { label: "异常", count: counts.exception, filter: "异常", isAlert: counts.exception > 0 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setStatusFilter(item.filter)}
                          className={`px-3 py-1 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 ${
                            statusFilter === item.filter
                              ? "bg-neutral-900 text-white shadow-2xs"
                              : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10.5px] ${
                            statusFilter === item.filter
                              ? "bg-white/20 text-white"
                              : item.isAlert
                              ? "bg-rose-100 text-rose-700 font-bold"
                              : "bg-neutral-200/60 text-neutral-600"
                          }`}>
                            {item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ---------------------------------------------------- */}
                {/* SUB-VIEW 1: 按笔记列表 (Height 88-112px)              */}
                {/* ---------------------------------------------------- */}
                {contentSubView === "by_note" && (
                  <div className="space-y-3">
                    {filteredNotes.length === 0 ? (
                      <div className="bg-white rounded-2xl p-12 border border-[#EAECF0] text-center space-y-2">
                        <FileText size={36} className="mx-auto text-neutral-300" />
                        <h4 className="text-[15px] font-bold text-neutral-900">未找到匹配的内容笔记</h4>
                        <p className="text-[12.5px] text-neutral-500">请尝试更换筛选条件或新建笔记</p>
                      </div>
                    ) : (
                      filteredNotes.map((note) => {
                        const uStatus = getUnifiedBusinessStatus(note);
                        const style = getStatusStyleClass(uStatus);
                        const isPkg = Boolean(note.isNotePackage || note.title?.includes("笔记包"));
                        const hasConsumerAnswers = Boolean(note.consumerQuestionnaire);

                        // Single fact calculation
                        let factText = "等待排期执行";
                        if (uStatus === "内容生成中") factText = "AI 正在根据项目策略起草正文";
                        else if (uStatus === "待内容确认") factText = "正文已起草，等待操盘手确认";
                        else if (uStatus === "待素材") factText = "尚缺场景图，已下发素材拍摄任务";
                        else if (uStatus === "内容已就绪" || uStatus === "待发布") factText = "内容与图片已就绪，已推送到发布端";
                        else if (uStatus === "等待账号执行") factText = "已下发至员工/店长端任务，等待小红书发布";
                        else if (uStatus === "等待消费者领取") factText = "已放入招募池，等待消费者领取代写任务";
                        else if (uStatus === "消费者进行中") factText = "消费者已领取代写任务，正在填写问卷或拍摄";
                        else if (uStatus === "发布识别中") factText = "已在小红书App发布，系统正在自动识别笔记ID";
                        else if (uStatus === "观察中") factText = "已成功识别关联，正在进行数据观察";
                        else if (uStatus === "观察完成") factText = "观察周期结束，数据已固化复盘";
                        else if (uStatus === "异常") factText = "发布状态或识别超时，需要人工介入核对";

                        if (isPkg) {
                          factText = `问卷已配置 · 当前已领取 ${note.claimedCount || 4}/${note.totalSlotsCount || 10} 人`;
                        } else if (hasConsumerAnswers) {
                          factText = `消费者已完成问卷提交（${note.consumerQuestionnaire?.petBreed || "金毛幼犬"}） · AI依据真实答卷起草`;
                        }

                        return (
                          <div
                            key={note.id}
                            onClick={() => setActiveNoteDetail(note)}
                            className="bg-white rounded-2xl p-4 border border-[#EAECF0] hover:border-neutral-400 hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between gap-3 min-h-[96px]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 flex-1 min-w-0">
                                {/* Title + Type Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-[14px] font-bold text-neutral-900 truncate">
                                    {note.title || note.contentDirection || "未命名任务"}
                                  </h4>

                                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-md shrink-0">
                                    {note.type || "品牌号"}
                                  </span>

                                  {isPkg && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold rounded-md shrink-0">
                                      消费者笔记包
                                    </span>
                                  )}

                                  {hasConsumerAnswers && !isPkg && (
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold rounded-md shrink-0">
                                      已填问卷
                                    </span>
                                  )}
                                </div>

                                {/* Account / Participant & Time */}
                                <div className="text-[12px] text-neutral-500 flex items-center gap-3">
                                  <span>主体: <strong className="text-neutral-700">{note.account || note.participant || "特唯普官方旗舰店"}</strong></span>
                                  <span>·</span>
                                  <span>计划: {note.plannedDate || "排期中"}</span>
                                </div>
                              </div>

                              {/* 13 Business Status Badge */}
                              <span className={`px-2.5 py-0.5 rounded-md text-[11.5px] font-bold border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                                {uStatus}
                              </span>
                            </div>

                            {/* Fact line + Main Action */}
                            <div className="flex items-center justify-between text-[12px] pt-1 border-t border-neutral-100/80">
                              <span className="text-neutral-600 truncate max-w-[700px]">
                                事实: {factText}
                              </span>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveNoteDetail(note);
                                  }}
                                  className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-[11.5px] font-bold rounded-lg transition-colors shadow-2xs"
                                >
                                  详情
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SUB-VIEW 2: 按账号视图 (Controllable + Consumer Pool)  */}
                {/* ---------------------------------------------------- */}
                {contentSubView === "by_account" && (
                  <div className="space-y-6">
                    
                    {/* 1. 自有可控账号矩阵 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                          <Users size={16} className="text-neutral-700" />
                          自有可控账号矩阵
                        </h4>
                        <span className="text-[12px] text-neutral-500">共 {controlledAccounts.length} 个发布账号</span>
                      </div>

                      <div className="space-y-3">
                        {controlledAccounts.map((acc) => {
                          const isExpanded = expandedAccountIds[acc.id];
                          const recentNotes = acc.notes.slice(0, 3);

                          return (
                            <div
                              key={acc.id}
                              className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-2xs space-y-4"
                            >
                              {/* Account Summary Header */}
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-[15px] font-extrabold text-neutral-900">{acc.name}</h5>
                                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-md">
                                      {acc.type}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-neutral-500">人设定位: {acc.persona}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedAccountForQueue({
                                      name: acc.name,
                                      type: acc.type,
                                      persona: acc.persona,
                                      notes: acc.notes
                                    })}
                                    className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[12px] font-bold rounded-xl transition-colors"
                                  >
                                    查看完整发布队列 ({acc.notes.length})
                                  </button>

                                  <button
                                    onClick={() => setExpandedAccountIds({
                                      ...expandedAccountIds,
                                      [acc.id]: !isExpanded
                                    })}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                                  >
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  </button>
                                </div>
                              </div>

                              {/* Quantitative Status Counters */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[12px]">
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">规划量</div>
                                  <div className="font-bold text-neutral-900 mt-0.5">{acc.planCount} 篇</div>
                                </div>
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">已发布</div>
                                  <div className="font-bold text-neutral-900 mt-0.5">{acc.publishedCount} 篇</div>
                                </div>
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">排队中</div>
                                  <div className="font-bold text-neutral-900 mt-0.5">{acc.queueCount} 篇</div>
                                </div>
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">待执行</div>
                                  <div className="font-bold text-amber-700 mt-0.5">{acc.waitingExecCount} 篇</div>
                                </div>
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">观察中</div>
                                  <div className="font-bold text-primary-700 mt-0.5">{acc.observingCount} 篇</div>
                                </div>
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">异常</div>
                                  <div className={`font-bold mt-0.5 ${acc.exceptionCount > 0 ? "text-rose-600" : "text-neutral-400"}`}>
                                    {acc.exceptionCount} 篇
                                  </div>
                                </div>
                                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                  <div className="text-neutral-400 text-[11px]">下次发布</div>
                                  <div className="font-bold text-neutral-800 text-[11px] mt-0.5 truncate">{acc.nextPlannedDate.split(' ')[0]}</div>
                                </div>
                              </div>

                              {/* Expanded Recent 3 items */}
                              {isExpanded && recentNotes.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-neutral-100">
                                  <div className="text-[12px] font-bold text-neutral-500">近期发布队列：</div>
                                  <div className="space-y-2">
                                    {recentNotes.map((note) => {
                                      const uStatus = getUnifiedBusinessStatus(note);
                                      const style = getStatusStyleClass(uStatus);
                                      return (
                                        <div
                                          key={note.id}
                                          onClick={() => setActiveNoteDetail(note)}
                                          className="p-3 bg-neutral-50/70 hover:bg-neutral-100/70 rounded-xl border border-neutral-100 flex items-center justify-between text-[12.5px] cursor-pointer transition-colors"
                                        >
                                          <div className="flex items-center gap-2 truncate max-w-[500px]">
                                            <span className="font-bold text-neutral-900 truncate">{note.title || "未命名笔记"}</span>
                                            <span className="text-[11.5px] text-neutral-500">({note.plannedDate})</span>
                                          </div>

                                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                            {uStatus}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. 消费者发布池 (Section 9) */}
                    <div className="space-y-3 pt-4 border-t border-neutral-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                          <Package size={16} className="text-indigo-600" />
                          消费者发布池 (按内容包聚合)
                        </h4>
                        <span className="text-[12px] text-neutral-500">不进入固定账号排期 · 动态招募履约</span>
                      </div>

                      <div className="space-y-3">
                        {consumerPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-[15px] font-extrabold text-neutral-900">{pkg.name}</h5>
                                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md border border-indigo-200">
                                    {pkg.type}
                                  </span>
                                </div>
                                <p className="text-[12px] text-neutral-500">
                                  有效期至: {pkg.validUntil} · 问卷已启用 · AI 秒级个性化生成
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setShowLandingPage(true)}
                                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-bold rounded-xl transition-colors shadow-2xs"
                                >
                                  落地页推广
                                </button>
                                <button
                                  onClick={() => {
                                    const target = allNotes.find(n => n.isNotePackage) || allNotes.find(n => n.title?.includes("内容包") || n.title?.includes("笔记包")) || pkg.notes[0];
                                    if (target) setActiveNoteDetail(target);
                                  }}
                                  className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[12px] font-bold rounded-xl transition-colors"
                                >
                                  查看内容包要求
                                </button>
                              </div>
                            </div>

                            {/* Aggregated Funnel Counters */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[12px]">
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">招募目标</div>
                                <div className="font-bold text-neutral-900 mt-0.5">{pkg.planSlots} 人</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">已领取</div>
                                <div className="font-bold text-neutral-900 mt-0.5">{pkg.claimed} 人</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">已填问卷</div>
                                <div className="font-bold text-neutral-900 mt-0.5">{pkg.questionnaireFilled} 人</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">已生成笔记</div>
                                <div className="font-bold text-neutral-900 mt-0.5">{pkg.notesGenerated} 篇</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">照片质检通过</div>
                                <div className="font-bold text-emerald-700 mt-0.5">{pkg.photosPassed} 组</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">已发布小红书</div>
                                <div className="font-bold text-neutral-900 mt-0.5">{pkg.published} 篇</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">未完成履约</div>
                                <div className="font-bold text-amber-700 mt-0.5">{pkg.incomplete} 人</div>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                                <div className="text-neutral-400 text-[11px]">待人工跟进</div>
                                <div className={`font-bold mt-0.5 ${pkg.needContactCount > 0 ? "text-rose-600" : "text-neutral-400"}`}>
                                  {pkg.needContactCount} 人
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ======================================================== */}
            {/* 3. 素材 TAB                                             */}
            {/* ======================================================== */}
            {activeTab === "素材" && currentProject && (
              <ProjectMaterialsTab 
                project={currentProject} 
                onNavigateToMaterials={() => setWorkflowTab?.("materials")}
              />
            )}

            {/* ======================================================== */}
            {/* 4. 数据 TAB (Section 12)                                */}
            {/* ======================================================== */}
            {activeTab === "数据" && (
              <div className="space-y-6">
                
                {/* Data Sub-view toggle: 项目汇总 | 按笔记 | 按账号 */}
                <div className="bg-white rounded-2xl p-4 border border-[#EAECF0] shadow-2xs flex items-center justify-between">
                  <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
                    <button
                      onClick={() => setDataSubView("summary")}
                      className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                        dataSubView === "summary"
                          ? "bg-white text-neutral-900 shadow-2xs"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      项目汇总
                    </button>
                    <button
                      onClick={() => setDataSubView("by_note")}
                      className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                        dataSubView === "by_note"
                          ? "bg-white text-neutral-900 shadow-2xs"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      按笔记明细
                    </button>
                    <button
                      onClick={() => setDataSubView("by_account")}
                      className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                        dataSubView === "by_account"
                          ? "bg-white text-neutral-900 shadow-2xs"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      按账号分析
                    </button>
                  </div>

                  <div className="text-[12px] text-neutral-500">
                    统计周期: 2026-08-10 至今 · 默认观察期 14 天
                  </div>
                </div>

                {/* 12.1 项目汇总视图 */}
                {dataSubView === "summary" && (
                  <div className="space-y-5">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-2xl p-4 border border-[#EAECF0] shadow-2xs">
                        <div className="text-[12px] text-neutral-500 font-medium">已发布笔记</div>
                        <div className="text-[24px] font-extrabold text-neutral-900 mt-1">6 篇</div>
                        <div className="text-[11.5px] text-neutral-400 mt-0.5">观察中 3 篇 · 观察完成 3 篇</div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-[#EAECF0] shadow-2xs">
                        <div className="text-[12px] text-neutral-500 font-medium">有效咨询总数</div>
                        <div className="text-[24px] font-extrabold text-emerald-600 mt-1">45 条</div>
                        <div className="text-[11.5px] text-neutral-400 mt-0.5">目标完成度 90%</div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-[#EAECF0] shadow-2xs">
                        <div className="text-[12px] text-neutral-500 font-medium">核心词搜索卡位</div>
                        <div className="text-[24px] font-extrabold text-neutral-900 mt-1">前 8 位</div>
                        <div className="text-[11.5px] text-neutral-400 mt-0.5">【幼犬换粮软便】拦截词</div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-[#EAECF0] shadow-2xs">
                        <div className="text-[12px] text-neutral-500 font-medium">AI 平台收录率</div>
                        <div className="text-[24px] font-extrabold text-neutral-900 mt-1">100%</div>
                        <div className="text-[11.5px] text-neutral-400 mt-0.5">已识别 6 篇全部收录</div>
                      </div>
                    </div>

                    {/* AI Review & Actionable Conclusion */}
                    <div className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-2xs space-y-4">
                      <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-500" />
                        AI 阶段复盘结论
                      </h4>

                      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3 text-[13px]">
                        <div className="font-bold text-neutral-900">
                          店长号“科学7日换粮法”专业科普在有效咨询率上显著优于普通晒宠内容。
                        </div>
                        <div className="text-neutral-600 leading-relaxed text-[12.5px] space-y-1">
                          <div>· 店长号产出 31 条有效咨询，单篇咨询转化效率是泛KOC的 2.8 倍。</div>
                          <div>· 真实痛点问卷生成的 KOC 测评在收藏率上表现突出（单篇收藏均值 65+）。</div>
                        </div>

                        <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[12px]">
                          <span className="text-neutral-500">下一步行动建议：加大店长号排期比重，KOC问卷强化“排便成型”事实细节。</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12.2 按笔记明细视图 */}
                {dataSubView === "by_note" && (
                  <div className="bg-white rounded-2xl border border-[#EAECF0] shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[12.5px] border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                            <th className="py-3 px-4">笔记标题</th>
                            <th className="py-3 px-3">发布主体</th>
                            <th className="py-3 px-3">发布时间</th>
                            <th className="py-3 px-2 text-right">浏览</th>
                            <th className="py-3 px-2 text-right">点赞</th>
                            <th className="py-3 px-2 text-right">收藏</th>
                            <th className="py-3 px-2 text-right">评论</th>
                            <th className="py-3 px-3 text-right">有效咨询</th>
                            <th className="py-3 px-3 text-center">原笔记</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-800">
                          {[
                            { title: "幼犬换粮总软便？宠物店长教你3步过渡避坑指南", author: "店长号 (张店长)", date: "08-11", views: "2,410", likes: "142", favs: "89", comments: "28", inquiries: "19", link: "https://xiaohongshu.com" },
                            { title: "我家3个月金毛幼犬换粮体验，记录7天软便改善！", author: "消费者KOC", date: "08-12", views: "3,820", likes: "210", favs: "124", comments: "35", inquiries: "12", link: "https://xiaohongshu.com" },
                            { title: "【官方科普】为什么幼犬换粮容易拉肚子？", author: "品牌官方号", date: "08-10", views: "1,890", likes: "96", favs: "45", comments: "18", inquiries: "8", link: "https://xiaohongshu.com" },
                            { title: "换粮避坑指南！幼犬益生菌真实适口性测评", author: "消费者KOC", date: "08-13", views: "1,520", likes: "78", favs: "52", comments: "14", inquiries: "6", link: "https://xiaohongshu.com" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-neutral-50/60 transition-colors">
                              <td className="py-3 px-4 font-bold text-neutral-900 max-w-[280px] truncate">{row.title}</td>
                              <td className="py-3 px-3 text-neutral-600">{row.author}</td>
                              <td className="py-3 px-3 text-neutral-500">{row.date}</td>
                              <td className="py-3 px-2 text-right font-medium">{row.views}</td>
                              <td className="py-3 px-2 text-right font-medium">{row.likes}</td>
                              <td className="py-3 px-2 text-right font-medium">{row.favs}</td>
                              <td className="py-3 px-2 text-right font-medium">{row.comments}</td>
                              <td className="py-3 px-3 text-right font-extrabold text-emerald-700">{row.inquiries}</td>
                              <td className="py-3 px-3 text-center">
                                <a href={row.link} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-900 inline-flex items-center">
                                  <ExternalLink size={13} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 12.3 按账号分析视图 */}
                {dataSubView === "by_account" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "特唯普官方旗舰店", type: "品牌官方号", count: 2, totalInteractions: 310, favs: 110, inquiries: 14, strongTopic: "品牌合规背书与原料透明化", weakTopic: "纯促销口吻打折信息" },
                      { name: "上海静安店 (张店长)", type: "员工KOS / 店长号", count: 3, totalInteractions: 820, favs: 240, inquiries: 31, strongTopic: "7天渐进换粮法与软便排查", weakTopic: "泛生活闲聊" },
                      { name: "消费者体验官发布池", type: "消费者KOC", count: 4, totalInteractions: 1240, favs: 380, inquiries: 18, strongTopic: "真实大口吃粮实拍与成型便便对比", weakTopic: "纯文字无图体验" },
                    ].map((acc, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-2xs space-y-3 text-[12.5px]">
                        <div>
                          <div className="font-extrabold text-[14px] text-neutral-900">{acc.name}</div>
                          <span className="text-[11px] text-neutral-500">{acc.type} · 发布 {acc.count} 篇</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-100 text-center">
                          <div>
                            <div className="text-[11px] text-neutral-400">总互动</div>
                            <div className="font-bold text-neutral-900 mt-0.5">{acc.totalInteractions}</div>
                          </div>
                          <div>
                            <div className="text-[11px] text-neutral-400">收藏</div>
                            <div className="font-bold text-neutral-900 mt-0.5">{acc.favs}</div>
                          </div>
                          <div>
                            <div className="text-[11px] text-emerald-600">有效咨询</div>
                            <div className="font-extrabold text-emerald-700 mt-0.5">{acc.inquiries}</div>
                          </div>
                        </div>

                        <div className="space-y-1 text-[11.5px]">
                          <div className="text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                            <strong>优质方向：</strong> {acc.strongTopic}
                          </div>
                          <div className="text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                            <strong>较弱方向：</strong> {acc.weakTopic}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DRAWERS & MODALS                                         */}
      {/* ======================================================== */}

      {/* Strategy Protocol Drawer */}
      {showStrategyDrawer && (
        <StrategyProtocolDrawer
          project={currentProject}
          onClose={() => setShowStrategyDrawer(false)}
        />
      )}

      {/* Account Queue Drawer */}
      {selectedAccountForQueue && (
        <AccountQueueDrawer
          accountName={selectedAccountForQueue.name}
          accountType={selectedAccountForQueue.type}
          persona={selectedAccountForQueue.persona}
          notes={selectedAccountForQueue.notes}
          onClose={() => setSelectedAccountForQueue(null)}
          onSelectNote={(note) => {
            setSelectedAccountForQueue(null);
            setActiveNoteDetail(note);
          }}
          onOpenExecutionCenter={() => {
            setSelectedAccountForQueue(null);
            setWorkflowTab?.("execution");
          }}
        />
      )}

      {/* Note Detail Drawer (Normal & Note Package Router) */}
      {activeNoteDetail && (
        <NoteDetailDrawer
          note={activeNoteDetail}
          projectId={currentProject.id}
          onClose={() => setActiveNoteDetail(null)}
          onOpenInExecutionCenter={() => {
            setActiveNoteDetail(null);
            setWorkflowTab?.("execution");
          }}
          onEditQuestionnaire={() => {
            setActiveNoteDetail(null);
            setShowProjectQuestionnaire(true);
          }}
        />
      )}

      {/* Landing Page Settings Modal */}
      {showLandingPage && currentProject && (
        <LandingPageSettingsModal
          project={currentProject}
          onClose={() => setShowLandingPage(false)}
        />
      )}

      {/* Project Questionnaire Drawer */}
      {showProjectQuestionnaire && currentProject && (
        <ProjectQuestionnaireDrawer 
          project={currentProject}
          onClose={() => setShowProjectQuestionnaire(false)} 
        />
      )}

      {/* Project Settings Modal */}
      {showProjectSettings && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/20" onClick={() => setShowProjectSettings(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[560px] shadow-xl overflow-hidden border border-[#EAECF0]">
            <div className="p-5 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
              <h2 className="text-[16px] font-bold text-[#111827]">项目信息设置</h2>
              <button onClick={() => setShowProjectSettings(false)} className="text-neutral-400 hover:text-[#667085]"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <div>
                <label className="block text-[12.5px] font-bold text-[#111827] mb-1.5">项目名称</label>
                <input type="text" defaultValue={currentProject.name} className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[13.5px] outline-none" />
              </div>
              <div>
                <label className="block text-[12.5px] font-bold text-[#111827] mb-1.5">项目周期</label>
                <div className="flex items-center gap-2">
                  <input type="date" defaultValue={currentProject.startDate} className="flex-1 px-3 py-2 border border-[#EAECF0] rounded-xl text-[13px]" />
                  <span className="text-neutral-400 text-[12px]">至</span>
                  <input type="date" defaultValue={currentProject.endDate} className="flex-1 px-3 py-2 border border-[#EAECF0] rounded-xl text-[13px]" />
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-bold text-[#111827] mb-1.5">默认观察周期</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="obs_period" className="accent-neutral-900" /> <span>24小时</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="obs_period" className="accent-neutral-900" /> <span>3天</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="obs_period" className="accent-neutral-900" defaultChecked /> <span>14天 (标准)</span>
                  </label>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100">
                <button onClick={() => setShowProjectSettings(false)} className="px-4 py-2 border border-[#EAECF0] bg-white text-[#111827] font-bold text-[12.5px] rounded-xl hover:bg-neutral-50 transition-colors">取消</button>
                <button onClick={() => setShowProjectSettings(false)} className="px-5 py-2 bg-neutral-900 text-white font-bold text-[12.5px] rounded-xl hover:bg-neutral-800 transition-colors">保存修改</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Project Confirm Modal */}
      {showArchiveConfirm && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl border border-[#EAECF0] max-w-md w-full p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#111827]">归档项目确认</h3>
              <p className="text-[13px] text-[#667085] mt-1.5 leading-relaxed">
                确认归档“<span className="font-bold text-[#111827]">{currentProject.name}</span>”吗？归档后项目数据与笔记将被安全保留。
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 border border-[#EAECF0] text-[#344054] hover:bg-neutral-50 rounded-xl text-[13px] font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteProject(currentProject.id);
                  setShowArchiveConfirm(false);
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold transition-colors shadow-xs"
              >
                确认归档
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Import / Create Select Modal */}
      {showImportSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={() => setShowImportSelect(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#EAECF0]">
            <div className="p-5 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
              <div>
                <h3 className="font-bold text-[16px] text-[#111827]">新建内容或笔记</h3>
                <p className="text-[12px] text-[#667085] mt-0.5">请选择新建或导入内容的方式</p>
              </div>
              <button onClick={() => setShowImportSelect(false)} className="text-neutral-400 hover:text-[#667085] p-1 rounded-lg hover:bg-neutral-200"><X size={18}/></button>
            </div>
            
            <div className="p-4 space-y-2.5">
              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("file"); }}
                className="w-full p-3.5 text-left bg-white border border-[#EAECF0] hover:border-emerald-300 hover:bg-emerald-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center justify-between">
                    <span>批量导入 Excel / CSV</span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-medium">批量解析</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">上传 Excel 表格文件，解析提取笔记标题与计划</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("feishu"); }}
                className="w-full p-3.5 text-left bg-white border border-[#EAECF0] hover:border-blue-300 hover:bg-blue-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Link2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center justify-between">
                    <span>关联飞书多维表格</span>
                    <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md font-medium">云端同步</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">粘贴飞书表格 URL，自动导入并同步笔记任务</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowBatchAIGenerator(true); }}
                className="w-full p-3.5 text-left bg-white border border-[#EAECF0] hover:border-primary-300 hover:bg-primary-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-primary-100 text-primary-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center justify-between">
                    <span>AI 批量智能规划生成</span>
                    <span className="text-[11px] text-primary-700 bg-primary-100 px-2 py-0.5 rounded-md font-medium">智能规划</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">根据项目目标与知识库，由 AI 批量起草多篇笔记</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("single"); }}
                className="w-full p-3.5 text-left bg-white border border-[#EAECF0] hover:border-neutral-400 hover:bg-neutral-50 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-neutral-100 text-neutral-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Plus size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center justify-between">
                    <span>手动新建单篇笔记</span>
                    <span className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">单篇</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">手动填写标题、选择账号与设定发布排期</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Import / Creation Modal */}
      {showAddNoteModal && currentProject && (
        <AddSingleNoteModal 
          project={currentProject} 
          initialTab={showAddNoteModal} 
          onClose={() => setShowAddNoteModal(null)} 
        />
      )}

      {/* AI Batch Generator Modal */}
      {showBatchAIGenerator && currentProject && (
        <BatchNoteGeneratorModal 
          project={currentProject} 
          onClose={() => setShowBatchAIGenerator(false)} 
        />
      )}
    </div>
  );
}
