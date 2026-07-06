const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

// For content node
content = content.replace(
  /{ id: 'content', name: '内容', status: '已规划12', type: 'success', tab: 'content', actionDesc: '进入内容生成模块' }/g,
  "{ id: 'content', name: '内容', status: '已规划12', type: 'success', tab: 'content', actionDesc: '内容包详情 / 内容确认 / 修改内容 / 确认进入素材补齐' }"
);
content = content.replace(
  /{ id: 'content', name: '内容', status: '156篇', type: 'success', tab: 'content', actionDesc: '进入内容生成模块' }/g,
  "{ id: 'content', name: '内容', status: '156篇', type: 'success', tab: 'content', actionDesc: '内容包详情 / 内容确认 / 修改内容 / 确认进入素材补齐' }"
);

// For material node
content = content.replace(
  /{ id: 'material', name: '素材', status: '缺4', type: 'warning', tab: 'matrix', actionDesc: '快速处理素材缺口' }/g,
  "{ id: 'material', name: '素材', status: '缺4', type: 'warning', tab: 'matrix', actionDesc: '素材缺口 / 素材匹配 / 补齐素材 / 确认进入排期' }"
);
content = content.replace(
  /{ id: 'material', name: '素材', status: '全齐', type: 'success', tab: 'matrix', actionDesc: '素材齐备' }/g,
  "{ id: 'material', name: '素材', status: '全齐', type: 'success', tab: 'matrix', actionDesc: '素材缺口 / 素材匹配 / 补齐素材 / 确认进入排期' }"
);

// For publish node
content = content.replace(
  /{ id: 'publish', name: '发布', status: '待内容确认', type: 'pending', tab: 'content', actionDesc: '进入账号与发布模块' }/g,
  "{ id: 'publish', name: '发布', status: '待内容确认', type: 'pending', tab: 'content', actionDesc: '发布包详情 / 账号分配 / 排期确认 / 进入发布' }"
);
content = content.replace(
  /{ id: 'publish', name: '发布', status: '已发42', type: 'success', tab: 'content', actionDesc: '进入账号与发布模块' }/g,
  "{ id: 'publish', name: '发布', status: '已发42', type: 'success', tab: 'content', actionDesc: '发布包详情 / 账号分配 / 排期确认 / 进入发布' }"
);

fs.writeFileSync(file, content);
console.log('ActionDesc updated');
