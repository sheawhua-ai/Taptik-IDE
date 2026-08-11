import { KnowledgeItem, SourceItem, PendingTask } from '../types/knowledge';

export const mockPendingTasks: PendingTask[] = [
  {
    id: "task-1",
    title: "缺少产品利润与价格依据",
    type: "缺少资料",
    reason: "缺乏高烘干粮出厂成本与最低限价，无法生成ROI建议。",
    impact: "影响出价与分佣比例计算",
    missingWhat: "高烘干粮的阶梯发货价与最低允许限价",
    missingWhy: "当前已有多份宣传文档，但均未包含价格政策，财务数据缺失。",
    category: "品牌与产品"
  },
  {
    id: "task-2",
    title: "发现两份产品包装规范冲突",
    type: "来源冲突",
    reason: "新旧两份文件对‘烘干粮封口形式’描述不一致。",
    impact: "素材审核无法确定采用哪个版本",
    conflictA: { source: "2025包装标准.pdf", text: "罐装密封包装，内含脱氧剂", time: "2025-06" },
    conflictB: { source: "2026Q2包装升级通知.docx", text: "全面升级为哑光密封拉链袋", time: "2026-04" },
    category: "品牌与产品"
  },
  {
    id: "task-3",
    title: "私域承接话术含禁用词风险",
    type: "高风险确认",
    reason: "AI提取的客服回复中包含疑似医疗承诺词汇。",
    impact: "避免小红书平台违规限流及广告法风险",
    aiConclusion: "遇到换粮期肠胃敏感问题，引导使用‘舒缓肠胃适应期’，但原文档出现过‘治疗软便’。",
    originalEvidence: "“客服回复软便问题时可以说我们的粮能治疗软便...”",
    sourceFile: "2026-07客服聊天记录.pdf",
    category: "禁区与流转"
  }
];

export const mockKnowledgeList: KnowledgeItem[] = [
  {
    id: "k-1",
    summary: "幼犬高烘干粮粗蛋白质含量为 42%。",
    type: "商家事实",
    source: "2026Q3产品手册.pdf",
    scope: "指定产品: 幼犬高烘干粮",
    validity: "长期有效",
    updateTime: "2小时前",
    state: "正常",
    category: "品牌与产品",
    originalEvidence: "选用 85% 肉类原料，粗蛋白质 ≥42%，不添加小麦和大豆等致敏原。",
    usageCount: 18,
    atomicFacts: [
      { id: "a1", content: "幼犬粮粗蛋白含量42%", status: "confirmed" },
      { id: "a2", content: "采用无粮配方", status: "confirmed" }
    ]
  },
  {
    id: "k-2",
    summary: "换粮软便场景不得使用‘治疗、治愈’等功效承诺。",
    type: "规则与禁区",
    source: "2026-07-03 客服合规指南.pdf",
    scope: "全商家通用",
    validity: "长期有效",
    updateTime: "1天前",
    state: "正常",
    category: "禁区与流转",
    originalEvidence: "严禁在私信和评论区出现‘根治软便/替代药品’等医疗化词汇。",
    usageCount: 5
  },
  {
    id: "k-3",
    summary: "店长号使用专业解释加真实案例，比单纯促销更容易产生咨询。",
    type: "经验建议",
    source: "Q2转化复盘报告.docx",
    scope: "指定账号: 店长号",
    validity: "项目结束后失效",
    updateTime: "3天前",
    state: "正常",
    category: "打法复盘",
    originalEvidence: "复盘显示，店长号不走低价噱头，以专业营养学视角解答疑难问题，转化率高30%。",
    reliability: "多次项目验证",
    usageCount: 8
  }
];

export const mockSources: SourceItem[] = [
  {
    id: "s-1",
    name: "2026Q3产品手册.pdf",
    type: "PDF",
    deviceOrLocation: "运营总监的MacBook",
    extractedCount: 12,
    pendingCount: 0,
    lastSyncTime: "2026-08-10 14:00",
    state: "正常"
  },
  {
    id: "s-2",
    name: "七月素材整理",
    type: "本地文件夹",
    deviceOrLocation: "剪辑师PC (离线)",
    extractedCount: 45,
    pendingCount: 2,
    lastSyncTime: "2026-08-09 18:30",
    state: "已断开",
    exceptionReason: "所属设备离线，暂时无法检查文件更新"
  },
  {
    id: "s-3",
    name: "客服合规指南",
    type: "Word",
    deviceOrLocation: "系统上传",
    extractedCount: 8,
    pendingCount: 1,
    lastSyncTime: "2026-08-11 09:15",
    state: "待处理",
    exceptionReason: "内容包含高风险词汇，需人工确认"
  }
];
