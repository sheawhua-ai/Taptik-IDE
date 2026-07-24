import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');
content = content.replace(/->/g, '→');
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
