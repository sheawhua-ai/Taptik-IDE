import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const chipInputCls = "flex-1 rounded-xl border border-border-default px-3.5 py-2 text-[13px] leading-6 text-text-main outline-none focus:border-neutral-500 bg-surface-1";

interface ChipSelectListProps {
  value: string[];
  suggestions: string[];
  onChange: (next: string[]) => void;
  addPlaceholder?: string;
}

// 带默认建议值的可选项：已选 chips 可删、未选建议一键勾选、支持自定义添加
export function ChipSelectList({ value, suggestions, onChange, addPlaceholder = "自定义添加" }: ChipSelectListProps) {
  const [draft, setDraft] = useState("");

  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter(v => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const addCustom = () => {
    const text = draft.trim();
    setDraft("");
    if (!text || value.includes(text)) return;
    onChange([...value, text]);
  };

  const remaining = suggestions.filter(s => !value.includes(s));

  return (
    <div className="space-y-3">
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className="group flex items-center gap-1.5 rounded-full border border-btn-main bg-btn-main px-3 py-1.5 text-[12px] text-white transition-colors"
            >
              <span className="max-w-[420px] break-words leading-snug text-left">{item}</span>
              <X size={12} className="shrink-0 opacity-70 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-[12px] text-text-tertiary">未选择，可从下方推荐勾选或自定义添加。</div>
      )}

      {remaining.length > 0 ? (
        <div>
          <div className="mb-1.5 text-[12px] text-text-tertiary">推荐选项</div>
          <div className="flex flex-wrap gap-2">
            {remaining.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                className="flex items-center gap-1 rounded-full border border-border-default bg-surface-subtle px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:border-btn-main hover:text-text-main"
              >
                <Plus size={12} className="shrink-0" />
                <span className="max-w-[420px] break-words leading-snug text-left">{item}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); addCustom(); } }}
          placeholder={addPlaceholder}
          className={chipInputCls}
        />
        <button type="button" onClick={addCustom} className="shrink-0 rounded-lg border border-border-default px-3 py-2 text-text-secondary transition-colors hover:bg-hover-bg hover:text-text-main">
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
