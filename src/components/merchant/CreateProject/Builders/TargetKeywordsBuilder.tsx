import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  primaryGoal: string;
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function TargetKeywordsBuilder({ primaryGoal, keywords, onChange }: Props) {
  const [inputValue, setInputValue] = useState('');
  const isRequired = primaryGoal === '搜索卡位';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    }
  };

  const addKeyword = () => {
    const trimmed = inputValue.trim().replace(/,/g, '');
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
    setInputValue('');
  };

  const removeKeyword = (kw: string) => {
    onChange(keywords.filter(k => k !== kw));
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5">
        目标关键词 {isRequired && '* '}
        {isRequired && <span className="font-normal text-text-tertiary">搜索类方案必填</span>}
      </label>
      
      <div className="w-full rounded-xl border border-border-default px-2 py-2 flex flex-wrap gap-2 items-center bg-surface-1 focus-within:border-neutral-500 transition-colors">
        {keywords.map(kw => (
          <div key={kw} className="flex items-center gap-1 bg-surface-subtle border border-border-default rounded-md px-2 py-1 text-[12px]">
            <span>{kw}</span>
            <button type="button" onClick={() => removeKeyword(kw)} className="text-text-tertiary hover:text-text-main"><X size={12} /></button>
          </div>
        ))}
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addKeyword}
          placeholder={keywords.length === 0 ? "输入关键词，按回车或逗号添加" : ""}
          className="flex-1 min-w-[150px] bg-transparent border-none text-[13px] outline-none px-1 py-1"
        />
      </div>
    </div>
  );
}
