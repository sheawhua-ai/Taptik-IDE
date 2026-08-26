import React, { useState } from 'react';
import { 
  CheckCircle2, ChevronDown, ChevronUp, Layers, Users, 
  Target, ShieldCheck, FileText, Check, Sparkles, ArrowRight,
  Calendar, Eye, HelpCircle, AlertTriangle, Clock, Bot, UserCheck
} from 'lucide-react';
import { StrategyDraftData } from './types';

interface StrategyDraftChatCardProps {
  draft: StrategyDraftData;
  onConfirmAndCreate: () => void;
  onQuickModify?: (prompt: string) => void;
  isConfirmed?: boolean;
}

export function StrategyDraftChatCard({
  draft,
  onConfirmAndCreate,
  onQuickModify,
  isConfirmed = false
}: StrategyDraftChatCardProps) {
  const [expandedSection, setExpandedSection] = useState<'all' | 'none' | 'accounts' | 'goals'>('all');
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(true);

  return (
    <div className="mt-3 bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm text-[12.5px] transition-all">
      
      {/* 1. Header Banner */}
      <div className="p-4 bg-surface-subtle border-b border-border-default flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary text-[14px]">
              {draft.projectName}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
              isConfirmed 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {isConfirmed ? '打法已固化' : '待确认打法方案'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              <span>周期：{draft.cycleDays} 天 ({draft.startDate} 至 {draft.endDate})</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Layers size={12} />
              <span>总规划：{draft.accountAndContentAssignment.totalNotesCount} 篇笔记</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAllExpanded(!isAllExpanded)}
          className="px-2.5 py-1 text-[11.5px] bg-surface-1 hover:bg-surface-hover border border-border-default rounded-md text-text-secondary transition-colors flex items-center gap-1"
        >
          <span>{isAllExpanded ? '收起详情' : '展开 6 大模块'}</span>
          {isAllExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* 2. Strategy 6-Module Structured Body */}
      {isAllExpanded && (
        <div className="p-4 space-y-4 divide-y divide-border-subtle bg-white">
          
          {/* Module 1: 推广对象与受众画像 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-text-primary font-semibold text-[13px]">
              <Target size={14} className="text-text-secondary" />
              <span>1. 推广对象与受众画像</span>
            </div>
            <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-1.5 text-[12px]">
              <div className="flex items-start justify-between">
                <span className="text-text-tertiary shrink-0 w-20">推广单品：</span>
                <span className="font-medium text-text-primary flex-1">
                  {draft.promotionTarget.targetName} ({draft.promotionTarget.targetCategory})
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-text-tertiary shrink-0 w-20">目标受众：</span>
                <span className="text-text-secondary flex-1">
                  {draft.promotionTarget.targetAudience}
                </span>
              </div>
              <div className="flex items-start justify-between pt-1 border-t border-border-subtle">
                <span className="text-text-tertiary shrink-0 w-20">已载入事实：</span>
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {draft.promotionTarget.confirmedFacts.map((fact, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-white border border-border-default rounded text-[11px] text-text-secondary">
                      {fact.label}: {fact.detail}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: 核心目标与验证方式 */}
          <div className="pt-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-text-primary font-semibold text-[13px]">
              <Target size={14} className="text-text-secondary" />
              <span>2. 核心业务目标与验证方式 (唯一目标)</span>
            </div>
            <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-2 text-[12px]">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                <div>
                  <span className="text-text-tertiary block text-[11px]">主要业务目标：</span>
                  <span className="font-medium text-text-primary leading-relaxed">
                    {draft.coreGoalAndVerification.primaryBusinessGoal}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                <div className="p-2 bg-white border border-border-subtle rounded text-[11.5px] space-y-0.5">
                  <span className="text-emerald-700 font-medium block">✓ 继续/放大条件</span>
                  <span className="text-text-secondary">{draft.coreGoalAndVerification.successCriteria}</span>
                </div>
                <div className="p-2 bg-white border border-border-subtle rounded text-[11.5px] space-y-0.5">
                  <span className="text-rose-700 font-medium block">✕ 停止/调优条件</span>
                  <span className="text-text-secondary">{draft.coreGoalAndVerification.stopCriteria}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: 核心打法与内容逻辑 */}
          <div className="pt-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-text-primary font-semibold text-[13px]">
              <FileText size={14} className="text-text-secondary" />
              <span>3. 核心打法与内容逻辑</span>
            </div>
            <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-1.5 text-[12px]">
              <div className="text-text-primary font-medium">
                {draft.coreStrategy.problemToSolve}
              </div>
              <p className="text-text-secondary leading-relaxed text-[11.5px]">
                {draft.coreStrategy.contentLogic}
              </p>
              <div className="pt-1 text-[11px] text-text-tertiary">
                <strong>协同机制：</strong>{draft.coreStrategy.collaborationMechanism}
              </div>
            </div>
          </div>

          {/* Module 4: 内容与账号分工 */}
          <div className="pt-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-text-primary font-semibold text-[13px]">
                <Users size={14} className="text-text-secondary" />
                <span>4. 内容与账号分工</span>
              </div>
              <span className="text-[11.5px] font-semibold text-text-primary">
                共 {draft.accountAndContentAssignment.totalNotesCount} 篇笔记槽位
              </span>
            </div>

            <div className="space-y-2">
              {/* Brand account */}
              <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg flex items-center justify-between text-[12px]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{draft.accountAndContentAssignment.brandAccounts[0]?.name || '品牌官方主号'}</span>
                    <span className="text-[11px] text-text-tertiary">({draft.accountAndContentAssignment.brandAccounts.length} 个账号)</span>
                  </div>
                  <div className="text-[11.5px] text-text-secondary mt-0.5">
                    方向：{draft.accountAndContentAssignment.brandAccounts[0]?.contentDirection || '品牌核心信息表达'}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-semibold text-text-primary text-[13px]">
                    {draft.accountAndContentAssignment.brandAccounts.reduce((acc, b) => acc + b.noteCount, 0)} 篇
                  </span>
                  <span className="text-[10.5px] text-text-tertiary block">每周 1 篇</span>
                </div>
              </div>

              {/* KOS accounts */}
              <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg flex items-center justify-between text-[12px]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{draft.accountAndContentAssignment.kosAccounts[0]?.name || '专业账号 (KOS)'}</span>
                    <span className="text-[11px] text-text-tertiary">({draft.accountAndContentAssignment.kosAccounts.length} 个账号)</span>
                  </div>
                  <div className="text-[11.5px] text-text-secondary mt-0.5">
                    方向：{draft.accountAndContentAssignment.kosAccounts[0]?.contentDirection || '专业场景解答'}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-semibold text-text-primary text-[13px]">
                    {draft.accountAndContentAssignment.kosAccounts.reduce((acc, k) => acc + k.noteCount, 0)} 篇
                  </span>
                  <span className="text-[10.5px] text-text-tertiary block">按参与账号分配</span>
                </div>
              </div>

              {/* KOC participants */}
              {draft.accountAndContentAssignment.kocParticipants.enabled && (
                <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg flex items-center justify-between text-[12px]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">{draft.accountAndContentAssignment.kocParticipants.roleInProject || '消费者真实体验官 (KOC)'}</span>
                      <span className="text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        体验打卡池
                      </span>
                    </div>
                    <div className="text-[11.5px] text-text-secondary mt-0.5">
                      方向：{draft.accountAndContentAssignment.kocParticipants.contentDirection}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="font-semibold text-text-primary text-[13px]">
                      {draft.accountAndContentAssignment.kocParticipants.recruitmentCount} 篇
                    </span>
                    <span className="text-[10.5px] text-text-tertiary block">招募 {draft.accountAndContentAssignment.kocParticipants.recruitmentCount} 人</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Module 5: 人在环路与风控节点 */}
          <div className="pt-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-text-primary font-semibold text-[13px]">
              <ShieldCheck size={14} className="text-text-secondary" />
              <span>5. 人在环路与风控节点 (合规与物料质检)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px]">
              <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary text-[11px]">
                  <Bot size={13} className="text-slate-600" />
                  <span>系统全自动执行：</span>
                </div>
                <ul className="space-y-1 text-text-secondary">
                  {draft.humanInTheLoop.systemAutomated.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-900 text-[11px]">
                  <UserCheck size={13} className="text-emerald-700" />
                  <span>运营必须人工确认：</span>
                </div>
                <ul className="space-y-1 text-text-secondary">
                  {draft.humanInTheLoop.operatorRequired.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Module 6: 假设核验 */}
          <div className="pt-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-text-primary font-semibold text-[13px]">
              <Clock size={14} className="text-text-secondary" />
              <span>6. 假设核验与监控指标</span>
            </div>
            <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-[11.5px] space-y-1.5">
              <div className="text-text-secondary">
                <strong className="text-text-primary">核心假设：</strong>{draft.hypothesesAndBasis.pendingHypotheses[0]?.text || '当前内容结构与账号分工能够改善搜索收录和发布后反馈。'}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-border-subtle text-[11px] text-text-tertiary">
                <span>持续观察：搜索位置、平台收录、发布后反馈与KOC问卷提交率</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. Bottom Action Bar (Integrated Inside Chat) */}
      <div className="p-4 bg-surface-subtle border-t border-border-default space-y-3">
        
        {/* Quick adjustments chips */}
        {!isConfirmed && onQuickModify && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-text-tertiary">
              <span>在聊天中快速微调打法：</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                '调整品牌号与KOC的内容配比',
                '当前拍摄资源有限，降低素材任务量',
                '将参与账号错开发布时间',
                '将打法周期缩短为7天快速验证'
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => onQuickModify(suggestion)}
                  className="px-2.5 py-1 bg-white hover:bg-surface-hover hover:border-border-strong border border-border-default rounded-md text-[11px] text-text-secondary transition-colors text-left flex items-center gap-1"
                >
                  <Sparkles size={11} className="text-text-tertiary" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <div className="text-[12px] text-text-tertiary">
            确认后将按当前账号分工生成发布计划与素材需求
          </div>

          <div className="flex items-center gap-2">
            {!isConfirmed && (
              <button
                type="button"
                onClick={onConfirmAndCreate}
                className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check size={14} />
                <span>确认打法并创建方案</span>
              </button>
            )}

            {isConfirmed && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[12.5px] px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 size={15} />
                <span>方案打法已确认生效</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
