import React from "react";
import { History, Clock, CheckCircle2, User, ChevronRight, RotateCcw, FileText } from "lucide-react";
import { ReviewTask, ReviewHistoryVersion } from "./types";

interface ReviewHistoryTabProps {
  task: ReviewTask;
  onSwitchVersion: (versionId: string) => void;
}

export function ReviewHistoryTab({ task, onSwitchVersion }: ReviewHistoryTabProps) {
  const { historyVersions, activeVersionId } = task;

  return (
    <div className="space-y-6 pb-12 font-sans text-text-main">
      <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-5">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-text-main">版本流转与历史记录</h3>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              记录每次重新分析、操盘手编辑与执行确认的版本快照，支持随时回看与版本比对
            </p>
          </div>
          <span className="text-[13px] text-text-tertiary">
            累计 {historyVersions.length} 个版本记录
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
          {historyVersions.map((ver, idx) => {
            const isActive = ver.id === activeVersionId;
            return (
              <div key={ver.id} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-btn-main border-btn-main text-white"
                      : "bg-surface-1 border-border-strong text-text-disabled group-hover:border-btn-main"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Card */}
                <div
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isActive
                      ? "bg-surface-subtle border-border-strong shadow-xs"
                      : "bg-surface-1 border-border-default hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-text-main">{ver.versionName}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[13px] font-medium rounded ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-text-tertiary border border-neutral-200"
                        }`}
                      >
                        {ver.versionTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {ver.createdAt}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {ver.createdBy}
                      </span>
                    </div>
                  </div>

                  <p className="text-[13px] text-text-secondary leading-relaxed bg-surface-1 p-3 rounded-lg border border-border-subtle">
                    {ver.summarySnapshot}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[13px]">
                    <span className="text-text-tertiary">
                      <strong className="text-text-secondary">数据截至时间：</strong> {ver.dataCutoff}
                    </span>

                    {!isActive && (
                      <button
                        onClick={() => onSwitchVersion(ver.id)}
                        className="px-2.5 py-1 text-btn-main hover:bg-hover-bg rounded-md font-medium flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw size={12} />
                        <span>切换至该版本</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
