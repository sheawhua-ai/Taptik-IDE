import React, { useState } from 'react';
import { AppScope, ExpertItem, SkillItem } from './types';
import {
  X, Upload, FileCode, CheckCircle2, ShieldAlert, Terminal, ArrowRight,
  FolderArchive, Link, FileText, AlertTriangle, RefreshCw, Wifi, Lock
} from 'lucide-react';

interface ImportCapabilityModalProps {
  onClose: () => void;
  onImportComplete: (importedItem: any) => void;
}

export const ImportCapabilityModal: React.FC<ImportCapabilityModalProps> = ({
  onClose,
  onImportComplete
}) => {
  const [importSource, setImportSource] = useState<'zip' | 'folder' | 'md' | 'git'>('zip');
  const [gitUrl, setGitUrl] = useState<string>('https://github.com/taptik-skills/ecom-audit-pack.git');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkPassed, setCheckPassed] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<AppScope>('merchant');

  // Simulated Safety Check Report
  const [safetyReport, setSafetyReport] = useState<{
    readScope: string;
    writeScope: string;
    needsNetwork: boolean;
    hasExecutables: boolean;
    conflicts: string[];
  } | null>(null);

  const handleRunSafetyCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setCheckPassed(true);
      setSafetyReport({
        readScope: '商家本地图片库, OCR剪贴板',
        writeScope: '仅项目待办',
        needsNetwork: false,
        hasExecutables: false,
        conflicts: []
      });
    }, 900);
  };

  const handleInstallToLocal = () => {
    const newItem: SkillItem = {
      id: `sk_imported_${Date.now()}`,
      name: '小红书品牌首图合规检测包 (导入)',
      goal: '批量识别图文违规词',
      oneSentenceDesc: '来自 GitHub 社区导出的品牌合规检测包',
      processCategory: 'audit',
      status: 'installed', // 已安装但未启用 (Requirement 15)
      updatedAt: '刚才',
      version: '2.1.0',
      source: 'external',
      inputFormat: ['图片URL'],
      outputFormat: ['违规风险报告'],
      applicableScenes: ['品牌检测', '首图查重'],
      inapplicableScenes: ['视频剪辑'],
      preConditions: ['载入依赖库'],
      executionSteps: ['解析图片', '比对规则'],
      risksAndLimits: ['依赖外网离线镜像'],
      failureHandling: '沙箱环境阻断并告警',
      manualConfirmPoints: ['导入启用需管理员二次确认'],
      lastTestStatus: 'passed',
      lastVerifiedResult: '已通过沙箱安全检测',
      usedByExpertsCount: 0,
      usedByProjectsCount: 0,
      usedByExperts: [],
      usedByProjects: [],
      appScope: selectedScope,
      requiredPermissions: {
        readScope: ['图片'],
        writeScope: ['待办'],
        needsNetwork: false,
        willModifyData: false
      }
    };

    onImportComplete(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-blue-600" />
            <h3 className="text-[16px] font-extrabold text-neutral-900">导入外部能力包</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        {/* Source selector */}
        <div className="space-y-2">
          <label className="text-[12px] font-extrabold text-neutral-500 uppercase tracking-wider block">
            选择导入来源类型：
          </label>
          <div className="grid grid-cols-4 gap-2 text-[12px] font-extrabold">
            <button
              onClick={() => setImportSource('zip')}
              className={`p-2.5 rounded-xl border text-center ${importSource === 'zip' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
            >
              ZIP 压缩包
            </button>
            <button
              onClick={() => setImportSource('folder')}
              className={`p-2.5 rounded-xl border text-center ${importSource === 'folder' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
            >
              本地文件夹
            </button>
            <button
              onClick={() => setImportSource('md')}
              className={`p-2.5 rounded-xl border text-center ${importSource === 'md' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
            >
              SOP / Markdown
            </button>
            <button
              onClick={() => setImportSource('git')}
              className={`p-2.5 rounded-xl border text-center ${importSource === 'git' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
            >
              Git 仓库 URL
            </button>
          </div>
        </div>

        {/* Input area */}
        {importSource === 'git' ? (
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-neutral-600 block">仓库地址：</label>
            <input
              type="text"
              value={gitUrl}
              onChange={e => setGitUrl(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12.5px] font-bold"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-6 text-center space-y-2 bg-neutral-50/50">
            <FolderArchive size={28} className="mx-auto text-neutral-400" />
            <span className="text-[13px] font-extrabold text-neutral-800 block">点击或拖拽文件到此处上传</span>
            <span className="text-[11.5px] text-neutral-400 block">支持 .zip, .md, .json 格式的能力描述包</span>
          </div>
        )}

        {/* Run Safety Check Button */}
        {!checkPassed && (
          <button
            onClick={handleRunSafetyCheck}
            disabled={isChecking}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-extrabold rounded-xl flex items-center justify-center gap-2"
          >
            {isChecking ? <RefreshCw size={15} className="animate-spin" /> : <ShieldAlert size={15} />}
            <span>{isChecking ? '正在解析并做安全与依赖检查...' : '检查能力包'}</span>
          </button>
        )}

        {/* Check Results */}
        {checkPassed && safetyReport && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-[12px]">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-[13px]">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>安全与依赖检查通过！无特权可执行脚本与冲突。</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-emerald-950 font-medium pt-1">
                <div>读取范围：{safetyReport.readScope}</div>
                <div>写入范围：{safetyReport.writeScope}</div>
                <div>网络连接：{safetyReport.needsNetwork ? '需要' : '不需要'}</div>
                <div>状态设定：已安装但未启用</div>
              </div>
            </div>

            {/* Installation Scope selector */}
            <div className="space-y-1">
              <label className="text-[12px] font-extrabold text-neutral-600 block">选择安装作用域：</label>
              <select
                value={selectedScope}
                onChange={e => setSelectedScope(e.target.value as AppScope)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-[12.5px]"
              >
                <option value="merchant">当前商家 (皇家宠物食品)</option>
                <option value="task">仅本次任务</option>
                <option value="project">当前项目</option>
                <option value="all">全部商家</option>
              </select>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 text-neutral-700 text-[12.5px] font-bold rounded-xl"
          >
            取消
          </button>

          {checkPassed && (
            <button
              onClick={handleInstallToLocal}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[12.5px] font-extrabold rounded-xl shadow-2xs"
            >
              安装到本地 (默认已安装未启用)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
