// TapTik Unified Project & Task Data Store

export type ProjectStatus = "准备中" | "进行中" | "已结束";
export type NoteType = "KOC" | "店长号/KOS" | "品牌主号";
export type ContentStatus = "待生成" | "待确认" | "已确认";
export type MaterialStatus = "无需素材" | "待收集" | "待验收" | "已齐";
export type PublishStatus = "未安排" | "待领取" | "待发布" | "已发布" | "发布异常";
export type ResultStatus = "未开始观察" | "观察中" | "已完成" | "数据异常";

export interface NoteMetrics {
  likes: number;
  collects: number;
  comments: number;
  shares: number;
  views?: number; // Optional, display "暂无数据" if undefined
  highIntentComments: number;
  lastUpdated: string;
}

export interface NoteIssue {
  id: string;
  type: "blocker" | "warning";
  message: string;
  impactScope: string;
  nextStepActionText: string;
  targetWorkbench?: "content" | "assets" | "publish" | "interaction" | "detail";
}

export interface NotePackageSpec {
  guidelines: string;         // 规定要怎么写
  materialTaskReqs: string;   // 素材按任务拍摄
  questionnaireStatus: "未启用" | "待填写" | "已填写" | "生成中";
  questionnaireFields?: {
    petBreed?: string;
    petAge?: string;
    symptom?: string;
    experience?: string;
    storeName?: string;
  };
}

export interface ConsumerQuestionnaireAnswer {
  submittedAt?: string;
  sourcePackageName?: string;
  petBreed?: string;
  petAge?: string;
  symptom?: string;
  experience?: string;
  willingnessToRecommend?: string;
  answers?: {
    question: string;
    answer: string;
  }[];
}

export interface Note {
  id: string;
  projectId: string;
  projectName: string;
  batchName: string;
  title: string;
  participant: string;
  account?: string;
  claimedCount?: number;
  totalSlotsCount?: number;
  type: NoteType;
  contentDirection: string;
  plannedDate: string;
  contentStatus: ContentStatus;
  materialStatus: MaterialStatus;
  publishStatus: PublishStatus;
  resultStatus: ResultStatus;
  publishLink?: string;
  publishTime?: string;
  body?: string;
  isNotePackage?: boolean;
  packageSpec?: NotePackageSpec;
  consumerQuestionnaire?: ConsumerQuestionnaireAnswer;
  contentPackage?: {
    title: string;
    body: string;
    tags: string[];
    images: string[];
    keyPoints?: string[];
  };
  materialTask?: {
    id: string;
    reqs: string;
    status: string;
    returnedUrls?: string[];
  };
  metrics?: NoteMetrics;
  currentIssue?: NoteIssue;
  logs?: {
    time: string;
    action: string;
    operator: string;
  }[];
}

import { LandingPageSettings } from './unifiedStore';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  goal: string;
  startDate: string;
  endDate: string;
  budget: string;
  notes: Note[];
  landingPageSettings?: LandingPageSettings;
  strategyProtocol: {
    targetAudience: string;
    coreProblem: string;
    solutionSummary: string;
    verifyHypothesis: string;   // 本轮要验证什么
    continueCondition: string;  // 继续铺量条件
    stopCondition: string;      // 暂停或换打法条件
  };
  operationLogs: {
    id: string;
    timestamp: string;
    operator: string;
    action: string;
    detail: string;
  }[];
}

// Global in-memory initial store
export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
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
    operationLogs: [
      { id: "l1", timestamp: "2024-03-01 10:00", operator: "系统AI", action: "项目初始化", detail: "已自动生成20篇笔记草案与素材分发需求" },
      { id: "l2", timestamp: "2024-03-02 14:30", operator: "张操盘", action: "确认本轮方案", detail: "调整预算为5,000元，确认20篇笔记排期" },
      { id: "l3", timestamp: "2024-03-05 09:15", operator: "系统AI", action: "生成内容包", detail: "店长号与KOC第一批稿件已整理完毕" }
    ],
    notes: [
      {
        id: "n1",
        projectId: "p1",
        projectName: "幼犬换粮搜索卡位第三轮",
        batchName: "第一批爆发",
        title: "幼犬换粮总是拉肚子？店长教你避坑七日换粮法",
        participant: "店长号_陆家嘴店",
        type: "店长号/KOS",
        contentDirection: "科学换粮科普",
        plannedDate: "2024-03-05",
        contentStatus: "待确认",
        materialStatus: "已齐",
        publishStatus: "待发布",
        resultStatus: "未开始观察",
        contentPackage: {
          title: "幼犬换粮总是拉肚子？店长教你避坑七日换粮法",
          body: "今天给各位家长分享幼犬换粮的避坑经验！很多新手刚带狗狗回家就直接换新粮，肠胃受不了就会软便拉稀。\n推荐大家严格使用【七日换粮法】：\n第1-2天：25%新粮 + 75%旧粮\n第3-4天：50%新粮 + 50%旧粮\n第5-6天：75%新粮 + 25%旧粮\n第7天：100%新粮！\n如果本身肠胃比较娇嫩，可以搭配少量专利益生菌过渡。",
          tags: ["幼犬换粮", "科学养狗", "换粮软便", "宠物店长"],
          images: [
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop"
          ]
        },
        currentIssue: {
          id: "iss-1",
          type: "warning",
          message: "文中“专利级益生菌”缺乏具体资料凭证，需操盘手确认",
          impactScope: "影响 1 篇店长号笔记合规发布",
          nextStepActionText: "确认待审内容",
          targetWorkbench: "content"
        },
        logs: [
          { time: "2024-03-05 10:00", action: "生成稿件", operator: "系统AI" }
        ]
      },
      {
        id: "n2",
        projectId: "p1",
        projectName: "幼犬换粮搜索卡位第三轮",
        batchName: "第一批爆发",
        title: "我家金毛幼犬换粮体验，记录七天变化",
        participant: "消费者_金毛豆豆麻麻",
        account: "小红薯_汪汪队",
        type: "KOC",
        contentDirection: "真实测评分享",
        plannedDate: "2024-03-06",
        contentStatus: "已确认",
        materialStatus: "待验收",
        publishStatus: "未安排",
        resultStatus: "未开始观察",
        body: "我家4个月的金毛幼犬刚接回家换粮老是软便拉稀，肠胃特别脆弱。\n\n在宠物店长推荐下试了这款特唯普益生菌幼犬粮，按照7日渐进换粮法喂到第4天，便便就完全成型了，也没有泪痕！\n\n适口性很好，每次倒出来秒光，真心推荐给有同样软便困扰的毛孩子家长！",
        consumerQuestionnaire: {
          submittedAt: "2024-03-06 08:30",
          sourcePackageName: "换粮体验事实问卷 (标准版)",
          petBreed: "金毛寻回犬",
          petAge: "4个月 (幼犬期)",
          symptom: "初次换粮软便拉稀、食欲挑食",
          experience: "按照7日换粮法第4天便便完全成型，精神活泼，胃口大开",
          willingnessToRecommend: "一定会推荐给同月龄金毛宠友"
        },
        materialTask: {
          id: "mt-1",
          reqs: "需提供2张幼犬进食场景图及1张换粮过渡期照片",
          status: "待验收",
          returnedUrls: [
            "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&auto=format&fit=crop"
          ]
        },
        currentIssue: {
          id: "iss-2",
          type: "warning",
          message: "消费者已提交真实问卷并回传1张进食图，等待操盘手验收",
          impactScope: "影响 1 篇消费者笔记进度",
          nextStepActionText: "查看回传",
          targetWorkbench: "assets"
        },
        logs: [
          { time: "2024-03-06 08:30", action: "提交体验问卷", operator: "消费者_金毛豆豆麻麻" },
          { time: "2024-03-06 09:00", action: "提交回传照片", operator: "消费者_金毛豆豆麻麻" }
        ]
      },
      {
        id: "n3",
        projectId: "p1",
        projectName: "幼犬换粮搜索卡位第三轮",
        batchName: "第二批招募",
        title: "消费者换粮测评招募内容包",
        participant: "消费者招募池 (12人)",
        type: "KOC",
        contentDirection: "铲屎官体验",
        plannedDate: "2024-03-10",
        contentStatus: "待生成",
        materialStatus: "待收集",
        publishStatus: "待领取",
        resultStatus: "未开始观察",
        isNotePackage: true,
        claimedCount: 4,
        totalSlotsCount: 12,
        packageSpec: {
          guidelines: "说明狗狗具体品种与月龄，记录从软便到便便成型的真实换粮过程；突出专利益生菌在幼犬换粮期的护肠吸收保护效果。",
          materialTaskReqs: "按任务拍摄进食场景照与精神面貌照",
          questionnaireStatus: "已填写"
        }
      },
      {
        id: "n4",
        projectId: "p1",
        projectName: "幼犬换粮搜索卡位第三轮",
        batchName: "第一批爆发",
        title: "【官方科普】幼犬肠胃敏感期如何顺利换粮？",
        participant: "品牌官方旗舰店",
        type: "品牌主号",
        contentDirection: "品牌权威科普",
        plannedDate: "2024-03-04",
        contentStatus: "已确认",
        materialStatus: "无需素材",
        publishStatus: "已发布",
        resultStatus: "观察中",
        publishLink: "https://www.xiaohongshu.com/explore/65f123456789a",
        publishTime: "2024-03-04 18:30",
        metrics: {
          likes: 248,
          collects: 135,
          comments: 32,
          shares: 18,
          views: 3200,
          highIntentComments: 8,
          lastUpdated: "2024-03-07 11:00"
        }
      },
      {
        id: "n5",
        projectId: "p1",
        projectName: "幼犬换粮搜索卡位第三轮",
        batchName: "第一批爆发",
        title: "换粮避坑指南！终于不软便了",
        participant: "小红薯_咪咪猫",
        type: "KOC",
        contentDirection: "避坑干货",
        plannedDate: "2024-03-05",
        contentStatus: "已确认",
        materialStatus: "已齐",
        publishStatus: "发布异常",
        resultStatus: "数据异常",
        publishLink: "https://www.xiaohongshu.com/explore/65f987654321b",
        publishTime: "2024-03-05 20:10",
        metrics: {
          likes: 2,
          collects: 0,
          comments: 0,
          shares: 0,
          views: 15,
          highIntentComments: 0,
          lastUpdated: "2024-03-07 10:30"
        },
        currentIssue: {
          id: "iss-3",
          type: "blocker",
          message: "该笔记发布后曝光极其异常，疑似包含敏感词限流",
          impactScope: "阻断 1 篇已发布笔记流量增长",
          nextStepActionText: "处理异常",
          targetWorkbench: "publish"
        }
      }
    ]
  },
  {
    id: "p2",
    name: "春季宠物新品体验官招募",
    status: "准备中",
    goal: "招募20位真实KOC试用春季换粮新品并集中输出测评与笔记",
    startDate: "2024-04-01",
    endDate: "2024-04-20",
    budget: "8,000元",
    strategyProtocol: {
      targetAudience: "家有3-12个月幼犬、注重营养配比的宠物主",
      coreProblem: "新品缺乏市场声量与初期真实评价积淀",
      solutionSummary: "20位精准KOC免费试用 + 店长号答疑 + 爆文拆解推广",
      verifyHypothesis: "KOC真实试用反馈能否建立初始口碑与搜索占位",
      continueCondition: "KOC完稿率>90%且爆文率>10%",
      stopCondition: "招募进度不足50%或产品发货延迟"
    },
    operationLogs: [
      { id: "l10", timestamp: "2024-04-01 09:00", operator: "张操盘", action: "创建项目", detail: "已确立春季新品KOC体验招募流程" }
    ],
    notes: [
      {
        id: "p2-n1",
        projectId: "p2",
        projectName: "春季宠物新品体验官招募",
        batchName: "招募批次",
        title: "新品测评1",
        participant: "待领取名额 (20个)",
        type: "KOC",
        contentDirection: "真实测评",
        plannedDate: "2024-04-05",
        contentStatus: "待生成",
        materialStatus: "待收集",
        publishStatus: "待领取",
        resultStatus: "未开始观察"
      }
    ]
  }
];
