import React, { useState } from 'react';
import { 
  Check, Edit2, Sparkles, Send, ArrowLeft, CheckCircle2, 
  Layers, Users, ShieldCheck, HelpCircle, Bot, User, 
  AlertCircle, ChevronDown, ChevronRight, CornerDownRight,
  Target, Calendar, Clock, FileText, CheckSquare, Plus
} from 'lucide-react';
import { StrategyDraftData } from './types';

interface StrategyDraftViewProps {
  draft: StrategyDraftData;
  onUpdateDraft: (updated: StrategyDraftData) => void;
  onBackToDialogue: () => void;
  onConfirmAndCreate: () => void;
  onNaturalLanguageModify: (prompt: string) => void;
}

export function StrategyDraftView({
  draft,
  onUpdateDraft,
  onBackToDialogue,
  onConfirmAndCreate,
  onNaturalLanguageModify
}: StrategyDraftViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(draft.projectName);
  const [naturalCommand, setNaturalCommand] = useState('');
  
  // Active editing module state for direct inline modification
  const [editingModule, setEditingModule] = useState<string | null>(null);

  const handleSaveName = () => {
    if (projectName.trim()) {
      onUpdateDraft({ ...draft, projectName: projectName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSendModifyCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!naturalCommand.trim()) return;
    onNaturalLanguageModify(naturalCommand);
    setNaturalCommand('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-canvas overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-surface-1 border-b border-border-default px-8 py-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDialogue}
            className="w-8 h-8 rounded-lg border border-border-default hover:bg-surface-hover flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
            title="返回信息确认"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="h-7 px-2 bg-white border border-border-strong rounded text-[15px] font-semibold text-text-primary outline-none focus:border-neutral-900"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="px-2 py-1 bg-action-primary text-white rounded text-[13px] font-medium"
                  >
                    保存
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-[17px] font-semibold text-text-primary tracking-tight">
                    {draft.projectName}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-text-tertiary hover:text-text-primary p-0.5 rounded"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              )}

              <span className="text-[13px] px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-800 border border-blue-200">
                待确认打法
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[13px] text-text-tertiary">
              <span>项目周期：{draft.cycleDays} 天 ({draft.startDate} 至 {draft.endDate})</span>
              <span>·</span>
              <span>共规划 {draft.accountAndContentAssignment.totalNotesCount} 篇内容</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onConfirmAndCreate}
            className="px-5 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Check size={15} />
            <span>确认打法并创建项目</span>
          </button>
        </div>
      </div>

      {/* Main Draft Workspace: 6 Core Modules Container */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        
        {/* Single Workstation Surface Container */}
        <div className="bg-surface-1 rounded-xl border border-border-default shadow-sm divide-y divide-border-default overflow-hidden">
          
          {/* Module 1: 推广对象 */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-text-primary text-[13px] font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-[14.5px] font-semibold text-text-primary">
                  推广对象与事实依据
                </h2>
              </div>
            </div>

            <div className="bg-surface-subtle border border-border-subtle rounded-lg p-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-text-tertiary text-[13px] block mb-0.5">推广主体 / 核心产品</span>
                  <span className="font-semibold text-text-primary">
                    {draft.promotionTarget.targetName}
                  </span>
                  <span className="ml-2 text-[13px] text-text-tertiary">({draft.promotionTarget.targetCategory})</span>
                </div>
                <div>
                  <span className="text-text-tertiary text-[13px] block mb-0.5">目标人群与核心场景</span>
                  <span className="text-text-secondary">
                    {draft.promotionTarget.targetAudience}
                  </span>
                </div>
              </div>

              {/* Confirmed facts */}
              <div className="pt-2 border-t border-border-subtle">
                <span className="text-[13px] font-medium text-text-tertiary block mb-1.5">已确认事实依据 (系统来源可追溯):</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[13px]">
                  {draft.promotionTarget.confirmedFacts.map((fact, fIdx) => (
                    <div key={fIdx} className="p-2.5 bg-white border border-border-subtle rounded-lg">
                      <div className="text-[13px] text-emerald-800 font-semibold mb-0.5">{fact.source}</div>
                      <div className="font-medium text-text-primary text-[13px]">{fact.label}</div>
                      <div className="text-[13px] text-text-tertiary mt-0.5">{fact.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps */}
              {draft.promotionTarget.unconfirmedGaps.length > 0 && (
                <div className="pt-2 text-[13px] text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/80 flex items-center gap-2">
                  <AlertCircle size={13} className="shrink-0 text-amber-700" />
                  <span>尚未确认缺口：{draft.promotionTarget.unconfirmedGaps.join('；')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Module 2: 核心目标与验证方式 (唯一主要业务目标) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-text-primary text-[13px] font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-[14.5px] font-semibold text-text-primary">
                  核心目标与闭环验证方式 (唯一主要目标)
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-[13px]">
              {/* Primary Goal Callout */}
              <div className="p-4 bg-surface-subtle border-l-2 border-l-brand-500 border-t border-r border-b border-border-default rounded-r-lg">
                <span className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                  唯一主要业务目标 (Primary Business Goal)
                </span>
                <div className="text-[14px] font-semibold text-text-primary">
                  {draft.coreGoalAndVerification.primaryBusinessGoal}
                </div>
              </div>

              {/* 3 Observable Signals */}
              <div>
                <span className="text-[13px] font-medium text-text-tertiary block mb-2">本周期可观察的验证信号:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {draft.coreGoalAndVerification.observableSignals.map((signal, sIdx) => (
                    <div key={sIdx} className="p-3 bg-surface-subtle border border-border-subtle rounded-lg text-[13px]">
                      <div className="text-text-tertiary text-[13px] font-semibold mb-1">
                        验证信号 {sIdx + 1}
                      </div>
                      <div className="text-text-secondary leading-relaxed font-medium">
                        {signal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Rules: Continue / Adjust / Stop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[13px]">
                <div className="p-3 bg-emerald-50/40 border border-emerald-200/60 rounded-lg">
                  <span className="text-[13px] text-emerald-800 font-bold block mb-0.5">如何判断继续 (Success)</span>
                  <span className="text-emerald-950">{draft.coreGoalAndVerification.successCriteria}</span>
                </div>
                <div className="p-3 bg-blue-50/40 border border-blue-200/60 rounded-lg">
                  <span className="text-[13px] text-blue-800 font-bold block mb-0.5">何时需调整 (Adjustment)</span>
                  <span className="text-blue-950">{draft.coreGoalAndVerification.adjustmentCriteria}</span>
                </div>
                <div className="p-3 bg-rose-50/40 border border-rose-200/60 rounded-lg">
                  <span className="text-[13px] text-rose-800 font-bold block mb-0.5">何时需终止 (Stop Rule)</span>
                  <span className="text-rose-950">{draft.coreGoalAndVerification.stopCriteria}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: 核心打法 */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-text-primary text-[13px] font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-[14.5px] font-semibold text-text-primary">
                  核心打法与业务逻辑
                </h2>
              </div>
            </div>

            <div className="p-4 bg-surface-subtle border border-border-subtle rounded-lg space-y-3 text-[13px] leading-relaxed">
              <div>
                <span className="font-semibold text-text-primary mr-1">本轮解决问题:</span>
                <span className="text-text-secondary">{draft.coreStrategy.problemToSolve}</span>
              </div>
              <div>
                <span className="font-semibold text-text-primary mr-1">内容与策略逻辑:</span>
                <span className="text-text-secondary">{draft.coreStrategy.contentLogic}</span>
              </div>
              <div>
                <span className="font-semibold text-text-primary mr-1">选择此打法原因:</span>
                <span className="text-text-secondary">{draft.coreStrategy.rationale}</span>
              </div>
              <div>
                <span className="font-semibold text-text-primary mr-1">账号与动作协同:</span>
                <span className="text-text-secondary">{draft.coreStrategy.collaborationMechanism}</span>
              </div>
            </div>
          </div>

          {/* Module 4: 内容与账号分工 (真实存在账号) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-text-primary text-[13px] font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-[14.5px] font-semibold text-text-primary">
                  内容与账号分工 (真实接入资产)
                </h2>
              </div>
              <div className="text-[13px] text-text-secondary">
                规划总量: <strong className="text-text-primary font-semibold">{draft.accountAndContentAssignment.totalNotesCount} 篇笔记</strong>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              
              {/* Brand Account Rows */}
              {draft.accountAndContentAssignment.brandAccounts.map((acc) => (
                <div key={acc.id} className="p-3.5 bg-surface-subtle border border-border-subtle rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded font-semibold">品牌主号</span>
                      <span className="font-semibold text-text-primary">{acc.name}</span>
                      <span className="text-[13px] text-text-tertiary">({acc.fans} 粉丝)</span>
                    </div>
                    <div className="text-[13px] text-text-secondary">
                      承担角色：{acc.roleInProject} · 方向：{acc.contentDirection}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">{acc.noteCount} 篇</div>
                    <div className="text-[13px] text-text-tertiary">{acc.frequency} · {acc.timeWindow}</div>
                  </div>
                </div>
              ))}

              {/* KOS Store Accounts Summary */}
              <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] px-1.5 py-0.2 bg-blue-100 text-blue-900 rounded font-semibold">店长号/KOS矩阵</span>
                    <span className="font-semibold text-text-primary">5家核心门店店长号 (上海、北京、广州、成都)</span>
                  </div>
                  <div className="font-semibold text-text-primary">共 5 篇 (每店1篇)</div>
                </div>
                <div className="text-[13px] text-text-secondary">
                  角色分工：专业顾问答疑与同城到店领样 · 错开在项目第3、5、7、9、11天晚间发布
                </div>
              </div>

              {/* KOC Consumer Experience Pool */}
              {draft.accountAndContentAssignment.kocParticipants.enabled && (
                <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-semibold">真实消费者KOC</span>
                      <span className="font-semibold text-text-primary">招募 {draft.accountAndContentAssignment.kocParticipants.recruitmentCount} 名真实体验官</span>
                    </div>
                    <div className="font-semibold text-text-primary">共 {draft.accountAndContentAssignment.kocParticipants.recruitmentCount} 篇</div>
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    要求规格：{draft.accountAndContentAssignment.kocParticipants.requiredMaterialSpecs} · 需填写体验问卷
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Module 5: 资源与人在环路 (明确区分自动与人工) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-text-primary text-[13px] font-bold flex items-center justify-center">
                  5
                </span>
                <h2 className="text-[14.5px] font-semibold text-text-primary">
                  资源与人在环路 (系统自动化 vs 操盘手人工把控)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              
              {/* System Automated Column */}
              <div className="p-4 bg-surface-subtle border border-border-subtle rounded-lg space-y-2.5">
                <div className="flex items-center gap-1.5 text-neutral-800 font-semibold pb-2 border-b border-border-subtle">
                  <Bot size={15} />
                  <span>系统可自动完成</span>
                </div>
                <div className="space-y-2 text-[13px] text-text-secondary">
                  {draft.humanInTheLoop.systemAutomated.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Required Column */}
              <div className="p-4 bg-amber-50/30 border border-amber-200/70 rounded-lg space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold pb-2 border-b border-amber-200/80">
                  <User size={15} className="text-amber-700" />
                  <span>需要操盘手/人工介入</span>
                </div>
                <div className="space-y-2 text-[13px] text-amber-950">
                  {draft.humanInTheLoop.operatorRequired.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Module 6: 假设与依据 (三类清晰区分) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-text-primary text-[13px] font-bold flex items-center justify-center">
                  6
                </span>
                <h2 className="text-[14.5px] font-semibold text-text-primary">
                  假设与依据核验
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              
              {/* Confirmed Facts */}
              <div className="space-y-1.5">
                <span className="text-text-tertiary font-medium text-[13px]">已确认事实清单：</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {draft.hypothesesAndBasis.confirmedFacts.map((cf) => (
                    <div key={cf.id} className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg">
                      <div className="text-[13px] text-emerald-800 font-semibold mb-0.5">{cf.source}</div>
                      <div className="text-text-primary font-medium">{cf.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Hypotheses */}
              <div className="space-y-1.5 pt-2">
                <span className="text-text-tertiary font-medium text-[13px]">AI 暂定假设 (非平台硬性规则，待执行数据验证)：</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {draft.hypothesesAndBasis.pendingHypotheses.map((ph) => (
                    <div key={ph.id} className="p-2.5 bg-amber-50/50 border border-amber-200/70 rounded-lg">
                      <div className="text-[13px] text-amber-800 font-bold mb-0.5">AI 暂定假设</div>
                      <div className="text-amber-950 font-medium">{ph.text}</div>
                      <div className="text-[13px] text-amber-800/80 mt-1">{ph.basis}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom Natural Language Strategy Proposal Bar */}
      <div className="px-8 py-3 bg-surface-1 border-t border-border-default shrink-0 flex items-center gap-3">
        <form onSubmit={handleSendModifyCommand} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={naturalCommand}
            onChange={(e) => setNaturalCommand(e.target.value)}
            placeholder="用自然语言协同调整打法（如：品牌号减少2篇，把真实体验增加给KOC；我们只有1名摄影，降低素材任务量）..."
            className="flex-1 h-9 px-3.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-strong focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!naturalCommand.trim()}
            className="h-9 px-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles size={13} />
            <span>生成修改提案</span>
          </button>
        </form>

        <div className="h-4 w-[1px] bg-border-default mx-1" />

        <button
          type="button"
          onClick={onConfirmAndCreate}
          className="h-9 px-5 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Check size={14} />
          <span>确认打法并创建项目</span>
        </button>
      </div>

    </div>
  );
}
