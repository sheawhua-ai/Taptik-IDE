const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldMaterialsDrawer = `        {activeDrawer === 'materials' && (
           <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setActiveDrawer(null)}>
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
             <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                 <div className="flex items-center gap-2">
                   <Camera size={18} className="text-indigo-600" />
                   <h3 className="font-bold text-neutral-900 text-[16px]">素材执行任务 - 幼犬换粮</h3>
                 </div>
                 <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                   <X size={18} className="text-neutral-500" />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                   <Wand2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-indigo-900 mb-1">AI 总结：实拍需求池</h4>
                     <p className="text-[12px] text-indigo-700 leading-relaxed">系统已自动汇总当前战役中所有笔记的素材需求。为保证小红书原生感，建议分发给员工实拍，或作为 KOC 领取笔记的附带拍摄任务。</p>
                   </div>
                 </div>
                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                   <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-amber-900 mb-1">当前缺 8 个关键素材</h4>
                     <p className="text-[12px] text-amber-700 leading-relaxed">这批素材缺失直接导致 12 篇爆款潜力的“挑食误区”笔记无法排期发布，建议立即补齐。</p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   {[
                     { title: "狗狗挑食实拍封面图", req: "需要带狗粮袋出镜，狗狗有拒绝进食的动作或表情，环境最好是真实的家居场景。", count: 2, tags: ["封面素材", "挑食场景"] },
                     { title: "软便对比图（需处理）", req: "表现换粮前后的状态对比，注意不要过于引起不适，主要展现健康的便便状态，辅以文字说明。", count: 3, tags: ["正文素材", "效果对比"] },
                     { title: "成分表特写实拍", req: "清晰拍摄狗粮包装袋背后的成分表，重点圈出前三位的鲜肉成分，光线要明亮。", count: 3, tags: ["专业科普", "成分党"] }
                   ].map((item, i) => (
                     <div key={i} className="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 bg-white hover:border-indigo-300 transition-colors group shadow-sm">
                       <div className="flex items-center justify-between">
                         <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-1.5">
                           <ImageIcon size={14} className="text-neutral-400" /> {item.title}
                         </h4>
                         <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">缺 {item.count} 张</span>
                       </div>
                       <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                         <p className="text-[12px] text-neutral-600 leading-relaxed"><span className="font-bold text-neutral-700">拍摄要求：</span>{item.req}</p>
                       </div>
                       <div className="flex gap-2">
                         {item.tags.map((tag, j) => (
                           <span key={j} className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{tag}</span>
                         ))}
                       </div>
                       <div className="flex gap-2 mt-2 pt-3 border-t border-neutral-100">
                         <button className="flex-1 text-[12px] font-medium text-white bg-neutral-900 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5">
                           <UploadCloud size={14} /> 员工回传实拍
                         </button>
                         <button className="flex-1 text-[12px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5">
                           <Users size={14} /> 派发 KOC 任务
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </motion.div>
           </div>
        )}`;

const newMaterialsDrawer = `        {activeDrawer === 'materials' && (
           <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setActiveDrawer(null)}>
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
             <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                 <div className="flex items-center gap-2">
                   <Camera size={18} className="text-indigo-600" />
                   <h3 className="font-bold text-neutral-900 text-[16px]">素材执行任务 - 幼犬换粮</h3>
                 </div>
                 <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                   <X size={18} className="text-neutral-500" />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                   <Wand2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-indigo-900 mb-1">AI 总结：结构化素材需求</h4>
                     <p className="text-[12px] text-indigo-700 leading-relaxed">已将所有笔记的配图需求汇总为独立任务。您可以根据账号类型（自有矩阵 / 外部 KOC）配置不同的执行流与素材顺序。</p>
                   </div>
                 </div>

                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                   <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-amber-900 mb-1">当前缺 8 个关键素材</h4>
                     <p className="text-[12px] text-amber-700 leading-relaxed">素材缺失导致 12 篇潜力笔记卡在待定状态，请分配执行。</p>
                   </div>
                 </div>

                 {/* 商家自有矩阵 */}
                 <div>
                   <h3 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span> 商家自有矩阵素材任务 (A01/A02/A05)
                   </h3>
                   <div className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
                     <div className="flex items-center justify-between">
                       <h4 className="font-bold text-[14px] text-neutral-900">狗狗挑食实拍图 & 成分特写</h4>
                       <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">缺 4 张</span>
                     </div>
                     <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                       <p className="text-[12px] text-neutral-600 leading-relaxed"><span className="font-bold text-neutral-700">要求：</span>带包装袋出镜、表现换粮前后对比、高清成分特写。需保证高度一致的人设场景。</p>
                     </div>
                     <div className="flex gap-2">
                       <button className="flex-1 text-[12px] font-medium text-neutral-700 bg-neutral-100 px-3 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5">
                         <ImageIcon size={14} /> 从本地素材库挑选
                       </button>
                       <button className="flex-1 text-[12px] font-medium text-white bg-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                         <UploadCloud size={14} /> 员工线下拍摄回传
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* 外部 KOC */}
                 <div>
                   <h3 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span> 外部 KOC 领取池任务
                   </h3>
                   <div className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
                     <div className="flex items-center justify-between">
                       <h4 className="font-bold text-[14px] text-neutral-900">软便真实反馈与幼犬进食记录</h4>
                       <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">缺 4 张</span>
                     </div>
                     <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                       <p className="text-[12px] text-neutral-600 leading-relaxed"><span className="font-bold text-neutral-700">要求：</span>表现幼犬日常进食状态，重点是真实感，无需过度布光。</p>
                     </div>
                     
                     {/* KOC 素材模式配置 */}
                     <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 space-y-3">
                       <div className="text-[12px] font-bold text-emerald-900 mb-1">配置 KOC 素材流转模式</div>
                       
                       <label className="flex items-start gap-2 cursor-pointer group">
                         <input type="radio" name="koc_mode" defaultChecked className="mt-0.5 accent-emerald-600" />
                         <div>
                           <div className="text-[13px] font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors">KOC 领取任务时自行实拍回传</div>
                           <div className="text-[11px] text-neutral-500 mt-0.5">流程：等待 KOC 回传素材 &rarr; AI 图文合排 &rarr; 确认发布</div>
                         </div>
                       </label>

                       <label className="flex items-start gap-2 cursor-pointer group">
                         <input type="radio" name="koc_mode" className="mt-0.5 accent-emerald-600" />
                         <div>
                           <div className="text-[13px] font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors">员工云端下发标准素材包</div>
                           <div className="text-[11px] text-neutral-500 mt-0.5">流程：员工上传素材 &rarr; 生成标准配图 &rarr; 下发给 KOC 发布</div>
                         </div>
                       </label>
                     </div>

                     <div className="flex pt-1">
                       <button className="w-full text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5">
                         <Users size={14} /> 生成 KOC 招募指令卡
                       </button>
                     </div>
                   </div>
                 </div>

               </div>
             </motion.div>
           </div>
        )}`;

content = content.replace(oldMaterialsDrawer, newMaterialsDrawer);

fs.writeFileSync(file, content);
console.log('Materials drawer updated again');
