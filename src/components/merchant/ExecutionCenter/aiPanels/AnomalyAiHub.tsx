import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, Sparkles, Check, ArrowRight, 
  Copy, User, RefreshCw, Send, QrCode, Clock, CheckCheck,
  ShieldCheck, HelpCircle, Zap, UserCheck
} from 'lucide-react';
import { ExecutionTask } from '../types';

interface AnomalyAiHubProps {
  task: ExecutionTask;
  onOpenReassignModal: () => void;
  onOpenQrModal: () => void;
  onRemindExecutor: () => void;
  onResolveAnomaly?: (planTitle: string) => void;
  showToast: (msg: string) => void;
}

export function AnomalyAiHub({
  task,
  onOpenReassignModal,
  onOpenQrModal,
  onRemindExecutor,
  onResolveAnomaly,
  showToast
}: AnomalyAiHubProps) {
  const [selectedPlan, setSelectedPlan] = useState<'plan_a' | 'plan_b' | 'plan_c'>('plan_a');

  const copyToClipboard = (text: string, tip: string) => {
    navigator.clipboard.writeText(text);
    showToast(tip);
  };

  return (
    <div className="w-80 border-l border-border-default bg-surface flex flex-col shrink-0">
      
      {/* Header */}
      <div className="p-3.5 border-b border-border-default bg-surface-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-rose-700 text-white flex items-center justify-center text-[13px] font-bold">
            <AlertTriangle size={13} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">
              异常诊断与处置决策 AI 协调
            </div>
            <div className="text-[13px] text-text-tertiary">
              根因穿透分析 · 智能决策方案
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
        
        {/* 1. Root Cause Analysis Card */}
        <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-rose-600" />
              <span>异常根因链条诊断</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[13px] font-medium bg-rose-100 text-rose-800">
              {task.isBlocked ? '流程阻塞中' : '需人工介入'}
            </span>
          </div>

          <div className="text-[13px] text-rose-950 space-y-1 leading-relaxed">
            <div><strong>触发原因：</strong>{task.anomalyReason || task.reasonForIntervention}</div>
            <div><strong>影响范围：</strong>{task.strategyContext?.impactAccounts?.join(', ') || task.targetAccount} 及下游排期</div>
          </div>

          <div className="pt-2 border-t border-rose-200/60 text-[13px] text-rose-800 flex items-start gap-1">
            <AlertTriangle size={12} className="text-rose-700 shrink-0 mt-0.5" />
            <div><strong>卡点判定：</strong>{task.currentOccurrence}</div>
          </div>
        </div>

        {/* 2. Three Actionable AI Decision Plans */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-600" />
              <span>AI 推荐处置方案决策</span>
            </div>
            <span className="text-[13px] text-text-tertiary">3 套可选策略</span>
          </div>

          {/* Plan A: Fast Reassign */}
          <div 
            onClick={() => setSelectedPlan('plan_a')}
            className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
              selectedPlan === 'plan_a'
                ? 'bg-surface border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm'
                : 'bg-surface hover:bg-surface-hover border-border-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[13px] text-text-primary">
                方案 A：快速换人改派
              </span>
              <span className="px-2 py-0.5 rounded text-[13px] font-medium bg-emerald-100 text-emerald-800">
                推荐 · 最快恢复
              </span>
            </div>
            <div className="text-[13px] text-text-secondary leading-relaxed">
              匹配同城活跃 KOS 账号【静安店-李店长】，重新下发任务，预计 2 小时内接单。
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReassignModal();
              }}
              className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <User size={12} />
              <span>立即唤起改派</span>
            </button>
          </div>

          {/* Plan B: Fallback Asset from Library */}
          <div 
            onClick={() => setSelectedPlan('plan_b')}
            className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
              selectedPlan === 'plan_b'
                ? 'bg-surface border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm'
                : 'bg-surface hover:bg-surface-hover border-border-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[13px] text-text-primary">
                方案 B：素材库资产降级兜底
              </span>
              <span className="px-2 py-0.5 rounded text-[13px] font-medium bg-surface-subtle text-text-secondary border border-border-default">
                免拍摄
              </span>
            </div>
            <div className="text-[13px] text-text-secondary leading-relaxed">
              从素材中心调用同类优质门店陈列实拍图，跳过外部拍摄，直接生成发布包。
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onResolveAnomaly) {
                  onResolveAnomaly('降级使用素材库资产');
                } else {
                  showToast('已选用素材库资产兜底，流程已恢复！');
                }
              }}
              className="w-full py-1.5 bg-surface-subtle hover:bg-surface-hover text-text-primary border border-border-default rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Check size={12} />
              <span>采纳素材库资产</span>
            </button>
          </div>

          {/* Plan C: High Priority Reminder & Extend */}
          <div 
            onClick={() => setSelectedPlan('plan_c')}
            className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
              selectedPlan === 'plan_c'
                ? 'bg-surface border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm'
                : 'bg-surface hover:bg-surface-hover border-border-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[13px] text-text-primary">
                方案 C：限时加急催办
              </span>
              <span className="px-2 py-0.5 rounded text-[13px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                限时通牒
              </span>
            </div>
            <div className="text-[13px] text-text-secondary leading-relaxed">
              向原执行人发送微信高优先级加急提醒，并将截止时间宽限 12 小时。
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemindExecutor();
              }}
              className="w-full py-1.5 bg-surface-subtle hover:bg-surface-hover text-text-primary border border-border-default rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Send size={12} />
              <span>发送加急催促</span>
            </button>
          </div>
        </div>

        {/* 3. Communication Templates */}
        <div className="space-y-2 pt-2 border-t border-border-subtle">
          <div className="text-[13px] font-semibold text-text-secondary">
            一键沟通话术模板：
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(
              `【加急通知】您好，您负责的【${task.noteTitle}】任务已到达处理截止时间。请在今日内回传，如有特殊情况请即时告知操盘手，以便调整排期，谢谢配合！`,
              '加急催促文案已复制！'
            )}
            className="w-full text-left p-2.5 bg-surface hover:bg-surface-hover border border-border-default rounded-lg text-[13px] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Zap size={13} className="text-amber-600 shrink-0" />
              <span className="text-text-primary truncate">超时加急通知模板</span>
            </div>
            <Copy size={12} className="text-text-tertiary group-hover:text-text-primary shrink-0 ml-1" />
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(
              `店长您好，由于当前账号任务排期较紧，系统已协同将【${task.noteTitle}】指派给您协助推进，文案和要求已生成，请在工作台查看并确认～`,
              '换人交接文案已复制！'
            )}
            className="w-full text-left p-2.5 bg-surface hover:bg-surface-hover border border-border-default rounded-lg text-[13px] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <UserCheck size={13} className="text-blue-600 shrink-0" />
              <span className="text-text-primary truncate">任务转派交接说明模板</span>
            </div>
            <Copy size={12} className="text-text-tertiary group-hover:text-text-primary shrink-0 ml-1" />
          </button>
        </div>

        {/* 4. Prevention Recommendations */}
        <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl space-y-1.5">
          <div className="text-[13px] font-semibold text-text-primary flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>预防类似阻断建议</span>
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            建议在【账号配置】中为该项目设置 1-2 个常备备用店长号，当主号出现异常时系统可自动降级流转。
          </div>
        </div>

      </div>

    </div>
  );
}
