import React from "react";
import { Note } from "../../../data/projectStore";
import { NotePackageDetailDrawer } from "./NotePackageDetailDrawer";
import { NormalNoteDetailDrawer } from "./NormalNoteDetailDrawer";

interface NoteDetailDrawerProps {
  note: Note;
  projectId?: string;
  onClose: () => void;
  onActionClick?: () => void;
  onOpenInExecutionCenter?: () => void;
  onEditQuestionnaire?: () => void;
  onSelectFromMaterials?: () => void;
  onTriggerPhotoTask?: () => void;
}

export function NoteDetailDrawer({
  note,
  projectId,
  onClose,
  onActionClick,
  onOpenInExecutionCenter,
  onEditQuestionnaire,
  onSelectFromMaterials,
  onTriggerPhotoTask,
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
      onOpenExecutionCenter={onOpenInExecutionCenter}
      onSelectFromMaterials={onSelectFromMaterials}
      onTriggerPhotoTask={onTriggerPhotoTask}
    />
  );
}
