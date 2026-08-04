import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, FileText, FolderOpen, AlertTriangle, AlertCircle, CheckCircle2, Check,
  Search, Upload, Plus, X, ArrowRight, ShieldAlert, Sparkles, Filter, MoreHorizontal,
  RefreshCw, Trash2, Folder, ExternalLink, Link as LinkIcon, Mic, Edit3, ShieldCheck,
  Layers, ChevronRight, HelpCircle, Ban, FileCode, Clock, Eye, EyeOff, Tag, Lock,
  Bookmark, CheckSquare, MessageSquare, Compass, ArrowUpRight, ChevronDown
} from "lucide-react";

interface KnowledgeMemoryProps {
  activeProject?: any;
}

export function KnowledgeMemory({ activeProject }: KnowledgeMemoryProps) {
  // Navigation State
  const [activeSpace, setActiveSpace] = useState<"merchant" | "personal">("merchant");
  const [merchantTab, setMerchantTab] = useState<"overview" | "knowledge" | "source">("overview");

  // Overview Status Toggle (allows testing both Normal & Issue states easily)
  const [overviewStateMode, setOverviewStateMode] = useState<"issue" | "normal">("issue");

  // Filter & Search State for Knowledge Page
  const [knowledgeStatusFilter, setKnowledgeStatusFilter] = useState<"待确认" | "可用" | "全部">("待确认");
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);

  // Experience Filter State
  const [expFilter, setExpFilter] = useState<"全部" | "待验证" | "已验证" | "已应用">("全部");

  // Drawers & Modals
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any | null>(null);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);
  const [workbenchCurrentIndex, setWorkbenchCurrentIndex] = useState(0);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [sourceToDisconnect, setSourceToDisconnect] = useState<any | null>(null);
  const [isApplyExpModalOpen, setIsApplyExpModalOpen] = useState(false);
  const [isCitationDrawerOpen, setIsCitationDrawerOpen] = useState(false);
  const [excludedCitations, setExcludedCitations] = useState<string[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Upload Form State
  const [uploadType, setUploadType] = useState<"file" | "folder" | "text">("file");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadTextInput, setUploadTextInput] = useState("");

  // Personal Quick Note State
  const [quickNoteText, setQuickNoteText] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);

  // ---------------------------------------------------------------------------
  // SAMPLE DATA (Pet Food Merchant & Xiaohongshu Operations Context)
  // ---------------------------------------------------------------------------

  // Blocking / Pending Issues for Overview & Workbench
  const [pendingIssues, setPendingIssues] = useState([
    {
      id: "issue-1",
      title: "缺少产品利润与价格依据",
      description: "缺乏高烘干粮出厂成本、阶梯发货价与最低允许限价。",
      impact: "暂时无法生成预算和 ROI 建议",
      highRisk: true,
      riskType: "价格与利润",
      aiConclusion: "AI推算建议获客成本最高140元/单，但无官方底价确认。",
      quote: "“新线产品发货出厂折扣需按照代理分级计算，最低零售价需锁定。”—— 2026Q3运营草案",
      reason: "影响出价与分佣比例计算，须由操盘手或商家人工确认为唯一价格依据。",
      actionText: "补充资料",
      category: "品牌与产品",
      hasConflict: false
    },
    {
      id: "issue-2",
      title: "发现两份产品包装规范冲突",
      description: "新旧两份文件对‘烘干粮封口形式’描述不一致（拉链袋 vs 密封罐装）。",
      impact: "素材审核无法确定采用哪个版本",
      highRisk: true,
      riskType: "版本冲突",
      aiConclusion: "2026年6月版本写明为拉链袋，但2025年旧文件显示为罐装。",
      quote: "版本A：“采用厚质哑光铝箔拉链袋封口” / 版本B：“采用透明塑料密封罐”",
      reason: "将直接导致KOC拍摄素材视觉校验报错，须确认当前效力的包装规范。",
      actionText: "确认有效版本",
      category: "品牌与产品",
      hasConflict: true,
      conflictA: { source: "2025包装标准.pdf", text: "罐装密封包装，内含脱氧剂" },
      conflictB: { source: "2026Q2包装升级通知.docx", text: "全面升级为哑光密封拉链袋，方便铲屎官多次开封" }
    },
    {
      id: "issue-3",
      title: "KOS 店长号人设与私域承接话术未校验",
      description: "AI自动归纳的‘3年资深宠物营养师’店长号人设包含部分功效表达规则。",
      impact: "影响店长号内容生成与私域答疑规则",
      highRisk: true,
      riskType: "账号人设与合规",
      aiConclusion: "人设定位为‘说话直率专业的宠物营养师’，客服回复需避开‘治愈/治疗’字眼。",
      quote: "“遇到换粮期肠胃敏感问题，可引导使用‘舒缓肠胃适应期’而非‘治疗软便’。”",
      reason: "避免小红书平台违规限流及广告法风险。",
      actionText: "确认规则",
      category: "账号与人设",
      hasConflict: false
    }
  ]);

  // AI Recently Learned (Overview)
  const [recentlyLearned, setRecentlyLearned] = useState([
    {
      id: "k-1",
      summary: "不能承诺治疗软便，只能表达‘帮助肠胃适应’或‘换粮过渡建议’。",
      source: "2026-07-03 客服聊天记录.pdf",
      status: "待确认",
      time: "10分钟前",
      category: "禁区与合规",
      quote: "“客服回复中严禁承诺药品疗效，仅能从膳食营养适应角度提供建议。”",
      impactScenarios: ["内容生成", "内容审核", "私域客服承接"],
      usageCount: "已在 2 个项目、5 次内容生成中参考",
      isHighRisk: true
    },
    {
      id: "k-2",
      summary: "幼犬高烘干粮蛋白质含量为 42%，主打无粮加冻干拆袋即食。",
      source: "2026Q3产品手册.pdf",
      status: "可用",
      time: "2小时前",
      category: "品牌与产品",
      quote: "“选用 85% 肉类原料，粗蛋白质 ≥42%，不添加小麦和大豆等致敏原。”",
      impactScenarios: ["小红书种草文案", "卖点拆解", "素材审核"],
      usageCount: "已在 4 个项目、18 次发文中使用",
      isHighRisk: false
    },
    {
      id: "k-3",
      summary: "KOS店长号人设：3年宠物营养师，家里养了2只金毛，说话直率专业。",
      source: "最新业务会议纪要.docx",
      status: "可用",
      time: "昨天",
      category: "账号与人设",
      quote: "“店长号不走低价噱头，以专业营养学视角解答铲屎官选粮疑难问题。”",
      impactScenarios: ["店长号发文", "评论区互动", "私域承接"],
      usageCount: "已在 1 个项目、8 次脚本中使用",
      isHighRisk: false
    }
  ]);

  // Full Knowledge List
  const [knowledgeList, setKnowledgeList] = useState([
    {
      id: "k-1",
      summary: "严禁承诺治疗软便，只能表达‘帮助肠胃适应’或‘换粮过渡建议’。",
      source: "2026-07-03 客服聊天记录.pdf",
      status: "待确认",
      time: "2026-07-28 10:12",
      category: "禁区与合规",
      quote: "“客服与小红书私信中严禁出现‘根治软便/替代药品’等医疗化词汇。”",
      impactScenarios: ["内容生成", "内容审核", "私域承接"],
      usageCount: "已被 2 个项目、5 次内容生成使用",
      isHighRisk: true
    },
    {
      id: "k-2",
      summary: "幼犬高烘干粮蛋白质含量为 42%，主打无粮加 5% 鸡肉冻干拆袋即食。",
      source: "2026Q3产品手册.pdf",
      status: "可用",
      time: "2026-07-27 16:30",
      category: "品牌与产品",
      quote: "“选用 85% 动物性原料，粗蛋白质含量 ≥42%，专为幼犬肠胃设计。”",
      impactScenarios: ["小红书种草文案", "卖点拆解", "素材审核"],
      usageCount: "已被 4 个项目、18 次内容生成使用",
      isHighRisk: false
    },
    {
      id: "k-3",
      summary: "KOS店长号人设：3年宠物营养师，家里养了2只金毛，说话直率专业。",
      source: "最新业务会议纪要.docx",
      status: "可用",
      time: "2026-07-26 14:00",
      category: "账号与人设",
      quote: "“店长号人设需展现真实养宠背景，避开营销套路，建立信任感。”",
      impactScenarios: ["店长号发文", "评论区互动", "私域承接"],
      usageCount: "已被 1 个项目、8 次内容生成使用",
      isHighRisk: false
    },
    {
      id: "k-4",
      summary: "KOC 共创试吃样品须在视频开头 3 秒内展示拆封与颗粒近摄。",
      source: "KOC合作规范说明.pdf",
      status: "待确认",
      time: "2026-07-25 11:20",
      category: "内容规范",
      quote: "“拆封声音与画面实拍能大幅提升完播率与信任度。”",
      impactScenarios: ["KOC素材判断", "脚本审核"],
      usageCount: "已被 1 个项目使用",
      isHighRisk: false
    },
    {
      id: "k-5",
      summary: "产品封口包装形式：哑光密封拉链袋（有旧版罐装冲突）。",
      source: "2026Q2包装升级通知.docx",
      status: "有冲突",
      time: "2026-07-24 09:15",
      category: "品牌与产品",
      quote: "“新批次烘干粮全面换装哑光密封拉链袋。”",
      impactScenarios: ["素材审核", "图文排版"],
      usageCount: "已被 2 个项目使用",
      isHighRisk: true,
      hasConflict: true,
      conflictText: "旧文件《2025包装标准.pdf》写明为‘透明塑料密封罐’。"
    },
    {
      id: "k-6",
      summary: "618 促促销增品‘买两包送试吃装’已于 6 月 20 日结束。",
      source: "2026大促活动总结.xlsx",
      status: "已失效",
      time: "2026-06-21 00:00",
      category: "运营复盘",
      quote: "“618 专项赠品赠完即止，不延续至日常运营。”",
      impactScenarios: ["优惠展示", "私域承接"],
      usageCount: "历史使用 12 次",
      isHighRisk: false
    }
  ]);

  // Data Sources List
  const [dataSources, setDataSources] = useState([
    {
      id: "src-1",
      name: "商家核心资料库",
      path: "/Volumes/Data/Merchant/MiaoXianRen/Core",
      type: "本地文件夹",
      count: 12,
      lastCheck: "10分钟前",
      status: "正常",
      extractedCount: 18,
      pendingCount: 2,
      conflictCount: 1,
      expiredCount: 0
    },
    {
      id: "src-2",
      name: "2026Q3产品价格与促销方案.xlsx",
      path: "/Volumes/Data/Merchant/MiaoXianRen/2026Q3产品价格与促销方案.xlsx",
      type: "Excel",
      count: 1,
      lastCheck: "2小时前",
      status: "内容有变化",
      extractedCount: 5,
      pendingCount: 1,
      conflictCount: 0,
      expiredCount: 0
    },
    {
      id: "src-3",
      name: "旧版包装规范与产线说明.pdf",
      path: "/Volumes/Data/Merchant/MiaoXianRen/旧版包装规范与产线说明.pdf",
      type: "PDF",
      count: 1,
      lastCheck: "昨天",
      status: "需要处理",
      extractedCount: 3,
      pendingCount: 0,
      conflictCount: 1,
      expiredCount: 1
    },
    {
      id: "src-4",
      name: "损坏的备份文档包.zip",
      path: "/Volumes/Data/Merchant/MiaoXianRen/损坏的备份文档包.zip",
      type: "压缩包",
      count: 0,
      lastCheck: "3天前",
      status: "无法读取",
      extractedCount: 0,
      pendingCount: 0,
      conflictCount: 0,
      expiredCount: 0
    }
  ]);

  // Operator Experience Data
  const [experienceList, setExperienceList] = useState([
    {
      id: "exp-1",
      title: "第一人称拆袋与给猫咪试吃视频，点击率比常规干货提升 24%",
      summary: "在宠物食品小红书种草中，第一人称特写镜头拆封+真实宠物凑近舔食的声音，不仅点击率高，评论区询问购买链接比例明显增加。",
      valStatus: "已验证",
      scope: "宠物食品 / 小红书短视频",
      refStatus: "正在被 2 个商家项目参考",
      type: "观察",
      date: "今天 10:30",
      content: "对比了喵仙人与鲜宠客两个项目的 15 条爆款短视频，凡是开头前 3 秒出现高清拆封与嚼碎声的，平均互动率提高 2.1 倍。",
      merchantApplies: ["喵仙人 (当前商家)"]
    },
    {
      id: "exp-2",
      title: "针对高蛋白烘干粮，文案强调‘不加一粒谷物’比‘42%高蛋白’更吸引初次选粮铲屎官",
      summary: "小白铲屎官对数值敏感度低，但对‘无谷/不加谷物’等负向排除型概念接受度极高。",
      valStatus: "待验证",
      scope: "宠物食品 / 种草文案",
      refStatus: "AI建议依据 (仅作参考)",
      type: "待验证假设",
      date: "昨天 16:20",
      content: "准备在下周喵仙人幼犬粮冷启动测试中，对比‘42%高蛋白’与‘0谷物0肉粉’两组标题的CTR。",
      merchantApplies: []
    },
    {
      id: "exp-3",
      title: "小红书店长号私域引流：用‘营养师一对一避坑配餐’替代‘领优惠券’",
      summary: "领券转化率近期下滑，但‘免费分析猫咪毛发/软便体质’的卡片私信转化率保持在 18% 以上。",
      valStatus: "已应用",
      scope: "KOS店长号 / 私域承接",
      refStatus: "正在被 1 个商家项目参考",
      type: "已验证经验",
      date: "3天前",
      content: "私域承接话术切忌直奔卖货，必须先做体质问卷，再顺势推荐适合的烘干粮小试吃装。",
      merchantApplies: ["喵仙人 (当前商家)"]
    }
  ]);

  // AI Citation Preview Data (For "本次参考依据" drawer)
  const citationItems = [
    {
      id: "c-1",
      type: "商家事实",
      title: "幼犬高烘干粮粗蛋白质含量 ≥42%",
      source: "2026Q3产品手册.pdf",
      quote: "“粗蛋白质含量 ≥42%，选用 85% 动物性原料。”"
    },
    {
      id: "c-2",
      type: "商家禁区",
      title: "禁止在文案和客服回复中承诺医疗功效或治愈软便",
      source: "2026-07-03 客服聊天记录.pdf",
      quote: "“严禁承诺治愈软便，只能使用‘舒缓肠胃适应’。”"
    },
    {
      id: "c-3",
      type: "操盘手经验",
      title: "第一人称拆袋与给猫咪试吃声音可提升前 3 秒留存",
      source: "操盘手个人经验库",
      quote: "“第一人称拆封特写镜头能显著增加信任感与点击率。”"
    }
  ];

  // Categories list for Knowledge Filtering
  const allCategories = [
    "品牌与产品",
    "账号与人设",
    "客户与痛点",
    "内容规范",
    "禁区与合规",
    "话术与承接",
    "运营复盘"
  ];

  // Helper for status styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "可用":
      case "已验证":
      case "已完成":
      case "正常":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12}/> 可用</span>;
      case "待确认":
      case "待验证":
      case "内容有变化":
      case "需要处理":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12}/> 待确认</span>;
      case "有冲突":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-red-50 text-red-700 border border-red-200"><AlertTriangle size={12}/> 有冲突</span>;
      case "已失效":
      case "已归档":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200"><Ban size={12}/> 已失效</span>;
      case "已应用":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-200"><CheckSquare size={12}/> 已应用</span>;
      case "无法读取":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-red-50 text-red-700 border border-red-200"><X size={12}/> 无法读取</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-neutral-100 text-neutral-600">{status}</span>;
    }
  };

  // Action Handlers
  const handleConfirmKnowledge = (item: any) => {
    // Confirm single item
    setKnowledgeList(prev => prev.map(k => k.id === item.id ? { ...k, status: "可用" } : k));
    setPendingIssues(prev => prev.filter(i => i.id !== item.id));

    // Find next pending knowledge item
    const remainingPending = knowledgeList.filter(k => k.status === "待确认" && k.id !== item.id);
    if (remainingPending.length > 0) {
      setSelectedKnowledge(remainingPending[0]);
      showToast(`已确认采用！还剩 ${remainingPending.length} 项待确认。`);
    } else {
      setSelectedKnowledge(null);
      showToast("所有待确认知识均已处理完毕！");
    }
  };

  const handleConfirmWorkbenchCurrent = () => {
    const current = pendingIssues[workbenchCurrentIndex];
    if (!current) return;

    setKnowledgeList(prev => prev.map(k => k.summary.includes(current.title) || k.id === current.id ? { ...k, status: "可用" } : k));
    const updatedIssues = pendingIssues.filter((_, idx) => idx !== workbenchCurrentIndex);
    setPendingIssues(updatedIssues);

    if (updatedIssues.length > 0) {
      const nextIndex = Math.min(workbenchCurrentIndex, updatedIssues.length - 1);
      setWorkbenchCurrentIndex(nextIndex);
      showToast(`已确认！还剩 ${updatedIssues.length} 项待处理。`);
    } else {
      setIsWorkbenchOpen(false);
      showToast("待确认事项已全部处理完毕！");
    }
  };

  const handleBatchConfirmWorkbench = () => {
    // Guardrail check: highRisk items cannot be batch confirmed!
    const lowRiskIssues = pendingIssues.filter(i => !i.highRisk);
    const highRiskIssues = pendingIssues.filter(i => i.highRisk);

    if (highRiskIssues.length > 0) {
      showToast(`提示：包含 ${highRiskIssues.length} 项高风险规则（价格/合规/冲突），必须逐条确认。已为您准备单条决策。`);
    } else if (lowRiskIssues.length > 0) {
      setPendingIssues([]);
      setIsWorkbenchOpen(false);
      showToast(`已批量确认 ${lowRiskIssues.length} 项低风险规则！`);
    }
  };

  const handleUploadSubmit = () => {
    setIsUploadDrawerOpen(false);
    showToast("资料已添加，AI正在后台整理，你可以继续其他工作。");

    // Add dummy source entry to sources
    const newSrc = {
      id: `src-${Date.now()}`,
      name: uploadNotes || (uploadType === "file" ? "新上传业务文件.pdf" : uploadType === "folder" ? "新增本地资料夹" : "粘贴的文本与链接"),
      path: "/Volumes/Data/Merchant/MiaoXianRen/Uploads",
      type: uploadType === "file" ? "PDF" : uploadType === "folder" ? "本地文件夹" : "文本/链接",
      count: 1,
      lastCheck: "刚刚",
      status: "正在整理",
      extractedCount: 0,
      pendingCount: 0,
      conflictCount: 0,
      expiredCount: 0
    };
    setDataSources(prev => [newSrc, ...prev]);
    setUploadNotes("");
    setUploadTextInput("");
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) return;

    const newExp = {
      id: `exp-${Date.now()}`,
      title: quickNoteText.slice(0, 40) + (quickNoteText.length > 40 ? "..." : ""),
      summary: quickNoteText,
      valStatus: "待验证",
      scope: "小红书 / 操盘笔记",
      refStatus: "AI建议依据 (仅作参考)",
      type: "待验证假设",
      date: "刚刚",
      content: quickNoteText,
      merchantApplies: []
    };

    setExperienceList(prev => [newExp, ...prev]);
    setQuickNoteText("");
    showToast("已保存至【我的经验】，AI将自动判断类型并作为建议参考。");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fafafa] relative overflow-hidden font-sans text-neutral-900">
      
      {/* Toast Floating Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-[14px] font-medium border border-neutral-800"
          >
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-neutral-400 hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar - One-Level Space Selector (商家知识 vs 我的经验) */}
      <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-8 bg-white shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveSpace("merchant")}
            className={`text-[15px] font-bold py-4 relative transition-colors ${
              activeSpace === "merchant" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            商家知识
            {activeSpace === "merchant" && (
              <motion.div layoutId="spaceTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
            )}
          </button>
          <button
            onClick={() => setActiveSpace("personal")}
            className={`text-[15px] font-bold py-4 relative transition-colors ${
              activeSpace === "personal" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            我的经验
            {activeSpace === "personal" && (
              <motion.div layoutId="spaceTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
            )}
          </button>
        </div>

        {/* Priority Rule Indicator & AI Reference Citation Drawer Trigger */}
        <div className="flex items-center gap-4 text-[12px] text-neutral-500">
          <div className="hidden lg:flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200/80">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="font-medium text-neutral-600">调用优先级：</span>
            <span className="text-neutral-800 font-semibold">商家已确认事实 ＞ 规则与禁区 ＞ 项目要求 ＞ 个人经验</span>
          </div>

          <button
            onClick={() => setIsCitationDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[12px] font-medium transition-colors"
            title="查看当前AI任务调用的知识引用"
          >
            <Brain size={14} className="text-neutral-800" />
            <span>AI调用预览</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1280px] mx-auto p-8 space-y-6">

          {/* ========================================================================= */}
          {/* MERCHANT KNOWLEDGE SPACE (商家知识) */}
          {/* ========================================================================= */}
          {activeSpace === "merchant" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Secondary Tabs (总览 | 知识 | 资料来源) */}
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                <div className="flex gap-2">
                  {[
                    { id: "overview", label: "总览" },
                    { id: "knowledge", label: "知识" },
                    { id: "source", label: "资料来源" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMerchantTab(tab.id as any)}
                      className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                        merchantTab === tab.id
                          ? "bg-white text-neutral-900 border border-neutral-200 shadow-xs"
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Switch to test Normal vs Issue state on Overview */}
                {merchantTab === "overview" && (
                  <div className="flex items-center gap-2 text-[12px] text-neutral-400">
                    <span>总览状态预览:</span>
                    <button
                      onClick={() => setOverviewStateMode("issue")}
                      className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors ${
                        overviewStateMode === "issue" ? "bg-amber-100 text-amber-800 font-bold" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      有 3 项需要处理
                    </button>
                    <button
                      onClick={() => setOverviewStateMode("normal")}
                      className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors ${
                        overviewStateMode === "normal" ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      可正常使用 (正常)
                    </button>
                  </div>
                )}
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* 2.1 OVERVIEW TAB (总览页) */}
              {/* --------------------------------------------------------------------- */}
              {merchantTab === "overview" && (
                <div className="space-y-6">
                  
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-[20px] font-bold text-neutral-900">当前商家知识</h1>
                        <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg">
                          喵仙人 (宠物食品)
                        </span>
                      </div>
                      <p className="text-[13px] text-neutral-500 mt-1">
                        沉淀商家事实、规则与约束，将在相关小红书运营、素材判断和客服承接任务中自动调用。
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Secondary Button: 待我确认 N 项 (Only if pending issues > 0) */}
                      {pendingIssues.length > 0 && (
                        <button
                          onClick={() => {
                            setWorkbenchCurrentIndex(0);
                            setIsWorkbenchOpen(true);
                          }}
                          className="px-4 py-2.5 bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 rounded-xl text-[14px] font-bold transition-colors flex items-center gap-2 shadow-xs"
                        >
                          <Clock size={16} className="text-amber-600" />
                          <span>待我确认 {pendingIssues.length} 项</span>
                        </button>
                      )}

                      {/* Primary Button: 上传资料 */}
                      <button
                        onClick={() => setIsUploadDrawerOpen(true)}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center gap-2"
                      >
                        <Plus size={16} />
                        <span>上传资料</span>
                      </button>
                    </div>
                  </div>

                  {/* 第一块：当前状态 (Single main status card) */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div className="flex items-center gap-3">
                        {overviewStateMode === "normal" ? (
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <AlertTriangle size={22} />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-[16px] font-bold text-neutral-900">
                              {overviewStateMode === "normal"
                                ? "商家知识运行状态：可正常使用"
                                : "存在需处理事项"}
                            </h2>
                            {overviewStateMode === "normal" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                可正常使用
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                有 {pendingIssues.length} 项需处理
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-neutral-600 mt-1">
                            {overviewStateMode === "normal"
                              ? "当前资料已可支持内容生成、内容审核、素材判断和客服承接。AI会在相关任务中自动调用。"
                              : `有 ${pendingIssues.length} 项资料需要处理，其中 1 项会阻断项目执行。`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* If issue state, show up to 3 top blocking items */}
                    {overviewStateMode === "issue" && pendingIssues.length > 0 && (
                      <div className="space-y-3 pt-2">
                        {pendingIssues.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                              item.hasConflict
                                ? "bg-red-50/60 border-red-200"
                                : "bg-amber-50/40 border-amber-200/80"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                {item.hasConflict ? (
                                  <ShieldAlert size={18} className="text-red-600 shrink-0" />
                                ) : (
                                  <AlertCircle size={18} className="text-amber-600 shrink-0" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-[14px] font-bold text-neutral-900">{item.title}</h3>
                                  <span className="text-[11px] font-semibold text-neutral-500 bg-white/80 border border-neutral-200 px-2 py-0.5 rounded">
                                    {item.category}
                                  </span>
                                </div>
                                <p className="text-[13px] text-neutral-700 mb-1">{item.description}</p>
                                <p className="text-[12px] text-neutral-500 font-medium">
                                  <span className="text-neutral-700 font-semibold">影响：</span>
                                  {item.impact}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                const idx = pendingIssues.findIndex(i => i.id === item.id);
                                setWorkbenchCurrentIndex(idx >= 0 ? idx : 0);
                                setIsWorkbenchOpen(true);
                              }}
                              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all shrink-0 shadow-xs ${
                                item.hasConflict
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
                              }`}
                            >
                              {item.actionText}
                            </button>
                          </div>
                        ))}

                        {pendingIssues.length > 3 && (
                          <div className="pt-2 text-center">
                            <button
                              onClick={() => {
                                setWorkbenchCurrentIndex(0);
                                setIsWorkbenchOpen(true);
                              }}
                              className="text-[13px] font-bold text-neutral-700 hover:text-neutral-900 hover:underline"
                            >
                              查看全部待办 ({pendingIssues.length} 项) →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 第二块：AI最近学到 (Compact list, 3 items) */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500" />
                        <h2 className="text-[16px] font-bold text-neutral-900">AI 最近学到</h2>
                      </div>
                      <button
                        onClick={() => setMerchantTab("knowledge")}
                        className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                      >
                        <span>查看全部知识</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {recentlyLearned.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedKnowledge(item)}
                          className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-neutral-50 px-2 rounded-lg cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden mr-4">
                            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                            <span className="text-[14px] font-medium text-neutral-900 truncate group-hover:text-neutral-900">
                              {item.summary}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 shrink-0">
                            <span className="text-[12px] text-neutral-400 truncate max-w-[160px]" title={item.source}>
                              {item.source}
                            </span>
                            {getStatusBadge(item.status)}
                            <span className="text-[12px] text-neutral-400 w-16 text-right">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 第三块：最近资料 (Folded/compact list, 3 sources) */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={18} className="text-neutral-700" />
                        <h2 className="text-[16px] font-bold text-neutral-900">最近资料</h2>
                      </div>
                      <button
                        onClick={() => setMerchantTab("source")}
                        className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                      >
                        <span>管理资料来源</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {dataSources.slice(0, 3).map((src) => (
                        <div
                          key={src.id}
                          onClick={() => setSelectedSource(src)}
                          className="p-3 border border-neutral-200/80 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {src.type === "本地文件夹" ? (
                              <Folder className="text-blue-500 shrink-0" size={18} />
                            ) : (
                              <FileText className="text-neutral-400 shrink-0" size={18} />
                            )}
                            <div>
                              <div className="text-[13px] font-bold text-neutral-900 truncate">{src.name}</div>
                              <div className="text-[11px] text-neutral-400 font-mono truncate">{src.path}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[12px] text-neutral-400">{src.lastCheck}</span>
                            {getStatusBadge(src.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* 2.2 KNOWLEDGE PAGE (知识页面) */}
              {/* --------------------------------------------------------------------- */}
              {merchantTab === "knowledge" && (
                <div className="space-y-4">
                  
                  {/* Top Bar: Status switch, Search, Filter Icon Button */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    
                    {/* Status switcher: 待确认 | 可用 | 全部 */}
                    <div className="flex bg-neutral-100 p-1 rounded-xl">
                      {(["待确认", "可用", "全部"] as const).map((status) => {
                        const count = knowledgeList.filter(k => status === "全部" || k.status === status).length;
                        return (
                          <button
                            key={status}
                            onClick={() => setKnowledgeStatusFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                              knowledgeStatusFilter === status
                                ? "bg-white text-neutral-900 shadow-xs"
                                : "text-neutral-500 hover:text-neutral-800"
                            }`}
                          >
                            {status} ({count})
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
                      {/* Search Box */}
                      <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={knowledgeSearchQuery}
                          onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                          placeholder="搜索知识或来源..."
                          className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-neutral-800 transition-colors"
                        />
                      </div>

                      {/* Filter Icon Button */}
                      <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className={`p-2 rounded-xl border text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                          selectedCategoryFilters.length > 0
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        }`}
                        title="按业务主题筛选"
                      >
                        <Filter size={16} />
                        <span className="hidden sm:inline">筛选</span>
                        {selectedCategoryFilters.length > 0 && (
                          <span className="w-5 h-5 bg-amber-400 text-neutral-900 font-bold text-[11px] rounded-full flex items-center justify-center ml-1">
                            {selectedCategoryFilters.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Active Category Filter Badges */}
                  {selectedCategoryFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      <span className="text-[12px] text-neutral-400">过滤分类:</span>
                      {selectedCategoryFilters.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg text-[12px] font-medium"
                        >
                          {cat}
                          <button
                            onClick={() => setSelectedCategoryFilters(prev => prev.filter(c => c !== cat))}
                            className="hover:text-red-600 ml-1"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => setSelectedCategoryFilters([])}
                        className="text-[12px] text-neutral-500 hover:text-neutral-900 underline ml-2"
                      >
                        清空筛选
                      </button>
                    </div>
                  )}

                  {/* Knowledge Table (4 columns: 知识摘要, 来源, 更新时间, 状态) */}
                  <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200/80">
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500">知识摘要</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-48">来源</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-36">更新时间</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-28 text-right">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-[13px]">
                        {knowledgeList
                          .filter(k => knowledgeStatusFilter === "全部" || k.status === knowledgeStatusFilter)
                          .filter(k => !knowledgeSearchQuery || k.summary.includes(knowledgeSearchQuery) || k.source.includes(knowledgeSearchQuery))
                          .filter(k => selectedCategoryFilters.length === 0 || selectedCategoryFilters.includes(k.category))
                          .map((item) => (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedKnowledge(item)}
                              className="hover:bg-neutral-50/80 cursor-pointer transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="font-semibold text-neutral-900 truncate max-w-[500px]">
                                  {item.summary}
                                </div>
                                <div className="text-[11px] text-neutral-400 mt-0.5">{item.category}</div>
                              </td>
                              <td className="px-6 py-4 text-neutral-500 truncate max-w-[180px]" title={item.source}>
                                {item.source}
                              </td>
                              <td className="px-6 py-4 text-neutral-400">{item.time}</td>
                              <td className="px-6 py-4 text-right">
                                {getStatusBadge(item.status)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {knowledgeList.filter(k => knowledgeStatusFilter === "全部" || k.status === knowledgeStatusFilter).length === 0 && (
                      <div className="p-12 text-center text-neutral-400 space-y-2">
                        <HelpCircle size={28} className="mx-auto text-neutral-300" />
                        <p className="text-[14px]">暂无对应状态的知识数据</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* 2.3 DATA SOURCES PAGE (资料来源页面) */}
              {/* --------------------------------------------------------------------- */}
              {merchantTab === "source" && (
                <div className="space-y-4">
                  
                  {/* Top Bar: Connecting folder vs Adding file */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[16px] font-bold text-neutral-900">资料来源管理</h2>
                      <p className="text-[12px] text-neutral-500">查看 AI 从哪里学习知识，可对连接的目录或文件进行检查同步。</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setUploadType("folder");
                          setIsUploadDrawerOpen(true);
                        }}
                        className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-[13px] font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                      >
                        <FolderOpen size={16} className="text-blue-500" />
                        <span>连接本地文件夹</span>
                      </button>

                      <button
                        onClick={() => {
                          setUploadType("file");
                          setIsUploadDrawerOpen(true);
                        }}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        <span>添加文件</span>
                      </button>
                    </div>
                  </div>

                  {/* Sources Table (名称与路径, 类型, 包含文件数, 最近检查, 状态) */}
                  <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200/80">
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500">名称与路径</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-28">类型</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-28">包含文件数</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-32">最近检查</th>
                          <th className="px-6 py-3.5 text-[12px] font-bold text-neutral-500 w-28 text-right">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-[13px]">
                        {dataSources.map((src) => (
                          <tr
                            key={src.id}
                            onClick={() => setSelectedSource(src)}
                            className="hover:bg-neutral-50/80 cursor-pointer transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {src.type === "本地文件夹" ? (
                                  <Folder size={18} className="text-blue-500 shrink-0" />
                                ) : (
                                  <FileText size={18} className="text-neutral-400 shrink-0" />
                                )}
                                <div className="overflow-hidden">
                                  <div className="font-bold text-neutral-900 truncate">{src.name}</div>
                                  <div className="text-[11px] text-neutral-400 font-mono truncate max-w-[360px]">
                                    {src.path}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-neutral-600 font-medium">{src.type}</td>
                            <td className="px-6 py-4 text-neutral-600">{src.count} 个</td>
                            <td className="px-6 py-4 text-neutral-400">{src.lastCheck}</td>
                            <td className="px-6 py-4 text-right">
                              {getStatusBadge(src.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* MY EXPERIENCE SPACE (我的经验 - 操盘手个人资产) */}
          {/* ========================================================================= */}
          {activeSpace === "personal" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Top Banner explaining My Experience */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h1 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
                    <Compass size={20} className="text-neutral-800" />
                    <span>操盘手经验库</span>
                  </h1>
                  <p className="text-[13px] text-neutral-500 mt-1">
                    个人积累的选题想法、沟通套路、素材观察和爆款方法。默认作为 AI 建议参考，不自动覆盖商家的价格和合规规范。
                  </p>
                </div>

                {/* 顶部：随手记 (Quick Note) */}
                <div className="bg-neutral-50/80 border border-neutral-200 rounded-xl p-4 space-y-3">
                  <div className="text-[13px] font-bold text-neutral-800">随手记一条：</div>
                  
                  <textarea
                    value={quickNoteText}
                    onChange={(e) => setQuickNoteText(e.target.value)}
                    placeholder="记录选题想法、客户原话、素材判断、竞品观察或待验证假设……"
                    className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 text-[13px] focus:outline-none focus:border-neutral-800 resize-none min-h-[90px] transition-colors"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4 text-[12px] text-neutral-500">
                      <button
                        onClick={() => showToast("已模拟解析粘贴链接内容。")}
                        className="hover:text-neutral-900 flex items-center gap-1 font-medium"
                      >
                        <LinkIcon size={14} />
                        <span>粘贴链接</span>
                      </button>

                      <button
                        onClick={() => showToast("已模拟添加本地随手记文件。")}
                        className="hover:text-neutral-900 flex items-center gap-1 font-medium"
                      >
                        <FileText size={14} />
                        <span>添加本地文件</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMicActive(!isMicActive);
                          if (!isMicActive) showToast("已开启语音转文字输入……");
                        }}
                        className={`hover:text-neutral-900 flex items-center gap-1 font-medium ${
                          isMicActive ? "text-red-600 font-bold animate-pulse" : ""
                        }`}
                      >
                        <Mic size={14} />
                        <span>{isMicActive ? "正在录音..." : "语音输入"}</span>
                      </button>
                    </div>

                    <button
                      onClick={handleSaveQuickNote}
                      disabled={!quickNoteText.trim()}
                      className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-[13px] font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      <span>保存并由 AI 整理</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 下方：经验列表 (Filters & List) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Filters: 全部 | 待验证 | 已验证 | 已应用 */}
                  <div className="flex bg-neutral-100 p-1 rounded-xl">
                    {(["全部", "待验证", "已验证", "已应用"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setExpFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                          expFilter === f
                            ? "bg-white text-neutral-900 shadow-xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <span className="text-[12px] text-neutral-400">
                    共 {experienceList.filter(e => expFilter === "全部" || e.valStatus === expFilter).length} 条经验
                  </span>
                </div>

                {/* Experience Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experienceList
                    .filter(e => expFilter === "全部" || e.valStatus === expFilter)
                    .map((exp) => (
                      <div
                        key={exp.id}
                        onClick={() => setSelectedExperience(exp)}
                        className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-neutral-400 cursor-pointer transition-all space-y-3 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                              {exp.type}
                            </span>
                            {getStatusBadge(exp.valStatus)}
                          </div>

                          <h3 className="text-[14px] font-bold text-neutral-900 leading-snug group-hover:text-neutral-900">
                            {exp.title}
                          </h3>

                          <p className="text-[13px] text-neutral-600 line-clamp-2 mt-2">
                            {exp.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                          <span>{exp.scope}</span>
                          <span className="text-neutral-600 font-medium">{exp.refStatus}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DRAWERS & MODALS */}
      {/* ========================================================================= */}

      {/* 1. UPLOAD MATERIAL DRAWER (上传资料抽屉 - ~480px width) */}
      <AnimatePresence>
        {isUploadDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadDrawerOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            {/* Slide-over Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900">上传资料</h2>
                  <p className="text-[12px] text-neutral-500">AI 将在后台自动提取事实与规范，无需手动分类。</p>
                </div>
                <button
                  onClick={() => setIsUploadDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-[13px]">
                {/* 3 Upload Methods */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-2">选择添加方式：</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "file", label: "添加文件", icon: FileText },
                      { id: "folder", label: "连接文件夹", icon: FolderOpen },
                      { id: "text", label: "粘贴文本/链接", icon: LinkIcon }
                    ].map(m => {
                      const IconComp = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setUploadType(m.id as any)}
                          className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all ${
                            uploadType === m.id
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          <IconComp size={18} />
                          <span className="text-[12px]">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Upload Input Box */}
                {uploadType === "file" && (
                  <div className="border-2 border-dashed border-neutral-300 hover:border-neutral-800 rounded-2xl p-8 text-center bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer transition-colors space-y-2">
                    <Upload size={28} className="mx-auto text-neutral-400" />
                    <div className="font-bold text-neutral-800">拖拽文件到此处，或点击选择文件</div>
                    <div className="text-[11px] text-neutral-400">支持 PDF、Word、Excel、TXT、Markdown（最大 100MB）</div>
                  </div>
                )}

                {uploadType === "folder" && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-neutral-700">本地文件夹路径：</label>
                    <input
                      type="text"
                      defaultValue="/Volumes/Data/Merchant/MiaoXianRen/ProductDoc"
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-mono focus:outline-none focus:border-neutral-800"
                    />
                    <p className="text-[11px] text-neutral-400">连接后，AI 将自动监控并更新文件夹内的文件变化。</p>
                  </div>
                )}

                {uploadType === "text" && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-neutral-700">粘贴内容或网址：</label>
                    <textarea
                      value={uploadTextInput}
                      onChange={(e) => setUploadTextInput(e.target.value)}
                      placeholder="粘贴商品详情文本、宣发禁忌或小红书链接..."
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-neutral-800 min-h-[120px] resize-none"
                    />
                  </div>
                )}

                {/* Optional Note Input */}
                <div className="space-y-2">
                  <label className="block font-semibold text-neutral-700">
                    这批资料主要是什么？<span className="text-neutral-400 font-normal">（可不填写）</span>
                  </label>
                  <input
                    type="text"
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    placeholder="例如：2026新品高烘干粮FAQ、KOS发文禁忌规范..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-neutral-800"
                  />
                </div>

                {/* AI Automatic Process Info Note */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5 text-[12px] text-neutral-500">
                  <div className="font-bold text-neutral-700 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>AI 后台处理规则</span>
                  </div>
                  <p>添加后系统自动抽取事实、识别风险与冲突。明确规则自动上线，高风险规则（如价格、合规）进入“待确认”。</p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-neutral-200 bg-white flex justify-end">
                <button
                  onClick={handleUploadSubmit}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[14px] rounded-xl shadow-xs transition-all"
                >
                  开始整理
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. KNOWLEDGE DETAILS DRAWER (知识详情抽屉) */}
      <AnimatePresence>
        {selectedKnowledge && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedKnowledge(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className={`relative bg-white h-full shadow-2xl flex flex-col z-10 ${
                selectedKnowledge.hasConflict ? "w-full max-w-[640px]" : "w-full max-w-[480px]"
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-neutral-900">知识详情</h2>
                  {getStatusBadge(selectedKnowledge.status)}
                </div>
                <button
                  onClick={() => setSelectedKnowledge(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-[13px]">
                
                {/* 1. 知识摘要 */}
                <div>
                  <label className="block text-[12px] font-bold text-neutral-400 mb-1.5">知识摘要</label>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-[14px] font-bold text-neutral-900 leading-snug">
                    {selectedKnowledge.summary}
                  </div>
                </div>

                {/* Conflict Version Comparison View if Has Conflict */}
                {selectedKnowledge.hasConflict && (
                  <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl space-y-3">
                    <div className="font-bold text-red-800 flex items-center gap-2 text-[14px]">
                      <AlertTriangle size={16} />
                      <span>版本冲突指示</span>
                    </div>
                    <p className="text-[12px] text-red-700">{selectedKnowledge.conflictText}</p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                        <div className="text-[11px] font-bold text-neutral-400 mb-1">版本 A (历史版本)</div>
                        <div className="text-[12px] font-medium text-neutral-800">透明塑料密封罐装</div>
                      </div>
                      <div className="p-3 bg-white border border-red-200 rounded-lg">
                        <div className="text-[11px] font-bold text-red-500 mb-1">版本 B (新提取草案)</div>
                        <div className="text-[12px] font-bold text-neutral-900">哑光密封拉链袋装</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 原文依据 */}
                <div>
                  <label className="block text-[12px] font-bold text-neutral-400 mb-1.5">原文依据</label>
                  <div className="p-3.5 bg-neutral-100/80 border border-neutral-200 rounded-xl text-[13px] text-neutral-800 font-mono leading-relaxed italic">
                    {selectedKnowledge.quote || "“原文对应段落：……”"}
                  </div>
                </div>

                {/* 3. 来源文件 & 适用范围 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-400 mb-1">来源文件</label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] font-medium text-neutral-800 flex items-center justify-between">
                      <span className="truncate mr-2">{selectedKnowledge.source}</span>
                      <ExternalLink size={14} className="text-neutral-400 shrink-0 hover:text-neutral-900 cursor-pointer" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-neutral-400 mb-1">所属分类</label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] font-medium text-neutral-800">
                      {selectedKnowledge.category}
                    </div>
                  </div>
                </div>

                {/* 4. 最近调用与适用场景 */}
                <div>
                  <label className="block text-[12px] font-bold text-neutral-400 mb-1.5">最近调用记录</label>
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                    <div className="text-[13px] font-bold text-neutral-800">{selectedKnowledge.usageCount || "暂无调用记录"}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedKnowledge.impactScenarios || ["小红书发文", "素材校验"]).map((sc: string) => (
                        <span key={sc} className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[11px] font-medium text-neutral-600">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. 更新时间与有效期 */}
                <div className="text-[12px] text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span>更新时间：{selectedKnowledge.time}</span>
                  <span>有效期：长期有效</span>
                </div>

              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-6 border-t border-neutral-200 bg-white flex items-center justify-between gap-3">
                
                {/* For 待确认 Knowledge: Single Primary Button + "更多" dropdown */}
                {selectedKnowledge.status === "待确认" ? (
                  <>
                    <button
                      onClick={() => handleConfirmKnowledge(selectedKnowledge)}
                      className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[14px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check size={16} />
                      <span>确认采用</span>
                    </button>

                    {/* More Menu Actions */}
                    <button
                      onClick={() => {
                        showToast("已将该知识标记为忽略。");
                        setSelectedKnowledge(null);
                      }}
                      className="px-4 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-[13px] rounded-xl transition-colors"
                    >
                      忽略
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        showToast("功能：修改知识提炼摘要");
                      }}
                      className="flex-1 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-[14px] rounded-xl shadow-xs transition-all"
                    >
                      修改知识
                    </button>

                    <button
                      onClick={() => {
                        setKnowledgeList(prev => prev.map(k => k.id === selectedKnowledge.id ? { ...k, status: "已失效" } : k));
                        setSelectedKnowledge(null);
                        showToast("已将该知识标记为失效。");
                      }}
                      className="px-4 py-3 bg-white border border-neutral-200 hover:bg-red-50 text-red-600 font-bold text-[13px] rounded-xl transition-colors"
                    >
                      标记失效
                    </button>
                  </>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PENDING CONFIRMATION WORKBENCH (待确认工作台) */}
      <AnimatePresence>
        {isWorkbenchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWorkbenchOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-[1020px] h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-neutral-200"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[14px]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-neutral-900">待确认工作台</h2>
                    <p className="text-[12px] text-neutral-500">人工校验高风险和冲突规则，一次集中精力完成一个决策。</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Batch confirm button with guardrails */}
                  <button
                    onClick={handleBatchConfirmWorkbench}
                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[12px] font-bold rounded-lg transition-colors border border-neutral-200"
                  >
                    低风险批量确认
                  </button>

                  <button
                    onClick={() => setIsWorkbenchOpen(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body Layout: Left list (1/3), Right Detail (2/3) */}
              <div className="flex-1 flex min-h-0 divide-x divide-neutral-200">
                
                {/* Left Compact List */}
                <div className="w-80 bg-neutral-50/50 p-4 overflow-y-auto space-y-2 shrink-0">
                  <div className="text-[12px] font-bold text-neutral-400 px-1 mb-2">
                    待处理列表 ({pendingIssues.length})
                  </div>

                  {pendingIssues.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setWorkbenchCurrentIndex(idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                        workbenchCurrentIndex === idx
                          ? "bg-white border-neutral-900 shadow-sm"
                          : "bg-white/60 border-neutral-200/80 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        {item.hasConflict && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            冲突
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] font-bold text-neutral-900 leading-snug line-clamp-2">
                        {item.title}
                      </div>
                    </div>
                  ))}

                  {pendingIssues.length === 0 && (
                    <div className="p-8 text-center text-neutral-400 text-[13px]">
                      所有事项已处理完毕！
                    </div>
                  )}
                </div>

                {/* Right Current Decision Area */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-white">
                  {pendingIssues[workbenchCurrentIndex] ? (
                    (() => {
                      const cur = pendingIssues[workbenchCurrentIndex];
                      return (
                        <div className="space-y-6">
                          
                          {/* 标题与重要性 */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[12px] font-bold rounded-md">
                                需要人工确认
                              </span>
                              <span className="text-[12px] text-neutral-400 font-mono">ID: {cur.id}</span>
                            </div>
                            <h2 className="text-[20px] font-bold text-neutral-900">{cur.title}</h2>
                          </div>

                          {/* AI 提取出的结论 */}
                          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
                            <div className="text-[12px] font-bold text-neutral-500">AI 提取出的结论：</div>
                            <div className="text-[14px] font-bold text-neutral-900">{cur.aiConclusion}</div>
                          </div>

                          {/* 对应原文 */}
                          <div className="space-y-1.5">
                            <div className="text-[12px] font-bold text-neutral-400">对应原文依据：</div>
                            <div className="p-3.5 bg-neutral-100/80 border border-neutral-200 rounded-xl text-[13px] font-mono text-neutral-800 italic">
                              {cur.quote}
                            </div>
                          </div>

                          {/* 为什么需要人工确认 & 影响 */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-1">
                              <div className="text-[12px] font-bold text-amber-800">为什么需要确认：</div>
                              <p className="text-[13px] text-neutral-700">{cur.reason}</p>
                            </div>

                            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                              <div className="text-[12px] font-bold text-neutral-700">采用后影响：</div>
                              <p className="text-[13px] text-neutral-600">{cur.impact}</p>
                            </div>
                          </div>

                          {/* 存在旧知识或冲突版本 */}
                          {cur.hasConflict && cur.conflictA && (
                            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-3">
                              <div className="text-[13px] font-bold text-red-800 flex items-center gap-1.5">
                                <AlertTriangle size={16} />
                                <span>存在冲突的版本规则：</span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-[12px]">
                                <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                                  <div className="font-bold text-neutral-500 mb-1">旧版本（{cur.conflictA.source}）</div>
                                  <div className="text-neutral-800 font-medium">{cur.conflictA.text}</div>
                                </div>

                                <div className="p-3 bg-white border border-red-200 rounded-lg">
                                  <div className="font-bold text-red-600 mb-1">提取出的新版本（{cur.conflictB.source}）</div>
                                  <div className="text-neutral-900 font-bold">{cur.conflictB.text}</div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400">
                      无选中的待确认事项
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Decision Bar: Primary 确认采用 + 次要 更多 */}
              <div className="px-8 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="text-[12px] text-neutral-400">
                  当前为第 {workbenchCurrentIndex + 1} / {pendingIssues.length} 项
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      showToast("已跳过当前事项。");
                      if (workbenchCurrentIndex < pendingIssues.length - 1) {
                        setWorkbenchCurrentIndex(prev => prev + 1);
                      }
                    }}
                    className="px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-bold text-[13px] rounded-xl transition-colors"
                  >
                    暂不处理
                  </button>

                  <button
                    onClick={handleConfirmWorkbenchCurrent}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[14px] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>确认采用</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SOURCE DETAILS DRAWER (资料来源详情抽屉) */}
      <AnimatePresence>
        {selectedSource && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSource(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-neutral-700" />
                  <h2 className="text-[16px] font-bold text-neutral-900">资料来源详情</h2>
                </div>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-[13px]">
                <div>
                  <h3 className="text-[16px] font-bold text-neutral-900 mb-1">{selectedSource.name}</h3>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[12px] text-neutral-600 break-all">
                    {selectedSource.path}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-neutral-400">最近同步时间</div>
                    <div className="text-[13px] font-bold text-neutral-800">{selectedSource.lastCheck}</div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-neutral-400">类型与格式</div>
                    <div className="text-[13px] font-bold text-neutral-800">{selectedSource.type}</div>
                  </div>
                </div>

                {/* 知识提取数量统计 */}
                <div className="space-y-3">
                  <div className="font-bold text-neutral-800 text-[14px]">已提取出的知识数量：</div>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="text-[11px] font-bold text-emerald-700">已采用知识</div>
                      <div className="text-[18px] font-bold text-emerald-800">{selectedSource.extractedCount} 条</div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="text-[11px] font-bold text-amber-700">待确认知识</div>
                      <div className="text-[18px] font-bold text-amber-800">{selectedSource.pendingCount} 条</div>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="text-[11px] font-bold text-red-700">冲突数量</div>
                      <div className="text-[18px] font-bold text-red-800">{selectedSource.conflictCount} 条</div>
                    </div>

                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <div className="text-[11px] font-bold text-neutral-500">已失效数量</div>
                      <div className="text-[18px] font-bold text-neutral-700">{selectedSource.expiredCount} 条</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-6 border-t border-neutral-200 bg-white space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => showToast("已尝试打开本地文件。")}
                    className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors"
                  >
                    查看原文件
                  </button>

                  <button
                    onClick={() => showToast("已触发检查更新，正在拉取变动……")}
                    className="px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-[13px] rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw size={14} />
                    <span>检查更新</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSourceToDisconnect(selectedSource);
                    setIsDisconnectModalOpen(true);
                  }}
                  className="w-full py-2 bg-white hover:bg-red-50 text-red-600 font-bold text-[12px] rounded-xl transition-colors text-center"
                >
                  断开资料源
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. DISCONNECT SOURCE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDisconnectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDisconnectModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-[420px] rounded-2xl p-6 shadow-2xl z-10 space-y-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3 text-red-600">
                <ShieldAlert size={24} />
                <h3 className="text-[16px] font-bold text-neutral-900">断开资料源确认</h3>
              </div>

              <p className="text-[13px] text-neutral-600 leading-relaxed">
                断开后，AI 将不再检查或同步 <span className="font-bold text-neutral-900">{sourceToDisconnect?.name}</span> 的更新。
              </p>

              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] text-neutral-600">
                <span className="font-bold text-neutral-800">重要说明：</span>
                断开资料源不会删除此前已经采用的知识。已被确认为有效的知识将继续保留在商家知识库中。
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsDisconnectModalOpen(false)}
                  className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  取消
                </button>

                <button
                  onClick={() => {
                    setDataSources(prev => prev.filter(s => s.id !== sourceToDisconnect?.id));
                    setIsDisconnectModalOpen(false);
                    setSelectedSource(null);
                    showToast("资料源已断开连接。已采用知识仍保留在库中。");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors"
                >
                  确认断开
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. EXPERIENCE DETAILS DRAWER (经验详情抽屉) */}
      <AnimatePresence>
        {selectedExperience && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExperience(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-neutral-700" />
                  <h2 className="text-[16px] font-bold text-neutral-900">经验详情</h2>
                </div>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-[13px]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                      {selectedExperience.type}
                    </span>
                    {getStatusBadge(selectedExperience.valStatus)}
                  </div>
                  <h3 className="text-[16px] font-bold text-neutral-900 leading-snug">{selectedExperience.title}</h3>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400">核心思考 / 经验描述：</div>
                  <div className="text-[13px] text-neutral-800 leading-relaxed">{selectedExperience.content}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[12px] font-bold text-neutral-400">适用范围：</div>
                  <div className="text-[13px] font-medium text-neutral-800">{selectedExperience.scope}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[12px] font-bold text-neutral-400">商家应用状态：</div>
                  <div className="text-[13px] text-neutral-700">
                    {selectedExperience.merchantApplies.length > 0 ? (
                      <span className="font-bold text-emerald-700">已作为参考应用于：{selectedExperience.merchantApplies.join(", ")}</span>
                    ) : (
                      <span className="text-neutral-400">尚未应用于当前商家</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-6 border-t border-neutral-200 bg-white space-y-2">
                <button
                  onClick={() => setIsApplyExpModalOpen(true)}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors"
                >
                  应用于当前商家 (作为建议参考)
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      showToast("正在跳转至【技能中心】，为您将该经验提炼为 Skill...");
                      setSelectedExperience(null);
                    }}
                    className="flex-1 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-[12px] rounded-xl transition-colors"
                  >
                    升级为技能
                  </button>

                  <button
                    onClick={() => {
                      showToast("已将该经验归档。");
                      setSelectedExperience(null);
                    }}
                    className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-500 font-bold text-[12px] rounded-xl transition-colors"
                  >
                    归档
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. APPLY EXPERIENCE TO MERCHANT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isApplyExpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyExpModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-[420px] rounded-2xl p-6 shadow-2xl z-10 space-y-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3 text-neutral-900">
                <Sparkles size={22} className="text-amber-500" />
                <h3 className="text-[16px] font-bold">应用个人经验到当前商家</h3>
              </div>

              <p className="text-[13px] text-neutral-600 leading-relaxed">
                确定将个人经验 <span className="font-bold text-neutral-900">“{selectedExperience?.title}”</span> 设为当前商家【喵仙人】的生成建议依据？
              </p>

              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] text-neutral-600">
                <span className="font-bold text-neutral-800">优先级提醒：</span>
                个人经验作为辅助建议使用，优先级低于商家已确认事实与合规规范，绝不自动覆盖商家的官方价格或配方。
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsApplyExpModalOpen(false)}
                  className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  取消
                </button>

                <button
                  onClick={() => {
                    setIsApplyExpModalOpen(false);
                    setSelectedExperience(null);
                    showToast("已设为当前商家的AI生成建议依据。");
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors"
                >
                  确认应用
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. CATEGORY FILTER DRAWER (知识筛选抽屉) */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[380px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-neutral-700" />
                  <h2 className="text-[16px] font-bold text-neutral-900">按业务主题筛选</h2>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <p className="text-[12px] text-neutral-500">勾选需要查看的分类：</p>

                <div className="space-y-2">
                  {allCategories.map((cat) => {
                    const isChecked = selectedCategoryFilters.includes(cat);
                    return (
                      <label
                        key={cat}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedCategoryFilters(prev => prev.filter(c => c !== cat));
                          } else {
                            setSelectedCategoryFilters(prev => [...prev, cat]);
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                            : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 font-medium"
                        }`}
                      >
                        <span className="text-[13px]">{cat}</span>
                        {isChecked && <Check size={16} />}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200 bg-white flex items-center gap-3">
                <button
                  onClick={() => setSelectedCategoryFilters([])}
                  className="px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-[13px] rounded-xl transition-colors"
                >
                  重置
                </button>

                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors"
                >
                  完成
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. AI CITATION REFERENCE DRAWER ("本次参考依据" 抽屉) */}
      <AnimatePresence>
        {isCitationDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCitationDrawerOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                    <Brain size={18} className="text-amber-500" />
                    <span>本次任务 AI 参考依据</span>
                  </h2>
                  <p className="text-[12px] text-neutral-500">透明展示当前输出调用的商家事实与操盘经验。</p>
                </div>
                <button
                  onClick={() => setIsCitationDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-4 text-[13px]">
                <div className="p-3 bg-neutral-100/80 border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-800">
                  本次参考了 6 条商家知识、2 条历史经验。
                </div>

                <div className="space-y-3">
                  {citationItems.map((item) => {
                    const isExcluded = excludedCitations.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all space-y-2 ${
                          isExcluded
                            ? "bg-neutral-100/60 border-neutral-200 opacity-50"
                            : "bg-white border-neutral-200 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">{item.source}</span>
                        </div>

                        <div className="font-bold text-neutral-900">{item.title}</div>
                        <div className="text-[12px] text-neutral-600 italic bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                          {item.quote}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              if (isExcluded) {
                                setExcludedCitations(prev => prev.filter(id => id !== item.id));
                                showToast("已重新包含该知识。");
                              } else {
                                setExcludedCitations(prev => [...prev, item.id]);
                                showToast("仅在当前任务中排除该知识，全局知识库保持不变。");
                              }
                            }}
                            className={`text-[12px] font-bold px-3 py-1 rounded-lg transition-colors ${
                              isExcluded
                                ? "bg-neutral-800 text-white"
                                : "bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600"
                            }`}
                          >
                            {isExcluded ? "重新包含" : "在当前任务中排除"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200 bg-white">
                <button
                  onClick={() => setIsCitationDrawerOpen(false)}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl shadow-xs transition-colors"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default KnowledgeMemory;
