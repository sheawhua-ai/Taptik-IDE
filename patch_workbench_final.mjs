import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

// Replace the selected shortcut badge style
content = content.replace(
  '<div className="flex items-center gap-1.5 bg-neutral-900 text-white px-2.5 py-1 rounded-md text-[13px] shrink-0">',
  '<div className="flex items-center gap-1.5 bg-primary-50 text-primary-600 border border-primary-100 px-2.5 py-1 rounded-lg text-[13px] shadow-sm shrink-0 font-medium">'
);
content = content.replace(
  /<button \s*onClick=\{\(\) => \{\s*setSelectedShortcut\(null\);\s*setQuery\(''\);\s*if \(textareaRef\.current\) \{\s*textareaRef\.current\.style\.height = 'auto';\s*\}\s*\}\} \s*className="hover:text-neutral-300 ml-1"\s*>/,
  `<button 
            onClick={() => {
              setSelectedShortcut(null);
              setQuery('');
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
              }
            }} 
            className="hover:text-primary-800 ml-1 opacity-60 hover:opacity-100 transition-opacity"
          >`
);
content = content.replace(
  '<PieChart size={14} />',
  '<PieChart size={14} className="text-primary-500" />'
);

// Replace attach menu skill onClick
const targetClick = `onClick={() => { setQuery(skill.name); setIsAttachMenuOpen(false); }}`;
const newClick = `onClick={() => { 
                  setSelectedShortcut({ id: skill.id, name: skill.name, action: '' }); 
                  setIsAttachMenuOpen(false); 
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}`;
content = content.replace(targetClick, newClick);

fs.writeFileSync('src/components/Workbench.tsx', content);
