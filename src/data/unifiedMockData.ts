import {
  Merchant, Project, Round, NoteSlot, ContentDraft, MaterialRequirement, MaterialTask,
  MaterialAsset, PublishTask, PublishedNote, EvidenceSnapshot, Issue, ActionTask, TimelineEvent
} from './unifiedStore';

export const mockMerchants: Merchant[] = [{ id: "m1", name: "默认商家" }];

export const mockProjects: Project[] = [
  {
    id: "p1",
    merchantId: "m1",
    name: "幼犬换粮搜索卡位第三轮",
    status: "进行中",
    goal: "验证“换粮软便”真实测评与店长号专业解释能否提升有效咨询与转化线索",
    startDate: "2024-03-01",
    endDate: "2024-03-20",
    budget: "5,000元",
    strategyProtocol: {
      targetAudience: "3-6个月幼犬初次换粮腹泻软便的铲屎官",
      coreProblem: "换粮内容有收藏但咨询少，缺乏专业解释与信任闭环",
      solutionSummary: "KOC真实体验测评 + 店长号专业科普指导 + 评论区私信引导",
      verifyHypothesis: "真实换粮过程与店长专业解答组合能否带来+30%有效线索",
      continueCondition: "高意向咨询比例>15%且加微率>20%",
      stopCondition: "爆文率<5%或出现产品客诉纠纷"
    },
    landingPageSettings: {
      loginMode: "无需登录",
      posterTitle: "幼犬换粮体验官与进食记录收集",
      bannerUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop"
    }
  },
  {
    id: "p89",
    merchantId: "m1",
    name: "青岛酒店婚宴小红书运营方案",
    status: "准备中",
    goal: "招募青岛备婚新人与婚礼策划师，输出宴会厅实拍、菜品体验与婚宴布场笔记",
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    budget: "12,000元",
    strategyProtocol: {
      targetAudience: "青岛地区2026年备婚新婚夫妇、婚礼策划师",
      coreProblem: "备婚人群对酒店场地美誉度与实际落地方案缺乏直观信任",
      solutionSummary: "备婚新娘真实试菜/探店 + 策划师布场案例 + 优惠档期私信引流",
      verifyHypothesis: "婚宴现场美图+档期答疑能否提升私信问询率",
      continueCondition: "单篇有效婚礼问询>5条",
      stopCondition: "无备婚线索或客诉问题"
    },
    landingPageSettings: {
      loginMode: "无需登录",
      posterTitle: "青岛酒店婚宴小红书运营方案 - 体验官内容投稿",
      bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
    }
  }
];

export const mockRounds: Round[] = [{ id: "r1", projectId: "p1", name: "第一批爆发" }];

export const mockNoteSlots: NoteSlot[] = [
  { id: "ns1", projectId: "p1", roundId: "r1", accountType: "店长号/KOS", accountName: "店长号_陆家嘴店", contentDirection: "科学换粮科普", plannedDate: "2024-03-05" },
  { id: "ns2", projectId: "p1", roundId: "r1", accountType: "KOC", accountName: "小红薯_汪汪队", contentDirection: "真实测评分享", plannedDate: "2024-03-06" },
  { id: "ns3", projectId: "p1", roundId: "r1", accountType: "品牌主号", accountName: "品牌官方旗舰店", contentDirection: "品牌权威科普", plannedDate: "2024-03-04" },
  { id: "ns4", projectId: "p1", roundId: "r1", accountType: "KOC", accountName: "小红薯_咪咪猫", contentDirection: "避坑干货", plannedDate: "2024-03-05" },
  {
    id: "ns5",
    projectId: "p1",
    roundId: "r1",
    accountType: "KOC",
    accountName: "待匹配 KOC",
    contentDirection: "规定的写作框架：幼犬换粮体验、软便缓解心得",
    plannedDate: "2024-03-12",
    isNotePackage: true,
    packageSpec: {
      guidelines: "【笔记包约束】规定要怎么写：1. 必须说明狗狗品种与月龄；2. 记录从软便到便便成型的7天换粮过程；3. 给出3条换粮避坑建议与真实体验分。",
      materialTaskReqs: "【按任务拍摄】1. 幼犬进食干饭短视频(>10s) 1条；2. 试用粮与狗狗合影 2张。",
      questionnaireStatus: "待填写"
    }
  },
  {
    id: "ns6",
    projectId: "p1",
    roundId: "r1",
    accountType: "店长号/KOS",
    accountName: "待匹配 门店KOS",
    contentDirection: "规定的写作框架：门店接诊常见换粮误区解答",
    plannedDate: "2024-03-15",
    isNotePackage: true,
    packageSpec: {
      guidelines: "【笔记包约束】规定要怎么写：1. 店长视角解答3个新手幼犬换粮禁忌；2. 推荐门店试用装与专利益生菌；3. 结合门店实景照片。",
      materialTaskReqs: "【按任务拍摄】1. 门店货架摆放实拍图 1张；2. 店长工服出镜讲解短视频 1条。",
      questionnaireStatus: "待填写"
    }
  }
];

export const mockContentDrafts: ContentDraft[] = [
  { id: "cd1", noteSlotId: "ns1", status: "待确认", title: "幼犬换粮总是拉肚子？店长教你避坑七日换粮法", body: "今天给各位家长分享幼犬换粮的避坑经验！...可以搭配少量专利益生菌过渡。", tags: ["幼犬换粮", "科学养狗", "宠物店长"] },
  { id: "cd2", noteSlotId: "ns2", status: "已确认", title: "我家金毛幼犬换粮体验，记录七天变化", body: "...", tags: [] },
  { id: "cd3", noteSlotId: "ns3", status: "已确认", title: "【官方科普】幼犬肠胃敏感期如何顺利换粮？", body: "...", tags: [] },
  { id: "cd4", noteSlotId: "ns4", status: "已确认", title: "换粮避坑指南！终于不软便了", body: "...", tags: [] }
];

export const mockMaterialRequirements: MaterialRequirement[] = [
  { id: "mr1", noteSlotId: "ns2", reqs: "需提供2张幼犬进食场景图及1张换粮过渡期照片" },
  { id: "mr_p89_1", projectId: "p89", isProjectLevel: true, reqs: "酒店宴会厅高清全景图与舞台灯光布置照片（至少3张）" },
  { id: "mr_p89_2", projectId: "p89", isProjectLevel: true, reqs: "婚宴试菜现场主菜品特写与菜单名牌（至少2张）" }
];

export const mockMaterialTasks: MaterialTask[] = [
  { id: "mt1", requirementId: "mr1", assignee: "小红薯_汪汪队", status: "待验收" },
  { id: "mt_p89_1", requirementId: "mr_p89_1", assignee: "酒店策划团队", status: "执行中" }
];

export const mockMaterialAssets: MaterialAsset[] = [
  { id: "ma1", taskId: "mt1", url: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&auto=format&fit=crop", type: "image", aiStatus: "AI预检通过" }
];

export const mockPublishTasks: PublishTask[] = [
  { id: "pt1", noteSlotId: "ns1", assignee: "店长号_陆家嘴店", status: "待发布" },
  { id: "pt2", noteSlotId: "ns2", assignee: "小红薯_汪汪队", status: "未安排" },
  { id: "pt3", noteSlotId: "ns3", assignee: "品牌官方旗舰店", status: "已发布", publishUrl: "https://www.xiaohongshu.com/explore/65f123456789a" },
  { id: "pt4", noteSlotId: "ns4", assignee: "小红薯_咪咪猫", status: "已回传链接", publishUrl: "https://www.xiaohongshu.com/explore/65f987654321b" }
];

export const mockPublishedNotes: PublishedNote[] = [
  { id: "pn1", publishTaskId: "pt3", status: "观察中" },
  { id: "pn2", publishTaskId: "pt4", status: "暂时无法访问" }
];

export const mockIssues: Issue[] = [
  {
    id: "iss-1",
    rootCauseType: "FACT_CHECK_FAILED",
    associatedObjectIds: ["cd1"],
    impactedStage: "content",
    severity: "warning",
    knownFacts: ["草稿中提到'专利级益生菌'"],
    systemInferences: ["缺乏资料凭证支持"],
    pendingConfirmations: ["需要确认是否有具体专利"],
    currentAssignee: "操盘手",
    status: "open",
    resolutionConditions: "修改文案或提供凭证",
    message: "文中“专利级益生菌”缺乏具体资料凭证",
    impactScope: "影响 1 篇店长号笔记发布"
  },
  {
    id: "iss-2",
    rootCauseType: "MATERIAL_VERIFICATION_PENDING",
    associatedObjectIds: ["mt1"],
    impactedStage: "assets",
    severity: "warning",
    knownFacts: ["已回传1张图片"],
    systemInferences: ["符合基础要求"],
    pendingConfirmations: ["需操盘手人工确认"],
    currentAssignee: "操盘手",
    status: "open",
    resolutionConditions: "验收通过",
    message: "KOC已上传进食回传图，等待验收",
    impactScope: "影响 1 篇KOC笔记进度"
  },
  {
    id: "iss-3",
    rootCauseType: "PUBLISH_VERIFICATION_FAILED",
    associatedObjectIds: ["pt4", "pn2"],
    impactedStage: "publish",
    severity: "blocker",
    knownFacts: ["链接回传成功，但系统爬取曝光量低", "页面提示可能被限流"],
    systemInferences: ["疑似包含敏感词限流"],
    pendingConfirmations: ["在App端确认是否真被限流"],
    currentAssignee: "操盘手",
    status: "open",
    resolutionConditions: "确认状态并决定是否重发",
    message: "发布后曝光极其异常，疑似限流",
    impactScope: "阻断 1 篇笔记流量增长"
  }
];

export const mockActionTasks: ActionTask[] = [
  { id: "at1", issueId: "iss-1", actionType: "REVIEW_CONTENT", status: "pending", assignee: "操盘手", waitOn: "用户确认", nextStep: "确认待审内容" },
  { id: "at2", issueId: "iss-2", actionType: "VERIFY_MATERIAL", status: "pending", assignee: "操盘手", waitOn: "人工验收", nextStep: "查看回传" },
  { id: "at3", issueId: "iss-3", actionType: "CONFIRM_PUBLISH_STATUS", status: "pending", assignee: "操盘手", waitOn: "App端复测", nextStep: "处理异常" }
];

export const mockTimelineEvents: TimelineEvent[] = [
  { id: "evt1", targetId: "ns1", actor: "系统AI", action: "生成内容稿", timestamp: "2024-03-05 10:00", isAutomatic: true, newIssueId: "iss-1" }
];
