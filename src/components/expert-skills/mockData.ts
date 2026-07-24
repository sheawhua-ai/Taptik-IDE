import {
  ExpertItem, SkillItem, MyCapabilityItem, MerchantRecommendation, CapabilityPackageImport
} from './types';

/* 1. Standard Skills */
export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'sk_cover_audit',
    name: '小红书首图合规校验',
    oneSentenceDesc: '校验首图 3:4 比例、文字遮挡、品牌LOGO与视觉安全区。',
    processCategory: 'audit',
    dailyTaskTag: 'check_materials',
    source: 'official',
    status: 'enabled',
    version: 'v1.4',
    updatedAt: '2026-07-20',
    lastTestStatus: 'passed',
    lastVerifiedResult: '沙盒测试通过，拦截排版遮挡风险 18 次',
    usedByExpertsCount: 2,
    usedByProjectsCount: 1,
    usedByExperts: [
      { id: 'exp_material_diag', name: '素材诊断专家' },
      { id: 'exp_content_plan', name: '小红书内容策划专家' }
    ],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '快速识别首图的UI遮挡、字体比例及图片违规禁忌，提升曝光点击率',
    applicableScenes: ['KOC/KOS交付首图审核', '品牌广告排版校验'],
    inapplicableScenes: ['动态视频帧连贯性审核'],
    inputFormat: ['3:4 比例图片文件 (PNG/JPG)', '品牌LOGO与安全区标准'],
    outputFormat: ['首图得分 (0-100)', '视觉安全区遮挡标注图', '文字排版优化建议'],
    preConditions: ['已上传分辨率大于 1080P 的图片'],
    executionSteps: [
      '1. 检查图片比例与分辨率',
      '2. 识别系统顶部/底部UI遮挡区域',
      '3. 分析主体文字大小与对比度',
      '4. 生成标注遮挡与问题的报告'
    ],
    risksAndLimits: ['如遇到极端插画风格可能存在 5% 误判定'],
    failureHandling: '图片模糊时提示“请重新上传高清原图”',
    manualConfirmPoints: ['艺术插画争议图片需设计师二次人工确认'],
    requiredPermissions: {
      readScope: ['用户上传的待审核素材图片'],
      writeScope: ['生成诊断结果标注图'],
      needsNetwork: false,
      willModifyData: false
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_koc_pack',
    name: 'KOC内容结构包提炼',
    oneSentenceDesc: '将品牌卖点提炼为多套KOC分层脚本、拍摄指南与必选关键词。',
    processCategory: 'content',
    dailyTaskTag: 'generate_copy',
    source: 'official',
    status: 'enabled',
    version: 'v2.1',
    updatedAt: '2026-07-22',
    lastTestStatus: 'passed',
    lastVerifiedResult: '沙盒测试通过，生成 3 套分层KOC指南',
    usedByExpertsCount: 2,
    usedByProjectsCount: 1,
    usedByExperts: [
      { id: 'exp_content_plan', name: '小红书内容策划专家' },
      { id: 'exp_project_ops', name: '项目运营专家' }
    ],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '提炼产品卖点为适合素人与种草KOC口吻的拍摄脚本',
    applicableScenes: ['批量KOC种草招募前', 'KOS店长号脚本分发'],
    inapplicableScenes: ['头部大V定制深度创意短视频'],
    inputFormat: ['产品功能卖点与验证假设', '目标KOC类型'],
    outputFormat: ['3套分层脚本大纲', '场景拍摄注意事项清单', '必填标题与正文词'],
    preConditions: ['需具备明确的产品核心卖点数据'],
    executionSteps: [
      '1. 转换产品卖点为日常生活场景',
      '2. 匹配开头3秒情绪钩子',
      '3. 生成带分镜头动作指导的剧本',
      '4. 组合热搜关键词'
    ],
    risksAndLimits: ['涉及医疗健康类广告需人工审核'],
    failureHandling: '卖点缺失时自动暂停并提示补充卖点',
    manualConfirmPoints: ['KOC指南下发前需操盘手人工终审'],
    requiredPermissions: {
      readScope: ['商家产品手册', '已确认卖点表'],
      writeScope: ['写入项目内容包'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'project'
  },
  {
    id: 'sk_comment_intent',
    name: '高意向评论与私域抽取',
    oneSentenceDesc: '识别评论区中的购买意向、疑虑与风险情绪，提取转化线索。',
    processCategory: 'interaction',
    dailyTaskTag: 'organize_docs',
    source: 'official',
    status: 'enabled',
    version: 'v1.6',
    updatedAt: '2026-07-19',
    lastTestStatus: 'passed',
    lastVerifiedResult: '准确归类高意向线索 32 条',
    usedByExpertsCount: 2,
    usedByProjectsCount: 1,
    usedByExperts: [
      { id: 'exp_comment_lead', name: '评论与线索承接专家' },
      { id: 'exp_blue_ocean', name: '蓝海机会研究专家' }
    ],
    usedByProjects: ['宠粮新客运营'],
    
    goal: '快速识别评论区购买信号与用户真实顾虑，提高转化率',
    applicableScenes: ['笔记发布后互动监测', '评论区挖掘未满足需求'],
    inapplicableScenes: ['批量水军刷屏防护'],
    inputFormat: ['笔记评论文本列表', '转化干预规则'],
    outputFormat: ['购买意向分类表', '用户核心疑问TOP3', '建议引导话术'],
    preConditions: ['需提供至少 20 条评论文本'],
    executionSteps: [
      '1. 情绪与语义解析',
      '2. 识别高意向买点词 (如“哪里买/多少钱/怎么换粮”)',
      '3. 匹配最适回复引导'
    ],
    risksAndLimits: ['对网络冷笑话可能存在误判'],
    failureHandling: '标记高争议评论并通知客服',
    manualConfirmPoints: ['高意向线索推送私域前需人工确认'],
    requiredPermissions: {
      readScope: ['笔记评论文本'],
      writeScope: ['私域客服工单系统'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_blue_gen',
    name: '蓝海机会假设生成',
    oneSentenceDesc: '从大盘搜索与用户原声中提炼低竞争高转化的验证假设。',
    processCategory: 'research',
    dailyTaskTag: 'deconstruct_comp',
    source: 'team',
    status: 'enabled',
    version: 'v2.3',
    updatedAt: '2026-07-23',
    lastTestStatus: 'passed',
    lastVerifiedResult: '提炼出“换粮软便”3个蓝海切入点',
    usedByExpertsCount: 2,
    usedByProjectsCount: 1,
    usedByExperts: [
      { id: 'exp_blue_ocean', name: '蓝海机会研究专家' },
      { id: 'exp_merchant_diag', name: '商家诊断专家' }
    ],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '提炼未被红海竞争覆盖的搜索机会，形成可测试假说',
    applicableScenes: ['项目立项', '新爆款切入点挖掘'],
    inapplicableScenes: ['已饱和品类的硬广冲榜'],
    inputFormat: ['商家产品资料', '痛点词库', '历史高意向评论'],
    outputFormat: ['结构化机会假设卡片', '证据来源列表', '建议验证样本'],
    preConditions: ['已具备行业搜索热度与用户原声文本'],
    executionSteps: [
      '1. 匹配低竞争高增长词',
      '2. 按照事实/推断/假设三分法建立假说',
      '3. 输出通过/不通过标准'
    ],
    risksAndLimits: ['极度依赖搜索热度数据的时效性'],
    failureHandling: '数据不足时展示“尚缺信息”',
    manualConfirmPoints: ['假设需由操盘手加入验证计划'],
    requiredPermissions: {
      readScope: ['商家资料库', '搜索大盘热词库'],
      writeScope: ['写入项目策略中心'],
      needsNetwork: false,
      willModifyData: false
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_publish_check',
    name: '发布收录与排名校验',
    oneSentenceDesc: '检查已发布笔记的收录状态、关键词搜索排名与展现基线。',
    processCategory: 'publish',
    dailyTaskTag: 'handle_anomalies',
    source: 'official',
    status: 'enabled',
    version: 'v2.0',
    updatedAt: '2026-07-21',
    lastTestStatus: 'passed',
    lastVerifiedResult: '监测 210 篇笔记，预警 5 篇未收录',
    usedByExpertsCount: 2,
    usedByProjectsCount: 1,
    usedByExperts: [
      { id: 'exp_publish_diag', name: '发布异常诊断专家' },
      { id: 'exp_project_ops', name: '项目运营专家' }
    ],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '自动监控已发布笔记收录与关键词位次',
    applicableScenes: ['发文后24小时监控', '流量异常排查'],
    inapplicableScenes: ['未发布草稿提前预判'],
    inputFormat: ['已发布笔记URL/ID', '目标关键词清单'],
    outputFormat: ['收录成功/失败状态', '关键词搜索位次', '流量警报'],
    preConditions: ['笔记发布超过 2 小时'],
    executionSteps: [
      '1. 校验标题与主词收录',
      '2. 记录前3位及首页排名',
      '3. 未收录笔记自动上报诊断'
    ],
    risksAndLimits: ['受平台个性化推荐策略影响'],
    failureHandling: '检测失败时提示手动在客户端确认',
    manualConfirmPoints: ['未收录笔记重新提交申诉需人工确认'],
    requiredPermissions: {
      readScope: ['已发布笔记元数据'],
      writeScope: ['更新发布监控日志'],
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
    dailyTaskTag: 'generate_reports',
    source: 'from_project',
    status: 'enabled',
    version: 'v1.5',
    updatedAt: '2026-07-16',
    lastTestStatus: 'passed',
    lastVerifiedResult: '归因准确率 89%，提炼 12 项沉淀策略',
    usedByExpertsCount: 1,
    usedByProjectsCount: 1,
    usedByExperts: [
      { id: 'exp_project_review', name: '项目复盘专家' }
    ],
    usedByProjects: ['夏日宠物驱虫爆款季'],
    
    goal: '定量化分析爆文原因，提炼成功要素',
    applicableScenes: ['项目结案复盘', '月度运营归因'],
    inapplicableScenes: ['刚刚发布1小时无稳定数据的笔记'],
    inputFormat: ['项目计划数据', '实际笔记明细与消耗'],
    outputFormat: ['爆文率对比图', 'ROI归因矩阵', '优化建议'],
    preConditions: ['已具备完整的笔记消耗与互动回填数据'],
    executionSteps: [
      '1. 汇总阅读、点赞、收藏、评论与消耗',
      '2. 按选题归类计算爆文率',
      '3. 因子权重计算'
    ],
    risksAndLimits: ['要求消耗数据准确'],
    failureHandling: '缺少数据时提示人工补全真实消耗',
    manualConfirmPoints: ['归因报告下发商家前需操盘手确认'],
    requiredPermissions: {
      readScope: ['项目消耗表', '笔记互动明细'],
      writeScope: ['写入商家知识库'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  }
];

/* 2. Standard Experts */
export const INITIAL_EXPERTS: ExpertItem[] = [
  {
    id: 'exp_merchant_diag',
    name: '商家诊断专家',
    mission: '评估商家资产完整度，识别种草瓶颈与能力缺口，给出能力配置诊断建议',
    description: '深入分析商家现有产品结构、历史笔记资产与类目竞争瓶颈，给出能力配置诊断建议。',
    businessTask: '评估商家资产完整度，识别种草瓶颈与能力缺口，生成诊断报告。',
    scenarioStage: 'diagnosis',
    status: 'enabled',
    monitoring: {
      isMonitoring: true,
      state: '监控中',
      lastCheck: '10分钟前',
      nextCheck: '明天 09:00'
    },
    version: 'v2.1',
    updatedAt: '2026-07-24',
    lastUsedTime: '15分钟前',
    lastRunResult: '识别出“换粮应激类目缺少专业答疑知识库”与“KOS矩阵脚本缺口”',
    hasPendingConfirms: true,
    appScope: 'merchant',
    
    whatItCanDo: [
      '盘点商家知识库、历史笔记与可用技能',
      '对比赛道标杆商家的能力配置',
      '定位关键卡点（如缺少审核技能或私域承接）',
      '输出能力补充建议与诊断卡'
    ],
    whatItWontDoAuto: [
      '不会自动修改商家产品属性与红线规则',
      '不会未经操盘手确认向项目中心写入新策略'
    ],
    applicableScenes: ['新商家入驻准备', '月度运营能力盘点'],
    inputDocs: ['品牌产品手册与主推SKU', '近3个月小红书投效汇总表'],
    outputResults: ['商家种草能力准备度诊断卡', '缺失知识库与推荐补充技能清单'],
    boundSkills: [INITIAL_SKILLS[3]], // 蓝海机会假设生成
    manualConfirmPoints: ['确认诊断得出的改进优先级是否符合本月预算'],
    failureAndMissingInfoHandling: '缺少投放明细时提示“请上传近90天投效汇总表”并保持可手动补充状态',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[3]],
      optionalSkills: [INITIAL_SKILLS[0]],
      replacedSkills: [],
      manualConfirmPoints: ['诊断报告下发商家前需操盘手终审']
    }
  },
  {
    id: 'exp_blue_ocean',
    name: '蓝海机会研究专家',
    mission: '挖掘未被充分满足的用户搜索痛点，构建具备蓝海潜力的选题验证假设',
    description: '结合商家资料、历史项目和市场搜索样本，提出可验证的蓝海切入机会假设。',
    businessTask: '挖掘未被充分满足的用户搜索痛点，构建具备蓝海潜力的选题验证假设。',
    scenarioStage: 'research',
    status: 'enabled',
    version: 'v2.4',
    updatedAt: '2026-07-23',
    lastUsedTime: '10分钟前',
    lastRunResult: '提炼出3个低竞争高转化的“幼猫换粮软便”机会假设',
    hasPendingConfirms: true,
    appScope: 'merchant',
    
    whatItCanDo: [
      '理解商家运营目标与预算约束',
      '检查历史项目数据与已有事实',
      '提炼市场未被充分满足的搜索痛点',
      '构建待验证的蓝海机会假设'
    ],
    whatItWontDoAuto: [
      '不会未经许可将假设直接写入项目发文计划',
      '不会自动进行付费投放开销'
    ],
    applicableScenes: ['项目立项阶段', '寻找差异化爆款切入点'],
    inputDocs: ['品牌核心SKU卖点与成本结构', '历史已投笔记互动及转化数据', '目标客群核心顾虑'],
    outputResults: ['蓝海搜索机会假设卡片', '用户痛点对齐表', '首轮验证方案'],
    boundSkills: [INITIAL_SKILLS[3], INITIAL_SKILLS[2]],
    manualConfirmPoints: [
      '确认拟验证的机会假设方向是否符合品牌红线',
      '确认首轮验证的笔记预算与发文规模'
    ],
    failureAndMissingInfoHandling: '若缺少行业搜索词，标记“尚缺信息”，并提示操盘手补充大盘词表',
    
    runLogs: [
      {
        id: 'log_101',
        timestamp: '2026-07-23 16:30',
        projectName: '幼猫换粮抗应激项目',
        skillsUsed: ['蓝海机会假设生成', '高意向评论与私域抽取'],
        knowledgeCited: ['品牌换粮问答库', '宠粮大盘搜索词表'],
        factsCount: 4,
        inferencesCount: 3,
        manualConfirmStatus: '已确认',
        targetApp: '项目中心 / 策略规划',
        resultSummary: '成功提炼出3个低竞争高转化的“换粮应激软便”机会假设'
      }
    ],
    composition: {
      defaultSkills: [INITIAL_SKILLS[3], INITIAL_SKILLS[2]],
      optionalSkills: [INITIAL_SKILLS[1]],
      replacedSkills: [],
      manualConfirmPoints: ['验证方向写入项目中心前需确认']
    }
  },
  {
    id: 'exp_project_ops',
    name: '项目运营专家',
    mission: '编排项目整体执行方案，连接策略、内容与发布，管控关键里程碑',
    description: '负责把控小红书营销项目的整体节奏、节点调度、任务派发与阶段交付。',
    businessTask: '编排项目整体执行方案，连接策略、内容与发布，管控关键里程碑。',
    scenarioStage: 'strategy',
    status: 'enabled',
    version: 'v1.9',
    updatedAt: '2026-07-22',
    lastUsedTime: '1小时前',
    lastRunResult: '顺利推进“幼猫换粮抗应激”项目进入首轮KOC发文观察期',
    hasPendingConfirms: false,
    appScope: 'merchant',
    
    whatItCanDo: [
      '拆解项目策略为周度任务',
      '调度相关内容与审核技能',
      '跟踪KOC/KOS交付进度',
      '汇总阶段数据并触发评审'
    ],
    whatItWontDoAuto: [
      '不会自动向外部KOC支付费用',
      '不会自动终止未达标项目'
    ],
    applicableScenes: ['小红书营销项目推进', '多节点进度监控'],
    inputDocs: ['项目预算与时间表', '合作KOC/KOS人员名单'],
    outputResults: ['项目主里程碑执行甘特图', '交付产物清单'],
    boundSkills: [INITIAL_SKILLS[1], INITIAL_SKILLS[4]],
    manualConfirmPoints: ['首轮方案确认与预算冻结', '项目止损或加码决策'],
    failureAndMissingInfoHandling: '人员交付延期时触发警报并抄送负责人',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[1], INITIAL_SKILLS[4]],
      optionalSkills: [],
      replacedSkills: [],
      manualConfirmPoints: ['关键里程碑确认']
    }
  },
  {
    id: 'exp_account_matrix',
    name: '账号矩阵规划专家',
    mission: '规划品牌号、店长号(KOS)与KOC矩阵体系，明确账号层级与人设定位',
    description: '针对品牌号、店长号(KOS)与KOC矩阵体系，规划账号层级与定位分工。',
    businessTask: '搭建品牌官方号、KOS店长号与KOC分布金字塔，明确各层级人设与发布频率。',
    scenarioStage: 'account',
    status: 'needs_config',
    version: 'v1.2',
    updatedAt: '2026-07-15',
    lastUsedTime: '2天前',
    lastRunResult: '规划 5 个 KOS 线下店长号人设与引导进店路径',
    hasPendingConfirms: true,
    appScope: 'merchant',
    
    whatItCanDo: ['评估现有账号资产分布', '设定品牌号与店长号分工', '制定矩阵协同传播链路'],
    whatItWontDoAuto: ['不会自动登录账号发布内容', '不会修改个人账号隐私配置'],
    applicableScenes: ['品牌建立KOS矩阵', '品牌多账号定位拆解'],
    inputDocs: ['品牌号与门店/KOS账号列表', '线下门店分布'],
    outputResults: ['账号矩阵定位金字塔', 'KOS人设打造手册'],
    boundSkills: [INITIAL_SKILLS[1]],
    manualConfirmPoints: ['店长号人设定位与导流边界确认'],
    failureAndMissingInfoHandling: '缺少KOS账号口令时提示“请完成账号配置”',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[1]],
      optionalSkills: [],
      replacedSkills: [],
      manualConfirmPoints: ['店长号分配规则需店长确认']
    }
  },
  {
    id: 'exp_content_plan',
    name: '小红书内容策划专家',
    mission: '根据品牌策略与蓝海机会，制定结构化发文排期、内容选题与脚本结构',
    description: '根据品牌策略与蓝海机会，制定结构化发文排期、内容选题与脚本结构。',
    businessTask: '输出高吸引力的笔记选题、创意脚本结构与排期日历。',
    scenarioStage: 'content',
    status: 'enabled',
    version: 'v3.1',
    updatedAt: '2026-07-22',
    lastUsedTime: '1小时前',
    lastRunResult: '生成 10 篇 KOC 笔记 + 2 篇 KOS 店长号的差异化选题排期',
    hasPendingConfirms: false,
    appScope: 'merchant',
    
    whatItCanDo: ['解析项目策略与蓝海机会', '匹配不同账号类型的调性', '设计多维创意脚本'],
    whatItWontDoAuto: ['不会未经人工审核直接将脚本下发给达人'],
    applicableScenes: ['月度内容大盘规划', '大促期间发文排期'],
    inputDocs: ['主推商品与核心策略', '预计发布账号清单'],
    outputResults: ['结构化内容排期日历表', '分账号类型的创意脚本'],
    boundSkills: [INITIAL_SKILLS[1], INITIAL_SKILLS[0]],
    manualConfirmPoints: ['创意脚本方向审核', '发布节点确认'],
    failureAndMissingInfoHandling: '信息不足时按标准保底模版生成并提示人工确认',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[1]],
      optionalSkills: [INITIAL_SKILLS[0]],
      replacedSkills: [],
      manualConfirmPoints: ['创意脚本下发前审核']
    }
  },
  {
    id: 'exp_material_diag',
    name: '素材诊断专家',
    mission: '多维诊断图片与文案素材，定位前3秒跳出与点击率瓶颈，给出微调建议',
    description: '多维诊断图片与文案素材，定位前3秒跳出与点击率瓶颈，给出微调建议。',
    businessTask: '对已生成或已发布的素材进行点击率(CTR)与合规诊断，输出扣分项与优化方案。',
    scenarioStage: 'content',
    status: 'enabled',
    version: 'v1.8',
    updatedAt: '2026-07-18',
    lastUsedTime: '3小时前',
    lastRunResult: '完成 12 张首图诊断，指出 3 处文字被顶部UI遮挡风险',
    hasPendingConfirms: false,
    appScope: 'all',
    
    whatItCanDo: ['提取素材首图与文案特征', '对比高CTR素材模版', '评估视觉安全区'],
    whatItWontDoAuto: ['不会自动修改或替换用户原图'],
    applicableScenes: ['KOC素材交付审核', '素材上架前CTR评估'],
    inputDocs: ['待诊断笔记图片', '当前曝光与点击数据'],
    outputResults: ['素材诊断报告与扣分项', '首图优化改版建议'],
    boundSkills: [INITIAL_SKILLS[0]],
    manualConfirmPoints: ['改版建议需设计师二次裁决'],
    failureAndMissingInfoHandling: '图片模糊时提示重新上传',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[0]],
      optionalSkills: [],
      replacedSkills: [],
      manualConfirmPoints: ['首图修改意见需设计师裁决']
    }
  },
  {
    id: 'exp_publish_diag',
    name: '发布异常诊断专家',
    mission: '排查流量停滞、未被搜索收录及违规限流笔记，给出恢复与修改建议',
    description: '排查流量停滞、未被搜索收录及违规限流笔记，给出恢复与修改建议。',
    businessTask: '诊断发布后的流量异常与违规风控，定位阻碍展现的敏感点并指导修补。',
    scenarioStage: 'interaction',
    status: 'enabled',
    monitoring: {
      isMonitoring: true,
      state: '监控中',
      lastCheck: '10分钟前',
      nextCheck: '明天 09:00'
    },
    version: 'v2.0',
    updatedAt: '2026-07-19',
    lastUsedTime: '昨天',
    lastRunResult: '诊断 1 篇流量限流笔记，定位敏感词并提示修改替换',
    hasPendingConfirms: true,
    appScope: 'merchant',
    
    whatItCanDo: ['校验笔记搜索收录状态', '文本与图片敏感词扫描', '给出修改复核建议'],
    whatItWontDoAuto: ['不会未经确认直接在线删除或编辑已发布笔记'],
    applicableScenes: ['笔记展现异常暴跌', '疑似违规限流排查'],
    inputDocs: ['异常笔记链接/正文全文', '24小时展现曲线'],
    outputResults: ['异常原因定位诊断书', '敏感词标注', '重发指导'],
    boundSkills: [INITIAL_SKILLS[4]],
    manualConfirmPoints: ['确认敏感词删改后是否改变原营销表达'],
    failureAndMissingInfoHandling: '缺少正文文本时标记“需要补充资料”',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[4]],
      optionalSkills: [],
      replacedSkills: [],
      manualConfirmPoints: ['确认重发前删改文本']
    }
  },
  {
    id: 'exp_comment_lead',
    name: '评论与线索承接专家',
    mission: '实时监测高热笔记评论区，识别高购买意向用户，引导私域沉淀与客服对接',
    description: '实时监测高热笔记评论区，识别高购买意向用户，引导私域沉淀与客服对接。',
    businessTask: '分类评论情绪与购买意图，生成精准回复引导语并推送到私域客服中心。',
    scenarioStage: 'interaction',
    status: 'enabled',
    monitoring: {
      isMonitoring: true,
      state: '等待下一次触发',
      lastCheck: '30分钟前',
      nextCheck: '今天 12:00'
    },
    version: 'v1.7',
    updatedAt: '2026-07-20',
    lastUsedTime: '2小时前',
    lastRunResult: '从“换粮软便”笔记评论中抽取 14 条高意向暗号线索',
    hasPendingConfirms: false,
    appScope: 'merchant',
    
    whatItCanDo: ['抓取评论并分类意图', '匹配品牌合规话术', '高价值线索自动抄送客服'],
    whatItWontDoAuto: ['不会用机器人账号在小红书私信违规诱导'],
    applicableScenes: ['高热爆款笔记互动承接', '评论区挖掘线索'],
    inputDocs: ['笔记评论列表', '天猫/私域进店暗号'],
    outputResults: ['分层评论回复策略表', '高意向线索工单'],
    boundSkills: [INITIAL_SKILLS[2]],
    manualConfirmPoints: ['评论区敏感争议性问题需人工介入'],
    failureAndMissingInfoHandling: '暗号规则缺失时提示补充',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[2]],
      optionalSkills: [],
      replacedSkills: [],
      manualConfirmPoints: ['特殊客诉人工接管']
    }
  },
  {
    id: 'exp_project_review',
    name: '项目复盘专家',
    mission: '对比实际爆文率与预期ROI，多维归因影响因子并沉淀长效经验规范',
    description: '对比实际爆文率与预期ROI，多维归因影响因子并沉淀长效经验规范。',
    businessTask: '计算项目爆文率、互动成本与溢出效果，将成功模式升格为标准技能。',
    scenarioStage: 'review',
    status: 'enabled',
    version: 'v2.2',
    updatedAt: '2026-07-21',
    lastUsedTime: '4天前',
    lastRunResult: '完成“夏日宠物驱虫”复盘，归因成功要素为“真实养宠人场景拍摄”',
    hasPendingConfirms: false,
    appScope: 'merchant',
    
    whatItCanDo: ['对齐计划KPI与实际数据', '计算爆文率与互动成本', '归因因子权重'],
    whatItWontDoAuto: ['不会自动改写已有项目历史成果'],
    applicableScenes: ['项目周期结案', '策略模式归因总结'],
    inputDocs: ['初始目标与实际发文数据', '后端店铺咨询与转化反馈'],
    outputResults: ['项目结案复盘报告', '爆文归因与失败要素分析'],
    boundSkills: [INITIAL_SKILLS[5]],
    manualConfirmPoints: ['归因结论写入商家知识库需确认'],
    failureAndMissingInfoHandling: '缺乏数据时提示补齐真实消耗',
    
    runLogs: [],
    composition: {
      defaultSkills: [INITIAL_SKILLS[5]],
      optionalSkills: [],
      replacedSkills: [],
      manualConfirmPoints: ['归因结论写入商家知识库需操盘手确认']
    }
  }
];

/* 3. Merchant Recommendations */
export const INITIAL_MERCHANT_RECOMMENDATIONS: MerchantRecommendation[] = [
  {
    id: 'rec_1',
    type: 'expert',
    targetName: '商家诊断专家',
    triggerFact: '当前商家“皇家宠物食品”近30天未进行种草资产与知识库完整度盘点。',
    problemSolved: '解决商家知识库缺口（如缺KOS授权与私域暗号协议），防范后期发文中断。',
    requiredDocsAndConfigs: ['需读取《皇家宠物食品产品手册》与《近90天投放明细表》。'],
    manualConfirmPoints: ['诊断得出的改进优先级下发前需操盘手人工确认。'],
    prepStatus: '可直接运行',
    confirmedFacts: [
      '商家已上传《皇家宠物食品产品手册》',
      '过去 30 天内无知识库健康度诊断记录'
    ],
    systemInferences: [
      '换粮应激类目可能缺乏标准化问答知识库'
    ],
    missingInfo: [
      '尚缺天猫后端真实转化率回填协议'
    ],
    itemData: INITIAL_EXPERTS[0]
  },
  {
    id: 'rec_2',
    type: 'skill',
    targetName: '高意向评论与私域抽取',
    triggerFact: '“幼猫换粮抗应激”最新发布的 3 篇笔记评论量突破 120 条，包含大量咨询购粮路径信息。',
    problemSolved: '快速提取高意向线索，避免错过最佳干预窗口。',
    requiredDocsAndConfigs: ['需配置《私域客服对接引导话术》。'],
    manualConfirmPoints: ['抽取的线索推送客服前需人工点击确认。'],
    prepStatus: '需要完成配置',
    confirmedFacts: [
      '最新 3 篇笔记累计评论数 124 条',
      '其中 18 条包含“哪里买/求链接”字样'
    ],
    systemInferences: [
      '当前评论区存在约 15% 的高意向转化购买信号'
    ],
    missingInfo: [
      '未配置客服引导微信/暗号表'
    ],
    itemData: INITIAL_SKILLS[2]
  }
];

/* 4. My Capabilities List */
export const INITIAL_MY_CAPABILITIES: MyCapabilityItem[] = [
  {
    id: 'my_cap_1',
    name: '蓝海机会研究专家',
    type: 'expert',
    appScope: 'merchant',
    status: 'enabled',
    lastUsed: '10分钟前',
    lastResult: '提炼出3个换粮痛点机会假设',
    pendingConfirmCount: 1,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_EXPERTS[1]
  },
  {
    id: 'my_cap_2',
    name: '小红书内容策划专家',
    type: 'expert',
    appScope: 'project',
    status: 'enabled',
    lastUsed: '1小时前',
    lastResult: '生成 12 篇 KOC 排期与脚本包',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_EXPERTS[4]
  },
  {
    id: 'my_cap_3',
    name: '小红书首图合规校验',
    type: 'skill',
    appScope: 'all',
    status: 'enabled',
    lastUsed: '昨天',
    lastResult: '沙盒校验通过，完成 142 张图片安全区检测',
    usedByExpertsOrProjects: ['素材诊断专家', '内容策划专家'],
    refData: INITIAL_SKILLS[0]
  },
  {
    id: 'my_cap_4',
    name: 'KOC内容结构包提炼',
    type: 'skill',
    appScope: 'task',
    status: 'needs_config',
    lastUsed: '3天前',
    lastResult: '等待设置品牌禁用词',
    usedByExpertsOrProjects: ['内容策划专家'],
    refData: INITIAL_SKILLS[1]
  },
  {
    id: 'my_cap_5',
    name: '爆文逻辑蒸馏草稿',
    type: 'skill',
    appScope: 'task',
    status: 'test_failed',
    lastUsed: '未运行',
    lastResult: '本地测试未通过：格式缺字段',
    usedByExpertsOrProjects: [],
    refData: INITIAL_SKILLS[3]
  }
];

/* 5. Mock Import Package Data */
export const MOCK_IMPORT_PACKAGE: CapabilityPackageImport = {
  type: 'zip',
  detectedType: 'expert',
  name: '小红书竞品对标拆解专家',
  purpose: '自动分析竞品高赞笔记的标题结构、封面构图与黄金前3秒文案钩子。',
  source: '外部开源能力包 (vh_xiaohongshu_deconstruct.zip)',
  safetyCheck: {
    readScope: ['分析上传的竞品笔记图文截图与公开文本'],
    writeScope: ['在项目策略库生成竞品拆解卡片'],
    networkAccess: false,
    externalDeps: ['OpenCV Image Processor v2.1'],
    hasExecutableCode: true
  },
  dependenciesAndConflicts: {
    missingDeps: ['需关联“小红书首图合规校验”标准技能'],
    conflicts: ['与本地技能“KOC内容结构包提炼”无冲突']
  },
  testStatus: 'passed',
  installScope: 'merchant'
};

// Export aliases
export const mockExperts = INITIAL_EXPERTS;
export const mockSkills = INITIAL_SKILLS;
export const mockRecommendations = INITIAL_MERCHANT_RECOMMENDATIONS;
export const initialMyCapabilities = INITIAL_MY_CAPABILITIES;

