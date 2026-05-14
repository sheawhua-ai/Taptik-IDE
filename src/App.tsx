import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate,
  Bot, TerminalSquare, RotateCw, RefreshCw, Home, X, Brain,
  PackagePlus, FileSpreadsheet, FileIcon, Component,
  CheckCircle2, AlertCircle, FileBox, FileQuestion, Flame, Link2,
  CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check,
  Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2,
  Hexagon, LogOut, Menu, ShoppingCart, Edit, User, Info, Cpu, Clock, CreditCard, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Config ---
interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
}

const SHORTCUT_CATEGORIES = [
  { 
    id: 'common', 
    name: '我常用的', 
    icon: Star,
    items: [
      { text: '提取竞品核心痛点', type: 'prompt' },
      { text: '一键洗稿(3平台)', type: 'prompt' },
      { text: '调用: KOC分发引擎', type: 'skill' }
    ]
  },
  { 
    id: 'content', 
    name: '内容创作', 
    icon: PenTool,
    items: [
      { text: '小红书高赞网感改写', type: 'prompt' },
      { text: '抖音/快手短视频脚本生成', type: 'prompt' },
      { text: '商品种草/测评大纲搭建', type: 'prompt' },
      { text: '多平台人设隔离生成', type: 'prompt' }
    ]
  },
  { 
    id: 'workflow', 
    name: '逻辑与流转', 
    icon: Workflow,
    items: [
      { text: '调用: 本地Tauri防重巡检', type: 'skill' },
      { text: '分析: 蓝海词RAG洞察', type: 'skill' },
      { text: '配置: 跨平台分发工作流', type: 'prompt' }
    ]
  },
  { 
    id: 'data', 
    name: '数据分析', 
    icon: BarChart2,
    items: [
      { text: '分析昨日大盘回收效果', type: 'prompt' },
      { text: '统计各子商家月度 T币开销', type: 'prompt' },
      { text: '导出笔记爆文率报表', type: 'prompt' }
    ]
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState<'skill' | 'agent' | null>(null);
  const [contextItems, setContextItems] = useState<string[]>([]);
  
  // -- Drag & Drop Context --
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [isDragHoveringChat, setIsDragHoveringChat] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // -- New Global Layout States --
  const [activeNav, setActiveNav] = useState('ai');
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);
  const [aiSidebarTab, setAiSidebarTab] = useState<'chat' | 'files'>('chat');
  const [dataSubNav, setDataSubNav] = useState('roi');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  
  const NAV_ITEMS = [
    { id: 'ai', name: 'AI 工作台', icon: Zap },
    { id: 'files', name: '项目文件', icon: FolderOpen },
    { id: 'pipeline', name: '资产管道', icon: Workflow },
    { id: 'data', name: '数据中心', icon: BarChart2 },
    { id: 'skills', name: 'Skill 市场', icon: LayoutGrid },
    { id: 'settings', name: '设置', icon: Settings },
  ];

  const UNIFIED_FILE_TREE = [
    {
      type: 'Folder',
      name: '营销物料库 (云端)',
      children: [
        { type: 'Folder', name: '活动原图分类库' },
        { type: 'File', name: '海报底图A.jpg' }
      ]
    },
    {
      type: 'Folder',
      name: '本地上传资料',
      children: [
         { type: 'File', name: '通用全局规范.pdf' },
         { type: 'RAG', name: '酒店标准话术.rag' }
      ]
    }
  ];

  const chatHistory = [
    { id: '1', title: '执行 Skill: 竞品标题仿写助手', time: '30 分钟前' },
    { id: '2', title: '你好', time: '37 分钟前' },
    { id: '3', title: '你好', time: '46 分钟前' }
  ];

  const [activePlanId, setActivePlanId] = useState('2');
  const [skillMarketTab, setSkillMarketTab] = useState<'market' | 'my'>('my');
  const [creatingSkill, setCreatingSkill] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // -- Utils --
  const insertMention = (name: string, type: '@' | '/') => {
    let newVal;
    if (inputValue.endsWith('@')) newVal = inputValue.slice(0, -1) + `@${name} `;
    else if (inputValue.endsWith('/')) newVal = inputValue.slice(0, -1) + `/${name} `;
    else newVal = inputValue + (inputValue && !inputValue.endsWith(' ') ? ' ' : '') + `${type}${name} `;
    
    setInputValue(newVal);
    setShowMentionMenu(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.endsWith('@')) setShowMentionMenu('skill');
    else if (val.endsWith('/')) setShowMentionMenu('agent');
    else setShowMentionMenu(null);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
  };

  const renderMessageContent = (content: string, role: string) => {
    const parts = content.split(/(@[\u4e00-\u9fa5a-zA-Z0-9_-]+)|(「(?:🔗|📄|📁|🧠|📦) [^」]+」)/);
    
    return parts.map((part, index) => {
      if (!part) return null;
      if (part.startsWith('@')) {
        return (
           <span key={index} className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[12px] font-bold ${role === 'user' ? 'bg-[#685FAB] text-white border border-[#504886]' : 'bg-[#685FAB]/10 text-[#685FAB]'}`}>
              <Component size={12} className={role === 'user' ? "text-[#685FAB]" : "text-[#685FAB]"} /> {part.substring(1)}
           </span>
        );
      } else if (part.startsWith('「')) {
         let icon = <FileBox size={12} />;
         if (part.startsWith('「🔗')) icon = <Link2 size={12} />;
         else if (part.startsWith('「📁')) icon = <FolderOpen size={12} />;
         else if (part.startsWith('「🧠')) icon = <Brain size={12} />;
         
         return (
            <span key={index} className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-[4px] text-[12px] font-bold border ${role === 'user' ? 'bg-[#2a2a2e] text-zinc-200 border-zinc-700' : 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
               {icon} {part.slice(3, -1)}
            </span>
         );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // --- Drag & Drop Flow ---
  const handleTreeDragStart = (e: React.DragEvent, type: string, name: string) => {
    e.dataTransfer.setData('text/plain', `asset:${type}:${name}`);
  };

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsGlobalDragging(true); };
    const handleDragLeave = (e: DragEvent) => {
      if (e.clientX === 0 || e.clientY === 0) setIsGlobalDragging(false);
    };
    const handleDrop = (e: DragEvent) => { e.preventDefault(); setIsGlobalDragging(false); };
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleChatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHoveringChat(true);
  };

  const handleChatDragLeave = (e: React.DragEvent) => {
    setIsDragHoveringChat(false);
  };

  const handleChatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHoveringChat(false);
    setIsGlobalDragging(false);

    const assetData = e.dataTransfer.getData('text/plain');
    if (assetData.startsWith('asset:')) {
      const [, type, name] = assetData.split(':');
      let prefix = '';
      if (type === 'Skill') insertMention(name, '@');
      else {
        if (type === 'Folder') prefix = '「📁 ';
        else if (type === 'File') prefix = '「📄 ';
        else if (type === 'RAG') prefix = '「🧠 ';
        const itemStr = `${prefix}${name}」`;
        setInputValue(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + itemStr + ' ');
      }
    } else {
      const files = Array.from(e.dataTransfer.files) as File[];
      if (files.length > 0) {
        files.forEach(f => {
           setInputValue(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + `「📄 ${f.name}」 `);
        });
      } else {
        const text = e.dataTransfer.getData('text');
        if (text) {
           setInputValue(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + `「🔗 ${text.substring(0,20)}...」 `);
        }
      }
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-white text-zinc-900 font-sans overflow-hidden">
      {/* Leftmost Sidebar - SaaS Nav */}
      <div className="w-[80px] xl:w-[200px] border-r border-zinc-200 bg-[#fbfbfb] flex flex-col shrink-0 flex-none h-full relative z-20">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-5 font-black text-lg tracking-tight text-zinc-900 gap-2">
          <div className="w-7 h-7 bg-[#685FAB] rounded-md flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <Hexagon size={16} className="fill-current" />
          </div>
          <span className="hidden xl:block">TAPTIK</span>
        </div>

        {/* Project Selector */}
        <div className="px-2 xl:px-3 py-2 cursor-pointer relative">
          <button 
             onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
             className={`w-full flex items-center justify-center xl:justify-between hover:bg-zinc-100 rounded-lg p-2 xl:px-2 xl:py-1.5 text-sm font-bold text-zinc-700 transition-colors ${isProjectSelectorOpen ? 'bg-zinc-100' : ''}`}>
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 xl:w-5 xl:h-5 rounded bg-[#EDEAF2] text-[#685FAB] flex items-center justify-center font-black text-[10px] shrink-0">宠</div>
               <span className="hidden xl:block truncate text-left max-w-[90px]">商家A:宠物...</span>
             </div>
             <ChevronDown size={14} className="text-zinc-400 hidden xl:block" />
          </button>
          
          {/* Project Switcher Modal */}
          {isProjectSelectorOpen && (
             <div className="absolute top-12 left-2 xl:left-4 w-[240px] bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative">
                       <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                       <input type="text" placeholder="搜索商家项目..." className="w-full bg-white border border-zinc-200 rounded-md py-1.5 pl-7 pr-2 text-[12px] focus:outline-none focus:border-[#685FAB] transition-colors" />
                    </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                   <button className="w-full flex items-center gap-2 px-2 py-2 hover:bg-zinc-50 rounded-lg transition-colors bg-[#685FAB]/5 text-left group">
                      <div className="w-6 h-6 rounded bg-[#EDEAF2] text-[#685FAB] flex items-center justify-center font-black text-[10px] shrink-0">宠</div>
                      <div className="flex-1 overflow-hidden">
                          <div className="text-[12px] font-bold text-zinc-900 group-hover:text-[#685FAB] transition-colors truncate">商家A: 猫粮冲刺</div>
                          <div className="text-[10px] font-medium text-zinc-500">618爆发期项目</div>
                      </div>
                      <Check size={14} className="text-[#685FAB] shrink-0" />
                   </button>
                   <button className="w-full flex items-center gap-2 px-2 py-2 hover:bg-zinc-50 rounded-lg transition-colors text-left group">
                      <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-600 flex items-center justify-center font-black text-[10px] shrink-0">美</div>
                      <div className="flex-1 overflow-hidden">
                          <div className="text-[12px] font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors truncate">商家B: 护肤精华</div>
                          <div className="text-[10px] font-medium text-zinc-500">种草防重分发矩阵</div>
                      </div>
                   </button>
                   <button className="w-full flex items-center gap-2 px-2 py-2 hover:bg-zinc-50 rounded-lg transition-colors text-left group">
                      <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-600 flex items-center justify-center font-black text-[10px] shrink-0">服</div>
                      <div className="flex-1 overflow-hidden">
                          <div className="text-[12px] font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors truncate">商家C: 瑜伽服测款</div>
                          <div className="text-[10px] font-medium text-zinc-500">A/B Testing 流转</div>
                      </div>
                   </button>
                </div>
                <div className="p-2 border-t border-zinc-100 bg-zinc-50/50">
                    <button className="w-full py-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-[#685FAB] hover:bg-[#685FAB]/10 rounded-md transition-colors"><Plus size={12}/> 新建商家项目</button>
                </div>
             </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-2 space-y-4 overflow-y-auto custom-scrollbar mt-2">
          
          <div>
            <div className="px-1 xl:px-3 text-[11px] font-bold text-zinc-400 mb-1.5 hidden xl:block">当前业务</div>
            <div className="space-y-1">
              {[
                { id: 'ai', name: 'AI 工作台', icon: Zap },
                { id: 'data', name: '业务数据看板', icon: BarChart2 },
                { id: 'pipeline', name: '资产管道 (RPA)', icon: Workflow },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-3 xl:py-2.5 rounded-lg text-[13px] font-bold transition-all relative ${
                    activeNav === item.id 
                      ? 'text-[#685FAB] bg-[#685FAB]/10' 
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                  title={item.name}
                >
                  {activeNav === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#685FAB] rounded-r-full" />}
                  <item.icon size={18} strokeWidth={activeNav === item.id ? 2.5 : 2} className="shrink-0" />
                  <span className="hidden xl:block truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="px-1 xl:px-3 text-[11px] font-bold text-zinc-400 mb-1.5 hidden xl:block">全局管理</div>
            <div className="space-y-1">
              {[
                { id: 'files', name: '全局资产库', icon: FolderOpen },
                { id: 'skills', name: 'Skill 市场', icon: LayoutGrid },
                { id: 'billing', name: '资源与消耗', icon: CreditCard },
                { id: 'settings', name: '系统设置', icon: Settings },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-3 xl:py-2.5 rounded-lg text-[13px] font-bold transition-all relative ${
                    activeNav === item.id 
                      ? 'text-[#685FAB] bg-[#685FAB]/10' 
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                  title={item.name}
                >
                  {activeNav === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#685FAB] rounded-r-full" />}
                  <item.icon size={18} strokeWidth={activeNav === item.id ? 2.5 : 2} className="shrink-0" />
                  <span className="hidden xl:block truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Commander Dashboard / Global Alerts */}
        <div className="px-2 xl:px-4 py-3 border-t border-zinc-200 relative">
           <button 
              onClick={() => setIsAlertOpen(!isAlertOpen)}
              className={`w-full flex flex-col xl:flex-row items-center xl:items-start gap-2 p-2 rounded-lg transition-colors group relative cursor-pointer ${isAlertOpen ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}>
              <div className="relative shrink-0">
                 <AlertCircle size={18} className="text-red-500" />
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div className="hidden xl:flex flex-col text-left">
                 <span className="text-[12px] font-bold text-zinc-800 leading-tight">全局指挥官警告 <span className="inline-block px-1 bg-red-100 text-red-600 rounded text-[9px] ml-1">2</span></span>
                 <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">某商家Cookie失效...</span>
              </div>
           </button>
           
           {/* Alerts Popover */}
           {isAlertOpen && (
              <div className="absolute bottom-14 left-4 xl:left-20 w-[300px] bg-white border border-red-200 shadow-2xl rounded-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                 <div className="p-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-[13px]">
                        <AlertCircle size={16} /> 异常巡检拦截 (2)
                    </div>
                    <button onClick={() => setIsAlertOpen(false)} className="text-red-400 hover:text-red-700"><X size={14}/></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-2 space-y-2 pointer-events-auto">
                    <div className="bg-white border border-red-100 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Token 失效</span>
                            <span className="text-[10px] text-zinc-400">10 分钟前</span>
                        </div>
                        <h4 className="text-[13px] font-bold text-zinc-900 leading-tight">商家A(猫粮): 小红书本地节点 Cookie 过期</h4>
                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">Mutator 分发任务中断，请前往「设置 - 平台绑定」使用 Tauri 容器重新扫码授权以恢复自动投流分发信道。</p>
                        <button className="mt-2 text-[11px] font-bold text-[#685FAB] hover:underline flex items-center gap-1">前往恢复连接 <ChevronRight size={10} /></button>
                    </div>
                    <div className="bg-white border border-red-100 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">RPA 巡检预警</span>
                            <span className="text-[10px] text-zinc-400">2 小时前</span>
                        </div>
                        <h4 className="text-[13px] font-bold text-zinc-900 leading-tight">竞品摘要仿写 RPA 抓取被限流</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">云拨测检测到目标账号防爬虫升级，系统已自动切换至代理池尝试重试，当前进度 2/3，建议降低巡检频率至 12 小时一次。</p>
                    </div>
                 </div>
                 <div className="p-2 border-t border-zinc-100 bg-zinc-50 text-center">
                     <button className="text-[11px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors">忽略全部</button>
                 </div>
              </div>
           )}
        </div>

        {/* User Profile */}
        <div className="p-3 xl:p-4 border-t border-zinc-200 flex items-center justify-center xl:justify-start gap-2">
          <div className="w-8 h-8 xl:w-6 xl:h-6 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 text-[10px] shrink-0">T</div>
          <span className="text-[11px] font-bold truncate text-zinc-600 hidden xl:block">taptik:1324...</span>
          <LogOut size={14} className="ml-auto text-zinc-400 cursor-pointer hover:text-zinc-600 hidden xl:block shrink-0" title="退出" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 h-full flex relative z-10 bg-white">
        {activeNav === 'ai' && (
          <>
            {/* Context Sub-Sidebar for AI */}
            {subSidebarOpen && (
              <div className="w-[200px] xl:w-[240px] border-r border-zinc-200 bg-white flex flex-col h-full shrink-0 relative transition-all">
                <div className="p-3 border-b border-zinc-100 flex items-center justify-between shrink-0">
                  <div className="flex gap-4 px-2 w-full">
                     <button onClick={() => setAiSidebarTab('chat')} className={`text-[12px] font-bold pb-2 border-b-2 flex-1 relative top-[13px] ${aiSidebarTab === 'chat' ? 'border-[#685FAB] text-[#685FAB]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>会话历史</button>
                     <button onClick={() => setAiSidebarTab('files')} className={`text-[12px] font-bold pb-2 border-b-2 flex-1 relative top-[13px] ${aiSidebarTab === 'files' ? 'border-[#685FAB] text-[#685FAB]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>项目资产</button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 pb-10 flex flex-col gap-0.5">
                  {aiSidebarTab === 'chat' ? (
                     <>
                        {chatHistory.map(h => (
                          <button key={h.id} className="w-full text-left flex flex-col gap-1 px-3 py-2 hover:bg-zinc-50 rounded-lg transition-colors group">
                            <div className="flex gap-2 items-center">
                               <MessageSquare size={14} className="text-zinc-400 group-hover:text-[#685FAB]" />
                               <span className="text-[13px] font-bold text-zinc-600 group-hover:text-zinc-800 truncate">{h.title}</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 pl-6">{h.time}</span>
                          </button>
                        ))}
                     </>
                  ) : (
                     <>
                        {/* Current Active Workflow File */}
                        <div className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 bg-[#685FAB]/5 rounded-lg transition-colors border-l-2 border-[#685FAB] cursor-pointer group mb-4 mt-2">
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                               <FileText size={14} className="text-[#685FAB] shrink-0" />
                               <span className="text-[13px] font-bold text-[#685FAB] truncate">618爆发期话术_草稿.md</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                               <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#685FAB] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#685FAB]"></span>
                               </span>
                               <span className="text-[9px] font-bold text-[#685FAB] uppercase">编辑中</span>
                            </div>
                        </div>

                        {UNIFIED_FILE_TREE.map((node, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] font-bold text-zinc-700 select-none">
                               <FolderOpen size={12} className="text-[#685FAB]/60" /> {node.name}
                            </div>
                            <div className="pl-5 flex flex-col gap-0.5 relative">
                               <div className="absolute left-[13px] top-0 bottom-2 w-px bg-zinc-200 rounded"></div>
                               {node.children.map((child, j) => (
                                  <div key={j} draggable onDragStart={(e) => handleTreeDragStart(e, child.type, child.name)} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#685FAB]/10 rounded-md cursor-grab active:cursor-grabbing text-[12px] font-medium text-zinc-600 select-none group transition-colors relative">
                                     <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-2 h-px bg-zinc-200"></div>
                                     {child.type === 'Folder' ? (
                                        <FolderOpen size={13} className="text-[#685FAB]/70 group-hover:text-[#685FAB]" />
                                     ) : child.type === 'RAG' ? (
                                        <Brain size={13} className="text-[#685FAB]/70 group-hover:text-[#685FAB]" />
                                     ) : (
                                        <FileIcon size={13} className="text-[#685FAB]/70 group-hover:text-[#685FAB]" />
                                     )}
                                     <span className="truncate">{child.name}</span>
                                  </div>
                               ))}
                            </div>
                          </div>
                        ))}
                     </>
                  )}
                </div>
              </div>
            )}

            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] relative min-w-0" onDragOver={handleChatDragOver} onDragLeave={handleChatDragLeave} onDrop={handleChatDrop}>
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSubSidebarOpen(!subSidebarOpen)} className="text-[#685FAB] hover:bg-[#685FAB]/10 p-1.5 rounded-lg transition-colors">
                    <LayoutTemplate size={20} />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-zinc-900 leading-tight">AI IDE 工作区</span>
                    <span className="text-[11px] font-medium text-zinc-500">当前会话记录</span>
                  </div>
                </div>
                <button onClick={() => setMessages([])} className="px-3 py-1.5 border border-zinc-200 rounded-md text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm bg-white flex items-center gap-1">
                  <RotateCw size={12}/> 清空对话
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                 {/* Drag Overlay */}
                 <AnimatePresence>
                    {isGlobalDragging && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 z-50 flex items-center justify-center m-4 rounded-2xl border-2 transition-colors backdrop-blur-[1px] ${isDragHoveringChat ? 'border-[#685FAB] bg-[#685FAB]/5' : 'border-dashed border-[#685FAB]/30 bg-[#685FAB]/5'}`}>
                          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-zinc-100 pointer-events-none">
                             {isDragHoveringChat ? <ArrowUp size={32} className="text-[#685FAB] mb-2 animate-bounce" /> : <LayersDropIcon className="w-8 h-8 text-[#685FAB] mb-2" />}
                             <span className="text-[14px] font-bold text-[#685FAB]">{isDragHoveringChat ? '松开以装载资产' : '拖放至此插入上下文'}</span>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                       <div className="w-14 h-14 bg-[#EDEAF2] text-[#685FAB] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#685FAB]/20">
                          <Zap size={28} className="fill-current opacity-80" />
                       </div>
                       <h2 className="text-2xl font-black text-zinc-900 mb-2">欢迎来到 TAPTIK IDE</h2>
                       <p className="text-[13px] font-medium text-zinc-500 mb-2 text-center">直接对话触发智能流转，输入 @ 召唤内置资产，或拖拽左侧文件至此</p>
                    </div>
                 ) : (
                    <div className="max-w-4xl mx-auto space-y-6 pb-2">
                       {messages.map((msg, idx) => (
                         <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                           {msg.role === 'user' ? (
                             <div className="flex flex-col items-end max-w-[90%]">
                                <div className="px-5 py-3.5 rounded-2xl bg-[#685FAB] text-[#f1f1f4] border border-[#504886] shadow-md rounded-br-sm text-[14px] leading-relaxed font-medium">{renderMessageContent(msg.content as string, msg.role)}</div>
                             </div>
                           ) : (
                             <div className="max-w-[90%]">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${msg.role === 'system' ? 'bg-[#C7C0DE] text-[#685FAB]' : 'bg-[#685FAB]'}`}>
                                      {msg.role === 'system' ? 'SYS' : 'L0'}
                                   </div>
                                   <span className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">{msg.role === 'system' ? '提示' : 'TAPTIK 引擎'}</span>
                                </div>
                                <div className={`px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[14px] text-zinc-800 leading-relaxed rounded-bl-sm font-medium ${msg.role === 'system' ? 'bg-zinc-50/80 text-zinc-600 border-dashed' : ''}`}>{renderMessageContent(msg.content as string, msg.role)}</div>
                             </div>
                           )}
                         </motion.div>
                       ))}
                       <div ref={chatEndRef} />
                    </div>
                 )}
              </div>

              {/* Input Area */}
              <div className="p-4 pt-0 shrink-0 max-w-5xl mx-auto w-full relative">
                 <AnimatePresence>
                   {showMentionMenu && (
                     <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className="absolute bottom-full left-4 mb-2 w-72 bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col max-h-64">
                        <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100 bg-zinc-50">
                           调用已有 Skill 能力
                        </div>
                        <div className="overflow-y-auto w-full flex-1 p-1 custom-scrollbar">
                           <div onClick={() => insertMention('KOC/KOS异构引擎', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#685FAB]/10 hover:text-[#685FAB] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                              <Component size={14} />蓝海词 KOC/KOS 异构引擎
                           </div>
                           <div onClick={() => insertMention('本地图文洗稿裂变', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#685FAB]/10 hover:text-[#685FAB] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                              <Component size={14} />物理级洗稿图文裂变 (Mutator)
                           </div>
                           <div onClick={() => insertMention('竞品标题仿写助手', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#685FAB]/10 hover:text-[#685FAB] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                              <Component size={14} />竞品标题仿写助手
                           </div>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <div className="bg-white rounded-[14px] border border-zinc-200 shadow-sm overflow-hidden flex relative transition-all focus-within:border-[#685FAB]/50 focus-within:shadow-md ring-1 ring-transparent focus-within:ring-[#685FAB]/10 mb-3">
                   <textarea 
                      rows={1}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="输入运营指令... （Enter 发送 / Shift+Enter 换行 / @触发Skill / 拖拽资产）"
                      className="flex-1 max-h-48 min-h-[56px] py-4 pl-4 pr-16 resize-none bg-transparent text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
                   />
                   <div className="absolute right-2 bottom-2 bg-white pl-2">
                      <button 
                         onClick={handleSend}
                         disabled={!inputValue.trim()}
                         className="w-10 h-10 rounded-[10px] bg-[#685FAB] hover:bg-[#504886] disabled:bg-[#f1f1f4] disabled:text-zinc-400 text-white flex items-center justify-center transition-all shadow-sm disabled:shadow-none"
                      >
                         {inputValue.trim() ? <ArrowUp size={18} strokeWidth={2.5} /> : <Zap size={18} className="fill-current opacity-50" />}
                      </button>
                   </div>
                 </div>

                 {/* Categorized Shortcuts Below Input */}
                 <div className="bg-white/50 rounded-xl border border-zinc-100 p-3 flex flex-wrap gap-x-6 gap-y-4">
                    {SHORTCUT_CATEGORIES.map(cat => (
                      <div key={cat.id} className="flex flex-col gap-2 min-w-[200px] flex-1">
                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 select-none uppercase tracking-wider pl-1">
                            <cat.icon size={12} className={cat.id === 'common' ? 'text-amber-500' : 'text-zinc-400'} />
                            {cat.name}
                         </div>
                         <div className="flex flex-col gap-1.5">
                            {cat.items.map((item, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => {
                                   if (item.type === 'skill') {
                                      setInputValue(prev => prev + (prev.endsWith(' ') ? '' : ' ') + '@' + item.text.replace('调用: ', '') + ' ');
                                   } else {
                                      setInputValue(prev => prev + (prev ? '\n' : '') + item.text);
                                   }
                                   // Keep focus or something similar, but simple state update is fine here
                                 }}
                                 className="text-left text-[12px] font-medium text-zinc-600 hover:text-[#685FAB] hover:bg-[#685FAB]/5 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#685FAB]/20 truncate flex items-center gap-1.5"
                               >
                                  {item.type === 'skill' ? <Component size={12} className="text-[#685FAB]/60 shrink-0" /> : <Plus size={12} className="text-zinc-400 shrink-0" />}
                                  <span className="truncate">{item.text}</span>
                               </button>
                            ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </>
        )}

        {/* PIPELINE (矩阵资产管道 Kanban) */}
        {activeNav === 'pipeline' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                <div>
                   <h1 className="text-2xl font-black text-zinc-900 border-b-2 border-[#685FAB] pb-1 inline-block">矩阵资产管道 (Pipeline)</h1>
                   <p className="text-[13px] text-zinc-500 font-medium mt-1">全局流转资产，从 AI 起草、人工审核到大规模排期分发，实现端到端管控。</p>
                </div>
                <div className="flex items-center gap-3">
                   <button className="text-[12px] font-bold text-zinc-600 bg-white border border-zinc-200 hover:text-zinc-900 px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-2">
                       <LayoutTemplate size={14}/> 视图设置
                   </button>
                   <button className="bg-[#685FAB] hover:bg-[#504886] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2">
                       <Plus size={16}/> 导入离线资产
                   </button>
                </div>
             </div>
             
             {/* Kanban Board Container */}
             <div className="flex-1 p-6 xl:p-8 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-start gap-6">
                
                {/* Column 1 */}
                <div className="flex shrink-0 flex-col w-[320px] h-full">
                   <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                         <span className="text-[14px] font-bold text-zinc-800">待 AI 重写/洗稿</span>
                         <span className="text-[11px] font-bold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">3</span>
                      </div>
                      <button className="text-zinc-400 hover:text-zinc-700"><Plus size={14}/></button>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
                      {/* Card */}
                      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 hover:border-[#685FAB]/40 hover:shadow-md transition-all cursor-move group">
                         <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">需降重处理</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="text-zinc-400 hover:text-zinc-700 p-0.5"><Edit size={12}/></button>
                            </div>
                         </div>
                         <h3 className="text-[13px] font-bold text-zinc-900 mb-1 leading-snug break-words">「新手养猫必看」这款主粮真的绝了！成分揭秘...</h3>
                         <div className="flex items-center justify-between mt-4">
                            <div className="flex -space-x-2">
                               <div className="w-6 h-6 rounded-full bg-[#685FAB] flex items-center justify-center text-white text-[10px] border-2 border-white font-bold"><Bot size={10}/></div>
                            </div>
                            <span className="text-[11px] font-medium text-zinc-400">刚刚生成</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 2 */}
                <div className="flex shrink-0 flex-col w-[320px] h-full">
                   <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                         <span className="text-[14px] font-bold text-zinc-800">待人工合规盲审</span>
                         <span className="text-[11px] font-bold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">12</span>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
                      {/* Card */}
                      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 hover:border-[#685FAB]/40 hover:shadow-md transition-all cursor-move group">
                         <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">等待人工核查</span>
                         </div>
                         <h3 className="text-[13px] font-bold text-zinc-900 mb-1 leading-snug break-words">双11宠物用品囤货节：教你如何薅羊毛最划算</h3>
                         <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">一年一度的双11又来了！宠物主人们准备好钱包了吗？今天整理了一份...</p>
                         <div className="flex items-center justify-between mt-4">
                            <button className="text-[11px] font-bold text-[#685FAB] bg-[#685FAB]/5 hover:bg-[#685FAB]/10 px-2 py-1 rounded transition-colors w-full">快速预览并过批</button>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 3 */}
                <div className="flex shrink-0 flex-col w-[320px] h-full">
                   <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-[#685FAB]" />
                         <span className="text-[14px] font-bold text-zinc-800">队列排期中 (挂机)</span>
                         <span className="text-[11px] font-bold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">44</span>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
                      {/* Card */}
                      <div className="bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl p-4 cursor-default">
                         <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] font-bold text-[#685FAB] bg-[#685FAB]/10 border border-[#685FAB]/20 px-2 py-0.5 rounded flex gap-1 items-center"><Workflow size={10}/> 系统排期 10.24 18:00</span>
                         </div>
                         <h3 className="text-[13px] font-bold text-zinc-700 mb-1 leading-snug break-words opacity-80">秋冬季节流浪猫救助指南，给它们一个温暖的家</h3>
                         <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-500">
                             <span>目标平台: 小红书</span>
                             <span className="font-mono">IP: 192.168.x.x</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 4 */}
                <div className="flex shrink-0 flex-col w-[320px] h-full">
                   <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                         <span className="text-[14px] font-bold text-zinc-800">分发成功</span>
                         <span className="text-[11px] font-bold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">84</span>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
                      {/* Card */}
                      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 hover:border-emerald-500/40 hover:shadow-md transition-all cursor-pointer group">
                         <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><Check size={10}/> 线上存活率 98%</span>
                         </div>
                         <h3 className="text-[13px] font-bold text-zinc-900 mb-1 leading-snug break-words">平价猫砂怎么选不踩雷？实测5款热门猫砂！</h3>
                         <div className="flex items-center justify-between mt-4">
                            <div className="text-[12px] font-bold text-zinc-800 flex items-center gap-1"><LineChart size={12} className="text-emerald-500"/> 曝光 1.2w</div>
                            <button className="text-[11px] font-bold text-zinc-500 hover:text-[#685FAB]">查看链接</button>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        )}

        {/* Skill Market / Tool Marketplace */}
        {activeNav === 'skills' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             {creatingSkill ? (
                <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
                   {/* Header */}
                   <div className="p-4 px-6 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setCreatingSkill(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"><ChevronLeft size={16}/></button>
                         <div>
                            <h1 className="text-lg font-black text-zinc-900 flex items-center gap-2">工作流技能蒸馏大模型构建器 <span className="text-[10px] bg-[#685FAB]/10 text-[#685FAB] px-1.5 py-0.5 rounded uppercase font-bold">Beta</span></h1>
                            <p className="text-[11px] text-zinc-500 font-medium">配置 Prompt、提取用户级配置表单，并打包为独立的 Skill 模块。</p>
                         </div>
                      </div>
                      <button className="bg-[#685FAB] hover:bg-[#685FAB]/90 text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2">
                         <Check size={16}/> 封测通过并部署
                      </button>
                   </div>
                   {/* Body */}
                   <div className="flex-1 flex h-0">
                      {/* Left: Configuration -> AI Talk-to-Create Interface */}
                      <div className="w-1/2 min-w-[500px] border-r border-zinc-200 bg-white flex flex-col">
                         <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                            <h3 className="text-[14px] font-bold text-zinc-800 flex items-center gap-2"><Sparkles size={16} className="text-[#685FAB]"/> 自然语言构建 (Copilot)</h3>
                            <p className="text-[12px] text-zinc-500 mt-1 font-medium">无需编写提示词或配置表单。只需描述你的日常运营 SOP 或痛点需求，AI 将自动思考所需字段并为你打包成标准技能模块。</p>
                         </div>
                         
                         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-white">
                            {/* Examples for Operations */}
                            <div className="space-y-3">
                               <div className="text-[11px] font-bold text-zinc-400">试试这样说：</div>
                               <div className="grid grid-cols-1 gap-2">
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-zinc-600 transition-colors">
                                     “我需要一个工具，输入小红书爆款链接，提取其核心痛点，然后按【引发共鸣-提出方案-背书-行动呼唤】的结构，帮我洗稿成3篇不同人设的笔记。”
                                  </button>
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-zinc-600 transition-colors">
                                     “帮我做一个小红书评论区控评话术生成器，让我输入网民的负面评论，自动生成高情商、懂梗、且带产品植入的回复。”
                                  </button>
                               </div>
                            </div>

                            {/* Chat History Mock */}
                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                               <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><User size={14}/></div>
                                  <div className="bg-zinc-100 rounded-2xl p-3 text-[13px] text-zinc-800 rounded-tl-none">我想要一个能根据产品功效，自动生成不同平台（小红书/抖音）种草文案的工具。</div>
                               </div>
                               <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#685FAB] flex items-center justify-center text-white shrink-0"><Bot size={14}/></div>
                                  <div className="bg-[#EDEAF2] border border-[#685FAB]/20 rounded-2xl p-4 text-[13px] text-zinc-800 rounded-tl-none space-y-3">
                                     <p>没问题！为了让这个工具好用，我设计了以下表单让运营同学填写：</p>
                                     <ol className="list-decimal pl-4 space-y-1 text-[#685FAB] font-bold text-[12px]">
                                        <li>产品核心卖点 (长文本)</li>
                                        <li>目标情绪风格 (下拉选择：干货/共情/搞笑等)</li>
                                     </ol>
                                     <p>我已将右侧界面更新，您可以直接预览它的长相。如果觉得哪里不合适，随时告诉我修改！👇</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Input box */}
                         <div className="p-4 border-t border-zinc-200 bg-white">
                            <div className="relative">
                               <textarea className="w-full h-24 border border-zinc-200 rounded-xl p-3 pr-12 text-[13px] resize-none focus:outline-none focus:border-[#685FAB] focus:ring-1 focus:ring-[#685FAB]/20 transition-all bg-zinc-50 focus:bg-white" placeholder="描述你的最新想法或修改建议..."></textarea>
                               <button className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center bg-[#685FAB] text-white rounded-lg shadow-sm hover:bg-[#504886] transition-colors">
                                  <Send size={14}/>
                               </button>
                            </div>
                            <div className="flex justify-between items-center mt-3 px-1">
                               <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1"><Info size={12}/> AI 会自动将你的自然语言翻译为底层 Prompt 及表单逻辑。</span>
                               <button className="text-[11px] text-zinc-500 hover:text-[#685FAB] font-bold flex items-center gap-1"><Settings size={12}/> 切换至极客专家模式</button>
                            </div>
                         </div>
                      </div>

                      {/* Right: UI Preview */}
                      <div className="flex-1 bg-zinc-100/50 p-8 flex justify-center overflow-y-auto custom-scrollbar relative">
                         <div className="absolute top-4 right-6 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 实时 UI 解析生成
                         </div>
                         <div className="w-full max-w-[400px]">
                            <h3 className="text-[13px] font-bold text-zinc-500 mb-4 text-center uppercase tracking-widest">终端表单呈现预览</h3>
                            
                            <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/60 overflow-hidden">
                               <div className="bg-gradient-to-r from-[#504886] to-[#685FAB] p-5 pb-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30 text-white"><FlaskConical size={20}/></div>
                                     <div className="text-white">
                                        <h2 className="text-[16px] font-black tracking-wide">小红书爆款文案生成</h2>
                                        <p className="text-[11px] opacity-80 mt-0.5 font-medium">配置并快速调用该节点能力</p>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="p-6 space-y-5 -mt-2 bg-white rounded-t-2xl relative z-10">
                                  <div className="space-y-2">
                                     <label className="text-[12px] font-bold text-zinc-700 block">产品核心卖点 <span className="text-red-500">*</span></label>
                                     <textarea placeholder="例如：美白、抗老、吸收快..." className="w-full border border-zinc-200 rounded-lg p-3 text-[13px] h-[80px] resize-none outline-none focus:border-[#685FAB] bg-white transition-colors" />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[12px] font-bold text-zinc-700 block">目标情绪风格 <span className="text-red-500">*</span></label>
                                     <select className="w-full border border-zinc-200 rounded-lg p-2.5 text-[13px] font-medium outline-none focus:border-[#685FAB] bg-white transition-colors">
                                        <option value="">请选择...</option>
                                        <option>干货输出</option>
                                        <option>共情发声</option>
                                        <option>沙雕幽默</option>
                                        <option>测评对比</option>
                                     </select>
                                  </div>
                                  <button className="w-full bg-[#685FAB] hover:bg-[#504886] text-white py-3 rounded-xl text-[13px] font-bold transition-all shadow-md hover:shadow-lg mt-2 flex justify-center items-center gap-2">
                                    <Play size={14} className="fill-current" /> 运行并输出内容
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             ) : (
                <>
                 <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                    <div>
                       <div className="flex items-center gap-4 mb-2 mt-1">
                         <h1 className="text-2xl font-black text-zinc-900 border-b-2 border-[#685FAB] pb-1 inline-block">生态工具库</h1>
                         <div className="flex items-center bg-zinc-100 rounded-lg p-1 text-[13px] font-bold">
                            <button onClick={() => setSkillMarketTab('my')} className={`px-4 py-1.5 rounded-md transition-all shadow-sm ${skillMarketTab === 'my' ? 'bg-white text-zinc-800' : 'text-zinc-500 hover:text-zinc-700 shadow-none'}`}>我的 Skills</button>
                            <button onClick={() => setSkillMarketTab('market')} className={`px-4 py-1.5 rounded-md transition-all shadow-sm ${skillMarketTab === 'market' ? 'bg-white text-zinc-800' : 'text-zinc-500 hover:text-zinc-700 shadow-none'}`}>发现市场</button>
                         </div>
                       </div>
                       <p className="text-[13px] text-zinc-500 font-medium">配置、管理你专属的 AI 技能节点</p>
                    </div>
                    <button onClick={() => setCreatingSkill(true)} className="bg-[#685FAB] hover:bg-[#504886] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2">
                        <Plus size={16}/> 创建技能模块
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 xl:p-8 flex flex-col items-center">
                    <div className="max-w-5xl w-full">
                       
                       <div className="mb-10">
                          <h2 className="text-[15px] font-black text-zinc-800 flex items-center gap-2 mb-4">
                             官方预置能力引擎 <span className="text-[11px] font-bold bg-[#685FAB]/10 text-[#685FAB] px-2 py-0.5 rounded-md">稳定版</span>
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                             {[
                                 { name: 'KOC/KOS 异构矩阵引擎', cat: '内容核心', mode: 'Cloud', catCol: 'emerald', active: true, desc: '自动注入 Geo-Delta(地理差分)变量与破冰话术，纯 Python(LangGraph) 逻辑实现。' },
                                 { name: '本地物理级图文洗稿裂变 (Mutator)', cat: '防重视觉', mode: 'Tauri', catCol: 'red', active: true, desc: '调取本地 CPU/GPU，结合本地环境注入微小噪点、防重写元素，彻底转移视觉算力成本。' },
                                 { name: '边缘无头浏览器引擎', cat: '数据巡检', mode: 'Tauri', isCustomMain: true, active: false, desc: '利用真实本地设备环境特征调度自动化动作，绕过云拨测检测策略。' },
                                 { name: '内容方案 RAG 动态调度预判', cat: '云端中枢', mode: 'Cloud', isCustomMain: true, active: false, desc: '基于商家资料 RAG 动态下发任务预判，实现“对话即资产”流转。' }
                             ].map(sk => (
                                 <div className={`bg-white border ${sk.active ? 'border-zinc-200 hover:border-[#685FAB]/30' : 'border-zinc-100 opacity-70'} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer`} key={sk.name}>
                                    <div>
                                       <div className="flex justify-between items-start mb-3">
                                          <span className="text-[10px] font-bold text-[#685FAB] bg-[#685FAB]/10 border border-[#685FAB]/20 px-2.5 py-0.5 rounded-md">{sk.cat}</span>
                                          {sk.mode === 'Tauri' ? (
                                              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded flex items-center gap-1"><Cpu size={10}/> Tauri 算力</span>
                                          ) : (
                                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><Cloud size={10}/> 云端集群</span>
                                          )}
                                       </div>
                                       <h3 className="text-[15px] font-bold text-zinc-900 mb-2 truncate group-hover:text-[#685FAB] transition-colors">{sk.name}</h3>
                                       <p className="text-[12px] text-zinc-500 font-medium leading-relaxed min-h-[36px]">{sk.desc}</p>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-zinc-100 pt-3 mt-4">
                                       {sk.active ? (
                                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#685FAB]">
                                              <div className="w-1.5 h-1.5 rounded-full bg-[#685FAB] animate-pulse" /> 服务连通正常
                                          </div>
                                       ) : (
                                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" /> 未就绪
                                          </div>
                                       )}
                                       {!sk.active && (
                                           <button className="text-[11px] font-bold text-zinc-500 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded transition-colors">激活本地引擎</button>
                                       )}
                                    </div>
                                 </div>
                             ))}
                          </div>
                       </div>

                       <div>
                          <h2 className="text-[15px] font-black text-zinc-800 flex items-center gap-2 mb-4">
                             用户自定义节点 <span className="text-[12px] font-medium text-zinc-500 font-normal">· 基于工作流蒸馏生成</span>
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                             <div onClick={() => setCreatingSkill(true)} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm relative group hover:border-[#685FAB]/30 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                       <span className="text-[11px] font-bold text-[#685FAB] bg-[#685FAB]/5 border border-[#685FAB]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1"><TerminalSquare size={10}/> 本地部署</span>
                                       <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> 无人值守 (RPA)</span>
                                       </div>
                                    </div>
                                    <h3 className="text-[15px] font-bold text-zinc-900 mb-2 group-hover:text-[#685FAB] transition-colors leading-tight">竞品摘要仿写 RPA 助手</h3>
                                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-4 line-clamp-3">自动抓取3个固定竞品账号在指定关键词下的最热笔记标题，分析爆款规律格式结构规律，并作为素材下发到Pipeline中。</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 每 6 小时巡检
                                   </div>
                                   <button className="text-[12px] font-bold text-[#685FAB] bg-[#685FAB]/5 hover:bg-[#685FAB]/10 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#685FAB]/20 flex items-center gap-1"><Settings size={12}/> RPA配置</button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                </>
             )}
          </div>
        )}

        {/* FILES (项目资源) */}
        {activeNav === 'files' && (
          <div className="flex-1 flex h-full">
             <div className="w-[200px] xl:w-[240px] border-r border-zinc-200 bg-white flex flex-col shrink-0">
               <div className="p-4 border-b border-zinc-100 shrink-0">
                  <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wide">项目资源目录</span>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-4">
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400">商家项目 (独立隔离)</div>
                    <div className="space-y-0.5">
                       <div className="px-3 py-2 bg-[#EDEAF2] text-[#685FAB] rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <FolderOpen size={14} /> 商家A：猫粮冲刺
                       </div>
                       <div className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <FolderOpen size={14} className="text-zinc-400" /> 商家B：护肤精华
                       </div>
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400">全局空间</div>
                    <div className="space-y-0.5">
                       <div className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <Monitor size={14} className="text-zinc-400" /> Tauri 挂载盘
                       </div>
                       <div className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <Cloud size={14} className="text-zinc-400" /> Taptik 云端知识库
                       </div>
                    </div>
                  </div>
               </div>
               <div className="p-3 border-t border-zinc-100 shrink-0">
                  <button className="w-full py-2 bg-[#685FAB]/5 text-[#685FAB] border border-[#685FAB]/20 rounded-lg text-[12px] font-bold hover:bg-[#685FAB]/10 transition-colors flex items-center justify-center gap-2">
                     <Plus size={14} /> 新增项目空间
                  </button>
               </div>
            </div>
            
            <div className="flex-1 flex flex-col bg-[#fbfbfb] min-w-0">
               <div className="p-6 border-b border-zinc-200 flex items-center justify-between shrink-0 bg-white">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Cloud</span>
                     </div>
                     <span className="text-[18px] font-black text-zinc-900 flex items-center gap-2">
                        商家A：猫粮冲刺 (文件系统 & RAG 知识库)
                     </span>
                     <p className="text-[12px] text-zinc-500 font-medium mt-1">这里的文件将作为全局资产自动挂载至 AI 工作台，并成为默认检索的 RAG 知识范围。</p>
                  </div>
                  <div className="flex gap-2 shrink-0 items-center">
                     <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-zinc-50 flex items-center gap-2">
                       <Plus size={14} /> 上传文件或素材
                     </button>
                     <button className="px-4 py-2 bg-[#685FAB] text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-[#504886] flex items-center gap-2">
                       <Brain size={14} /> 配置提取清洗规则
                     </button>
                  </div>
               </div>
               <div className="flex-1 p-6 overflow-y-auto space-y-6">
                 
                 {/* Tree structure representation */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                     {UNIFIED_FILE_TREE.map((node, i) => (
                        <div key={i} className="bg-white border text-left border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                           <div>
                               <div className="flex items-center justify-between mb-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#685FAB]/5 text-[#685FAB] flex items-center justify-center shrink-0">
                                     <FolderOpen size={20} />
                                  </div>
                                  <div className="flex gap-1">
                                     <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"><ChevronRight size={14}/></button>
                                  </div>
                               </div>
                               <h3 className="text-[14px] font-bold text-zinc-800">{node.name}</h3>
                               <p className="text-[11px] text-zinc-500 mt-1">{node.children.length} 个资产节点</p>
                           </div>
                           <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
                              {node.children.slice(0, 3).map((child, j) => (
                                 <div key={j} className="flex items-center gap-2 text-[12px] text-zinc-600 font-medium group/item cursor-pointer">
                                     {child.type === 'RAG' ? (
                                        <Brain size={12} className="text-[#685FAB] shrink-0" />
                                     ) : (
                                        <FileIcon size={12} className="text-emerald-500 shrink-0" />
                                     )}
                                     <span className="truncate group-hover/item:text-[#685FAB] transition-colors">{child.name}</span>
                                     {child.type === 'RAG' && <span className="ml-auto text-[9px] bg-[#685FAB]/10 text-[#685FAB] px-1 rounded font-bold">RAG</span>}
                                 </div>
                              ))}
                              {node.children.length > 3 && (
                                 <div className="text-[11px] text-zinc-400 font-bold ml-5">
                                    + {node.children.length - 3} 更多...
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* List View Details */}
                  <h3 className="text-[14px] font-bold text-zinc-800 mt-8 mb-4 flex items-center gap-2">详细资产流清单</h3>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="border-b border-zinc-100 text-[12px] text-zinc-400 bg-zinc-50">
                              <th className="py-3 px-2 font-bold w-12 text-center"><input type="checkbox" className="rounded border-zinc-300" defaultChecked /></th>
                              <th className="py-3 px-4 font-bold">文件名称</th>
                              <th className="py-3 px-4 font-bold">大小</th>
                              <th className="py-3 px-4 font-bold">更新时间</th>
                              <th className="py-3 px-4 font-bold text-right">RAG 向量状态</th>
                           </tr>
                        </thead>
                        <tbody className="text-[13px] text-zinc-700">
                           <tr className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                              <td className="py-3 px-2 text-center"><input type="checkbox" className="rounded border-zinc-300" defaultChecked /></td>
                              <td className="py-3 px-4 flex items-center gap-2 font-medium truncate max-w-[200px]"><FileText size={14} className="text-emerald-500 shrink-0" /> <span className="truncate max-w-[150px]">猫粮成分表分析.pdf</span> <span className="text-[9px] bg-[#685FAB]/10 text-[#685FAB] px-1.5 py-0.5 rounded font-bold">源文件</span></td>
                              <td className="py-3 px-4 text-zinc-500">2.4 MB</td>
                              <td className="py-3 px-4 text-zinc-500">今天 10:23</td>
                              <td className="py-3 px-4 text-right"><span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1"><CheckCircle2 size={12}/> 已向量化提取</span></td>
                           </tr>
                           <tr className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                              <td className="py-3 px-2 text-center"><input type="checkbox" className="rounded border-zinc-300" defaultChecked /></td>
                              <td className="py-3 px-4 flex items-center gap-2 font-medium truncate max-w-[200px]"><FolderOpen size={14} className="text-red-500 shrink-0 fill-red-100" /> <span className="truncate">包装产品合集</span></td>
                              <td className="py-3 px-4 text-zinc-500">14.2 MB</td>
                              <td className="py-3 px-4 text-zinc-500">昨天 16:45</td>
                              <td className="py-3 px-4 text-right"><span className="text-[11px] font-bold text-zinc-400">不支持 RAG</span></td>
                           </tr>
                           <tr className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                              <td className="py-3 px-2 text-center"><input type="checkbox" className="rounded border-zinc-300" /></td>
                              <td className="py-3 px-4 flex items-center gap-2 font-medium truncate max-w-[200px]"><FileSpreadsheet size={14} className="text-green-500 shrink-0" /> <span className="truncate">Q2销售数据总结.xlsx</span></td>
                              <td className="py-3 px-4 text-zinc-500">125 KB</td>
                              <td className="py-3 px-4 text-zinc-500">昨天 11:20</td>
                              <td className="py-3 px-4 text-right"><span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1"><RotateCw size={12} className="animate-spin"/> 清洗解析中...</span></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>
        )}


        
        {/* DATA (数据中心) */}
        {activeNav === 'data' && (
          <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar">
             <div className="p-6 xl:p-8 border-b border-zinc-100 shrink-0">
                <h1 className="text-2xl font-black text-zinc-900">数据中心</h1>
                <p className="text-[13px] text-zinc-500 font-medium mt-1">项目多维数据监控、笔记曝光转化与受众反馈深度解析</p>
             </div>
             
              <div className="p-6 xl:p-8 flex-1 space-y-8 bg-[#fbfbfb]">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">小红书总曝光 <Activity size={14} className="text-[#685FAB]" /></div>
                      <div className="text-2xl font-black text-zinc-900">12.5 W</div>
                      <div className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 12.4% 较上周</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">小红书总互动 <Component size={14} className="text-rose-500" /></div>
                      <div className="text-2xl font-black text-zinc-900">3,492</div>
                      <div className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 8.1% 较上周</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">小红书净涨粉 <Target size={14} className="text-emerald-500" /></div>
                      <div className="text-2xl font-black text-zinc-900">845 人</div>
                      <div className="text-[11px] font-bold text-rose-500 mt-2 flex items-center gap-1"><ArrowUpFromLine size={12} className="rotate-180"/> 2.3% 较上周</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">新增私信/评论圈客 <MessageSquare size={14} className="text-red-500" /></div>
                      <div className="text-2xl font-black text-zinc-900">412 条</div>
                      <div className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 21.5% 较上周</div>
                   </div>
                </div>

                {/* Sub Nav */}
                <div className="flex items-center justify-between border-b border-zinc-200">
                   <div className="flex items-center gap-6">
                      <button 
                         onClick={() => setDataSubNav('roi')}
                         className={`pb-3 text-[14px] font-bold ${dataSubNav === 'roi' ? 'text-[#685FAB] border-b-2 border-[#685FAB]' : 'text-zinc-500 hover:text-zinc-800'}`}>跨域归因 ROI 引擎</button>
                      <button 
                         onClick={() => setDataSubNav('blueocean')}
                         className={`pb-3 text-[14px] font-bold ${dataSubNav === 'blueocean' ? 'text-[#685FAB] border-b-2 border-[#685FAB]' : 'text-zinc-500 hover:text-zinc-800'}`}>蓝海词巡检大盘</button>
                   </div>
                   <div className="pb-3 flex items-center gap-2">
                       <span className="text-[12px] font-bold text-zinc-400">数据中间件状态:</span>
                       <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><Check size={12}/> 有赞 API 已连接</span>
                   </div>
                </div>

                {dataSubNav === 'roi' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Funnel */}
                   <div className="md:col-span-1 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                       <h3 className="text-[14px] font-black text-zinc-900 w-full mb-6 flex items-center justify-between">
                           商业转化漏斗 
                           <button className="text-[11px] text-zinc-400 hover:text-[#685FAB] flex items-center gap-1"><Settings size={12}/> 配置暗号</button>
                       </h3>
                       
                       <div className="w-full max-w-[200px] flex flex-col gap-1 items-center relative">
                          {/* Funnel Step 1 */}
                          <div className="w-full bg-[#685FAB]/10 border border-[#685FAB]/20 p-3 rounded-lg text-center z-10">
                              <div className="text-[11px] font-bold text-[#685FAB]">矩阵总触达曝光</div>
                              <div className="text-xl font-black text-zinc-900 mt-1">125,000</div>
                          </div>
                          <div className="w-px h-6 bg-zinc-200"></div>
                          {/* Funnel Step 2 */}
                          <div className="w-[85%] bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center z-10">
                              <div className="text-[11px] font-bold text-emerald-600">高意向评论 ("求链接")</div>
                              <div className="text-xl font-black text-zinc-900 mt-1">1,240</div>
                          </div>
                          <div className="w-px h-6 bg-zinc-200"></div>
                          {/* Funnel Step 3 */}
                          <div className="w-[70%] bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center z-10">
                              <div className="text-[11px] font-bold text-emerald-600">RAG 话术私信成单</div>
                              <div className="text-xl font-black text-zinc-900 mt-1">312</div>
                          </div>
                       </div>
                   </div>

                   {/* Content Table */}
                   <div className="md:col-span-2 bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
                      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                         <span className="text-[13px] font-bold text-zinc-800">单篇笔记真实 GMV 贡献排行</span>
                         <button className="text-[11px] font-bold text-[#685FAB]">导出报表</button>
                      </div>
                      <div className="flex-1 overflow-x-auto">
                         <table className="w-full text-left border-collapse min-w-[500px]">
                           <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] text-zinc-500">
                              <tr>
                                 <th className="py-3 px-4 font-bold">源笔记标识 (XHS_ID)</th>
                                 <th className="py-3 px-4 font-bold text-right">私信引流数</th>
                                 <th className="py-3 px-4 font-bold text-right">Map 映射订单数</th>
                                 <th className="py-3 px-4 font-bold text-right">闭环 GMV (¥)</th>
                              </tr>
                           </thead>
                           <tbody className="text-[12px] text-zinc-800 font-medium">
                              <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                                 <td className="py-3 px-4 flex items-center gap-2">
                                     <div className="w-6 h-6 rounded bg-zinc-200 bg-cover" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1548247661-3d7905940716?auto=format&fit=crop&w=100&q=80)'}}></div>
                                     <span className="font-bold text-zinc-900 max-w-[120px] truncate">「新手养猫必看...</span>
                                 </td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px]">245</td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px] text-emerald-600">82</td>
                                 <td className="py-3 px-4 text-right font-bold text-[14px] text-[#685FAB]">¥24,500.00</td>
                              </tr>
                              <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                                 <td className="py-3 px-4 flex items-center gap-2">
                                     <div className="w-6 h-6 rounded bg-zinc-200 flex items-center justify-center text-zinc-400"><FileText size={10}/></div>
                                     <span className="font-bold text-zinc-900 max-w-[120px] truncate">双11宠物用品...</span>
                                 </td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px]">112</td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px] text-emerald-600">34</td>
                                 <td className="py-3 px-4 text-right font-bold text-[14px]">¥9,350.00</td>
                              </tr>
                           </tbody>
                         </table>
                      </div>
                   </div>
                </div>
                ) : (
                   <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
                      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                         <span className="text-[13px] font-bold text-zinc-800">蓝海词矩阵探测趋势排榜 (RPA 抓取)</span>
                         <button className="text-[11px] font-bold flex items-center gap-1 text-[#685FAB] bg-[#685FAB]/10 px-2 py-1 rounded"><RefreshCw size={12}/> 强制刷新</button>
                      </div>
                      <div className="p-6">
                         <div className="flex gap-4 mb-6">
                             <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                <div className="text-[12px] font-bold text-emerald-600 mb-1">近期高潜力增长词</div>
                                <div className="text-[18px] font-black text-zinc-900">#无谷烘焙冻干猫粮</div>
                                <div className="text-[11px] text-emerald-500 mt-2 font-medium flex items-center gap-1"><ArrowUp size={12}/> 搜索热度日环比 +42%</div>
                             </div>
                             <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
                                <div className="text-[12px] font-bold text-red-600 mb-1">竞争红海词 (建议避让)</div>
                                <div className="text-[18px] font-black text-zinc-900">#猫粮推荐</div>
                                <div className="text-[11px] text-red-500 mt-2 font-medium">前排均点赞量 &gt; 5w+，流量挤压</div>
                             </div>
                         </div>
                         <table className="w-full text-left border-collapse min-w-[500px]">
                           <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] text-zinc-500">
                              <tr>
                                 <th className="py-3 px-4 font-bold">探测关键词 (Keyword)</th>
                                 <th className="py-3 px-4 font-bold text-right">热度指数 (24h)</th>
                                 <th className="py-3 px-4 font-bold text-right">长尾竞争规模</th>
                                 <th className="py-3 px-4 font-bold text-right">建议操作</th>
                              </tr>
                           </thead>
                           <tbody className="text-[12px] text-zinc-800 font-medium">
                              <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                                 <td className="py-3 px-4 flex items-center gap-2">
                                     <span className="font-bold text-zinc-900 truncate">#新手养幼猫必囤</span>
                                 </td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px] text-emerald-600 flex justify-end items-center gap-1"><ArrowUp size={12}/> 8,420</td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px]">520 篇</td>
                                 <td className="py-3 px-4 text-right">
                                    <button className="text-[11px] font-bold text-white bg-[#685FAB] hover:bg-[#504886] px-3 py-1.5 rounded transition-colors">生成选题组</button>
                                 </td>
                              </tr>
                              <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                                 <td className="py-3 px-4 flex items-center gap-2">
                                     <span className="font-bold text-zinc-900 truncate">#多猫家庭护毛猫粮</span>
                                 </td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px] text-emerald-600 flex justify-end items-center gap-1"><ArrowUp size={12}/> 4,115</td>
                                 <td className="py-3 px-4 text-right font-mono text-[13px]">128 篇</td>
                                 <td className="py-3 px-4 text-right">
                                    <button className="text-[11px] font-bold text-white bg-[#685FAB] hover:bg-[#504886] px-3 py-1.5 rounded transition-colors">生成选题组</button>
                                 </td>
                              </tr>
                           </tbody>
                         </table>
                      </div>
                   </div>
                )}
              </div>
          </div>
        )}

        {/* SETTINGS (系统配置) */}
        {activeNav === 'billing' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] overflow-y-auto custom-scrollbar">
             <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white shrink-0 shadow-sm relative z-10">
                 <h1 className="text-2xl font-black text-zinc-900">资产与计费</h1>
                 <p className="text-[13px] text-zinc-500 font-medium mt-1">管理资金池、T币消耗记录，以及商户订阅和资源扣费。1 元 = 1 T币。</p>
             </div>
             
             <div className="flex-1 p-6 xl:p-8 max-w-5xl space-y-8">
                 {/* 账户余额概览 */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-[#685FAB] to-[#504886] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                       <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
                       <div className="relative z-10">
                          <div className="flex items-center gap-2 text-[#C7C0DE] font-bold text-[13px] mb-2"><Coins size={16} /> 组织 T币可用余额</div>
                          <div className="text-[42px] font-black tracking-tight leading-none mb-1">4,720 <span className="text-[20px] text-[#C7C0DE] font-bold ml-1 tracking-normal">T币</span></div>
                          <div className="text-[12px] text-[#C7C0DE] font-medium mt-3 flex items-center gap-2">
                             <div className="px-2 py-1 bg-white/10 rounded-md">包含年度订阅赠送的 6,000 T币池</div>
                          </div>
                       </div>
                       <div className="relative z-10 flex items-center gap-3 mt-6">
                          <button onClick={() => window.open('https://mock.taptik.com/recharge', '_blank')} className="bg-white text-[#685FAB] hover:bg-zinc-50 px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md transition-colors">立刻充值</button>
                          <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors">账单明细</button>
                       </div>
                    </div>
                    
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
                       <div>
                          <div className="text-[13px] font-bold text-zinc-500 flex items-center gap-2 mb-4"><CreditCard size={16} /> 当前订阅方案</div>
                          <div className="flex justify-between items-end">
                              <div className="text-[24px] font-black text-[#685FAB]">企业年卡</div>
                              <div className="text-[13px] font-bold text-zinc-500 mb-1">¥ 3,990 / 年</div>
                          </div>
                          <div className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-2 border border-emerald-100">生效中 · 2027-05-01 到期</div>
                       </div>
                       <button onClick={() => window.open('https://mock.taptik.com/subscribe', '_blank')} className="w-full mt-6 bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-sm">续费或升级方案</button>
                    </div>
                 </div>

                 {/* 消耗记录表 */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#685FAB]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                       <div>
                         <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Activity size={16} className="text-[#685FAB]"/> 商家动态分发与调用消耗</h2>
                         <p className="text-[12px] text-zinc-500 mt-1">混合模型调度：笔记固定扣费 2 T币/篇。其余按大模型(海外/国内)执行规模独立计费。</p>
                       </div>
                       <button className="text-[12px] font-bold text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1">
                          <Download size={14}/> 导出对账单
                       </button>
                    </div>
                    <div className="p-0">
                       <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead className="bg-zinc-50">
                             <tr className="text-[12px] text-zinc-500">
                                <th className="py-4 px-6 font-bold border-b border-zinc-100">消耗时间</th>
                                <th className="py-4 px-6 font-bold border-b border-zinc-100">关联商家/项目</th>
                                <th className="py-4 px-6 font-bold border-b border-zinc-100">活动业务类型</th>
                                <th className="py-4 px-6 font-bold border-b border-zinc-100">调用模型引擎</th>
                                <th className="py-4 px-6 font-bold border-b border-zinc-100 text-right">消耗 T币数</th>
                             </tr>
                          </thead>
                          <tbody className="text-[13px] text-zinc-900 font-medium">
                             <tr className="hover:bg-zinc-50/50 transition-colors">
                                <td className="py-4 px-6 border-b border-zinc-50 text-zinc-500 font-mono text-[12px]">05-07 10:24</td>
                                <td className="py-4 px-6 border-b border-zinc-50">
                                  <div className="flex flex-col">
                                    <span className="font-bold">商家A：宠物食品组</span>
                                    <span className="text-[11px] text-zinc-500">KOC矩阵分发</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-b border-zinc-50"><span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold">小红书代写 (15篇)</span></td>
                                <td className="py-4 px-6 border-b border-zinc-50">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#685FAB]"></div>
                                    <span>DeepSeek-V3</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-b border-zinc-50 text-right font-mono text-red-600 font-bold">-30</td>
                             </tr>
                             <tr className="hover:bg-zinc-50/50 transition-colors">
                                <td className="py-4 px-6 border-b border-zinc-50 text-zinc-500 font-mono text-[12px]">05-07 09:12</td>
                                <td className="py-4 px-6 border-b border-zinc-50">
                                  <div className="flex flex-col">
                                    <span className="font-bold">商家B：美妆旗舰店</span>
                                    <span className="text-[11px] text-zinc-500">新品高赞仿写</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-b border-zinc-50"><span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded text-[11px] font-bold">深度图文改写 (5个)</span></td>
                                <td className="py-4 px-6 border-b border-zinc-50">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#685FAB]"></div>
                                    <span>GPT-4o (海外节点)</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-b border-zinc-50 text-right font-mono text-red-600 font-bold">-45</td>
                             </tr>
                             <tr className="hover:bg-zinc-50/50 transition-colors">
                                <td className="py-4 px-6 border-b border-zinc-50 text-zinc-500 font-mono text-[12px]">05-07 08:33</td>
                                <td className="py-4 px-6 border-b border-zinc-50">
                                  <div className="flex flex-col">
                                    <span className="font-bold">全局共享资源</span>
                                    <span className="text-[11px] text-zinc-500">蓝海词巡检大盘</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-b border-zinc-50"><span className="bg-[#685FAB]/10 text-[#685FAB] border border-[#685FAB]/20 px-2 py-0.5 rounded text-[11px] font-bold">RAG 全局分析生成</span></td>
                                <td className="py-4 px-6 border-b border-zinc-50">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#685FAB]"></div>
                                    <span>Claude 3.5 Sonnet</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-b border-zinc-50 text-right font-mono text-red-600 font-bold">-28</td>
                             </tr>
                             <tr className="hover:bg-zinc-50/50 transition-colors">
                                <td className="py-4 px-6 text-zinc-500 font-mono text-[12px]">05-06 20:15</td>
                                <td className="py-4 px-6">
                                  <div className="flex flex-col">
                                    <span className="font-bold">商家C：瑜伽服测款</span>
                                    <span className="text-[11px] text-zinc-500">自动带货短视频流转</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6"><span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold">视频口播分发 (20篇)</span></td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#685FAB]"></div>
                                    <span>Qwen-Max</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-right font-mono text-red-600 font-bold">-40</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
          </div>
        )}

        {activeNav === 'settings' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] overflow-y-auto custom-scrollbar">
             <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white shrink-0 shadow-sm relative z-10">
                 <h1 className="text-2xl font-black text-zinc-900">系统全局配置</h1>
                 <p className="text-[13px] text-zinc-500 font-medium mt-1">管理商家隔离账号、三方自动化爬虫授权以及数据回调 API。</p>
             </div>
             
             <div className="flex-1 p-6 xl:p-8 max-w-4xl space-y-8">
                 {/* 商家账号管理 */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#685FAB]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                       <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Building2 size={16} className="text-[#685FAB]"/> 商家/项目隔离授权</h2>
                       <button className="text-[12px] font-bold text-white bg-[#685FAB] hover:bg-[#504886] px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1">
                          <Plus size={14}/> 新增商家组
                       </button>
                    </div>
                    <div className="p-5 space-y-4">
                       {[
                         { name: '商家A：宠物食品组', admin: 'zhangsan@pet.com', initial: '商A' },
                         { name: '商家B：美妆旗舰店', admin: 'lisi@beauty.com', initial: '商B' }
                       ].map(acc => (
                         <div key={acc.initial} className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-[#685FAB]/30 transition-colors bg-white">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full bg-[#fbfbfb] border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-[15px]">{acc.initial}</div>
                               <div>
                                 <div className="text-[14px] font-bold text-zinc-900">{acc.name}</div>
                                 <div className="text-[12px] text-zinc-500 mt-1">云端管理员：{acc.admin}</div>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">授权正常</span>
                               <button className="text-[13px] font-bold text-zinc-500 hover:text-[#685FAB] transition-colors border border-zinc-200 hover:border-[#685FAB]/30 px-4 py-2 rounded-lg bg-white shadow-sm">编辑策略</button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* 爬虫与自动化授权 */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#685FAB]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                       <div>
                         <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Bot size={16} className="text-[#685FAB]"/> 本地沙盒静默巡检与边缘爬虫 (Tauri)</h2>
                         <p className="text-[12px] text-zinc-500 mt-1">建立无头浏览器，消耗本地家庭宽带IP，零成本抓取蓝海词及每日笔记收录排名。</p>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-full flex items-center gap-1"><Check size={10}/> IP防风控正常</span>
                         <button className="text-[12px] font-bold text-white bg-[#685FAB] hover:bg-[#504886] px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1">
                            <Plus size={14}/> 录入新节点
                         </button>
                       </div>
                    </div>
                    <div className="p-5">
                       <table className="w-full text-left border-collapse border border-zinc-100 rounded-lg overflow-hidden">
                          <thead className="bg-zinc-50">
                             <tr className="text-[12px] text-zinc-500">
                                <th className="py-3 px-4 font-bold border-b border-zinc-100">账号昵称</th>
                                <th className="py-3 px-4 font-bold border-b border-zinc-100">系统指派用途</th>
                                <th className="py-3 px-4 font-bold border-b border-zinc-100">状态</th>
                                <th className="py-3 px-4 font-bold border-b border-zinc-100 text-right">操作</th>
                             </tr>
                          </thead>
                          <tbody className="text-[13px] font-medium text-zinc-800">
                             <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                                <td className="py-3 px-4 flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex justify-center items-center font-bold text-[10px]">红</span> 种草小能手_A</td>
                                <td className="py-3 px-4">静默采集数据 / 抓热搜</td>
                                <td className="py-3 px-4"><span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Cookie 有效</span></td>
                                <td className="py-3 px-4 text-right"><button className="text-zinc-500 hover:text-[#685FAB] text-[12px] font-bold">查看</button></td>
                             </tr>
                             <tr className="hover:bg-zinc-50">
                                <td className="py-3 px-4 flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex justify-center items-center font-bold text-[10px]">红</span> 宠物大咖_111</td>
                                <td className="py-3 px-4">发布矩阵池 (项目A区)</td>
                                <td className="py-3 px-4"><span className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">需更新 Cookie</span></td>
                                <td className="py-3 px-4 text-right"><button className="text-zinc-500 hover:text-[#685FAB] text-[12px] font-bold">更新授权</button></td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>

                 {/* 数据回调与 Webhook */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#685FAB]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                       <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Target size={16} className="text-[#685FAB]"/> 数据回传配置 (无视封号机制)</h2>
                       <p className="text-[12px] text-zinc-500 mt-1">配置6位数连接绑定码，桥接中心化数据回收通道获取数据，代替商家的主号cookie被封风险。</p>
                    </div>
                    <div className="p-6 flex flex-col gap-5">
                       <div className="flex gap-4 items-center">
                          <span className="w-28 text-[13px] font-bold text-zinc-700">6位数连接编号</span>
                          <div className="flex-1 flex gap-2">
                             <input type="text" maxLength={6} placeholder="例: 8A9B2C" className="w-32 text-center p-3 border border-zinc-200 rounded-xl text-[14px] tracking-widest bg-zinc-50 font-bold focus:bg-white focus:outline-none focus:border-[#685FAB]" />
                             <span className="text-[12px] text-zinc-500 self-center">输入系统给商家生成的通道连接编号</span>
                          </div>
                          <button className="px-5 py-2.5 bg-[#685FAB] text-white rounded-xl text-[13px] font-bold hover:bg-[#504886] transition-colors shadow-sm">验证与绑定</button>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

const LayersDropIcon = ({className}:{className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 12 12 17 22 12"></polyline>
    <polyline points="2 17 12 22 22 17"></polyline>
  </svg>
)
