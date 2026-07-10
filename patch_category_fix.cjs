const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const search = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tasksInCategory.map(task => (`;

const replace = `{tasksInCategory.length === 0 ? (
                  <div className="bg-white border border-neutral-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-[280px]">
                    <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-3">
                       <Check size={20} className="text-neutral-300" />
                    </div>
                    <div className="text-[14px] font-bold text-neutral-900 mb-1">当前无任务</div>
                    <div className="text-[13px] text-neutral-500">该环节暂无需要处理的待办事项</div>
                  </div>
                ) : (
                <div className="grid grid-cols-1 gap-4">
                  {tasksInCategory.map(task => (`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log('Fixed ternary block');
