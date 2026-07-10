const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

// 1. Add import
if (!code.includes("import { InteractionWorkbench }")) {
  code = code.replace(
    "import { ContentReviewWorkbench } from './ContentReviewWorkbench';",
    "import { ContentReviewWorkbench } from './ContentReviewWorkbench';\nimport { InteractionWorkbench } from './InteractionWorkbench';"
  );
}

// 2. Render in AnimatePresence
const oldReviewRender = `{selectedTask && selectedTask.type === '内容审核' && (
          <ContentReviewWorkbench task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}`;
const newReviewRender = `{selectedTask && selectedTask.type === '内容审核' && (
          <ContentReviewWorkbench task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
        {selectedTask && selectedTask.type === '互动承接' && (
          <InteractionWorkbench task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}`;
code = code.replace(oldReviewRender, newReviewRender);

// 3. Update the Drawer condition so '互动承接' doesn't show in the Drawer
const oldDrawerCondition = `{selectedTask && selectedTask.type !== '内容审核' && (`;
const newDrawerCondition = `{selectedTask && selectedTask.type !== '内容审核' && selectedTask.type !== '互动承接' && (`;
code = code.replace(oldDrawerCondition, newDrawerCondition);

// 4. Update task metadata to "互动承接｜18条待处理" for t2
const oldT2Title = `title: "18 条高意向私信待分流"`;
const newT2Title = `title: "18 条互动待处理"`;
code = code.replace(oldT2Title, newT2Title);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log("ExecutionResult updated.");
