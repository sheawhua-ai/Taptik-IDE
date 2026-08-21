import React from 'react';
import { MyCapabilityItem, SkillItem } from './types';
import {
  ShieldCheck, AlertTriangle, Eye, Check, Trash2, Settings, Lock
} from 'lucide-react';

interface MyCapabilitiesProps {
  capabilities: MyCapabilityItem[];
  onOpenSkillDetail: (item: SkillItem) => void;
  onToggleDisable?: (item: MyCapabilityItem) => void;
}

export const MyCapabilities: React.FC<MyCapabilitiesProps> = ({
  capabilities,
  onOpenSkillDetail,
  onToggleDisable
}) => {
  const enabledCount = capabilities.filter(c => c.status === 'enabled').length;
  const needsConfigCount = capabilities.filter(c => c.status === 'needs_config').length;

  return (
    <div className="space-y-5">
      {/* Overview stats header */}
      <div className="p-4 bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-btn-main text-white rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-text-main">
              当前商家已启用的技能 ({capabilities.length})
            </h2>
            <p className="text-[12px] font-bold text-text-tertiary mt-0.5">
              已启用的技能将在小红书运营与发布流程中由 AI 自动调用。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[12px] font-extrabold">
            {enabledCount} 项正常运行
          </span>
          {needsConfigCount > 0 && (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-[12px] font-extrabold">
              {needsConfigCount} 项需配置
            </span>
          )}
        </div>
      </div>

      {/* Grid of enabled skills */}
      {capabilities.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center text-text-tertiary mb-3">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-[14px] font-bold text-text-main">暂无已启用的技能</h3>
          <p className="text-[13px] text-text-tertiary mt-1">请在技能库中添加所需的AI能力</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map(item => {
          const skill: SkillItem = item.refData || {
            id: item.id,
            name: item.name,
            oneSentenceDesc: item.lastResult,
            goal: item.lastResult,
            processCategory: 'diagnosis',
            source: 'official',
            status: item.status,
            version: 'v2.0',
            updatedAt: '2026-08-01',
            lastTestStatus: 'passed',
            lastVerifiedResult: item.lastResult,
            usedByExpertsCount: 0,
            usedByProjectsCount: 1,
            usedByExperts: [],
            usedByProjects: [],
            applicableScenes: ['全链路适用的标准技能'],
            inapplicableScenes: [],
            inputFormat: ['标准结构化数据'],
            outputFormat: ['结论卡片'],
            manualConfirmPoints: ['关键节点确认'],
            failureHandling: '提请补充资料',
            requiredPermissions: {
              readScope: [],
              writeScope: [],
              needsNetwork: false,
              willModifyData: false
            },
            appScope: item.appScope
          };

          const isBuiltIn = skill.source === 'official' && (skill.id === 'sk_cover_audit' || skill.id === 'sk_publish_check');
          const isNeedsConfig = item.status === 'needs_config' || skill.status === 'needs_config';

          return (
            <div
              key={item.id}
              className="bg-surface-1 rounded-xl border border-border-default/90 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-black text-text-main">
                    {item.name}
                  </h3>

                  {isBuiltIn ? (
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                      系统内置
                    </span>
                  ) : isNeedsConfig ? (
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      需配置
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      已启用
                    </span>
                  )}
                </div>

                <p className="text-[12.5px] font-bold text-text-secondary line-clamp-2 leading-relaxed">
                  {skill.oneSentenceDesc || skill.goal || item.lastResult}
                </p>

                {isNeedsConfig && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-1.5 text-amber-900 text-[11.5px] font-bold">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>需配置评论或数据访问通道后方可自动调用。</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-border-default flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenSkillDetail(skill)}
                  className="px-3 py-1.5 text-[12px] font-extrabold text-text-secondary hover:text-text-main bg-page-bg hover:bg-hover-bg rounded-xl transition-colors flex items-center gap-1 border border-border-default/80"
                >
                  <Eye size={14} /> 查看详情
                </button>

                <div className="flex items-center gap-1.5">
                  {isNeedsConfig && (
                    <button
                      onClick={() => alert(`请在系统设置中为【${item.name}】配置所需数据连接。`)}
                      className="px-3 py-1.5 text-[12px] font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center gap-1 border border-amber-200"
                    >
                      <Settings size={13} /> 去配置
                    </button>
                  )}

                  {!isBuiltIn && (
                    <button
                      onClick={() => onToggleDisable?.(item)}
                      className="px-2.5 py-1.5 text-[12px] font-extrabold text-text-tertiary hover:text-danger hover:bg-danger-light rounded-xl transition-colors"
                      title="从当前商家移除"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {isBuiltIn && (
                    <span className="text-[11px] font-bold text-text-tertiary flex items-center gap-1 px-2 py-1 bg-page-bg rounded-lg">
                      <Lock size={12} /> 不可移除
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
