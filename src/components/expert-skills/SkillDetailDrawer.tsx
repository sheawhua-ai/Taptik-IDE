import React from 'react';
import { SkillItem, AppScope } from './types';
import {
  X, Wrench, CheckCircle2, AlertTriangle, Play, Settings,
  Terminal, ArrowRight, Layers, FileText, Ban, Wifi, Copy, Download, Power
} from 'lucide-react';

interface SkillDetailDrawerProps {
  skill: SkillItem | null;
  onClose: () => void;
  onTestSkill: (skill: SkillItem) => void;
  onInstallSkill: (skill: SkillItem) => void;
  onAddToExpert: (skill: SkillItem) => void;
  onCopyAndEdit: (skill: SkillItem) => void;
  onExportSkill: (skill: SkillItem) => void;
  onToggleStatus: (skill: SkillItem) => void;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({
  skill,
  onClose,
  onTestSkill,
  onInstallSkill,
  onAddToExpert,
  onCopyAndEdit,
  onExportSkill,
  onToggleStatus
}) => {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-900 rounded-2xl">
              <Wrench size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-extrabold text-neutral-900">{skill.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                  {skill.version}
                </span>
              </div>
              <span className="text-[12px] font-bold text-neutral-400">
                来源：{skill.source}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content (Requirement 12) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[13px]">
          {/* Goal & One-sentence desc */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
            <span className="text-blue-900 font-extrabold block text-[12px]">技能目标：</span>
            <p className="text-blue-950 font-bold leading-relaxed">{skill.goal || skill.oneSentenceDesc}</p>
          </div>

          {/* Applicable VS Inapplicable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <span className="text-emerald-900 font-extrabold block text-[12px]">适用场景：</span>
              <ul className="space-y-1 text-emerald-950 font-medium text-[12px]">
                {skill.applicableScenes?.map((sc, i) => (
                  <li key={i}>• {sc}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
              <span className="text-rose-900 font-extrabold block text-[12px]">不适用场景：</span>
              <ul className="space-y-1 text-rose-950 font-medium text-[12px]">
                {skill.inapplicableScenes?.map((insc, i) => (
                  <li key={i}>• {insc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inputs & Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
            <div>
              <h3 className="font-extrabold text-neutral-900 text-[13px] mb-2">输入格式要求</h3>
              <ul className="space-y-1 text-neutral-600 text-[12px]">
                {skill.inputFormat?.map((inp, idx) => (
                  <li key={idx}>• {inp}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-[13px] mb-2">输出结果要求</h3>
              <ul className="space-y-1 text-neutral-600 text-[12px]">
                {skill.outputFormat?.map((out, idx) => (
                  <li key={idx}>• {out}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preconditions & Execution Steps */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <h3 className="font-extrabold text-neutral-900 text-[14px]">执行步骤摘要</h3>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1.5 text-neutral-800 font-medium text-[12px]">
              {skill.executionSteps?.map((st, i) => (
                <div key={i}>{st}</div>
              ))}
            </div>
          </div>

          {/* Risks & Limits + Failure Handling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-amber-900 font-extrabold block text-[12px]">限制与风险：</span>
              <p className="text-amber-950 font-medium text-[12px]">{skill.risksAndLimits?.join('； ')}</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-800 font-extrabold block text-[12px]">失败处理规则：</span>
              <p className="text-neutral-700 font-medium text-[12px]">{skill.failureHandling}</p>
            </div>
          </div>

          {/* Permissions & Security */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
            <h3 className="font-extrabold text-neutral-900 text-[13px] flex items-center gap-1.5">
              <Wifi size={15} /> 权限与网络边界
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[12px] font-medium text-neutral-700">
              <div>读取范围：{skill.requiredPermissions?.readScope?.join('， ')}</div>
              <div>写入范围：{skill.requiredPermissions?.writeScope?.join('， ')}</div>
              <div>需要访问外网：{skill.requiredPermissions?.needsNetwork ? '是' : '否'}</div>
              <div>修改业务数据：{skill.requiredPermissions?.willModifyData ? '是' : '否'}</div>
            </div>
          </div>

          {/* Test Status & Usage Locations */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-neutral-900 text-[13px]">最近测试结果</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded text-[11px]">
                {skill.lastTestStatus === 'passed' ? '测试通过' : '待测试'}
              </span>
            </div>
            <p className="text-neutral-600 font-medium text-[12px]">{skill.lastVerifiedResult}</p>
          </div>
        </div>

        {/* Bottom Drawer Actions (Requirement 12) */}
        <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onTestSkill(skill);
            }}
            className="px-4 py-2.5 bg-neutral-900 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <Terminal size={14} /> 本地试用
          </button>

          <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-neutral-600">
            <button onClick={() => onInstallSkill(skill)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              安装技能
            </button>
            <button onClick={() => onAddToExpert(skill)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              加入专家
            </button>
            <button onClick={() => onCopyAndEdit(skill)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              复制修改
            </button>
            <button onClick={() => onExportSkill(skill)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              导出
            </button>
            <button onClick={() => onToggleStatus(skill)} className="hover:text-rose-600 px-2 py-1 bg-neutral-100 rounded-lg">
              停用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
