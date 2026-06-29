import React, { useState, useEffect, useRef } from "react";
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
  Store,
  MoreHorizontal,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { SkillMarket } from "./components/SkillMarket";
import { DataCenter } from "./components/DataCenter";
import { MaterialStation } from "./components/MaterialStation";
import { KnowledgeMemory } from "./components/KnowledgeMemory";
import { AccountPublishing } from "./components/AccountPublishing";
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
import { ContentProduction } from "./components/rings/ContentProduction";
import { Publishing } from "./components/rings/Publishing";
import { Interaction } from "./components/rings/Interaction";
import { ExecutionCenter } from "./components/rings/ExecutionCenter";
import { CRM } from "./components/rings/CRM";
import { Metrics } from "./components/rings/Metrics";

import { SubagentChat } from "./components/SubagentChat";
import { ExecutionQueue } from "./components/ExecutionQueue";
import { MerchantMemoryHeader } from "./components/MerchantMemoryHeader";
import { ProjectSwitcherModal } from "./components/ProjectSwitcherModal";
import { CreateProjectModal } from "./components/CreateProjectModal";

// Existing Pages
import MerchantMatrix from "./pages/MerchantMatrix";
import { InlineAIToolbar } from "./components/InlineAIToolbar";

// --- Types & Config ---
interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string | React.ReactNode;
}

const SHORTCUT_CATEGORIES = [
  {
    id: "common",
    name: "常用",
    icon: Star,
    items: [
      { text: "提取竞品核心痛点", type: "prompt" },
      { text: "小红书笔记一键清洗", type: "prompt" },
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
        name: "本地上传资料",
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
};

const SIDE_NAV_ITEMS = [
  {
    id: "workflow",
    name: "商家运营",
    icon: LayoutGrid,
  },
  {
    id: "materials",
    name: "素材库",
    icon: ImageIcon,
  },
  {
    id: "knowledge",
    name: "知识与记忆",
    icon: BookOpen,
  },
  {
    id: "skills",
    name: "技能和专家",
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
  { id: "strategy", name: "操盘建议", icon: Compass },
  { id: "matrix", name: "项目与内容", icon: LayoutGrid },
  { id: "content", name: "账号与发布", icon: Sparkles },
  { id: "interaction", name: "协同任务", icon: MessageSquare },
  { id: "metrics", name: "数据与机会", icon: BarChart2 },
];

export default function App() {
  const [activeProjectId, setActiveProjectId] =
    useState<keyof typeof MOCK_PROJECTS>("project-a");
  const [showGlobalQueue, setShowGlobalQueue] = useState(false);
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
            content: "欢迎加入！我是您的 AI 增长伙伴。",
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

  const activeProject = MOCK_PROJECTS[activeProjectId];
  const messages = messagesMap[activeProjectId] || [];
  const hasData = !(activeProject as any).isNew || onboardingStep >= 3;

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
  const [workflowTab, setWorkflowTab] = useState<
    "strategy" | "matrix" | "content" | "execution" | "interaction" | "metrics"
  >("strategy");
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
    const handleToFactory = (e: any) => {
      setActiveNav("workflow");
      setWorkflowTab("content");
      setActiveMission({ type: "CONTENT_GEN", payload: e.detail });
    };
    const handleToStrategy = () => {
      setActiveNav("workflow");
      setWorkflowTab("strategy");
    };
    const handleToTab = (e: any) => {
      setActiveNav("workflow");
      setWorkflowTab(e.detail.tab);
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
        setPendingContext(`【处理数据事件】\n对象：${task.title}\n建议动作：${task.aiActionText}\n\n请直接执行此动作，或给出进一步的调整建议。`);
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
            className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[12px] ${role === "user" ? "bg-primary-500 text-white border border-primary-700" : "bg-primary-50 text-primary-500"}`}
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
            className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-[4px] text-[12px] border ${role === "user" ? "bg-neutral-800 text-neutral-200 border-neutral-700" : "bg-neutral-100 text-neutral-700 border-neutral-200"}`}
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
              <Orbit size={160} className="text-primary-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-[20px] flex items-center justify-center text-primary-500">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-neutral-900 tracking-tight">
                      🔔 助手决策建议
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5 opacity-70">
                      关键优化动作
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-primary-500 text-white text-[10px] rounded-xl uppercase tracking-widest shadow-sm">
                  付费技能
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[14px] text-neutral-600 leading-relaxed px-1">
                  当前笔记原创度偏低，建议安装{" "}
                  <span className="text-primary-500 underline decoration-2 underline-offset-4">
                    「{name}」
                  </span>
                  。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-4 bg-neutral-50 rounded-2xl border border-neutral-100/50 shadow-inner">
                    <span className="text-neutral-400 text-[10px] uppercase tracking-tighter">
                      💰 费用详情
                    </span>
                    <span className="text-neutral-900 font-mono text-[13px]">
                      {price}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-primary-50 rounded-2xl border border-primary-100 shadow-inner">
                    <span className="text-neutral-400 text-[10px] uppercase tracking-tighter">
                      📈 预计提升
                    </span>
                    <span className="text-primary-500 font-mono text-[13px]">
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
                        "bg-neutral-50/50",
                      );
                      target.outerHTML =
                        '<div class="flex items-center gap-2 text-success-600 text-[13px] bg-success-50 px-6 py-3 rounded-2xl border border-success-200 shadow-sm"><Check size={18}/> 技能已挂载并应用</div>';
                    }, 800);
                  }}
                  className="flex-1 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-[14px] shadow-lg shadow-neutral-200 hover:bg-primary-500 hover:translate-y-[-2px] active:scale-95 transition-all text-center"
                >
                  安装并应用
                </button>
                <button className="px-6 py-4 bg-neutral-0 border border-neutral-200 text-neutral-400 rounded-2xl text-[14px] hover:text-neutral-900 hover:border-neutral-300 transition-all">
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
            className="mt-5 mb-2 p-8 bg-neutral-0 border-2 border-dashed border-neutral-200 rounded-[32px] relative overflow-hidden group hover:border-primary-500/20 transition-all"
          >
            <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Dna size={200} className="text-neutral-900" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-50 rounded-[20px] flex items-center justify-center text-neutral-400 border border-neutral-100 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
                    <Filter size={24} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-neutral-900 tracking-tight">
                      🔔 助手执行建议
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5 opacity-70">
                      社区资源推荐
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-success-50 text-success-500 text-[10px] rounded-xl border border-success-100 uppercase tracking-widest shadow-sm">
                  🆓 免费
                </div>
              </div>

              <div className="space-y-4 mb-8 px-1">
                <p className="text-[14px] text-neutral-600 leading-relaxed">
                  当前笔记原创度偏低，建议安装{" "}
                  <span className="text-neutral-900 ">「{category}」</span>{" "}
                  类工具。
                  <br />
                  市场上已有{" "}
                  <span className="text-primary-500 underline underline-offset-2">
                    {count} 款
                  </span>{" "}
                  成熟可选资产。
                </p>
                <div className="flex items-center gap-3 text-neutral-500 text-[12px] bg-neutral-50/50 w-fit px-3 py-1.5 rounded-lg border border-neutral-100">
                  <Zap size={14} className="text-warning-500 fill-current" />
                  <span>📈 预期原创度提升 {benefit}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveNav("skills")}
                  className="flex-1 px-8 py-4 bg-neutral-0 border-2 border-neutral-900 text-neutral-900 rounded-2xl text-[14px] shadow-md hover:bg-neutral-900 hover:text-white transition-all text-center active:scale-95"
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
    <div className="flex h-[100dvh] w-full bg-[#f8f9fa] text-neutral-900 font-sans overflow-hidden relative">
      <InlineAIToolbar />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>
      {/* Global Command Bar Overlay */}
      <AnimatePresence>
        {isCommandBarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1000] bg-neutral-900/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setIsCommandBarOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-neutral-100 flex items-center gap-4">
                <Search className="text-neutral-400" size={24} />
                <input
                  autoFocus
                  placeholder="输入指令召唤助手 (例如: '给奈雪生成今日笔记', '分析 ROI')"
                  className="flex-1 bg-transparent border-none outline-none text-[18px] placeholder:text-neutral-300"
                />
              </div>
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[10px] text-neutral-400 uppercase tracking-widest">
                  快捷任务
                </div>
                <div className="space-y-1">
                  {[
                    {
                      icon: LayoutGrid,
                      label: "项目与内容: 开始生成",
                      sub: "基于项目策略批量挂机生成内容素材",
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
                      className="w-full flex items-center gap-4 p-3.5 hover:bg-neutral-50 rounded-2xl transition-all group group-hover:translate-x-1"
                    >
                      <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                        <item.icon size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-[14px] text-neutral-800">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-medium">
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
        projects={MOCK_PROJECTS}
        activeProjectId={activeProjectId}
        onSelect={(id) => {
          setActiveProjectId(id as keyof typeof MOCK_PROJECTS);
          setIsProjectSelectorOpen(false);
        }}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />

      {/* SaaS Nav Sidebar */}
      <div
        className={`${isSidebarCollapsed ? "w-[68px]" : "w-[240px]"} transition-all duration-300 bg-[#f7f8fa] border-r border-[#e9eaec] flex flex-col shrink-0 h-full relative z-20 overflow-hidden`}
      >
        <div
          className={`h-14 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between px-4"} tracking-tight text-neutral-900 border-b border-transparent shrink-0`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 shadow-sm rounded-[6px]" />
              <h1 className="text-[17px] font-semibold tracking-tight text-slate-800 uppercase mt-0.5">
                TapTik
              </h1>
              <span className="text-[11px] text-slate-400 font-mono tracking-tight mt-1 ml-0.5">
                v1.5.7
              </span>
            </div>
          )}
          {isSidebarCollapsed && (
            <Logo className="w-7 h-7 shadow-sm rounded-[6px] mx-auto mt-2" />
          )}
          <div
            className={`flex items-center text-slate-400 ${isSidebarCollapsed ? "flex-col gap-2 mt-2" : "gap-1.5"}`}
          >
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 hover:bg-white hover:shadow-sm rounded hover:text-slate-700 transition-all"
              title={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen size={16} />
              ) : (
                <PanelLeftClose size={16} />
              )}
            </button>
            {!isSidebarCollapsed && (
              <>
                <button
                  className="p-1 hover:bg-white hover:shadow-sm rounded hover:text-slate-700 transition-all"
                  title="搜索 (Cmd+K)"
                  onClick={() => setIsSearchTasksModalOpen(true)}
                >
                  <Search size={16} />
                </button>
                <div className="relative">
                  <button
                    className="p-1 hover:bg-white hover:shadow-sm rounded hover:text-slate-700 transition-all"
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
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 z-[101] py-2">
                        <div className="px-3 py-1.5 text-[12px] text-slate-400 ">
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
                            className={`w-full text-left px-4 py-2 text-[14px] flex items-center justify-between hover:bg-slate-50 transition-colors ${activeTaskFilterStatus === status ? "text-primary-500 bg-primary-50/50" : "text-slate-700"}`}
                          >
                            {status}
                            {activeTaskFilterStatus === status && (
                              <Check size={14} />
                            )}
                          </button>
                        ))}
                        <div className="w-full h-px bg-slate-100 my-2" />
                        <div className="px-3 py-1.5 text-[12px] text-slate-400 ">
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
                              className={`w-full text-left px-4 py-2 text-[14px] flex items-center justify-between hover:bg-slate-50 transition-colors ${activeTaskFilterTime === time ? "text-primary-500 bg-primary-50/50" : "text-slate-700"}`}
                            >
                              {time}
                              {activeTaskFilterTime === time && (
                                <Check size={14} />
                              )}
                            </button>
                          ),
                        )}
                        <div className="w-full h-px bg-slate-100 my-2" />
                        <button
                          onClick={() => {
                            setActiveTaskFilterStatus("全部状态");
                            setActiveTaskFilterTime("全部时间");
                            setIsTasksFilterDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[14px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
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
            title={isSidebarCollapsed ? activeProject.name : undefined}
            className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between px-2.5"} py-2 hover:bg-white hover:shadow-sm rounded-xl text-sm text-slate-700 transition-all border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-white`}
          >
            <div
              className={`flex items-center gap-3 w-full justify-center ${isSidebarCollapsed ? "" : "xl:justify-start"}`}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-[10px] shadow-sm shrink-0"
                style={{
                  backgroundColor: activeProject.color,
                  color: activeProject.textColor,
                }}
              >
                {activeProject.initial}
              </div>
              {!isSidebarCollapsed && (
                <span className="truncate max-w-[120px] text-[13px] text-slate-800">
                  {activeProject.name}
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-1.5 min-w-[32px] shrink-0">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
              </div>
            )}
          </button>
        </div>

        <div
          className={`flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar flex flex-col ${isSidebarCollapsed ? "items-center" : ""}`}
        >
          <button
            onClick={() => setActiveNav("workbench")}
            title={isSidebarCollapsed ? "新建任务" : undefined}
            className={`w-full flex items-center gap-3 ${isSidebarCollapsed ? "justify-center px-0 h-10 w-10 shrink-0" : "px-3 py-2.5"} rounded-xl transition-all group border border-transparent ${activeNav === "workbench" ? "bg-white text-slate-900 shadow-sm" : "hover:bg-white hover:shadow-sm text-slate-700"} mb-2`}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center bg-slate-800 text-white rounded-[6px] shrink-0 shadow-sm border border-slate-700 ${isSidebarCollapsed ? "mx-auto" : ""}`}
            >
              <Plus size={14} strokeWidth={3} />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-[13px] ">新建任务</span>
            )}
          </button>

          {SIDE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              title={isSidebarCollapsed ? item.name : undefined}
              className={`w-full flex items-center gap-3 ${isSidebarCollapsed ? "justify-center px-0 h-10 w-10 shrink-0 mx-auto" : "px-3 py-2"} rounded-xl transition-all group border border-transparent ${activeNav === item.id ? "bg-white text-slate-900 shadow-sm " : "text-slate-600 hover:bg-white/60 hover:text-slate-900 "}`}
            >
              <item.icon
                size={16}
                strokeWidth={activeNav === item.id ? 2.5 : 2}
                className={`shrink-0 ${activeNav === item.id ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              {!isSidebarCollapsed && (
                <span className="text-[13px]">{item.name}</span>
              )}
            </button>
          ))}

          <div className="border-t border-[#e9eaec] mt-6 pt-4 mb-2 w-full px-3">
            {!isSidebarCollapsed && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between group">
                    <span className="text-[12px] text-slate-500 font-medium px-2">
                      项目
                    </span>
                    <button
                      onClick={() => setIsCreateProjectModalOpen(true)}
                      className="hover:text-slate-700 text-slate-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="新建项目"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Project Item */}
                  <div className="flex flex-col gap-0.5">
                    <div className="relative flex items-center justify-between px-2 py-2 rounded-lg bg-slate-100/50 hover:bg-slate-100 cursor-pointer group/project text-slate-800 transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <ChevronDown
                          size={14}
                          className="text-slate-400 shrink-0"
                        />
                        <Folder size={15} className="text-slate-400 shrink-0" />
                        <span className="text-[13px] font-medium truncate">
                          New project
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/project:opacity-100 transition-opacity relative">
                        <button
                          className="text-slate-400 hover:text-slate-700 p-1 project-menu-trigger"
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
                          className="text-slate-400 hover:text-slate-700 p-1"
                          title="编辑"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Project Menu Dropdown */}
                        {activeProjectMenuId === "new-project" && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] flex flex-col py-1.5 text-slate-700 project-menu-container">
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-slate-50 transition-colors text-left w-full">
                              <Pin
                                size={14}
                                className="shrink-0 text-slate-400"
                              />{" "}
                              置顶项目
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-slate-50 transition-colors text-left w-full">
                              <FolderOpen
                                size={14}
                                className="shrink-0 text-slate-400"
                              />{" "}
                              在资源管理器中打开
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-slate-50 transition-colors text-left w-full">
                              <Edit2
                                size={14}
                                className="shrink-0 text-slate-400"
                              />{" "}
                              重命名项目
                            </button>
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-slate-50 transition-colors text-left w-full">
                              <Archive
                                size={14}
                                className="shrink-0 text-slate-400"
                              />{" "}
                              归档项目
                            </button>
                            <div className="h-px bg-slate-100 my-1 w-full" />
                            <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left w-full">
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
                          className={`relative flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group/session transition-colors ${i === 0 ? "bg-slate-100 text-slate-800" : "hover:bg-slate-50 text-slate-500 hover:text-slate-700"}`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-slate-300" : "bg-slate-200"}`}
                            />
                            <span className="text-[12px] truncate">
                              {session.title}
                            </span>
                          </div>
                          <div className="shrink-0 opacity-0 group-hover/session:opacity-100 transition-opacity relative">
                            <button
                              className="text-slate-400 hover:text-slate-600 p-1 session-menu-trigger"
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
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] flex flex-col py-1.5 session-menu-container">
                                <button className="px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left w-full">
                                  打开会话
                                </button>
                                <button className="px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left w-full">
                                  分享对话
                                </button>
                                <button className="px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left w-full">
                                  沉淀为 Skill
                                </button>
                                <button className="px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left w-full mt-1 pt-2 border-t border-slate-100">
                                  删除
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`p-3 ${isSidebarCollapsed ? "px-1" : "xl:p-4"} border-t border-neutral-100 flex flex-col gap-1 bg-white relative z-[60] shrink-0`}
        >
          <div
            title={isSidebarCollapsed ? "18616306063" : undefined}
            className={`flex items-center gap-3 p-1 ${isSidebarCollapsed ? "justify-center" : "xl:px-3"} py-2 cursor-pointer hover:bg-neutral-50 rounded-xl transition-colors`}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden border border-neutral-100">
              <Logo className="w-full h-full" />
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="hidden xl:flex flex-1 min-w-0 flex-col">
                  <p className="text-[14px] text-neutral-900 truncate tracking-tight">
                    18616306063
                  </p>
                </div>
                <div className="hidden xl:flex items-center gap-1 shrink-0">
                  <button
                    className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-md relative"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full border border-white" />
                    <Bell size={16} />
                  </button>
                  <button
                    className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-md"
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
                  className="fixed bottom-[76px] left-[12px] xl:left-[16px] w-[236px] xl:w-[248px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-200 z-[100] flex flex-col py-2"
                >
                  <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2">
                    <span className="text-[15px] text-neutral-900">
                      18616306063
                    </span>
                    <Copy
                      size={14}
                      className="text-neutral-400 cursor-pointer hover:text-neutral-600"
                    />
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] text-neutral-700">
                      <User size={16} />
                      体验版
                    </div>
                    <span className="px-3 py-1 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-[11px] rounded-lg cursor-pointer">
                      升级
                    </span>
                  </div>

                  <div className="px-4 pb-3">
                    <div className="rounded-xl border border-neutral-200 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                      <div className="bg-primary-500 text-white px-3 py-2 flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <Logo className="w-full h-full rounded-sm" />
                        </div>
                        <span className="text-[12px] tracking-tight">
                          Taptik 探索站
                        </span>
                        <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md text-white">
                          2期·今日结束
                        </span>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="text-[13px] mb-2 text-neutral-900">
                          本期: 资料库 乐享知识库
                        </div>
                        <div className="text-[11px] text-neutral-500 space-y-0.5 mb-3">
                          <p>每日可领 150 通用积分</p>
                          <p>本期已领 4 天 · 累计 600 通用积分</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-neutral-100 text-neutral-400 text-[12px] py-1.5 rounded-lg border border-transparent cursor-not-allowed">
                            今日已领
                          </button>
                          <button className="flex-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 text-[12px] py-1.5 rounded-lg transition-colors">
                            体验乐享 →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-1 space-y-0.5">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 group transition-colors"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsFinanceModalOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3 text-[13px] ">
                        <Sparkles
                          size={16}
                          className="text-neutral-500 group-hover:text-red-500"
                        />
                        {userRole === "merchant" ? "积分余额" : "收益中心"}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[12px] text-neutral-500">
                          {userRole === "merchant" ? "3,056.44" : "¥ 12,500.00"}
                        </span>
                        <ChevronRight size={14} className="text-neutral-400" />
                      </div>
                    </button>
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 group transition-colors"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsGrowthPlanModalOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3 text-[13px] ">
                        <CheckCircle2
                          size={16}
                          className="text-neutral-500 group-hover:text-red-500"
                        />
                        成长计划
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[12px] text-neutral-500"></span>
                        <ChevronRight size={14} className="text-neutral-400" />
                      </div>
                    </button>
                  </div>

                  <div className="h-[1px] bg-neutral-100 my-1 mx-4" />

                  <div className="px-2 py-1 space-y-0.5">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSettingsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3 text-[13px] ">
                        <Settings size={16} className="text-neutral-500" />
                        设置
                      </div>
                    </button>
                    <div className="w-full flex items-center justify-between px-3 py-2 text-neutral-700">
                      <div className="flex items-center gap-3 text-[13px] ">
                        <Palette size={16} className="text-neutral-500" />
                        外观
                      </div>
                      <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                        <button className="px-3 py-1 text-[11px] bg-white shadow-sm rounded-md text-neutral-900">
                          浅色
                        </button>
                        <button className="px-3 py-1 text-[11px] text-neutral-500 hover:text-neutral-700">
                          深色
                        </button>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors">
                      <div className="flex items-center gap-3 text-[13px] ">
                        <HelpCircle size={16} className="text-neutral-500" />
                        帮助与反馈
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors">
                      <div className="flex items-center gap-3 text-[13px] ">
                        <ArrowUpCircle size={16} className="text-neutral-500" />
                        检查更新
                      </div>
                    </button>
                  </div>

                  <div className="h-[1px] bg-neutral-100 my-1 mx-4" />

                  <div className="px-2 py-1 flex-1">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors text-[13px] "
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSwitchAccountModalOpen(true);
                      }}
                    >
                      <LogOut size={16} className="text-neutral-500" />
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
      <div className="flex-1 min-w-0 h-full bg-white relative flex flex-col">
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
          <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-white">
            {/* 商家记忆固定区域 */}
            <MerchantMemoryHeader
              hasData={hasData}
              onboardingData={onboardingData}
              activeProjectId={activeProjectId}
              projectName={activeProject?.name || "未知项目"}
              setWorkflowTab={setWorkflowTab}
            />

            {/* 顶部导航与专注模式 */}
            <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm z-20">
              <div className="flex items-center gap-10">
                {PROJECT_TABS.map((tab) => {
                  const isLocked = !hasData;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (isLocked) {
                          return;
                        }
                        setWorkflowTab(tab.id as any);
                      }}
                      className={`flex items-center gap-2 px-1 py-4 text-[13px] transition-all relative group ${isLocked ? "opacity-50 cursor-not-allowed" : workflowTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
                    >
                      {isLocked ? (
                        <Lock size={14} className="text-neutral-300" />
                      ) : (
                        <tab.icon
                          size={16}
                          className={
                            workflowTab === tab.id
                              ? "text-primary-500"
                              : "text-neutral-300"
                          }
                        />
                      )}
                      <span>{tab.name}</span>
                      {workflowTab === tab.id && !isLocked && (
                        <motion.div
                          layoutId="wfTab"
                          className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-neutral-900 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setShowGlobalQueue(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors"
                >
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  <span className="text-[12px] font-bold">待处理 9</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex w-full overflow-hidden bg-[#fafafa] relative">
              <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-white">
                {!hasData ? (
                  <div className="flex flex-col items-center justify-center h-full text-center bg-neutral-50/50">
                    <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center text-neutral-300 mb-6 shadow-sm">
                      <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      项目中心暂未解锁
                    </h3>
                    <p className="text-neutral-500 text-sm max-w-sm leading-relaxed mb-6">
                      该商家还在冷启动配置阶段。请先前往工作台，与 AI
                      完成基于对话的「商家画像基座建设」，以解锁后续的运营流水线。
                    </p>
                    <button
                      onClick={() => setActiveNav("workbench")}
                      className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-[14px] hover:bg-primary-500 shadow-xl shadow-neutral-200 transition-all active:scale-95"
                    >
                      去完善商家基座
                    </button>
                  </div>
                ) : (
                  <>
                    {workflowTab === "strategy" && (
                      <Strategy
                        hasData={hasData}
                        strategyData={onboardingData.strategyKeywords}
                      />
                    )}

                    {workflowTab === "matrix" && <MerchantMatrix />}

                    {workflowTab === "content" && (
                      <AccountPublishing />
                    )}

                    {workflowTab === "interaction" && (
                      <Interaction hasData={hasData} />
                    )}

                    {workflowTab === "metrics" && <Metrics />}
                  </>
                )}
              </div>

              {/* 环境感知 AI 搭档侧边栏 */}
              <AnimatePresence>
                {showSubagentChat &&
                  focusMode !== "review" &&
                  workflowTab !== "matrix" && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 400, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="border-l border-neutral-100 bg-white shadow-xl z-20 flex flex-col shrink-0"
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

              {!showSubagentChat &&
                focusMode !== "review" &&
                workflowTab !== "matrix" && (
                  <button
                    onClick={() => {
                      setActiveSidebarMode("chat");
                      setShowSubagentChat(true);
                    }}
                    className="absolute right-6 bottom-6 w-12 h-12 bg-neutral-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-primary-500 transition-all z-30 active:scale-95"
                  >
                    <Bot size={20} />
                  </button>
                )}
            </div>
          </div>
        )}

        {activeNav === "materials" && (
          <MaterialStation activeProject={activeProject} />
        )}
        {activeNav === "knowledge" && (
          <KnowledgeMemory activeProject={activeProject} />
        )}
        {activeNav === "skills" && (
          <SkillMarket
            creatingSkill={creatingSkill}
            setCreatingSkill={setCreatingSkill}
            skillMarketTab={skillMarketTab}
            setSkillMarketTab={setSkillMarketTab}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
          />
        )}
        {activeNav === "billing" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
            <div className="h-14 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white">
              <h2 className="text-[16px] font-semibold text-neutral-900 tracking-tight">
                用量与计费
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-12">
              <Billing />
            </div>
          </div>
        )}
        {activeNav === "settings" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            <div className="h-14 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white">
              <h2 className="text-[16px] font-semibold text-neutral-900 tracking-tight">
                系统设置
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-12">
              <ServiceManagement />
            </div>
          </div>
        )}
      </div>

      {/* Global Queue Drawer */}
      <AnimatePresence>
        {showGlobalQueue && (
          <div
            className="fixed inset-0 bg-neutral-900/20 z-50 flex justify-end"
            onClick={() => setShowGlobalQueue(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-1/2 bg-white h-full shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 text-[16px]">
                  全局待处理队列
                </h3>
                <button
                  onClick={() => setShowGlobalQueue(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full"
                >
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div
                  className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => {
                    setShowGlobalQueue(false);
                    setWorkflowTab("execution");
                  }}
                >
                  <div className="font-medium">内容待确认</div>
                  <div className="text-[20px] font-bold">3</div>
                </div>
                <div
                  className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => {
                    setShowGlobalQueue(false);
                    setWorkflowTab("execution");
                  }}
                >
                  <div className="font-medium">素材待补齐</div>
                  <div className="text-[20px] font-bold">4</div>
                </div>
                <div
                  className="bg-indigo-50 text-indigo-700 p-4 rounded-xl border border-indigo-100 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => {
                    setShowGlobalQueue(false);
                    setWorkflowTab("execution");
                  }}
                >
                  <div className="font-medium">内部任务待派发</div>
                  <div className="text-[20px] font-bold">2</div>
                </div>
                <div
                  className="bg-indigo-50 text-indigo-700 p-4 rounded-xl border border-indigo-100 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => {
                    setShowGlobalQueue(false);
                    setWorkflowTab("execution");
                  }}
                >
                  <div className="font-medium">外部入口待生成</div>
                  <div className="text-[20px] font-bold">3</div>
                </div>
                <div
                  className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100 flex items-center justify-between cursor-pointer hover:bg-rose-100 transition-colors"
                  onClick={() => {
                    setShowGlobalQueue(false);
                    setWorkflowTab("interaction");
                  }}
                >
                  <div className="font-medium">素材待验收</div>
                  <div className="text-[20px] font-bold">2</div>
                </div>
                <div
                  className="bg-purple-50 text-purple-700 p-4 rounded-xl border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => {
                    setShowGlobalQueue(false);
                    setWorkflowTab("interaction");
                  }}
                >
                  <div className="font-medium">客户审核待回收</div>
                  <div className="text-[20px] font-bold">1</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[900px] h-[650px] bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-neutral-100 relative"
            >
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="w-[200px] bg-neutral-50/50 border-r border-neutral-100 flex flex-col py-6">
                <div className="px-4 space-y-1 mt-4">
                  {[
                    { id: "account", name: "账户管理", icon: User },
                    { id: "merchants", name: "商家管理", icon: Store },
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
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${activeSettingsTab === tab.id ? "bg-white text-neutral-900 shadow-sm border border-neutral-200" : "text-neutral-600 hover:bg-neutral-100"}`}
                    >
                      <tab.icon
                        size={16}
                        className={
                          activeSettingsTab === tab.id
                            ? "text-neutral-900"
                            : "text-neutral-500"
                        }
                      />
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white p-8 overflow-y-auto">
                <h2 className="text-[20px] font-semibold text-neutral-900 mb-8">
                  {[
                    "account",
                    "merchants",
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
                        "商家管理",
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
                          "merchants",
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

                {activeSettingsTab === "merchants" && (
                  <div className="h-full">
                    <p className="text-[13px] text-neutral-500 mb-6 -mt-6">
                      作为服务商，管理下属所有商家账号及其系统权限
                    </p>
                    <MerchantManagement />
                  </div>
                )}

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
                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          显示语言
                        </h4>
                        <p className="text-[12px] text-neutral-500">
                          设置应用程序界面的显示语言。
                        </p>
                      </div>
                      <select className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] text-neutral-700 outline-none">
                        <option>中文(简体)</option>
                        <option>English</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-4 pb-6 border-b border-neutral-100">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          字体大小
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 px-2">
                        <span className="text-[12px] text-neutral-500">小</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="40"
                          className="flex-1 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[14px] text-neutral-500">大</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          简洁模式
                        </h4>
                        <p className="text-[12px] text-neutral-500 mt-1">
                          开启后将简化对话界面显示，隐藏部分装饰元素。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-neutral-200 rounded-full cursor-pointer relative transition-colors shadow-inner">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          发送消息
                        </h4>
                        <p className="text-[12px] text-neutral-500 mt-1">
                          设置聊天输入框中发送消息的快捷键。
                        </p>
                      </div>
                      <select className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] text-neutral-700 outline-none">
                        <option>Enter</option>
                        <option>Ctrl + Enter</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          技能自动更新
                        </h4>
                        <p className="text-[12px] text-neutral-500 mt-1">
                          开启后将自动更新已安装的技能为最新版本，不会更新你在
                          TapTik 中编辑过的技能。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-primary-500 rounded-full cursor-pointer relative transition-colors shadow-inner">
                        <div className="absolute left-5 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          非高风险技能自动安装
                        </h4>
                        <p className="text-[12px] text-neutral-500 mt-1 max-w-[400px]">
                          上传技能后仍会显示安全检测过程；检测结果为非高风险时自动继续安装，高风险始终需要手动确认。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-primary-500 rounded-full cursor-pointer relative transition-colors shadow-inner">
                        <div className="absolute left-5 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-transparent">
                      <div>
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-1">
                          锁屏远程
                        </h4>
                        <p className="text-[12px] text-neutral-500 mt-1">
                          开启后即使在锁屏状态下，电脑也不会进入休眠，屏幕也不会自动关闭，方便通过手机远程操控和保持自动化任务持续运行。
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-neutral-200 rounded-full cursor-pointer relative transition-colors shadow-inner shrink-0">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab !== "system" && (
                  <div className="text-neutral-500 text-[13px] py-10">
                    此功能正在开发中...
                  </div>
                )}
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
