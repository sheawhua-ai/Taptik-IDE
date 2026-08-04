import React, { useState } from 'react';
import { SkillItem } from './types';
import {
  X, Wrench, CheckCircle2, AlertTriangle, Play, Settings,
  Terminal, ArrowRight, Layers, FileText, Ban, Wifi, Copy, Download, Power,
  ShieldCheck, HelpCircle, Code, Eye, EyeOff, Sparkles
} from 'lucide-react';

interface SkillDetailDrawerProps {
  skill: SkillItem | null;
  onClose: () => void;
  onTestSkill: (skill: SkillItem) => void;
  onInstallSkill?: (skill: SkillItem) => void;
  onUseInProject?: (skill: SkillItem) => void;
  onConfigAutoRun?: (skill: SkillItem) => void;
  onCopyAndEdit?: (skill: SkillItem) => void;
  onExportSkill?: (skill: SkillItem) => void;
  onToggleStatus?: (skill: SkillItem) => void;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({
  skill,
  onClose,
  onTestSkill,
  onInstallSkill,
  onUseInProject,
  onConfigAutoRun,
  onCopyAndEdit,
  onExportSkill,
  onToggleStatus
}) => {
  const [showBackendMetadata, setShowBackendMetadata] = useState(false);

  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-black text-neutral-900">{skill.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-neutral-100 text-neutral-800 border border-neutral-200">
                  {skill.version}
                </span>
                {skill.isComposite && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    复合技能
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-400 mt-1">
                <span>来源：{skill.source === 'official' ? '官方内建' : '自建扩展'}</span>
                <span>阶段：{skill.stageLabel || '通用运营阶段'}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content: 技能规范与使用说明 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[13px]">
          {/* Contract Banner */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-900 text-white rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="font-extrabold text-[13px]">技能规范与使用说明</span>
            </div>
            <span className="text-[11px] font-bold text-neutral-400">Agent 自动调度指南</span>
          </div>

          {/* 1. 目标 (Goal) */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
            <span className="text-neutral-900 font-extrabold block text-[12px] flex items-center gap-1.5">
              <span>1. 目标：解决什么业务问题</span>
            </span>
            <p className="text-neutral-700 font-bold leading-relaxed">{skill.goal || skill.oneSentenceDesc}</p>
          </div>

          {/* 2. 输入 & 3. 输出 (Inputs & Outputs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
              <span className="text-neutral-900 font-extrabold block text-[12px]">2. 输入：需要哪些项目资料</span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[12px]">
                {skill.inputFormat?.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-neutral-400 shrink-0">•</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
              <span className="text-neutral-900 font-extrabold block text-[12px]">3. 输出：交付什么结果</span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[12px]">
                {skill.outputFormat?.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-neutral-400 shrink-0">•</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. 使用范围 (Applicable / Inapplicable Scope) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
              <span className="text-emerald-900 font-extrabold block text-[12px]">4. 使用范围：适用阶段与项目</span>
              <ul className="space-y-1 text-emerald-950 font-medium text-[12px]">
                {skill.applicableScenes?.map((sc, i) => (
                  <li key={i}>• {sc}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2">
              <span className="text-rose-900 font-extrabold block text-[12px]">不适用场景：</span>
              <ul className="space-y-1 text-rose-950 font-medium text-[12px]">
                {skill.inapplicableScenes?.length ? (
                  skill.inapplicableScenes.map((insc, i) => (
                    <li key={i}>• {insc}</li>
                  ))
                ) : (
                  <li>• 暂无特别限制</li>
                )}
              </ul>
            </div>
          </div>

          {/* 5. 执行动作 & 6. 人工节点 (Execution Actions & Manual Checkpoints) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
              <span className="text-neutral-900 font-extrabold block text-[12px]">5. 执行动作：项目写入与待办</span>
              <p className="text-neutral-700 text-[12px] font-medium leading-relaxed">
                {skill.executionActions?.summary || '自动完成所设定的分析或优化任务，输出评估卡片。'}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skill.executionActions?.willWriteProject && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">修改项目方案</span>
                )}
                {skill.executionActions?.willCreateTodo && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-[10px] font-bold">创建项目待办</span>
                )}
                {skill.executionActions?.willCreateMaterialTask && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">发起素材任务</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-amber-900 font-extrabold block text-[12px]">6. 人工节点：什么时候必须确认</span>
              <ul className="space-y-1 text-amber-950 font-medium text-[12px]">
                {skill.manualConfirmPoints?.map((cp, idx) => (
                  <li key={idx}>• {cp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7. 证据要求 & 8. 失败处理 (Evidence & Failure Handling) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
              <span className="text-neutral-900 font-extrabold block text-[12px]">7. 证据要求：引用哪些依据</span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[12px]">
                {skill.evidenceRequirements?.length ? (
                  skill.evidenceRequirements.map((ev, i) => (
                    <li key={i}>• {ev}</li>
                  ))
                ) : (
                  <li>• 需明确引用来源数据记录</li>
                )}
              </ul>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
              <span className="text-neutral-900 font-extrabold block text-[12px]">8. 失败处理：缺资料或接口异常</span>
              <p className="text-neutral-700 font-medium text-[12px] leading-relaxed">{skill.failureHandling}</p>
            </div>
          </div>

          {/* 9. 评测标准 & 10. 版本记录 (Evaluation Standards & Version Notes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
              <span className="text-neutral-900 font-extrabold block text-[12px]">9. 评测标准：什么情况算成功</span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[12px]">
                {skill.evaluationStandards?.length ? (
                  skill.evaluationStandards.map((std, i) => (
                    <li key={i}>• {std}</li>
                  ))
                ) : (
                  <li>• 输出结构完整且符合预期校验</li>
                )}
              </ul>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
              <span className="text-neutral-900 font-extrabold block text-[12px]">10. 版本记录：是否影响现有项目</span>
              <p className="text-neutral-700 font-medium text-[12px] leading-relaxed">
                {skill.versionHistoryNotes || '当前版本无兼容性变更，可直接应用到所有现有项目中。'}
              </p>
            </div>
          </div>

          {/* 执行步骤详情 */}
          {skill.executionSteps?.length > 0 && (
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <h3 className="font-extrabold text-neutral-900 text-[13px]">标准执行步骤</h3>
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1.5 text-neutral-800 font-medium text-[12px]">
                {skill.executionSteps.map((st, i) => (
                  <div key={i}>{st}</div>
                ))}
              </div>
            </div>
          )}

          {/* Toggleable Backend Metadata Section (高级系统/评测调试字段) */}
          <div className="border-t border-neutral-200 pt-4">
            <button
              onClick={() => setShowBackendMetadata(!showBackendMetadata)}
              className="w-full flex items-center justify-between p-3.5 bg-neutral-100 hover:bg-neutral-200/80 rounded-2xl text-neutral-700 font-bold text-[12px] transition-all"
            >
              <div className="flex items-center gap-2">
                <Code size={15} className="text-neutral-600" />
                <span>后台隐藏维护字段 (技术执行与评测规范)</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                <span>{showBackendMetadata ? '收起' : '展开查看 (仅管理员与系统可见)'}</span>
                {showBackendMetadata ? <EyeOff size={14} /> : <Eye size={14} />}
              </div>
            </button>

            {showBackendMetadata && skill.backendMetadata && (
              <div className="mt-3 p-4 bg-neutral-900 text-neutral-200 rounded-2xl font-mono text-[11px] space-y-2 shadow-inner">
                <div className="text-neutral-400 font-sans font-bold pb-1 border-b border-neutral-800">
                  后台维护隐藏字段：操盘手不干扰，可作为系统评测与迭代的单元契约
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <div><span className="text-amber-400">执行模式:</span> {skill.backendMetadata.executionMode}</div>
                  <div><span className="text-amber-400">Worker:</span> {skill.backendMetadata.agentWorker}</div>
                  <div><span className="text-amber-400">工作流图:</span> {skill.backendMetadata.workflowGraph}</div>
                  <div><span className="text-amber-400">超时/预算:</span> {skill.backendMetadata.timeoutAndBudget}</div>
                  <div><span className="text-amber-400">幂等键:</span> {skill.backendMetadata.idempotencyKey}</div>
                  <div><span className="text-amber-400">重试策略:</span> {skill.backendMetadata.retryPolicy}</div>
                </div>
                <div className="pt-1">
                  <span className="text-amber-400">工具依赖:</span> {skill.backendMetadata.toolDependencies.join(', ')}
                </div>
                <div>
                  <span className="text-amber-400">数据源依赖:</span> {skill.backendMetadata.dataSourceDependencies.join(', ')}
                </div>
                <div>
                  <span className="text-amber-400">输入输出 Schema:</span> {skill.backendMetadata.inputOutputSchema}
                </div>
                <div>
                  <span className="text-amber-400">评测集与通过阈值:</span> {skill.backendMetadata.evalSetAndThreshold}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onInstallSkill?.(skill);
              }}
              disabled={skill.status === 'needs_config'}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-[12.5px] flex items-center gap-1.5 transition-all shadow-xs ${
                skill.status === 'needs_config'
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
              }`}
            >
              <Download size={14} /> 安装并启用 (支持 Agent 自动调用)
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-neutral-600">
            {onCopyAndEdit && (
              <button
                onClick={() => onCopyAndEdit(skill)}
                className="hover:text-neutral-900 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Copy size={14} /> 复制技能
              </button>
            )}
            {onExportSkill && (
              <button
                onClick={() => onExportSkill(skill)}
                className="hover:text-neutral-900 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download size={14} /> 导出 JSON
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
