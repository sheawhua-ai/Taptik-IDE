const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

// Global replacements for specific strings
content = content.replace(/第三方 KOC/g, '泛素人分发');
content = content.replace(/客户 KOC/g, '真实客户快发');

// Also fix the recommendations/issues if they still have old terms, wait, I already did that, but let's check
fs.writeFileSync(file, content);
console.log("Success fix matrix");
