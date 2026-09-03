import React from "react";
import { Plus, Trash2 } from "lucide-react";

const inputCls = "w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 text-text-main outline-none focus:border-neutral-500 bg-surface-1";

export interface BasisSuggestion {
  text: string; // 主文本
  meta: string; // 副字段（来源 / 依据 / 影响）
}

interface BasisItemListProps<T> {
  value: T[];
  suggestions: BasisSuggestion[];
  textPlaceholder?: string;
  metaPlaceholder: string;
  getMeta: (item: T) => string;
  setMeta: (item: T, meta: string) => T;
  setText: (item: T, text: string) => T;
  createFromTemplate: (template: BasisSuggestion) => T;
  createBlank: () => T;
  addLabel: string;
  onChange: (next: T[]) => void;
}

// 结构化条目列表：已选条目可编辑主文本 + 副字段，支持从预置模板一键加入、或添加空白项
export function BasisItemList<T extends { id: string; text: string }>({
  value,
  suggestions,
  textPlaceholder,
  metaPlaceholder,
  getMeta,
  setMeta,
  setText,
  createFromTemplate,
  createBlank,
  addLabel,
  onChange
}: BasisItemListProps<T>) {
  const isChosen = (text: string) => value.some(item => item.text === text);
  const remaining = suggestions.filter(s => !isChosen(s.text));

  const remove = (id: string) => onChange(value.filter(item => item.id !== id));

  return (
    <div className="space-y-3">
      {value.length > 0 ? (
        <div className="space-y-2.5">
          {value.map(item => (
            <div key={item.id} className="space-y-1.5 rounded-lg border border-border-default p-2.5">
              <input
                value={item.text}
                onChange={event => onChange(value.map(it => it.id === item.id ? setText(it, event.target.value) : it))}
                placeholder={textPlaceholder}
                className={inputCls}
              />
              <div className="flex items-center gap-2">
                <input
                  value={getMeta(item)}
                  onChange={event => onChange(value.map(it => it.id === item.id ? setMeta(it, event.target.value) : it))}
                  placeholder={metaPlaceholder}
                  className={inputCls}
                />
                <button onClick={() => remove(item.id)} className="shrink-0 p-2 text-text-tertiary hover:text-danger">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[12px] text-text-tertiary">未添加，可从下方推荐模板一键加入或自定义添加。</div>
      )}

      {remaining.length > 0 ? (
        <div>
          <div className="mb-1.5 text-[12px] text-text-tertiary">推荐模板（点击加入）</div>
          <div className="flex flex-wrap gap-2">
            {remaining.map(s => (
              <button
                key={s.text}
                type="button"
                onClick={() => onChange([...value, createFromTemplate(s)])}
                className="flex items-center gap-1 rounded-full border border-border-default bg-surface-subtle px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:border-btn-main hover:text-text-main"
              >
                <Plus size={12} className="shrink-0" />
                <span className="max-w-[420px] break-words leading-snug text-left">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button onClick={() => onChange([...value, createBlank()])} className="flex items-center gap-1 text-[13px] text-text-secondary hover:text-text-main">
        <Plus size={14} />{addLabel}
      </button>
    </div>
  );
}
