import React from 'react';
import { FileUp, Folder, Link as LinkIcon, RefreshCw, FileText } from 'lucide-react';
import { SourceItem } from '../../types/knowledge';

interface DataSourcesTabProps {
  sources: SourceItem[];
}

export function DataSourcesTab({ sources }: DataSourcesTabProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* List */}
      <div className="bg-surface-1 border border-border-default rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-page-bg/80 text-xs text-text-tertiary border-b border-border-default uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-medium">来源名称</th>
              <th className="px-5 py-3 font-medium">所属设备/位置</th>
              <th className="px-5 py-3 font-medium text-center">已提取</th>
              <th className="px-5 py-3 font-medium text-center">待确认</th>
              <th className="px-5 py-3 font-medium">最近同步</th>
              <th className="px-5 py-3 font-medium">状态</th>
              <th className="px-5 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {sources.map(source => (
              <tr key={source.id} className="hover:bg-page-bg transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    {source.type === '本地文件夹' ? (
                      <Folder className="w-4 h-4 text-text-tertiary mr-2 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-text-tertiary mr-2 shrink-0" />
                    )}
                    <span className="font-medium text-text-main truncate max-w-[200px]">{source.name}</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-hover-bg text-text-tertiary">{source.type}</span>
                  </div>
                  {source.exceptionReason && (
                    <div className="text-xs text-danger mt-1">{source.exceptionReason}</div>
                  )}
                </td>
                <td className="px-5 py-4 text-text-secondary">{source.deviceOrLocation}</td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-6 bg-page-bg rounded-md text-text-secondary font-medium">
                    {source.extractedCount}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {source.pendingCount > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-6 bg-amber-50 text-amber-700 rounded-md font-medium">
                      {source.pendingCount}
                    </span>
                  ) : (
                    <span className="text-text-tertiary">-</span>
                  )}
                </td>
                <td className="px-5 py-4 text-text-tertiary">{source.lastSyncTime}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center ${
                    source.state === '正常' ? 'text-emerald-600' : 
                    source.state === '已断开' ? 'text-danger' : 'text-amber-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      source.state === '正常' ? 'bg-emerald-500' : 
                      source.state === '已断开' ? 'bg-red-500' : 'bg-amber-500'
                    }`}></span>
                    {source.state}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded transition-colors" title="重新同步">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
