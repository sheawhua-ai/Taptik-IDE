import React, { useState } from "react";
import { StrategyCopilotDrawer } from '../StrategyCopilotDrawer';
import {
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Activity,
  Target,
  BarChart2,
  Bot,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Play,
  Hash,
  User,
  Users,
  Layers,
  ShieldCheck, Maximize2, Minimize2,
  Plus,
  Settings2,
  FileText,
  X,
  MessageSquare,
  Send,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExecutionResult } from "./ExecutionResult";
import { CustomerConfigDrawer } from "./CustomerConfigDrawer";

export const Strategy: React.FC<{
  hasData?: boolean;
  strategyData?: { word: string; rate: string }[];
}> = ({ hasData = true, strategyData = [] }) => {
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);
  const [showAdjustDrawer, setShowAdjustDrawer] = useState(false);
  const [showCustomerConfig, setShowCustomerConfig] = useState(false);
  
  const [selectedSkill, setSelectedSkill] = useState('美妆搜索种草打法');
  const [showSkillOverviewDrawer, setShowSkillOverviewDrawer] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<{name: string, tag: string, desc: string} | null>(null);
  
  const [selectedTarget, setSelectedTarget] = useState('搜索卡位');
  
  const [showCopilot, setShowCopilot] = useState(false);
  const [formValues, setFormValues] = useState({
    percent1: 70, percent2: 30, amount: 12, days: 7, official: 3, kos: 4, koc_general: 8, koc_real: 5
  });
  
  const handleTargetChange = (t: string) => {
    setSelectedTarget(t);
    if (t === '搜索卡位') setFormValues({percent1: 70, percent2: 30, amount: 12, days: 7, official: 3, kos: 4, koc_general: 8, koc_real: 5});
    else if (t === '爆文起量') setFormValues({percent1: 40, percent2: 60, amount: 20, days: 14, official: 5, kos: 5, koc_general: 5, koc_real: 5});
    else if (t === '线索转化') setFormValues({percent1: 20, percent2: 80, amount: 10, days: 7, official: 4, kos: 4, koc_general: 2, koc_real: 0});
    else if (t === '账号养成') setFormValues({percent1: 50, percent2: 50, amount: 15, days: 30, official: 5, kos: 10, koc_general: 0, koc_real: 0});
  };

  
  
  
  const [isInitialGenerating, setIsInitialGenerating] = useState(false);
  
  const [flowState, setFlowState] = useState<
    "idle" | "diagnosing" | "diagnosis" | "generating" | "suggestion" | "creating" | "done"
  >("idle");
  
  const [cards, setCards] = useState([
    {
      id: "main",
      title: "幼犬换粮避坑搜索卡位",
      desc: "这是当前最适合该商家的自然流切入点。低粉爆款信号正在增强，且品牌卖点可以自然植入。建议直接做内容矩阵铺设，先不进行硬广投流。",
      shortDesc: "当前最适合的自然流切入点",
      label: "推荐优先做"
    },
    {
      id: "backupA",
      title: "真实喂养场景种草",
      desc: "适合素材充足时做。主要依赖用户真实投稿的喂养视频，二次剪辑。",
      shortDesc: "适合素材充足时做",
      label: "备选 A"
    },
    {
      id: "backupB",
      title: "高意向私域承接",
      desc: "适合已有评论和私信积累时做。重点将已有高意向公域用户导流至企微。",
      shortDesc: "适合已有评论和私信积累时做",
      label: "备选 B"
    }
  ]);
  const [activeCardId, setActiveCardId] = useState("main");
  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];
  const inactiveCards = cards.filter(c => c.id !== activeCardId);
  const [adjustMemory, setAdjustMemory] = useState("only_once");
  const [aiInput, setAiInput] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const handleAiSubmit = () => {
    if (!aiInput) return;
    setIsAiThinking(true);
    setTimeout(() => {
      setIsAiThinking(false);
      setAiMessage("没问题，我已经将主攻目标切换为“自然流起量”，并为您调整了客户号的篇数（加至20篇），下方的参数已自动为您更新。");
      setFormValues({ ...formValues, koc_real: 20 });
      setSelectedTarget("自然流起量");
      setAiInput("");
    }, 1500);
  };
  const [diagnosisProgress, setDiagnosisProgress] = useState(0);
  const [generateProgress, setGenerateProgress] = useState(0);

  const startDiagnosis = () => {
    setFlowState("diagnosing");
    setDiagnosisProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDiagnosisProgress(step * 25);
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => setFlowState("suggestion"), 500);
      }
    }, 600);
  };

  const startGenerating = () => {
    setFlowState("generating");
    setGenerateProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGenerateProgress(step * 20);
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(() => setFlowState("running"), 500);
      }
    }, 400);
  };
  
  const startCreating = () => {
    setFlowState("creating");
    setTimeout(() => {
      setFlowState("done");
    }, 2000);
  };


  return (
    <div className="flex flex-col h-full w-full bg-neutral-50/40 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-5">
        <div className="max-w-[1200px] mx-auto space-y-4">
          {/* 方案区 */}
          {flowState === "idle" && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-6">
               <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-2">
                 <Activity size={40} />
               </div>
               <div>
                 <h3 className="text-[18px] font-bold text-neutral-900 mb-3">商家状态诊断</h3>
                 <p className="text-[14px] text-neutral-500 max-w-md mx-auto leading-relaxed">
                   正在读取商家记忆、项目数据、素材状态、历史复盘...
                 </p>
               </div>
               <button 
                 onClick={startDiagnosis}
                 className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
               >
                 <Activity size={16} /> 开始全盘诊断
               </button>
            </div>
          )}

          {flowState === "diagnosing" && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-50"></div>
                <div className="absolute inset-2 bg-primary-200 rounded-full animate-pulse opacity-75"></div>
                <div className="absolute inset-4 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Activity size={32} className="animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-[18px] font-bold text-neutral-900">AI 深度诊断中</h3>
                <p className="text-[14px] text-neutral-500">正在综合评估各项数据指标...</p>
              </div>
              <div className="w-64 space-y-2">
                <div className="flex items-center justify-between text-[12px] text-neutral-600 font-medium">
                  <span>诊断进度</span>
                  <span>{diagnosisProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${diagnosisProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-4 text-[12px] text-neutral-400 font-medium">
                <span className={`flex items-center gap-1 ${diagnosisProgress >= 25 ? 'text-primary-600' : ''}`}><CheckCircle2 size={14}/> 读取商家记忆</span>
                <span className={`flex items-center gap-1 ${diagnosisProgress >= 50 ? 'text-primary-600' : ''}`}><CheckCircle2 size={14}/> 调取历史复盘</span>
                <span className={`flex items-center gap-1 ${diagnosisProgress >= 75 ? 'text-primary-600' : ''}`}><CheckCircle2 size={14}/> 分析素材状态</span>
              </div>
            </div>
          )}

          {["suggestion", "generating", "running", "creating", "done"].includes(flowState) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-neutral-900">商家状态诊断结果</h3>
                  <p className="text-[13px] text-neutral-500 mt-1">发现 3 项核心问题，亟需调整打法</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                  <div className="text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-neutral-400" /> 用户认知断层
                  </div>
                  <div className="text-[14px] text-neutral-900 font-medium leading-relaxed">
                    当前品牌内容偏离了初级养宠用户“通俗易懂”的需求，专业术语过多，跳出率高达 68%。
                  </div>
                </div>
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                  <div className="text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-2">
                    <ImageIcon size={16} className="text-neutral-400" /> 素材枯竭风险
                  </div>
                  <div className="text-[14px] text-neutral-900 font-medium leading-relaxed">
                    真实测评类素材储备仅余 12 组，低于安全线，无法支撑高频的达人分发。
                  </div>
                </div>
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                  <div className="text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-2">
                    <Activity size={16} className="text-neutral-400" /> 转化效率下降
                  </div>
                  <div className="text-[14px] text-neutral-900 font-medium leading-relaxed">
                    近期高意向线索流失率增加，私信导流话术已被平台限流，需更新引流路径。
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {["suggestion", "generating", "running", "creating", "done"].includes(flowState) && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* 主推方案 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="xl:col-span-2 bg-white rounded-3xl border border-primary-100 p-5 shadow-sm relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
                  <Target size={160} />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 text-primary-700 font-bold mb-4 text-[13px] bg-primary-50 px-3 py-1.5 rounded-full w-fit">
                      <Bot size={16} /> {activeCard.label}
                    </div>
                    <h3 className="text-[28px] font-bold text-neutral-900 mb-4 tracking-tight">
                      {activeCard.title}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[14px] font-bold text-neutral-900 mb-2">为什么做：</div>
                        <div className="text-[14px] text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                          {activeCard.desc}
                        </div>
                      </div>
                      

                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-3">
                      {(flowState === "suggestion") && (
                        <button
                          onClick={() => {
                            startGenerating();
                          }}
                          className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          <Play size={16} /> 采用方案并创建项目
                        </button>
                      )}
                      {(flowState === "generating" || flowState === "running") && (
                        <div className="px-6 py-3.5 bg-primary-50 text-primary-700 rounded-xl text-[14px] font-bold flex items-center gap-2 border border-primary-100">
                          <CheckCircle2 size={16} /> 项目已创建
                        </div>
                      )}
                      
                      <button
                        onClick={() => setShowAdjustDrawer(true)}
                        className="px-6 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2 shadow-sm"
                        disabled={flowState !== "suggestion"}
                      >
                        <Settings2 size={16} /> 调整方案
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => setShowEvidenceDrawer(true)}
                        className="px-4 py-3.5 text-primary-600 text-[13px] font-bold hover:bg-primary-50 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        为什么推荐这个方向？ <ChevronRight size={16} />
                      </button>
                    </div>
                 </div>
              </motion.div>

              {/* 备选方案 */}
              <div className="flex flex-col gap-4">
                {inactiveCards.map(card => (
                  <div key={card.id} className={`bg-white rounded-3xl border p-6 shadow-sm transition-colors group ${flowState === "suggestion" ? "border-neutral-200 hover:border-primary-200 cursor-pointer" : "border-neutral-200 opacity-50 cursor-not-allowed"}`} onClick={() => { if(flowState === "suggestion") { setActiveCardId(card.id); } }}>
                    <div className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">{card.label}</div>
                    <h4 className="text-[18px] font-bold text-neutral-900 mb-2">{card.title}</h4>
                    <p className="text-[13px] text-neutral-500 mb-4">{card.shortDesc}</p>
                    {flowState === "suggestion" && <div className="text-[13px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">选择此方向 <ArrowRight size={16} /></div>}
                  </div>
                ))}
                {flowState === "suggestion" && (
                  <button onClick={() => setShowCopilot(true)} className="mt-2 text-[13px] font-bold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-2 bg-white border border-neutral-200 py-4 rounded-3xl border-dashed hover:border-neutral-300 transition-colors">
                     <Plus size={18} /> 新建项目流
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. 生成中 / 生成完成 (显示在底部) */}
          {(flowState === "generating" || flowState === "running") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-primary-200 p-5 shadow-xl mt-8"
            >
              {flowState === "generating" ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[20px] font-semibold text-neutral-900 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                        正在生成起盘任务...
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${generateProgress}%` }}
                      />
                    </div>
                    <div className="text-[13px] text-neutral-500 font-mono space-y-2">
                      <div className={generateProgress > 0 ? "text-neutral-700" : "text-neutral-300"}>
                        {generateProgress > 0 && "> "}正在生成 1 个项目流和 12 个内容任务...
                      </div>
                      <div className={generateProgress > 20 ? "text-neutral-700" : "text-neutral-300"}>
                        {generateProgress > 20 && "> "}正在生成 8 个素材需求并同步至素材库...
                      </div>
                      <div className={generateProgress > 50 ? "text-neutral-700" : "text-neutral-300"}>
                        {generateProgress > 50 && "> "}正在分配 A01、A02、A05 的 3 个账号排期...
                      </div>
                      <div className={generateProgress > 80 ? "text-neutral-700" : "text-neutral-300"}>
                        {generateProgress > 80 && "> "}正在创建 2 个协同确认任务...
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
                    <CheckCircle2 className="text-neutral-900" size={24} /> 本轮起盘单：幼犬换粮避坑搜索卡位
                  </h3>
                  
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                    <div className="mb-4 pb-6 border-b border-neutral-100">
                      <h4 className="text-[13px] font-bold text-neutral-500 mb-2">目标：</h4>
                      <p className="text-[15px] text-neutral-800 leading-relaxed">
                        用 7 天时间铺 20 篇内容，抢占“幼犬换粮软便 / 幼犬不吃粮 / 换粮拉稀”等长尾搜索词。
                      </p>
                    </div>

                    <div className="mb-4 pb-6 border-b border-neutral-100">
                      <h4 className="text-[13px] font-bold text-neutral-500 mb-4">账号组合：</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">专业号 <span className="text-primary-600">3 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">建立可信度</div>
                          <div className="text-[11px] text-neutral-400">专业科普打法 · 品牌素材库</div>
                        </div>
                        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">员工号 <span className="text-primary-600">4 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">补充服务视角</div>
                          <div className="text-[11px] text-neutral-400">顾问经验打法 · 需门店场景</div>
                        </div>
                        <div className="bg-neutral-100/50 p-4 rounded-xl border border-neutral-200/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">KOC矩阵 <span className="text-neutral-900">8 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">铺真实体验</div>
                          <div className="text-[11px] text-neutral-400">泛生活种草 · 人工预设人设</div>
                        </div>
                        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">客户号 <span className="text-primary-600">5 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">现身说法</div>
                          <div className="text-[11px] text-neutral-400">即时生成打法 · 现场扫码发</div>
                        </div>
                      </div>
                      
                      {formValues.koc_real > 0 && (
                        <div className="mt-4 bg-white border border-neutral-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                           <div>
                             <h5 className="font-bold text-[15px] text-neutral-900 mb-1.5 flex items-center gap-2">真实客户发布 · {formValues.koc_real}篇 <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">待确认</span></h5>
                             <div className="text-[13px] text-neutral-500 space-y-1.5">
                               <p>• 需要{formValues.koc_real}位真实客户，每人发布1篇</p>
                               <p>• 已生成5个动态问题，覆盖：首次体验、复购反馈、真实顾虑、使用过程</p>
                               <p>• 每人限领1次，客户H5方案待确认</p>
                             </div>
                           </div>
                           <div className="flex flex-col gap-2.5">
                             <button onClick={() => setShowCustomerConfig(true)} className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-[13px] font-bold hover:bg-primary-700 transition-colors shadow-sm">查看与确认</button>
                             <button className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">手机端预览</button>
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100">
                      <h4 className="text-[13px] font-bold text-primary-800 mb-2 flex items-center gap-1.5"><AlertCircle size={14} /> 当前最大前置条件：</h4>
                      <ul className="text-[13px] text-primary-700 space-y-1.5 font-medium">
                        <li>• 泛素人需要先预设账号人设</li>
                        <li>• 真实客户需要现场扫码</li>
                        <li>• KOS 需要确认营养顾问人设</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => {
                        setFlowState("creating");
                        setTimeout(() => {
                           window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'execution' } }));
                        }, 2500);
                      }} 
                      className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                    >
                      创建项目档案并生成队列 <ArrowRight size={16} />
                    </button>
                    
                    <button onClick={() => setShowCopilot(true)} className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">新建项目流</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          {flowState === "creating" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center py-6 space-y-4"
            >
              <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-100 animate-pulse opacity-50" />
                <Layers size={32} className="relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-[18px] font-bold text-neutral-900">正在创建项目档案与执行队列...</h3>
                <p className="text-[14px] text-neutral-500">已将素材需求下发，等待分配执行账号</p>
              </div>
              <div className="w-64 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                 <div className="h-full bg-primary-600 rounded-full animate-[progress_2.5s_ease-in-out_forwards]" style={{ width: '100%' }} />
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* 为什么推荐这个方向 Drawer */}      {/* 为什么推荐这个方向 Drawer */}
      <AnimatePresence>
        {showEvidenceDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEvidenceDrawer(false)}
              className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className={`absolute top-0 right-0 bottom-0 ${isFullScreen ? 'w-full' : 'w-full max-w-[440px]'} transition-all duration-300 bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200`}
            >
              <div className="shrink-0 border-b border-neutral-100 p-6 relative">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setShowEvidenceDrawer(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl text-primary-600 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-neutral-900">推荐依据</h2>
                </div>
                <p className="text-[13px] text-neutral-500">
                  基于以下维度生成的“幼犬换粮避坑搜索卡位”方案
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="space-y-2">
                  <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <User size={14} /> 商家画像
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                    <div className="text-[13px] text-neutral-700 leading-relaxed">目标人群是新手犬主，核心顾虑是软便和换粮失败。</div>
                    <button className="mt-3 text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">查看来源 <ArrowRight size={14} /></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Activity size={14} /> 搜索机会
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                    <div className="text-[13px] text-neutral-700 leading-relaxed">“幼犬换粮软便”、“幼犬不吃粮怎么办”等长尾词搜索量上升 32%。</div>
                    <button className="mt-3 text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">查看来源 <ArrowRight size={14} /></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Users size={14} /> 账号条件
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                    <div className="text-[13px] text-neutral-700 leading-relaxed">A01 测评号适合承接避坑内容，A05 专业号适合承接科普内容，当前排期空闲。</div>
                    <button className="mt-3 text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">查看来源 <ArrowRight size={14} /></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FileText size={14} /> 素材条件
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                    <div className="text-[13px] text-neutral-700 leading-relaxed">现有素材覆盖率 70%，缺失真实喂食和便便状态场景图。</div>
                    <button className="mt-3 text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">查看来源 <ArrowRight size={14} /></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <ShieldCheck size={14} /> 风险提醒
                  </h3>
                  <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
                    <div className="text-[13px] text-primary-800 leading-relaxed">品牌属于宠物食品，内容生成时不能承诺治疗效果，避免绝对化功效表达。</div>
                    <button className="mt-3 text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">查看来源 <ArrowRight size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 调整方案 Drawer */}
      <AnimatePresence>
        {showAdjustDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdjustDrawer(false)}
              className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className={`fixed top-0 right-0 bottom-0 ${isFullScreen ? 'w-full' : 'w-full max-w-[500px]'} transition-all duration-300 bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200`}
            >
              <div className="shrink-0 border-b border-neutral-100 p-6 relative">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setShowAdjustDrawer(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-neutral-100 rounded-xl text-neutral-700 flex items-center justify-center">
                    <Settings2 size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-neutral-900">调整方案参数</h2>
                </div>
                <p className="text-[13px] text-neutral-500">
                  修改运营参数，系统将重新生成对应的起盘计划
                </p>

                {/* 智能 Assistant Chat inside Adjust Drawer */}
                <div className="mt-4 p-4 bg-primary-50/50 rounded-xl border border-primary-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-primary-600" />
                    <span className="text-[13px] font-bold text-primary-900">操盘副手</span>
                  </div>
                  
                  {isAiThinking ? (
                    <div className="text-[13px] text-primary-800 bg-white p-3 rounded-lg border border-primary-100 shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <span className="ml-1">正在理解您的意图并调整参数...</span>
                    </div>
                  ) : aiMessage ? (
                    <div className="text-[13px] text-primary-800 bg-white p-3 rounded-lg border border-primary-100 shadow-sm leading-relaxed">
                      {aiMessage}
                    </div>
                  ) : (
                    <div className="text-[13px] text-primary-800 bg-white p-3 rounded-lg border border-primary-100 shadow-sm leading-relaxed">
                      您可以直接告诉我怎么调整，例如：“把真实客户的篇数加到 20 篇”，或者“更偏向自然流起量”。我会自动帮您修改下方的参数。
                    </div>
                  )}

                  <div className="relative mt-1">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiInput) handleAiSubmit();
                      }}
                      placeholder="输入您的调整需求..." 
                      className="w-full bg-white border border-primary-200 rounded-lg pl-3 pr-10 py-2 text-[13px] focus:outline-none focus:border-primary-400"
                    />
                    <button 
                      onClick={handleAiSubmit}
                      disabled={!aiInput || isAiThinking}
                      className="absolute right-2 top-1/2 -tranneutral-y-1/2 text-primary-600 hover:text-primary-700 disabled:text-primary-300 bg-primary-50 p-1 rounded-md transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">主攻目标</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['搜索卡位', '爆文起量', '线索转化', '账号养成'].map(t => (
                        <button key={t} onClick={() => handleTargetChange(t)} className={`py-2 px-3 text-[13px] font-medium rounded-lg border text-center transition-colors ${t === selectedTarget ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">内容比例与执行</label>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex-1">
                          <div className="text-[12px] text-neutral-500 mb-1">素人口吻</div>
                          <div className="text-[16px] font-bold text-neutral-900">{formValues.percent1}%</div>
                        </div>
                        <div className="w-[1px] h-8 bg-neutral-100" />
                        <div className="flex-1">
                          <div className="text-[12px] text-neutral-500 mb-1">专业科普</div>
                          <div className="text-[16px] font-bold text-neutral-900">{formValues.percent2}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
                        <div className="flex-1">
                          <div className="text-[12px] text-neutral-500 mb-1">总内容数量</div>
                          <div className="text-[16px] font-bold text-neutral-900">{formValues.amount} 篇</div>
                        </div>
                        <div className="w-[1px] h-8 bg-neutral-100" />
                        <div className="flex-1">
                          <div className="text-[12px] text-neutral-500 mb-1">执行周期</div>
                          <div className="text-[16px] font-bold text-neutral-900">{formValues.days} 天</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-2">账号矩阵与内容策略 <span className="text-[11px] font-normal text-primary-600 bg-primary-50 px-2 py-0.5 rounded">系统自动调优</span></label>
                    <div className="space-y-3">
                      
                      {/* 专业号 */}
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500"></span>专业号</span>
                          <span className="text-[16px] font-bold text-neutral-900">{formValues.official} 篇</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5">
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>品牌背书、专业成分科普</p></div>
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">素材操作：</span>选用官方精美海报、高清素材或棚拍</p></div>
                        </div>
                      </div>

                      {/* 员工号 */}
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500"></span>员工号</span>
                          <span className="text-[16px] font-bold text-neutral-900">{formValues.kos} 篇</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5">
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>测评对比、避坑指南、个人养宠经验</p></div>
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">素材操作：</span>员工领取实拍任务，回传生活化场景配图</p></div>
                        </div>
                      </div>

                      {/* KOC矩阵 */}
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-neutral-900"></span>KOC矩阵</span>
                          <span className="text-[16px] font-bold text-neutral-900">{formValues.koc_general} 篇</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5">
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>真实反馈、软便改善记录、挑食应对过程</p></div>
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">分发路径：</span>系统下发要求 &rarr; KOC 回传 &rarr; 系统校验排版</p></div>
                        </div>
                      </div>

                      {/* 客户号 */}
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500"></span>客户号 (现场快发)</span>
                          <span className="text-[16px] font-bold text-neutral-900">{formValues.koc_real} 篇</span>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5">
                          <div className="flex gap-2"><span className="text-primary-500 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>门店现身说法、真实购买记录</p></div>
                          <div className="flex gap-2"><span className="text-primary-500 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">分发路径：</span>生成动态体验码 &rarr; 现场扫码 &rarr; 即时合成文案发布</p></div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">风险边界 (系统预置)</label>
                    <div className="space-y-2">
                       <div className="text-[13px] text-neutral-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-primary-400" /> 不能承诺治疗</div>
                       <div className="text-[13px] text-neutral-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-primary-400" /> 不提竞品</div>
                       <div className="text-[13px] text-neutral-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-primary-400" /> 不使用夸张功效词</div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="shrink-0 border-t border-neutral-100 p-6 bg-neutral-50/50 space-y-4">
                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">是否记住这次调整？</div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={adjustMemory === 'only_once'} onChange={() => setAdjustMemory('only_once')} className="accent-primary-600" />
                      <span className="text-[13px] text-neutral-700">仅本次使用</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={adjustMemory === 'merchant'} onChange={() => setAdjustMemory('merchant')} className="accent-primary-600" />
                      <span className="text-[13px] text-neutral-700">记为该商家偏好</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={adjustMemory === 'team'} onChange={() => setAdjustMemory('team')} className="accent-primary-600" />
                      <span className="text-[13px] text-neutral-700">提交为团队打法</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAdjustDrawer(false);
                    startGenerating();
                  }}
                  className="w-full py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95"
                >
                  确认修改，重新生成起盘清单
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Skill 概览 Drawer */}
      <AnimatePresence>
        {showSkillOverviewDrawer && previewSkill && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkillOverviewDrawer(false)}
              className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-[440px] bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200"
            >
              <div className="shrink-0 border-b border-neutral-100 p-6 relative">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setShowSkillOverviewDrawer(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl text-primary-600 flex items-center justify-center">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-neutral-900">{previewSkill.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
                        {previewSkill.tag}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-neutral-500 mt-3">
                  {previewSkill.desc}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[13px] font-bold text-neutral-900 mb-2">打法核心逻辑</h3>
                    <div className="text-[13px] text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      通过在小红书铺设长尾搜索词的内容矩阵，卡位搜索流量，并通过高意向用户的私域导流实现转化。重素人真实反馈，轻专业背书。
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold text-neutral-900 mb-3">默认内容配比</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-neutral-600 flex items-center gap-2"><User size={14} className="text-neutral-400"/>素人真实体验</span>
                        <span className="font-medium text-neutral-900">70%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-400 w-[70%]" />
                      </div>
                      
                      <div className="flex items-center justify-between text-[13px] pt-2">
                        <span className="text-neutral-600 flex items-center gap-2"><Bot size={14} className="text-neutral-400"/>专业医生科普</span>
                        <span className="font-medium text-neutral-900">30%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-neutral-400 w-[30%]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold text-neutral-900 mb-2">默认风险拦截规则</h3>
                    <ul className="space-y-2 text-[13px] text-neutral-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-neutral-900 shrink-0" />
                        拦截所有“包治百病”、“首选”等绝对化词汇
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-neutral-900 shrink-0" />
                        避开直接点名竞品进行拉踩的内容
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-neutral-900 shrink-0" />
                        医药相关描述需符合最新广告法规范
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-neutral-100 p-6">
                <button
                  onClick={() => {
                    setSelectedSkill(previewSkill.name);
                    setShowSkillOverviewDrawer(false);
                    // Reset flow state when changing skill
                    if (flowState !== "suggestion") {
                        setFlowState("suggestion");
                    }
                  }}
                  className="w-full py-3.5 bg-primary-600 text-white rounded-xl text-[14px] font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 active:scale-95"
                >
                  {selectedSkill === previewSkill.name ? '当前已应用此打法' : '应用此打法'}
                </button>
              </div>
            </motion.div>
          </>
        )}
        {showCopilot && <StrategyCopilotDrawer onClose={() => setShowCopilot(false)} isNewProject={false} />}
        
        <CustomerConfigDrawer 
          isOpen={showCustomerConfig} 
          onClose={() => setShowCustomerConfig(false)}
          onConfirm={() => {
            setShowCustomerConfig(false);
            setFlowState("creating");
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'execution' } }));
            }, 2500);
          }}
          planAmount={formValues.koc_real}
        />
      </AnimatePresence>
    </div>
  );
};
