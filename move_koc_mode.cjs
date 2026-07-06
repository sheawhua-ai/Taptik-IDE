const fs = require('fs');

// 1. Update Strategy.tsx
const strategyFile = 'src/components/rings/Strategy.tsx';
let strategyContent = fs.readFileSync(strategyFile, 'utf8');

const targetStr = `                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">风险边界 (系统预置)</label>`;

const kocModeHtml = `                  <div>
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
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 mb-2">风险边界 (系统预置)</label>`;

strategyContent = strategyContent.replace(targetStr, kocModeHtml);
fs.writeFileSync(strategyFile, strategyContent);


// 2. Update MerchantMatrix.tsx
const matrixFile = 'src/pages/MerchantMatrix.tsx';
let matrixContent = fs.readFileSync(matrixFile, 'utf8');

const kocToRemove = `                     {/* KOC 素材模式配置 */}
                     <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 space-y-3">
                       <div className="text-[12px] font-bold text-emerald-900 mb-1">配置 KOC 素材流转模式</div>
                       
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
                     </div>`;

if (matrixContent.includes(kocToRemove)) {
    matrixContent = matrixContent.replace(kocToRemove, `                     <div className="text-[12px] text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg font-medium">当前方案配置：KOC 领取任务时自行实拍回传</div>`);
    fs.writeFileSync(matrixFile, matrixContent);
    console.log("Updated both files");
} else {
    console.log("Could not find the KOC text in MerchantMatrix.tsx");
}

