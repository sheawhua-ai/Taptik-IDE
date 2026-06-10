import React, { useState } from 'react';
import { 
  Search, Plus, ChevronDown, FolderOpen, FileText, ImageIcon, 
  Brain, GitBranch, Database, Import, DownloadCloud, Info, SlidersHorizontal, X, BookOpen, User, ArrowUpRight, PlusCircle, Link2, MoreVertical, PenTool, LayoutGrid
} from 'lucide-react';

interface FileManagerProps {
  filesTab: 'project' | 'knowledge';
  setFilesTab: (val: 'project' | 'knowledge') => void;
  activeProject: any;
  activeDoc: string | null;
  setActiveDoc: (doc: string | null) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ 
  filesTab, setFilesTab, activeProject, activeDoc, setActiveDoc 
}) => {
  const [knowledgeSubTab, setKnowledgeSubTab] = useState<'merchant' | 'personal'>('merchant');
  
  const MERCHANTS = [
    { id: 'm1', name: '奈雪的茶', icon: '🍵', count: 12, lastSync: '10分钟前' },
    { id: 'm2', name: '宠物食品-麦富迪', icon: '🐶', count: 28, lastSync: '1小时前' },
    { id: 'm3', name: '花西子旗舰店', icon: '🌸', count: 45, lastSync: '3小时前' },
  ];

  const DOCUMENTS = [
    { name: '2024夏季新品SOP.pdf', type: 'sop', size: '1.2MB', tags: ['爆文', '规则'] },
    { name: '竞品敏感词规避表.rag', type: 'rag', size: '42KB', tags: ['安全', 'RAG'] },
    { name: '美妆直播脚本模版.md', size: '15KB', type: 'md', tags: ['脚本'] },
    { name: '品牌视觉规范.ai', size: '8.4MB', type: 'asset', tags: ['视觉'] },
    { name: '转化ROI归因逻辑.doc', size: '156KB', type: 'theory', tags: ['算法'] },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                 <BookOpen size={18} />
              </div>
              <h2 className="text-[15px] font-black text-neutral-900 tracking-tight">知识库体系 <span className="text-neutral-300 font-normal mx-1">/</span> <span className="text-primary-500 uppercase">LanceDB Vector Mesh</span></h2>
           </div>
           
           <div className="flex bg-neutral-100 p-1 rounded-xl">
              <button 
                onClick={() => setFilesTab('project')}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all ${filesTab === 'project' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                项目局部
              </button>
              <button 
                onClick={() => setFilesTab('knowledge')}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all ${filesTab === 'knowledge' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                全量总库
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input 
                placeholder="搜索语义切片..." 
                className="bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-[12px] w-[240px] focus:outline-none focus:border-primary-500 transition-all font-medium"
              />
           </div>
           <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black flex items-center gap-2 hover:bg-primary-500 transition-all shadow-lg active:scale-95">
              <Plus size={16} /> 上传并同步至 LanceDB
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Merchant/Trader Management */}
        <div className="w-[280px] border-r border-neutral-100 bg-white flex flex-col overflow-hidden shadow-sm z-10">
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[11px] font-black text-neutral-300 uppercase tracking-widest">商家库管理</h3>
                 <button className="text-neutral-300 hover:text-neutral-900"><SlidersHorizontal size={14} /></button>
              </div>
              
              <div className="space-y-2">
                 {MERCHANTS.map(m => (
                   <button key={m.id} className="w-full text-left p-3 rounded-2xl hover:bg-neutral-50 transition-all group relative border border-transparent hover:border-neutral-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-xl shadow-sm border border-neutral-100">{m.icon}</div>
                         <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-black text-neutral-800 truncate">{m.name}</div>
                            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                               {m.count} 文档 · {m.lastSync}同步
                            </div>
                         </div>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronDown size={14} className="text-neutral-300" />
                      </div>
                   </button>
                 ))}
              </div>

              <div className="mt-10 mb-6">
                 <h3 className="text-[11px] font-black text-neutral-300 uppercase tracking-widest mb-4">操盘手空间</h3>
                 <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100/50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                       <User size={20} />
                    </div>
                    <div>
                       <div className="text-[13px] font-black">个人灵感切片</div>
                       <div className="text-[10px] font-bold opacity-70">PRIVATE REPOSITORY</div>
                    </div>
                 </button>
              </div>
           </div>

           <div className="mt-auto p-6 bg-neutral-900 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Database size={14} className="text-primary-500" />
                    <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">LanceDB Status</span>
                 </div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-3">
                 <div className="text-[10px] font-bold text-white/30 flex justify-between">
                    <span>已建索引块 (Chunks)</span>
                    <span className="text-white/70">8,230</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-primary-500 shadow-[0_0_8px_rgba(230,53,96,0.5)]" />
                 </div>
                 <div className="text-[9px] font-bold text-white/20">向量空间利用率 94.2%</div>
              </div>
           </div>
        </div>

        {/* Right: Structured Document List */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <div className="max-w-5xl mx-auto space-y-10">
              <div className="flex items-end justify-between border-b border-neutral-100 pb-8">
                 <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">文档与语义资产</h1>
                    <p className="text-neutral-500 font-bold">查看及管理已结构化至 LanceDB 的文件、SOP 与 原始语料</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 border border-neutral-200 rounded-xl text-neutral-400 hover:text-neutral-900"><LayoutGrid size={20} /></button>
                    <button className="p-2 bg-neutral-900 text-white rounded-xl shadow-lg shadow-neutral-900/10"><SlidersHorizontal size={20} /></button>
                 </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 {DOCUMENTS.map((doc, i) => (
                   <div key={i} className="group bg-white border border-neutral-100 p-6 rounded-[32px] hover:border-primary-500/20 hover:shadow-2xl transition-all relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                         <FileText size={160} />
                      </div>
                      <div className="flex items-start justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all shadow-sm">
                               {doc.type === 'rag' ? <Brain size={24} /> : doc.type === 'md' ? <PenTool size={24} /> : <FileText size={24} />}
                            </div>
                            <div>
                               <h4 className="text-[16px] font-black text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">{doc.name}</h4>
                               <p className="text-[11px] text-neutral-400 font-bold mt-1">
                                  {doc.size} · 已向量化结构
                               </p>
                            </div>
                         </div>
                         <button className="p-2 text-neutral-300 hover:text-neutral-900"><MoreVertical size={18}/></button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                         {doc.tags?.map((tag, j) => (
                           <span key={j} className="px-3 py-1 bg-neutral-50 text-neutral-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-neutral-100">#{tag}</span>
                         ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                         <div className="flex items-center gap-2 text-[11px] font-black text-emerald-600">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                            已收录在主 Agent 上下文
                         </div>
                         <button 
                           onClick={() => setActiveDoc(doc.name)}
                           className="flex items-center gap-2 text-[12px] font-black text-neutral-900 hover:text-primary-500 transition-colors"
                         >
                            打开并编辑 <ArrowUpRight size={14} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="pt-10">
                 <div className="bg-neutral-50 rounded-[40px] p-10 border border-neutral-100 text-center space-y-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-neutral-300">
                       <Link2 size={32} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-neutral-900">外部文档链路</h3>
                       <p className="text-[13px] text-neutral-500 font-bold mt-2">支持飞书、Notion、微信文档等外部链接的实时结构化同步</p>
                    </div>
                    <button className="px-8 py-3 bg-neutral-900 text-white rounded-2xl text-[13px] font-black shadow-lg hover:bg-primary-500 transition-all inline-flex items-center gap-2 active:scale-95">
                       <PlusCircle size={18} /> 绑定新的文档链路
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
