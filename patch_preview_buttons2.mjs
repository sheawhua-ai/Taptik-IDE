import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

// The arrays we injected last time
const arraysToReplace = [
  /\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"幼犬换粮避坑"\s*\},[\s\S]*?\]\.map\(opt => \([\s\S]*?<\/button>\s*\)\)\}/,
  /\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"素人 8 \/ 专业 4"\s*\},[\s\S]*?\]\.map\(opt => \([\s\S]*?<\/button>\s*\)\)\}/,
  /\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"自有号定向承接 \+ 外部随机领取池"\s*\},[\s\S]*?\]\.map\(opt => \([\s\S]*?<\/button>\s*\)\)\}/,
  /\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"进入待审核队列，并同步飞书项目群"\s*\},[\s\S]*?\]\.map\(opt => \([\s\S]*?<\/button>\s*\)\)\}/
];

const replacementButton = `
                <button className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">接受</button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: '调整判断' }))}
                  className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={14} className="text-indigo-500" /> 协同调整
                </button>
`;

arraysToReplace.forEach(regex => {
  content = content.replace(regex, replacementButton);
});

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);
