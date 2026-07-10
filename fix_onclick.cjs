const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

code = code.replace(
  "onClick={() => { setActiveArea('content'); setActiveRightTab('issues'); }}",
  "onClick={() => { setActiveArea('content'); if (!window.getSelection()?.toString().trim()) { setActiveRightTab('issues'); } }}"
);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
