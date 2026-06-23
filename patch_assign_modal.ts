import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const assignModalRegex = /<h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">AI 智能发包与人员指派<\/h3>[\s\S]*?<div className="grid gap-2">/;

const replacement = `<h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">智能指派与企微/微信通知</h3>
                <button onClick={() => setShowAssignModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              
              <div className="p-5 flex flex-col gap-4 bg-white max-h-[70vh] overflow-y-auto">
                {/* AI 自动化分发策略 */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 rounded-xl border border-primary-100">
                   <div className="flex items-center gap-2 mb-2 text-primary-700 font-medium text-[14px]">
                     <Sparkles size={16} /> AI 将基于视觉需求自动匹配最合适的内部员工
                   </div>
                   <div className="mt-3">
                     <button onClick={() => {
                        setToastMessage("AI 已自动指派员工「豆豆」，并通过企微/微信发送任务卡片");
                        setTimeout(() => setToastMessage(""), 3000);
                        setShowAssignModal(null);
                     }} className="w-full bg-white p-4 rounded-lg border border-primary-200 shadow-sm hover:shadow hover:border-primary-400 transition-all text-left flex items-center justify-between group">
                       <div className="flex flex-col gap-1">
                         <span className="text-[14px] font-semibold text-neutral-900 flex items-center gap-2"><svg className="w-4 h-4 text-[#10B681]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.003 0C5.372 0 0 5.373 0 12.003c0 6.633 5.372 12.005 12.003 12.005 6.629 0 12.001-5.372 12.001-12.005C24.004 5.373 18.632 0 12.003 0zm4.568 15.938H7.43v-1.748h9.141v1.748zm.284-4.887H7.146v-1.746h9.709v1.746zm.283-4.885H6.864v-1.748h10.27v1.748z"/></svg>通过企微/微信通知下发</span>
                         <span className="text-[11px] text-neutral-500">依据员工画像与空闲度一键外派，素材回传后自动进入系统</span>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                         <Bot size={18}/>
                       </div>
                     </button>
                   </div>
                </div>

                <div className="text-[12px] font-medium text-neutral-900 mt-2 mb-1 flex items-center justify-between">
                  手动下发
                  <span className="text-[10px] text-neutral-400 font-normal">指定特定部门与标签</span>
                </div>
                <div className="grid gap-2">`;

code = code.replace(assignModalRegex, replacement);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
