import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Folder } from 'lucide-react';

interface CreateProjectModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
 if (!isOpen) return null;

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
 onClick={onClose}
 />

 {/* Modal */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-lg bg-neutral-50 rounded-3xl shadow-xl overflow-hidden border border-neutral-100 flex flex-col pt-6 pb-8 px-8"
 >
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-[20px] font-semibold text-neutral-800 tracking-tight">新建项目</h2>
 <button 
 onClick={onClose}
 className="text-neutral-400 hover:text-neutral-700 transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 <div className="flex flex-col gap-4">
 <button onClick={() => onCreate && onCreate("scratch")} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">
 <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500 shrink-0 group-hover:scale-105 transition-transform">
 <Plus size={24} />
 </div>
 <div>
 <div className="text-[16px] text-neutral-800 mb-1">从头开始</div>
 <div className="text-[13px] text-neutral-400 font-medium">在工作目录下自动创建新文件夹</div>
 </div>
 </button>

 <button onClick={() => onCreate && onCreate("existing")} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">
 <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-600 shrink-0 group-hover:scale-105 transition-transform">
 <Folder size={22} />
 </div>
 <div>
 <div className="text-[16px] text-neutral-800 mb-1">使用现有文件夹</div>
 <div className="text-[13px] text-neutral-400 font-medium">选择已有目录作为项目根目录</div>
 </div>
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
