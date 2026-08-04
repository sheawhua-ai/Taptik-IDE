import React, { useState } from 'react';
import {
  SkillItem, MyCapabilityItem, MerchantRecommendation,
  AppScope, TabType
} from './types';
import { mockSkills, mockRecommendations, initialMyCapabilities } from './mockData';

import { SkillHome } from './SkillHome';
import { MyCapabilities } from './MyCapabilities';
import { SkillEvalTab } from './SkillEvalTab';
import { MerchantRecommendationSection } from './MerchantRecommendationSection';
import { SkillDetailDrawer } from './SkillDetailDrawer';
import { CreateSkillWorkbench } from './CreateSkillWorkbench';
import { ImportCapabilityModal } from './ImportCapabilityModal';

import {
  Bot, Wrench, ShieldCheck, Plus, Upload, Search, Sparkles, X,
  Terminal, Layers, History, Settings, CheckCircle2, Award, Activity
} from 'lucide-react';

export const ExpertSkillCenter: React.FC = () => {
  // Navigation Tabs (一级页面只保留: 技能库, 我的技能, 运行与评测)
  const [activeTab, setActiveTab] = useState<TabType>('skills');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Collections State
  const [skills, setSkills] = useState<SkillItem[]>(mockSkills);
  const [recommendations, setRecommendations] = useState<MerchantRecommendation[]>(mockRecommendations);
  const [myCapabilities, setMyCapabilities] = useState<MyCapabilityItem[]>(initialMyCapabilities);

  // Active Selected Item Drawers / Modals State
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<SkillItem | null>(null);

  // Workbench Modals
  const [showCreateSkill, setShowCreateSkill] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Usage Locations Modal
  const [usageLocationsSkill, setUsageLocationsSkill] = useState<SkillItem | null>(null);

  // Handlers for Recommendations
  const handleOpenRecDetail = (rec: MerchantRecommendation) => {
    const sk = skills.find(s => s.id === rec.targetId) || skills[0];
    setSelectedSkillDetail(sk);
  };

  const handleRunRecOnce = (rec: MerchantRecommendation) => {
    const sk = skills.find(s => s.id === rec.targetId) || skills[0];
    setSelectedSkillDetail(sk);
  };

  const handleApplyRecToMerchant = (rec: MerchantRecommendation) => {
    setRecommendations(recommendations.filter(r => r.id !== rec.id));
    alert(`已成功将技能契约【${rec.targetName}】配置到当前商家！`);
  };

  const handleDismissRec = (id: string, reason: string) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
  };

  // Handlers for Skills
  const handleInstallSkill = (skill: SkillItem) => {
    alert(`已将技能【${skill.name}】安装到“我的技能”，AI Agent 将在对应业务阶段自动调用。`);
  };

  const handleUseInProject = (skill: SkillItem) => {
    alert(`准备在当前进行中项目中调用技能【${skill.name}】：\n目标：${skill.goal}`);
  };

  const handleConfigAutoRun = (skill: SkillItem) => {
    alert(`已为技能【${skill.name}】打开自动运行规则配置界面。`);
  };

  const handleToggleSkillStatus = (skill: SkillItem) => {
    alert(`技能【${skill.name}】状态已更新。`);
  };

  const handleSkillCreated = (newSkill: SkillItem) => {
    setSkills([newSkill, ...skills]);
  };

  const handleImportComplete = (importedSkill: SkillItem) => {
    setSkills([importedSkill, ...skills]);
    alert(`已导入【${importedSkill.name}】契约包！`);
  };

  return (
    <div className="w-full min-h-full bg-neutral-50/60 p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-16">
      {/* Primary Page Header & Subtitle - Concise */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-[20px] font-black text-neutral-900 tracking-tight">
            技能中心
          </h1>
          <p className="text-[13px] font-medium text-neutral-500">
            技能由 AI Agent 在各个运营阶段自动调用。您可在此浏览、安装或创建技能。
          </p>
        </div>

        {/* Action Buttons: 新建技能 & 导入能力包 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateSkill(true)}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus size={15} /> 新建技能
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-[12.5px] rounded-xl border border-neutral-200 flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
            title="通过外部 JSON 导入能力包"
          >
            <Upload size={15} /> 导入技能
          </button>
        </div>
      </div>

      {/* Recommendation Section above Tabs */}
      <MerchantRecommendationSection
        recommendations={recommendations}
        onOpenDetail={handleOpenRecDetail}
        onRunOnce={handleRunRecOnce}
        onAddToMerchant={handleApplyRecToMerchant}
        onDismiss={handleDismissRec}
      />

      {/* Primary Navigation Tabs: 一级页面只保留：技能库、我的技能、运行与评测 */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-px">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-3 text-[14px] font-extrabold flex items-center gap-2 transition-all relative border-b-2 ${
              activeTab === 'skills'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Wrench size={18} />
            <span>技能库 ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my')}
            className={`px-5 py-3 text-[14px] font-extrabold flex items-center gap-2 transition-all relative border-b-2 ${
              activeTab === 'my'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShieldCheck size={18} />
            <span>我的技能 ({myCapabilities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('eval')}
            className={`px-5 py-3 text-[14px] font-extrabold flex items-center gap-2 transition-all relative border-b-2 ${
              activeTab === 'eval'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Award size={18} className="text-amber-500" />
            <span>运行与评测</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
              管理员可见
            </span>
          </button>
        </div>
      </div>

      {/* Tab Pages Body */}
      {activeTab === 'skills' && (
        <SkillHome
          skills={skills}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          recommendations={recommendations}
          onOpenDetail={sk => setSelectedSkillDetail(sk)}
          onTestSkill={sk => setSelectedSkillDetail(sk)}
          onOpenCreateSkill={() => setShowCreateSkill(true)}
          onOpenRecDetail={handleOpenRecDetail}
          onRunRecOnce={handleRunRecOnce}
          onApplyRecToMerchant={handleApplyRecToMerchant}
          onDismissRec={handleDismissRec}
          onInstallSkill={handleInstallSkill}
          onAddSkillToExpert={handleInstallSkill}
          onOpenUsageLocations={sk => setUsageLocationsSkill(sk)}
          onUseInProject={handleUseInProject}
          onConfigAutoRun={handleConfigAutoRun}
        />
      )}

      {activeTab === 'my' && (
        <MyCapabilities
          capabilities={myCapabilities}
          onOpenSkillDetail={sk => setSelectedSkillDetail(sk)}
          onTestSkill={sk => setSelectedSkillDetail(sk)}
          onUseInProject={handleUseInProject}
          onConfigAutoRun={handleConfigAutoRun}
          onToggleDisable={item => alert(`已更新【${item.name}】状态`)}
        />
      )}

      {activeTab === 'eval' && (
        <SkillEvalTab
          skills={skills}
          onOpenDetail={sk => setSelectedSkillDetail(sk)}
          onRunTest={sk => alert(`正在对【${sk.name}】执行基准回归集评测`)}
        />
      )}

      {/* 2. Skill Detail Drawer */}
      <SkillDetailDrawer
        skill={selectedSkillDetail}
        onClose={() => setSelectedSkillDetail(null)}
        onTestSkill={sk => alert(`对【${sk.name}】运行本地演练测试`)}
        onInstallSkill={handleInstallSkill}
        onUseInProject={handleUseInProject}
        onConfigAutoRun={handleConfigAutoRun}
        onCopyAndEdit={sk => setShowCreateSkill(true)}
        onExportSkill={sk => alert(`已将【${sk.name}】导出为 JSON 文件`)}
        onToggleStatus={handleToggleSkillStatus}
      />

      {/* 4. Workbenches */}
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

      {/* 5. Usage Locations Modal */}
      {usageLocationsSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setUsageLocationsSkill(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[15px] font-extrabold text-neutral-900">技能【{usageLocationsSkill.name}】使用位置</h3>
              <button onClick={() => setUsageLocationsSkill(null)} className="p-1 text-neutral-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-[12.5px]">
              <span className="text-neutral-500 font-extrabold block">调用此技能的项目：</span>
              <ul className="space-y-1 text-neutral-800 font-bold pl-2">
                <li>• 皇家宠物食品幼猫换粮抗应激项目</li>
                <li>• 全局合规检测调度链</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
