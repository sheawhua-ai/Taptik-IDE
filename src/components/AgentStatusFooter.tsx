import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, CheckCircle2, Workflow, Cpu, Search, PenTool, 
  Layers, TrendingUp, Sparkles, Terminal, Globe, Brain, 
  Code, Database, Zap, ChevronUp, Bot, MessageSquare, AlertCircle
} from 'lucide-react';

interface AgentTask {
  id: string;
  agent: string;
  action: string;
  status: 'thinking' | 'acting' | 'calling_tool' | 'done';
  tool?: string;
}

const MOCK_ACTIVE_TASKS: AgentTask[] = [
  { id: 't1', agent: '市场巡航员', action: '正在分析小红书“蓝海”关键词趋势...', status: 'acting', tool: 'Search API' },
  { id: 't2', agent: '智造创意官', action: '正在为 Gen-Z 受众合成视觉风格...', status: 'thinking' },
  { id: 't3', agent: '编排调度员', action: '正在编排多平台发布节点...', status: 'thinking' },
];

export const AgentStatusFooter: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeTasks] = useState<AgentTask[]>(MOCK_ACTIVE_TASKS);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Expanded Logic View */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-16 left-6 right-6 pointer-events-auto"
          >
            <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden max-w-7xl mx-auto">
              <div className="grid grid-cols-12 h-[320px]">
                {/* Left: Execution Stack */}
                <div className="col-span-8 border-r border-neutral-800 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                      <h3 className="text-[12px] font-black text-white uppercase tracking-widest">实时执行任务栈</h3>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">并发线程: 03</div>
                  </div>
                  
                  <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                    {activeTasks.map((task) => (
                      <motion.div 
                        key={task.id}
                        layout
                        className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-primary-500">
                            {task.agent === 'Market Scout' && <Globe size={18} />}
                            {task.agent === 'Creative Director' && <PenTool size={18} />}
                            {task.agent === 'Orchestrator' && <Layers size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-white">{task.agent}</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-neutral-800 text-[9px] font-mono text-neutral-400">ID: {task.id}</span>
                            </div>
                            <div className="text-[12px] font-bold text-neutral-400 mt-0.5 font-mono">
                              {task.status === 'thinking' ? "> 思考中: " : "> 执行中: "} 
                              <span className="text-primary-400">{task.action}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {task.tool && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 rounded-full border border-primary-500/20">
                              <Zap size={10} className="text-primary-500" />
                              <span className="text-[9px] font-black text-primary-500 uppercase">{task.tool}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                            <Activity size={12} className="text-primary-500 animate-pulse" />
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Active</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Thought Stream / Logs */}
                <div className="col-span-4 bg-black/40 p-8 flex flex-col">
                  <div className="flex items-center gap-2 text-neutral-500 mb-6">
                    <Terminal size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">底层逻辑思维流</span>
                  </div>
                  <div className="flex-1 font-mono text-[11px] text-neutral-500 space-y-2 overflow-hidden relative">
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/0 to-transparent pointer-events-none" />
                    <p className="text-emerald-500/80">{"[09:20:11] 初始化中：跨平台内容飞轮系统"}</p>
                    <p>{"[09:20:12] 调用工具：search_industry_trends(category=\"生活方式\")"}</p>
                    <p>{"[09:20:15] 解析数据中：发现 1.2k 个节点，正在提取语义集群..."}</p>
                    <p className="text-blue-400">{"[09:20:18] Agent 交接：巡航员 -> 智造员 (成功)"}</p>
                    <p>{"[09:20:20] 生成中：小红书多模态内容块..."}</p>
                    <p className="animate-pulse">{"[09:20:22] 等待中：工具响应 (StableDiffusion_XL_v2)..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Status Footer */}
      <footer className="h-16 bg-neutral-950/90 backdrop-blur-md border-t border-white/5 px-8 flex items-center justify-between shrink-0 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                <Workflow size={20} className="text-primary-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-neutral-950 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">智能 Agent 指挥中心</div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="text-[9px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <Cpu size={10} /> 并行执行中
                </div>
                <ChevronUp size={12} className={`text-neutral-600 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          {/* Mini Flywheel Status */}
          <div className="flex items-center gap-10">
            {[
              { label: '全域巡航', icon: Search, status: 'done' },
              { label: '智造工坊', icon: PenTool, status: 'active' },
              { label: '编排中心', icon: Layers, status: 'idle' },
              { label: '触达转化', icon: TrendingUp, status: 'idle' },
              { label: '归因复盘', icon: Activity, status: 'idle' },
            ].map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 group cursor-help">
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                  node.status === 'active' ? 'bg-primary-500 shadow-[0_0_8px_#eab308]' : 
                  node.status === 'done' ? 'bg-emerald-500' : 'bg-neutral-800'
                }`} />
                <div className="flex items-center gap-1.5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                  <node.icon size={11} className={node.status === 'active' ? 'text-primary-400' : 'text-neutral-500'} />
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">{node.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-neutral-950 bg-neutral-800 flex items-center justify-center overflow-hidden">
                    <Bot size={12} className="text-neutral-500" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">3 个活跃 Agent</span>
           </div>

           <div className="flex items-center gap-2">
              <div className="flex flex-col items-end mr-3">
                 <span className="text-[10px] font-black text-white leading-none">系统负载</span>
                 <span className="text-[9px] font-mono text-emerald-500 mt-1">94% 已优化</span>
              </div>
              <div className="w-1.5 h-6 flex gap-0.5">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`flex-1 rounded-full ${i < 5 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
                 ))}
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

