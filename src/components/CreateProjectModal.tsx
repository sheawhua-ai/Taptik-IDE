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
 className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm"
 onClick={onClose}
 />

 {/* Modal */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-lg bg-page-bg rounded-2xl shadow-xl overflow-hidden border border-border-default flex flex-col pt-6 pb-8 px-8"
 >
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-[20px] font-semibold text-text-main tracking-tight">新建项目</h2>
 <button 
 onClick={onClose}
 className="text-text-tertiary hover:text-text-secondary transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 <div className="flex flex-col gap-4">
 <button onClick={() => onCreate && onCreate("scratch")} className="flex items-center gap-6 p-6 rounded-xl bg-surface-1 border border-border-default shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">
 <div className="w-12 h-12 bg-hover-bg rounded-xl flex items-center justify-center text-text-tertiary shrink-0 group-hover:scale-105 transition-transform">
 <Plus size={24} />
 </div>
 <div>
 <div className="text-[16px] text-text-main mb-1">从头开始</div>
 <div className="text-[13px] text-text-tertiary font-medium">在工作目录下自动创建新文件夹</div>
 </div>
 </button>

 <button onClick={() => onCreate && onCreate("existing")} className="flex items-center gap-6 p-6 rounded-xl bg-surface-1 border border-border-default shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">
 <div className="w-12 h-12 bg-page-bg border border-border-default rounded-xl flex items-center justify-center text-text-secondary shrink-0 group-hover:scale-105 transition-transform">
 <Folder size={22} />
 </div>
 <div>
 <div className="text-[16px] text-text-main mb-1">使用现有文件夹</div>
 <div className="text-[13px] text-text-tertiary font-medium">选择已有目录作为项目根目录</div>
 </div>
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
