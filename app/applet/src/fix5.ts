import fs from 'fs';
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

const newMock = `const MOCK_PROJECTS = [
  {
    id: "p1",
    name: "美妆搜索种草战役",
    goal: "搜索卡位 + 私域承接",
    currentDirection: "抗老 / 紧致 / 敏感肌 / 成分科普",
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'content', name: '内容', status: '已规划12', type: 'success', tab: 'content', actionDesc: '进入内容生成模块' },
      { id: 'material', name: '素材', status: '缺4', type: 'warning', tab: 'matrix', actionDesc: '快速处理素材缺口' }, 
      { id: 'publish', name: '发布', status: '待排期', type: 'pending', tab: 'content', actionDesc: '进入账号与发布模块' },
      { id: 'interaction', name: '互动', status: '待激活', type: 'pending', tab: 'interaction', actionDesc: '模块待激活' },
      { id: 'sales', name: '私域', status: '待激活', type: 'pending', tab: 'interaction', actionDesc: '模块待激活' },
      { id: 'metrics', name: '复盘', status: '待激活', type: 'pending', tab: 'metrics', actionDesc: '模块待激活' },
    ],
    issue: "战役素材缺口导致4篇图文无法生成",
    recommendation: "补齐素材 -> 检查生成内容 -> 排期发布",
    owner: "运营小王",
    deadline: "今日 18:00"
  },
  {
    id: "p2",
    name: "幼犬换粮避坑搜索卡位",
    goal: "自然流起量 + 转化",
    currentDirection: "避坑 / 挑食 / 软便 / 专业科普",
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'content', name: '内容', status: '156篇', type: 'success', tab: 'content', actionDesc: '进入内容生成模块' },
      { id: 'material', name: '素材', status: '全齐', type: 'success', tab: 'matrix', actionDesc: '素材齐备' }, 
      { id: 'publish', name: '发布', status: '已发42', type: 'success', tab: 'content', actionDesc: '进入账号与发布模块' },
      { id: 'interaction', name: '互动', status: '高意向41', type: 'warning', tab: 'interaction', actionDesc: '快速处理高意向线索' },
      { id: 'sales', name: '私域', status: '待跟进12', type: 'warning', tab: 'interaction', actionDesc: '处理私域承接动作' },
      { id: 'metrics', name: '复盘', status: '数据佳', type: 'success', tab: 'metrics', actionDesc: '查看复盘数据' },
    ],
    issue: "发现 41 条高意向待跟进线索",
    recommendation: "去私信承接 -> AI 快捷回复",
    owner: "客服小李",
    deadline: "明日 12:00"
  }
];`;

content = content.replace(/const MOCK_PROJECTS = \[[\s\S]*?\];/m, newMock);

content = content.replace(/className="w-14 h-14/g, 'className="w-11 h-11');
content = content.replace(/CheckCircle2 size=\{24\}/g, 'CheckCircle2 size={20}');
content = content.replace(/AlertTriangle size=\{24\}/g, 'AlertTriangle size={20}');
content = content.replace(/GitCommit size=\{24\}/g, 'GitCommit size={20}');
content = content.replace(/ArrowRight size=\{20\}/g, 'ArrowRight size={16}');
content = content.replace(/top-\[28px\]/g, 'top-[22px]');
content = content.replace(/p-6/g, 'p-4');
content = content.replace(/mb-6/g, 'mb-4');
content = content.replace(/mb-8/g, 'mb-4');
content = content.replace(/mt-8/g, 'mt-4');

fs.writeFileSync(file, content);
console.log('Matrix layout and mock updated');
