import React, { useState } from 'react';
import { SkillItem, ProcessCategory, DailyTaskType, SkillSourceType, MerchantRecommendation } from './types';
import { MerchantRecommendationSection } from './MerchantRecommendationSection';
import {
  Search, Wrench, CheckCircle2, Clock, ShieldAlert, Sparkles,
  ChevronDown, Filter, Play, Eye, Settings, FileText, Layers, Wifi, Terminal, ExternalLink, Plus
} from 'lucide-react';

interface SkillHomeProps {
  skills: SkillItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recommendations: MerchantRecommendation[];
  onOpenDetail: (skill: SkillItem) => void;
  onTestSkill: (skill: SkillItem) => void;
  onOpenCreateSkill: () => void;
  onOpenRecDetail: (rec: MerchantRecommendation) => void;
  onRunRecOnce: (rec: MerchantRecommendation) => void;
  onApplyRecToMerchant: (rec: MerchantRecommendation) => void;
  onDismissRec: (id: string, reason: string) => void;
  onInstallSkill: (skill: SkillItem) => void;
  onAddSkillToExpert: (skill: SkillItem) => void;
  onOpenUsageLocations: (skill: SkillItem) => void;
}

export const SkillHome: React.FC<SkillHomeProps> = ({
  skills,
  searchQuery,
  setSearchQuery,
  recommendations,
  onOpenDetail,
  onTestSkill,
  onOpenCreateSkill,
  onOpenRecDetail,
  onRunRecOnce,
  onApplyRecToMerchant,
  onDismissRec,
  onInstallSkill,
  onAddSkillToExpert,
  onOpenUsageLocations
}) => {
  const [selectedSource, setSelectedSource] = useState<SkillSourceType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ProcessCategory>('all');
  const [selectedDailyTask, setSelectedDailyTask] = useState<DailyTaskType>('all');
  const [showDailyFilter, setShowDailyFilter] = useState(false);

  // Skill Sources (Requirement 11)
  const sources: { id: SkillSourceType | 'all'; label: string }[] = [
    { id: 'all', label: '全部来源' },
    { id: 'official', label: 'TapTik官方' },
    { id: 'team', label: '团队共享' },
    { id: 'mine', label: '我创建的' },
    { id: 'external', label: '外部导入' },
    { id: 'from_exp', label: '从经验升级' },
    { id: 'from_project', label: '从项目沉淀' },
    { id: 'merchant', label: '商家专属' },
    { id: 'temp_project', label: '项目临时' }
  ];

  // 12 Operational Process Categories
  const categories: { id: ProcessCategory; label: string }[] = [
    { id: 'all', label: '全部环节' },
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

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.oneSentenceDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.goal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = selectedSource === 'all' || skill.source === selectedSource;
    const matchesCategory = selectedCategory === 'all' || skill.processCategory === selectedCategory;

    return matchesSearch && matchesSource && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Merchant Recommendations */}
      <MerchantRecommendationSection
        recommendations={recommendations}
        onOpenDetail={onOpenRecDetail}
        onRunOnce={onRunRecOnce}
        onAddToMerchant={onApplyRecToMerchant}
        onDismiss={onDismissRec}
      />

      {/* Search & Multi-Filter Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索技能名称、用途、流程或应用，例如：首图、敏感词、提炼、合规……"
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

        {/* Source Filters (Requirement 11) */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider block">
            技能来源
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {sources.map(src => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                className={`px-3 py-1 rounded-lg text-[12px] font-extrabold whitespace-nowrap transition-all ${
                  selectedSource === src.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>
        </div>

        {/* Process Category Filters */}
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
              适用流程环节
            </span>
            <button
              onClick={() => setShowDailyFilter(!showDailyFilter)}
              className="text-[11.5px] font-extrabold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/70"
            >
              <Filter size={12} /> 日常任务筛选 <ChevronDown size={12} className={`transition-transform ${showDailyFilter ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-[12px] font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Daily Task Sub-Filter */}
          {showDailyFilter && (
            <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar animate-in fade-in duration-150">
              <span className="text-[11px] font-extrabold text-neutral-400 shrink-0">日常操作:</span>
              {dailyTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedDailyTask(task.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap transition-all ${
                    selectedDailyTask === task.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {task.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map(skill => (
          <div
            key={skill.id}
            className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
          >
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl shrink-0">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15.5px] font-extrabold text-neutral-900">
                      {skill.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10.5px] font-extrabold">
                        {sources.find(s => s.id === skill.source)?.label || '标准技能'}
                      </span>
                      {skill.requiredPermissions.needsNetwork && (
                        <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-[10.5px] font-extrabold flex items-center gap-0.5">
                          <Wifi size={10} /> 访问网络
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold border ${
                  skill.lastTestStatus === 'passed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {skill.lastTestStatus === 'passed' ? '测试通过' : '待测试'}
                </span>
              </div>

              {/* 1-Sentence Purpose */}
              <p className="text-[13px] font-bold text-neutral-800 line-clamp-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                {skill.oneSentenceDesc}
              </p>

              {/* Input / Output Summary */}
              <div className="space-y-1.5 text-[11.5px] text-neutral-600">
                <div className="truncate">
                  <span className="font-extrabold text-neutral-400 mr-1">输入要求:</span>
                  <span>{skill.inputFormat.join('， ')}</span>
                </div>
                <div className="truncate">
                  <span className="font-extrabold text-neutral-400 mr-1">产出结果:</span>
                  <span>{skill.outputFormat.join('， ')}</span>
                </div>
              </div>

              {/* Usage Count Info */}
              <div className="pt-1 flex items-center gap-3 text-[11px] font-extrabold text-neutral-400">
                <span>已被 {skill.usedByExpertsCount} 个专家绑定</span>
                <span>•</span>
                <span>参与 {skill.usedByProjectsCount} 个项目</span>
              </div>
            </div>

            {/* Actions: NO "发起任务" button for skills (Requirement 9 & 11) */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11.5px] font-extrabold text-neutral-600">
              <button
                onClick={() => onOpenDetail(skill)}
                className="hover:text-neutral-900 transition-colors flex items-center gap-1"
              >
                <Eye size={13} /> 详情
              </button>
              <button
                onClick={() => onTestSkill(skill)}
                className="hover:text-neutral-900 transition-colors flex items-center gap-1"
              >
                <Terminal size={13} /> 本地试用
              </button>

              <button
                onClick={() => onAddSkillToExpert(skill)}
                className="hover:text-neutral-900 transition-colors flex items-center gap-1"
              >
                <Plus size={13} /> 加入专家
              </button>

              <button
                onClick={() => onOpenUsageLocations(skill)}
                className="hover:text-neutral-900 transition-colors flex items-center gap-1"
              >
                <Layers size={13} /> 使用位置
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
