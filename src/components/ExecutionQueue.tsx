import React, { useState, useEffect } from "react";
import { Bot, CheckCircle2, Loader2, Play, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QueueItem {
  id: string;
  taskTitle: string;
  actionText: string;
  status: "pending" | "running" | "completed";
}

export const ExecutionQueue: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    const handleStartAction = (e: any) => {
      const task = e.detail.task;
      const newItem: QueueItem = {
        id: task.id,
        taskTitle: task.title,
        actionText: task.aiActionText,
        status: "running",
      };
      
      setQueue((prev) => {
        // filter out if already exists
        const filtered = prev.filter(p => p.id !== newItem.id);
        return [newItem, ...filtered];
      });

      // Mock completion
      setTimeout(() => {
        setQueue((prev) => 
          prev.map((p) => p.id === newItem.id ? { ...p, status: "completed" } : p)
        );
      }, 3000);
    };

    window.addEventListener("start-ai-action", handleStartAction);
    return () => window.removeEventListener("start-ai-action", handleStartAction);
  }, []);

  const completedCount = queue.filter(q => q.status === "completed").length;
  const runningCount = queue.filter(q => q.status === "running").length;

  return (
    <div className="flex flex-col h-full bg-surface-1 relative">
      <div className="h-16 border-b border-border-default flex items-center justify-between px-6 shrink-0 bg-btn-main text-white">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-primary-400" />
          <h3 className="font-semibold text-[15px]">协同副手队列</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-surface-1/10 rounded-lg transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa]">
        {queue.length === 0 ? (
          <div className="text-center text-text-tertiary mt-20 text-[13px]">
            当前无执行任务
          </div>
        ) : (
          <div className="space-y-8">
            {runningCount > 0 && (
              <div>
                <h4 className="text-[13px] font-bold text-text-main mb-4 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-brand-logo" />
                  智能 正在处理 {runningCount} 项
                </h4>
                <div className="space-y-3">
                  {queue.filter(q => q.status === "running").map(item => (
                    <div key={item.id} className="bg-surface-1 p-4 rounded-xl border border-primary-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-btn-main animate-pulse"></div>
                      <p className="text-[13px] font-medium text-text-main">{item.actionText}</p>
                      <p className="text-[13px] text-text-tertiary mt-1">处理对象：{item.taskTitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedCount > 0 && (
              <div>
                <h4 className="text-[13px] font-bold text-text-main mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-text-main" />
                  智能 已完成 {completedCount} 项
                </h4>
                <div className="space-y-3">
                  {queue.filter(q => q.status === "completed").map(item => (
                    <div key={item.id} className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-btn-main"></div>
                      <p className="text-[13px] font-medium text-text-main">{item.actionText} (已完成)</p>
                      <p className="text-[13px] text-text-tertiary mt-1">处理对象：{item.taskTitle}</p>
                      
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-1.5 text-[13px] font-medium border border-border-default rounded-lg hover:bg-page-bg text-text-secondary">
                          查看结果
                        </button>
                        <button className="flex-1 py-1.5 text-[13px] font-medium bg-btn-main text-white rounded-lg hover:bg-btn-main-hover">
                          应用
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {queue.length > 0 && (
        <div className="p-4 border-t border-border-default bg-surface-1">
          <button className="w-full py-2.5 bg-btn-main text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-btn-main-hover transition-colors">
            继续下一项任务 <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
