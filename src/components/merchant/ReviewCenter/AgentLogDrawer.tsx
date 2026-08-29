import React from "react";
import { X, Sparkles, Terminal, CheckCircle2, Clock, AlertTriangle, RefreshCw, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentPipelineNode } from "./types";

interface AgentLogDrawerProps {
  agent: AgentPipelineNode | null;
  onClose: () => void;
}

export function AgentLogDrawer({ agent, onClose }: AgentLogDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!agent) return null;

  const handleCopyLogs = () => {
    const text = agent.logs.map(l => `[${l.time}] [${l.level.toUpperCase()}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-lg bg-surface-1 h-full shadow-2xl border-l border-border-default flex flex-col font-sans text-text-main"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-btn-main font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-text-main">{agent.name}</h3>
                <span className="px-1.5 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[13px] rounded">
                  {agent.role}
                </span>
              </div>
              <p className="text-[13px] text-text-tertiary mt-0.5">执行用时: {agent.duration}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Status & Summary */}
          <div className="p-4 bg-surface-subtle rounded-xl border border-border-default space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text-tertiary">节点执行状态</span>
              <span
                className={`px-2 py-0.5 text-[13px] font-medium rounded-md border ${
                  agent.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : agent.status === "running"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {agent.statusText}
              </span>
            </div>
            <p className="text-[13px] text-text-main leading-relaxed">{agent.summary}</p>
          </div>

          {/* Anomaly Notice if any */}
          {agent.anomalyNotice && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-[13px] text-red-800 space-y-1">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-600" />
                异常提示
              </span>
              <p>{agent.anomalyNotice}</p>
            </div>
          )}

          {/* Output artifacts */}
          <div className="space-y-2.5">
            <h4 className="text-[13px] font-semibold text-text-main">生成物料与数据产物</h4>
            <div className="space-y-1.5">
              {agent.outputItems.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-surface-1 rounded-lg border border-border-default text-[13px] flex items-center gap-2 text-text-secondary">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal / Reasoning Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-main">
                <Terminal size={14} className="text-text-tertiary" />
                <span>Agent 推理执行日志</span>
              </div>
              <button
                onClick={handleCopyLogs}
                className="text-[13px] text-text-tertiary hover:text-text-main flex items-center gap-1 p-1 hover:bg-hover-bg rounded"
              >
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copied ? "已复制" : "复制日志"}</span>
              </button>
            </div>

            <div className="bg-neutral-900 text-neutral-200 rounded-xl p-4 font-mono text-[13px] leading-relaxed space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar border border-neutral-800">
              {agent.logs.map((log, lIdx) => {
                let color = "text-neutral-300";
                if (log.level === "success") color = "text-emerald-400";
                if (log.level === "warn") color = "text-amber-400";
                if (log.level === "agent") color = "text-cyan-300";

                return (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-neutral-500 shrink-0">{log.time}</span>
                    <span className={`px-1 py-0.2 rounded text-[13px] uppercase font-bold shrink-0 ${
                      log.level === 'success' ? 'bg-emerald-950 text-emerald-300' :
                      log.level === 'warn' ? 'bg-amber-950 text-amber-300' :
                      log.level === 'agent' ? 'bg-cyan-950 text-cyan-300' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className={color}>{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default flex justify-end shrink-0 bg-surface-1">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-btn-main text-white hover:bg-btn-main-hover rounded-xl text-[13px] font-medium transition-colors"
          >
            关闭详情
          </button>
        </div>
      </motion.div>
    </div>
  );
}
