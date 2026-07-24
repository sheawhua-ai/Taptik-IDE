import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

content = content.replace(
  'status: "自动执行中",',
  'status: "执行",'
);

content = content.replace(
  'status: "进行中"',
  'status: "执行"'
);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
