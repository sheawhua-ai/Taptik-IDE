import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Target, BarChart2, Workflow, MessageSquare,
  Compass, Lightbulb, Bot, LayoutGrid, Cpu, Share2, PanelLeftClose, PanelRightClose,
  User, Send, FileText, Plus, Check, CalendarDays, LineChart, PanelLeftOpen, PanelRightOpen, History, FolderOpen, Brain, BookOpen, ArrowUpRight,
  ChevronRight, Wrench, BrainCircuit, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FunctionNav } from './command-center/FunctionNav';
import { CommandDirectory } from './command-center/CommandDirectory';
import { SubagentMacroPanel } from './command-center/SubagentMacroPanel';

type AgentThought = {
  id: string;
  type: 'think' | 'tool_call';
  content: string;
  result?: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  time: string;
  thoughts?: AgentThought[];
  isThinking?: boolean;
};

const ThoughtsBlock = ({ thoughts, isThinking }: { thoughts: AgentThought[], isThinking: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="mb-3 border border-neutral-200 rounded-2xl overflow-hidden bg-neutral-50/50">
       <button 
         onClick={() => setExpanded(!expanded)}
         className="w-full flex items-center justify-between p-3 hover:bg-neutral-100/50 transition-colors"
       >
          <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-600">
             {isThinking ? (
                <div className="animate-spin text-neutral-400">
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full" />
                </div>
             ) : (
                <CheckCircle2 size={16} className="text-emerald-500" />
             )}
             <span>
               思考过程 ({thoughts.filter(t => t.type === 'think').length}) · 
               调用工具 ({thoughts.filter(t => t.type === 'tool_call').length})
             </span>
          </div>
          <ChevronRight size={16} className={`text-neutral-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
       </button>
       
       {expanded && (
         <div className="p-4 pt-0 border-t border-neutral-200/50 space-y-3 mt-1">
           {thoughts.map(t => (
             <div key={t.id} className="flex items-start gap-3 text-[13px]">
                <div className="mt-0.5 shrink-0">
                  {t.type === 'think' ? (
                     <BrainCircuit size={14} className="text-purple-500" />
                  ) : (
                     <Wrench size={14} className="text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                   <div className="font-bold text-neutral-700">{t.content}</div>
                   {t.result && (
                     <div className="font-mono text-[11px] text-neutral-500 bg-white border border-neutral-200 p-2 rounded-lg max-h-24 overflow-y-auto whitespace-pre-wrap">
                       {t.result}
                     </div>
                   )}
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: any) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  setOnboardingData: (data: any) => void;
  activeProjectId: string;
}

const SUGGESTIONS = [
  "分析我的宠物零食笔记最近一周的互动趋势",
  "为美妆护肤行业寻找蓝海关键词",
  "生成 5 篇改写后的爆文草稿",
  "查看当前商户的小红书收录监测",
  "帮我审核待发布的素材内容",
  "查看这个月的笔记发布日历",
  "对比我和竞品账号的互动率",
  "派发素材拍摄任务给运营团队",
];

const CAPSULES = [
  { label: '找蓝海关键词', cmd: '为 [行业名称] 寻找潜力蓝海关键词' },
  { label: '生成爆文', cmd: '生成 5 篇符合小红书网感的爆文草稿' },
  { label: '分析笔记趋势', cmd: '分析 [笔记链接] 最近一周的互动变化' },
  { label: '查看素材审核', cmd: '查看待审核的图文与视频素材' },
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, onboardingStep, setOnboardingStep, setOnboardingData, activeProjectId }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [leftTab, setLeftTab] = useState<'history' | 'assets'>('history');
  
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [rightExpanded, setRightExpanded] = useState(false);
  
  const [isFunctionNavOpen, setIsFunctionNavOpen] = useState(false);
  const [isCommandDirOpen, setIsCommandDirOpen] = useState(false);
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);

  // Rotating placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (isInputFocused || query) return;
    const timer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isInputFocused, query]);

  // Keyboard shortcut for FunctionNav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsFunctionNavOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isNewMerchant = activeProjectId === 'new-merchant';

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (activeProjectId === 'new-merchant') {
      setMessages([
        { id: '1', role: 'agent', content: '您好！我是您的 Taptik 智能大脑。作为一个新入驻项目，我们可以先从基础的数据诊断和对标分析开始。', time: '刚才' }
      ]);
    } else {
      setMessages([
        { id: '1', role: 'agent', content: '指挥官，根据最新数据巡航，我为您准备了 3 条主动业务建议。您可以直接处理，或在下方输入框自由指挥我。', time: '刚才' }
      ]);
    }
  }, [activeProjectId]);

  const [proactiveSuggestions] = useState([
    { 
      id: 's1', 
      type: 'emergency', 
      title: '笔记互动率异常', 
      desc: '您最近发布的 3 篇「宠物粮」笔记互动量下降了 15%，疑被平台限流。',
      action: '立即排查',
      cmd: '分析最近 3 篇宠物粮笔记的互动下降原因并给出方案'
    },
    { 
      id: 's2', 
      type: 'attention', 
      title: '发现竞品动态', 
      desc: '对标账号「奈雪的茶」刚发布了新品首发笔记，预计 1 小时后达到热度高峰。',
      action: '拆解爆文',
      cmd: '拆解竞品奈雪的茶最新笔记，提取网感标题与结构模板'
    },
    { 
      id: 's3', 
      type: 'info', 
      title: '优化排期建议', 
      desc: '基于下周目标人群活跃度预测，建议将周五的发布时间从 18:00 提前至 10:00。',
      action: '调整排期',
      cmd: '更新下周五笔记的发布排期表至早 10:00'
    }
  ]);

  const handleExecute = (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    const userMsgId = Date.now().toString();
    const agentMsgId = (Date.now() + 1).toString();

    const newMsg: ChatMessage = { id: userMsgId, role: 'user', content: finalQuery, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    
    // Add pending agent message
    const agentMsg: ChatMessage = {
       id: agentMsgId,
       role: 'agent',
       content: '',
       time: '刚才',
       isThinking: true,
       thoughts: []
    };
    
    setMessages(prev => [...prev, agentMsg]);
    setIsProcessing(true);

    const stages = [
      { type: 'think' as const, content: '分析用户意图，拆解任务目标...' },
      { type: 'tool_call' as const, content: '正在调用数据检索工具 (fetch_merchant_data)' },
      { type: 'think' as const, content: '获取到当前项目的运营数据，准备对应的小红书爆文案例' },
      { type: 'tool_call' as const, content: '正在调用案例库匹配 (search_case_study)' },
      { type: 'think' as const, content: '综合数据，生成优化策略方案' }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < stages.length) {
         setMessages(prev => prev.map(m => {
           if (m.id === agentMsgId) {
             const newThoughts = [...(m.thoughts || []), { id: `t${step}`, result: step % 2 !== 0 ? '{\n  "status": "success",\n  "records": 12,\n  "cache": "HIT"\n}' : undefined, ...stages[step] }];
             return { ...m, thoughts: newThoughts };
           }
           return m;
         }));
         step++;
      } else {
         clearInterval(interval);
         setMessages(prev => prev.map(m => {
           if (m.id === agentMsgId) {
             return { 
               ...m,
               isThinking: false, 
               content: `指令「${finalQuery}」已处理完毕。已为您调取对应的图文结构与数据报告，并且匹配到 3 个行业内的标杆成功案例，随时可供审查。` 
             };
           }
           return m;
         }));
         setIsProcessing(false);
         setRightExpanded(true);
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-neutral-900">
      {/* Top Header */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6 bg-white shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
            <Cpu size={16} />
          </div>
          <h2 className="text-[14px] font-black tracking-tight">工作台</h2>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative bg-neutral-50/30">
        {/* === Left Panel (3-tiered Macros & Assets) === */}
        <AnimatePresence initial={false}>
          {leftExpanded ? (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-neutral-100 bg-[#fafafa] flex flex-col shrink-0 overflow-hidden relative z-10"
            >
              <div className="p-2 border-b border-neutral-100 bg-white shrink-0 flex items-center justify-between gap-2 shadow-sm">
                 <div className="flex bg-neutral-100/50 p-1 rounded-lg flex-1">
                   {[
                     { id: 'history', name: '会话', icon: History },
                     { id: 'assets', name: '文件', icon: FolderOpen }
                   ].map(tab => (
                     <button 
                       key={tab.id}
                       onClick={() => setLeftTab(tab.id as any)}
                       className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-black transition-all ${leftTab === tab.id ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                     >
                       <tab.icon size={14} className={leftTab === tab.id ? 'text-primary-500' : ''} />
                       {tab.name}
                     </button>
                   ))}
                 </div>
                 <button onClick={() => setLeftExpanded(false)} className="p-1.5 shrink-0 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors">
                    <PanelLeftClose size={16} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col bg-[#fafafa]">
                 {leftTab === 'assets' && (
                    <div className="p-6 flex flex-col items-center justify-center text-center h-[300px] border-b border-neutral-100">
                       <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 mb-4 shadow-inner">
                          <BookOpen size={24} />
                       </div>
                       <h3 className="text-[13px] font-black text-neutral-900 mb-2">资产已全量归集</h3>
                       <p className="text-[11px] font-bold text-neutral-400 max-w-[200px] mb-6">项目 IP 定位、合规词库与视觉规范已统一存放在主知识库中心。</p>
                       <button 
                         onClick={() => {
                            // Dispatch custom event to change left nav in App.tsx
                            window.dispatchEvent(new CustomEvent('nav-to-files'));
                         }}
                         className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-[11px] font-black hover:bg-primary-500 hover:border-primary-500 transition-all flex items-center gap-2"
                       >
                         前往知识库中心 <ArrowUpRight size={14} />
                       </button>
                    </div>
                 )}
                 {leftTab === 'history' && (
                    <div className="p-6 space-y-4">
                       <p className="text-[11px] font-bold text-neutral-400 text-center py-10">历史会话与上下文记忆<br/>（归档中）</p>
                    </div>
                 )}
              </div>
            </motion.div>
          ) : (
            <div className="w-12 border-r border-neutral-100 bg-white flex flex-col items-center py-4 gap-4 shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
               <button onClick={() => setLeftExpanded(true)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 tooltip-trigger">
                  <PanelLeftOpen size={16} />
               </button>
               <div className="w-8 h-[1px] bg-neutral-100 my-2" />
               <button onClick={() => { setLeftExpanded(true); setLeftTab('history'); }} className={`p-2 hover:bg-neutral-100 rounded-xl ${leftTab === 'history' ? 'text-primary-500' : 'text-neutral-400'} relative`}>
                  <History size={18} />
               </button>
               <button onClick={() => { setLeftExpanded(true); setLeftTab('assets'); }} className={`p-2 hover:bg-neutral-100 rounded-xl ${leftTab === 'assets' ? 'text-primary-500' : 'text-neutral-400'} relative`}>
                  <FolderOpen size={18} />
               </button>
            </div>
          )}
        </AnimatePresence>

        {/* === Middle Panel (Console Display) === */}
        <div className="flex-1 flex flex-col relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] min-w-[480px]">
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            
            {/* Proactive AI Engine */}
            {!isNewMerchant ? (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shadow-sm">
                    <Sparkles size={14} />
                  </div>
                  <h3 className="text-[15px] font-black tracking-tight text-neutral-900">AI 主动护航引擎</h3>
                  <span className="ml-2 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-black rounded-md">3 条建议需评估</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {proactiveSuggestions.map(s => (
                    <div key={s.id} className="bg-white/80 backdrop-blur-xl border border-neutral-200/50 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all border-l-4 group relative overflow-hidden" style={{ borderLeftColor: s.type === 'emergency' ? '#e11d48' : s.type === 'attention' ? '#f59e0b' : '#3b82f6' }}>
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1 pr-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${s.type === 'emergency' ? 'bg-rose-50 text-rose-600' : s.type === 'attention' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                              {s.type === 'emergency' ? '紧急排查' : s.type === 'attention' ? '需关注' : '优化建议'}
                            </span>
                            <h4 className="text-[16px] font-black text-neutral-900 tracking-tight">{s.title}</h4>
                          </div>
                          <p className="text-[13px] text-neutral-600 font-bold leading-relaxed">{s.desc}</p>
                          
                          {/* Reason Line - Explainability Patch */}
                          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 bg-neutral-50/50 px-3 py-1.5 rounded-lg">
                            <Brain size={12} className="text-neutral-300" />
                            <span>推理引擎：检测到数据显著偏离均值，超过同期 85% 历史样本。</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleExecute(s.cmd)}
                          className="shrink-0 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[12px] font-black hover:bg-primary-500 transition-all shadow-lg active:scale-95 group-hover:-translate-x-1"
                        >
                          {s.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
               <div className="max-w-3xl mx-auto flex flex-col items-center justify-center pt-8 pb-4">
                  <div className="w-16 h-16 bg-neutral-900 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-neutral-900/10">
                    <Bot size={32} />
                  </div>
                  <h2 className="text-[24px] font-black text-neutral-900 tracking-tight mb-4">您好，我是 Taptik 智能大脑</h2>
                  <p className="text-[14px] text-neutral-500 font-bold max-w-lg text-center leading-relaxed">
                    作为您的全天候 AI 业务护航引擎，我可以帮您处理繁杂的运营工作，分析账号数据，并为您量身定制最适合的增长策略。
                  </p>
               </div>
            )}

            <div className={`max-w-3xl mx-auto space-y-6 pt-6 ${!isNewMerchant ? 'border-t border-neutral-200/50' : ''}`}>
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    layout
                    key={msg.id}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-xl ${msg.role === 'agent' ? 'bg-neutral-900 text-white' : 'bg-primary-500 text-white'}`}>
                      {msg.role === 'agent' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {msg.thoughts && msg.thoughts.length > 0 && (
                        <ThoughtsBlock thoughts={msg.thoughts} isThinking={msg.isThinking || false} />
                      )}
                      {msg.content && (
                        <div className={`text-left px-6 py-4 rounded-3xl text-[14px] font-bold leading-relaxed shadow-sm ${msg.role === 'agent' ? 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-neutral-100 text-neutral-800 rounded-tl-lg' : 'bg-primary-500 text-white shadow-primary-500/20 rounded-tr-lg'}`}>
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* isProcessing animation removed to avoid duplication with ThoughtsBlock */}
            </div>
            {/* Phantom bottom margin to prevent overlapping with command input */}
            <div className={isNewMerchant && messages.length <= 1 ? "h-64" : "h-40"} /> 
          </div>

          {/* Unified Input Console (Bottom Absolute) */}
          <div className="absolute bottom-0 left-0 right-0 pt-16 pb-8 px-10 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto relative">
              
              {/* Suggestion Capsules */}
              {isNewMerchant && messages.length <= 1 ? (
                <div className="grid grid-cols-3 gap-4 mb-5 relative z-10">
                   {[
                      { title: '账号分析', desc: '诊断当前账号状态，提供冷启动优化方案', icon: Target, cmd: '帮我诊断当前账号的冷启动状态' },
                      { title: '运营探讨', desc: '与 AI 共同探讨业务痛点，制定周期性增长策略', icon: MessageSquare, cmd: '我想探讨一下接下来的运营策略' },
                      { title: '案例对照', desc: '调取行业爆款与成功案例，解析流量密码', icon: Compass, cmd: '给我提供一些同行业最近的爆款案例' }
                   ].map((btn, i) => (
                      <button 
                         key={i}
                         onClick={() => handleExecute(btn.cmd)}
                         className="flex flex-col items-start p-4 bg-white border border-neutral-200 hover:border-primary-500 rounded-[20px] shadow-sm hover:shadow-md transition-all group text-left"
                      >
                         <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-500 mb-4 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                            <btn.icon size={20} />
                         </div>
                         <h4 className="text-[14px] font-black text-neutral-900 mb-1.5">{btn.title}</h4>
                         <p className="text-[11px] font-bold text-neutral-400 leading-relaxed max-w-[200px]">{btn.desc}</p>
                      </button>
                   ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3 px-2 flex-wrap">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-2">推荐指令：</span>
                  {CAPSULES.map((capsule, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setQuery(capsule.cmd);
                      }}
                      className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-bold text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 shadow-sm transition-all active:scale-95"
                    >
                      {capsule.label}
                    </button>
                  ))}
                </div>
              )}

              {/* The Input Container */}
              <div className="relative z-50">
                <AnimatePresence>
                  {isFunctionNavOpen && <FunctionNav setActiveNav={setActiveNav} isOpen={isFunctionNavOpen} onClose={() => setIsFunctionNavOpen(false)} />}
                  {isCommandDirOpen && <CommandDirectory onSelectCommand={(cmd) => { setQuery(cmd); setIsCommandDirOpen(false); }} isOpen={isCommandDirOpen} onClose={() => setIsCommandDirOpen(false)} />}
                  {isAgentPanelOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute bottom-full right-0 mb-4 w-[380px] h-[480px] bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                        <div className="flex items-center gap-2 text-neutral-900">
                          <Bot size={16} />
                          <span className="text-[13px] font-black">系统与智能体 (Agents)</span>
                        </div>
                        <button onClick={() => setIsAgentPanelOpen(false)} className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-500 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden relative">
                         <SubagentMacroPanel onRunMacro={(cmd) => { setQuery(cmd); setIsAgentPanelOpen(false); }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-white p-2 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.08)] flex items-center gap-3 pr-3 border border-neutral-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all text-neutral-900">
                  
                  {/* Deterministic Nav Button (LayoutGrid) */}
                  <button 
                    onClick={() => { setIsFunctionNavOpen(!isFunctionNavOpen); setIsCommandDirOpen(false); setIsAgentPanelOpen(false); }}
                    className={`ml-2 p-3 rounded-2xl transition-all ${isFunctionNavOpen ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'}`}
                    title="结构化功能导航 (Ctrl+K)"
                  >
                    <LayoutGrid size={20} />
                  </button>

                  <div className="w-[1px] h-8 bg-neutral-200" />

                  <div className="flex-1 relative h-12 flex items-center font-bold">
                    <input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                      placeholder={query ? '' : SUGGESTIONS[placeholderIndex]} 
                      className="absolute inset-0 bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full h-full placeholder:text-neutral-400 placeholder:transition-opacity"
                    />
                  </div>
                  
                  {/* Agent Setup/Shortcut Button */}
                  <button 
                    onClick={() => { setIsAgentPanelOpen(!isAgentPanelOpen); setIsFunctionNavOpen(false); setIsCommandDirOpen(false); }}
                    className={`p-2.5 rounded-xl transition-all ${isAgentPanelOpen ? 'bg-primary-50 text-primary-500' : 'text-neutral-400 hover:text-primary-500 hover:bg-neutral-50'}`}
                    title="智能体指令集"
                  >
                    <Bot size={20} />
                  </button>

                  {/* Intent Directory Button (Lightbulb) */}
                  <button 
                    onClick={() => { setIsCommandDirOpen(!isCommandDirOpen); setIsFunctionNavOpen(false); setIsAgentPanelOpen(false); }}
                    className={`p-2.5 rounded-xl transition-all ${isCommandDirOpen ? 'bg-warning-50 text-warning-500' : 'text-neutral-400 hover:text-warning-500 hover:bg-neutral-50'}`}
                    title="意图与指令集模板"
                  >
                    <Lightbulb size={20} />
                  </button>

                  <button 
                    onClick={() => handleExecute()}
                    className="w-14 h-14 bg-neutral-900 text-white rounded-[22px] flex items-center justify-center hover:bg-primary-500 transition-all active:scale-95 shadow-md"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === Right Panel (Pipeline & Calendar) === */}
        <AnimatePresence initial={false}>
          {rightExpanded ? (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-neutral-100 bg-white flex flex-col shrink-0 overflow-hidden relative z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]"
            >
              <div className="p-4 border-b border-neutral-100 bg-white shrink-0 flex items-center justify-between">
                <button onClick={() => setRightExpanded(false)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400">
                  <PanelRightClose size={16} />
                </button>
                <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
                  {['面板', '日志'].map(t => (
                    <button key={t} className={`px-4 py-1.5 text-[11px] font-black rounded-md transition-colors ${t === '面板' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}>{t}</button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
                {/* Visual Pipeline Patch */}
                <div>
                  <h3 className="text-[13px] font-black text-neutral-900 tracking-tight mb-5 flex items-center gap-2">
                    <Workflow size={14} className="text-primary-500" />
                    Agent 工作流阶段
                  </h3>
                  <div className="space-y-[2px] bg-neutral-50 p-[2px] rounded-[24px]">
                    {[
                      { stage: '策略探测', status: '完成', icon: Target, detail: '蓝海词「低卡茶饮」热度上升 42%' },
                      { stage: '批量内容生成', status: '分配中', icon: Sparkles, detail: '生成笔记 25 篇，配图任务下发中', active: true },
                      { stage: '分发排期', status: '等待', icon: Share2, detail: '排期空闲' },
                      { stage: '数据归因', status: '等待', icon: BarChart2, detail: '等待回流报表' },
                    ].map((step, i) => (
                      <div key={i} className={`p-4 rounded-[22px] flex items-center gap-4 transition-all ${step.active ? 'bg-white shadow-sm ring-1 ring-primary-500/20' : step.status === '完成' ? 'bg-white/50 text-neutral-400' : 'bg-transparent opacity-60'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${step.active ? 'bg-primary-50 text-primary-500' : step.status === '完成' ? 'bg-emerald-50 text-emerald-500' : 'bg-neutral-100/50 text-neutral-400'}`}>
                          {step.status === '完成' ? <Check size={16} /> : <step.icon size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[12px] font-black ${step.active ? 'text-neutral-900' : 'text-neutral-500'}`}>{step.stage}</span>
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{step.status}</span>
                          </div>
                          <div className="text-[11px] font-bold text-neutral-400 truncate">{step.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-12 border-l border-neutral-100 bg-white flex flex-col items-center py-4 gap-4 shrink-0 z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
               <button onClick={() => setRightExpanded(true)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 tooltip-trigger">
                  <PanelRightOpen size={16} />
               </button>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
