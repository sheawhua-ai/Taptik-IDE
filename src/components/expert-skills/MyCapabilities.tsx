import React, { useState } from 'react';
import { MyCapabilityItem, SkillItem, AppScope } from './types';
import {
  ShieldCheck, AlertTriangle, Eye, CheckCircle2, CheckCircle, Check, Trash2
} from 'lucide-react';

interface MyCapabilitiesProps {
  capabilities: MyCapabilityItem[];
  onOpenSkillDetail: (item: SkillItem) => void;
  onTestSkill: (item: SkillItem) => void;
  onUseInProject?: (item: SkillItem) => void;
  onConfigAutoRun?: (item: SkillItem) => void;
  onToggleDisable?: (item: MyCapabilityItem) => void;
}

export const MyCapabilities: React.FC<MyCapabilitiesProps> = ({
  capabilities,
  onOpenSkillDetail,
  onToggleDisable
}) => {
  const [filterType, setFilterType] = useState<'all' | 'enabled' | 'needs_action' | 'disabled'>('all');

  const callableCount = capabilities.filter(c => c.status === 'enabled').length;
  const needsActionCount = capabilities.filter(c => c.status === 'needs_config' || c.status === 'test_failed').length;

  const scopeLabels: Record<AppScope, string> = {
    task: '仅本次任务',
    project: '当前项目生效',
    merchant: '商家全局生效',
    all: '所有商家应用'
  };

  const filtered = capabilities.filter(item => {
    if (filterType === 'enabled') return item.status === 'enabled';
    if (filterType === 'needs_action') return item.status === 'needs_config' || item.status === 'test_failed';
    if (filterType === 'disabled') return item.status === 'disabled';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Summary Header Cards - Concise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-neutral-400 block">已安装的技能 · Agent 在对应流程中自动调用</span>
            <span className="text-[20px] font-black text-neutral-900">{callableCount} 项已启用</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-neutral-400 block">数据连接受限或待配置权限</span>
            <span className="text-[20px] font-black text-neutral-900">{needsActionCount} 项需授权</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold transition-all ${
            filterType === 'all' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          全部 ({capabilities.length})
        </button>
        <button
          onClick={() => setFilterType('enabled')}
          className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold transition-all ${
            filterType === 'enabled' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          正常调用 ({callableCount})
        </button>
        <button
          onClick={() => setFilterType('needs_action')}
          className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold transition-all ${
            filterType === 'needs_action' ? 'bg-amber-600 text-white shadow-2xs' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          需数据权限 ({needsActionCount})
        </button>
      </div>

      {/* Capabilities List Grid - Clean without title icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
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
            inputFormat: ['标准结构化项目数据'],
            outputFormat: ['结构化结论卡片'],
            manualConfirmPoints: ['核心决策节点需人工签署'],
            failureHandling: '数据不足时提请补充',
            requiredPermissions: {
              readScope: [],
              writeScope: [],
              needsNetwork: false,
              willModifyData: false
            },
            appScope: item.appScope
          };

          const isUnavailable = item.status === 'needs_config' || skill.status === 'needs_config';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all ${
                isUnavailable ? 'border-amber-200/80 bg-amber-50/10' : 'border-neutral-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[15px] font-black text-neutral-900">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-bold text-neutral-400 block mt-0.5">
                      生效范围：{scopeLabels[item.appScope]}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold border ${
                    isUnavailable
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isUnavailable ? '需配置连接' : '已启用'}
                  </span>
                </div>

                {/* Purpose / Goal */}
                <p className="text-[12.5px] text-neutral-700 font-bold line-clamp-2">
                  {skill.goal || skill.oneSentenceDesc || item.lastResult}
                </p>

                {/* Last Result summary */}
                <div className="text-[11.5px] text-neutral-600 flex items-center gap-1.5 pt-1 border-t border-neutral-100">
                  <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                  <span className="font-medium truncate">
                    执行反馈：{item.lastResult}
                  </span>
                </div>

                {isUnavailable && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-1.5 text-amber-900 text-[11.5px] font-bold">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {skill.unavailableReason || '当前技能暂不可用：缺少公开评论数据访问能力，请联系管理员完成配置。'}
                    </span>
                  </div>
                )}
              </div>

              {/* Concise Actions: Automatic invocation tag & View details */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <div className="flex-1 py-1.5 px-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[12px] font-extrabold text-neutral-700 flex items-center justify-center gap-1.5">
                  <Check size={13} className="text-emerald-600" />
                  <span>Agent 自动调度中</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenSkillDetail(skill)}
                    className="px-2.5 py-1.5 text-[12px] font-extrabold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1"
                    title="查看完整说明"
                  >
                    <Eye size={14} /> 详情
                  </button>

                  <button
                    onClick={() => onToggleDisable?.(item)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="移除此技能"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

