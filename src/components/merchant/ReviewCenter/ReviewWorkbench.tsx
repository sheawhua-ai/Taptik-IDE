import React, { useMemo, useState } from "react";
import {
  ArrowRight, BarChart3, Bot, CheckCircle2, Clock, Database, Download,
  ExternalLink, FileText, Info, Layers, MessageCircle, PanelLeftOpen,
  RefreshCw, Search, Settings2, ShieldAlert, Sparkles, Target, TrendingUp,
  Trash2, Users, Workflow, X
} from "lucide-react";
import { INITIAL_REVIEW_TASKS } from "./mockData";
import type { ReviewTask, SuggestedAction } from "./types";
import { ReviewTaskList } from "./ReviewTaskList";
import { CreateReviewTaskModal } from "./CreateReviewTaskModal";
import { ExportReportModal } from "./ExportReportModal";
import { formatChineseDate } from "../../../utils/formatDate";
import { ALL_REVIEW_DIRECTION_IDS, REVIEW_DIRECTION_DEFINITIONS } from "./reviewDirections";

interface ReviewWorkbenchProps {
  onNavigateToExecution?: () => void;
  onNavigateToPlan?: () => void;
  onNavigateToSkills?: () => void;
}

const REPORT_TREND = [
  { label: "第1周", exposure: 58, interaction: 42 },
  { label: "第2周", exposure: 66, interaction: 48 },
  { label: "第3周", exposure: 62, interaction: 56 },
  { label: "第4周", exposure: 82, interaction: 67 },
  { label: "本周", exposure: 91, interaction: 74 }
];

function TrendChart() {
  const points = (key: "exposure" | "interaction") => REPORT_TREND.map((item, index) => `${34 + index * 128},${116 - item[key]}`).join(" ");
  return (
    <div className="rounded-xl border border-border-default bg-surface-1 p-4">
      <div className="flex items-start justify-between gap-3">
        <div><div className="text-[13px] font-semibold text-text-main">内容表现趋势</div><div className="mt-1 text-[13px] text-text-tertiary">按相同观察窗口归一化，首周 = 100</div></div>
        <div className="flex gap-3 text-[13px] text-text-secondary"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-blue-600" />曝光指数</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500" />互动指数</span></div>
      </div>
      <svg viewBox="0 0 580 150" className="mt-3 h-36 w-full" role="img" aria-label="曝光与互动趋势折线图">
        {[30, 60, 90, 120].map(y => <line key={y} x1="28" x2="560" y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />)}
        <polyline points={points("exposure")} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={points("interaction")} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {REPORT_TREND.map((item, index) => <g key={item.label}><circle cx={34 + index * 128} cy={116 - item.exposure} r="4" fill="#2563eb" /><circle cx={34 + index * 128} cy={116 - item.interaction} r="4" fill="#10b981" /><text x={34 + index * 128} y="142" textAnchor="middle" fontSize="10" fill="#94a3b8">{item.label}</text></g>)}
      </svg>
    </div>
  );
}

function DistributionChart({ sampleCount }: { sampleCount: number }) {
  const items = [
    { label: "高表现", value: Math.max(1, Math.round(sampleCount * 0.21)), width: 86, color: "bg-blue-600" },
    { label: "正常表现", value: Math.max(1, Math.round(sampleCount * 0.6)), width: 64, color: "bg-slate-500" },
    { label: "待优化", value: Math.max(1, Math.round(sampleCount * 0.19)), width: 38, color: "bg-amber-500" }
  ];
  return <div className="rounded-xl border border-border-default bg-surface-1 p-4"><div className="text-[13px] font-semibold text-text-main">笔记表现分层</div><div className="mt-1 text-[13px] text-text-tertiary">按曝光、互动与咨询质量综合分层</div><div className="mt-5 space-y-4">{items.map(item => <div key={item.label}><div className="mb-1.5 flex items-center justify-between text-[13px]"><span className="text-text-secondary">{item.label}</span><strong className="text-text-main">{item.value} 篇</strong></div><div className="h-2 rounded-full bg-surface-subtle"><div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.width}%` }} /></div></div>)}</div><div className="mt-5 rounded-lg bg-blue-50 px-3 py-2 text-[13px] leading-5 text-blue-900">高表现内容集中在“真实体验 + 专业解释 + 明确承接”组合。</div></div>;
}

const QUESTION_TITLES: Record<string, string> = {
  "rev-task-1": "哪些门店打法值得复制到下一轮？",
  "rev-task-2": "店长号与KOC协同是否提升了换粮内容表现？",
  "rev-task-3": "华东门店获客差异来自内容还是数据缺口？",
  "rev-task-4": "核心搜索词卡位是否有效，下一轮应该继续攻哪些词？"
};

const TASK_SCOPE_NAMES: Record<string, string[]> = {
  "rev-task-1": ["Q2门店会员增长方案", "华东顾问答疑方案", "到店承接优化方案"],
  "rev-task-2": ["幼犬换粮搜索卡位第三轮"],
  "rev-task-3": ["华东门店获客方案·7月", "体验内容矩阵·7月", "同城搜索承接方案"],
  "rev-task-4": ["核心品牌词搜索卡位方案"]
};

const INITIAL_TASKS = [
  INITIAL_REVIEW_TASKS[3],
  INITIAL_REVIEW_TASKS[1],
  INITIAL_REVIEW_TASKS[2],
  INITIAL_REVIEW_TASKS[0]
].filter(Boolean).map(task => ({
  ...task,
  title: QUESTION_TITLES[task.id] || task.title,
  projectNames: TASK_SCOPE_NAMES[task.id] || task.projectNames
}));

function statusMeta(task: ReviewTask) {
  if (task.status === "analyzing") return { label: "分析中", className: "border-blue-200 bg-blue-50 text-blue-700" };
  if (task.status === "exception") return { label: "数据不足", className: "border-rose-200 bg-rose-50 text-rose-700" };
  return { label: "已完成", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
}

export function ReviewWorkbench({ onNavigateToExecution, onNavigateToPlan, onNavigateToSkills }: ReviewWorkbenchProps) {
  const [tasks, setTasks] = useState<ReviewTask[]>(INITIAL_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState(INITIAL_TASKS[0]?.id || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [scopeFilter, setScopeFilter] = useState("全部");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isRefreshConfirmOpen, setIsRefreshConfirmOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [actionToApply, setActionToApply] = useState<SuggestedAction | null>(null);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const currentTask = tasks.find(task => task.id === selectedTaskId) || tasks[0];
  const meta = currentTask ? statusMeta(currentTask) : null;

  const dataSummary = useMemo(() => {
    if (!currentTask) return null;
    const count = currentTask.analysisDetails.summary.sampleNotesCount;
    return {
      sampleCount: count,
      platformIdCount: Math.max(0, count - (currentTask.status === "exception" ? 3 : 0)),
      returnedCount: Math.max(0, count - (currentTask.status === "exception" ? 6 : 1)),
      source: currentTask.analysisDetails.summary.dataSource,
      cutoff: currentTask.historyVersions[0]?.dataCutoff || currentTask.updatedAt
    };
  }, [currentTask]);

  const currentDirectionIds = currentTask?.reviewDirections?.length
    ? currentTask.reviewDirections
    : ALL_REVIEW_DIRECTION_IDS;
  const currentDirections = REVIEW_DIRECTION_DEFINITIONS.filter(direction => currentDirectionIds.includes(direction.id));
  const hasDirection = (id: (typeof ALL_REVIEW_DIRECTION_IDS)[number]) => currentDirectionIds.includes(id);
  const showCrossPlanComparison = Boolean(currentTask && currentTask.mode === "multi" && (currentTask.includeCrossPlanComparison ?? true));

  if (!currentTask || !meta || !dataSummary) return (
    <div className="relative flex h-full flex-1 overflow-hidden bg-surface-base">
      <ReviewTaskList tasks={tasks} selectedTaskId="" onSelectTask={setSelectedTaskId} onOpenCreateModal={() => setIsCreateModalOpen(true)} onRequestDelete={setDeleteTaskId} onCloseSidebar={() => setIsSidebarOpen(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} scopeFilter={scopeFilter} setScopeFilter={setScopeFilter} />
      <div className="flex flex-1 flex-col items-center justify-center bg-surface-subtle p-8 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-1 text-text-tertiary shadow-sm"><Sparkles size={20} /></div><h2 className="mt-4 text-[15px] font-semibold text-text-main">还没有复盘记录</h2><p className="mt-1 text-[13px] text-text-tertiary">创建复盘后，最新报告会显示在这里。</p><button onClick={() => setIsCreateModalOpen(true)} className="mt-4 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white">新建复盘</button></div>
      <CreateReviewTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreateTask={(newTask) => { setTasks([newTask]); setSelectedTaskId(newTask.id); setIsCreateModalOpen(false); }} />
    </div>
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2400);
  };

  const actionDestination = (action: SuggestedAction) => {
    if (/话术|Skill|技能|SOP|自动应答|回复模板/i.test(`${action.category}${action.title}${action.target}`)) {
      return { label: "技能中心 · 对应 Skill", button: "前往修改 Skill", navigate: onNavigateToSkills };
    }
    return { label: action.actionType === "note" ? "方案中心 · 后续笔记生成规则" : "方案中心 · 专家定制", button: "前往方案修改", navigate: onNavigateToPlan };
  };

  const handleOpenActionDestination = (action: SuggestedAction) => {
    const destination = actionDestination(action);
    setActionToApply(null);
    if (destination.navigate) destination.navigate();
    else showToast(`已定位到${destination.label}`);
  };

  const handleCreateTask = (newTask: ReviewTask) => {
    setTasks(previous => [newTask, ...previous]);
    setSelectedTaskId(newTask.id);
    setIsCreateModalOpen(false);
    showToast("复盘任务已创建，Agent 正在按本次问题组织数据");
  };

  const handleRefreshReview = () => {
    const taskId = currentTask.id;
    const wasDataInsufficient = currentTask.status === "exception";
    const now = new Date();
    const cutoff = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setIsRefreshConfirmOpen(false);
    setTasks(previous => previous.map(task => task.id === taskId ? {
      ...task,
      status: "analyzing",
      statusText: "分析中",
      updatedAt: "刚刚",
      progressSteps: [
        { id: `${taskId}-refresh-data`, type: "completed", statusLabel: "已完成", title: "已刷新所选方案的最新数据", description: "保持原复盘周期、方案范围和复盘方向不变。" },
        { id: `${taskId}-refresh-metrics`, type: "analyzing", statusLabel: "分析中", title: "重新计算指标与归因", description: "使用本次刷新后的数据快照重新回答原复盘问题。" },
        { id: `${taskId}-refresh-report`, type: "analyzing", statusLabel: "分析中", title: "重新生成单份报告", description: "完成后覆盖当前报告，不创建历史版本。" }
      ]
    } : task));
    showToast("已使用最新数据重新开始复盘");
    window.setTimeout(() => {
      setTasks(previous => previous.map(task => task.id === taskId ? {
        ...task,
        status: "completed",
        statusText: "已完成",
        updatedAt: "刚刚",
        progressSteps: task.progressSteps.map(step => ({ ...step, type: "completed" as const, statusLabel: "已完成" as const })),
        historyVersions: task.historyVersions.length ? task.historyVersions.map((version, index) => index === 0 ? { ...version, dataCutoff: cutoff } : version) : task.historyVersions,
        analysisDetails: {
          ...task.analysisDetails,
          summary: { ...task.analysisDetails.summary, sampleNotesCount: task.analysisDetails.summary.sampleNotesCount + (wasDataInsufficient ? 3 : 1) }
        }
      } : task));
      showToast("最新复盘报告已生成，原报告已被替换");
    }, 1400);
  };

  const handleDeleteTask = () => {
    if (!deleteTaskId) return;
    const remaining = tasks.filter(task => task.id !== deleteTaskId);
    setTasks(remaining);
    if (selectedTaskId === deleteTaskId) setSelectedTaskId(remaining[0]?.id || "");
    setDeleteTaskId(null);
    showToast("复盘记录已删除；已应用的方案、Skill 和执行任务保持不变");
  };

  const refreshButtonLabel = currentTask.status === "exception"
    ? "重新采集并复盘"
    : currentTask.status === "analyzing"
      ? "使用最新数据重新开始"
      : "刷新数据并重新复盘";

  const handleApplyAction = () => {
    if (!actionToApply) return;
    const isSkillAction = /话术|Skill|技能|SOP|自动应答|回复模板/i.test(`${actionToApply.category}${actionToApply.title}${actionToApply.target}`);
    setTasks(previous => previous.map(task => task.id !== currentTask.id ? task : {
      ...task,
      status: "completed",
      statusText: "已完成",
      suggestedActions: task.suggestedActions.map(action => action.id === actionToApply.id ? {
        ...action,
        appliedStatus: isSkillAction ? "in_note" : "in_plan",
        appliedDestinationLabel: isSkillAction ? "已更新 Skill · 用于后续生成" : "已生成方案策略 V3 · 用于后续生成"
      } : action)
    }));
    setActionToApply(null);
    showToast(isSkillAction ? "Skill 已形成新版本，后续内容将复用本次经验" : "方案策略 V3 已生成，已有内容不会被改写");
  };

  const renderAnalyzing = () => (
    <div className="rounded-2xl border border-border-default bg-surface-1 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><RefreshCw size={19} className="animate-spin" /></div>
        <div><div className="text-[15px] font-semibold text-text-main">正在回答本次复盘问题</div><div className="mt-1 text-[13px] text-text-secondary">系统只分析本次选择的方案、周期与关注点，不会自动修改运营方案。</div></div>
      </div>
      <div className="mt-5 space-y-2">
        {currentTask.progressSteps.map(step => (
          <div key={step.id} className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-subtle p-3">
            <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${step.type === "completed" ? "bg-emerald-500" : step.type === "analyzing" ? "bg-blue-500 animate-pulse" : "bg-neutral-300"}`} />
            <div className="min-w-0"><div className="text-[13px] font-medium text-text-main">{step.title}</div><div className="mt-0.5 text-[13px] leading-5 text-text-tertiary">{step.description}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderException = () => {
    const blocked = currentTask.progressSteps.find(step => step.type === "blocked");
    return (
      <div className="rounded-2xl border border-rose-200 bg-surface-1 p-6">
        <div className="flex items-start gap-3"><ShieldAlert size={20} className="mt-0.5 text-rose-600" /><div><div className="text-[15px] font-semibold text-text-main">当前数据不足以形成可靠结论</div><div className="mt-1 text-[13px] leading-5 text-text-secondary">{blocked?.description || currentTask.coreConclusions.mainIssue.description}</div></div></div>
        <div className="mt-4 rounded-xl bg-rose-50 p-3 text-[13px] text-rose-800">缺失数据不会用计划值或估算值代替。补齐后可从当前任务重新分析，并保留本次快照。</div>
        {onNavigateToExecution && <button onClick={onNavigateToExecution} className="mt-4 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white">处理数据缺口</button>}
      </div>
    );
  };

  const renderResult = () => (
    <article className="workspace-report overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
      <section className="border-b border-border-default px-7 py-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><div className="text-[13px] font-semibold tracking-[0.18em] text-blue-700">TAPTIK · 小红书运营复盘报告</div><h2 className="mt-2 text-[22px] font-semibold leading-8 text-text-main">{currentTask.title}</h2><p className="mt-1.5 text-[13px] text-text-tertiary">报告周期：{formatChineseDate(currentTask.dateRange.start)}—{formatChineseDate(currentTask.dateRange.end)} · 数据截止：{formatChineseDate(dataSummary.cutoff, true) || dataSummary.cutoff} · 生成时间：{currentTask.updatedAt}</p><p className="mt-1 text-[13px] text-text-tertiary">方案：{currentTask.projectNames.join("、")}</p></div>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">数据覆盖 {dataSummary.returnedCount}/{dataSummary.sampleCount} 篇 · 中高可信</span>
        </div>
        <div className="mt-6 border-l-4 border-neutral-950 pl-4"><div className="text-[13px] font-medium text-text-tertiary">执行摘要</div><h3 className="mt-1 text-[17px] font-semibold leading-7 text-text-main">{currentTask.coreConclusions.overallPerformance.title}</h3><p className="mt-1 text-[13px] leading-6 text-text-secondary">{currentTask.coreConclusions.overallPerformance.description}</p></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-3.5"><div className="text-[13px] font-semibold text-emerald-700">继续放大</div><div className="mt-1.5 text-[13px] font-semibold leading-5 text-emerald-950">{currentTask.coreConclusions.keyOpportunity.title}</div></div>
          <div className="rounded-xl bg-amber-50 p-3.5"><div className="text-[13px] font-semibold text-amber-700">优先修正</div><div className="mt-1.5 text-[13px] font-semibold leading-5 text-amber-950">{currentTask.coreConclusions.mainIssue.title}</div></div>
          <div className="rounded-xl bg-blue-50 p-3.5"><div className="text-[13px] font-semibold text-blue-700">下一步</div><div className="mt-1.5 text-[13px] font-semibold leading-5 text-blue-950">{currentTask.coreConclusions.priorityAction.title}</div></div>
        </div>
      </section>

      <section className="border-b border-border-default px-7 py-6">
        <div className="flex items-end justify-between gap-3"><div><div className="text-[13px] font-semibold text-blue-700">01</div><h3 className="mt-0.5 text-[15px] font-semibold text-text-main">核心数据概览</h3></div><div className="text-[13px] text-text-tertiary">观察窗口：{currentTask.observationWindowLabel || "截至当前"}</div></div>
        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border-default bg-surface-subtle p-3"><div className="text-[13px] text-text-tertiary">纳入笔记</div><div className="mt-1 text-[19px] font-semibold text-text-main">{dataSummary.sampleCount}<span className="ml-1 text-[13px] font-normal">篇</span></div></div>
          <div className="rounded-xl border border-border-default bg-surface-subtle p-3"><div className="text-[13px] text-text-tertiary">平台收录覆盖</div><div className="mt-1 text-[19px] font-semibold text-text-main">{Math.round(dataSummary.platformIdCount / dataSummary.sampleCount * 100)}<span className="ml-1 text-[13px] font-normal">%</span></div></div>
          <div className="rounded-xl border border-border-default bg-surface-subtle p-3"><div className="text-[13px] text-text-tertiary">数据回传覆盖</div><div className="mt-1 text-[19px] font-semibold text-text-main">{Math.round(dataSummary.returnedCount / dataSummary.sampleCount * 100)}<span className="ml-1 text-[13px] font-normal">%</span></div></div>
          <div className="rounded-xl border border-border-default bg-surface-subtle p-3"><div className="text-[13px] text-text-tertiary">方案数量</div><div className="mt-1 text-[19px] font-semibold text-text-main">{currentTask.projectNames.length}<span className="ml-1 text-[13px] font-normal">个</span></div></div>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.65fr_1fr]"><TrendChart /><DistributionChart sampleCount={dataSummary.sampleCount} /></div>
      </section>

      {hasDirection("search_note") && <section className="border-b border-border-default px-7 py-6">
        <div className="flex gap-2.5"><Search size={16} className="mt-0.5 text-blue-700" /><div><div className="text-[13px] font-semibold text-blue-700">02 · 搜索与笔记洞察</div><h3 className="mt-0.5 text-[15px] font-semibold text-text-main">分发、收录与搜索位置表现</h3></div></div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border-default"><table className="w-full text-left text-[13px]"><thead className="bg-surface-subtle text-text-tertiary"><tr><th className="px-3 py-2.5 font-medium">指标</th><th className="px-3 py-2.5 font-medium">上一周期</th><th className="px-3 py-2.5 font-medium">本周期</th><th className="px-3 py-2.5 font-medium">变化</th><th className="px-3 py-2.5 font-medium">判断</th></tr></thead><tbody className="divide-y divide-border-subtle">{currentTask.analysisDetails.metricShifts.slice(0, 4).map((item, index) => <tr key={`${item.metric}-${index}`}><td className="px-3 py-3 font-medium text-text-main">{item.metric}</td><td className="px-3 py-3 text-text-secondary">{item.before}</td><td className="px-3 py-3 font-semibold text-text-main">{item.current}</td><td className={`px-3 py-3 font-medium ${item.isGood ? "text-emerald-600" : "text-rose-600"}`}>{item.change}</td><td className="px-3 py-3 text-text-secondary">{item.note}</td></tr>)}</tbody></table></div>
        <div className="mt-3 grid gap-2 md:grid-cols-2"><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3"><div className="text-[13px] font-semibold text-emerald-700">可复用打法</div><p className="mt-1 text-[13px] leading-5 text-emerald-950">{currentTask.coreConclusions.keyOpportunity.description}</p></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="text-[13px] font-semibold text-amber-700">风险点</div><p className="mt-1 text-[13px] leading-5 text-amber-950">{currentTask.coreConclusions.mainIssue.description}</p></div></div>
      </section>}

      {hasDirection("content_audience") && <section className="border-b border-border-default px-7 py-6">
        <div className="flex gap-2.5"><Users size={16} className="mt-0.5 text-violet-700" /><div><div className="text-[13px] font-semibold text-violet-700">03 · 内容与人群分析</div><h3 className="mt-0.5 text-[15px] font-semibold text-text-main">有效内容要素与人群响应</h3></div></div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border-default"><table className="w-full text-left text-[13px]"><thead className="bg-surface-subtle text-text-tertiary"><tr><th className="w-1/4 px-3 py-2.5 font-medium">分析维度</th><th className="px-3 py-2.5 font-medium">主要发现</th><th className="w-1/3 px-3 py-2.5 font-medium">运营含义</th></tr></thead><tbody className="divide-y divide-border-subtle"><tr><td className="px-3 py-3 font-medium text-text-main">内容结构</td><td className="px-3 py-3 text-text-secondary">{currentTask.analysisDetails.insights.contentInsight.takeaways[0] || "真实体验内容表现更优"}</td><td className="px-3 py-3 text-text-secondary">沉淀为后续笔记生成规则与内容模板</td></tr><tr><td className="px-3 py-3 font-medium text-text-main">人群意图</td><td className="px-3 py-3 text-text-secondary">{currentTask.analysisDetails.insights.userInsight.takeaways[0] || "用户关注专业解释与真实证据"}</td><td className="px-3 py-3 text-text-secondary">调整选题、证据素材与评论承接话术</td></tr><tr><td className="px-3 py-3 font-medium text-text-main">账号角色</td><td className="px-3 py-3 text-text-secondary">品牌号给事实、KOS 做解释、KOC 提供体验</td><td className="px-3 py-3 text-text-secondary">按角色保留差异化表达，不复制同一稿件</td></tr></tbody></table></div>
      </section>}

      {hasDirection("seeding_conversion") && <section className="border-b border-border-default px-7 py-6">
        <div className="flex items-start justify-between gap-3"><div className="flex gap-2.5"><BarChart3 size={16} className="mt-0.5 text-emerald-700" /><div><div className="text-[13px] font-semibold text-emerald-700">04 · 种草及转化度量</div><h3 className="mt-0.5 text-[15px] font-semibold text-text-main">从内容触达到有效咨询的转化链路</h3></div></div><span className="rounded bg-amber-50 px-2 py-1 text-[13px] text-amber-700">仅统计已回传数据</span></div>
        <div className="mt-4 grid gap-2 md:grid-cols-5">{[{ label: "内容曝光", value: "44.2万", rate: "100%", width: "100%" }, { label: "深度阅读", value: "18.6万", rate: "42.1%", width: "84%" }, { label: "收藏评论", value: "2.82万", rate: "15.2%", width: "68%" }, { label: "私信咨询", value: "1,420", rate: "5.0%", width: "52%" }, { label: "有效线索", value: "682", rate: "48.0%", width: "42%" }].map((item, index) => <div key={item.label} className="relative rounded-xl border border-border-default bg-surface-subtle p-3"><div className="text-[13px] text-text-tertiary">{index + 1}. {item.label}</div><div className="mt-1 text-[16px] font-semibold text-text-main">{item.value}</div><div className="mt-2 h-1.5 rounded-full bg-white"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: item.width }} /></div><div className="mt-1 text-[13px] text-text-tertiary">阶段转化 {item.rate}</div></div>)}</div>
        <div className="mt-3 rounded-xl border border-border-default bg-surface-subtle p-3.5"><div className="text-[13px] font-semibold text-text-main">转化判断</div><p className="mt-1 text-[13px] leading-5 text-text-secondary">{currentTask.analysisDetails.insights.conversionInsight.takeaways.join("；") || currentTask.analysisDetails.finalConclusion}</p></div>
      </section>}

      {showCrossPlanComparison && <section className="border-b border-border-default px-7 py-6">
        <div className="flex gap-2.5"><Layers size={16} className="mt-0.5 text-blue-700" /><div><div className="text-[13px] font-semibold text-blue-700">05 · 跨方案打法对比</div><h3 className="mt-0.5 text-[15px] font-semibold text-text-main">相同观察窗口下的打法差异</h3></div></div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border-default"><table className="w-full text-left text-[13px]"><thead className="bg-surface-subtle text-text-tertiary"><tr><th className="px-3 py-2.5 font-medium">方案</th><th className="px-3 py-2.5 font-medium">曝光</th><th className="px-3 py-2.5 font-medium">转化</th><th className="px-3 py-2.5 font-medium">优势</th><th className="px-3 py-2.5 font-medium">下一步</th></tr></thead><tbody className="divide-y divide-border-subtle">{(currentTask.crossProjectComparison?.projects || currentTask.projectNames.map((name, index) => ({ id: `${index}`, name, impressions: { val: "待计算" }, conversion: { val: "待计算" }, keyStrength: "按本次方向生成", weakness: "等待标准化对比" }))).slice(0, 4).map(project => <tr key={project.id}><td className="px-3 py-3 font-medium text-text-main">{project.name}</td><td className="px-3 py-3 text-text-secondary">{project.impressions.val}</td><td className="px-3 py-3 text-text-secondary">{project.conversion.val}</td><td className="px-3 py-3 text-text-secondary">{project.keyStrength}</td><td className="px-3 py-3 text-text-secondary">{project.weakness}</td></tr>)}</tbody></table></div>
      </section>}

      <section className="px-7 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-[13px] font-semibold text-blue-700">{showCrossPlanComparison ? "06" : "05"} · 行动与知识复用</div><h3 className="mt-0.5 text-[15px] font-semibold text-text-main">确认优化动作，形成下一轮增长输入</h3><p className="mt-1 text-[13px] text-text-tertiary">建议不会自动生效。先查看改动，再由操盘手确认写入方案或 Skill。</p></div><div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-[13px] font-medium text-blue-800"><TrendingUp size={13} />复盘 → 确认优化 → 知识复用 → 下一轮数据</div></div>
        <div className="mt-4 space-y-3">{currentTask.suggestedActions.length === 0 ? <div className="rounded-xl bg-surface-subtle p-4 text-[13px] text-text-tertiary">暂无需要人工确认的优化动作。</div> : currentTask.suggestedActions.map(action => {
          const applied = action.appliedStatus && action.appliedStatus !== "not_applied";
          const destination = actionDestination(action);
          return <div key={action.id} className="rounded-xl border border-border-default p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded bg-neutral-950 px-1.5 py-0.5 text-[13px] font-semibold text-white">{action.priority}</span><span className="text-[13px] text-text-tertiary">{action.category}</span><span className="flex items-center gap-1 rounded bg-surface-subtle px-1.5 py-0.5 text-[13px] text-text-secondary"><Settings2 size={10} />修改到：{destination.label}</span></div><h4 className="mt-2 text-[13px] font-semibold text-text-main">{action.title}</h4><p className="mt-1 text-[13px] leading-5 text-text-secondary">{action.reason}</p></div><div className="flex shrink-0 items-center gap-2">{applied ? <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1.5 text-[13px] font-medium text-emerald-700"><CheckCircle2 size={12} />{action.appliedDestinationLabel}</span> : <><button onClick={() => handleOpenActionDestination(action)} className="flex items-center gap-1 rounded-lg border border-border-default px-3 py-2 text-[13px] font-medium text-text-main">{destination.button}<ExternalLink size={11} /></button><button onClick={() => setActionToApply(action)} className="rounded-lg bg-neutral-950 px-3 py-2 text-[13px] font-medium text-white">查看并确认应用</button></>}</div></div><button onClick={() => setExpandedEvidenceId(expandedEvidenceId === action.id ? null : action.id)} className="mt-3 text-[13px] font-medium text-text-tertiary hover:text-text-main">{expandedEvidenceId === action.id ? "收起改动范围" : "查看改动范围"}</button>{expandedEvidenceId === action.id && <div className="mt-2 grid gap-2 rounded-lg bg-surface-subtle p-3 text-[13px] leading-5 text-text-secondary md:grid-cols-2"><div><strong className="text-text-main">将修改：</strong>{action.target}</div><div><strong className="text-text-main">预期收益：</strong>{action.expectedGain}</div><div className="md:col-span-2"><strong className="text-text-main">版本边界：</strong>只影响确认后的新内容，不改写已有草稿、已发布笔记和历史报告。</div></div>}</div>;
        })}</div>
      </section>
    </article>
  );

  return (
    <div className="workspace-shell review-workspace relative flex h-full flex-1 overflow-hidden bg-surface-base">
      {isSidebarOpen ? <ReviewTaskList tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId} onOpenCreateModal={() => setIsCreateModalOpen(true)} onRequestDelete={setDeleteTaskId} onCloseSidebar={() => setIsSidebarOpen(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} scopeFilter={scopeFilter} setScopeFilter={setScopeFilter} /> : <button onClick={() => setIsSidebarOpen(true)} className="absolute left-3 top-4 z-20 rounded-lg border border-border-default bg-surface-1 p-2 text-text-secondary"><PanelLeftOpen size={16} /></button>}

      <div className="flex min-w-0 flex-1 flex-col bg-surface-subtle">
        <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-[17px] font-semibold text-text-main">{currentTask.title}</h1><span className={`rounded-md border px-2 py-0.5 text-[13px] font-medium ${meta.className}`}>{meta.label}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-text-tertiary"><span className="flex items-center gap-1"><Clock size={12} />{formatChineseDate(currentTask.dateRange.start)} 至 {formatChineseDate(currentTask.dateRange.end)}</span><span>·</span><span className="flex items-center gap-1"><Layers size={12} />{currentTask.projectNames.join("、")}</span><span>·</span><span>更新于 {currentTask.updatedAt}</span></div></div>
            <div className="flex items-center gap-2"><button onClick={() => setIsRefreshConfirmOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] font-medium text-text-main"><RefreshCw size={13} />{refreshButtonLabel}</button><button onClick={() => setIsEvidenceDrawerOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] text-text-secondary"><Bot size={13} />AI 复盘依据</button><button onClick={() => setIsExportModalOpen(true)} disabled={currentTask.status === "analyzing"} className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"><Download size={13} />导出报告</button></div>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface-subtle px-3 py-2 text-[13px] leading-5 text-text-secondary"><Target size={13} className="mt-0.5 shrink-0" /><span><strong className="font-medium text-text-main">本次要回答：</strong>{currentTask.goalDescription}</span></div>
        </header>
        <main className="workspace-stage flex-1 overflow-y-auto"><div className="mx-auto max-w-6xl">{currentTask.status === "analyzing" ? renderAnalyzing() : currentTask.status === "exception" ? renderException() : renderResult()}</div></main>
      </div>

      <CreateReviewTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreateTask={handleCreateTask} />
      <ExportReportModal task={currentTask} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />

      {isEvidenceDrawerOpen && <div className="fixed inset-0 z-[70] flex justify-end bg-black/25" onClick={() => setIsEvidenceDrawerOpen(false)}><aside className="flex h-full w-full max-w-xl flex-col bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()}><div className="flex items-start justify-between border-b border-border-default px-5 py-4"><div><div className="flex items-center gap-2 text-[14px] font-semibold text-text-main"><Bot size={16} />AI 复盘依据</div><p className="mt-1 text-[13px] text-text-tertiary">用于核验结论，不属于对外导出的报告主体。</p></div><button onClick={() => setIsEvidenceDrawerOpen(false)} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={16} /></button></div><div className="flex-1 space-y-4 overflow-y-auto p-5"><section className="rounded-xl border border-border-default p-4"><div className="flex items-center gap-2 text-[13px] font-semibold text-text-main"><Database size={14} />数据范围与口径</div><div className="mt-3 grid gap-2 text-[13px] leading-5 text-text-secondary"><p><strong className="text-text-main">方案：</strong>{currentTask.projectNames.join("、")}</p><p><strong className="text-text-main">方向：</strong>{currentDirections.map(item => item.title).join("、")}</p><p><strong className="text-text-main">来源：</strong>{dataSummary.source}</p><p><strong className="text-text-main">截止：</strong>{formatChineseDate(dataSummary.cutoff, true) || dataSummary.cutoff}</p><p><strong className="text-text-main">覆盖：</strong>{dataSummary.returnedCount}/{dataSummary.sampleCount} 篇已有数据回传</p></div></section><section className="rounded-xl border border-border-default p-4"><div className="flex items-center gap-2 text-[13px] font-semibold text-text-main"><Workflow size={14} />分析过程</div><div className="mt-3 space-y-2">{currentTask.agentPipeline.map((agent, index) => <div key={agent.id} className="rounded-lg bg-surface-subtle p-3"><div className="flex items-center justify-between gap-2"><span className="text-[13px] font-medium text-text-main">{index + 1}. {agent.name}</span><span className="text-[13px] text-text-tertiary">{agent.statusText} · {agent.duration}</span></div><p className="mt-1 text-[13px] leading-5 text-text-secondary">{agent.summary}</p>{agent.outputItems.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{agent.outputItems.map(item => <span key={item} className="rounded bg-white px-1.5 py-0.5 text-[13px] text-text-tertiary">{item}</span>)}</div>}</div>)}</div></section><section className="rounded-xl border border-border-default p-4"><div className="flex items-center gap-2 text-[13px] font-semibold text-text-main"><ShieldAlert size={14} />结论限制</div><ul className="mt-3 space-y-2 text-[13px] leading-5 text-text-secondary"><li>· 缺失数据不会以计划值、行业均值或 AI 估算值替代。</li><li>· 搜索排名采用关键词搜索快照与笔记 ID 比对，代表采样时点位置。</li><li>· 有效咨询、转化等结论只使用已回传的发布后数据。</li><li>· 数据更新不会自动改写报告；只有操盘手主动刷新后才会替换当前成果。</li></ul></section></div></aside></div>}

      {isRefreshConfirmOpen && <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 p-4"><div className="w-full max-w-md rounded-2xl border border-border-default bg-surface-1 p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] font-medium text-blue-700">使用最新数据重新复盘</div><h2 className="mt-1 text-[15px] font-semibold text-text-main">{currentTask.title}</h2></div><button onClick={() => setIsRefreshConfirmOpen(false)} className="rounded-lg p-1 text-text-tertiary hover:bg-hover-bg"><X size={16} /></button></div><div className="mt-4 rounded-xl bg-surface-subtle p-3 text-[13px] leading-5 text-text-secondary"><p>复盘周期、方案范围、问题和方向保持不变，只刷新数据并重新生成报告。</p><p className="mt-2 font-medium text-amber-800">当前报告将被替换，不保留历史版本。</p></div><div className="mt-3 text-[13px] leading-5 text-text-tertiary">已经确认应用到方案、Skill 或执行中心的动作不会被回滚。</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setIsRefreshConfirmOpen(false)} className="rounded-lg px-3 py-2 text-[13px] text-text-secondary">取消</button><button onClick={handleRefreshReview} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white"><RefreshCw size={13} />确认刷新并覆盖</button></div></div></div>}

      {deleteTaskId && <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 p-4"><div className="w-full max-w-md rounded-2xl border border-border-default bg-surface-1 p-5 shadow-2xl"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><Trash2 size={18} /></div><h2 className="mt-3 text-[15px] font-semibold text-text-main">删除这条复盘记录？</h2><p className="mt-1 text-[13px] leading-5 text-text-secondary">{tasks.find(task => task.id === deleteTaskId)?.title}</p><div className="mt-4 rounded-xl bg-rose-50 p-3 text-[13px] leading-5 text-rose-900">将删除复盘任务、当前报告和 AI 分析依据。已经应用的方案修改、Skill、执行任务及已导出的本地文件不会被删除。</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setDeleteTaskId(null)} className="rounded-lg px-3 py-2 text-[13px] text-text-secondary">取消</button><button onClick={handleDeleteTask} className="rounded-lg bg-rose-600 px-4 py-2 text-[13px] font-medium text-white">确认删除</button></div></div></div>}

      {actionToApply && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"><div className="w-full max-w-lg rounded-2xl border border-border-default bg-surface-1 p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] font-medium text-text-tertiary">优化动作确认 · {actionDestination(actionToApply).label}</div><h2 className="mt-1 text-[15px] font-semibold text-text-main">{actionToApply.title}</h2></div><button onClick={() => setActionToApply(null)} className="p-1 text-text-tertiary"><X size={16} /></button></div><div className="mt-4 space-y-3 text-[13px]"><div className="rounded-xl border border-border-default p-3"><div className="text-[13px] text-text-tertiary">当前使用版本</div><div className="mt-1 text-text-secondary">保持现有运营逻辑、生成规则与账号配比。</div></div><div className="rounded-xl border border-blue-200 bg-blue-50 p-3"><div className="text-[13px] text-blue-700">确认后的新版本</div><div className="mt-1 font-medium text-blue-950">{actionToApply.target}</div><div className="mt-1 text-blue-800">预期：{actionToApply.expectedGain}</div></div><div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-[13px] leading-5 text-amber-900"><Info size={14} className="mt-0.5 shrink-0" />只影响确认后新生成的内容；已有草稿、已发布笔记、历史数据和本次报告保持不变。</div></div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setActionToApply(null)} className="rounded-lg px-3.5 py-2 text-[13px] text-text-secondary">暂不应用</button><button onClick={handleApplyAction} className="rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white">确认并生成新版本</button></div></div></div>}
      {toastMessage && <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2.5 text-[13px] text-white shadow-xl">{toastMessage}</div>}
    </div>
  );
}
