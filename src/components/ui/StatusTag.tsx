import React from "react";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral" | "brand";

interface StatusTagProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  className?: string;
  outline?: boolean;
}

export const StatusTag: React.FC<StatusTagProps> = ({ variant = "neutral", children, className = "", outline = false }) => {
  const styles = {
    success: outline ? "border-success text-success bg-success-light" : "bg-success text-white",
    warning: outline ? "border-warning text-warning bg-warning-light" : "bg-warning text-white",
    danger: outline ? "border-danger text-danger bg-danger-light" : "bg-danger text-white",
    info: outline ? "border-info text-info bg-info-light" : "bg-info text-white",
    neutral: outline ? "border-border-strong text-text-secondary bg-surface-2" : "bg-surface-2 text-text-secondary border border-border-default",
    brand: outline ? "border-brand-strong text-brand-strong bg-brand-light" : "bg-brand-logo text-white",
  };

  const baseClasses = "px-2.5 py-0.5 rounded-md text-[11.5px] font-bold border shrink-0 inline-flex items-center";
  const borderClass = outline ? "border" : "border-transparent";
  
  return (
    <span className={`${baseClasses} ${borderClass} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
