const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldHandle = `    } else {
      clearHighlight();
      setTextSelection(null);
    }`;

const newHandle = `    } else {
      clearHighlight();
      setTextSelection(null);
      // If we just clicked without selecting, go back to issues
      if (activeArea === 'content') {
        setActiveRightTab('issues');
      }
    }`;

code = code.replace(oldHandle, newHandle);

const oldOnClick = `onClick={() => { setActiveArea('content'); if (!window.getSelection()?.toString().trim()) { setActiveRightTab('issues'); } }}`;
const newOnClick = `onClick={() => { setActiveArea('content'); }}`;

code = code.replace(oldOnClick, newOnClick);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
