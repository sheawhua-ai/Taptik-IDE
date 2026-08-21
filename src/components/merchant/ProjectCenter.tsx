import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Calendar, AlertTriangle, CheckCircle2, History, 
  MoreHorizontal, Settings, FileText, Check, ChevronRight, X,
  ExternalLink, QrCode, FileSpreadsheet, Trash2, Camera, User, 
  BarChart2, Lightbulb, Link2, ChevronDown, ChevronUp, AlertCircle, 
  PanelLeftClose, PanelLeftOpen, Upload, Sparkles, Target, ShieldAlert, 
  Layers, Clock, RefreshCw, Users, Eye, ArrowRight, Package, Send,
  HelpCircle, Image as ImageIcon, Video, Activity
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
import { DispatchMaterialTaskModal } from "./DispatchMaterialTaskModal";

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

  // 1. Unified 3 Tabs: 概览 (Overview), 内容与素材 (Content & Materials), 项目设置 (Project Settings)
  const [activeTab, setActiveTab] = useState<"概览" | "内容与素材" | "项目设置">("概览");
  
  // Sub-views inside "内容与素材": Strictly 2 views (by_note | by_account)
  const [contentSubView, setContentSubView] = useState<"by_note" | "by_account">("by_note");

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
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showOperationLogs, setShowOperationLogs] = useState(false);
  const [showImportSelect, setShowImportSelect] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState<"file" | "feishu" | "single" | null>(null);
  const [showBatchAIGenerator, setShowBatchAIGenerator] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [previewAssetUrl, setPreviewAssetUrl] = useState<string | null>(null);
  const [activeWorkbench, setActiveWorkbench] = useState<"content" | "assets" | "publish" | "create_project" | null>(null);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);

  // Auto-refresh timestamp
  const [isRefreshingProgress, setIsRefreshingProgress] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("刚刚");
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(Date.now());

  // Editable state inside "项目设置" tab
  const [settingsForm, setSettingsForm] = useState({
    name: currentProject?.name || "",
    startDate: currentProject?.startDate || "",
    endDate: currentProject?.endDate || "",
    budget: currentProject?.budget || "5,000元",
    observationPeriod: "14天",
    targetAudience: currentProject?.strategyProtocol?.targetAudience || "",
    coreProblem: currentProject?.strategyProtocol?.coreProblem || "",
    solutionSummary: currentProject?.strategyProtocol?.solutionSummary || "",
    verifyHypothesis: currentProject?.strategyProtocol?.verifyHypothesis || "",
    continueCondition: currentProject?.strategyProtocol?.continueCondition || "",
    stopCondition: currentProject?.strategyProtocol?.stopCondition || ""
  });

  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setSettingsForm({
        name: currentProject.name,
        startDate: currentProject.startDate,
        endDate: currentProject.endDate,
        budget: currentProject.budget || "5,000元",
        observationPeriod: "14天",
        targetAudience: currentProject.strategyProtocol?.targetAudience || "",
        coreProblem: currentProject.strategyProtocol?.coreProblem || "",
        solutionSummary: currentProject.strategyProtocol?.solutionSummary || "",
        verifyHypothesis: currentProject.strategyProtocol?.verifyHypothesis || "",
        continueCondition: currentProject.strategyProtocol?.continueCondition || "",
        stopCondition: currentProject.strategyProtocol?.stopCondition || ""
      });
    }
  }, [currentProject?.id]);

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
      <div className="flex-1 flex items-center justify-center text-text-tertiary bg-page-bg">
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
    else setWorkflowTab?.("execution");
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

  // Scenarios for "场景素材任务"
  const defaultScenarios = [
    {
      id: 'sc1',
      title: '场景一：幼犬换粮实拍与肠胃适应便便对比',
      reqs: '需提供幼犬进食高品质粮高清特写、7天换粮便便颜色状态对比图及产品与宠物合影',
      assignedTo: '员工a, 卡卡',
      associatedNotes: ['幼犬换粮避坑指南', '我家金毛换粮7天打卡笔记包'],
      status: '执行中',
      progress: '2/3 已回传',
      assetsCount: 2,
      assets: [
        { id: 'a1', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop', type: 'image', title: '幼犬进食大头照' },
        { id: 'a2', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop', type: 'image', title: '换粮第3天精神状态实拍' }
      ]
    },
    {
      id: 'sc2',
      title: '场景二：店长专业推荐与线下门店养护陈列',
      reqs: '需要店长出镜讲解视频（15s）、门店幼犬粮特写展架及体验装发放场景',
      assignedTo: '张店长',
      associatedNotes: ['【官方科普】幼犬肠胃敏感期如何顺利换粮？', '门店领试用装福利'],
      status: '待验收',
      progress: '1/1 已回传',
      assetsCount: 1,
      assets: [
        { id: 'a3', url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop', type: 'image', title: '店长货架前出镜实拍' }
      ]
    },
    {
      id: 'sc3',
      title: '场景三：试用装包裹签收与小红书打卡凭证',
      reqs: '体验官快递包裹开箱特写 + 小红书表单填写截图凭证',
      assignedTo: '员工b',
      associatedNotes: ['【KOC问卷笔记包】新手换粮防软便打卡'],
      status: '已验收',
      progress: '2/2 已完成',
      assetsCount: 2,
      assets: [
        { id: 'a4', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop', type: 'image', title: '试用装体验包拆箱图' }
      ]
    }
  ];

  // Asset Library items
  const defaultAssetLibrary = [
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
  ];

  // Current stage inference based on pipeline
  const getCurrentStage = (): string => {
    if (currentProject.status === "已结束") return "已结束";
    if (counts.completed > 0 && counts.completed === counts.all) return "观察复盘";
    if (counts.observing > 0 || counts.detecting > 0 || counts.pendingPublish > 0) return "发布执行";
    if (counts.preparing > 0) return "内容生产与素材";
    return "策略确认";
  };

  const currentStage = getCurrentStage();

  return (
    <div className="h-full w-full flex bg-page-bg text-text-main relative overflow-hidden font-sans">
      
      {/* LEFT: Collapsible Project List */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-surface-1 border-r border-border-default flex flex-col shrink-0 z-10 overflow-hidden"
          >
            <div className="p-4 border-b border-border-default space-y-3 w-[280px]">
              <div className="flex justify-between items-center">
                <h2 className="text-[15px] font-bold text-text-main">项目列表</h2>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveWorkbench("create_project")}
                    className="w-7 h-7 rounded-lg bg-btn-main text-white flex items-center justify-center hover:bg-btn-main-hover transition-colors"
                    title="新建项目"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    title="收起项目列表" 
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
                  placeholder="搜索项目..." 
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-hover-bg rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:ring-1 focus:ring-neutral-300"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {["全部", "进行中", "已结束"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setProjectFilterStatus(status)}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium transition-colors ${
                      projectFilterStatus === status ? "bg-btn-main text-white" : "bg-hover-bg text-text-secondary hover:bg-selected-bg"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto w-[280px]">
              {filteredProjects.map((proj) => {
                const projTasks = enrichedActionTasks.filter(t => t.projectId === proj.id && t.status === "pending");
                const blockers = projTasks.filter(t => t.severity === "blocker");
                const errors = projTasks.filter(t => t.actionType === "ResolvePublishError" || t.issueMessage?.includes("异常"));
                
                let statusText = "按计划推进";
                let statusClass = "text-text-secondary";
                
                if (errors.length > 0) {
                  statusText = `${errors.length}项异常待处理`;
                  statusClass = "text-danger font-bold";
                } else if (blockers.length > 0) {
                  statusText = `${blockers.length}项阻断 · 待跟进`;
                  statusClass = "text-danger font-bold";
                } else if (projTasks.length > 0) {
                  statusText = `${projTasks.length}项待跟进`;
                  statusClass = "text-text-secondary";
                }

                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`w-full text-left p-4 transition-all border-b border-border-default relative ${
                      selectedProjectId === proj.id 
                        ? "bg-surface-1" 
                        : "bg-transparent hover:bg-hover-bg text-text-main"
                    }`}
                  >
                    {selectedProjectId === proj.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />
                    )}
                    <div className={`text-[13px] line-clamp-1 mb-1.5 ${selectedProjectId === proj.id ? 'font-bold text-text-main' : 'font-medium'}`}>
                      {proj.name}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                        proj.status === "进行中" ? "bg-emerald-50 text-emerald-700" : 
                        proj.status === "准备中" ? "bg-amber-50 text-amber-700" :
                        "bg-surface-2 text-text-secondary border border-border-default"
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                    <div className={`text-[11px] ${statusClass}`}>{statusText}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT: Main Project Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-page-bg overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-surface-1 border-b border-border-default shrink-0 px-6 py-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                title="展开项目列表"
                className="mt-1 w-8 h-8 flex items-center justify-center border border-border-default rounded-lg text-text-secondary hover:text-text-main hover:bg-surface-2 transition-colors"
              >
                <PanelLeftOpen size={16} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-[18px] font-bold text-text-main">{currentProject.name}</h1>
                
                {/* Status Model: Project Status */}
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  currentProject.status === "进行中" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                  currentProject.status === "准备中" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-surface-2 text-text-secondary border-border-default"
                }`}>
                  {currentProject.status}
                </span>

                {/* Status Model: Current Stage (Process Position) */}
                <span className="px-2 py-0.5 bg-hover-bg text-text-secondary border border-border-default text-[11px] font-bold rounded">
                  当前阶段：{currentStage}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[12.5px] text-text-secondary">
                <span className="flex items-center gap-1.5"><Calendar size={13} /> {currentProject.startDate} 至 {currentProject.endDate}</span>
                <span className="text-border-strong">|</span>
                <span className="truncate max-w-[450px]" title={currentProject.goal}>
                  目标: {currentProject.goal || "验证真实换粮体验与店长专业解释能否提高有效咨询"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleRefreshProgress}
              disabled={isRefreshingProgress}
              title="刷新项目数据"
              className="w-8 h-8 border border-border-default text-text-secondary hover:text-text-main rounded-lg hover:bg-surface-2 transition-colors flex items-center justify-center bg-surface-1"
            >
              <RefreshCw size={14} className={isRefreshingProgress ? "animate-spin text-text-main" : ""} />
            </button>
            
            {/* Secondary Action: Enter Execution Center */}
            <button
              onClick={() => setWorkflowTab?.("execution")}
              className="px-3.5 py-1.5 bg-surface-1 hover:bg-surface-2 border border-border-default text-text-main text-[12.5px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>进入执行中心</span>
              <ChevronRight size={14} />
            </button>

            {/* Secondary Actions in More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                title="更多操作"
                className="w-8 h-8 border border-border-default text-text-secondary hover:text-text-main rounded-lg hover:bg-surface-2 transition-colors flex items-center justify-center bg-surface-1"
              >
                <MoreHorizontal size={16} />
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-1 border border-border-default rounded-xl shadow-lg z-50 py-1.5 text-[13px]">
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-2 flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => { setShowMoreMenu(false); setActiveTab("项目设置"); }}
                    >
                      <Settings size={14} className="text-text-tertiary" />
                      <span>项目信息与策略设置</span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-2 flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowProjectQuestionnaire(true); }}
                    >
                      <FileText size={14} className="text-text-tertiary" />
                      <span>问卷配置</span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-2 flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowLandingPage(true); }}
                    >
                      <QrCode size={14} className="text-text-tertiary" />
                      <span>落地页推广设置</span>
                    </button>
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-2 flex items-center gap-2 text-text-main font-medium" 
                      onClick={() => { setShowMoreMenu(false); setShowOperationLogs(true); }}
                    >
                      <History size={14} className="text-text-tertiary" />
                      <span>操作记录</span>
                    </button>
                    <div className="my-1.5 border-t border-border-default" />
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

        {/* Level-2 Primary Tabs: Exactly 3 Tabs */}
        <div className="px-6 bg-surface-1 border-b border-border-default flex items-center justify-between text-[13.5px] font-medium shrink-0">
          <div className="flex gap-8">
            {(["概览", "内容与素材", "项目设置"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 relative font-semibold ${activeTab === tab ? "text-text-main" : "text-text-secondary hover:text-text-main"}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="projectCenterTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-logo" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[12px] text-text-secondary">
            <span>更新时间：{lastUpdatedText}</span>
          </div>
        </div>

        {/* Main View Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-6 space-y-6">
            
            {/* ======================================================== */}
            {/* 1. 概览 TAB                                             */}
            {/* ======================================================== */}
            {activeTab === "概览" && (
              <div className="space-y-5">
                
                {/* 1.1 当前阶段与下一动作（单一动作横幅 - 区域唯一深色 Primary） */}
                <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                      <AlertCircle size={16} className={primaryProjectTask ? "text-danger" : "text-emerald-600"} /> 
                      当前关注与下一动作
                    </h3>
                    <span className="text-[12px] text-text-secondary">
                      {primaryProjectTask ? "需优先处理当前阻塞" : "当前节奏正常推进"}
                    </span>
                  </div>

                  {primaryProjectTask ? (
                    <div className="flex items-start justify-between gap-4 p-4 bg-surface-1 border border-border-default rounded-xl relative overflow-hidden pl-5">
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="shrink-0 mt-0.5 text-text-secondary">
                          <Activity size={16} />
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <div className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                            <span>{primaryProjectTask.issueMessage || "待处理事项"}</span>
                            {primaryProjectTask.severity === "blocker" && (
                              <span className="px-2 py-0.5 bg-danger text-white text-[11px] font-medium rounded">
                                阻断
                              </span>
                            )}
                          </div>
                          <div className="text-[12.5px] text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
                            <div>关联：<span className="font-medium text-text-main">{primaryProjectTask.noteTitle || currentProject.name}</span></div>
                            <div>等待方：<span className="font-medium text-text-main">{primaryProjectTask.waitOn || "操盘手确认"}</span></div>
                            <div>影响范围：<span className="font-medium text-text-main">{primaryProjectTask.impactScope || "影响本轮发布进度"}</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Single Dark Primary Button for this area */}
                      <button 
                        onClick={() => handleTaskAction(primaryProjectTask)}
                        className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white text-[12.5px] font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1"
                      >
                        处理当前阻塞
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-surface-2 rounded-xl border border-border-default text-[13px] text-text-secondary flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>当前节奏正常，所有任务按规划推进中。</span>
                      </div>
                      <span className="text-[12px] text-text-tertiary font-medium">下一发布节点：今日 18:00 (店长号)</span>
                    </div>
                  )}
                </div>

                {/* 1.2 待办与阻塞提示卡片 (排除置顶项，避免重复显示) */}
                <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-4">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-text-main">待办与阻塞列表</h3>
                      <span className="text-[12px] text-text-tertiary">
                        {projectPendingTasks.length > 1 ? `另有 ${projectPendingTasks.length - 1} 项常规待办` : `共 ${projectPendingTasks.length} 项事项`}
                      </span>
                    </div>

                    <button
                      onClick={() => setWorkflowTab?.("execution")}
                      className="text-[12.5px] text-text-secondary hover:text-text-main font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>进入执行中心查看全部待办</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {projectPendingTasks.length <= (primaryProjectTask ? 1 : 0) ? (
                    <div className="text-center py-4 text-[13px] text-text-tertiary">
                      {primaryProjectTask ? "暂无其他待办事项，请跟进上方置顶阻塞" : "暂无阻塞与待办事项，执行流程顺畅"}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {projectPendingTasks.filter(t => t.id !== primaryProjectTask?.id).slice(0, 4).map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => handleTaskAction(task)}
                          className="p-3 bg-surface-2 hover:bg-hover-bg rounded-lg border border-border-default flex items-center justify-between text-[12.5px] cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-[650px]">
                            {task.severity === "blocker" ? (
                              <span className="px-1.5 py-0.5 bg-danger text-white text-[10.5px] font-medium rounded">阻断</span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-warning-light text-warning text-[10.5px] font-medium rounded">待办</span>
                            )}
                            <span className="font-medium text-text-main truncate group-hover:text-text-main">{task.issueMessage}</span>
                            <span className="text-text-tertiary">({task.noteTitle || "当前项目"})</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-text-tertiary text-[11.5px]">截止: {task.plannedDate}</span>
                            {/* Ghost Action */}
                            <span className="text-[12px] font-medium text-text-secondary group-hover:text-text-main group-hover:underline">
                              处理
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1.3 策略协议与核心目标摘要 */}
                <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-4">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                      <Target size={16} className="text-text-secondary" />
                      策略协议与核心目标
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowStrategyDrawer(true)}
                        className="px-3 py-1 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        抽屉查看完整协议 <ChevronRight size={13} />
                      </button>
                      <button 
                        onClick={() => setActiveTab("项目设置")}
                        className="px-3 py-1 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        前往项目设置编辑 <Settings size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
                    <div className="p-3.5 bg-surface-2 rounded-lg border border-border-default space-y-1">
                      <div className="text-text-tertiary font-medium">核心问题</div>
                      <div className="font-bold text-text-main leading-relaxed">
                        {currentProject.strategyProtocol?.coreProblem || currentProject.goal || "解决幼犬换粮软便挑食顾虑，建立搜索词拦截卡位"}
                      </div>
                    </div>

                    <div className="p-3.5 bg-surface-2 rounded-lg border border-border-default space-y-1">
                      <div className="text-text-tertiary font-medium">内容方法</div>
                      <div className="font-bold text-text-main leading-relaxed">
                        {currentProject.strategyProtocol?.solutionSummary || "店长专业科普 + 消费者真实体验 + 动态问卷笔记包"}
                      </div>
                    </div>

                    <div className="p-3.5 bg-surface-2 rounded-lg border border-border-default space-y-1">
                      <div className="text-text-tertiary font-medium">验证假设与主体结构</div>
                      <div className="font-bold text-text-main leading-relaxed">
                        {currentProject.strategyProtocol?.verifyHypothesis || "品牌官方号 (2) + 店长号 (5) + KOC笔记包 (10-13) · 观察14天"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.4 关键指标摘要 (数据提炼与AI复盘结论) */}
                <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-4">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart2 size={16} className="text-text-secondary" />
                      <h3 className="text-[14px] font-bold text-text-main">关键指标摘要与复盘</h3>
                    </div>

                    <button
                      onClick={() => setWorkflowTab?.("review")}
                      className="text-[12.5px] text-text-secondary hover:text-text-main font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>进入复盘归因与AI决策</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* 4 Core Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-surface-2 rounded-lg p-3.5 border border-border-default">
                      <div className="text-[12px] text-text-tertiary font-medium">已发布笔记</div>
                      <div className="text-[22px] font-extrabold text-text-main mt-1">6 篇</div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">观察中 3 篇 · 观察完成 3 篇</div>
                    </div>

                    <div className="bg-surface-2 rounded-lg p-3.5 border border-border-default">
                      <div className="text-[12px] text-text-tertiary font-medium">有效咨询总数</div>
                      <div className="text-[22px] font-extrabold text-emerald-700 mt-1">45 条</div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">目标完成度 90%</div>
                    </div>

                    <div className="bg-surface-2 rounded-lg p-3.5 border border-border-default">
                      <div className="text-[12px] text-text-tertiary font-medium">核心词搜索卡位</div>
                      <div className="text-[22px] font-extrabold text-text-main mt-1">前 8 位</div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">【幼犬换粮软便】拦截词</div>
                    </div>

                    <div className="bg-surface-2 rounded-lg p-3.5 border border-border-default">
                      <div className="text-[12px] text-text-tertiary font-medium">AI 平台收录率</div>
                      <div className="text-[22px] font-extrabold text-text-main mt-1">100%</div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">已识别 6 篇全部收录</div>
                    </div>
                  </div>

                  {/* AI Review Conclusion Box */}
                  <div className="p-4 bg-surface-2 rounded-lg border border-border-default space-y-2.5 text-[13px]">
                    <div className="flex items-center gap-2 font-semibold text-text-main">
                      <Lightbulb size={16} className="text-amber-600" />
                      <span>阶段复盘结论：店长号“科学7日换粮法”在有效咨询率上显著优于普通晒宠内容</span>
                    </div>
                    <div className="text-text-secondary leading-relaxed text-[12.5px] space-y-1 pl-6">
                      <div>· 店长号产出 31 条有效咨询，单篇咨询转化效率是泛KOC的 2.8 倍。</div>
                      <div>· 真实痛点问卷生成的 KOC 测评在收藏率上表现突出（单篇收藏均值 65+）。</div>
                    </div>

                    <div className="pt-2 border-t border-border-default/80 flex items-center justify-between text-[12px] pl-6">
                      <span className="text-text-tertiary">建议动作：加大店长号排期比重，KOC问卷强化“排便成型”事实细节。</span>
                      <button
                        onClick={() => setWorkflowTab?.("review")}
                        className="px-3 py-1 bg-surface-1 hover:bg-surface-2 border border-border-default text-text-main text-[11.5px] font-medium rounded transition-colors"
                      >
                        进入AI复盘决策
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1.5 最近动态 / 操作日志 */}
                <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-3">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <div className="flex items-center gap-2">
                      <History size={16} className="text-text-secondary" />
                      <h3 className="text-[14px] font-semibold text-text-main">最近动态与操作记录</h3>
                    </div>
                    <button 
                      onClick={() => setIsLogsExpanded(!isLogsExpanded)}
                      className="text-[12px] text-text-secondary hover:text-text-main font-medium"
                    >
                      {isLogsExpanded ? "收起" : "展开完整记录"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(isLogsExpanded ? currentProject.operationLogs : currentProject.operationLogs.slice(0, 3)).map((log) => (
                      <div key={log.id} className="p-3 bg-surface-2 rounded-lg border border-border-default flex items-start justify-between gap-4 text-[12.5px]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-main">{log.action}</span>
                            <span className="text-[11px] px-1.5 py-0.2 bg-hover-bg rounded text-text-secondary">{log.operator}</span>
                          </div>
                          <div className="text-text-secondary text-[12px]">{log.detail}</div>
                        </div>
                        <span className="text-[11.5px] text-text-tertiary shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* 2. 内容与素材 TAB                                       */}
            {/* ======================================================== */}
            {activeTab === "内容与素材" && (
              <div className="space-y-5">

                {/* Context Strip for Materials & Tasks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border-default flex items-center justify-center text-text-secondary">
                        <Send size={15} />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-text-main">场景素材任务</div>
                        <div className="text-[11.5px] text-text-tertiary">3 项进行中 · 统一在执行中心调度追踪</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDispatchModal(true)}
                      className="px-3 py-1.5 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors"
                    >
                      下发素材任务
                    </button>
                  </div>

                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border-default flex items-center justify-center text-text-secondary">
                        <Package size={15} />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-text-main">项目素材归集</div>
                        <div className="text-[11.5px] text-text-tertiary">5 件已回传 · 聚合于全局素材中心</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setWorkflowTab?.("materials")}
                      className="px-3 py-1.5 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>前往素材中心</span>
                      <ExternalLink size={12} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
                
                {/* View Switcher + Filter Controls */}
                <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Sub-view toggle: Strictly 2 Views (按笔记列表 | 按账号矩阵) */}
                    <div className="flex items-center bg-hover-bg p-1 rounded-lg">
                      <button
                        onClick={() => setContentSubView("by_note")}
                        className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all ${
                          contentSubView === "by_note"
                            ? "bg-surface-1 text-text-main shadow-xs"
                            : "text-text-tertiary hover:text-text-main"
                        }`}
                      >
                        按笔记列表
                      </button>
                      <button
                        onClick={() => setContentSubView("by_account")}
                        className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all ${
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
                          className="pl-8 pr-3 py-1.5 w-[200px] bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none focus:bg-surface-1 focus:border-neutral-400 transition-colors"
                        />
                      </div>

                      {/* Single Dark Primary Button for Content Tab */}
                      <button
                        onClick={() => setShowImportSelect(true)}
                        className="px-3.5 py-1.5 bg-btn-main text-white rounded-lg text-[12.5px] font-medium hover:bg-btn-main-hover transition-colors flex items-center gap-1"
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
                          className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all flex items-center gap-1.5 ${
                            statusFilter === item.filter
                              ? "bg-btn-main text-white"
                              : "bg-surface-2 hover:bg-hover-bg text-text-secondary"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10.5px] ${
                            statusFilter === item.filter
                              ? "bg-surface-1/20 text-white"
                              : item.isAlert
                              ? "bg-danger-light text-danger font-medium"
                              : "bg-surface-2 text-text-secondary"
                          }`}>
                            {item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ---------------------------------------------------- */}
                {/* SUB-VIEW 1: 按笔记列表                              */}
                {/* ---------------------------------------------------- */}
                {contentSubView === "by_note" && (
                  <div className="space-y-3">
                    {filteredNotes.length === 0 ? (
                      <div className="bg-surface-1 rounded-xl p-12 border border-border-default text-center space-y-2">
                        <FileText size={36} className="mx-auto text-neutral-300" />
                        <h4 className="text-[15px] font-semibold text-text-main">未找到匹配的内容笔记</h4>
                        <p className="text-[12.5px] text-text-tertiary">请尝试更换筛选条件或新建内容</p>
                      </div>
                    ) : (
                      filteredNotes.map((note) => {
                        const uStatus = getUnifiedBusinessStatus(note);
                        const style = getStatusStyleClass(uStatus);
                        const isPkg = Boolean(note.isNotePackage || note.title?.includes("笔记包"));
                        const hasConsumerAnswers = Boolean(note.consumerQuestionnaire);

                        // Fact calculation
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
                            className="bg-surface-1 rounded-xl p-4 border border-border-default hover:border-neutral-400 transition-all cursor-pointer flex flex-col justify-between gap-3 min-h-[96px] group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-[14px] font-semibold text-text-main truncate group-hover:text-text-main">
                                    {note.title || note.contentDirection || "未命名任务"}
                                  </h4>

                                  <span className="px-2 py-0.5 bg-hover-bg text-text-secondary text-[11px] font-medium rounded shrink-0">
                                    {note.type || "品牌号"}
                                  </span>

                                  {isPkg && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium rounded shrink-0">
                                      消费者笔记包
                                    </span>
                                  )}

                                  {hasConsumerAnswers && !isPkg && (
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium rounded shrink-0">
                                      已填问卷
                                    </span>
                                  )}
                                </div>

                                <div className="text-[12px] text-text-tertiary flex items-center gap-3">
                                  <span>主体: <span className="font-medium text-text-secondary">{note.account || note.participant || "特唯普官方旗舰店"}</span></span>
                                  <span>·</span>
                                  <span>计划: {note.plannedDate || "排期中"}</span>
                                </div>
                              </div>

                              <span className={`px-2.5 py-0.5 rounded text-[11.5px] font-medium border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                                {uStatus}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border-default/80">
                              <span className="text-text-secondary truncate max-w-[700px]">
                                事实: {factText}
                              </span>

                              {/* Ghost Action */}
                              <span className="text-[12px] font-medium text-text-secondary group-hover:text-text-main group-hover:underline">
                                详情
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SUB-VIEW 2: 按账号矩阵                              */}
                {/* ---------------------------------------------------- */}
                {contentSubView === "by_account" && (
                  <div className="space-y-6">
                    
                    {/* 1. 自有可控账号矩阵 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                          <Users size={16} className="text-text-secondary" />
                          自有可控账号矩阵
                        </h4>
                        <span className="text-[12px] text-text-tertiary">共 {controlledAccounts.length} 个发布账号</span>
                      </div>

                      <div className="space-y-3">
                        {controlledAccounts.map((acc) => {
                          const isExpanded = expandedAccountIds[acc.id];
                          const recentNotes = acc.notes.slice(0, 3);

                          return (
                            <div
                              key={acc.id}
                              className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-[15px] font-semibold text-text-main">{acc.name}</h5>
                                    <span className="px-2 py-0.5 bg-hover-bg text-text-secondary text-[11px] font-medium rounded">
                                      {acc.type}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-text-tertiary">人设定位: {acc.persona}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedAccountForQueue({
                                      name: acc.name,
                                      type: acc.type,
                                      persona: acc.persona,
                                      notes: acc.notes
                                    })}
                                    className="px-3 py-1.5 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors"
                                  >
                                    查看完整发布队列 ({acc.notes.length})
                                  </button>

                                  <button
                                    onClick={() => setExpandedAccountIds({
                                      ...expandedAccountIds,
                                      [acc.id]: !isExpanded
                                    })}
                                    className="p-1.5 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg"
                                  >
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  </button>
                                </div>
                              </div>

                              {/* Quantitative Status Counters */}
                              <div className="flex items-center gap-4 text-center text-[12px] pt-1">
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[15px] font-semibold tabular-nums ${acc.planCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.planCount}</span>
                                  <span className="text-text-secondary text-[12px]">篇规划</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[15px] font-semibold tabular-nums ${acc.publishedCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.publishedCount}</span>
                                  <span className="text-text-secondary text-[12px]">篇已发布</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[15px] font-semibold tabular-nums ${acc.queueCount === 0 ? "text-text-tertiary" : "text-text-main"}`}>{acc.queueCount}</span>
                                  <span className="text-text-secondary text-[12px]">篇排队中</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[15px] font-semibold tabular-nums ${acc.waitingExecCount === 0 ? "text-text-tertiary" : "text-warning"}`}>{acc.waitingExecCount}</span>
                                  <span className="text-text-secondary text-[12px]">篇待执行</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[15px] font-semibold tabular-nums ${acc.observingCount === 0 ? "text-text-tertiary" : "text-info"}`}>{acc.observingCount}</span>
                                  <span className="text-text-secondary text-[12px]">观察中</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-[15px] font-semibold tabular-nums ${acc.exceptionCount === 0 ? "text-text-tertiary" : "text-danger"}`}>{acc.exceptionCount}</span>
                                  <span className="text-text-secondary text-[12px]">异常</span>
                                </div>
                                <div className="w-[1px] h-3 bg-border-default" />
                                <div className="flex items-baseline gap-1">
                                  <span className="text-text-secondary text-[12px]">下次发布: {acc.nextPlannedDate.split(' ')[0]}</span>
                                </div>
                              </div>

                              {/* Expanded Recent 3 items */}
                              {isExpanded && recentNotes.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-border-default">
                                  <div className="text-[12px] font-semibold text-text-tertiary">近期发布队列：</div>
                                  <div className="space-y-2">
                                    {recentNotes.map((note) => {
                                      const uStatus = getUnifiedBusinessStatus(note);
                                      const style = getStatusStyleClass(uStatus);
                                      return (
                                        <div
                                          key={note.id}
                                          onClick={() => setActiveNoteDetail(note)}
                                          className="p-3 bg-surface-2 hover:bg-hover-bg rounded-lg border border-border-default flex items-center justify-between text-[12.5px] cursor-pointer transition-colors group"
                                        >
                                          <div className="flex items-center gap-2 truncate max-w-[500px]">
                                            <span className="font-semibold text-text-main truncate group-hover:text-text-main">{note.title || "未命名笔记"}</span>
                                            <span className="text-[11.5px] text-text-tertiary">({note.plannedDate})</span>
                                          </div>

                                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${style.bg} ${style.text} ${style.border}`}>
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
                    <div className="space-y-3 pt-4 border-t border-border-default">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                          <Package size={16} className="text-indigo-600" />
                          消费者发布池 (按内容包聚合)
                        </h4>
                        <span className="text-[12px] text-text-tertiary">不进入固定账号排期 · 动态招募履约</span>
                      </div>

                      <div className="space-y-3">
                        {consumerPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-surface-1 rounded-xl p-5 border border-indigo-100 space-y-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-[15px] font-semibold text-text-main">{pkg.name}</h5>
                                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-medium rounded border border-indigo-200">
                                    {pkg.type}
                                  </span>
                                </div>
                                <p className="text-[12px] text-text-tertiary">
                                  有效期至: {pkg.validUntil} · 问卷已启用 · AI 秒级个性化生成
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setShowLandingPage(true)}
                                  className="px-3 py-1.5 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors"
                                >
                                  落地页推广
                                </button>
                                <button
                                  onClick={() => {
                                    const target = allNotes.find(n => n.isNotePackage) || allNotes.find(n => n.title?.includes("内容包") || n.title?.includes("笔记包")) || pkg.notes[0];
                                    if (target) setActiveNoteDetail(target);
                                  }}
                                  className="px-3 py-1.5 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors"
                                >
                                  查看内容包要求
                                </button>
                              </div>
                            </div>

                            {/* Aggregated Funnel Counters */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[12px]">
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">招募目标</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.planSlots} 人</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">已领取</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.claimed} 人</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">已填问卷</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.questionnaireFilled} 人</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">已生成笔记</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.notesGenerated} 篇</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">照片质检通过</div>
                                <div className="font-semibold tabular-nums text-emerald-700 mt-0.5">{pkg.photosPassed} 组</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">已发布小红书</div>
                                <div className="font-semibold tabular-nums text-text-main mt-0.5">{pkg.published} 篇</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">未完成履约</div>
                                <div className="font-semibold tabular-nums text-amber-700 mt-0.5">{pkg.incomplete} 人</div>
                              </div>
                              <div className="p-2 bg-surface-2 rounded-lg border border-border-default">
                                <div className="text-text-tertiary text-[11px]">待人工跟进</div>
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

            {/* ======================================================== */}
            {/* 3. 项目设置 TAB                                         */}
            {/* ======================================================== */}
            {activeTab === "项目设置" && (
              <div className="space-y-6">
                
                {/* 3.1 基本信息设置 */}
                <div className="bg-surface-1 rounded-xl p-6 border border-border-default space-y-4">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <h3 className="text-[15px] font-semibold text-text-main flex items-center gap-2">
                      <Settings size={16} className="text-text-secondary" />
                      项目基本信息
                    </h3>
                    {isSettingsSaved && (
                      <span className="text-[12px] text-emerald-600 font-medium flex items-center gap-1">
                        <Check size={14} /> 设置已保存
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">项目名称</label>
                      <input 
                        type="text" 
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-neutral-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">预算规模</label>
                      <input 
                        type="text" 
                        value={settingsForm.budget}
                        onChange={(e) => setSettingsForm({ ...settingsForm, budget: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-neutral-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">项目执行周期</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="date" 
                          value={settingsForm.startDate}
                          onChange={(e) => setSettingsForm({ ...settingsForm, startDate: e.target.value })}
                          className="flex-1 px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none"
                        />
                        <span className="text-text-tertiary text-[12px]">至</span>
                        <input 
                          type="date" 
                          value={settingsForm.endDate}
                          onChange={(e) => setSettingsForm({ ...settingsForm, endDate: e.target.value })}
                          className="flex-1 px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">默认观察周期</label>
                      <div className="flex gap-4 pt-2">
                        {["24小时", "3天", "14天 (标准)"].map((period) => (
                          <label key={period} className="flex items-center gap-2 cursor-pointer text-[12.5px]">
                            <input 
                              type="radio" 
                              name="obs_period_set" 
                              checked={settingsForm.observationPeriod.includes(period.slice(0, 2))}
                              onChange={() => setSettingsForm({ ...settingsForm, observationPeriod: period })}
                              className="accent-neutral-900" 
                            />
                            <span>{period}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3.2 策略协议完整结构化配置与编辑 */}
                <div className="bg-surface-1 rounded-xl p-6 border border-border-default space-y-4">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-text-main flex items-center gap-2">
                        <Target size={16} className="text-text-secondary" />
                        策略协议与打法规则
                      </h3>
                      <p className="text-[12px] text-text-secondary mt-0.5">定义本轮运营方案的受众、痛点、解法与验证假设</p>
                    </div>

                    <button 
                      onClick={() => setShowStrategyDrawer(true)}
                      className="px-3 py-1.5 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>抽屉预览完整协议</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>

                  <div className="space-y-4 text-[13px]">
                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">目标人群 (Target Audience)</label>
                      <input 
                        type="text"
                        value={settingsForm.targetAudience}
                        onChange={(e) => setSettingsForm({ ...settingsForm, targetAudience: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-neutral-400"
                        placeholder="例如：3-6个月幼犬初次换粮腹泻软便的铲屎官"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">核心痛点与问题 (Core Problem)</label>
                      <textarea 
                        rows={2}
                        value={settingsForm.coreProblem}
                        onChange={(e) => setSettingsForm({ ...settingsForm, coreProblem: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-neutral-400"
                        placeholder="例如：换粮内容有收藏但咨询少，缺乏专业解释与信任闭环"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-medium text-text-main mb-1.5">内容解法与策略概述 (Solution Summary)</label>
                      <textarea 
                        rows={2}
                        value={settingsForm.solutionSummary}
                        onChange={(e) => setSettingsForm({ ...settingsForm, solutionSummary: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-neutral-400"
                        placeholder="例如：KOC真实体验测评 + 店长号专业科普指导 + 评论区私信引导"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[12.5px] font-medium text-text-main mb-1.5">本轮验证假设</label>
                        <input 
                          type="text"
                          value={settingsForm.verifyHypothesis}
                          onChange={(e) => setSettingsForm({ ...settingsForm, verifyHypothesis: e.target.value })}
                          className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-medium text-text-main mb-1.5">继续铺量条件</label>
                        <input 
                          type="text"
                          value={settingsForm.continueCondition}
                          onChange={(e) => setSettingsForm({ ...settingsForm, continueCondition: e.target.value })}
                          className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-medium text-text-main mb-1.5">暂停或调整条件</label>
                        <input 
                          type="text"
                          value={settingsForm.stopCondition}
                          onChange={(e) => setSettingsForm({ ...settingsForm, stopCondition: e.target.value })}
                          className="w-full px-3 py-2 bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-default flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsSettingsSaved(true);
                        setTimeout(() => setIsSettingsSaved(false), 2500);
                      }}
                      className="px-5 py-2 bg-btn-main hover:bg-btn-main-hover text-white text-[12.5px] font-medium rounded-lg transition-colors"
                    >
                      保存项目与策略修改
                    </button>
                  </div>
                </div>

                {/* 3.3 问卷与落地页入口 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-text-secondary" />
                        <h4 className="text-[14px] font-semibold text-text-main">消费者体验问卷</h4>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded">已启用</span>
                    </div>
                    <p className="text-[12.5px] text-text-secondary">
                      配置消费者领取代写任务时需填写的真实产品体验问卷，AI将依据真实答卷起草正文。
                    </p>
                    <button
                      onClick={() => setShowProjectQuestionnaire(true)}
                      className="w-full py-2 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12.5px] font-medium rounded-lg transition-colors"
                    >
                      配置问卷字段与规则
                    </button>
                  </div>

                  <div className="bg-surface-1 rounded-xl p-5 border border-border-default space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode size={16} className="text-text-secondary" />
                        <h4 className="text-[14px] font-semibold text-text-main">落地页推广设置</h4>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-medium rounded">推广中</span>
                    </div>
                    <p className="text-[12.5px] text-text-secondary">
                      生成与管理消费者招募落地页、扫码领任务链接及微信通知参数。
                    </p>
                    <button
                      onClick={() => setShowLandingPage(true)}
                      className="w-full py-2 bg-surface-2 hover:bg-hover-bg border border-border-default text-text-main text-[12.5px] font-medium rounded-lg transition-colors"
                    >
                      配置落地页规则与展示
                    </button>
                  </div>
                </div>

                {/* 3.4 危险区域 / 归档 */}
                <div className="bg-surface-1 rounded-xl p-5 border border-danger/20 space-y-3">
                  <h4 className="text-[14px] font-semibold text-danger flex items-center gap-2">
                    <AlertTriangle size={16} />
                    项目生命周期管理
                  </h4>
                  <p className="text-[12.5px] text-text-secondary">
                    归档项目后，项目将停止新的自动排期与任务生成，已发布笔记和历史复盘数据将完整保留。
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setShowArchiveConfirm(true)}
                      className="px-4 py-2 bg-danger-light hover:bg-red-100 border border-danger/30 text-danger text-[12.5px] font-medium rounded-lg transition-colors"
                    >
                      归档本项目
                    </button>
                  </div>
                </div>

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

      {/* Note Detail Drawer */}
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

      {/* Archive Project Confirm Modal */}
      {showArchiveConfirm && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/40 backdrop-blur-xs p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-1 rounded-xl shadow-xl border border-border-default max-w-md w-full p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto border border-amber-100">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-text-main">归档项目确认</h3>
              <p className="text-[13px] text-text-secondary mt-1.5 leading-relaxed">
                确认归档“<span className="font-bold text-text-main">{currentProject.name}</span>”吗？归档后项目数据与笔记将被安全保留。
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 border border-border-default text-text-secondary hover:bg-surface-2 rounded-lg text-[13px] font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteProject(currentProject.id);
                  setShowArchiveConfirm(false);
                }}
                className="px-5 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-lg text-[13px] font-bold transition-colors"
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
            <div className="p-5 border-b border-border-default flex justify-between items-center bg-surface-2">
              <h3 className="font-bold text-[16px] text-text-main flex items-center gap-2">
                <History size={18} /> 操作历史记录
              </h3>
              <button onClick={() => setShowOperationLogs(false)} className="text-text-tertiary hover:text-text-secondary"><X size={18}/></button>
            </div>
            <div className="p-5 max-h-[400px] overflow-y-auto space-y-2.5 text-[13px]">
              {currentProject.operationLogs.map((log) => (
                <div key={log.id} className="p-3 bg-surface-2 rounded-lg border border-border-default space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-main">{log.action}</span>
                    <span className="text-[11.5px] text-text-tertiary">{log.timestamp}</span>
                  </div>
                  <div className="text-text-secondary text-[12px]">{log.detail}</div>
                  <div className="text-[11px] text-text-tertiary">操作人: {log.operator}</div>
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
            <div className="p-5 border-b border-border-default flex justify-between items-center bg-surface-2">
              <div>
                <h3 className="font-bold text-[16px] text-text-main">新建内容或笔记</h3>
                <p className="text-[12px] text-text-secondary mt-0.5">请选择新建或导入内容的方式</p>
              </div>
              <button onClick={() => setShowImportSelect(false)} className="text-text-tertiary hover:text-text-secondary p-1 rounded-lg hover:bg-hover-bg"><X size={18}/></button>
            </div>
            
            <div className="p-4 space-y-2.5">
              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("file"); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-emerald-300 hover:bg-emerald-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main flex items-center justify-between">
                    <span>批量导入 Excel / CSV</span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-medium">批量解析</span>
                  </div>
                  <div className="text-[12px] text-text-secondary mt-0.5">上传 Excel 表格文件，解析提取笔记标题与计划</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("feishu"); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-blue-300 hover:bg-blue-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <Link2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main flex items-center justify-between">
                    <span>关联飞书多维表格</span>
                    <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md font-medium">云端同步</span>
                  </div>
                  <div className="text-[12px] text-text-secondary mt-0.5">粘贴飞书表格 URL，自动导入并同步笔记任务</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowBatchAIGenerator(true); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-primary-300 hover:bg-brand-light/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-primary-100 text-primary-700 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main flex items-center justify-between">
                    <span>AI 批量智能规划生成</span>
                    <span className="text-[11px] text-primary-700 bg-primary-100 px-2 py-0.5 rounded-md font-medium">智能规划</span>
                  </div>
                  <div className="text-[12px] text-text-secondary mt-0.5">根据项目目标与知识库，由 AI 批量起草多篇笔记</div>
                </div>
              </button>

              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("single"); }}
                className="w-full p-3.5 text-left bg-surface-1 border border-border-default hover:border-neutral-400 hover:bg-surface-2 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-hover-bg text-text-secondary rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <Plus size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main flex items-center justify-between">
                    <span>手动新建单篇笔记</span>
                    <span className="text-[11px] text-text-secondary bg-hover-bg px-2 py-0.5 rounded-md font-medium">单篇</span>
                  </div>
                  <div className="text-[12px] text-text-secondary mt-0.5">手动填写标题、选择账号与设定发布排期</div>
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
