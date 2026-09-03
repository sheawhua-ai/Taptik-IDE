import React, { useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Lock,
  RotateCcw,
  Send,
  Store,
  UserCheck,
} from "lucide-react";
import type { IndustryDefaults, MerchantIndustryProfile } from "../../data/industryCatalog";

export type LaunchGuideTarget =
  | "profile"
  | "knowledge"
  | "materials"
  | "accounts"
  | "scheme"
  | "execution"
  | "review";

interface NewMerchantLaunchGuideProps {
  merchantId: string;
  merchantName: string;
  industryProfile: MerchantIndustryProfile;
  industryDefaults: IndustryDefaults;
  isRevisit?: boolean;
  onNavigate: (target: LaunchGuideTarget) => void;
  onUseTemplate: () => void;
  onFinish: () => void;
  publishTaskReady?: boolean;
  reviewDataReady?: boolean;
}

type GuideStatus = "completed" | "recommended" | "available" | "fallback" | "locked";

interface LaunchStep {
  id: "profile" | "knowledge" | "accounts" | "scheme" | "materials" | "publish" | "review";
  title: string;
  capability: string;
  problemSolved: string;
  systemActions: string[];
  operatorActions: string[];
  result: string;
  actionLabel?: string;
  target?: LaunchGuideTarget;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface PersistedGuideState {
  templateApplied: boolean;
  completedStepIds?: string[];
}

const GUIDE_STEPS: LaunchStep[] = [
  {
    id: "profile",
    title: "确认商家信息",
    capability: "商家档案",
    problemSolved: "先把卖什么、卖给谁、这次想达成什么说清楚。",
    systemActions: ["整理行业和品类", "后续方案自动带入商家信息"],
    operatorActions: ["确认主营产品或服务", "确认目标人群、经营目标和禁用说法"],
    result: "后续生成内容时，不再重复询问基础信息。",
    actionLabel: "查看商家档案",
    target: "profile",
    icon: Store,
  },
  {
    id: "knowledge",
    title: "补充运营知识",
    capability: "知识与记忆",
    problemSolved: "让内容说得准、不出错、不违规。",
    systemActions: ["优先使用商家资料", "没有的用行业知识补充", "自动检查平台和行业禁区"],
    operatorActions: ["加入产品资料、常见问题和品牌说法", "确认价格、功效和服务范围"],
    result: "内容有据可查，也能看清信息来自商家还是行业。",
    actionLabel: "去补充知识",
    target: "knowledge",
    icon: BookOpen,
  },
  {
    id: "accounts",
    title: "绑定账号和员工",
    capability: "账号资产",
    problemSolved: "明确用哪个账号发、谁负责执行。",
    systemActions: ["读取可用账号和账号定位", "按账号安排内容和任务"],
    operatorActions: ["添加品牌号、员工号等账号", "绑定负责发布的人"],
    result: "方案按真实账号分工，任务能找到执行人。",
    actionLabel: "去绑定账号",
    target: "accounts",
    icon: UserCheck,
  },
  {
    id: "scheme",
    title: "生成第一份方案",
    capability: "方案中心",
    problemSolved: "把目标、内容、素材和账号安排成可执行计划。",
    systemActions: ["套用行业默认打法", "使用商家和行业知识", "生成内容计划、素材需求和复盘指标"],
    operatorActions: ["确认主推产品和目标", "调整周期、篇数和账号安排", "确认引用信息和暂定假设"],
    result: "一份可以修改和确认的方案草稿。",
    actionLabel: "生成方案草稿",
    target: "scheme",
    icon: Layers,
  },
  {
    id: "materials",
    title: "准备和验收素材",
    capability: "素材中心 · 执行中心",
    problemSolved: "看清已有素材够不够，缺什么就安排补拍。",
    systemActions: ["识别图片和视频内容", "按方案生成补拍要求", "检查回传素材是否清楚、完整"],
    operatorActions: ["加入已有素材", "派发补拍任务", "验收通过或要求重拍"],
    result: "拿到可用素材，补拍任务也能跟进。",
    actionLabel: "去准备素材",
    target: "materials",
    icon: ImageIcon,
  },
  {
    id: "publish",
    title: "审核并发布内容",
    capability: "执行中心",
    problemSolved: "让内容有人审、有人发，发完能回传。",
    systemActions: ["按方案生成内容", "匹配素材并提前检查", "通知员工或生成外部任务入口"],
    operatorActions: ["确认事实、口吻和素材", "确认发布账号和时间", "处理逾期、退回和异常"],
    result: "得到发布链接和可跟踪的发布记录。",
    actionLabel: "去审核发布",
    target: "execution",
    icon: Send,
  },
  {
    id: "review",
    title: "看数据并复盘",
    capability: "复盘与报告",
    problemSolved: "看清哪些内容有效，下一轮怎么改。",
    systemActions: ["汇总发布、搜索、互动和咨询数据", "找出有效内容和异常", "给出下一轮建议"],
    operatorActions: ["确认数据是否完整", "决定是否采用建议", "把有效经验存入商家知识"],
    result: "得到本轮结论和下一轮调整方案。",
    actionLabel: "去看复盘",
    target: "review",
    icon: RotateCcw,
  },
];

const STATUS_META: Record<GuideStatus, { label: string; className: string }> = {
  completed: { label: "已完成", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  recommended: { label: "建议先做", className: "border-neutral-900 bg-neutral-900 text-white" },
  available: { label: "可开始", className: "border-border-default bg-surface-1 text-text-secondary" },
  fallback: { label: "可先用行业知识", className: "border-amber-200 bg-amber-50 text-amber-800" },
  locked: { label: "暂未开放", className: "border-border-default bg-surface-selected text-text-tertiary" },
};

function loadGuideState(storageKey: string): PersistedGuideState {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored) as PersistedGuideState;
  } catch {
    // Start from the real business defaults when local state is unavailable.
  }
  return { templateApplied: false };
}

export function NewMerchantLaunchGuide({
  merchantId,
  merchantName,
  industryProfile,
  industryDefaults,
  isRevisit = false,
  onNavigate,
  onUseTemplate,
  onFinish,
  publishTaskReady = false,
  reviewDataReady = false,
}: NewMerchantLaunchGuideProps) {
  const storageKey = `taptik:new-merchant-guide:${merchantId}`;
  const [initialState] = useState<PersistedGuideState>(() => loadGuideState(storageKey));
  const [templateApplied] = useState(initialState.templateApplied);
  const [expandedStepId, setExpandedStepId] = useState<string>(templateApplied ? "materials" : "knowledge");
  const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);

  const stepStatuses: Record<LaunchStep["id"], GuideStatus> = {
    profile: "completed",
    knowledge: templateApplied ? "available" : "recommended",
    accounts: "available",
    scheme: templateApplied ? "completed" : "fallback",
    materials: templateApplied ? "recommended" : "available",
    publish: publishTaskReady ? "available" : "locked",
    review: reviewDataReady ? "available" : "locked",
  };

  const completedCount = Object.values(stepStatuses).filter(status => status === "completed").length;
  const progress = Math.round((completedCount / GUIDE_STEPS.length) * 100);

  const handleStepAction = (step: LaunchStep) => {
    if (!step.target || stepStatuses[step.id] === "locked") return;
    if (step.target === "scheme") {
      onUseTemplate();
      return;
    }
    onNavigate(step.target);
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-sm">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border-default px-5 py-4">
          <div>
            <h3 className="text-[15px] font-semibold text-text-main">第一次运营怎么做</h3>
            <p className="mt-1 text-[13px] text-text-tertiary">每一步都告诉你：系统做什么、你要做什么、去哪里操作。</p>
            {!isRevisit ? <p className="mt-1 text-[12px] text-text-tertiary">跳过后，还能从商家运营右上角重新打开。</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsGuideCollapsed(current => !current)} className="rounded-lg border border-border-default px-3 py-1.5 text-[13px] text-text-secondary hover:bg-hover-bg">{isGuideCollapsed ? "展开指南" : "收起指南"}</button>
            <button
              type="button"
              onClick={onFinish}
              title={isRevisit ? "返回方案中心" : "跳过本次首轮起盘，之后可从右上角重新打开"}
              className="px-2 py-1.5 text-[13px] text-text-tertiary hover:text-text-main"
            >
              {isRevisit ? "返回方案中心" : "跳过首轮起盘"}
            </button>
          </div>
        </header>

        <div className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-selected"><div className="h-full rounded-full bg-brand-logo transition-all" style={{ width: `${progress}%` }} /></div>
            <span className="shrink-0 text-[12px] tabular-nums text-text-tertiary">已完成 {completedCount}/{GUIDE_STEPS.length}</span>
          </div>
        </div>

        {!isGuideCollapsed ? (
          <div className="border-t border-border-default">
            {GUIDE_STEPS.map((step, index) => {
              const status = stepStatuses[step.id];
              const meta = STATUS_META[status];
              const expanded = expandedStepId === step.id;
              const locked = status === "locked";
              const StepIcon = step.icon;
              return (
                <article key={step.id} className="border-b border-border-subtle last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setExpandedStepId(expanded ? "" : step.id)}
                    className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${locked ? "bg-surface-subtle/60" : "hover:bg-surface-subtle"}`}
                    aria-expanded={expanded}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold ${status === "completed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : locked ? "border-border-default bg-surface-selected text-text-tertiary" : "border-border-default bg-surface-1 text-text-secondary"}`}>
                      {status === "completed" ? <Check size={14} /> : locked ? <Lock size={12} /> : index + 1}
                    </span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-surface-selected text-text-secondary"}`}><StepIcon size={16} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2"><strong className={`text-[13px] font-semibold ${locked ? "text-text-tertiary" : "text-text-main"}`}>{step.title}</strong><span className="text-[12px] text-text-tertiary">在「{step.capability}」操作</span></span>
                      <span className="mt-1 block truncate text-[12px] text-text-tertiary">作用：{step.problemSolved}</span>
                    </span>
                    <span className={`hidden rounded-full border px-2 py-0.5 text-[11px] font-medium sm:inline-flex ${meta.className}`}>{meta.label}</span>
                    <ChevronDown size={15} className={`text-text-tertiary transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>

                  {expanded ? (
                    <div className="bg-surface-subtle px-5 pb-4 pt-1 sm:pl-[92px]">
                      <div className="grid gap-3 lg:grid-cols-3">
                        <div className="rounded-xl border border-border-default bg-surface-1 p-3.5">
                          <div className="text-[12px] font-semibold text-text-main">系统帮你做</div>
                          <ul className="mt-2 space-y-1.5">{step.systemActions.map(item => <li key={item} className="flex gap-2 text-[12px] leading-5 text-text-secondary"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-600" />{item}</li>)}</ul>
                        </div>
                        <div className="rounded-xl border border-border-default bg-surface-1 p-3.5">
                          <div className="text-[12px] font-semibold text-text-main">你来确认</div>
                          <ul className="mt-2 space-y-1.5">{step.operatorActions.map(item => <li key={item} className="flex gap-2 text-[12px] leading-5 text-text-secondary"><CircleDot size={12} className="mt-1 shrink-0 text-text-tertiary" />{item}</li>)}</ul>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                          <div className="text-[12px] font-semibold text-emerald-900">完成后</div>
                          <p className="mt-2 text-[12px] leading-5 text-emerald-900/80">{step.result}</p>
                        </div>
                      </div>

                      {step.id === "knowledge" ? (
                        <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                          <span className="rounded-lg border border-border-default bg-surface-1 px-2.5 py-1.5 text-text-secondary">商家资料优先</span>
                          <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-amber-800">缺少的用行业知识补上</span>
                          <span className="rounded-lg border border-border-default bg-surface-1 px-2.5 py-1.5 text-text-secondary">禁用规则按更严格的执行</span>
                        </div>
                      ) : null}

                      {locked ? (
                        <div className="mt-3 rounded-lg border border-border-default bg-surface-1 px-3 py-2.5 text-[12px] text-text-tertiary">
                          {step.id === "publish" ? "确认方案并生成内容后开放。现在可以先看说明。" : "有内容发布并回传数据后开放。现在可以先看说明。"}
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {step.actionLabel && step.target ? (
                          <button type="button" disabled={locked} onClick={() => handleStepAction(step)} className="inline-flex items-center gap-1.5 rounded-lg bg-btn-main px-3 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover disabled:cursor-not-allowed disabled:opacity-40"><ExternalLink size={13} />{step.actionLabel}</button>
                        ) : null}
                        <span className="text-[12px] text-text-tertiary">进度自动更新，不用手动勾选。</span>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
