import React from 'react';
import { 
  Activity, ArrowUp, ArrowUpFromLine, MessageSquare, Target, 
  LineChart, Check, ArrowRight, Sparkles, Plus, Clock, RefreshCw, Component, Settings, Zap,
  X, BarChart2, Layers, CreditCard, Workflow, GitBranch
} from 'lucide-react';

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
    <div className="flex-1 flex flex-col h-full bg-neutral-0 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex flex-col bg-neutral-50/50">
          
          {/* 1. OVERVIEW TAB: Pinned Insights + Core Stats */}
          {dataSubNav === 'overview' && (
             <div className="p-8 space-y-10 animate-in fade-in duration-500">
                {/* Pinned Insights Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Target size={18} className="text-primary-500" />
                         <h3 className="text-[15px] font-black text-neutral-900">我的常驻看板</h3>
                      </div>
                      <button className="text-[11px] font-bold text-neutral-400 hover:text-neutral-900 transition-all">管理看板布局</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pinnedInsights.map(insight => (
                         <div key={insight.id} className="group relative bg-neutral-0 p-6 rounded-[32px] border border-neutral-200 shadow-sm hover:shadow-xl transition-all">
                            <button 
                               onClick={() => setPinnedInsights(prev => prev.filter(p => p.id !== insight.id))}
                               className="absolute top-4 right-4 p-2 text-neutral-300 hover:text-danger-500 hover:bg-danger-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                               title="取消常驻"
                            >
                               <X size={16} />
                            </button>
                            <div className="flex items-center justify-between mb-4">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${insight.color === 'primary' ? 'bg-primary-50 text-primary-500' : 'bg-success-50 text-success-500'}`}>
                                  {insight.type === 'chart' ? <BarChart2 size={20} /> : <Target size={20} />}
                               </div>
                               <div className="px-2 py-0.5 bg-neutral-50 border border-neutral-100 rounded text-[9px] font-black text-neutral-400 uppercase tracking-tighter">AI 实时</div>
                            </div>
                            <h4 className="text-[13px] font-black text-neutral-400 uppercase tracking-widest mb-1">{insight.title}</h4>
                            <div className="flex items-baseline gap-2">
                               <span className="text-2xl font-black text-neutral-900">{insight.value}</span>
                               <span className="text-[12px] font-black text-success-500">{insight.trend}</span>
                            </div>
                         </div>
                      ))}
                      <button 
                        onClick={() => setDataSubNav('auto_views')}
                        className="border-2 border-dashed border-neutral-200 rounded-[32px] flex flex-col items-center justify-center p-6 text-neutral-300 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50/10 transition-all gap-2"
                      >
                         <Plus size={24} />
                         <span className="text-[12px] font-black uppercase tracking-widest">通过 AI 创想添加</span>
                      </button>
                   </div>
                </div>

                <div className="w-full h-px bg-neutral-200/60" />

                {/* Core Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                     <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">小红书总曝光 <Activity size={14} className="text-secondary-500" /></div>
                     <div className="text-2xl font-black text-neutral-900">12.5 W</div>
                     <div className="text-[11px] font-bold text-success-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 12.4% 较上周</div>
                  </div>
                  <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                     <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">小红书总互动 <Component size={14} className="text-primary-500" /></div>
                     <div className="text-2xl font-black text-neutral-900">3,492</div>
                     <div className="text-[11px] font-bold text-success-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 8.1% 较上周</div>
                  </div>
                  <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                     <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">小红书净涨粉 <Target size={14} className="text-success-500" /></div>
                     <div className="text-2xl font-black text-neutral-900">845 人</div>
                     <div className="text-[11px] font-bold text-danger-500 mt-2 flex items-center gap-1"><ArrowUpFromLine size={12} className="rotate-180"/> 2.3% 较上周</div>
                  </div>
                  <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                     <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">ROI 综合估算 <CreditCard size={14} className="text-primary-500" /></div>
                     <div className="text-2xl font-black text-neutral-900">4.2 x</div>
                     <div className="text-[11px] font-bold text-success-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 5.2% 较上周</div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-neutral-0 p-6 rounded-[32px] border border-neutral-200 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-success-50 text-success-600 flex items-center justify-center font-black">
                         <Check size={20} />
                      </div>
                      <div>
                         <h4 className="text-[14px] font-black text-neutral-900">数据引擎运行中</h4>
                         <p className="text-[11px] text-neutral-400 font-bold">已连接: 小红书 Open API, 品牌 CRM (POS) Webhook</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black hover:bg-neutral-800 transition-all">
                      导出本月报表
                   </button>
                </div>
             </div>
          )}

          {/* 2. ROI ATTRIBUTION TAB */}
          {dataSubNav === 'roi_attribution' && (
             <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-neutral-900 rounded-[40px] p-12 text-white relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                            <Workflow size={24} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black tracking-tight leading-tight">全链路 ROI 归因分析</h2>
                            <p className="text-neutral-400 text-[14px] font-bold">打通 小红书曝光 &rarr; 互动沟通 &rarr; 最终转化的数据黑盒</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                         {[
                            { label: '曝光层 (Top)', source: '小红书 API / 爬虫', stats: '82.4w', icon: Layers },
                            { label: '互动层 (Mid)', source: '私域加群 / 关键词', stats: '1.2w', icon: MessageSquare },
                            { label: '线索层 (Bottom)', source: '表单 / 客资组件', stats: '856', icon: Target },
                            { label: '成交层 (Actual)', source: '品牌 CRM 实时碰撞', stats: '243', icon: CreditCard },
                         ].map((node, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-120 transition-transform">
                                  <node.icon size={80} />
                               </div>
                               <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">{node.label}</p>
                               <h4 className="text-[18px] font-black text-white mb-2">{node.stats}</h4>
                               <p className="text-[11px] text-neutral-500 font-bold">来源: {node.source}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white border border-neutral-200 rounded-[32px] p-8">
                      <h3 className="text-[16px] font-black text-neutral-900 mb-6 flex items-center gap-2">
                         <GitBranch size={18} className="text-primary-500" />
                         归因架构 (UID Path)
                      </h3>
                      <div className="space-y-4">
                         {[
                            { step: '埋点捕包', desc: 'URL 注入加密标识 (TID)' },
                            { step: '行为标识', desc: 'TID 与设备指纹绑定' },
                            { step: '订单回传', desc: 'CRM Webhook 实时推送' },
                            { step: '特征碰撞', desc: '手机号哈希模糊匹配' },
                         ].map((item, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-neutral-50 rounded-2xl">
                               <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                               <div>
                                  <p className="text-[12px] font-black text-neutral-900">{item.step}</p>
                                  <p className="text-[10px] text-neutral-500">{item.desc}</p>
                                </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-white border border-neutral-200 rounded-[32px] p-8 col-span-2">
                       <h3 className="text-[16px] font-black text-neutral-900 mb-6">全生命周期价值 (LOD)</h3>
                       <div className="grid grid-cols-4 gap-4">
                          {[
                             { label: '获客成本', val: '¥ 12.5', trend: '-2.1%' },
                             { label: '投放回报', val: '1:8.4', trend: '+15.2%' },
                             { label: '下单转化', val: '4.8%', trend: '+0.5%' },
                             { label: 'CLV 指数', val: '820', trend: '+22.4%' },
                          ].map((stat, i) => (
                             <div key={i} className="p-4 bg-neutral-50 rounded-2xl">
                                <p className="text-[10px] font-black text-neutral-400 mb-1">{stat.label}</p>
                                <p className="text-[18px] font-black text-neutral-900">{stat.val}</p>
                                <p className="text-[10px] font-bold text-success-500">{stat.trend}</p>
                             </div>
                          ))}
                       </div>
                       <div className="mt-8 pt-8 border-t border-neutral-100 flex items-center justify-between">
                          <div className="flex gap-4">
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary-500" />
                                <span className="text-[12px] font-bold text-neutral-600">小红书投放</span>
                             </div>
                             <div className="flex items-center gap-2 text-neutral-400">
                                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                                <span className="text-[12px] font-bold">其他渠道推流</span>
                             </div>
                          </div>
                          <button className="text-[12px] font-black text-primary-500 hover:underline">查看完整流量图谱 &rarr;</button>
                       </div>
                   </div>
                </div>
             </div>
          )}

          {/* 3. GENERATIVE AI VIEWS TAB */}
          {dataSubNav === 'auto_views' && (
            <div className="p-8 flex flex-col h-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* AI Exploration Bar */}
              <div className="bg-neutral-900 rounded-[32px] p-10 text-white relative overflow-hidden group shadow-2xl shrink-0">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                   <Sparkles size={180} className="text-primary-500" />
                </div>
                <div className="relative z-10 max-w-2xl">
                   <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      <Zap size={14} /> Generative Data Intelligence
                   </div>
                   <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">探索式数据分析</h2>
                   <p className="text-neutral-400 text-[15px] font-bold mb-8 leading-relaxed">
                      不再受限于固定的报表。直接用自然语言向 AI 提问，系统将实时生成针对性的可视化看板与分析结论。
                   </p>
                   
                   <div className="relative group/input">
                      <div className="absolute inset-x-0 -top-px -bottom-px rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 blur-md opacity-20 group-focus-within/input:opacity-50 transition-opacity" />
                      <div className="relative flex items-center bg-white/10 border border-white/20 rounded-2xl p-2 backdrop-blur-md">
                         <input 
                           value={aiAnalysisQuery}
                           onChange={(e) => setAiAnalysisQuery(e.target.value)}
                           placeholder="例如：对比上个月，为什么 A 账号的转化率突然下降了？" 
                           className="flex-1 bg-transparent border-none outline-none px-4 text-[15px] font-bold text-white placeholder:text-neutral-500"
                         />
                         <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-black text-[13px] transition-all shadow-lg flex items-center gap-2">
                            分析汇报 <ArrowRight size={16} />
                         </button>
                      </div>
                   </div>

                   <div className="mt-6 flex items-center gap-4">
                      <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">试试这样问:</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] font-bold text-neutral-400 border border-white/5 transition-all">"预测下周的爆文趋势"</button>
                        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] font-bold text-neutral-400 border border-white/5 transition-all">"找出 ROI 最优的长尾词"</button>
                      </div>
                   </div>
                </div>
              </div>

              {/* View Simulation Area */}
              <div className="flex-1 bg-neutral-0 border border-neutral-200 rounded-[40px] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute flex items-center gap-2 top-8 right-8 z-20">
                     <button className="px-4 py-2 bg-neutral-900 border border-neutral-700 text-white rounded-xl text-[12px] font-black opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 hover:bg-primary-500">
                        <Sparkles size={14} /> 钉在核心看板
                     </button>
                  </div>
                  <div className="absolute inset-0 bg-neutral-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="w-16 h-16 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 mb-6 group-hover:scale-110 transition-transform">
                      <LineChart size={32} />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2">生成画布就绪</h3>
                  <p className="text-[14px] text-neutral-400 font-bold max-w-sm">在上方输入你的分析指令，AI 将在此渲染专属于你的动态看板。</p>
              </div>
            </div>
          )}

          {/* 4. SCHEDULED REPORTS */}
          {dataSubNav === 'scheduled' && (
             <div className="p-8 space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-black text-neutral-900">定时任务报表管理</h3>
                   <button className="bg-neutral-900 text-neutral-0 px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors">
                      <Plus size={16}/> 新建自动化报表任务
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                      { name: '每周小红书矩阵复盘', period: '每周一 09:00', dest: '企业微信群 3310', status: '运行中', type: '综合汇总' },
                      { name: 'ROI 波报异常报警', period: '每 2 小时巡检', dest: '系统通知 + 微信', status: '监听中', type: '异常监控' },
                      { name: '竞品蓝海词发现月报', period: '每月 1 号', dest: 'PDF 归档到 Files', status: '待触发', type: '市场洞察' },
                   ].map((job, idx) => (
                      <div key={idx} className="bg-neutral-0 border border-neutral-200 rounded-3xl p-6 shadow-sm hover:border-primary-500/30 transition-all group">
                         <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-500 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors"><Clock size={20}/></div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${job.status === '运行中' ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-500'}`}>{job.status}</span>
                         </div>
                         <h4 className="text-[15px] font-black text-neutral-900 mb-1">{job.name}</h4>
                         <p className="text-[12px] text-neutral-500 font-medium mb-4">{job.type} · {job.period}</p>
                         <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold text-neutral-400">
                            <span>推送到：{job.dest}</span>
                            <button className="hover:text-primary-500 transition-colors"><Settings size={14}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* 5. BLUE OCEAN ANALYSIS */}
          {dataSubNav === 'blueocean' && (
             <div className="p-8 space-y-8 animate-in fade-in duration-500">
                {/* Discovery Control Panel */}
                <div className="bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                         <h3 className="text-xl font-black text-neutral-900 tracking-tight">蓝海增长潜核探测</h3>
                         <p className="text-[13px] text-neutral-400 font-bold">针对特定品类启动 RPA 深度扫描，挖掘高互动、低竞争的潜力长尾词</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-3">
                            <span className="text-[11px] font-black text-neutral-400 uppercase">当前剩余点数:</span>
                            <span className="text-[14px] font-black text-primary-500">2,480</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                         <input 
                            placeholder="输入核心品类或竞争词，例如：无谷猫粮 / 宠物洁齿..." 
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-6 py-4 text-[15px] font-bold outline-none focus:border-primary-500 transition-all"
                         />
                      </div>
                      <div className="flex bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
                         <button className="px-6 py-3 bg-white shadow-sm rounded-xl text-[12px] font-black text-neutral-900">标准快搜 (列表级)</button>
                         <button className="px-6 py-3 rounded-xl text-[12px] font-black text-neutral-400 hover:text-neutral-600">深度内探 (笔记级)</button>
                      </div>
                      <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-[14px] shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2">
                         <Zap size={18} /> 启动扫描任务
                      </button>
                   </div>
                   
                   <div className="mt-6 flex items-center gap-4 py-3 px-4 bg-orange-50 border border-orange-100 rounded-xl">
                      <Settings size={14} className="text-orange-500 animate-spin-slow" />
                      <p className="text-[11px] text-orange-600 font-bold">
                         <span className="font-black">深度内探模式：</span>将自动进入笔记详情页抓取「收藏/转发」与「作者粉丝数」。为规避风控，系统将以人类阅读频率进行采样，预计耗时 15-30 分钟。
                      </p>
                   </div>
                </div>

                {/* Active Tasks & Results Table */}
                <div className="bg-neutral-0 rounded-[32px] border border-neutral-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Workflow size={18} className="text-primary-500" />
                       <span className="text-[14px] font-black text-neutral-800">探测任务分析视图</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-neutral-500">正在分析: #无谷烘焙冻干猫粮 (32/50 篇)</span>
                       </div>
                       <button className="text-[11px] font-bold flex items-center gap-1 text-primary-500 hover:underline"><RefreshCw size={12}/> 实时同步</button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-neutral-50 border-b border-neutral-100 text-[10px] text-neutral-400 uppercase tracking-widest">
                          <tr>
                            <th className="py-4 px-8 font-black">发现关键词</th>
                            <th className="py-4 px-4 font-black">热度指数 (点赞)</th>
                            <th className="py-4 px-4 font-black">内容质量比 (收/转)</th>
                            <th className="py-4 px-4 font-black">竞争压力 (粉丝均值)</th>
                            <th className="py-4 px-4 font-black text-center">蓝海评分</th>
                            <th className="py-4 px-8 font-black text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="text-[13px] text-neutral-800 font-medium">
                          {[
                            { word: '#新手养幼猫必囤', heat: '2.4w', quality: '15.4%', fanBase: '3.2k', score: 92, trend: 'up' },
                            { word: '#多猫家庭护毛猫粮', heat: '1.2w', quality: '22.8%', fanBase: '850', score: 88, trend: 'up' },
                            { word: '#老龄猫关节养护', heat: '8.4k', quality: '11.5%', fanBase: '1.2w', score: 65, trend: 'stable' },
                            { word: '#平价进口猫粮测评', heat: '52.1w', quality: '4.2%', fanBase: '45w', score: 12, trend: 'down' },
                          ].map((item, idx) => (
                            <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                                <td className="py-5 px-8">
                                    <div className="flex items-center gap-2">
                                       <span className="font-black text-neutral-900">{item.word}</span>
                                       {item.trend === 'up' && <span className="p-1 bg-success-50 text-success-500 rounded-md"><ArrowUp size={10}/></span>}
                                    </div>
                                </td>
                                <td className="py-5 px-4 font-mono font-bold text-neutral-600">{item.heat}</td>
                                <td className="py-5 px-4">
                                   <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 w-12 bg-neutral-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-primary-500" style={{ width: item.quality }} />
                                      </div>
                                      <span className="font-mono text-[11px] font-black">{item.quality}</span>
                                   </div>
                                </td>
                                <td className="py-5 px-4">
                                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${parseInt(item.fanBase) < 5 ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-500'}`}>
                                      {item.fanBase} 均粉
                                   </span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                   <span className={`text-[16px] font-black ${item.score > 80 ? 'text-primary-500' : item.score > 50 ? 'text-neutral-900' : 'text-neutral-300'}`}>
                                      {item.score}
                                   </span>
                                </td>
                                <td className="py-5 px-8 text-right">
                                    <button className="text-[11px] font-black text-white bg-neutral-900 hover:bg-primary-500 px-4 py-2 rounded-xl transition-all">锁定为选题</button>
                                </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                     <p className="text-[11px] text-neutral-400 font-bold italic">* 蓝海评分基于：(收藏+转发)/点赞互动比 与 账号竞争壁垒 综合计算得出</p>
                     <button className="text-[12px] font-black text-neutral-900 hover:underline flex items-center gap-2">查看更多历史探测任务 <ArrowRight size={14}/></button>
                  </div>
                </div>
             </div>
          )}
        </div>
    </div>
  );

};
