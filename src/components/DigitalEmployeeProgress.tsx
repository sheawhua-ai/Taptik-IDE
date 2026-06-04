import React from 'react';
import { 
  CheckCircle2, Clock, Play, AlertCircle, RefreshCw, 
  Workflow, Cpu, Activity, User, Target, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  agent: string;
  time: string;
}

interface DigitalEmployeeProgressProps {
  tasks: Task[];
  moduleName: string;
}

export const DigitalEmployeeProgress: React.FC<DigitalEmployeeProgressProps> = ({ tasks, moduleName }) => {
  return (
    <div className="bg-white rounded-[40px] border border-neutral-100 p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <Activity size={20} className="text-primary-500" />
            数字员工执行进展 (Execution)
          </h3>
          <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">当前 {moduleName} 队列中的自动化任务</p>
        </div>
        <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400">
           <Workflow size={20} />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-3xl border transition-all ${
              task.status === 'running' 
                ? 'bg-neutral-900 text-white border-neutral-800 shadow-xl' 
                : 'bg-neutral-50 border-neutral-100'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  task.status === 'running' ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200 text-neutral-400'
                }`}>
                  {task.status === 'completed' ? <CheckCircle2 size={18} /> : 
                   task.status === 'running' ? <RefreshCw size={18} className="animate-spin" /> : 
                   task.status === 'error' ? <AlertCircle size={18} /> : <Clock size={18} />}
                </div>
                <div>
                   <div className={`text-[13px] font-black tracking-tight ${task.status === 'running' ? 'text-white' : 'text-neutral-900'}`}>{task.name}</div>
                   <div className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1 ${task.status === 'running' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      <UsersIcon size={10} /> {task.agent}
                   </div>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold ${task.status === 'running' ? 'text-primary-400' : 'text-neutral-300'}`}>{task.time}</span>
            </div>
            
            {task.status === 'running' && (
              <div className="mt-4">
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                 </div>
                 <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-black text-primary-400 uppercase">Processing...</span>
                    <span className="text-[9px] font-black text-white/40">65%</span>
                 </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-neutral-100">
         <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[11px] font-black text-neutral-400 tracking-tighter uppercase px-1">
               <span>系统负载</span>
               <span className="text-neutral-900">Normal</span>
            </div>
            <div className="h-12 bg-neutral-900 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-neutral-800 transition-all shadow-lg active:scale-95 group">
                <Target size={16} className="text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="text-white text-[12px] font-black tracking-widest uppercase">部署新任务到生产线</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const UsersIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
