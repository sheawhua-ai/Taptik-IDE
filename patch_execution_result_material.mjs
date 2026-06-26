import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

const materialDrawerHtml = `
              {activeDrawer === "material" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-amber-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        内容需求素材匹配
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        当前内容包：图文｜缺封面图、喂食片段
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50 flex flex-col">
                    {/* Item 1 */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-[14px] text-neutral-900 mb-1">
                        幼犬软便必看指南
                      </h4>
                      <div className="flex gap-2 mb-3">
                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          缺封面图
                        </span>
                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          缺场景图
                        </span>
                        <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          缺对比图
                        </span>
                        <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          缺视频片段
                        </span>
                      </div>
                      
                      <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 mb-3">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-700">
                             <ImageIcon size={14} className="text-primary-500" /> AI 推荐素材
                           </div>
                           <span className="text-[10px] text-neutral-400">来源：历史回传库</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          <div className="w-24 shrink-0 flex flex-col gap-1">
                             <div className="w-24 h-24 bg-neutral-200 rounded object-cover flex items-center justify-center text-[10px] text-neutral-400 relative">
                               封面_01.jpg
                               <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] px-1 rounded shadow">85%匹配</div>
                             </div>
                             <div className="flex flex-wrap gap-1">
                               <span className="text-[8px] px-1 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded">适合封面</span>
                               <span className="text-[8px] px-1 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded">重复度低</span>
                             </div>
                          </div>
                          
                          <div className="w-24 shrink-0 flex flex-col gap-1">
                             <div className="w-24 h-24 bg-neutral-200 rounded object-cover flex items-center justify-center text-[10px] text-neutral-400 relative">
                               场景_03.mp4
                               <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded shadow">70%匹配</div>
                             </div>
                             <div className="flex flex-wrap gap-1">
                               <span className="text-[8px] px-1 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 rounded">适合正文</span>
                               <span className="text-[8px] px-1 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded">真人感弱</span>
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">
                          采用匹配，下一篇
                        </button>
                        <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          换一组
                        </button>
                      </div>
                      <button className="w-full mt-2 py-1.5 text-[12px] text-neutral-500 hover:text-neutral-800">
                        标记缺素材转拍摄任务
                      </button>
                    </div>

                    <div className="mt-auto text-center text-[11px] text-amber-600 bg-amber-50 py-2 rounded-lg border border-amber-100">
                      本项目素材库覆盖度 70%，仍缺幼犬真实喂食场景
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white flex justify-center">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "matrix" },
                          }),
                        );
                      }}
                      className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 underline underline-offset-2"
                    >
                      进入项目与内容模块做深度处理 <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              )}
`;

content = content.replace(/\{activeDrawer === "material" && \([\s\S]*?\n\s*\)\}/, materialDrawerHtml.trim());

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
