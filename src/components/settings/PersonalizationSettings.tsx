import React, { useState } from 'react';

export const PersonalizationSettings = () => {
 const [loadingGreeting, setLoadingGreeting] = useState(true);

 return (
 <div className="flex flex-col h-full space-y-8">
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-[16px] font-semibold text-slate-900">基本风格和语调</h4>
 <p className="text-[13px] text-slate-500 mt-1">设置 智能 助手回复你的风格和语调。这不会影响 智能 助手的功能。</p>
 </div>
 <select className="border border-slate-200 bg-white px-4 py-2 rounded-lg text-[13px] text-slate-700 outline-none focus:border-primary-500 shadow-sm cursor-pointer w-32">
 <option>默认</option>
 <option>专业</option>
 <option>幽默</option>
 <option>简洁</option>
 </select>
 </div>
 </div>

 <div className="h-[1px] bg-slate-100 my-2" />

 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-[16px] font-semibold text-slate-900">加载过程欢迎语</h4>
 <p className="text-[13px] text-slate-500 mt-1">在 智能 生成等待过程中展示辅助提示。关闭后可在这里重新打开。</p>
 </div>
 <button 
 onClick={() => setLoadingGreeting(!loadingGreeting)}
 className={`relative w-11 h-6 rounded-full transition-colors ${loadingGreeting ? 'bg-primary-500' : 'bg-slate-300'}`}
 >
 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${loadingGreeting ? 'translate-x-5' : 'translate-x-0'}`} />
 </button>
 </div>
 </div>

 <div className="h-[1px] bg-slate-100 my-2" />

 <div className="space-y-4">
 <div>
 <h4 className="text-[16px] font-semibold text-slate-900 mb-1">自定义指令</h4>
 <p className="text-[13px] text-slate-500">告诉 智能 助手你希望它始终遵循的规则和偏好，这会直接影响所有对话。</p>
 </div>
 
 <div className="relative">
 <textarea 
 className="w-full h-[180px] bg-white border border-slate-200 rounded-2xl p-5 text-[14px] outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder:text-slate-400 transition-all resize-none shadow-sm"
 placeholder='例如："每次回答我之前都说 ok，再接后续内容"'
 />
 <div className="flex justify-between items-center mt-2 group px-2">
 <div className="text-[12px] text-slate-400">这些指令会应用于你的所有对话</div>
 <div className="text-[12px] text-slate-400">0 / 1500</div>
 </div>
 </div>

 <div className="flex justify-end pt-2">
 <button className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-[14px] transition-colors shadow-sm">
 确认
 </button>
 </div>
 </div>
 </div>
 );
};
