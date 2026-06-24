import fs from 'fs';
let content = fs.readFileSync('src/components/rings/Interaction.tsx', 'utf8');

let newContent = content.substring(0, content.lastIndexOf(') : ('));
newContent += ') : (\n  <div className="flex-1 bg-white" />\n  )}\n  </div>\n  </div>\n  </div>\n  );\n};\n';

fs.writeFileSync('src/components/rings/Interaction.tsx', newContent);
