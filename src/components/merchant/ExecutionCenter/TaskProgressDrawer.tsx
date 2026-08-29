import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock3,
  FilePenLine,
  Images,
  Send,
  X
} from 'lucide-react';
import { formatChineseDate } from '../../../utils/formatDate';
import type { ExecutionTask } from './types';

type ProgressFilter = 'active' | 'completed';

interface TaskProgressDrawerProps {
  open: boolean;
  tasks: ExecutionTask[];
  onClose: () => void;
  onGoToTask: (task: ExecutionTask) => void;
}

const getTaskDomain = (task: ExecutionTask) => {
  if (task.operatorCategory === 'material' || task.anomalyType === 'material_reshoot_overdue') return '素材任务';
  if (task.operatorCategory === 'publish' || task.operatorCategory === 'anomaly') return '发布任务';
  return '笔记处理';
};

const getTaskStage = (task: ExecutionTask) => {
  if (task.status === '已完成') return '已完成';
  if (task.status === '已取消') return '已取消';
  if (task.isMeWaiting) return '待我处理';
  if (task.operatorCategory === 'publish' && task.publishStage) return task.publishStage;
  if (task.isSystemProcessing) return '系统处理中';
  if (task.isTeamExecuting) {
    const claimed = task.timelineEvents.some(event => /领取|认领|接收/.test(event.action));
    return claimed ? '已领取·执行中' : '执行中';
  }
  return task.status;
};

const domainIcon = (task: ExecutionTask) => {
  if (task.operatorCategory === 'material' || task.anomalyType === 'material_reshoot_overdue') return Images;
  if (task.operatorCategory === 'publish' || task.operatorCategory === 'anomaly') return Send;
  return FilePenLine;
};

export function TaskProgressDrawer({ open, tasks, onClose, onGoToTask }: TaskProgressDrawerProps) {
  const [filter, setFilter] = useState<ProgressFilter>('active');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const visibleTasks = useMemo(() => tasks.filter(task => (
    filter === 'completed'
      ? task.status === '已完成' || task.status === '已取消'
      : task.status !== '已完成' && task.status !== '已取消'
  )), [filter, tasks]);

  const projectGroups = useMemo(() => {
    const groups = new Map<string, ExecutionTask[]>();
    visibleTasks.forEach(task => groups.set(task.projectName, [...(groups.get(task.projectName) ?? []), task]));
    return Array.from(groups.entries());
  }, [visibleTasks]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[260] flex justify-end bg-black/20" role="presentation" onMouseDown={onClose}>
      <aside
        className="flex h-full w-full max-w-[560px] flex-col bg-surface-1 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="任务进展"
        onMouseDown={event => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-text-main">任务进展</h2>
            <p className="mt-1 text-[13px] text-text-tertiary">查看领取、执行、回传和完成记录</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-text-tertiary hover:bg-hover-bg hover:text-text-main" aria-label="关闭任务进展">
            <X size={17} />
          </button>
        </header>

        <div className="shrink-0 border-b border-border-default px-5 py-3">
          <nav className="inline-flex rounded-lg bg-surface-subtle p-1" aria-label="任务进展状态">
            <button type="button" onClick={() => setFilter('active')} className={`rounded-md px-3 py-1.5 text-[13px] font-medium ${filter === 'active' ? 'bg-neutral-950 text-white' : 'text-text-secondary'}`}>进行中</button>
            <button type="button" onClick={() => setFilter('completed')} className={`rounded-md px-3 py-1.5 text-[13px] font-medium ${filter === 'completed' ? 'bg-neutral-950 text-white' : 'text-text-secondary'}`}>已结束</button>
          </nav>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {projectGroups.map(([projectName, projectTasks]) => (
              <section key={projectName}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h3 className="truncate text-[13px] font-semibold text-text-main">{projectName}</h3>
                  <span className="text-[13px] text-text-tertiary">{projectTasks.length} 项</span>
                </div>
                <div className="space-y-2">
                  {projectTasks.map(task => {
                    const Icon = domainIcon(task);
                    const expanded = expandedTaskId === task.id;
                    const latestEvent = task.timelineEvents.at(-1);
                    return (
                      <article key={task.id} className="rounded-xl border border-border-default bg-surface-1">
                        <button
                          type="button"
                          onClick={() => setExpandedTaskId(expanded ? null : task.id)}
                          className="flex w-full items-start gap-3 p-3.5 text-left"
                        >
                          <span className="mt-0.5 rounded-lg bg-surface-subtle p-2 text-text-secondary"><Icon size={14} /></span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <strong className="line-clamp-1 text-[13px] font-semibold text-text-main">{task.noteTitle}</strong>
                              <span className={`ml-auto shrink-0 rounded-md px-2 py-0.5 text-[13px] ${task.isMeWaiting ? 'bg-amber-50 text-amber-800' : task.status === '已完成' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-subtle text-text-secondary'}`}>{getTaskStage(task)}</span>
                            </span>
                            <span className="mt-1 flex items-center gap-2 text-[13px] text-text-tertiary">
                              <span>{getTaskDomain(task)}</span>
                              <span>·</span>
                              <span className="truncate">{task.waitingParty}</span>
                              {latestEvent ? <><span>·</span><span className="shrink-0">{formatChineseDate(latestEvent.time, true) || latestEvent.time}</span></> : null}
                            </span>
                          </span>
                          {expanded ? <ChevronDown size={14} className="mt-1 text-text-tertiary" /> : <ChevronRight size={14} className="mt-1 text-text-tertiary" />}
                        </button>

                        {expanded ? (
                          <div className="border-t border-border-default bg-surface-subtle px-4 py-3">
                            <div className="flex items-start gap-2 text-[13px] leading-5 text-text-secondary">
                              <CircleDot size={12} className="mt-1 shrink-0 text-text-tertiary" />
                              <span>{task.currentOccurrence}</span>
                            </div>
                            <div className="mt-3 space-y-2 border-l border-border-default pl-3">
                              {task.timelineEvents.slice().reverse().map(event => (
                                <div key={event.id} className="text-[13px] leading-4 text-text-tertiary">
                                  <span>{formatChineseDate(event.time, true) || event.time}</span>
                                  <span className="mx-1.5">·</span>
                                  <span className="text-text-secondary">{event.actor} {event.action}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="flex items-center gap-1 text-[13px] text-text-tertiary"><Clock3 size={11} />{formatChineseDate(task.deadline, true) || task.deadline || '未设置截止时间'}</span>
                              {task.isMeWaiting ? (
                                <button type="button" onClick={() => onGoToTask(task)} className="rounded-lg bg-neutral-950 px-3 py-1.5 text-[13px] font-medium text-white">去处理</button>
                              ) : task.status === '已完成' ? (
                                <span className="flex items-center gap-1 text-[13px] text-emerald-700"><CheckCircle2 size={12} />已完成</span>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
            {visibleTasks.length === 0 ? (
              <div className="py-20 text-center">
                <CheckCircle2 size={26} className="mx-auto text-emerald-500" />
                <div className="mt-3 text-[13px] font-medium text-text-main">当前没有相关记录</div>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
