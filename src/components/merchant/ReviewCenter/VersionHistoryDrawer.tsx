import React from "react";
import { X, History, Clock, User, RotateCcw, CheckCircle2, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewTask, ReviewHistoryVersion } from "./types";

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: ReviewTask;
  onSwitchVersion: (versionId: string) => void;
}

export function VersionHistoryDrawer({
  isOpen,
  onClose,
  task,
  onSwitchVersion,
}: VersionHistoryDrawerProps) {
  const { historyVersions, activeVersionId } = task;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans text-text-main">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-surface-1 border-l border-border-default shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-btn-main">
                    <History size={16} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-text-main">版本历史快照</h3>
                    <p className="text-[13px] text-text-tertiary">
                      共 {historyVersions.length} 个历史生成与调整版本
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Version List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-surface-subtle">
                <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
                  {historyVersions.map((ver) => {
                    const isActive = ver.id === activeVersionId;
                    return (
                      <div key={ver.id} className="relative group">
                        {/* Dot */}
                        <div
                          className={`absolute -left-5 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-btn-main border-btn-main"
                              : "bg-surface-1 border-border-strong group-hover:border-btn-main"
                          }`}
                        >
                          <div className="w-1 h-1 rounded-full bg-white" />
                        </div>

                        {/* Card */}
                        <div
                          className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                            isActive
                              ? "bg-surface-1 border-btn-main shadow-xs"
                              : "bg-surface-1 border-border-default hover:border-border-strong"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13.5px] font-bold text-text-main">
                                {ver.versionName}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 text-[13px] font-bold rounded ${
                                  isActive
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-neutral-100 text-text-tertiary border border-neutral-200"
                                }`}
                              >
                                {ver.versionTag}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[13px] text-text-tertiary">
                              <Clock size={11} />
                              <span>{ver.createdAt}</span>
                            </div>
                          </div>

                          <p className="text-[13px] text-text-secondary leading-relaxed bg-surface-subtle p-2.5 rounded-lg border border-border-subtle">
                            {ver.summarySnapshot}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[13px]">
                            <span className="text-text-tertiary">
                              由 <strong className="text-text-secondary">{ver.createdBy}</strong> 生成
                            </span>

                            {isActive ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                <span>当前生效版本</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  onSwitchVersion(ver.id);
                                  onClose();
                                }}
                                className="px-2 py-1 text-btn-main hover:bg-hover-bg rounded-md font-medium flex items-center gap-1 transition-colors border border-border-default bg-surface-1"
                              >
                                <RotateCcw size={11} />
                                <span>恢复此版本</span>
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
              <div className="p-4 border-t border-border-default bg-surface-1 flex items-center justify-between text-[13px] text-text-tertiary">
                <span>点击“恢复此版本”可即时回滚报告数据</span>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-hover-bg text-text-main font-medium border border-border-default"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
