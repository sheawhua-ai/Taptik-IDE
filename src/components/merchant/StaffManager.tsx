import React from 'react';
import { 
 Plus, Search, Shield, User, Mail, 
 Phone, MoreVertical, ShieldCheck, 
 ShieldAlert, Settings, Trash2, Key
} from 'lucide-react';

interface Staff {
 id: string;
 name: string;
 email: string;
 phone: string;
 role: 'admin' | 'operator' | 'editor';
 status: 'active' | 'inactive';
 lastActive: string;
}

const MOCK_STAFF: Staff[] = [
 {
 id: 's1',
 name: '张经理',
 email: 'zhang@shop.com',
 phone: '138****0001',
 role: 'admin',
 status: 'active',
 lastActive: '10分钟前'
 },
 {
 id: 's2',
 name: '小王',
 email: 'wang@shop.com',
 phone: '139****0002',
 role: 'operator',
 status: 'active',
 lastActive: '1小时前'
 }
];

export const StaffManager: React.FC = () => {
 return (
 <div className="flex flex-col h-full bg-neutral-50 p-8">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h2 className="text-[20px] font-semibold text-neutral-900 tracking-tight">员工权限管理</h2>
 <p className="text-[12px] text-neutral-400 uppercase tracking-wider mt-1">员工访问与角色控制</p>
 </div>
 <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] shadow-xl hover:bg-neutral-800 transition-all flex items-center gap-2">
 <Plus size={18}/> 邀约员工
 </button>
 </div>

 <div className="bg-white rounded-[32px] border border-neutral-200 overflow-hidden shadow-sm">
 <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
 <input 
 type="text" 
 placeholder="搜索名称或邮箱..." 
 className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-primary-500 w-64"
 />
 </div>
 <div className="flex items-center gap-2">
 <span className="text-[12px] text-neutral-400">过滤角色:</span>
 <select className="bg-neutral-50 border border-neutral-200 text-[12px] rounded-lg px-2 py-1 outline-none">
 <option>全部</option>
 <option>管理员</option>
 <option>运营</option>
 </select>
 </div>
 </div>
 
 <table className="w-full text-left">
 <thead>
 <tr className="bg-neutral-50/50 text-[11px] text-neutral-400 uppercase tracking-widest">
 <th className="px-8 py-4">员工</th>
 <th className="px-8 py-4">联系方式</th>
 <th className="px-8 py-4">权限角色</th>
 <th className="px-8 py-4">状态</th>
 <th className="px-8 py-4">活跃时间</th>
 <th className="px-8 py-4 text-right">操作</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-neutral-100">
 {MOCK_STAFF.map(staff => (
 <tr key={staff.id} className="hover:bg-neutral-50/50 transition-colors">
 <td className="px-8 py-5">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 ">
 {staff.name[0]}
 </div>
 <span className="text-[14px] text-neutral-800">{staff.name}</span>
 </div>
 </td>
 <td className="px-8 py-5">
 <div className="flex flex-col">
 <span className="text-[13px] text-neutral-600 flex items-center gap-1.5"><Mail size={12}/> {staff.email}</span>
 <span className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5"><Phone size={12}/> {staff.phone}</span>
 </div>
 </td>
 <td className="px-8 py-5">
 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] uppercase tracking-tight ${
 staff.role === 'admin' ? 'bg-primary-50 text-primary-500' : 'bg-neutral-100 text-neutral-500'
 }`}>
 {staff.role === 'admin' ? <ShieldCheck size={12}/> : <User size={12}/>}
 {staff.role === 'admin' ? '管理员' : staff.role === 'operator' ? '运营' : '编辑'}
 </div>
 </td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-success-500" />
 <span className="text-[13px] text-neutral-700">在线</span>
 </div>
 </td>
 <td className="px-8 py-5 text-[13px] text-neutral-400">{staff.lastActive}</td>
 <td className="px-8 py-5 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-neutral-400 hover:text-neutral-900"><Key size={18}/></button>
 <button className="p-2 text-neutral-400 hover:text-neutral-900"><Settings size={18}/></button>
 <button className="p-2 text-neutral-400 hover:text-danger-500"><Trash2 size={18}/></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
};
