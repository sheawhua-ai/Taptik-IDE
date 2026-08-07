import React, { useState } from 'react';
import { SkillItem } from './types';
import {
  X, Check, AlertTriangle, Sparkles, Code, Eye, EyeOff, Plus, FileText, ArrowUpRight
} from 'lucide-react';

interface SkillDetailDrawerProps {
  skill: SkillItem | null;
  onClose: () => void;
  onTestSkill?: (skill: SkillItem) => void;
  onInstallSkill?: (skill: SkillItem) => void;
  onUseInProject?: (skill: SkillItem) => void;
  onConfigAutoRun?: (skill: SkillItem) => void;
  onCopyAndEdit?: (skill: SkillItem) => void;
  onExportSkill?: (skill: SkillItem) => void;
  onToggleStatus?: (skill: SkillItem) => void;
  isAdded?: boolean;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({
  skill,
  onClose,
  onInstallSkill,
  isAdded = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  if (!skill) return null;

  const isBuiltIn = skill.source === 'official' && (skill.id === 'sk_cover_audit' || skill.id === 'sk_publish_check');
  const needsConfig = skill.status === 'needs_config' || !!skill.unavailableReason;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-2xs transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-black text-neutral-900">{skill.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                skill.source === 'official'
                  ? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {skill.source === 'official' ? '官方技能' : '自定义技能'}
              </span>
              {isBuiltIn && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                  系统内置
                </span>
              )}
            </div>
            <p className="text-[12.5px] font-bold text-neutral-500 mt-1">
              为当前商家添加AI可自动调用的运营能力
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: Simple business view */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[13px]">
          {/* 1. 这个技能能做什么 */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
            <span className="text-neutral-900 font-extrabold block text-[13px]">
              这个技能能做什么
            </span>
            <p className="text-neutral-700 font-bold leading-relaxed">
              {skill.goal || skill.oneSentenceDesc}
            </p>
          </div>

          {/* 2. AI什么时候会使用 */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/90 space-y-2">
            <span className="text-emerald-900 font-extrabold block text-[13px]">
              AI什么时候会使用
            </span>
            <ul className="space-y-1.5 text-emerald-950 font-bold text-[12.5px]">
              {skill.applicableScenes?.length ? (
                skill.applicableScenes.map((scene, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 shrink-0">•</span>
                    <span>{scene}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 shrink-0">•</span>
                  <span>在相关的项目运营与发布环节中根据需要自动调度</span>
                </li>
              )}
            </ul>
          </div>

          {/* 3. 会读取哪些资料 & 4. 会产生什么结果 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
              <span className="text-neutral-900 font-extrabold block text-[12.5px]">
                会读取哪些资料
              </span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[12px]">
                {skill.inputFormat?.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-neutral-400 shrink-0">•</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
              <span className="text-neutral-900 font-extrabold block text-[12.5px]">
                会产生什么结果
              </span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[12px]">
                {skill.outputFormat?.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-neutral-400 shrink-0">•</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Configuration Warning Notice if needs config */}
          {needsConfig && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2 text-amber-900 text-[12px] font-bold">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block text-[12.5px] text-amber-950">需配置数据接口</span>
                <span>{skill.unavailableReason || '需配置相关开放平台连接能力。'}</span>
              </div>
            </div>
          )}

          {/* Bottom Collapsible: 高级信息 */}
          <div className="border-t border-neutral-200/80 pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100 rounded-2xl text-neutral-700 font-extrabold text-[12.5px] transition-all"
            >
              <div className="flex items-center gap-2">
                <Code size={15} className="text-neutral-500" />
                <span>高级信息</span>
              </div>
              <div className="flex items-center gap-1 text-[11.5px] text-neutral-400 font-bold">
                <span>{showAdvanced ? '收起' : '展开'}</span>
                {showAdvanced ? <EyeOff size={14} /> : <Eye size={14} />}
              </div>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 bg-neutral-900 text-neutral-200 rounded-2xl text-[12px] space-y-2.5 font-mono shadow-inner">
                <div className="flex justify-between border-b border-neutral-800 pb-2 font-sans font-extrabold text-neutral-400 text-[11px]">
                  <span>高级底层字段 & 系统配置</span>
                  <span>仅开发维护可见</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px] pt-1">
                  <div><span className="text-amber-400 font-bold">内部名称:</span> {skill.backendMetadata?.idempotencyKey || skill.id}</div>
                  <div><span className="text-amber-400 font-bold">触发方式:</span> {skill.backendMetadata?.executionMode || 'Agent 自动流程调度'}</div>
                  <div><span className="text-amber-400 font-bold">工作流/脚本:</span> {skill.backendMetadata?.workflowGraph || '内建规则引擎'}</div>
                  <div><span className="text-amber-400 font-bold">版本信息:</span> {skill.version || 'v1.0'}</div>
                  <div><span className="text-amber-400 font-bold">安装来源:</span> {skill.source === 'official' ? '官方商店' : '本地自定义'}</div>
                  <div><span className="text-amber-400 font-bold">更新时间:</span> {skill.updatedAt || '最近更新'}</div>
                </div>
                <div className="pt-2 border-t border-neutral-800 text-[11px] font-sans">
                  <span className="text-amber-400 font-bold block mb-1">数据权限范围:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.requiredPermissions?.readScope?.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">只读: {r}</span>
                    ))}
                    {skill.requiredPermissions?.writeScope?.map((w, i) => (
                      <span key={i} className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">写入: {w}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-between gap-3">
          <div className="text-[12px] font-bold text-neutral-500">
            状态：
            <span className={`font-black ${
              isBuiltIn
                ? 'text-slate-700'
                : needsConfig
                ? 'text-amber-600'
                : isAdded
                ? 'text-emerald-600'
                : 'text-neutral-800'
            }`}>
              {isBuiltIn ? '系统内置' : needsConfig ? '需配置' : isAdded ? '已启用' : '未添加'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isBuiltIn ? (
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[12.5px] font-extrabold flex items-center gap-1">
                <Check size={14} /> 系统内置 (始终生效)
              </span>
            ) : needsConfig ? (
              <button
                onClick={() => {
                  alert(`请在系统设置中为【${skill.name}】配置所需数据通道。`);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[12.5px] font-extrabold transition-all shadow-2xs"
              >
                去配置
              </button>
            ) : isAdded ? (
              <button
                onClick={() => {
                  onInstallSkill?.(skill);
                }}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-[12.5px] font-extrabold flex items-center gap-1.5 transition-all"
              >
                <Check size={14} /> ✓ 已启用 (点击可卸载)
              </button>
            ) : (
              <button
                onClick={() => {
                  onInstallSkill?.(skill);
                  onClose();
                }}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12.5px] font-extrabold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
              >
                <Plus size={15} /> ＋ 添加到当前商家
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
