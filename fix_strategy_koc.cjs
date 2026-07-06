const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace KOC logic in Strategy
content = content.replace("第三方 KOC <span className=\"text-emerald-600\">8 篇</span>", "泛素人分发 <span className=\"text-emerald-600\">8 篇</span>");
content = content.replace("素人避坑打法 · 需试用回传", "泛生活种草 · 人工预设人设");
content = content.replace("第三方 KOC 需要先领取试用", "泛素人需要先预设账号人设");

content = content.replace("客户 KOC <span className=\"text-amber-600\">5 篇</span>", "真实客户快发 <span className=\"text-amber-600\">5 篇</span>");
content = content.replace("好评推荐打法 · 需客户反馈", "即时生成打法 · 现场扫码发");
content = content.replace("客户 KOC 需要回传真实反馈", "真实客户需要现场扫码");

fs.writeFileSync(file, content);
