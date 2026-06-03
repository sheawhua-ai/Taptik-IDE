import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate, Trash2,
  Bot, TerminalSquare, RotateCw, RefreshCw, Hexagon, LogOut, Menu, ShoppingCart, Edit, User, Info, Cpu, Clock, CreditCard, Coins, GitBranch, BookOpen, DownloadCloud, Import, Lock, UploadCloud, ArrowUpRight, Component, Brain, Link2, FileBox, FileQuestion, Flame, CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check, Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2, AlertCircle, FileIcon, Filter, Layers, Orbit, Dna, ShieldHalf, ShieldCheck, Route, X, Gauge, Mic,
  FolderPlus, ExternalLink, FileEdit, Folder
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
import { CRM } from './components/rings/CRM';
import { Metrics } from './components/rings/Metrics';

// Existing Pages
import MerchantMatrix from './pages/MerchantMatrix';

// --- Types & Config ---
interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
}

const SHORTCUT_CATEGORIES = [
  { id: 'common', name: '我常用的', icon: Star, items: [{ text: '提取竞品核心痛点', type: 'prompt' }, { text: '一键洗稿(3平台)', type: 'prompt' }, { text: '调用: KOC分发引擎', type: 'skill' }] },
  { id: 'content', name: '内容创作', icon: Filter, items: [{ text: '小红书高赞网感改写', type: 'prompt' }, { text: '抖音/快手短视频脚本生成', type: 'prompt' }, { text: '商品种草/测评大纲搭建', type: 'prompt' }] },
  { id: 'workflow', name: '逻辑与流转', icon: Route, items: [{ text: '调用: 本地Tauri防重巡检', type: 'skill' }, { text: '分析: 蓝海词RAG洞察', type: 'skill' }] },
  { id: 'data', name: '流量归因', icon: Target, items: [{ text: '分析昨日大盘回收效果', type: 'prompt' }, { text: '导出笔记爆文率报表', type: 'prompt' }] }
];

const MOCK_PROJECTS = {
  'project-a': { id: 'project-a', name: '商家A：宠物食品组', initial: '宠', color: 'var(--primary-50)', textColor: 'var(--primary-500)', fileTree: [{ type: 'Folder', name: '营销物料库 (云端)', children: [{ type: 'File', name: '海报底图A.jpg' }] }, { type: 'Folder', name: '本地上传资料', children: [{ type: 'File', name: '通用全局规范.pdf' }, { type: 'RAG', name: '宠物标准话术.rag' }] }], chatHistory: [{ id: '1', title: '执行 Skill: 竞品标题仿写助手', time: '30 分钟前' }, { id: '2', title: '分析狗粮销售数据', time: '1 小时前' }] },
  'project-b': { id: 'project-b', name: '商家B：美妆旗舰店', initial: '美', color: 'var(--danger-50)', textColor: 'var(--danger-500)', fileTree: [{ type: 'Folder', name: '美妆图库', children: [{ type: 'File', name: '口红试色图集.png' }] }, { type: 'Folder', name: '话术大纲', children: [{ type: 'RAG', name: '防敏感词过滤包.rag' }, { type: 'File', name: '竞品拆解.md' }] }], chatHistory: [{ id: '4', title: '短视频带货脚本生成', time: '1 小时前' }] }
};

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<keyof typeof MOCK_PROJECTS>('project-a');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  
  useEffect(() => {
    if (!messagesMap['project-a']) {
      setMessagesMap({
        'project-a': [
          { id: 'start-1', role: 'agent', content: '您好，Agent 已就绪。您可以尝试输入指令开始运营任务。' },
          { id: 'start-2', role: 'agent', content: '监测到您正在处理 2024 夏季新品增长任务。{recommend_skill_paid:爆文逻辑蒸馏器:50信用点/次:原创度提升 +42.5%}' },
          { id: 'start-3', role: 'agent', content: '由于当前笔记被系统识别出高度“AI味”，建议安装相关改写工具。{recommend_skill_free:去 AI 味改写:6:原创度提升 30-45%}' }
        ]
      });
    }
  }, []);

  const activeProject = MOCK_PROJECTS[activeProjectId];
  const messages = messagesMap[activeProjectId] || [];
  const setMessages = (setter: React.SetStateAction<Message[]>) => {
    setMessagesMap(prev => ({
      ...prev,
      [activeProjectId]: typeof setter === 'function' ? (setter as any)(prev[activeProjectId] || []) : setter
    }));
  };

  const [inputValue, setInputValue] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState<'skill' | 'agent' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeNav, setActiveNav] = useState('workbench'); // Default to Control Center
  const [workflowTab, setWorkflowTab] = useState<'strategy' | 'content' | 'interaction' | 'metrics'>('strategy');
  const [activeMission, setActiveMission] = useState<{ type: string; payload: any } | null>(null);
  
  useEffect(() => {
    const handleToFactory = (e: any) => {
      setWorkflowTab('content');
      setActiveMission({ type: 'CONTENT_GEN', payload: e.detail });
    };
    const handleToStrategy = () => {
      setWorkflowTab('strategy');
    };
    const handleToTab = (e: any) => {
      setWorkflowTab(e.detail.tab);
    };
    window.addEventListener('nav-to-factory', handleToFactory);
    window.addEventListener('nav-to-strategy', handleToStrategy);
    window.addEventListener('nav-to-tab', handleToTab);
    return () => {
      window.removeEventListener('nav-to-factory', handleToFactory);
      window.removeEventListener('nav-to-strategy', handleToStrategy);
      window.removeEventListener('nav-to-tab', handleToTab);
    };
  }, []);

  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [agentLogs, setAgentLogs] = useState([
    { id: '1', time: '10:22:15', agent: '巡航专家', msg: '正在分析「初夏穿搭」蓝海词...', status: 'running' },
    { id: '2', time: '10:23:02', agent: '内容智造', msg: '笔记初稿已生成，等待人工合入 (Merge)', status: 'success' },
    { id: '3', time: '10:25:44', agent: '增长引擎', msg: '监测到 3 条高意图评论，已推送至 CRM 待核销', status: 'info' },
  ]);

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

  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);
  const [aiSidebarTab, setAiSidebarTab] = useState<'chat' | 'files'>('chat');
  const [dataSubNav, setDataSubNav] = useState<'overview' | 'roi_attribution' | 'auto_views' | 'scheduled' | 'blueocean'>('overview');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  
  const [isAutoPilotActive, setIsAutoPilotActive] = useState(false);
  const [autoPilotStatus, setAutoPilotStatus] = useState<string>('');
  const [autoPilotProgress, setAutoPilotProgress] = useState(0);

  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [skillMarketTab, setSkillMarketTab] = useState<'market' | 'my'>('my');
  const [creatingSkill, setCreatingSkill] = useState(false);
  const [filesTab, setFilesTab] = useState<'project' | 'knowledge'>('project');
  
  const [isUsagePopupOpen, setIsUsagePopupOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'workbench' | 'chat'>('workbench');
  
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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

      // 情况 1 — 命中付费 Skill
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
                    <h4 className="text-[16px] font-black text-neutral-900 tracking-tight">🔔 Agent 决策建议</h4>
                    <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5 opacity-70">Critical Optimization Required</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-primary-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-sm">Paid Skill</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-[14px] text-neutral-600 font-bold leading-relaxed px-1">
                  当前笔记原创度偏低，建议安装 <span className="text-primary-500 font-black underline decoration-2 underline-offset-4">「{name}」</span>。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-4 bg-neutral-50 rounded-2xl border border-neutral-100/50 shadow-inner">
                     <span className="text-neutral-400 text-[10px] font-black uppercase tracking-tighter">💰 付费详情</span>
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

      // 情况 2 — 只有免费 Skill
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
                    <h4 className="text-[16px] font-black text-neutral-900 tracking-tight">🔔 Agent 执行建议</h4>
                    <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest mt-0.5 opacity-70">Community Resource Discovery</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-success-50 text-success-500 text-[10px] font-black rounded-xl border border-success-100 uppercase tracking-widest shadow-sm">🆓 Free</div>
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
                  placeholder="输入指令召唤 Agent (例如: '给奈雪生成今日笔记', '分析 ROI')" 
                  className="flex-1 bg-transparent border-none outline-none text-[18px] font-bold placeholder:text-neutral-300"
                />
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                  <span className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-black underline decoration-2">⌘</span>
                  <span className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-black underline decoration-2">K</span>
                </div>
              </div>
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <div className="px-3 py-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">快捷意图</div>
                 <div className="space-y-1">
                    {[
                      { icon: Sparkles, label: "内容智造: 批量洗稿", sub: "基于已有爆文逻辑进行原创度改写" },
                      { icon: Compass, label: "全域巡航: 解析对标商户", sub: "分析对标商户的近7日投放策略" },
                      { icon: Target, label: "获客转化: 导出未同步线索", sub: "将最近24小时捕获的意图导出至 CRM" },
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
      <div className="w-[80px] xl:w-[260px] border-r border-neutral-200 bg-neutral-0 flex flex-col shrink-0 h-full relative z-20">
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-6 font-black text-lg tracking-tight text-neutral-900 gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm transition-shadow">
            <Hexagon size={18} className="fill-current" />
          </div>
          <span className="hidden xl:block tracking-tighter uppercase">TAPTIK</span>
        </div>
        
        <div className="px-2 xl:px-4 py-2 cursor-pointer relative">
          <button 
            onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)} 
            className={`w-full flex items-center justify-center xl:justify-between hover:bg-neutral-50 rounded-xl p-2 xl:px-3 xl:py-2 text-sm font-bold text-neutral-700 transition-colors border border-transparent ${isProjectSelectorOpen ? 'bg-neutral-50 border-neutral-200 shadow-sm' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 xl:w-6 xl:h-6 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm" style={{ backgroundColor: activeProject.color, color: activeProject.textColor }}>
                {activeProject.initial}
              </div>
              <span className="hidden xl:block truncate max-w-[120px]">{activeProject.name}</span>
            </div>
            <ChevronDown size={14} className="text-neutral-400 hidden xl:block" />
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
                           <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm" style={{ backgroundColor: proj.color, color: proj.textColor }}>
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

        <nav className="flex-1 px-3 xl:px-4 py-8 space-y-10 overflow-y-auto custom-scrollbar">
          {/* Main IDE-style Sections: High Frequency Ops */}
          <div className="space-y-3">
            {[ 
              { id: 'workbench', name: '智控中心', sub: '全局决策与 Agent 协同', icon: Cpu, color: 'text-orange-500' }, 
              { id: 'workflow', name: '作业流水线', sub: '高效执行与任务落地', icon: Workflow, color: 'text-primary-500' },
            ].map((item) => (
              <button 
                 key={item.id} 
                 onClick={() => setActiveNav(item.id)} 
                 className={`w-full flex items-center justify-center xl:justify-start gap-4 p-3 xl:p-4 rounded-[20px] text-[13px] font-bold transition-all relative group shadow-sm border ${ activeNav === item.id ? 'text-white bg-neutral-900 border-neutral-800 shadow-xl scale-[1.02]' : 'text-neutral-400 bg-white border-transparent hover:bg-neutral-50 hover:text-neutral-900'}`}
              >
                  <item.icon size={22} className={`${activeNav === item.id ? 'text-white' : item.color} group-hover:scale-110 transition-transform`}/>
                  <div className="hidden xl:flex flex-col items-start leading-tight">
                    <span className="truncate tracking-tight flex items-center gap-2">
                       {item.name}
                      {activeNav === item.id && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/20 text-white rounded text-[8px] font-black uppercase tracking-tighter">Active</div>
                      )}
                    </span>
                    <span className={`text-[10px] font-medium ${activeNav === item.id ? 'opacity-40' : 'opacity-50'}`}>{item.sub}</span>
                  </div>
                  {activeNav === item.id && <motion.div layoutId="navBorder" className="absolute left-0 w-[4px] h-8 bg-primary-500 rounded-r-full" />}
              </button>
            ))}
          </div>

          {/* Asset & Infrastructure Section: Configuration & Management */}
          <div className="border-t border-neutral-100 pt-8 space-y-3">
             <div className="px-2 text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-2 hidden xl:block">Infrastructure & Assets</div>
             {[
               { id: 'assets', name: '商户配置中心', sub: '主体、企微与客服', icon: LayoutGrid },
               { id: 'files', name: '知识库中心', sub: '素材库与 RAG 训练', icon: BookOpen },
               { id: 'skills', name: '技能插件市场', sub: '运营工具与扩展', icon: ShoppingCart },
             ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-center xl:justify-start gap-4 p-3 rounded-xl transition-all ${activeNav === item.id ? 'bg-primary-50 text-neutral-900 border border-primary-100 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 border border-transparent'}`}
                >
                   <item.icon size={18} className={activeNav === item.id ? 'text-primary-500' : 'text-neutral-400'} />
                   <div className="hidden xl:flex flex-col items-start leading-tight">
                      <span className="text-[13px] font-bold">{item.name}</span>
                      <span className="text-[10px] opacity-50 font-medium">{item.sub}</span>
                   </div>
                </button>
             ))}
          </div>
        </nav>

        <div className="p-3 xl:p-4 border-t border-neutral-100 flex flex-col gap-1 mt-auto bg-neutral-0 relative">
           <div className="px-1 xl:px-2 py-3 mb-1 flex items-center justify-around xl:justify-start gap-1">
              <button 
                onClick={() => { setIsUsagePopupOpen(!isUsagePopupOpen); setIsSettingsPopupOpen(false); }}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isUsagePopupOpen ? 'text-primary-500 bg-primary-50 shadow-sm border border-primary-100' : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 border border-transparent'}`}
                title="用量概览"
              >
                 <Gauge size={20}/>
              </button>
              <button 
                onClick={() => { setIsSettingsPopupOpen(!isSettingsPopupOpen); setIsUsagePopupOpen(false); }}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isSettingsPopupOpen ? 'text-primary-500 bg-primary-50 shadow-sm border border-primary-100' : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 border border-transparent'}`}
                title="系统设置"
              >
                 <Settings size={20}/>
              </button>
           </div>
           
           <div className="flex items-center gap-3 p-1 xl:px-3 py-2 border-t border-neutral-100 mt-1">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-500 text-[11px] shadow-inner shrink-0 cursor-pointer hover:opacity-80 transition-opacity">H</div>
              <div className="hidden xl:flex flex-1 min-w-0 flex-col">
                 <p className="text-[13px] font-black text-neutral-900 truncate tracking-tight">hua xu</p>
                 <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tighter">Teams</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex-1 min-w-0 h-full bg-white relative flex flex-col">
        {activeNav === 'workbench' && (
           <div className="flex-1 flex flex-col h-full overflow-hidden">
              <Workbench setActiveNav={setActiveNav} setDataSubNav={setDataSubNav} />
           </div>
        )}

        {activeNav === 'workflow' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
             {/* Sub-tabs for Workflow Workstation */}
             <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-10">
                   {[
                      { id: 'strategy', name: '全域巡航', icon: Compass },
                      { id: 'content', name: '智造工场', icon: Sparkles },
                      { id: 'interaction', name: '触达转化', icon: MessageSquare },
                      { id: 'metrics', name: '归因复盘', icon: BarChart2 },
                   ].map(tab => (
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
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-success-50 text-success-600 rounded-full border border-success-100 text-[10px] font-black">
                      <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                      BRAIN AGENT: ACTIVE
                   </div>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-[11px] font-black hover:bg-primary-500 transition-all shadow-sm">
                      <Plus size={14}/>
                      CREATE
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafafa]">
               {workflowTab === 'strategy' && (
                  <Strategy />
               )}
               
               {workflowTab === 'content' && (
                  <div className="flex flex-col h-full bg-white divide-y divide-neutral-100">
                     <div className="flex-1 overflow-y-auto">
                        <ContentProduction />
                     </div>
                     <div className="flex-1 overflow-y-auto">
                        <Publishing />
                     </div>
                  </div>
               )}

               {workflowTab === 'interaction' && (
                  <div className="flex flex-col h-full bg-white divide-y divide-neutral-100">
                     <div className="flex-1 overflow-y-auto">
                        <Interaction />
                     </div>
                     <div className="flex-1 overflow-y-auto">
                        <CRM />
                     </div>
                  </div>
               )}

               {workflowTab === 'metrics' && (
                  <Metrics />
               )}
             </div>
          </div>
        )}

        {activeNav === 'assets' && (
           <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              <div className="h-14 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white shadow-sm z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                       <LayoutGrid size={18} />
                    </div>
                    <div>
                       <h2 className="text-[16px] font-black text-neutral-900 tracking-tight">资产与基础设施</h2>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mt-0.5">Asset & Infrastructure Hub</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black hover:opacity-80 transition-opacity shadow-lg shadow-neutral-200">新增主体授权</button>
                 </div>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                 <div className="w-1/4 max-w-[320px] border-r border-neutral-100 bg-[#fafafa] flex flex-col">
                    <div className="p-6 space-y-6">
                       <div>
                          <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 px-1">核心商户</div>
                          <div className="space-y-1">
                             <button className="w-full text-left px-4 py-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-[13px] font-bold text-neutral-900 flex items-center justify-between group">
                                <span>商户矩阵管理</span>
                                <ChevronRight size={14} className="text-neutral-300 group-hover:text-primary-500 transition-colors" />
                             </button>
                          </div>
                       </div>
                       
                       <div className="pt-4 border-t border-neutral-200/60">
                          <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 px-1 flex items-center justify-between">
                             <span>外部集成</span>
                             <span className="text-[9px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full font-black">COMING</span>
                          </div>
                          <div className="space-y-2 opacity-60">
                             {[
                                { name: '企业微信 (SCRM)', icon: AtSign },
                                { name: '智能客服 (CS)', icon: Bot },
                                { name: '自动化分发 (KOC)', icon: Share2 },
                             ].map((ext, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-100/50 text-[13px] font-bold text-neutral-400 grayscale">
                                   <ext.icon size={16} />
                                   {ext.name}
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto bg-white p-8">
                    <MerchantMatrix />
                 </div>
              </div>
           </div>
        )}

        {activeNav === 'files' && <FileManager filesTab={filesTab} setFilesTab={setFilesTab} activeProject={activeProject} activeDoc={activeDoc} setActiveDoc={setActiveDoc} />}
        {activeNav === 'skills' && <SkillMarket creatingSkill={creatingSkill} setCreatingSkill={setCreatingSkill} skillMarketTab={skillMarketTab} setSkillMarketTab={setSkillMarketTab} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} />}

        {/* Bottom Status Bar - IDE Inspired */}
        <div className="absolute bottom-0 left-0 right-0 z-50 select-none">
           <AnimatePresence>
              {isConsoleOpen && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 240 }}
                  exit={{ height: 0 }}
                  className="bg-neutral-900 border-t border-white/10 flex flex-col overflow-hidden"
                >
                   <div className="h-9 flex items-center justify-between px-4 bg-white/5 shrink-0">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Agent Activity Console</span>
                         <div className="flex items-center gap-3">
                            <button className="text-[10px] font-bold text-primary-400 underline underline-offset-2">Output</button>
                            <button className="text-[10px] font-bold text-white/40 hover:text-white/60">Terminal</button>
                            <button className="text-[10px] font-bold text-white/40 hover:text-white/60">Debug</button>
                         </div>
                      </div>
                      <button onClick={() => setIsConsoleOpen(false)} className="text-white/40 hover:text-white">
                         <ChevronDown size={14} />
                      </button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 font-mono space-y-2 custom-scrollbar">
                      {agentLogs.map(log => (
                        <div key={log.id} className="flex gap-4 text-[12px] leading-relaxed group">
                           <span className="text-neutral-600 shrink-0 select-none">[{log.time}]</span>
                           <span className={`shrink-0 font-black px-1 rounded ${log.status === 'success' ? 'text-success-400' : log.status === 'running' ? 'text-primary-400' : 'text-neutral-400'}`}>
                              {log.agent}
                           </span>
                           <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors">{log.msg}</span>
                        </div>
                      ))}
                      <div className="flex gap-4 animate-pulse">
                         <span className="text-neutral-600">[{new Date().toLocaleTimeString('en-GB')}]</span>
                         <span className="text-primary-400 font-black">AI_CORE</span>
                         <span className="text-white/20">Listening for human input (Command-K)...</span>
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="h-8 bg-neutral-900 text-neutral-300 flex items-center justify-between px-4">
              <div className="flex items-center gap-5">
                 <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
                    <div className={`w-2 h-2 rounded-full ${agentLogs.some(l => l.status === 'running') ? 'bg-success-500 animate-pulse' : 'bg-neutral-600'}`} />
                    <span className="text-[10px] font-black tracking-tighter uppercase">Agents Online: 12</span>
                 </div>
                 <div className="hidden md:flex items-center gap-4 text-[10px] font-bold opacity-60">
                    <span className={`hover:opacity-100 transition-opacity cursor-pointer ${isConsoleOpen ? 'text-primary-400 opacity-100' : ''}`} onClick={() => setIsConsoleOpen(!isConsoleOpen)}>Console</span>
                    <span className="hover:opacity-100 transition-opacity cursor-pointer">Memory: 4.2GB</span>
                    <span className="hover:opacity-100 transition-opacity cursor-pointer">Ping: 12ms</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsConsoleOpen(true)}>
                    <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full group-hover:bg-primary-400" />
                    <span className="text-[10px] font-black tracking-tighter opacity-80 group-hover:opacity-100 transition-all uppercase">
                       Last Action: {agentLogs[agentLogs.length-1]?.agent}
                    </span>
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] font-black opacity-80 px-2 py-0.5 bg-white/10 rounded cursor-help">
                    <Cpu size={12} />
                    <span>94% EFFICIENCY</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
