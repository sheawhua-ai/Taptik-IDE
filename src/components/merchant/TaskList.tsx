import React from 'react';
import { 
 Plus, Search, ListTodo, Clock, CheckCircle2, 
 Play, Pause, Trash2, MoreVertical, Layout
} from 'lucide-react';

interface Task {
 id: string;
 name: string;
 merchant: string;
 progress: number;
 status: 'running' | 'paused' | 'done';
 createdAt: string;
}

const MOCK_TASKS: Task[] = [
 { id: 't1', name: '夏季新品海报批量生产', merchant: 'test shop', progress: 65, status: 'running', createdAt: '2026-03-30 14:00' },
 { id: 't2', name: '短视频脚本自动生成', merchant: 'test shop', progress: 100, status: 'done', createdAt: '2026-03-29 09:30' },
 { id: 't3', name: '全链路文案改写任务', merchant: 'test shop', progress: 20, status: 'paused', createdAt: '2026-03-30 16:20' }
];

export const TaskList: React.FC = () => {
 return (
 <div className="flex flex-col h-full bg-neutral-50 p-8">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h2 className="text-[20px] font-semibold text-neutral-900 tracking-tight">素材任务队列</h2>
 <p className="text-[12px] text-neutral-400 uppercase tracking-wider mt-1">Batch Processing & Asset Tasks</p>
 </div>
 <button className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-[13px] shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2">
 <Plus size={18}/> 新建任务
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {MOCK_TASKS.map((task) => (
 <div key={task.id} className="bg-white rounded-[32px] border border-neutral-200 p-6 shadow-sm hover:shadow-xl transition-all group">
 <div className="flex items-center justify-between mb-6">
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
 task.status === 'done' ? 'bg-success-50 text-success-500' : 
 task.status === 'running' ? 'bg-primary-50 text-primary-500' : 'bg-neutral-50 text-neutral-400'
 }`}>
 <Layout size={24} />
 </div>
 <button className="p-2 text-neutral-300 hover:text-neutral-900"><MoreVertical size={18}/></button>
 </div>
 
 <h3 className="text-[16px] font-semibold text-neutral-900 mb-2">{task.name}</h3>
 <p className="text-[11px] text-neutral-400 uppercase tracking-widest mb-6">Task ID: {task.id}</p>

 <div className="space-y-4">
 <div>
 <div className="flex justify-between items-center text-[12px] mb-2">
 <span className="text-neutral-500">执行进度</span>
 <span className="text-neutral-900">{task.progress}%</span>
 </div>
 <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
 <div 
 className={`h-full transition-all duration-1000 ${task.status === 'done' ? 'bg-success-500' : 'bg-primary-500'}`} 
 style={{ width: `${task.progress}%` }} 
 />
 </div>
 </div>

 <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
 <div className="flex items-center gap-2">
 <Clock size={14} className="text-neutral-300"/>
 <span className="text-[11px] text-neutral-400">{task.createdAt}</span>
 </div>
 <div className="flex items-center gap-2">
 {task.status === 'running' ? (
 <button className="p-2 bg-neutral-900 text-white rounded-lg hover:scale-110 transition-transform"><Pause size={14}/></button>
 ) : task.status === 'paused' ? (
 <button className="p-2 bg-primary-500 text-white rounded-lg hover:scale-110 transition-transform"><Play size={14}/></button>
 ) : (
 <div className="flex items-center gap-1 text-success-500 text-[12px] "><CheckCircle2 size={14}/> 已完成</div>
 )}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};
