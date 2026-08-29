import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Store, Building2, CheckCircle2, Search } from 'lucide-react';

interface SwitchAccountModalProps {
 isOpen: boolean;
 onClose: () => void;
 currentUserRole: "merchant" | "provider" | "creator";
 onSwitchRole: (role: "merchant" | "provider" | "creator") => void;
}

export const SwitchAccountModal: React.FC<SwitchAccountModalProps> = ({ 
 isOpen, 
 onClose, 
 currentUserRole,
 onSwitchRole
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedAccountId, setSelectedAccountId] = useState('merchant-1');

 useEffect(() => {
 if (isOpen) {
 setSearchQuery('');
 }
 }, [isOpen]);

 // Update selected account id if external role changes, just to keep it somewhat in sync
 useEffect(() => {
 if (currentUserRole === 'merchant' && !selectedAccountId.startsWith('merchant')) {
 setSelectedAccountId('merchant-1');
 } else if (currentUserRole === 'provider') {
 setSelectedAccountId('provider-1');
 } else if (currentUserRole === 'creator') {
 setSelectedAccountId('creator-1');
 }
 }, [currentUserRole]);

 if (!isOpen) return null;

 const accounts: { id: string; role: "merchant" | "provider" | "creator"; label: string; desc: string; icon: any; industry?: string }[] = [
 {
 id: 'merchant-1',
 role: 'merchant',
 label: '宠物食品官方旗舰店',
 desc: '积分池管理员',
 industry: '宠物用品',
 icon: Store
 },
 {
 id: 'merchant-2',
 role: 'merchant',
 label: '自然堂美妆小红书店',
 desc: '小红书渠道运营',
 industry: '美妆个护',
 icon: Store
 },
 {
 id: 'merchant-3',
 role: 'merchant',
 label: '太平鸟女装精选',
 desc: '抖音渠道运营',
 industry: '服饰装扮',
 icon: Store
 },
 {
 id: 'merchant-4',
 role: 'merchant',
 label: '三只松鼠零食店',
 desc: '拼多多渠道运营',
 industry: '食品饮料',
 icon: Store
 },
 {
 id: 'merchant-5',
 role: 'merchant',
 label: '小米官方旗舰店',
 desc: '全渠道运营',
 industry: '数码家电',
 icon: Store
 },
 {
 id: 'provider-1',
 role: 'provider',
 label: '杭州星火传媒有限公司',
 desc: '服务商账号 · 管理 12 个商家',
 icon: Building2
 },
 {
 id: 'creator-1',
 role: 'creator',
 label: 'AIGC 效率工坊',
 desc: '创作者账号 · 已上架 8 款技能',
 icon: User
 }
 ];

 const filteredAccounts = accounts.filter(acc => 
 acc.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
 (acc.industry && acc.industry.includes(searchQuery)) ||
 acc.desc.includes(searchQuery)
 );

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 pt-[10vh] items-start">
 {/* Backdrop */}
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-btn-main/40 backdrop-blur-sm"
 onClick={onClose}
 />

 {/* Modal */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-sm bg-surface-1 rounded-2xl shadow-xl overflow-hidden border border-border-default flex flex-col max-h-[80vh]"
 >
 <div className="flex flex-col px-6 pt-6 pb-4 border-b border-border-default">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-[18px] font-semibold text-text-main tracking-tight">切换账号</h2>
 <button 
 onClick={onClose}
 className="w-8 h-8 flex items-center justify-center rounded-full bg-hover-bg text-text-tertiary hover:bg-selected-bg hover:text-text-secondary transition-colors"
 >
 <X size={16} />
 </button>
 </div>
 <div className="relative">
 <Search size={16} className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input
 type="text"
 placeholder="搜索主体名称、行业..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full h-10 pl-9 pr-4 bg-page-bg border border-border-default focus:border-primary-500 outline-none rounded-xl text-[13px] text-text-main placeholder:text-text-tertiary transition-colors "
 />
 </div>
 </div>

 <div className="p-4 space-y-2 overflow-y-auto">
 {filteredAccounts.length > 0 ? filteredAccounts.map((acc) => (
 <button
 key={acc.id}
 onClick={() => {
 setSelectedAccountId(acc.id);
 onSwitchRole(acc.role);
 onClose();
 }}
 className={`w-full text-left flex items-start gap-3 p-4 rounded-xl transition-all ${selectedAccountId === acc.id ? 'bg-brand-light ring-1 ring-primary-200' : 'hover:bg-page-bg bg-surface-1 border border-border-default'}`}
 >
 <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 mt-0.5 ${selectedAccountId === acc.id ? 'bg-btn-main text-white shadow-md shadow-primary-500/20' : 'bg-hover-bg text-text-tertiary'}`}>
 <acc.icon size={18} />
 </div>
 <div className="flex-1 min-w-0 flex flex-col">
 <div className="flex items-center gap-1.5 mb-1">
 <span className="text-[14px] text-text-main truncate">{acc.label}</span>
 </div>
 <div className="text-[13px] text-text-tertiary truncate flex items-center gap-2">
 {acc.industry && (
 <span className="shrink-0 bg-hover-bg text-text-secondary px-1.5 rounded-md text-[13px] ">{acc.industry}</span>
 )}
 <span className="truncate">{acc.desc}</span>
 </div>
 </div>
 {selectedAccountId === acc.id && (
 <CheckCircle2 size={18} className="text-brand-logo shrink-0 mt-2" />
 )}
 </button>
 )) : (
 <div className="py-8 text-center text-[13px] text-text-tertiary ">
 没有找到匹配的账号
 </div>
 )}
 </div>
 
 <div className="p-4 border-t border-border-default bg-page-bg shrink-0">
 <button className="w-full py-3 bg-surface-1 border border-border-default text-text-secondary rounded-xl text-[14px] hover:bg-page-bg transition-colors">
 添加其他账号
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}

