import React, { useState } from "react";
import { 
  X, Sparkles, Check, Calendar, Search, Layers, 
  ChevronDown, ChevronUp, CheckCircle2, ArrowRight,
  TrendingUp, BarChart2, Users, FileText, Target, ShieldCheck,
  Plus, Tag, MessageSquare, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABLE_PROJECTS_LIST } from "./mockData";
import { ReviewTask } from "./types";

interface CreateReviewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (newTask: ReviewTask) => void;
}

const OBJECTIVE_SHORTCUTS = [
  {
    id: "benchmark",
    title: "横向比较",
    desc: "对比多个门店/账号在曝光、互动与转化上的表现，挖掘可复制标杆",
    icon: Layers,
    recommendedFor: "多项目",
  },
  {
    id: "project_diagnosis",
    title: "项目诊断",
    desc: "针对单一项目进行全维度健康度体检，快速定位阻断与流失环节",
    icon: ShieldCheck,
    recommendedFor: "单项目",
  },
  {
    id: "content_strategy",
    title: "内容策略复盘",
    desc: "深度拆解爆文结构、实测视频完播率与长尾搜索收录",
    icon: FileText,
    recommendedFor: "图文/视频",
  },
  {
    id: "user_growth",
    title: "用户增长分析",
    desc: "挖掘高意向宠主搜索痛点（软便/换粮/泪痕）及客群画像分布",
    icon: Users,
    recommendedFor: "新客增长",
  },
  {
    id: "conversion",
    title: "转化与留资漏斗",
    desc: "测算私信咨询、顾问答疑留资与线下门店到店核销转化漏斗",
    icon: TrendingUp,
    recommendedFor: "私信承接",
  },
  {
    id: "viral_attribution",
    title: "爆文归因与复制",
    desc: "定位高ROI爆文要素（封面标题、前3秒钩子、正文利益点与评论承接）",
    icon: Sparkles,
    recommendedFor: "爆文打造",
  },
  {
    id: "cost_roi",
    title: "获客成本与ROI测算",
    desc: "核算单客获取成本、线索留资单价与各矩阵号投产产出比",
    icon: BarChart2,
    recommendedFor: "投产分析",
  },
  {
    id: "comprehensive",
    title: "自动综合全景分析",
    desc: "启动全部 6 个专职 Agent 任务流，输出全要素综合分析报告与行动建议",
    icon: Target,
    recommendedFor: "全面复盘",
  },
];

const QUICK_CUSTOM_SUGGESTIONS = [
  "夜间私信流失排查",
  "评论区客诉与异议归因",
  "搜索截流关键词分析",
  "线下到店核销率分析",
  "新旧脚本完播率对比",
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
  
  // Objectives state (supports multiple shortcuts + free custom inputs)
  const [selectedObjectiveIds, setSelectedObjectiveIds] = useState<string[]>(["benchmark"]);
  const [customObjectives, setCustomObjectives] = useState<string[]>([]);
  const [customInputText, setCustomInputText] = useState("");
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

  const handleToggleShortcutObjective = (id: string) => {
    if (selectedObjectiveIds.includes(id)) {
      // Allow deselecting as long as there is at least another shortcut or a custom objective
      setSelectedObjectiveIds(selectedObjectiveIds.filter(item => item !== id));
    } else {
      setSelectedObjectiveIds([...selectedObjectiveIds, id]);
    }
  };

  const handleAddCustomObjective = (text?: string) => {
    const targetText = (text || customInputText).trim();
    if (!targetText) return;
    if (!customObjectives.includes(targetText)) {
      setCustomObjectives([...customObjectives, targetText]);
    }
    if (!text) {
      setCustomInputText("");
    }
  };

  const handleRemoveCustomObjective = (text: string) => {
    setCustomObjectives(customObjectives.filter(item => item !== text));
  };

  const filteredProjects = AVAILABLE_PROJECTS_LIST.filter(p => 
    p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  // Collect all active objective titles
  const activeShortcutTitles = OBJECTIVE_SHORTCUTS
    .filter(o => selectedObjectiveIds.includes(o.id))
    .map(o => o.title);
  
  const allObjectiveLabels = [...activeShortcutTitles, ...customObjectives];
  if (customInputText.trim() && !allObjectiveLabels.includes(customInputText.trim())) {
    allObjectiveLabels.push(customInputText.trim());
  }

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
    const finalCustomObjectives = [...customObjectives];
    if (customInputText.trim() && !finalCustomObjectives.includes(customInputText.trim())) {
      finalCustomObjectives.push(customInputText.trim());
    }

    const finalObjectiveLabels = [
      ...OBJECTIVE_SHORTCUTS.filter(o => selectedObjectiveIds.includes(o.id)).map(o => o.title),
      ...finalCustomObjectives,
    ];

    if (finalObjectiveLabels.length === 0) {
      finalObjectiveLabels.push("全景运营复盘");
    }

    const targetObjectiveLabel = finalObjectiveLabels.join("、");
    const primaryObjectiveId = selectedObjectiveIds[0] || "custom";

    const resolvedTitle = taskName.trim() || (
      mode === "multi" 
        ? `${projectNames.slice(0, 2).join('与')}${projectNames.length > 2 ? `等${projectNames.length}个项目` : ''} - ${finalObjectiveLabels[0] || '复盘'}`
        : `${projectNames[0] || '项目'}运营复盘 (${finalObjectiveLabels[0] || '综合'})`
    );

    // Construct detailed goal description
    const selectedShortcutDescs = OBJECTIVE_SHORTCUTS
      .filter(o => selectedObjectiveIds.includes(o.id))
      .map(o => `【${o.title}】${o.desc}`);
    
    const customDescs = finalCustomObjectives.map(c => `【专项目标】${c}`);
    const notesDesc = detailedNotes.trim() ? `\n重点关注说明：${detailedNotes.trim()}` : "";
    
    const goalDescription = [
      ...selectedShortcutDescs,
      ...customDescs,
    ].join("；") + notesDesc || "由 Agent 自动化执行数据采集、漏斗指标计算与多目标协同策略建议输出";

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
      customObjectives: finalCustomObjectives,
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
          inExecutionCenter: autoSyncToExecutionCenter,
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
          inExecutionCenter: autoSyncToExecutionCenter,
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
                  onClick={() => setMode("multi")}
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

          {/* STEP 2: Choose & Enter Review Objectives (Shortcuts + Free Custom Input + Multi-select) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text-main flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-btn-main text-white text-[11px] flex items-center justify-center font-bold">2</span>
                设定复盘目标
                <span className="text-[12px] text-text-tertiary font-normal">(支持多选快捷方式，也支持自由输入)</span>
              </span>

              {/* Active Objectives Count Badge */}
              <span className="text-[11.5px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium">
                已设定 {allObjectiveLabels.length} 个目标
              </span>
            </div>

            {/* Active Selected Objectives Tag Cloud / Summary */}
            {allObjectiveLabels.length > 0 && (
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-default space-y-2">
                <div className="flex items-center justify-between text-[11.5px] text-text-tertiary">
                  <span>本次复盘将同时覆盖以下重点分析方向：</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedObjectiveIds([]);
                      setCustomObjectives([]);
                      setCustomInputText("");
                    }}
                    className="text-text-tertiary hover:text-red-600 transition-colors"
                  >
                    清空重选
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {/* Selected Preset Shortcuts */}
                  {OBJECTIVE_SHORTCUTS.filter(o => selectedObjectiveIds.includes(o.id)).map(opt => (
                    <span
                      key={opt.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-1 border border-btn-main text-btn-main rounded-lg text-[12px] font-medium shadow-2xs"
                    >
                      <Check size={12} strokeWidth={2.5} />
                      <span>{opt.title}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleShortcutObjective(opt.id)}
                        className="hover:text-red-500 ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {/* Custom Objective Tags */}
                  {customObjectives.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-1 border border-border-strong text-text-main rounded-lg text-[12px] font-medium shadow-2xs"
                    >
                      <Tag size={11} className="text-text-tertiary" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomObjective(tag)}
                        className="hover:text-red-500 ml-0.5 text-text-tertiary"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Input Box (Free text entry) */}
            <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-default space-y-2.5">
              <label className="block text-[12px] font-medium text-text-secondary">
                自由填入自定义目标 / 专项分析诉求
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="输入自定义目标（例如：排查夜间私信流失原因、分析金毛犬种ROI...）"
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomObjective();
                      }
                    }}
                    className="w-full px-3 py-1.5 bg-surface-1 border border-border-default rounded-lg text-[12.5px] outline-none focus:border-border-strong"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddCustomObjective()}
                  className="px-3 py-1.5 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
                >
                  <Plus size={13} />
                  <span>添加目标</span>
                </button>
              </div>

              {/* Quick suggestion pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-text-tertiary">快捷填入：</span>
                {QUICK_CUSTOM_SUGGESTIONS.map((sug) => {
                  const isAdded = customObjectives.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddCustomObjective(sug)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        isAdded
                          ? "bg-surface-subtle text-text-tertiary border-border-subtle cursor-default"
                          : "bg-surface-1 text-text-secondary hover:text-text-main border-border-default hover:bg-hover-bg"
                      }`}
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shortcut Objective Cards (Click to toggle / multi-select) */}
            <div className="space-y-2 pt-1">
              <label className="block text-[12px] font-medium text-text-secondary">
                常用目标快捷方式 <span className="text-text-tertiary font-normal">(点击卡片可多选)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OBJECTIVE_SHORTCUTS.map((opt) => {
                  const isSelected = selectedObjectiveIds.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleShortcutObjective(opt.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                        isSelected
                          ? "bg-surface-1 border-btn-main shadow-xs ring-1 ring-btn-main"
                          : "bg-surface-subtle border-border-default hover:bg-surface-1 hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isSelected ? "bg-btn-main text-white" : "bg-hover-bg text-text-secondary"}`}>
                            <Icon size={14} />
                          </div>
                          <span className="text-[13px] font-semibold text-text-main">{opt.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-surface-1 border border-border-default text-text-tertiary text-[10.5px] rounded">
                            {opt.recommendedFor}
                          </span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isSelected ? "bg-btn-main border-btn-main text-white" : "border-border-strong bg-surface-1"
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11.5px] text-text-secondary leading-relaxed">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

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
                className="w-full px-3 py-2 bg-surface-subtle border border-border-default rounded-lg text-[12px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors resize-none"
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
