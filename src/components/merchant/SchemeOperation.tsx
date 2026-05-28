import React, { useState } from 'react';
import { 
  Workflow, Sparkles, RefreshCw, Bot, 
  Cpu, Zap, X, ArrowUpRight, ChevronRight, 
  FlaskConical, Target, MoreHorizontal,
  PenTool, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    accuracy?: number;
  }
}

interface SchemeOperationProps {
  schemeName: string;
  onBack: () => void;
}

export const SchemeOperation: React.FC<SchemeOperationProps> = ({ schemeName, onBack }) => {
  const [units, setUnits] = useState<AgentUnit[]>([
    {
      id: 'u1',
      title: '策略生成: 差异化内容切入点',
      sub: '针对方案 [' + schemeName + '] 的目标人群分析',
      thought: '正在分析竞品近 7 天热词... 建议从“极简包装”与“环保理念”切入。',
      status: 'waiting',
      output: {
        text: '夏天到了，极简主义也该吹进护肤品里。这款【夏季新品】拒绝冗余添加，深层修护的同时让肌肤自由呼吸。',
        skills: ['Market_Trend_Analyst', 'Eco_Vision_Gen'],
        accuracy: 92
      }
    }
  ]);
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleCommand = () => {
    if (!command.trim()) return;
    setIsRunning(true);
    setTimeout(() => {
      const newUnit: AgentUnit = {
        id: Date.now().toString(),
        title: `生成指令: ${command.slice(0, 10)}...`,
        sub: '多 Agent 协同作业中',
        thought: '已调度文案增强 Agent。正在检索商户素材库中的海报模板进行自动适配...',
        status: 'running',
        output: {}
      };
      setUnits(prev => [newUnit, ...prev]);
      
      setTimeout(() => {
        setUnits(prev => prev.map(u => u.id === newUnit.id ? {
          ...u,
          status: 'waiting',
          output: {
            text: '针对您的指令，已初步生成对应的分发草稿。建议优先在小红书首发。',
            skills: ['Copy_Pro_v5', 'Strategy_Brain'],
            accuracy: 88
          }
        } : u));
        setIsRunning(false);
      }, 1500);
      setCommand('');
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 relative overflow-hidden">
      {/* Header Context */}
      <div className="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
            <ChevronLeft size={20}/>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-black text-neutral-900">{schemeName}</h2>
              <span className="px-1.5 py-0.5 bg-primary-50 text-primary-500 text-[10px] font-bold rounded">作业流水线</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-neutral-400 hover:text-neutral-900"><MoreHorizontal size={20}/></button>
        </div>
      </div>

      {/* Main Operation Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Command Entry */}
          <div className="mb-10 relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-[30px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity ${isRunning ? 'opacity-100 animate-pulse' : ''}`} />
            <div className="relative flex items-center bg-white border border-neutral-200 rounded-[28px] shadow-2xl overflow-hidden focus-within:border-primary-500/30 transition-all">
              <div className="pl-6 text-neutral-300">
                <Bot size={22}/>
              </div>
              <input 
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                placeholder="发送指令以驱动流水线（例如：优化文案、扩展示范素材）..."
                className="flex-1 px-5 py-6 bg-transparent text-[16px] font-bold text-neutral-800 placeholder:text-neutral-200 focus:outline-none"
              />
              <button 
                onClick={handleCommand}
                disabled={isRunning}
                className="mr-3 px-8 py-4 bg-neutral-900 text-white rounded-[22px] text-[13px] font-black flex items-center gap-2 hover:bg-neutral-800 active:scale-95 transition-all disabled:bg-neutral-100"
              >
                {isRunning ? <RefreshCw size={18} className="animate-spin"/> : <Sparkles size={18}/>}
                派遣 Agent
              </button>
            </div>
          </div>

          {/* Activity Logs / UI Blocks */}
          <div className="space-y-6">
            <AnimatePresence>
              {units.map((unit) => (
                <motion.div 
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[40px] border border-neutral-200 p-8 shadow-sm relative group overflow-hidden"
                >
                  <div className="flex gap-8">
                    <div className="flex-1">
                       <div className="flex items-center gap-4 mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${unit.status === 'running' ? 'bg-primary-50 text-primary-500' : 'bg-neutral-50 text-neutral-400'}`}>
                             {unit.status === 'running' ? <RefreshCw size={20} className="animate-spin"/> : <Zap size={20}/>}
                          </div>
                          <div>
                             <h4 className="text-[17px] font-black text-neutral-900">{unit.title}</h4>
                             <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-tight">{unit.sub}</p>
                          </div>
                       </div>

                       <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-6 italic text-[12px] font-bold text-neutral-500 flex items-start gap-3">
                          <Target size={14} className="text-primary-500 mt-0.5 shrink-0"/>
                          {unit.thought}
                       </div>

                       {unit.output.text && (
                         <div className="relative">
                            <textarea 
                              value={unit.output.text}
                              className="w-full bg-neutral-0 border border-neutral-100 rounded-2xl p-5 text-[14px] font-bold text-neutral-700 resize-none min-h-[100px] focus:outline-none"
                              readOnly
                            />
                            <div className="absolute top-4 right-4 text-neutral-200">
                               <PenTool size={16}/>
                            </div>
                         </div>
                       )}
                    </div>
                    
                    <div className="w-[180px] shrink-0 pt-2 flex flex-col justify-end">
                       <button className="w-full py-3.5 bg-neutral-900 text-white rounded-2xl text-[12px] font-black hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
                          确认入库同步
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Status Indicator */}
      <div className="absolute bottom-6 right-8 left-8 flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl z-30">
        <div className="flex items-center gap-6">
           <div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"/>
                 <span className="text-[11px] font-black text-neutral-900">流水线就绪</span>
              </div>
           </div>
           <div className="w-px h-4 bg-neutral-200"/>
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">执行效率</span>
              <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                 <div className="w-[88%] h-full bg-primary-500"/>
              </div>
           </div>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-xl transition-all text-neutral-400 hover:text-neutral-900">
           <ArrowUpRight size={18}/>
        </button>
      </div>
    </div>
  );
};
