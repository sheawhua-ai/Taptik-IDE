import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Download, Trash2, 
  Image as ImageIcon, Film, Music, FileText,
  LayoutGrid, List, MoreVertical, Eye, Share2,
  CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: string;
  createdAt: string;
  status: 'ready' | 'processing' | 'error';
  tags: string[];
}

const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: '夏季新品海报_01.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
    size: '1.2 MB',
    createdAt: '2026-03-30 14:20',
    status: 'ready',
    tags: ['夏季', '新品', '海报']
  },
  {
    id: '2',
    name: '产品介绍视频_V2.mp4',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=400&auto=format&fit=crop',
    size: '15.4 MB',
    createdAt: '2026-03-30 11:30',
    status: 'processing',
    tags: ['产品', '视频']
  },
  {
    id: '3',
    name: '品牌调性画册.pdf',
    type: 'document',
    url: '',
    size: '4.8 MB',
    createdAt: '2026-03-29 16:45',
    status: 'ready',
    tags: ['品牌', '画册']
  }
];

export const AssetManager: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  return (
    <div className={`flex flex-col h-full bg-neutral-50 ${embedded ? '' : 'p-8'}`}>
      {!embedded && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[20px] font-black text-neutral-900 tracking-tight">素材管理中心</h2>
            <p className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider mt-1">素材储存库与媒体库</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-0 p-1 rounded-xl border border-neutral-200 shadow-sm">
               <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}><LayoutGrid size={18}/></button>
               <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}><List size={18}/></button>
            </div>
            <button className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-[13px] font-black shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center gap-2">
               <Plus size={18}/> 上传素材
            </button>
          </div>
        </div>
      )}

      {embedded && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-0 p-1 rounded-xl border border-neutral-200 shadow-sm">
               <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}><LayoutGrid size={18}/></button>
               <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}><List size={18}/></button>
            </div>
            <div className="h-4 w-px bg-neutral-200 mx-2" />
            <button className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black shadow-lg shadow-neutral-200 flex items-center gap-2 hover:bg-primary-500 transition-all">
               <Plus size={16}/> 上传素材
            </button>
          </div>
          <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">全局资产库</span>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
           <input 
             type="text" 
             placeholder="按名称、标签搜索素材..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-neutral-0 border border-neutral-200 rounded-[20px] text-[14px] font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
           />
        </div>
        <div className="flex items-center gap-2">
           {['all', 'image', 'video', 'document'].map(type => (
              <button 
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-[12px] font-black capitalize transition-all ${selectedType === type ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-200' : 'bg-neutral-0 border border-neutral-200 text-neutral-500 hover:bg-neutral-50'}`}
              >
                {type === 'all' ? '全部' : type === 'image' ? '图片' : type === 'video' ? '视频' : type === 'document' ? '文档' : type}
              </button>
           ))}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {MOCK_ASSETS.map((asset) => (
            <motion.div 
              key={asset.id}
              layout
              className="bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden group hover:shadow-2xl hover:translate-y-[-4px] transition-all"
            >
              <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                {asset.type === 'image' || asset.type === 'video' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="absoulte inset-0 flex items-center justify-center text-neutral-300">
                    <FileText size={64} />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button className="p-3 bg-white text-neutral-900 rounded-xl hover:scale-110 transition-transform shadow-xl"><Eye size={18}/></button>
                   <button className="p-3 bg-white text-neutral-900 rounded-xl hover:scale-110 transition-transform shadow-xl"><Download size={18}/></button>
                   <button className="p-3 bg-white text-danger-500 rounded-xl hover:scale-110 transition-transform shadow-xl"><Trash2 size={18}/></button>
                </div>

                <div className="absolute top-4 left-4">
                   {asset.status === 'processing' && (
                     <div className="px-3 py-1 bg-warning-500 text-white text-[10px] font-black rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Clock size={12} className="animate-spin" /> 处理中
                     </div>
                   )}
                   {asset.status === 'ready' && (
                     <div className="px-3 py-1 bg-success-500 text-white text-[10px] font-black rounded-lg flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 size={12} /> 就绪
                     </div>
                   )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[14px] font-black text-neutral-800 truncate mb-1">{asset.name}</h3>
                <div className="flex items-center justify-between">
                   <span className="text-[11px] font-bold text-neutral-400">{asset.size}</span>
                   <div className="flex gap-1">
                      {asset.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] font-black text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded">#{tag}</span>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-0 rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50 text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                  <th className="px-8 py-4">预览</th>
                  <th className="px-8 py-4">素材名称</th>
                  <th className="px-8 py-4">类型</th>
                  <th className="px-8 py-4">大小</th>
                  <th className="px-8 py-4">状态</th>
                  <th className="px-8 py-4">创建时间</th>
                  <th className="px-8 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {MOCK_ASSETS.map(asset => (
                  <tr key={asset.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center">
                        {asset.type === 'image' || asset.type === 'video' ? (
                          <img src={asset.url} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-neutral-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-[14px] font-black text-neutral-800">{asset.name}</span>
                    </td>
                    <td className="px-8 py-4 font-bold text-[13px] text-neutral-500">{asset.type === 'image' ? '图片' : asset.type === 'video' ? '视频' : asset.type === 'audio' ? '音频' : '文档'}</td>
                    <td className="px-8 py-4 font-mono text-[13px] text-neutral-400">{asset.size}</td>
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${asset.status === 'ready' ? 'bg-success-500' : 'bg-warning-500'}`} />
                          <span className="text-[13px] font-bold text-neutral-700">{asset.status === 'ready' ? '就绪' : '处理中'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-[13px] font-bold text-neutral-400">{asset.createdAt}</td>
                    <td className="px-8 py-4 text-right">
                       <button className="p-2 text-neutral-400 hover:text-neutral-900"><MoreVertical size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};
