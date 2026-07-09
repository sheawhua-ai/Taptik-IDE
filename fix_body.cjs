const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const target = `              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {selectedTask.type === '内容确认' && (
                  <div className="flex-1 flex flex-col h-full -m-8">`;

const replace = `              {/* Body */}
              <div className={\`flex-1 \${selectedTask.type === '内容确认' ? 'flex flex-col min-h-0 overflow-hidden' : 'overflow-y-auto p-8 space-y-8'} custom-scrollbar\`}>
                {selectedTask.type === '内容确认' && (
                  <div className="flex-1 flex flex-col h-full">`;

if(code.includes(target)) {
    code = code.replace(target, replace);
    fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
    console.log("Fixed ExecutionResult Body scroll");
} else {
    console.log("Could not find target block in ExecutionResult.tsx");
}
