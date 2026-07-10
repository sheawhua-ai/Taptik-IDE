const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const regex = /  const handleSelection = \(\) => \{[\s\S]*?    \}\n  \};\n/m;

const newHandleSelection = `  const handleSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        const text = selection.toString();
        
        document.execCommand('hiliteColor', false, '#fef08a');
        if (!document.queryCommandState('hiliteColor')) {
           document.execCommand('backColor', false, '#fef08a');
        }
        
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
  };
`;

code = code.replace(regex, newHandleSelection);
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
