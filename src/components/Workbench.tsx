import React, { useState, useEffect, useRef } from 'react';
import { 
 Search, Sparkles, Target, BarChart2, Workflow, MessageSquare,
 Compass, Lightbulb, Bot, LayoutGrid, Cpu, Share2, PanelLeftClose, PanelRightClose,
 User, Send, FileText, Plus, Check, CalendarDays, LineChart, PanelLeftOpen, PanelRightOpen, History, FolderOpen, Brain, BookOpen, ArrowUpRight,
 ChevronRight, Wrench, BrainCircuit, CheckCircle2, X, MoreHorizontal, Edit2, Save, Share, Trash2, Folder,
 Copy, Settings, Palette, HelpCircle, ArrowUpCircle, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip, ArrowDownRight, PieChart
, Loader2, ChevronDown} from 'lucide-react';
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
 card?: {
    type: 'confirmation' | 'progress' | 'result';
    
    // For confirmation
    goal?: string;
    tools?: string[];
    destinations?: string[];
    wontDo?: string[];
    recommendedDestination?: string;
    
    // For progress
    currentStep?: string;
    steps?: { title: string, status: 'pending' | 'active' | 'completed' }[];
    isExpanded?: boolean;

    // For result
    title?: string;
    items?: { title: string, desc: string }[];
    recommendation?: string;
    actions?: string[];
    
    // Common
    cmd?: string;
 };
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
 <div className="flex items-center gap-2 text-[13px] text-neutral-600">
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
 <div className={` ${t.status === 'warning' ? 'text-warning-900' : t.status === 'success' ? 'text-emerald-900' : 'text-neutral-700'}`}>{t.content}</div>
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
 <div className="text-[11px] text-neutral-400 mb-0.5">{label}</div>
 <div className={`text-[13px] truncate transition-all duration-500 ${active ? 'text-neutral-900' : 'text-neutral-300'}`}>
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


const QUICK_SHORTCUTS = [
  { id: '1', name: '文档处理', action: '帮我总结和处理这份文档。' },
  { id: '2', name: '金融服务', action: '提供金融分析和建议。' },
  { id: '3', name: '高考我帮你', action: '解答高考相关问题并提供志愿建议。' },
  { id: '4', name: '数据分析及可视化', action: '帮我分析这些数据并生成可视化图表。' },
  { id: '5', name: '深度研究', action: '对这个主题进行深入的学术和市场研究。' }
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, onboardingStep, setOnboardingStep, onboardingData, setOnboardingData, activeProjectId }) => {
 const [query, setQuery] = useState('');
  const [selectedShortcut, setSelectedShortcut] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Max height approx half page (e.g. 300px)
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
    }
  }, [query, selectedShortcut]);

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

 // Handle open-expert events
 useEffect(() => {
 const handleOpenExpert = (e: any) => {
 const { expert, context } = e.detail;
 const expertMap: Record<string, string> = {
 '策略专家': 'strategy',
 '内容专家': 'content',
 '转化专家': 'interaction',
 '策略推演指导': 'strategy'
 };
 const targetId = expertMap[expert] || 'core';
 setActiveAgentId(targetId);
 setLeftExpanded(false); // Extend the workspace by hiding left menu
 window.dispatchEvent(new CustomEvent('collapse-sidebar', { detail: { collapsed: true } }));
 if (context) {
 setQuery(context); // Put it in the input box so the user can edit it, or directly launch. 
 setTimeout(() => {
 document.getElementById('chat-input')?.focus();
 }, 100);
 }
 };
 window.addEventListener('open-expert', handleOpenExpert);
 return () => window.removeEventListener('open-expert', handleOpenExpert);
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
 type: 'troubleshoot', 
 title: '笔记互动率异常', 
 desc: '您最近发布的 3 篇「宠物粮」笔记互动量下降 15%，疑似进入低推荐状态。',
 suggestion: '建议先排查内容结构与账号健康度。',
 action: '立即排查',
 cmd: '排查宠物粮笔记互动率异常问题'
 },
 { 
 id: 's2', 
 type: 'opportunity', 
 title: '发现低粉爆款方向', 
 desc: '「幼犬换粮避坑」近 24 小时出现低粉高互动样本，适合当前宠物食品组做自然流测试。',
 suggestion: '建议基于该样本生成一批测试选题。',
 action: '生成选题包',
 cmd: '基于「幼犬换粮避坑」生成测试选题包'
 },
 { 
 id: 's3', 
 type: 'collaboration', 
 title: '笔记评论回复', 
 desc: '有 6 条评论待回复，需求未进入 Taptik 任务流，建议同步到商家。',
 suggestion: '建议将任务派发至相关运营组执行。',
 action: '同步任务',
 cmd: '同步笔记评论回复任务到商家'
 }
 ]);

 const handleExecuteSuggestion = (suggestion: any) => {
    const userMsgId = Math.random().toString(36).substring(2);
    const agentMsgId = Math.random().toString(36).substring(2);
    
    const newMsg: ChatMessage = { id: userMsgId, role: 'user', content: suggestion.cmd, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      time: '刚才',
      isThinking: true
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, agentMsg]);
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === agentMsgId ? { 
          ...m, 
          isThinking: false, 
          card: {
            type: 'confirmation',
            goal: `为「商家 A：宠物食品组」寻找本周可执行的蓝海内容机会，并生成一批自然流笔记。`,
            tools: ['策略专家：搜索蓝海词和低粉爆款', '内容专家：生成真人感笔记', '数据专家：参考历史账号表现', '知识库：调用品牌卖点和禁忌词'],
            destinations: ['宠粮新客运营项目', '内容车间草稿区', '项目经验库'],
            wontDo: ['不会自动发布', '不会自动通知客户', '不会自动修改排期'],
            recommendedDestination: '写入「宠粮新客运营」项目，并生成内容任务',
            cmd: suggestion.cmd
          } 
        } : m));
      }, 800);
    }, 400);
  };

  const handleToggleProgress = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.card && m.card.type === 'progress') {
        return { ...m, card: { ...m.card, isExpanded: !m.card.isExpanded } };
      }
      return m;
    }));
  };

  const handleConfirmExecute = (msgId: string, cmd: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          card: {
            type: 'progress',
            currentStep: '正在读取商家画像...',
            steps: [
              { title: '正在读取商家画像', status: 'active' },
              { title: '正在调用品牌知识库', status: 'pending' },
              { title: '正在搜索低粉爆款样本', status: 'pending' },
              { title: '正在分析账号历史表现', status: 'pending' },
              { title: '正在生成选题包', status: 'pending' },
              { title: '正在准备内容草稿', status: 'pending' }
            ],
            isExpanded: true
          }
        };
      }
      return m;
    }));

    const stepDelays = [1000, 2000, 3000, 4000, 5000, 6000];
    stepDelays.forEach((delay, index) => {
      setTimeout(() => {
        setMessages(prev => prev.map(m => {
          if (m.id === msgId && m.card && m.card.type === 'progress') {
            const newSteps = [...m.card.steps!];
            if (index > 0) newSteps[index - 1].status = 'completed';
            newSteps[index].status = 'active';
            return {
              ...m,
              card: {
                ...m.card,
                currentStep: newSteps[index].title,
                steps: newSteps
              }
            };
          }
          return m;
        }));
      }, delay);
    });

    setTimeout(() => {
      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          return {
            ...m,
            card: {
              type: 'result',
              title: '已完成蓝海机会分析',
              items: [
                { title: '幼犬换粮避坑', desc: '自然流机会强，适合素人避坑口吻' },
                { title: '国产冻干平替测评', desc: '适合测评号，适合作为第二优先级' },
                { title: '多猫家庭喂养清单', desc: '搜索热度稳定，适合长期内容池' }
              ],
              recommendation: '我建议先启动「幼犬换粮避坑」7 天搜索卡位项目。',
              actions: ['开始操盘', '继续深挖', '保存到项目']
            }
          };
        }
        return m;
      }));
    }, 7000);
  };

 const handleExecute = (customQuery?: string) => {
    let finalQuery = customQuery || query;
    
    if (selectedShortcut && !customQuery) {
      if (selectedShortcut.action === '') {
        finalQuery = `[${selectedShortcut.name}] ${finalQuery}`.trim();
      } else if (!finalQuery.includes(selectedShortcut.name) && !finalQuery.includes(selectedShortcut.action)) {
        finalQuery = `[${selectedShortcut.name}] ${finalQuery}`.trim();
      }
    }
    
    if (!finalQuery.trim()) {
      if (selectedShortcut && selectedShortcut.action === '') {
        finalQuery = `执行技能：${selectedShortcut.name}`;
      } else {
        return;
      }
    }

    setSelectedShortcut(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMsgId = Math.random().toString(36).substring(2);
    const agentMsgId = Math.random().toString(36).substring(2);

    const newMsg: ChatMessage = { id: userMsgId, role: 'user', content: finalQuery, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    
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

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === agentMsgId ? {
        ...m,
        isThinking: false,
        card: {
          type: 'confirmation',
          goal: `为您执行：${finalQuery}`,
          tools: ['策略专家：搜索蓝海词和低粉爆款', '内容专家：生成真人感笔记', '数据专家：参考历史账号表现'],
          destinations: ['宠粮新客运营项目', '内容车间草稿区'],
          wontDo: ['自动发布', '自动修改排期'],
          recommendedDestination: '写入「宠粮新客运营」项目，并生成内容任务',
          cmd: finalQuery
        }
      } : m));
      setIsProcessing(false);
    }, 800);
  };

  return (
 <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-neutral-900">
 {/* Top Header */}
 <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6 bg-white shrink-0 z-20">
 <div className="flex items-center gap-3">
 <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
 <Cpu size={16} />
 </div>
 <h2 className="text-[14px] font-semibold tracking-tight">工作台</h2>
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
 <h3 className="text-xl font-semibold text-primary-600 tracking-tight">松开以上传文件</h3>
 <p className="text-[13px] text-primary-500/70 mt-2">支持本地文件、文件夹拖拽上传</p>
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
 <h2 className="text-[28px] font-semibold text-neutral-900 tracking-tight leading-snug mb-3">
 {isNewMerchant ? '欢迎入驻，开始构建您的专属品牌诊断' : '今天需要我帮您做些什么？'}
 </h2>
 <p className="text-[14px] text-neutral-500 leading-relaxed mb-10 max-w-lg">
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
 className="px-8 py-3.5 bg-neutral-900 text-white rounded-2xl text-[14px] hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-500/20 transition-all flex items-center gap-2 active:scale-95"
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
 <div className={`text-left px-6 py-4 rounded-3xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'agent' ? 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-neutral-100 text-neutral-800 rounded-tl-lg' : 'bg-primary-500 text-white shadow-primary-500/20 rounded-tr-lg'}`}>
 {msg.content}
 </div>
 )}
 {msg.card && msg.card.type === 'confirmation' && (
  <div className="mt-3 bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden text-neutral-900 w-full min-w-[400px]">
    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
    <div className="mb-4">
      <h4 className="text-[13px] font-medium text-neutral-500 mb-1">我理解你的目标是：</h4>
      <p className="text-[14px] font-medium text-neutral-900">{msg.card.goal}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <h4 className="text-[12px] font-medium text-neutral-500 mb-1">我将调用：</h4>
        <ul className="text-[13px] text-neutral-700 space-y-1">
          {msg.card.tools?.map((t, idx) => (
            <li key={idx} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-neutral-300" />{t}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[12px] font-medium text-neutral-500 mb-1">结果将落到：</h4>
        <ul className="text-[13px] text-neutral-700 space-y-1">
          {msg.card.destinations?.map((d, idx) => (
            <li key={idx} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-neutral-300" />{d}</li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="mb-5">
      <h4 className="text-[12px] font-medium text-neutral-500 mb-1">不会执行：</h4>
      <ul className="text-[13px] text-neutral-700 space-y-1">
        {msg.card.wontDo?.map((w, idx) => (
          <li key={idx} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-neutral-300" />{w}</li>
        ))}
      </ul>
    </div>
    
    <div className="bg-primary-50 rounded-xl p-3 mb-5 border border-primary-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Folder size={16} className="text-primary-500" />
        <span className="text-[13px] font-medium text-primary-800">落点推荐</span>
      </div>
      <div className="text-[13px] text-primary-600 bg-white px-2 py-1 rounded-md border border-primary-100">
        {msg.card.recommendedDestination}
      </div>
    </div>
    
    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
      <button 
        onClick={() => handleConfirmExecute(msg.id, msg.card!.cmd)}
        className="px-6 py-2 bg-neutral-900 text-white hover:bg-primary-600 rounded-xl text-[13px] font-medium transition-colors flex-1"
      >
        确认执行
      </button>
      <button className="px-6 py-2 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 rounded-xl text-[13px] font-medium transition-colors border border-neutral-200 flex-1">
        调整一下
      </button>
    </div>
  </div>
)}

{msg.card && msg.card.type === 'progress' && (
  <div className="mt-3 bg-white border border-neutral-200/60 rounded-2xl shadow-sm text-left relative overflow-hidden text-neutral-900 w-full min-w-[400px]">
    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
    <div 
      className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
      onClick={() => handleToggleProgress(msg.id)}
    >
      <div className="flex items-center gap-3">
        <Loader2 size={16} className="animate-spin text-primary-500" />
        <span className="text-[14px] font-medium">Agent 正在执行: {msg.card.currentStep}</span>
      </div>
      <ChevronDown size={16} className={`text-neutral-400 transition-transform ${msg.card.isExpanded ? 'rotate-180' : ''}`} />
    </div>
    
    <AnimatePresence>
      {msg.card.isExpanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-0 border-t border-neutral-100">
            <div className="space-y-3 mt-4">
              {msg.card.steps?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-primary-100 text-primary-600' : step.status === 'active' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                    {step.status === 'completed' ? <Check size={12} /> : step.status === 'active' ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />}
                  </div>
                  <span className={`text-[13px] ${step.status === 'completed' ? 'text-neutral-800' : step.status === 'active' ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

{msg.card && msg.card.type === 'result' && (
  <div className="mt-3 bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden text-neutral-900 w-full min-w-[400px]">
    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
    <h3 className="text-[16px] font-semibold mb-4 text-emerald-600 flex items-center gap-2">
      <CheckCircle2 size={18} />
      {msg.card.title}
    </h3>
    
    <div className="space-y-3 mb-5">
      {msg.card.items?.map((item, idx) => (
        <div key={idx} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
          <h4 className="text-[13px] font-semibold text-neutral-900 mb-1">{idx + 1}. {item.title}</h4>
          <p className="text-[12px] text-neutral-500">{item.desc}</p>
        </div>
      ))}
    </div>
    
    <div className="bg-emerald-50 text-emerald-800 text-[13px] p-3 rounded-xl mb-5 font-medium border border-emerald-100">
      {msg.card.recommendation}
    </div>
    
    <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
      {msg.card.actions?.map((action, idx) => (
        <button 
          key={idx}
          className={`px-4 py-1.5 rounded-xl text-[12px] font-medium transition-colors ${idx === 0 ? 'bg-neutral-900 text-white hover:bg-emerald-600' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
        >
          {action}
        </button>
      ))}
    </div>
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
 className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-[12px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
 >
 <FileText size={14} className="text-neutral-400" />
 {capsule.label}
 </button>
 ))}
 <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-[12px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all flex items-center gap-1.5">
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

 {/* Shortcuts Bar */}
 <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar px-2">
 {QUICK_SHORTCUTS.map(shortcut => (
 <button
 key={shortcut.id}
 onClick={() => {
 setSelectedShortcut(shortcut);
 setQuery(shortcut.action);
 if (textareaRef.current) {
 textareaRef.current.focus();
 }
 }}
 className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[13px] rounded-lg transition-colors shrink-0"
 >
 {shortcut.name}
 <ArrowDownRight size={14} className="text-neutral-400" />
 </button>
 ))}
 </div>

 <div className="bg-white p-2 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex items-end gap-3 pr-3 border border-neutral-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all text-neutral-900">
 
 {/* Universal Add Button */}
 <div className="relative">
 <button 
 onClick={() => { setIsAttachMenuOpen(!isAttachMenuOpen); setIsAgentSelectorOpen(false); setIsCommandDirOpen(false); }}
 className={`ml-1 w-10 h-10 flex items-center justify-center rounded-full transition-all ${isAttachMenuOpen ? 'bg-primary-50 text-primary-500 rotate-45' : 'text-neutral-400 hover:text-primary-500 hover:bg-neutral-50'}`}
 title="添加"
 >
 <Plus size={22} className="transition-transform duration-300" />
 </button>
 <AnimatePresence>
 {isAttachMenuOpen && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setIsAttachMenuOpen(false)} />
 <motion.div 
 initial={{ opacity: 0, y: 10, scale: 0.96 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.96 }}
 className="absolute left-0 bottom-full mb-3 w-[260px] bg-white border border-neutral-100 shadow-xl rounded-2xl z-50 py-2 flex flex-col overflow-hidden"
 >
 <div className="px-3 py-1.5">
 <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 rounded-xl text-neutral-700 hover:text-neutral-900 transition-colors text-[13px] text-left w-full group">
 <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
 <Folder size={14} />
 </div>
 文件和文件夹
 </button>
 </div>
 
 <div className="h-px bg-neutral-100 w-full" />
 
 <div className="px-3 py-2">
 <div className="text-[11px] text-neutral-400 font-medium px-2 mb-1">智能体</div>
 {AVAILABLE_AGENTS.slice(0, 3).map(agent => (
 <button key={agent.id} onClick={() => { setActiveAgentId(agent.id); setIsAttachMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-xl text-neutral-700 hover:text-neutral-900 transition-colors text-[13px] text-left w-full group">
 <agent.icon size={16} className={`shrink-0 ${agent.iconColor || 'text-neutral-400'}`} />
 <span className="truncate">{agent.name}</span>
 </button>
 ))}
 </div>
 
 <div className="h-px bg-neutral-100 w-full" />
 
 <div className="px-3 py-2">
 <div className="text-[11px] text-neutral-400 font-medium px-2 mb-1">技能</div>
 {[
 { id: 's1', name: '提取竞品核心痛点', icon: Target, color: 'text-rose-500' },
 { id: 's2', name: '小红书笔记一键清洗', icon: Sparkles, color: 'text-blue-500' },
 { id: 's3', name: '分析爆文率', icon: LineChart, color: 'text-emerald-500' }
 ].map(skill => (
 <button key={skill.id} onClick={() => { 
                  setSelectedShortcut({ id: skill.id, name: skill.name, action: '' }); 
                  setIsAttachMenuOpen(false); 
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }} className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-xl text-neutral-700 hover:text-neutral-900 transition-colors text-[13px] text-left w-full group">
 <skill.icon size={16} className={`shrink-0 ${skill.color}`} />
 <span className="truncate">{skill.name}</span>
 </button>
 ))}
 </div>
 
 <div className="h-px bg-neutral-100 w-full" />
 
 <div className="px-3 py-1.5 pt-2">
 <button onClick={() => { setActiveNav('skills'); setIsAttachMenuOpen(false); }} className="flex items-center justify-between px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl text-neutral-600 hover:text-neutral-900 transition-colors text-[12px] w-full group">
 <span>前往技能和专家市场</span>
 <ArrowUpRight size={14} className="text-neutral-400 group-hover:text-neutral-600" />
 </button>
 </div>
 
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>

 <div className="flex-1 relative flex flex-col min-h-[48px] justify-center py-2">
 {selectedShortcut && (
 <div className="flex mb-1 ml-2">
 <div className="flex items-center gap-1.5 bg-primary-50 text-primary-600 border border-primary-100 px-2.5 py-1 rounded-lg text-[13px] shadow-sm shrink-0 font-medium">
 <PieChart size={14} className="text-primary-500" />
 <span>{selectedShortcut.name}</span>
 <button 
            onClick={() => {
              setSelectedShortcut(null);
              setQuery('');
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
              }
            }} 
            className="hover:text-primary-800 ml-1 opacity-60 hover:opacity-100 transition-opacity"
          >
 <X size={14} />
 </button>
 </div>
 </div>
 )}
 <textarea 
 ref={textareaRef}
 id="chat-input"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 onFocus={() => setIsInputFocused(true)}
 onBlur={() => setIsInputFocused(false)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleExecute();
 setSelectedShortcut(null);
 if (textareaRef.current) {
 textareaRef.current.style.height = 'auto';
 }
 }
 }}
 placeholder={query || selectedShortcut ? '' : `今天帮您做些什么？输入 ${SUGGESTIONS[placeholderIndex]}`} 
 className="bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full placeholder:text-neutral-400 placeholder:transition-opacity pl-2 resize-none overflow-y-auto"
 rows={1}
 style={{ minHeight: '24px', maxHeight: '300px' }}
 />
 </div>
 
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
 <h3 className="text-[14px] font-semibold text-neutral-900 tracking-tight">Agent 瀑布工作流</h3>
 <div className="text-[11px] text-neutral-500 mt-0.5 tracking-wide">任务执行链路</div>
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
 <span className={`text-[12px] ${step.active ? 'text-primary-600' : 'text-neutral-800'}`}>{step.stage}</span>
 <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${step.active ? 'bg-primary-50 text-primary-600' : step.status === '完成' ? 'bg-neutral-100 text-neutral-600' : 'hidden'}`}>{step.status}</span>
 </div>
 <span className="text-[10px] text-neutral-400 font-mono tracking-tight">{step.time}</span>
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
 <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-lg text-[11px] ">
 <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
 Agent 正在运行
 </div>
 <div className="flex items-center gap-2 text-[13px] text-neutral-600">
 <span className="text-neutral-400 ">当前节点:</span> 批量内容分发与素材组织中...
 </div>
 </div>
 <div className="flex items-center gap-3">
 <span className="text-[11px] text-neutral-400 group-hover:text-primary-500 transition-colors">{bottomExpanded ? '收起工作流' : '展开工作流详细'}</span>
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
 <div className="p-4 border-b border-neutral-100 flex items-center gap-2 bg-white shrink-0">
 <Sparkles size={18} className="text-primary-500" />
 <span className="text-[14px] text-neutral-900">品牌心智扫描</span>
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
 <ProfileSlot label="品牌调性" value={onboardingData.brand} icon={Compass} active={onboardingStep >= 0} flashed={onboardingStep === 0} />
 <ProfileSlot label="主打产品" value={onboardingData.product} icon={Target} active={onboardingStep >= 0} flashed={onboardingStep === 0} />
 <ProfileSlot label="目标受众" value={onboardingData.audience} icon={Users} active={onboardingStep >= 1} flashed={onboardingStep === 1} />
 <ProfileSlot label="防坑雷区" value={onboardingData.traps} icon={ShieldAlert} active={onboardingStep >= 3} flashed={onboardingStep === 3} />
 <ProfileSlot label="品牌声调" value={onboardingData.tone} icon={MessageSquare} active={onboardingStep >= 3} flashed={onboardingStep === 3} />
 </div>
 </div>
 ) : (
 <div className="w-[300px] 2xl:w-[340px] border-l border-neutral-200 bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
 <div className="p-4 border-b border-neutral-100 bg-white shrink-0">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <ShieldCheck size={18} className="text-primary-500" />
 <span className="text-[15px] font-semibold text-neutral-900">主动护航</span>
 </div>
 <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded-md">{proactiveSuggestions.length} 项</span>
 </div>
 <p className="text-[11px] text-neutral-500 leading-tight">基于当前商家、项目和数据自动发现机会与风险</p>
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
 {proactiveSuggestions.map(s => {
 const typeConfig = {
 'troubleshoot': { label: '排查', color: 'text-rose-600', bg: 'bg-rose-50', border: '#e11d48' },
 'opportunity': { label: '机会', color: 'text-emerald-600', bg: 'bg-emerald-50', border: '#10b981' },
 'optimize': { label: '优化', color: 'text-blue-600', bg: 'bg-blue-50', border: '#3b82f6' },
 'collaboration': { label: '协同', color: 'text-indigo-600', bg: 'bg-indigo-50', border: '#6366f1' }
 }[s.type as string] || { label: '提示', color: 'text-neutral-600', bg: 'bg-neutral-50', border: '#9ca3af' };

 return (
 <div key={s.id} className="bg-white border border-neutral-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border-l-4 group relative flex flex-col" style={{ borderLeftColor: typeConfig.border }}>
 <div className="flex items-center gap-2 mb-2">
 <span className={`text-[10px] px-2 py-0.5 rounded font-medium flex-shrink-0 ${typeConfig.bg} ${typeConfig.color}`}>
 {typeConfig.label}
 </span>
 <h4 className="text-[14px] font-semibold text-neutral-900 tracking-tight truncate">{s.title}</h4>
 </div>
 <div className="mb-3">
 <p className="text-[12px] text-neutral-500 leading-relaxed mb-2"><span className="font-medium text-neutral-700">为什么重要：</span><br/>{s.desc}</p>
 <p className="text-[12px] text-neutral-500 leading-relaxed"><span className="font-medium text-neutral-700">建议动作：</span><br/>{(s as any).suggestion}</p>
 </div>
 
 <div className="flex justify-end mt-auto pt-2 border-t border-neutral-50">
 <button 
 onClick={() => handleExecuteSuggestion(s)}
 className="px-4 py-1.5 bg-neutral-50 text-neutral-700 hover:bg-neutral-900 hover:text-white rounded-[10px] text-[12px] font-medium transition-colors"
 >
 {s.action}
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

