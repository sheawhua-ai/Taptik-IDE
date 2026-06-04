import React from 'react';
import { 
  Activity, ArrowUp, ArrowUpFromLine, MessageSquare, Target, 
  LineChart, Check, ArrowRight, Sparkles, Plus, Clock, RefreshCw, Component, Settings, Zap,
  X, BarChart2, Layers, CreditCard, Workflow, GitBranch, Search, Compass, Download, ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface DataCenterProps {
  dataSubNav: string;
  setDataSubNav: (val: any) => void;
  setActiveNav: (nav: string) => void;
}

export const DataCenter: React.FC<DataCenterProps> = ({ dataSubNav, setDataSubNav, setActiveNav }) => {
  const [aiAnalysisQuery, setAiAnalysisQuery] = React.useState('');
  const [pinnedInsights, setPinnedInsights] = React.useState([
    { id: '1', title: '全域 ROI 实时监控', type: 'chart', value: '4.2', trend: '+12%', color: 'primary' },
    { id: '2', title: '高潜客群分布', type: 'map', value: '北京/上海', trend: '活跃', color: 'success' },
  ]);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-0 overflow-y-auto custom-scrollbar shadow-inner">
        <div className="flex-1 flex flex-col bg-neutral-50/30">
          
          {/* 1. OVERVIEW TAB */}
          {dataSubNav === 'overview' && (
             <div className="p-8 space-y-10 animate-in fade-in duration-500">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Target size={18} className="text-primary-500" />
                         <h3 className="text-[15px] font-black text-neutral-900 uppercase tracking-widest">我的常驻看板</h3>
                      </div>
                      <button className="text-[11px] font-black text-neutral-400 hover:text-neutral-900 transition-all uppercase tracking-widest">布局设置</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {pinnedInsights.map(insight => (
                         <div key={insight.id} className="group relative bg-white p-8 rounded-[40px] border border-neutral-200 shadow-sm hover:shadow-2xl transition-all">
                            <button 
                               onClick={() => setPinnedInsights(prev => prev.filter(p => p.id !== insight.id))}
                               className="absolute top-6 right-6 p-2 text-neutral-200 hover:text-danger-500 hover:bg-danger-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                            >
                               <X size={16} />
                            </button>
                            <div className="flex items-center justify-between mb-6">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${insight.color === 'primary' ? 'bg-primary-50 text-primary-500' : 'bg-success-50 text-success-500'}`}>
                                  {insight.type === 'chart' ? <BarChart2 size={24} /> : <Target size={24} />}
                               </div>
                               <div className="px-2 py-0.5 bg-neutral-50 border border-neutral-100 rounded text-[9px] font-black text-neutral-400 uppercase tracking-widest">AI Agent 推送</div>
                            </div>
                            <h4 className="text-[12px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-1">{insight.title}</h4>
                            <div className="flex items-baseline gap-2">
                               <span className="text-3xl font-black text-neutral-900 tracking-tighter">{insight.value}</span>
                               <span className="text-[13px] font-black text-success-500">{insight.trend}</span>
                            </div>
                         </div>
                      ))}
                      <button 
                        onClick={() => setDataSubNav('auto_views')}
                        className="border-2 border-dashed border-neutral-200 rounded-[40px] flex flex-col items-center justify-center p-8 text-neutral-300 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50/10 transition-all gap-3"
                      >
                         <Plus size={32} />
                         <span className="text-[12px] font-black uppercase tracking-widest leading-none">通过 AI 创想添加</span>
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: '小红书总曝光', val: '12.5 W', icon: Activity, color: 'text-secondary-500', trend: '+12.4%' },
                    { label: '小红书总互动', val: '3,492', icon: MessageSquare, color: 'text-primary-500', trend: '+8.1%' },
                    { label: '小红书净涨粉', val: '845', icon: Target, color: 'text-success-500', trend: '-2.3%', neg: true },
                    { label: 'ROI 综合估算', val: '4.2 x', icon: CreditCard, color: 'text-primary-500', trend: '+5.2%' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm group hover:border-primary-500/30 transition-all">
                      <div className="text-[11px] font-black text-neutral-400 mb-3 flex items-center justify-between uppercase tracking-widest">
                        {s.label} <s.icon size={16} className={s.color} />
                      </div>
                      <div className="text-2xl font-black text-neutral-900 tracking-tight">{s.val}</div>
                      <div className={`text-[11px] font-black mt-2 flex items-center gap-1 ${s.neg ? 'text-danger-500' : 'text-success-500'}`}>
                        <ArrowUp size={12} className={s.neg ? 'rotate-180' : ''}/> {s.trend} 较上周
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {/* 2. ROI ATTRIBUTION TAB */}
          {dataSubNav === 'roi_attribution' && (
             <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-neutral-900 rounded-[48px] p-12 text-white relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-10">
                         <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/20">
                            <Workflow size={28} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black tracking-tight leading-tight">全链路 ROI 归因分析</h2>
                            <p className="text-neutral-400 text-[14px] font-bold mt-1 uppercase tracking-widest">End-to-End 归因引擎</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                         {[
                            { label: '曝光层 (Top)', source: '小红书 API / 实时监测', stats: '82.4w', icon: Layers },
                            { label: '互动层 (Mid)', source: 'Agent 私域分发反馈', stats: '1.2w', icon: MessageSquare },
                            { label: '线索层 (Bottom)', source: '表单 / 留资组件集成', stats: '856', icon: Target },
                            { label: '成交层 (Actual)', source: '品牌 CRM 实时对齐', stats: '243', icon: CreditCard },
                         ].map((node, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-8 relative group overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                                  <node.icon size={80} />
                               </div>
                               <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">{node.label}</p>
                               <h4 className="text-[22px] font-black text-white mb-2">{node.stats}</h4>
                               <p className="text-[11px] text-neutral-500 font-bold">Data Source: {node.source}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* 3. GENERATIVE AI VIEWS TAB */}
          {dataSubNav === 'auto_views' && (
            <div className="p-8 flex flex-col h-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-neutral-900 rounded-[48px] p-12 text-white relative overflow-hidden group shadow-2xl shrink-0">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                   <Sparkles size={200} className="text-primary-500" />
                </div>
                <div className="relative z-10 max-w-2xl">
                   <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-left">
                      <Zap size={14} /> AI 生成式分析
                   </div>
                   <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight text-left">探索式数据分析</h2>
                   <p className="text-neutral-400 text-[16px] font-bold mb-10 leading-relaxed text-left">
                      跳出固化报表。直接向 AI Agent 描述您想要深度洞悉的业务维度，系统将实时编排并渲染专属于您的可视化分析看板。
                   </p>
                   
                   <div className="relative group/input">
                      <div className="absolute inset-x-0 -top-px -bottom-px rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 blur-md opacity-20 group-focus-within/input:opacity-50 transition-opacity" />
                      <div className="relative flex items-center bg-white/10 border border-white/20 rounded-2xl p-2.5 backdrop-blur-md shadow-2xl">
                         <input 
                           value={aiAnalysisQuery}
                           onChange={(e) => setAiAnalysisQuery(e.target.value)}
                           placeholder="在此输入您的分析指令。例如：'分析由于新品上市带来的流量结构变化'..." 
                           className="flex-1 bg-transparent border-none outline-none px-6 text-[16px] font-black text-white placeholder:text-white/20"
                         />
                         <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-xl font-black text-[14px] transition-all shadow-xl flex items-center gap-2">
                            生成看板 <ArrowRight size={18} />
                         </button>
                      </div>
                   </div>

                   <div className="mt-8 flex items-center gap-4">
                      <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest text-left">💡 进阶问题推荐:</span>
                      <div className="flex gap-2">
                        <button onClick={() => setAiAnalysisQuery("对比上个月，分析 ROI 波动核心原因")} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[12px] font-bold text-neutral-400 border border-white/5 transition-all text-left">ROI 波动原因</button>
                        <button onClick={() => setAiAnalysisQuery("预测下周高潜力蓝海选题趋势")} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[12px] font-bold text-neutral-400 border border-white/5 transition-all text-left">本周爆文预测</button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex-1 bg-white border border-neutral-200 rounded-[48px] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[300px]">
                  <div className="absolute inset-0 bg-neutral-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="w-20 h-20 rounded-[32px] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 mb-8 group-hover:scale-110 transition-transform">
                      <LineChart size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-2">生成式分析画布</h3>
                  <p className="text-[15px] text-neutral-400 font-bold max-w-sm">在上方输入指令后，AI 将在此渲染由 Data Agent 实时编排的专属视图。</p>
              </div>
            </div>
          )}

          {/* 4. SCHEDULED REPORTS */}
          {dataSubNav === 'scheduled' && (
             <div className="p-8 space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2 uppercase tracking-widest"><Clock size={20} className="text-primary-500" /> 自动化报表流</h3>
                   <button className="bg-neutral-900 text-white px-6 py-3 rounded-2xl text-[13px] font-black flex items-center gap-2 hover:bg-primary-500 transition-all shadow-xl">
                      <Plus size={18}/> 新建自动化任务
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                      { name: '每周业务矩阵周报', period: '每周一 09:00', dest: '飞书群/运营部', status: 'Active', type: '报表汇总' },
                      { name: 'ROI 异常实时报警', period: 'Real-time', dest: 'WeChat / Email', status: 'Monitoring', type: '告警机制' },
                      { name: '蓝海增长月度雷达', period: '每月 1 号', dest: 'CEO / 市场总监', status: 'Scheduled', type: '深度洞察' },
                   ].map((job, idx) => (
                      <div key={idx} className="bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm hover:border-primary-500 transition-all group">
                         <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 text-neutral-500 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors shadow-inner"><Clock size={24}/></div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${job.status === 'Active' ? 'bg-success-50 text-success-600' : 'bg-neutral-50 text-neutral-400'}`}>{job.status}</span>
                         </div>
                         <h4 className="text-[17px] font-black text-neutral-900 mb-1">{job.name}</h4>
                         <p className="text-[12px] text-neutral-400 font-bold mb-8">{job.type} · {job.period}</p>
                         <div className="pt-6 border-t border-neutral-50 flex items-center justify-between text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                            <span>To: {job.dest}</span>
                            <button className="hover:text-primary-500 transition-colors"><Settings size={16}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* 5. BLUE OCEAN ANALYSIS */}
          {dataSubNav === 'blueocean' && (
             <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-32">
                <div className="bg-white border border-neutral-200 rounded-[48px] p-10 shadow-sm">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                         <h3 className="text-2xl font-black text-neutral-900 tracking-tight">蓝海增长潜核探测</h3>
                         <p className="text-[14px] text-neutral-400 font-bold mt-1">针对特定品类启动 Agent 深度扫描，挖掘「高互动、低竞争」的潜力长尾词</p>
                      </div>
                      <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
                         <button className="px-5 py-2 bg-white shadow-sm rounded-xl text-[12px] font-black text-neutral-900">探测任务</button>
                         <button className="px-5 py-2 rounded-xl text-[12px] font-black text-neutral-400 hover:text-neutral-600">我的词库 (142)</button>
                      </div>
                   </div>

                   <div className="flex flex-col xl:flex-row gap-5">
                      <div className="flex-1 relative group">
                         <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" />
                         <input 
                            placeholder="输入核心品类或竞争词，例如：无养烘焙猫粮 / 结婚酒店..." 
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-[24px] pl-16 pr-8 py-5 text-[16px] font-black outline-none focus:border-primary-500 transition-all shadow-inner"
                         />
                      </div>
                      <div className="flex bg-neutral-100 p-1 rounded-[24px] border border-neutral-200">
                         <button className="px-8 py-4 bg-white shadow-xl rounded-2xl text-[13px] font-black text-neutral-900">标准快搜 (列表)</button>
                         <button className="px-8 py-4 rounded-2xl text-[13px] font-black text-neutral-400 hover:text-neutral-600 font-black">深度内探 (笔记级)</button>
                      </div>
                      <button className="bg-neutral-900 hover:bg-primary-500 text-white px-10 py-4 rounded-[24px] font-black text-[15px] shadow-2xl transition-all flex items-center gap-3">
                         <Zap size={20} /> 立即启动扫描
                      </button>
                   </div>
                   
                   <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 px-8 bg-primary-50 border border-primary-100 rounded-[32px]">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm">
                           <Settings size={18} className="text-primary-500 animate-spin-slow" />
                        </div>
                        <p className="text-[12px] text-primary-700 font-bold max-w-2xl leading-relaxed">
                           <span className="font-black text-primary-900 uppercase">Agent 策略就绪:</span> 深度内探模式将自动穿透至“笔记详情页”抓取「收/展/粉」高维数据。系统将通过人类阅读模拟采样规避平台风控。历史关联词将优先从本地词库推送以提升 ROI。
                        </p>
                      </div>
                      <div className="text-[12px] font-black text-primary-500 flex items-center gap-2 cursor-pointer hover:underline uppercase tracking-widest px-6 py-3 border border-primary-200 rounded-2xl bg-white shadow-xl hover:scale-105 transition-all shrink-0">
                         计费与点数规则 <CreditCard size={16} />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                   <div className="lg:col-span-3 bg-white rounded-[48px] border border-neutral-200 overflow-hidden shadow-sm flex flex-col">
                      <div className="p-8 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Workflow size={22} className="text-primary-500" />
                           <span className="text-[16px] font-black text-neutral-900 uppercase tracking-tight">活跃探测视图</span>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2.5 px-4 py-1.5 bg-success-50 text-success-600 rounded-full border border-success-100">
                              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                              <span className="text-[11px] font-black uppercase tracking-[0.1em]">已扫描 32/50</span>
                           </div>
                           <button className="text-[11px] font-black flex items-center gap-2 text-neutral-400 hover:text-primary-500 transition-colors uppercase tracking-widest">
                              <RefreshCw size={14}/> 实时同步
                           </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-neutral-50/50 border-b border-neutral-100 text-[10px] text-neutral-400 uppercase font-black tracking-widest sticky top-0 bg-white z-10 shadow-sm">
                              <tr>
                                <th className="py-5 px-10">关键词 / 选题洞察</th>
                                <th className="py-5 px-6">搜索热度</th>
                                <th className="py-5 px-10 text-center">蓝海评分 (核心潜力)</th>
                                <th className="py-5 px-10 text-right">操作</th>
                              </tr>
                          </thead>
                          <tbody className="text-[14px] text-neutral-800 font-bold divide-y divide-neutral-50">
                              {[
                                { word: '#新手养幼猫带货避坑清单', heat: '2.4w', quality: '15.4%', fanBase: '3.2k', score: 92, trend: 'up', desc: '深度探测：高收藏且评论区集中在“性价比”' },
                                { word: '#多猫家庭烘焙猫粮实测报告', heat: '1.2w', quality: '22.8%', fanBase: '850', score: 88, trend: 'up', desc: '蓝海词：互动率极高，竞品笔记多为纯广告' },
                                { word: '#老龄猫关节养护科普方案', heat: '8.4k', quality: '11.5%', fanBase: '1.2w', score: 65, trend: 'stable', desc: '稳健型选题：部分泛人群大 V 已布局' },
                                { word: '#2024平价进口猫粮红黑榜', heat: '52.1w', quality: '4.2%', fanBase: '45w', score: 12, trend: 'down', desc: '红海词：投产比低，建议避开' },
                              ].map((item, idx) => (
                                <tr key={idx} className="group hover:bg-neutral-50/20 transition-colors">
                                    <td className="py-8 px-10">
                                        <div className="flex flex-col gap-2">
                                           <div className="flex items-center gap-3">
                                              <span className="text-[17px] font-black text-neutral-900 leading-none">{item.word}</span>
                                              {item.trend === 'up' && <div className="p-1 px-1.5 bg-success-50 text-success-600 rounded-lg text-[10px] font-black flex items-center gap-1 border border-success-100"><ArrowUp size={10}/> 正在上升</div>}
                                           </div>
                                           <p className="text-[11px] text-neutral-400 font-black italic tracking-wide">{item.desc}</p>
                                        </div>
                                    </td>
                                    <td className="py-8 px-6">
                                       <div className="flex flex-col">
                                          <span className="font-black text-[18px] text-neutral-800 leading-none">{item.heat}</span>
                                          <span className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-widest text-left">搜索热度</span>
                                       </div>
                                    </td>
                                    <td className="py-8 px-10">
                                       <div className="flex flex-col items-center">
                                          <div className={`text-[24px] font-black leading-none ${item.score > 80 ? 'text-primary-500' : item.score > 50 ? 'text-neutral-900' : 'text-neutral-300'}`}>
                                             {item.score}
                                          </div>
                                          <div className="w-20 h-1.5 bg-neutral-100 rounded-full mt-3 overflow-hidden shadow-inner">
                                             <div className="h-full bg-primary-500" style={{ width: `${item.score}%` }} />
                                          </div>
                                       </div>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <button className="text-[13px] font-black text-white bg-neutral-900 hover:bg-primary-500 px-8 py-3.5 rounded-[20px] transition-all shadow-xl hover:scale-105">锁定选题 &rarr;</button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                   </div>

                   <div className="flex flex-col gap-8">
                      <div className="bg-neutral-900 rounded-[48px] p-10 text-white relative overflow-hidden flex-1 flex flex-col justify-between group shadow-2xl">
                         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                            <Compass size={180} />
                         </div>
                         <div className="relative z-10">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-400 mb-4 text-left">智能预测洞察</h4>
                            <p className="text-[18px] font-black leading-snug mb-10 text-left">“结婚酒店” 高频共现词中，“免费停车” 与 “厅高不遮挡” 的情绪价值反馈提升 25%。</p>
                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[12px] font-black transition-all uppercase tracking-[0.1em] flex items-center justify-center gap-2">
                               同步到爆文引擎 <ArrowUpRight size={16} />
                            </button>
                         </div>
                      </div>

                      <div className="bg-white border border-neutral-200 rounded-[48px] p-10 shadow-sm">
                         <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-8 text-left">探测状态监控</h4>
                         <div className="space-y-6">
                            {[
                               { label: '笔记层扫描深度', value: 'Lv.3 (深度)', color: 'text-primary-500' },
                               { label: '当前风控阈值', value: '安全 (绿色)', color: 'text-success-500' },
                               { label: '系统采样频率', value: '2.5秒 / 页', color: 'text-neutral-500' },
                            ].map((row, i) => (
                               <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 text-left">
                                  <span className="text-[11px] font-black text-neutral-400 uppercase tracking-tighter text-left">{row.label}</span>
                                  <span className={`text-[13px] font-black ${row.color} text-right`}>{row.value}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
    </div>
  );
};
