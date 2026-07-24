import React, { useState } from 'react';
import { OpportunityHypothesis, ExpertItem, SkillItem, AppScope } from './types';
import {
  X, CheckCircle2, ShieldCheck, FileText, Calendar, Target, Clock,
  Building2, FolderPlus, Layers, AlertTriangle, ArrowRight, ShieldAlert,
  Bot, Wrench
} from 'lucide-react';

/* 1. Validation Plan Drawer ("验证方案抽屉") */
export interface ValidationPlanDrawerProps {
  hypothesis: OpportunityHypothesis | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ValidationPlanDrawer: React.FC<ValidationPlanDrawerProps> = ({
  hypothesis,
  onClose,
  onConfirm
}) => {
  if (!hypothesis) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-[540px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <span className="text-[11px] font-extrabold text-neutral-400 uppercase">
              验证计划生成
            </span>
            <h2 className="text-[18px] font-extrabold text-neutral-900">
              {hypothesis.name} · 验证方案
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-[13px]">
          {/* Goal */}
          <div className="space-y-1 bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
            <label className="font-bold text-neutral-400 text-[11px]">计划目标</label>
            <div className="font-extrabold text-neutral-900">
              验证“{hypothesis.name}”切入点能否带来进店咨询提升 &gt; 30%
            </div>
          </div>

          {/* Content Count & Account Types */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-neutral-500 text-[12px]">拟发布内容数量</label>
              <input
                type="text"
                defaultValue="10 篇 KOC 笔记 + 2 篇 KOS 店长号"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-neutral-500 text-[12px]">账号类型/建议账号</label>
              <input
                type="text"
                defaultValue="素人种草KOC + 门店官方KOS店长号"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900"
              />
            </div>
          </div>

          {/* Time & Observation Metrics */}
          <div className="space-y-1">
            <label className="font-bold text-neutral-500 text-[12px]">发布与观察时间段</label>
            <input
              type="text"
              defaultValue="2026-07-25 至 2026-08-08 (14天观察期)"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-bold text-neutral-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-500 text-[12px]">核心观察指标</label>
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl font-bold text-emerald-900">
              • 核心指标: 平均互动率 &gt; 4.5%，进店转化成本 &lt; 8元
              <br />• 判定通过线: {hypothesis.passCriteria}
            </div>
          </div>

          {/* Manual Registry */}
          <div className="space-y-1">
            <label className="font-bold text-amber-800 text-[12px]">人工登记补充项 (私域/转化回填)</label>
            <input
              type="text"
              defaultValue="后置微信加粉量、天猫店铺私信客服“软便”报暗号人数"
              className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-2.5 text-amber-950 font-bold"
            />
          </div>

          {/* Review Time */}
          <div className="space-y-1">
            <label className="font-bold text-neutral-500 text-[12px]">约定复盘节点</label>
            <div className="p-2.5 bg-neutral-100 rounded-xl font-bold text-neutral-700">
              发布第 14 天由【项目复盘专家】自动发起复盘归因
            </div>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-neutral-200 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck size={16} /> 确认写入项目中心
          </button>
        </div>
      </div>
    </div>
  );
};

/* 2. Run Log Drawer ("运行记录与依据抽屉") */
export interface RunLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunLogDrawer: React.FC<RunLogDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-[540px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-[17px] font-extrabold text-neutral-900">运行历史与证据依据</h2>
            <p className="text-[12px] text-neutral-500">已脱敏处理，展现事实与推理链条</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-[12px]">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
            <div className="flex justify-between font-bold text-neutral-900 text-[13px]">
              <span>幼猫换粮抗应激项目</span>
              <span className="text-neutral-400 font-normal">2026-07-23 16:30</span>
            </div>
            <div className="text-neutral-600">
              <span className="font-bold">调用的技能:</span> 蓝海机会假设生成、评论意图识别
            </div>
            <div className="text-neutral-600">
              <span className="font-bold">调取的知识:</span> 品牌换粮问答库、小红书宠粮词表
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-neutral-100 text-emerald-800 font-bold">
              结论: 成功提炼出3个低竞争高转化的“换粮应激软便”机会假设
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 3. Application Scope Modal ("应用范围配置弹窗") */
export interface ApplicationScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scope: AppScope) => void;
}

export const ApplicationScopeModal: React.FC<ApplicationScopeModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedScope, setSelectedScope] = useState<AppScope>('merchant');
  const [showWideWarning, setShowWideWarning] = useState(false);

  if (!isOpen) return null;

  const handleSaveScope = () => {
    if (selectedScope === 'all' && !showWideWarning) {
      setShowWideWarning(true);
      return;
    }
    onSave(selectedScope);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 space-y-5">
        <h2 className="text-[17px] font-extrabold text-neutral-900">配置能力应用范围</h2>

        <div className="space-y-2 text-[13px]">
          {[
            { id: 'self', label: '仅自己可用', desc: '私有调试，不影响团队和其他项目' },
            { id: 'merchant', label: '指定商家 (默认)', desc: '限制在“皇家宠物食品”及其子项目中使用' },
            { id: 'project', label: '指定项目', desc: '仅在“幼猫换粮抗应激项目”生效' },
            { id: 'all', label: '所有商家通用', desc: '全局生效，需要额外二次确认' }
          ].map(opt => (
            <label
              key={opt.id}
              onClick={() => setSelectedScope(opt.id as AppScope)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                selectedScope === opt.id
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}
            >
              <input
                type="radio"
                name="appScope"
                checked={selectedScope === opt.id}
                onChange={() => setSelectedScope(opt.id as AppScope)}
                className="mt-1"
              />
              <div>
                <div className="font-extrabold">{opt.label}</div>
                <div
                  className={`text-[11px] ${
                    selectedScope === opt.id ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {opt.desc}
                </div>
              </div>
            </label>
          ))}
        </div>

        {showWideWarning && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[12px] font-bold">
            ⚠ 警告: 扩大应用范围至【所有商家】将影响全平台配置，确认要共享此配置吗？
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 text-[13px]"
          >
            取消
          </button>
          <button
            onClick={handleSaveScope}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold rounded-xl text-[13px]"
          >
            保存应用范围
          </button>
        </div>
      </div>
    </div>
  );
};

/* 4. Add Skill To Expert Modal */
export interface AddSkillToExpertModalProps {
  skill: SkillItem | null;
  experts: ExpertItem[];
  onClose: () => void;
}

export const AddSkillToExpertModal: React.FC<AddSkillToExpertModalProps> = ({
  skill,
  experts,
  onClose
}) => {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 space-y-4">
        <h2 className="text-[17px] font-extrabold text-neutral-900">
          挂载技能【{skill.name}】至专家
        </h2>
        <div className="space-y-2 text-[13px]">
          {experts.map(exp => (
            <div
              key={exp.id}
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-between font-bold cursor-pointer"
            >
              <span>{exp.name}</span>
              <span className="text-[11px] text-primary-600 font-bold">点击挂载</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white font-extrabold rounded-xl text-[13px]"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
