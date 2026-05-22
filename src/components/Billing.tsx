import React from 'react';
import { 
  Coins, CreditCard, Activity, Download, Sparkles, Database
} from 'lucide-react';

export const Billing: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar">
       <div className="p-8 border-b border-zinc-100 bg-white shrink-0 relative z-10">
           <h1 className="text-2xl font-black text-zinc-900 tracking-tight">消耗与资源对账</h1>
           <p className="text-[13px] text-zinc-400 font-bold mt-1 uppercase tracking-widest">Billing & Consumption Management</p>
       </div>
       
       <div className="flex-1 p-8 max-w-6xl space-y-10">
           {/* 核心余额卡片 - 采用更加大气的布局 */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[260px] group transition-all hover:scale-[1.01]">
                 <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                    <Sparkles size={160} className="text-[#685FAB]" />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="px-3 py-1 bg-[#685FAB] rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">Enterprise Wallet</div>
                       <span className="text-zinc-500 text-[11px] font-bold">组织 ID: 150007802</span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-2">
                       <span className="text-5xl font-black tracking-tighter">4,720.00</span>
                       <span className="text-zinc-500 text-lg font-bold">T-Credits</span>
                    </div>
                    <p className="text-zinc-400 text-[13px] font-medium max-w-md">基于 Agent 的全自动消耗结算。当前余额支持约 2,360 篇原创笔记生成或 15,000 次 RAG 语义索引调用。</p>
                 </div>
                 <div className="relative z-10 flex items-center gap-3 mt-8">
                    <button className="bg-white text-zinc-900 hover:bg-zinc-100 px-8 py-3.5 rounded-2xl text-[14px] font-black shadow-xl transition-all active:scale-95">钱包充值</button>
                    <button className="bg-[#685FAB]/20 border border-[#685FAB]/30 text-[#685FAB] hover:bg-[#685FAB]/30 px-8 py-3.5 rounded-2xl text-[14px] font-black transition-all">账单概览</button>
                 </div>
              </div>
              
              <div className="lg:col-span-4 bg-[#fbfbfb] border border-zinc-100 rounded-[32px] p-8 flex flex-col justify-between shadow-sm">
                 <div>
                    <div className="flex items-center gap-2 text-zinc-400 font-black text-[11px] uppercase tracking-widest mb-6">
                       <CreditCard size={14} /> 订阅状态
                    </div>
                    <div className="mb-4">
                        <h3 className="text-2xl font-black text-zinc-900 leading-none">企业年卡</h3>
                        <p className="text-[13px] text-zinc-500 font-bold mt-2">¥ 3,990 / 年</p>
                    </div>
                    <div className="space-y-3 mt-6">
                       <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100/50">
                          <Activity size={14} /> 生效中 (剩余 342 天)
                       </div>
                    </div>
                 </div>
                 <button className="w-full mt-8 bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 py-3.5 rounded-2xl text-[13px] font-black transition-all shadow-sm">续费或升级方案</button>
              </div>
           </div>

           {/* 资产消耗颗粒度 */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-lg font-black text-zinc-900 tracking-tight">消耗流水细分</h2>
                    <p className="text-[13px] text-zinc-400 font-bold">每日 00:00 自动校对 Agent 执行日志并清结算</p>
                 </div>
                 <button className="text-[12px] font-black text-zinc-500 border border-zinc-200 bg-white hover:bg-zinc-50 px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
                    <Download size={14}/> 导出报表
                 </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 {[
                    { date: '05-07 10:24', project: '宠物食品组', type: 'KOC矩阵分发', detail: '小红书代写 (15篇)', engine: 'DeepSeek-V3', cost: '-30' },
                    { date: '05-07 09:12', project: '美妆旗舰店', type: '新品高赞仿写', detail: '深度图文改写 (5个)', engine: 'GPT-4o', cost: '-45' },
                    { date: '05-06 22:45', project: '数码组', type: '全域 RAG 索引', detail: '同步 1,200 个文档块', engine: 'LanceDB+V3', cost: '-12' },
                 ].map((row, i) => (
                    <div key={i} className="bg-white border border-zinc-100 rounded-[24px] p-5 flex items-center justify-between hover:border-[#685FAB]/20 hover:bg-[#685FAB]/[0.01] transition-all group">
                       <div className="flex items-center gap-6 flex-1">
                          <div className="text-[11px] font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">{row.date}</div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-[#685FAB] transition-colors border border-transparent group-hover:border-zinc-200">
                                <Database size={18} />
                             </div>
                             <div>
                                <h4 className="text-[14px] font-black text-zinc-900 leading-tight">{row.project}</h4>
                                <p className="text-[12px] text-zinc-400 font-bold mt-0.5">{row.type} · <span className="text-[#685FAB]/70">{row.detail}</span></p>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="text-right">
                             <div className="text-[11px] font-black text-zinc-300 uppercase tracking-tighter mb-0.5">Execution Engine</div>
                             <div className="text-[13px] font-bold text-zinc-600">{row.engine}</div>
                          </div>
                          <div className="w-20 text-right text-lg font-black text-rose-500 tracking-tighter">
                             {row.cost}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
       </div>
    </div>
  );
};
