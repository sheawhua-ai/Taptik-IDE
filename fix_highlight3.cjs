const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldHandle = `      // Use execCommand to safely apply background color even across elements
      contentRef.current.focus();
      if (!document.execCommand('hiliteColor', false, '#fef08a')) { // yellow-200
        document.execCommand('backColor', false, '#fef08a');
      }`;

const newHandle = `      // Use execCommand to safely apply background color even across elements
      if (!document.execCommand('hiliteColor', false, '#fef08a')) { // yellow-200
        document.execCommand('backColor', false, '#fef08a');
      }`;

code = code.replace(oldHandle, newHandle);
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
