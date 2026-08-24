import React, { useState } from "react";
import { X, Download, Copy, Check, FileText, CheckCircle2, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { ReviewTask } from "./types";

interface ExportReportModalProps {
  task: ReviewTask;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportReportModal({ task, isOpen, onClose }: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `# ${task.title}
**复盘周期**: ${task.dateRange.start} 至 ${task.dateRange.end}
**复盘范围**: ${task.projectNames.join('、')}
**复盘目标**: ${task.targetObjectiveLabel}
**数据生成时间**: ${task.createdAt}

---

## 一、核心结论
- **总体表现**: ${task.coreConclusions.overallPerformance.title} (${task.coreConclusions.overallPerformance.description})
- **主要问题**: ${task.coreConclusions.mainIssue.title} (${task.coreConclusions.mainIssue.description})
- **关键机会**: ${task.coreConclusions.keyOpportunity.title} (${task.coreConclusions.keyOpportunity.description})
- **优先动作**: ${task.coreConclusions.priorityAction.title} (${task.coreConclusions.priorityAction.description})

---

## 二、建议落地动作
${task.suggestedActions.map((a, i) => `### ${i + 1}. [${a.priority}] ${a.title}
- **目标**: ${a.target}
- **预计收益**: ${a.expectedGain}
- **归因理由**: ${a.reason}
- **执行SOP**:
${a.recommendedSteps.map(s => `  - ${s}`).join('\n')}
`).join('\n')}

---

## 三、最终复盘定论
${task.analysisDetails.finalConclusion}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${task.title}_运营复盘报告.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans text-text-main">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-2xl shadow-dialog border border-border-default w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-btn-main" />
            <div>
              <h3 className="text-[15px] font-semibold text-text-main">导出复盘报告</h3>
              <p className="text-[11.5px] text-text-tertiary">支持复制 Markdown 文本或直接下载报告文件</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
          <div className="p-4 bg-surface-subtle border border-border-default rounded-xl font-mono text-[12px] text-text-secondary whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
            {markdownContent}
          </div>
        </div>

        <div className="p-4 border-t border-border-default flex items-center justify-between bg-surface-subtle">
          <span className="text-[12px] text-text-tertiary">已包含全部核心结论与执行建议</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-[12.5px] font-medium text-text-main hover:bg-hover-bg rounded-xl transition-colors border border-border-default bg-surface-1 flex items-center gap-1.5"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "已复制到剪贴板" : "复制 Markdown"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-[12.5px] font-medium text-white bg-btn-main hover:bg-btn-main-hover rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              {downloaded ? <Check size={14} /> : <Download size={14} />}
              <span>{downloaded ? "已下载" : "下载报告 (.md)"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
