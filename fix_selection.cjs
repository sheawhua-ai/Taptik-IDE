const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldHandleSelection = `  const handleSelection = () => {
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
      if (!document.execCommand('hiliteColor', false, '#bae6fd')) { // yellow-200
        document.execCommand('backColor', false, '#bae6fd');
      }
      
      // Save text selection
      setTextSelection({
        text: text,
        start: 0,
        end: 0
      });
      setActiveRightTab('local_edit');
      
      // Remove native selection so only our custom highlight remains
      window.getSelection()?.removeAllRanges();
    } else {
      clearHighlight();
      setTextSelection(null);
      // If we just clicked without selecting, go back to issues
      if (activeArea === 'content') {
        setActiveRightTab('issues');
      }
    }
  };`;

const newHandleSelection = `  const handleSelection = () => {
    // Delay slightly to let click events settle
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        const text = selection.toString();
        
        // Clear previous highlights by resetting HTML
        const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];
        // We shouldn't reset HTML here if we want to keep user edits, but for prototype it's fine.
        // Actually, let's just use execCommand which works without resetting HTML.
        
        document.execCommand('hiliteColor', false, '#fef08a');
        if (!document.queryCommandState('hiliteColor')) {
           document.execCommand('backColor', false, '#fef08a');
        }
        
        // Save text selection
        setTextSelection({
          text: text,
          start: 0,
          end: 0
        });
        setActiveRightTab('local_edit');
        setActiveArea('content');
      }
    }, 10);
  };
  
  const handleContentClick = () => {
    setActiveArea('content');
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      clearHighlight();
      setTextSelection(null);
      setActiveRightTab('issues');
    }
  };`;

code = code.replace(oldHandleSelection, newHandleSelection);

const oldOnClick = `onClick={() => { setActiveArea('content'); }}`;
code = code.replace(oldOnClick, `onClick={handleContentClick}`);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
