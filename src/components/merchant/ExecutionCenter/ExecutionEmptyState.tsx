import React from 'react';
import { ArrowRight, FilePenLine, Image as ImageIcon, Send, CheckCircle2 } from 'lucide-react';

interface ExecutionEmptyStateProps {
  /** 是否曾经产生过任何执行任务。false = 新商家从未开始，展示引导；true = 任务都处理完了，展示简洁态 */
  hasStarted: boolean;
  /** 历史任务总数，用于简洁态文案 */
  totalTasks: number;
  /** 主 CTA：前往方案中心新建运营方案 */
  onGoToPlan: () => void;
  /** 次 CTA：打开任务进展抽屉 */
  onOpenProgress?: () => void;
}

const STEP_ACCENT = ['bg-blue-50 text-blue-700', 'bg-violet-50 text-violet-700', 'bg-amber-50 text-amber-700'];

/**
 * 执行中心空状态。
 * 区分两种空：
 * 1. 从未开始 —— 新商家还没有任何执行任务，说明任务从哪里来，并给出启动路径
 * 2. 已清空   —— 有历史任务但当前无需介入，避免用引导内容干扰熟练用户
 */
export function ExecutionEmptyState({ hasStarted, totalTasks, onGoToPlan, onOpenProgress }: ExecutionEmptyStateProps) {
  if (hasStarted) {
    return (
      <div className="flex flex-1 items-center justify-center text-center">
        <div>
          <CheckCircle2 size={30} className="mx-auto text-emerald-500" />
          <div className="mt-3 text-[13px] font-semibold text-text-main">当前没有需要处理的事项</div>
          <p className="mt-1 text-[13px] text-text-tertiary">
            {totalTasks > 0 ? `已完成 ${totalTasks} 项任务` : '新任务或异常出现后会在这里提示'}
            。领取、执行和历史记录可在任务进展中查看。
          </p>
          {onOpenProgress ? (
            <button
              type="button"
              onClick={onOpenProgress}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-surface-1 px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg hover:text-text-main"
            >
              查看任务进展
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: '新建运营方案',
      description: '定义本轮唯一主目标、内容方法，以及品牌号 / KOS / KOC 的账号组合与篇数。',
      icon: FilePenLine
    },
    {
      title: '生成并分发笔记',
      description: '系统按方案生成笔记初稿并匹配目标账号，确定后进入素材与发布环节。',
      icon: ImageIcon
    },
    {
      title: '执行项自动流入',
      description: '待确认的笔记、待验收的素材、发布异常会集中到这里，只处理需要你判断的事。',
      icon: Send
    }
  ];

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto bg-page-bg p-8">
      <div className="w-full max-w-[720px]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-default bg-surface-1 text-text-tertiary shadow-sm">
            <FilePenLine size={24} />
          </div>
          <h1 className="mt-5 text-[18px] font-semibold text-text-main">执行中心还没有数据</h1>
          <p className="mx-auto mt-2 max-w-[460px] text-[13px] leading-6 text-text-tertiary">
            执行中心不生成任务，只聚合运营方案执行过程中需要你介入的事项。
            先有一份运行中的方案，待确认的笔记、待验收的素材和发布异常才会出现在这里。
          </p>
          <button
            type="button"
            onClick={onGoToPlan}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-btn-main px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-btn-main-hover"
          >
            去新建运营方案 <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-border-default bg-surface-1 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-text-main">数据是怎么产生的</h2>
            <p className="mt-1 text-[12px] text-text-tertiary">三步之后，这个页面就会开始有内容。</p>
          </div>
          <ol className="space-y-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <li key={step.title} className="flex items-start gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${STEP_ACCENT[index]}`}>
                    <StepIcon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-text-tertiary">第 {index + 1} 步</span>
                      <h3 className="text-[13px] font-semibold text-text-main">{step.title}</h3>
                    </div>
                    <p className="mt-0.5 text-[13px] leading-5 text-text-tertiary">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-4 text-center text-[12px] leading-5 text-text-tertiary">
          已经有方案了？笔记确认、素材回传和发布异常会在生成后自动出现，不需要手动添加。
        </p>
      </div>
    </div>
  );
}
