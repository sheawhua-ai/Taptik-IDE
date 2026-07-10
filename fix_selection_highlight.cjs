const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

code = code.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useRef } from 'react';"
);

code = code.replace(
  "const [activeNoteId, setActiveNoteId] = useState('n1');",
  "const contentRef = useRef<HTMLDivElement>(null);\n  const [activeNoteId, setActiveNoteId] = useState('n1');"
);

const oldHandleSelection = `  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      setTextSelection({
        text: selection.toString(),
        start: range.startOffset,
        end: range.endOffset
      });
      setActiveRightTab('local_edit');
    } else {
      setTextSelection(null);
    }
  };`;

const newHandleSelection = `  const clearHighlight = () => {
    if (contentRef.current) {
      const oldMarks = contentRef.current.querySelectorAll('.local-edit-highlight');
      oldMarks.forEach(mark => {
        const textNode = document.createTextNode(mark.textContent || '');
        mark.parentNode?.replaceChild(textNode, mark);
      });
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      clearHighlight();
      const text = selection.toString();
      const range = selection.getRangeAt(0);
      const mark = document.createElement('mark');
      mark.className = 'bg-primary-600 text-white local-edit-highlight';
      try {
        range.surroundContents(mark);
        selection.removeAllRanges();
      } catch (e) {
        console.warn("Could not surround text with highlight", e);
      }
      setTextSelection({
        text: text,
        start: range.startOffset,
        end: range.endOffset
      });
      setActiveRightTab('local_edit');
    } else if (contentRef.current && !contentRef.current.contains(selection?.anchorNode)) {
      // do nothing if selecting outside
    } else {
      clearHighlight();
      setTextSelection(null);
    }
  };`;

code = code.replace(oldHandleSelection, newHandleSelection);

const oldDiv = `                      onClick={() => { setActiveArea('content'); setActiveRightTab('issues'); }}
                      dangerouslySetInnerHTML={{__html: activeNote.content}}`;

const newDiv = `                      onClick={() => { setActiveArea('content'); setActiveRightTab('issues'); }}
                      ref={contentRef}
                      dangerouslySetInnerHTML={{__html: activeNote.content}}`;

code = code.replace(oldDiv, newDiv);

// Also need to handle clear highlight when closing local edit, 
// for example if they click "取消" in local edit.
// Wait, local edit doesn't have an explicit Cancel? Let's check local edit tab.
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
