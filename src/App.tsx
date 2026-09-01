import React, { useState, useEffect, useRef } from "react";
import { ProjectCenter } from "./components/merchant/ProjectCenter";
import { AccountAssetsV2 } from "./components/merchant/AccountAssetsV2";
import { BlueOcean } from "./components/merchant/BlueOcean";
import { SearchKeywordsExplorer } from "./components/merchant/SearchKeywordsExplorer";
import { TopicStrategy } from "./components/merchant/TopicStrategy";


import {
  Database,
  Zap,
  Sparkles,
  ArrowUp,
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpFromLine,
  LayoutGrid,
  Search,
  Star,
  FolderOpen,
  FolderKanban,
  Monitor,
  FileText,
  Download,
  Image as ImageIcon,
  Film,
  Music,
  Cloud,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  MoreVertical,
  History,
  Archive,
  Compass,
  Pin,
  MessageSquare,
  AtSign,
  LayoutTemplate,
  Trash2,
  Bot,
  TerminalSquare,
  RotateCw,
  RefreshCw,
  Hexagon,
  LogOut,
  Menu,
  ShoppingCart,
  Edit,
  User,
  Info,
  Cpu,
  Clock,
  CreditCard,
  Coins,
  GitBranch,
  BookOpen,
  DownloadCloud,
  Import,
  Lock,
  UploadCloud,
  ArrowUpRight,
  Component,
  Brain,
  Link2,
  FileBox,
  FileQuestion,
  Flame,
  CalendarDays,
  Workflow,
  Server,
  LineChart,
  Users,
  Settings,
  PlusCircle,
  Check,
  Play,
  FlaskConical,
  Lightbulb,
  Send,
  PenTool,
  Code,
  Share2,
  Target,
  BarChart2,
  AlertCircle,
  FileIcon,
  Filter,
  Layers,
  Orbit,
  Dna,
  ShieldHalf,
  ShieldCheck,
  Route,
  X,
  Gauge,
  Mic,
  ArrowRight,
  FolderPlus,
  ExternalLink,
  FileEdit,
  Folder,
  Share2 as ShareIcon,
  QrCode,
  Copy,
  Palette,
  HelpCircle,
  ArrowUpCircle,
  Bell,
  Gift,
  UserCircle,
  CheckCircle2,
  PanelLeftOpen,
  MoreHorizontal,
  Edit2,
CheckSquare, } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { SkillMarket } from "./components/SkillMarket";
import { DataCenter } from "./components/DataCenter";
import { MaterialStation } from "./components/MaterialStation";
import type { MaterialAsset } from "./components/material-center/types";
import { KnowledgeMemory } from "./components/KnowledgeMemory";
import { Billing } from "./components/Billing";
import { ServiceManagement } from "./components/ServiceManagement";
import { Workbench } from "./components/Workbench";
import { AccountSettings } from "./components/settings/AccountSettings";
import { MemorySettings } from "./components/settings/MemorySettings";
import { PersonalizationSettings } from "./components/settings/PersonalizationSettings";
import { SecuritySettings } from "./components/settings/SecuritySettings";

// Modular Merchant Components
import { SchemeManager } from "./components/merchant/SchemeManager";
import { StaffManager } from "./components/merchant/StaffManager";
import { AccountDetails } from "./components/merchant/AccountDetails";
import { MerchantManagement } from "./components/settings/MerchantManagement";
import { SearchTasksModal } from "./components/SearchTasksModal";
import { GrowthPlanModal } from "./components/GrowthPlanModal";
import { SwitchAccountModal } from "./components/SwitchAccountModal";
import { FinancePanelModal } from "./components/FinancePanelModal";
import { Logo } from "./components/Logo";

// 6 Rings Components
import { Strategy } from "./components/rings/Strategy";
import { ExecutionResult } from "./components/rings/ExecutionResult";
import { ExecutionCenter } from "./components/merchant/ExecutionCenter";
import { AIReview } from "./components/merchant/AIReview";
import { ReviewWorkbench } from "./components/merchant/ReviewCenter/ReviewWorkbench";
import { CRM } from "./components/rings/CRM";
import { ProjectReview } from "./components/rings/ProjectReview";
import { ProjectAssets } from "./components/rings/ProjectAssets";

import { SubagentChat } from "./components/SubagentChat";
import { ExecutionQueue } from "./components/ExecutionQueue";
import { MerchantMemoryHeader } from "./components/MerchantMemoryHeader";
import { ProjectSwitcherModal } from "./components/ProjectSwitcherModal";
import { CreateProjectModal } from "./components/CreateProjectModal";

// Existing Pages
import { InlineAIToolbar } from "./components/InlineAIToolbar";
import { buildIndustryProfile, getIndustryDefaults } from "./data/industryCatalog";

// --- Types & Config ---
interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string | React.ReactNode;
}

const LEGACY_INDUSTRY_IDS: Record<string, string> = {
  "宠物": "pet",
  "美妆": "beauty",
  "餐饮": "food_local",
  "本地生活": "food_local",
  "母婴": "maternal_baby",
  "家居": "home",
  "家装": "home",
};

function inferLegacyIndustryProfile(project: any) {
  const labels = [project?.industry, ...(project?.tags || [])].filter(Boolean).map(String);
  const primaryId = Object.entries(LEGACY_INDUSTRY_IDS).find(([label]) => (
    labels.some(value => value.includes(label))
  ))?.[1];
  return primaryId ? buildIndustryProfile(primaryId, [], []) : null;
}

const SHORTCUT_CATEGORIES = [
  {
    id: "common",
    name: "常用",
    icon: Star,
    items: [
      { text: "提取竞品核心痛点", type: "prompt" },
      { text: "下周三发5条护肤笔记，配上周图片", type: "prompt" },
      { text: "调用: KOC 分发引擎", type: "skill" },
    ],
  },
  {
    id: "content",
    name: "内容创作",
    icon: Filter,
    items: [
      { text: "网感改写", type: "prompt" },
      { text: "种草大纲", type: "prompt" },
    ],
  },
  {
    id: "workflow",
    name: "逻辑流程",
    icon: Route,
    items: [{ text: "RAG 洞察", type: "skill" }],
  },
  {
    id: "data",
    name: "流量归因",
    icon: Target,
    items: [
      { text: "分析爆文率", type: "prompt" },
      { text: "种草成本报表", type: "prompt" },
    ],
  },
];

const MOCK_PROJECTS: Record<string, any> = {
  "new-merchant": {
    id: "new-merchant",
    name: "新项目：待体验",
    initial: "新",
    color: "var(--neutral-100)",
    textColor: "var(--neutral-400)",
    fileTree: [],
    chatHistory: [],
  },
  "project-a": {
    id: "project-a",
    name: "商家A：宠物食品组",
    initial: "宠",
    color: "var(--primary-50)",
    textColor: "var(--primary-500)",
    tags: ["宠物食品", "幼犬冻干", "肠胃敏感人群"],
    targets: ["搜索卡位", "内容起量"],
    knowledge: ["品牌资料", "视觉和审核约束"],
    stats: {
      pendingLeads: 12,
      pendingContent: 5,
      profileCompleteness: 100,
    },
    fileTree: [
      {
        type: "Folder",
        name: "营销物料库 (云端)",
        children: [{ type: "File", name: "海报底图A.jpg" }],
      },
      {
        type: "Folder",
        name: "本地链接资料",
        children: [
          { type: "File", name: "通用全局规范.pdf" },
          { type: "RAG", name: "宠物标准话术.rag" },
        ],
      },
    ],
    chatHistory: [
      { id: "1", title: "执行技能助手: 竞品标题仿写", time: "30 分钟前" },
      { id: "2", title: "分析狗粮曝光数据", time: "1 小时前" },
    ],
  },
  "project-b": {
    id: "project-b",
    name: "商家B：美妆官号",
    initial: "美",
    color: "var(--danger-50)",
    textColor: "var(--danger-500)",
    tags: ["美妆", "洗护", "高优"],
    stats: {
      pendingLeads: 3,
      pendingContent: 12,
      profileCompleteness: 85,
    },
    fileTree: [
      {
        type: "Folder",
        name: "美妆图库",
        children: [{ type: "File", name: "口红试色图集.png" }],
      },
      {
        type: "Folder",
        name: "话术大纲",
        children: [
          { type: "RAG", name: "防敏感词过滤包.rag" },
          { type: "File", name: "竞品拆解.md" },
        ],
      },
    ],
    chatHistory: [{ id: "4", title: "短视频文案生成", time: "1 小时前" }],
  },
  "project-c": {
    id: "project-c",
    name: "新进商家：待配置",
    initial: "新",
    color: "var(--indigo-50)",
    textColor: "var(--indigo-600)",
    tags: ["母婴", "待启动"],
    stats: {
      pendingLeads: 0,
      pendingContent: 0,
      profileCompleteness: 20,
    },
    fileTree: [],
    chatHistory: [],
    isNew: true,
  },
  "project-archived": {
    id: "project-archived",
    name: "商家D：家装设计定制",
    initial: "装",
    color: "var(--neutral-100)",
    textColor: "var(--neutral-500)",
    tags: ["家装设计", "全案定制", "历史项目"],
    status: "archived",
    archivedAt: "2024-03-12",
    stats: {
      pendingLeads: 0,
      pendingContent: 0,
      profileCompleteness: 100,
    },
    fileTree: [],
    chatHistory: [],
  },
};

const SIDE_NAV_ITEMS = [
  {
    id: "workflow",
    name: "商家运营",
    icon: LayoutGrid,
  },
  {
    id: "materials",
    name: "素材中心",
    icon: ImageIcon,
  },
  {
    id: "knowledge",
    name: "知识与记忆",
    icon: BookOpen,
  },
  {
    id: "skills",
    name: "技能中心",
    icon: Zap,
  },
];

const PROJECT_HISTORY_ITEMS = [
  {
    id: "1",
    project: "宠粮新客运营",
    title: "小红书批量生成中",
    time: "1小时前",
    status: "running",
  },
  {
    id: "2",
    project: "宠粮新客运营",
    title: "昨日拉新复盘",
    time: "21小时前",
    status: "completed",
  },
  {
    id: "3",
    project: "宠粮新客运营",
    title: "帮我诊断一下现有的私域...",
    time: "9天前",
    status: "completed",
  },
  {
    id: "4",
    project: "美妆季卡提报",
    title: "双11大促素材规划",
    time: "20小时前",
    status: "completed",
  },
];

const PROJECT_TABS = [
  { id: "projects", name: "方案中心" },
  { id: "execution", name: "执行中心" },
  { id: "accounts", name: "账号资产" },
  { id: "review", name: "复盘与报告" },
];

export default function App() {
  const [merchantProjects, setMerchantProjects] =
    useState<Record<string, any>>(MOCK_PROJECTS);
  const [activeProjectId, setActiveProjectId] =
    useState<string>("project-a");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<{
    strategyKeywords: { word: string; rate: string }[];
    industry?: string;
    audience?: string;
    traps?: string;
    tone?: string;
  }>({
    strategyKeywords: [],
  });
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMerchantManagementOpen, setIsMerchantManagementOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("system");

  useEffect(() => {
    if (!messagesMap["project-a"]) {
      setMessagesMap({
        "project-a": [
          {
            id: "start-1",
            role: "agent",
            content: "您好，智能助手已就绪。正在分析您的 2024 夏季新品需求...",
          },
          {
            id: "start-2",
            role: "system",
            content:
              "「自动感知到任务包含小红书图文制作，后台已静默挂载专家技能 @AIGC_Creator/爆文逻辑蒸馏器」",
          },
          {
            id: "start-3",
            role: "agent",
            content:
              "由于这是高阶竞争赛道，我已经为您自动配置了行业专家的爆文模型。{recommend_skill_paid:爆文逻辑蒸馏器:50信用点/次:原创度提升 +42.5%}",
          },
        ],
        "new-merchant": [
          {
            id: "new-1",
            role: "agent",
            content: "欢迎加入！系统初始化完毕。",
          },
          {
            id: "new-2",
            role: "agent",
            content:
              "由于这是新项目，我建议按照工作台的“新手引导”三步走：从授权账号开始，我会带您发现本周的小红书爆文趋势。",
          },
          {
            id: "new-3",
            role: "agent",
            content:
              "如果您准备好了，请点击工作台上的「去授权主体」开始第一步。",
          },
        ],
      });
    }
  }, []);

  const activeProject =
    merchantProjects[activeProjectId] ||
    merchantProjects["project-a"] ||
    Object.values(merchantProjects)[0] ||
    {};
  const messages = messagesMap[activeProjectId] || [];
  const activeIndustryProfile = (activeProject as any).industryProfile
    || ((activeProject as any).isNew ? inferLegacyIndustryProfile(activeProject) : null);
  const activeIndustryDefaults = (activeProject as any).industryDefaults
    || (activeIndustryProfile ? getIndustryDefaults(activeIndustryProfile.primaryId) : null);
  const hasIndustryLaunchGuide = Boolean(
    (activeProject as any).isNew &&
    activeIndustryProfile &&
    activeIndustryDefaults,
  );
  const hasData = !(activeProject as any).isNew || hasIndustryLaunchGuide || onboardingStep >= 3;

  const handleArchiveProject = (projectId: string) => {
    setMerchantProjects((prev) => {
      const target = prev[projectId];
      if (!target) return prev;
      return {
        ...prev,
        [projectId]: {
          ...target,
          status: "archived",
          archivedAt: new Date().toISOString().split("T")[0],
        },
      };
    });

    if (activeProjectId === projectId) {
      const remainingActive = Object.values(merchantProjects).find(
        (p: any) => p.id !== projectId && p.id !== "new-merchant" && p.status !== "archived"
      ) as any;
      if (remainingActive) {
        setActiveProjectId(remainingActive.id);
      }
    }
  };

  const handleRestoreProject = (projectId: string) => {
    setMerchantProjects((prev) => {
      const target = prev[projectId];
      if (!target) return prev;
      return {
        ...prev,
        [projectId]: {
          ...target,
          status: "active",
          archivedAt: undefined,
        },
      };
    });
  };

  const handleAddMerchant = (newMerchant: any) => {
    if (!newMerchant?.id) return;
    setMerchantProjects((prev) => ({
      ...prev,
      [newMerchant.id]: newMerchant,
    }));
    setActiveProjectId(newMerchant.id);
    setActiveNav("workflow");
    setWorkflowTab("projects");
  };

  const handleUpdateMerchant = (merchantId: string, updates: Record<string, unknown>) => {
    setMerchantProjects((previous) => {
      const merchant = previous[merchantId];
      if (!merchant) return previous;
      return {
        ...previous,
        [merchantId]: {
          ...merchant,
          ...updates,
          lastModified: "刚刚",
        },
      };
    });
  };

  const handleFinishMerchantLaunchGuide = () => {
    setMerchantProjects((previous) => {
      const merchant = previous[activeProjectId];
      if (!merchant) return previous;
      return {
        ...previous,
        [activeProjectId]: {
          ...merchant,
          isNew: false,
          onboardingStatus: "completed",
        },
      };
    });
  };

  const setMessages = (setter: React.SetStateAction<Message[]>) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeProjectId]:
        typeof setter === "function"
          ? (setter as any)(prev[activeProjectId] || [])
          : setter,
    }));
  };

  const [inputValue, setInputValue] = useState("");
  const [showMentionMenu, setShowMentionMenu] = useState<
    "skill" | "agent" | null
  >(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeNav, setActiveNav] = useState("workflow");
  const [acceptedExecutionAssets, setAcceptedExecutionAssets] = useState<MaterialAsset[]>([]);
    useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail?.tab) {
        setWorkflowTab(e.detail.tab);
      }
    };
    window.addEventListener('nav-to-tab', handleNav);
    return () => window.removeEventListener('nav-to-tab', handleNav);
  }, []);

  const [workflowTab, setWorkflowTab] = useState<
    "projects" | "execution" | "accounts" | "review"
  >("projects");
  const [focusMode, setFocusMode] = useState<
    "normal" | "creation" | "monitoring" | "review"
  >("normal");
  const [showSubagentChat, setShowSubagentChat] = useState(false);
  const [activeSidebarMode, setActiveSidebarMode] = useState<"chat" | "queue">("chat");
  const [pendingExpert, setPendingExpert] = useState<string | undefined>();
  const [pendingContext, setPendingContext] = useState<string | undefined>();
  const [activeMission, setActiveMission] = useState<{
    type: string;
    payload: any;
  } | null>(null);

  useEffect(() => {
    if (activeNav === "workflow") {
      setIsChatSpaceExpanded(false);
    } else if (activeNav === "workbench") {
      setIsChatSpaceExpanded(true);
    }
  }, [activeNav]);

  useEffect(() => {
    const handleToFactory = (e: any) => {
      setActiveNav("workflow");
      setWorkflowTab("projects");
      setActiveMission({ type: "CONTENT_GEN", payload: e.detail });
    };
    const handleToStrategy = () => {
      setActiveNav("workflow");
      setWorkflowTab("projects");
    };
    const handleToTab = (e: any) => {
      setActiveNav("workflow");
      const targetTab = (e.detail?.tab === "strategy" || e.detail?.tab === "assets") ? "projects" : (e.detail?.tab || "projects");
      setWorkflowTab(targetTab);
    };
    const handleToFiles = () => {
      setActiveNav("files");
      setFilesTab("knowledge"); // switch to the knowledge total base directly
    };
    const handleToWorkbench = () => setActiveNav("workbench");

    const handleToMatrixCreate = () => {
      setActiveNav("workflow");
      setWorkflowTab("matrix");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("nav-to-create-project"));
      }, 50);
    };

    const handleCollapseSidebar = (e: any) => {
      if (e.detail && typeof e.detail.collapsed === "boolean") {
        setIsSidebarCollapsed(e.detail.collapsed);
      } else {
        setIsSidebarCollapsed(true);
      }
    };

    const handleOpenExpertApp = (e: any) => {
      const { expert, context, alternativesData } = e.detail || {};
      if (expert) setPendingExpert(expert);
      if (context) setPendingContext(context);
      if (alternativesData) {
        ((_: any) => {})(alternativesData);
      }
      setActiveSidebarMode("chat");
      setShowSubagentChat(true);
      setIsSidebarCollapsed(true);
    };

    const handleStartAction = (e: any) => {
      const { task } = e.detail || {};
      if (task) {
        setPendingExpert('操盘副手');
        setPendingContext(`【处理数据事件】对象：${task.title}建议动作：${task.aiActionText}请直接执行此动作，或给出进一步的调整建议。`);
        setActiveSidebarMode("chat");
        setShowSubagentChat(true);
        setIsSidebarCollapsed(true);
      } else {
        setActiveSidebarMode("queue");
        setShowSubagentChat(true);
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("nav-to-factory", handleToFactory);
    window.addEventListener("nav-to-strategy", handleToStrategy);
    window.addEventListener("nav-to-tab", handleToTab);
    window.addEventListener("nav-to-files", handleToFiles);
    window.addEventListener("nav-to-strategy-start", handleToWorkbench);
    window.addEventListener("nav-to-matrix-create", handleToMatrixCreate);
    window.addEventListener("collapse-sidebar", handleCollapseSidebar);
    window.addEventListener("open-expert", handleOpenExpertApp);
    window.addEventListener("start-ai-action", handleStartAction);
    const handleToSearchExplorer = () => {
      setActiveNav("search_explorer");
    };
    window.addEventListener("nav-to-search-explorer", handleToSearchExplorer);
    const handleToSkillCreate = () => {
      setActiveNav("skills");
      setCreatingSkill(true);
    };
    window.addEventListener("nav-to-skill-create", handleToSkillCreate);
    
    const handleToKnowledge = (e: any) => {
      setActiveNav("knowledge");
      if (e.detail) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("knowledge-navigate", { detail: e.detail }));
        }, 100);
      }
    };
    window.addEventListener("switch-to-knowledge", handleToKnowledge);

    return () => {
      window.removeEventListener("nav-to-factory", handleToFactory);
      window.removeEventListener("nav-to-strategy", handleToStrategy);
      window.removeEventListener("nav-to-tab", handleToTab);
      window.removeEventListener("nav-to-files", handleToFiles);
      window.removeEventListener("nav-to-strategy-start", handleToWorkbench);
      window.removeEventListener("nav-to-matrix-create", handleToMatrixCreate);
      window.removeEventListener("collapse-sidebar", handleCollapseSidebar);
      window.removeEventListener("open-expert", handleOpenExpertApp);
      window.removeEventListener("start-ai-action", handleStartAction);
      window.removeEventListener("switch-to-knowledge", handleToKnowledge);
      window.removeEventListener("nav-to-skill-create", handleToSkillCreate);
      window.removeEventListener("nav-to-search-explorer", handleToSearchExplorer);
    };
  }, []);

  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsProjectSelectorOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [skillMarketTab, setSkillMarketTab] = useState<string>("agent");
  const [creatingSkill, setCreatingSkill] = useState(false);
  const [filesTab, setFilesTab] = useState<"project" | "knowledge">("project");

  const [isUsagePopupOpen, setIsUsagePopupOpen] = useState(false);
  const [isGrowthPlanModalOpen, setIsGrowthPlanModalOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [isChatSpaceExpanded, setIsChatSpaceExpanded] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1279px)");
    const syncViewport = () => setIsCompactViewport(media.matches);
    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  const isGlobalNavCollapsed = isSidebarCollapsed || isCompactViewport;
  const [isSearchTasksModalOpen, setIsSearchTasksModalOpen] = useState(false);
  const [isTasksFilterDropdownOpen, setIsTasksFilterDropdownOpen] =
    useState(false);
  const [activeTaskFilterStatus, setActiveTaskFilterStatus] =
    useState("待处理");
  const [activeTaskFilterTime, setActiveTaskFilterTime] = useState("全部时间");

  const [userRole, setUserRole] = useState<"merchant" | "provider" | "creator">(
    "merchant",
  );
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isSwitchAccountModalOpen, setIsSwitchAccountModalOpen] =
    useState(false);
  const [activeProjectMenuId, setActiveProjectMenuId] = useState<string | null>(
    null,
  );
  const [activeSessionMenuId, setActiveSessionMenuId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".project-menu-container") &&
        !target.closest(".project-menu-trigger")
      ) {
        setActiveProjectMenuId(null);
      }
      if (
        !target.closest(".session-menu-container") &&
        !target.closest(".session-menu-trigger")
      ) {
        setActiveSessionMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const insertMention = (name: string, type: "@" | "/") => {
    let newVal;
    if (inputValue.endsWith("@"))
      newVal = inputValue.slice(0, -1) + `@${name} `;
    else if (inputValue.endsWith("/"))
      newVal = inputValue.slice(0, -1) + `/${name} `;
    else
      newVal =
        inputValue +
        (inputValue && !inputValue.endsWith(" ") ? " " : "") +
        `${type}${name} `;
    setInputValue(newVal);
    setShowMentionMenu(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.endsWith("@")) setShowMentionMenu("skill");
    else if (val.endsWith("/")) setShowMentionMenu("agent");
    else setShowMentionMenu(null);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const renderMessageContent = (content: string, role: string) => {
    const parts = content.split(
      /(@[\u4e00-\u9fa5a-zA-Z0-9_-]+)|(「(?:🔗|📄|📁|🧠|📦) [^」]+」)|({recommend_skill_paid:[^}]+})|({recommend_skill_free:[^}]+})/,
    );
    return parts.map((part, index) => {
      if (!part) return null;
      if (part.startsWith("@"))
        return (
          <span
            key={index}
            className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[13px] ${role === "user" ? "bg-btn-main text-white border border-primary-700" : "bg-brand-light text-brand-logo"}`}
          >
            <Component size={12} /> {part.substring(1)}
          </span>
        );
      if (part.startsWith("「")) {
        let icon = <FileBox size={12} />;
        if (part.startsWith("「🔗")) icon = <Link2 size={12} />;
        else if (part.startsWith("「📁")) icon = <FolderOpen size={12} />;
        else if (part.startsWith("「🧠")) icon = <Brain size={12} />;
        return (
          <span
            key={index}
            className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-[4px] text-[13px] border ${role === "user" ? "bg-neutral-800 text-neutral-200 border-neutral-700" : "bg-hover-bg text-text-secondary border-border-default"}`}
          >
            {icon} {part.slice(3, -1)}
          </span>
        );
      }

      if (part.startsWith("{recommend_skill_paid:")) {
        const [_, name, price, benefit] = part.replace("}", "").split(":");
        return (
          <div
            key={index}
            className="mt-5 mb-2 p-8 bg-neutral-0 border-2 border-primary-500/10 rounded-[32px] shadow-xl shadow-primary-500/5 relative overflow-hidden group"
          >
            <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <Orbit size={160} className="text-brand-logo" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-light rounded-[20px] flex items-center justify-center text-brand-logo">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-text-main tracking-tight">
                      🔔 助手决策建议
                    </h4>
                    <p className="text-[13px] text-text-tertiary font-extrabold uppercase tracking-widest mt-0.5 opacity-70">
                      关键优化动作
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-btn-main text-white text-[13px] rounded-xl uppercase tracking-widest shadow-sm">
                  付费技能
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[14px] text-text-secondary leading-relaxed px-1">
                  当前笔记原创度偏低，建议安装{" "}
                  <span className="text-brand-logo underline decoration-2 underline-offset-4">
                    「{name}」
                  </span>
                  。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-4 bg-page-bg rounded-xl border border-border-default/50 shadow-inner">
                    <span className="text-text-tertiary text-[13px] uppercase tracking-tighter">
                      💰 费用详情
                    </span>
                    <span className="text-text-main font-mono text-[13px]">
                      {price}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-brand-light rounded-xl border border-primary-100 shadow-inner">
                    <span className="text-text-tertiary text-[13px] uppercase tracking-tighter">
                      📈 预计提升
                    </span>
                    <span className="text-brand-logo font-mono text-[13px]">
                      {benefit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    const target = e.currentTarget;
                    target.disabled = true;
                    target.innerHTML =
                      '<span class="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></span>';
                    setTimeout(() => {
                      target.parentElement?.parentElement?.parentElement?.classList.add(
                        "opacity-70",
                        "bg-page-bg",
                      );
                      target.outerHTML =
                        '<div class="flex items-center gap-2 text-success-600 text-[13px] bg-success-50 px-6 py-3 rounded-xl border border-success-200 shadow-sm"><Check size={18}/> 技能已挂载并应用</div>';
                    }, 800);
                  }}
                  className="flex-1 px-8 py-4 bg-btn-main text-white rounded-xl text-[14px] shadow-lg shadow-neutral-200 hover:bg-btn-main hover:translate-y-[-2px] active:scale-95 transition-all text-center"
                >
                  安装并应用
                </button>
                <button className="px-6 py-4 bg-neutral-0 border border-border-default text-text-tertiary rounded-xl text-[14px] hover:text-text-main hover:border-neutral-300 transition-all">
                  忽略
                </button>
              </div>
            </div>
          </div>
        );
      }

      if (part.startsWith("{recommend_skill_free:")) {
        const [_, category, count, benefit] = part.replace("}", "").split(":");
        return (
          <div
            key={index}
            className="mt-5 mb-2 p-8 bg-neutral-0 border-2 border-dashed border-border-default rounded-[32px] relative overflow-hidden group hover:border-primary-500/20 transition-all"
          >
            <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Dna size={200} className="text-text-main" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-page-bg rounded-[20px] flex items-center justify-center text-text-tertiary border border-border-default group-hover:text-brand-logo group-hover:bg-brand-light transition-all">
                    <Filter size={24} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-text-main tracking-tight">
                      🔔 助手执行建议
                    </h4>
                    <p className="text-[13px] text-text-tertiary font-extrabold uppercase tracking-widest mt-0.5 opacity-70">
                      社区资源推荐
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-success-50 text-success-500 text-[13px] rounded-xl border border-success-100 uppercase tracking-widest shadow-sm">
                  🆓 免费
                </div>
              </div>

              <div className="space-y-4 mb-8 px-1">
                <p className="text-[14px] text-text-secondary leading-relaxed">
                  当前笔记原创度偏低，建议安装{" "}
                  <span className="text-text-main ">「{category}」</span>{" "}
                  类工具。
                  <br />
                  市场上已有{" "}
                  <span className="text-brand-logo underline underline-offset-2">
                    {count} 款
                  </span>{" "}
                  成熟可选资产。
                </p>
                <div className="flex items-center gap-3 text-text-tertiary text-[13px] bg-page-bg w-fit px-3 py-1.5 rounded-lg border border-border-default">
                  <Zap size={14} className="text-warning-500 fill-current" />
                  <span>📈 预期原创度提升 {benefit}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveNav("skills")}
                  className="flex-1 px-8 py-4 bg-neutral-0 border-2 border-neutral-900 text-text-main rounded-xl text-[14px] shadow-md hover:bg-btn-main hover:text-white transition-all text-center active:scale-95"
                >
                  去市场中查看
                </button>
              </div>
            </div>
          </div>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#f8f9fa] text-text-main font-sans overflow-hidden relative">
      <InlineAIToolbar />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-btn-main rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>
      {/* Global Command Bar Overlay */}
      <AnimatePresence>
        {isCommandBarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1000] bg-btn-main/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setIsCommandBarOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-surface-1 rounded-xl shadow-2xl border border-border-default overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-border-default flex items-center gap-4">
                <Search className="text-text-tertiary" size={24} />
                <input
                  autoFocus
                  placeholder="输入指令召唤助手 (例如: '给奈雪生成今日笔记', '分析 ROI')"
                  className="flex-1 bg-transparent border-none outline-none text-[18px] placeholder:text-neutral-300"
                />
              </div>
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[13px] text-text-tertiary uppercase tracking-widest">
                  快捷任务
                </div>
                <div className="space-y-1">
                  {[
                    {
                      icon: LayoutGrid,
                      label: "商家运营流: 快速创建",
                      sub: "基于策略开启新的运营流项目",
                    },
                    {
                      icon: Compass,
                      label: "选题策略: 收集竞品热词",
                      sub: "提取站内外最新高频热词",
                    },
                    {
                      icon: Sparkles,
                      label: "账号与分发: 安排发布",
                      sub: "将已完成素材分配至各个矩阵账号",
                    },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-4 p-3.5 hover:bg-page-bg relative overflow-hidden rounded-xl transition-all group group-hover:translate-x-1"
                    >
                      <div className="w-10 h-10 bg-page-bg rounded-xl flex items-center justify-center text-text-tertiary group-hover:bg-brand-light group-hover:text-brand-logo transition-all">
                        <item.icon size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-[14px] text-text-main">
                          {item.label}
                        </div>
                        <div className="text-[13px] text-text-tertiary font-medium">
                          {item.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectSwitcherModal
        isOpen={isProjectSelectorOpen}
        onClose={() => setIsProjectSelectorOpen(false)}
        projects={merchantProjects}
        activeProjectId={activeProjectId}
        onSelect={(id) => {
          setActiveProjectId(id);
          setIsProjectSelectorOpen(false);
        }}
        onManageMerchants={() => {
          setIsProjectSelectorOpen(false);
          setIsMerchantManagementOpen(true);
        }}
      />

      <AnimatePresence>
        {isMerchantManagementOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] bg-surface-1"
            role="dialog"
            aria-modal="true"
            aria-label="商家管理"
          >
            <button
              type="button"
              onClick={() => setIsMerchantManagementOpen(false)}
              className="absolute right-6 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-hover-bg text-text-tertiary transition-colors hover:bg-selected-bg hover:text-text-main"
              aria-label="关闭商家管理"
            >
              <X size={19} />
            </button>
            <div className="h-full overflow-hidden pb-7 pl-8 pr-24 pt-7">
              <MerchantManagement
                merchants={merchantProjects}
                activeMerchantId={activeProjectId}
                onAddMerchant={(merchant) => {
                  handleAddMerchant(merchant);
                  setIsMerchantManagementOpen(false);
                  setActiveNav("workflow");
                  setWorkflowTab("projects");
                }}
                onUpdateMerchant={handleUpdateMerchant}
                onArchiveMerchant={handleArchiveProject}
                onRestoreMerchant={handleRestoreProject}
                onOpenKnowledge={() => {
                  setIsMerchantManagementOpen(false);
                  setActiveNav("knowledge");
                }}
                onSwitchMerchant={(merchantId) => {
                  setActiveProjectId(merchantId);
                  setIsMerchantManagementOpen(false);
                  setActiveNav("workflow");
                  setWorkflowTab("projects");
                }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={(type) => {
          const newId = `project-${Date.now()}`;
          MOCK_PROJECTS[newId] = {
            id: newId,
            name: "未命名新项目",
            isNew: true,
            lastModified: "刚刚",
            agentStatus: "idle",
            role: "brand",
          };
          setActiveProjectId(newId);
          setIsCreateProjectModalOpen(false);
          // Optional: also switch tab to 'projects' or trigger some notification
        }}
      />

      {/* SaaS Nav Sidebar */}
      <div
        className={`${isGlobalNavCollapsed ? "w-[64px]" : "w-[256px]"} transition-[width] duration-200 ease-out bg-sidebar-bg border-r border-border-default flex flex-col shrink-0 h-full relative z-20 overflow-hidden`}
      >
        <div
          className={`h-14 flex items-center ${isGlobalNavCollapsed ? "justify-center" : "justify-between px-4"} tracking-tight text-text-main border-b border-transparent shrink-0`}
        >
          {!isGlobalNavCollapsed && (
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 shadow-sm rounded-[6px]" />
              <h1 className="text-[17px] font-semibold tracking-tight text-text-main uppercase mt-0.5">
                TapTik
              </h1>
              <span className="text-[13px] text-text-tertiary font-mono tracking-tight mt-1 ml-0.5">
                v1.5.7
              </span>
            </div>
          )}
          {isGlobalNavCollapsed && (
            <Logo className="w-7 h-7 shadow-sm rounded-[6px] mx-auto mt-2" />
          )}
          <div
            className={`flex items-center text-text-tertiary ${isGlobalNavCollapsed ? "flex-col gap-2 mt-2" : "gap-1.5"}`}
          >
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 hover:bg-surface-1 hover:shadow-sm rounded hover:text-text-main transition-all"
              title={isCompactViewport ? "窄窗口使用图标导航" : isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
              disabled={isCompactViewport}
            >
              {isGlobalNavCollapsed ? (
                <PanelLeftOpen size={16} />
              ) : (
                <PanelLeftClose size={16} />
              )}
            </button>
            {!isGlobalNavCollapsed && (
              <>
                <button
                  className="p-1 hover:bg-surface-1 hover:shadow-sm rounded hover:text-text-main transition-all"
                  title="搜索 (Cmd+K)"
                  onClick={() => setIsSearchTasksModalOpen(true)}
                >
                  <Search size={16} />
                </button>
                <div className="relative">
                  <button
                    className="p-1 hover:bg-surface-1 hover:shadow-sm rounded hover:text-text-main transition-all"
                    title="过滤器"
                    onClick={() =>
                      setIsTasksFilterDropdownOpen(!isTasksFilterDropdownOpen)
                    }
                  >
                    <Filter size={16} />
                  </button>
                  {isTasksFilterDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[100]"
                        onClick={() => setIsTasksFilterDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-surface-1 rounded-xl shadow-xl border border-border-default z-[101] py-2">
                        <div className="px-3 py-1.5 text-[13px] text-text-tertiary ">
                          筛选状态
                        </div>
                        {[
                          "全部状态",
                          "进行中",
                          "已完成",
                          "失败",
                          "待处理",
                          "规划中",
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setActiveTaskFilterStatus(status);
                              setIsTasksFilterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-[14px] flex items-center justify-between hover:bg-hover-bg transition-colors ${activeTaskFilterStatus === status ? "text-brand-logo bg-brand-light/50" : "text-text-main"}`}
                          >
                            {status}
                            {activeTaskFilterStatus === status && (
                              <Check size={14} />
                            )}
                          </button>
                        ))}
                        <div className="w-full h-px bg-border-default my-2" />
                        <div className="px-3 py-1.5 text-[13px] text-text-tertiary ">
                          筛选时间
                        </div>
                        {["全部时间", "今天", "最近 7 天", "最近 30 天"].map(
                          (time) => (
                            <button
                              key={time}
                              onClick={() => {
                                setActiveTaskFilterTime(time);
                                setIsTasksFilterDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-[14px] flex items-center justify-between hover:bg-hover-bg transition-colors ${activeTaskFilterTime === time ? "text-brand-logo bg-brand-light/50" : "text-text-main"}`}
                            >
                              {time}
                              {activeTaskFilterTime === time && (
                                <Check size={14} />
                              )}
                            </button>
                          ),
                        )}
                        <div className="w-full h-px bg-border-default my-2" />
                        <button
                          onClick={() => {
                            setActiveTaskFilterStatus("全部状态");
                            setActiveTaskFilterTime("全部时间");
                            setIsTasksFilterDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[14px] text-text-secondary hover:text-text-main hover:bg-hover-bg transition-colors"
                        >
                          重置筛选条件
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-3 py-3 cursor-pointer relative shrink-0">
          <button
            onClick={() => setIsProjectSelectorOpen(true)}
            title={isGlobalNavCollapsed ? activeProject.name : undefined}
            className={`w-full flex items-center ${isGlobalNavCollapsed ? "justify-center" : "justify-between px-2.5"} py-2 hover:bg-surface-1 rounded-xl text-sm text-text-main transition-colors border border-transparent bg-surface-1`}
          >
            <div
              className={`flex items-center gap-3 w-full justify-center ${isGlobalNavCollapsed ? "" : "justify-start"}`}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-[13px] shadow-sm shrink-0"
                style={{
                  backgroundColor: activeProject.color,
                  color: activeProject.textColor,
                }}
              >
                {activeProject.initial}
              </div>
              {!isGlobalNavCollapsed && (
                <span className="truncate max-w-[120px] text-[13px] text-text-main">
                  {activeProject.name}
                </span>
              )}
            </div>
            {!isGlobalNavCollapsed && (
              <div className="flex items-center gap-1.5 min-w-[32px] shrink-0">
                <span className="text-[13px] text-text-tertiary bg-border-default px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
                <ChevronDown size={14} className="text-text-tertiary shrink-0" />
              </div>
            )}
          </button>
        </div>

        <div
          className={`flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar flex flex-col ${isGlobalNavCollapsed ? "items-center" : ""}`}
        >
          <button
            onClick={() => setActiveNav("workbench")}
            title={isGlobalNavCollapsed ? "新对话" : undefined}
            className={`w-full flex items-center gap-3 ${isGlobalNavCollapsed ? "justify-center px-0 h-10 w-10 shrink-0" : "px-3 py-2.5"} relative overflow-hidden rounded-xl transition-colors group border border-transparent ${activeNav === "workbench" ? "bg-selected-bg text-text-main" : "hover:bg-hover-bg text-text-secondary"} mb-2`}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center bg-slate-800 text-white rounded-[6px] shrink-0 border border-slate-700 ${isGlobalNavCollapsed ? "mx-auto" : ""}`}
            >
              <Plus size={14} strokeWidth={3} />
            </div>
            {!isGlobalNavCollapsed && (
              <span className="text-[13px] ">新对话</span>
            )}
          </button>

          {SIDE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
              }}
              title={isGlobalNavCollapsed ? item.name : undefined}
              className={`w-full flex items-center gap-3 ${isGlobalNavCollapsed ? "justify-center px-0 h-10 w-10 shrink-0 mx-auto" : "px-3 py-2"} relative overflow-hidden rounded-xl transition-colors group border border-transparent ${activeNav === item.id ? "bg-selected-bg text-text-main " : "text-text-secondary hover:bg-hover-bg hover:text-text-main "}`}
            >
              {activeNav === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-brand-logo rounded-r-full" />}
              <item.icon
                size={16}
                strokeWidth={activeNav === item.id ? 2.5 : 2}
                className={`shrink-0 ${activeNav === item.id ? "text-text-main" : "text-text-tertiary group-hover:text-text-secondary"}`}
              />
              {!isGlobalNavCollapsed && (
                <span className="text-[13px]">{item.name}</span>
              )}
            </button>
          ))}



          <div className="border-t border-[#e9eaec] mt-6 pt-4 mb-2 w-full px-3">
            {!isGlobalNavCollapsed && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between group cursor-pointer hover:bg-border-default rounded-md py-1" onClick={() => setIsChatSpaceExpanded(!isChatSpaceExpanded)}>
                    <span className="text-[13px] text-text-secondary font-medium px-2 flex items-center gap-1">
                      {isChatSpaceExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} 对话空间
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsCreateProjectModalOpen(true); }}
                      className="hover:text-text-main text-text-tertiary p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="新建对话空间"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Project Item */}
                  {isChatSpaceExpanded && (
                  <div className="flex flex-col gap-0.5">
                    <div className="relative flex items-center justify-between px-2 py-2 rounded-lg bg-border-default/50 hover:bg-border-default cursor-pointer group/project text-text-main transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <ChevronDown
                          size={14}
                          className="text-text-tertiary shrink-0"
                        />
                        <Folder size={15} className="text-text-tertiary shrink-0" />
                        <span className="text-[13px] font-medium truncate">
                          New project
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/project:opacity-100 transition-opacity relative">
                        <button
                          className="text-text-tertiary hover:text-text-main p-1 project-menu-trigger"
                          title="更多"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProjectMenuId(
                              activeProjectMenuId === "new-project"
                                ? null
                                : "new-project",
                            );
                            setActiveSessionMenuId(null);
                          }}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        <button
                          className="text-text-tertiary hover:text-text-main p-1"
                          title="编辑"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Project Menu Dropdown */}
                        {activeProjectMenuId === "new-project" && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-surface-1 rounded-xl shadow-xl border border-slate-200 z-[100] flex flex-col py-1.5 text-text-main project-menu-container">
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-hover-bg transition-colors text-left w-full">
                              <Pin
                                size={14}
                                className="shrink-0 text-text-tertiary"
                              />{" "}
                              置顶项目
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-hover-bg transition-colors text-left w-full">
                              <FolderOpen
                                size={14}
                                className="shrink-0 text-text-tertiary"
                              />{" "}
                              在资源管理器中打开
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-hover-bg transition-colors text-left w-full">
                              <Edit2
                                size={14}
                                className="shrink-0 text-text-tertiary"
                              />{" "}
                              重命名项目
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-hover-bg transition-colors text-left w-full">
                              <Archive
                                size={14}
                                className="shrink-0 text-text-tertiary"
                              />{" "}
                              归档项目
                            </button>
                            <div className="h-px bg-border-default my-1 w-full" />
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-danger hover:bg-red-50 transition-colors text-left w-full">
                              <X size={14} className="shrink-0" /> 移除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sessions under project */}
                    <div className="flex flex-col ml-4 border-l border-slate-100 pl-2 mt-1 space-y-0.5">
                      {[
                        { id: 1, title: "Markdown文件访问认知" },
                        { id: 2, title: "聚光词查询" },
                        { id: 3, title: "Rust开发工程师工作经历" },
                        { id: 4, title: "与GPT5.5能力对比" },
                      ].map((session, i) => (
                        <div
                          key={session.id}
                          className={`relative flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group/session transition-colors ${i === 0 ? "bg-border-default text-text-main" : "hover:bg-hover-bg text-text-secondary hover:text-text-main"}`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-slate-300" : "bg-slate-200"}`}
                            />
                            <span className="text-[13px] truncate">
                              {session.title}
                            </span>
                          </div>
                          <div className="shrink-0 opacity-0 group-hover/session:opacity-100 transition-opacity relative">
                            <button
                              className="text-text-tertiary hover:text-text-secondary p-1 session-menu-trigger"
                              title="更多"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSessionMenuId(
                                  activeSessionMenuId === session.id
                                    ? null
                                    : session.id,
                                );
                                setActiveProjectMenuId(null);
                              }}
                            >
                              <MoreHorizontal size={14} />
                            </button>

                            {/* Session Menu Dropdown */}
                            {activeSessionMenuId === session.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-surface-1 rounded-xl shadow-xl border border-slate-200 z-[100] flex flex-col py-1.5 session-menu-container">
                                <div className="px-4 py-1.5 text-[13px] font-bold text-text-tertiary tracking-wider">沉淀为...</div>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <Database size={14} className="text-text-tertiary" /> 商家记忆
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <User size={14} className="text-text-tertiary" /> 我的记忆
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <FileText size={14} className="text-text-tertiary" /> 打法草稿
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <Lightbulb size={14} className="text-text-tertiary" /> 新项目方案
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <CheckSquare size={14} className="text-text-tertiary" /> 执行任务
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <BarChart2 size={14} className="text-text-tertiary" /> 数据看板
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <ImageIcon size={14} className="text-text-tertiary" /> 素材需求
                                </button>
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <Compass size={14} className="text-text-tertiary" /> 内容方向
                                </button>
                                <div className="h-px bg-border-default my-1 w-full" />
                                <button className="px-4 py-2 text-[13px] text-text-main hover:bg-hover-bg transition-colors text-left w-full flex items-center gap-2">
                                  <Archive size={14} className="text-text-tertiary" /> 归档
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`p-3 ${isGlobalNavCollapsed ? "px-1" : "p-4"} border-t border-border-default flex flex-col gap-1 bg-surface-1 relative z-[60] shrink-0`}
        >
          <div
            title={isGlobalNavCollapsed ? "18616306063" : undefined}
            className={`flex items-center gap-3 p-1 ${isGlobalNavCollapsed ? "justify-center" : "px-3"} py-2 cursor-pointer hover:bg-page-bg rounded-xl transition-colors`}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden border border-border-default">
              <Logo className="w-full h-full" />
            </div>
            {!isGlobalNavCollapsed && (
              <>
                <div className="hidden xl:flex flex-1 min-w-0 flex-col">
                  <p className="text-[14px] text-text-main truncate tracking-tight">
                    18616306063
                  </p>
                </div>
                <div className="hidden xl:flex items-center gap-1 shrink-0">
                  <button
                    className="text-text-tertiary hover:text-text-main p-1.5 rounded-md relative"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-btn-main rounded-full border border-white" />
                    <Bell size={16} />
                  </button>
                  <button
                    className="text-text-tertiary hover:text-text-main p-1.5 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Link2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>

          <AnimatePresence>
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed bottom-[76px] left-[12px] xl:left-[16px] w-[236px] xl:w-[248px] bg-surface-1 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-border-default z-[100] flex flex-col py-2"
                >
                  <div className="px-4 py-3 border-b border-border-default flex items-center gap-2">
                    <span className="text-[15px] text-text-main">
                      18616306063
                    </span>
                    <Copy
                      size={14}
                      className="text-text-tertiary cursor-pointer hover:text-text-secondary"
                    />
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <User size={16} />
                      体验版
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setActiveNav("billing");
                      }}
                      className="px-3 py-1 bg-btn-main text-white hover:bg-btn-main-hover transition-colors text-[13px] rounded-lg"
                    >
                      升级
                    </button>
                  </div>

                  <div className="h-[1px] bg-hover-bg my-1 mx-4" />

                  <div className="px-2 py-1 space-y-0.5">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-page-bg rounded-lg text-text-secondary transition-colors"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSettingsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3 text-[13px] ">
                        <Settings size={16} className="text-text-tertiary" />
                        设置
                      </div>
                    </button>
                    <div className="w-full flex items-center justify-between px-3 py-2 text-text-secondary">
                      <div className="flex items-center gap-3 text-[13px] ">
                        <Palette size={16} className="text-text-tertiary" />
                        外观
                      </div>
                      <div className="flex items-center bg-hover-bg p-0.5 rounded-lg border border-border-default">
                        <button className="px-3 py-1 text-[13px] bg-surface-1 shadow-sm rounded-md text-text-main">
                          浅色
                        </button>
                        <button className="px-3 py-1 text-[13px] text-text-tertiary hover:text-text-secondary">
                          深色
                        </button>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-page-bg rounded-lg text-text-secondary transition-colors">
                      <div className="flex items-center gap-3 text-[13px] ">
                        <HelpCircle size={16} className="text-text-tertiary" />
                        帮助与反馈
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-page-bg rounded-lg text-text-secondary transition-colors">
                      <div className="flex items-center gap-3 text-[13px] ">
                        <ArrowUpCircle size={16} className="text-text-tertiary" />
                        检查更新
                      </div>
                    </button>
                  </div>

                  <div className="h-[1px] bg-hover-bg my-1 mx-4" />

                  <div className="px-2 py-1 flex-1">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-page-bg rounded-lg text-text-secondary transition-colors text-[13px] "
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSwitchAccountModalOpen(true);
                      }}
                    >
                      <LogOut size={16} className="text-text-tertiary" />
                      切换账号
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex-1 min-w-0 h-full bg-surface-1 relative flex flex-col">
        {activeNav === "workbench" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Workbench
              setActiveNav={setActiveNav}
              setDataSubNav={() => {}}
              onboardingStep={onboardingStep}
              setOnboardingStep={setOnboardingStep}
              onboardingData={onboardingData}
              setOnboardingData={setOnboardingData}
              activeProjectId={activeProjectId}
            />
          </div>
        )}

        {/* 专注模式切换器 (仅在工作流模式显示) */}
        {activeNav === "workflow" && (
          <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-surface-1">
            {/* 商家记忆固定区域 */}
            <MerchantMemoryHeader
              hasData={hasData}
              onboardingData={onboardingData}
              activeProjectId={activeProjectId}
              projectName={activeProject?.name || "未知项目"}
              industryLabel={[
                activeIndustryProfile?.primaryName,
                ...(activeIndustryProfile?.secondaryNames || []),
                ...(activeIndustryProfile?.tertiaryNames || []),
              ].filter(Boolean).join(" · ")}
              setWorkflowTab={setWorkflowTab}
            />

            {/* 顶部导航与专注模式 */}
            <div className="h-13 border-b border-border-default flex items-center justify-between px-8 bg-surface-1 shrink-0 z-20">
              <div className="flex items-center gap-8 h-full">
                {PROJECT_TABS.map((tab) => {
                  const isLocked = !hasData;
                  const isActive = workflowTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (isLocked) {
                          return;
                        }
                        setWorkflowTab(tab.id as any);
                      }}
                      className={`relative h-full flex items-center gap-2 px-1 text-[14px] transition-all whitespace-nowrap cursor-pointer ${
                        isLocked
                          ? "opacity-50 cursor-not-allowed text-text-tertiary"
                          : isActive
                          ? "font-semibold text-text-main"
                          : "font-medium text-text-secondary hover:text-text-main"
                      }`}
                    >
                      <span>{tab.name}</span>
                      {isActive && !isLocked && (
                        <motion.div
                          layoutId="wfTab"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="flex-1 flex w-full overflow-hidden bg-[#fafafa] relative">
              <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-surface-1">
                {!hasData ? (
                  <div className="flex flex-col items-center justify-center h-full text-center bg-page-bg">
                    <div className="w-20 h-20 bg-hover-bg rounded-xl flex items-center justify-center text-neutral-300 mb-6 shadow-sm">
                      <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-text-main mb-2">
                      方案中心暂未解锁
                    </h3>
                    <p className="text-text-tertiary text-sm max-w-sm leading-relaxed mb-6">
                      该商家还在冷启动配置阶段。请先前往工作台，与智能搭档
                      完成基于对话的「商家画像基座建设」，以解锁后续的运营流水线。
                    </p>
                    <button
                      onClick={() => setActiveNav("workbench")}
                      className="px-8 py-3 bg-btn-main text-white rounded-xl text-[14px] hover:bg-btn-main shadow-xl shadow-neutral-200 transition-all active:scale-95"
                    >
                      去完善商家基座
                    </button>
                  </div>
                ) : (
                  <>
                    {workflowTab === "projects" && (
                      <ProjectCenter
                        hasData={hasData}
                        activeProjectId={activeProjectId}
                        merchantName={activeProject?.name}
                        isNewMerchant={hasIndustryLaunchGuide}
                        industryProfile={activeIndustryProfile || undefined}
                        industryDefaults={activeIndustryDefaults || undefined}
                        setWorkflowTab={setWorkflowTab as any}
                        onFinishLaunchGuide={handleFinishMerchantLaunchGuide}
                        onNavigateLaunchGuide={(target) => {
                          if (target === "profile") {
                            setActiveNav("workbench");
                            return;
                          }
                          if (target === "knowledge" || target === "materials") {
                            setActiveNav(target);
                            return;
                          }
                          setActiveNav("workflow");
                          if (target === "accounts" || target === "execution" || target === "review") {
                            setWorkflowTab(target);
                          }
                        }}
                      />
                    )}

                    {workflowTab === "execution" && (
                      <ExecutionCenter
                        onAssetsAccepted={(assets) => setAcceptedExecutionAssets(current => {
                          const nextIds = new Set(assets.map(asset => asset.id));
                          return [...assets, ...current.filter(asset => !nextIds.has(asset.id))];
                        })}
                      />
                    )}

                    {workflowTab === "review" && (
                      <ReviewWorkbench
                        onNavigateToExecution={() => setWorkflowTab("execution")}
                        onNavigateToPlan={() => setWorkflowTab("projects")}
                        onNavigateToSkills={() => setActiveNav("skills")}
                      />
                    )}
                    {workflowTab === "accounts" && <AccountAssetsV2 />}
                    {workflowTab === "blueocean" && <BlueOcean />}
                    {workflowTab === "topics" && <TopicStrategy />}
                  </>
                )}
              </div>

              {/* 智能搭档侧边栏 */}
              <AnimatePresence>
                {showSubagentChat &&
                  focusMode !== "review" &&
                  workflowTab !== "execution" && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 400, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="border-l border-border-default bg-surface-1 shadow-xl z-20 flex flex-col shrink-0"
                    >
                      {activeSidebarMode === "chat" ? (
                        <SubagentChat
                          moduleId={workflowTab}
                          moduleName={
                            PROJECT_TABS.find((t) => t.id === workflowTab)
                              ?.name || "业务助手"
                          }
                          initialExpert={pendingExpert}
                          initialContext={pendingContext}
                          onClose={() => {
                            setShowSubagentChat(false);
                            setPendingExpert(undefined);
                            setPendingContext(undefined);
                            ((_: any) => {})(undefined);
                          }}
                        />
                      ) : (
                        <ExecutionQueue
                          onClose={() => setShowSubagentChat(false)}
                        />
                      )}
                    </motion.div>
                  )}
              </AnimatePresence>

            </div>
          </div>
        )}

        {activeNav === "materials" && (
          <div className="flex-1 h-full overflow-hidden bg-page-bg flex flex-col">
            <MaterialStation
              activeProject={activeProject}
              importedAssets={acceptedExecutionAssets}
            />
          </div>
        )}
        {activeNav === "search_explorer" && (
          <div className="flex-1 h-full overflow-y-auto bg-page-bg">
            <SearchKeywordsExplorer activeProject={activeProject} />
          </div>
        )}
        {activeNav === "knowledge" && (
          <div className="flex-1 h-full overflow-hidden bg-page-bg flex flex-col">
            <KnowledgeMemory activeProject={activeProject} />
          </div>
        )}
        {activeNav === "skills" && (
          <div className="flex-1 h-full overflow-hidden bg-page-bg flex flex-col">
            <SkillMarket
              creatingSkill={creatingSkill}
              setCreatingSkill={setCreatingSkill}
              skillMarketTab={skillMarketTab}
              setSkillMarketTab={setSkillMarketTab}
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
            />
          </div>
        )}
        {activeNav === "billing" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-page-bg">
            <div className="flex-1 overflow-y-auto">
              <Billing />
            </div>
          </div>
        )}
        {activeNav === "settings" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-1">
            <div className="h-14 border-b border-border-default px-8 flex items-center justify-between shrink-0 bg-surface-1">
              <h2 className="text-[16px] font-semibold text-text-main tracking-tight">
                系统设置
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-12">
              <ServiceManagement />
            </div>
          </div>
        )}
      </div>

      

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[100] bg-surface-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-screen w-screen bg-surface-1 flex overflow-hidden relative"
              role="dialog"
              aria-modal="true"
              aria-label="TAPTIK 设置"
            >
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="absolute top-4 right-5 flex h-9 w-9 items-center justify-center text-text-tertiary hover:text-text-main bg-hover-bg hover:bg-selected-bg rounded-xl transition-colors z-10"
                aria-label="关闭设置"
              >
                <X size={18} />
              </button>

              <div className="w-[240px] bg-page-bg border-r border-border-default flex flex-col py-6 shrink-0">
                <div className="px-6 pb-5 border-b border-border-default">
                  <div className="text-[17px] font-semibold text-text-main">TAPTIK 设置</div>
                  <div className="mt-1 text-[13px] text-text-tertiary">账户与系统配置</div>
                </div>
                <div className="px-4 space-y-1 mt-5 overflow-y-auto">
                  {[
                    { id: "account", name: "账户管理", icon: User },
                    { id: "staff", name: "团队与协作", icon: Users },
                    { id: "system", name: "系统设置", icon: Settings },
                    { id: "agents", name: "智能体设置", icon: Bot },
                    { id: "memory", name: "记忆", icon: Brain },
                    { id: "models", name: "模型", icon: Cpu },
                    { id: "assistant", name: "助理设置", icon: UserCircle },
                    { id: "personalization", name: "个性化", icon: Palette },
                    { id: "data", name: "数据管理", icon: Database },
                    { id: "security", name: "安全中心", icon: ShieldCheck },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${activeSettingsTab === tab.id ? "bg-surface-1 text-text-main shadow-sm border border-border-default" : "text-text-secondary hover:bg-hover-bg"}`}
                    >
                      <tab.icon
                        size={16}
                        className={
                          activeSettingsTab === tab.id
                            ? "text-text-main"
                            : "text-text-tertiary"
                        }
                      />
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col bg-surface-1 overflow-hidden">
                <div className="h-[72px] shrink-0 border-b border-border-default px-9 flex items-center">
                <h2 className="text-[20px] font-semibold text-text-main">
                  {[
                    "account",
                    "staff",
                    "system",
                    "agents",
                    "memory",
                    "models",
                    "assistant",
                    "personalization",
                    "data",
                    "security",
                  ].includes(activeSettingsTab)
                    ? [
                        "账户管理",
                        "团队与协作",
                        "系统设置",
                        "智能体设置",
                        "记忆",
                        "模型",
                        "助理设置",
                        "个性化",
                        "数据管理",
                        "安全中心",
                      ][
                        [
                          "account",
                          "staff",
                          "system",
                          "agents",
                          "memory",
                          "models",
                          "assistant",
                          "personalization",
                          "data",
                          "security",
                        ].indexOf(activeSettingsTab)
                      ]
                    : "设置"}
                </h2>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-9 py-7">

                {activeSettingsTab === "account" && (
                  <div className="h-full">
                    <AccountSettings />
                  </div>
                )}

                {activeSettingsTab === "memory" && (
                  <div className="h-full">
                    <MemorySettings />
                  </div>
                )}

                {activeSettingsTab === "personalization" && (
                  <div className="h-full">
                    <PersonalizationSettings />
                  </div>
                )}

                {activeSettingsTab === "security" && (
                  <div className="h-full">
                    <SecuritySettings />
                  </div>
                )}

                {activeSettingsTab === "system" && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center justify-between pb-6 border-b border-border-default">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          显示语言
                        </h4>
                        <p className="text-[13px] text-text-tertiary">
                          设置应用程序界面的显示语言。
                        </p>
                      </div>
                      <select className="bg-surface-1 border border-border-default rounded-lg px-3 py-1.5 text-[13px] text-text-secondary outline-none">
                        <option>中文(简体)</option>
                        <option>English</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-4 pb-6 border-b border-border-default">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          字体大小
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 px-2">
                        <span className="text-[13px] text-text-tertiary">小</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="40"
                          className="flex-1 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[14px] text-text-tertiary">大</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-border-default">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          简洁模式
                        </h4>
                        <p className="text-[13px] text-text-tertiary mt-1">
                          开启后将简化对话界面显示，隐藏部分装饰元素。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-neutral-200 rounded-full cursor-pointer relative transition-colors shadow-inner">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-surface-1 rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-border-default">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          发送消息
                        </h4>
                        <p className="text-[13px] text-text-tertiary mt-1">
                          设置聊天输入框中发送消息的快捷键。
                        </p>
                      </div>
                      <select className="bg-surface-1 border border-border-default rounded-lg px-3 py-1.5 text-[13px] text-text-secondary outline-none">
                        <option>Enter</option>
                        <option>Ctrl + Enter</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-border-default">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          技能自动更新
                        </h4>
                        <p className="text-[13px] text-text-tertiary mt-1">
                          开启后将自动更新已安装的技能为最新版本，不会更新你在
                          TapTik 中编辑过的技能。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-btn-main rounded-full cursor-pointer relative transition-colors shadow-inner">
                        <div className="absolute left-5 top-1 w-4 h-4 bg-surface-1 rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-border-default">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          非高风险技能自动安装
                        </h4>
                        <p className="text-[13px] text-text-tertiary mt-1 max-w-[400px]">
                          上传技能后仍会显示安全检测过程；检测结果为非高风险时自动继续安装，高风险始终需要手动确认。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-btn-main rounded-full cursor-pointer relative transition-colors shadow-inner">
                        <div className="absolute left-5 top-1 w-4 h-4 bg-surface-1 rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-transparent">
                      <div>
                        <h4 className="text-[14px] font-semibold text-text-main mb-1">
                          锁屏远程
                        </h4>
                        <p className="text-[13px] text-text-tertiary mt-1">
                          开启后即使在锁屏状态下，电脑也不会进入休眠，屏幕也不会自动关闭，方便通过手机远程操控和保持自动化任务持续运行。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-neutral-200 rounded-full cursor-pointer relative transition-colors shadow-inner shrink-0">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-surface-1 rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>
                  </div>
                )}

                {!["system", "account", "memory", "personalization", "security"].includes(activeSettingsTab) && (
                  <div className="text-text-tertiary text-[13px] py-10">
                    此功能正在开发中...
                  </div>
                )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GrowthPlanModal
        isOpen={isGrowthPlanModalOpen}
        onClose={() => setIsGrowthPlanModalOpen(false)}
      />

      <SearchTasksModal
        isOpen={isSearchTasksModalOpen}
        onClose={() => setIsSearchTasksModalOpen(false)}
      />

      <SwitchAccountModal
        isOpen={isSwitchAccountModalOpen}
        onClose={() => setIsSwitchAccountModalOpen(false)}
        currentUserRole={userRole}
        onSwitchRole={setUserRole}
      />

      <FinancePanelModal
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        userRole={userRole}
      />
    </div>
  );
}
