import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { INITIAL_COLLECTION_TASKS, INITIAL_ASSETS } from '../material-center/mockData';
import { CollectionTask, MaterialAsset } from '../material-center/types';
import { ShootingTaskDetail } from '../material-center/ShootingTaskDetail';

interface Props {
  onClose: () => void;
  initialTab?: string;
}

export function ShootingAndUploadWorkbench({ onClose }: Props) {
  const [tasks, setTasks] = useState<CollectionTask[]>(INITIAL_COLLECTION_TASKS);
  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);

  // Execution Center filter: show tasks requiring action (待派发, 需补拍, 执行中)
  const todoTasks = tasks.filter((t) => t.needsReshootCount > 0 || t.completedCount < t.totalCount);

  // If a task detail is open
  if (selectedTask) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-[960px]">
          <ShootingTaskDetail
            task={selectedTask}
            allAssets={INITIAL_ASSETS}
            onBack={() => setSelectedTask(null)}
            onUpdateTask={(updated) => {
              setSelectedTask(updated);
              setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-100 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-[18px] font-black text-neutral-900">
            待处理拍摄任务 (执行中心待办)
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Single Column List */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
        <div className="max-w-[960px] mx-auto space-y-4">
          <p className="text-[13px] font-bold text-neutral-500">
            仅展示需要操盘手确认、派发、补拍或处理异常的拍摄任务。
          </p>

          <div className="space-y-3">
            {todoTasks.map((task) => {
              const hasIssue = task.needsReshootCount > 0;
              const isCompleted = task.completedCount === task.totalCount && task.totalCount > 0;

              const getSummaryText = () => {
                if (hasIssue) {
                  return `已收集 ${task.completedCount}/${task.totalCount} 个镜头 · ${task.needsReshootCount}个需要补拍`;
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
                  className="bg-white rounded-2xl border border-neutral-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-400 hover:shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-[16px] font-black text-neutral-900 group-hover:text-neutral-800 transition-colors">
                      {task.taskName}
                    </h3>
                    <p className="text-[12.5px] font-medium text-neutral-500">
                      {task.projectName} · {task.store} · {task.executor}
                    </p>
                    <p
                      className={`text-[13px] font-bold ${
                        hasIssue ? 'text-rose-600' : 'text-neutral-700'
                      }`}
                    >
                      {getSummaryText()}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                      className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all shadow-2xs ${
                        hasIssue
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                    >
                      查看任务
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
