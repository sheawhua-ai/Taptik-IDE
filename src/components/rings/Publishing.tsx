import React, { useState } from 'react';
import { 
 Calendar, Clock, Filter, Plus, ChevronLeft, ChevronRight,
 LayoutGrid, List, CheckCircle2, AlertCircle, RefreshCw,
 ExternalLink, Share2, Layers, MoreHorizontal, FileText
} from 'lucide-react';
import { motion } from 'motion/react';

export const Publishing: React.FC = () => {
 const [selectedItem, setSelectedItem] = useState<typeof SCHEDULE[0] | null>(null);
 const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

 const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
 
 const SCHEDULE = [
 { day: 2, account: '瑞吉', type: 'note', status: 'published', title: '淡季捡漏清单', content: '这是一篇关于青岛瑞吉酒店淡季捡漏的深度笔记，包含了价格对比和房型推荐。', time: '10:00' },
 { day: 3, account: '瑞吉', type: 'note', status: 'scheduled', title: '270°海景房体验', content: '沉浸式体验270度无死角海景，感受云端之上的睡眠。', time: '14:30' },
 { day: 5, account: '瑞吉', type: 'video', status: 'pending', title: '清晨海浪录制', content: '视频脚本：从阳台推窗即是海浪声，捕捉第一缕阳光。', time: '06:00' },
 { day: 1, account: '涵碧楼', type: 'note', status: 'published', title: '周末度假攻略', content: '涵碧楼周末自驾游最全指南，吃喝玩乐一网打尽。', time: '09:00' },
 { day: 4, account: '涵碧楼', type: 'note', status: 'delayed', title: '新品下午茶上线', content: '法式浪漫下午茶，颜值超高，适合名媛打卡。', time: '15:00' },
 ];

 return (
 <div className="flex flex-col h-full bg-white overflow-hidden relative">
 <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
 <Calendar size={24} />
 </div>
 <div>
 <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">发布运营中枢</h2>
 <p className="text-[11px] text-neutral-400">管理多账号、多平台的内容排期与发布执行</p>
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] transition-all ${isCalendarExpanded ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-100'}`}
 >
 <LayoutGrid size={16} />
 {isCalendarExpanded ? '收起运营日历' : '打开运营日历'}
 </button>
 
 <div className="h-8 w-px bg-neutral-100" />
 
 <div className="flex gap-2">
 <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[12px] shadow-lg shadow-neutral-200 hover:bg-primary-500 hover:translate-y-[-1px] transition-all flex items-center gap-2">
 <Plus size={16}/> 新建排期
 </button>
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-neutral-50/20">
 <div className="max-w-7xl mx-auto space-y-8">
 {isCalendarExpanded && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 className="space-y-6"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-6">
 <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight italic">2026年 6月</h3>
 <div className="flex gap-1">
 <button className="p-2 border border-neutral-200 rounded-xl hover:bg-white transition-all"><ChevronLeft size={16}/></button>
 <button className="p-2 border border-neutral-200 rounded-xl hover:bg-white transition-all"><ChevronRight size={16}/></button>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[11px] text-neutral-400 uppercase tracking-widest">已发布</span></div>
 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-[11px] text-neutral-400 uppercase tracking-widest">待执行</span></div>
 </div>
 </div>
 <div className="bg-white border border-neutral-100 rounded-[32px] shadow-sm overflow-hidden">
 <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/50">
 {DAYS.map(d => (
 <div key={d} className="py-2.5 text-center text-[10px] text-neutral-400 uppercase tracking-[0.22em]">{d}</div>
 ))}
 </div>
 <div className="grid grid-cols-7 grid-rows-5 h-[450px] divide-x divide-y divide-neutral-50">
 {Array.from({ length: 35 }).map((_, i) => {
 const dayNum = i + 1; 
 const dayItems = SCHEDULE.filter(item => item.day === (i % 7));
 
 return (
 <div key={i} className="p-2 group hover:bg-neutral-50/30 transition-all flex flex-col gap-1">
 <span className="text-[10px] text-neutral-900 opacity-20">{dayNum <= 31 ? dayNum : ''}</span>
 <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
 {dayItems.map((item, idx) => (
 <div 
 key={idx} 
 onClick={() => setSelectedItem(item)}
 className={`p-1.5 rounded-lg border-l-2 shadow-sm group/item flex flex-col gap-0.5 cursor-pointer hover:translate-y-[-1px] transition-all ${
 item.status === 'published' ? 'bg-emerald-50/50 border-emerald-500' : 
 item.status === 'scheduled' ? 'bg-blue-50/50 border-blue-500' : 
 'bg-neutral-50 border-neutral-300'
 }`}
 >
 <p className="text-[9px] text-neutral-800 leading-tight truncate">{item.title}</p>
 </div>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </motion.div>
 )}

 <div className="grid grid-cols-3 gap-8">
 <div className="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm relative overflow-hidden">
 <h4 className="text-[14px] font-semibold text-neutral-900 mb-6 flex items-center gap-2">
 <AlertCircle size={16} className="text-rose-500" /> 执行预警
 </h4>
 <div className="space-y-4">
 <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4">
 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
 <LayoutGrid size={20} />
 </div>
 <div>
 <p className="text-[13px] text-rose-900">素材未提交</p>
 <p className="text-[11px] text-rose-600 mt-1">崂山民宿素材缺失（已超时 24h）</p>
 </div>
 </div>
 </div>
 </div>
 
 <div className="bg-neutral-900 p-8 rounded-[40px] text-white flex flex-col justify-between group">
 <div className="flex justify-between items-start">
 <div>
 <h4 className="text-[14px] font-semibold uppercase tracking-[0.2em] mb-1 opacity-50">比例构成</h4>
 <p className="text-xl ">发布配比监控</p>
 </div>
 <Layers size={24} className="text-primary-500 group-hover:rotate-12 transition-transform" />
 </div>
 <div className="space-y-4 mt-6">
 <div className="space-y-2">
 <div className="flex justify-between text-[11px] uppercase tracking-tighter">
 <span className="text-neutral-400">图文 (60%)</span>
 <span className="text-emerald-400">已达标</span>
 </div>
 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500 w-[60%]" />
 </div>
 </div>
 <div className="space-y-2">
 <div className="flex justify-between text-[11px] uppercase tracking-tighter">
 <span className="text-neutral-400">视频 (40%)</span>
 </div>
 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
 <div className="h-full bg-primary-500 w-[40%]" />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm flex flex-col justify-between group">
 <div className="flex justify-between items-start">
 <div>
 <h4 className="text-[14px] font-semibold uppercase tracking-[0.2em] mb-1 opacity-50">连接状态</h4>
 <p className="text-xl ">发布连接器</p>
 </div>
 <RefreshCw size={24} className="text-blue-500 group-hover:rotate-180 transition-transform duration-1000" />
 </div>
 <div className="mt-6 flex items-center gap-3">
 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-100">
 <Share2 size={24} />
 </div>
 <div>
 <p className="text-[13px] text-neutral-900">Puppeteer 节点在线</p>
 <p className="text-[11px] text-neutral-400">3 账号模拟登录中...</p>
 </div>
 </div>
 <button className="mt-6 w-full py-4 bg-neutral-50 text-neutral-600 rounded-2xl text-[13px] hover:bg-neutral-100 transition-all flex items-center justify-center gap-2">
 管理发布节点 <ExternalLink size={14}/>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Details Side Drawer */}
 {selectedItem && (
 <div className="absolute inset-0 z-50 flex justify-end">
 <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
 <div className="w-[480px] h-full bg-white shadow-2xl relative z-10 flex flex-col">
 <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl ${selectedItem.status === 'published' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
 <FileText size={20}/>
 </div>
 <h3 className="text-lg font-semibold text-neutral-900">排期详情</h3>
 </div>
 <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-neutral-50 rounded-xl">
 <Plus size={24} className="rotate-45 text-neutral-400"/>
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto p-10 space-y-10">
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[11px] text-neutral-400 uppercase tracking-widest">排期标题</span>
 <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase ${selectedItem.status === 'published' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>{selectedItem.status === 'published' ? '已发布' : selectedItem.status === 'scheduled' ? '待执行' : selectedItem.status === 'delayed' ? '延迟' : '待处理'}</span>
 </div>
 <p className="text-xl text-neutral-900 leading-tight">{selectedItem.title}</p>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <span className="text-[11px] text-neutral-400 uppercase tracking-widest pl-1">发布账号</span>
 <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-neutral-700">{selectedItem.account} 专业号</div>
 </div>
 <div className="space-y-2">
 <span className="text-[11px] text-neutral-400 uppercase tracking-widest pl-1">发布时间</span>
 <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-neutral-700">{selectedItem.time}</div>
 </div>
 </div>

 <div className="space-y-3">
 <span className="text-[11px] text-neutral-400 uppercase tracking-widest pl-1">笔记正文</span>
 <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 text-[14px] text-neutral-600 leading-relaxed min-h-[200px]">
 {selectedItem.content}
 </div>
 </div>

 <div className="pt-10 border-t border-neutral-100 flex gap-4">
 <button className="flex-1 h-14 bg-neutral-900 text-white rounded-2xl text-[14px] shadow-lg shadow-neutral-200">编辑内容</button>
 <button className="flex-1 h-14 border border-neutral-200 text-neutral-600 rounded-2xl text-[14px] hover:bg-neutral-50">取消排期</button>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
