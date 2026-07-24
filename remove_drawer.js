import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const startStr = '  const renderCreateProjectDrawer = () => {';
const endStr = '  const renderDrawerContent = () => {';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
  // Remove case statement
  content = content.replace('      case "create_project":\n        return renderCreateProjectDrawer();\n', '');
  fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
  console.log("Removed function and case statement");
} else {
  console.log("Could not find start or end.", startIdx, endIdx);
}
