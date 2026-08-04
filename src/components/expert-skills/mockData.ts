import {
  ExpertItem, SkillItem, MyCapabilityItem, MerchantRecommendation, CapabilityPackageImport
} from './types';

/* 1. Standard & Composite Skills (All Capabilities as Skills) */
export const INITIAL_SKILLS: SkillItem[] = [
  // --- 复合技能：原有6大专家迁移为业务契约技能 ---
  {
    id: 'sk_comp_merchant_diag',
    name: '商家诊断',
    oneSentenceDesc: '评估商家种草资产完整度，识别类目瓶颈与知识缺口，自动生成能力配置建议。',
    processCategory: 'diagnosis',
    stageLabel: '商家诊断与能力建设',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v3.0',
    updatedAt: '2026-08-01',
    lastTestStatus: 'passed',
    lastVerifiedResult: '回归测验通过：识别出品牌知识库中缺少“过敏换粮专问解答”协议',
    usedByExpertsCount: 0,
    usedByProjectsCount: 5,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目', '皇家宠物全域种草季'],
    
    // 10大业务契约要素
    goal: '解决商家入驻与启动阶段资产诊断不清、投前准备度不足、缺少关键知识库和对应技能配置的问题。',
    applicableScenes: ['新商家入驻初始化', '月度复盘与下一阶段投效诊断', '类目竞争格局突变时的诊断'],
    inapplicableScenes: ['日常发文后的单条互动评论回复'],
    inputFormat: ['品牌产品手册与主推 SKU 名录', '近 90 天小红书历史投效与投放结构数据', '类目核心竞品清单'],
    outputFormat: ['商家种草资产准备度评分 (0-100)', '关键能力与知识库缺口诊断卡', '推荐补充技能与规则清单'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '自动生成待办“补充商家缺失知识库”，并可一键写入商家运营基础规范。'
    },
    manualConfirmPoints: ['诊断报告中的改进优先级结论下发前需操盘手人工确认', '涉及额外投放预算调整的建议需商家确认'],
    evidenceRequirements: ['必须引用过去 90 天笔记自然流量占比与点击率均值', '必须引用竞品前 10 名的平均发布频次'],
    failureHandling: '如历史投放数据缺失，自动切换为“零基础诊断模式”，并提示上传历史报表。',
    evaluationStandards: ['准确识别至少 80% 的知识库缺口；诊断结论在商家验收反馈中满意度 ≥ 90%。'],
    versionHistoryNotes: 'v3.0：全面迁移为复合技能契约，支持零基础诊断；不影响已运行项目的历史配置。',
    
    preConditions: ['商家已建档并配置基本行业类目'],
    executionSteps: [
      '1. 读取商家资产与品牌调性文件',
      '2. 结合品类大盘基线计算准备度分数',
      '3. 生成资产短板与补强策略'
    ],
    risksAndLimits: ['依赖平台大盘基线数据的实时性'],
    
    backendMetadata: {
      executionMode: 'async_batch',
      workflowGraph: 'merchant_audit_flow_v3',
      toolDependencies: ['kb_analyzer', 'comp_index_reader'],
      dataSourceDependencies: ['xiaohongshu_category_benchmark_db'],
      agentWorker: 'antigravity-merchant-agent-v2',
      timeoutAndBudget: 'Timeout: 60s / Budget: $0.15',
      idempotencyKey: 'merchant_diag_${merchantId}_${date}',
      retryPolicy: 'Exponential backoff, max 3 retries',
      inputOutputSchema: 'JSONSchema: MerchantDiagContractV3',
      evalSetAndThreshold: '50 standard merchants test set / threshold ≥ 92%'
    },
    
    requiredPermissions: {
      readScope: ['商家基础信息', '知识库目录', '历史投效数据'],
      writeScope: ['写入诊断日志与待办中心'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_comp_blue_ocean',
    name: '蓝海机会研究',
    oneSentenceDesc: '从搜索大盘与用户真实原声中提炼低竞争、高转化的切入点与选题验证假设。',
    processCategory: 'research',
    stageLabel: '蓝海机会挖掘',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v3.1',
    updatedAt: '2026-08-02',
    lastTestStatus: 'passed',
    lastVerifiedResult: '沙盒回归通过：提炼出“幼猫换粮软便与益生菌组合”3大潜力假设',
    usedByExpertsCount: 0,
    usedByProjectsCount: 8,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '发掘未被红海激烈竞争覆盖的用户搜索痛点，构建高赞、高转化潜力的内容切入假设。',
    applicableScenes: ['项目策划初期选题规划', '遇冷爆款复兴方案设计', '新 SKU 上市冷启动定位'],
    inapplicableScenes: ['大促冲量阶段的纯硬广投放'],
    inputFormat: ['商家主推产品核心卖点表', '行业近 30 天热门搜索关键词榜单', '竞品未满意的负评与提问样集'],
    outputFormat: ['3-5 组结构化蓝海机会假设卡片', '搜索供需比及竞争热度图册', '最小可验证通过标准 (MVP测试方案)'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '自动生成可测试选题策略并写入项目策略库，生成“启动实验探针笔记”待办。'
    },
    manualConfirmPoints: ['将蓝海切入点正式设为项目主要战略方向时需操盘手勾选确认'],
    evidenceRequirements: ['结论必须引用关键词日均搜索量及竞品篇数供需比', '必须列举至少 5 条真实用户提问原文'],
    failureHandling: '当指定细分类目搜索数据不足时，自动拓展为相邻上位类目进行推演，并明确标注数据粒度变化。',
    evaluationStandards: ['提炼假设在投产验证测试中阅读中位数高于大盘均值 35% 以上才计为有效通过。'],
    versionHistoryNotes: 'v3.1：增强对细分人群意图识别能力，历史方案无兼容性冲突。',
    
    preConditions: ['已关联品类关键词热度快照'],
    executionSteps: [
      '1. 过滤高红海头部的泛流量词',
      '2. 识别低笔记数、高搜索升幅痛点',
      '3. 构建“事实-推测-验证方法”假说'
    ],
    risksAndLimits: ['热词变动较快，假设建议 7 天内完成测试'],
    
    backendMetadata: {
      executionMode: 'async_batch',
      workflowGraph: 'blue_ocean_research_graph_v3',
      toolDependencies: ['search_demand_ratio_calc', 'sentiment_extractor'],
      dataSourceDependencies: ['search_trends_daily_db', 'ugc_comment_sample_db'],
      agentWorker: 'antigravity-research-agent-v3',
      timeoutAndBudget: 'Timeout: 90s / Budget: $0.20',
      idempotencyKey: 'blue_ocean_${skuId}_${week}',
      retryPolicy: 'Retry once on DB timeout',
      inputOutputSchema: 'JSONSchema: BlueOceanHypothesisV3',
      evalSetAndThreshold: '100 historical blue ocean cases / precision ≥ 88%'
    },
    
    requiredPermissions: {
      readScope: ['搜索趋势库', '竞品笔记摘要'],
      writeScope: ['项目策略中心选题表'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'project'
  },
  {
    id: 'sk_comp_project_ops',
    name: '项目推进与异常处理',
    oneSentenceDesc: '全面监控项目排期执行、笔记发布收录状态及转化波动，自动发现并干预卡点。',
    processCategory: 'strategy',
    stageLabel: '项目推进与异常排查',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v2.8',
    updatedAt: '2026-08-01',
    lastTestStatus: 'passed',
    lastVerifiedResult: '回归测验通过：自动捕捉 2 篇收录延迟并触发处理工单',
    usedByExpertsCount: 0,
    usedByProjectsCount: 4,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '解决项目落地执行过程中发文拖延、收录失败、评论风险与流量预警滞后问题。',
    applicableScenes: ['项目处于执行期或持续放量期', '每日巡检与异常处理流程'],
    inapplicableScenes: ['无笔记资产的空项目'],
    inputFormat: ['项目日程排期表与达人清单', '笔记实时收录状态及互动增量流', '项目目标与时间线约束'],
    outputFormat: ['每日运营健康度日报', '发文收录异常处理单', '执行拖延预警与追责提议'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: true,
      summary: '直接在操作台创建异常处理待办，若图片判定违规可自动发起“重制首图素材任务”。'
    },
    manualConfirmPoints: ['涉及扣减合作KOC佣金或取消合约协议需操盘手确定', '异常工单指派他人处理时需确认'],
    evidenceRequirements: ['异常警告必须附带笔记真实状态码与发文时间戳', '必须对比该达人前次笔记平均互动数据'],
    failureHandling: '如接口拉取状态失败，自动降级为“待人工核验”，并提示进行客户端页面自查。',
    evaluationStandards: ['异常收录在 2 小时内100%发现，预警建议误报率低于 3%。'],
    versionHistoryNotes: 'v2.8：支持达人违规重测；原有排期规则自动同步。',
    
    preConditions: ['项目已绑定生效的监控标签'],
    executionSteps: [
      '1. 轮询项目内生效笔记与排期计划',
      '2. 比对实际交付时间与互动水平',
      '3. 生成问题定位并建议解决方案'
    ],
    risksAndLimits: ['收录判定可能受网络或账号权重短时影响'],
    
    backendMetadata: {
      executionMode: 'event_driven',
      workflowGraph: 'project_ops_monitor_graph',
      toolDependencies: ['index_checker', 'schedule_diff_calc'],
      dataSourceDependencies: ['project_tasks_db', 'xhs_realtime_status_api'],
      agentWorker: 'antigravity-ops-agent-v2',
      timeoutAndBudget: 'Timeout: 30s / Budget: $0.08',
      idempotencyKey: 'proj_ops_${projectId}_${hour}',
      retryPolicy: 'Auto retry 3 times with jitter',
      inputOutputSchema: 'JSONSchema: ProjectOpsHealthCheckV2',
      evalSetAndThreshold: '200 simulated anomaly tasks / recall ≥ 99%'
    },
    
    requiredPermissions: {
      readScope: ['项目日志表', '排期清单', '笔记监控状态'],
      writeScope: ['创建项目待办', '发起素材工单'],
      needsNetwork: true,
      willModifyData: true
    },
    appScope: 'project'
  },
  {
    id: 'sk_comp_account_matrix',
    name: '账号矩阵规划',
    oneSentenceDesc: '科学分层品牌官方号、店长专业KOS与种草达人KOC，规划发文职责与协同阵列。',
    processCategory: 'account',
    stageLabel: '账号与矩阵规划',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v2.5',
    updatedAt: '2026-07-30',
    lastTestStatus: 'passed',
    lastVerifiedResult: '测验通过：生成“1官方+3KOS+20KOC”的分层打法矩阵',
    usedByExpertsCount: 0,
    usedByProjectsCount: 3,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '解决品牌账号定位重叠、人设混乱、发文同质化及发文比例无法支撑流量突围的困境。',
    applicableScenes: ['账号矩阵初始化', '季度投放达人组合预算分配', '人设与栏目升级'],
    inapplicableScenes: ['单篇爆款文案微调'],
    inputFormat: ['品牌全年/月度运营目标与预算范围', '现有自营账号人设档案表', '达人偏好标签与合作层级库'],
    outputFormat: ['账号矩阵金字塔组合架构表', '各层级人设规范与栏目规划书', '月度互动 KPI 分配模型'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '写入项目矩阵规划设定，生成各人设账号排期准备任务。'
    },
    manualConfirmPoints: ['确认达人采购预算分配与 KOC/KOS 比例方案时需人工签署'],
    evidenceRequirements: ['必须结合类目前 10 品牌的“自营 VS 达人”成交占比数据', '必须提供单个账号预期粉丝增长基线'],
    failureHandling: '若商家未绑定自营账号，默认给出“标准轻量化矩阵推荐模型”。',
    evaluationStandards: ['矩阵分工互补无冲突；测试项目中账号平均留存时长提升 20% 以上。'],
    versionHistoryNotes: 'v2.5：增加专业KOS导购号人设模板库。',
    
    preConditions: ['已确定品牌目标受众群与主推核心品类'],
    executionSteps: [
      '1. 评估商家已有账号资产矩阵',
      '2. 计算自营与达人招募杠杆配比',
      '3. 生成层级角色职责清单'
    ],
    risksAndLimits: ['实际招聘或商务触达KOC可能有一定招募周期'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'account_matrix_design_flow',
      toolDependencies: ['matrix_pyramid_generator', 'budget_allocator'],
      dataSourceDependencies: ['merchant_accounts_db', 'influencer_tier_benchmark'],
      agentWorker: 'antigravity-account-agent-v2',
      timeoutAndBudget: 'Timeout: 45s / Budget: $0.10',
      idempotencyKey: 'matrix_${merchantId}_${quarter}',
      retryPolicy: 'No retry required (deterministic generation)',
      inputOutputSchema: 'JSONSchema: AccountMatrixContractV2',
      evalSetAndThreshold: '40 industry matrix scenarios / pass rate ≥ 95%'
    },
    
    requiredPermissions: {
      readScope: ['商家自营账号列表', '投放预算设置'],
      writeScope: ['写入项目规划配置'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_comp_content_plan',
    name: '内容批次策划',
    oneSentenceDesc: '围绕核心选题与卖点，规模化生成包含标题钩子、脚本架构与拍摄清单的内容批次。',
    processCategory: 'content',
    stageLabel: '内容与排期策划',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v3.2',
    updatedAt: '2026-08-01',
    lastTestStatus: 'passed',
    lastVerifiedResult: '回归通过：批量生成 10 篇首创抗应激猫粮分层脚本包，未触发同质化警告',
    usedByExpertsCount: 0,
    usedByProjectsCount: 12,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目', '全量KOC招募计划'],
    
    goal: '解决手动编写内容效率低、素人达人产出同质化严重、品牌卖点无法准确翻译为种草口语的问题。',
    applicableScenes: ['批量 KOC 招募下发拍摄脚本', '品牌月度自营号短视频文案策划', '爆文改写与裂变'],
    inapplicableScenes: ['仅修改单行标题错误'],
    inputFormat: ['项目策略方案及确定的篇数 (如 10 篇 KOC 笔记)', '产品卖点表及相关红线词表', '达人分层口吻设定'],
    outputFormat: ['分篇分镜拍摄脚本清单', '高转化标题候选题库 (每篇 3 个可选)', '笔记关键词标签推荐表'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: true,
      summary: '按照方案设定数量直接生成正文方案，自动挂载到具体项目笔记，可触发首图设计指令。'
    },
    manualConfirmPoints: ['正式批量下发给达人或提交自动发布队列前必须由操盘手全检或抽检确认'],
    evidenceRequirements: ['脚本必填搜索词需标注其所属话题月度浏览量', '必带产品特定鉴别优势卖点'],
    failureHandling: '若生成过程中遇到违禁敏感词，自动进行白名单近义词替换并标注提醒。',
    evaluationStandards: ['10 篇内部文字重合度低于 25%；违禁词拦截率 100%；原创质感评分 ≥ 88。'],
    versionHistoryNotes: 'v3.2：修复批量生成条数未与方案计划同步的问题，严格遵循项目设置参数。',
    
    preConditions: ['项目方案中设定了合理的 KOC/KOS 篇数指标'],
    executionSteps: [
      '1. 读取方案确定的规划篇数与卖点',
      '2. 基于小红书口语化排版引擎分层创作',
      '3. 执行禁词自检与差异化打散'
    ],
    risksAndLimits: ['建议同时配合合规检测技能终审'],
    
    backendMetadata: {
      executionMode: 'async_batch',
      workflowGraph: 'batch_content_generation_graph_v3',
      toolDependencies: ['copywriting_engine', 'compliance_filter', 'deduplication_checker'],
      dataSourceDependencies: ['brand_redline_dict', 'xhs_trending_hooks_db'],
      agentWorker: 'antigravity-content-agent-v3',
      timeoutAndBudget: 'Timeout: 120s / Budget: $0.35',
      idempotencyKey: 'content_batch_${projectId}_${planId}',
      retryPolicy: 'Auto retry individual note chunk on failure',
      inputOutputSchema: 'JSONSchema: ContentBatchPlanContractV3',
      evalSetAndThreshold: '1000 generated notes uniqueness benchmark / pass rate ≥ 96%'
    },
    
    requiredPermissions: {
      readScope: ['项目策略表', '产品卖点与禁词'],
      writeScope: ['写入项目笔记明细数据库'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'project'
  },
  {
    id: 'sk_comp_material_diag',
    name: '素材表现诊断',
    oneSentenceDesc: '综合评估图文与视频素材的 CTR、完播率及视觉美学，输出优化裁剪与重构策略。',
    processCategory: 'material',
    stageLabel: '素材与审核管理',
    source: 'official',
    isComposite: true,
    status: 'enabled',
    version: 'v2.4',
    updatedAt: '2026-07-29',
    lastTestStatus: 'passed',
    lastVerifiedResult: '回归测验通过：准确找出首图文案对比度过低、前 3 秒卡顿问题',
    usedByExpertsCount: 0,
    usedByProjectsCount: 6,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '解决广告投放点击率低、素材复用老化、视觉安全区被系统 UI 遮挡及转化链路掉落问题。',
    applicableScenes: ['图文/视频发文前审核', '投放素材 CTR 下滑快速归因', '首图 A/B 测试建议'],
    inapplicableScenes: ['无视觉素材的纯文本处理'],
    inputFormat: ['图文海报或视频短片素材文件', '配套标题与目标点击率预期值', '素材投放后转化流失阶段报表'],
    outputFormat: ['视觉诊断热力图及遮挡标记图', '首图 CTR 预估及排版改进意见', '分秒级完播留存建议建议（针对视频）'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: true,
      summary: '将诊断结果绑定至相应笔记，自动生成优化素材工单并通知设计人员。'
    },
    manualConfirmPoints: ['若判定将淘汰某高耗资制作的原素材，需操盘手或设计主管人工确认'],
    evidenceRequirements: ['诊断需明确引用同品类点击率前 20% 爆文的画面饱和度与字体比例参数'],
    failureHandling: '遇到不支持的视频或特殊 RAW 格式，提示上传标准 MP4 或 JPG/PNG。',
    evaluationStandards: ['安全区遮挡识别准确率 ≥ 99%；优化后首图 A/B 实验胜出率提升 18% 以上。'],
    versionHistoryNotes: 'v2.4：集成视觉注意图热力预测模型；保持全兼容。',
    
    preConditions: ['已上传有效清晰度的素材图集'],
    executionSteps: [
      '1. 视觉构图与品牌色彩一致性识别',
      '2. 小红书双列 UI 遮挡区域安全测验',
      '3. 生成问题标签并输出重构样图'
    ],
    risksAndLimits: ['不同屏幕尺寸比例的设备上略有安全区微小偏差'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'material_visual_diag_pipeline',
      toolDependencies: ['vision_ui_masking_tool', 'ctr_predictor_v2'],
      dataSourceDependencies: ['xhs_ui_layout_spec_db', 'high_ctr_benchmark_images'],
      agentWorker: 'antigravity-vision-agent-v2',
      timeoutAndBudget: 'Timeout: 25s / Budget: $0.12',
      idempotencyKey: 'mat_diag_${materialId}',
      retryPolicy: 'Retry once on Vision Engine busy',
      inputOutputSchema: 'JSONSchema: MaterialDiagnosisContractV2',
      evalSetAndThreshold: '300 standard test creative images / accuracy ≥ 95%'
    },
    
    requiredPermissions: {
      readScope: ['待检测素材文件', '互动反馈数据'],
      writeScope: ['写入素材评审结论与修改工单'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'all'
  },

  // --- 标准技能与原子技能 (Standard Skills) ---
  {
    id: 'sk_cover_audit',
    name: '小红书首图合规校验',
    oneSentenceDesc: '校验首图 3:4 比例、文字遮挡、品牌LOGO与视觉安全区。',
    processCategory: 'audit',
    stageLabel: '素材与审核管理',
    dailyTaskTag: 'check_materials',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v1.4',
    updatedAt: '2026-07-20',
    lastTestStatus: 'passed',
    lastVerifiedResult: '沙盒测试通过，拦截排版遮挡风险 18 次',
    usedByExpertsCount: 0,
    usedByProjectsCount: 3,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '快速识别首图的 UI 遮挡、字体比例及图片违规禁忌，提升曝光点击率并避免被下架。',
    applicableScenes: ['KOC/KOS交付首图审核', '品牌广告排版校验'],
    inapplicableScenes: ['动态视频帧连贯性审核'],
    inputFormat: ['3:4 比例图片文件 (PNG/JPG)', '品牌LOGO与安全区标准'],
    outputFormat: ['首图得分 (0-100)', '视觉安全区遮挡标注图', '文字排版优化建议'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: false,
      willCreateMaterialTask: true,
      summary: '检测通过后更新素材状态，如未通过直接发起“素材改图任务”。'
    },
    manualConfirmPoints: ['艺术插画类争议遮挡需设计师二次人工确认'],
    evidenceRequirements: ['需要明确列举被遮挡字体的边界坐标像素值'],
    failureHandling: '图片分辨率低于 720P 时自动返回“图片过于模糊，请重新上传高清原图”。',
    evaluationStandards: ['系统双列流首图文字遮挡误检率 < 1%。'],
    versionHistoryNotes: 'v1.4：支持小红书最新底栏关注按钮 UI 遮挡检测。',
    
    preConditions: ['已上传分辨率大于 1080P 的图片'],
    executionSteps: [
      '1. 检查图片比例与分辨率',
      '2. 识别系统顶部/底部 UI 遮挡区域',
      '3. 分析主体文字大小与对比度',
      '4. 生成标注遮挡与问题的报告'
    ],
    risksAndLimits: ['极端特殊字体或美术背景可能产生偶发误判'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'image_audit_fast_flow',
      toolDependencies: ['image_ratio_check', 'ocr_text_mask_eval'],
      dataSourceDependencies: ['xhs_safe_area_template_2026'],
      agentWorker: 'antigravity-vision-worker-lite',
      timeoutAndBudget: 'Timeout: 5s / Budget: $0.01',
      idempotencyKey: 'cover_audit_${fileHash}',
      retryPolicy: 'Immediate single retry',
      inputOutputSchema: 'JSONSchema: CoverAuditSpecV1',
      evalSetAndThreshold: '500 cover cases / precision ≥ 99%'
    },
    
    requiredPermissions: {
      readScope: ['用户上传的待审核素材图片'],
      writeScope: ['生成诊断结果标注图'],
      needsNetwork: false,
      willModifyData: false
    },
    appScope: 'all'
  },
  {
    id: 'sk_koc_pack',
    name: 'KOC内容结构包提炼',
    oneSentenceDesc: '将品牌卖点提炼为多套 KOC 分层脚本、拍摄指南与必选关键词。',
    processCategory: 'content',
    stageLabel: '内容与排期策划',
    dailyTaskTag: 'generate_copy',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v2.1',
    updatedAt: '2026-07-22',
    lastTestStatus: 'passed',
    lastVerifiedResult: '沙盒测试通过，生成 3 套分层 KOC 指南',
    usedByExpertsCount: 0,
    usedByProjectsCount: 2,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '提炼产品卖点为适合素人与种草 KOC 口吻的拍摄脚本与指南。',
    applicableScenes: ['批量 KOC 种草招募前', 'KOS 店长号脚本分发'],
    inapplicableScenes: ['头部大 V 定制深度创意短视频'],
    inputFormat: ['产品功能卖点与验证假设', '目标 KOC 达人类型'],
    outputFormat: ['3 套分层脚本大纲', '场景拍摄注意事项清单', '必填标题与正文词'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '写入项目内容排期策略，并建立发文宣导任务单。'
    },
    manualConfirmPoints: ['KOC 指南下发外部达人群前需操盘手人工终审'],
    evidenceRequirements: ['脚本必填词需关联在播热点及类目搜索趋势'],
    failureHandling: '卖点缺失时自动暂停并提示“补充产品核心卖点白皮书”。',
    evaluationStandards: ['KOC 实际采纳率 ≥ 85%；生成内容语句通顺无违禁词。'],
    versionHistoryNotes: 'v2.1：优化对素人日常口播习惯的对齐规则。',
    
    preConditions: ['需具备明确的产品核心卖点数据'],
    executionSteps: [
      '1. 转换产品卖点为日常生活场景',
      '2. 匹配开头 3 秒情绪钩子',
      '3. 生成带分镜头动作指导的剧本',
      '4. 组合热搜关键词'
    ],
    risksAndLimits: ['医疗或保健品类广告词需合规二次确认'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'koc_briefing_gen_graph',
      toolDependencies: ['hook_selector', 'script_template_engine'],
      dataSourceDependencies: ['koc_tone_corpus_db'],
      agentWorker: 'antigravity-content-worker',
      timeoutAndBudget: 'Timeout: 15s / Budget: $0.05',
      idempotencyKey: 'koc_pack_${skuId}_${version}',
      retryPolicy: 'No retry required',
      inputOutputSchema: 'JSONSchema: KOCBriefingSpecV2',
      evalSetAndThreshold: '150 KOC brief test sets / readability score ≥ 90'
    },
    
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
    stageLabel: '互动与私域转化',
    dailyTaskTag: 'organize_docs',
    source: 'official',
    isComposite: false,
    status: 'needs_config',
    unavailableReason: '当前技能暂不可用：缺少公开评论数据访问能力，请联系管理员完成配置。',
    version: 'v1.6',
    updatedAt: '2026-07-19',
    lastTestStatus: 'untested',
    lastVerifiedResult: '因缺少评论数据接口权限，处于待配置状态',
    usedByExpertsCount: 0,
    usedByProjectsCount: 1,
    usedByExperts: [],
    usedByProjects: ['宠粮新客运营'],
    
    goal: '快速识别评论区购买信号与用户真实顾虑，提高转化率与线索承接效率。',
    applicableScenes: ['笔记发布后互动监测', '评论区挖掘未满足需求'],
    inapplicableScenes: ['批量水军刷屏防护'],
    inputFormat: ['笔记评论文本列表', '转化干预话术规则'],
    outputFormat: ['购买意向线索表', '用户核心疑问 TOP3', '建议私域引导回复'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '生成高意向转化工单并推送到客服待办中心，不修改笔记正文。'
    },
    manualConfirmPoints: ['高意向线索自动添加微信/私域前需客服人员点击确定'],
    evidenceRequirements: ['必须引用用户评论的原声文本词句和相关发言时间'],
    failureHandling: '通道未授权或权限不足时阻止运行并提示联系管理员配置数据连接器。',
    evaluationStandards: ['高意向购买评论识别准确率 ≥ 93%，不漏失咨询单。'],
    versionHistoryNotes: 'v1.6：增加反转反讽语调分析，降低误读比例。',
    
    preConditions: ['需提供可读的小红书评论文本列表权限'],
    executionSteps: [
      '1. 情绪与语义深度解析',
      '2. 识别高意向买点词 (如“哪里买/多少钱/怎么换粮”)',
      '3. 匹配最适回复引导'
    ],
    risksAndLimits: ['对互联网冷笑话或歧义网络语可能存在误判'],
    
    backendMetadata: {
      executionMode: 'event_driven',
      workflowGraph: 'comment_lead_extraction_graph',
      toolDependencies: ['intent_classifier', 'lead_routing_tool'],
      dataSourceDependencies: ['xhs_comment_stream_api', 'private_domain_crm'],
      agentWorker: 'antigravity-lead-worker',
      timeoutAndBudget: 'Timeout: 10s / Budget: $0.03',
      idempotencyKey: 'comment_${commentId}',
      retryPolicy: 'Queue for replay when API restores',
      inputOutputSchema: 'JSONSchema: CommentLeadSpecV1',
      evalSetAndThreshold: '400 comment classification cases / F1 score ≥ 94%'
    },
    
    requiredPermissions: {
      readScope: ['笔记评论文本'],
      writeScope: ['私域客服工单系统'],
      needsNetwork: true,
      willModifyData: true
    },
    appScope: 'merchant'
  },
  {
    id: 'sk_blue_gen',
    name: '蓝海机会假设生成',
    oneSentenceDesc: '从大盘搜索与用户原声中提炼低竞争高转化的单点验证假设。',
    processCategory: 'research',
    stageLabel: '蓝海机会挖掘',
    dailyTaskTag: 'deconstruct_comp',
    source: 'team',
    isComposite: false,
    status: 'enabled',
    version: 'v2.3',
    updatedAt: '2026-07-23',
    lastTestStatus: 'passed',
    lastVerifiedResult: '提炼出“换粮软便”3个蓝海切入点',
    usedByExpertsCount: 0,
    usedByProjectsCount: 2,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '提炼未被红海竞争覆盖的搜索机会，形成单点选题测试假说。',
    applicableScenes: ['项目选题会', '新爆款切入点快查'],
    inapplicableScenes: ['已饱和品类的硬广冲榜'],
    inputFormat: ['商家产品资料', '痛点词库', '历史高意向评论'],
    outputFormat: ['结构化机会假设卡片', '证据来源列表', '建议验证样本'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: false,
      willCreateMaterialTask: false,
      summary: '输出单点假设提案，可由用户点击将其添加到项目选修选题中。'
    },
    manualConfirmPoints: ['假设需由操盘手人工确认后方可加入测试计划'],
    evidenceRequirements: ['必填对应词汇前7天平均搜索热度与笔记数量的比率'],
    failureHandling: '数据不足时展示“搜索样本不足，请拓展行业父词”。',
    evaluationStandards: ['生成假说的逻辑连贯性得分 ≥ 90；符合真实热搜痛点。'],
    versionHistoryNotes: 'v2.3：同步新规，提升问题提炼精炼度。',
    
    preConditions: ['已具备行业搜索热度与用户原声文本'],
    executionSteps: [
      '1. 匹配低竞争高增长词',
      '2. 按照事实/推断/假设三分法建立假说',
      '3. 输出通过/不通过标准'
    ],
    risksAndLimits: ['极度依赖搜索热度数据的时效性'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'blue_ocean_hypothesis_lite_graph',
      toolDependencies: ['keyword_ratio_filter'],
      dataSourceDependencies: ['search_trends_daily_db'],
      agentWorker: 'antigravity-research-worker-lite',
      timeoutAndBudget: 'Timeout: 10s / Budget: $0.02',
      idempotencyKey: 'blue_gen_${kwId}',
      retryPolicy: 'No retry required',
      inputOutputSchema: 'JSONSchema: BlueGenSpecV2',
      evalSetAndThreshold: '80 opportunity cases / accuracy ≥ 90%'
    },
    
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
    stageLabel: '项目推进与异常排查',
    dailyTaskTag: 'handle_anomalies',
    source: 'official',
    isComposite: false,
    status: 'enabled',
    version: 'v2.0',
    updatedAt: '2026-07-21',
    lastTestStatus: 'passed',
    lastVerifiedResult: '监测 210 篇笔记，预警 5 篇未收录',
    usedByExpertsCount: 0,
    usedByProjectsCount: 4,
    usedByExperts: [],
    usedByProjects: ['幼猫换粮抗应激项目'],
    
    goal: '自动监控已发布笔记收录与关键词位次，保障转化通路未被屏蔽。',
    applicableScenes: ['发文后 24 小时监控', '流量限流或异常排查'],
    inapplicableScenes: ['未发布草稿提前预判'],
    inputFormat: ['已发布笔记 URL/ID', '目标核心关键词清单'],
    outputFormat: ['收录成功/失败状态', '关键词搜索位次', '流量异常警报'],
    executionActions: {
      willWriteProject: true,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '更新笔记监测记录，如未收录自动创建“申诉与自查待办”。'
    },
    manualConfirmPoints: ['未收录笔记重新提交申诉或修改前需人工复核确认'],
    evidenceRequirements: ['必须记录最新状态探测时间及搜索前 20 位网址列表'],
    failureHandling: '检测异常时提示操作手使用客户端进行实测核对。',
    evaluationStandards: ['收录快查准确率 ≥ 99.5%，零漏报限流情况。'],
    versionHistoryNotes: 'v2.0：支持短视频与图文统一状态查询。',
    
    preConditions: ['笔记发布超过 2 小时'],
    executionSteps: [
      '1. 校验标题与主词收录',
      '2. 记录前 3 位及首页排名',
      '3. 未收录笔记自动上报诊断'
    ],
    risksAndLimits: ['千人千面推荐算法下排名位次略有短时波动'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'publish_ranking_check_graph',
      toolDependencies: ['ranking_spider_tool'],
      dataSourceDependencies: ['xhs_search_index_api'],
      agentWorker: 'antigravity-ops-worker-lite',
      timeoutAndBudget: 'Timeout: 8s / Budget: $0.01',
      idempotencyKey: 'pub_chk_${noteId}_${hour}',
      retryPolicy: 'Auto retry once on network error',
      inputOutputSchema: 'JSONSchema: PublishCheckSpecV2',
      evalSetAndThreshold: '200 url index check tests / accuracy ≥ 99%'
    },
    
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
    stageLabel: '数据观察与经验复盘',
    dailyTaskTag: 'generate_reports',
    source: 'from_project',
    isComposite: false,
    status: 'enabled',
    version: 'v1.5',
    updatedAt: '2026-07-16',
    lastTestStatus: 'passed',
    lastVerifiedResult: '归因准确率 89%，提炼 12 项沉淀策略',
    usedByExpertsCount: 0,
    usedByProjectsCount: 2,
    usedByExperts: [],
    usedByProjects: ['夏日宠物驱虫爆款季'],
    
    goal: '定量化分析爆文原因与低效消耗点，将成功因素转化为可沉淀经验。',
    applicableScenes: ['项目结案复盘', '月度运营归因会'],
    inapplicableScenes: ['刚刚发布 1 小时无稳定数据样本的笔记'],
    inputFormat: ['项目计划数据', '实际笔记明细、互动指标与真实消耗'],
    outputFormat: ['爆文率对比图', 'ROI 归因矩阵', '下一期策略建议'],
    executionActions: {
      willWriteProject: false,
      willCreateTodo: true,
      willCreateMaterialTask: false,
      summary: '生成归因复盘卡，建议一键沉淀为商家基础知识准则。'
    },
    manualConfirmPoints: ['归因报告归档入库或下发给商家前需操盘手确认'],
    evidenceRequirements: ['必须引用具体高爆笔记的 CTR 及千次阅读互动成本'],
    failureHandling: '消耗数据缺失时阻止归因计算，提示补充真实花费金额。',
    evaluationStandards: ['多因子归因误差 < 8%，给出的策略能够通过测试验证。'],
    versionHistoryNotes: 'v1.5：优化投流消耗与自然流量差值归因模型。',
    
    preConditions: ['已具备完整的笔记消耗与互动回填数据'],
    executionSteps: [
      '1. 汇总阅读、点赞、收藏、评论与消耗',
      '2. 按选题归类计算爆文率',
      '3. 因子权重计算与可复用经验提取'
    ],
    risksAndLimits: ['要求输入真实消耗数据方能得到准确归因'],
    
    backendMetadata: {
      executionMode: 'sync',
      workflowGraph: 'roi_attribution_model_graph',
      toolDependencies: ['regression_attribution_calc'],
      dataSourceDependencies: ['project_ledger_db'],
      agentWorker: 'antigravity-review-worker',
      timeoutAndBudget: 'Timeout: 20s / Budget: $0.05',
      idempotencyKey: 'attr_${projectId}_${month}',
      retryPolicy: 'No retry required',
      inputOutputSchema: 'JSONSchema: AttributionSpecV1',
      evalSetAndThreshold: '50 historical campaigns test set / accuracy ≥ 92%'
    },
    
    requiredPermissions: {
      readScope: ['项目消耗表', '笔记互动明细'],
      writeScope: ['写入商家知识库'],
      needsNetwork: false,
      willModifyData: true
    },
    appScope: 'merchant'
  }
];

/* 2. Legacy Experts Array (Empty/Minimal for backward compatibility without old Expert UI clutter) */
export const INITIAL_EXPERTS: ExpertItem[] = [];

/* 3. Merchant Recommendations (Recommending Skills) */
export const INITIAL_MERCHANT_RECOMMENDATIONS: MerchantRecommendation[] = [
  {
    id: 'rec_1',
    type: 'skill',
    targetId: 'sk_comp_merchant_diag',
    targetName: '商家诊断 (复合技能)',
    triggerFact: '当前商家“皇家宠物食品”近 30 天未进行种草资产与知识库完整度盘点。',
    problemSolved: '解决商家知识库缺口（如缺过敏换粮专答协议），防范后续发文与承接中途脱节。',
    requiredDocsAndConfigs: ['需读取《皇家宠物食品产品手册》与《近 90 天投放明细表》。'],
    manualConfirmPoints: ['诊断得出的能力补强与策略修改建议需操盘手人工签署后生效。'],
    prepStatus: '可直接运行',
    confirmedFacts: [
      '商家已上传《皇家宠物食品产品手册》',
      '过去 30 天内无种草资产健康度诊断记录'
    ],
    systemInferences: [
      '换粮应激类目极有可能缺乏标准化的问答规范协议'
    ],
    missingInfo: [
      '建议补充近半年天猫后端转化对齐数据（可选）'
    ],
    itemData: INITIAL_SKILLS[0]
  },
  {
    id: 'rec_2',
    type: 'skill',
    targetId: 'sk_comment_intent',
    targetName: '高意向评论与私域抽取',
    triggerFact: '“幼猫换粮抗应激”最新发布的 3 篇笔记评论区已达 124 条，出现大量购粮与换粮咨询线索。',
    problemSolved: '快速提取高意向线索并路由给私域客服，避免错过高意向转化窗口。',
    requiredDocsAndConfigs: ['需管理员完成《小红书评论数据连接器》网络连接配置。'],
    manualConfirmPoints: ['抽取的线索推送客服专员前需人工复核确定。'],
    prepStatus: '需要完成配置',
    confirmedFacts: [
      '最新 3 篇笔记累计评论数 124 条',
      '其中 18 条包含“求链接/哪里买”等直接买点词'
    ],
    systemInferences: [
      '当前评论区存在约 15% 的高价值待承接意向线索'
    ],
    missingInfo: [
      '系统评论数据读取连接未打开'
    ],
    itemData: INITIAL_SKILLS[8] // 指向高意向评论与私域抽取
  }
];

/* 4. My Capabilities List (All Installed Skills) */
export const INITIAL_MY_CAPABILITIES: MyCapabilityItem[] = [
  {
    id: 'my_sk_1',
    name: '商家诊断 (复合技能)',
    type: 'skill',
    appScope: 'merchant',
    status: 'enabled',
    lastUsed: '15分钟前',
    lastResult: '已完成品牌种草资产全面扫描，生成 3 项待进阶策略建议',
    pendingConfirmCount: 1,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[0]
  },
  {
    id: 'my_sk_2',
    name: '蓝海机会研究 (复合技能)',
    type: 'skill',
    appScope: 'project',
    status: 'enabled',
    lastUsed: '10分钟前',
    lastResult: '提炼出“幼猫换粮软便与益生菌组合”3大潜力假设',
    pendingConfirmCount: 1,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[1]
  },
  {
    id: 'my_sk_3',
    name: '内容批次策划 (复合技能)',
    type: 'skill',
    appScope: 'project',
    status: 'enabled',
    lastUsed: '1小时前',
    lastResult: '一键生成 10 篇 KOC 分层短视频与图文脚本大纲包',
    pendingConfirmCount: 0,
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目', '全量KOC招募计划'],
    refData: INITIAL_SKILLS[4]
  },
  {
    id: 'my_sk_4',
    name: '小红书首图合规校验',
    type: 'skill',
    appScope: 'all',
    status: 'enabled',
    lastUsed: '昨天',
    lastResult: '沙盒校验通过，检测 142 张图片未发现遮挡',
    usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
    refData: INITIAL_SKILLS[6]
  },
  {
    id: 'my_sk_5',
    name: '高意向评论与私域抽取',
    type: 'skill',
    appScope: 'merchant',
    status: 'needs_config',
    lastUsed: '未运行',
    lastResult: '缺少公开评论数据访问能力，请联系管理员配置连接器',
    usedByExpertsOrProjects: ['宠粮新客运营'],
    refData: INITIAL_SKILLS[8]
  }
];

/* 5. Mock Import Package Data */
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
    conflicts: ['与本地技能“内容批次策划”无冲突']
  },
  testStatus: 'passed',
  installScope: 'merchant'
};

// Export aliases
export const mockExperts = INITIAL_EXPERTS;
export const mockSkills = INITIAL_SKILLS;
export const mockRecommendations = INITIAL_MERCHANT_RECOMMENDATIONS;
export const initialMyCapabilities = INITIAL_MY_CAPABILITIES;
