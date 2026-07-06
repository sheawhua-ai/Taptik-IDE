const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\[&::-webkit-inner-spin-button\]:appearance-none/g, '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]');

fs.writeFileSync(file, content);
console.log('fix4 done');
