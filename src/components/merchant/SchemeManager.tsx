import React, { useState } from 'react';
import { 
 Plus, Search, SlidersHorizontal, MoreHorizontal, 
 ArrowUpRight, LayoutGrid, CheckCircle2, Clock,
 MessageSquare, Share2, Trash2, Edit3, Settings,
 Zap, Workflow, ImageIcon, FileBox, PlusCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SchemeOperation } from './SchemeOperation';
import { AssetManager } from './AssetManager';

interface Scheme {
 id: string;
 name: string;
 status: string;
 notes: number;
 distribution: number;
 updatedAt: string;
}

const MOCK_SCHEMES: Scheme[] = [
 { id: '69', name: '夏季新品推广案', status: '信息已完善', notes: 1, distribution: 0, updatedAt: '2026-03-30 10:19' },
 { id: '66', name: 'API 测试方案_已改名', status: '信息已完善', notes: 3, distribution: 12, updatedAt: '2026-03-29 15:40' },
 { id: '63', name: '全自动增长试验', status: '待启动', notes: 0, distribution: 0, updatedAt: '2026-03-28 09:12' },
];

export const SchemeManager: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
 const [activeTab, setActiveTab] = useState<'schemes' | 'assets'>('schemes');
 const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
 const [isOperationMode, setIsOperationMode] = useState(false);
 const [commandValue, setCommandValue] = useState('');

 if (isOperationMode && selectedScheme) {
 return <SchemeOperation schemeName={selectedScheme.name} onBack={() => setIsOperationMode(false)} />;
 }

 const COMMAND_SUGGESTIONS = [
 "帮我创建一个夏季大促推广方案",
 "找出最近 7 天互动量最高的方案",
 "对比素材转化率，优化分发权重"
 ];

 return (
 <div className={`flex flex-col h-full bg-page-bg ${embedded ? '' : 'overflow-hidden'}`}>
 {/* Header with Navigation */}
 {!embedded && (
 <div className="px-8 pt-8 pb-4 shrink-0 bg-page-bg border-b border-border-default">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-8">
 <h2 className="text-[20px] font-semibold text-text-main tracking-tight">业务管理中心</h2>
 <div className="flex bg-hover-bg p-1 rounded-xl border border-border-default">
 <button 
 onClick={() => setActiveTab('schemes')}
 className={`px-4 py-1.5 rounded-lg text-[13px] transition-all flex items-center gap-2 ${activeTab === 'schemes' ? 'bg-btn-main text-white shadow-md' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 <FileBox size={14} /> 方案管理
 </button>
 <button 
 onClick={() => setActiveTab('assets')}
 className={`px-4 py-1.5 rounded-lg text-[13px] transition-all flex items-center gap-2 ${activeTab === 'assets' ? 'bg-btn-main text-white shadow-md' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 <ImageIcon size={14} /> 素材中心
 </button>
 </div>
 </div>
 
 <div className="flex items-center gap-3">
 <div className="flex bg-hover-bg p-1 rounded-xl border border-border-default text-text-tertiary">
 <button className="px-3 py-1 bg-surface-1 shadow-sm rounded-lg text-[13px] text-text-main border border-border-default/50">标准视图</button>
 <button className="px-3 py-1 rounded-lg text-[13px] hover:text-text-secondary">看板模式</button>
 </div>
 </div>
 </div>

 {/* Search & Action Bar */}
 <div className="relative max-w-4xl mx-auto mb-4">
 <div className="flex items-center bg-surface-1 border border-border-default focus-within:border-border-strong rounded-xl p-1.5 transition-colors">
 <div className="flex items-center gap-2 pl-3 pr-4 border-r border-border-default shrink-0">
 <Search size={16} className="text-text-secondary" />
 <span className="text-[13px] text-text-secondary font-medium">方案检索</span>
 </div>
 <input 
 value={commandValue}
 onChange={(e) => setCommandValue(e.target.value)}
 placeholder="输入方案名称或关键词检索..." 
 className="flex-1 bg-transparent border-none outline-none px-4 text-[13.5px] text-text-main placeholder:text-text-tertiary"
 />
 <div className="flex items-center gap-2 pr-2">
 <kbd className="px-2 py-0.5 bg-surface-subtle rounded text-[13px] text-text-tertiary border border-border-default font-normal">⌘ K</kbd>
 <button className="bg-btn-main hover:bg-btn-main-hover text-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors">
 <Plus size={16} />
 </button>
 </div>
 </div>
 
 <div className="flex items-center gap-3 mt-2.5 pl-2">
 <span className="text-[13px] text-text-tertiary font-normal">快捷筛选:</span>
 <div className="flex gap-2">
 {COMMAND_SUGGESTIONS.map((msg, i) => (
 <button 
 key={i} 
 onClick={() => setCommandValue(msg)}
 className="text-[13px] text-text-secondary hover:text-text-main hover:bg-hover-bg px-2.5 py-0.5 rounded-md border border-border-default bg-surface-1 transition-colors"
 >
 {msg}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {embedded && activeTab === 'schemes' && (
 <div className="p-8 pb-4 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <PlusCircle size={18} className="text-brand-logo" />
 <h3 className="text-[15px] font-semibold text-text-main">业务执行方案列表</h3>
 </div>
 <button className="px-4 py-1.5 bg-btn-main text-white rounded-lg text-[13px] flex items-center gap-2">
 <Plus size={14}/> 创建方案
 </button>
 </div>
 )}

 <div className={`flex-1 overflow-y-auto ${embedded ? 'px-8 pb-8' : 'px-8 pt-6 pb-8 custom-scrollbar'}`}>
 {activeTab === 'schemes' ? (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="w-full max-w-7xl mx-auto"
 >
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-4">
 <div className="flex bg-neutral-0 p-1 rounded-xl border border-border-default">
 <button className="px-4 py-1.5 bg-btn-main text-white rounded-lg text-[13px] ">进行中</button>
 <button className="px-4 py-1.5 text-text-tertiary hover:text-text-main rounded-lg text-[13px] ">已预设</button>
 <button className="px-4 py-1.5 text-text-tertiary hover:text-text-main rounded-lg text-[13px] ">已沉淀</button>
 </div>
 <div className="w-px h-6 bg-neutral-200 mx-1" />
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input 
 type="text" 
 placeholder="快速定位方案..." 
 className="pl-10 pr-4 py-2 bg-neutral-0 border border-border-default rounded-xl text-[13px] focus:outline-none focus:border-primary-500 w-64 transition-all"
 />
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 bg-neutral-0 border border-border-default rounded-xl text-[13px] text-text-tertiary hover:border-neutral-900 hover:text-text-main transition-all">
 <SlidersHorizontal size={14}/> 筛选排序
 </button>
 </div>
 </div>

 <div className="bg-neutral-0 rounded-[32px] border border-border-default shadow-sm overflow-hidden">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-page-bg text-[13px] text-text-tertiary uppercase tracking-widest border-b border-border-default">
 <th className="px-8 py-5">#</th>
 <th className="px-8 py-5">方案名称</th>
 <th className="px-8 py-5">笔记规模</th>
 <th className="px-8 py-5">分发权重</th>
 <th className="px-8 py-5">最后更新</th>
 <th className="px-8 py-5">状态</th>
 <th className="px-8 py-5 text-right">操作</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-neutral-100">
 {MOCK_SCHEMES.map((scheme) => (
 <tr key={scheme.id} className="hover:bg-page-bg/30 transition-colors group">
 <td className="px-8 py-6 text-[13px] font-mono text-text-tertiary">{scheme.id}</td>
 <td className="px-8 py-6">
 <div>
 <h4 className="text-[14px] font-semibold text-text-main">{scheme.name}</h4>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <span className="text-[13px] text-text-secondary">总 {scheme.notes} 篇</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <span className="text-[13px] font-mono text-text-main">{scheme.distribution}</span>
 </div>
 </td>
 <td className="px-8 py-6 text-[13px] text-text-tertiary">{scheme.updatedAt}</td>
 <td className="px-8 py-6">
 <span className={`px-2 py-0.5 text-[13px] rounded-lg ${
 scheme.status === '信息已完善' ? 'bg-hover-bg text-text-main' : 'bg-hover-bg text-text-tertiary'
 }`}>
 {scheme.status}
 </span>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button 
 onClick={() => { setSelectedScheme(scheme); setIsOperationMode(true); }}
 className="px-4 py-2 bg-btn-main text-white rounded-xl text-[13px] flex items-center gap-2 hover:scale-105 transition-all shadow-md group-hover:bg-btn-main"
 >
 <Workflow size={14}/> 进入作业
 </button>
 <div className="w-px h-4 bg-hover-bg mx-1" />
 <button className="p-2.5 text-text-tertiary hover:text-brand-logo hover:bg-brand-light rounded-xl transition-all" title="编辑资料"><Edit3 size={18}/></button>
 <button className="p-2.5 text-text-tertiary hover:text-brand-logo hover:bg-brand-light rounded-xl transition-all" title="删除"><Trash2 size={18}/></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>
 ) : (
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 className="w-full h-full"
 >
 <AssetManager embedded={true} />
 </motion.div>
 )}
 </div>
 </div>
 );
};
