const fs = require('fs');
const file = 'src/components/rings/ExecutionResult.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("第三方 KOC", "泛素人分发");
content = content.replace("客户 KOC", "真实客户快发");

fs.writeFileSync(file, content);
