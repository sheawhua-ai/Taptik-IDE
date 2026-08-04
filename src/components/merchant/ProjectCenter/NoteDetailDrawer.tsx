import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, FileText, Image as ImageIcon, Calendar, Tag, History, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { Note } from "../../../data/projectStore";

interface NoteDetailDrawerProps {
  note: Note | null;
  onClose: () => void;
  onActionClick: (note: Note) => void;
  onOpenInExecutionCenter: (note: Note) => void;
}

export function NoteDetailDrawer({ note, onClose, onActionClick, onOpenInExecutionCenter }: NoteDetailDrawerProps) {
  if (!note) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-[540px] bg-white h-full shadow-2xl flex flex-col relative z-10 border-l border-neutral-200"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex justify-between items-start bg-neutral-50 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  note.type === "KOC" ? "bg-purple-100 text-purple-700" :
                  note.type === "店长号/KOS" ? "bg-blue-100 text-blue-700" : "bg-neutral-800 text-white"
                }`}>
                  {note.type}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  note.publishStatus === "已发布" ? "bg-emerald-100 text-emerald-700" :
                  note.publishStatus === "发布异常" ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-700"
                }`}>
                  {note.publishStatus}
                </span>
              </div>
              <h2 className="text-[18px] font-bold text-neutral-900 leading-snug">{note.title || "未命名笔记"}</h2>
              <p className="text-[12px] text-neutral-500 mt-1">参与者/账号：<span className="font-bold text-neutral-800">{note.participant}</span></p>
            </div>
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body Scroll area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Current Issue Notice if present */}
            {note.currentIssue && (
              <div className={`p-4 rounded-xl border ${
                note.currentIssue.type === "blocker" ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"
              }`}>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-bold mb-1">当前阻断/提醒</div>
                    <div className="text-[12px] leading-relaxed mb-2">{note.currentIssue.message}</div>
                    <div className="text-[11px] font-semibold opacity-80">影响范围：{note.currentIssue.impactScope}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Package */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <FileText size={16} className="text-neutral-600" /> 内容稿件
                </h3>
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  note.contentStatus === "已确认" ? "bg-emerald-100 text-emerald-700" :
                  note.contentStatus === "待确认" ? "bg-amber-100 text-amber-700" : "bg-neutral-200 text-neutral-600"
                }`}>
                  {note.contentStatus}
                </span>
              </div>
              {note.contentPackage ? (
                <div className="space-y-3 text-[13px]">
                  <div className="font-bold text-neutral-900">{note.contentPackage.title}</div>
                  <div className="text-neutral-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-neutral-200 max-h-[160px] overflow-y-auto">
                    {note.contentPackage.body}
                  </div>
                  {note.contentPackage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {note.contentPackage.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[13px] text-neutral-400 py-3 text-center">暂未生成稿件</div>
              )}
            </div>

            {/* Smart Image Matching (AI Recommendation) */}
            {(note.contentStatus === "待确认" || note.contentStatus === "已确认") && (
              <div className="bg-white rounded-xl p-4 border border-primary-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                    <ImageIcon size={16} className="text-primary-600" /> 智能配图建议
                  </h3>
                  <button className="text-[12px] text-primary-600 font-bold bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors">
                    重新扫描素材中心
                  </button>
                </div>
                <div className="space-y-4">
                   <div>
                     <h4 className="text-[12px] font-semibold text-neutral-500 mb-2">强烈推荐 (匹配度 &gt; 90%)</h4>
                     <div className="grid grid-cols-4 gap-2">
                       <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center text-[10px] text-neutral-400 border border-neutral-200">
                         [素材封面]
                       </div>
                       <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center text-[10px] text-neutral-400 border border-neutral-200">
                         [素材封面]
                       </div>
                     </div>
                   </div>
                   <div>
                     <h4 className="text-[12px] font-semibold text-neutral-500 mb-2">其他可选</h4>
                     <div className="grid grid-cols-4 gap-2">
                       <div className="aspect-square bg-neutral-50 rounded-lg flex items-center justify-center text-[10px] text-neutral-400 border border-neutral-100 border-dashed">
                         暂无更多
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* Material & Material Task */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-neutral-600" /> 素材及回传
                </h3>
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  note.materialStatus === "已齐" ? "bg-emerald-100 text-emerald-700" :
                  note.materialStatus === "待验收" ? "bg-blue-100 text-blue-700" : "bg-neutral-200 text-neutral-600"
                }`}>
                  {note.materialStatus}
                </span>
              </div>
              {note.materialTask ? (
                <div className="space-y-3 text-[13px]">
                  <p className="text-neutral-600"><span className="font-bold text-neutral-800">素材要求：</span>{note.materialTask.reqs}</p>
                  {note.materialTask.returnedUrls && note.materialTask.returnedUrls.length > 0 ? (
                    <div>
                      <div className="text-[12px] font-bold text-neutral-700 mb-2">已回传素材：</div>
                      <div className="flex gap-2">
                        {note.materialTask.returnedUrls.map((url, idx) => (
                          <img key={idx} src={url} alt="material" className="w-20 h-20 object-cover rounded-lg border border-neutral-200 shadow-xs" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[12px] text-neutral-400">尚无回传素材</p>
                  )}
                </div>
              ) : (
                <p className="text-[13px] text-neutral-400 py-2">无需单独收集素材或尚未开始需求提取</p>
              )}
            </div>

            {/* Publish Info */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5 mb-3">
                <Calendar size={16} className="text-neutral-600" /> 发布安排
              </h3>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <span className="text-neutral-500 text-[11px]">计划发布日期</span>
                  <div className="font-bold text-neutral-800 mt-0.5">{note.plannedDate}</div>
                </div>
                <div>
                  <span className="text-neutral-500 text-[11px]">实际发布时间</span>
                  <div className="font-bold text-neutral-800 mt-0.5">{note.publishTime || "-"}</div>
                </div>
                {note.publishLink && (
                  <div className="col-span-2 pt-2 border-t border-neutral-200">
                    <span className="text-neutral-500 text-[11px]">笔记链接</span>
                    <a href={note.publishLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary-600 font-bold hover:underline mt-0.5 truncate">
                      {note.publishLink} <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Data Snapshot */}
            {note.metrics && (
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[14px] font-bold text-neutral-900">数据快照</h3>
                  <span className="text-[11px] text-neutral-400">更新于 {note.metrics.lastUpdated}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div className="text-[11px] text-neutral-500">点赞</div>
                    <div className="text-[16px] font-bold text-neutral-900">{note.metrics.likes}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div className="text-[11px] text-neutral-500">收藏</div>
                    <div className="text-[16px] font-bold text-neutral-900">{note.metrics.collects}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div className="text-[11px] text-neutral-500">评论</div>
                    <div className="text-[16px] font-bold text-neutral-900">{note.metrics.comments}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div className="text-[11px] text-neutral-500">转发</div>
                    <div className="text-[16px] font-bold text-neutral-900">{note.metrics.shares}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div className="text-[11px] text-neutral-500">浏览量</div>
                    <div className="text-[16px] font-bold text-neutral-900">{note.metrics.views ?? "暂无数据"}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div className="text-[11px] text-neutral-500">高意向咨询</div>
                    <div className="text-[16px] font-bold text-primary-600">{note.metrics.highIntentComments}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Note Logs */}
            {note.logs && note.logs.length > 0 && (
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5 mb-3">
                  <History size={16} className="text-neutral-600" /> 操作记录
                </h3>
                <div className="space-y-2">
                  {note.logs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[12px] bg-white p-2.5 rounded-lg border border-neutral-200">
                      <span className="font-bold text-neutral-800">{log.action} ({log.operator})</span>
                      <span className="text-neutral-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Action Bar - strictly MAX ONE dark primary button */}
          <div className="p-4 border-t border-neutral-200 bg-white shrink-0 flex items-center justify-between">
            <button
              onClick={() => onOpenInExecutionCenter(note)}
              className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              在执行中心查看 &rarr;
            </button>

            <button
              onClick={() => onActionClick(note)}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-lg shadow-sm transition-all"
            >
              {note.contentStatus === "待确认" ? "确认内容" :
               note.materialStatus === "待验收" ? "验收素材" :
               note.publishStatus === "发布异常" ? "处理发布异常" :
               note.publishStatus === "待发布" ? "安排发布" : "查看详情/下一步"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
