import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Target, BarChart2, Workflow, MessageSquare,
  Compass, Lightbulb, Bot, LayoutGrid, Cpu, Share2, PanelLeftClose, PanelRightClose,
  User, Send, FileText, Plus, Check, CalendarDays, LineChart, PanelLeftOpen, PanelRightOpen, History, FolderOpen, Brain, BookOpen, ArrowUpRight,
  ChevronRight, Wrench, BrainCircuit, CheckCircle2, X, MoreHorizontal, Edit2, Save, Share, Trash2, Folder,
  Copy, Settings, Palette, HelpCircle, ArrowUpCircle, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommandDirectory } from './command-center/CommandDirectory';
import { AgentSelector, AVAILABLE_AGENTS } from './command-center/AgentSelector';

type AgentThought = {
  id: string;
  type: 'think' | 'tool_call';
  content: string;
  result?: string;
  status?: 'success' | 'warning' | 'error';
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
               子节点思考与执行过程 ({thoughts.length})
             </span>
          </div>
          <ChevronRight size={16} className={`text-neutral-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
       </button>
       
       {expanded && (
         <div className="p-4 pt-1 border-t border-neutral-200/50 space-y-4">
           {thoughts.map(t => (
             <div key={t.id} className={`flex items-start gap-3 text-[13px] ${t.status === 'warning' ? 'bg-warning-50/50 p-2 -mx-2 rounded-xl text-warning-700 border border-warning-200/50' : t.status === 'success' ? 'bg-emerald-50/50 p-2 -mx-2 rounded-xl text-emerald-700 border border-emerald-200/50' : ''}`}>
                <div className="mt-0.5 shrink-0">
                  {t.type === 'think' ? (
                     <BrainCircuit size={14} className={t.status === 'warning' ? 'text-warning-500' : t.status === 'success' ? 'text-emerald-500' : 'text-purple-500'} />
                  ) : (
                     <Wrench size={14} className="text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                   <div className={`font-bold ${t.status === 'warning' ? 'text-warning-900' : t.status === 'success' ? 'text-emerald-900' : 'text-neutral-700'}`}>{t.content}</div>
                   {t.result && (
                     <div className="font-mono text-[11px] text-neutral-500 bg-white border border-neutral-200 p-2 rounded-lg max-h-24 overflow-y-auto whitespace-pre-wrap mt-2">
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
  onboardingData: any;
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

const ProfileSlot = ({ label, value, icon: Icon, active, flashed }: { label: string, value?: string, icon: any, active: boolean, flashed?: boolean }) => {
  return (
    <div className={`relative px-4 py-3 rounded-2xl border transition-all duration-700 ${active ? 'bg-white border-primary-100 shadow-sm' : 'bg-neutral-50 border-dashed border-neutral-200'}`}>
      <div className="flex items-center gap-3 relative z-10">
         <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-primary-50 text-primary-500' : 'bg-neutral-100 text-neutral-400'}`}>
            <Icon size={16} />
         </div>
         <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-neutral-400 mb-0.5">{label}</div>
            <div className={`text-[13px] font-black truncate transition-all duration-500 ${active ? 'text-neutral-900' : 'text-neutral-300'}`}>
               {value || '待 AI 提炼补充...'}
            </div>
         </div>
      </div>
      {flashed && active && (
        <motion.div 
           initial={{ opacity: 0.8, scale: 0.95 }}
           animate={{ opacity: 0, scale: 1.05 }}
           transition={{ duration: 0.6 }}
           className="absolute inset-0 bg-primary-100 rounded-2xl z-0"
        />
      )}
    </div>
  );
};

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, onboardingStep, setOnboardingStep, onboardingData, setOnboardingData, activeProjectId }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [leftTab, setLeftTab] = useState<'history' | 'assets'>('history');
  
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [bottomExpanded, setBottomExpanded] = useState(false);
  const [showQuickTasks, setShowQuickTasks] = useState(true);
  
  const [historyTasks, setHistoryTasks] = useState([
    { id: '1', title: '你能阅读我的本地文件吗', time: '6小时前', active: false },
    { id: '2', title: '我想做小红书内容运营,需要...', time: '8天前', active: true },
    { id: '3', title: '帮我诊断一下现有的私域存...', time: '8天前', active: false }
  ]);
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [isCommandDirOpen, setIsCommandDirOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState('core');

  const activeAgent = AVAILABLE_AGENTS.find(a => a.id === activeAgentId) || AVAILABLE_AGENTS[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Assume file is processed here
  };

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
        setIsAgentSelectorOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isNewMerchant = activeProjectId === 'project-c';
  
  const currentProjectName = "新进品牌：待配置"; // Placeholder for UI

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (activeProjectId === 'new-merchant') {
      setMessages([
        { id: '1', role: 'agent', content: '您好！我是您的 Taptik 智能大脑。作为一个新入驻项目，我们可以先从基础的数据诊断和对标分析开始。', time: '刚才' }
      ]);
    } else if (activeProjectId === 'project-c') {
      setMessages([
        { id: '1', role: 'agent', content: '👏 欢迎接入新品牌！为了帮您精准生成小红书策略，我们需要花 2 分钟聊聊。请问咱们的主打产品是什么？核心受众主要是哪些人？', time: '刚才' }
      ]);
      setOnboardingStep(0);
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

    if (isNewMerchant) {
        let step = 0;
        const stages = [
           { type: 'think', content: '正在分析您的输入并提取品牌语义特征...' }
        ] as any[];

        const interval = setInterval(() => {
          if (step < stages.length) {
             const currentStep = step;
             const stage = stages[currentStep];
             setMessages(prev => prev.map(m => {
               if (m.id === agentMsgId) {
                 const newThoughts = [...(m.thoughts || []), { id: `t${currentStep}`, ...stage }];
                 return { ...m, thoughts: newThoughts };
               }
               return m;
             }));
             step++;
          } else {
             clearInterval(interval);
             if (onboardingStep === 0) {
                 setTimeout(() => setOnboardingData((prev: any) => ({ ...prev, industry: "美妆护肤", audience: "18-25岁 年轻女大学生" })), 0);
                 setMessages(prev => prev.map(m => m.id === agentMsgId ? {
                     ...m,
                     isThinking: false,
                     content: '✅ 收到！看来我们的核心是**“敏感肌可用卸妆油”**，主要受众群是**年轻女大学生**。\n\n那么，在文案风格上，您希望我们是“专业严谨的护肤专家”，还是“贴心分享的闺蜜种草”？是否有绝对不能碰的竞品或防坑雷区（比如不要提平替）？'
                 } : m));
                 setOnboardingStep(1);
             } else if (onboardingStep === 1) {
                 setTimeout(() => setOnboardingData((prev: any) => ({ ...prev, traps: "避免拉踩、不提平替", tone: "闺蜜种草，亲切活泼" })), 0);
                 setMessages(prev => prev.map(m => m.id === agentMsgId ? {
                     ...m,
                     isThinking: false,
                     content: '✅ 非常清晰！已经收到您的防坑雷区与品牌声调预设，并同步为全域智体的底层系统护栏。\n\n🎉 **您的品牌画像基座已初始完成！**\n\n现在您可以解锁左侧的「项目工作流」进行实操，或者点击我下方的按钮，一键生成第一季度的打法节奏。'
                 } : m));
                 setOnboardingStep(3);
             } else {
                 setMessages(prev => prev.map(m => m.id === agentMsgId ? {
                     ...m,
                     isThinking: false,
                     content: '基座已建设完毕，正为您执行具体的工作指令。'
                 } : m));
                 setTimeout(() => setActiveNav('workflow'), 1000);
             }
             setIsProcessing(false);
          }
        }, 1000);
        return;
    }

    let stages: { type: 'think' | 'tool_call', content: string, status?: 'success' | 'warning' | 'error' }[] = [];

    // Simulate Agent Routing based on selected Agent and intent
    const isAutoRoutingContent = activeAgentId === 'strategy' && (finalQuery.includes('生成') || finalQuery.includes('写') || finalQuery.includes('创作'));
    const isAutoRoutingStrategy = activeAgentId === 'content' && (finalQuery.includes('分析') || finalQuery.includes('趋势') || finalQuery.includes('蓝海'));

    if (activeAgentId === 'core') {
       stages = [
         { type: 'think', content: '[Taptik 大脑] 正在全局分析任务意图...' },
         { type: 'tool_call', content: '评估合适的工作流与子节点...' },
         { type: 'think', content: '已将任务下发给对应业务线的垂直智能体执行' },
         { type: 'tool_call', content: '正在调用底层基础工具群' },
         { type: 'think', content: '汇总多节点结果，准备输出...' }
       ];
    } else if (isAutoRoutingContent) {
       stages = [
         { type: 'think', content: `[${activeAgent.name}] 正在解析任务意图...` },
         { type: 'think', content: `[${activeAgent.name}] 注意：检测到「内容生产」需求，超出当前策略规划边界。`, status: 'warning' },
         { type: 'tool_call', content: `自动向上级 Taptik 智能大脑请求跨界协同调度...` },
         { type: 'think', content: `[Taptik 大脑] 批准接管。已唤起 [全域内容打法团队] 将策略转化为实体内容！`, status: 'success' },
         { type: 'think', content: `[内容团队] 正在执行批量生成逻辑...` }
       ];
    } else if (isAutoRoutingStrategy) {
       stages = [
         { type: 'think', content: `[${activeAgent.name}] 正在解析任务任务...` },
         { type: 'think', content: `[${activeAgent.name}] 注意：检测到「策略推演/数据分析」需求，这并非当前内容节点的最优能力范围。`, status: 'warning' },
         { type: 'tool_call', content: `自动向系统申请调度 [策略专家] 协助...` },
         { type: 'think', content: `[策略专家] 已接管需求，正在提取全网蓝海词库与历史转化数据...`, status: 'success' },
         { type: 'think', content: `基于数据与策略，整理最终建议...` }
       ];
    } else {
       // Standard behavior for the selected sub-agent
       stages = [
         { type: 'think', content: `[${activeAgent.name}] 已接管任务，正在拆解目标...` },
         { type: 'tool_call', content: `正在调用 ${activeAgent.name} 专属 API 接口与数据集` },
         { type: 'think', content: '获取相关业务资产状态...' },
         { type: 'tool_call', content: '执行领域级专有逻辑 (Deduction / Gen)' },
         { type: 'think', content: '任务执行完毕，生成汇报...' }
       ];
    }

    let step = 0;
    const interval = setInterval(() => {
      if (step < stages.length) {
         const currentStep = step;
         const stage = stages[currentStep] || { type: 'think', content: '处理中...' };
         setMessages(prev => prev.map(m => {
           if (m.id === agentMsgId) {
             const newThoughts = [...(m.thoughts || []), { id: `t${currentStep}`, result: currentStep % 2 !== 0 && !stage.status ? '{\n  "status": "success",\n  "cache": "HIT"\n}' : undefined, ...stage }];
             return { ...m, thoughts: newThoughts };
           }
           return m;
         }));
         step++;
      } else {
         clearInterval(interval);
         setMessages(prev => prev.map(m => {
           if (m.id === agentMsgId) {
             let finalResponse = `指令「${finalQuery}」已处理完毕。`;
             if (isAutoRoutingContent) {
               finalResponse += ` 由于任务包含具体的内容生产环节，我在过程中拉起了 **全域内容打法团队** 协同执行，最终的内容草稿已为您在后端生成就绪。`;
             } else if (isAutoRoutingStrategy) {
               finalResponse += ` 考虑到任务需要深入的数据推演，我已自动安排 **策略专家** 提供核心洞察，确保最终方案具备高转化潜力。`;
             } else {
               finalResponse += ` 我已为您调取对应的业务数据，并匹配了 3 个相关参考方案，随时可供审查。`;
             }

             return { 
               ...m,
               isThinking: false, 
               content: finalResponse 
             };
           }
           return m;
         }));
         setIsProcessing(false);
         setBottomExpanded(true);
      }
    }, 750);
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
        {/* === Middle Panel (Console Display) === */}
        <div 
          className="flex-1 flex flex-col relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] min-w-[480px]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
             <div className="absolute inset-0 z-50 bg-primary-500/10 backdrop-blur-[2px] border-2 border-dashed border-primary-500 rounded-xl m-4 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary-500 mb-4 animate-bounce">
                   <Paperclip size={32} />
                </div>
                <h3 className="text-xl font-black text-primary-600 tracking-tight">松开以上传文件</h3>
                <p className="text-[13px] font-bold text-primary-500/70 mt-2">支持本地文件、文件夹拖拽上传</p>
             </div>
          )}

          <div className={`flex-1 overflow-y-auto p-10 pb-6 space-y-10 custom-scrollbar ${isDragging ? 'opacity-50' : ''}`}>
            
            {/* Clean Startup Screen (New Task / Empty State) */}
            {messages.length <= 1 && (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 mt-8">
                  <div className="w-16 h-16 bg-neutral-900 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8 relative">
                     <Bot size={32} />
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border border-white" />
                  </div>
                  <h2 className="text-[28px] font-black text-neutral-900 tracking-tight leading-snug mb-3">
                     {isNewMerchant ? '欢迎入驻，开始构建您的专属品牌诊断' : '今天需要我帮您做些什么？'}
                  </h2>
                  <p className="text-[14px] text-neutral-500 font-bold leading-relaxed mb-10 max-w-lg">
                    {isNewMerchant 
                      ? '系统检测到您为新入驻账号，建议先由「策略专家」为您进行深度的品牌诊断与受众画像对焦，建立精准的内容基座。' 
                      : '您可以直接下达任务指令，或唤起垂直方向的专业智能体为您处理数据、策略或内容。'}
                  </p>
                  
                  {isNewMerchant && (
                      <button 
                         onClick={() => {
                             setActiveAgentId('strategy');
                             handleExecute('你好，我是新入驻的商家，请帮我对焦品牌受众和产品卖点，建立出圈模型。');
                         }}
                         className="px-8 py-3.5 bg-neutral-900 text-white rounded-2xl text-[14px] font-black hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-500/20 transition-all flex items-center gap-2 active:scale-95"
                      >
                         <Target size={18} /> 开启品牌深度诊断
                      </button>
                  )}
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
            {/* Phantom bottom margin removed */}
          </div>

          {/* Unified Input Console */}
          <div className="shrink-0 pt-16 pb-4 px-10 bg-gradient-to-t from-white via-white/95 to-white relative z-20">
            <div className="max-w-4xl mx-auto relative">
              
              {/* Top: Capsule Commands */}
              {messages.length > 1 && (
                <div className="flex items-center gap-2 mb-3 px-2 flex-wrap">
                  {CAPSULES.map((capsule, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setQuery(capsule.cmd);
                      }}
                      className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <FileText size={14} className="text-neutral-400" />
                      {capsule.label}
                    </button>
                  ))}
                  <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all flex items-center gap-1.5">
                    <LayoutGrid size={14} className="text-neutral-400" />
                    更多
                  </button>
                </div>
              )}

              {/* The Input Container */}
              <div className="relative z-50">
                <AnimatePresence>
                  <AgentSelector 
                     isOpen={isAgentSelectorOpen} 
                     onClose={() => setIsAgentSelectorOpen(false)} 
                     activeAgentId={activeAgentId}
                     onSelectAgent={setActiveAgentId}
                     onOpenMarket={() => setActiveNav('skills')}
                  />
                  {isCommandDirOpen && <CommandDirectory onSelectCommand={(cmd) => { setQuery(cmd); setIsCommandDirOpen(false); }} isOpen={isCommandDirOpen} onClose={() => setIsCommandDirOpen(false)} />}
                </AnimatePresence>

                <div className="bg-white p-2 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex items-center gap-3 pr-3 border border-neutral-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all text-neutral-900">
                  
                  {/* Agent Selector Button */}
                  <button 
                    onClick={() => { setIsAgentSelectorOpen(!isAgentSelectorOpen); setIsCommandDirOpen(false); }}
                    className={`ml-2 px-3 py-2 rounded-[20px] transition-all flex items-center gap-2 ${isAgentSelectorOpen ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'} border border-transparent ${activeAgentId !== 'core' && !isAgentSelectorOpen ? 'bg-neutral-50 border-neutral-200' : ''}`}
                    title="选择智能体 (Ctrl+K)"
                  >
                    <activeAgent.icon size={18} className={activeAgentId !== 'core' ? activeAgent.iconColor : ''} />
                    <span className="text-[13px] font-black">{activeAgentId === 'core' ? '智能体' : activeAgent.name}</span>
                  </button>

                  <div className="w-[1px] h-6 bg-neutral-200" />

                  <div className="flex-1 relative h-12 flex items-center font-bold">
                    <input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                      placeholder={query ? '' : `今天帮您做些什么？唤起 ${activeAgent.name} 执行任务，或输入 ${SUGGESTIONS[placeholderIndex]}`} 
                      className="absolute inset-0 bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full h-full placeholder:text-neutral-400 placeholder:transition-opacity"
                    />
                  </div>
                  
                  <div className="relative">
                     <button 
                       onClick={() => { setIsAttachMenuOpen(!isAttachMenuOpen); setIsAgentSelectorOpen(false); setIsCommandDirOpen(false); }}
                       className={`p-2.5 rounded-xl transition-all ${isAttachMenuOpen ? 'bg-primary-50 text-primary-500' : 'text-neutral-400 hover:text-primary-500 hover:bg-neutral-50'}`}
                       title="添加附件"
                     >
                       <Paperclip size={20} />
                     </button>
                     <AnimatePresence>
                       {isAttachMenuOpen && (
                         <>
                           <div className="fixed inset-0 z-40" onClick={() => setIsAttachMenuOpen(false)} />
                           <motion.div 
                             initial={{ opacity: 0, y: 10, scale: 0.96 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: 10, scale: 0.96 }}
                             className="absolute right-0 bottom-full mb-2 w-40 bg-white border border-neutral-100 shadow-xl rounded-2xl z-50 py-2 flex flex-col"
                           >
                              <button className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors text-[13px] font-bold text-left w-full group">
                                <Paperclip size={14} className="text-neutral-400 group-hover:text-neutral-600" /> 本地文件
                              </button>
                              <button className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors text-[13px] font-bold text-left w-full group">
                                <FileText size={14} className="text-neutral-400 group-hover:text-neutral-600" /> 腾讯文档
                              </button>
                              <button className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors text-[13px] font-bold text-left w-full group">
                                <BrainCircuit size={14} className="text-neutral-400 group-hover:text-neutral-600" /> ima 知识库
                              </button>
                              <button className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors text-[13px] font-bold text-left w-full group">
                                <Database size={14} className="text-neutral-400 group-hover:text-neutral-600" /> 乐享知识库
                              </button>
                           </motion.div>
                         </>
                       )}
                     </AnimatePresence>
                  </div>

                  {/* Intent Directory Button (Lightbulb) */}
                  <button 
                    onClick={() => { setIsCommandDirOpen(!isCommandDirOpen); setIsAgentSelectorOpen(false); }}
                    className={`p-2.5 rounded-xl transition-all ${isCommandDirOpen ? 'bg-warning-50 text-warning-500' : 'text-neutral-400 hover:text-warning-500 hover:bg-neutral-50'}`}
                    title="意图与指令集模板"
                  >
                    <Lightbulb size={20} />
                  </button>

                  <button 
                    onClick={() => handleExecute()}
                    className="w-12 h-12 bg-neutral-900 text-white rounded-[20px] flex items-center justify-center hover:bg-primary-500 transition-all active:scale-95 shadow-md shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>


              
            </div>
          </div>

          {/* === Bottom Agent Workflow Bar === */}
          {bottomExpanded && (
             <div className="fixed inset-0 z-40" onClick={() => setBottomExpanded(false)} />
          )}
          <div className="shrink-0 border-t border-neutral-200 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.04)] relative z-50">
             <AnimatePresence>
             {bottomExpanded && (
                <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.98 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.98 }}
                   className="absolute bottom-[calc(100%+12px)] right-6 w-[400px] bg-white rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-col overflow-hidden origin-bottom-right z-50 mb-2"
                >
                   <div className="flex items-center justify-between py-5 px-6 border-b border-neutral-50 bg-[#fafafa]">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-neutral-900 text-white rounded-[10px] flex items-center justify-center shadow-sm">
                            <Workflow size={14} />
                         </div>
                         <div>
                            <h3 className="text-[14px] font-black text-neutral-900 tracking-tight">Agent 瀑布工作流</h3>
                            <div className="text-[11px] font-bold text-neutral-500 mt-0.5 tracking-wide">任务执行链路</div>
                         </div>
                      </div>
                      <button onClick={() => setBottomExpanded(false)} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-200 bg-neutral-100 rounded-full text-neutral-500 transition-all">
                         <X size={14} />
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto max-h-[360px] px-5 py-4 bg-white custom-scrollbar">
                       {[
                         { stage: '策略探测', status: '完成', detail: '分析近期大盘数据发现蓝海词「低卡茶饮」，热度上升 42%', time: '10:42', id: 'step-1' },
                         { stage: '批量内容生成', status: '执行中', detail: '正在根据策略矩阵生成笔记，已完成 12/25 篇', active: true, time: '10:45', id: 'step-2' },
                         { stage: '分发排期', status: '排队中', detail: '等待内容生成完毕后，将自动下发至各渠道排期', time: '--:--', id: 'step-3' },
                         { stage: '数据归因', status: '待触发', detail: '等待发布后回流数据报表并优化策略', time: '--:--', id: 'step-4' },
                       ].map((step, i, arr) => (
                          <div key={step.id} className="relative flex gap-3 pb-4 last:pb-0 group">
                             {i < arr.length - 1 && (
                                <div className="absolute left-[7px] top-4 bottom-0 w-[1px]">
                                   <div className={`w-full h-full ${step.status === '完成' ? 'bg-primary-500' : 'bg-neutral-100 border-l-[1px] border-dashed border-neutral-200'}`} />
                                </div>
                             )}
                             
                             <div className="mt-1 w-[15px] flex justify-center shrink-0 relative z-10">
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${step.active ? 'bg-primary-500 shadow-[0_0_0_3px_rgba(var(--primary-100),1)]' : step.status === '完成' ? 'bg-neutral-900 border border-neutral-700' : 'bg-white border-2 border-neutral-200'}`}>
                                   {step.active && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                </div>
                             </div>
                             
                             <div className={`flex-1 pt-0 ${step.active ? 'opacity-100' : step.status === '完成' ? 'opacity-90' : 'opacity-50'}`}>
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <span className={`text-[12px] font-black ${step.active ? 'text-primary-600' : 'text-neutral-800'}`}>{step.stage}</span>
                                       <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${step.active ? 'bg-primary-50 text-primary-600' : step.status === '完成' ? 'bg-neutral-100 text-neutral-600' : 'hidden'}`}>{step.status}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-400 font-mono tracking-tight">{step.time}</span>
                                 </div>
                                 <p className="text-[11px] font-medium text-neutral-500 mt-1 leading-snug break-all line-clamp-2">{step.detail}</p>
                             </div>
                          </div>
                       ))}
                   </div>
                </motion.div>
              )}
              </AnimatePresence>
              
              <div 
                 className={`h-[46px] flex items-center justify-between px-6 cursor-pointer hover:bg-neutral-50 transition-colors group ${bottomExpanded ? 'bg-neutral-50 border-t-primary-500 border-t-2' : ''}`}
                 onClick={() => setBottomExpanded(!bottomExpanded)}
              >
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-lg text-[11px] font-black">
                         <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                         Agent 正在运行
                      </div>
                      <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-600">
                         <span className="text-neutral-400 font-black">当前节点:</span> 批量内容分发与素材组织中...
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-neutral-400 group-hover:text-primary-500 transition-colors">{bottomExpanded ? '收起工作流' : '展开工作流详细'}</span>
                      {bottomExpanded ? (
                          <PanelRightClose size={16} className="text-primary-500 rotate-90 transition-colors" />
                      ) : (
                          <PanelLeftOpen size={16} className="text-neutral-400 group-hover:text-primary-500 -rotate-90 transition-colors" />
                      )}
                   </div>
                </div>
          </div>

        </div>

        {/* RIGHT PANEL: AI Escort Engine or Brand Profile */}
        {isNewMerchant ? (
           <div className="w-[300px] 2xl:w-[340px] border-l border-neutral-200 bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
                 <div className="flex items-center gap-2">
                    <Target size={18} className="text-primary-500" />
                    <span className="text-[14px] font-black text-neutral-900">品牌画像基座面板</span>
                 </div>
                 <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-black rounded-md">基座完善度 {Math.min(100, Math.max(0, onboardingStep * 33))}%</span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-neutral-100 shrink-0">
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-primary-500 h-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, onboardingStep * 33)}%` }} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar lg:bg-[#fafafa] bg-white">
                 <ProfileSlot label="行业赛道" value={onboardingData.industry} icon={Compass} active={onboardingStep >= 1} flashed={onboardingStep === 1} />
                 <ProfileSlot label="目标受众" value={onboardingData.audience} icon={Users} active={onboardingStep >= 1} flashed={onboardingStep === 1} />
                 <ProfileSlot label="防坑雷区" value={onboardingData.traps} icon={ShieldAlert} active={onboardingStep >= 3} flashed={onboardingStep === 3} />
                 <ProfileSlot label="品牌声调" value={onboardingData.tone} icon={MessageSquare} active={onboardingStep >= 3} flashed={onboardingStep === 3} />
              </div>
           </div>
        ) : (
           <div className="w-[300px] 2xl:w-[340px] border-l border-neutral-200 bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary-500" />
                    <span className="text-[14px] font-black text-neutral-900">主动护航引擎</span>
                 </div>
                 <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-black rounded-md">{proactiveSuggestions.length} 待评估</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {proactiveSuggestions.map(s => (
                   <div key={s.id} className="bg-white border border-neutral-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border-l-4 group relative" style={{ borderLeftColor: s.type === 'emergency' ? '#e11d48' : s.type === 'attention' ? '#f59e0b' : '#3b82f6' }}>
                     <div className="flex items-center gap-2 mb-1.5">
                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 uppercase tracking-widest ${s.type === 'emergency' ? 'bg-rose-50 text-rose-600' : s.type === 'attention' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                         {s.type === 'emergency' ? '排查' : s.type === 'attention' ? '关注' : '优化'}
                       </span>
                       <h4 className="text-[13px] font-black text-neutral-900 tracking-tight truncate">{s.title}</h4>
                     </div>
                     <p className="text-[11px] text-neutral-500 font-bold leading-relaxed mb-3">{s.desc}</p>
                     
                     <div className="flex justify-end mt-2">
                       <button 
                         onClick={() => handleExecute(s.cmd)}
                         className="px-4 py-1.5 bg-neutral-50 text-neutral-700 hover:bg-neutral-900 hover:text-white rounded-[10px] text-[11px] font-black transition-colors"
                       >
                         {s.action}
                       </button>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
