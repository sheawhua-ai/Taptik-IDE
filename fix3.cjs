const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button className="px-6 py-3\.5 bg-neutral-900 text-white rounded-xl text-\[14px\] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2">[\s\S]*?进入商家运营流[\s\S]*?<\/button>/,
  `<button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'matrix' } }))} className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2">进入商家运营流 <ArrowRight size={16} /></button>`
);

content = content.replace(
  /<button className="px-5 py-3\.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-\[14px\] font-bold hover:bg-neutral-50 transition-colors">\s*先处理内容确认\s*<\/button>/,
  `<button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'content' } }))} className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">先处理内容确认</button>`
);

content = content.replace(
  /<button className="px-5 py-3\.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-\[14px\] font-bold hover:bg-neutral-50 transition-colors">\s*先补齐素材\s*<\/button>/,
  `<button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'interaction' } }))} className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">先补齐素材</button>`
);

fs.writeFileSync(file, content);
console.log('fix3 done');
