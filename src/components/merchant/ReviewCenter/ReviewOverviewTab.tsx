import React, { useState } from "react";
import { 
  CheckCircle2, Clock, AlertTriangle, AlertCircle, RefreshCw, 
  ArrowRight, TrendingUp, TrendingDown, Minus, Check, Layers, 
  Sparkles, ExternalLink, ChevronRight, ChevronDown, ChevronUp,
  ShieldAlert, FileText, Database, UserCheck, Play, Eye, Plus, 
  Zap, Users, BarChart2, Target, Lightbulb, History, RotateCcw,
  User, ShieldCheck, HelpCircle, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewTask, SuggestedAction, ReviewHistoryVersion } from "./types";

interface ReviewOverviewTabProps {
  task: ReviewTask;
  onToggleActionSync: (actionId: string) => void;
  onActionDetail: (action: SuggestedAction) => void;
  onSwitchVersion?: (versionId: string) => void;
  onSupplementData?: () => void;
}

const DEFAULT_METRIC_DEFINITIONS = [
  {
    name: "有效私信咨询率",
    formula: "(提供犬龄/品种/手机号等有效线索会话数 ÷ 私信总会话量) × 100%",
    explanation: "衡量内容引流人群的精准度，剔除无意向的纯寒暄与机器人灌水。",
  },
  {
    name: "单线索平均获客成本 (CPL)",
    formula: "(该项目总投入预算 + 内容制作折算成本) ÷ 获取的有效留资线索数",
    explanation: "核算各门店或矩阵号的真实获客效率，用于评估自然流量与投产性价比。",
  },
  {
    name: "内容综合互动率",
    formula: "[(点赞数 + 收藏数 × 1.5 + 评论数 × 2) ÷ 笔记总曝光量] × 100%",
    explanation: "综合评估笔记在小红书算法推荐池中的表现力，重点衡量深度互动意愿。",
  },
  {
    name: "线下到店 / 私域核销率",
    formula: "(实际到店完成核销体验券人数 ÷ 领券并留资总人数) × 100%",
    explanation: "连接线上小红书与线下门店的核心转化效率，直接决定最终闭环ROI。",
  },
  {
    name: "搜索收录与长尾流量占比",
    formula: "(通过搜索词进入笔记的曝光量 ÷ 笔记总曝光量) × 100%",
    explanation: "衡量笔记在换粮、软便等长尾关键词上的自然卡位能力与长效获客潜力。",
  },
];

export function ReviewOverviewTab({
  task,
  onToggleActionSync,
  onActionDetail,
  onSwitchVersion,
  onSupplementData,
}: ReviewOverviewTabProps) {
  const { coreConclusions, suggestedActions, analysisDetails, historyVersions, activeVersionId } = task;

  // Accordion state for Data Scope & Metric Definitions (折叠的“数据范围与指标口径”)
  const [isDataScopeOpen, setIsDataScopeOpen] = useState(false);

  // Active insight tab selection for User/Content/Conversion insights
  const [activeInsightTab, setActiveInsightTab] = useState<"all" | "content" | "user" | "conversion">("all");

  // Fallback metric shifts if not populated
  const metricShifts = analysisDetails?.metricShifts || [
    { metric: "跨项目总曝光量", before: "37.8万", current: "44.2万", change: "+16.8%", isGood: true, note: "三亚店高爆文拉动明显" },
    { metric: "全网总互动量 (赞/藏/评)", before: "24,200", current: "28,240", change: "+16.7%", isGood: true, note: "测评类笔记互动率高" },
    { metric: "私信咨询线索量", before: "1,210", current: "1,420", change: "+17.3%", isGood: true, note: "整体咨询量保持平稳上升" },
    { metric: "有效咨询线索转化率", before: "13.2%", current: "14.3%", change: "+1.1%", isGood: true, note: "三亚大幅提升拉高均值" },
    { metric: "单线索获客成本 (CPL)", before: "¥24.8", current: "¥19.2", change: "-22.5%", isGood: true, note: "自然搜索与KOS自带流量降本" },
  ];

  // Diagnoses / Risks & Anomalies
  const diagnoses = analysisDetails?.diagnoses || [
    {
      issue: "跨项目私信承接响应时效差距显著",
      cause: "青岛及杭州门店夜间未配置自动化承接SOP，客服平均首次响应超过 45 分钟。",
      impact: "预估每月导致约 42% 的高意向潜客在评论区或私信入口流失。",
      severity: "high" as const,
      affectedStage: "私信承接与转化环节",
    },
    {
      issue: "部分矩阵号过度依赖硬广活动，泛流量占比偏高",
      cause: "发布内容以纯买赠优惠券为主，缺乏真实店长出镜与专业知识背书。",
      impact: "虽然互动量达标，但实际到店核销率仅 4.2%（远低于标杆三亚店的 22.4%）。",
      severity: "medium" as const,
      affectedStage: "内容分发与客群沉淀",
    },
  ];

  const contentInsight = analysisDetails?.insights?.contentInsight || {
    title: "内容与素材洞察",
    takeaways: [
      "真实养宠场景实测（如店长手把手温水泡粮、记录便便变化）信任度最高，完播率超 62%。",
      "纯产品棚拍图与包装精修图容易被算法识别为商业广告，长尾搜索自然推流受限。",
      "视频前 3 秒植入具体痛点问题（如‘幼犬换粮天天软便？’）的笔记互动率高出 2.3 倍。",
    ],
  };

  const userInsight = analysisDetails?.insights?.userInsight || {
    title: "潜客与意向洞察",
    takeaways: [
      "64% 的咨询宠主为初次养犬新手（犬龄在 2-6 个月），对‘益生菌活性’与‘胃肠耐受’极度敏感。",
      "用户不仅有买粮诉求，更需要‘科学养宠指导’，对专业营养顾问答疑具有高信任粘性。",
      "地域偏好：南方城市更关注泪痕与湿热软便，北方城市更关注适口性与颗粒大小。",
    ],
  };

  const conversionInsight = analysisDetails?.insights?.conversionInsight || {
    title: "私信与转化洞察",
    takeaways: [
      "置顶评论引导‘领取 7 天科学换粮自测表’的点击率比正文口播高出 4 倍。",
      "私信第 1 轮主动询问宠龄与品种的标准化会话，后续微信留资率高达 78%。",
      "夜间开启自动接待并赠送新客试吃装，可将次日到店核销率提升 31%。",
    ],
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-text-main">
      
      {/* ========================================================= */}
      {/* 1. 核心结论 (Core Conclusions) */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-btn-main rounded-full" />
            <h3 className="text-[15px] font-semibold text-text-main tracking-tight">核心结论</h3>
          </div>
          <span className="text-[12px] text-text-tertiary">综合跨周期漏斗与多维线索提炼</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: 总体表现 */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-text-tertiary flex items-center gap-1">
                  <TrendingUp size={13} className="text-emerald-600" />
                  <span>总体表现</span>
                </span>
                {coreConclusions.overallPerformance.metricBadge && (
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded">
                    {coreConclusions.overallPerformance.metricBadge}
                  </span>
                )}
              </div>
              <h4 className="text-[13.5px] font-semibold text-text-main leading-snug">
                {coreConclusions.overallPerformance.title}
              </h4>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3">
              {coreConclusions.overallPerformance.description}
            </p>
          </div>

          {/* Card 2: 主要问题 */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-text-tertiary flex items-center gap-1">
                  <AlertCircle size={13} className="text-red-600" />
                  <span>主要问题</span>
                </span>
                <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[11px] font-semibold rounded">
                  {coreConclusions.mainIssue.stage}
                </span>
              </div>
              <h4 className="text-[13.5px] font-semibold text-text-main leading-snug">
                {coreConclusions.mainIssue.title}
              </h4>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3">
              {coreConclusions.mainIssue.description}
            </p>
          </div>

          {/* Card 3: 关键机会 */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-text-tertiary flex items-center gap-1">
                  <Sparkles size={13} className="text-blue-600" />
                  <span>关键机会</span>
                </span>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded">
                  {coreConclusions.keyOpportunity.potentialGain || "增长突破点"}
                </span>
              </div>
              <h4 className="text-[13.5px] font-semibold text-text-main leading-snug">
                {coreConclusions.keyOpportunity.title}
              </h4>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3">
              {coreConclusions.keyOpportunity.description}
            </p>
          </div>

          {/* Card 4: 优先动作 */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-text-tertiary flex items-center gap-1">
                  <Zap size={13} className="text-amber-600" />
                  <span>优先动作</span>
                </span>
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded">
                  建议优先执行
                </span>
              </div>
              <h4 className="text-[13.5px] font-semibold text-text-main leading-snug">
                {coreConclusions.priorityAction.title}
              </h4>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3">
              {coreConclusions.priorityAction.description}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. 关键指标变化 (Key Metrics Shifts) */}
      {/* ========================================================= */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-btn-main" />
            <h3 className="text-[14px] font-semibold text-text-main">关键指标变化</h3>
          </div>
          <span className="text-[12px] text-text-tertiary">较上一复盘周期环比基准对照</span>
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
              {metricShifts.map((m, idx) => (
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
                      {m.isGood ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      <span>{m.change}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-[12px]">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. 用户 / 内容 / 转化洞察 (Insights) */}
      {/* ========================================================= */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-btn-main" />
            <h3 className="text-[14px] font-semibold text-text-main">用户 / 内容 / 转化洞察</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[12px]">
            {[
              { id: "all", label: "全部洞察" },
              { id: "content", label: "内容洞察" },
              { id: "user", label: "用户洞察" },
              { id: "conversion", label: "转化洞察" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveInsightTab(tab.id as any)}
                className={`px-3 py-1 font-medium rounded-md transition-all ${
                  activeInsightTab === tab.id
                    ? "bg-surface-1 text-text-main shadow-xs"
                    : "text-text-tertiary hover:text-text-main"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Panel 1: 内容与素材洞察 */}
            {(activeInsightTab === "all" || activeInsightTab === "content") && (
              <div className={`space-y-3 p-4 bg-surface-subtle rounded-xl border border-border-default ${activeInsightTab !== "all" ? "md:col-span-3" : ""}`}>
                <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileText size={13} />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-text-main">{contentInsight.title}</h4>
                </div>
                <ul className="space-y-2">
                  {contentInsight.takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[12px] text-text-secondary leading-relaxed bg-surface-1 p-2.5 rounded-lg border border-border-subtle">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Panel 2: 潜客与意向洞察 */}
            {(activeInsightTab === "all" || activeInsightTab === "user") && (
              <div className={`space-y-3 p-4 bg-surface-subtle rounded-xl border border-border-default ${activeInsightTab !== "all" ? "md:col-span-3" : ""}`}>
                <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Users size={13} />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-text-main">{userInsight.title}</h4>
                </div>
                <ul className="space-y-2">
                  {userInsight.takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[12px] text-text-secondary leading-relaxed bg-surface-1 p-2.5 rounded-lg border border-border-subtle">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Panel 3: 私信与转化洞察 */}
            {(activeInsightTab === "all" || activeInsightTab === "conversion") && (
              <div className={`space-y-3 p-4 bg-surface-subtle rounded-xl border border-border-default ${activeInsightTab !== "all" ? "md:col-span-3" : ""}`}>
                <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <TrendingUp size={13} />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-text-main">{conversionInsight.title}</h4>
                </div>
                <ul className="space-y-2">
                  {conversionInsight.takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[12px] text-text-secondary leading-relaxed bg-surface-1 p-2.5 rounded-lg border border-border-subtle">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 可执行建议 (Actionable Suggestions) */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-emerald-600 rounded-full" />
              <h3 className="text-[15px] font-semibold text-text-main tracking-tight">可执行建议</h3>
            </div>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              复盘的终点是行动。可将建议动作一键同步至执行中心推进日常落地
            </p>
          </div>
          <span className="text-[12px] text-text-tertiary">
            已同步 ({suggestedActions.filter(a => a.inExecutionCenter).length}/{suggestedActions.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {suggestedActions.map((action) => {
            const isP0 = action.priority === "P0";
            return (
              <div
                key={action.id}
                className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-3 hover:border-border-strong transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 text-[10.5px] font-bold rounded ${
                          isP0
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {action.priority} 优先级
                      </span>
                      <span className="px-1.5 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[10.5px] rounded">
                        {action.category}
                      </span>
                    </div>

                    {action.inExecutionCenter && (
                      <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Check size={12} strokeWidth={2.5} />
                        <span>已在执行中心</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-semibold text-text-main">
                    {action.title}
                  </h4>

                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    <span className="text-text-tertiary font-medium">目标：</span>{action.target}
                  </p>

                  <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle text-[11.5px] text-text-secondary">
                    <span className="font-semibold text-btn-main">预期收益：</span>
                    <span>{action.expectedGain}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                  <button
                    onClick={() => onActionDetail(action)}
                    className="text-[12px] text-text-secondary hover:text-text-main font-medium flex items-center gap-1"
                  >
                    <span>查看落地步骤</span>
                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() => onToggleActionSync(action.id)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs ${
                      action.inExecutionCenter
                        ? "bg-surface-subtle text-text-secondary border border-border-default hover:bg-hover-bg"
                        : "bg-btn-main text-white hover:bg-btn-main-hover"
                    }`}
                  >
                    {action.inExecutionCenter ? (
                      <>
                        <Check size={12} />
                        <span>已同步执行</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>加入执行中心</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. 风险与异常 (Risks and Anomalies) */}
      {/* ========================================================= */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            <h3 className="text-[14px] font-semibold text-text-main">风险与异常</h3>
          </div>
          <span className="text-[12px] text-text-tertiary">
            共发现 {diagnoses.length} 处业务卡点与时效风险
          </span>
        </div>

        <div className="divide-y divide-border-subtle p-3 space-y-3">
          {diagnoses.map((diag, i) => {
            const isHigh = diag.severity === "high";
            return (
              <div key={i} className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                        isHigh
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isHigh ? "高风险 / 严重卡点" : "中风险 / 提示预警"}
                    </span>
                    <h4 className="text-[13.5px] font-semibold text-text-main">{diag.issue}</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-surface-1 border border-border-default text-[11px] font-medium text-text-tertiary rounded">
                    {diag.affectedStage}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
                  <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle">
                    <span className="font-medium text-text-tertiary block mb-0.5">🔍 根本原因剖析：</span>
                    <p className="text-text-secondary leading-relaxed">{diag.cause}</p>
                  </div>
                  <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle">
                    <span className="font-medium text-red-700 block mb-0.5">⚠️ 业务影响评估：</span>
                    <p className="text-text-secondary leading-relaxed">{diag.impact}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. 折叠的“数据范围与指标口径” (Collapsible Data Scope & Metrics) */}
      {/* ========================================================= */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setIsDataScopeOpen(!isDataScopeOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Database size={16} className="text-text-tertiary" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-text-main">数据范围与指标口径</h3>
                <span className="px-1.5 py-0.5 bg-surface-subtle border border-border-default text-text-tertiary text-[10.5px] rounded">
                  {isDataScopeOpen ? "点击折叠" : "点击展开详情"}
                </span>
              </div>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                覆盖 {analysisDetails?.summary?.scope || task.projectNames.join('、')} · {analysisDetails?.summary?.sampleNotesCount || 58} 篇笔记样本 · {analysisDetails?.summary?.timeWindow || task.dateRange.label}
              </p>
            </div>
          </div>

          <div className="w-7 h-7 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-text-tertiary">
            {isDataScopeOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        <AnimatePresence>
          {isDataScopeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border-default"
            >
              <div className="p-5 space-y-5 bg-surface-1">
                
                {/* 1. Scope & Baseline Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-text-main">
                    <Info size={14} className="text-btn-main" />
                    <span>分析范围与样本基准</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px]">
                    <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                      <span className="text-text-tertiary text-[11px] block">覆盖项目 / 门店</span>
                      <span className="font-semibold text-text-main block">{analysisDetails?.summary?.scope || task.projectNames.join('、')}</span>
                    </div>

                    <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                      <span className="text-text-tertiary text-[11px] block">复盘核心目标</span>
                      <span className="font-semibold text-text-main block">{analysisDetails?.summary?.target || task.targetObjectiveLabel}</span>
                    </div>

                    <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                      <span className="text-text-tertiary text-[11px] block">分析时间窗口</span>
                      <span className="font-semibold text-text-main block">{analysisDetails?.summary?.timeWindow || task.dateRange.label}</span>
                    </div>

                    <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1 sm:col-span-2">
                      <span className="text-text-tertiary text-[11px] block">接入数据源范围</span>
                      <span className="font-semibold text-text-main block">{analysisDetails?.summary?.dataSource || "小红书聚光后台、来客私信系统、线下核销系统"}</span>
                    </div>

                    <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                      <span className="text-text-tertiary text-[11px] block">样本笔记 / 会话规模</span>
                      <span className="font-semibold text-text-main block">共 {analysisDetails?.summary?.sampleNotesCount || 58} 篇笔记样本</span>
                    </div>
                  </div>
                </div>

                {/* 2. Metric Formulas & Calculation Standards */}
                <div className="space-y-2.5 pt-2 border-t border-border-subtle">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-text-main">
                    <Target size={14} className="text-btn-main" />
                    <span>核心指标统计口径与计算公式</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DEFAULT_METRIC_DEFINITIONS.map((def, idx) => (
                      <div key={idx} className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1.5 text-[12px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-text-main">{def.name}</span>
                          <span className="text-[10.5px] text-text-tertiary font-mono">公式 #{idx + 1}</span>
                        </div>
                        <div className="p-2 bg-surface-1 rounded border border-border-default font-mono text-[11px] text-text-secondary">
                          {def.formula}
                        </div>
                        <p className="text-[11.5px] text-text-tertiary leading-relaxed">
                          {def.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ========================================================= */}
      {/* 7. 版本历史 (Version History) */}
      {/* ========================================================= */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <History size={16} className="text-btn-main" />
            <h3 className="text-[14px] font-semibold text-text-main">版本历史</h3>
          </div>
          <span className="text-[12px] text-text-tertiary">
            累计 {historyVersions.length} 个快照版本
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
          {historyVersions.map((ver) => {
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
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    isActive
                      ? "bg-surface-subtle border-border-strong shadow-xs"
                      : "bg-surface-1 border-border-default hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-text-main">{ver.versionName}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[10.5px] font-medium rounded ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-text-tertiary border border-neutral-200"
                        }`}
                      >
                        {ver.versionTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11.5px] text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {ver.createdAt}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User size={11} /> {ver.createdBy}
                      </span>
                    </div>
                  </div>

                  <p className="text-[12px] text-text-secondary leading-relaxed bg-surface-1 p-2.5 rounded-lg border border-border-subtle">
                    {ver.summarySnapshot}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-text-tertiary">
                      <strong className="text-text-secondary">数据截至时间：</strong> {ver.dataCutoff}
                    </span>

                    {!isActive && onSwitchVersion && (
                      <button
                        onClick={() => onSwitchVersion(ver.id)}
                        className="px-2.5 py-1 text-btn-main hover:bg-hover-bg rounded-md font-medium flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw size={11} />
                        <span>切换至该版本</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
