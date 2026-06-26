import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

const externalDrawerHtml = `
              {activeDrawer === "external" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-indigo-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        外部领取与分发
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        3 个任务适合外部账号分发
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-600">
                             <QrCode size={14} />
                           </div>
                           <h4 className="font-bold text-[14px] text-neutral-900">扫码即发布包</h4>
                         </div>
                         <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">未生成</span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between"><span className="text-neutral-500">适用对象</span><span className="text-neutral-800">门店客户、KOC</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">当前数量</span><span className="text-neutral-800 font-medium">10 份</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">领取限制</span><span className="text-neutral-800">每人限领1次</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">回传要求</span><span className="text-neutral-800">发布后回传链接免审</span></div>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">生成入口</button>
                         <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">查看规则</button>
                         <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">查看回传</button>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                             <ImageIcon size={14} />
                           </div>
                           <h4 className="font-bold text-[14px] text-neutral-900">真实体验领取</h4>
                         </div>
                         <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">已有2人领取</span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between"><span className="text-neutral-500">适用对象</span><span className="text-neutral-800">样品体验用户</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">当前数量</span><span className="text-neutral-800 font-medium">5 份</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">领取限制</span><span className="text-neutral-800">截至今日24点</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">回传要求</span><span className="text-neutral-800">需传素材，需审核</span></div>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">生成入口</button>
                         <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">查看规则</button>
                         <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">查看回传</button>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                             <LinkIcon size={14} />
                           </div>
                           <h4 className="font-bold text-[14px] text-neutral-900">单篇发布链接</h4>
                         </div>
                         <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">已生成</span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between"><span className="text-neutral-500">适用对象</span><span className="text-neutral-800">内部合作达人</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">当前数量</span><span className="text-neutral-800 font-medium">1 份</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">领取限制</span><span className="text-neutral-800">特定账号</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">回传要求</span><span className="text-neutral-800">直发免审</span></div>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">复制指定账号发布链接</button>
                         <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">查看规则</button>
                      </div>
                    </div>

                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white flex justify-center">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "interaction" },
                          }),
                        );
                      }}
                      className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 underline underline-offset-2"
                    >
                      进入协同任务模块做深度处理 <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              )}
`;

content = content.replace(/\{activeDrawer === "external" && \([\s\S]*?\n\s*\)\}/, externalDrawerHtml.trim());

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
