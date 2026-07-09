const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ChannelsDrawer.tsx', 'utf8');

code = code.replace(
  `import React from 'react';\nimport { motion } from 'motion/react';\nimport { X, Users, CheckCircle2, Sparkles } from 'lucide-react';`,
  `import React, { useState } from 'react';\nimport { motion } from 'motion/react';\nimport { X, Users, CheckCircle2, Sparkles, Maximize2, Minimize2 } from 'lucide-react';`
);

code = code.replace(
  `export const ChannelsDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {\n  return (`,
  `export const ChannelsDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {\n  const [isFullScreen, setIsFullScreen] = useState(false);\n  return (`
);

code = code.replace(
  `className="w-[600px] bg-neutral-100 h-full shadow-2xl flex flex-col relative z-10"`,
  `className={\`\${isFullScreen ? 'w-full' : 'w-[600px]'} transition-all duration-300 bg-neutral-100 h-full shadow-2xl flex flex-col relative z-10\`}`
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

fs.writeFileSync('src/components/rings/ChannelsDrawer.tsx', code);
