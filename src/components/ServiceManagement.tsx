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
  const [detailTab, setDetailTab] = React.useState('pipeline');
  const registerUrl = "https://tap.topyuncang.com/login?age=your_id";

  if (selectedMerchant) {
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
      {/* List Header */}
      <div className="h-20 bg-neutral-0 border-b border-neutral-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 shadow-sm border border-primary-100/50">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-[18px] font-black text-neutral-900 tracking-tight">服务商管理后台</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[12px] font-black text-neutral-500">当前角色</span>
            <span className="text-[13px] font-black text-primary-500">一级代理商</span>
          </div>
          <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-black flex items-center gap-2 shadow-xl hover:bg-neutral-800 transition-all">
            <Lock size={14}/> 权限控制
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Section 1: Invitation & QR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <QrCode size={160} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-[20px] font-black text-neutral-900 tracking-tight">专属商户注册链接</h2>
                  <span className="px-2 py-0.5 bg-success-50 text-success-600 text-[10px] font-black rounded-lg">自动绑定下级</span>
                </div>
                <p className="text-[14px] text-neutral-500 font-medium mb-8 max-w-lg">
                  您可以将此链接或二维码发送给商户，商户扫码或点击链接注册后，将自动挂在您的名下。
                </p>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="bg-neutral-0 p-4 border border-neutral-100 rounded-3xl shadow-2xl shadow-neutral-200/50">
                    <div className="w-40 h-40 bg-neutral-50 rounded-2xl flex items-center justify-center border border-dashed border-neutral-200 relative group overflow-hidden">
                       <QrCode size={120} className="text-neutral-900" />
                       <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <button className="p-3 bg-white text-neutral-900 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                             <Download size={20}/>
                          </button>
                       </div>
                    </div>
                    <button className="w-full mt-4 py-2 text-[12px] font-bold text-primary-500 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary-100">
                      <Download size={14} /> 下载二维码
                    </button>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <label className="text-[12px] font-black text-neutral-400 uppercase tracking-widest block mb-2">注册链接</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[14px] font-mono font-medium text-neutral-600 truncate">
                          {registerUrl}
                        </div>
                        <button className="px-6 bg-neutral-0 border border-neutral-200 rounded-xl text-neutral-900 text-[13px] font-black hover:bg-neutral-50 transition-colors flex items-center gap-2 shrink-0">
                          <Clipboard size={16}/> 复制
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-neutral-400">
                       <Info size={14}/>
                       <span>直接复制链接发送至微信或浏览器打开即可注册</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-[32px] p-8 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <BarChart3 size={32} className="text-primary-400" />
                  </div>
                  <h3 className="text-[24px] font-black leading-tight mb-2">业绩看板</h3>
                  <p className="text-[13px] text-white/40 font-medium mb-8">实时监控下线商户的消耗与活跃度</p>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-[12px] font-bold text-white/60">本月新增商户</span>
                        <span className="text-[20px] font-black">12</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-[12px] font-bold text-white/60">消耗 Credits</span>
                        <span className="text-[20px] font-black">2.4k</span>
                     </div>
                  </div>
               </div>
               <button className="w-full mt-8 py-3 bg-white text-neutral-900 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all active:scale-95">
                  查看详细报表 <ArrowUpRight size={16}/>
               </button>
            </div>
          </div>

          {/* Section 2: Merchant List */}
          <div className="bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-black text-neutral-900 tracking-tight mb-1">下级账号管理</h2>
                <p className="text-[12px] text-neutral-400 font-bold">已绑定 1 个商户账号</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                      type="text" 
                      placeholder="搜索 ID 或名称..." 
                      className="pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-bold focus:outline-none focus:border-primary-500 w-64"
                    />
                 </div>
                 <button className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100"><SlidersHorizontal size={18}/></button>
                 <button className="px-6 py-3 bg-primary-500 text-white rounded-xl text-[13px] font-black shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2">
                    <UserPlus size={18}/> 添加账号
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50/50 text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">账号名称</th>
                    <th className="px-8 py-4">联系方式</th>
                    <th className="px-8 py-4">角色</th>
                    <th className="px-8 py-4">状态</th>
                    <th className="px-8 py-4">创建时间</th>
                    <th className="px-8 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {MOCK_MERCHANTS.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="px-8 py-5 text-[13px] font-mono font-bold text-neutral-400">{m.id}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-black text-neutral-500 text-[10px]">TS</div>
                          <span className="text-[14px] font-black text-neutral-800">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-neutral-700 flex items-center gap-1"><Mail size={12} className="text-neutral-300"/> {m.email}</span>
                          <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1 mt-0.5"><Phone size={12} className="text-neutral-300"/> {m.phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] font-black rounded-lg">{m.role}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success-500" />
                          <span className="text-[13px] font-bold text-neutral-700">在线</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-neutral-400">
                            <Calendar size={14} />
                            <span className="text-[12px] font-bold">{m.createdAt}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-[13px] font-black text-primary-500 hover:underline">编辑</button>
                          <button className="text-[13px] font-black text-primary-500 hover:underline">Token 设置</button>
                          <button 
                            onClick={() => onSelectMerchant(m)}
                            className="text-[13px] font-black text-primary-500 hover:underline"
                          >
                            商户详情
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
               <div className="text-[12px] font-bold text-neutral-400">
                  显示 1-1 / 共 1 条结果
               </div>
               <div className="flex items-center gap-2">
                  <button className="w-10 h-10 bg-neutral-0 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-300 disabled:opacity-50" disabled>
                     <Plus size={18} className="rotate-45 "/>
                  </button>
                  <button className="w-10 h-10 bg-neutral-900 border border-neutral-900 rounded-xl flex items-center justify-center text-white font-black text-[14px]">1</button>
                  <button className="w-10 h-10 bg-neutral-0 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-300 disabled:opacity-50" disabled>
                     <Plus size={18}/>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
