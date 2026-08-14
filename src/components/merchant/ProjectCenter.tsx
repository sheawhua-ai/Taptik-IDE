import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Calendar, AlertTriangle, CheckCircle2, History, 
  MoreHorizontal, Settings, FileText, Check, ChevronRight, X,
  ExternalLink, QrCode, FileSpreadsheet, Trash2, Camera, User, BarChart2, Lightbulb, Link2, ChevronDown, ChevronUp, AlertCircle, PanelLeftClose, PanelLeftOpen, Upload, Sparkles, Target, ShieldAlert, Layers, Clock, RefreshCw
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { Project, Note } from "../../data/projectStore";
import { calculateProjectPipeline, getNoteDisplayStatus, getActionTextForIssue, getNoteMainStage } from "../../utils/noteStatus";

import { NoteDetailDrawer } from "./ProjectCenter/NoteDetailDrawer";
import { ProjectQuestionnaireDrawer } from "../rings/ProjectQuestionnaireDrawer";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { CreateProjectWorkstation } from "./CreateProjectWorkstation";
import { LandingPageSettingsModal } from "./LandingPageSettingsModal";
import { BatchNoteGeneratorModal } from "./BatchNoteGeneratorModal";
import { AddSingleNoteModal } from "./AddSingleNoteModal";
import { AddProjectMaterialModal } from "./AddProjectMaterialModal";
import { ProjectMaterialsTab } from "./ProjectMaterialsTab";
import { NoteMatchingModal } from "../material-center/NoteMatchingModal";
import { KOCQuestionnaireModal } from "./KOCQuestionnaireModal";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("全部");
  const [activeTab, setActiveTab] = useState<"概览" | "笔记" | "素材" | "数据">("概览");
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [selectedPackageNoteForQuestionnaire, setSelectedPackageNoteForQuestionnaire] = useState<Note | null>(null);
  const pipeline = currentProject ? calculateProjectPipeline(currentProject.notes) : null;
  
  // Left Panel State
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("tap_tik_project_sidebar");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("tap_tik_project_sidebar", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);


  // Modals & Drawers
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showOperationLogs, setShowOperationLogs] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showProjectPlan, setShowProjectPlan] = useState(false);
  const [showMaterialReq, setShowMaterialReq] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [showImportSelect, setShowImportSelect] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState<"file" | "feishu" | "single" | null>(null);
  const [showBatchAIGenerator, setShowBatchAIGenerator] = useState(false);
  const [showNextRoundDraft, setShowNextRoundDraft] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [createProjectStep, setCreateProjectStep] = useState<1 | 2>(1);
  
  const [activeNoteDetail, setActiveNoteDetail] = useState<Note | null>(null);
  const [showProjectQuestionnaire, setShowProjectQuestionnaire] = useState(false);
  const [activeWorkbench, setActiveWorkbench] = useState<"content" | "assets" | "publish" | "create_project" | null>(null);

  // Progress Refresh state
  const [isRefreshingProgress, setIsRefreshingProgress] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("刚刚");
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(Date.now());

  const handleRefreshProgress = () => {
    if (isRefreshingProgress) return;
    setIsRefreshingProgress(true);
    setTimeout(() => {
      setIsRefreshingProgress(false);
      setLastUpdatedTimestamp(Date.now());
      setLastUpdatedText("刚刚");
    }, 600);
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

  // Action Tasks
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

  const filteredProjects = projects.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== "全部" && p.status !== filterStatus) return false;
    return true;
  });

  if (activeWorkbench === "content") return <ContentReviewWorkbench onClose={() => setActiveWorkbench(null)} />;
  if (activeWorkbench === "assets") return <ShootingAndUploadWorkbench onClose={() => setActiveWorkbench(null)} />;
  if (activeWorkbench === "publish") return <PublishExceptionWorkbench onClose={() => setActiveWorkbench(null)} onBack={() => setActiveWorkbench(null)} fromSource="project" />;
  if (activeWorkbench === "create_project") return <CreateProjectWorkstation onClose={() => setActiveWorkbench(null)} onCreate={() => setActiveWorkbench(null)} />;

  return (
    <div className="h-full w-full flex bg-[#F7F8FA] text-[#111827] relative overflow-hidden">
      
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
                    className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <button onClick={() => setIsSidebarOpen(false)} title="收起项目列表" className="w-7 h-7 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-[#667085] ">


                    <PanelLeftClose size={16} />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 rounded-xl text-[13px] outline-none focus:bg-white focus:ring-1 focus:ring-neutral-300"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {["全部", "进行中", "已结束"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium transition-colors ${
                      filterStatus === status ? "bg-neutral-900 text-white" : "bg-neutral-100 text-[#667085] hover:bg-neutral-200"
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
                const pending = projTasks.filter(t => t.severity !== "blocker");
                const errors = projTasks.filter(t => t.actionType === "ResolvePublishError" || t.issueMessage?.includes("异常"));
                
                let statusText = "按计划推进";
                let statusClass = "text-[#667085]";
                
                if (errors.length > 0) {
                  statusText = `${errors.length}项异常待处理`;
                  statusClass = "text-red-600 font-bold";
                } else if (blockers.length > 0) {
                  statusText = `${blockers.length}项阻塞 · ${pending.length}项待跟进`;
                  statusClass = "text-red-600 font-bold";
                } else if (projTasks.length > 0) {
                  statusText = `${projTasks.length}项待跟进`;
                  statusClass = "text-[#667085]";
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
      {/* RIGHT: Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F8FA]">
        {/* Header */}
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
                <h1 className="text-[18px] font-bold text-[#111827]">{currentProject.name}</h1>
                <span className="text-[12px] text-[#667085] bg-neutral-100 px-2 py-0.5 rounded-md">{currentProject.status}</span>
                <span className="text-[12px] text-[#667085] flex items-center gap-1.5"><Calendar size={12} /> {currentProject.startDate} 至 {currentProject.endDate}</span>
              </div>
              <div className="text-[13px] text-[#667085]">
                {currentProject.description || "验证真实换粮体验与店长专业解释能否提高有效咨询"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 高频操作：落地页与问卷推广 */}
            <button
              onClick={() => setShowLandingPage(true)}
              className="px-3.5 py-1.5 bg-white border border-[#EAECF0] hover:bg-neutral-50 hover:border-neutral-300 text-[13px] font-bold text-neutral-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <QrCode size={14} className="text-neutral-600" />
              <span>落地页与问卷</span>
            </button>

            {/* 低频操作：合并收纳在更多菜单内 */}
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
                      onClick={() => { setShowMoreMenu(false); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-600 flex items-center gap-2"
                    >
                      <span>结束项目</span>
                    </button>
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
        {/* Tabs */}

        <div className="px-6 bg-white border-b border-[#EAECF0] flex gap-6 text-[14px] font-medium shrink-0">
          {(["概览", "笔记", "素材", "数据"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 relative ${activeTab === tab ? "text-primary-600 font-bold" : "text-[#667085] hover:text-[#111827]"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-6">
            
            {/* OVERVIEW */}
            {activeTab === "概览" && (
              <div className="space-y-6">
                {/* 1. 当前需要关注 */}
                <div className="bg-white rounded-xl py-5 px-6 border border-[#EAECF0]">
                  <h3 className="text-[14px] font-bold text-[#111827] mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className={primaryProjectTask ? "text-red-500" : "text-emerald-500"} /> 
                    当前需要关注
                  </h3>
                  {primaryProjectTask ? (
                    <div className="space-y-3">
                      {/* Primary Task */}
                      <div className="space-y-2">
                        <div className="text-[14px] font-bold text-[#111827]">
                          {primaryProjectTask.issueMessage || "任务需要处理"}
                        </div>
                        <div className="text-[13px] text-[#667085] flex flex-wrap gap-x-4 gap-y-1">
                          <div>关联笔记：<span className="text-[#111827] font-medium">{primaryProjectTask.noteTitle || "当前项目"}</span></div>
                          <div>影响范围：<span className="text-[#111827] font-medium">{primaryProjectTask.impactScope || "当前项目进度"}</span></div>
                          <div>等待方：<span className="text-[#111827] font-medium">{primaryProjectTask.waitOn || primaryProjectTask.assignee || "操盘手确认"}</span></div>
                        </div>
                        <div className="pt-1">
                          <button 
                            onClick={() => handleTaskAction(primaryProjectTask)}
                            className="px-5 py-1.5 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            处理：{getActionTextForIssue({type: primaryProjectTask.actionType, message: primaryProjectTask.issueMessage || ""})}
                          </button>
                        </div>
                      </div>

                      {/* Secondary Tasks (Collapsible) */}
                      {secondaryProjectTasksCount > 0 && (
                        <div className="pt-3 border-t border-[#EAECF0]">
                          <button 
                            onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                            className="text-[13px] text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
                          >
                            {isTasksExpanded ? "收起其他待办事项" : `展开其他 ${secondaryProjectTasksCount} 项待跟进事项`}
                            {isTasksExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          {isTasksExpanded && (
                            <div className="mt-3 space-y-3 pl-2 border-l-2 border-primary-100">
                              {projectPendingTasks.slice(1).map((task) => (
                                <div key={task.id} className="pt-2.5 first:pt-0 border-t border-[#EAECF0]/60 first:border-0 space-y-1.5">
                                  <div className="text-[13px] font-bold text-[#111827]">
                                    {task.issueMessage || "任务需要处理"}
                                  </div>
                                  <div className="text-[12px] text-[#667085] flex flex-wrap gap-x-4 gap-y-0.5">
                                    <div>关联笔记：<span className="text-[#111827]">{task.noteTitle || "当前项目"}</span></div>
                                    <div>等待：<span className="text-[#111827]">{task.waitOn || task.assignee || "操盘手确认"}</span></div>
                                  </div>
                                  <div>
                                    <button 
                                      onClick={() => handleTaskAction(task)}
                                      className="px-3.5 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1"
                                    >
                                      处理：{getActionTextForIssue({type: task.actionType, message: task.issueMessage || ""})}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[13px] text-[#667085]">
                      <div className="mb-1 text-[#111827] font-bold">当前无待跟进事项，项目按计划推进中</div>
                      <div>下一节点：今天 18:00 发布首篇店长号笔记</div>
                    </div>
                  )}
                </div>

                {/* 2. 项目进展 */}
                <div className="bg-white rounded-xl p-5 border border-[#EAECF0]">
                  {/* Card Header with Refresh Button & Time */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#EAECF0]">
                    <h3 className="text-[14px] font-bold text-[#111827]">项目进展</h3>
                    <div className="flex items-center gap-2 text-[12px] text-[#667085]">
                      <span>最后更新：{lastUpdatedText}</span>
                      <button 
                        onClick={handleRefreshProgress}
                        disabled={isRefreshingProgress}
                        title="刷新项目数据"
                        className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={14} className={isRefreshingProgress ? "animate-spin text-primary-600" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* 3 Static Groups Horizontal Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0] gap-4 md:gap-0">
                    {/* Group 1: 内容准备 */}
                    <div className="space-y-2 md:pr-5">
                      <div className="text-[13px] font-bold text-[#111827] mb-2.5">内容准备</div>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">计划笔记</span>
                          <span className="font-bold text-[#111827]">6 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">内容已生成</span>
                          <span className="font-bold text-[#111827]">3 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">内容待确认</span>
                          <span className="font-bold text-[#111827]">1 篇</span>
                        </div>
                      </div>
                    </div>

                    {/* Group 2: 素材准备 */}
                    <div className="space-y-2 md:px-5">
                      <div className="text-[13px] font-bold text-[#111827] mb-2.5">素材准备</div>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">素材已就绪</span>
                          <span className="font-bold text-[#111827]">0 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">等待素材</span>
                          <span className="font-bold text-[#111827]">6 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">素材异常</span>
                          <span className="font-bold text-[#111827]">0 篇</span>
                        </div>
                      </div>
                    </div>

                    {/* Group 3: 发布与观察 */}
                    <div className="space-y-2 md:pl-5">
                      <div className="text-[13px] font-bold text-[#111827] mb-2.5">发布与观察</div>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">待发布</span>
                          <span className="font-bold text-[#111827]">0 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">等待识别</span>
                          <span className="font-bold text-[#111827]">0 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">观察中</span>
                          <span className="font-bold text-[#111827]">1 篇</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">已完成</span>
                          <span className="font-bold text-[#111827]">0 篇</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 本轮营销方案 */}
                <div className="bg-white rounded-xl p-6 border border-[#EAECF0] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAECF0] pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-[#111827]">本轮营销方案</h3>
                    </div>
                    <button 
                      onClick={() => setShowProjectPlan(true)}
                      className="px-3.5 py-1.5 border border-[#EAECF0] text-primary-600 hover:bg-primary-50 hover:border-primary-200 text-[13px] font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      查看方案详情 <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0]/80">
                      <div className="text-[12px] text-[#667085] mb-1.5 font-medium">核心问题</div>
                      <div className="text-[13px] text-[#111827] font-bold leading-relaxed">解决用户换粮拉肚子/软便顾虑，破除种草多转化少</div>
                    </div>
                    <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0]/80">
                      <div className="text-[12px] text-[#667085] mb-1.5 font-medium">内容方法</div>
                      <div className="text-[13px] text-[#111827] font-bold leading-relaxed">店长专业科普 + KOC真实体验 + 动态问卷生成</div>
                    </div>
                    <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0]/80">
                      <div className="text-[12px] text-[#667085] mb-1.5 font-medium">发布矩阵</div>
                      <div className="text-[13px] text-[#111827] font-bold leading-relaxed">品牌店长号 (1) + KOC (3) + 问卷笔记包 (2)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTES */}
            {activeTab === "笔记" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="搜索笔记..." 
                        className="pl-8 pr-3 py-1.5 w-[200px] bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-primary-500"
                      />
                    </div>
                    <select className="py-1.5 px-2 bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none">
                      <option>全部状态</option>
                      <option>内容准备</option>
                      <option>素材准备</option>
                      <option>发布准备</option>
                      <option>已发布</option>
                      <option>观察中</option>
                      <option>观察完成</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-[13px] text-[#667085] ml-2">
                      <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      仅看异常
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowImportSelect(true)} 
                      className="px-3.5 py-1.5 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Plus size={14} /> 新建
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#EAECF0] divide-y divide-neutral-100">
                  {currentProject.notes.length === 0 ? (
                    <div className="p-12 text-center text-[#667085]">
                      <FileText size={32} className="mx-auto mb-3 text-neutral-300" />
                      <div className="text-[14px] font-bold text-[#111827] mb-1">当前项目暂无笔记</div>
                      <div className="text-[13px] mb-4">您可以批量导入 Excel、关联飞书表格链接、由 AI 智能生成或手动新建笔记。</div>
                      <button 
                        onClick={() => setShowImportSelect(true)} 
                        className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 flex items-center gap-1.5 mx-auto transition-colors shadow-sm"
                      >
                        <Plus size={14} /> 新建笔记
                      </button>
                    </div>
                  ) : (
                    currentProject.notes.map(note => {
                      const tasks = enrichedActionTasks.filter(t => t.noteSlotId === note.id && t.status === "pending");
                      const hasIssue = tasks.length > 0;
                      
                      const mainStage = getNoteMainStage(note);
                      let statusText = "";
                      let buttonText = "查看详情";
                      let isWarning = false;
                      let isError = false;

                      if (hasIssue) {
                        const task = tasks[0];
                        statusText = task.issueMessage || task.description || "";
                        isWarning = task.severity !== 'blocker';
                        isError = task.severity === 'blocker';
                        
                        buttonText = getActionTextForIssue({type: task.actionType, message: task.issueMessage || ""});
                      } else {
                        if (note.isNotePackage && note.packageSpec?.questionnaireStatus === "待填写") {
                          statusText = `写作规定：${note.packageSpec.guidelines}`;
                        } else if (mainStage === "观察完成") statusText = "观察结束，可查看复盘数据";
                        else if (mainStage === "观察中") statusText = "已发布，正在进行3天数据观察";
                        else if (mainStage === "已发布") statusText = "识别成功，即将开始数据观察";
                        else if (mainStage === "发布准备") statusText = "内容和素材就绪，计划近期发布";
                        else if (mainStage === "素材准备") statusText = "等待素材拍摄和收集";
                        else if (mainStage === "内容准备") statusText = "内容起草中";
                      }

                      return (
                        <div key={note.id} className="p-4 hover:bg-neutral-50/50 transition-colors">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[14px] text-[#111827]">{note.title || "未命名笔记"}</span>
                              {note.isNotePackage && (
                                note.packageSpec?.questionnaireStatus === "已填写" ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-md">
                                    📦 笔记包 (已填问卷)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[11px] font-bold rounded-md">
                                    📦 笔记包
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          <div className="text-[12px] text-[#667085] mb-2 font-medium">
                            {note.type} · {mainStage} {note.participant ? `· ${note.participant}` : ""}
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-[13px] line-clamp-1 flex-1">
                              {isError ? (
                                <span className="text-red-600 font-medium">{statusText}</span>
                              ) : isWarning ? (
                                <span className="text-[#111827] font-medium">{statusText}</span>
                              ) : note.isNotePackage && note.packageSpec?.questionnaireStatus === "待填写" ? (
                                <span className="text-primary-800 font-medium">{statusText}</span>
                              ) : (
                                <span className="text-[#667085]">{statusText}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (hasIssue) handleTaskAction(tasks[0]);
                                  else setActiveNoteDetail(note);
                                }}
                                className={`px-4 py-1.5 rounded-xl text-[13px] font-bold shrink-0 ${hasIssue ? "bg-primary-50 text-primary-700 hover:bg-primary-100" : "border border-[#EAECF0] text-[#111827] hover:bg-neutral-50"}`}
                              >
                                {buttonText}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* MATERIALS */}
            {activeTab === "素材" && currentProject && (
              <ProjectMaterialsTab 
                project={currentProject} 
                onNavigateToMaterials={() => setWorkflowTab?.("materials")}
              />
            )}

            {/* DATA */}
            {activeTab === "数据" && (
              <div className="space-y-6">
                {((pipeline?.observing || 0) + (pipeline?.completed || 0)) === 0 ? (
                  <div className="bg-white rounded-xl p-12 border border-[#EAECF0] text-center">
                    <div className="text-[15px] font-bold text-[#111827] mb-2">项目尚未形成可复盘数据。</div>
                    <div className="text-[13px] text-[#667085] mb-6">首篇笔记发布并识别成功后，系统将在这里开始观察。</div>
                    <button onClick={() => setActiveTab("笔记")} className="px-4 py-2 bg-white border border-[#EAECF0] text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50">
                      查看发布进度
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 1. 观察概况 */}
                    <div className="bg-white rounded-xl p-6 border border-[#EAECF0]">
                      <div className="text-[14px] font-bold text-[#111827] mb-2">观察概况</div>
                      <div className="text-[13px] text-[#667085]">
                        已发布{(pipeline?.observing || 0) + (pipeline?.completed || 0)}篇 · 观察中{pipeline?.observing || 0}篇 · 已完成{pipeline?.completed || 0}篇 · {pipeline?.exception ? <span className="text-red-600 font-medium">{pipeline.exception}篇识别异常</span> : <span>0篇识别异常</span>}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-[#EAECF0]">
                      {/* 2. 本轮结论 */}
                      <div className="mb-8">
                        <div className="text-[14px] font-bold text-[#111827] mb-2 flex items-center gap-2">
                          <Lightbulb size={16} className="text-primary-600" /> 本轮结论
                        </div>
                        <div className="text-[15px] text-[#111827] font-medium leading-relaxed mb-4">
                          店长号专业解释型内容产生的有效咨询高于KOC体验内容。
                        </div>
                        <div className="space-y-3 p-4 bg-neutral-50 rounded-xl">
                          <h4 className="text-[13px] font-bold text-[#111827]">结论依据</h4>
                          <div className="text-[13px] text-[#667085] space-y-1">
                            <div>· 店长号：1篇，产生31条有效咨询</div>
                            <div>· KOC：2篇，产生14条有效咨询</div>
                            <div>· 相较上一轮：店长号有效咨询/篇提升26%</div>
                          </div>
                          <div className="text-[12px] text-neutral-400 mt-2 pt-2 border-t border-[#EAECF0] flex flex-wrap gap-x-4 gap-y-1">
                            <span>数据覆盖：3/4篇</span>
                            <span>已完成观察：2篇</span>
                            <span>观察中：1篇</span>
                            <span>暂无数据：1篇</span>
                            <span>统计周期：2026-08-01 至今</span>
                            <span>最近更新：今天 09:00</span>
                            <span className="font-bold text-amber-600">结论强度：初步趋势</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. 核心指标 & 4. 下一轮建议 */}
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-[14px] font-bold text-[#111827]">核心指标</h3>
                        <button onClick={() => setShowNextRoundDraft(true)} className="px-4 py-2 bg-primary-50 text-primary-700 font-bold text-[13px] rounded-xl hover:bg-primary-100 transition-colors flex items-center gap-1.5">
                          <Lightbulb size={14} /> 生成下一轮调整草案
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                          <div className="text-[12px] text-[#667085] mb-1">已发布笔记</div>
                          <div className="text-[24px] font-black text-[#111827]">3</div>
                        </div>
                        <div>
                          <div className="text-[12px] text-[#667085] mb-1">有效咨询</div>
                          <div className="text-[24px] font-black text-[#111827]">45</div>
                        </div>
                        <div className="relative group">
                          <div className="text-[12px] text-[#667085] mb-1 flex items-center gap-1 cursor-help">
                            目标完成度 <AlertCircle size={12} className="text-neutral-400" />
                          </div>
                          <div className="text-[24px] font-black text-[#111827]">90%</div>
                          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-neutral-900 text-white text-[12px] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="font-bold mb-2 pb-2 border-b border-neutral-700">计算公式</div>
                            <div className="space-y-1 text-neutral-300">
                              <div><span className="text-neutral-400">当前值：</span>45次有效咨询</div>
                              <div><span className="text-neutral-400">目标值：</span>50次有效咨询</div>
                              <div className="pt-1 mt-1 border-t border-neutral-700"><span className="text-neutral-400">纳入计算：</span>已发布的 3 篇笔记</div>
                              <div><span className="text-neutral-400">未纳入：</span>1 篇笔记（未发布/无数据）</div>
                              <div className="pt-1"><span className="text-neutral-400">数据更新：</span>今天 09:00</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5. 笔记数据明细 */}
                      <div className="border-t border-[#EAECF0] pt-6">
                        <details className="group">
                          <summary className="flex items-center justify-between cursor-pointer list-none text-[13px] font-medium text-[#111827]">
                            笔记数据明细
                            <ChevronDown size={14} className="text-[#667085] group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-[12px]">
                              <thead>
                                <tr className="border-b border-[#EAECF0] text-[#667085]">
                                  <th className="pb-2 font-normal">笔记标题</th>
                                  <th className="pb-2 font-normal">发布主体</th>
                                  <th className="pb-2 font-normal">浏览</th>
                                  <th className="pb-2 font-normal">点赞</th>
                                  <th className="pb-2 font-normal">收藏</th>
                                  <th className="pb-2 font-normal">评论</th>
                                  <th className="pb-2 font-normal">有效咨询</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-50 text-[#111827]">
                                <tr className="hover:bg-neutral-50 transition-colors">
                                  <td className="py-2 pr-4 truncate max-w-[150px]">幼犬换粮总是拉肚子？店长教你避坑</td>
                                  <td className="py-2">店长号</td>
                                  <td className="py-2">1,204</td>
                                  <td className="py-2">45</td>
                                  <td className="py-2">89</td>
                                  <td className="py-2">22</td>
                                  <td className="py-2 font-medium">31</td>
                                </tr>
                                <tr className="hover:bg-neutral-50 transition-colors">
                                  <td className="py-2 pr-4 truncate max-w-[150px]">我家金毛幼犬换粮体验，记录七天变化</td>
                                  <td className="py-2">KOC</td>
                                  <td className="py-2">3,451</td>
                                  <td className="py-2">120</td>
                                  <td className="py-2">45</td>
                                  <td className="py-2">30</td>
                                  <td className="py-2 font-medium">10</td>
                                </tr>
                                <tr className="hover:bg-neutral-50 transition-colors">
                                  <td className="py-2 pr-4 truncate max-w-[150px]">【官方科普】幼犬肠胃敏感期如何换粮</td>
                                  <td className="py-2">KOC</td>
                                  <td className="py-2">892</td>
                                  <td className="py-2">34</td>
                                  <td className="py-2">12</td>
                                  <td className="py-2">5</td>
                                  <td className="py-2 font-medium">4</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showProjectPlan && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowProjectPlan(false)} className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-50" />
            <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring", damping:25, stiffness:200}} className="fixed right-0 top-0 bottom-0 w-[640px] bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#111827]">本轮完整营销与内容方案</h2>
                  <p className="text-[12px] text-[#667085] mt-0.5">方案已由 AI 操盘手根据商户策略协议与商业目标综合生成并确认</p>
                </div>
                <button onClick={() => setShowProjectPlan(false)} className="p-1.5 text-neutral-400 hover:text-[#111827] hover:bg-neutral-200 rounded-xl transition-colors">
                  <X size={18}/>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* 1. 商业目标与核心问题 */}
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-primary-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={15} /> 1. 商业目标与核心问题
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0]">
                      <div className="text-[12px] text-[#667085] mb-1 font-medium">要解决的核心问题</div>
                      <div className="text-[13px] text-[#111827] font-bold leading-relaxed">解决用户换粮拉肚子/软便顾虑，破除种草收藏多但购买咨询少问题</div>
                    </div>
                    <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0]">
                      <div className="text-[12px] text-[#667085] mb-1 font-medium">转化目标与预期</div>
                      <div className="text-[13px] text-[#111827] font-bold leading-relaxed">验证“换粮软便”真实测评+店长号专业解释能否提升有效咨询，线索转化率达8%</div>
                    </div>
                  </div>
                </div>

                {/* 2. 内容策略与账号发布矩阵 */}
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-primary-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={15} /> 2. 内容策略与账号发布矩阵
                  </h4>
                  <div className="border border-[#EAECF0] rounded-xl overflow-hidden divide-y divide-[#EAECF0]">
                    <div className="p-3.5 bg-white flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 font-medium">目标人群</div>
                      <div className="text-[13px] text-[#111827]">3-6个月幼犬初次换粮腹泻软便的铲屎官、养宠新手</div>
                    </div>
                    <div className="p-3.5 bg-white flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 font-medium">内容方法论</div>
                      <div className="text-[13px] text-[#111827]">店长专业科普 + KOC真实体验 + 动态问卷生成笔记包</div>
                    </div>
                    <div className="p-3.5 bg-white flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 font-medium">发布主体组合</div>
                      <div className="text-[13px] text-[#111827]">品牌店长号 (1) + KOC真实测评 (3) + 品牌主号 (1) + KOC问卷笔记包 (2)</div>
                    </div>
                  </div>
                </div>

                {/* 3. 事实采集与体验问卷 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[13px] font-bold text-primary-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={15} /> 3. 事实采集与体验问卷
                    </h4>
                    <button
                      onClick={() => {
                        setShowProjectPlan(false);
                        setShowProjectQuestionnaire(true);
                      }}
                      className="text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      配置问卷题目 <ChevronRight size={13} />
                    </button>
                  </div>
                  <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0] space-y-2">
                    <div className="text-[13px] text-[#111827] font-bold">
                      当前已配置 {currentProject.landingPageSettings?.questionnaireQuestions?.length || 4} 道事实采集题目
                    </div>
                    <p className="text-[12px] text-[#667085] leading-relaxed">
                      落地页与活动体验官通过问卷提交真实月龄、困扰症状及喂养反馈后，AI 操盘手将提取核心事实定向生成真实测评笔记。
                    </p>
                  </div>
                </div>

                {/* 4. 数据观察 */}
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-primary-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={15} /> 4. 数据观察与调优标准
                  </h4>
                  <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#EAECF0] space-y-1">
                    <div className="text-[12px] text-[#667085] font-medium">默认观察周期</div>
                    <div className="text-[13px] text-[#111827] font-bold">7天 (包含24h初期数据、3天核心指标检查与7天复盘草案)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showMaterialReq && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowMaterialReq(false)} className="fixed inset-0 bg-neutral-900/20 z-50" />
            <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring", damping:25, stiffness:200}} className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center">
                <h2 className="text-[16px] font-bold">素材需求</h2>
                <button onClick={() => setShowMaterialReq(false)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-xl"><X size={16}/></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="bg-neutral-50 p-4 rounded-xl text-[13px] text-[#111827]">当前建议收集6组素材，已有4组，仍缺2组。</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Small Modals */}

      {/* Small Modals */}
      {showImportSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={() => setShowImportSelect(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#EAECF0]">
            <div className="p-5 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
              <div>
                <h3 className="font-bold text-[16px] text-[#111827]">新建笔记</h3>
                <p className="text-[12px] text-[#667085] mt-0.5">请选择新建笔记的方式</p>
              </div>
              <button onClick={() => setShowImportSelect(false)} className="text-neutral-400 hover:text-[#667085] p-1 rounded-lg hover:bg-neutral-200"><X size={18}/></button>
            </div>
            
            <div className="p-4 space-y-2.5">
              {/* Option 1: Excel / CSV Batch Import */}
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

              {/* Option 2: Feishu Sheet Link Sync */}
              <button 
                onClick={() => { setShowImportSelect(false); setShowAddNoteModal("feishu"); }}
                className="w-full p-3.5 text-left bg-white border border-[#EAECF0] hover:border-blue-300 hover:bg-blue-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Link2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center justify-between">
                    <span>关联飞书表格链接</span>
                    <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md font-medium">云端同步</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">粘贴飞书多维表格 URL，关联并导入多维表格数据</div>
                </div>
              </button>

              {/* Option 3: AI Batch Generation */}
              <button 
                onClick={() => { setShowImportSelect(false); setShowBatchAIGenerator(true); }}
                className="w-full p-3.5 text-left bg-white border border-[#EAECF0] hover:border-primary-300 hover:bg-primary-50/40 rounded-xl flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 bg-primary-100 text-primary-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center justify-between">
                    <span>AI 批量智能生成</span>
                    <span className="text-[11px] text-primary-700 bg-primary-100 px-2 py-0.5 rounded-md font-medium">智能规划</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">根据项目目标与知识库，由 AI 智能生成多篇笔记草稿</div>
                </div>
              </button>

              {/* Option 4: Manual Single Note */}
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
                    <span className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">单篇新建</span>
                  </div>
                  <div className="text-[12px] text-[#667085] mt-0.5">手动填写标题、选择账号类型与输入正文与计划</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showOperationLogs && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowOperationLogs(false)} className="fixed inset-0 bg-neutral-900/20 z-50" />
          <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring", damping:25, stiffness:200}} className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center">
              <h2 className="text-[16px] font-bold">操作记录</h2>
              <button onClick={() => setShowOperationLogs(false)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-xl"><X size={16}/></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary-600 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-2 rounded border border-slate-200 text-[13px] text-[#111827]">
                        <span className="text-neutral-400 text-[11px] block">3月5日 14:10</span>
                        张店长补充产品资料
                      </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-2 rounded border border-slate-200 text-[13px] text-[#111827]">
                        <span className="text-neutral-400 text-[11px] block">3月5日 11:20</span>
                        操盘手确认本轮方案
                      </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-2 rounded border border-slate-200 text-[13px] text-[#111827]">
                        <span className="text-neutral-400 text-[11px] block">3月5日 10:00</span>
                        AI生成4篇内容草稿
                      </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}


      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setShowCreateProject(false)} />
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="relative bg-white rounded-2xl w-full max-w-[640px] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
              <h2 className="text-[16px] font-bold text-[#111827]">新建项目</h2>
              <button onClick={() => setShowCreateProject(false)} className="text-neutral-400 hover:text-[#667085]"><X size={18}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {createProjectStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">项目名称</label>
                    <input type="text" placeholder="例如：春季新品推广第二期" className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px] outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">项目目标与要求</label>
                    <textarea 
                      rows={4} 
                      placeholder="描述项目的核心目标、主推产品、目标人群等信息，AI将根据这些要求生成执行方案..." 
                      className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px] outline-none focus:border-primary-500 resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">默认观察周期</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="new_obs" className="accent-primary-600 w-4 h-4" /> <span className="text-[13px] text-[#111827]">24小时</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="new_obs" className="accent-primary-600 w-4 h-4" /> <span className="text-[13px] text-[#111827]">3天</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="new_obs" className="accent-primary-600 w-4 h-4" defaultChecked /> <span className="text-[13px] text-[#111827]">7天</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {createProjectStep === 2 && (
                <div className="space-y-6">
                  <div className="text-[14px] font-bold text-[#111827] flex items-center gap-2 mb-4">
                    <Lightbulb size={16} className="text-primary-600" /> AI 执行方案预览
                  </div>
                  <div className="text-[13px] text-[#667085] mb-4 bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-800">
                    基于您的项目要求，AI 已为您规划以下执行步骤。带有 <AlertTriangle size={14} className="inline text-amber-500 mx-0.5" /> 的步骤将需要人工介入确认。
                  </div>

                  <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-[#EAECF0]">
                    <div className="relative pl-6">
                      <div className="absolute w-6 h-6 bg-emerald-100 rounded-full -left-0 -top-1 border-4 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <div className="text-[13px] font-bold text-[#111827]">生成内容策略与大纲</div>
                      <div className="text-[12px] text-[#667085] mt-1">AI 自动提取知识库内容，生成 5 篇笔记大纲。</div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-6 h-6 bg-amber-100 rounded-full -left-0 -top-1 border-4 border-white flex items-center justify-center">
                        <AlertTriangle size={12} className="text-amber-600" />
                      </div>
                      <div className="text-[13px] font-bold text-[#111827]">确认方案大纲 <span className="text-[11px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-1">需人工</span></div>
                      <div className="text-[12px] text-[#667085] mt-1">由操盘手审核并确认大纲方向，确认后 AI 将开始自动起草正文。</div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-6 h-6 bg-emerald-100 rounded-full -left-0 -top-1 border-4 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <div className="text-[13px] font-bold text-[#111827]">撰写正文与匹配素材</div>
                      <div className="text-[12px] text-[#667085] mt-1">AI 自动完成正文撰写，并尝试从素材库匹配相应图片。</div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-6 h-6 bg-amber-100 rounded-full -left-0 -top-1 border-4 border-white flex items-center justify-center">
                        <AlertTriangle size={12} className="text-amber-600" />
                      </div>
                      <div className="text-[13px] font-bold text-[#111827]">下发缺漏素材拍摄任务 <span className="text-[11px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-1">需人工</span></div>
                      <div className="text-[12px] text-[#667085] mt-1">对于未匹配到的素材，由 AI 生成拍摄要求，操盘手一键下发给店长。</div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-6 h-6 bg-emerald-100 rounded-full -left-0 -top-1 border-4 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <div className="text-[13px] font-bold text-[#111827]">执行发布与自动识别</div>
                      <div className="text-[12px] text-[#667085] mt-1">AI 下发员工发布任务，发布完成后自动识别回传。</div>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-6 h-6 bg-emerald-100 rounded-full -left-0 -top-1 border-4 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <div className="text-[13px] font-bold text-[#111827]">7天数据观察与复盘草案</div>
                      <div className="text-[12px] text-[#667085] mt-1">AI 持续监控 7 天数据，结束后自动生成下一轮调整草案供您参考。</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#EAECF0] bg-white flex justify-end gap-3 shrink-0">
              {createProjectStep === 1 ? (
                <>
                  <button onClick={() => setShowCreateProject(false)} className="px-4 py-2 border border-[#EAECF0] text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50 transition-colors">取消</button>
                  <button onClick={() => setCreateProjectStep(2)} className="px-5 py-2 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors">下一步</button>
                </>
              ) : (
                <>
                  <button onClick={() => setCreateProjectStep(1)} className="px-4 py-2 border border-[#EAECF0] text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50 transition-colors">上一步</button>
                  <button onClick={() => setShowCreateProject(false)} className="px-5 py-2 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors">确认并创建</button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {showProjectSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/20" onClick={() => setShowProjectSettings(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[560px] shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-[#111827]">项目设置</h2>
              <button onClick={() => setShowProjectSettings(false)} className="text-neutral-400 hover:text-[#667085]"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">项目名称</label>
                <input type="text" defaultValue={currentProject.name} className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">项目周期</label>
                <div className="flex items-center gap-2">
                  <input type="date" defaultValue={currentProject.startDate} className="flex-1 px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px]" />
                  <span className="text-neutral-400 text-[13px]">至</span>
                  <input type="date" defaultValue={currentProject.endDate} className="flex-1 px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px]" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">项目状态</label>
                <select className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px] bg-white outline-none">
                  <option>进行中</option>
                  <option>准备中</option>
                  <option>已结束</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">默认观察周期</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="obs_period" className="accent-primary-600 w-4 h-4" /> <span className="text-[13px] text-[#111827]">24小时</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="obs_period" className="accent-primary-600 w-4 h-4" /> <span className="text-[13px] text-[#111827]">3天</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="obs_period" className="accent-primary-600 w-4 h-4" defaultChecked /> <span className="text-[13px] text-[#111827]">7天</span>
                  </label>
                </div>
                <p className="text-[12px] text-[#667085] mt-2">项目内新建笔记默认使用该观察周期，单篇笔记可以在发布前覆盖。</p>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button onClick={() => setShowProjectSettings(false)} className="px-4 py-2 border border-[#EAECF0] bg-white text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50 transition-colors">取消</button>
                <button onClick={() => setShowProjectSettings(false)} className="px-4 py-2 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors">保存设置</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLandingPage && currentProject && (
        <LandingPageSettingsModal
          project={currentProject}
          onClose={() => setShowLandingPage(false)}
        />
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
                确认归档“<span className="font-bold text-[#111827]">{currentProject.name}</span>”吗？归档后项目将移至历史归档列表中，项目数据及笔记素材将被保留且变为只读状态。
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
                onClick={() => setShowArchiveConfirm(false)}
                className="px-5 py-2 bg-[#111827] hover:bg-black text-white rounded-xl text-[13px] font-bold transition-colors shadow-xs"
              >
                确认归档
              </button>
            </div>
          </motion.div>
        </div>
      )}


      {/* Next Round Draft */}
      <AnimatePresence>
        {showNextRoundDraft && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowNextRoundDraft(false)} className="fixed inset-0 bg-neutral-900/20 z-50 backdrop-blur-sm" />
            <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring", damping:28, stiffness:300}} className="fixed right-0 top-0 bottom-0 w-[560px] bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
                <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                  <Lightbulb size={18} className="text-primary-600" /> 下一轮调整草案
                </h2>
                <button onClick={() => setShowNextRoundDraft(false)} className="p-2 text-neutral-400 hover:text-[#111827] rounded-xl hover:bg-neutral-200"><X size={16}/></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="text-[13px] text-[#667085] bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800">
                  AI已根据本轮 {pipeline?.totalNotes || 0} 篇笔记的观察数据，为您生成下一轮策略调整建议。确认后将以此为基础生成新一轮方案。
                </div>
                
                <div>
                  <h3 className="text-[14px] font-bold text-[#111827] mb-3 border-b border-[#EAECF0] pb-2">内容方法调整</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[13px] font-bold text-emerald-700 flex items-center gap-1.5 mb-2"><CheckCircle2 size={14}/> 建议继续</div>
                      <div className="text-[13px] text-[#111827] bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        店长号专业科普（如“七日换粮法”），该方向有效咨询率达 8%。
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-amber-700 flex items-center gap-1.5 mb-2"><AlertTriangle size={14}/> 建议减少</div>
                      <div className="text-[13px] text-[#111827] bg-amber-50 p-3 rounded-xl border border-amber-100">
                        KOC单纯开箱晒图体验，泛流量高但咨询率低于 1%。
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[14px] font-bold text-[#111827] mb-3 border-b border-[#EAECF0] pb-2">发布与素材调整</h3>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 mt-0.5">发布主体</div>
                      <div className="text-[13px] text-[#111827]">建议将店长号比例从 25% 提升至 50%</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 mt-0.5">素材要求</div>
                      <div className="text-[13px] text-[#111827]">强化“配料表特写”与“颗粒大小对比”，此两类素材在上一轮高赞笔记中出现频率达 100%。</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[14px] font-bold text-[#111827] mb-3 border-b border-[#EAECF0] pb-2">下一轮验证方向</h3>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 mt-0.5">待验证问题</div>
                      <div className="text-[13px] text-[#111827]">加入“便便状态变化”是否能进一步提高养宠新手的搜索留存与有效咨询？</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-[12px] text-[#667085] w-24 shrink-0 mt-0.5">尚不确定</div>
                      <div className="text-[13px] text-[#111827]">KOC测评类内容如果增加干货属性，是否能扭转低转化局面（当前样本不足）。</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#EAECF0] bg-white flex justify-end gap-3 shrink-0">
                <button onClick={() => setShowNextRoundDraft(false)} className="px-4 py-2 border border-[#EAECF0] text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50 transition-colors">取消</button>
                <button onClick={() => setShowNextRoundDraft(false)} className="px-5 py-2 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors">确认并开启新一轮</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      

      {/* Note Detail Drawer */}
      {activeNoteDetail && (
        <NoteDetailDrawer
          onClose={() => setActiveNoteDetail(null)}
          note={activeNoteDetail}
          projectId={currentProject.id}
          onActionClick={() => setActiveNoteDetail(null)}
          onOpenInExecutionCenter={() => setActiveNoteDetail(null)}
        />
      )}

      {/* Project Questionnaire Drawer */}
      {showProjectQuestionnaire && (
        <ProjectQuestionnaireDrawer 
          project={currentProject}
          onClose={() => setShowProjectQuestionnaire(false)} 
        />
      )}
      
      {/* Note Creation / Import Modals */}
      {showAddNoteModal && currentProject && (
        <AddSingleNoteModal 
          project={currentProject} 
          initialTab={showAddNoteModal} 
          onClose={() => setShowAddNoteModal(null)} 
        />
      )}

      {showBatchAIGenerator && currentProject && (
        <BatchNoteGeneratorModal 
          project={currentProject} 
          onClose={() => setShowBatchAIGenerator(false)} 
        />
      )}
    </div>
  );
}
