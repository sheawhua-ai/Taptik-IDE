// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  MessageSquare,
  Terminal,
  History,
  Settings,
  MoreVertical,
  Check,
  Cpu,
  X,
  FileText,
  Trash2,
  Compass,
  PenTool,
  Calendar,
  Users,
  BarChart,
  Workflow,
  Plus,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Edit3,
  Play,
  FolderPlus,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SmartInput } from "./SmartInput";
import { useProjectStore } from "../context/ProjectContext";

export interface ProjectScheme {
  version: string;
  name: string;
  goal: string;
  targetAudience: string;
  strategy: string;
  contentDirections: string[];
  roles: string;
  cycle: string;
  totalNotes: number;
  firstValidation: string;
  assumptions: string;
  risks: string;
}

export interface NextStep {
  title?: string;
  reason: string;
  actions?: {
    label: string;
    actionKey: string;
    primary?: boolean;
  }[];
}

interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  type?: 
    | "text" 
    | "plan" 
    | "report" 
    | "alternatives" 
    | "project_status" 
    | "project_scheme_card" 
    | "project_creating_progress" 
    | "project_created_result" 
    | "project_created_error";
  status?: "pending" | "running" | "completed" | "error";
  projectScheme?: ProjectScheme;
  progressSteps?: { name: string; status: "pending" | "running" | "completed" }[];
  resultData?: {
    projectId: string;
    name: string;
    cycle: string;
    totalNotes: number;
    rolesDistribution: string;
    status: string;
    firstTaskAdvice: string;
  };
  nextStep?: NextStep;
  subtasks?: {
    id: string;
    name: string;
    status: "pending" | "running" | "completed";
    agent: string;
  }[];
  contextPill?: { type: string; text: string };
}

interface SubagentChatProps {
  moduleId: string;
  moduleName: string;
  onNavigate?: (
    tabId: "strategy" | "content" | "execution" | "interaction" | "metrics",
  ) => void;
  onClose?: () => void;
  initialExpert?: string;
  initialContext?: string;
}

export const SubagentChat: React.FC<SubagentChatProps> = ({
  moduleId,
  moduleName,
  onNavigate,
  onClose,
  initialExpert,
  initialContext,
}) => {
  const { addNewProject, batchGenerateProjectNotes, setSelectedProjectId } = useProjectStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("输入指令，或键入 '@' '/' 唤出动作菜单...");
  const [contextPill, setContextPill] = useState<{
    type: string;
    text: string;
  } | null>(null);
  const [customGreeting, setCustomGreeting] = useState<string | null>(null);
  const [currentExpert, setCurrentExpert] = useState<string>(
    moduleName + " 助手",
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [alternativesModeData, setAlternativesModeData] = useState<any>(null);
  
  // Project creation state
  const [activeFullSchemeModal, setActiveFullSchemeModal] = useState<ProjectScheme | null>(null);
  const [currentScheme, setCurrentScheme] = useState<ProjectScheme>({
    version: "v1.0",
    name: "2026 Q3 小红书品牌精准种草与搜索卡位项目",
    goal: "提升品牌核心词搜索卡位，月度爆文率 > 15%，带动私信转化增长",
    targetAudience: "18-35岁注重品质的都市白领及精致生活人群",
    strategy: "KOC真实体验种草 + KOS店长号专业科普，锁定蓝海长尾搜索词",
    contentDirections: ["真实避坑", "硬核测评", "沉浸体验", "同款推荐"],
    roles: "20个 KOC 体验官 + 2个 KOS 店长号 + 1个 品牌主号",
    cycle: "30天 (月度第一期)",
    totalNotes: 23,
    firstValidation: "前7天通过 10 篇 KOC 测试内容验证互动率与长尾词收录",
    assumptions: "高互动 KOC 体验笔记能有效拉升蓝海长尾词搜索排名",
    risks: "部分 KOC 素材交付可能延期，已预留备用素材池"
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const smartInputRef = useRef<any>(null);

  const getExpertIcon = (name: string) => {
    if (name.includes("策略")) return <Compass size={16} />;
    if (name.includes("内容")) return <PenTool size={16} />;
    if (name.includes("排期")) return <Calendar size={16} />;
    if (name.includes("客资")) return <Users size={16} />;
    if (name.includes("数据")) return <BarChart size={16} />;
    if (name.includes("编排")) return <Workflow size={16} />;
    return <Bot size={16} />;
  };

  const COMMANDS = [
    {
      cmd: "/创建新项目",
      desc: "智能整理需求，推荐小红书运营方案并一键生成项目",
      module: "global",
    },
    {
      cmd: "/催办进度",
      desc: "检查哪些 KOS 员工未完成本周期发文任务",
      module: "matrix",
    },
    {
      cmd: "/批量派单",
      desc: "给选中的自有账号批量下发指定 SOP 任务",
      module: "matrix",
    },
    {
      cmd: "/巡检风控",
      desc: "扫描监控的账号是否有被限流或违规封禁风险",
      module: "matrix",
    },
    {
      cmd: "/开启全域巡航",
      desc: "启动当前商家的蓝海关键词扫描任务",
      module: "data",
    },
  ];

  useEffect(() => {
    setCurrentExpert(
      moduleId === "strategy" ? "操盘副手" : moduleName + " 助手",
    );
    
    const greetings: Record<string, string> = {
      strategy: `我已经完成这个商家的今日巡航。\n\n当前最值得优先处理的是「幼犬换粮避坑」方向。它适合用自然流内容先测试，不建议一开始直接做硬广投流。\n\n你可以直接说：\n“开始操盘”\n“继续深挖低粉爆款”\n“换成专业号方向”\n“只用 A01 和 A02”`,
      matrix: `矩阵调度数字员工已就绪。正在为您监控自有 KOS 账号与外部素人发文状态。您可以让我下发任务或排查账号异常。`,
      content: `内容助手已就绪。正在为您解析最近的爆款笔记逻辑。您可以下达改写、生成或润色内容指令。`,
      execution: `编排中心数字员工在线。正在管理您的自动化任务流。需要我调整执行顺序或增加监控节点吗？`,
      interaction: `触达转化助手已连接。正在分析意图私信。您可以让我自动回复或导出高潜线索。`,
      metrics: `归因复盘专家已就绪。正在分析 ROI 与爆文率。需要我生成本周的运营对比报表吗？`,
    };

    setMessages([
      {
        id: "1",
        role: "agent",
        content:
          customGreeting ||
          greetings[moduleId] ||
          `您好，我是 ${moduleName} 模块的数字员工，请问有什么可以帮您？`,
        timestamp: new Date(),
        nextStep: {
          reason: "建议点击【创建新项目】由 AI 自动读取商家资料并生成精准的小红书运营方案。",
          actions: [
            { label: "✨ 创建新项目", actionKey: "trigger_create_project", primary: true },
            { label: "🔍 开启全域巡航", actionKey: "start_scan" }
          ]
        }
      },
    ]);
  }, [moduleId, customGreeting, moduleName]);

  const handleCustomGreeting = (e: any) => {
    if (e.detail?.greeting) {
      setCustomGreeting(e.detail.greeting);
    }
    if (e.detail?.expert) {
      setCurrentExpert(e.detail.expert);
    }
  };

  useEffect(() => {
    window.addEventListener("set-custom-greeting", handleCustomGreeting);
    return () =>
      window.removeEventListener("set-custom-greeting", handleCustomGreeting);
  }, []);

  useEffect(() => {
    const handleTriggerCreate = () => {
      startCreateProjectFlow();
    };
    window.addEventListener("trigger-agent-create-project", handleTriggerCreate);
    return () => window.removeEventListener("trigger-agent-create-project", handleTriggerCreate);
  }, []);

  useEffect(() => {
    const handleOpenExpert = (e: any) => {
      const { expert, context, alternativesData } = e.detail || {};
      if (expert) {
        setCurrentExpert(expert);
      }
      if (alternativesData) {
        setAlternativesModeData(alternativesData);
        return;
      } else {
        setAlternativesModeData(null);
        if (context) {
          setContextPill({ type: expert || "参考内容", text: context });
          setInputValue((prev) => prev || `请分析这个`);
        }
      }
    };
    window.addEventListener("open-expert", handleOpenExpert);
    return () => window.removeEventListener("open-expert", handleOpenExpert);
  }, [moduleId, customGreeting]);

  useEffect(() => {
    if (initialExpert) setCurrentExpert(initialExpert);
    if (initialContext) {
      setContextPill({
        type: initialExpert || "参考内容",
        text: initialContext,
      });
      setInputValue((prev) => prev || `请分析这个`);
    }
  }, [initialExpert, initialContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Core Agent Flow: Create Project directly in chat
  const startCreateProjectFlow = () => {
    // 1. Do NOT put text in input box
    // 2. Do NOT add user message
    // 3. Directly add AI status message
    const statusMsgId = "status-" + Math.random().toString(36).substring(2);
    const statusMsg: Message = {
      id: statusMsgId,
      role: "agent",
      type: "project_status",
      content: "正在结合当前商家信息、账号资源和知识资料整理本轮运营需求……",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, statusMsg]);
    setIsTyping(true);

    // 4. After status finishes, replace with recommended scheme card
    setTimeout(() => {
      const initialSchemeData: ProjectScheme = {
        version: "v1.0",
        name: "2026 Q3 小红书品牌精准种草与搜索卡位项目",
        goal: "提升品牌核心词搜索卡位，月度爆文率 > 15%，带动私信转化增长",
        targetAudience: "18-35岁注重品质的都市白领及精致生活人群",
        strategy: "KOC真实体验种草 + KOS店长号专业科普，锁定蓝海长尾搜索词",
        contentDirections: ["真实避坑", "硬核测评", "沉浸体验", "同款推荐"],
        roles: "20个 KOC 体验官 + 2个 KOS 店长号 + 1个 品牌主号",
        cycle: "30天 (月度第一期)",
        totalNotes: 23,
        firstValidation: "前7天通过 10 篇 KOC 测试内容验证互动率与长尾词收录",
        assumptions: "高互动 KOC 体验笔记能有效拉升蓝海长尾词搜索排名",
        risks: "部分 KOC 素材交付可能延期，已预留备用素材池"
      };

      setCurrentScheme(initialSchemeData);

      const schemeCardMsg: Message = {
        id: "scheme-" + Math.random().toString(36).substring(2),
        role: "agent",
        type: "project_scheme_card",
        content: "我已经读取了当前商家资产与绑定的 20 个 KOC 体验官、2 个 KOS 账号。\n已为您智能整理并生成首轮推荐方案：",
        timestamp: new Date(),
        projectScheme: initialSchemeData,
        nextStep: {
          reason: "先确认核心目标和内容角色分工。它们确认后，才能准确拆分笔记任务。",
          actions: [
            { label: "✏️ 调整方案", actionKey: "adjust_scheme" },
            { label: "🚀 确认并创建项目", actionKey: "confirm_create_project", primary: true }
          ]
        }
      };

      setMessages((prev) => prev.map(m => m.id === statusMsgId ? schemeCardMsg : m));
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!inputValue.trim() && !contextPill) return;
    const text = inputValue.trim();
    setInputValue("");
    setContextPill(null);

    // Reset input placeholder if custom
    setInputPlaceholder("输入指令，或键入 '@' '/' 唤出动作菜单...");

    // Check if triggering project creation
    if (
      text === "/创建新项目" || 
      text === "创建新项目" || 
      text === "新建项目" || 
      text === "新建小红书运营项目" ||
      text === "创建项目"
    ) {
      startCreateProjectFlow();
      return;
    }

    sendDirectMessage(text, contextPill);
  };

  const sendDirectMessage = (text: string, contextObj: any = null) => {
    const userMsg: Message = {
      id: Math.random().toString(36).substring(2),
      role: "user",
      content: text,
      timestamp: new Date(),
      contextPill: contextObj,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // If user is editing scheme via natural language
    if (
      text.includes("周期") || 
      text.includes("目标") || 
      text.includes("数量") || 
      text.includes("账号") || 
      text.includes("改成") || 
      text.includes("修改") ||
      text.includes("只用") ||
      text.includes("调整") ||
      text.includes("KOC") ||
      text.includes("搜索")
    ) {
      setTimeout(() => {
        let newCycle = currentScheme.cycle;
        let newNotes = currentScheme.totalNotes;
        let newRoles = currentScheme.roles;

        if (text.includes("一个月") || text.includes("30天")) {
          newCycle = "30天";
        } else if (text.includes("60天") || text.includes("两个月")) {
          newCycle = "60天";
        }

        if (text.includes("10个") || text.includes("10篇")) {
          newNotes = 13;
          newRoles = "10个 KOC 体验官 + 2个 KOS 店长号 + 1个 品牌主号";
        } else if (text.includes("15篇") || text.includes("15个")) {
          newNotes = 15;
          newRoles = "12个 KOC 体验官 + 2个 KOS 店长号 + 1个 品牌主号";
        }

        const updatedScheme: ProjectScheme = {
          ...currentScheme,
          version: "v1.1",
          cycle: newCycle,
          totalNotes: newNotes,
          roles: newRoles,
        };

        setCurrentScheme(updatedScheme);

        const updatedMsg: Message = {
          id: Math.random().toString(36).substring(2),
          role: "agent",
          type: "project_scheme_card",
          content: `已根据您的要求调整方案要求（${text}），方案已更新至 v1.1 版本：`,
          timestamp: new Date(),
          projectScheme: updatedScheme,
          nextStep: {
            reason: `已根据你的要求把方案进行同步更新。下一步建议：确认这版方案并创建项目。`,
            actions: [
              { label: "✏️ 继续调整", actionKey: "adjust_scheme" },
              { label: "🚀 确认并创建项目", actionKey: "confirm_create_project", primary: true }
            ]
          }
        };

        setMessages((prev) => [...prev, updatedMsg]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    if (text.includes("确认创建") || text.includes("确认并创建")) {
      executeConfirmAndCreateProject();
      return;
    }

    // Default simulation
    setTimeout(() => {
      const agentMsg: Message = {
        id: Math.random().toString(36).substring(2),
        role: "agent",
        content: `已收到指令：${text}。正在为您调度 AI Agent 群组执行，稍后会为您呈现结果。`,
        timestamp: new Date(),
        nextStep: {
          reason: "您可以继续下达具体指令，或点击下方按钮发起全新运营项目。",
          actions: [
            { label: "✨ 创建新项目", actionKey: "trigger_create_project", primary: true },
            { label: "📋 巡检风控", actionKey: "risk_check" }
          ]
        }
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleNextStepAction = (actionKey: string) => {
    if (actionKey === "trigger_create_project") {
      startCreateProjectFlow();
    } else if (actionKey === "adjust_scheme") {
      setInputPlaceholder("告诉我需要调整的周期、目标、内容数量、账号分工或其他要求……");
      setTimeout(() => {
        const el = document.querySelector("#subagent-chat-input") as HTMLTextAreaElement;
        if (el) el.focus();
      }, 100);
    } else if (actionKey === "view_full_scheme") {
      setActiveFullSchemeModal(currentScheme);
    } else if (actionKey === "confirm_create_project") {
      executeConfirmAndCreateProject();
    } else if (actionKey === "enter_project") {
      if (onNavigate) onNavigate("strategy");
      if (onClose) onClose();
    } else if (actionKey === "view_note_ledger") {
      if (onNavigate) onNavigate("content");
      if (onClose) onClose();
    } else if (actionKey === "retry_create") {
      executeConfirmAndCreateProject();
    } else if (actionKey === "view_first_tasks") {
      if (onNavigate) onNavigate("content");
      if (onClose) onClose();
    } else if (actionKey === "start_scan") {
      sendDirectMessage("/开启全域巡航");
    } else {
      sendDirectMessage(`执行动作: ${actionKey}`);
    }
  };

  // Execution of project creation in ProjectContext
  const executeConfirmAndCreateProject = () => {
    const progressMsgId = "progress-" + Math.random().toString(36).substring(2);
    
    const initialSteps = [
      { name: "创建项目基本结构", status: "running" as const },
      { name: "保存运营方案与策略契约", status: "pending" as const },
      { name: "生成笔记任务包", status: "pending" as const },
      { name: "关联账号与品牌资料", status: "pending" as const },
      { name: "建立执行与复盘节点", status: "pending" as const },
    ];

    const progressMsg: Message = {
      id: progressMsgId,
      role: "agent",
      type: "project_creating_progress",
      content: "正在创建项目并生成对应的笔记任务……",
      timestamp: new Date(),
      progressSteps: initialSteps
    };

    setMessages((prev) => [...prev, progressMsg]);
    setIsTyping(true);

    // Simulate step progress
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === progressMsgId
            ? {
                ...m,
                progressSteps: [
                  { name: "创建项目基本结构", status: "completed" },
                  { name: "保存运营方案与策略契约", status: "running" },
                  { name: "生成笔记任务包", status: "pending" },
                  { name: "关联账号与品牌资料", status: "pending" },
                  { name: "建立执行与复盘节点", status: "pending" },
                ],
              }
            : m
        )
      );

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === progressMsgId
              ? {
                  ...m,
                  progressSteps: [
                    { name: "创建项目基本结构", status: "completed" },
                    { name: "保存运营方案与策略契约", status: "completed" },
                    { name: "生成笔记任务包", status: "running" },
                    { name: "关联账号与品牌资料", status: "running" },
                    { name: "建立执行与复盘节点", status: "pending" },
                  ],
                }
              : m
          )
        );

        // Perform actual write in store!
        try {
          const newId = addNewProject({
            name: currentScheme.name,
            goal: currentScheme.goal,
            status: "准备中",
            startDate: "2026-08-10",
            endDate: "2026-09-10",
            budget: "10,000 元",
            strategyProtocol: {
              coreGoal: currentScheme.goal,
              targetAudience: currentScheme.targetAudience,
              coreProblem: "缺乏真实体验案例与长尾词搜推占位",
              solutionSummary: currentScheme.strategy,
              verifyHypothesis: currentScheme.firstValidation,
              continueCondition: "爆文率 > 15%",
              stopCondition: "爆文率 < 3%"
            }
          });

          // Generate notes package
          const notesCount = currentScheme.totalNotes;
          const generatedList = Array.from({ length: notesCount }).map((_, i) => ({
            title: i % 2 === 0 ? `【真实避坑】爆款干货 N${i + 1}` : `【硬核测评】小红书真实种草 N${i + 1}`,
            accountType: (i < notesCount - 3 ? "KOC" : i < notesCount - 1 ? "店长号/KOS" : "品牌主号") as any,
            accountName: i < notesCount - 3 ? `KOC体验官_${i + 1}` : i < notesCount - 1 ? `店长专业号_${i - notesCount + 4}` : "品牌官方号",
            contentDirection: currentScheme.contentDirections[i % currentScheme.contentDirections.length],
            plannedDate: `2026-08-${(10 + (i % 20)).toString().padStart(2, "0")}`
          }));

          batchGenerateProjectNotes(newId, generatedList);
          setSelectedProjectId(newId);

          setTimeout(() => {
            const resultMsg: Message = {
              id: "result-" + Math.random().toString(36).substring(2),
              role: "agent",
              type: "project_created_result",
              content: "项目已成功创建！对应的笔记任务包与运营节点已全部就绪：",
              timestamp: new Date(),
              resultData: {
                projectId: newId,
                name: currentScheme.name,
                cycle: currentScheme.cycle,
                totalNotes: currentScheme.totalNotes,
                rolesDistribution: currentScheme.roles,
                status: "准备中 (已建立节点)",
                firstTaskAdvice: "确认首批 5 篇笔记的任务简报，并准备对应的真实体验素材。这是第一轮发布能够按计划开始的前提。"
              },
              nextStep: {
                reason: "项目已经创建。根据当前方案，我建议下一步先确认首批5篇笔记的任务简报，并准备对应的真实体验素材。这是第一轮发布能够按计划开始的前提。",
                actions: [
                  { label: "📋 查看首批任务", actionKey: "view_first_tasks", primary: true },
                  { label: "📸 准备素材", actionKey: "prepare_materials" },
                  { label: "✨ 生成第一篇笔记", actionKey: "generate_first_note" }
                ]
              }
            };

            setMessages((prev) => prev.map(m => m.id === progressMsgId ? resultMsg : m));
            setIsTyping(false);
          }, 1200);

        } catch (err) {
          const errorMsg: Message = {
            id: "err-" + Math.random().toString(36).substring(2),
            role: "agent",
            type: "project_created_error",
            content: "创建项目时出现网络或写入异常，已自动为您保留当前方案与修改记录。",
            timestamp: new Date(),
            nextStep: {
              reason: "已确认的方案和任务安排都已保留。下一步建议：从项目写入环节重新尝试，无需重新整理需求。",
              actions: [
                { label: "🔄 重新创建", actionKey: "retry_create", primary: true }
              ]
            }
          };
          setMessages((prev) => prev.map(m => m.id === progressMsgId ? errorMsg : m));
          setIsTyping(false);
        }
      }, 1000);
    }, 1000);
  };

  const renderMessageContent = (msg: Message) => {
    // 1. AI Status message during demand organization
    if (msg.type === "project_status") {
      return (
        <div className="flex items-center gap-3 py-1">
          <Loader2 size={18} className="animate-spin text-primary-500 shrink-0" />
          <p className="text-[13px] font-medium text-neutral-800 animate-pulse">
            {msg.content}
          </p>
        </div>
      );
    }

    // 2. Structured Recommended Scheme Card
    if (msg.type === "project_scheme_card" && msg.projectScheme) {
      const s = msg.projectScheme;
      return (
        <div className="space-y-3.5">
          <p className="text-[13px] text-neutral-700 leading-relaxed font-medium">{msg.content}</p>

          <div className="bg-neutral-900 text-white rounded-2xl p-4 shadow-lg border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-[11px]">
                  AI
                </div>
                <span className="text-[13px] font-extrabold text-white">
                  小红书运营推荐方案 ({s.version})
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-md border border-primary-500/30">
                策略草案
              </span>
            </div>

            <div className="space-y-2 text-[12px]">
              <div>
                <span className="text-neutral-400 font-medium block text-[10px]">项目建议名称</span>
                <p className="font-bold text-white text-[13px] mt-0.5">{s.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/60">
                <div>
                  <span className="text-neutral-400 text-[10px]">项目周期</span>
                  <p className="font-semibold text-neutral-200">{s.cycle}</p>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px]">预计笔记任务数</span>
                  <p className="font-bold text-primary-400">{s.totalNotes} 篇笔记</p>
                </div>
              </div>

              <div className="pt-1 border-t border-neutral-800/60">
                <span className="text-neutral-400 text-[10px]">本轮核心目标</span>
                <p className="text-neutral-200 leading-snug mt-0.5">{s.goal}</p>
              </div>

              <div className="pt-1 border-t border-neutral-800/60">
                <span className="text-neutral-400 text-[10px]">核心策略与角色分工</span>
                <p className="text-neutral-200 leading-snug mt-0.5">{s.strategy}</p>
                <div className="mt-1 px-2 py-1 bg-neutral-800 rounded-md text-[11px] text-neutral-300 font-medium">
                  👥 {s.roles}
                </div>
              </div>

              <div className="pt-1 border-t border-neutral-800/60">
                <span className="text-neutral-400 text-[10px]">内容切入方向</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.contentDirections.map((dir, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-[10px] font-medium border border-neutral-700">
                      #{dir}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/60 text-[11px]">
                <div>
                  <span className="text-neutral-400 text-[10px]">关键假设</span>
                  <p className="text-neutral-300 line-clamp-2">{s.assumptions}</p>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px]">主要风险</span>
                  <p className="text-amber-400/90 line-clamp-2">{s.risks}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons at Bottom of Card */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveFullSchemeModal(s)}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 border border-neutral-700"
              >
                <Eye size={13} />
                <span>查看完整方案</span>
              </button>

              <button
                onClick={() => handleNextStepAction("adjust_scheme")}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 border border-neutral-700"
              >
                <Edit3 size={13} />
                <span>调整方案</span>
              </button>

              <button
                onClick={() => executeConfirmAndCreateProject()}
                className="flex-1 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center gap-1 shadow-md active:scale-95"
              >
                <Sparkles size={13} />
                <span>确认并创建项目</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 3. Creating Progress Message
    if (msg.type === "project_creating_progress" && msg.progressSteps) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-primary-500 shrink-0" />
            <p className="text-[13px] font-bold text-neutral-900">{msg.content}</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200 space-y-2">
            {msg.progressSteps.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  {st.status === "completed" ? (
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  ) : st.status === "running" ? (
                    <Loader2 size={15} className="animate-spin text-primary-500 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 shrink-0" />
                  )}
                  <span className={st.status === "completed" ? "text-neutral-900 font-medium" : st.status === "running" ? "text-primary-600 font-bold" : "text-neutral-400"}>
                    {st.name}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">
                  {st.status === "completed" ? "已就绪" : st.status === "running" ? "处理中..." : "等待中"}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4. Creation Result Card
    if (msg.type === "project_created_result" && msg.resultData) {
      const r = msg.resultData;
      return (
        <div className="space-y-3.5">
          <p className="text-[13px] font-semibold text-neutral-800">{msg.content}</p>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="text-[14px] font-extrabold text-neutral-900">
                  {r.name}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                {r.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-neutral-400 text-[10px] block">项目周期</span>
                <span className="font-bold text-neutral-900">{r.cycle}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-neutral-400 text-[10px] block">已生成笔记任务</span>
                <span className="font-extrabold text-emerald-700">{r.totalNotes} 篇笔记包</span>
              </div>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-[12px]">
              <span className="text-neutral-400 text-[10px] block">参与角色与分工</span>
              <p className="font-medium text-neutral-800 mt-0.5">{r.rolesDistribution}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-[12px] space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                💡 建议执行的第一项任务
              </span>
              <p className="text-neutral-700 leading-relaxed">
                {r.firstTaskAdvice}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleNextStepAction("enter_project")}
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <FolderPlus size={14} />
                <span>进入项目</span>
              </button>

              <button
                onClick={() => handleNextStepAction("view_note_ledger")}
                className="flex-1 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
              >
                <FileText size={14} />
                <span>查看笔记包</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 5. Creation Error Card
    if (msg.type === "project_created_error") {
      return (
        <div className="space-y-3 bg-rose-50 p-4 rounded-2xl border border-rose-200">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-[13px]">
            <AlertCircle size={18} />
            <span>项目写入失败</span>
          </div>
          <p className="text-[12px] text-rose-800 leading-relaxed">{msg.content}</p>
          <button
            onClick={() => executeConfirmAndCreateProject()}
            className="w-full py-2 bg-rose-600 text-white font-bold rounded-xl text-[12px] flex items-center justify-center gap-1 hover:bg-rose-700"
          >
            <RotateCcw size={14} />
            <span>重新创建</span>
          </button>
        </div>
      );
    }

    // Standard Plan Message
    if (msg.type === "plan") {
      return (
        <div className="space-y-4">
          <p className="text-[13px] text-neutral-600 mb-4">{msg.content}</p>
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded">
                编排计划 v1.0
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping" />
                <span className="text-[10px] text-primary-500">执行中</span>
              </div>
            </div>
            {msg.subtasks?.map((sub, idx) => (
              <div
                key={sub.id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${sub.status === "completed" ? "bg-neutral-900 text-white" : sub.status === "running" ? "bg-neutral-900 text-white animate-pulse" : "bg-white border border-neutral-200 text-neutral-300"}`}
                  >
                    {sub.status === "completed" ? (
                      <Check size={12} strokeWidth={4} />
                    ) : (
                      <div className="text-[10px] ">{idx + 1}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-900 leading-tight">
                      {sub.name}
                    </div>
                    <div className="text-[9px] text-neutral-400">
                      {sub.agent} 执行中
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
        {msg.content}
      </p>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white w-full overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-5 bg-white shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm ring-1 ring-neutral-800">
            {getExpertIcon(currentExpert)}
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-neutral-900 leading-none">
              {currentExpert}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-neutral-500 font-medium">全域指挥中心在线</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
              title="收起助手"
            >
              <X size={18} />
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            {showOptions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowOptions(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-neutral-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  <button
                    onClick={() => {
                      setMessages([]);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[12px] text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <Trash2 size={14} /> 清除会话记录
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-neutral-100/40"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            {msg.role === "user" && msg.contextPill && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white text-primary-600 rounded-xl text-[12px] shadow-sm mb-2 max-w-[90%] border border-primary-100">
                <FileText size={14} className="shrink-0" />
                <span className="shrink-0 text-primary-800">
                  {msg.contextPill.type}
                </span>
                <span className="text-neutral-400 px-1">|</span>
                <span className="truncate text-neutral-600">
                  {msg.contextPill.text}
                </span>
              </div>
            )}

            <div
              className={`max-w-[92%] p-4 rounded-2xl shadow-xs ${
                msg.role === "user"
                  ? "bg-neutral-900 text-white rounded-tr-none"
                  : "bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-none"
              }`}
            >
              {renderMessageContent(msg)}

              {/* Step Recommendation Block (下一步牵引机制) */}
              {msg.role === "agent" && msg.nextStep && (
                <div className="mt-3.5 pt-3 border-t border-neutral-100 bg-neutral-50/90 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-800">
                    <Sparkles size={13} className="text-primary-500 shrink-0" />
                    <span>推荐下一步</span>
                  </div>

                  <p className="text-[12px] text-neutral-600 leading-relaxed font-normal">
                    {msg.nextStep.reason}
                  </p>

                  {msg.nextStep.actions && msg.nextStep.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.nextStep.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleNextStepAction(act.actionKey)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                            act.primary
                              ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs active:scale-95"
                              : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
                          }`}
                        >
                          <span>{act.label}</span>
                          <ChevronRight size={12} className="opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-[10px] text-neutral-400 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start scale-90 origin-left opacity-70">
            <div className="bg-white border border-neutral-200 p-4 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Bar above Input */}
      <div className="px-4 py-2 bg-neutral-50/80 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
        <button
          onClick={() => startCreateProjectFlow()}
          className="px-2.5 py-1 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 transition-all shadow-2xs"
        >
          <Sparkles size={12} className="text-primary-400" />
          <span>创建新项目</span>
        </button>

        <button
          onClick={() => sendDirectMessage("催办进度")}
          className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-[11px] font-medium shrink-0 transition-colors"
        >
          催办进度
        </button>

        <button
          onClick={() => sendDirectMessage("开启全域巡航")}
          className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-[11px] font-medium shrink-0 transition-colors"
        >
          全域巡航
        </button>

        <button
          onClick={() => sendDirectMessage("巡检风控")}
          className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-[11px] font-medium shrink-0 transition-colors"
        >
          巡检风控
        </button>
      </div>

      {/* Bottom Input Area */}
      <div className="p-3.5 bg-white border-t border-neutral-100 relative shrink-0">
        <div className="relative bg-neutral-50 border border-neutral-200 rounded-2xl p-1.5 focus-within:border-neutral-800 focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
          {contextPill && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary-600 rounded-xl text-[12px] shadow-sm mb-1 ml-1 mt-1 max-w-[90%] border border-primary-100 w-max">
              <FileText size={14} className="shrink-0" />
              <span className="shrink-0 text-primary-800">{contextPill.type}</span>
              <span className="text-neutral-400 px-1">|</span>
              <span className="truncate text-neutral-600 max-w-[200px]">
                {contextPill.text}
              </span>
              <button
                onClick={() => setContextPill(null)}
                className="ml-2 text-neutral-400 hover:text-primary-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex items-end h-full">
            <SmartInput
              id="subagent-chat-input"
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={inputPlaceholder}
              className="w-full bg-transparent py-2 pl-3 pr-2 text-[13px] outline-none resize-none overflow-y-auto placeholder:text-neutral-400 min-h-[40px] max-h-[160px]"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && !contextPill}
              className="shrink-0 mb-0.5 mr-0.5 w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Scheme View Modal (查看完整方案) */}
      <AnimatePresence>
        {activeFullSchemeModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200"
            >
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
                <div>
                  <h3 className="font-bold text-[15px]">完整运营策略契约 ({activeFullSchemeModal.version})</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{activeFullSchemeModal.name}</p>
                </div>
                <button
                  onClick={() => setActiveFullSchemeModal(null)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-[13px] text-neutral-700">
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">1. 核心目标</span>
                  <p className="font-semibold text-neutral-900">{activeFullSchemeModal.goal}</p>
                </div>

                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">2. 目标人群与核心问题</span>
                  <p className="text-neutral-800"><strong className="text-neutral-900">目标人群：</strong>{activeFullSchemeModal.targetAudience}</p>
                  <p className="text-neutral-800"><strong className="text-neutral-900">破解痛点：</strong>品牌核心长尾词缺乏高互动真实测试案例，传统硬广转化为零。</p>
                </div>

                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">3. 策略规划与任务拆解</span>
                  <p className="text-neutral-800 mb-2">{activeFullSchemeModal.strategy}</p>
                  <div className="p-2.5 bg-white rounded-lg border border-neutral-200 font-medium text-[12px] space-y-1">
                    <p>• 预计总笔记数：<strong>{activeFullSchemeModal.totalNotes} 篇</strong></p>
                    <p>• 角色分工：<strong>{activeFullSchemeModal.roles}</strong></p>
                    <p>• 内容切入方向：<strong>{activeFullSchemeModal.contentDirections.join(" / ")}</strong></p>
                  </div>
                </div>

                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">4. 30天节奏与验证标准</span>
                  <p className="text-neutral-800">• <strong>冷启动期 (前7天)：</strong> {activeFullSchemeModal.firstValidation}</p>
                  <p className="text-neutral-800">• <strong>持续放大量 (第8-20天)：</strong> 集中下发剩余KOC与KOS脚本，锁定首屏搜索词</p>
                  <p className="text-neutral-800">• <strong>长尾回收期 (第21-30天)：</strong> 针对互动高爆款做私信卡片跟进与复盘</p>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-1 text-amber-900">
                  <span className="text-[11px] font-bold text-amber-700 uppercase">5. 假设与风险预控</span>
                  <p>• <strong>关键假设：</strong> {activeFullSchemeModal.assumptions}</p>
                  <p>• <strong>主要风险：</strong> {activeFullSchemeModal.risks}</p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setActiveFullSchemeModal(null)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-xl text-[12px]"
                >
                  关闭查看
                </button>
                <button
                  onClick={() => {
                    setActiveFullSchemeModal(null);
                    executeConfirmAndCreateProject();
                  }}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold rounded-xl text-[12px] flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles size={14} />
                  <span>确认并创建项目</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

