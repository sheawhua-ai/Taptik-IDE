import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const targetStart = '<div className="flex-1 relative h-12 flex items-center ">';
const targetEnd = '</div>';

const idxStart = content.indexOf(targetStart);
if (idxStart !== -1) {
  const idxEnd = content.indexOf(targetEnd, idxStart);
  if (idxEnd !== -1) {
    const toReplace = content.substring(idxStart, idxEnd + targetEnd.length);

    const InputBox = \`
  <div className="flex-1 relative flex flex-col min-h-[48px] justify-center py-2">
    {selectedShortcut && (
      <div className="flex mb-1 ml-2">
        <div className="flex items-center gap-1.5 bg-neutral-900 text-white px-2.5 py-1 rounded-md text-[13px] shrink-0">
          <PieChart size={14} />
          <span>{selectedShortcut.name}</span>
          <button 
            onClick={() => {
              setSelectedShortcut(null);
              setQuery('');
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
              }
            }} 
            className="hover:text-neutral-300 ml-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )}
    <textarea 
      ref={textareaRef}
      id="chat-input"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => setIsInputFocused(true)}
      onBlur={() => setIsInputFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleExecute();
          setSelectedShortcut(null);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }
      }}
      placeholder={query || selectedShortcut ? '' : "今天帮您做些什么？"} 
      className="bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full placeholder:text-neutral-400 placeholder:transition-opacity pl-2 resize-none overflow-y-auto"
      rows={1}
      style={{ minHeight: '24px', maxHeight: '300px' }}
    />
  </div>
\`;

    content = content.replace(toReplace, InputBox);
    fs.writeFileSync('src/components/Workbench.tsx', content);
    console.log("Successfully replaced");
  } else {
    console.log("targetEnd not found");
  }
} else {
  console.log("targetStart not found");
}
