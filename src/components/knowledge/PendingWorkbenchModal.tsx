import React, { useState } from 'react';
import { X, AlertCircle, FileText, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { PendingTask } from '../../types/knowledge';

interface PendingWorkbenchModalProps {
  tasks: PendingTask[];
  initialTaskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PendingWorkbenchModal({ tasks, initialTaskId, isOpen, onClose }: PendingWorkbenchModalProps) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(initialTaskId);

  if (!isOpen) return null;

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-btn-main/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-1 rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden flex-col sm:flex-row">
        
        {/* Left Sidebar - Task List */}
        <div className="w-full sm:w-80 bg-page-bg border-r border-border-default flex flex-col shrink-0">
          <div className="p-4 border-b border-border-default">
            <h2 className="text-lg font-bold text-text-main flex items-center">
              待确认工作台
              <span className="ml-2 bg-red-100 text-danger text-[13px] px-2 py-0.5 rounded-full font-medium">
                {tasks.length}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={`w-full text-left p-3 rounded-xl transition-colors border ${
                  activeTask?.id === task.id 
                    ? 'bg-surface-1 border-neutral-300 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-hover-bg'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[13px] font-medium px-1.5 py-0.5 rounded ${
                    task.type === '缺少资料' ? 'bg-amber-100 text-amber-700' :
                    task.type === '来源冲突' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {task.type}
                  </span>
                </div>
                <h3 className={`font-medium text-sm line-clamp-2 ${activeTask?.id === task.id ? 'text-text-main' : 'text-text-main'}`}>
                  {task.title}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Task Details */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-1">
          {activeTask ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border-default flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-text-main mb-2">{activeTask.title}</h2>
                  <p className="text-sm text-text-secondary flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5 text-text-tertiary" />
                    {activeTask.reason}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-secondary rounded-full hover:bg-hover-bg transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 影响范围 */}
                <section>
                  <h3 className="text-sm font-semibold text-text-main mb-2">影响范围</h3>
                  <div className="px-4 py-2 bg-page-bg text-text-secondary text-sm rounded-lg inline-block border border-border-default">
                    {activeTask.impact}
                  </div>
                </section>

                {/* 内容视任务类型而定 */}
                {activeTask.type === '高风险确认' && (
                  <>
                    <section>
                      <h3 className="text-sm font-semibold text-text-main mb-3">AI 提取的结论</h3>
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-sm leading-relaxed">
                        {activeTask.aiConclusion}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-text-main mb-3">对应原文依据</h3>
                      <div className="p-4 bg-page-bg border border-border-default rounded-xl text-text-secondary text-sm leading-relaxed">
                        "{activeTask.originalEvidence}"
                      </div>
                      <div className="mt-2 text-[13px] text-text-tertiary flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        来源文件：{activeTask.sourceFile}
                      </div>
                    </section>
                  </>
                )}

                {activeTask.type === '来源冲突' && (
                  <section>
                    <h3 className="text-sm font-semibold text-text-main mb-4">并排对比</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 来源 A */}
                      <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4">
                        <div className="flex items-center text-[13px] font-medium text-indigo-700 mb-2">
                          <SplitSquareHorizontal className="w-4 h-4 mr-1.5" /> 来源版本 A
                        </div>
                        <div className="text-sm text-text-main mb-3 leading-relaxed">
                          "{activeTask.conflictA?.text}"
                        </div>
                        <div className="text-[13px] text-text-tertiary pt-3 border-t border-indigo-100 space-y-1">
                          <div className="truncate">{activeTask.conflictA?.source}</div>
                          <div>更新于 {activeTask.conflictA?.time}</div>
                        </div>
                      </div>
                      {/* 来源 B */}
                      <div className="border border-border-default bg-hover-bg/30 rounded-xl p-4">
                        <div className="flex items-center text-[13px] font-medium text-text-main mb-2">
                          <SplitSquareHorizontal className="w-4 h-4 mr-1.5" /> 来源版本 B
                        </div>
                        <div className="text-sm text-text-main mb-3 leading-relaxed">
                          "{activeTask.conflictB?.text}"
                        </div>
                        <div className="text-[13px] text-text-tertiary pt-3 border-t border-border-default space-y-1">
                          <div className="truncate">{activeTask.conflictB?.source}</div>
                          <div>更新于 {activeTask.conflictB?.time}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeTask.type === '缺少资料' && (
                  <section>
                    <h3 className="text-sm font-semibold text-text-main mb-3">当前缺少内容</h3>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-sm leading-relaxed mb-4">
                      {activeTask.missingWhat}
                    </div>
                    <h3 className="text-sm font-semibold text-text-main mb-3">为何现有资料不能回答</h3>
                    <div className="p-4 bg-page-bg border border-border-default rounded-xl text-text-secondary text-sm leading-relaxed">
                      {activeTask.missingWhy}
                    </div>
                  </section>
                )}
              </div>

              {/* Footer / Actions */}
              <div className="p-6 border-t border-border-default bg-page-bg flex items-center justify-end gap-3 shrink-0">
                {activeTask.type === '高风险确认' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">不采用</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">编辑后确认</button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-btn-main rounded-lg hover:bg-btn-main-hover shadow-sm flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> 确认采用
                    </button>
                  </>
                )}
                {activeTask.type === '来源冲突' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">暂不处理</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">合并编辑</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-main bg-hover-bg border border-border-default rounded-lg hover:bg-selected-bg">采用来源 B</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-main bg-hover-bg border border-border-default rounded-lg hover:bg-selected-bg">采用来源 A</button>
                  </>
                )}
                {activeTask.type === '缺少资料' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">暂不处理</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">粘贴文本</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">连接文件夹</button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-btn-main rounded-lg hover:bg-btn-main-hover shadow-sm">链接本地资料</button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-tertiary">请选择一个待处理事项</div>
          )}
        </div>
      </div>
    </div>
  );
}
