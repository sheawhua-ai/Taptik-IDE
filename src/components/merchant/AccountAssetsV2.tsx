import React, { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, CalendarDays, CheckCircle2,
  ChevronRight, Clock3, Database, ExternalLink, FileText, Plus, Radio,
  RefreshCw, Save, Search, ShieldCheck, Smartphone, TrendingUp, UserRound,
  Users, X
} from "lucide-react";
import { useProjectStore } from "../../context/ProjectContext";
import { formatChineseDate } from "../../utils/formatDate";

type AccountRelation = "自有品牌号" | "员工KOS" | "协作KOC";
type CollectionState = "数据已更新" | "正在采集" | "部分数据缺失" | "采集失败" | "尚未采集";
type DetailTab = "config" | "calendar" | "notes" | "live" | "followers" | "collection";

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
  avatarUrl: string;
  platformProfileUpdatedAt: string;
  relation: AccountRelation;
  matrixRole: string;
  description: string;
  persona: string;
  publishDevice: string;
  devicePhone: string;
  employeeName: string;
  employeeDept: string;
  publishInstruction: string;
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

interface AccountConfigDraft {
  relation: AccountRelation;
  matrixRole: string;
  persona: string;
  publishDevice: string;
  devicePhone: string;
  employeeName: string;
  employeeDept: string;
  publishInstruction: string;
}

const toConfigDraft = (profile: AccountProfile): AccountConfigDraft => ({
  relation: profile.relation,
  matrixRole: profile.matrixRole,
  persona: profile.persona,
  publishDevice: profile.publishDevice,
  devicePhone: profile.devicePhone,
  employeeName: profile.employeeName,
  employeeDept: profile.employeeDept,
  publishInstruction: profile.publishInstruction
});

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
    avatarUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=96&h=96&fit=crop",
    platformProfileUpdatedAt: "2026-08-25 10:30",
    relation: "自有品牌号",
    matrixRole: "品牌背书与权威科普",
    description: "承担品牌权威解释、产品信息和搜索词卡位。",
    persona: "可信、克制的品牌营养顾问，以检测依据和喂养方法建立专业感。",
    publishDevice: "发布手机 A-01",
    devicePhone: "186****1836",
    employeeName: "林晓雯",
    employeeDept: "品牌运营组",
    publishInstruction: "发布前核对产品批次与检测报告；评论区专业问题在 30 分钟内转交营养顾问。",
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
    avatarUrl: "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=96&h=96&fit=crop",
    platformProfileUpdatedAt: "2026-08-25 09:40",
    relation: "员工KOS",
    matrixRole: "门店专业解答",
    description: "以店长视角讲解喂养问题，承接门店咨询。",
    persona: "在店十年的宠粮店长，用顾客案例解释换粮问题，语言直接、可靠。",
    publishDevice: "发布手机 A-02",
    devicePhone: "186****5219",
    employeeName: "陆佳怡",
    employeeDept: "陆家嘴门店",
    publishInstruction: "按发布任务完成店内实拍；收到指令后 2 小时内发布并回传笔记链接。",
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
    avatarUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=96&h=96&fit=crop",
    platformProfileUpdatedAt: "2026-08-25 08:15",
    relation: "协作KOC",
    matrixRole: "消费者真实体验",
    description: "通过内容包参与体验，发布真实换粮记录。",
    persona: "新手金毛家长，重点记录七日换粮中的便便、食欲与精神状态变化。",
    publishDevice: "协作手机 K-01",
    devicePhone: "137****6608",
    employeeName: "周婧",
    employeeDept: "KOC 协作组",
    publishInstruction: "由协作负责人通知领取内容包的 KOC；只提醒节点，不改写消费者真实体验。",
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
    avatarUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=96&h=96&fit=crop",
    platformProfileUpdatedAt: "2026-08-24 18:20",
    relation: "协作KOC",
    matrixRole: "消费者避坑分享",
    description: "以消费者视角分享换粮避坑与使用感受。",
    persona: "谨慎型养猫用户，用日常观察讲换粮踩坑与解决过程。",
    publishDevice: "协作手机 K-02",
    devicePhone: "139****2471",
    employeeName: "周婧",
    employeeDept: "KOC 协作组",
    publishInstruction: "周婧统一发送发布提醒；体验反馈与问卷绑定，确认素材完整后再通知发布。",
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
  const [authorizationStep, setAuthorizationStep] = useState<"login" | "waiting" | "profile">("login");
  const [newRelation, setNewRelation] = useState<AccountRelation>("员工KOS");
  const [configDraft, setConfigDraft] = useState<AccountConfigDraft | null>(null);
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

  const openAccount = (profile: AccountProfile, tab: DetailTab = "config") => {
    setSelectedId(profile.id);
    setDetailTab(tab);
    setConfigDraft(toConfigDraft(profile));
  };

  const saveAccountConfig = () => {
    if (!selected || !configDraft) return;
    const duplicatedDevice = profiles.find(profile => profile.id !== selected.id && profile.devicePhone === configDraft.devicePhone && configDraft.devicePhone.trim());
    if (duplicatedDevice) {
      showFeedback(`该手机已绑定「${duplicatedDevice.nickname}」，一机只能对应一个账号`);
      return;
    }
    setProfiles(previous => previous.map(profile => profile.id === selected.id ? { ...profile, ...configDraft, description: configDraft.persona } : profile));
    showFeedback("运营配置已保存；平台头像和昵称仍由小红书同步");
  };

  const addAccount = () => {
    const next: AccountProfile = {
      id: `account-${Date.now()}`,
      nickname: "陆家嘴萌宠顾问",
      xhsId: "xhs_668821039",
      avatarUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=96&h=96&fit=crop",
      platformProfileUpdatedAt: "刚刚",
      relation: newRelation,
      matrixRole: newRelation === "自有品牌号" ? "品牌内容发布" : newRelation === "员工KOS" ? "员工专业内容" : "消费者体验内容",
      description: "待根据后续发布计划补充账号矩阵角色。",
      persona: "待配置账号人设与表达边界。",
      publishDevice: "待绑定专用手机",
      devicePhone: "",
      employeeName: "待分配",
      employeeDept: "",
      publishInstruction: "待配置发布提醒与回传要求。",
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
    setAuthorizationStep("login");
    showFeedback("已通过小红书登录获取账号资料，正在开始首次数据采集");
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-canvas">
      <div className="border-b border-border-default bg-surface px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-semibold text-text-primary">账号资产</h1>
              <span className="rounded-md border border-border-default bg-surface-subtle px-2 py-0.5 text-[11px] text-text-secondary">{profiles.length} 个发布账号</span>
            </div>
            <p className="mt-1 text-[12px] text-text-secondary">平台资料由小红书同步；Taptik 管理账号角色、发布员工与一机一号关系。</p>
          </div>
          <button onClick={() => { setAuthorizationStep("login"); setShowAddModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-action-primary-hover">
            <Plus size={15} />加入账号
          </button>
        </div>

        <div className="mt-3 grid grid-cols-4 divide-x divide-border-default rounded-xl border border-border-default bg-surface-subtle">
          {[
            { label: "发布账号", value: profiles.length, suffix: "个", note: "已加入账号矩阵" },
            { label: "发布安排", value: allScheduleCount, suffix: "篇", note: "与方案账号矩阵一致" },
            { label: "当前发布任务", value: activePublishCount, suffix: "项", note: "全部为人工发布" },
            { label: "数据待补齐", value: incompleteCollectionCount, suffix: "个", note: "包含采集中与失败" }
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div><div className="text-[10.5px] text-text-tertiary">{item.label}</div><div className="mt-0.5 text-[9.5px] text-text-tertiary">{item.note}</div></div>
              <div className="text-[18px] font-semibold text-text-primary tabular-nums">{item.value}<span className="ml-0.5 text-[10px] font-normal text-text-secondary">{item.suffix}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-default bg-surface px-6 py-2.5">
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

      <div className="p-4 px-6">
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
          <div className="grid grid-cols-[1.4fr_1.25fr_1.2fr_1.25fr_1fr_72px] gap-3 border-b border-border-default bg-surface-subtle px-4 py-2 text-[10.5px] font-medium text-text-tertiary">
            <span>小红书账号</span><span>角色与人设</span><span>发布员工 / 手机</span><span>排期与任务</span><span>数据采集</span><span>操作</span>
          </div>
          {filteredProfiles.map(profile => {
            const schedules = scheduleMap.get(profile.nickname) || [];
            const next = schedules.find(item => !["已发布", "观察中"].includes(item.publishStatus)) || schedules[0];
            const activeTasks = schedules.filter(item => !["已发布", "观察中", "已关闭"].includes(item.publishStatus));
            const lastNote = profile.noteMetrics[0];
            return (
              <button key={profile.id} onClick={() => openAccount(profile)} className="grid w-full grid-cols-[1.4fr_1.25fr_1.2fr_1.25fr_1fr_72px] items-center gap-3 border-b border-border-subtle px-4 py-3 text-left last:border-b-0 hover:bg-surface-hover">
                <span className="flex min-w-0 items-center gap-2.5">
                  <img src={profile.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full border border-border-default object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-text-primary">{profile.nickname}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-text-tertiary">ID: {profile.xhsId} · 平台同步</span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-medium text-text-primary">{profile.matrixRole}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-text-tertiary">{profile.persona}</span>
                </span>
                <span>
                  <span className="block text-[11.5px] font-medium text-text-primary">{profile.employeeName}<span className="ml-1 font-normal text-text-tertiary">· {profile.employeeDept}</span></span>
                  <span className="mt-0.5 block truncate text-[10px] text-text-tertiary">{profile.publishDevice} · {profile.devicePhone || "未绑定"}</span>
                </span>
                <span>
                  {next ? <><span className="block text-[11.5px] font-medium text-text-primary">{formatChineseDate(next.plannedDate)} · {activeTasks.length} 项任务</span><span className="mt-0.5 block truncate text-[10px] text-text-tertiary">{next.title}</span></> : <span className="text-[10.5px] text-text-tertiary">暂无发布安排</span>}
                </span>
                <span>
                  <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10.5px] font-medium ${stateTone[profile.collectionState]}`}>{profile.collectionState}</span>
                  <span className="mt-0.5 block text-[10px] text-text-tertiary">{lastNote ? `${lastNote.views?.toLocaleString() || "未获取"} 阅读` : profile.lastCollectedAt ? `${formatChineseDate(profile.lastCollectedAt, true)} 更新` : "等待首次采集"}</span>
                </span>
                <span className="flex items-center justify-end gap-0.5 text-[10.5px] font-medium text-text-secondary">管理<ChevronRight size={13} /></span>
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
                  <img src={selected.avatarUrl} alt="" className="h-11 w-11 rounded-full border border-border-default object-cover" />
                  <div>
                    <div className="flex items-center gap-2"><h2 className="text-[16px] font-semibold text-text-primary">{selected.nickname}</h2><span className="rounded border border-border-default bg-surface-subtle px-1.5 py-0.5 text-[10px] text-text-secondary">{selected.relation}</span></div>
                    <div className="mt-1 text-[11px] text-text-tertiary">ID: {selected.xhsId} · 头像与昵称由小红书同步</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => triggerCollection(selected.id)} className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-[11.5px] font-medium text-text-secondary hover:bg-surface-hover"><RefreshCw size={13} />重新采集</button>
                  <button onClick={() => setSelectedId(null)} className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-hover"><X size={17} /></button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 border-b border-border-subtle">
                {([
                  ["config", "运营配置", UserRound],
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
              {detailTab === "config" && configDraft && (
                <div className="space-y-4">
                  <section className="rounded-xl border border-border-default bg-surface p-4">
                    <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[12.5px] font-semibold text-text-primary"><ShieldCheck size={14} />小红书平台资料</div><p className="mt-1 text-[10.5px] text-text-tertiary">登录小红书创作服务平台后获取，Taptik 内不可手工修改。</p></div><span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">已同步</span></div>
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-surface-subtle p-3"><img src={selected.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" /><div><div className="text-[13px] font-semibold text-text-primary">{selected.nickname}</div><div className="mt-0.5 text-[10.5px] text-text-tertiary">小红书号：{selected.xhsId}</div><div className="mt-0.5 text-[9.5px] text-text-tertiary">最近同步：{formatChineseDate(selected.platformProfileUpdatedAt, true) || selected.platformProfileUpdatedAt}</div></div></div>
                  </section>

                  <section className="rounded-xl border border-border-default bg-surface p-4">
                    <div className="flex items-start justify-between gap-4"><div><div className="text-[12.5px] font-semibold text-text-primary">Taptik 运营配置</div><p className="mt-1 text-[10.5px] text-text-tertiary">决定该账号以什么身份参与方案，以及由谁使用哪台手机完成发布。</p></div><button onClick={saveAccountConfig} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-2 text-[11px] font-medium text-white"><Save size={13} />保存配置</button></div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <ConfigField label="账号关系"><select value={configDraft.relation} onChange={event => setConfigDraft({ ...configDraft, relation: event.target.value as AccountRelation })} className="w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-[11.5px] outline-none"><option>自有品牌号</option><option>员工KOS</option><option>协作KOC</option></select></ConfigField>
                      <ConfigField label="账号角色"><input value={configDraft.matrixRole} onChange={event => setConfigDraft({ ...configDraft, matrixRole: event.target.value })} className="w-full rounded-lg border border-border-default px-3 py-2 text-[11.5px] outline-none" /></ConfigField>
                      <div className="md:col-span-2"><ConfigField label="账号人设"><textarea value={configDraft.persona} onChange={event => setConfigDraft({ ...configDraft, persona: event.target.value })} rows={3} className="w-full resize-none rounded-lg border border-border-default px-3 py-2 text-[11.5px] leading-5 outline-none" /></ConfigField></div>
                    </div>
                    <div className="my-4 border-t border-border-subtle" />
                    <div className="flex items-center gap-2 text-[11.5px] font-semibold text-text-primary"><Smartphone size={14} />发布责任与设备</div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <ConfigField label="发布手机"><input value={configDraft.publishDevice} onChange={event => setConfigDraft({ ...configDraft, publishDevice: event.target.value })} placeholder="例如：发布手机 A-03" className="w-full rounded-lg border border-border-default px-3 py-2 text-[11.5px] outline-none" /></ConfigField>
                      <ConfigField label="对应手机号 / 设备标识" hint="一机只能绑定一个账号"><input value={configDraft.devicePhone} onChange={event => setConfigDraft({ ...configDraft, devicePhone: event.target.value })} placeholder="例如：186****5219" className="w-full rounded-lg border border-border-default px-3 py-2 text-[11.5px] outline-none" /></ConfigField>
                      <ConfigField label="发布负责人" hint="同一员工可以负责多个账号"><input value={configDraft.employeeName} onChange={event => setConfigDraft({ ...configDraft, employeeName: event.target.value })} className="w-full rounded-lg border border-border-default px-3 py-2 text-[11.5px] outline-none" /></ConfigField>
                      <ConfigField label="所属团队 / 门店"><input value={configDraft.employeeDept} onChange={event => setConfigDraft({ ...configDraft, employeeDept: event.target.value })} className="w-full rounded-lg border border-border-default px-3 py-2 text-[11.5px] outline-none" /></ConfigField>
                      <div className="md:col-span-2"><ConfigField label="发布指令与回传要求"><textarea value={configDraft.publishInstruction} onChange={event => setConfigDraft({ ...configDraft, publishInstruction: event.target.value })} rows={3} className="w-full resize-none rounded-lg border border-border-default px-3 py-2 text-[11.5px] leading-5 outline-none" /></ConfigField></div>
                    </div>
                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[10.5px] leading-5 text-blue-900">系统约束：一台发布手机只能绑定一个小红书账号；同一员工可以接收并处理多个账号的发布任务。</div>
                  </section>
                </div>
              )}

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
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border-default bg-surface shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-border-default px-5 py-4"><div><h3 className="text-[15px] font-semibold text-text-primary">登录小红书并加入账号</h3><p className="mt-1 text-[11px] text-text-tertiary">昵称、头像和小红书号由创作服务平台返回，无需手工填写。</p></div><button onClick={() => setShowAddModal(false)} className="p-1 text-text-tertiary"><X size={17} /></button></div>
            <div className="bg-canvas p-5">
              <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-border-default bg-surface-subtle px-3 py-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><div className="ml-2 flex flex-1 items-center justify-center rounded-md border border-border-default bg-white py-1 text-[9.5px] text-text-tertiary">https://creator.xiaohongshu.com</div></div>
                {authorizationStep === "login" && <div className="grid min-h-[330px] md:grid-cols-[1.15fr_1fr]"><div className="flex flex-col justify-center bg-gradient-to-br from-rose-50 to-white p-8"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff2442] text-[15px] font-bold text-white">薯</div><h4 className="mt-4 text-[18px] font-semibold text-text-primary">小红书创作服务平台</h4><p className="mt-2 text-[11.5px] leading-6 text-text-secondary">登录后授权 Taptik 获取当前账号的基础资料和创作数据，用于账号矩阵、发布日历与复盘。</p><div className="mt-4 flex items-center gap-2 text-[10.5px] text-text-tertiary"><ShieldCheck size={14} className="text-emerald-600" />不在 Taptik 保存登录密码</div></div><div className="flex flex-col justify-center p-8"><div className="text-[13px] font-semibold text-text-primary">使用小红书账号登录</div><p className="mt-1 text-[10.5px] text-text-tertiary">将在创作服务平台完成登录与授权。</p><button onClick={() => { window.open("https://creator.xiaohongshu.com", "_blank", "noopener,noreferrer"); setAuthorizationStep("waiting"); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff2442] px-4 py-2.5 text-[12px] font-semibold text-white">打开登录页面<ExternalLink size={13} /></button><div className="mt-3 text-center text-[9.5px] text-text-tertiary">完成登录后，本窗口将获取账号资料</div></div></div>}
                {authorizationStep === "waiting" && <div className="flex min-h-[330px] flex-col items-center justify-center p-8 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50"><RefreshCw size={20} className="animate-spin text-blue-600" /></div><h4 className="mt-4 text-[14px] font-semibold text-text-primary">等待小红书登录授权</h4><p className="mt-2 max-w-sm text-[11px] leading-5 text-text-tertiary">请在刚打开的创作服务平台完成登录。授权回调后将自动读取头像、昵称和小红书号。</p><button onClick={() => setAuthorizationStep("profile")} className="mt-5 rounded-lg border border-border-default bg-white px-4 py-2 text-[11.5px] font-medium text-text-primary">已完成登录，获取账号资料</button></div>}
                {authorizationStep === "profile" && <div className="min-h-[330px] p-7"><div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-700"><CheckCircle2 size={15} />已获取小红书账号资料</div><div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-subtle p-4"><img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=96&h=96&fit=crop" alt="" className="h-14 w-14 rounded-full object-cover" /><div><div className="text-[14px] font-semibold text-text-primary">陆家嘴萌宠顾问</div><div className="mt-1 text-[10.5px] text-text-tertiary">小红书号：xhs_668821039</div><div className="mt-1 text-[9.5px] text-emerald-700">头像、昵称来自小红书接口</div></div></div><label className="mt-5 block"><span className="text-[11px] font-medium text-text-secondary">加入后的账号关系</span><select value={newRelation} onChange={event => setNewRelation(event.target.value as AccountRelation)} className="mt-1.5 w-full rounded-lg border border-border-default bg-white px-3 py-2.5 text-[11.5px] outline-none"><option>自有品牌号</option><option>员工KOS</option><option>协作KOC</option></select></label><div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[10.5px] leading-5 text-blue-900">加入后进入“运营配置”，继续设置账号角色、人设、专用手机、发布员工和发布指令。</div></div>}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border-default px-5 py-4"><span className="text-[10px] text-text-tertiary">一台手机仅绑定一个账号；员工可负责多个账号。</span><div className="flex gap-2"><button onClick={() => setShowAddModal(false)} className="rounded-lg px-3 py-2 text-[12px] text-text-secondary">取消</button>{authorizationStep === "profile" && <button onClick={addAccount} className="rounded-lg bg-action-primary px-4 py-2 text-[12px] font-semibold text-white">确认加入账号</button>}</div></div>
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

function ConfigField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="flex items-center justify-between gap-2 text-[10.5px] font-medium text-text-secondary"><span>{label}</span>{hint && <span className="font-normal text-text-tertiary">{hint}</span>}</span><span className="mt-1.5 block">{children}</span></label>;
}
