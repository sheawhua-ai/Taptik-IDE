import React from 'react';
import { Sparkles, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { StrategyChangeProposal } from './types';

interface ProposalDiffChatCardProps {
  proposal: StrategyChangeProposal;
  onAccept: (proposal: StrategyChangeProposal) => void;
  onReject?: () => void;
}

export function ProposalDiffChatCard({
  proposal,
  onAccept,
  onReject
}: ProposalDiffChatCardProps) {
  return (
    <div className="mt-3 bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm text-[13px] space-y-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <span className="font-semibold text-text-primary text-[13px]">
            AI 策略变更提案 (Diff)
          </span>
        </div>
        <span className="text-[13px] px-2 py-0.5 bg-surface-subtle border border-border-default rounded font-medium text-text-secondary">
          影响 {proposal.impactScope.affectedNotesCount} 篇笔记
        </span>
      </div>

      {/* AI Interpretation */}
      <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-[13px] text-text-primary leading-relaxed">
        <strong className="text-text-secondary font-medium">调整理解：</strong>
        {proposal.aiInterpretation}
      </div>

      {/* Before / After Table */}
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-text-tertiary">
          变更前后对比：
        </div>
        <div className="space-y-1.5">
          {proposal.diffSummary.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-white border border-border-subtle rounded-lg space-y-1">
              <div className="text-[13px] font-semibold text-text-tertiary">
                {item.moduleName}
              </div>
              <div className="text-[13px] text-rose-800 line-through">
                调整前：{item.before}
              </div>
              <div className="text-[13px] text-emerald-800 font-medium flex items-start gap-1">
                <span>调整后：</span>
                <span>{item.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Scope */}
      <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-[13px] space-y-1 text-text-secondary">
        <div><strong>受影响账号：</strong>{proposal.impactScope.affectedAccounts.join('、')}</div>
        <div><strong>排期与节奏调整：</strong>{proposal.impactScope.affectedSchedule}</div>
        {proposal.impactScope.taskChanges.added.length > 0 && (
          <div className="text-emerald-800">
            <strong>新增任务：</strong>{proposal.impactScope.taskChanges.added.join('；')}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-border-subtle flex items-center justify-end gap-2">
        {onReject && (
          <button
            type="button"
            onClick={onReject}
            className="px-3 py-1.5 bg-surface-1 hover:bg-surface-hover border border-border-default rounded-lg text-[13px] text-text-secondary font-medium transition-colors"
          >
            放弃修改
          </button>
        )}

        <button
          type="button"
          onClick={() => onAccept(proposal)}
          className="px-4 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Check size={13} />
          <span>采纳修改提案并更新打法</span>
        </button>
      </div>

    </div>
  );
}
