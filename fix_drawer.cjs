const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const targetDrawer = `      {/* Task Detail Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-[10]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className={\`absolute top-0 right-0 bottom-0 \${isFullScreen ? 'w-full' : 'w-[800px]'} bg-white shadow-2xl z-[20] flex flex-col border-l border-neutral-200 transition-all duration-300\`}
            >`;

const replaceDrawer = `      {/* Task Detail Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className={\`\${isFullScreen ? 'w-full' : 'w-[800px]'} bg-white shadow-2xl relative z-10 flex flex-col border-l border-neutral-200 transition-all duration-300 h-full\`}
            >`;

code = code.replace(targetDrawer, replaceDrawer);
code = code.replace(`</AnimatePresence>`, `</div>\n      </AnimatePresence>`);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
