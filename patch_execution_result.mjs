import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

// Add useEffect
content = content.replace(
  /export function ExecutionResult\(\) \{/,
  `import { useEffect } from "react";\n\nexport function ExecutionResult() {\n  useEffect(() => {\n    window.dispatchEvent(new CustomEvent('set-custom-greeting', { detail: { greeting: '当前最影响推进的是素材补齐。我可以帮你自动匹配素材、生成拍摄任务，或调整内容包分流方式。\\n\\n您可以直接说：\\n“为什么这样分流”\\n“先处理可发布的”\\n“减少外部领取”\\n“把更多内容转成素材库装填”\\n“生成商家拍摄清单”', expert: '操盘结果助手' } }));\n  }, []);`
);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
