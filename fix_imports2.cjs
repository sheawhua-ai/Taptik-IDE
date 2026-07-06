const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("  User,\n  Image as ImageIcons,", "  User,");
content = content.replace("  User,\n  Image as ImageIcon\n}", "  User,\n  Image as ImageIcon\n}");

fs.writeFileSync(file, content);
