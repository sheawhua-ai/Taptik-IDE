import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Zap, Sparkles, ArrowUp, Activity, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine, 
  LayoutGrid, Search, Star, FolderOpen, Monitor, 
  FileText, Download, Image as ImageIcon, Film, Music, Cloud,
  PanelLeftClose, PanelRightClose, Plus, MoreVertical,
  History, Compass, MessageSquare, AtSign, LayoutTemplate, Trash2,
  Bot, TerminalSquare, RotateCw, RefreshCw, Hexagon, LogOut, Menu, ShoppingCart, Edit, User, Info, Cpu, Clock, CreditCard, Coins, GitBranch, BookOpen, DownloadCloud, Import, Lock, UploadCloud, ArrowUpRight, Component, Brain, Link2, FileBox, FileQuestion, Flame, CalendarDays, Workflow, Server, LineChart, Users, Settings, PlusCircle, Check, Play, FlaskConical, Lightbulb, Send, PenTool, Code, Share2, Target, BarChart2, AlertCircle, FileIcon, Filter, Layers, Orbit, Dna, ShieldHalf, ShieldCheck, Route, X, Gauge, Mic,
  FolderPlus, ExternalLink, FileEdit, Folder, Store, Fingerprint, Command, Blocks, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Message, ThoughtStep, DynamicContent } from './types';
import { ThoughtProcessAccordion } from './components/ThoughtProcess';
import { DynamicCanvasContainer } from './components/DynamicCanvas';

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

// --- Types & Config ---
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
          { 
            id: 'start-2', 
            role: 'agent', 
            content: '监测到您正在处理 2024 夏季新品增长任务。{recommend_skill_paid:爆文逻辑蒸馏器:50信用点/次:原创度提升 +42.5%}',
            thoughts: [
              { id: 't1', status: '正在分析当前项目上下文...', log: 'Fetching project context for project-a...\nAnalyzing file tree and recent assets...', startTime: Date.now() },
              { id: 't2', status: '正在检索相关 Skill 市场插件...', log: 'Searching marketplace for "copywriting", "optimization"...\nFound 12 matching skills.', startTime: Date.now() },
              { id: 't3', status: '⏳ 正在匹配最优运营方案...', log: 'Evaluating ROI and synergy for top skills...\nRecommendation: 爆文逻辑蒸馏器.', startTime: Date.now() }
            ]
          },
          { 
            id: 'dynamic-demo', 
            role: 'agent', 
            content: '根据近期小红书趋势分析，我为您生成了以下运营洞察看板。',
            dynamicContent: {
              type: 'report',
              title: '2024夏季新品小红书趋势雷达',
              html: `
                <div class="p-8 space-y-6">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-taptik-cream p-5 rounded-2xl border border-taptik-line text-center">
                      <div class="text-[10px] text-taptik-muted font-black uppercase tracking-widest mb-1">爆文率</div>
                      <div class="text-2xl font-black text-taptik-ember font-serif">24.5%</div>
                    </div>
                    <div class="bg-taptik-cream p-5 rounded-2xl border border-taptik-line text-center">
                      <div class="text-[10px] text-taptik-muted font-black uppercase tracking-widest mb-1">搜索量</div>
                      <div class="text-2xl font-black text-taptik-ink font-serif">128K</div>
                    </div>
                    <div class="bg-taptik-cream p-5 rounded-2xl border border-taptik-line text-center">
                      <div class="text-[10px] text-taptik-muted font-black uppercase tracking-widest mb-1">互动值</div>
                      <div class="text-2xl font-black text-taptik-moss font-serif">high</div>
                    </div>
                  </div>
                  <div class="bg-white/50 rounded-2xl p-5 border border-taptik-line">
                    <h5 class="text-[14px] font-black mb-3">核心关键词分布</h5>
                    <div class="flex flex-wrap gap-2">
                      <span class="px-3 py-1 bg-taptik-ember/10 text-taptik-ember rounded-full text-xs font-bold">#多巴胺穿搭</span>
                      <span class="px-3 py-1 bg-taptik-ember/10 text-taptik-ember rounded-full text-xs font-bold">#夏日限定</span>
                      <span class="px-3 py-1 bg-taptik-moss/10 text-taptik-moss rounded-full text-xs font-bold">#美拉德</span>
                    </div>
                  </div>
                </div>
              `
            }
          }
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
      if (part.startsWith('@')) return <span key={index} className={`inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-[6px] text-[12px] font-black tracking-tight ${role === 'user' ? 'bg-white/20 text-white' : 'bg-taptik-ember/10 text-taptik-ember'}`}><Component size={12}/> {part.substring(1)}</span>;
      if (part.startsWith('「')) {
         let icon = <FileBox size={14} />;
         if (part.startsWith('「🔗')) icon = <Link2 size={14} />;
         else if (part.startsWith('「📁')) icon = <FolderOpen size={14} />;
         else if (part.startsWith('「🧠')) icon = <Brain size={14} />;
         return <span key={index} className={`inline-flex items-center gap-1.5 mx-1 px-2 py-0.5 rounded-[8px] text-[13px] font-bold border ${role === 'user' ? 'bg-white/10 text-white border-white/20' : 'bg-taptik-cream text-taptik-ink border-taptik-line'}`}>{icon} {part.slice(3, -1)}</span>;
      }

      // 情况 1 — 命中付费 Skill
      if (part.startsWith('{recommend_skill_paid:')) {
        const [_, name, price, benefit] = part.replace('}', '').split(':');
        return (
          <div key={index} className="mt-6 mb-3 p-10 bg-taptik-paper border border-taptik-line rounded-[40px] shadow-2xl shadow-taptik-ember/5 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
              <Orbit size={200} className="text-taptik-ember" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-taptik-paper border border-taptik-line rounded-[24px] flex items-center justify-center text-taptik-ember shadow-inner">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h4 className="text-[18px] font-black text-taptik-ink tracking-tight font-serif">TAPTIK 深度决策建议</h4>
                    <p className="text-[10px] text-taptik-muted font-black uppercase tracking-[0.24em] mt-1 opacity-60">Strategic Extension Discovery</p>
                  </div>
                </div>
                <div className="px-4 py-2 taptik-cta-gradient text-white text-[10px] font-black rounded-[12px] uppercase tracking-widest shadow-lg shadow-taptik-ember/20">Marketplace Paid</div>
              </div>
              
              <div className="space-y-6 mb-10">
                <p className="text-[15px] text-taptik-muted font-bold leading-relaxed px-1">
                  Agent 观测到当前笔记原创度低于安全阈值，建议部署战略插件 <span className="text-taptik-ember font-black underline decoration-taptik-ember/30 underline-offset-8">「{name}」</span> 以触发深度重写逻辑。
                </p>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1 p-5 bg-taptik-cream/50 rounded-[24px] border border-taptik-line shadow-inner">
                     <span className="text-taptik-muted text-[10px] font-black uppercase tracking-[0.24em] opacity-40">结算详情</span>
                     <span className="text-taptik-ink font-mono font-black text-[15px]">{price}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-5 bg-taptik-ember/5 rounded-[24px] border border-taptik-ember/10 shadow-inner">
                     <span className="text-taptik-muted text-[10px] font-black uppercase tracking-[0.24em] opacity-40">预计提升</span>
                     <span className="text-taptik-ember font-mono font-black text-[15px]">{benefit}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={(e) => {
                    const target = e.currentTarget;
                    target.disabled = true;
                    target.innerHTML = '<span class="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></span>';
                    setTimeout(() => {
                      target.parentElement?.parentElement?.parentElement?.classList.add('opacity-50', 'bg-taptik-cream/50');
                      target.outerHTML = '<div class="flex items-center justify-center gap-3 text-taptik-moss font-black text-[14px] bg-taptik-moss/10 px-8 py-4 rounded-[18px] border border-taptik-moss/20 flex-1"><Check size={20}/> 生产链路已就绪</div>';
                    }, 800);
                  }}
                  className="flex-1 px-8 py-4 taptik-cta-gradient text-white rounded-[18px] text-[14px] font-black shadow-xl shadow-taptik-ember/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  确认部署并应用
                </button>
                <button className="px-8 py-4 bg-taptik-cream border border-taptik-line text-taptik-muted rounded-[18px] text-[14px] font-black hover:text-taptik-ink hover:border-taptik-muted transition-all">忽略建议</button>
              </div>
            </div>
          </div>
        );
      }

      // 情况 2 — 只有免费 Skill
      if (part.startsWith('{recommend_skill_free:')) {
        const [_, category, count, benefit] = part.replace('}', '').split(':');
        return (
          <div key={index} className="mt-6 mb-3 p-10 bg-taptik-paper border border-dashed border-taptik-line rounded-[40px] relative overflow-hidden group hover:border-taptik-ember/30 transition-all shadow-sm">
            <div className="absolute -top-12 -right-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
               <Dna size={220} className="text-taptik-ink" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-taptik-cream rounded-[24px] flex items-center justify-center text-taptik-muted border border-taptik-line/50 group-hover:text-taptik-ember group-hover:bg-taptik-paper transition-all">
                    <Filter size={28} />
                  </div>
                  <div>
                    <h4 className="text-[18px] font-black text-taptik-ink tracking-tight font-serif">TAPTIK 生态建议</h4>
                    <p className="text-[10px] text-taptik-muted font-black uppercase tracking-[0.24em] mt-1 opacity-60">Open Source Resource Discovery</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-taptik-moss/10 text-taptik-moss text-[10px] font-black rounded-[12px] border border-taptik-moss/20 uppercase tracking-widest shadow-sm">Public Free</div>
              </div>
              
              <div className="space-y-6 mb-10 px-1">
                <p className="text-[15px] text-taptik-muted font-bold leading-relaxed">
                  检测到现有素材有优化空间。建议引用 <span className="text-taptik-ink font-black decoration-taptik-ember/30 underline underline-offset-8"> 「{category}」 </span> 类开放工具。
                  <br/>
                  Skill 市场中已有 <span className="text-taptik-ember font-black">{count} 款</span> 活跃资产可供调用。
                </p>
                <div className="flex items-center gap-3 text-taptik-moss text-[13px] font-black bg-taptik-moss/5 w-fit px-4 py-2 rounded-xl border border-taptik-moss/10">
                   <Zap size={16} className="text-taptik-ember fill-current"/>
                   <span>📈 预期原创度评分提升 {benefit}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveNav('skills')}
                  className="flex-1 px-8 py-4 bg-taptik-paper border-2 border-taptik-ink text-taptik-ink rounded-[18px] text-[14px] font-black shadow-lg hover:bg-taptik-ink hover:text-white transition-all text-center active:scale-95"
                >
                  前往生态市场探索插件
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
    <div className="flex h-[100dvh] w-full bg-taptik-cream text-taptik-ink font-sans overflow-hidden">
      {/* SaaS Nav Sidebar */}
      <div className="w-[80px] xl:w-[260px] border-r border-taptik-line bg-taptik-cream flex flex-col shrink-0 h-full relative z-20">
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-6 font-black text-lg tracking-tight text-taptik-ink gap-3">
          <div className="w-9 h-9 taptik-cta-gradient rounded-[12px] flex items-center justify-center text-white shrink-0 shadow-lg shadow-taptik-ember/20 transition-shadow transition-transform hover:scale-105">
            <Hexagon size={20} className="fill-current" />
          </div>
          <span className="hidden xl:block tracking-tighter uppercase font-serif text-[20px]">TAPTIK</span>
        </div>
        
        <div className="px-2 xl:px-4 py-2 cursor-pointer relative">
          <button 
            onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)} 
            className={`w-full flex items-center justify-center xl:justify-between hover:bg-taptik-paper/80 rounded-2xl p-2 xl:px-3 xl:py-2 text-[13px] font-bold text-taptik-muted transition-colors border border-transparent ${isProjectSelectorOpen ? 'bg-taptik-paper border-taptik-line shadow-sm' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm border border-black/5" style={{ backgroundColor: activeProject.color, color: activeProject.textColor }}>
                {activeProject.initial}
              </div>
              <span className="hidden xl:block truncate max-w-[120px] text-taptik-ink font-bold">{activeProject.name}</span>
            </div>
            <ChevronDown size={14} className="text-taptik-muted hidden xl:block" />
          </button>
          
          <AnimatePresence>
            {isProjectSelectorOpen && (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="absolute top-16 left-2 xl:left-4 w-[320px] bg-taptik-paper border border-taptik-line shadow-2xl rounded-[32px] z-50 overflow-hidden p-2"
                >
                   <div className="px-4 py-3 border-b border-taptik-line mb-1">
                      <span className="text-[10px] font-black text-taptik-muted uppercase tracking-[0.2em] opacity-40">组织机构切换</span>
                   </div>
                   <div className="max-h-[360px] overflow-y-auto p-1 custom-scrollbar space-y-1">
                      {Object.values(MOCK_PROJECTS).map(proj => (
                          <button 
                            key={proj.id} 
                            onClick={() => { setActiveProjectId(proj.id as keyof typeof MOCK_PROJECTS); setIsProjectSelectorOpen(false); }} 
                            className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-taptik-cream rounded-[24px] transition-all text-left group ${activeProjectId === proj.id ? 'bg-taptik-cream border border-taptik-line/50 shadow-inner' : 'border border-transparent'}`}
                          >
                            <div className="flex items-center gap-3.5 overflow-hidden">
                              <div className="w-9 h-9 rounded-[14px] flex items-center justify-center font-black text-[12px] shadow-sm shrink-0" style={{ backgroundColor: proj.color, color: proj.textColor }}>
                                {proj.initial}
                              </div>
                              <div className="flex flex-col gap-0.5 overflow-hidden">
                                <span className={`text-[14px] font-black tracking-tight truncate ${activeProjectId === proj.id ? 'text-taptik-ember' : 'text-taptik-ink opacity-80'}`}>{proj.name}</span>
                                <span className="text-[10px] font-bold text-taptik-muted uppercase tracking-tighter opacity-40">Managed Matrix 0{proj.id.length}</span>
                              </div>
                            </div>
                            {activeProjectId === proj.id && <div className="w-1.5 h-1.5 rounded-full bg-taptik-ember" />}
                          </button>
                      ))}
                   </div>
                   <div className="mt-1 p-2 border-t border-taptik-line/50">
                      <button className="w-full py-3 bg-taptik-cream/50 hover:bg-taptik-cream text-taptik-muted hover:text-taptik-ink rounded-[20px] text-[12px] font-black flex items-center justify-center gap-2 transition-all">
                        <PlusCircle size={14} />
                        <span>接入新生产组织</span>
                      </button>
                   </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-2 xl:px-4 py-4 space-y-7 overflow-y-auto custom-scrollbar">
          {/* 核心工作流 */}
          <div>
            <div className="px-1 xl:px-2 text-[10px] font-black text-taptik-muted mb-3 hidden xl:block uppercase tracking-[0.24em] opacity-60">主导航</div>
            <div className="space-y-1.5">
              {[ 
                { id: 'ai', name: '战略决策中心', icon: Command }, 
                { id: 'skills', name: '战略扩展插件', icon: Blocks },
                { id: 'files', name: '底座资产库', icon: Library },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { 
                    setActiveNav(item.id); 
                  }} 
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-4 xl:py-3.5 rounded-[18px] text-[14px] font-bold transition-all relative group ${ activeNav === item.id ? 'text-taptik-ember bg-taptik-paper shadow-[0_4px_12px_rgba(232,93,42,0.06)] border border-taptik-line/20' : 'text-taptik-muted hover:bg-taptik-paper/50 hover:text-taptik-ink'}`}
                >
                  <item.icon size={20} className={`${activeNav === item.id ? 'text-taptik-ember' : 'text-taptik-muted group-hover:text-taptik-ink opacity-60'}`}/>
                  <span className="hidden xl:block truncate tracking-tight">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-3 xl:p-4 border-t border-taptik-line flex flex-col gap-1 mt-auto bg-taptik-cream relative">
          {/* Usage Overview Popup */}
           <AnimatePresence>
             {isUsagePopupOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute bottom-full left-4 mb-2 w-80 taptik-glass rounded-[28px] overflow-hidden z-[100] p-6 origin-bottom-left"
               >
                  <div className="flex items-center justify-between mb-5">
                     <h4 className="text-[14px] font-black text-taptik-ink">用量概览</h4>
                     <div className="flex items-center gap-3">
                        <button className="text-[12px] font-bold text-taptik-moss hover:underline">查看详情</button>
                        <RefreshCw size={14} className="text-taptik-muted cursor-pointer hover:text-taptik-ink transition-colors" />
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
                              <span className="text-[13px] font-black text-taptik-ink">套餐内 Credits</span>
                              <span className="px-1.5 py-0.5 bg-success-100 text-taptik-moss text-[9px] font-black rounded uppercase tracking-wider">Teams</span>
                           </div>
                           <span className="text-[11px] font-bold text-taptik-muted">将于 2026年6月22日 续订</span>
                        </div>
                        
                        <div className="flex gap-0.5 h-2.5 mb-2.5">
                           {Array.from({ length: 24 }).map((_, i) => (
                             <div key={i} className={`flex-1 rounded-sm ${i < 12 ? 'bg-taptik-ember' : 'bg-taptik-cream border border-taptik-line/40'}`}></div>
                           ))}
                        </div>

                        <div className="flex justify-between items-baseline mb-1">
                           <div className="flex items-baseline gap-1">
                              <span className="text-[13px] font-black text-taptik-ink">978</span>
                              <span className="text-[11px] font-bold text-taptik-muted">/ 3000 (已使用 33%)</span>
                           </div>
                           <div className="flex items-baseline gap-1">
                              <span className="text-[11px] font-bold text-taptik-muted">剩余</span>
                              <span className="text-[13px] font-black text-taptik-ember">2022</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-taptik-line">
                        <div className="flex items-center justify-between">
                           <span className="text-[13px] font-black text-taptik-ink">共享资源包</span>
                           <div className="flex items-center gap-1.5 text-taptik-muted">
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
                 className="absolute bottom-full left-4 mb-2 w-64 taptik-glass rounded-[28px] overflow-hidden z-[100] p-2 origin-bottom-left"
               >
                  <div className="space-y-0.5">
                    {[
                      { icon: Settings, label: '设置' },
                      { icon: Compass, label: '界面语言', hasSub: true },
                      { icon: Clock, label: '主题', hasSub: true },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-taptik-cream/50 rounded-xl text-taptik-ink transition-colors">
                        <div className="flex items-center gap-2.5">
                          <item.icon size={16} className="text-taptik-muted" />
                          <span className="text-[13px] font-bold">{item.label}</span>
                        </div>
                        {item.hasSub && <ChevronRight size={14} className="text-taptik-muted" />}
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-taptik-line/50 my-1.5 mx-2"></div>
                  <div className="space-y-0.5">
                    {[
                      { icon: Star, label: '升级计划' },
                      { icon: BookOpen, label: '帮助文档' },
                      { icon: History, label: '更新日志' },
                      { icon: RefreshCw, label: '检查更新...' },
                      { icon: MessageSquare, label: '问题反馈' },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-taptik-cream/50 rounded-xl text-taptik-ink transition-colors">
                        <item.icon size={16} className="text-taptik-muted" />
                        <span className="text-[13px] font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-taptik-line/50 my-1.5 mx-2"></div>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-danger-50 rounded-xl text-danger-500 transition-colors">
                    <LogOut size={16} />
                    <span className="text-[13px] font-bold">退出登录</span>
                  </button>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="px-1 xl:px-2 py-3 mb-1 border-t border-taptik-line flex items-center justify-around xl:justify-start gap-1">
              <button 
                onClick={() => { setIsUsagePopupOpen(!isUsagePopupOpen); setIsSettingsPopupOpen(false); }}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isUsagePopupOpen ? 'text-taptik-ember bg-taptik-paper shadow-sm border border-taptik-ember/20' : 'text-taptik-muted hover:text-taptik-ink hover:bg-taptik-paper/50 border border-transparent'}`}
                title="用量概览"
              >
                 <Gauge size={20}/>
              </button>
              <button 
                onClick={() => { setActiveNav('management'); setIsUsagePopupOpen(false); setIsSettingsPopupOpen(false); }}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${activeNav === 'management' ? 'text-taptik-ember bg-taptik-paper shadow-sm border border-taptik-ember/20' : 'text-taptik-muted hover:text-taptik-ink hover:bg-taptik-paper/50 border border-transparent'}`}
                title="身份与矩阵"
              >
                 <Users size={20}/>
              </button>
              <button 
                onClick={() => { setIsSettingsPopupOpen(!isSettingsPopupOpen); setIsUsagePopupOpen(false); }}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isSettingsPopupOpen ? 'text-taptik-ember bg-taptik-paper shadow-sm border border-taptik-ember/20' : 'text-taptik-muted hover:text-taptik-ink hover:bg-taptik-paper/50 border border-transparent'}`}
                title="核心舱设置"
              >
                 <Settings size={20}/>
              </button>
           </div>

           <div className="flex items-center gap-3 p-1 xl:px-3 py-2 border-t border-taptik-line mt-1">
              <div className="w-10 h-10 rounded-full bg-taptik-paper border border-taptik-line flex items-center justify-center font-black text-taptik-ink text-[11px] shadow-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity">H</div>
              <div className="hidden xl:flex flex-1 min-w-0 flex-col">
                 <p className="text-[13px] font-black text-taptik-ink truncate tracking-tight">hua xu</p>
                 <p className="text-[11px] font-bold text-taptik-muted uppercase tracking-tighter opacity-60">Teams</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex-1 min-w-0 h-full bg-taptik-cream relative overflow-hidden">
        {selectedMerchant && (
          <div className="absolute top-4 right-8 z-[100]">
             <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900 text-white rounded-2xl shadow-2xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-[12px] font-black">正在管理: {selectedMerchant.name}</span>
                <button 
                  onClick={() => { setSelectedMerchant(null); setActiveNav('management'); }}
                  className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                  title="退出管理模式"
                >
                  <X size={14}/>
                </button>
             </div>
          </div>
        )}

        {activeNav === 'ai' && (
          <div className="flex-1 min-w-0 h-full flex relative z-10 bg-taptik-cream">
            {/* Sub Sidebar */}
            {subSidebarOpen && (
              <div className="w-[200px] xl:w-[260px] border-r border-taptik-line bg-taptik-cream flex flex-col h-full shrink-0 relative transition-all">
                <div className="border-b border-taptik-line shrink-0 px-2">
                  <div className="flex w-full mt-2 bg-taptik-paper/50 rounded-2xl p-1 border border-taptik-line/20 shadow-inner">
                    <button 
                      onClick={() => setAiSidebarTab('chat')} 
                      className={`flex items-center justify-center gap-2 py-2 flex-1 text-[12px] font-bold transition-all rounded-[12px] ${aiSidebarTab === 'chat' ? 'text-taptik-ink bg-taptik-paper shadow-sm' : 'text-taptik-muted hover:text-taptik-ink'}`}
                    >
                      <MessageSquare size={14} />
                      <span>历史</span>
                    </button>
                    <button 
                      onClick={() => setAiSidebarTab('files')} 
                      className={`flex items-center justify-center gap-2 py-2 flex-1 text-[12px] font-bold transition-all rounded-[12px] ${aiSidebarTab === 'files' ? 'text-taptik-ink bg-taptik-paper shadow-sm' : 'text-taptik-muted hover:text-taptik-ink'}`}
                    >
                      <Folder size={14} />
                      <span>文件</span>
                    </button>
                  </div>
                  <div className="h-4" />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-0 flex flex-col">
                  {aiSidebarTab === 'chat' ? (
                    <div className="p-2 flex flex-col gap-0.5">
                      {activeProject.chatHistory.map(h => (
                        <button key={h.id} className="w-full text-left flex flex-col gap-1 px-3 py-3 hover:bg-taptik-paper rounded-[18px] transition-colors group">
                          <div className="flex gap-2.5 items-center">
                            <MessageSquare size={14} className="text-taptik-muted group-hover:text-taptik-ember opacity-40 group-hover:opacity-100" />
                            <span className="text-[13px] font-bold text-taptik-muted group-hover:text-taptik-ink truncate">{h.title}</span>
                          </div>
                          <span className="text-[10px] text-taptik-muted opacity-40 pl-7 font-medium uppercase tracking-tighter">{h.time}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-[10px] font-black text-taptik-muted uppercase tracking-widest opacity-40">项目目录</div>
                      {activeProject.fileTree.map((node, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <button className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-taptik-paper rounded-xl group text-[13px] font-bold text-taptik-muted transition-colors text-left">
                            <Folder size={16} className="text-amber-400 fill-amber-400 shrink-0" />
                            <span className="truncate">{node.name}</span>
                          </button>
                          <div className="flex flex-col gap-0.5 ml-8">
                            {node.children.map((child: any, j: number) => (
                              <button key={j} className="flex items-center gap-2 px-2 py-1.5 hover:bg-taptik-paper rounded-xl group text-[13px] font-bold text-taptik-muted transition-colors text-left">
                                <FileIcon size={14} className="text-taptik-muted/30 shrink-0" />
                                <span className="truncate">{child.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat Content */}
            <div className="flex-1 flex flex-col h-full bg-taptik-cream relative">
              <div className="h-16 flex items-center justify-between px-6 border-b border-taptik-line bg-taptik-cream shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSubSidebarOpen(!subSidebarOpen)} className="text-taptik-muted hover:text-taptik-ember p-1.5 rounded-lg transition-colors">
                    <LayoutTemplate size={20} />
                  </button>
                  <div className="h-4 w-px bg-taptik-line" />
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[15px] font-black text-taptik-ink leading-none">
                          {messages.length === 0 ? '全域战略 Hub' : '深度决策会话'}
                        </h2>
                        {messages.length > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-success-50 text-taptik-moss rounded text-[10px] font-black uppercase tracking-tighter border border-taptik-moss/10">
                             Agent Active
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-taptik-muted font-bold tracking-wide uppercase opacity-60 mt-1">
                        {messages.length === 0 ? 'Awaiting Tactical Input' : `Context: ${activeProject.name}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {messages.length > 0 ? (
                    <div className="flex items-center gap-3">
                       <div className="flex -space-x-2">
                          {[Target, Workflow, Sparkles].map((Icon, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-taptik-paper border-2 border-taptik-cream flex items-center justify-center text-taptik-muted shadow-sm shadow-black/5">
                               <Icon size={14} />
                            </div>
                          ))}
                       </div>
                       <div className="w-px h-4 bg-taptik-line mx-1" />
                       <button onClick={() => setMessages([])} className="p-2 text-taptik-muted hover:text-danger-500 hover:bg-taptik-paper rounded-lg transition-all" title="清空会话"><Trash2 size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-taptik-paper rounded-[12px] border border-taptik-line">
                       <Zap size={14} className="text-taptik-ember fill-current" />
                       <span className="text-[11px] font-black text-taptik-muted uppercase tracking-widest opacity-60">L0 Intelligence Ready</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-0 relative bg-taptik-cream">
                 {messages.length === 0 ? (
                   <Workbench 
                     setActiveNav={setActiveNav} 
                     setDataSubNav={setDataSubNav} 
                     dataSubNav={dataSubNav}
                     onSend={(query) => {
                       setInputValue(query);
                       setTimeout(handleSend, 0);
                     }}
                   />
                 ) : (
                   <div className="max-w-4xl mx-auto space-y-6 pb-2 p-6">
                     {messages.map((msg, idx) => (
                       <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         {msg.role === 'user' ? (
                           <div className="flex flex-col items-end max-w-[90%]">
                             <div className="px-6 py-4 rounded-[28px] taptik-cta-gradient text-white shadow-lg shadow-taptik-ember/20 rounded-br-sm text-[15px] leading-relaxed font-bold">
                               {renderMessageContent(msg.content as string, msg.role)}
                             </div>
                           </div>
                         ) : (
                           <div className="max-w-[90%]">
                             <div className="flex items-center gap-2 mb-2 px-1">
                               <div className="w-6 h-6 rounded-lg taptik-cta-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-taptik-ember/20">L0</div>
                               <span className="text-[11px] font-black text-taptik-muted tracking-tight underline underline-offset-4 decoration-taptik-ember/30 uppercase">TAPTIK 决策引擎</span>
                             </div>
                             
                             {msg.thoughts && msg.thoughts.length > 0 && (
                               <ThoughtProcessAccordion thoughts={msg.thoughts} status={msg.status || 'completed'} />
                             )}

                             <div className="px-6 py-4 rounded-[28px] bg-taptik-paper border border-taptik-line shadow-sm text-[15px] text-taptik-ink leading-relaxed rounded-bl-sm font-medium">
                               {renderMessageContent(msg.content as string, msg.role)}
                             </div>

                             {msg.dynamicContent && (
                               <DynamicCanvasContainer content={msg.dynamicContent} />
                             )}
                           </div>
                         )}
                       </motion.div>
                     ))}
                     <div ref={chatEndRef} />
                   </div>
                 )}
              </div>

              {messages.length > 0 && (
                <div className="p-4 pt-0 shrink-0 max-w-5xl mx-auto w-full relative">
                   <AnimatePresence>{showMentionMenu && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-4 mb-2 w-72 bg-neutral-0 border border-neutral-200 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col p-1"><div className="px-3 py-2 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-100 bg-neutral-50 mb-1">调用 Skill 能力</div><div onClick={() => insertMention('KOC/KOS异构引擎', '@')} className="px-3 py-2 hover:bg-primary-50/10 hover:text-primary-500 rounded-lg cursor-pointer text-[13px] font-bold text-neutral-700 flex items-center gap-2 transition-colors"><Component size={14}/>KOC/KOS 异构引擎</div></motion.div>)}</AnimatePresence>

                   <div className="bg-neutral-0 rounded-[24px] border border-neutral-200 shadow-2xl shadow-neutral-900/5 overflow-hidden flex flex-col relative focus-within:border-primary-500/30 transition-all mb-4">
                      <textarea 
                        rows={2} 
                        value={inputValue} 
                        onChange={handleInputChange} 
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                        placeholder="继续下达指令、分析文件或调用 Skill ..." 
                        className="flex-1 min-h-[80px] pt-4 pb-2 px-6 resize-none bg-transparent text-[15px] font-medium focus:outline-none placeholder:text-neutral-300" 
                      />
                      
                      <div className="flex items-center justify-between px-4 pb-4">
                         <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 transition-all group">
                               <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
                               <span className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900">Agent Active</span>
                            </button>
                         </div>
                         
                         <div className="flex items-center gap-2">
                            <button className="p-2 text-neutral-300 hover:text-neutral-900 rounded-lg transition-all"><Plus size={18}/></button>
                            <button className="p-2 text-neutral-300 hover:text-neutral-900 rounded-lg transition-all"><Mic size={18}/></button>
                            <button 
                              onClick={handleSend} 
                              disabled={!inputValue.trim()} 
                              className="ml-2 w-10 h-10 rounded-xl bg-neutral-900 hover:bg-primary-500 disabled:bg-neutral-100 disabled:text-neutral-300 text-neutral-0 flex items-center justify-center transition-all shadow-lg"
                            >
                               <ArrowUp size={20} strokeWidth={3}/>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeNav === 'skills' && <SkillMarket creatingSkill={creatingSkill} setCreatingSkill={setCreatingSkill} skillMarketTab={skillMarketTab} setSkillMarketTab={setSkillMarketTab} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} />}
        {activeNav === 'files' && <FileManager filesTab={filesTab} setFilesTab={setFilesTab} activeProject={activeProject} activeDoc={activeDoc} setActiveDoc={setActiveDoc} />}
        {activeNav === 'management' && (
          <ServiceManagement 
            onSelectMerchant={(m: any) => { setSelectedMerchant(m); setActiveNav('ai'); setAiMode('workbench'); }} 
            selectedMerchant={selectedMerchant} 
            onBack={() => setSelectedMerchant(null)} 
          />
        )}
        {activeNav === 'settings' && <div className="p-10"><h1 className="text-2xl font-black mb-4">系统设置</h1><p className="text-neutral-500">正在针对商家生命周期做深度适配...</p></div>}
      </div>
    </div>
  );
}
