import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// Remove `pic: "...",` from MOCK_PROJECTS
content = content.replace(/\s*pic:\s*"[^"]+",\n/g, '\n');

// Find where "负责人：" is rendered and remove it
content = content.replace(/<div><span className="text-neutral-400">负责人：<\/span><strong className="text-neutral-800">\{currentProject\.pic\}<\/strong><\/div>/g, '');

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
