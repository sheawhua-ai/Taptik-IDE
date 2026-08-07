import React, { useState } from 'react';
import { MaterialAsset } from './types';
import {
  X, Sparkles, Edit3, Check, ShieldCheck, FileText, Image as ImageIcon, Play
} from 'lucide-react';

interface MaterialDetailDrawerProps {
  asset: MaterialAsset;
  onClose: () => void;
  onUpdateUnderstanding: (assetId: string, newText: string) => Promise<void>;
  onActivateFineTune?: (asset: MaterialAsset) => void;
}

export const MaterialDetailDrawer: React.FC<MaterialDetailDrawerProps> = ({
  asset,
  onClose,
  onUpdateUnderstanding
}) => {
  const [isEditingUnderstanding, setIsEditingUnderstanding] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(asset.aiOneLineUnderstanding || '');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);

  const handleSaveUnderstanding = async () => {
    if (!editedText.trim() || editedText.trim() === asset.aiOneLineUnderstanding) {
      setIsEditingUnderstanding(false);
      return;
    }
    setIsUpdating(true);
    setUpdateSuccessMessage(null);
    try {
      await onUpdateUnderstanding(asset.id, editedText.trim());
      setIsEditingUnderstanding(false);
      setUpdateSuccessMessage('AI理解已更新');
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    } catch (e) {
      alert('更新失败，请重试。');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = () => {
    switch (asset.status) {
      case 'available':
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">可用</span>;
      case 'reserved':
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-900 text-white">已预占</span>;
      case 'used':
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">已使用</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-amber-50 text-amber-700 border border-amber-200">待审核</span>;
      case 'optimizing':
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">优化中</span>;
      case 'unavailable':
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-red-50 text-red-700 border border-red-200">不可用</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">{asset.status}</span>;
    }
  };

  const getCoverSuitabilityLabel = () => {
    switch (asset.suitableForCover) {
      case 'suitable': return '适合做封面';
      case 'optimized_suitable': return 'AI优化后适合做封面';
      case 'unsuitable': return '仅适合作为正文配图';
      default: return '未知';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-neutral-900/40 backdrop-blur-xs">
      <div className="w-full max-w-[560px] bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-black text-neutral-900">素材详情</h2>
            {getStatusBadge()}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-7 text-[13px] text-neutral-700">
          {/* 1. 媒体预览 */}
          <div className="rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 relative">
            <img
              src={asset.url}
              alt="Asset preview"
              referrerPolicy="no-referrer"
              className="w-full max-h-[320px] object-contain mx-auto"
            />
            {asset.type === 'video' && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 text-white text-[12px] font-bold flex items-center gap-1.5 backdrop-blur-xs">
                <Play size={13} className="fill-current" />
                <span>视频素材 · {asset.duration || '00:00'}</span>
              </div>
            )}
          </div>

          {/* 2. AI理解与封面建议 */}
          <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-neutral-900 text-[14px]">
                <Sparkles size={16} className="text-primary-600" />
                <span>AI 画面理解</span>
              </div>
              {!isEditingUnderstanding && (
                <button
                  onClick={() => {
                    setEditedText(asset.aiOneLineUnderstanding || '');
                    setIsEditingUnderstanding(true);
                  }}
                  className="text-[12px] font-extrabold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                  <Edit3 size={13} />
                  <span>修改</span>
                </button>
              )}
            </div>

            {updateSuccessMessage && (
              <div className="px-3 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-bold text-[12px] flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                <span>{updateSuccessMessage}</span>
              </div>
            )}

            {isEditingUnderstanding ? (
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-neutral-300 shadow-2xs">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-800 transition-all"
                  placeholder="描述当前画面的核心特点..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingUnderstanding(false)}
                    disabled={isUpdating}
                    className="px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 font-bold text-[12px]"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveUnderstanding}
                    disabled={isUpdating}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[12px] flex items-center gap-1.5 shadow-2xs active:scale-95"
                  >
                    {isUpdating ? '正在保存...' : '保存修改'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[13.5px] font-bold text-neutral-800 leading-relaxed bg-white p-3.5 rounded-xl border border-neutral-200/80">
                {asset.aiOneLineUnderstanding || '无描述'}
              </p>
            )}

            <div className="pt-2 flex items-center gap-2">
              <span className="font-extrabold text-neutral-900 shrink-0 text-[12.5px]">封面适用性：</span>
              <span className={`text-[12.5px] font-bold px-2 py-0.5 rounded-md ${
                asset.suitableForCover === 'suitable' ? 'bg-emerald-50 text-emerald-700' :
                asset.suitableForCover === 'optimized_suitable' ? 'bg-amber-50 text-amber-700' :
                'bg-neutral-200 text-neutral-700'
              }`}>
                {getCoverSuitabilityLabel()}
              </span>
            </div>
          </div>

          {/* 3. 基础来源信息 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-neutral-600" />
              <span>来源信息</span>
            </h3>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12.5px]">
                <div>
                  <span className="text-neutral-400 text-[11px] block">来源类型</span>
                  <span className="font-extrabold text-neutral-900">
                    {asset.sourceType === 'operator' ? '操盘手上传' :
                     asset.sourceType === 'clerk' ? '店员上传' :
                     asset.sourceType === 'consumer' ? '消费者上传' :
                     asset.sourceType === 'ai_optimized' ? 'AI优化生成' : '其他'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[11px] block">上传者</span>
                  <span className="font-bold text-neutral-800">{asset.uploader || '未知'}</span>
                </div>
                {asset.sourceProject && (
                  <div className="col-span-2">
                    <span className="text-neutral-400 text-[11px] block">来源项目</span>
                    <span className="font-bold text-neutral-800">{asset.sourceProject}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-neutral-400 text-[11px] block">上传时间</span>
                  <span className="font-medium text-neutral-600">{asset.uploadTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 使用记录 (关联笔记) */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-1.5">
              <FileText size={16} className="text-neutral-600" />
              <span>使用记录</span>
            </h3>

            {(!asset.linkedNoteTitle && asset.usageRecords.length === 0) ? (
              <div className="text-neutral-500 text-[13px] font-medium py-1">
                尚未绑定任何笔记。
              </div>
            ) : (
              <div className="space-y-3">
                {asset.linkedNoteTitle && (
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-neutral-900">{asset.linkedNoteTitle}</span>
                      <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-bold">当前绑定</span>
                    </div>
                  </div>
                )}
                {asset.usageRecords.map((record) => (
                  <div key={record.id} className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2 opacity-80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-neutral-700">{record.noteTitle}</span>
                      <span className="text-[11px] font-bold text-neutral-500">{record.publishTime || '已锁定/未发布'}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      项目：{record.project}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
