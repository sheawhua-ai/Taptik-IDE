const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

code = code.replace(/#fef08a/g, '#bae6fd');

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
