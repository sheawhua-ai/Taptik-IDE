import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Share2, Copy, Download } from 'lucide-react';

interface GrowthPlanModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const GrowthPlanModal: React.FC<GrowthPlanModalProps> = ({ isOpen, onClose }) => {
 const [activeTab, setActiveTab] = useState<'merchant' | 'provider'>('merchant');

 if (!isOpen) return null;

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
 onClick={onClose}
 />

 {/* Modal */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 flex flex-col"
 >
 <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-neutral-100">
 <div>
 <h2 className="text-[20px] font-semibold text-neutral-900 tracking-tight">成长计划分享</h2>
 <p className="text-[13px] text-neutral-500 mt-1">分享专属二维码，获得更多权益</p>
 </div>
 <button 
 onClick={onClose}
 className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors self-start"
 >
 <X size={16} />
 </button>
 </div>

 <div className="px-8 pt-4 pb-2">
 <div className="flex p-1 bg-neutral-100 rounded-xl">
 <button 
 onClick={() => setActiveTab('merchant')}
 className={`flex-1 py-2 text-[13px] rounded-lg transition-all ${activeTab === 'merchant' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 分享让更多商家加入成为下属
 </button>
 <button 
 onClick={() => setActiveTab('provider')}
 className={`flex-1 py-2 text-[13px] rounded-lg transition-all ${activeTab === 'provider' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 分享企业或个人成为服务商
 </button>
 </div>
 </div>

 <div className="p-8 flex flex-col items-center">
 {activeTab === 'merchant' ? (
 <>
 <div className="text-center mb-6">
 <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">邀请更多商家加入成为下属</h3>
 <p className="text-[13px] text-neutral-500">商家扫码注册后将自动绑定至您的名下</p>
 </div>
 <div className="w-48 h-48 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 p-4 relative group cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
 <QrCode size={48} className="mb-2 text-neutral-300 group-hover:text-primary-400 transition-colors" />
 <span className="text-[12px] text-center">专属邀请二维码<br/>将在生成后显示</span>
 <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
 <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-[13px] shadow-lg shadow-primary-500/30 flex items-center gap-2">
 <Download size={14} /> 保存图片
 </button>
 </div>
 </div>
 </>
 ) : (
 <>
 <div className="text-center mb-6">
 <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">邀请企业或个人成为服务商</h3>
 <p className="text-[13px] text-neutral-500">邀请他们成为服务商，共同成长</p>
 </div>
 <div className="w-48 h-48 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 p-4 relative group cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
 <QrCode size={48} className="mb-2 text-neutral-300 group-hover:text-primary-400 transition-colors" />
 <span className="text-[12px] text-center">专属邀请二维码<br/>将在生成后显示</span>
 <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
 <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-[13px] shadow-lg shadow-primary-500/30 flex items-center gap-2">
 <Download size={14} /> 保存图片
 </button>
 </div>
 </div>
 </>
 )}

 <div className="w-full mt-8 space-y-3">
 <div className="flex gap-2">
 <div className="flex-1 h-11 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center px-4 font-mono text-[12px] text-neutral-500 overflow-hidden text-ellipsis whitespace-nowrap">
 https://taptik.com/invite/{activeTab === 'merchant' ? 'm' : 'p'}/E28A9F
 </div>
 <button className="h-11 px-4 bg-neutral-100 text-neutral-600 rounded-xl text-[13px] hover:bg-neutral-200 transition-colors flex items-center gap-2 shrink-0">
 <Copy size={14} /> 复制
 </button>
 </div>
 <button className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] hover:bg-primary-500 transition-colors shadow-lg shadow-neutral-200 flex items-center justify-center gap-2">
 <Share2 size={16} /> 立即分享
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
