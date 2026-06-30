import React from 'react';
import { MessageSquare, GitBranch, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export type WorkbenchViewMode = 'chat' | 'flow' | 'data';

interface WorkbenchViewToggleProps {
  mode: WorkbenchViewMode;
  onModeChange: (mode: WorkbenchViewMode) => void;
}

const VIEW_OPTIONS: { id: WorkbenchViewMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'chat', label: '对话', icon: MessageSquare, desc: 'AI 协作对话' },
  { id: 'flow', label: '流程画布', icon: GitBranch, desc: '任务流程管理' },
  { id: 'data', label: '数据看板', icon: BarChart3, desc: '数据与指标' },
];

export const WorkbenchViewToggle: React.FC<WorkbenchViewToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-0.5">
      {VIEW_OPTIONS.map((opt) => {
        const isActive = mode === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            onClick={() => onModeChange(opt.id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all active:scale-95 ${
              isActive
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/60'
            }`}
            title={opt.desc}
          >
            {isActive && (
              <motion.div
                layoutId="workbench-view-toggle-bg"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-neutral-200/50"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
              />
            )}
            <Icon size={14} className="relative z-10" />
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
