const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

// add Users to imports
content = content.replace(/  User,\n  Image as ImageIcon/m, "  User,\n  Users,\n  Image as ImageIcon");

fs.writeFileSync(file, content);
console.log("Success fix imports");
