import React, { useState } from 'react';
import { MaterialAsset } from './types';
import {
  X,
  Layers,
  BarChart3,
  FileCheck,
  Check,
  Film,
  Tag,
  AlignLeft,
  Info,
  Sparkles
} from 'lucide-react';
import { getMaterialCategoryLabel, getMaterialUseLabel } from './materialLabels';

interface MaterialDetailDrawerProps {
  asset: MaterialAsset | null;
  onClose: () => void;
  onUpdateAsset?: (updated: MaterialAsset) => void;
  manualTags?: string[];
  onManualTagsChange?: (tags: string[]) => void;
  canCreateDerived?: boolean;
  isOptimizationCandidate?: boolean;
  onCreateDerived?: (asset: MaterialAsset) => void;
}

export const MaterialDetailDrawer: React.FC<MaterialDetailDrawerProps> = ({
  asset,
  onClose,
  onUpdateAsset,
  manualTags = [],
  onManualTagsChange,
  canCreateDerived = false,
  isOptimizationCandidate = false,
  onCreateDerived
}) => {
  if (!asset) return null;
  return <MaterialDetailDrawerContent key={asset.id} asset={asset} onClose={onClose} onUpdateAsset={onUpdateAsset} manualTags={manualTags} onManualTagsChange={onManualTagsChange} canCreateDerived={canCreateDerived} isOptimizationCandidate={isOptimizationCandidate} onCreateDerived={onCreateDerived} />;
};

const MaterialDetailDrawerContent: React.FC<Omit<MaterialDetailDrawerProps, 'asset'> & { asset: MaterialAsset }> = ({
  asset,
  onClose,
  onUpdateAsset,
  manualTags = [],
  onManualTagsChange,
  canCreateDerived = false,
  isOptimizationCandidate = false,
  onCreateDerived
}) => {
  const manualTagSet = new Set(manualTags);
  const existingManualTags = (asset.tags ?? []).filter(tagName => manualTagSet.has(tagName));
  const automaticTags = (asset.tags ?? []).filter(tagName => !manualTagSet.has(tagName));

  // Default to editable state
  const [vectorDescription, setVectorDescription] = useState(asset.vectorDescription || '');
  const [tagsInput, setTagsInput] = useState(existingManualTags);
  const [aiSubject, setAiSubject] = useState(asset.acceptance.aiRecognition.subject);
  const [aiProduct, setAiProduct] = useState(asset.acceptance.aiRecognition.product);
  const [aiScene, setAiScene] = useState(asset.acceptance.aiRecognition.scene);

  const handleSaveAndClose = () => {
    if (onUpdateAsset) {
      onManualTagsChange?.(tagsInput);

      onUpdateAsset({
        ...asset,
        vectorDescription: vectorDescription.trim(),
        tags: Array.from(new Set([...automaticTags, ...tagsInput])),
        acceptance: {
          ...asset.acceptance,
          aiRecognition: {
            ...asset.acceptance.aiRecognition,
            subject: aiSubject,
            product: aiProduct,
            scene: aiScene,
            status: 'passed',
            confidenceNotice: undefined
          }
        }
      });
    }
    onClose();
  };

  const TOGGLE_TAGS = ['9月新品', '门店实拍', 'KOC反馈', '高质量封面', '主粮', '宠物互动', '3D抠图'];

  const toggleTag = (tag: string) => {
    setTagsInput(current => 
      current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-black/30 backdrop-blur-[2px]">
      <div className="w-[520px] max-w-full bg-surface-1 h-full shadow-2xl border-l border-border-default flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="h-14 px-5 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-subtle">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider shrink-0">
              {asset.id}
            </span>
            <span className="text-border-strong shrink-0">|</span>
            <h3 className="text-[14px] font-semibold text-text-primary truncate">
              {asset.name}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-hover text-text-tertiary hover:text-text-primary transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* Section 1: Preview Image */}
          <div className="rounded-xl border border-border-default overflow-hidden bg-surface-subtle shadow-sm relative group">
            <img 
              src={asset.url} 
              alt={asset.name} 
              className="w-full h-auto object-contain max-h-[320px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y4ZjlmYSIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlZGYwZjIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlZGYwZjIiLz4KPC9zdmc+')] bg-repeat"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="px-2 py-1 rounded bg-black/60 text-white text-[12px] font-medium backdrop-blur-md">
                {asset.aspectRatio}
              </span>
              <span className="px-2 py-1 rounded bg-black/60 text-white text-[12px] font-medium backdrop-blur-md">
                {asset.resolution}
              </span>
            </div>
            {asset.acceptance.aiRecognition.confidenceNotice && (
              <div className="absolute bottom-3 left-3 right-3 bg-amber-50/95 backdrop-blur-md border border-amber-200 p-2.5 rounded-lg text-[12px] text-amber-800 flex items-start gap-2 shadow-sm">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span className="leading-snug">{asset.acceptance.aiRecognition.confidenceNotice}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[12px] text-text-tertiary">文件大小</span>
              <div className="text-[13px] font-medium text-text-primary">{asset.sizeBytes ? `${(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB` : '未知'}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[12px] text-text-tertiary">格式</span>
              <div className="text-[13px] font-medium text-text-primary">{asset.fileFormat?.toUpperCase()}</div>
            </div>
          </div>

          {/* Section 2: One-Sentence Vector Description & Tags */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-1.5">
              <AlignLeft size={14} className="text-text-secondary" />
              画面描述与标签
            </h4>
            
            <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle space-y-3 text-[13px]">
              <div>
                <label className="text-text-tertiary block mb-1 font-medium">画面描述:</label>
                <textarea
                  rows={2}
                  value={vectorDescription}
                  onChange={(e) => setVectorDescription(e.target.value)}
                  placeholder="描述画面的核心特征，例如：浅黄色包装袋直立放置，右下角包含柴犬吃粮画面..."
                  className="w-full p-2 bg-surface-1 border border-border-default rounded text-[13px] focus:outline-none focus:border-border-strong"
                />
              </div>
              <div>
                <label className="text-text-tertiary block mb-2 font-medium">手动分类标签:</label>
                <div className="flex flex-wrap gap-2">
                  {TOGGLE_TAGS.map(tag => {
                    const selected = tagsInput.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1.5 rounded-lg text-[13px] font-medium border ${selected ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-surface-1 border-border-default text-text-secondary hover:border-border-strong'}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Business Classification */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-1.5">
              <Layers size={14} className="text-text-secondary" />
              业务分类
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[12px] text-text-tertiary">内容资产类型</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-logo"></span>
                  <span className="text-[13px] font-medium text-text-primary">
                    {getMaterialCategoryLabel(asset.category)}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[12px] text-text-tertiary">建议用途</span>
                <div className="text-[13px] font-medium text-text-primary flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md bg-surface-subtle border border-border-default text-text-secondary leading-none">
                    {getMaterialUseLabel(asset.materialUse)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Performance Data */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-1.5">
              <BarChart3 size={14} className="text-text-secondary" />
              封面关联表现
            </h4>
            {asset.performance.performanceType === 'owned_account_creator_api' && asset.performance.creatorBackend ? (
              <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle text-[13px] space-y-2.5">
                <div className="grid grid-cols-4 gap-2 text-center bg-surface-1 p-2 rounded border border-border-subtle">
                  <div>
                    <span className="text-text-tertiary text-[13px] block">曝光数</span>
                    <span className="font-semibold text-text-primary text-[13px]">{asset.performance.creatorBackend.exposure.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[13px] block">阅读数</span>
                    <span className="font-semibold text-text-primary text-[13px]">{asset.performance.creatorBackend.reads.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[13px] block">互动数</span>
                    <span className="font-semibold text-text-primary text-[13px]">{asset.performance.creatorBackend.interactions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[13px] block">封面点击率</span>
                    <span className="font-semibold text-emerald-700 text-[13px]">{asset.performance.creatorBackend.coverClickRate}%</span>
                  </div>
                </div>
                <div className="space-y-1 text-[13px] text-text-secondary pt-1 border-t border-border-subtle">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">后台原始指标名称:</span>
                    <span className="text-text-primary">{asset.performance.creatorBackend.originalMetricName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">数据来源与覆盖:</span>
                    <span className="text-text-primary">{asset.performance.creatorBackend.dataSource} ({asset.performance.creatorBackend.dataCoverageStatus})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">最近同步时间:</span>
                    <span className="text-text-tertiary">{asset.performance.creatorBackend.lastSyncTime}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-text-tertiary bg-surface-subtle p-3 rounded-lg border border-border-subtle">
                暂无创作者后台关联数据 (素材未发布或非关联封面)
              </div>
            )}
          </div>

          {/* Section 6: Image Attributes & Recognition */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center justify-between border-b border-border-subtle pb-1.5">
              <span className="flex items-center gap-1.5">
                <FileCheck size={14} className="text-text-secondary" />
                系统识别信息
              </span>
              <span className="px-1.5 py-0.5 rounded text-[13px] bg-surface-1 border border-border-default text-text-secondary font-medium">
                {asset.acceptance.aiRecognition.tag}
              </span>
            </h4>
            
            {/* Editable Recognition Box */}
            <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle text-[13px] space-y-2">
              <div className="space-y-2 text-[13px]">
                <div>
                  <label className="text-text-tertiary block mb-0.5 font-medium">主体描述:</label>
                  <input
                    type="text"
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-1 border border-border-default rounded text-[13px] focus:outline-none focus:border-border-strong"
                  />
                </div>
                <div>
                  <label className="text-text-tertiary block mb-0.5 font-medium">关联产品:</label>
                  <input
                    type="text"
                    value={aiProduct}
                    onChange={(e) => setAiProduct(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-1 border border-border-default rounded text-[13px] focus:outline-none focus:border-border-strong"
                  />
                </div>
                <div>
                  <label className="text-text-tertiary block mb-0.5 font-medium">画面场景:</label>
                  <input
                    type="text"
                    value={aiScene}
                    onChange={(e) => setAiScene(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-1 border border-border-default rounded text-[13px] focus:outline-none focus:border-border-strong"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border-default bg-surface-subtle flex items-center justify-between gap-3 shrink-0">
          <span className="text-[13px] text-text-tertiary">处理结果保存为新图片，不覆盖原图</span>
          
          <div className="flex shrink-0 items-center gap-2">
            {canCreateDerived && onCreateDerived ? (
              <button
                type="button"
                onClick={() => onCreateDerived(asset)}
                className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-4 py-2 text-[13px] font-medium text-text-primary hover:bg-surface-hover"
              >
                <Sparkles size={13} className="text-brand-logo" />
                {isOptimizationCandidate ? '优化并生成新图片' : '用这张图生成新图片'}
              </button>
            ) : null}
            <button
              onClick={handleSaveAndClose}
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-950 rounded-lg text-[13px] font-medium text-white shadow-sm transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
