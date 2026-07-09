const fs = require('fs');
let code = fs.readFileSync('src/components/merchant/MerchantProfileDrawer.tsx', 'utf8');

const targetUseState = `  const [missingItems, setMissingItems] = useState([`;
const replaceUseState = `  const [isFullScreen, setIsFullScreen] = useState(false);
  const [missingItems, setMissingItems] = useState([`;
if (code.includes(targetUseState)) {
    code = code.replace(targetUseState, replaceUseState);
} else {
    console.log("targetUseState not found");
}

const targetWidth = `className="fixed top-0 right-0 bottom-0 w-[420px] bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200"`;
const replaceWidth = `className={\`fixed top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-[420px]'} bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200 transition-all duration-300\`}`;
if (code.includes(targetWidth)) {
    code = code.replace(targetWidth, replaceWidth);
} else {
    console.log("targetWidth not found");
}

const targetHeader = `              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X size={18} />
              </button>`;
const replaceHeader = `              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>`;
if (code.includes(targetHeader)) {
    code = code.replace(targetHeader, replaceHeader);
} else {
    console.log("targetHeader not found");
}

const targetImport = `import { Target, Store, X, AlertCircle, ArrowRight, Search } from "lucide-react";`;
const replaceImport = `import { Target, Store, X, AlertCircle, ArrowRight, Search, Maximize2, Minimize2 } from "lucide-react";`;
if (code.includes(targetImport)) {
    code = code.replace(targetImport, replaceImport);
} else {
    console.log("targetImport not found");
}

fs.writeFileSync('src/components/merchant/MerchantProfileDrawer.tsx', code);
console.log("MerchantProfileDrawer replaced successfully!");
