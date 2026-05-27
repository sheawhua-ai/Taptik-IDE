import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate, Trash2,
  Bot, TerminalSquare, RotateCw, RefreshCw, Hexagon, LogOut, Menu, ShoppingCart, Edit, User, Info, Cpu, Clock, CreditCard, Coins, GitBranch, BookOpen, DownloadCloud, Import, Lock, UploadCloud, ArrowUpRight, Component, Brain, Link2, FileBox, FileQuestion, Flame, CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check, Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2, AlertCircle, FileIcon, Filter, Layers, Orbit, Dna, ShieldHalf, Route, X, Gauge, Mic, AlignLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { SkillMarket } from './components/SkillMarket';
import { DataCenter } from './components/DataCenter';
import { Pipeline } from './components/Pipeline';
import { FileManager } from './components/FileManager';
import { Billing } from './components/Billing';

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

  const [activeNav, setActiveNav] = useState('ai');
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);
  const [aiSidebarTab, setAiSidebarTab] = useState<'chat' | 'files'>('chat');
  const [dataSubNav, setDataSubNav] = useState<'roi' | 'blueocean' | 'auto_views' | 'scheduled'>('roi');
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
                      target.outerHTML = '<div class="flex items-center gap-2 text-success-600 font-black text-[13px] bg-success-50 px-6 py-3 rounded-2xl border border-success-200 shadow-sm"><Check size={18}/> 能力已挂载并应用</div>';
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
    <div className="flex h-[100dvh] w-full bg-neutral-0 text-neutral-900 font-sans overflow-hidden">
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

        <nav className="flex-1 px-2 xl:px-4 py-4 space-y-7 overflow-y-auto custom-scrollbar">
          {/* 核心工作流 */}
          <div>
            <div className="px-1 xl:px-2 text-[10px] font-black text-neutral-400 mb-3 hidden xl:block uppercase tracking-[0.2em]">Workspace</div>
            <div className="space-y-1.5">
              {[ 
                { id: 'ai', name: 'AI 工作台', icon: Zap }, 
                { id: 'pipeline', name: '全链路流水线', icon: Workflow },
                { id: 'data', name: '业务数据看板', icon: BarChart2 },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveNav(item.id)} 
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-4 xl:py-3 rounded-2xl text-[14px] font-bold transition-all relative group ${ activeNav === item.id ? 'text-primary-500 bg-primary-50' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                >
                  <item.icon size={19} className={`${activeNav === item.id ? 'text-primary-500' : 'text-neutral-400 group-hover:text-neutral-900'}`}/>
                  <span className="hidden xl:block truncate tracking-tight">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 扩展能力 */}
          <div>
            <div className="px-1 xl:px-2 text-[10px] font-black text-neutral-400 mb-3 hidden xl:block uppercase tracking-[0.2em]">Internal Skill</div>
            <div className="space-y-1.5">
              {[ 
                { id: 'skills', name: 'Skill 商店', icon: LayoutGrid }, 
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveNav(item.id)} 
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-4 xl:py-3 rounded-2xl text-[14px] font-bold transition-all relative group ${ activeNav === item.id ? 'text-primary-500 bg-primary-50' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                >
                  <item.icon size={19} className={`${activeNav === item.id ? 'text-primary-500' : 'text-neutral-400 group-hover:text-neutral-900'}`}/>
                  <span className="hidden xl:block truncate tracking-tight">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

                 {/* 集约化用量卡片 - 现在被移动到 Popup 中 */}
        </nav>

        <div className="p-3 xl:p-4 border-t border-neutral-100 flex flex-col gap-1 mt-auto bg-neutral-0 relative">
          {/* Usage Overview Popup */}
           <AnimatePresence>
             {isUsagePopupOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute bottom-full right-[52px] mb-2 w-80 bg-neutral-0 border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden z-50 p-5 origin-bottom-right"
               >
                  <div className="flex items-center justify-between mb-5">
                     <h4 className="text-[14px] font-black text-neutral-800">用量概览</h4>
                     <div className="flex items-center gap-3">
                        <button className="text-[12px] font-bold text-success-700 hover:underline">查看详情</button>
                        <RefreshCw size={14} className="text-neutral-400 cursor-pointer hover:text-neutral-900 transition-colors" />
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
                              <span className="text-[13px] font-black text-neutral-900">套餐内 Credits</span>
                              <span className="px-1.5 py-0.5 bg-success-100 text-success-700 text-[9px] font-black rounded uppercase tracking-wider">Teams</span>
                           </div>
                           <span className="text-[11px] font-bold text-neutral-400">将于 2026年6月22日 续订</span>
                        </div>
                        
                        <div className="flex gap-0.5 h-3.5 mb-2.5">
                           {Array.from({ length: 24 }).map((_, i) => (
                             <div key={i} className={`flex-1 rounded-sm ${i < 12 ? 'bg-neutral-600' : 'bg-neutral-100'}`}></div>
                           ))}
                        </div>

                        <div className="flex justify-between items-baseline mb-1">
                           <div className="flex items-baseline gap-1">
                              <span className="text-[13px] font-black text-neutral-900">978</span>
                              <span className="text-[11px] font-bold text-neutral-400">/ 3000 (已使用 33%)</span>
                           </div>
                           <div className="flex items-baseline gap-1">
                              <span className="text-[11px] font-bold text-neutral-400">剩余</span>
                              <span className="text-[13px] font-black text-neutral-900">2022</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-neutral-100">
                        <div className="flex items-center justify-between">
                           <span className="text-[13px] font-black text-neutral-900">共享资源包</span>
                           <div className="flex items-center gap-1.5 text-neutral-400">
                              <span className="text-[12px] font-bold">暂无可用额度</span>
                              <Info size={14} />
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Settings Menu Popup */}
           <AnimatePresence>
             {isSettingsPopupOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute bottom-full right-4 mb-2 w-56 bg-neutral-0 border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden z-50 p-1 origin-bottom-right"
               >
                  <div className="space-y-0.5">
                    {[
                      { icon: Settings, label: '设置' },
                      { icon: Compass, label: '界面语言', hasSub: true },
                      { icon: Clock, label: '主题', hasSub: true },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <item.icon size={16} className="text-neutral-500" />
                          <span className="text-[13px] font-bold">{item.label}</span>
                        </div>
                        {item.hasSub && <ChevronRight size={14} className="text-neutral-400" />}
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-neutral-100 my-1 mx-2"></div>
                  <div className="space-y-0.5">
                    {[
                      { icon: Star, label: '升级计划' },
                      { icon: BookOpen, label: '帮助文档' },
                      { icon: History, label: '更新日志' },
                      { icon: RefreshCw, label: '检查更新...' },
                      { icon: MessageSquare, label: '问题反馈' },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-700 transition-colors">
                        <item.icon size={16} className="text-neutral-500" />
                        <span className="text-[13px] font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-neutral-100 my-1 mx-2"></div>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-danger-50 rounded-lg text-danger-500 transition-colors">
                    <LogOut size={16} />
                    <span className="text-[13px] font-bold">退出登录</span>
                  </button>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="mb-2 space-y-0.5">
              <button 
                onClick={() => setActiveNav('files')}
                className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2.5 xl:px-4 xl:py-2 rounded-xl text-[14px] font-bold transition-all ${activeNav === 'files' ? 'text-primary-500 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                 <BookOpen size={18} className={activeNav === 'files' ? 'text-primary-500' : 'text-neutral-400'} />
                 <span className="hidden xl:block tracking-tight text-neutral-700">知识中心</span>
              </button>
              <button 
                onClick={() => setActiveNav('skills')}
                className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2.5 xl:px-4 xl:py-2 rounded-xl text-[14px] font-bold transition-all ${activeNav === 'skills' ? 'text-primary-500 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                 <ShoppingCart size={18} className={activeNav === 'skills' ? 'text-primary-500' : 'text-neutral-400'} />
                 <span className="hidden xl:block tracking-tight text-neutral-700">插件市场</span>
              </button>
           </div>
           
           <div className="flex items-center gap-3 p-1 xl:px-3 py-2 border-t border-neutral-100 mt-1">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-500 text-[11px] shadow-inner shrink-0 cursor-pointer hover:opacity-80 transition-opacity">H</div>
              <div className="hidden xl:flex flex-1 min-w-0 flex-col">
                 <p className="text-[13px] font-black text-neutral-900 truncate tracking-tight">hua xu</p>
                 <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tighter">Teams</p>
              </div>
              <div className="hidden xl:flex items-center gap-1.5 text-neutral-400">
                 <button 
                   onClick={() => { setIsUsagePopupOpen(!isUsagePopupOpen); setIsSettingsPopupOpen(false); }}
                   className={`p-2 rounded-lg transition-all ${isUsagePopupOpen ? 'text-neutral-900 bg-neutral-100' : 'hover:text-neutral-900 hover:bg-neutral-50'}`}
                 >
                    <Gauge size={18}/>
                 </button>
                 <button 
                   onClick={() => { setIsSettingsPopupOpen(!isSettingsPopupOpen); setIsUsagePopupOpen(false); }}
                   className={`p-2 rounded-lg transition-all ${isSettingsPopupOpen ? 'text-neutral-900 bg-neutral-100' : 'hover:text-neutral-900 hover:bg-neutral-50'}`}
                 >
                    <Settings size={18}/>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex-1 min-w-0 h-full bg-white relative">
        {activeNav === 'ai' && (
          <div className="flex-1 min-w-0 h-full flex relative z-10 bg-white">
            {subSidebarOpen && (
              <div className="w-[200px] xl:w-[240px] border-r border-neutral-200 bg-neutral-0 flex flex-col h-full shrink-0 relative transition-all">
                <div className="p-3 border-b border-neutral-100 flex items-center justify-between shrink-0"><div className="flex gap-4 px-2 w-full"><button onClick={() => setAiSidebarTab('chat')} className={`text-[12px] font-bold pb-2 border-b-2 flex-1 relative top-[13px] ${aiSidebarTab === 'chat' ? 'border-primary-500 text-primary-500' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>会话历史</button><button onClick={() => setAiSidebarTab('files')} className={`text-[12px] font-bold pb-2 border-b-2 flex-1 relative top-[13px] ${aiSidebarTab === 'files' ? 'border-primary-500 text-primary-500' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>项目资产</button></div></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 pb-10 flex flex-col gap-0.5">
                  {aiSidebarTab === 'chat' ? activeProject.chatHistory.map(h => (<button key={h.id} className="w-full text-left flex flex-col gap-1 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors group"><div className="flex gap-2 items-center"><MessageSquare size={14} className="text-neutral-400 group-hover:text-primary-500" /><span className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-800 truncate">{h.title}</span></div><span className="text-[10px] text-neutral-400 pl-6">{h.time}</span></button>)) : activeProject.fileTree.map((node, i) => (<div key={i} className="flex flex-col gap-0.5"><div className="flex items-center gap-2 px-2 py-1.5 text-[12px] font-bold text-neutral-700 shrink-0"><FolderOpen size={12} className="text-primary-500/60" /> {node.name}</div><div className="pl-5 flex flex-col gap-0.5 relative"><div className="absolute left-[13px] top-0 bottom-2 w-px bg-neutral-200 rounded"></div>{node.children.map((child: any, j: number) => (<div key={j} className="flex items-center gap-2 px-2 py-1.5 hover:bg-primary-50 rounded-md cursor-grab text-[12px] font-medium text-neutral-600 transition-colors relative"><div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-2 h-px bg-neutral-200"></div>{child.type === 'Folder' ? <FolderOpen size={13} className="text-primary-500/70"/> : child.type === 'RAG' ? <Brain size={13} className="text-primary-500/70"/> : <FileIcon size={13} className="text-primary-500/70"/>}<span className="truncate">{child.name}</span></div>))}</div></div>))}
                </div>
              </div>
            )}
            <div className="flex-1 flex flex-col h-full bg-neutral-0 relative">
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 bg-neutral-0 shrink-0"><div className="flex items-center gap-4"><button onClick={() => setSubSidebarOpen(!subSidebarOpen)} className="text-primary-500 hover:bg-primary-50 p-1.5 rounded-lg transition-colors"><LayoutTemplate size={20} /></button><div className="flex flex-col"><h2 className="text-[15px] font-black text-neutral-900">{activeProject.name} AI 协作室</h2><p className="text-[10px] text-neutral-400 font-black tracking-wide uppercase opacity-80 mt-0.5">全生命周期商机资产对齐</p></div></div><div className="flex items-center gap-3">
                {messages.length > 0 && <button onClick={() => setActiveNav('pipeline')} className="bg-success-50 text-success-600 border border-success-200 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm flex items-center gap-2 hover:bg-success-100 transition-all"><Sparkles size={16}/> 前往管道审阅 (50)</button>}
                <button onClick={() => setMessages([])} className="p-2 border border-neutral-200 rounded-xl text-neutral-400 hover:text-danger-500 hover:bg-danger-50 bg-neutral-0 shadow-sm"><Trash2 size={18} /></button></div></div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-0 relative bg-white">
                 {messages.length === 0 ? (
                   <div className="max-w-5xl mx-auto px-8 py-12 space-y-12">
                     {/* 头部标题区 */}
                     <div className="flex items-center justify-between border-b border-zinc-100 pb-8">
                        <div>
                           <h2 className="text-3xl font-black text-zinc-900 tracking-tight">你的 50 篇笔记 Excel</h2>
                           <p className="text-[14px] text-zinc-400 font-bold mt-2 leading-relaxed max-w-2xl">
                              项目目录中未检测到 .xlsx, .xls, .csv 文件。如果已准备好，请将其放入 <span className="text-zinc-900 px-1.5 py-0.5 bg-zinc-100 rounded font-mono">exports/</span> 目录下，我能一键读取、生成并写入。
                           </p>
                        </div>
                        <div className="flex gap-3">
                           <button className="px-6 py-3 bg-zinc-100 text-zinc-500 rounded-2xl text-[13px] font-black hover:bg-zinc-200 transition-all flex items-center gap-2">
                              <Plus size={16}/> 新建对话
                           </button>
                        </div>
                     </div>

                     {/* 业务链路状态区 */}
                     <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                           <h3 className="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                              <Workflow size={20} className="text-primary-500" />
                              当前能跑通什么、跑不通什么
                           </h3>
                           <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">Pipeline Health Check</span>
                        </div>

                        <div className="overflow-hidden border border-zinc-100 rounded-[24px] bg-[#FBFBFB]">
                           <div className="grid grid-cols-[1fr_80px_1fr] border-b border-zinc-100 bg-zinc-50/50">
                              <div className="px-6 py-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest">环节</div>
                              <div className="px-6 py-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">状态</div>
                              <div className="px-6 py-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest">卡在哪</div>
                           </div>
                           <div className="divide-y divide-zinc-100">
                              {[
                                { step: '蓝海词挖掘', icon: Filter, status: 'warn', detail: 'browse_web 抓不到小红书（需 JS 渲染）。改用 browser_open_session 可以', color: 'text-blue-500' },
                                { step: 'AI 生成笔记', icon: Layers, status: 'coming', detail: 'DeepSeek 直连本周修好就能用', color: 'text-[#685FAB]' },
                                { step: '创建方案', icon: Route, status: 'error', detail: 'merchant_create_plan → 500', color: 'text-amber-500' },
                                { step: '写入笔记', icon: Dna, status: 'error', detail: 'merchant_add_plan_note → 500', color: 'text-emerald-500' },
                                { step: '查看数据回收', icon: Target, status: 'success', detail: 'get_taptask_note 可用（不依赖商家登录态）', color: 'text-rose-500' },
                                { step: '50 篇 Excel 批量导入', icon: FileIcon, status: 'error', detail: '文件不存在 + 写入 API 不可用', color: 'text-zinc-500' },
                              ].map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[1fr_80px_1fr] items-center hover:bg-white transition-colors group">
                                   <div className="px-6 py-4 flex items-center gap-4">
                                      <div className={`w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                         <item.icon size={16} />
                                      </div>
                                      <span className="text-[14px] font-bold text-zinc-700">{item.step}</span>
                                   </div>
                                   <div className="px-6 py-4 flex justify-center">
                                      {item.status === 'warn' && <AlertCircle size={18} className="text-amber-500" />}
                                      {item.status === 'coming' && <RotateCw size={18} className="text-blue-400 animate-spin" />}
                                      {item.status === 'error' && <X size={18} className="text-rose-500" />}
                                      {item.status === 'success' && <Check size={18} className="text-emerald-500" />}
                                   </div>
                                   <div className="px-6 py-4">
                                      <span className="text-[12px] font-mono font-medium text-zinc-500">{item.detail}</span>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* 待办列表 */}
                     <div className="space-y-6">
                        <div className="px-1 flex items-center justify-between">
                           <h3 className="text-lg font-black text-zinc-900 tracking-tight">要跑通全流程，缺什么</h3>
                        </div>
                        <div className="bg-[#FBFBFB] border border-zinc-100 rounded-[24px] overflow-hidden">
                           <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-zinc-100 bg-zinc-50/50">
                              <div className="px-6 py-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-left">需要完成的事</div>
                              <div className="px-6 py-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-left">谁做</div>
                              <div className="px-6 py-3 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-left">预估时间</div>
                           </div>
                           <div className="divide-y divide-zinc-100">
                              {[
                                { task: '部署 .plan.md 的 5 个代码变更 (写完就能部署，全是已有文件的修改)', owner: '开发同学', eta: '2-3 天' },
                                { task: '你以商家身份登录 TapTik (部署完就能登)', owner: '你', eta: '1 分钟' },
                                { task: '修 DeepSeek 直连 (加 Authorization 头)', owner: '开发同学', eta: '0.5 天' },
                              ].map((row, i) => (
                                <div key={i} className="grid grid-cols-[2fr_1fr_1fr] items-center hover:bg-white transition-colors">
                                   <div className="px-6 py-5 text-[13px] font-bold text-zinc-700">
                                      {i + 1}. {row.task}
                                   </div>
                                   <div className="px-6 py-5 text-[13px] font-black text-zinc-900">{row.owner}</div>
                                   <div className="px-6 py-5 text-[13px] font-mono text-zinc-500">{row.eta}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="px-1">
                           <p className="text-[14px] font-bold text-zinc-900">三个做完，全流程跑通。<span className="text-zinc-500">从蓝海词 → 生成 → 建方案 → 写笔记 → 数据回收，全部自动化。</span></p>
                        </div>
                     </div>

                     {/* 底部寄语 */}
                     <div className="p-8 bg-zinc-900 rounded-[32px] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Bot size={140} />
                        </div>
                        <div className="relative z-10">
                           <h4 className="text-[16px] font-black mb-3">给开发同学的话</h4>
                           <p className="text-zinc-400 text-[14px] leading-relaxed font-bold">
                              .plan.md 已经写得很清楚了，照着改 5 个文件就行。没有新服务、没有新数据库、没有新依赖。纯修改现有代码。改完部署，告诉我一声，我立刻从头到尾跑一遍「青岛结婚酒店」全流程。
                           </p>
                        </div>
                     </div>
                   </div>
                 ) : (
                   <div className="max-w-4xl mx-auto space-y-6 pb-2 p-6">
                     {messages.map((msg, idx) => (
                       <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         {msg.role === 'user' ? (
                           <div className="flex flex-col items-end max-w-[90%]">
                             <div className="px-5 py-3.5 rounded-2xl bg-primary-500 text-white border border-primary-600 shadow-md rounded-br-sm text-[14px] leading-relaxed font-medium">
                               {renderMessageContent(msg.content as string, msg.role)}
                             </div>
                           </div>
                         ) : (
                           <div className="max-w-[90%]">
                             <div className="flex items-center gap-2 mb-2 px-1">
                               <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-primary-500/20">L0</div>
                               <span className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">TAPTIK 引擎</span>
                             </div>
                             <div className="px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[14px] text-zinc-800 leading-relaxed rounded-bl-sm font-medium">
                               {renderMessageContent(msg.content as string, msg.role)}
                             </div>
                           </div>
                         )}
                       </motion.div>
                     ))}
                     <div ref={chatEndRef} />
                   </div>
                 )}
              </div>
              <div className="p-4 pt-0 shrink-0 max-w-5xl mx-auto w-full relative">
                 <AnimatePresence>{showMentionMenu && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-4 mb-2 w-72 bg-neutral-0 border border-neutral-200 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col p-1"><div className="px-3 py-2 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-100 bg-neutral-50 mb-1">调用 Skill 能力</div><div onClick={() => insertMention('KOC/KOS异构引擎', '@')} className="px-3 py-2 hover:bg-primary-50/10 hover:text-primary-500 rounded-lg cursor-pointer text-[13px] font-bold text-neutral-700 flex items-center gap-2 transition-colors"><Component size={14}/>KOC/KOS 异构引擎</div></motion.div>)}</AnimatePresence>
                 
                 <div className="flex justify-start mb-2 pl-2">
                    <div className="px-3 py-1 bg-neutral-0 border border-neutral-200 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors">
                       <span className="text-[12px] font-black text-neutral-600">审查</span>
                       <div className="flex items-center gap-1.5 font-bold text-[11px]">
                          <span className="text-success-600">+773</span>
                          <span className="text-neutral-300">/</span>
                          <span className="text-danger-500">-0</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-neutral-0 rounded-[20px] border border-neutral-200 shadow-xl shadow-neutral-900/5 overflow-hidden flex flex-col relative focus-within:border-primary-500/30 transition-all mb-4">
                    <textarea 
                      rows={2} 
                      value={inputValue} 
                      onChange={handleInputChange} 
                      onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                      placeholder="描述计划，@ 引用上下文，/ 使用命令" 
                      className="flex-1 min-h-[72px] pt-4 pb-2 px-6 resize-none bg-transparent text-[14px] font-medium focus:outline-none placeholder:text-neutral-300" 
                    />
                    
                    <div className="flex items-center justify-between px-4 pb-3">
                       <div className="flex items-center gap-1">
                          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-all group">
                             <Link2 size={13} className="text-neutral-400 group-hover:text-neutral-600" />
                             <span className="text-[12px] font-bold text-neutral-500 group-hover:text-neutral-900">智能体</span>
                             <ChevronDown size={12} className="text-neutral-400" />
                          </button>
                          <div className="w-px h-3 bg-neutral-200 mx-1"></div>
                          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-all group">
                             <span className="text-[12px] font-bold text-neutral-600 group-hover:text-neutral-900">DeepSeek-V4-Pro</span>
                             <ChevronDown size={12} className="text-neutral-400" />
                          </button>
                          <div className="w-px h-3 bg-neutral-200 mx-1"></div>
                          <button className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all"><Menu size={16}/></button>
                       </div>
                       
                       <div className="flex items-center gap-0.5">
                          <button className="p-2 text-neutral-300 hover:text-neutral-900 rounded-lg transition-all"><AlignLeft size={16}/></button>
                          <button className="p-2 text-neutral-300 hover:text-neutral-900 rounded-lg transition-all"><Sparkles size={16}/></button>
                          <button className="p-2 text-neutral-300 hover:text-neutral-900 rounded-lg transition-all"><Mic size={16}/></button>
                          <button 
                            onClick={handleSend} 
                            disabled={!inputValue.trim()} 
                            className="ml-2 w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-300 text-neutral-0 flex items-center justify-center transition-all shadow-sm"
                          >
                             <ArrowUp size={18} strokeWidth={2.5}/>
                          </button>
                       </div>
                    </div>
                 </div>
                 <div className="bg-neutral-0/50 rounded-xl border border-neutral-100 p-3 flex flex-wrap gap-x-6 gap-y-4">{SHORTCUT_CATEGORIES.map(cat => (<div key={cat.id} className="flex flex-col gap-2 min-w-[200px] flex-1"><div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 select-none uppercase tracking-wider pl-1"><cat.icon size={12}/>{cat.name}</div><div className="flex flex-col gap-1.5">{cat.items.map((item, idx) => {
                        const isInstalled = item.text.includes('KOC') || item.text.includes('Tauri');
                        const isRecommended = item.text.includes('RAG');
                        return (
                          <button 
                            key={idx} 
                            onClick={() => setInputValue(prev => prev + (prev ? '\n' : '') + item.text)} 
                            className={`text-left text-[12px] font-medium px-2.5 py-1.5 rounded-lg transition-colors truncate flex items-center justify-between group ${isRecommended ? 'border border-primary-500/20 bg-primary-50/[0.02] text-primary-500' : 'text-neutral-600 hover:text-primary-500 hover:bg-primary-50/5'}`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {item.type === 'skill' ? <Component size={12} className={isInstalled ? 'text-success-500' : ''}/> : <Plus size={12}/>}
                              <span className="truncate">{item.text}</span>
                            </div>
                            {isInstalled && <span className="bg-success-500/10 text-success-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">已挂载</span>}
                            {isRecommended && <span className="text-[10px]"><Sparkles size={10} className="fill-current"/></span>}
                          </button>
                        );
                      })}</div></div>))}</div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'pipeline' && <Pipeline />}
        {activeNav === 'skills' && <SkillMarket creatingSkill={creatingSkill} setCreatingSkill={setCreatingSkill} skillMarketTab={skillMarketTab} setSkillMarketTab={setSkillMarketTab} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} />}
        {activeNav === 'files' && <FileManager filesTab={filesTab} setFilesTab={setFilesTab} activeProject={activeProject} activeDoc={activeDoc} setActiveDoc={setActiveDoc} />}
        {activeNav === 'data' && <DataCenter dataSubNav={dataSubNav} setDataSubNav={setDataSubNav} setActiveNav={setActiveNav} />}
        {activeNav === 'settings' && <div className="p-10"><h1 className="text-2xl font-black mb-4">系统设置</h1><p className="text-neutral-500">正在针对商家生命周期做深度适配...</p></div>}
      </div>
    </div>
  );
}
