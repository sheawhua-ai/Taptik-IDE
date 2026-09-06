import re

with open("src/components/merchant/CreateProject/Builders/CoreProblemBuilder.tsx", "r") as f:
    code = f.read()

# Replace the component completely
new_component = """import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Edit2 } from 'lucide-react';

interface Props {
  primaryGoal: string;
  value: string;
  onChange: (val: string) => void;
  structuredValue?: {
    stage?: string;
    symptom_tags?: string[];
    barrier?: string;
    consequence?: string;
  };
  onStructuredValueChange: (val: any) => void;
}

const FUNNELS: Record<string, string[]> = {
  '搜索卡位': ['用户搜不到', '搜到不点', '点开不留', '看完不收藏', '收录后排名差'],
  '种草认知': ['用户刷不到', '刷到不点', '看完无感', '有印象不搜你', '搜你不咨询'],
  '有效咨询': ['曝光够但互动少', '互动高但无人问', '有人问但回复流失', '咨询无法转留资'],
  '进店转化': ['咨询多但到店少', '到店但核销差', '老客不复购', '核销后无传播'],
  '账号涨粉': ['曝光高但关注低', '涨粉但互动弱', '粉丝画像偏差', '粉丝涨但变现差']
};

export function CoreProblemBuilder({ primaryGoal, value, onChange, structuredValue, onStructuredValueChange }: Props) {
  const [isManual, setIsManual] = useState(false);
  const funnelOptions = FUNNELS[primaryGoal] || FUNNELS['搜索卡位'];
  const activeStage = structuredValue?.stage;

  useEffect(() => {
    // Reset when goal changes
    onStructuredValueChange(undefined);
    setIsManual(false);
    onChange('');
  }, [primaryGoal]);

  const handleSelectStage = (stage: string) => {
    const text = `当前运营在【${stage}】环节存在明显瓶颈，导致整体转化率偏低，需要针对该环节重点优化。`;
    onStructuredValueChange({ stage });
    onChange(text);
    setIsManual(false);
  };

  return (
    <div className="rounded-xl border border-border-default bg-surface-1 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-default bg-surface-subtle px-4 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-main flex items-center gap-1.5"><Sparkles size={14} className="text-brand-logo" />核心问题诊断</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="text-[13px] font-medium text-text-main mb-2">1. 哪一段最卡？</div>
          <div className="flex flex-wrap gap-2">
            {funnelOptions.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelectStage(opt)}
                className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${activeStage === opt && !isManual ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-surface-1 border-border-default text-text-secondary hover:bg-surface-subtle'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {value && !isManual && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-brand-logo/30 bg-brand-logo/5 p-3">
            <p className="text-[13px] text-text-main leading-relaxed">{value}</p>
            <div className="mt-2 flex justify-end">
              <button onClick={() => setIsManual(true)} className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-main">
                <Edit2 size={12} /> 手动修改
              </button>
            </div>
          </div>
        )}

        {isManual && (
          <div className="animate-in fade-in slide-in-from-top-2 mt-2">
            <textarea 
              rows={3} 
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="手动输入核心问题..." 
              className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 outline-none focus:border-neutral-500 resize-none" 
            />
          </div>
        )}
      </div>
      
      {!isManual && !value && (
        <div className="border-t border-border-default bg-surface-subtle px-4 py-2 flex items-center gap-4 text-[12px]">
          <span className="text-text-tertiary">没找到合适的？</span>
          <button onClick={() => setIsManual(true)} className="text-text-secondary hover:text-text-main font-medium underline underline-offset-2">自己写</button>
        </div>
      )}
    </div>
  );
}
"""

with open("src/components/merchant/CreateProject/Builders/CoreProblemBuilder.tsx", "w") as f:
    f.write(new_component)

print("CoreProblemBuilder rewritten to be simpler")
