import React from 'react';
import {
  Check,
  CheckCircle2,
  Clock3,
  WandSparkles
} from 'lucide-react';
import { MaterialAsset } from './types';
import { getMaterialUseLabel } from './materialLabels';

export type MaterialCardMode = 'available' | 'optimize' | 'history';

interface MaterialAssetCardV2Props {
  asset: MaterialAsset;
  mode: MaterialCardMode;
  primaryTag?: string;
  isBatchMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (assetId: string) => void;
  onOpenDetail: (asset: MaterialAsset) => void;
  ctr?: string;
  optimizationStrategy?: string;
}

const AssetStatus: React.FC<{ asset: MaterialAsset; mode: MaterialCardMode }> = ({ asset, mode }) => {
  if (mode === 'optimize') {
    return <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-1.5 py-1 text-[13px] font-medium text-neutral-700"><WandSparkles size={9} />待优化</span>;
  }
  if (asset.status === 'reserved') {
    return <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-1 text-[13px] font-medium text-blue-700"><Clock3 size={9} />已占用</span>;
  }
  if (asset.status === 'used') {
    return <span className="rounded-md bg-surface-subtle px-1.5 py-1 text-[13px] font-medium text-text-secondary">已使用</span>;
  }
  if (asset.status === 'archived') {
    return <span className="rounded-md bg-neutral-100 px-1.5 py-1 text-[13px] font-medium text-text-tertiary">已归档</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[13px] font-medium text-emerald-700"><CheckCircle2 size={9} />可用</span>;
};

export const MaterialAssetCardV2: React.FC<MaterialAssetCardV2Props> = ({
  asset,
  mode,
  primaryTag,
  isBatchMode = false,
  isSelected = false,
  onToggleSelect,
  onOpenDetail,
  ctr,
  optimizationStrategy
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
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-1 text-[13px] font-medium text-white backdrop-blur-sm">{getMaterialUseLabel(asset.materialUse)}</span>
        )}
        <div className="absolute right-2 top-2"><AssetStatus asset={asset} mode={mode} /></div>
      </div>


      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-[13px] font-semibold text-text-main">{asset.name}</h3>
            <p className="mt-1 line-clamp-1 text-[13px] text-text-tertiary">{asset.sourceProject ?? asset.sourceLabel}</p>
          </div>
          {ctr && (
            <div className="flex flex-col items-end shrink-0 bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5">
              <span className="text-[11px] text-rose-500 font-medium">封面点击率</span>
              <span className="text-[13px] text-rose-600 font-bold">{ctr}</span>
            </div>
          )}
        </div>

        {optimizationStrategy ? (
          <div className="mt-2 text-[12px] leading-5 text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-100">
            {optimizationStrategy}
          </div>
        ) : (
          <div className="mt-2 flex min-h-5 items-center gap-1.5 text-[13px] text-text-tertiary">
            <span className="shrink-0">{asset.aspectRatio}</span>
            {primaryTag ? <><span>·</span><span className="truncate">{primaryTag.replace(/^AI · /, '')}</span></> : null}
          </div>
        )}
      </div>
    </article>

  );
};
