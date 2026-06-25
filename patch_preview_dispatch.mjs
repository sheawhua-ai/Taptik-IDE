import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

content = content.replace(
  /const handleCollaborate = \(adjustType: string\) => \{[\s\S]*?\}\);\s*\};/,
  `const handleCollaborate = (adjustType: string) => {
    const content = getSubAgentContent(adjustType);
    if (!content) return;

    window.dispatchEvent(
      new CustomEvent("open-expert", {
        detail: {
          expert: "操盘副手",
          alternativesData: content,
        },
      })
    );
  };`
);

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);
