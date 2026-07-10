const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

// 1. Make top items clickable and remove the right buttons
const oldTop = `<div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-600">可批量确认 <strong className="text-neutral-900">8</strong></span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-neutral-600">需逐篇审核 <strong className="text-neutral-900">3</strong></span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-neutral-600">事实待核实 <strong className="text-neutral-900">1</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
              <span>缺账号角色 0</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setShowBatchConfirm(true)} className="px-4 py-2 border border-neutral-200 text-neutral-700 bg-white rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
            批量确认 8 篇
          </button>
          <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
            从需逐篇审核开始
          </button>
        </div>`;

const newTop = `<div className="flex items-center gap-4 text-[13px]">
            <div onClick={() => setShowBatchConfirm(true)} className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-600">可批量确认 <strong className="text-neutral-900">8</strong></span>
            </div>
            <div onClick={() => setShowBatchConfirm(false)} className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-neutral-600">需逐篇审核 <strong className="text-neutral-900">3</strong></span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-neutral-600">事实待核实 <strong className="text-neutral-900">1</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
              <span>缺账号角色 0</span>
            </div>
          </div>
        </div>`;
code = code.replace(oldTop, newTop);

// 2. Modify handleSelection to auto switch tab
const oldHandleSelection = `      setTextSelection({
        text: selection.toString(),
        start: range.startOffset,
        end: range.endOffset
      });
      // Do not auto switch yet, show tooltip first
    } else {`;
const newHandleSelection = `      setTextSelection({
        text: selection.toString(),
        start: range.startOffset,
        end: range.endOffset
      });
      setActiveRightTab('local_edit');
    } else {`;
code = code.replace(oldHandleSelection, newHandleSelection);

// 3. Remove inline selection tooltip
const tooltipRegex = /\{\/\* Inline Selection Tooltip \*\/\}[\s\S]*?<\/AnimatePresence>/;
code = code.replace(tooltipRegex, '');

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
