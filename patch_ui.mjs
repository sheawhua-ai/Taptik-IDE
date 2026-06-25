import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const regex = /\{\/\* Shortcuts Bar \*\/\}[\s\S]*?<\/div>/;

const newShortcutsUI = `{/* Shortcuts Bar */}
  <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar px-2">
  {selectedShortcut && selectedShortcut.contexts && selectedShortcut.contexts.length > 0 ? (
    selectedShortcut.contexts.map((context: any) => (
      <button
        key={context.id}
        onClick={() => {
          setQuery(context.action);
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
        className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 shadow-sm text-neutral-700 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 text-[13px] rounded-xl transition-all shrink-0"
      >
        <FileText size={14} className="text-neutral-400" />
        {context.name}
      </button>
    ))
  ) : (
    QUICK_SHORTCUTS.map(shortcut => (
      <button
        key={shortcut.id}
        onClick={() => {
          setSelectedShortcut(shortcut);
          setQuery(''); // When clicking the blue tag, we just select the shortcut (add tag), and don't fill text yet
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
        className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[13px] rounded-lg transition-colors shrink-0"
      >
        {shortcut.name}
        <ArrowDownRight size={14} className="text-neutral-400" />
      </button>
    ))
  )}
  </div>`;

content = content.replace(regex, newShortcutsUI);
fs.writeFileSync('src/components/Workbench.tsx', content);
