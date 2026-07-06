const fs = require('fs');
const file = 'src/components/rings/ContentDetailDrawer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{g.id === 'koc_general' || g.id === 'koc_real' ? <Smartphone size={12} /> : <Link size={12} />}",
  "{g.id === 'koc_general' || g.id === 'koc_real' ? <Smartphone size={12} /> : <Send size={12} />}"
);

fs.writeFileSync(file, content);
