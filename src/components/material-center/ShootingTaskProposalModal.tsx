import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Camera,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';

interface ShootingTaskProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToExecution?: () => void;
}

export const ShootingTaskProposalModal: React.FC<ShootingTaskProposalModalProps> = ({
  isOpen,
  onClose,
  onNavigateToExecution
}) => {
  if (!isOpen) return null;

  const [projectName, setProjectName] = useState('幼犬换粮软便卡位项目');
  const [noteTitle, setNoteTitle] = useState('幼犬软便救急避坑指南 (笔记 #NOTE-802)');
  const [executorRole, setExecutorRole] = useState<'clerk' | 'koc'>('clerk');
  const [executorName, setExecutorName] = useState('张店长 (K11旗舰店)');
  const [deadline, setDeadline] = useState('2026-08-25 18:00');

  const [shotRequirements, setShotRequirements] = useState([
    { id: '1', name: '幼犬近距离进食正视角度', desc: '要求背景光线通透，能够清晰看到宠物主粮颗粒感', isCover: true },
    { id: '2', name: '宠粮开封撕条细节实拍', desc: '展示易拉封口与密封条细节', isCover: false },
    { id: '3', name: '狗狗兴奋等待进食动作', desc: '真实生活场景，无明显杂物', isCover: false }
  ]);

  const handleConfirmAndDispatch = () => {
    alert('拍摄任务提案已确认并下发至【执行中心】！原始上下文（项目→打法→笔记→素材缺口→拍摄任务）已完整保留。');
    onClose();
    if (onNavigateToExecution) {
      onNavigateToExecution();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-[680px] max-w-full bg-surface rounded-xl shadow-2xl border border-border-default flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="h-14 px-6 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-subtle">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              <Camera size={16} />
            </div>
            <h3 className="text-[15px] font-semibold text-text-primary">
              Agent 素材缺口补齐提案
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-tertiary hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[13px]">
          
          {/* Traceable Context Banner */}
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg text-[13px] space-y-1">
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <Camera size={14} className="text-text-secondary" />
              上下文链路追溯:
            </div>
            <div className="text-text-secondary flex items-center gap-1 flex-wrap text-[13px]">
              <span className="px-1.5 py-0.5 bg-surface border rounded">{projectName}</span>
              <ArrowRight size={12} className="text-text-tertiary" />
              <span className="px-1.5 py-0.5 bg-surface border rounded">v2.1体验测评打法</span>
              <ArrowRight size={12} className="text-text-tertiary" />
              <span className="px-1.5 py-0.5 bg-surface border rounded">{noteTitle}</span>
              <ArrowRight size={12} className="text-text-tertiary" />
              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-medium">封面与正文素材缺口 (缺2张)</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-tertiary text-[13px] block mb-1">关联项目与笔记</label>
              <input
                type="text"
                disabled
                value={noteTitle}
                className="w-full px-3 py-2 bg-surface-subtle border border-border-subtle rounded text-text-primary font-medium text-[13px]"
              />
            </div>

            <div>
              <label className="text-text-tertiary text-[13px] block mb-1">执行角色与人员</label>
              <select
                value={executorName}
                onChange={(e) => setExecutorName(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
              >
                <option value="张店长 (K11旗舰店)">门店员工 - 张店长 (K11旗舰店)</option>
                <option value="李店长 (陆家嘴店)">门店员工 - 李店长 (陆家嘴店)</option>
                <option value="KOC-小红薯momo">KOC体验官 - 小红薯momo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-text-tertiary text-[13px] block mb-1">最晚回传截止时间</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border-default rounded text-text-primary text-[13px]"
            />
          </div>

          {/* Shot Requirements */}
          <div className="space-y-2">
            <label className="text-text-primary font-semibold text-[13px] block">
              拍摄需求清单 (共 {shotRequirements.length} 项)
            </label>

            <div className="space-y-2">
              {shotRequirements.map((req, i) => (
                <div key={req.id} className="p-3 bg-surface-subtle border border-border-subtle rounded-lg flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-text-primary text-[13px] flex items-center gap-1.5">
                      <span>{i + 1}. {req.name}</span>
                      {req.isCover && (
                        <span className="px-1.5 py-0.2 rounded text-[13px] bg-surface-selected text-text-primary font-medium">
                          目标封面
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-text-secondary mt-0.5">{req.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-surface-subtle flex items-center justify-between shrink-0">
          <span className="text-[13px] text-text-tertiary">
            确认后，该拍摄任务将下发至【执行中心-素材执行】模块
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border-default hover:bg-surface-hover rounded text-[13px] font-medium text-text-primary"
            >
              取消
            </button>

            <button
              onClick={handleConfirmAndDispatch}
              className="px-5 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={15} />
              确认提案并下发至执行中心
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
