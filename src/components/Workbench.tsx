import React, { useState } from 'react';
import { 
  Search, Sparkles, Zap, ArrowRight, Target, BarChart2, 
  Workflow, Layers, MessageSquare, Filter, Star, Orbit,
  Compass, Lightbulb, ZapOff, Bot, Brain, LayoutGrid, RefreshCw,
  ShieldCheck, ArrowUpRight, Cpu, Activity, Share2, CheckCircle2,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: any) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  setOnboardingData: (data: any) => void;
  activeProjectId: string;
}

const SKILL_SHORTCUTS = [
  { 
    id: 'blueocean', 
    name: '蓝海词探测', 
    icon: Target, 
    desc: '深度扫描小红书潜力长尾词', 
    color: 'text-primary-500', 
    bg: 'bg-primary-50',
    nav: 'workflow',
    subNav: 'strategy'
  },
  { 
    id: 'content', 
    name: '爆文生成引擎', 
    icon: Sparkles, 
    desc: '基于行业热点合成网感笔记', 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    nav: 'workflow',
    subNav: 'content'
  },
  { 
    id: 'roi', 
    name: '全链路归因', 
    icon: Workflow, 
    desc: '打通曝光到转化的数据黑盒', 
    color: 'text-secondary-500', 
    bg: 'bg-secondary-50',
    nav: 'workflow',
    subNav: 'metrics'
  },
];

const SUGGESTIONS = [
  "为我的宠物零食寻找蓝海关键词",
  "分析行业竞品爆款笔记逻辑",
  "生成 5 篇改写后的爆文草稿",
  "查看当前商户的小红书收录监测"
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, onboardingStep, setOnboardingStep, setOnboardingData, activeProjectId }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isNewMerchant = activeProjectId === 'new-merchant';

  const NEW_USER_SUGGESTIONS = [
    "我想开始运营「宠物粮」品牌",
    "帮我看看本周「美妆」赛道的蓝海词",
    "分析竞争对手「奈雪」的笔记逻辑",
    "我刚上线一款「防晒喷雾」，怎么写笔记？"
  ];

  const onboardingSteps = [
    { 
      title: "第一步：业务探查", 
      desc: "扫描您的细分行业，找准当前生意在小红书的增长坐标", 
      icon: Search, 
      action: "开启业务探查",
      nav: "workflow",
      subNav: "strategy"
    },
    { 
      title: "第二步：主体授权", 
      desc: "连接您的小红书账号或商户，让智策获取运营权限", 
      icon: LayoutGrid, 
      action: "去授权主体",
      nav: "assets",
      subNav: null
    },
    { 
      title: "第三步：内容智造", 
      desc: "基于选题意图，一键生成符合小红书网感的运营初稿", 
      icon: Sparkles, 
      action: "立刻生成爆文",
      nav: "workflow",
      subNav: "content"
    }
  ];

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const handleShortcutClick = (nav: string, subNav: string) => {
    setActiveNav(nav);
    setDataSubNav(subNav);
    if (onboardingStep < 3) setOnboardingStep(onboardingStep + 1);
  };

  const handleExecute = () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    setAiAdvice(null);

    // Simulate AI Processing & Semantic Understanding
    setTimeout(() => {
      // High-level operational advice based on query
      if (query.includes('宠')) {
        setAiAdvice("检测到您处于「宠物行业 - 成长期」。建议重点布局「成分测评」与「养宠避坑」场景，以建立专业心智。");
      } else if (query.includes('美')) {
        setAiAdvice("您的业务属于「美妆行业 - 存量竞争期」。建议通过「跨界联名」或「极简护肤」差异化定位突破流量红海。");
      } else {
        setAiAdvice("基于语义识别，您的品牌目前处于「市场探索期」。建议先进行 5-7 天的小样本试错，找准核心爆款潜质词。");
      }

      if (isNewMerchant && onboardingStep < 3) {
        const topic = query.match(/「(.+?)」/)?.[1] || "精选赛道";
        setOnboardingData((prev: any) => ({
          ...prev,
          strategyKeywords: [
            { word: `${topic}高性价比挖掘`, rate: '94' },
            { word: `${topic}避坑攻略`, rate: '82' },
            { word: `平替${topic}推荐`, rate: '78' }
          ]
        }));
        setOnboardingStep(1); // Moving to next step after initial exploration
        // Note: For a real app we might not change nav immediately if we want to show advice first
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-white overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full px-8 py-16 space-y-20">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-primary-100">
             <Star size={12} className="fill-current" />
             AI Agents Command Hub
          </div>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-[1.1]">
            {onboardingStep === 0 ? "智策系统：业务初探" : 
             onboardingStep < 3 ? "情报正在涌现，" : "专注决策与助手协同"}
            <br/>
            <span className="text-neutral-300 text-3xl">
              {onboardingStep === 0 ? "下达高阶指令，让 AI 为您梳理生意增长蓝图。" : 
               onboardingStep === 1 ? "授权您的商户主体，锁定流量归因链路。" :
               "智能助手已就绪，请输入指令处理业务。"}
            </span>
          </h1>
        </motion.div>

        {/* Command Center - Codex Style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-10">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[48px] blur-2xl opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border border-neutral-200 rounded-[48px] shadow-2xl p-4 overflow-hidden">
               <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-900 opacity-5 group-focus-within:opacity-100 transition-opacity"></div>
               
               <div className="flex items-center px-6 py-6 gap-6">
                 <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-focus-within:text-neutral-900 transition-colors">
                    <Cpu size={32} />
                 </div>
                 <input 
                   id="onboarding-input-trigger"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder={isNewMerchant ? "输入品类，如：「户外运动」，开启业务探查..." : "在此输入指令调用 Agent 流水线..."}
                   className="flex-1 bg-transparent border-none outline-none text-2xl xl:text-3xl font-black placeholder:text-neutral-200 text-neutral-900 tracking-tighter"
                   onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                 />
                 <button 
                   onClick={handleExecute}
                   disabled={isProcessing}
                   className="bg-neutral-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-primary-500 transition-all shadow-xl disabled:opacity-50"
                 >
                   {isProcessing ? <RefreshCw className="animate-spin" size={24} /> : <ArrowRight size={28} />}
                 </button>
               </div>
               
               <AnimatePresence>
                 {aiAdvice && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }} 
                     animate={{ height: 'auto', opacity: 1 }} 
                     className="px-10 pb-6 border-t border-neutral-50 pt-6"
                   >
                     <div className="p-5 bg-neutral-900 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                           <Bot size={80} className="text-primary-500" />
                        </div>
                        <div className="relative z-10 flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
                              <Sparkles size={16} />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">智探研判 · 建议方案</div>
                              <p className="text-[14px] font-bold leading-relaxed">{aiAdvice}</p>
                              <div className="mt-4 flex gap-3">
                                 <button 
                                   onClick={() => {
                                      setActiveNav('workflow');
                                      setDataSubNav('strategy');
                                   }}
                                   className="px-4 py-1.5 bg-white text-neutral-900 text-[11px] font-black rounded-full hover:bg-primary-500 hover:text-white transition-all"
                                 >
                                    一键生成该策略蓝图
                                 </button>
                                 <button className="px-4 py-1.5 bg-white/10 text-white/60 text-[11px] font-black rounded-full hover:bg-white/20 transition-all">
                                    进一步细化
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="px-10 pb-4 flex items-center gap-4 overflow-x-auto no-scrollbar border-t border-neutral-50 pt-4">
                 <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] shrink-0">业务示例:</span>
                 {(isNewMerchant ? NEW_USER_SUGGESTIONS : SUGGESTIONS).map((s, i) => (
                   <button 
                     key={i} 
                     onClick={() => setQuery(s)}
                     className="px-4 py-1.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl text-[12px] font-bold text-neutral-500 transition-all border border-neutral-100/50 flex-shrink-0"
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>

        {/* Onboarding Guide (Only for new users) */}
        {isNewMerchant && onboardingStep < 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-100 -translate-y-1/2 hidden md:block z-0" />
            {onboardingSteps.map((step, i) => {
              const isActive = onboardingStep === i;
              const isCompleted = onboardingStep > i;
              return (
                <div key={i} className={`relative z-10 bg-white border p-10 rounded-[56px] transition-all duration-500 flex flex-col items-center text-center ${isActive ? 'border-primary-500 shadow-2xl scale-105 ring-4 ring-primary-500/5' : isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-neutral-100 opacity-30 grayscale'}`}>
                  {isCompleted && <div className="absolute top-6 right-6 text-emerald-500"><CheckCircle2 size={24} /></div>}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all ${isActive ? 'bg-neutral-900 text-white shadow-xl' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-300'}`}>
                    <step.icon size={32} />
                  </div>
                  <div className="mb-8">
                    <h4 className={`text-lg font-black mb-2 ${isCompleted ? 'text-emerald-700' : 'text-neutral-900'}`}>{step.title}</h4>
                    <p className="text-[12px] text-neutral-400 font-bold leading-relaxed">{step.desc}</p>
                  </div>
                  {isActive && (
                    <button 
                      onClick={() => handleShortcutClick(step.nav, step.subNav || '')}
                      className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-[14px] font-black shadow-lg hover:bg-neutral-800 transition-all"
                    >
                      {step.action}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}


        {/* Knowledge & Context Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-neutral-50 rounded-[48px] border border-neutral-100 group hover:border-primary-500/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:text-primary-500 transition-colors">
                    <Database size={24} />
                 </div>
                 <h3 className="text-xl font-black text-neutral-900 tracking-tight">知识调用 (Context)</h3>
              </div>
              <p className="text-[13px] text-neutral-500 font-bold leading-relaxed mb-8">
                 Agent 将根据您的指令，自动检索 LanceDB 向量库中的商家共享文档或您的个人灵感片断。
              </p>
              <button 
                onClick={() => setActiveNav('files')}
                className="text-[13px] font-black text-neutral-900 flex items-center gap-2 hover:gap-3 transition-all"
              >
                 管理底层知识 <ArrowRight size={16} />
              </button>
           </div>

           <div className="p-10 bg-neutral-50 rounded-[48px] border border-neutral-100 group hover:border-primary-500/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:text-primary-500 transition-colors">
                    <Layers size={24} />
                 </div>
                 <h3 className="text-xl font-black text-neutral-900 tracking-tight">插件集成 (Skills)</h3>
              </div>
              <p className="text-[13px] text-neutral-500 font-bold leading-relaxed mb-8">
                 开启高阶 Skill 后，您可以在对话框中通过「/」指令直接调用复杂的业务原子操作。
              </p>
              <button 
                onClick={() => setActiveNav('skills')}
                className="text-[13px] font-black text-neutral-900 flex items-center gap-2 hover:gap-3 transition-all"
              >
                 进入能力市场 <ArrowRight size={16} />
              </button>
           </div>
        </div>

        {/* Action Shortcuts */}
        <div className="space-y-8">
           <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2 font-mono uppercase">
              <Zap size={20} className="text-primary-500" />
              Quick Actions
           </h3>
           <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {['蓝海词', '改写', '归因', '清洗', '监测', '研判'].map((action, i) => (
                 <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white border border-neutral-100 rounded-3xl hover:border-primary-500/30 hover:shadow-lg transition-all">
                    <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400">
                       <Zap size={18} />
                    </div>
                    <span className="text-[12px] font-black text-neutral-700">{action}</span>
                 </button>
              ))}
           </div>
        </div>

        {/* Footer info */}
        <div className="pt-10 border-t border-neutral-100 flex items-center justify-between text-[11px] font-black text-neutral-300 uppercase tracking-widest">
           <span>智策系统 v2.1 | Alpha Command Center</span>
           <div className="flex gap-6">
              <span className="flex items-center gap-2 font-bold text-success-600 bg-success-50 px-2 py-1 rounded">RAG Hybrid Search Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};
