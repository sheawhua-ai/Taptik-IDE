import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Pencil,
  Plus,
  QrCode,
  RotateCcw,
  Send,
  Sparkles,
  Store,
  Upload,
  UserCheck,
  X,
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
  onNavigate: (target: LaunchGuideTarget) => void;
  onUseTemplate: () => void;
  onFinish: () => void;
}

interface EditableTemplate {
  name: string;
  description: string;
  steps: string[];
  isCustom: boolean;
}

interface LaunchStep {
  id: string;
  title: string;
  capability: string;
  description: string;
  reason: string;
  howTo: string[];
  result: string;
  actionLabel?: string;
  target?: LaunchGuideTarget;
  availabilityNote?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  secondaryAction?: {
    label: string;
    target: LaunchGuideTarget;
  };
}

interface PersistedGuideState {
  completedStepIds: string[];
  templateApplied: boolean;
  template?: EditableTemplate;
}

const GUIDE_STEPS: LaunchStep[] = [
  {
    id: "profile",
    title: "确认商家档案",
    capability: "商家画像",
    description: "确认行业、细分品类、经营目标和主要渠道，后续 AI 会以这些信息作为生成底稿。",
    reason: "让所有方案、内容和任务都围绕同一份商家背景工作。",
    howTo: ["核对行业与细分品类", "补充目标人群、核心产品和经营目标", "确认品牌表达与禁止事项"],
    result: "获得一份统一的商家画像，后续 AI 不再每次重复询问基础背景。",
    actionLabel: "查看商家档案",
    target: "profile",
    icon: Store,
  },
  {
    id: "knowledge",
    title: "链接首批知识",
    capability: "知识与记忆",
    description: "从当前电脑链接产品资料、FAQ、品牌表达和审核约束；TAPTIK 调用本地资料，不会要求先上传到云端。",
    reason: "减少内容中的事实错误，让 TAPTIK 按已链接的本地资料理解品牌应该怎么说。",
    howTo: ["选择当前电脑上的资料文件或文件夹", "检查系统提取的品牌事实、规则与禁区", "处理冲突或待确认知识"],
    result: "获得可追溯的品牌知识底稿，生成内容时能引用本地资料并减少事实错误。",
    actionLabel: "链接知识资料",
    target: "knowledge",
    icon: BookOpen,
  },
  {
    id: "materials",
    title: "准备首批素材",
    capability: "素材中心 · 素材任务",
    description: "你可以直接上传已有图片和视频，也可以创建素材任务，让员工在 H5 中拍摄并回传。",
    reason: "先知道手里有什么，再决定哪些内容可以立即生成、哪些素材需要补拍。",
    howTo: ["把已有图片和视频加入素材中心", "让 AI 完成标签、质量与用途识别", "缺少素材时派发拍摄任务并验收"],
    result: "获得首批可用于内容生成的素材池，并明确仍需员工补拍的画面。",
    actionLabel: "我来上传素材",
    target: "materials",
    icon: ImageIcon,
    secondaryAction: { label: "派发素材任务", target: "execution" },
  },
  {
    id: "accounts",
    title: "配置自有发布账号",
    capability: "账号资产 · 员工绑定",
    description: "添加品牌号、店长号等自有账号并绑定发布员工。员工关注 TAPTIK 服务号后，会在员工 H5 收到发布通知；后续可扩展企微、飞书和钉钉通知。",
    reason: "方案生成后，自有账号的发布任务可以自动找到正确的执行人。",
    howTo: ["添加品牌号、店长号等自有账号", "让员工扫描本商家专属二维码并关注服务号", "把账号绑定到对应员工和发布设备"],
    result: "建立商家、员工与发布账号的关系，后续任务可以自动通知正确执行人。",
    actionLabel: "添加账号并绑定员工",
    target: "accounts",
    icon: UserCheck,
  },
  {
    id: "scheme",
    title: "创建第一份运营方案",
    capability: "方案中心",
    description: "使用上方行业模板生成方案底稿，再调整目标、周期、内容结构和账号配比。",
    reason: "把商家资料、知识、素材和账号组织成一套可以执行的计划。",
    howTo: ["套用当前行业的默认起盘模板", "填写验证目标、周期与内容规模", "确认内容结构、素材需求和账号分工"],
    result: "获得第一份可执行运营方案，以及后续内容、素材和发布工作的统一上下文。",
    actionLabel: "使用模板创建方案",
    target: "scheme",
    icon: Layers,
  },
  {
    id: "publish",
    title: "了解发布任务如何生成",
    capability: "方案生成后 · 执行中心",
    description: "方案生成发布内容后，自有账号任务会通知绑定员工；外部账号任务会生成单任务二维码，对方扫码后进入发布 H5。",
    reason: "先完成方案，再由系统把具体内容、账号和执行人组织成可执行的发布任务。",
    howTo: ["确认方案中的发布内容和目标账号", "自有账号任务由绑定员工在 H5 领取", "外部账号使用单任务二维码执行并回传链接"],
    result: "把方案真正变成有人领取、有人发布、有链接回传且可验证的执行闭环。",
    availabilityNote: "出现条件：创建并确认运营方案，且方案已经生成发布内容。当前起盘阶段不会提前显示空的发布任务。",
    icon: Send,
  },
  {
    id: "review",
    title: "了解复盘何时开始",
    capability: "发布完成后 · 复盘与报告",
    description: "发布任务完成并回传数据后，系统才会生成复盘；届时可查看异常、有效反馈和下一轮调整建议。",
    reason: "让起盘不是一次性的任务清单，而是一套能够持续改进的运营循环。",
    howTo: ["等待发布链接验证和观察周期到达", "查看内容、账号、搜索卡位与互动数据", "将有效建议应用到下一轮策略或任务"],
    result: "获得有证据的运营结论、异常清单和下一轮可执行优化方案。",
    availabilityNote: "出现条件：至少有一项发布任务完成，并收到发布结果或数据回传。当前起盘阶段不会显示空的复盘。",
    icon: RotateCcw,
  },
];

function loadGuideState(storageKey: string): PersistedGuideState {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored) as PersistedGuideState;
  } catch {
    // Ignore unavailable or malformed local state and start from the default guide.
  }
  return { completedStepIds: ["profile"], templateApplied: false };
}

function getEmployeeFollowUrl(merchantId: string) {
  return `https://employee.taptik.cn/follow?merchantId=${encodeURIComponent(merchantId)}`;
}

export function NewMerchantLaunchGuide({
  merchantId,
  merchantName,
  industryProfile,
  industryDefaults,
  onNavigate,
  onUseTemplate,
  onFinish,
}: NewMerchantLaunchGuideProps) {
  const storageKey = `taptik:new-merchant-guide:${merchantId}`;
  const defaultTemplate = useMemo<EditableTemplate>(
    () => ({
      name: industryDefaults.launchTemplateName,
      description: industryDefaults.launchDescription,
      steps: industryDefaults.workflowSteps,
      isCustom: false,
    }),
    [industryDefaults],
  );
  const [initialState] = useState<PersistedGuideState>(() => loadGuideState(storageKey));
  const [template, setTemplate] = useState<EditableTemplate>(() => initialState.template || defaultTemplate);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(initialState.completedStepIds);
  const [templateApplied, setTemplateApplied] = useState(initialState.templateApplied);
  const [expandedStepId, setExpandedStepId] = useState(() => GUIDE_STEPS.find(step => !initialState.completedStepIds.includes(step.id))?.id || "review");
  const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [templateDraft, setTemplateDraft] = useState<EditableTemplate>(template);
  const [copiedFollowLink, setCopiedFollowLink] = useState(false);

  useEffect(() => {
    const nextState: PersistedGuideState = { completedStepIds, templateApplied, template };
    localStorage.setItem(storageKey, JSON.stringify(nextState));
  }, [completedStepIds, storageKey, template, templateApplied]);

  const completedCount = completedStepIds.length;
  const progress = Math.round((completedCount / GUIDE_STEPS.length) * 100);
  const recommendedStep = GUIDE_STEPS.find(step => !completedStepIds.includes(step.id));
  const industryLabel = [
    industryProfile.primaryName,
    ...industryProfile.secondaryNames,
    ...industryProfile.tertiaryNames,
  ].join(" · ");

  const toggleStepComplete = (stepId: string) => {
    setCompletedStepIds(current => current.includes(stepId)
      ? current.filter(id => id !== stepId)
      : [...current, stepId]);
  };

  const handleStepAction = (step: LaunchStep, target = step.target) => {
    if (!target) return;
    if (target === "scheme") {
      setTemplateApplied(true);
      onUseTemplate();
      return;
    }
    onNavigate(target);
  };

  const openTemplateEditor = () => {
    setTemplateDraft(template);
    setIsEditingTemplate(true);
  };

  const saveTemplate = () => {
    const normalizedSteps = templateDraft.steps.map(step => step.trim()).filter(Boolean);
    setTemplate({
      ...templateDraft,
      name: templateDraft.name.trim() || defaultTemplate.name,
      description: templateDraft.description.trim() || defaultTemplate.description,
      steps: normalizedSteps.length > 0 ? normalizedSteps : defaultTemplate.steps,
      isCustom: true,
    });
    setIsEditingTemplate(false);
  };

  const restoreIndustryTemplate = () => {
    setTemplateDraft(defaultTemplate);
  };

  const copyEmployeeFollowLink = async () => {
    try {
      await navigator.clipboard.writeText(getEmployeeFollowUrl(merchantId));
      setCopiedFollowLink(true);
      window.setTimeout(() => setCopiedFollowLink(false), 1800);
    } catch {
      setCopiedFollowLink(false);
    }
  };

  return (
    <div className="space-y-4">
      {!templateApplied ? (
        <section className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-blue-700">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1">
                  <Sparkles size={13} />新商家行业推荐
                </span>
                <span>{template.isCustom ? "我的模板" : "行业默认模板"}</span>
              </div>
              <h2 className="mt-3 text-[18px] font-semibold text-blue-950">{template.name}</h2>
              <p className="mt-1.5 max-w-3xl text-[13px] leading-6 text-blue-900/80">{template.description}</p>
              <div className="mt-2 text-[13px] text-blue-700">适配：{industryLabel}</div>
            </div>
            <button
              type="button"
              onClick={openTemplateEditor}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[13px] font-medium text-blue-800 transition-colors hover:bg-blue-50"
            >
              <Pencil size={13} />编辑为我的模板
            </button>
          </div>

          <div className="border-y border-blue-100 bg-white/60 px-5 py-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {template.steps.map((step, index) => (
                <React.Fragment key={`${step}-${index}`}>
                  <span className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5 text-[13px] font-medium text-blue-950">
                    {index + 1}. {step}
                  </span>
                  {index < template.steps.length - 1 ? <ArrowRight size={12} className="text-blue-300" /> : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="text-[13px] text-blue-900/75">
              套用后仍可调整目标、内容结构和账号配比，不会修改平台行业模板。
            </div>
            <button
              type="button"
              onClick={() => {
                setTemplateApplied(true);
                onUseTemplate();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
            >
              使用模板创建方案 <ArrowRight size={14} />
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[13px] text-emerald-900">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span><strong>{template.name}</strong> 已作为 {merchantName} 的方案底稿，可继续按下方导航补充资料和任务。</span>
          </div>
          <button type="button" onClick={openTemplateEditor} className="text-[13px] font-medium text-emerald-800 hover:underline">
            继续编辑模板
          </button>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-border-default bg-surface-1 shadow-sm">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border-default px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-text-main">新商家起盘导航</h3>
            </div>
            <p className="mt-1 text-[13px] text-text-tertiary">
              这 7 步会带你实际走完一次 TAPTIK 运营闭环：每一步都说明怎么操作、会用到什么功能，以及最终能获得什么结果。也可以从任意准备步骤开始。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsGuideCollapsed(current => !current)} className="rounded-lg border border-border-default px-3 py-1.5 text-[13px] text-text-secondary hover:bg-hover-bg">
              {isGuideCollapsed ? "展开导航" : "收起导航"}
            </button>
            <button type="button" onClick={onFinish} className="px-2 py-1.5 text-[13px] text-text-tertiary hover:text-text-main">
              跳过引导
            </button>
          </div>
        </header>

        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-selected">
              <div className="h-full rounded-full bg-brand-logo transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="shrink-0 text-[13px] font-medium tabular-nums text-text-secondary">{completedCount}/{GUIDE_STEPS.length} 已完成</span>
          </div>
          {recommendedStep ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px]">
              <div className="flex items-start gap-2 text-amber-950">
                <Sparkles size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <span>建议下一步：<strong>{recommendedStep.title}</strong> · {recommendedStep.reason}</span>
              </div>
              <button type="button" onClick={() => setExpandedStepId(recommendedStep.id)} className="font-medium text-amber-800 hover:underline">查看怎么做</button>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[13px] text-emerald-900">
              <span className="flex items-center gap-2"><CheckCircle2 size={15} />起盘导航已完成，可以进入日常运营。</span>
              <button type="button" onClick={onFinish} className="rounded-lg bg-emerald-700 px-3 py-1.5 font-medium text-white">完成引导</button>
            </div>
          )}
        </div>

        {!isGuideCollapsed ? (
          <div className="border-t border-border-default">
            {GUIDE_STEPS.map((step, index) => {
              const completed = completedStepIds.includes(step.id);
              const expanded = expandedStepId === step.id;
              const StepIcon = step.icon;
              return (
                <article key={step.id} className="border-b border-border-subtle last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setExpandedStepId(expanded ? "" : step.id)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-surface-subtle"
                    aria-expanded={expanded}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold ${completed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border-default bg-surface-1 text-text-secondary"}`}>
                      {completed ? <Check size={14} /> : index + 1}
                    </span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${completed ? "bg-emerald-50 text-emerald-700" : "bg-surface-selected text-text-secondary"}`}>
                      <StepIcon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <strong className="text-[13px] font-semibold text-text-main">{step.title}</strong>
                        <span className="text-[13px] text-text-tertiary">{step.capability}</span>
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-text-tertiary">完成后：{step.result}</span>
                    </span>
                    {completed ? <span className="text-[13px] font-medium text-emerald-700">已完成</span> : null}
                    <ChevronDown size={15} className={`text-text-tertiary transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>

                  {expanded ? (
                    <div className="bg-surface-subtle px-5 pb-4 pt-1 sm:pl-[92px]">
                      <p className="text-[13px] leading-6 text-text-secondary">{step.description}</p>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <div className="rounded-xl border border-border-default bg-surface-1 p-3.5">
                          <div className="text-[13px] font-semibold text-text-main">具体怎么做</div>
                          <ol className="mt-2 space-y-1.5">
                            {step.howTo.map((item, itemIndex) => (
                              <li key={item} className="flex gap-2 text-[13px] leading-5 text-text-secondary"><span className="font-semibold text-brand-logo">{itemIndex + 1}.</span><span>{item}</span></li>
                            ))}
                          </ol>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-900"><CheckCircle2 size={14} />可以获得的运营结果</div>
                          <p className="mt-2 text-[13px] leading-5 text-emerald-900/80">{step.result}</p>
                          <div className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-emerald-900/70"><Circle size={6} className="mt-2 shrink-0 fill-current" /><span><strong className="font-medium">这一步的意义：</strong>{step.reason}</span></div>
                        </div>
                      </div>

                      {step.availabilityNote ? (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] leading-5 text-amber-900">
                          {step.availabilityNote}
                        </div>
                      ) : null}

                      {step.id === "accounts" || step.id === "publish" ? (
                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5">
                          <div className="grid gap-4 sm:grid-cols-[124px_1fr] sm:items-center">
                            <div className="mx-auto rounded-xl border border-blue-100 bg-white p-2 shadow-sm">
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(getEmployeeFollowUrl(merchantId))}`} alt={`${merchantName}员工端关注二维码`} className="h-[108px] w-[108px]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-950"><QrCode size={15} />{merchantName} · 员工端关注二维码</div>
                              <p className="mt-1.5 text-[13px] leading-5 text-blue-900/80">员工扫码关注 TAPTIK 服务号并绑定到本商家后，才能在员工 H5 收到本商家的素材和发布任务。该关系只需建立一次。</p>
                              <button type="button" onClick={copyEmployeeFollowLink} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-[13px] font-medium text-blue-800 hover:bg-blue-50">{copiedFollowLink ? <Check size={13} /> : <Copy size={13} />}{copiedFollowLink ? "已复制关注链接" : "复制关注链接"}</button>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {step.id === "publish" ? (
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          <div className="rounded-lg border border-border-default bg-surface-1 p-3">
                            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-main"><UserCheck size={14} />自有账号</div>
                            <p className="mt-1 text-[13px] leading-5 text-text-tertiary">账号资产绑定员工后，通过 TAPTIK 服务号通知，员工在自己的 H5 任务列表中执行；通知通道后续可扩展企微、飞书和钉钉。</p>
                          </div>
                          <div className="rounded-lg border border-border-default bg-surface-1 p-3">
                            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-main"><QrCode size={14} />外部账号</div>
                            <p className="mt-1 text-[13px] leading-5 text-text-tertiary">每个外部账号生成独立任务二维码，扫码后只进入该条发布任务的 H5 页面。</p>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {step.actionLabel && step.target ? (
                          <button type="button" onClick={() => handleStepAction(step)} className="inline-flex items-center gap-1.5 rounded-lg bg-btn-main px-3 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover">
                            {step.id === "materials" ? <Upload size={13} /> : <ExternalLink size={13} />}
                            {step.actionLabel}
                          </button>
                        ) : null}
                        {step.secondaryAction ? (
                          <button type="button" onClick={() => handleStepAction(step, step.secondaryAction?.target)} className="rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg">
                            {step.secondaryAction.label}
                          </button>
                        ) : null}
                        <button type="button" onClick={() => toggleStepComplete(step.id)} className="px-2 py-2 text-[13px] font-medium text-text-tertiary hover:text-text-main">
                          {completed ? "标记为未完成" : "标记完成"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </section>

      {isEditingTemplate ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="launch-template-title">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-default bg-surface-1 shadow-2xl">
            <header className="flex items-start justify-between border-b border-border-default px-5 py-4">
              <div>
                <h3 id="launch-template-title" className="text-[16px] font-semibold text-text-main">编辑为我的起盘模板</h3>
                <p className="mt-1 text-[13px] text-text-tertiary">修改的是你的模板副本，不会影响 TAPTIK 行业默认模板。</p>
              </div>
              <button type="button" onClick={() => setIsEditingTemplate(false)} aria-label="关闭模板编辑" className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg hover:text-text-main"><X size={17} /></button>
            </header>
            <div className="space-y-4 p-5">
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-text-secondary">模板名称</span>
                <input value={templateDraft.name} onChange={event => setTemplateDraft(current => ({ ...current, name: event.target.value }))} className="h-10 w-full rounded-lg border border-border-default bg-page-bg px-3 text-[13px] text-text-main outline-none focus:border-border-strong" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-text-secondary">适用说明</span>
                <textarea value={templateDraft.description} onChange={event => setTemplateDraft(current => ({ ...current, description: event.target.value }))} rows={3} className="w-full resize-none rounded-lg border border-border-default bg-page-bg px-3 py-2.5 text-[13px] leading-5 text-text-main outline-none focus:border-border-strong" />
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-text-secondary">流程步骤</span>
                  <button type="button" onClick={() => setTemplateDraft(current => ({ ...current, steps: [...current.steps, "新步骤"] }))} className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-700 hover:underline"><Plus size={13} />添加步骤</button>
                </div>
                {templateDraft.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-selected text-[13px] font-semibold text-text-secondary">{index + 1}</span>
                    <input value={step} onChange={event => setTemplateDraft(current => ({ ...current, steps: current.steps.map((item, itemIndex) => itemIndex === index ? event.target.value : item) }))} className="h-9 flex-1 rounded-lg border border-border-default bg-page-bg px-3 text-[13px] text-text-main outline-none focus:border-border-strong" />
                    <button type="button" onClick={() => setTemplateDraft(current => ({ ...current, steps: current.steps.filter((_, itemIndex) => itemIndex !== index) }))} disabled={templateDraft.steps.length <= 1} aria-label={`删除第 ${index + 1} 个步骤`} className="rounded-lg p-2 text-text-tertiary hover:bg-danger-light hover:text-danger disabled:opacity-30"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-5 py-4">
              <button type="button" onClick={restoreIndustryTemplate} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-main"><RotateCcw size={13} />恢复行业默认</button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsEditingTemplate(false)} className="rounded-lg border border-border-default px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg">取消</button>
                <button type="button" onClick={saveTemplate} className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover">保存为我的模板</button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
