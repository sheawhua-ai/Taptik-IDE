const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

code = code.replace(
  "onClick={() => { setLocalEditResult(null); setTextSelection(null); }}",
  "onClick={() => { setLocalEditResult(null); setTextSelection(null); clearHighlight(); setActiveRightTab('issues'); }}"
);

code = code.replace(
  "className=\"w-full bg-white border border-rose-200 text-rose-600 py-2.5 rounded-xl text-[12px] font-bold hover:bg-rose-50 transition-colors\"",
  "className=\"w-full bg-white border border-rose-200 text-rose-600 py-2.5 rounded-xl text-[12px] font-bold hover:bg-rose-50 transition-colors\"\n                            onClick={() => { setLocalEditResult(null); setTextSelection(null); clearHighlight(); setActiveRightTab('issues'); }}"
);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
