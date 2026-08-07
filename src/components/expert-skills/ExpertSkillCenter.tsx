import React, { useState } from 'react';
import {
  SkillItem, MyCapabilityItem, MerchantRecommendation
} from './types';
import { mockSkills, initialMyCapabilities } from './mockData';

import { SkillHome } from './SkillHome';
import { MyCapabilities } from './MyCapabilities';
import { SkillEvalTab } from './SkillEvalTab';
import { SkillDetailDrawer } from './SkillDetailDrawer';
import { CreateSkillWorkbench } from './CreateSkillWorkbench';
import { ImportCapabilityModal } from './ImportCapabilityModal';

import {
  Search, Plus, ShieldCheck, ArrowLeft, Upload, Award, Wrench, X, Sparkles, SlidersHorizontal
} from 'lucide-react';

export const ExpertSkillCenter: React.FC = () => {
  // Navigation View: 'browse' (技能首页) | 'my' (我的技能)
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
  const [showEvalModal, setShowEvalModal] = useState<boolean>(false);

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
    <div className="w-full min-h-full bg-neutral-50/60 p-6 md:p-8 space-y-5 max-w-7xl mx-auto pb-16">
      {/* Primary Top Area (Header & Main Search & Quick Nav) */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
        {/* Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="space-y-0.5">
            <h1 className="text-[20px] font-black text-neutral-900 tracking-tight flex items-center gap-2">
              技能中心
            </h1>
            <p className="text-[12.5px] font-bold text-neutral-500">
              为当前商家添加AI可以自动调用的运营能力。
            </p>
          </div>

          {/* Quick Nav: "我的技能 5" & "添加技能" */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView(activeView === 'my' ? 'browse' : 'my')}
              className={`px-4 py-2 rounded-xl text-[12.5px] font-extrabold flex items-center gap-2 transition-all ${
                activeView === 'my'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200/80'
              }`}
            >
              <ShieldCheck size={16} />
              <span>我的技能</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeView === 'my' ? 'bg-neutral-800 text-neutral-200' : 'bg-white text-neutral-900 border border-neutral-200'
              }`}>
                {enabledCount}
              </span>
            </button>

            <button
              onClick={() => setShowAddSkillModal(true)}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <Plus size={16} /> 添加技能
            </button>
          </div>
        </div>

        {/* Top Search Bar (occupying main space) */}
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索技能名称或用途"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200/90 rounded-xl text-[13px] font-bold text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main View Area */}
      {activeView === 'browse' ? (
        <SkillHome
          skills={skills}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenDetail={sk => setSelectedSkillDetail(sk)}
          onInstallSkill={handleToggleInstallSkill}
          enabledSkillIds={enabledSkillIds}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('browse')}
              className="text-[12.5px] font-extrabold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} /> 返回技能中心
            </button>
          </div>

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
        </div>
      )}

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
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-2xs" onClick={() => setShowAddSkillModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-[16px] font-black text-neutral-900">技能管理与添加</h3>
                <p className="text-[12px] font-bold text-neutral-500 mt-0.5">选择技能添加方式或高级开发管理</p>
              </div>
              <button onClick={() => setShowAddSkillModal(false)} className="p-1 text-neutral-400 hover:text-neutral-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setActiveView('browse');
                }}
                className="w-full p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 rounded-2xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-neutral-900 text-[14px] block group-hover:text-black">从技能市场添加</span>
                  <span className="text-[12px] text-neutral-500 font-bold block mt-0.5">浏览已构建的爆款创作、评论筛选及关键词技能</span>
                </div>
                <Wrench size={18} className="text-neutral-400 group-hover:text-neutral-800 shrink-0" />
              </button>

              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setShowImportModal(true);
                }}
                className="w-full p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 rounded-2xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-neutral-900 text-[14px] block group-hover:text-black">导入技能规范包</span>
                  <span className="text-[12px] text-neutral-500 font-bold block mt-0.5">上传外部 ZIP 压缩包或 JSON 配置文件</span>
                </div>
                <Upload size={18} className="text-neutral-400 group-hover:text-neutral-800 shrink-0" />
              </button>

              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setShowCreateSkill(true);
                }}
                className="w-full p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 rounded-2xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-neutral-900 text-[14px] block group-hover:text-black">创建自定义技能</span>
                  <span className="text-[12px] text-neutral-500 font-bold block mt-0.5">自定义 AI Agent 执行动作、提示词与脚本逻辑</span>
                </div>
                <Plus size={18} className="text-neutral-400 group-hover:text-neutral-800 shrink-0" />
              </button>

              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setShowEvalModal(true);
                }}
                className="w-full p-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 rounded-2xl text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-black text-neutral-900 text-[14px] block group-hover:text-black">技能运行与评测</span>
                  <span className="text-[12px] text-neutral-500 font-bold block mt-0.5">用于开发者高级测试与沙盒演练（管理员）</span>
                </div>
                <Award size={18} className="text-neutral-400 group-hover:text-neutral-800 shrink-0" />
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

      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-2xs" onClick={() => setShowEvalModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[16px] font-black text-neutral-900">技能基准测试与运行评估</h3>
              <button onClick={() => setShowEvalModal(false)} className="p-1 text-neutral-400 hover:text-neutral-800">
                <X size={18} />
              </button>
            </div>
            <SkillEvalTab
              skills={skills}
              onOpenDetail={sk => setSelectedSkillDetail(sk)}
              onRunTest={sk => alert(`已为【${sk.name}】发起沙盒回归模拟`)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
