import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const regex = /const QUICK_SHORTCUTS = \[\s*\{ id: '1', name: '文档处理', action: '帮我总结和处理这份文档。' \},[\s\S]*?\{ id: '5', name: '深度研究', action: '对这个主题进行深入的学术和市场研究。' \}\s*\];/;

const newShortcuts = `const QUICK_SHORTCUTS = [
  { 
    id: '1', 
    name: '找蓝海关键词', 
    action: '找蓝海关键词',
    contexts: [
      { id: 'c1', name: '多猫家庭喂养清单', action: '创建一个搜索多猫家庭喂养清单的关键词任务，后缀是字母a到z' },
      { id: 'c2', name: '猫猫不掉毛攻略', action: '创建一个搜索猫猫不掉毛攻略的关键词任务，后缀是字母a到z' },
      { id: 'c3', name: '平价冻干品牌测评', action: '搜索平价冻干品牌测评的蓝海词' }
    ]
  },
  { 
    id: '2', 
    name: '生成爆文', 
    action: '生成爆文',
    contexts: [
      { id: 'c4', name: '爆款标题生成', action: '基于当前受众特征，生成5个自带吸引力的爆款标题' },
      { id: 'c5', name: '痛点文案改写', action: '将这段产品描述改写成直击痛点的小红书种草文案' }
    ]
  },
  { 
    id: '3', 
    name: '分析笔记趋势', 
    action: '分析笔记趋势',
    contexts: [
      { id: 'c6', name: '本周热词分析', action: '提取本周品类下的高频搜索词，并预测下周趋势' },
      { id: 'c7', name: '高潜爆款拆解', action: '拆解近期互动率最高的3篇竞品笔记' }
    ]
  },
  { 
    id: '4', 
    name: '查看素材审核', 
    action: '查看素材审核',
    contexts: [
      { id: 'c8', name: '合规性预检', action: '帮我检查这篇笔记是否包含违规或敏感词' },
      { id: 'c9', name: '图片素材审查', action: '检查配图是否符合平台调性与审核标准' }
    ]
  },
  { 
    id: '5', 
    name: '更多', 
    action: '更多功能',
    contexts: []
  }
];`;

content = content.replace(regex, newShortcuts);
fs.writeFileSync('src/components/Workbench.tsx', content);
