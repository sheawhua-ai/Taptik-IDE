import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Building2, BarChart2, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import { CreateMerchantModal } from './merchant/CreateMerchantModal';

interface ProjectSwitcherModalProps {
 isOpen: boolean;
 onClose: () => void;
 projects: any;
 activeProjectId: string;
 onSelect: (id: string) => void;
}

export const ProjectSwitcherModal: React.FC<ProjectSwitcherModalProps> = ({ isOpen, onClose, projects, activeProjectId, onSelect }) => {
 const [searchQuery, setSearchQuery] = useState("");
 const [activeTab, setActiveTab] = useState("all");
 const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

 if (!isOpen) return null;

 const validProjects = Object.values(projects).filter((p: any) => p.id !== "new-merchant");
 
 const filteredProjects = validProjects.filter((p: any) => {
 if (activeTab !== "all") {
 if (activeTab === "pending" && p.stats?.profileCompleteness === 100) return false;
 if (activeTab === "active" && p.stats?.profileCompleteness < 100) return false;
 }
 return p.name.includes(searchQuery) || p.tags?.some((t: string) => t.includes(searchQuery));
 });

 return (
 <>
 <AnimatePresence>
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[1000] bg-neutral-900/40 backdrop-blur-sm flex items-start justify-center pt-[10vh]"
 onClick={onClose}
 >
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.98 }}
 onClick={(e) => e.stopPropagation()}
 className="w-full max-w-4xl bg-white rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
 >
 {/* Header Area */}
 <div className="px-8 pt-6 pb-5 border-b border-neutral-100 flex flex-col space-y-5 bg-neutral-50/30">
 <div className="flex items-center justify-between pointer-events-none">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-sm">
 <Building2 size={16} />
 </div>
 <div>
 <h2 className="text-[18px] font-semibold text-neutral-900 tracking-tight">切换商家</h2>
 <p className="text-[11px] text-neutral-500">按 Cmd+K 快速唤起</p>
 </div>
 </div>
 
 <div className="flex items-center gap-3 pointer-events-auto">
 <button 
 onClick={() => setIsCreateModalOpen(true)}
 className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-[10px] text-[12px] hover:bg-primary-500 transition-colors shadow-sm active:scale-95"
 >
 <Plus size={14} />
 新增商家
 </button>
 <button onClick={onClose} className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-[10px] flex items-center justify-center transition-colors">
 <X size={16} />
 </button>
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="relative flex-1 group">
 <Search size={16} className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
 <input 
 type="text"
 placeholder="搜索商家名称或标签..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full h-10 pl-10 pr-4 bg-white border border-neutral-200 focus:border-primary-500 outline-none rounded-xl text-[13px] placeholder:font-normal transition-all shadow-sm"
 />
 </div>
 
 <div className="flex items-center p-1 bg-neutral-100/60 rounded-[10px]">
 <button onClick={() => setActiveTab('all')} className={`px-3 py-1.5 rounded-lg text-[12px] transition-all ${activeTab === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>全部</button>
 <button onClick={() => setActiveTab('active')} className={`px-3 py-1.5 rounded-lg text-[12px] transition-all ${activeTab === 'active' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>服务中</button>
 <button onClick={() => setActiveTab('pending')} className={`px-3 py-1.5 rounded-lg text-[12px] transition-all ${activeTab === 'pending' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>待冷启</button>
 </div>
 </div>
 </div>

 {/* List Area */}
 <div className="flex-1 min-h-[300px] max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
 <div className="flex flex-col">
 <div className="grid grid-cols-12 gap-4 px-8 py-3 text-[11px] text-neutral-400 uppercase tracking-widest border-b border-neutral-100 bg-white sticky top-0 z-10 w-full">
 <div className="col-span-4 lg:col-span-5">商家名称</div>
 <div className="col-span-4 lg:col-span-3">核心业务状态</div>
 <div className="col-span-3 lg:col-span-3">冷启完善度</div>
 <div className="col-span-1 text-right">操作</div>
 </div>

 {filteredProjects.map((proj: any) => {
 const isActive = proj.id === activeProjectId;
 return (
 <button
 key={proj.id}
 onClick={() => onSelect(proj.id)}
 className={`group w-full grid grid-cols-12 gap-4 items-center px-8 py-4 border-b border-neutral-100 transition-all text-left ${isActive ? 'bg-primary-50/40 relative' : 'hover:bg-neutral-50'}`}
 >
 {isActive && (
 <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
 )}
 
 {/* Col 1: Brand Info */}
 <div className="col-span-4 lg:col-span-5 flex items-center gap-3 pr-4 min-w-0">
 <div 
 className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] shadow-sm shrink-0 uppercase transition-transform group-hover:scale-105"
 style={{ backgroundColor: proj.color, color: proj.textColor }}
 >
 {proj.initial}
 </div>
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-2 mb-0.5">
 <h3 className={`text-[14px] tracking-tight truncate ${isActive ? 'text-primary-600' : 'text-neutral-900'}`}>{proj.name}</h3>
 {isActive && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-100 text-primary-600 font-extrabold tracking-widest uppercase shrink-0">当前</span>}
 </div>
 <div className="flex items-center gap-1 flex-wrap">
 {proj.tags?.map((tag: string) => (
 <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded truncate max-w-[80px]">
 {tag}
 </span>
 ))}
 </div>
 </div>
 </div>

 {/* Col 2: Stats */}
 <div className="col-span-4 lg:col-span-3 flex items-center gap-3 min-w-0">
 <div className="flex flex-col xl:flex-row items-center gap-1 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100 shrink-0">
 <div className="flex items-center gap-1">
 <BarChart2 size={10} className="text-neutral-400" />
 <span className="text-[12px] text-neutral-700">{proj.stats?.pendingContent || 0}</span>
 </div>
 <span className="text-[9px] text-neutral-400 ">篇待发</span>
 </div>
 <div className="flex flex-col xl:flex-row items-center gap-1 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100 shrink-0">
 <div className="flex items-center gap-1">
 <AlertCircle size={10} className="text-neutral-400" />
 <span className="text-[12px] text-neutral-700">{proj.stats?.pendingLeads || 0}</span>
 </div>
 <span className="text-[9px] text-neutral-400 ">待回</span>
 </div>
 </div>

 {/* Col 3: Status */}
 <div className="col-span-3 lg:col-span-3 flex items-center min-w-0">
 <div className="flex items-center gap-2">
 {proj.stats?.profileCompleteness === 100 ? (
 <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 rounded-md shrink-0">
 <CheckCircle2 size={12} className="text-neutral-900" />
 <span className="text-[11px] text-neutral-900">已完善</span>
 </div>
 ) : (
 <div className="flex items-center gap-2 shrink-0">
 <div className="w-10 xl:w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden shrink-0">
 <div className="h-full bg-primary-400 rounded-full" style={{ width: `${proj.stats?.profileCompleteness || 0}%` }} />
 </div>
 <span className="text-[11px] text-neutral-500">{proj.stats?.profileCompleteness || 0}%</span>
 </div>
 )}
 </div>
 </div>

 {/* Col 4: Action */}
 <div className="col-span-1 flex items-center justify-end">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary-100 text-primary-500' : 'bg-white border border-neutral-200 text-neutral-400 group-hover:border-primary-200 group-hover:text-primary-500 group-hover:bg-primary-50'}`}>
 <ChevronRight size={14} />
 </div>
 </div>
 </button>
 );
 })}
 
 {filteredProjects.length === 0 && (
 <div className="py-12 flex flex-col items-center justify-center text-neutral-400">
 <Search size={32} className="mb-4 opacity-50" />
 <p className="text-[14px] ">没有找到匹配的商家项目</p>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 </motion.div>
 </AnimatePresence>
 <CreateMerchantModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => {
 setIsCreateModalOpen(false);
 onClose();
 }} />
 </>
 );
};
