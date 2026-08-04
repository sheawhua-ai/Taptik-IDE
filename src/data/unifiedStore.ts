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
}

export interface Round {
  id: string;
  projectId: string;
  name: string;
}

export interface NoteSlot {
  id: string;
  projectId: string;
  roundId: string;
  accountType: "KOC" | "店长号/KOS" | "品牌主号";
  accountName: string;
  contentDirection: string;
  plannedDate: string;
}

export interface ContentDraft {
  id: string;
  noteSlotId: string;
  status: "待生成" | "待确认" | "已确认";
  title: string;
  body: string;
  tags: string[];
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
}

export interface EvidenceSnapshot {
  id: string;
  publishedNoteId: string;
  metrics: any;
  captureTime: string;
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
