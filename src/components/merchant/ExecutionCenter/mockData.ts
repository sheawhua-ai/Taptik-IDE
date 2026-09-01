import { ExecutionTask, TaskBatchGroup } from './types';

export const INITIAL_BATCH_GROUPS: TaskBatchGroup[] = [
  {
    id: 'batch-c1',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    operatorCategory: 'content',
    title: '确认本项目的 8 篇笔记',
    subtitle: '其中 2 篇包含事实风险，6 篇等待内容确认',
    totalCount: 8,
    riskCount: 2,
    taskIds: ['task-c1', 'task-c2', 'task-c-sub3', 'task-c-sub4', 'task-c-sub5', 'task-c-sub6', 'task-c-sub7', 'task-c-sub8'],
    primaryActionLabel: '开始确认'
  },
  {
    id: 'batch-m1',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    operatorCategory: 'material',
    title: '验收本项目回传的 6 组素材',
    subtitle: '已通过 AI 客观预检 4 组，需重点检查 2 组',
    totalCount: 6,
    riskCount: 2,
    taskIds: ['task-m1', 'task-m-match', 'task-m-sub3', 'task-m-sub4', 'task-m-sub5', 'task-m-sub6'],
    primaryActionLabel: '开始验收'
  }
];

export const INITIAL_EXECUTION_TASKS: ExecutionTask[] = [
  // ================= 1. 笔记确认 (content) =================
  {
    id: 'task-c1',
    title: '补充事实依据并确认笔记正文',
    operatorCategory: 'content',
    categoryLabel: '笔记确认',
    status: '待执行',
    isAnomaly: true,
    anomalyType: 'content_compliance_risk',
    anomalyReason: '正文包含缺少来源的产品功效描述（专利级益生菌）',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns1',
    noteTitle: '幼犬换粮总是拉肚子？店长教你避坑七日换粮法',
    targetAccount: '店长号-陆家嘴店',
    accountType: '店长号/KOS',
    operatorActionSummary: '补充事实依据并确认笔记正文',
    reasonForIntervention: '正文包含缺少来源的产品功效描述',
    deadline: '今天 18:00',
    deadlineLabel: '今日到期',
    isBlocked: true,
    isPinned: true,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 09:30',
    primaryActionLabel: '修改笔记',
    currentOccurrence: 'AI生成正文初稿中包含“专利级益生菌配方”，检测模块发现该宣传词在知识库中未查证到专利证书编号。',
    confirmedFacts: [
      '初稿已生成完毕，字数 482 字，结构包含：痛点引入、7日换粮法、避坑提示',
      '店长人设与口吻符合“科学养宠·门店顾问”定位',
      '涉及宣传词“专利级益生菌”缺乏对应专利号'
    ],
    nextStepAfterAction: '确认笔记后，系统将自动锁定定稿，并自动检查所需素材是否在素材中心已有匹配。',
    draftTitle: '幼犬换粮总是拉肚子？店长教你避坑七日换粮法',
    draftBody: `很多新手家长一给小狗换粮就遇到软便、拉稀，急得团团转！其实80%的换粮问题不是狗粮不好，而是肠胃菌群还没适应。

作为宠物店长，今天教大家标准的【七日渐进换粮法】：
第1-2天：25%新粮 + 75%旧粮
第3-4天：50%新粮 + 50%旧粮
第5-6天：75%新粮 + 25%旧粮
第7天及以后：100%新粮全替换

💡 店长建议：肠胃特别敏感的幼犬，可以搭配少量特定多联益生菌过渡，温水泡软进食更护肠胃。大家换粮遇到什么问题，欢迎在评论区随时问我！`,
    tags: ['幼犬换粮', '科学养宠', '宠物店长日常', '养狗避坑指南'],
    complianceRisk: '广告法合规提示：文中“专利级益生菌”需凭证支持，建议采纳AI建议替换为“特定多联益生菌”。',
    evidenceNeeded: '如有专利证书，可在「知识与记忆」中链接本地文件，以解除合规警示。',
    strategyContext: {
      intent: '抢占“幼犬换粮软便”搜索长尾词，建立专业店长信任',
      targetAudience: '2-6个月幼犬初次养宠人群，重点关注玻璃胃、软便困扰',
      corePainPoint: '换粮拉稀软便、不知如何按比例科学过渡',
      searchKeywords: ['幼犬换粮', '七日换粮法', '小狗软便怎么办', '幼犬益生菌'],
      strategyPhase: '第二阶段：搜索卡位与信任背书',
      expectedPublishTime: '2026-08-23 12:00',
      impactAccounts: ['店长号-陆家嘴店 (KOS)'],
      subsequentTasks: ['检查素材中心匹配', '下发门店货架实拍拍摄包']
    },
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 09:30', actor: '系统AI', action: '基于项目策略大纲生成初稿' },
      { id: 'e2', time: '2026-08-21 09:31', actor: '规则引擎', action: '标记待核验词汇：专利级益生菌' }
    ]
  },
  {
    id: 'task-c2',
    title: '修正违禁极限词并确认试菜测评正文',
    operatorCategory: 'content',
    categoryLabel: '笔记确认',
    status: '待执行',
    isAnomaly: true,
    anomalyType: 'content_compliance_risk',
    anomalyReason: '初稿出现广告法绝对化禁用词“最顶级”',
    projectId: 'p89',
    projectName: '青岛酒店婚宴小红书运营方案',
    noteId: 'ns-p89-c1',
    noteTitle: '青岛备婚必看！一线海景酒店婚宴试菜+布场超全实测',
    targetAccount: '备婚体验官_晴晴',
    accountType: 'KOC',
    operatorActionSummary: '修正绝对化违禁词并确认试菜正文',
    reasonForIntervention: '包含绝对化用词“最顶级”，需替换为合规体验描述',
    deadline: '明天 12:00',
    deadlineLabel: '即将到期',
    isBlocked: false,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 09:15',
    primaryActionLabel: '修改笔记',
    currentOccurrence: 'KOC体验稿中出现绝对化用词“青岛最顶级的海景宴会厅”，触犯广告法绝对化禁用词。',
    confirmedFacts: [
      '体验官问卷信息已完整提取（包含试菜桌号、招牌菜“葱烧海参”、2026秋季档期）',
      '命中绝对化词汇“最顶级”'
    ],
    nextStepAfterAction: '确认正文后，系统将自动向体验官推送“文案已就绪，请按规范回传试菜照片”通知。',
    draftTitle: '青岛备婚必看！一线海景酒店婚宴试菜+布场超全实测',
    draftBody: `终于和老公把青岛的婚宴场地定下来了！试菜这一关真的太关键了～

我们选的是一线无遮挡海景大厅，270度落地窗看浮山湾绝了！
重点夸一下他们家的婚宴菜单：
1. 葱烧海参：海参个头很大，口感软糯入味！
2. 广式清蒸石斑鱼：火候刚好好，鱼肉很嫩。
3. 甜品台定制也很用心，长辈们赞不绝口。

2026备婚的姐妹如果有档期疑问，可以看我主页或者直接私信交流！`,
    tags: ['青岛备婚', '青岛婚宴酒店', '婚宴试菜', '海景婚礼'],
    complianceRisk: '包含极限词“最顶级”，已预先建议替换为“一线无遮挡海景大厅”。',
    strategyContext: {
      intent: '真实备婚情侣视角的口碑种草，吸引本地精准备婚意向客资',
      targetAudience: '青岛本地2026-2027年备婚准新人',
      corePainPoint: '担心婚宴菜品难吃分量小、场地采光与海景效果不符',
      searchKeywords: ['青岛婚宴酒店', '青岛备婚攻略', '海景婚礼场地', '婚宴试菜测评'],
      strategyPhase: '口碑发酵期',
      impactAccounts: ['备婚体验官_晴晴 (KOC)'],
      subsequentTasks: ['向体验官推送素材上传入口', '验收试菜高清原图']
    },
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 09:15', actor: '系统AI', action: '基于试菜问卷生成初稿' },
      { id: 'e2', time: '2026-08-21 09:16', actor: '合规引擎', action: '识别出绝对化词汇并已给出替换提案' }
    ]
  },
  {
    id: 'task-c-sub3',
    title: '确认金毛犬主7天换粮日记正文与口吻',
    operatorCategory: 'content',
    categoryLabel: '笔记确认',
    status: '待执行',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns5',
    noteTitle: '我家金毛幼犬换粮体验，记录七天便便变化',
    targetAccount: '小红薯_汪汪队',
    accountType: 'KOC',
    operatorActionSummary: '确认KOC真实体验正文口吻',
    reasonForIntervention: 'AI根据KOC填写的问卷组装了正文初稿，需确认真实感与品牌词植入',
    deadline: '后天 18:00',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 10:00',
    primaryActionLabel: '修改笔记',
    currentOccurrence: 'KOC问卷提交后AI已生成初稿，等待操盘手最后核对口吻与关键词。',
    confirmedFacts: ['字数 420 字', '包含真实月龄与喂食量数据'],
    nextStepAfterAction: '确认通过后流转至素材验收。',
    draftTitle: '我家金毛幼犬换粮体验，记录七天便便变化',
    draftBody: '我家4个月的小金毛肠胃特别脆，之前吃旧粮总是软便。这次尝试了7日渐进换粮，前面3天掺着喂，到第5天便便就成型了！新粮颗粒适中，肉香味很浓，小家伙每次都秒光。',
    tags: ['金毛养护', '幼犬换粮实录', '新手铲屎官'],
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 10:00', actor: '系统', action: '生成初稿' }
    ]
  },
  {
    id: 'task-m-waiting',
    title: '补充幼犬换粮过程记录素材',
    operatorCategory: 'material',
    categoryLabel: '素材待办',
    status: '待执行',
    materialType: 'returned_shooting_asset',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns3',
    noteTitle: '幼犬七日换粮过程记录',
    targetAccount: '张店长（陆家嘴店）',
    accountType: '店长号/KOS',
    operatorActionSummary: '等待执行者拍摄并回传素材',
    reasonForIntervention: '素材任务已下发，执行者尚未回传。',
    deadline: '今天 18:00',
    deadlineLabel: '今日到期',
    isBlocked: false,
    waitingParty: '张店长（陆家嘴店）',
    waitingRole: 'team',
    isMeWaiting: false,
    isTeamExecuting: true,
    isSystemProcessing: false,
    createdAt: '2026-08-21 10:30',
    primaryActionLabel: '查看进度',
    currentOccurrence: '任务已发送给张店长，等待拍摄和回传。',
    confirmedFacts: ['拍摄要求与截止时间已送达执行者'],
    nextStepAfterAction: '执行者回传后，AI 自动预检并进入待审核队列。',
    materialSubItems: [{
      id: 'sub-waiting-1',
      requirement: '连续记录换粮第 1、3、7 天的进食状态与粮粒比例',
      isRequired: true,
      uploadedAssets: [],
      autoCheckResult: '等待素材任务回传',
      manualStatus: '待验收'
    }],
    timelineEvents: [
      { id: 'waiting-e1', time: '2026-08-21 10:30', actor: '操盘手', action: '下发素材任务给张店长（陆家嘴店）' },
      { id: 'waiting-e2', time: '2026-08-21 10:32', actor: '张店长（陆家嘴店）', action: '已接收任务' }
    ]
  },

  // ================= 2. 素材待办 (material) =================
  {
    id: 'task-m1',
    title: '验收幼犬换粮回传的 3 组拍摄素材',
    operatorCategory: 'material',
    categoryLabel: '素材待办',
    status: '待执行',
    materialType: 'returned_shooting_asset',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns2',
    noteTitle: '我家金毛幼犬换粮体验，记录七天便便变化',
    targetAccount: '小红薯_汪汪队',
    accountType: 'KOC',
    operatorActionSummary: '人工逐项把关3张回传照片的真实性与画面表达',
    reasonForIntervention: 'AI已完成客观预检（分辨率/无水印/光线），需人工把关封面真实感与品牌适用性',
    deadline: '今天 20:00',
    deadlineLabel: '今日到期',
    isBlocked: true,
    isPinned: true,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 08:00',
    primaryActionLabel: '验收素材',
    currentOccurrence: 'KOC小红薯_汪汪队已通过小程序回传了3张实拍图片，AI已完成文件完整性与客观尺寸预检，等待操盘手验收。',
    confirmedFacts: [
      '镜头1（幼犬进食盆特写）：2400×1800 px，无平台水印，曝光良好',
      '镜头2（新旧粮颗粒对比）：2160×1620 px，无水印，颗粒细节可见',
      '镜头3（外包装正面实拍）：1920×1440 px，包装文字完整'
    ],
    nextStepAfterAction: '全部素材验收通过后，系统将自动生成对应账号的手动发布任务，并把完整图文包下发给执行人。',
    materialSubItems: [
      {
        id: 'sub-1',
        requirement: '幼犬进食盆进食场景高清特写（展现狗狗食欲与盆中颗粒）',
        isRequired: true,
        uploadedAssets: [
          {
            id: 'ast-1',
            url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop',
            type: 'image',
            filename: 'dog_eating_01.jpg',
            uploadTime: '2026-08-21 07:45',
            fileSize: '3.2 MB',
            resolution: '2400 × 1800 px',
            technicalCheck: {
              resolutionValid: true,
              noWatermark: true,
              lightingQuality: '良好',
              aspectRatio: '4:3',
              summary: '分辨率合格 (2400×1800)，未检测到第三方平台水印，画面亮度正常'
            }
          }
        ],
        autoCheckResult: '客观预检通过：分辨率合规，无第三方水印，曝光正常',
        manualStatus: '待验收'
      },
      {
        id: 'sub-2',
        requirement: '新旧粮颗粒大小与颜色对比实拍图（附带手部或量杯参照）',
        isRequired: true,
        uploadedAssets: [
          {
            id: 'ast-2',
            url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&auto=format&fit=crop',
            type: 'image',
            filename: 'kibble_compare.jpg',
            uploadTime: '2026-08-21 07:48',
            fileSize: '2.8 MB',
            resolution: '2160 × 1620 px',
            technicalCheck: {
              resolutionValid: true,
              noWatermark: true,
              lightingQuality: '正常',
              aspectRatio: '4:3',
              summary: '分辨率合格，颗粒纹理清晰，无压缩模糊'
            }
          }
        ],
        autoCheckResult: '客观预检通过：颗粒对比清晰，光线正常',
        manualStatus: '待验收'
      },
      {
        id: 'sub-3',
        requirement: '产品外包装与防伪标识正面特写',
        isRequired: false,
        uploadedAssets: [
          {
            id: 'ast-3',
            url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop',
            type: 'image',
            filename: 'package_front.jpg',
            uploadTime: '2026-08-21 07:50',
            fileSize: '2.1 MB',
            resolution: '1920 × 1440 px',
            technicalCheck: {
              resolutionValid: true,
              noWatermark: true,
              lightingQuality: '良好',
              aspectRatio: '4:3',
              summary: '包装文字完整，防伪标识无反光遮挡'
            }
          }
        ],
        autoCheckResult: '客观预检通过：包装清晰完整',
        manualStatus: '待验收'
      }
    ],
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 16:00', actor: '系统', action: '下发拍摄任务' },
      { id: 'e2', time: '2026-08-21 07:50', actor: '小红薯_汪汪队', action: '回传3张拍摄素材' },
      { id: 'e3', time: '2026-08-21 07:52', actor: 'AI质检引擎', action: '完成分辨率、水印与光线客观检测' }
    ]
  },
  {
    id: 'task-m-project-p89',
    title: '验收婚宴项目通用场景素材',
    operatorCategory: 'material',
    categoryLabel: '素材待办',
    status: '待执行',
    materialType: 'returned_shooting_asset',
    projectId: 'p89',
    projectName: '青岛酒店婚宴小红书运营方案',
    noteTitle: '项目通用素材补充',
    targetAccount: '宴会中心素材协作组',
    accountType: '外部达人',
    operatorActionSummary: '审核项目通用场景素材并决定是否进入素材中心',
    reasonForIntervention: '执行组已回传宴会厅与菜品通用素材，需确认真实性和后续复用价值。',
    deadline: '明天 16:00',
    deadlineLabel: '即将到期',
    isBlocked: false,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 09:20',
    primaryActionLabel: '验收素材',
    currentOccurrence: '素材协作组已回传项目级通用素材，AI已完成清晰度与水印检查。',
    confirmedFacts: ['已回传宴会厅全景与主桌布置图', '图片分辨率及水印预检通过'],
    nextStepAfterAction: '通过的素材进入项目素材池，可供后续笔记匹配；退回项继续原任务补拍。',
    materialSubItems: [
      {
        id: 'sub-p89-project-1',
        requirement: '宴会厅全景实拍（完整呈现舞台、桌型与空间层次）',
        isRequired: true,
        uploadedAssets: [{
          id: 'ast-p89-project-1',
          url: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&auto=format&fit=crop',
          type: 'image',
          filename: 'banquet_hall.jpg',
          uploadTime: '2026-08-21 09:10',
          fileSize: '3.8 MB',
          resolution: '3024 × 2268 px',
          technicalCheck: { resolutionValid: true, noWatermark: true, lightingQuality: '良好', aspectRatio: '4:3', summary: '画面清晰，无水印，空间结构完整' }
        }],
        autoCheckResult: '客观预检通过：清晰度与画幅合规',
        manualStatus: '待验收'
      },
      {
        id: 'sub-p89-project-2',
        requirement: '婚宴主桌布置与花艺细节实拍',
        isRequired: true,
        uploadedAssets: [{
          id: 'ast-p89-project-2',
          url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop',
          type: 'image',
          filename: 'wedding_table.jpg',
          uploadTime: '2026-08-21 09:12',
          fileSize: '3.1 MB',
          resolution: '2400 × 1800 px',
          technicalCheck: { resolutionValid: true, noWatermark: true, lightingQuality: '正常', aspectRatio: '4:3', summary: '主体清晰，无水印，色温正常' }
        }],
        autoCheckResult: '客观预检通过：主体清晰，色温正常',
        manualStatus: '待验收'
      }
    ],
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 15:00', actor: '操盘手', action: '下发项目通用素材任务' },
      { id: 'e2', time: '2026-08-21 09:12', actor: '素材协作组', action: '回传2组场景素材' },
      { id: 'e3', time: '2026-08-21 09:14', actor: 'AI质检引擎', action: '完成客观预检' }
    ]
  },
  {
    id: 'task-m-match',
    title: '确认这组素材是否适用于笔记',
    operatorCategory: 'material',
    categoryLabel: '素材待办',
    status: '待执行',
    materialType: 'matched_library_asset',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns1',
    noteTitle: '幼犬换粮总是拉肚子？店长教你避坑七日换粮法',
    targetAccount: '店长号-陆家嘴店',
    accountType: '店长号/KOS',
    operatorActionSummary: '确认系统从素材库匹配的货架陈列图是否适用于本店长笔记',
    reasonForIntervention: '系统从素材中心自动匹配了已有门店陈列图，等待操盘手确认是否适用',
    deadline: '明天 18:00',
    deadlineLabel: '即将到期',
    isBlocked: false,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 09:00',
    primaryActionLabel: '确认使用',
    currentOccurrence: '笔记正文已锁定，系统在素材中心匹配到上周录入的【陆家嘴门店标准货架陈列图】，等待操盘手确认适用性。',
    confirmedFacts: [
      '匹配素材：陆家嘴门店-幼犬专区陈列实拍.jpg (分辨率 2400×1800 px)',
      '素材来源：素材中心-门店资产库（录入人：张店长）',
      'AI客观检测：分辨率合格，未过期，无水印'
    ],
    nextStepAfterAction: '确认使用后无需补拍，直接生成店长手动发布任务；若不适用可一键下发补拍任务给店长。',
    matchedAssetThumbnail: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop',
    materialSubItems: [
      {
        id: 'sub-match-1',
        requirement: '门店货架幼犬粮陈列实景图（需展现整洁货架与价格标签）',
        isRequired: true,
        uploadedAssets: [
          {
            id: 'ast-m-1',
            url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop',
            type: 'image',
            filename: 'store_shelf_standard.jpg',
            uploadTime: '2026-08-15 14:00',
            fileSize: '3.4 MB',
            resolution: '2400 × 1800 px',
            technicalCheck: {
              resolutionValid: true,
              noWatermark: true,
              lightingQuality: '良好',
              aspectRatio: '4:3',
              summary: '分辨率合格，门店实拍真实，无变形'
            }
          }
        ],
        autoCheckResult: '客观预检通过：库内高清实拍，标签可见',
        manualStatus: '待验收'
      }
    ],
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 09:00', actor: '系统', action: '在素材中心命中可用资产并建立关联' }
    ]
  },

  // ================= 3. 发布与回传（正常流程自动进入观察） =================
  {
    id: 'task-p1',
    title: '发布结果自动识别中',
    operatorCategory: 'publish',
    categoryLabel: '发布与回传',
    status: '执行中',
    isAnomaly: false,
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns4',
    noteTitle: '换粮避坑指南！我家毛孩终于不软便了',
    targetAccount: '体验官_萌宠阿宝',
    accountType: 'KOC',
    operatorActionSummary: '平台笔记 ID 已回传，正在自动建立观察',
    reasonForIntervention: '发布信息已齐全，无需操盘手核销',
    deadline: '无',
    deadlineLabel: '普通',
    isBlocked: false,
    isPinned: false,
    waitingParty: '发布识别与数据同步引擎',
    waitingRole: 'system',
    isMeWaiting: false,
    isTeamExecuting: false,
    isSystemProcessing: true,
    createdAt: '2026-08-21 08:30',
    primaryActionLabel: '查看观察进度',
    currentOccurrence: '体验官已回传笔记链接与平台笔记 ID，系统正在自动建立发布记录并进入数据观察。',
    confirmedFacts: [
      '发布人：阿宝 (合作体验官)',
      '目标账号：体验官_萌宠阿宝 (KOC)',
      '回传链接：https://www.xiaohongshu.com/explore/65f987654321b',
      '回传截图：已上传 1 张小红书个人主页发布成功截图',
      '回传时间：2026-08-21 08:15'
    ],
    nextStepAfterAction: '识别完成后自动进入笔记观察，持续回传互动、咨询、搜索收录与排名。',
    publisherName: '阿宝 (合作体验官)',
    publishType: 'KOC协作发布',
    publishExecutorType: '内容包KOC发布',
    publishStage: '识别中',
    notificationChannel: '内容包领取页通知',
    publishContent: {
      title: '换粮避坑指南！我家毛孩终于不软便了',
      body: '换粮第7天打卡！幼犬玻璃胃的姐妹们一定要记住慢换粮法则...',
      tags: ['幼犬换粮', '科学养宠', '养狗日常'],
      images: [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop'
      ],
      scheduleTime: '2026-08-21 08:00'
    },
    returnedData: {
      publishUrl: 'https://www.xiaohongshu.com/explore/65f987654321b',
      noteIdInPlatform: '65f987654321b',
      publishTime: '2026-08-21 08:15',
      screenshotUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop',
      notes: '已在小红书按要求发布，截图附在回传凭据中。',
      unverifiedReason: '正在进行公开状态与平台笔记 ID 的自动校验。'
    },
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 18:00', actor: '操盘手', action: '下发手动发布图文包' },
      { id: 'e2', time: '2026-08-21 08:15', actor: '体验官_萌宠阿宝', action: '在小红书App手动发布并回传链接与截图' },
      { id: 'e3', time: '2026-08-21 08:30', actor: '系统', action: '匹配平台笔记 ID，自动进入数据观察' }
    ]
  },

  // ================= 4. 异常处理 (anomaly) =================
  {
    id: 'task-a1',
    title: '菜品特写照片被退回，创作者逾期未补拍',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '待执行',
    isAnomaly: true,
    anomalyType: 'material_reshoot_overdue',
    anomalyReason: '体验官未在指定截止时间内重新上传暖光海参特写，原任务已逾期',
    projectId: 'p89',
    projectName: '青岛酒店婚宴小红书运营方案',
    noteId: 'ns-p89-m2',
    noteTitle: '婚宴十道招牌菜特写与菜单名牌',
    targetAccount: '试菜体验官_晴晴',
    accountType: 'KOC',
    operatorActionSummary: '催促创作者补拍或重新指派备用KOC',
    reasonForIntervention: '补拍截止时间已过（原定昨日18:00），需人工催促或重新派发',
    deadline: '已逾期 (昨日 18:00)',
    deadlineLabel: '已逾期',
    isBlocked: true,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-20 18:00',
    primaryActionLabel: '处理逾期补拍',
    currentOccurrence: '体验官第一次回传的葱烧海参特写在暗光环境下拍摄严重偏色模糊，操盘手退回要求补拍，截止目前创作者已超过约定截止时间，尚未重新提交。',
    confirmedFacts: [
      '初次上传图片因清晰度不达标被操盘手驳回',
      '退回原因：“请开启暖光灯并在正上方俯拍，保持海参光泽感与盘饰完整”',
      '原定补拍截止时间为 2026-08-20 18:00（已逾期）'
    ],
    nextStepAfterAction: '发送催促提醒或重新分配执行人后，任务恢复正常执行状态。',
    materialSubItems: [
      {
        id: 'sub-p89-1',
        requirement: '葱烧海参及主菜品特写（光线明亮，展示食材新鲜度）',
        isRequired: true,
        uploadedAssets: [
          {
            id: 'ast-p89-err',
            url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
            type: 'image',
            filename: 'dish_dark_unfocused.jpg',
            uploadTime: '2026-08-20 14:00',
            fileSize: '1.4 MB',
            resolution: '1280 × 960 px',
            technicalCheck: {
              resolutionValid: true,
              noWatermark: true,
              lightingQuality: '偏暗',
              aspectRatio: '4:3',
              summary: '画面亮度偏低，中央主体对比度不足，疑似手抖微糊'
            }
          }
        ],
        autoCheckResult: '客观预检预警：光照不足，清晰度偏低',
        manualStatus: '需补拍',
        reshootReason: '请开启暖光灯并在正上方俯拍，保持海参光泽感与盘饰完整'
      }
    ],
    timelineEvents: [
      { id: 'e1', time: '2026-08-19 11:00', actor: '系统', action: '派发拍摄任务' },
      { id: 'e2', time: '2026-08-20 14:00', actor: '试菜体验官_晴晴', action: '上传初版照片' },
      { id: 'e3', time: '2026-08-20 16:30', actor: '操盘手', action: '退回并要求补拍' },
      { id: 'e4', time: '2026-08-20 18:01', actor: '规则引擎', action: '标记补拍已逾期' }
    ]
  },
  {
    id: 'task-a2',
    title: '执行者反馈账号暂时无法使用',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '待执行',
    isAnomaly: true,
    anomalyType: 'executor_account_unavailable',
    anomalyReason: '张店长反馈个人小红书账号近期更换手机处于安全保护期，暂无法手动发文',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns1',
    noteTitle: '幼犬换粮总是拉肚子？店长教你避坑七日换粮法',
    targetAccount: '店长号-陆家嘴店',
    accountType: '店长号/KOS',
    operatorActionSummary: '联系店长或重新指派备用门店号发布',
    reasonForIntervention: '执行者反馈当前账号无法登录发布，需重新分配发布人或调整排期',
    deadline: '今天 14:00',
    deadlineLabel: '今日到期',
    isBlocked: true,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 08:30',
    primaryActionLabel: '重新分配执行人',
    currentOccurrence: '原定由张店长手动发布的内容，因店长更换登录设备触发小红书平台24小时新设备安全保护，店长在协作小程序中上报异常。',
    confirmedFacts: [
      '上报人：张店长 (陆家嘴店)',
      '上报原因：新手机登录触发小红书账号安全保护期，今日暂无法发文',
      '内容状态：图文包均已准备就绪'
    ],
    nextStepAfterAction: '重新指派给静安店店长号或由操盘手代发后，任务即可继续推进。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 08:30', actor: '张店长', action: '小程序端反馈账号受限，请求重新指派' }
    ]
  },
  {
    id: 'task-a4',
    title: '内容包KOC超过发布排期仍未发布',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '待执行',
    isAnomaly: true,
    anomalyType: 'publish_overdue',
    anomalyReason: '体验官已领取完整图文包，但超过约定发布时间仍未发布或回传链接',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns-c-09',
    noteTitle: '给金毛宝宝换粮成功！再也不用天天擦屁屁了',
    targetAccount: '体验官_萌宠阿宝',
    accountType: 'KOC',
    publishExecutorType: '内容包KOC发布',
    operatorActionSummary: '催促发布、调整排期或更换内容包KOC',
    reasonForIntervention: '原定8月22日20:00前发布，当前已逾期且未收到发布链接，需要操盘手选择处置方式',
    deadline: '2026-08-22 20:00',
    deadlineLabel: '已逾期',
    isBlocked: true,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-22 20:01',
    primaryActionLabel: '处理发布逾期',
    currentOccurrence: '体验官已领取内容包并确认参与，但超过发布排期后仍未发布，也未反馈无法执行的原因。',
    confirmedFacts: [
      '图文内容、配图与标签均已准备完整',
      '体验官已于8月20日15:00领取内容包',
      '约定发布时间为8月22日20:00，当前未识别到发布笔记'
    ],
    nextStepAfterAction: '催促后恢复等待发布；若更换执行人，则重新发送内容包与发布排期。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 15:00', actor: '体验官_萌宠阿宝', action: '领取完整图文内容包' },
      { id: 'e2', time: '2026-08-22 20:01', actor: '规则引擎', action: '发布排期逾期，转入异常待办' }
    ]
  },
  {
    id: 'task-a3',
    title: '账号数据同步授权需要更新',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '待执行',
    isAnomaly: true,
    anomalyType: 'data_sync_auth_expired',
    anomalyReason: '品牌官方旗舰店的数据归集授权到期，需重新扫码授权以拉取曝光与互动数据',
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns-sync',
    noteTitle: '品牌官方旗舰店数据同步服务',
    targetAccount: '特唯普品牌官方旗舰店',
    accountType: '品牌主号',
    operatorActionSummary: '重新扫码更新创作者数据同步授权',
    reasonForIntervention: '小红书创作者服务平台数据读取授权已到期，影响后效归集',
    deadline: '后天 18:00',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '操盘手',
    waitingRole: 'operator',
    isMeWaiting: true,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-21 07:00',
    primaryActionLabel: '更新数据授权',
    currentOccurrence: '系统定时抓取官方旗舰店笔记互动数据时提示授权会话到期。注意：这仅影响后台数据归集，不影响员工正常手动发布。',
    confirmedFacts: [
      '授权类型：创作者服务平台数据归集接口',
      '已发布笔记数：12 篇',
      '影响范围：新发布笔记近24小时曝光与互动数据暂缓同步'
    ],
    nextStepAfterAction: '扫码完成数据授权后，系统将自动补齐缺失时间段的数据。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 07:00', actor: '数据同步引擎', action: '检测到创作者中心数据授权失效' }
    ]
  },

  // ================= 5. 团队正常执行中 / 系统处理中 / 已完成 (Default Hidden from Operator Pending) =================
  {
    id: 'task-team-normal-1',
    title: '体验官在小红书App手动发布中',
    operatorCategory: 'publish',
    categoryLabel: '发布执行' as any,
    status: '执行中',
    isAnomaly: false,
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns-c-09',
    noteTitle: '给金毛宝宝换粮成功！再也不用天天擦屁屁了',
    targetAccount: '体验官_萌宠阿宝',
    accountType: 'KOC',
    operatorActionSummary: '等待创作者在小红书手动发布并回传链接',
    reasonForIntervention: '创作者在正常发布时效内，无需操盘手介入',
    deadline: '2026-08-23 22:00',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '体验官_萌宠阿宝',
    waitingRole: 'team',
    isMeWaiting: false,
    isTeamExecuting: true,
    isSystemProcessing: false,
    createdAt: '2026-08-20 15:00',
    primaryActionLabel: '查看进度',
    currentOccurrence: '消费者体验官已领取完整图文物料包，正在小红书自主发布周期内。',
    publishType: 'KOC协作发布',
    publishExecutorType: '内容包KOC发布',
    publishStage: '待发布',
    notificationChannel: '内容包领取页通知',
    confirmedFacts: ['图文物料已确认', '任务认领时间：2026-08-20 15:00'],
    nextStepAfterAction: '创作者回传链接后，系统自动匹配平台笔记 ID 并进入数据观察。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 15:00', actor: '体验官_萌宠阿宝', action: '认领图文物料包' }
    ]
  },
  {
    id: 'task-team-normal-2',
    title: 'KOC按大纲要求进行7天进食记录拍摄',
    operatorCategory: 'material',
    categoryLabel: '素材待办',
    status: '执行中',
    isAnomaly: false,
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns-m-koc2',
    noteTitle: '边牧幼犬换粮测评',
    targetAccount: '小红薯_边牧队长',
    accountType: 'KOC',
    operatorActionSummary: '创作者拍摄中',
    reasonForIntervention: '正常拍摄周期中，无需介入',
    deadline: '2026-08-24 18:00',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '小红薯_边牧队长',
    waitingRole: 'team',
    isMeWaiting: false,
    isTeamExecuting: true,
    isSystemProcessing: false,
    createdAt: '2026-08-20 10:00',
    primaryActionLabel: '查看进度',
    currentOccurrence: '创作者正在按拍摄规范记录幼犬第3天与第7天进食画面。',
    confirmedFacts: ['已接收样品狗粮', '预计8月24日前回传素材'],
    nextStepAfterAction: '回传后将触发客观预检并进入操盘手验收。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 10:00', actor: '系统', action: '派发拍摄任务' }
    ]
  },
  {
    id: 'task-team-publish-employee',
    title: '店长手动发布任务已通知',
    operatorCategory: 'publish',
    categoryLabel: '发布与回传',
    status: '执行中',
    isAnomaly: false,
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns1',
    noteTitle: '幼犬换粮总是拉肚子？店长教你避坑七日换粮法',
    targetAccount: '店长号-陆家嘴店',
    accountType: '店长号/KOS',
    operatorActionSummary: '店长已收到手动发布任务',
    reasonForIntervention: '员工正在正常执行，无需操盘手介入',
    deadline: '2026-08-23 12:00',
    deadlineLabel: '即将到期',
    isBlocked: false,
    waitingParty: '张店长 (陆家嘴店)',
    waitingRole: 'team',
    isMeWaiting: false,
    isTeamExecuting: true,
    isSystemProcessing: false,
    createdAt: '2026-08-21 10:10',
    primaryActionLabel: '查看发布任务',
    currentOccurrence: '系统已向张店长的员工工作台发送完整图文包和发布排期，等待其在小红书手动发布。',
    confirmedFacts: ['图文包已锁定', '员工通知已送达', '计划发布：8月23日 12:00'],
    nextStepAfterAction: '员工完成手动发布后，系统通过账号数据采集识别新笔记并进入观察。',
    publishType: 'KOS店长发布',
    publishExecutorType: '员工发布',
    publishStage: '待发布',
    notificationChannel: '员工工作台 / H5 任务',
    publisherName: '张店长 (陆家嘴店)',
    timelineEvents: [
      { id: 'e1', time: '2026-08-21 10:10', actor: '系统', action: '按账号发布日历向店长送达手动发布任务' }
    ]
  },
  {
    id: 'task-sys-normal-1',
    title: '官方旗舰店已发布笔记数据归集同步中',
    operatorCategory: 'publish',
    categoryLabel: '发布与回传',
    status: '执行中',
    isAnomaly: false,
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns3',
    noteTitle: '【官方科普】幼犬肠胃敏感期如何顺利换粮？',
    targetAccount: '品牌官方旗舰店',
    accountType: '品牌主号',
    operatorActionSummary: '数据自动归集中',
    reasonForIntervention: '系统自动运行中，无需人工干预',
    deadline: '无',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '数据同步引擎',
    waitingRole: 'system',
    isMeWaiting: false,
    isTeamExecuting: false,
    isSystemProcessing: true,
    createdAt: '2026-08-20 12:00',
    primaryActionLabel: '查看数据',
    currentOccurrence: '笔记已识别到平台 ID 并进入观察，系统持续同步前24小时曝光与互动数据。',
    publishType: '自有员工发布',
    publishExecutorType: '员工发布',
    publishStage: '观察中',
    notificationChannel: '员工工作台 / H5 任务',
    confirmedFacts: ['平台笔记 ID 已匹配', '当前曝光量：1,280，互动量：46'],
    nextStepAfterAction: '数据自动沉淀至复盘归因。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-20 12:00', actor: '系统', action: '识别平台笔记 ID 并启动数据观察' }
    ]
  },
  {
    id: 'task-done-normal-1',
    title: '换粮避坑指南！终于不软便了（已归档）',
    operatorCategory: 'publish',
    categoryLabel: '发布与回传',
    status: '已完成',
    isAnomaly: false,
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'ns-done-1',
    noteTitle: '换粮避坑指南！终于不软便了',
    targetAccount: '店长号-陆家嘴店',
    accountType: '店长号/KOS',
    operatorActionSummary: '已完成全流程并归档',
    reasonForIntervention: '已完成归档',
    deadline: '已归档',
    deadlineLabel: '普通',
    isBlocked: false,
    waitingParty: '已完成',
    waitingRole: 'completed',
    isMeWaiting: false,
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-18 10:00',
    primaryActionLabel: '查看详情',
    currentOccurrence: '笔记已由店长发布，系统识别平台笔记 ID 后完成归档。',
    confirmedFacts: ['全流程闭环完成'],
    nextStepAfterAction: '已进入长期复盘监控。',
    timelineEvents: [
      { id: 'e1', time: '2026-08-18 10:00', actor: '系统', action: '完成发布识别与归档' }
    ]
  }
];
