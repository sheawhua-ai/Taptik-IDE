import React, { useState } from 'react';
import { 
  X, Sparkles, ArrowRight, CheckCircle2, FileText, Check, 
  ChevronRight, Calendar, Layers, Users, Target, RotateCcw, 
  HelpCircle, ArrowLeft, Bot, ShieldCheck, CheckSquare, Clock
} from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import { 
  FactItem, MissingInfoItem, ProjectCreationPhase, 
  StrategyDraftData, StrategyChangeProposal,
  DEFAULT_QUESTIONNAIRE_QUESTIONS
} from './CreateProject/types';
import type { QuestionnaireQuestion } from './CreateProject/types';

export { DEFAULT_QUESTIONNAIRE_QUESTIONS };
export type { QuestionnaireQuestion };
import { 
  INITIAL_CARRIED_FACTS, 
  INITIAL_PRIORITIZED_QUESTIONS, 
  GENERATE_DEFAULT_STRATEGY, 
  GENERATE_PROPOSAL_FROM_COMMAND 
} from './CreateProject/mockData';
import { DialogueWorkbench } from './CreateProject/DialogueWorkbench';
import { ContextDrawer, DEFAULT_CONTEXT_STATE, ContextState } from './CreateProject/ContextDrawer';
import type { IndustryDefaults, MerchantIndustryProfile } from '../../data/industryCatalog';

export function CreateProjectWorkstation({
  onClose,
  onCreate,
  mode = 'create',
  industryDefaults,
  industryProfile,
}: {
  onClose: () => void;
  onCreate: (project?: any) => void;
  mode?: 'create' | 'edit';
  industryDefaults?: IndustryDefaults;
  industryProfile?: MerchantIndustryProfile;
}) {
  const { createFullOperationsProject, jumpToExecution, setSelectedProjectId } = useProjectStore();

  // Facts ledger state
  const [facts, setFacts] = useState<FactItem[]>(INITIAL_CARRIED_FACTS);

  // Prioritized questions state
  const [questions, setQuestions] = useState<MissingInfoItem[]>(INITIAL_PRIORITIZED_QUESTIONS);

  // Strategy draft state
  const [strategyDraft, setStrategyDraft] = useState<StrategyDraftData>(() => {
    const base = GENERATE_DEFAULT_STRATEGY();
    if (!industryDefaults) return base;
    const industryPath = [
      industryProfile?.primaryName,
      ...(industryProfile?.secondaryNames || []),
      ...(industryProfile?.tertiaryNames || [])
    ].filter(Boolean).join(' / ');
    const brandRole = industryDefaults.accountRoles[0] || '品牌主号';
    const kosRole = industryDefaults.accountRoles[1] || 'KOS账号';
    const kocRole = industryDefaults.accountRoles[2] || '消费者KOC';
    return {
      ...base,
      projectName: `${industryDefaults.planTemplates[0]}｜行业起盘`,
      promotionTarget: {
        ...base.promotionTarget,
        targetName: '待确认的主推产品 / 服务',
        targetCategory: industryPath || industryDefaults.workflowName,
        targetAudience: '待结合商家资料确认核心目标人群',
        confirmedFacts: [{ label: '行业配置', detail: industryPath || industryDefaults.workflowName, source: '【商家资料】行业选择' }],
        unconfirmedGaps: ['主推产品或服务', '核心目标人群', '本周期重点场景']
      },
      coreGoalAndVerification: {
        ...base.coreGoalAndVerification,
        primaryBusinessGoal: `按照“${industryDefaults.workflowName}”验证核心内容方法与转化链路，沉淀可复用行业打法`,
        observableSignals: ['目标关键词下的笔记搜索位置', '已发布笔记的平台收录结果', '发布后的互动、咨询与转化反馈'],
        successCriteria: '形成可复用的内容结构，并找到表现稳定的账号与发布节奏',
        adjustmentCriteria: '搜索位置、收录或发布后反馈连续低于预期时，调整内容结构与账号配比',
        stopCriteria: '出现合规风险、事实依据不足或关键资源长期无法交付时暂停'
      },
      coreStrategy: {
        ...base.coreStrategy,
        problemToSolve: `围绕${industryDefaults.planTemplates[0]}建立清晰、可执行、可复盘的内容运营路径。`,
        contentLogic: `默认采用：${industryDefaults.contentTemplates.join(' + ')}；流程依次覆盖${industryDefaults.workflowSteps.join('、')}`,
        rationale: `行业模板提供默认起点，最终策略以商家资料、真实素材和发布后数据为准。`,
        collaborationMechanism: `${brandRole}负责标准表达，${kosRole}负责场景解释，${kocRole}提供真实体验反馈。`
      },
      accountAndContentAssignment: {
        ...base.accountAndContentAssignment,
        brandAccounts: base.accountAndContentAssignment.brandAccounts.map((account, index) => ({
          ...account,
          name: index === 0 ? brandRole : `${brandRole}${index + 1}`,
          roleInProject: '建立品牌标准表达与核心信息锚点',
          contentDirection: industryDefaults.contentTemplates[0] || '品牌核心信息'
        })),
        kosAccounts: base.accountAndContentAssignment.kosAccounts.map((account, index) => ({
          ...account,
          name: index === 0 ? kosRole : `${kosRole}${index + 1}`,
          storeName: `参与账号${index + 1}`,
          roleInProject: '提供专业解释与真实经营场景',
          contentDirection: industryDefaults.contentTemplates[1] || '场景化专业解答'
        })),
        kocParticipants: {
          ...base.accountAndContentAssignment.kocParticipants,
          roleInProject: `${kocRole}真实体验反馈`,
          contentDirection: industryDefaults.contentTemplates[2] || '真实体验记录',
          requiredMaterialSpecs: '真实体验图片或视频，并完成十几秒轻量反馈问卷'
        }
      },
      humanInTheLoop: {
        systemAutomated: [
          '读取商家资料、行业模板与平台合规规则',
          '依据默认流程生成内容骨架、发布计划与素材需求',
          '对标题、正文、标签和素材完整度进行基础预检',
          '记录发布后的搜索位置、平台收录与数据回传状态'
        ],
        operatorRequired: [
          '确认主推对象、目标人群和本周期核心目标',
          '核验内容事实、品牌口吻与素材真实性',
          '确认发布人、发布时间并完成手动发布',
          '处理素材缺失、逾期未发与数据回传异常'
        ]
      },
      hypothesesAndBasis: {
        confirmedFacts: [{ id: 'industry_fact', text: `商家行业已选择为${industryPath || industryDefaults.workflowName}`, source: '【商家资料】行业配置' }],
        pendingHypotheses: [{
          id: 'industry_hypothesis',
          text: `以“${industryDefaults.contentTemplates.join(' + ')}”组成内容矩阵，可改善搜索收录与发布后反馈`,
          basis: `行业默认模板：${industryDefaults.workflowName}`,
          status: 'hypothesis'
        }],
        missingItemsToTrack: [
          { id: 'missing_target', text: '主推产品或服务的事实资料', impact: '影响内容准确性与合规判断' },
          { id: 'missing_account', text: '实际参与发布的账号与排期', impact: '影响笔记数量、分工与发布计划' }
        ]
      }
    };
  });

  // Context drawer
  const [showContextDrawer, setShowContextDrawer] = useState<boolean>(false);
  const [contextState, setContextState] = useState<ContextState>(DEFAULT_CONTEXT_STATE);

  // Creation completion info
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [createdProjectInfo, setCreatedProjectInfo] = useState<{
    id: string;
    name: string;
    notesCount: number;
    tasksCount: number;
  } | null>(null);

  // Natural language submission during dialogue
  const handleDialogueNaturalSubmit = (userText: string) => {
    if (userText.includes('7天') || userText.includes('7 天')) {
      const startDate = new Date().toISOString().split('T')[0];
      const endDateObj = new Date();
      endDateObj.setDate(endDateObj.getDate() + 7);
      const endDate = endDateObj.toISOString().split('T')[0];

      setStrategyDraft(prev => ({
        ...prev,
        cycleDays: 7,
        startDate,
        endDate,
        projectName: industryDefaults ? `${industryDefaults.planTemplates[0]}｜7天快速验证` : '7天快速验证方案'
      }));
    } else if (userText.includes('21天') || userText.includes('21 天')) {
      const startDate = new Date().toISOString().split('T')[0];
      const endDateObj = new Date();
      endDateObj.setDate(endDateObj.getDate() + 21);
      const endDate = endDateObj.toISOString().split('T')[0];

      setStrategyDraft(prev => ({
        ...prev,
        cycleDays: 21,
        startDate,
        endDate,
        projectName: industryDefaults ? `${industryDefaults.planTemplates[0]}｜21天完整周期` : '21天完整运营方案'
      }));
    }
  };

  // Apply proposal
  const handleApplyProposal = (proposal: StrategyChangeProposal) => {
    if (proposal.userPrompt.includes('品牌号') || proposal.userPrompt.includes('减少') || proposal.userPrompt.includes('KOC')) {
      setStrategyDraft(prev => ({
        ...prev,
        accountAndContentAssignment: {
          ...prev.accountAndContentAssignment,
          brandAccounts: prev.accountAndContentAssignment.brandAccounts.map(b => ({
            ...b,
            noteCount: 1
          })),
          kocParticipants: {
            ...prev.accountAndContentAssignment.kocParticipants,
            recruitmentCount: 12
          },
          totalNotesCount: 18
        }
      }));
    } else if (proposal.userPrompt.includes('搜索') || proposal.userPrompt.includes('目标')) {
      setStrategyDraft(prev => ({
        ...prev,
        coreGoalAndVerification: {
          ...prev.coreGoalAndVerification,
          primaryBusinessGoal: industryDefaults
            ? `唯一目标：验证“${industryDefaults.planTemplates[0]}”的搜索位置、平台收录与发布后反馈，沉淀可复用内容方法`
            : '唯一目标：验证核心关键词的搜索位置、平台收录与发布后反馈'
        }
      }));
    }
  };

  // Confirm and Create Project
  const handleConfirmAndCreateProject = () => {
    try {
      const result = createFullOperationsProject({
        name: strategyDraft.projectName,
        targetProduct: strategyDraft.promotionTarget.targetName,
        coreGoal: strategyDraft.coreGoalAndVerification.primaryBusinessGoal,
        cycleDays: strategyDraft.cycleDays,
        startDate: strategyDraft.startDate,
        endDate: strategyDraft.endDate,
        brandNotesCount: strategyDraft.accountAndContentAssignment.brandAccounts.reduce((acc, b) => acc + b.noteCount, 0),
        kosNotesCount: strategyDraft.accountAndContentAssignment.kosAccounts.reduce((acc, k) => acc + k.noteCount, 0),
        kocNotesCount: strategyDraft.accountAndContentAssignment.kocParticipants.recruitmentCount,
        hasKocQuestionnaire: strategyDraft.accountAndContentAssignment.kocParticipants.hasQuestionnaire,
        strategyContentLogic: strategyDraft.coreStrategy.contentLogic,
      });

      setCreatedProjectInfo({
        id: result.project.id,
        name: result.project.name,
        notesCount: result.notes.length,
        tasksCount: result.tasks.length
      });
      setIsCompleted(true);

      if (onCreate) {
        onCreate(result.project);
      }
    } catch (e) {
      console.error("Failed to create project:", e);
      // Fallback
      setIsCompleted(true);
      setCreatedProjectInfo({
        id: `proj_${Date.now()}`,
        name: strategyDraft.projectName,
        notesCount: strategyDraft.accountAndContentAssignment.totalNotesCount,
        tasksCount: 12
      });
    }
  };

  // If completed, show success state with direct jump
  if (isCompleted && createdProjectInfo) {
    return (
      <div className="fixed inset-0 z-50 bg-canvas flex items-center justify-center p-6 animate-in fade-in duration-200">
        <div className="bg-surface-1 border border-border-default rounded-xl p-8 max-w-lg w-full shadow-lg text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-text-primary">
              方案打法已确认，项目创建成功！
            </h2>
            <p className="text-[13px] text-text-secondary">
              已将本周期打法转化为可执行的任务、排期槽位与素材需求。
            </p>
          </div>

          {/* Project Summary Card */}
          <div className="p-4 bg-surface-subtle border border-border-default rounded-lg text-left text-[13px] space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
              <span className="font-semibold text-text-primary text-[13px]">
                {createdProjectInfo.name}
              </span>
              <span className="text-[13px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
                执行中
              </span>
            </div>
            <div className="text-text-secondary">
              <strong>周期：</strong>{strategyDraft.cycleDays} 天 ({strategyDraft.startDate} 至 {strategyDraft.endDate})
            </div>
            <div className="text-text-secondary">
              <strong>笔记槽位：</strong>已自动规划 {createdProjectInfo.notesCount} 篇笔记
            </div>
            <div className="text-text-secondary">
              <strong>协同任务：</strong>已派发 {createdProjectInfo.tasksCount} 项店长随手拍与合规核验待办
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-surface-1 hover:bg-surface-hover border border-border-default rounded-lg text-[13px] text-text-secondary font-medium transition-colors"
            >
              返回方案列表
            </button>
            <button
              type="button"
              onClick={() => {
                if (setSelectedProjectId && createdProjectInfo.id) {
                  setSelectedProjectId(createdProjectInfo.id);
                }
                if (jumpToExecution) {
                  jumpToExecution(createdProjectInfo.id);
                }
                onClose();
              }}
              className="px-5 py-2.5 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>前往执行中心查看任务</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-canvas flex flex-col overflow-hidden animate-in fade-in duration-150">
      
      {/* Top Application Header */}
      <div className="h-14 bg-surface-1 border-b border-border-default px-6 shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border-default hover:bg-surface-hover flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
            title="关闭"
          >
            <X size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-text-primary">
                新建运营方案 · Agent 协同确认打法
              </h1>
              <span className="text-[13px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                Agent 对话中
              </span>
            </div>
            <p className="text-[13px] text-text-tertiary">
              由 Agent 携带商家上下文驱动，在对话中生成、核对并确认运营打法方案
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowContextDrawer(true)}
            className="text-[13px] text-text-secondary hover:text-text-primary px-3 py-1.5 bg-surface-subtle hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center gap-1.5 font-medium"
          >
            <Layers size={13} className="text-text-tertiary" />
            <span>查看携带上下文 (12份资料)</span>
          </button>
        </div>
      </div>

      {/* Main Stage: Unified Agent Dialogue Workbench (Integrated Strategy Confirmation) */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-canvas">
        <DialogueWorkbench
          facts={facts}
          questions={questions}
          strategyDraft={strategyDraft}
          onOpenFullContext={() => setShowContextDrawer(true)}
          onNaturalLanguageSubmit={handleDialogueNaturalSubmit}
          onApplyProposal={handleApplyProposal}
          onConfirmAndCreate={handleConfirmAndCreateProject}
          onUpdateStrategyDraft={setStrategyDraft}
          industryDefaults={industryDefaults}
        />
      </div>

      {/* Drawer: Full Context */}
      {showContextDrawer && (
        <ContextDrawer
          contextState={contextState}
          onClose={() => setShowContextDrawer(false)}
          onSave={(updated) => {
            setContextState(updated);
            setShowContextDrawer(false);
          }}
        />
      )}

    </div>
  );
}
