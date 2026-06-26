import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add state
content = content.replace(
  /const \[hasData, setHasData\] = useState\(false\);/,
  `const [hasData, setHasData] = useState(false);\n  const [showGlobalQueue, setShowGlobalQueue] = useState(false);`
);

// Update button
content = content.replace(
  /onClick=\{\(\) => setWorkflowTab\("interaction"\)\}/,
  `onClick={() => setShowGlobalQueue(true)}`
);

// Add the drawer Component inside App component, before return
const queueDrawer = `
  {showGlobalQueue && (
    <div className="fixed inset-0 bg-neutral-900/20 z-50 flex justify-end">
       <div className="w-1/2 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
         <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
           <h3 className="font-bold text-neutral-900 text-[16px]">全局待处理队列</h3>
           <button onClick={() => setShowGlobalQueue(false)} className="p-2 hover:bg-neutral-100 rounded-full">
             <X size={18} className="text-neutral-500" />
           </button>
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => { setShowGlobalQueue(false); setWorkflowTab('execution'); }}>
               <div className="font-medium">内容待确认</div>
               <div className="text-[20px] font-bold">3</div>
            </div>
            <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => { setShowGlobalQueue(false); setWorkflowTab('execution'); }}>
               <div className="font-medium">素材待补齐</div>
               <div className="text-[20px] font-bold">4</div>
            </div>
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => { setShowGlobalQueue(false); setWorkflowTab('execution'); }}>
               <div className="font-medium">内部任务待派发</div>
               <div className="text-[20px] font-bold">2</div>
            </div>
            <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl border border-indigo-100 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => { setShowGlobalQueue(false); setWorkflowTab('execution'); }}>
               <div className="font-medium">外部入口待生成</div>
               <div className="text-[20px] font-bold">3</div>
            </div>
            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100 flex items-center justify-between cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => { setShowGlobalQueue(false); setWorkflowTab('interaction'); }}>
               <div className="font-medium">素材待验收</div>
               <div className="text-[20px] font-bold">2</div>
            </div>
            <div className="bg-purple-50 text-purple-700 p-4 rounded-xl border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => { setShowGlobalQueue(false); setWorkflowTab('interaction'); }}>
               <div className="font-medium">客户审核待回收</div>
               <div className="text-[20px] font-bold">1</div>
            </div>
         </div>
       </div>
    </div>
  )}
`;

content = content.replace(/\{\/\* Agent Layout \*\/\}/, queueDrawer + '\n      {/* Agent Layout */}');

fs.writeFileSync('src/App.tsx', content);
