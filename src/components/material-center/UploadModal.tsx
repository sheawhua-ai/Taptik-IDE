import React, { useState } from 'react';
import { MaterialAsset, MaterialCategory, MaterialUse, MaterialSourceType } from './types';
import { X, UploadCloud, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newAsset: MaterialAsset) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  if (!isOpen) return null;

  const [assetName, setAssetName] = useState('');
  const [sourceType, setSourceType] = useState<MaterialSourceType>('merchant');
  const [sourceProject, setSourceProject] = useState('幼犬换粮软便卡位项目');
  const [tagsInput, setTagsInput] = useState('');
  const [vectorDescription, setVectorDescription] = useState('');
  const [previewUrl] = useState('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80');

  // Automated Classification toggle/state
  const [autoClassify, setAutoClassify] = useState(true);
  const [category, setCategory] = useState<MaterialCategory>('publish_material');
  const [materialUse, setMaterialUse] = useState<MaterialUse>('cover');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto inferred fields
    const finalName = assetName.trim() || '上传素材_' + new Date().toLocaleDateString();
    const parsedTags = tagsInput
      ? tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean)
      : ['操盘手回传', '小红书素材'];
    
    const finalVectorDesc = vectorDescription.trim() || `${finalName} - 高清实拍素材，用于笔记配图或封面制作`;

    const newAsset: MaterialAsset = {
      id: `MAT-2026-UP-${Date.now().toString().slice(-4)}`,
      name: finalName,
      url: previewUrl,
      aspectRatio: '3:4',
      fileType: 'image',
      fileSize: '3.6 MB',
      resolution: '3024x4032',

      category: autoClassify ? 'publish_material' : category,
      status: 'available',
      materialUse: autoClassify ? 'real_shot' : materialUse,
      sourceType: sourceType,
      sourceLabel: sourceType === 'merchant' ? '操盘手上传' : '任务上传',

      uploader: '操盘手',
      uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sourceProject: sourceProject,

      tags: parsedTags,
      vectorDescription: finalVectorDesc,

      performance: {
        hasBackendData: false,
        performanceType: 'none'
      },

      acceptance: {
        aiRecognition: {
          tag: '智能特征识别',
          status: 'passed',
          subject: '上传素材画面',
          product: '极宠家系列',
          scene: '室内拍摄',
          composition: '画面居中',
          lightingColor: '自然光'
        },
        manualAcceptance: {
          operatorName: '操盘手',
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          passed: true,
          comment: '上传确认合格'
        }
      }
    };

    onUploadSuccess(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-[520px] max-w-full bg-surface rounded-xl shadow-2xl border border-border-default flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="h-14 px-6 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-subtle">
          <h3 className="text-[15px] font-semibold text-text-primary">
            上传素材至素材库
          </h3>

          <button
            onClick={onClose}
            className="p-1.5 text-text-tertiary hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-[13px] overflow-y-auto max-h-[75vh]">
          
          {/* Drag & Drop Box */}
          <div className="border-2 border-dashed border-border-default hover:border-action-primary bg-surface-subtle p-6 rounded-lg text-center cursor-pointer transition-colors">
            <UploadCloud size={32} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-[13px] font-semibold text-text-primary">点击或拖拽本地图片/视频文件上传</p>
            <p className="text-[13px] text-text-tertiary mt-1">支持 PNG, JPG, MP4 (单文件最大 100MB)</p>
          </div>

          <div>
            <label className="text-text-tertiary text-[13px] block mb-1 font-medium">素材名称</label>
            <input
              type="text"
              placeholder="如未填写，系统将根据文件名自动命名"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px] focus:outline-none focus:border-border-strong"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-tertiary text-[13px] block mb-1 font-medium">素材来源</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as MaterialSourceType)}
                className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
              >
                <option value="merchant">操盘手上传</option>
                <option value="task_upload">任务上传 (来自执行中心)</option>
              </select>
            </div>

            <div>
              <label className="text-text-tertiary text-[13px] block mb-1 font-medium font-medium">所属项目</label>
              <input
                type="text"
                value={sourceProject}
                onChange={(e) => setSourceProject(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
              />
            </div>
          </div>

          {/* Automated Classification Toggle */}
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 size={16} className="text-text-secondary" />
              <div>
                <span className="text-[13px] font-semibold text-text-primary block">智能自动归类与标签提取</span>
                <span className="text-[13px] text-text-tertiary block">系统上传后自动识别主体、计算分辨率并提取检索特征</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoClassify}
              onChange={(e) => setAutoClassify(e.target.checked)}
              className="w-4 h-4 rounded border-border-strong text-action-primary focus:ring-action-primary accent-neutral-900 cursor-pointer"
            />
          </div>

          {!autoClassify && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-surface-subtle border border-border-subtle rounded-lg">
              <div>
                <label className="text-text-tertiary text-[13px] block mb-1 font-medium">素材分类</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                  className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
                >
                  <option value="publish_material">发布素材 (小红书笔记素材)</option>
                  <option value="base_component">基础元件 (抠图/Logo/色板)</option>
                </select>
              </div>

              <div>
                <label className="text-text-tertiary text-[13px] block mb-1 font-medium">素材用途</label>
                <select
                  value={materialUse}
                  onChange={(e) => setMaterialUse(e.target.value as MaterialUse)}
                  className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
                >
                  <option value="cover">封面图</option>
                  <option value="real_shot">实拍素材</option>
                  <option value="body_image">笔记配图</option>
                  <option value="component_cutout">产品抠图/透明底图</option>
                  <option value="component_logo">品牌Logo/水印</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-text-tertiary text-[13px] block mb-1 font-medium">素材标签 (选填，逗号分隔)</label>
            <input
              type="text"
              placeholder="如：主粮, 柴犬进食, 静态实拍"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
            />
          </div>

          <div>
            <label className="text-text-tertiary text-[13px] block mb-1 font-medium">一句话特征描述 (选填)</label>
            <input
              type="text"
              placeholder="用于后续向量化检索匹配，留空将自动生成"
              value={vectorDescription}
              onChange={(e) => setVectorDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
            />
          </div>

          {/* Footer Buttons inside form */}
          <div className="pt-4 border-t border-border-default flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-default hover:bg-surface-hover rounded text-[13px] font-medium text-text-primary"
            >
              取消
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={15} />
              确认上传
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

