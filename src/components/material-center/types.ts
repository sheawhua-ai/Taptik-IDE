export type AssetStatus = 'pending' | 'available' | 'reserved' | 'used' | 'unavailable' | 'optimizing';
export type AssetType = 'image' | 'video';
export type AssetSourceType = 'operator' | 'clerk' | 'consumer' | 'ai_optimized' | 'other';
export type CoverSuitability = 'suitable' | 'optimized_suitable' | 'body_only' | 'unrecommended';

export interface UsageRecordItem {
  id: string;
  noteTitle: string;
  project: string;
  account?: string;
  publishTime: string;
  operator: string;
  status: 'reserved' | 'used';
  positionLabel?: string;
}

export interface DerivationInfo {
  parentId?: string;
  parentName?: string;
  familyId: string;
  modificationType?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface MaterialAsset {
  id: string;
  type: AssetType;
  url: string;
  duration?: string;
  
  status: AssetStatus;
  sourceType: AssetSourceType;
  
  // AI Understanding
  aiOneLineUnderstanding: string;
  suitableForCover: CoverSuitability;
  coverReason: string;
  recommendationUse: string; // 适合用途
  
  // Relationship
  linkedNoteId?: string;
  linkedNoteTitle?: string;
  
  // Source info
  uploader: string;
  uploadTime: string;
  sourceProject?: string;
  sourceTask?: string;
  authStatus?: 'verified' | 'pending' | 'none'; // 授权状态
  
  // File props
  fileInfo: {
    resolution: string;
    format: string;
    size: string;
    aspectRatio: string;
  };
  
  // Details
  usageRecords: UsageRecordItem[];
  derivationInfo?: DerivationInfo;
  
  // Full AI Analysis
  fullAiAnalysis: {
    subject: string;
    product: string;
    scene: string;
    composition: string;
    lightingColor: string;
    drawbacks?: string;
  };
}

export type TaskStatus = 'draft' | 'collecting' | 'pending_review' | 'completed';

export interface ShotRequirement {
  id: string;
  shotName: string;
  requirementDesc: string;
  status: 'pending' | 'uploaded' | 'rejected' | 'completed';
  assetId?: string;
  rejectReason?: string;
  isCover?: boolean;
  positionLabel?: string;
}

export interface CollectionTask {
  id: string;
  status: TaskStatus;
  projectName: string;
  taskName: string; // usually linked to target note
  targetNoteTitle?: string;
  executor: string;
  deadline: string;
  completedCount: number;
  totalCount: number;
  shootGoal: string;
  shotsList: ShotRequirement[];
}

export interface NoteImagePosition {
  posIndex: number;
  posType: 'cover' | 'body_1' | 'body_2' | 'body_other' | 'backup';
  label: string; 
  requirementDesc: string;
  matchedAssetId?: string;
  status: 'missing' | 'bound';
}

export interface NoteDraftRequirement {
  id: string;
  noteTitle: string;
  projectName: string;
  draftSummary: string;
  imagePositions: NoteImagePosition[];
}

export interface FilterState {
  status: AssetStatus[];
  sourceType: AssetSourceType | 'all';
  uploader: string;
  project: string;
  suitableForCover: 'all' | 'true' | 'false';
  timeRange: string;
}
