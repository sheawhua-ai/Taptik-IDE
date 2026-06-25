import fs from 'fs';

const content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');
const lines = content.split('\\n');

const firstHandleToggle = lines.findIndex(l => l.includes('const handleToggleProgress ='));
const secondHandleToggle = lines.findIndex((l, i) => i > firstHandleToggle && l.includes('const handleToggleProgress ='));

if (secondHandleToggle !== -1) {
  const returnIndex = lines.findIndex((l, i) => i > secondHandleToggle && l.includes('return ('));
  lines.splice(secondHandleToggle, returnIndex - secondHandleToggle);
  fs.writeFileSync('src/components/Workbench.tsx', lines.join('\\n'));
  console.log('Fixed duplicates');
} else {
  console.log('No duplicates found');
}
