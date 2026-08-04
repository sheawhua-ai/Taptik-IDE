export type AssetStatus = 'available' | 'in_use' | 'used';
export type AssetType = 'image' | 'video';

export interface UnderstandingHistoryItem {
  id: string;
  version: number;
  text: string;
  updatedBy: string;
  updatedAt: string;
}

export interface UsageRecordItem {
  id: string;
  noteTitle: string;
  project: string;
  strategy: string;
  account: string;
  publishTime: string;
  status: 'using' | 'published' | 'released';
  performanceData?: string;
  operator: string;
}

export interface DerivationInfo {
  parentId?: string;
  parentName?: string;
  familyId: string;
  modificationType?: string;
  createdBy?: string;
  createdAt?: string;
  originNoteTitle?: string;
  originPerformance?: string;
}

export interface MaterialAsset {
  id: string;
  type: AssetType;
  url: string;
  duration?: string; // For videos e.g. "00:15"
  oneSentenceUnderstanding: string; // 40-150 words
  recommendationUse: string;
  drawback: string;
  status: AssetStatus;
  
  // 来源必填字段 (Section 2.1)
  merchant: string;
  sourceProject: string;
  sourceTask: string;
  shotName: string;
  store: string;
  executor: string;
  uploadTime: string;
  isHistoricalImport?: boolean; // 是否历史导入
  
  // 文件属性
  fileInfo: {
    resolution: string;
    format: string;
    size: string;
    aspectRatio: string;
  };
  
  // 历史和记录
  understandingHistory: UnderstandingHistoryItem[];
  usageRecords: UsageRecordItem[];
  derivationInfo?: DerivationInfo;
  
  // AI深入分析字段
  fullAiAnalysis: {
    subject: string;
    product: string;
    scene: string;
    action: string;
    composition: string;
    lightingColor: string;
    ocrText?: string;
  };
}

export interface ShotRequirement {
  id: string;
  shotCode: string;
  shotName: string;
  requirementDesc: string;
  status: 'pending' | 'uploaded' | 'rejected' | 'completed';
  assetId?: string;
  rejectReason?: string;
}

export interface CollectionTask {
  id: string;
  projectName: string;
  taskName: string;
  store: string;
  executor: string;
  deadline: string;
  completedCount: number;
  totalCount: number;
  needsReshootCount: number;
  blockPoint?: string;
  shootGoal: string;
  shotsList: ShotRequirement[];
  uploadLogs: {
    id: string;
    time: string;
    executor: string;
    result: 'pass' | 'reject';
    detail: string;
  }[];
  rejectedRecords: {
    id: string;
    shotName: string;
    reason: string;
    rejectedAt: string;
  }[];
}

export interface NoteImagePosition {
  posIndex: number;
  label: string; // e.g. "首图：幼犬和产品同时出现"
  requirementDesc: string;
  matchedLevel?: 'recommend' | 'other' | 'none';
  matchedAssetId?: string;
  reason?: string;
  drawbackNote?: string;
}

export interface NoteDraftRequirement {
  id: string;
  noteTitle: string;
  projectName: string;
  draftSummary: string;
  imagePositions: NoteImagePosition[];
}

export interface FilterState {
  sourceProject: string;
  sourceTask: string;
  mediaType: 'all' | 'image' | 'video';
  store: string;
  timeRange: string;
  usedProject: string;
}
