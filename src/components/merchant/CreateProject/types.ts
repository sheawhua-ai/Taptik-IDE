export type ProjectCreationPhase = 
  | 'info_gathering'       // 信息确认中
  | 'strategy_generating'  // 策略生成中
  | 'draft_review'         // 待确认打法
  | 'creating'             // 创建中
  | 'completed';           // 已创建

export type StrategicItemStatus = 
  | 'confirmed'   // 已确认
  | 'hypothesis'  // 暂定假设
  | 'missing'     // 待补充
  | 'conflict';   // 存在冲突

export type ContextSourceType = 
  | 'merchant_profile'  // 商家资料
  | 'product_profile'   // 产品资料
  | 'knowledge_memory'  // 知识与记忆
  | 'account_assets'    // 账号资产
  | 'history_project'   // 历史方案
  | 'user_input'        // 用户本次输入
  | 'ai_hypothesis';    // AI暂定假设

export interface SourceBadgeInfo {
  type: ContextSourceType;
  label: string;
  sourceDocOrEntity?: string;
}

export interface FactItem {
  id: string;
  category: 'product' | 'compliance' | 'account' | 'history' | 'resource';
  title: string;
  detail: string;
  sourceType: ContextSourceType;
  sourceName: string;
  status: StrategicItemStatus;
  isInheritedFromHistory?: boolean;
  confirmedByOperator?: boolean;
}

export interface HypothesisItem {
  id: string;
  title: string;
  basis: string; // 依据说明
  status: StrategicItemStatus;
  riskNotice?: string;
  canAdjustLater: boolean;
}

export interface MissingInfoItem {
  id: string;
  priority: 1 | 2 | 3;
  question: string;
  whyNeeded: string; // 为什么需要确认这个信息
  suggestedAnswers?: string[];
  resolved: boolean;
  userAnswer?: string;
}

export interface DialogueTurn {
  id: string;
  sender: 'ai' | 'user';
  timestamp: string;
  content: string;
  aiExplanation?: string;
  targetQuestions?: MissingInfoItem[];
  userAnswerSummary?: string;
  proposal?: StrategyChangeProposal;
  isDraftGenerated?: boolean;
  suggestedChips?: Array<{ group?: string; text: string; actionValue?: string }>;
}

// 6 Core Strategy Modules
export interface StrategyDraftData {
  // Auto-generated name by AI based on object, goal & cycle
  projectName: string;
  cycleDays: number;
  startDate: string;
  endDate: string;

  // 1. 推广对象
  promotionTarget: {
    targetName: string; // 推广品牌、产品、服务或主题
    targetCategory: string;
    targetAudience: string;
    confirmedFacts: Array<{ label: string; detail: string; source: string }>;
    unconfirmedGaps: string[];
  };

  // 2. 核心目标与验证方式 (唯一主要业务目标)
  coreGoalAndVerification: {
    primaryBusinessGoal: string; // 唯一主要业务目标
    observableSignals: string[];  // 可观察的验证信号
    successCriteria: string;      // 本周期结束后如何判断继续
    adjustmentCriteria: string;   // 何时需调整打法
    stopCriteria: string;         // 何时需停止
    auxiliaryGoals?: string[];    // 辅助观察项
  };

  // 3. 核心打法 (3-5句话清晰说明逻辑)
  coreStrategy: {
    problemToSolve: string;
    contentLogic: string;
    rationale: string;
    collaborationMechanism: string;
  };

  // 4. 内容与账号分工 (真实存在账号)
  accountAndContentAssignment: {
    brandAccounts: Array<{
      id: string;
      name: string;
      fans: string;
      roleInProject: string;
      contentDirection: string;
      noteCount: number;
      frequency: string;
      timeWindow: string;
    }>;
    kosAccounts: Array<{
      id: string;
      name: string;
      storeName: string;
      roleInProject: string;
      contentDirection: string;
      noteCount: number;
      frequency: string;
      timeWindow: string;
    }>;
    kocParticipants: {
      enabled: boolean;
      roleInProject: string;
      recruitmentCount: number;
      taskType: '真实体验测评' | '问卷打卡';
      contentDirection: string;
      requiredMaterialSpecs: string;
      hasQuestionnaire: boolean;
    };
    totalNotesCount: number;
  };

  // 5. 资源与人在环路 (明确区分自动与人工)
  humanInTheLoop: {
    systemAutomated: string[];
    operatorRequired: string[];
  };

  // 6. 假设与依据 (三类清晰区分)
  hypothesesAndBasis: {
    confirmedFacts: Array<{ id: string; text: string; source: string }>;
    pendingHypotheses: Array<{ id: string; text: string; basis: string; status: StrategicItemStatus }>;
    missingItemsToTrack: Array<{ id: string; text: string; impact: string }>;
  };
}

// Strategy Proposal Modification
export interface QuestionnaireQuestion {
  id: string;
  title: string;
  type: string;
  isRequired: boolean;
  options?: string[];
}

export const DEFAULT_QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  { id: "q1", title: "1. 宠物当前月龄？", type: "单选", isRequired: true, options: ["0-3个月", "3-6个月", "6个月以上"] },
  { id: "q2", title: "2. 换粮前最主要的困扰？", type: "多选", isRequired: true, options: ["软便/拉稀", "挑食/不爱吃", "泪痕严重", "毛发粗糙", "太瘦不长肉"] },
  { id: "q3", title: "3. 试用本产品的效果？", type: "多选", isRequired: true, options: ["便便成型", "胃口变好", "毛发变亮", "长肉发腮", "无明显变化"] },
  { id: "q4", title: "4. 你会向朋友推荐吗？", type: "单选", isRequired: true, options: ["会", "可能会", "不会"] },
];

export interface StrategyChangeProposal {
  id: string;
  userPrompt: string;
  aiInterpretation: string;
  diffSummary: Array<{
    moduleName: string;
    before: string;
    after: string;
  }>;
  impactScope: {
    affectedNotesCount: number;
    affectedAccounts: string[];
    affectedSchedule: string;
    taskChanges: {
      added: string[];
      removed: string[];
      modified: string[];
    };
    hasConflictWithFacts: boolean;
    conflictDetail?: string;
  };
}
