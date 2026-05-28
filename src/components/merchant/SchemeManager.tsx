import React, { useState } from 'react';
import { 
  Plus, Search, SlidersHorizontal, MoreHorizontal, 
  ArrowUpRight, LayoutGrid, CheckCircle2, Clock,
  MessageSquare, Share2, Trash2, Edit3, Settings,
  Zap, Workflow, ImageIcon, FileBox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SchemeOperation } from './SchemeOperation';
import { AssetManager } from './AssetManager';

interface Scheme {
  id: string;
  name: string;
  status: string;
  notes: number;
  distribution: number;
  updatedAt: string;
}

const MOCK_SCHEMES: Scheme[] = [
  { id: '69', name: '夏季新品推广案', status: '信息已完善', notes: 1, distribution: 0, updatedAt: '2026-03-30 10:19' },
  { id: '66', name: 'API 测试方案_已改名', status: '信息已完善', notes: 3, distribution: 12, updatedAt: '2026-03-29 15:40' },
  { id: '63', name: '全自动增长试验', status: '草稿', notes: 0, distribution: 0, updatedAt: '2026-03-28 09:12' },
];

export const SchemeManager: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'assets'>('schemes');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isOperationMode, setIsOperationMode] = useState(false);

  if (isOperationMode && selectedScheme) {
    return <SchemeOperation schemeName={selectedScheme.name} onBack={() => setIsOperationMode(false)} />;
  }

  return (
    <div className={`flex flex-col h-full bg-neutral-50 ${embedded ? '' : 'overflow-hidden'}`}>
      {/* Header with Navigation - Only show if not embedded in a view that already has headers */}
      {!embedded && (
        <div className="px-8 pt-8 pb-4 shrink-0 bg-neutral-50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-8">
              <h2 className="text-[20px] font-black text-neutral-900 tracking-tight">业务管理中心</h2>
              <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                 <button 
                   onClick={() => setActiveTab('schemes')}
                   className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all flex items-center gap-2 ${activeTab === 'schemes' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-600'}`}
                 >
                   <FileBox size={14} /> 方案管理
                 </button>
                 <button 
                   onClick={() => setActiveTab('assets')}
                   className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all flex items-center gap-2 ${activeTab === 'assets' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-600'}`}
                 >
                   <ImageIcon size={14} /> 素材中心
                 </button>
              </div>
            </div>
            {activeTab === 'schemes' && (
              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 bg-neutral-0 border border-neutral-200 rounded-xl text-[13px] font-black hover:bg-neutral-50 shadow-sm transition-all">
                   导入模版
                </button>
                <button className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-[13px] font-black shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2">
                   <Plus size={18}/> 创建新方案
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {embedded && activeTab === 'schemes' && (
        <div className="p-8 pb-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <PlusCircle size={18} className="text-primary-500" />
              <h3 className="text-[15px] font-black text-neutral-800">业务执行方案列表</h3>
           </div>
           <button className="px-4 py-1.5 bg-primary-500 text-white rounded-lg text-[12px] font-black flex items-center gap-2">
              <Plus size={14}/> 创建方案
           </button>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto ${embedded ? 'px-8 pb-8' : 'px-8 pb-8 custom-scrollbar'}`}>
        {activeTab === 'schemes' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="flex bg-neutral-0 p-1 rounded-xl border border-neutral-200">
                     <button className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-[12px] font-black">进行中</button>
                     <button className="px-4 py-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg text-[12px] font-black">已完成</button>
                  </div>
                  <div className="relative">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                     <input 
                       type="text" 
                       placeholder="按名称或 ID 搜索..." 
                       className="pl-10 pr-4 py-2 bg-neutral-0 border border-neutral-200 rounded-xl text-[13px] font-bold focus:outline-none focus:border-primary-500 w-64"
                     />
                  </div>
               </div>
               <button className="p-2.5 bg-neutral-0 border border-neutral-200 rounded-xl text-neutral-500 hover:text-neutral-900"><SlidersHorizontal size={18}/></button>
            </div>

            <div className="bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50/50 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                    <th className="px-8 py-5">#</th>
                    <th className="px-8 py-5">方案名称</th>
                    <th className="px-8 py-5">笔记规模</th>
                    <th className="px-8 py-5">分发权重</th>
                    <th className="px-8 py-5">最后更新</th>
                    <th className="px-8 py-5">状态</th>
                    <th className="px-8 py-5 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {MOCK_SCHEMES.map((scheme) => (
                    <tr key={scheme.id} className="hover:bg-neutral-50/30 transition-colors group">
                      <td className="px-8 py-6 text-[13px] font-mono font-bold text-neutral-400">{scheme.id}</td>
                      <td className="px-8 py-6">
                        <div>
                          <h4 className="text-[14px] font-black text-neutral-800">{scheme.name}</h4>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <span className="text-[13px] font-bold text-neutral-600">总 {scheme.notes} 篇</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <span className="text-[13px] font-mono font-black text-neutral-900">{scheme.distribution}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[13px] font-bold text-neutral-400">{scheme.updatedAt}</td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg ${
                          scheme.status === '信息已完善' ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-400'
                        }`}>
                          {scheme.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedScheme(scheme); setIsOperationMode(true); }}
                            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-md group-hover:bg-primary-500"
                          >
                            <Workflow size={14}/> 进入作业
                          </button>
                          <div className="w-px h-4 bg-neutral-100 mx-1" />
                          <button className="p-2.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all" title="编辑资料"><Edit3 size={18}/></button>
                          <button className="p-2.5 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 rounded-xl transition-all" title="删除"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full h-full"
          >
            <AssetManager embedded={true} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
