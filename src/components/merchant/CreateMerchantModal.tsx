import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Download, Eye, EyeOff, Lock, Phone, QrCode, Store, User, X } from "lucide-react";
import { buildIndustryProfile, getIndustryDefaults } from "../../data/industryCatalog";
import {
  MerchantIndustrySelector,
  type MerchantIndustrySelection,
} from "./MerchantIndustrySelector";

interface CreateMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (merchantData?: any) => void;
}

export const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "qr">("manual");
  const [formData, setFormData] = useState({ merchantName: "", username: "", phone: "", password: "" });
  const [industrySelection, setIndustrySelection] = useState<MerchantIndustrySelection>({
    primaryIndustryId: "",
    secondaryIndustryIds: [],
    tertiaryIndustryIds: [],
  });

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const industryProfile = buildIndustryProfile(
      industrySelection.primaryIndustryId,
      industrySelection.secondaryIndustryIds,
      industrySelection.tertiaryIndustryIds,
    );
    if (!industryProfile) return;
    const newId = `project-${Date.now()}`;
    const newMerchant = {
      id: newId,
      name: formData.merchantName || "新创建商家",
      initial: (formData.merchantName || "商").charAt(0),
      color: "var(--primary-50)",
      textColor: "var(--primary-600)",
      tags: [industryProfile.primaryName, ...industryProfile.secondaryNames, ...industryProfile.tertiaryNames].slice(0, 4),
      industry: industryProfile.primaryName,
      industryProfile,
      industryDefaults: getIndustryDefaults(industrySelection.primaryIndustryId),
      username: formData.username.trim(),
      phone: formData.phone.trim(),
      passwordConfigured: true,
      passwordUpdatedAt: new Date().toISOString(),
      isNew: true,
      onboardingStatus: "new",
      createdAt: new Date().toISOString(),
      status: "active",
      stats: { pendingLeads: 0, pendingContent: 0, profileCompleteness: 45 },
      fileTree: [],
      chatHistory: []
    };
    onSuccess?.(newMerchant);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-btn-main/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }} className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="create-merchant-title">
          <header className="flex items-start justify-between border-b border-border-default px-6 py-5"><div><h2 id="create-merchant-title" className="text-[19px] font-semibold text-text-main">新增商家</h2><p className="mt-1 text-[13px] text-text-tertiary">创建商家账号并初始化对应行业的运营工作流</p></div><button type="button" onClick={onClose} aria-label="关闭新增商家" className="flex h-8 w-8 items-center justify-center rounded-full bg-hover-bg text-text-tertiary hover:text-text-secondary"><X size={16} /></button></header>
          <div className="px-6 pt-4"><div className="flex rounded-xl bg-hover-bg p-1"><button type="button" onClick={() => setActiveTab("manual")} className={`flex-1 rounded-lg py-2 text-[13px] ${activeTab === "manual" ? "bg-surface-1 text-text-main shadow-sm" : "text-text-tertiary"}`}>手动填写</button><button type="button" onClick={() => setActiveTab("qr")} className={`flex-1 rounded-lg py-2 text-[13px] ${activeTab === "qr" ? "bg-surface-1 text-text-main shadow-sm" : "text-text-tertiary"}`}>分享二维码</button></div></div>

          {activeTab === "manual" ? <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5"><span className="ml-1 text-[13px] text-text-secondary">商家名称</span><div className="relative"><Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" /><input required value={formData.merchantName} onChange={event => setFormData({ ...formData, merchantName: event.target.value })} placeholder="例如：宠物食品官方旗舰店" className="h-10 w-full rounded-xl border border-border-default bg-page-bg pl-10 pr-3 text-[13px] outline-none focus:border-border-strong" /></div></label>
              <label className="space-y-1.5"><span className="ml-1 text-[13px] text-text-secondary">负责人用户名</span><div className="relative"><User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" /><input required value={formData.username} onChange={event => setFormData({ ...formData, username: event.target.value })} placeholder="用于登录的用户名" className="h-10 w-full rounded-xl border border-border-default bg-page-bg pl-10 pr-3 text-[13px] outline-none focus:border-border-strong" /></div></label>
              <label className="space-y-1.5"><span className="ml-1 text-[13px] text-text-secondary">手机号码</span><div className="relative"><Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" /><input required type="tel" value={formData.phone} onChange={event => setFormData({ ...formData, phone: event.target.value })} placeholder="11位手机号码" className="h-10 w-full rounded-xl border border-border-default bg-page-bg pl-10 pr-3 text-[13px] outline-none focus:border-border-strong" /></div></label>
              <label className="space-y-1.5"><span className="ml-1 text-[13px] text-text-secondary">登录密码</span><div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" /><input required minLength={8} autoComplete="new-password" type={showPassword ? "text" : "password"} value={formData.password} onChange={event => setFormData({ ...formData, password: event.target.value })} placeholder="不少于8位字符" className="h-10 w-full rounded-xl border border-border-default bg-page-bg pl-10 pr-10 text-[13px] outline-none focus:border-border-strong" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "隐藏登录密码" : "显示登录密码"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>
            </div>
            <MerchantIndustrySelector {...industrySelection} onChange={setIndustrySelection} showRecommendation />
            <div className="flex justify-end gap-2 border-t border-border-default pt-4"><button type="button" onClick={onClose} className="rounded-xl bg-hover-bg px-5 py-2.5 text-[13px] text-text-secondary">取消</button><button type="submit" disabled={!industrySelection.primaryIndustryId} className="rounded-xl bg-btn-main px-6 py-2.5 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-35">确认新增</button></div>
          </form> : <div className="flex-1 space-y-4 overflow-y-auto p-6 pt-4"><MerchantIndustrySelector {...industrySelection} onChange={setIndustrySelection} showRecommendation /><div className="flex flex-col items-center rounded-xl border border-border-default p-5"><div className="flex h-40 w-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-default bg-page-bg text-text-tertiary"><QrCode size={44} className="mb-2 text-neutral-300" /><span className="text-center text-[13px]">选择一级行业后<br />生成专属邀请二维码</span></div><div className="mt-4 flex w-full max-w-md gap-2"><div className="flex h-10 flex-1 items-center overflow-hidden rounded-xl border border-border-default bg-page-bg px-3 font-mono text-[13px] text-text-tertiary">https://taptik.com/invite/m/E28A9F</div><button disabled={!industrySelection.primaryIndustryId} className="flex items-center gap-1.5 rounded-xl bg-btn-main px-4 text-[13px] text-white disabled:opacity-35"><Copy size={13} />复制</button><button disabled={!industrySelection.primaryIndustryId} className="flex items-center gap-1.5 rounded-xl border border-border-default px-4 text-[13px] text-text-secondary disabled:opacity-35"><Download size={13} />保存</button></div></div></div>}
        </motion.div>
      </div>}
    </AnimatePresence>
  );
};
