import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];/;

const match = content.match(importRegex);
if (match) {
  let imports = match[1];
  if (!imports.includes('Loader2')) imports += ', Loader2';
  if (!imports.includes('ChevronDown')) imports += ', ChevronDown';
  content = content.replace(importRegex, "import {" + imports + "} from 'lucide-react';");
  fs.writeFileSync('src/components/Workbench.tsx', content);
}
