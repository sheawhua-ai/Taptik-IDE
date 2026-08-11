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
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden flex-col sm:flex-row">
        
        {/* Left Sidebar - Task List */}
        <div className="w-full sm:w-80 bg-neutral-50 border-r border-neutral-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center">
              待确认工作台
              <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
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
                    ? 'bg-white border-neutral-300 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-neutral-100'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    task.type === '缺少资料' ? 'bg-amber-100 text-amber-700' :
                    task.type === '来源冲突' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {task.type}
                  </span>
                </div>
                <h3 className={`font-medium text-sm line-clamp-2 ${activeTask?.id === task.id ? 'text-neutral-900' : 'text-neutral-900'}`}>
                  {task.title}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Task Details */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {activeTask ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">{activeTask.title}</h2>
                  <p className="text-sm text-neutral-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5 text-neutral-400" />
                    {activeTask.reason}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 影响范围 */}
                <section>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">影响范围</h3>
                  <div className="px-4 py-2 bg-neutral-50 text-neutral-700 text-sm rounded-lg inline-block border border-neutral-100">
                    {activeTask.impact}
                  </div>
                </section>

                {/* 内容视任务类型而定 */}
                {activeTask.type === '高风险确认' && (
                  <>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-3">AI 提取的结论</h3>
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-sm leading-relaxed">
                        {activeTask.aiConclusion}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-3">对应原文依据</h3>
                      <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-700 text-sm leading-relaxed">
                        "{activeTask.originalEvidence}"
                      </div>
                      <div className="mt-2 text-xs text-neutral-500 flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        来源文件：{activeTask.sourceFile}
                      </div>
                    </section>
                  </>
                )}

                {activeTask.type === '来源冲突' && (
                  <section>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-4">并排对比</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 来源 A */}
                      <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4">
                        <div className="flex items-center text-xs font-medium text-indigo-700 mb-2">
                          <SplitSquareHorizontal className="w-4 h-4 mr-1.5" /> 来源版本 A
                        </div>
                        <div className="text-sm text-neutral-900 mb-3 leading-relaxed">
                          "{activeTask.conflictA?.text}"
                        </div>
                        <div className="text-xs text-neutral-500 pt-3 border-t border-indigo-100 space-y-1">
                          <div className="truncate">{activeTask.conflictA?.source}</div>
                          <div>更新于 {activeTask.conflictA?.time}</div>
                        </div>
                      </div>
                      {/* 来源 B */}
                      <div className="border border-neutral-200 bg-neutral-100/30 rounded-xl p-4">
                        <div className="flex items-center text-xs font-medium text-neutral-900 mb-2">
                          <SplitSquareHorizontal className="w-4 h-4 mr-1.5" /> 来源版本 B
                        </div>
                        <div className="text-sm text-neutral-900 mb-3 leading-relaxed">
                          "{activeTask.conflictB?.text}"
                        </div>
                        <div className="text-xs text-neutral-500 pt-3 border-t border-neutral-200 space-y-1">
                          <div className="truncate">{activeTask.conflictB?.source}</div>
                          <div>更新于 {activeTask.conflictB?.time}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeTask.type === '缺少资料' && (
                  <section>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">当前缺少内容</h3>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-sm leading-relaxed mb-4">
                      {activeTask.missingWhat}
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">为何现有资料不能回答</h3>
                    <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-700 text-sm leading-relaxed">
                      {activeTask.missingWhy}
                    </div>
                  </section>
                )}
              </div>

              {/* Footer / Actions */}
              <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3 shrink-0">
                {activeTask.type === '高风险确认' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">不采用</button>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">编辑后确认</button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 shadow-sm flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> 确认采用
                    </button>
                  </>
                )}
                {activeTask.type === '来源冲突' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">暂不处理</button>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">合并编辑</button>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-900 bg-neutral-100 border border-neutral-200 rounded-lg hover:bg-neutral-200">采用来源 B</button>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-900 bg-neutral-100 border border-neutral-200 rounded-lg hover:bg-neutral-200">采用来源 A</button>
                  </>
                )}
                {activeTask.type === '缺少资料' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">暂不处理</button>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">粘贴文本</button>
                    <button className="px-5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">连接文件夹</button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 shadow-sm">上传资料</button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400">请选择一个待处理事项</div>
          )}
        </div>
      </div>
    </div>
  );
}
