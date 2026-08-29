import React, { useState } from "react";
import { X, Check, FileText, PlusCircle, CheckCircle2, Sparkles, BookOpen, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { SuggestedAction } from "./types";

interface ApplyNoteModalProps {
  action: SuggestedAction | null;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetType: "next_batch" | "specific_draft", targetNoteTitle: string) => void;
}

export function ApplyNoteModal({
  action,
  projectName,
  isOpen,
  onClose,
  onConfirm,
}: ApplyNoteModalProps) {
  const [targetType, setTargetType] = useState<"next_batch" | "specific_draft">("next_batch");
  const [selectedDraftId, setSelectedDraftId] = useState("draft-1");

  if (!isOpen || !action) return null;

  // Unreleased draft notes only (no published notes allowed)
  const unreleasedDraftNotes = [
    { id: "draft-1", title: "《幼犬换粮实测篇·3天便便对比》", status: "草稿中", author: "张店长" },
    { id: "draft-2", title: "《新手铲屎官必看：低温烘焙粮排雷指南》", status: "待审核", author: "小红书矩阵号" },
    { id: "draft-3", title: "《换粮期狗狗食欲差？3招调理好肠胃》", status: "草稿中", author: "三亚店长" },
  ];

  const handleConfirm = () => {
    const chosenTitle =
      targetType === "next_batch"
        ? "后续笔记"
        : unreleasedDraftNotes.find((d) => d.id === selectedDraftId)?.title || "指定待发布笔记";
    onConfirm(targetType, chosenTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans text-text-main">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-2xl shadow-dialog border border-border-default w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[13px] font-bold rounded">
              应用到后续笔记
            </span>
            <h3 className="text-[15px] font-semibold text-text-main truncate max-w-[300px]">
              {action.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-[13px] overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* 建议依据 */}
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-1.5">
            <span className="font-semibold text-text-main block">建议依据</span>
            <p className="text-text-secondary leading-relaxed">{action.reason}</p>
          </div>

          {/* 预期收益 */}
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-1">
            <span className="font-semibold text-btn-main text-[13px] block">预期内容提升与收益</span>
            <p className="text-text-main font-medium">{action.expectedGain}</p>
          </div>

          {/* 建议落地方式 */}
          <div className="space-y-2">
            <span className="font-semibold text-text-main block">建议落地方式</span>
            <div className="space-y-1.5">
              {action.recommendedSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-surface-1 rounded-lg border border-border-default flex items-center gap-2.5 text-text-secondary"
                >
                  <span className="w-4 h-4 rounded-full bg-btn-main text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 选项：后续生成新笔记使用 / 应用到某篇未发布的待发笔记 */}
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <label className="font-semibold text-text-main block">应用范围：</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                onClick={() => setTargetType("next_batch")}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between space-y-1 transition-all ${
                  targetType === "next_batch"
                    ? "bg-surface-subtle border-btn-main ring-1 ring-btn-main/20"
                    : "bg-surface-1 border-border-default hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-main flex items-center gap-1.5">
                    <PlusCircle size={14} className="text-btn-main" />
                    <span>后续生成新笔记使用</span>
                  </span>
                  <input
                    type="radio"
                    name="noteTarget"
                    checked={targetType === "next_batch"}
                    onChange={() => setTargetType("next_batch")}
                    className="accent-btn-main"
                  />
                </div>
                <span className="text-[13px] text-text-tertiary">
                  作为选题规范与生成提示词自动注入后续所有笔记
                </span>
              </label>

              <label
                onClick={() => setTargetType("specific_draft")}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between space-y-1 transition-all ${
                  targetType === "specific_draft"
                    ? "bg-surface-subtle border-btn-main ring-1 ring-btn-main/20"
                    : "bg-surface-1 border-border-default hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-main flex items-center gap-1.5">
                    <FileText size={14} className="text-btn-main" />
                    <span>应用到未发布待发笔记</span>
                  </span>
                  <input
                    type="radio"
                    name="noteTarget"
                    checked={targetType === "specific_draft"}
                    onChange={() => setTargetType("specific_draft")}
                    className="accent-btn-main"
                  />
                </div>
                <span className="text-[13px] text-text-tertiary">
                  指定给某篇草稿或待发笔记，进行直接优化
                </span>
              </label>
            </div>

            {targetType === "specific_draft" && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[13px] text-text-tertiary block">
                  选择待发笔记（已发布笔记不支持修改）：
                </span>
                <select
                  value={selectedDraftId}
                  onChange={(e) => setSelectedDraftId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-1 border border-border-default rounded-xl text-[13px] text-text-main outline-none focus:border-btn-main transition-colors"
                >
                  {unreleasedDraftNotes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} · {d.status} ({d.author})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default flex items-center justify-end gap-2 bg-surface-subtle">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg rounded-xl transition-colors border border-border-default bg-surface-1"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-[13px] font-medium rounded-xl transition-colors flex items-center gap-1.5 bg-btn-main text-white hover:bg-btn-main-hover shadow-2xs"
          >
            <Check size={13} />
            <span>确认应用建议</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
