import React, { useState } from "react";
import { 
  FileText, AlertTriangle, TrendingUp, TrendingDown, Users, 
  Sparkles, CheckCircle2, ChevronRight, Layers, Database, Target,
  MessageSquare, Lightbulb, Compass, BarChart2
} from "lucide-react";
import { ReviewTask } from "./types";

interface ReviewDetailsTabProps {
  task: ReviewTask;
  onOpenExecutionCenter?: () => void;
}

export function ReviewDetailsTab({ task, onOpenExecutionCenter }: ReviewDetailsTabProps) {
  const { analysisDetails } = task;
  const [activeInsightSubTab, setActiveInsightSubTab] = useState<"content" | "user" | "conversion">("content");

  return (
    <div className="space-y-6 pb-12 text-text-main font-sans">
      
      {/* 1. 复盘摘要 (Review Summary Card) */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <FileText size={16} className="text-btn-main" />
          <h3 className="text-[15px] font-semibold text-text-main">复盘范围与数据基准</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[12.5px]">
          <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
            <span className="text-text-tertiary text-[11px] block">覆盖项目 / 门店</span>
            <span className="font-semibold text-text-main block">{analysisDetails.summary.scope}</span>
          </div>

          <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
            <span className="text-text-tertiary text-[11px] block">复盘核心目标</span>
            <span className="font-semibold text-text-main block">{analysisDetails.summary.target}</span>
          </div>

          <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
            <span className="text-text-tertiary text-[11px] block">分析时间窗口</span>
            <span className="font-semibold text-text-main block">{analysisDetails.summary.timeWindow}</span>
          </div>

          <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1 sm:col-span-2">
            <span className="text-text-tertiary text-[11px] block">接入数据源范围</span>
            <span className="font-semibold text-text-main block">{analysisDetails.summary.dataSource}</span>
          </div>

          <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
            <span className="text-text-tertiary text-[11px] block">样本笔记 / 资产规模</span>
            <span className="font-semibold text-text-main block">共 {analysisDetails.summary.sampleNotesCount} 篇笔记样本</span>
          </div>
        </div>
      </section>

      {/* 2. 问题诊断 (Problem Diagnosis: 问题 - 原因 - 影响) */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            <h3 className="text-[14px] font-semibold text-text-main">问题诊断 (问题 - 原因 - 影响)</h3>
          </div>
          <span className="text-[12px] text-text-tertiary">
            发现 {analysisDetails.diagnoses.length} 处关键漏斗卡点
          </span>
        </div>

        <div className="divide-y divide-border-subtle p-2">
          {analysisDetails.diagnoses.map((diag, i) => (
            <div key={i} className="p-3.5 space-y-2 rounded-lg hover:bg-surface-subtle transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h4 className="text-[13.5px] font-semibold text-text-main">{diag.issue}</h4>
                </div>
                <span className="px-2 py-0.5 bg-surface-1 border border-border-default text-[11px] font-medium text-text-tertiary rounded">
                  {diag.affectedStage}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] pl-7">
                <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle">
                  <span className="font-medium text-text-tertiary block mb-0.5">🔍 根本原因：</span>
                  <p className="text-text-secondary">{diag.cause}</p>
                </div>
                <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle">
                  <span className="font-medium text-red-700 block mb-0.5">⚠️ 业务影响：</span>
                  <p className="text-text-secondary">{diag.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 关键指标变化 (Key Metrics Shifts Table) */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-btn-main" />
            <h3 className="text-[14px] font-semibold text-text-main">关键指标变化对照</h3>
          </div>
          <span className="text-[12px] text-text-tertiary">较上期环比基准</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-default text-[11.5px] text-text-tertiary font-medium">
                <th className="py-2.5 px-4">指标名称</th>
                <th className="py-2.5 px-4">上周期基准</th>
                <th className="py-2.5 px-4">本期数值</th>
                <th className="py-2.5 px-4">环比变化</th>
                <th className="py-2.5 px-4">归因解读</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {analysisDetails.metricShifts.map((m, idx) => (
                <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                  <td className="py-3 px-4 font-semibold text-text-main">{m.metric}</td>
                  <td className="py-3 px-4 text-text-tertiary">{m.before}</td>
                  <td className="py-3 px-4 font-medium text-text-main">{m.current}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        m.isGood
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {m.change}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-[12px]">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. 内容 / 用户 / 转化洞察 (Insights Sub-Tabs) */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-btn-main" />
            <h3 className="text-[14px] font-semibold text-text-main">多维深度洞察</h3>
          </div>

          {/* Sub-tab pills */}
          <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default">
            {[
              { id: "content", label: "内容与素材洞察" },
              { id: "user", label: "潜客与意向洞察" },
              { id: "conversion", label: "私信与转化洞察" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveInsightSubTab(st.id as any)}
                className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
                  activeInsightSubTab === st.id
                    ? "bg-surface-1 text-text-main shadow-xs"
                    : "text-text-tertiary hover:text-text-main"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {activeInsightSubTab === "content" && (
            <div className="space-y-3">
              <h4 className="text-[13.5px] font-semibold text-text-main flex items-center gap-2">
                <FileText size={15} className="text-btn-main" />
                <span>{analysisDetails.insights.contentInsight.title}</span>
              </h4>
              <ul className="space-y-2.5">
                {analysisDetails.insights.contentInsight.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[12.5px] text-text-secondary leading-relaxed p-2.5 bg-surface-subtle rounded-lg border border-border-subtle">
                    <span className="w-4 h-4 rounded-full bg-btn-main text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeInsightSubTab === "user" && (
            <div className="space-y-3">
              <h4 className="text-[13.5px] font-semibold text-text-main flex items-center gap-2">
                <Users size={15} className="text-btn-main" />
                <span>{analysisDetails.insights.userInsight.title}</span>
              </h4>
              <ul className="space-y-2.5">
                {analysisDetails.insights.userInsight.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[12.5px] text-text-secondary leading-relaxed p-2.5 bg-surface-subtle rounded-lg border border-border-subtle">
                    <span className="w-4 h-4 rounded-full bg-btn-main text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeInsightSubTab === "conversion" && (
            <div className="space-y-3">
              <h4 className="text-[13.5px] font-semibold text-text-main flex items-center gap-2">
                <TrendingUp size={15} className="text-btn-main" />
                <span>{analysisDetails.insights.conversionInsight.title}</span>
              </h4>
              <ul className="space-y-2.5">
                {analysisDetails.insights.conversionInsight.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[12.5px] text-text-secondary leading-relaxed p-2.5 bg-surface-subtle rounded-lg border border-border-subtle">
                    <span className="w-4 h-4 rounded-full bg-btn-main text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 5. 策略建议完整说明 (Strategic Guidelines) */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <Lightbulb size={16} className="text-btn-main" />
          <h3 className="text-[15px] font-semibold text-text-main">下阶段策略建议指南</h3>
        </div>

        <div className="space-y-3">
          {analysisDetails.strategicGuidelines.map((guide, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border-default bg-surface-subtle space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-btn-main text-white text-[11px] font-bold rounded">
                  策略 {idx + 1}
                </span>
                <h4 className="text-[13.5px] font-semibold text-text-main">{guide.title}</h4>
              </div>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">{guide.detail}</p>
              
              <div className="pt-2 border-t border-border-subtle flex flex-wrap gap-2 text-[11.5px]">
                <span className="font-semibold text-text-tertiary">落地清单：</span>
                {guide.actionSteps.map((step, sIdx) => (
                  <span key={sIdx} className="px-2 py-0.5 bg-surface-1 border border-border-default rounded text-text-main font-medium">
                    ✓ {step}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 最终总结与复盘结论 (Final Summary) */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <h3 className="text-[15px] font-semibold text-text-main">阶段总结与操盘定论</h3>
        </div>
        <p className="text-[13px] text-text-secondary leading-relaxed bg-surface-subtle p-4 rounded-xl border border-border-subtle">
          {analysisDetails.finalConclusion}
        </p>
      </section>

    </div>
  );
}
