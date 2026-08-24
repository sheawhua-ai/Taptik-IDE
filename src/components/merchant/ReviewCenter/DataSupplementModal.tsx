import React, { useState } from "react";
import { X, ShieldAlert, RefreshCw, CheckCircle2, Upload, Link2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface DataSupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DataSupplementModal({ isOpen, onClose, onSuccess }: DataSupplementModalProps) {
  const [method, setMethod] = useState<"reauth" | "manual">("reauth");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFix = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans text-text-main">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-2xl shadow-dialog border border-border-default w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-600" />
            <h3 className="text-[15px] font-semibold text-text-main">解决数据同步阻断</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[12.5px]">
          <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 leading-relaxed">
            <span className="font-semibold block mb-0.5">检测到异常：青岛万象城体验店授权失效</span>
            小红书专业号接口返回 Token Expired (401)，导致近 15 天评论与私信互动明细无法拉取。
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-text-main">选择修复方案：</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod("reauth")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  method === "reauth"
                    ? "bg-surface-1 border-btn-main ring-1 ring-btn-main shadow-xs"
                    : "bg-surface-subtle border-border-default"
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-text-main mb-1">
                  <Link2 size={14} className="text-btn-main" />
                  <span>一键刷新授权</span>
                </div>
                <p className="text-[11.5px] text-text-tertiary">快速换取新令牌并自动重试</p>
              </button>

              <button
                type="button"
                onClick={() => setMethod("manual")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  method === "manual"
                    ? "bg-surface-1 border-btn-main ring-1 ring-btn-main shadow-xs"
                    : "bg-surface-subtle border-border-default"
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-text-main mb-1">
                  <Upload size={14} className="text-btn-main" />
                  <span>上传 Excel 补齐</span>
                </div>
                <p className="text-[11.5px] text-text-tertiary">导入线下导出的数据表</p>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border-default flex items-center justify-end gap-2 bg-surface-subtle">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[12.5px] font-medium text-text-secondary hover:bg-hover-bg rounded-xl transition-colors border border-border-default bg-surface-1"
          >
            稍后处理
          </button>
          <button
            onClick={handleFix}
            disabled={isSubmitting}
            className="px-4 py-2 text-[12.5px] font-medium text-white bg-btn-main hover:bg-btn-main-hover rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>正在恢复同步...</span>
              </>
            ) : (
              <span>立即修复并重新分析</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
