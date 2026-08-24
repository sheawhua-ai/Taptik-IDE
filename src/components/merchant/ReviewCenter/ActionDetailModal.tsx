import React from "react";
import { X, Check, Plus, ArrowRight, Target, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { SuggestedAction } from "./types";

interface ActionDetailModalProps {
  action: SuggestedAction | null;
  onClose: () => void;
  onToggleSync: (actionId: string) => void;
}

export function ActionDetailModal({ action, onClose, onToggleSync }: ActionDetailModalProps) {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans text-text-main">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-2xl shadow-dialog border border-border-default w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                action.priority === "P0"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {action.priority} 优先级
            </span>
            <span className="text-[14.5px] font-semibold text-text-main truncate max-w-[280px]">
              {action.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[12.5px] overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-1.5">
            <span className="font-semibold text-text-main block">动作目标</span>
            <p className="text-text-secondary leading-relaxed">{action.target}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-subtle rounded-xl border border-border-default">
              <span className="font-semibold text-btn-main text-[11.5px] block mb-1">预计收益</span>
              <span className="font-medium text-text-main">{action.expectedGain}</span>
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-border-default">
              <span className="font-semibold text-text-tertiary text-[11.5px] block mb-1">策略归类</span>
              <span className="font-medium text-text-main">{action.category}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-text-main block">推导归因理由</span>
            <p className="text-text-secondary leading-relaxed p-3 bg-surface-subtle rounded-xl border border-border-default">
              {action.reason}
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-text-main block">落地执行 SOP 步骤</span>
            <div className="space-y-1.5">
              {action.recommendedSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-surface-1 rounded-lg border border-border-default flex items-center gap-2.5 text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-btn-main text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border-default flex items-center justify-between bg-surface-subtle">
          <div className="text-[12px] text-text-tertiary">
            {action.inExecutionCenter ? "✅ 已同步至执行中心待办队列" : "尚未同步至执行中心"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[12.5px] font-medium text-text-secondary hover:bg-hover-bg rounded-xl transition-colors border border-border-default bg-surface-1"
            >
              关闭
            </button>
            <button
              onClick={() => {
                onToggleSync(action.id);
                onClose();
              }}
              className={`px-4 py-2 text-[12.5px] font-medium rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs ${
                action.inExecutionCenter
                  ? "bg-surface-1 border border-border-default text-text-secondary hover:bg-hover-bg"
                  : "bg-btn-main text-white hover:bg-btn-main-hover"
              }`}
            >
              {action.inExecutionCenter ? (
                <>
                  <Check size={13} />
                  <span>移出执行中心</span>
                </>
              ) : (
                <>
                  <Plus size={13} />
                  <span>一键加入执行中心</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
