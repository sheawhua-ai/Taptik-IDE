import React from 'react';
import { X, CheckCircle2, AlertCircle, Trash2, Edit3, FileText, Link } from 'lucide-react';
import { KnowledgeItem } from '../../types/knowledge';

interface KnowledgeDetailsDrawerProps {
  item: KnowledgeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function KnowledgeDetailsDrawer({ item, isOpen, onClose }: KnowledgeDetailsDrawerProps) {
  if (!isOpen || !item) return null;

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    item.type === '商家事实' ? 'bg-neutral-100 text-neutral-900' :
                    item.type === '规则与禁区' ? 'bg-red-50 text-red-700' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                {item.type}
              </span>
              <span className={`flex items-center text-xs font-medium ${
                item.state === '正常' ? 'text-emerald-600' : 
                item.state === '待确认' ? 'text-amber-600' : 'text-neutral-400'
              }`}>
                {item.state === '正常' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {item.state === '待确认' && <AlertCircle className="w-3 h-3 mr-1" />}
                {item.state}
              </span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 leading-snug">{item.summary}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {item.atomicFacts && item.atomicFacts.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">知识原子化</h3>
              <div className="space-y-2">
                {item.atomicFacts.map(fact => (
                  <div key={fact.id} className="flex items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">{fact.content}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">原文依据</h3>
            <div className="bg-neutral-100/50 p-4 rounded-xl border border-neutral-200 text-sm text-neutral-700 leading-relaxed">
              "{item.originalEvidence}"
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">来源文件</h3>
            <div className="flex items-center text-sm text-neutral-700">
              <FileText className="w-4 h-4 text-neutral-400 mr-2" />
              {item.source}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">业务分类</h3>
              <span className="inline-block px-3 py-1.5 bg-neutral-100 rounded-lg text-sm text-neutral-700">
                {item.category}
              </span>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">适用范围</h3>
              <span className="inline-block px-3 py-1.5 bg-neutral-100 rounded-lg text-sm text-neutral-700">
                {item.scope}
              </span>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">有效期</h3>
              <span className="inline-block px-3 py-1.5 bg-neutral-100 rounded-lg text-sm text-neutral-700">
                {item.validity}
              </span>
            </section>
          </div>

          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">使用效果</h3>
            <div className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <span>被 Agent 调用次数</span>
                <span className="font-semibold text-neutral-900">{item.usageCount || 0} 次</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>最近调用：{item.updateTime}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="flex space-x-3">
            <button className="flex items-center text-sm text-neutral-600 hover:text-neutral-900 font-medium">
              <Edit3 className="w-4 h-4 mr-1.5" /> 修改知识
            </button>
            <button className="flex items-center text-sm text-neutral-600 hover:text-red-600 font-medium">
              <Trash2 className="w-4 h-4 mr-1.5" /> 标记失效
            </button>
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm">
            <Link className="w-4 h-4 mr-2 text-neutral-400" /> 查看原文件
          </button>
        </div>
      </div>
    </>
  );
}
