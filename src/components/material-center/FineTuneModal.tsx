import React, { useState } from 'react';
import { MaterialAsset } from './types';
import { X, Sparkles, CheckCircle2, Layers, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface FineTuneModalProps {
  parentAsset: MaterialAsset;
  onClose: () => void;
  onConfirmDerive: (parentAsset: MaterialAsset, modType: string) => Promise<void>;
}

export const FineTuneModal: React.FC<FineTuneModalProps> = ({
  parentAsset,
  onClose,
  onConfirmDerive
}) => {
  const modOptions = [
    '更换背景（去除原生活场景杂乱元素，替换为明亮干净背景）',
    '改变构图（从横屏改切为3:4小红书最佳竖屏比例）',
    '调整主体位置（放大宠物神态，预留顶部文案留白空间）',
    '去除原文字 / 角标（深度精修去除此前营销文字）',
    '更换视觉文案（叠加全新避坑指南或选粮测评标签）',
    '制作不同场景版本（阳光露台/简约日系家庭氛围变换）',
    '重新拍摄相似镜头（派发标准分镜清单给线下门店参考）'
  ];

  const [selectedMod, setSelectedMod] = useState<string>(modOptions[0]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [customNote, setCustomNote] = useState<string>('');

  const handleStartDerive = async () => {
    setIsProcessing(true);
    try {
      await onConfirmDerive(parentAsset, selectedMod);
      onClose();
    } catch (e) {
      alert('微调生成发生异常，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-btn-main/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-1 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-border-default animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border-default flex items-center justify-between bg-btn-main text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-[17px] font-black">激活微调与复用（生成衍生版）</h3>
              <span className="text-[13px] font-bold text-neutral-300">
                已使用爆款素材无法直接重发，通过微调生成全生命周期新素材
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-surface-1/10 hover:bg-surface-1/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 原素材与真实发布反馈卡片 (Section 11.1) */}
          <div className="p-4 rounded-xl bg-page-bg border border-border-default/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-text-tertiary">原“已使用”素材基础档案</span>
              <span className="px-2 py-0.5 rounded bg-neutral-200 text-text-secondary text-[13px] font-bold">
                原发布不能重复占用
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={parentAsset.url}
                alt={parentAsset.oneSentenceUnderstanding}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-xl object-cover border border-border-default shrink-0"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[13px] font-bold text-text-main line-clamp-2">
                  {parentAsset.oneSentenceUnderstanding}
                </p>
                <div className="text-[13px] text-text-tertiary font-medium">
                  来源项目：{parentAsset.sourceProject}
                </div>
                {/* 数据依据展示 */}
                {parentAsset.usageRecords.length > 0 && parentAsset.usageRecords[0].performanceData ? (
                  <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[13px] font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>系统依据：使用该素材的笔记【{parentAsset.usageRecords[0].noteTitle}】互动与收藏率显著优于类目均值，建议制作新视觉版本。</span>
                  </div>
                ) : (
                  <div className="p-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-[13px] font-bold flex items-center gap-1.5">
                    <Sparkles size={13} className="text-blue-600 shrink-0" />
                    <span>系统依据：基于核心场景转化率，操盘手主动选择微调复用当前视觉主体。</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 选择修改方向 (Section 11.2) */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-black text-text-main">
              请选择微调修改方向（自动保持父级和血缘关联）
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {modOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedMod(opt)}
                  className={`p-3 rounded-xl border text-left text-[13px] font-bold transition-all flex items-start gap-2 ${
                    selectedMod === opt
                      ? 'bg-btn-main text-white border-neutral-900 shadow-2xs'
                      : 'bg-surface-1 hover:bg-page-bg text-text-main border-border-default'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    selectedMod === opt ? 'border-white bg-surface-1/20' : 'border-neutral-300'
                  }`}>
                    {selectedMod === opt && <div className="w-2 h-2 rounded-full bg-surface-1" />}
                  </div>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 规则声明 (Section 11.3) */}
          <div className="p-3.5 bg-hover-bg/80 rounded-xl text-text-secondary text-[13px] space-y-1">
            <div className="font-extrabold text-text-main">微调后衍生资产规则</div>
            <p>
              1. 原素材保持“已使用”状态；微调生成的衍生版会进入完整AI上传分析流水线，生成全自动【一句话理解】及视觉/文本语义向量。
            </p>
            <p>
              2. 通过处理后，新衍生资产进入当前商家的“可用”素材池，并永久保留其来源项目和父级血缘关联。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border-default bg-page-bg flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-neutral-200/80 hover:bg-selected-bg text-text-secondary font-extrabold text-[13px] transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleStartDerive}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-btn-main hover:bg-btn-main-hover text-white font-black text-[13px] flex items-center gap-2 shadow-2xs active:scale-95 transition-all"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>AI 正在处理并重新生成画面理解...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-amber-400" />
                <span>制作衍生版并存入“可用”素材池</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
