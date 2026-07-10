const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const currentClear = `  const clearHighlight = () => {
    if (contentRef.current) {
      // By simply resetting the innerHTML to the original content, we clear any execCommand formatting.
      // We rely on dangerouslySetInnerHTML to keep it in sync, but if we mutated it, we force it back.
      const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];
      if (currentNote) {
        contentRef.current.innerHTML = currentNote.content;
      }
    }
  };`;

const originalClear = `  const clearHighlight = () => {
    if (contentRef.current) {
      const oldMarks = contentRef.current.querySelectorAll('.local-edit-highlight');
      oldMarks.forEach(mark => {
        const textNode = document.createTextNode(mark.textContent || '');
        mark.parentNode?.replaceChild(textNode, mark);
      });
    }
  };`;

code = code.replace(currentClear, originalClear);

const currentHandle = `  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      const text = selection.toString();
      
      // Clear previous
      clearHighlight();
      
      // Reselect the text to apply format, because clearHighlight might have destroyed the range
      // Actually we should apply format FIRST, then if they clear, we clear.
      // Wait, clearHighlight resets innerHTML, which kills the current selection range!
      // So we should NOT clearHighlight before execCommand if we want to format the current selection!
      
      // Ensure the contenteditable is focused so execCommand works reliably
      contentRef.current.focus();
      
      document.execCommand('hiliteColor', false, '#2563eb');
      document.execCommand('foreColor', false, '#ffffff');
      
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

code = code.replace(currentHandle, originalHandle);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
