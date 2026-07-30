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

interface ProjectContextType {
  // Expose the old shapes for backward compatibility during migration
  projects: OldProject[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentProject: OldProject | undefined;
  
  // Basic generic updates (to be replaced by specific actions)
  updateNoteStatus: (projectId: string, noteId: string, updates: Partial<OldNote>) => void;
  updateProject: (projectId: string, updates: Partial<OldProject>) => void;
  addProject: (project: OldProject) => void;
  clearNoteIssue: (projectId: string, noteId: string) => void;

  // New Unified State access
  unifiedState: UnifiedState;
  
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
        // Map any open issue associated with this slot's objects
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
        operationLogs: [] // Mock derived logs if needed
      } as OldProject;
    });
  }, [state]);

  const currentProject = derivedProjects.find(p => p.id === selectedProjectId) || derivedProjects[0];

  const resolveActionTask = (taskId: string) => {
    setState(prev => {
      const actionTasks = prev.actionTasks.map(t => t.id === taskId ? { ...t, status: 'done' as const } : t);
      const task = prev.actionTasks.find(t => t.id === taskId);
      const issues = prev.issues.map(iss => {
        if (task && iss.id === task.issueId) return { ...iss, status: 'resolved' as const };
        return iss;
      });
      return { ...prev, actionTasks, issues };
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

  // Backwards compat wrappers (will be phased out)
  const updateNoteStatus = (projectId: string, noteId: string, updates: Partial<OldNote>) => {
    // Basic shim. Real app would map these back to drafts, matTasks, pubTasks etc.
  };
  const clearNoteIssue = (projectId: string, noteId: string) => {
    // Find the noteSlot
    const slot = state.noteSlots.find(s => s.id === noteId);
    if (!slot) return;
    
    // Find the issue
    // To simplify: resolve all open issues for this note ID.
    setState(prev => {
      const openIssues = prev.issues.filter(i => i.status === 'open' && (i.associatedObjectIds.includes(noteId) || i.associatedObjectIds.some(id => id.includes(noteId)))); // fuzzy match
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
        updateNoteStatus,
        updateProject,
        addProject,
        clearNoteIssue,
        unifiedState: state,
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
