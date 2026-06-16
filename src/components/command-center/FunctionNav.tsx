import React from 'react';
import { Compass, LayoutGrid, BarChart2, Sparkles, MessageSquare, Send, Workflow, ShoppingCart, Database, X, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface FunctionNavProps {
  setActiveNav: (nav: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FunctionNav: React.FC<FunctionNavProps> = ({ setActiveNav, isOpen, onClose }) => {
  if (!isOpen) return null;

  const NAV_GROUPS = [
    {
      label: '数据洞察',
      items: [
        { label: '全域巡航', icon: Compass, action: () => { setActiveNav('workbench'); onClose(); } },
        { label: '矩阵分发', icon: LayoutGrid, action: () => { setActiveNav('workbench'); onClose(); } },
        { label: '数据归因', icon: BarChart2, action: () => { setActiveNav('workbench'); onClose(); } },
      ]
    },
    {
      label: '内容管理',
      items: [
        { label: '智造工坊', icon: Sparkles, action: () => { setActiveNav('workbench'); onClose(); } },
        { label: '触达转化', icon: MessageSquare, action: () => { setActiveNav('workbench'); onClose(); } },
      ]
    },
    {
      label: '商户与员工',
      items: [
        { label: '商户项目看板', icon: LayoutGrid, action: () => { setActiveNav('workflow'); onClose(); } },
      ]
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      className="absolute bottom-full left-0 mb-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col z-50 overflow-hidden"
    >
      <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-neutral-100 flex-1">
          <Search size={14} className="text-neutral-400" />
          <input 
            autoFocus
            placeholder="搜索功能导航..." 
            className="bg-transparent border-none outline-none text-[12px] font-bold w-full"
          />
        </div>
        <button onClick={onClose} className="p-2 ml-2 hover:bg-neutral-200 rounded-lg text-neutral-500 transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-2">
            <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest px-3 py-2">
              {group.label}
            </div>
            {group.items.map(item => (
              <button 
                key={item.label}
                onClick={item.action}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-neutral-50 flex items-center gap-3 text-[12px] font-bold text-neutral-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-white border border-neutral-100 flex items-center justify-center text-neutral-500 shadow-sm">
                  <item.icon size={12} />
                </div>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="p-3 bg-neutral-50 border-t border-neutral-100 text-center">
        <span className="text-[10px] font-bold text-neutral-400">试试在输入框直接描述你的需求 (Ctrl+K 打开)</span>
      </div>
    </motion.div>
  );
};
