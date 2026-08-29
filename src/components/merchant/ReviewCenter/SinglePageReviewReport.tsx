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
  const { coreConclusions, suggestedActions, analysisDetails } = task;

  // Local state for expandable data spec if not controlled from parent
  const [internalDataSpecOpen, setInternalDataSpecOpen] = useState(false);
  const isDataSpecOpen = isDataSpecExpanded !== undefined ? isDataSpecExpanded : internalDataSpecOpen;
  const toggleDataSpec = onToggleDataSpec || (() => setInternalDataSpecOpen(!internalDataSpecOpen));

  // Filter inside content performance table
  const [contentFilter, setContentFilter] = useState<"all" | "high_converting" | "qa" | "promo">("all");
  // Expandable representative samples state (default show top 3)
  const [showAllSamples, setShowAllSamples] = useState(false);

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
      label: "笔记总互动量",
      current: "28,240 次",
      before: "23,820 次",
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
    },
  ];

  const filteredNotes = notesRankingData.filter((note) => {
    if (contentFilter === "high_converting") return note.isTop;
    if (contentFilter === "qa") return note.type.includes("答疑");
    if (contentFilter === "promo") return note.type.includes("促销");
    return true;
  });

  const displayedNotes = showAllSamples ? filteredNotes : filteredNotes.slice(0, 3);

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
    <div id="single-page-review-report" className="space-y-8 pb-16 font-sans text-text-main relative">
      
      {/* ========================================================= */}
      {/* Sticky Table of Contents (报告目录) */}
      {/* ========================================================= */}
      <div className="sticky top-0 z-30 bg-surface-1/95 backdrop-blur-md border-b border-border-default px-6 py-2.5 flex items-center justify-between text-[13px] font-medium text-text-secondary shadow-2xs">
        <div className="flex items-center gap-6">
          <a 
            href="#section-conclusion" 
            onClick={(e) => { e.preventDefault(); document.getElementById('section-conclusion')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="hover:text-btn-main transition-colors font-semibold"
          >
            结论
          </a>
          <span className="text-border-default">｜</span>
          <a 
            href="#section-metrics" 
            onClick={(e) => { e.preventDefault(); document.getElementById('section-metrics')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="hover:text-btn-main transition-colors font-semibold"
          >
            关键指标
          </a>
          <span className="text-border-default">｜</span>
          <a 
            href="#section-analyses" 
            onClick={(e) => { e.preventDefault(); document.getElementById('section-analyses')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="hover:text-btn-main transition-colors font-semibold"
          >
            分析与证据
          </a>
          <span className="text-border-default">｜</span>
          <a 
            href="#section-suggestions" 
            onClick={(e) => { e.preventDefault(); document.getElementById('section-suggestions')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="hover:text-btn-main transition-colors font-semibold"
          >
            后续建议
          </a>
        </div>
        <div className="text-[13px] text-text-tertiary">
          单页纵向复盘报告锚点目录
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. 核心复盘结论 (Core Conclusions) */}
      {/* ========================================================= */}
      <section id="section-conclusion" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-4.5 bg-btn-main rounded-sm" />
            <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
              1. 核心复盘结论
            </h2>
          </div>
        </div>

        {/* Compressed Conclusion Banner (~25% height reduced) */}
        <div className="p-3.5 md:p-4 bg-surface-subtle rounded-xl border border-border-default space-y-2.5">
          <p className="text-[14.5px] md:text-[15.5px] font-bold text-text-main leading-relaxed">
            曝光稳定上升，但私信承接效率分化。内容互动正常，但青岛/杭州私信转化偏低。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[13px] pt-1">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>主要增长：三亚店专业答疑 (留资率 58.2%)</span>
            </div>
            <div className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>核心问题：夜间咨询流失 (20点-24点占比41.9%)</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>内容规模：58篇，爆文率17.2%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. 关键经营指标 (Key Operating Metrics) */}
      {/* ========================================================= */}
      <section id="section-metrics" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-4.5 bg-btn-main rounded-sm" />
            <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
              2. 关键经营指标
            </h2>
          </div>
          <span className="text-[13px] text-text-tertiary">
            基于 58 篇笔记互动与私信真实数据 · 较上一周期环比
          </span>
        </div>

        {/* 3 columns x 2 rows metric grid, compact & no truncation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {coreMetrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-surface-subtle p-3.5 rounded-xl border border-border-default shadow-2xs flex flex-col justify-between space-y-2 hover:border-border-strong transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-text-secondary">
                  {m.label}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[13px] font-bold px-1.5 py-0.5 rounded ${
                    m.isGood ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-red-700 bg-red-50 border border-red-200"
                  }`}
                >
                  {m.isGood ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <span>{m.change}</span>
                </span>
              </div>

              <div>
                <div className="text-[18px] md:text-[20px] font-bold text-text-main tracking-tight font-mono">
                  {m.current}
                </div>
                <div className="text-[13px] text-text-tertiary font-mono mt-0.5">
                  上期基准 {m.before}
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle space-y-1">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-tertiary">{m.efficiencyLabel}</span>
                  <span className="font-bold text-text-main font-mono">{m.efficiencyValue}</span>
                </div>
                <div className="text-[13px] text-text-tertiary truncate" title={m.note}>
                  {m.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. 关键分析与证据 (Key Analysis & Evidence) */}
      {/* ========================================================= */}
      <section id="section-analyses" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
          <span className="w-2.5 h-4.5 bg-btn-main rounded-sm" />
          <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
            3. 关键分析与证据
          </h2>
        </div>

        {/* 3.1 门店账号表现对比 (Store Comparison Table) */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[13px] font-bold rounded">
                3.1
              </span>
              <h3 className="text-[15px] font-bold text-text-main">
                门店账号表现对比
              </h3>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              结论：三亚海棠湾店长账号通过真实专业答疑实现最高留资率，青岛体验店因促销偏多与响应不足导致转化偏低。
            </p>
          </div>

          <div className="border border-border-default rounded-xl overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-surface-subtle border-b border-border-default text-text-tertiary font-medium">
                  <th className="py-2.5 px-4">门店账号</th>
                  <th className="py-2.5 px-4">发布数量与曝光</th>
                  <th className="py-2.5 px-4">有效留资率</th>
                  <th className="py-2.5 px-4">私信咨询量</th>
                  <th className="py-2.5 px-4">篇均线索产出</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface-1 text-text-main">
                <tr className="hover:bg-surface-subtle">
                  <td className="py-3 px-4 font-bold flex items-center gap-1.5">
                    <Store size={14} className="text-emerald-600" />
                    <span>三亚海棠湾店长账号</span>
                  </td>
                  <td className="py-3 px-4 font-mono">22 篇 · 18.4 万</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                    58.2% (全网最高)
                  </td>
                  <td className="py-3 px-4 font-mono">768 条 (54.1%)</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">34.9 条/篇</td>
                </tr>
                <tr className="hover:bg-surface-subtle">
                  <td className="py-3 px-4 font-bold flex items-center gap-1.5">
                    <Store size={14} className="text-amber-600" />
                    <span>青岛万象城体验店账号</span>
                  </td>
                  <td className="py-3 px-4 font-mono">20 篇 · 14.2 万</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-700 bg-amber-50/50">
                    24.5% (偏低卡点)
                  </td>
                  <td className="py-3 px-4 font-mono">362 条 (25.5%)</td>
                  <td className="py-3 px-4 font-mono text-amber-700">18.1 条/篇</td>
                </tr>
                <tr className="hover:bg-surface-subtle">
                  <td className="py-3 px-4 font-bold flex items-center gap-1.5">
                    <Store size={14} className="text-blue-600" />
                    <span>杭州西湖概念店账号</span>
                  </td>
                  <td className="py-3 px-4 font-mono">16 篇 · 11.6 万</td>
                  <td className="py-3 px-4 font-mono">48.3% (平稳)</td>
                  <td className="py-3 px-4 font-mono">290 条 (20.4%)</td>
                  <td className="py-3 px-4 font-mono">18.1 条/篇</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-text-secondary">
              <strong className="text-emerald-800 block mb-0.5">三亚：</strong>
              专业答疑与快速回复形成高转化。
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-text-secondary">
              <strong className="text-amber-800 block mb-0.5">青岛：</strong>
              促销内容偏多，夜间响应不足。
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-border-default text-text-secondary">
              <strong className="text-text-main block mb-0.5">杭州：</strong>
              互动稳定，但搜索关键词覆盖不足。
            </div>
          </div>
        </div>

        {/* 3.2 内容表现与高低转化样本 */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[13px] font-bold rounded">
                3.2
              </span>
              <h3 className="text-[15px] font-bold text-text-main">
                内容表现与高低转化样本
              </h3>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              结论：专业答疑与实测类笔记留资转化率（58.2%）是纯活动硬广（18.2%）的 3.2 倍，长尾搜索词是获客主阵地。
            </p>
          </div>

          {/* High vs Low Attributes Evidence Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[13px]">
                <CheckCircle2 size={15} />
                <span>高转化内容关键要素 (Top 20% 样本)</span>
              </div>
              <ul className="space-y-1.5 text-text-secondary text-[13px] leading-relaxed">
                <li>• <strong>标题：</strong> 14-18字，以真实疑问痛点切入（如“幼犬换粮连拉3天便便？”）。</li>
                <li>• <strong>封面：</strong> 真人店长手把手温水泡粮、真实便便状态实拍，杜绝棚拍精修。</li>
                <li>• <strong>关键词：</strong> 聚焦‘幼犬软便’、‘低温烘焙粮’等商业精准词。</li>
                <li>• <strong>转化触点：</strong> 置顶第一条评论引导领取《科学换粮自测表》私信通道。</li>
              </ul>
            </div>

            <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-red-800 text-[13px]">
                <AlertTriangle size={15} />
                <span>低转化内容问题特征 (Bottom 20% 样本)</span>
              </div>
              <ul className="space-y-1.5 text-text-secondary text-[13px] leading-relaxed">
                <li>• <strong>标题：</strong> 超过22字，大篇幅品牌口号，移动端易被截断。</li>
                <li>• <strong>封面：</strong> 纯包装棚拍精修图或商场海报，被算法判定商业硬广。</li>
                <li>• <strong>关键词：</strong> 泛品牌词堆砌，缺乏用户主动搜索场景。</li>
                <li>• <strong>转化触点：</strong> 仅正文文末一句口播，评论区无任何互动工具承接。</li>
              </ul>
            </div>
          </div>

          {/* Note Ranking Table with Expand/Collapse */}
          <div className="border border-border-default rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-subtle border-b border-border-default flex items-center justify-between text-[13px]">
              <span className="font-semibold text-text-main">代表性笔记内容与获客明细</span>
              <span className="text-text-tertiary">默认展示前 3 条（共 {filteredNotes.length} 条样本）</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-surface-subtle border-b border-border-default text-text-tertiary font-medium">
                    <th className="py-2.5 px-4">笔记标题与账号</th>
                    <th className="py-2.5 px-4">内容类型</th>
                    <th className="py-2.5 px-4">曝光量</th>
                    <th className="py-2.5 px-4">阅读与点击率</th>
                    <th className="py-2.5 px-4">互动量</th>
                    <th className="py-2.5 px-4">私信咨询</th>
                    <th className="py-2.5 px-4">私信留资率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle bg-surface-1">
                  {displayedNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-text-main truncate" title={note.title}>
                          {note.title}
                        </div>
                        <div className="text-[13px] text-text-tertiary flex items-center gap-1.5 mt-0.5">
                          <span>{note.author}</span>
                          {note.tags.map((t, idx) => (
                            <span key={idx} className="px-1 py-0.2 bg-surface-subtle border border-border-default rounded text-[13px]">
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
            
            {/* Expand / Collapse Button */}
            <div className="p-3 bg-surface-subtle border-t border-border-default text-center">
              <button
                onClick={() => setShowAllSamples(!showAllSamples)}
                className="text-[13px] font-semibold text-btn-main hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>{showAllSamples ? "收起部分样本" : `查看全部 ${filteredNotes.length} 条代表样本`}</span>
                {showAllSamples ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* 3.3 用户意图与咨询时段 */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[13px] font-bold rounded">
                3.3
              </span>
              <h3 className="text-[15px] font-bold text-text-main">
                用户意图与咨询时段
              </h3>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              基于 1,420 条私信会话文本归纳：64.2% 用户因换粮软便等急迫痛点发起咨询；全天 41.9% 的咨询发生在 20:00—24:00 夜间时段。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-surface-subtle p-4 rounded-xl border border-border-default space-y-3">
              <span className="text-[13px] font-bold text-text-main block">核心咨询需求与痛点分布</span>
              <div className="space-y-2.5 text-[13px]">
                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-text-secondary">幼犬断奶换粮 / 软便拉稀应对</span>
                    <span className="font-bold text-btn-main">64.2%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="bg-btn-main h-full rounded-full" style={{ width: "64.2%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-text-secondary">配料表成分解读 / 挑食不吃换粮</span>
                    <span className="font-bold text-blue-600">48.5%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "48.5%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-text-secondary">泪痕与肠胃敏感调理</span>
                    <span className="font-bold text-amber-600">32.0%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: "32%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-subtle p-4 rounded-xl border border-border-default space-y-3">
              <span className="text-[13px] font-bold text-text-main block">高转化长尾搜索词排名</span>
              <div className="space-y-2 text-[13px]">
                {[
                  { term: "幼犬软便怎么换粮", vol: "12.8 万/月", roi: "高意向词" },
                  { term: "低温烘焙粮推荐 幼犬", vol: "9.4 万/月", roi: "高商业价值" },
                  { term: "7天换粮过渡法 表格", vol: "7.6 万/月", roi: "留资触点" },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 bg-surface-1 rounded-lg border border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-surface-subtle border border-border-default text-[13px] flex items-center justify-center font-bold text-text-tertiary">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-text-main">{item.term}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
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
                <span>24小时私信咨询时段分布</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[13px] font-bold rounded">
                20:00—24:00 集中占比 41.9%
              </span>
            </div>

            <div className="grid grid-cols-11 gap-1.5 pt-2 items-end h-28">
              {hourlyData.map((h, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[13px] font-mono text-text-tertiary">{h.pct}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      h.isNightLoss ? "bg-amber-500" : "bg-blue-400"
                    }`}
                    style={{ height: `${(h.count / 320) * 100}%` }}
                  />
                  <span className={`text-[13px] truncate w-full text-center ${h.isNightLoss ? "font-bold text-amber-700" : "text-text-tertiary"}`}>
                    {h.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3.4 转化链路与流失节点 */}
        <div className="bg-surface-1 rounded-2xl border border-border-default shadow-xs p-5 md:p-6 space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[13px] font-bold rounded">
                3.4
              </span>
              <h3 className="text-[15px] font-bold text-text-main">
                转化链路与流失节点
              </h3>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              结论：从“发起私信”到“有效留资”流失率达 52.0%，夜间无自动接待话术是造成客群流失的直接根因。
            </p>
          </div>

          <div className="space-y-2 text-[13px]">
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
                  <div className="flex items-center gap-4 text-[13px]">
                    <span className="text-text-secondary">本层转化率: <strong className="text-text-main">{step.conv}</strong></span>
                    <span className={`px-2 py-0.5 rounded font-medium ${step.isCritical ? "bg-red-100 text-red-700 font-bold" : "text-text-tertiary"}`}>
                      {step.drop}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
                4. 后续迭代建议
              </h2>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              基于本次复盘结论，将有效经验和优化方向直接应用到下一期方案或后续笔记。
            </p>
          </div>
          <span className="text-[13px] text-text-tertiary font-medium">
            已应用 ({appliedCount}/{suggestedActions.length})
          </span>
        </div>

        {/* Weak Hint */}
        <div className="text-[13px] text-text-tertiary px-1">
          提示：基于当前数据估算，实际结果以下次复盘为准。
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
                        className={`px-1.5 py-0.5 text-[13px] font-bold rounded ${
                          isP0
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {action.priority}
                      </span>
                      <span className="px-1.5 py-0.5 bg-surface-1 text-text-secondary border border-border-default text-[13px] rounded">
                        {isPlan ? "流程/策略" : "内容/选题"}
                      </span>
                    </div>

                    {isApplied && (
                      <span className="text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                        <Check size={11} strokeWidth={2.5} />
                        <span>{action.appliedDestinationLabel}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-semibold text-text-main">
                    {action.title}
                  </h4>

                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    <span className="text-text-tertiary font-medium">依据：</span>{action.target}
                  </p>

                  <div className="p-2.5 bg-surface-1 rounded-lg border border-border-subtle text-[13px] text-text-secondary flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-btn-main">预期影响：</span>
                      <span>{action.expectedGain}</span>
                    </div>
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
                        ? "bg-surface-1 text-text-secondary border border-border-default hover:bg-hover-bg"
                        : "bg-btn-main text-white hover:bg-btn-main-hover"
                    }`}
                  >
                    {isPlan ? (
                      <>
                        <FolderPlus size={12} />
                        <span>{isApplied ? "查看应用位置" : "纳入项目方案"}</span>
                      </>
                    ) : (
                      <>
                        <FileText size={12} />
                        <span>{isApplied ? "查看应用位置" : "应用到后续笔记"}</span>
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
      {/* 5. 数据范围与指标口径 (Data Scope & Metric Definitions - Default Collapsed) */}
      {/* ========================================================= */}
      <section ref={dataSpecRef} id="section-data-spec" className="bg-surface-1 rounded-2xl border border-border-default shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={toggleDataSpec}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-4.5 bg-neutral-500 rounded-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] md:text-[17px] font-bold text-text-main tracking-tight">
                  数据范围与指标口径
                </h2>
                <span className="px-2 py-0.5 bg-surface-subtle border border-border-default text-text-tertiary text-[13px] rounded">
                  默认折叠
                </span>
              </div>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                包含分析周期、涉及项目和账号、样本数量、指标定义与更新时间
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[13px] text-text-tertiary">
            <span>{isDataSpecOpen ? "收起明细" : "展开明细"}</span>
            {isDataSpecOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isDataSpecOpen && (
          <div className="p-5 pt-0 border-t border-border-subtle space-y-5 bg-surface-1">
            
            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <Database size={15} className="text-btn-main" />
                <span>数据范围与分析周期</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
                <div className="p-3 bg-surface-subtle rounded-xl border border-border-default space-y-1">
                  <span className="text-text-tertiary block text-[13px]">分析周期与基准对比</span>
                  <p className="font-medium text-text-main">
                    分析周期：2026-07-01 00:00 至 2026-07-31 23:59（自然月）<br />
                    基准周期：2026-06-01 至 2026-06-30（上月环比周期）
                  </p>
                </div>

                <div className="p-3 bg-surface-subtle rounded-xl border border-border-default space-y-1">
                  <span className="text-text-tertiary block text-[13px]">覆盖账号与样本数量</span>
                  <p className="font-medium text-text-main">
                    覆盖账号：三亚海棠湾店、青岛万象城店、杭州西湖店（共 3 个账号，累计 58 篇笔记，1,420 条私信样本）<br />
                    数据更新时间：2026-08-01 04:00
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <Info size={15} className="text-btn-main" />
                <span>核心指标定义口径</span>
              </div>

              <div className="divide-y divide-border-subtle rounded-xl border border-border-default overflow-hidden text-[13px]">
                <div className="p-3 bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">封面平均点击率 CTR</span>
                  <span className="text-text-secondary">计算公式：（笔记实际阅读/点击打开次数）÷（全网曝光展示总次数）× 100%。</span>
                </div>
                <div className="p-3 bg-surface-1 flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">综合互动率</span>
                  <span className="text-text-secondary">计算公式：（点赞数 + 收藏数 + 真实评论数）÷（阅读量）× 100%。</span>
                </div>
                <div className="p-3 bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="font-bold text-text-main md:w-40 shrink-0">有效私信留资率</span>
                  <span className="text-text-secondary">分子：提供完整微信号/手机号的有效用户数；分母：由笔记触达并发起私信咨询的独立访客数。</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}
