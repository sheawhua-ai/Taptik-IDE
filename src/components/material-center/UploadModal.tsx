import React, { useState } from 'react';
import { CollectionTask, MaterialAsset } from './types';
import {
  X, Upload, Camera, AlertCircle, CheckCircle2, RefreshCw,
  FileWarning, ShieldAlert, Sparkles, Image as ImageIcon
} from 'lucide-react';

interface UploadModalProps {
  tasks: CollectionTask[];
  onClose: () => void;
  onSuccessUpload: (newAsset: MaterialAsset) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  tasks,
  onClose,
  onSuccessUpload
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const [selectedShotId, setSelectedShotId] = useState<string>(
    selectedTask?.shotsList[0]?.id || ''
  );
  const selectedShot = selectedTask?.shotsList.find((s) => s.id === selectedShotId);

  const [mediaUrl, setMediaUrl] = useState<string>(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80'
  );

  const [inspectStatus, setInspectStatus] = useState<'idle' | 'checking' | 'pass' | 'reject'>('idle');
  const [rejectReasons, setRejectReasons] = useState<string[]>([]);
  const [generatedUnderstanding, setGeneratedUnderstanding] = useState<string>('');

  const handleTaskChange = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.shotsList.length > 0) {
      setSelectedShotId(task.shotsList[0].id);
    } else {
      setSelectedShotId('');
    }
  };

  const handleSimulateInspection = (isPass: boolean) => {
    if (!selectedTask || !selectedShot) {
      alert('请先选择来源项目及收集任务，不可创建无来源素材');
      return;
    }

    setInspectStatus('checking');

    setTimeout(() => {
      if (isPass) {
        setInspectStatus('pass');
        const understanding = `在【${selectedTask.store}】由【${selectedTask.executor}】到店实拍的【${selectedShot.shotName}】镜头，画面干净清晰无反光，充分展现宠粮真实质感与宠物互动，可作为主项目图及通用首图调用。`;
        setGeneratedUnderstanding(understanding);

        const newAsset: MaterialAsset = {
          id: `mat_new_${Date.now().toString().slice(-4)}`,
          type: 'image',
          url: mediaUrl,
          aiOneLineUnderstanding: understanding,
          recommendationUse: '自动推荐用途（测试）',
          suitableForCover: 'suitable',
          coverReason: 'AI 检查通过，等待审核。',
          status: 'pending',
          sourceType: 'operator',
          sourceProject: selectedTask.projectName,
          sourceTask: selectedTask.taskName,
          uploader: selectedTask.executor,
          uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
          authStatus: 'pending',
          fileInfo: {
            resolution: '1080x1440',
            format: 'JPEG',
            size: '1.2 MB',
            aspectRatio: '3:4'
          },
          usageRecords: [],
          fullAiAnalysis: {
            subject: `${selectedShot.shotName} 主体`,
            product: '极宠家·敏感肠胃呵护粮',
            scene: selectedTask.store,
            composition: '标准3:4小红书竖图比例',
            lightingColor: '高显色自然光'
          }
        };

        setTimeout(() => {
          onSuccessUpload(newAsset);
        }, 800);
      } else {
        // AI 检查不通过 (Section 7.3)
        setInspectStatus('reject');
        setRejectReasons([
          '1. 产品包装正面不完整，难以识别产品标识；',
          '2. 局部发生高亮反光，文字内容可读性低于阈值；',
          '3. 构图偏离分镜说明要求，与已有图库存在较高相似重复率。'
        ]);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-500/20 text-primary-400 rounded-xl">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-[17px] font-black">上传素材（AI质量检查）</h3>
              <span className="text-[11px] font-bold text-neutral-300">
                必须先选择来源项目和素材任务，严禁形成无来源素材
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Section 4.1 必选来源项目与任务 */}
          <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            <h4 className="text-[13.5px] font-black text-neutral-900">
              1. 指定来源业务任务（必须保留所属项目与门店执行人）
            </h4>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11.5px] font-extrabold text-neutral-500 block mb-1">
                  选择来源项目及收集任务 *
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => handleTaskChange(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-800"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      【项目：{t.projectName}】· {t.taskName} ({t.store})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTask && (
                <div>
                  <label className="text-[11.5px] font-extrabold text-neutral-500 block mb-1">
                    指定拍摄分镜 *
                  </label>
                  <select
                    value={selectedShotId}
                    onChange={(e) => setSelectedShotId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-800"
                  >
                    {selectedTask.shotsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shotCode} - {s.shotName} ({s.requirementDesc})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedTask && (
                <div className="grid grid-cols-2 gap-2 text-[11.5px] text-neutral-600 pt-1">
                  <div><span className="font-bold text-neutral-400">执行门店：</span>{selectedTask.store}</div>
                  <div><span className="font-bold text-neutral-400">执行人：</span>{selectedTask.executor}</div>
                </div>
              )}
            </div>
          </div>

          {/* 2. 选择素材或示例图 */}
          <div className="space-y-3">
            <h4 className="text-[13.5px] font-black text-neutral-900">
              2. 待检查图片 URL 或拍摄样本
            </h4>
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-medium text-neutral-800"
              placeholder="输入图片/视频 URL..."
            />
            <div className="flex items-center gap-2">
              <img
                src={mediaUrl}
                alt="Upload preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover border border-neutral-200"
              />
              <span className="text-[12px] text-neutral-500">
                预览待检图：将进行全自动AI质量分析、清晰度校验、禁限内容核查与【一句话理解】生成。
              </span>
            </div>
          </div>

          {/* AI 检查状态和结果交互 (Section 7.2 & 7.3) */}
          {inspectStatus === 'checking' && (
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-2xl flex items-center gap-3">
              <RefreshCw size={20} className="text-primary-600 animate-spin shrink-0" />
              <div className="space-y-1">
                <div className="font-black text-primary-900 text-[13.5px]">
                  AI 正在执行上传自动审查流水线...
                </div>
                <div className="text-[11.5px] text-primary-700">
                  检查项：清晰度及画质 · 禁止内容过滤 · 重复率排查 · OCR字迹识别 · 自动生成一句话理解并构建检索索引
                </div>
              </div>
            </div>
          )}

          {inspectStatus === 'pass' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-emerald-900 text-[14px]">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>AI 上传检查通过！已生成一句话理解并写入素材池</span>
              </div>
              <p className="text-[12.5px] font-bold text-emerald-800">
                {generatedUnderstanding}
              </p>
            </div>
          )}

          {inspectStatus === 'reject' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
              <div className="flex items-start gap-2 text-rose-900">
                <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-black text-[14px]">
                    这张图片不符合当前拍摄要求，需要重新拍摄。
                  </div>
                  <div className="text-[12px] text-rose-800 space-y-1 font-medium">
                    {rejectReasons.map((r, idx) => (
                      <div key={idx}>{r}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作按钮 (Section 7.3) */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setInspectStatus('idle')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[12px] font-extrabold transition-colors shadow-2xs"
                >
                  重新拍摄 / 重新选择
                </button>
                <button
                  type="button"
                  onClick={() => alert(`【分镜指引】\n1. 确保环境光亮无直射高光反光；\n2. 拍摄视角必须呈现完整的品牌正面包装及文字清晰可读。`)}
                  className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 rounded-xl text-[12px] font-bold"
                >
                  查看拍摄要求
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-200/80 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[13px] transition-colors"
          >
            取消
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSimulateInspection(false)}
              disabled={inspectStatus === 'checking'}
              className="px-4 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-[12.5px] font-bold transition-all"
            >
              演示：检查不通过
            </button>
            <button
              type="button"
              onClick={() => handleSimulateInspection(true)}
              disabled={inspectStatus === 'checking'}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-black flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <Sparkles size={15} className="text-amber-400" />
              <span>提交并执行 AI 检查</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
