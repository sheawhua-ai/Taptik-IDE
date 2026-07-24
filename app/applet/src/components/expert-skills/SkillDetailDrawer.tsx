import React, { useState } from 'react';
import { SkillItem } from './types';
import {
  X, Play, Edit3, ToggleLeft, ToggleRight, PlusCircle, Building2,
  Copy, Download, Archive, CheckCircle2, AlertTriangle, FileText,
  Wrench, Bot, Folder, Clock, Activity, ShieldAlert
} from 'lucide-react';

interface SkillDetailDrawerProps {
  skill: SkillItem | null;
  onClose: () => void;
  onTestSkill: (skill: SkillItem) => void;
  onAddSkillToExpert: (skill: SkillItem) => void;
  onApplyToMerchant: (skill: SkillItem) => void;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({
  skill,
  onClose,
  onTestSkill,
  onAddSkillToExpert,
  onApplyToMerchant
}) => {
  const [isEnabled, setIsEnabled] = useState(skill?.status === 'active');
  const [showMoreActions, setShowMoreActions] = useState(false);

  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[620px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-200 flex items-start justify-between bg-neutral-50/50 shrink-0">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded text-[11px] font-extrabold uppercase">
                标准技能
              </span>
              <span className="text-[12px] text-neutral-500 font-bold">{skill.version}</span>
              <span className="text-[12px] text-neutral-400">· 更新于 {skill.updatedAt}</span>
            </div>
            <h2 className="text-[20px] font-extrabold text-neutral-900 tracking-tight">
              {skill.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* 1. 解决的具体任务 */}
          <section className="space-y-2">
            <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">
              1. 解决的具体任务 (单一职责)
            </h3>
            <p className="text-[14px] text-neutral-800 font-bold leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              {skill.singleTask}
            </p>
          </section>

          {/* 2. 何时适用 & 何时不适用 */}
          <section className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
              <h3 className="text-[12px] font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" /> 何时适用
              </h3>
              <p className="text-[12px] text-emerald-900 font-medium leading-relaxed">
                {skill.whenToUse}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
              <h3 className="text-[12px] font-bold text-neutral-500 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-500" /> 何时不适用
              </h3>
              <p className="text-[12px] text-neutral-600 font-medium leading-relaxed">
                {skill.whenNotToUse}
              </p>
            </div>
          </section>

          {/* 3. 所需输入 & 4. 输出结果 */}
          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <h3 className="text-[12px] font-bold text-neutral-500">所需输入 (Inputs)</h3>
              <ul className="space-y-1.5 text-[12px] text-neutral-700 font-bold">
                {skill.inputs.map((inp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-neutral-400">•</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <h3 className="text-[12px] font-bold text-neutral-500">输出结果 (Outputs)</h3>
              <ul className="space-y-1.5 text-[12px] text-neutral-900 font-bold">
                {skill.outputs.map((out, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary-500">•</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 5. 执行步骤 */}
          <section className="space-y-3">
            <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">
              5. 技能执行步骤
            </h3>
            <div className="space-y-2">
              {skill.executionSteps.map((step, i) => (
                <div
                  key={i}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                    {i + 1}
                  </span>
                  <span className="mt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. 异常处理 & 7. 人工确认点 */}
          <section className="space-y-3">
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <h3 className="text-[12px] font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-600" /> 异常处理与人工确认点
              </h3>
              <div className="text-[12px] text-amber-900 font-medium space-y-1">
                <div><span className="font-bold">异常机制:</span> {skill.exceptionHandling}</div>
                {skill.manualConfirmPoints.map((pt, i) => (
                  <div key={i}><span className="font-bold">确认要求:</span> {pt}</div>
                ))}
              </div>
            </div>
          </section>

          {/* 8. 被哪些专家使用 & 9. 被哪些项目启用 */}
          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Bot size={13} /> 被哪些专家使用
              </h3>
              <div className="space-y-1.5">
                {skill.usedByExperts.map((e, i) => (
                  <div key={i} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-[12px] font-bold text-neutral-800">
                    {e.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Folder size={13} /> 被哪些项目启用
              </h3>
              <div className="space-y-1.5">
                {skill.usedByProjects.map((p, i) => (
                  <div key={i} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-[12px] font-medium text-neutral-700">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 10. 最近运行结果 */}
          <section className="space-y-2">
            <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Activity size={13} /> 最近运行结果
            </h3>
            <div className="space-y-1.5">
              {skill.runResults.map((res, i) => (
                <div key={i} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[12px] text-neutral-800 font-medium">
                  {res}
                </div>
              ))}
            </div>
          </section>

          {/* 11. 版本与修改记录 */}
          <section className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 text-[12px]">
            <div className="flex justify-between text-neutral-500 font-bold">
              <span>当前版本: {skill.version}</span>
              <span>更新日期: {skill.updatedAt}</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              修改日志: 已微调关键识别阈值，更新为适应2026年小红书社区规范规范版本。
            </p>
          </section>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="p-4 px-6 border-t border-neutral-200 bg-white space-y-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTestSkill(skill)}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold py-3 px-4 rounded-xl text-[13px] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Play size={16} className="fill-current" /> 测试技能
            </button>

            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`px-4 py-3 rounded-xl text-[13px] font-bold border flex items-center gap-1.5 transition-colors ${
                isEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
              }`}
            >
              {isEnabled ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} />}
              {isEnabled ? '已启用' : '已停用'}
            </button>

            <button
              onClick={() => onAddSkillToExpert(skill)}
              className="px-3.5 py-3 bg-white border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle size={14} /> 添加到专家
            </button>
          </div>

          <div className="flex items-center justify-between text-[12px] font-bold text-neutral-600 pt-1">
            <button
              onClick={() => onApplyToMerchant(skill)}
              className="hover:text-neutral-900 flex items-center gap-1"
            >
              <Building2 size={13} /> 应用到当前商家
            </button>
            <button className="hover:text-neutral-900 flex items-center gap-1">
              <Copy size={13} /> 复制
            </button>
            <button className="hover:text-neutral-900 flex items-center gap-1">
              <Download size={13} /> 导出
            </button>
            <button className="hover:text-red-600 flex items-center gap-1">
              <Archive size={13} /> 归档
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
