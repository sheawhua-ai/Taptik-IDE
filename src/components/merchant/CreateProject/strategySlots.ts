import type { StrategyDraftData } from './types';

/**
 * 方案「信息槽位」契约 —— 单一事实源。
 *
 * 新建方案表单、AI 生成、方案落库、查看详情四处共用这一份定义，
 * 避免同一信息在多处各写一套导致字段对不上。
 *
 * 设计约束（重要）：
 * - 打法类槽位（内容逻辑、验证信号、继续/调整/暂停条件等）属于行业通用判断，
 *   AI 可以用行业默认打法预填。
 * - 事实类槽位（主推产品、目标人群、已确认事实）依赖商家真实资料，
 *   AI **不编造**，必须留给操盘手确认。
 */

export type SlotGroupId = 'promotion' | 'goal' | 'strategy' | 'loop' | 'basis';

export interface SlotGroup {
  id: SlotGroupId;
  label: string;
  description: string;
}

export const SLOT_GROUPS: SlotGroup[] = [
  { id: 'promotion', label: '推广对象', description: '本轮推什么、给谁看' },
  { id: 'goal', label: '核心目标与验证', description: '这轮要验证什么，怎么算跑通' },
  { id: 'strategy', label: '核心打法', description: '用什么内容逻辑回应问题' },
  { id: 'loop', label: '执行边界', description: '系统做什么、你要做什么' },
  { id: 'basis', label: '假设与依据', description: '哪些是事实，哪些是待验证' }
];

export type SlotKind = 'text' | 'textarea' | 'list' | 'objectList';

export interface StrategySlot {
  id: string;
  label: string;
  group: SlotGroupId;
  kind: SlotKind;
  /** 必填槽位：新建方案时校验，未填不允许创建 */
  required: boolean;
  /**
   * 是否为商家事实类槽位。
   * true  = 依赖商家真实资料，AI 不预填、不编造，留给操盘手确认
   * false = 属于行业通用打法判断，AI 可用行业默认预填
   */
  isMerchantFact: boolean;
  /** 是否在新建方案表单中暴露输入 */
  inCreateForm: boolean;
  hint?: string;
}

export const STRATEGY_SLOTS: StrategySlot[] = [
  // —— 推广对象 ——
  { id: 'targetName', label: '主推产品 / 服务', group: 'promotion', kind: 'text', required: true, isMerchantFact: true, inCreateForm: true },
  { id: 'targetCategory', label: '所属品类', group: 'promotion', kind: 'text', required: false, isMerchantFact: true, inCreateForm: true },
  { id: 'targetAudience', label: '目标人群', group: 'promotion', kind: 'textarea', required: true, isMerchantFact: true, inCreateForm: true },
  { id: 'promotionConfirmedFacts', label: '已确认事实依据', group: 'promotion', kind: 'objectList', required: false, isMerchantFact: true, inCreateForm: false, hint: '来自商家资料 / 产品资料，可追溯来源' },
  { id: 'unconfirmedGaps', label: '待确认缺口', group: 'promotion', kind: 'list', required: false, isMerchantFact: true, inCreateForm: false },

  // —— 核心目标与验证 ——
  { id: 'primaryBusinessGoal', label: '本轮验证目标', group: 'goal', kind: 'textarea', required: true, isMerchantFact: false, inCreateForm: true },
  { id: 'observableSignals', label: '可观察验证信号', group: 'goal', kind: 'list', required: false, isMerchantFact: false, inCreateForm: true },
  { id: 'successCriteria', label: '继续铺量条件', group: 'goal', kind: 'textarea', required: false, isMerchantFact: false, inCreateForm: true },
  { id: 'adjustmentCriteria', label: '何时调整打法', group: 'goal', kind: 'textarea', required: false, isMerchantFact: false, inCreateForm: true },
  { id: 'stopCriteria', label: '暂停或换打法条件', group: 'goal', kind: 'textarea', required: false, isMerchantFact: false, inCreateForm: true },
  { id: 'auxiliaryGoals', label: '辅助观察项', group: 'goal', kind: 'list', required: false, isMerchantFact: false, inCreateForm: false },

  // —— 核心打法 ——
  { id: 'problemToSolve', label: '核心问题', group: 'strategy', kind: 'textarea', required: true, isMerchantFact: false, inCreateForm: true },
  { id: 'contentLogic', label: '内容方法', group: 'strategy', kind: 'textarea', required: true, isMerchantFact: false, inCreateForm: true },
  { id: 'rationale', label: '选择此打法原因', group: 'strategy', kind: 'textarea', required: false, isMerchantFact: false, inCreateForm: false },
  { id: 'collaborationMechanism', label: '账号与动作协同', group: 'strategy', kind: 'textarea', required: false, isMerchantFact: false, inCreateForm: false },

  // —— 执行边界（人在环路）——
  { id: 'systemAutomated', label: '系统自动化', group: 'loop', kind: 'list', required: false, isMerchantFact: false, inCreateForm: true },
  { id: 'operatorRequired', label: '操盘手必做', group: 'loop', kind: 'list', required: false, isMerchantFact: false, inCreateForm: true },

  // —— 假设与依据 ——
  { id: 'confirmedFacts', label: '已确认事实', group: 'basis', kind: 'objectList', required: false, isMerchantFact: true, inCreateForm: true },
  { id: 'pendingHypotheses', label: '待验证假设', group: 'basis', kind: 'objectList', required: false, isMerchantFact: false, inCreateForm: true },
  { id: 'missingItemsToTrack', label: '待追踪缺失项', group: 'basis', kind: 'objectList', required: false, isMerchantFact: false, inCreateForm: true }
];

export const SLOT_BY_ID: Record<string, StrategySlot> = STRATEGY_SLOTS.reduce<Record<string, StrategySlot>>((acc, slot) => {
  acc[slot.id] = slot;
  return acc;
}, {});

// ========================================================
// 槽位读写
// ========================================================

/** 读取单个槽位的原始值（可能是 string / string[] / 对象数组） */
export function getSlotValue(draft: StrategyDraftData, slotId: string): unknown {
  switch (slotId) {
    case 'targetName': return draft.promotionTarget.targetName;
    case 'targetCategory': return draft.promotionTarget.targetCategory;
    case 'targetAudience': return draft.promotionTarget.targetAudience;
    case 'promotionConfirmedFacts': return draft.promotionTarget.confirmedFacts;
    case 'unconfirmedGaps': return draft.promotionTarget.unconfirmedGaps;
    case 'primaryBusinessGoal': return draft.coreGoalAndVerification.primaryBusinessGoal;
    case 'observableSignals': return draft.coreGoalAndVerification.observableSignals;
    case 'successCriteria': return draft.coreGoalAndVerification.successCriteria;
    case 'adjustmentCriteria': return draft.coreGoalAndVerification.adjustmentCriteria;
    case 'stopCriteria': return draft.coreGoalAndVerification.stopCriteria;
    case 'auxiliaryGoals': return draft.coreGoalAndVerification.auxiliaryGoals ?? [];
    case 'problemToSolve': return draft.coreStrategy.problemToSolve;
    case 'contentLogic': return draft.coreStrategy.contentLogic;
    case 'rationale': return draft.coreStrategy.rationale;
    case 'collaborationMechanism': return draft.coreStrategy.collaborationMechanism;
    case 'systemAutomated': return draft.humanInTheLoop.systemAutomated;
    case 'operatorRequired': return draft.humanInTheLoop.operatorRequired;
    case 'confirmedFacts': return draft.hypothesesAndBasis.confirmedFacts;
    case 'pendingHypotheses': return draft.hypothesesAndBasis.pendingHypotheses;
    case 'missingItemsToTrack': return draft.hypothesesAndBasis.missingItemsToTrack;
    default: return undefined;
  }
}

/** 写入单个槽位，返回新的 draft（不可变更新） */
export function setSlotValue(draft: StrategyDraftData, slotId: string, value: unknown): StrategyDraftData {
  switch (slotId) {
    case 'targetName':
      return { ...draft, promotionTarget: { ...draft.promotionTarget, targetName: String(value ?? '') } };
    case 'targetCategory':
      return { ...draft, promotionTarget: { ...draft.promotionTarget, targetCategory: String(value ?? '') } };
    case 'targetAudience':
      return { ...draft, promotionTarget: { ...draft.promotionTarget, targetAudience: String(value ?? '') } };
    case 'promotionConfirmedFacts':
      return { ...draft, promotionTarget: { ...draft.promotionTarget, confirmedFacts: (value ?? []) as StrategyDraftData['promotionTarget']['confirmedFacts'] } };
    case 'unconfirmedGaps':
      return { ...draft, promotionTarget: { ...draft.promotionTarget, unconfirmedGaps: (value ?? []) as string[] } };

    case 'primaryBusinessGoal':
      return { ...draft, coreGoalAndVerification: { ...draft.coreGoalAndVerification, primaryBusinessGoal: String(value ?? '') } };
    case 'observableSignals':
      return { ...draft, coreGoalAndVerification: { ...draft.coreGoalAndVerification, observableSignals: (value ?? []) as string[] } };
    case 'successCriteria':
      return { ...draft, coreGoalAndVerification: { ...draft.coreGoalAndVerification, successCriteria: String(value ?? '') } };
    case 'adjustmentCriteria':
      return { ...draft, coreGoalAndVerification: { ...draft.coreGoalAndVerification, adjustmentCriteria: String(value ?? '') } };
    case 'stopCriteria':
      return { ...draft, coreGoalAndVerification: { ...draft.coreGoalAndVerification, stopCriteria: String(value ?? '') } };
    case 'auxiliaryGoals':
      return { ...draft, coreGoalAndVerification: { ...draft.coreGoalAndVerification, auxiliaryGoals: (value ?? []) as string[] } };

    case 'problemToSolve':
      return { ...draft, coreStrategy: { ...draft.coreStrategy, problemToSolve: String(value ?? '') } };
    case 'contentLogic':
      return { ...draft, coreStrategy: { ...draft.coreStrategy, contentLogic: String(value ?? '') } };
    case 'rationale':
      return { ...draft, coreStrategy: { ...draft.coreStrategy, rationale: String(value ?? '') } };
    case 'collaborationMechanism':
      return { ...draft, coreStrategy: { ...draft.coreStrategy, collaborationMechanism: String(value ?? '') } };

    case 'systemAutomated':
      return { ...draft, humanInTheLoop: { ...draft.humanInTheLoop, systemAutomated: (value ?? []) as string[] } };
    case 'operatorRequired':
      return { ...draft, humanInTheLoop: { ...draft.humanInTheLoop, operatorRequired: (value ?? []) as string[] } };

    case 'confirmedFacts':
      return { ...draft, hypothesesAndBasis: { ...draft.hypothesesAndBasis, confirmedFacts: (value ?? []) as StrategyDraftData['hypothesesAndBasis']['confirmedFacts'] } };
    case 'pendingHypotheses':
      return { ...draft, hypothesesAndBasis: { ...draft.hypothesesAndBasis, pendingHypotheses: (value ?? []) as StrategyDraftData['hypothesesAndBasis']['pendingHypotheses'] } };
    case 'missingItemsToTrack':
      return { ...draft, hypothesesAndBasis: { ...draft.hypothesesAndBasis, missingItemsToTrack: (value ?? []) as StrategyDraftData['hypothesesAndBasis']['missingItemsToTrack'] } };

    default:
      return draft;
  }
}

/** 判断槽位是否已被填充 */
export function isSlotFilled(draft: StrategyDraftData, slotId: string): boolean {
  const value = getSlotValue(draft, slotId);
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) {
    return value.some(item => {
      if (typeof item === 'string') return item.trim().length > 0;
      if (item && typeof item === 'object') {
        return Object.values(item as Record<string, unknown>).some(v => typeof v === 'string' && v.trim().length > 0);
      }
      return false;
    });
  }
  return false;
}

export interface SlotCompletion {
  filled: number;
  total: number;
  percent: number;
  /** 未填的必填槽位（会阻断创建） */
  missingRequired: StrategySlot[];
  /** 未填的可选槽位（AI 已预填的不算缺失，仅提示可补） */
  missingOptional: StrategySlot[];
}

/** 计算方案信息完整度，用于引导操盘手补齐槽位 */
export function draftCompletion(draft: StrategyDraftData): SlotCompletion {
  const missingRequired: StrategySlot[] = [];
  const missingOptional: StrategySlot[] = [];
  let filled = 0;

  STRATEGY_SLOTS.forEach(slot => {
    if (isSlotFilled(draft, slot.id)) {
      filled += 1;
    } else if (slot.required) {
      missingRequired.push(slot);
    } else {
      missingOptional.push(slot);
    }
  });

  const total = STRATEGY_SLOTS.length;
  return {
    filled,
    total,
    percent: Math.round((filled / total) * 100),
    missingRequired,
    missingOptional
  };
}
