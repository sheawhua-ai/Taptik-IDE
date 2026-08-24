export type ReviewTaskStatus = 'analyzing' | 'completed' | 'exception' | 'pending_confirmation';

export interface ReviewProgressStep {
  id: string;
  type: 'confirm' | 'analyzing' | 'blocked' | 'completed';
  statusLabel: '待确认' | '分析中' | '阻断' | '已完成';
  title: string;
  description: string;
  deadline?: string;
  actionText?: string;
  actionType?: 'confirm' | 'view_log' | 'supplement_data' | 'retry';
  agentName?: string;
}

export interface CoreConclusions {
  overallPerformance: {
    status: 'up' | 'stable' | 'down';
    title: string;
    description: string;
    metricBadge?: string;
    metricDiff?: string;
  };
  mainIssue: {
    title: string;
    description: string;
    cause: string;
    stage: string;
  };
  keyOpportunity: {
    title: string;
    description: string;
    potentialGain: string;
  };
  priorityAction: {
    title: string;
    description: string;
    immediateTarget: string;
  };
}

export interface CrossProjectItem {
  id: string;
  name: string;
  impressions: { val: string; diff: string; trend: 'up' | 'down' | 'flat' };
  conversion: { val: string; diff: string; trend: 'up' | 'down' | 'flat' };
  interaction: { val: string; diff: string; trend: 'up' | 'down' | 'flat' };
  leads: { val: string; diff: string; trend: 'up' | 'down' | 'flat' };
  aiJudgeTag: string;
  aiJudgeType: 'best' | 'warning' | 'normal';
  keyStrength: string;
  weakness: string;
}

export interface CrossProjectComparison {
  projects: CrossProjectItem[];
  aiSummary: {
    bestProject: string;
    reusableFactor: string;
    weakProjectIssue: string;
    overallRecommendation: string;
  };
}

export interface AgentPipelineNode {
  id: string;
  name: string;
  role: string;
  status: 'completed' | 'running' | 'exception' | 'pending';
  statusText: string;
  summary: string;
  duration: string;
  outputItems: string[];
  anomalyNotice?: string;
  logs: { time: string; level: 'info' | 'warn' | 'success' | 'agent'; message: string }[];
}

export interface SuggestedAction {
  id: string;
  title: string;
  target: string;
  expectedGain: string;
  priority: 'P0' | 'P1' | 'P2';
  category: string;
  actionType: 'plan' | 'note'; // 'plan' -> 纳入项目方案, 'note' -> 应用到后续笔记
  appliedStatus?: 'not_applied' | 'in_plan' | 'in_note' | 'in_specific_note' | 'manual_task';
  appliedDestinationLabel?: string; // e.g. "已纳入下一期方案", "已应用到后续笔记", "已应用到《幼犬换粮实测篇》", "已创建人工任务"
  inExecutionCenter?: boolean; // Only for genuine manual tasks if needed
  reason: string;
  recommendedSteps: string[];
}

export interface ReviewHistoryVersion {
  id: string;
  versionName: string;
  versionTag: string;
  createdAt: string;
  createdBy: string;
  dataCutoff: string;
  status: 'published' | 'draft' | 'archived';
  changelog: string;
  summarySnapshot: string;
}

export interface ReviewTask {
  id: string;
  title: string;
  dateRange: {
    start: string;
    end: string;
    label: string;
  };
  mode: 'single' | 'multi';
  projectIds: string[];
  projectNames: string[];
  targetObjective: string;
  targetObjectiveLabel: string;
  targetObjectiveLabels?: string[];
  customObjectives?: string[];
  goalDescription: string;
  status: ReviewTaskStatus;
  statusText: string;
  updatedAt: string;
  createdAt: string;
  activeVersionId: string;
  historyVersions: ReviewHistoryVersion[];
  progressSteps: ReviewProgressStep[];
  coreConclusions: CoreConclusions;
  crossProjectComparison?: CrossProjectComparison;
  agentPipeline: AgentPipelineNode[];
  suggestedActions: SuggestedAction[];
  analysisDetails: {
    summary: {
      scope: string;
      target: string;
      projectCount: number;
      timeWindow: string;
      dataSource: string;
      sampleNotesCount: number;
    };
    diagnoses: {
      issue: string;
      cause: string;
      impact: string;
      severity: 'high' | 'medium' | 'low';
      affectedStage: string;
    }[];
    metricShifts: {
      metric: string;
      before: string;
      current: string;
      change: string;
      isGood: boolean;
      note: string;
    }[];
    insights: {
      contentInsight: { title: string; takeaways: string[] };
      userInsight: { title: string; takeaways: string[] };
      conversionInsight: { title: string; takeaways: string[] };
    };
    strategicGuidelines: {
      title: string;
      detail: string;
      actionSteps: string[];
    }[];
    finalConclusion: string;
  };
}
