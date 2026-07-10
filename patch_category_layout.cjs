const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

// 1. Grid layout for categories
code = code.replace(
  '<div className="max-w-6xl mx-auto space-y-10">',
  '<div className="max-w-6xl mx-auto grid grid-cols-1 2xl:grid-cols-2 gap-x-8 gap-y-10 items-start">'
);

// 2. Remove the empty return and handle empty state
const oldMapStart = `{categories.map(category => {
            const tasksInCategory = TASKS.filter(t => t.type === category);
            if (tasksInCategory.length === 0) return null;

            return (
              <div key={category} className="space-y-4">`;

const newMapStart = `{categories.map(category => {
            const tasksInCategory = TASKS.filter(t => t.type === category);

            return (
              <div key={category} className="space-y-4">`;
              
code = code.replace(oldMapStart, newMapStart);

// 3. Render empty state and change inner grid to 1 column
const oldInnerGrid = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tasksInCategory.map(task => (`;
                  
const newInnerGrid = `
                {tasksInCategory.length === 0 ? (
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
                  
code = code.replace(oldInnerGrid, newInnerGrid);

// 4. Close the ternary operator after the tasks map
const oldInnerGridEnd = `                      </div>
                    </div>
                  ))}
                </div>`;
                
const newInnerGridEnd = `                      </div>
                    </div>
                  ))}
                </div>
                )}`;
                
// Actually, let me check the exact ending string
