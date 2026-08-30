import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  Building2,
  Check,
  CheckCircle2,
  Search,
  Settings2,
  X,
} from "lucide-react";

interface ProjectSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Record<string, any>;
  activeProjectId: string;
  onSelect: (id: string) => void;
  onManageMerchants?: () => void;
}

type SpaceFilter = "all" | "ready" | "setup";

export const ProjectSwitcherModal: React.FC<ProjectSwitcherModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelect,
  onManageMerchants,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SpaceFilter>("all");

  const activeMerchants = useMemo(
    () => Object.values(projects).filter(
      (merchant: any) => merchant.id !== "new-merchant" && merchant.status !== "archived",
    ),
    [projects],
  );
  const readyCount = activeMerchants.filter((merchant: any) => (merchant.stats?.profileCompleteness ?? 0) === 100).length;
  const setupCount = activeMerchants.length - readyCount;
  const filteredMerchants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return activeMerchants.filter((merchant: any) => {
      const completeness = merchant.stats?.profileCompleteness ?? 0;
      if (activeFilter === "ready" && completeness !== 100) return false;
      if (activeFilter === "setup" && completeness === 100) return false;
      const searchable = [merchant.name, merchant.industryProfile?.primaryName, ...(merchant.tags || [])].filter(Boolean).join(" ").toLowerCase();
      return !query || searchable.includes(query);
    });
  }, [activeFilter, activeMerchants, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-start justify-center bg-btn-main/40 p-4 pt-[8vh] backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-border-default bg-surface-1 shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="merchant-switcher-title"
        >
          <header className="space-y-5 border-b border-border-default bg-page-bg/30 px-8 pb-5 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-btn-main text-white shadow-sm"><Building2 size={18} /></span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="merchant-switcher-title" className="text-[18px] font-semibold tracking-tight text-text-main">切换商家</h2>
                    <span className="rounded-full border border-border-default bg-surface-subtle px-2 py-0.5 text-[13px] text-text-secondary">共 {activeMerchants.length} 家</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-text-tertiary">快速切换旗下各品牌的独立项目空间</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {onManageMerchants ? (
                  <button type="button" onClick={onManageMerchants} className="inline-flex items-center gap-1.5 rounded-xl bg-btn-main px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:opacity-90"><Settings2 size={15} />商家管理</button>
                ) : null}
                <button type="button" onClick={onClose} aria-label="关闭商家切换" className="flex h-9 w-9 items-center justify-center rounded-xl bg-hover-bg text-text-secondary transition-colors hover:bg-selected-bg"><X size={17} /></button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="group relative min-w-0 flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-brand-logo" />
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索商家名称、行业或标签..." aria-label="搜索商家空间" className="h-10 w-full rounded-xl border border-border-default bg-surface-1 pl-10 pr-9 text-[13px] outline-none shadow-2xs transition-all focus:border-brand-500" />
                {searchQuery ? <button type="button" onClick={() => setSearchQuery("")} aria-label="清空搜索" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-main"><X size={14} /></button> : null}
              </label>
              <div className="flex items-center rounded-xl border border-border-default/50 bg-hover-bg/70 p-1">
                {([
                  ["all", `全部 (${activeMerchants.length})`],
                  ["ready", `服务中 (${readyCount})`],
                  ["setup", `待冷启 (${setupCount})`],
                ] as const).map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setActiveFilter(id)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${activeFilter === id ? "bg-surface-1 text-text-main shadow-xs" : "text-text-tertiary hover:text-text-secondary"}`}>{label}</button>
                ))}
              </div>
            </div>
          </header>

          <div className="min-h-[340px] max-h-[58vh] flex-1 overflow-y-auto bg-surface-1 custom-scrollbar">
            <div className="sticky top-0 z-10 grid w-full grid-cols-12 gap-4 border-b border-border-default bg-surface-1 px-8 py-3 text-[13px] font-medium uppercase tracking-wider text-text-tertiary">
              <div className="col-span-5">商家名称与属性</div>
              <div className="col-span-3">核心业务状态</div>
              <div className="col-span-2">完善度 / 状态</div>
              <div className="col-span-2 text-right">切换空间</div>
            </div>

            {filteredMerchants.map((merchant: any) => {
              const isActive = merchant.id === activeProjectId;
              const completeness = merchant.stats?.profileCompleteness ?? 0;
              return (
                <button key={merchant.id} type="button" onClick={() => onSelect(merchant.id)} className={`group relative grid w-full grid-cols-12 items-center gap-4 border-b border-border-default px-8 py-4 text-left transition-all ${isActive ? "bg-brand-light/40" : "hover:bg-page-bg"}`}>
                  {isActive ? <span className="absolute inset-y-0 left-0 w-1 bg-btn-main" /> : null}
                  <span className="col-span-5 flex min-w-0 items-center gap-3 pr-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[14px] font-semibold uppercase shadow-2xs transition-transform group-hover:scale-105" style={{ backgroundColor: merchant.color || "var(--primary-50)", color: merchant.textColor || "var(--primary-500)" }}>{merchant.initial || merchant.name?.charAt(0) || "商"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 flex items-center gap-2"><strong className={`truncate text-[14px] font-semibold tracking-tight ${isActive ? "text-brand-logo" : "text-text-main"}`}>{merchant.name}</strong>{isActive ? <span className="shrink-0 rounded bg-primary-100 px-1.5 py-0.5 text-[13px] font-bold tracking-wider text-brand-logo">当前使用</span> : null}</span>
                      <span className="flex flex-wrap items-center gap-1">{(merchant.tags || [merchant.industryProfile?.primaryName]).filter(Boolean).slice(0, 3).map((tag: string) => <span key={tag} className="max-w-[90px] truncate rounded bg-hover-bg px-1.5 py-0.5 text-[13px] text-text-tertiary">{tag}</span>)}</span>
                    </span>
                  </span>
                  <span className="col-span-3 flex min-w-0 items-center gap-2.5">
                    <span className="flex shrink-0 items-center gap-1 rounded-lg border border-border-default bg-page-bg px-2.5 py-1"><BarChart2 size={11} className="text-text-tertiary" /><strong className="text-[13px] font-medium text-text-secondary">{merchant.stats?.pendingContent || 0}</strong><span className="text-[13px] text-text-tertiary">篇待发</span></span>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg border border-border-default bg-page-bg px-2.5 py-1"><AlertCircle size={11} className="text-text-tertiary" /><strong className="text-[13px] font-medium text-text-secondary">{merchant.stats?.pendingLeads || 0}</strong><span className="text-[13px] text-text-tertiary">条待回</span></span>
                  </span>
                  <span className="col-span-2">
                    {completeness === 100 ? <span className="inline-flex items-center gap-1.5 rounded-lg bg-hover-bg px-2.5 py-1 text-[13px] text-text-main"><CheckCircle2 size={12} className="text-emerald-600" />已完善</span> : <span className="flex items-center gap-2"><span className="h-1.5 w-14 overflow-hidden rounded-full bg-hover-bg"><span className="block h-full rounded-full bg-brand-logo" style={{ width: `${completeness}%` }} /></span><span className="text-[13px] text-text-tertiary">{completeness}%</span></span>}
                  </span>
                  <span className="col-span-2 flex items-center justify-end">
                    {isActive ? <span className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-logo"><Check size={14} />当前空间</span> : <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-text-tertiary transition-all group-hover:border-transparent group-hover:bg-btn-main group-hover:text-white"><ArrowRight size={14} /></span>}
                  </span>
                </button>
              );
            })}

            {filteredMerchants.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <Building2 size={32} className="text-text-tertiary opacity-40" />
                <p className="mt-3 text-[14px] font-medium text-text-secondary">没有找到匹配的商家</p>
                <p className="mt-1 text-[13px] text-text-tertiary">可以更换关键词或在商家管理中检查状态</p>
              </div>
            ) : null}
          </div>

          <footer className="flex items-center justify-between border-t border-border-default bg-page-bg/45 px-8 py-3.5 text-[13px] text-text-tertiary">
            <span>新增、编辑和归档请前往“商家管理”</span>
            <span>当前：{projects[activeProjectId]?.name || "未选择"}</span>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
