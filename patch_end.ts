import fs from 'fs';
let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// Replace the end of the file starting with `</AnimatePresence>` that goes into `</div></div></>` 
// just with `</AnimatePresence></>);}`
let newContent = content.substring(0, content.lastIndexOf('</AnimatePresence>'));
newContent += '</AnimatePresence>\n</>\n);\n}\n';

// Add TargetIcon back
newContent += `
const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
`;

fs.writeFileSync('src/pages/MerchantMatrix.tsx', newContent);
