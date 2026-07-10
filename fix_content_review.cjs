const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

// Add isReviewed: false to n1 and n2
code = code.replace(/canBatchConfirm: false,/g, 'canBatchConfirm: false, isReviewed: false,');
code = code.replace(/canBatchConfirm: true,/g, 'canBatchConfirm: true, isReviewed: false,');

// Add showReviewed state
code = code.replace(/const \[notes, setNotes\] = useState/g, 'const [showReviewed, setShowReviewed] = useState(false);\n  const [notes, setNotes] = useState');

// Handle approve
const approveCode = `
  const handleApprove = () => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, isReviewed: true } : n));
    const nextUnreviewed = notes.find(n => n.id !== activeNoteId && !n.isReviewed);
    if (nextUnreviewed) {
      setActiveNoteId(nextUnreviewed.id);
    }
  };
`;
code = code.replace(/const activeNote = /g, approveCode + '\n  const activeNote = ');

// Edit bottom bar
const oldBottomBar = `<div className="flex items-center gap-3">
               <button className="px-4 py-2.5 text-neutral-500 hover:bg-neutral-100 text-[13px] font-bold rounded-lg transition-colors">
                 跳过
               </button>
               <button className="px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-[13px] font-bold rounded-lg transition-colors border border-rose-100">
                 退回重写
               </button>
               <button className="px-4 py-2.5 text-neutral-500 hover:bg-neutral-100 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1">
                 更多 <ChevronRight size={14} className="rotate-90"/>
               </button>
             </div>`;
const newBottomBar = `<div className="flex items-center gap-3">
             </div>`;
code = code.replace(oldBottomBar, newBottomBar);

// Edit approve buttons
code = code.replace(
  /<button className="px-6 py-2.5 bg-amber-500 text-white text-\[13px\] font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2">[\s\S]*?确认风险并通过 <ChevronRight size={16} \/>[\s\S]*?<\/button>/g,
  `<button onClick={handleApprove} className="px-6 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                   确认审核并查看下一篇 <ChevronRight size={16} />
                 </button>`
);

code = code.replace(
  /<button className="px-6 py-2.5 bg-neutral-900 text-white text-\[13px\] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">[\s\S]*?审核通过并查看下一篇 <ChevronRight size={16} \/>[\s\S]*?<\/button>/g,
  `<button onClick={handleApprove} className="px-6 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                   确认审核并查看下一篇 <ChevronRight size={16} />
                 </button>`
);

// We need to modify the left list to filter by !isReviewed and add an accordion for isReviewed
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
