import fs from 'fs';
let content = fs.readFileSync('src/components/rings/ContentProduction.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/components/rings/ContentProduction.tsx', content);