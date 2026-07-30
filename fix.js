const fs = require('fs');
let code = fs.readFileSync('src/components/merchant/ExecutionCenter.tsx', 'utf8');

// The file has a lot of content compressed into one line at the end.
// Let's use prettier to format it first so we can see what's wrong.
