import React from 'react';

export default function ContentPipeline() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-tight text-zinc-900 mb-2">内容生产线</h1>
          <p className="text-zinc-500 max-w-2xl text-sm">自动化内容生成与分发流水线，监控从线索到发布的完整生命周期。</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-xl text-sm hover:bg-zinc-50 transition-colors shadow-sm">
            暂停队列
          </button>
          <button className="px-4 py-2 bg-zinc-900 text-white font-bold rounded-xl text-sm hover:bg-zinc-800 transition-colors shadow-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            新建流水线
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* 左侧：任务执行流 */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
          
          {/* 状态概览 */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
            <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-zinc-500">待生成</span>
              </div>
              <p className="text-2xl font-black text-zinc-900">1,204</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-zinc-500">生成中</span>
              </div>
              <p className="text-2xl font-black text-zinc-900">42</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-zinc-500">待发布</span>
              </div>
              <p className="text-2xl font-black text-zinc-900">856</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-xs font-bold text-zinc-500">异常</span>
              </div>
              <p className="text-2xl font-black text-zinc-900">12</p>
            </div>
          </div>

          {/* 实时流水线 */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-zinc-400">account_tree</span>
                实时流水线
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-md cursor-pointer hover:bg-zinc-200">全部</span>
                <span className="px-2 py-1 bg-[#e0e0ff] text-[#5157a7] text-[10px] font-bold rounded-md cursor-pointer">生成中</span>
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-md cursor-pointer hover:bg-zinc-200">异常</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {/* Task Item 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-[#e0e0ff] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#5157a7] text-[20px]">smart_toy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-zinc-900 truncate">极氪001 试驾体验文案生成</h4>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 shrink-0">生成中 45%</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3 truncate">基于模板 [科技感种草] • 挂载商家 [极氪智慧出行]</p>
                  
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full relative" style={{ width: '45%' }}>
                      <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Item 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-zinc-900 truncate">五一促销活动海报批量生成</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">待发布</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3 truncate">生成 12 张图片 • 挂载商家 [JD Architecture]</p>
                  
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaset48DydtP7YJ7F6WChuXTpWoTuqwZpibjzK7OZm5nknO2R78MyaIioFeStDuwlI2UBLA_P0jewzi_eBYRjqIWblGcDfrWOtfrwOCwDMudEE3NBD_Z04Gwc8F2ow1YdAAgikBFIuYHw6TpmHlz5387QNc7diwhQcZABnC_QyoeE7zbFZnSj_eaadkoPWjMSU9bNVQ4NKugcCLpOB9zEUxiIFaAlQkTqNb4GLMer7XenUZ6gSQP0xG2Wjv6qcaaplONCu4WCk7wc" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL2UfC3wPk-Z5S1XSwAeWKB2f1DMm9jOZN3vyC824NT-vudeVfrMVx700Ao0eSwsOAbkGghIrDc1lRz4hc9kEjhqSoIb9Xe67LOK6CWe8kE1nqQNpJjlt939SxD1DxB45vkq5R9Uu2OoJZlZgJbtJ6tDojFNK9c2jH71_3AfaC6vSQj6x4FGQ-bUNGFfg9gVO08rX4glquC2rhjZpLcAE1D_WKzDmJQjkRzz8I8NvbLdmUfL39Yg5QFsvWpz-9wwJoSsmfsS7ryJo" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-200 text-xs font-bold text-zinc-400">
                      +10
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Item 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30 hover:border-red-200 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-zinc-900 truncate">竞品分析报告生成</h4>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 shrink-0">API 异常</span>
                  </div>
                  <p className="text-xs text-red-500 mb-2 truncate">Error: Rate limit exceeded for model gemini-1.5-pro</p>
                  <button className="text-[11px] font-bold text-zinc-600 bg-white border border-zinc-200 px-3 py-1 rounded hover:bg-zinc-50 transition-colors">重试任务</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：发布日历与统计 */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
          
          {/* 发布日历 */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-zinc-400">calendar_month</span>
                发布日历
              </h3>
              <span className="text-xs font-bold text-[#5157a7]">今天</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-[10px] font-bold text-zinc-400 py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* 简化版日历占位 */}
              {Array.from({length: 35}).map((_, i) => {
                const isToday = i === 18;
                const hasTask = [12, 15, 18, 22, 25].includes(i);
                return (
                  <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium cursor-pointer transition-colors
                    ${isToday ? 'bg-[#5157a7] text-white shadow-md shadow-[#5157a7]/20' : 'text-zinc-600 hover:bg-zinc-100'}
                  `}>
                    {i % 30 + 1}
                    {hasTask && !isToday && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"></span>}
                    {hasTask && isToday && <span className="w-1 h-1 rounded-full bg-white mt-0.5"></span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 平台分布 */}
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 shrink-0">
              <span className="material-symbols-outlined text-zinc-400">pie_chart</span>
              分发平台占比
            </h3>
            
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-medium">小红书</span>
                    <span className="text-white font-bold">65%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-medium">抖音</span>
                    <span className="text-white font-bold">20%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-100 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-medium">视频号</span>
                    <span className="text-white font-bold">15%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-[#e0e0ff]/10 rounded-xl border border-[#5157a7]/20 mt-auto shrink-0">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#5157a7]">lightbulb</span>
                  <div>
                    <p className="text-xs text-zinc-300 leading-relaxed">建议增加 <span className="text-white font-bold">视频号</span> 的内容分发比例，近期该渠道转化率提升了 4.2%。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
