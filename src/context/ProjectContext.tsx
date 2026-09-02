import React, { createContext, useContext, useState, useMemo } from "react";
import { Project as OldProject, Note as OldNote, NoteIssue as OldNoteIssue } from "../data/projectStore";
import { 
  Merchant, Project, Round, NoteSlot, ContentDraft, MaterialRequirement, MaterialTask,
  MaterialAsset, PublishTask, PublishedNote, Issue, ActionTask, TimelineEvent,
  DistributionScheme, StrategyConfiguration, StrategyVersion, ReviewAdjustmentProposal,
  NotePerformanceSnapshot, KeywordSearchSnapshot, ProjectMaterialAsset, MaterialRecommendation,
  NoteMaterialSelection, ConsumerContentPackageClaim, ConsumerExperienceFeedback, ExecutionNavTarget
} from "../data/unifiedStore";
import { 
  mockMerchants, mockProjects, mockRounds, mockNoteSlots, mockContentDrafts,
  mockMaterialRequirements, mockMaterialTasks, mockMaterialAssets, mockPublishTasks,
  mockPublishedNotes, mockIssues, mockActionTasks, mockTimelineEvents, mockStrategyVersions,
  mockReviewAdjustmentProposals, mockNotePerformanceSnapshots, mockKeywordSearchSnapshots,
  mockProjectMaterialAssets, mockMaterialRecommendations, mockNoteMaterialSelections,
  mockConsumerContentPackageClaims, mockConsumerExperienceFeedbacks
} from "../data/unifiedMockData";

export interface EnrichedActionTask {
  id: string; // task_id
  issueId: string;
  actionType: string;
  status: "pending" | "done";
  assignee: string;
  waitOn: string;
  nextStep: string;
  
  // Enriched
  issueMessage: string;
  impactScope: string;
  severity: "blocker" | "warning";
  impactedStage: "content" | "assets" | "publish" | "interaction";
  
  projectId: string;
  projectName: string;
  
  noteSlotId?: string;
  noteTitle?: string;
  accountName?: string;
  accountType?: string;
  plannedDate?: string;
}

interface UnifiedState {
  merchants: Merchant[];
  projects: Project[];
  rounds: Round[];
  noteSlots: NoteSlot[];
  contentDrafts: ContentDraft[];
  materialRequirements: MaterialRequirement[];
  materialTasks: MaterialTask[];
  materialAssets: MaterialAsset[];
  publishTasks: PublishTask[];
  publishedNotes: PublishedNote[];
  strategyVersions: StrategyVersion[];
  reviewAdjustmentProposals: ReviewAdjustmentProposal[];
  notePerformanceSnapshots: NotePerformanceSnapshot[];
  keywordSearchSnapshots: KeywordSearchSnapshot[];
  projectMaterialAssets: ProjectMaterialAsset[];
  materialRecommendations: MaterialRecommendation[];
  noteMaterialSelections: NoteMaterialSelection[];
  consumerContentPackageClaims: ConsumerContentPackageClaim[];
  consumerExperienceFeedbacks: ConsumerExperienceFeedback[];
  issues: Issue[];
  actionTasks: ActionTask[];
  timelineEvents: TimelineEvent[];
}

export interface ProjectContextType {
  // Expose the old shapes for backward compatibility during migration
  projects: OldProject[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentProject: OldProject | undefined;
  
  // Navigation & Tabs
  activeWorkflowTab: string;
  setActiveWorkflowTab: (tab: string) => void;
  executionNavTarget: ExecutionNavTarget | null;
  jumpToExecution: (projectOrTarget?: string | ExecutionNavTarget, taskId?: string) => void;
  clearExecutionNavTarget: () => void;
  jumpToProject: (projectId: string) => void;

  // Basic generic updates (to be replaced by specific actions)
  updateNoteStatus: (projectId: string, noteId: string, updates: Partial<OldNote>) => void;
  updateProject: (projectId: string, updates: Partial<OldProject>) => void;
  addProject: (project: OldProject) => void;
  addNewProject: (projectData: { name: string; goal: string; status?: "准备中" | "进行中" | "已结束"; startDate?: string; endDate?: string; budget?: string; strategyProtocol?: any; landingPageSettings?: any }) => string;
  deleteProject: (projectId: string) => void;
  clearNoteIssue: (projectId: string, noteId: string) => void;

  // New Actions for Notes, Materials, and Landing Pages
  createProjectNote: (projectId: string, noteData: { title: string; accountType: "KOC" | "店长号/KOS" | "品牌主号"; accountName: string; contentDirection: string; plannedDate: string; body?: string }) => void;
  batchGenerateProjectNotes: (projectId: string, generatedList: Array<{ title: string; accountType: "KOC" | "店长号/KOS" | "品牌主号"; accountName: string; contentDirection: string; plannedDate: string; body?: string }>) => void;
  createFullOperationsProject: (data: {
    merchantId?: string;
    name: string;
    goal: string;
    status?: "准备中" | "进行中" | "已结束";
    startDate?: string;
    endDate?: string;
    budget?: string;
    distributionScheme?: any;
    strategyProtocol?: any;
    notes: Array<{
      title: string;
      accountType: "KOC" | "店长号/KOS" | "品牌主号";
      accountName: string;
      contentDirection: string;
      plannedDate: string;
      targetAudience?: string;
      searchIntent?: string;
      coreExpression?: string;
      requiredMaterials?: string[];
      body?: string;
      materialMatched?: boolean;
      isNotePackage?: boolean;
      packageSpec?: any;
    }>;
    materialTasks: Array<{
      reqs: string;
      usageScenario?: string;
      specs?: string;
      assignee?: string;
      status?: any;
      associatedNoteIndices?: number[];
    }>;
    matchedAssetsCount?: number;
  }) => string;
  addProjectMaterialRequirement: (projectId: string, reqs: string, assignee?: string) => void;
  updateLandingPageSettings: (projectId: string, settings: Partial<import("../data/unifiedStore").LandingPageSettings>) => void;
  addConsumerSubmission: (projectId: string, submission: { nickname: string; contentType: string; title: string; body?: string; images: string[]; contact?: string }) => void;
  submitKOCQuestionnaire: (noteSlotId: string, questionnaireData: { petBreed: string; petAge: string; symptom: string; experience: string; storeName?: string }) => void;
  updateContentPackageFeedback: (noteSlotId: string, questions: Array<{ id: string; title: string; options?: string[] }>) => void;

  // New Unified State access
  unifiedState: UnifiedState;
  enrichedActionTasks: EnrichedActionTask[];
  
  // New Unified Actions
  resolveActionTask: (taskId: string) => void;
  updateMaterialTaskStatus: (taskId: string, status: MaterialTask['status']) => void;
  updatePublishTaskStatus: (taskId: string, status: PublishTask['status']) => void;
  createStrategyVersion: (projectId: string, configuration: StrategyConfiguration, changedFields: string[], source?: StrategyVersion['source']) => string;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UnifiedState>({
    merchants: mockMerchants,
    projects: mockProjects,
    rounds: mockRounds,
    noteSlots: mockNoteSlots,
    contentDrafts: mockContentDrafts,
    materialRequirements: mockMaterialRequirements,
    materialTasks: mockMaterialTasks,
    materialAssets: mockMaterialAssets,
    publishTasks: mockPublishTasks,
    publishedNotes: mockPublishedNotes,
    strategyVersions: mockStrategyVersions,
    reviewAdjustmentProposals: mockReviewAdjustmentProposals,
    notePerformanceSnapshots: mockNotePerformanceSnapshots,
    keywordSearchSnapshots: mockKeywordSearchSnapshots,
    projectMaterialAssets: mockProjectMaterialAssets,
    materialRecommendations: mockMaterialRecommendations,
    noteMaterialSelections: mockNoteMaterialSelections,
    consumerContentPackageClaims: mockConsumerContentPackageClaims,
    consumerExperienceFeedbacks: mockConsumerExperienceFeedbacks,
    issues: mockIssues,
    actionTasks: mockActionTasks,
    timelineEvents: mockTimelineEvents
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>("p1");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<string>("projects");
  const [executionNavTarget, setExecutionNavTarget] = useState<ExecutionNavTarget | null>(null);

  const jumpToExecution = (projectOrTarget?: string | ExecutionNavTarget, taskId?: string) => {
    const target = typeof projectOrTarget === "string"
      ? { projectId: projectOrTarget, taskId, source: "project_creation" as const }
      : (projectOrTarget || {});
    setExecutionNavTarget(target);
    setActiveWorkflowTab("execution");
  };

  const clearExecutionNavTarget = () => setExecutionNavTarget(null);

  const jumpToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setExecutionNavTarget(null);
    setActiveWorkflowTab("projects");
  };

  const enrichedActionTasks = useMemo(() => {
    return state.actionTasks.map(task => {
      const issue = state.issues.find(i => i.id === task.issueId);
      let noteSlot: NoteSlot | undefined;
      if (issue && issue.associatedObjectIds) {
        for (const objId of issue.associatedObjectIds) {
          noteSlot = state.noteSlots.find(ns => ns.id === objId);
          if (noteSlot) break;
          
          const draft = state.contentDrafts.find(cd => cd.id === objId);
          if (draft) {
            noteSlot = state.noteSlots.find(ns => ns.id === draft.noteSlotId);
            if (noteSlot) break;
          }
          
          const matTask = state.materialTasks.find(mt => mt.id === objId);
          if (matTask) {
            const req = state.materialRequirements.find(r => r.id === matTask.requirementId);
            if (req) {
              noteSlot = state.noteSlots.find(ns => ns.id === req.noteSlotId);
              if (noteSlot) break;
            }
          }
          
          const req = state.materialRequirements.find(r => r.id === objId);
          if (req) {
            noteSlot = state.noteSlots.find(ns => ns.id === req.noteSlotId);
            if (noteSlot) break;
          }

          const pubTask = state.publishTasks.find(pt => pt.id === objId);
          if (pubTask) {
            noteSlot = state.noteSlots.find(ns => ns.id === pubTask.noteSlotId);
            if (noteSlot) break;
          }

          const pubNote = state.publishedNotes.find(pn => pn.id === objId);
          if (pubNote) {
            const pt = state.publishTasks.find(p => p.id === pubNote.publishTaskId);
            if (pt) {
              noteSlot = state.noteSlots.find(ns => ns.id === pt.noteSlotId);
              if (noteSlot) break;
            }
          }
        }
      }

      const draft = noteSlot ? state.contentDrafts.find(d => d.noteSlotId === noteSlot?.id) : undefined;
      const project = noteSlot 
        ? state.projects.find(p => p.id === noteSlot?.projectId)
        : (issue ? state.projects.find(p => issue.associatedObjectIds.includes(p.id)) : undefined);

      const projectId = project?.id || noteSlot?.projectId || "p1";
      const projectName = project?.name || "未知项目";

      return {
        id: task.id,
        issueId: task.issueId,
        actionType: task.actionType,
        status: task.status,
        assignee: task.assignee,
        waitOn: task.waitOn,
        nextStep: task.nextStep,
        
        issueMessage: issue?.message || "涉及事项需要处理",
        impactScope: issue?.impactScope || "按需处理",
        severity: issue?.severity || "warning",
        impactedStage: issue?.impactedStage || "content",
        
        projectId,
        projectName,
        
        noteSlotId: noteSlot?.id,
        noteTitle: draft?.title || "未命名笔记",
        accountName: noteSlot?.accountName || "账号",
        accountType: noteSlot?.accountType || "KOC",
        plannedDate: noteSlot?.plannedDate || "按计划"
      } as EnrichedActionTask;
    });
  }, [state]);

  // Derive the old `Project` shapes from `UnifiedState` so we don't break UI styles
  const derivedProjects = useMemo(() => {
    return state.projects.map(p => {
      const pRounds = state.rounds.filter(r => r.projectId === p.id);
      const pSlots = state.noteSlots.filter(ns => ns.projectId === p.id);
      
      const derivedNotes: OldNote[] = pSlots.map(slot => {
        const round = pRounds.find(r => r.id === slot.roundId);
        const draft = state.contentDrafts.find(d => d.noteSlotId === slot.id);
        const matReq = state.materialRequirements.find(m => m.noteSlotId === slot.id);
        const matTask = matReq ? state.materialTasks.find(t => t.requirementId === matReq.id) : undefined;
        const pubTask = state.publishTasks.find(t => t.noteSlotId === slot.id);
        const pubNote = pubTask ? state.publishedNotes.find(pn => pn.publishTaskId === pubTask.id) : undefined;
        const recommendationRecords = state.materialRecommendations.filter(item => item.noteSlotId === slot.id);
        const recommendedMaterials = recommendationRecords.flatMap(recommendation => {
          const asset = state.projectMaterialAssets.find(item => item.id === recommendation.assetId);
          return asset ? [{
            id: asset.id,
            title: asset.title,
            url: asset.url,
            matchScore: recommendation.matchScore,
            reason: recommendation.reason
          }] : [];
        });
        const materialSelection = state.noteMaterialSelections.find(selection => selection.noteSlotId === slot.id);
        const selectedMaterials = (materialSelection?.selectedAssetIds || []).flatMap(assetId => {
          const asset = state.projectMaterialAssets.find(item => item.id === assetId);
          return asset ? [{
            id: asset.id,
            title: asset.title,
            url: asset.url,
            isCover: materialSelection?.coverAssetId === asset.id
          }] : [];
        });
        const claim = state.consumerContentPackageClaims.find(item => item.generatedNoteSlotId === slot.id);
        const feedback = claim ? state.consumerExperienceFeedbacks.find(item => item.claimId === claim.id) : undefined;
        const packageClaimCount = state.consumerContentPackageClaims.filter(item => item.contentPackageNoteSlotId === slot.id).length;
        
        // Find if this note has an issue and an action task
        const associatedIds = [slot.id];
        if (draft) associatedIds.push(draft.id);
        if (matTask) associatedIds.push(matTask.id);
        if (pubTask) associatedIds.push(pubTask.id);
        if (pubNote) associatedIds.push(pubNote.id);

        const openIssue = state.issues.find(iss => iss.status === 'open' && iss.associatedObjectIds.some(id => associatedIds.includes(id)));
        const actionTask = openIssue ? state.actionTasks.find(at => at.issueId === openIssue.id && at.status === 'pending') : undefined;

        let currentIssue: OldNoteIssue | undefined;
        if (openIssue && actionTask) {
          currentIssue = {
            id: openIssue.id,
            type: openIssue.severity,
            message: openIssue.message,
            impactScope: openIssue.impactScope,
            nextStepActionText: actionTask.nextStep,
            targetWorkbench: openIssue.impactedStage
          };
        }

        let materialStatus = selectedMaterials.length > 0 ? "已齐" : "无需素材";
        if (recommendedMaterials.length > 0 && selectedMaterials.length === 0) materialStatus = "待收集";
        if (matReq && !matTask) materialStatus = "待收集";
        else if (matTask) {
          if (["待验收", "待提交", "执行中", "已上传", "AI预检"].includes(matTask.status)) materialStatus = "待验收";
          else if (matTask.status === "已验收" || matTask.status === "已关闭") materialStatus = "已齐";
        }

        let contentStatus = draft ? draft.status : "待生成";
        
        let publishStatus = pubTask ? pubTask.status : "未安排";
        if (pubTask?.status === "已验证/验证异常" && pubNote?.status === "暂时无法访问") {
          publishStatus = "发布异常";
        }

        return {
          id: slot.id,
          projectId: p.id,
          projectName: p.name,
          batchName: round?.name || "",
          title: draft?.title || (slot.isNotePackage ? `【笔记包】${slot.contentDirection}` : "未命名笔记"),
          participant: slot.accountName,
          claimedCount: slot.isNotePackage ? packageClaimCount : undefined,
          type: slot.accountType,
          contentDirection: slot.contentDirection,
          plannedDate: slot.plannedDate,
          contentStatus: contentStatus as any,
          materialStatus: materialStatus as any,
          publishStatus: (slot.isNotePackage && slot.packageSpec?.questionnaireStatus === "待填写" && !draft) ? "待领包" as any : (publishStatus as any),
          resultStatus: pubNote ? pubNote.status as any : "未开始观察",
          publishLink: pubTask?.publishUrl,
          body: draft?.body,
          tags: draft?.tags || [],
          isNotePackage: slot.isNotePackage,
          packageSpec: slot.packageSpec,
          materialTask: matTask ? {
            id: matTask.id,
            reqs: matReq?.reqs || "",
            status: matTask.status,
            returnedUrls: state.materialAssets.filter(asset => asset.taskId === matTask.id).map(asset => asset.url)
          } : undefined,
          recommendedMaterials,
          selectedMaterials,
          consumerQuestionnaire: feedback ? {
            submittedAt: feedback.submittedAt,
            sourcePackageName: state.noteSlots.find(item => item.id === feedback.contentPackageNoteSlotId)?.contentDirection,
            petBreed: feedback.answers.petBreed,
            petAge: feedback.answers.petAge,
            symptom: feedback.answers.problem,
            experience: feedback.answers.experience,
            claimId: feedback.claimId,
            contentPackageNoteSlotId: feedback.contentPackageNoteSlotId,
            strategyVersionId: feedback.strategyVersionId,
            feedbackVersion: feedback.feedbackVersion
          } : undefined,
          currentIssue
        };
      });

      return {
        id: p.id,
        merchantId: p.merchantId,
        name: p.name,
        status: p.status,
        goal: p.goal,
        startDate: p.startDate,
        endDate: p.endDate,
        budget: p.budget,
        notes: derivedNotes,
        strategyProtocol: p.strategyProtocol,
        landingPageSettings: p.landingPageSettings || {
          loginMode: "无需登录",
          posterTitle: `${p.name} - 体验官内容投稿`,
          bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
        },
        distributionScheme: p.distributionScheme ? {
          brandTotalNotes: p.distributionScheme.brandTotalNotes,
          kosTotalNotes: p.distributionScheme.kosTotalNotes,
          kocTotalNotes: p.distributionScheme.kocTotalNotes,
          ownAccounts: {
            brandAccountIds: p.distributionScheme.ownAccounts?.brandAccounts?.selectedAccountIds || [],
            brandNotesPerAccount: p.distributionScheme.ownAccounts?.brandAccounts?.notesPerAccount || 0,
            brandFrequency: p.distributionScheme.ownAccounts?.brandAccounts?.publishFrequency || "按排期发布",
            brandTimeWindow: p.distributionScheme.ownAccounts?.brandAccounts?.suggestedTimeWindow || "按排期发布",
            kosAccountIds: p.distributionScheme.ownAccounts?.kosAccounts?.selectedAccountIds || [],
            kosNotesPerAccount: p.distributionScheme.ownAccounts?.kosAccounts?.notesPerAccount || 0,
            kosFrequency: p.distributionScheme.ownAccounts?.kosAccounts?.publishFrequency || "按排期发布",
            kosTimeWindow: p.distributionScheme.ownAccounts?.kosAccounts?.suggestedTimeWindow || "按排期发布"
          },
          consumerKoc: {
            recruitmentCount: p.distributionScheme.consumerKoc?.recruitmentCount || 0,
            packagesPerPerson: p.distributionScheme.consumerKoc?.packagesPerPerson || 1,
            hasQuestionnaire: p.distributionScheme.consumerKoc?.hasQuestionnaire || false,
            needPhotos: p.distributionScheme.consumerKoc?.needPhotos || false,
            photoCountRange: p.distributionScheme.consumerKoc?.photoCountRange,
            claimValidityDays: p.distributionScheme.consumerKoc?.claimValidityDays || 3,
            observationDays: p.distributionScheme.consumerKoc?.observationDays || 14,
            enableWechatNotice: p.distributionScheme.consumerKoc?.enableWechatNotice || false
          },
          totalPlannedNotes: p.distributionScheme.totalPlannedNotes || derivedNotes.length,
          aiExplanation: p.distributionScheme.aiSuggestion
        } : undefined,
        operationLogs: state.timelineEvents.filter(e => e.targetId === p.id || derivedNotes.some(n => n.id === e.targetId)).map(e => ({
          id: e.id,
          timestamp: e.timestamp,
          operator: e.actor,
          action: e.action,
          detail: e.action
        }))
      } as OldProject;
    });
  }, [state]);

  const currentProject = derivedProjects.find(p => p.id === selectedProjectId) || derivedProjects[0];

  const resolveActionTask = (taskId: string) => {
    setState(prev => {
      const task = prev.actionTasks.find(t => t.id === taskId);
      const actionTasks = prev.actionTasks.map(t => t.id === taskId ? { ...t, status: 'done' as const } : t);
      const issues = prev.issues.map(iss => {
        if (task && iss.id === task.issueId) return { ...iss, status: 'resolved' as const };
        return iss;
      });

      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: task?.id || taskId,
        actor: "操盘手",
        action: `完成待办任务: ${task?.nextStep || taskId}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: false
      };

      return { 
        ...prev, 
        actionTasks, 
        issues,
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });
  };

  const updateMaterialTaskStatus = (taskId: string, status: MaterialTask['status']) => {
    setState(prev => ({
      ...prev,
      materialTasks: prev.materialTasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
  };
  
  const updatePublishTaskStatus = (taskId: string, status: PublishTask['status']) => {
    setState(prev => ({
      ...prev,
      publishTasks: prev.publishTasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
  };

  const createStrategyVersion = (
    projectId: string,
    configuration: StrategyConfiguration,
    changedFields: string[],
    source: StrategyVersion['source'] = "expert_adjustment"
  ) => {
    const newVersionId = `sv_${projectId}_${Date.now()}`;
    setState(prev => {
      const projectVersions = prev.strategyVersions.filter(version => version.projectId === projectId);
      const nextVersion = Math.max(0, ...projectVersions.map(version => version.version)) + 1;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newVersion: StrategyVersion = {
        id: newVersionId,
        projectId,
        version: nextVersion,
        source,
        status: "active",
        configuration,
        changedFields,
        createdAt: now,
        createdBy: source === "review_applied" ? "操盘手确认复盘建议" : "操盘手",
        effectiveFrom: now
      };

      return {
        ...prev,
        projects: prev.projects.map(project => project.id === projectId
          ? { ...project, strategyProtocol: configuration }
          : project
        ),
        strategyVersions: [
          ...prev.strategyVersions.map(version => version.projectId === projectId && version.status === "active"
            ? { ...version, status: "superseded" as const }
            : version
          ),
          newVersion
        ],
        timelineEvents: [{
          id: `evt-${Date.now()}`,
          targetId: projectId,
          actor: "操盘手",
          action: `创建策略 V${nextVersion}，仅对之后生成的笔记生效`,
          timestamp: now,
          isAutomatic: false
        }, ...prev.timelineEvents]
      };
    });
    return newVersionId;
  };

  // Add single project note
  const createProjectNote = (projectId: string, noteData: { title: string; accountType: "KOC" | "店长号/KOS" | "品牌主号"; accountName: string; contentDirection: string; plannedDate: string; body?: string }) => {
    setState(prev => {
      const activeStrategyVersionId = prev.strategyVersions.find(version => version.projectId === projectId && version.status === "active")?.id;
      const newSlotId = `ns_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newDraftId = `cd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newPublishId = `pt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      const newSlot: NoteSlot = {
        id: newSlotId,
        projectId,
        roundId: "r1",
        accountType: noteData.accountType,
        accountName: noteData.accountName || `${noteData.accountType}_1`,
        contentDirection: noteData.contentDirection,
        plannedDate: noteData.plannedDate || new Date().toISOString().split('T')[0]
      };

      const newDraft: ContentDraft = {
        id: newDraftId,
        noteSlotId: newSlotId,
        status: "已确认",
        title: noteData.title,
        body: noteData.body || "已完成初步文案提纲与内容方向确认。",
        tags: [noteData.contentDirection],
        strategyVersionId: activeStrategyVersionId
      };

      const newPublishTask: PublishTask = {
        id: newPublishId,
        noteSlotId: newSlotId,
        assignee: noteData.accountName || "待派发",
        status: "未安排"
      };

      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: projectId,
        actor: "操盘手",
        action: `新增笔记: ${noteData.title}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: false
      };

      return {
        ...prev,
        noteSlots: [...prev.noteSlots, newSlot],
        contentDrafts: [...prev.contentDrafts, newDraft],
        publishTasks: [...prev.publishTasks, newPublishTask],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });
  };

  // Batch generate project notes from strategy
  const batchGenerateProjectNotes = (projectId: string, generatedList: Array<{ title: string; accountType: "KOC" | "店长号/KOS" | "品牌主号"; accountName: string; contentDirection: string; plannedDate: string; body?: string }>) => {
    setState(prev => {
      const activeStrategyVersionId = prev.strategyVersions.find(version => version.projectId === projectId && version.status === "active")?.id;
      const newSlots: NoteSlot[] = [];
      const newDrafts: ContentDraft[] = [];
      const newPubTasks: PublishTask[] = [];

      generatedList.forEach((item, idx) => {
        const slotId = `ns_batch_${Date.now()}_${idx}`;
        newSlots.push({
          id: slotId,
          projectId,
          roundId: "r1",
          accountType: item.accountType,
          accountName: item.accountName || `${item.accountType}_${idx + 1}`,
          contentDirection: item.contentDirection,
          plannedDate: item.plannedDate || new Date().toISOString().split('T')[0]
        });

        newDrafts.push({
          id: `cd_batch_${Date.now()}_${idx}`,
          noteSlotId: slotId,
          status: "已确认",
          title: item.title,
          body: item.body || "基于项目方案AI智能批量排期与方向生成。",
          tags: [item.contentDirection],
          strategyVersionId: activeStrategyVersionId
        });

        newPubTasks.push({
          id: `pt_batch_${Date.now()}_${idx}`,
          noteSlotId: slotId,
          assignee: item.accountName || "待派发",
          status: "未安排"
        });
      });

      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: projectId,
        actor: "系统AI",
        action: `基于项目方案批量生成 ${generatedList.length} 篇笔记排期`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: true
      };

      return {
        ...prev,
        noteSlots: [...prev.noteSlots, ...newSlots],
        contentDrafts: [...prev.contentDrafts, ...newDrafts],
        publishTasks: [...prev.publishTasks, ...newPubTasks],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });
  };

  // Add project-level material requirement (independent of specific notes)
  const addProjectMaterialRequirement = (projectId: string, reqs: string, assignee: string = "团队运营") => {
    setState(prev => {
      const reqId = `mr_proj_${Date.now()}`;
      const taskId = `mt_proj_${Date.now()}`;

      const newReq: MaterialRequirement = {
        id: reqId,
        projectId,
        reqs,
        isProjectLevel: true
      };

      const newMaterialTask: MaterialTask = {
        id: taskId,
        requirementId: reqId,
        assignee,
        status: "执行中"
      };

      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: projectId,
        actor: "操盘手",
        action: `生成项目素材要求: ${reqs.slice(0, 20)}...`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: false
      };

      return {
        ...prev,
        materialRequirements: [...prev.materialRequirements, newReq],
        materialTasks: [...prev.materialTasks, newMaterialTask],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });
  };

  // Update Landing Page Settings
  const updateLandingPageSettings = (projectId: string, settings: Partial<import("../data/unifiedStore").LandingPageSettings>) => {
    setState(prev => {
      const projects = prev.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            landingPageSettings: {
              ...(p.landingPageSettings || {
                loginMode: "无需登录",
                posterTitle: `${p.name} - 体验官内容投稿`,
                bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
              }),
              ...settings
            }
          };
        }
        return p;
      });

      return { ...prev, projects };
    });
  };

  // Handle consumer submission from Landing Page
  const addConsumerSubmission = (projectId: string, submission: { nickname: string; contentType: string; title: string; body?: string; images: string[]; contact?: string }) => {
    setState(prev => {
      const newSlotId = `ns_sub_${Date.now()}`;
      const newDraftId = `cd_sub_${Date.now()}`;
      const newPublishId = `pt_sub_${Date.now()}`;

      const newSlot: NoteSlot = {
        id: newSlotId,
        projectId,
        roundId: "r1",
        accountType: "KOC",
        accountName: submission.nickname || "扫码体验官",
        contentDirection: submission.contentType || "消费者共创投稿",
        plannedDate: new Date().toISOString().split('T')[0]
      };

      const newDraft: ContentDraft = {
        id: newDraftId,
        noteSlotId: newSlotId,
        status: "已确认",
        title: submission.title || `${submission.nickname || '消费者'}的体验分享`,
        body: submission.body || "扫码落地页真实消费者回传心得。",
        tags: ["消费者投稿"]
      };

      const newPublishTask: PublishTask = {
        id: newPublishId,
        noteSlotId: newSlotId,
        assignee: submission.nickname || "扫码体验官",
        status: "未安排"
      };

      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: projectId,
        actor: `消费者 (${submission.nickname})`,
        action: `通过落地页提交体验投稿: ${submission.title}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: true
      };

      return {
        ...prev,
        noteSlots: [...prev.noteSlots, newSlot],
        contentDrafts: [...prev.contentDrafts, newDraft],
        publishTasks: [...prev.publishTasks, newPublishTask],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });
  };

  // Create full operations project with notes and material tasks
  const createFullOperationsProject = (data: {
    merchantId?: string;
    name: string;
    goal: string;
    status?: "准备中" | "进行中" | "已结束";
    startDate?: string;
    endDate?: string;
    budget?: string;
    strategyProtocol?: any;
    distributionScheme?: DistributionScheme;
    notes: Array<{
      title: string;
      accountType: "KOC" | "店长号/KOS" | "品牌主号";
      accountName: string;
      contentDirection: string;
      plannedDate: string;
      targetAudience?: string;
      searchIntent?: string;
      coreExpression?: string;
      requiredMaterials?: string[];
      body?: string;
      materialMatched?: boolean;
      isNotePackage?: boolean;
      packageSpec?: any;
    }>;
    materialTasks: Array<{
      reqs: string;
      usageScenario?: string;
      specs?: string;
      assignee?: string;
      status?: any;
      associatedNoteIndices?: number[];
    }>;
    matchedAssetsCount?: number;
  }) => {
    const newId = `p_${Date.now()}`;
    const newStrategyVersionId = `sv_${newId}_v1`;
    const newProject: Project = {
      id: newId,
      merchantId: data.merchantId || "m1",
      name: data.name,
      status: data.status || "进行中",
      goal: data.goal,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      budget: data.budget || "10,000元",
      strategyProtocol: data.strategyProtocol || {
        targetAudience: "目标种草与搜索客户群体",
        coreProblem: "真实案例不足及搜索卡位缺失",
        solutionSummary: "KOC试用体验 + 店长号专业科普指导",
        verifyHypothesis: "真实体验内容能否显著提升咨询与搜索转化",
        continueCondition: "爆文率>15%",
        stopCondition: "爆文率<3%"
      },
      landingPageSettings: {
        loginMode: "无需登录",
        posterTitle: `${data.name} - 体验官招募与内容投稿`,
        bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
      },
      distributionScheme: data.distributionScheme
    };

    const newSlots: NoteSlot[] = [];
    const newDrafts: ContentDraft[] = [];
    const newPubTasks: PublishTask[] = [];
    const newMatReqs: MaterialRequirement[] = [];
    const newMatTasks: MaterialTask[] = [];

    // Create note slots & drafts
    data.notes.forEach((note, idx) => {
      const slotId = `ns_full_${Date.now()}_${idx}`;
      newSlots.push({
        id: slotId,
        projectId: newId,
        roundId: "r1",
        accountType: note.accountType,
        accountName: note.accountName || `${note.accountType}_${idx + 1}`,
        contentDirection: note.contentDirection,
        plannedDate: note.plannedDate || new Date().toISOString().split('T')[0],
        isNotePackage: note.isNotePackage,
        packageSpec: note.packageSpec
      });

      newDrafts.push({
        id: `cd_full_${Date.now()}_${idx}`,
        noteSlotId: slotId,
        status: "已确认",
        title: note.title,
        body: note.body || `【目标用户】${note.targetAudience || '幼犬初次换粮宠主'}\n【核心表达】${note.coreExpression || '真实换粮体验解析'}\n【搜索意图】${note.searchIntent || '解决腹泻软便'}\n【所需素材】${(note.requiredMaterials || []).join('、')}`,
        tags: [note.contentDirection],
        strategyVersionId: newStrategyVersionId
      });

      newPubTasks.push({
        id: `pt_full_${Date.now()}_${idx}`,
        noteSlotId: slotId,
        assignee: note.accountName || "待派发",
        status: "未安排"
      });
    });

    // Create material tasks (status = "待发布")
    data.materialTasks.forEach((mTask, idx) => {
      const reqId = `mr_full_${Date.now()}_${idx}`;
      const firstNoteSlotId = mTask.associatedNoteIndices && mTask.associatedNoteIndices.length > 0 && newSlots[mTask.associatedNoteIndices[0]]
        ? newSlots[mTask.associatedNoteIndices[0]].id
        : newSlots[0]?.id;

      newMatReqs.push({
        id: reqId,
        projectId: newId,
        noteSlotId: firstNoteSlotId,
        reqs: mTask.reqs
      });

      newMatTasks.push({
        id: `mt_full_${Date.now()}_${idx}`,
        requirementId: reqId,
        assignee: mTask.assignee || "待派发",
        status: mTask.status || "待发布" as any
      });
    });

    setState(prev => {
      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: newId,
        actor: "操盘手",
        action: `确认方案并成功创建运营项目: ${data.name} (含${data.notes.length}篇笔记, ${data.materialTasks.length}个待发布素材任务)`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: false
      };

      return {
        ...prev,
        projects: [newProject, ...prev.projects],
        strategyVersions: [{
          id: newStrategyVersionId,
          projectId: newId,
          version: 1,
          source: "initial",
          status: "active",
          configuration: {
            ...newProject.strategyProtocol,
            targetKeywords: newProject.strategyProtocol?.targetKeywords || [],
            observationDays: newProject.strategyProtocol?.observationDays || 14
          },
          changedFields: [],
          createdAt: newEvent.timestamp,
          createdBy: "方案生成 Agent",
          effectiveFrom: newEvent.timestamp
        }, ...prev.strategyVersions],
        noteSlots: [...prev.noteSlots, ...newSlots],
        contentDrafts: [...prev.contentDrafts, ...newDrafts],
        publishTasks: [...prev.publishTasks, ...newPubTasks],
        materialRequirements: [...prev.materialRequirements, ...newMatReqs],
        materialTasks: [...prev.materialTasks, ...newMatTasks],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });

    setSelectedProjectId(newId);
    return newId;
  };

  // Create new project
  const addNewProject = (projectData: { name: string; goal: string; status?: "准备中" | "进行中" | "已结束"; startDate?: string; endDate?: string; budget?: string; strategyProtocol?: any; landingPageSettings?: any }) => {
    const newId = `p_${Date.now()}`;
    const newStrategyVersionId = `sv_${newId}_v1`;
    const newProject: Project = {
      id: newId,
      merchantId: "m1",
      name: projectData.name,
      status: projectData.status || "准备中",
      goal: projectData.goal,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      endDate: projectData.endDate || new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
      budget: projectData.budget || "10,000元",
      strategyProtocol: projectData.strategyProtocol || {
        targetAudience: "目标客户群体与兴趣粉丝",
        coreProblem: "缺乏针对性案例与信任背书",
        solutionSummary: "KOC试用体验 + 品牌科普种草",
        verifyHypothesis: "探店与真实体验能否提升订单转化",
        continueCondition: "爆文率>10%",
        stopCondition: "爆文率<2%"
      },
      landingPageSettings: projectData.landingPageSettings || {
        loginMode: "无需登录",
        posterTitle: `${projectData.name} - 体验官内容投稿`,
        bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
      }
    };

    setState(prev => {
      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        targetId: newId,
        actor: "操盘手",
        action: `创建新项目: ${projectData.name} (${newProject.status})`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: false
      };

      return {
        ...prev,
        projects: [newProject, ...prev.projects],
        strategyVersions: [{
          id: newStrategyVersionId,
          projectId: newId,
          version: 1,
          source: "initial",
          status: "active",
          configuration: {
            ...newProject.strategyProtocol,
            targetKeywords: newProject.strategyProtocol?.targetKeywords || [],
            observationDays: newProject.strategyProtocol?.observationDays || 14
          },
          changedFields: [],
          createdAt: newEvent.timestamp,
          createdBy: "方案生成 Agent",
          effectiveFrom: newEvent.timestamp
        }, ...prev.strategyVersions],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });

    setSelectedProjectId(newId);
    return newId;
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    setState(prev => {
      const remainingProjects = prev.projects.filter(p => p.id !== projectId);
      if (selectedProjectId === projectId && remainingProjects.length > 0) {
        setSelectedProjectId(remainingProjects[0].id);
      }
      return {
        ...prev,
        projects: remainingProjects,
        noteSlots: prev.noteSlots.filter(s => s.projectId !== projectId),
        strategyVersions: prev.strategyVersions.filter(version => version.projectId !== projectId),
        reviewAdjustmentProposals: prev.reviewAdjustmentProposals.filter(proposal => proposal.projectId !== projectId),
        keywordSearchSnapshots: prev.keywordSearchSnapshots.filter(snapshot => snapshot.projectId !== projectId)
      };
    });
  };

  // Backwards compat wrappers
  const updateNoteStatus = (projectId: string, noteId: string, updates: Partial<OldNote>) => {
    setState(prev => {
      const updatedNoteSlots = prev.noteSlots.map(slot => {
        if (slot.id === noteId) {
          return {
            ...slot,
            title: updates.title !== undefined ? updates.title : slot.title,
            accountType: updates.type !== undefined ? (updates.type as any) : slot.accountType,
            participant: updates.participant !== undefined ? updates.participant : slot.participant,
            contentStatus: updates.contentStatus !== undefined ? updates.contentStatus : slot.contentStatus,
            materialStatus: updates.materialStatus !== undefined ? updates.materialStatus : slot.materialStatus,
            publishStatus: updates.publishStatus !== undefined ? updates.publishStatus : slot.publishStatus,
            resultStatus: updates.resultStatus !== undefined ? updates.resultStatus : slot.resultStatus,
          };
        }
        return slot;
      });

      const updatedDrafts = prev.contentDrafts.map(draft => {
        if (draft.noteSlotId === noteId) {
          return {
            ...draft,
            title: updates.title !== undefined ? updates.title : draft.title,
            body: updates.body !== undefined ? updates.body : (updates.contentPackage?.body !== undefined ? updates.contentPackage.body : draft.body),
            tags: updates.tags !== undefined ? updates.tags : draft.tags,
            status: updates.contentStatus !== undefined ? updates.contentStatus as ContentDraft['status'] : draft.status,
            direction: updates.contentDirection !== undefined ? updates.contentDirection : draft.direction,
          };
        }
        return draft;
      });

      const incomingMaterials = updates.selectedMaterials;
      const updatedProjectMaterialAssets = incomingMaterials
        ? incomingMaterials.reduce((assets, material) => {
            if (assets.some(asset => asset.id === material.id)) return assets;
            return [...assets, {
              id: material.id,
              projectId,
              title: material.title,
              url: material.url,
              tags: []
            }];
          }, prev.projectMaterialAssets)
        : prev.projectMaterialAssets;
      const updatedMaterialSelections = incomingMaterials
        ? [
            ...prev.noteMaterialSelections.filter(selection => selection.noteSlotId !== noteId),
            {
              noteSlotId: noteId,
              selectedAssetIds: incomingMaterials.map(material => material.id),
              coverAssetId: incomingMaterials.find(material => material.isCover)?.id || incomingMaterials[0]?.id,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          ]
        : prev.noteMaterialSelections;

      const updatedMaterialTasks = updates.materialTask
        ? prev.materialTasks.map(task => task.id === updates.materialTask?.id
            ? { ...task, status: updates.materialTask?.status as MaterialTask['status'] }
            : task)
        : prev.materialTasks;

      const publishStatus = updates.publishStatus;
      const updatedPublishTasks = prev.publishTasks.map(task => {
        if (task.noteSlotId !== noteId) return task;
        const supportedStatus = publishStatus && [
          '未安排', '待认领', '准备中', '待发布', '发布中', '已回传链接',
          '已发布', '系统验证中', '已验证/验证异常', '人工确认', '已关闭'
        ].includes(publishStatus) ? publishStatus as PublishTask['status'] : task.status;
        return {
          ...task,
          status: supportedStatus,
          publishUrl: updates.publishLink !== undefined ? updates.publishLink : task.publishUrl
        };
      });

      return {
        ...prev,
        noteSlots: updatedNoteSlots,
        contentDrafts: updatedDrafts,
        projectMaterialAssets: updatedProjectMaterialAssets,
        noteMaterialSelections: updatedMaterialSelections,
        materialTasks: updatedMaterialTasks,
        publishTasks: updatedPublishTasks
      };
    });
  };
  const clearNoteIssue = (projectId: string, noteId: string) => {
    const slot = state.noteSlots.find(s => s.id === noteId);
    if (!slot) return;
    
    setState(prev => {
      const openIssues = prev.issues.filter(i => i.status === 'open' && (i.associatedObjectIds.includes(noteId) || i.associatedObjectIds.some(id => id.includes(noteId))));
      const openIssueIds = openIssues.map(i => i.id);
      return {
        ...prev,
        issues: prev.issues.map(i => openIssueIds.includes(i.id) ? { ...i, status: 'resolved' } : i),
        actionTasks: prev.actionTasks.map(t => openIssueIds.includes(t.issueId) ? { ...t, status: 'done' } : t)
      };
    });
  };
  const submitKOCQuestionnaire = (noteSlotId: string, questionnaireData: { petBreed: string; petAge: string; symptom: string; experience: string; storeName?: string }) => {
    setState(prev => {
      const contentPackage = prev.noteSlots.find(s => s.id === noteSlotId);
      if (!contentPackage) return prev;
      const nowId = Date.now();
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const activeStrategyVersion = prev.strategyVersions.find(version => version.projectId === contentPackage.projectId && version.status === "active");
      const strategyVersionId = activeStrategyVersion?.id || `strategy-${contentPackage.projectId}-current`;
      const feedbackVersion = contentPackage.packageSpec?.feedbackVersion || 1;
      const claimId = `claim-${nowId}`;
      const generatedNoteSlotId = `ns-consumer-${nowId}`;

      const generatedTitle = `我家${questionnaireData.petBreed || "幼犬"}${questionnaireData.petAge || ""}换粮记录：从${questionnaireData.symptom || "软便"}到消化吸收好！`;
      const generatedBody = `【消费者真实体验反馈生成】\n` +
        `🐾 宠物品种：${questionnaireData.petBreed || "未填写"} (${questionnaireData.petAge || "幼犬"})\n` +
        `换粮前困扰：${questionnaireData.symptom || "经常拉软便"}\n` +
        `真实体验：${questionnaireData.experience || "按七日换粮法顺利过渡，便便形状更稳定"}\n` +
        `体验领样渠道：${questionnaireData.storeName || "品牌合作体验门店"}\n\n` +
        `这是我自己的体验过程，变化因狗狗情况而异，我会继续观察。`;

      const reqText = contentPackage.packageSpec?.materialTaskReqs || "【按任务拍摄】1. 幼犬进食视频 1条；2. 试用粮合影 2张";
      const matReqId = `mr-${nowId}`;
      const matTaskId = `mt-${nowId}`;

      const claim: ConsumerContentPackageClaim = {
        id: claimId,
        contentPackageNoteSlotId: noteSlotId,
        projectId: contentPackage.projectId,
        consumerName: questionnaireData.petBreed ? `${questionnaireData.petBreed}家长` : "消费者体验官",
        claimedAt: now,
        strategyVersionId,
        feedbackVersion,
        generatedNoteSlotId,
        status: "note_generated"
      };
      const feedback: ConsumerExperienceFeedback = {
        id: `feedback-${nowId}`,
        claimId,
        contentPackageNoteSlotId: noteSlotId,
        strategyVersionId,
        feedbackVersion,
        submittedAt: now,
        answers: {
          petBreed: questionnaireData.petBreed,
          petAge: questionnaireData.petAge,
          problem: questionnaireData.symptom,
          experience: questionnaireData.experience,
          storeName: questionnaireData.storeName
        }
      };

      const newEvent: TimelineEvent = {
        id: `evt-${nowId}`,
        targetId: generatedNoteSlotId,
        actor: "消费者体验官",
        action: `领取内容包并提交真实体验反馈，按策略 V${activeStrategyVersion?.version || 1} 生成个人笔记《${generatedTitle}》`,
        timestamp: now,
        isAutomatic: true
      };

      return {
        ...prev,
        noteSlots: [...prev.noteSlots, {
          id: generatedNoteSlotId,
          projectId: contentPackage.projectId,
          roundId: contentPackage.roundId,
          accountType: "KOC",
          accountName: claim.consumerName,
          contentDirection: contentPackage.contentDirection,
          plannedDate: contentPackage.plannedDate
        }],
        contentDrafts: [...prev.contentDrafts, {
          id: `cd-${nowId}`,
          noteSlotId: generatedNoteSlotId,
          status: "待确认",
          title: generatedTitle,
          body: generatedBody,
          tags: ["幼犬换粮", "真实体验", questionnaireData.symptom].filter(Boolean),
          strategyVersionId
        }],
        publishTasks: [...prev.publishTasks, {
          id: `pt-${nowId}`,
          noteSlotId: generatedNoteSlotId,
          assignee: claim.consumerName,
          status: "未安排"
        }],
        materialRequirements: [...prev.materialRequirements, { id: matReqId, noteSlotId: generatedNoteSlotId, reqs: reqText }],
        materialTasks: [...prev.materialTasks, {
          id: matTaskId,
          requirementId: matReqId,
          assignee: claim.consumerName,
          status: "待提交"
        }],
        consumerContentPackageClaims: [...prev.consumerContentPackageClaims, claim],
        consumerExperienceFeedbacks: [...prev.consumerExperienceFeedbacks, feedback],
        timelineEvents: [newEvent, ...prev.timelineEvents]
      };
    });
  };

  const updateContentPackageFeedback = (noteSlotId: string, questions: Array<{ id: string; title: string; options?: string[] }>) => {
    setState(prev => ({
      ...prev,
      noteSlots: prev.noteSlots.map(slot => slot.id === noteSlotId ? {
        ...slot,
        packageSpec: {
          guidelines: slot.packageSpec?.guidelines || "按消费者真实体验生成个人笔记",
          materialTaskReqs: slot.packageSpec?.materialTaskReqs || "上传真实体验照片",
          questionnaireStatus: slot.packageSpec?.questionnaireStatus || "待填写",
          ...slot.packageSpec,
          feedbackVersion: (slot.packageSpec?.feedbackVersion || 1) + 1,
          feedbackQuestions: questions.slice(0, 4).map((question, index) => ({
            id: question.id,
            prompt: question.title.replace(/^\d+\.\s*/, ''),
            options: question.options || [],
            contentField: index === 0 ? "identity" as const : index === questions.length - 1 ? "experience" as const : "problem" as const
          }))
        }
      } : slot),
      timelineEvents: [{
        id: `evt-feedback-${Date.now()}`,
        targetId: noteSlotId,
        actor: "操盘手",
        action: "更新内容包体验反馈；新版本只应用于之后领取该内容包的消费者",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isAutomatic: false
      }, ...prev.timelineEvents]
    }));
  };

  const updateProject = (projectId: string, updates: Partial<OldProject>) => {
    setState(prev => {
      const { notes: _notes, operationLogs: _operationLogs, ...projectUpdates } = updates;
      const nextProjects = prev.projects.map(project =>
        project.id === projectId
          ? { ...project, ...(projectUpdates as Partial<Project>) }
          : project
      );

      const statusEvent = updates.status
        ? [{
            id: `evt-${Date.now()}`,
            targetId: projectId,
            actor: "操盘手",
            action: updates.status === "已结束" ? "归档方案" : `将方案状态更新为：${updates.status}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            isAutomatic: false
          } as TimelineEvent]
        : [];

      return {
        ...prev,
        projects: nextProjects,
        timelineEvents: [...statusEvent, ...prev.timelineEvents]
      };
    });
  };
  const addProject = () => {};

  return (
    <ProjectContext.Provider
      value={{
        projects: derivedProjects,
        selectedProjectId,
        setSelectedProjectId,
        currentProject,
        activeWorkflowTab,
        setActiveWorkflowTab,
        executionNavTarget,
        jumpToExecution,
        clearExecutionNavTarget,
        jumpToProject,
        updateNoteStatus,
        updateProject,
        addProject,
        addNewProject,
        deleteProject,
        clearNoteIssue,
        createProjectNote,
        batchGenerateProjectNotes,
        createFullOperationsProject,
        addProjectMaterialRequirement,
        updateLandingPageSettings,
        addConsumerSubmission,
        submitKOCQuestionnaire,
        updateContentPackageFeedback,
        unifiedState: state,
        enrichedActionTasks,
        resolveActionTask,
        updateMaterialTaskStatus,
        updatePublishTaskStatus,
        createStrategyVersion
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjectStore() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectStore must be used within a ProjectProvider");
  }
  return context;
}
