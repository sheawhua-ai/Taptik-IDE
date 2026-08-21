import React from "react";
import { motion } from "framer-motion";

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  layoutId?: string;
}

export const Tab: React.FC<TabProps> = ({ label, isActive, onClick, layoutId = "tabIndicator" }) => {
  return (
    <button
      onClick={onClick}
      className={`relative py-3 px-1 text-[14px] font-bold transition-colors hover:bg-hover-bg rounded-t-md ${
        isActive ? "text-text-main" : "text-text-secondary hover:text-text-main"
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-logo"
        />
      )}
    </button>
  );
};

export const TabList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex gap-6 border-b border-border-default ${className}`}>
    {children}
  </div>
);
