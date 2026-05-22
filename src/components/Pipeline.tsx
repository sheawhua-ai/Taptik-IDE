import React, { useState } from 'react';
import { 
  Workflow, Check, Sparkles, Wand2, Camera, Send, 
  CheckCircle2, RefreshCw, ShieldCheck, Bot, 
  TrendingUp, Layers, Terminal, Cpu, Zap, X, 
  ArrowUpRight, ChevronRight, Layout, History, 
  Search, MoreHorizontal, FlaskConical, Target,
  Image as ImageIcon, Trash2, PenTool, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- 类型 ---
interface Campaign {
  id: string;
  name: string;
  type: 'growth' | 'launch';
  active: boolean;
}

interface AgentUnit {
  id: string;
  title: string;
  sub: string;
  thought: string;
  status: 'running' | 'waiting' | 'done';
  output: {
    text?: string;
    media?: string[];
    skills?: string[];
    accuracy?: number; // 内容准确性评估
  }
}

// --- 模拟数据 ---
const CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: '2024 夏季新品增长', type: 'growth', active: true },
  { id: 'c2', name: '双11 预热矩阵', type: 'launch', active: false },
  { id: 'c3', name: 'KOC 种子计划', type: 'growth', active: false }
];

const INITIAL_UNITS: AgentUnit[] = [
  {
    id: 'u1',
    title: '内容扩容: 肠胃敏感点切入',
    sub: '基于 [小红书夏季热词] 与 [产品库] 交叉生成',
    thought: '正在调用 Python 工具分析关键词相关性... 文案已产出，主打“烘焙粮不油腻”物理因子。',
    status: 'waiting',
    output: {
      text: '家里的猫咪夏天总是不爱吃粮？其实是肠胃在闹情绪。试试这款低温烘焙粮，告别油腻挂壁，让毛孩子胃口大开！',
      skills: ['Keyword_Analyzer', 'Copy_Gen_v4'],
      accuracy: 94
    }
  },
  {
    id: 'u2',
    title: '素材质检: 执行端 A 组回传',
    sub: 'AI 自动审阅物料合规性',
    thought: '调用 Google Vision API 检测画面中主体完整度... 检出通过，画质符合 HD 标准。',
    status: 'waiting',
    output: {
      media: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop'],
      skills: ['Vision_Audit_Pro'],
    }
  }
];

export const Pipeline: React.FC = () => {
  const [units, setUnits] = useState<AgentUnit[]>(INITIAL_UNITS);
  const [activeCid, setActiveCid] = useState('c1');
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleCommand = () => {
    if (!command.trim()) return;
    setIsRunning(true);
    // 模拟 Agent 响应
    setTimeout(() => {
      const newUnit: AgentUnit = {
        id: Date.now().toString(),
        title: `指令响应: ${command.slice(0, 8)}...`,
        sub: 'Agent 正在即时生成实验性结果',
        thought: '已调度内容创意 Agent 与数据检索 Skill。检索结果显示：用户对“夏季补水”关注度上升 120%。',
        status: 'running',
        output: {}
      };
      setUnits(prev => [newUnit, ...prev]);
      
      setTimeout(() => {
        setUnits(prev => prev.map(u => u.id === newUnit.id ? {
          ...u,
          status: 'waiting',
          output: {
            text: '针对您的指令，我建议补充一组“补水神器”类目的笔记，以此作为本次活动的分发切入点。',
            skills: ['Growth_Brain', 'Content_Sourcing'],
            accuracy: 89
          }
        } : u));
        setIsRunning(false);
      }, 1500);
      setCommand('');
    }, 500);
  };

  const removeUnit = (id: string) => setUnits(prev => prev.filter(u => u.id !== id));
  const confirmUnit = (id: string) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, status: 'done' } : u));
  };

  return (
    <div className="flex-1 flex h-full bg-[#f8f9fb] overflow-hidden">
      {/* 极简侧边栏：只做 Context 切换 */}
      <div className="w-[70px] xl:w-[240px] border-r border-[#eef0f5] bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-[#f0f2f5]">
          <h2 className="text-[12px] font-black text-zinc-400 uppercase tracking-widest mb-4 hidden xl:block">历史活动上下文</h2>
          <div className="space-y-1.5">
            {CAMPAIGNS.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveCid(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${activeCid === c.id ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'text-zinc-600 hover:bg-zinc-50'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeCid === c.id ? 'bg-white/10' : 'bg-zinc-100'}`}>
                  {c.type === 'growth' ? <TrendingUp size={16}/> : <Target size={16}/>}
                </div>
                <span className="text-[13px] font-black hidden xl:block truncate">{c.name}</span>
                {c.active && activeCid !== c.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden xl:block" />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
           <div className="hidden xl:block">
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3">常驻 Agent 状态</p>
              <div className="space-y-3">
                 {[
                    { name: '策略 Agent', status: 'Listening', icon: Bot },
                    { name: '执行 Agent', status: 'Idle', icon: Cpu },
                    { name: '质检 Agent', status: 'Standby', icon: ShieldCheck }
                 ].map(a => (
                    <div key={a.name} className="flex items-center gap-2">
                       <a.icon size={14} className="text-zinc-300"/>
                       <span className="text-[11px] font-bold text-zinc-500">{a.name}</span>
                       <span className="ml-auto text-[9px] font-mono text-emerald-500 uppercase tracking-tighter">{a.status}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
        <div className="p-6 border-t border-[#f0f2f5]">
           <button className="w-full py-3 bg-zinc-50 text-zinc-400 rounded-2xl text-[11px] font-black hover:text-zinc-900 transition-all flex items-center justify-center gap-2">
              <Plus size={14}/> 创建新活动
           </button>
        </div>
      </div>

      {/* 主作业区：画布感设计 */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* 核心指令枢纽 (Command Hub) */}
        <div className="px-10 py-10 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-zinc-900 border border-zinc-100">
                  <Workflow size={24}/>
                </div>
                <div>
                  <h1 className="text-[20px] font-black text-zinc-900 tracking-tight">智能矩阵作业台</h1>
                  <p className="text-[12px] text-zinc-400 font-bold">由多 Agent 驱动的实验性资产流水线</p>
                </div>
              </div>
              <div className="flex bg-white p-1 rounded-2xl border border-zinc-100 shadow-sm">
                 <button className="px-4 py-2 text-[11px] font-black text-[#685FAB] bg-[#685FAB]/5 rounded-xl">即时生成</button>
                 <button className="px-4 py-2 text-[11px] font-black text-zinc-400 hover:text-zinc-600">合规入库</button>
              </div>
            </div>

            <div className="relative group">
              <div className={`absolute -inset-1.5 bg-gradient-to-r from-[#685FAB] to-[#8c82d4] rounded-[30px] blur-lg opacity-25 group-focus-within:opacity-50 transition-opacity ${isRunning ? 'animate-pulse' : ''}`} />
              <div className="relative flex items-center bg-white border border-zinc-200 rounded-[28px] shadow-2xl overflow-hidden transition-all focus-within:translate-y-[-2px]">
                <div className="pl-6 text-zinc-300">
                  <Bot size={22}/>
                </div>
                <input 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                  className="flex-1 px-5 py-6 bg-transparent text-[17px] font-bold text-zinc-800 focus:outline-none placeholder:text-zinc-200"
                  placeholder="在此输入全局运营指令（例如：扩容 10 篇夏季防暑母婴笔记）..."
                />
                <button 
                  onClick={handleCommand}
                  disabled={isRunning}
                  className="mr-3 px-8 py-4 bg-zinc-900 text-white rounded-[22px] text-[14px] font-black flex items-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all shadow-xl disabled:bg-zinc-100"
                >
                  {isRunning ? <RefreshCw size={18} className="animate-spin"/> : <Sparkles size={18}/>}
                  派遣 Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 任务卡片栈：即时处理，即时抛弃 */}
        <div className="flex-1 overflow-y-auto px-10 pb-20 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
              {units.map((unit) => (
                <motion.div 
                  key={unit.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: 100 }}
                  className={`bg-white rounded-[40px] border relative transition-all group ${unit.status === 'done' ? 'border-[#685FAB]/20 bg-[#685FAB]/5' : 'border-[#eef0f5] shadow-sm hover:shadow-2xl'}`}
                >
                  {/* 悬浮抛弃按钮 */}
                  {unit.status !== 'done' && (
                    <button 
                      onClick={() => removeUnit(unit.id)}
                      className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-zinc-100 text-zinc-300 hover:text-rose-500 shadow-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <X size={20}/>
                    </button>
                  )}

                  <div className="p-10 flex flex-col md:flex-row gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-inner ${unit.status === 'done' ? 'bg-[#685FAB] text-white' : 'bg-zinc-50 text-zinc-400'}`}>
                           {unit.status === 'running' ? <RefreshCw size={24} className="animate-spin"/> : <FlaskConical size={24}/>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-[18px] font-black text-zinc-900">{unit.title}</h3>
                             {unit.output.accuracy && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-black rounded-lg">准确性评估 {unit.output.accuracy}%</span>
                             )}
                          </div>
                          <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wide">{unit.sub}</p>
                        </div>
                      </div>

                      {/* Agent 思考路径 */}
                      <div className="bg-zinc-50/50 rounded-2xl p-5 border border-zinc-100 mb-8 flex items-start gap-3">
                         <Bot size={16} className="text-[#685FAB] mt-0.5 shrink-0"/>
                         <p className="text-[12px] font-bold text-zinc-500 leading-relaxed italic">{unit.thought}</p>
                      </div>

                      {/* 即时产出物 */}
                      {unit.output.text && (
                        <div className="relative group">
                          <textarea 
                            value={unit.output.text}
                            onChange={(e) => {
                               const newUnits = units.map(u => u.id === unit.id ? { ...u, output: { ...u.output, text: e.target.value } } : u);
                               setUnits(newUnits);
                            }}
                            className="w-full bg-white border border-zinc-100 rounded-3xl p-6 text-[15px] font-bold text-zinc-700 focus:outline-none focus:ring-4 focus:ring-[#685FAB]/5 transition-all min-h-[120px] shadow-sm resize-none"
                          />
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <PenTool size={18} className="text-zinc-200"/>
                          </div>
                        </div>
                      )}

                      {unit.output.media && (
                        <div className="flex gap-4">
                           {unit.output.media.map((img, i) => (
                              <div key={i} className="relative w-48 h-48 rounded-[32px] overflow-hidden border-4 border-white shadow-xl group">
                                 <img src={img} className="w-full h-full object-cover"/>
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <button className="p-3 bg-white text-zinc-900 rounded-2xl"><Camera size={20}/></button>
                                 </div>
                              </div>
                           ))}
                        </div>
                      )}
                    </div>

                    {/* 操作侧栏 */}
                    <div className="w-full md:w-[220px] flex flex-col pt-2">
                       {unit.status === 'done' ? (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 mb-4">
                                <CheckCircle2 size={32}/>
                             </div>
                             <p className="text-[13px] font-black text-zinc-900">资产成功入库</p>
                             <p className="text-[11px] text-zinc-400 font-bold mt-1">同步至分发链路 A</p>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             <div className="mb-6">
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3 text-center">技能调用 Trace</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                   {unit.output.skills?.map(s => (
                                     <span key={s} className="px-2 py-1 bg-white border border-zinc-100 text-[9px] font-black text-[#685FAB] rounded-lg tracking-tighter">{s}</span>
                                   ))}
                                </div>
                             </div>
                             
                             <div className="space-y-2">
                                <button 
                                  onClick={() => confirmUnit(unit.id)}
                                  className="w-full py-4 bg-zinc-900 text-white rounded-3xl text-[14px] font-black shadow-xl hover:shadow-[#685FAB]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                   确认并推送
                                </button>
                                <button 
                                  onClick={() => removeUnit(unit.id)}
                                  className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-3xl text-[12px] font-black hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                >
                                   抛弃丢弃
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {units.length === 0 && !isRunning && (
               <div className="py-20 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white border border-dashed border-zinc-200 rounded-[40px] flex items-center justify-center text-zinc-200 mb-6">
                     <Cpu size={48} className="opacity-20"/>
                  </div>
                  <h2 className="text-[18px] font-black text-zinc-900 mb-2">作业队列已清空</h2>
                  <p className="text-[13px] text-zinc-400 font-bold max-w-[320px]">您可以输入新的指令开始生成，或者从左侧快速加载之前的活动历史上下文。</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部浮动状态 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl flex items-center gap-10 z-30">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
             <span className="text-[11px] font-black text-zinc-900">系统就绪</span>
          </div>
          <div className="h-4 w-px bg-zinc-200"/>
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">今日流量达成</p>
                <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#685FAB] w-[65%]" />
                </div>
             </div>
             <span className="text-[14px] font-mono font-black text-zinc-900">65.2%</span>
          </div>
          <button className="p-2 bg-zinc-900 text-white rounded-xl hover:scale-110 transition-transform">
             <ArrowUpRight size={18}/>
          </button>
      </div>
    </div>
  );
};
