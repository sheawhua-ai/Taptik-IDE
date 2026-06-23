import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Hide the floating subagent chat when in 'matrix' (which contains tasks)
code = code.replace(/\{showSubagentChat && focusMode !== "review" && \(/g, '{showSubagentChat && focusMode !== "review" && workflowTab !== "matrix" && (');
code = code.replace(/\{!showSubagentChat && focusMode !== "review" && \(/g, '{!showSubagentChat && focusMode !== "review" && workflowTab !== "matrix" && (');

fs.writeFileSync('src/App.tsx', code);
