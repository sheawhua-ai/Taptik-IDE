import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  ShieldCheck,
  Sparkles,
  Calendar,
  Layers,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertCircle,
  RefreshCw,
  Sliders,
  Send,
  CornerDownLeft,
  BookOpen,
  ArrowRight,
  FileText
} from "lucide-react";

export interface AccountItemConfig {
  notesCount: number;
  frequency: string;
}

export interface DistributionConfig {
  matrixAccountIds?: string[];
  notesPerAccountRequirement?: string;
  publishFrequencyRequirement?: string;
  publishTimeWindowRequirement?: string;
  additionalRequirements?: string;

  accountConfigs?: Record<string, AccountItemConfig>;

  brandAccountIds: string[];
  brandNotesPerAccount: number;
  brandFrequency: string;
  brandTimeWindow?: string;

  kosAccountIds: string[];
  kosNotesPerAccount: number;
  kosFrequency: string;
  kosTimeWindow?: string;

  kocCount?: number;
}

// 排期笔记项
export interface ScheduleNote {
  id: string;
  day: number;
  dateStr: string;
  accountName: string;
  accountType: "brand" | "store" | "kos";
  title: string;
  keywordCluster: string;
  intent: string;
  status: "executed" | "executing" | "pending";
  assignedRole: string;
}

interface DistributionDrawerProps {
  initialConfig: DistributionConfig;
  totalTargetNotes?: number;
  onSave: (config: DistributionConfig) => void;
  onClose: () => void;
}

// 初始排期 18 篇笔记
const INITIAL_SCHEDULE_NOTES: ScheduleNote[] = [
  { id: "note_1", day: 1, dateStr: "8月19日 (周一)", accountName: "特唯普品牌官方号", accountType: "brand", title: "室内宠臭根源与复合生物酶除臭原理", keywordCluster: "宠物除臭", intent: "权威科普", status: "executing", assignedRole: "原理解释/产品标准" },
  { id: "note_2", day: 2, dateStr: "8月20日 (周二)", accountName: "店长号_陆家嘴旗舰店", accountType: "store", title: "陆家嘴店实测：多猫家庭除味喷雾体验", keywordCluster: "猫砂除味", intent: "到店体验", status: "executed", assignedRole: "本地场景/到店服务" },
  { id: "note_3", day: 3, dateStr: "8月21日 (周三)", accountName: "KOS_小张(徐家汇店)", accountType: "kos", title: "养猫3年老手总结：猫砂盆去味误区避坑", keywordCluster: "猫砂除味", intent: "真实体验", status: "pending", assignedRole: "细分痛点/真实使用" },
  { id: "note_4", day: 4, dateStr: "8月22日 (周四)", accountName: "特唯普品牌官方号", accountType: "brand", title: "宠物环境安全清洁国标解释与选购指南", keywordCluster: "宠物环境清洁", intent: "标准解答", status: "pending", assignedRole: "原理解释/产品标准" },
  { id: "note_5", day: 5, dateStr: "8月23日 (周五)", accountName: "店长号_徐家汇概念店", accountType: "store", title: "徐家汇店客诉解密：养宠家庭异味来源分类", keywordCluster: "宠物除臭", intent: "顾客问答", status: "pending", assignedRole: "本地场景/到店服务" },
  { id: "note_6", day: 6, dateStr: "8月24日 (周六)", accountName: "KOS_小李(朝阳大悦城)", accountType: "kos", title: "周末带狗回家异味重？店员教你10秒除臭", keywordCluster: "宠物除臭", intent: "生活场景", status: "pending", assignedRole: "细分痛点/真实使用" },
  { id: "note_7", day: 7, dateStr: "8月25日 (周日)", accountName: "特唯普健康宠物馆", accountType: "brand", title: "幼犬幼猫家庭环境除菌与除味双重保障", keywordCluster: "幼犬除味技巧", intent: "养宠指南", status: "pending", assignedRole: "原理解释/产品标准" },
  { id: "note_8", day: 8, dateStr: "8月26日 (周一)", accountName: "店长号_陆家嘴旗舰店", accountType: "store", title: "上海宠物用品店服务实录：现场除臭对比", keywordCluster: "上海宠物用品店", intent: "到店攻略", status: "pending", assignedRole: "本地场景/到店服务" },
  { id: "note_9", day: 9, dateStr: "8月27日 (周二)", accountName: "KOS_小张(徐家汇店)", accountType: "kos", title: "下雨天室内狗尿味大？亲测除味喷雾喷湿毯", keywordCluster: "宠物除臭", intent: "真实痛点", status: "pending", assignedRole: "细分痛点/真实使用" },
  { id: "note_10", day: 10, dateStr: "8月28日 (周三)", accountName: "特唯普品牌官方号", accountType: "brand", title: "宠物除臭剂活性成分分析与抑菌持久度测试", keywordCluster: "宠物除臭", intent: "实验展示", status: "pending", assignedRole: "原原理与成分测试" },
  { id: "note_11", day: 11, dateStr: "8月29日 (周四)", accountName: "店长号_徐家汇概念店", accountType: "store", title: "徐家汇宠物友好门店探店：宠物除臭好物试用", keywordCluster: "上海宠物用品店", intent: "到店体验", status: "pending", assignedRole: "本地场景/到店服务" },
  { id: "note_12", day: 12, dateStr: "8月30日 (周五)", accountName: "KOS_小李(朝阳大悦城)", accountType: "kos", title: "养猫打工人晚上回家开门不再有猫砂味", keywordCluster: "猫砂除味", intent: "生活体验", status: "pending", assignedRole: "细分痛点/真实使用" },
  { id: "note_13", day: 13, dateStr: "8月31日 (周六)", accountName: "店长号_陆家嘴旗舰店", accountType: "store", title: "周末带宠物来陆家嘴店免费体验环境除臭", keywordCluster: "上海宠物用品店", intent: "本地活动", status: "pending", assignedRole: "本地场景/到店服务" },
  { id: "note_14", day: 14, dateStr: "9月1日 (周日)", accountName: "特唯普健康宠物馆", accountType: "brand", title: "换季宠物异味高发期全屋清洁避坑方案", keywordCluster: "宠物环境清洁", intent: "季节指南", status: "pending", assignedRole: "原理解释/产品标准" },
];

export function DistributionDrawer({
  initialConfig,
  onSave,
  onClose,
}: DistributionDrawerProps) {
  // 核心版本与时间状态
  const [scheduleNotes, setScheduleNotes] = useState<ScheduleNote[]>(INITIAL_SCHEDULE_NOTES);
  const [currentVersion, setCurrentVersion] = useState("V3.0");
  const [lastUpdated, setLastUpdated] = useState("今天 10:24");

  // 上下文选择（默认为全局）
  const [selectedContext, setSelectedContext] = useState<{
    type: "global" | "account" | "keyword" | "note";
    id?: string;
    name: string;
    notesCount: number;
    tasksCount: number;
  }>({
    type: "global",
    name: "全局运营方案",
    notesCount: 18,
    tasksCount: 22,
  });

  // 自然语言输入与计算状态
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalIteration, setProposalIteration] = useState(1);

  // 展开折叠状态
  const [showBasisDetail, setShowBasisDetail] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // 当前变更提案 Proposal
  const [proposal, setProposal] = useState<{
    versionLabel: string;
    description: string;
    diffs: {
      entity: string;
      before: string;
      after: string;
      tag?: string;
    }[];
    taskImpact: {
      unstartedAffected: number;
      executingAffected: number;
      hasConflict: boolean;
      conflictDetails?: string;
    };
    overallImpact: string;
    previewNotes?: ScheduleNote[];
  } | null>(null);

  // 任务同步状态: "unsynced" | "synced" | "conflict"
  const [taskSyncStatus, setTaskSyncStatus] = useState<"unsynced" | "synced" | "conflict">("unsynced");

  // 处理上下文清除
  const handleClearContext = () => {
    setSelectedContext({
      type: "global",
      name: "全局运营方案",
      notesCount: scheduleNotes.length,
      tasksCount: 22,
    });
  };

  // 点击选择账号
  const handleSelectAccount = (id: string, name: string, notesCount: number, tasksCount: number) => {
    if (selectedContext.type === "account" && selectedContext.id === id) {
      handleClearContext();
    } else {
      setSelectedContext({
        type: "account",
        id,
        name,
        notesCount,
        tasksCount,
      });
    }
  };

  // 点击选择关键词簇
  const handleSelectKeyword = (kw: string, notesCount: number) => {
    if (selectedContext.type === "keyword" && selectedContext.name === kw) {
      handleClearContext();
    } else {
      setSelectedContext({
        type: "keyword",
        id: kw,
        name: `#${kw}`,
        notesCount,
        tasksCount: notesCount * 1.2,
      });
    }
  };

  // 点击选择排期笔记
  const handleSelectNote = (note: ScheduleNote) => {
    if (selectedContext.type === "note" && selectedContext.id === note.id) {
      handleClearContext();
    } else {
      setSelectedContext({
        type: "note",
        id: note.id,
        name: `Day${note.day} ${note.title}`,
        notesCount: 1,
        tasksCount: 1,
      });
    }
  };

  // 生成修改提案 (模拟服务端 Context Agent 处理)
  const handleGenerateProposal = () => {
    if (!userInput.trim() && !proposal) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const isBrandReduce = userInput.includes("品牌号") || userInput.includes("减少") || userInput.includes("KOS");
      const isXuJiaHuiQA = userInput.includes("徐家汇") || userInput.includes("问答") || userInput.includes("顾客");

      let newDiffs = [];
      let updatedNotes = [...scheduleNotes];
      let hasConflict = false;
      let conflictDetail = "";

      if (isXuJiaHuiQA) {
        newDiffs = [
          {
            entity: "店长号_徐家汇概念店",
            before: "2篇，包含1篇到店探店产品测评",
            after: "2篇，全部调整为【门店顾客常见异味问题解答】",
            tag: "内容方向"
          },
          {
            entity: "关联工作任务",
            before: "任务#11 状态：素材制作中 (已开始执行)",
            after: "检测到任务#11正处于素材制作阶段，已暂停静默覆盖并提示冲突",
            tag: "执行冲突"
          }
        ];
        hasConflict = true;
        conflictDetail = "其中1篇笔记【徐家汇店客诉解密】对应的工作任务#11已进入素材制作阶段。建议保留原任务素材，仅调整后续发布时间。";
      } else if (isBrandReduce) {
        newDiffs = [
          {
            entity: "特唯普品牌官方号",
            before: "6篇，包含2篇体验测评类内容",
            after: "4篇，只保留原理科普与国标解答等核心品牌词内容",
            tag: "篇数与角色"
          },
          {
            entity: "KOS员工号",
            before: "6篇，3个体验场景",
            after: "8篇，增加2个真实家庭除臭与养宠痛点角度",
            tag: "篇数与角色"
          },
          {
            entity: "工作任务影响",
            before: "修改 4 项未开始任务",
            after: "不影响 4 项执行中任务",
            tag: "任务联动"
          }
        ];
        updatedNotes = updatedNotes.map(n => {
          if (n.id === "note_10") {
            return { ...n, accountName: "KOS_小张(徐家汇店)", accountType: "kos", title: "真实实测：多猫家庭下雨天除臭平替方案" };
          }
          return n;
        });
      } else {
        newDiffs = [
          {
            entity: selectedContext.name,
            before: `围绕当前【${selectedContext.name}】的排期分布`,
            after: `根据指令“${userInput}”已优化相关内容角度与发布错峰间隔`,
            tag: "局部调整"
          },
          {
            entity: "关联工作任务",
            before: "修改 3 项未开始关联任务",
            after: "维持现有执行中任务不受影响",
            tag: "任务同步"
          }
        ];
      }

      setProposal({
        versionLabel: `V3.${proposalIteration} 变更提案`,
        description: `Agent 已读取【${selectedContext.name}】关联的账号、笔记与任务链，重新计算了错峰矩阵提案：`,
        diffs: newDiffs,
        taskImpact: {
          unstartedAffected: 4,
          executingAffected: hasConflict ? 1 : 0,
          hasConflict,
          conflictDetails: conflictDetail
        },
        overallImpact: "总篇数仍为18篇，6个核心关键词簇覆盖100%，无跨账号撞车冲突。",
        previewNotes: updatedNotes
      });

      setProposalIteration(prev => prev + 1);
      setUserInput("");
    }, 900);
  };

  // 确认应用提案
  const handleApplyProposal = () => {
    if (!proposal) return;
    if (proposal.previewNotes) {
      setScheduleNotes(proposal.previewNotes);
    }
    setCurrentVersion(`V3.${proposalIteration}`);
    setLastUpdated("刚刚");
    setTaskSyncStatus(proposal.taskImpact.hasConflict ? "conflict" : "unsynced");
    setProposal(null);
  };

  // 放弃提案
  const handleRejectProposal = () => {
    setProposal(null);
  };

  // 确认方案并同步工作任务
  const handleMainAction = () => {
    onSave({
      matrixAccountIds: ["brand_1", "brand_2", "kos_1", "kos_2", "kos_3", "kos_4", "kos_5"],
      brandAccountIds: ["brand_1", "brand_2"],
      brandNotesPerAccount: 3,
      brandFrequency: "每周 2 篇",
      kosAccountIds: ["kos_1", "kos_2", "kos_3", "kos_4", "kos_5"],
      kosNotesPerAccount: 2,
      kosFrequency: "每周 2 篇",
      notesPerAccountRequirement: "18篇全矩阵错峰自然流方案",
      publishFrequencyRequirement: "多账号错峰发布 (间隔≥48h)",
      additionalRequirements: "品牌解释、门店服务与KOS真实使用三角协同",
      kocCount: initialConfig.kocCount ?? 10
    });
  };

  // 计算主按钮文案与状态
  const getBottomButtonText = () => {
    if (taskSyncStatus === "conflict") return "先处理任务冲突";
    if (taskSyncStatus === "unsynced") return "同步本次方案修改";
    return "确认方案并补充工作任务";
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-btn-main/50 backdrop-blur-xs z-50"
      />

      {/* Main Full-Width Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[1380px] bg-[#f8f9fa] shadow-2xl z-50 flex flex-col border-l border-border-default"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-border-default bg-surface-1 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-btn-main text-white flex items-center justify-center font-extrabold text-[15px] shadow-xs">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[17px] font-extrabold text-text-main tracking-tight">
                  自有账号矩阵方案审阅与调整
                </h2>
                <span className="px-2.5 py-0.5 bg-hover-bg border border-border-default text-text-main text-[13px] font-bold rounded-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  {currentVersion} · 方案已确认
                </span>
              </div>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                直接选择账号或节点，使用自然语言下发指令；确认提案后将同步增量更新工作任务
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-text-tertiary">最近更新：{lastUpdated}</span>
            <button
              onClick={onClose}
              className="p-2 text-text-tertiary hover:text-text-main rounded-xl hover:bg-hover-bg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container (Full Width Plan) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40 bg-[#f8f9fa]">
          
          {/* SECTION 1: 方案总览 1 行摘要 */}
          <div className="bg-surface-1 rounded-xl px-5 py-3.5 border border-border-default/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3 text-[13.5px] font-extrabold text-text-main divide-x divide-neutral-200">
              <div className="flex items-center gap-2 pr-1">
                <Sliders size={15} className="text-text-secondary" />
                <span>8月19日 — 9月1日 (14天)</span>
              </div>
              <div className="px-3 text-text-main">5 个账号</div>
              <div className="px-3 text-text-main">{scheduleNotes.length} 篇笔记</div>
              <div className="px-3 text-text-main">6 个词簇</div>
              <div className="px-3 text-text-main">22 个工作任务</div>
              <div className="pl-3 text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {currentVersion} 实施中
              </div>
            </div>

            <div className="text-[13px] text-text-tertiary font-medium">
              点击下方账号卡片或排期可直接指定调整对象
            </div>
          </div>

          {/* SECTION 2: 矩阵协同逻辑摘要 */}
          <div className="bg-surface-1 rounded-xl p-5 border border-border-default/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-text-main" />
                <span className="text-[14px] font-extrabold text-text-main">AI 矩阵协同逻辑摘要</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBasisDetail(!showBasisDetail)}
                className="text-[13px] font-bold text-text-secondary hover:text-black flex items-center gap-1 bg-hover-bg px-3 py-1.5 rounded-lg transition-colors border border-border-default/80"
              >
                <span>基于账号定位、历史表现和任务负载生成</span>
                {showBasisDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            <div className="p-4 bg-page-bg border border-border-default rounded-xl text-[13px] text-text-main leading-relaxed font-medium">
              品牌主号负责产品原理和核心品类词；上海门店号负责本地场景和到店问题；KOS负责真实使用过程和细分痛点。18篇内容在14天内错峰发布。
            </div>

            {/* Collapsible Complete AI Generation Basis */}
            <AnimatePresence>
              {showBasisDetail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-1"
                >
                  <div className="p-4 bg-hover-bg/80 border border-border-default rounded-xl space-y-3 text-[13px] text-text-secondary">
                    <div className="font-bold text-text-main text-[13px] border-b border-border-default pb-2 flex items-center gap-2">
                      <BookOpen size={15} />
                      完整 AI 方案生成依据与规则设定：
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-text-main">🎯 项目运营目标</div>
                        <p className="text-text-secondary">小红书自然流抢占“宠物除臭”与“猫砂除味”高意图搜索卡位。</p>
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-text-main">📈 账号历史表现</div>
                        <p className="text-text-secondary">品牌主号硬核科普 CTR 4.1%，陆家嘴门店号线下到店转化率全网最高。</p>
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-text-main">🔍 关键词内容缺口</div>
                        <p className="text-text-secondary">搜索词“猫砂除味”缺乏真实多猫家庭的体验侧长尾笔记覆盖。</p>
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-text-main">⚡ 当前任务负载</div>
                        <p className="text-text-secondary">已有 4 项工作任务处于素材制作/文案编写阶段，避免冲突修改。</p>
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-text-main">🧠 已确认操盘手偏好</div>
                        <p className="text-text-secondary">KOS账号同一意图发布间隔≥48h；品牌主号每周发布≤3篇。</p>
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-text-main">🔄 上周期复盘结论</div>
                        <p className="text-text-secondary">周一上午避免集中分发大词；本地场景词与门店地理位置强绑定。</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 3: 账号角色与内容分工卡片 */}
          <div className="bg-surface-1 rounded-xl p-5 border border-border-default/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-text-main" />
                <span className="text-[14px] font-extrabold text-text-main">账号角色与分工入口</span>
              </div>
              <span className="text-[13px] text-text-tertiary font-medium">
                点击任意卡片选中为修改对象，底栏指令区将自动携带上下文
              </span>
            </div>

            {/* Account Grid */}
            <div className="grid grid-cols-5 gap-3.5">
              
              {/* Account 1 */}
              <div
                onClick={() => handleSelectAccount("brand_1", "特唯普品牌官方号", 6, 8)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  selectedContext.id === "brand_1"
                    ? "bg-btn-main text-white border-neutral-900 shadow-md ring-2 ring-neutral-900"
                    : "bg-surface-1 border-border-default hover:border-neutral-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                      selectedContext.id === "brand_1" ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                    }`}>
                      品牌主号
                    </span>
                    <h3 className={`text-[13.5px] font-black mt-1.5 ${selectedContext.id === "brand_1" ? "text-white" : "text-text-main"}`}>
                      特唯普品牌官方号
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[13px] font-extrabold rounded-lg ${
                    selectedContext.id === "brand_1" ? "bg-surface-1 text-text-main" : "bg-btn-main text-white"
                  }`}>
                    6 篇
                  </span>
                </div>

                <div className={`text-[13px] space-y-1 leading-snug ${selectedContext.id === "brand_1" ? "text-neutral-300" : "text-text-secondary"}`}>
                  <div><strong>角色：</strong> 原理解释 / 产品标准</div>
                  <div><strong>词簇：</strong> #宠物除臭 #宠物环境清洁</div>
                  <div><strong>节奏：</strong> 每 2~3 天发布 1 篇</div>
                  <div className="pt-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                    关联 8 个工作任务
                  </div>
                </div>
              </div>

              {/* Account 2 */}
              <div
                onClick={() => handleSelectAccount("brand_2", "特唯普健康宠物馆", 2, 3)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  selectedContext.id === "brand_2"
                    ? "bg-btn-main text-white border-neutral-900 shadow-md ring-2 ring-neutral-900"
                    : "bg-surface-1 border-border-default hover:border-neutral-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                      selectedContext.id === "brand_2" ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                    }`}>
                      品牌主号
                    </span>
                    <h3 className={`text-[13.5px] font-black mt-1.5 ${selectedContext.id === "brand_2" ? "text-white" : "text-text-main"}`}>
                      特唯普健康宠物馆
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[13px] font-extrabold rounded-lg ${
                    selectedContext.id === "brand_2" ? "bg-surface-1 text-text-main" : "bg-btn-main text-white"
                  }`}>
                    2 篇
                  </span>
                </div>

                <div className={`text-[13px] space-y-1 leading-snug ${selectedContext.id === "brand_2" ? "text-neutral-300" : "text-text-secondary"}`}>
                  <div><strong>角色：</strong> 养宠指南 / 权威问答</div>
                  <div><strong>词簇：</strong> #幼犬除味技巧 #宠物环境清洁</div>
                  <div><strong>节奏：</strong> 每周 1 篇</div>
                  <div className="pt-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                    关联 3 个工作任务
                  </div>
                </div>
              </div>

              {/* Account 3 */}
              <div
                onClick={() => handleSelectAccount("store_1", "店长号_陆家嘴旗舰店", 4, 5)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  selectedContext.id === "store_1"
                    ? "bg-btn-main text-white border-neutral-900 shadow-md ring-2 ring-neutral-900"
                    : "bg-surface-1 border-border-default hover:border-neutral-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                      selectedContext.id === "store_1" ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                    }`}>
                      门店号
                    </span>
                    <h3 className={`text-[13.5px] font-black mt-1.5 ${selectedContext.id === "store_1" ? "text-white" : "text-text-main"}`}>
                      店长号_陆家嘴旗舰店
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[13px] font-extrabold rounded-lg ${
                    selectedContext.id === "store_1" ? "bg-surface-1 text-text-main" : "bg-btn-main text-white"
                  }`}>
                    4 篇
                  </span>
                </div>

                <div className={`text-[13px] space-y-1 leading-snug ${selectedContext.id === "store_1" ? "text-neutral-300" : "text-text-secondary"}`}>
                  <div><strong>角色：</strong> 到店攻略 / 线下活动</div>
                  <div><strong>词簇：</strong> #猫砂除味 #上海宠物用品店</div>
                  <div><strong>节奏：</strong> 每周 2 篇</div>
                  <div className="pt-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                    关联 5 个工作任务
                  </div>
                </div>
              </div>

              {/* Account 4 */}
              <div
                onClick={() => handleSelectAccount("store_2", "店长号_徐家汇概念店", 2, 3)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  selectedContext.id === "store_2"
                    ? "bg-btn-main text-white border-neutral-900 shadow-md ring-2 ring-neutral-900"
                    : "bg-surface-1 border-border-default hover:border-neutral-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                      selectedContext.id === "store_2" ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                    }`}>
                      门店号
                    </span>
                    <h3 className={`text-[13.5px] font-black mt-1.5 ${selectedContext.id === "store_2" ? "text-white" : "text-text-main"}`}>
                      店长号_徐家汇概念店
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[13px] font-extrabold rounded-lg ${
                    selectedContext.id === "store_2" ? "bg-surface-1 text-text-main" : "bg-btn-main text-white"
                  }`}>
                    2 篇
                  </span>
                </div>

                <div className={`text-[13px] space-y-1 leading-snug ${selectedContext.id === "store_2" ? "text-neutral-300" : "text-text-secondary"}`}>
                  <div><strong>角色：</strong> 顾客解答 / 本地服务</div>
                  <div><strong>词簇：</strong> #宠物除臭 #猫砂除味</div>
                  <div><strong>节奏：</strong> 每周 1 篇</div>
                  <div className="pt-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                    关联 3 个工作任务
                  </div>
                </div>
              </div>

              {/* Account 5 */}
              <div
                onClick={() => handleSelectAccount("kos_1", "KOS_小张(徐家汇店)", 4, 5)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                  selectedContext.id === "kos_1"
                    ? "bg-btn-main text-white border-neutral-900 shadow-md ring-2 ring-neutral-900"
                    : "bg-surface-1 border-border-default hover:border-neutral-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                      selectedContext.id === "kos_1" ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                    }`}>
                      KOS员工号
                    </span>
                    <h3 className={`text-[13.5px] font-black mt-1.5 ${selectedContext.id === "kos_1" ? "text-white" : "text-text-main"}`}>
                      KOS_小张 (徐家汇店)
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[13px] font-extrabold rounded-lg ${
                    selectedContext.id === "kos_1" ? "bg-surface-1 text-text-main" : "bg-btn-main text-white"
                  }`}>
                    4 篇
                  </span>
                </div>

                <div className={`text-[13px] space-y-1 leading-snug ${selectedContext.id === "kos_1" ? "text-neutral-300" : "text-text-secondary"}`}>
                  <div><strong>角色：</strong> 真实使用 / 痛点避坑</div>
                  <div><strong>词簇：</strong> #猫砂除味 #宠物除臭</div>
                  <div><strong>节奏：</strong> 每周 2 篇</div>
                  <div className="pt-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                    关联 5 个工作任务
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 4: 关键词覆盖矩阵 */}
          <div className="bg-surface-1 rounded-xl p-5 border border-border-default/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-text-main" />
                <span className="text-[14px] font-extrabold text-text-main">关键词簇覆盖</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3.5 text-[13px]">
              <div
                onClick={() => handleSelectKeyword("宠物除臭", 6)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedContext.id === "宠物除臭"
                    ? "bg-btn-main text-white border-neutral-900 shadow-sm"
                    : "bg-page-bg hover:bg-hover-bg/80 border-border-default"
                }`}
              >
                <div className="font-extrabold flex justify-between items-center text-[13px]">
                  <span>#宠物除臭</span>
                  <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                    selectedContext.id === "宠物除臭" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-text-main"
                  }`}>
                    6 篇覆盖
                  </span>
                </div>
                <div className={selectedContext.id === "宠物除臭" ? "text-neutral-300" : "text-text-secondary"}>
                  <strong>内容角度：</strong> 原理解释、使用教程、真实痛点
                </div>
                <div className={selectedContext.id === "宠物除臭" ? "text-text-tertiary" : "text-text-tertiary"}>
                  <strong>负责账号：</strong> 品牌官方号、徐家汇店、KOS小张
                </div>
              </div>

              <div
                onClick={() => handleSelectKeyword("猫砂除味", 5)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedContext.id === "猫砂除味"
                    ? "bg-btn-main text-white border-neutral-900 shadow-sm"
                    : "bg-page-bg hover:bg-hover-bg/80 border-border-default"
                }`}
              >
                <div className="font-extrabold flex justify-between items-center text-[13px]">
                  <span>#猫砂除味</span>
                  <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                    selectedContext.id === "猫砂除味" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-text-main"
                  }`}>
                    5 篇覆盖
                  </span>
                </div>
                <div className={selectedContext.id === "猫砂除味" ? "text-neutral-300" : "text-text-secondary"}>
                  <strong>内容角度：</strong> 养猫场景、门店实测、避坑指南
                </div>
                <div className={selectedContext.id === "猫砂除味" ? "text-text-tertiary" : "text-text-tertiary"}>
                  <strong>负责账号：</strong> 陆家嘴旗舰店、徐家汇店、KOS小张
                </div>
              </div>

              <div
                onClick={() => handleSelectKeyword("上海宠物用品店", 3)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedContext.id === "上海宠物用品店"
                    ? "bg-btn-main text-white border-neutral-900 shadow-sm"
                    : "bg-page-bg hover:bg-hover-bg/80 border-border-default"
                }`}
              >
                <div className="font-extrabold flex justify-between items-center text-[13px]">
                  <span>#上海宠物用品店</span>
                  <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                    selectedContext.id === "上海宠物用品店" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-text-main"
                  }`}>
                    3 篇覆盖
                  </span>
                </div>
                <div className={selectedContext.id === "上海宠物用品店" ? "text-neutral-300" : "text-text-secondary"}>
                  <strong>内容角度：</strong> 探店攻略、本地服务、线下体验
                </div>
                <div className={selectedContext.id === "上海宠物用品店" ? "text-text-tertiary" : "text-text-tertiary"}>
                  <strong>负责账号：</strong> 陆家嘴旗舰店、徐家汇概念店
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: 14天发布节奏 Timeline */}
          <div className="bg-surface-1 rounded-xl p-5 border border-border-default/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-text-main" />
                <span className="text-[14px] font-extrabold text-text-main">14天矩阵错峰发布节奏 (Timeline)</span>
              </div>
              <span className="text-[13px] text-text-tertiary">点击任意排期笔记带入底栏上下文</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {scheduleNotes.map((note) => {
                const isSelected = selectedContext.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-btn-main text-white border-neutral-900 shadow-sm"
                        : "bg-surface-1 border-border-default hover:border-neutral-300 hover:shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-16 text-center font-bold text-[13px] py-1 rounded-md shrink-0 ${
                        isSelected ? "bg-neutral-800 text-white" : "bg-hover-bg text-text-secondary"
                      }`}>
                        Day {note.day}
                      </span>
                      <div>
                        <div className={`text-[13px] font-bold flex items-center gap-2 ${isSelected ? "text-white" : "text-text-main"}`}>
                          <span>{note.title}</span>
                          <span className={`px-2 py-0.2 text-[13px] font-semibold rounded ${
                            isSelected ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                          }`}>
                            #{note.keywordCluster}
                          </span>
                        </div>
                        <div className={`text-[13px] mt-0.5 ${isSelected ? "text-neutral-300" : "text-text-tertiary"}`}>
                          {note.accountName} · {note.dateStr} · 角色：{note.assignedRole}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {note.status === "executing" ? (
                        <span className={`px-2.5 py-1 text-[13px] font-bold rounded-lg border flex items-center gap-1 ${
                          isSelected
                            ? "bg-neutral-800 text-emerald-400 border-neutral-700"
                            : "bg-hover-bg text-text-main border-border-default"
                        }`}>
                          <Clock size={12} /> 执行中
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 text-[13px] font-medium rounded-lg ${
                          isSelected ? "bg-neutral-800 text-neutral-300" : "bg-hover-bg text-text-secondary"
                        }`}>
                          未开始
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM AI INSTRUCTION BAR & PROPOSAL DISPLAY (吸底组件)     */}
        {/* ========================================================= */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[1380px] ml-auto bg-surface-1 border-t border-border-default shadow-2xl z-50 p-4 space-y-3">
          
          {/* TEMPORARY PROPOSAL VIEW (If Proposal Exists) */}
          <AnimatePresence>
            {proposal && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-4 bg-btn-main text-white rounded-xl border border-neutral-800 space-y-3.5 shadow-xl max-h-[320px] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2 text-[13.5px] font-black text-white">
                    <Sparkles size={16} className="text-amber-300 animate-pulse" />
                    <span>AI 变更计算提案 ({proposal.versionLabel})</span>
                  </div>
                  <span className="text-[13px] text-text-tertiary font-medium">
                    {proposal.overallImpact}
                  </span>
                </div>

                <p className="text-[13px] text-neutral-300 font-medium leading-relaxed">
                  {proposal.description}
                </p>

                {/* Diffs List */}
                <div className="space-y-2">
                  {proposal.diffs.map((diff, index) => (
                    <div key={index} className="p-3 bg-neutral-800/90 border border-neutral-700/80 rounded-xl space-y-1 text-[13px]">
                      <div className="flex justify-between items-center font-bold text-white">
                        <span>{diff.entity}</span>
                        {diff.tag && (
                          <span className="text-[13px] font-medium bg-neutral-700 px-2 py-0.5 rounded text-neutral-300">
                            {diff.tag}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[13px] pt-1">
                        <div className="text-text-tertiary">
                          <strong className="text-text-tertiary">修改前：</strong>{diff.before}
                        </div>
                        <div className="text-emerald-300 font-semibold">
                          <strong className="text-emerald-500">修改后：</strong>{diff.after}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conflict Alert Warning If Present */}
                {proposal.taskImpact.hasConflict && (
                  <div className="p-3 bg-amber-950/80 border border-amber-700/80 rounded-xl text-[13px] text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <AlertCircle size={15} />
                      <span>检测到工作任务执行冲突：</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-amber-100">
                      {proposal.taskImpact.conflictDetails}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowConflictModal(true)}
                        className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-amber-100 text-[13px] font-bold rounded-lg transition-colors"
                      >
                        查看冲突详情
                      </button>
                    </div>
                  </div>
                )}

                {/* Proposal Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                  <div className="text-[13px] text-text-tertiary">
                    确认后将更新方案版本，并以增量补丁方式更新关联工作任务
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleRejectProposal}
                      className="px-3 py-2 text-text-tertiary hover:text-white text-[13px] font-medium transition-colors"
                    >
                      放弃本次提案
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById("ai-instruction-input");
                        if (textarea) textarea.focus();
                      }}
                      className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[13px] rounded-xl transition-colors border border-neutral-700"
                    >
                      继续告诉AI修改
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyProposal}
                      className="px-4 py-2 bg-surface-1 hover:bg-hover-bg text-text-main font-extrabold text-[13px] rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Check size={15} /> 确认应用提案
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Context Tag Header */}
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary font-medium">本次携带上下文:</span>
              <span className="px-3 py-1 bg-btn-main text-white font-bold rounded-lg flex items-center gap-2 shadow-2xs">
                <span>{selectedContext.name}</span>
                <span className="text-[13px] text-neutral-300 font-normal">
                  (关联 {selectedContext.notesCount} 篇笔记 · {selectedContext.tasksCount} 个任务 · {currentVersion})
                </span>
                {selectedContext.type !== "global" && (
                  <button
                    onClick={handleClearContext}
                    className="hover:text-amber-300 ml-1 text-text-tertiary transition-colors"
                    title="清除上下文（切回全局方案）"
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            </div>

            <span className="text-text-tertiary text-[13px]">
              服务端自动组装账号定位、搜索趋势与关联任务状态
            </span>
          </div>

          {/* Input & Main Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                id="ai-instruction-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGenerateProposal();
                }}
                placeholder='告诉AI你希望如何调整，例如：“品牌号减少2篇，把体验内容分给KOS，核心品类词仍由品牌号负责。”'
                className="w-full h-11 px-4 pr-12 bg-page-bg border border-border-default rounded-xl text-[13px] text-text-main focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-surface-1 transition-all placeholder:text-text-tertiary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-text-tertiary bg-neutral-200/60 px-1.5 py-0.5 rounded">
                ↵ Enter
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={isGenerating || (!userInput.trim() && !proposal)}
              className="h-11 px-5 bg-btn-main hover:bg-black disabled:bg-neutral-300 text-white font-extrabold text-[13px] rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>AI 计算中...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-amber-300" />
                  <span>生成修改提案</span>
                </>
              )}
            </button>

            {/* Primary Workflow Confirmation Button */}
            <button
              type="button"
              onClick={handleMainAction}
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[13px] rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Check size={16} />
              <span>{getBottomButtonText()}</span>
            </button>
          </div>

          <div className="text-[13px] text-text-tertiary pl-1">
            AI会读取关联账号、笔记、关键词、排期和任务状态；确认提案前不会修改当前方案。
          </div>
        </div>
      </motion.div>

      {/* CONFLICT DETAILS MODAL */}
      <AnimatePresence>
        {showConflictModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-1 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border-default"
            >
              <div className="flex justify-between items-start border-b border-border-default pb-3">
                <div className="flex items-center gap-2 text-danger font-black text-[15px]">
                  <AlertCircle size={20} />
                  <span>已执行工作任务冲突说明</span>
                </div>
                <button onClick={() => setShowConflictModal(false)} className="text-text-tertiary hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-[13px] text-text-secondary leading-relaxed">
                <p className="font-semibold text-text-main">
                  发现 1 项关联工作任务已进入执行流程，不可静默覆盖：
                </p>
                <div className="p-3 bg-page-bg rounded-xl border border-border-default space-y-1 font-mono text-[13px]">
                  <div><strong>任务编号：</strong> TASK-20260819-011</div>
                  <div><strong>绑定账号：</strong> 店长号_徐家汇概念店</div>
                  <div><strong>当前状态：</strong> 素材拍摄与文案撰写中</div>
                  <div><strong>内容主题：</strong> 徐家汇店客诉解密：养宠家庭异味来源</div>
                </div>
                <p className="text-text-tertiary">
                  建议方案：保留当前已拍摄素材，仅将发布时间推迟 24 小时，或将拟修改的【顾客问答】作为新增任务。
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
                <button
                  onClick={() => setShowConflictModal(false)}
                  className="px-4 py-2 bg-btn-main text-white font-bold text-[13px] rounded-xl"
                >
                  知道并返回
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
