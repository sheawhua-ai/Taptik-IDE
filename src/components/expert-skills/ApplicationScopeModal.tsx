import React, { useState } from 'react';
import { AppScope, ExpertItem, SkillItem } from './types';
import {
  X, ShieldAlert, CheckCircle2, Lock, AlertTriangle, Eye, Edit3, Wifi, Info
} from 'lucide-react';

interface ApplicationScopeModalProps {
  item: ExpertItem | SkillItem | null;
  onClose: () => void;
  onConfirmScope: (newScope: AppScope) => void;
  isInProjectContext?: boolean; // Whether user is currently inside a project
}

export const ApplicationScopeModal: React.FC<ApplicationScopeModalProps> = ({
  item,
  onClose,
  onConfirmScope,
  isInProjectContext = true
}) => {
  if (!item) return null;

  const [selectedScope, setSelectedScope] = useState<AppScope>(item.appScope || 'task');
  const [showSecondaryWarning, setShowSecondaryWarning] = useState<boolean>(false);

  const scopeOptions: {
    id: AppScope;
    title: string;
    desc: string;
    risk: 'low' | 'medium' | 'high';
    disabled?: boolean;
  }[] = [
    {
      id: 'task',
      title: '仅本次任务 (推荐)',
      desc: '能力仅在本次分析或执行会话中有效，任务结束后自动清除内存授权。最安全。',
      risk: 'low'
    },
    {
      id: 'project',
      title: '当前项目',
      desc: '在该项目生存周期内可随时调用，仅可读取并写入当前项目内的资料与待办。',
      risk: 'low',
      disabled: !isInProjectContext
    },
    {
      id: 'merchant',
      title: '当前商家 (皇家宠物食品)',
      desc: '在当前商家绑定的所有项目与资料库中通享调用权限。',
      risk: 'medium'
    },
    {
      id: 'all',
      title: '全部商家 (跨商家共享)',
      desc: '授权该能力读取跨商家公共模板与资产。需要二次确认，谨防敏感数据交叉污染。',
      risk: 'high'
    }
  ];

  const handleSelectOption = (scope: AppScope) => {
    setSelectedScope(scope);
    if (scope === 'all') {
      setShowSecondaryWarning(true);
    } else {
      setShowSecondaryWarning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-purple-600" />
            <h3 className="text-[16px] font-extrabold text-neutral-900">调整能力授权范围</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Item Header */}
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-[12.5px]">
          <span className="font-extrabold text-neutral-900">{item.name}</span>
          <span className="text-neutral-500 font-bold">当前授权: {item.appScope}</span>
        </div>

        {/* Scope Options */}
        <div className="space-y-2.5">
          <label className="text-[12px] font-extrabold text-neutral-500 uppercase tracking-wider block">
            选择授权级别：
          </label>

          <div className="space-y-2">
            {scopeOptions.map(opt => (
              <label
                key={opt.id}
                onClick={() => !opt.disabled && handleSelectOption(opt.id)}
                className={`p-3.5 rounded-xl border text-[12.5px] block cursor-pointer transition-all ${
                  opt.disabled
                    ? 'opacity-50 bg-neutral-100 border-neutral-200 cursor-not-allowed'
                    : selectedScope === opt.id
                    ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-extrabold shadow-2xs'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="appScope"
                      disabled={opt.disabled}
                      checked={selectedScope === opt.id}
                      onChange={() => handleSelectOption(opt.id)}
                      className="text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="text-[13.5px] font-extrabold">{opt.title}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold ${
                    opt.risk === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : opt.risk === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {opt.risk === 'high' ? '高风险' : opt.risk === 'medium' ? '中度授权' : '低风险'}
                  </span>
                </div>
                <p className="text-[11.5px] text-neutral-500 font-normal mt-1.5 pl-5">
                  {opt.disabled ? '当前页面不在具体项目上下文中，该选项不可用。' : opt.desc}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Secondary Warning for Cross-Merchant "全部商家" */}
        {showSecondaryWarning && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-[12px] animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-rose-900 font-extrabold">
              <AlertTriangle size={15} /> 跨商家高权限警示
            </div>
            <p className="text-rose-800 font-medium leading-relaxed">
              您正在将该能力授权给【全部商家】。这意味着在切换其他商家环境时，该能力均可被调用，请确认该能力内不包含私密红线规则或特定单商家的保密算法。
            </p>
          </div>
        )}

        {/* Explicit Authorization Boundary Checklist */}
        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-[11.5px] space-y-1 text-neutral-600">
          <div className="font-extrabold text-neutral-800 mb-1">该授权级别的执行边界：</div>
          <div>• 读取资料：受限于当前授权范围内的公开文档与知识库</div>
          <div>• 写入允许：所有外部写入操作（创建待办、写入知识）均须人工确认</div>
          <div>• 网络访问：{item.requiredPermissions?.needsNetwork ? '需要连接公网 API' : '仅本地运行'}</div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 text-neutral-700 text-[12.5px] font-bold rounded-xl hover:bg-neutral-50"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirmScope(selectedScope);
              onClose();
            }}
            className="px-5 py-2 bg-neutral-900 text-white text-[12.5px] font-extrabold rounded-xl hover:bg-neutral-800 shadow-2xs"
          >
            确认更新授权
          </button>
        </div>
      </div>
    </div>
  );
};
