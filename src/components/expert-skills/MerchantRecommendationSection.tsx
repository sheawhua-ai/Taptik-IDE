import React, { useState } from 'react';
import { MerchantRecommendation } from './types';
import {
  Sparkles, CheckCircle2, AlertCircle, Clock, ShieldAlert,
  ArrowRight, FileText, ChevronRight, X, Eye, Play, Plus, Info, Check, HelpCircle
} from 'lucide-react';

interface MerchantRecommendationSectionProps {
  recommendations: MerchantRecommendation[];
  onOpenDetail: (rec: MerchantRecommendation) => void;
  onRunOnce: (rec: MerchantRecommendation) => void;
  onAddToMerchant: (rec: MerchantRecommendation) => void;
  onDismiss: (id: string, reason: string) => void;
}

export const MerchantRecommendationSection: React.FC<MerchantRecommendationSectionProps> = ({
  recommendations,
  onOpenDetail,
  onRunOnce,
  onAddToMerchant,
  onDismiss
}) => {
  const [inspectingRec, setInspectingRec] = useState<MerchantRecommendation | null>(null);

  if (recommendations.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-[13px] text-emerald-900 shadow-2xs mb-4">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="font-extrabold">当前商家“皇家宠物食品”能力储备充分，暂无新的业务缺口发现推荐。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-5">
      {/* Multiple Single-Sentence Tip Rows */}
      <div className="space-y-2 animate-in fade-in duration-150">
        {recommendations.map(rec => {
            const prepStatusStyles = {
              '可直接运行': 'bg-emerald-50 text-emerald-800 border-emerald-300',
              '需要补充资料': 'bg-amber-50 text-amber-800 border-amber-300',
              '需要完成配置': 'bg-blue-50 text-blue-800 border-blue-300',
              '当前不适用': 'bg-neutral-100 text-neutral-600 border-neutral-200'
            }[rec.prepStatus];

            return (
              <div
                key={rec.id}
                className="bg-white/95 border border-amber-200/80 hover:border-amber-400 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs transition-all"
              >
                {/* Single-Sentence Prompt Line */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-black ${
                    rec.type === 'expert' ? 'bg-purple-100 text-purple-900' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {rec.type === 'expert' ? '推荐专家' : '推荐技能'} · {rec.targetName}
                  </span>

                  {/* One sentence tip */}
                  <p className="text-[12.5px] font-bold text-neutral-800 truncate">
                    <span className="text-amber-800 font-extrabold mr-1">提示：</span>
                    {rec.triggerFact}
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold border ${prepStatusStyles}`}>
                    {rec.prepStatus}
                  </span>

                  <button
                    onClick={() => setInspectingRec(rec)}
                    className="px-3 py-1 bg-amber-100/90 hover:bg-amber-200 text-amber-900 font-extrabold text-[12px] rounded-lg transition-all flex items-center gap-1"
                  >
                    <Info size={13} /> 详情
                  </button>

                  <button
                    onClick={() => onAddToMerchant(rec)}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[12px] rounded-lg shadow-2xs transition-all flex items-center gap-1"
                  >
                    <Plus size={13} /> 加入商家
                  </button>

                  <button
                    onClick={() => onDismiss(rec.id, '暂时不需要')}
                    className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all"
                    title="暂不需要"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      {/* Recommendation Detailed Inspection Modal (Requirement 2: 查看项目具体能力和详情) */}
      {inspectingRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setInspectingRec(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150 border border-neutral-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                    inspectingRec.type === 'expert' ? 'bg-purple-100 text-purple-900' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {inspectingRec.type === 'expert' ? '推荐专家' : '推荐技能'}
                  </span>
                  <h3 className="text-[18px] font-black text-neutral-900">
                    {inspectingRec.targetName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {inspectingRec.prepStatus}
                  </span>
                </div>
                <p className="text-[12px] font-bold text-neutral-500">
                  基于皇家宠物食品近期资料库、项目进展与待办问题智能诊断
                </p>
              </div>

              <button onClick={() => setInspectingRec(null)} className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {/* 1. 发现背景与触发事实 */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                <span className="text-[12px] font-black text-amber-900 block flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" /> 1. 推荐触发背景与事实：
                </span>
                <p className="text-[13px] font-extrabold text-neutral-800">
                  {inspectingRec.triggerFact}
                </p>
                {inspectingRec.confirmedFacts.length > 0 && (
                  <ul className="text-[12px] font-medium text-neutral-600 space-y-0.5 pt-1">
                    {inspectingRec.confirmedFacts.map((fact, idx) => (
                      <li key={idx}>• {fact}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 2. 解决的商业与运营问题 */}
              <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-1">
                <span className="text-[12px] font-black text-neutral-900 block">
                  2. 可以解决的实际运营问题：
                </span>
                <p className="text-[13px] font-bold text-neutral-700 leading-relaxed">
                  {inspectingRec.problemSolved}
                </p>
              </div>

              {/* 3. 所需输入资料与配置 */}
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-1">
                <span className="text-[12px] font-black text-blue-900 block">
                  3. 项目与能力调用所需输入资料：
                </span>
                <ul className="text-[12.5px] font-bold text-neutral-700 space-y-1">
                  {inspectingRec.requiredDocsAndConfigs.map((doc, idx) => (
                    <li key={idx}>• {doc}</li>
                  ))}
                </ul>
              </div>

              {/* 4. 人工确认节点 */}
              <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl space-y-1">
                <span className="text-[12px] font-black text-purple-900 block">
                  4. 全程保留的人工确认节点：
                </span>
                <ul className="text-[12.5px] font-bold text-neutral-700 space-y-1">
                  {inspectingRec.manualConfirmPoints.map((pt, idx) => (
                    <li key={idx}>• {pt}</li>
                  ))}
                </ul>
              </div>

              {/* 5. 诊断推断与缺口 */}
              {(inspectingRec.systemInferences || inspectingRec.missingInfo) && (
                <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2 text-[12px]">
                  <span className="text-neutral-900 font-black block">5. 深度诊断推断与缺口标定：</span>
                  {inspectingRec.systemInferences && (
                    <div>
                      <span className="text-sky-800 font-extrabold mr-1">[系统推断]</span>
                      <span className="text-neutral-700 font-medium">{inspectingRec.systemInferences.join('； ')}</span>
                    </div>
                  )}
                  {inspectingRec.missingInfo && inspectingRec.missingInfo.length > 0 && (
                    <div>
                      <span className="text-amber-800 font-extrabold mr-1">[尚缺资料]</span>
                      <span className="text-amber-900 font-medium">{inspectingRec.missingInfo.join('； ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  onOpenDetail(inspectingRec);
                  setInspectingRec(null);
                }}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[12.5px] font-extrabold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Eye size={15} /> 查看能力抽屉
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onRunOnce(inspectingRec);
                    setInspectingRec(null);
                  }}
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[12.5px] font-extrabold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Play size={15} /> 工作台试运行
                </button>

                <button
                  onClick={() => {
                    onAddToMerchant(inspectingRec);
                    setInspectingRec(null);
                  }}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[12.5px] font-black rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                >
                  <Plus size={15} /> 加入皇家宠物食品
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

