import React from 'react';
import { X, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface CommandDirectoryProps {
 isOpen: boolean;
 onClose: () => void;
 onSelectCommand: (cmd: string) => void;
}

const COMMAND_EXAMPLES = [
 {
 category: '📊 数据洞察类',
 commands: [
 { template: '分析 [笔记链接] 的互动趋势', preview: '分析这篇笔记的互动数据变化' },
 { template: '查看 [商家小红书号] 最近 7 天的数据', preview: '获取商家整体运营数据' },
 { template: '对比 [笔记A] 和 [笔记B] 的表现', preview: '两篇笔记横向对比' },
 ]
 },
 {
 category: '📝 内容生成类',
 commands: [
 { template: '为 [行业名称] 生成 5 篇爆文草稿', preview: '基于行业热点自动生成内容' },
 { template: '改写这篇笔记使其更符合 [风格] 的网感', preview: '去智能味，增加小红书风格' },
 { template: '基于爆款词 [关键词] 生成 3 个优质标题', preview: '用蓝海词生成高点击标题' },
 ]
 },
 {
 category: '👥 团队与管理类',
 commands: [
 { template: '查看待审核的图文素材', preview: '快速定位待审核内容' },
 { template: '派发素材任务给 [小红书运营A]', preview: '一键下发拍摄任务' },
 { template: '查看 [美妆夏季宣发] 的分发进度', preview: '查看内容分发状态' },
 ]
 },
];

export const CommandDirectory: React.FC<CommandDirectoryProps> = ({ isOpen, onClose, onSelectCommand }) => {
 if (!isOpen) return null;

 return (
 <motion.div 
 initial={{ opacity: 0, y: 10, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.98 }}
 className="absolute bottom-full right-0 mb-4 w-[400px] bg-neutral-900 rounded-3xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden"
 >
 <div className="p-4 border-b border-white/10 flex items-center justify-between">
 <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl flex-1 border border-white/5 focus-within:border-primary-500/50 transition-colors">
 <Search size={14} className="text-white/40" />
 <input 
 autoFocus
 placeholder="搜索意图或指令模板..." 
 className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-white/30"
 />
 </div>
 <button onClick={onClose} className="p-2 ml-2 hover:bg-white/10 rounded-xl text-white/50 transition-colors">
 <X size={16} />
 </button>
 </div>
 <div className="p-2 max-h-[420px] overflow-y-auto custom-scrollbar">
 {COMMAND_EXAMPLES.map(group => (
 <div key={group.category} className="mb-4">
 <div className="text-[11px] tracking-widest text-white/40 px-3 py-2">
 {group.category}
 </div>
 <div className="px-1 space-y-1">
 {group.commands.map((item, idx) => (
 <button 
 key={idx}
 onClick={() => onSelectCommand(item.template)}
 className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/5 flex flex-col gap-1 transition-colors group"
 >
 <div className="text-[13px] text-white group-hover:text-primary-400 transition-colors">
 {item.template.split(/(\[.*?\])/).map((part, i) => 
 part.startsWith('[') && part.endsWith(']') ? 
 <span key={i} className="text-primary-500 bg-primary-500/10 px-1 rounded mx-0.5">{part}</span> : 
 part
 )}
 </div>
 <div className="text-[11px] font-medium text-white/40">{item.preview}</div>
 </button>
 ))}
 </div>
 </div>
 ))}
 </div>
 <div className="p-4 bg-white/5 border-t border-white/10 text-center">
 <span className="text-[11px] text-white/40 italic">也可以在输入框自由用自然语言描述，我会尽力理解</span>
 </div>
 </motion.div>
 );
};
