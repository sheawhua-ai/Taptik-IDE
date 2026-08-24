export type MaterialCategory = 'publish_material' | 'base_component' | 'derived_material';

export type MaterialStatus = 'pending_acceptance' | 'available' | 'reserved' | 'used' | 'archived';

export type MaterialUse = 
  | 'cover'               // 封面图
  | 'body_image'          // 笔记配图
  | 'finished_video'      // 笔记视频
  | 'real_shot'           // 实拍素材
  | 'component_cutout'    // 产品抠图/透明底图
  | 'component_logo'      // 品牌Logo/水印
  | 'component_packaging' // 包装细节图
  | 'component_swatch';   // 品牌色板/字体

export type MaterialSourceType = 'merchant' | 'task_upload' | 'clerk' | 'koc' | 'ai_derived';

export interface PerformanceMetrics {
  hasBackendData: boolean;
  performanceType: 'owned_account_creator_api' | 'koc_public_captured' | 'none';
  
  // Owned account creator backend API metrics
  creatorBackend?: {
    exposure: number;
    reads: number;
    interactions: number;
    coverClickRate: number; // e.g. 4.8 (%)
    originalMetricName: string; // e.g. "小红书创作者后台-封面点击率"
    dataSource: string; // e.g. "小红书创作者API"
    lastSyncTime: string; // e.g. "2026-08-21 02:00"
    dataCoverageStatus: string; // e.g. "100% 全量同步"
    accountMedianComparison?: {
      accountName: string;
      topic: string;
      medianClickRate: number;
      comparisonLabel: string;
    };
  };

  // KOC account performance (No creator backend API click data)
  kocMetrics?: {
    noBackendDataNotice: '无后台点击数据';
    adoptionStatus: string; // e.g. "已通过验收并采用"
    manualAcceptanceResult: string; // e.g. "操盘手验收合格 (高清, 无水印)"
    aiPrecheckResult: string; // e.g. "AI客观预检通过"
    publicNoteLink?: string;
    publicInteractions?: {
      likes: number;
      collects: number;
      comments: number;
    };
    operatorRating?: number;
  };
}

export interface DerivedLineage {
  parentId?: string;
  parentName?: string;
  parentUrl?: string;
  childMaterials?: Array<{
    id: string;
    name: string;
    url: string;
    createdAt: string;
    modificationSummary: string;
  }>;
  modificationType?: string; // e.g. "AI重新构图 + 清理背景 + 3:4花字排版"
  generatorService?: string; // e.g. "即梦-AIGC v2.1"
  promptUsed?: string;
}

export interface AcceptanceRecord {
  aiRecognition: {
    tag: 'AI识别结果，可修改' | '智能特征识别';
    status: 'passed' | 'pending_confirmation' | 'conflict';
    confidenceNotice?: string; // e.g. "检测到置信度较低或识别冲突，待人工确认"
    subject: string;
    product: string;
    scene: string;
    composition: string;
    lightingColor: string;
  };
  manualAcceptance?: {
    operatorName: string;
    time: string;
    passed: boolean;
    comment: string;
  };
}

export interface UsageRelation {
  noteId?: string;
  noteTitle?: string;
  projectId?: string;
  projectName?: string;
  accountName?: string;
  publishDate?: string;
  usageState: 'reserved' | 'used'; // 预留 / 已使用
  reservationTime?: string;
}

export interface MaterialAsset {
  id: string;
  name: string;
  url: string;
  aspectRatio: '3:4' | '1:1' | '16:9' | '9:16';
  fileType: 'image' | 'video';
  fileSize: string;
  resolution: string;

  category: MaterialCategory;
  status: MaterialStatus;
  materialUse: MaterialUse;
  sourceType: MaterialSourceType;
  sourceLabel: string; // e.g. "操盘手上传" | "任务上传-张店长"

  // Basic Info
  uploader: string;
  uploadTime: string;
  sourceProject?: string;

  // Asset Tags & Vector Description (for Multimodal Semantic Retrieval)
  tags?: string[];
  vectorDescription?: string; // 一句话描述（向量化检索特征）

  // Usage & Note Relation
  usageRelation?: UsageRelation;

  // Performance
  performance: PerformanceMetrics;

  // Derivation (optional legacy lineage)
  lineage?: DerivedLineage;

  // Acceptance & Recognition metadata
  acceptance: AcceptanceRecord;
}

export interface FilterState {
  primaryTab: 'publishable' | 'base_components' | 'pending_acceptance' | 'used' | 'archived';
  searchQuery: string;
  materialUse: string;
  category: string;
  sourceType: string;
  status: string;
  project: string;
  performanceFilter: string; // 'all' | 'has_creator_data' | 'no_backend_data'
  uploader?: string;
  suitableForCover?: string;
  timeRange?: string;
}

// Backward compatible aliases
export type AssetStatus = MaterialStatus;
export type AssetSourceType = MaterialSourceType;
export type ShotRequirement = CollectionTask['shotsList'][0];
export interface NoteDraftRequirement {
  id: string;
  title: string;
  projectName: string;
  slots: Array<{
    position: number;
    label: string;
    requirement: string;
    assetId?: string;
  }>;
}

export interface CollectionTask {
  id: string;
  status: 'draft' | 'collecting' | 'pending_review' | 'completed';
  projectName: string;
  taskName: string;
  targetNoteTitle?: string;
  executor: string;
  deadline: string;
  completedCount: number;
  totalCount: number;
  shootGoal: string;
  needsReshootCount?: number;
  shotsList: Array<{
    id: string;
    shotName: string;
    requirementDesc: string;
    status: 'pending' | 'uploaded' | 'rejected' | 'completed';
    assetId?: string;
    rejectReason?: string;
    isCover?: boolean;
    positionLabel?: string;
  }>;
}

