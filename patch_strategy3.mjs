import fs from 'fs';

let content = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf-8');

if (!content.includes('import { ExecutionPreview }')) {
  content = content.replace(
    /import \{ motion, AnimatePresence \} from "motion\/react";/,
    `import { motion, AnimatePresence } from "motion/react";\nimport { ExecutionPreview } from "./ExecutionPreview";`
  );
  
  fs.writeFileSync('src/components/rings/Strategy.tsx', content);
}
