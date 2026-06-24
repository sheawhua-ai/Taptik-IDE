import fs from 'fs';
let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regex = /  <\/div>\n  <\/div>\n\n  <\/>\n  \);\n}/g;
content = content.replace(regex, '  </>\n  );\n}');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);