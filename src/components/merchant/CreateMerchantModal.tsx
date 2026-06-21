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
                        <h2 className="text-[20px] font-black text-slate-900 tracking-tight">新增商家</h2>
                        <p className="text-[13px] font-bold text-slate-500 mt-1">创建下属商家账号并配置核心信息</p>
                     </div>
                     <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors self-start"
                     >
                        <X size={16} />
                     </button>
                  </div>

                  <div className="px-8 pt-4 pb-2">
                     <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button 
                           onClick={() => setActiveTab('manual')}
                           className={`flex-1 py-2 text-[13px] font-black rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           手动填写
                        </button>
                        <button 
                           onClick={() => setActiveTab('qr')}
                           className={`flex-1 py-2 text-[13px] font-black rounded-lg transition-all ${activeTab === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           分享二维码
                        </button>
                     </div>
                  </div>

                  {activeTab === 'manual' ? (
                     <form onSubmit={handleSubmit} className="p-8 pt-6 flex flex-col gap-5">
                        <div className="space-y-1.5">
                           <label className="text-[12px] font-black text-slate-700 ml-1">商家名称</label>
                           <div className="relative">
                              <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                 type="text" 
                                 required
                                 value={formData.merchantName}
                                 onChange={e => setFormData({...formData, merchantName: e.target.value})}
                                 placeholder="例如：宠物食品官方旗舰店"
                                 className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[12px] font-black text-slate-700 ml-1">负责人用户名</label>
                           <div className="relative">
                              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                 type="text" 
                                 required
                                 value={formData.username}
                                 onChange={e => setFormData({...formData, username: e.target.value})}
                                 placeholder="用于登录的用户名"
                                 className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[12px] font-black text-slate-700 ml-1">手机号码</label>
                           <div className="relative">
                              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                 type="tel" 
                                 required
                                 value={formData.phone}
                                 onChange={e => setFormData({...formData, phone: e.target.value})}
                                 placeholder="11位手机号码"
                                 className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[12px] font-black text-slate-700 ml-1">登录密码</label>
                           <div className="relative">
                              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                 type={showPassword ? 'text' : 'password'} 
                                 required
                                 value={formData.password}
                                 onChange={e => setFormData({...formData, password: e.target.value})}
                                 placeholder="不少于8位字符"
                                 className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none rounded-xl text-[14px] font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition-all"
                              />
                              <button 
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                           </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 flex gap-3">
                           <button 
                              type="button"
                              onClick={onClose}
                              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-200 transition-colors"
                           >
                              取消
                           </button>
                           <button 
                              type="submit"
                              className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[14px] font-black hover:bg-primary-500 transition-colors shadow-lg shadow-slate-200"
                           >
                              确认新增
                           </button>
                        </div>
                     </form>
                  ) : (
                     <div className="p-8 pt-6 flex flex-col items-center">
                        <div className="text-center mb-6">
                           <h3 className="text-[16px] font-black text-slate-900 mb-1">分享让商家扫码加入</h3>
                           <p className="text-[13px] text-slate-500">扫码自动绑定为您名下的商家</p>
                        </div>
                        <div className="w-48 h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 relative group cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
                           <QrCode size={48} className="mb-2 text-slate-300 group-hover:text-primary-400 transition-colors" />
                           <span className="text-[12px] font-bold text-center">专属邀请二维码<br/>将在生成后显示</span>
                           <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                               <button className="px-4 py-2 bg-primary-500 text-white font-bold rounded-lg text-[13px] shadow-lg shadow-primary-500/30 flex items-center gap-2">
                                  <Download size={14} /> 保存图片
                               </button>
                           </div>
                        </div>

                        <div className="w-full mt-8 space-y-3">
                           <div className="flex gap-2">
                              <div className="flex-1 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 font-mono text-[12px] text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                                 https://taptik.com/invite/m/E28A9F
                              </div>
                              <button className="h-11 px-4 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shrink-0">
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
