import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const duplicateRegex = /<div className="xl:col-span-1">\s*<label className="text-\[10px\] font-bold text-neutral-400 uppercase mb-1\.5 block">账号类型分配<\/label>\s*<input readOnly value=\{m\.allocation\}.*?\/>\s*<\/div>\s*<div className="xl:col-span-1">\s*<label className="text-\[10px\] font-bold text-neutral-400 uppercase mb-1\.5 block">账号类型分配<\/label>\s*<input readOnly value=\{m\.allocation\}.*?\/>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newLoopEnd = `<div className="xl:col-span-1">
                                       <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 block">账号类型分配</label>
                                       <input readOnly value={m.allocation} title={m.allocation} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[11px] font-bold outline-none focus:bg-white focus:border-primary-500 transition-colors text-slate-700" />
                                     </div>
                                 </div>
                                 <button onClick={() => handleRemovePeriod(i)} className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0" title="删除当前阶段排期">
                                     <Trash2 size={14} />
                                 </button>
                              </div>`;

code = code.replace(duplicateRegex, newLoopEnd);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
