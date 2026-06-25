import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const targetStr = `  const handleExecute = (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setSelectedShortcut(null);`;

// Regex replacement ignoring whitespace
const regex = /const handleExecute = \(customQuery\?: string\) => \{\s*const finalQuery = customQuery \|\| query;\s*if \(\!finalQuery\.trim\(\)\) return;\s*setSelectedShortcut\(null\);/;

const newExecute = `const handleExecute = (customQuery?: string) => {
    let finalQuery = customQuery || query;
    
    // If a shortcut is selected, prepend it if it's a skill without pre-filled action
    if (selectedShortcut && !customQuery) {
      if (selectedShortcut.action === '') {
        finalQuery = \`[\${selectedShortcut.name}] \${finalQuery}\`.trim();
      } else if (!finalQuery.includes(selectedShortcut.name) && !finalQuery.includes(selectedShortcut.action)) {
        finalQuery = \`[\${selectedShortcut.name}] \${finalQuery}\`.trim();
      }
    }
    
    if (!finalQuery.trim()) {
      if (selectedShortcut && selectedShortcut.action === '') {
        finalQuery = \`执行技能：\${selectedShortcut.name}\`;
      } else {
        return;
      }
    }

    setSelectedShortcut(null);`;

content = content.replace(regex, newExecute);

fs.writeFileSync('src/components/Workbench.tsx', content);
