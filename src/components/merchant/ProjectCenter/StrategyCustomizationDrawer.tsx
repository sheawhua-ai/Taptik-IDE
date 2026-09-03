import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle, BookOpen, Bot, Calendar, Check, Eye, FileText,
  Hand, Pencil, Plus, ShieldAlert, SlidersHorizontal, Target, Trash2, Users, X
} from "lucide-react";
import { Project } from "../../../data/projectStore";
import { StrategyConfiguration, StrategyVersion } from "../../../data/unifiedStore";
import { formatChineseDate } from "../../../utils/formatDate";
import { ChipSelectList } from "./ChipSelectList";
import { BasisItemList, BasisSuggestion } from "./BasisItemList";

interface StrategyCustomizationDrawerProps {
  project: Project;
  activeVersion?: StrategyVersion;
  versions: StrategyVersion[];
  onSave: (configuration: StrategyConfiguration, changedFields: string[]) => void;
  onClose: () => void;
}

const sourceLabel: Record<StrategyVersion["source"], string> = {
  initial: "首次方案生成",
  expert_adjustment: "编辑调整",
  review_applied: "复盘建议已应用"
};

// 与新建方案一致的完整可编辑结构（这些字段保证非空，便于编辑）
interface EditorForm extends StrategyConfiguration {
  targetKeywords: string[];
  observationDays: number;
  observableSignals: string[];
  promotionTarget: { targetName: string; targetCategory: string };
  promotionConfirmedFacts: Array<{ label: string; detail: string; source: string }>;
  unconfirmedGaps: string[];
  auxiliaryGoals: string[];
  rationale: string;
  collaborationMechanism: string;
  humanInTheLoop: { systemAutomated: string[]; operatorRequired: string[] };
  hypothesesAndBasis: {
    confirmedFacts: Array<{ id: string; text: string; source: string }>;
    pendingHypotheses: Array<{ id: string; text: string; basis: string; status: string }>;
    missingItemsToTrack: Array<{ id: string; text: string; impact: string }>;
  };
}

const emptyBasis = () => ({
  confirmedFacts: [] as Array<{ id: string; text: string; source: string }>,
  pendingHypotheses: [] as Array<{ id: string; text: string; basis: string; status: string }>,
  missingItemsToTrack: [] as Array<{ id: string; text: string; impact: string }>
});

const genId = () => `it_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// 预设建议值（行业通用判断，操盘手勾选而非从零手敲）
const SIGNAL_SUGGESTIONS: string[] = [
  "目标搜索词排名前 3 位出现矩阵笔记",
  "发布 48h 内自然搜索带来的评论 / 私信咨询量",
  "单篇收藏率与互动量（赞藏评）",
  "真实素材 / 打卡记录沉淀数量",
  "到店 / 领样核销量",
  "搜索来源流量占比"
];

const SYSTEM_AUTOMATION_SUGGESTIONS: string[] = [
  "读取商家资料、质检报告与禁用词规则",
  "依据打法规则生成内容骨架与搜索词卡位",
  "自动拆解素材清单并生成待办拍摄需求",
  "合规违禁词实时预检扫描",
  "自动监控搜索收录排名与异常提醒"
];

const OPERATOR_REQUIRED_SUGGESTIONS: string[] = [
  "确认产品事实与质检批次合规性",
  "审核 AI 内容草稿是否符合品牌口吻",
  "验收素材回传质量",
  "确认发布并完成首小时互动",
  "处理授权失效或平台异常通知"
];

// 假设与依据的预置模板（行业通用判断，操盘手一键加入而非从零手敲）
const CONFIRMED_FACT_SUGGESTIONS: BasisSuggestion[] = [
  { text: "产品已取得合规质检与功效资质", meta: "质检报告" },
  { text: "核心卖点有真实功效依据", meta: "功效报告" },
  { text: "品牌已有店铺 / 商品承接能力", meta: "内部确认" },
  { text: "目标人群核心痛点为具体需求", meta: "用户调研" },
  { text: "目标搜索词在平台有稳定搜索量", meta: "平台搜索数据" }
];

const PENDING_HYPOTHESIS_SUGGESTIONS: BasisSuggestion[] = [
  { text: "搜索占位类内容能带动进店转化", meta: "行业经验" },
  { text: "测评类内容比清单类收藏率更高", meta: "账号历史表现" },
  { text: "KOS 专业测评能建立成分信任", meta: "品类逻辑" },
  { text: "场景种草内容更易引发互动", meta: "行业经验" }
];

const MISSING_ITEM_SUGGESTIONS: BasisSuggestion[] = [
  { text: "暂缺目标关键词实时排名基准", meta: "先不设排名 KPI" },
  { text: "暂缺领样核销率基准数据", meta: "到店转化作辅助观察" },
  { text: "暂缺竞品投放节奏数据", meta: "难以对标" }
];

const FIELD_LABELS: Array<[keyof StrategyConfiguration, string]> = [
  ["coreProblem", "核心问题"],
  ["targetAudience", "目标人群"],
  ["solutionSummary", "内容方法"],
  ["verifyHypothesis", "验证目标"],
  ["continueCondition", "继续铺量条件"],
  ["stopCondition", "暂停条件"],
  ["adjustmentCriteria", "调整条件"],
  ["targetKeywords", "目标关键词"],
  ["observationDays", "观察周期"],
  ["observableSignals", "可观察信号"],
  ["promotionTarget", "主推产品"],
  ["promotionConfirmedFacts", "推广对象已确认事实"],
  ["unconfirmedGaps", "待确认缺口"],
  ["auxiliaryGoals", "辅助观察项"],
  ["rationale", "选择打法原因"],
  ["collaborationMechanism", "账号与动作协同"],
  ["humanInTheLoop", "人在环路"],
  ["hypothesesAndBasis", "假设依据"]
];

function buildInitial(project: Project, activeVersion?: StrategyVersion): EditorForm {
  const p = project.strategyProtocol as StrategyConfiguration | undefined;
  const c = activeVersion?.configuration;
  const h = c?.humanInTheLoop || p?.humanInTheLoop;
  const hb = c?.hypothesesAndBasis || p?.hypothesesAndBasis;
  const pt = c?.promotionTarget || p?.promotionTarget;
  const pcf = c?.promotionConfirmedFacts || p?.promotionConfirmedFacts;
  return {
    coreProblem: c?.coreProblem || p?.coreProblem || project.goal || "",
    targetAudience: c?.targetAudience || p?.targetAudience || "",
    solutionSummary: c?.solutionSummary || p?.solutionSummary || "",
    verifyHypothesis: c?.verifyHypothesis || p?.verifyHypothesis || "",
    continueCondition: c?.continueCondition || p?.continueCondition || "",
    stopCondition: c?.stopCondition || p?.stopCondition || "",
    adjustmentCriteria: c?.adjustmentCriteria || p?.adjustmentCriteria || "",
    targetKeywords: c?.targetKeywords?.length ? [...c.targetKeywords] : [...(p?.targetKeywords || [])],
    observationDays: c?.observationDays || p?.observationDays || 14,
    observableSignals: [...(c?.observableSignals?.length ? c.observableSignals : (p?.observableSignals || []))],
    // —— 与新建方案推广对象槽位对齐 ——
    promotionTarget: {
      targetName: pt?.targetName || "",
      targetCategory: pt?.targetCategory || ""
    },
    promotionConfirmedFacts: (pcf || []).map(item => ({ ...item })),
    unconfirmedGaps: [...(c?.unconfirmedGaps?.length ? c.unconfirmedGaps : (p?.unconfirmedGaps || []))],
    auxiliaryGoals: [...(c?.auxiliaryGoals?.length ? c.auxiliaryGoals : (p?.auxiliaryGoals || []))],
    rationale: c?.rationale || p?.rationale || "",
    collaborationMechanism: c?.collaborationMechanism || p?.collaborationMechanism || "",
    humanInTheLoop: {
      systemAutomated: [...(h?.systemAutomated || [])],
      operatorRequired: [...(h?.operatorRequired || [])]
    },
    hypothesesAndBasis: hb
      ? {
          confirmedFacts: hb.confirmedFacts.map(item => ({ ...item })),
          pendingHypotheses: hb.pendingHypotheses.map(item => ({ ...item })),
          missingItemsToTrack: hb.missingItemsToTrack.map(item => ({ ...item }))
        }
      : emptyBasis()
  };
}

function countNotesByType(project: Project, type: string): number {
  return project.notes?.filter((note) => note.type === type).length ?? 0;
}

function resolveSubjectCounts(project: Project) {
  const scheme = project.distributionScheme;
  const brand = scheme?.brandTotalNotes ?? countNotesByType(project, "品牌主号");
  const kos = scheme?.kosTotalNotes ?? countNotesByType(project, "店长号/KOS");
  const koc = scheme?.kocTotalNotes ?? countNotesByType(project, "KOC");
  const total = scheme?.totalPlannedNotes ?? (project.notes?.length ?? 0);
  return { brand, kos, koc, total };
}

function subjectLabel(role: string, _persona?: string): string {
  return role;
}

// ========================================================
// 只读详情视图（「查看详情」默认态，与编辑态字段一一对应）
// ========================================================
function StrategyReadonlyView({ form, project }: { form: EditorForm; project: Project }) {
  const subjects = resolveSubjectCounts(project);
  const signals = form.observableSignals;
  const systemAutomated = form.humanInTheLoop.systemAutomated;
  const operatorRequired = form.humanInTheLoop.operatorRequired;
  const confirmedFacts = form.hypothesesAndBasis.confirmedFacts;
  const pendingHypotheses = form.hypothesesAndBasis.pendingHypotheses;
  const missingItems = form.hypothesesAndBasis.missingItemsToTrack;
  const promotionFacts = form.promotionConfirmedFacts;
  const gaps = form.unconfirmedGaps;
  const auxGoals = form.auxiliaryGoals;
  const hasPromotionBlock = form.promotionTarget.targetName || form.promotionTarget.targetCategory || promotionFacts.length > 0 || gaps.length > 0;

  const cardCls = "rounded-xl border border-border-default bg-surface-1 p-5 space-y-4";
  const blockCls = "bg-surface-subtle p-3 rounded-lg border border-border-default leading-relaxed";
  const fieldLabelCls = "text-[13px] text-text-tertiary font-normal mb-1";

  return (
    <div className="space-y-5">
      {/* 0. 推广对象（与新建方案「主推产品」槽位对应） */}
      {hasPromotionBlock ? (
        <div className={cardCls}>
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
            <Target size={16} className="text-text-secondary" />推广对象
          </h3>
          {form.promotionTarget.targetName ? (
            <div className="grid grid-cols-2 gap-3">
              <div className={blockCls}>
                <div className="text-[13px] text-text-tertiary font-normal">主推产品 / 服务</div>
                <div className="text-[14px] font-semibold text-text-main mt-0.5">{form.promotionTarget.targetName}</div>
              </div>
              {form.promotionTarget.targetCategory ? (
                <div className={blockCls}>
                  <div className="text-[13px] text-text-tertiary font-normal">所属品类</div>
                  <div className="text-[14px] font-medium text-text-main mt-0.5">{form.promotionTarget.targetCategory}</div>
                </div>
              ) : null}
            </div>
          ) : null}
          {promotionFacts.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><BookOpen size={13} />推广对象已确认事实</div>
              <div className="space-y-1.5">
                {promotionFacts.map((fact, index) => (
                  <div key={index} className="flex items-start gap-2 text-text-secondary text-[13px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    <span className="leading-relaxed">{fact.label}<span className="text-text-tertiary">（来源：{fact.source || "未标注"}）</span></span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {gaps.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><AlertCircle size={13} className="text-amber-500" />待确认缺口</div>
              <div className="flex flex-wrap gap-1.5">
                {gaps.map((gap, index) => (
                  <span key={index} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[12px] text-amber-700">{gap}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* 1. 核心问题与目标用户 */}
      <div className={cardCls}>
        <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
          <Target size={16} className="text-text-secondary" />核心定位
        </h3>
        <div className="space-y-3 text-[13px]">
          <div>
            <div className={fieldLabelCls}>解决的核心问题</div>
            <div className={`${blockCls} font-medium text-text-main`}>{form.coreProblem || project.goal}</div>
          </div>
          <div>
            <div className={fieldLabelCls}>目标受众与客群</div>
            <div className={`${blockCls} text-text-secondary`}>{form.targetAudience || "待结合商家资料确认"}</div>
          </div>
        </div>
      </div>

      {/* 2. 内容方法与主体组合 */}
      <div className={cardCls}>
        <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
          <Users size={16} className="text-text-secondary" />内容方法与主体组合
        </h3>
        <div className="space-y-3 text-[13px]">
          <div>
            <div className={fieldLabelCls}>内容方法概要</div>
            <div className={`${blockCls} text-text-main`}>{form.solutionSummary || form.coreProblem}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className={blockCls}>
              <div className="text-[13px] text-text-tertiary font-normal">计划总篇数</div>
              <div className="text-[15px] font-semibold text-text-main mt-0.5 tabular-nums">{subjects.total || project.notes?.length || 0} 篇</div>
            </div>
            <div className={blockCls}>
              <div className="text-[13px] text-text-tertiary font-normal">观察周期</div>
              <div className="text-[13px] font-semibold text-text-main mt-0.5 tabular-nums">发布后 {form.observationDays} 天</div>
            </div>
          </div>

          <div>
            <div className="text-[13px] text-text-tertiary font-normal mb-1">目标关键词</div>
            <div className={`${blockCls} text-text-secondary`}>{form.targetKeywords.length ? form.targetKeywords.join("、") : "未设置"}</div>
          </div>

          <div>
            <div className="text-[13px] text-text-tertiary font-normal mb-1.5">发布主体结构</div>
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between p-2.5 bg-surface-subtle rounded-lg border border-border-default">
                <span className="font-normal text-text-secondary">{subjectLabel("品牌官方号")}</span>
                <span className="font-medium text-text-main tabular-nums">{subjects.brand} 篇</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-surface-subtle rounded-lg border border-border-default">
                <span className="font-normal text-text-secondary">{subjectLabel("店长号 / KOS")}</span>
                <span className="font-medium text-text-main tabular-nums">{subjects.kos} 篇</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-surface-subtle rounded-lg border border-border-default">
                <span className="font-normal text-text-secondary">{subjectLabel("消费者 KOC")}</span>
                <span className="font-medium text-text-main tabular-nums">{subjects.koc} 篇</span>
              </div>
              <p className="text-[12px] text-text-tertiary mt-2 leading-relaxed">账号人设在「账号资产」独立维护，方案这里只展示各角色已分配的篇数。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 核心策略与执行条件 */}
      <div className={cardCls}>
        <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
          <FileText size={16} className="text-text-secondary" />核心策略与执行条件
        </h3>
        <div className="space-y-3 text-[13px]">
          <div>
            <div className={fieldLabelCls}>预期策略目标</div>
            <div className={`${blockCls} text-text-main`}>{form.verifyHypothesis || form.coreProblem}</div>
          </div>

          {signals.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><Eye size={13} />可观察验证信号</div>
              <div className="space-y-1.5">
                {signals.map((signal, index) => (
                  <div key={index} className="flex items-start gap-2 text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-btn-main" />
                    <span className="leading-relaxed">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {auxGoals.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><Target size={13} />辅助观察项</div>
              <div className="flex flex-wrap gap-1.5">
                {auxGoals.map((goal, index) => (
                  <span key={index} className="rounded-full border border-border-default bg-surface-subtle px-2.5 py-1 text-[12px] text-text-secondary">{goal}</span>
                ))}
              </div>
            </div>
          ) : null}

          {form.rationale ? (
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
              <div className="text-[13px] font-medium text-text-main mb-1">选择此打法原因</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{form.rationale}</div>
            </div>
          ) : null}

          {form.collaborationMechanism ? (
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
              <div className="text-[13px] font-medium text-text-main mb-1">账号与动作协同</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{form.collaborationMechanism}</div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
              <div className="text-[13px] font-medium text-text-main mb-1">继续推进条件</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{form.continueCondition || "未设置"}</div>
            </div>
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
              <div className="text-[13px] font-medium text-text-main mb-1">调整或暂停条件</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{form.stopCondition || "未设置"}</div>
            </div>
          </div>

          {form.adjustmentCriteria ? (
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
              <div className="text-[13px] font-medium text-text-main mb-1">何时调整打法</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{form.adjustmentCriteria}</div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 4. 人在环路 */}
      {systemAutomated.length > 0 || operatorRequired.length > 0 ? (
        <div className={cardCls}>
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
            <ShieldAlert size={16} className="text-danger" />执行边界与人在环路
          </h3>
          {systemAutomated.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><Bot size={13} />系统自动化</div>
              <div className="space-y-1.5">
                {systemAutomated.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-text-secondary text-[13px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {operatorRequired.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><Hand size={13} />操盘手必做</div>
              <div className="space-y-1.5">
                {operatorRequired.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-text-secondary text-[13px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-btn-main" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* 5. 假设与依据 */}
      {confirmedFacts.length > 0 || pendingHypotheses.length > 0 ? (
        <div className={cardCls}>
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
            <BookOpen size={16} className="text-text-secondary" />假设与依据
          </h3>
          {confirmedFacts.length > 0 ? (
            <div>
              <div className="mb-1.5 text-[13px] text-text-tertiary font-normal">已确认事实</div>
              <div className="space-y-1.5">
                {confirmedFacts.map((fact) => (
                  <div key={fact.id} className="flex items-start gap-2 text-text-secondary text-[13px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    <span className="leading-relaxed">{fact.text}<span className="text-text-tertiary">（{fact.source}）</span></span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {pendingHypotheses.length > 0 ? (
            <div>
              <div className="mb-1.5 text-[13px] text-text-tertiary font-normal">待验证假设</div>
              <div className="space-y-2">
                {pendingHypotheses.map((hypothesis) => (
                  <div key={hypothesis.id} className="p-2.5 bg-surface-subtle rounded-lg border border-border-default">
                    <div className="text-[13px] text-text-secondary leading-relaxed">{hypothesis.text}</div>
                    <div className="text-[12px] text-text-tertiary mt-1 leading-relaxed">依据：{hypothesis.basis}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {missingItems.length > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-text-tertiary font-normal"><Calendar size={13} />待追踪缺失项</div>
              <div className="space-y-1.5">
                {missingItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 text-text-secondary text-[13px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span className="leading-relaxed">{item.text}<span className="text-text-tertiary">（影响：{item.impact}）</span></span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function VersionHistory({ versions, activeVersion }: { versions: StrategyVersion[]; activeVersion?: StrategyVersion }) {
  return (
    <div className="rounded-xl border border-border-default p-4">
      <div className="mb-3 text-[13px] font-medium text-text-main">版本记录</div>
      <div className="space-y-2">
        {[...versions].sort((a, b) => b.version - a.version).map(version => (
          <div key={version.id} className="flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-main">V{version.version}</span>
              <span className="text-text-secondary">{sourceLabel[version.source]}</span>
              {version.status === "active" && <span className="rounded bg-success-light px-1.5 py-0.5 text-success">当前</span>}
            </div>
            <span className="text-text-tertiary">{formatChineseDate(version.createdAt, true)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StrategyCustomizationDrawer({
  project,
  activeVersion,
  versions,
  onSave,
  onClose
}: StrategyCustomizationDrawerProps) {
  const initial = useMemo(() => buildInitial(project, activeVersion), [project, activeVersion]);
  const [form, setForm] = useState<EditorForm>(initial);
  const [keywordText, setKeywordText] = useState(initial.targetKeywords.join("、"));
  const [mode, setMode] = useState<"view" | "edit">("view");

  const update = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) =>
    setForm(current => ({ ...current, [key]: value }));

  const updateBasis = <K extends keyof EditorForm["hypothesesAndBasis"]>(key: K, next: EditorForm["hypothesesAndBasis"][K]) =>
    setForm(current => ({ ...current, hypothesesAndBasis: { ...current.hypothesesAndBasis, [key]: next } }));

  const enterEdit = () => setMode("edit");

  const cancelEdit = () => {
    setForm(initial);
    setKeywordText(initial.targetKeywords.join("、"));
    setMode("view");
  };

  const save = () => {
    const configuration: StrategyConfiguration = {
      ...form,
      targetKeywords: keywordText.split(/[、,，\n]/).map(keyword => keyword.trim()).filter(Boolean)
    };

    const changedFields = FIELD_LABELS
      .filter(([key]) => {
        const before = initial[key];
        const after = configuration[key];
        return JSON.stringify(before ?? null) !== JSON.stringify(after ?? null);
      })
      .map(([, label]) => label);

    if (changedFields.length === 0) {
      onClose();
      return;
    }
    onSave(configuration, changedFields);
  };

  const inputCls = "w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 text-text-main outline-none focus:border-neutral-500 bg-surface-1 resize-none";
  const labelCls = "text-[13px] font-semibold text-text-main mb-1.5 block";
  const cardCls = "rounded-xl border border-border-default bg-surface-1 p-5 space-y-4";
  const sublabelCls = "text-[13px] text-text-tertiary font-normal mb-1.5";

  return (
    <div className="fixed inset-0 z-[160] flex justify-end">
      <div className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative z-10 flex h-full w-full max-w-[620px] flex-col border-l border-border-default bg-surface-1 shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-border-default p-5">
          <div>
            <div className="flex items-center gap-2">
              {mode === "view" ? (
                <Eye size={17} className="text-text-secondary" />
              ) : (
                <SlidersHorizontal size={17} className="text-text-secondary" />
              )}
              <h2 className="text-[16px] font-semibold text-text-main">{mode === "view" ? "查看详情" : "编辑运营逻辑"}</h2>
              <span className="rounded-md border border-border-default bg-surface-subtle px-2 py-0.5 text-[13px] text-text-secondary">
                当前 V{activeVersion?.version || 1}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-text-tertiary">
              {mode === "view" ? "查看当前运营逻辑的完整信息。" : "调整运营逻辑并生成一个新版本。"}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-text-tertiary hover:bg-hover-bg hover:text-text-main">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {mode === "view" ? (
            <>
              <StrategyReadonlyView form={initial} project={project} />
              <VersionHistory versions={versions} activeVersion={activeVersion} />
            </>
          ) : (
            <>
              <div className="flex gap-2.5 rounded-xl border border-info/20 bg-info-light p-3.5 text-[13px] leading-relaxed text-text-secondary">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-info" />
                <span>保存后仅影响之后生成的笔记。已生成、待发布和已发布笔记继续绑定原策略版本，不会被改写。</span>
              </div>

              {/* 0. 推广对象 */}
              <div className={cardCls}>
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <Target size={16} className="text-text-secondary" />推广对象
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1.5">
                    <span className={labelCls}>主推产品 / 服务</span>
                    <input value={form.promotionTarget.targetName} onChange={event => update("promotionTarget", { ...form.promotionTarget, targetName: event.target.value })} placeholder="这轮主要推广什么" className={inputCls} />
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>所属品类</span>
                    <input value={form.promotionTarget.targetCategory} onChange={event => update("promotionTarget", { ...form.promotionTarget, targetCategory: event.target.value })} placeholder="可选" className={inputCls} />
                  </label>
                </div>

                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><BookOpen size={13} />推广对象已确认事实</div>
                  <div className="space-y-2">
                    {form.promotionConfirmedFacts.map((fact, index) => (
                      <div key={index} className="space-y-1.5 rounded-lg border border-border-default p-2.5">
                        <input
                          value={fact.label}
                          onChange={event => update("promotionConfirmedFacts", form.promotionConfirmedFacts.map((it, i) => i === index ? { ...it, label: event.target.value } : it))}
                          placeholder="事实描述"
                          className={inputCls}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            value={fact.source}
                            onChange={event => update("promotionConfirmedFacts", form.promotionConfirmedFacts.map((it, i) => i === index ? { ...it, source: event.target.value } : it))}
                            placeholder="来源"
                            className={inputCls}
                          />
                          <button onClick={() => update("promotionConfirmedFacts", form.promotionConfirmedFacts.filter((_, i) => i !== index))} className="shrink-0 p-2 text-text-tertiary hover:text-danger">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {form.promotionConfirmedFacts.length === 0 ? (
                      <div className="text-[12px] text-text-tertiary">未添加，可自定义添加事实与来源。</div>
                    ) : null}
                    <button onClick={() => update("promotionConfirmedFacts", [...form.promotionConfirmedFacts, { label: "", detail: "", source: "" }])} className="flex items-center gap-1 text-[13px] text-text-secondary hover:text-text-main">
                      <Plus size={14} />添加事实
                    </button>
                  </div>
                </div>

                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><AlertCircle size={13} className="text-amber-500" />待确认缺口</div>
                  <ChipSelectList
                    value={form.unconfirmedGaps}
                    suggestions={[]}
                    onChange={next => update("unconfirmedGaps", next)}
                    addPlaceholder="添加待确认缺口"
                  />
                </div>
              </div>

              {/* 1. 核心定位 */}
              <div className={cardCls}>
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <Target size={16} className="text-text-secondary" />核心定位
                </h3>
                <label className="space-y-1.5">
                  <span className={labelCls}>核心问题</span>
                  <textarea rows={3} value={form.coreProblem} onChange={event => update("coreProblem", event.target.value)} className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className={labelCls}>目标人群</span>
                  <textarea rows={2} value={form.targetAudience} onChange={event => update("targetAudience", event.target.value)} className={inputCls} />
                </label>
              </div>

              {/* 2. 内容方法 */}
              <div className={cardCls}>
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <Users size={16} className="text-text-secondary" />内容方法
                </h3>
                <label className="space-y-1.5">
                  <span className={labelCls}>内容方法概要</span>
                  <textarea rows={3} value={form.solutionSummary} onChange={event => update("solutionSummary", event.target.value)} className={inputCls} />
                </label>
                <label className="space-y-1.5">
                  <span className={labelCls}>目标关键词</span>
                  <input value={keywordText} onChange={event => setKeywordText(event.target.value)} placeholder="用顿号或逗号分隔" className={inputCls} />
                  <span className="block text-[12px] text-text-tertiary">用于发布后调用关键词搜索接口，比对平台笔记 ID 和排名。</span>
                </label>

                <div className="rounded-xl border border-border-default bg-surface-subtle p-3 text-[12px] leading-5 text-text-secondary">
                  <strong className="block text-text-main mb-0.5">账号人设在账号管理维护</strong>
                  每个账号的人设信息（专业科普官 / 门店实操顾问 / 真实铲屎官等）已在「账号资产」中独立维护。本方案无需重复填写，账号级别的人设会随参与账号自动带入。
                </div>
              </div>

              {/* 3. 验证与执行条件 */}
              <div className={cardCls}>
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <FileText size={16} className="text-text-secondary" />验证与执行条件
                </h3>
                <label className="space-y-1.5">
                  <span className={labelCls}>验证目标</span>
                  <textarea rows={3} value={form.verifyHypothesis} onChange={event => update("verifyHypothesis", event.target.value)} className={inputCls} />
                </label>

                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><Eye size={13} />可观察验证信号</div>
                  <ChipSelectList
                    value={form.observableSignals}
                    suggestions={SIGNAL_SUGGESTIONS}
                    onChange={next => update("observableSignals", next)}
                    addPlaceholder="自定义添加验证信号"
                  />
                </div>

                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><Target size={13} />辅助观察项</div>
                  <ChipSelectList
                    value={form.auxiliaryGoals}
                    suggestions={[]}
                    onChange={next => update("auxiliaryGoals", next)}
                    addPlaceholder="自定义添加辅助观察项"
                  />
                </div>

                <label className="space-y-1.5">
                  <span className={labelCls}>选择此打法原因</span>
                  <textarea rows={2} value={form.rationale} onChange={event => update("rationale", event.target.value)} className={inputCls} />
                </label>

                <label className="space-y-1.5">
                  <span className={labelCls}>账号与动作协同</span>
                  <textarea rows={2} value={form.collaborationMechanism} onChange={event => update("collaborationMechanism", event.target.value)} className={inputCls} />
                </label>

                <div className="grid grid-cols-1 gap-3">
                  <label className="space-y-1.5">
                    <span className={labelCls}>继续铺量条件</span>
                    <textarea rows={2} value={form.continueCondition} onChange={event => update("continueCondition", event.target.value)} className={inputCls} />
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>暂停或换打法条件</span>
                    <textarea rows={2} value={form.stopCondition} onChange={event => update("stopCondition", event.target.value)} className={inputCls} />
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>何时调整打法</span>
                    <textarea rows={2} value={form.adjustmentCriteria} onChange={event => update("adjustmentCriteria", event.target.value)} className={inputCls} />
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>发布后观察周期</span>
                    <div className="flex items-center gap-2">
                      <input type="number" min={1} max={90} value={form.observationDays} onChange={event => update("observationDays", Number(event.target.value) || 14)} className="w-24 rounded-lg border border-border-default bg-surface-subtle px-3 py-2 text-[13px] outline-none focus:border-border-strong focus:bg-surface-1" />
                      <span className="text-[13px] text-text-secondary">天</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. 执行边界与人在环路 */}
              <div className={cardCls}>
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <ShieldAlert size={16} className="text-danger" />执行边界与人在环路
                </h3>
                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><Bot size={13} />系统自动化</div>
                  <ChipSelectList
                    value={form.humanInTheLoop.systemAutomated}
                    suggestions={SYSTEM_AUTOMATION_SUGGESTIONS}
                    onChange={next => update("humanInTheLoop", { ...form.humanInTheLoop, systemAutomated: next })}
                    addPlaceholder="自定义添加自动化项"
                  />
                </div>
                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><Hand size={13} />操盘手必做</div>
                  <ChipSelectList
                    value={form.humanInTheLoop.operatorRequired}
                    suggestions={OPERATOR_REQUIRED_SUGGESTIONS}
                    onChange={next => update("humanInTheLoop", { ...form.humanInTheLoop, operatorRequired: next })}
                    addPlaceholder="自定义添加人工项"
                  />
                </div>
              </div>

              {/* 5. 假设与依据 */}
              <div className={cardCls}>
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <BookOpen size={16} className="text-text-secondary" />假设与依据
                </h3>

                <div>
                  <div className={sublabelCls}>已确认事实</div>
                  <BasisItemList
                    value={form.hypothesesAndBasis.confirmedFacts}
                    suggestions={CONFIRMED_FACT_SUGGESTIONS}
                    textPlaceholder="事实描述"
                    metaPlaceholder="来源"
                    getMeta={fact => fact.source}
                    setMeta={(fact, source) => ({ ...fact, source })}
                    setText={(fact, text) => ({ ...fact, text })}
                    createFromTemplate={s => ({ id: genId(), text: s.text, source: s.meta })}
                    createBlank={() => ({ id: genId(), text: "", source: "" })}
                    addLabel="添加事实"
                    onChange={next => updateBasis("confirmedFacts", next)}
                  />
                </div>

                <div>
                  <div className={sublabelCls}>待验证假设</div>
                  <BasisItemList
                    value={form.hypothesesAndBasis.pendingHypotheses}
                    suggestions={PENDING_HYPOTHESIS_SUGGESTIONS}
                    textPlaceholder="假设描述"
                    metaPlaceholder="依据"
                    getMeta={h => h.basis}
                    setMeta={(h, basis) => ({ ...h, basis })}
                    setText={(h, text) => ({ ...h, text })}
                    createFromTemplate={s => ({ id: genId(), text: s.text, basis: s.meta, status: "hypothesis" })}
                    createBlank={() => ({ id: genId(), text: "", basis: "", status: "hypothesis" })}
                    addLabel="添加假设"
                    onChange={next => updateBasis("pendingHypotheses", next)}
                  />
                </div>

                <div>
                  <div className={sublabelCls + " flex items-center gap-1.5"}><Calendar size={13} />待追踪缺失项</div>
                  <BasisItemList
                    value={form.hypothesesAndBasis.missingItemsToTrack}
                    suggestions={MISSING_ITEM_SUGGESTIONS}
                    textPlaceholder="缺失项描述"
                    metaPlaceholder="影响"
                    getMeta={item => item.impact}
                    setMeta={(item, impact) => ({ ...item, impact })}
                    setText={(item, text) => ({ ...item, text })}
                    createFromTemplate={s => ({ id: genId(), text: s.text, impact: s.meta })}
                    createBlank={() => ({ id: genId(), text: "", impact: "" })}
                    addLabel="添加缺失项"
                    onChange={next => updateBasis("missingItemsToTrack", next)}
                  />
                </div>
              </div>

              <VersionHistory versions={versions} activeVersion={activeVersion} />
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-border-default p-4">
          {mode === "view" ? (
            <>
              <button onClick={onClose} className="rounded-lg border border-border-default px-4 py-2 text-[13px] text-text-secondary hover:bg-hover-bg">关闭</button>
              <button onClick={enterEdit} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover">
                <Pencil size={14} /> 编辑
              </button>
            </>
          ) : (
            <>
              <span className="text-[13px] text-text-tertiary">保存将创建 V{(activeVersion?.version || 0) + 1}</span>
              <div className="flex gap-2">
                <button onClick={cancelEdit} className="rounded-lg border border-border-default px-4 py-2 text-[13px] text-text-secondary hover:bg-hover-bg">取消</button>
                <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover">
                  <Check size={14} /> 保存为新版本
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
