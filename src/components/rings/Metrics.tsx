import React from 'react';
import { 
  BarChart2, TrendingUp, Target, Zap, 
  ArrowUpRight, Share2, Download, Filter,
  Layers, Star, MessageSquare, Flame, CheckCircle2,
  AlertCircle, History, Orbit
} from 'lucide-react';
import { motion } from 'motion/react';

export const Metrics: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
              <BarChart2 size={24} />
           </div>
           <div>
              <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">效果复盘与 ROI 驾驶舱</h2>
              <p className="text-[11px] font-bold text-neutral-400">实时监控全域投产比，自动生成运营深度月报</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-neutral-50 text-neutral-600 rounded-xl text-[12px] font-black hover:bg-neutral-100 transition-all border border-neutral-100 flex items-center gap-2">
              <History size={16}/> 历史报告
           </button>
           <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black shadow-lg shadow-neutral-200 hover:bg-primary-500 hover:translate-y-[-1px] transition-all flex items-center gap-2">
              <Download size={16}/> 导出当前报表
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-neutral-50/20">
         <div className="max-w-7xl mx-auto space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-12 gap-8">
               <div className="col-span-8 bg-white rounded-[40px] border border-neutral-100 p-10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                     <Orbit size={200} className="text-indigo-500" />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-8">
                        <div>
                           <h3 className="text-2xl font-black text-neutral-900 tracking-tight italic">5月 运营运营总况</h3>
                           <p className="text-[13px] text-neutral-400 font-bold mt-1">青岛瑞吉酒店 · 跨平台全链路监测</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">本月消耗 Credits</p>
                              <p className="text-xl font-black text-neutral-900 tracking-tighter">4,820</p>
                           </div>
                           <div className="w-px h-10 bg-neutral-100" />
                           <div className="text-right">
                              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">预估 GMV</p>
                              <p className="text-xl font-black text-indigo-500 tracking-tighter">¥58,200</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-4 gap-6 p-8 bg-neutral-50/50 rounded-[32px] border border-neutral-100">
                        {[
                          { label: '发布笔记', val: '20 篇', icon: Layers },
                          { label: '有效互动', val: '48.2k', icon: Flame },
                          { label: '咨询线索', val: '48 条', icon: MessageSquare },
                          { label: '到店成交', val: '12 单', icon: CheckCircle2 },
                        ].map((s, i) => (
                          <div key={i} className="flex flex-col gap-2">
                             <div className="text-neutral-400 flex items-center gap-2"><s.icon size={14}/><span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span></div>
                             <span className="text-2xl font-black text-neutral-900 tracking-tighter">{s.val}</span>
                          </div>
                        ))}
                     </div>
                     
                     <div className="mt-8 flex items-center justify-between">
                        <div className="flex gap-2">
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">ROI: 5.8x</span>
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100">高于行业平均水平 24%</span>
                        </div>
                        <button className="text-[12px] font-black text-neutral-900 hover:underline flex items-center gap-1">查看详细趋势图 <ArrowUpRight size={14}/></button>
                     </div>
                  </div>
               </div>
               
               <div className="col-span-4 bg-neutral-100/50 rounded-[40px] border-2 border-dashed border-neutral-200 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Target size={32} className="text-indigo-500" />
                  </div>
                  <h4 className="text-[18px] font-black text-neutral-900 mb-2">生成本周深度复盘</h4>
                  <p className="text-[13px] text-neutral-400 font-bold max-w-[200px] leading-relaxed">AI 自动提取爆文逻辑，优化下周投放策略</p>
               </div>
            </div>

            {/* Performance Ranking */}
            <div className="grid grid-cols-2 gap-8">
               <div className="bg-white rounded-[40px] border border-neutral-100 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 px-2">
                     <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <Star size={20} className="text-amber-500" /> 最佳转化笔记 TOP 3
                     </h3>
                     <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">By Conversion Rate</span>
                  </div>
                  <div className="space-y-4">
                     {[
                       { title: '《淡季980住瑞吉》', conversion: '40%', engagement: '9,800', leads: '5单' },
                       { title: '《推开窗的那一刻》', conversion: '28%', engagement: '7,200', leads: '3单' },
                       { title: '《青岛避坑！住瑞吉》', conversion: '15%', engagement: '4,500', leads: '2单' },
                     ].map((note, i) => (
                       <div key={i} className="group p-5 bg-neutral-50/50 hover:bg-white hover:shadow-xl hover:shadow-neutral-200/50 border border-neutral-100 rounded-[32px] transition-all flex items-center gap-6">
                          <div className="w-12 h-16 bg-neutral-200 rounded-xl shrink-0 overflow-hidden shadow-inner">
                             <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-primary-500" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-[14px] font-black text-neutral-900 mb-1">{note.title}</h4>
                             <div className="flex items-center gap-4 text-[11px] font-bold text-neutral-400">
                                <span className="flex items-center gap-1"><Flame size={12}/> {note.engagement}</span>
                                <span className="flex items-center gap-1"><Target size={12}/> 获客 {note.leads}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">转化率</p>
                             <p className="text-[18px] font-black text-emerald-500 tracking-tighter">{note.conversion}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white rounded-[40px] border border-neutral-100 p-8 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8 px-2">
                     <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <AlertCircle size={20} className="text-orange-500" /> 增长优化建议
                     </h3>
                  </div>
                  <div className="flex-1 space-y-6">
                      <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-[32px] flex items-center justify-between gap-6">
                        <p className="text-[14px] text-neutral-600 font-bold leading-relaxed italic flex-1">
                           “根据本月数据分析，<span className="text-neutral-900">#亲子房</span> 类笔记的互动率虽高，但成交转化率低于平均水平。建议下月调整对此类内容的投放，增加 <span className="text-indigo-600">攻略类</span> 与 <span className="text-indigo-600">捡漏类</span> 内容的占比。”
                        </p>
                        <button 
                           onClick={() => {
                              window.dispatchEvent(new CustomEvent('nav-to-strategy'));
                           }}
                           className="px-4 py-2 bg-white text-neutral-900 border border-orange-200 rounded-xl text-[11px] font-black hover:bg-orange-100 transition-all shrink-0 shadow-sm"
                        >
                           进入策略中心验证
                        </button>
                      </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                           <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">最佳发布窗口</p>
                           <p className="text-[14px] font-black text-neutral-900">周五晚 8:00 <span className="text-emerald-500">(+40%)</span></p>
                        </div>
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                           <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">最佳内容类型</p>
                           <p className="text-[14px] font-black text-neutral-900">清单型/干货</p>
                        </div>
                     </div>
                  </div>
                  <button className="mt-8 w-full py-4 bg-neutral-900 text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all">
                     采纳并生成 6月 运营计划
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
