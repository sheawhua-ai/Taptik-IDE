const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">账号分配</label>
                    <div className="space-y-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-neutral-700 font-medium">A01 (测评号)</span>
                        <div className="relative w-20"><input type="number" value={formValues.a01} onChange={e => setFormValues({...formValues, a01: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-neutral-700 font-medium">A02 (避坑号)</span>
                        <div className="relative w-20"><input type="number" value={formValues.a02} onChange={e => setFormValues({...formValues, a02: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-neutral-700 font-medium">A05 (专业号)</span>
                        <div className="relative w-20"><input type="number" value={formValues.a05} onChange={e => setFormValues({...formValues, a05: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-neutral-700 font-medium">外部 KOC 领取池</span>
                        <div className="relative w-20"><input type="number" value={formValues.koc} onChange={e => setFormValues({...formValues, koc: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">KOC 素材执行模式</label>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 space-y-3">
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
                  </div>`;

const newHtml = `                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">账号矩阵与内容策略</label>
                    <div className="space-y-3">
                      {/* 官方/专业号 */}
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>专业号 (A05)</span>
                          <div className="relative w-20"><input type="number" value={formValues.a05} onChange={e => setFormValues({...formValues, a05: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-neutral-50 border border-neutral-200 rounded-md pl-2 pr-6 py-1.5 text-[13px] text-center font-medium" /><span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5">
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>品牌背书、专业成分科普</p></div>
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">素材操作：</span>员工选用官方精美海报、高清素材或棚拍</p></div>
                        </div>
                      </div>

                      {/* 员工/人设号 */}
                      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>员工/人设号 (A01/A02)</span>
                          <div className="flex gap-2">
                             <div className="relative w-[72px]"><input type="number" value={formValues.a01} onChange={e => setFormValues({...formValues, a01: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-neutral-50 border border-neutral-200 rounded-md pl-2 pr-6 py-1.5 text-[13px] text-center font-medium" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[11px] font-medium">A01</span></div>
                             <div className="relative w-[72px]"><input type="number" value={formValues.a02} onChange={e => setFormValues({...formValues, a02: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-neutral-50 border border-neutral-200 rounded-md pl-2 pr-6 py-1.5 text-[13px] text-center font-medium" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[11px] font-medium">A02</span></div>
                          </div>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5">
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>测评对比、避坑指南、个人养宠经验</p></div>
                          <div className="flex gap-2"><span className="text-neutral-400 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">素材操作：</span>员工领取实拍任务，回传生活化场景配图</p></div>
                        </div>
                      </div>

                      {/* 外部 KOC */}
                      <div className="bg-emerald-50/30 border border-emerald-100 shadow-sm rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>外部 KOC 矩阵</span>
                          <div className="relative w-20"><input type="number" value={formValues.koc} onChange={e => setFormValues({...formValues, koc: parseInt(e.target.value)||0})} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] w-full bg-white border border-emerald-200 rounded-md pl-2 pr-6 py-1.5 text-[13px] text-center font-medium" /><span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-[12px] text-neutral-600 space-y-1.5 border border-emerald-100/50">
                          <div className="flex gap-2"><span className="text-emerald-400 shrink-0 mt-0.5"><Compass size={14}/></span><p><span className="font-bold text-neutral-700">视角定调：</span>真实反馈、软便改善记录、挑食应对过程</p></div>
                          <div className="flex gap-2"><span className="text-emerald-400 shrink-0 mt-0.5"><ImageIcon size={14}/></span><p><span className="font-bold text-neutral-700">素材操作：</span>需在此预置 KOC 取材模式，影响下游分发流转</p></div>
                        </div>
                        
                        <div className="pt-2 border-t border-emerald-100 space-y-2">
                           <label className="flex items-start gap-2 cursor-pointer group">
                             <input type="radio" name="koc_mode" defaultChecked className="mt-0.5 accent-emerald-600" />
                             <div>
                               <div className="text-[13px] font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors">KOC 领取任务时自行实拍回传</div>
                               <div className="text-[11px] text-neutral-500 mt-0.5">流程：系统下发拍摄要求 &rarr; KOC 回传 &rarr; AI 校验合排</div>
                             </div>
                           </label>
    
                           <label className="flex items-start gap-2 cursor-pointer group">
                             <input type="radio" name="koc_mode" className="mt-0.5 accent-emerald-600" />
                             <div>
                               <div className="text-[13px] font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors">商家云端下发标准素材包</div>
                               <div className="text-[11px] text-neutral-500 mt-0.5">流程：员工上传素材 &rarr; 生成多种配图 &rarr; 下发给 KOC 发布</div>
                             </div>
                           </label>
                        </div>
                      </div>
                    </div>
                  </div>`;

if (content.includes("外部 KOC 领取池")) {
    content = content.replace(targetStr, newHtml);
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Not found");
}

