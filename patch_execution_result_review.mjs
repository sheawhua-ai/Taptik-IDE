import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

const reviewDrawerHtml = `
              {activeDrawer === "review" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-emerald-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        内容包快速审核
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        当前：3 个待审核 | <span className="text-emerald-600">已沉淀到「宠物食品自然流笔记」能力中</span>
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
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <div className="flex-shrink-0 px-3 py-1.5 bg-neutral-900 text-white text-[12px] rounded-lg">
                        #1 幼犬挑食
                      </div>
                      <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] rounded-lg">
                        #2 肠胃敏感
                      </div>
                      <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] rounded-lg">
                        #3 换粮误区
                      </div>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm relative group">
                      <div className="flex flex-wrap gap-2 mb-3">
                         <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded">图文</span>
                         <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded">素人口吻</span>
                         <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] rounded">缺实拍图</span>
                         <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] rounded">建议外部体验领取</span>
                      </div>
                      <h4 className="font-bold text-[14px] text-neutral-900 mb-2">
                        #1 幼犬挑食其实是你的锅
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded">
                        <div><span className="font-medium">内容形态：</span>单图文笔记</div>
                        <div><span className="font-medium">素材来源：</span>需外部真实体验拍摄</div>
                        <div><span className="font-medium">执行路径：</span>外部领取</div>
                        <div><span className="font-medium">当前状态：</span>待内容审核确认</div>
                      </div>
                      
                      <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-[12px] text-neutral-700 leading-relaxed mb-4">
                        "很多新手铲屎官遇到狗子不吃饭，第一反应就是饿它一顿！其实幼犬挑食很可能是换粮方式不对..."
                      </div>

                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 mb-4 relative">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} className="text-indigo-500" />
                          <span className="text-[12px] font-bold text-indigo-900">
                            AI 正在协同修改
                          </span>
                        </div>
                        <div className="bg-white p-2 border border-indigo-100 rounded text-[11px] text-neutral-700 mb-2 line-through opacity-70">
                          原版：很多新手铲屎官遇到狗子不吃饭...
                        </div>
                        <div className="bg-white p-2 border border-indigo-200 rounded text-[11px] text-indigo-900 font-medium mb-3 shadow-sm">
                          修改后：别再饿狗子了！幼犬挑食 90% 是你换粮的锅...
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-indigo-100">
                           <input type="text" placeholder="不满意？输入修改要求..." className="flex-1 text-[11px] bg-white border border-indigo-100 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300" />
                           <button className="px-3 py-1.5 bg-indigo-500 text-white text-[11px] rounded hover:bg-indigo-600">提交修改</button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                        <button className="flex-1 min-w-[70px] py-2 bg-emerald-500 text-white text-[11px] font-medium rounded-lg hover:bg-emerald-600">采用</button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg hover:bg-neutral-50">继续改</button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg hover:bg-neutral-50">还是太 AI</button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg hover:bg-neutral-50">保留原版</button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-red-200 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-50">批注退回</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "content" },
                          }),
                        );
                      }}
                      className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      进入账号与发布模块做深度处理 <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}
`;

content = content.replace(/\{activeDrawer === "review" && \([\s\S]*?\n\s*\)\}/, reviewDrawerHtml.trim());

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
