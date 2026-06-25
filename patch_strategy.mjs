import fs from 'fs';

let content = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf-8');

const regex = /\{\/\* 1\. 顶部：商家上下文记忆条 \*\/\}\s*<div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">[\s\S]*?<\/div>\s*\{\/\* 2\. 中间核心：今日操盘建议卡 \*\/\}/;
content = content.replace(regex, "{/* 2. 中间核心：今日操盘建议卡 */}");

fs.writeFileSync('src/components/rings/Strategy.tsx', content);
