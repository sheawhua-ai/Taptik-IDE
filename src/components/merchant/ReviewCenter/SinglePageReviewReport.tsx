import React, { useState, useRef } from "react";
import { 
  TrendingUp, TrendingDown, Sparkles, ChevronRight, ChevronDown, ChevronUp, AlertTriangle, 
  Check, ArrowRight, ShieldAlert, Target, Zap, Users, BarChart2,
  FileText, Store, Clock, HelpCircle, Layers, FolderPlus, CheckCircle2,
  Database, Info, Compass, ExternalLink, Calendar, Search, Award
} from "lucide-react";
import { ReviewTask, SuggestedAction } from "./types";

interface SinglePageReviewReportProps {
  task: ReviewTask;
  onActionDetail: (action: SuggestedAction) => void;
  onApplyAction?: (action: SuggestedAction) => void;
  dataSpecRef?: React.RefObject<HTMLDivElement>;
  isDataSpecExpanded?: boolean;
  onToggleDataSpec?: () => void;
}

export function SinglePageReviewReport({
  task,
  onActionDetail,
  onApplyAction,
  dataSpecRef,
  isDataSpecExpanded,
  onToggleDataSpec,
}: SinglePageReviewReportProps) {
  const { coreConclusions, suggestedActions, analysisDetails, crossProjectComparison } = task;

  // Local state for expandable data spec if not controlled from parent
  const [internalDataSpecOpen, setInternalDataSpecOpen] = useState(false);
  const isDataSpecOpen = isDataSpecExpanded !== undefined ? isDataSpecExpanded : internalDataSpecOpen;
  const toggleDataSpec = onToggleDataSpec || (() => setInternalDataSpecOpen(!internalDataSpecOpen));

  // Filter inside content performance table
  const [contentFilter, setContentFilter] = useState<"all" | "high_converting" | "qa" | "promo">("all");
  // Comparison metric filter
  const [comparisonMetric, setComparisonMetric] = useState<"conversion" | "impressions" | "leads" | "cpl">("conversion");
  // Funnel filter
  const [funnelDimension, setFunnelDimension] = useState<"overall" | "by_store" | "night_loss">("overall");

  // Applied actions count
  const appliedCount = suggestedActions.filter((a) => !!a.appliedDestinationLabel).length;

  // 6 Core Real Content & Acquisition Metrics (Grounded 100% in published notes & incoming leads)
  const coreMetrics = [
    {
      label: "发布笔记数与账号",
      current: "58 篇",
      before: "46 篇",
      change: "+26.1%",
      isGood: true,
      efficiencyLabel: "爆文率 (≥1k互动)",
      efficiencyValue: "17.2% (10篇)",
      note: "三亚店22篇、青岛20篇、杭州16篇",
    },
    {
      label: "全网内容总曝光量",
      current: "44.2 万",
      before: "37.8 万",
      change: "+16.8%",
      isGood: true,
      efficiencyLabel: "篇均曝光",
      efficiencyValue: "7,620 次",
      note: "长尾搜索流量贡献 34.8% 自然曝光",
    },
    {
      label: "深度阅读与点击量",
      current: "18.6 万",
      before: "15.2 万",
      change: "+22.4%",
      isGood: true,
      efficiencyLabel: "封面平均点击率 CTR",
      efficiencyValue: "42.1%",
      note: "痛点疑问型封面点击率达 48.6%",
    },
    {
      label: "笔记总互动量 (赞/藏/评)",
      current: "28,240",
      before: "23,820",
      change: "+18.5%",
      isGood: true,
      efficiencyLabel: "综合互动率",
      efficiencyValue: "15.2%",
      note: "点赞1.64万、收藏8,900、评论2,940",
    },
    {
      label: "私信咨询发起量",
      current: "1,420 条",
      before: "1,210 条",
      change: "+17.3%",
      isGood: true,
      efficiencyLabel: "互动转私信率",
      efficiencyValue: "5.0%",
      note: "篇均带来 24.5 条意向咨询",
    },
    {
      label: "有效私信留资率与线索",
      current: "682 人 (48%)",
      before: "510 人 (42%)",
      change: "+5.9%",
      isGood: true,
      efficiencyLabel: "有效留资转化率",
      efficiencyValue: "48.0%",
      note: "提供完整手机号/微信号有效客群",
    },
  ];

  // Notes ranking data
  const notesRankingData = [
    {
      id: "note-1",
      title: "【店长换粮打卡】幼犬换粮连拉3天便便？教你7天黄金过渡法",
      author: "三亚海棠湾店长 (张店长)",
      store: "三亚海棠湾店",
      type: "专业答疑实测",
      impressions: "4.8万",
      clicks: "2.1万 (43.7%)",
      interactions: "3,820 (18.2%)",
      leads: "142",
      conversionRate: "58.2%",
      isTop: true,
      tags: ["高转化标杆", "真实出镜", "置顶引导"],
      leadRatio: "篇均产出第一",
    },
    {
      id: "note-2",
      title: "低温烘焙粮真实测评！带你看懂配料表前5位营养机密",
      author: "三亚海棠湾店长 (张店长)",
      store: "三亚海棠湾店",
      type: "专业答疑实测",
      impressions: "3.9万",
      clicks: "1.6万 (41.0%)",
      interactions: "2,940 (18.4%)",
      leads: "98",
      conversionRate: "52.4%",
      isTop: true,
      tags: ["搜索长尾", "成分党", "顾问答疑"],
      leadRatio: "长效获客",
    },
    {
      id: "note-3",
      title: "新手养狗必备：幼犬到家第1个月如何挑选主粮不踩坑",
      author: "杭州西湖概念店",
      store: "杭州西湖店",
      type: "日常科普答疑",
      impressions: "3.2万",
      clicks: "1.2万 (37.5%)",
      interactions: "1,850 (15.4%)",
      leads: "56",
      conversionRate: "48.3%",
      isTop: false,
      tags: ["新手痛点", "自测表领取"],
      leadRatio: "平稳转化",
    },
    {
      id: "note-4",
      title: "青岛万象城夏日宠粉节：到店免费领幼犬粮试吃装！",
      author: "青岛万象城体验店",
      store: "青岛万象城店",
      type: "活动优惠促销",
      impressions: "4.1万",
      clicks: "1.4万 (34.1%)",
      interactions: "2,410 (17.2%)",
      leads: "32",
      conversionRate: "28.5%",
      isTop: false,
      tags: ["泛流量偏高", "评论区无引导"],
      leadRatio: "转化偏低",
    },
    {
      id: "note-5",
      title: "特唯普全价犬粮限时买1赠1优惠券，速来私信领取",
      author: "青岛万象城体验店",
      store: "青岛万象城店",
      type: "活动优惠促销",
      impressions: "2.8万",
      clicks: "0.8万 (28.5%)",
      interactions: "980 (12.2%)",
      leads: "14",
      conversionRate: "18.2%",
      isTop: false,
      tags: ["低转化待优化", "过度硬广"],
      leadRatio: "产出极低",
    },
  ];

  const filteredNotes = notesRankingData.filter((note) => {
    if (contentFilter === "high_converting") return note.isTop;
    if (contentFilter === "qa") return note.type.includes("答疑");
    if (contentFilter === "promo") return note.type.includes("促销");
    return true;
  });

  // 24-Hour distribution
  const hourlyData = [
    { hour: "00-02", count: 28, pct: "2.0%", isNightLoss: false },
    { hour: "02-06", count: 12, pct: "0.8%", isNightLoss: false },
    { hour: "06-08", count: 45, pct: "3.2%", isNightLoss: false },
    { hour: "08-10", count: 98, pct: "6.9%", isNightLoss: false },
    { hour: "10-12", count: 142, pct: "10.0%", isNightLoss: false },
    { hour: "12-14", count: 184, pct: "13.0%", isNightLoss: false },
    { hour: "14-16", count: 126, pct: "8.9%", isNightLoss: false },
    { hour: "16-18", count: 110, pct: "7.7%", isNightLoss: false },
    { hour: "18-20", count: 180, pct: "12.7%", isNightLoss: false },
    { hour: "20-22", count: 320, pct: "22.5%", isNightLoss: true }, // Peak
    { hour: "22-24", count: 275, pct: "19.4%", isNightLoss: true }, // Peak
  ];

  return (
    <div id="single-page-review-report" className="space-y-8 pb-16 font-sans text-text-main">
      
      {/* ========================================================= */}
      {/* 1. 复盘结论 (Executive Conclusion) */}
      {/* ========================================================= */}
      <section id="section-conclusion" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-4.5 bg-btn-main rounded-sm" />
            <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
              1. 核心复盘结论
            </h2>
          </div>
          <span className="text-[12px] text-text-tertiary">
            {analysisDetails?.summary?.timeWindow || task.dateRange.label} · 覆盖 {task.projectNames.join("、")}
          </span>
        </div>

        {/* Big Conclusion Highlight Banner */}
        <div className="p-4 md:p-5 bg-surface-subtle rounded-xl border border-border-default space-y-3">
          <p className="text-[15px] md:text-[16px] font-bold text-text-main leading-relaxed">
            {coreConclusions?.overallPerformance?.title 
              ? `${coreConclusions.overallPerformance.title}。${coreConclusions.mainIssue.title}。`
              : "周期内共发布 58 篇笔记，带来 44.2 万曝光与 1,420 条私信咨询。三亚店通过‘专业答疑与实测’类笔记贡献了 54% 的高意向线索，但夜间 20:00—24:00 咨询高峰时段由于人工回复断层造成明显线索流失。"}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-[12px] pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
              <TrendingUp size={13} className="text-emerald-600" />
              <span>获客增长极：三亚店实测答疑（私信留资率 58.2%，篇均产出 34.9 条咨询）</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-semibold">
              <Clock size={13} className="text-amber-600" />
              <span>核心承接卡点：夜间 20:00—24:00 咨询集中但流失率达 52%</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-semibold">
              <Layers size={13} className="text-blue-600" />
              <span>内容规模反馈：累计发布 58 篇（爆文率 17.2% / 总曝光 44.2万）</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. 核心内容与获客指标大盘 (Content & Lead Generation Metrics) */}
      {/* ========================================================= */}
      <section id="section-metrics" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-4.5 bg-btn-main rounded-sm" />
            <div>
              <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
                2. 笔记内容运营与获客指标大盘
              </h2>
            </div>
          </div>
          <span className="text-[12px] text-text-tertiary">
            基于 58 篇笔记互动与私信真实数据 · 较上一周期环比
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {coreMetrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-surface-subtle p-3.5 rounded-xl border border-border-default shadow-2xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-semibold text-text-secondary truncate" title={m.label}>
                  {m.label}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[10.5px] font-bold px-1 py-0.2 rounded ${
                    m.isGood ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-red-700 bg-red-50 border border-red-200"
                  }`}
                >
                  {m.isGood ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span>{m.change}</span>
                </span>
              </div>

              <div>
                <div className="text-[17px] md:text-[19px] font-bold text-text-main tracking-tight font-mono">
                  {m.current}
                </div>
                <div className="text-[10.5px] text-text-tertiary font-mono mt-0.5">
                  上期基准 {m.before}
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-text-tertiary truncate">{m.efficiencyLabel}</span>
                  <span className="font-bold text-text-main font-mono shrink-0">{m.efficiencyValue}</span>
                </div>
                <div className="text-[9.5px] text-text-tertiary truncate" title={m.note}>
                  {m.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. 关键分析 (Key Analyses: 门店表现 → 内容表现 → 用户洞察 → 转化链路) */}
      {/* ========================================================= */}
      <section id="section-analyses" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
          <span className="w-2.5 h-4.5 bg-btn-main rounded-sm" />
          <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
            3. 关键业务分析（真实数据与证据归因）
          </h2>
        </div>

        {/* 3.1 门店表现与项目对比 (Store Performance) */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded">
                  分析维度一
                </span>
                <h3 className="text-[15px] font-bold text-text-main">
                  3.1 门店账号矩阵产出与获客表现
                </h3>
              </div>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                结论：三亚店长号通过真实专业答疑实现 58.2% 留资转化；青岛体验店因过度促销与夜间响应不及时导致转化效率偏低。
              </p>
            </div>

            <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[11.5px]">
              {[
                { id: "conversion", label: "有效留资率" },
                { id: "impressions", label: "发文与曝光" },
                { id: "leads", label: "互动与私信量" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setComparisonMetric(st.id as any)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    comparisonMetric === st.id
                      ? "bg-surface-1 text-text-main shadow-xs font-bold"
                      : "text-text-tertiary hover:text-text-main"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Sanya */}
            <div className="bg-surface-subtle p-4 rounded-xl border-2 border-emerald-500/30 shadow-2xs space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-600 text-white text-[10.5px] font-bold rounded-bl-lg">
                获客效率第一
              </div>
              <div className="flex items-center gap-2">
                <Store size={16} className="text-emerald-600" />
                <h4 className="text-[14px] font-bold text-text-main">三亚海棠湾店长账号</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">发文与总曝光</span>
                  <span className="font-bold text-text-main">22 篇 · 18.4 万</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">有效留资率</span>
                  <span className="font-bold text-emerald-700">58.2% (矩阵首位)</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">私信咨询总量</span>
                  <span className="font-bold text-text-main">768 条 (占54.1%)</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">篇均线索产出</span>
                  <span className="font-bold text-emerald-700">34.9 条/篇 (最高)</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[11.5px] text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Award size={13} className="text-emerald-700" />
                  <span>标杆经验证据：</span>
                </div>
                <p>店长真人实测出镜 + 评论区置顶领取《科学换粮自测表》，平均响应时效 3.2 分钟，有效承接高意向宠主。</p>
              </div>
            </div>

            {/* Qingdao */}
            <div className="bg-surface-subtle p-4 rounded-xl border border-border-default shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-amber-600" />
                  <h4 className="text-[14px] font-bold text-text-main">青岛万象城体验店账号</h4>
                </div>
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10.5px] font-bold rounded">
                  承接待优化
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">发文与总曝光</span>
                  <span className="font-bold text-text-main">20 篇 · 14.2 万</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">有效留资率</span>
                  <span className="font-bold text-amber-700">24.5% (偏低)</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">私信咨询总量</span>
                  <span className="font-bold text-text-main">362 条 (占25.5%)</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">篇均线索产出</span>
                  <span className="font-bold text-amber-700">18.1 条/篇</span>
                </div>
              </div>

              <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle text-[11.5px] text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle size={13} className="text-amber-700" />
                  <span>差距原因归因：</span>
                </div>
                <p>内容以促销海报为主，泛流量占比高；夜间无自动接待话术，平均首次响应超 45 分钟造成大量流失。</p>
              </div>
            </div>

            {/* Hangzhou */}
            <div className="bg-surface-subtle p-4 rounded-xl border border-border-default shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-blue-600" />
                  <h4 className="text-[14px] font-bold text-text-main">杭州西湖概念店账号</h4>
                </div>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10.5px] font-bold rounded">
                  平稳转化
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">发文与总曝光</span>
                  <span className="font-bold text-text-main">16 篇 · 11.6 万</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">有效留资率</span>
                  <span className="font-bold text-text-main">48.3% (中等)</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">私信咨询总量</span>
                  <span className="font-bold text-text-main">290 条 (占20.4%)</span>
                </div>
                <div className="p-2 bg-surface-1 rounded border border-border-subtle">
                  <span className="text-text-tertiary block text-[10.5px]">篇均线索产出</span>
                  <span className="font-bold text-text-main">18.1 条/篇</span>
                </div>
              </div>

              <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle text-[11.5px] text-text-secondary space-y-1">
                <span className="font-bold text-text-main block">ℹ️ 运营特征分析：</span>
                <p>日常科普类笔记互动平稳（互动率 15.4%），但缺乏搜索长尾关键词布局，需增加高搜低竞词覆盖。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3.2 内容表现与样本分析 (Content Performance) */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold rounded">
                  分析维度二
                </span>
                <h3 className="text-[15px] font-bold text-text-main">
                  3.2 内容表现与高低转化样本归因
                </h3>
              </div>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                结论：专业答疑与实测类笔记留资转化率（58.2%）是纯活动硬广（18.2%）的 3.2 倍，长尾搜索词是获客主阵地。
              </p>
            </div>

            <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[11.5px]">
              {[
                { id: "all", label: "全部样本 (58篇)" },
                { id: "high_converting", label: "⭐ 高转化标杆" },
                { id: "qa", label: "专业答疑类" },
                { id: "promo", label: "活动促销类" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setContentFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    contentFilter === f.id
                      ? "bg-surface-1 text-text-main shadow-xs font-bold"
                      : "text-text-tertiary hover:text-text-main"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* High vs Low Attributes Evidence Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[13px]">
                <CheckCircle2 size={15} />
                <span>高转化笔记关键要素 (Top 20% 样本)</span>
              </div>
              <ul className="space-y-1.5 text-text-secondary text-[11.5px] leading-relaxed">
                <li>• <strong>标题：</strong> 14-18字，以真实疑问痛点切入（如“幼犬换粮连拉3天便便？”）。</li>
                <li>• <strong>封面：</strong> 真人店长手把手温水泡粮、真实便便状态实拍，杜绝棚拍精修。</li>
                <li>• <strong>关键词：</strong> 聚焦‘幼犬软便’、‘低温烘焙粮’等月搜 10万+ 商业精准词。</li>
                <li>• <strong>转化触点：</strong> 置顶第一条评论引导领取《科学换粮自测表》私信通道。</li>
              </ul>
            </div>

            <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-red-800 text-[13px]">
                <AlertTriangle size={15} />
                <span>低转化内容问题特征 (Bottom 20% 样本)</span>
              </div>
              <ul className="space-y-1.5 text-text-secondary text-[11.5px] leading-relaxed">
                <li>• <strong>标题：</strong> 超过22字，大篇幅品牌口号，核心修饰词在移动端被截断。</li>
                <li>• <strong>封面：</strong> 纯包装棚拍精修图或商场海报，被算法判定商业硬广限制推荐。</li>
                <li>• <strong>关键词：</strong> 泛品牌词堆砌，缺乏用户主动搜索场景。</li>
                <li>• <strong>转化触点：</strong> 仅正文文末一句口播，评论区无任何互动工具承接。</li>
              </ul>
            </div>
          </div>

          {/* Note Ranking Table */}
          <div className="border border-border-default rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-subtle border-b border-border-default flex items-center justify-between text-[12px]">
              <span className="font-semibold text-text-main">代表性笔记内容与获客明细</span>
              <span className="text-text-tertiary">共 {filteredNotes.length} 篇代表样本</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-surface-subtle border-b border-border-default text-text-tertiary font-medium">
                    <th className="py-2.5 px-4">笔记标题与账号</th>
                    <th className="py-2.5 px-4">内容类型</th>
                    <th className="py-2.5 px-4">曝光量</th>
                    <th className="py-2.5 px-4">阅读与点击率</th>
                    <th className="py-2.5 px-4">互动量 (赞/藏/评)</th>
                    <th className="py-2.5 px-4">私信咨询</th>
                    <th className="py-2.5 px-4">私信留资率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle bg-surface-1">
                  {filteredNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-text-main truncate" title={note.title}>
                          {note.title}
                        </div>
                        <div className="text-[11px] text-text-tertiary flex items-center gap-1.5 mt-0.5">
                          <span>{note.author}</span>
                          {note.tags.map((t, idx) => (
                            <span key={idx} className="px-1 py-0.2 bg-surface-subtle border border-border-default rounded text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-secondary">{note.type}</td>
                      <td className="py-3 px-4 font-mono font-medium">{note.impressions}</td>
                      <td className="py-3 px-4 font-mono">{note.clicks}</td>
                      <td className="py-3 px-4 font-mono">{note.interactions}</td>
                      <td className="py-3 px-4 font-mono font-bold text-text-main">{note.leads} 条</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${note.isTop ? "text-emerald-700" : "text-text-secondary"}`}>
                          {note.conversionRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3.3 用户意图与时段洞察 (User Insights) */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold rounded">
                分析维度三
              </span>
              <h3 className="text-[15px] font-bold text-text-main">
                3.3 真实用户意图与咨询时段分布
              </h3>
            </div>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              基于 1,420 条私信会话真实文本归纳：64.2% 用户因换粮软便等急迫痛点发起咨询；全天 41.9% 的咨询发生在 20:00—24:00 夜间时段。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* User Needs */}
            <div className="bg-surface-subtle p-4 rounded-xl border border-border-default space-y-3">
              <span className="text-[13px] font-bold text-text-main block">核心咨询需求与痛点分布 (1,420条私信文本归因)</span>
              <div className="space-y-2.5 text-[12px]">
                <div>
                  <div className="flex justify-between text-[11.5px] mb-1">
                    <span className="text-text-secondary">幼犬断奶换粮 / 软便拉稀应对</span>
                    <span className="font-bold text-btn-main">64.2% (高意向)</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="bg-btn-main h-full rounded-full" style={{ width: "64.2%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11.5px] mb-1">
                    <span className="text-text-secondary">配料表成分解读 / 挑食不吃换粮</span>
                    <span className="font-bold text-blue-600">48.5%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "48.5%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11.5px] mb-1">
                    <span className="text-text-secondary">泪痕与肠胃敏感调理</span>
                    <span className="font-bold text-amber-600">32.0%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: "32%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* High ROI Search Words */}
            <div className="bg-surface-subtle p-4 rounded-xl border border-border-default space-y-3">
              <span className="text-[13px] font-bold text-text-main block">高转化长尾搜索词排名 (聚光搜索指数)</span>
              <div className="space-y-2 text-[12px]">
                {[
                  { term: "幼犬软便怎么换粮", vol: "12.8 万/月", roi: "高意向词" },
                  { term: "低温烘焙粮推荐 幼犬", vol: "9.4 万/月", roi: "高商业价值" },
                  { term: "7天换粮过渡法 表格", vol: "7.6 万/月", roi: "留资触点" },
                  { term: "金毛幼犬换粮拉稀怎么办", vol: "5.2 万/月", roi: "垂直场景" },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 bg-surface-1 rounded-lg border border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-surface-subtle border border-border-default text-[10px] flex items-center justify-center font-bold text-text-tertiary">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-text-main">{item.term}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-text-secondary">{item.vol}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 font-bold rounded">
                        {item.roi}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 24-Hour Distribution */}
          <div className="p-4 bg-surface-subtle rounded-xl border border-border-default space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <Clock size={15} className="text-btn-main" />
                <span>24小时私信咨询发生时段分布（证实夜间咨询卡点）</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold rounded">
                20:00-24:00 集中占比 41.9%
              </span>
            </div>

            <div className="grid grid-cols-11 gap-1.5 pt-2 items-end h-28">
              {hourlyData.map((h, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-mono text-text-tertiary">{h.pct}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      h.isNightLoss ? "bg-amber-500" : "bg-blue-400"
                    }`}
                    style={{ height: `${(h.count / 320) * 100}%` }}
                  />
                  <span className={`text-[9.5px] truncate w-full text-center ${h.isNightLoss ? "font-bold text-amber-700" : "text-text-tertiary"}`}>
                    {h.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3.4 转化链路与流失归因 (Conversion Funnel) */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded">
                  分析维度四
                </span>
                <h3 className="text-[15px] font-bold text-text-main">
                  3.4 笔记全链路转化漏斗与卡点归因
                </h3>
              </div>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                结论：从“发起私信”到“有效留资”流失率达 52.0%，夜间无自动接待话术是造成客群流失的直接根因。
              </p>
            </div>

            <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[11.5px]">
              {[
                { id: "overall", label: "全矩阵总漏斗" },
                { id: "by_store", label: "门店漏斗对比" },
                { id: "night_loss", label: "夜间流失高亮" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFunnelDimension(st.id as any)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    funnelDimension === st.id
                      ? "bg-surface-1 text-text-main shadow-xs font-bold"
                      : "text-text-tertiary hover:text-text-main"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-[12px]">
            {[
              { name: "1. 笔记全网曝光", val: "442,000", conv: "100%", drop: "-", color: "bg-blue-600" },
              { name: "2. 深度阅读 / 点击", val: "186,000", conv: "42.1%", drop: "流失 57.9%", color: "bg-blue-500" },
              { name: "3. 深度互动 (赞/藏/评)", val: "28,240", conv: "15.2%", drop: "流失 84.8%", color: "bg-blue-400" },
              { name: "4. 发起私信咨询", val: "1,420", conv: "5.0%", drop: "流失 95.0%", color: "bg-amber-500" },
              { name: "5. 有效留资 (手机/微信号)", val: "682", conv: "48.0%", drop: "流失 52.0% (关键卡点)", color: "bg-amber-600", isCritical: true },
              { name: "6. 意向客户建联与承接", val: "412", conv: "60.4%", drop: "流失 39.6%", color: "bg-emerald-600" },
            ].map((step, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-3 ${step.isCritical ? "bg-amber-50/50 border-amber-300" : "bg-surface-subtle border-border-subtle"}`}>
                <div className="flex items-center gap-3 w-full md:w-56 shrink-0">
                  <div className={`w-3 h-3 rounded-full ${step.color}`} />
                  <span className="font-bold text-text-main">{step.name}</span>
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className="font-mono font-bold text-text-main text-[13px]">{step.val}</span>
                  <div className="flex items-center gap-4 text-[11.5px]">
                    <span className="text-text-secondary">本层转化率: <strong className="text-text-main">{step.conv}</strong></span>
                    <span className={`px-2 py-0.5 rounded font-medium ${step.isCritical ? "bg-red-100 text-red-700 font-bold" : "text-text-tertiary"}`}>
                      {step.drop}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-subtle text-[12px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <BarChart2 size={13} className="text-brand-600" />
              <span>漏斗差异证据与归因：</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              三亚店在第 4 到第 5 步（私信 → 留资）转化率高达 <strong>58.2%</strong>，而青岛店仅 <strong>24.5%</strong>。三亚店配置了“7天换粮自测表”自动引导，而青岛店依赖人工单聊且夜间无人应答，直接证实了“夜间咨询流失”的判断依据。
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 后续迭代建议 (Follow-up Iteration Suggestions) */}
      {/* ========================================================= */}
      <section id="section-suggestions" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-4.5 bg-emerald-600 rounded-sm" />
              <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
                4. 后续迭代建议与应用去向
              </h2>
            </div>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              基于本次复盘结论，将有效经验和优化方向直接应用到下一期方案或后续笔记。
            </p>
          </div>
          <span className="text-[12px] text-text-tertiary font-medium">
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
                className="bg-surface-subtle p-4 rounded-xl border border-border-default shadow-2xs flex flex-col justify-between space-y-3 hover:border-border-strong transition-all"
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
                      <span className="px-1.5 py-0.5 bg-surface-1 text-text-secondary border border-border-default text-[10.5px] rounded">
                        {action.category}
                      </span>
                      <span className="px-1.5 py-0.5 bg-neutral-200 text-text-secondary text-[10px] rounded">
                        {isPlan ? "流程 / 策略" : "内容 / 选题"}
                      </span>
                    </div>

                    {isApplied && (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                        <Check size={11} strokeWidth={2.5} />
                        <span>{action.appliedDestinationLabel}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-semibold text-text-main">
                    {action.title}
                  </h4>

                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    <span className="text-text-tertiary font-medium">目标：</span>{action.target}
                  </p>

                  <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle text-[11.5px] text-text-secondary">
                    <span className="font-semibold text-btn-main">预期收益：</span>
                    <span>{action.expectedGain}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                  <button
                    onClick={() => onActionDetail(action)}
                    className="text-[12px] text-text-secondary hover:text-text-main font-medium flex items-center gap-1"
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
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs ${
                      isApplied
                        ? "bg-surface-1 text-text-secondary border border-border-default hover:bg-hover-bg"
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
      {/* 5. 风险与数据说明 (Risks & Data Specification - 默认折叠) */}
      {/* ========================================================= */}
      <section ref={dataSpecRef} id="section-data-spec" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={toggleDataSpec}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-4.5 bg-amber-600 rounded-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
                  5. 风险与数据说明
                </h2>
                <span className="px-2 py-0.5 bg-surface-subtle border border-border-default text-text-tertiary text-[11px] rounded">
                  默认折叠
                </span>
              </div>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                包含异常风险、分析周期、数据覆盖范围、指标计算口径与更新时间
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[12px] text-text-tertiary">
            <span>{isDataSpecOpen ? "收起明细" : "展开明细"}</span>
            {isDataSpecOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isDataSpecOpen && (
          <div className="p-5 pt-0 border-t border-border-subtle space-y-5 bg-surface-1">
            
            {/* 5.1 业务风险与异常预警 */}
            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <AlertTriangle size={15} className="text-amber-600" />
                <span>关键业务风险与异常说明</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
                <div className="p-3 bg-red-50/40 rounded-xl border border-red-200 space-y-1.5">
                  <span className="font-bold text-red-800 block">夜间时段潜客流失风险 (严重)</span>
                  <p className="text-text-secondary leading-relaxed">
                    青岛与杭州在 20:00—24:00 夜间时段无专人值守，高意向咨询由于超时无应答流失率达 52%，预估每周损失近 120+ 组意向换粮新客。
                  </p>
                </div>

                <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200 space-y-1.5">
                  <span className="font-bold text-amber-800 block">青岛店私信数据补偿校准</span>
                  <p className="text-text-secondary leading-relaxed">
                    7月15日前由于平台私信接口维护，部分会话数据存在延迟入库，系统已通过时序平滑算法完成对齐校准。
                  </p>
                </div>

                <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200 space-y-1.5">
                  <span className="font-bold text-blue-800 block">烘焙粮样本集中度提示</span>
                  <p className="text-text-secondary leading-relaxed">
                    烘焙粮品类的高转化数据主要由 2 篇核心爆款拉动，建议在后续批次中补齐 3 组对照样本以固化最佳实践。
                  </p>
                </div>
              </div>
            </div>

            {/* 5.2 数据覆盖范围与周期 */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <Database size={15} className="text-btn-main" />
                <span>数据范围与接入说明</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 bg-surface-subtle rounded-xl border border-border-default space-y-1">
                  <span className="text-text-tertiary block text-[11px]">分析周期与基准对比</span>
                  <p className="font-medium text-text-main">
                    分析周期：2026-07-01 00:00 至 2026-07-31 23:59（自然月）<br />
                    基准周期：2026-06-01 至 2026-06-30（上月环比周期）
                  </p>
                </div>

                <div className="p-3 bg-surface-subtle rounded-xl border border-border-default space-y-1">
                  <span className="text-text-tertiary block text-[11px]">覆盖账号与数据源</span>
                  <p className="font-medium text-text-main">
                    覆盖账号：三亚海棠湾店长账号、青岛万象城体验店账号、杭州西湖概念店账号（共 3 个矩阵账号，累计 58 篇笔记）<br />
                    数据源：小红书官方创作者服务平台数据、聚光推广数据、企业私信沟通会话日志
                  </p>
                </div>
              </div>
            </div>

            {/* 5.3 核心指标定义口径 */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <Info size={15} className="text-btn-main" />
                <span>核心指标定义与统计口径</span>
              </div>

              <div className="divide-y divide-border-subtle rounded-xl border border-border-default overflow-hidden text-[12px]">
                <div className="p-3 bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">封面平均点击率 CTR</span>
                  <span className="text-text-secondary">计算公式：（笔记在信息流中的实际阅读/点击打开次数）÷（笔记全网曝光展示总次数）× 100%。</span>
                </div>
                <div className="p-3 bg-surface-1 flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">综合互动率</span>
                  <span className="text-text-secondary">计算公式：（点赞数 + 收藏数 + 真实评论数）÷（笔记阅读量）× 100%（已过滤作者自身回复与系统提示）。</span>
                </div>
                <div className="p-3 bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">有效私信留资率</span>
                  <span className="text-text-secondary">分子：在私信沟通过程中提供完整微信号/手机号的有效用户数；分母：由笔记触达并主动发起私信咨询的独立访客数。</span>
                </div>
                <div className="p-3 bg-surface-1 flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">篇均线索产出</span>
                  <span className="font-bold text-text-main md:w-40 shrink-0">篇均线索产出</span>
                  <span className="text-text-secondary">计算公式：（该账号或该分类笔记带来的私信留资线索总量）÷（周期内发布的有效笔记篇数）。</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}
