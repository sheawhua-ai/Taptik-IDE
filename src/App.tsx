import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate, Trash2,
  Bot, TerminalSquare, RotateCw, RefreshCw, Hexagon, LogOut, Menu, ShoppingCart, Edit, User, Info, Cpu, Clock, CreditCard, Coins, GitBranch, BookOpen, DownloadCloud, Import, Lock, UploadCloud, ArrowUpRight, Component, Brain, Link2, FileBox, FileQuestion, Flame, CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check, Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2, AlertCircle, FileIcon, Filter, Layers, Orbit, Dna, ShieldHalf, ShieldCheck, Route, X, Gauge, Mic, ArrowRight,
  FolderPlus, ExternalLink, FileEdit, Folder, Share2 as ShareIcon, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { SkillMarket } from './components/SkillMarket';
import { DataCenter } from './components/DataCenter';
import { FileManager } from './components/FileManager';
import { Billing } from './components/Billing';
import { ServiceManagement } from './components/ServiceManagement';
import { Workbench } from './components/Workbench';

// Modular Merchant Components
import { SchemeManager } from './components/merchant/SchemeManager';
import { StaffManager } from './components/merchant/StaffManager';
import { AccountDetails } from './components/merchant/AccountDetails';

// 6 Rings Components
import { Strategy } from './components/rings/Strategy';
import { ContentProduction } from './components/rings/ContentProduction';
import { Publishing } from './components/rings/Publishing';
import { Interaction } from './components/rings/Interaction';
import { ExecutionCenter } from './components/rings/ExecutionCenter';
import { CRM } from './components/rings/CRM';
import { Metrics } from './components/rings/Metrics';

import { SubagentChat } from './components/SubagentChat';

// Existing Pages
import MerchantMatrix from './pages/MerchantMatrix';

// --- Types & Config ---
interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
}

const SHORTCUT_CATEGORIES = [
  { id: 'common', name: '常用', icon: Star, items: [{ text: '提取竞品核心痛点', type: 'prompt' }, { text: '小红书笔记一键清洗', type: 'prompt' }, { text: '调用: KOC 分发引擎', type: 'skill' }] },
  { id: 'content', name: '内容创作', icon: Filter, items: [{ text: '网感改写', type: 'prompt' }, { text: '种草大纲', type: 'prompt' }] },
  { id: 'workflow', name: '逻辑流程', icon: Route, items: [{ text: 'RAG 洞察', type: 'skill' }] },
  { id: 'data', name: '流量归因', icon: Target, items: [{ text: '分析爆文率', type: 'prompt' }, { text: '种草成本报表', type: 'prompt' }] }
];

const MOCK_PROJECTS = {
  'new-merchant': { id: 'new-merchant', name: '新项目：待体验', initial: '新', color: 'var(--neutral-100)', textColor: 'var(--neutral-400)', fileTree: [], chatHistory: [] },
  'project-a': { id: 'project-a', name: '品牌A：宠物食品组', initial: '宠', color: 'var(--primary-50)', textColor: 'var(--primary-500)', fileTree: [{ type: 'Folder', name: '营销物料库 (云端)', children: [{ type: 'File', name: '海报底图A.jpg' }] }, { type: 'Folder', name: '本地上传资料', children: [{ type: 'File', name: '通用全局规范.pdf' }, { type: 'RAG', name: '宠物标准话术.rag' }] }], chatHistory: [{ id: '1', title: '执行技能助手: 竞品标题仿写', time: '30 分钟前' }, { id: '2', title: '分析狗粮曝光数据', time: '1 小时前' }] },
  'project-b': { id: 'project-b', name: '品牌B：美妆官号', initial: '美', color: 'var(--danger-50)', textColor: 'var(--danger-500)', fileTree: [{ type: 'Folder', name: '美妆图库', children: [{ type: 'File', name: '口红试色图集.png' }] }, { type: 'Folder', name: '话术大纲', children: [{ type: 'RAG', name: '防敏感词过滤包.rag' }, { type: 'File', name: '竞品拆解.md' }] }], chatHistory: [{ id: '4', title: '短视频文案生成', time: '1 小时前' }] }
};

const SIDE_NAV_ITEMS = [
  { id: 'workbench', name: '工作台', sub: '调度与指令', icon: Cpu, color: 'text-orange-500' },
  { id: 'workflow', name: '项目中心', sub: '全链路跟踪与协作', icon: Workflow, color: 'text-primary-500' },
];

const PROJECT_TABS = [
  { id: 'strategy', name: '选题与策略', icon: Compass },
  { id: 'matrix', name: '项目与内容', icon: LayoutGrid },
  { id: 'content', name: '账号与分发', icon: Sparkles },
  { id: 'interaction', name: '客资', icon: MessageSquare },
  { id: 'metrics', name: '数据归因', icon: BarChart2 },
];

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<keyof typeof MOCK_PROJECTS>('new-merchant');
  const [onboardingStep, setOnboardingStep] = useState(0); 
  const [onboardingData, setOnboardingData] = useState<{ 
    strategyKeywords: { word: string; rate: string }[];
  }>({
    strategyKeywords: []
  });
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  
  useEffect(() => {
    if (!messagesMap['project-a']) {
      setMessagesMap({
        'project-a': [
          { id: 'start-1', role: 'agent', content: '您好，智能助手已就绪。正在分析您的 2024 夏季新品需求...' },
          { id: 'start-2', role: 'system', content: '「自动感知到任务包含小红书图文制作，后台已静默挂载专家技能 @AIGC_Creator/爆文逻辑蒸馏器」' },
          { id: 'start-3', role: 'agent', content: '由于这是高阶竞争赛道，我已经为您自动配置了行业专家的爆文模型。{recommend_skill_paid:爆文逻辑蒸馏器:50信用点/次:原创度提升 +42.5%}' }
        ],
        'new-merchant': [
          { id: 'new-1', role: 'agent', content: '欢迎加入！我是您的 AI 增长伙伴。' },
          { id: 'new-2', role: 'agent', content: '由于这是新项目，我建议按照工作台的“新手引导”三步走：从授权账号开始，我会带您发现本周的小红书爆文趋势。' },
          { id: 'new-3', role: 'agent', content: '如果您准备好了，请点击工作台上的「去授权主体」开始第一步。' }
        ]
      });
    }
  }, []);

  const activeProject = MOCK_PROJECTS[activeProjectId];
  const messages = messagesMap[activeProjectId] || [];
  const hasData = activeProjectId !== 'new-merchant' || onboardingStep >= 3;
  
  const setMessages = (setter: React.SetStateAction<Message[]>) => {
    setMessagesMap(prev => ({
      ...prev,
      [activeProjectId]: typeof setter === 'function' ? (setter as any)(prev[activeProjectId] || []) : setter
    }));
  };

  const [inputValue, setInputValue] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState<'skill' | 'agent' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeNav, setActiveNav] = useState('workbench'); 
  const [workflowTab, setWorkflowTab] = useState<'strategy' | 'matrix' | 'content' | 'execution' | 'interaction' | 'metrics'>('strategy');
  const [focusMode, setFocusMode] = useState<'normal' | 'creation' | 'monitoring' | 'review'>('normal');
  const [showSubagentChat, setShowSubagentChat] = useState(false);
  const [activeMission, setActiveMission] = useState<{ type: string; payload: any } | null>(null);
  
  useEffect(() => {
    const handleToFactory = (e: any) => {
      setActiveNav('workflow');
      setWorkflowTab('content');
      setActiveMission({ type: 'CONTENT_GEN', payload: e.detail });
    };
    const handleToStrategy = () => {
      setActiveNav('workflow');
      setWorkflowTab('strategy');
    };
    const handleToTab = (e: any) => {
      setActiveNav('workflow');
      setWorkflowTab(e.detail.tab);
    };
    const handleToFiles = () => {
       setActiveNav('files');
       setFilesTab('knowledge'); // switch to the knowledge total base directly
    };
    const handleToWorkbench = () => setActiveNav('workbench');
    
    const handleToMatrixCreate = () => {
      setActiveNav('workflow');
      setWorkflowTab('matrix');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('nav-to-create-project'));
      }, 50);
    };

    window.addEventListener('nav-to-factory', handleToFactory);
    window.addEventListener('nav-to-strategy', handleToStrategy);
    window.addEventListener('nav-to-tab', handleToTab);
    window.addEventListener('nav-to-files', handleToFiles);
    window.addEventListener('nav-to-strategy-start', handleToWorkbench);
    window.addEventListener('nav-to-matrix-create', handleToMatrixCreate);
    return () => {
      window.removeEventListener('nav-to-factory', handleToFactory);
      window.removeEventListener('nav-to-strategy', handleToStrategy);
      window.removeEventListener('nav-to-tab', handleToTab);
      window.removeEventListener('nav-to-files', handleToFiles);
      window.removeEventListener('nav-to-strategy-start', handleToWorkbench);
      window.removeEventListener('nav-to-matrix-create', handleToMatrixCreate);
    };
  }, []);

  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [skillMarketTab, setSkillMarketTab] = useState<string>('agent');
  const [creatingSkill, setCreatingSkill] = useState(false);
  const [filesTab, setFilesTab] = useState<'project' | 'knowledge'>('project');
  
  const [isUsagePopupOpen, setIsUsagePopupOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const insertMention = (name: string, type: '@' | '/') => {
    let newVal;
    if (inputValue.endsWith('@')) newVal = inputValue.slice(0, -1) + `@${name} `;
    else if (inputValue.endsWith('/')) newVal = inputValue.slice(0, -1) + `/${name} `;
    else newVal = inputValue + (inputValue && !inputValue.endsWith(' ') ? ' ' : '') + `${type}${name} `;
    setInputValue(newVal); setShowMentionMenu(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value; setInputValue(val);
    if (val.endsWith('@')) setShowMentionMenu('skill');
    else if (val.endsWith('/')) setShowMentionMenu('agent');
    else setShowMentionMenu(null);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, newMsg]); setInputValue('');
  };

  const renderMessageContent = (content: string, role: string) => {
    const parts = content.split(/(@[\u4e00-\u9fa5a-zA-Z0-9_-]+)|(「(?:🔗|📄|📁|🧠|📦) [^」]+」)|({recommend_skill_paid:[^}]+})|({recommend_skill_free:[^}]+})/);
    return parts.map((part, index) => {
      if (!part) return null;
          if (part.startsWith('@')) return <span key={index} className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[12px] font-bold ${role === 'user' ? 'bg-primary-500 text-white border border-primary-700' : 'bg-primary-50 text-primary-500'}`}><Component size={12}/> {part.substring(1)}</span>;
      if (part.startsWith('「')) {
         let icon = <FileBox size={12} />;
         if (part.startsWith('「🔗')) icon = <Link2 size={12} />;
         else if (part.startsWith('「📁')) icon = <FolderOpen size={12} />;
         else if (part.startsWith('「🧠')) icon = <Brain size={12} />;
         return <span key={index} className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-[4px] text-[12px] font-bold border ${role === 'user' ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>{icon} {part.slice(3, -1)}</span>;
      }

      if (part.startsWith('{recommend_skill_paid:')) {
        const [_, name, price, benefit] = part.replace('}', '').split(':');
        return (
          <div key={index} className="mt-5 mb-2 p-8 bg-neutral-0 border-2 border-primary-500/10 rounded-[32px] shadow-xl shadow-primary-500/5 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <Orbit size={160} className="text-primary-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-[20px] flex items-center justify-center text-primary-500">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-black text-neutral-900 tracking-tight">🔔 助手决策建议</h4>
                    <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5 opacity-70">关键优化动作</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-primary-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-sm">付费技能</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-[14px] text-neutral-600 font-bold leading-relaxed px-1">
                  当前笔记原创度偏低，建议安装 <span className="text-primary-500 font-black underline decoration-2 underline-offset-4">「{name}」</span>。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-4 bg-neutral-50 rounded-2xl border border-neutral-100/50 shadow-inner">
                     <span className="text-neutral-400 text-[10px] font-black uppercase tracking-tighter">💰 费用详情</span>
                     <span className="text-neutral-900 font-mono font-bold text-[13px]">{price}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-primary-50 rounded-2xl border border-primary-100 shadow-inner">
                     <span className="text-neutral-400 text-[10px] font-black uppercase tracking-tighter">📈 预计提升</span>
                     <span className="text-primary-500 font-mono font-bold text-[13px]">{benefit}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={(e) => {
                    const target = e.currentTarget;
                    target.disabled = true;
                    target.innerHTML = '<span class="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></span>';
                    setTimeout(() => {
                      target.parentElement?.parentElement?.parentElement?.classList.add('opacity-70', 'bg-neutral-50/50');
                      target.outerHTML = '<div class="flex items-center gap-2 text-success-600 font-black text-[13px] bg-success-50 px-6 py-3 rounded-2xl border border-success-200 shadow-sm"><Check size={18}/> 技能已挂载并应用</div>';
                    }, 800);
                  }}
                  className="flex-1 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-[14px] font-black shadow-lg shadow-neutral-200 hover:bg-primary-500 hover:translate-y-[-2px] active:scale-95 transition-all text-center"
                >
                  安装并应用
                </button>
                <button className="px-6 py-4 bg-neutral-0 border border-neutral-200 text-neutral-400 rounded-2xl text-[14px] font-black hover:text-neutral-900 hover:border-neutral-300 transition-all">忽略</button>
              </div>
            </div>
          </div>
        );
      }

      if (part.startsWith('{recommend_skill_free:')) {
        const [_, category, count, benefit] = part.replace('}', '').split(':');
        return (
          <div key={index} className="mt-5 mb-2 p-8 bg-neutral-0 border-2 border-dashed border-neutral-200 rounded-[32px] relative overflow-hidden group hover:border-primary-500/20 transition-all">
            <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <Dna size={200} className="text-neutral-900" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-50 rounded-[20px] flex items-center justify-center text-neutral-400 border border-neutral-100 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all">
                    <Filter size={24} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-black text-neutral-900 tracking-tight">🔔 助手执行建议</h4>
                    <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5 opacity-70">社区资源推荐</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-success-50 text-success-500 text-[10px] font-black rounded-xl border border-success-100 uppercase tracking-widest shadow-sm">🆓 免费</div>
              </div>
              
              <div className="space-y-4 mb-8 px-1">
                <p className="text-[14px] text-neutral-600 font-bold leading-relaxed">
                  当前笔记原创度偏低，建议安装 <span className="text-neutral-900 font-black">「{category}」</span> 类工具。
                  <br/>
                  市场上已有 <span className="text-primary-500 font-black underline underline-offset-2">{count} 款</span> 成熟可选资产。
                </p>
                <div className="flex items-center gap-3 text-neutral-500 text-[12px] font-black bg-neutral-50/50 w-fit px-3 py-1.5 rounded-lg border border-neutral-100">
                   <Zap size={14} className="text-warning-500 fill-current"/>
                   <span>📈 预期原创度提升 {benefit}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveNav('skills')}
                  className="flex-1 px-8 py-4 bg-neutral-0 border-2 border-neutral-900 text-neutral-900 rounded-2xl text-[14px] font-black shadow-md hover:bg-neutral-900 hover:text-white transition-all text-center active:scale-95"
                >
                  去市场中查看
                </button>
              </div>
            </div>
          </div>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#f8f9fa] text-neutral-900 font-sans overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>
      {/* Global Command Bar Overlay */}
      <AnimatePresence>
        {isCommandBarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1000] bg-neutral-900/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setIsCommandBarOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-neutral-100 flex items-center gap-4">
                <Search className="text-neutral-400" size={24} />
                <input 
                  autoFocus 
                  placeholder="输入指令召唤助手 (例如: '给奈雪生成今日笔记', '分析 ROI')" 
                  className="flex-1 bg-transparent border-none outline-none text-[18px] font-bold placeholder:text-neutral-300"
                />
              </div>
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <div className="px-3 py-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">快捷任务</div>
                 <div className="space-y-1">
                    {[
                      { icon: LayoutGrid, label: "项目与内容: 开始生成", sub: "基于项目策略批量挂机生成内容素材" },
                      { icon: Compass, label: "选题策略: 收集竞品热词", sub: "提取站内外最新高频热词" },
                      { icon: Sparkles, label: "账号与分发: 安排发布", sub: "将已完成素材分配至各个矩阵账号" },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-4 p-3.5 hover:bg-neutral-50 rounded-2xl transition-all group group-hover:translate-x-1">
                        <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                          <item.icon size={20} />
                        </div>
                        <div className="text-left">
                          <div className="text-[14px] font-black text-neutral-800">{item.label}</div>
                          <div className="text-[11px] text-neutral-400 font-medium">{item.sub}</div>
                        </div>
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SaaS Nav Sidebar */}
      <div className="w-[80px] xl:w-[260px] border-r border-neutral-200 bg-white flex flex-col shrink-0 h-full relative z-20 overflow-hidden">
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-6 font-black text-lg tracking-tight text-neutral-900 gap-3 mb-4 mt-2 shrink-0">
          <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
            <Cpu size={22} />
          </div>
          <div className="hidden xl:block leading-tight">
            <h1 className="text-[17px] font-black tracking-tight text-neutral-900 uppercase">智策系统</h1>
            <p className="text-[10px] font-bold text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded uppercase tracking-widest mt-0.5 inline-block">Pro v2.1</p>
          </div>
        </div>
        
        <div className="px-2 xl:px-4 py-2 cursor-pointer relative mb-4 shrink-0">
          <button 
            onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)} 
            className={`w-full flex items-center justify-center xl:justify-between hover:bg-neutral-50 rounded-xl p-2 xl:px-3 xl:py-2 text-sm font-bold text-neutral-700 transition-colors border border-transparent ${isProjectSelectorOpen ? 'bg-neutral-50 border-neutral-200 shadow-sm' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 xl:w-6 xl:h-6 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm shrink-0" style={{ backgroundColor: activeProject.color, color: activeProject.textColor }}>
                {activeProject.initial}
              </div>
              <span className="hidden xl:block truncate max-w-[120px]">{activeProject.name}</span>
            </div>
            <ChevronDown size={14} className="text-neutral-400 hidden xl:block shrink-0" />
          </button>
          
          <AnimatePresence>
            {isProjectSelectorOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 5 }}
                 className="absolute top-14 left-2 xl:left-4 w-[280px] bg-neutral-0 border border-neutral-200 shadow-2xl rounded-2xl z-50 overflow-hidden"
               >
                  <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                     {Object.values(MOCK_PROJECTS).map(proj => (
                         <button 
                           key={proj.id} 
                           onClick={() => { setActiveProjectId(proj.id as keyof typeof MOCK_PROJECTS); setIsProjectSelectorOpen(false); }} 
                           className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 rounded-xl transition-colors text-left group ${activeProjectId === proj.id ? 'bg-primary-50 text-primary-500' : 'text-neutral-700'}`}
                         >
                           <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm shrink-0" style={{ backgroundColor: proj.color, color: proj.textColor }}>
                             {proj.initial}
                           </div>
                           <div className="text-[13px] font-bold transition-colors truncate">{proj.name}</div>
                         </button>
                      ))}
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
           <div className="px-2 text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-2 hidden xl:block">核心控制</div>
           {SIDE_NAV_ITEMS.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-center xl:justify-start gap-4 p-3 rounded-2xl transition-all duration-300 group ${activeNav === item.id ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/10' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
              >
                 <item.icon size={20} className={`shrink-0 ${activeNav === item.id ? 'text-primary-400' : 'group-hover:text-neutral-900'}`} />
                 <div className="hidden xl:block text-left">
                    <p className="text-[14px] font-black leading-tight">{item.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter mt-0.5 ${activeNav === item.id ? 'text-neutral-400' : 'text-neutral-300 group-hover:text-neutral-400'}`}>{item.sub}</p>
                 </div>
              </button>
           ))}

           <div className="border-t border-neutral-100 pt-8 mt-4 space-y-3 pb-8">
              <div className="px-2 text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-2 hidden xl:block">配置与资产</div>
              {[
                { id: 'files', name: '知识库管理', sub: '全局沉淀文档', icon: BookOpen },
                { id: 'skills', name: '专家与技能市场', sub: '扩展行业经验库', icon: ShoppingCart },
                { id: 'billing', name: '用量与计费', sub: '信用点与账单', icon: Gauge },
                { id: 'settings', name: '系统设置', sub: '主体与员工管理', icon: Settings },
              ].map(item => (
                 <button 
                   key={item.id}
                   onClick={() => setActiveNav(item.id)}
                   className={`w-full flex items-center justify-center xl:justify-start gap-4 p-3 rounded-2xl transition-all group ${activeNav === item.id ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/10' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                 >
                    <item.icon size={20} className={`shrink-0 ${activeNav === item.id ? 'text-primary-400' : 'group-hover:text-neutral-900'}`} />
                    <div className="hidden xl:block text-left">
                       <p className="text-[14px] font-black leading-tight">{item.name}</p>
                       <p className={`text-[10px] font-bold uppercase tracking-tighter mt-0.5 ${activeNav === item.id ? 'text-neutral-400' : 'text-neutral-300 group-hover:text-neutral-400'}`}>{item.sub}</p>
                    </div>
                 </button>
              ))}
           </div>
        </div>

        <div className="p-3 xl:p-4 border-t border-neutral-100 flex flex-col gap-1 bg-white relative z-30 shrink-0">
           <div className="flex items-center gap-3 p-1 xl:px-3 py-3 mt-2">
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-500 text-[11px] shadow-inner shrink-0 cursor-pointer hover:opacity-80 transition-opacity">H</div>
              <div className="hidden xl:flex flex-1 min-w-0 flex-col">
                 <p className="text-[13px] font-black text-neutral-900 truncate tracking-tight">hua xu</p>
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">团队管理模式</p>
              </div>
              <button className="text-neutral-300 hover:text-neutral-600 hidden xl:block shrink-0">
                 <LogOut size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex-1 min-w-0 h-full bg-white relative flex flex-col">
        {activeNav === 'workbench' && (
           <div className="flex-1 flex flex-col h-full overflow-hidden">
              <Workbench 
                setActiveNav={setActiveNav} 
                setDataSubNav={() => {}} 
                onboardingStep={onboardingStep}
                setOnboardingStep={setOnboardingStep}
                setOnboardingData={setOnboardingData}
                activeProjectId={activeProjectId}
              />
           </div>
        )}

        {/* 专注模式切换器 (仅在工作流模式显示) */}
        {activeNav === 'workflow' && (
          <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-white">
             {/* 顶部导航与专注模式 */}
             <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-10">
                   {PROJECT_TABS.map(tab => (
                     <button 
                       key={tab.id}
                       onClick={() => setWorkflowTab(tab.id as any)}
                       className={`flex items-center gap-2 px-1 py-4 text-[13px] font-black transition-all relative group ${workflowTab === tab.id ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                     >
                        <tab.icon size={16} className={workflowTab === tab.id ? 'text-primary-500' : 'text-neutral-300'} />
                        <span>{tab.name}</span>
                        {workflowTab === tab.id && (
                          <motion.div layoutId="wfTab" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-neutral-900 rounded-full" />
                        )}
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex-1 flex w-full overflow-hidden bg-[#fafafa] relative">
               <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-white">
                 {workflowTab === 'strategy' && (
                    <Strategy hasData={hasData} strategyData={onboardingData.strategyKeywords} />
                 )}

                 {workflowTab === 'matrix' && (
                    <MerchantMatrix />
                 )}
                 
                 {workflowTab === 'content' && (
                    <ContentProduction hasData={hasData} />
                 )}

                 {workflowTab === 'interaction' && (
                    <Interaction hasData={hasData} />
                 )}

                 {workflowTab === 'metrics' && (
                    <Metrics />
                 )}
               </div>

               {/* 环境感知 AI 搭档侧边栏 */}
               <AnimatePresence>
                 {(showSubagentChat && focusMode !== 'review') && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 400, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="border-l border-neutral-100 bg-white shadow-xl z-20 flex flex-col shrink-0"
                    >
                      <SubagentChat 
                        moduleId={workflowTab} 
                        moduleName={PROJECT_TABS.find(t => t.id === workflowTab)?.name || '业务助手'} 
                        onClose={() => setShowSubagentChat(false)}
                      />
                    </motion.div>
                 )}
               </AnimatePresence>

               {(!showSubagentChat && focusMode !== 'review') && (
                 <button 
                   onClick={() => setShowSubagentChat(true)}
                   className="absolute right-6 bottom-6 w-12 h-12 bg-neutral-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-primary-500 transition-all z-30 active:scale-95"
                 >
                   <Bot size={20} />
                 </button>
               )}
             </div>
          </div>
        )}

        {activeNav === 'files' && <FileManager filesTab={filesTab} setFilesTab={setFilesTab} activeProject={activeProject} activeDoc={activeDoc} setActiveDoc={setActiveDoc} />}
        {activeNav === 'skills' && <SkillMarket creatingSkill={creatingSkill} setCreatingSkill={setCreatingSkill} skillMarketTab={skillMarketTab} setSkillMarketTab={setSkillMarketTab} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} />}
        {activeNav === 'billing' && (
           <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
              <div className="h-14 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white">
                 <h2 className="text-[16px] font-black text-neutral-900 tracking-tight">用量与计费</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-12">
                 <Billing />
              </div>
           </div>
        )}
        {activeNav === 'settings' && (
           <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              <div className="h-14 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white">
                 <h2 className="text-[16px] font-black text-neutral-900 tracking-tight">系统设置</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-12">
                 <ServiceManagement />
              </div>
           </div>
        )}


      </div>
    </div>
  );
}
