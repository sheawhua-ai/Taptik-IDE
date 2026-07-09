const fs = require('fs');
let code = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf8');

const targetState = `  const [showSkillOverviewDrawer, setShowSkillOverviewDrawer] = useState(false);`;
const replaceState = `  const [showSkillOverviewDrawer, setShowSkillOverviewDrawer] = useState(false);\n  const [isFullScreen, setIsFullScreen] = useState(false);`;

if(code.includes(targetState)) {
    code = code.replace(targetState, replaceState);
} else {
    console.log("targetState not found");
}

const targetWidth = `className="fixed top-0 right-0 bottom-0 w-full max-w-[440px] bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200"`;
const replaceWidth = `className={\`fixed top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-full max-w-[440px]'} transition-all duration-300 bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200\`}`;

if(code.includes(targetWidth)) {
    code = code.replace(targetWidth, replaceWidth);
} else {
    console.log("targetWidth not found");
}

const targetHeader = `                <button
                  onClick={() => setShowSkillOverviewDrawer(false)}
                  className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>`;
const replaceHeader = `                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setShowSkillOverviewDrawer(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>`;

if(code.includes(targetHeader)) {
    code = code.replace(targetHeader, replaceHeader);
} else {
    console.log("targetHeader not found");
}

const targetImport = `  X, Bot, Calendar, Image as ImageIcon, MapPin, Tag, Compass,
  Layers, Settings, Sparkles, CheckCircle2, User, Play, ExternalLink, Activity
} from "lucide-react";`;
const replaceImport = `  X, Bot, Calendar, Image as ImageIcon, MapPin, Tag, Compass,
  Layers, Settings, Sparkles, CheckCircle2, User, Play, ExternalLink, Activity, Maximize2, Minimize2
} from "lucide-react";`;

if(code.includes(targetImport)) {
    code = code.replace(targetImport, replaceImport);
} else {
    console.log("targetImport not found");
}

fs.writeFileSync('src/components/rings/Strategy.tsx', code);
