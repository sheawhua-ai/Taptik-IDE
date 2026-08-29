import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { SubagentChat } from './SubagentChat';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
 const [isChatOpen, setIsChatOpen] = useState(false);

 return (
 <div className="flex h-screen overflow-hidden bg-background">
 {/* SideNavBar */}
 <aside className="flex flex-col h-full border-r border-border-default p-4 gap-2 bg-page-bg w-64 shrink-0 z-50">
 <div className="flex flex-col gap-1 mb-6 px-2">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-btn-main rounded-lg flex items-center justify-center">
 <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
 </div>
 <div>
 <h1 className="text-sm font-semibold uppercase tracking-widest text-text-main">智策系统</h1>
 <p className="text-[13px] text-on-surface-variant font-medium">企业级架构师</p>
 </div>
 </div>
 </div>
 
 <button className="mb-4 w-full bg-btn-main text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-[13px] active:scale-95 transition-transform shadow-md shadow-neutral-200">
 <span className="material-symbols-outlined text-sm">add</span>
 新建项目
 </button>

 <nav className="flex-1 flex flex-col gap-1">
 <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">radar</span>
 全局监控
 </NavLink>
 <NavLink to="/reverse-lab" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">biotech</span>
 爆款拆解与模板
 </NavLink>
 <NavLink to="/merchant-matrix" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">grid_view</span>
 商家与智能配置
 </NavLink>
 <NavLink to="/task-dispatch" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">assignment_add</span>
 任务派发与审核
 </NavLink>
 <NavLink to="/content-pipeline" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">account_tree</span>
 内容生产线
 </NavLink>
 <NavLink to="/assets-knowledge" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">perm_media</span>
 素材与知识库
 </NavLink>
 <NavLink to="/intent-network" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">psychology</span>
 线索分发与监控
 </NavLink>
 <NavLink to="/data-compass" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-surface-1 text-[#5157a7] shadow-sm ring-1 ring-neutral-200' : 'text-text-tertiary hover:bg-selected-bg/50 hover:tranneutral-x-1 transition-transform duration-200'}`}>
 <span className="material-symbols-outlined text-[18px]">explore</span>
 数据罗盘
 </NavLink>
 </nav>

 <div className="mt-auto flex flex-col gap-1 border-t border-border-default pt-4">
 <a href="#" className="flex items-center gap-3 px-3 py-2 text-text-tertiary hover:bg-selected-bg/50 rounded-lg transition-colors font-medium text-[13px]">
 <span className="material-symbols-outlined text-[18px]">support_agent</span>
 帮助中心
 </a>
 <a href="#" className="flex items-center gap-3 px-3 py-2 text-text-tertiary hover:bg-selected-bg/50 rounded-lg transition-colors font-medium text-[13px]">
 <span className="material-symbols-outlined text-[18px]">dark_mode</span>
 暗色模式
 </a>
 </div>
 </aside>

 <main className="flex-1 flex flex-col overflow-hidden relative">
 {/* TopNavBar */}
 <header className="flex justify-between items-center w-full px-6 h-14 bg-surface-1/80 backdrop-blur-xl border-b border-border-default/50 shadow-sm shadow-neutral-200/50 shrink-0 z-40">
 <div className="flex items-center gap-8">
 <div className="relative group">
 <span className="material-symbols-outlined absolute left-3 top-1/2 -tranneutral-y-1/2 text-text-tertiary text-[18px]">search</span>
 <input type="text" className="bg-surface-container-low border-none rounded-full pl-9 pr-4 py-1.5 text-[13px] w-64 focus:ring-1 focus:ring-secondary/30 transition-all outline-none" placeholder="全域内容检索..." />
 </div>
 
 <nav className="hidden md:flex items-center gap-6">
 <a href="#" className="text-text-tertiary hover:text-text-main font-sans tracking-tight text-sm">控制台</a>
 <a href="#" className="text-brand-logo font-semibold border-b-2 border-primary-600 font-sans tracking-tight text-sm py-4">概览</a>
 <a href="#" className="text-text-tertiary hover:text-text-main font-sans tracking-tight text-sm">设置</a>
 </nav>
 </div>

 <div className="flex items-center gap-4">
 <button className="text-[13px] px-3 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high transition-colors">财务工具</button>
 <div className="flex items-center gap-2">
 <button className="p-1.5 text-text-tertiary hover:bg-hover-bg rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">notifications</span></button>
 <button className="p-1.5 text-text-tertiary hover:bg-hover-bg rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">help</span></button>
 </div>
 <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden ring-1 ring-neutral-200">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaset48DydtP7YJ7F6WChuXTpWoTuqwZpibjzK7OZm5nknO2R78MyaIioFeStDuwlI2UBLA_P0jewzi_eBYRjqIWblGcDfrWOtfrwOCwDMudEE3NBD_Z04Gwc8F2ow1YdAAgikBFIuYHw6TpmHlz5387QNc7diwhQcZABnC_QyoeE7zbFZnSj_eaadkoPWjMSU9bNVQ4NKugcCLpOB9zEUxiIFaAlQkTqNb4GLMer7XenUZ6gSQP0xG2Wjv6qcaaplONCu4WCk7wc" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 </div>
 </header>

 <div className="flex-1 overflow-y-auto relative">
 <Outlet />
 </div>

 {/* Floating Agent Ball - Fixed to Viewport */}
 <div className="fixed bottom-16 right-8 flex flex-col items-end gap-4 z-50">
 <AnimatePresence>
 {isChatOpen && (
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="w-[400px] h-[600px] bg-surface-1 rounded-[32px] shadow-2xl border border-border-default overflow-hidden flex flex-col"
 >
 <SubagentChat 
 moduleId="global" 
 moduleName="全域指挥中心" 
 onClose={() => setIsChatOpen(false)}
 />
 </motion.div>
 )}
 </AnimatePresence>

 <button 
 onClick={() => setIsChatOpen(!isChatOpen)}
 className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isChatOpen ? 'bg-btn-main rotate-90 scale-90' : 'bg-btn-main hover:scale-110 active:scale-95'}`}
 >
 {isChatOpen ? <X className="text-white" size={20} /> : (
 <div className="relative">
 <MessageSquare className="text-white" size={24} />
 <motion.div 
 animate={{ scale: [1, 1.2, 1] }}
 transition={{ duration: 2, repeat: Infinity }}
 className="absolute -top-1 -right-1 w-3 h-3 bg-surface-1 rounded-full flex items-center justify-center"
 >
 <Sparkles size={8} className="text-brand-logo" />
 </motion.div>
 </div>
 )}
 </button>
 </div>
 </main>
 </div>
 );
}
