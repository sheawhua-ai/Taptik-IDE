const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

// Add import
const importToAdd = `import { ContentReviewWorkbench } from './ContentReviewWorkbench';\n`;
if (!code.includes('ContentReviewWorkbench')) {
  // Insert after the first few imports
  const lines = code.split('\n');
  const lastImportIndex = lines.findIndex(line => !line.startsWith('import '));
  lines.splice(lastImportIndex, 0, importToAdd);
  code = lines.join('\n');
}

// Modify the selectedTask condition
const oldRender = `{/* Task Detail Panel Overlay */}
      <AnimatePresence>
        {selectedTask && (
          <div className="absolute inset-0 z-50 flex justify-end">`;
          
const newRender = `{/* Task Detail Panel Overlay */}
      <AnimatePresence>
        {selectedTask && selectedTask.type === '内容审核' && (
          <ContentReviewWorkbench task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedTask && selectedTask.type !== '内容审核' && (
          <div className="absolute inset-0 z-50 flex justify-end">`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log('Workbench connected');
