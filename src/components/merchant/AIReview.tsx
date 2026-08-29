import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  X,
  BarChart2,
  FileText,
  CheckCircle2,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Users,
  ChevronRight,
  ExternalLink,
  Layers,
  Info,
  SlidersHorizontal,
  Share2,
  Download,
  Lock,
  Plus,
  Edit3,
  Send,
  Eye,
  Clock,
  ArrowUpRight,
  Check,
  ShieldCheck,
  MessageSquare,
  Building2,
  Copy,
  Printer,
  History,
  GitBranch,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MOCK_PROJECTS_LIST,
  MOCK_DATA_COVERAGE,
  MOCK_NOTES_LIST,
  MOCK_ACCOUNTS_MATRIX,
  MOCK_SEARCH_SNAPSHOTS,
  MOCK_DM_INQUIRY_DATA,
  MOCK_STAGE_CONCLUSIONS,
  MOCK_REPORTS_LIST,
  ProjectItem,
  NotePerformanceItem,
  SearchSnapshotItem,
  StageConclusionItem,
  MerchantReportItem,
} from "./AIReviewData";

export function AIReview() {
  // Top level controls state
  const [selectedProjectId, setSelectedProjectId] = useState<string>("p1");
  const [isMultiProjectMode, setIsMultiProjectMode] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>("2026-08-01 ~ 2026-08-20");
  const [comparePeriod, setComparePeriod] = useState<string>("较上一周期 (07-12 ~ 07-31)");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [isCoveragePopoverOpen, setIsCoveragePopoverOpen] = useState<boolean>(false);
  const [isRefreshingData, setIsRefreshingData] = useState<boolean>(false);

  // Active Main Tab: 'overview' | 'content' | 'search' | 'reports'
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'search' | 'reports'>('overview');

  // Laigu DM Data toggle state for testing
  const [laiguEnabled, setLaiguEnabled] = useState<boolean>(true);

  // Modal states
  const [selectedNoteDetail, setSelectedNoteDetail] = useState<NotePerformanceItem | null>(null);
  const [selectedEvidenceConclusion, setSelectedEvidenceConclusion] = useState<StageConclusionItem | null>(null);
  const [selectedStrategyDiff, setSelectedStrategyDiff] = useState<StageConclusionItem | null>(null);
  const [selectedSnapshotDetail, setSelectedSnapshotDetail] = useState<SearchSnapshotItem | null>(null);
  const [previewReport, setPreviewReport] = useState<MerchantReportItem | null>(null);
  const [shareReportModalItem, setShareReportModalItem] = useState<MerchantReportItem | null>(null);
  const [historyVersionModal, setHistoryVersionModal] = useState<MerchantReportItem | null>(null);

  // Proposal confirmation Toast
  const [appliedProposalToast, setAppliedProposalToast] = useState<string | null>(null);

  // Report Generation Wizard Modal state
  const [showNewReportModal, setShowNewReportModal] = useState<boolean>(false);

  const activeProject = MOCK_PROJECTS_LIST.find((p) => p.id === selectedProjectId) || MOCK_PROJECTS_LIST[0];

  // Helper for data refresh simulation
  const handleRefreshData = () => {
    setIsRefreshingData(true);
    setTimeout(() => {
      setIsRefreshingData(false);
    }, 800);
  };

  // Helper to trigger strategy proposal confirmation
  const handleConfirmStrategyProposal = (conclusion: StageConclusionItem) => {
    setSelectedStrategyDiff(null);
    setAppliedProposalToast(`已生成【下一周期 (${conclusion.impactObject})】策略修改提案！改动仅在下一个版本生效，未影响当前运行项目。`);
    setTimeout(() => setAppliedProposalToast(null), 5000);
  };

  return (
    <div className="h-full w-full bg-[#F4F6F8] text-text-primary flex flex-col overflow-hidden font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {appliedProposalToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] bg-neutral-900 text-white px-4 py-2.5 rounded-lg shadow-dialog text-[13px] flex items-center gap-2 border border-neutral-700"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{appliedProposalToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & Context Controls Bar */}
      <div className="bg-surface border-b border-border-default px-6 py-3.5 shrink-0 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[18px] font-bold text-text-primary tracking-tight">复盘与报告</h1>
              {isMultiProjectMode && (
                <span className="px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-700 text-[13px] font-semibold rounded-md">
                  多项目对比模式
                </span>
              )}
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              聚合项目、笔记、账号与搜索数据，形成可追溯的阶段复盘和商家报告。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshData}
              disabled={isRefreshingData}
              className="px-3 py-1.5 bg-surface-subtle hover:bg-surface-hover border border-border-default text-text-secondary text-[13px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} className={isRefreshingData ? "animate-spin" : ""} />
              <span>{isRefreshingData ? "同步中..." : "刷新数据"}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reports');
                setShowNewReportModal(true);
              }}
              className="px-3.5 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FileText size={14} />
              <span>生成商家报告</span>
            </button>
          </div>
        </div>

        {/* Unified Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle text-[13px]">
          {/* Project Selector */}
          <div className="flex items-center bg-surface-subtle border border-border-default rounded-lg px-2.5 py-1 gap-1.5">
            <Building2 size={13} className="text-text-tertiary" />
            <span className="text-text-tertiary font-medium">项目:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-text-primary font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {MOCK_PROJECTS_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.strategyVersion})
                </option>
              ))}
            </select>
            <label className="ml-2 pl-2 border-l border-border-default flex items-center gap-1 text-[13px] text-text-tertiary cursor-pointer hover:text-text-primary">
              <input
                type="checkbox"
                checked={isMultiProjectMode}
                onChange={(e) => setIsMultiProjectMode(e.target.checked)}
                className="rounded border-border-default text-neutral-900 focus:ring-0"
              />
              <span>横向对比</span>
            </label>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center bg-surface-subtle border border-border-default rounded-lg px-2.5 py-1 gap-1.5">
            <Calendar size={13} className="text-text-tertiary" />
            <span className="text-text-tertiary font-medium">统计周期:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-text-primary font-medium focus:outline-none cursor-pointer"
            >
              <option value="2026-08-01 ~ 2026-08-20">2026-08-01 ~ 2026-08-20 (近20天)</option>
              <option value="2026-08-01 ~ 2026-08-10">2026-08-01 ~ 2026-08-10 (近10天)</option>
              <option value="2026-07-01 ~ 2026-07-31">2026-07-01 ~ 2026-07-31 (上月整月)</option>
            </select>
          </div>

          {/* Comparison Period */}
          <div className="flex items-center bg-surface-subtle border border-border-default rounded-lg px-2.5 py-1 gap-1.5">
            <GitBranch size={13} className="text-text-tertiary" />
            <span className="text-text-tertiary font-medium">对比:</span>
            <span className="text-text-secondary">{comparePeriod}</span>
          </div>

          {/* Account Filter */}
          <div className="flex items-center bg-surface-subtle border border-border-default rounded-lg px-2.5 py-1 gap-1.5">
            <Users size={13} className="text-text-tertiary" />
            <span className="text-text-tertiary font-medium">账号:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-transparent text-text-primary font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">全部账号矩阵 (8个)</option>
              <option value="kos">仅门店KOS (2个)</option>
              <option value="koc">仅KOC体验官 (5个)</option>
              <option value="brand">仅品牌官号 (1个)</option>
            </select>
          </div>

          {/* Data Coverage Status Badge with Popover */}
          <div className="relative ml-auto">
            <button
              onClick={() => setIsCoveragePopoverOpen(!isCoveragePopoverOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-border-default hover:border-border-strong rounded-lg text-[13px] font-medium text-text-secondary transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>数据覆盖率: <strong>{MOCK_DATA_COVERAGE.coverageRate}%</strong></span>
              <span className="text-text-tertiary">({MOCK_DATA_COVERAGE.syncedNotes}/{MOCK_DATA_COVERAGE.totalNotes}篇)</span>
              <Info size={12} className="text-text-tertiary ml-0.5" />
            </button>

            {/* Coverage Popover */}
            {isCoveragePopoverOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsCoveragePopoverOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-80 bg-surface border border-border-default rounded-xl shadow-float z-40 p-3.5 text-[13px] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle font-semibold text-text-primary">
                    <span>数据覆盖率与同步状态</span>
                    <span className="text-[13px] text-text-tertiary">上次同步: {MOCK_DATA_COVERAGE.lastSyncTime}</span>
                  </div>

                  <div className="space-y-2">
                    {MOCK_DATA_COVERAGE.sources.map((src, i) => (
                      <div key={i} className="p-2 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-text-primary">{src.name}</span>
                          <span className={`text-[13px] px-1.5 py-0.5 rounded font-bold ${
                            src.status === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {src.status === 'connected' ? '正常同步' : '部分接入'}
                          </span>
                        </div>
                        <p className="text-[13px] text-text-tertiary">{src.coverageNote}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border-subtle text-[13px] text-text-tertiary space-y-1">
                    <p className="flex items-center gap-1 text-amber-700 font-medium">
                      <AlertCircle size={12} /> 未同步字段: {MOCK_DATA_COVERAGE.missingFields.join("，")}
                    </p>
                    <p>人工核销补录: 2 条记录已生效</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs Header */}
      <div className="bg-surface border-b border-border-default px-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-[13.5px] font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-neutral-900 text-text-primary'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <BarChart2 size={15} />
            <span>数据总览</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 text-[13.5px] font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'content'
                ? 'border-neutral-900 text-text-primary'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Layers size={15} />
            <span>内容表现</span>
            <span className="ml-0.5 px-1.5 py-0.2 bg-surface-subtle text-text-secondary rounded text-[13px] font-mono">
              {MOCK_NOTES_LIST.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`py-3 text-[13.5px] font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'search'
                ? 'border-neutral-900 text-text-primary'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Search size={15} />
            <span>搜索占位</span>
            <span className="ml-0.5 px-1.5 py-0.2 bg-surface-subtle text-text-secondary rounded text-[13px] font-mono">
              {MOCK_SEARCH_SNAPSHOTS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 text-[13.5px] font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-neutral-900 text-text-primary'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <FileText size={15} />
            <span>报告中心</span>
            <span className="ml-0.5 px-1.5 py-0.2 bg-surface-subtle text-text-secondary rounded text-[13px] font-mono">
              {MOCK_REPORTS_LIST.length}
            </span>
          </button>
        </div>

        {/* Laigu DM Data test toggle */}
        <div className="flex items-center gap-2 text-[13px] text-text-tertiary border-l border-border-subtle pl-4 py-2">
          <span>来鼓私信模拟:</span>
          <button
            onClick={() => setLaiguEnabled(!laiguEnabled)}
            className={`px-2 py-0.5 rounded text-[13px] font-medium transition-colors ${
              laiguEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-text-tertiary'
            }`}
          >
            {laiguEnabled ? '已接入私信接口' : '未开通私信服务'}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ==================== TAB 1: 数据总览 ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Top Stage Key Takeaway Banner */}
            <div className="bg-surface border border-border-default rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-rose-500">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded">阶段核心发现</span>
                  <span>来自小红书 18 篇笔记及搜索卡位快照分析</span>
                </div>
                <p className="text-[14px] font-semibold text-text-primary leading-relaxed">
                  “软便避坑与换粮过渡”主题笔记互动率比大纲基线高出 <strong className="text-rose-600">35.0%</strong>，带来 12 组高质量直接私信咨询。建议下一周期增加此类主题占比。
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedEvidenceConclusion(MOCK_STAGE_CONCLUSIONS[0])}
                  className="px-3 py-1.5 bg-surface-subtle hover:bg-surface-hover border border-border-default text-text-secondary text-[13px] font-medium rounded-lg transition-colors"
                >
                  查看数据依据
                </button>
                <button
                  onClick={() => setSelectedStrategyDiff(MOCK_STAGE_CONCLUSIONS[0])}
                  className="px-3.5 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded-lg transition-colors"
                >
                  生成调整提案
                </button>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Note Publishing & Sync */}
              <div className="bg-surface p-4 rounded-xl border border-border-default shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[13px] text-text-tertiary">
                  <span>实际发布笔记数</span>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[13px] font-bold">已就绪 100%</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold text-text-primary tabular-nums">20</span>
                  <span className="text-[13px] text-text-tertiary">篇</span>
                </div>
                <div className="pt-2 border-t border-border-subtle text-[13px] text-text-secondary flex justify-between">
                  <span>已同步数据: <strong>18 篇</strong></span>
                  <span className="text-emerald-600 font-semibold">90.0% 覆盖率</span>
                </div>
              </div>

              {/* Card 2: Platform Exposure & Reads */}
              <div className="bg-surface p-4 rounded-xl border border-border-default shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[13px] text-text-tertiary">
                  <span>平台实际总曝光 / 阅读</span>
                  <span className="text-emerald-600 font-semibold text-[13px] flex items-center gap-0.5">
                    <TrendingUp size={12} /> +24.5%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold text-text-primary tabular-nums">285,400</span>
                  <span className="text-[13px] text-text-tertiary">曝光</span>
                </div>
                <div className="pt-2 border-t border-border-subtle text-[13px] text-text-secondary flex justify-between">
                  <span>实际阅读: <strong>38,200</strong></span>
                  <span className="text-text-tertiary">阅读率 13.4%</span>
                </div>
              </div>

              {/* Card 3: Total Interactions */}
              <div className="bg-surface p-4 rounded-xl border border-border-default shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[13px] text-text-tertiary">
                  <span>核心互动量 (赞/藏/评)</span>
                  <span className="text-emerald-600 font-semibold text-[13px] flex items-center gap-0.5">
                    <TrendingUp size={12} /> +31.0%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold text-text-primary tabular-nums">4,850</span>
                  <span className="text-[13px] text-text-tertiary">次</span>
                </div>
                <div className="pt-2 border-t border-border-subtle text-[13px] text-text-secondary flex justify-between">
                  <span>点赞 2.1k · 收藏 1.8k</span>
                  <span className="font-semibold text-text-primary">评论 610</span>
                </div>
              </div>

              {/* Card 4: Inquiries & DM (or Fallback if not connected) */}
              <div className="bg-surface p-4 rounded-xl border border-border-default shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[13px] text-text-tertiary">
                  <span>私信与咨询指标 (来鼓)</span>
                  {laiguEnabled ? (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[13px] font-bold">已连线</span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-text-tertiary rounded text-[13px]">未开通</span>
                  )}
                </div>
                {laiguEnabled ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[26px] font-extrabold text-text-primary tabular-nums">142</span>
                      <span className="text-[13px] text-text-tertiary">组私信</span>
                    </div>
                    <div className="pt-2 border-t border-border-subtle text-[13px] text-text-secondary flex justify-between">
                      <span>有效咨询: <strong>86 组</strong></span>
                      <span className="text-emerald-600 font-semibold">首响 2.4min</span>
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <div className="text-[13px] text-text-tertiary bg-surface-subtle p-2 rounded border border-border-subtle">
                      当前账号未开通私信数据服务。评论区包含 18 条高价值意向留言。
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stage Review Conclusions Section (取代原先三张大卡片) */}
            <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-text-primary">阶段复盘结论与操盘提案</h2>
                  <p className="text-[13px] text-text-tertiary mt-0.5">
                    基于可追溯事实整理。点击“生成调整提案”可对比策略改动，确认后仅应用于下一个周期，绝不直接改动正在运行的项目。
                  </p>
                </div>
                <span className="text-[13px] text-text-tertiary font-mono">
                  需判断事项: {MOCK_STAGE_CONCLUSIONS.length} 项
                </span>
              </div>

              <div className="space-y-3">
                {MOCK_STAGE_CONCLUSIONS.map((conclusion) => (
                  <div
                    key={conclusion.id}
                    className="p-4 bg-surface-subtle hover:bg-surface border border-border-default rounded-lg transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[13px] font-bold ${
                            conclusion.type === 'proven'
                              ? 'bg-emerald-100 text-emerald-800'
                              : conclusion.type === 'suggested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {conclusion.typeLabel}
                        </span>
                        <h3 className="text-[14px] font-semibold text-text-primary">{conclusion.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedEvidenceConclusion(conclusion)}
                          className="px-2.5 py-1 bg-surface border border-border-default hover:border-border-strong text-text-secondary text-[13px] font-medium rounded transition-colors"
                        >
                          查看依据 ({conclusion.relatedNotes.length}篇)
                        </button>

                        {conclusion.type === 'proven' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAppliedProposalToast(`已确认沿用阶段经验：【${conclusion.title}】`);
                              setTimeout(() => setAppliedProposalToast(null), 4000);
                            }}
                            className="px-3 py-1 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded transition-colors"
                          >
                            确认沿用
                          </button>
                        )}

                        {conclusion.type === 'suggested' && (
                          <button
                            type="button"
                            onClick={() => setSelectedStrategyDiff(conclusion)}
                            className="px-3 py-1 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded transition-colors"
                          >
                            生成调整提案
                          </button>
                        )}

                        {conclusion.type === 'unproven' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAppliedProposalToast(`已将“挑食测试包”加入下轮验证需求中。`);
                              setTimeout(() => setAppliedProposalToast(null), 4000);
                            }}
                            className="px-3 py-1 bg-surface border border-border-default hover:bg-surface-hover text-text-primary text-[13px] font-semibold rounded transition-colors"
                          >
                            加入下轮验证
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
                      <div className="p-2.5 bg-surface rounded border border-border-subtle">
                        <span className="text-text-tertiary block text-[13px] mb-0.5">证据摘要:</span>
                        <span className="text-text-secondary">{conclusion.evidenceSummary}</span>
                      </div>
                      <div className="p-2.5 bg-surface rounded border border-border-subtle">
                        <span className="text-text-tertiary block text-[13px] mb-0.5">建议动作:</span>
                        <span className="text-text-primary font-medium">{conclusion.suggestedAction}</span>
                      </div>
                      <div className="p-2.5 bg-surface rounded border border-border-subtle">
                        <span className="text-text-tertiary block text-[13px] mb-0.5">影响对象:</span>
                        <span className="text-text-secondary">{conclusion.impactObject}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: 内容表现 ==================== */}
        {activeTab === 'content' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Note List & Filters */}
            <div className="bg-surface border border-border-default rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-text-primary">单篇笔记表现与归因 (最小分析单元)</h2>
                  <p className="text-[13px] text-text-tertiary mt-0.5">
                    每篇笔记数据均来自小红书创作者后台真实同步，支持按角色、主题与关键词筛选下钻。
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-text-tertiary">共 {MOCK_NOTES_LIST.length} 篇归因笔记</span>
                </div>
              </div>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_NOTES_LIST.map((note) => (
                  <div
                    key={note.id}
                    className="bg-surface-subtle hover:bg-surface border border-border-default hover:border-border-strong rounded-lg p-3.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                    onClick={() => setSelectedNoteDetail(note)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="px-1.5 py-0.5 bg-surface border border-border-default text-text-secondary font-medium rounded">
                          {note.accountRole} · {note.accountName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            note.status === 'top'
                              ? 'bg-rose-50 text-rose-700'
                              : note.status === 'weak'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-neutral-100 text-text-secondary'
                          }`}
                        >
                          {note.status === 'top' ? '爆款表现' : note.status === 'weak' ? '数据偏弱' : '平稳表现'}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden bg-neutral-200 shrink-0 border border-border-subtle">
                          <img src={note.coverUrl} alt={note.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[13px] font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                            {note.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-text-tertiary">
                            <span>主题: {note.topic}</span>
                            <span>·</span>
                            <span>{note.format}</span>
                            <span>·</span>
                            <span>{note.publishTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance metrics row */}
                    <div className="pt-2 border-t border-border-subtle grid grid-cols-4 gap-1 text-center text-[13px]">
                      <div>
                        <span className="text-text-tertiary block">曝光</span>
                        <strong className="text-text-primary font-mono">{(note.impressions / 1000).toFixed(1)}k</strong>
                      </div>
                      <div>
                        <span className="text-text-tertiary block">阅读</span>
                        <strong className="text-text-primary font-mono">{note.reads}</strong>
                      </div>
                      <div>
                        <span className="text-text-tertiary block">互动</span>
                        <strong className="text-text-primary font-mono">{note.interactions}</strong>
                      </div>
                      <div>
                        <span className="text-text-tertiary block">私信线索</span>
                        <strong className="text-rose-600 font-mono font-bold">{note.dmLeads}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Matrix Contribution Table */}
            <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-text-primary">账号矩阵贡献汇总</h2>
                  <p className="text-[13px] text-text-tertiary mt-0.5">各发布账号在当前项目下的发布篇数、曝光与转化明细。</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-border-default bg-surface-subtle text-text-secondary font-medium text-[13px]">
                      <th className="py-2.5 px-3">账号名称</th>
                      <th className="py-2.5 px-3">矩阵角色</th>
                      <th className="py-2.5 px-3">发稿篇数</th>
                      <th className="py-2.5 px-3">总曝光</th>
                      <th className="py-2.5 px-3">总互动</th>
                      <th className="py-2.5 px-3">私信线索</th>
                      <th className="py-2.5 px-3">Top 笔记代表作</th>
                      <th className="py-2.5 px-3">私信接入状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {MOCK_ACCOUNTS_MATRIX.map((acc) => (
                      <tr key={acc.id} className="hover:bg-surface-subtle transition-colors">
                        <td className="py-2.5 px-3 font-medium text-text-primary">{acc.accountName}</td>
                        <td className="py-2.5 px-3 text-text-secondary">{acc.role}</td>
                        <td className="py-2.5 px-3 font-mono">{acc.publishedNotes} 篇</td>
                        <td className="py-2.5 px-3 font-mono">{(acc.impressions / 1000).toFixed(1)}k</td>
                        <td className="py-2.5 px-3 font-mono">{acc.interactions}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{acc.dmLeads} 条</td>
                        <td className="py-2.5 px-3 text-text-secondary max-w-xs truncate">{acc.topNoteTitle}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[13px] font-bold ${
                            acc.laiguStatus === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-text-tertiary'
                          }`}>
                            {acc.laiguStatus === 'connected' ? '已接入来鼓' : '未授权私信'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: 搜索占位 ==================== */}
        {activeTab === 'search' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Search Positioning Disclaimer Banner */}
            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-[13px] text-blue-900 flex items-start gap-2.5">
              <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold">关于搜索占位数据的说明:</span>
                <p className="text-blue-800 leading-relaxed">
                  搜索结果受采集时间、地域和客户端推荐算法影响。本模块展示的是在<strong>指定时间和标准采集环境下得到的搜索结果快照</strong>。只有在连续多个采集周期中稳定出现，才标记为“持续占位”。
                </p>
              </div>
            </div>

            {/* Keyword Snapshots Table */}
            <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-text-primary">关键词搜索结果快照 (最新期)</h2>
                  <p className="text-[13px] text-text-tertiary mt-0.5">采集源：小红书 App 搜索 Top 50 结果快照，每日 09:00 定时抓取。</p>
                </div>
                <div className="text-[13px] text-text-tertiary">
                  监控词数: <strong>{MOCK_SEARCH_SNAPSHOTS.length}</strong> 个
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-border-default bg-surface-subtle text-text-secondary font-medium text-[13px]">
                      <th className="py-2.5 px-3">核心关键词</th>
                      <th className="py-2.5 px-3">快照采集时间</th>
                      <th className="py-2.5 px-3">采集范围</th>
                      <th className="py-2.5 px-3">本项目占位篇数</th>
                      <th className="py-2.5 px-3">占位具体位置</th>
                      <th className="py-2.5 px-3">名次变动</th>
                      <th className="py-2.5 px-3">卡位稳定性</th>
                      <th className="py-2.5 px-3">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {MOCK_SEARCH_SNAPSHOTS.map((snap) => (
                      <tr key={snap.id} className="hover:bg-surface-subtle transition-colors">
                        <td className="py-3 px-3 font-semibold text-text-primary">{snap.keyword}</td>
                        <td className="py-3 px-3 text-text-secondary text-[13px]">{snap.lastCapturedAt}</td>
                        <td className="py-3 px-3 text-text-tertiary text-[13px]">{snap.captureScope}</td>
                        <td className="py-3 px-3 font-mono font-bold text-text-primary">{snap.projectNoteCount} 篇</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {snap.rankPositions.map((pos, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-[13px] font-bold ${
                                  pos.rank <= 3
                                    ? 'bg-rose-100 text-rose-800'
                                    : pos.rank <= 10
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-neutral-100 text-text-secondary'
                                }`}
                              >
                                第 #{pos.rank} 位
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold font-mono">
                          <span className={snap.rankDiff.includes('↑') ? 'text-emerald-600' : 'text-text-primary'}>
                            {snap.rankDiff}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {snap.isStable ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[13px] font-bold border border-emerald-200">
                              持续卡位 (2期+)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-neutral-100 text-text-tertiary rounded text-[13px]">
                              最新上榜
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => setSelectedSnapshotDetail(snap)}
                            className="px-2.5 py-1 bg-surface border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary rounded text-[13px] transition-colors"
                          >
                            查看快照详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: 报告中心 ==================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header & Sub-actions */}
            <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-[16px] font-semibold text-text-primary">商家报告中心</h2>
                <p className="text-[13px] text-text-tertiary mt-0.5">
                  基于结构化事实与 Agent 辅助生成可读 HTML 商家报告，支持在线预览、自然语言修改与版本管理。
                </p>
              </div>

              <button
                onClick={() => setShowNewReportModal(true)}
                className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus size={15} />
                <span>新建商家报告</span>
              </button>
            </div>

            {/* Reports List */}
            <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <h3 className="text-[14px] font-semibold text-text-primary">已生成的报告与草稿 ({MOCK_REPORTS_LIST.length})</h3>
                <span className="text-[13px] text-text-tertiary">所有报告版本确认后生成快照，不受后续后台数据更新影响</span>
              </div>

              <div className="space-y-3">
                {MOCK_REPORTS_LIST.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 bg-surface-subtle hover:bg-surface border border-border-default rounded-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[13px] font-bold ${
                          rep.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-text-secondary'
                        }`}>
                          {rep.status === 'published' ? '已生成不可变快照' : '草稿版本'}
                        </span>
                        <span className="text-[13px] text-text-tertiary font-mono">{rep.version}</span>
                        <span className="text-[13px] text-text-tertiary">· {rep.createdAt}</span>
                      </div>
                      <h4 className="text-[14px] font-semibold text-text-primary truncate">{rep.title}</h4>
                      <p className="text-[13px] text-text-tertiary line-clamp-1">{rep.executiveSummary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPreviewReport(rep)}
                        className="px-3 py-1.5 bg-surface border border-border-default hover:border-border-strong text-text-primary text-[13px] font-medium rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Eye size={13} />
                        <span>预览报告</span>
                      </button>

                      <button
                        onClick={() => setShareReportModalItem(rep)}
                        className="px-3 py-1.5 bg-surface border border-border-default hover:border-border-strong text-text-secondary text-[13px] font-medium rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Share2 size={13} />
                        <span>分享</span>
                      </button>

                      <button
                        onClick={() => setHistoryVersionModal(rep)}
                        className="px-2.5 py-1.5 bg-surface-subtle border border-border-default text-text-tertiary hover:text-text-primary rounded-lg text-[13px]"
                        title="历史版本对比"
                      >
                        <History size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================== MODAL 1: Note Detail & Evidence Modal ==================== */}
      <AnimatePresence>
        {selectedNoteDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">单篇笔记归因与明细数据</h3>
                  <p className="text-[13px] text-text-tertiary mt-0.5">笔记 ID: {selectedNoteDetail.id} · 来源: 小红书创作者后台接口</p>
                </div>
                <button onClick={() => setSelectedNoteDetail(null)} className="text-text-tertiary hover:text-text-primary p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
                <div className="flex gap-4 p-3 bg-surface-subtle rounded-lg border border-border-subtle">
                  <img src={selectedNoteDetail.coverUrl} alt={selectedNoteDetail.title} className="w-20 h-20 rounded object-cover border border-border-subtle shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-text-primary text-[14px] leading-snug">{selectedNoteDetail.title}</h4>
                    <div className="text-[13px] text-text-tertiary">
                      发布账号: <strong>{selectedNoteDetail.accountName}</strong> ({selectedNoteDetail.accountRole})
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-text-tertiary pt-1">
                      <span>主题: {selectedNoteDetail.topic}</span>
                      <span>·</span>
                      <span>格式: {selectedNoteDetail.format}</span>
                      <span>·</span>
                      <span>发布时间: {selectedNoteDetail.publishTime}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle">
                    <span className="text-[13px] text-text-tertiary block">曝光量</span>
                    <strong className="text-[16px] text-text-primary font-mono">{selectedNoteDetail.impressions}</strong>
                  </div>
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle">
                    <span className="text-[13px] text-text-tertiary block">阅读量</span>
                    <strong className="text-[16px] text-text-primary font-mono">{selectedNoteDetail.reads}</strong>
                  </div>
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle">
                    <span className="text-[13px] text-text-tertiary block">互动量 (赞/藏/评)</span>
                    <strong className="text-[16px] text-text-primary font-mono">{selectedNoteDetail.interactions}</strong>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="text-[13px] text-rose-700 block">私信/咨询线索</span>
                    <strong className="text-[16px] text-rose-700 font-mono font-extrabold">{selectedNoteDetail.dmLeads} 条</strong>
                  </div>
                </div>

                <div className="space-y-1.5 p-3 bg-surface-subtle rounded-lg border border-border-subtle">
                  <span className="font-medium text-text-primary block">关联搜索关键词:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedNoteDetail.keywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-surface border border-border-default rounded text-[13px] text-text-secondary">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[13px] text-text-tertiary flex items-center justify-between border-t border-border-subtle pt-3">
                  <span>数据真实性状态: <strong>{selectedNoteDetail.dataQuality}</strong></span>
                  <span>可追溯原始链接已关联</span>
                </div>
              </div>

              <div className="p-4 border-t border-border-default bg-surface-subtle flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedNoteDetail(null)}
                  className="px-4 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded-lg"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 2: Stage Conclusion Evidence Modal ==================== */}
      <AnimatePresence>
        {selectedEvidenceConclusion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">结论数据依据与归因列表</h3>
                  <p className="text-[13px] text-text-tertiary mt-0.5">包含底层关联笔记、互动数据与搜索快照证据</p>
                </div>
                <button onClick={() => setSelectedEvidenceConclusion(null)} className="text-text-tertiary hover:text-text-primary p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
                <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                  <span className="text-[13px] font-bold text-text-tertiary block">复盘结论:</span>
                  <p className="font-semibold text-text-primary">{selectedEvidenceConclusion.title}</p>
                  <p className="text-[13px] text-text-tertiary pt-1">覆盖范围: {selectedEvidenceConclusion.coverageScope}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-medium text-text-primary block">支持该结论的原始笔记证据 ({selectedEvidenceConclusion.relatedNotes.length} 篇)：</span>
                  {selectedEvidenceConclusion.relatedNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-surface border border-border-default rounded-lg flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={note.coverUrl} alt={note.title} className="w-10 h-10 rounded object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary truncate text-[13px]">{note.title}</p>
                          <p className="text-[13px] text-text-tertiary">{note.accountName} · 曝光 {note.impressions} · 互动 {note.interactions}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-rose-600 shrink-0 text-[13px]">{note.dmLeads} 条私信</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-border-default bg-surface-subtle flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvidenceConclusion(null)}
                  className="px-4 py-1.5 bg-action-primary text-white text-[13px] font-semibold rounded-lg"
                >
                  确认返回
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 3: Strategy Proposal Diff Modal ==================== */}
      <AnimatePresence>
        {selectedStrategyDiff && selectedStrategyDiff.strategyDiff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">生成下一周期策略修改提案 (Diff 对比)</h3>
                  <p className="text-[13px] text-text-tertiary mt-0.5">改动仅生成修改提案，须由您确认后才在下一周期生效，不影响运行中项目</p>
                </div>
                <button onClick={() => setSelectedStrategyDiff(null)} className="text-text-tertiary hover:text-text-primary p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
                {/* Diff Side by Side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg space-y-1">
                    <span className="text-[13px] font-bold text-rose-700 block">当前运行打法 (v2.1)</span>
                    <p className="text-text-primary font-medium">{selectedStrategyDiff.strategyDiff.currentStrategy}</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg space-y-1">
                    <span className="text-[13px] font-bold text-emerald-700 block">建议调整打法 (v2.2 提案)</span>
                    <p className="text-text-primary font-medium">{selectedStrategyDiff.strategyDiff.suggestedStrategy}</p>
                  </div>
                </div>

                <div className="space-y-2 p-3.5 bg-surface-subtle rounded-lg border border-border-subtle">
                  <div>
                    <span className="text-text-tertiary text-[13px] block">修改理由:</span>
                    <span className="text-text-primary">{selectedStrategyDiff.strategyDiff.reason}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[13px] block">数据依据:</span>
                    <span className="text-text-secondary">{selectedStrategyDiff.strategyDiff.dataEvidence}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[13px] block">影响对象:</span>
                    <span className="text-text-secondary">{selectedStrategyDiff.strategyDiff.impactedScope}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[13px] block">生效周期:</span>
                    <span className="text-emerald-700 font-semibold">{selectedStrategyDiff.strategyDiff.effectivePeriod}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-lg text-[13px] flex items-center gap-2">
                  <Info size={14} className="shrink-0" />
                  <span>本修改提案将被记录在项目策略版本库中，且随时支持撤销与还原。</span>
                </div>
              </div>

              <div className="p-4 border-t border-border-default bg-surface-subtle flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStrategyDiff(null)}
                  className="px-3.5 py-1.5 text-[13px] text-text-secondary hover:text-text-primary"
                >
                  放弃修改
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmStrategyProposal(selectedStrategyDiff)}
                  className="px-4 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded-lg"
                >
                  确认将提案应用到下一周期打法
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 4: Search Snapshot Detail Modal ==================== */}
      <AnimatePresence>
        {selectedSnapshotDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">搜索结果快照明细: #{selectedSnapshotDetail.keyword}</h3>
                  <p className="text-[13px] text-text-tertiary mt-0.5">采集时间: {selectedSnapshotDetail.lastCapturedAt}</p>
                </div>
                <button onClick={() => setSelectedSnapshotDetail(null)} className="text-text-tertiary hover:text-text-primary p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
                <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle space-y-1">
                  <span className="text-[13px] text-text-tertiary block">采集环境说明:</span>
                  <p className="text-text-secondary">小红书 App 最新推荐与搜索算法，关键词“{selectedSnapshotDetail.keyword}”前 50 位快照。</p>
                </div>

                <div className="space-y-2">
                  <span className="font-medium text-text-primary block">占位笔记详情：</span>
                  {selectedSnapshotDetail.rankPositions.map((item, idx) => (
                    <div key={idx} className="p-3 bg-surface border border-border-default rounded-lg flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[13px] font-bold rounded">第 #{item.rank} 位</span>
                          <span className="font-medium text-text-primary">{item.noteTitle}</span>
                        </div>
                        <span className="text-[13px] text-text-tertiary mt-1 block">发布账号: {item.accountName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-border-default bg-surface-subtle flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSnapshotDetail(null)}
                  className="px-4 py-1.5 bg-action-primary text-white text-[13px] font-semibold rounded-lg"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 5: Standalone HTML Merchant Report Preview Modal ==================== */}
      <AnimatePresence>
        {previewReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#FFFFFF] rounded-xl shadow-dialog w-full max-w-4xl min-h-[90vh] flex flex-col overflow-hidden text-[#191C20]">
              {/* Report Preview Header Toolbar */}
              <div className="bg-[#191C20] text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <h3 className="text-[14px] font-semibold">商家报告独立预览 (客户视角 HTML 渲染)</h3>
                    <p className="text-[13px] text-neutral-400">版本: {previewReport.version} · 不含内部工程结构与日志</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[13px] rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Printer size={13} />
                    <span>打印/导出 PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setShareReportModalItem(previewReport);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[13px] rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Share2 size={13} />
                    <span>生成分享链接</span>
                  </button>
                  <button onClick={() => setPreviewReport(null)} className="p-1 text-neutral-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Natural Language Report Editing Input Bar */}
              <div className="bg-[#F8F9FA] border-b border-[#E0E4E8] p-3 px-6 flex items-center gap-3 shrink-0">
                <Sparkles size={16} className="text-rose-600 shrink-0" />
                <input
                  type="text"
                  placeholder="用自然语言要求 AI 修改此报告... (如: 将结论第二条语气修改得更平实，并强调曝光对比)"
                  className="flex-1 bg-white border border-[#E0E4E8] rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-neutral-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      alert("AI 助手已接收修改要求，更新报告 Diff 渲染中...");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => alert("AI 助手已接收修改要求，更新报告 Diff 渲染中...")}
                  className="px-3 py-1.5 bg-action-primary text-white text-[13px] font-semibold rounded-lg flex items-center gap-1"
                >
                  <Send size={12} />
                  <span>应用调整</span>
                </button>
              </div>

              {/* Clean HTML Merchant Paper Layout */}
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto space-y-8 bg-[#FFFFFF] max-w-3xl mx-auto w-full text-[13px] leading-relaxed">
                {/* Document Title Header */}
                <div className="border-b-2 border-neutral-900 pb-6 space-y-2">
                  <div className="flex items-center justify-between text-[13px] text-neutral-500 uppercase tracking-wider font-semibold">
                    <span>TapTik 品牌运营复盘报告</span>
                    <span>覆盖率: {previewReport.coverageRate}%</span>
                  </div>
                  <h1 className="text-[22px] font-bold text-neutral-900 leading-tight">{previewReport.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-neutral-600 pt-2">
                    <span>项目: <strong>{previewReport.projectName}</strong></span>
                    <span>周期: {previewReport.dateRange}</span>
                    <span>接收方: {previewReport.recipientRole}</span>
                  </div>
                </div>

                {/* Section 1: Executive Summary */}
                <div className="space-y-2">
                  <h2 className="text-[15px] font-bold text-neutral-900 border-l-3 border-neutral-900 pl-2.5">
                    一、 阶段工作与结果摘要
                  </h2>
                  <p className="text-neutral-700 bg-[#F8F9FA] p-4 rounded-lg border border-[#EDF0F2]">
                    {previewReport.executiveSummary}
                  </p>
                </div>

                {/* Section 2: Key Metrics Table */}
                <div className="space-y-3">
                  <h2 className="text-[15px] font-bold text-neutral-900 border-l-3 border-neutral-900 pl-2.5">
                    二、 核心指标数据表 (小红书 API 平台同步)
                  </h2>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-[#F8F9FA] border border-[#EDF0F2] rounded-lg">
                      <span className="text-[13px] text-neutral-500 block">实际发稿量</span>
                      <strong className="text-[18px] text-neutral-900 font-mono">20 篇</strong>
                    </div>
                    <div className="p-3 bg-[#F8F9FA] border border-[#EDF0F2] rounded-lg">
                      <span className="text-[13px] text-neutral-500 block">平台曝光量</span>
                      <strong className="text-[18px] text-neutral-900 font-mono">285,400</strong>
                    </div>
                    <div className="p-3 bg-[#F8F9FA] border border-[#EDF0F2] rounded-lg">
                      <span className="text-[13px] text-neutral-500 block">总互动量 (赞/藏/评)</span>
                      <strong className="text-[18px] text-neutral-900 font-mono">4,850</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Key Takeaways & Recommendations */}
                <div className="space-y-3">
                  <h2 className="text-[15px] font-bold text-neutral-900 border-l-3 border-neutral-900 pl-2.5">
                    三、 阶段复盘结论与下一周期建议
                  </h2>
                  <div className="space-y-2">
                    {previewReport.keyTakeaways.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-neutral-800">
                        <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center font-mono font-bold text-[13px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Data Sources Disclaimer */}
                <div className="pt-6 border-t border-[#EDF0F2] text-[13px] text-neutral-500 space-y-1">
                  <p className="font-semibold text-neutral-700">数据口径与来源说明:</p>
                  <p>1. 笔记曝光与互动量来自小红书创作者后台官方接口数据同步。</p>
                  <p>2. 搜索卡位为在指定时间和采集环境下的搜索结果快照。</p>
                  <p>3. 本报告生成于 {previewReport.createdAt}，生成后已锁定快照，确保呈现内容不受后续数据静默变更。</p>
                </div>
              </div>

              {/* Report Preview Footer */}
              <div className="bg-[#F8F9FA] border-t border-[#E0E4E8] p-4 px-6 flex items-center justify-between shrink-0">
                <span className="text-[13px] text-neutral-500">TapTik HTML 商家报告引擎 v2.0</span>
                <button
                  onClick={() => {
                    setPreviewReport(null);
                    setAppliedProposalToast("报告已锁定保存！");
                    setTimeout(() => setAppliedProposalToast(null), 3000);
                  }}
                  className="px-5 py-2 bg-action-primary text-white text-[13px] font-semibold rounded-lg hover:bg-action-primary-hover transition-colors"
                >
                  确认锁存版本
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 6: Share Link Modal ==================== */}
      <AnimatePresence>
        {shareReportModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-md p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-text-primary">生成商家报告分享链接</h3>
                <button onClick={() => setShareReportModalItem(null)} className="text-text-tertiary hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">专属访问链接:</label>
                  <div className="flex items-center gap-1 bg-surface-subtle border border-border-default rounded-lg p-2 font-mono text-[13px] text-text-primary">
                    <span className="truncate flex-1">https://taptik.com/report/share/v1_8a9f2</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://taptik.com/report/share/v1_8a9f2");
                        alert("分享链接已复制到剪贴板！");
                      }}
                      className="px-2 py-1 bg-surface border border-border-default rounded hover:bg-surface-hover text-text-secondary font-sans text-[13px]"
                    >
                      复制
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">有效期:</label>
                    <select className="w-full px-2.5 py-1.5 bg-surface border border-border-default rounded-lg text-[13px]">
                      <option value="7">7 天有效</option>
                      <option value="30">30 天有效</option>
                      <option value="permanent">永久有效</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">权限设置:</label>
                    <select className="w-full px-2.5 py-1.5 bg-surface border border-border-default rounded-lg text-[13px]">
                      <option value="public">无需密码公开访问</option>
                      <option value="password">需要访问密码</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-border-subtle pt-3">
                <button
                  type="button"
                  onClick={() => setShareReportModalItem(null)}
                  className="px-4 py-1.5 bg-action-primary text-white text-[13px] font-semibold rounded-lg"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 7: History Version Modal ==================== */}
      <AnimatePresence>
        {historyVersionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-text-primary">报告历史版本记录</h3>
                <button onClick={() => setHistoryVersionModal(null)} className="text-text-tertiary hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 text-[13px] max-h-60 overflow-y-auto">
                <div className="p-3 bg-surface-subtle border border-border-default rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text-primary">v1.0 (最新快照)</div>
                    <div className="text-[13px] text-text-tertiary">2026-08-21 10:00 · 操盘手手动锁存</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[13px] font-bold rounded">当前在线</span>
                </div>
                <div className="p-3 bg-surface border border-border-subtle rounded-lg flex items-center justify-between text-text-secondary">
                  <div>
                    <div className="font-medium">v0.2 (系统生成草稿)</div>
                    <div className="text-[13px] text-text-tertiary">2026-08-20 18:30 · 包含初版意见</div>
                  </div>
                  <button onClick={() => alert("还原至 v0.2 草稿")} className="text-[13px] text-text-primary hover:underline">
                    查看草稿
                  </button>
                </div>
              </div>

              <div className="flex justify-end border-t border-border-subtle pt-2">
                <button
                  type="button"
                  onClick={() => setHistoryVersionModal(null)}
                  className="px-4 py-1.5 bg-action-primary text-white text-[13px] font-semibold rounded-lg"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 8: New Report Creation Wizard Modal ==================== */}
      <AnimatePresence>
        {showNewReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">新建商家运营报告</h3>
                  <p className="text-[13px] text-text-tertiary mt-0.5">选择统计范围与配置章节，智能汇总生成报告草稿</p>
                </div>
                <button onClick={() => setShowNewReportModal(false)} className="text-text-tertiary hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">项目范围:</label>
                  <select className="w-full px-3 py-1.5 bg-surface border border-border-default rounded-lg text-[13px]">
                    <option value="p1">幼犬换粮软便卡位项目 (v2.1体验测评打法)</option>
                    <option value="p2">猫粮肠胃敏感科普项目 (v1.4打法)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">时间周期:</label>
                    <input type="text" defaultValue="2026-08-01 ~ 2026-08-20" className="w-full px-3 py-1.5 bg-surface border border-border-default rounded-lg text-[13px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-1">接收对象:</label>
                    <select className="w-full px-3 py-1.5 bg-surface border border-border-default rounded-lg text-[13px]">
                      <option value="merchant">商家决策层</option>
                      <option value="team">运营项目组</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">包含章节配置:</label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-surface-subtle border border-border-subtle rounded-lg text-[13px]">
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                      <span>项目与统计范围</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                      <span>核心结果总览</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                      <span>内容表现与归因</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                      <span>关键词搜索占位</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                      <span>私信与咨询线索</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                      <span>阶段复盘与建议</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-3.5 py-1.5 text-[13px] text-text-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewReportModal(false);
                    setPreviewReport(MOCK_REPORTS_LIST[0]);
                  }}
                  className="px-4 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white text-[13px] font-semibold rounded-lg flex items-center gap-1"
                >
                  <Sparkles size={13} />
                  <span>生成并预览报告</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
