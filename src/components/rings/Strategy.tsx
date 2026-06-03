import React, { useState } from 'react';
import { 
  Search, ShieldAlert, TrendingUp, BarChart, 
  MapPin, Globe, Compass, Info,
  AlertCircle, ArrowUpRight, Flame, Layers, Orbit, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const Strategy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueocean' | 'keywords' | 'distribution'>('blueocean');

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Compass size={24} />
           </div>
           <div>
              <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">全域巡航看板</h2>
              <p className="text-[11px] font-bold text-neutral-400">实时监测蓝海词表现，追踪搜索占位与笔记分布</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-2xl">
           {[
             { id: 'blueocean', name: '蓝海词看板', icon: Flame },
             { id: 'keywords', name: '搜索占位', icon: Search },
             { id: 'distribution', name: '笔记分配', icon: Layers }
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

      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-neutral-50/20">
         {activeTab === 'blueocean' && (
           <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-12 gap-8">
                 <div className="col-span-8 space-y-8">
                    <div className="bg-white rounded-[40px] border border-neutral-100 p-8 shadow-sm">
                       <div className="flex items-center justify-between mb-8">
                          <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                             <TrendingUp size={20} className="text-blue-500" />
                             本周核心蓝海词表现
                          </h3>
                       </div>
                       
                       <div className="overflow-hidden border border-neutral-50 rounded-3xl">
                          <table className="w-full text-left">
                             <thead className="bg-neutral-50/50 border-b border-neutral-100">
                                <tr>
                                   <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">核心关键词</th>
                                   <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-center">搜索总量 (本周)</th>
                                   <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-center">内容饱和度</th>
                                   <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-center">机会指数</th>
                                   <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-right">操作</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-neutral-50">
                                {[
                                  { word: '青岛带私人泳池民宿', vol: '12,402', notes: '45%', rate: '92', color: 'text-rose-500' },
                                  { word: '淡季青岛攻略', vol: '8,291', notes: '82%', rate: '75', color: 'text-emerald-500' },
                                  { word: '毕业季海边出游', vol: '15,002', notes: '20%', rate: '98', color: 'text-blue-500' },
                                ].map((row, idx) => (
                                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                     <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                           <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
                                           <span className="text-[15px] font-black text-neutral-800">{row.word}</span>
                                        </div>
                                     </td>
                                     <td className="px-6 py-5 text-center text-[14px] font-mono font-bold text-neutral-900">{row.vol}</td>
                                     <td className="px-6 py-5 text-center text-[14px] font-bold text-neutral-400">
                                        <div className="w-20 mx-auto h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                           <div className="h-full bg-neutral-300 rounded-full" style={{ width: row.notes }} />
                                        </div>
                                     </td>
                                     <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[13px] font-black rounded-lg">{row.rate}</span>
                                     </td>
                                     <td className="px-6 py-5 text-right">
                                        <button 
                                          onClick={() => {
                                             window.dispatchEvent(new CustomEvent('nav-to-factory', { detail: { keyword: row.word } }));
                                          }}
                                          className="p-2 hover:bg-primary-50 text-neutral-400 hover:text-primary-500 transition-all rounded-lg group/btn"
                                          title="发送至智造工场"
                                        >
                                           <Sparkles size={16} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>

                 <div className="col-span-4 space-y-8">
                    <div className="bg-neutral-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                       <div className="relative z-10">
                          <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                             <Orbit size={14} /> Global Search Hijacking
                          </div>
                          <h3 className="text-xl font-black mb-4 tracking-tight">全域搜索自检</h3>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                             <p className="text-[11px] font-black text-neutral-400 uppercase mb-2 text-center">主要终端占位进度</p>
                             <div className="flex justify-around py-2">
                                <div className="text-center">
                                   <p className="text-lg font-black text-white">42%</p>
                                   <p className="text-[9px] text-neutral-500">MOBILE</p>
                                </div>
                                <div className="text-center">
                                   <p className="text-lg font-black text-white">68%</p>
                                   <p className="text-[9px] text-neutral-500">PC/WEB</p>
                                </div>
                             </div>
                          </div>
                          <button className="w-full mt-4 py-4 bg-primary-500 text-white rounded-2xl font-black text-[13px] hover:translate-y-[-2px] transition-all">开启强占位巡航 &rarr;</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
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
