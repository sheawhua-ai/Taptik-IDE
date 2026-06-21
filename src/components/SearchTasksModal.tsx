import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Folder, Navigation } from 'lucide-react';

interface SearchTasksModalProps {
   isOpen: boolean;
   onClose: () => void;
}

const MOCK_SEARCH_RESULTS = [
  { id: 1, title: 'TapTik的专家，和专家团，有什么区别吗？', time: '2026-06-19-23-17...', icon: Folder },
  { id: 2, title: 'electron也可以做移动端吗？我现在用...', time: '2026-06-19-12-36...', icon: Folder },
  { id: 3, title: '我想做小红书内容运营,需要专业的运营...', time: '2026-06-11-17-28...', icon: Folder },
  { id: 4, title: '我想做小红书内容运营,需要专业的运营...', time: '2026-06-19-16-00...', icon: Folder },
  { id: 5, title: 'Tauri移动端开发', time: '项目新手指引', icon: Navigation },
  { id: 6, title: '生成项目功能介绍', time: '项目新手指引', icon: Navigation },
  { id: 7, title: '帮我诊断一下现有的私域存量用户盘子', time: '2026-06-11-16-29...', icon: Folder },
];

export const SearchTasksModal: React.FC<SearchTasksModalProps> = ({ isOpen, onClose }) => {
   const [searchQuery, setSearchQuery] = useState('');

   if (!isOpen) return null;

   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-[1100] flex items-start justify-center pt-[10vh] px-4">
               {/* Backdrop */}
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm"
                  onClick={onClose}
               />

               {/* Modal */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
               >
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                     <Search size={20} className="text-slate-400 shrink-0 ml-2" />
                     <input 
                        autoFocus
                        type="text"
                        placeholder="搜索任务"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[16px] font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                     />
                     <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                     >
                        <X size={16} />
                     </button>
                  </div>
                  
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                     <div className="text-[13px] font-bold text-slate-400 mb-4 px-2 tracking-wide">
                        搜索到 {MOCK_SEARCH_RESULTS.length} 个任务
                     </div>
                     <div className="space-y-1">
                        {MOCK_SEARCH_RESULTS.map((item) => (
                           <button 
                              key={item.id}
                              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                              onClick={onClose}
                           >
                              <span className="text-[14px] font-bold text-slate-700 truncate max-w-[400px]">
                                 {item.title}
                              </span>
                              <div className="flex items-center gap-2 text-[12px] text-slate-400 group-hover:text-slate-500 font-mono">
                                 <item.icon size={14} className="shrink-0" strokeWidth={1.5} />
                                 <span className="truncate">{item.time}</span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
}
