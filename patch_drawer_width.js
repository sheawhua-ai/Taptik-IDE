import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const target = `className="absolute right-0 top-0 bottom-0 w-[420px] bg-white shadow-[calc(-10px)_0_30px_rgba(0,0,0,0.05)] border-l border-neutral-200 z-50 flex flex-col"`;
const replacement = `className={\`absolute right-0 top-0 bottom-0 \${drawerType === 'create_project' ? 'w-[calc(100%-300px)]' : 'w-[420px]'} bg-white shadow-[calc(-10px)_0_30px_rgba(0,0,0,0.05)] border-l border-neutral-200 z-50 flex flex-col\`}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
