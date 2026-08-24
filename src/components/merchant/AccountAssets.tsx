import React, { useState, useEffect } from "react";
import { 
  Plus, RefreshCw, Search, CheckCircle2, 
  AlertTriangle, XCircle, Clock, ExternalLink, 
  Globe, QrCode, ArrowRight, Check, AlertCircle,
  FolderKanban, Trash2, StopCircle, PlayCircle,
  Layers, Filter, ChevronRight, X, Shield, Lock,
  FileText, BarChart2, Smartphone, MoreHorizontal, User,
  Building2, Hash, Calendar, Settings, Database, Activity,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// Types & Domain Models
// ==========================================

export type AccountRelation = "自有账号" | "外部合作" | "公开监控";

export type BusinessRole = 
  | "品牌官方号"
  | "自有矩阵号"
  | "员工KOS"
  | "合作达人"
  | "素人KOC"
  | "竞品观察";

export type SessionStatus = "valid" | "expiring_soon" | "expired" | "not_required";

export type DataSyncStatus = "synced" | "syncing" | "needs_relogin" | "failed" | "not_synced";

export interface ProjectAssociation {
  projectId: string;
  projectName: string;
  projectRole: string; // 项目角色，如 "官方权威发声与转化承接", "种草实测与素人真实感铺量"
  period: string; // 使用周期，如 "2026-03-01 至 2026-12-31" 或 "长期"
  postScope: string; // 发布范围，如 "图文/视频全量发布", "仅图文发布", "仅分析不发布"
  dataScope: string; // 数据范围，如 "全量笔记与留资转化", "公开互动指标与评论", "搜索关键词监测"
  isActive: boolean; // 启用状态
}

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
  
  // 1. 平台身份 (Platform Identity)
  nickname: string;
  xhsId: string;
  avatar: string;
  platformVerify: string; // "企业蓝V认证" | "知名博主" | "个人认证" | "无认证"
  profileUrl?: string; // 公开主页链接
  creatorUrl?: string; // 创作者服务平台链接

  // 2. 内部配置 (Internal Config)
  accountRelation: AccountRelation;
  businessRole: BusinessRole;
  owner: string; // 负责人，如 "李美玲"
  ownerDept?: string; // 如 "品牌营销组"
  persona: string; // 人设摘要
  contentBoundaries: string; // 内容合规边界
  
  // 3. 项目关联 (Project Associations)
  projects: ProjectAssociation[];

  // 4. 数据状态 (Data State)
  dataSyncStatus: DataSyncStatus;
  lastDataUpdatedAt: string; // e.g. "2026-08-20 18:30"
  lastUpdatedRelative: string; // e.g. "刚刚", "10分钟前", "2小时前", "3天前"
  dataSource: string; // "小红书创作者服务平台 - 数据中心" 或 "小红书公开主页"
  dataStatsPeriod: string; // e.g. "近30天"
  lastSyncResultMsg?: string;
  
  // 5. 会话与技术凭据 (Session / Credentials)
  sessionStatus: SessionStatus;
  sessionExpiresAt: string | null;
  
  // 6. 数据快照与内容表现
  snapshot: {
    followersCount: number;
    followersDelta7d: number;
    notesCount: number;
    postFrequency: string;
    totalInteractions: number;
  } | null;
  recentNotes: RecentNote[];
  syncLogs: SyncLogEntry[];
  isStoppedMonitoring?: boolean;
}

// ==========================================
// Mock Baseline Data
// ==========================================

const INITIAL_ACCOUNTS: AccountAssetItem[] = [
  {
    id: "acc_brand_main",
    nickname: "毛孩子研究所 (官方)",
    xhsId: "pet_lab_official",
    avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=160&auto=format&fit=crop&q=80",
    platformVerify: "企业蓝V认证",
    profileUrl: "https://www.xiaohongshu.com/user/profile/pet_lab_official",
    creatorUrl: "https://creator.xiaohongshu.com",
    accountRelation: "自有账号",
    businessRole: "品牌官方号",
    owner: "李美玲",
    ownerDept: "品牌营销组",
    persona: "专业、严谨且有温度的宠粮营养科研专家人设，主打高品质生骨肉冻干与成分科普。",
    contentBoundaries: "严禁攻击同行竞品，严禁夸大医疗效果，严格遵守新广告法和宠物饲料标签国家标准。",
    projects: [
      {
        projectId: "p1",
        projectName: "宠粮新客运营",
        projectRole: "官方权威发声与转化承接",
        period: "2026-03-01 至 2026-12-31",
        postScope: "图文/视频全量发布",
        dataScope: "全量笔记与留资转化",
        isActive: true,
      },
      {
        projectId: "p2",
        projectName: "全域品牌心智",
        projectRole: "品牌公信力与成分科普主阵地",
        period: "长期",
        postScope: "图文/视频全量发布",
        dataScope: "全量互动与品牌词提及",
        isActive: true,
      }
    ],
    dataSyncStatus: "synced",
    lastDataUpdatedAt: "2026-08-20 18:30",
    lastUpdatedRelative: "刚刚",
    dataSource: "小红书创作者服务平台 - 数据中心",
    dataStatsPeriod: "近30天",
    lastSyncResultMsg: "成功同步最新 24 篇笔记及互动留资指标",
    sessionStatus: "valid",
    sessionExpiresAt: "2026-11-20 23:59",
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
    syncLogs: [
      { id: "log_1", time: "2026-08-20 18:30", type: "manual", status: "success", message: "创作者中心数据拉取成功，更新24篇笔记", notesFetched: 24 },
      { id: "log_2", time: "2026-08-20 12:00", type: "scheduled", status: "success", message: "定时巡检完成，数据无异常", notesFetched: 24 }
    ]
  },
  {
    id: "acc_matrix_01",
    nickname: "阿柴的干饭日记",
    xhsId: "shiba_foodie_diary",
    avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=160&auto=format&fit=crop&q=80",
    platformVerify: "个人认证",
    profileUrl: "https://www.xiaohongshu.com/user/profile/shiba_foodie_diary",
    creatorUrl: "https://creator.xiaohongshu.com",
    accountRelation: "自有账号",
    businessRole: "自有矩阵号",
    owner: "张强",
    ownerDept: "内容矩阵一组",
    persona: "活泼接地气的新手铲屎官视角，记录挑食柴犬被治愈的日常测评体验。",
    contentBoundaries: "以萌宠日常互动为主，软性植入品牌宠粮，不可直白硬广，保持真实评测感。",
    projects: [
      {
        projectId: "p1",
        projectName: "宠粮新客运营",
        projectRole: "种草实测与素人真实感铺量",
        period: "2026-05-01 至 2026-10-31",
        postScope: "仅图文发布",
        dataScope: "笔记互动指标与评论回帖",
        isActive: true,
      }
    ],
    dataSyncStatus: "needs_relogin",
    lastDataUpdatedAt: "2026-08-17 14:00",
    lastUpdatedRelative: "3天前",
    dataSource: "小红书创作者服务平台 - 数据中心",
    dataStatsPeriod: "近30天",
    lastSyncResultMsg: "创作者中心登录会话已失效，需重新扫码登录恢复数据同步",
    sessionStatus: "expired",
    sessionExpiresAt: "2026-08-17 14:00",
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
      }
    ],
    syncLogs: [
      { id: "log_21", time: "2026-08-17 14:00", type: "scheduled", status: "warning", message: "会话失效，暂停自动同步", notesFetched: 0 }
    ]
  },
  {
    id: "acc_kos_01",
    nickname: "小雅的宠物营养手记",
    xhsId: "vet_xiaoya_nutri",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    platformVerify: "个人认证",
    profileUrl: "https://www.xiaohongshu.com/user/profile/vet_xiaoya_nutri",
    creatorUrl: "https://creator.xiaohongshu.com",
    accountRelation: "自有账号",
    businessRole: "员工KOS",
    owner: "陈小雅",
    ownerDept: "门店营养咨询部",
    persona: "持证执业宠物营养师，擅长解答复杂体质猫狗配餐问题，专业且亲和力强。",
    contentBoundaries: "仅输出专业营养建议和配方解析，禁止提供远程医疗诊断保证。",
    projects: [
      {
        projectId: "p1",
        projectName: "宠粮新客运营",
        projectRole: "专业问答与私域引流",
        period: "2026-04-01 至 2026-12-31",
        postScope: "图文/视频发布与评论管理",
        dataScope: "全量笔记与私信互动",
        isActive: true,
      },
      {
        projectId: "p2",
        projectName: "全域品牌心智",
        projectRole: "专家背书矩阵",
        period: "长期",
        postScope: "成分解析科普发布",
        dataScope: "笔记互动量与收藏数",
        isActive: true,
      }
    ],
    dataSyncStatus: "synced",
    lastDataUpdatedAt: "2026-08-20 16:45",
    lastUpdatedRelative: "2小时前",
    dataSource: "小红书创作者服务平台 - 数据中心",
    dataStatsPeriod: "近30天",
    lastSyncResultMsg: "成功同步最新 12 篇笔记",
    sessionStatus: "valid",
    sessionExpiresAt: "2026-10-15 00:00",
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
        title: "营养师日常：拆解 5 款热门幼犬粮配方表，教你避开诱食剂雷区",
        pubDate: "2026-08-16",
        likes: 1540,
        collects: 1290,
        comments: 142,
        topicTag: "配方深度避坑",
      }
    ],
    syncLogs: [
      { id: "log_31", time: "2026-08-20 16:45", type: "scheduled", status: "success", message: "数据同步成功", notesFetched: 12 }
    ]
  },
  {
    id: "acc_kol_01",
    nickname: "金毛奥斯卡的小跟班",
    xhsId: "oscar_golden_family",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=160&auto=format&fit=crop&q=80",
    platformVerify: "知名博主",
    profileUrl: "https://www.xiaohongshu.com/user/profile/oscar_golden_family",
    accountRelation: "外部合作",
    businessRole: "合作达人",
    owner: "李美玲",
    ownerDept: "品牌营销组",
    persona: "头部金毛家庭生活博主，粉丝粘性极高，以户外治愈和高品质养宠好物见长。",
    contentBoundaries: "商业合作须经品牌审核，确保出镜产品为官方正品原装。",
    projects: [
      {
        projectId: "p1",
        projectName: "宠粮新客运营",
        projectRole: "头部达人主推破圈",
        period: "2026-08-01 至 2026-09-30",
        postScope: "仅分析不发布",
        dataScope: "公开互动指标与评论",
        isActive: true,
      }
    ],
    dataSyncStatus: "synced",
    lastDataUpdatedAt: "2026-08-20 10:20",
    lastUpdatedRelative: "8小时前",
    dataSource: "小红书公开主页",
    dataStatsPeriod: "近30天",
    lastSyncResultMsg: "成功拉取公开主页笔记及互动数据",
    sessionStatus: "not_required",
    sessionExpiresAt: null,
    snapshot: {
      followersCount: 362000,
      followersDelta7d: 3400,
      notesCount: 210,
      postFrequency: "周均 3 篇",
      totalInteractions: 890000,
    },
    recentNotes: [
      {
        id: "note_kol1",
        title: "带大狗露营的周末！把生骨肉干拌饭吃得干干净净的一天",
        pubDate: "2026-08-15",
        likes: 9800,
        collects: 4300,
        comments: 680,
        topicTag: "金毛户外好物",
        isTopPerformance: true,
      }
    ],
    syncLogs: [
      { id: "log_41", time: "2026-08-20 10:20", type: "scheduled", status: "success", message: "公开数据抓取完成", notesFetched: 15 }
    ]
  },
  {
    id: "acc_comp_01",
    nickname: "极鲜PET研选",
    xhsId: "fresh_pet_lab_comp",
    avatar: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=160&auto=format&fit=crop&q=80",
    platformVerify: "企业蓝V认证",
    profileUrl: "https://www.xiaohongshu.com/user/profile/fresh_pet_lab_comp",
    accountRelation: "公开监控",
    businessRole: "竞品观察",
    owner: "张强",
    ownerDept: "市场调研部",
    persona: "竞品品牌官方主理人号，主要监控其新品发布节点与爆款笔记投放方向。",
    contentBoundaries: "仅用于竞品策略对标与市场趋势分析，严禁任何形式的恶意互动。",
    projects: [
      {
        projectId: "p1",
        projectName: "宠粮新客运营",
        projectRole: "竞品对标与卖点攻防",
        period: "长期",
        postScope: "仅分析不发布",
        dataScope: "公开互动指标与搜索词",
        isActive: true,
      }
    ],
    dataSyncStatus: "synced",
    lastDataUpdatedAt: "2026-08-19 22:10",
    lastUpdatedRelative: "1天前",
    dataSource: "小红书公开主页",
    dataStatsPeriod: "近30天",
    lastSyncResultMsg: "成功更新竞品公开笔记互动与发文频次",
    sessionStatus: "not_required",
    sessionExpiresAt: null,
    snapshot: {
      followersCount: 89400,
      followersDelta7d: 680,
      notesCount: 145,
      postFrequency: "周均 5 篇",
      totalInteractions: 215000,
    },
    recentNotes: [
      {
        id: "note_c1",
        title: "首发！全新鲜肉烘焙粮测评：0肉粉真的能做到这么酥脆吗？",
        pubDate: "2026-08-19",
        likes: 1420,
        collects: 980,
        comments: 110,
        topicTag: "烘焙粮新品",
      }
    ],
    syncLogs: [
      { id: "log_51", time: "2026-08-19 22:10", type: "scheduled", status: "success", message: "竞品主页数据更新完成", notesFetched: 10 }
    ]
  }
];

export const AccountAssets: React.FC = () => {
  // Global Account State
  const [accounts, setAccounts] = useState<AccountAssetItem[]>(INITIAL_ACCOUNTS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccountRelation, setFilterAccountRelation] = useState<string>("all");
  const [filterBusinessRole, setFilterBusinessRole] = useState<string>("all");
  const [filterDataSyncStatus, setFilterDataSyncStatus] = useState<string>("all");
  const [showAddAccountMenu, setShowAddAccountMenu] = useState(false);
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);

  // Selected Account in Detail Drawer
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "performance" | "settings">("overview");

  // Action Menu Dropdown State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Add Account Wizard Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"scan_creator" | "add_public">("scan_creator");
  const [scanStep, setScanStep] = useState<1 | 2 | 3>(1); // 1: 扫码, 2: 验证身份, 3: 配置运营属性
  const [publicStep, setPublicStep] = useState<1 | 2>(1); // 1: 输入主页, 2: 确认与配置

  // Scan QR State
  const [qrStatus, setQrStatus] = useState<"waiting" | "success" | "expired">("waiting");
  const [qrCountdown, setQrCountdown] = useState<number>(60);
  const [isRefreshingQr, setIsRefreshingQr] = useState(false);

  // Temporary Form States in Wizard
  const [detectedAccount, setDetectedAccount] = useState<Partial<AccountAssetItem> | null>(null);
  const [inputPublicUrl, setInputPublicUrl] = useState("");
  const [isIdentifyingPublic, setIsIdentifyingPublic] = useState(false);
  
  // Step 3 Config Form State
  const [formBusinessRole, setFormBusinessRole] = useState<BusinessRole>("品牌官方号");
  const [formOwner, setFormOwner] = useState("李美玲");
  const [formOwnerDept, setFormOwnerDept] = useState("品牌营销组");
  const [formPersona, setFormPersona] = useState("");
  const [formBoundaries, setFormBoundaries] = useState("");
  const [formProjectName, setFormProjectName] = useState("宠粮新客运营");
  const [formProjectRole, setFormProjectRole] = useState("主推心智种草");
  const [formProjectPeriod, setFormProjectPeriod] = useState("2026-08-01 至 2026-12-31");
  const [formPostScope, setFormPostScope] = useState("图文/视频全量发布");
  const [formProjectDataScope, setFormProjectDataScope] = useState("全量笔记与留资转化");

  // New project in drawer state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjName, setNewProjName] = useState("全域品牌心智");
  const [newProjRole, setNewProjRole] = useState("品牌心智分发");
  const [newProjPeriod, setNewProjPeriod] = useState("长期");
  const [newProjPostScope, setNewProjPostScope] = useState("仅图文发布");
  const [newProjDataScope, setNewProjDataScope] = useState("公开互动指标与评论");

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // QR Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAddModal && modalMode === "scan_creator" && scanStep === 1 && qrStatus === "waiting") {
      interval = setInterval(() => {
        setQrCountdown((prev) => {
          if (prev <= 1) {
            setQrStatus("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAddModal, modalMode, scanStep, qrStatus]);

  // Selected account detail
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || null;

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNick = acc.nickname.toLowerCase().includes(q);
      const matchId = acc.xhsId.toLowerCase().includes(q);
      const matchOwner = acc.owner.toLowerCase().includes(q);
      if (!matchNick && !matchId && !matchOwner) return false;
    }
    // Relation
    if (filterAccountRelation !== "all" && acc.accountRelation !== filterAccountRelation) {
      return false;
    }
    // Business Role
    if (filterBusinessRole !== "all" && acc.businessRole !== filterBusinessRole) {
      return false;
    }
    // Data sync status
    if (filterDataSyncStatus !== "all") {
      if (filterDataSyncStatus === "synced" && acc.dataSyncStatus !== "synced") return false;
      if (filterDataSyncStatus === "needs_relogin" && acc.dataSyncStatus !== "needs_relogin") return false;
      if (filterDataSyncStatus === "failed" && acc.dataSyncStatus !== "failed") return false;
    }
    return true;
  });

  // Sort abnormal accounts to the top
  const sortedAndFilteredAccounts = [...filteredAccounts].sort((a, b) => {
    const aAbnormal = a.dataSyncStatus === "needs_relogin" || a.dataSyncStatus === "failed";
    const bAbnormal = b.dataSyncStatus === "needs_relogin" || b.dataSyncStatus === "failed";
    if (aAbnormal && !bAbnormal) return -1;
    if (!aAbnormal && bAbnormal) return 1;
    return 0;
  });

  // Open creator dashboard in new window
  const handleOpenCreator = (acc: AccountAssetItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = acc.creatorUrl || "https://creator.xiaohongshu.com";
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`已在新标签页打开创作者服务平台 (${acc.nickname})`);
  };

  // Open public profile in new window
  const handleOpenProfile = (acc: AccountAssetItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = acc.profileUrl || `https://www.xiaohongshu.com/user/profile/${acc.xhsId}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`已在新标签页打开小红书公开主页 (${acc.nickname})`);
  };

  // Trigger QR relogin
  const handleTriggerRelogin = (acc: AccountAssetItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalMode("scan_creator");
    setScanStep(1);
    setQrStatus("waiting");
    setQrCountdown(60);
    setShowAddModal(true);
    showToast(`请使用小红书 App 扫描二维码登录 ${acc.nickname} 的创作者中心`);
  };

  // Manual trigger sync
  const handleSyncAccount = (accId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === accId) {
          return {
            ...a,
            dataSyncStatus: "synced",
            lastDataUpdatedAt: "2026-08-20 19:40",
            lastUpdatedRelative: "刚刚",
            syncLogs: [
              {
                id: `log_${Date.now()}`,
                time: "2026-08-20 19:40",
                type: "manual",
                status: "success",
                message: "手动更新完成，最新指标已同步",
                notesFetched: a.snapshot?.notesCount || 10,
              },
              ...a.syncLogs,
            ],
          };
        }
        return a;
      })
    );
    showToast("数据同步已完成");
  };

  // Simulate scanning QR Code completion
  const handleSimulateScanSuccess = () => {
    setQrStatus("success");
    const mockDetected = {
      nickname: "特唯普萌宠研究所",
      xhsId: "twp_pet_lab",
      avatar: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=160&auto=format&fit=crop&q=80",
      platformVerify: "企业蓝V认证",
      creatorUrl: "https://creator.xiaohongshu.com",
      accountRelation: "自有账号" as AccountRelation,
      sessionStatus: "valid" as SessionStatus,
      sessionExpiresAt: "2026-11-20 23:59",
    };
    setDetectedAccount(mockDetected);
    setTimeout(() => {
      setScanStep(2);
    }, 500);
  };

  // Refresh QR code
  const handleRefreshQr = () => {
    setIsRefreshingQr(true);
    setTimeout(() => {
      setQrStatus("waiting");
      setQrCountdown(60);
      setIsRefreshingQr(false);
    }, 400);
  };

  // Identify public account
  const handleIdentifyPublicAccount = () => {
    if (!inputPublicUrl.trim()) return;
    setIsIdentifyingPublic(true);
    setTimeout(() => {
      setIsIdentifyingPublic(false);
      const isOscar = inputPublicUrl.includes("oscar") || inputPublicUrl.includes("golden");
      const mockPublic = {
        nickname: isOscar ? "金毛奥斯卡的小跟班" : "小红书养宠达人_测评",
        xhsId: isOscar ? "oscar_follow_daily" : "pet_tester_daily",
        avatar: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=160&auto=format&fit=crop&q=80",
        platformVerify: isOscar ? "知名博主" : "个人认证",
        profileUrl: `https://www.xiaohongshu.com/user/profile/${isOscar ? "oscar_follow_daily" : "pet_tester_daily"}`,
        accountRelation: "外部合作" as AccountRelation,
        sessionStatus: "not_required" as SessionStatus,
        sessionExpiresAt: null,
      };
      setDetectedAccount(mockPublic);
      setPublicStep(2);
    }, 600);
  };

  // Finish Add Wizard
  const handleFinishAddAccount = () => {
    if (!detectedAccount) return;

    const newAcc: AccountAssetItem = {
      id: `acc_${Date.now()}`,
      nickname: detectedAccount.nickname || "未命名账号",
      xhsId: detectedAccount.xhsId || "xhs_user",
      avatar: detectedAccount.avatar || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=160&auto=format&fit=crop&q=80",
      platformVerify: detectedAccount.platformVerify || "无认证",
      profileUrl: detectedAccount.profileUrl,
      creatorUrl: detectedAccount.creatorUrl,
      accountRelation: modalMode === "scan_creator" ? "自有账号" : "公开监控",
      businessRole: formBusinessRole,
      owner: formOwner || "当前用户",
      ownerDept: formOwnerDept || "运营部",
      persona: formPersona || "专注于日常与成分测评的专业分享。",
      contentBoundaries: formBoundaries || "合规运营，遵守平台规范。",
      projects: [
        {
          projectId: `p_${Date.now()}`,
          projectName: formProjectName,
          projectRole: formProjectRole,
          period: formProjectPeriod,
          postScope: formPostScope,
          dataScope: formProjectDataScope,
          isActive: true,
        }
      ],
      dataSyncStatus: "synced",
      lastDataUpdatedAt: "2026-08-20 19:40",
      lastUpdatedRelative: "刚刚",
      dataSource: modalMode === "scan_creator" ? "小红书创作者服务平台 - 数据中心" : "小红书公开主页",
      dataStatsPeriod: "近30天",
      lastSyncResultMsg: modalMode === "scan_creator" ? "创作者中心已登录，全量数据同步完成" : "公开主页指标已建立同步",
      sessionStatus: modalMode === "scan_creator" ? "valid" : "not_required",
      sessionExpiresAt: modalMode === "scan_creator" ? "2026-11-20 23:59" : null,
      snapshot: {
        followersCount: 15600,
        followersDelta7d: 320,
        notesCount: 28,
        postFrequency: "周均 3 篇",
        totalInteractions: 32400,
      },
      recentNotes: [],
      syncLogs: [
        {
          id: `log_${Date.now()}`,
          time: "2026-08-20 19:40",
          type: "manual",
          status: "success",
          message: modalMode === "scan_creator" ? "扫码登录成功并完成首次数据同步" : "公开主页添加成功",
          notesFetched: 28,
        }
      ],
    };

    setAccounts([newAcc, ...accounts]);
    setShowAddModal(false);
    // Reset wizard
    setScanStep(1);
    setPublicStep(1);
    setDetectedAccount(null);
    setInputPublicUrl("");
    showToast(`账号「${newAcc.nickname}」已添加并同步数据！`);
  };

  // Close menus on outer click
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-canvas text-text-primary h-full overflow-hidden">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-8 z-50 bg-action-primary text-white text-xs px-3.5 py-2 rounded-md shadow-float flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* Header & Main Actions */}
      {/* ========================================== */}
      <div className="bg-surface border-b border-border-default px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-semibold text-text-primary leading-tight">
              账号资产
            </h1>
            <span className="text-xs font-normal text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded">
              共 {accounts.length} 个账号
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            统一维护品牌官方号、矩阵号、员工KOS及公开监控账号，管理项目关联与数据更新。
          </p>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="relative">
          <button
            onClick={() => setShowAddAccountMenu(!showAddAccountMenu)}
            className="h-9 px-4 text-xs font-medium text-white bg-action-primary hover:bg-action-primary-hover rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>添加账号</span>
          </button>

          {showAddAccountMenu && (
            <div className="absolute right-0 top-10 z-30 w-48 bg-surface border border-border-default rounded-md shadow-float py-1 text-xs text-left">
              <button
                onClick={() => {
                  setShowAddAccountMenu(false);
                  setModalMode("scan_creator");
                  setScanStep(1);
                  setQrStatus("waiting");
                  setQrCountdown(60);
                  setDetectedAccount(null);
                  setShowAddModal(true);
                }}
                className="w-full px-3 py-2 text-left text-text-primary hover:bg-surface-hover flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-text-secondary" />
                <div>
                  <div className="font-medium">接入可运营账号</div>
                  <div className="text-[10px] text-text-tertiary">扫码登录创作者服务平台</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAddAccountMenu(false);
                  setModalMode("add_public");
                  setPublicStep(1);
                  setDetectedAccount(null);
                  setInputPublicUrl("");
                  setShowAddModal(true);
                }}
                className="w-full px-3 py-2 text-left text-text-primary hover:bg-surface-hover flex items-center gap-2 border-t border-border-subtle"
              >
                <Globe className="w-4 h-4 text-text-secondary" />
                <div>
                  <div className="font-medium">添加公开监控账号</div>
                  <div className="text-[10px] text-text-tertiary">通过主页链接抓取公开数据</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* Filters Toolbar */}
      {/* ========================================== */}
      <div className="bg-surface-subtle border-b border-border-default px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索账号昵称、ID或负责人..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-surface border border-border-default rounded-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-border-strong transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter: 账号类型 */}
          <select
            value={filterAccountRelation}
            onChange={(e) => setFilterAccountRelation(e.target.value)}
            className="h-8 px-2.5 text-xs bg-surface border border-border-default rounded-md text-text-secondary focus:outline-none focus:border-border-strong"
          >
            <option value="all">全部账号类型</option>
            <option value="自有账号">自有账号</option>
            <option value="外部合作">外部合作</option>
            <option value="公开监控">公开监控</option>
          </select>

          {/* Filter: 数据状态 */}
          <select
            value={filterDataSyncStatus}
            onChange={(e) => setFilterDataSyncStatus(e.target.value)}
            className="h-8 px-2.5 text-xs bg-surface border border-border-default rounded-md text-text-secondary focus:outline-none focus:border-border-strong"
          >
            <option value="all">全部数据状态</option>
            <option value="synced">正常 (已更新)</option>
            <option value="needs_relogin">授权失效</option>
            <option value="failed">同步失败</option>
          </select>

          {/* More Filters Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowMoreFiltersDropdown(!showMoreFiltersDropdown)}
              className={`h-8 px-3 text-xs bg-surface border rounded-md flex items-center gap-1.5 transition-colors ${
                filterBusinessRole !== "all" 
                  ? "border-brand-500 text-brand-700 bg-brand-50/50" 
                  : "border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>更多筛选 {filterBusinessRole !== "all" && "(1)"}</span>
            </button>

            {showMoreFiltersDropdown && (
              <div className="absolute left-0 top-9 z-35 w-56 bg-surface border border-border-default rounded-md shadow-float p-3 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                  <span className="font-semibold text-text-primary">更多筛选条件</span>
                  <button
                    onClick={() => setShowMoreFiltersDropdown(false)}
                    className="text-text-tertiary hover:text-text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">账号定位</label>
                  <select
                    value={filterBusinessRole}
                    onChange={(e) => setFilterBusinessRole(e.target.value)}
                    className="w-full h-8 px-2 text-xs bg-surface border border-border-default rounded-md text-text-primary"
                  >
                    <option value="all">全部账号定位</option>
                    <option value="品牌官方号">品牌官方号</option>
                    <option value="自有矩阵号">自有矩阵号</option>
                    <option value="员工KOS">员工KOS</option>
                    <option value="合作达人">合作达人</option>
                    <option value="素人KOC">素人KOC</option>
                    <option value="竞品观察">竞品观察</option>
                  </select>
                </div>

                <div className="flex justify-end pt-1 border-t border-border-subtle">
                  <button
                    onClick={() => {
                      setFilterBusinessRole("all");
                      setShowMoreFiltersDropdown(false);
                    }}
                    className="text-[11px] text-text-secondary hover:text-text-primary"
                  >
                    清空筛选
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Filters */}
          {(searchQuery || filterAccountRelation !== "all" || filterBusinessRole !== "all" || filterDataSyncStatus !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterAccountRelation("all");
                setFilterBusinessRole("all");
                setFilterDataSyncStatus("all");
              }}
              className="h-8 px-2 text-xs text-text-tertiary hover:text-text-primary flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>重置</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* Main Table Area */}
      {/* ========================================== */}
      <div className="flex-1 overflow-auto bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-default bg-surface-subtle text-[12px] font-medium text-text-secondary select-none">
              <th className="py-2.5 px-6 font-medium">账号</th>
              <th className="py-2.5 px-4 font-medium">账号定位</th>
              <th className="py-2.5 px-4 font-medium">负责人</th>
              <th className="py-2.5 px-4 font-medium">数据连接</th>
              <th className="py-2.5 px-6 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-xs">
            {sortedAndFilteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-text-tertiary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <User className="w-8 h-8 text-neutral-300 stroke-[1.5]" />
                    <p className="text-sm text-text-secondary">未找到匹配的账号资产</p>
                    <p className="text-xs text-text-tertiary">请尝试调整筛选条件或点击上方按钮添加新账号</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedAndFilteredAccounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                const isAbnormal = acc.dataSyncStatus === "needs_relogin" || acc.dataSyncStatus === "failed";

                // Determine connection badge
                const getConnectionBadge = () => {
                  if (acc.accountRelation === "公开监控") {
                    return <span className="text-[11px] font-medium text-text-secondary bg-surface-subtle border border-border-default px-1.5 py-0.2 rounded-xs whitespace-nowrap">公开监控</span>;
                  }
                  if (isAbnormal) {
                    return <span className="text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-xs whitespace-nowrap">授权失效</span>;
                  }
                  return <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs whitespace-nowrap">可运营</span>;
                };

                return (
                  <tr
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      setDrawerTab("overview");
                    }}
                    className={`group cursor-pointer transition-colors ${
                      isSelected ? "bg-surface-selected" : "hover:bg-surface-hover"
                    }`}
                  >
                    {/* 1. 账号 (头像 + 昵称 + 平台认证 + 连接类型) */}
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.nickname}
                          className="w-10 h-10 rounded-full object-cover border border-border-default shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-text-primary truncate max-w-[180px]">
                              {acc.nickname}
                            </span>
                            {acc.platformVerify && acc.platformVerify !== "无认证" && (
                              <span className="text-[11px] font-normal text-text-secondary bg-surface-subtle border border-border-default px-1.5 py-0.2 rounded-xs whitespace-nowrap">
                                {acc.platformVerify}
                              </span>
                            )}
                            {getConnectionBadge()}
                          </div>
                          <div className="text-[11px] text-text-tertiary truncate font-mono mt-0.5">
                            ID: {acc.xhsId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. 账号定位 */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center text-xs font-normal text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded-md whitespace-nowrap">
                        {acc.businessRole}
                      </span>
                    </td>

                    {/* 3. 负责人 */}
                    <td className="py-3 px-4">
                      <div className="text-text-primary font-normal">{acc.owner}</div>
                      {acc.ownerDept && (
                        <div className="text-[11px] text-text-tertiary">{acc.ownerDept}</div>
                      )}
                    </td>

                    {/* 4. 数据连接 / 状态 */}
                    <td className="py-3 px-4">
                      {isAbnormal ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-rose-600 font-medium">授权失效</span>
                            <span className="text-xs text-text-tertiary">3天前停止更新</span>
                          </div>
                          <div className="mt-0.5">
                            <button
                              onClick={(e) => handleTriggerRelogin(acc, e)}
                              className="text-[11px] font-medium text-rose-600 hover:underline"
                            >
                              重新登录
                            </button>
                          </div>
                        </div>
                      ) : acc.accountRelation === "公开监控" ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-primary font-medium">正常</span>
                            <span className="text-xs text-text-secondary">{acc.lastUpdatedRelative}更新</span>
                          </div>
                          <div className="text-[11px] text-text-tertiary mt-0.5">
                            来源：公开主页
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-primary font-medium">正常</span>
                            <span className="text-xs text-text-secondary">{acc.lastUpdatedRelative}更新</span>
                          </div>
                          <div className="text-[11px] text-text-tertiary mt-0.5">
                            来源：创作者中心
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 5. 操作 */}
                    <td className="py-3 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 授权失效 -> 重新登录 */}
                        {isAbnormal && (
                          <button
                            onClick={(e) => handleTriggerRelogin(acc, e)}
                            className="h-7 px-2.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md flex items-center gap-1 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3 text-amber-700" />
                            <span>重新登录</span>
                          </button>
                        )}

                        {/* 正常可运营账号 -> 查看账号 */}
                        {!isAbnormal && acc.accountRelation === "自有账号" && (
                          <button
                            onClick={(e) => {
                              setSelectedAccountId(acc.id);
                              setDrawerTab("overview");
                            }}
                            className="h-7 px-2.5 text-xs font-medium text-text-primary bg-surface hover:bg-surface-hover border border-border-default rounded-md flex items-center gap-1 transition-colors"
                          >
                            <span>查看账号</span>
                          </button>
                        )}

                        {/* 公开监控账号 -> 查看数据 */}
                        {!isAbnormal && acc.accountRelation !== "自有账号" && (
                          <button
                            onClick={(e) => {
                              setSelectedAccountId(acc.id);
                              setDrawerTab("performance");
                            }}
                            className="h-7 px-2.5 text-xs font-medium text-text-primary bg-surface hover:bg-surface-hover border border-border-default rounded-md flex items-center gap-1 transition-colors"
                          >
                            <span>查看数据</span>
                          </button>
                        )}

                        {/* 更多低频操作下拉菜单 (···) */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === acc.id ? null : acc.id);
                            }}
                            className="w-7 h-7 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
                            title="更多操作"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuId === acc.id && (
                            <div 
                              className="absolute right-0 top-8 z-30 w-40 bg-surface border border-border-default rounded-md shadow-float py-1 text-xs text-left"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {acc.accountRelation === "自有账号" ? (
                                <button
                                  onClick={(e) => handleOpenCreator(acc, e)}
                                  className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-hover flex items-center gap-2"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-text-secondary" />
                                  <span>打开创作者中心</span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => handleOpenProfile(acc, e)}
                                  className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-hover flex items-center gap-2"
                                >
                                  <Globe className="w-3.5 h-3.5 text-text-secondary" />
                                  <span>打开公开主页</span>
                                </button>
                              )}

                              <button
                                onClick={(e) => handleSyncAccount(acc.id, e)}
                                className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-hover flex items-center gap-2"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-text-secondary" />
                                <span>立即同步数据</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedAccountId(acc.id);
                                  setDrawerTab("settings");
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-hover flex items-center gap-2"
                              >
                                <Settings className="w-3.5 h-3.5 text-text-secondary" />
                                <span>修改配置</span>
                              </button>

                              <div className="h-px bg-border-subtle my-1" />

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setAccounts((prev) => prev.filter((a) => a.id !== acc.id));
                                  if (selectedAccountId === acc.id) setSelectedAccountId(null);
                                  showToast(`已移除账号「${acc.nickname}」`);
                                }}
                                className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>移除该账号</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* Account Detail Drawer (540px right panel) */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedAccount && (
          <div className="fixed inset-0 z-40 flex justify-end">
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAccountId(null)}
              className="fixed inset-0 bg-btn-main/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: 540 }}
              animate={{ x: 0 }}
              exit={{ x: 540 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-10 w-full max-w-[540px] bg-surface-1 border-l border-border-default h-full shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="px-6 py-4 border-b border-border-default bg-surface-1 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-text-tertiary" />
                    账号详情与配置
                  </span>
                  <button
                    onClick={() => setSelectedAccountId(null)}
                    className="w-7 h-7 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Account Platform Profile Header */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedAccount.avatar}
                      alt={selectedAccount.nickname}
                      className="w-12 h-12 rounded-full object-cover border border-border-default shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-[16px] font-semibold text-text-primary truncate">
                          {selectedAccount.nickname}
                        </h2>
                        {selectedAccount.platformVerify && selectedAccount.platformVerify !== "无认证" && (
                          <span className="text-[11px] font-normal text-text-secondary bg-surface-subtle border border-border-default px-1.5 py-0.2 rounded-xs">
                            {selectedAccount.platformVerify}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-tertiary font-mono mt-0.5">
                        ID: {selectedAccount.xhsId}
                      </div>
                    </div>
                  </div>

                  {/* Primary External Access Action */}
                  <div className="shrink-0">
                    {selectedAccount.accountRelation === "自有账号" ? (
                      <button
                        onClick={(e) => handleOpenCreator(selectedAccount, e)}
                        className="h-8 px-3 text-xs font-medium text-text-primary bg-surface hover:bg-surface-hover border border-border-default rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-text-secondary" />
                        <span>打开创作者中心</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleOpenProfile(selectedAccount, e)}
                        className="h-8 px-3 text-xs font-medium text-text-primary bg-surface hover:bg-surface-hover border border-border-default rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-text-secondary" />
                        <span>打开主页</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Drawer 3 Tabs Navigation */}
                <div className="flex items-center gap-6 mt-5 border-b border-border-default -mb-4">
                  <button
                    onClick={() => setDrawerTab("overview")}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      drawerTab === "overview"
                        ? "text-text-primary border-brand-500"
                        : "text-text-secondary border-transparent hover:text-text-primary"
                    }`}
                  >
                    账号概览
                  </button>
                  <button
                    onClick={() => setDrawerTab("performance")}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      drawerTab === "performance"
                        ? "text-text-primary border-brand-500"
                        : "text-text-secondary border-transparent hover:text-text-primary"
                    }`}
                  >
                    数据表现
                  </button>
                  <button
                    onClick={() => setDrawerTab("settings")}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      drawerTab === "settings"
                        ? "text-text-primary border-brand-500"
                        : "text-text-secondary border-transparent hover:text-text-primary"
                    }`}
                  >
                    属性设置
                  </button>
                </div>
              </div>

              {/* Drawer Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
                {/* -------------------------------------- */}
                {/* TAB 1: 账号概览 */}
                {/* -------------------------------------- */}
                {drawerTab === "overview" && (
                  <div className="space-y-6 text-xs">
                    {/* Basic Operational Attributes Grid */}
                    <div>
                      <h3 className="text-xs font-medium text-text-secondary mb-3">内部配置</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                          <span className="text-[11px] text-text-tertiary block">账号定位</span>
                          <span className="text-xs font-medium text-text-primary mt-1 block">
                            {selectedAccount.businessRole}
                          </span>
                        </div>
                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                          <span className="text-[11px] text-text-tertiary block">负责人</span>
                          <span className="text-xs font-medium text-text-primary mt-1 block">
                            {selectedAccount.owner} {selectedAccount.ownerDept && `(${selectedAccount.ownerDept})`}
                          </span>
                        </div>
                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                          <span className="text-[11px] text-text-tertiary block">账号关系</span>
                          <span className="text-xs font-medium text-text-primary mt-1 block">
                            {selectedAccount.accountRelation}
                          </span>
                        </div>
                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                          <span className="text-[11px] text-text-tertiary block">数据同步通道</span>
                          <span className="text-xs font-medium text-text-primary mt-1 block truncate" title={selectedAccount.dataSource}>
                            {selectedAccount.dataSource}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Usage Summary Card */}
                    <div>
                      <h3 className="text-xs font-medium text-text-secondary mb-3">使用情况</h3>
                      <div className="p-3.5 bg-surface-subtle border border-border-default rounded-md flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-text-tertiary block">关联项目</span>
                          <span className="text-xs font-medium text-text-primary mt-1 block">
                            使用项目：{selectedAccount.projects.filter(p => p.isActive).length}个&nbsp;&nbsp;&nbsp;&nbsp;{selectedAccount.projects.filter(p => p.isActive).map(p => p.projectName).join("、")}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary font-medium">查看</span>
                      </div>
                    </div>

                    {/* Persona & Boundaries */}
                    <div>
                      <h3 className="text-xs font-medium text-text-secondary mb-3">人设定位与内容边界</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                          <span className="text-[11px] text-text-tertiary font-medium block">人设定位摘要</span>
                          <p className="text-xs text-text-primary mt-1.5 leading-relaxed">
                            {selectedAccount.persona || "暂未配置人设定位"}
                          </p>
                        </div>
                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                          <span className="text-[11px] text-text-tertiary font-medium block">内容合规与发布边界</span>
                          <p className="text-xs text-text-primary mt-1.5 leading-relaxed">
                            {selectedAccount.contentBoundaries || "暂未配置内容边界"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------- */}
                {/* TAB 2: 数据表现 */}
                {/* -------------------------------------- */}
                {drawerTab === "performance" && (
                  <div className="space-y-6 text-xs">
                    {/* Data Provenance & Last Sync Header */}
                    <div className="p-3.5 bg-surface-subtle border border-border-default rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-text-tertiary" />
                          数据状态与通道
                        </span>
                        <span className="text-[11px] text-text-tertiary">
                          统计周期: <strong className="text-text-primary font-medium">{selectedAccount.dataStatsPeriod}</strong>
                        </span>
                      </div>
                      <div className="text-xs font-medium text-text-primary mt-1">
                        {selectedAccount.dataSource}
                      </div>
                      <div className="text-[11px] text-text-tertiary mt-2 flex items-center justify-between pt-2 border-t border-border-subtle">
                        <span>最近更新: {selectedAccount.lastDataUpdatedAt} ({selectedAccount.lastUpdatedRelative})</span>
                        <button
                          onClick={(e) => handleSyncAccount(selectedAccount.id, e)}
                          className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-[11px] font-medium"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>立即同步</span>
                        </button>
                      </div>
                    </div>

                    {/* Snapshot Metrics Grid */}
                    {selectedAccount.snapshot && (
                      <div>
                        <h3 className="text-xs font-medium text-text-secondary mb-3">核心互动与账号表现</h3>
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                            <span className="text-[11px] text-text-tertiary block">总粉丝数</span>
                            <span className="text-[16px] font-medium text-text-primary mt-1 block">
                              {selectedAccount.snapshot.followersCount.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-emerald-700 mt-0.5 block">
                              7日增粉 +{selectedAccount.snapshot.followersDelta7d}
                            </span>
                          </div>

                          <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                            <span className="text-[11px] text-text-tertiary block">笔记总数</span>
                            <span className="text-[16px] font-medium text-text-primary mt-1 block">
                              {selectedAccount.snapshot.notesCount} 篇
                            </span>
                            <span className="text-[10px] text-text-tertiary mt-0.5 block">
                              {selectedAccount.snapshot.postFrequency}
                            </span>
                          </div>

                          <div className="p-3 bg-surface-subtle border border-border-default rounded-md">
                            <span className="text-[11px] text-text-tertiary block">总互动量</span>
                            <span className="text-[16px] font-medium text-text-primary mt-1 block">
                              {(selectedAccount.snapshot.totalInteractions / 10000).toFixed(1)}w
                            </span>
                            <span className="text-[10px] text-text-tertiary mt-0.5 block">
                              赞藏与评论汇总
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recent Notes List */}
                    <div>
                      <h3 className="text-xs font-medium text-text-secondary mb-3">近期代表笔记表现</h3>
                      <div className="space-y-2.5">
                        {selectedAccount.recentNotes.length === 0 ? (
                          <div className="py-6 text-center text-text-tertiary border border-dashed border-border-default rounded-md">
                            暂无已归集的笔记数据
                          </div>
                        ) : (
                          selectedAccount.recentNotes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 bg-surface-subtle border border-border-default rounded-md space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-medium text-text-primary line-clamp-2">
                                  {note.title}
                                </span>
                                {note.isTopPerformance && (
                                  <span className="text-[10px] text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.2 rounded-xs shrink-0">
                                    TOP爆文
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
                                <span>发布于 {note.pubDate} · {note.topicTag}</span>
                                <div className="flex items-center gap-3 text-text-secondary">
                                  <span>赞 {note.likes}</span>
                                  <span>藏 {note.collects}</span>
                                  <span>评 {note.comments}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Sync Logs */}
                    <div>
                      <h3 className="text-xs font-medium text-text-secondary mb-3">同步任务日志</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedAccount.syncLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-2.5 bg-surface-subtle border border-border-subtle rounded-md text-[11px] flex items-start justify-between gap-2"
                          >
                            <div>
                              <span className="text-text-primary block">{log.message}</span>
                              <span className="text-text-tertiary mt-0.5 block">{log.time}</span>
                            </div>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-xs shrink-0">
                              成功
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------- */}
                {/* TAB 3: 属性设置 */}
                {/* -------------------------------------- */}
                {drawerTab === "settings" && (
                  <div className="space-y-6 text-xs">
                    {/* Edit Form */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-medium text-text-secondary">内部运营配置</h3>
                      
                      <div>
                        <label className="block text-[11px] text-text-tertiary mb-1">内部运营角色</label>
                        <select
                          value={selectedAccount.businessRole}
                          onChange={(e) => {
                            const val = e.target.value as BusinessRole;
                            setAccounts((prev) =>
                              prev.map((a) =>
                                a.id === selectedAccount.id ? { ...a, businessRole: val } : a
                              )
                            );
                            showToast("运营角色已更新");
                          }}
                          className="w-full h-8 px-2.5 text-xs bg-surface border border-border-default rounded-md text-text-primary focus:outline-none focus:border-border-strong"
                        >
                          <option value="品牌官方号">品牌官方号</option>
                          <option value="自有矩阵号">自有矩阵号</option>
                          <option value="员工KOS">员工KOS</option>
                          <option value="合作达人">合作达人</option>
                          <option value="素人KOC">素人KOC</option>
                          <option value="竞品观察">竞品观察</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-text-tertiary mb-1">负责人与归属部门</label>
                        <input
                          type="text"
                          defaultValue={`${selectedAccount.owner} ${selectedAccount.ownerDept ? `(${selectedAccount.ownerDept})` : ""}`}
                          onBlur={(e) => {
                            const val = e.target.value;
                            setAccounts((prev) =>
                              prev.map((a) =>
                                a.id === selectedAccount.id ? { ...a, owner: val } : a
                              )
                            );
                            showToast("负责人已更新");
                          }}
                          className="w-full h-8 px-3 text-xs bg-surface border border-border-default rounded-md text-text-primary focus:outline-none focus:border-border-strong"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-text-tertiary mb-1">人设定位摘要</label>
                        <textarea
                          rows={3}
                          defaultValue={selectedAccount.persona}
                          onBlur={(e) => {
                            const val = e.target.value;
                            setAccounts((prev) =>
                              prev.map((a) =>
                                a.id === selectedAccount.id ? { ...a, persona: val } : a
                              )
                            );
                            showToast("人设定位已更新");
                          }}
                          className="w-full p-2.5 text-xs bg-surface border border-border-default rounded-md text-text-primary focus:outline-none focus:border-border-strong resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-text-tertiary mb-1">内容合规与发布边界</label>
                        <textarea
                          rows={3}
                          defaultValue={selectedAccount.contentBoundaries}
                          onBlur={(e) => {
                            const val = e.target.value;
                            setAccounts((prev) =>
                              prev.map((a) =>
                                a.id === selectedAccount.id ? { ...a, contentBoundaries: val } : a
                              )
                            );
                            showToast("内容边界已更新");
                          }}
                          className="w-full p-2.5 text-xs bg-surface border border-border-default rounded-md text-text-primary focus:outline-none focus:border-border-strong resize-none"
                        />
                      </div>
                    </div>

                    {/* Session & Connection Management */}
                    <div className="pt-4 border-t border-border-default space-y-3">
                      <h3 className="text-xs font-medium text-text-secondary">登录会话与账号管理</h3>
                      
                      {selectedAccount.accountRelation === "自有账号" && (
                        <div className="flex items-center justify-between p-3 bg-surface-subtle border border-border-default rounded-md">
                          <div>
                            <span className="font-medium text-text-primary block">创作者服务平台会话</span>
                            <span className="text-[11px] text-text-tertiary mt-0.5 block">
                              到期时间: {selectedAccount.sessionExpiresAt || "永久有效"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleTriggerRelogin(selectedAccount, e)}
                            className="h-7 px-2.5 text-xs font-medium text-text-secondary bg-surface hover:bg-surface-hover border border-border-default rounded-md flex items-center gap-1 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>重新扫码</span>
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3 bg-rose-50/50 border border-rose-100 rounded-md">
                        <div>
                          <span className="font-medium text-rose-900 block">移除该账号</span>
                          <span className="text-[11px] text-rose-700/80 mt-0.5 block">
                            停止数据同步与项目关联，保留历史已归集指标。
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setAccounts((prev) => prev.filter((a) => a.id !== selectedAccount.id));
                            setSelectedAccountId(null);
                            showToast(`已移除账号「${selectedAccount.nickname}」`);
                          }}
                          className="h-7 px-2.5 text-xs font-medium text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-md transition-colors"
                        >
                          移除账号
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ========================================== */}
      {/* Add Account Modal (Wizard) */}
      {/* ========================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-btn-main/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-surface-1 rounded-2xl shadow-xl border border-border-default w-full max-w-2xl overflow-hidden flex flex-col my-auto relative z-10"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-surface-1 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-text-primary">
                      {modalMode === "scan_creator" ? "扫码登录创作者中心" : "添加公开监控账号"}
                    </h3>
                    <span className="text-xs text-text-secondary bg-surface-subtle border border-border-default px-2 py-0.5 rounded-sm">
                      {modalMode === "scan_creator" ? `步骤 ${scanStep} / 3` : `步骤 ${publicStep} / 2`}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {modalMode === "scan_creator"
                      ? "小红书创作者服务平台官方安全登录，支持内容发布与全量数据同步"
                      : "通过公开主页链接添加外部达人或竞品观察账号，无需登录凭据"}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Selection Tabs (Top Segmented Control) */}
              <div className="px-6 py-3 bg-surface-subtle border-b border-border-default flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setModalMode("scan_creator");
                    setScanStep(1);
                  }}
                  className={`flex-1 p-2.5 rounded-md border text-left transition-all ${
                    modalMode === "scan_creator"
                      ? "bg-white border-border-strong shadow-xs"
                      : "bg-surface border-border-default hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-text-primary" />
                    <span className="text-xs font-semibold text-text-primary">扫码登录创作者中心</span>
                  </div>
                  <p className="text-[11px] text-text-tertiary mt-1">
                    适用于品牌官方号、自有矩阵号及员工KOS
                  </p>
                </button>

                <button
                  onClick={() => {
                    setModalMode("add_public");
                    setPublicStep(1);
                  }}
                  className={`flex-1 p-2.5 rounded-md border text-left transition-all ${
                    modalMode === "add_public"
                      ? "bg-white border-border-strong shadow-xs"
                      : "bg-surface border-border-default hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-text-primary" />
                    <span className="text-xs font-semibold text-text-primary">添加公开监控账号 (免登录)</span>
                  </div>
                  <p className="text-[11px] text-text-tertiary mt-1">
                    适用于外部合作达人、素人KOC及竞品观察
                  </p>
                </button>
              </div>

              {/* Modal Body Area */}
              <div className="p-6 bg-surface overflow-y-auto max-h-[60vh]">
                {/* ==================================================== */}
                {/* TRACK 1: 扫码登录创作者中心 */}
                {/* ==================================================== */}
                {modalMode === "scan_creator" && (
                  <div className="space-y-6">
                    {/* Step 1: 扫码登录 */}
                    {scanStep === 1 && (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <p className="text-xs text-text-secondary mb-4">
                          打开小红书 App 扫描下方二维码，登录创作者服务平台 (creator.xiaohongshu.com)
                        </p>

                        {/* QR Code Card */}
                        <div className="relative p-4 bg-white border border-border-default rounded-lg shadow-xs flex flex-col items-center">
                          {qrStatus === "expired" ? (
                            <div className="w-44 h-44 bg-surface-subtle rounded-md flex flex-col items-center justify-center gap-2 p-4">
                              <AlertCircle className="w-8 h-8 text-amber-600" />
                              <span className="text-xs text-text-secondary font-medium">二维码已失效</span>
                              <button
                                onClick={handleRefreshQr}
                                className="mt-1 px-2.5 py-1 text-xs text-text-primary bg-white border border-border-default rounded-md hover:bg-surface-hover flex items-center gap-1"
                              >
                                <RefreshCw className={`w-3 h-3 ${isRefreshingQr ? "animate-spin" : ""}`} />
                                <span>刷新二维码</span>
                              </button>
                            </div>
                          ) : qrStatus === "success" ? (
                            <div className="w-44 h-44 bg-emerald-50 rounded-md flex flex-col items-center justify-center gap-2 p-4 text-emerald-800">
                              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                              <span className="text-xs font-semibold">扫码确认成功</span>
                              <span className="text-[11px] text-emerald-700">正在验证会话有效性...</span>
                            </div>
                          ) : (
                            <div 
                              onClick={handleSimulateScanSuccess}
                              className="cursor-pointer group relative w-44 h-44 bg-surface-subtle rounded-md flex items-center justify-center border border-border-default overflow-hidden"
                              title="点击可直接确认登录"
                            >
                              {/* QR Visual */}
                              <div className="w-36 h-36 bg-white p-2 border border-border-default rounded flex flex-col items-center justify-center">
                                <QrCode className="w-32 h-32 text-neutral-800" />
                              </div>
                              {/* Hover overlay hint */}
                              <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity p-2 text-center">
                                <Check className="w-6 h-6 mb-1 text-emerald-400" />
                                <span className="text-xs font-medium">确认扫码登录</span>
                              </div>
                            </div>
                          )}

                          {/* QR Countdown & Actions */}
                          {qrStatus === "waiting" && (
                            <div className="flex items-center justify-between w-full mt-3 text-[11px] text-text-tertiary">
                              <span>有效时间: {qrCountdown} 秒</span>
                              <button
                                onClick={handleRefreshQr}
                                className="text-text-secondary hover:text-text-primary flex items-center gap-1"
                              >
                                <RefreshCw className={`w-3 h-3 ${isRefreshingQr ? "animate-spin" : ""}`} />
                                <span>刷新</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-1.5 text-xs text-text-tertiary">
                          <Shield className="w-3.5 h-3.5 text-text-tertiary" />
                          <span>仅建立创作者数据中心与内容发布接口安全会话，不保存小红书登录密码</span>
                        </div>
                      </div>
                    )}

                    {/* Step 2: 验证账号身份与可用能力 */}
                    {scanStep === 2 && detectedAccount && (
                      <div className="space-y-5">
                        <div className="p-4 bg-surface-subtle border border-border-default rounded-md">
                          <div className="text-[11px] text-text-tertiary mb-2 font-medium">识别到的平台身份</div>
                          <div className="flex items-center gap-3">
                            <img
                              src={detectedAccount.avatar}
                              alt={detectedAccount.nickname}
                              className="w-12 h-12 rounded-full object-cover border border-border-default shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-text-primary">
                                  {detectedAccount.nickname}
                                </span>
                                {detectedAccount.platformVerify && (
                                  <span className="text-[11px] text-text-secondary bg-white border border-border-default px-1.5 py-0.2 rounded-xs">
                                    {detectedAccount.platformVerify}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-text-tertiary font-mono mt-0.5">
                                ID: {detectedAccount.xhsId}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Verified Capabilities */}
                        <div>
                          <div className="text-xs font-medium text-text-secondary mb-2">已就绪的创作者平台能力</div>
                          <div className="grid grid-cols-2 gap-2.5 text-xs">
                            <div className="p-2.5 bg-surface-subtle border border-border-default rounded-md flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-text-primary">图文与视频直接发布</span>
                            </div>
                            <div className="p-2.5 bg-surface-subtle border border-border-default rounded-md flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-text-primary">全量数据中心与指标同步</span>
                            </div>
                            <div className="p-2.5 bg-surface-subtle border border-border-default rounded-md flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-text-primary">笔记评论与互动监控</span>
                            </div>
                            <div className="p-2.5 bg-surface-subtle border border-border-default rounded-md flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-text-primary">粉丝画像与留资分析</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: 配置运营属性与项目范围 */}
                    {scanStep === 3 && (
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-text-tertiary mb-1">内部运营角色</label>
                            <select
                              value={formBusinessRole}
                              onChange={(e) => setFormBusinessRole(e.target.value as BusinessRole)}
                              className="w-full h-8 px-2.5 bg-surface border border-border-default rounded-md text-text-primary"
                            >
                              <option value="品牌官方号">品牌官方号</option>
                              <option value="自有矩阵号">自有矩阵号</option>
                              <option value="员工KOS">员工KOS</option>
                              <option value="合作达人">合作达人</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] text-text-tertiary mb-1">负责人</label>
                            <input
                              type="text"
                              value={formOwner}
                              onChange={(e) => setFormOwner(e.target.value)}
                              placeholder="如: 李美玲"
                              className="w-full h-8 px-3 bg-surface border border-border-default rounded-md text-text-primary"
                            />
                          </div>
                        </div>

                        <div className="p-3.5 bg-surface-subtle border border-border-default rounded-md space-y-3">
                          <span className="text-[11px] font-medium text-text-secondary block">初始关联项目设置</span>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] text-text-tertiary mb-1">所属项目</label>
                              <select
                                value={formProjectName}
                                onChange={(e) => setFormProjectName(e.target.value)}
                                className="w-full h-7 px-2 text-xs bg-white border border-border-default rounded-md"
                              >
                                <option value="宠粮新客运营">宠粮新客运营</option>
                                <option value="全域品牌心智">全域品牌心智</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-text-tertiary mb-1">项目角色</label>
                              <input
                                type="text"
                                value={formProjectRole}
                                onChange={(e) => setFormProjectRole(e.target.value)}
                                className="w-full h-7 px-2 text-xs bg-white border border-border-default rounded-md"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-text-tertiary mb-1">人设定位摘要 (选填)</label>
                          <textarea
                            rows={2}
                            value={formPersona}
                            onChange={(e) => setFormPersona(e.target.value)}
                            placeholder="描述该账号在平台上的主要定位、目标人群与语气风格..."
                            className="w-full p-2 text-xs bg-surface border border-border-default rounded-md resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ==================================================== */}
                {/* TRACK 2: 添加公开监控账号 */}
                {/* ==================================================== */}
                {modalMode === "add_public" && (
                  <div className="space-y-5 text-xs">
                    {/* Step 1: 输入主页链接 */}
                    {publicStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-text-primary mb-1">
                            小红书主页链接 或 小红书号
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={inputPublicUrl}
                              onChange={(e) => setInputPublicUrl(e.target.value)}
                              placeholder="粘贴小红书主页链接 (https://www.xiaohongshu.com/user/profile/...) 或输入小红书号"
                              className="flex-1 h-9 px-3 text-xs bg-surface border border-border-default rounded-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-strong"
                            />
                            <button
                              onClick={handleIdentifyPublicAccount}
                              disabled={!inputPublicUrl.trim() || isIdentifyingPublic}
                              className="h-9 px-3.5 text-xs font-medium text-white bg-action-primary hover:bg-action-primary-hover disabled:opacity-50 rounded-md flex items-center gap-1.5 transition-colors"
                            >
                              <Search className={`w-3.5 h-3.5 ${isIdentifyingPublic ? "animate-spin" : ""}`} />
                              <span>{isIdentifyingPublic ? "识别中..." : "识别公开主页"}</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-surface-subtle border border-border-default rounded-md text-[11px] text-text-tertiary space-y-1">
                          <span className="font-medium text-text-secondary block">示例输入：</span>
                          <p>1. https://www.xiaohongshu.com/user/profile/oscar_golden_family</p>
                          <p>2. oscar_golden_family</p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: 确认公开身份与配置 */}
                    {publicStep === 2 && detectedAccount && (
                      <div className="space-y-4">
                        <div className="p-4 bg-surface-subtle border border-border-default rounded-md">
                          <div className="text-[11px] text-text-tertiary mb-2 font-medium">识别到的公开主页</div>
                          <div className="flex items-center gap-3">
                            <img
                              src={detectedAccount.avatar}
                              alt={detectedAccount.nickname}
                              className="w-12 h-12 rounded-full object-cover border border-border-default shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-text-primary">
                                  {detectedAccount.nickname}
                                </span>
                                {detectedAccount.platformVerify && (
                                  <span className="text-[11px] text-text-secondary bg-white border border-border-default px-1.5 py-0.2 rounded-xs">
                                    {detectedAccount.platformVerify}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-text-tertiary font-mono mt-0.5">
                                ID: {detectedAccount.xhsId}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-text-tertiary mb-1">内部运营角色</label>
                            <select
                              value={formBusinessRole}
                              onChange={(e) => setFormBusinessRole(e.target.value as BusinessRole)}
                              className="w-full h-8 px-2.5 bg-surface border border-border-default rounded-md text-text-primary"
                            >
                              <option value="合作达人">合作达人</option>
                              <option value="素人KOC">素人KOC</option>
                              <option value="竞品观察">竞品观察</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] text-text-tertiary mb-1">负责人</label>
                            <input
                              type="text"
                              value={formOwner}
                              onChange={(e) => setFormOwner(e.target.value)}
                              className="w-full h-8 px-3 bg-surface border border-border-default rounded-md text-text-primary"
                            />
                          </div>
                        </div>

                        <div className="p-3.5 bg-surface-subtle border border-border-default rounded-md space-y-2.5">
                          <span className="text-[11px] font-medium text-text-secondary block">初始关联项目</span>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] text-text-tertiary mb-1">所属项目</label>
                              <select
                                value={formProjectName}
                                onChange={(e) => setFormProjectName(e.target.value)}
                                className="w-full h-7 px-2 text-xs bg-white border border-border-default rounded-md"
                              >
                                <option value="宠粮新客运营">宠粮新客运营</option>
                                <option value="全域品牌心智">全域品牌心智</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-text-tertiary mb-1">项目角色</label>
                              <input
                                type="text"
                                value={formProjectRole}
                                onChange={(e) => setFormProjectRole(e.target.value)}
                                className="w-full h-7 px-2 text-xs bg-white border border-border-default rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-3.5 border-t border-border-default bg-white flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    if (modalMode === "scan_creator") {
                      if (scanStep > 1) setScanStep((prev) => (prev - 1) as 1 | 2);
                      else setShowAddModal(false);
                    } else {
                      if (publicStep > 1) setPublicStep(1);
                      else setShowAddModal(false);
                    }
                  }}
                  className="h-8 px-3 text-xs text-text-secondary bg-surface hover:bg-surface-hover border border-border-default rounded-md transition-colors"
                >
                  {((modalMode === "scan_creator" && scanStep === 1) || (modalMode === "add_public" && publicStep === 1)) ? "取消" : "上一步"}
                </button>

                <div className="flex items-center gap-2">
                  {modalMode === "scan_creator" && scanStep === 1 && (
                    <button
                      onClick={handleSimulateScanSuccess}
                      className="h-8 px-3 text-xs text-text-secondary bg-surface hover:bg-surface-hover border border-border-default rounded-md"
                    >
                      检测登录状态
                    </button>
                  )}

                  {modalMode === "scan_creator" && scanStep === 2 && (
                    <button
                      onClick={() => setScanStep(3)}
                      className="h-8 px-3.5 text-xs font-medium text-white bg-action-primary hover:bg-action-primary-hover rounded-md flex items-center gap-1"
                    >
                      <span>下一步: 完善运营配置</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {modalMode === "scan_creator" && scanStep === 3 && (
                    <button
                      onClick={handleFinishAddAccount}
                      className="h-8 px-3.5 text-xs font-medium text-white bg-action-primary hover:bg-action-primary-hover rounded-md flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>保存并同步数据</span>
                    </button>
                  )}

                  {modalMode === "add_public" && publicStep === 2 && (
                    <button
                      onClick={handleFinishAddAccount}
                      className="h-8 px-3.5 text-xs font-medium text-white bg-action-primary hover:bg-action-primary-hover rounded-md flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>确认添加监控</span>
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
