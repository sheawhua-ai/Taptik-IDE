import React, { useState } from 'react';
import { MyCapabilityItem, ExpertItem, SkillItem, AppScope } from './types';
import {
  ShieldCheck, Bot, Wrench, Clock, AlertTriangle, Play, Eye, Settings,
  Sliders, Layers, Terminal, Power, CheckCircle2, ChevronRight
} from 'lucide-react';

interface MyCapabilitiesProps {
  capabilities: MyCapabilityItem[];
  onStartExpertTask: (item: ExpertItem) => void;
  onOpenExpertDetail: (item: ExpertItem) => void;
  onOpenSkillDetail: (item: SkillItem) => void;
  onTestSkill: (item: SkillItem) => void;
  onOpenUsageLocations: (item: SkillItem) => void;
  onModifyConfig: (item: MyCapabilityItem) => void;
  onAdjustScope: (item: MyCapabilityItem) => void;
  onToggleDisable: (item: MyCapabilityItem) => void;
}

export const MyCapabilities: React.FC<MyCapabilitiesProps> = ({
  capabilities,
  onStartExpertTask,
  onOpenExpertDetail,
  onOpenSkillDetail,
  onTestSkill,
  onOpenUsageLocations,
  onModifyConfig,
  onAdjustScope,
  onToggleDisable
}) => {
  const [filterType, setFilterType] = useState<'all' | 'expert' | 'skill' | 'needs_action' | 'disabled'>('all');

  const callableCount = capabilities.filter(c => c.status === 'enabled' || c.status === 'installed').length;
  const needsActionCount = capabilities.filter(c => c.status === 'needs_config' || c.status === 'test_failed' || (c.pendingConfirmCount && c.pendingConfirmCount > 0)).length;

  const scopeLabels: Record<AppScope, string> = {
    task: '仅本次任务',
    project: '当前项目',
    merchant: '当前商家',
    all: '全部商家'
  };

  const filtered = capabilities.filter(item => {
    if (filterType === 'expert') return item.type === 'expert';
    if (filterType === 'skill') return item.type === 'skill';
    if (filterType === 'needs_action') return item.status === 'needs_config' || item.status === 'test_failed' || (item.pendingConfirmCount && item.pendingConfirmCount > 0);
    if (filterType === 'disabled') return item.status === 'disabled';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Summaries Header (Requirement 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-neutral-400 block">当前可调用能力总数</span>
            <span className="text-[24px] font-extrabold text-neutral-900">{callableCount} 项</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-neutral-400 block">需要配置或测试的能力</span>
            <span className="text-[24px] font-extrabold text-neutral-900">{needsActionCount} 项</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-neutral-200/90 shadow-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
            filterType === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          全部 ({capabilities.length})
        </button>
        <button
          onClick={() => setFilterType('expert')}
          className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
            filterType === 'expert' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          专家
        </button>
        <button
          onClick={() => setFilterType('skill')}
          className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
            filterType === 'skill' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          技能
        </button>
        <button
          onClick={() => setFilterType('needs_action')}
          className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
            filterType === 'needs_action' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          需要处理 ({needsActionCount})
        </button>
        <button
          onClick={() => setFilterType('disabled')}
          className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
            filterType === 'disabled' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          已停用
        </button>
      </div>

      {/* Capabilities List (Differentiation between Expert Card & Skill Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(item => {
          if (item.type === 'expert') {
            const expData = item.refData as ExpertItem;
            return (
              /* 9.1 My Expert Card */
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-purple-50 text-purple-900 rounded-xl">
                        <Bot size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-extrabold text-neutral-900">{item.name}</h3>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10.5px] font-extrabold rounded">专家</span>
                        </div>
                        <span className="text-[11.5px] font-bold text-neutral-400">
                          授权范围: {scopeLabels[item.appScope]}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded-full border border-emerald-200">
                      {item.status === 'enabled' ? '可调用' : '需要配置'}
                    </span>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1.5 text-[12px]">
                    <div>
                      <span className="text-neutral-400 font-extrabold mr-1">最近完成任务:</span>
                      <span className="text-neutral-800 font-medium">{item.lastResult || '尚无记录'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-extrabold mr-1">最近调用时间:</span>
                      <span className="text-neutral-800 font-medium">{item.lastUsed}</span>
                    </div>
                    {expData?.monitoring?.isMonitoring && (
                      <div className="text-purple-700 font-bold flex items-center gap-1 text-[11px]">
                        <Clock size={12} /> 存在后台监控任务 (状态: {expData.monitoring.state})
                      </div>
                    )}
                  </div>
                </div>

                {/* Expert Card Operations */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onStartExpertTask(expData)}
                    className="px-4 py-2 bg-neutral-900 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <Play size={14} /> 发起任务
                  </button>

                  <div className="flex items-center gap-2 text-[12px] font-extrabold text-neutral-500">
                    <button onClick={() => onOpenExpertDetail(expData)} className="hover:text-neutral-900">
                      查看记录
                    </button>
                    <button onClick={() => onAdjustScope(item)} className="hover:text-neutral-900">
                      调整授权
                    </button>
                    <button onClick={() => onToggleDisable(item)} className="hover:text-rose-600">
                      停用
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
            /* 9.2 My Skill Card */
            const skData = item.refData as SkillItem;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl">
                        <Wrench size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-extrabold text-neutral-900">{item.name}</h3>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10.5px] font-extrabold rounded">技能</span>
                        </div>
                        <span className="text-[11.5px] font-bold text-neutral-400">
                          配置状态: {item.status === 'needs_config' ? '需要配置' : '完成'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-extrabold rounded-full border border-blue-200">
                      授权: {scopeLabels[item.appScope]}
                    </span>
                  </div>

                  <p className="text-[12.5px] font-bold text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    {skData?.oneSentenceDesc || '单一步骤可复用执行能力'}
                  </p>

                  <div className="space-y-1 text-[11.5px] text-neutral-500 font-extrabold">
                    <div>被使用位置: {skData?.usedByExperts?.map(e => e.name).join('， ') || '通用'}</div>
                    <div>最近本地测试: {skData?.lastTestStatus === 'passed' ? '已通过' : '待测试'}</div>
                  </div>
                </div>

                {/* Skill Card Operations (NO "发起任务" button!) */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[12px] font-extrabold text-neutral-600">
                  <button
                    onClick={() => onTestSkill(skData)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg flex items-center gap-1"
                  >
                    <Terminal size={13} /> 本地测试
                  </button>

                  <button onClick={() => onOpenUsageLocations(skData)} className="hover:text-neutral-900">
                    查看使用位置
                  </button>
                  <button onClick={() => onModifyConfig(item)} className="hover:text-neutral-900">
                    修改配置
                  </button>
                  <button onClick={() => onToggleDisable(item)} className="hover:text-rose-600">
                    停用
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
