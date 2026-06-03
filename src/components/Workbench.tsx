import React, { useState } from 'react';
import { 
  Search, Sparkles, Zap, ArrowRight, Target, BarChart2, 
  Workflow, Layers, MessageSquare, Filter, Star, Orbit,
  Compass, Lightbulb, ZapOff, Bot, Brain, LayoutGrid,
  ShieldCheck, ArrowUpRight, Cpu, Activity, Share2, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: any) => void;
}

const SKILL_SHORTCUTS = [
  { 
    id: 'blueocean', 
    name: '蓝海词探测', 
    icon: Target, 
    desc: '深度扫描小红书潜力长尾词', 
    color: 'text-primary-500', 
    bg: 'bg-primary-50',
    nav: 'data',
    subNav: 'blueocean'
  },
  { 
    id: 'roi', 
    name: '全链路归因', 
    icon: Workflow, 
    desc: '打通曝光到转化的数据黑盒', 
    color: 'text-secondary-500', 
    bg: 'bg-secondary-50',
    nav: 'data',
    subNav: 'roi_attribution'
  },
  { 
    id: 'content', 
    name: '爆文生成引擎', 
    icon: Sparkles, 
    desc: '基于行业热点合成网感笔记', 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    nav: 'skills',
    subNav: 'my'
  },
];

const SUGGESTIONS = [
  "分析商家 A 上周的 ROI 波动原因",
  "为我的宠物零食寻找蓝海关键词",
  "自动生成 5 篇改写后的爆文草稿",
  "查看当前所有商家的履约状态"
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav }) => {
  const [query, setQuery] = useState('');

  const handleShortcutClick = (nav: string, subNav: string) => {
    setActiveNav(nav);
    setDataSubNav(subNav);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full px-8 py-16 space-y-20">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-500 text-[11px] font-black uppercase tracking-[0.2em]">
            <Orbit size={14} className="animate-spin-slow" /> TapTik Intelligence Hub
          </div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight">
            你好，Agent 已就绪。<br/>
            <span className="text-neutral-400">你想处理哪项业务？</span>
          </h1>
        </div>

        {/* Command Center */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-[32px] blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
          <div className="relative flex flex-col bg-white border border-neutral-200 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="flex items-center px-8 py-6 gap-4">
              <Search className="text-neutral-400" size={24} />
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="在此输入您的业务指令，例如：'分析蓝海词' 或 '生成文案'..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-neutral-300 text-neutral-900"
              />
              <button className="bg-neutral-900 text-white px-8 py-3.5 rounded-2xl font-black text-[14px] flex items-center gap-2 hover:bg-primary-500 transition-all shadow-lg active:scale-95">
                执行任务 <Zap size={18} className="fill-current" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-8 pb-6 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mr-2 shrink-0">试试这样说:</span>
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setQuery(s)}
                  className="px-4 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 rounded-xl text-[12px] font-bold text-neutral-500 whitespace-nowrap transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Planning (The Brain) */}
        <div className="bg-white border border-neutral-100 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                        <Brain size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-neutral-900 tracking-tight">智控任务分解 (Plan Deconstruction)</h3>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Intelligent Orchestration Engine</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-[12px] font-black transition-all">
                    调整全局策略
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
                {/* Visual Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-100 -translate-y-1/2 hidden lg:block z-0" />
                
                {[
                    { step: '01', title: '意图识别', desc: '夏季大促爆文生产', icon: Search, status: 'completed' },
                    { step: '02', title: '任务编排', desc: '跨子 Agent 协同链路', icon: Workflow, status: 'active' },
                    { step: '03', title: '人机校验', desc: '等待内容质量确认', icon: ShieldCheck, status: 'pending' },
                    { step: '04', title: '自动化分发', desc: '全渠道定时任务写入', icon: Share2, status: 'pending' },
                ].map((node, i) => (
                    <div key={i} className="relative z-10 bg-white border border-neutral-100 p-6 rounded-3xl shadow-sm hover:border-orange-500/30 transition-all group">
                        <div className={`w-8 h-8 ${node.status === 'completed' ? 'bg-emerald-500' : node.status === 'active' ? 'bg-orange-500 animate-pulse' : 'bg-neutral-100'} text-white rounded-full flex items-center justify-center text-[11px] font-black mb-4`}>
                            {node.status === 'completed' ? <CheckCircle2 size={16} /> : node.step}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[14px] font-black text-neutral-900">{node.title}</p>
                            <p className="text-[11px] font-medium text-neutral-400 leading-relaxed">{node.desc}</p>
                        </div>
                        {node.status === 'active' && (
                            <button className="mt-4 w-full py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
                                查看详细拆解
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Capability Cards / Agents */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                 <Cpu size={24} className="text-primary-500" />
                 智能体任务池 (Missions)
              </h3>
              <div className="flex items-center gap-2">
                 <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">3 AGENTS IDLE</span>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILL_SHORTCUTS.map(skill => (
                <button 
                  key={skill.id}
                  onClick={() => handleShortcutClick(skill.nav, skill.tab)}
                  className="group relative bg-neutral-0 border border-neutral-200 p-8 rounded-[40px] text-left hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 transition-all"
                >
                  <div className={`w-14 h-14 ${skill.bg} ${skill.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                     <skill.icon size={28} />
                  </div>
                  <h4 className="text-[18px] font-black text-neutral-900 mb-2">{skill.name}</h4>
                  <p className="text-[13px] text-neutral-400 font-bold leading-relaxed">{skill.desc}</p>
                  <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
                     <span className="text-[11px] font-black text-primary-500 uppercase tracking-widest">启动流水线任务</span>
                     <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-primary-500 group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                     </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Orchestration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
                <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                    <Workflow size={24} className="text-primary-500" />
                    当前编排计划 (Active Plans)
                </h3>
                <div className="space-y-3">
                    {[
                        { title: '夏季大促爆文流水线', status: '85%', agent: '生产 Agent', color: 'bg-primary-500' },
                        { title: '竞品巡航与蓝海词探测', status: '40%', agent: '巡航 Agent', color: 'bg-orange-500' },
                    ].map((plan, i) => (
                        <div key={i} className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 group hover:bg-white hover:shadow-xl hover:shadow-neutral-500/5 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[13px] font-black text-neutral-900">{plan.title}</span>
                                <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">{plan.agent}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                    <div className={`h-full ${plan.color} rounded-full`} style={{ width: plan.status }} />
                                </div>
                                <span className="text-[10px] font-black text-neutral-900">{plan.status}</span>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-3xl text-neutral-400 text-[13px] font-black hover:border-primary-500/30 hover:text-primary-500 transition-all">
                        + 创建全新编排任务
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                    <ShieldCheck size={24} className="text-emerald-500" />
                    质量与反馈 (Closed Loop)
                </h3>
                <div className="bg-neutral-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Activity size={80} className="text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Real-time Feedback</p>
                        <p className="text-[14px] font-bold text-neutral-300 leading-relaxed mb-6">
                            监测到 <span className="text-white">6 篇</span> 笔记入池表现低于预期。Agent 已自动调整 <span className="text-emerald-400">#关键词权重</span> 并重排明后天的发布任务。
                        </p>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-black transition-all">
                            查看优化详情
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Org Context Preview */}
        <div className="bg-neutral-900 rounded-[40px] p-12 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
              <Brain size={180} className="text-primary-500" />
           </div>
           <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                 <ShieldCheck size={14} /> Org Collaborative Mode
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-4 leading-tight">面向组织的协同能力已就绪</h2>
              <p className="text-neutral-400 text-[15px] font-bold mb-8 leading-relaxed">
                 TapTik 已通过 API 对接飞书/钉钉组织架构。您无需手动创建账号，所有成员及权限均已自动对齐。您可以直接在 IM 中接收 Agent 推送的任务波报。
              </p>
              <button 
                onClick={() => setActiveNav('management')}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-2xl font-black text-[13px] transition-all flex items-center gap-2"
              >
                 进入组织管理中心 <ArrowRight size={16} />
              </button>
           </div>
        </div>

        {/* Footer info */}
        <div className="pt-10 border-t border-neutral-100 flex items-center justify-between text-[11px] font-black text-neutral-300 uppercase tracking-widest">
           <span>Taptik v2.1 (Intelligence Driven)</span>
           <div className="flex gap-6">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success-500" /> System Online</span>
              <span className="flex items-center gap-2 text-primary-500"><Zap size={12}/> 50+ Active Skills</span>
           </div>
        </div>
      </div>
    </div>
  );
};
