import React, { useState } from 'react';
import { SkillItem, ProcessCategory, MerchantRecommendation } from './types';
import {
  Search, ShieldAlert, CheckCircle2, AlertTriangle,
  Eye, Plus, CheckCircle, Download, Check
} from 'lucide-react';

interface SkillHomeProps {
  skills: SkillItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recommendations?: MerchantRecommendation[];
  onOpenDetail: (skill: SkillItem) => void;
  onTestSkill: (skill: SkillItem) => void;
  onOpenCreateSkill: () => void;
  onOpenRecDetail?: (rec: MerchantRecommendation) => void;
  onRunRecOnce?: (rec: MerchantRecommendation) => void;
  onApplyRecToMerchant?: (rec: MerchantRecommendation) => void;
  onDismissRec?: (id: string, reason: string) => void;
  onInstallSkill?: (skill: SkillItem) => void;
  onAddSkillToExpert?: (skill: SkillItem) => void;
  onOpenUsageLocations?: (skill: SkillItem) => void;
  onUseInProject?: (skill: SkillItem) => void;
  onConfigAutoRun?: (skill: SkillItem) => void;
}

export const SkillHome: React.FC<SkillHomeProps> = ({
  skills,
  searchQuery,
  setSearchQuery,
  onOpenDetail,
  onInstallSkill,
  onOpenCreateSkill
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProcessCategory | 'all'>('all');
  const [installedIds, setInstalledIds] = useState<Record<string, boolean>>({
    sk_comp_merchant_diag: true,
    sk_comp_blue_ocean: true,
    sk_comp_project_ops: true,
    sk_comp_content_plan: true
  });

  // 运营阶段筛选
  const categories: { id: ProcessCategory | 'all'; label: string }[] = [
    { id: 'all', label: '全部技能' },
    { id: 'diagnosis', label: '商家诊断与建设' },
    { id: 'research', label: '市场与蓝海研究' },
    { id: 'strategy', label: '策略与项目推进' },
    { id: 'account', label: '账号与矩阵规划' },
    { id: 'content', label: '选题与内容策划' },
    { id: 'material', label: '素材与审核管理' },
    { id: 'audit', label: '合规校验' },
    { id: 'interaction', label: '互动与私域承接' },
    { id: 'review', label: '数据观察与复盘' }
  ];

  const handleToggleInstall = (skill: SkillItem) => {
    const nextState = !installedIds[skill.id];
    setInstalledIds(prev => ({ ...prev, [skill.id]: nextState }));
    onInstallSkill?.(skill);
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.oneSentenceDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.goal && skill.goal.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      skill.processCategory === selectedCategory ||
      (selectedCategory === 'material' && skill.processCategory === 'audit');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索技能名称、用途或关键词..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[13px] font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-800 focus:bg-white transition-all"
            />
          </div>

          <div className="text-[12px] font-bold text-neutral-500">
            共计 <span className="text-neutral-900 font-extrabold">{filteredSkills.length}</span> 项技能 · 已安装技能由 Agent 自动调用
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-neutral-100">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid: Clean standard UI without icon in front of titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => {
          const isUnavailable = skill.status === 'needs_config' || !!skill.unavailableReason;
          const isInstalled = !!installedIds[skill.id];

          return (
            <div
              key={skill.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md ${
                isUnavailable ? 'border-amber-200/80 bg-amber-50/10' : 'border-neutral-200/90 hover:border-neutral-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header Row: Title without icon & Stage badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[15px] font-black text-neutral-900">
                        {skill.name}
                      </h3>
                      {skill.isComposite && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-extrabold">
                          复合技能
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-neutral-400 block mt-0.5">
                      {skill.stageLabel || '通用运营阶段'} · {skill.source === 'official' ? '官方内建' : '自定义'}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold border ${
                    isUnavailable
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : isInstalled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                  }`}>
                    {isUnavailable ? '需授权数据' : isInstalled ? '已安装' : '未安装'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[12.5px] font-bold text-neutral-700 line-clamp-2">
                  {skill.goal || skill.oneSentenceDesc}
                </p>

                {/* Input / Output summary */}
                <div className="space-y-1 text-[11.5px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-neutral-600">
                  <div className="line-clamp-1">
                    <span className="font-bold text-neutral-400 mr-1.5">所需资料:</span>
                    <span>{skill.inputFormat.slice(0, 2).join('，')}</span>
                  </div>
                  <div className="line-clamp-1">
                    <span className="font-bold text-neutral-400 mr-1.5">交付产出:</span>
                    <span>{skill.outputFormat.slice(0, 2).join('，')}</span>
                  </div>
                </div>

                {isUnavailable && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-1.5 text-amber-900 text-[11.5px] font-bold">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {skill.unavailableReason || '需在系统设置中配置公开评论数据访问能力。'}
                    </span>
                  </div>
                )}
              </div>

              {/* Standard Marketplace Actions: Install/Enable & View Details */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleInstall(skill)}
                  disabled={isUnavailable}
                  className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    isUnavailable
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                      : isInstalled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs active:scale-95'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <Check size={14} /> 已安装 (自动调用)
                    </>
                  ) : (
                    <>
                      <Download size={14} /> 安装技能
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenDetail(skill)}
                  className="px-3 py-2 text-[12px] font-extrabold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye size={14} /> 查看详情
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

