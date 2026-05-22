import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate, Trash2,
  Bot, TerminalSquare, RotateCw, RefreshCw, Hexagon, LogOut, Menu, ShoppingCart, Edit, User, Info, Cpu, Clock, CreditCard, Coins, GitBranch, BookOpen, DownloadCloud, Import, Lock, UploadCloud, ArrowUpRight, Component, Brain, Link2, FileBox, FileQuestion, Flame, CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check, Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2, AlertCircle, FileIcon
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
  { id: 'content', name: '内容创作', icon: PenTool, items: [{ text: '小红书高赞网感改写', type: 'prompt' }, { text: '抖音/快手短视频脚本生成', type: 'prompt' }, { text: '商品种草/测评大纲搭建', type: 'prompt' }] },
  { id: 'workflow', name: '逻辑与流转', icon: Workflow, items: [{ text: '调用: 本地Tauri防重巡检', type: 'skill' }, { text: '分析: 蓝海词RAG洞察', type: 'skill' }] },
  { id: 'data', name: '数据分析', icon: BarChart2, items: [{ text: '分析昨日大盘回收效果', type: 'prompt' }, { text: '导出笔记爆文率报表', type: 'prompt' }] }
];

const MOCK_PROJECTS = {
  'project-a': { id: 'project-a', name: '商家A：宠物食品组', initial: '宠', color: '#EDEAF2', textColor: '#685FAB', fileTree: [{ type: 'Folder', name: '营销物料库 (云端)', children: [{ type: 'File', name: '海报底图A.jpg' }] }, { type: 'Folder', name: '本地上传资料', children: [{ type: 'File', name: '通用全局规范.pdf' }, { type: 'RAG', name: '宠物标准话术.rag' }] }], chatHistory: [{ id: '1', title: '执行 Skill: 竞品标题仿写助手', time: '30 分钟前' }, { id: '2', title: '分析狗粮销售数据', time: '1 小时前' }] },
  'project-b': { id: 'project-b', name: '商家B：美妆旗舰店', initial: '美', color: '#fee2e2', textColor: '#ef4444', fileTree: [{ type: 'Folder', name: '美妆图库', children: [{ type: 'File', name: '口红试色图集.png' }] }, { type: 'Folder', name: '话术大纲', children: [{ type: 'RAG', name: '防敏感词过滤包.rag' }, { type: 'File', name: '竞品拆解.md' }] }], chatHistory: [{ id: '4', title: '短视频带货脚本生成', time: '1 小时前' }] }
};

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState<keyof typeof MOCK_PROJECTS>('project-a');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  
  useEffect(() => {
    if (!messagesMap['project-a']) {
      setMessagesMap({
        'project-a': [
          { id: 'start-1', role: 'agent', content: '您好，Agent 已就绪。您可以尝试输入指令开始运营任务。' },
          { id: 'start-2', role: 'agent', content: '监测到您正在处理 2024 夏季新品增长任务。{recommend_skill:爆文逻辑蒸馏器}' }
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
    const parts = content.split(/(@[\u4e00-\u9fa5a-zA-Z0-9_-]+)|(「(?:🔗|📄|📁|🧠|📦) [^」]+」)|(\{recommend_skill:[^}]+\})/);
    return parts.map((part, index) => {
      if (!part) return null;
      if (part.startsWith('@')) return <span key={index} className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[12px] font-bold ${role === 'user' ? 'bg-[#685FAB] text-white border border-[#504886]' : 'bg-[#685FAB]/10 text-[#685FAB]'}`}><Component size={12}/> {part.substring(1)}</span>;
      if (part.startsWith('「')) {
         let icon = <FileBox size={12} />;
         if (part.startsWith('「🔗')) icon = <Link2 size={12} />;
         else if (part.startsWith('「📁')) icon = <FolderOpen size={12} />;
         else if (part.startsWith('「🧠')) icon = <Brain size={12} />;
         return <span key={index} className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-[4px] text-[12px] font-bold border ${role === 'user' ? 'bg-[#2a2a2e] text-zinc-200 border-zinc-700' : 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>{icon} {part.slice(3, -1)}</span>;
      }
      if (part.startsWith('{recommend_skill:')) {
        const skillName = part.split(':')[1].replace('}', '');
        return (
          <div key={index} className="mt-5 mb-2 p-6 bg-white border-2 border-[#685FAB]/10 rounded-[32px] shadow-xl shadow-[#685FAB]/5 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <Sparkles size={120} className="text-[#685FAB]" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#685FAB]/10 rounded-2xl flex items-center justify-center text-[#685FAB]">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-zinc-900 tracking-tight">Agent 决策建议：注入增强能力</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest leading-none">Intelligence Optimization Active</p>
                    </div>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-lg border border-amber-100 uppercase tracking-tighter">Recommended</div>
              </div>
              
              <div className="bg-zinc-50/80 rounded-2xl p-4 border border-zinc-100 mb-6">
                <p className="text-[13px] text-zinc-600 font-bold leading-relaxed">
                  监测到当前任务涉及大量异构内容生成。建议注入 <span className="text-[#685FAB] font-black">「{skillName}」</span> 以强化去 AI 味能力。
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] font-black text-zinc-400 whitespace-nowrap overflow-hidden">
                   <span className="text-[#685FAB]/80">预期原创度 +42.5%</span>
                   <span className="opacity-30">|</span>
                   <span>按量结算 (Pay-as-you-go)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={(e) => {
                    const target = e.currentTarget;
                    target.disabled = true;
                    target.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> 注入中...</span>';
                    setTimeout(() => {
                      target.parentElement?.parentElement?.parentElement?.classList.add('opacity-60', 'scale-[0.98]');
                      target.outerHTML = '<div class="flex items-center gap-2 text-emerald-500 font-black text-[12px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 能力挂载成功</div>';
                    }, 1000);
                  }}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-[12px] font-black shadow-lg shadow-zinc-200 hover:translate-y-[-2px] hover:shadow-xl active:scale-95 transition-all"
                >
                  立即注入能力
                </button>
                <button className="px-6 py-3 bg-white border border-zinc-200 text-zinc-400 rounded-2xl text-[12px] font-black hover:text-zinc-900 hover:bg-zinc-50 transition-all">暂时忽略</button>
              </div>
            </div>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex h-[100dvh] w-full bg-white text-zinc-900 font-sans overflow-hidden">
      {/* SaaS Nav Sidebar */}
      <div className="w-[80px] xl:w-[260px] border-r border-zinc-200 bg-[#fbfbfb] flex flex-col shrink-0 h-full relative z-20">
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-6 font-black text-lg tracking-tight text-zinc-900 gap-3">
          <div className="w-8 h-8 bg-[#685FAB] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm transition-shadow">
            <Hexagon size={18} className="fill-current" />
          </div>
          <span className="hidden xl:block tracking-tighter">TAPTIK</span>
        </div>
        
        <div className="px-2 xl:px-4 py-2 cursor-pointer relative">
          <button 
            onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)} 
            className={`w-full flex items-center justify-center xl:justify-between hover:bg-zinc-100 rounded-xl p-2 xl:px-3 xl:py-2 text-sm font-bold text-zinc-700 transition-colors border border-transparent ${isProjectSelectorOpen ? 'bg-zinc-100 border-zinc-200' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 xl:w-6 xl:h-6 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm" style={{ backgroundColor: activeProject.color, color: activeProject.textColor }}>
                {activeProject.initial}
              </div>
              <span className="hidden xl:block truncate max-w-[120px]">{activeProject.name}</span>
            </div>
            <ChevronDown size={14} className="text-zinc-400 hidden xl:block" />
          </button>
          
          <AnimatePresence>
            {isProjectSelectorOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 5 }}
                 className="absolute top-14 left-2 xl:left-4 w-[280px] bg-white border border-zinc-200 shadow-2xl rounded-2xl z-50 overflow-hidden"
               >
                  <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                     {Object.values(MOCK_PROJECTS).map(proj => (
                         <button 
                           key={proj.id} 
                           onClick={() => { setActiveProjectId(proj.id as keyof typeof MOCK_PROJECTS); setIsProjectSelectorOpen(false); }} 
                           className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors text-left group ${activeProjectId === proj.id ? 'bg-[#685FAB]/5 text-[#685FAB]' : ''}`}
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
            <div className="px-1 xl:px-2 text-[10px] font-black text-zinc-300 mb-3 hidden xl:block uppercase tracking-[0.2em] opacity-80">Workspace</div>
            <div className="space-y-1.5">
              {[ 
                { id: 'ai', name: 'AI 工作台', icon: Zap }, 
                { id: 'pipeline', name: '全链路流水线', icon: Workflow },
                { id: 'data', name: '业务数据看板', icon: BarChart2 },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveNav(item.id)} 
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-4 xl:py-3 rounded-2xl text-[14px] font-bold transition-all relative group ${ activeNav === item.id ? 'text-[#685FAB] bg-[#685FAB]/10' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                >
                  <item.icon size={19} className={`${activeNav === item.id ? 'text-[#685FAB]' : 'text-zinc-400 group-hover:text-zinc-600'}`}/>
                  <span className="hidden xl:block truncate tracking-tight">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 扩展能力 */}
          <div>
            <div className="px-1 xl:px-2 text-[10px] font-black text-zinc-300 mb-3 hidden xl:block uppercase tracking-[0.2em] opacity-80">Internal Skill</div>
            <div className="space-y-1.5">
              {[ 
                { id: 'skills', name: 'Skill 商店', icon: LayoutGrid }, 
                { id: 'billing', name: '账单与消耗', icon: Coins }, 
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveNav(item.id)} 
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-4 xl:py-3 rounded-2xl text-[14px] font-bold transition-all relative group ${ activeNav === item.id ? 'text-[#685FAB] bg-[#685FAB]/10' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                >
                  <item.icon size={19} className={`${activeNav === item.id ? 'text-[#685FAB]' : 'text-zinc-400 group-hover:text-zinc-600'}`}/>
                  <span className="hidden xl:block truncate tracking-tight">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 集约化用量卡片 */}
          <div className="hidden xl:block px-1 mt-auto">
             <div className="bg-white border border-zinc-200 rounded-[20px] p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[11px] font-black text-zinc-900">用量概览</span>
                   <button onClick={() => setActiveNav('billing')} className="text-[10px] font-black text-[#685FAB] hover:underline">查看详情</button>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between items-center mb-1.5">
                         <div className="flex items-center gap-1.5 leading-none">
                            <span className="text-[11px] font-bold text-zinc-700">账户 Credits</span>
                            <span className="px-1 py-0.5 bg-zinc-900 text-white text-[8px] font-black rounded uppercase">Teams</span>
                         </div>
                         <span className="text-[10px] font-mono text-zinc-400">476 / 3000</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                         <div className="h-full bg-[#685FAB] rounded-full" style={{ width: '16%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                         <span className="text-[9px] font-bold text-zinc-400">剩余 2524</span>
                         <span className="text-[9px] font-bold text-zinc-400">已使用 16%</span>
                      </div>
                   </div>
                   
                   <div className="pt-3 border-t border-zinc-100">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                         <span className="text-zinc-400">共享资源包</span>
                         <span className="text-zinc-300">暂无可用额度</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </nav>

        <div className="p-3 xl:p-4 border-t border-zinc-100 flex flex-col gap-1.5">
           <button onClick={() => setActiveNav('settings')} className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2.5 xl:px-4 xl:py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeNav === 'settings' ? 'text-zinc-900 bg-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>
              <Settings size={18} className="text-zinc-400 group-hover:text-zinc-600"/> 
              <span className="hidden xl:block tracking-tight">偏好设置</span>
           </button>
           <div className="flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-4 py-2 border-t border-zinc-50 mt-1">
              <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-black text-zinc-500 text-[11px] shadow-inner">H</div>
              <div className="hidden xl:block flex-1 min-w-0">
                 <p className="text-[12px] font-bold text-zinc-900 truncate">hua xu</p>
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Teams Plan</p>
              </div>
              <LogOut size={16} className="text-zinc-300 hover:text-rose-500 cursor-pointer hidden xl:block transition-colors" />
           </div>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex-1 min-w-0 h-full bg-white relative">
        {activeNav === 'ai' && (
          <div className="flex-1 min-w-0 h-full flex relative z-10 bg-white">
            {subSidebarOpen && (
              <div className="w-[200px] xl:w-[240px] border-r border-zinc-200 bg-white flex flex-col h-full shrink-0 relative transition-all">
                <div className="p-3 border-b border-zinc-100 flex items-center justify-between shrink-0"><div className="flex gap-4 px-2 w-full"><button onClick={() => setAiSidebarTab('chat')} className={`text-[12px] font-bold pb-2 border-b-2 flex-1 relative top-[13px] ${aiSidebarTab === 'chat' ? 'border-[#685FAB] text-[#685FAB]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>会话历史</button><button onClick={() => setAiSidebarTab('files')} className={`text-[12px] font-bold pb-2 border-b-2 flex-1 relative top-[13px] ${aiSidebarTab === 'files' ? 'border-[#685FAB] text-[#685FAB]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>项目资产</button></div></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 pb-10 flex flex-col gap-0.5">
                  {aiSidebarTab === 'chat' ? activeProject.chatHistory.map(h => (<button key={h.id} className="w-full text-left flex flex-col gap-1 px-3 py-2 hover:bg-zinc-50 rounded-lg transition-colors group"><div className="flex gap-2 items-center"><MessageSquare size={14} className="text-zinc-400 group-hover:text-[#685FAB]" /><span className="text-[13px] font-bold text-zinc-600 group-hover:text-zinc-800 truncate">{h.title}</span></div><span className="text-[10px] text-zinc-400 pl-6">{h.time}</span></button>)) : activeProject.fileTree.map((node, i) => (<div key={i} className="flex flex-col gap-0.5"><div className="flex items-center gap-2 px-2 py-1.5 text-[12px] font-bold text-zinc-700 shrink-0"><FolderOpen size={12} className="text-[#685FAB]/60" /> {node.name}</div><div className="pl-5 flex flex-col gap-0.5 relative"><div className="absolute left-[13px] top-0 bottom-2 w-px bg-zinc-200 rounded"></div>{node.children.map((child: any, j: number) => (<div key={j} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#685FAB]/10 rounded-md cursor-grab text-[12px] font-medium text-zinc-600 transition-colors relative"><div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-2 h-px bg-zinc-200"></div>{child.type === 'Folder' ? <FolderOpen size={13} className="text-[#685FAB]/70"/> : child.type === 'RAG' ? <Brain size={13} className="text-[#685FAB]/70"/> : <FileIcon size={13} className="text-[#685FAB]/70"/>}<span className="truncate">{child.name}</span></div>))}</div></div>))}
                </div>
              </div>
            )}
            <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] relative">
              <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 bg-white shrink-0"><div className="flex items-center gap-4"><button onClick={() => setSubSidebarOpen(!subSidebarOpen)} className="text-[#685FAB] hover:bg-[#685FAB]/10 p-1.5 rounded-lg transition-colors"><LayoutTemplate size={20} /></button><div className="flex flex-col"><h2 className="text-[15px] font-black text-zinc-900">{activeProject.name} AI 协作室</h2><p className="text-[10px] text-zinc-400 font-black tracking-wide uppercase opacity-80 mt-0.5">全生命周期商机资产对齐</p></div></div><div className="flex items-center gap-3">
                {messages.length > 0 && <button onClick={() => setActiveNav('pipeline')} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm flex items-center gap-2 hover:bg-emerald-100 transition-all"><Sparkles size={16}/> 前往管道审阅 (50)</button>}
                <button onClick={() => setMessages([])} className="p-2 border border-zinc-200 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 bg-white shadow-sm"><Trash2 size={18} /></button></div></div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                 {messages.length === 0 ? (<div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full"><div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border" style={{ backgroundColor: activeProject.color, color: activeProject.textColor }}><Hexagon size={28} className="fill-current opacity-80" /></div><h2 className="text-2xl font-black text-zinc-900 mb-2">{activeProject.name} <span className="text-zinc-400 font-normal ml-2">工作区</span></h2><p className="text-[13px] font-medium text-zinc-500 mb-2 text-center text-balance">直接对话触发智能流转，输入 @ 召唤本项目资产</p></div>) : (<div className="max-w-4xl mx-auto space-y-6 pb-2">{messages.map((msg, idx) => (<motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>{msg.role === 'user' ? (<div className="flex flex-col items-end max-w-[90%]"><div className="px-5 py-3.5 rounded-2xl bg-[#685FAB] text-[#f1f1f4] border border-[#504886] shadow-md rounded-br-sm text-[14px] leading-relaxed font-medium">{renderMessageContent(msg.content as string, msg.role)}</div></div>) : (<div className="max-w-[90%]"><div className="flex items-center gap-2 mb-2 px-1"><div className="w-6 h-6 rounded-full bg-[#685FAB] flex items-center justify-center text-white text-[10px] font-bold">L0</div><span className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">TAPTIK 引擎</span></div><div className="px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[14px] text-zinc-800 leading-relaxed rounded-bl-sm font-medium">{renderMessageContent(msg.content as string, msg.role)}</div></div>)}</motion.div>))}<div ref={chatEndRef} /></div>)}
              </div>
              <div className="p-4 pt-0 shrink-0 max-w-5xl mx-auto w-full relative">
                 <AnimatePresence>{showMentionMenu && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-4 mb-2 w-72 bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col p-1"><div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100 bg-zinc-50 mb-1">调用 Skill 能力</div><div onClick={() => insertMention('KOC/KOS异构引擎', '@')} className="px-3 py-2 hover:bg-[#685FAB]/10 hover:text-[#685FAB] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 flex items-center gap-2 transition-colors"><Component size={14}/>KOC/KOS 异构引擎</div></motion.div>)}</AnimatePresence>
                 <div className="bg-white rounded-[14px] border border-zinc-200 shadow-sm overflow-hidden flex relative focus-within:border-[#685FAB]/50 ring-1 ring-transparent focus-within:ring-[#685FAB]/10 mb-3"><textarea rows={1} value={inputValue} onChange={handleInputChange} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="输入运营指令 (@召唤Skill)" className="flex-1 min-h-[56px] py-4 pl-4 pr-16 resize-none bg-transparent text-[14px] focus:outline-none" /><div className="absolute right-2 bottom-2"><button onClick={handleSend} disabled={!inputValue.trim()} className="w-10 h-10 rounded-[10px] bg-[#685FAB] hover:bg-[#504886] disabled:bg-[#f1f1f4] disabled:text-zinc-400 text-white flex items-center justify-center transition-all shadow-sm"><ArrowUp size={18} strokeWidth={2.5}/></button></div></div>
                 <div className="bg-white/50 rounded-xl border border-zinc-100 p-3 flex flex-wrap gap-x-6 gap-y-4">{SHORTCUT_CATEGORIES.map(cat => (<div key={cat.id} className="flex flex-col gap-2 min-w-[200px] flex-1"><div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 select-none uppercase tracking-wider pl-1"><cat.icon size={12}/>{cat.name}</div><div className="flex flex-col gap-1.5">{cat.items.map((item, idx) => (<button key={idx} onClick={() => setInputValue(prev => prev + (prev ? '\n' : '') + item.text)} className="text-left text-[12px] font-medium text-zinc-600 hover:text-[#685FAB] hover:bg-[#685FAB]/5 px-2.5 py-1.5 rounded-lg transition-colors truncate flex items-center gap-1.5">{item.type === 'skill' ? <Component size={12}/> : <Plus size={12}/>}<span className="truncate">{item.text}</span></button>))}</div></div>))}</div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'pipeline' && <Pipeline />}
        {activeNav === 'skills' && <SkillMarket creatingSkill={creatingSkill} setCreatingSkill={setCreatingSkill} skillMarketTab={skillMarketTab} setSkillMarketTab={setSkillMarketTab} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} />}
        {activeNav === 'files' && <FileManager filesTab={filesTab} setFilesTab={setFilesTab} activeProject={activeProject} activeDoc={activeDoc} setActiveDoc={setActiveDoc} />}
        {activeNav === 'data' && <DataCenter dataSubNav={dataSubNav} setDataSubNav={setDataSubNav} setActiveNav={setActiveNav} />}
        {activeNav === 'billing' && <Billing />}
        {activeNav === 'settings' && <div className="p-10"><h1 className="text-2xl font-black mb-4">系统设置</h1><p className="text-zinc-500">正在针对商家生命周期做深度适配...</p></div>}
      </div>
    </div>
  );
}
