import React, { useState, useEffect } from "react";
import { 
  Users, Plus, RefreshCw, Search, CheckCircle2, 
  AlertTriangle, XCircle, Clock, ShieldCheck, Eye, 
  BarChart2, FileText, Sparkles, X, 
  Info, ExternalLink, ShieldAlert, Globe, 
  QrCode, Smartphone, ArrowRight, Check, AlertCircle,
  FolderKanban, Layers, Filter, Trash2, StopCircle, PlayCircle,
  Lock, KeyRound, MonitorCheck, HelpCircle, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// Types & Interfaces
// ==========================================

export type AccessMethod = "authorized" | "public_monitored";

export type BusinessRole = 
  | "品牌官方号"
  | "自有矩阵号"
  | "员工KOS"
  | "合作达人"
  | "素人KOC"
  | "竞品观察";

export type AccessStatus = 
  | "已授权"
  | "等待扫码"
  | "授权即将过期"
  | "授权已失效"
  | "授权异常"
  | "公开监控";

export type DataState =
  | "已更新"
  | "同步中"
  | "数据已过期"
  | "同步失败"
  | "未同步";

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

export interface SyncLogEntry {
  id: string;
  time: string;
  type: "scheduled" | "manual";
  status: "success" | "warning" | "failed";
  message: string;
  notesFetched: number;
}

export interface AccountAssetItem {
  id: string;
  avatar: string;
  nickname: string;
  xhsId: string;
  verifyTag?: string; // e.g. "企业蓝V认证", "知名博主", "品牌认证KOS"
  accessMethod: AccessMethod;
  businessRole: BusinessRole;
  accessStatus: AccessStatus;
  dataState: DataState;
  owner: string; // e.g. "李美玲 (品牌组)"
  persona: string; // 人设摘要
  contentBoundaries: string; // 内容边界
  projectScope: string[]; // 所属项目
  dataSyncScope: string[]; // 数据同步范围
  capabilities: string[]; // 可用权限清单
  authExpiresAt: string | null; // 授权到期时间
  lastVerifiedAt: string | null; // 最近会话验证时间
  lastDataUpdatedAt: string | null; // 最近数据同步时间
  lastSyncResultMsg?: string;
  profileUrl?: string; // 小红书公开主页链接
  creatorUrl?: string; // 小红书创作者服务平台链接
  nextRefreshAvailableAt: number; // 冷却时间戳 (ms)
  snapshot: {
    followersCount: number;
    followersDelta7d: number;
    notesCount: number;
    postFrequency: string;
    totalInteractions: number;
  } | null;
  recentNotes: RecentNote[];
  contentTopics: string[];
  syncLogs: SyncLogEntry[];
  isStoppedMonitoring?: boolean;
  isAuthRevoked?: boolean;
}

// ==========================================
// Initial Mock Data
// ==========================================

const INITIAL_ACCOUNTS: AccountAssetItem[] = [
  {
    id: "acc_brand_main",
    avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=160&auto=format&fit=crop&q=80",
    nickname: "毛孩子研究所 (官方)",
    xhsId: "pet_lab_official",
    verifyTag: "企业蓝V认证",
    accessMethod: "authorized",
    businessRole: "品牌官方号",
    accessStatus: "已授权",
    dataState: "已更新",
    owner: "李美玲 (品牌营销组)",
    persona: "专业、严谨且有温度的宠粮营养科研专家人设，主打高品质生骨肉冻干与成分科普。",
    contentBoundaries: "严禁攻击同行竞品，严禁夸大医疗效果，严格遵守新广告法和宠物饲料标签国家标准。",
    projectScope: ["宠粮新客运营", "全域品牌心智"],
    dataSyncScope: ["笔记数据与指标", "粉丝画像与增量", "互动与评论数据", "搜索关键词表现"],
    capabilities: ["图文视频直接发布", "全量笔记数据同步", "私信与评论管理", "商业合作报备"],
    authExpiresAt: "2026-11-20 23:59",
    lastVerifiedAt: "2026-08-20 18:30",
    lastDataUpdatedAt: "2026-08-20 18:30",
    lastSyncResultMsg: "成功同步最新 24 篇笔记及全量互动指标",
    creatorUrl: "https://creator.xiaohongshu.com",
    profileUrl: "https://www.xiaohongshu.com/user/profile/pet_lab_official",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 128500,
      followersDelta7d: 2140,
      notesCount: 168,
      postFrequency: "周均 4 篇",
      totalInteractions: 384000,
    },
    recentNotes: [
      {
        id: "note_b1",
        title: "实测！幼犬换粮期究竟该选鲜肉还是冻干？3大营养指标全拆解",
        pubDate: "2026-08-18",
        likes: 2450,
        collects: 1820,
        comments: 310,
        topicTag: "幼犬换粮科普",
        isTopPerformance: true,
      },
      {
        id: "note_b2",
        title: "猫咪软便救星！益生菌冻干粮喂养21天真实排便记录",
        pubDate: "2026-08-14",
        likes: 1890,
        collects: 1420,
        comments: 188,
        topicTag: "肠胃敏感护理",
      },
      {
        id: "note_b3",
        title: "原料透明度公示：2026年Q3批次生骨肉检验证书全览",
        pubDate: "2026-08-09",
        likes: 1210,
        collects: 890,
        comments: 95,
        topicTag: "品质溯源",
      }
    ],
    contentTopics: ["幼犬换粮科普", "肠胃敏感护理", "生骨肉冻干成分", "科学喂养指南"],
    syncLogs: [
      { id: "log_1", time: "2026-08-20 18:30", type: "manual", status: "success", message: "手动刷新成功，拉取到 24 篇公开笔记", notesFetched: 24 },
      { id: "log_2", time: "2026-08-20 12:00", type: "scheduled", status: "success", message: "定时巡检完成，数据无异常", notesFetched: 24 },
      { id: "log_3", time: "2026-08-19 18:00", type: "scheduled", status: "success", message: "定时巡检完成，新增1篇已发布笔记", notesFetched: 1 }
    ]
  },
  {
    id: "acc_matrix_01",
    avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=160&auto=format&fit=crop&q=80",
    nickname: "阿柴的干饭日记",
    xhsId: "shiba_foodie_diary",
    verifyTag: "自有矩阵认证",
    accessMethod: "authorized",
    businessRole: "自有矩阵号",
    accessStatus: "授权即将过期",
    dataState: "已更新",
    owner: "张强 (内容矩阵一组)",
    persona: "活泼接地气的新手铲屎官视角，记录挑食柴犬被治愈的日常测评体验。",
    contentBoundaries: "以萌宠互动为主，软性植入品牌宠粮，不可直白硬广，保持真实评测感。",
    projectScope: ["宠粮新客运营"],
    dataSyncScope: ["笔记数据与指标", "互动与评论数据"],
    capabilities: ["图文视频直接发布", "全量笔记数据同步", "评论互动管理"],
    authExpiresAt: "2026-08-23 14:00", // 3 days left -> 即将过期
    lastVerifiedAt: "2026-08-20 14:00",
    lastDataUpdatedAt: "2026-08-20 14:00",
    lastSyncResultMsg: "成功同步最新 18 篇笔记",
    creatorUrl: "https://creator.xiaohongshu.com",
    profileUrl: "https://www.xiaohongshu.com/user/profile/shiba_foodie_diary",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 45200,
      followersDelta7d: 890,
      notesCount: 84,
      postFrequency: "周均 3 篇",
      totalInteractions: 96000,
    },
    recentNotes: [
      {
        id: "note_m1",
        title: "我家挑食柴闻到这碗冻干直接把头埋进去了...！无广纯记录",
        pubDate: "2026-08-17",
        likes: 3120,
        collects: 2100,
        comments: 420,
        topicTag: "挑食狗狗实测",
        isTopPerformance: true,
      },
      {
        id: "note_m2",
        title: "从换粮吐到长肉3斤，新手柴犬爸妈抄作业！",
        pubDate: "2026-08-11",
        likes: 1650,
        collects: 980,
        comments: 130,
        topicTag: "幼犬长肉指南",
      }
    ],
    contentTopics: ["挑食狗狗实测", "幼犬长肉指南", "柴犬居家日常"],
    syncLogs: [
      { id: "log_21", time: "2026-08-20 14:00", type: "scheduled", status: "success", message: "数据同步完成，会话将在3日内过期", notesFetched: 18 },
      { id: "log_22", time: "2026-08-19 14:00", type: "scheduled", status: "success", message: "日常巡检完成", notesFetched: 18 }
    ]
  },
  {
    id: "acc_kos_01",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    nickname: "小雅的宠物营养手记",
    xhsId: "vet_xiaoya_nutri",
    verifyTag: "员工KOS认证",
    accessMethod: "authorized",
    businessRole: "员工KOS",
    accessStatus: "已授权",
    dataState: "已更新",
    owner: "陈小雅 (门店营养咨询部)",
    persona: "持证执业宠物营养师，擅长解答复杂体质猫狗配餐问题，专业且亲和力强。",
    contentBoundaries: "仅输出专业营养建议和配方解析，禁止提供远程医疗诊断保证。",
    projectScope: ["宠粮新客运营", "全域品牌心智"],
    dataSyncScope: ["笔记数据与指标", "互动与评论数据", "粉丝画像与增量"],
    capabilities: ["图文视频直接发布", "全量笔记数据同步", "私信与评论管理"],
    authExpiresAt: "2026-10-15 00:00",
    lastVerifiedAt: "2026-08-20 16:45",
    lastDataUpdatedAt: "2026-08-20 16:45",
    lastSyncResultMsg: "成功同步最新 12 篇笔记",
    creatorUrl: "https://creator.xiaohongshu.com",
    profileUrl: "https://www.xiaohongshu.com/user/profile/vet_xiaoya_nutri",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 28600,
      followersDelta7d: 410,
      notesCount: 52,
      postFrequency: "周均 2 篇",
      totalInteractions: 48500,
    },
    recentNotes: [
      {
        id: "note_k1",
        title: "宠物营养师教你看懂冻干配料表：前5位决定了一半的消化率",
        pubDate: "2026-08-15",
        likes: 1980,
        collects: 1650,
        comments: 215,
        topicTag: "营养配方拆解",
        isTopPerformance: true,
      }
    ],
    contentTopics: ["营养配方拆解", "肠胃敏感猫狗", "生骨肉配比科普"],
    syncLogs: [
      { id: "log_31", time: "2026-08-20 16:45", type: "scheduled", status: "success", message: "日常巡检完成", notesFetched: 12 }
    ]
  },
  {
    id: "acc_koc_partner",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80",
    nickname: "金毛奥斯卡的一家",
    xhsId: "oscar_golden_family",
    verifyTag: "外部知名博主",
    accessMethod: "public_monitored",
    businessRole: "合作达人",
    accessStatus: "公开监控",
    dataState: "已更新",
    owner: "周婷 (达人媒介商务组)",
    persona: "头部养宠家庭博主，粉丝粘性高，侧重大体型犬只高肉饮食分享。",
    contentBoundaries: "外部监控对象，不具备直接发布权限；跟踪其自然流推荐效果与评论区口碑反馈。",
    projectScope: ["宠粮新客运营"],
    dataSyncScope: ["笔记数据与指标", "互动与评论数据", "搜索关键词表现"],
    capabilities: ["公开主页指标采集", "笔记互动量监控", "品牌词提及监测"],
    authExpiresAt: null, // 公开监控无会话到期
    lastVerifiedAt: "2026-08-20 10:00",
    lastDataUpdatedAt: "2026-08-20 10:00",
    lastSyncResultMsg: "成功抓取公开主页最近 30 篇笔记",
    profileUrl: "https://www.xiaohongshu.com/user/profile/oscar_golden_family",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 236000,
      followersDelta7d: 3200,
      notesCount: 310,
      postFrequency: "周均 5 篇",
      totalInteractions: 820000,
    },
    recentNotes: [
      {
        id: "note_o1",
        title: "带90斤大金毛去露营！带这袋冻干不用扛冰箱了，省心度拉满",
        pubDate: "2026-08-16",
        likes: 5400,
        collects: 3100,
        comments: 620,
        topicTag: "露营宠物粮推荐",
        isTopPerformance: true,
      }
    ],
    contentTopics: ["露营宠物粮推荐", "大型犬喂养日常", "多宠家庭生活"],
    syncLogs: [
      { id: "log_41", time: "2026-08-20 10:00", type: "scheduled", status: "success", message: "公开主页增量抓取成功", notesFetched: 30 }
    ]
  },
  {
    id: "acc_comp_01",
    avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=160&auto=format&fit=crop&q=80",
    nickname: "肉球严选 (竞品观察)",
    xhsId: "raw_pet_comp_tracker",
    verifyTag: "竞品官方",
    accessMethod: "public_monitored",
    businessRole: "竞品观察",
    accessStatus: "公开监控",
    dataState: "数据已过期",
    owner: "李美玲 (品牌营销组)",
    persona: "主要竞品品牌官方号，监控其主推爆款方向、投流节奏及促销活动话术。",
    contentBoundaries: "外部监控对象，仅用于竞对洞察与流量趋势比对，绝不接触其登录凭据。",
    projectScope: ["宠粮新客运营", "全域品牌心智"],
    dataSyncScope: ["笔记数据与指标", "搜索关键词表现"],
    capabilities: ["公开主页指标采集", "高赞笔记趋势分析"],
    authExpiresAt: null,
    lastVerifiedAt: "2026-08-18 09:00",
    lastDataUpdatedAt: "2026-08-18 09:00",
    lastSyncResultMsg: "距上次抓取超过48小时，建议点击立即同步更新最新爆文",
    profileUrl: "https://www.xiaohongshu.com/user/profile/raw_pet_comp_tracker",
    nextRefreshAvailableAt: 0,
    snapshot: {
      followersCount: 89400,
      followersDelta7d: 650,
      notesCount: 142,
      postFrequency: "周均 3 篇",
      totalInteractions: 210000,
    },
    recentNotes: [
      {
        id: "note_c1",
        title: "生骨肉狂欢节预热：买三赠一整箱装限时开启",
        pubDate: "2026-08-17",
        likes: 850,
        collects: 320,
        comments: 98,
        topicTag: "促销活动",
      }
    ],
    contentTopics: ["生肉配方", "促销活动", "用户晒单"],
    syncLogs: [
      { id: "log_51", time: "2026-08-18 09:00", type: "scheduled", status: "success", message: "公开数据同步完成", notesFetched: 15 }
    ]
  }
];

export const AccountAssets: React.FC = () => {
  // Account List State
  const [accounts, setAccounts] = useState<AccountAssetItem[]>(INITIAL_ACCOUNTS);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccessMethod, setFilterAccessMethod] = useState<string>("all");
  const [filterBusinessRole, setFilterBusinessRole] = useState<string>("all");
  const [filterAccessStatus, setFilterAccessStatus] = useState<string>("all");
  const [filterDataState, setFilterDataState] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");

  // Selection & Drawer State
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "performance" | "auth_sync" | "settings">("overview");

  // Add Account Wizard Modal States
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [wizardTrack, setWizardTrack] = useState<"login_auth" | "public_monitor">("login_auth");
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1); // 1: 技术接入, 2: 确认身份, 3: 业务属性配置

  // Track 1 (Login Auth) simulation state
  const [qrScanStatus, setQrScanStatus] = useState<"waiting" | "scanned" | "success" | "expired" | "error">("waiting");
  const [qrTimer, setQrTimer] = useState<number>(60);
  const [detectedAuthAccount, setDetectedAuthAccount] = useState<{
    avatar: string;
    nickname: string;
    xhsId: string;
    verifyTag: string;
    detectedRoles: string[];
    creatorUrl: string;
  } | null>(null);

  // Track 2 (Public Monitor) simulation state
  const [publicInputUrlOrId, setPublicInputUrlOrId] = useState("");
  const [isIdentifyingPublic, setIsIdentifyingPublic] = useState(false);
  const [publicIdentifyError, setPublicIdentifyError] = useState<string | null>(null);
  const [detectedPublicAccount, setDetectedPublicAccount] = useState<{
    avatar: string;
    nickname: string;
    xhsId: string;
    profileUrl: string;
    verifyTag: string;
    bio: string;
    followersCount: number;
    notesCount: number;
  } | null>(null);

  // Business Attribute Form State (Step 3)
  const [formBusinessRole, setFormBusinessRole] = useState<BusinessRole>("品牌官方号");
  const [formOwner, setFormOwner] = useState("李美玲 (品牌营销组)");
  const [formPersona, setFormPersona] = useState("");
  const [formBoundaries, setFormBoundaries] = useState("");
  const [formProjects, setFormProjects] = useState<string[]>(["宠粮新客运营"]);
  const [formDataSyncScopes, setFormDataSyncScopes] = useState<string[]>([
    "笔记数据与指标", "粉丝画像与增量", "互动与评论数据"
  ]);

  // Drawer Form Edit State
  const [editRole, setEditRole] = useState<BusinessRole>("品牌官方号");
  const [editOwner, setEditOwner] = useState("");
  const [editPersona, setEditPersona] = useState("");
  const [editBoundaries, setEditBoundaries] = useState("");
  const [editProjects, setEditProjects] = useState<string[]>([]);
  const [editScopes, setEditScopes] = useState<string[]>([]);

  // Duplicate Warning State
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Active Toast Feedback
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "info" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Timer simulation for QR code
  useEffect(() => {
    let interval: any = null;
    if (showAddWizard && wizardTrack === "login_auth" && wizardStep === 1 && qrScanStatus === "waiting") {
      interval = setInterval(() => {
        setQrTimer((prev) => {
          if (prev <= 1) {
            setQrScanStatus("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showAddWizard, wizardTrack, wizardStep, qrScanStatus]);

  // Handler to open Add Modal
  const handleOpenAddModal = (track: "login_auth" | "public_monitor" = "login_auth") => {
    setWizardTrack(track);
    setWizardStep(1);
    setQrScanStatus("waiting");
    setQrTimer(60);
    setDetectedAuthAccount(null);
    setPublicInputUrlOrId("");
    setIsIdentifyingPublic(false);
    setPublicIdentifyError(null);
    setDetectedPublicAccount(null);
    setDuplicateWarning(null);

    // Set defaults for form
    if (track === "login_auth") {
      setFormBusinessRole("品牌官方号");
      setFormPersona("专业有温度的宠粮营养科研专家，主打高品质生骨肉与成分科普。");
      setFormBoundaries("严禁攻击同行竞品，严禁夸大医疗效果，严格遵守新广告法。");
      setFormDataSyncScopes(["笔记数据与指标", "粉丝画像与增量", "互动与评论数据", "搜索关键词表现"]);
    } else {
      setFormBusinessRole("合作达人");
      setFormPersona("头部养宠家庭博主，侧重大体型犬只高肉饮食与户外生活分享。");
      setFormBoundaries("外部监控对象，不具备直接发布权限；跟踪其自然流推荐效果与舆情反馈。");
      setFormDataSyncScopes(["笔记数据与指标", "互动与评论数据", "搜索关键词表现"]);
    }
    setFormOwner("李美玲 (品牌营销组)");
    setFormProjects(["宠粮新客运营"]);
    setShowAddWizard(true);
  };

  // Simulate scanning QR code on creator platform
  const handleSimulateScan = () => {
    setQrScanStatus("scanned");
    setTimeout(() => {
      setQrScanStatus("success");
      // Simulated extracted creator profile
      const detected = {
        avatar: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=160&auto=format&fit=crop&q=80",
        nickname: "小红书创作官方授权测试号",
        xhsId: "pet_creator_matrix_03",
        verifyTag: "创作者服务平台已认证",
        detectedRoles: ["图文视频直接发布", "全量笔记数据同步", "私信与评论管理", "商业合作报备"],
        creatorUrl: "https://creator.xiaohongshu.com"
      };
      setDetectedAuthAccount(detected);
      
      // Check duplicate
      const exists = accounts.find(a => a.xhsId.toLowerCase() === detected.xhsId.toLowerCase());
      if (exists) {
        setDuplicateWarning(`检测到小红书号 [${detected.xhsId}] 已存在于列表中（${exists.nickname}），继续保存将更新其授权凭证。`);
      } else {
        setDuplicateWarning(null);
      }

      setWizardStep(2);
    }, 1200);
  };

  // Simulate refreshing expired QR code
  const handleRefreshQrCode = () => {
    setQrScanStatus("waiting");
    setQrTimer(60);
    setDuplicateWarning(null);
  };

  // Simulate identifying public profile
  const handleIdentifyPublicProfile = () => {
    if (!publicInputUrlOrId.trim()) {
      setPublicIdentifyError("请输入小红书主页链接或小红书号");
      return;
    }
    setPublicIdentifyError(null);
    setIsIdentifyingPublic(true);

    setTimeout(() => {
      setIsIdentifyingPublic(false);
      const cleanId = publicInputUrlOrId.replace(/https?:\/\/.*?profile\//, "").replace(/\?.*/, "").trim() || "koc_pet_expert";
      const detected = {
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
        nickname: cleanId.includes("oscar") ? "金毛奥斯卡的一家" : "萌宠营养研究所 (公开号)",
        xhsId: cleanId,
        profileUrl: publicInputUrlOrId.startsWith("http") ? publicInputUrlOrId : `https://www.xiaohongshu.com/user/profile/${cleanId}`,
        verifyTag: "公开博主",
        bio: "专注大型犬生骨肉冻干实测 | 5只毛孩子的全职铲屎官 | 真实记录不恰烂饭",
        followersCount: 86500,
        notesCount: 192,
      };
      setDetectedPublicAccount(detected);

      // Check duplicate
      const exists = accounts.find(a => a.xhsId.toLowerCase() === detected.xhsId.toLowerCase());
      if (exists) {
        setDuplicateWarning(`检测到该小红书号 [${detected.xhsId}] 已在监控列表中（${exists.nickname}）。`);
      } else {
        setDuplicateWarning(null);
      }

      setWizardStep(2);
    }, 800);
  };

  // Save new account into state (Step 3 completion)
  const handleCompleteAddAccount = () => {
    if (wizardTrack === "login_auth" && detectedAuthAccount) {
      const newAcc: AccountAssetItem = {
        id: `acc_${Date.now()}`,
        avatar: detectedAuthAccount.avatar,
        nickname: detectedAuthAccount.nickname,
        xhsId: detectedAuthAccount.xhsId,
        verifyTag: detectedAuthAccount.verifyTag,
        accessMethod: "authorized",
        businessRole: formBusinessRole,
        accessStatus: "已授权",
        dataState: "已更新",
        owner: formOwner,
        persona: formPersona,
        contentBoundaries: formBoundaries,
        projectScope: formProjects,
        dataSyncScope: formDataSyncScopes,
        capabilities: detectedAuthAccount.detectedRoles,
        authExpiresAt: "2026-11-20 23:59",
        lastVerifiedAt: "刚刚",
        lastDataUpdatedAt: "刚刚",
        lastSyncResultMsg: "接入成功，已初始化拉取公开笔记与会话状态",
        creatorUrl: detectedAuthAccount.creatorUrl,
        profileUrl: `https://www.xiaohongshu.com/user/profile/${detectedAuthAccount.xhsId}`,
        nextRefreshAvailableAt: 0,
        snapshot: {
          followersCount: 15600,
          followersDelta7d: 320,
          notesCount: 38,
          postFrequency: "周均 3 篇",
          totalInteractions: 42000,
        },
        recentNotes: [
          {
            id: `note_${Date.now()}_1`,
            title: "新手铲屎官必看：生骨肉冻干初次喂养避坑指南",
            pubDate: "2026-08-19",
            likes: 1250,
            collects: 890,
            comments: 112,
            topicTag: "生骨肉冻干",
            isTopPerformance: true,
          }
        ],
        contentTopics: ["生骨肉冻干", "科学喂养", "幼犬换粮"],
        syncLogs: [
          { id: `log_${Date.now()}`, time: "刚刚", type: "manual", status: "success", message: "扫码授权接入成功，初始化会话与数据完成", notesFetched: 1 }
        ]
      };

      setAccounts(prev => [newAcc, ...prev.filter(a => a.xhsId !== newAcc.xhsId)]);
      setShowAddWizard(false);
      showToast(`成功接入授权账号 [${newAcc.nickname}]，已建立创作者平台会话`);
      setSelectedAccountId(newAcc.id);
    } else if (wizardTrack === "public_monitor" && detectedPublicAccount) {
      const newAcc: AccountAssetItem = {
        id: `acc_${Date.now()}`,
        avatar: detectedPublicAccount.avatar,
        nickname: detectedPublicAccount.nickname,
        xhsId: detectedPublicAccount.xhsId,
        verifyTag: detectedPublicAccount.verifyTag,
        accessMethod: "public_monitored",
        businessRole: formBusinessRole,
        accessStatus: "公开监控",
        dataState: "已更新",
        owner: formOwner,
        persona: formPersona || detectedPublicAccount.bio,
        contentBoundaries: formBoundaries,
        projectScope: formProjects,
        dataSyncScope: formDataSyncScopes,
        capabilities: ["公开主页指标采集", "笔记互动量监控", "品牌词提及监测"],
        authExpiresAt: null,
        lastVerifiedAt: "刚刚",
        lastDataUpdatedAt: "刚刚",
        lastSyncResultMsg: "成功识别并建立公开主页监控流",
        profileUrl: detectedPublicAccount.profileUrl,
        nextRefreshAvailableAt: 0,
        snapshot: {
          followersCount: detectedPublicAccount.followersCount,
          followersDelta7d: 450,
          notesCount: detectedPublicAccount.notesCount,
          postFrequency: "周均 4 篇",
          totalInteractions: 138000,
        },
        recentNotes: [
          {
            id: `note_${Date.now()}_pub`,
            title: "大犬生肉饮食记录：毛发光泽度提升明显",
            pubDate: "2026-08-18",
            likes: 2100,
            collects: 1400,
            comments: 260,
            topicTag: "大犬喂养",
            isTopPerformance: true,
          }
        ],
        contentTopics: ["大犬喂养", "冻干测评", "家庭日常"],
        syncLogs: [
          { id: `log_${Date.now()}`, time: "刚刚", type: "manual", status: "success", message: "公开主页抓取成功，已建立监控关系", notesFetched: 1 }
        ]
      };

      setAccounts(prev => [newAcc, ...prev.filter(a => a.xhsId !== newAcc.xhsId)]);
      setShowAddWizard(false);
      showToast(`成功添加公开监控账号 [${newAcc.nickname}]`);
      setSelectedAccountId(newAcc.id);
    }
  };

  // Immediate Sync Action
  const handleTriggerSync = (account: AccountAssetItem) => {
    setAccounts(prev => prev.map(a => {
      if (a.id === account.id) {
        return {
          ...a,
          dataState: "同步中"
        };
      }
      return a;
    }));

    showToast(`正在对 [${account.nickname}] 执行数据同步...`, "info");

    setTimeout(() => {
      const nowStr = new Date().toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).replace(/\//g, "-");

      setAccounts(prev => prev.map(a => {
        if (a.id === account.id) {
          const newLogs = [
            {
              id: `log_${Date.now()}`,
              time: nowStr,
              type: "manual" as const,
              status: "success" as const,
              message: `手动同步成功，已拉取最新指标数据`,
              notesFetched: a.snapshot ? a.snapshot.notesCount : 10
            },
            ...a.syncLogs
          ];
          return {
            ...a,
            dataState: "已更新",
            lastDataUpdatedAt: nowStr,
            lastSyncResultMsg: `同步成功：获取到最新笔记数据及互动指标`,
            syncLogs: newLogs.slice(0, 8)
          };
        }
        return a;
      }));

      showToast(`[${account.nickname}] 数据同步完成`, "success");
    }, 1000);
  };

  // Re-auth / Re-scan action
  const handleReScanAuth = (account: AccountAssetItem) => {
    handleOpenAddModal("login_auth");
  };

  // Revoke auth or Stop monitoring
  const handleToggleDeactivate = (accountId: string) => {
    setAccounts(prev => prev.map(a => {
      if (a.id === accountId) {
        if (a.accessMethod === "authorized") {
          const isRevoked = !a.isAuthRevoked;
          return {
            ...a,
            isAuthRevoked: isRevoked,
            accessStatus: isRevoked ? "授权已失效" : "已授权",
            lastSyncResultMsg: isRevoked ? "授权已主动解除，停止自动化发布与同步" : "已重新激活授权会话"
          };
        } else {
          const isStopped = !a.isStoppedMonitoring;
          return {
            ...a,
            isStoppedMonitoring: isStopped,
            lastSyncResultMsg: isStopped ? "已暂停公开数据增量抓取" : "已恢复公开监控"
          };
        }
      }
      return a;
    }));

    const target = accounts.find(a => a.id === accountId);
    if (target) {
      if (target.accessMethod === "authorized") {
        showToast(target.isAuthRevoked ? `已恢复 [${target.nickname}] 授权` : `已解除 [${target.nickname}] 授权`, "info");
      } else {
        showToast(target.isStoppedMonitoring ? `已恢复 [${target.nickname}] 监控` : `已暂停 [${target.nickname}] 监控`, "info");
      }
    }
  };

  // Current selected account
  const currentAccount = accounts.find(a => a.id === selectedAccountId);

  // Sync edit form when drawer opens or tab changes
  useEffect(() => {
    if (currentAccount) {
      setEditRole(currentAccount.businessRole);
      setEditOwner(currentAccount.owner);
      setEditPersona(currentAccount.persona);
      setEditBoundaries(currentAccount.contentBoundaries);
      setEditProjects(currentAccount.projectScope || []);
      setEditScopes(currentAccount.dataSyncScope || []);
    }
  }, [currentAccount, drawerTab]);

  // Save drawer edited settings
  const handleSaveDrawerSettings = () => {
    if (!currentAccount) return;
    setAccounts(prev => prev.map(a => {
      if (a.id === currentAccount.id) {
        return {
          ...a,
          businessRole: editRole,
          owner: editOwner,
          persona: editPersona,
          contentBoundaries: editBoundaries,
          projectScope: editProjects,
          dataSyncScope: editScopes,
        };
      }
      return a;
    }));
    showToast("业务属性与人设设置已保存", "success");
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNick = acc.nickname.toLowerCase().includes(q);
      const matchXhs = acc.xhsId.toLowerCase().includes(q);
      const matchOwner = acc.owner.toLowerCase().includes(q);
      if (!matchNick && !matchXhs && !matchOwner) return false;
    }
    if (filterAccessMethod !== "all" && acc.accessMethod !== filterAccessMethod) return false;
    if (filterBusinessRole !== "all" && acc.businessRole !== filterBusinessRole) return false;
    if (filterAccessStatus !== "all" && acc.accessStatus !== filterAccessStatus) return false;
    if (filterDataState !== "all" && acc.dataState !== filterDataState) return false;
    if (filterProject !== "all" && !acc.projectScope.includes(filterProject)) return false;
    return true;
  });

  // Render Badges Helpers
  const renderAccessBadge = (acc: AccountAssetItem) => {
    if (acc.isAuthRevoked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
          <XCircle size={11} /> 授权已解除
        </span>
      );
    }
    if (acc.isStoppedMonitoring) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
          <StopCircle size={11} /> 监控已暂停
        </span>
      );
    }
    switch (acc.accessStatus) {
      case "已授权":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 size={11} /> 已授权
          </span>
        );
      case "等待扫码":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock size={11} /> 等待扫码
          </span>
        );
      case "授权即将过期":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle size={11} /> 即将过期 (3日内)
          </span>
        );
      case "授权已失效":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircle size={11} /> 授权已失效
          </span>
        );
      case "授权异常":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
            <ShieldAlert size={11} /> 需人工验证
          </span>
        );
      case "公开监控":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/80">
            <Globe size={11} /> 公开监控
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            {acc.accessStatus}
          </span>
        );
    }
  };

  const renderDataStateBadge = (state: DataState) => {
    switch (state) {
      case "已更新":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 已更新
          </span>
        );
      case "同步中":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/80">
            <RefreshCw size={11} className="animate-spin text-sky-600" /> 同步中
          </span>
        );
      case "数据已过期":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 数据需更新
          </span>
        );
      case "同步失败":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 同步失败
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            未同步
          </span>
        );
    }
  };

  const renderRoleBadge = (role: BusinessRole) => {
    let colorClass = "bg-neutral-100 text-neutral-700 border-neutral-200";
    if (role === "品牌官方号") colorClass = "bg-brand-50 text-brand-700 border-brand-100";
    else if (role === "自有矩阵号") colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200/60";
    else if (role === "员工KOS") colorClass = "bg-teal-50 text-teal-700 border-teal-200/60";
    else if (role === "合作达人") colorClass = "bg-amber-50 text-amber-700 border-amber-200/60";
    else if (role === "素人KOC") colorClass = "bg-purple-50 text-purple-700 border-purple-200/60";
    else if (role === "竞品观察") colorClass = "bg-neutral-100 text-neutral-600 border-neutral-300";

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${colorClass}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas text-text-primary overflow-hidden">
      
      {/* Toast notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-float text-[13px] font-medium flex items-center gap-2 border ${
              toastMsg.type === "success" 
                ? "bg-surface text-text-primary border-emerald-300 shadow-emerald-500/10" 
                : toastMsg.type === "error"
                ? "bg-surface text-rose-700 border-rose-300"
                : "bg-action-primary text-white border-neutral-800"
            }`}
          >
            {toastMsg.type === "success" && <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />}
            {toastMsg.type === "error" && <AlertCircle size={15} className="text-rose-600 shrink-0" />}
            {toastMsg.type === "info" && <Info size={15} className="text-white/80 shrink-0" />}
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Toolbar */}
      <div className="px-6 py-4 bg-surface border-b border-border-default flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-semibold text-text-primary leading-tight">账号资产</h1>
            <span className="px-2 py-0.5 text-[12px] font-medium bg-surface-subtle text-text-secondary rounded border border-border-subtle">
              共 {accounts.length} 个账号 · 已授权 {accounts.filter(a => a.accessMethod === "authorized" && !a.isAuthRevoked).length} 个 · 公开监控 {accounts.filter(a => a.accessMethod === "public_monitored" && !a.isStoppedMonitoring).length} 个
            </span>
          </div>
          <p className="text-[13px] text-text-secondary mt-1">
            统一维护品牌矩阵与公开监控账号，建立小红书创作者服务平台授权与指标采集流
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAddModal("public_monitor")}
            className="h-9 px-3.5 bg-surface hover:bg-surface-hover text-text-primary border border-border-default rounded-md text-[13px] font-medium transition-colors flex items-center gap-1.5"
          >
            <Globe size={15} className="text-text-secondary" />
            <span>添加公开监控</span>
          </button>

          <button
            onClick={() => handleOpenAddModal("login_auth")}
            className="h-9 px-4 bg-action-primary hover:bg-action-primary-hover text-white rounded-md text-[13px] font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>扫码接入授权账号</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="px-6 py-3 bg-surface-subtle border-b border-border-subtle flex items-center justify-between gap-4 shrink-0 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Search Box */}
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索账号昵称、小红书号或负责人..."
              className="w-full h-8 pl-8 pr-3 bg-surface border border-border-default rounded-md text-[12px] font-normal text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-strong transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* 接入方式 Filter */}
          <select
            value={filterAccessMethod}
            onChange={(e) => setFilterAccessMethod(e.target.value)}
            className="h-8 px-2.5 bg-surface border border-border-default rounded-md text-[12px] font-medium text-text-primary focus:outline-none focus:border-border-strong cursor-pointer"
          >
            <option value="all">全部接入方式</option>
            <option value="authorized">授权接入 (创作者平台)</option>
            <option value="public_monitored">公开监控 (无需登录)</option>
          </select>

          {/* 业务角色 Filter */}
          <select
            value={filterBusinessRole}
            onChange={(e) => setFilterBusinessRole(e.target.value)}
            className="h-8 px-2.5 bg-surface border border-border-default rounded-md text-[12px] font-medium text-text-primary focus:outline-none focus:border-border-strong cursor-pointer"
          >
            <option value="all">全部业务角色</option>
            <option value="品牌官方号">品牌官方号</option>
            <option value="自有矩阵号">自有矩阵号</option>
            <option value="员工KOS">员工KOS</option>
            <option value="合作达人">合作达人</option>
            <option value="素人KOC">素人KOC</option>
            <option value="竞品观察">竞品观察</option>
          </select>

          {/* 接入状态 Filter */}
          <select
            value={filterAccessStatus}
            onChange={(e) => setFilterAccessStatus(e.target.value)}
            className="h-8 px-2.5 bg-surface border border-border-default rounded-md text-[12px] font-medium text-text-primary focus:outline-none focus:border-border-strong cursor-pointer"
          >
            <option value="all">全部接入状态</option>
            <option value="已授权">已授权</option>
            <option value="授权即将过期">授权即将过期</option>
            <option value="授权已失效">授权已失效</option>
            <option value="授权异常">需人工验证</option>
            <option value="公开监控">公开监控中</option>
          </select>

          {/* 数据状态 Filter */}
          <select
            value={filterDataState}
            onChange={(e) => setFilterDataState(e.target.value)}
            className="h-8 px-2.5 bg-surface border border-border-default rounded-md text-[12px] font-medium text-text-primary focus:outline-none focus:border-border-strong cursor-pointer"
          >
            <option value="all">全部数据状态</option>
            <option value="已更新">已更新</option>
            <option value="同步中">同步中</option>
            <option value="数据已过期">数据需更新</option>
            <option value="同步失败">同步失败</option>
          </select>

          {/* 所属项目 Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="h-8 px-2.5 bg-surface border border-border-default rounded-md text-[12px] font-medium text-text-primary focus:outline-none focus:border-border-strong cursor-pointer"
          >
            <option value="all">全部所属项目</option>
            <option value="宠粮新客运营">宠粮新客运营</option>
            <option value="全域品牌心智">全域品牌心智</option>
          </select>

        </div>

        {/* Clear Filters if active */}
        {(searchQuery || filterAccessMethod !== "all" || filterBusinessRole !== "all" || filterAccessStatus !== "all" || filterDataState !== "all" || filterProject !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterAccessMethod("all");
              setFilterBusinessRole("all");
              setFilterAccessStatus("all");
              setFilterDataState("all");
              setFilterProject("all");
            }}
            className="text-[12px] text-text-tertiary hover:text-text-primary flex items-center gap-1"
          >
            <span>重置筛选</span>
          </button>
        )}
      </div>

      {/* 3. Account Assets Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-canvas">
        <div className="bg-surface rounded-lg border border-border-default overflow-hidden">
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-surface-subtle text-[12px] font-medium text-text-secondary select-none">
                <th className="py-3 px-4 w-72">账号</th>
                <th className="py-3 px-4 w-32">业务角色</th>
                <th className="py-3 px-4 w-36">负责人</th>
                <th className="py-3 px-4 w-44">接入与授权</th>
                <th className="py-3 px-4 w-36">数据状态</th>
                <th className="py-3 px-4 min-w-[160px]">所属项目与范围</th>
                <th className="py-3 px-4 text-right w-48">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle text-[13px]">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-text-tertiary bg-surface">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users size={32} className="mx-auto text-text-disabled" />
                      <p className="text-[14px] font-medium text-text-secondary">未找到匹配的账号资产</p>
                      <p className="text-[12px] text-text-tertiary">请调整筛选条件或点击右上角接入新账号</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isAuth = acc.accessMethod === "authorized";

                  return (
                    <tr 
                      key={acc.id}
                      className="hover:bg-surface-hover/60 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        // Prevent opening drawer if user clicked a specific button
                        if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
                        setSelectedAccountId(acc.id);
                        setDrawerTab("overview");
                      }}
                    >
                      {/* Column 1: 账号 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={acc.avatar}
                            alt={acc.nickname}
                            className="w-10 h-10 rounded-full object-cover border border-border-default shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-text-primary text-[13px] truncate">
                                {acc.nickname}
                              </span>
                              {acc.verifyTag && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 shrink-0 border border-neutral-200">
                                  {acc.verifyTag}
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-text-tertiary font-mono truncate mt-0.5">
                              ID: {acc.xhsId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: 业务角色 */}
                      <td className="py-3 px-4">
                        {renderRoleBadge(acc.businessRole)}
                      </td>

                      {/* Column 3: 负责人 */}
                      <td className="py-3 px-4">
                        <span className="text-[13px] font-normal text-text-primary">
                          {acc.owner}
                        </span>
                      </td>

                      {/* Column 4: 接入与授权 */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {renderAccessBadge(acc)}
                          </div>
                          <div className="text-[11px] text-text-tertiary">
                            {isAuth ? (
                              acc.authExpiresAt ? `到期: ${acc.authExpiresAt.split(" ")[0]}` : `校验: ${acc.lastVerifiedAt || "近期"}`
                            ) : (
                              "公开采集流"
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 5: 数据状态 */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div>{renderDataStateBadge(acc.dataState)}</div>
                          <div className="text-[11px] text-text-tertiary">
                            {acc.lastDataUpdatedAt ? `更新: ${acc.lastDataUpdatedAt}` : "尚未同步"}
                          </div>
                        </div>
                      </td>

                      {/* Column 6: 所属项目与范围 */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {acc.projectScope.map((p, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-surface-subtle text-text-secondary border border-border-subtle">
                              {p}
                            </span>
                          ))}
                          <span className="text-[11px] text-text-tertiary ml-1">
                            ({acc.dataSyncScope.length}项数据同步)
                          </span>
                        </div>
                      </td>

                      {/* Column 7: 操作 */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Sync Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerSync(acc);
                            }}
                            title="立即同步最新数据"
                            className="h-7 px-2 bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors flex items-center gap-1"
                          >
                            <RefreshCw size={12} className={acc.dataState === "同步中" ? "animate-spin" : ""} />
                            <span>同步</span>
                          </button>

                          {/* Action for Authorized Account: Open Creator / Re-scan */}
                          {isAuth && (
                            <>
                              {acc.accessStatus === "授权已失效" || acc.accessStatus === "授权异常" || acc.isAuthRevoked ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReScanAuth(acc);
                                  }}
                                  className="h-7 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[12px] font-medium transition-colors"
                                >
                                  重新扫码
                                </button>
                              ) : (
                                <a
                                  href={acc.creatorUrl || "https://creator.xiaohongshu.com"}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title="在小红书创作者服务平台查看"
                                  className="h-7 px-2 bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors inline-flex items-center gap-1"
                                >
                                  <span>创作者后台</span>
                                  <ExternalLink size={11} className="text-text-tertiary" />
                                </a>
                              )}
                            </>
                          )}

                          {/* Action for Public Monitored Account: Open Profile Link */}
                          {!isAuth && acc.profileUrl && (
                            <a
                              href={acc.profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="打开小红书公开主页"
                              className="h-7 px-2 bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors inline-flex items-center gap-1"
                            >
                              <span>主页</span>
                              <ExternalLink size={11} className="text-text-tertiary" />
                            </a>
                          )}

                          {/* Primary Row Action: 查看详情 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAccountId(acc.id);
                              setDrawerTab("overview");
                            }}
                            className="h-7 px-2.5 bg-surface-subtle hover:bg-surface-selected text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors"
                          >
                            详情
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

      {/* ========================================== */}
      {/* 4. Account Details Drawer */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedAccountId && currentAccount && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAccountId(null)}
              className="fixed inset-0 bg-neutral-900/30 backdrop-blur-2xs z-40"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-surface shadow-dialog z-50 flex flex-col border-l border-border-default"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface shrink-0">
                <div className="flex items-center gap-3.5">
                  <img
                    src={currentAccount.avatar}
                    alt={currentAccount.nickname}
                    className="w-12 h-12 rounded-full object-cover border border-border-default"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[16px] font-semibold text-text-primary">
                        {currentAccount.nickname}
                      </h2>
                      {renderRoleBadge(currentAccount.businessRole)}
                      {renderAccessBadge(currentAccount)}
                    </div>
                    <p className="text-[12px] text-text-secondary font-mono mt-0.5">
                      小红书号: {currentAccount.xhsId} · 负责人: {currentAccount.owner}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAccountId(null)}
                  className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="px-5 bg-surface-subtle border-b border-border-subtle flex items-center gap-2 shrink-0">
                {[
                  { id: "overview", label: "账号概览", icon: FileText },
                  { id: "performance", label: "内容表现", icon: BarChart2 },
                  { id: "auth_sync", label: "接入与授权", icon: ShieldCheck },
                  { id: "settings", label: "属性设置", icon: Lock }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerTab(tab.id as any)}
                    className={`px-3 py-2.5 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                      drawerTab === tab.id
                        ? "border-action-primary text-text-primary"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <tab.icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Drawer Content */}
              <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-canvas">
                
                {/* TAB 1: 账号概览 */}
                {drawerTab === "overview" && (
                  <div className="space-y-4">
                    
                    {/* Basic Info Card */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3.5">
                      <h3 className="text-[14px] font-semibold text-text-primary">基础设定与角色</h3>
                      
                      <div className="grid grid-cols-2 gap-3 text-[13px]">
                        <div>
                          <span className="text-[11px] text-text-secondary block mb-0.5">业务角色</span>
                          <span className="font-normal text-text-primary">{currentAccount.businessRole}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-text-secondary block mb-0.5">接入方式</span>
                          <span className="font-normal text-text-primary">
                            {currentAccount.accessMethod === "authorized" ? "创作者服务平台授权接入" : "公开主页监测 (无需登录)"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-text-secondary block mb-0.5">负责人 / 部门</span>
                          <span className="font-normal text-text-primary">{currentAccount.owner}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-text-secondary block mb-0.5">所属项目</span>
                          <span className="font-normal text-text-primary">{currentAccount.projectScope.join(", ")}</span>
                        </div>
                        {currentAccount.profileUrl && (
                          <div className="col-span-2 pt-1 border-t border-border-subtle">
                            <span className="text-[11px] text-text-secondary block mb-0.5">小红书主页链接</span>
                            <a
                              href={currentAccount.profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[12px] font-normal text-text-primary hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{currentAccount.profileUrl}</span>
                              <ExternalLink size={12} className="shrink-0 text-text-tertiary" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Persona & Boundaries */}
                      <div className="pt-2 border-t border-border-subtle space-y-2.5">
                        <div>
                          <span className="text-[11px] text-text-secondary block mb-1">人设摘要</span>
                          <p className="text-[12px] text-text-primary leading-relaxed bg-surface-subtle p-3 rounded border border-border-subtle">
                            {currentAccount.persona || "暂未填写人设摘要"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[11px] text-text-secondary block mb-1">内容边界与合规约束</span>
                          <p className="text-[12px] text-text-primary leading-relaxed bg-surface-subtle p-3 rounded border border-border-subtle">
                            {currentAccount.contentBoundaries || "暂无内容边界约束"}
                          </p>
                        </div>
                      </div>

                      {/* Capabilities List */}
                      <div className="pt-2">
                        <span className="text-[11px] text-text-secondary block mb-1.5">可用权限与能力清单</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentAccount.capabilities.map((cap, i) => (
                            <span key={i} className="px-2 py-0.5 bg-surface-subtle text-text-primary rounded text-[11px] font-medium border border-border-subtle">
                              ✓ {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Snapshot Card */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-text-primary">数据快照</h3>
                        <span className="text-[11px] text-text-tertiary">
                          最近更新: {currentAccount.lastDataUpdatedAt || "尚未同步"}
                        </span>
                      </div>

                      {currentAccount.snapshot ? (
                        <div className="grid grid-cols-3 gap-2.5 pt-1">
                          <div className="bg-surface-subtle p-3 rounded border border-border-subtle text-center">
                            <span className="text-[11px] text-text-secondary block">粉丝总量</span>
                            <div className="text-[18px] font-semibold text-text-primary mt-0.5 tabular-nums">
                              {currentAccount.snapshot.followersCount.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-text-tertiary block mt-0.5">
                              +7日: {currentAccount.snapshot.followersDelta7d}
                            </span>
                          </div>

                          <div className="bg-surface-subtle p-3 rounded border border-border-subtle text-center">
                            <span className="text-[11px] text-text-secondary block">笔记总数 / 频次</span>
                            <div className="text-[18px] font-semibold text-text-primary mt-0.5 tabular-nums">
                              {currentAccount.snapshot.notesCount} 篇
                            </div>
                            <span className="text-[10px] text-text-tertiary block mt-0.5">
                              {currentAccount.snapshot.postFrequency}
                            </span>
                          </div>

                          <div className="bg-surface-subtle p-3 rounded border border-border-subtle text-center">
                            <span className="text-[11px] text-text-secondary block">赞藏评总互动量</span>
                            <div className="text-[18px] font-semibold text-text-primary mt-0.5 tabular-nums">
                              {currentAccount.snapshot.totalInteractions.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-text-tertiary block mt-0.5">
                              历史累计
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-[12px] text-text-tertiary bg-surface-subtle rounded border border-dashed border-border-default">
                          暂无足够的数据快照
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 2: 内容表现 */}
                {drawerTab === "performance" && (
                  <div className="space-y-4">
                    
                    {/* Notes List */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-text-primary">抓取笔记及指标</h3>
                        <span className="text-[11px] text-text-tertiary">
                          共 {currentAccount.recentNotes.length} 篇已同步笔记
                        </span>
                      </div>

                      {currentAccount.recentNotes.length === 0 ? (
                        <div className="py-8 text-center text-[12px] text-text-tertiary bg-surface-subtle rounded">
                          暂无抓取的笔记记录
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentAccount.recentNotes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 bg-surface-subtle rounded border border-border-subtle flex items-center justify-between gap-3 text-[12px]"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-text-primary truncate flex items-center gap-2">
                                  <span>{note.title}</span>
                                  {note.isTopPerformance && (
                                    <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 rounded text-[10px] font-medium border border-amber-200">
                                      高赞表现
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-text-tertiary mt-0.5 block">
                                  发布于: {note.pubDate} · 主题: {note.topicTag}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] tabular-nums font-normal text-text-secondary shrink-0">
                                <span>点赞: {note.likes}</span>
                                <span>收藏: {note.collects}</span>
                                <span>评论: {note.comments}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AI Performance Attribution */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3">
                      <h3 className="text-[14px] font-semibold text-text-primary flex items-center gap-1.5">
                        <Sparkles size={15} className="text-text-secondary" />
                        <span>内容表现归因与受众匹配分析</span>
                      </h3>

                      <div className="p-3 bg-surface-subtle border border-border-subtle rounded space-y-1.5 text-[11px]">
                        <div className="font-medium text-text-primary flex items-center gap-1">
                          <Info size={12} className="text-text-secondary" />
                          <span>数据统计溯源与依据:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-text-secondary">
                          <span>· 统计样本: {currentAccount.recentNotes.length} 篇实际抓取笔记</span>
                          <span>· 观察周期: 90 天观察窗口</span>
                          <span className="col-span-2">· 核心主题: {currentAccount.contentTopics.join(", ")}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-[12px] text-text-primary leading-relaxed">
                        <p>
                          1. <strong className="font-medium">爆文特征与互动方向:</strong> 主题集中于“<span className="font-medium">{currentAccount.contentTopics.slice(0, 2).join("与")}</span>”的内容获赞藏率高出大盘 35%，评论区对生骨肉成分与换粮咨询转化意愿强烈。
                        </p>
                        <p>
                          2. <strong className="font-medium">人设吻合度:</strong> 符合人设“{currentAccount.persona.slice(0, 24)}...”，未触发合规与违禁词风险。
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: 接入与授权 */}
                {drawerTab === "auth_sync" && (
                  <div className="space-y-4">
                    
                    {/* Auth Status Card */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-text-primary">会话与授权状态</h3>
                        {renderAccessBadge(currentAccount)}
                      </div>

                      {currentAccount.accessMethod === "public_monitored" ? (
                        <div className="p-3 bg-surface-subtle rounded border border-border-subtle text-[12px] text-text-secondary leading-relaxed">
                          当前账号属于外部合作达人或竞品观察对象，基于公开主页数据流进行定期采集，无需且不保存登录密码或创作者凭据。
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-surface-subtle p-3 rounded border border-border-subtle space-y-2 text-[12px]">
                            <div className="flex justify-between">
                              <span className="text-text-secondary">会话有效期至:</span>
                              <span className="font-normal text-text-primary tabular-nums">
                                {currentAccount.authExpiresAt || "永久有效"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">最近会话校验时间:</span>
                              <span className="font-normal text-text-primary tabular-nums">
                                {currentAccount.lastVerifiedAt || "刚刚"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">创作者服务平台:</span>
                              <a
                                href={currentAccount.creatorUrl || "https://creator.xiaohongshu.com"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-text-primary hover:underline flex items-center gap-1"
                              >
                                <span>creator.xiaohongshu.com</span>
                                <ExternalLink size={11} className="text-text-tertiary" />
                              </a>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReScanAuth(currentAccount)}
                              className="flex-1 h-8 px-3 bg-surface hover:bg-surface-hover text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors"
                            >
                              重新扫码授权
                            </button>
                            <button
                              onClick={() => handleTriggerSync(currentAccount)}
                              className="flex-1 h-8 px-3 bg-action-primary hover:bg-action-primary-hover text-white rounded text-[12px] font-medium transition-colors"
                            >
                              立即同步数据
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sync Logs Card */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-text-primary">数据同步记录</h3>
                        {renderDataStateBadge(currentAccount.dataState)}
                      </div>

                      <div className="space-y-2">
                        {currentAccount.syncLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-2.5 bg-surface-subtle rounded border border-border-subtle flex items-center justify-between text-[12px]"
                          >
                            <div>
                              <div className="text-text-primary font-medium">{log.message}</div>
                              <div className="text-[11px] text-text-tertiary mt-0.5">
                                {log.time} · {log.type === "manual" ? "手动触发" : "系统定时巡检"}
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              成功
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 4: 属性设置 */}
                {drawerTab === "settings" && (
                  <div className="space-y-4">
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3.5">
                      <h3 className="text-[14px] font-semibold text-text-primary">维护账号业务属性与人设</h3>
                      
                      <div className="space-y-3 text-[12px]">
                        
                        {/* 业务角色 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">业务角色</label>
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as BusinessRole)}
                            className="w-full h-8 px-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong"
                          >
                            <option value="品牌官方号">品牌官方号</option>
                            <option value="自有矩阵号">自有矩阵号</option>
                            <option value="员工KOS">员工KOS</option>
                            <option value="合作达人">合作达人</option>
                            <option value="素人KOC">素人KOC</option>
                            <option value="竞品观察">竞品观察</option>
                          </select>
                        </div>

                        {/* 负责人 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">负责人 / 部门</label>
                          <input
                            type="text"
                            value={editOwner}
                            onChange={(e) => setEditOwner(e.target.value)}
                            className="w-full h-8 px-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong"
                          />
                        </div>

                        {/* 人设摘要 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">人设摘要</label>
                          <textarea
                            rows={3}
                            value={editPersona}
                            onChange={(e) => setEditPersona(e.target.value)}
                            placeholder="描述该账号的目标人设定位、说话口吻与目标客群..."
                            className="w-full p-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong resize-none"
                          />
                        </div>

                        {/* 内容边界 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">内容边界与合规要求</label>
                          <textarea
                            rows={3}
                            value={editBoundaries}
                            onChange={(e) => setEditBoundaries(e.target.value)}
                            placeholder="严禁涉及的敏感词、竞品对比约束或特定宣称规范..."
                            className="w-full p-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong resize-none"
                          />
                        </div>

                        {/* 所属项目 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1.5">所属项目范围</label>
                          <div className="flex flex-wrap gap-2">
                            {["宠粮新客运营", "全域品牌心智", "幼犬爆文攻坚"].map((proj) => {
                              const checked = editProjects.includes(proj);
                              return (
                                <button
                                  key={proj}
                                  type="button"
                                  onClick={() => {
                                    if (checked) {
                                      setEditProjects(editProjects.filter(p => p !== proj));
                                    } else {
                                      setEditProjects([...editProjects, proj]);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded text-[12px] font-medium border transition-colors ${
                                    checked 
                                      ? "bg-action-primary text-white border-action-primary" 
                                      : "bg-surface text-text-secondary border-border-default hover:bg-surface-hover"
                                  }`}
                                >
                                  {proj}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleSaveDrawerSettings}
                          className="h-8 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors shadow-2xs"
                        >
                          保存修改
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone: Stop Monitoring or Revoke Auth */}
                    <div className="bg-surface rounded-lg border border-border-default p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-[13px] font-semibold text-text-primary">
                          {currentAccount.accessMethod === "authorized" ? "解除授权" : "暂停公开监控"}
                        </h4>
                        <p className="text-[12px] text-text-tertiary mt-0.5">
                          {currentAccount.accessMethod === "authorized" 
                            ? "解除授权后将停止该账号的自动化任务分发与会话同步，可随时重新扫码授权。"
                            : "暂停监控后将停止拉取该账号的公开主页增量指标。"
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleDeactivate(currentAccount.id)}
                        className="h-8 px-3 text-[12px] font-medium rounded border bg-surface hover:bg-surface-hover text-text-primary border-border-default transition-colors shrink-0"
                      >
                        {currentAccount.accessMethod === "authorized" 
                          ? (currentAccount.isAuthRevoked ? "重新激活授权" : "解除授权")
                          : (currentAccount.isStoppedMonitoring ? "恢复监控" : "暂停监控")
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

      {/* ========================================== */}
      {/* 5. Add Account Wizard Modal (Two Tracks)  */}
      {/* ========================================== */}
      <AnimatePresence>
        {showAddWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddWizard(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-2xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white rounded-lg shadow-dialog border border-border-default w-full max-w-2xl overflow-hidden flex flex-col my-auto relative z-10"
            >
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-text-primary">
                      接入小红书账号
                    </h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle text-text-secondary border border-border-subtle">
                      步骤 {wizardStep} / 3: {wizardStep === 1 ? "技术接入与校验" : wizardStep === 2 ? "确认账号身份" : "配置业务属性与人设"}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    小红书创作服务平台扫码接入或公开主页监控
                  </p>
                </div>
                <button
                  onClick={() => setShowAddWizard(false)}
                  className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Step Track Selector (Only visible on Step 1) */}
              {wizardStep === 1 && (
                <div className="px-6 pt-4 bg-surface shrink-0">
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Option 1: 创作者平台扫码授权 */}
                    <button
                      type="button"
                      onClick={() => {
                        setWizardTrack("login_auth");
                        setQrScanStatus("waiting");
                        setQrTimer(60);
                      }}
                      className={`p-3.5 rounded-lg border text-left transition-all ${
                        wizardTrack === "login_auth"
                          ? "bg-surface-selected border-action-primary text-text-primary shadow-2xs"
                          : "bg-surface border-border-default hover:bg-surface-hover text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-medium text-[13px] text-text-primary">
                          <QrCode size={16} className="text-brand-500" />
                          <span>登录并授权 (创作者服务平台)</span>
                        </div>
                        {wizardTrack === "login_auth" && (
                          <span className="w-2 h-2 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <p className="text-[12px] text-text-tertiary leading-relaxed">
                        适用于品牌官方号、自有矩阵号、员工KOS和可授权合作账号。直接获取发布与全量数据权限。
                      </p>
                    </button>

                    {/* Option 2: 添加公开监控账号 */}
                    <button
                      type="button"
                      onClick={() => {
                        setWizardTrack("public_monitor");
                        setPublicInputUrlOrId("");
                        setPublicIdentifyError(null);
                      }}
                      className={`p-3.5 rounded-lg border text-left transition-all ${
                        wizardTrack === "public_monitor"
                          ? "bg-surface-selected border-action-primary text-text-primary shadow-2xs"
                          : "bg-surface border-border-default hover:bg-surface-hover text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-medium text-[13px] text-text-primary">
                          <Globe size={16} className="text-sky-600" />
                          <span>添加公开监控账号 (无需登录)</span>
                        </div>
                        {wizardTrack === "public_monitor" && (
                          <span className="w-2 h-2 rounded-full bg-sky-600" />
                        )}
                      </div>
                      <p className="text-[12px] text-text-tertiary leading-relaxed">
                        适用于外部达人、素人KOC和竞品账号。仅输入主页链接即可开启公开指标跟踪，不产生登录状态。
                      </p>
                    </button>

                  </div>
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto text-[13px] space-y-4 bg-canvas">
                
                {/* STEP 1: 技术接入 */}
                {wizardStep === 1 && (
                  <div>
                    
                    {/* TRACK A: 登录并授权 (创作者服务平台会话) */}
                    {wizardTrack === "login_auth" && (
                      <div className="space-y-4">
                        
                        {/* Browser Session Frame Header */}
                        <div className="bg-surface rounded-lg border border-border-default overflow-hidden">
                          <div className="px-3.5 py-2 bg-surface-subtle border-b border-border-subtle flex items-center justify-between text-[11px] text-text-tertiary font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                              <span className="ml-2 text-text-secondary">小红书创作者服务平台 (creator.xiaohongshu.com/login)</span>
                            </div>
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              SSL 安全独立会话
                            </span>
                          </div>

                          {/* QR Code Container */}
                          <div className="p-6 flex flex-col items-center justify-center text-center bg-surface">
                            
                            {qrScanStatus === "waiting" && (
                              <div className="space-y-3">
                                <div className="relative p-3 bg-white rounded-lg border-2 border-border-default shadow-xs mx-auto w-44 h-44 flex items-center justify-center">
                                  <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://creator.xiaohongshu.com/login/auth-session-sample"
                                    alt="小红书创作者平台登录二维码"
                                    className="w-36 h-36 object-contain"
                                  />
                                  <div className="absolute inset-0 border-t-2 border-brand-500/80 animate-pulse pointer-events-none" />
                                </div>

                                <div className="space-y-1">
                                  <p className="text-[13px] font-medium text-text-primary flex items-center justify-center gap-1.5">
                                    <Smartphone size={15} className="text-text-secondary" />
                                    请使用小红书 App 扫描二维码登录
                                  </p>
                                  <p className="text-[11px] text-text-tertiary">
                                    二维码将在 <span className="text-brand-700 font-mono font-medium">{qrTimer}s</span> 后过期
                                  </p>
                                </div>

                                <div className="pt-2 flex justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={handleSimulateScan}
                                    className="h-8 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
                                  >
                                    <Check size={14} />
                                    <span>模拟手机端扫码并确认登录</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {qrScanStatus === "scanned" && (
                              <div className="py-8 space-y-2">
                                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto animate-pulse">
                                  <Smartphone size={24} />
                                </div>
                                <h4 className="text-[14px] font-semibold text-text-primary">已扫码，请在手机上点击确认登录</h4>
                                <p className="text-[12px] text-text-tertiary">系统正在等待手机小红书 App 授权确认...</p>
                              </div>
                            )}

                            {qrScanStatus === "expired" && (
                              <div className="py-8 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-neutral-100 text-text-tertiary flex items-center justify-center mx-auto">
                                  <Clock size={24} />
                                </div>
                                <div>
                                  <h4 className="text-[14px] font-semibold text-text-primary">二维码已过期</h4>
                                  <p className="text-[12px] text-text-tertiary mt-0.5">请刷新二维码重新获取小红书登录会话</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleRefreshQrCode}
                                  className="h-8 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors"
                                >
                                  刷新二维码
                                </button>
                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    )}

                    {/* TRACK B: 添加公开监控账号 (主页识别) */}
                    {wizardTrack === "public_monitor" && (
                      <div className="space-y-4">
                        <div className="bg-surface rounded-lg border border-border-default p-5 space-y-3.5">
                          <div>
                            <label className="block text-[13px] font-medium text-text-primary mb-1">
                              小红书主页链接 或 小红书号
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={publicInputUrlOrId}
                                onChange={(e) => {
                                  setPublicInputUrlOrId(e.target.value);
                                  setPublicIdentifyError(null);
                                }}
                                placeholder="粘贴小红书主页链接 (https://www.xiaohongshu.com/user/profile/...) 或输入小红书号"
                                className="flex-1 h-9 px-3 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong font-mono"
                              />
                              <button
                                type="button"
                                onClick={handleIdentifyPublicProfile}
                                disabled={isIdentifyingPublic}
                                className="h-9 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors flex items-center gap-1.5 shrink-0"
                              >
                                {isIdentifyingPublic ? (
                                  <>
                                    <RefreshCw size={13} className="animate-spin" />
                                    <span>识别中...</span>
                                  </>
                                ) : (
                                  <>
                                    <Search size={14} />
                                    <span>识别公开主页</span>
                                  </>
                                )}
                              </button>
                            </div>
                            {publicIdentifyError && (
                              <p className="text-[11px] text-rose-600 mt-1">{publicIdentifyError}</p>
                            )}
                          </div>

                          <div className="p-3 bg-surface-subtle rounded border border-border-subtle text-[12px] text-text-secondary space-y-1">
                            <p className="font-medium text-text-primary">💡 示例输入:</p>
                            <p className="font-mono text-[11px] text-text-tertiary">
                              1. https://www.xiaohongshu.com/user/profile/60a7e8b80000000001004b32<br/>
                              2. oscar_golden_family
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* STEP 2: 确认账号身份 */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    
                    {/* Duplicate warning if any */}
                    {duplicateWarning && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[12px] text-amber-800 flex items-start gap-2">
                        <AlertTriangle size={15} className="shrink-0 text-amber-700 mt-0.5" />
                        <div>{duplicateWarning}</div>
                      </div>
                    )}

                    {/* Detected Info Box for Authorized Account */}
                    {wizardTrack === "login_auth" && detectedAuthAccount && (
                      <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3.5">
                        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                          <span className="text-[13px] font-semibold text-text-primary">创作者平台会话读取成功</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            已建立有效登录态
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5">
                          <img
                            src={detectedAuthAccount.avatar}
                            alt={detectedAuthAccount.nickname}
                            className="w-12 h-12 rounded-full object-cover border border-border-default"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[15px] font-semibold text-text-primary">
                                {detectedAuthAccount.nickname}
                              </h4>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                {detectedAuthAccount.verifyTag}
                              </span>
                            </div>
                            <p className="text-[12px] text-text-secondary font-mono mt-0.5">
                              小红书号: {detectedAuthAccount.xhsId}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border-subtle">
                          <span className="text-[11px] text-text-secondary block mb-1.5">检测到已开通的平台能力:</span>
                          <div className="grid grid-cols-2 gap-1.5 text-[12px]">
                            {detectedAuthAccount.detectedRoles.map((role, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-text-primary">
                                <Check size={13} className="text-emerald-600" />
                                <span>{role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detected Info Box for Public Monitored Account */}
                    {wizardTrack === "public_monitor" && detectedPublicAccount && (
                      <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3.5">
                        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                          <span className="text-[13px] font-semibold text-text-primary">公开主页解析成功</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                            公开指标监测
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5">
                          <img
                            src={detectedPublicAccount.avatar}
                            alt={detectedPublicAccount.nickname}
                            className="w-12 h-12 rounded-full object-cover border border-border-default"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[15px] font-semibold text-text-primary">
                                {detectedPublicAccount.nickname}
                              </h4>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                {detectedPublicAccount.verifyTag}
                              </span>
                            </div>
                            <p className="text-[12px] text-text-secondary font-mono mt-0.5">
                              小红书号: {detectedPublicAccount.xhsId}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle text-[12px]">
                          <div className="bg-surface-subtle p-2.5 rounded border border-border-subtle">
                            <span className="text-[11px] text-text-secondary block">公开粉丝数</span>
                            <span className="font-semibold text-text-primary tabular-nums">
                              {detectedPublicAccount.followersCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-surface-subtle p-2.5 rounded border border-border-subtle">
                            <span className="text-[11px] text-text-secondary block">公开笔记总数</span>
                            <span className="font-semibold text-text-primary tabular-nums">
                              {detectedPublicAccount.notesCount} 篇
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-surface-subtle rounded border border-border-subtle text-[12px] text-text-secondary">
                          <span className="font-medium text-text-primary block mb-0.5">主页简介:</span>
                          <p>{detectedPublicAccount.bio}</p>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* STEP 3: 配置业务属性 */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-surface rounded-lg border border-border-default p-4 space-y-3.5">
                      <h4 className="text-[14px] font-semibold text-text-primary">
                        完善 TapTik 内部业务属性与人设
                      </h4>

                      <div className="space-y-3 text-[12px]">
                        
                        {/* 业务角色 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">业务角色定位</label>
                          <select
                            value={formBusinessRole}
                            onChange={(e) => setFormBusinessRole(e.target.value as BusinessRole)}
                            className="w-full h-8 px-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong"
                          >
                            <option value="品牌官方号">品牌官方号</option>
                            <option value="自有矩阵号">自有矩阵号</option>
                            <option value="员工KOS">员工KOS</option>
                            <option value="合作达人">合作达人</option>
                            <option value="素人KOC">素人KOC</option>
                            <option value="竞品观察">竞品观察</option>
                          </select>
                        </div>

                        {/* 负责人/部门 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">负责人 / 部门</label>
                          <input
                            type="text"
                            value={formOwner}
                            onChange={(e) => setFormOwner(e.target.value)}
                            placeholder="如: 李美玲 (品牌营销组)"
                            className="w-full h-8 px-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong"
                          />
                        </div>

                        {/* 人设摘要 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">人设摘要</label>
                          <textarea
                            rows={2}
                            value={formPersona}
                            onChange={(e) => setFormPersona(e.target.value)}
                            placeholder="定义该账号的目标人设定位、说话风格与目标受众..."
                            className="w-full p-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong resize-none"
                          />
                        </div>

                        {/* 内容边界 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1">内容边界与合规约束</label>
                          <textarea
                            rows={2}
                            value={formBoundaries}
                            onChange={(e) => setFormBoundaries(e.target.value)}
                            placeholder="严禁涉及的话题、合规禁词规范或商业推广边界..."
                            className="w-full p-2.5 border border-border-default rounded text-[12px] bg-surface focus:outline-none focus:border-border-strong resize-none"
                          />
                        </div>

                        {/* 所属项目 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1.5">所属项目</label>
                          <div className="flex flex-wrap gap-2">
                            {["宠粮新客运营", "全域品牌心智", "幼犬爆文攻坚"].map((proj) => {
                              const checked = formProjects.includes(proj);
                              return (
                                <button
                                  key={proj}
                                  type="button"
                                  onClick={() => {
                                    if (checked) {
                                      setFormProjects(formProjects.filter(p => p !== proj));
                                    } else {
                                      setFormProjects([...formProjects, proj]);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded text-[12px] font-medium border transition-colors ${
                                    checked 
                                      ? "bg-action-primary text-white border-action-primary" 
                                      : "bg-surface text-text-secondary border-border-default hover:bg-surface-hover"
                                  }`}
                                >
                                  {proj}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 数据同步范围 */}
                        <div>
                          <label className="block text-text-secondary font-medium mb-1.5">数据同步范围</label>
                          <div className="grid grid-cols-2 gap-2 text-[12px]">
                            {["笔记数据与指标", "粉丝画像与增量", "互动与评论数据", "搜索关键词表现"].map((scope) => {
                              const checked = formDataSyncScopes.includes(scope);
                              return (
                                <label key={scope} className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      if (checked) {
                                        setFormDataSyncScopes(formDataSyncScopes.filter(s => s !== scope));
                                      } else {
                                        setFormDataSyncScopes([...formDataSyncScopes, scope]);
                                      }
                                    }}
                                    className="rounded border-border-default text-brand-600 focus:ring-0"
                                  />
                                  <span className="text-text-primary">{scope}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-3.5 border-t border-border-default bg-surface flex items-center justify-between shrink-0">
                <div>
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                      className="h-8 px-3 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                    >
                      返回上一步
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWizard(false)}
                    className="h-8 px-3.5 bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors"
                  >
                    取消
                  </button>

                  {wizardStep === 1 && (
                    <button
                      type="button"
                      disabled={wizardTrack === "login_auth" ? qrScanStatus !== "success" : !detectedPublicAccount}
                      onClick={() => setWizardStep(2)}
                      className="h-8 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      下一步
                    </button>
                  )}

                  {wizardStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="h-8 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors flex items-center gap-1"
                    >
                      <span>下一步：配置业务属性</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  {wizardStep === 3 && (
                    <button
                      type="button"
                      onClick={handleCompleteAddAccount}
                      className="h-8 px-4 bg-action-primary hover:bg-action-primary-hover text-white text-[12px] font-medium rounded transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Check size={14} />
                      <span>完成接入并入库</span>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
