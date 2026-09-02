import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, ClipboardCheck, FilePlus2, Link2 } from 'lucide-react';
import type { BusinessCategory, KnowledgeItem, PendingTask, SourceItem } from '../../types/knowledge';
import type { KnowledgeCategoryConfig } from './CategorySettingsDrawer';

interface OverviewTabProps {
  pendingTasks: PendingTask[];
  knowledgeList: KnowledgeItem[];
  sources: SourceItem[];
  categories: KnowledgeCategoryConfig[];
  onOpenWorkbench: (task: PendingTask) => void;
  onOpenCategory: (category: BusinessCategory) => void;
  onPickFiles: () => void;
}

export function OverviewTab({ pendingTasks, knowledgeList, sources, categories, onOpenWorkbench, onOpenCategory, onPickFiles }: OverviewTabProps) {
  const [hasChecked, setHasChecked] = useState(false);
  const abnormalSources = sources.filter(source => source.state === '待处理' || source.state === '已断开');

  const missingCategories = useMemo(() => categories.filter(category => !knowledgeList.some(item => item.category === category.name)), [categories, knowledgeList]);
  const attentionCount = pendingTasks.length + missingCategories.length + abnormalSources.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex items-center gap-2 rounded-lg bg-page-bg px-4 py-2 text-sm text-text-secondary">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span>商家资料已就绪 · <span className="font-medium text-danger">{attentionCount} 项需要关注</span> · {sources.filter(source => source.state === '正常').length} 个资料来源已连接</span>
      </div>

      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-border-default bg-surface-1 px-6 py-10 text-center shadow-sm">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${hasChecked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-danger'}`}>
          {hasChecked ? <CheckCircle2 className="h-7 w-7" /> : <ClipboardCheck className="h-7 w-7" />}
        </span>
        <h2 className="mt-5 text-xl font-semibold text-text-main">{hasChecked ? '知识库体检完成' : '给知识库做一次体检'}</h2>
        <p className="mt-2 text-sm text-text-tertiary">{hasChecked ? `发现 ${attentionCount} 项需要关注，已按影响范围排好顺序。` : '看看哪些内容已经齐全，哪些还需要补充。'}</p>
        <button onClick={() => setHasChecked(true)} className="mt-5 flex items-center rounded-lg bg-btn-main px-5 py-2.5 text-sm font-medium text-white hover:bg-btn-main-hover">
          <ClipboardCheck className="mr-1.5 h-4 w-4" />{hasChecked ? '重新体检' : '开始体检'}
        </button>
      </section>

      <section className="overflow-hidden rounded-xl border border-border-default bg-surface-1 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-main">需要关注</h2>
            <p className="mt-1 text-[13px] text-text-tertiary">只列出会影响资料可用性、AI 判断或业务执行的事项。</p>
          </div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-medium text-danger">{attentionCount} 项</span>
        </div>

        <div className="divide-y divide-border-default">
          {pendingTasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 px-5 py-4 hover:bg-page-bg">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><AlertCircle className="h-4 w-4" /></span>
              <button onClick={() => onOpenWorkbench(task)} className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium text-text-main">{task.title}</span>
                <span className="mt-1 block text-[13px] text-text-tertiary">{task.impact}</span>
              </button>
              <ChevronRight className="h-4 w-4 text-text-tertiary" />
              <button onClick={() => task.type === '缺少资料' ? onPickFiles() : onOpenWorkbench(task)} className="flex shrink-0 items-center rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm text-text-secondary hover:bg-hover-bg">
                {task.type === '缺少资料' ? <FilePlus2 className="mr-1.5 h-4 w-4" /> : null}{task.type === '缺少资料' ? '补充材料' : '去处理'}
              </button>
            </div>
          ))}

          {missingCategories.map(category => (
            <div key={category.id} className="flex items-center gap-4 px-5 py-4 hover:bg-page-bg">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hover-bg text-text-tertiary"><FilePlus2 className="h-4 w-4" /></span>
              <button onClick={() => onOpenCategory(category.name as BusinessCategory)} className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium text-text-main">{category.name}还没有资料</span>
                <span className="mt-1 block text-[13px] text-text-tertiary">可以上传资料，由 AI 按实际内容拆解和归位</span>
              </button>
              <ChevronRight className="h-4 w-4 text-text-tertiary" />
              <button onClick={onPickFiles} className="flex shrink-0 items-center rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm text-text-secondary hover:bg-hover-bg"><FilePlus2 className="mr-1.5 h-4 w-4" />补充材料</button>
            </div>
          ))}

          {abnormalSources.map(source => (
            <div key={source.id} className="flex items-center gap-4 px-5 py-4 hover:bg-page-bg">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-danger"><Link2 className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text-main">{source.name}</span>
                <span className="mt-1 block text-[13px] text-danger">{source.exceptionReason || source.state}</span>
              </div>
              <button className="shrink-0 rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm text-text-secondary hover:bg-hover-bg">重新链接</button>
            </div>
          ))}

          {attentionCount === 0 ? <div className="px-5 py-12 text-center text-sm text-text-tertiary">当前没有需要关注的事项</div> : null}
        </div>
      </section>
    </div>
  );
}
