import React, { useState } from 'react';
import { ExpertItem, SkillItem } from './types';
import { INITIAL_SKILLS } from './mockData';
import { X, RotateCcw, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

interface ReplaceSkillModalProps {
  expert: ExpertItem;
  skillToReplace: SkillItem;
  onClose: () => void;
  onConfirmReplace: (expertId: string, oldSkillId: string, newSkill: SkillItem, reason: string) => void;
}

export const ReplaceSkillModal: React.FC<ReplaceSkillModalProps> = ({
  expert,
  skillToReplace,
  onClose,
  onConfirmReplace
}) => {
  const [selectedNewSkillId, setSelectedNewSkillId] = useState<string>(INITIAL_SKILLS[0].id);
  const [reason, setReason] = useState<string>('根据当前商家场景规范，使用行业专用规程替代通用规程');

  const handleConfirm = () => {
    const newSkill = INITIAL_SKILLS.find(s => s.id === selectedNewSkillId) || INITIAL_SKILLS[0];
    onConfirmReplace(expert.id, skillToReplace.id, newSkill, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface-1 rounded-xl shadow-2xl overflow-hidden z-10 p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="text-blue-600" size={18} />
            <h3 className="text-[16px] font-extrabold text-text-main">替换专家内部技能</h3>
          </div>
          <button onClick={onClose} className="p-1 text-text-tertiary hover:text-text-secondary">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-[12px]">
          <div className="p-3 bg-page-bg rounded-xl border border-border-default">
            <span className="font-extrabold text-text-tertiary block text-[10px]">原已有技能:</span>
            <span className="font-extrabold text-text-main text-[13px]">{skillToReplace.name}</span>
          </div>

          <div>
            <label className="font-extrabold text-text-main block mb-1">选择替代的新技能</label>
            <select
              value={selectedNewSkillId}
              onChange={e => setSelectedNewSkillId(e.target.value)}
              className="w-full bg-page-bg border border-border-default rounded-xl p-2.5 font-bold text-text-main"
            >
              {INITIAL_SKILLS.map(sk => (
                <option key={sk.id} value={sk.id}>
                  {sk.name} ({sk.oneSentenceDesc})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-extrabold text-text-main block mb-1">替换原因说明</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-page-bg border border-border-default rounded-xl p-2.5 font-bold text-text-main"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-border-default font-bold text-[12px] rounded-xl">
            取消
          </button>
          <button onClick={handleConfirm} className="px-5 py-2 bg-btn-main text-white font-extrabold text-[12px] rounded-xl">
            确认替换技能
          </button>
        </div>
      </div>
    </div>
  );
};
