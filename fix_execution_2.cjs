const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const t4Regex = /\{\s*id: "t4"[^}]+\},\n\s*/g;
code = code.replace(t4Regex, '');

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log("Removed t4 successfully");
