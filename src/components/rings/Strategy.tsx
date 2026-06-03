import React, { useState } from 'react';
import { 
  Search, ShieldAlert, TrendingUp, BarChart, 
  MapPin, Globe, Compass, Info,
  AlertCircle, ArrowUpRight, Flame, Layers, Orbit, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const Strategy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'keywords' | 'distribution'>('blueprint');

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Compass size={24} />
           </div>
           <div>
              <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">全域巡航 & 运营蓝图</h2>
              <p className="text-[11px] font-bold text-neutral-400">Blueprint Agent: 负责多平台任务权重分配与流量占位监测</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-2xl">
           {[
             { id: 'blueprint', name: '运营蓝图', icon: Orbit },
             { id: 'keywords', name: '热词雷达', icon: Search },
             { id: 'distribution', name: '平台矩阵', icon: Layers }
           ].map((tab) => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-neutral-900 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
             >
                <tab.icon size={14} className={activeTab === tab.id ? 'text-blue-500' : ''} />
                {tab.name}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {activeTab === 'blueprint' && (
           <>
             {/* Left: Strategic Decisions */}
             <div className="w-[480px] border-r border-neutral-100 flex flex-col h-full bg-neutral-50/20 overflow-y-auto custom-scrollbar">
                <div className="p-10 space-y-10">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                            <Orbit size={16} className="text-blue-500" /> 策略权重分配
                         </h3>
                         <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg border border-blue-100">AGENT SUGGESTED</span>
                      </div>
                      
                      <div className="space-y-4">
                         {[
                           { platform: '小红书', weight: '50%', goal: '种草/心智', color: 'bg-rose-500', trend: 'UP' },
                           { platform: '抖音', weight: '30%', goal: '引流/带货', color: 'bg-neutral-900', trend: 'STABLE' },
                           { platform: '视频号', weight: '20%', goal: '私域/沉淀', color: 'bg-emerald-500', trend: 'UP' },
                         ].map((p, i) => (
                           <div key={i} className="p-6 bg-white rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-xl transition-all group">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${p.color}`} />
                                    <span className="text-[14px] font-black text-neutral-900">{p.platform}</span>
                                 </div>
                                 <span className={`text-[10px] font-black ${p.trend === 'UP' ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                    {p.trend === 'UP' ? '↗ 流量上行' : '→ 持平'}
                                 </span>
                              </div>
                              <div className="flex items-end justify-between">
                                 <div className="space-y-1">
                                    <span className="text-4xl font-black text-neutral-900 tracking-tighter">{p.weight}</span>
                                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{p.goal}</p>
                                 </div>
                                 <div className="w-24 h-1 bg-neutral-50 rounded-full overflow-hidden">
                                    <div className={`h-full ${p.color}`} style={{ width: p.weight }} />
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>

                      <button className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all shadow-lg active:scale-95">
                         确认并锁定蓝图 <ArrowUpRight size={16}/>
                      </button>
                   </div>

                   <div className="pt-8 border-t border-neutral-100">
                      <div className="bg-neutral-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                         <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/20 blur-[50px] rounded-full" />
                         <div className="relative z-10">
                            <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                               <Orbit size={14} /> Keyword Pilot Active
                            </div>
                            <h3 className="text-xl font-black mb-4 tracking-tight">流量自动巡航</h3>
                            <p className="text-[13px] text-neutral-400 font-bold mb-6 leading-relaxed">
                              监测全网 4,203 个点位，发现高转化蓝海词将自动触发预警。
                            </p>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                               <div className="flex items-center justify-between">
                                 <span className="text-[11px] font-black text-neutral-400">今日报警</span>
                                 <span className="text-[11px] font-black text-rose-400">12 个</span>
                               </div>
                               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    animate={{ x: ['-100%', '100%'] }} 
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="w-1/3 h-full bg-primary-500" 
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Operational Result Canvas */}
             <div className="flex-1 bg-neutral-50/30 overflow-y-auto custom-scrollbar p-12">
                <div className="max-w-5xl mx-auto space-y-10">
                   <div className="bg-white rounded-[48px] border border-neutral-100 p-12 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
                         <Orbit size={300} className="text-blue-500" />
                      </div>
                      
                      <div className="relative z-10">
                         <div className="flex items-center justify-between mb-12">
                            <div>
                               <h3 className="text-[28px] font-black text-neutral-900 tracking-tight leading-none italic">本周核心蓝海池</h3>
                               <p className="text-[14px] text-neutral-400 font-bold mt-3 uppercase tracking-widest leading-none flex items-center gap-2">
                                  <Sparkles size={14} className="text-blue-500"/> Blueprint Agent Orchestrated
                               </p>
                            </div>
                            <div className="flex gap-4">
                               <div className="p-4 bg-neutral-50 rounded-2xl text-center min-w-[120px]">
                                  <p className="text-[10px] font-black text-neutral-400 uppercase mb-1">机会指数均值</p>
                                  <p className="text-2xl font-black text-blue-500">88.4</p>
                               </div>
                            </div>
                         </div>

                         <div className="overflow-hidden border border-neutral-100 rounded-[32px] bg-white">
                            <table className="w-full text-left">
                               <thead className="bg-neutral-50/50 border-b border-neutral-100">
                                  <tr>
                                     <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest">关键词内容</th>
                                     <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-center">系统打分</th>
                                     <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-right">流水线操作</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-neutral-50">
                                  {[
                                    { word: '青岛带私人泳池民宿', rate: '92', type: '爆款潜质' },
                                    { word: '淡季青岛攻略', rate: '75', type: '长效搜索' },
                                    { word: '毕业季海边出游', rate: '98', type: '季节刚需' },
                                    { word: '五四广场周边高评分酒店', rate: '82', type: '精准流量' },
                                  ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-neutral-50/50 transition-colors group">
                                       <td className="px-8 py-6">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-blue-500 font-black text-[12px] group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                {idx + 1}
                                             </div>
                                             <div>
                                                <span className="text-[16px] font-black text-neutral-900 block">{row.word}</span>
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 block">{row.type}</span>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6 text-center">
                                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-black">
                                             <Flame size={12}/> {row.rate}
                                          </div>
                                       </td>
                                       <td className="px-8 py-6 text-right">
                                          <button 
                                            onClick={() => {
                                               window.dispatchEvent(new CustomEvent('nav-to-factory', { detail: { keyword: row.word } }));
                                            }}
                                            className="px-6 py-3 bg-neutral-900 text-white rounded-2xl text-[12px] font-black hover:bg-blue-500 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2 ml-auto shadow-sm"
                                          >
                                             <Sparkles size={14} /> 送入智造工场
                                          </button>
                                       </td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </>
         )}

         {activeTab === 'keywords' && (
           <div className="max-w-6xl mx-auto py-20 text-center">
              <Search className="mx-auto mb-6 text-neutral-200" size={60} />
              <h3 className="text-xl font-black text-neutral-900">搜索占位监控</h3>
              <p className="text-neutral-400 font-medium">深度解析各关键词在小红书、抖音等平台的实时排名快照</p>
           </div>
         )}
         
         {activeTab === 'distribution' && (
           <div className="max-w-6xl mx-auto py-20 text-center">
              <Layers className="mx-auto mb-6 text-neutral-200" size={60} />
              <h3 className="text-xl font-black text-neutral-900">笔记分配矩阵</h3>
              <p className="text-neutral-400 font-medium">查看哪些蓝海词已经分配给哪些账号，哪些漏了发</p>
           </div>
         )}
      </div>
    </div>
  );
};
