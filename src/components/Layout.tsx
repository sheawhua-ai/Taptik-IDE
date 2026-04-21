import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SideNavBar */}
      <aside className="flex flex-col h-full border-r border-zinc-200 p-4 gap-2 bg-zinc-50 w-64 shrink-0 z-50">
        <div className="flex flex-col gap-1 mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest text-zinc-900">TapTik IDE</h1>
              <p className="text-[10px] text-on-surface-variant font-medium">企业级架构师</p>
            </div>
          </div>
        </div>
        
        <button className="mb-4 w-full bg-zinc-900 text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-[13px] font-bold active:scale-95 transition-transform shadow-md shadow-zinc-200">
          <span className="material-symbols-outlined text-sm">add</span>
          新建项目
        </button>

        <nav className="flex-1 flex flex-col gap-1">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">radar</span>
            全局监控
          </NavLink>
          <NavLink to="/reverse-lab" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">biotech</span>
            爆款拆解与模板
          </NavLink>
          <NavLink to="/merchant-matrix" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            商家与AI配置
          </NavLink>
          <NavLink to="/task-dispatch" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">assignment_add</span>
            任务派发与审核
          </NavLink>
          <NavLink to="/content-pipeline" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            内容生产线
          </NavLink>
          <NavLink to="/intent-network" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            线索分发与监控
          </NavLink>
          <NavLink to="/data-compass" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-[13px] font-medium ${isActive ? 'bg-white text-[#5157a7] shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1 transition-transform duration-200'}`}>
            <span className="material-symbols-outlined text-[18px]">explore</span>
            数据罗盘
          </NavLink>
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-zinc-200 pt-4">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-200/50 rounded-lg transition-colors font-medium text-[13px]">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            帮助中心
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-200/50 rounded-lg transition-colors font-medium text-[13px]">
            <span className="material-symbols-outlined text-[18px]">dark_mode</span>
            暗色模式
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 h-14 bg-white/80 backdrop-blur-xl border-b border-zinc-100/50 shadow-sm shadow-zinc-200/50 shrink-0 z-40">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]">search</span>
              <input type="text" className="bg-surface-container-low border-none rounded-full pl-9 pr-4 py-1.5 text-xs w-64 focus:ring-1 focus:ring-secondary/30 transition-all outline-none" placeholder="全域内容检索..." />
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-zinc-500 hover:text-zinc-900 font-sans tracking-tight text-sm">控制台</a>
              <a href="#" className="text-violet-600 font-semibold border-b-2 border-violet-600 font-sans tracking-tight text-sm py-4">概览</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-900 font-sans tracking-tight text-sm">设置</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-xs font-bold px-3 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high transition-colors">财务工具</button>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">notifications</span></button>
              <button className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">help</span></button>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden ring-1 ring-zinc-200">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaset48DydtP7YJ7F6WChuXTpWoTuqwZpibjzK7OZm5nknO2R78MyaIioFeStDuwlI2UBLA_P0jewzi_eBYRjqIWblGcDfrWOtfrwOCwDMudEE3NBD_Z04Gwc8F2ow1YdAAgikBFIuYHw6TpmHlz5387QNc7diwhQcZABnC_QyoeE7zbFZnSj_eaadkoPWjMSU9bNVQ4NKugcCLpOB9zEUxiIFaAlQkTqNb4GLMer7XenUZ6gSQP0xG2Wjv6qcaaplONCu4WCk7wc" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
