import React, { createContext, useContext, useState } from "react";
import { Project, INITIAL_PROJECTS, Note, ProjectStatus, NoteIssue } from "../data/projectStore";

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentProject: Project | undefined;
  updateNoteStatus: (projectId: string, noteId: string, updates: Partial<Note>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addProject: (project: Project) => void;
  clearNoteIssue: (projectId: string, noteId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const updateNoteStatus = (projectId: string, noteId: string, updates: Partial<Note>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedNotes = proj.notes.map((note) => {
          if (note.id !== noteId) return note;
          return { ...note, ...updates };
        });

        // Add operation log entry
        const actionName = updates.contentStatus ? `更新内容状态为: ${updates.contentStatus}` :
                           updates.publishStatus ? `更新发布状态为: ${updates.publishStatus}` :
                           updates.materialStatus ? `更新素材状态为: ${updates.materialStatus}` : "修改笔记信息";

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString("zh-CN", { hour12: false }),
          operator: "操盘手",
          action: actionName,
          detail: `笔记: ${noteId}`
        };

        return {
          ...proj,
          notes: updatedNotes,
          operationLogs: [newLog, ...proj.operationLogs]
        };
      })
    );
  };

  const clearNoteIssue = (projectId: string, noteId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          notes: proj.notes.map((n) => (n.id === noteId ? { ...n, currentIssue: undefined } : n))
        };
      })
    );
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === projectId ? { ...proj, ...updates } : proj))
    );
  };

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setSelectedProjectId(project.id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        setSelectedProjectId,
        currentProject,
        updateNoteStatus,
        updateProject,
        addProject,
        clearNoteIssue
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
