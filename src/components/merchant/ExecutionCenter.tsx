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
  const [selectedTaskNote, setSelectedTaskNote] = useState<Note | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

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
      topIssue: pendingContentNotes.find((n) => n.currentIssue)?.currentIssue?.message || "涉及需核查文案事实"
    },
    {
      id: "assets",
      title: "素材与回传",
      icon: ImageIcon,
      pendingCount: pendingAssetNotes.length,
      notes: pendingAssetNotes,
      topIssue: pendingAssetNotes.find((n) => n.currentIssue)?.currentIssue?.message || "等待操盘手验收回传素材"
    },
    {
      id: "publish",
      title: "发布任务与异常",
      icon: Send,
      pendingCount: pendingPublishNotes.length,
      notes: pendingPublishNotes,
      topIssue: pendingPublishNotes.find((n) => n.currentIssue)?.currentIssue?.message || "待确认发布调度节点"
    },
    {
      id: "interaction",
      title: "互动与线索跟进",
      icon: MessageSquare,
      pendingCount: pendingInteractionNotes.length,
      notes: pendingInteractionNotes,
      topIssue: "包含未回复的高意向咨询与私信引流"
    }
  ];

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

  return (
    <div className="h-full w-full bg-[#f8f9fa] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-[24px] font-extrabold text-neutral-900 mb-1">执行中心</h1>
          <p className="text-[13px] text-neutral-500">跨项目行动收件箱，仅展示当前需要操盘手处理的真正事项（数据与项目中心同步）</p>
        </div>

        {/* 4 Category Inbox Grid */}
        <div className="grid grid-cols-2 gap-6">
          {taskCategories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setActiveTaskType(cat.id)}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs hover:shadow-md hover:border-neutral-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <cat.icon size={22} className="text-neutral-800 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-right">
                    <div className="text-[32px] font-extrabold text-neutral-900 leading-none mb-1">{cat.pendingCount}</div>
                    <div className="text-[12px] text-neutral-400 font-semibold">待处理事项</div>
                  </div>
                </div>

                <h2 className="text-[18px] font-bold text-neutral-900 mb-3">{cat.title}</h2>

                {cat.pendingCount > 0 ? (
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-amber-900 text-[12px] flex items-start gap-2 mb-4 font-medium">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <span className="line-clamp-2">{cat.topIssue}</span>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[12px] flex items-center gap-1.5 mb-4 font-medium">
                    <CheckCircle2 size={14} className="text-emerald-600" /> 暂无待处理事项
                  </div>
                )}
              </div>

              <button className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-2">
                进入工作台处理 <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Cross-Project Urgent Action List Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h2 className="text-[16px] font-bold text-neutral-900">跨项目紧急事项清单</h2>
              <p className="text-[12px] text-neutral-500">点击项目或卡片直接调起对口处理工具，处理完成后自动双向闭环</p>
            </div>

            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索原项目/笔记..." 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg text-[12px] border border-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 text-[12px]">
                <th className="p-3.5 font-bold">所属原项目</th>
                <th className="p-3.5 font-bold">批次</th>
                <th className="p-3.5 font-bold">笔记标题</th>
                <th className="p-3.5 font-bold">参与者/类型</th>
                <th className="p-3.5 font-bold">待办事项</th>
                <th className="p-3.5 font-bold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allNotes
                .filter((n) => n.currentIssue || n.contentStatus === "待确认" || n.materialStatus === "待验收" || n.publishStatus === "发布异常")
                .filter((n) => !searchFilter || n.projectName.includes(searchFilter) || n.title.includes(searchFilter))
                .map((note) => (
                  <tr key={note.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3.5 font-bold text-neutral-900">{note.projectName}</td>
                    <td className="p-3.5 text-neutral-600 font-medium">{note.batchName}</td>
                    <td className="p-3.5 font-bold text-neutral-800">{note.title}</td>
                    <td className="p-3.5 text-neutral-600">
                      <div>{note.participant}</div>
                      <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-bold">{note.type}</span>
                    </td>
                    <td className="p-3.5">
                      {note.currentIssue ? (
                        <span className="text-red-700 font-bold text-[12px] bg-red-50 px-2 py-1 rounded">
                          {note.currentIssue.message}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold text-[12px] bg-amber-50 px-2 py-1 rounded">
                          {note.contentStatus === "待确认" ? "内容等待确认" :
                           note.materialStatus === "待验收" ? "素材等待验收" : "等待发布调度"}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          if (note.contentStatus === "待确认" || note.currentIssue?.targetWorkbench === "content") setActiveTaskType("content");
                          else if (note.materialStatus === "待验收" || note.currentIssue?.targetWorkbench === "assets") setActiveTaskType("assets");
                          else if (note.publishStatus === "发布异常" || note.currentIssue?.targetWorkbench === "publish") setActiveTaskType("publish");
                          else setActiveTaskType("content");
                        }}
                        className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12px] rounded-lg transition-colors"
                      >
                        {note.currentIssue?.nextStepActionText || "去处理"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
