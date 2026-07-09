const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const targetHeader = `      <div className="px-8 py-6 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
              <Zap size={24} className="text-primary-500" />
              执行中心
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1">系统已按影响程度整理好今天要处理的事项，电脑在线时可继续推进。</p>
          </div>
          <button 
            onClick={() => setQueuePaused(!queuePaused)}
            className={\`px-6 py-3 rounded-xl text-[14px] font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 \${queuePaused ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-neutral-900 text-white hover:bg-neutral-800'}\`}
          >
            {queuePaused ? (
              <><PlayCircle size={18} /> 恢复队列</>
            ) : (
              <><Zap size={18} /> 继续处理下一批</>
            )}
          </button>
        </div>

        {/* 状态卡 */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4">
             <div className="text-[12px] text-neutral-500 font-bold mb-1">今日待处理</div>
             <div className="text-[24px] font-bold text-neutral-900">9</div>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
             <div className="text-[12px] text-primary-700 font-bold mb-1">可直接处理</div>
             <div className="text-[24px] font-bold text-primary-700">4</div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
             <div className="text-[12px] text-orange-700 font-bold mb-1">需要确认</div>
             <div className="text-[24px] font-bold text-orange-700">2</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
             <div className="text-[12px] text-blue-700 font-bold mb-1">等待外部</div>
             <div className="text-[24px] font-bold text-blue-700">2</div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
             <div className="text-[12px] text-rose-700 font-bold mb-1">网络/本地暂停</div>
             <div className="text-[24px] font-bold text-rose-700">1</div>
          </div>
        </div>
      </div>`;

const replaceHeader = `      <div className="px-8 py-4 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
              <Zap size={20} className="text-primary-500" />
              执行中心看板
            </h2>
            <p className="text-[12px] text-neutral-500 mt-1">系统已按影响程度整理好今天要处理的事项，电脑在线时可继续推进。</p>
          </div>
          <button 
            onClick={() => {}}
            className={\`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm border border-neutral-200 active:scale-95 flex items-center gap-2 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900\`}
          >
            <RefreshCw size={16} /> 扫描新事项
          </button>
        </div>

        {/* 状态卡 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-neutral-300 transition-colors" onClick={() => setActiveTab("全部")}>
             <div className="text-[11px] text-neutral-500 font-bold">今日待处理</div>
             <div className="text-[18px] font-bold text-neutral-900">9</div>
          </div>
          <div className="flex-1 bg-primary-50 border border-primary-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-primary-300 transition-colors" onClick={() => setActiveTab("发布前")}>
             <div className="text-[11px] text-primary-700 font-bold">可直接处理</div>
             <div className="text-[18px] font-bold text-primary-700">4</div>
          </div>
          <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-orange-300 transition-colors" onClick={() => setActiveTab("发布中")}>
             <div className="text-[11px] text-orange-700 font-bold">需要确认</div>
             <div className="text-[18px] font-bold text-orange-700">2</div>
          </div>
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setActiveTab("等待外部")}>
             <div className="text-[11px] text-blue-700 font-bold">等待外部</div>
             <div className="text-[18px] font-bold text-blue-700">2</div>
          </div>
          <div className="flex-1 bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-rose-300 transition-colors" onClick={() => setActiveTab("发布后")}>
             <div className="text-[11px] text-rose-700 font-bold">网络/本地暂停</div>
             <div className="text-[18px] font-bold text-rose-700">1</div>
          </div>
        </div>
      </div>`;

if(code.includes(targetHeader)) {
    code = code.replace(targetHeader, replaceHeader);
    fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
    console.log("Replaced header layout");
} else {
    console.log("targetHeader not found in ExecutionResult.tsx");
}
