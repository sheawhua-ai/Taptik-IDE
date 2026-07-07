import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, X, Image as ImageIcon, Send } from 'lucide-react';

export const HelpSettings = () => {
 const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
 const [feedbackText, setFeedbackText] = useState('');
 const [includeLogs, setIncludeLogs] = useState(true);

 return (
 <div className="flex flex-col h-full space-y-6">
 <div className="space-y-2">
 <button className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-neutral-50 transition-colors group">
 <div className="flex items-center gap-3 text-[14px] text-neutral-800">
 <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
 <ExternalLink size={16} />
 </div>
 帮助文档
 </div>
 <ExternalLink size={16} className="text-neutral-300 group-hover:text-neutral-400" />
 </button>
 <button 
 onClick={() => setIsFeedbackOpen(true)}
 className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-neutral-50 transition-colors group"
 >
 <div className="flex items-center gap-3 text-[14px] text-neutral-800">
 <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
 <Send size={16} />
 </div>
 意见反馈
 </div>
 <ExternalLink size={16} className="text-neutral-300 group-hover:text-neutral-400" />
 </button>
 </div>

 <AnimatePresence>
 {isFeedbackOpen && (
 <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
 onClick={() => setIsFeedbackOpen(false)}
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 flex flex-col"
 >
 <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
 <h2 className="text-[18px] font-semibold text-neutral-900 tracking-tight">意见反馈</h2>
 <button 
 onClick={() => setIsFeedbackOpen(false)}
 className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
 >
 <X size={16} />
 </button>
 </div>

 <div className="p-6 space-y-4">
 <div className="relative border border-neutral-200 rounded-2xl focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all bg-white min-h-[160px] flex flex-col">
 <textarea
 value={feedbackText}
 onChange={e => setFeedbackText(e.target.value)}
 placeholder="你可以描述你遇到的问题"
 className="w-full flex-1 bg-transparent p-4 outline-none text-[14px] text-neutral-700 resize-none placeholder:text-neutral-400"
 />
 <div className="p-3 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50">
 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] text-neutral-600 hover:bg-neutral-50 transition-colors hover:border-neutral-300">
 <ImageIcon size={14} /> 上传图片 (0/4)
 </button>
 <span className="text-[12px] text-neutral-400 ">{feedbackText.length}/300</span>
 </div>
 </div>

 <div className="flex items-start gap-4 justify-between pt-2">
 <label className="flex items-start gap-2.5 cursor-pointer flex-1">
 <div className="relative flex items-center mt-0.5">
 <input 
 type="checkbox" 
 checked={includeLogs}
 onChange={e => setIncludeLogs(e.target.checked)}
 className="peer appearance-none w-4 h-4 rounded mt-[1px] border border-neutral-300 checked:bg-[#a3dbcd] checked:border-[#a3dbcd] transition-colors cursor-pointer"
 />
 <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none opacity-0 peer-checked:opacity-100">
 <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 </div>
 <span className="text-[12px] text-neutral-500 leading-snug">
 上传日志，仅用于排查问题，可能包含对话记录、设备信息等数据。详情请查阅 <a href="#" className="text-[#a3dbcd] hover:underline underline-offset-2">隐私保护声明</a> 
 </span>
 </label>

 <button className="px-6 py-2.5 bg-[#a3dbcd] hover:bg-[#92c5b8] text-white rounded-xl text-[14px] transition-colors shadow-sm shrink-0">
 提交
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
};
