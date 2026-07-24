import React, { useState } from 'react';
import { ExpertItem, ProcessCategory, DailyTaskType, MerchantRecommendation, AppScope } from './types';
import { MerchantRecommendationSection } from './MerchantRecommendationSection';
import {
  Search, Bot, CheckCircle2, Clock, ShieldAlert, Sparkles,
  ChevronDown, Filter, Play, Eye, Settings, FileText, Sliders, AlertTriangle, Layers, Power
} from 'lucide-react';

interface ExpertHomeProps {
  experts: ExpertItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recommendations: MerchantRecommendation[];
  onOpenDetail: (expert: ExpertItem) => void;
  onStartTask: (expert: ExpertItem) => void;
  onOpenCreateExpert: () => void;
  onOpenRecDetail: (rec: MerchantRecommendation) => void;
  onRunRecOnce: (rec: MerchantRecommendation) => void;
  onApplyRecToMerchant: (rec: MerchantRecommendation) => void;
  onDismissRec: (id: string, reason: string) => void;
  onModifyConfig: (expert: ExpertItem) => void;
  onOpenRunLogs: (expert: ExpertItem) => void;
  onAdjustScope: (expert: ExpertItem) => void;
  onToggleStatus: (expert: ExpertItem) => void;
}

export const ExpertHome: React.FC<ExpertHomeProps> = ({
  experts,
  searchQuery,
  setSearchQuery,
  recommendations,
  onOpenDetail,
  onStartTask,
  onOpenCreateExpert,
  onOpenRecDetail,
  onRunRecOnce,
  onApplyRecToMerchant,
  onDismissRec,
  onModifyConfig,
  onOpenRunLogs,
  onAdjustScope,
  onToggleStatus
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProcessCategory>('all');
  const [selectedDailyTask, setSelectedDailyTask] = useState<DailyTaskType>('all');
  const [showDailyFilter, setShowDailyFilter] = useState(false);

  // 12 Operational Process Categories
  const categories: { id: ProcessCategory; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'diagnosis', label: '商家诊断' },
    { id: 'research', label: '市场与机会研究' },
    { id: 'strategy', label: '策略与项目策划' },
    { id: 'account', label: '账号与矩阵' },
    { id: 'content', label: '选题与内容' },
    { id: 'material', label: '素材策划与生产' },
    { id: 'audit', label: '审核与合规' },
    { id: 'publish', label: '发布与调度' },
    { id: 'interaction', label: '评论与私域承接' },
    { id: 'review', label: '数据观察与复盘' },
    { id: 'experience', label: '经验沉淀与方法优化' }
  ];

  // 14 Secondary Daily Tasks
  const dailyTasks: { id: DailyTaskType; label: string }[] = [
    { id: 'all', label: '全部日常' },
    { id: 'organize_docs', label: '整理资料' },
    { id: 'analyze_tables', label: '分析表格' },
    { id: 'extract_web', label: '提取网页' },
    { id: 'deconstruct_comp', label: '拆解竞品' },
    { id: 'generate_copy', label: '生成文案' },
    { id: 'audit_content', label: '审核内容' },
    { id: 'check_materials', label: '检查素材' },
    { id: 'make_schedules', label: '安排排期' },
    { id: 'assign_accounts', label: '分配账号' },
    { id: 'create_tasks', label: '创建任务' },
    { id: 'handle_anomalies', label: '处理异常' },
    { id: 'generate_reports', label: '生成日报/周报' },
    { id: 'precipitate_exp', label: '沉淀经验' },
    { id: 'build_skills', label: '构建技能' }
  ];

  const scopeLabels: Record<AppScope, string> = {
    task: '仅本次任务',
    project: '当前项目',
    merchant: '当前商家',
    all: '全部商家'
  };

  const statusBadges: Record<string, { label: string; style: string }> = {
    enabled: { label: '已启用', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    installed: { label: '已安装', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    needs_config: { label: '需要配置', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    test_failed: { label: '测试未通过', style: 'bg-rose-50 text-rose-700 border-rose-200' },
    disabled: { label: '已停用', style: 'bg-neutral-100 text-neutral-500 border-neutral-200' },
    uninstalled: { label: '未安装', style: 'bg-neutral-100 text-neutral-600 border-neutral-200' }
  };

  // Filter experts
  const filteredExperts = experts.filter(exp => {
    // Search query filter
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.businessTask.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.mission.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCat = selectedCategory === 'all' || exp.scenarioStage === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Merchant Recommendation Section */}
      <MerchantRecommendationSection
        recommendations={recommendations}
        onOpenDetail={onOpenRecDetail}
        onRunOnce={onRunRecOnce}
        onAddToMerchant={onApplyRecToMerchant}
        onDismiss={onDismissRec}
      />

      {/* Search Bar & Process Category Filter Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
        {/* Unified Search Bar (Requirement 2) */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索任务、运营阶段、专家或技能，例如：蓝海词、首图审核、发布异常……"
            className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-[12px] font-extrabold"
            >
              清空
            </button>
          )}
        </div>

        {/* 12 Operational Process Categories (Requirement 3) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-extrabold text-neutral-500 uppercase tracking-wider">
              运营流程分类
            </span>

            {/* Daily Tasks Toggle */}
            <button
              onClick={() => setShowDailyFilter(!showDailyFilter)}
              className="text-[12px] font-extrabold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/70 transition-all"
            >
              <Filter size={13} />
              <span>日常任务筛选</span>
              <ChevronDown size={13} className={`transition-transform ${showDailyFilter ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Daily Task Sub-Filter */}
          {showDailyFilter && (
            <div className="pt-2.5 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar animate-in fade-in duration-150">
              <span className="text-[11px] font-extrabold text-neutral-400 shrink-0">日常类型：</span>
              {dailyTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedDailyTask(task.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold whitespace-nowrap transition-all ${
                    selectedDailyTask === task.id
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  {task.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperts.map(expert => {
          const statusInfo = statusBadges[expert.status] || statusBadges.enabled;

          return (
            <div
              key={expert.id}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              {/* Top Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-neutral-100 text-neutral-800 rounded-xl shrink-0">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-extrabold text-neutral-900">
                        {expert.name}
                      </h3>
                      <span className="text-[11px] font-bold text-neutral-400">
                        {categories.find(c => c.id === expert.scenarioStage)?.label || '运营能力'}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusInfo.style}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Core Task & Status Badges */}
                <div className="space-y-2">
                  <p className="text-[13px] font-bold text-neutral-800 line-clamp-2">
                    {expert.businessTask}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-bold">
                      授权: {scopeLabels[expert.appScope]}
                    </span>

                    {expert.hasPendingConfirms && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-extrabold flex items-center gap-1">
                        <AlertTriangle size={11} /> 有待确认事项
                      </span>
                    )}

                    {expert.monitoring?.isMonitoring && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-extrabold flex items-center gap-1">
                        <Clock size={11} /> 定时监控中
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Task Result */}
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[12px] space-y-1">
                  <span className="text-neutral-400 font-extrabold block text-[10.5px]">最近任务结果:</span>
                  <p className="text-neutral-700 font-medium line-clamp-2">
                    {expert.lastRunResult || '暂无最近任务记录'}
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                {/* Primary Button: "发起任务" (Requirement 6) */}
                <button
                  onClick={() => onStartTask(expert)}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.99]"
                >
                  <Play size={15} /> 发起任务
                </button>

                {/* Secondary Actions */}
                <div className="flex items-center justify-between text-[11.5px] text-neutral-500 font-extrabold pt-1">
                  <button
                    onClick={() => onOpenDetail(expert)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => onModifyConfig(expert)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    修改配置
                  </button>
                  <button
                    onClick={() => onOpenRunLogs(expert)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    任务记录
                  </button>
                  <button
                    onClick={() => onAdjustScope(expert)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    调整授权
                  </button>
                  <button
                    onClick={() => onToggleStatus(expert)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    {expert.status === 'disabled' ? '启用' : '停用'}
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
