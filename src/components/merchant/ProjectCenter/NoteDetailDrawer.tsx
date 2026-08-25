import React from "react";
import { Note } from "../../../data/projectStore";
import { NotePackageDetailDrawer } from "./NotePackageDetailDrawer";
import { NormalNoteDetailDrawer } from "./NormalNoteDetailDrawer";
import { ExecutionAction } from "../../../data/unifiedStore";

interface NoteDetailDrawerProps {
  note: Note;
  projectId?: string;
  onClose: () => void;
  onExecuteAction?: (action: ExecutionAction) => void;
  onEditQuestionnaire?: () => void;
}

export function NoteDetailDrawer({
  note,
  projectId,
  onClose,
  onExecuteAction,
  onEditQuestionnaire,
}: NoteDetailDrawerProps) {
  // Only actual note packages (recruitment pool templates) open the package drawer
  const isPackage = Boolean(note.isNotePackage || note.title?.includes("笔记包"));

  if (isPackage) {
    return (
      <NotePackageDetailDrawer
        note={note}
        projectId={projectId}
        onClose={onClose}
        onEditQuestionnaire={onEditQuestionnaire}
      />
    );
  }

  return (
    <NormalNoteDetailDrawer
      note={note}
      projectId={projectId}
      onClose={onClose}
      onExecuteAction={onExecuteAction}
    />
  );
}
