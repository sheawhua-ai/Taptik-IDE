import {
  SkillItem, MyCapabilityItem, MerchantRecommendation, CapabilityPackageImport
} from './types';

/* Clean Skill Center Skills with Business Chinese Names */
export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'sk_comment_intent',
    name: '评论线索识别',
    oneSentenceDesc: '从笔记评论中识别咨询、购买意向和高价值用户，快速提炼转化线索。',
    processCategory: 'interaction',
    stageLabel: '发布互动',
    source: 'official',
    isComposite: false,
    status: 'needs_config',
    unavailableReason: '需配置评论数据通道接口。',
    version: 'v1.6',
    updatedAt: '2026-08-01',
    lastTestStatus: 'passed',
    lastVerifiedResult: '已在沙盒环境验证评论线索抽样算法',
    usedByExpertsCount: 0,
    usedByProjectsCount: 3,
    usedByExperts: [],
    usedByProjects: ['宠粮新客运营', '幼猫换粮抗应激项目'],

    goal: '从笔记评论中自动识别咨询、购买意向和高价值用户，提取转化为客服待办线索。',
    applicableScenes: ['笔记发布后日常评论监控', '投放爆文高频互动期'],
    inapplicableScenes: ['无评论数据的草稿阶段'],
    inputFormat: ['公开笔记评论文本列表'],
    outputFormat: ['高意向线索表', '用户核心疑问 TOP3', '建议回复引导'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '生成线索通知并上报至交互待办。'
    },
    manualConfirmPoints: ['客服人工勾选确认后再推送到私域系统'],
    evidenceRequirements: ['必须引用真实用户评论词句'],
    failureHandling: '数据源未开启时提示管理员配置评论数据通道。',
    evaluationStandards: ['线索识别准确率 ≥ 93%'],
    versionHistoryNotes: 'v1.6: 支持语义反转识别。',

    preConditions: ['已开启公开评论数据权限'],
    executionSteps: [
      '1. 读取公开评论文本',
      '2. 识别“求链接/哪里买/多少钱”意向词',
      '3. 生成线索卡片'
    ],
    risksAndLimits: ['依赖平台接口读取权限'],

    backendMetadata: {
      executionMode: 'event_driven',
      workflowGraph: 'comment_lead_intent_v2',
      toolDependencies: ['intent_classifier', 'lead_router'],
      dataSourceDependencies: ['xhs_comment_stream_api'],
      agentWorker: 'antigravity-lead-worker',
      timeoutAndBudget: 'Timeout: 10s / Budget: $0.03',
      idempotencyKey: 'xiaohongshu-comment-leads',
      retryPolicy: 'Auto retry on stream break',
      inputOutputSchema: 'JSONSchema: CommentLeadIntentV2',
      evalSetAndThreshold: '200 test comments / accuracy ≥ 93%'
    },

    requiredPermissions: {
      readScope: ['公开笔记评论'],
      writeScope: ['写入线索表'],
      needsNetwork: true,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_xhs_keyword',
    name: '小红书关键词研究',
    oneSentenceDesc: '查找用户正在搜索的关键词、热门趋势和低竞争高转化内容切入机会。',
    processCategory: 'research',
    stageLabel: '商家研究',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v3.1',
    updatedAt: '2026-08-02',
    lastTestStatus: 'passed',
    lastVerifiedResult: '提炼出“幼猫换粮软便”高搜索低竞争痛点',
    usedByExpertsCount: 0,
    usedByProjectsCount: 8,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],

    goal: '查找用户正在搜索的关键词和蓝海机会，提供数据支持的选题切入方案。',
    applicableScenes: ['项目策划阶段选题定位', '爆款内容改写前热词排查'],
    inapplicableScenes: ['纯促销活动方案'],
    inputFormat: ['品牌核心 SKU 明细', '类目关键词榜单'],
    outputFormat: ['低竞争高转化关键词清单', '搜索供需比报告'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '自动生成热词选题并写入项目策略库。'
    },
    manualConfirmPoints: ['选定为主要推广方向时需操盘手点击确认'],
    evidenceRequirements: ['结论必须引用关键词搜索量与笔记供需比'],
    failureHandling: '无数据时拓展为行业父级热词。',
    evaluationStandards: ['提炼关键词平均 CTR 高于大盘 30%'],
    versionHistoryNotes: 'v3.1: 优化受众热词匹配精准度。',

    preConditions: ['具有行业热搜数据快照'],
    executionSteps: [
      '1. 过滤高竞争头部泛词',
      '2. 筛选低笔记数、高搜索增量词',
      '3. 生成关键词选题建议'
    ],
    risksAndLimits: ['热搜词 7 天内有效'],

    backendMetadata: {
      executionMode: 'async_batch',
      workflowGraph: 'xiaohongshu-keyword-tool-graph',
      toolDependencies: ['search_ratio_calculator'],
      dataSourceDependencies: ['search_trends_db'],
      agentWorker: 'antigravity-research-worker',
      timeoutAndBudget: 'Timeout: 30s / Budget: $0.05',
      idempotencyKey: 'xiaohongshu-keyword-tool',
      retryPolicy: 'Single retry on delay',
      inputOutputSchema: 'JSONSchema: KeywordResearchV3',
      evalSetAndThreshold: '100 test keywords / precision ≥ 90%'
    },

    requiredPermissions: {
      readScope: ['搜索趋势榜单'],
      writeScope: ['项目策略中心'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'project'
  },
  {
    id: 'sk_xhs_writer',
    name: '小红书笔记创作',
    oneSentenceDesc: '围绕核心卖点快速生成带视觉排版、高点击标题和口语化种草脚本。',
    processCategory: 'content',
    stageLabel: '内容创作',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v3.2',
    updatedAt: '2026-08-01',
    lastTestStatus: 'passed',
    lastVerifiedResult: '已生成 10 篇差异化种草文案与脚本',
    usedByExpertsCount: 0,
    usedByProjectsCount: 12,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],

    goal: '围绕品牌产品卖点快速批量生成吸睛标题、正文及分镜拍摄脚本。',
    applicableScenes: ['KOC批量种草脚本下发', '自营号每日发文排期'],
    inapplicableScenes: ['公关声明稿'],
    inputFormat: ['产品核心卖点表', '目标达人风格', '红线禁词词库'],
    outputFormat: ['小红书图文文案', '分镜脚本大纲', '推荐标题列表'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: true,
      summary: '自动挂载生成的笔记至对应排期，并可创建拍摄任务。'
    },
    manualConfirmPoints: ['正式下发给外部达人前需由操盘手终审'],
    evidenceRequirements: ['带品牌鉴别卖点及分类标签'],
    failureHandling: '触发违禁词时自动替换为白名单同义词。',
    evaluationStandards: ['原创质感评分 ≥ 90'],
    versionHistoryNotes: 'v3.2: 升级小红书口语化排版引擎。',

    preConditions: ['已配置品牌产品卖点文件'],
    executionSteps: [
      '1. 匹配开头 3 秒爆款钩子',
      '2. 生成口语化文案与图片排版建议',
      '3. 执行禁词自检'
    ],
    risksAndLimits: ['医疗/保健品类词需审核'],

    backendMetadata: {
      executionMode: 'async_batch',
      workflowGraph: 'xhs-writer-flow-v3',
      toolDependencies: ['copywriting_engine', 'compliance_filter'],
      dataSourceDependencies: ['brand_redline_dict'],
      agentWorker: 'antigravity-writer-worker',
      timeoutAndBudget: 'Timeout: 45s / Budget: $0.10',
      idempotencyKey: 'xhs-writer',
      retryPolicy: 'Auto retry on failure',
      inputOutputSchema: 'JSONSchema: XhsWriterV3',
      evalSetAndThreshold: '100 sample notes / pass rate ≥ 95%'
    },

    requiredPermissions: {
      readScope: ['产品卖点', '品牌禁词'],
      writeScope: ['写入笔记列表'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'project'
  },
  {
    id: 'sk_xhs_search',
    name: '小红书热门内容搜索',
    oneSentenceDesc: '实时搜索和分析指定细分类目的爆文结构、互动趋势与对标案例。',
    processCategory: 'research',
    stageLabel: '商家研究',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v2.0',
    updatedAt: '2026-07-28',
    lastTestStatus: 'passed',
    lastVerifiedResult: '搜索分析了 50 篇宠物热销爆文的视觉构图',
    usedByExpertsCount: 0,
    usedByProjectsCount: 5,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],

    goal: '搜索并分析近期热门爆文的标题、封面构图与文案结构。',
    applicableScenes: ['对标案例拆解', '对标竞品投放策略研究'],
    inapplicableScenes: ['非小红书渠道的泛网页搜索'],
    inputFormat: ['行业细分类目词', '对标品牌名称'],
    outputFormat: ['爆文结构分析卡片', '高赞对标案例清单'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: false,
      willCreateMaterialTask: false,
      summary: '输出对标分析报告供策略参考。'
    },
    manualConfirmPoints: ['无'],
    evidenceRequirements: ['需附带被引用爆文的实时互动点赞数'],
    failureHandling: '如网络波动超时提示稍后重试。',
    evaluationStandards: ['热门内容召回率 ≥ 95%'],
    versionHistoryNotes: 'v2.0: 增加对爆款首图色调的拆解。',

    preConditions: ['已连接热门内容检索通道'],
    executionSteps: [
      '1. 检索类目近 7 天高赞爆文',
      '2. 提取爆文封面和开头 3 秒文案特征',
      '3. 生成对标分析报告'
    ],
    risksAndLimits: ['仅包含公开收录的内容'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'xiaohongshu-search-v2',
      toolDependencies: ['search_spider'],
      dataSourceDependencies: ['xhs_trending_corpus'],
      agentWorker: 'antigravity-search-worker',
      timeoutAndBudget: 'Timeout: 15s / Budget: $0.02',
      idempotencyKey: 'xiaohongshu-search',
      retryPolicy: 'Single retry',
      inputOutputSchema: 'JSONSchema: XhsSearchV2',
      evalSetAndThreshold: '100 queries / precision ≥ 95%'
    },

    requiredPermissions: {
      readScope: ['公开爆文数据'],
      writeScope: [],
      needsNetwork: true,
      willModifyData: false
    },
    appScope: 'all'
  },
  {
    id: 'sk_solo_matrix',
    name: '自媒体矩阵运营',
    oneSentenceDesc: '科学规划官方号、店长KOS与KOC分层阵列，管理多账号发布与协同。',
    processCategory: 'strategy',
    stageLabel: '效率工具',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v2.5',
    updatedAt: '2026-07-30',
    lastTestStatus: 'passed',
    lastVerifiedResult: '已生成 1官方+3KOS+20KOC 的分工组合矩阵',
    usedByExpertsCount: 0,
    usedByProjectsCount: 4,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],

    goal: '规划自营账号与合作达人的矩阵架构，制定分层发文职责与 KPI 分配。',
    applicableScenes: ['矩阵账号搭建', '月度达人组合预算拆解'],
    inapplicableScenes: ['单篇文案标点符号修改'],
    inputFormat: ['品牌账号清单', '月度招募/投放预算'],
    outputFormat: ['矩阵组合架构表', '分层账号职责与排期模型'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '写入项目矩阵配置，生成账号排期任务。'
    },
    manualConfirmPoints: ['预算与达人比例方案需操盘手人工审批'],
    evidenceRequirements: ['需引用类目前列品牌的自营/达人比例'],
    failureHandling: '未绑定账号时提供标准基础矩阵模型。',
    evaluationStandards: ['各层级分工清晰无同质冲突'],
    versionHistoryNotes: 'v2.5: 增加导购 KOS 账号规划。',

    preConditions: ['已建档自营账号清单'],
    executionSteps: [
      '1. 评估已有账号资产',
      '2. 计算自营与达人招募配比',
      '3. 生成矩阵排期建议'
    ],
    risksAndLimits: ['达人招募受市场响应周期影响'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'solo-media-matrix-graph',
      toolDependencies: ['matrix_planner'],
      dataSourceDependencies: ['merchant_accounts_db'],
      agentWorker: 'antigravity-matrix-worker',
      timeoutAndBudget: 'Timeout: 20s / Budget: $0.04',
      idempotencyKey: 'solo-media-matrix',
      retryPolicy: 'No retry required',
      inputOutputSchema: 'JSONSchema: SoloMediaMatrixV2',
      evalSetAndThreshold: '50 matrix plans / pass rate ≥ 95%'
    },

    requiredPermissions: {
      readScope: ['商家自营账号'],
      writeScope: ['写入项目配置'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_douyin_analytics',
    name: '抖音内容数据分析',
    oneSentenceDesc: '分析跨平台短视频爆款规律、互动率与跨平台种草带货转化。',
    processCategory: 'review',
    stageLabel: '数据复盘',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v1.8',
    updatedAt: '2026-07-25',
    lastTestStatus: 'passed',
    lastVerifiedResult: '已生成抖音短视频前 3 秒留存归因图谱',
    usedByExpertsCount: 0,
    usedByProjectsCount: 2,
    usedByExperts: [],
    usedByProjects: ['夏日宠物驱虫爆款季'],

    goal: '分析短视频的完播率、互动率及转化表现，提炼跨平台种草规律。',
    applicableScenes: ['短视频爆文归因', '跨平台投放效果复盘'],
    inapplicableScenes: ['纯图文排版检测'],
    inputFormat: ['短视频互动及播放数据表'],
    outputFormat: ['完播留存曲线图', '内容爆款归因卡片'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '生成短视频复盘卡片，可一键保存经验。'
    },
    manualConfirmPoints: ['报告归档前需操盘手确定'],
    evidenceRequirements: ['引用真实播放与互动留存比例'],
    failureHandling: '数据不足时降级为基础互动率分析。',
    evaluationStandards: ['留存节点定位准确率 ≥ 90%'],
    versionHistoryNotes: 'v1.8: 增加黄金 3 秒留存诊断。',

    preConditions: ['已上传短视频投放明细'],
    executionSteps: [
      '1. 解析完播与互动留存曲线',
      '2. 识别丢帧与掉粉节点',
      '3. 给出剪辑与脚本改进方案'
    ],
    risksAndLimits: ['依赖完整播放数据'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'douyin-analytics-graph',
      toolDependencies: ['video_retention_analyzer'],
      dataSourceDependencies: ['video_metrics_db'],
      agentWorker: 'antigravity-analytics-worker',
      timeoutAndBudget: 'Timeout: 20s / Budget: $0.03',
      idempotencyKey: 'douyin-analytics',
      retryPolicy: 'Single retry',
      inputOutputSchema: 'JSONSchema: DouyinAnalyticsV1',
      evalSetAndThreshold: '50 video cases / accuracy ≥ 92%'
    },

    requiredPermissions: {
      readScope: ['短视频数据报表'],
      writeScope: ['写入知识库'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_sop_extractor',
    name: 'SOP流程整理',
    oneSentenceDesc: '从团队日常运营与优秀案例中提炼标准化 SOP 操作指引与核对清单。',
    processCategory: 'experience',
    stageLabel: '效率工具',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v1.2',
    updatedAt: '2026-07-20',
    lastTestStatus: 'passed',
    lastVerifiedResult: '已成功归纳《KOC 审核与下发标准 SOP》',
    usedByExpertsCount: 0,
    usedByProjectsCount: 3,
    usedByExperts: [],
    usedByProjects: ['全量KOC招募计划'],

    goal: '将非标的运营经验和优秀实操总结为可执行的 SOP 核对清单。',
    applicableScenes: ['团队日常经验沉淀', '新员工培训指引制作'],
    inapplicableScenes: ['复杂的技术代码自动重构'],
    inputFormat: ['项目复盘记录', '操作日志'],
    outputFormat: ['SOP 操作步骤清单', '风险自查 CheckList'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: false,
      willCreateMaterialTask: false,
      summary: '直接生成结构化 SOP 文档。'
    },
    manualConfirmPoints: ['SOP 发布入库前需负责人校验'],
    evidenceRequirements: ['基于真实操作成功的项目记录'],
    failureHandling: '经验输入过短时提示补充关键步骤。',
    evaluationStandards: ['生成 SOP 步骤清晰无歧义'],
    versionHistoryNotes: 'v1.2: 优化 Markdown 格式输出。',

    preConditions: ['具有项目复盘文字输入'],
    executionSteps: [
      '1. 梳理核心操作顺序与依赖',
      '2. 提取注意事项与易错卡点',
      '3. 格式化为 SOP 文档'
    ],
    risksAndLimits: ['无'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'sop-extractor-graph',
      toolDependencies: ['text_structurer'],
      dataSourceDependencies: ['sop_template_db'],
      agentWorker: 'antigravity-sop-worker',
      timeoutAndBudget: 'Timeout: 10s / Budget: $0.01',
      idempotencyKey: 'sop-extractor',
      retryPolicy: 'No retry required',
      inputOutputSchema: 'JSONSchema: SopExtractorV1',
      evalSetAndThreshold: '30 cases / clarity score ≥ 95'
    },

    requiredPermissions: {
      readScope: ['项目复盘记录'],
      writeScope: ['商家知识库'],
      needsNetwork: false,
      willModifyData: false
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_cover_audit',
    name: '小红书首图合规校验',
    oneSentenceDesc: '校验首图 3:4 比例、文字遮挡、品牌LOGO与视觉安全区。',
    processCategory: 'material',
    stageLabel: '素材处理',
    dailyTaskTag: 'check_materials',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v1.4',
    updatedAt: '2026-07-20',
    lastTestStatus: 'passed',
    lastVerifiedResult: '检测 142 张图片未发现遮挡',
    usedByExpertsCount: 0,
    usedByProjectsCount: 3,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],

    goal: '快速识别首图的 UI 遮挡、字体比例及图片违禁风险。',
    applicableScenes: ['达人交付首图审核', '品牌设计稿发布前自检'],
    inapplicableScenes: ['纯长文笔记'],
    inputFormat: ['3:4 比例首图文件 (PNG/JPG)'],
    outputFormat: ['首图评估得分', '视觉安全区遮挡标注', '修改建议'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: false,
      willCreateMaterialTask: true,
      summary: '检测未通过时直接发起改图任务。'
    },
    manualConfirmPoints: ['艺术插画类遮挡可由设计师人工二次核验'],
    evidenceRequirements: ['给出遮挡区域具体像素坐标'],
    failureHandling: '图片模糊时提示上传高清图。',
    evaluationStandards: ['双列流首图遮挡识别准确率 ≥ 99%'],
    versionHistoryNotes: 'v1.4: 更新最新 App 端 UI 遮挡规范。',

    preConditions: ['已上传清晰首图'],
    executionSteps: [
      '1. 检查图片尺寸与比例',
      '2. 识别系统顶部/底部 UI 遮挡区域',
      '3. 生成问题标注报告'
    ],
    risksAndLimits: ['极端特殊艺术字体偶发微小误差'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'cover-audit-graph',
      toolDependencies: ['image_ratio_check', 'ocr_text_mask'],
      dataSourceDependencies: ['safe_area_template'],
      agentWorker: 'antigravity-vision-worker',
      timeoutAndBudget: 'Timeout: 5s / Budget: $0.01',
      idempotencyKey: 'cover-audit',
      retryPolicy: 'Single retry',
      inputOutputSchema: 'JSONSchema: CoverAuditV1',
      evalSetAndThreshold: '200 images / precision ≥ 99%'
    },

    requiredPermissions: {
      readScope: ['待审核图片'],
      writeScope: ['生成标注结果'],
      needsNetwork: false,
      willModifyData: false
    },
    appScope: 'all'
  },
  {
    id: 'sk_publish_check',
    name: '发布收录与排名校验',
    oneSentenceDesc: '实时检查已发布笔记的收录状态、关键词搜索排名与展现流。',
    processCategory: 'publish',
    stageLabel: '发布互动',
    dailyTaskTag: 'handle_anomalies',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v2.0',
    updatedAt: '2026-07-21',
    lastTestStatus: 'passed',
    lastVerifiedResult: '监测 210 篇笔记，准确捕捉 5 篇延迟收录',
    usedByExpertsCount: 0,
    usedByProjectsCount: 4,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],

    goal: '自动监控已发布笔记收录与关键词位次，保障流量通路正常。',
    applicableScenes: ['笔记发布后 24 小时排查', '流量预警排查'],
    inapplicableScenes: ['草稿未发布笔记'],
    inputFormat: ['已发布笔记 URL', '目标关键词'],
    outputFormat: ['收录成功/失败状态', '关键词搜索位次'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '未收录时自动生成“自查与申诉待办”。'
    },
    manualConfirmPoints: ['重新申诉前需操盘手人工确认'],
    evidenceRequirements: ['记录探测时间及搜索前 20 位结果'],
    failureHandling: '检测异常时提示操作手客户端自查。',
    evaluationStandards: ['收录监测准确率 ≥ 99.5%'],
    versionHistoryNotes: 'v2.0: 支持短视频与图文统一查询。',

    preConditions: ['笔记发布满 2 小时'],
    executionSteps: [
      '1. 校验标题与主词收录',
      '2. 记录搜索位次',
      '3. 未收录笔记自动预警'
    ],
    risksAndLimits: ['个人推荐算法影响位次微小波动'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'publish-check-graph',
      toolDependencies: ['ranking_spider'],
      dataSourceDependencies: ['search_index_api'],
      agentWorker: 'antigravity-ops-worker',
      timeoutAndBudget: 'Timeout: 8s / Budget: $0.01',
      idempotencyKey: 'publish-check',
      retryPolicy: 'Single retry',
      inputOutputSchema: 'JSONSchema: PublishCheckV2',
      evalSetAndThreshold: '100 tests / accuracy ≥ 99%'
    },

    requiredPermissions: {
      readScope: ['已发布笔记链接'],
      writeScope: ['写入监控日志'],
      needsNetwork: true,
      willModifyData: false
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_attribution',
    name: '爆文率与成本归因拆解',
    oneSentenceDesc: '拆解笔记爆文率、互动成本与转化贡献，归因关键影响因子。',
    processCategory: 'review',
    stageLabel: '数据复盘',
    dailyTaskTag: 'generate_reports',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v1.5',
    updatedAt: '2026-07-16',
    lastTestStatus: 'passed',
    lastVerifiedResult: '归因准确率 89%，提炼 12 项优化结论',
    usedByExpertsCount: 0,
    usedByProjectsCount: 2,
    usedByExperts: [],
    usedByProjects: ['夏日宠物驱虫爆款季'],

    goal: '定量分析爆文原因与低效消耗，将成功因素转化为可复用经验。',
    applicableScenes: ['项目结案复盘', '月度总结归因'],
    inapplicableScenes: ['新发布未满 24 小时的笔记'],
    inputFormat: ['项目投放计划数据', '笔记消耗与互动数据'],
    outputFormat: ['爆文率对比图', 'ROI 归因矩阵', '下一期改进建议'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '生成归因复盘报告卡片。'
    },
    manualConfirmPoints: ['报告下发前需操盘手确认'],
    evidenceRequirements: ['引用真实阅读数与千次互动成本'],
    failureHandling: '消耗数据缺失时提示补充花费数据。',
    evaluationStandards: ['多因子归因误差 < 8%'],
    versionHistoryNotes: 'v1.5: 优化自然流量与投流差值归因模型。',

    preConditions: ['具备完整花费与互动回填'],
    executionSteps: [
      '1. 汇总阅读、点赞、收藏与花费',
      '2. 计算不同选题爆文率',
      '3. 提取可复用策略'
    ],
    risksAndLimits: ['依赖真实消耗数据'],

    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'attribution-graph',
      toolDependencies: ['regression_calculator'],
      dataSourceDependencies: ['project_ledger'],
      agentWorker: 'antigravity-review-worker',
      timeoutAndBudget: 'Timeout: 20s / Budget: $0.05',
      idempotencyKey: 'attribution',
      retryPolicy: 'No retry required',
      inputOutputSchema: 'JSONSchema: AttributionV1',
      evalSetAndThreshold: '50 projects / accuracy ≥ 90%'
    },

    requiredPermissions: {
      readScope: ['项目消耗与互动明细'],
      writeScope: ['写入知识库'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  }
];

export const INITIAL_EXPERTS = [];

/* Enabled My Capabilities */
export const INITIAL_MY_CAPABILITIES: MyCapabilityItem[] = [
  {
    id: 'my_sk_1',
    name: '小红书关键词研究',
    type: 'skill',
    appScope: 'merchant',
    status: 'enabled',
    lastUsed: '10分钟前',
    lastResult: '已提取 5 个低竞争高转化关键词切入点',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[1]
  },
  {
    id: 'my_sk_2',
    name: '小红书笔记创作',
    type: 'skill',
    appScope: 'merchant',
    status: 'enabled',
    lastUsed: '15分钟前',
    lastResult: '已生成 10 篇 KOC 脚本大纲包',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[2]
  },
  {
    id: 'my_sk_3',
    name: '自媒体矩阵运营',
    type: 'skill',
    appScope: 'merchant',
    status: 'enabled',
    lastUsed: '1小时前',
    lastResult: '已建立“1官方+3KOS+20KOC”分工矩阵',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[4]
  },
  {
    id: 'my_sk_4',
    name: '小红书首图合规校验',
    type: 'skill',
    appScope: 'merchant',
    status: 'enabled',
    lastUsed: '昨天',
    lastResult: '通过 142 张首图校验，无安全区遮挡',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[7]
  },
  {
    id: 'my_sk_5',
    name: '评论线索识别',
    type: 'skill',
    appScope: 'merchant',
    status: 'needs_config',
    lastUsed: '未运行',
    lastResult: '需配置评论数据通道接口',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['宠粮新客运营'],
    refData: INITIAL_SKILLS[0]
  }
];

export const mockSkills = INITIAL_SKILLS;
export const initialMyCapabilities = INITIAL_MY_CAPABILITIES;
export const mockRecommendations: MerchantRecommendation[] = [];
export const mockExperts = [];
export const MOCK_IMPORT_PACKAGE: CapabilityPackageImport = {
  type: 'zip',
  detectedType: 'skill',
  name: '小红书竞品对标拆解包',
  purpose: '自动分析竞品高赞笔记的标题结构、封面构图与黄金前3秒文案钩子。',
  source: '外部能力规范包 (vh_xiaohongshu_deconstruct.zip)',
  safetyCheck: {
    readScope: ['分析上传的竞品笔记图文截图与公开文本'],
    writeScope: ['在项目策略库生成竞品拆解卡片'],
    networkAccess: false,
    externalDeps: ['OpenCV Image Processor v2.1'],
    hasExecutableCode: true
  },
  dependenciesAndConflicts: {
    missingDeps: ['建议配合“小红书首图合规校验”共同使用'],
    conflicts: ['与本地技能“小红书笔记创作”无冲突']
  },
  testStatus: 'passed',
  installScope: 'merchant'
};
