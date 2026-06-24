import fs from 'fs';

let strategyCode = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf8');

// Replace standard imports to get new icons
if (!strategyCode.includes('Package')) {
  strategyCode = strategyCode.replace(/RefreshCw,/, 'RefreshCw, Package, Calendar,');
}

// Add state for Project Config
strategyCode = strategyCode.replace(
  /const \[selectedTopic, setSelectedTopic\] = useState<number \| null>\(null\);/,
  `const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [projectTargetGroup, setProjectTargetGroup] = useState<'internal'|'external'>('internal');
  const [isCreating, setIsCreating] = useState(false);`
);

// We need to change the premium banner click
strategyCode = strategyCode.replace(
  /onClick=\{[^}]*'open-expert'[^}]*\}\}/,
  `onClick={() => setShowConfig(true)}`
);

strategyCode = strategyCode.replace(
  /<Sparkles size=\{16\} \/> 试试沟通更多个性化选题/,
  `<Sparkles size={16} /> 沟通个性化并新建项目`
);

// Add the Project Config section at the bottom before Action Bar
const actionBarRegex = /\{\/\* Action Bar \*\/\}/;
const projectConfigUI = `{/* Project Config Section */}
        {(selectedTopic !== null || showConfig) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] border border-neutral-100 p-6 shadow-sm mt-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight flex items-center gap-2">
                  <Package size={18} className="text-primary-500" />
                  项目建档与分发配置
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest">配置项目基础信息并将策略推入执行大盘</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-neutral-700">项目名称</label>
                <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-neutral-700">排期起始时间</label>
                <input type="date" className="w-full h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 focus:bg-white transition-colors text-neutral-700 block" style={{ colorScheme: 'light' }} />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-3">
                <label className="text-[12px] font-medium text-neutral-700">素材执行与归集方式</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => setProjectTargetGroup('internal')} className={\`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all \${projectTargetGroup === 'internal' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-primary-200'}\`}>
                    <div className={\`w-5 h-5 rounded-full border-4 shrink-0 mt-0.5 \${projectTargetGroup === 'internal' ? 'border-primary-500 bg-white' : 'border-neutral-300 bg-white'}\`}></div>
                    <div>
                      <div className="text-[14px] font-semibold text-neutral-900">内部团队执行项目</div>
                      <div className="text-[12px] text-neutral-500 mt-1 leading-relaxed">自动合并相似构图需求，打包发送至企微进行员工排期拍摄</div>
                    </div>
                  </div>
                  <div onClick={() => setProjectTargetGroup('external')} className={\`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all \${projectTargetGroup === 'external' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-primary-200'}\`}>
                    <div className={\`w-5 h-5 rounded-full border-4 shrink-0 mt-0.5 \${projectTargetGroup === 'external' ? 'border-primary-500 bg-white' : 'border-neutral-300 bg-white'}\`}></div>
                    <div>
                      <div className="text-[14px] font-semibold text-neutral-900">外部素人KOC分发</div>
                      <div className="text-[12px] text-neutral-500 mt-1 leading-relaxed">按单篇生成任务下发接单大厅。素人扫码认领，素材自动审核后代发布</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-neutral-100">
               {showConfig && (
                  <button onClick={() => setShowConfig(false)} className="px-6 py-3.5 rounded-xl text-[14px] text-neutral-600 hover:bg-neutral-100 transition-colors">
                    取消个性化
                  </button>
               )}
               <button 
                  onClick={() => {
                    setIsCreating(true);
                    setTimeout(() => {
                      setIsCreating(false);
                      window.dispatchEvent(new CustomEvent('nav-to-matrix'));
                    }, 1200);
                  }}
                  className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 bg-neutral-900 text-white hover:bg-primary-500 hover:scale-[1.02] shadow-xl shadow-neutral-200 active:scale-95"
                >
                  {isCreating ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                  {isCreating ? '正在生成智能排期并创立项目...' : '确认创立并推入工作流'}
                </button>
            </div>
          </motion.div>
        )}
        
        {/* Action Bar (Removed original) */}
        {/*`;

strategyCode = strategyCode.replace(actionBarRegex, projectConfigUI);

// Comment out the old action bar up to the end of the div
const endActionBarRegex = /<Check size=\{18\}\/> \{selectedTopic !== null \? \`将选定打法推入工作流\` : '请先勾选核心选题'\}\s*<\/button>\s*<\/div>/;
strategyCode = strategyCode.replace(endActionBarRegex, `*/}`);

fs.writeFileSync('src/components/rings/Strategy.tsx', strategyCode);

let matrixCode = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// Matrix UI changes: Remove "isCreatingProject". Just completely redirect the "PlusCircle" button.

const createBtnRegex = /onClick=\{.*?setIsCreatingProject.*?\}[\s\S]*?<PlusCircle size=\{18\} \/>.*?\n\s*<\/button>/;
matrixCode = matrixCode.replace(createBtnRegex, `onClick={() => window.dispatchEvent(new CustomEvent('nav-to-strategy'))}
          className="w-full py-4 bg-white border border-dashed border-neutral-200 rounded-[20px] text-[13px] text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> 返回策略页进行新项目立项
        </button>`);

// We also need to strip out the whole Create Project Modal from Matrix, or just ignore it.
// To be safe, we can leave the modal code but it won't be triggered, or we can just replace its invocation.
// It's governed by `isCreatingProject &&`. If we don't set it to true, it won't render. 

fs.writeFileSync('src/pages/MerchantMatrix.tsx', matrixCode);

console.log("Patched Strategy.tsx and MerchantMatrix.tsx");
