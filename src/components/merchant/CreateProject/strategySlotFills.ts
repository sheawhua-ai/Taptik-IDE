import type { StrategyDraftData } from './types';
import { STRATEGY_SLOTS, isSlotFilled, setSlotValue } from './strategySlots';

/**
 * AI 槽位预填策略。
 *
 * 原则：
 * - 打法类槽位（内容逻辑、验证信号、继续/调整/暂停条件、协同机制、人在环路、待验证假设）
 *   属于行业通用判断，AI 按主目标套用行业默认打法填满，操盘手可改。
 * - 事实类槽位（主推产品、目标人群、已确认事实）依赖商家真实资料，
 *   AI **不编造**，留空并在完整度里提示操盘手确认。
 */

export type PrimaryGoalId = '搜索卡位' | '种草认知' | '有效咨询' | '进店转化' | '账号涨粉';

interface GoalPlaybook {
  observableSignals: string[];
  successCriteria: string;
  adjustmentCriteria: string;
  stopCriteria: string;
  auxiliaryGoals: string[];
  problemToSolve: string;
  contentLogic: string;
  rationale: string;
  collaborationMechanism: string;
}

const PLAYBOOKS: Record<PrimaryGoalId, GoalPlaybook> = {
  搜索卡位: {
    observableSignals: [
      '目标搜索词在平台搜索结果前 3 位出现矩阵笔记',
      '发布 48h 内自然搜索带来的评论 / 私信咨询量',
      '搜索来源流量占比'
    ],
    successCriteria: '目标搜索词实现稳定收录并进入前 3 位，自然搜索咨询转化达到预期，具备下一周期复投价值。',
    adjustmentCriteria: '若发布 5 天后搜索收录率低于 30%，调整笔记标题的关键词长尾组合与头图样式。',
    stopCriteria: '若出现平台规则违规阻断或严重负面舆情，立即暂停发布并启动核查。',
    auxiliaryGoals: ['沉淀可复用的关键词长尾词库', '单篇收藏率高于上周期均值'],
    problemToSolve: '目标人群在平台有明确搜索需求，但当前内容没有被搜索结果有效收录，需求流量被竞品承接。',
    contentLogic: '围绕核心搜索词产出可收藏的干货内容，标题与正文前段完成关键词占位，用真实体验支撑内容事实，避免空泛软广。',
    rationale: '搜索流量是小红书最稳定的长尾来源；先占位验证收录，再决定是否放大内容量。',
    collaborationMechanism: '品牌号负责权威科普与核心词主占位；KOS 补充同城与场景长尾词；KOC 用第一视角实测内容承接长尾搜索。'
  },
  种草认知: {
    observableSignals: [
      '单篇收藏率与互动量（赞藏评）',
      '账号关注转化率',
      '真实素材 / 打卡记录沉淀数量'
    ],
    successCriteria: '单篇收藏率高于上周期均值，并形成可复用的真实内容资产，品牌认知有可观察提升。',
    adjustmentCriteria: '若连续多篇互动量低于阈值，调整内容视角与封面表达，强化场景共鸣。',
    stopCriteria: '若出现违规或重大负面舆情，立即暂停并核查内容事实。',
    auxiliaryGoals: ['沉淀真实体验素材库', '评论区正向反馈占比'],
    problemToSolve: '品牌认知不足，目标人群对本品类缺少信任基础，需要先建立真实感再谈转化。',
    contentLogic: '以真实体验与场景共鸣建立信任，用可收藏的干货承接认知，保持第一视角口吻，避免硬广表达。',
    rationale: '认知阶段收藏与真实感优先于曝光量；先沉淀真实内容资产，再考虑转化动作。',
    collaborationMechanism: 'KOC 提供第一视角真实体验；KOS 做专业解释与补充；品牌号做品牌背书与内容聚合。'
  },
  有效咨询: {
    observableSignals: [
      '自然咨询 / 私信转化率',
      '发布 48h 内自然搜索带来的评论 / 私信咨询量',
      '咨询问题的需求明确度'
    ],
    successCriteria: '咨询转化率达预期，且咨询需求明确可承接，形成稳定的咨询来源。',
    adjustmentCriteria: '若咨询量达标但需求模糊，调整内容的问题切入角度与行动引导。',
    stopCriteria: '若咨询无法承接或出现集中负面反馈，暂停放大动作并优化承接。',
    auxiliaryGoals: ['咨询响应时效', '高频问题沉淀数量'],
    problemToSolve: '内容有曝光但无法转化为有明确需求的咨询，需求没有被有效激发和承接。',
    contentLogic: '在内容中明确问题场景与解法，用顾问式答疑引导有需求的用户主动咨询，给出清晰的下一步动作。',
    rationale: '咨询是离成交最近的可观察信号；用答疑型内容筛选真实需求，比泛曝光更容易验证有效性。',
    collaborationMechanism: 'KOS 以顾问身份承接答疑与私信；品牌号提供权威依据；KOC 用真实经历引发共鸣并引导提问。'
  },
  进店转化: {
    observableSignals: [
      '主页 / 商品访问量',
      '到店 / 领样核销量',
      '搜索来源流量占比'
    ],
    successCriteria: '访问量或核销量达到基准，内容到成交的链路完整跑通。',
    adjustmentCriteria: '若访问量达标但核销偏低，优化承接页表达与到店路径指引。',
    stopCriteria: '若核销数据持续未达基准或出现合规问题，暂停放大动作。',
    auxiliaryGoals: ['核销周期时长', '复访 / 复购意向'],
    problemToSolve: '内容能带来关注，但没有形成稳定的进店或核销转化路径，流量停在站内。',
    contentLogic: '用场景化内容激发到店动机，明确站内承接路径与行动指引，让有兴趣的用户知道下一步去哪。',
    rationale: '进店转化依赖明确的承接路径；先跑通完整链路，再考虑放大内容量。',
    collaborationMechanism: 'KOS 负责同城到店引导与核销承接；品牌号做商品与店铺承接；KOC 用真实到店体验佐证。'
  },
  账号涨粉: {
    observableSignals: [
      '账号关注转化率',
      '单篇收藏率与互动量',
      '栏目更新的稳定性'
    ],
    successCriteria: '关注转化稳定，形成可预期、可持续更新的内容栏目。',
    adjustmentCriteria: '若互动达标但关注转化低，强化栏目感与更新预期的表达。',
    stopCriteria: '若更新无法持续或出现违规，暂停并重新设计栏目结构。',
    auxiliaryGoals: ['栏目完读 / 追更比例', '粉丝互动活跃度'],
    problemToSolve: '内容有单篇表现但没有沉淀为账号资产，用户缺乏持续关注的动力。',
    contentLogic: '以稳定栏目建立更新预期，用系列化内容沉淀账号记忆点，让用户知道「关注后能持续得到什么」。',
    rationale: '涨粉依赖可预期的内容栏目；系列化比单篇爆款更容易沉淀长期关注。',
    collaborationMechanism: '品牌号做栏目主阵地；KOS 做系列化专业内容；KOC 提供真实反馈丰富栏目素材。'
  }
};

// 与行业无关的执行边界模板（系统自动化 / 操盘手必做）
const SYSTEM_AUTOMATION_FALLBACK: string[] = [
  '读取商家资料、质检报告与禁用词规则',
  '依据打法规则生成内容骨架与关键词占位草稿',
  '自动拆解素材清单并生成待办拍摄需求',
  '合规与绝对化违禁词实时预检扫描',
  '自动监控搜索收录排名与异常提醒'
];

const OPERATOR_REQUIRED_FALLBACK: string[] = [
  '确认产品事实与质检批次合规性',
  '审核 AI 内容草稿是否符合品牌口吻',
  '验收素材回传质量',
  '确认发布并完成首小时互动',
  '处理授权失效或平台异常通知'
];

const PENDING_HYPOTHESES_FALLBACK: Array<{ text: string; basis: string; status: 'hypothesis' }> = [
  { text: '目标人群在本周期内有稳定的内容需求', basis: '依据行业经验暂定，待首批笔记发布后通过互动数据验证', status: 'hypothesis' },
  { text: '本轮内容结构比上一轮更容易获得收藏', basis: '基于账号历史表现推断，可随实际数据微调', status: 'hypothesis' }
];

const MISSING_ITEMS_FALLBACK: Array<{ text: string; impact: string }> = [
  { text: '暂缺目标关键词实时排名基准', impact: '先不设排名 KPI，改以收录量观察' },
  { text: '暂缺领样核销率基准数据', impact: '到店转化仅作辅助观察项' }
];

const genId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/**
 * 用行业默认打法填满所有「AI 可填」的槽位。
 * 事实类槽位（isMerchantFact）一律跳过，不编造商家资料。
 */
export interface FillOptions {
  /**
   * true  = 覆盖已填的打法类槽位（AI 重新生成打法时使用）
   * false = 只补空槽位，保留操盘手已有改动
   */
  overwrite?: boolean;
}

export function fillSlotsFromIndustry(
  draft: StrategyDraftData,
  primaryGoal: PrimaryGoalId,
  options: FillOptions = {}
): StrategyDraftData {
  const { overwrite = false } = options;
  const playbook = PLAYBOOKS[primaryGoal] ?? PLAYBOOKS['搜索卡位'];

  // 与总篇数联动，避免出现与实际方案不符的数字
  const totalNotes = draft.accountAndContentAssignment.totalNotesCount || 0;
  const systemAutomated = SYSTEM_AUTOMATION_FALLBACK.map(item =>
    item.includes('内容骨架')
      ? `依据打法规则生成 ${totalNotes} 篇笔记的内容骨架与关键词占位草稿`
      : item
  );

  const fills: Record<string, unknown> = {
    observableSignals: [...playbook.observableSignals],
    successCriteria: playbook.successCriteria,
    adjustmentCriteria: playbook.adjustmentCriteria,
    stopCriteria: playbook.stopCriteria,
    auxiliaryGoals: [...playbook.auxiliaryGoals],
    problemToSolve: playbook.problemToSolve,
    contentLogic: playbook.contentLogic,
    rationale: playbook.rationale,
    collaborationMechanism: playbook.collaborationMechanism,
    systemAutomated: [...systemAutomated],
    operatorRequired: [...OPERATOR_REQUIRED_FALLBACK],
    pendingHypotheses: PENDING_HYPOTHESES_FALLBACK.map(item => ({ id: genId('ph'), ...item })),
    missingItemsToTrack: MISSING_ITEMS_FALLBACK.map(item => ({ id: genId('mi'), ...item }))
  };

  let next = draft;
  STRATEGY_SLOTS
    .filter(slot => !slot.isMerchantFact)
    .forEach(slot => {
      const value = fills[slot.id];
      if (value === undefined) return;
      // 非覆盖模式下，已填的槽位保留操盘手的改动
      if (!overwrite && isSlotFilled(next, slot.id)) return;
      next = setSlotValue(next, slot.id, value);
    });

  return next;
}
