import React from 'react';
import { 
 User, Mail, Phone, Calendar, Shield, 
 MapPin, Globe, CreditCard, Lock, Edit3,
 ExternalLink, Copy, CheckCircle2
} from 'lucide-react';

export const AccountDetails: React.FC = () => {
 return (
 <div className="flex flex-col h-full bg-page-bg p-8">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h2 className="text-[20px] font-semibold text-text-main tracking-tight">商家账号详情</h2>
 <p className="text-[13px] text-text-tertiary uppercase tracking-wider mt-1">商家身份与配置</p>
 </div>
 <button className="px-6 py-2.5 bg-neutral-0 border border-border-default rounded-xl text-[13px] hover:bg-page-bg flex items-center gap-2">
 <Edit3 size={18}/> 编辑资料
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 {/* Basic Info */}
 <div className="bg-surface-1 rounded-[32px] border border-border-default p-8 shadow-sm">
 <h3 className="text-[16px] font-semibold text-text-main mb-6 flex items-center gap-2">
 <User size={20} className="text-brand-logo" /> 基础信息
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5 focus:text-brand-logo">商家名称</label>
 <p className="text-[15px] text-text-main">test shop</p>
 </div>
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5">唯一 ID (UUID)</label>
 <div className="flex items-center gap-2">
 <p className="text-[15px] font-mono text-text-tertiary">5-AD-9012-X</p>
 <button className="text-neutral-300 hover:text-brand-logo"><Copy size={14}/></button>
 </div>
 </div>
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5 focus:text-brand-logo">电子邮箱</label>
 <p className="text-[15px] text-text-main">test@shop.com</p>
 </div>
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5 focus:text-brand-logo">联系电话</label>
 <p className="text-[15px] text-text-main">138****0001</p>
 </div>
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5 focus:text-brand-logo">所在地区</label>
 <p className="text-[15px] text-text-main flex items-center gap-1"><MapPin size={14} className="text-neutral-300"/> 广东 广州</p>
 </div>
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5 focus:text-brand-logo">创建时间</label>
 <p className="text-[15px] text-text-main flex items-center gap-1"><Calendar size={14} className="text-neutral-300"/> 2026-03-30 10:19:45</p>
 </div>
 </div>
 </div>

 {/* Security & Token */}
 <div className="bg-surface-1 rounded-[32px] border border-border-default p-8 shadow-sm">
 <h3 className="text-[16px] font-semibold text-text-main mb-6 flex items-center gap-2">
 <Shield size={20} className="text-brand-logo" /> 安全与接入
 </h3>
 <div className="space-y-6">
 <div className="flex items-center justify-between p-4 bg-page-bg rounded-xl border border-border-default">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-surface-1 rounded-xl flex items-center justify-center shadow-sm"><Lock size={20} className="text-text-tertiary"/></div>
 <div>
 <p className="text-[14px] text-text-main">API 访问 Token</p>
 <p className="text-[13px] text-text-tertiary uppercase tracking-tighter">用于全链路流水线数据回调</p>
 </div>
 </div>
 <div className="flex gap-2">
 <button className="px-4 py-2 bg-btn-main text-white rounded-lg text-[13px] ">重置 Token</button>
 <button className="p-2 bg-surface-1 border border-border-default rounded-lg text-text-tertiary hover:text-text-main"><Copy size={18}/></button>
 </div>
 </div>
 <div className="flex items-center justify-between p-4 bg-page-bg rounded-xl border border-border-default">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-surface-1 rounded-xl flex items-center justify-center shadow-sm"><Globe size={20} className="text-text-tertiary"/></div>
 <div>
 <p className="text-[14px] text-text-main">回调 Webhook</p>
 <p className="text-[13px] text-text-tertiary uppercase tracking-tighter">暂无配置响应地址</p>
 </div>
 </div>
 <button className="px-4 py-2 border border-border-default text-text-main rounded-lg text-[13px] hover:bg-hover-bg text-brand-logo transition-colors">配置地址</button>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-8">
 {/* Subscription Status */}
 <div className="bg-btn-main text-white rounded-[32px] p-8 relative overflow-hidden">
 <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-btn-main/20 rounded-full blur-3xl opacity-50" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-8">
 <div className="w-12 h-12 bg-surface-1/10 rounded-xl flex items-center justify-center border border-white/10"><CreditCard size={24} className="text-primary-400"/></div>
 <span className="px-3 py-1 bg-btn-main text-white text-[13px] rounded-lg uppercase tracking-widest">至尊版</span>
 </div>
 <h4 className="text-[20px] font-semibold mb-2">服务有效期</h4>
 <p className="text-[13px] text-white/40 font-medium mb-6">该商家当前版本为 [旗舰版]</p>
 
 <div className="space-y-4 mb-8">
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-white/60 font-medium text-primary-400">距离到期还剩</span>
 <span className="">124 天</span>
 </div>
 <div className="h-1.5 bg-surface-1/10 rounded-full overflow-hidden">
 <div className="h-full bg-btn-main w-[70%]" />
 </div>
 </div>

 <button className="w-full py-3 bg-surface-1 text-text-main rounded-xl text-[13px] flex items-center justify-center gap-2 hover:bg-hover-bg transition-all">
 续费升级 <ExternalLink size={16}/>
 </button>
 </div>
 </div>

 {/* Logs or Stats */}
 <div className="bg-surface-1 rounded-[32px] border border-border-default p-8 shadow-sm">
 <h3 className="text-[14px] font-semibold text-text-main mb-6">最近操作轨迹</h3>
 <div className="space-y-6">
 {[
 { action: '重置 API Token', time: '2小时前', icon: Lock },
 { action: '更新基础资料', time: '1天前', icon: User },
 { action: '上传夏季海报包', time: '3天前', icon: CheckCircle2 }
 ].map((item, i) => (
 <div key={i} className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-page-bg flex items-center justify-center shrink-0"><item.icon size={14} className="text-text-tertiary"/></div>
 <div>
 <p className="text-[13px] text-text-main">{item.action}</p>
 <p className="text-[13px] text-text-tertiary ">{item.time}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
