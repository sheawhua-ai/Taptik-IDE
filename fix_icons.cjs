const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');
code = code.replace(/ListChecks/g, 'ListChecks, Search');
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
