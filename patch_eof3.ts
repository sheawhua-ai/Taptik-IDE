import fs from 'fs';
let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

let newContent = content.substring(0, content.lastIndexOf('</motion.div>'));
// then find where the AnimatePresence ends
let regex = /<\/AnimatePresence>\s*<\/div>\s*<\/div>\s*<\/>\s*\);\s*}/;
newContent = content.replace(regex, '</AnimatePresence>\n  );\n}\n');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', newContent);
