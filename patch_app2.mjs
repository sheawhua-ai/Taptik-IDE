import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('import { MerchantMemoryHeader }')) {
  content = content.replace(
    /import \{ SubagentChat \} from "\.\/components\/SubagentChat";/,
    `import { SubagentChat } from "./components/SubagentChat";\nimport { MerchantMemoryHeader } from "./components/MerchantMemoryHeader";`
  );
  fs.writeFileSync('src/App.tsx', content);
}
