import React, { useState } from 'react';
import { 
  Search, ShieldAlert, TrendingUp, BarChart, 
  MapPin, Globe, Compass, Info,
  AlertCircle, ArrowUpRight, Flame, Layers, Orbit, Sparkles, RefreshCw,
  Plus, Target, Play, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const Strategy: React.FC<{ hasData?: boolean; strategyData?: { word: string; rate: string }[] }> = ({ hasData = true, strategyData = [] }) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'keywords' | 'distribution'>('blueprint');
  const [selectedIndustry, setSelectedIndustry] = useState('宠物用品');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);

  const INDUSTRIES = ['宠物用品', '美妆护肤', '户外运动', '家居百货', '母婴育儿'];

  const cacheMap: Record<string, { word: string; rate: string }[]> = {
    '宠物用品': [
      { word: '宠物零食高性价比挖掘', rate: '92' },
      { word: '幼犬换粮避坑指南', rate: '75' },
      { word: '国产平替猫粮测评', rate: '98' },
    ],
    '美妆护肤': [
      { word: '早C晚A入门必备', rate: '88' },
      { word: '大油皮控油粉底液', rate: '94' },
      { word: '敏感肌修复精华测评', rate: '82' },
    ]
  };

  const currentData = strategyData.length > 0 ? strategyData : (cacheMap[selectedIndustry] || []);

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    if (!cacheMap[industry]) {
      setIsFetching(true);
      setFetchProgress(0);
      const timer = setInterval(() => {
        setFetchProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsFetching(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
  };

  const isEmpty = (!hasData && strategyData.length === 0) && !isFetching;

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
               <Compass size={24} className="animate-pulse" />
            </div>
            <div>
               <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">巡航侦察</h2>
               <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] font-bold text-neutral-400">正在实时监测: </p>
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tight">
                    小红书 竞品 KOS 矩阵
                  </span>
               </div>
            </div>
         </div>
        
        <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-2xl">
           {[
             { id: 'blueprint', name: '运营策略中心', icon: Orbit },
             { id: 'keywords', name: '蓝海词雷达', icon: Search },
             { id: 'distribution', name: '平台资产矩阵', icon: Layers }
           ].map((tab) => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-neutral-900 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
             >
                <tab.icon size={14} className={activeTab === tab.id ? 'text-primary-500' : ''} />
                {tab.name}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-neutral-50/20">
         {isFetching ? (
            <div className="flex flex-col items-center justify-center h-full">
               <div className="w-32 h-32 relative flex items-center justify-center mb-8">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-primary-500 rounded-full" 
                    style={{ clipPath: `inset(0 0 ${100 - fetchProgress}% 0)` }}
                  />
                  <RefreshCw className="text-primary-500 animate-spin" size={40} />
               </div>
               <h3 className="text-xl font-black text-neutral-900 mb-2">正在从全域抓取「{selectedIndustry}」蓝海词...</h3>
               <p className="text-neutral-400 font-bold text-sm">正在整合 TikTok 趋势、抖音热门、知乎问答库等数据源...</p>
            </div>
         ) : isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center w-full min-h-full">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center text-blue-300 mb-8"
               >
                  <Compass size={48} />
               </motion.div>
               <h3 className="text-2xl font-black text-neutral-900 mb-4 tracking-tight">智策巡航尚未启动</h3>
               <p className="text-neutral-400 font-bold max-w-sm leading-relaxed text-[14px]">
                  请在左侧对话框中输入您的业务关键词（如「宠物粮」），助手将自动为您扫描全域流量蓝图，并生成确定性的操作蓝图。
               </p>
               <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav-to-strategy-start'))}
                  className="mt-10 px-8 py-4 bg-neutral-900 text-white rounded-[24px] text-[14px] font-black shadow-2xl hover:bg-primary-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
               >
                  查看教学视频或手册 <ArrowUpRight size={18}/>
               </button>
            </div>
         ) : activeTab === 'blueprint' && (
           <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-white rounded-[40px] border border-neutral-100 p-8 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                           <TrendingUp size={20} className="text-blue-500" />
                           操盘手落地执行决策 (Direct Strategy)
                        </h3>
                        <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">基于实时大盘数据的确定性策略输出</p>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-neutral-400">数据同步状态:</span>
                            <span className="text-[11px] font-black text-success-600 bg-success-50 px-2 py-1 rounded">LIVE</span>
                         </div>
                         <div className="flex items-center gap-2 text-primary-500 text-[11px] font-black uppercase tracking-[0.2em] bg-primary-50 px-3 py-1 rounded-full">
                           <Orbit size={14} /> 流量自动巡航中
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-6 mb-10">
                      {[
                         { title: '全域搜索拦截', sub: '针对核心蓝海词的精准占位，构建流量护城河', weight: '45%', color: 'bg-rose-500' },
                         { title: '竞品心智攻势', sub: '基于竞品评论区的侧向切入，挖掘存量转化机会', weight: '35%', color: 'bg-blue-500' },
                         { title: 'KOC 规模分发', sub: '构建品牌自有的多节点传播网，实现爆发式传播', weight: '20%', color: 'bg-emerald-500' },
                      ].map((p, i) => (
                         <div key={i} className="p-6 bg-neutral-50 rounded-[32px] border border-neutral-100 group hover:bg-white hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                                  <span className="text-[14px] font-black text-neutral-900">{p.title}</span>
                               </div>
                               <span className="text-[15px] font-black text-neutral-900">{p.weight}</span>
                            </div>
                            <p className="text-[12px] font-bold text-neutral-400 leading-relaxed mb-4">{p.sub}</p>
                            <div className="">
                               <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${p.color}`} style={{ width: p.weight }} />
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="overflow-hidden border border-neutral-100 rounded-3xl">
                      <table className="w-full text-left">
                         <thead className="bg-neutral-50/50 border-b border-neutral-100">
                            <tr>
                               <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">核心蓝海词</th>
                               <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-center">机会指数</th>
                               <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-right">流水线操作</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-neutral-50">
                            {currentData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                 <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                                       <span className="text-[15px] font-black text-neutral-800">{row.word}</span>
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
                                      className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[11px] font-black hover:bg-primary-500 transition-all flex items-center gap-2 ml-auto"
                                    >
                                       <Sparkles size={14} /> 送入智造工坊
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
         )}

         {activeTab === 'keywords' && (
            <div className="max-w-6xl mx-auto space-y-12 py-6">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <Search size={24} className="text-primary-500" />
                        蓝海词全域雷达
                     </h3>
                     <p className="text-neutral-500 font-bold mt-2">实时监测多平台（TikTok/抖音/知乎/小红书）爆发潜力词</p>
                  </div>
               </div>

               <div className="grid grid-cols-4 gap-6">
                  {[
                     { platform: 'TikTok', trend: '上升', count: 1242, color: 'text-cyan-500' },
                     { platform: '抖音', trend: '爆发', count: 892, color: 'text-rose-500' },
                     { platform: '知乎', trend: '平稳', count: 452, color: 'text-blue-500' },
                     { platform: '小红书', trend: '上升', count: 2130, color: 'text-rose-600' },
                  ].map((p, i) => (
                     <div key={i} className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[12px] font-black text-neutral-400 uppercase tracking-widest">{p.platform}</span>
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${p.trend === '爆发' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              {p.trend}
                           </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                           <span className="text-2xl font-black text-neutral-900">{p.count}</span>
                           <span className="text-[10px] font-bold text-neutral-400">词条</span>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="bg-white rounded-[40px] border border-neutral-100 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-neutral-50">
                     <div className="text-[14px] font-black text-neutral-900">核心爆发蓝海词分布</div>
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
                           <span className="text-[11px] font-bold text-neutral-500 tracking-tight">高转化潜力</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 bg-neutral-200 rounded-full" />
                           <span className="text-[11px] font-bold text-neutral-500 tracking-tight">低竞争度</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     {currentData.map((row, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:bg-white hover:shadow-lg transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 font-black text-xs shadow-sm">
                                 #{idx + 1}
                              </div>
                              <div>
                                 <div className="text-[15px] font-black text-neutral-900">{row.word}</div>
                                 <div className="text-[10px] font-bold text-neutral-400 mt-0.5">全网搜索量 7 日增长率 {row.rate}%</div>
                              </div>
                           </div>
                           <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[11px] font-black opacity-0 group-hover:opacity-100 transition-all">
                              开始追踪
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
