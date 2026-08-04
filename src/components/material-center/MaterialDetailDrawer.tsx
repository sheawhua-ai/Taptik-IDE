import React, { useState } from 'react';
import { MaterialAsset } from './types';
import {
  X, Sparkles, Edit3, Check, Clock, ShieldCheck,
  FileText, Layers, AlertCircle, Play, History, RotateCcw,
  ExternalLink, ChevronDown, ChevronUp, Share2
} from 'lucide-react';

interface MaterialDetailDrawerProps {
  asset: MaterialAsset;
  onClose: () => void;
  onUpdateUnderstanding: (assetId: string, newText: string) => Promise<void>;
  onActivateFineTune: (asset: MaterialAsset) => void;
}

export const MaterialDetailDrawer: React.FC<MaterialDetailDrawerProps> = ({
  asset,
  onClose,
  onUpdateUnderstanding,
  onActivateFineTune
}) => {
  const [isEditingUnderstanding, setIsEditingUnderstanding] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(asset.oneSentenceUnderstanding);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState<boolean>(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);

  const handleSaveUnderstanding = async () => {
    if (!editedText.trim() || editedText.trim() === asset.oneSentenceUnderstanding) {
      setIsEditingUnderstanding(false);
      return;
    }
    setIsUpdating(true);
    setUpdateSuccessMessage(null);
    try {
      await onUpdateUnderstanding(asset.id, editedText.trim());
      setIsEditingUnderstanding(false);
      setUpdateSuccessMessage('理解已更新');
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    } catch (e) {
      alert('理解更新失败，旧版本依然有效。请重试。');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = () => {
    switch (asset.status) {
      case 'available':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
            当前可用
          </span>
        );
      case 'in_use':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-primary-50 text-primary-700 border border-primary-200">
            使用中（锁定中）
          </span>
        );
      case 'used':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">
            已使用（需通过微调重新复用）
          </span>
        );
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

        {/* Content Body: 4 major sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7 text-[13px] text-neutral-700">
          {/* 1. 图片 / 视频 */}
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
                <span>视频素材 · {asset.duration}</span>
              </div>
            )}
          </div>

          {/* 2. AI理解 (一句话理解、修改理解、适合用途、明显不足) */}
          <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-neutral-900 text-[14px]">
                <Sparkles size={16} className="text-primary-600" />
                <span>AI理解</span>
              </div>
              <div className="flex items-center gap-2">
                {asset.understandingHistory.length > 1 && (
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="text-[11.5px] font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors"
                  >
                    <History size={13} />
                    <span>理解记录({asset.understandingHistory.length})</span>
                  </button>
                )}
                {!isEditingUnderstanding && (
                  <button
                    onClick={() => {
                      setEditedText(asset.oneSentenceUnderstanding);
                      setIsEditingUnderstanding(true);
                    }}
                    className="text-[12px] font-extrabold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                  >
                    <Edit3 size={13} />
                    <span>修改理解</span>
                  </button>
                )}
              </div>
            </div>

            {updateSuccessMessage && (
              <div className="px-3 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-bold text-[12px] flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                <span>{updateSuccessMessage}</span>
              </div>
            )}

            {/* 修改理解交互 */}
            {isEditingUnderstanding ? (
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-neutral-300 shadow-2xs">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-800 transition-all"
                  placeholder="描述当前图片或视频的核心画面、适用主题及明显特征..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-medium text-amber-700">
                    保存后，AI会按照新的理解搜索和推荐这张素材。
                  </span>
                  <div className="flex items-center gap-2">
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
                      {isUpdating ? '正在更新理解...' : '保存理解'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[13.5px] font-bold text-neutral-800 leading-relaxed bg-white p-3.5 rounded-xl border border-neutral-200/80">
                {asset.oneSentenceUnderstanding}
              </p>
            )}

            {/* 适合用途与明显不足: 两行轻量文字 */}
            <div className="space-y-1.5 pt-1 text-[12.5px]">
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-neutral-900 shrink-0">适合用途：</span>
                <span className="font-medium text-neutral-700">{asset.recommendationUse}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-neutral-900 shrink-0">明显不足：</span>
                <span className="font-medium text-neutral-500">{asset.drawback}</span>
              </div>
            </div>

            {/* 展开/折叠完整画面分析 */}
            <div className="pt-2 border-t border-neutral-200">
              <button
                onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                className="w-full flex items-center justify-between text-[12px] font-extrabold text-neutral-600 hover:text-neutral-900 py-1"
              >
                <span>查看完整画面分析（主体、光线、构图等）</span>
                {showFullAnalysis ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showFullAnalysis && (
                <div className="mt-3 space-y-2 bg-white p-3.5 rounded-xl border border-neutral-200 text-[12px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">主要主体</span>
                      <span className="font-bold text-neutral-800">{asset.fullAiAnalysis.subject}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">产品呈现</span>
                      <span className="font-bold text-neutral-800">{asset.fullAiAnalysis.product}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">场景布置</span>
                      <span className="font-bold text-neutral-800">{asset.fullAiAnalysis.scene}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">构图方式</span>
                      <span className="font-bold text-neutral-800">{asset.fullAiAnalysis.composition}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">光线色彩</span>
                      <span className="font-bold text-neutral-800">{asset.fullAiAnalysis.lightingColor}</span>
                    </div>
                    {asset.fullAiAnalysis.ocrText && (
                      <div>
                        <span className="text-neutral-400 block text-[11px]">文字识别 (OCR)</span>
                        <span className="font-bold text-neutral-800">{asset.fullAiAnalysis.ocrText}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. 来源 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-neutral-600" />
              <span>来源</span>
            </h3>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2.5">
              <div className="grid grid-cols-2 gap-y-2 text-[12.5px]">
                <div>
                  <span className="text-neutral-400 text-[11px] block">来源项目</span>
                  <span className="font-extrabold text-neutral-900">{asset.sourceProject}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[11px] block">拍摄任务</span>
                  <span className="font-bold text-neutral-800">{asset.sourceTask}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[11px] block">拍摄镜头</span>
                  <span className="font-bold text-neutral-800">{asset.shotName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[11px] block">执行门店</span>
                  <span className="font-bold text-neutral-800">{asset.store}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[11px] block">执行人</span>
                  <span className="font-bold text-neutral-800">{asset.executor}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[11px] block">上传时间</span>
                  <span className="font-medium text-neutral-600">{asset.uploadTime}</span>
                </div>
              </div>

              {/* 更多信息 */}
              <div className="pt-2 border-t border-neutral-200/80 text-[11.5px] text-neutral-500 font-medium space-y-1">
                <span className="font-extrabold text-neutral-700 block">更多信息：</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <span>分辨率：{asset.fileInfo.resolution}</span>
                  <span>格式：{asset.fileInfo.format}</span>
                  <span>文件大小：{asset.fileInfo.size}</span>
                  <span>比例：{asset.fileInfo.aspectRatio}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 使用记录 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-1.5">
              <FileText size={16} className="text-neutral-600" />
              <span>使用记录</span>
            </h3>

            {asset.usageRecords.length === 0 ? (
              <div className="text-neutral-500 text-[13px] font-medium py-1">
                尚未用于任何笔记。
              </div>
            ) : (
              <div className="space-y-3">
                {asset.usageRecords.map((record) => (
                  <div key={record.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-neutral-900">{record.noteTitle}</span>
                      <span className="text-[11px] font-bold text-neutral-500">{record.publishTime || '已锁定/未发布'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[12px] text-neutral-600">
                      <div><span className="text-neutral-400">项目：</span>{record.project}</div>
                      <div><span className="text-neutral-400">账号：</span>{record.account}</div>
                    </div>

                    {record.performanceData && (
                      <div className="mt-2 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[12px] flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={14} className="text-emerald-600 shrink-0" />
                          <span>真实发布数据：{record.performanceData}</span>
                        </div>
                        {asset.status === 'used' && (
                          <button
                            onClick={() => onActivateFineTune(asset)}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[11px] rounded-lg transition-all"
                          >
                            激活微调
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 版本与微调 (可用素材没有衍生版本时不显示) */}
          {(asset.derivationInfo || asset.status === 'used') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-1.5">
                  <Layers size={16} className="text-neutral-600" />
                  <span>衍生版本</span>
                </h3>

                {asset.status === 'used' && (
                  <button
                    onClick={() => onActivateFineTune(asset)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-extrabold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                  >
                    <Sparkles size={13} className="text-amber-400" />
                    <span>激活微调生成衍生版</span>
                  </button>
                )}
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3">
                {asset.derivationInfo ? (
                  <div className="space-y-2 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 text-white font-extrabold text-[11px]">
                        微调衍生版本
                      </span>
                      <span className="text-neutral-500">
                        来源于历史爆款素材微调
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                      <div><span className="text-neutral-400">原素材：</span><span className="font-bold">{asset.derivationInfo.parentName}</span></div>
                      <div><span className="text-neutral-400">微调方式：</span><span className="font-bold text-neutral-800">{asset.derivationInfo.modificationType}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[12.5px] text-neutral-600 space-y-1">
                    <p className="text-neutral-500">
                      该素材为原始版本。如果发布后表现较好，可激活微调制作衍生版本重新投入可用素材池。
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 历史理解修改记录模态框 (Section 8.3 "理解修改记录") */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-60 bg-neutral-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[16px] font-black text-neutral-900">一句话理解修改记录</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {asset.understandingHistory.map((historyItem) => (
                <div key={historyItem.id} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-[12.5px]">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-bold text-neutral-900">版本 V{historyItem.version}</span>
                    <span>{historyItem.updatedAt} · {historyItem.updatedBy}</span>
                  </div>
                  <p className="font-medium text-neutral-800">{historyItem.text}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12.5px] font-extrabold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
