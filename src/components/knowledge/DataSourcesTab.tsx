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
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50/80 text-xs text-neutral-500 border-b border-neutral-100 uppercase tracking-wider">
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
              <tr key={source.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center">
                    {source.type === '本地文件夹' ? (
                      <Folder className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                    )}
                    <span className="font-medium text-neutral-900 truncate max-w-[200px]">{source.name}</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-500">{source.type}</span>
                  </div>
                  {source.exceptionReason && (
                    <div className="text-xs text-red-500 mt-1">{source.exceptionReason}</div>
                  )}
                </td>
                <td className="px-5 py-4 text-neutral-600">{source.deviceOrLocation}</td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-6 bg-neutral-50 rounded-md text-neutral-700 font-medium">
                    {source.extractedCount}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {source.pendingCount > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-6 bg-amber-50 text-amber-700 rounded-md font-medium">
                      {source.pendingCount}
                    </span>
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
                <td className="px-5 py-4 text-neutral-500">{source.lastSyncTime}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center ${
                    source.state === '正常' ? 'text-emerald-600' : 
                    source.state === '已断开' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      source.state === '正常' ? 'bg-emerald-500' : 
                      source.state === '已断开' ? 'bg-red-500' : 'bg-amber-500'
                    }`}></span>
                    {source.state}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors" title="重新同步">
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
