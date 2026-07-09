const fs = require('fs');
let code = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf8');

const tEvidenceHeader = `                <button
                  onClick={() => setShowEvidenceDrawer(false)}
                  className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>`;
const rEvidenceHeader = `                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setShowEvidenceDrawer(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>`;
code = code.replace(tEvidenceHeader, rEvidenceHeader);

const tAdjustHeader = `                <button
                  onClick={() => setShowAdjustDrawer(false)}
                  className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>`;
const rAdjustHeader = `                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setShowAdjustDrawer(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>`;
code = code.replace(tAdjustHeader, rAdjustHeader);

const tAdjustWidth = `className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200"`;
const rAdjustWidth = `className={\`fixed top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-full max-w-[500px]'} transition-all duration-300 bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200\`}`;
code = code.replace(tAdjustWidth, rAdjustWidth);

fs.writeFileSync('src/components/rings/Strategy.tsx', code);
