const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldHandle = `      // Do not remove range, let user see the selection briefly or leave it.
      // selection.removeAllRanges();`;

const newHandle = `      // Remove native selection so only our custom highlight remains
      selection.removeAllRanges();`;

code = code.replace(oldHandle, newHandle);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
