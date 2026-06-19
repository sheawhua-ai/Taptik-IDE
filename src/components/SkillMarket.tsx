import React from 'react';
import { 
  ChevronLeft, Check, Sparkles, UploadCloud, Cpu, Zap, User, Bot, 
  Send, Info, Settings, FlaskConical, Play, ShieldCheck, Box, Grid,
  Search, Plus, Infinity, Cloud, ArrowRight, Activity, Upload, LineChart,
  TrendingUp, Star, Users, ShoppingCart, ChevronRight, BarChart2, MessageSquare, Target, CreditCard, Save, BoxSelect, Coins, ArrowUpRight, X,
  Filter, Layers, Orbit, Dna, ShieldHalf, Route, Workflow, DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkillMarketProps {
  creatingSkill: boolean;
  setCreatingSkill: (val: boolean) => void;
  skillMarketTab: string;
  setSkillMarketTab: (val: string) => void;
  selectedSkill: any;
  setSelectedSkill: (val: any) => void;
}

export const SkillMarket: React.FC<SkillMarketProps> = ({
  creatingSkill,
  setCreatingSkill,
  skillMarketTab,
  setSkillMarketTab,
  selectedSkill,
  setSelectedSkill
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [showGitModal, setShowGitModal] = React.useState(false);

  const MARKET_SKILLS = [
    { id: 'expert_agent_1', name: '李佳琦级带货大师', category: 'agent', price: '￥999/月', stats: '2k+', desc: '经过 1000+ 场头部主播直播切片训练的带货 Agent，强驱动转化逻辑。', author: 'Top Expert Network', icon: Bot },
    { id: 'expert_agent_2', name: '美妆爆款写手矩阵', category: 'agent', price: '￥399/月', stats: '5k+', desc: '小红书头部 MCN 内部数据蒸馏的员工 Agent，擅长多账号铺量分发。', author: 'Beauty MCN', icon: Bot },
    { id: 'rag_node', name: '全域 RAG 知识中心', category: 'data', price: '￥0.05/次', stats: '1.2w+', desc: '实时检索品牌私域文档，减少 AI 幻觉，确保输出合规。', author: 'Zenith Labs', icon: Filter },
    { id: 'attribution', name: '全链路 ROI 归因', category: 'data', price: '￥199/月', stats: '8k+', desc: '打通前后端转化的归因模型，自动生成投放效能分析报表。', author: 'Zenith Data', icon: Target },
    { id: 'xhs_matrix', name: 'KOC 异构矩阵引擎', category: 'content', price: '￥0.12/篇', stats: '2.5w+', desc: '支持视觉级别异构，一键生成千人千面的差异化笔记内容。', author: 'Official', icon: Layers },
    { id: 'visual_ops', name: '视觉脱敏 Mutator', category: 'vision', price: '￥0.02/图', stats: '4.1w+', desc: '深度物理级去重，绕过平台 MD5 与相似度检测，确保首发权重。', author: 'Official', icon: Dna },
    { id: 'copy_distill', name: '爆文逻辑蒸馏器', category: 'content', price: '免费', stats: '9k+', desc: '输入 5 篇对标笔记，自动提取其情绪钩子、排版逻辑与关键词分布。', author: 'AIGC Creator', icon: Filter },
  ];

  const MY_SKILLS = [
    { 
      id: 'my_1', 
      name: '全域视觉去重工具', 
      category: 'vision', 
      price: '免费', 
      stats: '42 / 500', 
      desc: '基于视觉特征哈希的深度去重，当前处于冷启动期。', 
      author: 'hua xu', 
      progress: 8.4, 
      icon: Dna,
      isSelfCreated: true,
      revenue: 0,
      calls: 42,
      targetCalls: 500
    },
    {
      id: 'my_2',
      name: 'AI 爆文逻辑蒸馏器',
      category: 'content',
      price: '￥0.05/次',
      stats: '1.2w+',
      desc: '输入 5 篇对标笔记，自动提取其情绪钩子、排版逻辑与关键词分布。',
      author: 'hua xu',
      progress: 100,
      icon: Filter,
      isSelfCreated: true,
      revenue: 12450.50,
      calls: 12400,
      targetCalls: 500
    },
    { 
      id: 'expert_agent_2', 
      name: '美妆爆款写手矩阵', 
      category: 'agent', 
      price: '￥399/月', 
      stats: '5k+', 
      desc: '小红书头部 MCN 内部数据蒸馏的员工 Agent，擅长多账号铺量分发。', 
      author: 'Beauty MCN', 
      icon: Bot,
      isSelfCreated: false
    },
  ];

  const CATEGORIES = [
    { id: 'all', name: '全部商品', icon: Grid },
    { id: 'agent', name: '行业专家 Agent', icon: Bot },
    { id: 'content', name: '内容模型', icon: Filter },
    { id: 'vision', name: '视觉策略', icon: Dna },
    { id: 'data', name: '数据归因', icon: Target },
  ];

  const filteredSkills = MARKET_SKILLS.filter(sk => {
    let isTabMatch = false;
    if (skillMarketTab === 'agent' || skillMarketTab === 'group') {
      isTabMatch = sk.category === 'agent';
    } else if (skillMarketTab === 'skill') {
      isTabMatch = sk.category !== 'agent' && sk.category !== 'mcp';
    } else if (skillMarketTab === 'mcp') {
      isTabMatch = sk.category === 'mcp';
    } else {
      isTabMatch = true;
    }

    const matchesSearch = sk.name.includes(searchQuery) || sk.desc.includes(searchQuery);
    const matchesCategory = activeCategory === 'all' || sk.category === activeCategory;
    return matchesSearch && matchesCategory && isTabMatch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-0">
       {creatingSkill ? (
          <div className="flex-1 flex flex-col h-full bg-neutral-50/50">
             {/* Header */}
             <div className="p-4 px-6 border-b border-neutral-200 bg-neutral-0 flex items-center justify-between shrink-0 shadow-sm relative z-10">
                <div className="flex items-center gap-4">
                   <button onClick={() => setCreatingSkill(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"><ChevronLeft size={16}/></button>
                   <div>
                      <h1 className="text-lg font-black text-neutral-900 flex items-center gap-2">工作流技能蒸馏构建器 <span className="text-[10px] bg-primary-50 text-primary-500 px-1.5 py-0.5 rounded uppercase font-bold">Stable v2.1</span></h1>
                      <p className="text-[11px] text-neutral-500 font-medium">描述运营需求，或上传 .md 指令集进行能力蒸馏。</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="bg-neutral-100 text-neutral-600 px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-neutral-200 transition-colors">保存草稿</button>
                   <button className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-sm flex items-center gap-2 transition-all">
                      <Check size={16}/> 部署上架
                   </button>
                </div>
             </div>

             {/* Body */}
             <div className="flex-1 flex h-0 overflow-hidden">
                <div className="w-1/2 border-r border-neutral-200 bg-neutral-0 flex flex-col">
                   <div className="p-6 border-b border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
                      <h3 className="text-[14px] font-black text-neutral-800 flex items-center gap-2"><Sparkles size={16} className="text-primary-500"/> 自然语言构建 & SOP 导入</h3>
                      <button className="px-4 py-2 bg-primary-50 text-primary-500 border border-primary-100 rounded-xl text-[12px] font-black flex items-center gap-2 hover:bg-primary-100 transition-all">
                         <UploadCloud size={14}/> 导入专家 .md
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 relative overflow-hidden group">
                         <h4 className="text-[12px] font-black text-primary-500 mb-3 flex items-center gap-2 italic uppercase">
                            <Zap size={14} className="fill-primary-500" /> 推荐落地方案：
                         </h4>
                         <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-neutral-0/60 rounded-xl border border-primary-100">
                               <div className="text-[11px] font-black text-neutral-700">RPA 自动化套件</div>
                               <button className="text-[11px] font-black text-white bg-primary-500 px-3 py-1.5 rounded-lg">选用</button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-neutral-100">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0"><User size={18}/></div>
                            <div className="bg-neutral-100/80 rounded-2xl p-4 text-[13px] text-neutral-800 leading-relaxed font-medium">我想要一个能根据产品功效，自动生成不同平台种草文案的工具。</div>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shrink-0 shadow-lg"><Bot size={18}/></div>
                            <div className="bg-primary-50/50 border border-primary-100 rounded-[24px] p-5 text-[13px] text-neutral-800 leading-relaxed shadow-sm">
                               <p className="font-bold mb-3">解析完成！为您构建以下表单：</p>
                               <div className="space-y-2">
                                  <div className="p-3 bg-neutral-0 rounded-xl text-[12px] font-black border border-primary-100">• 产品核心卖点 (Textarea)</div>
                                  <div className="p-3 bg-neutral-0 rounded-xl text-[12px] font-black border border-primary-100">• 目标情绪风格 (Select)</div>
                                </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 border-t border-neutral-100">
                      <div className="relative group">
                         <textarea className="w-full h-28 border border-neutral-200 rounded-[20px] p-4 pr-16 text-[13px] resize-none focus:outline-none focus:border-primary-500 bg-neutral-50" placeholder="描述修改建议..."></textarea>
                         <button className="absolute right-4 bottom-4 w-10 h-10 flex items-center justify-center bg-primary-500 text-white rounded-xl shadow-lg hover:bg-primary-600 transition-all">
                            <Send size={18}/>
                          </button>
                      </div>
                   </div>
                </div>

                 <div className="flex-1 bg-neutral-50 p-12 flex flex-col items-center overflow-y-auto relative custom-scrollbar">
                    <div className="w-full max-w-2xl space-y-12 pb-24">
                       {/* UI Preview Section */}
                       <div className="max-w-[420px] mx-auto">
                          <div className="bg-neutral-0 rounded-[32px] shadow-2xl border border-neutral-200/50 overflow-hidden min-h-[500px]">
                             <div className="bg-neutral-900 p-7 pb-8 text-neutral-0 relative">
                                <h2 className="text-xl font-black tracking-tight">AI 种草文案引擎</h2>
                                <p className="text-[12px] opacity-60 mt-1 font-medium">全平台爆款逻辑蒸馏</p>
                             </div>
                             <div className="p-8 space-y-6 bg-neutral-0 rounded-t-[32px] -mt-6 relative z-20">
                                <div className="space-y-2.5">
                                   <label className="text-[12px] font-black text-neutral-700 block px-1">产品核心卖点 *</label>
                                   <textarea className="w-full border border-neutral-200 rounded-2xl p-4 text-[13px] h-[100px] resize-none outline-none focus:border-primary-500 bg-neutral-0 transition-all" />
                                </div>
                                <div className="space-y-2.5">
                                   <label className="text-[12px] font-black text-neutral-700 block px-1">目标情绪风格 *</label>
                                   <select className="w-full border border-neutral-200 rounded-2xl p-3.5 text-[13px] font-bold outline-none focus:border-primary-500 bg-neutral-0 transition-all appearance-none">
                                      <option value="">点击选择风格...</option>
                                      <option>纯干货输出</option>
                                      <option>感性发声</option>
                                   </select>
                                </div>
                                <button className="w-full bg-primary-500 text-white py-4 rounded-2xl text-[14px] font-black shadow-xl flex justify-center items-center gap-3 hover:bg-primary-600 transition-all">
                                   <Play size={16} className="fill-current" /> 一键生成内容
                                </button>
                             </div>
                          </div>
                          <p className="text-center text-[11px] text-neutral-400 font-bold mt-4 uppercase tracking-widest">交互式 UI 预览</p>
                       </div>

                       {/* Monetization & Config Section */}
                       <div className="bg-neutral-0 rounded-[32px] p-10 border border-neutral-200 shadow-sm relative overflow-hidden group">
                          <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                             <Coins size={120} className="text-primary-500" />
                          </div>
                          <div className="relative z-10">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                   <h3 className="text-xl font-black text-neutral-900 tracking-tight">商业化准入配置</h3>
                                   <p className="text-[12px] text-neutral-400 font-bold mt-1">设置您的 Skill 变现规则（需满足平台门槛）</p>
                                </div>
                                <div className="px-4 py-2 bg-warning-50 text-warning-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-warning-100 flex items-center gap-2">
                                   <Activity size={14}/> 准入阈值：500 次
                                </div>
                             </div>

                             <div className="bg-neutral-50 border border-neutral-200/50 rounded-2xl p-6 mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                   <div className="w-8 h-8 bg-neutral-900 text-neutral-0 rounded-lg flex items-center justify-center text-[10px] font-black">!</div>
                                   <p className="text-[12px] text-neutral-600 font-bold">
                                      根据平台协议，您的新 Skill 在累计获得 <span className="text-neutral-900">500 次</span> 调用前将保持 <span className="text-success-500">免费开源状态</span>。
                                   </p>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                                   <div className="h-full bg-neutral-400 w-[0%] rounded-full" />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40 pointer-events-none grayscale">
                                <div className="p-5 border-2 border-neutral-100 rounded-2xl flex flex-col gap-3 bg-neutral-50">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[13px] font-black text-neutral-900">按次计费</span>
                                      <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                                   </div>
                                   <div className="flex items-baseline gap-1">
                                      <span className="text-[11px] font-bold text-neutral-400">建议定价：</span>
                                      <span className="text-[12px] font-black text-neutral-900">￥0.05 ~ 0.5</span>
                                   </div>
                                </div>
                                <div className="p-5 border-2 border-neutral-100 rounded-2xl flex flex-col gap-3 bg-neutral-50">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[13px] font-black text-neutral-900">按月订阅</span>
                                      <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                                   </div>
                                   <div className="flex items-baseline gap-1">
                                      <span className="text-[11px] font-bold text-neutral-400">建议定价：</span>
                                      <span className="text-[12px] font-black text-neutral-900">￥99 ~ 299</span>
                                   </div>
                                </div>
                             </div>

                             <p className="text-[10px] text-neutral-400 font-bold mt-6 text-center italic">达成 500 次调用后，以上定价选项将自动激活</p>
                          </div>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       ) : (
          <>
            <div className="flex-none p-6 px-10 border-b border-neutral-100 bg-neutral-0 shadow-sm relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">专家与技能 Hub</h1>
                    <div className="flex bg-neutral-50 rounded-[14px] p-1 text-[13px] font-extrabold border border-neutral-200">
                       <button onClick={() => setSkillMarketTab('agent')} className={`px-5 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'agent' ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>专家</button>
                       <button onClick={() => setSkillMarketTab('group')} className={`px-5 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'group' ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>专家团</button>
                       <button onClick={() => setSkillMarketTab('skill')} className={`px-5 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'skill' ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>技能</button>
                       <button onClick={() => setSkillMarketTab('mcp')} className={`px-5 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'mcp' ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>连接器</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setSkillMarketTab('my')} className={`px-5 py-2 rounded-xl text-[13px] font-black border transition-all ${skillMarketTab === 'my' ? 'bg-neutral-900 text-white border-neutral-900 shadow-md' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}`}>
                       已购/我的资源
                     </button>
                     <div className="w-[1px] h-6 bg-neutral-200" />
                     <button onClick={() => setShowGitModal(true)} className="bg-neutral-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-black shadow-xl shadow-neutral-900/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
                         <Cloud size={16} /> 导入私有源
                     </button>
                     <button onClick={() => setCreatingSkill(true)} className="bg-primary-500 text-white px-6 py-2.5 rounded-2xl text-[13px] font-black shadow-xl shadow-primary-500/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
                         <Sparkles size={16} /> 构建资产
                     </button>
                  </div>
               </div>

               <div className="flex items-center gap-8">
                  <div className="relative flex-1 max-w-md">
                     <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                     <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索能力、场景、或具体技能..." 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 pl-12 pr-4 text-[14px] font-bold focus:outline-none focus:bg-neutral-0 focus:ring-4 focus:ring-neutral-100 transition-all" 
                     />
                  </div>
                  <div className="flex gap-2">
                     {CATEGORIES.map(cat => (
                        <button 
                           key={cat.id} 
                           onClick={() => setActiveCategory(cat.id)}
                           className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-neutral-900 text-white shadow-lg' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                        >
                           <cat.icon size={16} /> {cat.name}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
               <div className="max-w-7xl mx-auto">
                  {skillMarketTab === 'my' && (
                     <div className="mb-8 bg-neutral-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                           <Workflow size={180} className="text-primary-500" />
                        </div>
                        <div className="relative z-10 max-w-xl">
                           <div className="flex items-center gap-2 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                              <ShieldCheck size={12} /> 开发者工作台
                           </div>
                           <h2 className="text-2xl font-black tracking-tight mb-4 leading-tight">自建技能变现概览</h2>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 p-4 rounded-[20px] border border-white/10 backdrop-blur-sm">
                                 <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">累计变现收入</p>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white">￥12,450</span>
                                    <span className="text-[12px] font-bold text-neutral-400">.50</span>
                                 </div>
                              </div>
                              <div className="bg-white/5 p-4 rounded-[20px] border border-white/10 backdrop-blur-sm">
                                 <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">待解锁门槛</p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-warning-400">1</span>
                                    <span className="text-[12px] font-bold text-neutral-400">个任务</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-20">
                     {(skillMarketTab === 'my' ? MY_SKILLS : filteredSkills).map(sk => (
                        <div key={sk.id} onClick={() => setSelectedSkill(sk)} className="flex flex-col p-5 rounded-3xl border border-neutral-100 hover:border-primary-500/30 hover:bg-primary-50/20 transition-all cursor-pointer group bg-neutral-0 shadow-sm hover:shadow-xl relative overflow-hidden">
                           <div className="flex items-start justify-between mb-4">
                              {sk.icon && (
                                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all flex-shrink-0">
                                  <sk.icon size={20} />
                                </div>
                              )}
                              <div className="text-[14px] font-black text-neutral-900 group-hover:text-primary-500 transition-colors uppercase tracking-tighter">{sk.price}</div>
                           </div>
                           
                           <div className="space-y-1.5 flex-1">
                              <h3 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                                 {sk.name}
                              </h3>
                              <p className="text-[11px] text-neutral-500 font-bold leading-relaxed line-clamp-2">{sk.desc}</p>
                           </div>

                           <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                 <span className="text-primary-500">{sk.stats} 活跃</span>
                              </div>
                              <ArrowUpRight size={14} className="text-neutral-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <AnimatePresence>
              {selectedSkill && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedSkill(null)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-0 w-full max-w-2xl rounded-[40px] p-12 relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedSkill(null)} className="absolute top-8 right-10 text-neutral-400 hover:text-neutral-900 transition-colors"><X size={28}/></button>
                    <div className="mb-10">
                       <span className="text-[11px] font-black text-primary-500 uppercase tracking-[0.2em] mb-3 block">专家级能力节点</span>
                       <h2 className="text-3xl font-black text-neutral-900 mb-2 leading-tight">{selectedSkill.name}</h2>
                       <div className="flex gap-4 mt-4">
                          <span className="px-3 py-1.5 bg-neutral-50 text-neutral-500 text-[11px] font-bold rounded-lg border border-neutral-100 flex items-center gap-1.5"><Users size={14}/> {selectedSkill.stats} 安装量</span>
                          <span className="px-3 py-1.5 bg-neutral-50 text-neutral-500 text-[11px] font-bold rounded-lg border border-neutral-100 flex items-center gap-1.5"><Activity size={14}/> 99.9% 后端可用率</span>
                       </div>
                    </div>
                    
                    <div className="space-y-6 mb-12 capitalize">
                       <div className="bg-neutral-50 p-6 rounded-[28px] border border-neutral-100">
                          <h4 className="text-[12px] font-black text-neutral-400 mb-3 uppercase tracking-widest">核心逻辑摘要</h4>
                          <p className="text-[14px] text-neutral-700 font-bold leading-relaxed">{selectedSkill.desc}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                             <h5 className="text-[10px] font-black text-neutral-400 uppercase mb-1">计费方式</h5>
                             <p className="text-[14px] font-black text-neutral-900">{selectedSkill.price}</p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                             <h5 className="text-[10px] font-black text-neutral-400 uppercase mb-1">分类</h5>
                             <p className="text-[14px] font-black text-primary-500 uppercase">{selectedSkill.category}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-0 py-5 rounded-3xl font-black text-[15px] shadow-2xl transition-all active:scale-95">开启并挂载此技能</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              {showGitModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowGitModal(false)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-0 w-full max-w-[480px] rounded-[32px] p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                     <button onClick={() => setShowGitModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"><X size={24}/></button>
                     <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-neutral-100 rounded-2xl mx-auto flex items-center justify-center text-neutral-900 mb-4 shadow-inner">
                           <Cloud size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">获取私有空间源</h2>
                        <p className="text-[13px] text-neutral-500 font-bold px-4">请输入团队内部分发的私有链接与校验秘钥，将技能同步至您的本地工作台。</p>
                     </div>
                     <div className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-[12px] font-black text-neutral-700 block px-1">安全链接 (Registry Link)</label>
                           <input type="text" placeholder="https://registry.example.com/team-x/..." className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-[13px] outline-none focus:border-primary-500 focus:bg-white transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[12px] font-black text-neutral-700 block px-1">同步校验码 (Password/Token)</label>
                           <input type="password" placeholder="••••••••••••" className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-[13px] outline-none focus:border-primary-500 focus:bg-white transition-all font-bold" />
                        </div>
                     </div>
                     <button onClick={() => setShowGitModal(false)} className="w-full bg-primary-500 text-white rounded-2xl py-4 text-[14px] font-black shadow-xl mt-8 flex justify-center items-center gap-2 hover:bg-primary-600 transition-all">
                        <DownloadCloud size={18} /> 校验并同步至本地
                     </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
       )}
    </div>
  );
};
