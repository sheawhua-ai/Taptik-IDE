// TapTik Unified Business Models

export interface Merchant {
  id: string;
  name: string;
}

export interface LandingPageSettings {
  loginMode: "无需登录" | "微信登录";
  bannerUrl?: string;
  posterTitle?: string;
  customUrl?: string;
  hasQuestionnaire?: boolean;
  questionnaireQuestions?: any[];
}

export interface DistributionScheme {
  brandTotalNotes?: number;
  kosTotalNotes?: number;
  kocTotalNotes?: number;
  totalPlannedNotes?: number;
  ownAccounts?: {
    brandAccounts?: {
      selectedAccountIds: string[];
      notesPerAccount: number;
      publishFrequency?: string;
      suggestedTimeWindow?: string;
    };
    kosAccounts?: {
      selectedAccountIds: string[];
      notesPerAccount: number;
      publishFrequency?: string;
      suggestedTimeWindow?: string;
    };
  };
  consumerKoc?: {
    recruitmentCount: number;
    packagesPerPerson: number;
    hasQuestionnaire: boolean;
    needPhotos: boolean;
    photoCountRange?: string;
    claimValidityDays?: number;
    observationDays?: number;
    enableWechatNotice?: boolean;
  };
  aiSuggestion?: string;
}

export interface Project {
  id: string;
  merchantId: string;
  name: string;
  status: "准备中" | "进行中" | "已结束";
  goal: string;
  startDate: string;
  endDate: string;
  budget: string;
  strategyProtocol: any;
  landingPageSettings?: LandingPageSettings;
  distributionScheme?: DistributionScheme;
}

export interface StrategyConfiguration {
  targetAudience?: string;
  coreProblem: string;
  solutionSummary: string;
  verifyHypothesis: string;
  continueCondition?: string;
  stopCondition?: string;
  targetKeywords: string[];
  observationDays?: number;
}

export interface StrategyVersion {
  id: string;
  projectId: string;
  version: number;
  source: "initial" | "expert_adjustment" | "review_applied";
  status: "active" | "superseded";
  configuration: StrategyConfiguration;
  changedFields: string[];
  createdAt: string;
  createdBy: string;
  effectiveFrom: string;
}

export interface ReviewAdjustmentProposal {
  id: string;
  projectId: string;
  sourcePublishedNoteIds: string[];
  summary: string;
  changedFields: string[];
  status: "pending" | "applied" | "dismissed";
  createdAt: string;
  appliedStrategyVersionId?: string;
}

export interface Round {
  id: string;
  projectId: string;
  name: string;
}

export interface NotePackageSpec {
  guidelines: string;         // 规定要怎么写
  materialTaskReqs: string;   // 素材按任务拍摄
  questionnaireStatus: "待填写" | "已填写" | "生成中";
  questionnaireFields?: {
    petBreed?: string;
    petAge?: string;
    symptom?: string;
    experience?: string;
    storeName?: string;
  };
  feedbackVersion?: number;
  feedbackQuestions?: Array<{
    id: string;
    prompt: string;
    options: string[];
    contentField: "identity" | "problem" | "experience";
  }>;
}

export interface NoteSlot {
  id: string;
  projectId: string;
  roundId: string;
  accountType: "KOC" | "店长号/KOS" | "品牌主号";
  accountName: string;
  contentDirection: string;
  plannedDate: string;
  isNotePackage?: boolean;
  packageSpec?: NotePackageSpec;
}

export interface ContentDraft {
  id: string;
  noteSlotId: string;
  status: "待生成" | "待确认" | "已确认";
  title: string;
  body: string;
  tags: string[];
  /** The strategy version is frozen when the note is generated. */
  strategyVersionId?: string;
}

export interface MaterialRequirement {
  id: string;
  projectId?: string;
  noteSlotId?: string;
  reqs: string;
  isProjectLevel?: boolean;
}

export type MaterialTaskStatus = "待认领" | "执行中" | "已上传" | "AI预检" | "待提交" | "待验收" | "部分退回/需补拍" | "已验收" | "已关闭";
export interface MaterialTask {
  id: string;
  requirementId: string;
  assignee: string;
  status: MaterialTaskStatus;
}

export interface MaterialAsset {
  id: string;
  taskId: string;
  url: string;
  type: string;
  aiStatus: string;
}

export interface ProjectMaterialAsset {
  id: string;
  projectId: string;
  title: string;
  url: string;
  tags: string[];
}

export interface MaterialRecommendation {
  id: string;
  noteSlotId: string;
  assetId: string;
  matchScore: number;
  reason: string;
}

export interface NoteMaterialSelection {
  noteSlotId: string;
  selectedAssetIds: string[];
  coverAssetId?: string;
  updatedAt: string;
}

export interface ConsumerContentPackageClaim {
  id: string;
  contentPackageNoteSlotId: string;
  projectId: string;
  consumerName: string;
  claimedAt: string;
  strategyVersionId: string;
  feedbackVersion: number;
  generatedNoteSlotId?: string;
  status: "claimed" | "feedback_submitted" | "note_generated";
}

export interface ConsumerExperienceFeedback {
  id: string;
  claimId: string;
  contentPackageNoteSlotId: string;
  strategyVersionId: string;
  feedbackVersion: number;
  submittedAt: string;
  answers: {
    petBreed?: string;
    petAge?: string;
    problem: string;
    experience: string;
    storeName?: string;
  };
}

export type ExecutionAction =
  | "edit_content"
  | "replace_material"
  | "create_material_task"
  | "view_material_task"
  | "review_material"
  | "handle_publish_error";

export interface ExecutionNavTarget {
  projectId?: string;
  taskId?: string;
  noteId?: string;
  action?: ExecutionAction;
  source?: "note_list" | "note_detail" | "project_creation";
}

export type PublishTaskStatus = "未安排" | "待认领" | "准备中" | "待发布" | "发布中" | "已回传链接" | "已发布" | "系统验证中" | "已验证/验证异常" | "人工确认" | "已关闭";
export interface PublishTask {
  id: string;
  noteSlotId: string;
  assignee: string;
  status: PublishTaskStatus;
  publishUrl?: string;
}

export type PublishedNoteStatus = "未产生" | "待验证" | "已验证" | "观察中" | "暂时无法访问" | "人工确认中" | "已关闭";
export interface PublishedNote {
  id: string;
  publishTaskId: string;
  status: PublishedNoteStatus;
  /** Platform note ID returned after publishing; used to match keyword search results. */
  platformNoteId?: string;
}

export interface EvidenceSnapshot {
  id: string;
  publishedNoteId: string;
  metrics: any;
  captureTime: string;
}

export interface NotePerformanceSnapshot {
  id: string;
  publishedNoteId: string;
  capturedAt: string;
  source: string;
  metrics: {
    views?: number;
    likes?: number;
    collects?: number;
    comments?: number;
    shares?: number;
    effectiveConsultations?: number;
  };
}

export interface KeywordSearchResultItem {
  noteId: string;
  rank: number;
  noteTitle?: string;
  accountName?: string;
}

export interface KeywordSearchSnapshot {
  id: string;
  projectId: string;
  keyword: string;
  capturedAt: string;
  resultLimit: number;
  source: string;
  results: KeywordSearchResultItem[];
}

export interface Issue {
  id: string;
  rootCauseType: string;
  associatedObjectIds: string[];
  impactedStage: "content" | "assets" | "publish" | "interaction";
  severity: "blocker" | "warning";
  knownFacts: string[];
  systemInferences: string[];
  pendingConfirmations: string[];
  currentAssignee: string;
  status: "open" | "resolved";
  resolutionConditions: string;
  message: string;
  impactScope: string;
}

export interface ActionTask {
  id: string;
  issueId: string;
  actionType: string;
  status: "pending" | "done";
  assignee: string;
  waitOn: string;
  nextStep: string;
}

export interface TimelineEvent {
  id: string;
  targetId: string; // ProjectID, NoteSlotID, etc.
  actor: string; // user or system
  action: string;
  fromStatus?: string;
  toStatus?: string;
  timestamp: string;
  isAutomatic: boolean;
  evidence?: string;
  newIssueId?: string;
  newTaskId?: string;
}

export interface Decision {
  id: string;
  taskId: string;
  operator: string;
  result: string;
  timestamp: string;
}

export interface Review {
  id: string;
  projectId: string;
  conclusion: string;
}
