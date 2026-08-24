import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  SkillItem, MyCapabilityItem, MerchantRecommendation
} from './types';
import { mockSkills, initialMyCapabilities } from './mockData';

import { SkillHome } from './SkillHome';
import { MyCapabilities } from './MyCapabilities';
import { SkillDetailDrawer } from './SkillDetailDrawer';
import { CreateSkillWorkbench } from './CreateSkillWorkbench';
import { ImportCapabilityModal } from './ImportCapabilityModal';

import {
  Search, Plus, ShieldCheck, ArrowLeft, Upload, Wrench, X, Sparkles, SlidersHorizontal
} from 'lucide-react';

export const ExpertSkillCenter: React.FC = () => {
  // Navigation View: 'browse' (技能市场) | 'my' (我的技能)
  const [activeView, setActiveView] = useState<'browse' | 'my'>('browse');

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Collections State
  const [skills, setSkills] = useState<SkillItem[]>(mockSkills);
  const [myCapabilities, setMyCapabilities] = useState<MyCapabilityItem[]>(initialMyCapabilities);
  const [enabledSkillIds, setEnabledSkillIds] = useState<Record<string, boolean>>({
    sk_comment_intent: false,
    sk_xhs_keyword: true,
    sk_xhs_writer: true,
    sk_solo_matrix: true,
    sk_cover_audit: true,
    sk_publish_check: true
  });

  // Active Selected Item Drawer
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<SkillItem | null>(null);

  // Manage / Add Skills Modal State
  const [showAddSkillModal, setShowAddSkillModal] = useState<boolean>(false);
  const [showCreateSkill, setShowCreateSkill] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Handlers
  const handleToggleInstallSkill = (skill: SkillItem) => {
    const isCurrentlyEnabled = !!enabledSkillIds[skill.id];
    const newStatus = !isCurrentlyEnabled;

    setEnabledSkillIds(prev => ({ ...prev, [skill.id]: newStatus }));

    if (newStatus) {
      // Add to my capabilities if not present
      if (!myCapabilities.some(c => c.refData?.id === skill.id || c.name === skill.name)) {
        const newCapability: MyCapabilityItem = {
          id: `my_${skill.id}`,
          name: skill.name,
          type: 'skill',
          appScope: 'merchant',
          status: skill.status === 'needs_config' ? 'needs_config' : 'enabled',
          lastUsed: '刚才',
          lastResult: '已添加到当前商家，支持 Agent 自动调用',
          pendingConfirmCount: 0,
          usedByExpertsOrProjects: ['幼猫换粮抗应激项目'],
          refData: skill
        };
        setMyCapabilities(prev => [newCapability, ...prev]);
      }
    } else {
      // Remove from my capabilities
      setMyCapabilities(prev => prev.filter(c => c.refData?.id !== skill.id && c.name !== skill.name));
    }
  };

  const handleSkillCreated = (newSkill: SkillItem) => {
    setSkills([newSkill, ...skills]);
    setEnabledSkillIds(prev => ({ ...prev, [newSkill.id]: true }));
    setShowCreateSkill(false);
  };

  const handleImportComplete = (importedSkill: SkillItem) => {
    setSkills([importedSkill, ...skills]);
    setShowImportModal(false);
  };

  const enabledCount = Object.values(enabledSkillIds).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-page-bg text-text-main overflow-hidden">
      {/* Title & Top Action Header */}
      <div className="bg-surface-1 border-b border-border-default shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-semibold text-text-main tracking-tight">
                技能中心
              </h1>
            </div>
            <p className="text-[12px] text-text-secondary mt-0.5">
              为当前商家添加 AI 自动调用的运营技能 · 支持自动化排期与能力拓展
            </p>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12.5px] font-medium transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus size={15} /> 添加技能
            </button>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="h-13 px-8 flex items-center justify-between border-t border-border-default bg-surface-1">
          <div className="flex items-center gap-8 h-full">
            {[
              { id: 'browse', label: '技能市场' },
              { id: 'my', label: '我的技能', count: enabledCount }
            ].map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`relative h-full flex items-center gap-2 px-1 text-[14px] transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-text-main font-semibold'
                      : 'text-text-secondary hover:text-text-main font-medium'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white font-medium'
                        : 'bg-surface-1 text-text-tertiary border border-border-default'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="skillTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-5">
        {/* Search Bar for browse view */}
        {activeView === 'browse' && (
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="搜索技能名称或用途"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-page-bg border border-border-default rounded-xl text-[13px] font-normal text-text-main placeholder:text-text-tertiary focus:outline-none focus:border-neutral-900 focus:bg-surface-1 transition-all"
            />
          </div>
        )}

      {/* Main View Area */}
      {activeView === 'browse' && (
        <SkillHome
          skills={skills}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenDetail={sk => setSelectedSkillDetail(sk)}
          onInstallSkill={handleToggleInstallSkill}
          enabledSkillIds={enabledSkillIds}
        />
      )}

      {activeView === 'my' && (
        <MyCapabilities
          capabilities={myCapabilities}
          onOpenSkillDetail={sk => setSelectedSkillDetail(sk)}
          onToggleDisable={item => {
            const matchingSkill = skills.find(s => s.name === item.name);
            if (matchingSkill) {
              handleToggleInstallSkill(matchingSkill);
            }
          }}
        />
      )}
      </div>

      {/* Detail Drawer */}
      <SkillDetailDrawer
        skill={selectedSkillDetail}
        onClose={() => setSelectedSkillDetail(null)}
        onInstallSkill={handleToggleInstallSkill}
        isAdded={selectedSkillDetail ? !!enabledSkillIds[selectedSkillDetail.id] : false}
      />

      {/* "添加技能" Management Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-btn-main/40 backdrop-blur-2xs" onClick={() => setShowAddSkillModal(false)} />
          <div className="relative w-full max-w-lg bg-surface-1 rounded-xl shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div>
                <h3 className="text-[16px] font-black text-text-main">技能管理与添加</h3>
                <p className="text-[12px] font-bold text-text-tertiary mt-0.5">选择技能添加方式或高级开发管理</p>
              </div>
              <button onClick={() => setShowAddSkillModal(false)} className="p-1 text-text-tertiary hover:text-text-main">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setActiveView('browse');
                }}
                className="w-full p-4 bg-page-bg hover:bg-hover-bg border border-border-default/90 rounded-xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-text-main text-[14px] block group-hover:text-black">从技能市场添加</span>
                  <span className="text-[12px] text-text-tertiary font-bold block mt-0.5">浏览已构建的爆款创作、评论筛选及关键词技能</span>
                </div>
                <Wrench size={18} className="text-text-tertiary group-hover:text-text-main shrink-0" />
              </button>

              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setShowImportModal(true);
                }}
                className="w-full p-4 bg-page-bg hover:bg-hover-bg border border-border-default/90 rounded-xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-text-main text-[14px] block group-hover:text-black">导入技能规范包</span>
                  <span className="text-[12px] text-text-tertiary font-bold block mt-0.5">上传外部 ZIP 压缩包或 JSON 配置文件</span>
                </div>
                <Upload size={18} className="text-text-tertiary group-hover:text-text-main shrink-0" />
              </button>

              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setShowCreateSkill(true);
                }}
                className="w-full p-4 bg-page-bg hover:bg-hover-bg border border-border-default/90 rounded-xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-text-main text-[14px] block group-hover:text-black">创建自定义技能</span>
                  <span className="text-[12px] text-text-tertiary font-bold block mt-0.5">自定义 AI Agent 执行动作、提示词与脚本逻辑</span>
                </div>
                <Plus size={18} className="text-text-tertiary group-hover:text-text-main shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workbenches & Sub-modals */}
      {showCreateSkill && (
        <CreateSkillWorkbench
          onClose={() => setShowCreateSkill(false)}
          onSkillCreated={handleSkillCreated}
        />
      )}

      {showImportModal && (
        <ImportCapabilityModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
};
