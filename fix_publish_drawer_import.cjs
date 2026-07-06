const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('PublishDrawer')) {
  content = content.replace("import { ContentDetailDrawer } from '../components/rings/ContentDetailDrawer';", "import { ContentDetailDrawer } from '../components/rings/ContentDetailDrawer';\nimport { PublishDrawer } from '../components/rings/PublishDrawer';");
}

if (!content.includes("<PublishDrawer")) {
  content = content.replace("{activeDrawer === 'content_detail' && <ContentDetailDrawer onClose={() => setActiveDrawer(null)} />}", "{activeDrawer === 'content_detail' && <ContentDetailDrawer onClose={() => setActiveDrawer(null)} />}\n        {activeDrawer === 'publish' && <PublishDrawer onClose={() => setActiveDrawer(null)} />}");
}

fs.writeFileSync(file, content);
console.log("Injected PublishDrawer");
