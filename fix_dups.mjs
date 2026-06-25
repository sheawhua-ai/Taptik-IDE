import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

// I will just use regex to remove everything from the second \`const handleExecute = \` to the end of its function, and also the second \`handleToggleProgress\` and \`handleConfirmExecute\`.
// Instead of complex regex, let me read the file, split by lines, and remove the duplicated parts.

const lines = content.split('\\n');

let handleExecuteCount = 0;
let inDuplicateBlock = false;

let newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('const handleToggleProgress =')) {
    if (handleExecuteCount === 0) {
      handleExecuteCount++;
    } else {
      inDuplicateBlock = true;
    }
  }

  if (line.includes('const handleExecute =')) {
    handleExecuteCount++;
    if (handleExecuteCount > 1) {
      inDuplicateBlock = true;
    }
  }
  
  if (inDuplicateBlock) {
    if (line.includes('const handleToggleProgress') && handleExecuteCount > 1) {
        // still in duplicate block
    }
    // Check if we reached the end of the duplicate block
    if (line === '  return (' || line.includes('return (') && line.includes('<div className="flex-1 flex overflow-hidden relative bg-neutral-50/30">')) {
      inDuplicateBlock = false;
      newLines.push(line);
      continue;
    }
    continue;
  }
  
  newLines.push(line);
}

fs.writeFileSync('src/components/Workbench.tsx', newLines.join('\\n'));
