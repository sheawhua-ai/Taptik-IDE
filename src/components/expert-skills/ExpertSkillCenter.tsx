import React, { useState } from 'react';
import {
  ExpertItem, SkillItem, MyCapabilityItem, MerchantRecommendation,
  AppScope, TabType
} from './types';
import { mockExperts, mockSkills, mockRecommendations, initialMyCapabilities } from './mockData';

import { ExpertHome } from './ExpertHome';
import { SkillHome } from './SkillHome';
import { MyCapabilities } from './MyCapabilities';
import { ExpertDetailDrawer } from './ExpertDetailDrawer';
import { SkillDetailDrawer } from './SkillDetailDrawer';
import { Workstation } from './Workstation';
import { ApplicationScopeModal } from './ApplicationScopeModal';
import { CreateExpertWorkbench } from './CreateExpertWorkbench';
import { CreateSkillWorkbench } from './CreateSkillWorkbench';
import { ImportCapabilityModal } from './ImportCapabilityModal';

import {
  Bot, Wrench, ShieldCheck, Plus, Upload, Search, Sparkles, X,
  Terminal, Layers, History, Settings, CheckCircle2
} from 'lucide-react';

export const ExpertSkillCenter: React.FC = () => {
  // Navigation Tabs (Requirement 2: 专家, 技能, 我的能力)
  const [activeTab, setActiveTab] = useState<TabType>('experts');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Collections State
  const [experts, setExperts] = useState<ExpertItem[]>(mockExperts);
  const [skills, setSkills] = useState<SkillItem[]>(mockSkills);
  const [recommendations, setRecommendations] = useState<MerchantRecommendation[]>(mockRecommendations);
  const [myCapabilities, setMyCapabilities] = useState<MyCapabilityItem[]>(initialMyCapabilities);

  // Active Selected Item Drawers / Modals State
  const [selectedExpertDetail, setSelectedExpertDetail] = useState<ExpertItem | null>(null);
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<SkillItem | null>(null);
  const [activeWorkstationExpert, setActiveWorkstationExpert] = useState<ExpertItem | null>(null);
  const [adjustScopeItem, setAdjustScopeItem] = useState<ExpertItem | SkillItem | null>(null);

  // Workbench Modals
  const [showCreateExpert, setShowCreateExpert] = useState<boolean>(false);
  const [showCreateSkill, setShowCreateSkill] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Usage Locations Modal & Logs Modal
  const [usageLocationsSkill, setUsageLocationsSkill] = useState<SkillItem | null>(null);
  const [runLogsExpert, setRunLogsExpert] = useState<ExpertItem | null>(null);

  // Handlers for Recommendations
  const handleOpenRecDetail = (rec: MerchantRecommendation) => {
    if (rec.type === 'expert') {
      const exp = experts.find(e => e.id === rec.targetId) || experts[0];
      setSelectedExpertDetail(exp);
    } else {
      const sk = skills.find(s => s.id === rec.targetId) || skills[0];
      setSelectedSkillDetail(sk);
    }
  };

  const handleRunRecOnce = (rec: MerchantRecommendation) => {
    if (rec.type === 'expert') {
      const exp = experts.find(e => e.id === rec.targetId) || experts[0];
      setActiveWorkstationExpert(exp);
    } else {
      const sk = skills.find(s => s.id === rec.targetId) || skills[0];
      setSelectedSkillDetail(sk);
    }
  };

  const handleApplyRecToMerchant = (rec: MerchantRecommendation) => {
    setRecommendations(recommendations.filter(r => r.id !== rec.id));
    alert(`已成功将【${rec.targetName}】加入当前商家“皇家宠物食品”！`);
  };

  const handleDismissRec = (id: string, reason: string) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
  };

  // Handlers for Experts
  const handleStartExpertTask = (expert: ExpertItem) => {
    setActiveWorkstationExpert(expert);
  };

  const handleToggleExpertStatus = (expert: ExpertItem) => {
    const nextStatus = expert.status === 'disabled' ? 'enabled' : 'disabled';
    setExperts(experts.map(e => e.id === expert.id ? { ...e, status: nextStatus } : e));
  };

  // Handlers for Skills
  const handleInstallSkill = (skill: SkillItem) => {
    alert(`已将技能【${skill.name}】安装到本地（当前为已安装未启用，可在我的能力中进行配置）。`);
  };

  const handleAddSkillToExpert = (skill: SkillItem) => {
    setSelectedExpertDetail(experts[0]);
  };

  const handleToggleSkillStatus = (skill: SkillItem) => {
    alert(`技能【${skill.name}】状态已更新。`);
  };

  // Created handlers
  const handleExpertCreated = (newExpert: ExpertItem) => {
    setExperts([newExpert, ...experts]);
    setMyCapabilities([
      {
        id: `my_exp_${Date.now()}`,
        type: 'expert',
        name: newExpert.name,
        status: 'enabled',
        appScope: 'merchant',
        lastUsed: '刚才创建',
        lastResult: '已通过演练',
        refData: newExpert
      },
      ...myCapabilities
    ]);
  };

  const handleSkillCreated = (newSkill: SkillItem) => {
    setSkills([newSkill, ...skills]);
  };

  const handleImportComplete = (importedSkill: SkillItem) => {
    setSkills([importedSkill, ...skills]);
    alert(`已导入【${importedSkill.name}】！初始状态为：已安装但未启用。`);
  };

  // Render Full Screen Workstation if an expert task is launched
  if (activeWorkstationExpert) {
    return (
      <Workstation
        expert={activeWorkstationExpert}
        onClose={() => setActiveWorkstationExpert(null)}
        onOpenScopeModal={exp => setAdjustScopeItem(exp)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/60 p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Primary Page Header & Subtitle (Requirement 2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-neutral-900 text-white rounded-2xl shadow-2xs">
              <Bot size={22} />
            </div>
            <h1 className="text-[22px] font-black text-neutral-900 tracking-tight">
              运营能力中心
            </h1>
          </div>
          {/* Subtitle (Requirement 2) */}
          <p className="text-[13.5px] font-bold text-neutral-500 pl-1">
            用专家组织完整任务，用技能扩展每一步的执行能力。
          </p>
        </div>

        {/* Action Buttons: 新建专家, 新建技能, 导入能力包 (Requirement 2 & 16) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCreateExpert(true)}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-[13px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> 新建专家
          </button>

          <button
            onClick={() => setShowCreateSkill(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-[13px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> 新建技能
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-extrabold text-[13px] rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Upload size={16} /> 导入能力包
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs (Requirement 2: 专家, 技能, 我的能力) */}
      <div className="flex items-center gap-3 border-b border-neutral-200/80 pb-px">
        <button
          onClick={() => setActiveTab('experts')}
          className={`px-5 py-3 text-[14px] font-extrabold flex items-center gap-2 transition-all relative border-b-2 ${
            activeTab === 'experts'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Bot size={18} />
          <span>专家 ({experts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-5 py-3 text-[14px] font-extrabold flex items-center gap-2 transition-all relative border-b-2 ${
            activeTab === 'skills'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Wrench size={18} />
          <span>技能 ({skills.length})</span>
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
          <span>我的能力 ({myCapabilities.length})</span>
        </button>
      </div>

      {/* Tab Pages Body */}
      {activeTab === 'experts' && (
        <ExpertHome
          experts={experts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          recommendations={recommendations}
          onOpenDetail={exp => setSelectedExpertDetail(exp)}
          onStartTask={handleStartExpertTask}
          onOpenCreateExpert={() => setShowCreateExpert(true)}
          onOpenRecDetail={handleOpenRecDetail}
          onRunRecOnce={handleRunRecOnce}
          onApplyRecToMerchant={handleApplyRecToMerchant}
          onDismissRec={handleDismissRec}
          onModifyConfig={exp => setSelectedExpertDetail(exp)}
          onOpenRunLogs={exp => setRunLogsExpert(exp)}
          onAdjustScope={exp => setAdjustScopeItem(exp)}
          onToggleStatus={handleToggleExpertStatus}
        />
      )}

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
          onAddSkillToExpert={handleAddSkillToExpert}
          onOpenUsageLocations={sk => setUsageLocationsSkill(sk)}
        />
      )}

      {activeTab === 'my' && (
        <MyCapabilities
          capabilities={myCapabilities}
          onStartExpertTask={handleStartExpertTask}
          onOpenExpertDetail={exp => setSelectedExpertDetail(exp)}
          onOpenSkillDetail={sk => setSelectedSkillDetail(sk)}
          onTestSkill={sk => setSelectedSkillDetail(sk)}
          onOpenUsageLocations={sk => setUsageLocationsSkill(sk)}
          onModifyConfig={item => setAdjustScopeItem(item.refData)}
          onAdjustScope={item => setAdjustScopeItem(item.refData)}
          onToggleDisable={item => alert(`已更新【${item.name}】状态`)}
        />
      )}

      {/* Drawers & Modals */}
      {/* 1. Expert Detail Drawer */}
      <ExpertDetailDrawer
        expert={selectedExpertDetail}
        onClose={() => setSelectedExpertDetail(null)}
        onStartTask={handleStartExpertTask}
        onAdjustSkills={exp => alert(`修改【${exp.name}】绑定技能`)}
        onAdjustScope={exp => setAdjustScopeItem(exp)}
        onEditExpert={exp => setShowCreateExpert(true)}
        onToggleStatus={handleToggleExpertStatus}
      />

      {/* 2. Skill Detail Drawer */}
      <SkillDetailDrawer
        skill={selectedSkillDetail}
        onClose={() => setSelectedSkillDetail(null)}
        onTestSkill={sk => alert(`对【${sk.name}】运行本地试用`)}
        onInstallSkill={handleInstallSkill}
        onAddToExpert={handleAddSkillToExpert}
        onCopyAndEdit={sk => setShowCreateSkill(true)}
        onExportSkill={sk => alert(`已将【${sk.name}】导出为 JSON 文件`)}
        onToggleStatus={handleToggleSkillStatus}
      />

      {/* 3. Scope Adjustment Modal */}
      <ApplicationScopeModal
        item={adjustScopeItem}
        onClose={() => setAdjustScopeItem(null)}
        onConfirmScope={newScope => {
          if (adjustScopeItem) {
            setExperts(experts.map(e => e.id === adjustScopeItem.id ? { ...e, appScope: newScope } : e));
          }
        }}
      />

      {/* 4. Workbenches */}
      {showCreateExpert && (
        <CreateExpertWorkbench
          onClose={() => setShowCreateExpert(false)}
          onExpertCreated={handleExpertCreated}
        />
      )}

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
              <span className="text-neutral-500 font-extrabold block">绑定专家：</span>
              <ul className="space-y-1 text-neutral-800 font-bold pl-2">
                <li>• 违规文案排查专家</li>
                <li>• 小红书竞品拆解专家</li>
              </ul>
              <span className="text-neutral-500 font-extrabold block pt-2">参与项目：</span>
              <ul className="space-y-1 text-neutral-800 font-bold pl-2">
                <li>• 皇家宠物食品幼猫换粮项目</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 6. Run Logs Modal */}
      {runLogsExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setRunLogsExpert(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[15px] font-extrabold text-neutral-900">专家【{runLogsExpert.name}】任务历史记录</h3>
              <button onClick={() => setRunLogsExpert(null)} className="p-1 text-neutral-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
              {runLogsExpert.runLogs?.map(log => (
                <div key={log.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-neutral-900">
                    <span>{log.projectName}</span>
                    <span className="text-neutral-400 font-normal">{log.timestamp}</span>
                  </div>
                  <p className="text-neutral-700">{log.resultSummary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
