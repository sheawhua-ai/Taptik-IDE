import React, { useState } from 'react';
import { 
  Search, ShieldAlert, TrendingUp, BarChart, 
  MapPin, Globe, Compass, Info,
  AlertCircle, ArrowUpRight, Flame, Layers, Orbit, Sparkles, RefreshCw,
  Plus, Target, Play, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const Strategy: React.FC<{ hasData?: boolean; strategyData?: { word: string; rate: string }[] }> = ({ hasData = true, strategyData = [] }) => {
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
    <div className="flex flex-col h-full w-full bg-neutral-50/20 overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-[20px] flex items-center justify-center shadow-md">
               <Compass size={24} className="animate-pulse" />
            </div>
            <div>
               <h2 className="text-[16px] font-black text-neutral-900 tracking-tight">全域巡航与策略决策</h2>
               <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] font-bold text-neutral-400">正在联动内外部数据，生成项目定制决策</p>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-2 bg-blue-50/50 px-4 py-2 rounded-2xl border border-blue-100/50">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">外部雷达与归因反馈在线</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
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
               <h3 className="text-[16px] font-black text-neutral-900 mb-2">正在从全域与归因库抓取数据分析...</h3>
               <p className="text-neutral-400 font-bold text-[12px]">正在整合外部蓝海潜力词，并引入历史项目的 ROI 反馈...</p>
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
               <h3 className="text-2xl font-black text-neutral-900 mb-4 tracking-tight">全域巡航尚未启动</h3>
               <p className="text-neutral-400 font-bold max-w-sm leading-relaxed text-[14px]">
                  左侧控制台分配行业/项目词（如「宠物粮」）后，系统将融合「数据归因」并雷达扫描全网蓝海机会，生成确定的落地打法。
               </p>
               <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav-to-strategy-start'))}
                  className="mt-10 px-8 py-4 bg-neutral-900 text-white rounded-[24px] text-[14px] font-black shadow-2xl hover:bg-primary-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
               >
                  启动全局扫描探测 <ArrowUpRight size={18}/>
               </button>
            </div>
         ) : (
           <div className="max-w-6xl mx-auto space-y-8">
              {/* 基于项目与归因的策略诊断 */}
              <div className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-[16px] font-black text-neutral-900 tracking-tight flex items-center gap-2">
                         <Layers size={18} className="text-blue-500" />
                         当前活跃项目联合策略
                      </h3>
                      <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">整合【外部全域蓝海雷达】与【内部数据归因模型】</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[11px] font-black text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 uppercase tracking-widest flex items-center gap-1">
                         <BarChart size={12}/> 归因置信度: 94%
                       </span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-6 mb-8">
                    {[
                       { title: '外部增量蓝海', sub: '全网（抖音/小红书）长尾搜索暴增词获取', weight: '55%', color: 'bg-rose-500' },
                       { title: '往期归因反馈', sub: '复用近 30 天高转化图文模版，舍弃无效方向', weight: '30%', color: 'bg-blue-500' },
                       { title: '平台资源倾斜', sub: '预测下一周期推荐算法的资源池偏好', weight: '15%', color: 'bg-emerald-500' },
                    ].map((p, i) => (
                       <div key={i} className="p-6 bg-neutral-50/50 rounded-[28px] border border-neutral-100 group hover:bg-white hover:border-primary-200 transition-all">
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                                <span className="text-[13px] font-black text-neutral-900">{p.title}</span>
                             </div>
                             <span className="text-[14px] font-black text-neutral-900">{p.weight}</span>
                          </div>
                          <p className="text-[11px] font-bold text-neutral-500 leading-relaxed mb-4">{p.sub}</p>
                          <div className="">
                             <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div className={`h-full ${p.color}`} style={{ width: p.weight }} />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Actionable Pipeline (The Output Radar) */}
              <div className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-[16px] font-black text-neutral-900 tracking-tight flex items-center gap-2">
                           <Target size={18} className="text-primary-500" />
                           策略探测输出：高潜力切入点
                        </h3>
                        <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">基于联合数据输出，一键发起立项与排期</p>
                     </div>
                 </div>

                 <div className="overflow-hidden border border-neutral-100 rounded-[24px]">
                    <table className="w-full text-left">
                       <thead className="bg-neutral-50/50 border-b border-neutral-100">
                          <tr>
                             <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">建议切入方向 / 蓝海词</th>
                             <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-center">综合机会指数</th>
                             <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest text-right">串联生产链路</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-100">
                          {currentData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-3">
                                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                                     <span className="text-[14px] font-black text-neutral-800">{row.word}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-5 text-center">
                                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[12px] font-black rounded-xl border border-blue-100 shadow-sm">{row.rate}</span>
                               </td>
                               <td className="px-6 py-5 text-right">
                                  <button 
                                    onClick={() => {
                                       window.dispatchEvent(new CustomEvent('nav-to-matrix-create'));
                                    }}
                                    className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[11px] font-black hover:bg-primary-500 hover:shadow-lg transition-all flex items-center gap-2 ml-auto active:scale-95"
                                  >
                                     <Plus size={14} /> 基于此创建项目
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};
