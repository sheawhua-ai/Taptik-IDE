import { FactItem, HypothesisItem, MissingInfoItem, StrategyDraftData, StrategyChangeProposal } from './types';

// 初始已自动读取的上下文事实
export const INITIAL_CARRIED_FACTS: FactItem[] = [
  {
    id: 'fact_1',
    category: 'product',
    title: '主推产品：无谷高蛋白鲜肉全价幼犬粮 (2kg)',
    detail: '鲜鸡肉单一肉源（无谷低敏），粗蛋白≥38%，具备第三方 SGS 权威质检报告 (编号 SGS-2026-0812)',
    sourceType: 'product_profile',
    sourceName: '产品中心 · SGS质检报告',
    status: 'confirmed'
  },
  {
    id: 'fact_2',
    category: 'compliance',
    title: '合规禁区：严禁使用“医用级治愈”“100%不软便”等绝对化词汇',
    detail: '功效宣传严格限制为“肠胃温和过渡、便便成型率高”，遵守小红书宠物食品合规自审规范',
    sourceType: 'knowledge_memory',
    sourceName: '知识与记忆 · 品牌合规自审规范 v2.4',
    status: 'confirmed'
  },
  {
    id: 'fact_3',
    category: 'account',
    title: '可用账号资产：2个官方品牌号 + 5个线下核心商圈店长号',
    detail: '品牌旗舰店(12.8w粉)、官方号(5.4w粉)；店长号涵盖上海陆家嘴、徐家汇、北京朝阳、广州天河、成都春熙店',
    sourceType: 'account_assets',
    sourceName: '账号资产中心 · 已授权正常',
    status: 'confirmed'
  },
  {
    id: 'fact_4',
    category: 'history',
    title: '7月换粮搜索卡位复盘：纯官方宣导互动转化仅 2.1%，顾问+实测达 6.8%',
    detail: '历史数据显示“店长一对一答疑+真实宠主7天排便对比”在“幼犬换粮软便”搜索词下长尾收录率最高',
    sourceType: 'history_project',
    sourceName: '历史项目 · 7月换粮搜索卡位复盘报告',
    status: 'confirmed',
    isInheritedFromHistory: true,
    confirmedByOperator: false
  },
  {
    id: 'fact_5',
    category: 'resource',
    title: '执行产能：1名专职运营 + 1名门店物料摄影 + 5名兼职店长',
    detail: '物料拍摄需提前2天派发，店长每周可配合产出1篇真实门店答疑记录',
    sourceType: 'merchant_profile',
    sourceName: '商家资料 · 团队人员配置',
    status: 'confirmed'
  }
];

// 初始优先澄清的问题清单 (按优先级排序)
export const INITIAL_PRIORITIZED_QUESTIONS: MissingInfoItem[] = [
  {
    id: 'q_primary_target',
    priority: 1,
    question: '本次运营方案具体推广哪款产品或业务主题？',
    whyNeeded: '推广对象直接决定了后续内容的事实依据、合规审查重点及素材库调用范围。',
    suggestedAnswers: [
      '主推无谷高蛋白鲜肉幼犬粮 (2kg袋装)',
      '幼犬粮 + 肠胃益生菌冻干伴侣组合推广',
      '线下门店免费领样体验活动推广'
    ],
    resolved: true,
    userAnswer: '主推无谷高蛋白鲜肉全价幼犬粮 (2kg袋装)'
  },
  {
    id: 'q_primary_goal',
    priority: 1,
    question: '本周期唯一的核心业务目标与判断继续的可观察结果是什么？',
    whyNeeded: '“品牌曝光”无法作为闭环依据。系统需要明确是验证“换粮搜索词前3位卡位收录”还是“进店领样咨询量”。',
    suggestedAnswers: [
      '验证“幼犬换粮软便”核心搜索词排名前3位覆盖与有效收录',
      '以带动 50+ 组真实到店换粮领样咨询为主要判断信号',
      '沉淀 10 组真实换粮7天排便记录等可持续内容资产'
    ],
    resolved: false
  },
  {
    id: 'q_duration_resources',
    priority: 1,
    question: '本次打法的项目周期与可用执行资源范围？',
    whyNeeded: '周期与人员直接制约发布篇数与素材拍摄排期，避免设定超出产能的脱节计划。',
    suggestedAnswers: [
      '14天标准周期（2周）：品牌号2篇 + 店长号5篇 + KOC 10篇',
      '7天紧凑冲刺（1周）：店长号与品牌号协同发布',
      '21天完整换粮周期（3周）：包含真实宠主长周期反馈'
    ],
    resolved: false
  },
  {
    id: 'q_consumer_koc',
    priority: 2,
    question: '是否需要真实消费者/KOC参与体验与问卷打卡？',
    whyNeeded: '消费者参与需要生成体验官招募落地页、问卷收集与素材回传审核流程。',
    suggestedAnswers: [
      '需要招募 10 名 3-6个月幼犬真实宠主填写问卷并提供真实排便照片',
      '仅使用内部品牌号和店长号，暂不需要外部KOC',
      '由门店直接邀请 5 名熟客老会员打卡'
    ],
    resolved: false
  }
];

// 默认完整的打法草案（根据上下文与回答动态装配）
export const GENERATE_DEFAULT_STRATEGY = (userGoal?: string, userCycleDays: number = 14): StrategyDraftData => {
  const startDate = new Date().toISOString().split('T')[0];
  const endDateObj = new Date();
  endDateObj.setDate(endDateObj.getDate() + userCycleDays);
  const endDate = endDateObj.toISOString().split('T')[0];

  return {
    projectName: `幼犬换粮搜索卡位与顾问答疑｜${userCycleDays}天`,
    cycleDays: userCycleDays,
    startDate,
    endDate,

    // 1. 推广对象
    promotionTarget: {
      targetName: '特唯普无谷高蛋白鲜肉全价幼犬粮 (2kg)',
      targetCategory: '宠物食品 / 幼犬专属营养粮',
      targetAudience: '3-6个月幼犬初次换粮、对软便拉稀及挑食营养不良有焦虑的精致新手宠主',
      confirmedFacts: [
        { label: '核心成分', detail: '单一鲜鸡肉无谷配方，粗蛋白≥38%，无易敏谷物', source: '【产品资料】SGS质检报告 SGS-2026-0812' },
        { label: '合规要求', detail: '严禁宣称治愈胃病、杜绝100%防软便等绝对化用语', source: '【知识与记忆】小红书食品合规准则 v2.4' },
        { label: '线下承接', detail: '5家核心门店已备足试吃装小样供到店核销', source: '【商家资料】门店库存管理系统' }
      ],
      unconfirmedGaps: [
        '尚未补充新批次鲜肉适口性盲测数据，建议前3天收集KOC第一口进食反馈'
      ]
    },

    // 2. 核心目标与验证方式 (唯一主要业务目标)
    coreGoalAndVerification: {
      primaryBusinessGoal: userGoal || '验证“幼犬换粮软便”核心搜索词排名前3位覆盖与有效收录，沉淀真实顾问答疑内容',
      observableSignals: [
        '“幼犬换粮”、“幼犬软便怎么办”搜索下拉词及综合排名前3位中出现至少 2 篇矩阵笔记',
        '笔记发布 48 小时内自然搜索带来的真实评论与私信咨询不少于 20 条',
        '完成 10 组真实换粮 7 天排便成型对比图与问卷事实沉淀'
      ],
      successCriteria: '目标搜索词实现有效占位，且自然搜索咨询转化率 ≥ 5.0%，具备下一周期复投价值。',
      adjustmentCriteria: '若发布 5 天后搜索收录率 < 30%，及时调整笔记标题的关键词长尾组合与头图对比样式。',
      stopCriteria: '若发生严重的成分负面舆情或平台重大规则违规阻断，立即暂停相关笔记发布并启动应急核查。',
      auxiliaryGoals: [
        '店长号平均单篇互动量达到 50+ 次',
        '沉淀不少于 15 组无版权争议的高清实拍素材'
      ]
    },

    // 3. 核心打法
    coreStrategy: {
      problemToSolve: '新手宠主在幼犬换粮阶段搜索高频但缺乏信任，传统品牌软文硬广转化率低且易被平台判定同质化。',
      contentLogic: '以“真实宠主7天过渡排便实测”建立痛点共鸣，配合“线下店长顾问专业答疑与配比指导”提供权威解法，形成公域搜索卡位与同城门店到店体验的信任闭环。',
      rationale: '历史复盘证实“实测打卡 + 顾问答疑”转化率 (6.8%) 显著高于纯官方图文 (2.1%)，且更符合小红书搜索收录偏好。',
      collaborationMechanism: '品牌号负责品牌官方质检与成分背书；店长号认领同城真实答疑；真实KOC回传吃粮与便便成型照片支撑内容事实。'
    },

    // 4. 内容与账号分工
    accountAndContentAssignment: {
      brandAccounts: [
        {
          id: 'brand_1',
          name: '特唯普宠物官方旗舰店',
          fans: '12.8w',
          roleInProject: '品牌官方背书与正品信任承接',
          contentDirection: '科学7天换粮过渡法与SGS无谷鲜肉质检深度拆解',
          noteCount: 2,
          frequency: '每周1篇',
          timeWindow: '晚间 19:00—21:00'
        }
      ],
      kosAccounts: [
        {
          id: 'kos_1',
          name: '店长号_陆家嘴旗舰店',
          storeName: '上海陆家嘴店',
          roleInProject: '专业顾问答疑与同城到店领样',
          contentDirection: '幼犬便便成型对照表 & 线下换粮常见误区盘点',
          noteCount: 1,
          frequency: '项目第3天发布',
          timeWindow: '晚间 18:30—20:30'
        },
        {
          id: 'kos_2',
          name: '店长号_徐家汇概念店',
          storeName: '上海徐家汇店',
          roleInProject: '专业顾问答疑与同城到店领样',
          contentDirection: '挑食幼犬如何无痛换粮？3大实操喂养技巧',
          noteCount: 1,
          frequency: '项目第5天发布',
          timeWindow: '晚间 18:30—20:30'
        },
        {
          id: 'kos_3',
          name: '店长号_朝阳大悦城店',
          storeName: '北京朝阳店',
          roleInProject: '专业顾问答疑与同城到店领样',
          contentDirection: '换粮拉稀软便应急处理指南（附家长食谱调整）',
          noteCount: 1,
          frequency: '项目第7天发布',
          timeWindow: '晚间 18:30—20:30'
        },
        {
          id: 'kos_4',
          name: '店长号_天河城形象店',
          storeName: '广州天河店',
          roleInProject: '专业顾问答疑与同城到店领样',
          contentDirection: '如何看懂幼犬粮配料表第一位？鲜肉与肉粉区别',
          noteCount: 1,
          frequency: '项目第9天发布',
          timeWindow: '晚间 18:30—20:30'
        },
        {
          id: 'kos_5',
          name: '店长号_春熙路体验店',
          storeName: '成都春熙店',
          roleInProject: '专业顾问答疑与同城到店领样',
          contentDirection: '幼犬长肉不长膘实操记录：2kg鲜肉粮喂养日记',
          noteCount: 1,
          frequency: '项目第11天发布',
          timeWindow: '晚间 18:30—20:30'
        }
      ],
      kocParticipants: {
        enabled: true,
        roleInProject: '真实换粮测评打卡与搜索长尾卡位',
        recruitmentCount: 10,
        taskType: '真实体验测评',
        contentDirection: '千人千犬真实换粮7天排便对比、适口性实测打卡',
        requiredMaterialSpecs: '每位提交 2~4 张高清现场实拍（含包装正面、进食状态、便便成型特写）',
        hasQuestionnaire: true
      },
      totalNotesCount: 17 // 2 品牌 + 5 店长 + 10 KOC
    },

    // 5. 资源与人在环路
    humanInTheLoop: {
      systemAutomated: [
        '读取商家资料库、SGS报告与禁用词规则',
        '依据打法规则生成17篇笔记的内容骨架与搜索词卡位草稿',
        '自动拆解所需素材清单并生成待办拍摄需求',
        '基础合规与绝对化违禁词实时预检扫描',
        '自动监控小红书搜索收录排名与异常提醒'
      ],
      operatorRequired: [
        '确认产品事实真实性与质检批次合规性',
        '审核并确认AI生成的内容草稿是否符合品牌口吻',
        '验收KOC回传的排便实拍素材是否存在低质或模糊',
        '由店长人工确认发布并完成首小时评论互动',
        '处理授权失效或平台异常通知'
      ]
    },

    // 6. 假设与依据
    hypothesesAndBasis: {
      confirmedFacts: [
        { id: 'cf_1', text: '无谷鲜肉幼犬粮具备 SGS 质检报告，粗蛋白≥38%', source: '【产品资料】质检中心' },
        { id: 'cf_2', text: '5家核心门店店长号均已接入且处于在线授权状态', source: '【账号资产】授权中心' },
        { id: 'cf_3', text: '严禁宣传治愈软便拉稀，仅能使用改善、温和过渡', source: '【知识与记忆】合规规范' }
      ],
      pendingHypotheses: [
        {
          id: 'ph_1',
          text: '幼犬宠主在换粮第3-5天出现软便症状时的搜索咨询意愿最高',
          basis: '根据历史行业搜索趋势推断，待本周期首批笔记发布后通过搜索时段验证',
          status: 'hypothesis'
        },
        {
          id: 'ph_2',
          text: '晚间 18:30—20:30 为上班族宠主集中阅读与咨询高峰时段',
          basis: '基于7月历史方案互动时段数据暂定，可随实际数据微调',
          status: 'hypothesis'
        },
        {
          id: 'ph_3',
          text: '每位 KOC 提供 2-4 张真实进食与排便照片足以支撑内容真实性',
          basis: '根据常规小红书图文收录标准推断，若素材不达标需人工在验收环节退回',
          status: 'hypothesis'
        }
      ],
      missingItemsToTrack: [
        { id: 'mi_1', text: '暂缺最新一季线下门店领样核销率基准数据', impact: '暂不将到店转化量设为核心考核，作为辅助观察项' }
      ]
    }
  };
};

// 预设的智能修改提案生成器（当操盘手在底部输入自然语言指令时）
export const GENERATE_PROPOSAL_FROM_COMMAND = (
  userCommand: string,
  currentDraft: StrategyDraftData
): StrategyChangeProposal => {
  const cmd = userCommand.trim();

  if (cmd.includes('减少') || cmd.includes('品牌号') || cmd.includes('KOC') || cmd.includes('增加')) {
    return {
      id: `prop_${Date.now()}`,
      userPrompt: cmd,
      aiInterpretation: '调减官方品牌号发布量，将预算与内容重心倾斜至真实消费者/KOC体验测评',
      diffSummary: [
        {
          moduleName: '内容与账号分工',
          before: '品牌主号 2 篇，消费者 KOC 10 篇 (总计 17 篇)',
          after: '品牌主号 1 篇 (-1)，消费者 KOC 12 篇 (+2) (总计 18 篇)'
        },
        {
          moduleName: '打法侧重点',
          before: '品牌质检背书与真实体验对半开',
          after: '强化去中心化真实宠主口碑测评，品牌号仅保留 1 篇深度科普'
        }
      ],
      impactScope: {
        affectedNotesCount: 3,
        affectedAccounts: ['特唯普宠物官方旗舰店', '消费者KOC体验池'],
        affectedSchedule: '第1周品牌号发布合并为1篇，新增2个KOC招募与问卷槽位',
        taskChanges: {
          added: ['新增 2 个 KOC 真实体验问卷与物料验收任务'],
          removed: ['取消 1 篇品牌官方质检长图文排期'],
          modified: ['调整招募落地页计划名额至 12 人']
        },
        hasConflictWithFacts: false
      }
    };
  }

  if (cmd.includes('搜索') || cmd.includes('涨粉') || cmd.includes('目标')) {
    return {
      id: `prop_${Date.now()}`,
      userPrompt: cmd,
      aiInterpretation: '剥离涨粉等宽泛指标，聚焦于“换粮软便”核心搜索词排名前3位收录与真实咨询验证',
      diffSummary: [
        {
          moduleName: '核心目标与验证方式',
          before: '兼顾品牌曝光、账号涨粉与搜索占位',
          after: '单一核心目标：验证“幼犬换粮软便”核心搜索词前3位有效收录与自然咨询'
        },
        {
          moduleName: '继续/停止判定准则',
          before: '综合互动量 ≥ 500',
          after: '目标搜索词收录率 ≥ 70% 且自然咨询转化率 ≥ 5%'
        }
      ],
      impactScope: {
        affectedNotesCount: 0,
        affectedAccounts: ['全部7个矩阵账号'],
        affectedSchedule: '排期无需调整，笔记生成将强化搜索词与标题长尾匹配',
        taskChanges: {
          added: ['启用搜索排名 24 小时自动监控探查'],
          removed: ['移除互动涨粉统计面板'],
          modified: ['调整复盘归因核心指标定义']
        },
        hasConflictWithFacts: false
      }
    };
  }

  if (cmd.includes('摄影') || cmd.includes('人员') || cmd.includes('素材') || cmd.includes('降低')) {
    return {
      id: `prop_${Date.now()}`,
      userPrompt: cmd,
      aiInterpretation: '考虑专职摄影仅1人，精简非必要复杂布景拍摄，增加店长手机现场纪实与KOC自拍比例',
      diffSummary: [
        {
          moduleName: '素材拍摄需求',
          before: '每篇笔记需 3-5 张专业相机棚拍物料 (总计约 25 张)',
          after: '专职摄影仅承接品牌号 1 组精品图，店长与KOC采用手机真实纪实拍摄规范'
        },
        {
          moduleName: '资源与人在环路',
          before: '摄影师排期密集',
          after: '大幅降低专业拍摄负荷，将任务分散给店长日常随手拍'
        }
      ],
      impactScope: {
        affectedNotesCount: 5,
        affectedAccounts: ['5家门店店长号'],
        affectedSchedule: '素材交付截止时间延长 1 天缓冲期',
        taskChanges: {
          added: ['生成《店长手机随手拍实用技巧卡》'],
          removed: ['取消 3 个高难度棚拍物料任务'],
          modified: ['降低店长号素材验收标准至“清晰无反光”即可']
        },
        hasConflictWithFacts: false
      }
    };
  }

  // 默认通用提案
  return {
    id: `prop_${Date.now()}`,
    userPrompt: cmd,
    aiInterpretation: `根据指令：“${cmd}” 调整本周期运营打法配置与相关约束`,
    diffSummary: [
      {
        moduleName: '核心打法与排期',
        before: '当前既定打法配置',
        after: `针对“${cmd}”更新打法逻辑与排期规则`
      }
    ],
    impactScope: {
      affectedNotesCount: 2,
      affectedAccounts: ['矩阵相关账号'],
      affectedSchedule: '根据新约束动态微调',
      taskChanges: {
        added: ['更新协同打法版本规则'],
        removed: [],
        modified: ['同步调整生成中的内容草稿参数']
      },
      hasConflictWithFacts: false
    }
  };
};
