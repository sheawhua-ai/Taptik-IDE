import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const ShortcutsUI = \`
        {/* Shortcuts Bar */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar px-2">
          {QUICK_SHORTCUTS.map(shortcut => (
            <button
              key={shortcut.id}
              onClick={() => {
                setSelectedShortcut(shortcut);
                setQuery(shortcut.action);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
              className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[13px] rounded-lg transition-colors shrink-0"
            >
              {shortcut.name}
              <ArrowDownRight size={14} className="text-neutral-400" />
            </button>
          ))}
        </div>
\`;

content = content.replace(
  '<div className="bg-white p-2 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex items-center gap-3 pr-3 border border-neutral-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all text-neutral-900">',
  ShortcutsUI + '\\n<div className="bg-white p-2 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex items-end gap-3 pr-3 border border-neutral-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all text-neutral-900">'
);

// We changed items-center to items-end on the container because textarea height varies.

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
      placeholder={query || selectedShortcut ? '' : \`今天帮您做些什么？输入 \${SUGGESTIONS[placeholderIndex]}\`} 
      className="bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full placeholder:text-neutral-400 placeholder:transition-opacity pl-2 resize-none overflow-y-auto"
      rows={1}
      style={{ minHeight: '24px', maxHeight: '300px' }}
    />
  </div>
\`;

const targetString = '<div className="flex-1 relative h-12 flex items-center ">\n <input \n id="chat-input"\n value={query}\n onChange={(e) => setQuery(e.target.value)}\n onFocus={() => setIsInputFocused(true)}\n onBlur={() => setIsInputFocused(false)}\n onKeyDown={(e) => e.key === \'Enter\' && handleExecute()}\n placeholder={query ? \'\' : `今天帮您做些什么？输入 ${SUGGESTIONS[placeholderIndex]}`} \n className="absolute inset-0 bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full h-full placeholder:text-neutral-400 placeholder:transition-opacity pl-2"\n />\n </div>';

content = content.replace(targetString, InputBox);

fs.writeFileSync('src/components/Workbench.tsx', content);
