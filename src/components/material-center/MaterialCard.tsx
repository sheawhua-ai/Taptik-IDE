import React from 'react';
import { MaterialAsset } from './types';
import { Image as ImageIcon, Video } from 'lucide-react';

interface MaterialCardProps {
  asset: MaterialAsset;
  isSelected?: boolean;
  onView: (asset: MaterialAsset) => void;
  onSelect?: (asset: MaterialAsset) => void;
  onViewSimilar?: (asset: MaterialAsset) => void;
  onViewWhereUsed?: (asset: MaterialAsset) => void;
  onViewResults?: (asset: MaterialAsset) => void;
  onActivateFineTune?: (asset: MaterialAsset) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  asset,
  isSelected,
  onView
}) => {
  const getStatusBadge = () => {
    switch (asset.status) {
      case 'available':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-hover-bg text-text-main border border-border-default">
            可用
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-btn-main text-white">
            已预占
          </span>
        );
      case 'used':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-hover-bg text-text-tertiary border border-border-default">
            已使用
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            待审核
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-hover-bg text-text-tertiary border border-border-default">
            {asset.status}
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onView(asset)}
      className={`group relative bg-surface-1 rounded-xl border transition-all cursor-pointer overflow-hidden shadow-2xs hover:shadow-md ${
        isSelected
          ? 'border-neutral-900 ring-2 ring-neutral-900'
          : 'border-border-default/80 hover:border-neutral-300'
      }`}
    >
      {/* 1. 图片或视频封面 */}
      <div className="relative w-full aspect-4/3 bg-hover-bg overflow-hidden">
        <img
          src={asset.url}
          alt={asset.aiOneLineUnderstanding}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Cover Suitability Badge */}
        {(asset.suitableForCover === 'suitable' || asset.suitableForCover === 'optimized_suitable') && (
          <div className="absolute top-2 left-2 bg-surface-1/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-text-main shadow-sm">
            适合封面
          </div>
        )}
      </div>

      {/* 2 & 3. 一句话画面理解(最多显示两行) + 状态标签 */}
      <div className="p-4 space-y-2.5">
        <p className="text-[13px] font-medium text-text-main line-clamp-2 leading-relaxed">
          {asset.aiOneLineUnderstanding || '无描述'}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-border-default">
          {getStatusBadge()}
          <span className="text-[11px] font-medium text-text-tertiary">
             {asset.sourceProject || '其他来源'}
          </span>
        </div>
      </div>
    </div>
  );
};

