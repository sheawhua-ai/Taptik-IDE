import React, { useState } from 'react';
import { SkillItem } from './types';
import {
  ShieldCheck, AlertTriangle, Play, CheckCircle2, Terminal,
  Code, Activity, Award, RefreshCw, Layers, Sparkles, CheckCircle, Clock
} from 'lucide-react';

interface SkillEvalTabProps {
  skills: SkillItem[];
  onOpenDetail: (skill: SkillItem) => void;
  onRunTest: (skill: SkillItem) => void;
}

export const SkillEvalTab: React.FC<SkillEvalTabProps> = ({
  skills,
  onOpenDetail,
  onRunTest
}) => {
  const [runningEvalId, setRunningEvalId] = useState<string | null>(null);
  const [evalResults, setEvalResults] = useState<Record<string, { score: number; pass: boolean; log: string }>>({
    sk_comp_merchant_diag: { score: 94, pass: true, log: '通过 50 组行业商家资产诊断测试，识别准度 94%' },
    sk_comp_blue_ocean: { score: 91, pass: true, log: '100 组搜索痛点切入测试，假设生成有效率 91%' },
    sk_comp_project_ops: { score: 99, pass: true, log: '200 次异常收录与发文进度测试，误报率 1.2%' },
    sk_comp_content_plan: { score: 96, pass: true, log: '1000 篇脚本生成排重测试，原创质感通过率 96%' }
  });

  const handleSimulateEval = (skill: SkillItem) => {
    setRunningEvalId(skill.id);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 8) + 92;
      setEvalResults(prev => ({
        ...prev,
        [skill.id]: {
          score,
          pass: true,
          log: `最新回归基准集测试已通过（得分 ${score} 分，符合生产契约标准）`
        }
      }));
      setRunningEvalId(null);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Notice */}
      <div className="bg-btn-main text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500 text-neutral-950 font-black text-[11px] rounded-full uppercase tracking-wide">
              管理员与高级用户可见
            </span>
            <h2 className="text-[17px] font-black tracking-tight">
              技能系统运行与评测中心 (Skill Evaluation & Sandbox)
            </h2>
          </div>
          <p className="text-[12.5px] font-bold text-neutral-300">
            每一个 Skill 既是操盘手可理解的能力与任务模板，也是系统进行自动化评测和测试迭代的工程产品单元。
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] text-text-tertiary font-bold">
            数据源与网络连接可在“系统设置”内管理
          </span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-1 p-4 rounded-xl border border-border-default/90 shadow-xs">
          <span className="text-[11.5px] font-bold text-text-tertiary">自动化评测通过率</span>
          <div className="text-[22px] font-black text-text-main mt-1">98.2%</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-0.5 block">回归标准集全部绿色</span>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-default/90 shadow-xs">
          <span className="text-[11.5px] font-bold text-text-tertiary">在线可用契约技能</span>
          <div className="text-[22px] font-black text-text-main mt-1">{skills.filter(s => s.status !== 'needs_config').length} / {skills.length}</div>
          <span className="text-[11px] font-bold text-amber-600 mt-0.5 block">1 项等待配置数据连接</span>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-default/90 shadow-xs">
          <span className="text-[11.5px] font-bold text-text-tertiary">测试集评估综合均分</span>
          <div className="text-[22px] font-black text-text-main mt-1">94.3 分</div>
          <span className="text-[11px] font-bold text-text-tertiary mt-0.5 block">满足通过阈值 ≥ 88 分</span>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-default/90 shadow-xs">
          <span className="text-[11.5px] font-bold text-text-tertiary">本周期自动化调用</span>
          <div className="text-[22px] font-black text-text-main mt-1">2,180 次</div>
          <span className="text-[11px] font-bold text-text-tertiary mt-0.5 block">平均延迟 &lt; 2.4 秒</span>
        </div>
      </div>

      {/* Skills Evaluation Table */}
      <div className="bg-surface-1 rounded-2xl border border-border-default/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-border-default flex items-center justify-between">
          <h3 className="font-black text-[15px] text-text-main flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <span>核心技能契约回归测验记录</span>
          </h3>
          <span className="text-[12px] font-bold text-text-tertiary">
            点击单项运行回归可使用系统预设测试集进行端到端检验
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {skills.map(skill => {
            const evalInfo = evalResults[skill.id];
            const isRunning = runningEvalId === skill.id;

            return (
              <div key={skill.id} className="p-5 hover:bg-page-bg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[14.5px] text-text-main">
                      {skill.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-hover-bg text-text-secondary">
                      {skill.version}
                    </span>
                    {skill.isComposite && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                        复合技能契约
                      </span>
                    )}
                  </div>

                  <div className="text-[12px] font-bold text-text-tertiary">
                    评测集：{skill.backendMetadata?.evalSetAndThreshold || '标准功能测试用例套件'}
                  </div>

                  <div className="text-[12px] text-text-secondary flex items-center gap-2">
                    <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                    <span>
                      {evalInfo ? evalInfo.log : skill.lastVerifiedResult}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {evalInfo && (
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-text-tertiary block">评测测验得分</span>
                      <span className="text-[16px] font-black text-emerald-600">
                        {evalInfo.score} 分
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleSimulateEval(skill)}
                    disabled={isRunning}
                    className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12px] font-extrabold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
                    <span>{isRunning ? '正在运行评测...' : '运行回归测试'}</span>
                  </button>

                  <button
                    onClick={() => onOpenDetail(skill)}
                    className="p-2 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-xl transition-all"
                    title="查看完整业务契约与后台 Schema"
                  >
                    <Code size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
