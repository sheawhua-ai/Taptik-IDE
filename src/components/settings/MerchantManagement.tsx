import React, { useState } from 'react';
import { Store, Plus, Search, MoreHorizontal, User, ShieldCheck } from 'lucide-react';
import { CreateMerchantModal } from '../merchant/CreateMerchantModal';

export const MerchantManagement = () => {
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   // mock data
   const [merchants] = useState([
      { id: '1', name: '宠物食品官方旗舰店', username: 'admin_pet1', phone: '13800000001', status: 'active', createdAt: '2023-01-10' },
      { id: '2', name: '美妆护肤自营店', username: 'admin_beauty', phone: '13800000002', status: 'active', createdAt: '2023-02-15' },
      { id: '3', name: '户外运动装备店', username: 'admin_outdoor', phone: '13800000003', status: 'pending', createdAt: '2023-03-20' },
   ]);

   const filteredMerchants = merchants.filter(m => m.name.includes(searchQuery) || m.username.includes(searchQuery));

   return (
      <div className="flex flex-col h-full space-y-6">
         <div className="flex items-center justify-end">
            <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-primary-500 transition-colors shadow-sm"
            >
               <Plus size={16} />
               新增商家
            </button>
         </div>

         <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            <div className="relative flex-1">
               <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text"
                  placeholder="搜索商家名称、用户名..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 focus:border-primary-500 outline-none rounded-lg text-[13px] font-bold transition-all shadow-sm"
               />
            </div>
         </div>

         <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 border-b border-slate-100 text-[12px] font-black text-slate-400 uppercase tracking-widest sticky top-0">
               <div className="col-span-5">商家信息</div>
               <div className="col-span-3">负责人（账号）</div>
               <div className="col-span-2">状态</div>
               <div className="col-span-2 text-right">操作</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col divide-y divide-slate-50">
               {filteredMerchants.map(merchant => (
                  <div key={merchant.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group">
                     <div className="col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                           <Store size={18} />
                        </div>
                        <div className="min-w-0">
                           <h4 className="text-[14px] font-bold text-slate-900 truncate">{merchant.name}</h4>
                           <p className="text-[12px] text-slate-400 font-medium truncate mt-0.5">创建于 {merchant.createdAt}</p>
                        </div>
                     </div>
                     <div className="col-span-3 flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 truncate">
                           <User size={14} className="text-slate-400" /> {merchant.username}
                        </div>
                        <div className="text-[12px] text-slate-400 font-medium mt-0.5">{merchant.phone}</div>
                     </div>
                     <div className="col-span-2">
                        {merchant.status === 'active' ? (
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-600 text-[11px] font-black">
                              <ShieldCheck size={12} /> 正常运营
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning-50 text-warning-600 text-[11px] font-black">
                              冷启建设中
                           </span>
                        )}
                     </div>
                     <div className="col-span-2 flex items-center justify-end">
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                           <MoreHorizontal size={16} />
                        </button>
                     </div>
                  </div>
               ))}
               
               {filteredMerchants.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                     <Store size={32} className="mb-4 opacity-50" />
                     <p className="text-[14px] font-bold">没有找到匹配的商家</p>
                  </div>
               )}
            </div>
         </div>

         <CreateMerchantModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </div>
   );
};
