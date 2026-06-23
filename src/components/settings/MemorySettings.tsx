import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy } from 'lucide-react';

export const MemorySettings = () => {
 const [isImportModalOpen, setIsImportModalOpen] = useState(false);
 const [memoryEnabled, setMemoryEnabled] = useState(true);

 return (
 <div className="flex flex-col h-full space-y-8">
 <div>
 <p className="text-[14px] text-slate-600 mb-8 mt-2">
 记忆让 TapTik 记住你的偏好和习惯，对话越多，它就越懂你。记忆内容遵循 <a href="#" className="text-primary-500 hover:text-primary-600 underline underline-offset-2">TapTik 隐私政策</a>，仅你本人可见。
 </p>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-[16px] font-semibold text-slate-900">生成对话记忆</h4>
 <p className="text-[13px] text-slate-500 mt-1">允许 TapTik 从对话中提取并记住相关上下文，以便在未来对话中提供更连贯、个性化的回应。</p>
 </div>
 <button 
 onClick={() => setMemoryEnabled(!memoryEnabled)}
 className={`relative w-11 h-6 rounded-full transition-colors ${memoryEnabled ? 'bg-primary-500' : 'bg-slate-300'}`}
 >
 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${memoryEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
 </button>
 </div>

 <div className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4">
 <p className="text-[13px] text-slate-600 leading-relaxed flex-1 line-clamp-2">
 **工作背景** 用户是小红书AI运营SaaS平台TAPTIK的创始人，团队目前仅有2名兼职开发人员（1名Python全栈、1名Rust/Tauri方向），核心任务是在有限的研发资源下为TAPTIK搭建竞争壁垒，并已制定包含...
 </p>
 <div className="shrink-0 text-right">
 <div className="text-[14px] text-slate-900">来自对话的记忆</div>
 <div className="text-[12px] text-slate-400 mt-1">10 小时前从对话中更新</div>
 </div>
 </div>
 </div>

 <div className="h-[1px] bg-slate-100 my-4" />

 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-[16px] font-semibold text-slate-900">从其他AI导入记忆</h4>
 <p className="text-[13px] text-slate-500 mt-1">一键同步你在其他AI上的使用习惯。</p>
 </div>
 <button 
 onClick={() => setIsImportModalOpen(true)}
 className="px-5 py-2 hover:bg-slate-50 text-slate-700 text-[13px] rounded-lg transition-colors"
 >
 导入
 </button>
 </div>

 <AnimatePresence>
 {isImportModalOpen && (
 <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
 onClick={() => setIsImportModalOpen(false)}
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 flex flex-col"
 >
 <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 relative z-10">
 <h2 className="text-[18px] font-semibold text-slate-900 tracking-tight">将记忆导入TapTik</h2>
 <button 
 onClick={() => setIsImportModalOpen(false)}
 className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
 >
 <X size={16} />
 </button>
 </div>

 <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
 <div className="bg-white border text-left border-slate-200 rounded-2xl p-5 relative shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[12px] text-slate-600">1</div>
 <span className="text-[14px] text-slate-800">复制以下提示词到其他AI对话中</span>
 </div>
 <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-lg text-[12px] font-medium text-slate-600 transition-colors border border-transparent hover:border-slate-200">
 <Copy size={14} /> 复制
 </button>
 </div>
 <div className="bg-slate-50 rounded-xl p-4 text-[13px] text-slate-600 leading-relaxed max-w-full">
 请帮我整理一份我的个人使用画像，用途是让我...
 指令：我明确要求遵循的规则，包括语气、格式、风格、“始终做 X”、“绝不做 Y” 以及对助手行为的纠正...
 </div>
 </div>

 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left relative">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[12px] text-slate-600">2</div>
 <span className="text-[14px] text-slate-800">将结果粘贴到下方，添加到TapTik记忆</span>
 </div>
 <textarea 
 className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder:text-slate-400 transition-all resize-none"
 placeholder="在此粘贴你的记忆详情"
 />
 </div>
 </div>

 <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-3xl">
 <button 
 onClick={() => setIsImportModalOpen(false)}
 className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] hover:bg-slate-50 transition-colors"
 >
 取消
 </button>
 <button 
 className="px-5 py-2 bg-slate-200 text-slate-400 rounded-xl text-[14px] cursor-not-allowed"
 >
 添加到记忆
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
};
