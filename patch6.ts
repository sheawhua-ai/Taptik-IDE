import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const rightPanelRegex = /\{\/\* Right: AI Subagent & Status \*\/\}[\s\S]*?\{\/\* Status Config \*\/\}[\s\S]*?<button/g;

code = code.replace(rightPanelRegex, `{/* Status Config */} 
 <div className="w-full xl:w-[280px] bg-white border-l border-neutral-200 p-6 flex flex-col justify-end shrink-0 block">
 <button`);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
