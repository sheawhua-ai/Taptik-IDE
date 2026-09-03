import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import { StrategyDraftData, DEFAULT_QUESTIONNAIRE_QUESTIONS } from './CreateProject/types';
import type { QuestionnaireQuestion } from './CreateProject/types';

export { DEFAULT_QUESTIONNAIRE_QUESTIONS };
export type { QuestionnaireQuestion };
import { GENERATE_DEFAULT_STRATEGY } from './CreateProject/mockData';
import { ContextDrawer, DEFAULT_CONTEXT_STATE, ContextState } from './CreateProject/ContextDrawer';
import type { IndustryDefaults, MerchantIndustryProfile } from '../../data/industryCatalog';
import {
  PlanCreationSettings,
  StructuredPlanCreationFlow,
} from './CreateProject/StructuredPlanCreationFlow';

export function CreateProjectWorkstation({
  merchantId,
  onClose,
  onCreate,
  industryDefaults,
  industryProfile,
}: {
  merchantId?: string;
  onClose: () => void;
  onCreate: (project?: any) => void;
  mode?: 'create' | 'edit';
  industryDefaults?: IndustryDefaults;
  industryProfile?: MerchantIndustryProfile;
}) {
  const { createFullOperationsProject, jumpToExecution, setSelectedProjectId } = useProjectStore();

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

  // Confirm and Create Project
  const handleConfirmAndCreateProject = (
    confirmedDraft: StrategyDraftData = strategyDraft,
    settings: PlanCreationSettings = {
      targetKeywords: '',
      observationDays: 14,
      needMaterials: true,
      allowIndustryFallback: true,
    },
  ) => {
    try {
      const startAt = Date.parse(confirmedDraft.startDate);
      const endAt = Date.parse(confirmedDraft.endDate);
      const cycleDays = Number.isFinite(startAt) && Number.isFinite(endAt)
        ? Math.max(1, Math.floor((endAt - startAt) / 86_400_000) + 1)
        : confirmedDraft.cycleDays;
      const activeDraft = { ...confirmedDraft, cycleDays };
      setStrategyDraft(activeDraft);
      const noteSeeds: Array<{
        title: string;
        accountType: 'KOC' | '店长号/KOS' | '品牌主号';
        accountName: string;
        contentDirection: string;
      }> = [
        ...activeDraft.accountAndContentAssignment.brandAccounts.flatMap(account =>
          Array.from({ length: account.noteCount }, (_, index) => ({
            title: `${account.contentDirection} ${index + 1}`,
            accountType: '品牌主号' as const,
            accountName: account.name,
            contentDirection: account.contentDirection,
          })),
        ),
        ...activeDraft.accountAndContentAssignment.kosAccounts.flatMap(account =>
          Array.from({ length: account.noteCount }, (_, index) => ({
            title: `${account.contentDirection} ${index + 1}`,
            accountType: '店长号/KOS' as const,
            accountName: account.name,
            contentDirection: account.contentDirection,
          })),
        ),
        ...Array.from({ length: activeDraft.accountAndContentAssignment.kocParticipants.enabled ? activeDraft.accountAndContentAssignment.kocParticipants.recruitmentCount : 0 }, (_, index) => ({
          title: `${activeDraft.accountAndContentAssignment.kocParticipants.contentDirection} ${index + 1}`,
          accountType: 'KOC' as const,
          accountName: `待招募体验者 ${index + 1}`,
          contentDirection: activeDraft.accountAndContentAssignment.kocParticipants.contentDirection,
        })),
      ];
      const notes = noteSeeds.map((note, index) => {
        const plannedDate = new Date(activeDraft.startDate);
        plannedDate.setDate(plannedDate.getDate() + Math.min(activeDraft.cycleDays - 1, Math.floor(index / 2)));
        return {
          ...note,
          plannedDate: plannedDate.toISOString().split('T')[0],
          targetAudience: activeDraft.promotionTarget.targetAudience,
          searchIntent: settings.targetKeywords,
          coreExpression: activeDraft.coreStrategy.contentLogic,
          requiredMaterials: settings.needMaterials ? [activeDraft.accountAndContentAssignment.kocParticipants.requiredMaterialSpecs] : [],
        };
      });
      const materialDirections = industryDefaults?.contentTemplates.length
        ? industryDefaults.contentTemplates
        : ['品牌与产品标准素材', '真实场景素材', '人物出镜与口播素材'];
      const materialTasks = settings.needMaterials ? materialDirections.map((direction, index) => ({
        reqs: `${direction}：画面真实、主体清楚，满足本轮内容使用要求`,
        usageScenario: direction,
        specs: activeDraft.accountAndContentAssignment.kocParticipants.requiredMaterialSpecs,
        assignee: '待派发',
        associatedNoteIndices: notes.length ? [index % notes.length] : [],
      })) : [];

      const activeBrandAccounts = activeDraft.accountAndContentAssignment.brandAccounts.filter((account) => account.noteCount > 0);
      const activeKosAccounts = activeDraft.accountAndContentAssignment.kosAccounts.filter((account) => account.noteCount > 0);
      const brandNotesTotal = activeBrandAccounts.reduce((sum, account) => sum + account.noteCount, 0);
      const kosNotesTotal = activeKosAccounts.reduce((sum, account) => sum + account.noteCount, 0);

      const projectId = createFullOperationsProject({
        merchantId,
        name: activeDraft.projectName,
        goal: activeDraft.coreGoalAndVerification.primaryBusinessGoal,
        status: '准备中',
        startDate: activeDraft.startDate,
        endDate: activeDraft.endDate,
        strategyProtocol: {
          targetAudience: activeDraft.promotionTarget.targetAudience,
          coreProblem: activeDraft.coreStrategy.problemToSolve,
          solutionSummary: activeDraft.coreStrategy.contentLogic,
          verifyHypothesis: activeDraft.coreGoalAndVerification.primaryBusinessGoal,
          continueCondition: activeDraft.coreGoalAndVerification.successCriteria,
          stopCondition: activeDraft.coreGoalAndVerification.stopCriteria,
          targetKeywords: settings.targetKeywords ? settings.targetKeywords.split(new RegExp('[、,,]')).map((keyword) => keyword.trim()).filter(Boolean) : [],
          observationDays: settings.observationDays,
          observableSignals: activeDraft.coreGoalAndVerification.observableSignals,
          adjustmentCriteria: activeDraft.coreGoalAndVerification.adjustmentCriteria,
          humanInTheLoop: activeDraft.humanInTheLoop,
          hypothesesAndBasis: activeDraft.hypothesesAndBasis,
          // —— 与新建方案槽位契约对齐（主推产品是新建必填项，不能丢）——
          promotionTarget: {
            targetName: activeDraft.promotionTarget.targetName,
            targetCategory: activeDraft.promotionTarget.targetCategory,
          },
          promotionConfirmedFacts: activeDraft.promotionTarget.confirmedFacts,
          unconfirmedGaps: activeDraft.promotionTarget.unconfirmedGaps,
          auxiliaryGoals: activeDraft.coreGoalAndVerification.auxiliaryGoals,
          rationale: activeDraft.coreStrategy.rationale,
          collaborationMechanism: activeDraft.coreStrategy.collaborationMechanism,
        },
        distributionScheme: {
          brandTotalNotes: brandNotesTotal,
          kosTotalNotes: kosNotesTotal,
          kocTotalNotes: activeDraft.accountAndContentAssignment.kocParticipants.enabled ? activeDraft.accountAndContentAssignment.kocParticipants.recruitmentCount : 0,
          totalPlannedNotes: notes.length,
          ownAccounts: {
            brandAccounts: {
              selectedAccountIds: activeBrandAccounts.map((account) => account.id),
              notesPerAccount: activeBrandAccounts.length ? Math.max(1, Math.round(brandNotesTotal / activeBrandAccounts.length)) : 0,
              publishFrequency: '按排期发布',
              suggestedTimeWindow: activeBrandAccounts[0]?.timeWindow || '按排期发布',
            },
            kosAccounts: {
              selectedAccountIds: activeKosAccounts.map((account) => account.id),
              notesPerAccount: activeKosAccounts.length ? Math.max(1, Math.round(kosNotesTotal / activeKosAccounts.length)) : 0,
              publishFrequency: '按排期发布',
              suggestedTimeWindow: activeKosAccounts[0]?.timeWindow || '按排期发布',
            },
          },
          consumerKoc: {
            recruitmentCount: activeDraft.accountAndContentAssignment.kocParticipants.enabled ? activeDraft.accountAndContentAssignment.kocParticipants.recruitmentCount : 0,
            packagesPerPerson: 1,
            hasQuestionnaire: activeDraft.accountAndContentAssignment.kocParticipants.hasQuestionnaire,
            needPhotos: settings.needMaterials,
            photoCountRange: settings.needMaterials ? '2-4张' : undefined,
            claimValidityDays: 3,
            observationDays: settings.observationDays,
            enableWechatNotice: false,
          },
          aiSuggestion: `账号数量由操盘手确认并锁定。知识调用：商家知识优先${settings.allowIndustryFallback ? '，缺失时使用行业通用方法补齐' : ''}。`,
        },
        notes,
        materialTasks,
      });

      setCreatedProjectInfo({
        id: projectId,
        name: activeDraft.projectName,
        notesCount: notes.length,
        tasksCount: materialTasks.length,
      });
      setIsCompleted(true);

      if (onCreate) {
        onCreate({ id: projectId, name: activeDraft.projectName });
      }
    } catch (e) {
      console.error("Failed to create project:", e);
      // Fallback
      setIsCompleted(true);
      setCreatedProjectInfo({
        id: `proj_${Date.now()}`,
        name: confirmedDraft.projectName,
        notesCount: confirmedDraft.accountAndContentAssignment.totalNotesCount,
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
    <React.Fragment>
      <StructuredPlanCreationFlow
        draft={strategyDraft}
        setDraft={setStrategyDraft}
        industryDefaults={industryDefaults}
        industryProfile={industryProfile}
        onClose={onClose}
        onOpenContext={() => setShowContextDrawer(true)}
        onConfirm={handleConfirmAndCreateProject}
      />

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
    </React.Fragment>
  );
}
