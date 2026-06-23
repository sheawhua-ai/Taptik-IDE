import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regex = /<label className="text-\[11px\] font-bold text-neutral-400 uppercase">项目名称<\/label>\s*<input type="text" placeholder="例如：2026秋季大促矩阵"[^>]*\/>\s*<\/div>\s*<div className="col-span-2 space-y-2">/;

const replaceStr = `<label className="text-[11px] font-bold text-neutral-400 uppercase">项目名称</label>
                              <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] font-black outline-none focus:border-primary-500 transition-colors" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[11px] font-bold text-neutral-400 uppercase">排期开始日期</label>
                              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] font-black outline-none focus:border-primary-500 transition-colors text-neutral-700 block" style={{ colorScheme: 'light' }} />
                           </div>
                           <div className="space-y-4 pt-2">
                              <label className="text-[11px] font-bold text-neutral-400 uppercase">投入成本与执行策略选择</label>
                              <div className="grid grid-cols-3 gap-3">
                                 <button 
                                   onClick={() => setStrategy('low')}
                                   className={\`p-4 rounded-2xl border text-left transition-all \${strategy === 'low' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}\`}
                                 >
                                    <div className="text-[13px] font-black text-neutral-900">低成本破圈</div>
                                    <div className="text-[11px] font-bold text-neutral-400 mt-1">少量账号，低频率下发</div>
                                 </button>
                                 <button 
                                   onClick={() => setStrategy('balanced')}
                                   className={\`p-4 rounded-2xl border text-left transition-all \${strategy === 'balanced' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}\`}
                                 >
                                    <div className="text-[13px] font-black text-neutral-900">均衡型种草</div>
                                    <div className="text-[11px] font-bold text-neutral-400 mt-1">矩阵分发，中等执行量</div>
                                 </button>
                                 <button 
                                   onClick={() => setStrategy('high')}
                                   className={\`p-4 rounded-2xl border text-left transition-all relative overflow-hidden \${strategy === 'high' ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}\`}
                                 >
                                    <div className="text-[13px] font-black text-neutral-900">饱和式攻击 (高成本)</div>
                                    <div className="text-[11px] font-bold text-neutral-400 mt-1">密集发布，动用大量账号</div>
                                    {strategy === 'high' && <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500 rounded-bl-[16px] flex items-center justify-center text-white"><AlertTriangle size={12} /></div>}
                                 </button>
                              </div>
                           </div>
                           <div className="col-span-1 space-y-2 mt-2">`;

code = code.replace(regex, replaceStr);
fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
