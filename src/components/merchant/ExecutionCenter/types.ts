// Types for TapTik Execution Center (Operator Workbench Baseline 2.0)

export type ExecutionOperatorCategory = 'all' | 'content' | 'material' | 'publish' | 'anomaly';
export type ExecutionCategory = ExecutionOperatorCategory;

export type ExecutionStatusFilter = 
  | 'need_my_action'       // Default: 待我处理 (Operator pending items only)
  | 'team_in_progress'     // 团队/员工执行中
  | 'system_processing'    // 系统处理中
  | 'completed'            // 已完成归档
  | 'all_records';         // 查看全部记录

export type LegalTaskStatus = '待执行' | '执行中' | '已完成' | '已取消';

export interface UploadedAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  filename: string;
  uploadTime: string;
  fileSize: string;
  resolution: string;
  technicalCheck: {
    resolutionValid: boolean;
    noWatermark: boolean;
    lightingQuality: '良好' | '偏暗' | '过曝' | '正常';
    aspectRatio: string;
    summary: string;
  };
}

export interface LibraryMaterialItem {
  id: string;
  title: string;
  category: '门店实拍' | '产品特写' | '使用场景' | '证书资质' | '设计海报';
  url: string;
  source: '素材中心' | '知识库' | '历史笔记' | '员工上传';
  matchScore: number;
  tags: string[];
  dimensions?: string;
  isRecommendedCover?: boolean;
}

export interface GeneratedMaterialTask {
  id: string;
  requirement: string;
  assigneeRole: string;
  assigneeName: string;
  deadline: string;
  status: 'pending' | 'sent';
  selectedForBatch?: boolean;
  isCustom?: boolean;
}

export interface MaterialSubItem {
  id: string;
  requirement: string;
  isRequired: boolean;
  uploadedAssets: UploadedAsset[];
  autoCheckResult: string;
  manualStatus: '待验收' | '已通过' | '需补拍' | '不需要';
  reshootReason?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  note?: string;
}

export type SelectionTargetType = 'title' | 'body_paragraph' | 'body_all' | 'tags' | 'material' | 'material_recommendation' | null;

export interface SelectionAIProposal {
  target: SelectionTargetType;
  selectedExcerpt: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  impactScope: string;
  isAdopted?: boolean;
}

export interface StrategyContext {
  intent: string;
  targetAudience: string;
  corePainPoint: string;
  searchKeywords: string[];
  strategyPhase: string;
  expectedPublishTime?: string;
  impactAccounts: string[];
  subsequentTasks: string[];
}

export type AnomalyType = 
  | 'overdue_unclaimed'
  | 'material_reshoot_overdue'
  | 'unverified_publish_link'
  | 'executor_account_unavailable'
  | 'data_sync_auth_expired'
  | 'content_compliance_risk';

export interface ReturnedPublishData {
  publishUrl?: string;
  noteIdInPlatform?: string;
  publishTime?: string;
  screenshotUrl?: string;
  notes?: string;
  unverifiedReason?: string;
}

export interface ExecutionTask {
  id: string;
  title: string;
  operatorCategory: 'content' | 'material' | 'publish' | 'anomaly';
  categoryLabel: '笔记确认' | '素材待办' | '发布核销' | '异常处理';
  status: LegalTaskStatus;
  isAnomaly?: boolean;
  anomalyType?: AnomalyType;
  anomalyReason?: string;
  
  // Project & Target
  projectId: string;
  projectName: string;
  noteId?: string;
  noteTitle: string;
  targetAccount: string;
  accountType: '品牌主号' | '店长号/KOS' | 'KOC' | '外部达人';
  
  // Operator action definition
  operatorActionSummary: string; // 操盘手需要完成的动作
  reasonForIntervention: string; // 为什么需要人工介入
  deadline?: string;             // 截止时间
  deadlineLabel?: '已逾期' | '今日到期' | '即将到期' | '普通';
  isBlocked?: boolean;           // 是否阻断后续流程
  isPinned?: boolean;            // 置顶
  
  // Workflow assignment
  waitingParty: string;          // 当前等待方
  waitingRole: 'operator' | 'team' | 'system' | 'completed';
  isMeWaiting: boolean;          // 是否属于操盘手必须处理
  isTeamExecuting: boolean;      // 团队成员执行中 (非待办)
  isSystemProcessing: boolean;   // 系统正常处理中 (非待办)
  createdAt: string;
  
  // Button verb
  primaryActionLabel: string;    // 修改笔记 / 验收素材 / 核销发布结果 / 确认发布并归档 / 处理异常 / 查看进度
  
  // Progressive disclosure & Flow connection
  currentOccurrence: string;     // 当前发生了什么
  confirmedFacts: string[];      // 哪些事实已经确认
  nextStepAfterAction: string;   // 操作后的下一步
  
  // Content details (operatorCategory === 'content')
  draftTitle?: string;
  draftBody?: string;
  tags?: string[];
  complianceRisk?: string;
  evidenceNeeded?: string;
  strategyContext?: StrategyContext;
  selectedCoverUrl?: string;
  selectedMaterialAssets?: LibraryMaterialItem[];
  generatedMaterialTasks?: {
    id: string;
    requirement: string;
    assignee: string;
    deadline: string;
    status: '待派发' | '已派发';
  }[];
  
  // Material details (operatorCategory === 'material')
  materialType?: 'matched_library_asset' | 'returned_shooting_asset';
  matchedAssetThumbnail?: string;
  materialSubItems?: MaterialSubItem[];
  
  // Publish details (operatorCategory === 'publish')
  publishType?: '自有员工发布' | 'KOS店长发布' | 'KOC协作发布';
  publisherName?: string;
  publishContent?: {
    title: string;
    body: string;
    tags: string[];
    images: string[];
    scheduleTime: string;
  };
  returnedData?: ReturnedPublishData;
  
  // History & Context
  timelineEvents: TimelineEvent[];
}

export interface TaskBatchGroup {
  id: string;
  projectId: string;
  projectName: string;
  operatorCategory: 'content' | 'material';
  title: string;
  subtitle: string;
  totalCount: number;
  riskCount?: number;
  taskIds: string[];
  primaryActionLabel: string;
}

