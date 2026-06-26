import fs from 'fs';
const files = fs.readdirSync('.');
files.forEach(f => {
  if ((f.endsWith('.mjs') || f.endsWith('.ts') || f.endsWith('.js')) && f.startsWith('patch')) {
    fs.unlinkSync(f);
  }
  if (f === 'fix_workbench_props.mjs' || f === 'fix_workbench.mjs' || f === 'fix_dups.mjs' || f === 'fix_dups2.mjs' || f === 'cleanup.mjs' || f === 'fix.cjs') {
    fs.unlinkSync(f);
  }
});
