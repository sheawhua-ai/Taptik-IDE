import React from "react";
import { 
  TrendingUp, TrendingDown, Sparkles, ChevronRight, AlertTriangle, 
  Check, ArrowRight, ShieldAlert, Target, Zap, Users, BarChart2,
  FileText, Store, Clock, HelpCircle, Layers, FolderPlus
} from "lucide-react";
import { ReviewTask, SuggestedAction } from "./types";

interface ReviewOverviewTabProps {
  task: ReviewTask;
  onActionDetail: (action: SuggestedAction) => void;
  onApplyAction?: (action: SuggestedAction) => void;
  onNavigateToEvidence?: (target: { section: "overall" | "comparison" | "content" | "user" | "funnel" | "data_spec"; filter?: string }) => void;
}

export function ReviewOverviewTab({
  task,
  onActionDetail,
  onApplyAction,
  onNavigateToEvidence,
}: ReviewOverviewTabProps) {
  const { coreConclusions, suggestedActions, analysisDetails } = task;

  // Applied actions count
  const appliedCount = suggestedActions.filter((a) => !!a.appliedDestinationLabel).length;

  // 6 Core Metrics for high-level decision making
  const coreMetrics = [
    {
      label: "会员新增与拓客",
      current: "340 人",
      before: "265 人",
      change: "+28.5%",
      isGood: true,
      note: "达成既定月度目标的 112%",
    },
    {
      label: "内容全网总曝光",
      current: "44.2 万",
      before: "37.8 万",
      change: "+16.8%",
      isGood: true,
      note: "三亚店高爆文持续贡献长尾",
    },
    {
      label: "私信咨询线索量",
      current: "1,420 条",
      before: "1,210 条",
      change: "+17.3%",
      isGood: true,
      note: "日均咨询保持稳步递增",
    },
    {
      label: "有效私信留资率",
      current: "48.0%",
      before: "42.1%",
      change: "+5.9%",
      isGood: true,
      note: "标准化开场白有效促成留资",
    },
    {
      label: "门店核销 / 转化单量",
      current: "248 单",
      before: "202 单",
      change: "+22.8%",
      isGood: true,
      note: "三亚店核销率达 22.4% 居首",
    },
    {
      label: "单线索获客成本 CPL",
      current: "¥19.2",
      before: "¥24.8",
      change: "-22.5%",
      isGood: true,
      note: "自然搜索与店长号降本明显",
    },
  ];

  // 3 Key Drivers (The 3 "Whys")
  const keyDrivers = [
    {
      id: "content_driver",
      title: "哪类内容带来了增长？",
      headline: "真实养宠答疑与《店长换粮实测》笔记是核心引擎",
      description:
        "三亚店采用真实养宠场景实测（如店长手把手温水泡粮、记录便便变化），互动率与长尾搜索转化是普通硬广的 3.8 倍，单篇贡献 22.4% 进店核销率。",
      tag: "内容策略",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
      targetSection: "content" as const,
      filter: "high_converting",
      actionLabel: "查看内容分析依据",
    },
    {
      id: "store_driver",
      title: "哪个门店表现最好？",
      headline: "三亚店在矩阵中综合 ROI 与转化力均居第一",
      description:
        "三亚店以店长人设深度运营，在内容完播率、私信回复时效（<3分钟）及到店核销率（22.4%）三项指标全矩阵领跑，贡献全项目 54% 的线索增量。",
      tag: "门店对比",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      targetSection: "comparison" as const,
      filter: "sanya",
      actionLabel: "查看门店对比依据",
    },
    {
      id: "loss_driver",
      title: "哪个环节造成了流失？",
      headline: "青岛、杭州 20:00—24:00 夜间咨询承接严重断层",
      description:
        "复盘数据显示 42% 的高意向咨询发生在 20:00-24:00，青岛与杭州夜间未配置自动化回复 SOP，客服平均首次响应超过 45 分钟，造成大量潜客在私信入口流失。",
      tag: "转化卡点",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
      targetSection: "funnel" as const,
      filter: "night_loss",
      actionLabel: "查看漏斗流失依据",
    },
  ];

  // 3 Critical Risks / Anomalies (Truly affecting decisions)
  const criticalRisks = [
    {
      title: "夜间时段高意向潜客流失风险",
      severity: "high" as const,
      description: "青岛与杭州门店在 20:00—24:00 夜间时段无专人值守，高意向咨询由于超时无应答流失率达 42%。",
      impact: "预估每月损失近 120+ 组意向换粮新客。",
      actionText: "查看转化链路",
      targetSection: "funnel" as const,
      filter: "night_loss",
    },
    {
      title: "青岛店部分私信日志存在数据补录修正",
      severity: "medium" as const,
      description: "青岛店 7月15日前由于第三方系统接口维护，部分私信会话存在数据延迟，系统已采用加权平滑算法完成校准。",
      impact: "已校准数据基准，不影响综合趋势判断。",
      actionText: "查看数据说明",
      targetSection: "data_spec" as const,
    },
    {
      title: "烘焙粮品类高转化样本集中度偏高",
      severity: "low" as const,
      description: "烘焙粮品类的高转化数据主要由 2 篇核心爆款拉动，其余普通笔记样本量偏少。",
      impact: "建议在后续批次中补齐 3 组对照样本以固化最佳实践。",
      actionText: "查看内容样本",
      targetSection: "content" as const,
      filter: "sample_notes",
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-text-main">
      
      {/* ========================================================= */}
      {/* 1. 一句话复盘结论 (One-Sentence Executive Conclusion) */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-r from-surface-subtle via-surface-1 to-surface-subtle p-5 rounded-2xl border border-border-default shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-btn-main text-white text-[13px] font-bold rounded">
              经营结论
            </span>
            <h2 className="text-[15px] font-bold text-text-main">本次复盘核心定论</h2>
          </div>
          <span className="text-[13px] text-text-tertiary">
            {analysisDetails?.summary?.timeWindow || task.dateRange.label} · 覆盖 {task.projectNames.join("、")}
          </span>
        </div>

        <div className="p-4 bg-surface-1 rounded-xl border border-border-subtle shadow-2xs space-y-2.5">
          <p className="text-[14.5px] font-semibold text-text-main leading-relaxed">
            {coreConclusions?.overallPerformance?.title 
              ? `${coreConclusions.overallPerformance.title}。${coreConclusions.mainIssue.title}。`
              : "Q2 会员增长主要来自三亚店的专业答疑与实测内容，但青岛、杭州在 20:00—24:00 夜间咨询承接上存在明显流失。"}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
              <TrendingUp size={12} />
              <span>增长极：三亚店实测答疑（核销率 22.4%）</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">
              <Clock size={12} />
              <span>卡点：夜间咨询流失率达 42%</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
              <Target size={12} />
              <span>目标达成：全网曝光 44.2万（达成率 112%）</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. 核心指标 (Core Metrics - 4~6个指标与相比上期变化) */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-btn-main rounded-full" />
            <h3 className="text-[15px] font-semibold text-text-main tracking-tight">核心经营指标</h3>
          </div>
          <span className="text-[13px] text-text-tertiary">较上一周期环比基准</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {coreMetrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-surface-1 p-3.5 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors"
            >
              <span className="text-[13px] font-medium text-text-tertiary truncate">
                {m.label}
              </span>
              <div>
                <div className="text-[19px] font-bold text-text-main tracking-tight">
                  {m.current}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`inline-flex items-center gap-0.5 text-[13px] font-bold px-1 py-0.2 rounded ${
                      m.isGood ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                    }`}
                  >
                    {m.isGood ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    <span>{m.change}</span>
                  </span>
                  <span className="text-[13px] text-text-tertiary font-mono">
                    前值 {m.before}
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-text-secondary leading-tight pt-1.5 border-t border-border-subtle line-clamp-1">
                {m.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. 关键驱动因素 (Key Drivers - 最重要的3个“为什么”) */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-btn-main rounded-full" />
            <h3 className="text-[15px] font-semibold text-text-main tracking-tight">关键驱动因素</h3>
          </div>
          <span className="text-[13px] text-text-tertiary">3 大核心原因解析与分析依据直达</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {keyDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-3 hover:border-border-strong transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-text-tertiary">
                    {driver.title}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[13px] font-semibold rounded border ${driver.tagColor}`}>
                    {driver.tag}
                  </span>
                </div>

                <h4 className="text-[13.5px] font-semibold text-text-main leading-snug">
                  {driver.headline}
                </h4>

                <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-4">
                  {driver.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToEvidence) {
                      onNavigateToEvidence({
                        section: driver.targetSection,
                        filter: driver.filter,
                      });
                    }
                  }}
                  className="text-[13px] text-btn-main hover:text-btn-main-hover font-semibold flex items-center gap-1 group py-1"
                >
                  <span>{driver.actionLabel}</span>
                  <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 后续迭代建议 (Follow-up Iteration Suggestions) */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-emerald-600 rounded-full" />
              <h3 className="text-[15px] font-semibold text-text-main tracking-tight">后续迭代建议</h3>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              基于本次复盘结果，将有效经验和优化方向应用到下一期方案或后续笔记。
            </p>
          </div>
          <span className="text-[13px] text-text-tertiary font-medium">
            已应用 ({appliedCount}/{suggestedActions.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {suggestedActions.map((action) => {
            const isP0 = action.priority === "P0";
            const isApplied = !!action.appliedDestinationLabel;
            const isPlan = action.actionType === "plan";

            return (
              <div
                key={action.id}
                className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs flex flex-col justify-between space-y-3 hover:border-border-strong transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 text-[13px] font-bold rounded ${
                          isP0
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {action.priority} 优先级
                      </span>
                      <span className="px-1.5 py-0.5 bg-surface-subtle text-text-secondary border border-border-default text-[13px] rounded">
                        {action.category}
                      </span>
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-text-tertiary border border-neutral-200 text-[13px] rounded">
                        {isPlan ? "流程 / 策略" : "内容 / 选题"}
                      </span>
                    </div>

                    {isApplied && (
                      <span className="text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                        <Check size={11} strokeWidth={2.5} />
                        <span>{action.appliedDestinationLabel}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-semibold text-text-main">
                    {action.title}
                  </h4>

                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    <span className="text-text-tertiary font-medium">目标：</span>{action.target}
                  </p>

                  <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle text-[13px] text-text-secondary">
                    <span className="font-semibold text-btn-main">预期收益：</span>
                    <span>{action.expectedGain}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                  <button
                    onClick={() => onActionDetail(action)}
                    className="text-[13px] text-text-secondary hover:text-text-main font-medium flex items-center gap-1"
                  >
                    <span>查看落地方式</span>
                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() => {
                      if (onApplyAction) {
                        onApplyAction(action);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs ${
                      isApplied
                        ? "bg-surface-subtle text-text-secondary border border-border-default hover:bg-hover-bg"
                        : "bg-btn-main text-white hover:bg-btn-main-hover"
                    }`}
                  >
                    {isPlan ? (
                      <>
                        <FolderPlus size={12} />
                        <span>{isApplied ? "修改方案设置" : "纳入项目方案"}</span>
                      </>
                    ) : (
                      <>
                        <FileText size={12} />
                        <span>{isApplied ? "修改应用设置" : "应用到后续笔记"}</span>
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
      {/* 5. 风险和待关注问题 (Risks & Watch-outs - 真正影响判断的异常) */}
      {/* ========================================================= */}
      <section className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            <h3 className="text-[14px] font-semibold text-text-main">风险和待关注问题</h3>
          </div>
          <span className="text-[13px] text-text-tertiary">
            提示可能影响业务判断与经营指标的异常
          </span>
        </div>

        <div className="divide-y divide-border-subtle p-3 space-y-3">
          {criticalRisks.map((risk, i) => {
            const isHigh = risk.severity === "high";
            const isMed = risk.severity === "medium";
            return (
              <div key={i} className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[13px] font-bold rounded ${
                        isHigh
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : isMed
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {isHigh ? "严重卡点" : isMed ? "数据预警" : "样本提示"}
                    </span>
                    <h4 className="text-[13.5px] font-semibold text-text-main">{risk.title}</h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToEvidence) {
                        onNavigateToEvidence({
                          section: risk.targetSection,
                          filter: risk.filter,
                        });
                      }
                    }}
                    className="text-[13px] text-btn-main hover:text-btn-main-hover font-medium flex items-center gap-0.5"
                  >
                    <span>{risk.actionText}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px]">
                  <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle text-text-secondary leading-relaxed">
                    <span className="font-medium text-text-tertiary block mb-0.5">异常详情：</span>
                    {risk.description}
                  </div>
                  <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle text-text-secondary leading-relaxed">
                    <span className="font-medium text-text-tertiary block mb-0.5">经营影响评估：</span>
                    {risk.impact}
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
