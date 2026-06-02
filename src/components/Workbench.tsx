import React, { useState } from 'react';
import { 
  Search, Sparkles, Zap, ArrowRight, Target, BarChart2, 
  Workflow, Layers, MessageSquare, Filter, Star, Orbit,
  Compass, Lightbulb, ZapOff, Bot, Brain, LayoutGrid,
  ShieldCheck, ArrowUpRight, ChevronLeft, AppWindow,
  Activity, Fingerprint, ChevronRight, Database, Library
} from 'lucide-react';
import { motion } from 'motion/react';
import { DataCenter } from './DataCenter';

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: any) => void;
  dataSubNav: string;
  onSend?: (query: string) => void;
}

const STRATEGIC_AGENTS = [
  { 
    id: 'blueocean', 
    name: '蓝海决策 Agent', 
    icon: Target, 
    desc: '需输入关键词。深度扫描平台潜力长尾词，生成拓词策略。', 
    color: 'text-primary-500', 
    bg: 'bg-primary-50',
    type: 'manual'
  },
  { 
    id: 'content', 
    name: '爆文智能 Agent', 
    icon: Sparkles, 
    desc: '需提供素材。基于行业热点合成强网感笔记，自动优化钩子。', 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    type: 'manual'
  },
];

const INTELLIGENCE_AGENTS = [
  { 
    id: 'roi', 
    name: 'ROI 归因 Agent', 
    icon: Workflow, 
    desc: '全自动运行。打通曝光到转化的数据黑盒，实时输出波动分析。', 
    color: 'text-secondary-500', 
    bg: 'bg-secondary-50',
    type: 'auto',
    subNav: 'roi_attribution'
  },
  { 
    id: 'monitoring', 
    name: '全域监测 Agent', 
    icon: Activity, 
    desc: '全自动运行。监测商家违规、爆文趋势及竞对异动预警。', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50',
    type: 'auto',
    subNav: 'overview'
  },
];

const SUGGESTIONS = [
  "分析商家 A 上周的 ROI 波动原因",
  "为我的宠物零食寻找蓝海关键词",
  "自动生成 5 篇改写后的爆文草稿",
  "查看当前所有商家的履约状态"
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, dataSubNav, onSend }) => {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'hub' | 'detail'>('hub');

  const handleManualAgentClick = (name: string) => {
    setQuery(`启动 [${name}]：`);
  };

  const handleAutoAgentClick = (subNav: string) => {
    setDataSubNav(subNav);
    setView('detail');
  };

  const handleExecute = () => {
    if (query.trim() && onSend) {
      onSend(query);
    }
  };

  if (view === 'detail') {
    return (
      <div className="flex-1 flex flex-col h-full bg-taptik-cream overflow-hidden">
        <div className="h-16 flex items-center gap-4 px-6 border-b border-taptik-line bg-taptik-cream shrink-0">
           <button 
             onClick={() => setView('hub')} 
             className="text-taptik-muted hover:text-taptik-ember hover:bg-taptik-paper p-1.5 rounded-lg transition-colors flex items-center gap-2 pr-3"
           >
              <ChevronLeft size={20} />
              <span className="text-[13px] font-bold text-taptik-ink uppercase tracking-tight">智能 Hub</span>
           </button>
           <div className="h-4 w-px bg-taptik-line mx-2" />
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-taptik-moss animate-pulse" />
             <span className="text-[14px] font-black text-taptik-ink tracking-tight">
               {dataSubNav === 'overview' && '系统级全域监测情报'}
               {dataSubNav === 'roi_attribution' && '全链路 ROI 深度归因'}
               {dataSubNav === 'blueocean' && '蓝海决策情报系统'}
             </span>
           </div>
        </div>
        <div className="flex-1 overflow-hidden">
           <DataCenter dataSubNav={dataSubNav as any} setDataSubNav={setDataSubNav} setActiveNav={setActiveNav} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-taptik-cream overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full px-8 py-16 space-y-20">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-taptik-ember text-[11px] font-black uppercase tracking-[0.24em]">
            <Orbit size={18} className="animate-spin-slow" /> 
            <span>Taptik Strategic Intelligence Hub</span>
          </div>
          <h1 className="text-5xl font-black text-taptik-ink tracking-tighter leading-[0.95] font-serif">
            操盘手，欢迎回来。<br/>
            <span className="text-taptik-muted opacity-40">Command Center is Ready.</span>
          </h1>
        </div>

        {/* Command Center */}
        <div className="relative group">
          <div className="absolute -inset-1 taptik-cta-gradient rounded-[32px] blur opacity-10 group-focus-within:opacity-25 transition duration-1000"></div>
          <div className="relative flex flex-col bg-taptik-paper border border-taptik-line rounded-[32px] shadow-2xl overflow-hidden shadow-taptik-ember/5">
            <div className="flex items-center px-8 py-7 gap-5">
              <Search className="text-taptik-muted/60" size={28} />
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="发送业务指令、调用私有知识库或启动 Agent..."
                className="flex-1 bg-transparent border-none outline-none text-2xl font-black font-serif placeholder:text-taptik-muted/20 text-taptik-ink"
              />
              <button 
                onClick={handleExecute}
                className="taptik-cta-gradient text-white pl-8 pr-5 py-4 rounded-[18px] font-black text-[14px] flex items-center gap-3 hover:scale-[1.02] transition-all shadow-lg active:scale-95 shadow-taptik-ember/20"
              >
                执行操盘指令 <div className="p-1 px-3 bg-white/20 rounded-lg"><Zap size={16} className="fill-current" /></div>
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-8 pb-8 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black text-taptik-muted uppercase tracking-[0.24em] mr-4 shrink-0 opacity-40">实时上下文:</span>
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setQuery(s)}
                  className="px-5 py-2.5 bg-taptik-cream/50 hover:bg-taptik-cream border border-taptik-line rounded-[16px] text-[12px] font-bold text-taptik-muted whitespace-nowrap transition-all hover:text-taptik-ink hover:border-taptik-ember/30"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Agents (Manual) */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-taptik-line pb-5">
              <h3 className="text-[18px] font-black text-taptik-ink tracking-tight flex items-center gap-3 font-serif">
                 <Target size={22} className="text-taptik-ember" />
                 项目决策 Agent <span className="text-[10px] bg-taptik-ember text-white px-2 py-0.5 rounded-[6px] ml-2 uppercase font-black tracking-widest">Manual</span>
              </h3>
              <button onClick={() => setActiveNav('skills')} className="text-[10px] font-black text-taptik-muted hover:text-taptik-ember transition-colors uppercase tracking-[0.24em] opacity-40 hover:opacity-100">所有策略插件 &rarr;</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {STRATEGIC_AGENTS.map(agent => (
                <button 
                  key={agent.id}
                  onClick={() => handleManualAgentClick(agent.name)}
                  className="group relative bg-taptik-paper border border-taptik-line p-10 rounded-[48px] text-left hover:border-taptik-ember/30 hover:shadow-2xl hover:shadow-taptik-ember/5 transition-all shadow-sm flex items-start gap-8"
                >
                  <div className={`w-24 h-24 shrink-0 ${agent.id === 'blueocean' ? 'bg-orange-50 text-taptik-ember' : 'bg-purple-50 text-purple-600'} rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                     <agent.icon size={42} />
                  </div>
                  <div className="flex-1 pr-6 relative">
                    <h4 className="text-[22px] font-black text-taptik-ink mb-2 font-serif tracking-tight leading-none">{agent.name}</h4>
                    <p className="text-[14px] text-taptik-muted font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{agent.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-taptik-ember opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       <span className="text-[10px] font-black uppercase tracking-[0.24em]">启动部署 &rarr;</span>
                    </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Intelligence Agents (Auto) */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-taptik-line pb-5">
              <h3 className="text-[18px] font-black text-taptik-ink tracking-tight flex items-center gap-3 font-serif">
                 <Activity size={22} className="text-taptik-moss" />
                 情报监测 Agent <span className="text-[10px] bg-taptik-moss text-white px-2 py-0.5 rounded-[6px] ml-2 uppercase font-black tracking-widest">Automatic</span>
              </h3>
              <button onClick={() => setActiveNav('data')} className="text-[10px] font-black text-taptik-muted hover:text-taptik-moss transition-colors uppercase tracking-[0.24em] opacity-40 hover:opacity-100">查看实时看板 &rarr;</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {INTELLIGENCE_AGENTS.map(agent => (
                <button 
                  key={agent.id}
                  onClick={() => handleAutoAgentClick(agent.subNav)}
                  className="group relative bg-taptik-paper border border-taptik-line p-10 rounded-[48px] text-left hover:border-taptik-moss/30 hover:shadow-2xl hover:shadow-taptik-moss/5 transition-all shadow-sm flex items-start gap-8"
                >
                  <div className={`w-24 h-24 shrink-0 ${agent.id === 'roi' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-taptik-moss'} rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                     <agent.icon size={42} />
                  </div>
                  <div className="flex-1 pr-6 relative">
                    <div className="flex items-center gap-2 mb-2">
                       <h4 className="text-[22px] font-black text-taptik-ink font-serif tracking-tight leading-none">{agent.name}</h4>
                       <div className="flex size-2 rounded-full bg-taptik-moss animate-pulse" />
                    </div>
                    <p className="text-[14px] text-taptik-muted font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{agent.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-taptik-moss opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       <span className="text-[10px] font-black uppercase tracking-[0.24em]">查看实时报表 &rarr;</span>
                    </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Org Identity & Assets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
           <div className="col-span-1 md:col-span-2 taptik-dark-panel rounded-[48px] p-16 text-white relative overflow-hidden group border-none">
              <div className="absolute -top-10 -right-10 p-12 opacity-5 group-hover:scale-110 transition-transform blur-md">
                 <Brain size={320} className="text-white" />
              </div>
              <div className="relative z-10 max-w-xl">
                 <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    <Fingerprint size={16} /> Organization Identity
                 </div>
                 <h2 className="text-4xl font-black tracking-tight mb-6 leading-[1.1] font-serif">面向组织的操盘系统已对齐</h2>
                 <p className="text-white/60 text-[16px] font-bold mb-10 leading-relaxed">
                    已通过 API 安全同步您的组织架构。Agent 环境与数据资产已实现跨租户物理隔离。
                 </p>
                 <button 
                   onClick={() => setActiveNav('management')}
                   className="bg-white text-taptik-ink hover:scale-105 px-10 py-4 rounded-[18px] font-black text-[14px] transition-all flex items-center gap-3 shadow-2xl shadow-black/40"
                 >
                    查看身份与权限矩阵 <ChevronRight size={18} />
                 </button>
              </div>
           </div>

           <div className="bg-taptik-paper border border-taptik-line rounded-[48px] p-10 flex flex-col items-center justify-center text-center group hover:border-taptik-ember/30 transition-all cursor-pointer shadow-sm shadow-taptik-muted/5">
              <div className="w-24 h-24 bg-taptik-cream text-taptik-ink rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-taptik-ember/10 group-hover:text-taptik-ember transition-all shadow-inner border border-taptik-line/20">
                <Library size={44} />
              </div>
              <h3 className="text-[24px] font-black text-taptik-ink mb-3 font-serif tracking-tight">数字知识资产</h3>
              <p className="text-[14px] text-taptik-muted font-bold leading-relaxed px-6 opacity-60 group-hover:opacity-100 transition-opacity">
                存储包含策略文档、分析模型在内的核心资产。
              </p>
              <button 
                onClick={() => setActiveNav('files')} 
                className="mt-8 text-[11px] font-black text-taptik-ember uppercase tracking-[0.24em] underline underline-offset-8 decoration-taptik-ember/30 hover:decoration-taptik-ember transition-all"
              >
                进入资产中心
              </button>
           </div>
        </div>

        {/* Footer info */}
        <div className="pt-12 border-t border-taptik-line flex items-center justify-between text-[10px] font-black text-taptik-muted uppercase tracking-[0.24em] opacity-40">
           <div className="flex gap-10">
              <span>Taptik Strategic Hub</span>
              <span>v2.1 (Decentralized Governance)</span>
           </div>
           <div className="flex gap-12">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-taptik-moss" /> All Nodes Online</span>
              <span className="flex items-center gap-2 text-taptik-ember"><Zap size={14} className="fill-current"/> Enterprise Secure Tunnel</span>
           </div>
        </div>
      </div>
    </div>
  );
};
