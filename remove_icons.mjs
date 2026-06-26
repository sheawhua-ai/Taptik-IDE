import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

content = content.replace(/<Settings2 size=\{14\} \/> 调整/g, '调整');
content = content.replace(/<Sparkles size=\{14\} className="text-indigo-500" \/> 调整/g, '调整');

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);
