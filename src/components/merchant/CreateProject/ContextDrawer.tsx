import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Check,
  Building2,
  Package,
  Users,
  BookOpen,
  History,
  ShieldAlert,
  Info
} from "lucide-react";

export interface ContextMerchant {
  id: string;
  name: string;
  category: string;
  included: boolean;
}

export interface ContextProduct {
  id: string;
  name: string;
  specs: string;
  isMain: boolean;
  included: boolean;
}

export interface ContextAccount {
  id: string;
  name: string;
  type: "品牌主号" | "店长号/KOS" | "合作KOC";
  fans: string;
  included: boolean;
}

export interface ContextDoc {
  id: string;
  title: string;
  type: string;
  updatedAt: string;
  included: boolean;
}

export interface ContextHistory {
  id: string;
  title: string;
  period: string;
  result: string;
  included: boolean;
}

export interface ContextState {
  merchant: ContextMerchant;
  products: ContextProduct[];
  accounts: ContextAccount[];
  docs: ContextDoc[];
  historyProjects: ContextHistory[];
}

export const DEFAULT_CONTEXT_STATE: ContextState = {
  merchant: {
    id: "m_1",
    name: "萌宠乐园官方旗舰店",
    category: "宠物食品 / 幼犬专属营养",
    included: true
  },
  products: [
    { id: "p_1", name: "幼犬无谷高蛋白鲜肉全价粮", specs: "2kg/袋 · 鲜鸡肉配方", isMain: true, included: true },
    { id: "p_2", name: "幼犬肠胃益生菌冻干伴侣", specs: "100g/罐 · 辅助换粮调理", isMain: false, included: true },
  ],
  accounts: [
    { id: "acc_1", name: "特唯普宠物官方旗舰店", type: "品牌主号", fans: "12.8w", included: true },
    { id: "acc_2", name: "特唯普品牌官方号", type: "品牌主号", fans: "5.4w", included: true },
    { id: "acc_3", name: "店长号_陆家嘴旗舰店", type: "店长号/KOS", fans: "8,900", included: true },
    { id: "acc_4", name: "店长号_徐家汇概念店", type: "店长号/KOS", fans: "6,200", included: true },
    { id: "acc_5", name: "店长号_朝阳大悦城店", type: "店长号/KOS", fans: "5,100", included: true },
  ],
  docs: [
    { id: "doc_1", title: "幼犬科学换粮7天过渡法与排便对照指南.pdf", type: "专业知识", updatedAt: "2026-08-10", included: true },
    { id: "doc_2", title: "无谷高蛋白鲜肉粮SGS权威质检报告.pdf", type: "质检证明", updatedAt: "2026-07-28", included: true },
    { id: "doc_3", title: "特唯普品牌人设与小红书违禁词自审规范.docx", type: "规范文档", updatedAt: "2026-08-01", included: true },
    { id: "doc_4", title: "宠物营养学顾问常见问答库(FAQ).xlsx", type: "问答库", updatedAt: "2026-08-15", included: true },
    { id: "doc_5", title: "门店顾客进店领样及核销操作标准流程.pdf", type: "业务手册", updatedAt: "2026-07-15", included: true },
    { id: "doc_6", title: "2026宠物主换粮痛点与搜索意图洞察报告.pdf", type: "行业分析", updatedAt: "2026-08-05", included: true },
    { id: "doc_7", title: "幼犬软便拉稀应急处理与食谱调配方案.pdf", type: "专业知识", updatedAt: "2026-06-20", included: true },
    { id: "doc_8", title: "线下门店顾问日常笔记发布与互动指导.pdf", type: "运营规范", updatedAt: "2026-08-12", included: true },
    { id: "doc_9", title: "特唯普产品核心成分无谷低敏背书资料.pdf", type: "产品知识", updatedAt: "2026-07-10", included: true },
    { id: "doc_10", title: "竞品对比分析表(适口性/粗蛋白/性价比).xlsx", type: "竞品分析", updatedAt: "2026-08-02", included: true },
    { id: "doc_11", title: "KOC真实测评拍照取景与内容发布要求.pdf", type: "物料规范", updatedAt: "2026-07-30", included: true },
    { id: "doc_12", title: "常见换粮疑问店长一对一话术库.pdf", type: "话术库", updatedAt: "2026-08-18", included: true },
  ],
  historyProjects: [
    { id: "h_1", title: "幼犬软便调理搜索卡位项目（7月）", period: "14天", result: "爆文率 18.5%，搜索排名 Top3", included: true },
    { id: "h_2", title: "成犬冻干主粮春季上新矩阵测试", period: "30天", result: "累计带来 420+ 私信咨询", included: true },
    { id: "h_3", title: "线下门店店长号同城引流试验期", period: "7天", result: "完成 5 家门店客资承接闭环", included: true },
  ]
};

interface ContextDrawerProps {
  contextState: ContextState;
  onSave: (updated: ContextState) => void;
  onClose: () => void;
}

export function ContextDrawer({ contextState, onSave, onClose }: ContextDrawerProps) {
  const [localState, setLocalState] = useState<ContextState>(JSON.parse(JSON.stringify(contextState)));
  const [activeTab, setActiveTab] = useState<"all" | "products" | "accounts" | "docs" | "history">("all");

  const toggleProduct = (id: string) => {
    setLocalState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, included: !p.included } : p)
    }));
  };

  const toggleAccount = (id: string) => {
    setLocalState(prev => ({
      ...prev,
      accounts: prev.accounts.map(a => a.id === id ? { ...a, included: !a.included } : a)
    }));
  };

  const toggleDoc = (id: string) => {
    setLocalState(prev => ({
      ...prev,
      docs: prev.docs.map(d => d.id === id ? { ...d, included: !d.included } : d)
    }));
  };

  const toggleHistory = (id: string) => {
    setLocalState(prev => ({
      ...prev,
      historyProjects: prev.historyProjects.map(h => h.id === id ? { ...h, included: !h.included } : h)
    }));
  };

  const includedProducts = localState.products.filter(p => p.included).length;
  const includedAccounts = localState.accounts.filter(a => a.included).length;
  const includedDocs = localState.docs.filter(d => d.included).length;
  const includedHistory = localState.historyProjects.filter(h => h.included).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/30 z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-white shadow-2xl z-50 flex flex-col border-l border-border-default"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default bg-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-text-primary">
              AI 携带的上下文资料
            </h2>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              可勾选或排除特定资料，AI 生成方案时将仅引用已包含的背景上下文
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Overview Stats Line */}
        <div className="px-5 py-3 bg-surface-subtle border-b border-border-default flex items-center justify-between text-[12px]">
          <span className="text-text-secondary font-medium">当前将携带：</span>
          <div className="flex items-center gap-2 text-text-primary font-medium">
            <span className="px-2 py-0.5 bg-white border border-border-default rounded">1 个商家</span>
            <span className="px-2 py-0.5 bg-white border border-border-default rounded">{includedProducts} 个产品</span>
            <span className="px-2 py-0.5 bg-white border border-border-default rounded">{includedAccounts} 个账号</span>
            <span className="px-2 py-0.5 bg-white border border-border-default rounded">{includedDocs} 份资料</span>
            <span className="px-2 py-0.5 bg-white border border-border-default rounded">{includedHistory} 个历史项目</span>
          </div>
        </div>

        {/* Content Scroll List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-[13px]">
          {/* Section 1: 商家主体 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-text-primary text-[13px]">
              <span className="flex items-center gap-1.5">
                <Building2 size={15} className="text-text-secondary" />
                当前商家
              </span>
              <span className="text-[11px] font-normal text-text-tertiary">默认全局带入</span>
            </div>
            <div className="p-3.5 bg-surface-subtle border border-border-default rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">{localState.merchant.name}</div>
                <div className="text-[12px] text-text-secondary mt-0.5">{localState.merchant.category}</div>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                已带入
              </span>
            </div>
          </div>

          {/* Section 2: 产品库 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-text-primary text-[13px]">
              <span className="flex items-center gap-1.5">
                <Package size={15} className="text-text-secondary" />
                关联产品 ({includedProducts}/{localState.products.length})
              </span>
            </div>
            <div className="space-y-2">
              {localState.products.map(p => (
                <label
                  key={p.id}
                  className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    p.included ? "bg-white border-border-default hover:border-neutral-400" : "bg-surface-subtle/70 border-border-subtle opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={p.included}
                      onChange={() => toggleProduct(p.id)}
                      className="w-4 h-4 mt-0.5 accent-action-primary rounded cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-text-primary flex items-center gap-1.5">
                        {p.name}
                        {p.isMain && (
                          <span className="text-[10.5px] font-normal px-1.5 py-0.2 bg-neutral-100 text-text-secondary border border-neutral-200 rounded">
                            主推
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-text-tertiary mt-0.5">{p.specs}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    p.included ? "bg-neutral-100 text-text-secondary" : "text-text-disabled"
                  }`}>
                    {p.included ? "已包含" : "已排除"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: 账号资源 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-text-primary text-[13px]">
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-text-secondary" />
                可用账号资源 ({includedAccounts}/{localState.accounts.length})
              </span>
            </div>
            <div className="space-y-2">
              {localState.accounts.map(acc => (
                <label
                  key={acc.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    acc.included ? "bg-white border-border-default hover:border-neutral-400" : "bg-surface-subtle/70 border-border-subtle opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={acc.included}
                      onChange={() => toggleAccount(acc.id)}
                      className="w-4 h-4 accent-action-primary rounded cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{acc.name}</div>
                      <div className="text-[11.5px] text-text-tertiary mt-0.2">
                        {acc.type} · 粉丝 {acc.fans}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    acc.included ? "bg-neutral-100 text-text-secondary" : "text-text-disabled"
                  }`}>
                    {acc.included ? "已包含" : "已排除"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: 知识资料 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-text-primary text-[13px]">
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-text-secondary" />
                知识与规范资料 ({includedDocs}/{localState.docs.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {localState.docs.map(doc => (
                <label
                  key={doc.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-[12px] cursor-pointer transition-colors ${
                    doc.included ? "bg-white border-border-default hover:border-neutral-400" : "bg-surface-subtle/70 border-border-subtle opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={doc.included}
                      onChange={() => toggleDoc(doc.id)}
                      className="w-3.5 h-3.5 accent-action-primary rounded cursor-pointer shrink-0"
                    />
                    <span className="font-medium text-text-primary truncate">{doc.title}</span>
                  </div>
                  <span className="text-[11px] text-text-tertiary shrink-0">{doc.type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 5: 历史项目 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-text-primary text-[13px]">
              <span className="flex items-center gap-1.5">
                <History size={15} className="text-text-secondary" />
                历史运营记录与复盘 ({includedHistory}/{localState.historyProjects.length})
              </span>
            </div>
            <div className="space-y-2">
              {localState.historyProjects.map(h => (
                <label
                  key={h.id}
                  className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    h.included ? "bg-white border-border-default hover:border-neutral-400" : "bg-surface-subtle/70 border-border-subtle opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={h.included}
                      onChange={() => toggleHistory(h.id)}
                      className="w-4 h-4 mt-0.5 accent-action-primary rounded cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{h.title}</div>
                      <div className="text-[12px] text-text-secondary mt-0.5">
                        周期 {h.period} · {h.result}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    h.included ? "bg-neutral-100 text-text-secondary" : "text-text-disabled"
                  }`}>
                    {h.included ? "已包含" : "已排除"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-white flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-text-secondary font-medium hover:bg-surface-hover rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onSave(localState);
              onClose();
            }}
            className="px-5 py-2 bg-action-primary text-white font-medium text-[13px] rounded-lg hover:bg-action-primary-hover transition-colors shadow-2xs"
          >
            应用上下文配置
          </button>
        </div>
      </motion.div>
    </>
  );
}
