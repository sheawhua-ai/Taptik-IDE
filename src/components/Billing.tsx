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
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type PlanId = "experience" | "professional" | "team" | "enterprise";
type BillFilter = "all" | "recharge" | "consumption";

interface PlanOption {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "experience",
    name: "体验版",
    price: "¥0",
    period: "长期有效",
    description: "适合首次体验完整运营闭环",
    features: ["1 个商家空间", "1 名协作成员", "基础方案与内容生成", "每月 ¥100 体验额度"],
  },
  {
    id: "professional",
    name: "专业版",
    price: "¥299",
    period: "/ 月",
    description: "适合单个品牌的稳定内容运营",
    features: ["3 个商家空间", "5 名协作成员", "完整执行与复盘中心", "每月 ¥500 AI 额度"],
    recommended: true,
  },
  {
    id: "team",
    name: "团队版",
    price: "¥899",
    period: "/ 月",
    description: "适合代运营团队和多品牌协作",
    features: ["10 个商家空间", "20 名协作成员", "权限与任务通知配置", "每月 ¥2,000 AI 额度"],
  },
  {
    id: "enterprise",
    name: "企业版",
    price: "定制",
    period: "按需求报价",
    description: "适合企业级部署与系统集成",
    features: ["不限商家空间", "组织级权限体系", "企微/飞书/钉钉集成", "专属模型与 SLA"],
  },
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

  const filteredBills = useMemo(
    () => BILL_ROWS.filter((row) => billFilter === "all" || row.type === billFilter),
    [billFilter],
  );
  const finalRechargeAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const openRecharge = () => {
    setRechargeCompleted(false);
    setIsRechargeOpen(true);
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
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[{ label: "商家空间", value: "1 / 1", progress: 100 }, { label: "协作成员", value: "1 / 1", progress: 100 }, { label: "本月体验额度", value: "¥73 / ¥100", progress: 73 }].map((item) => (
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
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-[18px] font-semibold text-text-main">可用套餐版本</h2><p className="mt-1 text-[13px] text-text-tertiary">按商家规模和协作人数选择版本，钱包余额与套餐权益分别结算。</p></div><span className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary"><ShieldCheck size={14} />升级后立即生效</span></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            {PLAN_OPTIONS.map((plan) => {
              const isCurrent = plan.id === "experience";
              return (
                <article key={plan.id} className={`relative flex min-h-[330px] flex-col rounded-2xl border p-5 ${plan.recommended ? "border-brand-logo bg-rose-50/30 shadow-sm" : "border-border-default bg-surface-1"}`}>
                  {plan.recommended ? <span className="absolute right-4 top-4 rounded-full bg-btn-main px-2 py-1 text-[13px] font-medium text-white">推荐</span> : null}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-page-bg text-text-secondary">{plan.id === "enterprise" ? <Landmark size={17} /> : plan.id === "team" ? <BadgeCheck size={17} /> : plan.id === "professional" ? <Zap size={17} /> : <Sparkles size={17} />}</div>
                  <h3 className="mt-4 text-[17px] font-semibold text-text-main">{plan.name}</h3><div className="mt-2 flex items-baseline gap-1"><span className="text-[26px] font-semibold text-text-main">{plan.price}</span><span className="text-[13px] text-text-tertiary">{plan.period}</span></div><p className="mt-2 min-h-10 text-[13px] leading-5 text-text-tertiary">{plan.description}</p>
                  <ul className="mt-4 flex-1 space-y-2.5">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-[13px] text-text-secondary"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />{feature}</li>)}</ul>
                  <button type="button" disabled={isCurrent} onClick={() => setSelectedPlan(plan)} className={`mt-5 w-full rounded-xl px-4 py-2.5 text-[13px] font-medium ${isCurrent ? "cursor-default bg-hover-bg text-text-tertiary" : plan.recommended ? "bg-btn-main text-white hover:bg-btn-main-hover" : "border border-border-default text-text-secondary hover:bg-hover-bg"}`}>{isCurrent ? "当前使用" : plan.id === "enterprise" ? "联系顾问" : "选择此版本"}</button>
                </article>
              );
            })}
          </div>
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

      {selectedPlan ? (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-2xl"><header className="flex items-start justify-between border-b border-border-default px-6 py-5"><div><h2 id="plan-dialog-title" className="text-[18px] font-semibold text-text-main">{selectedPlan.id === "enterprise" ? "联系企业顾问" : `升级至${selectedPlan.name}`}</h2><p className="mt-1 text-[13px] text-text-tertiary">现有商家数据、方案和任务将完整保留。</p></div><button type="button" onClick={() => setSelectedPlan(null)} aria-label="关闭套餐选择" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg"><X size={17} /></button></header><div className="p-6"><div className="rounded-xl border border-border-default bg-page-bg p-4"><div className="flex items-center justify-between"><span className="font-medium text-text-main">{selectedPlan.name}</span><span className="text-[18px] font-semibold text-text-main">{selectedPlan.price}</span></div><p className="mt-2 text-[13px] text-text-tertiary">{selectedPlan.description}</p></div><div className="mt-4 flex items-start gap-2 text-[13px] leading-5 text-text-secondary"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />{selectedPlan.id === "enterprise" ? "提交后企业顾问将在 1 个工作日内联系你。" : "确认后进入支付流程，支付成功即刻生效。"}</div></div><footer className="flex justify-end gap-2 border-t border-border-default px-6 py-4"><button type="button" onClick={() => setSelectedPlan(null)} className="rounded-xl border border-border-default px-4 py-2.5 text-[13px] text-text-secondary">取消</button><button type="button" className="rounded-xl bg-btn-main px-5 py-2.5 text-[13px] font-medium text-white">{selectedPlan.id === "enterprise" ? "提交联系信息" : "确认升级"}</button></footer></div>
        </div>
      ) : null}
    </div>
  );
};
