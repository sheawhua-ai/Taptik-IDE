import React from 'react';

export const AccountSettings = () => {
 return (
 <div className="flex flex-col h-full space-y-8">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl ">
 1
 </div>
 <div>
 <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">18616306063</h3>
 <p className="text-[13px] text-slate-500 mt-0.5">18616306063</p>
 </div>
 </div>

 <div>
 <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
 退出登录
 </button>
 </div>

 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
 <div className="flex items-center justify-between mb-8 relative z-10">
 <h4 className="text-[16px] font-semibold text-slate-900">体验版</h4>
 <button className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[12px] hover:bg-primary-500 transition-colors">
 升级
 </button>
 </div>

 <div className="flex items-center justify-between mb-6 relative z-10 border-b border-slate-200/60 pb-6">
 <div className="flex items-center gap-2">
 <span className="text-[20px] text-slate-400">✨</span>
 <span className="text-[14px] text-slate-700">Credits</span>
 <button className="text-[12px] text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded ml-2">查看明细</button>
 </div>
 <div className="text-[14px] text-slate-500 font-medium">
 累计剩余: <span className="text-[20px] text-slate-900 ml-1">3,180.51</span>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="flex justify-between items-start">
 <div>
 <div className="text-[14px] text-slate-900 mb-1">TapTik 体验套餐</div>
 <div className="text-[12px] text-slate-500 space-y-0.5">
 <div>到期日期: 2034-09-11</div>
 <div>下次刷新日期: 2026-07-01</div>
 </div>
 </div>
 <div className="text-right text-[12px] text-slate-500 space-y-0.5">
 <div>总量: 500</div>
 <div>剩余: <span className=" text-slate-900">430.51</span></div>
 </div>
 </div>

 <div className="flex justify-between items-start">
 <div>
 <div className="text-[14px] text-slate-900 mb-1">TapTik 活动套餐</div>
 <div className="text-[12px] text-slate-500 space-y-0.5">
 <div>到期日期: 2026-07-11</div>
 <div>下次刷新日期: 2026-07-11</div>
 </div>
 </div>
 <div className="text-right text-[12px] text-slate-500 space-y-0.5">
 <div>总量: 2,000</div>
 <div>剩余: <span className=" text-slate-900">2,000</span></div>
 </div>
 </div>

 <div className="flex justify-between items-start">
 <div>
 <div className="text-[14px] text-slate-900 mb-1">TapTik 活动套餐</div>
 <div className="text-[12px] text-slate-500 space-y-0.5">
 <div>到期日期: 2026-07-11</div>
 <div>下次刷新日期: 2026-07-11</div>
 </div>
 </div>
 <div className="text-right text-[12px] text-slate-500 space-y-0.5">
 <div>总量: 150</div>
 <div>剩余: <span className=" text-slate-900">150</span></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
