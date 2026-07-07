import React, { useState } from 'react';
import { 
 Users, UserPlus, Phone, Search, Filter, 
 ChevronRight, MoreVertical, Star, Calendar,
 ArrowUpRight, Target, LayoutGrid, CheckCircle2,
 Clock, AlertCircle, FileText, Ban, MessageSquare, Bot
} from 'lucide-react';
import { motion } from 'motion/react';

export const CRM: React.FC = () => {
 const [pipelineTab, setPipelineTab] = useState<'new' | 'contacted' | 'qualified' | 'converted'>('new');

 const LEADS = [
 { id: '1', name: '张女士', phone: '186****1042', source: '《淡季980住瑞吉》', product: '270°海景房', budget: '1000-1500', status: 'new', time: '10分钟前' },
 { id: '2', name: '李先生', phone: '139****8291', source: '《青岛海景避坑词》', product: '家庭套房', budget: '2000+', status: 'new', time: '1小时前' },
 { id: '3', name: '王小姐', phone: '155****4421', source: '直连投放', product: '标准大床房', budget: '500-800', status: 'contacted', time: '2小时前' },
 ];

 return (
 <div className="flex flex-col h-full bg-white overflow-hidden">
 <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
 <Users size={24} />
 </div>
 <div>
 <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">私域承接与 CRM</h2>
 <p className="text-[11px] text-neutral-400">线索全生命周期管理，打通笔记到成交的最后一公里</p>
 </div>
 </div>
 
 <div className="flex items-center gap-3">
 <button className="px-4 py-2 bg-neutral-50 text-neutral-600 rounded-xl text-[12px] hover:bg-neutral-100 transition-all border border-neutral-100 flex items-center gap-2">
 <FileText size={16}/> 留资表单配置
 </button>
 <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[12px] shadow-lg shadow-neutral-200 hover:bg-primary-500 hover:tranneutral-y-[-1px] transition-all flex items-center gap-2">
 <UserPlus size={16}/> 手动录入线索
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-neutral-50/20">
 <div className="max-w-7xl mx-auto space-y-10">
 {/* KPI Cards */}
 <div className="grid grid-cols-4 gap-6">
 {[
 { label: '今日新增线索', value: '12', trend: '+20%', color: 'text-primary-500' },
 { label: '待处理', value: '5', trend: 'Critical', color: 'text-primary-500' },
 { label: '本月转化率', value: '4.2%', trend: '+0.5%', color: 'text-neutral-900' },
 { label: '成交金额 (GMV)', value: '¥58k', trend: '+12%', color: 'text-primary-500' },
 ].map((kpi, idx) => (
 <div key={idx} className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm group hover:scale-[1.02] transition-all">
 <p className="text-[11px] text-neutral-400 uppercase tracking-widest mb-3">{kpi.label}</p>
 <div className="flex items-end justify-between">
 <span className={`text-3xl tracking-tighter ${kpi.color}`}>{kpi.value}</span>
 <span className={`text-[10px] px-1.5 py-0.5 rounded ${kpi.trend === 'Critical' ? 'bg-primary-50 text-primary-500' : 'bg-neutral-100 text-neutral-900'}`}>{kpi.trend === 'Critical' ? '紧迫' : kpi.trend}</span>
 </div>
 </div>
 ))}
 </div>

 {/* Pipeline View */}
 <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm flex flex-col min-h-[600px] overflow-hidden">
 <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
 <div className="flex gap-1 bg-white p-1 rounded-2xl border border-neutral-100">
 {[
 { id: 'new', name: '新线索', count: 5 },
 { id: 'contacted', name: '已联系', count: 3 },
 { id: 'qualified', name: '高意向', count: 2 },
 { id: 'converted', name: '已成交', count: 12 }
 ].map(tab => (
 <button 
 key={tab.id}
 onClick={() => setPipelineTab(tab.id as any)}
 className={`px-6 py-2.5 rounded-xl text-[13px] transition-all flex items-center gap-3 ${pipelineTab === tab.id ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-600'}`}
 >
 {tab.name}
 <span className={`px-2 py-0.5 rounded-lg text-[10px] ${pipelineTab === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-400'}`}>{tab.count}</span>
 </button>
 ))}
 </div>
 
 <div className="flex items-center gap-4">
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -tranneutral-y-1/2 text-neutral-400" />
 <input 
 placeholder="搜索姓名、手机号..."
 className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-[12px] outline-none focus:border-primary-500 transition-all w-64"
 />
 </div>
 <button className="p-2 border border-neutral-200 rounded-xl hover:bg-white transition-all text-neutral-400"><Filter size={18}/></button>
 </div>
 </div>

 <div className="flex-1 p-6 grid grid-cols-1 gap-4">
 {LEADS.filter(l => l.status === pipelineTab || pipelineTab === 'new').map(lead => (
 <div key={lead.id} onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-expert', { detail: { expert: '客资专家', context: `分析一下这个潜客意向和沟通策略：${lead.name}，对${lead.product}感兴趣` }})) }} className="group bg-white cursor-pointer p-6 rounded-[32px] border border-neutral-100 hover:border-primary-500 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all flex items-center gap-8">
 <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-500 text-xl shrink-0 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
 {lead.name[0]}
 </div>
 
 <div className="flex-1 grid grid-cols-4 gap-8">
 <div>
 <h4 className="text-[15px] font-semibold text-neutral-900 mb-1">{lead.name}</h4>
 <p className="text-[12px] text-neutral-400 flex items-center gap-1"><Phone size={12}/> {lead.phone}</p>
 </div>
 
 <div>
 <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">意向维度</p>
 <div className="flex flex-wrap gap-1">
 <span className="px-2 py-0.5 bg-primary-50 text-primary-500 text-[10px] rounded border border-primary-100">{lead.product}</span>
 <span className="px-2 py-0.5 bg-neutral-50 text-neutral-400 text-[10px] rounded border border-neutral-100">{lead.budget}</span>
 </div>
 </div>

 <div>
 <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">来源笔记</p>
 <p className="text-[13px] text-neutral-700 truncate max-w-[150px]">{lead.source}</p>
 </div>

 <div className="flex items-center gap-6">
 <div className="text-right flex-1">
 <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">停留时长</p>
 <p className="text-[14px] text-neutral-900">{lead.time}</p>
 </div>
 {lead.status === 'new' && (
 <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center border border-primary-100 animate-pulse">
 <AlertCircle size={18} />
 </div>
 )}
 </div>
 </div>
 
 <div className="flex gap-2">
 <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-2xl text-[12px] hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100 tranneutral-x-4 group-hover:tranneutral-x-0">
 立即联系
 </button>
 <button className="p-2.5 hover:bg-neutral-50 rounded-xl text-neutral-400 transition-all"><MoreVertical size={20}/></button>
 </div>
 </div>
 ))}
 </div>
 
 <div className="p-6 border-t border-neutral-50 bg-neutral-50/20 text-center">
 <p className="text-[11px] text-neutral-300 uppercase tracking-widest">流程终点 • 显示 12 条记录</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
