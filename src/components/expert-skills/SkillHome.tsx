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
    if (id === 'sk_comment_intent') return <MessageSquare size={18} className="text-text-main" />;
    if (id === 'sk_xhs_keyword') return <SearchIcon size={18} className="text-text-main" />;
    if (id === 'sk_xhs_writer') return <PenTool size={18} className="text-text-main" />;
    if (cat === 'content') return <PenTool size={18} className="text-text-main" />;
    if (cat === 'interaction') return <MessageSquare size={18} className="text-text-main" />;
    return <Wrench size={18} className="text-text-main" />;
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
      {/* Category Tabs (Single line horizontal scroll) */}
      <div className="flex items-center gap-6 overflow-x-auto pb-0 no-scrollbar border-b border-border-default/80">
        {categoryTabs.map(cat => {
          if (cat.id === 'recommend') return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative py-3 text-[13px] font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'text-text-main'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              {cat.label}
              {selectedCategory === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-logo" />
              )}
            </button>
          )
        })}
      </div>

      {/* 3-Column Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center text-text-tertiary mb-3">
            <SearchIcon size={24} />
          </div>
          <h3 className="text-[14px] font-bold text-text-main">未找到相关技能</h3>
          <p className="text-[13px] text-text-tertiary mt-1">请尝试更换搜索词或选择其他分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => {
          const isEnabled = !!enabledSkillIds[skill.id];
          const isBuiltIn = skill.source === 'official' && (skill.id === 'sk_cover_audit' || skill.id === 'sk_publish_check');
          const needsConfig = skill.status === 'needs_config' || !!skill.unavailableReason;

          return (
            <div
              key={skill.id}
              onClick={() => onOpenDetail(skill)}
              className="bg-surface-1 rounded-xl border border-border-default/90 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Header row: Icon, Name & Source Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-page-bg rounded-xl border border-border-default group-hover:bg-hover-bg transition-colors shrink-0">
                      {getSkillIcon(skill.id, skill.processCategory)}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-black text-text-main group-hover:text-black">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-bold text-text-tertiary block mt-0.5">
                        {skill.source === 'official' ? '官方' : '自定义'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capability Description (max 2 lines) */}
                <p className="text-[12.5px] font-bold text-text-secondary line-clamp-2 leading-relaxed">
                  {skill.oneSentenceDesc}
                </p>
              </div>

              {/* Footer status / button */}
              <div className="pt-3 border-t border-border-default flex items-center justify-between">
                <span className="text-[11.5px] font-bold text-text-tertiary">
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
                    <Check size={13} /> 已启用
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInstallSkill?.(skill);
                    }}
                    className="px-3.5 py-1.5 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12px] font-extrabold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                  >
                    <Plus size={14} /> ＋ 添加
                  </button>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
