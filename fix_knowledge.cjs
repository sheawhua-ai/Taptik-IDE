const fs = require('fs');
let code = fs.readFileSync('src/components/KnowledgeMemory.tsx', 'utf8');

const tImport = `} from "lucide-react";`;
const rImport = `  Maximize2, Minimize2\n} from "lucide-react";`;
if(code.includes(tImport)) code = code.replace(tImport, rImport);

const tState = `  const [activeTab, setActiveTab] = useState<"database" | "extraction" | "assets">("database");`;
const rState = `  const [activeTab, setActiveTab] = useState<"database" | "extraction" | "assets">("database");\n  const [isFullScreen, setIsFullScreen] = useState(false);`;
if(code.includes(tState)) code = code.replace(tState, rState);

// First Drawer - selectedMemory (Detail mode from memory graph) -> wait, there are two selectedMemory usages?
// One at 445: `className="absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50"`
const tW1 = `className="absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50"`;
const rW1 = `className={\`absolute top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-[400px]'} transition-all duration-300 bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50\`}`;
if(code.includes(tW1)) code = code.replace(tW1, rW1);

const tH1 = `              <button onClick={() => {setSelectedMemory(null); setIsEditingDetail(false);}} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <X size={18} />
              </button>`;
const rH1 = `              <div className="flex items-center gap-2">
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                  {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={() => {setSelectedMemory(null); setIsEditingDetail(false);}} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>`;
if(code.includes(tH1)) code = code.replace(tH1, rH1);

// Second Drawer - selectedSourceFile
const tW2 = `className="absolute top-0 right-0 bottom-0 w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200"`;
const rW2 = `className={\`absolute top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-[500px]'} transition-all duration-300 bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200\`}`;
// Note there are two w-[500px] drawers, using regex replace
code = code.replace(/className="absolute top-0 right-0 bottom-0 w-\[500px\] bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200"/g, rW2);

const tH2 = `                <button
                  onClick={() => setSelectedSourceFile(null)}
                  className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                >
                  <X size={16} />
                </button>`;
const rH2 = `                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={() => setSelectedSourceFile(null)}
                    className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>`;
if(code.includes(tH2)) code = code.replace(tH2, rH2);

const tH3 = `                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                >
                  <X size={16} />
                </button>`;
const rH3 = `                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>`;
if(code.includes(tH3)) code = code.replace(tH3, rH3);

fs.writeFileSync('src/components/KnowledgeMemory.tsx', code);
