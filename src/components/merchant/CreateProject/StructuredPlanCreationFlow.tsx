import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  FileText,
  Info,
  Layers,
  Lock,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import type { IndustryDefaults, MerchantIndustryProfile } from '../../../data/industryCatalog';
import type { StrategyDraftData } from './types';

export interface PlanCreationSettings {
  targetKeywords: string;
  conversionGoal: string;
  publishFrequency: string;
  observationDays: number;
  needMaterials: boolean;
  allowIndustryFallback: boolean;
}

interface Props {
  draft: StrategyDraftData;
  setDraft: React.Dispatch<React.SetStateAction<StrategyDraftData>>;
  industryDefaults?: IndustryDefaults;
  industryProfile?: MerchantIndustryProfile;
  onClose: () => void;
  onOpenContext: () => void;
  onOpenAIChat?: () => void;
  onConfirm: (draft: StrategyDraftData, settings: PlanCreationSettings) => void;
}

type FlowStep = 'choose' | 'brief' | 'review';
type ReviewTab = 'strategy' | 'content' | 'publish';
type AccountPreset = 'all-koc' | 'koc-first' | 'owned-first' | 'mixed';
type CreationMode = 'ai' | 'blank';

const PRIMARY_GOALS = ['搜索卡位', '种草认知', '有效咨询', '进店转化', '账号涨粉'] as const;

const GOAL_COPY: Record<(typeof PRIMARY_GOALS)[number], string> = {
  搜索卡位: '验证目标关键词能否获得持续收录和搜索位置。',
  种草认知: '验证真实内容能否形成收藏、关注和品牌认知。',
  有效咨询: '验证内容能否带来有明确需求的站内咨询。',
  进店转化: '验证内容能否带来主页访问、商品访问或门店访问。',
  账号涨粉: '验证稳定内容栏目能否带来持续关注。',
};

const REVIEW_TABS: Array<{ id: ReviewTab; label: string; description: string }> = [
  { id: 'strategy', label: '策略与目标', description: '解决什么问题，给谁看' },
  { id: 'content', label: '内容与账号', description: '生成多少篇，由谁来发' },
  { id: 'publish', label: '发布与验证', description: '怎么发布，如何判断有效' },
];

function getRoleCounts(draft: StrategyDraftData) {
  const brand = draft.accountAndContentAssignment.brandAccounts.reduce((sum, account) => sum + account.noteCount, 0);
  const kos = draft.accountAndContentAssignment.kosAccounts.reduce((sum, account) => sum + account.noteCount, 0);
  const koc = draft.accountAndContentAssignment.kocParticipants.enabled
    ? draft.accountAndContentAssignment.kocParticipants.recruitmentCount
    : 0;
  return { brand, kos, koc, total: brand + kos + koc };
}

function distributeCount<T extends { noteCount: number }>(accounts: T[], count: number): T[] {
  if (accounts.length === 0) return accounts;
  const safeCount = Math.max(0, count);
  const base = Math.floor(safeCount / accounts.length);
  const remainder = safeCount % accounts.length;
  return accounts.map((account, index) => ({
    ...account,
    noteCount: base + (index < remainder ? 1 : 0),
  }));
}

function updateTotal(draft: StrategyDraftData): StrategyDraftData {
  const counts = getRoleCounts(draft);
  return {
    ...draft,
    accountAndContentAssignment: {
      ...draft.accountAndContentAssignment,
      totalNotesCount: counts.total,
    },
  };
}

export function StructuredPlanCreationFlow({
  draft,
  setDraft,
  industryDefaults,
  industryProfile,
  onClose,
  onOpenContext,
  onOpenAIChat,
  onConfirm,
}: Props) {
  const [step, setStep] = useState<FlowStep>('review');
  const [reviewTab, setReviewTab] = useState<ReviewTab>('strategy');
  const [primaryGoal, setPrimaryGoal] = useState<(typeof PRIMARY_GOALS)[number]>('搜索卡位');
  const [targetKeywords, setTargetKeywords] = useState('幼犬换粮、幼犬软便、换粮方法');
  const [conversionGoal, setConversionGoal] = useState('收藏 / 关注');
  const [publishFrequency, setPublishFrequency] = useState('每天 1–2 篇');
  const [observationDays, setObservationDays] = useState(14);
  const [needMaterials, setNeedMaterials] = useState(true);
  const [allowIndustryFallback, setAllowIndustryFallback] = useState(true);
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');

  const counts = getRoleCounts(draft);
  const industryName = [
    industryProfile?.primaryName,
    ...(industryProfile?.secondaryNames ?? []),
    ...(industryProfile?.tertiaryNames ?? []),
  ].filter(Boolean).join(' · ') || industryDefaults?.workflowName || '行业通用运营';

  const updateRoleCount = (role: 'brand' | 'kos' | 'koc', count: number) => {
    setDraft((current) => {
      let next = current;
      if (role === 'brand') {
        next = {
          ...current,
          accountAndContentAssignment: {
            ...current.accountAndContentAssignment,
            brandAccounts: distributeCount(current.accountAndContentAssignment.brandAccounts, count),
          },
        };
      } else if (role === 'kos') {
        next = {
          ...current,
          accountAndContentAssignment: {
            ...current.accountAndContentAssignment,
            kosAccounts: distributeCount(current.accountAndContentAssignment.kosAccounts, count),
          },
        };
      } else {
        next = {
          ...current,
          accountAndContentAssignment: {
            ...current.accountAndContentAssignment,
            kocParticipants: {
              ...current.accountAndContentAssignment.kocParticipants,
              enabled: count > 0,
              recruitmentCount: Math.max(0, count),
            },
          },
        };
      }
      return updateTotal(next);
    });
  };

  const applyAccountPreset = (preset: AccountPreset) => {
    const currentTotal = counts.total > 0 ? counts.total : 20;
    const allocation = preset === 'all-koc'
      ? { brand: 0, kos: 0, koc: currentTotal }
      : preset === 'koc-first'
        ? { brand: Math.min(2, currentTotal), kos: Math.min(3, Math.max(0, currentTotal - 2)), koc: Math.max(0, currentTotal - 5) }
        : preset === 'owned-first'
          ? { brand: Math.ceil(currentTotal * 0.35), kos: Math.ceil(currentTotal * 0.4), koc: Math.max(0, currentTotal - Math.ceil(currentTotal * 0.35) - Math.ceil(currentTotal * 0.4)) }
          : { brand: 2, kos: 5, koc: Math.max(0, currentTotal - 7) };

    setDraft((current) => updateTotal({
      ...current,
      accountAndContentAssignment: {
        ...current.accountAndContentAssignment,
        brandAccounts: distributeCount(current.accountAndContentAssignment.brandAccounts, allocation.brand),
        kosAccounts: distributeCount(current.accountAndContentAssignment.kosAccounts, allocation.kos),
        kocParticipants: {
          ...current.accountAndContentAssignment.kocParticipants,
          enabled: allocation.koc > 0,
          recruitmentCount: allocation.koc,
        },
      },
    }));
  };

  const handleCreate = () => {
    setFormNotice('');
    if (!draft.projectName.trim() || !draft.promotionTarget.targetName.trim() || !draft.coreStrategy.problemToSolve.trim() || !draft.promotionTarget.targetAudience.trim() || !draft.coreStrategy.contentLogic.trim()) {
      setFormError('请先完成方案名称、主推产品、核心问题、目标人群和内容方法。');
      setReviewTab('strategy');
      return;
    }
    if (primaryGoal === '搜索卡位' && !targetKeywords.trim()) {
      setFormError('搜索类方案需要填写目标关键词。');
      setReviewTab('strategy');
      return;
    }
    if (counts.total === 0) {
      setFormError('请至少安排 1 篇笔记。');
      setReviewTab('content');
      return;
    }
    if (!draft.startDate || !draft.endDate) {
      setFormError('请设置发布开始和结束日期。');
      setReviewTab('publish');
      return;
    }
    if (Date.parse(draft.endDate) < Date.parse(draft.startDate)) {
      setFormError('结束日期不能早于开始日期。');
      setReviewTab('publish');
      return;
    }
    setFormError('');
    onConfirm(draft, {
      targetKeywords,
      conversionGoal,
      publishFrequency,
      observationDays,
      needMaterials,
      allowIndustryFallback,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-page-bg text-text-main">
      <header className="h-16 shrink-0 border-b border-border-default bg-surface-1 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose} aria-label="关闭" className="w-8 h-8 rounded-lg border border-border-default hover:bg-hover-bg flex items-center justify-center text-text-tertiary">
            <X size={16} />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold">新建运营方案</h1>
            <p className="text-[13px] text-text-tertiary mt-0.5">从必要信息开始填写，或通过 AI 快速生成方案草稿。</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onOpenAIChat && (
            <button 
              type="button" 
              onClick={onOpenAIChat}
              className="inline-flex items-center gap-2 rounded-xl bg-surface-1 border border-neutral-900 px-4 py-2 text-[13px] font-semibold text-text-main hover:bg-hover-bg"
            >
              <Sparkles size={15} />
              AI 辅助创建
            </button>
          )}
        </div>
      </header>

      {step === 'review' ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="border-b border-border-default bg-surface-1 px-6">
            <div className="mx-auto max-w-[1320px] flex items-center gap-1">
              {REVIEW_TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setReviewTab(tab.id)} className={`px-5 py-3.5 text-left border-b-2 ${reviewTab === tab.id ? 'border-neutral-900 text-text-main' : 'border-transparent text-text-tertiary hover:text-text-main'}`}>
                  <span className="block text-[13px] font-semibold">{tab.label}</span>
                  <span className="block text-[11px] mt-0.5">{tab.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="mx-auto grid max-w-[1320px] gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
              <div className="space-y-4">
                {formError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{formError}</div> : null}
                {formNotice ? <div className="rounded-xl border border-border-default bg-surface-subtle px-4 py-3 text-[13px] text-text-secondary">{formNotice}</div> : null}

                {reviewTab === 'strategy' ? (
                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div className="flex items-center justify-between"><div><h2 className="text-[16px] font-semibold">策略与目标</h2><p className="text-[13px] text-text-tertiary mt-1">从必要信息开始填写，后续仍可继续修改。</p></div></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">方案名称 *</label><input value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} placeholder="例如：9月KOC真实体验验证" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="block text-[13px] font-semibold mb-1.5">主推产品 / 服务 *</label><input value={draft.promotionTarget.targetName} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetName: event.target.value } }))} placeholder="这轮主要推广什么" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
                      <div><label className="block text-[13px] font-semibold mb-1.5">站内承接</label><select value={conversionGoal} onChange={(event) => setConversionGoal(event.target.value)} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500 bg-surface-1"><option>收藏 / 关注</option><option>主页访问</option><option>商品访问</option><option>私信咨询</option><option>门店访问</option></select></div>
                    </div>
                    <div><label className="block text-[13px] font-semibold mb-2">本轮唯一主目标</label><div className="flex flex-wrap gap-2">{PRIMARY_GOALS.map((goal) => <button key={goal} type="button" onClick={() => { setPrimaryGoal(goal); setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, primaryBusinessGoal: GOAL_COPY[goal] } })); }} className={`px-3 py-2 rounded-xl border text-[13px] ${primaryGoal === goal ? 'bg-btn-main border-btn-main text-white' : 'bg-surface-1 border-border-default text-text-secondary hover:border-border-strong'}`}>{goal}</button>)}</div></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">核心问题 *</label><textarea rows={3} value={draft.coreStrategy.problemToSolve} onChange={(event) => setDraft((current) => ({ ...current, coreStrategy: { ...current.coreStrategy, problemToSolve: event.target.value } }))} placeholder="本轮具体要解决什么运营问题" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 outline-none focus:border-neutral-500 resize-none" /></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">目标人群 *</label><textarea rows={2} value={draft.promotionTarget.targetAudience} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetAudience: event.target.value } }))} placeholder="这轮内容主要给谁看" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 outline-none focus:border-neutral-500 resize-none" /></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">内容方法 *</label><textarea rows={3} value={draft.coreStrategy.contentLogic} onChange={(event) => setDraft((current) => ({ ...current, coreStrategy: { ...current.coreStrategy, contentLogic: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 outline-none focus:border-neutral-500 resize-none" /></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">目标关键词 <span className="font-normal text-text-tertiary">搜索类方案必填</span></label><input value={targetKeywords} onChange={(event) => setTargetKeywords(event.target.value)} placeholder="用逗号分隔关键词" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
                  </section>
                ) : null}

                {reviewTab === 'content' ? (
                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div className="flex items-center justify-between"><div><h2 className="text-[16px] font-semibold">内容与账号</h2><p className="text-[13px] text-text-tertiary mt-1">这里确认的数量是硬约束，后续AI不会自行改动。</p></div><div className="inline-flex items-center gap-1 text-[12px] text-text-secondary"><Lock size={13} />已锁定规则</div></div>
                    <div className="rounded-xl bg-surface-subtle border border-border-default p-4 flex items-center justify-between"><div><span className="text-[13px] text-text-secondary">本轮总笔记数</span><strong className="ml-3 text-[22px]">{counts.total}</strong></div><div className="text-[12px] text-text-tertiary">品牌 {counts.brand} · KOS {counts.kos} · KOC {counts.koc}</div></div>
                    <div><label className="block text-[13px] font-semibold mb-2">快捷分配</label><div className="flex flex-wrap gap-2"><button type="button" onClick={() => applyAccountPreset('all-koc')} className="px-3 py-2 rounded-xl border border-border-default text-[13px] hover:border-border-strong">全部KOC</button><button type="button" onClick={() => applyAccountPreset('koc-first')} className="px-3 py-2 rounded-xl border border-border-default text-[13px] hover:border-border-strong">KOC为主</button><button type="button" onClick={() => applyAccountPreset('owned-first')} className="px-3 py-2 rounded-xl border border-border-default text-[13px] hover:border-border-strong">自营为主</button><button type="button" onClick={() => applyAccountPreset('mixed')} className="px-3 py-2 rounded-xl border border-border-default text-[13px] hover:border-border-strong">混合矩阵</button></div></div>
                    <div className="divide-y divide-border-default rounded-xl border border-border-default">
                      {[{ role: 'brand' as const, label: '品牌主号', count: counts.brand }, { role: 'kos' as const, label: '店长号 / KOS', count: counts.kos }, { role: 'koc' as const, label: 'KOC体验官', count: counts.koc }].map((item) => (
                        <div key={item.role} className="flex items-center justify-between px-4 py-3.5"><div><div className="text-[13px] font-semibold">{item.label}</div><div className="text-[12px] text-text-tertiary mt-0.5">生成该类型账号的笔记数量</div></div><div className="flex items-center gap-2"><button type="button" onClick={() => updateRoleCount(item.role, item.count - 1)} className="w-8 h-8 rounded-lg border border-border-default">−</button><input type="number" min={0} value={item.count} onChange={(event) => updateRoleCount(item.role, Number(event.target.value))} className="w-14 h-8 text-center rounded-lg border border-border-default text-[13px]" /><button type="button" onClick={() => updateRoleCount(item.role, item.count + 1)} className="w-8 h-8 rounded-lg border border-border-default">＋</button></div></div>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div><label className="block text-[12px] font-semibold mb-1.5">品牌号写什么</label><input value={draft.accountAndContentAssignment.brandAccounts[0]?.contentDirection ?? ''} onChange={(event) => setDraft((current) => ({ ...current, accountAndContentAssignment: { ...current.accountAndContentAssignment, brandAccounts: current.accountAndContentAssignment.brandAccounts.map((account) => ({ ...account, contentDirection: event.target.value })) } }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div>
                      <div><label className="block text-[12px] font-semibold mb-1.5">KOS写什么</label><input value={draft.accountAndContentAssignment.kosAccounts[0]?.contentDirection ?? ''} onChange={(event) => setDraft((current) => ({ ...current, accountAndContentAssignment: { ...current.accountAndContentAssignment, kosAccounts: current.accountAndContentAssignment.kosAccounts.map((account) => ({ ...account, contentDirection: event.target.value })) } }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div>
                      <div><label className="block text-[12px] font-semibold mb-1.5">KOC写什么</label><input value={draft.accountAndContentAssignment.kocParticipants.contentDirection} onChange={(event) => setDraft((current) => ({ ...current, accountAndContentAssignment: { ...current.accountAndContentAssignment, kocParticipants: { ...current.accountAndContentAssignment.kocParticipants, contentDirection: event.target.value } } }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div>
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-border-default p-4 cursor-pointer"><input type="checkbox" checked={needMaterials} onChange={(event) => setNeedMaterials(event.target.checked)} className="mt-0.5 h-4 w-4 rounded text-text-main focus:ring-neutral-900" /><span><span className="block text-[13px] font-semibold">需要下发素材任务</span><span className="block text-[12px] text-text-tertiary mt-1">系统会根据内容方向生成拍摄要求和验收标准。</span></span></label>
                  </section>
                ) : null}

                {reviewTab === 'publish' ? (
                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div><h2 className="text-[16px] font-semibold">发布与验证</h2><p className="text-[13px] text-text-tertiary mt-1">确认发布周期、承接动作和复盘条件。</p></div>
                    <div className="grid md:grid-cols-3 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期</label><input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div><div><label className="block text-[13px] font-semibold mb-1.5">结束日期</label><input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div><div><label className="block text-[13px] font-semibold mb-1.5">发布频次</label><select value={publishFrequency} onChange={(event) => setPublishFrequency(event.target.value)} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px] bg-surface-1"><option>每天 1–2 篇</option><option>每天 1 篇</option><option>每周 3 篇</option><option>按账号错峰发布</option></select></div></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">本轮验证目标</label><textarea rows={3} value={draft.coreGoalAndVerification.primaryBusinessGoal} onChange={(event) => setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, primaryBusinessGoal: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 resize-none" /></div>
                    <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">继续铺量条件</label><textarea rows={3} value={draft.coreGoalAndVerification.successCriteria} onChange={(event) => setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, successCriteria: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 resize-none" /></div><div><label className="block text-[13px] font-semibold mb-1.5">暂停或换打法条件</label><textarea rows={3} value={draft.coreGoalAndVerification.stopCriteria} onChange={(event) => setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, stopCriteria: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 resize-none" /></div></div>
                    <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">发布后观察周期</label><div className="flex items-center gap-2"><input type="number" min={1} value={observationDays} onChange={(event) => setObservationDays(Math.max(1, Number(event.target.value)))} className="w-24 rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /><span className="text-[13px] text-text-secondary">天</span></div></div><div className="rounded-xl bg-surface-subtle border border-border-default p-3 text-[12px] text-text-secondary"><strong className="block text-text-main mb-1">发布后48小时</strong>自动生成首评、互动检查和搜索收录观察任务。</div></div>
                  </section>
                ) : null}
              </div>

              <aside className="space-y-4">
                <section className="rounded-xl border border-border-default bg-surface-1 p-5 sticky top-0">
                  <h3 className="text-[14px] font-semibold">本轮执行摘要</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-surface-subtle p-3"><div className="text-[12px] text-text-tertiary">笔记总数</div><div className="text-[20px] font-semibold mt-1">{counts.total} 篇</div></div><div className="rounded-xl bg-surface-subtle p-3"><div className="text-[12px] text-text-tertiary">观察周期</div><div className="text-[20px] font-semibold mt-1">{observationDays} 天</div></div></div>
                  <div className="mt-4 space-y-2 text-[13px]"><div className="flex justify-between"><span className="text-text-secondary">品牌主号</span><strong>{counts.brand} 篇</strong></div><div className="flex justify-between"><span className="text-text-secondary">店长号 / KOS</span><strong>{counts.kos} 篇</strong></div><div className="flex justify-between"><span className="text-text-secondary">KOC</span><strong>{counts.koc} 篇</strong></div><div className="flex justify-between pt-2 border-t border-border-default"><span className="text-text-secondary">站内承接</span><strong>{conversionGoal}</strong></div></div>

                  <div className="mt-5 border-t border-border-default pt-4"><div className="flex items-center justify-between"><h4 className="text-[13px] font-semibold">知识调用</h4><button type="button" onClick={onOpenContext} className="text-[12px] text-text-secondary hover:text-text-main">查看详情</button></div><div className="mt-3 space-y-2"><div className="flex items-center gap-2 text-[12px]"><Check size={13} /><span>商家知识 8 项</span></div><div className="flex items-center gap-2 text-[12px]"><BookOpen size={13} /><span>{industryName}默认知识 4 项</span></div><div className="flex items-center gap-2 text-[12px] text-amber-700"><Info size={13} /><span>2 项商家事实待补充</span></div></div><label className="mt-3 flex items-start gap-2 text-[12px] text-text-secondary cursor-pointer"><input type="checkbox" checked={allowIndustryFallback} onChange={(event) => setAllowIndustryFallback(event.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded text-text-main focus:ring-neutral-900" /><span>商家知识缺失时，使用行业通用方法补齐；不补造产品和门店事实。</span></label></div>

                  <div className="mt-5 rounded-xl border border-border-default bg-surface-subtle p-3 text-[12px] leading-5 text-text-secondary"><Target size={14} className="mb-1 text-text-main" />账号数量、笔记总数和用户明确限制将作为硬约束，AI重新生成时不会覆盖。</div>
                </section>
              </aside>
            </div>
          </div>

          <footer className="shrink-0 border-t border-border-default bg-surface-1 px-6 py-3.5">
            <div className="mx-auto max-w-[1320px] flex items-center justify-end"><div className="flex items-center gap-2"><button type="button" onClick={() => { setFormError(''); setFormNotice('草稿已保存在当前页面。'); }} className="px-4 py-2 rounded-xl border border-border-default text-[13px] font-semibold hover:bg-hover-bg">保存草稿</button><button type="button" onClick={handleCreate} className="px-5 py-2 rounded-xl bg-btn-main text-white text-[13px] font-semibold hover:bg-btn-main-hover inline-flex items-center gap-1.5">确认并创建方案 <ArrowRight size={14} /></button></div></div>
          </footer>
        </div>
      ) : null}
    </div>
  );
}
