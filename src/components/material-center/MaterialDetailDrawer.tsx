import React, { useState } from 'react';
import { MaterialAsset } from './types';
import {
  X,
  Layers,
  BarChart3,
  FileCheck,
  Edit2,
  Check,
  Film,
  Tag,
  AlignLeft,
  Info
} from 'lucide-react';

interface MaterialDetailDrawerProps {
  asset: MaterialAsset | null;
  onClose: () => void;
  onUpdateAsset?: (updated: MaterialAsset) => void;
}

export const MaterialDetailDrawer: React.FC<MaterialDetailDrawerProps> = ({
  asset,
  onClose,
  onUpdateAsset
}) => {
  if (!asset) return null;

  // Editing state for Vector Description & Tags
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [vectorDescription, setVectorDescription] = useState(asset.vectorDescription || '');
  const [tagsInput, setTagsInput] = useState((asset.tags || []).join(', '));

  // Editing state for Recognition
  const [isEditingRecognition, setIsEditingRecognition] = useState(false);
  const [aiSubject, setAiSubject] = useState(asset.acceptance.aiRecognition.subject);
  const [aiProduct, setAiProduct] = useState(asset.acceptance.aiRecognition.product);
  const [aiScene, setAiScene] = useState(asset.acceptance.aiRecognition.scene);

  const handleSaveMetadata = () => {
    if (onUpdateAsset) {
      const parsedTags = tagsInput
        .split(/[,，]/)
        .map(t => t.trim())
        .filter(Boolean);

      onUpdateAsset({
        ...asset,
        vectorDescription: vectorDescription.trim(),
        tags: parsedTags
      });
    }
    setIsEditingMetadata(false);
  };

  const handleSaveRecognitionEdit = () => {
    if (onUpdateAsset) {
      onUpdateAsset({
        ...asset,
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
    setIsEditingRecognition(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]">
      <div className="w-[520px] max-w-full bg-surface h-full shadow-2xl border-l border-border-default flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="h-14 px-5 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-subtle">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] font-semibold text-text-tertiary uppercase tracking-wider shrink-0">
              {asset.id}
            </span>
            <span className="text-border-strong shrink-0">|</span>
            <h3 className="text-[14px] font-semibold text-text-primary truncate">
              {asset.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-tertiary hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Section 1: Preview & Dimensions */}
          <div className="bg-surface-subtle border border-border-subtle rounded-lg p-3">
            <div className="aspect-[4/3] bg-black/5 rounded overflow-hidden flex items-center justify-center relative">
              {asset.fileType === 'video' ? (
                <div className="relative w-full h-full">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="p-3 bg-black/60 rounded-full text-white">
                      <Film size={24} />
                    </span>
                  </div>
                </div>
              ) : (
                <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" />
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] text-text-secondary text-center pt-2 border-t border-border-subtle">
              <div>
                <span className="text-text-tertiary block">比例</span>
                <span className="font-medium text-text-primary">{asset.aspectRatio}</span>
              </div>
              <div>
                <span className="text-text-tertiary block">分辨率</span>
                <span className="font-medium text-text-primary">{asset.resolution}</span>
              </div>
              <div>
                <span className="text-text-tertiary block">大小</span>
                <span className="font-medium text-text-primary">{asset.fileSize}</span>
              </div>
              <div>
                <span className="text-text-tertiary block">类型</span>
                <span className="font-medium text-text-primary">{asset.fileType.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Section 2: One-Sentence Vector Description & Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
              <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5">
                <AlignLeft size={14} className="text-text-secondary" />
                特征描述与标签 (用于语义匹配)
              </h4>
              {!isEditingMetadata ? (
                <button
                  onClick={() => setIsEditingMetadata(true)}
                  className="text-text-secondary hover:text-text-primary text-[11px] flex items-center gap-1"
                >
                  <Edit2 size={12} /> 编辑
                </button>
              ) : (
                <button
                  onClick={handleSaveMetadata}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px] flex items-center gap-1"
                >
                  <Check size={12} /> 保存
                </button>
              )}
            </div>

            {isEditingMetadata ? (
              <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle space-y-3 text-[12px]">
                <div>
                  <label className="text-text-tertiary block mb-1 font-medium">一句话特征描述 (向量化索引用):</label>
                  <textarea
                    rows={2}
                    value={vectorDescription}
                    onChange={(e) => setVectorDescription(e.target.value)}
                    placeholder="描述画面的核心特征，例如：浅黄色包装袋直立放置，右下角包含柴犬吃粮画面..."
                    className="w-full p-2 bg-surface border border-border-default rounded text-[12px] focus:outline-none focus:border-border-strong"
                  />
                </div>
                <div>
                  <label className="text-text-tertiary block mb-1 font-medium">分类标签 (逗号分隔):</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="如：主粮, 柴犬, 3D抠图"
                    className="w-full px-2.5 py-1.5 bg-surface border border-border-default rounded text-[12px] focus:outline-none focus:border-border-strong"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle space-y-2.5 text-[12px]">
                <div>
                  <span className="text-text-tertiary block mb-0.5">一句话特征描述:</span>
                  <p className="text-text-primary font-medium bg-surface p-2 rounded border border-border-subtle leading-relaxed">
                    {asset.vectorDescription || '暂无描述，可点击编辑添加。'}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">素材标签:</span>
                  <div className="flex flex-wrap gap-1">
                    {asset.tags && asset.tags.length > 0 ? (
                      asset.tags.map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface border border-border-default rounded text-[11px] text-text-primary font-medium">
                          <Tag size={10} className="text-text-tertiary" /> {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-text-tertiary italic">未添加标签</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Basic Info */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-1.5">
              <Info size={14} className="text-text-secondary" />
              基础与状态信息
            </h4>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
              <div>
                <span className="text-text-tertiary">素材分类:</span>{' '}
                <span className="font-medium text-text-primary">
                  {asset.category === 'base_component' ? '基础元件' : '发布素材'}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">素材用途:</span>{' '}
                <span className="font-medium text-text-primary">{asset.materialUse}</span>
              </div>
              <div>
                <span className="text-text-tertiary">当前状态:</span>{' '}
                <span className="font-medium text-text-primary">
                  {asset.status === 'available' ? '可用' : asset.status === 'reserved' ? '已预留' : asset.status === 'used' ? '已使用' : asset.status === 'pending_acceptance' ? '待验收' : '已归档'}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">上传时间:</span>{' '}
                <span className="text-text-secondary">{asset.uploadTime}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Related Project & Note */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-1.5">
              <Layers size={14} className="text-text-secondary" />
              关联项目、笔记及使用状态
            </h4>

            {asset.usageRelation ? (
              <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle text-[12px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">关联项目:</span>
                  <span className="font-medium text-text-primary">{asset.usageRelation.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">关联笔记:</span>
                  <span className="font-medium text-text-primary">{asset.usageRelation.noteTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">发布账号:</span>
                  <span className="text-text-secondary">{asset.usageRelation.accountName || '未指定'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">使用状态:</span>
                  <span className={`font-semibold ${asset.usageRelation.usageState === 'used' ? 'text-text-primary' : 'text-blue-700'}`}>
                    {asset.usageRelation.usageState === 'used' ? '已正式发布使用 (不可再二次绑定)' : '已预留至笔记草稿'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[12px] text-text-tertiary bg-surface-subtle p-3 rounded-lg border border-border-subtle">
                当前素材暂未绑定或预留给任何笔记草稿，处于【可用】池。
              </div>
            )}
          </div>

          {/* Section 5: Performance Data */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5 border-b border-border-subtle pb-1.5">
              <BarChart3 size={14} className="text-text-secondary" />
              封面关联表现
            </h4>

            {asset.performance.performanceType === 'owned_account_creator_api' && asset.performance.creatorBackend ? (
              <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle text-[12px] space-y-2.5">
                <div className="grid grid-cols-4 gap-2 text-center bg-surface p-2 rounded border border-border-subtle">
                  <div>
                    <span className="text-text-tertiary text-[10px] block">曝光数</span>
                    <span className="font-semibold text-text-primary text-[13px]">{asset.performance.creatorBackend.exposure.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[10px] block">阅读数</span>
                    <span className="font-semibold text-text-primary text-[13px]">{asset.performance.creatorBackend.reads.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[10px] block">互动数</span>
                    <span className="font-semibold text-text-primary text-[13px]">{asset.performance.creatorBackend.interactions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary text-[10px] block">封面点击率</span>
                    <span className="font-semibold text-emerald-700 text-[13px]">{asset.performance.creatorBackend.coverClickRate}%</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-text-secondary pt-1 border-t border-border-subtle">
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
              <div className="text-[12px] text-text-tertiary bg-surface-subtle p-3 rounded-lg border border-border-subtle">
                暂无创作者后台关联数据 (素材未发布或非关联封面)
              </div>
            )}
          </div>

          {/* Section 6: Image Attributes & Recognition */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-semibold text-text-primary flex items-center justify-between border-b border-border-subtle pb-1.5">
              <span className="flex items-center gap-1.5">
                <FileCheck size={14} className="text-text-secondary" />
                画面视觉属性识别
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface border border-border-default text-text-secondary font-medium">
                {asset.acceptance.aiRecognition.tag}
              </span>
            </h4>

            {/* Editable Recognition Box */}
            <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle text-[12px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">视觉元素提取:</span>
                {!isEditingRecognition ? (
                  <button
                    onClick={() => setIsEditingRecognition(true)}
                    className="text-text-secondary hover:text-text-primary text-[11px] flex items-center gap-1"
                  >
                    <Edit2 size={12} /> 编辑修正
                  </button>
                ) : (
                  <button
                    onClick={handleSaveRecognitionEdit}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Check size={12} /> 保存修正
                  </button>
                )}
              </div>

              {isEditingRecognition ? (
                <div className="space-y-2 text-[11px]">
                  <div>
                    <label className="text-text-tertiary block mb-0.5">主体描述:</label>
                    <input
                      type="text"
                      value={aiSubject}
                      onChange={(e) => setAiSubject(e.target.value)}
                      className="w-full px-2 py-1 bg-surface border border-border-default rounded text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-text-tertiary block mb-0.5">关联产品:</label>
                    <input
                      type="text"
                      value={aiProduct}
                      onChange={(e) => setAiProduct(e.target.value)}
                      className="w-full px-2 py-1 bg-surface border border-border-default rounded text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-text-tertiary block mb-0.5">画面场景:</label>
                    <input
                      type="text"
                      value={aiScene}
                      onChange={(e) => setAiScene(e.target.value)}
                      className="w-full px-2 py-1 bg-surface border border-border-default rounded text-[11px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-text-secondary">
                  <div><span className="text-text-tertiary">画面主体:</span> {asset.acceptance.aiRecognition.subject}</div>
                  <div><span className="text-text-tertiary">关联产品:</span> {asset.acceptance.aiRecognition.product}</div>
                  <div><span className="text-text-tertiary">场景:</span> {asset.acceptance.aiRecognition.scene}</div>
                  <div><span className="text-text-tertiary">构图:</span> {asset.acceptance.aiRecognition.composition}</div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border-default bg-surface-subtle flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border-default bg-surface hover:bg-surface-hover rounded text-[12px] font-medium text-text-primary"
          >
            关闭详情
          </button>
        </div>

      </div>
    </div>
  );
};

