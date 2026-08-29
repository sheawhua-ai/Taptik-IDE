import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, TrendingUp, TrendingDown, Users, BarChart2,
  CheckCircle2, ChevronRight, ChevronDown, ChevronUp, Layers, Database, Target,
  MessageSquare, Compass, ArrowRight, Clock, AlertTriangle, Search,
  Eye, Check, ShieldCheck, Sparkles, Filter, ExternalLink, ArrowLeft,
  Info, Award, Store
} from "lucide-react";
import { ReviewTask } from "./types";

interface ReviewDetailsTabProps {
  task: ReviewTask;
  initialTarget?: { section: "overall" | "comparison" | "content" | "user" | "funnel" | "data_spec"; filter?: string } | null;
  onBackToOverview?: () => void;
}

export function ReviewDetailsTab({
  task,
  initialTarget,
  onBackToOverview,
}: ReviewDetailsTabProps) {
  const { analysisDetails, crossProjectComparison } = task;

  // Active section tab for quick jump
  const [activeSection, setActiveSection] = useState<
    "overall" | "comparison" | "content" | "user" | "funnel" | "data_spec"
  >(initialTarget?.section || "overall");

  // Filter state inside Comparison
  const [comparisonMetric, setComparisonMetric] = useState<"conversion" | "impressions" | "leads" | "cpl">("conversion");
  
  // Filter state inside Content Performance
  const [contentFilter, setContentFilter] = useState<"all" | "high_converting" | "qa" | "promo">(
    initialTarget?.filter === "high_converting" ? "high_converting" : "all"
  );
  const [selectedNoteModal, setSelectedNoteModal] = useState<any | null>(null);

  // Filter state inside Conversion Funnel
  const [funnelDimension, setFunnelDimension] = useState<"overall" | "by_store" | "by_content" | "night_loss">(
    initialTarget?.filter === "night_loss" ? "night_loss" : "overall"
  );

  // Collapsible state for Data Specification (默认折叠)
  const [isDataSpecOpen, setIsDataSpecOpen] = useState(initialTarget?.section === "data_spec");

  // Refs for scrolling to sections
  const overallRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const funnelRef = useRef<HTMLDivElement>(null);
  const dataSpecRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTarget?.section) {
      setActiveSection(initialTarget.section);
      if (initialTarget.filter === "high_converting") {
        setContentFilter("high_converting");
      }
      if (initialTarget.filter === "night_loss") {
        setFunnelDimension("night_loss");
      }
      if (initialTarget.section === "data_spec") {
        setIsDataSpecOpen(true);
      }

      // Smooth scroll to section
      setTimeout(() => {
        const refMap = {
          overall: overallRef,
          comparison: comparisonRef,
          content: contentRef,
          user: userRef,
          funnel: funnelRef,
          data_spec: dataSpecRef,
        };
        refMap[initialTarget.section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [initialTarget]);

  const scrollTo = (section: "overall" | "comparison" | "content" | "user" | "funnel" | "data_spec") => {
    setActiveSection(section);
    if (section === "data_spec") {
      setIsDataSpecOpen(true);
    }
    const refMap = {
      overall: overallRef,
      comparison: comparisonRef,
      content: contentRef,
      user: userRef,
      funnel: funnelRef,
      data_spec: dataSpecRef,
    };
    refMap[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Mock notes ranking data
  const notesRankingData = [
    {
      id: "note-1",
      title: "【店长换粮打卡】幼犬换粮连拉3天便便？教你7天黄金过渡法",
      author: "三亚海棠湾店长 (张店长)",
      store: "三亚海棠湾店",
      type: "专业答疑实测",
      impressions: "4.8万",
      clicks: "2.1万 (43.7%)",
      interactions: "3,820",
      leads: "142",
      conversionRate: "22.4%",
      isTop: true,
      tags: ["高转化标杆", "真实出镜", "置顶引导"],
      cpl: "¥12.4",
    },
    {
      id: "note-2",
      title: "低温烘焙粮真实测评！带你看懂配料表前5位营养机密",
      author: "三亚海棠湾店长 (张店长)",
      store: "三亚海棠湾店",
      type: "专业答疑实测",
      impressions: "3.9万",
      clicks: "1.6万 (41.0%)",
      interactions: "2,940",
      leads: "98",
      conversionRate: "19.8%",
      isTop: true,
      tags: ["搜索长尾", "成分党", "顾问答疑"],
      cpl: "¥15.8",
    },
    {
      id: "note-3",
      title: "新手养狗必备：幼犬到家第1个月如何挑选主粮不踩坑",
      author: "杭州西湖概念店",
      store: "杭州西湖店",
      type: "日常科普答疑",
      impressions: "3.2万",
      clicks: "1.2万 (37.5%)",
      interactions: "1,850",
      leads: "56",
      conversionRate: "13.2%",
      isTop: false,
      tags: ["新手痛点", "到店体验券"],
      cpl: "¥21.5",
    },
    {
      id: "note-4",
      title: "青岛万象城夏日宠粉节：到店免费领幼犬粮试吃装！",
      author: "青岛万象城体验店",
      store: "青岛万象城店",
      type: "活动优惠促销",
      impressions: "4.1万",
      clicks: "1.4万 (34.1%)",
      interactions: "2,410",
      leads: "32",
      conversionRate: "7.2%",
      isTop: false,
      tags: ["泛流量偏高", "评论区无引导"],
      cpl: "¥36.2",
    },
    {
      id: "note-5",
      title: "特唯普全价犬粮限时买1赠1优惠券，速来私信领取",
      author: "青岛万象城体验店",
      store: "青岛万象城店",
      type: "活动优惠促销",
      impressions: "2.8万",
      clicks: "0.8万 (28.5%)",
      interactions: "980",
      leads: "14",
      conversionRate: "4.2%",
      isTop: false,
      tags: ["低转化待优化", "过度硬广"],
      cpl: "¥48.0",
    },
  ];

  const filteredNotes = notesRankingData.filter((note) => {
    if (contentFilter === "high_converting") return note.isTop;
    if (contentFilter === "qa") return note.type.includes("答疑");
    if (contentFilter === "promo") return note.type.includes("促销");
    return true;
  });

  // Hourly consultation distribution data (24 hours)
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
    <div className="space-y-6 pb-16 font-sans text-text-main">
      
      {/* Top Banner: Context from Overview or Navigator */}
      <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 bg-surface-subtle hover:bg-hover-bg text-text-secondary hover:text-text-main rounded-lg text-[13px] font-medium border border-border-default flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>返回概览</span>
            </button>
          )}
          <div className="h-4 w-px bg-border-default mx-1" />
          <span className="text-[13px] font-bold text-text-main flex items-center gap-1.5">
            <Compass size={15} className="text-btn-main" />
            <span>分析依据导航</span>
          </span>
        </div>

        {/* Section Pill Switcher */}
        <div className="flex flex-wrap gap-1 text-[13px]">
          {[
            { id: "overall", label: "1. 整体表现" },
            { id: "comparison", label: "2. 门店与项目对比" },
            { id: "content", label: "3. 内容表现" },
            { id: "user", label: "4. 用户洞察" },
            { id: "funnel", label: "5. 转化链路" },
            { id: "data_spec", label: "6. 数据说明" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id as any)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSection === sec.id
                  ? "bg-btn-main text-white shadow-xs"
                  : "bg-surface-subtle text-text-tertiary hover:text-text-main border border-border-default"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. 整体表现 (Overall Performance) */}
      {/* ========================================================= */}
      <div ref={overallRef} className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-btn-main rounded-full" />
            <h3 className="text-[16px] font-bold text-text-main tracking-tight">
              1. 整体表现与趋势
            </h3>
          </div>
          <span className="text-[13px] text-text-tertiary">
            本期对比上期基准 · 核心目标完成度
          </span>
        </div>

        {/* Goal completion cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-tertiary font-medium">会员拓客目标</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                达成率 113.3%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-bold text-text-main">340 人</span>
              <span className="text-[13px] text-text-tertiary">/ 目标 300 人</span>
            </div>
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-tertiary font-medium">全网内容曝光目标</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                达成率 110.5%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-bold text-text-main">44.2 万</span>
              <span className="text-[13px] text-text-tertiary">/ 目标 40.0 万</span>
            </div>
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-btn-main h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-tertiary font-medium">私信留资有效线索</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                达成率 118.3%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-bold text-text-main">682 条</span>
              <span className="text-[13px] text-text-tertiary">/ 目标 576 条</span>
            </div>
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Detailed Metric Shift Table with Attribution */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-surface-subtle border-b border-border-default flex items-center justify-between">
            <span className="text-[13px] font-semibold text-text-main">核心指标环比对照明细表</span>
            <span className="text-[13px] text-text-tertiary">已剔除异常刷量与测试数据</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-surface-subtle border-b border-border-default text-text-tertiary font-medium">
                  <th className="py-2.5 px-4">指标名称</th>
                  <th className="py-2.5 px-4">上周期基准</th>
                  <th className="py-2.5 px-4">本期数值</th>
                  <th className="py-2.5 px-4">变化幅度</th>
                  <th className="py-2.5 px-4">可验证归因依据</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(analysisDetails?.metricShifts || []).map((m, idx) => (
                  <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-4 font-semibold text-text-main">{m.metric}</td>
                    <td className="py-3 px-4 text-text-tertiary">{m.before}</td>
                    <td className="py-3 px-4 font-bold text-text-main">{m.current}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[13px] font-bold ${
                          m.isGood ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {m.isGood ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>{m.change}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline of Notable Events & Anomalies */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-main">
            <Clock size={14} className="text-btn-main" />
            <span>周期内关键波动与异常时间点记录</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700">7月14日 · 爆文自然破圈</span>
                <span className="text-[13px] text-text-tertiary">三亚海棠湾店</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                《店长换粮打卡》被小红书推荐算法收录进“幼犬软便”关键词精选流，单日产生 4.8 万自然曝光，拉动当日私信线索 +68 条。
              </p>
            </div>

            <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-700">7月22日 · 接口维护数据波动</span>
                <span className="text-[13px] text-text-tertiary">青岛万象城店</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                第三方私信系统进行网关维护 2 小时，产生短暂日志积压，已在当日 23:00 完成自动补偿校准，无有效咨询丢失。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 门店与项目对比 (Store & Project Comparison) */}
      {/* ========================================================= */}
      <div ref={comparisonRef} className="space-y-4 pt-6 border-t border-border-default">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-emerald-600 rounded-full" />
            <h3 className="text-[16px] font-bold text-text-main tracking-tight">
              2. 门店与项目对比矩阵
            </h3>
          </div>
          
          {/* Metric switcher */}
          <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[13px]">
            {[
              { id: "conversion", label: "有效转化率" },
              { id: "impressions", label: "曝光与互动" },
              { id: "leads", label: "线索与核销" },
              { id: "cpl", label: "获客成本 CPL" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setComparisonMetric(st.id as any)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  comparisonMetric === st.id
                    ? "bg-surface-1 text-text-main shadow-xs"
                    : "text-text-tertiary hover:text-text-main"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Sanya */}
          <div className="bg-surface-1 p-4 rounded-xl border-2 border-emerald-500/30 shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-600 text-white text-[13px] font-bold rounded-bl-lg">
              全矩阵标杆 · 第一
            </div>
            <div className="flex items-center gap-2">
              <Store size={16} className="text-emerald-600" />
              <h4 className="text-[14px] font-bold text-text-main">三亚海棠湾直营店</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">总曝光量</span>
                <span className="font-bold text-text-main">18.4 万 (↑30%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">有效咨询转化率</span>
                <span className="font-bold text-emerald-700">22.4% (↑22%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">留资线索</span>
                <span className="font-bold text-text-main">582 人 (占54%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">单线索获客 CPL</span>
                <span className="font-bold text-emerald-700">¥12.4 (最低)</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 text-[13px] text-text-secondary space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <Award size={13} className="text-emerald-700" />
                <span>核心支撑证据：</span>
              </div>
              <p>真人店长实测出镜 + 置顶引导《科学换粮自测表》，平均响应时效 3.2 分钟，到店核销率达 22.4%。</p>
            </div>
          </div>

          {/* Qingdao */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store size={16} className="text-amber-600" />
                <h4 className="text-[14px] font-bold text-text-main">青岛万象城体验店</h4>
              </div>
              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[13px] font-bold rounded">
                承接待优化
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">总曝光量</span>
                <span className="font-bold text-text-main">14.2 万 (↑12%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">有效咨询转化率</span>
                <span className="font-bold text-amber-700">8.1% (↓8%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">留资线索</span>
                <span className="font-bold text-text-main">310 人 (占22%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">单线索获客 CPL</span>
                <span className="font-bold text-amber-700">¥26.8 (偏高)</span>
              </div>
            </div>

            <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle text-[13px] text-text-secondary space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle size={13} className="text-amber-700" />
                <span>差距原因诊断：</span>
              </div>
              <p>内容以纯活动促销为主，泛流量占比高；夜间无自动接待，平均首次响应超 45 分钟造成严重丢单。</p>
            </div>
          </div>

          {/* Hangzhou */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store size={16} className="text-blue-600" />
                <h4 className="text-[14px] font-bold text-text-main">杭州西湖概念店</h4>
              </div>
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[13px] font-bold rounded">
                平稳过渡
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">总曝光量</span>
                <span className="font-bold text-text-main">11.6 万 (↑8%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">有效咨询转化率</span>
                <span className="font-bold text-text-main">11.8% (持平)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">留资线索</span>
                <span className="font-bold text-text-main">280 人 (占24%)</span>
              </div>
              <div className="p-2 bg-surface-subtle rounded border border-border-subtle">
                <span className="text-text-tertiary block text-[13px]">单线索获客 CPL</span>
                <span className="font-bold text-text-main">¥21.2 (适中)</span>
              </div>
            </div>

            <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle text-[13px] text-text-secondary space-y-1">
              <span className="font-bold text-text-main block">ℹ️ 运营特征分析：</span>
              <p>线下体验券核销率表现良好（14.2%），但在小红书平台缺乏长尾搜索笔记布局，增量较平稳。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. 内容表现 (Content Performance & Note Samples) */}
      {/* ========================================================= */}
      <div ref={contentRef} className="space-y-4 pt-6 border-t border-border-default">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-blue-600 rounded-full" />
            <h3 className="text-[16px] font-bold text-text-main tracking-tight">
              3. 内容表现与样本分析
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[13px]">
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

        {/* Content Type Performance Distribution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
          <div className="p-3.5 bg-surface-1 rounded-xl border border-border-default shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-700">真实答疑 / 实测笔记</span>
              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-bold">转化率 22.4%</span>
            </div>
            <p className="text-text-secondary text-[13px] leading-relaxed">
              曝光占比 42% · 完播率 62% · 前3秒带痛点实测，信任感强，长尾自然搜索流量占比达 34%。
            </p>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border-default shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-main">日常科普 / 新手避坑</span>
              <span className="px-1.5 py-0.2 bg-surface-subtle text-text-secondary rounded font-bold">转化率 14.8%</span>
            </div>
            <p className="text-text-secondary text-[13px] leading-relaxed">
              曝光占比 35% · 完播率 51% · 适合新手入门种草，置顶评论若能引导自测表则留资率可翻倍。
            </p>
          </div>

          <div className="p-3.5 bg-surface-1 rounded-xl border border-border-default shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700">优惠买赠 / 纯硬广活动</span>
              <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 rounded font-bold">转化率 4.2%</span>
            </div>
            <p className="text-text-secondary text-[13px] leading-relaxed">
              曝光占比 23% · 完播率 28% · 易被算法打上广告标签，引流多为羊毛泛流量，有效咨询转化极低。
            </p>
          </div>
        </div>

        {/* High vs Low Converting Elements Matrix */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-surface-subtle border-b border-border-default flex items-center justify-between">
            <span className="text-[13px] font-semibold text-text-main">高转化 vs 低转化内容要素对比依据</span>
            <span className="text-[13px] text-text-tertiary">基于58篇笔记特征归纳</span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[13px]">
                <CheckCircle2 size={15} />
                <span>高转化笔记特征 (Top 20% 样本)</span>
              </div>
              <ul className="space-y-1.5 text-text-secondary text-[13px] leading-relaxed">
                <li>• <strong>标题：</strong> 14-18字，痛点疑问句（如“幼犬换粮连拉3天便便？”）。</li>
                <li>• <strong>封面：</strong> 真人店长手把手温水泡粮、显色实拍真实便便状态，杜绝精修棚拍。</li>
                <li>• <strong>关键词：</strong> 聚焦‘幼犬软便’、‘低温烘焙粮’等月搜 10万+ 的长尾商业词。</li>
                <li>• <strong>转化触点：</strong> 置顶第一条评论挂“科学换粮自测表”私信领取通道。</li>
              </ul>
            </div>

            <div className="p-3.5 bg-red-50/40 rounded-xl border border-red-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-red-800 text-[13px]">
                <AlertTriangle size={15} />
                <span>低转化内容特征 (Bottom 20% 样本)</span>
              </div>
              <ul className="space-y-1.5 text-text-secondary text-[13px] leading-relaxed">
                <li>• <strong>标题：</strong> 超过22字，大篇幅品牌口号，移动端核心修饰词被省略号截断。</li>
                <li>• <strong>封面：</strong> 纯包装棚拍精修图或商场海报，算法识别为商业推销，自然流受限。</li>
                <li>• <strong>关键词：</strong> 泛品牌词堆砌，无用户搜索意图。</li>
                <li>• <strong>转化触点：</strong> 仅正文文末一句口播，评论区无任何互动回复与引导。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Notes Ranking List */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-surface-subtle border-b border-border-default flex items-center justify-between">
            <span className="text-[13px] font-semibold text-text-main">代表性笔记样本数据明细</span>
            <span className="text-[13px] text-text-tertiary">共展示 {filteredNotes.length} 篇代表样本</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-surface-subtle border-b border-border-default text-text-tertiary font-medium">
                  <th className="py-2.5 px-4">笔记标题与账号</th>
                  <th className="py-2.5 px-4">内容类型</th>
                  <th className="py-2.5 px-4">曝光量</th>
                  <th className="py-2.5 px-4">互动量</th>
                  <th className="py-2.5 px-4">私信留资</th>
                  <th className="py-2.5 px-4">到店转化率</th>
                  <th className="py-2.5 px-4">单线索 CPL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredNotes.map((note) => (
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
                    <td className="py-3 px-4 font-mono">{note.interactions}</td>
                    <td className="py-3 px-4 font-mono font-bold text-text-main">{note.leads} 条</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${note.isTop ? "text-emerald-700" : "text-text-secondary"}`}>
                        {note.conversionRate}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-text-secondary">{note.cpl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. 用户洞察 (User Insights & Behavior Distribution) */}
      {/* ========================================================= */}
      <div ref={userRef} className="space-y-4 pt-6 border-t border-border-default">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-amber-600 rounded-full" />
            <h3 className="text-[16px] font-bold text-text-main tracking-tight">
              4. 用户意图与时段洞察
            </h3>
          </div>
          <span className="text-[13px] text-text-tertiary">
            高意向咨询画像与时段分布证据
          </span>
        </div>

        {/* 2-column layout: Need Distribution + Search Intent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* User Needs */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-text-main">核心咨询需求与痛点分布</span>
              <span className="text-[13px] text-text-tertiary">基于 1,420 条私信提炼</span>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-text-secondary">幼犬断奶换粮 / 软便拉稀应对</span>
                  <span className="font-bold text-btn-main">64.2% (高意向)</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                  <div className="bg-btn-main h-full rounded-full" style={{ width: "64.2%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-text-secondary">配料表成分解读 / 挑食不吃换粮</span>
                  <span className="font-bold text-blue-600">48.5%</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "48.5%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-text-secondary">泪痕与肠胃敏感调理</span>
                  <span className="font-bold text-amber-600">32.0%</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: "32%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-text-secondary">线下门店试吃装领取与优惠券</span>
                  <span className="font-bold text-text-tertiary">21.4%</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                  <div className="bg-neutral-300 h-full rounded-full" style={{ width: "21.4%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search Intent */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-text-main">高商业价值长尾搜索词排名</span>
              <span className="text-[13px] text-text-tertiary">小红书聚光月搜指数</span>
            </div>

            <div className="space-y-2 text-[13px]">
              {[
                { term: "幼犬软便怎么换粮", vol: "12.8 万", comp: "低竞争", roi: "高 ROI" },
                { term: "低温烘焙粮推荐 幼犬", vol: "9.4 万", comp: "中竞争", roi: "极高 ROI" },
                { term: "7天换粮过渡法 表格", vol: "7.6 万", comp: "极低竞争", roi: "留资神器" },
                { term: "金毛幼犬换粮拉稀怎么办", vol: "5.2 万", comp: "低竞争", roi: "高垂直" },
              ].map((item, idx) => (
                <div key={idx} className="p-2 bg-surface-subtle rounded-lg border border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-surface-1 border border-border-default text-[13px] flex items-center justify-center font-bold text-text-tertiary">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-text-main">{item.term}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-mono text-text-secondary">{item.vol}/月</span>
                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 font-bold rounded">
                      {item.roi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 24-Hour Consultation Distribution Chart Highlighting 20:00 - 24:00 */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main">
                <Clock size={15} className="text-btn-main" />
                <span>24小时私信咨询发生时段分布（证实夜间咨询卡点）</span>
              </div>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                晚间 20:00—24:00 集中了全天 41.9% 的咨询量，是高意向潜客流失的最主要时段
              </p>
            </div>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[13px] font-bold rounded">
              夜间占比 41.9%
            </span>
          </div>

          <div className="grid grid-cols-11 gap-1.5 pt-2 items-end h-28">
            {hourlyData.map((h, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[13px] font-mono text-text-tertiary">{h.pct}</span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    h.isNightLoss
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-blue-400 hover:bg-blue-500"
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

      {/* ========================================================= */}
      {/* 5. 转化链路 (Full Funnel & Loss Analysis) */}
      {/* ========================================================= */}
      <div ref={funnelRef} className="space-y-4 pt-6 border-t border-border-default">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-emerald-600 rounded-full" />
            <h3 className="text-[16px] font-bold text-text-main tracking-tight">
              5. 全链路转化漏斗与流失分析
            </h3>
          </div>

          {/* Funnel Dimension switcher */}
          <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default text-[13px]">
            {[
              { id: "overall", label: "全矩阵总漏斗" },
              { id: "by_store", label: "门店漏斗差异" },
              { id: "by_content", label: "内容类型漏斗" },
              { id: "night_loss", label: "夜间流失时段" },
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

        {/* 6-Stage Full Funnel Visualizer */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-text-main">
              {funnelDimension === "night_loss"
                ? "夜间 20:00—24:00 转化漏斗（高流失环节高亮）"
                : funnelDimension === "by_store"
                ? "三亚店 (标杆) vs 青岛店 (流失) 漏斗对照"
                : "完整6层转化链路：曝光 → 阅读 → 互动 → 私信 → 留资 → 到店核销"}
            </span>
            <span className="text-[13px] text-text-tertiary">
              流失最严重环节：私信到有效留资 (流失率 52.0%)
            </span>
          </div>

          {/* 6 Funnel Steps */}
          <div className="space-y-2 text-[13px]">
            {[
              { name: "1. 全网曝光", val: "442,000", conv: "100%", drop: "-", color: "bg-blue-600" },
              { name: "2. 深度阅读 / 点击", val: "186,000", conv: "42.1%", drop: "流失 57.9%", color: "bg-blue-500" },
              { name: "3. 深度互动 (赞/藏/评)", val: "28,240", conv: "15.2%", drop: "流失 84.8%", color: "bg-blue-400" },
              { name: "4. 发起私信咨询", val: "1,420", conv: "5.0%", drop: "流失 95.0%", color: "bg-amber-500" },
              { name: "5. 有效留资 (手机/微信号)", val: "682", conv: "48.0%", drop: "流失 52.0% (关键卡点)", color: "bg-amber-600", isCritical: true },
              { name: "6. 线下到店核销 / 成交", val: "248", conv: "36.4%", drop: "流失 63.6%", color: "bg-emerald-600" },
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

          {/* Loss Attribution Insight Box */}
          <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-subtle text-[13px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-text-main">
              <BarChart2 size={13} className="text-brand-600" />
              <span>漏斗关键卡点验证结论：</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              三亚店在第 4 到第 5 步（私信 → 留资）转化率高达 <strong>78.2%</strong>，而青岛店仅 <strong>24.5%</strong>。差异原因在于三亚店配置了“7天换粮自测表”自动化话术引导，而青岛店依赖人工单聊且夜间无人应答，直接证实了概览中“夜间咨询流失”的判断依据。
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. 数据说明 (Data Scope & Definition - 默认折叠) */}
      {/* ========================================================= */}
      <div ref={dataSpecRef} className="space-y-4 pt-6 border-t border-border-default">
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsDataSpecOpen(!isDataSpecOpen)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Database size={16} className="text-btn-main" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-text-main">
                    6. 数据说明与指标定义口径
                  </h3>
                  <span className="px-1.5 py-0.5 bg-surface-subtle border border-border-default text-text-tertiary text-[13px] rounded">
                    {isDataSpecOpen ? "点击折叠" : "点击展开可验证说明"}
                  </span>
                </div>
                <p className="text-[13px] text-text-tertiary mt-0.5">
                  时间窗口：{analysisDetails?.summary?.timeWindow || task.dateRange.label} · 接入小红书官方API、来客私信与线下核销系统
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-text-tertiary">
              {isDataSpecOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {isDataSpecOpen && (
            <div className="p-5 border-t border-border-default space-y-5 bg-surface-1 text-[13px]">
              
              {/* Coverage & Source Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                  <span className="text-text-tertiary text-[13px] block">数据分析周期</span>
                  <span className="font-semibold text-text-main block">{analysisDetails?.summary?.timeWindow || task.dateRange.label}</span>
                </div>
                <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                  <span className="text-text-tertiary text-[13px] block">覆盖门店与项目</span>
                  <span className="font-semibold text-text-main block">{analysisDetails?.summary?.scope || task.projectNames.join('、')}</span>
                </div>
                <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                  <span className="text-text-tertiary text-[13px] block">接入数据源</span>
                  <span className="font-semibold text-text-main block">小红书官方API / 来客系统 / 线下核销</span>
                </div>
                <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                  <span className="text-text-tertiary text-[13px] block">样本容量</span>
                  <span className="font-semibold text-text-main block">58 篇笔记 / 1,420 条私信</span>
                </div>
              </div>

              {/* 5 Core Metric Formula Definitions */}
              <div className="space-y-2.5 pt-2 border-t border-border-subtle">
                <div className="flex items-center gap-1.5 font-bold text-text-main text-[13px]">
                  <Target size={14} className="text-btn-main" />
                  <span>核心指标计算公式与口径标准</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                    <span className="font-bold text-text-main">有效私信咨询率</span>
                    <div className="p-1.5 bg-surface-1 rounded border border-border-default font-mono text-[13px] text-text-secondary">
                      (提供犬龄/品种/手机号等有效线索会话数 ÷ 私信总会话量) × 100%
                    </div>
                  </div>

                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                    <span className="font-bold text-text-main">单线索获客成本 (CPL)</span>
                    <div className="p-1.5 bg-surface-1 rounded border border-border-default font-mono text-[13px] text-text-secondary">
                      (项目总预算 + 内容折算成本) ÷ 获取的有效留资线索数
                    </div>
                  </div>

                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                    <span className="font-bold text-text-main">内容综合互动率</span>
                    <div className="p-1.5 bg-surface-1 rounded border border-border-default font-mono text-[13px] text-text-secondary">
                      [(点赞数 + 收藏数 × 1.5 + 评论数 × 2) ÷ 笔记总曝光量] × 100%
                    </div>
                  </div>

                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                    <span className="font-bold text-text-main">线下到店 / 私域核销率</span>
                    <div className="p-1.5 bg-surface-1 rounded border border-border-default font-mono text-[13px] text-text-secondary">
                      (实际到店核销体验券人数 ÷ 领券留资总人数) × 100%
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Anomaly & Calibration Note */}
              <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle text-[13px] text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-text-main">
                  <Search size={13} className="text-text-tertiary" />
                  <span>缺失与异常数据校准说明：</span>
                </div>
                <p>
                  青岛店在 7月15日前部分私信日志存在接口重试延迟，系统采用加权滑动平均对缺失会话进行了平滑估算，误差在 ±1.2% 以内，结论具备统计学置信度。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
