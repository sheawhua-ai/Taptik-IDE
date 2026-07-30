import React, { useState } from "react";
import { PenTool, Image as ImageIcon, Send, MessageSquare, AlertTriangle, ChevronRight, CheckCircle2, Search, Filter } from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { Note } from "../../data/projectStore";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { InteractionWorkbench } from "../rings/InteractionWorkbench";

export function ExecutionCenter() {
  const { projects, updateNoteStatus, clearNoteIssue } = useProjectStore();
  const [activeTaskType, setActiveTaskType] = useState<string | null>(null);

  // Gather all pending action notes across all projects
  const allNotes = projects.flatMap((p) => p.notes);

  const pendingContentNotes = allNotes.filter((n) => n.contentStatus === "待确认" || n.currentIssue?.targetWorkbench === "content");
  const pendingAssetNotes = allNotes.filter((n) => n.materialStatus === "待验收" || n.currentIssue?.targetWorkbench === "assets");
  const pendingPublishNotes = allNotes.filter((n) => n.publishStatus === "待发布" || n.publishStatus === "发布异常" || n.currentIssue?.targetWorkbench === "publish");
  const pendingInteractionNotes = allNotes.filter((n) => (n.metrics && n.metrics.highIntentComments > 0) || n.currentIssue?.targetWorkbench === "interaction");

  const taskCategories = [
    {
      id: "content",
      title: "内容确认",
      icon: PenTool,
      pendingCount: pendingContentNotes.length,
      notes: pendingContentNotes,
      topIssue: pendingContentNotes.find((n) => n.currentIssue)?.currentIssue?.message || (pendingContentNotes.length > 0 ? "待确认笔记内容" : ""),
      impactDesc: pendingContentNotes.find((n) => n.currentIssue)?.currentIssue?.impactScope || (pendingContentNotes.length > 0 ? "不确认将影响笔记定稿" : "")
    },
    {
      id: "assets",
      title: "素材与回传",
      icon: ImageIcon,
      pendingCount: pendingAssetNotes.length,
      notes: pendingAssetNotes,
      topIssue: pendingAssetNotes.find((n) => n.currentIssue)?.currentIssue?.message || (pendingAssetNotes.length > 0 ? "待验收回传素材" : ""),
      impactDesc: pendingAssetNotes.find((n) => n.currentIssue)?.currentIssue?.impactScope || (pendingAssetNotes.length > 0 ? "不验收将阻断下一步下发" : "")
    },
    {
      id: "publish",
      title: "发布任务与异常",
      icon: Send,
      pendingCount: pendingPublishNotes.length,
      notes: pendingPublishNotes,
      topIssue: pendingPublishNotes.find((n) => n.currentIssue)?.currentIssue?.message || (pendingPublishNotes.length > 0 ? "存在发布异常或待调度" : ""),
      impactDesc: pendingPublishNotes.find((n) => n.currentIssue)?.currentIssue?.impactScope || (pendingPublishNotes.length > 0 ? "影响发布排期计划" : "")
    },
    {
      id: "interaction",
      title: "互动与线索",
      icon: MessageSquare,
      pendingCount: pendingInteractionNotes.length,
      notes: pendingInteractionNotes,
      topIssue: pendingInteractionNotes.find((n) => n.currentIssue)?.currentIssue?.message || (pendingInteractionNotes.length > 0 ? "包含未回复的高意向咨询" : ""),
      impactDesc: pendingInteractionNotes.find((n) => n.currentIssue)?.currentIssue?.impactScope || (pendingInteractionNotes.length > 0 ? "影响商机转化率" : "")
    }
  ];

  const actionableNotes = allNotes.filter((n) => n.currentIssue || n.contentStatus === "待确认" || n.materialStatus === "待验收" || n.publishStatus === "待发布" || n.publishStatus === "发布异常" || (n.metrics && n.metrics.highIntentComments > 0));

  const sortedActionableNotes = [...actionableNotes].sort((a, b) => {
    const aIsBlocker = a.currentIssue?.type === "blocker" || a.publishStatus === "发布异常" ? 1 : 0;
    const bIsBlocker = b.currentIssue?.type === "blocker" || b.publishStatus === "发布异常" ? 1 : 0;
    if (aIsBlocker !== bIsBlocker) return bIsBlocker - aIsBlocker;

    const aIsWarning = a.currentIssue?.type === "warning" || a.contentStatus === "待确认" || a.materialStatus === "待验收" ? 1 : 0;
    const bIsWarning = b.currentIssue?.type === "warning" || b.contentStatus === "待确认" || b.materialStatus === "待验收" ? 1 : 0;
    if (aIsWarning !== bIsWarning) return bIsWarning - aIsWarning;

    return 0;
  });

  const focusNote = sortedActionableNotes[0];

  const getCategoryFromNote = (note: Note) => {
    if (note.currentIssue?.targetWorkbench === "content" || note.contentStatus === "待确认") return "content";
    if (note.currentIssue?.targetWorkbench === "assets" || note.materialStatus === "待验收") return "assets";
    if (note.currentIssue?.targetWorkbench === "publish" || note.publishStatus === "发布异常" || note.publishStatus === "待发布") return "publish";
    if (note.currentIssue?.targetWorkbench === "interaction" || (note.metrics && note.metrics.highIntentComments > 0)) return "interaction";
    return "content";
  };

  const getCategoryTitle = (id: string) => {
    const map: Record<string, string> = {
      content: "内容确认",
      assets: "素材与回传",
      publish: "发布任务与异常",
      interaction: "互动与线索"
    };
    return map[id] || "内容确认";
  };

  if (activeTaskType === "content") {
    return <ContentReviewWorkbench onClose={() => setActiveTaskType(null)} />;
  }
  if (activeTaskType === "assets") {
    return <ShootingAndUploadWorkbench onClose={() => setActiveTaskType(null)} />;
  }
  if (activeTaskType === "publish") {
    return <PublishExceptionWorkbench onClose={() => setActiveTaskType(null)} />;
  }
  if (activeTaskType === "interaction") {
    return <InteractionWorkbench onClose={() => setActiveTaskType(null)} />;
  }

  const focusNoteIsBlocker = focusNote && (focusNote.currentIssue?.type === "blocker" || focusNote.publishStatus === "发布异常");
  const focusNoteIsWarning = focusNote && (focusNote.currentIssue?.type === "warning" || focusNote.contentStatus === "待确认" || focusNote.materialStatus === "待验收");

  return (
    <div className="h-full w-full bg-[#f8f9fa] p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[24px] font-extrabold text-neutral-900 mb-1">执行中心</h1>
            <p className="text-[13px] text-neutral-500">集中处理各项目中需要你确认、验收或介入的事项。</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 bg-white border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors">
               <Filter size={16} />
             </button>
             <button className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors">
               刷新
             </button>
          </div>
        </div>

        {actionableNotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-neutral-200 shadow-2xs text-center flex flex-col items-center">
            <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
            <h2 className="text-[18px] font-bold text-neutral-900 mb-2">当前没有需要你处理的事项</h2>
            <p className="text-[13px] text-neutral-500 max-w-md">系统会继续推进可自动完成的任务，出现需要确认或介入的情况时会在这里提醒你。</p>
          </div>
        ) : (
          <>
            {/* Focus Card */}
            {focusNote && (
              <div className="mb-8">
                <h2 className="text-[16px] font-bold text-neutral-900 mb-4">现在处理</h2>
                <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-neutral-500">{getCategoryTitle(getCategoryFromNote(focusNote))}</span>
                    </div>
                    {focusNoteIsBlocker ? (
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px] font-bold">阻断</span>
                    ) : focusNoteIsWarning ? (
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[11px] font-bold">待确认</span>
                    ) : (
                      <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[11px] font-bold">待处理</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex-1 pr-6">
                      <h3 className="text-[20px] font-extrabold text-neutral-900 mb-1">{focusNote.currentIssue?.message || focusNote.title}</h3>
                      <div className="text-[13px] text-neutral-500 mb-3">{focusNote.projectName}</div>
                      <p className="text-[14px] text-neutral-800 font-medium">
                        {focusNote.currentIssue?.impactScope || (focusNote.publishStatus === '发布异常' ? '已影响笔记排期，建议先确认发布方式。' : '需要你的介入以继续推进。')}
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTaskType(getCategoryFromNote(focusNote))}
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[14px] font-bold transition-colors shrink-0"
                    >
                      立即处理
                    </button>
                  </div>
                  <div className="mt-5 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
                    排序依据：阻断执行 ＞ 今日到期 ＞ 影响范围 ＞ 等待时长
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 4 Category Inbox Grid */}
        <div>
          <h2 className="text-[16px] font-bold text-neutral-900 mb-4">全部待办</h2>
          <div className="grid grid-cols-2 gap-4">
          {taskCategories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setActiveTaskType(cat.id)}
              className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs hover:border-neutral-400 transition-all cursor-pointer flex flex-col justify-between group h-[160px]"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <cat.icon size={18} className="text-neutral-700" />
                    <h3 className="text-[15px] font-bold text-neutral-900">{cat.title}</h3>
                  </div>
                  <div className="text-[18px] font-extrabold text-neutral-900 leading-none">
                    {cat.pendingCount} <span className="text-[12px] font-normal text-neutral-500">项</span>
                  </div>
                </div>
                
                {cat.pendingCount > 0 ? (
                  <div>
                    <div className="text-[13px] font-bold text-neutral-800 line-clamp-1 mb-1">
                      {cat.topIssue}
                    </div>
                    <div className="text-[12px] text-neutral-500 line-clamp-1">
                      {cat.impactDesc}
                    </div>
                  </div>
                ) : (
                  <div className="text-[13px] text-neutral-400 flex items-center gap-1.5 mt-2">
                    <CheckCircle2 size={14} /> 暂无待处理事项
                  </div>
                )}
              </div>

              <div className="text-[12px] font-bold text-neutral-500 group-hover:text-neutral-900 flex items-center gap-1 transition-colors">
                查看全部 <ChevronRight size={14} />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
