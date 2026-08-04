import React, { useState } from 'react';
import { CollectionTask, ShotRequirement, MaterialAsset } from './types';
import {
  ArrowLeft, MoreHorizontal, Check, AlertTriangle, Upload, 
  Clock, User, Calendar, X, ImageIcon, CheckCircle2, FileText
} from 'lucide-react';

interface ShootingTaskDetailProps {
  task: CollectionTask;
  allAssets: MaterialAsset[];
  onBack: () => void;
  onUpdateTask?: (updatedTask: CollectionTask) => void;
  onViewAsset?: (asset: MaterialAsset) => void;
}

export const ShootingTaskDetail: React.FC<ShootingTaskDetailProps> = ({
  task,
  allAssets,
  onBack,
  onUpdateTask,
  onViewAsset
}) => {
  const [currentTask, setCurrentTask] = useState<CollectionTask>(task);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showOperationLog, setShowOperationLog] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditExecutor, setShowEditExecutor] = useState(false);
  const [showEditDeadline, setShowEditDeadline] = useState(false);
  const [newExecutor, setNewExecutor] = useState(task.executor);
  const [newDeadline, setNewDeadline] = useState(task.deadline);
  const [noticeToast, setNoticeToast] = useState<string | null>(null);

  // Compute Task Status
  const getTaskStatus = (): '待派发' | '执行中' | '需补拍' | '已完成' => {
    if (currentTask.needsReshootCount > 0) return '需补拍';
    if (currentTask.completedCount === currentTask.totalCount && currentTask.totalCount > 0) return '已完成';
    if (currentTask.executor === '未分配' || currentTask.completedCount === 0) return '待派发';
    return '执行中';
  };

  const status = getTaskStatus();

  // Progress string (Section III.2)
  const getProgressSentence = () => {
    if (status === '需补拍') {
      return `已收集 ${currentTask.completedCount}/${currentTask.totalCount} 个镜头，其中 ${currentTask.needsReshootCount} 个需要补拍。`;
    }
    if (status === '已完成') {
      return `已收集 ${currentTask.completedCount}/${currentTask.totalCount} 个镜头，任务已完成。`;
    }
    if (status === '待派发') {
      return `已整理 ${currentTask.totalCount} 个拍摄镜头，确认执行人后即可派发。`;
    }
    return `已收集 ${currentTask.completedCount}/${currentTask.totalCount} 个镜头，等待执行中。`;
  };

  // Dispatch Action
  const handleDispatch = () => {
    const updated = {
      ...currentTask,
      completedCount: currentTask.completedCount || 0
    };
    setCurrentTask(updated);
    if (onUpdateTask) onUpdateTask(updated);
    setNoticeToast('任务已成功确认派发！');
    setTimeout(() => setNoticeToast(null), 3000);
  };

  // Notify Reshoot Action
  const handleNotifyReshoot = () => {
    setNoticeToast(`已向执行人 (${currentTask.executor}) 发送补拍通知！`);
    setTimeout(() => setNoticeToast(null), 3000);
  };

  // Save Executor
  const handleSaveExecutor = () => {
    const updated = { ...currentTask, executor: newExecutor };
    setCurrentTask(updated);
    if (onUpdateTask) onUpdateTask(updated);
    setShowEditExecutor(false);
    setNoticeToast('执行人修改成功');
    setTimeout(() => setNoticeToast(null), 2500);
  };

  // Save Deadline
  const handleSaveDeadline = () => {
    const updated = { ...currentTask, deadline: newDeadline };
    setCurrentTask(updated);
    if (onUpdateTask) onUpdateTask(updated);
    setShowEditDeadline(false);
    setNoticeToast('截止时间调整成功');
    setTimeout(() => setNoticeToast(null), 2500);
  };

  // Handle Supplemental Upload
  const handleUploadFile = (shotId: string) => {
    const updatedShots = currentTask.shotsList.map(s => {
      if (s.id === shotId) {
        return {
          ...s,
          status: 'completed' as const,
          rejectReason: undefined
        };
      }
      return s;
    });

    const completed = updatedShots.filter(s => s.status === 'completed').length;
    const reshoot = updatedShots.filter(s => s.status === 'rejected').length;

    const updatedTask = {
      ...currentTask,
      shotsList: updatedShots,
      completedCount: completed,
      needsReshootCount: reshoot
    };

    setCurrentTask(updatedTask);
    if (onUpdateTask) onUpdateTask(updatedTask);
    setShowUploadModal(false);
    setNoticeToast('补充上传成功，AI检查通过！');
    setTimeout(() => setNoticeToast(null), 3000);
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen py-6 px-4 md:px-8 text-neutral-900">
      {/* Container: max-w-4xl (960px), centered, single column (Section III) */}
      <div className="max-w-[960px] mx-auto bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden flex flex-col min-h-[720px]">
        
        {/* Top Header Navigation */}
        <div className="p-5 md:p-6 border-b border-neutral-100 flex items-center justify-between bg-white">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[14px] font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={17} />
            <span>返回拍摄任务</span>
          </button>

          {/* Status Badge right side of title (Section III.1) */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-lg text-[12px] font-black ${
                status === '需补拍'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200/80'
              }`}
            >
              {status}
            </span>

            {/* "More" Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors"
                title="更多操作"
              >
                <MoreHorizontal size={18} />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg z-30 py-1.5 text-[13px] font-medium text-neutral-700 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowEditExecutor(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <User size={14} className="text-neutral-400" />
                    <span>修改执行人</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowEditDeadline(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Clock size={14} className="text-neutral-400" />
                    <span>调整截止时间</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowUploadModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Upload size={14} className="text-neutral-400" />
                    <span>补充上传</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowOperationLog(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <FileText size={14} className="text-neutral-400" />
                    <span>查看操作记录</span>
                  </button>
                  <div className="border-t border-neutral-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onBack();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <X size={14} />
                    <span>取消任务</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notice Toast Banner */}
        {noticeToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-[13px] font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{noticeToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 space-y-7">
          {/* Section III.1 Task Title & Sub-info */}
          <div className="space-y-1.5 border-b border-neutral-100 pb-5">
            <h1 className="text-[20px] md:text-[22px] font-black text-neutral-900 tracking-tight">
              {currentTask.taskName}
            </h1>
            <p className="text-[13px] font-medium text-neutral-500 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{currentTask.projectName}</span>
              <span>·</span>
              <span>{currentTask.store}</span>
              <span>·</span>
              <span>{currentTask.executor}</span>
              <span>·</span>
              <span>截止 {currentTask.deadline}</span>
            </p>
          </div>

          {/* Section III.2 Current Progress (Single Line) */}
          <div className="text-[14px] font-bold text-neutral-800 bg-neutral-50/80 px-4 py-3 rounded-xl border border-neutral-200/70">
            {getProgressSentence()}
          </div>

          {/* Section III.3 Shot List (镜头清单) */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-black text-neutral-900">
              镜头清单 ({currentTask.shotsList.length})
            </h3>

            <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100">
              {currentTask.shotsList.map((shot) => {
                const matchedAsset = allAssets.find((a) => a.id === shot.assetId);

                return (
                  <div key={shot.id} className="py-4 space-y-2">
                    {/* Shot Header: Shot Code + Shot Name + Status Result */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-black text-[14px] text-neutral-900">
                        <span className="text-neutral-400 font-extrabold">{shot.shotCode}</span>
                        <span>{shot.shotName}</span>
                      </div>

                      {/* Result Tag (Section III.3: 已收集 / 需补拍 / 待拍摄) */}
                      <div>
                        {shot.status === 'completed' && (
                          <span className="text-[12px] font-bold text-neutral-600">
                            已收集
                          </span>
                        )}
                        {shot.status === 'rejected' && (
                          <span className="text-[12px] font-black text-rose-600">
                            需补拍
                          </span>
                        )}
                        {(shot.status === 'pending' || shot.status === 'uploaded') && (
                          <span className="text-[12px] font-medium text-neutral-400">
                            待拍摄
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Requirement Description */}
                    <p className="text-[13px] font-medium text-neutral-600">
                      {shot.requirementDesc}
                    </p>

                    {/* Reshoot reason / Prompt suggestion if any */}
                    {shot.rejectReason && (
                      <p className="text-[12.5px] font-medium text-rose-600 pt-0.5">
                        {shot.rejectReason}
                      </p>
                    )}

                    {/* Thumbnail preview if collected */}
                    {matchedAsset && (
                      <div className="pt-2 flex items-center gap-3">
                        <img
                          src={matchedAsset.url}
                          alt={matchedAsset.oneSentenceUnderstanding}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        {onViewAsset && (
                          <button
                            onClick={() => onViewAsset(matchedAsset)}
                            className="text-[12px] font-bold text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
                          >
                            查看素材详情
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section III.4 Bottom Next Step Action (Single Primary Button) */}
        <div className="p-5 md:p-6 border-t border-neutral-100 bg-white flex items-center justify-end">
          {status === '待派发' && (
            <button
              onClick={handleDispatch}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-black text-[14px] rounded-xl transition-all shadow-2xs active:scale-95"
            >
              确认派发
            </button>
          )}

          {status === '需补拍' && (
            <button
              onClick={handleNotifyReshoot}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[14px] rounded-xl transition-all shadow-2xs active:scale-95"
            >
              通知补拍
            </button>
          )}

          {status === '执行中' && (
            <button
              disabled
              className="px-6 py-2.5 bg-neutral-100 text-neutral-400 font-bold text-[14px] rounded-xl cursor-not-allowed"
            >
              等待执行
            </button>
          )}

          {status === '已完成' && (
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-black text-[14px] rounded-xl transition-all shadow-2xs active:scale-95"
            >
              查看已收集素材
            </button>
          )}
        </div>
      </div>

      {/* Section VI Operation Log Drawer/Modal (操作记录) */}
      {showOperationLog && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[16px] font-black text-neutral-900">操作记录</h3>
              <button
                onClick={() => setShowOperationLog(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-[13px] relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 pl-6">
              <div className="relative before:absolute before:-left-6 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:bg-neutral-900">
                <div className="font-bold text-neutral-900">8月1日 14:20</div>
                <div className="text-neutral-600">{currentTask.executor} 上传 S01</div>
              </div>
              <div className="relative before:absolute before:-left-6 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:bg-neutral-900">
                <div className="font-bold text-neutral-900">8月1日 14:21</div>
                <div className="text-neutral-600">S01 已收集</div>
              </div>
              <div className="relative before:absolute before:-left-6 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:bg-neutral-900">
                <div className="font-bold text-neutral-900">8月1日 14:35</div>
                <div className="text-neutral-600">{currentTask.executor} 上传 S03</div>
              </div>
              {currentTask.needsReshootCount > 0 && (
                <>
                  <div className="relative before:absolute before:-left-6 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:bg-rose-500">
                    <div className="font-bold text-rose-600">8月1日 14:36</div>
                    <div className="text-neutral-600">S03 需要补拍</div>
                  </div>
                  <div className="relative before:absolute before:-left-6 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:bg-neutral-900">
                    <div className="font-bold text-neutral-900">8月1日 14:40</div>
                    <div className="text-neutral-600">已通知 {currentTask.executor}</div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowOperationLog(false)}
                className="px-4 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supplemental Upload Modal (Section V: PC补充上传放在更多中) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[16px] font-black text-neutral-900">补充上传素材</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-neutral-500 font-medium">
              选择需要补充上传或更新的镜头：
            </p>

            <div className="space-y-3">
              {currentTask.shotsList.map((shot) => (
                <div
                  key={shot.id}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-[13px]"
                >
                  <div>
                    <span className="font-extrabold text-neutral-900 mr-2">{shot.shotCode}</span>
                    <span className="font-bold text-neutral-800">{shot.shotName}</span>
                  </div>
                  <button
                    onClick={() => handleUploadFile(shot.id)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 transition-all"
                  >
                    <Upload size={13} />
                    <span>选择文件上传</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 font-bold text-[13px] rounded-xl"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Executor Dialog */}
      {showEditExecutor && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-neutral-200">
            <h3 className="text-[16px] font-black text-neutral-900">修改执行人</h3>
            <input
              type="text"
              value={newExecutor}
              onChange={(e) => setNewExecutor(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 rounded-xl outline-none text-[13px] focus:border-neutral-900 font-bold"
              placeholder="请输入执行人姓名"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditExecutor(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 font-bold text-[13px] rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleSaveExecutor}
                className="px-4 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deadline Dialog */}
      {showEditDeadline && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-neutral-200">
            <h3 className="text-[16px] font-black text-neutral-900">调整截止时间</h3>
            <input
              type="text"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 rounded-xl outline-none text-[13px] focus:border-neutral-900 font-bold"
              placeholder="如 2026-08-08 18:00"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditDeadline(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 font-bold text-[13px] rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleSaveDeadline}
                className="px-4 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
