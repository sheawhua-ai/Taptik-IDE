const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              <div className="flex items-center">
                <button
                  onClick={() => setShowGlobalQueue(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors"
                >
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  
                </button>
              </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, '');
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed App.tsx by removing button block.");
} else {
  console.log("Could not find the button block exactly. Will try regex.");
  // Regex approach
  const regex = /<div className="flex items-center">\s*<button\s*onClick=\{\(\) => setShowGlobalQueue\(true\)\}[\s\S]*?<\/button>\s*<\/div>/g;
  code = code.replace(regex, '');
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed App.tsx with regex.");
}

