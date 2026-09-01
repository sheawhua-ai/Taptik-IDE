import React, { useEffect, useState } from 'react';
import { X, AlertCircle, FileText, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import { PendingTask, type BusinessCategory } from '../../types/knowledge';

interface PendingWorkbenchModalProps {
  tasks: PendingTask[];
  initialTaskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PendingWorkbenchModal({ tasks, initialTaskId, isOpen, onClose }: PendingWorkbenchModalProps) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(initialTaskId);
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, BusinessCategory>>({});

  useEffect(() => {
    if (isOpen) {
      setActiveTaskId(initialTaskId || tasks[0]?.id || null);
      setCategoryOverrides({});
    }
  }, [initialTaskId, isOpen, tasks]);

  if (!isOpen) return null;

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];
  const categories: BusinessCategory[] = ['品牌与产品', '账号与人设', '客户与痛点', '内容与图文', '禁区与流转', '话术与承接', '素材偏好', '打法复盘'];

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
            {tasks.map(task => {
              const expanded = activeTask?.id === task.id;
              return <div key={task.id} className={`rounded-xl border ${expanded ? 'border-neutral-300 bg-surface-1 shadow-sm' : 'border-transparent'}`}>
                <button onClick={() => setActiveTaskId(task.id)} className="w-full p-3 text-left">
                  <div className="mb-1 flex items-start justify-between">
                    <span className={`rounded px-1.5 py-0.5 text-[13px] font-medium ${task.type === '缺少资料' ? 'bg-amber-100 text-amber-700' : task.type === '来源冲突' ? 'bg-indigo-100 text-indigo-700' : task.type === '拆解预览' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{task.type}</span>
                  </div>
                  <h3 className="line-clamp-2 text-sm font-medium text-text-main">{task.title}</h3>
                </button>
                {expanded && task.type === '拆解预览' ? <div className="space-y-2 border-t border-border-default px-3 py-3">{task.decompositionItems?.map(item => {
                  const currentCategory = categoryOverrides[item.id] || item.category;
                  const adjusted = Boolean(categoryOverrides[item.id]);
                  return <div key={item.id} className="rounded-lg bg-page-bg p-2.5">
                    <div className="text-[12px] font-medium text-text-main">{currentCategory} · {item.format}</div>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-text-tertiary">{item.summary}</p>
                    <div className="mt-2 flex items-center gap-2"><select aria-label={`移去其他区块：${item.summary}`} value={currentCategory} onChange={event => setCategoryOverrides(current => ({ ...current, [item.id]: event.target.value as BusinessCategory }))} className="min-w-0 flex-1 rounded-md border border-border-default bg-surface-1 px-2 py-1 text-[12px] text-text-secondary"><option value={currentCategory}>移去其他区块</option>{categories.filter(category => category !== currentCategory).map(category => <option key={category} value={category}>{category}</option>)}</select>{adjusted ? <span className="shrink-0 text-[11px] text-emerald-700">已调整</span> : null}</div>
                  </div>;
                })}</div> : null}
              </div>;
            })}
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
                <button aria-label="关闭待确认工作台" onClick={onClose} className="p-2 text-text-tertiary hover:text-text-secondary rounded-full hover:bg-hover-bg transition-colors shrink-0">
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
                    <h3 className="text-sm font-semibold text-text-main mb-3">还缺的内容</h3>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-sm leading-relaxed mb-4">
                      {activeTask.missingWhat}
                    </div>
                    <h3 className="text-sm font-semibold text-text-main mb-3">还缺这些资料，补上后 AI 就能回答</h3>
                    <div className="p-4 bg-page-bg border border-border-default rounded-xl text-text-secondary text-sm leading-relaxed">
                      {activeTask.missingWhy}
                    </div>
                  </section>
                )}

                {activeTask.type === '拆解预览' && (
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-text-main">拆解预览</h3>
                    <div className="space-y-3">{activeTask.decompositionItems?.map(item => <div key={item.id} className="rounded-xl border border-border-default bg-page-bg p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-text-main">{categoryOverrides[item.id] || item.category}</span><span className="rounded bg-hover-bg px-2 py-1 text-[12px] text-text-secondary">{item.format}</span></div><p className="mt-2 text-sm leading-6 text-text-secondary">{item.summary}</p>{categoryOverrides[item.id] ? <div className="mt-2 text-[12px] text-emerald-700">已调整</div> : null}</div>)}</div>
                  </section>
                )}

                {activeTask.impactUses?.length ? <p className="rounded-lg bg-hover-bg px-4 py-3 text-sm text-text-secondary">补上之后，AI 能用在：{activeTask.impactUses.join('、')}</p> : null}
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
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">先跳过</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">合并编辑</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-main bg-hover-bg border border-border-default rounded-lg hover:bg-selected-bg">采用来源 B</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-main bg-hover-bg border border-border-default rounded-lg hover:bg-selected-bg">采用来源 A</button>
                  </>
                )}
                {activeTask.type === '缺少资料' && (
                  <>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">先跳过</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">粘贴文本</button>
                    <button className="px-5 py-2 text-sm font-medium text-text-secondary bg-surface-1 border border-border-default rounded-lg hover:bg-page-bg">连接文件夹</button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-btn-main rounded-lg hover:bg-btn-main-hover shadow-sm">链接本地资料</button>
                  </>
                )}
                {activeTask.type === '拆解预览' && <button className="px-5 py-2 text-sm font-medium text-white bg-btn-main rounded-lg hover:bg-btn-main-hover shadow-sm">确认写入</button>}
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
