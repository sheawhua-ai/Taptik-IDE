import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Calendar, Target, AlertTriangle, CheckCircle2, History, 
  MoreHorizontal, ChevronRight, Filter, ExternalLink, RefreshCw, FileText,
  AlertCircle, ArrowRight, Check, Eye, ChevronDown, Sparkles
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { Project, Note, NoteType, ProjectStatus } from "../../data/projectStore";
import { NoteDetailDrawer } from "./ProjectCenter/NoteDetailDrawer";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { CreateProjectWorkstation } from "./CreateProjectWorkstation";

export function ProjectCenter({ 
  setWorkflowTab, 
  hasData, 
  activeProjectId 
}: { 
  setWorkflowTab?: (tab: string) => void; 
  hasData?: boolean; 
  activeProjectId?: string; 
}) {
  const { projects, selectedProjectId, setSelectedProjectId, currentProject, updateNoteStatus, clearNoteIssue } = useProjectStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("全部");
  const [activeTab, setActiveTab] = useState<"工作台" | "本轮方案" | "项目结果" | "操作记录">("工作台");
  
  // Note List Filters
  const [noteSearch, setNoteSearch] = useState("");
  const [noteTypeFilter, setNoteTypeFilter] = useState<string>("全部");
  const [expandedIssues, setExpandedIssues] = useState(false);

  // Modals / Drawers / Down-drills
  const [activeNoteDetail, setActiveNoteDetail] = useState<Note | null>(null);
  const [activeWorkbench, setActiveWorkbench] = useState<"content" | "assets" | "publish" | "create_project" | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400">
        请选择左侧项目或新建项目
      </div>
    );
  }

  // Filter projects in left list
  const filteredProjects = projects.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== "全部" && p.status !== filterStatus) return false;
    return true;
  });

  // Calculate highest priority task for "现在要做"
  const allIssuesNotes = currentProject.notes.filter((n) => n.currentIssue);
  const primaryIssueNote = allIssuesNotes[0];
  const secondaryIssuesCount = allIssuesNotes.length > 1 ? allIssuesNotes.length - 1 : 0;

  // Calculate Stage Counts for "项目进度"
  const totalNotes = currentProject.notes.length;
  const contentReadyCount = currentProject.notes.filter((n) => n.contentStatus === "已确认").length;
  const publishedCount = currentProject.notes.filter((n) => n.publishStatus === "已发布").length;
  const observingCount = currentProject.notes.filter((n) => n.resultStatus === "观察中").length;
  const completedObservingCount = currentProject.notes.filter((n) => n.resultStatus === "已完成").length;

  // Filter notes in "笔记清单"
  const filteredNotes = currentProject.notes.filter((n) => {
    if (noteSearch && !n.title.toLowerCase().includes(noteSearch.toLowerCase()) && !n.participant.toLowerCase().includes(noteSearch.toLowerCase())) {
      return false;
    }
    if (noteTypeFilter === "待我处理") {
      return n.contentStatus === "待确认" || n.materialStatus === "待验收" || n.publishStatus === "发布异常" || n.currentIssue;
    }
    if (noteTypeFilter === "KOC") return n.type === "KOC";
    if (noteTypeFilter === "店长号/KOS") return n.type === "店长号/KOS";
    if (noteTypeFilter === "品牌主号") return n.type === "品牌主号";
    if (noteTypeFilter === "异常") return n.publishStatus === "发布异常" || n.resultStatus === "数据异常" || n.currentIssue;
    return true;
  });

  // Handle Action Button click
  const handleNoteAction = (note: Note) => {
    if (note.contentStatus === "待确认" || note.currentIssue?.targetWorkbench === "content") {
      setActiveWorkbench("content");
    } else if (note.materialStatus === "待验收" || note.currentIssue?.targetWorkbench === "assets") {
      setActiveWorkbench("assets");
    } else if (note.publishStatus === "发布异常" || note.currentIssue?.targetWorkbench === "publish") {
      setActiveWorkbench("publish");
    } else {
      setActiveNoteDetail(note);
    }
  };

  if (activeWorkbench === "content") {
    return <ContentReviewWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "assets") {
    return <ShootingAndUploadWorkbench onClose={() => setActiveWorkbench(null)} />;
  }
  if (activeWorkbench === "publish") {
    return <PublishExceptionWorkbench onClose={() => setActiveWorkbench(null)} />;
  }

  return (
    <div className="h-full w-full flex bg-[#f8f9fa] text-neutral-900 relative overflow-hidden">
      
      {/* LEFT: Project List Sidebar */}
      <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-neutral-100 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[15px] font-bold text-neutral-900">项目列表</h2>
            <button 
              onClick={() => setActiveWorkbench("create_project")}
              className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-xs"
              title="新建项目"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索项目名称..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 rounded-lg text-[13px] outline-none focus:bg-white focus:ring-1 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {["全部", "准备中", "执行中", "暂停", "观察中", "已完成", "已归档"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors ${
                  filterStatus === status 
                    ? "bg-neutral-900 text-white" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredProjects.map((proj) => {
            const hasBlocker = proj.notes.some((n) => n.currentIssue?.type === "blocker");
            const hasWarning = proj.notes.some((n) => n.currentIssue?.type === "warning");

            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                  selectedProjectId === proj.id
                    ? "bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900"
                    : "bg-white border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-bold text-[14px] text-neutral-900 line-clamp-1 flex-1 pr-2">{proj.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                    proj.status === "执行中" ? "bg-emerald-100 text-emerald-800" :
                    proj.status === "准备中" ? "bg-amber-100 text-amber-800" :
                    proj.status === "观察中" ? "bg-blue-100 text-blue-800" : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="text-[12px] text-neutral-500 line-clamp-1 mb-2">
                  {proj.goal}
                </div>

                {hasBlocker ? (
                  <div className="text-[11px] text-red-700 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
                    <AlertTriangle size={12} className="shrink-0" /> 当前卡点代处理
                  </div>
                ) : hasWarning ? (
                  <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <AlertCircle size={12} className="shrink-0" /> 包含待确认事项
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Current Project Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        
        {/* Workspace Header - strictly Name, Status, Goal, Date Range, More */}
        <div className="px-8 py-5 border-b border-neutral-200 shrink-0 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-extrabold text-neutral-900">{currentProject.name}</h1>
                <span className={`text-[12px] px-2.5 py-0.5 rounded-full font-bold ${
                  currentProject.status === "执行中" ? "bg-emerald-100 text-emerald-800" :
                  currentProject.status === "准备中" ? "bg-amber-100 text-amber-800" :
                  currentProject.status === "观察中" ? "bg-blue-100 text-blue-800" : "bg-neutral-100 text-neutral-600"
                }`}>
                  {currentProject.status}
                </span>
              </div>

              <div className="flex items-center gap-6 text-[13px] text-neutral-600">
                <p className="flex items-center gap-1.5 max-w-2xl">
                  <Target size={15} className="text-neutral-400 shrink-0" />
                  <span className="font-medium text-neutral-800">目标：</span>{currentProject.goal}
                </p>
                <p className="flex items-center gap-1.5 shrink-0 text-neutral-500">
                  <Calendar size={14} className="text-neutral-400" />
                  {currentProject.startDate} ~ {currentProject.endDate}
                </p>
              </div>
            </div>

            {/* More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1 text-[13px]">
                    <button 
                      onClick={() => { setShowMoreMenu(false); setActiveWorkbench("create_project"); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-800"
                    >
                      调整本轮安排
                    </button>
                    <button 
                      onClick={() => { setShowMoreMenu(false); setActiveTab("操作记录"); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-800"
                    >
                      查看操作记录
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-b border-transparent">
            {(["工作台", "本轮方案", "项目结果", "操作记录"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] font-bold pb-2 transition-all relative ${
                  activeTab === tab 
                    ? "text-neutral-900" 
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#fcfcfc]">
          <div className="max-w-[1100px] mx-auto space-y-6">

            {/* TAB 1: 工作台 (Main Workspace View) */}
            {activeTab === "工作台" && (
              <>
                {/* 1. 现在要做 (What to do now) */}
                <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-neutral-800" /> 现在要做
                    </h2>
                    {secondaryIssuesCount > 0 && (
                      <button 
                        onClick={() => setExpandedIssues(!expandedIssues)}
                        className="text-[12px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded-md"
                      >
                        {expandedIssues ? "收起列表" : `另有 ${secondaryIssuesCount} 项待处理`}
                        <ChevronDown size={14} className={`transition-transform ${expandedIssues ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {primaryIssueNote && primaryIssueNote.currentIssue ? (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          primaryIssueNote.currentIssue.type === "blocker" ? "bg-red-500" : "bg-amber-500"
                        }`} />
                        <div>
                          <div className="text-[14px] font-bold text-neutral-900 mb-0.5">
                            {primaryIssueNote.currentIssue.message}
                          </div>
                          <div className="text-[12px] text-neutral-500">
                            影响范围：{primaryIssueNote.currentIssue.impactScope}
                          </div>
                        </div>
                      </div>

                      {/* Single Primary Action Button */}
                      <button 
                        onClick={() => handleNoteAction(primaryIssueNote)}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-lg shadow-2xs transition-colors shrink-0"
                      >
                        {primaryIssueNote.currentIssue.nextStepActionText}
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-[13px] text-emerald-800 flex items-center justify-between">
                      <span>🎉 当前项目所有事项按计划顺利推进中，无待处理卡点</span>
                      <span className="text-[12px] font-bold text-emerald-700">常规发布观察中</span>
                    </div>
                  )}

                  {/* Expanded Secondary Issues */}
                  {expandedIssues && secondaryIssuesCount > 0 && (
                    <div className="mt-3 space-y-2 pt-3 border-t border-neutral-100">
                      {allIssuesNotes.slice(1).map((n) => (
                        <div key={n.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center text-[13px]">
                          <div>
                            <span className="font-bold text-neutral-900 mr-2">[{n.title}]</span>
                            <span className="text-neutral-600">{n.currentIssue?.message}</span>
                          </div>
                          <button 
                            onClick={() => handleNoteAction(n)}
                            className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50 font-bold text-[12px] rounded-md transition-colors"
                          >
                            {n.currentIssue?.nextStepActionText || "去处理"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. 项目进度 (Project Progress) */}
                <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
                  <h2 className="text-[15px] font-bold text-neutral-900 mb-4">项目进度</h2>
                  <div className="flex items-center justify-between text-center relative px-2">
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 -z-0" />

                    {[
                      { label: "方案确认", status: "已确认", note: "方案已打通" },
                      { label: "笔记准备", status: `${contentReadyCount}/${totalNotes}`, note: `${contentReadyCount}篇内容已就绪` },
                      { label: "发布执行", status: `${publishedCount}/${totalNotes}`, note: `${publishedCount}篇已发布` },
                      { label: "数据观察", status: `${observingCount}篇`, note: "数据抓取中" },
                      { label: "完成", status: `${completedObservingCount}篇`, note: "完结总结" }
                    ].map((st, idx) => (
                      <div key={st.label} className="flex flex-col items-center gap-1.5 z-10 bg-white px-3">
                        <div className="w-7 h-7 rounded-full bg-neutral-900 text-white font-bold text-[12px] flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <span className="text-[13px] font-bold text-neutral-900">{st.label}</span>
                        <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{st.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 笔记清单 (Note List) */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
                  
                  {/* List Controls */}
                  <div className="p-4 border-b border-neutral-200 flex justify-between items-center gap-4 bg-neutral-50/50">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-bold text-neutral-900">笔记清单</h2>
                      <span className="text-[12px] text-neutral-400">({filteredNotes.length} 篇)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Search */}
                      <div className="relative w-48">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={13} />
                        <input 
                          type="text" 
                          placeholder="搜索笔记/参与者..."
                          value={noteSearch}
                          onChange={(e) => setNoteSearch(e.target.value)}
                          className="w-full pl-7 pr-3 py-1 bg-white rounded-md text-[12px] border border-neutral-200 outline-none focus:border-neutral-400"
                        />
                      </div>

                      {/* Filter Buttons */}
                      <div className="flex bg-neutral-200/60 p-0.5 rounded-lg text-[12px]">
                        {["全部", "待我处理", "KOC", "店长号/KOS", "品牌主号", "异常"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setNoteTypeFilter(f)}
                            className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                              noteTypeFilter === f ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 text-[12px]">
                          <th className="p-3.5 font-bold">笔记/参与者</th>
                          <th className="p-3.5 font-bold">类型</th>
                          <th className="p-3.5 font-bold">内容</th>
                          <th className="p-3.5 font-bold">素材</th>
                          <th className="p-3.5 font-bold">计划日期</th>
                          <th className="p-3.5 font-bold">发布状态</th>
                          <th className="p-3.5 font-bold">结果状态</th>
                          <th className="p-3.5 font-bold text-right">下一步</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredNotes.map((note) => (
                          <tr 
                            key={note.id} 
                            onClick={() => setActiveNoteDetail(note)}
                            className="hover:bg-neutral-50 cursor-pointer transition-colors"
                          >
                            <td className="p-3.5">
                              <div className="font-bold text-neutral-900 line-clamp-1">{note.title}</div>
                              <div className="text-[11px] text-neutral-500 mt-0.5">{note.participant}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                                note.type === "KOC" ? "bg-purple-50 text-purple-700" :
                                note.type === "店长号/KOS" ? "bg-blue-50 text-blue-700" : "bg-neutral-100 text-neutral-800"
                              }`}>
                                {note.type}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[11px] px-2 py-0.5 rounded ${
                                note.contentStatus === "已确认" ? "bg-emerald-50 text-emerald-700 font-bold" :
                                note.contentStatus === "待确认" ? "bg-amber-50 text-amber-700 font-bold" : "bg-neutral-100 text-neutral-500"
                              }`}>
                                {note.contentStatus}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[11px] px-2 py-0.5 rounded ${
                                note.materialStatus === "已齐" ? "bg-emerald-50 text-emerald-700 font-bold" :
                                note.materialStatus === "待验收" ? "bg-blue-50 text-blue-700 font-bold" : "bg-neutral-100 text-neutral-500"
                              }`}>
                                {note.materialStatus}
                              </span>
                            </td>
                            <td className="p-3.5 font-medium text-neutral-700">{note.plannedDate}</td>
                            <td className="p-3.5">
                              <span className={`text-[11px] px-2 py-0.5 rounded ${
                                note.publishStatus === "已发布" ? "bg-emerald-50 text-emerald-700 font-bold" :
                                note.publishStatus === "发布异常" ? "bg-red-50 text-red-700 font-bold" : "bg-neutral-100 text-neutral-500"
                              }`}>
                                {note.publishStatus}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[11px] px-2 py-0.5 rounded ${
                                note.resultStatus === "观察中" ? "bg-blue-50 text-blue-700 font-bold" :
                                note.resultStatus === "已完成" ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-neutral-100 text-neutral-500"
                              }`}>
                                {note.resultStatus}
                              </span>
                            </td>
                            <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => handleNoteAction(note)}
                                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12px] rounded-md transition-colors shadow-2xs"
                              >
                                {note.contentStatus === "待确认" ? "确认内容" :
                                 note.materialStatus === "待验收" ? "查看回传" :
                                 note.publishStatus === "发布异常" ? "处理异常" :
                                 note.publishStatus === "待发布" ? "安排发布" : "查看详情"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: 本轮方案 (Current Plan) */}
            {activeTab === "本轮方案" && (
              <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-2xs space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                  <div>
                    <h2 className="text-[18px] font-bold text-neutral-900">本轮运营方案</h2>
                    <p className="text-[13px] text-neutral-500">确认本轮运营的目标、核心问题与终止条件</p>
                  </div>
                  <button 
                    onClick={() => setActiveWorkbench("create_project")}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-lg transition-colors"
                  >
                    调整本轮安排
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">核心要解决的问题</span>
                    <p className="text-[14px] font-bold text-neutral-900">{currentProject.strategyProtocol.coreProblem}</p>
                  </div>

                  <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">目标人群与场景</span>
                    <p className="text-[14px] font-bold text-neutral-900">{currentProject.strategyProtocol.targetAudience}</p>
                  </div>

                  <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 col-span-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">本轮采用的运营打法</span>
                    <p className="text-[14px] font-bold text-neutral-900 leading-relaxed">{currentProject.strategyProtocol.solutionSummary}</p>
                  </div>

                  <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">本轮要验证什么</span>
                    <p className="text-[14px] font-bold text-neutral-900">{currentProject.strategyProtocol.verifyHypothesis}</p>
                  </div>

                  <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">继续铺量条件</span>
                    <p className="text-[14px] font-bold text-emerald-900">{currentProject.strategyProtocol.continueCondition}</p>
                  </div>

                  <div className="p-5 bg-red-50/50 rounded-xl border border-red-200 space-y-2 col-span-2">
                    <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">暂停或换打法条件</span>
                    <p className="text-[14px] font-bold text-red-900">{currentProject.strategyProtocol.stopCondition}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 项目结果 (Project Results) */}
            {activeTab === "项目结果" && (
              <div className="space-y-6">
                
                {/* Fact Summary */}
                <div className="grid grid-cols-6 gap-4">
                  {[
                    { label: "计划笔记", val: totalNotes, unit: "篇" },
                    { label: "已发布", val: publishedCount, unit: "篇" },
                    { label: "已回收链接", val: publishedCount, unit: "条" },
                    { label: "观察中", val: observingCount, unit: "篇" },
                    { label: "已完成观察", val: completedObservingCount, unit: "篇" },
                    { label: "异常项", val: currentProject.notes.filter(n => n.publishStatus === "发布异常").length, unit: "项", isRed: true }
                  ].map((s) => (
                    <div key={s.label} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
                      <div className="text-[12px] text-neutral-500 mb-1">{s.label}</div>
                      <div className={`text-[20px] font-extrabold ${s.isRed ? "text-red-600" : "text-neutral-900"}`}>
                        {s.val} <span className="text-[12px] font-normal text-neutral-500">{s.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Published Notes Metrics Table */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
                  <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50/50">
                    <div>
                      <h2 className="text-[15px] font-bold text-neutral-900">数据回收结果（事实汇总）</h2>
                      <p className="text-[12px] text-neutral-500">展示已发布笔记的具体回收指标，未获得数据严格标注“暂无数据”</p>
                    </div>

                    <button 
                      onClick={() => {
                        if (setWorkflowTab) setWorkflowTab("review");
                      }}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Sparkles size={16} /> 查看AI复盘
                    </button>
                  </div>

                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 text-[12px]">
                        <th className="p-3.5 font-bold">笔记标题</th>
                        <th className="p-3.5 font-bold">发布时间</th>
                        <th className="p-3.5 font-bold">点赞</th>
                        <th className="p-3.5 font-bold">收藏</th>
                        <th className="p-3.5 font-bold">评论</th>
                        <th className="p-3.5 font-bold">转发</th>
                        <th className="p-3.5 font-bold">浏览量</th>
                        <th className="p-3.5 font-bold">高意向咨询</th>
                        <th className="p-3.5 font-bold">最近更新</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {currentProject.notes.map((n) => (
                        <tr key={n.id} className="hover:bg-neutral-50">
                          <td className="p-3.5 font-bold text-neutral-900 max-w-[200px] truncate">
                            {n.publishLink ? (
                              <a href={n.publishLink} target="_blank" rel="noreferrer" className="hover:underline text-primary-600 flex items-center gap-1">
                                {n.title} <ExternalLink size={12} />
                              </a>
                            ) : (
                              n.title
                            )}
                          </td>
                          <td className="p-3.5 text-neutral-600">{n.publishTime || "尚未发布"}</td>
                          <td className="p-3.5 font-bold">{n.metrics ? n.metrics.likes : "暂无数据"}</td>
                          <td className="p-3.5 font-bold">{n.metrics ? n.metrics.collects : "暂无数据"}</td>
                          <td className="p-3.5 font-bold">{n.metrics ? n.metrics.comments : "暂无数据"}</td>
                          <td className="p-3.5 font-bold">{n.metrics ? n.metrics.shares : "暂无数据"}</td>
                          <td className="p-3.5 font-bold">{n.metrics ? (n.metrics.views ?? "暂无数据") : "暂无数据"}</td>
                          <td className="p-3.5 font-bold text-primary-600">{n.metrics ? n.metrics.highIntentComments : "暂无数据"}</td>
                          <td className="p-3.5 text-neutral-500 text-[12px]">{n.metrics ? n.metrics.lastUpdated : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: 操作记录 (Operation Log) */}
            {activeTab === "操作记录" && (
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs space-y-4">
                <h2 className="text-[16px] font-bold text-neutral-900 border-b border-neutral-100 pb-3">项目操作记录</h2>
                <div className="space-y-3">
                  {currentProject.operationLogs.map((log) => (
                    <div key={log.id} className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center text-[13px]">
                      <div>
                        <div className="font-bold text-neutral-900">{log.action} ({log.operator})</div>
                        <div className="text-[12px] text-neutral-500 mt-0.5">{log.detail}</div>
                      </div>
                      <span className="text-[12px] text-neutral-400">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Note Detail Drawer */}
      <NoteDetailDrawer 
        note={activeNoteDetail}
        onClose={() => setActiveNoteDetail(null)}
        onActionClick={(note) => {
          setActiveNoteDetail(null);
          handleNoteAction(note);
        }}
        onOpenInExecutionCenter={(note) => {
          setActiveNoteDetail(null);
          if (setWorkflowTab) setWorkflowTab("execution");
        }}
      />

      {/* Create / Edit Project Modal Workstation */}
      <AnimatePresence>
        {activeWorkbench === "create_project" && (
          <div className="fixed inset-0 z-50 bg-[#fcfcfc] flex flex-col">
            <CreateProjectWorkstation 
              onClose={() => setActiveWorkbench(null)}
              onCreate={(proj) => {
                setActiveWorkbench(null);
              }}
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
