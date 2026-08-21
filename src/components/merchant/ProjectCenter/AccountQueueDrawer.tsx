import React from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Smartphone, ArrowRight, ExternalLink } from "lucide-react";
import { Note } from "../../../data/projectStore";
import { getUnifiedBusinessStatus, getStatusStyleClass } from "../../../utils/noteStatus";

interface AccountQueueDrawerProps {
  accountName: string;
  accountType: string;
  persona: string;
  notes: Note[];
  onClose: () => void;
  onSelectNote: (note: Note) => void;
  onOpenExecutionCenter?: () => void;
}

export function AccountQueueDrawer({
  accountName,
  accountType,
  persona,
  notes,
  onClose,
  onSelectNote,
  onOpenExecutionCenter,
}: AccountQueueDrawerProps) {
  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div 
        className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-[560px] bg-surface-1 h-full shadow-2xl flex flex-col z-10 border-l border-border-default"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default bg-surface-1 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-text-main">
                账号发布队列
              </h2>
              <span className="px-2 py-0.5 bg-surface-subtle border border-border-default text-text-secondary text-[11px] font-normal rounded">
                {accountType}
              </span>
            </div>
            <div className="text-[13px] font-medium text-text-main mt-1 flex items-center gap-2">
              {accountName}
              <span className="text-[11.5px] font-normal text-text-tertiary">· {persona}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-tertiary hover:text-text-main rounded-xl hover:bg-hover-bg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-[12.5px] text-text-tertiary px-1">
            <span>共规划 {notes.length} 篇发布任务</span>
            <span>按排期时间排序</span>
          </div>

          <div className="space-y-3">
            {notes.map((note, index) => {
              const uStatus = getUnifiedBusinessStatus(note);
              const style = getStatusStyleClass(uStatus);
              const hasRedNoteId = !!note.publishLink || uStatus === "观察中" || uStatus === "观察完成";

              return (
                <div
                  key={note.id || index}
                  className="bg-surface-1 rounded-xl p-4 border border-border-default hover:border-border-strong transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11.5px] font-medium text-text-tertiary tabular-nums">#{index + 1}</span>
                        <h4 className="text-[13.5px] font-semibold text-text-main truncate">
                          {note.title || note.contentDirection || "未命名任务"}
                        </h4>
                      </div>
                      <div className="text-[11.5px] text-text-tertiary flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          计划发布: {note.plannedDate || "排期中"}
                        </span>
                        <span>{note.type}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[11.5px] font-medium border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                      {uStatus}
                    </span>
                  </div>

                  {/* Fact line */}
                  <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-default text-[12px] flex items-center justify-between text-text-secondary">
                    <div className="flex items-center gap-4">
                      <span>
                        小红书笔记ID: {hasRedNoteId ? "已回传并建立观察" : "等待外部发布与识别"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectNote(note)}
                        className="px-2.5 py-1 bg-surface-1 border border-border-default rounded-md text-[11.5px] font-medium text-text-secondary hover:bg-hover-bg transition-colors"
                      >
                        详情
                      </button>
                      {uStatus === "异常" && onOpenExecutionCenter && (
                        <button
                          onClick={onOpenExecutionCenter}
                          className="px-2.5 py-1 bg-btn-main text-white rounded-md text-[11.5px] font-medium hover:bg-btn-main-hover transition-colors"
                        >
                          去处理
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-surface-1 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-btn-main text-white font-medium text-[13px] rounded-lg hover:bg-btn-main-hover transition-colors"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
}
