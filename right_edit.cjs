const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

// I need to add the Right Pane dynamic content inside the `activeRightTab === 'issues'` block.
// First, find the block.
const rightTabStartStr = `            {activeRightTab === 'issues' && (
              <div className="space-y-6">`;
const rightTabStartIdx = code.indexOf(rightTabStartStr);

if (rightTabStartIdx === -1) {
  console.log("Could not find right tab start");
  process.exit(1);
}

// Just replace the entire content of 'issues' tab with a conditional render
const issuesContentStr = `                <div>
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-[13px] font-bold text-neutral-900">自动检查结果</h4>
                     <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">1项待核实</span>
                   </div>
                   
                   <div className="space-y-3">
                     {/* Fact Check Issue */}
                     <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                       <div className="flex items-start gap-2">
                         <AlertOctagon size={14} className="text-amber-600 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-[13px] font-bold text-amber-900 mb-1">事实依据不足</div>
                           <div className="text-[12px] text-amber-800 leading-relaxed mb-2">
                             文中“添加了专利级益生菌”缺乏具体资料支持，建议核实。
                           </div>
                           <button onClick={() => setActiveRightTab('local_edit')} className="text-[12px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                             <ArrowRightLeft size={12} /> 去修改
                           </button>
                         </div>
                       </div>
                     </div>
                     
                     {/* Banned Word Issue */}
                     <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                       <div className="flex items-start gap-2">
                         <ShieldAlert size={14} className="text-rose-600 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-[13px] font-bold text-rose-900 mb-1">潜在违规风险</div>
                           <div className="text-[12px] text-rose-800 leading-relaxed">
                             “七日换粮法”属于医疗化/绝对化用语风险，在当前平台限流概率高。
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Similarity Issue */}
                     <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                       <div className="flex items-start gap-2">
                         <Search size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                         <div className="w-full">
                           <div className="text-[13px] font-bold text-neutral-900 mb-1 flex items-center justify-between">
                             同质化检查
                             <span className="text-[11px] text-neutral-500 font-normal">有风险</span>
                           </div>
                           <div className="text-[12px] text-neutral-600 leading-relaxed mb-2">
                             与本项目另外2篇内容角度接近。
                           </div>
                           <button className="text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                             查看相似笔记
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>`;

const dynamicRightContent = `                {activeArea === 'title' ? (
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-primary-500" /> AI 标题建议</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-neutral-200 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors text-[13px] text-neutral-800">
                        换粮软便必看！新手养狗不踩坑指南
                      </div>
                      <div className="p-3 border border-neutral-200 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors text-[13px] text-neutral-800">
                        干货满满，带你了解科学“七日换粮法”
                      </div>
                      <div className="p-3 border border-neutral-200 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors text-[13px] text-neutral-800">
                        拒绝软便！这样换粮，幼犬肠胃更健康
                      </div>
                    </div>
                  </div>
                ) : activeArea === 'tags' ? (
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-primary-500" /> AI 话题建议</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 border border-primary-200 bg-primary-50 text-primary-700 rounded text-[12px] cursor-pointer hover:bg-primary-100">+ #科学喂养</span>
                      <span className="px-2 py-1 border border-primary-200 bg-primary-50 text-primary-700 rounded text-[12px] cursor-pointer hover:bg-primary-100">+ #幼犬肠胃</span>
                      <span className="px-2 py-1 border border-primary-200 bg-primary-50 text-primary-700 rounded text-[12px] cursor-pointer hover:bg-primary-100">+ #狗狗软便</span>
                    </div>
                    <div className="mt-4 text-[12px] text-neutral-500">
                      点击添加建议的话题，或在左侧手动输入。
                    </div>
                  </div>
                ) : activeArea === 'materials' ? (
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-primary-500" /> 配图素材建议</h4>
                    
                    <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl mb-4">
                      <div className="text-[13px] font-bold text-neutral-800 mb-2">匹配本地可用素材</div>
                      <div className="flex gap-2">
                         <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500">
                           <ImageIcon size={20} className="text-neutral-400" />
                         </div>
                         <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500">
                           <ImageIcon size={20} className="text-neutral-400" />
                         </div>
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[13px] font-bold transition-colors mb-2">
                      生成拍摄任务发送给店长
                    </button>
                    <button className="w-full py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl text-[12px] font-bold transition-colors">
                      转交素材匹配岗
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[13px] font-bold text-neutral-900">自动检查结果</h4>
                      <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">1项待核实</span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Fact Check Issue */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <AlertOctagon size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[13px] font-bold text-amber-900 mb-1">事实依据不足</div>
                            <div className="text-[12px] text-amber-800 leading-relaxed mb-2">
                              文中“添加了专利级益生菌”缺乏具体资料支持，建议核实。
                            </div>
                            <button onClick={() => setActiveRightTab('local_edit')} className="text-[12px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                              <ArrowRightLeft size={12} /> 去修改
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Banned Word Issue */}
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <ShieldAlert size={14} className="text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[13px] font-bold text-rose-900 mb-1">潜在违规风险</div>
                            <div className="text-[12px] text-rose-800 leading-relaxed">
                              “七日换粮法”属于医疗化/绝对化用语风险，在当前平台限流概率高。
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Similarity Issue */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <Search size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                          <div className="w-full">
                            <div className="text-[13px] font-bold text-neutral-900 mb-1 flex items-center justify-between">
                              同质化检查
                              <span className="text-[11px] text-neutral-500 font-normal">有风险</span>
                            </div>
                            <div className="text-[12px] text-neutral-600 leading-relaxed mb-2">
                              与本项目另外2篇内容角度接近。
                            </div>
                            <button className="text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                              查看相似笔记
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}`;

if (code.includes(issuesContentStr)) {
  code = code.replace(issuesContentStr, dynamicRightContent);
  fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
  console.log("Right pane modified successfully");
} else {
  console.log("Failed to find issuesContentStr");
}
