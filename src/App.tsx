import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate,
  Bot, TerminalSquare, RotateCw, Home, X, Brain,
  PackagePlus, FileSpreadsheet, FileIcon, Component,
  CheckCircle2, AlertCircle, FileBox, FileQuestion, Flame, Link2,
  CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check,
  Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Config ---
interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
  contextList?: string[];
}

type Workspace = {
  id: string;
  name: string;
  type: 'personal' | 'merchant';
};

type AppTab = {
  id: string;
  name: string;
  isEditing?: boolean;
};

const BRAND = {
  primary: '#605EA7',
  secondary: '#CEC8E2'
};

const SKILLS_MARKET = [
  { id: '1', name: '小红书爆款文案生成器', desc: '支持视觉拆解和情绪价值拉满的文案结构分析', installed: false },
  { id: '2', name: '全域矩阵分发引擎', desc: '一键将生成的素材同步发布到各大自媒体平台', installed: true },
  { id: '3', name: '蓝海词挖掘探针', desc: '深度整合关键词搜索频次及竞争激烈度，日更', installed: false },
];

const AGENTS_LIST = [
  { id: 'a1', name: '笔记流控大师' },
  { id: 'a2', name: '商户大盘私有巡检' }
];

const SHORTCUT_CATEGORIES = [
  { id: 'recommend', name: '推荐', icon: Sparkles },
  { id: 'lead_gen', name: '获客引流', icon: Target },
  { id: 'copywriting', name: '爆款洗稿', icon: PenTool },
  { id: 'distribution', name: '多渠分发', icon: Share2 },
  { id: 'visual', name: '视觉生成', icon: ImageIcon },
  { id: 'analysis', name: '大盘分析', icon: BarChart2 },
];

const SHORTCUT_TASKS: Record<string, string[]> = {
  recommend: [
    "使用 @小红书爆款洗稿网 分析这个竞品链接，提取高转化卖点并生成新话术。",
    "调用 @高转化实拍生成包 将网盘中的单品白底图处理成具有真实网感的探店图。",
    "帮我总结昨日所有矩阵账号的发文完成进度，并列出异常流。",
    "一键执行昨天的剩余任务队列，并通知相关责任人。"
  ],
  lead_gen: [
    "配置一个针对本地生活商家的自动拓客流，包含自动回复与线索收集。",
    "使用 @竞品痛点提取分析 抓取大众点评上的差评，生成差异化引流文案。"
  ],
  copywriting: [
    "调用 @小红书爆款洗稿网，基于当前工作区的爆款参考，批量生成10条探店文案。",
    "将拖入的这篇长图文转化为适合视频口播的短句脚本文案。"
  ],
  distribution: [
    "使用全网矩阵分发引擎，将工作区内最新的 3 个图文包下发至所有主号。",
    "清理失效授权的子达人号，并重新生成绑定邀请链接。"
  ],
  visual: [
    "调用 @高转化实拍生成包 ，把这批生硬的商品渲染图做成胶片风返图。",
    "批量去除视频水印，并添加符合我们账号风格的封面黑字排版。"
  ],
  analysis: [
    "对比分析本周同城探店引流与纯商品分发的获客转化率差异。",
    "输出一份包含所有矩阵号组的健康度与活跃封禁预警报告。"
  ]
};

export default function App() {
  // --- View States ---
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [activeLeftMenu, setActiveLeftMenu] = useState<'cloud'|'server'|'calendar'|'chart'|'users'|'explorer'|'operator_skills'>('explorer');
  const [showBrowser, setShowBrowser] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showSkills, setShowSkills] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // --- Local Component States ---
  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'personal', name: '本机默认资源大盘 (Personal)', type: 'personal' },
    { id: 'm1', name: '杭州万象城店', type: 'merchant' },
    { id: 'm2', name: '上海环球港店', type: 'merchant' },
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('m1');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeShortcutCategory, setActiveShortcutCategory] = useState<string>('recommend');

  // Top App Tabs
  const [appTabs, setAppTabs] = useState<AppTab[]>([
    { id: 't1', name: '日常运营流' },
    { id: 't2', name: '爆款素材提取' },
  ]);
  const [activeAppTabId, setActiveAppTabId] = useState('t1');
  const [tabRenameVal, setTabRenameVal] = useState('');

  const [skillTab, setSkillTab] = useState<'market' | 'installed'>('market');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Chat Input & Context
  const [inputValue, setInputValue] = useState('');
  const [contextItems, setContextItems] = useState<string[]>([]);
  
  // Mention Panels
  const [showMentionMenu, setShowMentionMenu] = useState<'skill' | 'agent' | null>(null);
  const [activeBuilderSkillId, setActiveBuilderSkillId] = useState<string | null>(null);

  // --- Drag & Drop Context ---
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [isDragHoveringChat, setIsDragHoveringChat] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Input Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.endsWith('@')) {
      setShowMentionMenu('skill');
    } else {
      setShowMentionMenu(null);
    }
  };

  const insertMention = (tag: string, prefix: '@') => {
    const formattedStr = `${prefix}${tag}`;
    if (!contextItems.includes(formattedStr)) {
      setContextItems(prev => [...prev, formattedStr]);
    }
    setInputValue(prev => prev.slice(0, -1).trim() + ' '); 
    setShowMentionMenu(null);
  };

  // --- Tab Handlers ---
  const handleTabDoubleClick = (tabId: string, currentName: string) => {
    setTabRenameVal(currentName);
    setAppTabs(prev => prev.map(t => t.id === tabId ? { ...t, isEditing: true } : t));
  };

  const commitTabRename = (tabId: string) => {
    setAppTabs(prev => prev.map(t => t.id === tabId ? { ...t, name: tabRenameVal || t.name, isEditing: false } : t));
  };

  // --- Handlers ---
  const handleAppToggle = (appType: 'explorer' | 'browser' | 'chat' | 'skills') => {
    const states = { explorer: showLeftPanel, browser: showBrowser, chat: showChat, skills: showSkills };
    const activeCount = Object.values(states).filter(Boolean).length;
    if (states[appType] && activeCount === 1) return;

    if (appType === 'explorer') {
       if (!showLeftPanel) {
          setShowLeftPanel(true);
          setActiveLeftMenu('explorer');
       } else if (activeLeftMenu !== 'explorer') {
          setActiveLeftMenu('explorer');
       } else {
          setShowLeftPanel(false);
       }
    }
    else if (appType === 'browser') setShowBrowser(!showBrowser);
    else if (appType === 'chat') setShowChat(!showChat);
    else if (appType === 'skills') {
      setShowSkills(!showSkills);
      if (!showSkills) setShowHistory(false);
    }
  };

  const handleLeftMenuClick = (menu: 'cloud'|'server'|'calendar'|'chart'|'users'|'operator_skills') => {
     if (!showLeftPanel) setShowLeftPanel(true);
     else if (activeLeftMenu === menu) {
        setShowLeftPanel(false);
        return;
     }
     setActiveLeftMenu(menu);
  };

  // Drag handlers
  const handleBrowserDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('source', 'browser');
    e.dataTransfer.setData('value', '笔记: 春季穿搭绝绝子...');
    setIsGlobalDragging(true);
  };

  const handleTreeDragStart = (e: React.DragEvent<HTMLDivElement>, type: string, name: string) => {
    e.stopPropagation();
    e.dataTransfer.setData('source', 'tree');
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('value', name);
    setIsGlobalDragging(true);
  };

  const handleDragEnd = () => {
    setIsGlobalDragging(false);
    setIsDragHoveringChat(false);
  };

  const handleChatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isGlobalDragging) return;
    setIsDragHoveringChat(true);
  };

  const handleChatDragLeave = (e: React.DragEvent) => {
    setIsDragHoveringChat(false);
  };

  const handleChatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHoveringChat(false);
    setIsGlobalDragging(false);
    
    const source = e.dataTransfer.getData('source');
    const value = e.dataTransfer.getData('value');
    const type = e.dataTransfer.getData('type');

    if (value) {
       let formattedStr = '';
       if (source === 'browser') formattedStr = `🔗 ${value}`;
       else if (type === 'Skill' && value.startsWith('@')) formattedStr = value;
       else formattedStr = `📦 [${type}] ${value}`;
       
       if (!contextItems.includes(formattedStr)) {
         setContextItems(prev => [...prev, formattedStr]);
       }
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() && contextItems.length === 0) return;
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: inputValue || '基于已载入的工作上下文执行目标任务',
      contextList: [...contextItems]
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setContextItems([]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'bot',
        role: 'agent',
        content: `已接收当前上下文，正在针对 [${workspaces.find(w => w.id === activeWorkspaceId)?.name}] 隔离空间执行任务流...`
      }]);
    }, 800);
  };

  // Shared Chat Input Component
  const ChatInputArea = ({ isFloat = false }) => (
    <div className={`relative bg-white border ${isFloat ? 'shadow-xl' : 'shadow-sm'} border-zinc-300 rounded-2xl overflow-visible transition-all focus-within:ring-4 focus-within:ring-[#605EA7]/10 focus-within:border-[#605EA7] flex flex-col z-20`}>
      
      <AnimatePresence>
         {showMentionMenu && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full mb-3 left-0 w-[240px] bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden z-50 flex flex-col max-h-[220px]">
               <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100 bg-zinc-50">
                  调用已有 Skill 能力
               </div>
               <div className="overflow-y-auto w-full flex-1 p-1 custom-scrollbar">
                  {SKILLS_MARKET.map(s => (
                    <div key={s.id} onClick={() => insertMention(s.name, '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#605EA7]/10 hover:text-[#605EA7] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                       <Component size={14} />{s.name}
                    </div>
                  ))}
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
        {contextItems.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
            {contextItems.map((ctx, i) => (
               <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#605EA7] text-white border-transparent rounded-md text-[11px] font-bold border relative group whitespace-nowrap">
                 {ctx}
                 <X size={12} className="cursor-pointer ml-1 hover:text-red-300 opacity-60 group-hover:opacity-100 transition-colors" onClick={() => setContextItems(contextItems.filter(c => c !== ctx))} />
               </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <textarea rows={isFloat ? 3 : 2} value={inputValue} onChange={handleInputChange} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="输入 @ 唤起技能，或拖放左侧资料与上方网页至此..." className={`w-full bg-transparent border-none px-4 ${contextItems.length > 0 ? 'pt-2' : 'pt-3'} pb-12 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none resize-none font-sans font-medium`} />
      
      <div className="absolute left-3 bottom-3 flex items-center gap-1">
        <button onClick={() => setShowMentionMenu('skill')} className="p-1.5 text-zinc-400 hover:text-[#605EA7] hover:bg-[#605EA7]/10 rounded-md transition-colors group relative font-bold text-sm" title="添加 Skill">
          @
        </button>               
      </div>
      
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <button onClick={handleSend} disabled={!inputValue.trim() && contextItems.length === 0} className="p-2 rounded-lg text-white disabled:opacity-50 transition-all shadow border flex items-center justify-center bg-[#605EA7] hover:bg-[#4d4a8e] disabled:bg-zinc-200 disabled:shadow-none">
          <ArrowUp size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  let expClass = "w-[280px]";
  if (showLeftPanel && !showBrowser && !showChat && !showSkills) expClass = "flex-1";

  let chatClass = "w-[500px]";
  if (showChat && !showBrowser && (showLeftPanel || showSkills)) chatClass = "flex-1";
  if (showChat && !showBrowser && !showLeftPanel && !showSkills) chatClass = "flex-1";

  let skillsClass = "w-[340px]";
  if (showSkills && !showBrowser && !showChat && !showLeftPanel) skillsClass = "flex-1";

  const [cloudAuthModal, setCloudAuthModal] = useState<'netdisk' | 'feishu' | null>(null);

  const renderLeftPanelContent = () => {
    switch (activeLeftMenu) {
       case 'cloud':
          return (
             <div className="p-4 flex flex-col items-center justify-start h-full text-center relative">
                <div className="flex gap-4 mt-8 mb-6">
                  <div className="w-16 h-16 bg-[#605EA7]/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-[#605EA7]/20 transition-colors shadow-sm" onClick={() => setCloudAuthModal('netdisk')}>
                     <Cloud size={28} className="text-[#605EA7]"/>
                  </div>
                  <div className="w-16 h-16 bg-[#605EA7]/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-[#605EA7]/20 transition-colors shadow-sm" onClick={() => setCloudAuthModal('feishu')}>
                     <FileText size={28} className="text-[#605EA7]"/>
                  </div>
                </div>
                <h3 className="font-bold text-zinc-800 mb-2">云端资产挂载</h3>
                <p className="text-[13px] text-zinc-500 max-w-[200px] leading-relaxed">点击图标绑定您的外部网盘或企业协同文档。</p>
                
                {/* Modals for auth */}
                <AnimatePresence>
                  {cloudAuthModal && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm shadow-xl border-t border-zinc-200 z-10 flex flex-col p-6 items-center">
                      <X size={16} className="absolute top-4 right-4 cursor-pointer text-zinc-400 hover:text-zinc-800" onClick={() => setCloudAuthModal(null)} />
                      {cloudAuthModal === 'netdisk' ? (
                        <div className="flex flex-col items-center mt-6">
                           <div className="w-32 h-32 bg-zinc-100 border border-zinc-200 rounded-xl mb-4 flex items-center justify-center shadow-inner">
                              <span className="text-[10px] text-zinc-400 font-mono">SCAN TO LOGIN</span>
                           </div>
                           <h4 className="font-bold text-[14px]">授权网盘读取权限</h4>
                           <button onClick={() => { alert('绑定成功 (Mock)'); setCloudAuthModal(null); }} className="mt-6 font-bold text-white bg-[#605EA7] hover:bg-[#4d4a8e] px-6 py-2 rounded-lg text-[13px] transition-colors shadow-sm">
                             模拟扫码绑定
                           </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center mt-6 w-full">
                           <h4 className="font-bold text-[14px] mb-4">企业协同文档绑定</h4>
                           <input type="text" placeholder="输入 AppID" className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg text-[12px] mb-3 focus:outline-none focus:border-[#605EA7]" />
                           <input type="password" placeholder="输入 Secret" className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg text-[12px] mb-4 focus:outline-none focus:border-[#605EA7]" />
                           <p className="text-[11px] text-[#605EA7] bg-[#605EA7]/5 p-2 rounded-lg text-left border border-[#605EA7]/20 leading-relaxed">
                             请前往开放平台后台配置回调 URL (https://taptik.com/oauth/callback) 以完成打通。
                           </p>
                           <button onClick={() => { alert('应用连通测试成功 (Mock)'); setCloudAuthModal(null); }} className="mt-4 font-bold text-[#605EA7] bg-[#605EA7]/10 hover:bg-[#605EA7]/20 border border-[#605EA7]/20 w-full py-2 rounded-lg text-[13px] transition-colors shadow-sm">
                             完成打通
                           </button>
                        </div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
             </div>
          );
       case 'server':
          return (
             <div className="flex flex-col h-full bg-[#fafafa]">
                <div className="p-3 border-b border-zinc-200 bg-white flex items-center gap-2">
                   <Server size={14} className="text-[#605EA7]" />
                   <span className="text-[13px] font-bold text-zinc-700">本地挂载: MacHD/Data</span>
                </div>
                <div className="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                   <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-black/5 rounded cursor-pointer group">
                      <FolderOpen size={14} className="text-[#605EA7]/80 group-hover:text-[#605EA7]"/>
                      <span className="text-[12px] font-medium text-zinc-700">小红书视频图集打包</span>
                   </div>
                   <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-black/5 rounded cursor-pointer group pl-6">
                      <FolderOpen size={14} className="text-[#605EA7]/80 group-hover:text-[#605EA7]"/>
                      <span className="text-[12px] font-medium text-zinc-700">10月大促</span>
                   </div>
                   <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-black/5 rounded cursor-pointer group pl-10 border-l border-zinc-200 ml-4 lg">
                      <ImageIcon size={14} className="text-zinc-400 group-hover:text-[#605EA7]"/>
                      <span className="text-[12px] font-medium text-zinc-700">product_shot_01.raw</span>
                   </div>
                   <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-black/5 rounded cursor-pointer group">
                      <FolderOpen size={14} className="text-[#605EA7]/80 group-hover:text-[#605EA7]"/>
                      <span className="text-[12px] font-medium text-zinc-700">PR 剪辑工程文件源</span>
                   </div>
                </div>
             </div>
          );
       case 'calendar':
          return (
             <div className="flex flex-col h-full">
                <div className="p-4 border-b border-zinc-100 bg-white shadow-sm z-10">
                   <h3 className="font-bold text-[14px] text-zinc-800">发文与任务日历</h3>
                   <p className="text-[11px] text-zinc-500 mt-1">11/7 本店任务执行清单</p>
                </div>
                <div className="p-3 flex-1 overflow-y-auto bg-zinc-50/50 flex flex-col gap-3">
                   <div className="bg-white p-3 border border-zinc-200 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-zinc-800">矩阵分发：春季穿搭</span>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">已完成 100%</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1">已成功推送至 14 个挂载点</div>
                   </div>
                   <div className="bg-white p-3 border border-red-200/50 rounded-xl shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
                      <div className="flex items-center justify-between mb-2 pl-2">
                        <span className="text-[12px] font-bold text-zinc-800">直播预热：活动爆款探店</span>
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">未完成 0%</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1 pl-2 mb-3">素材尚缺图文切片...</div>
                      <button className="ml-2 w-[calc(100%-8px)] py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[11px] font-bold transition-colors">
                         一键催发执行
                      </button>
                   </div>
                </div>
             </div>
          );
       case 'chart':
          return (
             <div className="flex flex-col h-full bg-zinc-50">
                <div className="p-4 border-b border-zinc-200 bg-white">
                   <h3 className="font-bold text-[14px] text-zinc-800">多账号体系数据监控</h3>
                </div>
                <div className="p-4 flex flex-col gap-4">
                   <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
                      <div className="text-[11px] font-bold text-zinc-400 mb-1 tracking-wider uppercase">全局阅读量预估 (7日)</div>
                      <div className="text-2xl font-black text-[#605EA7]">14.2W <span className="text-[12px] text-emerald-500 border border-emerald-200 bg-emerald-50 px-1 py-0.5 rounded ml-2">+12%</span></div>
                   </div>
                   <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
                      <div className="text-[11px] font-bold text-zinc-400 mb-3 tracking-wider uppercase">各平台流量占比</div>
                      <div className="flex h-4 rounded-full overflow-hidden mb-2">
                         <div className="w-[60%] bg-[#605EA7]"></div>
                         <div className="w-[30%] bg-[#CEC8E2]"></div>
                         <div className="w-[10%] bg-zinc-200"></div>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold text-zinc-500">
                         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#605EA7]"></div> 体系主号</div>
                         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#CEC8E2]"></div> 达人矩阵</div>
                      </div>
                   </div>
                </div>
             </div>
          );
       case 'users':
          return (
             <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b border-zinc-100 shadow-sm z-10 flex items-center justify-between">
                   <h3 className="font-bold text-[14px] text-zinc-800">矩阵账号健康组</h3>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar flex flex-col gap-2">
                   {['主店官方蓝V', '穿搭达人小号', '同城探店导流_01', '同城探店导流_02'].map((name, i) => {
                     const isBad = i === 2;
                     return (
                        <div key={name} className="flex items-center justify-between p-3 border border-zinc-100 rounded-lg hover:border-[#605EA7]/30 transition-colors cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                 <Users size={14} className="text-zinc-400 group-hover:text-[#605EA7]" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[12px] font-bold text-zinc-800 group-hover:text-[#605EA7] transition-colors">{name}</span>
                                 <span className="text-[10px] text-zinc-500 mt-0.5">设备: {isBad ? '被风控脱机' : '在线稳跑'}</span>
                              </div>
                           </div>
                           {isBad ? (
                              <div className="w-2 h-2 rounded-full bg-red-400 ring-2 ring-red-100" title="限流/异常"></div>
                           ) : (
                              <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-100" title="健康在线"></div>
                           )}
                        </div>
                     );
                   })}
                </div>
             </div>
          );
       case 'operator_skills':
          return (
             <div className="flex flex-col h-full bg-zinc-50 relative z-20">
                <div className="p-4 border-b border-zinc-200 bg-white flex flex-col gap-3 z-10 shadow-sm">
                   <h3 className="font-bold text-[14px] text-zinc-800">技能目录仓库</h3>
                   <button onClick={() => setActiveBuilderSkillId('new')} className="w-full bg-[#605EA7] text-white py-2 rounded-lg font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#4d4a8e] shadow-sm transition-colors">
                      <Plus size={14}/> 新建自动化技能
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar flex flex-col gap-4">
                   
                   <div>
                     <div className="text-[10px] font-black text-zinc-400 px-2 py-1 mb-1">视觉类 (VISION)</div>
                     <div onClick={() => setActiveBuilderSkillId('skill_1')} className={`flex items-center gap-2 px-2 py-2 mx-1 rounded-md cursor-pointer text-[12px] font-medium transition-colors ${activeBuilderSkillId === 'skill_1' ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-700 hover:bg-[#605EA7]/5'}`}>
                        <ImageIcon size={14} className={activeBuilderSkillId === 'skill_1' ? 'text-[#605EA7]' : 'text-zinc-400'}/> 高转化实拍生成包
                     </div>
                   </div>

                   <div>
                     <div className="text-[10px] font-black text-zinc-400 px-2 py-1 mb-1">文案类 (COPYWRITING)</div>
                     <div onClick={() => setActiveBuilderSkillId('skill_2')} className={`flex items-center gap-2 px-2 py-2 mx-1 rounded-md cursor-pointer text-[12px] font-medium transition-colors ${activeBuilderSkillId === 'skill_2' ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-700 hover:bg-[#605EA7]/5'}`}>
                        <FileText size={14} className={activeBuilderSkillId === 'skill_2' ? 'text-[#605EA7]' : 'text-zinc-400'}/> 小红书爆款洗稿网
                     </div>
                   </div>

                   <div>
                     <div className="text-[10px] font-black text-zinc-400 px-2 py-1 mb-1">策略类 (STRATEGY)</div>
                     <div onClick={() => setActiveBuilderSkillId('skill_3')} className={`flex items-center gap-2 px-2 py-2 mx-1 rounded-md cursor-pointer text-[12px] font-medium transition-colors ${activeBuilderSkillId === 'skill_3' ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-700 hover:bg-[#605EA7]/5'}`}>
                        <Lightbulb size={14} className={activeBuilderSkillId === 'skill_3' ? 'text-[#605EA7]' : 'text-zinc-400'}/> 竞品痛点提取分析
                     </div>
                   </div>

                </div>
             </div>
          );
       case 'explorer':
       default:
          return (
             <div className="flex flex-col h-full">
                <div className="p-2 border-b border-zinc-100 flex gap-2 shrink-0">
                   <div className="flex-1 bg-zinc-100 rounded-lg flex items-center px-2 py-1.5 border border-transparent focus-within:border-[#605EA7] focus-within:bg-white transition-colors">
                     <Search size={14} className="text-zinc-400 shrink-0" />
                     <input type="text" placeholder="全局搜索当前空间资产..." className="bg-transparent border-none outline-none w-full ml-2 text-[13px] font-medium text-zinc-700" />
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto px-1 py-3 custom-scrollbar user-select-none">
                   {workspaces.find(w => w.id === activeWorkspaceId)?.type === 'merchant' ? (
                     <>
                        <div className="text-[10px] font-black text-zinc-400 px-3 py-1 flex items-center justify-between group select-none">
                           <span>运营工作流与自动任务 (TASKS)</span>
                           <Plus size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-800 transition-opacity"/>
                        </div>
                        <div draggable onDragStart={(e) => handleTreeDragStart(e, 'Task', '今日分发动作')} className="flex items-center gap-2 px-3 py-1.5 mx-1 hover:bg-[#605EA7]/5 rounded-md cursor-grab active:cursor-grabbing text-[13px] font-medium text-zinc-700 select-none group">
                           <Workflow size={14} className="text-[#605EA7] opacity-80 group-hover:opacity-100" /> 自动生成群发钩子
                        </div>

                        <div className="text-[10px] font-black text-zinc-400 px-3 py-1 mt-4 flex items-center justify-between group select-none">
                           <span>专属商家知识包 (RAG)</span>
                           <Plus size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-800 transition-opacity"/>
                        </div>
                        <div draggable onDragStart={(e) => handleTreeDragStart(e, 'RAG', '酒店标准话术.rag')} className="flex items-center gap-2 px-3 py-1.5 mx-1 hover:bg-[#605EA7]/5 rounded-md cursor-grab active:cursor-grabbing text-[13px] font-medium text-zinc-700 select-none group">
                           <Database size={14} className="text-[#605EA7] opacity-80 group-hover:opacity-100" /> 本店私域客服QA合集.rag
                        </div>

                        <div className="text-[10px] font-black text-zinc-400 px-3 py-1 mt-4 flex items-center justify-between group select-none">
                           <span>资产与图库引擎 (FOLDERS)</span>
                           <Plus size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-800 transition-opacity"/>
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <div draggable onDragStart={(e) => handleTreeDragStart(e, 'Folder', '活动原图分类库')} className="flex items-center justify-between px-3 py-1.5 mx-1 hover:bg-[#605EA7]/5 rounded-md cursor-grab active:cursor-grabbing text-[13px] font-bold text-zinc-700 select-none group">
                              <div className="flex items-center gap-2">
                                 <FolderOpen size={14} className="text-[#605EA7] opacity-80 group-hover:opacity-100" /> 当前主推大促物料
                              </div>
                              <ChevronDown size={14} className="text-zinc-300" />
                           </div>
                           <div draggable onDragStart={(e) => handleTreeDragStart(e, 'File', '海报底图A.jpg')} className="flex items-center gap-2 pl-7 pr-3 py-1.5 mx-1 hover:bg-[#605EA7]/5 rounded-md cursor-grab active:cursor-grabbing text-[13px] font-medium text-zinc-600 select-none border-l-2 border-[#605EA7]/20 ml-4 group transition-colors">
                              <ImageIcon size={14} className="text-[#605EA7] opacity-80 group-hover:opacity-100" /> 高转转化底图A.jpg
                           </div>
                        </div>

                        <div className="text-[10px] font-black text-zinc-400 px-3 py-1 mt-4 flex items-center justify-between group select-none">
                           <span>预配自动化技能 (SKILLS)</span>
                           <Plus size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-800 transition-opacity"/>
                        </div>
                        <div draggable onDragStart={(e) => handleTreeDragStart(e, 'Skill', '全网矩阵分发引擎')} className="flex items-center gap-2 px-3 py-1.5 mx-1 hover:bg-[#605EA7]/5 rounded-md cursor-grab active:cursor-grabbing text-[13px] font-medium text-zinc-700 select-none group">
                           <Component size={14} className="text-[#605EA7] opacity-80 group-hover:opacity-100" /> 多平台快速分发流
                        </div>
                     </>
                   ) : (
                     <div draggable onDragStart={(e) => handleTreeDragStart(e, 'File', '通用全局规范.pdf')} className="flex items-center gap-2 px-3 py-1.5 mx-1 hover:bg-[#605EA7]/5 rounded-md cursor-grab active:cursor-grabbing select-none group">
                        <FileIcon size={14} className="text-[#605EA7] opacity-80 group-hover:opacity-100"/>
                        <div className="text-[13px] font-medium text-zinc-700">全体通用指引指南.pdf</div>
                     </div>
                   )}
                </div>
             </div>
          );
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-zinc-50 font-sans text-zinc-900 overflow-hidden relative">
      {/* Top Navbar */}
      <div className="flex-none h-[52px] bg-white flex items-end justify-between px-2 z-[60] shrink-0 border-b border-zinc-200/80 shadow-sm relative">
        <div className="flex flex-row items-center gap-3 pb-2 px-2 relative z-10 w-[260px] shrink-0">
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-8 h-8 rounded-xl bg-[#605EA7] flex items-center justify-center text-white font-bold text-sm shadow-md hover:bg-[#4d4a8e] transition-colors relative z-10 cursor-pointer">
              W
            </button>
            <AnimatePresence>
               {showProfileMenu && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                   <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-10 left-0 w-48 bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-zinc-100 font-bold text-zinc-800 text-[13px]">
                        操作手主账号 (sheaw)
                      </div>
                      <div className="py-1">
                        <div className="px-4 py-2 text-[13px] text-zinc-700 hover:bg-[#605EA7]/5 hover:text-[#605EA7] cursor-pointer font-medium transition-colors">个人信息</div>
                        <div className="px-4 py-2 text-[13px] text-zinc-700 hover:bg-[#605EA7]/5 hover:text-[#605EA7] cursor-pointer font-medium transition-colors">管理商家</div>
                        <div className="px-4 py-2 text-[13px] text-zinc-700 hover:bg-[#605EA7]/5 hover:text-[#605EA7] cursor-pointer font-medium transition-colors">我的积分 (1024)</div>
                        <div className="px-4 py-2 text-[13px] text-zinc-700 hover:bg-[#605EA7]/5 hover:text-[#605EA7] cursor-pointer font-medium transition-colors">系统设置</div>
                      </div>
                   </motion.div>
                 </>
               )}
            </AnimatePresence>
          </div>
          <div className="relative">
             <button onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold text-zinc-800 hover:bg-[#605EA7]/5 transition-colors group">
               <span className="truncate max-w-[150px]">{workspaces.find(w => w.id === activeWorkspaceId)?.name}</span> 
               <ChevronDown size={14} className="text-zinc-400 group-hover:text-[#605EA7] transition-colors"/>
             </button>
             <AnimatePresence>
                {showWorkspaceMenu && (
                   <>
                     <div className="fixed inset-0 z-40" onClick={() => setShowWorkspaceMenu(false)}></div>
                     <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-10 left-0 w-64 bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden">
                        <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 bg-zinc-50 border-b border-zinc-100">切换工作空间</div>
                        {workspaces.map(w => (
                           <div key={w.id} onClick={() => { setActiveWorkspaceId(w.id); setShowWorkspaceMenu(false); }} className={`px-4 py-3 text-[13px] font-bold cursor-pointer transition-colors flex items-center justify-between border-b border-zinc-50 last:border-none ${w.id === activeWorkspaceId ? 'bg-[#605EA7]/5 text-[#605EA7]' : 'text-zinc-700 hover:bg-zinc-50 hover:text-[#605EA7]'}`}>
                              {w.name}
                              {w.id === activeWorkspaceId && <Check size={14} />}
                           </div>
                        ))}
                        <div className="border-t border-zinc-100 pt-1 pb-1">
                           <div onClick={() => {
                              const newId = 'w_' + Date.now();
                              setWorkspaces([...workspaces, { id: newId, name: `新增商户组织 ${Math.floor(Math.random()*1000)}`, type: 'merchant' }]);
                              setActiveWorkspaceId(newId);
                              setShowWorkspaceMenu(false);
                           }} className="px-4 py-3 text-[12px] font-bold text-[#605EA7] flex items-center gap-2 hover:bg-[#605EA7]/10 cursor-pointer transition-colors">
                              <Plus size={14}/> 新建工作空间
                           </div>
                        </div>
                     </motion.div>
                   </>
                )}
             </AnimatePresence>
          </div>
        </div>
        
        <div className="flex-1 flex px-4">
          <div className="flex w-full items-end gap-1 overflow-x-auto no-scrollbar relative min-h-[38px]">
             {appTabs.map(t => (
                <div key={t.id} onDoubleClick={() => handleTabDoubleClick(t.id, t.name)} onClick={() => setActiveAppTabId(t.id)} className={`group px-4 py-2 flex items-center min-w-28 text-sm font-bold cursor-pointer rounded-t-xl transition-colors relative z-10 select-none border-t border-x overflow-hidden ${activeAppTabId === t.id ? `bg-zinc-50 text-[${BRAND.primary}] border-zinc-200/80 shadow-sm pb-2.5 mb-[-1px]` : 'text-zinc-500 bg-transparent border-transparent hover:bg-zinc-100/50'}`}>
                   {t.isEditing ? (
                      <input autoFocus className="bg-transparent border-none outline-none w-full text-zinc-900 min-w-20" value={tabRenameVal} onChange={e=>setTabRenameVal(e.target.value)} onBlur={()=>commitTabRename(t.id)} onKeyDown={e => e.key === 'Enter' && commitTabRename(t.id)} />
                   ) : (
                      <>
                        <span className="flex-1 truncate text-center px-1 pr-4">{t.name}</span>
                        {activeAppTabId === t.id && <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-zinc-50 z-20"></span>}
                        <X size={14} className={`absolute right-3 ${activeAppTabId === t.id ? 'opacity-50 hover:opacity-100 text-[#605EA7]' : 'opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:text-zinc-800'} transition-opacity`} onClick={(e) => { e.stopPropagation(); if(appTabs.length > 1) { const newTabs = appTabs.filter(tab => tab.id !== t.id); setAppTabs(newTabs); if(activeAppTabId === t.id) setActiveAppTabId(newTabs[0].id); } }}/>
                      </>
                   )}
                </div>
             ))}
             <button onClick={() => { const n = { id: Date.now().toString(), name: '新任务流' }; setAppTabs([...appTabs, n]); setActiveAppTabId(n.id); }} className="p-2 ml-1 text-[#605EA7] hover:bg-[#605EA7]/10 mb-1 rounded-lg transition-colors shrink-0" title="新建工作流"><Plus size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pb-2 px-2 relative z-10 shrink-0">
           {/* History Popup */}
           <div className="relative">
             <button onClick={() => { setShowHistory(!showHistory); setShowSkills(false); }} className={`p-1.5 rounded-md transition-all font-bold ${showHistory ? 'bg-[#605EA7] text-white shadow-md' : 'text-zinc-500 hover:text-[#605EA7] hover:bg-[#605EA7]/10'}`} title="展现历史对话">
               <History size={18} />
             </button>
             <AnimatePresence>
               {showHistory && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-12 right-0 w-80 bg-white border border-zinc-200 shadow-2xl rounded-2xl flex flex-col z-[100] overflow-hidden">
                   <div className="p-4 border-b border-zinc-100 font-bold flex justify-between items-center text-zinc-800">
                     <span>会话与运行历史</span>
                     <X size={16} className="cursor-pointer text-zinc-400 hover:text-[#605EA7]" onClick={() => setShowHistory(false)}/>
                   </div>
                   <div className="p-2 max-h-96 overflow-y-auto">
                     {[1,2,3].map(i => (
                       <div key={i} className="p-3 hover:bg-[#605EA7]/5 rounded-xl cursor-pointer transition-colors mb-1 group">
                         <div className="font-bold text-[13px] text-zinc-800 group-hover:text-[#605EA7] mb-1 transition-colors">自动归档：素材提取与重置动作...</div>
                         <div className="text-[11px] text-zinc-400 font-medium">{i} 小时前</div>
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           <div className="w-px h-4 bg-zinc-300 mx-1"></div>

           <button onClick={() => handleAppToggle('explorer')} className={`p-1.5 rounded-md transition-all font-bold ${showLeftPanel ? `bg-[#605EA7]/10 text-[${BRAND.primary}] shadow-sm border border-[#605EA7]/20` : 'text-zinc-500 hover:text-[#605EA7] hover:bg-[#605EA7]/10'}`} title="全局资源主控板">
            <FolderOpen size={18} />
           </button>
           <button onClick={() => handleAppToggle('browser')} className={`p-1.5 rounded-md transition-all font-bold ${showBrowser ? `bg-[#605EA7]/10 text-[${BRAND.primary}] shadow-sm border border-[#605EA7]/20` : 'text-zinc-500 hover:text-[#605EA7] hover:bg-[#605EA7]/10'}`} title="内置目标浏览器">
            <Compass size={18} />
           </button>
           <button onClick={() => handleAppToggle('chat')} className={`p-1.5 rounded-md transition-all font-bold ${showChat ? `bg-[#605EA7]/10 text-[${BRAND.primary}] shadow-sm border border-[#605EA7]/20` : 'text-zinc-500 hover:text-[#605EA7] hover:bg-[#605EA7]/10'}`} title="流控制作组">
            <MessageSquare size={18} />
           </button>
           <div className="w-px h-4 bg-zinc-300 mx-1"></div>
           <button onClick={() => handleAppToggle('skills')} className={`p-1.5 rounded-md transition-all font-bold ${showSkills ? `bg-[${BRAND.primary}] text-white shadow-md` : 'text-zinc-500 hover:text-[#605EA7] hover:bg-[#605EA7]/10'}`} title="全局独立技能资产库">
            <Component size={18} />
           </button>
        </div>
      </div>

      <div className="w-full h-px z-50 relative" style={{ backgroundColor: BRAND.primary }}></div>

      <div className="flex-1 flex min-h-0 bg-zinc-100/50 relative">
        {/* Far Left Shortcut Bar */}
        <motion.div layout animate={{ width: isSidebarExpanded ? 160 : 48 }} className="bg-white border-r border-zinc-200 flex flex-col py-1 gap-1 shrink-0 z-20 shadow-sm overflow-hidden">
           <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="w-full h-10 flex items-center px-1 text-zinc-400 hover:text-[#605EA7] hover:bg-[#605EA7]/5 transition-colors justify-start group">
             <div className="w-10 shrink-0 flex justify-center text-zinc-400 group-hover:text-[#605EA7] transition-transform">
               {isSidebarExpanded ? <PanelLeftClose size={16}/> : <PanelRightClose size={16}/>}
             </div>
             {isSidebarExpanded && <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap opacity-100 ml-1">快速收起</span>}
           </button>
           <div className="h-px bg-zinc-200 mx-2 my-1"></div>
           
           <button onClick={() => handleLeftMenuClick('cloud')} className={`h-10 flex items-center justify-start rounded-lg mx-1 transition-colors group ${activeLeftMenu === 'cloud' && showLeftPanel ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-500 hover:bg-[#605EA7]/5 hover:text-[#605EA7]'}`} title="远程云盘资产同步">
              <div className="w-10 shrink-0 flex justify-center"><Cloud size={18} /></div>
              {isSidebarExpanded && <span className="text-[13px] font-bold whitespace-nowrap">远程资产云盘</span>}
           </button>
           <button onClick={() => handleLeftMenuClick('server')} className={`h-10 flex items-center justify-start rounded-lg mx-1 transition-colors group ${activeLeftMenu === 'server' && showLeftPanel ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-500 hover:bg-[#605EA7]/5 hover:text-[#605EA7]'}`} title="本地挂载盘">
              <div className="w-10 shrink-0 flex justify-center"><Server size={18} /></div>
              {isSidebarExpanded && <span className="text-[13px] font-bold whitespace-nowrap">本地挂载硬盘</span>}
           </button>
           
           <div className="h-px bg-zinc-200 mx-2 my-2"></div>

           <button onClick={() => handleLeftMenuClick('calendar')} className={`h-10 flex items-center justify-start rounded-lg mx-1 transition-colors group ${activeLeftMenu === 'calendar' && showLeftPanel ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-500 hover:bg-[#605EA7]/5 hover:text-[#605EA7]'}`} title="发文组日历计划">
             <div className="w-10 shrink-0 flex justify-center"><CalendarDays size={18} /></div>
             {isSidebarExpanded && <span className="text-[13px] font-bold whitespace-nowrap">发文排期日历</span>}
           </button>
           <button onClick={() => handleLeftMenuClick('chart')} className={`h-10 flex items-center justify-start rounded-lg mx-1 transition-colors group ${activeLeftMenu === 'chart' && showLeftPanel ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-500 hover:bg-[#605EA7]/5 hover:text-[#605EA7]'}`} title="大盘数据中心">
             <div className="w-10 shrink-0 flex justify-center"><LineChart size={18} /></div>
             {isSidebarExpanded && <span className="text-[13px] font-bold whitespace-nowrap">大盘监控中心</span>}
           </button>
           <button onClick={() => handleLeftMenuClick('users')} className={`h-10 flex items-center justify-start rounded-lg mx-1 transition-colors group ${activeLeftMenu === 'users' && showLeftPanel ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-500 hover:bg-[#605EA7]/5 hover:text-[#605EA7]'}`} title="达人矩阵管理">
             <div className="w-10 shrink-0 flex justify-center"><Users size={18} /></div>
             {isSidebarExpanded && <span className="text-[13px] font-bold whitespace-nowrap">自持达人与矩阵</span>}
           </button>
           
           <div className="h-px bg-zinc-200 mx-2 my-2"></div>
           
           <button onClick={() => handleLeftMenuClick('operator_skills')} className={`h-10 flex items-center justify-start rounded-lg mx-1 transition-colors group ${activeLeftMenu === 'operator_skills' && showLeftPanel ? 'bg-[#605EA7]/10 text-[#605EA7]' : 'text-zinc-500 hover:bg-[#605EA7]/5 hover:text-[#605EA7]'}`} title="操盘手技能库">
             <div className="w-10 shrink-0 flex justify-center"><LayoutTemplate size={18} /></div>
             {isSidebarExpanded && <span className="text-[13px] font-bold whitespace-nowrap">操盘手技能库</span>}
           </button>
        </motion.div>

        {/* 1. Left Panel Component (Explorer or other views) */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div 
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: expClass === 'flex-1' ? 'auto' : 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`bg-white border-r border-zinc-200 flex flex-col shrink-0 relative transition-all z-10 ${expClass}`}
            >
              {renderLeftPanelContent()}
            </motion.div>
          )}
        </AnimatePresence>

         {/* Main Workspace Overrides */}
         {(activeLeftMenu === 'operator_skills' && activeBuilderSkillId !== null) ? (
            <div className="flex-1 flex overflow-hidden bg-zinc-50 relative z-20">
               {/* Middle: Copilot Chat */}
               <div className="w-[400px] border-r border-zinc-200 bg-white flex flex-col shrink-0">
                  <div className="h-[46px] flex items-center px-4 border-b border-zinc-100 bg-zinc-50 shrink-0">
                     <Bot size={16} className="text-[#605EA7] mr-2"/>
                     <span className="font-bold text-zinc-800 text-[13px]">Skill Builder Agent</span>
  					 <span className="ml-auto text-[10px] text-zinc-400 bg-zinc-200 px-2 py-0.5 rounded font-mono">v1.2</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                     <div className="flex items-start gap-2 max-w-[90%]">
                        <div className="w-6 h-6 rounded-md bg-[#605EA7] flex items-center justify-center shrink-0 shadow-sm"><Bot size={12} className="text-white"/></div>
                        <div className="bg-zinc-100 px-3 py-2 rounded-xl rounded-tl-sm text-[12px] text-zinc-700 leading-relaxed">
                           你好，我是协助你编排自动化流的专属助手。你想创建什么类型的技能？请描述一下核心流程。
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-1 max-w-[90%] self-end">
                        <div className="bg-[#18181b] text-white px-3 py-2 rounded-xl rounded-tr-sm text-[12px] shadow-sm leading-relaxed">
                           帮我建个批量清洗竞品文案的提取流。
                        </div>
                     </div>
                     <div className="flex items-start gap-2 max-w-[90%]">
                        <div className="w-6 h-6 rounded-md bg-[#605EA7] flex items-center justify-center shrink-0 shadow-sm"><Bot size={12} className="text-white"/></div>
                        <div className="bg-zinc-100 px-3 py-2 rounded-xl rounded-tl-sm text-[12px] text-zinc-700 leading-relaxed shadow-sm ring-1 ring-zinc-200">
                           好的，正在为您在右侧工作区生技能白盒规格书。请查看骨架并随时提出微调要求。
                        </div>
                     </div>
                  </div>
                  <div className="p-3 border-t border-zinc-100 bg-white shrink-0">
                     <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 flex items-center shadow-sm focus-within:border-[#605EA7]/40 focus-within:bg-white transition-colors">
                        <input type="text" placeholder="提出修改意见或增加参数约束..." className="flex-1 bg-transparent border-none outline-none text-[12px] text-zinc-800" />
                        <button className="text-[#605EA7] hover:bg-[#605EA7]/10 p-1.5 rounded-lg transition-colors ml-1"><Send size={14}/></button>
                     </div>
                  </div>
               </div>

               {/* Right: Dynamic Canvas (Skill Spec & Sandbox) */}
               <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                  <div className="max-w-[700px] mx-auto">
                     <div className="mb-8">
                       <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
                         小红书洗稿提取流
                         <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-bold ml-2 -translate-y-1">编辑中 Draft</span>
                       </h2>
                       <p className="text-[13px] text-zinc-500 mt-2 font-medium">依据系统解析，您正在编辑该技能的执行标准。您可以在此处修改白盒配置，或通过左侧助手进行自然语言更新。</p>
                     </div>

                     <div className="space-y-6 mb-12">
                        {/* 1. Trigger */}
                        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                           <h4 className="text-[13px] font-bold text-zinc-800 mb-4 flex items-center gap-2"><Zap size={14} className="text-[#605EA7]"/> 触发器与路由层 (Trigger)</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-[11px] font-bold text-zinc-500 mb-1">行业与标签</label>
                                 <input type="text" defaultValue="通用, 洗稿, 矩阵分发" readOnly className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg text-[12px] text-zinc-700 outline-none" />
                              </div>
                              <div>
                                 <label className="block text-[11px] font-bold text-zinc-500 mb-1">交互快捷唤醒</label>
                                 <input type="text" defaultValue="@竞品洗稿" readOnly className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg text-[12px] text-zinc-700 font-mono outline-none" />
                              </div>
                           </div>
                        </div>

                        {/* 2. Prompt & Constraints */}
                        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-[#605EA7]/5 rounded-bl-full -z-10"></div>
                           <h4 className="text-[13px] font-bold text-zinc-800 mb-4 flex items-center gap-2"><TerminalSquare size={14} className="text-[#605EA7]"/> 执行动作与白盒规则 (Rules)</h4>
                           <div className="space-y-3">
                              <div>
                                 <label className="block text-[11px] font-bold text-zinc-500 mb-1">结构化指令 System Prompt</label>
                                 <textarea rows={4} defaultValue="你是一个资深的内容操盘手。你需要将用户提供的原文案打碎，提取其痛点、卖点、情绪价值点，并使用全新的句式和案例进行洗稿输出。要求：禁止使用“总而言之”等AI特征词；必须保留原文的核心转化逻辑段。" className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg text-[12px] text-zinc-700 font-mono resize-none focus:bg-white focus:border-[#605EA7]/50 focus:ring-1 focus:ring-[#605EA7]/20 outline-none transition-colors" />
                              </div>
                              <div>
                                 <label className="block text-[11px] font-bold text-zinc-500 mb-1">强制约束红线 Redlines</label>
                                 <div className="flex gap-2">
                                    <input type="text" defaultValue="字数限 300内，带 emoji，首图要有视觉冲击" className="flex-1 bg-red-50/50 border border-red-200 px-3 py-2 rounded-lg text-[12px] text-red-700 outline-none focus:bg-white" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Sandbox / Dry Run Area */}
                     <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-5 shadow-inner">
                        <h4 className="text-[14px] font-black text-zinc-800 mb-4 flex items-center gap-2"><FlaskConical size={16} className="text-[#605EA7]"/> 沙盘模拟测试 (Dry Run)</h4>
                        <div className="flex flex-col gap-4">
                           <textarea rows={3} placeholder="拖拽或粘贴测试用例样本至此 （例如一篇真实的竞品笔记）..." className="w-full bg-white border border-zinc-300 px-4 py-3 rounded-xl text-[13px] text-zinc-800 resize-none focus:border-[#605EA7] outline-none shadow-sm"></textarea>
                           <button className="self-end bg-[#18181b] hover:bg-[#605EA7] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold transition-colors shadow-sm flex items-center gap-1.5">
                              <Play size={14} className="fill-current text-white/80" /> 开始执行模拟
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
           <>
             {/* 2. Center View (Browser) */}
             <AnimatePresence>
               {showBrowser && (
                 <motion.div layout className="flex-1 flex flex-col min-w-0 relative z-10 bg-white shadow-[-1px_0_12px_rgba(0,0,0,0.01)] border-r border-zinc-200/50">
                   {/* ... browser code ... */}
              <div className="h-[46px] bg-zinc-100 flex items-center px-4 gap-4 border-b border-zinc-200">
                <div className="flex gap-4">
                  <ChevronLeft size={16} className="text-zinc-500 cursor-pointer hover:text-[#605EA7]" />
                  <ChevronRight size={16} className="text-zinc-300 cursor-not-allowed" />
                  <RotateCw size={14} className="text-zinc-500 cursor-pointer hover:text-[#605EA7]" />
                </div>
                <div className="flex-1 bg-white border border-zinc-200/80 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm focus-within:border-[#605EA7]/50 focus-within:ring-2 focus-within:ring-[#605EA7]/10 transition-colors">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <input type="text" readOnly value="https://www.xiaohongshu.com/explore/12345abcdef" className="text-[12px] bg-transparent flex-1 outline-none text-zinc-600 font-medium font-mono" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#fafafa] flex justify-center p-8 custom-scrollbar">
                 <div className="w-[100%] max-w-[500px] flex flex-col bg-white rounded-2xl shadow-sm border border-zinc-200/60 overflow-hidden h-fit relative group">
                    <div className="absolute top-3 right-3 text-white/50 group-hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-md cursor-grab z-10 shadow-sm"><ImageIcon size={18} /></div>
                    <div draggable onDragStart={handleBrowserDragStart} onDragEnd={handleDragEnd} className="w-full aspect-[3/4] relative group/img cursor-grab active:cursor-grabbing bg-zinc-100">
                       <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover pointer-events-none" alt="Red Sneaker" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 shadow-inner backdrop-blur-[2px] pointer-events-none">
                          <Compass size={48} className="mb-4 drop-shadow-md text-white/90" />
                          <h3 className="font-bold text-lg mb-2">拖拽我至指令台</h3>
                          <p className="text-xs text-white/80 text-center leading-relaxed">提供当前浏览记录给工作流</p>
                       </div>
                    </div>
                    <div className="p-5 relative">
                       <h2 className="text-lg font-bold text-zinc-900 mb-2 leading-tight">绝美神仙穿搭🔥最新必入</h2>
                       <p className="text-sm text-zinc-600 mb-4 leading-relaxed font-medium">真的太神仙了家人们，刚拿到新款忍不住安利！</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Right View (Chat Panel) */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
               layout
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: chatClass === 'flex-1' ? 'auto' : 500, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               className={`bg-white border-l border-zinc-200 flex flex-col shrink-0 relative z-30 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden ${chatClass}`}
            >
              <AnimatePresence>
                {isGlobalDragging && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onDragOver={handleChatDragOver} onDragLeave={handleChatDragLeave} onDrop={handleChatDrop}
                    className={`absolute inset-0 z-50 flex items-center justify-center m-4 rounded-3xl border-4 transition-colors backdrop-blur-[2px] ${isDragHoveringChat ? `border-[#605EA7] bg-[#605EA7]/5` : `border-dashed border-[#605EA7]/50 bg-[#605EA7]/5`}`}
                  >
                     <div className="flex flex-col items-center justify-center p-8 bg-white/90 rounded-2xl shadow-xl pointer-events-none transform transform-gpu border border-white">
                        {isDragHoveringChat ? <ArrowUp size={48} className="text-[#605EA7] mb-4 animate-bounce" /> : <LayersDropIcon className={`mb-4 w-12 h-12 text-[#605EA7]`} />}
                        <h2 className={`text-xl font-black text-[#605EA7]`}>
                           {isDragHoveringChat ? '松开以装载资产' : '放置以注入上下文'}
                        </h2>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-[46px] px-3 border-b border-zinc-200 shrink-0 flex items-center justify-between bg-zinc-50 relative z-10">
                <span className="font-bold text-[13px] text-[#605EA7] font-mono tracking-tight flex items-center gap-2">
                  <Flame size={14} /> TapTik 工作流控制台
                </span>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded bg-white border border-zinc-200 text-[#605EA7] hover:bg-[#605EA7]/5 shadow-sm flex items-center justify-center transition-colors group relative" title="整理为技能"><PackagePlus size={14}/></button>
                  <button onClick={() => {setMessages([]); setContextItems([]);}} className="p-1.5 rounded bg-white border border-zinc-200 text-zinc-500 hover:bg-[#605EA7]/5 shadow-sm flex items-center justify-center transition-colors hover:text-[#605EA7] group relative" title="清空聊天"><RotateCw size={14}/></button>
                </div>
              </div>

              {messages.length === 0 ? (
                 <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-12 custom-scrollbar bg-white flex flex-col justify-center min-h-0">
                    <div className="max-w-[800px] mx-auto w-full">
                      <div className="mb-8">
                         <div className="w-12 h-12 rounded-2xl bg-[#605EA7] flex items-center justify-center text-white mb-6 shadow-lg shadow-[#605EA7]/20 border border-[#605EA7]">
                           <Sparkles size={24} />
                         </div>
                         <h1 className="text-[20px] font-black text-zinc-900 mb-2">早上好，sheaw</h1>
                         <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">你可以直接开始，或@选择一个技能完成特定任务。</p>
                      </div>
                      <div className="mb-6 w-full">
                        <ChatInputArea isFloat={true} />
                      </div>

                      <div className="flex flex-col gap-4 mt-8">
                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                          {SHORTCUT_CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            return (
                              <button 
                                key={cat.id} 
                                onClick={() => setActiveShortcutCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors border flex items-center justify-center gap-1.5 ${
                                  activeShortcutCategory === cat.id 
                                    ? 'bg-[#18181b] text-white border-[#18181b] shadow-md' 
                                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 group'
                                }`}
                              >
                                <Icon size={14} className={activeShortcutCategory === cat.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-600 transition-colors'} />
                                {cat.name}
                              </button>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {SHORTCUT_TASKS[activeShortcutCategory]?.map((task, i) => (
                             <button 
                               key={i}
                               onClick={() => {
                                 setInputValue(task);
                               }}
                               className="text-left px-5 py-4 bg-white border border-zinc-200 hover:border-[#605EA7]/40 hover:bg-[#605EA7]/5 hover:shadow-sm rounded-2xl text-[13px] text-zinc-700 transition-all font-medium leading-relaxed"
                             >
                               {task}
                             </button>
                          ))}
                        </div>
                      </div>
                    </div>
                 </div>
              ) : (
                 <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-50/50">
                       {messages.map((msg, idx) => (
                         <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                           {msg.role === 'user' ? (
                             <div className="flex flex-col items-end max-w-[90%]">
                                {msg.contextList && msg.contextList.length > 0 && (
                                   <div className="mb-2 bg-[#605EA7]/5 border border-[#605EA7]/20 p-2 rounded-lg text-[11px] font-bold text-[#605EA7] shadow-sm flex flex-col gap-1 items-start">
                                      {msg.contextList.map((c, i) => (
                                         <span key={i} className="flex items-center gap-1.5 opacity-90"><Link2 size={10} /> {c}</span>
                                      ))}
                                   </div>
                                )}
                                <div className="px-5 py-3.5 rounded-2xl bg-[#18181b] text-white border border-zinc-800 shadow-md rounded-br-sm text-[14px] leading-relaxed font-medium">{msg.content}</div>
                             </div>
                           ) : (
                             <div className="max-w-[90%]">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${msg.role === 'system' ? 'bg-[#CEC8E2] text-[#605EA7]' : 'bg-[#605EA7]'}`}>
                                      {msg.role === 'system' ? 'SYS' : 'L0'}
                                   </div>
                                   <span className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">{msg.role === 'system' ? '提示' : '后台执行引擎'}</span>
                                </div>
                                <div className={`px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[14px] text-zinc-800 leading-relaxed rounded-bl-sm font-medium ${msg.role === 'system' ? 'bg-zinc-50/80' : ''}`}>{msg.content}</div>
                             </div>
                           )}
                         </motion.div>
                       ))}
                       <div ref={chatEndRef} className="h-2" />
                    </div>
                    <div className="p-4 bg-white border-t border-zinc-200 z-20"><ChatInputArea isFloat={false} /></div>
                 </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Skill Market Panel */}
        <AnimatePresence>
          {showSkills && (
            <motion.div 
              layout
              initial={{ width: 0, opacity: 0, borderLeftWidth: 0 }}
              animate={{ width: skillsClass === 'flex-1' ? 'auto' : 340, opacity: 1, borderLeftWidth: 1 }}
              exit={{ width: 0, opacity: 0, borderLeftWidth: 0 }}
              className={`bg-zinc-50 border-zinc-200 flex flex-col shrink-0 relative z-40 shadow-[-10px_0_40px_rgba(0,0,0,0.08)] overflow-hidden h-full ${skillsClass}`}
            >
              <div className="h-[46px] flex px-2 py-2 border-b border-zinc-200 shrink-0 bg-zinc-100/50 w-full gap-1">
                 <div onClick={() => setSkillTab('market')} className={`flex-1 flex justify-center items-center text-[12px] font-bold rounded-md cursor-pointer transition-colors ${skillTab === 'market' ? 'bg-white text-[#605EA7] shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-[#605EA7] hover:bg-white/50'}`}>技能市场</div>
                 <div onClick={() => setSkillTab('installed')} className={`flex-1 flex justify-center items-center text-[12px] font-bold rounded-md cursor-pointer transition-colors ${skillTab === 'installed' ? 'bg-white text-[#605EA7] shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-[#605EA7] hover:bg-white/50'}`}>已安装</div>
              </div>
              <div className="w-full flex-1 p-4 flex flex-col overflow-y-auto">
                 {SKILLS_MARKET.filter(s => skillTab === 'market' ? true : s.installed).map(skill => (
                   <div draggable={skillTab === 'installed'} onDragStart={(e) => handleTreeDragStart(e, 'Skill', `@${skill.name}`)} key={skill.id} className={`bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm mb-3 group hover:border-[#605EA7]/40 hover:shadow-md transition-all ${skillTab === 'installed' ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-[14px] ${skillTab === 'installed' ? 'text-[#605EA7]' : 'text-zinc-900'} group-hover:text-[#605EA7] transition-colors flex items-center gap-1.5`}>
                          {skillTab === 'installed' && <AlertCircle size={10} className="text-emerald-500"/>}
                          {skill.name}
                        </h4>
                        {skillTab === 'installed' ? (
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 text-zinc-400 hover:text-[#605EA7] bg-zinc-100 hover:bg-[#605EA7]/10 rounded transition-colors" title="查看详情"><FileQuestion size={12}/></button>
                              <button className="p-1 text-zinc-400 hover:text-red-500 bg-zinc-100 hover:bg-red-50 rounded transition-colors" title="删除卸载"><X size={12}/></button>
                           </div>
                        ) : skill.installed ? (
                           <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0 ml-2">已安装</span>
                        ) : (
                           <button className="text-[11px] font-bold text-white bg-[#18181b] hover:bg-[#605EA7] px-3 py-1 rounded shadow-sm transition-colors shrink-0 ml-2">获取</button>
                        )}
                      </div>
                      <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{skill.desc}</p>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
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
