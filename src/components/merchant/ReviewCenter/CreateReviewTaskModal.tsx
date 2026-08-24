import React, { useState } from "react";
import { 
  X, Sparkles, Check, Search, Layers, 
  ChevronDown, ChevronUp, CheckCircle2,
  TrendingUp, BarChart2, Users, FileText, Target, ShieldCheck,
  Plus, Tag, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABLE_PROJECTS_LIST } from "./mockData";
import { ReviewTask } from "./types";

interface CreateReviewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (newTask: ReviewTask) => void;
}

export interface ObjectiveItem {
  id: string;
  title: string;
  category: "对比分析" | "项目诊断" | "内容策略" | "用户增长" | "转化分析";
  desc: string;
  applicableMode?: "single" | "multi" | "all";
}

const OBJECTIVE_LIBRARY: ObjectiveItem[] = [
  // 1. 对比分析
  {
    id: "benchmark",
    title: "横向比较",
    category: "对比分析",
    desc: "对比多个门店/账号在曝光、互动与转化上的表现，挖掘可复制标杆",
    applicableMode: "multi",
  },
  {
    id: "script_compare",
    title: "新旧脚本完播率对比",
    category: "对比分析",
    desc: "对比不同时期、不同版本脚本完播率与互动留资效率变化",
    applicableMode: "all",
  },
  {
    id: "format_compare",
    title: "图文与视频形式效能对比",
    category: "对比分析",
    desc: "分析图文与短视频在各门店长尾收录与获客效能差异",
    applicableMode: "all",
  },

  // 2. 项目诊断
  {
    id: "project_diagnosis",
    title: "项目全维健康度体检",
    category: "项目诊断",
    desc: "针对单一项目进行全维度健康度体检，快速定位阻断与流失环节",
    applicableMode: "all",
  },
  {
    id: "comprehensive",
    title: "自动综合全景分析",
    category: "项目诊断",
    desc: "启动全部专职 Agent 任务流，输出全要素综合分析报告与行动建议",
    applicableMode: "all",
  },

  // 3. 内容策略
  {
    id: "viral_attribution",
    title: "爆文归因与复制",
    category: "内容策略",
    desc: "定位高ROI爆文要素（封面标题、前3秒黄金钩子与正文利益点）",
    applicableMode: "all",
  },
  {
    id: "content_strategy",
    title: "内容策略复盘",
    category: "内容策略",
    desc: "深度拆解选题模型、实测视频完播率与长尾搜索收录",
    applicableMode: "all",
  },
  {
    id: "comment_hook",
    title: "评论区话术与截流承接",
    category: "内容策略",
    desc: "复盘置顶评论、引导物料与神评互动的承接引导效率",
    applicableMode: "all",
  },

  // 4. 用户增长
  {
    id: "user_growth",
    title: "用户画像与痛点洞察",
    category: "用户增长",
    desc: "挖掘高意向宠主搜索痛点（软便/换粮/泪痕/挑食）及客群画像分布",
    applicableMode: "all",
  },
  {
    id: "search_intercept",
    title: "搜索截流关键词分析",
    category: "用户增长",
    desc: "分析小红书搜索流核心截流词、品类词与长尾词的自然渗透率",
    applicableMode: "all",
  },

  // 5. 转化分析
  {
    id: "conversion",
    title: "转化与留资全链路漏斗",
    category: "转化分析",
    desc: "测算私信咨询、顾问答疑留资与线下门店到店核销转化漏斗",
    applicableMode: "all",
  },
  {
    id: "night_loss",
    title: "夜间私信流失排查",
    category: "转化分析",
    desc: "排查 20:00—24:00 夜间咨询断点，定位因无人应答导致的线索流失",
    applicableMode: "all",
  },
  {
    id: "complaint_attribution",
    title: "评论区客诉与异议归因",
    category: "转化分析",
    desc: "归类评论区负反馈、异议与咨询，分析其对私信转化的负面影响",
    applicableMode: "all",
  },
  {
    id: "offline_redeem",
    title: "线下到店核销率分析",
    category: "转化分析",
    desc: "测算从小红书私信领券/礼包到实体门店 POS 核销的落地转化率",
    applicableMode: "all",
  },
  {
    id: "cost_roi",
    title: "获客成本与ROI测算",
    category: "转化分析",
    desc: "核算单客获取成本 CPL、线索留资单价与各矩阵账号投产产出比",
    applicableMode: "all",
  },
];

export function CreateReviewTaskModal({ isOpen, onClose, onCreateTask }: CreateReviewTaskModalProps) {
  // Form states
  const [taskName, setTaskName] = useState("");
  const [mode, setMode] = useState<"single" | "multi">("multi");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(["p4", "p5"]);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [timePreset, setTimePreset] = useState<"7d" | "30d" | "this_month" | "last_month" | "custom">("30d");
  const [customStartDate, setCustomStartDate] = useState("2026-08-01");
  const [customEndDate, setCustomEndDate] = useState("2026-08-23");
  
  // Compact unified objectives state
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["横向比较", "夜间私信流失排查"]);
  const [customInputText, setCustomInputText] = useState("");
  const [isMoreGoalsOpen, setIsMoreGoalsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [detailedNotes, setDetailedNotes] = useState("");
  
  // Advanced settings (collapsible)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [includeHistoryData, setIncludeHistoryData] = useState(true);
  const [generateCrossComparison, setGenerateCrossComparison] = useState(true);
  const [outputActionProposals, setOutputActionProposals] = useState(true);
  const [autoSyncToExecutionCenter, setAutoSyncToExecutionCenter] = useState(false);

  if (!isOpen) return null;

  const handleToggleProject = (id: string) => {
    if (mode === "single") {
      setSelectedProjectIds([id]);
    } else {
      if (selectedProjectIds.includes(id)) {
        if (selectedProjectIds.length > 1) {
          setSelectedProjectIds(selectedProjectIds.filter(p => p !== id));
        }
      } else {
        setSelectedProjectIds([...selectedProjectIds, id]);
      }
    }
  };

  const handleAddGoal = (goalText?: string) => {
    const target = (goalText !== undefined ? goalText : customInputText).trim();
    if (!target) return;
    if (!selectedGoals.includes(target)) {
      setSelectedGoals([...selectedGoals, target]);
    }
    if (goalText === undefined || goalText === customInputText) {
      setCustomInputText("");
    }
  };

  const handleRemoveGoal = (goalText: string) => {
    setSelectedGoals(selectedGoals.filter((g) => g !== goalText));
  };

  const handleClearAllGoals = () => {
    setSelectedGoals([]);
  };

  const handleToggleGoal = (goalText: string) => {
    if (selectedGoals.includes(goalText)) {
      handleRemoveGoal(goalText);
    } else {
      handleAddGoal(goalText);
    }
  };

  const filteredProjects = AVAILABLE_PROJECTS_LIST.filter(p => 
    p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  // Recommendations filtered by mode
  const effectiveRecommendations = [
    ...(mode === "multi" ? [{ id: "rec-multi", title: "横向比较", desc: "对比多个门店/账号在曝光、互动与转化上的表现" }] : []),
    { id: "rec-night", title: "夜间私信流失排查", desc: "排查 20:00—24:00 夜间咨询断点，评估因无人值守导致的潜客流失" },
    { id: "rec-complaint", title: "评论区客诉与异议归因", desc: "归类评论区负反馈、异议与咨询，分析对留资与转化造成的负面阻断" },
    { id: "rec-search", title: "搜索截流关键词分析", desc: "分析小红书搜索流核心截流词、品类词与长尾词的自然渗透率" },
  ];

  // Full library filtered by current mode and active category
  const displayedLibraryItems = OBJECTIVE_LIBRARY.filter((item) => {
    if (mode === "single" && item.applicableMode === "multi") return false;
    if (mode === "multi" && item.applicableMode === "single") return false;
    if (selectedCategory !== "全部" && item.category !== selectedCategory) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resolve date range
    let start = "2026-08-01";
    let end = "2026-08-23";
    let label = "最近 30 天";
    
    if (timePreset === "7d") {
      start = "2026-08-16";
      end = "2026-08-23";
      label = "2026-08-16 至 2026-08-23 (最近 7 天)";
    } else if (timePreset === "30d") {
      start = "2026-07-24";
      end = "2026-08-23";
      label = "2026-07-24 至 2026-08-23 (最近 30 天)";
    } else if (timePreset === "this_month") {
      start = "2026-08-01";
      end = "2026-08-23";
      label = "2026-08-01 至 2026-08-23 (本月)";
    } else if (timePreset === "last_month") {
      start = "2026-07-01";
      end = "2026-07-31";
      label = "2026-07-01 至 2026-07-31 (上月)";
    } else {
      start = customStartDate;
      end = customEndDate;
      label = `${customStartDate} 至 ${customEndDate} (自定义)`;
    }

    const selectedProjects = AVAILABLE_PROJECTS_LIST.filter(p => selectedProjectIds.includes(p.id));
    const projectNames = selectedProjects.map(p => p.name);

    // Final list of objectives
    const finalObjectiveLabels = [...selectedGoals];
    if (customInputText.trim() && !finalObjectiveLabels.includes(customInputText.trim())) {
      finalObjectiveLabels.push(customInputText.trim());
    }

    if (finalObjectiveLabels.length === 0) {
      finalObjectiveLabels.push("全景运营复盘");
    }

    const targetObjectiveLabel = finalObjectiveLabels.join("、");
    const primaryObjectiveId = finalObjectiveLabels[0] || "custom";

    const resolvedTitle = taskName.trim() || (
      mode === "multi" 
        ? `${projectNames.slice(0, 2).join('与')}${projectNames.length > 2 ? `等${projectNames.length}个项目` : ''} - ${finalObjectiveLabels[0] || '复盘'}`
        : `${projectNames[0] || '项目'}运营复盘 (${finalObjectiveLabels[0] || '综合'})`
    );

    // Construct detailed goal description
    const goalDescriptions = finalObjectiveLabels.map((goal) => {
      const match = OBJECTIVE_LIBRARY.find((o) => o.title === goal);
      return match ? `【${match.title}】${match.desc}` : `【分析目标】${goal}`;
    });
    
    const notesDesc = detailedNotes.trim() ? `\n重点关注说明：${detailedNotes.trim()}` : "";
    
    const goalDescription = goalDescriptions.join("；") + notesDesc || "由 Agent 自动化执行数据采集、漏斗指标计算与多目标协同策略建议输出";

    const newTask: ReviewTask = {
      id: `rev-task-${Date.now()}`,
      title: resolvedTitle,
      dateRange: { start, end, label },
      mode,
      projectIds: selectedProjectIds,
      projectNames,
      targetObjective: primaryObjectiveId,
      targetObjectiveLabel,
      targetObjectiveLabels: finalObjectiveLabels,
      customObjectives: finalObjectiveLabels,
      goalDescription,
      status: "analyzing",
      statusText: "分析中",
      updatedAt: "刚刚",
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      activeVersionId: "v1",
      historyVersions: [
        {
          id: "v1",
          versionName: "v1.0 实时生成任务",
          versionTag: "运行中",
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          createdBy: "张操盘 (发起任务)",
          dataCutoff: end,
          status: "draft",
          changelog: "新建复盘任务，Agent 任务流正在并发抓取与分析中",
          summarySnapshot: `针对 ${projectNames.join(', ')} 启动目标【${targetObjectiveLabel}】的任务流`,
        }
      ],
      progressSteps: [
        {
          id: `step-${Date.now()}-1`,
          type: "completed",
          statusLabel: "已完成",
          title: "数据采集 Agent 已连通数据源",
          description: `成功调取 ${selectedProjects.length} 个项目的全量笔记、会话与私信线索`,
          actionText: "查看数据",
          actionType: "view_log",
          agentName: "数据采集 Agent"
        },
        {
          id: `step-${Date.now()}-2`,
          type: "analyzing",
          statusLabel: "分析中",
          title: "指标分析与用户洞察 Agent 正在运算",
          description: `正在结合目标【${targetObjectiveLabel}】进行跨周期测算与痛点聚类`,
          actionText: "查看日志",
          actionType: "view_log",
          agentName: "指标分析 Agent"
        },
        {
          id: `step-${Date.now()}-3`,
          type: "confirm",
          statusLabel: "待确认",
          title: "等待确认生成策略行动建议",
          description: "分析完成后将自动产出结构化多目标优化策略",
          actionText: "查看进度",
          actionType: "confirm",
          agentName: "策略建议 Agent"
        }
      ],
      coreConclusions: {
        overallPerformance: {
          status: "up",
          title: `针对【${finalObjectiveLabels[0]}】等多目标指标聚合中，整体表现稳健向上`,
          description: `已接入 ${selectedProjects.length} 个运营项目，正在针对 ${finalObjectiveLabels.length} 个核心复盘诉求进行多维交叉校验与漏斗拟合。`,
          metricBadge: "同步完成率 100%",
          metricDiff: "分析中...",
        },
        mainIssue: {
          title: "部分长尾流量承接时效有待提升",
          description: "夜间非工作时段咨询线索响应时间偏长，建议部署自动化应答规则。",
          cause: "人工客服排班未覆盖夜间峰值",
          stage: "私信承接阶段",
        },
        keyOpportunity: {
          title: "专业测评打卡内容转化效率显著领先",
          description: "真实养宠体验与店长答疑结合的内容形式在各项目均体现出较强的留资吸引力。",
          potentialGain: "预计可带动咨询转化提升 15%~20%",
        },
        priorityAction: {
          title: "复用标杆门店的承接话术与排雷指南",
          description: "统一配置《幼犬换粮自测表》作为私信承接钩子物料。",
          immediateTarget: "下发至执行中心统一推进",
        },
      },
      crossProjectComparison: mode === "multi" ? {
        projects: selectedProjects.map((p, idx) => ({
          id: p.id,
          name: p.name,
          impressions: { val: `${(15 + idx * 3.5).toFixed(1)}万`, diff: `↑${10 + idx * 8}%`, trend: "up" },
          conversion: { val: `${(12 + idx * 4.2).toFixed(1)}%`, diff: `↑${5 + idx * 6}%`, trend: "up" },
          interaction: { val: `${(7000 + idx * 2400).toLocaleString()}`, diff: `↑${8 + idx * 4}%`, trend: "up" },
          leads: { val: `${320 + idx * 110}人`, diff: `↑${12 + idx * 10}%`, trend: "up" },
          aiJudgeTag: idx === 0 ? "表现最佳 · 标杆可复用" : "运行平稳 · 转化良好",
          aiJudgeType: idx === 0 ? "best" : "normal",
          keyStrength: "真人IP背书 + 专业答疑",
          weakness: "长尾搜索词覆盖可进一步加强",
        })),
        aiSummary: {
          bestProject: `${selectedProjects[0]?.name || '标杆项目'}在有效私信咨询率上领先，具备高复用价值。`,
          reusableFactor: "以专业营养师视角解答真实换粮疑难问题，置顶评论提供干货自测表。",
          weakProjectIssue: "其余项目在夜间时段响应较慢，流失率高于标杆项目。",
          overallRecommendation: `建议围绕目标【${targetObjectiveLabel}】，将标杆项目的选题库与5分钟私信响应链推广至全部已选项目。`,
        },
      } : undefined,
      agentPipeline: [
        {
          id: "ag-n-1",
          name: "数据采集 Agent",
          role: "Data Extraction",
          status: "completed",
          statusText: "已完成",
          summary: `已成功同步 ${selectedProjects.length} 个项目全量数据`,
          duration: "1.1s",
          outputItems: ["小红书笔记数据", "私信互动流水", "用户搜索词快照"],
          logs: [{ time: "刚刚", level: "success", message: "多端数据同步完成" }],
        },
        {
          id: "ag-n-2",
          name: "指标分析 Agent",
          role: "Metrics Calculation",
          status: "running",
          statusText: "运算中",
          summary: `正在基于【${targetObjectiveLabel}】计算跨项目漏斗衰减与ROI...`,
          duration: "进行中 (已用时 4s)",
          outputItems: [],
          logs: [{ time: "刚刚", level: "info", message: "开始指标测算" }],
        },
        {
          id: "ag-n-3",
          name: "用户洞察 Agent",
          role: "User Mining",
          status: "pending",
          statusText: "等待中",
          summary: "待指标分析完成后启动",
          duration: "0s",
          outputItems: [],
          logs: [],
        },
        {
          id: "ag-n-4",
          name: "内容分析 Agent",
          role: "Content Evaluation",
          status: "pending",
          statusText: "等待中",
          summary: "待指标分析完成后启动",
          duration: "0s",
          outputItems: [],
          logs: [],
        },
        {
          id: "ag-n-5",
          name: "转化分析 Agent",
          role: "Conversion Funnel",
          status: "pending",
          statusText: "等待中",
          summary: "待指标分析完成后启动",
          duration: "0s",
          outputItems: [],
          logs: [],
        },
        {
          id: "ag-n-6",
          name: "策略建议 Agent",
          role: "Strategy Synthesis",
          status: "pending",
          statusText: "等待中",
          summary: "待全部Agent分析后产出多目标建议",
          duration: "0s",
          outputItems: [],
          logs: [],
        },
      ],
      suggestedActions: [
        {
          id: `act-${Date.now()}-1`,
          title: "优化高转化内容承接链路与夜间自动应答",
          target: "缩短线索流失时间，提升夜间客户挽回率",
          expectedGain: "预计提升私信留资率 +20%",
          priority: "P0",
          category: "转化承接",
          actionType: "plan",
          appliedStatus: "not_applied",
          inExecutionCenter: false,
          reason: "解决夜间时段无专人接待的问题。",
          recommendedSteps: ["开启AI夜间自动接待", "配置引导物料"],
        },
        {
          id: `act-${Date.now()}-2`,
          title: "复制标杆门店选题库到其余项目",
          target: "升级图文与视频内容信任度",
          expectedGain: "单篇互动成本预计下降 30%",
          priority: "P1",
          category: "内容策略",
          actionType: "note",
          appliedStatus: "not_applied",
          inExecutionCenter: false,
          reason: "标杆经验可在矩阵内快速复用。",
          recommendedSteps: ["下发脚本模板", "建立审核抽检"],
        },
      ],
      analysisDetails: {
        summary: {
          scope: projectNames.join("、"),
          target: targetObjectiveLabel,
          projectCount: selectedProjects.length,
          timeWindow: label,
          dataSource: "小红书专业号、来客私信、门店核销系统",
          sampleNotesCount: selectedProjects.reduce((acc, curr) => acc + curr.activeNotes, 0),
        },
        diagnoses: [
          {
            issue: "跨项目私信响应时效不均",
            cause: "部分门店未配置夜间自动回复规则。",
            impact: "估算每月错失约 15% 的高潜线索。",
            severity: "medium",
            affectedStage: "私信承接阶段",
          },
        ],
        metricShifts: [
          { metric: "总曝光量", before: "32.0万", current: "38.6万", change: "+20.6%", isGood: true, note: "稳步上涨" },
          { metric: "私信线索总量", before: "980", current: "1,180", change: "+20.4%", isGood: true, note: "留资增长" },
        ],
        insights: {
          contentInsight: {
            title: "内容洞察",
            takeaways: ["实测打卡类笔记信任度最高，完播率超 55%。"],
          },
          userInsight: {
            title: "用户洞察",
            takeaways: ["新手宠主对软便与换粮期胃肠耐受关注度最高。"],
          },
          conversionInsight: {
            title: "转化洞察",
            takeaways: ["置顶评论引导自测表的点击转化率高出 3.5 倍。"],
          },
        },
        strategicGuidelines: [
          {
            title: "推行专业顾问人设打法",
            detail: "从纯促销转向专业营养学解答，提升单客价值。",
            actionSteps: ["统一拍摄模板", "配置知识库"],
          },
        ],
        finalConclusion: `已启动针对【${targetObjectiveLabel}】的复盘任务流，Agent 正在完成推导，建议动作已就绪。`,
      },
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-surface-1 rounded-2xl shadow-dialog border border-border-default w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-text-main"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
          <div>
            <h2 className="text-[16px] font-semibold text-text-main">创建复盘任务</h2>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              配置复盘对象、时间范围与分析目标，支持多目标组合与自由填入
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-[13px] font-medium text-text-main mb-1.5">
              任务名称 <span className="text-text-tertiary font-normal">(选填，不填将根据对象与目标自动命名)</span>
            </label>
            <input
              type="text"
              placeholder="例如：8月三亚与青岛店横向复盘、幼犬换粮期多目标转化诊断..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
            />
          </div>

          {/* STEP 1: Select Analysis Target & Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-btn-main text-white text-[11px] flex items-center justify-center font-bold">1</span>
                选择分析对象与时间范围
              </span>

              {/* Mode Switcher */}
              <div className="flex bg-surface-subtle p-0.5 rounded-lg border border-border-default">
                <button
                  type="button"
                  onClick={() => {
                    setMode("single");
                    if (selectedProjectIds.length > 1) {
                      setSelectedProjectIds([selectedProjectIds[0]]);
                    }
                    // Auto-adjust objectives for single mode
                    setSelectedGoals(prev => prev.filter(g => g !== "横向比较"));
                  }}
                  className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
                    mode === "single"
                      ? "bg-surface-1 text-text-main shadow-xs"
                      : "text-text-tertiary hover:text-text-main"
                  }`}
                >
                  单项目诊断
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("multi");
                    if (!selectedGoals.includes("横向比较")) {
                      setSelectedGoals(prev => ["横向比较", ...prev]);
                    }
                  }}
                  className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
                    mode === "multi"
                      ? "bg-surface-1 text-text-main shadow-xs"
                      : "text-text-tertiary hover:text-text-main"
                  }`}
                >
                  多项目横向对比
                </button>
              </div>
            </div>

            {/* Project Selection Box */}
            <div className="p-3 bg-surface-subtle rounded-xl border border-border-default space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="搜索门店、账号或项目..."
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-surface-1 border border-border-default rounded-lg text-[12px] outline-none"
                  />
                </div>
                <span className="text-[11px] text-text-tertiary shrink-0">
                  {mode === "single" ? "单选模式" : `已选 ${selectedProjectIds.length} 个项目`}
                </span>
              </div>

              {/* Selected Pills */}
              <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                {selectedProjectIds.map((id) => {
                  const proj = AVAILABLE_PROJECTS_LIST.find((p) => p.id === id);
                  if (!proj) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-1 border border-border-default text-text-main text-[11.5px] rounded-lg shadow-2xs font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{proj.name}</span>
                      {mode === "multi" && selectedProjectIds.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleProject(id);
                          }}
                          className="text-text-tertiary hover:text-text-main ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Project Candidates List */}
              <div className="max-h-36 overflow-y-auto space-y-1 pt-1 pr-1">
                {filteredProjects.map((p) => {
                  const isChecked = selectedProjectIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleToggleProject(p.id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-[12px] ${
                        isChecked
                          ? "bg-surface-1 border border-border-default text-text-main font-medium"
                          : "hover:bg-surface-1 text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? "bg-btn-main border-btn-main text-white" : "border-border-strong bg-surface-1"}`}>
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span>{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                        <span>{p.category}</span>
                        <span>·</span>
                        <span>{p.activeNotes} 篇笔记</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Range */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[12px] font-medium text-text-secondary">时间范围</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "7d", label: "最近 7 天" },
                  { id: "30d", label: "最近 30 天" },
                  { id: "this_month", label: "本月" },
                  { id: "last_month", label: "上月" },
                  { id: "custom", label: "自定义时间" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTimePreset(item.id as any)}
                    className={`px-3 py-1.5 text-[12px] rounded-lg font-medium transition-all ${
                      timePreset === item.id
                        ? "bg-btn-main text-white"
                        : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {timePreset === "custom" && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[12px]"
                  />
                  <span className="text-text-tertiary text-[12px]">至</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-2.5 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[12px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: Unified Compact Objectives Component */}
          <div className="space-y-2.5">
            {/* Header: Title + Selected Count */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-btn-main text-white text-[11px] flex items-center justify-center font-bold">2</span>
                设定复盘目标
              </span>

              <div className="flex items-center gap-2">
                {selectedGoals.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllGoals}
                    className="text-[11.5px] text-text-tertiary hover:text-red-500 transition-colors"
                  >
                    清空重选
                  </button>
                )}
                <span className="text-[11.5px] px-2 py-0.5 bg-surface-subtle text-text-secondary border border-border-default rounded-md font-medium">
                  已选择 {selectedGoals.length} 项
                </span>
              </div>
            </div>

            {/* Warning if too many goals (> 3) */}
            {selectedGoals.length > 3 && (
              <div className="flex items-center gap-1.5 text-[11.5px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                <AlertCircle size={13} className="shrink-0 text-amber-600" />
                <span>建议选择 1-3 个核心目标，目标过多可能分散分析重点。</span>
              </div>
            )}

            {/* Selected Objectives Tag Cloud (Displayed cleanly above the input box) */}
            {selectedGoals.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center p-2 bg-surface-subtle rounded-xl border border-border-default">
                {selectedGoals.map((goal) => {
                  const matchLib = OBJECTIVE_LIBRARY.find((o) => o.title === goal);
                  return (
                    <span
                      key={goal}
                      title={matchLib?.desc || `分析目标：${goal}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-1 border border-border-strong text-text-main rounded-lg text-[12px] font-medium shadow-2xs group cursor-default transition-all"
                    >
                      <span>{goal}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(goal)}
                        className="text-text-tertiary hover:text-red-500 transition-colors ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="text-[11.5px] text-text-tertiary italic px-1">
                未选择目标（默认执行全要素综合全景分析）
              </div>
            )}

            {/* Custom Input Box (Primary Entry) */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="输入自定义分析目标（例如：排查夜间私信流失、分析金毛犬种ROI...）"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                  className="w-full px-3 py-2 bg-surface-subtle border border-border-default rounded-lg text-[12.5px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddGoal()}
                className="px-4 py-2 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main text-[12.5px] font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
              >
                <Plus size={13} />
                <span>添加</span>
              </button>
            </div>

            {/* Recommendations Row & More Goals Entrance */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11.5px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-text-tertiary shrink-0">推荐：</span>
                {effectiveRecommendations.map((item) => {
                  const isAdded = selectedGoals.includes(item.title);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddGoal(item.title)}
                      title={item.desc}
                      className={`px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 ${
                        isAdded
                          ? "bg-surface-subtle text-text-tertiary border-border-subtle cursor-default"
                          : "bg-surface-subtle text-text-secondary hover:text-text-main hover:bg-surface-1 border-border-default cursor-pointer"
                      }`}
                    >
                      <span>+</span>
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* More Goals Toggle */}
              <button
                type="button"
                onClick={() => setIsMoreGoalsOpen(!isMoreGoalsOpen)}
                className={`px-2.5 py-1 rounded-md border text-[11.5px] font-medium flex items-center gap-1 transition-all ${
                  isMoreGoalsOpen
                    ? "bg-btn-main text-white border-btn-main shadow-2xs"
                    : "bg-surface-1 border-border-default text-btn-main hover:bg-hover-bg"
                }`}
              >
                <span>+ 更多目标</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isMoreGoalsOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Categorized Dropdown / Popover Panel for Complete Objective Library */}
            <AnimatePresence>
              {isMoreGoalsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  className="overflow-hidden border border-border-default rounded-xl bg-surface-1 shadow-lg mt-1 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <div className="flex items-center gap-1 text-[11.5px] overflow-x-auto">
                      {["全部", "对比分析", "项目诊断", "内容策略", "用户增长", "转化分析"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 rounded-md transition-colors font-medium shrink-0 ${
                            selectedCategory === cat
                              ? "bg-btn-main text-white shadow-2xs"
                              : "text-text-secondary hover:bg-hover-bg hover:text-text-main"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMoreGoalsOpen(false)}
                      className="text-[11.5px] text-text-tertiary hover:text-text-main px-2 py-0.5 rounded hover:bg-hover-bg shrink-0 ml-2"
                    >
                      收起
                    </button>
                  </div>

                  {/* Filtered Library Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {displayedLibraryItems.map((item) => {
                      const isSelected = selectedGoals.includes(item.title);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleGoal(item.title)}
                          title={item.desc}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                            isSelected
                              ? "bg-surface-subtle border-btn-main ring-1 ring-btn-main"
                              : "bg-surface-subtle border-border-subtle hover:border-border-strong hover:bg-surface-1"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-semibold text-text-main truncate">{item.title}</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-surface-1 border border-border-subtle text-text-tertiary rounded shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-tertiary truncate mt-0.5" title={item.desc}>
                              {item.desc}
                            </p>
                          </div>

                          <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                            isSelected ? "bg-btn-main border-btn-main text-white" : "border-border-strong bg-surface-1"
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional Freeform Notes / Focus Areas */}
            <div className="pt-1">
              <label className="block text-[12px] font-medium text-text-secondary mb-1">
                补充说明 / 重点关注问题 <span className="text-text-tertiary font-normal">(选填，用于向 Agent 传递具体诉求)</span>
              </label>
              <textarea
                rows={2}
                placeholder="例如：重点关注7月份两家店在幼犬换粮期的客单价差距，并给出3条可执行的脚本优化方案..."
                value={detailedNotes}
                onChange={(e) => setDetailedNotes(e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[12px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors resize-none"
              />
            </div>
          </div>

          {/* STEP 3: Advanced Settings (Collapsible) */}
          <div className="border-t border-border-default pt-3">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center justify-between w-full text-[12.5px] text-text-secondary hover:text-text-main font-medium py-1"
            >
              <span>高级设置 (可选)</span>
              {isAdvancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isAdvancedOpen && (
              <div className="mt-2 space-y-2.5 p-3.5 bg-surface-subtle rounded-xl border border-border-default text-[12px]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHistoryData}
                    onChange={(e) => setIncludeHistoryData(e.target.checked)}
                    className="rounded border-border-strong text-btn-main"
                  />
                  <span className="text-text-main">纳入上期历史方案数据作为环比对照</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateCrossComparison}
                    onChange={(e) => setGenerateCrossComparison(e.target.checked)}
                    className="rounded border-border-strong text-btn-main"
                  />
                  <span className="text-text-main">生成跨项目横向对比矩阵与标杆归因</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={outputActionProposals}
                    onChange={(e) => setOutputActionProposals(e.target.checked)}
                    className="rounded border-border-strong text-btn-main"
                  />
                  <span className="text-text-main">输出可落地的结构化行动建议卡片</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncToExecutionCenter}
                    onChange={(e) => setAutoSyncToExecutionCenter(e.target.checked)}
                    className="rounded border-border-strong text-btn-main"
                  />
                  <span className="text-text-main">建议动作自动同步至【执行中心】待办队列</span>
                </label>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg rounded-xl transition-colors border border-border-default bg-surface-1"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-medium text-white bg-btn-main hover:bg-btn-main-hover rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>开始复盘</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
