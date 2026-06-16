import React from 'react';
import { Target, Sparkles, Workflow, LineChart, Share2, Plus, Bot, Users } from 'lucide-react';

interface Macro {
  id: string;
  name: string;
  icon: any;
  tier: 'system' | 'team' | 'personal';
  desc: string;
  count?: number;
}

const SYSTEM_MACROS: Macro[] = [
  { id: 'm1', name: '蓝海词挖掘', icon: Target, tier: 'system', desc: '执行全域巡航并产出长尾词表', count: 12480 },
  { id: 'm2', name: '爆文生成引擎', icon: Sparkles, tier: 'system', desc: '基于热点批量合成内容材料', count: 8931 },
  { id: 'm3', name: '全链路归因报告', icon: LineChart, tier: 'system', desc: '串联多维触点计算 ROI 资产', count: 5204 },
];

const TEAM_MACROS: Macro[] = [
  { id: 't1', name: '月度竞品简报', icon: Users, tier: 'team', desc: '拉取指定的3家竞品互动趋势', count: 212 },
  { id: 't2', name: '矩阵同步分发', icon: Share2, tier: 'team', desc: '一键派发给所有在线 KOS 节点', count: 853 },
];

const PERSONAL_MACROS: Macro[] = [];

interface SubagentMacroPanelProps {
  onRunMacro: (cmd: string) => void;
}

export const SubagentMacroPanel: React.FC<SubagentMacroPanelProps> = ({ onRunMacro }) => {
  return (
    <div className="flex-1 overflow-y-auto w-full custom-scrollbar flex flex-col pt-2 pb-6 px-4 space-y-8">
  {/* 个人宏 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Bot size={14} /> 个人智能体 (L3)
          </h3>
        </div>
        <div className="space-y-3">
          {PERSONAL_MACROS.length === 0 ? (
            <div className="text-center py-4 px-4 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
              <p className="text-[11px] font-bold text-neutral-400 leading-relaxed">暂无个人定制化智能体<br/>功能即将开放</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* 团队宏 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Users size={14} /> 团队共享 (L2)
          </h3>
        </div>
        <div className="space-y-2">
          {TEAM_MACROS.map(macro => (
            <button 
              key={macro.id}
              onClick={() => onRunMacro(`执行团队宏：「${macro.name}」`)}
              className="w-full text-left p-3 bg-white border border-neutral-100 rounded-2xl hover:border-primary-500 hover:shadow-sm transition-all group relative overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shrink-0">
                  <macro.icon size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-black text-neutral-800 mb-0.5">{macro.name}</div>
                  <div className="text-[10px] font-bold text-neutral-400 leading-tight">{macro.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 系统宏 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Workflow size={14} /> 系统预置 (L1)
          </h3>
        </div>
        <div className="space-y-2">
          {SYSTEM_MACROS.map(macro => (
            <button 
              key={macro.id}
              onClick={() => onRunMacro(`执行系统核心宏：「${macro.name}」`)}
              className="w-full text-left p-3 bg-white border border-neutral-100 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all shrink-0">
                  <macro.icon size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-black text-neutral-800 mb-0.5">{macro.name}</div>
                  <div className="text-[10px] font-bold text-neutral-400 leading-tight">{macro.desc}</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 text-[9px] font-black text-neutral-300 group-hover:text-primary-200 transition-colors">
                调用 {macro.count?.toLocaleString()} 次
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
