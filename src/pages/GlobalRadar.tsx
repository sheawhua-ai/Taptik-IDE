import React from 'react';

export default function GlobalRadar() {
  return (
    <div className="p-8 min-h-screen">
      <header className="mb-10">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-on-surface mb-2">全局监控</h1>
        <p className="text-on-surface-variant max-w-2xl">TapTik 全局监控中心。高频业务逻辑监控与异常熔断系统，实时解析跨维度算力消耗。</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* 异常熔断警报卡片 */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <span className="material-symbols-outlined text-tertiary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded uppercase tracking-wider">High Risk</span>
              <span className="text-on-surface-variant text-xs font-medium">异常熔断警报</span>
            </div>
            <h3 className="text-2xl font-bold mb-6">超时任务阻断中</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm border-l-4 border-tertiary-container">
                <div>
                  <p className="text-sm font-bold">Node-042: API Hook Failure</p>
                  <p className="text-xs text-on-surface-variant">延时 &gt; 15000ms • 自动熔断激活</p>
                </div>
                <button className="px-4 py-1.5 bg-zinc-950 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors">手动恢复</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold opacity-60">Node-019: Queue Overflow</p>
                  <p className="text-xs text-on-surface-variant opacity-60">3200 req/s • 负载均衡预警</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant opacity-40">more_horiz</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-tertiary-container/5 rounded-full blur-3xl group-hover:bg-tertiary-container/10 transition-colors duration-500"></div>
        </div>

        {/* 算力大盘 */}
        <div className="col-span-12 lg:col-span-5 bg-zinc-950 text-white rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-zinc-400 text-xs font-medium mb-1">算力大盘</p>
                <h3 className="text-xl font-bold tracking-tight">AI 算力消耗速率</h3>
              </div>
              <span className="material-symbols-outlined text-zinc-500">memory</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">12.4</span>
              <span className="text-zinc-400 text-lg font-medium tracking-tight">M / min</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+14.2% vs prev hour</span>
            </div>
          </div>
          <div className="mt-8 flex gap-1 h-12 items-end">
            <div className="flex-1 bg-zinc-800 h-[20%] rounded-sm"></div>
            <div className="flex-1 bg-zinc-800 h-[40%] rounded-sm"></div>
            <div className="flex-1 bg-zinc-800 h-[35%] rounded-sm"></div>
            <div className="flex-1 bg-zinc-800 h-[60%] rounded-sm"></div>
            <div className="flex-1 bg-zinc-800 h-[55%] rounded-sm"></div>
            <div className="flex-1 bg-zinc-800 h-[80%] rounded-sm"></div>
            <div className="flex-1 bg-[#5157a7] h-[95%] rounded-sm"></div>
            <div className="flex-1 bg-[#444a99] h-[85%] rounded-sm"></div>
            <div className="flex-1 bg-zinc-800 h-[70%] rounded-sm"></div>
          </div>
        </div>

        {/* 全盘线索水位监控 */}
        <div className="col-span-12 md:col-span-6 bg-surface-container-low rounded-[2rem] p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-container-highest rounded-lg">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight">全盘线索水位</h3>
            </div>
            <span className="text-xs font-bold text-on-surface-variant">实时同步</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
            <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-[#5157a7]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="110" strokeWidth="8"></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-on-surface">142</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">待处理线索</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">数据管道压力: <span className="text-on-surface font-bold">78%</span></p>
          </div>
        </div>

        {/* 实时监控小插件 */}
        <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm ring-1 ring-black/[0.03] flex flex-col justify-between">
            <span className="material-symbols-outlined text-zinc-400">cloud_done</span>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">系统可用性</p>
              <p className="text-xl font-black">99.98%</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm ring-1 ring-black/[0.03] flex flex-col justify-between">
            <span className="material-symbols-outlined text-zinc-400">timer</span>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">平均响应</p>
              <p className="text-xl font-black">42ms</p>
            </div>
          </div>
          <div className="col-span-2 bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm ring-1 ring-black/[0.03] relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">爆款拆解任务状态</p>
                <p className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  52 个并发实例运行中
                </p>
              </div>
              <button className="material-symbols-outlined text-zinc-400 group-hover:text-zinc-950 transition-colors">arrow_forward_ios</button>
            </div>
          </div>
        </div>

        {/* 底部数据日志 */}
        <div className="col-span-12 bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">实时事件日志</h3>
            <div className="flex gap-4">
              <span className="text-xs font-bold cursor-pointer text-[#5157a7] border-b border-[#5157a7]">全部</span>
              <span className="text-xs font-bold cursor-pointer text-zinc-400 hover:text-zinc-600">错误</span>
              <span className="text-xs font-bold cursor-pointer text-zinc-400 hover:text-zinc-600">警报</span>
            </div>
          </div>
          <div className="space-y-0">
            <div className="grid grid-cols-12 py-4 border-b border-zinc-50 hover:bg-zinc-50/50 px-4 -mx-4 rounded-lg transition-colors cursor-pointer">
              <div className="col-span-2 text-xs font-medium text-on-surface-variant">14:02:41</div>
              <div className="col-span-2"><span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold">INFO</span></div>
              <div className="col-span-6 text-sm font-medium">全局拓扑网络自动更新完成 - [V2.4.1]</div>
              <div className="col-span-2 text-right"><span className="material-symbols-outlined text-zinc-300">link</span></div>
            </div>
            <div className="grid grid-cols-12 py-4 border-b border-zinc-50 hover:bg-zinc-50/50 px-4 -mx-4 rounded-lg transition-colors cursor-pointer">
              <div className="col-span-2 text-xs font-medium text-on-surface-variant">13:58:12</div>
              <div className="col-span-2"><span className="px-2 py-0.5 bg-tertiary-container/20 text-tertiary rounded text-[10px] font-bold">WARN</span></div>
              <div className="col-span-6 text-sm font-medium">算力节点 [SH-01] 达到预设阈值 85%</div>
              <div className="col-span-2 text-right"><span className="material-symbols-outlined text-zinc-300">link</span></div>
            </div>
            <div className="grid grid-cols-12 py-4 hover:bg-zinc-50/50 px-4 -mx-4 rounded-lg transition-colors cursor-pointer">
              <div className="col-span-2 text-xs font-medium text-on-surface-variant">13:55:04</div>
              <div className="col-span-2"><span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold">INFO</span></div>
              <div className="col-span-6 text-sm font-medium">新线索接入: [TikTok-Ad-Feed-Stream] +142 items</div>
              <div className="col-span-2 text-right"><span className="material-symbols-outlined text-zinc-300">link</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
