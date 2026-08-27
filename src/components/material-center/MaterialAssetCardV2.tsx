import React from 'react';
import {
  Check,
  CheckCircle2,
  Clock3,
  WandSparkles
} from 'lucide-react';
import { MaterialAsset } from './types';

export type MaterialCardMode = 'available' | 'optimize' | 'history';

interface MaterialAssetCardV2Props {
  asset: MaterialAsset;
  mode: MaterialCardMode;
  primaryTag?: string;
  optimizationHint?: string;
  isBatchMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (assetId: string) => void;
  onOpenDetail: (asset: MaterialAsset) => void;
  onOpenOptimization?: (asset: MaterialAsset) => void;
  onCreateVariant?: (asset: MaterialAsset) => void;
}

const USE_LABELS: Record<string, string> = {
  cover: '封面图',
  body_image: '笔记内页',
  real_shot: '实拍素材',
  component_cutout: '产品抠图',
  component_logo: '品牌元件',
  component_packaging: '包装细节',
  component_swatch: '视觉规范'
};

const AssetStatus: React.FC<{ asset: MaterialAsset; mode: MaterialCardMode }> = ({ asset, mode }) => {
  if (mode === 'optimize') {
    return <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-1.5 py-1 text-[9px] font-medium text-neutral-700"><WandSparkles size={9} />待优化</span>;
  }
  if (asset.status === 'reserved') {
    return <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-1 text-[9px] font-medium text-blue-700"><Clock3 size={9} />已占用</span>;
  }
  if (asset.status === 'used') {
    return <span className="rounded-md bg-surface-subtle px-1.5 py-1 text-[9px] font-medium text-text-secondary">已使用</span>;
  }
  if (asset.status === 'archived') {
    return <span className="rounded-md bg-neutral-100 px-1.5 py-1 text-[9px] font-medium text-text-tertiary">已归档</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[9px] font-medium text-emerald-700"><CheckCircle2 size={9} />可用</span>;
};

export const MaterialAssetCardV2: React.FC<MaterialAssetCardV2Props> = ({
  asset,
  mode,
  primaryTag,
  optimizationHint,
  isBatchMode = false,
  isSelected = false,
  onToggleSelect,
  onOpenDetail,
  onOpenOptimization,
  onCreateVariant
}) => {
  const handleSelect = () => onToggleSelect?.(asset.id);
  const handleCardAction = () => {
    if (isBatchMode) handleSelect();
    else onOpenDetail(asset);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardAction();
    }
  };
  const hasFooterAction = mode === 'optimize' || (mode === 'history' && asset.status === 'used');

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={isBatchMode ? `${isSelected ? '取消选择' : '选择'}${asset.name}` : `查看${asset.name}详情`}
      aria-pressed={isBatchMode ? isSelected : undefined}
      onClick={handleCardAction}
      onKeyDown={handleKeyDown}
      className={`group cursor-pointer overflow-hidden rounded-xl border bg-surface-1 outline-none transition-all hover:border-neutral-500 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-neutral-400 ${isSelected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-border-default'}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
        <img src={asset.url} alt={asset.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
        {isBatchMode ? (
          <span aria-hidden="true" className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border shadow-sm ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-white bg-white/95 text-transparent'}`}><Check size={13} /></span>
        ) : (
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-1 text-[9px] font-medium text-white backdrop-blur-sm">{USE_LABELS[asset.materialUse] ?? '通用素材'}</span>
        )}
        <div className="absolute right-2 top-2"><AssetStatus asset={asset} mode={mode} /></div>
      </div>

      <div className="p-3">
        <div>
          <h3 className="line-clamp-1 text-[12px] font-semibold text-text-main">{asset.name}</h3>
          <p className="mt-1 line-clamp-1 text-[9.5px] text-text-tertiary">{asset.sourceLabel} · {asset.resolution}</p>
        </div>

        <div className="mt-2 flex min-h-5 items-center gap-1.5">
          {primaryTag ? <span className="truncate rounded-md bg-surface-subtle px-1.5 py-0.5 text-[9px] text-text-secondary">{primaryTag}</span> : null}
          {asset.category === 'derived_material' ? <span className="shrink-0 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[9px] text-neutral-700">差异化版本</span> : <span className="ml-auto shrink-0 text-[9px] text-text-tertiary">原始素材</span>}
        </div>

        {mode === 'optimize' ? (
          <div className="mt-3 rounded-lg bg-neutral-100 p-2.5">
            <div className="flex items-center gap-1 text-[9.5px] font-semibold text-neutral-800"><WandSparkles size={11} />优化结果已准备</div>
            <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-neutral-600">{optimizationHint}</p>
          </div>
        ) : null}

        {asset.status === 'reserved' && asset.usageRelation?.noteTitle ? (
          <div className="mt-3 rounded-lg bg-blue-50 px-2.5 py-2 text-[9px] leading-4 text-blue-700">已锁定给《{asset.usageRelation.noteTitle}》，不能被其他笔记选用。</div>
        ) : null}

        {hasFooterAction ? <div className="mt-3 flex items-center justify-end gap-2 border-t border-border-subtle pt-2.5">
          {mode === 'optimize' ? (
            <button type="button" onClick={event => { event.stopPropagation(); onOpenOptimization?.(asset); }} className="rounded-lg bg-btn-main px-2.5 py-1.5 text-[9.5px] font-medium text-white">查看优化结果</button>
          ) : null}
          {mode === 'history' && asset.status === 'used' ? (
            <button type="button" onClick={event => { event.stopPropagation(); onCreateVariant?.(asset); }} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[9.5px] font-medium text-text-main hover:bg-hover-bg"><WandSparkles size={10} />生成差异化版本</button>
          ) : null}
        </div> : null}
      </div>
    </article>
  );
};
