import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Database, Zap, Sparkles, ArrowUp, Activity, 
  Camera, ChevronDown, 
  Folder, FileText, Search, LayoutTemplate, Box, Settings,
  Bot, TerminalSquare, Share2, Play,
  PanelLeftClose, PanelLeft, Plus, MoreHorizontal,
  History, Globe, MessageSquare, AtSign, User,
  LayoutGrid, LayoutPanelLeft, LayoutTemplate as LayoutIcon,
  MessageCircle, LayoutDashboard, Monitor, X, PackagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & States ---
type TabId = 'grid' | 'editor' | 'automation';
type PopupId = 'profile' | 'workspace' | 'history' | 'skillMarket' | null;

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
}

interface MentionOption {
  id: string;
  type: '微服务' | '实体门店' | '全局库' | '门店库' | '预设指令';
  label: string;
  icon: React.ElementType;
  color: string;
}

const MENTION_OPTIONS: MentionOption[] = [
  { id: '1', type: '微服务', label: '蓝海词雷达', icon: Search, color: 'text-blue-500' },
  { id: '2', type: '实体门店', label: '上海万象城店', icon: Building2, color: 'text-amber-500' },
  { id: '3', type: '全局库', label: '通用避坑骨架', icon: LayoutTemplate, color: 'text-purple-500' },
  { id: '4', type: '实体门店', label: '萧山中宏酒店', icon: Building2, color: 'text-amber-500' },
  { id: '5', type: '门店库', label: '中宏酒店痛点RAG', icon: Database, color: 'text-emerald-500' },
  { id: '6', type: '预设指令', label: '萧山门店自动流', icon: Zap, color: 'text-[#605EA7]' },
];

const BRAND = {
  primary: '#605EA7',
  secondary: '#CEC8E2'
};

const DualEditorArtifact = () => (
  <div className="flex flex-col h-full p-6 text-zinc-800">
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <TerminalSquare size={20} color={BRAND.primary} />
          项目/报告生成流视窗 (AI Workspace)
        </h3>
        <p className="text-sm text-zinc-500 mt-1">支持智能图文排版、大纲抽取与下发规则剥离。</p>
      </div>
      <button 
        style={{ backgroundColor: '#18181b' }}
        className="text-white px-5 py-2 text-sm font-bold rounded-lg shadow-md hover:bg-zinc-800 transition-colors flex items-center gap-2"
      >
        <Share2 size={16} /> 确认并分发资产
      </button>
    </div>

    <div className="flex-1 flex gap-6 min-h-0">
      <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        <div className="bg-zinc-50 border-b border-zinc-200 py-3 px-5 text-sm font-bold text-zinc-700 flex justify-between items-center">
          <span>生成的文案与视觉草稿</span>
          <span className="text-[11px] font-mono bg-zinc-200/50 px-2 py-0.5 rounded text-zinc-600 border border-zinc-200">Draft.md</span>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar text-[15px] leading-loose text-zinc-700 font-sans">
          <h1 className="text-2xl font-bold mb-6 text-zinc-900 tracking-tight">结果展示页，所见即所得？</h1>
          <p className="mb-4 text-zinc-800 font-bold border-l-4 pl-3" style={{ borderColor: BRAND.primary }}>基于特定门店的客诉痛点提取...</p>
          <p className="mb-3 text-zinc-600">
            最近收到后台无数新娘的私信，吐槽某草坪婚宴踩的巨坑。我真的必须出来骂醒你们！只看草坪大不大，都不看「隐形消费」的吗？
          </p>
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg my-6">
             <div className="font-bold mb-2 flex items-center gap-2" style={{ color: BRAND.primary }}>
               <Camera size={16} />硬性拍摄任务指标（需人工复核）：
             </div>
             <p className="text-sm text-zinc-600 mb-1">- 必须有一张体现光影质感的 **[暗场全景图]**。</p>
             <p className="text-sm text-zinc-600">- 必须有一张高级摆盘的 **[餐标细节特写]**。</p>
          </div>
        </div>
      </div>

      <div className="flex-[0.6] bg-white border border-zinc-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="bg-zinc-50 border-b border-zinc-200 py-3 px-4 text-xs font-bold text-zinc-600 flex items-center gap-1.5">
          <Database size={14} color={BRAND.primary} /> 左侧文本剥离属性
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar h-full space-y-4">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg shadow-sm hover:border-zinc-300 transition-colors cursor-pointer">
            <div className="font-bold text-sm text-zinc-900 mb-1">视觉任务单 1</div>
            <p className="text-xs text-zinc-500">暗场全景图拍摄 (已排队分发)</p>
          </div>
           <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg shadow-sm hover:border-zinc-300 transition-colors cursor-pointer">
            <div className="font-bold text-sm text-zinc-900 mb-1">视觉任务单 2</div>
            <p className="text-xs text-zinc-500">高级餐标特写 (要求：3:4竖屏)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Layout Wrapper ---
export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [showMentionPanel, setShowMentionPanel] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePopup, setActivePopup] = useState<PopupId>(null);
  
  // State for toggling expanding folders
  const [expandedMerchants, setExpandedMerchants] = useState<Record<string, boolean>>({
    "xiaoshan": true
  });
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', role: 'agent', 
      content: '下午好, hua xu。已为您切换至全局明亮模式，并应用了专属主色调 `#605EA7` 与副色调 `#CEC8E2`，按钮采用黑色极客风格。\n\n💡 **新增功能矩阵：**\n1. 左上角点击呼出工作区创建/切换菜单 (含 Web/File 多模态组合)。\n2. 右上角加入了 `历史记忆` 浮层与 `全局设置` 面板。\n3. 所有顶部图标均已打通高亮与弹出事件。\n\n请输入指令唤醒工作流。'
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const mentionMatch = val.match(/[@/]([^\s]*)$/);
    if (mentionMatch) {
      setShowMentionPanel(true);
      setMentionFilter(mentionMatch[1]);
    } else {
      setShowMentionPanel(false);
    }
  };

  const insertMention = (mentionLabel: string) => {
    const isSlash = inputValue.match(/\/([^\s]*)$/);
    const newVal = inputValue.replace(/[@/]([^\s]*)$/, `${isSlash ? '' : '@'}${mentionLabel} `);
    
    if (isSlash || mentionLabel.includes('自动流')) {
      setInputValue("你现在是 控制中枢。据 @萧山门店自动流 每早 9 点执行：\n1. 从 @蓝海词雷达 获取每日最热提取痛点生成文案。\n2. 解析文案提取摄像要求定向下发。");
    } else {
      setInputValue(newVal);
    }
    setShowMentionPanel(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    pushMessage('user', inputValue);
    setInputValue('');
    setShowMentionPanel(false);
    
    setTimeout(() => pushMessage('agent', '已执行指令。'), 800);
  };

  const handlePackageSkill = () => {
    pushMessage('system', '> Packing combo skill context...');
    setTimeout(() => {
      pushMessage('agent', '✅ **Combo Skill 打包完成!** 已发布至市场。');
    }, 1200);
  };

  const pushMessage = (role: Message['role'], content: React.ReactNode | string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role, content }]);
  };

  const togglePopup = (popupId: PopupId) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-zinc-50 font-sans text-zinc-900 overflow-hidden relative">
      
      {/* 0. NEW: Top Navigation Bar to match light reference */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 z-[60]">
        
        {/* Left Nav Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => togglePopup('profile')}
              className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-lg relative hover:bg-zinc-200 transition-colors shadow-sm"
            >
              h
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {activePopup === 'profile' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-3 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl py-3 z-[70]"
                >
                  <div className="px-5 py-3 mb-2">
                    <div className="font-extrabold text-zinc-900 text-xl">hua xu</div>
                    <div className="text-sm text-zinc-500 font-medium tracking-tight">sheawhua@gmail.com</div>
                  </div>
                  <div className="flex flex-col text-[15px] font-medium">
                    <button className="text-left px-5 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">个人资料</button>
                    <button className="text-left px-5 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">积分</button>
                    <button className="text-left px-5 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">开发者中心</button>
                    <button className="text-left px-5 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">Combo Skills商店</button>
                    <button className="text-left px-5 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-t border-zinc-100 mt-1">设置</button>
                  </div>
                  <div className="px-5 py-4 flex gap-3 justify-center bg-zinc-50 m-4 rounded-full border border-zinc-200">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 cursor-pointer hover:scale-110 transition-transform shadow-sm"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500 cursor-pointer hover:scale-110 transition-transform shadow-sm"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 cursor-pointer hover:scale-110 transition-transform shadow-sm"></div>
                    <div className="w-3.5 h-3.5 rounded-full cursor-pointer hover:scale-110 transition-transform ring-2 ring-zinc-200/50 ring-offset-2 ring-offset-zinc-50 shadow-sm" style={{ backgroundColor: BRAND.primary }}></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center relative overflow-hidden shadow-sm">
                       <div className="absolute w-full h-[50%] bg-white/40 top-0 transform -rotate-45"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-[1px] bg-zinc-200 mx-2"></div>

          <div className="relative">
            <button 
              onClick={() => togglePopup('workspace')}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-zinc-100 border border-zinc-200 text-[15px] font-bold text-zinc-800 hover:bg-zinc-200 transition-colors shadow-sm"
            >
              New Workspace <Plus size={16} className="text-zinc-500" />
            </button>

            {/* Workspace Dropdown */}
            <AnimatePresence>
              {activePopup === 'workspace' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full left-0 mt-3 w-80 bg-white border border-zinc-200 rounded-3xl shadow-xl p-5 z-[70]"
                >
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold mb-5">
                    <LayoutGrid size={16} /> 全部工作空间
                  </div>
                  <div className="flex items-center justify-between text-zinc-900 text-lg font-bold mb-5 pb-4 border-b border-zinc-100">
                     新建工作空间 <Plus size={20} className="text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors" />
                  </div>
                  <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                    <div className="flex flex-col items-center gap-2 px-2 py-3 hover:bg-zinc-50 rounded-2xl cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                      <MessageCircle size={28} strokeWidth={1.5} /> <span className="text-xs font-medium">Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-2 py-3 hover:bg-zinc-50 rounded-2xl cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                      <LayoutDashboard size={28} strokeWidth={1.5} /> <span className="text-xs font-medium">File + Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-2 py-3 hover:bg-zinc-50 rounded-2xl cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                      <Monitor size={28} strokeWidth={1.5} /> <span className="text-xs font-medium">Web + Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-2 py-3 hover:bg-zinc-50 rounded-2xl cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                      <Box size={28} strokeWidth={1.5} /> <span className="text-xs font-medium">File + Web</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-2 py-3 hover:bg-zinc-50 rounded-2xl cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                      <LayoutPanelLeft size={28} strokeWidth={1.5} /> <span className="text-[10px] text-center leading-tight font-medium">File + Web<br/>+ Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-2 py-3 hover:bg-zinc-50 rounded-2xl cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                      <LayoutIcon size={28} strokeWidth={1.5} /> <span className="text-xs font-medium">All Panels</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Nav Icons */}
        <div className="flex items-center">
          <div className="flex items-center relative gap-0.5">
             <button onClick={() => togglePopup('history')} className={`p-2.5 rounded-lg transition-colors font-bold ${activePopup === 'history' ? `bg-zinc-100 text-[${BRAND.primary}]` : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`} title="历史记录">
               <History size={18} color={activePopup === 'history' ? BRAND.primary : undefined} />
             </button>
             
             {/* History Popup */}
             <AnimatePresence>
              {activePopup === 'history' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-3 w-[340px] bg-white border border-zinc-200 shadow-xl rounded-3xl z-[70] overflow-hidden"
                >
                  <div className="flex items-center justify-between p-5 border-b border-zinc-100">
                    <span className="text-zinc-900 font-bold flex items-center gap-2 pr-4"><History size={18} color={BRAND.primary} /> 历史对话</span>
                    <X size={18} className="text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => togglePopup(null)} />
                  </div>
                  <div className="px-5 py-4 text-sm text-zinc-500 border-b border-zinc-100 font-medium bg-zinc-50">
                    2 pastConversations.archived
                  </div>
                  <div className="flex flex-col pb-2 pt-2">
                    <div className="flex items-start gap-4 px-6 py-4 hover:bg-zinc-50 cursor-pointer group transition-colors">
                      <MessageSquare size={20} className="mt-0.5" style={{ color: BRAND.primary }} fill={BRAND.secondary} fillOpacity={0.4} />
                      <div>
                        <div className="text-[15px] font-bold text-zinc-800 group-hover:text-zinc-900 transition-colors">5月1日活动商品...</div>
                        <div className="text-xs text-zinc-500 mt-1.5 font-medium">大约 1 小时前 • 67</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 px-6 py-4 hover:bg-zinc-50 cursor-pointer group transition-colors">
                      <MessageSquare size={20} className="mt-0.5" style={{ color: BRAND.primary }} fill={BRAND.secondary} fillOpacity={0.4} />
                      <div>
                        <div className="text-[15px] font-bold text-zinc-800 group-hover:text-zinc-900 transition-colors">工作区分析与项目...</div>
                        <div className="text-xs text-zinc-500 mt-1.5 font-medium">大约 2 小时前 • 31</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

             <div className="w-[1px] h-5 bg-zinc-200 mx-1.5"></div>
             
             <button className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors" title="资源库">
               <Folder size={18} className="text-amber-500" />
             </button>
             <button className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors" title="网页搜索插件">
               <Globe size={18} className="text-blue-500" />
             </button>
             <button className="p-2.5 text-zinc-900 bg-zinc-100 rounded-lg transition-colors border border-zinc-200/60 shadow-sm ml-1" title="当前会话">
               <MessageSquare size={18} color={BRAND.primary} fill={BRAND.secondary} fillOpacity={0.4} />
             </button>
             <button 
               onClick={() => togglePopup('skillMarket')}
               className={`p-2.5 ml-1 rounded-lg transition-colors ${activePopup === 'skillMarket' ? `bg-zinc-100 text-[${BRAND.primary}]` : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`} 
               title="Combo Skills"
             >
               <Sparkles size={18} color={activePopup === 'skillMarket' ? BRAND.primary : undefined} />
             </button>
          </div>
        </div>
      </div>


      {/* Application Body Container */}
      <div className="flex h-full w-full pt-14">
        
        {/* 1. Left Panel: Collapsible Explorer */}
        <div 
          className={`${isSidebarCollapsed ? 'w-[64px] items-center' : 'w-[260px] '} bg-white border-r border-zinc-200 flex flex-col shrink-0 relative z-30 transition-all duration-300`}
        >
          <div className="p-3 overflow-y-auto space-y-4 custom-scrollbar flex-1 pb-10 mt-2">
            
            {/* Section A: Global/Personal Resources */}
            <div className="space-y-1 w-full relative group">
               {!isSidebarCollapsed && (
                <>
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-2 py-2 mt-1 rounded-lg group hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-1.5"><ChevronDown size={14} />全局资产 (个人库)</div>
                    <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-900"/>
                  </div>
                  <div className="pl-6 space-y-0.5 mt-1">
                    <div className="flex items-center justify-between text-[13px] font-medium text-zinc-700 px-2 py-1.5 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors group/item">
                      <div className="flex items-center gap-2"><Database size={14} color={BRAND.primary} /> 通用通识文库.pdf</div>
                      <MoreHorizontal size={14} className="opacity-0 group-hover/item:opacity-100 text-zinc-400 hover:text-zinc-900"/>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isSidebarCollapsed && <div className="h-[1px] w-full bg-zinc-100 my-4"></div>}

            {/* Section B: Subordinate Merchants */}
            <div className="space-y-1 w-full">
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-2 py-2 rounded-lg group hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-1.5"><ChevronDown size={14} />下属商家池</div>
                  <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-900"/>
                </div>
              )}
              
              {!isSidebarCollapsed && (
                <div className="pl-2 space-y-2 mt-2">
                  <div onClick={() => setExpandedMerchants(prev => ({...prev, 'xiaoshan': !prev['xiaoshan']}))} className="flex items-center justify-between text-[13px] text-zinc-900 bg-zinc-100 border border-zinc-200/60 font-bold px-2 py-2 rounded-lg cursor-pointer group/merch">
                    <div className="flex items-center gap-2"><ChevronDown size={14} color={BRAND.primary}/> 萧山中宏酒店</div>
                    <span className="opacity-0 group-hover/merch:opacity-100 flex items-center gap-1"><Plus size={14} className="text-zinc-400 hover:text-zinc-900"/></span>
                  </div>
                  
                  {expandedMerchants['xiaoshan'] && (
                    <div className="pl-6 space-y-2 mt-2 border-l border-zinc-200 ml-4 pb-2">
                      {/* Merchant RAG */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-600 px-2 py-1.5 hover:bg-zinc-100 hover:text-zinc-900 rounded-lg cursor-pointer transition-colors">
                          <FileText size={14} className="text-emerald-500" /> 销售话术对齐表.xlsx
                        </div>
                      </div>
                      {/* Merchant Skills */}
                      <div className="space-y-0.5 mt-2">
                        <div 
                          onClick={() => insertMention('萧山门店自动流')}
                          className="flex items-center gap-2 text-[13px] text-zinc-800 font-bold px-2 py-2 bg-white border border-zinc-200 shadow-sm rounded-lg cursor-pointer hover:border-[#605EA7]/50 hover:shadow transition-all"
                        >
                          <Zap size={14} className="text-amber-500" /> 自动化发单流.skill
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
           {/* Sidebar toggle matching screenshot pattern */}
           <div className={`h-[48px] border-t border-zinc-200 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 justify-end'}`}>
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors">
              {isSidebarCollapsed ? <PanelLeft size={16}/> : <PanelLeftClose size={16}/>}
            </button>
          </div>
        </div>

        {/* 2. Center Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 relative z-10 shadow-inner overflow-hidden">
           <DualEditorArtifact />
        </div>

        {/* 3. Right Panel (Copilot / Chat) */}
        <div className="w-[480px] bg-white border-l border-zinc-200 flex flex-col shrink-0 relative z-30 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="h-[48px] px-4 flex items-center border-b border-zinc-200 shrink-0 bg-zinc-50/50">
             <div className="flex gap-1 h-full py-2">
                <div className="px-5 border border-zinc-200 bg-white shadow-sm rounded-t-lg flex items-center gap-2 text-sm text-zinc-800 font-bold relative after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-2 after:bg-white z-10">
                   <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.primary }}></span> New Chat
                </div>
                <div className="px-3 border border-transparent rounded-tr-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 cursor-pointer transition-colors">
                   <Plus size={16} />
                </div>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
             
            {/* Empty State Greeting */}
            {messages.length === 1 && (
              <div className="mt-8 mb-12 w-full max-w-[400px] mx-auto">
                <h1 className="text-3xl font-extrabold text-zinc-900 font-serif tracking-tight mb-8 flex items-baseline">
                  下午好, <span className="ml-3 font-sans font-black tracking-tight" style={{ color: BRAND.primary }}>hua xu</span>
                </h1>
                
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
                  <p className="text-[15px] font-bold text-zinc-600 mb-8 leading-relaxed relative z-10">
                    你可以直接开始，或者选择一个 combo 完成特定任务，或者将历史对话整理成一个 combo
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <button className="p-3 rounded-xl bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:shadow transition-all" title="提取知识库"><AtSign size={18} /></button>
                    <button className="p-3 rounded-xl bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:shadow transition-all" title="快速打包"><PackagePlus size={18} color={BRAND.primary} /></button>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-x-4 gap-y-3 mb-6">
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-2 cursor-pointer transition-colors hover:bg-amber-100 shadow-sm">
                    <Sparkles size={14}/> 推荐
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:text-zinc-900 hover:border-zinc-300 cursor-pointer flex items-center gap-2 transition-all shadow-sm">
                    <Plus size={14}/> 自定义
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:text-zinc-900 hover:border-zinc-300 cursor-pointer flex items-center gap-2 transition-all shadow-sm">
                    <Activity size={14}/> 分析
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:text-zinc-900 hover:border-zinc-300 cursor-pointer flex items-center gap-2 transition-all shadow-sm">
                    <TerminalSquare size={14}/> 写作
                  </span>
                </div>

                {/* Predefined Prompts */}
                <div className="space-y-3">
                  <div onClick={() => insertMention('PPT语义内容')} className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:border-[#605EA7]/40 hover:shadow-md cursor-pointer text-[14px] text-zinc-700 font-bold transition-all">
                    根据我选中的文档，写一个漂亮的 PPT 汇报用
                  </div>
                  <div onClick={() => insertMention('分析目录结构')} className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:border-[#605EA7]/40 hover:shadow-md cursor-pointer text-[14px] text-zinc-700 font-bold transition-all">
                    分析这个目录结构，帮我做一个整理计划
                  </div>
                  <div onClick={() => insertMention('分析表格')} className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:border-[#605EA7]/40 hover:shadow-md cursor-pointer text-[14px] text-zinc-700 font-bold transition-all">
                    根据目录内的表格文件，给出一些洞察
                  </div>
                  <div onClick={() => insertMention('帮助入门')} className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:border-[#605EA7]/40 hover:shadow-md cursor-pointer text-[14px] text-zinc-700 font-bold transition-all">
                    你能帮我做什么？<br/><span className="text-xs text-zinc-400 mt-2 block font-medium">不知道从哪开始？点我一下就行。</span>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} ${idx === 0 ? 'hidden' : ''}`}
                >
                  {msg.role === 'system' ? (
                    <div className="w-full font-mono text-[11px] text-zinc-400 p-3 border-l-4 border-zinc-200 my-2 bg-zinc-50 rounded-r-lg shadow-sm font-bold">
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`px-6 py-4 rounded-3xl max-w-[90%] text-[15px] leading-loose relative shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#18181b] text-white rounded-br-sm border border-zinc-800 shadow-md' 
                        : 'bg-white border-l-4 text-zinc-800 rounded-bl-sm border-y border-r border-zinc-200'
                    }`}
                    style={msg.role === 'agent' ? { borderLeftColor: BRAND.primary } : {}}
                    >
                      {msg.role === 'agent' && (
                        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-widest border-b border-zinc-100 pb-2" style={{ color: BRAND.primary }}>
                          <Bot size={16} /> L0 大脑
                        </div>
                      )}
                      <div className="whitespace-pre-wrap font-medium">
                        {typeof msg.content === 'string' 
                          ? msg.content.split(/([@/][a-zA-Z0-9\u4e00-\u9fa5]+)/g).map((part, index) => 
                              part.startsWith('@') || part.startsWith('/')
                                ? <span key={index} className="font-bold px-2 py-0.5 rounded-md border mx-0.5 shadow-sm inline-block -my-1 border-transparent" style={{ backgroundColor: BRAND.secondary + '40', color: BRAND.primary }}>{part}</span> 
                                : part
                            )
                          : msg.content
                        }
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} className="h-4" />
          </div>

          <div className="p-5 border-t border-zinc-200 bg-white relative z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
            {showMentionPanel && (
              <div className="absolute bottom-full left-5 right-5 mb-4 bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden py-2 z-50 max-h-[260px] overflow-y-auto ring-1 ring-black/5">
                <div className="px-5 py-2 text-[11px] font-bold text-zinc-400 bg-zinc-50 border-b border-zinc-100 mb-1">
                  选择 Combo Skill
                </div>
                {MENTION_OPTIONS.filter(o => o.label.includes(mentionFilter)).map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => insertMention(opt.label)}
                    className="px-5 py-3 flex items-center gap-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-none transition-colors"
                  >
                    <opt.icon size={16} className={opt.color} />
                    <span className="text-[14px] font-bold text-zinc-800 mt-0.5">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="relative bg-white border border-zinc-300 rounded-2xl overflow-hidden transition-all shadow-sm focus-within:ring-4 focus-within:ring-[#605EA7]/10 focus-within:border-[#605EA7] focus-within:shadow-md">
               <textarea 
                rows={2}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => { 
                  if(e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    if(showMentionPanel) {
                       const firstMatch = MENTION_OPTIONS.filter(o => o.label.includes(mentionFilter))[0];
                       if(firstMatch) insertMention(firstMatch.label);
                    } else handleSend(); 
                  }
                }}
                placeholder="发号施令..."
                className="w-full bg-transparent border-none px-5 pt-4 pb-14 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none resize-none font-sans leading-relaxed font-bold"
              />
              
              <div className="absolute left-3 bottom-3 flex items-center gap-2">
                <button 
                  onClick={() => setInputValue(prev => prev + '@')}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
                >
                  <AtSign size={18} />
                </button>               
                <div className="h-5 w-[1px] bg-zinc-200 mx-1"></div>
                <button 
                  onClick={handlePackageSkill}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
                  title="打包为Combo"
                >
                  <PackagePlus size={18} color={BRAND.primary} />
                </button>
              </div>
              
              <div className="absolute right-3 bottom-3">
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-xl text-white disabled:opacity-50 transition-all active:scale-95 shadow-md flex items-center justify-center bg-[#18181b] disabled:bg-zinc-300 disabled:shadow-none hover:shadow-lg"
                >
                  <ArrowUp size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Far Right Panel (Skill Market) */}
        <AnimatePresence>
          {activePopup === 'skillMarket' && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-zinc-50 border-l border-zinc-200 flex flex-col shrink-0 relative z-40 shadow-[-10px_0_40px_rgba(0,0,0,0.08)] overflow-hidden h-full"
            >
               <div className="w-[340px] h-[48px] px-6 flex items-center justify-between border-b border-zinc-200 shrink-0 bg-white">
                 <span className="text-zinc-900 font-bold flex items-center gap-2 text-[15px]"><Sparkles size={16} className="text-amber-500" /> 技能交易市场</span>
                 <X size={18} className="text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors" onClick={() => togglePopup(null)} />
               </div>
               
               <div className="w-[340px] flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  <div className="px-1 relative focus-within:text-zinc-900 text-zinc-400 transition-colors">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="搜索技能包..." className="w-full bg-white border border-zinc-300 rounded-full py-2.5 pl-12 pr-4 text-[15px] font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#605EA7] focus:ring-4 focus:ring-[#605EA7]/10 transition-all shadow-sm"/>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                     <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">精选 Combo</h4>
                     
                     <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-400 hover:shadow-md transition-all cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -mr-10 -mt-10 rounded-full group-hover:bg-amber-500/20 transition-colors"></div>
                        <h5 className="font-bold text-zinc-900 text-[15px] mb-2 flex items-center gap-2 relative z-10"><Zap size={16} className="text-amber-500" /> 自动化发单流</h5>
                        <p className="text-[13px] text-zinc-500 mb-5 font-medium leading-relaxed relative z-10">连接企业数据源，每日自动根据痛点生成推文任务。</p>
                        <button className="w-full py-2 bg-[#18181b] text-white rounded-xl text-[14px] font-bold hover:bg-zinc-800 transition-colors shadow-md relative z-10 w-full flex items-center justify-center gap-2">
                          <Plus size={16}/> 添加入库
                        </button>
                     </div>
                     
                     <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm group hover:border-[#605EA7]/50 hover:shadow-md transition-all cursor-pointer">
                        <h5 className="font-bold text-zinc-900 text-[15px] mb-2 flex items-center gap-2" style={{ color: BRAND.primary }}><Database size={16} /> 销售话术对齐</h5>
                        <p className="text-[13px] text-zinc-500 mb-5 font-medium leading-relaxed">从文档提取产品知识，生成统一的销售 QA 规范。</p>
                        <button className="w-full py-2 bg-white border border-zinc-200 text-zinc-800 rounded-xl text-[14px] font-bold hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm transition-all w-full flex items-center justify-center gap-2">
                          <Plus size={16}/> 添加入库
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
