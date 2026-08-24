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

export function CreateProjectWorkstation({
  onClose,
  onCreate,
  mode = 'create',
}: {
  onClose: () => void;
  onCreate: (project?: any) => void;
  mode?: 'create' | 'edit';
}) {
  const { createFullOperationsProject, jumpToExecution, setSelectedProjectId } = useProjectStore();

  // Facts ledger state
  const [facts, setFacts] = useState<FactItem[]>(INITIAL_CARRIED_FACTS);

  // Prioritized questions state
  const [questions, setQuestions] = useState<MissingInfoItem[]>(INITIAL_PRIORITIZED_QUESTIONS);

  // Strategy draft state
  const [strategyDraft, setStrategyDraft] = useState<StrategyDraftData>(() => GENERATE_DEFAULT_STRATEGY());

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
        projectName: '幼犬换粮搜索卡位与顾问答疑｜7天'
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
        projectName: '幼犬换粮搜索卡位与顾问答疑｜21天'
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
          primaryBusinessGoal: '唯一目标：验证“幼犬换粮软便”核心搜索词排名前3位覆盖与有效收录，沉淀真实顾问答疑内容'
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
          <div className="p-4 bg-surface-subtle border border-border-default rounded-lg text-left text-[12.5px] space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
              <span className="font-semibold text-text-primary text-[13px]">
                {createdProjectInfo.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
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
              <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                Agent 对话中
              </span>
            </div>
            <p className="text-[11.5px] text-text-tertiary">
              由 Agent 携带商家上下文驱动，在对话中生成、核对并确认运营打法方案
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowContextDrawer(true)}
            className="text-[12px] text-text-secondary hover:text-text-primary px-3 py-1.5 bg-surface-subtle hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center gap-1.5 font-medium"
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
