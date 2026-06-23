import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// The User said: "素材任务这个模块，看上去不需要聊天式的subagent"
// I will just make it so the Subagent part in MerchantMatrix is removed if it's there. 
// OR they might refer to the global one.
// Let's remove the Subagent from DraftReview Modal first, as it's directly beside the materials, or at least from MerchantMatrix completely.

const rightPanelRegex = /\{\/\* Subagent Chat \*\/\}([\s\S]*?)<SubagentChat moduleId="content" moduleName="内容修改" initialContext="已挂载当前笔记草稿及最新图文视觉素材。" \/>([\s\S]*?)<\/div>/g;
code = code.replace(rightPanelRegex, '{/* Subagent Chat Removed */}$2</div>');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
