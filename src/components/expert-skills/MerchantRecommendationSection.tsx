import React, { useState } from 'react';
import { MerchantRecommendation, AppScope } from './types';
import {
  Sparkles, CheckCircle2, AlertCircle, Clock, ShieldAlert,
  ArrowRight, FileText, ChevronRight, X, HelpCircle, Eye, Play, Plus, ThumbsDown
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
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [selectedDismissReason, setSelectedDismissReason] = useState<string>('暂时不需要');

  const dismissOptions = [
    '暂时不需要',
    '已有相同能力',
    '推荐不准确',
    '缺少使用条件',
    '不再推荐此类能力'
  ];

  if (recommendations.length === 0) {
    return (
      <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-4 flex items-center justify-between text-[13px] text-emerald-900">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="font-bold">当前商家“皇家宠物食品”能力储备充分，暂无突发业务缺口预警。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100/80 text-amber-800 rounded-lg">
            <Sparkles size={16} />
          </div>
          <h2 className="text-[15px] font-extrabold text-neutral-900 tracking-tight">
            根据当前商家的项目、资料和待办，发现 {recommendations.length} 项能力可能有帮助
          </h2>
        </div>
        <span className="text-[12px] font-medium text-neutral-400">
          基于实时事实与依据诊断
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map(rec => {
          const prepStatusStyles = {
            '可直接运行': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            '需要补充资料': 'bg-amber-50 text-amber-700 border-amber-200',
            '需要完成配置': 'bg-blue-50 text-blue-700 border-blue-200',
            '当前不适用': 'bg-neutral-100 text-neutral-600 border-neutral-200'
          }[rec.prepStatus];

          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                        rec.type === 'expert' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.type === 'expert' ? '专家角色' : '执行技能'}
                      </span>
                      <h3 className="text-[16px] font-extrabold text-neutral-900">
                        {rec.targetName}
                      </h3>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${prepStatusStyles}`}>
                    {rec.prepStatus}
                  </span>
                </div>

                {/* Card Fields 2, 3, 4, 5 */}
                <div className="space-y-2.5 text-[12.5px] bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-100">
                  {/* 2. 为什么推荐 */}
                  <div>
                    <span className="text-neutral-400 font-extrabold mr-1">为什么推荐：</span>
                    <span className="text-neutral-800 font-medium">{rec.triggerFact}</span>
                  </div>

                  {/* 3. 可以解决什么 */}
                  <div>
                    <span className="text-neutral-400 font-extrabold mr-1">可以解决什么：</span>
                    <span className="text-neutral-800 font-medium">{rec.problemSolved}</span>
                  </div>

                  {/* 4. 使用前还需要什么 */}
                  <div>
                    <span className="text-neutral-400 font-extrabold mr-1">使用前还需要什么：</span>
                    <span className="text-neutral-800 font-medium">{rec.requiredDocsAndConfigs}</span>
                  </div>

                  {/* 5. 人工确认点 */}
                  <div>
                    <span className="text-neutral-400 font-extrabold mr-1">人工确认点：</span>
                    <span className="text-neutral-800 font-medium">{rec.manualConfirmPoints}</span>
                  </div>
                </div>

                {/* Fact vs Inference vs Missing Info Breakdown */}
                <div className="space-y-1.5 pt-1 text-[11.5px]">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-extrabold text-[10px]">已确认事实</span>
                    <span className="truncate">{rec.confirmedFacts.join('； ') || '无'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-extrabold text-[10px]">系统推断</span>
                    <span className="truncate">{rec.systemInferences.join('； ') || '无'}</span>
                  </div>
                  {rec.missingInfo.length > 0 && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-extrabold text-[10px]">尚缺信息</span>
                      <span className="truncate">{rec.missingInfo.join('； ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenDetail(rec)}
                  className="px-3 py-1.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg flex items-center gap-1 transition-all"
                >
                  <Eye size={13} /> 查看详情
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRunOnce(rec)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[12px] font-bold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Play size={13} /> 运行一次
                  </button>

                  <button
                    onClick={() => onAddToMerchant(rec)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-extrabold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus size={13} /> 加入当前商家
                  </button>

                  <button
                    onClick={() => setDismissingId(rec.id)}
                    className="px-2.5 py-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 text-[12px] font-medium rounded-lg transition-all"
                  >
                    暂不需要
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dismiss Feedback Modal (Requirement 4) */}
      {dismissingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setDismissingId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[15px] font-extrabold text-neutral-900">选择暂不需要的原因</h3>
              <button onClick={() => setDismissingId(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {dismissOptions.map(opt => (
                <label
                  key={opt}
                  className={`flex items-center justify-between p-3 rounded-xl border text-[13px] font-extrabold cursor-pointer transition-all ${
                    selectedDismissReason === opt
                      ? 'border-neutral-900 bg-neutral-50 text-neutral-900'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span>{opt}</span>
                  <input
                    type="radio"
                    name="dismissReason"
                    checked={selectedDismissReason === opt}
                    onChange={() => setSelectedDismissReason(opt)}
                    className="text-neutral-900 focus:ring-neutral-900"
                  />
                </label>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                onClick={() => setDismissingId(null)}
                className="px-4 py-2 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-xl"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onDismiss(dismissingId, selectedDismissReason);
                  setDismissingId(null);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-[12px] font-extrabold rounded-xl"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
