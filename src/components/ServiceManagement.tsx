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
  onSelectMerchant: (merchant: SubMerchant) => void;
  selectedMerchant: SubMerchant | null;
  onBack: () => void;
}

export const ServiceManagement: React.FC<ServiceManagementProps> = ({ onSelectMerchant, selectedMerchant, onBack }) => {
  const [activeTab, setActiveTab] = React.useState<'merchants' | 'team'>('merchants');
  const [detailTab, setDetailTab] = React.useState('pipeline');
  const registerUrl = "https://tap.topyuncang.com/login?age=your_id";

  if (selectedMerchant) {
    // ... (rest of the Detail view remains same for now)
    return (
      <div className="flex-1 flex flex-col bg-neutral-50 h-full overflow-hidden">
        {/* Detail Context Header */}
        <div className="bg-neutral-0 border-b border-neutral-200 px-8 py-5 shrink-0 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2.5 hover:bg-neutral-100 rounded-xl transition-all text-neutral-400 group">
               <ChevronLeft size={20} className="group-hover:text-neutral-900"/>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 font-black text-xs">
                {selectedMerchant.name[0]?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[17px] font-black text-neutral-900 tracking-tight">{selectedMerchant.name}</h1>
                  <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-bold rounded uppercase">UUID: {selectedMerchant.id}</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">正在管理该商户数据与资产</p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100">
            {[
              { id: 'pipeline', name: '业务方案' },
              { id: 'assets', name: '素材中心' },
              { id: 'tasks', name: '执行任务' },
              { id: 'staff', name: '员工权限' },
              { id: 'account', name: '账号详情' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setDetailTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all ${detailTab === tab.id ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {detailTab === 'pipeline' && <SchemeManager embedded={true} />}
           {detailTab === 'assets' && <AssetManager embedded={true} />}
           {detailTab === 'tasks' && <TaskList />}
           {detailTab === 'staff' && <StaffManager />}
           {detailTab === 'account' && <AccountDetails />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-50 h-full overflow-hidden">
      {/* Management Header */}
      <div className="h-20 bg-neutral-0 border-b border-neutral-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 border-r border-neutral-200 pr-8">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-[18px] font-black text-neutral-900 tracking-tight">管理中心</h1>
          </div>
          
          <nav className="flex items-center gap-8">
             <button 
               onClick={() => setActiveTab('merchants')}
               className={`text-[15px] font-black relative py-7 transition-all ${activeTab === 'merchants' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
             >
                商户 Hub
                {activeTab === 'merchants' && <motion.div layoutId="manageTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full" />}
             </button>
             <button 
               onClick={() => setActiveTab('team')}
               className={`text-[15px] font-black relative py-7 transition-all ${activeTab === 'team' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
             >
                组织与内勤
                {activeTab === 'team' && <motion.div layoutId="manageTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full" />}
             </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-success-50 text-success-700 rounded-xl border border-success-100">
              <span className="text-[11px] font-black">飞书集成: 正常运行中</span>
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
           </div>
           <button className="p-2.5 bg-neutral-0 border border-neutral-200 rounded-xl text-neutral-400 hover:text-neutral-900 transition-all">
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
                <div className="lg:col-span-2 bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <QrCode size={160} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-[20px] font-black text-neutral-900 tracking-tight">专属商户入驻引擎</h2>
                      <span className="px-2 py-0.5 bg-success-50 text-success-600 text-[10px] font-black rounded-lg">绑定分销 ID</span>
                    </div>
                    <p className="text-[14px] text-neutral-500 font-medium mb-8 max-w-lg">
                      系统已根据您的代理商 ID 自动生成入驻入口。新商户注册后将自动获得您的「业务模板库」共享权限。
                    </p>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="bg-neutral-0 p-4 border border-neutral-100 rounded-3xl shadow-xl">
                        <div className="w-40 h-40 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 p-2">
                           <QrCode size={120} className="text-neutral-900" />
                        </div>
                        <button className="w-full mt-4 py-2 text-[12px] font-black text-primary-500 hover:bg-primary-50 rounded-lg transition-colors border border-primary-50 flex items-center justify-center gap-2">
                           <Download size={14} /> 保存商户码
                        </button>
                      </div>
                      <div className="flex-1 w-full space-y-6">
                        <div>
                          <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">入驻短链</label>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-[14px] font-mono text-neutral-600 truncate">
                              {registerUrl}
                            </div>
                            <button className="px-5 bg-neutral-900 text-white rounded-xl text-[13px] font-black hover:bg-primary-500 transition-all flex items-center gap-2 shrink-0">
                              <Clipboard size={16}/> 复制
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 rounded-[32px] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
                   <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-primary-500/10 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform"></div>
                   <div className="relative z-10">
                      <BarChart3 size={32} className="text-primary-500 mb-8" />
                      <h3 className="text-[24px] font-black leading-tight mb-2">本月商户业绩</h3>
                      <p className="text-[13px] text-white/40 font-bold mb-8">数据中心聚合监控</p>
                      <div className="space-y-4">
                         <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <span className="text-[12px] font-bold text-white/60 text-left">活跃商户</span>
                            <span className="text-[24px] font-black">42</span>
                         </div>
                         <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <span className="text-[12px] font-bold text-white/60 text-left">积分消耗</span>
                            <span className="text-[24px] font-black">12.5k</span>
                         </div>
                      </div>
                   </div>
                   <button className="w-full mt-8 py-3.5 bg-white text-neutral-900 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 hover:bg-primary-50 transition-all shadow-xl">
                      进入财务明细 <ArrowUpRight size={16}/>
                   </button>
                </div>
              </div>

              {/* Merchant Table */}
              <div className="bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <h2 className="text-[18px] font-black text-neutral-900 tracking-tight">所有下线商户</h2>
                      <div className="px-2 py-0.5 bg-neutral-100 rounded-lg text-[11px] font-black text-neutral-500">1 TOTAL</div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="relative">
                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                         <input placeholder="搜索商户 ID..." className="pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-bold w-64 outline-none focus:border-primary-500" />
                      </div>
                      <button className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-black shadow-lg">直接手动开号</button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-neutral-50/50 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                         <th className="px-8 py-4">UUID</th>
                         <th className="px-8 py-4">商户品牌名称</th>
                         <th className="px-8 py-4">账号信息</th>
                         <th className="px-8 py-4">状态</th>
                         <th className="px-8 py-4">关键指标 (本月)</th>
                         <th className="px-8 py-4 text-right">操作</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-neutral-100">
                        {MOCK_MERCHANTS.map(m => (
                          <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors">
                             <td className="px-8 py-5 font-mono text-[11px] text-neutral-400">#{m.id}</td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 bg-neutral-100 rounded-xl flex items-center justify-center font-black text-neutral-500">TS</div>
                                   <span className="text-[14px] font-black text-neutral-900">{m.name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex flex-col gap-0.5">
                                   <span className="text-[13px] font-bold text-neutral-700">{m.email}</span>
                                   <span className="text-[11px] text-neutral-400 font-bold">{m.phone}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className="px-2.5 py-1 bg-success-50 text-success-600 text-[10px] font-black rounded-lg border border-success-100">ACTIVE</span>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                   <div className="text-center">
                                      <p className="text-[10px] font-black text-neutral-400 uppercase">Credits</p>
                                      <p className="text-[13px] font-bold text-neutral-800">5,420</p>
                                   </div>
                                   <div className="w-px h-6 bg-neutral-100" />
                                   <div className="text-center">
                                      <p className="text-[10px] font-black text-neutral-400 uppercase">爆文数</p>
                                      <p className="text-[13px] font-bold text-neutral-800">82</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <button onClick={() => onSelectMerchant(m)} className="text-[13px] font-black text-primary-500 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all">进入管理 &rarr;</button>
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
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200">
                     <p className="text-[11px] font-black text-neutral-400 uppercase mb-1">团队成员</p>
                     <p className="text-2xl font-black text-neutral-900">18 <span className="text-[12px] text-neutral-300">/ 无限制</span></p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200">
                     <p className="text-[11px] font-black text-neutral-400 uppercase mb-1">飞书账号映射</p>
                     <p className="text-2xl font-black text-neutral-900">12 个</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200">
                     <p className="text-[11px] font-black text-neutral-400 uppercase mb-1">当前并发任务数</p>
                     <p className="text-2xl font-black text-primary-500">5 / 20</p>
                  </div>
               </div>

               <div className="bg-white rounded-[32px] border border-neutral-200 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                     <div>
                        <h2 className="text-[18px] font-black text-neutral-900 tracking-tight">组织成员与权限</h2>
                        <p className="text-[12px] text-neutral-400 font-bold italic mt-1">成员自动通过飞书/钉钉 SSO 鉴权与流转</p>
                     </div>
                     <button className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[13px] font-black shadow-lg flex items-center gap-2">
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
                           <div key={i} className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-2xl border border-transparent hover:border-neutral-100 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-black text-neutral-500">{user.name[0]}</div>
                                 <div>
                                    <h4 className="text-[14px] font-black text-neutral-900">{user.name}</h4>
                                    <p className="text-[11px] text-neutral-400 font-bold">{user.email}</p>
                                 </div>
                              </div>
                              <div className="flex-1 px-12">
                                 <span className="px-3 py-1 bg-neutral-100 rounded-lg text-[11px] font-black text-neutral-600">{user.role}</span>
                                 <span className="ml-4 text-[12px] font-bold text-neutral-400">{user.dept}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button className="text-[12px] font-black text-primary-500 hover:underline">编辑权限</button>
                                 <button className="text-[12px] font-black text-neutral-300">禁用</button>
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

