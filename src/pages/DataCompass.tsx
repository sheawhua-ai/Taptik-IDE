import React from 'react';

export default function DataCompass() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">数据罗盘</h2>
          <p className="text-zinc-500 mt-1">全局策略转化与资产管理中枢</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium text-zinc-700">
            <span className="w-2 h-2 rounded-full bg-[#5157a7] animate-pulse"></span>
            实时数据同步中
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 策略转化漏斗 */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">全域转化漏斗</h3>
              <p className="text-xs text-zinc-500">追踪从曝光到最终成交的完整链路</p>
            </div>
            <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-zinc-700">fullscreen</span>
          </div>
          
          <div className="relative h-64 flex items-center justify-around">
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center shadow-sm border border-zinc-200">
                <span className="material-symbols-outlined text-zinc-600">visibility</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-zinc-500">总曝光</p>
                <p className="text-sm font-black text-zinc-900">1.2M</p>
              </div>
            </div>
            
            <div className="flex-1 h-[2px] bg-gradient-to-r from-zinc-200 to-[#5157a7]/40 mx-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-zinc-500 border border-zinc-100 rounded">24.5%</div>
            </div>
            
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-16 h-16 rounded-full bg-[#e0e0ff] flex items-center justify-center shadow-sm border border-[#5157a7]/20">
                <span className="material-symbols-outlined text-[#5157a7]">touch_app</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-zinc-500">互动/点击</p>
                <p className="text-sm font-black text-zinc-900">294K</p>
              </div>
            </div>
            
            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#5157a7]/40 to-[#5157a7] mx-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-[#5157a7] border border-[#5157a7]/20 rounded">8.2%</div>
            </div>
            
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center shadow-xl">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-zinc-500">最终转化</p>
                <p className="text-sm font-black text-zinc-900">24.1K</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-red-50 rounded-xl flex items-center justify-between border border-red-100">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span> 转化瓶颈预警
              </span>
              <span className="text-[11px] text-red-600">“互动”到“转化”环节流失率高于行业平均水平 15%。</span>
            </div>
            <button className="text-[11px] font-bold text-red-700 hover:underline">查看优化建议 -&gt;</button>
          </div>
        </section>

        {/* 模板资产管理 */}
        <section className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 flex flex-col justify-between border border-zinc-100 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-1">模板资产库</h3>
            <p className="text-xs text-zinc-500">管理已沉淀的爆款模板</p>
          </div>
          <div className="space-y-4 my-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e0e0ff] rounded-lg flex items-center justify-center text-[#5157a7]">
                  <span className="material-symbols-outlined">architecture</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800">春夏穿搭闺蜜种草</p>
                  <p className="text-[10px] text-zinc-500">已应用 124 次</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-emerald-600">高转化</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-200 rounded-lg flex items-center justify-center text-zinc-600">
                  <span className="material-symbols-outlined">architecture</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800">探店打卡引流</p>
                  <p className="text-[10px] text-zinc-500">已应用 42 次</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-amber-600">需优化</p>
              </div>
            </div>
          </div>
          <button className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-sm">add_circle</span> 创建新模板
          </button>
        </section>

        {/* 财务概览 */}
        <section className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">财务概览</h3>
            <p className="text-xs text-zinc-500">本月营收与支出</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-zinc-900 tracking-tighter">￥42,890.00</span>
              <span className="text-[10px] text-emerald-600 font-bold mb-2 bg-emerald-50 px-1.5 py-0.5 rounded">+12.4% vs 上月</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">累计收入</p>
                <p className="text-lg font-bold text-zinc-900">￥124.5K</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">AI 算力消耗</p>
                <p className="text-lg font-bold text-amber-600">￥3.2K</p>
              </div>
            </div>
          </div>
        </section>

        {/* 实时动态 */}
        <section className="col-span-12 lg:col-span-7 bg-zinc-900 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">系统实时动态</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">LIVE FEED</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-2 border-b border-white/10">
                <span className="text-[10px] font-mono text-zinc-500">14:22:01</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#e0e0ff]/20 text-[#e0e0ff] rounded border border-[#e0e0ff]/30">任务完成</span>
                <span className="text-xs font-medium text-zinc-300">极氪001 试驾体验文案生成完毕</span>
              </div>
              <div className="flex items-center gap-4 py-2 border-b border-white/10">
                <span className="text-[10px] font-mono text-zinc-500">14:21:44</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">线索预警</span>
                <span className="text-xs font-medium text-zinc-300">检测到高意向客户咨询，已通知导购</span>
              </div>
              <div className="flex items-center gap-4 py-2 border-b border-white/10">
                <span className="text-[10px] font-mono text-zinc-500">14:18:29</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">知识库更新</span>
                <span className="text-xs font-medium text-zinc-300">品牌调性手册.pdf 向量化完成</span>
              </div>
              <div className="flex items-center gap-4 py-2">
                <span className="text-[10px] font-mono text-zinc-500">14:15:02</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#e0e0ff]/20 text-[#e0e0ff] rounded border border-[#e0e0ff]/30">任务派发</span>
                <span className="text-xs font-medium text-zinc-300">春夏穿搭闺蜜种草模板已派发至 3 家门店</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
