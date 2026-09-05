export type KnowledgeType = '商家事实' | '规则与禁区' | '项目要求' | '经验建议';
export type KnowledgeState = '正常' | '待确认' | '已失效';
export type SourceType = 'PDF' | 'Word' | 'Excel' | '本地文件夹' | '文本' | '链接';
export type SourceState = '正常' | '拆解中' | '待处理' | '已断开';
export type TaskType = '缺少资料' | '来源冲突' | '高风险确认' | '拆解预览';
export type BusinessCategory = '品牌与产品' | '账号与人设' | '客户与痛点' | '内容与图文' | '禁区与流转' | '话术与承接' | '素材偏好' | '打法复盘';
export type KnowledgeFormat = 
  | '商家事实' 
  | '运营规则' 
  | '标杆范例' 
  | '常见问答' 
  | '打法经验' 
  | '事实卡' 
  | '规则卡' 
  | '范例卡' 
  | '问答卡' 
  | '经验卡';

export interface DecompositionItem {
  id: string;
  category: BusinessCategory;
  format: KnowledgeFormat;
  summary: string;
}

export interface AtomicFact {
  id: string;
  content: string;
  status: 'confirmed' | 'pending' | 'rejected';
}

export interface KnowledgeItem {
  id: string;
  summary: string;
  type: KnowledgeType;
  source: string;
  scope: string; // e.g., "全商家通用", "指定产品: 幼犬高烘干粮"
  validity: string; // e.g., "长期有效", "2026Q3项目期间"
  updateTime: string;
  state: KnowledgeState;
  category: BusinessCategory;
  originalEvidence: string;
  reliability?: string; // For 经验建议: "操盘手确认", "多次项目验证"
  usageCount?: number;
  lastUsedTime?: string;
  atomicFacts?: AtomicFact[];
}

export interface SourceItem {
  id: string;
  name: string;
  type: SourceType;
  deviceOrLocation: string;
  extractedCount: number;
  pendingCount: number;
  lastSyncTime: string;
  state: SourceState;
  exceptionReason?: string;
}

export interface PendingTask {
  id: string;
  title: string;
  type: TaskType;
  reason: string;
  impact: string;
  aiConclusion?: string;
  originalEvidence?: string;
  sourceFile?: string;
  sourceVersion?: string;
  conflictA?: { source: string; text: string; time: string };
  conflictB?: { source: string; text: string; time: string };
  missingWhat?: string;
  missingWhy?: string;
  category?: BusinessCategory;
  impactUses?: string[];
  decompositionItems?: DecompositionItem[];
}
