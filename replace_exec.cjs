const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const targetWidth = `className="absolute top-0 right-0 bottom-0 w-[800px] bg-white shadow-2xl z-[20] flex flex-col border-l border-neutral-200"`;
const replaceWidth = `className={\`absolute top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-[800px]'} bg-white shadow-2xl z-[20] flex flex-col border-l border-neutral-200 transition-all duration-300\`}`;

if (code.includes(targetWidth)) {
    code = code.replace(targetWidth, replaceWidth);
} else {
    console.log("targetWidth not found");
}

const targetHeader = `                <button
                  onClick={() => setSelectedTask(null)}
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
                    onClick={() => setSelectedTask(null)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>`;

if (code.includes(targetHeader)) {
    code = code.replace(targetHeader, replaceHeader);
} else {
    console.log("targetHeader not found");
}

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log("ExecutionResult replaced successfully!");
