const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentDetailDrawer.tsx', 'utf8');

code = code.replace(
  `  Image as ImageIcon, Compass, Send, CheckCircle, Clock,
  MessageSquare, User, Smartphone, Users, Link, Bell, CheckSquare, Edit3
} from 'lucide-react';`,
  `  Image as ImageIcon, Compass, Send, CheckCircle, Clock,
  MessageSquare, User, Smartphone, Users, Link, Bell, CheckSquare, Edit3, Maximize2, Minimize2
} from 'lucide-react';`
);

code = code.replace(
  `  const [showLearningToast, setShowLearningToast] = useState(false);`,
  `  const [showLearningToast, setShowLearningToast] = useState(false);\n  const [isFullScreen, setIsFullScreen] = useState(false);`
);

code = code.replace(
  `className="w-[1000px] bg-neutral-50 h-full shadow-2xl flex flex-col relative z-10"`,
  `className={\`\${isFullScreen ? 'w-full' : 'w-[1000px]'} transition-all duration-300 bg-neutral-50 h-full shadow-2xl flex flex-col relative z-10\`}`
);

code = code.replace(
  `          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">\n            <X size={18} />\n          </button>`,
  `          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>`
);

fs.writeFileSync('src/components/rings/ContentDetailDrawer.tsx', code);
