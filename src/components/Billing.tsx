import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Download,
  FileText,
  Landmark,
  MessageCircleMore,
  PackagePlus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type PlanId = "experience" | "professional" | "mcn" | "enterprise";
type BillFilter = "all" | "recharge" | "consumption";

interface PlanOption {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  unavailable?: string[];
  badge?: string;
}

interface BoostPack {
  name: string;
  price: string;
  content: string;
  unitPrice: string;
  amount?: number;
  badge?: string;
}

interface ChannelProduct {
  name: string;
  price: string;
  content: string;
  note?: string;
  badge?: string;
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "experience",
    name: "体验版",
    price: "¥0",
    period: "长期有效",
    description: "适合首次体验完整运营闭环",
    features: [
      "1 个商家空间",
      "1 名协作成员",
      "基础方案与内容生成（每月 10 篇 AI 笔记）",
      "每月 ¥100 体验额度",
      "基础复盘数据（近 7 天）",
    ],
    unavailable: ["通道坐席", "员工管理", "跨商家看板"],
  },
  {
    id: "professional",
    name: "专业版",
    price: "¥299",
    period: "/ 月",
    description: "适合单个品牌的确定内容运营",
    features: [
      "1 个商家空间（可加购第 2 个：+¥299/月）",
      "5 名协作成员",
      "完整执行与复盘中心",
      "每月 100 篇 AI 笔记 + ¥500 AI 额度",
      "素材任务派发（基础）",
      "可开通通道坐席（企微/私信）",
    ],
    badge: "推荐",
  },
  {
    id: "mcn",
    name: "MCN 版",
    price: "¥999",
    period: "/ 月",
    description: "适合代运营团队和多品牌协作",
    features: [
      "3 个商家空间（每加 1 个 +¥299/月）",
      "20 名协作成员",
      "权限与任务通知配置",
      "跨商家数据看板",
      "每月 300 篇 AI 笔记 + ¥2,000 AI 额度",
      "素材任务派发与审核流",
      "加油包 9 折、工单优先支持",
      "通道坐席可开通（推荐价 9 折）",
    ],
    badge: "机构首选",
  },
  {
    id: "enterprise",
    name: "企业版",
    price: "定制",
    period: "· 按需求报价",
    description: "适合企业级部署与系统集成",
    features: ["不限商家空间", "组织级权限体系", "企微/飞书/钉钉集成", "专属模型与 SLA"],
  },
];

const PLAN_CAPABILITIES = [
  { capability: "商家空间", experience: "1", professional: "1（+¥299 可加到 2）", mcn: "3（+¥299/个）", enterprise: "不限" },
  { capability: "协作成员", experience: "1", professional: "5", mcn: "20", enterprise: "组织级" },
  { capability: "AI 笔记配额", experience: "10 篇/月", professional: "100 篇/月", mcn: "300 篇/月", enterprise: "专属" },
  { capability: "每月 AI 额度", experience: "¥100", professional: "¥500", mcn: "¥2,000", enterprise: "专属" },
  { capability: "复盘中心", experience: "基础（近 7 天）", professional: "完整执行与复盘", mcn: "跨商家看板", enterprise: "专属" },
  { capability: "通道坐席（企微/私信）", experience: "不可", professional: "可（原价）", mcn: "可（9 折）", enterprise: "不可（使用专属集成）" },
  { capability: "权限/任务通知/审核流", experience: "不可", professional: "基础派发", mcn: "完整", enterprise: "专属" },
  { capability: "加油包折扣", experience: "无", professional: "原价", mcn: "9 折", enterprise: "专属" },
];

const BOOST_PACKS: BoostPack[] = [
  { name: "轻量包", price: "¥99", amount: 99, content: "50 篇 AI 笔记", unitPrice: "约 ¥2.0/篇" },
  { name: "标准包", price: "¥199", amount: 199, content: "150 篇 AI 笔记", unitPrice: "约 ¥1.3/篇", badge: "常用" },
  { name: "重度包", price: "¥499", amount: 499, content: "500 篇 AI 笔记 + 100 次图片编辑", unitPrice: "约 ¥1.0/篇", badge: "高用量" },
  { name: "超额计量", price: "¥2/篇", content: "超出所有配额后按篇计费", unitPrice: "兜底价" },
];

const CHANNEL_PRODUCTS: ChannelProduct[] = [
  { name: "企微坐席标准版", price: "¥950/坐席/年", content: "存档可视化 + AI 自动回复 + 多人协作回复" },
  { name: "小红书私信坐席", price: "¥1,000/坐席/年", content: "私信承接 + 自动回复 + 客资识别" },
  { name: "AI 增值包", price: "+¥199/坐席/年", content: "会话质检周报 + 话术提炼 + 意向评分" },
  { name: "双通道组合包", price: "¥1,399/年", content: "私信坐席 1 + 企微标准坐席 1 捆绑", note: "单品合计 ¥1,950，组合省 ¥551", badge: "组合优惠" },
];

const BILL_ROWS = [
  { id: "B20260831001", time: "08-31 10:24", type: "consumption" as const, title: "AI 对话与方案生成", detail: "宠物食品组 · DeepSeek-V4", amount: "- ¥12.80", status: "已结算" },
  { id: "B20260830018", time: "08-30 18:02", type: "recharge" as const, title: "钱包充值", detail: "微信支付", amount: "+ ¥500.00", status: "充值成功" },
  { id: "B20260830009", time: "08-30 14:16", type: "consumption" as const, title: "内容工作流执行", detail: "美妆官号 · 4 次任务", amount: "- ¥2.00", status: "已结算" },
  { id: "B20260829033", time: "08-29 09:42", type: "consumption" as const, title: "知识库索引与检索", detail: "宠物食品组 · 1.8M Token", amount: "- ¥4.63", status: "已结算" },
];

const TREND_VALUES = [8, 12, 7, 18, 10, 14, 9, 24, 15, 12, 28, 18, 32, 16, 22, 13, 38, 20, 18, 27, 12, 10, 31, 16];

export const Billing: React.FC = () => {
  const [billFilter, setBillFilter] = useState<BillFilter>("all");
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [rechargeCompleted, setRechargeCompleted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [selectedChannelProduct, setSelectedChannelProduct] = useState<ChannelProduct | null>(null);

  const filteredBills = useMemo(
    () => BILL_ROWS.filter((row) => billFilter === "all" || row.type === billFilter),
    [billFilter],
  );
  const finalRechargeAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const openRecharge = () => {
    setRechargeCompleted(false);
    setIsRechargeOpen(true);
  };

  const openRechargeForAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    openRecharge();
  };

  return (
    <div className="min-h-full bg-page-bg">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-border-default bg-surface-1 px-8 py-6">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-text-main">钱包与账单</h1>
          <p className="mt-1 text-[13px] text-text-tertiary">查看当前套餐、账户余额、充值记录及 AI 与工作流费用。</p>
        </div>
        <select aria-label="账单月份" defaultValue="2026-08" className="h-10 rounded-xl border border-border-default bg-surface-1 px-3 text-[13px] text-text-secondary outline-none focus:border-border-strong">
          <option value="2026-08">2026 年 8 月</option>
          <option value="2026-07">2026 年 7 月</option>
          <option value="2026-06">2026 年 6 月</option>
        </select>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-6 p-8">
        <section className="grid gap-4 lg:grid-cols-3" aria-label="账户资金概览">
          <article className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div><div className="text-[13px] text-text-tertiary">账户余额</div><div className="mt-3 text-[34px] font-semibold tracking-tight text-text-main">¥3,056.44</div><div className="mt-1 text-[13px] text-text-tertiary">人民币 CNY · 可抵扣全部用量费用</div></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-brand-logo"><WalletCards size={19} /></span>
            </div>
            <button type="button" onClick={openRecharge} className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-btn-main px-4 py-2.5 text-[13px] font-medium text-white hover:bg-btn-main-hover"><CircleDollarSign size={15} />立即充值</button>
          </article>
          <article className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] text-text-tertiary">累计充值</div><div className="mt-3 text-[34px] font-semibold tracking-tight text-text-main">¥5,600.00</div><div className="mt-1 text-[13px] text-text-tertiary">含活动赠送与套餐赠送额度</div></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CreditCard size={19} /></span></div></article>
          <article className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] text-text-tertiary">累计消费</div><div className="mt-3 text-[34px] font-semibold tracking-tight text-text-main">¥2,543.56</div><div className="mt-1 text-[13px] text-text-tertiary">本月已消费 ¥98.43</div></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Activity size={19} /></span></div></article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><div className="flex items-center gap-2"><span className="text-[13px] font-medium text-text-tertiary">当前使用套餐</span><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[13px] font-medium text-emerald-700">生效中</span></div><h2 className="mt-3 text-[24px] font-semibold text-text-main">体验版</h2><p className="mt-1 text-[13px] text-text-tertiary">免费使用基础功能，可随时升级；升级不会影响现有商家、方案和任务。</p></div>
              <div className="rounded-xl bg-page-bg px-4 py-3 text-right"><div className="text-[13px] text-text-tertiary">套餐费用</div><div className="mt-1 text-[18px] font-semibold text-text-main">¥0 / 月</div></div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[{ label: "商家空间", value: "1 / 1", progress: 100 }, { label: "协作成员", value: "1 / 1", progress: 100 }, { label: "本月 AI 笔记", value: "6 / 10 篇", progress: 60 }, { label: "本月 AI 额度", value: "¥73 / ¥100", progress: 73 }].map((item) => (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-page-bg/70 p-3"><div className="flex items-center justify-between text-[13px]"><span className="text-text-tertiary">{item.label}</span><span className="font-medium text-text-main">{item.value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hover-bg"><div className="h-full rounded-full bg-brand-logo" style={{ width: `${item.progress}%` }} /></div></div>
              ))}
            </div>
            <button type="button" onClick={() => document.getElementById("available-plans")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-border-default px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg">查看可用版本<ArrowRight size={14} /></button>
          </article>
          <article className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm">
            <div className="flex items-center justify-between"><div><h2 className="text-[16px] font-semibold text-text-main">近 30 天费用趋势</h2><p className="mt-1 text-[13px] text-text-tertiary">AI 对话与工作流费用</p></div><span className="text-[13px] text-text-tertiary">单位：元</span></div>
            <div className="mt-6 flex h-32 items-end gap-1.5" aria-label="近 30 天费用柱状图">{TREND_VALUES.map((value, index) => <span key={`${value}-${index}`} title={`第 ${index + 1} 天：¥${value}`} className="min-w-1 flex-1 rounded-t bg-rose-100 transition-colors hover:bg-brand-logo" style={{ height: `${Math.max(12, value * 2.45)}%` }} />)}</div>
            <div className="mt-3 flex items-center justify-between text-[13px] text-text-tertiary"><span>8 月 1 日</span><span>8 月 31 日</span></div>
          </article>
        </section>

        <section id="available-plans" className="scroll-mt-28 rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-[18px] font-semibold text-text-main">订阅套餐</h2><p className="mt-1 text-[13px] text-text-tertiary">订阅决定商家空间、协作人数和基础权益；钱包余额用于结算加油包与超额用量。</p></div>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary"><ShieldCheck size={14} />升级后立即生效，现有数据不受影响</span>
          </div>
          <div className="mt-5 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PLAN_OPTIONS.map((plan) => {
              const isCurrent = plan.id === "experience";
              const isHighlighted = Boolean(plan.badge);
              return (
                <article key={plan.id} className={`relative flex min-h-[440px] flex-col rounded-2xl border p-5 ${isHighlighted ? "border-brand-logo bg-rose-50/30 shadow-sm" : "border-border-default bg-surface-1"}`}>
                  {plan.badge ? <span className="absolute right-4 top-4 rounded-full bg-btn-main px-2.5 py-1 text-[12px] font-medium text-white">{plan.badge}</span> : null}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-page-bg text-text-secondary">{plan.id === "enterprise" ? <Landmark size={17} /> : plan.id === "mcn" ? <BadgeCheck size={17} /> : plan.id === "professional" ? <Zap size={17} /> : <Sparkles size={17} />}</div>
                  <h3 className="mt-4 text-[17px] font-semibold text-text-main">{plan.name}</h3>
                  <div className="mt-2 flex flex-wrap items-baseline gap-1"><span className="text-[26px] font-semibold text-text-main">{plan.price}</span><span className="text-[13px] text-text-tertiary">{plan.period}</span></div>
                  <p className="mt-2 min-h-10 text-[13px] leading-5 text-text-tertiary">{plan.description}</p>
                  <div className="mt-4 text-[12px] font-medium text-text-tertiary">权益</div>
                  <ul className="mt-2 flex-1 space-y-2.5">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-[13px] leading-5 text-text-secondary"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />{feature}</li>)}</ul>
                  {plan.unavailable ? <div className="mt-4 rounded-xl bg-page-bg px-3 py-2.5 text-[12px] leading-5 text-text-tertiary"><span className="font-medium text-text-secondary">暂不可用：</span>{plan.unavailable.join("、")}</div> : null}
                  <button type="button" disabled={isCurrent} onClick={() => setSelectedPlan(plan)} className={`mt-5 w-full rounded-xl px-4 py-2.5 text-[13px] font-medium ${isCurrent ? "cursor-default bg-hover-bg text-text-tertiary" : isHighlighted ? "bg-btn-main text-white hover:bg-btn-main-hover" : "border border-border-default text-text-secondary hover:bg-hover-bg"}`}>{isCurrent ? "当前使用" : plan.id === "enterprise" ? "联系顾问" : "选择此版本"}</button>
                </article>
              );
            })}
          </div>

          <div className="mt-8 border-t border-border-default pt-6">
            <div><h3 className="text-[16px] font-semibold text-text-main">四档能力边界</h3><p className="mt-1 text-[13px] text-text-tertiary">用于明确各版本可开通能力，实际消耗仍从钱包余额结算。</p></div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
                <thead className="bg-page-bg text-text-secondary"><tr><th className="px-4 py-3 font-medium">能力维度</th><th className="px-4 py-3 font-medium">体验版 · ¥0</th><th className="px-4 py-3 font-medium">专业版 · ¥299</th><th className="px-4 py-3 font-medium text-brand-logo">MCN 版 · ¥999</th><th className="px-4 py-3 font-medium">企业版 · 定制</th></tr></thead>
                <tbody className="divide-y divide-border-subtle">{PLAN_CAPABILITIES.map((row) => <tr key={row.capability} className="align-top"><th className="whitespace-nowrap px-4 py-3 font-medium text-text-main">{row.capability}</th><td className="px-4 py-3 text-text-tertiary">{row.experience}</td><td className="px-4 py-3 text-text-secondary">{row.professional}</td><td className="bg-rose-50/20 px-4 py-3 text-text-secondary">{row.mcn}</td><td className="px-4 py-3 text-text-secondary">{row.enterprise}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm" aria-labelledby="boost-pack-title">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-brand-logo"><PackagePlus size={17} /></span><h2 id="boost-pack-title" className="text-[18px] font-semibold text-text-main">用量加油包</h2></div><p className="mt-2 text-[13px] text-text-tertiary">套餐配额不够时按需购买，费用从钱包余额结算；MCN 版购买前三档享 9 折。</p></div><button type="button" onClick={openRecharge} className="inline-flex items-center gap-1.5 rounded-xl bg-btn-main px-4 py-2.5 text-[13px] font-medium text-white hover:bg-btn-main-hover"><CircleDollarSign size={15} />充值钱包</button></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {BOOST_PACKS.map((pack) => <article key={pack.name} className="relative flex min-h-[210px] flex-col rounded-2xl border border-border-default bg-page-bg/40 p-5">{pack.badge ? <span className="absolute right-4 top-4 rounded-full bg-rose-100 px-2 py-1 text-[12px] font-medium text-brand-logo">{pack.badge}</span> : null}<h3 className="text-[15px] font-semibold text-text-main">{pack.name}</h3><div className="mt-3 text-[24px] font-semibold text-text-main">{pack.price}</div><p className="mt-3 flex-1 text-[13px] leading-5 text-text-secondary">{pack.content}</p><div className="mt-3 text-[12px] text-text-tertiary">{pack.unitPrice}</div>{pack.amount ? <button type="button" onClick={() => openRechargeForAmount(pack.amount!)} className="mt-4 w-full rounded-xl border border-border-default bg-surface-1 px-3 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg">购买加油包</button> : <div className="mt-4 rounded-xl bg-hover-bg px-3 py-2.5 text-center text-[13px] text-text-tertiary">自动按量结算</div>}</article>)}
          </div>
        </section>

        <section className="rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm" aria-labelledby="channel-seat-title">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MessageCircleMore size={17} /></span><h2 id="channel-seat-title" className="text-[18px] font-semibold text-text-main">通道坐席</h2></div><p className="mt-2 text-[13px] text-text-tertiary">按年独立开通，不占订阅套餐额度；体验版不可开通，MCN 版按坐席价格享 9 折。</p></div><span className="rounded-full bg-page-bg px-3 py-1.5 text-[12px] text-text-tertiary">独立于订阅计费</span></div>
          <div className="mt-5 overflow-hidden rounded-xl border border-border-default">
            <div className="hidden grid-cols-[1.1fr_0.8fr_2fr_1fr] gap-4 bg-page-bg px-5 py-3 text-[12px] font-medium text-text-tertiary md:grid"><div>通道产品</div><div>价格</div><div>包含内容</div><div>开通方式</div></div>
            <div className="divide-y divide-border-subtle">{CHANNEL_PRODUCTS.map((product) => <article key={product.name} className="grid items-center gap-3 px-5 py-4 md:grid-cols-[1.1fr_0.8fr_2fr_1fr] md:gap-4"><div><div className="flex items-center gap-2"><h3 className="text-[13px] font-medium text-text-main">{product.name}</h3>{product.badge ? <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-brand-logo">{product.badge}</span> : null}</div>{product.note ? <div className="mt-1 text-[12px] text-emerald-700">{product.note}</div> : null}</div><div className="text-[14px] font-semibold text-text-main">{product.price}</div><div className="text-[13px] leading-5 text-text-secondary">{product.content}</div><button type="button" onClick={() => setSelectedChannelProduct(product)} className="justify-self-start rounded-xl border border-border-default px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg md:justify-self-stretch">咨询开通</button></article>)}</div>
          </div>
          <div className="mt-4 rounded-xl bg-blue-50/70 px-4 py-3 text-[12px] leading-5 text-blue-900">企业版使用专属企微、飞书、钉钉系统集成，不走标准通道坐席商品；请通过企业顾问确认接口、部署和 SLA。</div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-6 py-5"><div><h2 className="text-[18px] font-semibold text-text-main">账单明细</h2><p className="mt-1 text-[13px] text-text-tertiary">充值与消耗统一记录，可按月导出。</p></div><div className="flex items-center gap-2"><button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-border-default px-3 py-2 text-[13px] text-text-secondary hover:bg-hover-bg"><FileText size={14} />申请发票</button><button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-border-default px-3 py-2 text-[13px] text-text-secondary hover:bg-hover-bg"><Download size={14} />导出账单</button></div></div>
          <div className="flex gap-1 border-b border-border-default px-6 pt-3">{([["all", "全部明细"], ["recharge", "充值记录"], ["consumption", "消耗记录"]] as const).map(([id, label]) => <button key={id} type="button" onClick={() => setBillFilter(id)} className={`border-b-2 px-3 py-2 text-[13px] ${billFilter === id ? "border-brand-logo font-medium text-text-main" : "border-transparent text-text-tertiary hover:text-text-secondary"}`}>{label}</button>)}</div>
          <div className="divide-y divide-border-subtle">{filteredBills.map((row) => <div key={row.id} className="grid items-center gap-4 px-6 py-4 text-[13px] sm:grid-cols-[120px_1fr_120px_100px]"><div className="text-text-tertiary">{row.time}</div><div className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${row.type === "recharge" ? "bg-emerald-50 text-emerald-700" : "bg-page-bg text-text-secondary"}`}>{row.type === "recharge" ? <CreditCard size={16} /> : <ReceiptText size={16} />}</span><div className="min-w-0"><div className="font-medium text-text-main">{row.title}</div><div className="mt-0.5 truncate text-text-tertiary">{row.detail} · {row.id}</div></div></div><div className={row.type === "recharge" ? "font-medium text-emerald-700" : "font-medium text-text-main"}>{row.amount}</div><div className="text-text-tertiary">{row.status}</div></div>)}</div>
        </section>
      </main>

      {isRechargeOpen ? (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="recharge-title">
          <form onSubmit={(event) => { event.preventDefault(); if (finalRechargeAmount > 0) setRechargeCompleted(true); }} className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
            <header className="flex items-start justify-between border-b border-border-default px-6 py-5"><div><h2 id="recharge-title" className="text-[18px] font-semibold text-text-main">钱包充值</h2><p className="mt-1 text-[13px] text-text-tertiary">充值余额可用于 AI 对话、内容生成和工作流执行费用。</p></div><button type="button" onClick={() => setIsRechargeOpen(false)} aria-label="关闭充值" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button></header>
            {rechargeCompleted ? <div className="flex flex-col items-center px-6 py-10 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={27} /></span><h3 className="mt-4 text-[18px] font-semibold text-text-main">充值订单已创建</h3><p className="mt-2 text-[13px] text-text-tertiary">应付金额 ¥{finalRechargeAmount.toFixed(2)}，完成支付后余额将自动到账。</p><button type="button" onClick={() => setIsRechargeOpen(false)} className="mt-6 rounded-xl bg-btn-main px-5 py-2.5 text-[13px] font-medium text-white">完成</button></div> : (
              <><div className="space-y-5 p-6"><div><div className="text-[13px] font-medium text-text-secondary">选择充值金额</div><div className="mt-3 grid grid-cols-4 gap-2">{[100, 500, 1000, 3000].map((amount) => <button key={amount} type="button" onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }} className={`rounded-xl border px-3 py-3 text-[14px] font-medium ${!customAmount && selectedAmount === amount ? "border-brand-logo bg-rose-50 text-brand-logo" : "border-border-default text-text-secondary hover:bg-hover-bg"}`}>¥{amount}</button>)}</div></div><label className="block space-y-1.5"><span className="text-[13px] font-medium text-text-secondary">自定义金额</span><input type="number" min="1" step="1" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder="输入其他充值金额" className="h-11 w-full rounded-xl border border-border-default px-3 text-[13px] outline-none focus:border-border-strong" /></label><div><div className="text-[13px] font-medium text-text-secondary">支付方式</div><div className="mt-3 grid gap-2 sm:grid-cols-3"><button type="button" className="rounded-xl border border-brand-logo bg-rose-50 px-3 py-3 text-[13px] font-medium text-text-main">微信支付</button><button type="button" className="rounded-xl border border-border-default px-3 py-3 text-[13px] text-text-secondary">支付宝</button><button type="button" className="rounded-xl border border-border-default px-3 py-3 text-[13px] text-text-secondary">企业对公</button></div></div><div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[13px] leading-5 text-blue-900"><ShieldCheck size={15} className="mt-0.5 shrink-0" />钱包余额长期有效；具体用量按账单明细实时扣减。</div></div><footer className="flex items-center justify-between border-t border-border-default px-6 py-4"><div className="text-[13px] text-text-tertiary">应付：<strong className="ml-1 text-[20px] text-text-main">¥{finalRechargeAmount.toFixed(2)}</strong></div><button type="submit" disabled={finalRechargeAmount <= 0} className="rounded-xl bg-btn-main px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-40">确认充值</button></footer></>
            )}
          </form>
        </div>
      ) : null}

      {selectedChannelProduct ? (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="channel-dialog-title">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
            <header className="flex items-start justify-between border-b border-border-default px-6 py-5"><div><h2 id="channel-dialog-title" className="text-[18px] font-semibold text-text-main">咨询开通通道坐席</h2><p className="mt-1 text-[13px] text-text-tertiary">坐席按年独立计费，开通前将确认账号数量和接入方式。</p></div><button type="button" onClick={() => setSelectedChannelProduct(null)} aria-label="关闭坐席咨询" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button></header>
            <div className="p-6"><div className="rounded-xl border border-border-default bg-page-bg p-4"><div className="flex items-start justify-between gap-4"><span className="font-medium text-text-main">{selectedChannelProduct.name}</span><span className="whitespace-nowrap text-[16px] font-semibold text-text-main">{selectedChannelProduct.price}</span></div><p className="mt-2 text-[13px] leading-5 text-text-secondary">{selectedChannelProduct.content}</p>{selectedChannelProduct.note ? <p className="mt-2 text-[12px] text-emerald-700">{selectedChannelProduct.note}</p> : null}</div><div className="mt-4 flex items-start gap-2 text-[13px] leading-5 text-text-secondary"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />提交后顾问将根据当前订阅版本核算可用折扣，并协助完成通道授权。</div></div>
            <footer className="flex justify-end gap-2 border-t border-border-default px-6 py-4"><button type="button" onClick={() => setSelectedChannelProduct(null)} className="rounded-xl border border-border-default px-4 py-2.5 text-[13px] text-text-secondary">取消</button><button type="button" onClick={() => setSelectedChannelProduct(null)} className="rounded-xl bg-btn-main px-5 py-2.5 text-[13px] font-medium text-white">提交开通咨询</button></footer>
          </div>
        </div>
      ) : null}

      {selectedPlan ? (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl"><header className="flex items-start justify-between border-b border-border-default px-6 py-5"><div><h2 id="plan-dialog-title" className="text-[18px] font-semibold text-text-main">{selectedPlan.id === "enterprise" ? "联系企业顾问" : `升级至${selectedPlan.name}`}</h2><p className="mt-1 text-[13px] text-text-tertiary">现有商家数据、方案和任务将完整保留。</p></div><button type="button" onClick={() => setSelectedPlan(null)} aria-label="关闭套餐选择" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button></header><div className="p-6"><div className="rounded-xl border border-border-default bg-page-bg p-4"><div className="flex items-center justify-between"><span className="font-medium text-text-main">{selectedPlan.name}</span><span className="text-[18px] font-semibold text-text-main">{selectedPlan.price}</span></div><p className="mt-2 text-[13px] text-text-tertiary">{selectedPlan.description}</p></div><div className="mt-4 flex items-start gap-2 text-[13px] leading-5 text-text-secondary"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />{selectedPlan.id === "enterprise" ? "提交后企业顾问将在 1 个工作日内联系你。" : "确认后进入支付流程，支付成功即刻生效。"}</div></div><footer className="flex justify-end gap-2 border-t border-border-default px-6 py-4"><button type="button" onClick={() => setSelectedPlan(null)} className="rounded-xl border border-border-default px-4 py-2.5 text-[13px] text-text-secondary">取消</button><button type="button" className="rounded-xl bg-btn-main px-5 py-2.5 text-[13px] font-medium text-white">{selectedPlan.id === "enterprise" ? "提交联系信息" : "确认升级"}</button></footer></div>
        </div>
      ) : null}
    </div>
  );
};
