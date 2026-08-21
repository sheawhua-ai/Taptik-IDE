import re

content = """
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  MessageSquare,
  Terminal,
  History,
  Settings,
  MoreVertical,
  Check,
  Cpu,
  X,
  FileText,
  Trash2,
  Compass,
  PenTool,
  Calendar,
  Users,
  BarChart,
  Workflow,
  Mic
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubagentChatProps {
  moduleId: string;
  moduleName: string;
  onNavigate?: (tabId: "strategy" | "content" | "execution" | "interaction" | "metrics") => void;
  onClose?: () => void;
  initialExpert?: string;
  initialContext?: string;
}

export const SubagentChat: React.FC<SubagentChatProps> = ({
  moduleId,
  moduleName,
  onNavigate,
  onClose,
  initialExpert,
  initialContext,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-surface-1 w-full overflow-hidden relative border-l border-border-default">
      {/* Header */}
      <div className="h-14 border-b border-border-default flex items-center justify-between px-5 bg-surface-1 shrink-0 z-10 relative">
        <div className="flex items-center gap-2 text-text-main font-bold">
          <Bot size={18} className="text-text-secondary" />
          <span className="text-[14px]">AI Inspector</span>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8">
        
        {/* Current Context */}
        <div className="flex flex-col gap-3">
          <div className="text-[12px] font-bold text-text-secondary flex items-center gap-1.5">
            Current Context
          </div>
          <div className="p-4 bg-page-bg border border-border-default rounded-xl text-[13px] text-text-main leading-relaxed">
            {initialContext || "Analyzing '" + moduleName + "' performance data against Q2 baselines. Focus on audience engagement metrics."}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="flex flex-col gap-3">
          <div className="text-[12px] font-bold text-text-secondary flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-logo" />
            AI Suggestion
          </div>
          <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden relative shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-logo" />
            <div className="p-4 pl-5">
              <p className="text-[13px] text-text-main leading-relaxed">
                I noticed a 15% drop in click-through rates on the secondary ad sets. I suggest re-generating the copy to emphasize 'Time-saving' over 'Cost-saving' based on successful A/B tests from last month.
              </p>
              
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-default">
                <button className="flex-1 py-2 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main text-[13px] font-bold rounded-lg transition-colors">
                  Accept
                </button>
                <button className="flex-1 py-2 bg-surface-1 text-text-secondary hover:bg-hover-bg hover:text-text-main text-[13px] font-medium rounded-lg transition-colors">
                  Adjust
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Previous actions */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="text-[12px] font-bold text-text-secondary flex items-center gap-1.5">
            <History size={14} />
            Previous actions
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-[13px] text-text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary mt-1.5 shrink-0" />
              <span>Generated 3 alternative headlines for Hero section.</span>
            </li>
            <li className="flex items-start gap-2 text-[13px] text-text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary mt-1.5 shrink-0" />
              <span>Exported Q2 performance report to PDF.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-1 shrink-0 border-t border-border-default">
        <div className="relative flex items-center bg-surface-1 border border-border-default rounded-xl overflow-hidden focus-within:border-text-tertiary transition-colors shadow-sm">
          <button className="pl-3 pr-2 text-text-tertiary hover:text-text-main">
            <Mic size={16} />
          </button>
          <input
            type="text"
            placeholder="Ask AI to assist..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 py-3 px-2 bg-transparent text-[13px] text-text-main outline-none placeholder:text-text-tertiary"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="pr-3 pl-2 text-text-tertiary hover:text-text-main disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
"""

with open("src/components/SubagentChat.tsx", "w") as f:
    f.write(content.strip())
