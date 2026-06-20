import React, { useState } from 'react';
import { DataCenter } from '../DataCenter';

export const Metrics: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [dataSubNav, setDataSubNav] = useState('overview');
  
  if (!hasData) {
    return (
      <div className="flex flex-col h-full bg-white overflow-hidden items-center justify-center p-20 text-center">
         <div className="w-32 h-32 bg-indigo-50 rounded-[48px] flex items-center justify-center text-indigo-400 mb-8 animate-pulse">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
         </div>
         <h3 className="text-2xl font-black text-neutral-900 mb-4">暂无触达与转化分析数据</h3>
         <p className="text-neutral-400 font-bold max-w-md leading-relaxed">
           当您在“账号与分发”执行发布后，系统将自动汇总各平台的流量反馈，并在这里为您呈现 ROI 增长曲线。
         </p>
         <button 
           onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'content' } }))}
           className="mt-10 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-neutral-200 hover:bg-primary-500 transition-all"
         >
           去生产第一篇内容
         </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* 侧边导航与列表 */}
      <div className="w-[280px] border-r border-neutral-100 flex flex-col h-full bg-[#fafafa] shrink-0">
        <div className="p-8 border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">深度数据看板</h2>
              <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">
                Data Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-1">
           {[
             { id: 'overview', name: '驾驶舱概览', icon: 'M5 12h14M12 5l7 7-7 7' },
             { id: 'roi_attribution', name: '全链路归因', icon: 'M12 20V10M18 20V4M6 20v-4' },
             { id: 'auto_views', name: 'AI探索分析', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
             { id: 'scheduled', name: '自动化报表', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
             { id: 'blueocean', name: '蓝海词挖掘', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
           ].map((btn) => (
             <button 
               key={btn.id}
               onClick={() => setDataSubNav(btn.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-black transition-all ${dataSubNav === btn.id ? 'bg-white text-primary-500 shadow-sm border border-neutral-100' : 'text-neutral-500 hover:bg-neutral-100'}`}
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={btn.icon}/></svg>
               {btn.name}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 bg-white flex overflow-hidden relative">
        <DataCenter dataSubNav={dataSubNav} setDataSubNav={setDataSubNav} setActiveNav={() => {}} />
      </div>
    </div>
  );
};

