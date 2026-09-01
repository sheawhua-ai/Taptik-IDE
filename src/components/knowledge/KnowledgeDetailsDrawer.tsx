import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Trash2, Edit3, FileText, Link } from 'lucide-react';
import { KnowledgeItem } from '../../types/knowledge';

interface KnowledgeDetailsDrawerProps {
  item: KnowledgeItem | null;
  isOpen: boolean;
  onClose: () => void;
  allItems: KnowledgeItem[];
  onSave: (item: KnowledgeItem) => void;
}

export function KnowledgeDetailsDrawer({ item, isOpen, onClose, allItems, onSave }: KnowledgeDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSummary, setDraftSummary] = useState('');

  useEffect(() => {
    setDraftSummary(item?.summary ?? '');
    setIsEditing(false);
  }, [item?.id, item?.summary]);

  if (!isOpen || !item) return null;

  const sameSourceItems = allItems.filter(candidate => candidate.id !== item.id && candidate.source === item.source);
  const sharedCategories = Array.from(new Set([item.category, ...sameSourceItems.map(candidate => candidate.category)]));

  const saveChanges = () => {
    if (!draftSummary.trim()) return;
    onSave({ ...item, summary: draftSummary.trim(), updateTime: '刚刚' });
    setIsEditing(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-btn-main/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-surface-1 shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-border-default">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-[13px] font-medium ${
                    item.type === '商家事实' ? 'bg-hover-bg text-text-main' :
                    item.type === '规则与禁区' ? 'bg-red-50 text-red-700' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                {item.type}
              </span>
              <span className={`flex items-center text-[13px] font-medium ${
                item.state === '正常' ? 'text-emerald-600' : 
                item.state === '待确认' ? 'text-amber-600' : 'text-text-tertiary'
              }`}>
                {item.state === '正常' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {item.state === '待确认' && <AlertCircle className="w-3 h-3 mr-1" />}
                {item.state}
              </span>
            </div>
            <h2 className="text-xl font-bold text-text-main leading-snug">{item.summary}</h2>
          </div>
          <button aria-label="关闭知识详情" onClick={onClose} className="p-2 text-text-tertiary hover:text-text-secondary rounded-full hover:bg-hover-bg transition-colors shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {item.atomicFacts && item.atomicFacts.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-text-main mb-3">单条事实</h3>
              <div className="space-y-2">
                {item.atomicFacts.map(fact => (
                  <div key={fact.id} className="flex items-start bg-page-bg p-3 rounded-xl border border-border-default">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                    <span className="text-sm text-text-secondary">{fact.content}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">原文依据</h3>
            <div className="bg-hover-bg/50 p-4 rounded-xl border border-border-default text-sm text-text-secondary leading-relaxed">
              "{item.originalEvidence}"
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">来源文件</h3>
            <div className="flex items-center text-sm text-text-secondary">
              <FileText className="w-4 h-4 text-text-tertiary mr-2" />
              {item.source}
            </div>
          </section>

          {sameSourceItems.length > 0 ? (
            <section>
              <h3 className="text-sm font-semibold text-text-main mb-3">同源引用</h3>
              <div className="rounded-xl border border-border-default bg-page-bg p-4 text-sm text-text-secondary">
                与 {sharedCategories.join('、')} 共用来源《{item.source.replace(/\.[^.]+$/, '')}》
              </div>
            </section>
          ) : null}

          <div className="grid grid-cols-2 gap-6">
            <section>
              <h3 className="text-sm font-semibold text-text-main mb-2">业务分类</h3>
              <span className="inline-block px-3 py-1.5 bg-hover-bg rounded-lg text-sm text-text-secondary">
                {item.category}
              </span>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-text-main mb-2">适用范围</h3>
              <span className="inline-block px-3 py-1.5 bg-hover-bg rounded-lg text-sm text-text-secondary">
                {item.scope}
              </span>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-text-main mb-2">有效期</h3>
              <span className="inline-block px-3 py-1.5 bg-hover-bg rounded-lg text-sm text-text-secondary">
                {item.validity}
              </span>
            </section>
          </div>

          <section>
            <h3 className="text-sm font-semibold text-text-main mb-3">使用效果</h3>
            <div className="text-sm text-text-secondary bg-page-bg p-4 rounded-xl border border-border-default">
              被 AI 用过 {item.usageCount || 0} 次，最近一次 {item.lastUsedTime || item.updateTime}
            </div>
          </section>

          {isEditing ? (
            <section className="rounded-xl border border-border-default bg-page-bg p-4">
              {sameSourceItems.length > 0 ? <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] leading-5 text-amber-800">还有 {sameSourceItems.length} 条知识来自这份文件，改完请确认它们不受影响</div> : null}
              <label htmlFor="knowledge-summary" className="block text-sm font-semibold text-text-main">正文</label>
              <textarea id="knowledge-summary" value={draftSummary} onChange={event => setDraftSummary(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm leading-6 outline-none focus:border-neutral-700" />
              <label htmlFor="knowledge-source" className="mt-4 block text-sm font-semibold text-text-main">来源文件</label>
              <input id="knowledge-source" value={item.source} readOnly aria-readonly="true" className="mt-2 w-full cursor-not-allowed rounded-lg border border-border-default bg-hover-bg px-3 py-2 text-sm text-text-tertiary" />
              <div className="mt-4 flex justify-end gap-2"><button onClick={() => setIsEditing(false)} className="rounded-lg border border-border-default px-4 py-2 text-sm text-text-secondary">取消</button><button onClick={saveChanges} disabled={!draftSummary.trim()} className="rounded-lg bg-btn-main px-4 py-2 text-sm font-medium text-white disabled:opacity-35">保存修改</button></div>
            </section>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-default bg-page-bg flex items-center justify-between">
          <div className="flex space-x-3">
            <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-text-secondary hover:text-text-main font-medium">
              <Edit3 className="w-4 h-4 mr-1.5" /> 修改知识
            </button>
            <button className="flex items-center text-sm text-text-secondary hover:text-danger font-medium">
              <Trash2 className="w-4 h-4 mr-1.5" /> 标记失效
            </button>
          </div>
          <button className="flex items-center px-4 py-2 bg-surface-1 border border-border-default text-text-secondary rounded-lg text-sm font-medium hover:bg-page-bg transition-colors shadow-sm">
            <Link className="w-4 h-4 mr-2 text-text-tertiary" /> 查看原文件
          </button>
        </div>
      </div>
    </>
  );
}
