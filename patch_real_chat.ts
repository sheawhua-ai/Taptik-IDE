import fs from 'fs';
let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const mockChatRegex = /\{\/\* Right: Subagent Chat \*\/\}\s*<div className="w-full xl:w-\[320px\] bg-white border-l border-neutral-200 flex flex-col shrink-0">[\s\S]*?完成修改并保存 <CheckCircle2 size=\{16\} \/>\s*<\/button>\s*<\/div>\s*<\/div>/g;

const realChatStr = `{/* Right: Subagent Chat */} 
          <div className="w-full xl:w-[380px] bg-white border-l border-neutral-200 flex flex-col shrink-0 relative">
             <div className="absolute inset-0 pb-[80px]">
               <SubagentChat 
                  moduleId="content" 
                  moduleName="内容精修专家" 
                  onClose={() => setReviewingDraft(null)} 
               />
             </div>
             <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100 bg-white shrink-0 z-10">
                <button onClick={() => setReviewingDraft(null)} className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-neutral-800 transition-colors shadow-md active:scale-95 flex justify-center items-center gap-2">
                  完成修改并保存 <CheckCircle2 size={16} />
                </button>
             </div>
          </div>`;

const initialLength = content.length;
content = content.replace(mockChatRegex, realChatStr);

if (content.length === initialLength) {
    console.log("No regex match found.");
} else {
    fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);
    console.log("Patch applied correctly.");
}
