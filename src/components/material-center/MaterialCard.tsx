import React from 'react';
import { MaterialAsset } from './types';
import { Eye, CheckCircle2, Clock, Film, Tag } from 'lucide-react';

interface MaterialCardProps {
  asset: MaterialAsset;
  onOpenDetail: (asset: MaterialAsset) => void;
  isBatchMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  asset,
  onOpenDetail,
  isBatchMode = false,
  isSelected = false,
  onToggleSelect
}) => {
  // Helper for material use label
  const getUseLabel = (use: string) => {
    switch (use) {
      case 'cover': return '封面图';
      case 'body_image': return '笔记配图';
      case 'finished_video': return '笔记视频';
      case 'real_shot': return '实拍素材';
      case 'component_cutout': return '产品抠图/透明底图';
      case 'component_logo': return '品牌Logo/水印';
      case 'component_packaging': return '包装细节图';
      case 'component_swatch': return '品牌色板/字体';
      default: return '通用素材';
    }
  };

  // Status Badge styling
  const renderStatusBadge = () => {
    switch (asset.status) {
      case 'pending_acceptance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[13px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={11} /> 待验收
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[13px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={11} /> 可用
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[13px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            已预留
          </span>
        );
      case 'used':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[13px] font-medium bg-surface-subtle text-text-secondary border border-border-default">
            已使用
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[13px] font-medium bg-neutral-100 text-text-disabled border border-border-subtle">
            已归档
          </span>
        );
      default:
        return null;
    }
  };

  // Performance Badge
  const renderPerformanceBadge = () => {
    if (asset.performance.performanceType === 'owned_account_creator_api' && asset.performance.creatorBackend) {
      return (
        <div className="mt-2 text-[13px] px-2 py-1 bg-surface-subtle border border-border-subtle rounded text-text-secondary flex items-center justify-between">
          <span className="truncate text-text-primary font-medium">
            封面表现: <strong className="text-emerald-700 font-semibold">{asset.performance.creatorBackend.coverClickRate}% 点击率</strong>
          </span>
          <span className="text-[13px] text-text-tertiary shrink-0 ml-1">
            ({(asset.performance.creatorBackend.exposure / 10000).toFixed(1)}万曝光)
          </span>
        </div>
      );
    }

    if (asset.performance.performanceType === 'koc_public_captured' && asset.performance.kocMetrics) {
      return (
        <div className="mt-2 text-[13px] px-2 py-1 bg-amber-50/70 border border-amber-200/50 rounded text-amber-800 flex items-center justify-between">
          <span className="font-medium text-amber-900">无后台点击数据 (KOC)</span>
          {asset.performance.kocMetrics.publicInteractions && (
            <span className="text-[13px] text-amber-700 shrink-0">
              点赞 {asset.performance.kocMetrics.publicInteractions.likes}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="mt-2 text-[13px] px-2 py-1 bg-surface-subtle/50 border border-border-subtle/80 rounded text-text-tertiary truncate">
        未发布 / 无表现数据
      </div>
    );
  };

  return (
    <div
      onClick={() => {
        if (isBatchMode && onToggleSelect) {
          onToggleSelect(asset.id);
        }
      }}
      className={`bg-surface border rounded-lg overflow-hidden hover:border-border-strong transition-all flex flex-col group relative ${
        isSelected ? 'border-action-primary ring-1 ring-action-primary bg-surface-selected/20' : 'border-border-default'
      }`}
    >
      {/* Batch Checkbox (Top Left or Hover) */}
      {(isBatchMode || isSelected) && (
        <div className="absolute top-2 left-2 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              if (onToggleSelect) onToggleSelect(asset.id);
            }}
            className="w-4 h-4 rounded border-border-strong text-action-primary focus:ring-action-primary cursor-pointer accent-neutral-900"
          />
        </div>
      )}

      {/* Thumbnail Area */}
      <div className="relative aspect-[4/3] bg-surface-subtle overflow-hidden shrink-0 border-b border-border-subtle">
        {asset.fileType === 'video' ? (
          <div className="relative w-full h-full">
            <img
              src={asset.url}
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="p-2 rounded-full bg-black/60 text-white shadow">
                <Film size={18} />
              </span>
            </div>
          </div>
        ) : (
          <img
            src={asset.url}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Top Badges overlay */}
        <div className={`absolute top-2 flex items-center gap-1.5 flex-wrap max-w-[80%] ${isBatchMode || isSelected ? 'left-8' : 'left-2'}`}>
          <span className="px-1.5 py-0.5 rounded text-[13px] font-medium bg-black/70 text-white backdrop-blur-sm">
            {getUseLabel(asset.materialUse)}
          </span>
        </div>

        <div className="absolute top-2 right-2">
          {renderStatusBadge()}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Material Name */}
          <h4 className="text-[13px] font-semibold text-text-primary line-clamp-2 leading-snug tracking-tight mb-1">
            {asset.name}
          </h4>

          {/* Vector Description (1-sentence feature description) */}
          {asset.vectorDescription && (
            <p className="text-[13px] text-text-secondary line-clamp-2 leading-snug mb-2 bg-surface-subtle p-1.5 rounded border border-border-subtle">
              <span className="text-text-tertiary font-medium">特征描述: </span>
              {asset.vectorDescription}
            </p>
          )}

          {/* Asset Tags */}
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mb-2">
              <Tag size={11} className="text-text-tertiary shrink-0" />
              {asset.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 rounded text-[13px] bg-surface-subtle border border-border-subtle text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Source & Relation Meta */}
          <div className="space-y-1 text-[13px] text-text-secondary">
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">来源:</span>
              <span className="text-text-primary font-medium truncate max-w-[140px]">
                {asset.sourceLabel}
              </span>
            </div>

            {asset.usageRelation ? (
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">关系:</span>
                <span className="text-text-primary truncate max-w-[140px]" title={asset.usageRelation.noteTitle}>
                  {asset.usageRelation.usageState === 'reserved' ? '预留: ' : '已发: '}
                  {asset.usageRelation.noteTitle || asset.usageRelation.projectName}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">项目:</span>
                <span className="text-text-secondary truncate max-w-[140px]">
                  {asset.sourceProject || '通用项目素材'}
                </span>
              </div>
            )}
          </div>

          {/* Performance Badge */}
          {renderPerformanceBadge()}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(asset);
            }}
            className="w-full py-1.5 px-2 bg-surface-subtle hover:bg-surface-hover text-text-primary text-[13px] font-medium rounded border border-border-default transition-colors flex items-center justify-center gap-1"
          >
            <Eye size={13} />
            查看素材详情
          </button>
        </div>
      </div>
    </div>
  );
};

