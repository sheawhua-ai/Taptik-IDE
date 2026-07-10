const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

code = code.replace(/notes\.filter\(n => n\.accountType/g, 'notes.filter(n => !n.isReviewed && n.accountType');

const additionalReviewedSection = `
            {/* Reviewed Notes Group */}
            {notes.filter(n => n.isReviewed).length > 0 && (
              <div>
                <div onClick={() => setShowReviewed(!showReviewed)} className="flex items-center justify-between text-[13px] font-bold text-neutral-500 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1 border-t border-neutral-100 mt-4 pt-4">
                  <div className="flex items-center gap-1">
                    <ChevronRight size={14} className={\`text-neutral-400 transition-transform \${showReviewed ? 'rotate-90' : ''}\`} />
                    已审核 (待发布)
                  </div>
                  <span className="text-neutral-400">{notes.filter(n => n.isReviewed).length}</span>
                </div>
                {showReviewed && (
                  <div className="pl-6 pr-2 space-y-1.5">
                     {notes.filter(n => n.isReviewed).map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={\`p-3 rounded-xl border cursor-pointer transition-colors \${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }\`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            )}
            `;

code = code.replace(/\{\/\* Another Project Group Placeholder \*\/\}/g, additionalReviewedSection + '\n            {/* Another Project Group Placeholder */}');
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
