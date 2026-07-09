const fs = require('fs');
let code = fs.readFileSync('src/components/merchant/MerchantProfileDrawer.tsx', 'utf8');

code = code.replace(
  `import { \n  X, Store, Target, AlertCircle, ArrowRight, Search\n} from 'lucide-react';`,
  `import { \n  X, Store, Target, AlertCircle, ArrowRight, Search, Maximize2, Minimize2\n} from 'lucide-react';`
);

code = code.replace(
  `  const [missingItems] = useState([`,
  `  const [isFullScreen, setIsFullScreen] = useState(false);\n  const [missingItems] = useState([`
);

fs.writeFileSync('src/components/merchant/MerchantProfileDrawer.tsx', code);
