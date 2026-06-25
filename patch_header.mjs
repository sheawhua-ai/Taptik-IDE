import fs from 'fs';
let content = fs.readFileSync('src/components/MerchantMemoryHeader.tsx', 'utf-8');

content = content.replace(
  /onClick=\{\(\) => \{\s*\/\/ It will trigger escort in workbench[\s\S]*?setWorkflowTab\("interaction"\);\s*\}\}/,
  `onClick={() => {\n                    window.dispatchEvent(new CustomEvent("nav-to-strategy-start"));\n                  }}`
);

fs.writeFileSync('src/components/MerchantMemoryHeader.tsx', content);
