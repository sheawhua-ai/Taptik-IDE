const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("channels: '官方 5 / KOS 10 / 第三方 KOC 30'", "channels: '官方 5 / KOS 10 / 真实客户 30'");
content = content.replace("issue: '第三方 KOC 8 个试用未领取，客户 KOC 5 个反馈未回传，KOS 2 个账号人设未确认'", "issue: '真实客户 5 个名额未扫码，泛素人 8 个需预设人设，KOS 2 个账号待定'");
content = content.replace("recommendation: '先发 KOC 领取任务 -> 确认 KOS 人设 -> 审官方号内容'", "recommendation: '先铺门店台卡码 -> 预设泛素人人设 -> 审官方号内容'");

fs.writeFileSync(file, content);
console.log("Updated MerchantMatrix");
