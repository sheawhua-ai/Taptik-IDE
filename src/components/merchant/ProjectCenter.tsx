import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Calendar, AlertTriangle, CheckCircle2, History, 
  MoreHorizontal, FileText, Check, ChevronRight, X,
  ExternalLink, QrCode, FileSpreadsheet, Trash2, Camera, User, 
  BarChart2, Lightbulb, Link2, ChevronDown, ChevronUp, AlertCircle, 
  PanelLeftClose, PanelLeftOpen, Upload, Target, ShieldAlert, 
  Layers, Clock, Users, Eye, ArrowRight, Package, Send,
  HelpCircle, Image as ImageIcon, Video, Activity
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { Project, Note } from "../../data/projectStore";
import { KeywordSearchSnapshot } from "../../data/unifiedStore";
import { 
  calculateProjectPipeline, 
  getUnifiedBusinessStatus, 
  getStatusStyleClass, 
  UnifiedBusinessStatus,
  getActionTextForIssue,
  getNotePrimaryAction,
  getNoteReadiness
} from "../../utils/noteStatus";

import { NoteDetailDrawer } from "./ProjectCenter/NoteDetailDrawer";
import { StrategyCustomizationDrawer } from "./ProjectCenter/StrategyCustomizationDrawer";
import { AccountQueueDrawer } from "./ProjectCenter/AccountQueueDrawer";
import { ProjectQuestionnaireDrawer } from "../rings/ProjectQuestionnaireDrawer";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { CreateProjectWorkstation } from "./CreateProjectWorkstation";
import { LandingPageSettingsModal } from "./LandingPageSettingsModal";
import { BatchNoteGeneratorModal } from "./BatchNoteGeneratorModal";
import { AddSingleNoteModal } from "./AddSingleNoteModal";
import { DispatchMaterialTaskModal } from "./DispatchMaterialTaskModal";
import { formatChineseDate } from "../../utils/formatDate";
import type { IndustryDefaults, MerchantIndustryProfile } from "../../data/industryCatalog";

export function ProjectCenter({ 
  setWorkflowTab, 
  hasData, 
  activeProjectId,
  industryProfile,
  industryDefaults
}: { 
  setWorkflowTab?: (tab: string) => void; 
  hasData?: boolean; 
  activeProjectId?: string;
  industryProfile?: MerchantIndustryProfile;
  industryDefaults?: IndustryDefaults;
}) {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    currentProject, 
    updateProject,
    unifiedState,
    createStrategyVersion,
    jumpToExecution
  } = useProjectStore();

  // 1. Unified 2 Tabs: 概览, 内容与素材
  const [activeTab, setActiveTab] = useState<"概览" | "内容与素材">("概览");
  
  // Sub-views inside "内容与素材": 2 views (by_note | by_account)
  const [contentSubView, setContentSubView] = useState<"by_note" | "by_account">("by_note");

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectFilterStatus, setProjectFilterStatus] = useState<"全部" | "运行中" | "准备中" | "已归档">("全部");

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

  const [showStrategyCustomization, setShowStrategyCustomization] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showProjectQuestionnaire, setShowProjectQuestionnaire] = useState(false);
  const [feedbackContentPackage, setFeedbackContentPackage] = useState<Note | null>(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showOperationLogs, setShowOperationLogs] = useState(false);
  const [showImportSelect, setShowImportSelect] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState<"file" | "feishu" | "single" | null>(null);
  const [showBatchAIGenerator, setShowBatchAIGenerator] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showAssetsDrawer, setShowAssetsDrawer] = useState(false);
  const [previewAssetUrl, setPreviewAssetUrl] = useState<string | null>(null);
  const [activeWorkbench, setActiveWorkbench] = useState<"content" | "assets" | "publish" | "create_project" | null>(null);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);

  // Auto-refresh timestamp
  const [lastUpdatedText, setLastUpdatedText] = useState("刚刚");
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    localStorage.setItem("tap_tik_project_sidebar", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

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
      <div className="flex-1 flex items-center justify-center text-text-tertiary bg-page-bg text-[14px]">
        请选择左侧方案或新建方案
      </div>
    );
  }

  // Workbenches
  if (activeWorkbench === "content") return <ContentReviewWorkbench onClose={() => setActiveWorkbench(null)} />;
  if (activeWorkbench === "assets") return <ShootingAndUploadWorkbench onClose={() => setActiveWorkbench(null)} />;
  if (activeWorkbench === "publish") return <PublishExceptionWorkbench onClose={() => setActiveWorkbench(null)} onBack={() => setActiveWorkbench(null)} fromSource="project" />;
  if (activeWorkbench === "create_project") return <CreateProjectWorkstation industryDefaults={industryDefaults} industryProfile={industryProfile} onClose={() => setActiveWorkbench(null)} onCreate={() => setActiveWorkbench(null)} />;

  const pipeline = calculateProjectPipeline(currentProject.notes || []);

  // The plan list represents lifecycle only. Operational exceptions live in Execution Center.
  const getProjectLifecycleState = (project: Project) => {
    if (project.status === "已结束") return { label: "已归档", tone: "archived" as const };
    if (project.status === "准备中") return { label: "准备中", tone: "idle" as const };
    return { label: "运行中", tone: "running" as const };
  };

  const filteredProjects = projects.filter((p) => {
    if (projectSearchQuery && !p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())) return false;
    if (projectFilterStatus === "运行中" && p.status !== "进行中") return false;
    if (projectFilterStatus === "准备中" && p.status !== "准备中") return false;
    if (projectFilterStatus === "已归档" && p.status !== "已结束") return false;
    return true;
  });
  const currentLifecycleState = getProjectLifecycleState(currentProject);

  const projectStrategyVersions = unifiedState.strategyVersions.filter(version => version.projectId === currentProject.id);
  const activeStrategyVersion = projectStrategyVersions.find(version => version.status === "active");
  const activeStrategy = activeStrategyVersion?.configuration || {
    ...currentProject.strategyProtocol,
    targetKeywords: currentProject.strategyProtocol?.targetKeywords || [],
    observationDays: currentProject.strategyProtocol?.observationDays || 14
  };
  const projectSlots = unifiedState.noteSlots.filter(slot => slot.projectId === currentProject.id);
  const projectSlotIds = new Set(projectSlots.map(slot => slot.id));
  const projectDrafts = unifiedState.contentDrafts.filter(draft => projectSlotIds.has(draft.noteSlotId));
  const projectPublishTasks = unifiedState.publishTasks.filter(task => projectSlotIds.has(task.noteSlotId));
  const projectPublishTaskIds = new Set(projectPublishTasks.map(task => task.id));
  const projectPublishedNotes = unifiedState.publishedNotes.filter(note => projectPublishTaskIds.has(note.publishTaskId));
  const publishedNoteIds = new Set(projectPublishedNotes.map(note => note.id));
  const performanceSnapshots = unifiedState.notePerformanceSnapshots.filter(snapshot => publishedNoteIds.has(snapshot.publishedNoteId));
  const notesWithPerformance = new Set(performanceSnapshots.map(snapshot => snapshot.publishedNoteId));
  const effectiveConsultations = performanceSnapshots.reduce((sum, snapshot) => sum + (snapshot.metrics.effectiveConsultations || 0), 0);
  const latestKeywordSnapshots: KeywordSearchSnapshot[] = Array.from(
    unifiedState.keywordSearchSnapshots
      .filter(snapshot => snapshot.projectId === currentProject.id)
      .reduce((latest, snapshot) => {
        const previous = latest.get(snapshot.keyword);
        if (!previous || previous.capturedAt < snapshot.capturedAt) latest.set(snapshot.keyword, snapshot);
        return latest;
      }, new Map<string, KeywordSearchSnapshot>())
      .values()
  );
  const searchableNotes = projectPublishedNotes.filter(note => note.platformNoteId);
  const searchMatches = searchableNotes.flatMap(note => latestKeywordSnapshots.flatMap(snapshot => {
    const match = snapshot.results.find(result => result.noteId === note.platformNoteId);
    return match ? [{ publishedNoteId: note.id, keyword: snapshot.keyword, rank: match.rank, capturedAt: snapshot.capturedAt }] : [];
  }));
  const indexedPublishedNoteIds = new Set(searchMatches.map(match => match.publishedNoteId));
  const bestSearchMatch = [...searchMatches].sort((a, b) => a.rank - b.rank)[0];
  const latestReviewProposal = unifiedState.reviewAdjustmentProposals
    .filter(proposal => proposal.projectId === currentProject.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const futureNoteCount = Math.max(0, projectSlots.length - projectDrafts.length);

  const openNoteOperation = (note: Note, action: import("../../data/unifiedStore").ExecutionAction, source: "note_list" | "note_detail") => {
    jumpToExecution({ projectId: currentProject.id, noteId: note.id, action, source });
    setWorkflowTab?.("execution");
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
    <div className="workspace-shell project-workspace h-full w-full flex bg-page-bg text-text-main relative overflow-hidden font-sans">
      
      {/* LEFT: Collapsible Project List */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="workspace-sidebar bg-surface-1 border-r border-border-default flex flex-col shrink-0 z-10 overflow-hidden"
          >
            <div className="workspace-sidebar-header border-b border-border-default space-y-3 w-[320px] shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-[15px] font-semibold text-text-main">方案列表</h2>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveWorkbench("create_project")}
                    className="w-7 h-7 rounded-lg bg-btn-main text-white flex items-center justify-center hover:bg-btn-main-hover transition-colors"
                    title="新建方案"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    title="收起方案列表" 
                    className="w-7 h-7 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"
                  >
                    <PanelLeftClose size={16} />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索方案..." 
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {(["全部", "运行中", "准备中", "已归档"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setProjectFilterStatus(status)}
                    className={`px-2.5 py-1 text-[13px] rounded-md font-medium transition-colors ${
                      projectFilterStatus === status 
                        ? "bg-btn-main text-white" 
                        : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar w-[320px]">
              {filteredProjects.map((proj) => {
                const lifecycleState = getProjectLifecycleState(proj);
                const version = unifiedState.strategyVersions.find(item => item.projectId === proj.id && item.status === "active");
                const planNoteCount = unifiedState.noteSlots.filter(slot => slot.projectId === proj.id).length;
                const statusText = `${planNoteCount} 篇发布计划${version ? ` · 策略 V${version.version}` : ""}`;

                const isSelected = selectedProjectId === proj.id;

                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`w-full text-left px-4 py-3.5 transition-colors border-b border-border-subtle relative ${
                      isSelected 
                        ? "bg-surface-subtle" 
                        : "bg-transparent hover:bg-hover-bg text-text-main"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />
                    )}
                    <div className={`text-[13px] line-clamp-1 ${isSelected ? 'font-semibold text-text-main' : 'font-medium text-text-main'}`}>
                      {proj.name}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[13px] text-text-tertiary tabular-nums">
                      <span>{formatChineseDate(proj.startDate)}</span>
                      <span>—</span>
                      <span>{formatChineseDate(proj.endDate)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[13px] min-w-0">
                      <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-medium ${
                        lifecycleState.tone === "running" ? "bg-info-light text-info" :
                        "bg-surface-selected text-text-secondary"
                      }`}>
                        {lifecycleState.label}
                      </span>
                      <span className="truncate text-text-tertiary" title={statusText}>{statusText}</span>
                    </div>
                  </button>
                );
              })}
              {filteredProjects.length === 0 && (
                <div className="px-5 py-10 text-center text-[13px] text-text-tertiary">
                  当前筛选下没有方案
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT: Main Project Workspace */}
      <div className="project-workspace-main flex-1 flex flex-col min-w-0 bg-page-bg overflow-hidden">
        
        {/* Header Bar */}
        <div className="workspace-header bg-surface-1 border-b border-border-default shrink-0 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                title="展开方案列表"
                className="mt-0.5 w-7 h-7 flex items-center justify-center border border-border-default rounded-lg text-text-secondary hover:text-text-main hover:bg-surface-subtle transition-colors"
              >
                <PanelLeftOpen size={15} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-[17px] font-semibold text-text-main">{currentProject.name}</h1>
                <span className={`rounded-md px-2 py-0.5 text-[13px] font-medium ${
                  currentLifecycleState.tone === "running" ? "bg-info-light text-info" :
                  "bg-surface-selected text-text-secondary"
                }`}>
                  {currentLifecycleState.label}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[13px] text-text-secondary">
                <span className="flex items-center gap-1.5"><Calendar size={13} className="text-text-tertiary" /> {formatChineseDate(currentProject.startDate)} 至 {formatChineseDate(currentProject.endDate)}</span>
                <span className="text-border-strong">|</span>
                <span className="truncate max-w-[min(48vw,680px)] text-text-tertiary" title={currentProject.goal}>
                  目标：{currentProject.goal || "验证真实换粮体验与店长专业解释能否提高有效咨询"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Actions in More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                title="更多操作"
                className="w-8 h-8 border border-border-default text-text-secondary hover:text-text-main rounded-lg hover:bg-surface-subtle transition-colors flex items-center justify-center bg-surface-1"
              >
                <MoreHorizontal size={15} />
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-surface-1 border border-border-default rounded-xl shadow-lg z-50 py-1.5 text-[13px]">
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => {
                        setShowMoreMenu(false);
                        setFeedbackContentPackage(allNotes.find(note => note.isNotePackage) || null);
                        setShowProjectQuestionnaire(true);
                      }}
                    >
                      <FileText size={14} className="text-text-tertiary" />
                      <span>内容包体验反馈</span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowLandingPage(true); }}
                    >
                      <QrCode size={14} className="text-text-tertiary" />
                      <span>落地页推广设置</span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowOperationLogs(true); }}
                    >
                      <History size={14} className="text-text-tertiary" />
                      <span>操作记录</span>
                    </button>
                    <div className="my-1 border-t border-border-default" />
                    <button 
                      onClick={() => { setShowMoreMenu(false); setShowArchiveConfirm(true); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-danger-light text-danger flex items-center gap-2 font-medium"
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

        {/* Level-2 Primary Tabs: Exactly 2 Tabs */}
        <div className="px-6 bg-surface-1 border-b border-border-default flex items-center justify-between text-[13px] font-medium shrink-0">
          <div className="flex gap-7">
            {(["概览", "内容与素材"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 relative font-medium ${activeTab === tab ? "text-text-main" : "text-text-secondary hover:text-text-main"}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="projectCenterTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-logo" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
            <span>更新时间：{lastUpdatedText}</span>
          </div>
        </div>

        {/* Main View Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto p-6 space-y-5">
            
            {/* ======================================================== */}
            {/* 1. 概览 TAB                                             */}
            {/* ======================================================== */}
            {activeTab === "概览" && (
              <div className="space-y-5">

                {industryProfile && industryDefaults && (
                  <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-blue-700">
                          <Layers size={14} />行业默认起盘模板
                        </div>
                        <h3 className="mt-1.5 text-[14px] font-semibold text-blue-950">{industryDefaults.workflowName}</h3>
                        <div className="mt-1 text-[13px] text-blue-800">
                          {industryProfile.primaryName}
                          {industryProfile.secondaryNames.length > 0 ? ` · ${industryProfile.secondaryNames.join("、")}` : ""}
                          {industryProfile.tertiaryNames.length > 0 ? ` · ${industryProfile.tertiaryNames.join("、")}` : ""}
                        </div>
                      </div>
                      <button onClick={() => setActiveWorkbench("create_project")} className="rounded-lg bg-blue-700 px-3.5 py-2 text-[13px] font-medium text-white hover:bg-blue-800">
                        使用模板创建方案
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {industryDefaults.workflowSteps.map((step, index) => (
                        <React.Fragment key={step}>
                          <span className="rounded-md border border-blue-100 bg-white/80 px-2 py-1 text-[13px] text-blue-900">{index + 1}. {step}</span>
                          {index < industryDefaults.workflowSteps.length - 1 && <ArrowRight size={11} className="text-blue-300" />}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="mt-3 grid gap-2 border-t border-blue-100 pt-3 text-[13px] sm:grid-cols-3">
                      <div><span className="text-blue-600">方案模板：</span><span className="text-blue-950">{industryDefaults.planTemplates.join("、")}</span></div>
                      <div><span className="text-blue-600">内容模板：</span><span className="text-blue-950">{industryDefaults.contentTemplates.join("、")}</span></div>
                      <div><span className="text-blue-600">账号角色：</span><span className="text-blue-950">{industryDefaults.accountRoles.join("、")}</span></div>
                    </div>
                  </section>
                )}


                {/* 1.1 Current operating logic */}
                <div className="space-y-4 rounded-xl border border-border-default bg-surface-1 p-5">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <div>
                      <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
                        <Target size={16} className="text-text-secondary" />
                        当前运营逻辑
                        <span className="rounded-md border border-border-default bg-surface-subtle px-2 py-0.5 text-[13px] font-medium text-text-secondary">
                          V{activeStrategyVersion?.version || 1}
                        </span>
                      </h3>
                      <div className="mt-1 text-[13px] text-text-tertiary">
                        {activeStrategyVersion?.source === "expert_adjustment" ? "专家定制版本" : activeStrategyVersion?.source === "review_applied" ? "复盘建议应用版本" : "首次方案生成版本"}
                        {activeStrategyVersion?.effectiveFrom ? ` · ${formatChineseDate(activeStrategyVersion.effectiveFrom, true)} 起生效` : ""}
                      </div>
                    </div>
                    <button onClick={() => setShowStrategyCustomization(true)} className="rounded-lg bg-btn-main px-3 py-1.5 text-[13px] font-medium text-white hover:bg-btn-main-hover">
                      专家定制
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-[13px] md:grid-cols-3">
                    <div className="space-y-1 rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">核心问题</div>
                      <div className="font-medium leading-relaxed text-text-main">{activeStrategy.coreProblem || currentProject.goal}</div>
                    </div>
                    <div className="space-y-1 rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">内容方法</div>
                      <div className="font-medium leading-relaxed text-text-main">{activeStrategy.solutionSummary || "尚未配置"}</div>
                    </div>
                    <div className="space-y-1 rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">验证目标</div>
                      <div className="font-medium leading-relaxed text-text-main">{activeStrategy.verifyHypothesis || "尚未配置"}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-border-default px-3.5 py-3 text-[13px]">
                    <span className="text-text-tertiary">发布计划结构</span>
                    {(["品牌主号", "店长号/KOS", "KOC"] as const).map(accountType => (
                      <span key={accountType} className="text-text-secondary">
                        {accountType} <strong className="font-semibold text-text-main">{projectSlots.filter(slot => slot.accountType === accountType).length}</strong>
                      </span>
                    ))}
                    <span className="text-text-secondary">待生成 <strong className="font-semibold text-text-main">{futureNoteCount}</strong></span>
                    <span className="ml-auto text-text-tertiary">之后生成的笔记使用 V{activeStrategyVersion?.version || 1}</span>
                  </div>
                </div>

                {/* 1.2 Post-publish feedback */}
                <div className="space-y-4 rounded-xl border border-border-default bg-surface-1 p-5">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <div>
                      <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
                        <BarChart2 size={16} className="text-text-secondary" />
                        发布后数据回传
                      </h3>
                      <p className="mt-1 text-[13px] text-text-tertiary">只展示已经由接口回传的数据，不以计划值代替结果。</p>
                    </div>
                    {latestKeywordSnapshots[0] && <span className="text-[13px] text-text-tertiary">搜索快照：{formatChineseDate(latestKeywordSnapshots[0].capturedAt, true)}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">已发布笔记</div>
                      <div className="mt-1 text-[20px] font-semibold tabular-nums text-text-main">{projectPublishedNotes.length} 篇</div>
                      <div className="mt-0.5 text-[13px] text-text-tertiary">已取得平台 ID {searchableNotes.length} 篇</div>
                    </div>
                    <div className="rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">笔记数据回传</div>
                      <div className="mt-1 text-[20px] font-semibold tabular-nums text-text-main">{notesWithPerformance.size}/{projectPublishedNotes.length}</div>
                      <div className="mt-0.5 text-[13px] text-text-tertiary">互动与咨询数据</div>
                    </div>
                    <div className="rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">有效咨询</div>
                      <div className={`mt-1 text-[20px] font-semibold tabular-nums ${notesWithPerformance.size ? "text-emerald-700" : "text-text-tertiary"}`}>
                        {notesWithPerformance.size ? `${effectiveConsultations} 条` : "待回传"}
                      </div>
                      <div className="mt-0.5 text-[13px] text-text-tertiary">属于发布后的笔记数据</div>
                    </div>
                    <div className="rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div className="text-[13px] text-text-tertiary">关键词收录与排名</div>
                      <div className="mt-1 text-[20px] font-semibold tabular-nums text-text-main">
                        {latestKeywordSnapshots.length === 0 ? "待采集" : `${indexedPublishedNoteIds.size}/${searchableNotes.length} 篇`}
                      </div>
                      <div className="mt-0.5 truncate text-[13px] text-text-tertiary" title={bestSearchMatch?.keyword}>
                        {bestSearchMatch ? `最佳第 ${bestSearchMatch.rank} 位 · ${bestSearchMatch.keyword}` : searchableNotes.length ? "本次搜索结果未匹配到笔记 ID" : "发布并取得笔记 ID 后开始搜索"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border-default bg-surface-subtle p-3.5 text-[13px] text-text-secondary">
                    <div className="flex items-start gap-2">
                      <Search size={15} className="mt-0.5 shrink-0 text-text-tertiary" />
                      <div className="leading-relaxed">
                        <span className="font-medium text-text-main">收录判断：</span>
                        调用关键词搜索接口获取结果列表，以平台笔记 ID 匹配；匹配成功即记录该关键词下已收录及所在名次。当前配置关键词：
                        {activeStrategy.targetKeywords?.length ? activeStrategy.targetKeywords.join("、") : "尚未配置"}。
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.3 Strategy evolution */}
                <div className="space-y-3 rounded-xl border border-border-default bg-surface-1 p-5">
                  <div className="flex items-center gap-2 border-b border-border-default pb-3">
                    <Lightbulb size={16} className="text-text-secondary" />
                    <h3 className="text-[14px] font-semibold text-text-main">复盘如何影响方案</h3>
                  </div>
                  {latestReviewProposal ? (
                    <div className="flex items-start justify-between gap-5 rounded-lg border border-border-default bg-surface-subtle p-3.5">
                      <div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-text-main">
                          复盘调整建议
                          <span className={`rounded px-1.5 py-0.5 text-[13px] ${latestReviewProposal.status === "pending" ? "bg-warning-light text-warning" : "bg-success-light text-success"}`}>
                            {latestReviewProposal.status === "pending" ? "待确认，尚未生效" : "已生成新策略版本"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{latestReviewProposal.summary}</p>
                        <p className="mt-1 text-[13px] text-text-tertiary">即使应用，也只影响之后生成的笔记；历史内容继续绑定原版本。</p>
                      </div>
                      <button onClick={() => setWorkflowTab?.("review")} className="shrink-0 rounded-lg border border-border-default bg-surface-1 px-3 py-1.5 text-[13px] font-medium text-text-main hover:bg-hover-bg">
                        查看复盘
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-surface-subtle p-3.5 text-[13px] text-text-tertiary">当前还没有可影响后续策略的复盘建议。</div>
                  )}
                </div>



              </div>
            )}

            {/* ======================================================== */}
            {/* 2. 内容与素材 TAB                                       */}
            {/* ======================================================== */}
            {activeTab === "内容与素材" && (
              <div className="space-y-5">

                {/* Compact Material Collaboration Status Bar */}
                <div className="h-14 px-5 bg-surface-1 rounded-xl border border-border-default shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-text-main flex items-center gap-2">
                        <span>素材协作</span>
                        <span className="px-2 py-0.5 bg-surface-subtle border border-border-default text-text-secondary text-[13px] font-medium rounded-md">有任务等待确认</span>
                      </div>
                      <div className="text-[13px] text-text-secondary mt-0.5">
                        3项任务进行中 · 5件素材已回传
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setShowAssetsDrawer(true)}
                      className="px-3 py-1.5 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      查看素材
                    </button>
                    <button
                      onClick={() => setShowDispatchModal(true)}
                      className="px-3.5 py-1.5 bg-btn-main hover:bg-btn-main-hover text-white rounded-lg text-[13px] font-medium transition-colors shadow-xs cursor-pointer"
                    >
                      下发素材任务
                    </button>
                  </div>
                </div>
                
                {/* View Switcher + Filter Controls */}
                <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Sub-view toggle: Strictly 2 Views (按笔记列表 | 按账号矩阵) */}
                    <div className="flex items-center bg-surface-subtle p-1 rounded-lg border border-border-default">
                      <button
                        onClick={() => setContentSubView("by_note")}
                        className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                          contentSubView === "by_note"
                            ? "bg-surface-1 text-text-main shadow-xs"
                            : "text-text-tertiary hover:text-text-main"
                        }`}
                      >
                        按笔记列表
                      </button>
                      <button
                        onClick={() => setContentSubView("by_account")}
                        className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                          contentSubView === "by_account"
                            ? "bg-surface-1 text-text-main shadow-xs"
                            : "text-text-tertiary hover:text-text-main"
                        }`}
                      >
                        按账号矩阵
                      </button>
                    </div>

                    {/* Right actions: Search + Single Primary Action */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
                        <input 
                          type="text" 
                          placeholder="搜索标题、账号或类型..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 w-[200px] bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
                        />
                      </div>

                      {/* Single Dark Primary Button for Content Tab */}
                      <button
                        onClick={() => setShowImportSelect(true)}
                        className="px-3.5 py-1.5 bg-btn-main text-white rounded-lg text-[13px] font-medium hover:bg-btn-main-hover transition-colors flex items-center gap-1"
                      >
                        <Plus size={13} /> 新建内容
                      </button>
                    </div>
                  </div>

                  {/* Status Capsule Filters for Notes */}
                  {contentSubView === "by_note" && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-default">
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
                          className={`px-3 py-1 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                            statusFilter === item.filter
                              ? "bg-btn-main text-white"
                              : "bg-surface-subtle hover:bg-hover-bg text-text-secondary border border-border-default"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[13px] ${
                            statusFilter === item.filter
                              ? "bg-surface-1/20 text-white"
                              : item.isAlert
                              ? "text-danger font-medium"
                              : "text-text-tertiary"
                          }`}>
                            {item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* SUB-VIEW 1: 按笔记列表 */}
                {contentSubView === "by_note" && (
                  <div className="space-y-3">
                    {filteredNotes.length === 0 ? (
                      <div className="bg-surface-1 rounded-xl p-12 border border-border-default text-center space-y-2">
                        <FileText size={32} className="mx-auto text-neutral-300" />
                        <h4 className="text-[14px] font-semibold text-text-main">未找到匹配的内容笔记</h4>
                        <p className="text-[13px] text-text-tertiary">请尝试更换筛选条件或新建内容</p>
                      </div>
                    ) : (
                      filteredNotes.map((note) => {
                        const uStatus = getUnifiedBusinessStatus(note);
                        const style = getStatusStyleClass(uStatus);
                        const isPkg = Boolean(note.isNotePackage || note.title?.includes("笔记包"));
                        const hasConsumerAnswers = Boolean(note.consumerQuestionnaire);
                        const primaryAction = getNotePrimaryAction(note);
                        const readiness = getNoteReadiness(note);

                        return (
                          <div
                            key={note.id}
                            onClick={() => setActiveNoteDetail(note)}
                            className="bg-surface-1 rounded-xl p-4 border border-border-default hover:border-border-strong transition-all cursor-pointer flex flex-col justify-between gap-2.5 group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-[13.5px] font-semibold text-text-main truncate group-hover:text-text-main">
                                    {note.title || note.contentDirection || "未命名任务"}
                                  </h4>

                                  <span className="px-2 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-normal rounded shrink-0">
                                    {note.type || "品牌号"}
                                  </span>

                                  {isPkg && (
                                    <span className="px-2 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-normal rounded shrink-0">
                                      消费者笔记包
                                    </span>
                                  )}

                                  {hasConsumerAnswers && !isPkg && (
                                    <span className="px-2 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-normal rounded shrink-0">
                                      已填问卷
                                    </span>
                                  )}
                                </div>

                                <div className="text-[13px] text-text-tertiary flex items-center gap-3">
                                  <span>账号：<span className="font-normal text-text-secondary">{note.account || note.participant || "特唯普官方旗舰店"}</span></span>
                                  <span>·</span>
                                  <span>发布计划：{note.plannedDate ? formatChineseDate(note.plannedDate) : "排期中"}</span>
                                  {!isPkg && !["已发布", "发布异常"].includes(note.publishStatus) && !readiness.readyToPublish && readiness.missing.length > 0 && (
                                    <>
                                      <span>·</span>
                                      <span>缺少：{readiness.missing.join("、")}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded text-[13px] font-medium border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                                  {readiness.readyToPublish && note.publishStatus === "未安排" ? "已进入待发池" : uStatus}
                                </span>
                                {primaryAction && (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openNoteOperation(note, primaryAction.action, "note_list");
                                    }}
                                    className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                                      primaryAction.tone === "danger"
                                        ? "border border-danger-light bg-danger-light text-danger hover:opacity-85"
                                        : primaryAction.tone === "primary"
                                        ? "bg-btn-main text-white hover:bg-btn-main-hover"
                                        : "border border-border-default bg-surface-subtle text-text-main hover:bg-hover-bg"
                                    }`}
                                  >
                                    {primaryAction.label}
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* SUB-VIEW 2: 按账号矩阵 */}
                {contentSubView === "by_account" && (
                  <div className="space-y-5">
                    
                    {/* 1. 自有可控账号矩阵 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                          <Users size={16} className="text-text-secondary" />
                          自有可控账号矩阵
                        </h4>
                        <span className="text-[13px] text-text-tertiary">共 {controlledAccounts.length} 个账号</span>
                      </div>

                      <div className="space-y-3">
                        {controlledAccounts.map((acc) => {
                          const isExpanded = expandedAccountIds[acc.id];
                          const recentNotes = acc.notes.slice(0, 3);

                          return (
                            <div
                              key={acc.id}
                              className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3.5"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-[14px] font-semibold text-text-main">{acc.name}</h5>
                                    <span className="px-2 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-normal rounded">
                                      {acc.type}
                                    </span>
                                  </div>
                                  <p className="text-[13px] text-text-tertiary font-normal">人设定位: {acc.persona}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedAccountForQueue({
                                      name: acc.name,
                                      type: acc.type,
                                      persona: acc.persona,
                                      notes: acc.notes
                                    })}
                                    className="px-3 py-1.5 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main text-[13px] font-medium rounded-lg transition-colors"
                                  >
                                    发布队列 ({acc.notes.length})
                                  </button>

                                  <button
                                    onClick={() => setExpandedAccountIds({
                                      ...expandedAccountIds,
                                      [acc.id]: !isExpanded
                                    })}
                                    className="p-1.5 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg"
                                  >
                                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                  </button>
                                </div>
                              </div>

                              {/* Quantitative Status Counters */}
                              <div className="flex items-center gap-4 text-center text-[13px] pt-1">
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[14px] font-semibold tabular-nums ${acc.planCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.planCount}</span>
                                  <span className="text-text-secondary text-[13px]">篇规划</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[14px] font-semibold tabular-nums ${acc.publishedCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.publishedCount}</span>
                                  <span className="text-text-secondary text-[13px]">篇已发布</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[14px] font-semibold tabular-nums ${acc.queueCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.queueCount}</span>
                                  <span className="text-text-secondary text-[13px]">篇排队中</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[14px] font-semibold tabular-nums ${acc.waitingExecCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.waitingExecCount}</span>
                                  <span className="text-text-secondary text-[13px]">篇待执行</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[14px] font-semibold tabular-nums ${acc.observingCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.observingCount}</span>
                                  <span className="text-text-secondary text-[13px]">观察中</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[14px] font-semibold tabular-nums ${acc.exceptionCount === 0 ? "text-text-tertiary" : "text-danger"}`}>{acc.exceptionCount}</span>
                                  <span className="text-text-secondary text-[13px]">异常</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className="text-text-secondary text-[13px]">下次发布：{formatChineseDate(acc.nextPlannedDate, true)}</span>
                                </div>
                              </div>

                              {/* Expanded Recent 3 items */}
                              {isExpanded && recentNotes.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-border-default">
                                  <div className="text-[13px] font-medium text-text-tertiary">近期发布队列：</div>
                                  <div className="space-y-2">
                                    {recentNotes.map((note) => {
                                      const uStatus = getUnifiedBusinessStatus(note);
                                      const style = getStatusStyleClass(uStatus);
                                      return (
                                        <div
                                          key={note.id}
                                          onClick={() => setActiveNoteDetail(note)}
                                          className="p-2.5 bg-surface-subtle hover:bg-hover-bg rounded-lg border border-border-default flex items-center justify-between text-[13px] cursor-pointer transition-colors group"
                                        >
                                          <div className="flex items-center gap-2 truncate max-w-[500px]">
                                            <span className="font-medium text-text-main truncate group-hover:text-text-main">{note.title || "未命名笔记"}</span>
                                            <span className="text-[13px] text-text-tertiary">（{formatChineseDate(note.plannedDate)}）</span>
                                          </div>

                                          <span className={`px-2 py-0.5 rounded text-[13px] font-medium border ${style.bg} ${style.text} ${style.border}`}>
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

                    {/* 2. 消费者发布池 */}
                    <div className="space-y-3 pt-3 border-t border-border-default">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                          <Package size={16} className="text-text-secondary" />
                          消费者发布池 (按内容包聚合)
                        </h4>
                        <span className="text-[13px] text-text-tertiary">不进入固定账号排期 · 动态招募履约</span>
                      </div>

                      <div className="space-y-3">
                        {consumerPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3.5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-[14px] font-semibold text-text-main">{pkg.name}</h5>
                                  <span className="px-2 py-0.5 bg-surface-subtle text-text-secondary text-[13px] font-normal rounded border border-border-default">
                                    {pkg.type}
                                  </span>
                                </div>
                                <p className="text-[13px] text-text-tertiary font-normal">
                                  有效期至: {pkg.validUntil} · 问卷已启用
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setShowLandingPage(true)}
                                  className="px-3 py-1.5 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main text-[13px] font-medium rounded-lg transition-colors"
                                >
                                  落地页推广
                                </button>
                                <button
                                  onClick={() => {
                                    const target = allNotes.find(n => n.isNotePackage) || allNotes.find(n => n.title?.includes("内容包") || n.title?.includes("笔记包")) || pkg.notes[0];
                                    if (target) setActiveNoteDetail(target);
                                  }}
                                  className="px-3 py-1.5 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main text-[13px] font-medium rounded-lg transition-colors"
                                >
                                  查看内容要求
                                </button>
                              </div>
                            </div>

                            {/* Aggregated Funnel Counters */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[13px]">
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">招募目标</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.planSlots} 人</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">已领取</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.claimed} 人</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">已填问卷</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.questionnaireFilled} 人</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">已生成笔记</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.notesGenerated} 篇</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">照片质检通过</div>
                                <div className="font-semibold tabular-nums text-emerald-700 mt-0.5">{pkg.photosPassed} 组</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">已发布小红书</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.published} 篇</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">未完成履约</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.incomplete} 人</div>
                              </div>
                              <div className="p-2 bg-surface-subtle rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[13px] font-normal">待人工跟进</div>
                                <div className={`font-semibold tabular-nums mt-0.5 ${pkg.needContactCount > 0 ? "text-danger" : "text-text-tertiary"}`}>
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

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DRAWERS & MODALS                                         */}
      {/* ======================================================== */}

      {showStrategyCustomization && (
        <StrategyCustomizationDrawer
          project={currentProject}
          activeVersion={activeStrategyVersion}
          versions={projectStrategyVersions}
          onClose={() => setShowStrategyCustomization(false)}
          onSave={(configuration, changedFields) => {
            createStrategyVersion(currentProject.id, configuration, changedFields);
            setShowStrategyCustomization(false);
            setLastUpdatedTimestamp(Date.now());
            setLastUpdatedText("刚刚");
          }}
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

      {/* Note Detail Drawer */}
      {activeNoteDetail && (
        <NoteDetailDrawer
          note={activeNoteDetail}
          projectId={currentProject.id}
          onClose={() => setActiveNoteDetail(null)}
          onExecuteAction={(action) => {
            const targetNote = activeNoteDetail;
            setActiveNoteDetail(null);
            openNoteOperation(targetNote, action, "note_detail");
          }}
          onEditQuestionnaire={() => {
            setFeedbackContentPackage(activeNoteDetail);
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
          contentPackage={feedbackContentPackage || undefined}
          onClose={() => {
            setShowProjectQuestionnaire(false);
            setFeedbackContentPackage(null);
          }}
        />
      )}

      {/* Project Assets Drawer */}
      {showAssetsDrawer && currentProject && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs transition-opacity" onClick={() => setShowAssetsDrawer(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-[640px] bg-surface-1 h-full shadow-2xl flex flex-col z-10 border-l border-border-default"
          >
            <div className="p-5 border-b border-border-default bg-surface-1 flex justify-between items-center shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-semibold text-text-main">方案已归集素材</h2>
                  <span className="px-2 py-0.5 bg-surface-subtle border border-border-default text-text-secondary text-[13px] font-medium rounded-md">
                    5件已回传
                  </span>
                </div>
                <div className="text-[13px] text-text-tertiary mt-0.5 truncate max-w-[480px]">
                  {currentProject.name}
                </div>
              </div>
              <button onClick={() => setShowAssetsDrawer(false)} className="p-2 text-text-tertiary hover:text-text-main rounded-xl hover:bg-hover-bg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'al1',
                    title: '幼犬吃粮高清大头照',
                    category: 'image',
                    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop',
                    aiStatus: 'AI预检通过',
                    uploader: '员工a',
                    time: '10分钟前',
                    noteRef: '幼犬换粮避坑指南'
                  },
                  {
                    id: 'al2',
                    title: '金毛第3天换粮便便与产品合影',
                    category: 'image',
                    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop',
                    aiStatus: 'AI预检通过',
                    uploader: '卡卡',
                    time: '1小时前',
                    noteRef: '金毛换粮7天打卡笔记包'
                  },
                  {
                    id: 'al3',
                    title: '店长出镜讲解15s高清视频帧',
                    category: 'video',
                    url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop',
                    aiStatus: 'AI预检通过',
                    uploader: '张店长',
                    time: '3小时前',
                    noteRef: '【官方科普】幼犬肠胃敏感期'
                  },
                  {
                    id: 'al4',
                    title: '试用装开箱体验特写',
                    category: 'image',
                    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop',
                    aiStatus: 'AI预检通过',
                    uploader: '员工b',
                    time: '昨天',
                    noteRef: '【KOC问卷笔记包】软便打卡'
                  },
                  {
                    id: 'al5',
                    title: '宠物品类核心成分授权认证卡',
                    category: 'image',
                    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop',
                    aiStatus: '通用素材',
                    uploader: '商家自行上传',
                    time: '2天前',
                    noteRef: '通用项目素材'
                  }
                ].map(asset => (
                  <div key={asset.id} className="bg-surface-subtle rounded-xl border border-border-default overflow-hidden group hover:shadow-md transition-all flex flex-col">
                    <div 
                      onClick={() => setPreviewAssetUrl(asset.url)}
                      className="relative h-36 bg-surface-subtle overflow-hidden cursor-pointer"
                    >
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[13px] font-bold rounded-md backdrop-blur-xs flex items-center gap-1">
                        {asset.category === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
                        {asset.category === 'video' ? '视频' : '照片'}
                      </span>
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[13px] font-bold rounded-md shadow-xs">
                        {asset.aiStatus}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-text-main truncate mb-0.5">{asset.title}</div>
                        <div className="text-[13px] text-text-tertiary truncate">关联: {asset.noteRef}</div>
                      </div>
                      <div className="pt-2 mt-2 border-t border-border-default flex items-center justify-between text-[13px] text-text-secondary">
                        <span>{asset.uploader}</span>
                        <span>{asset.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Archive Project Confirm Modal */}
      {showArchiveConfirm && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/40 backdrop-blur-xs p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-1 rounded-xl shadow-xl border border-border-default max-w-md w-full p-6 text-center space-y-4"
          >
            <div className="w-10 h-10 bg-surface-subtle text-danger rounded-xl flex items-center justify-center mx-auto border border-border-default">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-text-main">归档项目确认</h3>
              <p className="text-[13px] text-text-secondary mt-1.5 leading-relaxed font-normal">
                确认归档“<span className="font-medium text-text-main">{currentProject.name}</span>”吗？归档后项目数据与笔记将被安全保留。
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 border border-border-default text-text-secondary hover:bg-surface-subtle rounded-lg text-[13px] font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  updateProject(currentProject.id, { status: "已结束" });
                  setShowArchiveConfirm(false);
                }}
                className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-lg text-[13px] font-medium transition-colors"
              >
                确认归档
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Operation Logs Modal */}
      {showOperationLogs && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-btn-main/30 backdrop-blur-xs" onClick={() => setShowOperationLogs(false)} />
          <div className="relative bg-surface-1 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-border-default">
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-subtle">
              <h3 className="font-semibold text-[15px] text-text-main flex items-center gap-2">
                <History size={16} /> 操作历史记录
              </h3>
              <button onClick={() => setShowOperationLogs(false)} className="text-text-tertiary hover:text-text-secondary"><X size={16}/></button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto space-y-2.5 text-[13px]">
              {currentProject.operationLogs.map((log) => (
                <div key={log.id} className="p-3 bg-surface-subtle rounded-lg border border-border-default space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-main">{log.action}</span>
                    <span className="text-[13px] text-text-tertiary">{formatChineseDate(log.timestamp, true)}</span>
                  </div>
                  <div className="text-text-secondary text-[13px] font-normal">{log.detail}</div>
                  <div className="text-[13px] text-text-tertiary">操作人: {log.operator}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Import / Create Select Modal */}
      {showImportSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-btn-main/30 backdrop-blur-xs" onClick={() => setShowImportSelect(false)} />
          <div className="relative bg-surface-1 rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-border-default">
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-surface-subtle">
              <div>
                <h3 className="font-semibold text-[15px] text-text-main">新建内容或笔记</h3>
                <p className="text-[13px] text-text-secondary mt-0.5">请选择新建或导入内容的方式</p>
              </div>
              <button onClick={() => setShowImportSelect(false)} className="text-text-tertiary hover:text-text-secondary p-1 rounded-lg hover:bg-hover-bg"><X size={16}/></button>
            </div>
            
            <div className="p-4 space-y-2.5">
              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("file"); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-border-strong hover:bg-surface-subtle rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-surface-subtle border border-border-default text-text-secondary rounded-lg shrink-0">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-text-main flex items-center justify-between">
                    <span>批量导入 Excel / CSV</span>
                    <span className="text-[13px] text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded font-normal">批量解析</span>
                  </div>
                  <div className="text-[13px] text-text-tertiary mt-0.5 font-normal">上传表格文件，批量解析提取笔记标题与发布计划</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("feishu"); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-border-strong hover:bg-surface-subtle rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-surface-subtle border border-border-default text-text-secondary rounded-lg shrink-0">
                  <Link2 size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-text-main flex items-center justify-between">
                    <span>关联飞书多维表格</span>
                    <span className="text-[13px] text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded font-normal">云端同步</span>
                  </div>
                  <div className="text-[13px] text-text-tertiary mt-0.5 font-normal">粘贴表格 URL，自动导入并同步笔记任务</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowBatchAIGenerator(true); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-border-strong hover:bg-surface-subtle rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-surface-subtle border border-border-default text-text-secondary rounded-lg shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-text-main flex items-center justify-between">
                    <span>批量生成笔记</span>
                    <span className="text-[13px] text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded font-normal">方案起草</span>
                  </div>
                  <div className="text-[13px] text-text-tertiary mt-0.5 font-normal">根据项目方案与资料库，批量起草多篇笔记</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("single"); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-border-strong hover:bg-surface-subtle rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-surface-subtle border border-border-default text-text-secondary rounded-lg shrink-0">
                  <Plus size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-text-main flex items-center justify-between">
                    <span>手动新建单篇笔记</span>
                    <span className="text-[13px] text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded font-normal">单篇</span>
                  </div>
                  <div className="text-[13px] text-text-tertiary mt-0.5 font-normal">手动填写标题、选择账号与设定发布排期</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Workstation (AI Agent Driven) */}
      {activeWorkbench === "create_project" && (
        <CreateProjectWorkstation 
          industryDefaults={industryDefaults}
          industryProfile={industryProfile}
          onClose={() => setActiveWorkbench(null)} 
          onCreate={() => setActiveWorkbench(null)} 
        />
      )}

      {/* Note Import / Creation Modal */}
      {showAddNoteModal && currentProject && (
        <AddSingleNoteModal 
          project={currentProject} 
          initialTab={showAddNoteModal} 
          onClose={() => setShowAddNoteModal(null)} 
        />
      )}

      {/* Batch Generator Modal */}
      {showBatchAIGenerator && currentProject && (
        <BatchNoteGeneratorModal 
          project={currentProject} 
          onClose={() => setShowBatchAIGenerator(false)} 
        />
      )}

      {/* Dispatch Material Task Modal */}
      {showDispatchModal && currentProject && (
        <DispatchMaterialTaskModal
          project={currentProject}
          onClose={() => setShowDispatchModal(false)}
        />
      )}

      {/* Material Asset Preview Lightbox */}
      {previewAssetUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4" onClick={() => setPreviewAssetUrl(null)}>
          <div className="relative max-w-3xl max-h-[85vh] bg-surface-1 rounded-xl overflow-hidden shadow-2xl p-2 border border-border-default" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewAssetUrl(null)} className="absolute top-3 right-3 z-10 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors">
              <X size={16} />
            </button>
            <img src={previewAssetUrl} alt="素材原图预览" className="max-h-[80vh] w-auto object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
