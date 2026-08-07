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
    <div className="fixed inset-0 z-60 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-500/20 text-primary-400 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-black">笔记驱动素材匹配（草稿扫描能力）</h3>
                <span className="px-2 py-0.5 rounded bg-white/15 text-white text-[11px] font-extrabold">
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
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Note Draft Banner */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-neutral-900 text-white text-[11px] font-extrabold">
                当前笔记草稿
              </span>
              <span className="font-extrabold text-[14px] text-neutral-900">{noteDraft.noteTitle}</span>
            </div>
            <p className="text-[12px] text-neutral-600 line-clamp-1">
              项目：{noteDraft.projectName} · {noteDraft.draftSummary}
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12.5px] font-extrabold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all shrink-0"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            <span>重新扫描素材中心</span>
          </button>
        </div>

        {/* Content Body: Left sidebar for Image Positions, Right panel for 3 Tiers (Section 9.4) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* 左侧：图片需求位导航 */}
          <div className="md:col-span-4 border-r border-neutral-200 bg-neutral-50/50 p-4 space-y-2 overflow-y-auto">
            <div className="text-[12px] font-black text-neutral-500 uppercase px-1">
              各配图需求槽位 ({noteDraft.imagePositions.length})
            </div>
            {noteDraft.imagePositions.map((pos) => {
              const isSelected = pos.posIndex === selectedPosIndex;
              const isConfirmed = !!confirmedPositions[pos.posIndex];
              return (
                <div
                  key={pos.posIndex}
                  onClick={() => setSelectedPosIndex(pos.posIndex)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-white border-neutral-900 ring-2 ring-neutral-900 shadow-sm'
                      : 'bg-white/80 hover:bg-white border-neutral-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[13.5px] text-neutral-900">{pos.label}</span>
                    {isConfirmed ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold flex items-center gap-1">
                        <Check size={11} /> 已选
                      </span>
                    ) : pos.matchedLevel === 'recommend' ? (
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-200 text-[10.5px] font-bold">
                        首选推荐
                      </span>
                    ) : pos.matchedLevel === 'other' ? (
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10.5px] font-bold">
                        其他可选
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10.5px] font-bold">
                        无合适素材
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] font-medium text-neutral-600 line-clamp-2">
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
                <RefreshCw size={28} className="text-primary-600 animate-spin" />
                <div className="font-black text-neutral-900 text-[15px]">
                  AI 正在按笔记画面需求扫描商家素材中心...
                </div>
                <div className="text-[12px] text-neutral-500 max-w-sm">
                  正在通过多模态理解与画面构图匹配可用的跨项目素材，无需任何人工打标签
                </div>
              </div>
            ) : (
              <>
                {/* 顶部选位需求总结 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-black text-neutral-900">
                      {currentPos.label}
                    </h4>
                    <span className="text-[12px] font-bold text-neutral-400">
                      AI 配图策略分析
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-neutral-600">
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
                      <span className="text-[12.5px] font-bold text-neutral-600">
                        最适合当前图片位置的可用素材
                      </span>
                    </div>

                    {(() => {
                      const asset = getMatchedAsset(currentPos.matchedAssetId);
                      if (!asset) return null;
                      const isConfirmed = confirmedPositions[currentPos.posIndex] === asset.id;

                      return (
                        <div className="p-4 rounded-2xl border border-primary-200 bg-primary-50/30 space-y-3">
                          <div className="flex items-start gap-4">
                            <img
                              src={asset.url}
                              alt={asset.aiOneLineUnderstanding}
                              referrerPolicy="no-referrer"
                              className="w-28 h-28 rounded-xl object-cover border border-neutral-200 shrink-0 cursor-pointer"
                              onClick={() => onViewAssetDetail(asset)}
                            />
                            <div className="space-y-2 flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-neutral-900 leading-relaxed">
                                {asset.aiOneLineUnderstanding}
                              </p>
                              {/* 推荐依据：用业务解释性语言 (Section 9.5) */}
                              <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 text-[12px] text-neutral-700 space-y-1">
                                <div className="font-black text-primary-700">推荐依据：</div>
                                <p>{currentPos.reason}</p>
                                {currentPos.drawbackNote && (
                                  <p className="text-amber-700 font-medium pt-1 border-t border-neutral-100">
                                    对齐说明：{currentPos.drawbackNote}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => onViewAssetDetail(asset)}
                              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border text-neutral-700 font-bold text-[12px] flex items-center gap-1"
                            >
                              <Eye size={14} /> 查看大图与历史
                            </button>
                            <button
                              onClick={() => handleConfirmAsset(currentPos.posIndex, asset)}
                              className={`px-4 py-1.5 rounded-xl font-extrabold text-[12px] flex items-center gap-1.5 shadow-2xs transition-all ${
                                isConfirmed
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
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
                      <span className="px-2.5 py-0.5 rounded-lg bg-neutral-200 text-neutral-700 font-extrabold text-[12px]">
                        其他可选
                      </span>
                      <span className="text-[12.5px] font-bold text-neutral-600">
                        能够满足部分需求，但存在明显取舍的素材
                      </span>
                    </div>

                    {(() => {
                      const asset = getMatchedAsset(currentPos.matchedAssetId);
                      if (!asset) return null;
                      const isConfirmed = confirmedPositions[currentPos.posIndex] === asset.id;

                      return (
                        <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-3">
                          <div className="flex items-start gap-4">
                            <img
                              src={asset.url}
                              alt={asset.aiOneLineUnderstanding}
                              referrerPolicy="no-referrer"
                              className="w-28 h-28 rounded-xl object-cover border border-neutral-200 shrink-0"
                            />
                            <div className="space-y-2 flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-neutral-900 leading-relaxed">
                                {asset.aiOneLineUnderstanding}
                              </p>
                              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[12px] text-neutral-700 space-y-1">
                                <div className="font-black text-neutral-800">取舍建议说明：</div>
                                <p>{currentPos.reason}</p>
                                {currentPos.drawbackNote && (
                                  <p className="text-amber-700 font-medium pt-1 border-t border-neutral-100">
                                    排位建议：{currentPos.drawbackNote}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => onViewAssetDetail(asset)}
                              className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-[12px] flex items-center gap-1"
                            >
                              <Eye size={14} /> 查看大图
                            </button>
                            <button
                              onClick={() => handleConfirmAsset(currentPos.posIndex, asset)}
                              className={`px-4 py-1.5 rounded-xl font-extrabold text-[12px] flex items-center gap-1.5 transition-all ${
                                isConfirmed
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
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
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-[12px]">
                        暂无合适素材
                      </span>
                      <span className="text-[12.5px] font-bold text-neutral-500">
                        不强行推荐低质量结果
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-4 text-center">
                      <div className="space-y-1">
                        <p className="text-[14px] font-black text-neutral-900">
                          {currentPos.reason}
                        </p>
                        <p className="text-[12.5px] font-medium text-rose-800">
                          {currentPos.drawbackNote}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2.5 pt-2">
                        <button
                          onClick={onOpenCreateReshootTask}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12.5px] font-extrabold flex items-center gap-1.5 shadow-2xs active:scale-95"
                        >
                          <Plus size={15} /> 创建补拍任务
                        </button>
                        <button
                          onClick={() => alert('已临时放宽该插图位置的严格限定要求')}
                          className="px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl text-[12.5px] font-bold"
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
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <span className="text-[12px] font-bold text-neutral-500">
            已确认绑定槽位：<strong className="text-neutral-900">{Object.keys(confirmedPositions).length}</strong> / {noteDraft.imagePositions.length}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
          >
            完成配图审核
          </button>
        </div>
      </div>
    </div>
  );
};
