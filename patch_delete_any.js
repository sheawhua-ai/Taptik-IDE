import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// replace "{proj.id.startsWith('new-') && (" with just "{"
content = content.replace(/\{proj\.id\.startsWith\('new-'\) && \(/g, '{true && (');

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
