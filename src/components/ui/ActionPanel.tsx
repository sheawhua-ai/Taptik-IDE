import React from "react";
import { Button } from "./Button";

interface ActionPanelProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  brandAccent?: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  brandAccent = false,
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 p-4 bg-surface-1 border border-border-default rounded-xl relative overflow-hidden ${brandAccent ? "pl-5" : ""}`}>
      {brandAccent && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />
      )}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && (
          <div className="shrink-0 mt-0.5 text-text-main">
            {icon}
          </div>
        )}
        <div className="space-y-1 min-w-0">
          <div className="text-[14px] font-bold text-text-main">{title}</div>
          {description && (
            <div className="text-[13px] text-text-secondary">
              {description}
            </div>
          )}
        </div>
      </div>
      {actionText && (
        <Button variant="primary" onClick={onAction} className="shrink-0">
          {actionText}
        </Button>
      )}
    </div>
  );
};
