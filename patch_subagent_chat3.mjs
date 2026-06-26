import fs from 'fs';

let content = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');

content = content.replace(
  /setAlternativesModeData\(null\);\n\s*sendDirectMessage\(\`采用方案 \$\{alt\.id \|\| \['A','B','C'\]\[idx\] \|\| \(idx \+ 1\)\}：\$\{alt\.name\}\`\);/,
  `setAlternativesModeData(null);
                    window.dispatchEvent(new CustomEvent("adopt-alternative", { detail: { adjustType: alternativesModeData.adjustType, name: alt.name } }));`
);

fs.writeFileSync('src/components/SubagentChat.tsx', content);
