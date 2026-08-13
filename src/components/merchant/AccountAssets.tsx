import React, { useState, useEffect } from "react";
import { 
  Users, Plus, RefreshCw, Search, CheckCircle2, 
  AlertTriangle, XCircle, Clock, ShieldCheck, Eye, Edit3, 
  Lock, BarChart2, FileText, Sparkles, X, 
  AlertCircle, Check, Info, HelpCircle,
  ExternalLink, ShieldAlert, Activity, UserPlus, Globe, Link2, Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types definition
export type AuthState = 
  | "unchecked"               // 待检查
  | "checking"                // 检查中
  | "logged_in"               // 已登录
  | "needs_login"             // 需重新登录
  | "verification_required"   // 需人工验证
  | "account_mismatch"        // 账号不一致
  | "unavailable";            // 暂时无法检查 / 外部监测

export type DataState =
  | "never_synced"            // 未同步
  | "refreshing"              // 同步中
  | "current"                 // 已更新
  | "stale"                   // 数据已过期
  | "failed";                 // 同步失败

export type AccountType = 
  | "品牌官方号"
  | "自有矩阵号"
  | "员工 KOS"
  | "外部合作号"
  | "竞品观察号";

export interface RecentNote {
  id: string;
  title: string;
  pubDate: string;
  likes: number;
  collects: number;
  comments: number;
  topicTag: string;
  isTopPerformance?: boolean;
}

export interface AccountAssetItem {
  id: string;
  avatar: string;
  nickname: string;
  xhsId: string;
  accountType: AccountType;
  persona: string;             // 人设说明
  contentBoundaries: string;   // 内容边界
  roles: string[];             // 可承担的账号角色
  owner: string;               // 负责人
  credentialStatus: "saved" | "unsaved"; // 凭据保存状态
  loginAccountPhone?: string;  // 绑定的手机号/账号
  
  // Auth state & times
  authState: AuthState;
  lastVerifiedAt: string | null; // 最近验证时间
  verifiedIdentityName?: string;
  verifiedIdentityXhsId?: string;

  // Data sync state & times
  dataState: DataState;
  lastDataUpdatedAt: string | null;  // 最近成功更新时间
  lastSyncResultMsg?: string;       // 本次同步结果
  nextRefreshAvailableAt: number;   // Timestamp ms when 6-hour cooldown expires
  
  // Stats Snapshot
  profileUrl?: string;         // 小红书主页链接 (达人号/竞品号)
  snapshot: {
    followersCount: number;
    followersDelta7d: number;
    notesCount: number;
    postFrequency: string;          // e.g. "周均 3 篇"
    totalInteractions: number;      // 赞藏评总数
  } | null;

  // Recent notes & topics for analysis
  recentNotes: RecentNote[];
  contentTopics: string[];

  // Status
  isDeactivated?: boolean;
}

// Struct for Scheme Engine Fact Export
export interface AccountFactExport {
  account_id: string;
  account_type: string;
  persona: string;
  content_boundaries: string;
  owner: string;
  verified_identity: {
    nickname: string;
    xhs_id: string;
  } | null;
  auth_state: AuthState;
  latest_snapshot: {
    followers_count: number;
    notes_count: number;
    total_likes_collects: number;
  } | null;
  content_topics: string[];
  historical_performance: {
    top_notes_sample: Array<{ note_id: string; title: string; likes: number; collects: number; comments: number; pub_date: string }>;
    avg_likes: number;
  } | null;
  sample_size: number;
  data_window: string;
  data_updated_at: string | null;
}

// Helper to check if an account type is purely external/public data based (cannot log in)
export const isExternalAccount = (type: AccountType) => {
  return type === "外部合作号" || type === "竞品观察号";
};

// Initial Mock Data
const INITIAL_ACCOUNTS: AccountAssetItem[] = [
  {
    id: "acc_101",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    nickname: "萌宠乐园官方旗舰店",
    xhsId: "petland_official",
    accountType: "品牌官方号",
    persona: "权威宠物养护科普，品牌新品首发与萌宠福利社",
    contentBoundaries: "严禁夸大疗效，严禁拉踩竞争品牌，专注材质安全与营养搭配科普",
    roles: ["品牌权威宣发", "新品首发发布", "活动抽奖线索"],
    owner: "李美玲 (品牌组)",
    credentialStatus: "saved",
    loginAccountPhone: "138****9012",
    authState: "logged_in",
    lastVerifiedAt: "2026-08-12 09:15:20",
    verifiedIdentityName: "萌宠乐园官方旗舰店",
    verifiedIdentityXhsId: "petland_official",
    dataState: "current",
    lastDataUpdatedAt: "2026-08-12 08:30:00",
    lastSyncResultMsg: "成功同步 42 篇笔记及最新互动指标数据",
    nextRefreshAvailableAt: Date.now() + 3.5 * 3600 * 1000,
    snapshot: {
      followersCount: 85400,
      followersDelta7d: 1200,
      notesCount: 128,
      postFrequency: "周均 4 篇",
      totalInteractions: 342100
    },
    recentNotes: [
      { id: "note_1001", title: "幼犬换粮期肠道避坑！成分表三看三不看", pubDate: "2026-08-08", likes: 3240, collects: 1820, comments: 412, topicTag: "科普干货", isTopPerformance: true },
      { id: "note_1002", title: "夏日毛孩子补水指南，养宠家庭必备", pubDate: "2026-08-05", likes: 1890, collects: 920, comments: 188, topicTag: "养宠日常" },
      { id: "note_1003", title: "新品无谷高肉冻干首发评测体验", pubDate: "2026-08-01", likes: 4510, collects: 2300, comments: 610, topicTag: "新品开箱", isTopPerformance: true },
      { id: "note_1004", title: "品牌故事：专注天然宠粮的第 8 年", pubDate: "2026-07-28", likes: 980, collects: 420, comments: 95, topicTag: "品牌宣传" }
    ],
    contentTopics: ["幼犬换粮", "成分拆解", "养宠日常", "新品开箱", "品牌故事"]
  },
  {
    id: "acc_102",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    nickname: "汪星人养宠日记",
    xhsId: "wangwang_diary_666",
    accountType: "自有矩阵号",
    persona: "多犬家庭真实养宠记录，沉浸式开箱与避坑测评",
    contentBoundaries: "接地气生活场景，真实记录养宠细节，避免硬广口播",
    roles: ["爆款场景测评", "日常种草", "互动评论区引导"],
    owner: "王强 (内容矩阵组)",
    credentialStatus: "saved",
    loginAccountPhone: "139****1123",
    authState: "needs_login",
    lastVerifiedAt: "2026-08-10 14:00:00",
    verifiedIdentityName: "汪星人养宠日记",
    verifiedIdentityXhsId: "wangwang_diary_666",
    dataState: "stale",
    lastDataUpdatedAt: "2026-08-10 14:05:00",
    lastSyncResultMsg: "登录会话过期，数据同步暂停，请重新登录",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 24100,
      followersDelta7d: 180,
      notesCount: 64,
      postFrequency: "周均 2 篇",
      totalInteractions: 89200
    },
    recentNotes: [
      { id: "note_2001", title: "我家两只金毛的爱吃粮清单大公开", pubDate: "2026-08-07", likes: 1210, collects: 640, comments: 142, topicTag: "红榜推荐" },
      { id: "note_2002", title: "新手第一次养狗容易犯的 5 个误区", pubDate: "2026-08-02", likes: 2150, collects: 1100, comments: 230, topicTag: "新手指南", isTopPerformance: true }
    ],
    contentTopics: ["多犬日常", "宠粮红榜", "避坑指南", "开箱体验"]
  },
  {
    id: "acc_103",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    nickname: "张店员的宠粮小课堂",
    xhsId: "kos_zhang_pets",
    accountType: "员工 KOS",
    persona: "5年资深宠粮营养师，门店一线现场解答犬猫肠道健康",
    contentBoundaries: "严谨专业，基于问答场景，不发表未经证实的言论",
    roles: ["专家答疑", "门店信任背书"],
    owner: "张伟 (陆家嘴门店)",
    credentialStatus: "saved",
    loginAccountPhone: "135****8877",
    authState: "verification_required",
    lastVerifiedAt: "2026-08-11 18:20:00",
    verifiedIdentityName: "张店员的宠粮小课堂",
    verifiedIdentityXhsId: "kos_zhang_pets",
    dataState: "current",
    lastDataUpdatedAt: "2026-08-11 18:25:00",
    lastSyncResultMsg: "触发安全合规校验，需人工验证后恢复发布",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 12800,
      followersDelta7d: 95,
      notesCount: 45,
      postFrequency: "周均 3 篇",
      totalInteractions: 41500
    },
    recentNotes: [
      { id: "note_3001", title: "门店顾客最常问的 3 个换粮问题答疑", pubDate: "2026-08-09", likes: 880, collects: 420, comments: 98, topicTag: "营养答疑" }
    ],
    contentTopics: ["肠道健康", "换粮答疑", "营养师视角"]
  },
  {
    id: "acc_104",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    nickname: "金毛奥斯卡的小日常",
    xhsId: "oscar_golden_retriever",
    profileUrl: "https://www.xiaohongshu.com/user/profile/5a8820f1000000000100223f",
    accountType: "外部合作号",
    persona: "头部宠物 KOC 博主，温馨家庭 Vlog 与金毛成长记录",
    contentBoundaries: "以萌宠互动为主，基于外部公开数据推断效果与受众匹配度",
    roles: ["KOC体验官", "爆款泛传播", "外部数据观察"],
    owner: "陈晨 (媒介组)",
    credentialStatus: "unsaved",
    authState: "unavailable",
    lastVerifiedAt: "2026-08-12 01:10:00",
    verifiedIdentityName: "金毛奥斯卡的小日常",
    verifiedIdentityXhsId: "oscar_golden_retriever",
    dataState: "current",
    lastDataUpdatedAt: "2026-08-12 01:10:00",
    lastSyncResultMsg: "已完成公开主页身份抓取与数据同步",
    nextRefreshAvailableAt: Date.now() + 2 * 3600 * 1000,
    snapshot: {
      followersCount: 152000,
      followersDelta7d: 3400,
      notesCount: 210,
      postFrequency: "周均 5 篇",
      totalInteractions: 890000
    },
    recentNotes: [
      { id: "note_4001", title: "带奥斯卡去郊游的快乐一天", pubDate: "2026-08-10", likes: 8900, collects: 3100, comments: 820, topicTag: "郊游Vlog", isTopPerformance: true }
    ],
    contentTopics: ["家庭Vlog", "金毛日常", "户外体验"]
  },
  {
    id: "acc_105",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    nickname: "皇家宠粮官方红书",
    xhsId: "royal_canin_official",
    profileUrl: "https://www.xiaohongshu.com/user/profile/5f9a1b2c000000000100334a",
    accountType: "竞品观察号",
    persona: "竞品标杆账号，监测其主推单品、营销节点与话题声量",
    contentBoundaries: "仅用于公开数据采集与行业观察，不进行任何互动或发文",
    roles: ["竞品观察", "行业监测"],
    owner: "张伟 (竞品情报组)",
    credentialStatus: "unsaved",
    authState: "unavailable",
    lastVerifiedAt: "2026-08-12 07:00:00",
    verifiedIdentityName: undefined,
    verifiedIdentityXhsId: "royal_canin_official",
    dataState: "current",
    lastDataUpdatedAt: "2026-08-12 07:05:00",
    lastSyncResultMsg: "已完成公开主页笔记抓取，实时监测竞品动向",
    nextRefreshAvailableAt: Date.now() + 4 * 3600 * 1000,
    snapshot: {
      followersCount: 198000,
      followersDelta7d: 2100,
      notesCount: 310,
      postFrequency: "周均 6 篇",
      totalInteractions: 1250000
    },
    recentNotes: [
      { id: "note_5001", title: "处方粮科学配方揭秘：守护处方需求宠物健康", pubDate: "2026-08-11", likes: 2100, collects: 980, comments: 140, topicTag: "竞品动作" }
    ],
    contentTopics: ["猫粮测评", "主食罐头", "处方粮科普"]
  }
];

// Utility to parse Xiaohongshu Profile URL or ID
export const parseXhsLinkOrId = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return { profileUrl: undefined, xhsId: "xhs_user", nickname: undefined };

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes("xiaohongshu.com") || trimmed.includes("xhslink.com")) {
    let extractedId = "ext_" + Math.random().toString(36).substring(2, 8);
    const match = trimmed.match(/user\/profile\/([a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      extractedId = match[1];
    }
    return {
      profileUrl: trimmed,
      xhsId: extractedId,
      nickname: `小红书账号 (${extractedId.substring(0, 10)})`
    };
  }

  return {
    profileUrl: undefined,
    xhsId: trimmed,
    nickname: undefined
  };
};

export function AccountAssets() {
  const [accounts, setAccounts] = useState<AccountAssetItem[]>(INITIAL_ACCOUNTS);
  const [now, setNow] = useState(Date.now());
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAuthState, setSelectedAuthState] = useState<string>("all");
  const [selectedDataState, setSelectedDataState] = useState<string>("all");

  // Drawer / Modals
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "performance" | "auth_sync" | "settings">("overview");
  
  // Add / Re-login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalTarget, setLoginModalTarget] = useState<AccountAssetItem | null>(null);
  const [isVerifyingInModal, setIsVerifyingInModal] = useState(false);
  const [modalVerifyStep, setModalVerifyStep] = useState<number>(0);

  // Form State for Modal / Settings
  const [formAccountType, setFormAccountType] = useState<AccountType>("自有矩阵号");
  const [formXhsId, setFormXhsId] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formOwner, setFormOwner] = useState("");
  const [formPersona, setFormPersona] = useState("");
  const [formBoundaries, setFormBoundaries] = useState("");

  // Sync animation flags
  const [isGlobalRefreshing, setIsGlobalRefreshing] = useState(false);
  const [globalRefreshMsg, setGlobalRefreshMsg] = useState<string | null>(null);

  // Timer ticker for 6-hour cooldowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper for cooldown remaining time in seconds
  const getCooldownSeconds = (targetTs: number) => {
    if (!targetTs) return 0;
    const diff = Math.floor((targetTs - now) / 1000);
    return diff > 0 ? diff : 0;
  };

  const formatCooldown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Helper for max cooldown among all accounts
  const maxGlobalCooldownSeconds = Math.max(
    0,
    ...accounts.map(a => getCooldownSeconds(a.nextRefreshAvailableAt))
  );

  // Selected account for details drawer
  const currentAccount = accounts.find(a => a.id === selectedAccountId) || null;

  // Filtered accounts logic
  const filteredAccounts = accounts.filter(acc => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = acc.nickname.toLowerCase().includes(q);
      const matchXhs = acc.xhsId.toLowerCase().includes(q);
      if (!matchName && !matchXhs) return false;
    }
    // Account Type Filter
    if (selectedType !== "all" && acc.accountType !== selectedType) {
      return false;
    }
    // Auth State Filter
    if (selectedAuthState !== "all" && acc.authState !== selectedAuthState) {
      return false;
    }
    // Data State Filter
    if (selectedDataState !== "all" && acc.dataState !== selectedDataState) {
      return false;
    }
    return true;
  });

  // Calculate real stats
  const totalCount = accounts.length;
  const verifiedCount = accounts.filter(a => a.authState === "logged_in").length;
  const externalCount = accounts.filter(a => isExternalAccount(a.accountType)).length;
  const needAttentionCount = accounts.filter(a => 
    !isExternalAccount(a.accountType) && (
      a.authState === "needs_login" || 
      a.authState === "verification_required" || 
      a.authState === "account_mismatch"
    )
  ).length;

  // Find latest full update time
  const syncedTimes = accounts
    .map(a => a.lastDataUpdatedAt)
    .filter((t): t is string => !!t)
    .sort()
    .reverse();
  const latestFullUpdate = syncedTimes[0] || "暂无全量数据记录";

  // Actions
  const handleOpenAddModal = () => {
    setLoginModalTarget(null);
    setFormAccountType("自有矩阵号");
    setFormXhsId("");
    setFormPhone("");
    setFormPassword("");
    setFormOwner("");
    setFormPersona("");
    setFormBoundaries("");
    setIsVerifyingInModal(false);
    setModalVerifyStep(0);
    setShowLoginModal(true);
  };

  const handleOpenReLoginModal = (acc: AccountAssetItem) => {
    setLoginModalTarget(acc);
    setFormAccountType(acc.accountType);
    setFormXhsId(acc.xhsId);
    setFormPhone(acc.loginAccountPhone || "");
    setFormPassword("");
    setFormOwner(acc.owner);
    setFormPersona(acc.persona);
    setFormBoundaries(acc.contentBoundaries);
    setIsVerifyingInModal(false);
    setModalVerifyStep(0);
    setShowLoginModal(true);
  };

  // Perform Login & Identity Check (or Save External Monitoring Account)
  const handleStartLoginAndVerify = () => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (isExternalAccount(formAccountType)) {
      // External accounts (KOC / 竞品) require no login password and support link input
      const targetId = loginModalTarget ? loginModalTarget.id : `acc_${Date.now()}`;
      const parsed = parseXhsLinkOrId(formXhsId);
      const profileUrlToUse = parsed.profileUrl || (formXhsId.startsWith("http") ? formXhsId : undefined);
      const xhsIdToUse = parsed.xhsId || (loginModalTarget ? loginModalTarget.xhsId : "external_account");
      const nicknameToUse = loginModalTarget ? loginModalTarget.nickname : (parsed.nickname || (formAccountType === "竞品观察号" ? "竞品观察对标号" : "达人合作号"));

      setAccounts(prev => {
        const exists = prev.find(p => p.id === targetId);
        if (exists) {
          return prev.map(p => p.id === targetId ? {
            ...p,
            accountType: formAccountType,
            xhsId: xhsIdToUse,
            profileUrl: profileUrlToUse || p.profileUrl,
            owner: formOwner || p.owner,
            persona: formPersona || p.persona,
            contentBoundaries: formBoundaries || p.contentBoundaries,
            credentialStatus: "unsaved",
            authState: "unavailable",
            lastVerifiedAt: nowStr,
            lastDataUpdatedAt: nowStr,
            lastSyncResultMsg: "已保存外部公开数据监测参数"
          } : p);
        } else {
          return [
            ...prev,
            {
              id: targetId,
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              nickname: nicknameToUse,
              xhsId: xhsIdToUse,
              profileUrl: profileUrlToUse,
              accountType: formAccountType,
              persona: formPersona || "外部公开指标数据监控",
              contentBoundaries: formBoundaries || "仅用于公开指标检索与分析",
              roles: formAccountType === "竞品观察号" ? ["竞品观察", "行业监测"] : ["达人合作", "效果评估"],
              owner: formOwner || "分析组",
              credentialStatus: "unsaved",
              authState: "unavailable",
              lastVerifiedAt: nowStr,
              dataState: "current",
              lastDataUpdatedAt: nowStr,
              lastSyncResultMsg: "已完成公开主页身份抓取与数据增量更新",
              nextRefreshAvailableAt: Date.now() + 6 * 3600 * 1000,
              snapshot: {
                followersCount: 120000,
                followersDelta7d: 1500,
                notesCount: 88,
                postFrequency: "周均 3 篇",
                totalInteractions: 320000
              },
              recentNotes: [],
              contentTopics: ["公开监测"]
            }
          ];
        }
      });
      setShowLoginModal(false);
      return;
    }

    // Normal internal account verification steps
    setIsVerifyingInModal(true);
    setModalVerifyStep(1);

    setTimeout(() => setModalVerifyStep(2), 600);
    setTimeout(() => setModalVerifyStep(3), 1200);

    setTimeout(() => {
      setIsVerifyingInModal(false);
      const targetId = loginModalTarget ? loginModalTarget.id : `acc_${Date.now()}`;
      const verifiedName = loginModalTarget ? loginModalTarget.nickname : (formXhsId || "博主账号");
      const verifiedXhs = formXhsId || (loginModalTarget ? loginModalTarget.xhsId : "xhs_user");

      setAccounts(prev => {
        const exists = prev.find(p => p.id === targetId);
        if (exists) {
          return prev.map(p => p.id === targetId ? {
            ...p,
            accountType: formAccountType,
            owner: formOwner || p.owner,
            persona: formPersona || p.persona,
            contentBoundaries: formBoundaries || p.contentBoundaries,
            credentialStatus: "saved",
            loginAccountPhone: formPhone || p.loginAccountPhone,
            authState: "logged_in",
            lastVerifiedAt: nowStr,
            verifiedIdentityName: verifiedName,
            verifiedIdentityXhsId: verifiedXhs,
            dataState: p.dataState === "failed" ? "current" : p.dataState,
            lastDataUpdatedAt: p.dataState === "failed" ? nowStr : p.lastDataUpdatedAt,
            lastSyncResultMsg: "登录校验通过，会话有效"
          } : p);
        } else {
          return [
            ...prev,
            {
              id: targetId,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              nickname: verifiedName,
              xhsId: verifiedXhs,
              accountType: formAccountType,
              persona: formPersona || "新绑定账号人设说明",
              contentBoundaries: formBoundaries || "标准品牌内容边界",
              roles: ["通用发布"],
              owner: formOwner || "未分配",
              credentialStatus: "saved",
              loginAccountPhone: formPhone,
              authState: "logged_in",
              lastVerifiedAt: nowStr,
              verifiedIdentityName: verifiedName,
              verifiedIdentityXhsId: verifiedXhs,
              dataState: "current",
              lastDataUpdatedAt: nowStr,
              lastSyncResultMsg: "新增账号会话绑定成功，并完成全量同步",
              nextRefreshAvailableAt: Date.now() + 6 * 3600 * 1000,
              snapshot: {
                followersCount: 15000,
                followersDelta7d: 320,
                notesCount: 22,
                postFrequency: "周均 2 篇",
                totalInteractions: 45000
              },
              recentNotes: [],
              contentTopics: ["生活日常"]
            }
          ];
        }
      });
      setShowLoginModal(false);
    }, 1800);
  };

  // Single Account Refresh
  const handleRefreshSingleAccount = (acc: AccountAssetItem) => {
    const cdSec = getCooldownSeconds(acc.nextRefreshAvailableAt);
    if (cdSec > 0) {
      alert(`此账号正在 6 小时冷冻防频繁保护中，剩余 ${formatCooldown(cdSec)}。`);
      return;
    }

    setAccounts(prev => prev.map(p => {
      if (p.id === acc.id) {
        return { ...p, dataState: "refreshing" };
      }
      return p;
    }));

    setTimeout(() => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setAccounts(prev => prev.map(p => {
        if (p.id === acc.id) {
          return {
            ...p,
            dataState: "current",
            lastDataUpdatedAt: nowStr,
            lastSyncResultMsg: "增量同步完成，已刷新近期数据快照",
            nextRefreshAvailableAt: Date.now() + 6 * 3600 * 1000,
            snapshot: p.snapshot ? {
              ...p.snapshot,
              followersCount: p.snapshot.followersCount + Math.floor(Math.random() * 50),
              totalInteractions: p.snapshot.totalInteractions + Math.floor(Math.random() * 300)
            } : {
              followersCount: 15000,
              followersDelta7d: 320,
              notesCount: 22,
              postFrequency: "周均 2 篇",
              totalInteractions: 45000
            }
          };
        }
        return p;
      }));
    }, 1200);
  };

  // Check Login State
  const handleCheckLogin = (accId: string) => {
    setAccounts(prev => prev.map(p => {
      if (p.id === accId) {
        return { ...p, authState: "checking" };
      }
      return p;
    }));

    setTimeout(() => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setAccounts(prev => prev.map(p => {
        if (p.id === accId) {
          return {
            ...p,
            authState: "logged_in",
            lastVerifiedAt: nowStr
          };
        }
        return p;
      }));
    }, 1000);
  };

  // Global Refresh All Accounts
  const handleRefreshAll = () => {
    if (maxGlobalCooldownSeconds > 0) {
      alert(`冷冻期保护中：距离下次全量刷新还剩 ${formatCooldown(maxGlobalCooldownSeconds)}。`);
      return;
    }

    setIsGlobalRefreshing(true);
    setGlobalRefreshMsg("正在自动校验各账号登录与同步状态...");

    setTimeout(() => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      setAccounts(prev => prev.map(p => {
        if (!isExternalAccount(p.accountType) && (p.authState === "needs_login" || p.authState === "account_mismatch")) {
          return {
            ...p,
            dataState: "stale",
            lastSyncResultMsg: "自动停止刷新：登录失效或账号不匹配，请重新登录"
          };
        }
        return {
          ...p,
          dataState: "current",
          lastDataUpdatedAt: nowStr,
          lastSyncResultMsg: "全量数据同步完成，已更新最新表现指标",
          nextRefreshAvailableAt: Date.now() + 6 * 3600 * 1000
        };
      }));

      setIsGlobalRefreshing(false);
      setGlobalRefreshMsg(null);
    }, 1800);
  };

  // Save Settings from Drawer
  const handleSaveSettingsInDrawer = (accId: string) => {
    setAccounts(prev => prev.map(p => {
      if (p.id === accId) {
        const isExternal = isExternalAccount(formAccountType);
        const parsed = isExternal && formXhsId ? parseXhsLinkOrId(formXhsId) : { profileUrl: undefined, xhsId: p.xhsId };
        return {
          ...p,
          accountType: formAccountType,
          owner: formOwner,
          persona: formPersona,
          contentBoundaries: formBoundaries,
          xhsId: parsed.xhsId || p.xhsId,
          profileUrl: isExternal ? (parsed.profileUrl || p.profileUrl) : undefined,
          loginAccountPhone: isExternal ? undefined : (formPhone || p.loginAccountPhone),
          credentialStatus: isExternal ? "unsaved" : (formPassword ? "saved" : p.credentialStatus)
        };
      }
      return p;
    }));
    alert("监控/账号设置修改成功！已保存最新的属性与属性事实。");
  };

  // Toggle Account Deactivation
  const handleToggleDeactivate = (accId: string) => {
    setAccounts(prev => prev.map(p => {
      if (p.id === accId) {
        return { ...p, isDeactivated: !p.isDeactivated };
      }
      return p;
    }));
  };

  // Unified Auth State UI Helper
  const renderAuthStateBadge = (state: AuthState, lastVerifiedTime?: string | null, accountType?: AccountType) => {
    if (accountType && isExternalAccount(accountType)) {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 w-fit">
            <Eye size={11} className="text-neutral-600" />
            外部数据监测 (免登录)
          </span>
          <span className="text-[10px] text-neutral-500">基于公开主页数据推断</span>
        </div>
      );
    }

    switch (state) {
      case "logged_in":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              已登录
            </span>
            <span className="text-[10px] text-neutral-500">
              验证于 {lastVerifiedTime ? lastVerifiedTime.substring(11, 16) : "--:--"}
            </span>
          </div>
        );
      case "checking":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 w-fit">
              <RefreshCw size={11} className="animate-spin text-neutral-600" />
              检查中
            </span>
            <span className="text-[10px] text-neutral-500">正在与服务器校验...</span>
          </div>
        );
      case "needs_login":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 w-fit">
              <XCircle size={11} className="text-neutral-700" />
              需重新登录
            </span>
            <span className="text-[10px] text-neutral-500">会话已过期</span>
          </div>
        );
      case "verification_required":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 w-fit">
              <ShieldAlert size={11} className="text-neutral-700" />
              需人工验证
            </span>
            <span className="text-[10px] text-neutral-500">滑动拼图/扫码</span>
          </div>
        );
      case "account_mismatch":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 w-fit">
              <AlertTriangle size={11} className="text-neutral-700" />
              账号不一致
            </span>
            <span className="text-[10px] text-neutral-500">与绑定ID不符</span>
          </div>
        );
      case "unavailable":
      default:
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200 w-fit">
              <HelpCircle size={11} className="text-neutral-500" />
              暂时无法检查
            </span>
            <span className="text-[10px] text-neutral-500">网络或系统维护</span>
          </div>
        );
    }
  };

  // Unified Data State UI Helper
  const renderDataStateBadge = (state: DataState, lastUpdatedTime?: string | null, cooldownSec: number = 0) => {
    switch (state) {
      case "current":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 w-fit">
              <Check size={11} />
              已更新
            </span>
            <span className="text-[10px] text-neutral-500">
              {lastUpdatedTime ? lastUpdatedTime.substring(5, 16) : "最近"}
            </span>
          </div>
        );
      case "refreshing":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 w-fit">
              <RefreshCw size={11} className="animate-spin text-neutral-600" />
              同步中...
            </span>
            <span className="text-[10px] text-neutral-500">正在抓取数据</span>
          </div>
        );
      case "stale":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200 w-fit">
              <AlertCircle size={11} />
              数据需更新
            </span>
            <span className="text-[10px] text-neutral-500">
              {cooldownSec > 0 ? `冷冻中 (${Math.ceil(cooldownSec / 60)}分)` : "建议手动同步"}
            </span>
          </div>
        );
      case "failed":
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200 w-fit">
              <XCircle size={11} />
              同步失败
            </span>
            <span className="text-[10px] text-neutral-500">数据拉取失败</span>
          </div>
        );
      case "never_synced":
      default:
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-50 text-neutral-500 border border-neutral-200 w-fit">
              未同步
            </span>
            <span className="text-[10px] text-neutral-500">尚无指标记录</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] h-full min-h-0 overflow-hidden">
      
      {/* 1. Header Area */}
      <div className="px-8 py-5 border-b border-[#EAECF0] bg-white shrink-0 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-[#111827] tracking-tight">账号资产</h1>
            </div>
            <p className="text-[13px] text-[#667085] mt-1">
              集中统一监控与管理品牌官方号、矩阵号、员工 KOS 及外部达人/竞品账号。
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Global Refresh Button */}
            <button
              onClick={handleRefreshAll}
              disabled={isGlobalRefreshing || maxGlobalCooldownSeconds > 0}
              className={`px-4 py-2 border rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-2xs ${
                maxGlobalCooldownSeconds > 0
                  ? "bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed"
                  : isGlobalRefreshing
                  ? "bg-neutral-100 border-neutral-300 text-neutral-900"
                  : "bg-white border-[#EAECF0] text-[#344054] hover:bg-neutral-50"
              }`}
              title={maxGlobalCooldownSeconds > 0 ? `6小时防频繁保护，剩余 ${formatCooldown(maxGlobalCooldownSeconds)}` : "刷新全量账号数据"}
            >
              <RefreshCw size={15} className={isGlobalRefreshing ? "animate-spin text-neutral-700" : "text-neutral-500"} />
              {isGlobalRefreshing ? (
                <span>正在全量同步...</span>
              ) : maxGlobalCooldownSeconds > 0 ? (
                <span>冷冻中 ({formatCooldown(maxGlobalCooldownSeconds)})</span>
              ) : (
                <span>刷新全部</span>
              )}
            </button>

            {/* Add Account Button */}
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-2xs"
            >
              <Plus size={16} />
              <span>新增监控账号</span>
            </button>
          </div>
        </div>

        {/* Refresh progress alert bar */}
        {globalRefreshMsg && (
          <div className="mt-3 px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-[12px] text-neutral-800 flex items-center gap-2 animate-pulse">
            <RefreshCw size={14} className="animate-spin text-neutral-600" />
            <span>{globalRefreshMsg}</span>
          </div>
        )}
      </div>

      {/* Main Content Area - Scrollable Container with min-h-0 */}
      <div className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* 2. Overview Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-[#EAECF0] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[12px] font-medium text-[#667085]">账号总数</span>
                <div className="text-[22px] font-bold text-[#111827] mt-1">{totalCount}</div>
              </div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700 border border-neutral-200">
                <Users size={18} />
              </div>
            </div>

            <div className="bg-white border border-[#EAECF0] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[12px] font-medium text-[#667085]">已验证登录</span>
                <div className="text-[22px] font-bold text-[#111827] mt-1">{verifiedCount}</div>
              </div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700 border border-neutral-200">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="bg-white border border-[#EAECF0] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[12px] font-medium text-[#667085]">外部公开数据监测</span>
                <div className="text-[22px] font-bold text-[#111827] mt-1">{externalCount}</div>
              </div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700 border border-neutral-200">
                <Eye size={18} />
              </div>
            </div>

            <div className="bg-white border border-[#EAECF0] rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[12px] font-medium text-[#667085]">最近一次全量更新</span>
                <div className="text-[13px] font-bold text-[#111827] mt-2 font-mono">
                  {latestFullUpdate.substring(5, 16)}
                </div>
              </div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700 border border-neutral-200">
                <Activity size={18} />
              </div>
            </div>

          </div>

          {/* 3. Filter Bar */}
          <div className="bg-white border border-[#EAECF0] rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索账号昵称或小红书号..."
                className="w-full pl-9 pr-3.5 py-2 border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-neutral-400 bg-neutral-50/50"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Account Type Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-[#EAECF0] px-3 py-1.5 rounded-xl text-[12px]">
                <span className="text-neutral-500 font-medium">账号类型:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent font-bold text-neutral-800 outline-none cursor-pointer"
                >
                  <option value="all">全部类型</option>
                  <option value="品牌官方号">品牌官方号</option>
                  <option value="自有矩阵号">自有矩阵号</option>
                  <option value="员工 KOS">员工 KOS</option>
                  <option value="外部合作号">外部合作号</option>
                  <option value="竞品观察号">竞品观察号</option>
                </select>
              </div>

              {/* Auth State Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-[#EAECF0] px-3 py-1.5 rounded-xl text-[12px]">
                <span className="text-neutral-500 font-medium">登录状态:</span>
                <select
                  value={selectedAuthState}
                  onChange={(e) => setSelectedAuthState(e.target.value)}
                  className="bg-transparent font-bold text-neutral-800 outline-none cursor-pointer"
                >
                  <option value="all">全部状态</option>
                  <option value="logged_in">已登录</option>
                  <option value="needs_login">需重新登录</option>
                  <option value="verification_required">需人工验证</option>
                  <option value="account_mismatch">账号不一致</option>
                  <option value="unavailable">暂时无法检查 / 外部监测</option>
                </select>
              </div>

              {/* Data State Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-[#EAECF0] px-3 py-1.5 rounded-xl text-[12px]">
                <span className="text-neutral-500 font-medium">数据状态:</span>
                <select
                  value={selectedDataState}
                  onChange={(e) => setSelectedDataState(e.target.value)}
                  className="bg-transparent font-bold text-neutral-800 outline-none cursor-pointer"
                >
                  <option value="all">全部状态</option>
                  <option value="current">已更新</option>
                  <option value="stale">数据已过期</option>
                  <option value="failed">同步失败</option>
                  <option value="never_synced">未同步</option>
                  <option value="refreshing">同步中</option>
                </select>
              </div>

            </div>
          </div>

          {/* 4. Account List Table */}
          <div className="bg-white border border-[#EAECF0] rounded-2xl shadow-2xs overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAECF0] bg-neutral-50/60 text-[12px] font-bold text-[#475467]">
                    <th className="px-6 py-3.5 whitespace-nowrap">账号信息 / 小红书号</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">账号类型</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">人设摘要</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">负责人</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">登录状态 & 最近验证</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">数据状态 & 最近更新</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] text-[13px]">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                        未检索到符合条件的账号资产
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map(acc => {
                      const cdSec = getCooldownSeconds(acc.nextRefreshAvailableAt);
                      const isExternal = isExternalAccount(acc.accountType);

                      return (
                        <tr key={acc.id} className={`hover:bg-neutral-50/70 transition-colors ${acc.isDeactivated ? "opacity-50 bg-neutral-50/30" : ""}`}>
                          
                          {/* Avatar & ID */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={acc.avatar} alt={acc.nickname} className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0" />
                              <div className="min-w-0">
                                <div className="font-bold text-[#111827] flex items-center gap-1.5 truncate">
                                  <span>{acc.nickname}</span>
                                  {acc.isDeactivated && (
                                    <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-600 rounded text-[10px]">已移出监控</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#667085] font-mono truncate flex items-center gap-1.5">
                                  <span>ID: {acc.xhsId}</span>
                                  {acc.profileUrl && (
                                    <a
                                      href={acc.profileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-neutral-500 hover:text-black hover:underline inline-flex items-center gap-0.5 text-[10px]"
                                      title="访问小红书主页"
                                    >
                                      <span>主页</span>
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Account Type Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2.5 py-1 rounded-lg text-[12px] font-bold border bg-neutral-100 text-neutral-800 border-neutral-200">
                              {acc.accountType}
                            </span>
                          </td>

                          {/* Persona */}
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-[12px] text-[#344054] line-clamp-2 leading-relaxed" title={acc.persona}>
                              {acc.persona}
                            </p>
                          </td>

                          {/* Owner */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-[12px] font-medium text-[#344054]">
                              {acc.owner}
                            </span>
                          </td>

                          {/* Auth State */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderAuthStateBadge(acc.authState, acc.lastVerifiedAt, acc.accountType)}
                          </td>

                          {/* Data State */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderDataStateBadge(acc.dataState, acc.lastDataUpdatedAt, cdSec)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              
                              {/* Internal Account Problem Actions */}
                              {!isExternal && acc.authState === "needs_login" && (
                                <button
                                  onClick={() => handleOpenReLoginModal(acc)}
                                  className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors"
                                >
                                  重新登录
                                </button>
                              )}

                              {!isExternal && acc.authState === "verification_required" && (
                                <button
                                  onClick={() => handleOpenReLoginModal(acc)}
                                  className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors"
                                >
                                  完成验证
                                </button>
                              )}

                              {!isExternal && acc.authState === "account_mismatch" && (
                                <button
                                  onClick={() => handleOpenReLoginModal(acc)}
                                  className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors"
                                >
                                  确认身份
                                </button>
                              )}

                              {(acc.dataState === "failed" || acc.dataState === "stale") && (!isExternal || acc.authState === "logged_in") && (
                                <button
                                  onClick={() => handleRefreshSingleAccount(acc)}
                                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-[11px] font-bold rounded-lg transition-colors"
                                >
                                  重试同步
                                </button>
                              )}

                              {/* Primary Action: 查看详情 */}
                              <button
                                onClick={() => {
                                  setSelectedAccountId(acc.id);
                                  setDrawerTab("overview");
                                }}
                                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#111827] text-[12px] font-bold rounded-xl transition-colors border border-neutral-200"
                              >
                                查看详情
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Account Details Drawer */}
      <AnimatePresence>
        {selectedAccountId && currentAccount && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAccountId(null)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-[#EAECF0]"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#EAECF0] flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <img src={currentAccount.avatar} alt={currentAccount.nickname} className="w-11 h-11 rounded-full object-cover border border-neutral-200" />
                  <div>
                    <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                      <span>{currentAccount.nickname}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-medium border border-neutral-200">
                        {currentAccount.accountType}
                      </span>
                    </h2>
                    <p className="text-[12px] text-[#667085] mt-0.5 font-mono">
                      小红书号: {currentAccount.xhsId} · 负责人: {currentAccount.owner}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAccountId(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="px-6 bg-neutral-50/80 border-b border-[#EAECF0] flex items-center gap-2 shrink-0">
                {(isExternalAccount(currentAccount.accountType) ? [
                  { id: "overview", label: "监控概览", icon: FileText },
                  { id: "performance", label: "内容表现", icon: BarChart2 },
                  { id: "auth_sync", label: "数据采集与源头", icon: ShieldCheck },
                  { id: "settings", label: "监控配置", icon: Lock }
                ] : [
                  { id: "overview", label: "账号概览", icon: FileText },
                  { id: "performance", label: "内容表现", icon: BarChart2 },
                  { id: "auth_sync", label: "登录与同步", icon: ShieldCheck },
                  { id: "settings", label: "账号设置", icon: Lock }
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setDrawerTab(tab.id as any);
                      if (tab.id === "settings") {
                        setFormAccountType(currentAccount.accountType);
                        setFormXhsId(currentAccount.profileUrl || currentAccount.xhsId);
                        setFormOwner(currentAccount.owner);
                        setFormPersona(currentAccount.persona);
                        setFormBoundaries(currentAccount.contentBoundaries);
                        setFormPhone(currentAccount.loginAccountPhone || "");
                        setFormPassword("");
                      }
                    }}
                    className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                      drawerTab === tab.id
                        ? "border-[#111827] text-[#111827]"
                        : "border-transparent text-[#667085] hover:text-[#111827]"
                    }`}
                  >
                    <tab.icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Drawer Content */}
              <div className="p-6 overflow-y-auto min-h-0 flex-1 space-y-6 bg-neutral-50/30">
                
                {/* TAB 1: 账号概览 */}
                {drawerTab === "overview" && (
                  <div className="space-y-6">
                    
                    {/* Basic Attributes Grid */}
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-4">
                      <h3 className="text-[14px] font-bold text-[#111827]">基础设定与角色</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-[13px]">
                        <div>
                          <span className="text-[11px] text-[#667085] block mb-1">小红书昵称</span>
                          <span className="font-bold text-[#111827]">{currentAccount.nickname}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#667085] block mb-1">小红书账号 ID</span>
                          <span className="font-bold text-[#111827] font-mono">{currentAccount.xhsId}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#667085] block mb-1">账号类型</span>
                          <span className="font-bold text-[#111827]">{currentAccount.accountType}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#667085] block mb-1">负责人</span>
                          <span className="font-bold text-[#111827]">{currentAccount.owner}</span>
                        </div>
                        {currentAccount.profileUrl && (
                          <div className="col-span-2 pt-1 border-t border-neutral-100">
                            <span className="text-[11px] text-[#667085] block mb-1">小红书主页链接</span>
                            <a
                              href={currentAccount.profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[12px] font-bold text-neutral-900 hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{currentAccount.profileUrl}</span>
                              <ExternalLink size={13} className="shrink-0 text-neutral-600" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-neutral-100 space-y-3">
                        <div>
                          <span className="text-[11px] text-[#667085] block mb-1">人设说明</span>
                          <p className="text-[12px] text-[#344054] leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            {currentAccount.persona}
                          </p>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#667085] block mb-1">内容边界</span>
                          <p className="text-[12px] text-[#344054] leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            {currentAccount.contentBoundaries}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[11px] text-[#667085] block mb-1.5">可承担的账号角色</span>
                        <div className="flex flex-wrap gap-2">
                          {currentAccount.roles.map((r, i) => (
                            <span key={i} className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[12px] font-medium border border-neutral-200">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Snapshot Card */}
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-[#111827]">最近一次数据快照</h3>
                        <span className="text-[11px] text-[#667085]">
                          同步于: {currentAccount.lastDataUpdatedAt || "暂未同步"}
                        </span>
                      </div>

                      {currentAccount.snapshot ? (
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-center">
                            <span className="text-[11px] text-[#667085] block">粉丝数</span>
                            <div className="text-[18px] font-bold text-[#111827] mt-1">
                              {currentAccount.snapshot.followersCount.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-neutral-600 font-bold block mt-0.5">
                              +7日: {currentAccount.snapshot.followersDelta7d}
                            </span>
                          </div>

                          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-center">
                            <span className="text-[11px] text-[#667085] block">发文数 / 频率</span>
                            <div className="text-[18px] font-bold text-[#111827] mt-1">
                              {currentAccount.snapshot.notesCount} 篇
                            </div>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">
                              {currentAccount.snapshot.postFrequency}
                            </span>
                          </div>

                          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-center">
                            <span className="text-[11px] text-[#667085] block">赞藏评互动总量</span>
                            <div className="text-[18px] font-bold text-[#111827] mt-1">
                              {currentAccount.snapshot.totalInteractions.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-neutral-600 font-medium block mt-0.5">
                              历史累计
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-[13px] text-neutral-400 bg-neutral-50 rounded-xl">
                          暂无足够数据快照
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 2: 内容表现 */}
                {drawerTab === "performance" && (
                  <div className="space-y-6">
                    
                    {/* Metrics Table / Summary */}
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-4">
                      <h3 className="text-[14px] font-bold text-[#111827]">公开采集指标</h3>
                      
                      {currentAccount.snapshot ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-[12px]">
                            <div>
                              <span className="text-neutral-500 block">粉丝数总量:</span>
                              <span className="text-[16px] font-bold text-neutral-900">{currentAccount.snapshot.followersCount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-neutral-500 block">发文频率:</span>
                              <span className="text-[16px] font-bold text-neutral-900">{currentAccount.snapshot.postFrequency}</span>
                            </div>
                          </div>

                          {/* Recent Notes List */}
                          <div>
                            <span className="text-[12px] font-bold text-neutral-700 block mb-2">最近已抓取笔记及指标</span>
                            <div className="space-y-2">
                              {currentAccount.recentNotes.length === 0 ? (
                                <div className="p-4 text-center text-[12px] text-neutral-400 bg-neutral-50 rounded-xl">
                                  暂无抓取的笔记记录
                                </div>
                              ) : (
                                currentAccount.recentNotes.map(n => (
                                  <div key={n.id} className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 text-[12px]">
                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold text-neutral-900 truncate flex items-center gap-2">
                                        <span>{n.title}</span>
                                        {n.isTopPerformance && (
                                          <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded text-[10px] font-bold">
                                            高赞表现
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-neutral-400 font-mono">
                                        发布日期: {n.pubDate} · 主题: {n.topicTag} · ID: {n.id}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
                                      <span className="text-neutral-800 font-bold">❤️ {n.likes}</span>
                                      <span className="text-neutral-800 font-bold">⭐ {n.collects}</span>
                                      <span className="text-neutral-800 font-bold">💬 {n.comments}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-[13px] text-neutral-400 bg-neutral-50 rounded-xl">
                          暂无足够数据
                        </div>
                      )}
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-[#111827] flex items-center gap-1.5">
                          <Sparkles size={16} className="text-neutral-700" />
                          <span>内容表现与受众匹配度总结</span>
                        </h3>
                      </div>

                      {currentAccount.recentNotes && currentAccount.recentNotes.length >= 2 ? (
                        <div className="space-y-4">
                          
                          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1 text-[11px] text-neutral-800">
                            <div className="font-bold flex items-center gap-1">
                              <Info size={13} className="text-neutral-600" />
                              <span>数据统计透明溯源:</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 font-mono text-[11px] text-neutral-600">
                              <span>· 基于样本: {currentAccount.recentNotes.length} 篇实际抓取笔记</span>
                              <span>· 统计时间窗口: 90 天观察期</span>
                              <span>· 数据截止时间: {currentAccount.lastDataUpdatedAt || "近期"}</span>
                              <span className="col-span-2 truncate">· 引用笔记 ID: {currentAccount.recentNotes.map(n => n.id).join(", ")}</span>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-[12px] text-[#344054] leading-relaxed">
                            <p>
                              1. <strong className="text-[#111827]">互动爆款方向:</strong> 主题集中于“<span className="font-bold">{currentAccount.contentTopics.slice(0, 2).join("与")}</span>”的笔记赞藏比提升显著，目标客群匹配精准。
                            </p>
                            <p>
                              2. <strong className="text-[#111827]">内容表达边界:</strong> 符合人设“{currentAccount.persona.substring(0, 20)}...”，未触发合规风险。
                            </p>
                          </div>

                        </div>
                      ) : (
                        <div className="p-8 text-center bg-neutral-50 rounded-xl space-y-1 border border-dashed border-neutral-200">
                          <span className="text-[13px] font-bold text-neutral-600 block">暂无足够数据</span>
                          <span className="text-[12px] text-neutral-400 block">
                            至少需要采集 2 篇以上实际公开笔记数据方可生成内容表现总结。
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 3: 登录与同步 */}
                {drawerTab === "auth_sync" && (
                  <div className="space-y-6">
                    
                    {/* Login Status Box */}
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-[#111827]">当前登录状态</h3>
                        {renderAuthStateBadge(currentAccount.authState, currentAccount.lastVerifiedAt, currentAccount.accountType)}
                      </div>

                      {isExternalAccount(currentAccount.accountType) ? (
                        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-[12px] text-neutral-700 leading-relaxed">
                          外部合作号 / 竞品观察号仅基于公开数据推断进行监测管理，无法且无需登录。
                        </div>
                      ) : (
                        <>
                          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-[12px]">
                            <div className="flex justify-between">
                              <span className="text-neutral-500">最近会话校验时间:</span>
                              <span className="font-bold text-neutral-900 font-mono">{currentAccount.lastVerifiedAt || "尚未校验"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">已验证小红书身份:</span>
                              <span className="font-bold text-neutral-900 font-mono">
                                {currentAccount.verifiedIdentityName ? `${currentAccount.verifiedIdentityName} (${currentAccount.verifiedIdentityXhsId})` : "未验证"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleCheckLogin(currentAccount.id)}
                              className="px-4 py-2 bg-white border border-[#EAECF0] hover:bg-neutral-50 text-[#111827] text-[12px] font-bold rounded-xl transition-colors shadow-2xs flex-1"
                            >
                              检查登录
                            </button>
                            <button
                              onClick={() => handleOpenReLoginModal(currentAccount)}
                              className="px-4 py-2 bg-[#111827] hover:bg-black text-white text-[12px] font-bold rounded-xl transition-colors shadow-2xs flex-1"
                            >
                              登录或重新登录
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Data Sync Status Box */}
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-[#111827]">数据同步记录</h3>
                        {renderDataStateBadge(currentAccount.dataState, currentAccount.lastDataUpdatedAt, getCooldownSeconds(currentAccount.nextRefreshAvailableAt))}
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">最近成功同步时间:</span>
                          <span className="font-bold text-neutral-900 font-mono">{currentAccount.lastDataUpdatedAt || "尚未同步"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">最近同步结果:</span>
                          <span className="font-medium text-neutral-800">{currentAccount.lastSyncResultMsg || "无记录"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">下次可刷新时间:</span>
                          <span className="font-bold text-neutral-900 font-mono">
                            {getCooldownSeconds(currentAccount.nextRefreshAvailableAt) > 0
                              ? `冷冻中 (还剩 ${formatCooldown(getCooldownSeconds(currentAccount.nextRefreshAvailableAt))})`
                              : "随时可同步"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRefreshSingleAccount(currentAccount)}
                        disabled={getCooldownSeconds(currentAccount.nextRefreshAvailableAt) > 0}
                        className={`w-full py-2.5 border rounded-xl text-[12px] font-bold transition-all shadow-2xs ${
                          getCooldownSeconds(currentAccount.nextRefreshAvailableAt) > 0
                            ? "bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed"
                            : "bg-white border-[#EAECF0] hover:bg-neutral-50 text-[#111827]"
                        }`}
                      >
                        刷新账号数据
                      </button>
                    </div>

                  </div>
                )}

                {/* TAB 4: 设置 */}
                {drawerTab === "settings" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 shadow-2xs space-y-4">
                      <h3 className="text-[14px] font-bold text-[#111827]">
                        {isExternalAccount(formAccountType) ? "维护外部监控参数与观察视角" : "维护账号人设与属性"}
                      </h3>
                      
                      <div className="space-y-3 text-[12px]">
                        
                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">账号类型</label>
                          <select
                            value={formAccountType}
                            onChange={(e) => setFormAccountType(e.target.value as any)}
                            className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50"
                          >
                            <option value="品牌官方号">品牌官方号</option>
                            <option value="自有矩阵号">自有矩阵号</option>
                            <option value="员工 KOS">员工 KOS</option>
                            <option value="外部合作号">外部合作号 (免填密码)</option>
                            <option value="竞品观察号">竞品观察号 (免填密码)</option>
                          </select>
                        </div>

                        {isExternalAccount(formAccountType) && (
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">小红书主页链接 / 账号 ID</label>
                            <input
                              type="text"
                              value={formXhsId}
                              onChange={(e) => setFormXhsId(e.target.value)}
                              placeholder="粘贴小红书主页链接 (https://...) 或小红书号"
                              className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50 font-mono"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">负责人</label>
                          <input
                            type="text"
                            value={formOwner}
                            onChange={(e) => setFormOwner(e.target.value)}
                            className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">
                            {isExternalAccount(formAccountType) ? "监控定位与说明" : "人设说明"}
                          </label>
                          <textarea
                            rows={3}
                            value={formPersona}
                            onChange={(e) => setFormPersona(e.target.value)}
                            className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">
                            {isExternalAccount(formAccountType) ? "观察侧重与边界" : "内容边界"}
                          </label>
                          <textarea
                            rows={3}
                            value={formBoundaries}
                            onChange={(e) => setFormBoundaries(e.target.value)}
                            className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50 resize-none"
                          />
                        </div>

                        {/* Password / Credentials (Only for internal accounts) */}
                        {!isExternalAccount(formAccountType) ? (
                          <div className="pt-2 border-t border-neutral-100 space-y-3">
                            <div>
                              <label className="block font-bold text-neutral-700 mb-1">登录手机号 / 账号</label>
                              <input
                                type="text"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block font-bold text-neutral-700">更新登录密码</label>
                                <span className={`text-[11px] font-bold ${currentAccount.credentialStatus === "saved" ? "text-neutral-800" : "text-neutral-400"}`}>
                                  {currentAccount.credentialStatus === "saved" ? "✓ 凭据已保存" : "未保存"}
                                </span>
                              </div>
                              <input
                                type="password"
                                value={formPassword}
                                onChange={(e) => setFormPassword(e.target.value)}
                                placeholder="输入新密码以安全重设..."
                                className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl outline-none focus:border-neutral-400 bg-neutral-50 font-mono"
                              />
                              <p className="text-[11px] text-neutral-400 mt-1">
                                密码输入后不可回显，保存后安全入库。
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] text-neutral-600">
                            外部合作号 / 竞品观察号仅公开数据采集，无需密码凭据。
                          </div>
                        )}

                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleSaveSettingsInDrawer(currentAccount.id)}
                          className="px-5 py-2 bg-[#111827] hover:bg-black text-white text-[13px] font-bold rounded-xl transition-colors shadow-2xs"
                        >
                          保存修改
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex items-center justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold text-neutral-900">
                          {isExternalAccount(currentAccount.accountType) ? "移除监控" : "停用此账号"}
                        </h4>
                        <p className="text-[12px] text-neutral-500 mt-0.5">
                          {isExternalAccount(currentAccount.accountType) 
                            ? "移除后该账号将暂停公开数据增量采集与方案匹配，可随时恢复监控。"
                            : "停用后该账号将不在自动化匹配中出现，可随时重新启用。"
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleDeactivate(currentAccount.id)}
                        className="px-4 py-2 text-[12px] font-bold rounded-xl transition-colors border bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200"
                      >
                        {currentAccount.isDeactivated 
                          ? "恢复监控" 
                          : (isExternalAccount(currentAccount.accountType) ? "移除监控" : "停用账号")
                        }
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Add & Re-login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-200/90 w-full max-w-lg overflow-hidden flex flex-col my-auto"
            >
              
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isExternalAccount(formAccountType) 
                      ? "bg-amber-500/10 text-amber-700 border border-amber-200/60" 
                      : "bg-[#111827] text-white"
                  }`}>
                    {isExternalAccount(formAccountType) ? <Globe size={20} /> : <UserPlus size={20} />}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] leading-snug">
                      {loginModalTarget 
                        ? `编辑账号 - ${loginModalTarget.nickname}` 
                        : isExternalAccount(formAccountType) 
                        ? "新增监控账号" 
                        : "新增账号资产"
                      }
                    </h3>
                    <p className="text-[12px] text-neutral-500 mt-0.5">
                      {isExternalAccount(formAccountType)
                        ? "添加达人或竞品小红书账号，开启自动化公开指标抓取"
                        : "录入品牌或矩阵账号凭据，建立授权与同步"
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[75vh] overflow-y-auto text-[13px]">
                
                {isVerifyingInModal ? (
                  /* Step Loading View */
                  <div className="py-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
                      <RefreshCw size={26} className="animate-spin text-white" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#111827]">正在进行会话检查与身份校验</h4>
                      <p className="text-[12px] text-[#667085] mt-1.5 font-medium">
                        步骤 {modalVerifyStep} / 3: {
                          modalVerifyStep === 1 ? "1. 启动独立浏览器会话..." :
                          modalVerifyStep === 2 ? "2. 校验账号身份信息..." :
                          "3. 匹配绑定的小红书号..."
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Form Fields with Generous Spacing */
                  <div className="space-y-5">
                    
                    {/* Account Type Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[13px] font-bold text-[#111827]">账号类型</label>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          isExternalAccount(formAccountType) 
                            ? "bg-amber-100/80 text-amber-900 border border-amber-200/60" 
                            : "bg-slate-100 text-slate-800 border border-slate-200/60"
                        }`}>
                          {isExternalAccount(formAccountType) ? "外部模式：免填密码" : "自有模式：凭据同步"}
                        </span>
                      </div>
                      <select
                        value={formAccountType}
                        onChange={(e) => setFormAccountType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 border border-neutral-200/90 rounded-xl outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 bg-white font-medium text-[13px] text-neutral-900 shadow-3xs cursor-pointer transition-all"
                      >
                        <option value="品牌官方号">品牌官方号 (自有)</option>
                        <option value="自有矩阵号">自有矩阵号 (自有)</option>
                        <option value="员工 KOS">员工 KOS (自有)</option>
                        <option value="外部合作号">外部合作号 (达人/KOC - 免密码)</option>
                        <option value="竞品观察号">竞品观察号 (对标品牌 - 免密码)</option>
                      </select>
                    </div>

                    {/* XHS ID / Link Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[13px] font-bold text-[#111827] flex items-center gap-1">
                          <span>{isExternalAccount(formAccountType) ? "小红书个人主页链接 / 小红书号" : "小红书账号或手机号"}</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <span className="text-[11px] text-neutral-400 font-normal">
                          {isExternalAccount(formAccountType) ? "推荐直接粘贴主页 URL" : "格式: 手机号 / 小红书号"}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formXhsId}
                        onChange={(e) => setFormXhsId(e.target.value)}
                        placeholder={isExternalAccount(formAccountType) ? "粘贴小红书个人主页链接 (https://...) 或输入小红书号" : "输入小红书号或绑定手机号..."}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-xl outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 text-[13px] text-neutral-900 placeholder:text-neutral-400 font-mono shadow-3xs transition-all"
                      />

                      {/* Distinct Callout Card for Hint Text */}
                      {isExternalAccount(formAccountType) ? (
                        <div className="mt-2.5 p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-[12px] text-amber-900 flex items-start gap-2.5 leading-relaxed shadow-3xs">
                          <Sparkles size={16} className="shrink-0 text-amber-600 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="font-bold text-amber-950 flex items-center gap-1">
                              <span>💡 主页链接智能解析</span>
                            </div>
                            <p className="text-[11.5px] text-amber-900/90">
                              直接复制达人或竞品的小红书 App 主页分享链接（含 <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[10.5px]">xiaohongshu.com</code>），系统将自动抓取该公开主页并纳入监控。
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2.5 p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[12px] text-neutral-600 flex items-start gap-2.5 leading-relaxed">
                          <Info size={15} className="shrink-0 text-neutral-500 mt-0.5" />
                          <p className="text-[11.5px] text-neutral-600">
                            请输入绑定的手机号或小红书号，用于启动独立浏览器会话并进行授权同步。
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Password Field (Only for internal accounts) */}
                    {!isExternalAccount(formAccountType) ? (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[13px] font-bold text-[#111827] flex items-center gap-1">
                            <span>密码</span>
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                        </div>
                        <input
                          type="password"
                          value={formPassword}
                          onChange={(e) => setFormPassword(e.target.value)}
                          placeholder="输入登录密码..."
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-xl outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 text-[13px] text-neutral-900 placeholder:text-neutral-400 font-mono shadow-3xs transition-all"
                        />
                        <div className="mt-2.5 p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[12px] text-neutral-600 flex items-start gap-2.5 leading-relaxed">
                          <ShieldCheck size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                          <p className="text-[11.5px] text-neutral-600">
                            凭据使用安全高强度算法加密，仅在受控独立浏览器会话中用于保活与深度分析。
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-neutral-50/80 border border-neutral-200/80 rounded-xl text-[12px] text-neutral-700 flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                        <div>
                          <span className="font-semibold text-neutral-900">免填密码公开监控模式：</span>
                          <span className="text-[11.5px] text-neutral-600">
                            外部合作号与竞品观察号仅基于公开主页数据进行指标检索，无需提供密码凭据。
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Owner Field */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#111827] mb-1.5">负责人 / 归属部门</label>
                      <input
                        type="text"
                        value={formOwner}
                        onChange={(e) => setFormOwner(e.target.value)}
                        placeholder="例如: 张伟 (竞品观察组) 或 媒介部"
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-xl outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 text-[13px] text-neutral-900 placeholder:text-neutral-400 shadow-3xs transition-all"
                      />
                    </div>

                    {/* Persona Field */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#111827] mb-1.5">
                        {isExternalAccount(formAccountType) ? "监控定位与观察侧重" : "人设说明与内容边界"}
                      </label>
                      <textarea
                        rows={3}
                        value={formPersona}
                        onChange={(e) => setFormPersona(e.target.value)}
                        placeholder={
                          isExternalAccount(formAccountType) 
                            ? "例如: 头部宠物 KOC，重点观察其商业笔记曝光与转化趋势..." 
                            : "例如: 品牌官方客服人设，解答养宠干货疑问，不参与非官方促销..."
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-xl outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 text-[13px] text-neutral-900 placeholder:text-neutral-400 shadow-3xs resize-none transition-all"
                      />
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-end gap-3 bg-neutral-50/50 shrink-0">
                <button
                  onClick={() => setShowLoginModal(false)}
                  disabled={isVerifyingInModal}
                  className="px-4 py-2.5 border border-neutral-200/80 text-neutral-700 hover:bg-white hover:border-neutral-300 rounded-xl text-[13px] font-bold transition-all shadow-3xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleStartLoginAndVerify}
                  disabled={isVerifyingInModal}
                  className="px-5 py-2.5 bg-[#111827] hover:bg-black text-white rounded-xl text-[13px] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <ShieldCheck size={16} />
                  <span>{isExternalAccount(formAccountType) ? "确认并保存监控" : "登录并验证"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Utility export for Scheme Engine consumption
export function exportAccountFactsForSchemeEngine(accountsList: AccountAssetItem[]): AccountFactExport[] {
  return accountsList.map(a => ({
    account_id: a.id,
    account_type: a.accountType,
    persona: a.persona,
    content_boundaries: a.contentBoundaries,
    owner: a.owner,
    verified_identity: a.verifiedIdentityName ? {
      nickname: a.verifiedIdentityName,
      xhs_id: a.verifiedIdentityXhsId || a.xhsId
    } : null,
    auth_state: a.authState,
    latest_snapshot: a.snapshot ? {
      followers_count: a.snapshot.followersCount,
      notes_count: a.snapshot.notesCount,
      total_likes_collects: a.snapshot.totalInteractions
    } : null,
    content_topics: a.contentTopics,
    historical_performance: a.recentNotes.length > 0 ? {
      top_notes_sample: a.recentNotes.map(n => ({
        note_id: n.id,
        title: n.title,
        likes: n.likes,
        collects: n.collects,
        comments: n.comments,
        pub_date: n.pubDate
      })),
      avg_likes: Math.round(a.recentNotes.reduce((acc, curr) => acc + curr.likes, 0) / a.recentNotes.length)
    } : null,
    sample_size: a.recentNotes.length,
    data_window: "90天数据窗口",
    data_updated_at: a.lastDataUpdatedAt
  }));
}
