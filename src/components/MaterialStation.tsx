import React, { useState } from "react";
import {
  Image as ImageIcon, Upload, FolderOpen, Cloud,
  Search, CheckCircle2, ShieldAlert, Plus, Trash2, X,
  Sparkles, FileText, Camera, Video,
  Filter, Check, SlidersHorizontal, ArrowRight,
  ExternalLink, ChevronRight, Layers, AlertTriangle, Eye, RefreshCw,
  HardDrive, Lock, Tag, Clock, Download, Edit3, Link2, AlertCircle, FileWarning, HelpCircle,
  CheckSquare, Square, FolderPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MaterialStationProps {
  activeProject?: any;
}

// ----------------------------------------------------------------------
// Mock Assets Data
// ----------------------------------------------------------------------
interface Asset {
  id: string;
  name: string;
  type: "image" | "video";
  duration?: string;
  thumbnail: string;
  processStatus: "上传中" | "AI分析中" | "待审核" | "可使用" | "有风险" | "处理失败";
  usageStatus: "未使用" | "草稿使用中" | "项目使用中" | "已发布";
  tags: string[];
  source: "操盘手上传" | "员工回传" | "KOC回传" | "项目任务" | "内容任务" | "历史迁移";
  project?: string;
  uploader: string;
  uploadTime: string;
  riskType?: string;
  // Detail Fields
  aiVisualFacts: string;
  aiUsageSuggestion: string;
  rawAiDescription: string;
  activeDescription: string;
  isEdited: boolean;
  editHistory?: { user: string; time: string }[];
  category: "封面" | "产品" | "场景" | "用户反馈" | "开箱试用" | "对比测评";
  authInfo: {
    portraitAuth: boolean;
    containsPortrait?: boolean;
    isKocSelfPortrait?: boolean;
    autoBlurredPortrait?: boolean;
    brandAuth: boolean;
    noCompetitorLogo: boolean;
  };
  citations: {
    type: "project" | "draft" | "published";
    title: string;
    id: string;
  }[];
  fileInfo: {
    resolution: string;
    format: string;
    size: string;
    aspectRatio: string;
  };
}

const INITIAL_ASSETS: Asset[] = [
  {
    id: "ast_01",
    name: "幼犬进食瓷碗实拍_01.jpg",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80",
    processStatus: "可使用",
    usageStatus: "项目使用中",
    tags: ["幼犬粮", "真实场景", "进食实拍"],
    source: "员工回传",
    project: "幼犬换粮避坑搜索卡位",
    uploader: "张店长(KOS店员)",
    uploadTime: "2026-07-20 14:20",
    category: "场景",
    aiVisualFacts: "一只金色幼犬在室内木地板上低头进食，前景为白色陶瓷碗，碗中可见棕色颗粒犬粮。画面采用近景侧拍，自然光，背景轻微虚化，未出现人物和其他品牌包装。",
    aiUsageSuggestion: "适合作为幼犬喂食过程、真实体验、犬粮颗粒展示类内容的正文配图；不建议作为纯产品白底首图。",
    rawAiDescription: "一只金色幼犬在室内木地板上低头进食，前景为白色陶瓷碗，碗中可见棕色颗粒犬粮。画面采用近景侧拍，自然光，背景轻微虚化，未出现人物和其他品牌包装。",
    activeDescription: "一只金色幼犬在室内木地板上低头进食，前景为白色陶瓷碗，碗中可见棕色颗粒犬粮。画面采用近景侧拍，自然光，背景轻微虚化，未出现人物和其他品牌包装。",
    isEdited: false,
    authInfo: { portraitAuth: false, containsPortrait: false, brandAuth: true, noCompetitorLogo: true },
    citations: [
      { type: "project", title: "幼犬换粮避坑搜索卡位", id: "p1" },
      { type: "draft", title: "幼犬换粮软便别慌！3天过渡法", id: "d_101" }
    ],
    fileInfo: { resolution: "3024x4032", format: "JPEG", size: "3.4 MB", aspectRatio: "3:4" }
  },
  {
    id: "ast_02",
    name: "肠胃敏感粮颗粒质感特写.mp4",
    type: "video",
    duration: "00:15",
    thumbnail: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
    processStatus: "可使用",
    usageStatus: "草稿使用中",
    tags: ["颗粒特写", "质感高清", "无粉尘"],
    source: "操盘手上传",
    project: "KOS店长号第一人称开箱SOP",
    uploader: "主操盘手",
    uploadTime: "2026-07-21 09:15",
    category: "开箱试用",
    aiVisualFacts: "高帧率特写拍摄受捏碎犬粮颗粒的过程，展示质地酥脆无油腻感，背景为干净浅灰底板，全程无杂音混响。",
    aiUsageSuggestion: "推荐用于开箱视频中段 5-8 秒颗粒品质讲解，突出不油腻与易消化视觉感。",
    rawAiDescription: "高帧率特写拍摄受捏碎犬粮颗粒的过程，展示质地酥脆无油腻感，背景为干净浅灰底板，全程无杂音混响。",
    activeDescription: "高帧率特写拍摄受捏碎犬粮颗粒的过程，展示质地酥脆无油腻感，背景为干净浅灰底板，全程无杂音混响。",
    isEdited: false,
    authInfo: { portraitAuth: false, containsPortrait: false, brandAuth: true, noCompetitorLogo: true },
    citations: [
      { type: "draft", title: "新手养狗必看：粮颗粒怎么选？", id: "d_102" }
    ],
    fileInfo: { resolution: "1080x1920", format: "MP4", size: "18.2 MB", aspectRatio: "9:16" }
  },
  {
    id: "ast_03",
    name: "KOS店长第一人称拿包开箱.jpg",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80",
    processStatus: "有风险",
    usageStatus: "未使用",
    tags: ["KOS人设", "开箱图", "待确认竞品"],
    source: "员工回传",
    project: "KOS店长号第一人称开箱SOP",
    uploader: "李店长(KOS店员)",
    uploadTime: "2026-07-21 11:00",
    riskType: "背景疑似竞品包装露出",
    category: "开箱试用",
    aiVisualFacts: "店长手持幼犬粮包装袋面向镜头展示，右下角背景茶几上有一包未打码的其它品牌宠物湿粮。",
    aiUsageSuggestion: "建议先使用画笔将背景竞品湿粮模糊打码后再用于发布。",
    rawAiDescription: "店长手持幼犬粮包装袋面向镜头展示，右下角背景茶几上有一包未打码的其它品牌宠物湿粮。",
    activeDescription: "店长手持幼犬粮包装袋面向镜头展示，右下角背景茶几上有一包未打码的其它品牌宠物湿粮。",
    isEdited: false,
    authInfo: { portraitAuth: false, containsPortrait: true, isKocSelfPortrait: true, autoBlurredPortrait: false, brandAuth: true, noCompetitorLogo: false },
    citations: [],
    fileInfo: { resolution: "2400x3200", format: "PNG", size: "5.1 MB", aspectRatio: "3:4" }
  },
  {
    id: "ast_04",
    name: "宠物医院医生推荐打卡图.jpg",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&auto=format&fit=crop&q=80",
    processStatus: "待审核",
    usageStatus: "未使用",
    tags: ["背书", "医生人设", "痛点解答"],
    source: "KOC回传",
    uploader: "达人@宠医小王",
    uploadTime: "2026-07-21 14:00",
    category: "用户反馈",
    aiVisualFacts: "身穿白大褂的男性宠物医生在诊室背景下手持产品，笑容亲和，桌面有诊疗记录单，画面光线明亮。",
    aiUsageSuggestion: "极佳的背书向正文插图或第二张滑动页素材，建议对非KOC肖像自动开启模糊打码保护。",
    rawAiDescription: "身穿白大褂的男性宠物医生在诊室背景下手持产品，笑容亲和，桌面有诊疗记录单，画面光线明亮。",
    activeDescription: "身穿白大褂的男性宠物医生在诊室背景下手持产品，笑容亲和，桌面有诊疗记录单，画面光线明亮。",
    isEdited: false,
    authInfo: { portraitAuth: false, containsPortrait: true, isKocSelfPortrait: false, autoBlurredPortrait: true, brandAuth: true, noCompetitorLogo: true },
    citations: [],
    fileInfo: { resolution: "3024x4032", format: "JPEG", size: "4.0 MB", aspectRatio: "3:4" }
  },
  {
    id: "ast_05",
    name: "幼犬换粮对比例图_AI分析中.jpg",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop&q=80",
    processStatus: "AI分析中",
    usageStatus: "未使用",
    tags: ["对比例", "换粮周期"],
    source: "操盘手上传",
    uploader: "主操盘手",
    uploadTime: "2026-07-21 16:30",
    category: "对比测评",
    aiVisualFacts: "正在进行 OCR 文字提取与画面事实分析...",
    aiUsageSuggestion: "解析完成后将自动生成运营用途建议。",
    rawAiDescription: "分析中...",
    activeDescription: "分析中...",
    isEdited: false,
    authInfo: { portraitAuth: false, containsPortrait: false, brandAuth: true, noCompetitorLogo: true },
    citations: [],
    fileInfo: { resolution: "2000x2666", format: "JPEG", size: "2.8 MB", aspectRatio: "3:4" }
  },
  {
    id: "ast_06",
    name: "大促主爆款产品3D高质感封面.png",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80",
    processStatus: "可使用",
    usageStatus: "已发布",
    tags: ["封面", "产品白底", "618爆款"],
    source: "历史迁移",
    project: "618防软便粮爆文打法",
    uploader: "设计团队",
    uploadTime: "2026-06-01 10:00",
    category: "封面",
    aiVisualFacts: "正面展示幼犬粮正装包装，无缝白色背景，顶部带有大字报3D阴影字样“幼犬肠胃守护粮”。",
    aiUsageSuggestion: "适合作为商品卡片图或电商大促导流首图。",
    rawAiDescription: "正面展示幼犬粮正装包装，无缝白色背景，顶部带有大字报3D阴影字样“幼犬肠胃守护粮”。",
    activeDescription: "正面展示幼犬粮正装包装，无缝白色背景，顶部带有大字报3D阴影字样“幼犬肠胃守护粮”。",
    isEdited: false,
    authInfo: { portraitAuth: false, containsPortrait: false, brandAuth: true, noCompetitorLogo: true },
    citations: [
      { type: "published", title: "618爆款防软便粮拆箱测评", id: "pub_901" }
    ],
    fileInfo: { resolution: "3000x4000", format: "PNG", size: "6.8 MB", aspectRatio: "3:4" }
  }
];

// ----------------------------------------------------------------------
// Mock Material Tasks Data
// ----------------------------------------------------------------------
interface MaterialTask {
  id: string;
  name: string;
  source: "从内容生成" | "手动创建";
  purpose: "指定内容" | "当前项目" | "商家素材储备";
  assignee: string;
  deadline: string;
  progress: string;
  status: "草稿" | "待确认" | "已下发" | "回传中" | "待验收" | "部分通过" | "需要补拍" | "已完成" | "已取消";
  primaryAction: string;
  details: {
    taskPurposeStr: string;
    targetScene: string;
    deliveryChecklist: string[];
    mustInclude: string[];
    mustNotInclude: string[];
    acceptanceCriteria: string;
    returnedCount: number;
    requiredCount: number;
  };
  returnedAssets?: {
    id: string;
    url: string;
    name: string;
    uploader: string;
    time: string;
    aiInspection: {
      quantityOk: boolean;
      sceneMatched: boolean;
      requiredPresent: boolean;
      forbiddenAbsent: boolean;
      clarityOk: boolean;
      summary: string;
    };
  }[];
}

const INITIAL_TASKS: MaterialTask[] = [
  {
    id: "tsk_101",
    name: "门店员工拍摄：幼犬第一人称喂食与颗粒实拍",
    source: "手动创建",
    purpose: "当前项目",
    assignee: "张店长 (KOS团队)",
    deadline: "2026-07-24 18:00",
    progress: "6 / 8 组",
    status: "待验收",
    primaryAction: "去验收回传",
    details: {
      taskPurposeStr: "补充幼犬粮细节实拍图，消除消费者对颗粒大小和诱食剂的疑虑",
      targetScene: "室内诊所/门店养宠角，自然光，瓷碗食盆",
      deliveryChecklist: ["幼犬进食远景 x 2", "进食近景特写 x 2", "双手捏碎颗粒质感 x 2", "食盆清空对比 x 2"],
      mustInclude: ["正品产品包装颗粒", "幼犬积极进食动作"],
      mustNotInclude: ["竞品包装", "乱七八糟的杂乱杂物", "有污垢的食盆"],
      acceptanceCriteria: "画面清晰无虚焦，自然光拍摄，无明显竞品露脸",
      returnedCount: 6,
      requiredCount: 8
    },
    returnedAssets: [
      {
        id: "ret_01",
        url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80",
        name: "IMG_20260721_幼犬进食01.jpg",
        uploader: "张店长",
        time: "2026-07-21 15:30",
        aiInspection: {
          quantityOk: true,
          sceneMatched: true,
          requiredPresent: true,
          forbiddenAbsent: true,
          clarityOk: true,
          summary: "AI预检通过：符合自然光进食场景，无竞品露出，分辨率达标。"
        }
      },
      {
        id: "ret_02",
        url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80",
        name: "IMG_20260721_包装开箱02.jpg",
        uploader: "张店长",
        time: "2026-07-21 15:32",
        aiInspection: {
          quantityOk: true,
          sceneMatched: true,
          requiredPresent: true,
          forbiddenAbsent: false,
          clarityOk: true,
          summary: "AI预检风险：背景右上角发现疑似竞品湿粮包装露出，建议打码或要求补拍。"
        }
      }
    ]
  },
  {
    id: "tsk_102",
    name: "KOC试用回传：宠物医生人设持粮讲解",
    source: "从内容生成",
    purpose: "指定内容",
    assignee: "外部KOC (@宠医小王)",
    deadline: "2026-07-26 20:00",
    progress: "0 / 3 组",
    status: "回传中",
    primaryAction: "查看进展",
    details: {
      taskPurposeStr: "匹配《幼犬换粮软便别慌！3天过渡法》草案中的配图需求",
      targetScene: "诊所环境，白大褂，手持包装",
      deliveryChecklist: ["白大褂持粮正面照 x 1", "诊所台面配方解读 x 2"],
      mustInclude: ["白大褂", "听诊器或诊疗台", "正品 packaging"],
      mustNotInclude: ["水军感过重包装特写", "未授权的诊所标示"],
      acceptanceCriteria: "必须提供医师肖像使用授权声明",
      returnedCount: 0,
      requiredCount: 3
    }
  },
  {
    id: "tsk_103",
    name: "商家备用素材库：8组通用干粮白底与高清3D图",
    source: "手动创建",
    purpose: "商家素材储备",
    assignee: "操盘手自己",
    deadline: "2026-07-30 12:00",
    progress: "10 / 10 组",
    status: "已完成",
    primaryAction: "查看素材",
    details: {
      taskPurposeStr: "储备通用白底与大促卡位图素材，供后续所有项目随时引用",
      targetScene: "纯白或无缝无影摄影棚",
      deliveryChecklist: ["正装正面 png", "侧面营养成分 png", "颗粒拆解 3D"],
      mustInclude: ["高清4K渲染"],
      mustNotInclude: ["低画质水印"],
      acceptanceCriteria: "透明 PNG 格式",
      returnedCount: 10,
      requiredCount: 10
    }
  }
];

export const MaterialStation: React.FC<MaterialStationProps> = () => {
  // Top level tab: "assets" | "tasks"
  const [topTab, setTopTab] = useState<"assets" | "tasks">("assets");

  // State for Assets Tab
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("全部素材");
  const [navCategory, setNavCategory] = useState<string>("全部素材");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [showStorageRulesModal, setShowStorageRulesModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  
  // Smart Collections State
  const [smartCollections, setSmartCollections] = useState<string[]>([
    "封面", "产品", "场景", "用户反馈", "开箱试用", "对比测评"
  ]);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>("");

  // Batch Selection & Batch Operations State
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [showBatchCategorizeModal, setShowBatchCategorizeModal] = useState<boolean>(false);
  const [targetCategorizeScene, setTargetCategorizeScene] = useState<string>("场景");

  // Asset Filter Drawer State
  const [filterType, setFilterType] = useState<string>("全部");
  const [filterProcessStatus, setFilterProcessStatus] = useState<string>("全部");
  const [filterUsageStatus, setFilterUsageStatus] = useState<string>("全部");
  const [filterSource, setFilterSource] = useState<string>("全部");
  const [filterProject, setFilterProject] = useState<string>("全部");

  // Editing Asset Description State
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
  const [tempDescriptionText, setTempDescriptionText] = useState<string>("");

  // State for Tasks Tab
  const [tasks, setTasks] = useState<MaterialTask[]>(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState<string>("需要处理");
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [newTaskStep, setNewTaskStep] = useState<1 | 2 | 3 | 4>(1);
  const [newTaskMode, setNewTaskMode] = useState<"draft" | "manual">("manual");
  const [manualPromptInput, setManualPromptInput] = useState<string>("");
  const [confirmExistingUsed, setConfirmExistingUsed] = useState<boolean>(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<MaterialTask | null>(null);

  // Filter Assets Logic
  const filteredAssets = assets.filter(ast => {
    // Top status pill click filter
    if (statusFilter === "待处理") {
      const isPending = ast.processStatus === "处理失败" || ast.processStatus === "AI分析中" || ast.processStatus === "待审核" || ast.processStatus === "有风险" || !ast.authInfo.portraitAuth;
      if (!isPending) return false;
    } else if (statusFilter === "可使用") {
      if (ast.processStatus !== "可使用") return false;
    } else if (statusFilter === "使用中") {
      if (ast.usageStatus === "未使用") return false;
    }

    // Left Navigation Filter
    if (navCategory === "待处理") {
      const isPending = ast.processStatus === "处理失败" || ast.processStatus === "AI分析中" || ast.processStatus === "待审核" || ast.processStatus === "有风险" || !ast.authInfo.portraitAuth;
      if (!isPending) return false;
    } else if (navCategory === "可使用") {
      if (ast.processStatus !== "可使用") return false;
    } else if (navCategory === "使用中") {
      if (ast.usageStatus === "未使用") return false;
    } else if (navCategory === "已发布") {
      if (ast.usageStatus !== "已发布") return false;
    } else if (navCategory === "有风险") {
      if (ast.processStatus !== "有风险") return false;
    } else if (smartCollections.includes(navCategory)) {
      if (ast.category !== navCategory) return false;
    }

    // Drawer Filters
    if (filterType !== "全部" && ((filterType === "图片" && ast.type !== "image") || (filterType === "视频" && ast.type !== "video"))) return false;
    if (filterProcessStatus !== "全部" && ast.processStatus !== filterProcessStatus) return false;
    if (filterUsageStatus !== "全部" && ast.usageStatus !== filterUsageStatus) return false;
    if (filterSource !== "全部" && ast.source !== filterSource) return false;
    if (filterProject !== "全部" && ast.project !== filterProject) return false;

    // Search Query Matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ast.name.toLowerCase().includes(q);
      const matchFacts = ast.aiVisualFacts.toLowerCase().includes(q);
      const matchSuggest = ast.aiUsageSuggestion.toLowerCase().includes(q);
      const matchTags = ast.tags.some(t => t.toLowerCase().includes(q));
      const matchProject = ast.project?.toLowerCase().includes(q) || false;
      const matchUploader = ast.uploader.toLowerCase().includes(q);
      return matchName || matchFacts || matchSuggest || matchTags || matchProject || matchUploader;
    }

    return true;
  });

  // Batch Select Handlers
  const toggleSelectAsset = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAssetIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map(a => a.id));
    }
  };

  const handleBatchCategorize = () => {
    if (selectedAssetIds.length === 0) return;
    setAssets(prev => prev.map(a => {
      if (selectedAssetIds.includes(a.id)) {
        return { ...a, category: targetCategorizeScene as any };
      }
      return a;
    }));
    const count = selectedAssetIds.length;
    setShowBatchCategorizeModal(false);
    setSelectedAssetIds([]);
    alert(`已将 ${count} 个素材成功批量归类至场景【${targetCategorizeScene}】！`);
  };

  const handleBatchDelete = () => {
    if (selectedAssetIds.length === 0) return;
    const citedAssets = assets.filter(a => selectedAssetIds.includes(a.id) && a.citations.length > 0);
    
    if (citedAssets.length > 0) {
      const citedNames = citedAssets.map(a => a.name).join("、");
      if (!confirm(`选中的素材中有 ${citedAssets.length} 个正被项目/草稿引用（如：${citedNames}）。直接删除可能导致关联失效，是否跳过有引用的素材，删除其余未引用的素材？`)) {
        return;
      }
      const uncitedIds = selectedAssetIds.filter(id => !citedAssets.some(c => c.id === id));
      setAssets(prev => prev.filter(a => !uncitedIds.includes(a.id)));
      setSelectedAssetIds([]);
      if (selectedAsset && uncitedIds.includes(selectedAsset.id)) {
        setSelectedAsset(null);
      }
      alert(`已批量删除 ${uncitedIds.length} 个未引用素材，保留了 ${citedAssets.length} 个被引用的素材。`);
    } else {
      if (confirm(`确认批量删除选中的 ${selectedAssetIds.length} 个素材吗？`)) {
        const count = selectedAssetIds.length;
        setAssets(prev => prev.filter(a => !selectedAssetIds.includes(a.id)));
        setSelectedAssetIds([]);
        if (selectedAsset && selectedAssetIds.includes(selectedAsset.id)) {
          setSelectedAsset(null);
        }
        alert(`已成功批量删除 ${count} 个素材！`);
      }
    }
  };

  // Smart Collection Handlers
  const handleAddCollection = () => {
    const trimmed = newCollectionName.trim();
    if (!trimmed) return;
    if (smartCollections.includes(trimmed)) {
      alert("已存在同名智能集合！");
      return;
    }
    setSmartCollections(prev => [...prev, trimmed]);
    setNewCollectionName("");
    setShowAddCollectionModal(false);
  };

  const handleDeleteCollection = (collectionName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (smartCollections.length <= 1) {
      alert("请至少保留一个智能集合！");
      return;
    }
    if (confirm(`确认删除智能集合【${collectionName}】吗？删除集合不会删除素材本体。`)) {
      setSmartCollections(prev => prev.filter(c => c !== collectionName));
      if (navCategory === collectionName) {
        setNavCategory("全部素材");
      }
    }
  };

  // Count helper
  const pendingCount = assets.filter(a => a.processStatus === "处理失败" || a.processStatus === "AI分析中" || a.processStatus === "待审核" || a.processStatus === "有风险" || !a.authInfo.portraitAuth).length;
  const availableCount = assets.filter(a => a.processStatus === "可使用").length;
  const inUseCount = assets.filter(a => a.usageStatus !== "未使用").length;

  // Task Filter Logic
  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "全部") return true;
    if (taskFilter === "需要处理") return t.status === "待确认" || t.status === "回传中" || t.status === "待验收" || t.status === "需要补拍" || t.status === "草稿";
    return t.status === taskFilter;
  });

  const needProcessTaskCount = tasks.filter(t => t.status === "待确认" || t.status === "回传中" || t.status === "待验收" || t.status === "需要补拍" || t.status === "草稿").length;

  // Save edited AI Description
  const handleSaveDescription = () => {
    if (!selectedAsset) return;
    const updated = {
      ...selectedAsset,
      activeDescription: tempDescriptionText,
      isEdited: true,
      editHistory: [
        ...(selectedAsset.editHistory || []),
        { user: "操盘手", time: new Date().toLocaleTimeString() }
      ]
    };
    setSelectedAsset(updated);
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    setIsEditingDescription(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] text-neutral-900 overflow-hidden font-sans">
      
      {/* ========================================================= */}
      {/* TOP MODULE HEADER & TWO PRIMARY TABS                      */}
      {/* ========================================================= */}
      <div className="px-8 pt-5 pb-3 border-b border-neutral-200 bg-white shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">
              素材中心
            </h1>
            <span className="text-[12px] text-neutral-500 font-normal">
              统一管理商家的图片与视频资产及获取任务，为项目与发布流程提供精准素材支持。
            </span>
          </div>

          {/* Top Two Level Tabs */}
          <div className="flex items-center gap-6 mt-3">
            <button
              onClick={() => setTopTab("assets")}
              className={`pb-2 text-[14px] font-bold transition-all border-b-2 flex items-center gap-2 ${
                topTab === "assets"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <ImageIcon size={16} />
              素材资产
              <span className="px-2 py-0.2 bg-neutral-100 text-neutral-600 text-[11px] rounded-full font-semibold">
                {assets.length}
              </span>
            </button>

            <button
              onClick={() => setTopTab("tasks")}
              className={`pb-2 text-[14px] font-bold transition-all border-b-2 flex items-center gap-2 ${
                topTab === "tasks"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <Layers size={16} />
              素材任务
              {needProcessTaskCount > 0 && (
                <span className="px-2 py-0.2 bg-red-100 text-red-700 text-[11px] rounded-full font-semibold">
                  {needProcessTaskCount} 待处理
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Top Right Buttons based on Tab */}
        {topTab === "assets" ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStorageRulesModal(true)}
              className="px-3.5 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[12px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Lock size={14} className="text-neutral-500" />
              存储与规则
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Upload size={15} />
              上传素材
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setNewTaskStep(1);
              setShowNewTaskModal(true);
            }}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            新建素材任务
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. TAB: 素材资产 (Material Assets)                       */}
      {/* ========================================================= */}
      {topTab === "assets" && (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <div className="w-56 border-r border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-5">
              {/* Processing Status Categories */}
              <div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">
                  处理状态
                </div>
                <div className="space-y-1">
                  {[
                    { id: "全部素材", label: "全部素材", count: assets.length },
                    { id: "待处理", label: "待处理", count: pendingCount, isAlert: pendingCount > 0 },
                    { id: "可使用", label: "可使用", count: availableCount },
                    { id: "使用中", label: "使用中", count: inUseCount },
                    { id: "已发布", label: "已发布", count: assets.filter(a => a.usageStatus === "已发布").length },
                    { id: "有风险", label: "有风险", count: assets.filter(a => a.processStatus === "有风险").length, isAlert: true },
                    { id: "回收站", label: "回收站", count: 0 }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setNavCategory(item.id);
                        setStatusFilter("全部");
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center justify-between ${
                        navCategory === item.id
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`px-1.5 py-0.2 text-[10px] rounded font-medium ${
                        navCategory === item.id
                          ? "bg-neutral-800 text-neutral-300"
                          : item.isAlert
                          ? "bg-red-100 text-red-700 font-bold"
                          : "bg-neutral-200/60 text-neutral-500"
                      }`}>
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Smart Collections (规则自动关联) */}
              <div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>智能集合</span>
                    <Sparkles size={12} className="text-primary-600" />
                  </span>
                  <button
                    onClick={() => setShowAddCollectionModal(true)}
                    className="p-1 hover:bg-neutral-200/60 rounded-md text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-0.5 text-[10px] font-bold"
                    title="新增智能集合"
                  >
                    <Plus size={12} />
                    新增
                  </button>
                </div>
                <div className="space-y-1">
                  {smartCollections.map(cat => (
                    <div
                      key={cat}
                      className={`group/cat flex items-center justify-between w-full rounded-lg transition-all ${
                        navCategory === cat
                          ? "bg-neutral-900 text-white font-bold shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <button
                        onClick={() => setNavCategory(cat)}
                        className="flex-1 px-3 py-1.5 text-left text-[12px] font-medium flex items-center justify-between truncate"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Tag size={12} className={navCategory === cat ? "text-primary-400 shrink-0" : "text-neutral-400 shrink-0"} />
                          <span className="truncate">{cat}</span>
                        </span>
                        <span className={`text-[10px] ml-1 shrink-0 ${navCategory === cat ? "text-neutral-300" : "text-neutral-400"}`}>
                          {assets.filter(a => a.category === cat).length}
                        </span>
                      </button>

                      {/* Delete collection button */}
                      <button
                        onClick={(e) => handleDeleteCollection(cat, e)}
                        className={`p-1.5 mr-1 rounded hover:bg-red-500/20 hover:text-red-600 transition-colors opacity-0 group-hover/cat:opacity-100 ${
                          navCategory === cat ? "text-neutral-300 hover:text-white" : "text-neutral-400"
                        }`}
                        title={`删除集合【${cat}】`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Private OSS Status Note */}
            <div className="p-3 bg-neutral-100/80 rounded-xl text-[11px] text-neutral-500 space-y-1 border border-neutral-200/50">
              <div className="font-bold text-neutral-700 flex items-center gap-1">
                <Cloud size={13} className="text-primary-600" /> OSS 私有存储就绪
              </div>
              <p className="text-[10px] leading-tight text-neutral-500">
                原文件保密传输，避免暴露技术路径与服务器缓存。
              </p>
            </div>
          </div>

          {/* Main Asset Grid Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden px-6 py-4">
            
            {/* Compact Single-line Status Bar (NO Large Metric Cards) */}
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-sm shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[12px] font-bold text-neutral-400 mr-1 shrink-0">状态快照:</span>
                
                {[
                  { id: "全部素材", label: `全部素材 (${assets.length})` },
                  { id: "待处理", label: `待处理 (${pendingCount})`, isAlert: pendingCount > 0 },
                  { id: "可使用", label: `可使用 (${availableCount})` },
                  { id: "使用中", label: `使用中 (${inUseCount})` }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setStatusFilter(st.id);
                      setNavCategory("全部素材");
                    }}
                    className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                      statusFilter === st.id
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60"
                    }`}
                  >
                    <span>{st.label}</span>
                    {st.isAlert && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {/* Private Storage Usage Display */}
              <div className="flex items-center gap-2 text-[12px] text-neutral-500 font-medium shrink-0 border-l border-neutral-200 pl-4">
                <HardDrive size={14} className="text-neutral-400" />
                <span>存储用量：<strong className="text-neutral-900">18.4 GB</strong> / 100 GB</span>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="搜索文件名、AI画面描述、OCR文字、标签、产品、场景、项目名称..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-neutral-900 transition-colors shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Select All / Batch Toggle Button */}
              <button
                onClick={toggleSelectAll}
                className={`px-3.5 py-2 border text-[12px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 ${
                  selectedAssetIds.length > 0 && selectedAssetIds.length === filteredAssets.length
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : selectedAssetIds.length > 0
                    ? "bg-neutral-100 text-neutral-900 border-neutral-300"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {selectedAssetIds.length > 0 && selectedAssetIds.length === filteredAssets.length ? (
                  <CheckSquare size={15} />
                ) : (
                  <Square size={15} />
                )}
                {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0
                  ? "取消全选"
                  : selectedAssetIds.length > 0
                  ? `已选 (${selectedAssetIds.length}/${filteredAssets.length})`
                  : "批量选择"}
              </button>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0"
              >
                <SlidersHorizontal size={15} />
                多维筛选
              </button>
            </div>

            {/* Floating Batch Operation Bar */}
            <AnimatePresence>
              {selectedAssetIds.length > 0 && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-800 flex items-center gap-6"
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    已选中 <span className="text-emerald-400">{selectedAssetIds.length}</span> 个素材
                  </div>

                  <div className="h-4 w-px bg-neutral-700" />

                  <div className="flex items-center gap-3 text-[12px]">
                    <button
                      onClick={() => setShowBatchCategorizeModal(true)}
                      className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Tag size={13} className="text-primary-400" />
                      批量归类场景
                    </button>

                    <button
                      onClick={handleBatchDelete}
                      className="px-3.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      批量删除
                    </button>

                    <button
                      onClick={() => setSelectedAssetIds([])}
                      className="px-2.5 py-1.5 text-neutral-400 hover:text-white font-medium text-[11px]"
                    >
                      取消选择
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Asset Cards Grid */}
            <div className="flex-1 overflow-y-auto pr-1 pb-10">
              {filteredAssets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-400 bg-white border border-neutral-200/80 rounded-2xl p-8">
                  <ImageIcon size={36} className="text-neutral-300 mb-2" />
                  <p className="text-[14px] font-bold text-neutral-600">未找到匹配的素材资产</p>
                  <p className="text-[12px] text-neutral-400 mt-1">请尝试重置筛选或更改搜索关键字</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredAssets.map(ast => {
                    let procStyle = "bg-neutral-100 text-neutral-700 border-neutral-200";
                    if (ast.processStatus === "可使用") procStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    else if (ast.processStatus === "有风险") procStyle = "bg-red-50 text-red-800 border-red-200";
                    else if (ast.processStatus === "待审核") procStyle = "bg-amber-50 text-amber-800 border-amber-200";
                    else if (ast.processStatus === "AI分析中") procStyle = "bg-blue-50 text-blue-800 border-blue-200 animate-pulse";

                    let usageStyle = "bg-neutral-100 text-neutral-600";
                    if (ast.usageStatus === "已发布") usageStyle = "bg-purple-100 text-purple-800 font-bold";
                    else if (ast.usageStatus === "项目使用中") usageStyle = "bg-blue-100 text-blue-800 font-bold";
                    else if (ast.usageStatus === "草稿使用中") usageStyle = "bg-amber-100 text-amber-800 font-bold";

                    const isSelected = selectedAssetIds.includes(ast.id);

                    return (
                      <div
                        key={ast.id}
                        onClick={() => setSelectedAsset(ast)}
                        className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-400 transition-all cursor-pointer flex flex-col group relative ${
                          selectedAsset?.id === ast.id
                            ? "border-2 border-neutral-900 ring-2 ring-neutral-900/10"
                            : isSelected
                            ? "border-2 border-primary-600 ring-2 ring-primary-600/20 bg-primary-50/10"
                            : "border-neutral-200"
                        }`}
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                          <img
                            src={ast.thumbnail}
                            alt={ast.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Checkbox for Batch Selection */}
                          <button
                            onClick={(e) => toggleSelectAsset(ast.id, e)}
                            className={`absolute top-2 left-2 p-1 rounded-lg backdrop-blur-md transition-all z-10 ${
                              isSelected
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
                            }`}
                            title={isSelected ? "取消勾选" : "勾选素材"}
                          >
                            {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                          </button>

                          {/* Media Type Badge */}
                          <div className="absolute top-2 left-9 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                            {ast.type === "video" ? <Video size={10} /> : <ImageIcon size={10} />}
                            {ast.type === "video" ? ast.duration || "视频" : "图片"}
                          </div>

                          {/* Usage / Single-Use Lock Badge */}
                          <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-md font-bold flex items-center gap-1 ${
                            ast.usageStatus !== "未使用" ? "bg-amber-500 text-white shadow-sm" : "bg-emerald-600 text-white"
                          }`}>
                            {ast.usageStatus !== "未使用" ? (
                              <>
                                <Lock size={10} />
                                <span>已使用(全网锁定)</span>
                              </>
                            ) : (
                              <span>单次授权(未使用)</span>
                            )}
                          </div>

                          {/* Portrait Status Tag if contains portrait */}
                          {ast.authInfo.containsPortrait && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-md text-white text-[9px] font-bold rounded flex items-center gap-1">
                              <ShieldAlert size={9} className={
                                ast.authInfo.isKocSelfPortrait ? "text-blue-400" :
                                ast.authInfo.autoBlurredPortrait ? "text-emerald-400" : "text-amber-400"
                              } />
                              {ast.authInfo.isKocSelfPortrait
                                ? "KOC本人肖像(许可)"
                                : ast.authInfo.autoBlurredPortrait
                                ? "人脸已打码"
                                : "肖像未签署"}
                            </div>
                          )}
                        </div>

                        {/* Card Info Content */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h4 className="text-[13px] font-bold text-neutral-900 truncate leading-snug group-hover:text-primary-600 transition-colors">
                              {ast.name}
                            </h4>
                            
                            {/* Processing Status Badge */}
                            <div className="mt-1.5 flex items-center gap-1">
                              <span className={`px-2 py-0.3 text-[10px] font-bold rounded border ${procStyle}`}>
                                {ast.processStatus}
                              </span>
                              {ast.riskType && (
                                <span className="text-[10px] text-red-600 truncate max-w-[100px] font-medium">
                                  {ast.riskType}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Max 3 Tags */}
                          <div className="flex flex-wrap gap-1 pt-1 border-t border-neutral-100">
                            {ast.tags.slice(0, 3).map((tg, i) => (
                              <span key={i} className="text-[10px] text-neutral-500 bg-neutral-50 border border-neutral-100 px-1.5 py-0.3 rounded">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Asset Detail Drawer */}
          <AnimatePresence>
            {selectedAsset && (
              <motion.div
                initial={{ x: 380, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 380, opacity: 0 }}
                className="w-96 border-l border-neutral-200 bg-white p-6 shrink-0 flex flex-col justify-between overflow-y-auto shadow-2xl z-20"
              >
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                      <ImageIcon size={16} className="text-primary-600" />
                      素材详情
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedAsset(null);
                        setIsEditingDescription(false);
                      }}
                      className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* 1. Preview */}
                  <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 relative aspect-[4/3]">
                    <img
                      src={selectedAsset.thumbnail}
                      alt={selectedAsset.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[11px] rounded font-mono">
                      {selectedAsset.fileInfo.resolution}
                    </div>
                  </div>

                  {/* 2. AI Visual Description (Visually Separated: 画面事实 vs 用途建议) */}
                  <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] font-bold text-neutral-900 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-primary-600" />
                        AI 智能分析描述
                      </div>
                      <div className="flex items-center gap-2">
                        {!isEditingDescription ? (
                          <button
                            onClick={() => {
                              setTempDescriptionText(selectedAsset.activeDescription);
                              setIsEditingDescription(true);
                            }}
                            className="text-[11px] text-primary-600 hover:underline font-bold flex items-center gap-1"
                          >
                            <Edit3 size={11} /> 编辑描述
                          </button>
                        ) : (
                          <button
                            onClick={handleSaveDescription}
                            className="text-[11px] text-emerald-600 hover:underline font-bold flex items-center gap-1"
                          >
                            <Check size={11} /> 保存修改
                          </button>
                        )}
                      </div>
                    </div>

                    {!isEditingDescription ? (
                      <div className="space-y-3 text-[12px]">
                        {/* 画面事实 Field */}
                        <div className="p-3 bg-white rounded-xl border border-neutral-200/60">
                          <span className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase tracking-wider">
                            画面事实 (即时观察事实)
                          </span>
                          <p className="text-neutral-800 leading-relaxed">
                            {selectedAsset.activeDescription}
                          </p>
                        </div>

                        {/* 用途建议 Field */}
                        <div className="p-3 bg-primary-50/50 rounded-xl border border-primary-100">
                          <span className="text-[10px] font-bold text-primary-700 block mb-1 uppercase tracking-wider">
                            用途建议 (运营策略匹配)
                          </span>
                          <p className="text-primary-900 leading-relaxed font-medium">
                            {selectedAsset.aiUsageSuggestion}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={tempDescriptionText}
                          onChange={e => setTempDescriptionText(e.target.value)}
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-[12px] focus:outline-none focus:border-neutral-900"
                        />
                        <p className="text-[10px] text-neutral-400">
                          保存后优先用于精准检索，系统将保留AI原始分析记录。
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. Classification & Tags */}
                  <div className="space-y-2">
                    <div className="text-[12px] font-bold text-neutral-500">分类与标签</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-bold rounded-lg">
                        {selectedAsset.category}
                      </span>
                      {selectedAsset.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-1 bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. 排重与单次锁定规则 (一图单用) */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2 text-[12px]">
                    <div className="font-bold text-neutral-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock size={13} className={selectedAsset.usageStatus !== "未使用" ? "text-amber-600" : "text-emerald-600"} />
                        一图单用与排重锁
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedAsset.usageStatus !== "未使用"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {selectedAsset.usageStatus !== "未使用" ? "已使用 (占用锁定)" : "全新未用 (单次授权)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      {selectedAsset.usageStatus !== "未使用"
                        ? `该素材已在《${selectedAsset.citations[0]?.title || selectedAsset.project || "现有草稿"}》中使用。为防止小红书全网查重导致账号降权限流，同一图片/视频仅能使用 1 次，已锁定不可二次排版。`
                        : "遵照小红书平台防查重与一图多发判定规则，每张图片/视频仅允许排版发布 1 次。次后将自动开启全网锁盘。"}
                    </p>
                  </div>

                  {/* 5. 肖像使用权与风险判定 */}
                  <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 space-y-2.5 text-[12px]">
                    <div className="font-bold text-neutral-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert size={14} className={
                          !selectedAsset.authInfo.containsPortrait ? "text-emerald-600" :
                          selectedAsset.authInfo.isKocSelfPortrait ? "text-blue-600" :
                          selectedAsset.authInfo.autoBlurredPortrait ? "text-emerald-600" : "text-amber-600"
                        } />
                        肖像权与合规评估
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {selectedAsset.authInfo.containsPortrait ? "画面含肖像" : "无真人肖像"}
                      </span>
                    </div>

                    {selectedAsset.authInfo.containsPortrait ? (
                      <div className="space-y-2 text-neutral-600 text-[11px]">
                        {selectedAsset.authInfo.isKocSelfPortrait ? (
                          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 leading-relaxed">
                            <strong className="block text-blue-900 text-[11px] mb-0.5">特例许可：KOC / 店长本人出镜</strong>
                            该内容由 KOC/店长发布其本人肖像的笔记，符合平台版权许可规则，无需额外签署肖像协议。
                          </div>
                        ) : (
                          <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-900 space-y-1">
                            <div className="font-bold flex items-center gap-1 text-amber-800 text-[11px]">
                              <AlertCircle size={12} /> 未签署肖像协议 (高风险)
                            </div>
                            <div className="text-[10px] text-amber-800 leading-relaxed">
                              大部分情况下肖像权难以取得纸质签署。建议自动对面部模糊打码，并尽量减少非授权肖像的使用。
                            </div>
                          </div>
                        )}

                        {/* Toggle for Face Auto-Blur */}
                        {!selectedAsset.authInfo.isKocSelfPortrait && (
                          <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-200/80">
                            <div>
                              <div className="font-bold text-neutral-800 text-[11px]">肖像自动模糊 / 人脸打码</div>
                              <div className="text-[10px] text-neutral-400">规避肖像侵权纠纷，保留环境主体</div>
                            </div>
                            <button
                              onClick={() => {
                                const updated = {
                                  ...selectedAsset,
                                  authInfo: {
                                    ...selectedAsset.authInfo,
                                    autoBlurredPortrait: !selectedAsset.authInfo.autoBlurredPortrait
                                  }
                                };
                                setSelectedAsset(updated);
                                setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
                              }}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                                selectedAsset.authInfo.autoBlurredPortrait
                                  ? "bg-emerald-600 text-white"
                                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                              }`}
                            >
                              {selectedAsset.authInfo.autoBlurredPortrait ? "已开启打码" : "开启人脸模糊"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-100">
                        画面无真人肖像露出，不存在肖像权侵权风险。
                      </div>
                    )}
                  </div>

                  {/* 6. Usage Records */}
                  <div className="space-y-2">
                    <div className="text-[12px] font-bold text-neutral-500">使用与引用记录</div>
                    {selectedAsset.citations.length === 0 ? (
                      <div className="p-3 bg-neutral-50 rounded-xl text-[12px] text-neutral-400">
                        暂无项目或草稿引用该素材
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {selectedAsset.citations.map((c, i) => (
                          <div key={i} className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[12px] flex items-center justify-between">
                            <span className="font-bold text-neutral-800 truncate max-w-[200px]">{c.title}</span>
                            <span className="text-[10px] text-primary-600 font-bold bg-primary-50 px-1.5 py-0.5 rounded">
                              {c.type === "project" ? "项目引用" : c.type === "draft" ? "草稿引用" : "已发布笔记"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 7. File Info (NO local paths exposed!) */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[11px] text-neutral-500 space-y-1">
                    <div className="font-bold text-neutral-700 mb-1">文件元数据</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>格式：{selectedAsset.fileInfo.format}</div>
                      <div>大小：{selectedAsset.fileInfo.size}</div>
                      <div>分辨率：{selectedAsset.fileInfo.resolution}</div>
                      <div>比例：{selectedAsset.fileInfo.aspectRatio}</div>
                      <div className="col-span-2">上传者：{selectedAsset.uploader} ({selectedAsset.uploadTime})</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Drawer Action Buttons */}
                <div className="pt-4 border-t border-neutral-100 mt-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <button className="text-neutral-600 hover:text-neutral-900 font-bold flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
                      <Download size={13} /> 下载原文件
                    </button>

                    {selectedAsset.citations.length > 0 ? (
                      <span className="text-amber-700 text-[11px] font-bold flex items-center gap-1">
                        <AlertCircle size={13} /> 被 {selectedAsset.citations.length} 处引用 (已锁定)
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setAssets(prev => prev.filter(a => a.id !== selectedAsset.id));
                          setSelectedAsset(null);
                        }}
                        className="text-red-600 hover:text-red-700 font-bold text-[11px] px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        移入回收站
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TAB: 素材任务 (Material Tasks)                          */}
      {/* ========================================================= */}
      {topTab === "tasks" && (
        <div className="flex-1 flex flex-col overflow-hidden px-8 py-5">
          {/* Status Filter Pills */}
          <div className="flex items-center justify-between mb-5 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                "需要处理", "草稿", "已下发", "回传中", "待验收", "需要补拍", "已完成", "全部"
              ].map(st => {
                const active = taskFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setTaskFilter(st)}
                    className={`px-3.5 py-1.5 text-[12px] font-bold rounded-xl transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                      active
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{st}</span>
                    {st === "需要处理" && needProcessTaskCount > 0 && (
                      <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                        active ? "bg-red-500 text-white" : "bg-red-100 text-red-700"
                      }`}>
                        {needProcessTaskCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-[12px] text-neutral-400 font-medium">
              共 {filteredTasks.length} 个工作单
            </div>
          </div>

          {/* Task List Grid */}
          <div className="flex-1 overflow-y-auto pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTasks.map(tsk => {
                let statusBadge = "bg-neutral-100 text-neutral-700 border-neutral-200";
                if (tsk.status === "待验收") statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
                else if (tsk.status === "已完成") statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
                else if (tsk.status === "回传中") statusBadge = "bg-blue-50 text-blue-800 border-blue-200";
                else if (tsk.status === "需要补拍") statusBadge = "bg-red-50 text-red-800 border-red-200";

                return (
                  <div
                    key={tsk.id}
                    className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Title & Status */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-[15px] font-bold text-neutral-900 leading-snug truncate">
                          {tsk.name}
                        </h3>
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border shrink-0 ${statusBadge}`}>
                          {tsk.status}
                        </span>
                      </div>

                      {/* Fields Row */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[12px] mb-4">
                        <div>
                          <span className="text-neutral-400 block mb-0.5">来源</span>
                          <strong className="text-neutral-800">{tsk.source}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block mb-0.5">用途</span>
                          <strong className="text-neutral-800">{tsk.purpose}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block mb-0.5">负责人</span>
                          <strong className="text-neutral-800 truncate block">{tsk.assignee}</strong>
                        </div>
                      </div>

                      {/* Details Summary Box */}
                      <div className="p-3 bg-neutral-50/50 rounded-xl border border-neutral-100 text-[12px] text-neutral-700 space-y-1 mb-4">
                        <div><strong className="text-neutral-900">目的：</strong>{tsk.details.taskPurposeStr}</div>
                        <div><strong className="text-neutral-900">截止时间：</strong>{tsk.deadline}</div>
                      </div>
                    </div>

                    {/* Bottom Progress & Action Button */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div className="text-[12px] font-bold text-neutral-900 flex items-center gap-1.5">
                        <Camera size={14} className="text-neutral-400" />
                        回传进度：<span className="text-primary-600">{tsk.progress}</span>
                      </div>

                      <button
                        onClick={() => setSelectedTaskDetail(tsk)}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-bold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        {tsk.primaryAction}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NEW MATERIAL TASK (4-STEP UNIFIED CREATION FLOW)   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 shrink-0">
                <div>
                  <h3 className="text-[16px] font-bold text-neutral-900">
                    新建素材任务 (智能工作单)
                  </h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    从需求整理、已有素材检索匹配到精准下发。
                  </p>
                </div>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stepper Header */}
              <div className="flex items-center justify-between my-4 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[12px] shrink-0">
                {[
                  { s: 1, name: "1. 提出需求" },
                  { s: 2, name: "2. AI整理需求" },
                  { s: 3, name: "3. 匹配已有素材" },
                  { s: 4, name: "4. 确认并下发" }
                ].map(item => (
                  <div
                    key={item.s}
                    className={`font-bold px-3 py-1 rounded-lg ${
                      newTaskStep === item.s
                        ? "bg-neutral-900 text-white shadow-sm"
                        : newTaskStep > item.s
                        ? "bg-neutral-200 text-neutral-700"
                        : "text-neutral-400"
                    }`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Step Content Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                
                {/* STEP 1: 提出需求 */}
                {newTaskStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setNewTaskMode("manual")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          newTaskMode === "manual"
                            ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10"
                            : "border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="font-bold text-[13px] text-neutral-900 mb-1">手动自然语言创建</div>
                        <div className="text-[11px] text-neutral-500">直接输入操盘意图与拍摄说明</div>
                      </button>

                      <button
                        onClick={() => setNewTaskMode("draft")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          newTaskMode === "draft"
                            ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10"
                            : "border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="font-bold text-[13px] text-neutral-900 mb-1">从内容草稿生成</div>
                        <div className="text-[11px] text-neutral-500">选择已有内容，由AI自动拆解分镜头</div>
                      </button>
                    </div>

                    {newTaskMode === "manual" ? (
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-neutral-700">
                          描述这次需要准备什么素材：
                        </label>
                        <textarea
                          rows={5}
                          value={manualPromptInput}
                          onChange={e => setManualPromptInput(e.target.value)}
                          placeholder="例如：让门店员工拍一批真实幼犬喂食场景，重点展示进食状态和粮食颗粒，不要出现竞品包装，下周三前完成。"
                          className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-[12px]">
                        <span className="font-bold text-neutral-900 block">关联内容草稿：</span>
                        <select className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl">
                          <option>【草稿】幼犬换粮软便别慌！3天过渡法.md</option>
                          <option>【草稿】新手养狗必看：粮颗粒怎么选？.md</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: AI整理需求 */}
                {newTaskStep === 2 && (
                  <div className="space-y-3 text-[12px]">
                    <div className="p-3 bg-primary-50/60 border border-primary-100 rounded-xl flex items-center gap-2 text-primary-900 font-bold">
                      <Sparkles size={16} className="text-primary-600" />
                      AI 已自动将您的指令结构化解析为以下需求维度：
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      <div><strong>任务目的：</strong>补充幼犬换粮真实信任感</div>
                      <div><strong>拍摄场景：</strong>室内室内宠物角落 / 瓷碗</div>
                      <div><strong>要求图片/视频：</strong>图片 6 组，视频 2 组</div>
                      <div><strong>必须包含：</strong>正品颗粒，幼犬主动进食</div>
                      <div className="col-span-2 text-red-700"><strong>禁止出现：</strong>竞品包装，杂乱垃圾</div>
                    </div>
                  </div>
                )}

                {/* STEP 3: 优先匹配已有素材 (Prior Matching!) */}
                {newTaskStep === 3 && (
                  <div className="space-y-4 text-[12px]">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>AI 已检索素材中心：发现 <strong>2</strong> 组已有素材可完全满足部分需求！</span>
                      </div>
                      <button
                        onClick={() => setConfirmExistingUsed(true)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                          confirmExistingUsed ? "bg-emerald-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {confirmExistingUsed ? "已选择复用已有" : "确认使用已有素材"}
                      </button>
                    </div>

                    {/* Section 1: 已有素材可满足 */}
                    <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2">
                      <div className="font-bold text-neutral-900 text-[13px]">已有素材可满足部分：</div>
                      <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                        <img src={INITIAL_ASSETS[0].thumbnail} alt="" className="w-12 h-12 rounded object-cover" />
                        <div>
                          <div className="font-bold text-neutral-900">{INITIAL_ASSETS[0].name}</div>
                          <div className="text-[11px] text-neutral-500">匹配原因：包含金色幼犬于室内瓷碗进食事实</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: 仍然缺少 */}
                    <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                      <div className="font-bold text-amber-900 text-[13px]">仍然缺少 (将下发为新任务)：</div>
                      <div className="text-amber-800">
                        还需补拍 <strong>6</strong> 组细节实拍图（捏碎颗粒质感与双手开箱）。
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: 确认并下发 */}
                {newTaskStep === 4 && (
                  <div className="space-y-3 text-[12px]">
                    <div className="space-y-2">
                      <label className="font-bold text-neutral-800">指定下发对象：</label>
                      <select className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold">
                        <option>张店长 (KOS团队店长)</option>
                        <option>李店长 (KOS团队店员)</option>
                        <option>外部KOC (生成安全回传链接)</option>
                        <option>操盘手自己</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-neutral-800 block mb-1">截止时间：</label>
                        <input type="date" defaultValue="2026-07-25" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="font-bold text-neutral-800 block mb-1">缺口交付数量：</label>
                        <input type="number" defaultValue={6} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between shrink-0 mt-2">
                {newTaskStep > 1 ? (
                  <button
                    onClick={() => setNewTaskStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-[12px] font-bold"
                  >
                    上一步
                  </button>
                ) : <div />}

                {newTaskStep < 4 ? (
                  <button
                    onClick={() => setNewTaskStep((prev) => (prev + 1) as any)}
                    className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    下一步
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const newT: MaterialTask = {
                        id: "tsk_" + Date.now(),
                        name: manualPromptInput ? `需求任务：${manualPromptInput.slice(0, 15)}...` : "智能拆解素材补拍任务",
                        source: newTaskMode === "manual" ? "手动创建" : "从内容生成",
                        purpose: "当前项目",
                        assignee: "张店长 (KOS团队)",
                        deadline: "2026-07-25 18:00",
                        progress: "0 / 6 组",
                        status: "回传中",
                        primaryAction: "提醒下发",
                        details: {
                          taskPurposeStr: manualPromptInput || "补充细节缺口",
                          targetScene: "室内宠物角",
                          deliveryChecklist: ["幼犬进食 6 组"],
                          mustInclude: ["正品颗粒"],
                          mustNotInclude: ["竞品"],
                          acceptanceCriteria: "无竞品，清晰自然光",
                          returnedCount: 0,
                          requiredCount: 6
                        }
                      };
                      setTasks(prev => [newT, ...prev]);
                      setShowNewTaskModal(false);
                      alert("素材任务下发成功！后台已生成标准化指导单。");
                    }}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[12px] font-bold transition-colors shadow-md"
                  >
                    确认并下发任务
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* DRAWER: TASK RETURN & ACCEPTANCE DETAILS                  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedTaskDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 shrink-0">
                <div>
                  <h3 className="text-[16px] font-bold text-neutral-900">
                    素材任务回传与 AI 验收：{selectedTaskDetail.name}
                  </h3>
                  <p className="text-[12px] text-neutral-500">
                    对照任务要求自动预检回传素材质感与合规度。
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTaskDetail(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 py-4">
                {/* Task Details Summary */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-[12px] space-y-1">
                  <div><strong>负责人：</strong>{selectedTaskDetail.assignee}</div>
                  <div><strong>交付要点：</strong>{selectedTaskDetail.details.deliveryChecklist.join(" / ")}</div>
                  <div className="text-red-700"><strong>禁止项：</strong>{selectedTaskDetail.details.mustNotInclude.join(" / ")}</div>
                </div>

                {/* Returned Assets Pre-inspection */}
                <div className="space-y-3">
                  <div className="font-bold text-[13px] text-neutral-900">
                    员工已回传批次 ({selectedTaskDetail.returnedAssets?.length || 0} 组)：
                  </div>

                  {selectedTaskDetail.returnedAssets?.map((ret, i) => (
                    <div key={i} className="p-4 border border-neutral-200 rounded-xl flex items-start gap-4 bg-white">
                      <img src={ret.url} alt="" className="w-24 h-24 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2 text-[12px]">
                        <div className="flex items-center justify-between">
                          <strong className="text-neutral-900">{ret.name}</strong>
                          <span className="text-neutral-400">{ret.time}</span>
                        </div>

                        {/* AI Pre-inspection Summary */}
                        <div className={`p-2.5 rounded-lg border text-[11px] ${
                          ret.aiInspection.forbiddenAbsent
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}>
                          <strong className="font-bold block mb-0.5">AI 自动预检结论：</strong>
                          {ret.aiInspection.summary}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceptance Decision Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    alert("已发起补拍通知并退回任务！");
                    setSelectedTaskDetail(null);
                  }}
                  className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-xl text-[12px] font-bold transition-colors"
                >
                  要求补拍 (退回)
                </button>

                <button
                  onClick={() => {
                    alert("验收通过！所选素材已自动存入【素材中心】并生成AI描述与向量标签。");
                    setSelectedTaskDetail(null);
                  }}
                  className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-bold transition-colors shadow-sm"
                >
                  全部通过并入库
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: STORAGE & RULES (存储与规则)                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showStorageRulesModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                  <Lock size={16} className="text-primary-600" />
                  存储与安全规则
                </h3>
                <button
                  onClick={() => setShowStorageRulesModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-[12px] text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
                  <strong className="text-neutral-900 block">云端 OSS 私有存储机制：</strong>
                  <p className="text-neutral-600 leading-relaxed">
                    素材原文件直接上传并持久化保存于私有 OSS 节点。前端仅使用唯一的 asset_id 交互，绝不暴露存储 Object Key、服务器本地临时缓存或逻辑路径。
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
                  <strong className="text-neutral-900 block">脱敏与授权保障：</strong>
                  <p className="text-neutral-600 leading-relaxed">
                    KOC 与员工回传素材时支持免下载全密态上传，平台自动核验肖像授权承诺与无竞品合规。
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex justify-end">
                <button
                  onClick={() => setShowStorageRulesModal(false)}
                  className="px-5 py-2 bg-neutral-900 text-white font-bold text-[12px] rounded-xl"
                >
                  知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* DRAWER: MULTI-DIMENSIONAL FILTER (多维筛选抽屉)          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showFilterDrawer && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: 360 }}
              animate={{ x: 0 }}
              exit={{ x: 360 }}
              className="w-80 bg-white h-full p-6 flex flex-col justify-between shadow-2xl border-l border-neutral-200"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                    <Filter size={16} className="text-neutral-500" />
                    素材筛选条件
                  </h3>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 text-[12px]">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">图片或视频：</label>
                    <select
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                    >
                      <option>全部</option>
                      <option>图片</option>
                      <option>视频</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">处理状态：</label>
                    <select
                      value={filterProcessStatus}
                      onChange={e => setFilterProcessStatus(e.target.value)}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                    >
                      <option>全部</option>
                      <option>上传中</option>
                      <option>AI分析中</option>
                      <option>待审核</option>
                      <option>可使用</option>
                      <option>有风险</option>
                      <option>处理失败</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">素材来源：</label>
                    <select
                      value={filterSource}
                      onChange={e => setFilterSource(e.target.value)}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                    >
                      <option>全部</option>
                      <option>操盘手上传</option>
                      <option>员工回传</option>
                      <option>KOC回传</option>
                      <option>项目任务</option>
                      <option>内容任务</option>
                      <option>历史迁移</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex gap-2">
                <button
                  onClick={() => {
                    setFilterType("全部");
                    setFilterProcessStatus("全部");
                    setFilterSource("全部");
                    setShowFilterDrawer(false);
                  }}
                  className="flex-1 py-2 border border-neutral-200 text-neutral-600 font-bold text-[12px] rounded-xl"
                >
                  重置
                </button>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="flex-1 py-2 bg-neutral-900 text-white font-bold text-[12px] rounded-xl"
                >
                  应用筛选
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal Fake */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-[15px] font-bold text-neutral-900">上传本地素材至素材中心</h3>
                <button onClick={() => setShowUploadModal(false)}><X size={18} className="text-neutral-400" /></button>
              </div>

              <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center bg-neutral-50 space-y-2 cursor-pointer hover:bg-neutral-100/80 transition-colors">
                <Upload size={32} className="text-primary-600 mx-auto" />
                <p className="text-[13px] font-bold text-neutral-800">拖拽文件到此处，或点击选择文件</p>
                <p className="text-[11px] text-neutral-400">支持 JPG, PNG, MP4 等常见多媒体格式，自动进行 AI 结构化标定</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 border text-neutral-600 rounded-xl text-[12px] font-bold">
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    alert("文件正在上传至私有 OSS... 后台正在依次执行 OCR 提取与 AI 画面事实解析！");
                  }}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold"
                >
                  开始上传
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Add Smart Collection */}
      <AnimatePresence>
        {showAddCollectionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                  <FolderPlus size={18} className="text-primary-600" />
                  新增智能集合 (自动关联分类)
                </h3>
                <button onClick={() => setShowAddCollectionModal(false)}>
                  <X size={18} className="text-neutral-400 hover:text-neutral-700" />
                </button>
              </div>

              <div className="space-y-3 text-[12px]">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">集合名称 / 归类场景：</label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={e => setNewCollectionName(e.target.value)}
                    placeholder="如：实拍细节、成分特写、门店打卡、试用好评..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900"
                    onKeyDown={e => e.key === "Enter" && handleAddCollection()}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  新增后，系统 AI 将自动根据上传素材的画面事实与标签规则把相匹配的图片/视频关联进该集合。
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setShowAddCollectionModal(false)}
                  className="px-4 py-2 border text-neutral-600 rounded-xl text-[12px] font-bold"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCollection}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors"
                >
                  确认新增集合
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Batch Categorize Selected Assets */}
      <AnimatePresence>
        {showBatchCategorizeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                  <Tag size={18} className="text-primary-600" />
                  批量归类素材场景
                </h3>
                <button onClick={() => setShowBatchCategorizeModal(false)}>
                  <X size={18} className="text-neutral-400 hover:text-neutral-700" />
                </button>
              </div>

              <div className="space-y-3 text-[12px]">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-neutral-700">
                  当前已勾选 <strong className="text-neutral-900">{selectedAssetIds.length}</strong> 个素材。
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">选择目标归类场景/智能集合：</label>
                  <select
                    value={targetCategorizeScene}
                    onChange={e => setTargetCategorizeScene(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-[13px]"
                  >
                    {smartCollections.map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setShowBatchCategorizeModal(false)}
                  className="px-4 py-2 border text-neutral-600 rounded-xl text-[12px] font-bold"
                >
                  取消
                </button>
                <button
                  onClick={handleBatchCategorize}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors"
                >
                  确认批量归类
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
