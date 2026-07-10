const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldImports = `import { 
  X, Check, AlertOctagon, User, Tag, 
  ChevronRight, RefreshCw, History, AlignLeft, Info,
  ShieldAlert, Sparkles, CheckCircle2, CornerUpLeft, ArrowRightLeft, ListChecks, Search
} from 'lucide-react';`;

const newImports = `import { 
  X, Check, AlertOctagon, User, Tag, Plus, Image as ImageIcon,
  ChevronRight, RefreshCw, History, AlignLeft, Info,
  ShieldAlert, Sparkles, CheckCircle2, CornerUpLeft, ArrowRightLeft, ListChecks, Search
} from 'lucide-react';`;

code = code.replace(oldImports, newImports);
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
console.log("Imports fixed");
