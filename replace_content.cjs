const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const target = `<div className="w-2/3 p-6 bg-white">
                             <div className="flex items-center gap-2 mb-4">
                               <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] rounded font-bold">达人种草</span>
                               <span className="px-2 py-1 bg-green-50 text-green-600 text-[11px] rounded border border-green-100 font-bold">无违规词风险</span>
                             </div>
                             <h3 className="text-[16px] font-bold text-neutral-900 mb-4">别再乱喂幼犬了！换粮避坑指南</h3>
                             <div className="text-[14px] text-neutral-700 leading-relaxed whitespace-pre-wrap">
                               新手养狗真的很容易在换粮上踩坑！今天分享一下我家狗狗的换粮血泪史...
                               
                               📌 核心原则：七日换粮法千万别省事
                               📌 注意点：观察便便情况
                               
                               特唯普这款幼犬粮真的是救星...
                             </div>
                          </div>`;

const replacement = `<div className="w-2/3 p-6 bg-white flex flex-col h-full overflow-hidden">
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
                          </div>`;

if(code.includes(target)) {
  fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code.replace(target, replacement));
  console.log("Replaced successfully!");
} else {
  console.log("Target not found!");
}
