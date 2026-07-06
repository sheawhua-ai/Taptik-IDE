const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace indigo with rose
content = content.replace(/indigo/g, 'rose');

// replace "换一组方案" button with onClick action
content = content.replace(
  /<button className="mt-2 text-\[13px\] font-bold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-2 bg-white border border-neutral-200 py-4 rounded-3xl border-dashed hover:border-neutral-300 transition-colors">/g,
  '<button onClick={() => window.dispatchEvent(new CustomEvent(\'open-expert\', { detail: { expert: \'操盘副手\', context: \'除了现有的方案，还有其他适合的备选方向吗？\' }}))} className="mt-2 text-[13px] font-bold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-2 bg-white border border-neutral-200 py-4 rounded-3xl border-dashed hover:border-neutral-300 transition-colors">'
);

// Fix the inputs to be number and unit outside.
content = content.replace(
  /<input type="text" defaultValue="70%" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-\[13px\]" \/>/g,
  '<div className="relative"><input type="number" defaultValue={70} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-3 pr-8 py-2 text-[13px]" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">%</span></div>'
);
content = content.replace(
  /<input type="text" defaultValue="30%" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-\[13px\]" \/>/g,
  '<div className="relative"><input type="number" defaultValue={30} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-3 pr-8 py-2 text-[13px]" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">%</span></div>'
);
content = content.replace(
  /<input type="text" defaultValue="12 篇" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-\[13px\]" \/>/g,
  '<div className="relative"><input type="number" defaultValue={12} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-3 pr-8 py-2 text-[13px]" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>'
);
content = content.replace(
  /<input type="text" defaultValue="7 天" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-\[13px\]" \/>/g,
  '<div className="relative"><input type="number" defaultValue={7} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-3 pr-8 py-2 text-[13px]" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">天</span></div>'
);

content = content.replace(
  /<input type="text" defaultValue="3 篇" className="w-20 bg-white border border-neutral-200 rounded-md px-2 py-1 text-\[13px\] text-center" \/>/g,
  '<div className="relative w-20"><input type="number" defaultValue={3} className="w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>'
);
content = content.replace(
  /<input type="text" defaultValue="2 篇" className="w-20 bg-white border border-neutral-200 rounded-md px-2 py-1 text-\[13px\] text-center" \/>/g,
  '<div className="relative w-20"><input type="number" defaultValue={2} className="w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>'
);
content = content.replace(
  /<input type="text" defaultValue="4 篇" className="w-20 bg-white border border-neutral-200 rounded-md px-2 py-1 text-\[13px\] text-center" \/>/g,
  '<div className="relative w-20"><input type="number" defaultValue={4} className="w-full bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-1 text-[13px] text-center" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-[13px]">篇</span></div>'
);

fs.writeFileSync(file, content);
console.log('done');
