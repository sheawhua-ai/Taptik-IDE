import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Store, User, Phone, Lock, Eye, EyeOff, QrCode, Download, Copy } from 'lucide-react';

interface CreateMerchantModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSuccess?: () => void;
}

export const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({ isOpen, onClose, onSuccess }) => {
 const [showPassword, setShowPassword] = useState(false);
 const [activeTab, setActiveTab] = useState<'manual' | 'qr'>('manual');
 const [formData, setFormData] = useState({
 merchantName: '',
 username: '',
 phone: '',
 password: ''
 });

 if (!isOpen) return null;

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (onSuccess) onSuccess();
 onClose();
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-btn-main/40 backdrop-blur-sm"
 onClick={onClose}
 />

 {/* Modal */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="relative w-full max-w-md bg-surface-1 rounded-2xl shadow-xl overflow-hidden border border-border-default flex flex-col"
 >
 <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border-default">
 <div>
 <h2 className="text-[20px] font-semibold text-text-main tracking-tight">新增商家</h2>
 <p className="text-[13px] text-text-tertiary mt-1">创建下属商家账号并配置核心信息</p>
 </div>
 <button 
 onClick={onClose}
 className="w-8 h-8 flex items-center justify-center rounded-full bg-hover-bg text-text-tertiary hover:bg-selected-bg hover:text-text-secondary transition-colors self-start"
 >
 <X size={16} />
 </button>
 </div>

 <div className="px-8 pt-4 pb-2">
 <div className="flex p-1 bg-hover-bg rounded-xl">
 <button 
 onClick={() => setActiveTab('manual')}
 className={`flex-1 py-2 text-[13px] rounded-lg transition-all ${activeTab === 'manual' ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 手动填写
 </button>
 <button 
 onClick={() => setActiveTab('qr')}
 className={`flex-1 py-2 text-[13px] rounded-lg transition-all ${activeTab === 'qr' ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 分享二维码
 </button>
 </div>
 </div>

 {activeTab === 'manual' ? (
 <form onSubmit={handleSubmit} className="p-8 pt-6 flex flex-col gap-5">
 <div className="space-y-1.5">
 <label className="text-[12px] text-text-secondary ml-1">商家名称</label>
 <div className="relative">
 <Store size={16} className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input 
 type="text" 
 required
 value={formData.merchantName}
 onChange={e => setFormData({...formData, merchantName: e.target.value})}
 placeholder="例如：宠物食品官方旗舰店"
 className="w-full h-11 pl-10 pr-4 bg-page-bg border border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] text-text-main placeholder:font-normal placeholder:text-text-tertiary transition-all"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[12px] text-text-secondary ml-1">负责人用户名</label>
 <div className="relative">
 <User size={16} className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input 
 type="text" 
 required
 value={formData.username}
 onChange={e => setFormData({...formData, username: e.target.value})}
 placeholder="用于登录的用户名"
 className="w-full h-11 pl-10 pr-4 bg-page-bg border border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] text-text-main placeholder:font-normal placeholder:text-text-tertiary transition-all"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[12px] text-text-secondary ml-1">手机号码</label>
 <div className="relative">
 <Phone size={16} className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input 
 type="tel" 
 required
 value={formData.phone}
 onChange={e => setFormData({...formData, phone: e.target.value})}
 placeholder="11位手机号码"
 className="w-full h-11 pl-10 pr-4 bg-page-bg border border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] text-text-main placeholder:font-normal placeholder:text-text-tertiary transition-all"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[12px] text-text-secondary ml-1">登录密码</label>
 <div className="relative">
 <Lock size={16} className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input 
 type={showPassword ? 'text' : 'password'} 
 required
 value={formData.password}
 onChange={e => setFormData({...formData, password: e.target.value})}
 placeholder="不少于8位字符"
 className="w-full h-11 pl-10 pr-10 bg-page-bg border border-border-default focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] text-text-main placeholder:font-normal placeholder:text-text-tertiary transition-all"
 />
 <button 
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3.5 top-1/2 -tranneutral-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
 >
 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 </div>
 </div>

 <div className="pt-4 mt-2 border-t border-border-default flex gap-3">
 <button 
 type="button"
 onClick={onClose}
 className="flex-1 py-3 bg-hover-bg text-text-secondary rounded-xl text-[14px] hover:bg-selected-bg transition-colors"
 >
 取消
 </button>
 <button 
 type="submit"
 className="flex-1 py-3 bg-btn-main text-white rounded-xl text-[14px] hover:bg-btn-main transition-colors shadow-lg shadow-neutral-200"
 >
 确认新增
 </button>
 </div>
 </form>
 ) : (
 <div className="p-8 pt-6 flex flex-col items-center">
 <div className="text-center mb-6">
 <h3 className="text-[16px] font-semibold text-text-main mb-1">分享让商家扫码加入</h3>
 <p className="text-[13px] text-text-tertiary">扫码自动绑定为您名下的商家</p>
 </div>
 <div className="w-48 h-48 bg-page-bg rounded-xl border-2 border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-4 relative group cursor-pointer hover:border-primary-300 hover:bg-brand-light transition-colors cursor-pointer">
 <QrCode size={48} className="mb-2 text-neutral-300 group-hover:text-primary-400 transition-colors" />
 <span className="text-[12px] text-center">专属邀请二维码<br/>将在生成后显示</span>
 <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
 <button className="px-4 py-2 bg-btn-main text-white rounded-lg text-[13px] shadow-lg shadow-primary-500/30 flex items-center gap-2">
 <Download size={14} /> 保存图片
 </button>
 </div>
 </div>

 <div className="w-full mt-8 space-y-3">
 <div className="flex gap-2">
 <div className="flex-1 h-11 bg-page-bg border border-border-default rounded-xl flex items-center px-4 font-mono text-[12px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
 https://taptik.com/invite/m/E28A9F
 </div>
 <button className="h-11 px-4 bg-hover-bg text-text-secondary rounded-xl text-[13px] hover:bg-selected-bg transition-colors flex items-center gap-2 shrink-0">
 <Copy size={14} /> 复制
 </button>
 </div>
 </div>
 </div>
 )}
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
