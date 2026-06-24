import fs from 'fs';

const files = fs.readdirSync('src/pages').map(f => `src/pages/${f}`)
  .concat(fs.readdirSync('src/components').map(f => `src/components/${f}`).filter(f => f.endsWith('.tsx')))
  .concat(fs.readdirSync('src/components/merchant').map(f => `src/components/merchant/${f}`))
  .concat(fs.readdirSync('src/components/rings').map(f => `src/components/rings/${f}`))
  .concat(['src/App.tsx']);

files.forEach(file => {
  if (!fs.existsSync(file) || !file.endsWith('.tsx')) return;
  const content = fs.readFileSync(file, 'utf-8');
  
  // Find all used components <Component ...>
  const tags = new Set();
  const tagRegex = /<([A-Z][a-zA-Z0-9]*)\b/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    tags.add(match[1]);
  }
  
  // Also find things passed as { icon: IconName }
  const iconRegex = /icon:\s*([A-Z][a-zA-Z0-9]*)\b/g;
  while ((match = iconRegex.exec(content)) !== null) {
    tags.add(match[1]);
  }

  // Find all imports
  const imports = new Set();
  const importRegex = /import\s+{([^}]+)}\s+from/g;
  while ((match = importRegex.exec(content)) !== null) {
    const vars = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
    vars.forEach(v => imports.add(v));
  }
  const defaultImportRegex = /import\s+([A-Z][a-zA-Z0-9]*)\s+from/g;
  while ((match = defaultImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  const missing = [];
  tags.forEach(tag => {
    if (!imports.has(tag) && tag !== 'AnimatePresence') {
      missing.push(tag);
    }
  });

  if (missing.length > 0) {
    console.log(`File ${file} might be missing imports for: ${missing.join(', ')}`);
  }
});
