const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

code = code.replace(
  /<span className="text-neutral-400">8<\/span>/g,
  '<span className="text-neutral-400">{notes.filter(n => !n.isReviewed).length}</span>'
);

code = code.replace(
  /<div className="text-\[11px\] font-bold text-neutral-500 mb-2 mt-1">KOS员工号 \(3\)<\/div>/g,
  '<div className="text-[11px] font-bold text-neutral-500 mb-2 mt-1">KOS员工号 ({notes.filter(n => !n.isReviewed && n.accountType === "KOS员工号").length})</div>'
);

code = code.replace(
  /<div className="text-\[11px\] font-bold text-neutral-500 mb-2 mt-3">品牌主账号 \(2\)<\/div>/g,
  '<div className="text-[11px] font-bold text-neutral-500 mb-2 mt-3">品牌主账号 ({notes.filter(n => !n.isReviewed && n.accountType === "品牌主账号").length})</div>'
);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
