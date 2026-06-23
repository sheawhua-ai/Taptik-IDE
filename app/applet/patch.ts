import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regex = /<button onClick=\{\(\) => setIsCreatingProject\(false\)\} className="px-8 py-3\.5 bg-primary-500 text-white rounded-xl text-\[14px\] font-black hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500\/20 active:scale-95 flex items-center gap-2">\s*确认创建并生成排期任务 <ArrowRight size=\{16\} \/>\s*<\/button>/;

code = code.replace(regex, `<button onClick={() => setShowConfirmModal(true)} className="px-8 py-3.5 bg-primary-500 text-white rounded-xl text-[14px] font-black hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2">
                           确认创建并生成排期任务 <ArrowRight size={16} />
                        </button>`);

// Also add delete button to periods
const loopRegex = /<div className="xl:col-span-1">\s*<label className="text-\[10px\] font-bold text-neutral-400 uppercase mb-1\.5 block">账号类型分配<\/label>\s*<input readOnly value=\{m\.allocation\}.*?\/>\s*<\/div>\s*<\/div>/;

code = code.replace(loopRegex, `$&
                                <div className="mt-6">
                                   <button onClick={() => handleRemovePeriod(i)} className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0" title="删除当前阶段排期">
                                      <Trash2 size={14} />
                                   </button>
                                </div>`);

// Add state modal variable
const stateRegex = /const \[schedulePeriods, setSchedulePeriods\] = useState\(\[/;

code = code.replace(stateRegex, `const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleRemovePeriod = (index: number) => {
    setSchedulePeriods(schedulePeriods.filter((_, i) => i !== index));
  };
  
  // Update allocation count based on target note inputs changes to dynamically calculate KOS/KOC ratio based on user context
  const handleNotesChange = (index: number, newNotes: string) => {
     const newPeriods = [...schedulePeriods];
     newPeriods[index].notes = newNotes;
     const count = parseInt(newNotes.replace(/[^0-9]/g, ''));
     if (count > 0) {
        const main = Math.max(1, Math.floor(count * 0.1));
        const kos = Math.max(1, Math.floor(count * 0.3));
        const koc = count - main - kos;
        newPeriods[index].allocation = \`主账号 \${main}篇 | KOS \${kos}篇 | 素人 \${koc}篇\`;
     }
     setSchedulePeriods(newPeriods);
  };
  
  // Default values
  const [schedulePeriods, setSchedulePeriods] = useState([`);

// Replace the onChange handler for the notes input
code = code.replace(
  /<input defaultValue=\{m\.notes\} className="w-full bg-neutral-50/g,
  `<input value={m.notes} onChange={(e) => handleNotesChange(i, e.target.value)} className="w-full bg-white`
);


// Add modal block at the bottom
const modalBlock = `
         {/* Secondary Confirmation Modal */}
         <AnimatePresence>
            {showConfirmModal && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
               >
                 <motion.div
                   initial={{ scale: 0.95, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.95, opacity: 0 }}
                   className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
                 >
                    <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-amber-50">
                       <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-[16px] flex items-center justify-center shrink-0">
                          <AlertTriangle size={24} />
                       </div>
                       <div>
                          <h3 className="text-[16px] font-black text-amber-900">执行资源预警确认</h3>
                          <p className="text-[12px] font-bold text-amber-700 mt-1">检测到生成内容的密集度较高，需二次确认</p>
                       </div>
                    </div>
                    <div className="p-6 space-y-4 bg-white flex-1">
                       <div className="p-4 bg-neutral-50 rounded-[16px] border border-neutral-200">
                          <ul className="space-y-3">
                             <li className="flex items-start gap-2">
                                <AlertCircle size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                                <span className="text-[13px] font-bold text-slate-700 leading-snug">
                                   当前规划总生产笔记数超过 <strong>100</strong> 篇，需联动下游 MCN/素人矩阵资源。
                                </span>
                             </li>
                             <li className="flex items-start gap-2">
                                <AlertCircle size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                                <span className="text-[13px] font-bold text-slate-700 leading-snug">
                                   请确保 <strong className="text-primary-600">KOS/KOC执行账号</strong> 充足，因 AI 批量产出速度高于人工发布速度，如账号不足将导致内容堵塞无法下发。
                                </span>
                             </li>
                          </ul>
                       </div>
                       <p className="text-[12px] text-neutral-500 font-bold px-1">
                          点击“强制执行创建”后，系统将在本阶段自动锁定对应的预算和积分消耗。
                       </p>
                    </div>
                    <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
                       <button onClick={() => setShowConfirmModal(false)} className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-neutral-500 hover:bg-neutral-200 transition-colors">
                          返回调整排期
                       </button>
                       <button onClick={() => { setShowConfirmModal(false); setIsCreatingProject(false); }} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[13px] font-black hover:bg-amber-600 transition-all shadow-sm active:scale-95">
                          确认资源充足，强制执行创建
                       </button>
                    </div>
                 </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
`;

code = code.replace(/<\/div>\s*<\/div>\s*\);\s*\}\s*const TargetIcon/, `${modalBlock}\n      </div>\n    </div>\n  );\n}\n\nconst TargetIcon`);


fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
