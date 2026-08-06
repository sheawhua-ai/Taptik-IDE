import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  Paperclip,
  UploadCloud,
  Link as LinkIcon,
  FileText,
  File,
  Edit2,
  Check,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Lock,
  Search,
  Eye,
  SlidersHorizontal,
  Layers,
  Users,
  Target,
  ShieldAlert,
  ArrowLeft,
  RotateCcw,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "../../context/ProjectContext";

// --- Types ---
export interface Attachment {
  id: string;
  type: "file" | "link" | "text";
  name: string;
  aiRead?: boolean;
}

export interface TaskPreviewItem {
  id: string;
  role: "KOC" | "KOS/店长号" | "品牌主号";
  targetAudience: string;
  angle: string;
  coreMessage: string;
  form: string;
  keyword: string;
  plannedDate: string;
  hypothesis: string;
}

// 10 Preset Task Types
const TASK_TYPE_PRESETS = [
  { id: "cold_start", name: "新账号冷启动", desc: "快速建立初始信任与爆文卡位" },
  { id: "exposure", name: "品牌曝光", desc: "提升全网声量与破圈传播" },
  { id: "seeding", name: "新品种草", desc: "打造爆款卖点与真人口碑" },
  { id: "search_rank", name: "搜索卡位", desc: "占领核心搜推关键词首页" },
  { id: "co_creation", name: "用户共创", desc: "真实体验官招募与图文回传" },
  { id: "kol_koc", name: "KOL/KOC投放", desc: "矩阵化多梯队账号铺量" },
  { id: "growth", name: "内容增长", desc: "高完播高互动长尾流量捕获" },
  { id: "audit", name: "账号诊断", desc: "复盘低转化原因与优化人设" },
  { id: "monthly_plan", name: "月度内容规划", desc: "长效稳健的月度笔记排期" },
  { id: "custom", name: "自定义", desc: "自由设定专属运营目标" },
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
  const { addNewProject, batchGenerateProjectNotes } = useProjectStore();

  // Active step: 1 = 填写需求, 2 = 确认理解, 3 = 策略与排期, 4 = 创建项目
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // --- STEP 1 STATE ---
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>(["co_creation", "search_rank"]);
  const [intent, setIntent] = useState(
    "我们是一个宠物主粮新品牌，准备针对幼犬主人做一轮真实换粮共创。希望用两周时间验证换粮过程内容能否带来更多有效评论和咨询。计划邀请20位KOC、2位店长和品牌主号共同发布。"
  );
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "att-1", type: "file", name: "幼犬换粮竞品体验分析.pdf", aiRead: true },
    { id: "att-2", type: "text", name: "品牌产品成分与资质说明.txt", aiRead: true },
  ]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [isAnalyzingDemand, setIsAnalyzingDemand] = useState(false);

  // --- STEP 2 STATE (AI Understanding) ---
  const [basicInfo, setBasicInfo] = useState({
    brandName: "极宠研 (PETMORE)",
    productName: "幼犬无谷益生菌粮",
    category: "宠物主粮 / 犬粮",
    accountStage: "冷启动起量期",
    projectType: "换粮体验与搜索卡位",
    existingAccounts: "1个品牌主号 + 2家店长账号",
  });

  const [campaignGoals, setCampaignGoals] = useState({
    primary: "验证真实换粮过程体验能否增加与换粮方法相关的有效评论和咨询线索",
    secondary: "积累20篇真实KOC测评图文资产与2篇店长专业科普",
    userBehaviorChange: "从观望硬广转向主动询问科学换粮方案",
    successDefinition: "通过真实换粮内容增加与换粮方法相关的有效评论和咨询，验证该内容方向是否值得扩大。",
  });

  const [targetAudienceCards, setTargetAudienceCards] = useState([
    {
      id: "ta-1",
      name: "3-6个月新手幼犬养育者",
      scene: "幼犬刚进家门30天内，面临换粮择粮与腹泻软便担忧",
      painPoint: "换粮软便焦虑、对品牌纯营销广告不信任",
      expectation: "看到同类幼犬7天真实换粮日记与店长专业建议",
      barrier: "怕交智商税、担心肠胃严重不适",
      searchIntent: "搜索“幼犬换粮软便”、“幼犬粮推荐”、“科学换粮”",
      source: "AI建议" as "已确认" | "AI建议" | "待确认",
    },
  ]);

  const [resourcesAndConstraints, setResourcesAndConstraints] = useState({
    availableAccounts: "KOC 20个, 店长号 2个, 品牌主号 1个",
    teamCapacity: "日均可跟进审稿 5 篇",
    budget: "5,000 元",
    materialStatus: "已有4组实拍图片，缺2组视频素材",
    cycle: "14 天 (2 周)",
    complianceLimits: "严禁使用“100%根治软便”、“最顶级”等绝对方违禁词",
    forbiddenWords: "“某大牌平替”、“绝对不拉稀”、“药到病除”",
  });

  const [aiAssumptions, setAiAssumptions] = useState([
    {
      id: "as-1",
      content: "默认首轮以验证有效评论和咨询为主，不直接考核销售转化率。",
      whyNeeded: "冷启动初期建立信任闭环是核心，过早考核转化易导致硬广化，降低互动体验。",
      impactScope: "影响KOC考核指标与文案风向设置",
      confidence: "90%",
      status: "accepted" as "accepted" | "modified" | "deleted",
    },
    {
      id: "as-2",
      content: "默认KOC可以获得产品样品并完成7天真实体验记录。",
      whyNeeded: "真实过程体验是产生高信任度有效评论的基础",
      impactScope: "影响素材收集与排期发布节奏",
      confidence: "85%",
      status: "accepted" as "accepted" | "modified" | "deleted",
    },
  ]);

  // Blockers list (Only true blockers that prevent project creation)
  const [blockers, setBlockers] = useState<
    Array<{ id: string; title: string; impact: string; actionText: string }>
  >([]);

  // --- STEP 3 STATE (Strategy & Schedule) ---
  const [campaignThesis, setCampaignThesis] = useState(
    "真实、可追踪的换粮过程，比单纯介绍产品成分更容易引发幼犬主人的有效提问。"
  );

  const [positioning, setPositioning] = useState({
    oneSentence: "专为肠胃敏感幼犬打造的平稳过渡换粮方案",
    targetAudience: "3-6个月初次换粮的新手幼犬主人",
    valueProp: "7天透明真图实测 + 专业店长答疑支持",
    differentiation: "不讲枯燥成分，用日记式对比直击软便痛点",
    trustFactors: "20位同款幼犬铲屎官真实无滤镜过程跟拍",
  });

  // Content Pillars
  const [contentPillars, setContentPillars] = useState([
    {
      id: "cp-1",
      name: "真实体验日记",
      solvedProblem: "解决幼犬换粮软便焦虑与真实效果疑虑",
      role: "KOC 消费者共创",
      ratio: 50,
      representative: "【第3天换粮记录】家里小金毛终于不拉软便了，附实拍饭碗",
      metric: "高意向评论率与收藏量",
    },
    {
      id: "cp-2",
      name: "店长专业避坑指南",
      solvedProblem: "解决科学换粮方法缺失与疑难肠胃提问",
      role: "KOS / 店长号",
      ratio: 30,
      representative: "幼犬换粮总是拉肚子？店长教你避坑七日换粮法",
      metric: "有效咨询量与私信引导数",
    },
    {
      id: "cp-3",
      name: "品牌信任与搜索卡位",
      solvedProblem: "解决品牌资质信任与搜索拦截",
      role: "品牌主号",
      ratio: 20,
      representative: "【官方换粮计划】极宠研幼犬换粮体验官实测汇总",
      metric: "搜索关键词卡位与曝光数",
    },
  ]);

  // Account Roles
  const [accountRoles, setAccountRoles] = useState({
    kocCount: 20,
    kosCount: 2,
    brandCount: 1,
  });

  // Dates
  const [scheduleDates, setScheduleDates] = useState({
    startDate: "2026-08-01",
    endDate: "2026-08-15",
    validationDate: "2026-08-05",
    midtermReviewDate: "2026-08-10",
  });

  // Validation Plan
  const [validationPlan, setValidationPlan] = useState({
    hypothesis: "真实换粮日记比产品说明内容更容易获得与换粮方法相关的有效评论。",
    participatingContent: "第一批 5 篇 KOC 换粮日记 + 1 篇店长号科普",
    metric: "高意向评论率 > 8%，单篇获得 > 5 条相关提问",
    threshold: "观察周期 3 天",
    scaleAction: "当真实记录类内容显著领先时，第二波增加其内容占比至 70%",
    adjustAction: "差异不明显时，调整首图爆点钩子与前3秒痛点场景",
    stopAction: "CPA > 100元或连续2周无有效咨询线索时暂停或重新评估",
  });

  // Modals & Drawers state
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showContractDrawer, setShowContractDrawer] = useState(false);
  const [showProductFactModal, setShowProductFactModal] = useState(false);
  const [showImpactLockModal, setShowImpactLockModal] = useState(false);
  const [acceptRiskCheckbox, setAcceptRiskCheckbox] = useState(false);

  // --- STEP 4 STATE (Creating progress & completion) ---
  const [creationPhaseIndex, setCreationPhaseIndex] = useState(0);
  const [isCreatingProgress, setIsCreatingProgress] = useState(false);
  const [createdProjectResult, setCreatedProjectResult] = useState<any>(null);

  const creationPhases = [
    "创建项目基本结构 (project)",
    "写入项目策略契约 (strategy_contract)",
    "建立内容支柱与策略规则 (content_pillars)",
    "批量生成 23 个内容任务 (tasks)",
    "检查角色与数量配比 (KOC 20 / KOS 2 / 品牌 1)",
    "校验排期与发布波次 (wave_schedule)",
    "检查品牌合规与词库规则 (quality_gate)",
    "项目完成并入库！",
  ];

  // Total Notes calculation
  const totalNotes =
    Number(accountRoles.kocCount || 0) +
    Number(accountRoles.kosCount || 0) +
    Number(accountRoles.brandCount || 0);

  // Generated 23 Sample Tasks
  const sampleTasksList: TaskPreviewItem[] = [
    {
      id: "t-1",
      role: "KOS/店长号",
      targetAudience: "3-6个月新手幼犬养育者",
      angle: "科学换粮方法普及与避坑FAQ",
      coreMessage: "严格遵循七日换粮法，配方益生菌科学过渡",
      form: "科普图文",
      keyword: "幼犬换粮",
      plannedDate: "2026-08-01",
      hypothesis: "验证专业解释能否建立信任闭环",
    },
    {
      id: "t-2",
      role: "KOC",
      targetAudience: "肠胃敏感幼犬主",
      angle: "真实换粮第1天接粮过程实拍",
      coreMessage: "颗粒适口性良好，幼犬主动进食",
      form: "真人实拍图文",
      keyword: "幼犬换粮软便",
      plannedDate: "2026-08-01",
      hypothesis: "验证真实过程比宣传单更有吸引力",
    },
    {
      id: "t-3",
      role: "KOC",
      targetAudience: "新手养狗铲屎官",
      angle: "真实换粮第3天便便成型对比",
      coreMessage: "没有拉软便拉稀，粑粑形状很好",
      form: "对比图文",
      keyword: "科学换粮",
      plannedDate: "2026-08-02",
      hypothesis: "验证硬核成型对比图能否产生有效提问",
    },
    {
      id: "t-4",
      role: "KOC",
      targetAudience: "挑食幼犬主人",
      angle: "换粮第5天精神状态与食欲记录",
      coreMessage: "适口性佳，幼犬光盘无剩余",
      form: "日常Vlog图文",
      keyword: "幼犬粮推荐",
      plannedDate: "2026-08-03",
      hypothesis: "验证真实生活场景能否触发种草意向",
    },
    {
      id: "t-5",
      role: "品牌主号",
      targetAudience: "全网精准搜推潜客",
      angle: "【官方倡议】幼犬换粮体验官7天无软便记录汇总",
      coreMessage: "品牌质检报告与体验官招募",
      form: "品牌长图文",
      keyword: "极宠研幼犬粮",
      plannedDate: "2026-08-05",
      hypothesis: "验证搜索卡位与权威背书承接",
    },
  ];

  // --- HANDLERS ---
  const handleNextFromStep1 = () => {
    if (!intent.trim() && attachments.length === 0) return;
    setIsAnalyzingDemand(true);
    setTimeout(() => {
      setIsAnalyzingDemand(false);
      setCompletedSteps((prev) => Array.from(new Set([...prev, 1])));
      setCurrentStep(2);
    }, 1000);
  };

  const handleNextFromStep2 = () => {
    if (blockers.length > 0) {
      // Scroll to blockers section
      const el = document.getElementById("blockers-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setCompletedSteps((prev) => Array.from(new Set([...prev, 1, 2])));
    setCurrentStep(3);
  };

  const handleCreateProjectStep4 = () => {
    setCurrentStep(4);
    setIsCreatingProgress(true);
    setCreationPhaseIndex(0);

    // Simulate progress sequence
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < creationPhases.length) {
        setCreationPhaseIndex(idx);
      } else {
        clearInterval(interval);
        setIsCreatingProgress(false);

        // Build full project & strategy contract
        const strategyContractObj = {
          campaign_thesis: campaignThesis,
          positioning,
          contentPillars,
          accountRoles,
          validationPlan,
          compliance: resourcesAndConstraints.complianceLimits,
          forbiddenWords: resourcesAndConstraints.forbiddenWords,
          lockedRules: [
            "必须围绕真实换粮7天过程记录开展",
            "禁止使用100%绝对方违禁词",
            "KOS号必须附上专业检测证据",
            "品牌号承担官方搜索拦截与引导",
          ],
        };

        const newProj = addNewProject({
          name: basicInfo.brandName + " - " + basicInfo.projectType,
          goal: campaignGoals.primary,
          status: "准备中",
          startDate: scheduleDates.startDate,
          endDate: scheduleDates.endDate,
          budget: resourcesAndConstraints.budget,
          strategyProtocol: strategyContractObj,
          landingPageSettings: {
            loginMode: "无需登录",
            posterTitle: `${basicInfo.brandName} - 换粮体验官与内容投稿`,
            bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
          },
        });

        // Batch generate the 23 notes
        const generatedNotes = Array.from({ length: totalNotes }).map((_, i) => {
          let type: "KOC" | "店长号/KOS" | "品牌主号" = "KOC";
          let accountName = `体验官_KOC_${i + 1}`;
          let title = `【幼犬换粮记】第${(i % 7) + 1}天真实体验分享`;
          let dir = "真实换粮日记";

          if (i >= accountRoles.kocCount && i < accountRoles.kocCount + accountRoles.kosCount) {
            type = "店长号/KOS";
            accountName = `店长号_旗舰店${i - accountRoles.kocCount + 1}`;
            title = "幼犬换粮总是拉肚子？店长教你避坑七日换粮法";
            dir = "科学换粮指南";
          } else if (i >= accountRoles.kocCount + accountRoles.kosCount) {
            type = "品牌主号";
            accountName = "极宠研官方旗舰店";
            title = "【官方体验官】幼犬换粮测评结果公布";
            dir = "品牌信任承接";
          }

          return {
            title,
            accountType: type,
            accountName,
            contentDirection: dir,
            plannedDate: scheduleDates.startDate,
            body: `继承项目策略：${campaignThesis}\n针对人群：${positioning.targetAudience}\n核心诉求：${campaignGoals.primary}`,
          };
        });

        batchGenerateProjectNotes(newProj, generatedNotes);
        setCreatedProjectResult({
          id: newProj,
          name: basicInfo.brandName + " - " + basicInfo.projectType,
          startDate: scheduleDates.startDate,
          endDate: scheduleDates.endDate,
          totalTasks: totalNotes,
          kocCount: accountRoles.kocCount,
          kosCount: accountRoles.kosCount,
          brandCount: accountRoles.brandCount,
          validationDate: scheduleDates.validationDate,
          firstTask: "【KOS/店长号】幼犬换粮总是拉肚子？店长教你避坑七日换粮法",
        });
      }
    }, 280);
  };

  const handleStepClick = (stepNum: 1 | 2 | 3 | 4) => {
    if (stepNum <= currentStep || completedSteps.includes(stepNum)) {
      setCurrentStep(stepNum);
    }
  };

  return (
    <div className="h-full w-full bg-[#f8f9fa] flex flex-col relative text-neutral-900 font-sans">
      {/* 1. TOP HEADER & STEP INDICATOR */}
      <div className="h-16 bg-white border-b border-neutral-200/90 flex items-center justify-between px-6 shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="关闭"
          >
            <X size={18} />
          </button>
          <div className="h-4 w-px bg-neutral-200" />
          <h1 className="text-[15px] font-bold text-neutral-900 tracking-tight">
            创建小红书运营项目
          </h1>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { stepNum: 1, label: "填写需求" },
            { stepNum: 2, label: "确认理解" },
            { stepNum: 3, label: "策略与排期" },
            { stepNum: 4, label: "创建项目" },
          ].map((item, index) => {
            const isCurrent = currentStep === item.stepNum;
            const isCompleted = completedSteps.includes(item.stepNum) || currentStep > item.stepNum;

            return (
              <React.Fragment key={item.stepNum}>
                {index > 0 && (
                  <ChevronRight size={14} className="text-neutral-300 shrink-0" />
                )}
                <button
                  onClick={() => handleStepClick(item.stepNum as any)}
                  disabled={!isCompleted && !isCurrent}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[13px] font-medium transition-all ${
                    isCurrent
                      ? "bg-neutral-900 text-white font-bold shadow-xs"
                      : isCompleted
                      ? "bg-neutral-100 text-neutral-800 hover:bg-neutral-200/80 cursor-pointer"
                      : "text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? "bg-white text-neutral-900"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {isCompleted && !isCurrent ? <Check size={10} /> : item.stepNum}
                  </span>
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="w-24 text-right">
          {currentStep > 1 && currentStep < 4 && (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
            >
              返回上一步
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER AREA */}
      <div className="flex-1 overflow-y-auto relative">
        {/* STEP 1: 填写需求 */}
        {currentStep === 1 && (
          <Step1DemandView
            selectedTaskTypes={selectedTaskTypes}
            setSelectedTaskTypes={setSelectedTaskTypes}
            intent={intent}
            setIntent={setIntent}
            attachments={attachments}
            setAttachments={setAttachments}
            onOpenAddMaterial={() => setShowAddMaterial(true)}
            onNext={handleNextFromStep1}
            isAnalyzing={isAnalyzingDemand}
          />
        )}

        {/* STEP 2: 确认AI理解 */}
        {currentStep === 2 && (
          <Step2UnderstandingView
            basicInfo={basicInfo}
            setBasicInfo={setBasicInfo}
            campaignGoals={campaignGoals}
            setCampaignGoals={setCampaignGoals}
            targetAudienceCards={targetAudienceCards}
            setTargetAudienceCards={setTargetAudienceCards}
            resourcesAndConstraints={resourcesAndConstraints}
            setResourcesAndConstraints={setResourcesAndConstraints}
            aiAssumptions={aiAssumptions}
            setAiAssumptions={setAiAssumptions}
            blockers={blockers}
            setBlockers={setBlockers}
            onBack={() => setCurrentStep(1)}
            onNext={handleNextFromStep2}
            onOpenProductFactModal={() => setShowProductFactModal(true)}
          />
        )}

        {/* STEP 3: 策略与排期 */}
        {currentStep === 3 && (
          <Step3StrategyScheduleView
            campaignThesis={campaignThesis}
            setCampaignThesis={setCampaignThesis}
            campaignGoals={campaignGoals}
            positioning={positioning}
            setPositioning={setPositioning}
            contentPillars={contentPillars}
            setContentPillars={setContentPillars}
            accountRoles={accountRoles}
            setAccountRoles={setAccountRoles}
            scheduleDates={scheduleDates}
            setScheduleDates={setScheduleDates}
            validationPlan={validationPlan}
            setValidationPlan={setValidationPlan}
            totalNotes={totalNotes}
            sampleTasksList={sampleTasksList}
            blockers={blockers}
            acceptRiskCheckbox={acceptRiskCheckbox}
            setAcceptRiskCheckbox={setAcceptRiskCheckbox}
            onOpenTasksModal={() => setShowTasksModal(true)}
            onOpenContractDrawer={() => setShowContractDrawer(true)}
            onOpenImpactModal={() => setShowImpactLockModal(true)}
            onSaveDraft={onClose}
            onCreateProject={handleCreateProjectStep4}
          />
        )}

        {/* STEP 4: 创建项目 (Progress & Complete) */}
        {currentStep === 4 && (
          <Step4CreatingView
            isProgress={isCreatingProgress}
            phaseIndex={creationPhaseIndex}
            phases={creationPhases}
            result={createdProjectResult}
            onEnterProject={() => {
              if (createdProjectResult?.id) {
                onCreate({ id: createdProjectResult.id });
              }
              onClose();
            }}
            onViewStrategy={() => {
              if (createdProjectResult?.id) {
                onCreate({ id: createdProjectResult.id, openStrategy: true });
              }
              onClose();
            }}
          />
        )}
      </div>

      {/* AUXILIARY MODALS & DRAWERS */}
      <AnimatePresence>
        {/* Add Material Modal */}
        {showAddMaterial && (
          <AddMaterialModal
            onClose={() => setShowAddMaterial(false)}
            onAdd={(item) => setAttachments((prev) => [...prev, item])}
          />
        )}

        {/* Tasks Preview Modal */}
        {showTasksModal && (
          <AllTasksPreviewModal
            totalNotes={totalNotes}
            accountRoles={accountRoles}
            sampleTasksList={sampleTasksList}
            onClose={() => setShowTasksModal(false)}
          />
        )}

        {/* Strategy Contract Drawer */}
        {showContractDrawer && (
          <StrategyContractDrawer
            campaignThesis={campaignThesis}
            positioning={positioning}
            contentPillars={contentPillars}
            accountRoles={accountRoles}
            validationPlan={validationPlan}
            resourcesAndConstraints={resourcesAndConstraints}
            onClose={() => setShowContractDrawer(false)}
          />
        )}

        {/* Add Product Fact Blocker Modal */}
        {showProductFactModal && (
          <AddProductFactModal
            onClose={() => setShowProductFactModal(false)}
            onSuccess={() => {
              setBlockers([]);
              setShowProductFactModal(false);
            }}
          />
        )}

        {/* Impact Warning Lock Modal */}
        {showImpactLockModal && (
          <ImpactLockWarningModal
            onClose={() => setShowImpactLockModal(false)}
            affectedCount={totalNotes}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// STEP 1: 填写需求 View
// =========================================================================
function Step1DemandView({
  selectedTaskTypes,
  setSelectedTaskTypes,
  intent,
  setIntent,
  attachments,
  setAttachments,
  onOpenAddMaterial,
  onNext,
  isAnalyzing,
}: {
  selectedTaskTypes: string[];
  setSelectedTaskTypes: React.Dispatch<React.SetStateAction<string[]>>;
  intent: string;
  setIntent: (s: string) => void;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  onOpenAddMaterial: () => void;
  onNext: () => void;
  isAnalyzing: boolean;
}) {
  const toggleTaskType = (id: string) => {
    setSelectedTaskTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleAppendPrompt = (label: string) => {
    const promptMap: Record<string, string> = {
      "品牌／产品": "\n【品牌/产品】：极宠研 幼犬无谷益生菌粮",
      "目标用户": "\n【目标用户】：3-6个月新手幼犬养育者",
      "本轮目标": "\n【本轮目标】：两周内通过真实换粮过程内容获得更多有效评论和咨询",
      "项目周期": "\n【项目周期】：2周 (14天)",
      "内容数量": "\n【内容数量】：20篇KOC + 2篇店长号 + 1篇品牌号",
      "预算和资源": "\n【预算和资源】：预算5000元，包含产品赠品",
      "限制条件": "\n【限制条件】：禁止使用违禁根治类词汇",
    };
    setIntent(intent + (promptMap[label] || `\n【${label}】：`));
  };

  const isButtonDisabled = !intent.trim() && attachments.length === 0;

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-6 pb-20 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-[22px] font-extrabold text-neutral-900 tracking-tight">
          创建小红书运营项目
        </h1>
        <h2 className="text-[17px] font-bold text-neutral-800 mt-1">
          这轮小红书运营，想解决什么问题？
        </h2>
        <p className="text-[13px] text-neutral-500 mt-1">
          告诉我们品牌、产品、目标、人群和周期，AI会先整理需求，再与你确认项目策略。
        </p>
      </div>

      {/* Task Type Cards (Multi-select) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[13px] font-bold text-neutral-800">
            选择运营任务类型 <span className="text-[11px] font-normal text-neutral-400">(可多选)</span>
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {TASK_TYPE_PRESETS.map((preset) => {
            const isSelected = selectedTaskTypes.includes(preset.id);
            return (
              <button
                key={preset.id}
                onClick={() => toggleTaskType(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                    : "bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold">{preset.name}</span>
                  {isSelected && <Check size={14} className="text-emerald-400" />}
                </div>
                <p
                  className={`text-[11px] line-clamp-1 ${
                    isSelected ? "text-neutral-300" : "text-neutral-400"
                  }`}
                >
                  {preset.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Input Box Area */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all flex flex-col min-h-[220px]">
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="例如：我们是一个宠物主粮新品牌，准备针对幼犬主人做一轮真实换粮共创。希望用两周时间验证换粮过程内容能否带来更多有效评论和咨询。计划邀请20位KOC、2位店长和品牌主号共同发布。"
          className="w-full flex-1 resize-none outline-none p-5 text-[14px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 font-normal min-h-[140px]"
        />

        {/* Guide Pills below Input */}
        <div className="px-5 py-2.5 border-t border-neutral-100 bg-neutral-50/40 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-neutral-400">快速插入引导：</span>
          {[
            "品牌／产品",
            "目标用户",
            "本轮目标",
            "项目周期",
            "内容数量",
            "预算和资源",
            "限制条件",
          ].map((label) => (
            <button
              key={label}
              onClick={() => handleAppendPrompt(label)}
              className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[12px] font-medium text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-colors shadow-2xs"
            >
              + {label}
            </button>
          ))}
        </div>

        {/* Added Material Chips */}
        {attachments.length > 0 && (
          <div className="px-5 py-2.5 border-t border-neutral-100 flex flex-wrap gap-2 bg-neutral-50/70">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[12px] text-neutral-700 shadow-2xs"
              >
                {att.type === "file" && <File size={13} className="text-neutral-500" />}
                {att.type === "link" && <LinkIcon size={13} className="text-neutral-500" />}
                {att.type === "text" && <FileText size={13} className="text-neutral-500" />}
                <span className="font-medium max-w-[200px] truncate">{att.name}</span>
                {att.aiRead && (
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                    AI已读取
                  </span>
                )}
                <button
                  onClick={() =>
                    setAttachments((prev) => prev.filter((a) => a.id !== att.id))
                  }
                  className="text-neutral-400 hover:text-neutral-700 ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Toolbar inside Input Box */}
        <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <button
            onClick={onOpenAddMaterial}
            className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-100"
          >
            <Paperclip size={15} />
            <span>添加项目资料</span>
          </button>

          <button
            onClick={onNext}
            disabled={isButtonDisabled || isAnalyzing}
            className="px-7 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-xs"
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={15} className="animate-spin text-neutral-300" />
                <span>AI正在整理需求…</span>
              </>
            ) : (
              <>
                <span>让AI整理需求</span>
                <Sparkles size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {isButtonDisabled && (
        <p className="text-[12px] text-amber-600 bg-amber-50 border border-amber-200/80 px-3 py-2 rounded-xl inline-block">
          💡 请先描述本轮运营需求或添加项目资料，AI将开始整理。
        </p>
      )}

      {/* Project Materials Info Banner */}
      <div className="p-4 bg-white border border-neutral-200/90 rounded-2xl">
        <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-800 mb-1">
          <UploadCloud size={16} className="text-neutral-500" />
          <span>资料补充支持类型</span>
        </div>
        <p className="text-[12px] text-neutral-500 leading-relaxed">
          支持包含：产品资料、品牌手册、历史笔记、竞品案例、用户评论、运营数据、合规资料、图片与视频素材等。
        </p>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 2: 确认AI理解 View
// =========================================================================
function Step2UnderstandingView({
  basicInfo,
  setBasicInfo,
  campaignGoals,
  setCampaignGoals,
  targetAudienceCards,
  setTargetAudienceCards,
  resourcesAndConstraints,
  setResourcesAndConstraints,
  aiAssumptions,
  setAiAssumptions,
  blockers,
  setBlockers,
  onBack,
  onNext,
  onOpenProductFactModal,
}: {
  basicInfo: any;
  setBasicInfo: React.Dispatch<React.SetStateAction<any>>;
  campaignGoals: any;
  setCampaignGoals: React.Dispatch<React.SetStateAction<any>>;
  targetAudienceCards: any[];
  setTargetAudienceCards: React.Dispatch<React.SetStateAction<any[]>>;
  resourcesAndConstraints: any;
  setResourcesAndConstraints: React.Dispatch<React.SetStateAction<any>>;
  aiAssumptions: any[];
  setAiAssumptions: React.Dispatch<React.SetStateAction<any[]>>;
  blockers: any[];
  setBlockers: React.Dispatch<React.SetStateAction<any[]>>;
  onBack: () => void;
  onNext: () => void;
  onOpenProductFactModal: () => void;
}) {
  const [editingAudience, setEditingAudience] = useState<string | null>(null);

  const confirmAudienceCard = (id: string) => {
    setTargetAudienceCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, source: "已确认" } : c))
    );
  };

  const deleteAudienceCard = (id: string) => {
    setTargetAudienceCards((prev) => prev.filter((c) => c.id !== id));
  };

  const updateAssumptionStatus = (id: string, status: "accepted" | "modified" | "deleted") => {
    setAiAssumptions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-6 pb-28 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">
            确认AI对项目的理解
          </h1>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded">
            已整理完毕
          </span>
        </div>
        <p className="text-[13px] text-neutral-500 mt-1">
          请确认以下信息。AI建议和假设可以修改，确认后将用于生成项目策略。
        </p>
      </div>

      {/* Source Status Legend */}
      <div className="flex items-center gap-4 bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-[12px]">
        <span className="font-bold text-neutral-600">信息来源与标识：</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
          <Check size={12} /> 已确认
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded font-bold">
          <Sparkles size={12} /> AI建议 (可修改)
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold">
          待确认
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-bold">
          <AlertTriangle size={12} /> 阻断项 (需补充)
        </span>
      </div>

      {/* 1. 项目基础信息 */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
            <span>1. 项目基础信息</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded">
              已确认
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[13px]">
          <div>
            <label className="text-[12px] font-bold text-neutral-500">品牌名称</label>
            <input
              type="text"
              value={basicInfo.brandName}
              onChange={(e) => setBasicInfo({ ...basicInfo, brandName: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold text-neutral-500">产品名称</label>
            <input
              type="text"
              value={basicInfo.productName}
              onChange={(e) => setBasicInfo({ ...basicInfo, productName: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold text-neutral-500">所属品类</label>
            <input
              type="text"
              value={basicInfo.category}
              onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold text-neutral-500">账号阶段</label>
            <input
              type="text"
              value={basicInfo.accountStage}
              onChange={(e) => setBasicInfo({ ...basicInfo, accountStage: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold text-neutral-500">项目类型</label>
            <input
              type="text"
              value={basicInfo.projectType}
              onChange={(e) => setBasicInfo({ ...basicInfo, projectType: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold text-neutral-500">已有账号或素材</label>
            <input
              type="text"
              value={basicInfo.existingAccounts}
              onChange={(e) => setBasicInfo({ ...basicInfo, existingAccounts: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* 2. 本轮目标 */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
            <span>2. 本轮目标</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded">
              已确认
            </span>
          </h2>
        </div>

        <div className="space-y-3 text-[13px]">
          <div>
            <span className="text-[12px] font-bold text-neutral-500">主要目标：</span>
            <input
              type="text"
              value={campaignGoals.primary}
              onChange={(e) => setCampaignGoals({ ...campaignGoals, primary: e.target.value })}
              className="w-full mt-1 px-3 py-1.5 border border-neutral-200 rounded-lg font-medium text-neutral-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[12px] font-bold text-neutral-500">次要目标：</span>
              <p className="font-medium text-neutral-800 mt-0.5">{campaignGoals.secondary}</p>
            </div>
            <div>
              <span className="text-[12px] font-bold text-neutral-500">期望改变的用户行为：</span>
              <p className="font-medium text-neutral-800 mt-0.5">{campaignGoals.userBehaviorChange}</p>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <span className="text-[12px] font-bold text-neutral-600">项目成功的定义：</span>
            <p className="font-bold text-neutral-900 mt-1 leading-relaxed">
              “{campaignGoals.successDefinition}”
            </p>
          </div>
        </div>
      </div>

      {/* 3. 目标用户 (卡片形式) */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-[15px] font-bold text-neutral-900">3. 目标用户</h2>
        </div>

        <div className="space-y-3">
          {targetAudienceCards.map((card) => (
            <div
              key={card.id}
              className="bg-neutral-50/70 border border-neutral-200/90 rounded-xl p-4 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-neutral-900">{card.name}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                      card.source === "已确认"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                    }`}
                  >
                    {card.source}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {card.source === "AI建议" && (
                    <button
                      onClick={() => confirmAudienceCard(card.id)}
                      className="px-2.5 py-1 bg-sky-600 text-white rounded-lg text-[11px] font-bold hover:bg-sky-700 transition-colors"
                    >
                      确认接受
                    </button>
                  )}
                  <button
                    onClick={() => deleteAudienceCard(card.id)}
                    className="text-neutral-400 hover:text-neutral-700 text-[11px]"
                  >
                    删除
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px] text-neutral-700">
                <div>
                  <span className="font-bold text-neutral-500">生活场景：</span>
                  {card.scene}
                </div>
                <div>
                  <span className="font-bold text-neutral-500">核心痛点：</span>
                  {card.painPoint}
                </div>
                <div>
                  <span className="font-bold text-neutral-500">主要期待：</span>
                  {card.expectation}
                </div>
                <div>
                  <span className="font-bold text-neutral-500">决策障碍：</span>
                  {card.barrier}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-bold text-neutral-500">搜索意图：</span>
                  {card.searchIntent}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 资源与限制 */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
            <span>4. 资源与限制</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded">
              已确认
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <span className="font-bold text-neutral-500 block">可用账号</span>
            <span className="font-bold text-neutral-900 text-[13px]">{resourcesAndConstraints.availableAccounts}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <span className="font-bold text-neutral-500 block">团队产能</span>
            <span className="font-bold text-neutral-900 text-[13px]">{resourcesAndConstraints.teamCapacity}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <span className="font-bold text-neutral-500 block">预算</span>
            <span className="font-bold text-neutral-900 text-[13px]">{resourcesAndConstraints.budget}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <span className="font-bold text-neutral-500 block">项目周期</span>
            <span className="font-bold text-neutral-900 text-[13px]">{resourcesAndConstraints.cycle}</span>
          </div>
        </div>

        <div className="text-[12px] space-y-2 pt-1">
          <div>
            <span className="font-bold text-neutral-700">合规限制：</span>
            <span className="text-neutral-600">{resourcesAndConstraints.complianceLimits}</span>
          </div>
          <div>
            <span className="font-bold text-neutral-700">不希望出现的表达：</span>
            <span className="text-neutral-600">{resourcesAndConstraints.forbiddenWords}</span>
          </div>
        </div>
      </div>

      {/* 5. AI假设 */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
            <span>5. AI假设</span>
            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold rounded">
              推断依据
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {aiAssumptions.map((ass) => (
            <div
              key={ass.id}
              className={`p-4 rounded-xl border transition-all ${
                ass.status === "accepted"
                  ? "bg-white border-neutral-200"
                  : ass.status === "deleted"
                  ? "bg-neutral-100/50 border-neutral-200 opacity-50 line-through"
                  : "bg-sky-50/40 border-sky-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-neutral-900">{ass.content}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 font-bold text-neutral-600 rounded">
                      置信度: {ass.confidence}
                    </span>
                  </div>
                  <p className="text-[12px] text-neutral-600">Why：{ass.whyNeeded}</p>
                  <p className="text-[11px] text-neutral-500">影响：{ass.impactScope}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {ass.status !== "accepted" ? (
                    <button
                      onClick={() => updateAssumptionStatus(ass.id, "accepted")}
                      className="px-2.5 py-1 bg-neutral-900 text-white rounded-lg text-[11px] font-bold hover:bg-neutral-800"
                    >
                      接受
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <Check size={12} /> 已接受
                    </span>
                  )}
                  {ass.status !== "deleted" && (
                    <button
                      onClick={() => updateAssumptionStatus(ass.id, "deleted")}
                      className="px-2.5 py-1 border border-neutral-200 text-neutral-500 rounded-lg text-[11px] font-medium hover:text-neutral-800"
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 阻断项 (Blockers Section) */}
      <div id="blockers-section">
        {blockers.length > 0 ? (
          <div className="bg-red-50/80 border border-red-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-bold text-[14px]">
              <AlertTriangle size={18} className="text-red-600 shrink-0" />
              <span>本轮发现 {blockers.length} 项需补充的阻断项</span>
            </div>
            <p className="text-[12px] text-red-800">
              阻断项会导致 AI 无法生成精准的小红书合规文案或核心成分调用的事实依据，补全后即可继续。
            </p>

            {blockers.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-red-200 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-[13px] font-bold text-red-950">{b.title}</div>
                  <div className="text-[12px] text-neutral-600 mt-0.5">影响：{b.impact}</div>
                </div>
                <button
                  onClick={onOpenProductFactModal}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-[12px] font-bold hover:bg-red-700 transition-colors shrink-0 shadow-xs"
                >
                  {b.actionText}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between text-[12px] text-emerald-800">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              无阻断项，信息已准备就绪，可以生成策略草案。
            </span>
          </div>
        )}
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 z-30 flex items-center justify-between px-8 max-w-[1100px] mx-auto rounded-t-2xl shadow-lg">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100"
        >
          返回修改需求
        </button>

        <button
          onClick={onNext}
          className={`px-8 py-2.5 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2 shadow-xs ${
            blockers.length > 0
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          <span>{blockers.length > 0 ? `补全 ${blockers.length} 项关键信息` : "确认需求，生成策略草案"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 3: 确认策略与排期 View
// =========================================================================
function Step3StrategyScheduleView({
  campaignThesis,
  setCampaignThesis,
  campaignGoals,
  positioning,
  setPositioning,
  contentPillars,
  setContentPillars,
  accountRoles,
  setAccountRoles,
  scheduleDates,
  setScheduleDates,
  validationPlan,
  setValidationPlan,
  totalNotes,
  sampleTasksList,
  blockers,
  acceptRiskCheckbox,
  setAcceptRiskCheckbox,
  onOpenTasksModal,
  onOpenContractDrawer,
  onOpenImpactModal,
  onSaveDraft,
  onCreateProject,
}: {
  campaignThesis: string;
  setCampaignThesis: (s: string) => void;
  campaignGoals: any;
  positioning: any;
  setPositioning: React.Dispatch<React.SetStateAction<any>>;
  contentPillars: any[];
  setContentPillars: React.Dispatch<React.SetStateAction<any[]>>;
  accountRoles: any;
  setAccountRoles: React.Dispatch<React.SetStateAction<any>>;
  scheduleDates: any;
  setScheduleDates: React.Dispatch<React.SetStateAction<any>>;
  validationPlan: any;
  setValidationPlan: React.Dispatch<React.SetStateAction<any>>;
  totalNotes: number;
  sampleTasksList: TaskPreviewItem[];
  blockers: any[];
  acceptRiskCheckbox: boolean;
  setAcceptRiskCheckbox: (b: boolean) => void;
  onOpenTasksModal: () => void;
  onOpenContractDrawer: () => void;
  onOpenImpactModal: () => void;
  onSaveDraft: () => void;
  onCreateProject: () => void;
}) {
  const [isEditingThesis, setIsEditingThesis] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-6 pb-28">
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">
          确认本轮策略与任务安排
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          以下内容将成为整个项目的指导。项目创建后，所有笔记和执行任务都会继承这些规则。
        </p>
      </div>

      {/* Dual Column Layout: Left 65%, Right 35% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (65%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. 项目核心命题 */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Target size={12} /> strategy_contract.campaign_thesis (项目核心命题)
              </span>
              <button
                onClick={() => setIsEditingThesis(!isEditingThesis)}
                className="text-[12px] font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit2 size={12} />
                <span>{isEditingThesis ? "完成编辑" : "编辑命题"}</span>
              </button>
            </div>

            {isEditingThesis ? (
              <textarea
                value={campaignThesis}
                onChange={(e) => setCampaignThesis(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-xl text-[14px] font-bold text-neutral-900 outline-none leading-relaxed"
              />
            ) : (
              <p className="text-[15px] font-extrabold text-neutral-900 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 leading-relaxed">
                “{campaignThesis}”
              </p>
            )}
          </div>

          {/* 2. 定位与用户 (锁定) */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h2 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                <span>定位与用户</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold rounded flex items-center gap-1">
                  <Lock size={10} /> 项目级锁定
                </span>
              </h2>
              <button
                onClick={onOpenImpactModal}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
              >
                修改提示
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              <div>
                <span className="font-bold text-neutral-500">一句话定位：</span>
                <p className="font-bold text-neutral-900 mt-0.5">{positioning.oneSentence}</p>
              </div>
              <div>
                <span className="font-bold text-neutral-500">目标用户：</span>
                <p className="font-bold text-neutral-900 mt-0.5">{positioning.targetAudience}</p>
              </div>
              <div>
                <span className="font-bold text-neutral-500">价值主张：</span>
                <p className="font-medium text-neutral-800 mt-0.5">{positioning.valueProp}</p>
              </div>
              <div>
                <span className="font-bold text-neutral-500">信任依据：</span>
                <p className="font-medium text-neutral-800 mt-0.5">{positioning.trustFactors}</p>
              </div>
            </div>
          </div>

          {/* 3. 内容支柱 */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h2 className="text-[14px] font-bold text-neutral-900">内容支柱 (Content Pillars)</h2>
              <span className="text-[11px] text-neutral-400">比例允许调配，基于品牌诊断算法推荐</span>
            </div>

            <div className="space-y-3">
              {contentPillars.map((pillar) => (
                <div key={pillar.id} className="p-3.5 bg-neutral-50/80 border border-neutral-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-neutral-900">{pillar.name}</span>
                      <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-bold text-neutral-600 rounded">
                        角色: {pillar.role}
                      </span>
                    </div>
                    <span className="text-[13px] font-extrabold text-neutral-900">{pillar.ratio}%</span>
                  </div>
                  <p className="text-[12px] text-neutral-600">解决痛点：{pillar.solvedProblem}</p>
                  <p className="text-[11px] text-neutral-500">衡量指标：{pillar.metric}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 账号角色分工 */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h2 className="text-[14px] font-bold text-neutral-900">账号角色分工</h2>
              <span className="text-[12px] font-bold text-neutral-700">
                实时校验：KOC {accountRoles.kocCount}篇 + KOS {accountRoles.kosCount}篇 + 品牌号 {accountRoles.brandCount}篇 = 共 {totalNotes} 篇
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* KOC */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-neutral-900">KOC 消费者共创</span>
                  <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded px-2 py-0.5">
                    <input
                      type="number"
                      value={accountRoles.kocCount}
                      onChange={(e) =>
                        setAccountRoles({ ...accountRoles, kocCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-10 text-center font-bold outline-none text-[12px]"
                    />
                    <span className="text-[10px] text-neutral-400">篇</span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-600 space-y-1">
                  <p><strong>主要职责：</strong>真实记录7天换粮过程</p>
                  <p><strong>推荐语气：</strong>接地气体验感分享</p>
                  <p className="text-red-600"><strong>禁止：</strong>夸大功效/硬广极客词</p>
                </div>
              </div>

              {/* KOS */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-neutral-900">KOS / 店长号</span>
                  <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded px-2 py-0.5">
                    <input
                      type="number"
                      value={accountRoles.kosCount}
                      onChange={(e) =>
                        setAccountRoles({ ...accountRoles, kosCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-10 text-center font-bold outline-none text-[12px]"
                    />
                    <span className="text-[10px] text-neutral-400">篇</span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-600 space-y-1">
                  <p><strong>主要职责：</strong>解答科学换粮避坑FAQ</p>
                  <p><strong>证据要求：</strong>检测报告与配方凭证</p>
                  <p className="text-red-600"><strong>禁止：</strong>情绪化表述</p>
                </div>
              </div>

              {/* Brand */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-neutral-900">品牌主号</span>
                  <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded px-2 py-0.5">
                    <input
                      type="number"
                      value={accountRoles.brandCount}
                      onChange={(e) =>
                        setAccountRoles({ ...accountRoles, brandCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-10 text-center font-bold outline-none text-[12px]"
                    />
                    <span className="text-[10px] text-neutral-400">篇</span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-600 space-y-1">
                  <p><strong>主要职责：</strong>活动倡议与搜索卡位</p>
                  <p><strong>汇总内容：</strong>测评长文与官方背书</p>
                  <p className="text-red-600"><strong>禁止：</strong>假装普通消费者</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. 项目周期 */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-3">
            <h2 className="text-[14px] font-bold text-neutral-900 border-b border-neutral-100 pb-2">项目周期与波次</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
              <div>
                <span className="font-bold text-neutral-500">开始日期</span>
                <input
                  type="date"
                  value={scheduleDates.startDate}
                  onChange={(e) => setScheduleDates({ ...scheduleDates, startDate: e.target.value })}
                  className="w-full mt-1 p-1.5 border border-neutral-200 rounded font-bold text-neutral-900 outline-none"
                />
              </div>
              <div>
                <span className="font-bold text-neutral-500">结束日期</span>
                <input
                  type="date"
                  value={scheduleDates.endDate}
                  onChange={(e) => setScheduleDates({ ...scheduleDates, endDate: e.target.value })}
                  className="w-full mt-1 p-1.5 border border-neutral-200 rounded font-bold text-neutral-900 outline-none"
                />
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg">
                <span className="font-bold text-neutral-500 block">首轮验证日期</span>
                <span className="font-extrabold text-neutral-900 text-[13px]">{scheduleDates.validationDate}</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg">
                <span className="font-bold text-neutral-500 block">中期复盘日期</span>
                <span className="font-extrabold text-neutral-900 text-[13px]">{scheduleDates.midtermReviewDate}</span>
              </div>
            </div>
          </div>

          {/* 6. 内容覆盖矩阵 */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-3">
            <h2 className="text-[14px] font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              内容覆盖矩阵 (Coverage Matrix)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold">
                    <th className="p-2.5">内容支柱</th>
                    <th className="p-2.5 text-center">KOC 消费者</th>
                    <th className="p-2.5 text-center">KOS 店长号</th>
                    <th className="p-2.5 text-center">品牌主号</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="p-2.5 font-bold text-neutral-800">真实体验日记</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">20 篇</td>
                    <td className="p-2.5 text-center text-neutral-400">0 篇</td>
                    <td className="p-2.5 text-center text-neutral-400">0 篇</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-neutral-800">店长专业指南</td>
                    <td className="p-2.5 text-center text-neutral-400">0 篇</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">2 篇</td>
                    <td className="p-2.5 text-center text-neutral-400">0 篇</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-neutral-800">品牌信任承接</td>
                    <td className="p-2.5 text-center text-neutral-400">0 篇</td>
                    <td className="p-2.5 text-center text-neutral-400">0 篇</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">1 篇</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. 首轮验证 */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-3">
            <h2 className="text-[14px] font-bold text-neutral-900 border-b border-neutral-100 pb-2">首轮验证与决策动作</h2>
            <div className="p-4 bg-neutral-50 rounded-xl space-y-2 text-[12px]">
              <p><strong>待验证假设：</strong>{validationPlan.hypothesis}</p>
              <p><strong>参与内容：</strong>{validationPlan.participatingContent}</p>
              <p><strong>主要指标：</strong>{validationPlan.metric}</p>
              <p className="text-emerald-700 font-bold"><strong>达标放大：</strong>{validationPlan.scaleAction}</p>
              <p className="text-amber-700"><strong>未达标调整：</strong>{validationPlan.adjustAction}</p>
              <p className="text-red-600"><strong>熔断条件：</strong>{validationPlan.stopAction}</p>
            </div>
          </div>

          {/* 9. 任务预览 (部分展示) */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h2 className="text-[14px] font-bold text-neutral-900">生成的任务预览示例</h2>
                <p className="text-[12px] text-neutral-500">共 {totalNotes} 个内容任务，展示前 5 个代表性任务</p>
              </div>

              <button
                onClick={onOpenTasksModal}
                className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-800 hover:bg-neutral-100"
              >
                查看全部 {totalNotes} 个任务
              </button>
            </div>

            <div className="space-y-2.5">
              {sampleTasksList.map((t) => (
                <div key={t.id} className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl flex items-center justify-between text-[12px]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{t.role}</span>
                      <span className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-[10px] font-bold text-neutral-600">
                        {t.angle}
                      </span>
                    </div>
                    <p className="text-neutral-600 mt-1">核心信息：{t.coreMessage}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-neutral-800 block">{t.plannedDate}</span>
                    <span className="text-[10px] text-neutral-400">对应验证假设</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (35% Sticky Summary) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-[15px] font-bold text-neutral-900">项目策略摘要</h2>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-200">
                策略契约
              </span>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <span className="text-neutral-400 block font-medium">项目核心命题</span>
                <span className="font-bold text-neutral-900 line-clamp-2">“{campaignThesis}”</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">核心目标</span>
                <span className="font-bold text-neutral-800">{campaignGoals.primary}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100">
                <div>
                  <span className="text-neutral-400 block">总任务数</span>
                  <span className="font-extrabold text-[16px] text-neutral-900">{totalNotes} 篇</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">项目周期</span>
                  <span className="font-extrabold text-[14px] text-neutral-900">14 天</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">KOC篇数</span>
                  <span className="font-bold text-neutral-800">{accountRoles.kocCount} 篇</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">KOS+品牌</span>
                  <span className="font-bold text-neutral-800">{accountRoles.kosCount + accountRoles.brandCount} 篇</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenContractDrawer}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-[12px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Eye size={14} />
              <span>查看完整策略契约</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 z-30 flex items-center justify-between px-8 max-w-[1200px] mx-auto rounded-t-2xl shadow-lg">
        <div className="text-[12px] text-neutral-600 font-medium">
          创建后将生成 <strong className="text-neutral-900">{totalNotes} 个内容任务</strong>，并统一继承本轮项目策略。
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100"
          >
            保存草稿
          </button>

          <button
            onClick={onCreateProject}
            className="px-8 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xs"
          >
            <span>创建项目并生成 {totalNotes} 个任务</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 4: 创建项目 (Progress & Complete View)
// =========================================================================
function Step4CreatingView({
  isProgress,
  phaseIndex,
  phases,
  result,
  onEnterProject,
  onViewStrategy,
}: {
  isProgress: boolean;
  phaseIndex: number;
  phases: string[];
  result: any;
  onEnterProject: () => void;
  onViewStrategy: () => void;
}) {
  return (
    <div className="max-w-[800px] mx-auto py-16 px-6 text-center">
      {isProgress ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-10 shadow-lg space-y-6">
          <div className="w-16 h-16 mx-auto bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-md">
            <Sparkles size={28} className="animate-spin text-amber-300" />
          </div>

          <div>
            <h1 className="text-[20px] font-extrabold text-neutral-900">正在生成项目与策略契约…</h1>
            <p className="text-[13px] text-neutral-500 mt-1">系统正在拆解 23 个笔记任务并写入统一指南</p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left text-[13px]">
            {phases.map((phase, idx) => {
              const isDone = idx < phaseIndex;
              const isCurrent = idx === phaseIndex;

              return (
                <div
                  key={phase}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    isDone
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                      : isCurrent
                      ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs"
                      : "bg-neutral-50 border-neutral-100 text-neutral-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Sparkles size={16} className="text-amber-300 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                  )}
                  <span>{phase}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-neutral-200 rounded-3xl p-10 shadow-xl space-y-6 max-w-xl mx-auto"
        >
          <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Check size={32} />
          </div>

          <div>
            <h1 className="text-[22px] font-extrabold text-neutral-900">项目已成功创建！</h1>
            <p className="text-[14px] text-neutral-600 mt-1 font-medium">
              已自动创建 {result?.totalTasks || 23} 个内容任务，全部统一继承本轮策略契约。
            </p>
          </div>

          {result && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-left space-y-2.5 text-[13px]">
              <div>
                <span className="text-neutral-400 font-medium">项目名称：</span>
                <span className="font-bold text-neutral-900">{result.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-neutral-400">周期：</span>
                  <span className="font-bold text-neutral-800">{result.startDate} 至 {result.endDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400">总任务部署：</span>
                  <span className="font-bold text-neutral-800">{result.totalTasks} 篇 (KOC {result.kocCount}/KOS {result.kosCount}/品牌 {result.brandCount})</span>
                </div>
                <div>
                  <span className="text-neutral-400">首轮验证节点：</span>
                  <span className="font-bold text-neutral-800">{result.validationDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400">首批待执行：</span>
                  <span className="font-bold text-neutral-800 truncate block">{result.firstTask}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onViewStrategy}
              className="px-6 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100"
            >
              查看项目策略
            </button>
            <button
              onClick={onEnterProject}
              className="px-8 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 shadow-md flex items-center gap-2"
            >
              <span>进入项目</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// =========================================================================
// AUXILIARY MODALS & DRAWERS
// =========================================================================

// All Tasks Preview Modal
function AllTasksPreviewModal({
  totalNotes,
  accountRoles,
  sampleTasksList,
  onClose,
}: {
  totalNotes: number;
  accountRoles: any;
  sampleTasksList: TaskPreviewItem[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-[720px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 relative z-10 overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-neutral-900">全部任务预览 ({totalNotes}篇)</h2>
            <p className="text-[12px] text-neutral-500">继承项目统一策略 (KOC {accountRoles.kocCount}篇 + KOS {accountRoles.kosCount}篇 + 品牌 {accountRoles.brandCount}篇)</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          {Array.from({ length: totalNotes }).map((_, i) => {
            let role = "KOC";
            if (i >= accountRoles.kocCount && i < accountRoles.kocCount + accountRoles.kosCount) {
              role = "KOS/店长号";
            } else if (i >= accountRoles.kocCount + accountRoles.kosCount) {
              role = "品牌主号";
            }

            return (
              <div key={i} className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl flex items-center justify-between text-[12px]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">#{i + 1} [{role}]</span>
                    <span className="text-neutral-600 font-medium">真实换粮体验第{(i % 7) + 1}天记录</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">继承规则：禁止绝对方表达，引导评论区咨询</p>
                </div>
                <span className="text-neutral-400 font-bold">2026-08-01</span>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold">
            关闭预览
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Strategy Contract Readable Drawer
function StrategyContractDrawer({
  campaignThesis,
  positioning,
  contentPillars,
  accountRoles,
  validationPlan,
  resourcesAndConstraints,
  onClose,
}: {
  campaignThesis: string;
  positioning: any;
  contentPillars: any[];
  accountRoles: any;
  validationPlan: any;
  resourcesAndConstraints: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="w-[520px] bg-white h-full shadow-2xl relative z-10 flex flex-col border-l border-neutral-200"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
              <span>项目策略契约 (strategy_contract)</span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-200">
                可继承指导
              </span>
            </h2>
            <p className="text-[12px] text-neutral-500">项目下所有笔记任务均统一继承本规则</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[13px]">
          {/* 项目级锁定 */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-[14px] flex items-center gap-1.5 text-purple-900">
              <Lock size={14} /> 项目级锁定规则
            </h3>
            <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2">
              <p><strong>核心命题：</strong>“{campaignThesis}”</p>
              <p><strong>定位：</strong>{positioning.oneSentence}</p>
              <p><strong>目标人群：</strong>{positioning.targetAudience}</p>
              <p><strong>合规限制：</strong>{resourcesAndConstraints.complianceLimits}</p>
              <p className="text-red-700"><strong>禁止表达：</strong>{resourcesAndConstraints.forbiddenWords}</p>
            </div>
          </div>

          {/* 可调整策略 */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-[14px] flex items-center gap-1.5">
              <SlidersHorizontal size={14} /> 可调整策略配比
            </h3>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
              <p><strong>内容支柱：</strong>真实体验(50%) / 店长避坑(30%) / 品牌信任(20%)</p>
              <p><strong>账号配比：</strong>KOC {accountRoles.kocCount}篇 + KOS {accountRoles.kosCount}篇 + 品牌 {accountRoles.brandCount}篇</p>
              <p><strong>首轮验证：</strong>{validationPlan.participatingContent}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold">
            确认并关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Add Material Modal
function AddMaterialModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: Attachment) => void;
}) {
  const [tab, setTab] = useState<"file" | "link" | "text">("file");
  const [fileName, setFileName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [textContent, setTextContent] = useState("");

  const handleAdd = () => {
    if (tab === "file") {
      onAdd({
        id: Date.now().toString(),
        type: "file",
        name: fileName || "幼犬换粮竞品资料.pdf",
        aiRead: true,
      });
    } else if (tab === "link") {
      onAdd({
        id: Date.now().toString(),
        type: "link",
        name: linkUrl || "小红书对标笔记链接",
        aiRead: true,
      });
    } else {
      onAdd({
        id: Date.now().toString(),
        type: "text",
        name: textContent.slice(0, 15) || "产品补充说明",
        aiRead: true,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-[460px] bg-white rounded-2xl shadow-xl border border-neutral-200 relative z-10 overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-neutral-900">添加项目资料</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-neutral-100 px-5 bg-neutral-50/50">
          {[
            { id: "file", label: "上传文件", icon: UploadCloud },
            { id: "link", label: "粘贴链接", icon: LinkIcon },
            { id: "text", label: "粘贴文本", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 py-3 px-4 text-[13px] font-bold border-b-2 transition-colors ${
                tab === t.id
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <t.icon size={14} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "file" && (
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center hover:border-neutral-400 transition-colors bg-neutral-50/40 cursor-pointer">
              <UploadCloud size={28} className="mx-auto text-neutral-400 mb-2" />
              <div className="text-[13px] font-bold text-neutral-800 mb-1">点击上传或拖拽文件至此处</div>
              <div className="text-[12px] text-neutral-400">支持 PDF, Word, Excel, TXT, 图片等格式</div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                }}
              />
            </div>
          )}

          {tab === "link" && (
            <div>
              <label className="block text-[12px] font-bold text-neutral-600 mb-1.5">网页或笔记链接</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://www.xiaohongshu.com/discovery/item/..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-[13px] outline-none"
              />
            </div>
          )}

          {tab === "text" && (
            <div>
              <label className="block text-[12px] font-bold text-neutral-600 mb-1.5">补充资料文本</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="例如：本次活动需要包含赠品成本，店长号排期需避开周三..."
                className="w-full h-[100px] p-3 border border-neutral-200 rounded-xl text-[13px] outline-none resize-none"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-100 flex justify-end gap-2 bg-neutral-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100"
          >
            取消
          </button>
          <button
            onClick={handleAdd}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800"
          >
            确定添加
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Add Product Fact Blocker Modal
function AddProductFactModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [productFacts, setProductFacts] = useState(
    "针对3-12个月幼犬，特研肠胃适应过渡颗粒，双益生菌配方提升消化吸收率，减少软便风险。"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-[480px] bg-white rounded-2xl shadow-xl border border-neutral-200 relative z-10 overflow-hidden"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            <span>补充核心产品事实资料 (清除阻断项)</span>
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[13px]">
          <p className="text-neutral-600 leading-relaxed">
            小红书合规审稿机制要求：生成成分或功效类文案时必须有真实材料证明支撑。
          </p>

          <div>
            <label className="block font-bold text-neutral-800 mb-1">补充核心成分与功效支持凭证：</label>
            <textarea
              value={productFacts}
              onChange={(e) => setProductFacts(e.target.value)}
              className="w-full h-[120px] p-3 border border-neutral-200 rounded-xl text-[13px] outline-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100"
          >
            取消
          </button>
          <button
            onClick={onSuccess}
            className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-[13px] font-bold hover:bg-emerald-700"
          >
            保存并清除阻断
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Impact Lock Warning Modal
function ImpactLockWarningModal({
  onClose,
  affectedCount,
}: {
  onClose: () => void;
  affectedCount: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-[460px] bg-white rounded-2xl shadow-xl border border-neutral-200 relative z-10 overflow-hidden"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-500" />
            <span>修改项目级策略影响确认</span>
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-[13px]">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
            这项修改会影响 {affectedCount} 个尚未完成的笔记任务。
          </div>
          <p className="text-neutral-600 leading-relaxed">
            请选择修改策略后的应用范围：
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={onClose}
              className="w-full p-3 text-left border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors font-bold text-neutral-900"
            >
              1. 只修改项目策略 (不重新刷写未开始任务)
            </button>
            <button
              onClick={onClose}
              className="w-full p-3 text-left border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors font-bold text-neutral-900"
            >
              2. 修改策略并同步刷写所有未开始任务
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100"
          >
            取消修改
          </button>
        </div>
      </motion.div>
    </div>
  );
}
