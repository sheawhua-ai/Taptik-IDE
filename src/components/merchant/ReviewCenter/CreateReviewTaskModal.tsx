import React, { useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Check, ChevronLeft, ChevronRight, Database, Layers, Search, Sparkles, X } from "lucide-react";
import { INITIAL_REVIEW_TASKS } from "./mockData";
import type { ReviewDirectionId, ReviewTask } from "./types";
import { ALL_REVIEW_DIRECTION_IDS, REVIEW_DIRECTION_DEFINITIONS } from "./reviewDirections";

interface CreateReviewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (newTask: ReviewTask) => void;
}

const REVIEW_SCOPE_PROJECTS = [
  { id: "scope-plan-7", name: "秋季肠胃敏感内容起盘", start: "2026-08-10", end: "2026-08-25", activeNotes: 9, accountCount: 3, keywordCount: 5, completeness: 84 },
  { id: "scope-plan-8", name: "夏末养宠问答内容矩阵", start: "2026-08-05", end: "2026-08-24", activeNotes: 10, accountCount: 3, keywordCount: 4, completeness: 86 },
  { id: "scope-plan-4", name: "门店顾问答疑优化", start: "2026-08-01", end: "2026-08-20", activeNotes: 12, accountCount: 2, keywordCount: 3, completeness: 76 },
  { id: "scope-plan-3", name: "肠胃敏感人群内容矩阵", start: "2026-07-01", end: "2026-07-31", activeNotes: 18, accountCount: 5, keywordCount: 8, completeness: 81 },
  { id: "scope-plan-6", name: "暑期KOC真实体验计划", start: "2026-06-25", end: "2026-07-18", activeNotes: 16, accountCount: 4, keywordCount: 4, completeness: 89 },
  { id: "scope-plan-2", name: "宠物食品新品试用起盘", start: "2026-06-01", end: "2026-06-21", activeNotes: 14, accountCount: 4, keywordCount: 6, completeness: 92 },
  { id: "scope-plan-5", name: "618门店搜索承接方案", start: "2026-05-20", end: "2026-06-18", activeNotes: 11, accountCount: 3, keywordCount: 5, completeness: 87 },
  { id: "scope-plan-1", name: "幼犬换粮搜索卡位第三轮", start: "2026-03-01", end: "2026-03-20", activeNotes: 6, accountCount: 3, keywordCount: 4, completeness: 88 }
];

const PERIOD_PRESETS = [
  { id: "30d", label: "近30天", start: "2026-07-28", end: "2026-08-26" },
  { id: "90d", label: "近90天", start: "2026-05-28", end: "2026-08-26" },
  { id: "quarter", label: "本季度", start: "2026-07-01", end: "2026-09-30" },
  { id: "custom", label: "自定义", start: "2026-07-01", end: "2026-08-26" }
] as const;

function formatShortDate(value: string) {
  const [, month, day] = value.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function projectsInPeriod(start: string, end: string) {
  return REVIEW_SCOPE_PROJECTS
    .filter(project => project.end >= start && project.start <= end)
    .sort((a, b) => b.end.localeCompare(a.end));
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildMonthDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const start = new Date(year, monthIndex, 1 - mondayOffset);
  return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
}

export function CreateReviewTaskModal({ isOpen, onClose, onCreateTask }: CreateReviewTaskModalProps) {
  const defaultPeriod = PERIOD_PRESETS[0];
  const defaultProjects = projectsInPeriod(defaultPeriod.start, defaultPeriod.end);
  const [periodPreset, setPeriodPreset] = useState(defaultPeriod.id as string);
  const [periodStart, setPeriodStart] = useState(defaultPeriod.start);
  const [periodEnd, setPeriodEnd] = useState(defaultPeriod.end);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(defaultProjects[0] ? [defaultProjects[0].id] : []);
  const [selectedDirections, setSelectedDirections] = useState<ReviewDirectionId[]>([...ALL_REVIEW_DIRECTION_IDS]);
  const [includeCrossPlanComparison, setIncludeCrossPlanComparison] = useState(false);
  const [customFocus, setCustomFocus] = useState("");
  const [includeFeedback, setIncludeFeedback] = useState(true);
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [showRangeCalendar, setShowRangeCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 7, 1));
  const [draftRangeStart, setDraftRangeStart] = useState(periodStart);
  const [draftRangeEnd, setDraftRangeEnd] = useState(periodEnd);
  const [awaitingRangeEnd, setAwaitingRangeEnd] = useState(false);

  const candidateProjects = useMemo(() => projectsInPeriod(periodStart, periodEnd), [periodStart, periodEnd]);
  const visibleProjects = candidateProjects.slice(0, 3);
  const selectedProjects = REVIEW_SCOPE_PROJECTS.filter(project => selectedProjectIds.includes(project.id));
  const selectedDirectionDefinitions = REVIEW_DIRECTION_DEFINITIONS.filter(direction => selectedDirections.includes(direction.id));
  const searchedProjects = candidateProjects.filter(project => project.name.toLowerCase().includes(projectSearch.trim().toLowerCase()));
  const totalNotes = selectedProjects.reduce((sum, project) => sum + project.activeNotes, 0);
  const totalAccounts = selectedProjects.reduce((sum, project) => sum + project.accountCount, 0);
  const totalKeywords = selectedProjects.reduce((sum, project) => sum + project.keywordCount, 0);
  const averageCompleteness = selectedProjects.length
    ? Math.round(selectedProjects.reduce((sum, project) => sum + project.completeness, 0) / selectedProjects.length)
    : 0;
  const platformIdCount = Math.max(totalNotes - Math.max(1, Math.round(totalNotes * 0.06)), 0);
  const returnedCount = Math.max(totalNotes - Math.max(1, Math.round(totalNotes * 0.1)), 0);
  const calendarDays = buildMonthDays(calendarMonth);

  if (!isOpen) return null;

  const applyPeriod = (preset: (typeof PERIOD_PRESETS)[number]) => {
    setPeriodPreset(preset.id);
    setPeriodStart(preset.start);
    setPeriodEnd(preset.end);
    const nextProjects = projectsInPeriod(preset.start, preset.end);
    setSelectedProjectIds(nextProjects[0] ? [nextProjects[0].id] : []);
    setIncludeCrossPlanComparison(false);
    setShowRangeCalendar(false);
  };

  const commitCustomRange = (nextStart: string, nextEnd: string) => {
    setPeriodPreset("custom");
    setPeriodStart(nextStart);
    setPeriodEnd(nextEnd);
    const validIds = new Set(projectsInPeriod(nextStart, nextEnd).map(project => project.id));
    setSelectedProjectIds(previous => {
      const retained = previous.filter(id => validIds.has(id));
      if (retained.length > 0) return retained;
      const first = projectsInPeriod(nextStart, nextEnd)[0];
      return first ? [first.id] : [];
    });
    setIncludeCrossPlanComparison(false);
  };

  const openRangeCalendar = () => {
    setDraftRangeStart(periodStart);
    setDraftRangeEnd(periodEnd);
    setAwaitingRangeEnd(false);
    const [, month] = periodEnd.split("-").map(Number);
    setCalendarMonth(new Date(Number(periodEnd.slice(0, 4)), month - 1, 1));
    setShowRangeCalendar(value => !value);
  };

  const selectCalendarDate = (date: Date) => {
    const value = toISODate(date);
    if (!awaitingRangeEnd) {
      setDraftRangeStart(value);
      setDraftRangeEnd("");
      setAwaitingRangeEnd(true);
      return;
    }
    const start = value < draftRangeStart ? value : draftRangeStart;
    const end = value < draftRangeStart ? draftRangeStart : value;
    setDraftRangeStart(start);
    setDraftRangeEnd(end);
    setAwaitingRangeEnd(false);
    setShowRangeCalendar(false);
    commitCustomRange(start, end);
  };

  const toggleProject = (id: string) => {
    setSelectedProjectIds(previous => {
      const next = previous.includes(id)
        ? previous.length === 1 ? previous : previous.filter(item => item !== id)
        : [...previous, id];
      setIncludeCrossPlanComparison(next.length > 1);
      return next;
    });
  };

  const toggleDirection = (id: ReviewDirectionId) => {
    setSelectedDirections(previous => previous.includes(id)
      ? previous.length === 1 ? previous : previous.filter(item => item !== id)
      : [...previous, id]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedProjects.length === 0 || selectedDirections.length === 0) return;
    const template = INITIAL_REVIEW_TASKS[1] || INITIAL_REVIEW_TASKS[0];
    const directionNames = selectedDirectionDefinitions.map(direction => direction.title);
    const title = customFocus.trim() || `${directionNames.join("、")}复盘`;
    const goalDescription = customFocus.trim() || `围绕${directionNames.join("、")}形成${selectedProjects.length > 1 && includeCrossPlanComparison ? "包含跨方案打法对比的" : ""}复盘结论`;
    const newTask: ReviewTask = {
      ...template,
      id: `review-${Date.now()}`,
      title,
      goalDescription,
      dateRange: { start: periodStart, end: periodEnd, label: `${periodStart} 至 ${periodEnd}` },
      mode: selectedProjects.length > 1 ? "multi" : "single",
      projectIds: selectedProjects.map(project => project.id),
      projectNames: selectedProjects.map(project => project.name),
      accountIds: undefined,
      accountNames: undefined,
      reviewDirections: selectedDirections,
      includeCrossPlanComparison: selectedProjects.length > 1 && includeCrossPlanComparison,
      observationWindow: "to_date",
      observationWindowLabel: `${formatShortDate(periodStart)}—${formatShortDate(periodEnd)}`,
      targetObjectiveLabel: directionNames.join(" · "),
      status: "analyzing",
      statusText: "分析中",
      updatedAt: "刚刚",
      createdAt: new Date().toISOString(),
      activeVersionId: "draft-1",
      historyVersions: [],
      suggestedActions: [],
      progressSteps: [
        { id: "collect", type: "completed", statusLabel: "已完成", title: "锁定周期、方案与数据快照", description: `已锁定${formatShortDate(periodStart)}至${formatShortDate(periodEnd)}，纳入 ${selectedProjects.length} 个方案、${totalNotes} 篇笔记、${totalAccounts} 个参与账号和 ${totalKeywords} 个目标关键词。` },
        { id: "analyze", type: "analyzing", statusLabel: "分析中", title: "按复盘方向组织证据", description: `正在生成${directionNames.join("、")}章节。${includeFeedback ? "消费者体验反馈将纳入内容与人群分析。" : "本次不纳入消费者体验反馈。"}` },
        { id: "conclusion", type: "analyzing", statusLabel: "分析中", title: "生成综合结论与行动建议", description: selectedProjects.length > 1 && includeCrossPlanComparison ? "将增加跨方案打法对比，默认使用发布后7天的标准化口径。" : "完成后直接形成报告；具体优化动作在报告中逐条确认。" }
      ]
    };
    onCreateTask(newTask);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
        <div className="flex items-start justify-between border-b border-border-default px-5 py-4">
          <div><h2 className="text-[16px] font-semibold text-text-main">新建复盘</h2><p className="mt-1 text-[13px] text-text-tertiary">先确定复盘周期，再选择该周期内的方案和分析方向。</p></div>
          <button type="button" onClick={onClose} className="p-1 text-text-tertiary hover:text-text-main"><X size={17} /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <section className="relative">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-text-main"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[13px] text-white">1</span>复盘周期</div>
            <div className="flex flex-wrap gap-1.5">{PERIOD_PRESETS.map(preset => <button key={preset.id} type="button" onClick={() => applyPeriod(preset)} className={`rounded-lg border px-3 py-1.5 text-[13px] ${periodPreset === preset.id ? "border-neutral-900 bg-neutral-950 text-white" : "border-border-default bg-surface-1 text-text-secondary"}`}>{preset.label}</button>)}</div>
            <button type="button" onClick={openRangeCalendar} className={`mt-2 flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left ${showRangeCalendar ? "border-neutral-900 bg-surface-1" : "border-border-default bg-surface-subtle"}`}><CalendarDays size={14} className="shrink-0 text-text-tertiary" /><span className="flex-1 text-[13px] font-medium text-text-main">{formatShortDate(periodStart)} 至 {formatShortDate(periodEnd)}</span><span className="text-[13px] text-text-tertiary">点击选择起止日期</span></button>
            {showRangeCalendar && <div className="absolute left-0 top-[92px] z-30 w-[310px] rounded-xl border border-border-default bg-surface-1 p-3 shadow-xl">
              <div className="flex items-center justify-between"><button type="button" onClick={() => setCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-subtle"><ChevronLeft size={14} /></button><div className="text-[13px] font-semibold text-text-main">{calendarMonth.getFullYear()}年{calendarMonth.getMonth() + 1}月</div><button type="button" onClick={() => setCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-subtle"><ChevronRight size={14} /></button></div>
              <div className="mt-2 grid grid-cols-7 text-center text-[13px] text-text-tertiary">{["一", "二", "三", "四", "五", "六", "日"].map(day => <span key={day} className="py-1">{day}</span>)}</div>
              <div className="grid grid-cols-7">{calendarDays.map(date => {
                const value = toISODate(date);
                const inMonth = date.getMonth() === calendarMonth.getMonth();
                const isEndpoint = value === draftRangeStart || value === draftRangeEnd;
                const inRange = Boolean(draftRangeEnd && value > draftRangeStart && value < draftRangeEnd);
                return <button key={value} type="button" onClick={() => selectCalendarDate(date)} className={`h-8 text-[13px] transition-colors ${isEndpoint ? "rounded-lg bg-neutral-950 font-medium text-white" : inRange ? "bg-blue-50 text-blue-800" : inMonth ? "text-text-main hover:rounded-lg hover:bg-surface-subtle" : "text-text-disabled"}`}>{date.getDate()}</button>;
              })}</div>
              <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-2 text-[13px]"><span className="text-text-tertiary">{awaitingRangeEnd ? "请选择结束日期" : "先选开始日期，再选结束日期"}</span><button type="button" onClick={() => setShowRangeCalendar(false)} className="text-text-secondary">关闭</button></div>
            </div>}
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2 text-[13px] font-semibold text-text-main"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[13px] text-white">2</span>选择方案 <span className="text-[13px] font-normal text-text-tertiary">· 可多选</span></div>{candidateProjects.length > 3 && <button type="button" onClick={() => setShowMoreProjects(true)} className="flex items-center gap-0.5 text-[13px] font-medium text-text-secondary">更多周期内方案<ChevronRight size={12} /></button>}</div>
            {visibleProjects.length > 0 ? <div className="space-y-1.5">{visibleProjects.map(project => {
              const checked = selectedProjectIds.includes(project.id);
              return <button key={project.id} type="button" onClick={() => toggleProject(project.id)} className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left ${checked ? "border-neutral-900 bg-surface-subtle" : "border-border-default bg-surface-1"}`}><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-neutral-900 bg-neutral-950 text-white" : "border-border-strong"}`}>{checked && <Check size={10} />}</span><span className="min-w-0 flex-1 truncate text-[13px] font-medium text-text-main">{project.name}</span><span className="shrink-0 text-[13px] text-text-tertiary">{formatShortDate(project.start)}—{formatShortDate(project.end)} · {project.activeNotes}篇</span></button>;
            })}</div> : <div className="rounded-xl border border-dashed border-border-default p-4 text-center text-[13px] text-text-tertiary">该周期内没有可复盘方案，请调整时间范围。</div>}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-subtle px-3 py-2 text-[13px] text-text-secondary"><span>已选 {selectedProjects.length} 个方案 · 自动带入 {totalAccounts} 个账号、{totalNotes} 篇笔记、{totalKeywords} 个关键词</span>{selectedProjects.length > 1 && <button type="button" onClick={() => setIncludeCrossPlanComparison(value => !value)} className="flex items-center gap-1.5 font-medium text-blue-700"><span className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${includeCrossPlanComparison ? "border-blue-600 bg-blue-600 text-white" : "border-blue-300"}`}>{includeCrossPlanComparison && <Check size={9} />}</span>跨方案打法对比</button>}</div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2 text-[13px] font-semibold text-text-main"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[13px] text-white">3</span>复盘方向 <span className="text-[13px] font-normal text-text-tertiary">· 可多选</span></div><button type="button" onClick={() => setSelectedDirections([...ALL_REVIEW_DIRECTION_IDS])} className={`rounded-lg border px-2.5 py-1 text-[13px] ${selectedDirections.length === ALL_REVIEW_DIRECTION_IDS.length ? "border-neutral-900 bg-neutral-950 text-white" : "border-border-default text-text-secondary"}`}>完整复盘</button></div>
            <div className="grid gap-2 sm:grid-cols-3">{REVIEW_DIRECTION_DEFINITIONS.map(direction => {
              const checked = selectedDirections.includes(direction.id);
              return <button key={direction.id} type="button" onClick={() => toggleDirection(direction.id)} title={`报告输出：${direction.output}`} className={`rounded-xl border p-2.5 text-left ${checked ? "border-neutral-900 bg-surface-subtle" : "border-border-default bg-surface-1 opacity-65"}`}><div className="flex items-start justify-between gap-2"><div className="text-[13px] font-semibold text-text-main">{direction.title}</div><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-neutral-900 bg-neutral-950 text-white" : "border-border-strong"}`}>{checked && <Check size={10} />}</span></div><div className="mt-1 line-clamp-2 text-[13px] leading-4 text-text-tertiary">{direction.description}</div></button>;
            })}</div>
            <div className="mt-2 flex gap-2"><input value={customFocus} onChange={event => setCustomFocus(event.target.value)} placeholder="补充其他复盘需求（可选）" className="min-w-0 flex-1 rounded-lg border border-border-default px-3 py-2 text-[13px] outline-none focus:border-border-strong" /><label className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border-default px-2.5 text-[13px] text-text-secondary"><input type="checkbox" checked={includeFeedback} onChange={event => setIncludeFeedback(event.target.checked)} />体验反馈</label></div>
          </section>

        </div>

        <div className="flex items-center justify-between border-t border-border-default px-5 py-3.5"><div className="flex flex-wrap items-center gap-x-2 text-[13px] text-text-tertiary"><Database size={11} /><span>平台ID {platformIdCount}/{totalNotes}</span><span>·</span><span>回传 {returnedCount}/{totalNotes}</span><span>·</span><span>完整度 {averageCompleteness}%</span>{selectedDirections.includes("seeding_conversion") && <span className="flex items-center gap-1 text-amber-700"><AlertCircle size={10} />转化仅用已回传数据</span>}</div><div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] text-text-secondary">取消</button><button type="submit" disabled={selectedProjects.length === 0 || selectedDirections.length === 0} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40"><Sparkles size={13} />开始复盘</button></div></div>

        {showMoreProjects && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4"><div className="flex max-h-[72vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl"><div className="flex items-start justify-between border-b border-border-default px-5 py-4"><div><h3 className="text-[14px] font-semibold text-text-main">选择更多方案</h3><p className="mt-1 text-[13px] text-text-tertiary">仅显示{formatShortDate(periodStart)}至{formatShortDate(periodEnd)}期间执行过的方案。</p></div><button type="button" onClick={() => setShowMoreProjects(false)} className="p-1 text-text-tertiary"><X size={16} /></button></div><div className="border-b border-border-default p-3"><div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" /><input value={projectSearch} onChange={event => setProjectSearch(event.target.value)} placeholder="搜索方案" className="w-full rounded-lg border border-border-default py-2 pl-8 pr-3 text-[13px] outline-none" /></div></div><div className="flex-1 space-y-1.5 overflow-y-auto p-3">{searchedProjects.map(project => { const checked = selectedProjectIds.includes(project.id); return <button key={project.id} type="button" onClick={() => toggleProject(project.id)} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left ${checked ? "border-neutral-900 bg-surface-subtle" : "border-border-default"}`}><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-neutral-900 bg-neutral-950 text-white" : "border-border-strong"}`}>{checked && <Check size={10} />}</span><div className="min-w-0 flex-1"><div className="truncate text-[13px] font-medium text-text-main">{project.name}</div><div className="mt-0.5 text-[13px] text-text-tertiary">{formatShortDate(project.start)}—{formatShortDate(project.end)} · {project.activeNotes}篇笔记 · 完整度{project.completeness}%</div></div></button>; })}</div><div className="flex items-center justify-between border-t border-border-default px-4 py-3"><span className="text-[13px] text-text-tertiary">已选 {selectedProjects.length} 个方案</span><button type="button" onClick={() => setShowMoreProjects(false)} className="rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white">完成选择</button></div></div></div>}
      </form>
    </div>
  );
}
