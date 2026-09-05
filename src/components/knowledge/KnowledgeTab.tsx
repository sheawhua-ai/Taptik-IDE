import React, { useMemo, useState } from 'react';
import {
  Camera,
  Database,
  Image,
  MessageSquare,
  MoreHorizontal,
  Package,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  TrendingUp,
  UploadCloud,
  Users
} from 'lucide-react';
import type { BusinessCategory, KnowledgeItem } from '../../types/knowledge';
import type { KnowledgeCategoryConfig } from './CategorySettingsDrawer';

interface KnowledgeTabProps {
  knowledgeList: KnowledgeItem[];
  categories: KnowledgeCategoryConfig[];
  selectedCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  onOpenKnowledge: (item: KnowledgeItem) => void;
  onOpenSettings: () => void;
  onPickFiles: () => void;
}

const CATEGORY_ICONS = {
  品牌与产品: Package,
  账号与人设: Store,
  客户与痛点: Users,
  内容与图文: Image,
  禁区与流转: ShieldCheck,
  话术与承接: MessageSquare,
  素材偏好: Camera,
  打法复盘: TrendingUp
} satisfies Record<BusinessCategory, React.ComponentType<{ className?: string }>>;

export function KnowledgeTab({
  knowledgeList,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenKnowledge,
  onOpenSettings,
  onPickFiles
}: KnowledgeTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const activeCategory = categories.find(category => category.name === selectedCategory) || categories[0];

  const categoryCounts = useMemo(() => {
    const counts = new Map<BusinessCategory, number>();
    for (const item of knowledgeList) counts.set(item.category, (counts.get(item.category) || 0) + 1);
    return counts;
  }, [knowledgeList]);

  const visibleKnowledge = useMemo(() => knowledgeList.filter(item => {
    if (item.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return item.summary.toLowerCase().includes(query) || item.source.toLowerCase().includes(query);
  }), [knowledgeList, searchQuery, selectedCategory]);

  if (!activeCategory) return null;

  return (
    <div className="-m-8 flex h-[calc(100vh-150px)] min-h-[620px] overflow-hidden bg-surface-1">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border-default bg-surface-1">
        <div className="border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-text-main">知识板块</h2>
            <p className="mt-0.5 text-[12px] text-text-tertiary">{categories.length} 个板块</p>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          {categories.map(category => {
            const categoryName = category.name as BusinessCategory;
            const Icon = CATEGORY_ICONS[categoryName] || Database;
            const count = categoryCounts.get(categoryName) || 0;
            const isActive = categoryName === selectedCategory;
            return (
              <div key={category.id} className={`group flex items-center rounded-xl ${isActive ? 'bg-hover-bg' : 'hover:bg-page-bg'}`}>
                <button onClick={() => onSelectCategory(categoryName)} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${isActive ? 'border-red-100 bg-red-50 text-danger' : 'border-border-default bg-surface-1 text-text-tertiary'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-text-main">{category.name}</span>
                    <span className="mt-0.5 block text-[12px] text-text-tertiary">{count > 0 ? `${count} 条知识` : '待添加资料'}</span>
                  </span>
                </button>
                <button aria-label={`设置${category.name}`} onClick={onOpenSettings} className="mr-2 rounded-md p-1.5 text-text-tertiary opacity-0 transition-opacity hover:bg-surface-1 group-hover:opacity-100 focus:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-page-bg/30">
        <header className="flex items-center justify-between border-b border-border-default bg-surface-1 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-text-main">{activeCategory.name}</h2>
              <span className="rounded-md bg-hover-bg px-2 py-0.5 text-[12px] font-medium text-text-secondary border border-border-default">
                主格式：{activeCategory.primaryFormat}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-text-tertiary">{categoryCounts.get(selectedCategory) || 0} 条知识 · AI 按本板块说明自动归位</p>
          </div>
          <button onClick={onOpenSettings} className="flex items-center rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm text-text-secondary hover:bg-hover-bg">
            <Settings2 className="mr-1.5 h-4 w-4" />板块设置
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-5">
            <section className="grid gap-5 rounded-xl border border-border-default bg-surface-1 p-4 lg:grid-cols-2">
              <div>
                <div className="mb-2 text-[13px] font-medium text-text-secondary">包含哪些知识</div>
                <div className="flex flex-wrap gap-2">{activeCategory.includes.map(tag => <span key={tag} className="rounded-full bg-hover-bg px-3 py-1 text-[12px] text-text-secondary">{tag}</span>)}</div>
              </div>
              <div>
                <div className="mb-2 text-[13px] font-medium text-text-secondary">影响哪些业务</div>
                <div className="flex flex-wrap gap-2">{activeCategory.affects.map(tag => <span key={tag} className="rounded-full bg-hover-bg px-3 py-1 text-[12px] text-text-secondary">{tag}</span>)}</div>
              </div>
            </section>

            <button onClick={onPickFiles} className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-surface-1 px-5 py-7 text-left transition-colors hover:border-neutral-500 hover:bg-hover-bg">
              <UploadCloud className="h-6 w-6 text-text-tertiary" />
              <span>
                <span className="block text-sm font-medium text-text-main">上传资料，AI 自动拆解和归位</span>
                <span className="mt-1 block text-[12px] text-text-tertiary">当前板块只是查看范围；一份资料仍可能进入多个板块</span>
              </span>
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="搜索本板块的知识或来源" className="w-full rounded-xl border border-border-default bg-surface-1 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neutral-400" />
            </div>

            {visibleKnowledge.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-border-default bg-surface-1">
                {visibleKnowledge.map(item => (
                  <button key={item.id} onClick={() => onOpenKnowledge(item)} className="flex w-full items-start justify-between gap-5 border-b border-border-default px-5 py-4 text-left last:border-b-0 hover:bg-page-bg">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-6 text-text-main">{item.summary}</span>
                      <span className="mt-1 block truncate text-[12px] text-text-tertiary">{item.source} · {item.scope}</span>
                    </span>
                    <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[12px] ${item.state === '正常' ? 'bg-emerald-50 text-emerald-700' : item.state === '待确认' ? 'bg-amber-50 text-amber-700' : 'bg-hover-bg text-text-tertiary'}`}>{item.state}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-1 text-center">
                <Database className="h-9 w-9 text-neutral-300" />
                <h3 className="mt-3 text-sm font-medium text-text-main">这个板块还没有知识</h3>
                <p className="mt-1 text-[13px] text-text-tertiary">上传资料后，AI 会按板块说明拆解并提交确认</p>
                <button onClick={onPickFiles} className="mt-4 rounded-lg bg-btn-main px-4 py-2 text-sm font-medium text-white hover:bg-btn-main-hover">补充资料</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
