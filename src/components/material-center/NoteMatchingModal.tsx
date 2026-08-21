import React, { useState } from 'react';
import { MaterialAsset, NoteDraftRequirement } from './types';
import {
  X, Sparkles, CheckCircle2, AlertTriangle, Layers,
  ArrowRight, ShieldCheck, RefreshCw, FileText, Plus, Check, Eye
} from 'lucide-react';

interface NoteMatchingModalProps {
  noteDraft: NoteDraftRequirement;
  allAssets: MaterialAsset[];
  onClose: () => void;
  onSelectAssetForPosition: (posIndex: number, asset: MaterialAsset) => void;
  onOpenCreateReshootTask: () => void;
  onViewAssetDetail: (asset: MaterialAsset) => void;
}

export const NoteMatchingModal: React.FC<NoteMatchingModalProps> = ({
  noteDraft,
  allAssets,
  onClose,
  onSelectAssetForPosition,
  onOpenCreateReshootTask,
  onViewAssetDetail
}) => {
  const [selectedPosIndex, setSelectedPosIndex] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(true); // 默认已加载扫描结果
  const [confirmedPositions, setConfirmedPositions] = useState<Record<number, string>>({});

  const currentPos = noteDraft.imagePositions.find((p) => p.posIndex === selectedPosIndex) || noteDraft.imagePositions[0];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 800);
  };

  const handleConfirmAsset = (posIndex: number, asset: MaterialAsset) => {
    setConfirmedPositions((prev) => ({ ...prev, [posIndex]: asset.id }));
    onSelectAssetForPosition(posIndex, asset);
  };

  // 根据当前排位获取推荐资产和次选资产
  const getMatchedAsset = (assetId?: string) => {
    return allAssets.find((a) => a.id === assetId);
  };

  return (
    <div className="fixed inset-0 z-60 bg-btn-main/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-1 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-border-default animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-6 border-b border-border-default flex items-center justify-between bg-btn-main text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-btn-main/20 text-primary-400 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-black">笔记驱动素材匹配（草稿扫描能力）</h3>
                <span className="px-2 py-0.5 rounded bg-surface-1/15 text-white text-[11px] font-extrabold">
                  不显示百分比置信度
                </span>
              </div>
              <span className="text-[11.5px] font-bold text-neutral-300">
                笔记策略 → 生成笔记草稿 → 解析配图需求 → 扫描素材中心 → 推荐候选素材
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-1/10 hover:bg-surface-1/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Note Draft Banner */}
        <div className="p-4 bg-page-bg border-b border-border-default/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-btn-main text-white text-[11px] font-extrabold">
                当前笔记草稿
              </span>
              <span className="font-extrabold text-[14px] text-text-main">{noteDraft.noteTitle}</span>
            </div>
            <p className="text-[12px] text-text-secondary line-clamp-1">
              项目：{noteDraft.projectName} · {noteDraft.draftSummary}
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12.5px] font-extrabold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all shrink-0"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            <span>重新扫描素材中心</span>
          </button>
        </div>

        {/* Content Body: Left sidebar for Image Positions, Right panel for 3 Tiers (Section 9.4) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* 左侧：图片需求位导航 */}
          <div className="md:col-span-4 border-r border-border-default bg-page-bg p-4 space-y-2 overflow-y-auto">
            <div className="text-[12px] font-black text-text-tertiary uppercase px-1">
              各配图需求槽位 ({noteDraft.imagePositions.length})
            </div>
            {noteDraft.imagePositions.map((pos) => {
              const isSelected = pos.posIndex === selectedPosIndex;
              const isConfirmed = !!confirmedPositions[pos.posIndex];
              return (
                <div
                  key={pos.posIndex}
                  onClick={() => setSelectedPosIndex(pos.posIndex)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-surface-1 border-neutral-900 ring-2 ring-neutral-900 shadow-sm'
                      : 'bg-surface-1/80 hover:bg-surface-1 border-border-default/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[13.5px] text-text-main">{pos.label}</span>
                    {isConfirmed ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold flex items-center gap-1">
                        <Check size={11} /> 已选
                      </span>
                    ) : pos.matchedLevel === 'recommend' ? (
                      <span className="px-2 py-0.5 rounded bg-brand-light text-primary-700 border border-primary-200 text-[10.5px] font-bold">
                        首选推荐
                      </span>
                    ) : pos.matchedLevel === 'other' ? (
                      <span className="px-2 py-0.5 rounded bg-hover-bg text-text-secondary border border-border-default text-[10.5px] font-bold">
                        其他可选
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-danger border border-danger-light text-[10.5px] font-bold">
                        无合适素材
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] font-medium text-text-secondary line-clamp-2">
                    {pos.requirementDesc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 右侧：推荐素材结果三层级呈现 (Section 9.4 严禁出现技术置信度等分数) */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">
            {isScanning ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-3">
                <RefreshCw size={28} className="text-brand-logo animate-spin" />
                <div className="font-black text-text-main text-[15px]">
                  AI 正在按笔记画面需求扫描商家素材中心...
                </div>
                <div className="text-[12px] text-text-tertiary max-w-sm">
                  正在通过多模态理解与画面构图匹配可用的跨项目素材，无需任何人工打标签
                </div>
              </div>
            ) : (
              <>
                {/* 顶部选位需求总结 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-black text-text-main">
                      {currentPos.label}
                    </h4>
                    <span className="text-[12px] font-bold text-text-tertiary">
                      AI 配图策略分析
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-text-secondary">
                    需求细则：{currentPos.requirementDesc}
                  </p>
                </div>

                {/* 层级 1: 推荐 (Recommend - Section 9.4.1) */}
                {currentPos.matchedLevel === 'recommend' && currentPos.matchedAssetId && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-primary-600 text-white font-extrabold text-[12px]">
                        推荐
                      </span>
                      <span className="text-[12.5px] font-bold text-text-secondary">
                        最适合当前图片位置的可用素材
                      </span>
                    </div>

                    {(() => {
                      const asset = getMatchedAsset(currentPos.matchedAssetId);
                      if (!asset) return null;
                      const isConfirmed = confirmedPositions[currentPos.posIndex] === asset.id;

                      return (
                        <div className="p-4 rounded-xl border border-primary-200 bg-brand-light/30 space-y-3">
                          <div className="flex items-start gap-4">
                            <img
                              src={asset.url}
                              alt={asset.aiOneLineUnderstanding}
                              referrerPolicy="no-referrer"
                              className="w-28 h-28 rounded-xl object-cover border border-border-default shrink-0 cursor-pointer"
                              onClick={() => onViewAssetDetail(asset)}
                            />
                            <div className="space-y-2 flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-text-main leading-relaxed">
                                {asset.aiOneLineUnderstanding}
                              </p>
                              {/* 推荐依据：用业务解释性语言 (Section 9.5) */}
                              <div className="p-2.5 bg-surface-1 rounded-xl border border-border-default/80 text-[12px] text-text-secondary space-y-1">
                                <div className="font-black text-primary-700">推荐依据：</div>
                                <p>{currentPos.reason}</p>
                                {currentPos.drawbackNote && (
                                  <p className="text-amber-700 font-medium pt-1 border-t border-border-default">
                                    对齐说明：{currentPos.drawbackNote}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => onViewAssetDetail(asset)}
                              className="px-3.5 py-1.5 rounded-xl bg-surface-1 hover:bg-hover-bg border text-text-secondary font-bold text-[12px] flex items-center gap-1"
                            >
                              <Eye size={14} /> 查看大图与历史
                            </button>
                            <button
                              onClick={() => handleConfirmAsset(currentPos.posIndex, asset)}
                              className={`px-4 py-1.5 rounded-xl font-extrabold text-[12px] flex items-center gap-1.5 shadow-2xs transition-all ${
                                isConfirmed
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-btn-main hover:bg-btn-main-hover text-white active:scale-95'
                              }`}
                            >
                              <Check size={14} />
                              <span>{isConfirmed ? '已确认绑定' : '确认选用该素材'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 层级 2: 其他可选 (Other Options - Section 9.4.2) */}
                {currentPos.matchedLevel === 'other' && currentPos.matchedAssetId && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-neutral-200 text-text-secondary font-extrabold text-[12px]">
                        其他可选
                      </span>
                      <span className="text-[12.5px] font-bold text-text-secondary">
                        能够满足部分需求，但存在明显取舍的素材
                      </span>
                    </div>

                    {(() => {
                      const asset = getMatchedAsset(currentPos.matchedAssetId);
                      if (!asset) return null;
                      const isConfirmed = confirmedPositions[currentPos.posIndex] === asset.id;

                      return (
                        <div className="p-4 rounded-xl border border-border-default bg-surface-1 space-y-3">
                          <div className="flex items-start gap-4">
                            <img
                              src={asset.url}
                              alt={asset.aiOneLineUnderstanding}
                              referrerPolicy="no-referrer"
                              className="w-28 h-28 rounded-xl object-cover border border-border-default shrink-0"
                            />
                            <div className="space-y-2 flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-text-main leading-relaxed">
                                {asset.aiOneLineUnderstanding}
                              </p>
                              <div className="p-2.5 bg-page-bg rounded-xl border border-border-default/80 text-[12px] text-text-secondary space-y-1">
                                <div className="font-black text-text-main">取舍建议说明：</div>
                                <p>{currentPos.reason}</p>
                                {currentPos.drawbackNote && (
                                  <p className="text-amber-700 font-medium pt-1 border-t border-border-default">
                                    排位建议：{currentPos.drawbackNote}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => onViewAssetDetail(asset)}
                              className="px-3.5 py-1.5 rounded-xl bg-hover-bg hover:bg-selected-bg text-text-secondary font-bold text-[12px] flex items-center gap-1"
                            >
                              <Eye size={14} /> 查看大图
                            </button>
                            <button
                              onClick={() => handleConfirmAsset(currentPos.posIndex, asset)}
                              className={`px-4 py-1.5 rounded-xl font-extrabold text-[12px] flex items-center gap-1.5 transition-all ${
                                isConfirmed
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-btn-main hover:bg-btn-main-hover text-white active:scale-95'
                              }`}
                            >
                              <Check size={14} />
                              <span>{isConfirmed ? '已确认绑定' : '选定此项（做取舍）'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 层级 3: 暂无合适素材 (No Suitable Assets - Section 9.4.3) */}
                {currentPos.matchedLevel === 'none' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-danger font-extrabold text-[12px]">
                        暂无合适素材
                      </span>
                      <span className="text-[12.5px] font-bold text-text-tertiary">
                        不强行推荐低质量结果
                      </span>
                    </div>

                    <div className="p-6 rounded-xl border border-danger-light bg-rose-50/50 space-y-4 text-center">
                      <div className="space-y-1">
                        <p className="text-[14px] font-black text-text-main">
                          {currentPos.reason}
                        </p>
                        <p className="text-[12.5px] font-medium text-danger">
                          {currentPos.drawbackNote}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2.5 pt-2">
                        <button
                          onClick={onOpenCreateReshootTask}
                          className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12.5px] font-extrabold flex items-center gap-1.5 shadow-2xs active:scale-95"
                        >
                          <Plus size={15} /> 创建补拍任务
                        </button>
                        <button
                          onClick={() => alert('已临时放宽该插图位置的严格限定要求')}
                          className="px-4 py-2 bg-surface-1 border border-neutral-300 hover:bg-page-bg text-text-main rounded-xl text-[12.5px] font-bold"
                        >
                          调整图片要求
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-page-bg flex items-center justify-between">
          <span className="text-[12px] font-bold text-text-tertiary">
            已确认绑定槽位：<strong className="text-text-main">{Object.keys(confirmedPositions).length}</strong> / {noteDraft.imagePositions.length}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-btn-main hover:bg-btn-main-hover text-white font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
          >
            完成配图审核
          </button>
        </div>
      </div>
    </div>
  );
};
