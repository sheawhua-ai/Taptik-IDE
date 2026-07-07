import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Receipt, Wallet, Banknote, ArrowRight } from 'lucide-react';

interface FinancePanelModalProps {
 isOpen: boolean;
 onClose: () => void;
 userRole: "merchant" | "provider" | "creator";
}

export const FinancePanelModal: React.FC<FinancePanelModalProps> = ({ 
 isOpen, 
 onClose,
 userRole
}) => {
 const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');
 const [activeProviderTab, setActiveProviderTab] = useState<'dashboard' | 'history' | 'withdraw'>('dashboard');
 const [providerTopTab, setProviderTopTab] = useState<'income' | 'credits'>('income');

 if (!isOpen) return null;

 const formatRMB = (val: number) => `¥ ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
 const formatCredits = (val: number) => val.toLocaleString();

 const renderCreditsView = () => (
 <>
 <div className="p-8 pb-4">
 <div className="bg-neutral-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl shadow-neutral-900/20">
 <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -tranneutral-y-1/2 tranneutral-x-1/3"></div>
 <div className="relative z-10 flex items-center justify-between">
 <div>
 <div className="text-[14px] text-neutral-400 mb-2 flex items-center gap-2">
 <Sparkles size={16} className="text-primary-400" /> 当前积分余额
 </div>
 <div className="flex items-end gap-3 tracking-tight">
 <span className="text-[48px] leading-none">{formatCredits(3056)}</span>
 <span className="text-[16px] text-neutral-400 mb-2 font-mono">≈ {formatRMB(305.60)}</span>
 </div>
 </div>
 <button className="px-6 py-3 bg-white text-neutral-900 rounded-xl text-[14px] hover:bg-neutral-100 transition-colors shadow-sm">
 兑换码充值
 </button>
 </div>
 </div>
 </div>

 <div className="px-8 flex p-1 bg-neutral-100 rounded-xl w-fit mx-8 mt-2 mb-6">
 <button 
 onClick={() => setActiveTab('recharge')}
 className={`px-6 py-2 text-[13px] rounded-lg transition-all ${activeTab === 'recharge' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 充值额度
 </button>
 <button 
 onClick={() => setActiveTab('history')}
 className={`px-6 py-2 text-[13px] rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 消费流水
 </button>
 </div>

 <div className="px-8 pb-8">
 {activeTab === 'recharge' ? (
 <div className="grid grid-cols-3 gap-4">
 {[
 { credits: 1000, price: 99, bonus: 0 },
 { credits: 5000, price: 469, bonus: 500 },
 { credits: 10000, price: 899, bonus: 1500, recommend: true },
 { credits: 50000, price: 3999, bonus: 10000 },
 ].map((plan, idx) => (
 <div key={idx} className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${plan.recommend ? 'border-primary-500 bg-primary-50/30' : 'border-neutral-100 bg-white hover:border-neutral-200'}`}>
 {plan.recommend && (
 <div className="absolute -top-3.5 left-1/2 -tranneutral-x-1/2 px-3 py-1 bg-primary-500 text-white text-[11px] rounded-full shadow-sm">
 推荐套餐
 </div>
 )}
 <div className="text-[24px] text-neutral-900 mb-1 flex items-center justify-center gap-1.5">
 {formatCredits(plan.credits)} <span className="text-[14px]">Cr</span>
 </div>
 {plan.bonus > 0 && (
 <div className="text-[12px] text-primary-500 text-center mb-4">
 加赠 {formatCredits(plan.bonus)} Cr
 </div>
 )}
 {!plan.bonus && <div className="h-6 mb-4"></div>}
 <button className={`w-full py-2.5 rounded-xl text-[14px] transition-colors ${plan.recommend ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
 {formatRMB(plan.price)}
 </button>
 <div className="text-center text-[10px] text-neutral-400 mt-3 font-mono">
 折算率 1:{((plan.credits + plan.bonus) / plan.price).toFixed(1)}
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="space-y-3">
 {[
 { title: '助手交互消耗', time: '2026-06-21 14:30', amount: -15, type: 'consume' },
 { title: '知识库向量化', time: '2026-06-21 10:15', amount: -120, type: 'consume' },
 { title: '充值: 推荐套餐', time: '2026-06-20 18:00', amount: 11500, type: 'recharge' },
 { title: '每日签到奖励', time: '2026-06-20 08:00', amount: 150, type: 'reward' },
 ].map((sh, idx) => (
 <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
 <div className="flex items-center gap-4">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sh.type === 'consume' ? 'bg-neutral-200 text-neutral-600' : 'bg-neutral-200 text-neutral-900'}`}>
 {sh.type === 'consume' ? <Receipt size={18} /> : <Banknote size={18} />}
 </div>
 <div>
 <div className="text-[14px] text-neutral-900">{sh.title}</div>
 <div className="text-[12px] text-neutral-500">{sh.time}</div>
 </div>
 </div>
 <div className="text-right">
 <div className={`text-[16px] font-mono ${sh.amount > 0 ? 'text-neutral-900' : 'text-neutral-900'}`}>
 {sh.amount > 0 ? '+' : ''}{sh.amount} Cr
 </div>
 {sh.amount < 0 && (
 <div className="text-[11px] text-neutral-400 font-mono">≈ {formatRMB(Math.abs(sh.amount) / 10)}</div>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </>
 );

 const renderIncomeView = () => (
 <>
 <div className="p-8 pb-4">
 <div className="bg-gradient-to-br from-[#E63560] to-[#501024] text-white p-8 rounded-3xl relative overflow-hidden shadow-xl shadow-primary-500/20">
 <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -tranneutral-y-1/2 tranneutral-x-1/3"></div>
 <div className="relative z-10 flex items-center justify-between">
 <div>
 <div className="text-[14px] text-primary-100 mb-2 flex items-center gap-2">
 <Wallet size={16} /> 可提现余额
 </div>
 <div className="flex items-end gap-3 tracking-tight">
 <span className="text-[48px] leading-none">{formatRMB(12500)}</span>
 </div>
 <div className="mt-4 flex gap-4 text-[13px] text-primary-100">
 <div>本月预估收入: {formatRMB(3420)}</div>
 <div>累计已提现: {formatRMB(89000)}</div>
 </div>
 </div>
 <button 
 onClick={() => setActiveProviderTab('withdraw')}
 className="px-8 py-3 bg-white text-[#CC1E4A] rounded-xl text-[14px] hover:bg-neutral-50 transition-colors shadow-sm"
 >
 申请提现
 </button>
 </div>
 </div>
 </div>

 <div className="px-8 flex p-1 bg-neutral-100 rounded-xl w-fit mx-8 mt-2 mb-6">
 <button 
 onClick={() => setActiveProviderTab('dashboard')}
 className={`px-6 py-2 text-[13px] rounded-lg transition-all ${activeProviderTab === 'dashboard' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 分账明细
 </button>
 <button 
 onClick={() => setActiveProviderTab('withdraw')}
 className={`px-6 py-2 text-[13px] rounded-lg transition-all ${activeProviderTab === 'withdraw' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 提现记录
 </button>
 </div>

 <div className="px-8 pb-8">
 {activeProviderTab === 'dashboard' && (
 <div className="space-y-3">
 {[
 { title: '下属商家充值分润 (宠物食品旗舰店)', time: '2026-06-20 18:00', amount: 269.70, status: '已结算' },
 { title: '下属商家充值分润 (美妆小店)', time: '2026-06-19 14:20', amount: 1199.70, status: '已结算' },
 { title: '系统技术服务费返还', time: '2026-06-15 09:00', amount: 50.00, status: '已结算' },
 ].map((sh, idx) => (
 <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-50 text-primary-500">
 <Banknote size={18} />
 </div>
 <div>
 <div className="text-[14px] text-neutral-900">{sh.title}</div>
 <div className="text-[12px] text-neutral-500 flex gap-2">
 <span>{sh.time}</span>
 <span className="text-neutral-900 bg-neutral-100 px-1.5 rounded">{sh.status}</span>
 </div>
 </div>
 </div>
 <div className="text-right text-[16px] font-mono text-neutral-900">
 +{formatRMB(sh.amount)}
 </div>
 </div>
 ))}
 </div>
 )}

 {activeProviderTab === 'withdraw' && (
 <div className="space-y-6">
 <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
 <div>
 <div className="text-[14px] text-neutral-900 mb-1">提现至对公账户</div>
 <div className="text-[12px] text-neutral-500">尾号 8892 · 中国工商银行</div>
 </div>
 <button className="text-[13px] text-primary-500 hover:text-primary-600">修改</button>
 </div>
 <div className="space-y-3">
 <div className="text-[14px] text-neutral-900 px-1">历史提现</div>
 {[
 { title: '余额提现', time: '2026-05-30 10:00', amount: 15000, status: '提现成功' },
 { title: '余额提现', time: '2026-04-28 15:30', amount: 22400, status: '提现成功' },
 ].map((sh, idx) => (
 <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-100 text-neutral-500">
 <ArrowRight size={18} />
 </div>
 <div>
 <div className="text-[14px] text-neutral-900">{sh.title}</div>
 <div className="text-[12px] text-neutral-500 flex gap-2">
 <span>{sh.time}</span>
 <span className="text-neutral-600 bg-neutral-100 px-1.5 rounded">{sh.status}</span>
 </div>
 </div>
 </div>
 <div className="text-right text-[16px] font-mono text-neutral-900">
 -{formatRMB(sh.amount)}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </>
 );

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
 className="relative w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 flex flex-col max-h-[85vh]"
 >
 <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-neutral-100 shrink-0">
 <div className="flex items-center gap-6">
 <div>
 <h2 className="text-[20px] font-semibold text-neutral-900 tracking-tight">
 {userRole === 'merchant' ? '积分充值与余额' : '财务中心'}
 </h2>
 <p className="text-[13px] text-neutral-500 mt-1">
 {userRole === 'merchant' 
 ? '为您的商家账号补充 Credits 积分' 
 : '管理您的可提现收益和模型消耗'}
 </p>
 </div>
 {userRole !== 'merchant' && (
 <div className="flex p-1 bg-neutral-100 rounded-xl h-10 items-center">
 <button 
 onClick={() => setProviderTopTab('income')}
 className={`px-4 h-full text-[13px] rounded-lg transition-all ${providerTopTab === 'income' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 💰 收益中心
 </button>
 <button 
 onClick={() => setProviderTopTab('credits')}
 className={`px-4 h-full text-[13px] rounded-lg transition-all ${providerTopTab === 'credits' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
 >
 ✨ 消耗积分 
 </button>
 </div>
 )}
 </div>
 <button 
 onClick={onClose}
 className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors self-start"
 >
 <X size={16} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto">
 {userRole === 'merchant' ? renderCreditsView() : (
 providerTopTab === 'income' ? renderIncomeView() : renderCreditsView()
 )}
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}

