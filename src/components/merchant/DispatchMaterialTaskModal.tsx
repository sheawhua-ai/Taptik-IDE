import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
  defaultNoteId?: string;
}

export function DispatchMaterialTaskModal({ project, onClose }: Props) {
  const { addProjectMaterialRequirement } = useProjectStore();

  const [reqs, setReqs] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const availableStaff = [
    { id: 'staff_b', name: '员工b' },
    { id: 'staff_a', name: '员工a' },
    { id: 'staff_kaka', name: '卡卡' },
    { id: 'staff_zhang', name: '张店长' },
    { id: 'staff_design', name: '设计组' },
  ];

  const toggleStaff = (id: string) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter(s => s !== id));
    } else {
      setSelectedStaff([...selectedStaff, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqs.trim()) return;

    const assigneeNames = selectedStaff.length > 0 
      ? selectedStaff.map(id => availableStaff.find(s => s.id === id)?.name).filter(Boolean).join(', ')
      : '全部员工';

    addProjectMaterialRequirement(project.id, reqs, assigneeNames);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#EAECF0] w-full max-w-lg overflow-hidden my-auto p-7 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">
              下发计划素材收集任务
            </h2>
            <p className="text-[13px] text-[#667085] mt-1">
              任务将关联“<span className="font-medium text-[#111827]">{project.name}</span>”，重复下发会按源平台规则更新现有任务。
            </p>
          </div>

          {/* Requirements textarea */}
          <div>
            <textarea
              rows={5}
              required
              value={reqs}
              onChange={(e) => setReqs(e.target.value)}
              placeholder="请输入清晰、可执行的素材要求"
              className="w-full px-4 py-3 border border-[#EAECF0] rounded-2xl text-[14px] outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-[#FAFAFB] resize-none transition-all"
            />
          </div>

          {/* Assignee selection (exact match with user image) */}
          <div>
            <label className="block text-[12px] font-medium text-[#667085] mb-2.5">
              下发对象（不选则下发全部员工）
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {availableStaff.map(staff => {
                const isChecked = selectedStaff.includes(staff.id);
                return (
                  <label 
                    key={staff.id}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[13px] cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-medium' 
                        : 'bg-white border-[#EAECF0] text-[#344054] hover:bg-neutral-50'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStaff(staff.id)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300 accent-rose-600"
                    />
                    <span>{staff.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#EAECF0] text-[#344054] hover:bg-neutral-50 rounded-xl text-[14px] font-bold transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D93850] hover:bg-[#c22e44] text-white rounded-xl text-[14px] font-bold transition-colors shadow-xs"
            >
              确认下发
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
