const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove showGlobalQueue state
code = code.replace(/const \[showGlobalQueue, setShowGlobalQueue\] = useState\(false\);\n?/g, '');

// Remove Global Queue Drawer rendering
const startQueue = code.indexOf('{/* Global Queue Drawer */}');
if (startQueue !== -1) {
  const endQueueStr = '              </div>\n            </motion.div>\n          </div>\n        )}\n      </AnimatePresence>';
  const endQueue = code.indexOf(endQueueStr, startQueue);
  if (endQueue !== -1) {
    code = code.substring(0, startQueue) + code.substring(endQueue + endQueueStr.length);
  } else {
    console.log("Could not find end of queue");
  }
}

// Write back
fs.writeFileSync('src/App.tsx', code);
console.log("App fixed");
