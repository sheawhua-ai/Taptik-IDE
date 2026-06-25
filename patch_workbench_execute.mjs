import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const oldExecute = `  const handleExecute = (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setSelectedShortcut(null);`;

const newExecute = `  const handleExecute = (customQuery?: string) => {
    let finalQuery = customQuery || query;
    
    // If a shortcut is selected, prepend it if it's a skill without pre-filled action
    if (selectedShortcut && !customQuery) {
      if (selectedShortcut.action === '') {
        finalQuery = \`[\${selectedShortcut.name}] \${finalQuery}\`.trim();
      } else if (!finalQuery.includes(selectedShortcut.name) && !finalQuery.includes(selectedShortcut.action)) {
        // Just in case it was modified heavily
        finalQuery = \`[\${selectedShortcut.name}] \${finalQuery}\`.trim();
      }
    }
    
    if (!finalQuery.trim()) {
      // Allow execution if we just have a shortcut but no query text
      if (selectedShortcut && selectedShortcut.action === '') {
        finalQuery = \`执行技能：\${selectedShortcut.name}\`;
      } else {
        return;
      }
    }

    setSelectedShortcut(null);`;

content = content.replace(oldExecute, newExecute);

fs.writeFileSync('src/components/Workbench.tsx', content);
