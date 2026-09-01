import React, { useMemo, useState } from "react";
import {
  Archive,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Lock,
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
import { buildIndustryProfile, getIndustryDefaults, INDUSTRY_CATALOG } from "../../data/industryCatalog";
import { getMerchantCompleteness, getMerchantCompletenessItems } from "../../utils/merchantCompleteness";
import { CreateMerchantModal } from "../merchant/CreateMerchantModal";
import {
  MerchantIndustrySelector,
  type MerchantIndustrySelection,
} from "../merchant/MerchantIndustrySelector";

interface MerchantManagementProps {
  merchants: Record<string, any>;
  activeMerchantId: string;
  onAddMerchant: (merchant: any) => void;
  onUpdateMerchant: (merchantId: string, updates: Record<string, unknown>) => void;
  onArchiveMerchant: (merchantId: string) => void;
  onRestoreMerchant: (merchantId: string) => void;
  onSwitchMerchant: (merchantId: string) => void;
  onOpenKnowledge?: () => void;
}

type MerchantFilter = "all" | "active" | "archived";

interface EditingMerchantForm extends MerchantIndustrySelection {
  id: string;
  name: string;
  username: string;
  phone: string;
  newPassword: string;
  confirmPassword: string;
}

function getMerchantIndustrySelection(merchant: any): MerchantIndustrySelection {
  const profile = merchant.industryProfile;
  if (profile?.primaryId && INDUSTRY_CATALOG.some((item) => item.id === profile.primaryId)) {
    return {
      primaryIndustryId: profile.primaryId,
      secondaryIndustryIds: [...(profile.secondaryIds || [])],
      tertiaryIndustryIds: [...(profile.tertiaryIds || [])],
    };
  }

  const names = new Set([
    merchant.industry,
    ...(merchant.tags || []),
  ].filter(Boolean).map((item: string) => item.trim().toLowerCase()));
  const matchesIndustryName = (candidate: string) => {
    const normalizedCandidate = candidate.trim().toLowerCase();
    const candidateParts = normalizedCandidate.split(/[\/|、]/).filter(Boolean);
    return Array.from(names).some((name) => (
      name === normalizedCandidate
      || name.includes(normalizedCandidate)
      || candidateParts.some((part) => name.includes(part))
    ));
  };
  const primaryIndustry = INDUSTRY_CATALOG.find((primary) =>
    matchesIndustryName(primary.name)
    || primary.children.some((secondary) =>
      matchesIndustryName(secondary.name)
      || secondary.children.some((tertiary) => matchesIndustryName(tertiary.name)),
    ),
  );

  if (!primaryIndustry) {
    return { primaryIndustryId: "", secondaryIndustryIds: [], tertiaryIndustryIds: [] };
  }

  const secondaryIndustryIds = primaryIndustry.children
    .filter((item) => matchesIndustryName(item.name))
    .map((item) => item.id);
  const tertiaryIndustryIds = primaryIndustry.children
    .flatMap((item) => item.children)
    .filter((item) => matchesIndustryName(item.name))
    .map((item) => item.id);

  return {
    primaryIndustryId: primaryIndustry.id,
    secondaryIndustryIds,
    tertiaryIndustryIds,
  };
}

function getMerchantIndustryNames(merchant: any) {
  const profile = merchant.industryProfile;
  if (profile?.primaryName) {
    return [
      profile.primaryName,
      ...(profile.secondaryNames || []),
      ...(profile.tertiaryNames || []),
    ];
  }
  return [merchant.industry, ...(merchant.tags || [])].filter(Boolean);
}

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
  onOpenKnowledge,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<MerchantFilter>("all");
  const [editingMerchant, setEditingMerchant] = useState<EditingMerchantForm | null>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editValidationMessage, setEditValidationMessage] = useState("");
  const [qrMerchant, setQrMerchant] = useState<any | null>(null);
  const [detailMerchantId, setDetailMerchantId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const merchantList = useMemo(
    () => Object.values(merchants).filter((merchant: any) => merchant.id !== "new-merchant"),
    [merchants],
  );
  const activeCount = merchantList.filter((merchant: any) => merchant.status !== "archived").length;
  const archivedCount = merchantList.length - activeCount;
  const detailMerchant = detailMerchantId ? merchants[detailMerchantId] || null : null;
  const detailCompletenessItems = detailMerchant ? getMerchantCompletenessItems(detailMerchant) : [];
  const detailCompleteness = detailMerchant ? getMerchantCompleteness(detailMerchant) : 0;
  const filteredMerchants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return merchantList.filter((merchant: any) => {
      if (filter === "active" && merchant.status === "archived") return false;
      if (filter === "archived" && merchant.status !== "archived") return false;
      const searchable = [
        merchant.name,
        merchant.username,
        merchant.phone,
        ...getMerchantIndustryNames(merchant),
      ].filter(Boolean).join(" ").toLowerCase();
      return !query || searchable.includes(query);
    });
  }, [filter, merchantList, searchQuery]);

  const openEditor = (merchant: any) => {
    const industrySelection = getMerchantIndustrySelection(merchant);
    setEditingMerchant({
      id: merchant.id,
      name: merchant.name || "",
      username: merchant.username || merchant.owner?.username || "",
      phone: merchant.phone || merchant.owner?.phone || "",
      newPassword: "",
      confirmPassword: "",
      ...industrySelection,
    });
    setShowEditPassword(false);
    setEditValidationMessage("");
  };

  const saveMerchant = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingMerchant) return;
    if (!editingMerchant.name.trim() || !editingMerchant.username.trim() || !editingMerchant.phone.trim()) {
      setEditValidationMessage("请完整填写商家名称、负责人用户名和手机号码。");
      return;
    }
    if (editingMerchant.newPassword && editingMerchant.newPassword.length < 8) {
      setEditValidationMessage("新密码不能少于 8 位字符。");
      return;
    }
    if (editingMerchant.newPassword !== editingMerchant.confirmPassword) {
      setEditValidationMessage("两次输入的新密码不一致。");
      return;
    }
    const industryProfile = buildIndustryProfile(
      editingMerchant.primaryIndustryId,
      editingMerchant.secondaryIndustryIds,
      editingMerchant.tertiaryIndustryIds,
    );
    if (!industryProfile) {
      setEditValidationMessage("请选择商家的一级行业。");
      return;
    }

    const updates: Record<string, unknown> = {
      name: editingMerchant.name.trim(),
      username: editingMerchant.username.trim(),
      phone: editingMerchant.phone.trim(),
      industry: industryProfile.primaryName,
      industryProfile,
      industryDefaults: getIndustryDefaults(industryProfile.primaryId),
      tags: [
        industryProfile.primaryName,
        ...industryProfile.secondaryNames,
        ...industryProfile.tertiaryNames,
      ].slice(0, 4),
    };
    if (editingMerchant.newPassword) {
      updates.passwordConfigured = true;
      updates.passwordUpdatedAt = new Date().toISOString();
    }
    onUpdateMerchant(editingMerchant.id, updates);
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
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索商家名称、负责人或行业..." aria-label="搜索商家" className="h-10 w-full rounded-xl border border-border-default bg-page-bg pl-10 pr-4 text-[13px] outline-none focus:border-border-strong" />
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
          <div className="col-span-2">状态与信息</div>
          <div className="col-span-3 text-right">管理操作</div>
        </div>
        <div className="h-full max-h-[calc(100vh-275px)] overflow-y-auto custom-scrollbar">
          {filteredMerchants.map((merchant: any) => {
            const isArchived = merchant.status === "archived";
            const isActive = merchant.id === activeMerchantId;
            const completeness = getMerchantCompleteness(merchant);
            return (
              <div key={merchant.id} className={`group relative grid grid-cols-12 items-center gap-4 border-b border-border-subtle px-6 py-4 last:border-b-0 ${isActive ? "bg-brand-light/25" : "hover:bg-page-bg/70"}`}>
                <button type="button" onClick={() => setDetailMerchantId(merchant.id)} aria-label={`查看${merchant.name}信息完整度详情`} className="absolute inset-0 z-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-logo" />
                <div className="pointer-events-none relative z-10 col-span-4 flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-semibold" style={{ backgroundColor: merchant.color || "var(--surface-selected)", color: merchant.textColor || "var(--text-secondary)" }}>{merchant.initial || merchant.name?.charAt(0) || "商"}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><h4 className="truncate text-[14px] font-semibold text-text-main">{merchant.name}</h4>{isActive ? <span className="shrink-0 rounded-md bg-primary-100 px-1.5 py-0.5 text-[13px] font-medium text-brand-logo">当前空间</span> : null}</div>
                    <div className="mt-1 flex flex-wrap gap-1">{getMerchantIndustryNames(merchant).slice(0, 3).map((industryName: string) => <span key={industryName} className="rounded bg-hover-bg px-1.5 py-0.5 text-[13px] text-text-tertiary">{industryName}</span>)}</div>
                  </div>
                </div>
                <div className="pointer-events-none relative z-10 col-span-3 min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-[13px] text-text-secondary"><User size={14} className="shrink-0 text-text-tertiary" />{merchant.username || merchant.owner?.username || "待设置负责人"}</div>
                  <div className="mt-1 text-[13px] text-text-tertiary">{merchant.phone || merchant.owner?.phone || "暂无联系电话"}</div>
                </div>
                <div className="pointer-events-none relative z-10 col-span-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] ${isArchived ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>{isArchived ? <Archive size={12} /> : <ShieldCheck size={12} />}{isArchived ? "已归档" : "正常运营"}</span>
                  <div className="mt-1.5 text-[13px] text-text-tertiary">商家信息完善度 {completeness}%</div>
                </div>
                <div className="relative z-20 col-span-3 flex items-center justify-end gap-1.5">
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

      {detailMerchant ? (
        <div className="fixed inset-0 z-[1150] flex justify-end bg-black/25" onClick={() => setDetailMerchantId(null)}>
          <aside className="flex h-full w-[680px] max-w-[94vw] flex-col bg-surface-1 shadow-2xl" onClick={(event) => event.stopPropagation()} aria-label={`${detailMerchant.name}信息完整度详情`}>
            <header className="border-b border-border-default px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-semibold" style={{ backgroundColor: detailMerchant.color || "var(--surface-selected)", color: detailMerchant.textColor || "var(--text-secondary)" }}>{detailMerchant.initial || detailMerchant.name?.charAt(0) || "商"}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-[17px] font-semibold text-text-main">{detailMerchant.name}</h3>{detailMerchant.id === activeMerchantId ? <span className="rounded-full bg-brand-light px-2 py-0.5 text-[12px] font-medium text-brand-logo">当前空间</span> : null}</div>
                    <p className="mt-1 text-[13px] text-text-tertiary">商家信息完整度与待补充项</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {detailMerchant.status !== "archived" ? <button type="button" onClick={() => openEditor(detailMerchant)} className="inline-flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><Edit3 size={14} />编辑商家信息</button> : null}
                  <button type="button" onClick={() => setDetailMerchantId(null)} aria-label="关闭信息完整度详情" className="rounded-lg p-2 text-text-tertiary hover:bg-hover-bg hover:text-text-main"><X size={17} /></button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-page-bg p-6 custom-scrollbar">
              <section className="rounded-2xl border border-border-default bg-surface-1 p-5 shadow-sm">
                <div className="flex items-end justify-between gap-4">
                  <div><div className="text-[13px] font-medium text-text-secondary">商家信息完善度</div><p className="mt-1 text-[12px] text-text-tertiary">完整资料会用于匹配行业方案、生成内容和任务分发。</p></div>
                  <strong className="text-[30px] font-semibold tabular-nums text-text-main">{detailCompleteness}%</strong>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-surface-selected"><div className="h-full rounded-full bg-brand-logo transition-all" style={{ width: `${detailCompleteness}%` }} /></div>
                <div className="mt-3 flex items-center justify-between text-[12px] text-text-tertiary"><span>{detailCompletenessItems.filter((item) => item.complete).length}/{detailCompletenessItems.length} 项已完成</span><span>{detailCompleteness === 100 ? "资料已完整" : "建议优先补齐必要信息"}</span></div>
              </section>

              <section className="mt-4 overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-sm">
                {detailCompletenessItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 border-b border-border-subtle px-5 py-4 last:border-b-0">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.complete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.complete ? <CheckCircle2 size={16} /> : <CircleAlert size={16} />}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><h4 className="text-[13px] font-semibold text-text-main">{item.label}</h4><span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${item.complete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{item.complete ? "已完成" : `待补充 · ${item.weight}%`}</span></div>
                      <p className="mt-1 text-[13px] leading-5 text-text-tertiary">{item.description}</p>
                    </div>
                    {!item.complete ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (item.action === "knowledge" && onOpenKnowledge) {
                            setDetailMerchantId(null);
                            onOpenKnowledge();
                            return;
                          }
                          openEditor(detailMerchant);
                        }}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-brand-logo hover:bg-brand-light"
                      >
                        {item.action === "knowledge" ? <BookOpen size={14} /> : <Edit3 size={14} />}
                        {item.action === "knowledge" ? "链接知识资料" : "立即补充"}<ChevronRight size={13} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </section>

              {detailCompletenessItems.some((item) => !item.complete && item.action === "knowledge") ? (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-2.5"><BookOpen size={17} className="mt-0.5 shrink-0 text-blue-700" /><div><div className="text-[13px] font-semibold text-blue-950">本地知识资料是生成准确内容的必要条件</div><p className="mt-1 text-[13px] leading-5 text-blue-900/75">TAPTIK 会调用当前电脑中已链接的产品资料、FAQ 和品牌约束，无需先上传到云端。</p></div></div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}

      <CreateMerchantModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={(merchant) => { onAddMerchant(merchant); setIsCreateModalOpen(false); }} />

      {editingMerchant ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-merchant-title">
          <form onSubmit={saveMerchant} className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
            <header className="flex items-start justify-between border-b border-border-default px-6 py-5">
              <div>
                <h3 id="edit-merchant-title" className="text-[17px] font-semibold text-text-main">编辑商家信息</h3>
                <p className="mt-1 text-[13px] text-text-tertiary">编辑创建商家时填写的账号与行业信息，不会改变已有方案和任务。</p>
              </div>
              <button type="button" onClick={() => setEditingMerchant(null)} aria-label="关闭编辑" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-[13px] font-medium text-text-secondary">商家名称</span>
                  <input required value={editingMerchant.name} onChange={(event) => setEditingMerchant((current) => current ? { ...current, name: event.target.value } : current)} className="h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[13px] font-medium text-text-secondary">负责人用户名</span>
                  <input required value={editingMerchant.username} onChange={(event) => setEditingMerchant((current) => current ? { ...current, username: event.target.value } : current)} placeholder="用于登录的用户名" className="h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-[13px] font-medium text-text-secondary">手机号码</span>
                  <input required type="tel" value={editingMerchant.phone} onChange={(event) => setEditingMerchant((current) => current ? { ...current, phone: event.target.value } : current)} placeholder="11位手机号码" className="h-10 w-full rounded-lg border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" />
                </label>
              </div>

              <section className="rounded-xl border border-border-default bg-page-bg/70 p-4">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-1 text-text-secondary"><Lock size={15} /></span>
                  <div>
                    <div className="text-[13px] font-semibold text-text-main">修改登录密码 <span className="font-normal text-text-tertiary">· 选填</span></div>
                    <p className="mt-0.5 text-[13px] text-text-tertiary">如无需修改请留空；填写并保存后，旧密码将失效。</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-[13px] text-text-secondary">新密码</span>
                    <div className="relative">
                      <input minLength={8} autoComplete="new-password" type={showEditPassword ? "text" : "password"} value={editingMerchant.newPassword} onChange={(event) => setEditingMerchant((current) => current ? { ...current, newPassword: event.target.value } : current)} placeholder="不少于8位字符" className="h-10 w-full rounded-lg border border-border-default bg-surface-1 px-3 pr-10 text-[13px] outline-none focus:border-border-strong" />
                      <button type="button" onClick={() => setShowEditPassword((visible) => !visible)} aria-label={showEditPassword ? "隐藏新密码" : "显示新密码"} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">{showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[13px] text-text-secondary">确认新密码</span>
                    <div className="relative">
                      <input minLength={8} autoComplete="new-password" type={showEditPassword ? "text" : "password"} value={editingMerchant.confirmPassword} onChange={(event) => setEditingMerchant((current) => current ? { ...current, confirmPassword: event.target.value } : current)} placeholder="再次输入新密码" className="h-10 w-full rounded-lg border border-border-default bg-surface-1 px-3 pr-10 text-[13px] outline-none focus:border-border-strong" />
                      <button type="button" onClick={() => setShowEditPassword((visible) => !visible)} aria-label={showEditPassword ? "隐藏确认密码" : "显示确认密码"} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">{showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>
                  </label>
                </div>
              </section>

              <MerchantIndustrySelector
                primaryIndustryId={editingMerchant.primaryIndustryId}
                secondaryIndustryIds={editingMerchant.secondaryIndustryIds}
                tertiaryIndustryIds={editingMerchant.tertiaryIndustryIds}
                onChange={(selection) => setEditingMerchant((current) => current ? { ...current, ...selection } : current)}
              />

              {editValidationMessage ? <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{editValidationMessage}</p> : null}
            </div>

            <footer className="flex justify-end gap-2 border-t border-border-default px-6 py-4">
              <button type="button" onClick={() => setEditingMerchant(null)} className="rounded-lg border border-border-default px-4 py-2 text-[13px] text-text-secondary hover:bg-hover-bg">取消</button>
              <button type="submit" className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover">保存修改</button>
            </footer>
          </form>
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
