const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldBtns = `             <div className="flex items-center gap-3">
               <button className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                 保存修改
               </button>
               {activeNote.mainIssue !== '无明显问题' ? (
                 <button className="px-6 py-2.5 bg-amber-500 text-white text-[13px] font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2">
                   确认风险并通过 <ChevronRight size={16} />
                 </button>
               ) : (
                 <button className="px-6 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                   审核通过并查看下一篇 <ChevronRight size={16} />
                 </button>
               )}
             </div>`;
             
const newBtns = `             <div className="flex items-center gap-3">
               <button className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                 保存修改
               </button>
               <button onClick={handleApprove} className="px-6 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                 确认审核并查看下一篇 <ChevronRight size={16} />
               </button>
             </div>`;

code = code.replace(oldBtns, newBtns);
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
