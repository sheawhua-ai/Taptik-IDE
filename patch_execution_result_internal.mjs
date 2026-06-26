import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

const internalDrawerHtml = `
              {activeDrawer === "internal" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-blue-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        内部任务派发
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        2 个协同任务待内部员工处理
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
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[14px] text-neutral-900">
                          幼犬到家实拍补充
                        </h4>
                        <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">高优</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        未发送
                      </div>
                      
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">负责人</span>
                          <span className="font-medium text-neutral-900 flex items-center gap-1">
                            <Users size={12} /> 李店长
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">通知渠道</span>
                          <span className="text-neutral-700">企微 / 飞书 <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded ml-1">身份已绑定</span></span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">截止时间</span>
                          <span className="text-neutral-700">今日 18:00</span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-2.5 rounded text-[11px] text-neutral-600 mb-3 border border-neutral-100">
                        <strong>AI 任务说明：</strong> 需要 3
                        段狗狗吃粮的真实短视频，背景要明亮，尽量体现狗子开心。
                      </div>
                      <div className="text-[10px] text-neutral-500 space-y-1 mb-4">
                         <div className="flex items-start gap-1">
                            <div className="mt-0.5">•</div>
                            <div><span className="text-neutral-700">处理后流向：</span>提交后进入素材验收池</div>
                         </div>
                         <div className="flex items-start gap-1">
                            <div className="mt-0.5">•</div>
                            <div><span className="text-neutral-700">不合格时：</span>重拍 / AI 改写拍摄要求 / 素材库替代</div>
                         </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700">
                          发送通知，下一条
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          改派
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看提交规则
                        </button>
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

content = content.replace(/\{activeDrawer === "internal" && \([\s\S]*?\n\s*\)\}/, internalDrawerHtml.trim());

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
