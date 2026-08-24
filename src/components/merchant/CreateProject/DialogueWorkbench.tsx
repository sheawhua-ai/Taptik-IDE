import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Check, Send, 
  Layers, ShieldCheck, Clock, ChevronRight, CornerDownRight, 
  RotateCcw, Info, User, Bot, AlertCircle, RefreshCw, Loader2
} from 'lucide-react';
import { 
  FactItem, MissingInfoItem, StrategyDraftData, 
  StrategyChangeProposal, DialogueTurn 
} from './types';
import { StrategyDraftChatCard } from './StrategyDraftChatCard';
import { ProposalDiffChatCard } from './ProposalDiffChatCard';

interface DialogueWorkbenchProps {
  facts: FactItem[];
  questions: MissingInfoItem[];
  strategyDraft: StrategyDraftData;
  onAnswerQuestion?: (questionId: string, answer: string) => void;
  onOpenFullContext: () => void;
  onConfirmInheritedFact?: (factId: string) => void;
  onNaturalLanguageSubmit: (text: string) => void;
  onApplyProposal?: (proposal: StrategyChangeProposal) => void;
  onConfirmAndCreate: () => void;
  onUpdateStrategyDraft?: (draft: StrategyDraftData) => void;
}

export function DialogueWorkbench({
  facts,
  questions,
  strategyDraft,
  onOpenFullContext,
  onNaturalLanguageSubmit,
  onApplyProposal,
  onConfirmAndCreate,
  onUpdateStrategyDraft
}: DialogueWorkbenchProps) {
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Conversational message history
  const [messages, setMessages] = useState<DialogueTurn[]>([
    {
      id: 'turn_1',
      sender: 'ai',
      timestamp: '刚刚',
      content: '你好！我是你的运营操盘 Agent。我已自动接入当前商家【特唯普宠物】的上下文（1 份品牌档案、2 个主推单品、5 个可用矩阵账号、12 份知识与SGS质检报告，以及上期运营复盘记忆）。\n\n本周期你想重点启动哪类运营打法？请选择或直接输入你的运营诉求：',
      suggestedChips: [
        { group: '推荐打法', text: '为「无谷鲜肉幼犬粮」制定 14 天标准打法 (推荐)', actionValue: '主推无谷高蛋白鲜肉幼犬粮(2kg)，采用14天标准周期：品牌号2篇 + 5家店长号5篇 + 体验官KOC 10篇，重点解决换粮软便搜索卡位，带动到店领样咨询。' },
        { group: '推荐打法', text: '启动 7 天换粮期搜索卡位与顾问答疑 (紧凑周期)', actionValue: '启动7天紧凑周期快速验证搜索收录与自然咨询，聚焦无谷鲜肉幼犬粮' },
        { group: '特定诉求', text: '开启 10 人消费者真实测评与问卷打卡', actionValue: '开启消费者KOC真实测评模式，招募10名3-6月龄幼犬宠主回传排便对比照片与问卷打卡' }
      ]
    }
  ]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle user selecting a quick chip
  const handleSelectChip = (chip: { group?: string; text: string; actionValue?: string }) => {
    const userText = chip.actionValue || chip.text;
    handleSendMessage(userText);
  };

  // Handle sending a message in the chat
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // 1. Add User message
    const userMsg: DialogueTurn = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: '刚刚',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Trigger parent natural language submission
    onNaturalLanguageSubmit(text);

    // 2. Simulate AI smart reasoning & response
    setTimeout(() => {
      setIsThinking(false);

      // Scenario A: User asks for adjustment/modification
      if (text.includes('减少') || text.includes('增加') || text.includes('修改') || text.includes('调整') || text.includes('摄影') || text.includes('店长') || text.includes('周末')) {
        const isReduceBrand = text.includes('品牌') || text.includes('减少') || text.includes('KOC');
        const isPhoto = text.includes('摄影') || text.includes('素材');
        const isWeekend = text.includes('周末') || text.includes('店长');

        let proposal: StrategyChangeProposal;

        if (isPhoto) {
          proposal = {
            id: `prop_${Date.now()}`,
            userPrompt: text,
            aiInterpretation: '识别到当前专职摄影人员有限，降低专业相机棚拍门槛，将任务转移至店长日常手机随手拍与KOC真实自拍',
            diffSummary: [
              {
                moduleName: '素材拍摄需求',
                before: '每篇笔记需 3-5 张专业相机棚拍物料 (总计约 25 张棚拍需求)',
                after: '专职摄影仅承接品牌主号 1 组官方精品图，店长号与KOC采用手机真实纪实拍摄规范'
              }
            ],
            impactScope: {
              affectedNotesCount: 5,
              affectedAccounts: ['5家门店店长号'],
              affectedSchedule: '素材交付截止时间延长 1 天缓冲期',
              taskChanges: {
                added: ['自动生成《店长手机随手拍实用技巧卡》'],
                removed: ['取消 3 个高难度棚拍物料待办'],
                modified: ['降低店长号素材验收标准至“清晰无反光”即可']
              },
              hasConflictWithFacts: false
            }
          };
        } else if (isWeekend) {
          proposal = {
            id: `prop_${Date.now()}`,
            userPrompt: text,
            aiInterpretation: '将 5 家门店店长号的集中发布排期错开至周五晚间至周日，以匹配同城宠主周末到店咨询与领样高峰',
            diffSummary: [
              {
                moduleName: '店长号发布排期',
                before: '5家门店店长号统一在周二、周三工作日发布',
                after: '5家门店店长号分别按同城商圈客流错开在周五晚间 (18:00)、周六 (11:00/16:00) 与周日 (14:00/19:00)'
              }
            ],
            impactScope: {
              affectedNotesCount: 5,
              affectedAccounts: ['特唯普上海静安店', '特唯普静安二店', '特唯普徐汇店', '特唯普浦东店', '特唯普长宁店'],
              affectedSchedule: '发布窗口由工作日改为周末同城高峰期',
              taskChanges: {
                added: ['为各店长生成周末排期提醒日历'],
                removed: [],
                modified: ['更新 5 篇店长号待发布笔记计划时间']
              },
              hasConflictWithFacts: false
            }
          };
        } else {
          proposal = {
            id: `prop_${Date.now()}`,
            userPrompt: text,
            aiInterpretation: '调减品牌官方主号发布量为 1 篇，将 2 篇内容与配额倾斜至真实消费者 KOC 体验打卡与问卷回收池',
            diffSummary: [
              {
                moduleName: '内容与账号分工',
                before: '品牌主号 2 篇，消费者 KOC 10 篇 (总计 17 篇)',
                after: '品牌主号 1 篇 (-1)，消费者 KOC 12 篇 (+2) (总计 18 篇)'
              }
            ],
            impactScope: {
              affectedNotesCount: 3,
              affectedAccounts: ['特唯普官方旗舰店', '消费者KOC体验池'],
              affectedSchedule: '第1周品牌号发布合并为1篇官方质检长图文，招募落地页增加2个名额',
              taskChanges: {
                added: ['新增 2 个 KOC 真实体验问卷与排便图片验收任务'],
                removed: ['取消 1 篇品牌官方质检长图文排期'],
                modified: ['调整招募落地页计划名额至 12 人']
              },
              hasConflictWithFacts: false
            }
          };
        }

        const aiMsg: DialogueTurn = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          timestamp: '刚刚',
          content: '已为你生成打法调整提案。请核对修改差异及对下游任务、排期的连带影响：',
          proposal
        };
        setMessages(prev => [...prev, aiMsg]);
        return;
      }

      // Scenario B: Initial generation of the 6-module strategy draft card in chat
      const aiMsg: DialogueTurn = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        timestamp: '刚刚',
        content: `已结合商家【特唯普宠物】的 12 份知识资料、SGS 质检报告、合规禁区与 5 个矩阵账号画像，为你装配完成【${strategyDraft.projectName}】打法方案。\n\n请直接核对下方 6 大核心模块。你可以在此通过自然语言提出微调要求，或直接点击确认方案：`,
        isDraftGenerated: true,
        suggestedChips: [
          { group: '快捷调整', text: '品牌号减少1篇，把篇数增加给KOC', actionValue: '品牌号减少1篇，把篇数增加给KOC体验官' },
          { group: '快捷调整', text: '我们只有1名摄影，降低素材任务量', actionValue: '我们只有1名专职摄影，降低素材拍摄任务量' },
          { group: '快捷调整', text: '5家店长号错开在周末发布', actionValue: '5家店长号错开在周五至周日晚间发布' }
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Accept Proposal
  const handleAcceptProposal = (proposal: StrategyChangeProposal) => {
    if (onApplyProposal) {
      onApplyProposal(proposal);
    }
    
    // Also update draft state if callback exists
    if (proposal.userPrompt.includes('品牌') || proposal.userPrompt.includes('减少') || proposal.userPrompt.includes('KOC')) {
      if (onUpdateStrategyDraft) {
        onUpdateStrategyDraft({
          ...strategyDraft,
          accountAndContentAssignment: {
            ...strategyDraft.accountAndContentAssignment,
            brandAccounts: strategyDraft.accountAndContentAssignment.brandAccounts.map(b => ({
              ...b,
              noteCount: 1
            })),
            kocParticipants: {
              ...strategyDraft.accountAndContentAssignment.kocParticipants,
              recruitmentCount: 12
            },
            totalNotesCount: 18
          }
        });
      }
    }

    const confirmMsg: DialogueTurn = {
      id: `ai_confirm_${Date.now()}`,
      sender: 'ai',
      timestamp: '刚刚',
      content: `已采纳修改提案！打法方案已更新（品牌主号 1 篇，KOC 体验官 12 篇，总计 18 篇笔记槽位），下游排期与素材任务已同步调整。\n\n你可以继续核对最新打法方案：`,
      isDraftGenerated: true,
      suggestedChips: [
        { group: '快捷操作', text: '确认打法并创建方案 →', actionValue: '确认打法并创建方案' }
      ]
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-canvas overflow-hidden">

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.map((turn) => {
            const isAI = turn.sender === 'ai';

            return (
              <div
                key={turn.id}
                className={`flex gap-3.5 text-[13px] ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[13px] ${
                  isAI ? 'bg-neutral-900 text-white' : 'bg-surface-1 border border-border-default text-text-primary'
                }`}>
                  {isAI ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Content */}
                <div className={`space-y-3 max-w-[94%] lg:max-w-[88%] ${isAI ? 'text-left' : 'text-left'}`}>
                  <div className={`p-4 rounded-xl border leading-relaxed ${
                    isAI 
                      ? 'bg-surface-1 border-border-default text-text-primary shadow-xs' 
                      : 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  }`}>
                    <p className="whitespace-pre-line text-[13px] leading-relaxed">
                      {turn.content}
                    </p>

                    {/* Integrated 6-Module Strategy Draft Card */}
                    {turn.isDraftGenerated && (
                      <StrategyDraftChatCard
                        draft={strategyDraft}
                        onConfirmAndCreate={onConfirmAndCreate}
                        onQuickModify={(prompt) => handleSendMessage(prompt)}
                      />
                    )}

                    {/* Integrated Diff Proposal Card */}
                    {turn.proposal && (
                      <ProposalDiffChatCard
                        proposal={turn.proposal}
                        onAccept={handleAcceptProposal}
                      />
                    )}

                  </div>

                  {/* Suggested Chips below message */}
                  {turn.suggestedChips && turn.suggestedChips.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-text-tertiary block px-1">
                        点击可快速补充或选择：
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {turn.suggestedChips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleSelectChip(chip)}
                            className="px-3 py-1.5 bg-surface-1 hover:bg-surface-hover hover:border-border-strong border border-border-default rounded-md text-[12px] text-text-secondary hover:text-text-primary transition-colors text-left flex items-center gap-1.5 shadow-2xs"
                          >
                            <CornerDownRight size={12} className="text-text-tertiary shrink-0" />
                            <span>{chip.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Thinking State */}
          {isThinking && (
            <div className="flex gap-3.5 items-start text-[13px]">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3.5 bg-surface-1 border border-border-default rounded-xl shadow-xs text-text-secondary flex items-center gap-2 text-[12.5px]">
                <Loader2 size={15} className="animate-spin text-text-tertiary" />
                <span>Agent 正在结合 12 份质检报告与 5 个账号画像装配运营打法...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Natural Language Input Bar at Bottom */}
      <div className="p-4 bg-surface-1 border-t border-border-default shrink-0">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="与 Agent 对话或输入调整指令（如：品牌号减少1篇，KOS错开周末发布）..."
              className="flex-1 h-10 px-4 bg-surface-subtle border border-border-default rounded-lg text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-strong focus:bg-white transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 px-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Send size={14} />
              <span>发送</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-text-tertiary mt-2 px-1">
            <span>支持自然语言输入目标、调整篇数、修改排期或调整素材标准</span>
            <span>按 Enter 发送</span>
          </div>
        </div>
      </div>

    </div>
  );
}
