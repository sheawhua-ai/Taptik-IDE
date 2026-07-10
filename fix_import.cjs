const fs = require('fs');
let code = fs.readFileSync('src/components/rings/InteractionWorkbench.tsx', 'utf8');

code = code.replace(
  "  MoreHorizontal",
  "  MoreHorizontal,\n  ListChecks"
);

fs.writeFileSync('src/components/rings/InteractionWorkbench.tsx', code);
