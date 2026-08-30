import React, { useMemo, useState } from "react";
import {
  Archive,
  ArrowRight,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  ShieldCheck,
  Store,
  User,
  Users,
  X,
} from "lucide-react";
import { CreateMerchantModal } from "../merchant/CreateMerchantModal";

interface MerchantManagementProps {
  merchants: Record<string, any>;
  activeMerchantId: string;
  onAddMerchant: (merchant: any) => void;
  onUpdateMerchant: (merchantId: string, updates: Record<string, unknown>) => void;
  onArchiveMerchant: (merchantId: string) => void;
  onRestoreMerchant: (merchantId: string) => void;
  onSwitchMerchant: (merchantId: string) => void;
}

type MerchantFilter = "all" | "active" | "archived";

function getEmployeeFollowUrl(merchantId: string) {
  return `https://employee.taptik.cn/follow?merchantId=${encodeURIComponent(merchantId)}`;
}

export const MerchantManagement: React.FC<MerchantManagementProps> = ({
  merchants,
  activeMerchantId,
  onAddMerchant,
  onUpdateMerchant,
  onArchiveMerchant,
  onRestoreMerchant,
  onSwitchMerchant,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<MerchantFilter>("all");
  const [editingMerchant, setEditingMerchant] = useState<any | null>(null);
  const [qrMerchant, setQrMerchant] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const merchantList = useMemo(
    () => Object.values(merchants).filter((merchant: any) => merchant.id !== "new-merchant"),
    [merchants],
  );
  const activeCount = merchantList.filter((merchant: any) => merchant.status !== "archived").length;
  const archivedCount = merchantList.length - activeCount;
  const filteredMerchants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return merchantList.filter((merchant: any) => {
      if (filter === "active" && merchant.status === "archived") return false;
      if (filter === "archived" && merchant.status !== "archived") return false;
      const searchable = [merchant.name, merchant.username, merchant.phone, ...(merchant.tags || [])].filter(Boolean).join(" ").toLowerCase();
      return !query || searchable.includes(query);
    });
  }, [filter, merchantList, searchQuery]);

  const openEditor = (merchant: any) => {
    setEditingMerchant({
      id: merchant.id,
      name: merchant.name || "",
      username: merchant.username || merchant.owner?.username || "",
      phone: merchant.phone || merchant.owner?.phone || "",
      tags: (merchant.tags || []).join("、"),
    });
  };

  const saveMerchant = () => {
    if (!editingMerchant?.name.trim()) return;
    onUpdateMerchant(editingMerchant.id, {
      name: editingMerchant.name.trim(),
      username: editingMerchant.username.trim(),
      phone: editingMerchant.phone.trim(),
      tags: editingMerchant.tags.split(/[、,，]/).map((tag: string) => tag.trim()).filter(Boolean),
    });
    setEditingMerchant(null);
  };

  const copyFollowLink = async () => {
    if (!qrMerchant) return;
    try {
      await navigator.clipboard.writeText(getEmployeeFollowUrl(qrMerchant.id));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <h3 className="text-[16px] font-semibold text-text-main">商家管理</h3>
          <p className="mt-1 text-[13px] text-text-tertiary">集中新增、编辑和归档商家，并生成该商家专属的员工任务关注二维码。</p>
        </div>
        <button type="button" onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-btn-main px-4 py-2.5 text-[13px] font-medium text-white shadow-sm hover:bg-btn-main-hover">
          <Plus size={16} />新增商家
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 py-5">
        <label className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索商家名称、负责人或标签..." aria-label="搜索商家" className="h-10 w-full rounded-xl border border-border-default bg-page-bg pl-10 pr-4 text-[13px] outline-none focus:border-border-strong" />
        </label>
        <div className="flex items-center rounded-xl bg-page-bg p-1">
          {([
            ["all", `全部 ${merchantList.length}`],
            ["active", `运营中 ${activeCount}`],
            ["archived", `已归档 ${archivedCount}`],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setFilter(id)} className={`rounded-lg px-3 py-1.5 text-[13px] transition-colors ${filter === id ? "bg-surface-1 font-medium text-text-main shadow-sm" : "text-text-tertiary hover:text-text-secondary"}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-border-default bg-surface-1">
        <div className="grid grid-cols-12 gap-4 border-b border-border-default bg-page-bg/75 px-6 py-3.5 text-[13px] font-medium text-text-tertiary">
          <div className="col-span-4">商家信息</div>
          <div className="col-span-3">负责人</div>
          <div className="col-span-2">状态与起盘</div>
          <div className="col-span-3 text-right">管理操作</div>
        </div>
        <div className="h-full max-h-[calc(100vh-275px)] overflow-y-auto custom-scrollbar">
          {filteredMerchants.map((merchant: any) => {
            const isArchived = merchant.status === "archived";
            const isActive = merchant.id === activeMerchantId;
            const completeness = merchant.stats?.profileCompleteness ?? (merchant.isNew ? 20 : 100);
            return (
              <div key={merchant.id} className={`grid grid-cols-12 items-center gap-4 border-b border-border-subtle px-6 py-4 last:border-b-0 ${isActive ? "bg-brand-light/25" : "hover:bg-page-bg/70"}`}>
                <div className="col-span-4 flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-semibold" style={{ backgroundColor: merchant.color || "var(--surface-selected)", color: merchant.textColor || "var(--text-secondary)" }}>{merchant.initial || merchant.name?.charAt(0) || "商"}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><h4 className="truncate text-[14px] font-semibold text-text-main">{merchant.name}</h4>{isActive ? <span className="shrink-0 rounded-md bg-primary-100 px-1.5 py-0.5 text-[13px] font-medium text-brand-logo">当前空间</span> : null}</div>
                    <div className="mt-1 flex flex-wrap gap-1">{(merchant.tags || [merchant.industryProfile?.primaryName]).filter(Boolean).slice(0, 3).map((tag: string) => <span key={tag} className="rounded bg-hover-bg px-1.5 py-0.5 text-[13px] text-text-tertiary">{tag}</span>)}</div>
                  </div>
                </div>
                <div className="col-span-3 min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-[13px] text-text-secondary"><User size={14} className="shrink-0 text-text-tertiary" />{merchant.username || merchant.owner?.username || "待设置负责人"}</div>
                  <div className="mt-1 text-[13px] text-text-tertiary">{merchant.phone || merchant.owner?.phone || "暂无联系电话"}</div>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] ${isArchived ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>{isArchived ? <Archive size={12} /> : <ShieldCheck size={12} />}{isArchived ? "已归档" : "正常运营"}</span>
                  <div className="mt-1.5 text-[13px] text-text-tertiary">起盘完善度 {completeness}%</div>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1.5">
                  {!isArchived ? <button type="button" onClick={() => setQrMerchant(merchant)} title="员工端关注二维码" className="inline-flex h-8 items-center gap-1 rounded-lg border border-border-default px-2.5 text-[13px] text-text-secondary hover:bg-hover-bg"><QrCode size={14} />员工二维码</button> : null}
                  <button type="button" onClick={() => openEditor(merchant)} disabled={isArchived} title="编辑商家信息" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main disabled:opacity-30"><Edit3 size={14} /></button>
                  {isArchived ? (
                    <button type="button" onClick={() => onRestoreMerchant(merchant.id)} title="恢复商家" className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-50"><RotateCcw size={14} /></button>
                  ) : (
                    <button type="button" onClick={() => onArchiveMerchant(merchant.id)} disabled={isActive && activeCount <= 1} title="归档商家" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30"><Archive size={14} /></button>
                  )}
                  {!isArchived && !isActive ? <button type="button" onClick={() => onSwitchMerchant(merchant.id)} title="进入商家空间" className="flex h-8 w-8 items-center justify-center rounded-lg bg-btn-main text-white hover:bg-btn-main-hover"><ArrowRight size={14} /></button> : null}
                </div>
              </div>
            );
          })}
          {filteredMerchants.length === 0 ? <div className="flex min-h-[280px] flex-col items-center justify-center text-text-tertiary"><Store size={32} className="opacity-40" /><p className="mt-3 text-[14px]">没有找到匹配的商家</p></div> : null}
        </div>
      </div>

      <CreateMerchantModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={(merchant) => { onAddMerchant(merchant); setIsCreateModalOpen(false); }} />

      {editingMerchant ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-merchant-title">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
            <header className="flex items-center justify-between border-b border-border-default px-5 py-4"><div><h3 id="edit-merchant-title" className="text-[16px] font-semibold text-text-main">编辑商家信息</h3><p className="mt-1 text-[13px] text-text-tertiary">修改商家基础档案，不会改变已有方案和任务。</p></div><button type="button" onClick={() => setEditingMerchant(null)} aria-label="关闭编辑" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button></header>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="text-[13px] font-medium text-text-secondary">商家名称</span><input value={editingMerchant.name} onChange={(event) => setEditingMerchant((current: any) => ({ ...current, name: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" /></label>
              <label><span className="text-[13px] font-medium text-text-secondary">负责人账号</span><input value={editingMerchant.username} onChange={(event) => setEditingMerchant((current: any) => ({ ...current, username: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" /></label>
              <label><span className="text-[13px] font-medium text-text-secondary">联系电话</span><input value={editingMerchant.phone} onChange={(event) => setEditingMerchant((current: any) => ({ ...current, phone: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" /></label>
              <label className="sm:col-span-2"><span className="text-[13px] font-medium text-text-secondary">标签（用顿号分隔）</span><input value={editingMerchant.tags} onChange={(event) => setEditingMerchant((current: any) => ({ ...current, tags: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" /></label>
            </div>
            <footer className="flex justify-end gap-2 border-t border-border-default px-5 py-4"><button type="button" onClick={() => setEditingMerchant(null)} className="rounded-lg border border-border-default px-4 py-2 text-[13px] text-text-secondary hover:bg-hover-bg">取消</button><button type="button" onClick={saveMerchant} className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white">保存修改</button></footer>
          </div>
        </div>
      ) : null}

      {qrMerchant ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="merchant-qr-title">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
            <header className="flex items-start justify-between border-b border-border-default px-5 py-4"><div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand-logo"><QrCode size={17} /></span><h3 id="merchant-qr-title" className="text-[16px] font-semibold text-text-main">{qrMerchant.name} · 员工端关注二维码</h3></div><p className="mt-2 text-[13px] text-text-tertiary">员工扫码关注并绑定后，只接收该商家的素材与发布任务。</p></div><button type="button" onClick={() => setQrMerchant(null)} aria-label="关闭二维码" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button></header>
            <div className="grid gap-6 p-6 sm:grid-cols-[190px_1fr] sm:items-center">
              <div className="mx-auto rounded-2xl border border-border-default bg-white p-3 shadow-sm"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(getEmployeeFollowUrl(qrMerchant.id))}`} alt={`${qrMerchant.name}员工端关注二维码`} className="h-40 w-40" /></div>
              <div><div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-800"><ShieldCheck size={13} />商家专属绑定</div><ol className="mt-4 space-y-3 text-[13px] leading-5 text-text-secondary"><li className="flex gap-2"><span className="font-semibold text-text-main">1.</span>员工微信扫码，关注 TAPTIK 服务号。</li><li className="flex gap-2"><span className="font-semibold text-text-main">2.</span>确认加入“{qrMerchant.name}”员工任务空间。</li><li className="flex gap-2"><span className="font-semibold text-text-main">3.</span>绑定发布账号后，在员工 H5 接收并执行素材、发布任务。</li></ol><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={copyFollowLink} className="inline-flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "已复制" : "复制关注链接"}</button><a href={getEmployeeFollowUrl(qrMerchant.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-brand-logo hover:bg-brand-light"><ExternalLink size={14} />打开员工端</a></div></div>
            </div>
            <div className="flex items-start gap-2 border-t border-blue-100 bg-blue-50 px-5 py-3 text-[13px] leading-5 text-blue-900"><Users size={15} className="mt-0.5 shrink-0" /><span>该二维码用于建立“员工 ↔ 商家”关系；具体发布任务仍会按账号绑定和任务负责人单独派发。</span></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
