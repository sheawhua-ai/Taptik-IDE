import React, { useState, useEffect } from 'react';

import { TargetAudienceBuilder } from './Builders/TargetAudienceBuilder';

import { TargetKeywordsBuilder } from './Builders/TargetKeywordsBuilder';
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
  Database,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import type { IndustryDefaults, MerchantIndustryProfile } from '../../../data/industryCatalog';
import type { StrategyDraftData } from './types';


const AVAILABLE_ACCOUNTS = {
  koc: [
    { id: 'koc-1', name: 'KOC-小红书达人-布丁' },
    { id: 'koc-2', name: 'KOC-宠物医生-王大夫' },
    { id: 'koc-3', name: 'KOC-多猫家庭-喵喵' },
    { id: 'koc-4', name: 'KOC-繁育人-张哥' }
  ],
  brand: [
    { id: 'brand_1', name: '品牌官方旗舰店' },
    { id: 'brand_2', name: '福利社' },
    { id: 'brand_3', name: '小助手' },
  ],
  kos: [
    { id: 'kos_1', name: '员工-小李' },
    { id: 'kos_2', name: '员工-王哥' },
    { id: 'kos_3', name: '员工-张姐' },
    { id: 'kos_4', name: '员工-赵赵' },
    { id: 'kos_5', name: '员工-孙二' },
  ]
};

export interface PlanCreationSettings {
  targetKeywords: string[];
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


function getCycleDays(start: string, end: string) {
  if (!start || !end) return 1;
  return Math.max(1, Math.ceil((Date.parse(end) - Date.parse(start)) / 86400000));
}

function getRoleCounts(draft: StrategyDraftData) {
  const brand = draft.accountAndContentAssignment.brandAccounts.reduce((sum, account) => sum + account.noteCount, 0);
  const kos = draft.accountAndContentAssignment.kosAccounts.reduce((sum, account) => sum + account.noteCount, 0);
  const koc = draft.accountAndContentAssignment.kocParticipants.enabled
    ? draft.accountAndContentAssignment.kocParticipants.recruitmentCount
    : 0;
  return { brand, kos, koc, total: brand + kos + koc };
}

function distributeCount<T extends { noteCount: number; id?: string; name?: string; roleInProject?: string; contentDirection?: string; frequency?: string; timeWindow?: string }>(accounts: T[], count: number): T[] {
  if (count === 0) {
    if (accounts.length === 1 && accounts[0].id === 'placeholder') return [];
    return accounts.map(a => ({ ...a, noteCount: 0 }));
  }
  let targetAccounts = accounts;
  if (targetAccounts.length === 0) {
    targetAccounts = [{
      id: 'placeholder',
      name: '待分配账号',
      roleInProject: '待定',
      contentDirection: '',
      frequency: '单次',
      timeWindow: '待定',
      noteCount: 0
    } as any];
  }
  const safeCount = Math.max(0, count);
  const base = Math.floor(safeCount / targetAccounts.length);
  const remainder = safeCount % targetAccounts.length;
  return targetAccounts.map((account, index) => ({
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
  const [primaryGoal, setPrimaryGoal] = useState<(typeof PRIMARY_GOALS)[number]>('搜索卡位');
  const [targetKeywords, setTargetKeywords] = useState<string[]>(['幼犬换粮', '幼犬软便', '换粮方法']);
  const [needMaterials, setNeedMaterials] = useState(true);
  const [allowIndustryFallback, setAllowIndustryFallback] = useState(true);
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const cycleDays = getCycleDays(draft.startDate, draft.endDate);

  useEffect(() => {
    setDraft(curr => {
      let changed = false;
      const newBrand = curr.accountAndContentAssignment.brandAccounts.map(a => {
        if (a.noteCount !== cycleDays) { changed = true; return { ...a, noteCount: cycleDays }; }
        return a;
      });
      const newKos = curr.accountAndContentAssignment.kosAccounts.map(a => {
        if (a.noteCount !== cycleDays) { changed = true; return { ...a, noteCount: cycleDays }; }
        return a;
      });
      if (changed) {
        return updateTotal({
          ...curr,
          accountAndContentAssignment: {
            ...curr.accountAndContentAssignment,
            brandAccounts: newBrand,
            kosAccounts: newKos
          }
        });
      }
      return curr;
    });
  }, [cycleDays]);

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
    // Determine number of accounts (not notes) to pick based on preset
    const allocation = preset === 'all-koc'
      ? { brand: 0, kos: 0, koc: 10 }
      : preset === 'koc-first'
        ? { brand: 1, kos: 1, koc: 8 }
        : preset === 'owned-first'
          ? { brand: 2, kos: 3, koc: 0 }
          : { brand: 1, kos: 2, koc: 5 };

    setDraft((current) => updateTotal({
      ...current,
      accountAndContentAssignment: {
        ...current.accountAndContentAssignment,
        brandAccounts: AVAILABLE_ACCOUNTS.brand.slice(0, allocation.brand).map(a => ({
          id: a.id, name: a.name, roleInProject: '品牌发布', contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays
        })),
        kosAccounts: AVAILABLE_ACCOUNTS.kos.slice(0, allocation.kos).map(a => ({
          id: a.id, name: a.name, roleInProject: '员工发布', contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays
        })),
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
    if (!draft.projectName.trim() || !draft.promotionTarget.targetName.trim() || !draft.promotionTarget.targetAudience.trim()) {
      setFormError('请先完成方案名称、主推产品和目标人群。');
      return;
    }
    if (primaryGoal === '搜索卡位' && targetKeywords.length === 0) {
      setFormError('搜索类方案需要填写目标关键词。');
      return;
    }
    if (counts.total === 0) {
      setFormError('请至少安排 1 篇笔记。');
      return;
    }
    if (!draft.startDate || !draft.endDate) {
      setFormError('请设置发布开始和结束日期。');
      return;
    }
    if (Date.parse(draft.endDate) < Date.parse(draft.startDate)) {
      setFormError('结束日期不能早于开始日期。');
      return;
    }
    setFormError('');
    onConfirm(draft, {
      targetKeywords,
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


          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="mx-auto max-w-[800px] gap-5">
              <div className="space-y-4">
                {formError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{formError}</div> : null}
                {formNotice ? <div className="rounded-xl border border-border-default bg-surface-subtle px-4 py-3 text-[13px] text-text-secondary">{formNotice}</div> : null}

                
                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div className="flex items-center justify-between"><div><h2 className="text-[16px] font-semibold">策略与目标</h2><p className="text-[13px] text-text-tertiary mt-1">从必要信息开始填写，后续仍可继续修改。</p></div></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">方案名称 *</label><input value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} placeholder="例如：9月KOC真实体验验证" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-1.5">起止时间 *</label>
                      <div className="flex items-center gap-2 w-full rounded-xl border border-border-default px-3.5 py-2 text-[13px] outline-none focus-within:border-neutral-500 bg-white">
                        <span className="text-text-tertiary">从</span>
                        <input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="bg-transparent outline-none flex-1 cursor-pointer" />
                        <span className="text-text-tertiary">至</span>
                        <input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="bg-transparent outline-none flex-1 cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <div>
  <label className="block text-[13px] font-semibold mb-1.5">主推产品 / 服务 *</label>
  <input value={draft.promotionTarget.targetName} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetName: event.target.value } }))} placeholder="这轮主要推广什么，如果知识库还没有，则可以手动填写。" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" />
  <div className="mt-2 flex flex-wrap gap-2 items-center">
    <span className="text-[12px] text-text-tertiary">商家知识库:</span>
    {['无谷高蛋白鲜肉全价幼犬粮', '成犬低脂配方粮', '宠物益生菌'].map(tag => {
      const isSelected = draft.promotionTarget.targetName === tag;
      return (
        <button 
          key={tag} 
          type="button" 
          onClick={() => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, targetName: tag } }))} 
          className={`rounded-md border px-2 py-1 text-[12px] transition-colors ${isSelected ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-surface-subtle border-border-default text-text-secondary hover:bg-surface-2'}`}
        >
          {tag}
        </button>
      );
    })}
  </div>
</div>

                    </div>
                    <div><label className="block text-[13px] font-semibold mb-2">本轮唯一主目标</label><div className="flex flex-wrap gap-2">{PRIMARY_GOALS.map((goal) => <button key={goal} type="button" onClick={() => { setPrimaryGoal(goal); setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, primaryBusinessGoal: GOAL_COPY[goal] } })); }} className={`px-3 py-2 rounded-xl border text-[13px] ${primaryGoal === goal ? 'bg-btn-main border-btn-main text-white' : 'bg-surface-1 border-border-default text-text-secondary hover:border-border-strong'}`}>{goal}</button>)}</div></div>
                    

                    <TargetAudienceBuilder 
                      value={draft.promotionTarget.targetAudience}
                      onChange={(val) => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, targetAudience: val } }))}
                      audienceTags={draft.promotionTarget.audience_tags}
                      onAudienceTagsChange={(tags) => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, audience_tags: tags } }))}
                    />
                    
                    
                  </section>
                

                
                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div className="flex items-center justify-between"><div><h2 className="text-[16px] font-semibold">账号与分发</h2></div><div className="inline-flex items-center gap-1 text-[12px] text-text-secondary"><Lock size={13} />已锁定规则</div></div>
                    
                    
                    <div className="divide-y divide-border-default rounded-xl border border-border-default">
                      {[{ role: 'brand' as const, label: '品牌主号', accounts: draft.accountAndContentAssignment.brandAccounts }, { role: 'kos' as const, label: '员工号 / KOS', accounts: draft.accountAndContentAssignment.kosAccounts }].map((item) => (
                        <div key={item.role} className="px-4 py-3.5">
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRole(expandedRole === item.role ? null : item.role)}>
                            <div>
                              <div className="text-[13px] font-semibold">{item.label}</div>
                              <div className="text-[12px] text-text-tertiary mt-0.5">
                                {item.accounts.length > 0 
                                  ? `已选 ${item.accounts.length} 个账号`
                                  : '未分配账号'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                              <span className="text-[12px] hover:text-text-main underline">选择账号</span>
                            </div>
                          </div>
                          {expandedRole === item.role && (
                            <div className="mt-3 p-3 bg-surface-subtle border border-border-default rounded-lg">
                              <div className="text-[12px] font-semibold text-text-secondary mb-2">选择参与账号</div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {AVAILABLE_ACCOUNTS[item.role].map(acc => {
                                  const isSelected = item.accounts.some(a => a.id === acc.id);
                                  return (
                                    <button 
                                      key={acc.id} 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDraft(curr => {
                                          const isBrand = item.role === 'brand';
                                          const list = isBrand ? curr.accountAndContentAssignment.brandAccounts : curr.accountAndContentAssignment.kosAccounts;
                                          const nextList = isSelected 
                                            ? list.filter(a => a.id !== acc.id)
                                            : [...list, { id: acc.id, name: acc.name, roleInProject: isBrand ? '品牌发布' : '员工发布', contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays }];
                                          
                                          return updateTotal({
                                            ...curr,
                                            accountAndContentAssignment: {
                                              ...curr.accountAndContentAssignment,
                                              ...(isBrand ? { brandAccounts: nextList } : { kosAccounts: nextList })
                                            }
                                          });
                                        })
                                      }}
                                      className={`px-3 py-1.5 text-[12px] rounded-md border flex items-center gap-1.5 transition-colors ${isSelected ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-surface-1 border-border-default text-text-secondary hover:bg-surface-subtle'}`}
                                    >
                                      {isSelected && <Check size={12} />}
                                      {acc.name}
                                    </button>
                                  )
                                })}
                              </div>
                              <div className="pt-3 border-t border-border-default">
                                <div className="text-[12px] font-semibold text-text-secondary mb-2 flex items-center justify-between">
                                  <span>选择内容模板 (可选)</span>
                                </div>
                                <select className="w-full bg-surface-1 border border-border-default rounded-lg px-2 py-1.5 text-[12px] outline-none text-text-main">
                                  <option value="">不使用预设模板 (由AI自动决策)</option>
                                  <option value="template-1">模板：科普评测风 (适合成分党)</option>
                                  <option value="template-2">模板：开箱体验风 (适合新手)</option>
                                  <option value="template-3">模板：剧情反转风 (适合泛流量)</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="px-4 py-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[13px] font-semibold">KOC体验官 (招募人数 = 笔记数)</div>
                          <div className="text-[12px] text-text-tertiary mt-0.5">本周期共发布 {draft.accountAndContentAssignment.kocParticipants.recruitmentCount || 0} 篇笔记</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min="0"
                            placeholder="输入招募人数" 
                            value={draft.accountAndContentAssignment.kocParticipants.recruitmentCount || ''} 
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setDraft(curr => updateTotal({
                                ...curr,
                                accountAndContentAssignment: {
                                  ...curr.accountAndContentAssignment,
                                  kocParticipants: {
                                    ...curr.accountAndContentAssignment.kocParticipants,
                                    enabled: val > 0,
                                    recruitmentCount: val
                                  }
                                }
                              }));
                            }}
                            className="w-24 h-8 text-center rounded-lg border border-border-default text-[13px] outline-none" 
                          />
                        </div>
                      </div>
                      </div>
                    <label className="flex items-start gap-3 rounded-xl border border-border-default p-4 cursor-pointer"><input type="checkbox" checked={needMaterials} onChange={(event) => setNeedMaterials(event.target.checked)} className="mt-0.5 h-4 w-4 rounded text-text-main focus:ring-neutral-900" /><span><span className="block text-[13px] font-semibold">需要下发素材任务</span><span className="block text-[12px] text-text-tertiary mt-1">系统会根据内容方向生成拍摄要求和验收标准。</span></span></label>
                  </section>
                

                
                  
                
              </div>

              
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
