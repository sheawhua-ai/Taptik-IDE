import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

const cardsHtml = `
      {/* 4 个处理队列卡 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4">
        {/* 卡片 1 */}
        <div className="border border-emerald-200 rounded-2xl p-5 hover:border-emerald-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => setActiveDrawer("review")}>
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">1</span>内容确认</h4>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">待处理 3</span>
          </div>
          
          <div className="space-y-2 mb-4 mt-2 flex-1">
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">前置条件：</span>文案生成完毕</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">当前状态：</span>3个已进人工快速检查队列</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-emerald-700">处理后流向：</span>通过后进入素材补齐或直接派发</div>
             </div>
          </div>
          
          <button className="w-full py-2 bg-neutral-50 group-hover:bg-emerald-50 text-emerald-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-emerald-200">开始确认</button>
        </div>

        {/* 卡片 2 */}
        <div className="border border-neutral-200 rounded-2xl p-5 hover:border-amber-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => setActiveDrawer("material")}>
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-amber-400 transition-colors"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">2</span>素材补齐</h4>
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">待处理 4</span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">前置条件：</span>确认后的图文/视频脚本</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">当前状态：</span>缺封面、缺喂食片段</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-amber-700">处理后流向：</span>装填完毕进入待发布池</div>
             </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-amber-50 text-amber-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-amber-200">自动装配素材</button>
        </div>

        {/* 卡片 3 */}
        <div className="border border-neutral-200 rounded-2xl p-5 hover:border-blue-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => setActiveDrawer("internal")}>
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-blue-400 transition-colors"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">3</span>任务派发</h4>
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">待派发 2</span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">前置条件：</span>无匹配素材，转实拍需求</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">当前状态：</span>已锁定责任人及工期</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-blue-700">处理后流向：</span>提交后进入素材验收池</div>
             </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-blue-50 text-blue-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-blue-200">一键派发任务</button>
        </div>

        {/* 卡片 4 */}
        <div className="border border-neutral-200 rounded-2xl p-5 hover:border-indigo-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => setActiveDrawer("external")}>
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-indigo-400 transition-colors"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">4</span>外部入口</h4>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">待生成 3</span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">前置条件：</span>确认面向外部账号分发的内容</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-neutral-700">当前状态：</span>包含纯分发、体验等多种模式</div>
             </div>
             <div className="text-[12px] text-neutral-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0"></div>
                <div><span className="font-medium text-indigo-700">处理后流向：</span>外部领取后按规则回传或发布</div>
             </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-indigo-50 text-indigo-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-indigo-200">生成接单入口</button>
        </div>
      </div>
`;

content = content.replace(/\{\/\* 4 个执行路径卡 \*\/\}[\s\S]*?\{\/\* 主行动区 \*\/\}/, cardsHtml + '\n      {/* 主行动区 */}');

const actionAreaHtml = `
      {/* 主行动区 */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-t border-neutral-100">
        <button
          onClick={() => setActiveDrawer("review")}
          className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2 mb-2"
        >
          开始处理可处理队列 <ArrowRight size={16} />
        </button>
        <div className="text-[12px] text-neutral-500 mb-5 flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100">
          <span className="text-neutral-400">将按依赖顺序处理：</span>
          <span className="text-neutral-700 font-medium">内容确认</span>
          <ArrowRight size={12} className="text-neutral-400" />
          <span className="text-neutral-700 font-medium">素材补齐</span>
          <ArrowRight size={12} className="text-neutral-400" />
          <span className="text-neutral-700 font-medium">任务派发</span>
          <ArrowRight size={12} className="text-neutral-400" />
          <span className="text-neutral-700 font-medium">外部入口</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("nav-to-tab", { detail: { tab: "content" } }),
              )
            }
            className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            查看全部内容包
          </button>
          <button
            onClick={() => setActiveDrawer("internal")}
            className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            管理协同任务
          </button>
        </div>
      </div>
`;

content = content.replace(/\{\/\* 主行动区 \*\/\}[\s\S]*?\{\/\* 次级提示 \*\/\}/, actionAreaHtml + '\n      {/* 次级提示 */}');

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
