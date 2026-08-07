import React, { createContext, useContext, useState, useMemo } from "react";
import { Project as OldProject, Note as OldNote, NoteIssue as OldNoteIssue } from "../data/projectStore";
import { 
  Merchant, Project, Round, NoteSlot, ContentDraft, MaterialRequirement, MaterialTask,
  MaterialAsset, PublishTask, PublishedNote, EvidenceSnapshot, Issue, ActionTask, TimelineEvent 
} from "../data/unifiedStore";
import { 
  mockMerchants, mockProjects, mockRounds, mockNoteSlots, mockContentDrafts,
  mockMaterialRequirements, mockMaterialTasks, mockMaterialAssets, mockPublishTasks,
  mockPublishedNotes, mockIssues, mockActionTasks, mockTimelineEvents
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
  executionNavTarget: { projectId?: string; taskId?: string } | null;
  jumpToExecution: (projectId?: string, taskId?: string) => void;
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
    name: string;
    goal: string;
    status?: "准备中" | "进行中" | "已结束";
    startDate?: string;
    endDate?: string;
    budget?: string;
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

  // New Unified State access
  unifiedState: UnifiedState;
  enrichedActionTasks: EnrichedActionTask[];
  
  // New Unified Actions
  resolveActionTask: (taskId: string) => void;
  updateMaterialTaskStatus: (taskId: string, status: MaterialTask['status']) => void;
  updatePublishTaskStatus: (taskId: string, status: PublishTask['status']) => void;
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
    issues: mockIssues,
    actionTasks: mockActionTasks,
    timelineEvents: mockTimelineEvents
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>("p1");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<string>("projects");
  const [executionNavTarget, setExecutionNavTarget] = useState<{ projectId?: string; taskId?: string } | null>(null);

  const jumpToExecution = (projectId?: string, taskId?: string) => {
    setExecutionNavTarget({ projectId, taskId });
    setActiveWorkflowTab("execution");
  };

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

        let materialStatus = "无需素材";
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
          title: draft?.title || "未命名笔记",
          participant: slot.accountName,
          type: slot.accountType,
          contentDirection: slot.contentDirection,
          plannedDate: slot.plannedDate,
          contentStatus: contentStatus as any,
          materialStatus: materialStatus as any,
          publishStatus: publishStatus as any,
          resultStatus: pubNote ? pubNote.status as any : "未开始观察",
          publishLink: pubTask?.publishUrl,
          currentIssue
        };
      });

      return {
        id: p.id,
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

  // Add single project note
  const createProjectNote = (projectId: string, noteData: { title: string; accountType: "KOC" | "店长号/KOS" | "品牌主号"; accountName: string; contentDirection: string; plannedDate: string; body?: string }) => {
    setState(prev => {
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
        tags: [noteData.contentDirection]
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
          tags: [item.contentDirection]
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
    name: string;
    goal: string;
    status?: "准备中" | "进行中" | "已结束";
    startDate?: string;
    endDate?: string;
    budget?: string;
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
    const newProject: Project = {
      id: newId,
      merchantId: "m1",
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
      }
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
        plannedDate: note.plannedDate || new Date().toISOString().split('T')[0]
      });

      newDrafts.push({
        id: `cd_full_${Date.now()}_${idx}`,
        noteSlotId: slotId,
        status: "已确认",
        title: note.title,
        body: note.body || `【目标用户】${note.targetAudience || '幼犬初次换粮宠主'}\n【核心表达】${note.coreExpression || '真实换粮体验解析'}\n【搜索意图】${note.searchIntent || '解决腹泻软便'}\n【所需素材】${(note.requiredMaterials || []).join('、')}`,
        tags: [note.contentDirection]
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
        noteSlots: prev.noteSlots.filter(s => s.projectId !== projectId)
      };
    });
  };

  // Backwards compat wrappers
  const updateNoteStatus = (projectId: string, noteId: string, updates: Partial<OldNote>) => {};
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
  const updateProject = () => {};
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
        unifiedState: state,
        enrichedActionTasks,
        resolveActionTask,
        updateMaterialTaskStatus,
        updatePublishTaskStatus
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

