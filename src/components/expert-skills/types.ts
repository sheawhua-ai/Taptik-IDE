export type CapabilityType = 'expert' | 'skill';

export type StaticStatus = 
  | 'uninstalled'    // 未安装
  | 'installed'      // 已安装
  | 'enabled'        // 已启用
  | 'needs_config'   // 需要配置
  | 'test_failed'    // 测试未通过
  | 'disabled';      // 已停用

export interface MonitoringStatus {
  isMonitoring: boolean;
  state: '监控中' | '等待下一次触发' | '运行异常';
  lastCheck: string;
  nextCheck: string;
}

// 12 Operational Process Categories
export type ProcessCategory =
  | 'all'         // 全部
  | 'diagnosis'   // 商家诊断
  | 'research'    // 市场与机会研究
  | 'strategy'    // 策略与项目策划
  | 'account'     // 账号与矩阵
  | 'content'     // 选题与内容
  | 'material'    // 素材策划与生产
  | 'audit'       // 审核与合规
  | 'publish'     // 发布与调度
  | 'interaction' // 评论与私域承接
  | 'review'      // 数据观察与复盘
  | 'experience'; // 经验沉淀与方法优化

// Secondary Daily Tasks
export type DailyTaskType =
  | 'all'
  | 'organize_docs'     // 整理资料
  | 'analyze_tables'    // 分析表格
  | 'extract_web'       // 提取网页
  | 'deconstruct_comp'  // 拆解竞品
  | 'generate_copy'     // 生成文案
  | 'audit_content'     // 审核内容
  | 'check_materials'   // 检查素材
  | 'make_schedules'    // 安排排期
  | 'assign_accounts'   // 分配账号
  | 'create_tasks'      // 创建任务
  | 'handle_anomalies'  // 处理异常
  | 'generate_reports'  // 生成日报/周报
  | 'precipitate_exp'   // 沉淀经验
  | 'build_skills';     // 构建技能

// Skill Sources
export type SkillSourceType =
  | 'official'      // TapTik官方
  | 'team'          // 团队共享
  | 'mine'          // 我创建的
  | 'external'      // 外部导入
  | 'from_exp'      // 从经验升级
  | 'from_project'  // 从项目沉淀
  | 'merchant'      // 商家专属
  | 'temp_project'; // 项目临时

export type AppScope = 'task' | 'project' | 'merchant' | 'all';

export type TabType = 'experts' | 'skills' | 'my';

// Merchant Capability Recommendation Item
export interface MerchantRecommendation {
  id: string;
  type: CapabilityType;
  targetId?: string;
  targetName: string;
  triggerFact: string;                  // 为什么推荐：1句话事实
  problemSolved: string;               // 可以解决什么：运营问题与影响环节
  requiredDocsAndConfigs: string[];    // 使用前还需要什么：资料/缺少信息/配置
  manualConfirmPoints: string[];       // 人工确认点：运行过程中不自动执行的决策
  prepStatus: '可直接运行' | '需要补充资料' | '需要完成配置' | '当前不适用';
  
  // Recommendation evidence breakdown
  confirmedFacts: string[];
  systemInferences: string[];
  missingInfo: string[];
  
  itemData: any;                       // ExpertItem or SkillItem
}

// Usage modal selection for Task Workbench
export type ResultUsageType =
  | 'project_strategy'   // 加入当前项目的策略依据
  | 'create_val_proj'    // 创建验证项目
  | 'execution_todo'     // 创建执行中心待办
  | 'write_merchant_kb'  // 写入商家知识
  | 'save_to_experience' // 保存到我的经验
  | 'none';              // 暂不采用

export interface RunLogItem {
  id: string;
  timestamp: string;
  projectName: string;
  skillsUsed: string[];
  knowledgeCited: string[];
  factsCount: number;
  inferencesCount: number;
  manualConfirmStatus: string;
  targetApp: string;
  resultSummary: string;
}

export interface ExpertSkillComposition {
  defaultSkills: SkillItem[];
  optionalSkills: SkillItem[];
  replacedSkills: { originalSkillName: string; replacedWith: string; reason: string }[];
  manualConfirmPoints: string[];
}

export interface ExpertItem {
  id: string;
  name: string;
  description: string;
  mission: string;                     // 专家使命
  businessTask: string;               // 可完成的核心任务
  scenarioStage: ProcessCategory;     // 适用运营阶段
  status: StaticStatus;               // 静态状态
  monitoring?: MonitoringStatus;      // 定时监控状态 (若有)
  version: string;
  updatedAt: string;
  lastUsedTime: string;
  lastRunResult: string;              // 最近一次任务结果
  hasPendingConfirms: boolean;        // 是否有待确认事项
  appScope: AppScope;                 // 当前授权范围
  
  // Expert Details
  whatItCanDo: string[];              // 可以完成什么
  whatItWontDoAuto: string[];         // 不会自动做什么
  applicableScenes: string[];         // 适用场景
  inputDocs: string[];                // 输入资料
  outputResults: string[];            // 输出结果
  boundSkills: SkillItem[];           // 已绑定技能
  manualConfirmPoints: string[];      // 人工确认点
  failureAndMissingInfoHandling: string; // 失败或信息不足时如何处理
  
  runLogs: RunLogItem[];
  composition: ExpertSkillComposition;
}

export interface SkillItem {
  id: string;
  name: string;
  oneSentenceDesc: string;            // 一句话用途
  processCategory: ProcessCategory;   // 适用运营环节
  dailyTaskTag?: DailyTaskType;       // 日常任务标签
  source: SkillSourceType;            // 来源
  
  status: StaticStatus;
  version: string;
  updatedAt: string;
  lastTestStatus: 'passed' | 'failed' | 'untested';
  lastVerifiedResult: string;
  
  usedByExpertsCount: number;
  usedByProjectsCount: number;
  usedByExperts: { id: string; name: string }[];
  usedByProjects: string[];
  
  // Skill Contract Details
  goal: string;                       // 技能目标
  applicableScenes: string[];         // 适用场景
  inapplicableScenes: string[];       // 不适用场景
  inputFormat: string[];              // 输入要求
  outputFormat: string[];             // 输出结果
  preConditions: string[];            // 前置条件
  executionSteps: string[];           // 执行步骤摘要
  risksAndLimits: string[];           // 限制与风险
  failureHandling: string;            // 失败处理
  manualConfirmPoints: string[];      // 人工确认点
  requiredPermissions: {
    readScope: string[];
    writeScope: string[];
    needsNetwork: boolean;
    willModifyData: boolean;
  };
  
  appScope: AppScope;
}

export interface MyCapabilityItem {
  id: string;
  name: string;
  type: CapabilityType;
  appScope: AppScope;
  status: StaticStatus;
  monitoring?: MonitoringStatus;
  lastUsed: string;
  lastResult: string;
  pendingConfirmCount?: number;
  usedByExpertsOrProjects?: string[];
  refData: ExpertItem | SkillItem;
}

export interface CapabilityPackageImport {
  type: 'zip' | 'folder' | 'markdown' | 'git' | 'package';
  detectedType: CapabilityType | 'knowledge';
  name: string;
  purpose: string;
  source: string;
  safetyCheck: {
    readScope: string[];
    writeScope: string[];
    networkAccess: boolean;
    externalDeps: string[];
    hasExecutableCode: boolean;
  };
  dependenciesAndConflicts: {
    missingDeps: string[];
    conflicts: string[];
  };
  testStatus: 'passed' | 'failed' | 'pending';
  installScope: AppScope;
}
