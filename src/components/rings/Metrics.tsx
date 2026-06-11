import React from 'react';
import { 
  BarChart2, TrendingUp, Target, Zap, 
  ArrowUpRight, Share2, Download, Filter,
  Layers, Star, MessageSquare, Flame, CheckCircle2,
  AlertCircle, History, Orbit, Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export const Metrics: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  if (!hasData) {
    return (
      <div className="flex flex-col h-full bg-white overflow-hidden">
        <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                <BarChart2 size={24} />
             </div>
             <div>
                <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">归因复盘中心</h2>
                <p className="text-[11px] font-bold text-neutral-400">目前尚无投放记录，归因引擎正在待命</p>
             </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
           <div className="w-32 h-32 bg-indigo-50 rounded-[48px] flex items-center justify-center text-indigo-200 mb-8 animate-pulse">
              <Activity size={64} />
           </div>
           <h3 className="text-2xl font-black text-neutral-900 mb-4">待点火的数据引擎</h3>
           <p className="text-neutral-400 font-bold max-w-md leading-relaxed">
             当您在“智造工场”发布第一篇笔记后，归因引擎将自动捕获小红书端的流量反馈，并在这里为您呈现 ROI 增长曲线。
           </p>
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'content' } }))}
             className="mt-10 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-neutral-200 hover:bg-primary-500 transition-all"
           >
             去生产第一篇内容
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
               <BarChart2 size={24} />
            </div>
            <div>
               <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">数据归因</h2>
               <p className="text-[11px] font-bold text-neutral-400">Tactical Agent: 正在通过 KOC 溯源码计算实时 ROI (当前 XHS ROI: 4.8x)</p>
            </div>
         </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <CheckCircle2 size={12}/>
              数据同步: 实时同步
           </div>
           <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black shadow-lg shadow-neutral-200 hover:bg-primary-500 transition-all flex items-center gap-2">
              <Download size={16}/> 导出运营月报
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-neutral-50/20">
           <div className="max-w-7xl mx-auto space-y-10">
              {/* Main Stats */}
              <div className="grid grid-cols-12 gap-8">
                 <div className="col-span-12 bg-white rounded-[48px] border border-neutral-100 p-12 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
                       <Orbit size={300} className="text-indigo-500" />
                    </div>
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-12">
                          <div>
                             <h3 className="text-[28px] font-black text-neutral-900 tracking-tight leading-none italic">2026-Q2 运营总览</h3>
                             <p className="text-[14px] text-neutral-400 font-bold mt-2 flex items-center gap-2 uppercase tracking-widest leading-none">
                                酒店行业 • <span className="text-indigo-500">智策系统 AI 优化</span>
                             </p>
                          </div>
                          <div className="flex gap-12">
                             <div className="text-right">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">预估变现 GMV</p>
                                <p className="text-4xl font-black text-neutral-900 tracking-tighter">¥58,204.00</p>
                             </div>
                             <div className="text-right border-l border-neutral-100 pl-12">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">获客投资回报率</p>
                                <p className="text-4xl font-black text-emerald-500 tracking-tighter">8.42x</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-4 gap-8 mb-12">
                          {[
                            { label: '笔记总产出', val: '142 篇', sub: '+24%', icon: Layers },
                            { label: '万粉博主收录', val: '12 位', sub: 'MATRIX', icon: Flame },
                            { label: '咨询留资线索', val: '482 条', sub: '92.1%', icon: MessageSquare },
                            { label: '实际核销单量', val: '58 单', sub: 'READY', icon: CheckCircle2 },
                          ].map((s, i) => (
                            <div key={i} className="p-8 bg-neutral-50/50 rounded-[40px] border border-neutral-100 hover:bg-neutral-50 hover:shadow-xl transition-all">
                               <div className="flex items-center justify-between mb-4">
                                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-neutral-400">
                                     <s.icon size={18}/>
                                  </div>
                                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">{s.sub}</span>
                               </div>
                               <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.1em] mb-1">{s.label}</p>
                               <span className="text-3xl font-black text-neutral-900 tracking-tighter">{s.val}</span>
                            </div>
                          ))}
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="flex -space-x-3">
                             {[1,2,3,4,5].map(i => (
                               <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-neutral-100" alt="" />
                             ))}
                          </div>
                          <p className="text-[12px] font-bold text-neutral-500">本月已有 <span className="text-neutral-900">4,821</span> 名潜在客户通过 TapTik 触达转化</p>
                          <div className="flex-1 border-t border-dashed border-neutral-100 mx-8" />
                          <button className="px-6 py-3 bg-neutral-900 text-white rounded-2xl text-[13px] font-black hover:bg-primary-500 hover:scale-[1.02] active:scale-95 transition-all">查看归因报告</button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Performance Ranking */}
              <div className="grid grid-cols-12 gap-8">
                 <div className="col-span-7 bg-white rounded-[48px] border border-neutral-100 p-10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                       <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                          <Star size={24} className="text-amber-500 fill-amber-500" /> 最佳爆款表现
                       </h3>
                       <div className="flex p-1 bg-neutral-50 rounded-xl border border-neutral-100">
                          <button className="px-3 py-1 text-[10px] font-black rounded-lg bg-white shadow-sm">阅读数</button>
                          <button className="px-3 py-1 text-[10px] font-black rounded-lg text-neutral-400">互动数</button>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {[
                         { title: '《淡季980住瑞吉，真香现场》', conversion: '4.2w', group: '矩阵A-5', rate: '12%', color: 'bg-emerald-500' },
                         { title: '《推开窗的那一刻，我决定续住》', conversion: '2.8w', group: '矩阵A-1', rate: '8.4%', color: 'bg-blue-500' },
                         { title: '《青岛海边民宿避坑指南》', conversion: '1.5w', group: '素人号-3', rate: '2.1%', color: 'bg-rose-500' },
                       ].map((note, i) => (
                         <div key={i} className="group p-6 bg-neutral-50/50 hover:bg-white hover:shadow-2xl hover:shadow-neutral-200/50 border border-neutral-100 rounded-[32px] transition-all flex items-center gap-8">
                            <div className="w-16 h-20 bg-neutral-200 rounded-2xl shrink-0 overflow-hidden shadow-inner relative">
                               <div className={`absolute inset-0 opacity-20 ${note.color}`} />
                               <div className="w-full h-full flex items-center justify-center font-black text-neutral-400 text-[10px]">缩略图</div>
                            </div>
                            <div className="flex-1">
                               <h4 className="text-[16px] font-bold text-neutral-900 mb-2">{note.title}</h4>
                               <div className="flex items-center gap-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-1"><Flame size={12}/> {note.conversion} 阅读次数</span>
                                  <span className="flex items-center gap-1"><Share2 size={12}/> {note.group}</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">变现贡献</p>
                               <p className="text-[20px] font-black text-neutral-900 tracking-tighter">{note.rate}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="col-span-12 lg:col-span-5 bg-neutral-900 rounded-[48px] p-10 text-white relative overflow-hidden flex flex-col">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                    <div className="relative z-10 flex-1">
                       <div className="flex items-center justify-between mb-10">
                          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                             < Zap size={24} className="text-primary-400 fill-primary-400" /> 增长优化建议
                          </h3>
                          <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-400">优化闭环</div>
                       </div>
                       
                       <div className="space-y-8">
                          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] relative">
                             <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Target size={16} />
                             </div>
                             <p className="text-[16px] font-bold text-neutral-300 leading-relaxed italic">
                                “ 归因模型显示，<span className="text-white">#反向旅游</span> 关键词在凌晨时段的点击成本下降了 40%，且转化率提升了 12%。建议下周将运营蓝图的该类权重调高至 <span className="text-primary-400">15%</span>。 ”
                             </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">最高权重建议</p>
                                <p className="text-[15px] font-black text-white">#淡季攻略</p>
                             </div>
                             <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">预估下周增速</p>
                                <p className="text-[15px] font-black text-emerald-400">+18.2%</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => {
                          window.dispatchEvent(new CustomEvent('nav-to-strategy'));
                      }}
                      className="mt-10 w-full py-5 bg-white text-neutral-900 rounded-[28px] font-black text-[15px] flex items-center justify-center gap-3 hover:bg-primary-500 hover:text-white hover:translate-y-[-2px] transition-all shadow-xl shadow-black/20"
                    >
                       采纳并重构运营策略 <ArrowUpRight size={20}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
