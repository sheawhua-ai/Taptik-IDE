import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Check, SlidersHorizontal, X } from "lucide-react";
import { Project } from "../../../data/projectStore";
import { StrategyConfiguration, StrategyVersion } from "../../../data/unifiedStore";
import { formatChineseDate } from "../../../utils/formatDate";

interface StrategyCustomizationDrawerProps {
  project: Project;
  activeVersion?: StrategyVersion;
  versions: StrategyVersion[];
  onSave: (configuration: StrategyConfiguration, changedFields: string[]) => void;
  onClose: () => void;
}

const sourceLabel: Record<StrategyVersion["source"], string> = {
  initial: "首次方案生成",
  expert_adjustment: "专家定制",
  review_applied: "复盘建议已应用"
};

export function StrategyCustomizationDrawer({
  project,
  activeVersion,
  versions,
  onSave,
  onClose
}: StrategyCustomizationDrawerProps) {
  const initial = useMemo<StrategyConfiguration>(() => ({
    targetAudience: activeVersion?.configuration.targetAudience || project.strategyProtocol?.targetAudience || "",
    coreProblem: activeVersion?.configuration.coreProblem || project.strategyProtocol?.coreProblem || project.goal || "",
    solutionSummary: activeVersion?.configuration.solutionSummary || project.strategyProtocol?.solutionSummary || "",
    verifyHypothesis: activeVersion?.configuration.verifyHypothesis || project.strategyProtocol?.verifyHypothesis || "",
    continueCondition: activeVersion?.configuration.continueCondition || project.strategyProtocol?.continueCondition || "",
    stopCondition: activeVersion?.configuration.stopCondition || project.strategyProtocol?.stopCondition || "",
    targetKeywords: activeVersion?.configuration.targetKeywords || [],
    observationDays: activeVersion?.configuration.observationDays || 14
  }), [activeVersion, project]);

  const [form, setForm] = useState(initial);
  const [keywordText, setKeywordText] = useState(initial.targetKeywords.join("、"));

  const save = () => {
    const configuration: StrategyConfiguration = {
      ...form,
      targetKeywords: keywordText.split(/[、,，\n]/).map(keyword => keyword.trim()).filter(Boolean)
    };
    const changedFields = [
      ["核心问题", configuration.coreProblem !== initial.coreProblem],
      ["目标人群", configuration.targetAudience !== initial.targetAudience],
      ["内容方法", configuration.solutionSummary !== initial.solutionSummary],
      ["验证目标", configuration.verifyHypothesis !== initial.verifyHypothesis],
      ["目标关键词", configuration.targetKeywords.join("|") !== initial.targetKeywords.join("|")],
      ["观察周期", configuration.observationDays !== initial.observationDays]
    ].filter(([, changed]) => changed).map(([label]) => label as string);

    if (changedFields.length === 0) {
      onClose();
      return;
    }
    onSave(configuration, changedFields);
  };

  return (
    <div className="fixed inset-0 z-[160] flex justify-end">
      <div className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative z-10 flex h-full w-full max-w-[620px] flex-col border-l border-border-default bg-surface-1 shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-border-default p-5">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-text-secondary" />
              <h2 className="text-[16px] font-semibold text-text-main">专家定制</h2>
              <span className="rounded-md border border-border-default bg-surface-subtle px-2 py-0.5 text-[11px] text-text-secondary">
                当前 V{activeVersion?.version || 1}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-text-tertiary">调整运营逻辑并生成一个新版本。</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-text-tertiary hover:bg-hover-bg hover:text-text-main">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="flex gap-2.5 rounded-xl border border-info/20 bg-info-light p-3.5 text-[12px] leading-relaxed text-text-secondary">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-info" />
            <span>保存后仅影响之后生成的笔记。已生成、待发布和已发布笔记继续绑定原策略版本，不会被改写。</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { key: "coreProblem", label: "核心问题", rows: 3 },
              { key: "targetAudience", label: "目标人群", rows: 2 },
              { key: "solutionSummary", label: "内容方法", rows: 3 },
              { key: "verifyHypothesis", label: "验证目标", rows: 3 }
            ].map(field => (
              <label key={field.key} className="space-y-1.5 text-[12px]">
                <span className="font-medium text-text-main">{field.label}</span>
                <textarea
                  rows={field.rows}
                  value={String(form[field.key as keyof StrategyConfiguration] || "")}
                  onChange={event => setForm(current => ({ ...current, [field.key]: event.target.value }))}
                  className="w-full resize-none rounded-lg border border-border-default bg-surface-subtle px-3 py-2.5 text-[12.5px] leading-relaxed text-text-main outline-none transition-colors focus:border-border-strong focus:bg-surface-1"
                />
              </label>
            ))}

            <label className="space-y-1.5 text-[12px]">
              <span className="font-medium text-text-main">目标关键词</span>
              <input
                value={keywordText}
                onChange={event => setKeywordText(event.target.value)}
                placeholder="用顿号或逗号分隔"
                className="w-full rounded-lg border border-border-default bg-surface-subtle px-3 py-2.5 text-[12.5px] text-text-main outline-none focus:border-border-strong focus:bg-surface-1"
              />
              <span className="block text-[11px] text-text-tertiary">用于发布后调用关键词搜索接口，比对平台笔记 ID 和排名。</span>
            </label>

            <label className="space-y-1.5 text-[12px]">
              <span className="font-medium text-text-main">发布后观察周期</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={form.observationDays || 14}
                  onChange={event => setForm(current => ({ ...current, observationDays: Number(event.target.value) || 14 }))}
                  className="w-24 rounded-lg border border-border-default bg-surface-subtle px-3 py-2 text-[12.5px] outline-none focus:border-border-strong focus:bg-surface-1"
                />
                <span className="text-[12px] text-text-secondary">天</span>
              </div>
            </label>
          </div>

          <div className="rounded-xl border border-border-default p-4">
            <div className="mb-3 text-[12px] font-medium text-text-main">版本记录</div>
            <div className="space-y-2">
              {[...versions].sort((a, b) => b.version - a.version).map(version => (
                <div key={version.id} className="flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2 text-[11.5px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-main">V{version.version}</span>
                    <span className="text-text-secondary">{sourceLabel[version.source]}</span>
                    {version.status === "active" && <span className="rounded bg-success-light px-1.5 py-0.5 text-success">当前</span>}
                  </div>
                  <span className="text-text-tertiary">{formatChineseDate(version.createdAt, true)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-border-default p-4">
          <span className="text-[11.5px] text-text-tertiary">保存将创建 V{(activeVersion?.version || 0) + 1}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-border-default px-4 py-2 text-[12.5px] text-text-secondary hover:bg-hover-bg">取消</button>
            <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[12.5px] font-medium text-white hover:bg-btn-main-hover">
              <Check size={14} /> 保存为新版本
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
