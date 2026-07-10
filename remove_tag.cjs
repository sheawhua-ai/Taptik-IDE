const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const target = `<span className="px-2 py-1 bg-neutral-200 text-neutral-700 text-[11px] font-bold rounded">
                    正式笔记
                  </span>`;
code = code.replace(target, '');
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
console.log("Tag removed");
