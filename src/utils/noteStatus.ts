import { Note } from "../data/projectStore";

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

export function getActionTextForIssue(issue: { type: string, message: string } | undefined, defaultAction: string = "处理"): string {
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
  if (msg.includes("发布识别异常") || msg.includes("无法访问") || msg.includes("笔记不存在")) return "处理识别异常";
  if (msg.includes("观察数据")) return "查看观察数据";
  if (msg.includes("数据异常") || msg.includes("数据更新")) return "处理数据异常";

  return defaultAction;
}
