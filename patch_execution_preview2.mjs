import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

content = content.replace(/<Settings2 size=\{14\} \/> 协同调整/g, '<Settings2 size={14} /> 调整');
content = content.replace(/<Sparkles size=\{14\} className="text-indigo-500" \/> 协同调整/g, '<Sparkles size={14} className="text-indigo-500" /> 调整');

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);
