const fs = require('fs');
let code = fs.readFileSync('src/components/KnowledgeMemory.tsx', 'utf8');

// 1. Update Types and constants
code = code.replace(/type SpaceType = "merchant" \| "personal" \| "strategy";/, 'type SpaceType = "merchant" | "strategy";');
code = code.replace(/type TabType = "overview" \| "memory" \| "source" \| "logs";/, 'type TabType = "overview" | "memory" | "source";');

code = code.replace(
`const SPACES = [
  { id: 'merchant', label: '商家记忆' },
  { id: 'personal', label: '我的记忆' },
  { id: 'strategy', label: '本地打法' }
];`,
`const SPACES = [
  { id: 'merchant', label: '商家记忆' },
  { id: 'strategy', label: '我的打法' }
];`
);

fs.writeFileSync('src/components/KnowledgeMemory.tsx', code);
