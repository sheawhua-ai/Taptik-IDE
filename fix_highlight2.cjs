const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldHandle = `  const handleSelection = () => {
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

const newHandle = `  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      const text = selection.toString();
      
      // We must clear previous highlights without destroying the current selection's DOM nodes.
      // Easiest is to remove the specific background color style applied by execCommand
      const marks = contentRef.current.querySelectorAll('[style*="background-color"]');
      marks.forEach(m => {
          m.style.backgroundColor = '';
      });

      // Use execCommand to safely apply background color even across elements
      contentRef.current.focus();
      if (!document.execCommand('hiliteColor', false, '#fef08a')) { // yellow-200
        document.execCommand('backColor', false, '#fef08a');
      }
      
      // Save text selection
      setTextSelection({
        text: text,
        start: 0,
        end: 0
      });
      setActiveRightTab('local_edit');
      
      // Do not remove range, let user see the selection briefly or leave it.
      // selection.removeAllRanges();
    } else if (contentRef.current && !contentRef.current.contains(selection?.anchorNode)) {
      // do nothing if selecting outside
    } else {
      clearHighlight();
      setTextSelection(null);
    }
  };`;

code = code.replace(oldHandle, newHandle);

const oldClear = `  const clearHighlight = () => {
    if (contentRef.current) {
      // The most reliable way to clear execCommand styles is to reset the innerHTML to the clean state
      const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];
      if (currentNote) {
        contentRef.current.innerHTML = currentNote.content;
      }
    }
  };`;

const newClear = `  const clearHighlight = () => {
    if (contentRef.current) {
      const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];
      if (currentNote) {
        contentRef.current.innerHTML = currentNote.content;
      }
    }
  };`;

code = code.replace(oldClear, newClear);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
