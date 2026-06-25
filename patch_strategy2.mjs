import fs from 'fs';

let content = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf-8');

if (!content.includes('import { ExecutionPreview }')) {
  content = content.replace(
    /import \{ CheckCircle2, ArrowRight, Play, Loader, ShieldCheck, Tag, Plus \} from "lucide-react";/,
    `import { CheckCircle2, ArrowRight, Play, Loader, ShieldCheck, Tag, Plus } from "lucide-react";\nimport { ExecutionPreview } from "./ExecutionPreview";`
  );
}

const formRegex = /\{\/\* 3\. 执行确认（弹出的配置卡） \*\/\}\s*\{flowState === "confirming" && \([\s\S]*?\}\)/;

content = content.replace(formRegex, `{/* 3. 执行确认（弹出的配置卡） */}\n          {flowState === "confirming" && (\n            <ExecutionPreview \n              onStart={startGenerating}\n              onBack={() => setFlowState("suggestion")}\n            />\n          )}`);

fs.writeFileSync('src/components/rings/Strategy.tsx', content);
