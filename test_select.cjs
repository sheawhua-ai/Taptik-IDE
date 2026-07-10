const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const importReact = `import React, { useState, useRef, useEffect } from 'react';`;
if (!code.includes('useEffect')) {
    code = code.replace(`import React, { useState, useRef } from 'react';`, importReact);
}

const htmlProp = `dangerouslySetInnerHTML={{__html: activeNote.content}}`;
code = code.replace(htmlProp, "");

const effectCode = `
  useEffect(() => {
    if (contentRef.current && activeNote) {
      if (!contentRef.current.innerHTML || contentRef.current.dataset.noteId !== activeNote.id) {
        contentRef.current.innerHTML = activeNote.content;
        contentRef.current.dataset.noteId = activeNote.id;
      }
    }
  }, [activeNote]);
`;

code = code.replace(`  const clearHighlight = () => {`, effectCode + `\n  const clearHighlight = () => {`);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
