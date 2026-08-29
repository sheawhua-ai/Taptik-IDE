import React, { useState } from "react";
import { X, Check, ArrowRight, Target, Sparkles, FolderPlus, Layers, PlusCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { SuggestedAction } from "./types";

interface ApplyPlanModalProps {
  action: SuggestedAction | null;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetType: "new_plan" | "existing_plan", targetPlanName: string) => void;
}

export function ApplyPlanModal({
  action,
  projectName,
  isOpen,
  onClose,
  onConfirm,
}: ApplyPlanModalProps) {
  const [targetType, setTargetType] = useState<"new_plan" | "existing_plan">("new_plan");
  const [existingPlanId, setExistingPlanId] = useState("plan-1");

  if (!isOpen || !action) return null;

  const existingPlans = [
    { id: "plan-1", name: "下月门店常态化运营计划 (2026-09)", stage: "待执行" },
    { id: "plan-2", name: "秋季宠粮品类营销专项方案", stage: "草稿中" },
    { id: "plan-3", name: "门店客服接待与私信SOP升级计划", stage: "待执行" },
  ];

  const handleConfirm = () => {
    const chosenPlanName =
      targetType === "new_plan"
        ? "下一期方案"
        : existingPlans.find((p) => p.id === existingPlanId)?.name || "指定已有方案";
    onConfirm(targetType, chosenPlanName);
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
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[13px] font-bold rounded">
              纳入项目方案
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

          {/* 预期影响 */}
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-1">
            <span className="font-semibold text-btn-main text-[13px] block">预期影响与收益</span>
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

          {/* 应用到：当前项目新方案 / 已有方案 */}
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <label className="font-semibold text-text-main block">应用到：</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                onClick={() => setTargetType("new_plan")}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between space-y-1 transition-all ${
                  targetType === "new_plan"
                    ? "bg-surface-subtle border-btn-main ring-1 ring-btn-main/20"
                    : "bg-surface-1 border-border-default hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-main flex items-center gap-1.5">
                    <PlusCircle size={14} className="text-btn-main" />
                    <span>创建当前项目新方案</span>
                  </span>
                  <input
                    type="radio"
                    name="planTarget"
                    checked={targetType === "new_plan"}
                    onChange={() => setTargetType("new_plan")}
                    className="accent-btn-main"
                  />
                </div>
                <span className="text-[13px] text-text-tertiary">
                  自动将该建议沉淀并创建为下一期执行方案
                </span>
              </label>

              <label
                onClick={() => setTargetType("existing_plan")}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between space-y-1 transition-all ${
                  targetType === "existing_plan"
                    ? "bg-surface-subtle border-btn-main ring-1 ring-btn-main/20"
                    : "bg-surface-1 border-border-default hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-main flex items-center gap-1.5">
                    <FolderPlus size={14} className="text-btn-main" />
                    <span>纳入已有方案</span>
                  </span>
                  <input
                    type="radio"
                    name="planTarget"
                    checked={targetType === "existing_plan"}
                    onChange={() => setTargetType("existing_plan")}
                    className="accent-btn-main"
                  />
                </div>
                <span className="text-[13px] text-text-tertiary">
                  追加至当前项目已规划的在编方案
                </span>
              </label>
            </div>

            {targetType === "existing_plan" && (
              <div className="pt-2">
                <select
                  value={existingPlanId}
                  onChange={(e) => setExistingPlanId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-1 border border-border-default rounded-xl text-[13px] text-text-main outline-none focus:border-btn-main transition-colors"
                >
                  {existingPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.stage})
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
            <span>确认纳入方案</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
