import React, { useState } from 'react';
import { ShieldCheck, Lock, ChevronRight, Monitor, Settings, Command, Globe, CheckCircle2 } from 'lucide-react';

export const SecuritySettings = () => {
 const [sandboxEnabled, setSandboxEnabled] = useState(true);
 const [runtimeEnabled, setRuntimeEnabled] = useState(true);

 return (
 <div className="flex flex-col h-full space-y-6">
 <div className="flex justify-end mb-2">
 <div className="px-4 py-1.5 bg-hover-bg rounded-full text-[13px] text-text-secondary border border-border-default/50 shadow-sm">
 安全能力由本地运行时提供
 </div>
 </div>

 <p className="text-[14px] text-text-secondary mb-4 -mt-2">统一管理工作空间内的进程安全、数据安全与系统授权</p>

 <div className="grid grid-cols-2 gap-6 w-full">
 {/* Sandbox Security Box */}
 <div className="border border-border-default rounded-xl bg-surface-1 overflow-hidden shadow-sm flex flex-col relative z-0">
 <div className="p-5 border-b border-border-default bg-page-bg flex items-center justify-between">
 <div className="flex items-center gap-2">
 <ShieldCheck size={18} className="text-brand-logo" />
 <span className="text-[15px] text-text-main">沙箱安全</span>
 </div>
 <div className="flex items-center gap-3">
 <span className="w-5 h-5 rounded-full border border-border-default flex items-center justify-center text-[13px] text-text-tertiary bg-surface-1">?</span>
 <button 
 onClick={() => setSandboxEnabled(!sandboxEnabled)}
 className={`relative w-11 h-6 rounded-full transition-colors ${sandboxEnabled ? 'bg-btn-main' : 'bg-neutral-300'}`}
 >
 <div className={`absolute top-1 left-1 bg-surface-1 w-4 h-4 rounded-full transition-transform ${sandboxEnabled ? 'tranneutral-x-5' : 'tranneutral-x-0'}`} />
 </button>
 </div>
 </div>
 <div className="flex-1 p-5 space-y-6">
 <p className="text-[13px] text-text-tertiary leading-snug">智能 运行于隔离沙箱，并配置指令、网络访问策略</p>
 
 <div className="space-y-4">
 <button className="w-full flex items-center justify-between py-2 group">
 <div className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-page-bg flex items-center justify-center text-text-tertiary border border-border-default shrink-0">
 <Lock size={16} />
 </div>
 <div className="text-left py-0.5">
 <div className="text-[14px] text-text-main mb-0.5">文件安全</div>
 <div className="text-[13px] text-text-tertiary leading-snug">为沙箱拦截后的文件夹路径配置白名单和黑名单</div>
 </div>
 </div>
 <ChevronRight size={16} className="text-neutral-300 group-hover:text-text-tertiary" />
 </button>

 <button className="w-full flex items-center justify-between py-2 group">
 <div className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-page-bg flex items-center justify-center text-text-tertiary border border-border-default shrink-0">
 <Command size={16} />
 </div>
 <div className="text-left py-0.5">
 <div className="text-[14px] text-text-main mb-0.5">命令安全</div>
 <div className="text-[13px] text-text-tertiary leading-snug">为命令前缀配置询问和放行名单</div>
 </div>
 </div>
 <ChevronRight size={16} className="text-neutral-300 group-hover:text-text-tertiary" />
 </button>

 <button className="w-full flex items-center justify-between py-2 group">
 <div className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-page-bg flex items-center justify-center text-text-tertiary border border-border-default shrink-0">
 <Globe size={16} />
 </div>
 <div className="text-left py-0.5">
 <div className="text-[14px] text-text-main mb-0.5">网络安全</div>
 <div className="text-[13px] text-text-tertiary leading-snug">控制 URL 访问与沙箱网络名规则</div>
 </div>
 </div>
 <ChevronRight size={16} className="text-neutral-300 group-hover:text-text-tertiary" />
 </button>
 </div>
 </div>
 </div>

 {/* Data Security Box */}
 <div className="border border-border-default rounded-xl bg-[#f8fafc] overflow-hidden shadow-sm flex flex-col relative z-0">
 <div className="p-5 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Lock size={18} className="text-text-main" />
 <span className="text-[15px] text-text-main">数据安全</span>
 </div>
 </div>
 <div className="flex-1 p-5 pt-0 space-y-6">
 <p className="text-[13px] text-text-tertiary leading-snug mb-2">数据流转过程中的安全防护</p>
 
 <div className="space-y-4">
 <div className="bg-surface-1 border border-border-default rounded-xl p-4 flex items-start gap-4">
 <Settings size={18} className="text-text-tertiary mt-0.5" />
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[14px] text-text-main">安全网关</span>
 <span className="px-2 py-0.5 bg-hover-bg text-text-main rounded text-[13px] border border-border-default">已开启</span>
 </div>
 <div className="text-[13px] text-text-tertiary">工作空间出入流量统一经过安全网关安全处理</div>
 </div>
 </div>

 <div className="bg-surface-1 border border-border-default rounded-xl p-4 flex items-start gap-4">
 <Lock size={18} className="text-text-tertiary mt-0.5" />
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[14px] text-text-main">传输加密</span>
 <span className="px-2 py-0.5 bg-hover-bg text-text-main rounded text-[13px] border border-border-default">已开启</span>
 </div>
 <div className="text-[13px] text-text-tertiary">本地与云端通信使用端到端加密通道</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* System Level Tools Box */}
 <div className="border flex items-center justify-between border-border-default rounded-xl bg-surface-1 p-5 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-logo shrink-0">
 <Monitor size={20} />
 </div>
 <div>
 <h4 className="text-[15px] font-semibold text-text-main mb-1">系统级工具</h4>
 <p className="text-[13px] text-text-tertiary">WSL、wmic、sc、reg、schtasks 等系统级工具可绕过沙箱限制，请谨慎启用</p>
 </div>
 </div>
 <select className="border border-border-default bg-surface-1 px-4 py-2 rounded-lg text-[13px] text-text-secondary outline-none focus:border-primary-500 shadow-sm cursor-pointer min-w-[100px]">
 <option>禁用</option>
 <option>启用</option>
 </select>
 </div>

 {/* Built-in Runtime Box */}
 <div className="border border-border-default rounded-xl bg-surface-1 shadow-sm overflow-hidden">
 <div className="p-5 flex items-center justify-between border-b border-border-default">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-hover-bg rounded-lg flex items-center justify-center text-text-main shrink-0">
 <ShieldCheck size={18} />
 </div>
 <div>
 <h4 className="text-[15px] font-semibold text-text-main mb-0.5">内置运行时</h4>
 <p className="text-[13px] text-text-tertiary">允许使用随包提供的 Node.js、Python 和 Git Bash 工具</p>
 </div>
 </div>
 <button 
 onClick={() => setRuntimeEnabled(!runtimeEnabled)}
 className={`relative w-11 h-6 rounded-full transition-colors ${runtimeEnabled ? 'bg-btn-main' : 'bg-neutral-300'}`}
 >
 <div className={`absolute top-1 left-1 bg-surface-1 w-4 h-4 rounded-full transition-transform ${runtimeEnabled ? 'tranneutral-x-5' : 'tranneutral-x-0'}`} />
 </button>
 </div>
 
 <table className="w-full text-left text-[13px]">
 <thead className="bg-page-bg text-text-tertiary text-[13px]">
 <tr>
 <th className=" py-3 px-6 w-1/4">工具</th>
 <th className=" py-3 px-6 w-1/2">说明</th>
 <th className=" py-3 px-6 text-right">状态</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-neutral-100">
 <tr className="hover:bg-page-bg">
 <td className="py-4 px-6 text-text-main flex items-center gap-2">
 <span className="text-[#3776AB]">Python</span>
 </td>
 <td className="py-4 px-6 text-text-tertiary leading-snug">通用编程语言，适用于脚本编写、自动化和数据处理</td>
 <td className="py-4 px-6 text-right">
 <button 
 className={`relative w-11 h-6 rounded-full transition-colors inline-block align-middle bg-btn-main`}
 >
 <div className={`absolute top-1 left-1 bg-surface-1 w-4 h-4 rounded-full transition-transform tranneutral-x-5`} />
 </button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
};
