import React, { useState } from 'react';
import { X, Camera, Plus, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
}

export function AddProjectMaterialModal({ project, onClose }: Props) {
  const { addProjectMaterialRequirement } = useProjectStore();

  const [reqs, setReqs] = useState('');
  const [assignee, setAssignee] = useState('项目设计与策划团队');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqs.trim()) return;

    addProjectMaterialRequirement(project.id, reqs, assignee);
    onClose();
  };

  const presetReqs = [
    "项目宴会厅高清全景图与舞台灯光布置照片（至少3张）",
    "试菜现场主菜品特写与菜单名牌照片（至少2张）",
    "品牌产品核心成分高清缩略图与权威认证截图",
    "15秒场地/产品体验过程高清视频剪辑素材"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden my-auto"
      >
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
            <Camera size={18} className="text-neutral-700" />
            生成项目级素材要求
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[12px] text-neutral-600 leading-relaxed">
            💡 提示：项目级素材要求独立于具体笔记，即使项目尚未生成笔记也可以提前派发与拍摄收集。
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-700 mb-1">
              素材要求内容 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reqs}
              onChange={(e) => setReqs(e.target.value)}
              placeholder="写下项目需要的通用拍摄或设计素材要求..."
              className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-neutral-400 bg-neutral-50/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">
              快速填入常见项目素材要求
            </label>
            <div className="space-y-1.5">
              {presetReqs.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReqs(preset)}
                  className="w-full text-left p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-[11px] font-medium text-neutral-700 transition-colors border border-neutral-200/60 truncate"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-700 mb-1">
              素材负责/派发执行人
            </label>
            <input 
              type="text" 
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="例如：酒店策划团队 / 设计运营"
              className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-neutral-400 bg-neutral-50/50"
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              生成素材任务
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
