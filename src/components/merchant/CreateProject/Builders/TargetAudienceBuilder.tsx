import React, { useState, useEffect } from 'react';
import { Sparkles, Database } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  audienceTags?: string[];
  onAudienceTagsChange: (tags: string[]) => void;
}

const KNOWLEDGE_BASE_AUDIENCES = [
  '3-6个月新手宠主',
  '肠胃敏感/易软便宠主',
  '挑食/食欲不振宠主',
  '追求成分无谷的精致白领',
  '换粮焦虑/不知如何过渡的宠主'
];

const EMPTY_TAGS: string[] = [];
export function TargetAudienceBuilder({ value, onChange, audienceTags = EMPTY_TAGS, onAudienceTagsChange }: Props) {
  const [manualText, setManualText] = useState('');

  // When tags change, we update the preview text
  useEffect(() => {
    if (audienceTags.length > 0) {
      const generated = `目标人群主要特征为：${audienceTags.join('、')}。`;
      if (manualText) {
        onChange(`${generated}\n${manualText}`);
      } else {
        onChange(generated);
      }
    } else {
      onChange(manualText);
    }
  }, [audienceTags, manualText]);

  const toggleTag = (tag: string) => {
    if (audienceTags.includes(tag)) {
      onAudienceTagsChange(audienceTags.filter(t => t !== tag));
    } else {
      onAudienceTagsChange([...audienceTags, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[13px] font-semibold">目标人群 *</label>
      </div>
      
      <div className="rounded-xl border border-border-default bg-surface-1 p-4 space-y-3">
        {KNOWLEDGE_BASE_AUDIENCES.length === 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-medium text-text-secondary">商家知识库人群画像不足</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {KNOWLEDGE_BASE_AUDIENCES.map(tag => {
            const selected = audienceTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-md text-[12px] transition-colors border ${selected ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-surface-subtle border-border-default text-text-secondary hover:bg-surface-2'}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <textarea 
          rows={2} 
          value={manualText} 
          onChange={(e) => setManualText(e.target.value)} 
          placeholder="手动补充其他人群特征（如兴趣、痛点等）" 
          className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 outline-none focus:border-neutral-500 resize-none" 
        />
      </div>
      
      {value && (
        <div className="text-[12px] text-text-secondary bg-surface-subtle p-2.5 rounded-lg border border-border-default">
          <strong>最终描述：</strong>{value}
        </div>
      )}
    </div>
  );
}
