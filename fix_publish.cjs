const fs = require('fs');
let code = fs.readFileSync('src/components/rings/PublishDrawer.tsx', 'utf8');

code = code.replace(
  `import { \n  X, CheckCircle2, Send, QrCode, Smartphone, ExternalLink, Calendar, Users\n} from 'lucide-react';`,
  `import { \n  X, CheckCircle2, Send, QrCode, Smartphone, ExternalLink, Calendar, Users, Maximize2, Minimize2\n} from 'lucide-react';`
);

code = code.replace(
  `export const PublishDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {\n  return (`,
  `export const PublishDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {\n  const [isFullScreen, setIsFullScreen] = useState(false);\n  return (`
);

code = code.replace(
  `className="w-[600px] bg-white h-full shadow-2xl flex flex-col relative z-10"`,
  `className={\`\${isFullScreen ? 'w-full' : 'w-[600px]'} transition-all duration-300 bg-white h-full shadow-2xl flex flex-col relative z-10\`}`
);

code = code.replace(
  `          <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">\n            <X size={20} className="text-neutral-500" />\n          </button>`,
  `          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
              {isFullScreen ? <Minimize2 size={20} className="text-neutral-500" /> : <Maximize2 size={20} className="text-neutral-500" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
              <X size={20} className="text-neutral-500" />
            </button>
          </div>`
);

fs.writeFileSync('src/components/rings/PublishDrawer.tsx', code);
