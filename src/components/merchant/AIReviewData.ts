export interface ProjectItem {
  id: string;
  name: string;
  strategyVersion: string;
  category: string;
}

export interface DataCoverageInfo {
  totalNotes: number;
  syncedNotes: number;
  coverageRate: number; // percentage e.g. 90.0
  lastSyncTime: string;
  missingFields: string[];
  isComplete: boolean;
  manualSupplementCount: number;
  sources: {
    name: string;
    status: 'connected' | 'partial' | 'not_connected';
    lastSync: string;
    coverageNote: string;
  }[];
}

export interface NotePerformanceItem {
  id: string;
  title: string;
  coverUrl: string;
  publishTime: string;
  accountName: string;
  accountRole: '门店KOS' | 'KOC体验官' | '品牌官号' | '达人合作';
  topic: '幼犬换粮' | '软便避坑' | '成分测评' | '适口性实测';
  format: '图文' | '视频';
  impressions: number;
  reads: number;
  interactions: number;
  likes: number;
  collects: number;
  comments: number;
  shares: number;
  dmLeads: number;
  keywords: string[];
  status: 'top' | 'weak' | 'normal';
  dataQuality: '完整平台同步' | '部分基础数据' | '人工标记补充';
}

export interface AccountMatrixItem {
  id: string;
  accountName: string;
  role: '门店KOS' | 'KOC体验官' | '品牌官号' | '达人合作';
  publishedNotes: number;
  impressions: number;
  interactions: number;
  dmLeads: number;
  topNoteTitle: string;
  laiguStatus: 'connected' | 'not_connected';
}

export interface SearchSnapshotItem {
  id: string;
  keyword: string;
  lastCapturedAt: string;
  captureScope: string; // e.g. "小红书搜索前50位"
  projectNoteCount: number;
  rankPositions: { rank: number; noteTitle: string; accountName: string }[];
  rankDiff: string; // e.g. "↑2" or "NEW" or "持平"
  isStable: boolean; // 持续占位 (连续2期以上)
  dataSource: string;
  updateTime: string;
}

export interface DMInquiryData {
  accountName: string;
  isConnectedToLaigu: boolean;
  sessionCount: number;
  validInquiries: number;
  avgResponseTimeMinutes: number;
  unrepliedCount: number;
  leads: { id: string; clientName: string; noteTitle: string; time: string; intent: string }[];
}

export interface StrategyDiff {
  currentStrategy: string;
  suggestedStrategy: string;
  reason: string;
  dataEvidence: string;
  impactedScope: string;
  effectivePeriod: string;
  isRevocable: boolean;
}

export interface StageConclusionItem {
  id: string;
  type: 'proven' | 'suggested' | 'unproven';
  typeLabel: '已有证据' | '建议调整' | '证据不足';
  title: string;
  evidenceSummary: string;
  coverageScope: string;
  suggestedAction: string;
  impactObject: string;
  relatedNotes: NotePerformanceItem[];
  strategyDiff?: StrategyDiff;
}

export interface MerchantReportItem {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  strategyVersion: string;
  dateRange: string;
  createdAt: string;
  version: string;
  status: 'draft' | 'published' | 'shared';
  recipientRole: string;
  coverageRate: number;
  sections: string[];
  showAccountDetails: boolean;
  showSearchPositioning: boolean;
  showDMData: boolean;
  hideInternalLogs: boolean;
  executiveSummary: string;
  keyTakeaways: string[];
  htmlContent?: string;
}

// --- MOCK DATA ---

export const MOCK_PROJECTS_LIST: ProjectItem[] = [
  { id: 'p1', name: '幼犬换粮软便卡位项目', strategyVersion: 'v2.1体验测评打法', category: '宠物食品' },
  { id: 'p2', name: '猫粮肠胃敏感科普项目', strategyVersion: 'v1.4成分分析打法', category: '宠物食品' },
  { id: 'p3', name: '线下门店KOS到店引流项目', strategyVersion: 'v3.0同城种草打法', category: '同城服务' },
];

export const MOCK_DATA_COVERAGE: DataCoverageInfo = {
  totalNotes: 20,
  syncedNotes: 18,
  coverageRate: 90.0,
  lastSyncTime: '2026-08-21 09:30',
  missingFields: ['部分KOC私信互动明细（未授权来鼓席位）'],
  isComplete: false,
  manualSupplementCount: 2,
  sources: [
    { name: '小红书创作者后台', status: 'connected', lastSync: '10分钟前', coverageNote: '已同步18篇笔记的基础互动与阅读数据' },
    { name: '关键词搜索捕获接口', status: 'connected', lastSync: '今日 09:00', coverageNote: '每日自动抓取 Top 50 搜索快照' },
    { name: '来鼓私信聚合接口', status: 'partial', lastSync: '半小时前', coverageNote: '品牌官号已连接，KOC个人号未授权' },
    { name: '操盘手人工核销日志', status: 'connected', lastSync: '昨日 18:00', coverageNote: '素材质量与实际到店核销标记' },
  ]
};

export const MOCK_NOTES_LIST: NotePerformanceItem[] = [
  {
    id: 'n1',
    title: '新手养狗避坑！幼犬换粮软便到底怎么办？7天过渡法实测',
    coverUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
    publishTime: '2026-08-05',
    accountName: '@宠物健康顾问-阿强',
    accountRole: '门店KOS',
    topic: '软便避坑',
    format: '图文',
    impressions: 48200,
    reads: 6850,
    interactions: 920,
    likes: 410,
    collects: 380,
    comments: 110,
    shares: 20,
    dmLeads: 18,
    keywords: ['幼犬换粮', '幼犬软便', '换粮过渡'],
    status: 'top',
    dataQuality: '完整平台同步',
  },
  {
    id: 'n2',
    title: '千万别乱换！3个月金毛幼犬颗粒换粮真实对比',
    coverUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80',
    publishTime: '2026-08-08',
    accountName: '@毛孩子成长日记',
    accountRole: 'KOC体验官',
    topic: '幼犬换粮',
    format: '图文',
    impressions: 36400,
    reads: 5120,
    interactions: 740,
    likes: 320,
    collects: 310,
    comments: 85,
    shares: 25,
    dmLeads: 12,
    keywords: ['幼犬换粮', '狗粮测评'],
    status: 'top',
    dataQuality: '完整平台同步',
  },
  {
    id: 'n3',
    title: '拆解冻干肉松粮成分表：为什么玻璃胃狗狗更适合？',
    coverUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&auto=format&fit=crop&q=80',
    publishTime: '2026-08-11',
    accountName: '@宠粮大队长',
    accountRole: '品牌官号',
    topic: '成分测评',
    format: '视频',
    impressions: 29100,
    reads: 3900,
    interactions: 480,
    likes: 210,
    collects: 210,
    comments: 42,
    shares: 18,
    dmLeads: 8,
    keywords: ['玻璃胃狗狗', '冻干狗粮'],
    status: 'normal',
    dataQuality: '完整平台同步',
  },
  {
    id: 'n4',
    title: '我家挑食小边牧的换粮日常，第一次把碗舔干净！',
    coverUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop&q=80',
    publishTime: '2026-08-14',
    accountName: '@边牧宝妈小莉',
    accountRole: 'KOC体验官',
    topic: '适口性实测',
    format: '图文',
    impressions: 12400,
    reads: 1100,
    interactions: 110,
    likes: 55,
    collects: 42,
    comments: 11,
    shares: 2,
    dmLeads: 2,
    keywords: ['挑食狗狗', '适口性'],
    status: 'weak',
    dataQuality: '完整平台同步',
  },
  {
    id: 'n5',
    title: '小开箱：看看这一包里面有多少真肉块？',
    coverUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16',
    accountName: '@铲屎官日常',
    accountRole: 'KOC体验官',
    topic: '成分测评',
    format: '图文',
    impressions: 8900,
    reads: 820,
    interactions: 65,
    likes: 30,
    collects: 25,
    comments: 8,
    shares: 2,
    dmLeads: 0,
    keywords: ['狗粮开箱'],
    status: 'weak',
    dataQuality: '部分基础数据',
  },
];

export const MOCK_ACCOUNTS_MATRIX: AccountMatrixItem[] = [
  { id: 'a1', accountName: '@宠粮大队长', role: '品牌官号', publishedNotes: 4, impressions: 84000, interactions: 1250, dmLeads: 46, topNoteTitle: '拆解冻干肉松粮成分表', laiguStatus: 'connected' },
  { id: 'a2', accountName: '@宠物健康顾问-阿强', role: '门店KOS', publishedNotes: 5, impressions: 98000, interactions: 1820, dmLeads: 52, topNoteTitle: '新手养狗避坑！幼犬换粮软便', laiguStatus: 'connected' },
  { id: 'a3', accountName: '@毛孩子成长日记', role: 'KOC体验官', publishedNotes: 6, impressions: 72000, interactions: 1310, dmLeads: 28, topNoteTitle: '千万别乱换！3个月金毛幼犬颗粒', laiguStatus: 'not_connected' },
  { id: 'a4', accountName: '@边牧宝妈小莉', role: 'KOC体验官', publishedNotes: 3, impressions: 31400, interactions: 470, dmLeads: 16, topNoteTitle: '我家挑食小边牧的换粮日常', laiguStatus: 'not_connected' },
];

export const MOCK_SEARCH_SNAPSHOTS: SearchSnapshotItem[] = [
  {
    id: 's1',
    keyword: '幼犬换粮软便怎么办',
    lastCapturedAt: '2026-08-21 09:00',
    captureScope: '小红书 App 搜索前 50 位快照',
    projectNoteCount: 3,
    rankPositions: [
      { rank: 2, noteTitle: '新手养狗避坑！幼犬换粮软便到底怎么办？', accountName: '@宠物健康顾问-阿强' },
      { rank: 5, noteTitle: '千万别乱换！3个月金毛幼犬颗粒换粮真实对比', accountName: '@毛孩子成长日记' },
      { rank: 14, noteTitle: '拆解冻干肉松粮成分表：为什么玻璃胃狗狗更适合？', accountName: '@宠粮大队长' },
    ],
    rankDiff: '↑2',
    isStable: true,
    dataSource: '小红书关键词 API 定时快照',
    updateTime: '2026-08-21 09:00',
  },
  {
    id: 's2',
    keyword: '幼犬狗粮推荐 避坑',
    lastCapturedAt: '2026-08-21 09:00',
    captureScope: '小红书 App 搜索前 50 位快照',
    projectNoteCount: 2,
    rankPositions: [
      { rank: 4, noteTitle: '新手养狗避坑！幼犬换粮软便到底怎么办？', accountName: '@宠物健康顾问-阿强' },
      { rank: 11, noteTitle: '千万别乱换！3个月金毛幼犬颗粒换粮真实对比', accountName: '@毛孩子成长日记' },
    ],
    rankDiff: 'NEW',
    isStable: false,
    dataSource: '小红书关键词 API 定时快照',
    updateTime: '2026-08-21 09:00',
  },
  {
    id: 's3',
    keyword: '幼犬软便 肠胃调理',
    lastCapturedAt: '2026-08-21 09:00',
    captureScope: '小红书 App 搜索前 50 位快照',
    projectNoteCount: 2,
    rankPositions: [
      { rank: 1, noteTitle: '新手养狗避坑！幼犬换粮软便到底怎么办？', accountName: '@宠物健康顾问-阿强' },
      { rank: 8, noteTitle: '拆解冻干肉松粮成分表：为什么玻璃胃狗狗更适合？', accountName: '@宠粮大队长' },
    ],
    rankDiff: '持平',
    isStable: true,
    dataSource: '小红书关键词 API 定时快照',
    updateTime: '2026-08-21 09:00',
  },
];

export const MOCK_DM_INQUIRY_DATA: DMInquiryData[] = [
  {
    accountName: '@宠粮大队长',
    isConnectedToLaigu: true,
    sessionCount: 68,
    validInquiries: 42,
    avgResponseTimeMinutes: 2.1,
    unrepliedCount: 1,
    leads: [
      { id: 'l1', clientName: '豆豆妈', noteTitle: '拆解冻干肉松粮成分表', time: '10:15', intent: '询问4斤装试吃包价格及优惠' },
      { id: 'l2', clientName: '金毛家长小张', noteTitle: '新手养狗避坑！幼犬换粮', time: '09:40', intent: '幼犬3个月便软咨询换粮比例' },
    ],
  },
  {
    accountName: '@宠物健康顾问-阿强',
    isConnectedToLaigu: true,
    sessionCount: 74,
    validInquiries: 44,
    avgResponseTimeMinutes: 2.8,
    unrepliedCount: 2,
    leads: [
      { id: 'l3', clientName: '柯基主子', noteTitle: '新手养狗避坑！幼犬换粮', time: '11:20', intent: '询问线下门店地址与同城体验' },
    ],
  },
  {
    accountName: '@毛孩子成长日记',
    isConnectedToLaigu: false,
    sessionCount: 0,
    validInquiries: 0,
    avgResponseTimeMinutes: 0,
    unrepliedCount: 0,
    leads: [],
  },
];

export const MOCK_STAGE_CONCLUSIONS: StageConclusionItem[] = [
  {
    id: 'c1',
    type: 'proven',
    typeLabel: '已有证据',
    title: '“软便避坑与换粮指南”类切角互动率超基线 35%，贡献 60% 私信线索',
    evidenceSummary: '在同步的 18 篇笔记中，3 篇软便切角笔记平均互动率达 13.5%，远高于成分拆解类的 5.2%。关联触发来鼓私信 30 组。',
    coverageScope: '涵盖 18 篇已同步笔记，采集时间 2026-08-01 至 08-20',
    suggestedAction: '在下一周期（v2.2）中，将“软便避坑”主题笔记从 20% 提高至 45% 占比。',
    impactObject: '幼犬换粮项目 下一阶段 (v2.2) 方案与内容大纲配置',
    relatedNotes: [MOCK_NOTES_LIST[0], MOCK_NOTES_LIST[1]],
    strategyDiff: {
      currentStrategy: '软便避坑类占比 20%，成分测评类 50%，适口性实测 30%',
      suggestedStrategy: '软便避坑类占比 45%，成分测评类 35%，适口性实测 20%',
      reason: '数据证明软便痛点引发用户高频互动与直接私信询问，转化效率显著高于纯成分拆解。',
      dataEvidence: '软便类单篇平均私信转化 15 条，成分类仅 4 条；互动率 13.5% vs 5.2%。',
      impactedScope: '只更新下期 (v2.2) 方案模板与下发任务大纲，不影响当前已发布笔记。',
      effectivePeriod: '应用于 v2.2 周期（预估 2026-08-25 启动）',
      isRevocable: true,
    },
  },
  {
    id: 'c2',
    type: 'suggested',
    typeLabel: '建议调整',
    title: 'KOC 素材要求“宠物与产品同框”验收驳回率达 60%，建议调整为细节特写',
    evidenceSummary: '查看素材验收日志，15 组驳回素材中有 9 组因室内光线较暗或狗狗不配合拍照导致画面模糊。',
    coverageScope: '涵盖 15 组素材验收日志及 6 篇已发布 KOC 笔记',
    suggestedAction: '优化 KOC 素材任务要求：从“强求宠物与粮包合影”调整为“粮颗粒近景特写+宠物随性出镜”。',
    impactObject: '更新“换粮体验包”素材拍摄指导与 KOC 任务大纲',
    relatedNotes: [MOCK_NOTES_LIST[3], MOCK_NOTES_LIST[4]],
    strategyDiff: {
      currentStrategy: '要求 KOC 拍摄宠物与产品正面清晰合影 1 张，颗粒特写 1 张',
      suggestedStrategy: '取消强求宠物合影，改为手持冻干颗粒特写近景 2 张，宠物自然背景 1 张',
      reason: '降低 KOC 拍摄门槛，提升素材交付质量与通过率，避免延误发布。',
      dataEvidence: '符合特写要求的笔记平均通过率 92%，合影要求通过率仅 40%。',
      impactedScope: '下一批次 KOC 任务模板。',
      effectivePeriod: '下期 (v2.2) KOC 分派生效',
      isRevocable: true,
    },
  },
  {
    id: 'c3',
    type: 'unproven',
    typeLabel: '证据不足',
    title: '发现“挑食宝妈”场景长尾词搜索展现上升，但样本仅 2 篇需进一步测试',
    evidenceSummary: '最新 2 篇关于“挑食狗狗”的笔记评论区出现 15 条关于“挑食换粮”的留言，搜索快照进入 Top 20。',
    coverageScope: '仅 2 篇笔记抽样，覆盖率较低（11%）',
    suggestedAction: '建议在下一周期加入 3 篇小规模测试笔记，观察“挑食”场景的搜索卡位表现。',
    impactObject: '下期 (v2.2) 方案加入“挑食测试包”',
    relatedNotes: [MOCK_NOTES_LIST[3]],
    strategyDiff: {
      currentStrategy: '无挑食专属切角包',
      suggestedStrategy: '规划 3 篇挑食切角测试笔记',
      reason: '探索新增量长尾词',
      dataEvidence: '评论区出现 15 条挑食相关提问',
      impactedScope: '下期测试批次',
      effectivePeriod: '下期 (v2.2)',
      isRevocable: true,
    },
  },
];

export const MOCK_REPORTS_LIST: MerchantReportItem[] = [
  {
    id: 'r1',
    title: '【宠粮大队长】幼犬换粮软便卡位项目 - 阶段运营总结报告 (8月上旬)',
    projectId: 'p1',
    projectName: '幼犬换粮软便卡位项目',
    strategyVersion: 'v2.1体验测评打法',
    dateRange: '2026-08-01 至 2026-08-20',
    createdAt: '2026-08-21 10:00',
    version: 'v1.0 (已确认快照)',
    status: 'published',
    recipientRole: '商家决策层',
    coverageRate: 90.0,
    sections: [
      '项目与统计范围',
      '本周期工作摘要',
      '核心结果总览',
      '内容表现分析',
      '账号矩阵贡献',
      '关键词搜索占位快照',
      '互动与私信线索表现',
      '阶段复盘结论',
      '下一周期调整建议',
      '数据口径与来源说明',
    ],
    showAccountDetails: true,
    showSearchPositioning: true,
    showDMData: true,
    hideInternalLogs: true,
    executiveSummary: '本周期累计发布笔记 20 篇（已同步 18 篇，覆盖率 90%）。核心曝光量突破 28.5 万，互动率 12.7%。“软便避坑”主题展现强劲痛点吸引力，带动 142 组私信对话，捕获 86 组有效种草咨询。搜索占位方面，目标词“幼犬换粮软便怎么办”稳居前3卡位。',
    keyTakeaways: [
      '软便避坑切角转化率显著最高，建议下期提升配置比例。',
      '门店 KOS 账号@阿强 在本地精准客户沟通中展现高转化。',
      '搜索前50位快照中项目笔记占位 3 篇，达成预定卡位目标。',
    ],
  },
  {
    id: 'r2',
    title: '【草稿】幼犬换粮项目 - 8月中旬运营对比简报',
    projectId: 'p1',
    projectName: '幼犬换粮软便卡位项目',
    strategyVersion: 'v2.1体验测评打法',
    dateRange: '2026-08-10 至 2026-08-20',
    createdAt: '2026-08-21 08:30',
    version: 'v0.2 (草稿)',
    status: 'draft',
    recipientRole: '运营项目组',
    coverageRate: 85.0,
    sections: ['核心结果总览', '内容表现分析', '下一周期调整建议'],
    showAccountDetails: false,
    showSearchPositioning: true,
    showDMData: false,
    hideInternalLogs: true,
    executiveSummary: '中期快照数据简报，重点关注二期 KOC 发稿后的流量走势。',
    keyTakeaways: ['KOC二期发稿完结率 100%'],
  },
];
