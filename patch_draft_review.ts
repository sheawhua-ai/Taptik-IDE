import fs from 'fs';

let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// 1. Add selectedAssets state
if (!content.includes('selectedAssets')) {
  content = content.replace(
    /const \[showAssetLibrary, setShowAssetLibrary\] = useState\(false\);/,
    `const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);`
  );
  
  if (!content.includes('Check,')) {
    content = content.replace('PlusCircle, Target', 'PlusCircle, Target, Check');
  }
}

// 2. Replace the Asset Library Modal content
const assetRegex = /<div className="p-4 flex-1 overflow-y-auto bg-neutral-50">\s*<div className="grid grid-cols-3 gap-4">[\s\S]*?<\/div>\s*<\/div>/g;

const newAssetContent = `<div className="p-4 flex-1 overflow-y-auto bg-neutral-50 custom-scrollbar">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} onClick={() => setSelectedAssets(prev => prev.includes(i) ? prev.filter(a => a !== i) : [...prev, i])} className={\`bg-white p-2 rounded-xl border \${selectedAssets.includes(i) ? 'border-primary-500 shadow-md ring-2 ring-primary-500/20' : 'border-neutral-200 shadow-sm'} group cursor-pointer hover:border-primary-400 transition-all\`}>
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative mb-2">
                        <img src={\`https://images.unsplash.com/photo-16000000000\${i + 5}?auto=format&fit=crop&q=80&w=400&h=600\`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="素材" />
                        {i <= 3 && (
                          <div className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm shadow-sm flex items-center gap-1">
                            <CheckCircle2 size={10} /> AI推荐(1~3张)
                          </div>
                        )}
                        <div className={\`absolute top-2 right-2 w-5 h-5 rounded-full border border-white/40 flex items-center justify-center \${selectedAssets.includes(i) ? 'bg-primary-500 border-primary-500 text-white' : 'bg-black/20 text-transparent'}\`}>
                           {selectedAssets.includes(i) && <Check size={12} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 bg-white flex justify-end gap-3 shrink-0">
                 <button onClick={() => setShowAssetLibrary(false)} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">取消</button>
                 <button onClick={() => {
                   setToastMessage(\`成功获取并应用了 \${selectedAssets.length} 张素材\`);
                   setTimeout(() => setToastMessage(""), 2000);
                   setShowAssetLibrary(false);
                   setSelectedAssets([]);
                 }} disabled={selectedAssets.length === 0} className={\`px-6 py-2.5 rounded-xl text-[14px] font-medium text-white transition-colors flex items-center gap-2 \${selectedAssets.length === 0 ? 'bg-neutral-300 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 shadow-md'}\`}>确认选择 {selectedAssets.length > 0 && \`(\${selectedAssets.length})\`}</button>
              </div>`;

content = content.replace(assetRegex, newAssetContent);

// 3. Subagent Chat replacement in "Draft Review Modal"
// Find the Status Config parts
const statusConfigRegex = /\{\/\* Status Config \*\/\}[\s\S]*?<div className="w-full xl:w-\[280px\] bg-white border-l border-neutral-200 p-6 flex flex-col justify-end shrink-0 block">\s*<button onClick=\{\(\) => setReviewingDraft\(null\)\} className="w-full py-4 bg-primary-500 text-white rounded-\[14px\] text-\[15px\] hover:bg-primary-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2 mb-3">\s*确认人工精修无误 <CheckCircle2 size=\{18\} \/>\s*<\/button>\s*<\/div>/g;

const newSubagentChat = `{/* Right: Subagent Chat */} 
          <div className="w-full xl:w-[320px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
             <div className="h-14 border-b border-neutral-100 flex items-center gap-2 px-4 shrink-0 bg-neutral-50/50">
               <Bot size={18} className="text-primary-500" />
               <span className="text-[14px] font-medium text-neutral-900">AI 内容运营专家</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 text-[13px]">
               <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0"><Bot size={16}/></div>
                 <div className="bg-neutral-100 rounded-2xl rounded-tl-sm p-3 text-neutral-700 leading-relaxed shadow-sm">
                   您好！我是AI内容专家。需要修改此篇笔记的排版、文案语料或提取爆款词吗？点击左侧内容，我将为您提供针对性建议。
                 </div>
               </div>
             </div>

             <div className="p-4 border-t border-neutral-100 bg-white space-y-3 shrink-0">
                <input type="text" placeholder="输入你想调整的要求..." className="w-full bg-neutral-100 border-none rounded-xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
                <button onClick={() => setReviewingDraft(null)} className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-neutral-800 transition-colors shadow-md active:scale-95 flex justify-center items-center gap-2">
                  完成修改并保存 <CheckCircle2 size={16} />
                </button>
             </div>
          </div>`;

content = content.replace(statusConfigRegex, newSubagentChat);

// 4. Add onClick to PlusCircle "添加笔记素材" 
const plusCircleContainerRegex = /<div className="w-\[140px\] h-\[180px\] rounded-2xl border border-dashed border-neutral-300 bg-white relative shrink-0 flex flex-col gap-2 items-center justify-center hover:bg-neutral-50 cursor-pointer transition-colors text-neutral-400 hover:text-neutral-600">/g;

content = content.replace(plusCircleContainerRegex, '<div onClick={handleReplaceFromLibrary} className="w-[140px] h-[180px] rounded-2xl border border-dashed border-neutral-300 bg-white relative shrink-0 flex flex-col gap-2 items-center justify-center hover:bg-neutral-50 cursor-pointer transition-colors text-neutral-400 hover:text-neutral-600">');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);

console.log('Patched review draft modal successfully');
