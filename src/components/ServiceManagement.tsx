import React from 'react';
import { 
 Users, UserPlus, QrCode, Clipboard, Download, 
 Search, MoreHorizontal, Settings, ExternalLink,
 ShieldCheck, ArrowUpRight, BarChart3, CheckCircle2,
 Lock, Mail, Phone, Calendar, Info, SlidersHorizontal, Plus,
 LayoutGrid, ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';

// Import split components
import { SchemeManager } from './merchant/SchemeManager';
import { AssetManager } from './merchant/AssetManager';
import { StaffManager } from './merchant/StaffManager';
import { AccountDetails } from './merchant/AccountDetails';
import { TaskList } from './merchant/TaskList';

interface SubMerchant {
 id: string;
 name: string;
 email: string;
 phone: string;
 status: 'active' | 'pending' | 'inactive';
 role: string;
 createdAt: string;
 lastActive: string;
}

const MOCK_MERCHANTS: SubMerchant[] = [
 {
 id: '5',
 name: 'test shop',
 email: 'test@shop.com',
 phone: '138****0001',
 status: 'active',
 role: '商户',
 createdAt: '2026-03-30 10:19:45',
 lastActive: '2小时前'
 }
];

interface ServiceManagementProps {
 onSelectMerchant?: (merchant: SubMerchant) => void;
 selectedMerchant?: SubMerchant | null;
 onBack?: () => void;
}

export const ServiceManagement: React.FC<ServiceManagementProps> = ({ 
 onSelectMerchant: externalOnSelect, 
 selectedMerchant: externalSelected, 
 onBack: externalOnBack 
}) => {
 const [internalSelected, setInternalSelected] = React.useState<SubMerchant | null>(null);
 
 const selectedMerchant = externalSelected !== undefined ? externalSelected : internalSelected;
 const onSelectMerchant = externalOnSelect || setInternalSelected;
 const onBack = externalOnBack || (() => setInternalSelected(null));

 const [activeTab, setActiveTab] = React.useState<'merchants' | 'team'>('merchants');
 const [detailTab, setDetailTab] = React.useState('account');
 const registerUrl = "https://tap.topyuncang.com/login?age=your_id";

 if (selectedMerchant) {
 // ... (rest of the Detail view remains same for now)
 return (
 <div className="flex-1 flex flex-col bg-page-bg h-full overflow-hidden">
 {/* Detail Context Header */}
 <div className="bg-neutral-0 border-b border-border-default px-8 py-5 shrink-0 flex items-center justify-between shadow-sm z-10">
 <div className="flex items-center gap-6">
 <button onClick={onBack} className="p-2.5 hover:bg-hover-bg rounded-xl transition-all text-text-tertiary group">
 <ChevronLeft size={20} className="group-hover:text-text-main"/>
 </button>
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-logo text-[13px]">
 {selectedMerchant.name[0]?.toUpperCase()}
 </div>
 <div>
 <div className="flex items-center gap-3">
 <h1 className="text-[17px] font-semibold text-text-main tracking-tight">{selectedMerchant.name}</h1>
 <span className="px-1.5 py-0.5 bg-hover-bg text-text-tertiary text-[13px] rounded uppercase">uuid: {selectedMerchant.id}</span>
 </div>
 <p className="text-[13px] text-text-tertiary uppercase tracking-wider mt-0.5">正在管理该商家数据与资产</p>
 </div>
 </div>
 </div>

 <div className="flex items-center bg-page-bg p-1.5 rounded-xl border border-border-default">
 {[
 { id: 'account', name: '账号详情' },
 { id: 'staff', name: '员工与权限' },
 ].map(tab => (
 <button 
 key={tab.id}
 onClick={() => setDetailTab(tab.id)}
 className={`px-4 py-2 rounded-xl text-[13px] transition-all ${detailTab === tab.id ? 'bg-btn-main text-white shadow-lg' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 {tab.name}
 </button>
 ))}
 </div>
 </div>

 <div className="flex-1 overflow-y-auto custom-scrollbar">
 {detailTab === 'account' && <AccountDetails />}
 {detailTab === 'staff' && <StaffManager />}
 </div>
 </div>
 );
 }

 return (
 <div className="flex-1 flex flex-col bg-page-bg h-full overflow-hidden">
 {/* Management Header */}
 <div className="h-20 bg-neutral-0 border-b border-border-default flex items-center justify-between px-8 shrink-0">
 <div className="flex items-center gap-10">
 <div className="flex items-center gap-4 border-r border-border-default pr-8">
 <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-logo shadow-sm">
 <ShieldCheck size={24} />
 </div>
 <h1 className="text-[18px] font-semibold text-text-main tracking-tight">管理中心</h1>
 </div>
 
 <nav className="flex items-center gap-8">
 <button 
 onClick={() => setActiveTab('merchants')}
 className={`text-[15px] relative py-7 transition-all ${activeTab === 'merchants' ? 'text-text-main' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 商家管理
 {activeTab === 'merchants' && <motion.div layoutId="manageTab" className="absolute bottom-0 left-0 right-0 h-1 bg-btn-main rounded-t-full" />}
 </button>
 <button 
 onClick={() => setActiveTab('team')}
 className={`text-[15px] relative py-7 transition-all ${activeTab === 'team' ? 'text-text-main' : 'text-text-tertiary hover:text-text-secondary'}`}
 >
 组织管理
 {activeTab === 'team' && <motion.div layoutId="manageTab" className="absolute bottom-0 left-0 right-0 h-1 bg-btn-main rounded-t-full" />}
 </button>
 </nav>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-hover-bg text-success-700 rounded-xl border border-success-100">
 <span className="text-[13px] ">飞书集成: 正常运行中</span>
 <div className="w-2 h-2 rounded-full bg-btn-main animate-pulse" />
 </div>
 <button className="p-2.5 bg-neutral-0 border border-border-default rounded-xl text-text-tertiary hover:text-text-main transition-all">
 <Settings size={20}/>
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
 <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
 
 {activeTab === 'merchants' && (
 <>
 {/* Invitation & Stats Cards */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 bg-neutral-0 rounded-[32px] border border-border-default shadow-sm p-8 relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
 <QrCode size={160} />
 </div>
 <div className="relative z-10">
 <div className="flex items-center gap-2 mb-2">
 <h2 className="text-[20px] font-semibold text-text-main tracking-tight">专属商家入驻引擎</h2>
 <span className="px-2 py-0.5 bg-hover-bg text-text-main text-[13px] rounded-lg">绑定分销 ID</span>
 </div>
 <p className="text-[14px] text-text-tertiary font-medium mb-8 max-w-lg">
 系统已根据您的代理商 ID 自动生成入驻入口。新商家注册后将自动获得您的「业务模板库」共享权限。
 </p>
 <div className="flex flex-col md:flex-row gap-8 items-center">
 <div className="bg-neutral-0 p-4 border border-border-default rounded-2xl shadow-xl">
 <div className="w-40 h-40 bg-page-bg rounded-xl flex items-center justify-center border border-border-default p-2">
 <QrCode size={120} className="text-text-main" />
 </div>
 <button className="w-full mt-4 py-2 text-[13px] text-brand-logo hover:bg-brand-light rounded-lg transition-colors border border-primary-50 flex items-center justify-center gap-2">
 <Download size={14} /> 保存商家码
 </button>
 </div>
 <div className="flex-1 w-full space-y-6">
 <div>
 <label className="text-[13px] text-text-tertiary uppercase tracking-widest block mb-1.5">入驻短链</label>
 <div className="flex gap-2">
 <div className="flex-1 bg-page-bg border border-border-default rounded-xl px-4 py-3 text-[14px] font-mono text-text-secondary truncate">
 {registerUrl}
 </div>
 <button className="px-5 bg-btn-main text-white rounded-xl text-[13px] hover:bg-btn-main transition-all flex items-center gap-2 shrink-0">
 <Clipboard size={16}/> 复制
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-btn-main rounded-[32px] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
 <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-btn-main/10 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform"></div>
 <div className="relative z-10">
 <BarChart3 size={32} className="text-brand-logo mb-8" />
 <h3 className="text-[24px] font-semibold leading-tight mb-2">本月商家业绩</h3>
 <p className="text-[13px] text-white/40 mb-8">数据中心聚合监控</p>
 <div className="space-y-4">
 <div className="flex justify-between items-end border-b border-white/10 pb-4">
 <span className="text-[13px] text-white/60 text-left">活跃商家</span>
 <span className="text-[24px] ">42</span>
 </div>
 <div className="flex justify-between items-end border-b border-white/10 pb-4">
 <span className="text-[13px] text-white/60 text-left">积分消耗</span>
 <span className="text-[24px] ">12.5k</span>
 </div>
 </div>
 </div>
 <button className="w-full mt-8 py-3.5 bg-surface-1 text-text-main rounded-xl text-[13px] flex items-center justify-center gap-2 hover:bg-brand-light transition-all shadow-xl">
 进入财务明细 <ArrowUpRight size={16}/>
 </button>
 </div>
 </div>

 {/* Merchant Table */}
 <div className="bg-neutral-0 rounded-[32px] border border-border-default shadow-sm overflow-hidden">
 <div className="p-8 border-b border-border-default flex items-center justify-between">
 <div className="flex items-center gap-4">
 <h2 className="text-[18px] font-semibold text-text-main tracking-tight">所有下线商家</h2>
 <div className="px-2 py-0.5 bg-hover-bg rounded-lg text-[13px] text-text-tertiary">活跃使用 / 活跃商家</div>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -tranneutral-y-1/2 text-text-tertiary" />
 <input placeholder="搜索商家 ID..." className="pl-10 pr-4 py-2.5 bg-page-bg border border-border-default rounded-xl text-[13px] w-64 outline-none focus:border-primary-500" />
 </div>
 <button className="px-5 py-2.5 bg-btn-main text-white rounded-xl text-[13px] shadow-lg">直接手动开号</button>
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-page-bg text-[13px] text-text-tertiary uppercase tracking-widest border-b border-border-default">
 <th className="px-8 py-4">标识库</th>
 <th className="px-8 py-4">商家品牌名称</th>
 <th className="px-8 py-4">账号信息</th>
 <th className="px-8 py-4">状态</th>
 <th className="px-8 py-4">关键指标 (本月)</th>
 <th className="px-8 py-4 text-right">操作</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-neutral-100">
 {MOCK_MERCHANTS.map(m => (
 <tr key={m.id} className="hover:bg-page-bg transition-colors">
 <td className="px-8 py-5 font-mono text-[13px] text-text-tertiary">#{m.id}</td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 bg-hover-bg rounded-xl flex items-center justify-center text-text-tertiary">商</div>
 <span className="text-[14px] text-text-main">{m.name}</span>
 </div>
 </td>
 <td className="px-8 py-5">
 <div className="flex flex-col gap-0.5">
 <span className="text-[13px] text-text-secondary">{m.email}</span>
 <span className="text-[13px] text-text-tertiary ">{m.phone}</span>
 </div>
 </td>
 <td className="px-8 py-5">
 <span className="px-2.5 py-1 bg-hover-bg text-text-main text-[13px] rounded-lg border border-success-100">活跃商户</span>
 </td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-4">
 <div className="text-center">
 <p className="text-[13px] text-text-tertiary uppercase">当前余额</p>
 <p className="text-[13px] text-text-main">5,420</p>
 </div>
 <div className="w-px h-6 bg-hover-bg" />
 <div className="text-center">
 <p className="text-[13px] text-text-tertiary uppercase">爆文数</p>
 <p className="text-[13px] text-text-main">82</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-5 text-right">
 <button onClick={() => onSelectMerchant(m)} className="text-[13px] text-brand-logo hover:bg-brand-light px-4 py-2 rounded-xl transition-all">进入管理 &rarr;</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </>
 )}

 {activeTab === 'team' && (
 <div className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div className="bg-surface-1 p-6 rounded-2xl border border-border-default">
 <p className="text-[13px] text-text-tertiary uppercase mb-1">团队成员</p>
 <p className="text-2xl text-text-main">18 <span className="text-[13px] text-neutral-300">/ 无限制</span></p>
 </div>
 <div className="bg-surface-1 p-6 rounded-2xl border border-border-default">
 <p className="text-[13px] text-text-tertiary uppercase mb-1">飞书账号映射</p>
 <p className="text-2xl text-text-main">12 个</p>
 </div>
 <div className="bg-surface-1 p-6 rounded-2xl border border-border-default">
 <p className="text-[13px] text-text-tertiary uppercase mb-1">当前并发任务数</p>
 <p className="text-2xl text-brand-logo">5 / 20</p>
 </div>
 </div>

 <div className="bg-surface-1 rounded-[32px] border border-border-default overflow-hidden shadow-sm">
 <div className="p-8 border-b border-border-default flex items-center justify-between bg-page-bg">
 <div>
 <h2 className="text-[18px] font-semibold text-text-main tracking-tight">组织成员与权限</h2>
 <p className="text-[13px] text-text-tertiary italic mt-1">成员自动通过飞书/钉钉 SSO 鉴权与流转</p>
 </div>
 <button className="px-6 py-3 bg-btn-main text-white rounded-xl text-[13px] shadow-lg flex items-center gap-2">
 <Users size={18}/> 批量导入系统成员
 </button>
 </div>
 <div className="p-8">
 <div className="space-y-4">
 {[
 { name: 'hua xu', role: '超级管理员', email: 'owner@taptik.com', dept: '运营总部', status: 'online' },
 { name: '张经理', role: '商户运营', email: 'zhang@taptik.com', dept: '直营一部', status: 'away' },
 { name: '李组长', role: '策略分析', email: 'li@taptik.com', dept: '增长实验室', status: 'online' },
 ].map((user, i) => (
 <div key={i} className="flex items-center justify-between p-4 hover:bg-page-bg rounded-xl border border-transparent hover:border-border-default transition-all">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-hover-bg rounded-full flex items-center justify-center text-text-tertiary">{user.name[0]}</div>
 <div>
 <h4 className="text-[14px] font-semibold text-text-main">{user.name}</h4>
 <p className="text-[13px] text-text-tertiary ">{user.email}</p>
 </div>
 </div>
 <div className="flex-1 px-12">
 <span className="px-3 py-1 bg-hover-bg rounded-lg text-[13px] text-text-secondary">{user.role}</span>
 <span className="ml-4 text-[13px] text-text-tertiary">{user.dept}</span>
 </div>
 <div className="flex items-center gap-3">
 <button className="text-[13px] text-brand-logo hover:underline">编辑权限</button>
 <button className="text-[13px] text-neutral-300">禁用</button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

