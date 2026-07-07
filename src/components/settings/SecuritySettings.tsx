import React, { useState } from 'react';
import { ShieldCheck, Lock, ChevronRight, Monitor, Settings, Command, Globe, CheckCircle2 } from 'lucide-react';

export const SecuritySettings = () => {
 const [sandboxEnabled, setSandboxEnabled] = useState(true);
 const [runtimeEnabled, setRuntimeEnabled] = useState(true);

 return (
 <div className="flex flex-col h-full space-y-6">
 <div className="flex justify-end mb-2">
 <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[12px] text-slate-600 border border-slate-200/50 shadow-sm">
 安全能力由本地运行时提供
 </div>
 </div>

 <p className="text-[14px] text-slate-600 mb-4 -mt-2">统一管理工作空间内的进程安全、数据安全与系统授权</p>

 <div className="grid grid-cols-2 gap-6 w-full">
 {/* Sandbox Security Box */}
 <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm flex flex-col relative z-0">
 <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <ShieldCheck size={18} className="text-primary-500" />
 <span className="text-[15px] text-slate-900">沙箱安全</span>
 </div>
 <div className="flex items-center gap-3">
 <span className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[12px] text-slate-400 bg-white">?</span>
 <button 
 onClick={() => setSandboxEnabled(!sandboxEnabled)}
 className={`relative w-11 h-6 rounded-full transition-colors ${sandboxEnabled ? 'bg-primary-500' : 'bg-slate-300'}`}
 >
 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${sandboxEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
 </button>
 </div>
 </div>
 <div className="flex-1 p-5 space-y-6">
 <p className="text-[13px] text-slate-500 leading-snug">智能 运行于隔离沙箱，并配置指令、网络访问策略</p>
 
 <div className="space-y-4">
 <button className="w-full flex items-center justify-between py-2 group">
 <div className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
 <Lock size={16} />
 </div>
 <div className="text-left py-0.5">
 <div className="text-[14px] text-slate-800 mb-0.5">文件安全</div>
 <div className="text-[12px] text-slate-400 leading-snug">为沙箱拦截后的文件夹路径配置白名单和黑名单</div>
 </div>
 </div>
 <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
 </button>

 <button className="w-full flex items-center justify-between py-2 group">
 <div className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
 <Command size={16} />
 </div>
 <div className="text-left py-0.5">
 <div className="text-[14px] text-slate-800 mb-0.5">命令安全</div>
 <div className="text-[12px] text-slate-400 leading-snug">为命令前缀配置询问和放行名单</div>
 </div>
 </div>
 <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
 </button>

 <button className="w-full flex items-center justify-between py-2 group">
 <div className="flex gap-4">
 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
 <Globe size={16} />
 </div>
 <div className="text-left py-0.5">
 <div className="text-[14px] text-slate-800 mb-0.5">网络安全</div>
 <div className="text-[12px] text-slate-400 leading-snug">控制 URL 访问与沙箱网络名规则</div>
 </div>
 </div>
 <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
 </button>
 </div>
 </div>
 </div>

 {/* Data Security Box */}
 <div className="border border-slate-200 rounded-2xl bg-[#f8fafc] overflow-hidden shadow-sm flex flex-col relative z-0">
 <div className="p-5 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Lock size={18} className="text-emerald-500" />
 <span className="text-[15px] text-slate-900">数据安全</span>
 </div>
 </div>
 <div className="flex-1 p-5 pt-0 space-y-6">
 <p className="text-[13px] text-slate-500 leading-snug mb-2">数据流转过程中的安全防护</p>
 
 <div className="space-y-4">
 <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4">
 <Settings size={18} className="text-slate-400 mt-0.5" />
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[14px] text-slate-800">安全网关</span>
 <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[11px] border border-emerald-100">已开启</span>
 </div>
 <div className="text-[12px] text-slate-500">工作空间出入流量统一经过安全网关安全处理</div>
 </div>
 </div>

 <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4">
 <Lock size={18} className="text-slate-400 mt-0.5" />
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[14px] text-slate-800">传输加密</span>
 <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[11px] border border-emerald-100">已开启</span>
 </div>
 <div className="text-[12px] text-slate-500">本地与云端通信使用端到端加密通道</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* System Level Tools Box */}
 <div className="border flex items-center justify-between border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
 <Monitor size={20} />
 </div>
 <div>
 <h4 className="text-[15px] font-semibold text-slate-900 mb-1">系统级工具</h4>
 <p className="text-[12px] text-slate-500">WSL、wmic、sc、reg、schtasks 等系统级工具可绕过沙箱限制，请谨慎启用</p>
 </div>
 </div>
 <select className="border border-slate-200 bg-white px-4 py-2 rounded-lg text-[13px] text-slate-700 outline-none focus:border-primary-500 shadow-sm cursor-pointer min-w-[100px]">
 <option>禁用</option>
 <option>启用</option>
 </select>
 </div>

 {/* Built-in Runtime Box */}
 <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
 <div className="p-5 flex items-center justify-between border-b border-slate-100">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
 <ShieldCheck size={18} />
 </div>
 <div>
 <h4 className="text-[15px] font-semibold text-slate-900 mb-0.5">内置运行时</h4>
 <p className="text-[12px] text-slate-500">允许使用随包提供的 Node.js、Python 和 Git Bash 工具</p>
 </div>
 </div>
 <button 
 onClick={() => setRuntimeEnabled(!runtimeEnabled)}
 className={`relative w-11 h-6 rounded-full transition-colors ${runtimeEnabled ? 'bg-primary-500' : 'bg-slate-300'}`}
 >
 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${runtimeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
 </button>
 </div>
 
 <table className="w-full text-left text-[13px]">
 <thead className="bg-slate-50 text-slate-500 text-[12px]">
 <tr>
 <th className=" py-3 px-6 w-1/4">工具</th>
 <th className=" py-3 px-6 w-1/2">说明</th>
 <th className=" py-3 px-6 text-right">状态</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 <tr className="hover:bg-slate-50/50">
 <td className="py-4 px-6 text-slate-800 flex items-center gap-2">
 <span className="text-[#3776AB]">Python</span>
 </td>
 <td className="py-4 px-6 text-slate-500 leading-snug">通用编程语言，适用于脚本编写、自动化和数据处理</td>
 <td className="py-4 px-6 text-right">
 <button 
 className={`relative w-11 h-6 rounded-full transition-colors inline-block align-middle bg-primary-500`}
 >
 <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-5`} />
 </button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
};
