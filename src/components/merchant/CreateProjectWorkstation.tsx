import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Edit2,
  Check,
  ChevronRight,
  HelpCircle,
  Info,
  Paperclip,
  UploadCloud,
  Plus,
  Calendar,
  AlertCircle,
  Send,
  Eye,
  RefreshCw,
  Layers,
  ChevronDown,
  Clock,
  User,
  Users,
  Trash2,
  ListFilter,
  Package,
  BookOpen,
  Share2,
  Target,
  BarChart2,
  MessageSquare,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "../../context/ProjectContext";
import { DistributionDrawer, DistributionConfig } from "./CreateProject/DistributionDrawer";
import { ConsumerModeDrawer, ConsumerKocConfig } from "./CreateProject/ConsumerModeDrawer";

interface Attachment {
  id: string;
  type: "file" | "link" | "text";
  name: string;
}

export interface ContentRoleItem {
  id: string;
  role: string;
  purpose: string;
  count: number;
}

export interface QuestionnaireQuestion {
  id: string;
  title: string;
  type: string;
  isRequired: boolean;
  options?: string[];
}

export const DEFAULT_CONTENT_ROLES: ContentRoleItem[] = [
  { id: "role_1", role: "品牌号", purpose: "品牌解释与信任承接", count: 2 },
  { id: "role_2", role: "店长号", purpose: "专业科普与问题解答", count: 5 },
  { id: "role_3", role: "KOC", purpose: "真实体验与场景种草", count: 10 },
];

export const DEFAULT_QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  { id: "q1", title: "1. 宠物当前月龄？", type: "单选", isRequired: true, options: ["0-3个月", "3-6个月", "6个月以上"] },
  { id: "q2", title: "2. 换粮前最主要的困扰？", type: "多选", isRequired: true, options: ["软便/拉稀", "挑食/不爱吃", "泪痕严重", "毛发粗糙", "太瘦不长肉"] },
  { id: "q3", title: "3. 试用本产品的效果？", type: "多选", isRequired: true, options: ["便便成型", "胃口变好", "毛发变亮", "长肉发腮", "无明显变化"] },
  { id: "q4", title: "4. 你会向朋友推荐吗？", type: "单选", isRequired: true, options: ["会", "可能会", "不会"] },
];

export const MERCHANT_BRAND_ACCOUNTS = [
  { id: "brand_1", name: "特唯普宠物官方旗舰店", fans: "12.8w", status: "已授权正常" },
  { id: "brand_2", name: "特唯普品牌官方号", fans: "5.4w", status: "已授权正常" },
  { id: "brand_3", name: "特唯普健康宠物馆", fans: "2.1w", status: "已授权正常" },
];

export const MERCHANT_KOS_ACCOUNTS = [
  { id: "kos_1", name: "店长号_陆家嘴旗舰店", storeName: "上海陆家嘴店", status: "在线" },
  { id: "kos_2", name: "店长号_徐家汇概念店", storeName: "上海徐家汇店", status: "在线" },
  { id: "kos_3", name: "店长号_朝阳大悦城店", storeName: "北京朝阳店", status: "在线" },
  { id: "kos_4", name: "店长号_天河城形象店", storeName: "广州天河店", status: "在线" },
  { id: "kos_5", name: "店长号_春熙路体验店", storeName: "成都春熙店", status: "在线" },
  { id: "kos_6", name: "店长号_武林广场店", storeName: "杭州武林店", status: "在线" },
  { id: "kos_7", name: "店长号_静安寺店", storeName: "上海静安店", status: "在线" },
  { id: "kos_8", name: "店长号_三里屯店", storeName: "北京三里屯店", status: "在线" },
  { id: "kos_9", name: "店长号_光谷店", storeName: "武汉光谷店", status: "在线" },
  { id: "kos_10", name: "店长号_新街口店", storeName: "南京新街口店", status: "在线" },
];

export function CreateProjectWorkstation({
  onClose,
  onCreate,
  mode = "create",
}: {
  onClose: () => void;
  onCreate: (project: any) => void;
  mode?: "create" | "edit";
}) {
  const { createFullOperationsProject } = useProjectStore();

  // Phase management
  const [phase, setPhase] = useState<"input" | "generating" | "plan" | "processing" | "completed">(
    mode === "edit" ? "plan" : "input"
  );

  // Demand Input State
  const [intent, setIntent] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["新品种草", "搜索卡位"]);
  const [selectedCycle, setSelectedCycle] = useState<string>("14天");
  const [hasKocQuestionnaire, setHasKocQuestionnaire] = useState<boolean>(true);
  const [selectedOutput, setSelectedOutput] = useState<string>("生成笔记");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Custom Cycle Number Modal State
  const [showCustomCycleModal, setShowCustomCycleModal] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState<string>("21");

  // Popover & Drawer visibility
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [missingQuestions, setMissingQuestions] = useState({
    product: "",
    targetGoal: "",
    cycle: "14天"
  });

  // Active drawer for editing/viewing
  const [activeEditDrawer, setActiveEditDrawer] = useState<
    "contentRoles" | "kocQuestionnaireConfig" | "kocQuestionnaireQuestions" | "distribution" | "consumerMode" | null
  >(null);

  // Validation Error State for Pre-confirmation check
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // AI Generated Plan State
  const [planData, setPlanData] = useState({
    projectName: "幼犬换粮体验优化及搜索卡位运营项目",
    projectGoal: "验证真实换粮过程与店长专业解答能否增加有效问题评论与搜索咨询，建立幼犬换粮搜索卡位",
    coreStrategy: "KOC真实体验测评 + 店长号专业科普指导 + 评论区私信引导与领样转化",
    successCriteria: "幼犬换粮搜索词前3占位率>20%，笔记互动率>8%",
    goalAndStrategy: "【项目目标】验证真实换粮过程与店长专业解答能否增加有效问题评论与搜索咨询，建立幼犬换粮搜索卡位。\n【核心策略】KOC真实体验测评 + 店长号专业科普指导 + 评论区私信引导与领样转化",
    targetAudience: "3-6个月幼犬初次换粮且对软便、挑食焦虑的精致宠主与宠物新手",
    selectedBrandAccountIds: ["brand_1", "brand_2"],
    brandNotesPerAccount: 2,
    brandFrequency: "每周2篇",
    brandTimeWindow: "18:00—21:00",
    selectedKosAccountIds: ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"],
    kosNotesPerAccount: 1,
    kosFrequency: "每周1篇",
    kosTimeWindow: "18:00—21:00",
    kocCount: 10,
    recruitmentCount: 10,
    packagesPerPerson: 1,
    hasQuestionnaire: true,
    needPhotos: true,
    photoCountRange: "2—4张现场照片",
    claimValidityDays: 7,
    observationDays: 7,
    enableWechatNotice: true,
    kocMode: "内容包" as "内容包" | "预设笔记",
    contentRoles: DEFAULT_CONTENT_ROLES,
    startDate: "2026-08-10",
    endDate: "2026-08-24",
    kocQuestionnaire: {
      enabled: true,
      timing: "发布内容前完成",
      questions: DEFAULT_QUESTIONNAIRE_QUESTIONS
    },
    aiImpactFeedback: ""
  });

  // Single Edit Button Batch Edit State (激活所有可修改选项)
  const [isTableEditMode, setIsTableEditMode] = useState(false);
  const [editablePlanData, setEditablePlanData] = useState({ ...planData });

  // Plan Details Drawer
  const [activeDetailKey, setActiveDetailKey] = useState<string | null>(null);
  const [showDisableQuestionnairePrompt, setShowDisableQuestionnairePrompt] = useState<boolean>(false);

  // Natural Language Adjustment State
  const [aiAdjustInput, setAiAdjustInput] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Post-Confirmation Generated Items
  const [createdProjectId, setCreatedProjectId] = useState<string>("");
  const [generatedNotesList, setGeneratedNotesList] = useState<any[]>([]);
  const [generatedMaterialTasksList, setGeneratedMaterialTasksList] = useState<any[]>([]);
  const [matchedAssetsCount, setMatchedAssetsCount] = useState(12);

  // Asset Task Review Modal State
  const [showAssetTaskReviewModal, setShowAssetTaskReviewModal] = useState(false);

  // Shortcut Options Definition
  const GOAL_OPTIONS = ["新品种草", "搜索卡位", "新号冷启动", "内容增长", "用户共创", "账号诊断"];
  const CYCLE_OPTIONS = ["7天", "14天", "30天", "自定义"];

  // Helper date calculator
  const calculateDays = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 14;
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  // Handle Plan Generation
  const handleGeneratePlan = (customInput?: string) => {
    const textToUse = customInput !== undefined ? customInput : intent;
    
    // Check if input is completely empty and no shortcuts
    if (!textToUse.trim() && selectedGoals.length === 0) {
      setShowMissingInfoDialog(true);
      return;
    }

    setPhase("generating");
    setTimeout(() => {
      // Dynamic plan synthesis based on goal & output selection
      const derivedGoal = selectedGoals.length > 0 ? selectedGoals.join(" + ") : "新品种草";
      let cycleDays = 14;
      if (selectedCycle === "7天") cycleDays = 7;
      else if (selectedCycle === "30天") cycleDays = 30;
      else if (selectedCycle.endsWith("天")) {
        const parsed = parseInt(selectedCycle);
        if (!isNaN(parsed) && parsed > 0) cycleDays = parsed;
      }

      const today = new Date();
      const startDateStr = today.toISOString().split('T')[0];
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + cycleDays);
      const endDateStr = endDate.toISOString().split('T')[0];

      const autoProjectName = textToUse
        ? `${textToUse.slice(0, 14)}...运营项目`
        : `幼犬换粮【${derivedGoal}】与搜索卡位项目`;

      const isPkgOrQuestionnaire = hasKocQuestionnaire || selectedGoals.includes("用户共创");

      const kocC = cycleDays <= 7 ? 6 : 10;
      const brandN = cycleDays <= 7 ? 1 : 2;
      const kosC = cycleDays <= 7 ? 2 : 5;

      const generatedPlan = {
        projectName: autoProjectName,
        goalAndStrategy: textToUse
          ? `【项目目标】${textToUse}\n【核心策略】以【${derivedGoal}】为导向，KOC真实体验测评 + 店长号专业科普卡位`
          : `【项目目标】围绕【${derivedGoal}】，验证真实内容能否带来收藏、评论与搜索咨询转化。\n【核心策略】KOC真实体验测评 + 店长号专业科普指导 + 评论区私信引导与领样`,
        targetAudience: "3-6个月幼犬初次换粮且对软便、挑食焦虑的精致宠主与宠物新手",
        contentRoles: [
          { id: "role_1", role: "品牌号", purpose: "品牌解释与信任承接", count: brandN },
          { id: "role_2", role: "店长号", purpose: "专业科普与问题解答", count: kosC },
          { id: "role_3", role: "KOC", purpose: "真实体验与场景种草", count: kocC },
        ],
        startDate: startDateStr,
        endDate: endDateStr,
        kocQuestionnaire: {
          enabled: isPkgOrQuestionnaire,
          timing: "发布内容前完成",
          questions: DEFAULT_QUESTIONNAIRE_QUESTIONS
        },
        aiImpactFeedback: ""
      };

      setPlanData(generatedPlan);
      setEditablePlanData(generatedPlan);

      setPhase("plan");
    }, 1200);
  };

  // Handle Missing Info Submission
  const handleMissingInfoSubmit = () => {
    setShowMissingInfoDialog(false);
    const combinedIntent = `主推产品：${missingQuestions.product || '幼犬无谷粮'}；核心目标：${missingQuestions.targetGoal || '新品种草与搜索卡位'}；周期：${missingQuestions.cycle}。`;
    setIntent(combinedIntent);
    handleGeneratePlan(combinedIntent);
  };

  // Handle AI Natural Language Plan Adjustment
  const handleApplyAiAdjustment = (presetPrompt?: string) => {
    const promptToUse = presetPrompt || aiAdjustInput;
    if (!promptToUse.trim()) return;

    setIsAdjusting(true);
    setTimeout(() => {
      setIsAdjusting(false);
      setAiAdjustInput("");

      if (promptToUse.includes("15") || promptToUse.includes("减少")) {
        setPlanData(prev => ({
          ...prev,
          contentAndAccounts: "【内容排期】前测3篇 (3天) + 扩大铺量12篇 (11天)，全周期共15篇产出\n【账号分工与产出】KOS店长号(3个): 3篇专业科普笔记；消费者KOC(12个): 12组体验内容包",
          noteCount: 15,
          kocCount: 12,
          kosCount: 3
        }));
      } else if (promptToUse.includes("搜索卡位") || promptToUse.includes("搜索")) {
        setPlanData(prev => ({
          ...prev,
          goalAndStrategy: "【项目目标】聚焦幼犬换粮搜索卡位，强化长尾关键词（如‘换粮软便怎么办’、‘幼犬软便调理’）排名与咨询转化。\n【核心策略】搜索词精准拦截 + 店长权威科普卡位 + 私信领样引导"
        }));
      } else if (promptToUse.includes("品牌号") || promptToUse.includes("店铺号") || promptToUse.includes("账号")) {
        setPlanData(prev => ({
          ...prev,
          contentAndAccounts: `${prev.contentAndAccounts}\n【账号调整】增设1个品牌主号做官方置顶活动，2个店铺号做即时客资转化`,
        }));
      } else if (promptToUse.includes("问卷") || promptToUse.includes("收集")) {
        setPlanData(prev => ({
          ...prev,
          hasQuestionnaire: true,
          questionnaireContent: "1. 宠物月龄/犬种/现有粮\n2. 换粮前软便/拉稀描述\n3. 换粮7天适口性与粪便改善图文反馈\n4. 竞品对比与复购意愿"
        }));
      } else {
        setPlanData(prev => ({
          ...prev,
          goalAndStrategy: `${prev.goalAndStrategy}（已根据需求“${promptToUse}”完成智能全盘微调）`
        }));
      }
    }, 800);
  };

  // Scheme validation helper (方案确认前的数据校验)
  const validateScheme = () => {
    const errors: string[] = [];
    const brandIds = planData.selectedBrandAccountIds || [];
    const kosIds = planData.selectedKosAccountIds || [];
    const brandNotes = Number(planData.brandNotesPerAccount) || 0;
    const kosNotes = Number(planData.kosNotesPerAccount) || 0;
    const kocCount = Number(planData.recruitmentCount ?? planData.kocCount) || 0;

    const totalOwnAccounts = brandIds.length + kosIds.length;
    if (totalOwnAccounts === 0 && kocCount === 0) {
      errors.push("请至少选择 1 个分发账号或设置至少 1 名消费者招募人数");
    }

    if (brandIds.length > 0 && brandNotes < 1) {
      errors.push("已选品牌主号的计划篇数必须 ≥ 1 篇");
    }

    if (kosIds.length > 0 && kosNotes < 1) {
      errors.push("已选KOS店长号的计划篇数必须 ≥ 1 篇");
    }

    if (planData.startDate && planData.endDate) {
      if (new Date(planData.endDate) < new Date(planData.startDate)) {
        errors.push("项目结束日期不能早于开始日期");
      }
    }

    if (kocCount > 0 && planData.needPhotos && !planData.photoCountRange?.trim()) {
      errors.push("开启现场拍照要求时，请指定照片数量要求（如：2—4张现场照片）");
    }

    if (kocCount > 0 && (planData.claimValidityDays ?? 7) < 1) {
      errors.push("消费者领取有效期必须 ≥ 1 天");
    }

    if (kocCount > 0 && (planData.observationDays ?? 7) < 1) {
      errors.push("消费者观察周期必须 ≥ 1 天");
    }

    return errors;
  };

  // Handle Final Confirmation & System Execution
  const handleConfirmAndProcess = () => {
    const errors = validateScheme();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setPhase("processing");

    const brandIds = planData.selectedBrandAccountIds || ["brand_1", "brand_2"];
    const kosIds = planData.selectedKosAccountIds || ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"];
    const brandNotesPerAcc = Number(planData.brandNotesPerAccount) || 2;
    const kosNotesPerAcc = Number(planData.kosNotesPerAccount) || 1;
    const kocCount = Number(planData.recruitmentCount ?? planData.kocCount) || 10;

    const dummyNotes: any[] = [];

    // 1. Generate Own Brand Account Notes
    brandIds.forEach((bId, bIndex) => {
      const brandAcc = MERCHANT_BRAND_ACCOUNTS.find(a => a.id === bId) || MERCHANT_BRAND_ACCOUNTS[bIndex % MERCHANT_BRAND_ACCOUNTS.length];
      for (let i = 0; i < brandNotesPerAcc; i++) {
        dummyNotes.push({
          title: `【品牌官方】${brandAcc.name}：幼犬科学进食指南第${i + 1}期`,
          accountType: "品牌主号" as const,
          accountName: brandAcc.name,
          contentDirection: "品牌权威科普/产品实力解析",
          plannedDate: new Date(Date.now() + (dummyNotes.length % 7) * 86400000).toISOString().split('T')[0],
          targetAudience: planData.targetAudience,
          searchIntent: "品牌正品保障 / 幼犬换粮指南",
          coreExpression: "品牌官方深度科普，无谷高蛋白真鲜肉配方",
          requiredMaterials: ["品牌检测报告特写", "产品包装展示", "高清成分图"],
          materialMatched: true,
          isNotePackage: false
        });
      }
    });

    // 2. Generate Own KOS Account Notes
    kosIds.forEach((kId, kIndex) => {
      const kosAcc = MERCHANT_KOS_ACCOUNTS.find(a => a.id === kId) || MERCHANT_KOS_ACCOUNTS[kIndex % MERCHANT_KOS_ACCOUNTS.length];
      for (let i = 0; i < kosNotesPerAcc; i++) {
        dummyNotes.push({
          title: `【店长科普】${kosAcc.storeName}答疑：幼犬换粮软便挑食怎么办？`,
          accountType: "店长号/KOS" as const,
          accountName: kosAcc.name,
          contentDirection: "店长权威科普/门店顾问专业答疑",
          plannedDate: new Date(Date.now() + (dummyNotes.length % 7) * 86400000).toISOString().split('T')[0],
          targetAudience: planData.targetAudience,
          searchIntent: "幼犬换粮软便排查 / 店长推荐粮",
          coreExpression: "3步科学换粮法，线下门店顾客真实反馈分享",
          requiredMaterials: ["门店环境/白大褂出镜", "倒粮展示", "换粮周期表表单"],
          materialMatched: true,
          isNotePackage: false
        });
      }
    });

    // 3. Generate Consumer KOC Note Packages
    for (let i = 0; i < kocCount; i++) {
      dummyNotes.push({
        title: `【消费者体验】KOC内容包 #${i + 1}：幼犬换粮实测`,
        accountType: "KOC" as const,
        accountName: `待领取 (体验官_${i + 1})`,
        contentDirection: "真实体验与场景种草",
        plannedDate: new Date(Date.now() + (dummyNotes.length % 7) * 86400000).toISOString().split('T')[0],
        targetAudience: planData.targetAudience,
        searchIntent: "真实体验测评 / 幼犬无谷粮便便对比",
        coreExpression: "真实换粮打卡，支持附带包装槽点与客观反馈",
        requiredMaterials: ["食碗与宠物吃粮近景", "真实粪便成型图片", "购买记录或包装照片"],
        materialMatched: false,
        isNotePackage: true,
        packageSpec: {
          needPhotos: planData.needPhotos ?? true,
          photoCountRange: planData.photoCountRange || "2—4张现场照片",
          hasQuestionnaire: planData.hasQuestionnaire ?? true,
          claimValidityDays: planData.claimValidityDays || 7,
          observationDays: planData.observationDays || 7,
          enableWechatNotice: planData.enableWechatNotice ?? true
        }
      });
    }

    // Build complete DistributionScheme payload
    const distributionScheme = {
      ownAccounts: {
        brandAccounts: {
          selectedAccountIds: brandIds,
          notesPerAccount: brandNotesPerAcc,
          publishFrequency: planData.brandFrequency || "每周2篇",
          suggestedTimeWindow: planData.brandTimeWindow || "18:00—21:00"
        },
        kosAccounts: {
          selectedAccountIds: kosIds,
          notesPerAccount: kosNotesPerAcc,
          publishFrequency: planData.kosFrequency || "每周1篇",
          suggestedTimeWindow: planData.kosTimeWindow || "18:00—21:00"
        }
      },
      consumerKoc: {
        recruitmentCount: kocCount,
        packagesPerPerson: planData.packagesPerPerson || 1,
        hasQuestionnaire: planData.hasQuestionnaire ?? true,
        needPhotos: planData.needPhotos ?? true,
        photoCountRange: planData.photoCountRange || "2—4张现场照片",
        claimValidityDays: planData.claimValidityDays || 7,
        observationDays: planData.observationDays || 7,
        enableWechatNotice: planData.enableWechatNotice ?? true
      },
      aiSuggestion: "品牌主号负责权威解释，KOS账号负责门店真实体验，消费者KOC负责个体反馈与搜索内容覆盖。"
    };

    // Prepare Asset Tasks (Pending Review - 待发布)
    const dummyMaterialTasks = [
      {
        reqs: "幼犬换粮真实体验与便便改善前后对比",
        usageScenario: "居家客厅/犬舍喂食真实记录",
        specs: "4K 60fps 竖屏视频 / 高清无滤镜图片",
        assignee: "待派发 (审核后确定)",
        status: "待发布" as const,
        associatedNoteIndices: [0, 1, 2, 3, 4]
      },
      {
        reqs: "店长白大褂专业出镜答疑与成分检测报告扫描",
        usageScenario: "门店吧台/宠物医院背景",
        specs: "1080P 竖屏视频 + 检测报告高清图",
        assignee: "张店长",
        status: "待发布" as const,
        associatedNoteIndices: [5, 6, 7]
      },
      {
        reqs: "幼犬粮颗粒硬度、复水速度与拉链密封特写",
        usageScenario: "桌面近景微距拍摄",
        specs: "4K 细节微距特写",
        assignee: "待派发 (审核后确定)",
        status: "待发布" as const,
        associatedNoteIndices: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
      }
    ];

    setGeneratedNotesList(dummyNotes);
    setGeneratedMaterialTasksList(dummyMaterialTasks);

    setTimeout(() => {
      // Save project into context store
      const newId = createFullOperationsProject({
        name: planData.projectName,
        goal: planData.projectGoal || "幼犬换粮体验优化与搜索卡位",
        status: "进行中",
        startDate: planData.startDate || "2026-08-10",
        endDate: planData.endDate || "2026-08-24",
        budget: "8,000元",
        distributionScheme: distributionScheme,
        strategyProtocol: {
          targetAudience: planData.targetAudience,
          coreProblem: planData.projectGoal,
          solutionSummary: planData.coreStrategy,
          verifyHypothesis: planData.successCriteria,
          continueCondition: "爆文率>15% 且转客率提升",
          stopCondition: "爆文率<3%"
        },
        notes: dummyNotes,
        materialTasks: dummyMaterialTasks,
        matchedAssetsCount: 12
      });

      setCreatedProjectId(newId);
      setPhase("completed");
    }, 1800);
  };

  return (
    <div className="h-full w-full bg-[#f8f9fa] flex flex-col relative text-neutral-900 font-sans overflow-hidden">
      
      {/* Top Header Navigation Bar */}
      <div className="h-14 bg-white border-b border-neutral-200/80 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="h-4 w-px bg-neutral-200" />
          <div>
            <h1 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
              新建运营项目
              {phase === "plan" && (
                <span className="text-[11px] font-normal px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full">
                  AI推荐方案 (待确认)
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Back to Input when in Plan stage */}
        {phase === "plan" && (
          <button
            onClick={() => setPhase("input")}
            className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
          >
            返回修改需求
          </button>
        )}
      </div>

      {/* Main Single Column Container */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${phase === "plan" ? "max-w-[1240px]" : "max-w-[880px]"} mx-auto py-8 px-6 transition-all duration-300`}>

          {/* ==================================================== */}
          {/* PHASE 1: DEMAND INPUT AREA (需求输入区)              */}
          {/* ==================================================== */}
          {phase === "input" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Page Subtitle Header */}
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-neutral-900 tracking-tight">
                  描述本轮运营需求
                </h2>
                <p className="text-[13px] text-neutral-500">
                  描述本轮想解决的问题，AI 将结合当前商家资料生成推荐方案。
                </p>
              </div>

              {/* Natural Language Textarea Box */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all">
                <textarea
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  rows={4}
                  placeholder="例如：计划用两周时间为新品做一轮小红书种草，重点验证真实体验内容能否带来收藏、评论和搜索咨询。"
                  className="w-full p-5 text-[14px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 outline-none resize-none"
                />

                {/* Displayed Selected Shortcut Tags Pill Area inside/below textarea */}
                <div className="px-5 py-3 bg-neutral-50/80 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] text-neutral-400 font-medium">已带入快捷条件:</span>
                    {selectedGoals.map((goal) => (
                      <span key={goal} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[12px] font-medium text-neutral-800 shadow-2xs">
                        目标：{goal}
                        <button
                          onClick={() => setSelectedGoals(prev => prev.filter(g => g !== goal))}
                          className="hover:text-neutral-900 text-neutral-400 ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {selectedCycle && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[12px] font-medium text-neutral-800 shadow-2xs">
                        周期：{selectedCycle}
                      </span>
                    )}
                    {selectedOutput && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[12px] font-medium text-neutral-800 shadow-2xs">
                        产出：{selectedOutput}
                      </span>
                    )}
                    {attachments.map((att) => (
                      <span key={att.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[12px] font-medium">
                        <Paperclip size={12} /> {att.name}
                        <button onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))} className="hover:text-blue-900">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Material Entrance */}
                  <button
                    onClick={() => setShowAddMaterial(true)}
                    className="text-[12px] font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 hover:underline shrink-0"
                  >
                    <Plus size={14} /> 添加资料
                  </button>
                </div>
              </div>

              {/* Quick Shortcut Selections (常用快捷选择) */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 space-y-4 shadow-2xs">
                <div className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                  <ListFilter size={15} className="text-neutral-500" />
                  常用快捷选择 (点击快速补充)
                </div>

                {/* 1. 主要目标 (支持多选) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-neutral-500">主要目标 (可多选)</span>
                    <span className="text-[11px] text-neutral-400">已选 {selectedGoals.length} 项</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_OPTIONS.map((goal) => {
                      const isSelected = selectedGoals.includes(goal);
                      return (
                        <button
                          key={goal}
                          onClick={() => {
                            let nextGoals: string[];
                            if (isSelected) {
                              nextGoals = selectedGoals.filter(g => g !== goal);
                            } else {
                              nextGoals = [...selectedGoals, goal];
                            }
                            setSelectedGoals(nextGoals);
                            if (goal === "用户共创" && !isSelected) {
                              setHasKocQuestionnaire(true);
                              setSelectedOutput("生成内容包");
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all ${
                            isSelected
                              ? "bg-neutral-900 text-white shadow-2xs"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                          }`}
                        >
                          {isSelected ? `✓ ${goal}` : goal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. 项目周期 */}
                <div>
                  <div className="text-[12px] font-medium text-neutral-500 mb-2">项目周期</div>
                  <div className="flex flex-wrap gap-2">
                    {CYCLE_OPTIONS.map((cycle) => {
                      const isCustomActive = cycle === "自定义" && !["7天", "14天", "30天"].includes(selectedCycle);
                      const isSelected = selectedCycle === cycle || isCustomActive;

                      return (
                        <button
                          key={cycle}
                          onClick={() => {
                            if (cycle === "自定义") {
                              setShowCustomCycleModal(true);
                            } else {
                              setSelectedCycle(selectedCycle === cycle ? "" : cycle);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1 ${
                            isSelected
                              ? "bg-neutral-900 text-white shadow-2xs"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                          }`}
                        >
                          {cycle === "自定义" && isCustomActive ? `自定义 (${selectedCycle})` : cycle}
                          {cycle === "自定义" && <ChevronRight size={13} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. 需求关联判断：素人账号问卷 (仅开启时才生成内容包，无需手动选笔记/内容包) */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="koc-questionnaire-toggle"
                        checked={hasKocQuestionnaire || selectedGoals.includes("用户共创")}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setHasKocQuestionnaire(checked);
                          setSelectedOutput(checked ? "生成内容包" : "生成笔记");
                        }}
                        className="w-4 h-4 text-neutral-900 rounded focus:ring-neutral-400 border-neutral-300 accent-neutral-900 cursor-pointer"
                      />
                      <label htmlFor="koc-questionnaire-toggle" className="text-[12.5px] font-medium text-neutral-800 cursor-pointer select-none">
                        需判断/收集素人账号与KOC体验问卷
                        <span className="ml-1 text-[11px] text-neutral-500 font-normal">
                          (勾选后将自动判定产出为<span className="font-bold text-amber-700">生成内容包</span>)
                        </span>
                      </label>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                      hasKocQuestionnaire || selectedGoals.includes("用户共创")
                        ? "bg-amber-100 text-amber-800 border border-amber-200/80"
                        : "bg-neutral-200/80 text-neutral-600"
                    }`}>
                      {hasKocQuestionnaire || selectedGoals.includes("用户共创") ? "产出：生成内容包" : "产出：生成笔记"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Automatically Used System Information Notice */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100/70 border border-neutral-200/60 rounded-xl text-[12px] text-neutral-600">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-neutral-400 shrink-0" />
                  <span>AI 将自动使用当前商家、品牌产品、账号资源和知识资料。</span>
                </div>
                <button
                  onClick={() => setShowSystemInfo(!showSystemInfo)}
                  className="text-neutral-700 font-medium hover:underline hover:text-neutral-900 shrink-0"
                >
                  查看
                </button>
              </div>

              {/* Collapsible System Info Preview */}
              {showSystemInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-white border border-neutral-200 rounded-xl space-y-3 text-[12px]"
                >
                  <div className="font-bold text-neutral-800">当前系统自动读取的背景画像：</div>
                  <div className="grid grid-cols-2 gap-3 text-neutral-600">
                    <div>• <span className="font-medium text-neutral-800">商家品牌：</span>萌宠乐园官方主营店</div>
                    <div>• <span className="font-medium text-neutral-800">核心产品：</span>幼犬无谷高蛋白鲜肉粮</div>
                    <div>• <span className="font-medium text-neutral-800">可用账号：</span>1个品牌号、2个店长号、20个合作KOC</div>
                    <div>• <span className="font-medium text-neutral-800">知识资料：</span>《幼犬换粮指南》《产品质检报告》</div>
                  </div>
                </motion.div>
              )}

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleGeneratePlan()}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[14px] rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} className="text-amber-300" />
                  AI生成方案
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* PHASE 2: GENERATING ANIMATION                        */}
          {/* ==================================================== */}
          {phase === "generating" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center space-y-5 my-12 shadow-2xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 animate-pulse">
                <Sparkles size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-neutral-900">AI正在结合商家资料生成推荐方案...</h3>
                <p className="text-[13px] text-neutral-500">
                  正在读取商品知识库、匹配账号资源与过往表现数据
                </p>
              </div>
              <div className="w-48 h-1.5 bg-neutral-100 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="w-full h-full bg-neutral-900 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* PHASE 3: AI PLAN RESULT (AI方案结果)                 */}
          {/* ==================================================== */}
          {phase === "plan" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Validation Error Banner */}
              {validationErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1.5 animate-shake">
                  <div className="text-[13px] font-bold text-rose-900 flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    请修正以下配置问题后再确认方案：
                  </div>
                  <ul className="list-disc list-inside text-[12.5px] text-rose-800 space-y-0.5 pl-1 font-medium">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Header Description */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[13px] text-amber-900 leading-relaxed">
                  <span className="font-bold">推荐方案已生成：</span>
                  已综合商家画像、知识资料与账号资源。结果项支持<span className="font-bold underline">直接修改</span>，或在底部输入框用自然语言调整全盘。
                </div>
              </div>

              {/* 8 Structured Result Items Table/List */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                {/* Table Header with Single "编辑修改" Toggle Button */}
                <div className="px-5 py-3.5 bg-neutral-50/80 border-b border-neutral-200 flex items-center justify-between">
                  <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-2">
                    <Layers size={15} className="text-neutral-500" />
                    AI 推荐方案配置明细
                    {isTableEditMode && (
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                        编辑模式 (所有选项已激活)
                      </span>
                    )}
                  </div>

                  {/* Single button to activate all editable options */}
                  {isTableEditMode ? (
                    <button
                      onClick={() => {
                        setPlanData({ ...editablePlanData });
                        setIsTableEditMode(false);
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} /> 保存修改
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditablePlanData({ ...planData });
                        setIsTableEditMode(true);
                      }}
                      className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12px] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Edit2 size={13} /> 编辑修改
                    </button>
                  )}
                </div>

                <div className="divide-y divide-neutral-100">
                  {/* Item 1: 项目名称 */}
                  <PlanResultRow
                    title="项目名称"
                    value={
                      isTableEditMode ? (
                        <input
                          type="text"
                          value={editablePlanData.projectName}
                          onChange={(e) => setEditablePlanData({ ...editablePlanData, projectName: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-[13px] text-neutral-900 focus:bg-white focus:border-neutral-500 font-sans font-bold outline-none"
                        />
                      ) : (
                        <span className="font-bold text-neutral-900">{planData.projectName}</span>
                      )
                    }
                    onOpenDetail={() => setActiveDetailKey("name")}
                  />

                  {/* Item 2: 运营策略 */}
                  <PlanResultRow
                    title="运营策略"
                    value={
                      isTableEditMode ? (
                        <textarea
                          rows={3}
                          value={editablePlanData.goalAndStrategy}
                          onChange={(e) => setEditablePlanData({ ...editablePlanData, goalAndStrategy: e.target.value })}
                          className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-[13px] text-neutral-900 focus:bg-white focus:border-neutral-500 font-sans outline-none"
                        />
                      ) : (
                        <span className="whitespace-pre-wrap">{planData.goalAndStrategy}</span>
                      )
                    }
                    onOpenDetail={() => setActiveDetailKey("goalAndStrategy")}
                  />

                  {/* Item 3: 目标用户 */}
                  <PlanResultRow
                    title="目标用户"
                    value={
                      isTableEditMode ? (
                        <textarea
                          rows={2}
                          value={editablePlanData.targetAudience}
                          onChange={(e) => setEditablePlanData({ ...editablePlanData, targetAudience: e.target.value })}
                          className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-[13px] text-neutral-900 focus:bg-white focus:border-neutral-500 font-sans outline-none"
                        />
                      ) : (
                        <span>{planData.targetAudience}</span>
                      )
                    }
                    onOpenDetail={() => setActiveDetailKey("targetAudience")}
                  />

                  {/* Item 4: 内容安排 */}
                  <PlanResultRow
                    title="内容安排"
                    value={
                      (() => {
                        const brandAccountIds = planData.selectedBrandAccountIds || ["brand_1", "brand_2"];
                        const kosAccountIds = planData.selectedKosAccountIds || ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"];
                        const kocCount = planData.kocCount ?? 10;
                        const kocMode = planData.kocMode || "内容包";
                        const accountConfigs = planData.accountConfigs || {};

                        // 计算品牌号总篇数
                        const totalBrandNotesCalculated = brandAccountIds.reduce(
                          (sum: number, id: string) => sum + (accountConfigs[id]?.notesCount ?? (planData.brandNotesPerAccount ?? 2)),
                          0
                        );

                        // 计算KOS员工号总篇数
                        const totalKosNotesCalculated = kosAccountIds.reduce(
                          (sum: number, id: string) => sum + (accountConfigs[id]?.notesCount ?? (planData.kosNotesPerAccount ?? 1)),
                          0
                        );

                        const totalNotes = totalBrandNotesCalculated + totalKosNotesCalculated + kocCount;

                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                              <span className="font-bold text-neutral-900 text-[13px]">
                                内容安排　共{totalNotes}篇/包
                              </span>
                              <span className="text-[11.5px] font-medium text-neutral-500">
                                调整账号篇数与频次请点击右侧“分发与招募配置”
                              </span>
                            </div>

                            {/* Clean Table: Available accounts and assigned counts */}
                            <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white text-[13px]">
                              <table className="w-full border-collapse table-fixed">
                                <thead>
                                  <tr className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200 text-[12.5px]">
                                    <th className="py-3 px-5 text-left w-[160px]">账号类型</th>
                                    <th className="py-3 px-5 text-left">分配 / 可用账号明细</th>
                                    <th className="py-3 px-5 text-right w-[240px]">产出形式与数量</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                                  {/* Row 1: 品牌主号 */}
                                  <tr className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="py-3.5 px-5 font-bold text-neutral-900 align-top">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 inline-block shrink-0" />
                                        <span>品牌主号</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-neutral-600 align-top">
                                      <div className="font-semibold text-neutral-800">
                                        已选 {brandAccountIds.length}/{MERCHANT_BRAND_ACCOUNTS.length} 个品牌账号
                                      </div>
                                      <div className="text-neutral-500 text-[12px] mt-1 leading-snug">
                                        ({MERCHANT_BRAND_ACCOUNTS.filter(a => brandAccountIds.includes(a.id)).map(a => a.name).join('、') || '未选择'})
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-right font-bold text-neutral-900 align-top">
                                      {totalBrandNotesCalculated} 篇笔记
                                      <span className="text-[12px] text-neutral-500 font-normal block mt-0.5">
                                        (按账号人设分布)
                                      </span>
                                    </td>
                                  </tr>

                                  {/* Row 2: KOS员工号 */}
                                  <tr className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="py-3.5 px-5 font-bold text-neutral-900 align-top">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block shrink-0" />
                                        <span>KOS员工号</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-neutral-600 align-top">
                                      <div className="font-semibold text-neutral-800">
                                        已选 {kosAccountIds.length}/{MERCHANT_KOS_ACCOUNTS.length} 个KOS员工号
                                      </div>
                                      <div className="text-neutral-500 text-[12px] mt-1 leading-snug">
                                        ({MERCHANT_KOS_ACCOUNTS.filter(a => kosAccountIds.includes(a.id)).map(a => a.name).join('、') || '未选择'})
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-right font-bold text-neutral-900 align-top">
                                      {totalKosNotesCalculated} 篇笔记
                                      <span className="text-[12px] text-neutral-500 font-normal block mt-0.5">
                                        (按门店岗位分布)
                                      </span>
                                    </td>
                                  </tr>

                                  {/* Row 3: 消费者KOC */}
                                  <tr className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="py-3.5 px-5 font-bold text-neutral-900 align-top">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-500 inline-block shrink-0" />
                                        <span>消费者KOC</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-neutral-600 align-top">
                                      <div className="font-semibold text-neutral-800">
                                        拟招募 {kocCount} 名体验官 / KOC
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-right font-bold text-neutral-900 align-top">
                                      {kocCount} 组
                                      <span className="text-[12px] text-neutral-500 font-normal block mt-0.5">
                                        ({kocMode === "预设笔记" ? "预设笔记" : "试用体验内容包"})
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Bottom AI Suggestion */}
                            <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[12px] text-amber-900 font-medium flex items-center gap-2">
                              <Sparkles size={14} className="text-amber-600 shrink-0" />
                              <span>AI建议：以KOC真实体验内容包为主，配合KOS员工号专业解读与品牌号信任承接。</span>
                            </div>
                          </div>
                        );
                      })()
                    }
                    customActions={
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveEditDrawer("distribution")}
                          className="text-[12px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                        >
                          自有账号分发配置
                        </button>
                        <button
                          onClick={() => setActiveEditDrawer("consumerMode")}
                          className="text-[12px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                        >
                          消费者招募配置
                        </button>
                      </div>
                    }
                  />

                  {/* Item 5: 项目周期 */}
                  <PlanResultRow
                    title="项目周期"
                    value={
                      isTableEditMode ? (
                        <div className="flex flex-wrap items-center gap-3 py-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-neutral-500 font-medium">开始日期:</span>
                            <input
                              type="date"
                              value={editablePlanData.startDate}
                              onChange={(e) => setEditablePlanData({ ...editablePlanData, startDate: e.target.value })}
                              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-[12.5px] font-bold text-neutral-900 outline-none focus:bg-white focus:border-neutral-500"
                            />
                          </div>
                          <span className="text-neutral-400 font-bold">至</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-neutral-500 font-medium">结束日期:</span>
                            <input
                              type="date"
                              value={editablePlanData.endDate}
                              onChange={(e) => setEditablePlanData({ ...editablePlanData, endDate: e.target.value })}
                              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-[12.5px] font-bold text-neutral-900 outline-none focus:bg-white focus:border-neutral-500"
                            />
                          </div>
                          <span className="text-[12px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                            共 {calculateDays(editablePlanData.startDate, editablePlanData.endDate)} 天
                          </span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>{planData.startDate} 至 {planData.endDate}</span>
                          <span className="text-[12px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                            (共 {calculateDays(planData.startDate, planData.endDate)} 天)
                          </span>
                        </span>
                      )
                    }
                    onOpenDetail={() => setActiveDetailKey("cycle")}
                  />

                  {/* Item 6: KOC真实体验采集 */}
                  <PlanResultRow
                    title="KOC真实体验采集"
                    value={
                      (() => {
                        const kocCount = planData.kocCount ?? 10;
                        const isQActive = planData.kocQuestionnaire?.enabled && kocCount > 0;
                        const qList = planData.kocQuestionnaire?.questions || DEFAULT_QUESTIONNAIRE_QUESTIONS;

                        return isQActive ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold rounded-md">
                                <Check size={12} /> KOC真实体验采集　已开启
                              </span>
                              <span className="text-[12px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                                预计{kocCount}人参与 · {qList.length}个问题 · {planData.kocQuestionnaire?.timing || "发布内容前完成"}
                              </span>
                            </div>
                            <p className="text-[12px] text-neutral-600 leading-relaxed">
                              收集参与者的真实背景、选择原因、使用过程和实际感受，为KOC内容提供差异化事实依据。
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 text-[11px] font-bold rounded-md">
                                KOC真实体验采集　暂不需要
                              </span>
                              <p className="text-[12px] text-neutral-400">当前方案未包含KOC体验内容</p>
                            </div>
                          </div>
                        );
                      })()
                    }
                    customActions={
                      (() => {
                        const kocCount = planData.kocCount ?? 10;
                        const isQActive = planData.kocQuestionnaire?.enabled && kocCount > 0;

                        return isQActive ? (
                          <button
                            onClick={() => setActiveDetailKey("kocQuestionnaireDetail")}
                            className="text-[12px] font-medium text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                          >
                            查看详情
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setPlanData(prev => ({
                                ...prev,
                                kocQuestionnaire: {
                                  ...prev.kocQuestionnaire,
                                  enabled: true
                                }
                              }));
                              setActiveDetailKey("kocQuestionnaireDetail");
                            }}
                            className="px-3.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12px] rounded-lg transition-colors"
                          >
                            开启
                          </button>
                        );
                      })()
                    }
                  />
                </div>
              </div>

              {/* Bottom Actions Bar (确认方案) */}
              <div className="pt-2 flex items-center justify-end border-t border-neutral-200/80">
                <button
                  onClick={handleConfirmAndProcess}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                >
                  确认方案并{selectedOutput === "生成内容包" ? "生成内容包" : "生成笔记"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* PHASE 4: POST-CONFIRMATION PROCESSING               */}
          {/* ==================================================== */}
          {phase === "processing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-neutral-200 p-10 my-10 shadow-2xs space-y-6 max-w-lg mx-auto"
            >
              <div className="text-center space-y-1">
                <h3 className="text-[17px] font-bold text-neutral-900">系统正在创建运营项目</h3>
                <p className="text-[13px] text-neutral-500">正在初始化方案、排期笔记与匹配素材库...</p>
              </div>

              <div className="space-y-3 pt-2 text-[13px]">
                <ExecutionCheckStep text="创建运营项目" done />
                <ExecutionCheckStep text="保存已确认方案" done />
                <ExecutionCheckStep text="生成对应的笔记与内容包" done />
                <ExecutionCheckStep text="自动匹配素材库" done />
                <ExecutionCheckStep text="对缺少的素材生成“待发布”素材任务" done />
                <ExecutionCheckStep text="完成项目创建" done />
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* PHASE 5: COMPLETION SUMMARY PAGE (项目创建完成)     */}
          {/* ==================================================== */}
          {phase === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl mx-auto my-4"
            >
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-emerald-950">项目创建完成！</h2>
                  <p className="text-[13px] text-emerald-700 mt-0.5">
                    项目名称：<span className="font-bold">{planData.projectName}</span>
                  </p>
                </div>
              </div>

              {/* 3 Metric Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center shadow-2xs">
                  <div className="text-[28px] font-bold text-neutral-900">{generatedNotesList.length}</div>
                  <div className="text-[12px] font-medium text-neutral-500 mt-0.5">已生成笔记/内容包</div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center shadow-2xs">
                  <div className="text-[28px] font-bold text-emerald-600">{matchedAssetsCount}</div>
                  <div className="text-[12px] font-medium text-neutral-500 mt-0.5">已自动匹配素材</div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center shadow-2xs">
                  <div className="text-[28px] font-bold text-amber-600">{generatedMaterialTasksList.length}</div>
                  <div className="text-[12px] font-medium text-neutral-500 mt-0.5">待审核素材任务 (待发布)</div>
                </div>
              </div>

              {/* Next Step Recommendation */}
              <div className="bg-neutral-100/80 border border-neutral-200/80 rounded-2xl p-4 text-[13px] text-neutral-700 flex items-start gap-2.5">
                <Info size={16} className="text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">下一步推荐：</span>
                  建议下一步先审核待发布的素材任务。确认拍摄要求和执行人员后，即可正式派发。
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowAssetTaskReviewModal(true)}
                  className="flex-1 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-bold text-[14px] rounded-2xl shadow-2xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> 审核素材任务
                </button>

                <button
                  onClick={() => {
                    onCreate({ id: createdProjectId, name: planData.projectName });
                    onClose();
                  }}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[14px] rounded-2xl shadow-2xs transition-colors flex items-center justify-center gap-2"
                >
                  进入项目 <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* ==================================================== */}
      {/* MODALS & DRAWERS                                     */}
      {/* ==================================================== */}
      <AnimatePresence>

        {/* Custom Cycle Days Modal */}
        {showCustomCycleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                  <Calendar size={16} className="text-neutral-500" />
                  设置自定义项目周期
                </h3>
                <button onClick={() => setShowCustomCycleModal(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-[12px] font-medium text-neutral-600">
                  请输入推进天数（如 7-90 天）：
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={customDaysInput}
                    onChange={(e) => setCustomDaysInput(e.target.value)}
                    placeholder="例如：21"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[14px] font-bold text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-all"
                  />
                  <span className="text-[13px] font-bold text-neutral-600">天</span>
                </div>

                {/* Quick preset chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["10", "21", "45", "60", "90"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCustomDaysInput(preset)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg transition-colors"
                    >
                      {preset}天
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCustomCycleModal(false)}
                  className="px-4 py-2 text-[13px] text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const days = parseInt(customDaysInput, 10);
                    if (!isNaN(days) && days > 0) {
                      setSelectedCycle(`${days}天`);
                    }
                    setShowCustomCycleModal(false);
                  }}
                  className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 shadow-2xs"
                >
                  确认设置
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 1. Missing Info 3-Question Dialog */}
        {showMissingInfoDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-neutral-900">请快速补充关键信息</h3>
                <button onClick={() => setShowMissingInfoDialog(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-[13px]">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">1. 本轮主要推广的产品或服务是什么？</label>
                  <input
                    type="text"
                    value={missingQuestions.product}
                    onChange={(e) => setMissingQuestions({ ...missingQuestions, product: e.target.value })}
                    placeholder="例如：幼犬无谷高蛋白鲜肉粮"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">2. 本轮最希望解决的核心目标是什么？</label>
                  <input
                    type="text"
                    value={missingQuestions.targetGoal}
                    onChange={(e) => setMissingQuestions({ ...missingQuestions, targetGoal: e.target.value })}
                    placeholder="例如：解决软便疑虑与搜索卡位"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">3. 预计推进的周期是多久？</label>
                  <select
                    value={missingQuestions.cycle}
                    onChange={(e) => setMissingQuestions({ ...missingQuestions, cycle: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white outline-none"
                  >
                    <option value="7天">7天</option>
                    <option value="14天">14天</option>
                    <option value="30天">30天</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowMissingInfoDialog(false)}
                  className="px-4 py-2 text-[13px] text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl"
                >
                  取消
                </button>
                <button
                  onClick={handleMissingInfoSubmit}
                  className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800"
                >
                  确认生成
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. Add Supplementary Material Modal */}
        {showAddMaterial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-neutral-900">添加补充资料</h3>
                <button onClick={() => setShowAddMaterial(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-[13px]">
                <p className="text-neutral-500">上传临时产品资料、活动要求或限制说明：</p>
                <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-neutral-400 transition-colors cursor-pointer bg-neutral-50/50">
                  <UploadCloud size={32} className="mx-auto text-neutral-400 mb-2" />
                  <div className="font-medium text-neutral-700">点击上传文件或拖拽放置</div>
                  <div className="text-[11px] text-neutral-400 mt-1">支持 PDF, DOCX, TXT, PNG</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setAttachments(prev => [...prev, { id: `att-${Date.now()}`, type: "file", name: "活动规则与限制说明.pdf" }]);
                    setShowAddMaterial(false);
                  }}
                  className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800"
                >
                  模拟上传完成
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. Plan Item View Details Drawer (查看详情并修改) */}
        {activeDetailKey && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailKey(null)}
              className="fixed inset-0 bg-neutral-900/20 z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col p-6 space-y-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 shrink-0">
                <h3 className="text-[16px] font-bold text-neutral-900">AI推荐依据与实时配置修改</h3>
                <button onClick={() => setActiveDetailKey(null)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
                  <X size={18} />
                </button>
              </div>

              <DetailDrawerContent
                itemKey={activeDetailKey}
                planData={planData}
                onUpdatePlanData={(updated) => {
                  setPlanData(updated);
                  setEditablePlanData(updated);
                }}
                onClose={() => setActiveDetailKey(null)}
              />
            </motion.div>
          </>
        )}

        {/* 5. Asset Task Review Modal (素材任务审核) */}
        {showAssetTaskReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-[16px] font-bold text-neutral-900">待发布素材任务审核</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">自动生成的素材任务需人工确认后才会正式派发给执行人员</p>
                </div>
                <button onClick={() => setShowAssetTaskReviewModal(false)} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {generatedMaterialTasksList.map((task, idx) => (
                  <div key={idx} className="p-5 border border-neutral-200 rounded-2xl space-y-3 bg-neutral-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[11px] font-bold">待发布</span>
                        <h4 className="font-bold text-[14px] text-neutral-900">{task.reqs}</h4>
                      </div>
                      <span className="text-[12px] text-neutral-500">服务于 {task.associatedNoteIndices.length} 篇笔记</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[12px] text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200/80">
                      <div><span className="font-bold text-neutral-800">使用场景：</span>{task.usageScenario}</div>
                      <div><span className="font-bold text-neutral-800">规格要求：</span>{task.specs}</div>
                      <div><span className="font-bold text-neutral-800">拟派发人员：</span>{task.assignee}</div>
                      <div><span className="font-bold text-neutral-800">可复用范围：</span>跨笔记自动关联共享</div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button className="px-3 py-1.5 border border-neutral-200 bg-white text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-100">
                        修改要求
                      </button>
                      <button
                        onClick={() => {
                          alert(`素材任务“${task.reqs}”已审核发布！`);
                        }}
                        className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-bold rounded-lg hover:bg-neutral-800"
                      >
                        确认发布任务
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-neutral-200 flex justify-between items-center bg-neutral-50 shrink-0">
                <span className="text-[12px] text-neutral-500">已发布任务可在素材中心随时调整执行状态</span>
                <button
                  onClick={() => setShowAssetTaskReviewModal(false)}
                  className="px-5 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl"
                >
                  完成审核
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 6. Content Roles Edit Drawer */}
        {activeEditDrawer === "contentRoles" && (
          <ContentRolesDrawer
            planData={planData}
            onSave={(newRoles, disablePromptNeeded) => {
              setPlanData(prev => ({
                ...prev,
                contentRoles: newRoles
              }));
              setEditablePlanData(prev => ({
                ...prev,
                contentRoles: newRoles
              }));
              setActiveEditDrawer(null);
              if (disablePromptNeeded) {
                setShowDisableQuestionnairePrompt(true);
              }
            }}
            onClose={() => setActiveEditDrawer(null)}
          />
        )}

        {/* 7. KOC Questionnaire Config Drawer */}
        {activeEditDrawer === "kocQuestionnaireConfig" && (
          <KocQuestionnaireConfigDrawer
            planData={planData}
            onSave={(newConfig) => {
              setPlanData(prev => ({
                ...prev,
                kocQuestionnaire: {
                  ...prev.kocQuestionnaire,
                  ...newConfig
                }
              }));
              setEditablePlanData(prev => ({
                ...prev,
                kocQuestionnaire: {
                  ...prev.kocQuestionnaire,
                  ...newConfig
                }
              }));
              setActiveEditDrawer(null);
            }}
            onOpenQuestions={() => setActiveEditDrawer("kocQuestionnaireQuestions")}
            onClose={() => setActiveEditDrawer(null)}
          />
        )}

        {/* 8. KOC Questionnaire Questions Drawer */}
        {activeEditDrawer === "kocQuestionnaireQuestions" && (
          <KocQuestionnaireQuestionsDrawer
            questions={planData.kocQuestionnaire?.questions || DEFAULT_QUESTIONNAIRE_QUESTIONS}
            onSave={(newQuestions) => {
              setPlanData(prev => ({
                ...prev,
                kocQuestionnaire: {
                  ...prev.kocQuestionnaire,
                  questions: newQuestions
                }
              }));
              setEditablePlanData(prev => ({
                ...prev,
                kocQuestionnaire: {
                  ...prev.kocQuestionnaire,
                  questions: newQuestions
                }
              }));
              setActiveEditDrawer(null);
            }}
            onClose={() => setActiveEditDrawer(null)}
          />
        )}

        {/* Distribution Config Drawer */}
        {activeEditDrawer === "distribution" && (
          <DistributionDrawer
            initialConfig={{
              matrixAccountIds: [
                ...(planData.selectedBrandAccountIds || ["brand_1", "brand_2"]),
                ...(planData.selectedKosAccountIds || ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"])
              ],
              notesPerAccountRequirement: planData.notesPerAccountRequirement || "单账号 2 篇",
              publishFrequencyRequirement: planData.publishFrequencyRequirement || planData.brandFrequency || "每周 2 篇",
              publishTimeWindowRequirement: planData.publishTimeWindowRequirement || planData.brandTimeWindow || "18:00—21:00",
              additionalRequirements: planData.additionalRequirements || "各矩阵账号统一配图视觉基调",
              brandAccountIds: planData.selectedBrandAccountIds || ["brand_1", "brand_2"],
              brandNotesPerAccount: planData.brandNotesPerAccount ?? 2,
              brandFrequency: planData.brandFrequency || "每周 2 篇",
              brandTimeWindow: planData.brandTimeWindow || "18:00—21:00",
              kosAccountIds: planData.selectedKosAccountIds || ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"],
              kosNotesPerAccount: planData.kosNotesPerAccount ?? 1,
              kosFrequency: planData.kosFrequency || "每周 1 篇",
              kosTimeWindow: planData.kosTimeWindow || "18:00—21:00",
              kocCount: planData.kocCount ?? 10
            }}
            onSave={(newConfig: DistributionConfig) => {
              setPlanData((prev: any) => ({
                ...prev,
                matrixAccountIds: newConfig.matrixAccountIds,
                notesPerAccountRequirement: newConfig.notesPerAccountRequirement,
                publishFrequencyRequirement: newConfig.publishFrequencyRequirement,
                publishTimeWindowRequirement: newConfig.publishTimeWindowRequirement,
                additionalRequirements: newConfig.additionalRequirements,
                selectedBrandAccountIds: newConfig.brandAccountIds,
                brandNotesPerAccount: newConfig.brandNotesPerAccount,
                brandFrequency: newConfig.brandFrequency,
                brandTimeWindow: newConfig.brandTimeWindow,
                selectedKosAccountIds: newConfig.kosAccountIds,
                kosNotesPerAccount: newConfig.kosNotesPerAccount,
                kosFrequency: newConfig.kosFrequency,
                kosTimeWindow: newConfig.kosTimeWindow,
              }));
              setEditablePlanData((prev: any) => ({
                ...prev,
                matrixAccountIds: newConfig.matrixAccountIds,
                notesPerAccountRequirement: newConfig.notesPerAccountRequirement,
                publishFrequencyRequirement: newConfig.publishFrequencyRequirement,
                publishTimeWindowRequirement: newConfig.publishTimeWindowRequirement,
                additionalRequirements: newConfig.additionalRequirements,
                selectedBrandAccountIds: newConfig.brandAccountIds,
                brandNotesPerAccount: newConfig.brandNotesPerAccount,
                brandFrequency: newConfig.brandFrequency,
                brandTimeWindow: newConfig.brandTimeWindow,
                selectedKosAccountIds: newConfig.kosAccountIds,
                kosNotesPerAccount: newConfig.kosNotesPerAccount,
                kosFrequency: newConfig.kosFrequency,
                kosTimeWindow: newConfig.kosTimeWindow,
              }));
              setActiveEditDrawer(null);
            }}
            onClose={() => setActiveEditDrawer(null)}
          />
        )}

        {/* Consumer Mode / KOC Recruitment Drawer */}
        {activeEditDrawer === "consumerMode" && (
          <ConsumerModeDrawer
            initialConfig={{
              recruitmentCount: planData.recruitmentCount ?? planData.kocCount ?? 10,
              packagesPerPerson: planData.packagesPerPerson ?? 1,
              hasQuestionnaire: planData.hasQuestionnaire ?? true,
              needPhotos: planData.needPhotos ?? true,
              photoCountRange: planData.photoCountRange || "2—4张现场照片",
              claimValidityDays: planData.claimValidityDays ?? 7,
              observationDays: planData.observationDays ?? 7,
              enableWechatNotice: planData.enableWechatNotice ?? true,
            }}
            onSave={(newConfig: ConsumerKocConfig) => {
              setPlanData((prev: any) => ({
                ...prev,
                kocCount: newConfig.recruitmentCount,
                recruitmentCount: newConfig.recruitmentCount,
                packagesPerPerson: newConfig.packagesPerPerson,
                hasQuestionnaire: newConfig.hasQuestionnaire,
                needPhotos: newConfig.needPhotos,
                photoCountRange: newConfig.photoCountRange,
                claimValidityDays: newConfig.claimValidityDays,
                observationDays: newConfig.observationDays,
                enableWechatNotice: newConfig.enableWechatNotice,
              }));
              setEditablePlanData((prev: any) => ({
                ...prev,
                kocCount: newConfig.recruitmentCount,
                recruitmentCount: newConfig.recruitmentCount,
                packagesPerPerson: newConfig.packagesPerPerson,
                hasQuestionnaire: newConfig.hasQuestionnaire,
                needPhotos: newConfig.needPhotos,
                photoCountRange: newConfig.photoCountRange,
                claimValidityDays: newConfig.claimValidityDays,
                observationDays: newConfig.observationDays,
                enableWechatNotice: newConfig.enableWechatNotice,
              }));
              setActiveEditDrawer(null);
            }}
            onClose={() => setActiveEditDrawer(null)}
          />
        )}

        {/* 9. Prompt Modal for Disabling Questionnaire when KOC content cleared */}
        {showDisableQuestionnairePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-600">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 font-bold text-lg">
                  !
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-neutral-900">同步关闭 KOC 试用问卷？</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">检测到您已清空 KOC 内容包</p>
                </div>
              </div>

              <p className="text-[13px] text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                由于当前方案中不再产出 KOC 体验笔记，建议同步关闭 KOC 真实体验采集问卷，避免产生不必要的任务流程。
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowDisableQuestionnairePrompt(false);
                  }}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-bold text-[12.5px] rounded-xl hover:bg-neutral-50"
                >
                  保留问卷
                </button>
                <button
                  onClick={() => {
                    setPlanData(prev => ({
                      ...prev,
                      kocQuestionnaire: {
                        ...prev.kocQuestionnaire,
                        enabled: false
                      }
                    }));
                    setEditablePlanData(prev => ({
                      ...prev,
                      kocQuestionnaire: {
                        ...prev.kocQuestionnaire,
                        enabled: false
                      }
                    }));
                    setShowDisableQuestionnairePrompt(false);
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white font-bold text-[12.5px] rounded-xl hover:bg-neutral-800"
                >
                  同步关闭问卷
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Helper Row for Plan Result Display
function PlanResultRow({
  title,
  value,
  onOpenDetail,
  customActions
}: {
  title: string;
  value: React.ReactNode;
  onOpenDetail?: () => void;
  customActions?: React.ReactNode;
}) {
  return (
    <div className="p-4 flex items-start justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
      <div className="w-36 shrink-0 text-[13px] font-bold text-neutral-900 pt-0.5">
        {title}
      </div>
      <div className="flex-1 text-[13px] text-neutral-800 leading-relaxed font-normal">
        {value}
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        {customActions ? (
          customActions
        ) : onOpenDetail ? (
          <button
            onClick={onOpenDetail}
            className="text-[12px] font-medium text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
          >
            查看详情
          </button>
        ) : null}
      </div>
    </div>
  );
}

// Helper execution checklist step
function ExecutionCheckStep({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 text-neutral-800 font-medium">
      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
        <Check size={12} />
      </div>
      <span>{text}</span>
    </div>
  );
}

function formatContentAndAccountsSummary(bC: number, bN: number, kosC: number, kosN: number, kocC: number) {
  const total = bC * bN + kosC * kosN + kocC * 1;
  return `【账号分工】品牌主号(${bC}账号×${bN}篇) + 店长号(${kosC}账号×${kosN}篇) + 消费者KOC(${kocC}体验包) = 共${total}篇笔记`;
}

// Account & Note Quantity Controller
function AccountQuantityAdjuster({
  brandCount,
  brandNotesPerAccount,
  kosCount,
  kosNotesPerAccount,
  kocCount,
  onChange
}: {
  brandCount: number;
  brandNotesPerAccount: number;
  kosCount: number;
  kosNotesPerAccount: number;
  kocCount: number;
  onChange: (bC: number, bN: number, kosC: number, kosN: number, kocC: number, summaryText: string) => void;
}) {
  const updateCounts = (newBC: number, newBN: number, newKosC: number, newKosN: number, newKocC: number) => {
    const validBC = Math.min(MERCHANT_BRAND_ACCOUNTS.length, Math.max(0, newBC));
    const validBN = Math.max(1, newBN);
    const validKosC = Math.min(MERCHANT_KOS_ACCOUNTS.length, Math.max(0, newKosC));
    const validKosN = Math.max(1, newKosN);
    const validKocC = Math.max(0, newKocC);

    const summary = formatContentAndAccountsSummary(validBC, validBN, validKosC, validKosN, validKocC);

    onChange(validBC, validBN, validKosC, validKosN, validKocC, summary);
  };

  const totalAll = (brandCount * brandNotesPerAccount) + (kosCount * kosNotesPerAccount) + (kocCount * 1);

  return (
    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3 font-sans">
      <div className="text-[12px] font-bold text-neutral-800 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Users size={14} className="text-neutral-500" />
          账号资产关联与发文频次配置
        </span>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
          合计 {totalAll} 篇/包
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[12px]">
        {/* 1. 品牌主号 */}
        <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2 shadow-2xs">
          <div className="font-bold text-neutral-800 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              品牌主号
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
              产出 {brandCount * brandNotesPerAccount} 篇
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 text-[11.5px]">选择账号数:</span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount - 1, brandNotesPerAccount, kosCount, kosNotesPerAccount, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >-</button>
                <span className="w-8 text-center font-bold text-neutral-900 text-[12px]">{brandCount}</span>
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount + 1, brandNotesPerAccount, kosCount, kosNotesPerAccount, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 text-[11.5px]">单账号发文数:</span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount - 1, kosCount, kosNotesPerAccount, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >-</button>
                <span className="w-8 text-center font-bold text-neutral-900 text-[12px]">{brandNotesPerAccount}</span>
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount + 1, kosCount, kosNotesPerAccount, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >+</button>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-100 text-[10.5px] text-neutral-500 leading-tight">
            资产库共{MERCHANT_BRAND_ACCOUNTS.length}个品牌号，已自动关联{brandCount}个
          </div>
        </div>

        {/* 2. KOS店长号 */}
        <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2 shadow-2xs">
          <div className="font-bold text-neutral-800 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              KOS店长号
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
              产出 {kosCount * kosNotesPerAccount} 篇
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 text-[11.5px]">选择账号数:</span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount, kosCount - 1, kosNotesPerAccount, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >-</button>
                <span className="w-8 text-center font-bold text-neutral-900 text-[12px]">{kosCount}</span>
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount, kosCount + 1, kosNotesPerAccount, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 text-[11.5px]">单账号发文数:</span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount, kosCount, kosNotesPerAccount - 1, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >-</button>
                <span className="w-8 text-center font-bold text-neutral-900 text-[12px]">{kosNotesPerAccount}</span>
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount, kosCount, kosNotesPerAccount + 1, kocCount)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >+</button>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-100 text-[10.5px] text-neutral-500 leading-tight">
            资产库共{MERCHANT_KOS_ACCOUNTS.length}个店长号，已自动关联{kosCount}个
          </div>
        </div>

        {/* 3. 消费者KOC */}
        <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2 shadow-2xs">
          <div className="font-bold text-neutral-800 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              消费者/KOC
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              产出 {kocCount * 1} 组
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-neutral-500 text-[11.5px]">预计招募人数:</span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount, kosCount, kosNotesPerAccount, kocCount - 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >-</button>
                <span className="w-8 text-center font-bold text-neutral-900 text-[12px]">{kocCount}</span>
                <button
                  type="button"
                  onClick={() => updateCounts(brandCount, brandNotesPerAccount, kosCount, kosNotesPerAccount, kocCount + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 opacity-80">
              <span className="text-neutral-500 text-[11.5px]">单账号体验包:</span>
              <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                固定 1 篇/包
              </span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-100 text-[10.5px] text-emerald-700 leading-tight">
            依托【体验问卷】收集人设/优点/吐槽，实现千人千篇
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Editor Component for Content & Accounts Detail Drawer
function ContentAndAccountsDetailEditor({
  planData,
  onSave,
  onClose
}: {
  planData: any;
  onSave: (updated: any) => void;
  onClose: () => void;
}) {
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    planData.selectedBrandAccountIds || ["brand_1", "brand_2"]
  );
  const [brandNotes, setBrandNotes] = useState<number>(
    planData.brandNotesPerAccount ?? 2
  );
  const [selectedKosIds, setSelectedKosIds] = useState<string[]>(
    planData.selectedKosAccountIds || ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"]
  );
  const [kosNotes, setKosNotes] = useState<number>(
    planData.kosNotesPerAccount ?? 1
  );
  const [kocCount, setKocCount] = useState<number>(
    planData.kocCount ?? 10
  );
  const [kocMode, setKocMode] = useState<"内容包" | "预设笔记">(
    planData.kocMode || "内容包"
  );

  const toggleBrandAccount = (id: string) => {
    setSelectedBrandIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleKosAccount = (id: string) => {
    setSelectedKosIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const totalNotes = (selectedBrandIds.length * brandNotes) + (selectedKosIds.length * kosNotes) + kocCount;

  const handleConfirm = () => {
    onSave({
      ...planData,
      selectedBrandAccountIds: selectedBrandIds,
      brandNotesPerAccount: brandNotes,
      selectedKosAccountIds: selectedKosIds,
      kosNotesPerAccount: kosNotes,
      kocCount: kocCount,
      kocMode: kocMode,
    });
    onClose();
  };

  return (
    <div className="space-y-5 text-[13px] leading-relaxed">
      {/* Top Summary Banner */}
      <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
        <div>
          <div className="font-bold text-neutral-900 text-[14px]">预设账号分配与产出计划</div>
          <div className="text-[11.5px] text-neutral-500">勾选预设账号库，配置各账号发文频次与KOC发布模式</div>
        </div>
        <span className="text-[13px] font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
          共 {totalNotes} 篇/包
        </span>
      </div>

      {/* 1. 品牌主号 */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            品牌主号 (预设可用账号)
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-neutral-500 font-medium">单账号发文:</span>
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                type="button"
                onClick={() => setBrandNotes(Math.max(1, brandNotes - 1))}
                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
              >-</button>
              <span className="w-8 text-center font-bold text-neutral-900">{brandNotes}</span>
              <button
                type="button"
                onClick={() => setBrandNotes(brandNotes + 1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
              >+</button>
            </div>
            <span className="text-neutral-500">篇</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11.5px] font-bold text-neutral-500">可分配账号列表（已勾选 {selectedBrandIds.length} 个）：</div>
          <div className="space-y-1.5">
            {MERCHANT_BRAND_ACCOUNTS.map(acc => {
              const isChecked = selectedBrandIds.includes(acc.id);
              return (
                <label
                  key={acc.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isChecked ? "bg-blue-50/50 border-blue-200" : "bg-neutral-50/50 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrandAccount(acc.id)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 text-[12.5px]">{acc.name}</span>
                      <span className="text-[11px] text-neutral-400 ml-2">{acc.fans} 粉丝 · {acc.status}</span>
                    </div>
                  </div>
                  {isChecked && (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      预计产出 {brandNotes} 篇
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. KOS店长号 */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            KOS店长号 (预设可用账号)
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-neutral-500 font-medium">单账号发文:</span>
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                type="button"
                onClick={() => setKosNotes(Math.max(1, kosNotes - 1))}
                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
              >-</button>
              <span className="w-8 text-center font-bold text-neutral-900">{kosNotes}</span>
              <button
                type="button"
                onClick={() => setKosNotes(kosNotes + 1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
              >+</button>
            </div>
            <span className="text-neutral-500">篇</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11.5px] font-bold text-neutral-500">可分配门店账号（已勾选 {selectedKosIds.length}/{MERCHANT_KOS_ACCOUNTS.length} 个）：</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {MERCHANT_KOS_ACCOUNTS.map(acc => {
              const isChecked = selectedKosIds.includes(acc.id);
              return (
                <label
                  key={acc.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-colors cursor-pointer text-[12px] ${
                    isChecked ? "bg-amber-50/50 border-amber-200" : "bg-neutral-50/50 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleKosAccount(acc.id)}
                      className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer shrink-0"
                    />
                    <span className="font-bold text-neutral-800 truncate">{acc.name}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0 ml-1">{acc.storeName}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 消费者KOC */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            消费者KOC 招募与内容模式
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-neutral-500 font-medium">拟招募人数:</span>
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                type="button"
                onClick={() => setKocCount(Math.max(0, kocCount - 1))}
                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
              >-</button>
              <span className="w-8 text-center font-bold text-neutral-900">{kocCount}</span>
              <button
                type="button"
                onClick={() => setKocCount(kocCount + 1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
              >+</button>
            </div>
            <span className="text-neutral-500">人</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11.5px] font-bold text-neutral-500">KOC 内容策略与模式选择：</div>
          <div className="space-y-2">
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                kocMode === "内容包" ? "bg-emerald-50/50 border-emerald-200" : "bg-neutral-50/50 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="kocMode"
                value="内容包"
                checked={kocMode === "内容包"}
                onChange={() => setKocMode("内容包")}
                className="mt-0.5 accent-emerald-600 cursor-pointer"
              />
              <div>
                <div className="font-bold text-neutral-900 text-[12.5px] flex items-center gap-1.5">
                  采用试用体验内容包
                  <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[10.5px] font-bold rounded">推荐 (千人千篇)</span>
                </div>
                <div className="text-[11.5px] text-neutral-500 mt-0.5">
                  通过KOC真实体验采集问卷收集人设、表达习惯与反馈事实，由AI自动定制属于各创作者的差异化体验内容包。
                </div>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                kocMode === "预设笔记" ? "bg-emerald-50/50 border-emerald-200" : "bg-neutral-50/50 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="kocMode"
                value="预设笔记"
                checked={kocMode === "预设笔记"}
                onChange={() => setKocMode("预设笔记")}
                className="mt-0.5 accent-emerald-600 cursor-pointer"
              />
              <div>
                <div className="font-bold text-neutral-900 text-[12.5px]">
                  采用预设笔记
                </div>
                <div className="text-[11.5px] text-neutral-500 mt-0.5">
                  不使用体验问卷采集，统一派发标准预设笔记模板供KOC发布。
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[12px] text-amber-900 flex items-center gap-2">
        <Sparkles size={14} className="text-amber-600 shrink-0" />
        <span>确认配置后，系统将自动关联对应账号并在方案通过后开启任务调度。</span>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-neutral-600 font-medium text-[12.5px] hover:bg-neutral-100 rounded-xl"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2 bg-neutral-900 text-white font-bold text-[12.5px] rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
        >
          保存并更新
        </button>
      </div>
    </div>
  );
}

// Helper Editor Component for KOC Questionnaire Detail Drawer
function KocQuestionnaireDetailEditor({
  planData,
  onSave,
  onClose
}: {
  planData: any;
  onSave: (updated: any) => void;
  onClose: () => void;
}) {
  const kocCount = planData.kocCount ?? 10;
  const [enabled, setEnabled] = useState<boolean>(planData.kocQuestionnaire?.enabled ?? true);
  const [timing, setTiming] = useState<string>(planData.kocQuestionnaire?.timing || "发布内容前完成");
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>(
    planData.kocQuestionnaire?.questions || DEFAULT_QUESTIONNAIRE_QUESTIONS
  );
  const [showQuestionsEditor, setShowQuestionsEditor] = useState<boolean>(false);

  const handleConfirm = () => {
    onSave({
      ...planData,
      kocQuestionnaire: {
        enabled,
        timing,
        questions
      }
    });
    onClose();
  };

  return (
    <div className="space-y-5 text-[13px] leading-relaxed">
      {/* Top switch status */}
      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
        <div>
          <div className="font-bold text-[14px] text-neutral-900">开启 KOC 真实体验采集</div>
          <div className="text-[12px] text-neutral-500">分发真实体验问卷，提取事实数据用于定向生成个性化笔记</div>
        </div>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-5 h-5 accent-neutral-900 cursor-pointer"
        />
      </div>

      {enabled ? (
        <div className="space-y-4">
          <div className="p-3.5 border border-neutral-200 rounded-2xl bg-white flex items-center justify-between">
            <span className="text-[12.5px] font-bold text-neutral-700">预计参与账号数</span>
            <span className="text-[14px] font-extrabold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-xl">
              {kocCount} 人 (已与 KOC 招募数同步)
            </span>
          </div>

          <div className="p-4 border border-neutral-200 rounded-2xl bg-white space-y-2">
            <div className="font-bold text-neutral-900 text-[13px]">问卷收集时机设置</div>
            <div className="space-y-2 text-[12px]">
              {[
                { label: "发布内容前完成（推荐：获取真实产品反馈，定向生成个性化笔记）", value: "发布内容前完成" },
                { label: "入群报名时同步收集", value: "入群报名时同步收集" },
                { label: "活动结束后统一收集", value: "活动结束后统一收集" }
              ].map(opt => (
                <label key={opt.value} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
                  <input
                    type="radio"
                    name="q-timing"
                    value={opt.value}
                    checked={timing === opt.value}
                    onChange={(e) => setTiming(e.target.value)}
                    className="mt-0.5 accent-neutral-900 cursor-pointer"
                  />
                  <span className="text-neutral-800 font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-2xl bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 text-[13px]">包含问卷题目 ({questions.length}个问题)</div>
                <div className="text-[11.5px] text-neutral-500">结构化采集背景、习惯、体验与图片视频</div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionsEditor(!showQuestionsEditor)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[12px] rounded-xl transition-colors flex items-center gap-1"
              >
                <BookOpen size={13} />
                {showQuestionsEditor ? "收起题目列表" : "查看/编辑题目"}
              </button>
            </div>

            {showQuestionsEditor && (
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-700">问题 {idx + 1} ({q.type})</span>
                      <span className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded ${q.isRequired ? 'bg-red-50 text-red-700' : 'bg-neutral-200 text-neutral-600'}`}>
                        {q.isRequired ? "必填" : "选填"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[idx] = { ...newQ[idx], title: e.target.value };
                        setQuestions(newQ);
                      }}
                      className="w-full px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-900 outline-none font-medium text-[12px]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-[12.5px]">
          已关闭体验采集问卷，KOC发文将采用预设笔记模式。
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-neutral-600 font-medium text-[12.5px] hover:bg-neutral-100 rounded-xl"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2 bg-neutral-900 text-white font-bold text-[12.5px] rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
        >
          保存配置
        </button>
      </div>
    </div>
  );
}

// Helper Detail Drawer Content Component
function DetailDrawerContent({
  itemKey,
  planData,
  onUpdatePlanData,
  onClose
}: {
  itemKey: string;
  planData: any;
  onUpdatePlanData: (updated: any) => void;
  onClose: () => void;
}) {
  if (itemKey === "contentAndAccounts" || itemKey === "contentRolesDetail") {
    return (
      <ContentAndAccountsDetailEditor
        planData={planData}
        onSave={onUpdatePlanData}
        onClose={onClose}
      />
    );
  }

  if (itemKey === "kocQuestionnaireDetail" || itemKey === "questionnaire") {
    return (
      <KocQuestionnaireDetailEditor
        planData={planData}
        onSave={onUpdatePlanData}
        onClose={onClose}
      />
    );
  }

  const [draftValue, setDraftValue] = useState<string>("");
  const [draftStartDate, setDraftStartDate] = useState<string>(planData.startDate || "");
  const [draftEndDate, setDraftEndDate] = useState<string>(planData.endDate || "");

  useEffect(() => {
    if (itemKey === "name") setDraftValue(planData.projectName || "");
    else if (itemKey === "goalAndStrategy") setDraftValue(planData.goalAndStrategy || "");
    else if (itemKey === "targetAudience") setDraftValue(planData.targetAudience || "");
    setDraftStartDate(planData.startDate || "");
    setDraftEndDate(planData.endDate || "");
  }, [itemKey, planData]);

  const handleSaveDetailEdit = () => {
    let updated = { ...planData };
    if (itemKey === "name") updated.projectName = draftValue;
    else if (itemKey === "goalAndStrategy") updated.goalAndStrategy = draftValue;
    else if (itemKey === "targetAudience") updated.targetAudience = draftValue;
    else if (itemKey === "cycle") {
      updated.startDate = draftStartDate;
      updated.endDate = draftEndDate;
    }
    onUpdatePlanData(updated);
    onClose();
  };

  const getTitle = () => {
    switch (itemKey) {
      case "name": return "项目名称";
      case "goalAndStrategy": return "项目目标与核心策略";
      case "targetAudience": return "目标用户";
      case "cycle": return "项目周期";
      default: return "配置详情";
    }
  };

  const calculateDaysLocal = (sStr: string, eStr: string) => {
    if (!sStr || !eStr) return 14;
    const s = new Date(sStr);
    const e = new Date(eStr);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  return (
    <div className="space-y-6 text-[13px] leading-relaxed">
      {/* 1. Quick Inline Edit Block inside Drawer */}
      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-neutral-900 text-[14px] flex items-center gap-1.5">
            <Edit2 size={15} className="text-neutral-500" />
            配置修改：{getTitle()}
          </div>
          <span className="text-[11px] text-neutral-400">可在下方直接保存修改</span>
        </div>

        {itemKey === "cycle" ? (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-neutral-600 font-medium">开始日期:</span>
              <input
                type="date"
                value={draftStartDate}
                onChange={(e) => setDraftStartDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-600 font-medium">结束日期:</span>
              <input
                type="date"
                value={draftEndDate}
                onChange={(e) => setDraftEndDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
              />
            </div>
            <div className="text-[12px] font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/90">
              对应项目推进时长为：{calculateDaysLocal(draftStartDate, draftEndDate)} 天
            </div>
          </div>
        ) : itemKey === "name" ? (
          <input
            type="text"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-[13px] font-bold text-neutral-900 outline-none focus:border-neutral-500 font-sans"
          />
        ) : (
          <textarea
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            rows={4}
            className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-[13px] text-neutral-900 outline-none focus:border-neutral-500 font-sans"
          />
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSaveDetailEdit}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12.5px] rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Check size={14} /> 保存此项修改
          </button>
        </div>
      </div>

      {/* 2. AI Recommendation Logic */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
        <div className="font-bold text-amber-900">AI 推荐逻辑依据</div>
        <div className="text-amber-800 text-[12px]">
          结合当前小红书搜索趋势，该类目在软便和换粮过渡期的咨询转化率高出常规种草2.4倍。
        </div>
      </div>

      {/* 3. Reference Data */}
      <div className="space-y-2">
        <div className="font-bold text-neutral-900">引用的系统资料：</div>
        <ul className="list-disc list-inside text-neutral-600 space-y-1 pl-1">
          <li>商家画像：萌宠乐园品牌主营幼犬粮系列</li>
          <li>知识资料：《幼犬换粮指南》及成分检测报告</li>
          <li>账号资源：已关联 3 个品牌官方号及 10 个店长号资产</li>
        </ul>
      </div>

      {/* 4. Assumptions & Impacts */}
      <div className="space-y-2">
        <div className="font-bold text-neutral-900">关联影响与系统联动：</div>
        <p className="text-neutral-600">
          修改该项配置将自动同步至后期生成的笔记排期与体验内容包，确保数据与执行中心一致。
        </p>
      </div>
    </div>
  );
}

// 1. Content Roles Edit Drawer
function ContentRolesDrawer({
  planData,
  onSave,
  onClose
}: {
  planData: any;
  onSave: (roles: ContentRoleItem[], disablePromptNeeded: boolean) => void;
  onClose: () => void;
}) {
  const [roles, setRoles] = useState<ContentRoleItem[]>(
    planData.contentRoles && planData.contentRoles.length > 0
      ? JSON.parse(JSON.stringify(planData.contentRoles))
      : JSON.parse(JSON.stringify(DEFAULT_CONTENT_ROLES))
  );

  const initialKocCount = (planData.contentRoles || DEFAULT_CONTENT_ROLES)
    .filter((r: ContentRoleItem) => r.role.includes("KOC") || r.role.includes("体验") || r.role.includes("消费者"))
    .reduce((sum: number, r: ContentRoleItem) => sum + (Number(r.count) || 0), 0);

  const totalNotes = roles.reduce((sum, r) => sum + (Number(r.count) || 0), 0);

  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        id: `role-${Date.now()}`,
        role: "新内容角色",
        purpose: "补充说明该类内容在传播中的主要作用",
        count: 1
      }
    ]);
  };

  const handleRemoveRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const handleUpdateRole = (id: string, field: keyof ContentRoleItem, value: any) => {
    setRoles(roles.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleConfirmSave = () => {
    const finalKocCount = roles
      .filter(r => r.role.includes("KOC") || r.role.includes("体验") || r.role.includes("消费者"))
      .reduce((sum, r) => sum + (Number(r.count) || 0), 0);

    const disablePromptNeeded = initialKocCount > 0 && finalKocCount === 0 && planData.kocQuestionnaire?.enabled;
    onSave(roles, disablePromptNeeded);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/20 z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[580px] bg-white shadow-2xl z-50 flex flex-col p-6 space-y-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-neutral-900">内容安排</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">确认各内容角色与产出量，AI将在确认方案后自动匹配账号与排期</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-200">
          <span className="text-[13px] font-bold text-neutral-800">当前计划产出总量</span>
          <span className="text-[14px] font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
            共 {totalNotes} 篇/包
          </span>
        </div>

        <div className="space-y-4 flex-1">
          <div className="text-[13px] font-bold text-neutral-800 flex items-center justify-between">
            <span>内容角色与作用列表</span>
            <span className="text-[11px] text-neutral-400 font-normal">点击单元格可直接修改</span>
          </div>

          <div className="space-y-3">
            {roles.map((item) => (
              <div key={item.id} className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs hover:border-neutral-300 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[11px] font-bold text-neutral-400 shrink-0">角色名称:</span>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => handleUpdateRole(item.id, "role", e.target.value)}
                      className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-900 focus:bg-white focus:border-neutral-400 outline-none flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-neutral-400">产出量:</span>
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => handleUpdateRole(item.id, "count", Math.max(0, item.count - 1))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                      >-</button>
                      <input
                        type="number"
                        min={0}
                        value={item.count}
                        onChange={(e) => handleUpdateRole(item.id, "count", Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-10 text-center font-bold text-neutral-900 text-[13px] bg-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateRole(item.id, "count", item.count + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-200 font-bold text-neutral-600 transition-colors"
                      >+</button>
                    </div>
                    <span className="text-[12px] text-neutral-500 font-medium">篇/包</span>
                  </div>

                  {roles.length > 1 && (
                    <button
                      onClick={() => handleRemoveRole(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="删除此角色"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-bold text-neutral-400 mb-1 block">核心作用与定位:</span>
                  <input
                    type="text"
                    value={item.purpose}
                    onChange={(e) => handleUpdateRole(item.id, "purpose", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[12.5px] text-neutral-800 focus:bg-white focus:border-neutral-400 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddRole}
            className="w-full py-2.5 bg-white border border-dashed border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 text-[13px] font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus size={15} />
            添加内容角色
          </button>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-[12px] text-amber-900 flex items-center gap-2 shrink-0">
          <Sparkles size={15} className="text-amber-600 shrink-0" />
          <span>确认方案后，AI将根据内容角色自动匹配可用的账号并完成排期发布。</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl"
          >
            取消
          </button>
          <button
            onClick={handleConfirmSave}
            className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            保存并更新
          </button>
        </div>
      </motion.div>
    </>
  );
}

// 2. KOC Questionnaire Config Drawer
function KocQuestionnaireConfigDrawer({
  planData,
  onSave,
  onOpenQuestions,
  onClose
}: {
  planData: any;
  onSave: (config: any) => void;
  onOpenQuestions: () => void;
  onClose: () => void;
}) {
  const roles = planData.contentRoles || DEFAULT_CONTENT_ROLES;
  const kocRole = roles.find((r: ContentRoleItem) => r.role.includes("KOC") || r.role.includes("体验") || r.role.includes("消费者"));
  const kocCount = kocRole ? Number(kocRole.count) || 0 : 0;

  const [enabled, setEnabled] = useState<boolean>(planData.kocQuestionnaire?.enabled ?? true);
  const [timing, setTiming] = useState<string>(planData.kocQuestionnaire?.timing || "发布内容前完成");

  const qCount = planData.kocQuestionnaire?.questions?.length || DEFAULT_QUESTIONNAIRE_QUESTIONS.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/20 z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col p-6 space-y-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-neutral-900">KOC真实体验采集配置</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">面向消费者与KOC试用者的事实采集问卷设置</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="font-bold text-[14px] text-neutral-900">开启 KOC 真实体验采集</div>
            <div className="text-[12px] text-neutral-500">将问卷分发给参与KOC，收集人设与真实体验</div>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 accent-neutral-900 cursor-pointer"
          />
        </div>

        {enabled && (
          <div className="space-y-5 flex-1">
            {/* Participating Accounts */}
            <div className="p-4 border border-neutral-200 rounded-2xl space-y-2 bg-white">
              <div className="text-[12px] font-bold text-neutral-500">预计参与账号数</div>
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-extrabold text-neutral-900">{kocCount} 人</span>
                <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                  根据内容安排中的KOC数量自动同步
                </span>
              </div>
            </div>

            {/* Questions Config */}
            <div className="p-4 border border-neutral-200 rounded-2xl space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-neutral-900">问卷题目设置</div>
                  <div className="text-[11.5px] text-neutral-500">当前已包含 {qCount} 个结构化问题</div>
                </div>
                <button
                  onClick={onOpenQuestions}
                  className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-[12px] rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <BookOpen size={13} />
                  查看/编辑问卷题目
                </button>
              </div>
            </div>

            {/* Timing Config */}
            <div className="p-4 border border-neutral-200 rounded-2xl space-y-3 bg-white">
              <div className="text-[13px] font-bold text-neutral-900">问卷收集时机</div>
              <div className="space-y-2 text-[12.5px]">
                {[
                  { label: "发布内容前完成（推荐：获取真实产品反馈，定向生成个性化笔记）", value: "发布内容前完成" },
                  { label: "入群报名时同步收集", value: "入群报名时同步收集" },
                  { label: "试用活动结束后统一收集", value: "活动结束后统一收集" }
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-colors">
                    <input
                      type="radio"
                      name="timing"
                      value={opt.value}
                      checked={timing === opt.value}
                      onChange={(e) => setTiming(e.target.value)}
                      className="mt-0.5 accent-neutral-900 cursor-pointer"
                    />
                    <span className="text-neutral-800 font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-[12px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                问卷的作用：收集事实，定向生成
              </div>
              <p className="text-[11.5px] text-amber-800 leading-relaxed">
                问卷的用途是收集创作者的真实背景与使用感受。AI将根据收集到的优点和槽点定向生成个性化表达，确保千人千篇。
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl"
          >
            取消
          </button>
          <button
            onClick={() => {
              onSave({ enabled, timing });
            }}
            className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            保存配置
          </button>
        </div>
      </motion.div>
    </>
  );
}

// 3. KOC Questionnaire Questions Drawer
function KocQuestionnaireQuestionsDrawer({
  questions,
  onSave,
  onClose
}: {
  questions: QuestionnaireQuestion[];
  onSave: (questions: QuestionnaireQuestion[]) => void;
  onClose: () => void;
}) {
  const [qList, setQList] = useState<QuestionnaireQuestion[]>(
    JSON.parse(JSON.stringify(questions && questions.length > 0 ? questions : DEFAULT_QUESTIONNAIRE_QUESTIONS))
  );

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === qList.length - 1) return;
    const newList = [...qList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setQList(newList);
  };

  const handleUpdate = (id: string, field: keyof QuestionnaireQuestion, val: any) => {
    setQList(qList.map(q => q.id === id ? { ...q, [field]: val } : q));
  };

  const handleDelete = (id: string) => {
    setQList(qList.filter(q => q.id !== id));
  };

  const handleAddQuestion = () => {
    setQList([
      ...qList,
      {
        id: `q-${Date.now()}`,
        title: "例如：您的宠物目前处于什么阶段？",
        type: "单选",
        isRequired: true,
        options: ["选项 1", "选项 2", "选项 3"]
      }
    ]);
  };

  const handleAddOption = (qId: string) => {
    setQList(qList.map(q => {
      if (q.id === qId) {
        const opts = q.options ? [...q.options] : [];
        opts.push(`新选项 ${opts.length + 1}`);
        return { ...q, options: opts };
      }
      return q;
    }));
  };

  const handleUpdateOption = (qId: string, optIdx: number, val: string) => {
    setQList(qList.map(q => {
      if (q.id === qId && q.options) {
        const opts = [...q.options];
        opts[optIdx] = val;
        return { ...q, options: opts };
      }
      return q;
    }));
  };

  const handleRemoveOption = (qId: string, optIdx: number) => {
    setQList(qList.map(q => {
      if (q.id === qId && q.options) {
        if (q.options.length <= 2) {
          alert("选择题至少保留 2 个选项");
          return q;
        }
        return { ...q, options: q.options.filter((_, i) => i !== optIdx) };
      }
      return q;
    }));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/20 z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[620px] bg-white shadow-2xl z-50 flex flex-col p-6 space-y-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-neutral-900">KOC真实体验采集问卷 ({qList.length}个问题)</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">全量采用选择题，便于用户快速决策；AI将提取填报事实定向生成千人千篇笔记</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {qList.map((q, idx) => (
            <div key={q.id} className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs hover:border-neutral-300 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setQList(qList.map(item => {
                        if (item.id === q.id) {
                          const opts = item.options && item.options.length > 0 ? item.options : ["选项 1", "选项 2", "选项 3"];
                          return { ...item, type: newType, options: opts };
                        }
                        return item;
                      }));
                    }}
                    className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md text-[11.5px] font-bold text-neutral-800 outline-none"
                  >
                    <option value="单选">单选题 (快速单选)</option>
                    <option value="多选">多选题 (快速多选)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  {/* Reorder Buttons */}
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 rounded"
                    title="上移"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === qList.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 rounded"
                    title="下移"
                  >
                    <ArrowDown size={14} />
                  </button>

                  <label className="flex items-center gap-1 text-[11.5px] text-neutral-600 font-medium ml-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={q.isRequired}
                      onChange={(e) => handleUpdate(q.id, "isRequired", e.target.checked)}
                      className="accent-neutral-900 rounded cursor-pointer"
                    />
                    必填
                  </label>

                  {qList.length > 1 && (
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                      title="删除题目"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 mb-1">题目标题</label>
                <textarea
                  rows={2}
                  value={q.title}
                  onChange={(e) => handleUpdate(q.id, "title", e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[12.5px] font-medium text-neutral-900 focus:bg-white focus:border-neutral-400 outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1 border-t border-neutral-100">
                <label className="block text-[11px] font-bold text-neutral-500">选项列表 (点击修改)</label>
                <div className="space-y-1.5">
                  {(q.options || ["选项 1", "选项 2", "选项 3"]).map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 border border-neutral-300 shrink-0 ${q.type === '单选' ? 'rounded-full' : 'rounded-xs'}`} />
                      <input
                        type="text"
                        className="flex-1 px-2.5 py-1 text-[12px] text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400"
                        value={opt}
                        onChange={(e) => handleUpdateOption(q.id, oIdx, e.target.value)}
                        placeholder={`选项 ${oIdx + 1}`}
                      />
                      <button
                        onClick={() => handleRemoveOption(q.id, oIdx)}
                        className="text-neutral-400 hover:text-rose-500 p-1 rounded hover:bg-neutral-100 transition-colors"
                        title="删除选项"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddOption(q.id)}
                  className="text-[12px] text-neutral-700 hover:text-black font-bold flex items-center gap-1 mt-1 pt-1"
                >
                  <Plus size={13} /> 添加选项
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            className="w-full py-2.5 bg-white border border-dashed border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 text-[13px] font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus size={15} />
            添加自定义问题
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl"
          >
            取消
          </button>
          <button
            onClick={() => onSave(qList)}
            className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            保存问卷
          </button>
        </div>
      </motion.div>
    </>
  );
}
