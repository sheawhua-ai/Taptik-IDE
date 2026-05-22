import React from 'react';
import { 
  ChevronLeft, Check, Sparkles, UploadCloud, Cpu, Zap, User, Bot, 
  Send, Info, Settings, FlaskConical, Play, ShieldCheck, Box, Grid,
  Search, Plus, Infinity, Cloud, ArrowRight, Activity, Upload, LineChart,
  TrendingUp, Star, Users, ShoppingCart, ChevronRight, BarChart2, MessageSquare, Target, CreditCard, Save, BoxSelect, Coins, ArrowUpRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  const MARKET_SKILLS = [
    { id: 'rag_node', name: '全域 RAG 知识中心', category: 'data', price: '￥0.05/次', stats: '1.2w+', desc: '实时检索品牌私域文档，减少 AI 幻觉，确保输出合规。', author: 'Zenith Labs' },
    { id: 'attribution', name: '全链路 ROI 归因', category: 'data', price: '￥199/月', stats: '8k+', desc: '打通前后端转化的归因模型，自动生成投放效能分析报表。', author: 'Zenith Data' },
    { id: 'xhs_matrix', name: 'KOC 异构矩阵引擎', category: 'content', price: '￥0.12/篇', stats: '2.5w+', desc: '支持视觉级别异构，一键生成千人千面的差异化笔记内容。', author: 'Official' },
    { id: 'visual_ops', name: '视觉脱敏 Mutator', category: 'vision', price: '￥0.02/图', stats: '4.1w+', desc: '深度物理级去重，绕过平台 MD5 与相似度检测，确保首发权重。', author: 'Official' },
    { id: 'copy_distill', name: '爆文逻辑蒸馏器', category: 'content', price: '免费', stats: '9k+', desc: '输入 5 篇对标笔记，自动提取其情绪钩子、排版逻辑与关键词分布。', author: 'AIGC Creator' },
    { id: 'customer_seg', name: '高潜客群动态分群', category: 'data', price: '￥299/月', stats: '3w+', desc: '基于实时公域行为数据，为品牌动态标记核心决策客群。', author: 'Market Intelligence' },
  ];

  const MY_SKILLS = [
    { id: 'my_1', name: '全域视觉去重工具', category: 'vision', price: '免费', stats: '42 / 500', desc: '基于视觉特征哈希的深度去重，当前处于冷启动期。', author: 'hua xu', progress: 42 },
  ];

  const CATEGORIES = [
    { id: 'all', name: '全部能力' },
    { id: 'content', name: '内容创意' },
    { id: 'vision', name: '视觉生成' },
    { id: 'data', name: '数据决策' },
  ];

  const filteredSkills = MARKET_SKILLS.filter(sk => {
    const matchesSearch = sk.name.includes(searchQuery) || sk.desc.includes(searchQuery);
    const matchesCategory = activeCategory === 'all' || sk.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
       {creatingSkill ? (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             {/* Header */}
             <div className="p-4 px-6 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                <div className="flex items-center gap-4">
                   <button onClick={() => setCreatingSkill(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"><ChevronLeft size={16}/></button>
                   <div>
                      <h1 className="text-lg font-black text-zinc-900 flex items-center gap-2">工作流技能蒸馏大模型构建器 <span className="text-[10px] bg-[#685FAB]/10 text-[#685FAB] px-1.5 py-0.5 rounded uppercase font-bold">Stable v2.1</span></h1>
                      <p className="text-[11px] text-zinc-500 font-medium">描述运营需求，或上传 .md 指令集进行能力蒸馏。</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-zinc-200 transition-colors">保存草稿</button>
                   <button className="bg-[#685FAB] hover:bg-[#504886] text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-sm flex items-center gap-2 transition-all">
                      <Check size={16}/> 部署上架
                   </button>
                </div>
             </div>

             {/* Body */}
             <div className="flex-1 flex h-0 overflow-hidden">
                <div className="w-1/2 border-r border-zinc-200 bg-white flex flex-col">
                   <div className="p-6 border-b border-zinc-100 bg-zinc-50/30 flex items-center justify-between">
                      <h3 className="text-[14px] font-black text-zinc-800 flex items-center gap-2"><Sparkles size={16} className="text-[#685FAB]"/> 自然语言构建 & SOP 导入</h3>
                      <button className="px-4 py-2 bg-[#685FAB]/5 text-[#685FAB] border border-[#685FAB]/20 rounded-xl text-[12px] font-black flex items-center gap-2 hover:bg-[#685FAB]/10 transition-all">
                         <UploadCloud size={14}/> 导入专家 .md
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="bg-[#685FAB]/5 border border-[#685FAB]/10 rounded-2xl p-5 relative overflow-hidden group">
                         <h4 className="text-[12px] font-black text-[#685FAB] mb-3 flex items-center gap-2 italic uppercase">
                            <Zap size={14} className="fill-[#685FAB]" /> 推荐落地方案：
                         </h4>
                         <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-[#685FAB]/10">
                               <div className="text-[11px] font-black text-zinc-700">RPA 自动化套件</div>
                               <button className="text-[11px] font-black text-white bg-[#685FAB] px-3 py-1.5 rounded-lg">选用</button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-zinc-100">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0"><User size={18}/></div>
                            <div className="bg-zinc-100/80 rounded-2xl p-4 text-[13px] text-zinc-800 leading-relaxed font-medium">我想要一个能根据产品功效，自动生成不同平台种草文案的工具。</div>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#685FAB] to-[#504886] flex items-center justify-center text-white shrink-0 shadow-lg"><Bot size={18}/></div>
                            <div className="bg-[#EDEAF2]/50 border border-[#685FAB]/10 rounded-[24px] p-5 text-[13px] text-zinc-800 leading-relaxed shadow-sm">
                               <p className="font-bold mb-3">解析完成！为您构建以下表单：</p>
                               <div className="space-y-2">
                                  <div className="p-3 bg-white rounded-xl text-[12px] font-black border border-[#685FAB]/10">• 产品核心卖点 (Textarea)</div>
                                  <div className="p-3 bg-white rounded-xl text-[12px] font-black border border-[#685FAB]/10">• 目标情绪风格 (Select)</div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 border-t border-zinc-200">
                      <div className="relative group">
                         <textarea className="w-full h-28 border border-zinc-200 rounded-[20px] p-4 pr-16 text-[13px] resize-none focus:outline-none focus:border-[#685FAB] bg-zinc-50" placeholder="描述修改建议..."></textarea>
                         <button className="absolute right-4 bottom-4 w-10 h-10 flex items-center justify-center bg-[#685FAB] text-white rounded-xl shadow-lg hover:bg-[#504886] transition-all">
                            <Send size={18}/>
                          </button>
                      </div>
                   </div>
                </div>

                 <div className="flex-1 bg-zinc-50 p-12 flex flex-col items-center overflow-y-auto relative custom-scrollbar">
                    <div className="w-full max-w-2xl space-y-12 pb-24">
                       {/* UI Preview Section */}
                       <div className="max-w-[420px] mx-auto">
                          <div className="bg-white rounded-[32px] shadow-2xl border border-zinc-200/50 overflow-hidden min-h-[500px]">
                             <div className="bg-zinc-900 p-7 pb-8 text-white relative">
                                <h2 className="text-xl font-black tracking-tight">AI 种草文案引擎</h2>
                                <p className="text-[12px] opacity-60 mt-1 font-medium">全平台爆款逻辑蒸馏</p>
                             </div>
                             <div className="p-8 space-y-6 bg-white rounded-t-[32px] -mt-6 relative z-20">
                                <div className="space-y-2.5">
                                   <label className="text-[12px] font-black text-zinc-700 block px-1">产品核心卖点 *</label>
                                   <textarea className="w-full border border-zinc-200 rounded-2xl p-4 text-[13px] h-[100px] resize-none outline-none focus:border-[#685FAB] bg-white transition-all" />
                                </div>
                                <div className="space-y-2.5">
                                   <label className="text-[12px] font-black text-zinc-700 block px-1">目标情绪风格 *</label>
                                   <select className="w-full border border-zinc-200 rounded-2xl p-3.5 text-[13px] font-bold outline-none focus:border-[#685FAB] bg-white transition-all appearance-none">
                                      <option value="">点击选择风格...</option>
                                      <option>纯干货输出</option>
                                      <option>感性发声</option>
                                   </select>
                                </div>
                                <button className="w-full bg-[#685FAB] text-white py-4 rounded-2xl text-[14px] font-black shadow-xl flex justify-center items-center gap-3 hover:bg-[#504886] transition-all">
                                   <Play size={16} className="fill-current" /> 一键生成内容
                                </button>
                             </div>
                          </div>
                          <p className="text-center text-[11px] text-zinc-400 font-bold mt-4 uppercase tracking-widest">Interactive UI Preview</p>
                       </div>

                       {/* Monetization & Config Section */}
                       <div className="bg-white rounded-[32px] p-10 border border-zinc-200 shadow-sm relative overflow-hidden group">
                          <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                             <Coins size={120} className="text-[#685FAB]" />
                          </div>
                          <div className="relative z-10">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                   <h3 className="text-xl font-black text-zinc-900 tracking-tight">商业化准入配置</h3>
                                   <p className="text-[12px] text-zinc-400 font-bold mt-1">设置您的 Skill 变现规则（需满足平台门槛）</p>
                                </div>
                                <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                                   <Activity size={14}/> 准入阈值：500 次
                                </div>
                             </div>

                             <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-6 mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                   <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">!</div>
                                   <p className="text-[12px] text-zinc-600 font-bold">
                                      根据平台协议，您的新 Skill 在累计获得 <span className="text-zinc-900">500 次</span> 调用前将保持 <span className="text-emerald-500">免费开源状态</span>。
                                   </p>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                                   <div className="h-full bg-zinc-400 w-[0%] rounded-full" />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40 pointer-events-none grayscale">
                                <div className="p-5 border-2 border-zinc-100 rounded-2xl flex flex-col gap-3 bg-zinc-50">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[13px] font-black text-zinc-900">按次计费</span>
                                      <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                                   </div>
                                   <div className="flex items-baseline gap-1">
                                      <span className="text-[11px] font-bold text-zinc-400">建议定价：</span>
                                      <span className="text-[12px] font-black text-zinc-900">￥0.05 ~ 0.5</span>
                                   </div>
                                </div>
                                <div className="p-5 border-2 border-zinc-100 rounded-2xl flex flex-col gap-3 bg-zinc-50">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[13px] font-black text-zinc-900">按月订阅</span>
                                      <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                                   </div>
                                   <div className="flex items-baseline gap-1">
                                      <span className="text-[11px] font-bold text-zinc-400">建议定价：</span>
                                      <span className="text-[12px] font-black text-zinc-900">￥99 ~ 299</span>
                                   </div>
                                </div>
                             </div>

                             <p className="text-[10px] text-zinc-400 font-bold mt-6 text-center italic">达成 500 次调用后，以上定价选项将自动激活</p>
                          </div>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       ) : (
          <>
            <div className="flex-none p-6 px-10 border-b border-zinc-100 bg-white shadow-sm relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">能力增强中心</h1>
                    <div className="flex bg-zinc-50 rounded-[14px] p-1 text-[13px] font-extrabold border border-zinc-200">
                       <button onClick={() => setSkillMarketTab('my')} className={`px-6 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'my' ? 'bg-white text-[#685FAB] shadow-sm' : 'text-zinc-500'}`}>我的能力轴</button>
                       <button onClick={() => setSkillMarketTab('market')} className={`px-6 py-2 rounded-[10px] transition-all flex items-center gap-2 ${skillMarketTab === 'market' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500'}`}>能力商店</button>
                    </div>
                  </div>
                  <button onClick={() => setCreatingSkill(true)} className="bg-[#685FAB] text-white px-6 py-2.5 rounded-2xl text-[13px] font-black shadow-xl shadow-[#685FAB]/20 flex items-center gap-3 hover:scale-[1.02] transition-all">
                      <Sparkles size={18} /> 构建专有 Skill
                  </button>
               </div>

               <div className="flex items-center gap-8">
                  <div className="relative flex-1 max-w-md">
                     <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"/>
                     <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索能力、场景、或具体技能..." 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 text-[14px] font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-zinc-100 transition-all" 
                     />
                  </div>
                  <div className="flex gap-2">
                     {CATEGORIES.map(cat => (
                        <button 
                           key={cat.id} 
                           onClick={() => setActiveCategory(cat.id)}
                           className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all ${activeCategory === cat.id ? 'bg-zinc-900 text-white' : 'text-zinc-500 bg-white border border-zinc-200 hover:bg-zinc-50'}`}
                        >
                           {cat.name}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-10 custom-scrollbar">
               <div className="max-w-6xl mx-auto">
                  {skillMarketTab === 'my' && (
                     <div className="mb-12 p-8 bg-zinc-900 rounded-[32px] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                           <TrendingUp size={140} className="text-[#685FAB]" />
                        </div>
                        <div className="relative z-10 max-w-xl">
                           <div className="flex items-center gap-2 text-[#685FAB] text-[10px] font-black uppercase tracking-widest mb-4">
                              <ShieldCheck size={14} /> Developer Dashboard
                           </div>
                           <h2 className="text-3xl font-black tracking-tight mb-4">开发者准入进度</h2>
                           <p className="text-zinc-400 text-[14px] font-bold mb-8 leading-relaxed">
                              平台鼓励高质量 Skill 的自主变现。当您的 Skill 在社区累计被使用超过 <span className="text-white">500 次</span> 后，即可解锁定价权（按次/按月）。
                           </p>
                           
                           <div className="space-y-4">
                              <div className="flex items-center justify-between text-[12px] font-bold">
                                 <span className="text-zinc-500">当前最佳 Skill：全域视觉去重工具</span>
                                 <span>8.4% 达成率</span>
                              </div>
                              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-gradient-to-r from-[#685FAB] to-emerald-400 w-[8.4%] rounded-full shadow-[0_0_15px_rgba(104,95,171,0.5)]" />
                              </div>
                              <div className="flex justify-between text-[11px] font-black text-zinc-500 uppercase tracking-tighter">
                                 <span>0 次调用</span>
                                 <span className="text-[#685FAB]">目标：500 次</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 mb-20">
                     {(skillMarketTab === 'market' ? filteredSkills : MY_SKILLS).map(sk => (
                        <div key={sk.id} onClick={() => setSelectedSkill(sk)} className="flex items-center gap-6 p-6 rounded-3xl border border-zinc-100 hover:border-[#685FAB]/30 hover:bg-[#685FAB]/[0.02] transition-all cursor-pointer group bg-white shadow-sm hover:shadow-2xl hover:translate-y-[-2px]">
                           <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                 <span>Provider: {sk.author}</span>
                                 <span>•</span>
                                 <span className="text-[#685FAB]">{sk.stats} 活跃使用</span>
                              </div>
                              <h3 className="text-[17px] font-black text-zinc-900 flex items-center gap-3">
                                 {sk.name}
                                 {sk.category === 'data' && <div className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[9px] rounded-md font-black">Data-Driven</div>}
                              </h3>
                              <p className="text-[13px] text-zinc-500 font-medium mt-1 leading-relaxed max-w-2xl">{sk.desc}</p>
                           </div>
                           <div className="w-[180px] flex flex-col items-end gap-2 shrink-0 border-l border-zinc-100 pl-8">
                              <div className="text-[16px] font-black text-zinc-900">{sk.price}</div>
                              <button className="px-4 py-2 bg-zinc-50 text-zinc-500 text-[11px] font-black rounded-xl group-hover:bg-[#685FAB] group-hover:text-white transition-all">查看详情</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <AnimatePresence>
              {selectedSkill && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedSkill(null)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-[40px] p-12 relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedSkill(null)} className="absolute top-8 right-10 text-zinc-400 hover:text-zinc-900"><X size={28}/></button>
                    <div className="mb-10">
                       <span className="text-[11px] font-black text-[#685FAB] uppercase tracking-[0.2em] mb-3 block">Expert Capability Node</span>
                       <h2 className="text-3xl font-black text-zinc-900 mb-2 leading-tight">{selectedSkill.name}</h2>
                       <div className="flex gap-4 mt-4">
                          <span className="px-3 py-1.5 bg-zinc-100 text-zinc-500 text-[11px] font-bold rounded-lg border border-zinc-200/50 flex items-center gap-1.5"><Users size={14}/> {selectedSkill.stats} 安装量</span>
                          <span className="px-3 py-1.5 bg-zinc-100 text-zinc-500 text-[11px] font-bold rounded-lg border border-zinc-200/50 flex items-center gap-1.5"><Activity size={14}/> 99.9% 后端可用率</span>
                       </div>
                    </div>
                    
                    <div className="space-y-6 mb-12 capitalize">
                       <div className="bg-zinc-50 p-6 rounded-[28px] border border-zinc-100">
                          <h4 className="text-[12px] font-black text-zinc-400 mb-3 uppercase tracking-widest">核心逻辑摘要</h4>
                          <p className="text-[14px] text-zinc-700 font-bold leading-relaxed">{selectedSkill.desc}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                             <h5 className="text-[10px] font-black text-zinc-400 uppercase mb-1">Billing</h5>
                             <p className="text-[14px] font-black text-zinc-900">{selectedSkill.price}</p>
                          </div>
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                             <h5 className="text-[10px] font-black text-zinc-400 uppercase mb-1">Category</h5>
                             <p className="text-[14px] font-black text-[#685FAB] uppercase">{selectedSkill.category}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button className="flex-1 bg-zinc-900 hover:bg-black text-white py-5 rounded-3xl font-black text-[15px] shadow-2xl transition-all active:scale-95">开启并挂载此能力</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
       )}
    </div>
  );
};
