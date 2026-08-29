import React from 'react';
import { 
  Building2, Package, ShieldCheck, Users, History, 
  ChevronRight, Sparkles, Check, AlertCircle, HelpCircle, Layers
} from 'lucide-react';
import { FactItem } from './types';

interface CarriedContextCardProps {
  facts: FactItem[];
  onOpenFullContext: () => void;
  onConfirmInheritedFact?: (factId: string) => void;
}

export function CarriedContextCard({
  facts,
  onOpenFullContext,
  onConfirmInheritedFact
}: CarriedContextCardProps) {
  const inheritedFacts = facts.filter(f => f.isInheritedFromHistory && !f.confirmedByOperator);

  return (
    <div className="bg-surface-1 border border-border-default rounded-xl p-4 shadow-sm mb-5">
      {/* Top Title & Drawer Link */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-text-primary text-[13px] font-semibold">
            <Layers size={13} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13.5px] font-semibold text-text-primary">本次已自动携带上下文</span>
              <span className="text-[13px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
                已接入 {facts.length} 类事实
              </span>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              AI 已读取商家资料、产品质检、品牌合规禁区与账号资产，仅展示最影响打法判断的核心信息
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFullContext}
          className="text-[13px] text-text-secondary hover:text-text-primary font-medium flex items-center gap-1 px-2.5 py-1.5 hover:bg-surface-hover rounded-lg transition-colors border border-border-subtle"
        >
          <span>查看完整上下文 (12份资料)</span>
          <ChevronRight size={14} className="text-text-tertiary" />
        </button>
      </div>

      {/* Carried Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
        {facts.slice(0, 3).map((fact) => (
          <div 
            key={fact.id}
            className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg flex flex-col justify-between text-[13px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] px-1.5 py-0.2 rounded font-medium bg-white text-text-secondary border border-border-default">
                  {fact.sourceName.split('·')[0]}
                </span>
                <span className="text-[13px] text-text-tertiary truncate max-w-[120px]">
                  {fact.sourceName.split('·')[1] || ''}
                </span>
              </div>
              <div className="font-medium text-text-primary leading-snug line-clamp-1">
                {fact.title}
              </div>
              <div className="text-[13px] text-text-tertiary mt-1 line-clamp-2 leading-relaxed">
                {fact.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Inheritance Notice if any */}
      {inheritedFacts.length > 0 && (
        <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle size={14} className="text-amber-700 shrink-0" />
            <span>
              检测到历史复盘数据：<strong className="font-medium">7月换粮搜索卡位复盘</strong>，请确认本周期是否沿用其策略结论？
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onConfirmInheritedFact && onConfirmInheritedFact(inheritedFacts[0].id)}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[13px] font-medium transition-colors"
            >
              确认沿用
            </button>
            <button
              type="button"
              onClick={onOpenFullContext}
              className="text-[13px] text-amber-800 hover:underline"
            >
              重新配置
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
