import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regex = /\{showAssignModal !== null && \([\s\S]*?\}\)/;

const newModal = `{showAssignModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">AI 智能发包与人员指派</h3>
                <button onClick={() => setShowAssignModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              
              <div className="p-5 flex flex-col gap-4 bg-white max-h-[70vh] overflow-y-auto">
                {/* AI 自动化分发策略 */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 rounded-xl border border-primary-100">
                   <div className="flex items-center gap-2 mb-2 text-primary-700 font-medium text-[14px]">
                     <Sparkles size={16} /> AI 分析任务需求：需【外景光、真实体验感、3张实拍】
                   </div>
                   <div className="grid grid-cols-2 gap-3 mt-3">
                     <button onClick={() => {
                        setToastMessage("AI 已自动锁定内部员工「豆豆」，并下发企微任务");
                        setTimeout(() => setToastMessage(""), 3000);
                        setShowAssignModal(null);
                     }} className="bg-white p-3 rounded-lg border border-primary-200 shadow-sm hover:shadow hover:border-primary-400 transition-all text-left flex flex-col gap-1 relative overflow-hidden group">
                       <span className="text-[13px] font-semibold text-neutral-900">匹配内部团队</span>
                       <span className="text-[11px] text-neutral-500">依据员工标签自动派单</span>
                       <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                         <Bot size={14}/>
                       </div>
                     </button>
                     <button onClick={() => {
                        setToastMessage("AI 已生成个性化合作邀约，推送至素人达人库分发");
                        setTimeout(() => setToastMessage(""), 3000);
                        setShowAssignModal(null);
                     }} className="bg-white p-3 rounded-lg border border-primary-200 shadow-sm hover:shadow hover:border-primary-400 transition-all text-left flex flex-col gap-1 relative overflow-hidden group">
                       <span className="text-[13px] font-semibold text-neutral-900">素人/KOC派单</span>
                       <span className="text-[11px] text-neutral-500">匹配素人特征生成拍摄大纲</span>
                       <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                         <Target size={14}/>
                       </div>
                     </button>
                   </div>
                </div>

                <div className="text-[12px] font-medium text-neutral-900 mt-2 mb-1">手动下发 (内部部门与标签)</div>
                <div className="grid gap-2">
                {[
                  { name: '王大锤', dept: '设计部', status: '空闲', tags: ['棚拍', '精修', '视觉总控'], color: 'bg-green-100 text-green-600' },
                  { name: '豆豆', dept: '新媒体部', status: '进行2个任务', tags: ['生活感', '外景', '通勤', '出镜'], color: 'bg-amber-100 text-amber-600' },
                  { name: '视觉天下影棚', dept: '外部机构', status: '空闲', tags: ['专业器材', '批量产出'], color: 'bg-green-100 text-green-600' }
                ].map((person, idx) => (
                  <div key={idx} onClick={() => {
                    setToastMessage("已通过企业微信发送任务通知给：" + person.name);
                    setTimeout(() => setToastMessage(""), 3000);
                    setShowAssignModal(null);
                  }} className="p-3 border border-neutral-200 rounded-xl hover:border-primary-500 hover:shadow-md cursor-pointer transition-all flex flex-col gap-2 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500"><Users size={16} /></div>
                        <div>
                          <div className="text-[13px] text-neutral-900 font-medium mb-0.5">{person.name} <span className="text-[11px] text-neutral-400">({person.dept})</span></div>
                          <div className={\`text-[10px] w-fit px-1.5 py-0.5 rounded-full \${person.color}\`}>{person.status}</div>
                        </div>
                      </div>
                      <span className="text-primary-500 opacity-0 group-hover:opacity-100 text-[12px] bg-primary-50 px-2 py-1 rounded transition-opacity font-medium">指派任务</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-13">
                      {person.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded border border-neutral-200 flex items-center gap-0.5"><Hash size={10}/> {tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}`;

code = code.replace(regex, newModal);
fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
