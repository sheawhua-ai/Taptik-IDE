import fs from 'fs';
import * as motionReact from 'motion/react';

const motionExports = Object.keys(motionReact);

const files = fs.readdirSync('src/pages').map(f => `src/pages/${f}`)
  .concat(fs.readdirSync('src/components').map(f => `src/components/${f}`).filter(f => f.endsWith('.tsx')))
  .concat(fs.readdirSync('src/components/merchant').map(f => `src/components/merchant/${f}`))
  .concat(fs.readdirSync('src/components/rings').map(f => `src/components/rings/${f}`))
  .concat(['src/App.tsx']);

files.forEach(file => {
  if (!fs.existsSync(file) || !file.endsWith('.tsx')) return;
  const content = fs.readFileSync(file, 'utf-8');
  
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]motion\/react['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const vars = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
    vars.forEach(v => {
      if (v && !motionExports.includes(v)) {
        console.log(`File ${file} imports non-existent motion icon: ${v}`);
      }
    });
  }
});
