const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const originalHandle = `  const handleSelection = () => {
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

const newHandle = `  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      clearHighlight();
      const text = selection.toString();
      
      // Use execCommand to safely apply background color even across elements
      contentRef.current.focus();
      if (!document.execCommand('hiliteColor', false, '#fef08a')) { // yellow-200
        document.execCommand('backColor', false, '#fef08a');
      }
      
      selection.removeAllRanges();
      
      setTextSelection({
        text: text,
        start: 0,
        end: 0
      });
      setActiveRightTab('local_edit');
    } else if (contentRef.current && !contentRef.current.contains(selection?.anchorNode)) {
      // do nothing if selecting outside
    } else {
      clearHighlight();
      setTextSelection(null);
    }
  };`;

code = code.replace(originalHandle, newHandle);

const originalClear = `  const clearHighlight = () => {
    if (contentRef.current) {
      const oldMarks = contentRef.current.querySelectorAll('.local-edit-highlight');
      oldMarks.forEach(mark => {
        const textNode = document.createTextNode(mark.textContent || '');
        mark.parentNode?.replaceChild(textNode, mark);
      });
    }
  };`;

const newClear = `  const clearHighlight = () => {
    if (contentRef.current) {
      // The most reliable way to clear execCommand styles is to reset the innerHTML to the clean state
      const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];
      if (currentNote) {
        contentRef.current.innerHTML = currentNote.content;
      }
    }
  };`;

code = code.replace(originalClear, newClear);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
