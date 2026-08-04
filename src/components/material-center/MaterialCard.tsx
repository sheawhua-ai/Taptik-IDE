import React from 'react';
import { MaterialAsset } from './types';

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
  // 极简中性色状态展示
  const getStatusBadge = () => {
    switch (asset.status) {
      case 'available':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
            可用
          </span>
        );
      case 'in_use':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-neutral-900 text-white">
            使用中
          </span>
        );
      case 'used':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11.5px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">
            已使用
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onView(asset)}
      className={`group relative bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-2xs hover:shadow-md ${
        isSelected
          ? 'border-neutral-900 ring-2 ring-neutral-900'
          : 'border-neutral-200/80 hover:border-neutral-300'
      }`}
    >
      {/* 1. 图片或视频封面 */}
      <div className="relative w-full aspect-4/3 bg-neutral-100 overflow-hidden">
        <img
          src={asset.url}
          alt={asset.oneSentenceUnderstanding}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 2 & 3. 一句话画面理解(最多显示两行) + 状态标签 */}
      <div className="p-4 space-y-2.5">
        <p className="text-[13px] font-medium text-neutral-800 line-clamp-2 leading-relaxed">
          {asset.oneSentenceUnderstanding}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
};

