import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { PendingTask, KnowledgeItem, SourceItem } from '../../types/knowledge';

interface OverviewTabProps {
  pendingTasks: PendingTask[];
  recentlyUpdated: KnowledgeItem[];
  sources: SourceItem[];
  onOpenWorkbench: (task: PendingTask) => void;
  onOpenKnowledge: (item: KnowledgeItem) => void;
}

export function OverviewTab({ pendingTasks, recentlyUpdated, sources, onOpenWorkbench, onOpenKnowledge }: OverviewTabProps) {
  const topPriorityTask = pendingTasks[0];
  const otherTasksCount = pendingTasks.length > 1 ? pendingTasks.length - 1 : 0;
  
  const abnormalSources = sources.filter(s => s.state !== '正常');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Status */}
      <div className="flex items-center space-x-2 text-sm text-neutral-600 bg-neutral-50 px-4 py-2 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>当前商家知识正常 · <span className="text-red-500 font-medium">{pendingTasks.length} 项需要处理</span> · {sources.filter(s => s.state === '正常').length} 个资料来源已连接</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: 需要你处理 */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-100 bg-red-50/30">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center">
              <AlertCircle className="w-5 h-5 text-brand-red mr-2 text-red-500" />
              需要你处理
            </h2>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            {topPriorityTask ? (
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-900">{topPriorityTask.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    {topPriorityTask.type}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">{topPriorityTask.reason}</p>
                <div className="text-xs text-neutral-500 mb-4 bg-white p-2 rounded border border-neutral-100">
                  <span className="font-medium">影响范围：</span>{topPriorityTask.impact}
                </div>
                <button 
                  onClick={() => onOpenWorkbench(topPriorityTask)}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {topPriorityTask.type === '缺少资料' ? '补充资料' : 
                   topPriorityTask.type === '来源冲突' ? '选择有效版本' : '确认规则'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                <CheckCircle2 className="w-12 h-12 mb-2 text-emerald-100" />
                <p>当前没有需要处理的事项</p>
              </div>
            )}
            
            {otherTasksCount > 0 && (
              <button 
                onClick={() => onOpenWorkbench(pendingTasks[1])}
                className="mt-4 text-sm text-neutral-500 hover:text-neutral-900 flex items-center justify-center w-full py-2 bg-neutral-50 rounded-lg transition-colors"
              >
                另外还有 {otherTasksCount} 项需要处理 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: 最近更新 */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-neutral-900">最近更新</h2>
            <button className="text-sm text-neutral-900 hover:text-neutral-900">查看全部</button>
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            <div className="divide-y divide-neutral-50">
              {recentlyUpdated.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => onOpenKnowledge(item)}
                >
                  <p className="text-sm font-medium text-neutral-900 mb-1 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center text-xs text-neutral-500 space-x-3">
                    <span className="truncate max-w-[150px]">{item.source}</span>
                    <span className={`px-2 py-0.5 rounded-full ${item.state === '正常' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.state}
                    </span>
                    <span>{item.updateTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: 资料来源状态 (Only show abnormal or recently updated) */}
      {abnormalSources.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-900">资料来源异常</h2>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50/50 text-xs text-neutral-500 border-b border-neutral-100">
                <tr>
                  <th className="px-5 py-3 font-medium">来源名称</th>
                  <th className="px-5 py-3 font-medium">类型</th>
                  <th className="px-5 py-3 font-medium">状态</th>
                  <th className="px-5 py-3 font-medium">异常原因</th>
                  <th className="px-5 py-3 font-medium">最近同步</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {abnormalSources.map(source => (
                  <tr key={source.id} className="hover:bg-neutral-50/50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{source.name}</td>
                    <td className="px-5 py-3">{source.type}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        source.state === '已断开' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {source.state}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-red-500 truncate max-w-[200px]" title={source.exceptionReason}>
                      {source.exceptionReason}
                    </td>
                    <td className="px-5 py-3">{source.lastSyncTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
