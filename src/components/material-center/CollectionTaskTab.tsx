import React, { useState } from 'react';
import { CollectionTask, MaterialAsset } from './types';
import { ShootingTaskDetail } from './ShootingTaskDetail';

interface CollectionTaskTabProps {
  tasks: CollectionTask[];
  allAssets: MaterialAsset[];
  onOpenUploadForTask?: (task: CollectionTask) => void;
  onViewAsset?: (asset: MaterialAsset) => void;
  onUpdateTask?: (updatedTask: CollectionTask) => void;
}

export const CollectionTaskTab: React.FC<CollectionTaskTabProps> = ({
  tasks,
  allAssets,
  onViewAsset,
  onUpdateTask
}) => {
  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);

  // If a task is selected, open the single-column ShootingTaskDetail
  if (selectedTask) {
    return (
      <ShootingTaskDetail
        task={selectedTask}
        allAssets={allAssets}
        onBack={() => setSelectedTask(null)}
        onViewAsset={onViewAsset}
        onUpdateTask={(updated) => {
          setSelectedTask(updated);
          if (onUpdateTask) onUpdateTask(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-2">
      {/* 拍摄任务列表 Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[16px] font-black text-text-main">拍摄任务总览</h2>
        <span className="text-[13px] font-bold text-text-tertiary">
          共 {tasks.length} 个拍摄任务
        </span>
      </div>

      {/* Horizontal Task Cards List (Section II) */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.completedCount === task.totalCount && task.totalCount > 0;
          const hasIssue = task.needsReshootCount > 0;

          // Progress & issue text
          const getSummaryText = () => {
            if (hasIssue) {
              return `已收集 ${task.completedCount}/${task.totalCount} 个镜头 · ${task.needsReshootCount}个需要补拍`;
            }
            if (isCompleted) {
              return `已收集 ${task.completedCount}/${task.totalCount} 个镜头 · 已完成`;
            }
            if (task.completedCount === 0) {
              return `已整理 ${task.totalCount} 个镜头 · 待派发`;
            }
            return `已收集 ${task.completedCount}/${task.totalCount} 个镜头 · 执行中`;
          };

          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="bg-surface-1 rounded-xl border border-border-default/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-400 hover:shadow-2xs transition-all cursor-pointer group"
            >
              <div className="space-y-1.5 flex-1">
                {/* 任务名称 */}
                <h3 className="text-[16px] font-black text-text-main group-hover:text-text-main transition-colors">
                  {task.taskName}
                </h3>

                {/* 所属项目 · 门店 · 执行人 */}
                <p className="text-[13px] font-medium text-text-tertiary">
                  {task.projectName} · {task.store} · {task.executor}
                </p>

                {/* 已收集镜头数 · 当前需要处理的问题 */}
                <p className={`text-[13px] font-bold ${hasIssue ? 'text-danger' : 'text-text-secondary'}`}>
                  {getSummaryText()}
                </p>
              </div>

              {/* 单一操作按钮 (Section II) */}
              <div className="shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                  }}
                  className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all shadow-2xs ${
                    isCompleted
                      ? 'bg-hover-bg hover:bg-selected-bg text-text-main'
                      : hasIssue
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-btn-main hover:bg-btn-main-hover text-white'
                  }`}
                >
                  {isCompleted ? '查看素材' : '查看任务'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
