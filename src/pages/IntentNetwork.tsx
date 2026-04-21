import React from 'react';

export default function IntentNetwork() {
  return (
    <div className="p-6 grid grid-cols-12 gap-6 overflow-hidden h-full max-w-[1600px] mx-auto">
      {/* 左侧：预警 */}
      <section className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-hidden h-full">
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">warning</span>
              高意向线索预警
            </h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded-full">12 条待处理</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1">
            <div className="p-4 bg-white border border-red-100 rounded-xl shadow-sm group hover:border-red-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded">高意向流失风险</span>
                <span className="text-[10px] text-zinc-400 italic">2 分钟前</span>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed mb-3">
                用户 @DesignMaster 咨询“价格与企业版区别”，AI 识别为核心购买意图，导购未能在 5 分钟内响应。
              </p>
              <button className="w-full text-[11px] font-bold py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all">人工快速截流</button>
            </div>
            
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm group hover:border-zinc-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded">竞品拦截</span>
                <span className="text-[10px] text-zinc-400 italic">15 分钟前</span>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed mb-3">
                检测到 5 个关键词提及竞品 A。互动内容集中在“性能优劣”对比。建议注入案例研究。
              </p>
              <button className="w-full text-[11px] font-bold py-1.5 bg-zinc-50 text-zinc-600 border border-zinc-200 rounded hover:bg-zinc-100 transition-all">派发跟进任务</button>
            </div>
          </div>
        </div>
      </section>

      {/* 中间：线索挖掘与分发规则 */}
      <section className="col-span-12 lg:col-span-5 flex flex-col gap-4 overflow-hidden h-full">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5157a7]">filter_alt</span>
            高意向线索挖掘
          </h2>
          <div className="flex bg-zinc-100 p-1 rounded-lg gap-1">
            <button className="px-3 py-1 bg-white text-[11px] font-bold rounded-md shadow-sm text-[#5157a7]">实时处理</button>
            <button className="px-3 py-1 text-[11px] text-zinc-500 font-medium">历史回溯</button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[12px] font-bold text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-[#5157a7]"></span>
                流量池: 小红书全域
              </div>
            </div>
            <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-zinc-700">settings</span>
          </div>
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#5157a7]/50 via-[#5157a7]/20 to-transparent"></div>
              <div className="flex gap-4">
                <div className="z-10 w-8 h-8 rounded-full bg-[#e0e0ff] flex items-center justify-center text-[#5157a7] ring-4 ring-white">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[13px] font-bold text-zinc-800">客户需求分类: #价格咨询_企业级</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-zinc-50 p-3 rounded-xl border-l-4 border-[#5157a7]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-zinc-800">JD Architecture</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">“如何开通多端同步功能？目前预算 5k 左右...”</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#5157a7]">bolt</span>
                      <span className="text-[10px] text-zinc-500">转化评分: <span className="font-bold text-zinc-800">8.4</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-4 shadow-lg shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e0e0ff]">route</span>
              线索自动分发规则
            </h2>
            <button className="material-symbols-outlined text-zinc-400 hover:text-white">add_circle</button>
          </div>
          <div className="p-3 bg-zinc-800 rounded-xl border-l-2 border-[#5157a7]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-[#e0e0ff] tracking-tight">优先级: 高</span>
            </div>
            <h4 className="text-[12px] font-bold text-white">核心大客户拦截</h4>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="material-symbols-outlined text-[12px]">filter_list</span>
                关键词: [价格, 企业版, 合同]
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="material-symbols-outlined text-[12px]">send</span>
                分发给: 战略销售组 A
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 右侧：AI 自动回复监控 */}
      <section className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">policy</span>
            AI 自动回复监控
          </h2>
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full border border-orange-200">实时拦截中</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="p-4 border border-orange-200 bg-orange-50/50 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-zinc-900">客户：这款包包有黑色现货吗？</span>
              <span className="text-[10px] text-orange-600 font-bold border border-orange-200 px-2 py-0.5 rounded bg-white">偏离商业意图</span>
            </div>
            <div className="text-xs text-zinc-600 mb-3 bg-white p-3 rounded-xl border border-zinc-100">
              <span className="font-bold text-zinc-800">AI 回复：</span>目前黑色没有现货了哦，建议您看看其他颜色。
            </div>
            <div className="text-[11px] text-orange-700 flex items-start gap-1.5 bg-orange-100/50 p-3 rounded-xl">
              <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">warning</span>
              <p><strong>诊断：</strong>未引导客户留资。应调整为“黑色目前需预定，您可以留个联系方式，到货第一时间通知您”。</p>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md shadow-orange-500/20 active:scale-95 transition-transform">人工接管</button>
              <button className="flex-1 py-2 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-50 active:scale-95 transition-transform">标记为负面案例</button>
            </div>
          </div>

          <div className="p-4 border border-zinc-100 bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-zinc-900">客户：周末去店里人多吗？</span>
              <span className="text-[10px] text-green-600 font-bold border border-green-200 px-2 py-0.5 rounded bg-green-50">意图符合</span>
            </div>
            <div className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <span className="font-bold text-zinc-800">AI 回复：</span>周末客流较多，建议您提前预约专属顾问，我们可以为您安排免排队通道哦~ 需要帮您预约吗？
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
