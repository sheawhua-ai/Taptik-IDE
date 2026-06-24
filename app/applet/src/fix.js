const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentProduction.tsx', 'utf-8');
const replacement = `{viewMode === 'queue' ? (<div className="space-y-6">
              {MOCK_QUEUE.length === 0 ? <div className="text-center py-20 text-neutral-400">请先在项目与内容中完成笔记生成</div> : MOCK_QUEUE.map(task => (
                <div key={task.id} className="bg-white border border-neutral-100 rounded-[20px] p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:border-primary-200 transition-all">
                  <div className="flex items-center gap-5 flex-1 w-0">
                    <img src={task.image} alt={task.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex flex-col gap-1.5 overflow-hidden w-full">
                      <div className="flex items-center gap-2">
                        <span className={\`text-[10px] px-1.5 py-0.5 rounded \${task.status === '已完成发文' ? 'bg-success-50 text-success-600' : 'bg-primary-50 text-primary-600'}\`}>{task.status}</span>
                        <h4 className="text-[15px] font-semibold text-neutral-900 truncate">{task.title}</h4>
                      </div>
                      <div className="flex gap-4 text-[12px] text-neutral-400">
                        <span className="flex items-center gap-1"><User size={12}/> 分发给: {task.assignTo}</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> 取单排期: {task.expectedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-8">
                    {task.status === '等待发文' ? (
                      <>
                        <button onClick={() => setShowQrCode(task.id)} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-xl text-[12px] font-medium flex items-center gap-1.5 transition-colors">
                          <Smartphone size={14} /> 扫码取原件发文
                        </button>
                        <button className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl text-[12px] font-medium flex items-center gap-1.5 transition-colors">
                          <CheckCircle2 size={14} /> 标记为已发布
                        </button>
                      </>
                    ) : (
                      <span className="px-4 py-2 text-success-500 font-medium text-[13px] flex items-center gap-1.5">
                        <CheckCircle2 size={16} /> 已归档复盘
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>) : (<div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100"><h3 className="text-[15px] font-semibold text-neutral-900 mb-4">本周排期日历</h3><div className="grid grid-cols-7 gap-4"><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周一</div><div className="space-y-2 mt-2"><div className="bg-primary-50 p-2 rounded-xl flex flex-col gap-1 cursor-pointer hover:bg-primary-100 border border-primary-100 text-left"><span className="text-[10px] text-primary-600 font-medium truncate">防晒实测第1篇</span><span className="text-[9px] text-primary-400">@奈雪</span></div></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周二</div><div className="space-y-2 mt-2"><div className="bg-amber-50 p-2 rounded-xl flex flex-col gap-1 cursor-pointer hover:bg-amber-100 border border-amber-100 text-left"><span className="text-[10px] text-amber-600 font-medium truncate">带妆防晒组合</span><span className="text-[9px] text-amber-400">@周末喝点啥</span></div></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周三</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周四</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周五</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周六</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周日</div><div className="space-y-2 mt-2"></div></div></div></div>)}`;
const match = /{MOCK_QUEUE\.map\(task => \([\s\S]*?\}\)\s*<\/div>\s*\)\}/;
code = code.replace(match, replacement);
fs.writeFileSync('src/components/rings/ContentProduction.tsx', code);
