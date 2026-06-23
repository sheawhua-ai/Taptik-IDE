import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// Replace tasks state with mock arrays
const tasksStateRegex = /const \[tasks, setTasks\] = useState\(\[[\s\S]*?\]\);/;
const tasksData = `const INTERNAL_TASKS = [
  { id: 1, name: '外景通勤透气感穿搭实拍', mergedFrom: 5, count: 15, current: 8, assignee: '豆豆 (新媒体部)', status: '执行中', require: '基于5篇“防晒测评合集”自动提炼。需要阳光充足，体现透气材质，带产品特写。' },
  { id: 2, name: '室内摄影棚平铺静物', mergedFrom: 3, count: 12, current: 0, assignee: '未分配', status: '待分配', require: '基于3篇“单品深度解析”提炼。要求室温柔光背景，高级光影，突出产品质感，3:4构图。' }
];

const EXTERNAL_TASKS = [
  { id: 3, name: '夏季通勤防晒实测第1篇', noteTarget: '防晒测评第1篇：户外暴晒', count: 4, current: 4, assignee: '素人@小甜甜', status: 'AI审核通过待发布', require: '需包含真实上脸涂抹图及对应评测配文。合格后AI自动推流发布。' },
  { id: 4, name: '夏季通勤防晒实测第2篇', noteTarget: '防晒单品：带妆不补涂', count: 3, current: 0, assignee: '未分配', status: '待领取', require: '需包含带妆出镜图，体现产品服帖度。' }
];
`;
code = code.replace(tasksStateRegex, tasksData);

// Update Audit Modal to AI Audit Modal
const auditModalRegex = /\{showAuditModal !== null && \([\s\S]*?\{\/\* Toast Notification \*\/\}/;
const newAuditModal = `{showAuditModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <div>
                  <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">AI 自动审核报告</h3>
                  <p className="text-[11px] text-neutral-500 mt-1 pl-3">系统已自动审核素人提交素材，并将其同步至对应笔记发布队列</p>
                </div>
                <button onClick={() => setShowAuditModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-emerald-100 text-emerald-600"><CheckCircle2 size={18}/></div>
                  <div>
                    <div className="text-[14px] font-medium text-neutral-900 flex items-center gap-2">素人@小甜甜 - 提交的图文素材</div>
                    <div className="text-[12px] text-emerald-500 mt-1 flex items-center gap-1"><Sparkles size={12}/> AI 视觉引擎校验通过，内容健康且满足需求</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900 mb-2 flex items-center gap-1.5"><ImageIcon size={14}/> 审核通过素材 (4/4)</div>
                    <div className="grid grid-cols-4 gap-2">
                       {[1,2,3,4].map(num => (
                         <div key={num} className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 relative group cursor-pointer">
                            <img src={\`https://images.unsplash.com/photo-1600000\${num}00000?auto=format&fit=crop&q=80&w=150&h=200\`} className="w-full h-full object-cover"/>
                            <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full"><CheckCircle2 size={10}/></div>
                         </div>
                       ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-[13px] font-medium text-neutral-900 mb-2 flex items-center gap-1.5"><MessageSquare size={14}/> 配套发布文案展示</div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[13px] text-neutral-700 leading-relaxed relative">
                      最近找到了一款超好用的防晒宝藏！[派对R]<br/><br/>
                      作为一个每天早起通勤的打工人，防晒真的是我的续命神器。这几天试用了品牌方寄来的这款，上脸感觉真的出乎意料的轻薄，一点都不假白！最重要的是化完妆也不会搓泥，真的爱了！<br/><br/>
                      #防晒推荐 #日常好物 #素人实测
                      <div className="absolute top-3 right-3 text-emerald-500 bg-emerald-100 px-2 py-0.5 text-[10px] rounded">合规探测通过</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 items-center">
                <span className="text-[12px] text-neutral-400 flex items-center gap-1"><Bot size={14}/> 此审核由系统自动完成，无需人工干预</span>
                <button onClick={() => setShowAuditModal(null)} className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-medium hover:bg-neutral-800 shadow transition-colors flex items-center gap-2">
                  关闭查看
                </button>
              </div>
            </motion.div>
          </div>
        )}

      {/* Toast Notification */}`;
code = code.replace(auditModalRegex, newAuditModal);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
