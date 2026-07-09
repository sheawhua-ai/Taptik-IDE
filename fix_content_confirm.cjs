const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const tState = `  const [editTopics, setEditTopics] = useState(["#幼犬换粮", "#新手养狗", "#宠物健康"]);
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);`;
const rState = `  const [editTopics, setEditTopics] = useState(["#幼犬换粮", "#新手养狗", "#宠物健康"]);
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState(0);
  const [showTitleAiOptions, setShowTitleAiOptions] = useState(false);
  const [showBodyAiOptions, setShowBodyAiOptions] = useState(false);
  const [selectedText, setSelectedText] = useState("");`;
if(code.includes(tState)) {
    code = code.replace(tState, rState);
} else {
    console.log("tState not found");
}

const tBlock = `                {selectedTask.type === '内容确认' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-2">为什么要处理</h4>
                          <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-[13px] text-neutral-700 leading-relaxed">
                            {selectedTask.reason}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-2">影响范围</h4>
                          <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-[13px] text-neutral-700 leading-relaxed">
                            {selectedTask.impact}
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary-50 border border-primary-100 p-5 rounded-2xl">
                         <h4 className="text-[14px] font-bold text-primary-900 flex items-center gap-2 mb-3">
                           <Sparkles size={16} className="text-primary-600" /> 推荐处理
                         </h4>
                         <div className="space-y-2">
                           <div className="flex items-start gap-2">
                             <CheckCircle2 size={16} className="text-primary-600 shrink-0 mt-0.5" />
                             <span className="text-[13px] text-primary-800 font-bold">{selectedTask.recommendation}</span>
                           </div>
                           <div className="flex items-start gap-2 opacity-70">
                             <RotateCcw size={16} className="text-primary-600 shrink-0 mt-0.5" />
                             <span className="text-[13px] text-primary-800">退回方向重写</span>
                           </div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                       <div className="flex border-b border-neutral-200">
                          <div className="w-1/3 border-r border-neutral-200 bg-neutral-50/50 p-4">
                             <div className="text-[13px] font-bold text-neutral-900 mb-3">待确认笔记 (12)</div>
                             <div className="space-y-2">
                               <div className="p-3 bg-white border border-primary-300 rounded-xl shadow-sm cursor-pointer relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                                  <div className="text-[12px] font-bold text-neutral-900 truncate">别再乱喂幼犬了！换粮避坑...</div>
                                  <div className="text-[11px] text-neutral-500 mt-1">账号类型：达人种草</div>
                               </div>
                               <div className="p-3 bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 cursor-pointer text-neutral-500">
                                  <div className="text-[12px] font-bold truncate">新手铲屎官必修课：幼犬...</div>
                                  <div className="text-[11px] mt-1">账号类型：专业科普</div>
                               </div>
                             </div>
                          </div>
                          <div className="w-2/3 p-6 bg-white flex flex-col h-full overflow-hidden">
                             <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-2">
                                 <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] rounded font-bold">达人种草</span>
                                 <span className="px-2 py-1 bg-green-50 text-green-600 text-[11px] rounded border border-green-100 font-bold">无违规词风险</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setIsAiRewriting(true);
                                      setTimeout(() => {
                                        setEditTitle("【重磅】幼犬换粮必看！千万别踩这些坑");
                                        setEditBody("新手养狗必看！换粮踩坑无数，今天一次说清...\\n\\n✅ 核心原则：七日换粮法\\n✅ 重点观察：便便形态\\n\\n特唯普幼犬粮，拯救玻璃胃...");
                                        setIsAiRewriting(false);
                                      }, 1500);
                                    }}
                                    className="px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    {isAiRewriting ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />} AI局部润色
                                  </button>
                                  <button className="px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm">
                                    <Check size={14} /> 确认发布
                                  </button>
                               </div>
                             </div>
                             
                             <div className="space-y-4 flex-1 flex flex-col min-h-0">
                               <div className="shrink-0">
                                 <label className="text-[12px] font-bold text-neutral-500 mb-1.5 block">标题</label>
                                 <input
                                   type="text"
                                   value={editTitle}
                                   onChange={(e) => setEditTitle(e.target.value)}
                                   className="w-full text-[16px] font-bold text-neutral-900 p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
                                 />
                               </div>
                               <div className="flex-1 flex flex-col min-h-0">
                                 <label className="text-[12px] font-bold text-neutral-500 mb-1.5 block">正文</label>
                                 <textarea
                                   value={editBody}
                                   onChange={(e) => setEditBody(e.target.value)}
                                   className="w-full flex-1 text-[14px] text-neutral-700 leading-relaxed p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors resize-none custom-scrollbar"
                                 />
                               </div>
                               <div className="shrink-0">
                                 <label className="text-[12px] font-bold text-neutral-500 mb-1.5 block">话题标签</label>
                                 <div className="flex flex-wrap items-center gap-2">
                                   {editTopics.map((topic, i) => (
                                     <span key={i} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] font-medium rounded-lg flex items-center gap-1">
                                       {topic} <button onClick={() => setEditTopics(editTopics.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X size={12} /></button>
                                     </span>
                                   ))}
                                   <button className="px-2 py-1 border border-dashed border-neutral-300 text-neutral-400 text-[12px] font-medium rounded-lg hover:border-primary-400 hover:text-primary-500 flex items-center gap-1 transition-colors">
                                     <Plus size={12} /> 添加
                                   </button>
                                 </div>
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}`;

const rBlock = `                {selectedTask.type === '内容确认' && (
                  <div className="flex-1 flex flex-col h-full -m-8">
                    <div className="flex h-full">
                       <div className="w-1/3 border-r border-neutral-200 bg-neutral-50/50 p-4 overflow-y-auto custom-scrollbar">
                          <div className="text-[13px] font-bold text-neutral-900 mb-3 px-1">待确认笔记 (12)</div>
                          <div className="space-y-2">
                            <div onClick={() => setActiveNoteIdx(0)} className={\`p-3 bg-white border \${activeNoteIdx === 0 ? 'border-primary-400 shadow-sm' : 'border-neutral-200 hover:border-neutral-300 text-neutral-500'} rounded-xl cursor-pointer relative overflow-hidden transition-all\`}>
                               {activeNoteIdx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                               <div className={\`text-[12px] font-bold truncate \${activeNoteIdx === 0 ? 'text-neutral-900' : ''}\`}>别再乱喂幼犬了！换粮避坑...</div>
                               <div className="text-[11px] mt-1 opacity-80">账号类型：达人种草</div>
                            </div>
                            <div onClick={() => setActiveNoteIdx(1)} className={\`p-3 bg-white border \${activeNoteIdx === 1 ? 'border-primary-400 shadow-sm' : 'border-neutral-200 hover:border-neutral-300 text-neutral-500'} rounded-xl cursor-pointer relative overflow-hidden transition-all\`}>
                               {activeNoteIdx === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                               <div className={\`text-[12px] font-bold truncate \${activeNoteIdx === 1 ? 'text-neutral-900' : ''}\`}>新手铲屎官必修课：幼犬...</div>
                               <div className="text-[11px] mt-1 opacity-80">账号类型：专业科普</div>
                            </div>
                          </div>
                       </div>
                       <div className="w-2/3 p-6 bg-white flex flex-col h-full overflow-hidden relative">
                          <div className="flex items-center justify-between mb-4 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] rounded font-bold">达人种草</span>
                              <span className="px-2 py-1 bg-green-50 text-green-600 text-[11px] rounded border border-green-100 font-bold">无违规词风险</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="px-5 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-[13px] font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
                                 <Check size={14} /> 确认并进入发布池
                               </button>
                            </div>
                          </div>
                          
                          <div className="space-y-4 flex-1 flex flex-col min-h-0">
                            <div className="shrink-0 relative">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[12px] font-bold text-neutral-500 block">标题</label>
                                <button 
                                  onClick={() => setShowTitleAiOptions(!showTitleAiOptions)}
                                  className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-2 py-0.5 rounded"
                                >
                                  <Sparkles size={12}/> AI生成爆款标题
                                </button>
                              </div>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full text-[16px] font-bold text-neutral-900 p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
                              />
                              {showTitleAiOptions && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white shadow-xl border border-neutral-100 rounded-xl p-2 z-10">
                                  <div className="text-[11px] font-bold text-neutral-400 px-2 pt-1 pb-2">AI 生成的方向</div>
                                  <div className="space-y-1">
                                    <button onClick={() => {setEditTitle("【重磅】幼犬换粮必看！千万别踩这些坑"); setShowTitleAiOptions(false)}} className="w-full text-left p-2.5 text-[13px] text-neutral-800 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                                      【痛点向】幼犬换粮必看！千万别踩这些坑
                                    </button>
                                    <button onClick={() => {setEditTitle("新手养狗：玻璃胃幼犬是怎么被救回来的？"); setShowTitleAiOptions(false)}} className="w-full text-left p-2.5 text-[13px] text-neutral-800 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                                      【干货向】新手养狗：玻璃胃幼犬是怎么被救回来的？
                                    </button>
                                    <button onClick={() => {setEditTitle("别再乱喂了！幼犬7日换粮法实操全纪录"); setShowTitleAiOptions(false)}} className="w-full text-left p-2.5 text-[13px] text-neutral-800 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                                      【吸睛向】别再乱喂了！幼犬7日换粮法实操全纪录
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col min-h-0 relative">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[12px] font-bold text-neutral-500 block">正文</label>
                                {selectedText && (
                                  <button 
                                    onClick={() => {
                                      setIsAiRewriting(true);
                                      setTimeout(() => {
                                        setEditBody(editBody.replace(selectedText, "【AI润色过的内容：" + selectedText + "】"));
                                        setSelectedText("");
                                        setIsAiRewriting(false);
                                      }, 800);
                                    }}
                                    className="text-[11px] font-bold text-white bg-neutral-800 hover:bg-neutral-900 flex items-center gap-1 px-3 py-1 rounded-full shadow-md animate-in fade-in zoom-in duration-200"
                                  >
                                    {isAiRewriting ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12}/>} 
                                    对选中文案进行润色
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                onSelect={(e) => {
                                  const text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
                                  setSelectedText(text.trim());
                                }}
                                className="w-full flex-1 text-[14px] text-neutral-700 leading-relaxed p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors resize-none custom-scrollbar"
                              />
                            </div>
                            <div className="shrink-0">
                              <label className="text-[12px] font-bold text-neutral-500 mb-1.5 block">话题标签</label>
                              <div className="flex flex-wrap items-center gap-2">
                                {editTopics.map((topic, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] font-medium rounded-lg flex items-center gap-1">
                                    {topic} <button onClick={() => setEditTopics(editTopics.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X size={12} /></button>
                                  </span>
                                ))}
                                <button className="px-2 py-1 border border-dashed border-neutral-300 text-neutral-400 text-[12px] font-medium rounded-lg hover:border-primary-400 hover:text-primary-500 flex items-center gap-1 transition-colors">
                                  <Plus size={12} /> 添加
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}`;

// Since the target block is large, let's use exact match or fallback to regex
if (code.includes(tBlock)) {
    code = code.replace(tBlock, rBlock);
    fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
    console.log("tBlock matched and replaced");
} else {
    console.log("tBlock not found. Trying fallback...");
    // Fallback: replace everything between `{selectedTask.type === '内容确认' && (` and `)}` that corresponds to it.
    // Given the risk of regex, let's do an exact match using index if possible.
    const startIdx = code.indexOf(`                {selectedTask.type === '内容确认' && (`);
    const endIdx = code.indexOf(`                {selectedTask.type === '素材补齐' && (`);
    if(startIdx !== -1 && endIdx !== -1) {
        code = code.substring(0, startIdx) + rBlock + "\n" + code.substring(endIdx);
        fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
        console.log("Replaced via index");
    } else {
        console.log("Failed to find via index");
    }
}
