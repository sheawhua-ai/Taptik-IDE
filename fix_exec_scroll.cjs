const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const target1 = `<div className="w-2/3 p-6 bg-white flex flex-col h-full overflow-hidden relative">`;
const replace1 = `<div className="w-2/3 p-6 bg-white flex flex-col h-full overflow-y-auto custom-scrollbar relative">`;
code = code.replace(target1, replace1);

const target2 = `<div className="space-y-4 flex-1 flex flex-col min-h-0">`;
const replace2 = `<div className="space-y-4 flex-1 flex flex-col min-h-[400px]">`;
code = code.replace(target2, replace2);

const target3 = `className="w-full flex-1 text-[14px] text-neutral-700 leading-relaxed p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors resize-none custom-scrollbar"`;
const replace3 = `className="w-full flex-1 min-h-[240px] text-[14px] text-neutral-700 leading-relaxed p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors resize-none custom-scrollbar"`;
code = code.replace(target3, replace3);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log("Done");
