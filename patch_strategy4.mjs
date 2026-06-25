import fs from 'fs';

let content = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf-8');

const startIdx = content.indexOf('{/* 3. 操盘确认卡 */}');
const endIdx = content.indexOf('{/* 4. 生成中 / 生成完成 */}');

if (startIdx !== -1 && endIdx !== -1) {
  const before = content.substring(0, startIdx);
  const after = content.substring(endIdx);
  
  const replacement = `{/* 3. 执行预览 */}\n          {flowState === "confirming" && (\n            <ExecutionPreview \n              onStart={startGenerating}\n              onBack={() => setFlowState("suggestion")}\n            />\n          )}\n\n          `;
  
  fs.writeFileSync('src/components/rings/Strategy.tsx', before + replacement + after);
} else {
  console.log("Could not find boundaries");
}
