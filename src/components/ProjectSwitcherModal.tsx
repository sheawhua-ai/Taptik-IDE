import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Building2, Check, FolderKanban, Search, Settings2, X } from "lucide-react";

interface ProjectSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Record<string, any>;
  activeProjectId: string;
  onSelect: (id: string) => void;
  onManageMerchants?: () => void;
}

export const ProjectSwitcherModal: React.FC<ProjectSwitcherModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelect,
  onManageMerchants,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const activeMerchants = useMemo(
    () => Object.values(projects).filter(
      (merchant: any) => merchant.id !== "new-merchant" && merchant.status !== "archived",
    ),
    [projects],
  );
  const filteredMerchants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeMerchants;
    return activeMerchants.filter((merchant: any) => [
      merchant.name,
      merchant.industryProfile?.primaryName,
      ...(merchant.tags || []),
    ].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [activeMerchants, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-start justify-center bg-btn-main/35 p-4 pt-[9vh] backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[78vh] w-full max-w-3xl flex-col overflow-hidden rounded-[22px] border border-border-default bg-surface-1 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="merchant-switcher-title"
        >
          <header className="border-b border-border-default bg-page-bg/40 px-7 pb-5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-btn-main text-white shadow-sm"><Building2 size={19} /></span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="merchant-switcher-title" className="text-[18px] font-semibold text-text-main">切换商家空间</h2>
                    <span className="rounded-full border border-border-default bg-surface-1 px-2 py-0.5 text-[13px] text-text-secondary">{activeMerchants.length} 个空间</span>
                  </div>
                  <p className="mt-1 text-[13px] text-text-tertiary">仅用于快速切换商家的方案、素材、知识、账号和执行空间</p>
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label="关闭商家切换" className="flex h-9 w-9 items-center justify-center rounded-xl bg-hover-bg text-text-secondary hover:bg-selected-bg"><X size={17} /></button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <label className="relative min-w-0 flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索商家名称、行业或标签..." aria-label="搜索商家空间" className="h-10 w-full rounded-xl border border-border-default bg-surface-1 pl-10 pr-9 text-[13px] outline-none transition-colors focus:border-border-strong" />
                {searchQuery ? <button type="button" onClick={() => setSearchQuery("")} aria-label="清空搜索" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-main"><X size={14} /></button> : null}
              </label>
              {onManageMerchants ? (
                <button type="button" onClick={onManageMerchants} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border-default bg-surface-1 px-3.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><Settings2 size={15} />商家管理</button>
              ) : null}
            </div>
          </header>

          <div className="min-h-[260px] flex-1 overflow-y-auto p-3 custom-scrollbar">
            {filteredMerchants.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredMerchants.map((merchant: any) => {
                  const isActive = merchant.id === activeProjectId;
                  const industry = merchant.industryProfile?.primaryName || merchant.tags?.[0] || "未设置行业";
                  return (
                    <button key={merchant.id} type="button" onClick={() => onSelect(merchant.id)} className={`group flex min-h-[112px] items-start gap-3 rounded-2xl border p-4 text-left transition-all ${isActive ? "border-brand-logo/35 bg-brand-light/45 shadow-sm" : "border-border-default bg-surface-1 hover:border-border-strong hover:bg-page-bg"}`}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-semibold" style={{ backgroundColor: merchant.color || "var(--surface-selected)", color: merchant.textColor || "var(--text-secondary)" }}>{merchant.initial || merchant.name?.charAt(0) || "商"}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <strong className="truncate text-[14px] font-semibold text-text-main">{merchant.name}</strong>
                          {isActive ? <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-brand-logo"><Check size={13} />当前</span> : <ArrowRight size={15} className="shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5" />}
                        </span>
                        <span className="mt-1 block text-[13px] text-text-tertiary">{industry}</span>
                        <span className="mt-2 flex items-center gap-1.5 text-[13px] text-text-secondary"><FolderKanban size={13} className="text-text-tertiary" />进入该商家的独立项目空间</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <Building2 size={32} className="text-text-tertiary opacity-50" />
                <p className="mt-3 text-[14px] font-medium text-text-secondary">没有找到可切换的商家空间</p>
                <p className="mt-1 text-[13px] text-text-tertiary">新建、编辑和恢复商家请前往“商家管理”</p>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between border-t border-border-default bg-page-bg/50 px-7 py-3.5 text-[13px] text-text-tertiary">
            <span>归档商家不会出现在快捷切换中</span>
            <span>当前：{projects[activeProjectId]?.name || "未选择"}</span>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
