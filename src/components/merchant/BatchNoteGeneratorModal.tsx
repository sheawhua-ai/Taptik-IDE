import React, { useMemo, useState } from 'react';
import { ArrowRight, FileText, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { NoteType, Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
}

interface AccountPlan {
  type: NoteType;
  count: number;
  accountNames: string[];
  angle: string;
}

interface GeneratedNote {
  title: string;
  accountType: NoteType;
  accountName: string;
  contentDirection: string;
  plannedDate: string;
}

const FALLBACK_ACCOUNTS: Record<NoteType, string> = {
  '品牌主号': '品牌官方账号',
  '店长号/KOS': '店长号 / KOS',
  KOC: 'KOC 体验官',
};

const WRITING_ANGLES: Record<NoteType, string> = {
  '品牌主号': '从品牌角度讲清产品或服务卖点，并补充可信的官方信息。',
  '店长号/KOS': '从一线经验出发，回答顾客常问的问题，并给出具体建议。',
  KOC: '从真实体验出发，记录使用或到店过程，以及前后的真实感受。',
};

function uniqueAccountNames(project: Project, type: NoteType) {
  return Array.from(new Set(
    project.notes
      .filter((note) => note.type === type)
      .map((note) => note.participant)
      .filter(Boolean),
  ));
}

function buildAccountPlans(project: Project): AccountPlan[] {
  const scheme = project.distributionScheme;
  const brandCount = scheme
    ? scheme.brandTotalNotes ?? scheme.ownAccounts.brandAccountIds.length * scheme.ownAccounts.brandNotesPerAccount
    : 1;
  const kosCount = scheme
    ? scheme.kosTotalNotes ?? scheme.ownAccounts.kosAccountIds.length * scheme.ownAccounts.kosNotesPerAccount
    : 1;
  let kocCount = scheme
    ? scheme.kocTotalNotes ?? scheme.consumerKoc.recruitmentCount * scheme.consumerKoc.packagesPerPerson
    : Math.max(0, 10 - brandCount - kosCount);

  const configuredTotal = scheme?.totalPlannedNotes ?? brandCount + kosCount + kocCount;
  const assignedTotal = brandCount + kosCount + kocCount;
  if (configuredTotal > assignedTotal) kocCount += configuredTotal - assignedTotal;

  const countByType: Record<NoteType, number> = {
    '品牌主号': brandCount,
    '店长号/KOS': kosCount,
    KOC: kocCount,
  };

  return (['品牌主号', '店长号/KOS', 'KOC'] as const)
    .filter((type) => countByType[type] > 0)
    .map((type) => {
      const existingNames = uniqueAccountNames(project, type);
      const configuredIds = type === '品牌主号'
        ? scheme?.ownAccounts.brandAccountIds ?? []
        : type === '店长号/KOS'
          ? scheme?.ownAccounts.kosAccountIds ?? []
          : [];

      return {
        type,
        count: countByType[type],
        accountNames: existingNames.length > 0
          ? existingNames
          : configuredIds.length > 0
            ? configuredIds
            : [FALLBACK_ACCOUNTS[type]],
        angle: WRITING_ANGLES[type],
      };
    });
}

function buildNotes(project: Project, plans: AccountPlan[]): GeneratedNote[] {
  const baseDate = new Date();
  const notes: GeneratedNote[] = [];

  plans.forEach((plan) => {
    for (let index = 0; index < plan.count; index += 1) {
      const accountName = plan.accountNames[index % plan.accountNames.length];
      const plannedDate = new Date(baseDate.getTime() + (notes.length + 1) * 24 * 3600 * 1000)
        .toISOString()
        .split('T')[0];
      const titlePrefix = plan.type === '品牌主号'
        ? '官方解读'
        : plan.type === '店长号/KOS'
          ? '一线答疑'
          : '真实体验';

      notes.push({
        title: `${titlePrefix}｜${project.name} ${index + 1}`,
        accountType: plan.type,
        accountName,
        contentDirection: plan.angle,
        plannedDate,
      });
    }
  });

  return notes;
}

export function BatchNoteGeneratorModal({ project, onClose }: Props) {
  const { batchGenerateProjectNotes } = useProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const plans = useMemo(() => buildAccountPlans(project), [project]);
  const totalCount = plans.reduce((sum, plan) => sum + plan.count, 0);

  const handleConfirm = () => {
    if (isSubmitting || totalCount === 0) return;
    setIsSubmitting(true);
    batchGenerateProjectNotes(project.id, buildNotes(project, plans));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/50 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-xl shadow-2xl border border-border-default w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-text-main flex items-center gap-2">
              <Sparkles size={20} />
              AI批量生成笔记
            </h2>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              确认账号和数量后，AI 会按不同账号的分工生成笔记。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-page-bg/30 space-y-4">
          <div className="bg-surface-1 border border-border-default rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[13px] text-text-tertiary">本次共生成</p>
              <p className="text-[24px] font-bold text-text-main mt-1">{totalCount} 篇笔记</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-btn-main text-white flex items-center justify-center">
              <FileText size={21} />
            </div>
          </div>

          <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden">
            {plans.map((plan, index) => (
              <div
                key={plan.type}
                className={`p-4 ${index < plans.length - 1 ? 'border-b border-border-default' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-text-main">{plan.type}</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[13px] text-text-secondary">
                        {plan.count} 篇
                      </span>
                    </div>
                    <p className="text-[13px] text-text-secondary mt-2">
                      账号：{plan.accountNames.join('、')}
                    </p>
                    <p className="text-[13px] text-text-tertiary mt-1">
                      写法：{plan.angle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface-1 shrink-0">
          <span className="text-[13px] text-text-tertiary">生成后可在笔记列表里继续修改。</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || totalCount === 0}
              className="px-5 py-2 bg-btn-main hover:bg-btn-main-hover disabled:opacity-50 text-white rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2"
            >
              <span>{isSubmitting ? '正在生成…' : `生成 ${totalCount} 篇笔记`}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
