const code = require('fs').readFileSync('src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx', 'utf8');

if (code.includes('快捷分配')) console.log("Still has 快捷分配");
if (code.includes('这里确认的数量是硬约束')) console.log("Still has 硬约束");
if (code.includes('本轮总笔记数')) console.log("Still has 总笔记数");
if (!code.includes('选择参与账号')) console.log("Missing new UI");
if (!code.includes('koc: [')) console.log("Missing koc accounts");

