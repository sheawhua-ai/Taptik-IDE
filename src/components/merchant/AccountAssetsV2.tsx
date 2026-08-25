import React, { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, CalendarDays, CheckCircle2,
  ChevronRight, Clock3, Database, FileText, Link2, Plus, Radio,
  RefreshCw, Search, TrendingUp, Users, X
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { formatChineseDate } from "../../utils/formatDate";

type AccountRelation = "自有品牌号" | "员工KOS" | "协作KOC";
type CollectionState = "数据已更新" | "正在采集" | "部分数据缺失" | "采集失败" | "尚未采集";
type DetailTab = "calendar" | "notes" | "live" | "followers" | "collection";

interface HistoricalNoteMetric {
  id: string;
  title: string;
  publishedAt: string;
  views?: number;
  likes?: number;
  collects?: number;
  comments?: number;
  shares?: number;
  followerGain?: number;
}

interface LiveSessionMetric {
  id: string;
  startedAt: string;
  duration: string;
  viewers?: number;
  peakOnline?: number;
  avgWatch?: string;
  interactions?: number;
  followerGain?: number;
}

interface CollectionLog {
  id: string;
  time: string;
  scope: string;
  result: "成功" | "部分成功" | "失败";
  detail: string;
}

interface AccountProfile {
  id: string;
  nickname: string;
  xhsId: string;
  relation: AccountRelation;
  matrixRole: string;
  description: string;
  collectionState: CollectionState;
  lastCollectedAt?: string;
  nextCollectionAt?: string;
  coverage: string[];
  noteMetrics: HistoricalNoteMetric[];
  liveSessions: LiveSessionMetric[];
  followerTotal?: number;
  followerDelta30d?: number;
  followerTrend: number[];
  collectionLogs: CollectionLog[];
}

interface AccountScheduleItem {
  id: string;
  title: string;
  projectName: string;
  plannedDate: string;
  publishStatus: string;
  platformNoteId?: string;
}

const ACCOUNT_SEEDS: AccountProfile[] = [
  {
    id: "account-brand",
    nickname: "品牌官方旗舰店",
    xhsId: "taptik_pet_official",
    relation: "自有品牌号",
    matrixRole: "品牌背书与权威科普",
    description: "承担品牌权威解释、产品信息和搜索词卡位。",
    collectionState: "数据已更新",
    lastCollectedAt: "2026-08-25 10:30",
    nextCollectionAt: "2026-08-25 12:30",
    coverage: ["笔记表现", "直播表现", "粉丝数据"],
    noteMetrics: [
      { id: "brand-note-1", title: "【官方科普】幼犬肠胃敏感期如何顺利换粮？", publishedAt: "2026-08-20 12:00", views: 2860, likes: 126, collects: 84, comments: 21, shares: 16, followerGain: 32 },
      { id: "brand-note-2", title: "幼犬七日换粮比例图，新手建议收藏", publishedAt: "2026-08-13 18:20", views: 5120, likes: 238, collects: 316, comments: 38, shares: 45, followerGain: 61 }
    ],
    liveSessions: [
      { id: "live-1", startedAt: "2026-08-22 20:00", duration: "1小时42分", viewers: 12680, peakOnline: 786, avgWatch: "4分12秒", interactions: 1830, followerGain: 214 },
      { id: "live-2", startedAt: "2026-08-15 19:30", duration: "1小旴18分", viewers: 8940, peakOnline: 521, avgWatch: "3分46秒", interactions: 1126, followerGain: 143 }
    ],
    followerTotal: 86420,
    followerDelta30d: 2186,
    followerTrend: [79200, 80140, 81560, 82620, 84180, 85260, 86420],
    collectionLogs: [
      { id: "cl-1", time: "2026-08-25 10:30", scope: "笔记、直播、粉丝", result: "成功", detail: "获取最新笔记表现、2场直播和粉丝趋势快照。" },
      { id: "cl-2", time: "2026-08-24 22:30", scope: "笔记、粉丝", result: "成功", detail: "新增1篇笔记记录，更新近30日粉丝数据。" }
    ]
  },
  {
    id: "account-store",
    nickname: "店长号_陆家嘴店",
    xhsId: "store_lujiazui_pet",
    relation: "员工KOS",
    matrixRole: "门店专业解答",
    description: "以店长视角讲解喂养问题，承接门店咨询。",
    collectionState: "部分数据缺失",
    lastCollectedAt: "2026-08-25 09:40",
    nextCollectionAt: "2026-08-25 13:40",
    coverage: ["笔记表现", "粉丝数据"],
    noteMetrics: [
      { id: "store-note-1", title: "店长实测：幼犬换粮别急着一次换完", publishedAt: "2026-08-18 17:30", views: 3680, likes: 188, collects: 142, comments: 54, shares: 29, followerGain: 47 }
    ],
    liveSessions: [],
    followerTotal: 12680,
    followerDelta30d: 486,
    followerTrend: [11220, 11480, 11760, 11940, 12210, 12430, 12680],
    collectionLogs: [
      { id: "cl-store-1", time: "2026-08-25 09:40", scope: "笔记、粉丝", result: "部分成功", detail: "笔记与粉丝数据已更新，直播数据未获取。" },
      { id: "cl-store-2", time: "2026-08-24 21:40", scope: "笔记", result: "成功", detail: "更新近30日笔记表现。" }
    ]
  },
  {
    id: "account-wang",
    nickname: "小红薯_汪汪队",
    xhsId: "wangwang_puppy",
    relation: "协作KOC",
    matrixRole: "消费者真实体验",
    description: "通过内容包参与体验，发布真实换粮记录。",
    collectionState: "正在采集",
    lastCollectedAt: "2026-08-25 08:15",
    nextCollectionAt: "2026-08-25 12:15",
    coverage: ["公开笔记表现", "公开粉丝趋势"],
    noteMetrics: [
      { id: "wang-note-1", title: "我家金毛幼犬换粮体验，记录七天变化", publishedAt: "2026-08-21 19:10", views: 1980, likes: 96, collects: 64, comments: 31, shares: 9, followerGain: 28 }
    ],
    liveSessions: [],
    followerTotal: 4820,
    followerDelta30d: 326,
    followerTrend: [4020, 4140, 4280, 4390, 4520, 4680, 4820],
    collectionLogs: [
      { id: "cl-wang-1", time: "2026-08-25 10:15", scope: "公开笔记", result: "成功", detail: "已识别1篇新笔记，正在补齐互动数据。" }
    ]
  },
  {
    id: "account-mimi",
    nickname: "小红薯_咪咪猫",
    xhsId: "mimi_pet_notes",
    relation: "协作KOC",
    matrixRole: "消费者避坑分享",
    description: "以消费者视角分享换粮避坑与使用感受。",
    collectionState: "采集失败",
    lastCollectedAt: "2026-08-24 18:20",
    nextCollectionAt: "2026-08-25 14:20",
    coverage: ["公开笔记表现"],
    noteMetrics: [
      { id: "mimi-note-1", title: "换粮避坑指南！终于不软便了", publishedAt: "2026-08-20 15:40", views: 1320, likes: 74, collects: 52, comments: 18 }
    ],
    liveSessions: [],
    followerTotal: 3180,
    followerDelta30d: 105,
    followerTrend: [2860, 2920, 2990, 3040, 3090, 3140, 3180],
    collectionLogs: [
      { id: "cl-mimi-1", time: "2026-08-25 10:20", scope: "笔记表现", result: "失败", detail: "本次未取得有效数据，已进入下一轮采集队列。" },
      { id: "cl-mimi-2", time: "2026-08-24 18:20", scope: "笔记表现", result: "成功", detail: "取得最近发布笔记的公开互动数据。" }
    ]
  }
];

const stateTone: Record<CollectionState, string> = {
  "数据已更新": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "正在采集": "bg-blue-50 text-blue-700 border-blue-200",
  "部分数据缺失": "bg-amber-50 text-amber-800 border-amber-200",
  "采集失败": "bg-rose-50 text-rose-700 border-rose-200",
  "尚未采集": "bg-surface-subtle text-text-secondary border-border-default"
};

const statusTone = (status: string) => {
  if (["已发布", "观察中", "已验证"].includes(status)) return "bg-emerald-50 text-emerald-700";
  if (["发布中", "已回传链接", "系统验证中"].includes(status)) return "bg-blue-50 text-blue-700";
  if (status.includes("异常") || status.includes("无法")) return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-800";
};

function MetricValue({ value, suffix = "" }: { value?: number; suffix?: string }) {
  return <span>{value === undefined ? "未获取" : `${value.toLocaleString()}${suffix}`}</span>;
}

export const AccountAssetsV2: React.FC = () => {
  const { unifiedState } = useProjectStore();
  const [profiles, setProfiles] = useState<AccountProfile[]>(ACCOUNT_SEEDS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("calendar");
  const [query, setQuery] = useState("");
  const [relationFilter, setRelationFilter] = useState<"all" | AccountRelation>("all");
  const [collectionFilter, setCollectionFilter] = useState<"all" | CollectionState>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newXhsId, setNewXhsId] = useState("");
  const [newRelation, setNewRelation] = useState<AccountRelation>("员工KOS");
  const [feedback, setFeedback] = useState("");

  const scheduleMap = useMemo<Map<string, AccountScheduleItem[]>>(() => {
    const map = new Map<string, AccountScheduleItem[]>();
    unifiedState.noteSlots.forEach(slot => {
      if (slot.accountName.startsWith("待匹配")) return;
      const project = unifiedState.projects.find(item => item.id === slot.projectId);
      const draft = unifiedState.contentDrafts.find(item => item.noteSlotId === slot.id);
      const task = unifiedState.publishTasks.find(item => item.noteSlotId === slot.id);
      const published = task ? unifiedState.publishedNotes.find(item => item.publishTaskId === task.id) : undefined;
      const item: AccountScheduleItem = {
        id: slot.id,
        title: draft?.title || slot.contentDirection,
        projectName: project?.name || "未知方案",
        plannedDate: slot.plannedDate,
        publishStatus: published?.status || task?.status || "未安排",
        platformNoteId: published?.platformNoteId
      };
      map.set(slot.accountName, [...(map.get(slot.accountName) || []), item]);
    });
    map.forEach(items => items.sort((a, b) => a.plannedDate.localeCompare(b.plannedDate)));
    return map;
  }, [unifiedState]);

  const allScheduleCount = unifiedState.noteSlots.filter(slot => !slot.accountName.startsWith("待匹配")).length;
  const activePublishCount = unifiedState.publishTasks.filter(task => !["已发布", "已关闭"].includes(task.status)).length;
  const incompleteCollectionCount = profiles.filter(item => item.collectionState !== "数据已更新").length;

  const filteredProfiles = profiles.filter(profile => {
    const matchesQuery = !query.trim() || `${profile.nickname}${profile.xhsId}${profile.matrixRole}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesRelation = relationFilter === "all" || profile.relation === relationFilter;
    const matchesCollection = collectionFilter === "all" || profile.collectionState === collectionFilter;
    return matchesQuery && matchesRelation && matchesCollection;
  });

  const selected = profiles.find(item => item.id === selectedId) || null;
  const selectedSchedule = selected ? scheduleMap.get(selected.nickname) || [] : [];

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  };

  const triggerCollection = (accountId: string) => {
    setProfiles(previous => previous.map(item => item.id === accountId ? { ...item, collectionState: "正在采集" } : item));
    showFeedback("已加入数据采集队列");
  };

  const addAccount = () => {
    if (!newName.trim() || !newXhsId.trim()) return;
    const next: AccountProfile = {
      id: `account-${Date.now()}`,
      nickname: newName.trim(),
      xhsId: newXhsId.trim(),
      relation: newRelation,
      matrixRole: newRelation === "自有品牌号" ? "品牌内容发布" : newRelation === "员工KOS" ? "员工专业内容" : "消费者体验内容",
      description: "待根据后续发布计划补充账号矩阵角色。",
      collectionState: "正在采集",
      nextCollectionAt: "首次采集队列中",
      coverage: [],
      noteMetrics: [],
      liveSessions: [],
      followerTrend: [],
      collectionLogs: [{ id: `log-${Date.now()}`, time: "刚刚", scope: "账号历史数据", result: "部分成功", detail: "账号已加入，首次数据采集正在排队。" }]
    };
    setProfiles(previous => [next, ...previous]);
    setShowAddModal(false);
    setNewName("");
    setNewXhsId("");
    showFeedback("账号已加入，正在开始首次数据采集");
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-canvas">
      <div className="border-b border-border-default bg-surface px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-semibold text-text-primary">账号资产</h1>
              <span className="rounded-md border border-border-default bg-surface-subtle px-2 py-0.5 text-[11px] text-text-secondary">{profiles.length} 个发布账号</span>
            </div>
            <p className="mt-1 text-[13px] text-text-secondary">统一查看账号发布日历与后台爬虫数据表现，不推断账号是否可用。</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-action-primary-hover">
            <Plus size={15} />加入账号
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { label: "发布账号", value: profiles.length, suffix: "个", note: "已加入账号矩阵" },
            { label: "发布安排", value: allScheduleCount, suffix: "篇", note: "与方案账号矩阵一致" },
            { label: "当前发布任务", value: activePublishCount, suffix: "项", note: "全部为人工发布" },
            { label: "数据待补齐", value: incompleteCollectionCount, suffix: "个", note: "包含采集中与失败" }
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-border-default bg-surface-subtle px-4 py-3">
              <div className="text-[11.5px] text-text-tertiary">{item.label}</div>
              <div className="mt-1 text-[20px] font-semibold text-text-primary tabular-nums">{item.value}<span className="ml-1 text-[12px] font-normal text-text-secondary">{item.suffix}</span></div>
              <div className="mt-1 text-[10.5px] text-text-tertiary">{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-default bg-surface px-6 py-3">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-text-tertiary" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索账号、ID或矩阵角色..." className="w-full rounded-lg border border-border-default bg-surface pl-8 pr-3 py-2 text-[12px] outline-none focus:border-border-strong" />
        </div>
        <div className="flex items-center gap-2">
          <select value={relationFilter} onChange={event => setRelationFilter(event.target.value as typeof relationFilter)} className="rounded-lg border border-border-default bg-surface px-3 py-2 text-[12px] text-text-secondary outline-none">
            <option value="all">全部账号关系</option>
            <option value="自有品牌号">自有品牌号</option>
            <option value="员工KOS">员工KOS</option>
            <option value="协作KOC">协作KOC</option>
          </select>
          <select value={collectionFilter} onChange={event => setCollectionFilter(event.target.value as typeof collectionFilter)} className="rounded-lg border border-border-default bg-surface px-3 py-2 text-[12px] text-text-secondary outline-none">
            <option value="all">全部采集状态</option>
            {Object.keys(stateTone).map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
          <div className="grid grid-cols-[1.45fr_1.1fr_1.25fr_1fr_1fr_1.25fr_92px] gap-3 border-b border-border-default bg-surface-subtle px-4 py-2.5 text-[11px] font-medium text-text-tertiary">
            <span>账号</span><span>矩阵角色</span><span>发布安排</span><span>发布任务</span><span>近期笔记</span><span>数据采集</span><span>操作</span>
          </div>
          {filteredProfiles.map(profile => {
            const schedules = scheduleMap.get(profile.nickname) || [];
            const next = schedules.find(item => !["已发布", "观察中"].includes(item.publishStatus)) || schedules[0];
            const activeTasks = schedules.filter(item => !["已发布", "观察中", "已关闭"].includes(item.publishStatus));
            const lastNote = profile.noteMetrics[0];
            return (
              <button key={profile.id} onClick={() => { setSelectedId(profile.id); setDetailTab("calendar"); }} className="grid w-full grid-cols-[1.45fr_1.1fr_1.25fr_1fr_1fr_1.25fr_92px] items-center gap-3 border-b border-border-subtle px-4 py-4 text-left last:border-b-0 hover:bg-surface-hover">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-[14px] font-semibold text-white">{profile.nickname.slice(0, 1)}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-text-primary">{profile.nickname}</span>
                    <span className="mt-0.5 block truncate text-[10.5px] text-text-tertiary">ID: {profile.xhsId} · {profile.relation}</span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-medium text-text-primary">{profile.matrixRole}</span>
                  <span className="mt-0.5 block truncate text-[10.5px] text-text-tertiary">{profile.description}</span>
                </span>
                <span>
                  {next ? <><span className="block text-[12px] font-medium text-text-primary">{formatChineseDate(next.plannedDate)}</span><span className="mt-0.5 block truncate text-[10.5px] text-text-tertiary">{next.title}</span></> : <span className="text-[11px] text-text-tertiary">暂无发布安排</span>}
                </span>
                <span>
                  <span className="block text-[12px] font-semibold text-text-primary">{activeTasks.length} 项</span>
                  <span className="mt-0.5 block text-[10.5px] text-text-tertiary">{activeTasks[0]?.publishStatus || "无进行中任务"}</span>
                </span>
                <span>
                  {lastNote ? <><span className="block text-[12px] font-medium text-text-primary">{lastNote.views?.toLocaleString() || "未获取"} 阅读</span><span className="mt-0.5 block text-[10.5px] text-text-tertiary">{formatChineseDate(lastNote.publishedAt, true)}</span></> : <span className="text-[11px] text-text-tertiary">暂无数据</span>}
                </span>
                <span>
                  <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10.5px] font-medium ${stateTone[profile.collectionState]}`}>{profile.collectionState}</span>
                  <span className="mt-1 block text-[10.5px] text-text-tertiary">{profile.lastCollectedAt ? `${formatChineseDate(profile.lastCollectedAt, true)} 更新` : "等待首次采集"}</span>
                </span>
                <span className="flex items-center justify-end gap-1 text-[11px] font-medium text-text-secondary">查看<ChevronRight size={14} /></span>
              </button>
            );
          })}
          {filteredProfiles.length === 0 && <div className="px-4 py-16 text-center text-[12px] text-text-tertiary">没有符合当前条件的账号。</div>}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/25" onClick={() => setSelectedId(null)}>
          <div className="flex h-full w-[860px] max-w-[92vw] flex-col bg-surface shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="border-b border-border-default px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-950 text-[15px] font-semibold text-white">{selected.nickname.slice(0, 1)}</div>
                  <div>
                    <div className="flex items-center gap-2"><h2 className="text-[16px] font-semibold text-text-primary">{selected.nickname}</h2><span className="rounded border border-border-default bg-surface-subtle px-1.5 py-0.5 text-[10px] text-text-secondary">{selected.relation}</span></div>
                    <div className="mt-1 text-[11px] text-text-tertiary">ID: {selected.xhsId} · {selected.matrixRole}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => triggerCollection(selected.id)} className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-[11.5px] font-medium text-text-secondary hover:bg-surface-hover"><RefreshCw size={13} />重新采集</button>
                  <button onClick={() => setSelectedId(null)} className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-hover"><X size={17} /></button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 border-b border-border-subtle">
                {([
                  ["calendar", "发布日历", CalendarDays],
                  ["notes", "笔记表现", FileText],
                  ["live", "直播表现", Radio],
                  ["followers", "粉丝数据", Users],
                  ["collection", "采集记录", Database]
                ] as const).map(([id, label, Icon]) => (
                  <button key={id} onClick={() => setDetailTab(id)} className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-[11.5px] font-medium ${detailTab === id ? "border-neutral-950 text-text-primary" : "border-transparent text-text-tertiary hover:text-text-secondary"}`}><Icon size={13} />{label}</button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-canvas p-5">
              {detailTab === "calendar" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-border-default bg-surface px-4 py-3">
                    <div><div className="text-[12.5px] font-semibold text-text-primary">账号发布安排</div><div className="mt-0.5 text-[11px] text-text-tertiary">与方案中的账号矩阵和笔记排期使用同一份数据。</div></div>
                    <div className="text-right"><div className="text-[20px] font-semibold text-text-primary">{selectedSchedule.length}<span className="ml-1 text-[11px] font-normal text-text-secondary">篇</span></div><div className="text-[10.5px] text-text-tertiary">当前安排</div></div>
                  </div>
                  {selectedSchedule.length === 0 ? <EmptyState icon={CalendarDays} title="暂无发布安排" detail="该账号尚未被加入任何方案的账号矩阵。" /> : (
                    <div className="space-y-2">
                      {selectedSchedule.map(item => (
                        <div key={item.id} className="grid grid-cols-[90px_1fr_auto] items-center gap-4 rounded-xl border border-border-default bg-surface p-4">
                          <div><div className="text-[15px] font-semibold text-text-primary">{formatChineseDate(item.plannedDate)}</div><div className="mt-1 text-[10.5px] text-text-tertiary">人工发布</div></div>
                          <div className="min-w-0"><div className="truncate text-[12.5px] font-semibold text-text-primary">{item.title}</div><div className="mt-1 text-[11px] text-text-tertiary">{item.projectName}{item.platformNoteId ? ` · 平台ID ${item.platformNoteId}` : ""}</div></div>
                          <span className={`rounded-md px-2 py-1 text-[10.5px] font-medium ${statusTone(item.publishStatus)}`}>{item.publishStatus}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detailTab === "notes" && (
                <div className="space-y-4">
                  <DataScopeNotice profile={selected} scope="笔记表现" />
                  <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
                    <div className="grid grid-cols-[1.8fr_repeat(6,.6fr)] gap-2 border-b border-border-default bg-surface-subtle px-4 py-2.5 text-[10.5px] text-text-tertiary"><span>笔记</span><span>阅读</span><span>点赞</span><span>收藏</span><span>评论</span><span>分享</span><span>涨粉</span></div>
                    {selected.noteMetrics.map(note => <div key={note.id} className="grid grid-cols-[1.8fr_repeat(6,.6fr)] items-center gap-2 border-b border-border-subtle px-4 py-3 text-[11px] last:border-b-0"><span className="min-w-0"><span className="block truncate font-medium text-text-primary">{note.title}</span><span className="mt-0.5 block text-[10px] text-text-tertiary">{formatChineseDate(note.publishedAt, true)}</span></span><MetricValue value={note.views} /><MetricValue value={note.likes} /><MetricValue value={note.collects} /><MetricValue value={note.comments} /><MetricValue value={note.shares} /><MetricValue value={note.followerGain} suffix="" /></div>)}
                    {selected.noteMetrics.length === 0 && <div className="px-4 py-12 text-center text-[11.5px] text-text-tertiary">尚未获取可展示的笔记数据。</div>}
                  </div>
                </div>
              )}

              {detailTab === "live" && (
                <div className="space-y-4">
                  <DataScopeNotice profile={selected} scope="直播表现" />
                  {selected.liveSessions.length === 0 ? <EmptyState icon={Radio} title="暂无直播数据" detail="当前采集结果中没有该账号的直播场次，不以0代替。" /> : selected.liveSessions.map(session => (
                    <div key={session.id} className="rounded-xl border border-border-default bg-surface p-4">
                      <div className="flex items-center justify-between"><div><div className="text-[12.5px] font-semibold text-text-primary">{formatChineseDate(session.startedAt, true)} 直播</div><div className="mt-0.5 text-[10.5px] text-text-tertiary">时长 {session.duration}</div></div><Radio size={17} className="text-rose-500" /></div>
                      <div className="mt-4 grid grid-cols-5 gap-3">{[["观看人数",session.viewers],["峰值在线",session.peakOnline],["平均停留",session.avgWatch],["互动",session.interactions],["新增粉丝",session.followerGain]].map(([label,value]) => <div key={String(label)} className="rounded-lg bg-surface-subtle p-3"><div className="text-[10.5px] text-text-tertiary">{label}</div><div className="mt-1 text-[14px] font-semibold text-text-primary">{typeof value === "number" ? value.toLocaleString() : value || "未获取"}</div></div>)}</div>
                    </div>
                  ))}
                </div>
              )}

              {detailTab === "followers" && (
                <div className="space-y-4">
                  <DataScopeNotice profile={selected} scope="粉丝数据" />
                  {selected.followerTotal === undefined ? <EmptyState icon={Users} title="粉丝数据未获取" detail="等待下一次采集，当前不用0代替缺失数据。" /> : (
                    <div className="rounded-xl border border-border-default bg-surface p-5">
                      <div className="flex items-end justify-between"><div><div className="text-[11px] text-text-tertiary">粉丝总量</div><div className="mt-1 text-[28px] font-semibold text-text-primary tabular-nums">{selected.followerTotal.toLocaleString()}</div></div><div className="rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] font-medium text-emerald-700"><TrendingUp size={14} className="mr-1 inline" />近30日 +{selected.followerDelta30d?.toLocaleString() || "未获取"}</div></div>
                      <div className="mt-6 flex h-40 items-end gap-3 border-b border-border-default px-2">{selected.followerTrend.map((value,index) => { const max = Math.max(...selected.followerTrend); const min = Math.min(...selected.followerTrend); const height = 32 + ((value - min) / Math.max(1, max - min)) * 96; return <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t bg-neutral-800" style={{height}} /><span className="text-[9.5px] text-text-tertiary">{index + 1}周</span></div>; })}</div>
                      <div className="mt-4 rounded-lg bg-surface-subtle p-3 text-[11px] text-text-secondary">粉丝画像、活跃时间和兴趣标签将仅在采集到对应字段时展示。</div>
                    </div>
                  )}
                </div>
              )}

              {detailTab === "collection" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <InfoCard label="当前采集状态" value={selected.collectionState} icon={Activity} />
                    <InfoCard label="最近成功采集" value={selected.lastCollectedAt ? formatChineseDate(selected.lastCollectedAt, true) : "尚未采集"} icon={CheckCircle2} />
                    <InfoCard label="下次计划采集" value={selected.nextCollectionAt ? formatChineseDate(selected.nextCollectionAt, true) : "待安排"} icon={Clock3} />
                  </div>
                  <div className="rounded-xl border border-border-default bg-surface p-4"><div className="text-[11.5px] font-semibold text-text-primary">已覆盖数据</div><div className="mt-3 flex flex-wrap gap-2">{selected.coverage.length ? selected.coverage.map(item => <span key={item} className="rounded-md border border-border-default bg-surface-subtle px-2.5 py-1 text-[10.5px] text-text-secondary">{item}</span>) : <span className="text-[11px] text-text-tertiary">等待首次采集结果</span>}</div></div>
                  <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
                    <div className="grid grid-cols-[130px_110px_90px_1fr] gap-3 border-b border-border-default bg-surface-subtle px-4 py-2.5 text-[10.5px] text-text-tertiary"><span>时间</span><span>范围</span><span>结果</span><span>说明</span></div>
                    {selected.collectionLogs.map(log => <div key={log.id} className="grid grid-cols-[130px_110px_90px_1fr] gap-3 border-b border-border-subtle px-4 py-3 text-[11px] last:border-b-0"><span>{formatChineseDate(log.time, true) || log.time}</span><span>{log.scope}</span><span className={log.result === "成功" ? "text-emerald-700" : log.result === "失败" ? "text-rose-700" : "text-amber-700"}>{log.result}</span><span className="text-text-secondary">{log.detail}</span></div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border-default bg-surface p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between"><div><h3 className="text-[15px] font-semibold text-text-primary">加入发布账号</h3><p className="mt-1 text-[11px] text-text-tertiary">加入后可参与方案发布日历，并开始首次账号后台爬虫采集。</p></div><button onClick={() => setShowAddModal(false)} className="p-1 text-text-tertiary"><X size={17} /></button></div>
            <div className="mt-5 space-y-4">
              <label className="block"><span className="text-[11.5px] font-medium text-text-secondary">账号昵称</span><input value={newName} onChange={event => setNewName(event.target.value)} placeholder="输入小红书账号昵称" className="mt-1.5 w-full rounded-lg border border-border-default px-3 py-2.5 text-[12px] outline-none focus:border-border-strong" /></label>
              <label className="block"><span className="text-[11.5px] font-medium text-text-secondary">平台账号ID</span><div className="relative mt-1.5"><Link2 size={14} className="absolute left-3 top-2.5 text-text-tertiary" /><input value={newXhsId} onChange={event => setNewXhsId(event.target.value)} placeholder="用于匹配发布笔记与后台数据" className="w-full rounded-lg border border-border-default py-2.5 pl-8 pr-3 text-[12px] outline-none focus:border-border-strong" /></div></label>
              <label className="block"><span className="text-[11.5px] font-medium text-text-secondary">账号关系</span><select value={newRelation} onChange={event => setNewRelation(event.target.value as AccountRelation)} className="mt-1.5 w-full rounded-lg border border-border-default bg-surface px-3 py-2.5 text-[12px] outline-none"><option>自有品牌号</option><option>员工KOS</option><option>协作KOC</option></select></label>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[11px] leading-5 text-blue-900">这里只记录发布关系与数据采集状态，不判断账号是否可用。</div>
            </div>
            <div className="mt-5 flex justify-end gap-2"><button onClick={() => setShowAddModal(false)} className="rounded-lg px-3 py-2 text-[12px] text-text-secondary">取消</button><button disabled={!newName.trim() || !newXhsId.trim()} onClick={addAccount} className="rounded-lg bg-action-primary px-4 py-2 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">加入并开始采集</button></div>
          </div>
        </div>
      )}

      {feedback && <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-lg bg-neutral-950 px-4 py-2.5 text-[12px] text-white shadow-xl">{feedback}</div>}
    </div>
  );
};

function EmptyState({ icon: Icon, title, detail }: { icon: React.ElementType; title: string; detail: string }) {
  return <div className="rounded-xl border border-dashed border-border-strong bg-surface px-4 py-14 text-center"><Icon size={24} className="mx-auto text-text-tertiary" /><div className="mt-2 text-[12.5px] font-medium text-text-primary">{title}</div><div className="mt-1 text-[11px] text-text-tertiary">{detail}</div></div>;
}

function DataScopeNotice({ profile, scope }: { profile: AccountProfile; scope: string }) {
  const covered = profile.coverage.some(item => item.includes(scope.replace("数据", "")) || item === scope);
  return <div className="flex items-start justify-between gap-3 rounded-xl border border-border-default bg-surface px-4 py-3"><div><div className="text-[12px] font-semibold text-text-primary">{scope}</div><div className="mt-0.5 text-[10.5px] text-text-tertiary">数据来自账号后台爬虫采集快照；未取得的字段显示“未获取”，不用0填充。</div></div><span className={`shrink-0 rounded-md border px-2 py-1 text-[10.5px] ${covered ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-800"}`}>{covered ? "已纳入采集" : "当前未覆盖"}</span></div>;
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return <div className="rounded-xl border border-border-default bg-surface p-4"><div className="flex items-center gap-1.5 text-[10.5px] text-text-tertiary"><Icon size={13} />{label}</div><div className="mt-2 text-[12px] font-semibold text-text-primary">{value}</div></div>;
}
