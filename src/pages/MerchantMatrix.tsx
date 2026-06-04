import React, { useState } from 'react';
import { 
  PlusCircle, LayoutGrid, Users, CreditCard, Settings, 
  ArrowUpRight, Building, User, CheckCircle2, MoreVertical
} from 'lucide-react';

export default function MerchantMatrix() {
  const [viewMode, setViewMode] = useState<'merchants' | 'staff'>('staff');

  const MOCK_STAFF = [
    { id: '1', name: '李经理', role: '内容操盘手', status: '在线', activity: '正在编辑：夏日防晒方案' },
    { id: '2', name: '张小帅', role: '分发专员', status: '离线', activity: '最后在线：2 小时前' },
    { id: '3', name: '王美丽', role: '互动客服', status: '正在忙碌', activity: '处理意向线索中...' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 p-8 lg:p-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            {viewMode === 'staff' ? '员工与席位管理' : '下属商户矩阵'}
          </h2>
          <p className="text-[13px] text-neutral-400 font-bold">
            {viewMode === 'staff' ? '管理您团队中的操盘手、客服与分发专员' : '作为服务商，查看并管理您授权的业务主体'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
           <button 
             onClick={() => setViewMode('staff')}
             className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all ${viewMode === 'staff' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-400'}`}
           >团队管理</button>
           <button 
             onClick={() => setViewMode('merchants')}
             className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all ${viewMode === 'merchants' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-400'}`}
           >商户矩阵</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {viewMode === 'staff' ? (
          MOCK_STAFF.map(staff => (
            <div key={staff.id} className="p-8 bg-white border border-neutral-100 rounded-[32px] flex items-center justify-between hover:border-primary-500/20 hover:shadow-2xl transition-all group">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 font-black group-hover:bg-primary-50 group-hover:text-primary-500 transition-all text-xl">
                     {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[17px] font-black text-neutral-900">{staff.name}</h4>
                    <p className="text-[11px] text-neutral-400 font-black uppercase tracking-widest">{staff.role}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-12">
                  <div className="hidden md:block text-right">
                     <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-1.5">最近作业</p>
                     <p className="text-[14px] font-bold text-neutral-600">{staff.activity}</p>
                  </div>
                  <div className="min-w-[100px] text-right">
                    <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${staff.status === '在线' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}>
                      {staff.status}
                    </span>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center grayscale opacity-60 bg-neutral-50/50 rounded-[40px] border border-dashed border-neutral-200">
             <Building size={64} className="mx-auto mb-8 text-neutral-300" />
             <h3 className="text-2xl font-black text-neutral-900 italic">子商户矩阵暂不可见</h3>
             <p className="text-neutral-400 font-bold max-w-sm mx-auto mt-3 leading-relaxed">
                当前租户模式为「普通商户」。子商户视图仅对「全国服务商」等级账号开放。
             </p>
             <button className="mt-8 px-8 py-3.5 bg-neutral-900 text-white rounded-2xl text-[14px] font-black shadow-xl">申请升级</button>
          </div>
        )}
      </div>

      <button className="w-full py-8 bg-white border border-dashed border-neutral-200 rounded-[40px] text-[15px] font-black text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-3">
         <PlusCircle size={24} /> {viewMode === 'staff' ? '录入新员工信息' : '接入新商户主体'}
      </button>
    </div>
  );
}
