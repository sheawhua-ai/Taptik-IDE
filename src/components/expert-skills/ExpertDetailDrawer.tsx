import React from 'react';
import { ExpertItem, AppScope } from './types';
import {
  X, Bot, Shield, CheckCircle2, AlertTriangle, Play, Settings,
  Wrench, ArrowRight, Layers, FileText, Ban, HelpCircle, History
} from 'lucide-react';

interface ExpertDetailDrawerProps {
  expert: ExpertItem | null;
  onClose: () => void;
  onStartTask: (expert: ExpertItem) => void;
  onAdjustSkills: (expert: ExpertItem) => void;
  onAdjustScope: (expert: ExpertItem) => void;
  onEditExpert: (expert: ExpertItem) => void;
  onToggleStatus: (expert: ExpertItem) => void;
}

export const ExpertDetailDrawer: React.FC<ExpertDetailDrawerProps> = ({
  expert,
  onClose,
  onStartTask,
  onAdjustSkills,
  onAdjustScope,
  onEditExpert,
  onToggleStatus
}) => {
  if (!expert) return null;

  const scopeLabels: Record<AppScope, string> = {
    task: '仅本次任务',
    project: '当前项目',
    merchant: '当前商家',
    all: '全部商家'
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-900 rounded-2xl">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-extrabold text-neutral-900">{expert.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-800 border border-purple-200">
                  专家角色
                </span>
              </div>
              <span className="text-[12px] font-bold text-neutral-400">
                当前授权范围：{scopeLabels[expert.appScope]}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content (Requirement 6.2) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[13px]">
          {/* Mission & Core Description */}
          <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/80 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-[12px]">
              <Shield size={16} />
              <span>专家使命</span>
            </div>
            <p className="text-purple-950 font-bold leading-relaxed">
              {expert.mission || expert.description}
            </p>
          </div>

          {/* What it can do VS What it won't do automatically */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <span className="text-emerald-900 font-extrabold block text-[12px]">可以完成什么：</span>
              <ul className="space-y-1.5 text-emerald-950 font-medium text-[12px]">
                {expert.whatItCanDo?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
              <span className="text-rose-900 font-extrabold block text-[12px]">不会自动做什么：</span>
              <ul className="space-y-1.5 text-rose-950 font-medium text-[12px]">
                {expert.whatItWontDoAuto?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Ban size={14} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Applicable Scenarios */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-neutral-900 text-[14px]">适用场景</h3>
            <div className="flex flex-wrap gap-2">
              {expert.applicableScenes?.map((sc, i) => (
                <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-xl font-bold text-[12px]">
                  {sc}
                </span>
              ))}
            </div>
          </div>

          {/* Input Docs & Output Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
            <div>
              <h3 className="font-extrabold text-neutral-900 text-[13px] mb-2">输入资料需求</h3>
              <ul className="space-y-1 text-neutral-600 text-[12px]">
                {expert.inputDocs?.map((doc, idx) => (
                  <li key={idx}>• {doc}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-[13px] mb-2">输出结果定义</h3>
              <ul className="space-y-1 text-neutral-600 text-[12px]">
                {expert.outputResults?.map((out, idx) => (
                  <li key={idx}>• {out}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bound Skills */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <h3 className="font-extrabold text-neutral-900 text-[14px]">已绑定技能</h3>
            <div className="space-y-2">
              {expert.boundSkills?.map(sk => (
                <div key={sk.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-blue-600" />
                    <span className="font-extrabold text-neutral-900">{sk.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-neutral-400">{sk.oneSentenceDesc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Confirm Points */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-[13px]">
              <AlertTriangle size={16} />
              <span>人工确认点 (运行中中断并暂停)</span>
            </div>
            <ul className="space-y-1 text-amber-950 font-bold text-[12px]">
              {expert.manualConfirmPoints?.map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>

          {/* Failure and Info Gap Handling */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
            <span className="font-extrabold text-neutral-800 text-[13px] block">失败或信息不足时处理：</span>
            <p className="text-neutral-600 font-medium text-[12px]">
              {expert.failureAndMissingInfoHandling}
            </p>
          </div>

          {/* Recent Task Logs */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <h3 className="font-extrabold text-neutral-900 text-[14px] flex items-center gap-2">
              <History size={16} /> 最近任务记录
            </h3>
            {expert.runLogs && expert.runLogs.length > 0 ? (
              expert.runLogs.map(log => (
                <div key={log.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[12px] space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-neutral-900">
                    <span>{log.projectName}</span>
                    <span className="text-neutral-400 font-bold text-[11px]">{log.timestamp}</span>
                  </div>
                  <p className="text-neutral-700">{log.resultSummary}</p>
                </div>
              ))
            ) : (
              <p className="text-neutral-400 font-bold text-[12px]">暂无最近任务记录</p>
            )}
          </div>
        </div>

        {/* Bottom Drawer Actions (Requirement 6.2) */}
        <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onStartTask(expert);
            }}
            className="px-5 py-2.5 bg-neutral-900 text-white font-extrabold text-[13px] rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <Play size={15} /> 发起任务
          </button>

          <div className="flex items-center gap-2 text-[12px] font-extrabold text-neutral-600">
            <button onClick={() => onAdjustSkills(expert)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              调整技能
            </button>
            <button onClick={() => onAdjustScope(expert)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              调整授权
            </button>
            <button onClick={() => onEditExpert(expert)} className="hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
              编辑专家
            </button>
            <button onClick={() => onToggleStatus(expert)} className="hover:text-rose-600 px-2 py-1 bg-neutral-100 rounded-lg">
              {expert.status === 'disabled' ? '启用' : '停用'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
