import React, { useState } from 'react';
import { SkillItem, ProcessCategory } from './types';
import {
  Search, Check, Plus, AlertTriangle, MessageSquare, Search as SearchIcon, PenTool, Sparkles, Bot, Wrench
} from 'lucide-react';

interface SkillHomeProps {
  skills: SkillItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenDetail: (skill: SkillItem) => void;
  onInstallSkill?: (skill: SkillItem) => void;
  enabledSkillIds?: Record<string, boolean>;
}

export const SkillHome: React.FC<SkillHomeProps> = ({
  skills,
  searchQuery,
  setSearchQuery,
  onOpenDetail,
  onInstallSkill,
  enabledSkillIds = {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Category tags (Single line horizontal scroll)
  const categoryTabs: { id: string; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'recommend', label: '推荐' },
    { id: 'research', label: '商家研究' },
    { id: 'content', label: '内容创作' },
    { id: 'material', label: '素材处理' },
    { id: 'interaction', label: '发布互动' },
    { id: 'review', label: '数据复盘' },
    { id: 'strategy', label: '效率工具' }
  ];

  // Featured skills (Max 3)
  const featuredSkillIds = ['sk_comment_intent', 'sk_xhs_keyword', 'sk_xhs_writer'];
  const featuredSkills = skills.filter(s => featuredSkillIds.includes(s.id)).slice(0, 3);

  // Skill Icon mapping helper
  const getSkillIcon = (id: string, cat: string) => {
    if (id === 'sk_comment_intent') return <MessageSquare size={18} className="text-blue-600" />;
    if (id === 'sk_xhs_keyword') return <SearchIcon size={18} className="text-purple-600" />;
    if (id === 'sk_xhs_writer') return <PenTool size={18} className="text-emerald-600" />;
    if (cat === 'content') return <PenTool size={18} className="text-amber-600" />;
    if (cat === 'interaction') return <MessageSquare size={18} className="text-sky-600" />;
    return <Sparkles size={18} className="text-neutral-700" />;
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.oneSentenceDesc.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'recommend') return featuredSkillIds.includes(skill.id);
    if (selectedCategory === 'research') return skill.processCategory === 'research' || skill.processCategory === 'diagnosis';
    if (selectedCategory === 'content') return skill.processCategory === 'content';
    if (selectedCategory === 'material') return skill.processCategory === 'material' || skill.processCategory === 'audit';
    if (selectedCategory === 'interaction') return skill.processCategory === 'interaction' || skill.processCategory === 'publish';
    if (selectedCategory === 'review') return skill.processCategory === 'review';
    if (selectedCategory === 'strategy') return skill.processCategory === 'strategy' || skill.processCategory === 'experience';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Featured Skills Section (精选技能 - Max 3) */}
      {!searchQuery && selectedCategory === 'all' && featuredSkills.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 px-0.5">
            <Sparkles size={15} className="text-amber-500 shrink-0" />
            <h2 className="text-[14px] font-black text-neutral-900">精选能力推荐</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {featuredSkills.map(skill => {
              const isEnabled = !!enabledSkillIds[skill.id];
              const isBuiltIn = skill.source === 'official' && (skill.id === 'sk_cover_audit' || skill.id === 'sk_publish_check');
              const needsConfig = skill.status === 'needs_config' || !!skill.unavailableReason;

              return (
                <div
                  key={skill.id}
                  onClick={() => onOpenDetail(skill)}
                  className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 group-hover:bg-neutral-100 transition-colors">
                        {getSkillIcon(skill.id, skill.processCategory)}
                      </div>
                      <span className="text-[11px] font-extrabold text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">
                        精选
                      </span>
                    </div>

                    <h3 className="text-[14.5px] font-black text-neutral-900 group-hover:text-black">
                      {skill.name}
                    </h3>

                    <p className="text-[12px] font-bold text-neutral-600 line-clamp-2 leading-relaxed">
                      {skill.oneSentenceDesc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-end">
                    {isBuiltIn ? (
                      <span className="text-[11.5px] font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl">
                        系统内置
                      </span>
                    ) : needsConfig ? (
                      <span className="text-[11.5px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                        需配置
                      </span>
                    ) : isEnabled ? (
                      <span className="text-[11.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Check size={13} /> ✓ 已启用
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInstallSkill?.(skill);
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[11.5px] font-extrabold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                      >
                        <Plus size={13} /> ＋ 添加
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Tabs (Single line horizontal scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-b border-neutral-200/80">
        {categoryTabs.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-extrabold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3-Column Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => {
          const isEnabled = !!enabledSkillIds[skill.id];
          const isBuiltIn = skill.source === 'official' && (skill.id === 'sk_cover_audit' || skill.id === 'sk_publish_check');
          const needsConfig = skill.status === 'needs_config' || !!skill.unavailableReason;

          return (
            <div
              key={skill.id}
              onClick={() => onOpenDetail(skill)}
              className="bg-white rounded-2xl border border-neutral-200/90 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Header row: Icon, Name & Source Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 group-hover:bg-neutral-100 transition-colors shrink-0">
                      {getSkillIcon(skill.id, skill.processCategory)}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-black text-neutral-900 group-hover:text-black">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-bold text-neutral-400 block mt-0.5">
                        {skill.source === 'official' ? '官方' : '自定义'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capability Description (max 2 lines) */}
                <p className="text-[12.5px] font-bold text-neutral-600 line-clamp-2 leading-relaxed">
                  {skill.oneSentenceDesc}
                </p>
              </div>

              {/* Footer status / button */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11.5px] font-bold text-neutral-400">
                  {skill.source === 'official' ? '官方能力' : '团队扩展'}
                </span>

                {isBuiltIn ? (
                  <span className="text-[11.5px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                    系统内置
                  </span>
                ) : needsConfig ? (
                  <span className="text-[11.5px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    需配置
                  </span>
                ) : isEnabled ? (
                  <span className="text-[11.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200/80">
                    <Check size={13} /> ✓ 已启用
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInstallSkill?.(skill);
                    }}
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-extrabold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                  >
                    <Plus size={14} /> ＋ 添加
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
