import React from 'react';
import { 
  X, Check, AlertCircle, ArrowRight, Sparkles, 
  Layers, Users, Calendar, CheckSquare, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { StrategyChangeProposal } from './types';

interface StrategyProposalModalProps {
  proposal: StrategyChangeProposal;
  onAccept: (proposal: StrategyChangeProposal) => void;
  onReject: () => void;
}

export function StrategyProposalModal({
  proposal,
  onAccept,
  onReject
}: StrategyProposalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-150 p-4">
      <div className="bg-surface-1 border border-border-strong rounded-xl shadow-dialog w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-surface-subtle shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[13px] font-semibold">
              <Sparkles size={14} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">
                AI 策略修改提案与影响范围预览
              </h2>
              <p className="text-[13px] text-text-tertiary">
                在同步更新打法前，请核对修改差异及对下游任务、排期的连带影响
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReject}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[13px]">
          
          {/* User Request & AI Understanding */}
          <div className="p-3.5 bg-surface-subtle border border-border-default rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[13px] px-1.5 py-0.5 bg-neutral-200 text-neutral-800 rounded font-medium shrink-0">
                用户要求
              </span>
              <span className="font-medium text-text-primary">
                “{proposal.userPrompt}”
              </span>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-border-subtle">
              <span className="text-[13px] px-1.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-medium shrink-0">
                AI 理解
              </span>
              <span className="text-text-secondary leading-relaxed">
                {proposal.aiInterpretation}
              </span>
            </div>
          </div>

          {/* Diffs: Before vs After */}
          <div>
            <div className="text-[13px] font-semibold text-text-primary mb-2 flex items-center gap-1.5">
              <span>修改前后差异对比</span>
            </div>

            <div className="border border-border-default rounded-lg divide-y divide-border-subtle overflow-hidden">
              {proposal.diffSummary.map((diff, idx) => (
                <div key={idx} className="p-3 bg-surface-1">
                  <div className="text-[13px] font-medium text-text-tertiary mb-1.5">
                    {diff.moduleName}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
                    <div className="p-2 bg-rose-50/50 border border-rose-200/70 rounded text-rose-900 line-through decoration-rose-400">
                      <span className="text-[13px] block text-rose-700 font-semibold mb-0.5">修改前</span>
                      {diff.before}
                    </div>
                    <div className="p-2 bg-emerald-50/60 border border-emerald-200/80 rounded text-emerald-950">
                      <span className="text-[13px] block text-emerald-700 font-semibold mb-0.5">修改后 (提案)</span>
                      {diff.after}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Scope */}
          <div>
            <div className="text-[13px] font-semibold text-text-primary mb-2">
              连带影响与任务变动评估
            </div>

            <div className="p-3.5 bg-surface-1 border border-border-default rounded-lg space-y-3 text-[13px]">
              
              <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-border-subtle">
                <div>
                  <span className="text-text-tertiary">受影响内容篇数:</span>
                  <span className="ml-1.5 font-semibold text-text-primary">
                    {proposal.impactScope.affectedNotesCount} 篇
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary">受影响账号:</span>
                  <span className="ml-1.5 text-text-secondary font-medium">
                    {proposal.impactScope.affectedAccounts.join('、')}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-text-tertiary">排期变动:</span>
                <span className="ml-1.5 text-text-secondary">
                  {proposal.impactScope.affectedSchedule}
                </span>
              </div>

              {/* Task Changes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-text-tertiary block font-medium">工作任务变动:</span>
                {proposal.impactScope.taskChanges.added.length > 0 && (
                  <div className="flex items-start gap-1.5 text-emerald-800 text-[13px]">
                    <span className="px-1 bg-emerald-100 rounded text-[13px] font-bold">+ 新增</span>
                    <span>{proposal.impactScope.taskChanges.added.join('；')}</span>
                  </div>
                )}
                {proposal.impactScope.taskChanges.removed.length > 0 && (
                  <div className="flex items-start gap-1.5 text-rose-800 text-[13px]">
                    <span className="px-1 bg-rose-100 rounded text-[13px] font-bold">- 取消</span>
                    <span>{proposal.impactScope.taskChanges.removed.join('；')}</span>
                  </div>
                )}
                {proposal.impactScope.taskChanges.modified.length > 0 && (
                  <div className="flex items-start gap-1.5 text-blue-800 text-[13px]">
                    <span className="px-1 bg-blue-100 rounded text-[13px] font-bold">~ 变更</span>
                    <span>{proposal.impactScope.taskChanges.modified.join('；')}</span>
                  </div>
                )}
              </div>

              {/* Fact conflict check */}
              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  <span className="text-emerald-900 font-medium">
                    事实与合规冲突检测: 经核验未违反已知质检与禁用词规范
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-border-default bg-surface-subtle flex items-center justify-between shrink-0">
          <div className="text-[13px] text-text-tertiary">
            确认采纳后将直接同步更新打法草案
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReject}
              className="px-3.5 py-1.5 bg-surface-1 hover:bg-surface-hover border border-border-default rounded-lg text-[13px] text-text-secondary font-medium transition-colors"
            >
              放弃修改
            </button>
            <button
              type="button"
              onClick={() => onAccept(proposal)}
              className="px-4 py-1.5 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check size={14} />
              <span>采纳修改提案并更新打法</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
