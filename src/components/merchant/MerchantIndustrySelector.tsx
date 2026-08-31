import React, { useMemo } from "react";
import { getIndustryDefaults, INDUSTRY_CATALOG } from "../../data/industryCatalog";

export interface MerchantIndustrySelection {
  primaryIndustryId: string;
  secondaryIndustryIds: string[];
  tertiaryIndustryIds: string[];
}

interface MerchantIndustrySelectorProps extends MerchantIndustrySelection {
  onChange: (selection: MerchantIndustrySelection) => void;
  showRecommendation?: boolean;
}

export const MerchantIndustrySelector: React.FC<MerchantIndustrySelectorProps> = ({
  primaryIndustryId,
  secondaryIndustryIds,
  tertiaryIndustryIds,
  onChange,
  showRecommendation = false,
}) => {
  const primaryIndustry = useMemo(
    () => INDUSTRY_CATALOG.find((item) => item.id === primaryIndustryId),
    [primaryIndustryId],
  );
  const tertiaryOptions = useMemo(
    () => primaryIndustry?.children
      .filter((item) => secondaryIndustryIds.includes(item.id))
      .flatMap((item) => item.children) || [],
    [primaryIndustry, secondaryIndustryIds],
  );
  const defaults = showRecommendation && primaryIndustryId
    ? getIndustryDefaults(primaryIndustryId)
    : null;

  const changePrimaryIndustry = (id: string) => {
    onChange({
      primaryIndustryId: id,
      secondaryIndustryIds: [],
      tertiaryIndustryIds: [],
    });
  };

  const toggleSecondary = (id: string) => {
    const nextSecondaryIds = secondaryIndustryIds.includes(id)
      ? secondaryIndustryIds.filter((item) => item !== id)
      : [...secondaryIndustryIds, id];
    const validTertiaryIds = primaryIndustry?.children
      .filter((item) => nextSecondaryIds.includes(item.id))
      .flatMap((item) => item.children.map((child) => child.id)) || [];
    onChange({
      primaryIndustryId,
      secondaryIndustryIds: nextSecondaryIds,
      tertiaryIndustryIds: tertiaryIndustryIds.filter((item) => validTertiaryIds.includes(item)),
    });
  };

  const toggleTertiary = (id: string) => {
    onChange({
      primaryIndustryId,
      secondaryIndustryIds,
      tertiaryIndustryIds: tertiaryIndustryIds.includes(id)
        ? tertiaryIndustryIds.filter((item) => item !== id)
        : [...tertiaryIndustryIds, id],
    });
  };

  return (
    <section className="space-y-3 rounded-xl border border-border-default bg-surface-subtle p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-text-main">行业配置</div>
          <div className="mt-0.5 text-[13px] text-text-tertiary">用于匹配方案流程、内容模板和账号角色。</div>
        </div>
        <span className="rounded bg-rose-50 px-2 py-0.5 text-[13px] font-medium text-rose-700">一级必选</span>
      </div>

      <label className="block space-y-1.5">
        <span className="text-[13px] text-text-secondary">一级行业</span>
        <select
          required
          value={primaryIndustryId}
          onChange={(event) => changePrimaryIndustry(event.target.value)}
          className="h-10 w-full rounded-lg border border-border-default bg-surface-1 px-3 text-[13px] text-text-main outline-none focus:border-border-strong"
        >
          <option value="">请选择一级行业</option>
          {INDUSTRY_CATALOG.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>

      {primaryIndustry ? (
        <>
          <div className="space-y-1.5">
            <div className="text-[13px] text-text-secondary">二级行业 <span className="text-text-tertiary">· 可多选</span></div>
            <div className="flex flex-wrap gap-1.5">
              {primaryIndustry.children.map((item) => {
                const selected = secondaryIndustryIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSecondary(item.id)}
                    className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-medium ${selected ? "border-neutral-900 bg-neutral-950 text-white" : "border-border-default bg-surface-1 text-text-secondary hover:border-border-strong"}`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {tertiaryOptions.length > 0 ? (
            <div className="space-y-1.5">
              <div className="text-[13px] text-text-secondary">三级行业 <span className="text-text-tertiary">· 可多选</span></div>
              <div className="flex flex-wrap gap-1.5">
                {tertiaryOptions.map((item) => {
                  const selected = tertiaryIndustryIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleTertiary(item.id)}
                      className={`rounded-lg border px-2.5 py-1.5 text-[13px] ${selected ? "border-blue-300 bg-blue-50 font-medium text-blue-800" : "border-border-default bg-surface-1 text-text-secondary"}`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {defaults ? (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <div className="text-[13px] font-medium text-blue-700">创建后为你推荐</div>
          <div className="mt-1 text-[13px] font-semibold text-blue-950">{defaults.launchTemplateName}</div>
          <div className="mt-1 text-[13px] leading-5 text-blue-800">{defaults.launchDescription}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {defaults.planTemplates.map((item) => <span key={item} className="rounded bg-white/80 px-1.5 py-0.5 text-[13px] text-blue-800">{item}</span>)}
          </div>
        </div>
      ) : null}
    </section>
  );
};
