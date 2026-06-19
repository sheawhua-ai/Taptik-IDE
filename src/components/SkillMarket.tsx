import React from 'react';
import { 
  ChevronLeft, Check, Sparkles, UploadCloud, Cpu, Zap, User, Bot, 
  Send, Info, Settings, FlaskConical, Play, ShieldCheck, Box, Grid,
  Search, Plus, Infinity, Cloud, ArrowRight, Activity, Upload, LineChart,
  TrendingUp, Star, Users, ShoppingCart, ChevronRight, BarChart2, MessageSquare, Target, CreditCard, Save, BoxSelect, Coins, ArrowUpRight, X,
  Filter, Layers, Orbit, Dna, ShieldHalf, Route, Workflow, DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubagentChat } from './SubagentChat';

interface SkillMarketProps {
  creatingSkill: boolean;
  setCreatingSkill: (val: boolean) => void;
  skillMarketTab: 'my' | 'market';
  setSkillMarketTab: (val: 'my' | 'market') => void;
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
  const [showRevenueModal, setShowRevenueModal] = React.useState(false);
  const [showGitUploadModal, setShowGitUploadModal] = React.useState(false);
  const [showMarketUploadModal, setShowMarketUploadModal] = React.useState(false);

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
    const matchesSearch = sk.name.includes(searchQuery) || sk.desc.includes(searchQuery);
    const matchesCategory = activeCategory === 'all' || sk.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-0">
       {creatingSkill ? (
          <div className="flex-1 flex flex-col h-full bg-neutral-0">
              <SubagentChat 
                moduleId="builder" 
                moduleName="技能蒸馏构建器" 
                onClose={() => setCreatingSkill(false)} 
              />
          </div>
       ) : (
          <>
            <div className="flex-none p-6 px-10 border-b border-neutral-100 bg-neutral-0 shadow-sm relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">技能增强中心</h1>
                    <div className="flex bg-neutral-50 rounded-[14px] p-1 text-[13px] font-extrabold border border-neutral-200">
                       <button onClick={() => setSkillMarketTab('my')} className={`px-6 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'my' ? 'bg-white text-primary-500 shadow-sm' : 'text-neutral-500'}`}>我的技能</button>
                       <button onClick={() => setSkillMarketTab('market')} className={`px-6 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'market' ? 'bg-neutral-900 text-neutral-0 shadow-md' : 'text-neutral-500'}`}>技能市场</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setShowGitModal(true)} className="bg-neutral-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-black shadow-xl shadow-neutral-900/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
                         <Cloud size={16} /> 导入私有空间源
                     </button>
                     <button onClick={() => setCreatingSkill(true)} className="bg-primary-500 text-white px-6 py-2.5 rounded-2xl text-[13px] font-black shadow-xl shadow-primary-500/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
                         <Sparkles size={16} /> 构建专有 Skill
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
                     <div className="mb-6 flex items-center justify-between">
                        <div>
                           <h2 className="text-xl font-black text-neutral-900 tracking-tight">已本地化的技能套件</h2>
                           <p className="text-[12px] text-neutral-500 font-bold mt-1">管理您的已安装与自建技能包。</p>
                        </div>
                        <button onClick={() => setShowRevenueModal(true)} className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-[12px] font-black hover:bg-neutral-800 transition-all shadow-md">
                           <LineChart size={14} /> 收益变现概览
                        </button>
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-20">
                     {(skillMarketTab === 'market' ? filteredSkills : MY_SKILLS).map(sk => (
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
                              {skillMarketTab === 'my' && sk.isSelfCreated ? (
                                <div className="flex items-center gap-2">
                                   <button onClick={(e) => { e.stopPropagation(); setShowGitUploadModal(true); }} className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1.5"><Cloud size={12}/> 分发 Git</button>
                                   <button onClick={(e) => { e.stopPropagation(); setShowMarketUploadModal(true); }} className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1.5"><ShoppingCart size={12}/> 提交上架</button>
                                </div>
                              ) : (
                                <ArrowUpRight size={14} className="text-neutral-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              )}
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
              {showRevenueModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowRevenueModal(false)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-0 w-full max-w-md rounded-[32px] p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowRevenueModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"><X size={24}/></button>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-900"><LineChart size={20} /></div>
                       <h2 className="text-xl font-black text-neutral-900 tracking-tight">自建技能变现概览</h2>
                    </div>
                    <div className="space-y-4">
                       <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                          <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mb-1">累计变现收入</p>
                          <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-black text-neutral-900">￥12,450</span>
                             <span className="text-[14px] font-bold text-neutral-500">.50</span>
                          </div>
                       </div>
                       <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                          <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mb-1">待解锁门槛任务</p>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 font-black">
                                <span className="text-2xl text-primary-500">1</span>
                                <span className="text-[14px] text-neutral-500 font-bold">个需要完善</span>
                             </div>
                             <button className="text-[12px] bg-white border border-neutral-200 px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-neutral-50">去完成</button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              {showGitUploadModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowGitUploadModal(false)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-0 w-full max-w-[480px] rounded-[32px] p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                     <button onClick={() => setShowGitUploadModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"><X size={24}/></button>
                     <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-neutral-100 rounded-2xl mx-auto flex items-center justify-center text-neutral-900 mb-4 shadow-inner">
                           <UploadCloud size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">生成 Git 私有链接</h2>
                        <p className="text-[13px] text-neutral-500 font-bold px-4">您的本地技能将被打包为加密 Zip，并在私有云端生成临时分发链接。</p>
                     </div>
                     <div className="space-y-4">
                        <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-between">
                           <span className="text-[12px] font-black text-primary-600 truncate mr-4">https://registry.example.com/team-x/b8a2...</span>
                           <button className="whitespace-nowrap px-3 py-1.5 bg-white shadow-sm rounded-lg text-[12px] font-black text-neutral-700">复制链接</button>
                        </div>
                        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between">
                           <span className="text-[12px] font-black text-neutral-500 uppercase tracking-widest">校验码：X8K9-M2N1-P0Q3</span>
                           <button className="whitespace-nowrap px-3 py-1.5 bg-white shadow-sm rounded-lg text-[12px] font-black text-neutral-700">复制密码</button>
                        </div>
                     </div>
                     <button onClick={() => setShowGitUploadModal(false)} className="w-full bg-neutral-900 text-white rounded-2xl py-4 text-[14px] font-black shadow-xl mt-8 flex justify-center items-center gap-2 hover:bg-neutral-800 transition-all">
                        完成并关闭
                     </button>
                  </motion.div>
                </motion.div>
              )}
              {showMarketUploadModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowMarketUploadModal(false)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-0 w-full max-w-[480px] rounded-[32px] p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                     <button onClick={() => setShowMarketUploadModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"><X size={24}/></button>
                     <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl mx-auto flex items-center justify-center text-primary-500 mb-4">
                           <ShoppingCart size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">提交上架审核</h2>
                        <p className="text-[13px] text-neutral-500 font-bold px-4">您的技能将被提交至平台官方技能市场，通过审核后即可对所有商户公开并产生收益。</p>
                     </div>
                     <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 mb-8">
                        <h4 className="text-[11px] font-black text-neutral-900 uppercase mb-3">平台审核规范要求：</h4>
                        <ul className="space-y-2 text-[12px] text-neutral-600 font-bold">
                           <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> 无违规代码与数据盗取逻辑</li>
                           <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> 在最近 50 次测试用例中可用率 {'>'} 95%</li>
                           <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> 完整填写接入指南与能力摘要</li>
                        </ul>
                     </div>
                     <button onClick={() => setShowMarketUploadModal(false)} className="w-full bg-primary-500 text-white rounded-2xl py-4 text-[14px] font-black shadow-xl flex justify-center items-center gap-2 hover:bg-primary-600 transition-all">
                        <Upload size={18} /> 确认提交审核
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
