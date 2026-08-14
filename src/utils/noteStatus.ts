import { Note } from "../data/projectStore";

// 13 统一业务状态 (Section 7.1)
export type UnifiedBusinessStatus =
  | "笔记占位"
  | "内容生成中"
  | "待内容确认"
  | "待素材"
  | "内容已就绪"
  | "待发布"
  | "等待账号执行"
  | "等待消费者领取"
  | "消费者进行中"
  | "发布识别中"
  | "观察中"
  | "观察完成"
  | "异常";

export type DisplayStatus = 
  | "异常"
  | "内容待确认"
  | "素材待验收"
  | "素材待收集"
  | "素材匹配中"
  | "发布准备"
  | "待发布"
  | "等待识别"
  | "观察中"
  | "已完成"
  | "内容准备";

/**
 * 转换为规范的 13 种业务状态之一
 */
export function getUnifiedBusinessStatus(note: Note): UnifiedBusinessStatus {
  // 1. 明确异常/阻断
  if (
    note.publishStatus === "发布异常" ||
    note.resultStatus === "数据异常" ||
    note.currentIssue?.type === "blocker" ||
    (note.currentIssue && note.currentIssue.message?.includes("异常"))
  ) {
    return "异常";
  }

  // 2. 观察完成
  if (note.resultStatus === "已完成") {
    return "观察完成";
  }

  // 3. 观察中
  if (note.resultStatus === "观察中" || (note.publishStatus === "已发布" && note.publishLink)) {
    return "观察中";
  }

  // 4. 发布识别中
  if (note.publishStatus === "已发布" && !note.publishLink) {
    return "发布识别中";
  }

  // 5. 笔记包 / 消费者KOC特有状态
  if (note.isNotePackage || note.type === "KOC") {
    if (note.publishStatus === "待领取" || !note.participant || note.participant.includes("待领取")) {
      return "等待消费者领取";
    }
    if (note.packageSpec?.questionnaireStatus === "待填写" || note.materialStatus === "待收集" || note.materialStatus === "待验收") {
      return "消费者进行中";
    }
  }

  // 6. 等待账号执行 (自有账号已下发H5但尚未确认完成)
  if (note.publishStatus === "待发布" && (note.type === "店长号/KOS" || note.type === "品牌主号")) {
    return "等待账号执行";
  }

  // 7. 待发布
  if (note.publishStatus === "待发布") {
    return "待发布";
  }

  // 8. 待内容确认
  if (note.contentStatus === "待确认" || note.currentIssue?.targetWorkbench === "content") {
    return "待内容确认";
  }

  // 9. 待素材
  if (note.materialStatus === "待收集" || note.materialStatus === "待验收" || note.materialTask?.status === "进行中" || note.materialTask?.status === "待验收") {
    return "待素材";
  }

  // 10. 内容已就绪
  if (note.contentStatus === "已确认" && (note.materialStatus === "已齐" || note.materialStatus === "无需素材")) {
    return "内容已就绪";
  }

  // 11. 内容生成中
  if (note.contentStatus === "待生成" && note.body) {
    return "内容生成中";
  }

  // 12. 笔记占位
  if (note.contentStatus === "待生成" && !note.body) {
    return "笔记占位";
  }

  return "内容已就绪";
}

/**
 * 获取状态徽章样式
 * 规则：普通等待状态使用中性色，只有阻断、逾期、明确异常使用红色，完成使用绿色
 */
export function getStatusStyleClass(status: UnifiedBusinessStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case "异常":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    case "观察完成":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "观察中":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    case "发布识别中":
      return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
    case "待发布":
    case "等待账号执行":
      return { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" };
    case "等待消费者领取":
    case "消费者进行中":
      return { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" };
    case "待内容确认":
    case "待素材":
      return { bg: "bg-neutral-100", text: "text-neutral-700", border: "border-neutral-200" };
    case "内容已就绪":
      return { bg: "bg-emerald-50/70", text: "text-emerald-700", border: "border-emerald-200" };
    case "内容生成中":
    case "笔记占位":
    default:
      return { bg: "bg-neutral-100", text: "text-neutral-600", border: "border-neutral-200" };
  }
}

export function getNoteDisplayStatus(note: Note): DisplayStatus {
  // 异常
  if (note.publishStatus === "发布异常" || note.resultStatus === "数据异常" || note.currentIssue?.type === "blocker") {
    return "异常";
  }

  // 内容待确认
  if (note.contentStatus === "待确认" || note.currentIssue?.targetWorkbench === "content") {
    return "内容待确认";
  }

  // 素材待验收
  if (note.materialStatus === "待验收" || note.materialTask?.status === "待验收") {
    return "素材待验收";
  }

  // 素材待收集
  if (note.materialStatus === "待收集" || note.materialTask?.status === "待收集" || note.materialTask?.status === "进行中") {
    return "素材待收集";
  }

  // 素材匹配中
  if (note.materialTask?.status === "匹配中") {
    return "素材匹配中";
  }

  // 发布准备
  if (note.contentStatus === "已确认" && (note.materialStatus === "已齐" || note.materialStatus === "无需素材") && (note.publishStatus === "未安排" || note.publishStatus === "待领取")) {
    return "发布准备";
  }

  // 待发布
  if (note.publishStatus === "待发布") {
    return "待发布";
  }

  // 等待识别
  if (note.publishStatus === "已发布" && !note.publishLink && note.resultStatus !== "已完成" && note.resultStatus !== "观察中") {
    return "等待识别";
  }

  // 观察中
  if (note.resultStatus === "观察中" || (note.publishStatus === "已发布" && note.publishLink && note.resultStatus === "未开始观察")) {
    return "观察中";
  }

  // 已完成
  if (note.resultStatus === "已完成") {
    return "已完成";
  }

  // Fallback
  return "内容准备";
}

export function getNoteMainStage(note: Note): "内容准备" | "素材准备" | "发布准备" | "已发布" | "观察中" | "观察完成" {
  if (note.resultStatus === "已完成") return "观察完成";
  if (note.resultStatus === "观察中") return "观察中";
  if (note.publishStatus === "已发布" && note.publishLink && note.resultStatus === "未开始观察") return "观察中";
  if (note.publishStatus === "已发布" && !note.publishLink) return "已发布";
  
  if (note.publishStatus === "待发布" || note.publishStatus === "待领取" || note.publishStatus === "发布异常") return "发布准备";
  
  // If content is confirmed but material is not ready
  if (note.contentStatus === "已确认" && (note.materialStatus === "待收集" || note.materialStatus === "待验收" || note.materialTask?.status === "匹配中" || note.materialTask?.status === "进行中")) {
    return "素材准备";
  }
  
  // If content is confirmed and material is ready but publishStatus is 未安排
  if (note.contentStatus === "已确认" && (note.materialStatus === "无需素材" || note.materialStatus === "已齐") && note.publishStatus === "未安排") {
    return "发布准备";
  }
  
  // Fallback to content preparing if content is not confirmed
  return "内容准备";
}

export interface ProjectPipeline {
  totalNotes: number;
  contentPreparing: number;
  contentPendingReview: number;
  contentReady: number;
  materialPreparing: number;
  materialReady: number;
  readyToPublish: number;
  waitingRecognition: number;
  observing: number;
  completed: number;
  exception: number;
}

export function calculateProjectPipeline(notes: Note[]): ProjectPipeline {
  const pipeline: ProjectPipeline = {
    totalNotes: notes.length,
    contentPreparing: 0,
    contentPendingReview: 0,
    contentReady: 0,
    materialPreparing: 0,
    materialReady: 0,
    readyToPublish: 0,
    waitingRecognition: 0,
    observing: 0,
    completed: 0,
    exception: 0,
  };

  notes.forEach(note => {
    if (note.contentStatus === "已确认") {
      pipeline.contentReady++;
    }
    
    const status = getNoteDisplayStatus(note);
    switch (status) {
      case "内容准备":
        pipeline.contentPreparing++;
        break;
      case "内容待确认":
        pipeline.contentPendingReview++;
        break;
      case "素材待收集":
      case "素材待验收":
      case "素材匹配中":
        pipeline.materialPreparing++;
        break;
      case "发布准备":
        pipeline.materialReady++; 
        break;
      case "待发布":
        pipeline.readyToPublish++;
        break;
      case "等待识别":
        pipeline.waitingRecognition++;
        break;
      case "观察中":
        pipeline.observing++;
        break;
      case "已完成":
        pipeline.completed++;
        break;
      case "异常":
        pipeline.exception++;
        break;
    }
  });

  return pipeline;
}

export function getActionTextForIssue(issue: { type: string, message: string } | undefined, defaultAction: string = "去处理"): string {
  if (!issue) return defaultAction;
  const msg = issue.message;
  if (msg.includes("事实依据")) return "补充事实依据";
  if (msg.includes("合规") || msg.includes("高风险") || msg.includes("绝对化")) return "确认修改";
  if (msg.includes("内容") && msg.includes("确认")) return "确认内容";
  if (msg.includes("回传") && msg.includes("素材")) return "验收素材";
  if (msg.includes("素材") && (msg.includes("未通过") || msg.includes("打回"))) return "查看退回原因";
  if (msg.includes("素材") && msg.includes("缺失")) return "下发拍摄任务";
  if (msg.includes("补拍")) return "下发补拍任务";
  if (msg.includes("安排发布")) return "安排发布";
  if (msg.includes("等待识别")) return "查看识别进度";
  if (msg.includes("发布识别异常") || msg.includes("无法访问") || msg.includes("笔记不存在")) return "处理发布异常";
  if (msg.includes("观察数据")) return "查看观察数据";
  if (msg.includes("数据异常") || msg.includes("数据更新")) return "处理数据异常";

  return defaultAction;
}

