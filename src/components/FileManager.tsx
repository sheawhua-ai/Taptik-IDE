import React, { useState } from 'react';
import { 
  Search, Plus, ChevronDown, FolderOpen, FileText, ImageIcon, 
  Brain, GitBranch, Database, Import, DownloadCloud, Info, SlidersHorizontal, X, BookOpen
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
  const UNIFIED_FILE_TREE = activeProject.fileTree;
  const [knowledgeSubTab, setKnowledgeSubTab] = useState<'merchant' | 'personal'>('merchant');
  const [autoGenerate, setAutoGenerate] = useState(true);

  return (
    <div className="flex-1 flex h-full bg-neutral-0 overflow-hidden">
       {/* Left Sidebar: Generic Local RAG File Tree */}
       <div className="w-[240px] xl:w-[260px] border-r border-neutral-200 bg-neutral-50/50 flex flex-col shrink-0">
         <div className="h-14 border-b border-neutral-200 shrink-0 flex flex-col justify-end px-4 relative">
            <div className="flex items-center gap-5 text-[13px] font-bold text-neutral-500">
               <button onClick={() => setFilesTab('project')} className={`pb-3 border-b-2 relative top-[1px] transition-all ${filesTab === 'project' ? 'border-primary-500 text-primary-500' : 'border-transparent hover:text-neutral-800'}`}>项目资源目录</button>
               <button onClick={() => setFilesTab('knowledge')} className={`pb-3 border-b-2 relative top-[1px] transition-all ${filesTab === 'knowledge' ? 'border-primary-500 text-primary-500' : 'border-transparent hover:text-neutral-800'}`}>全局资产库</button>
            </div>
            <div className="absolute right-4 top-3 flex items-center gap-1">
               <button className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"><Plus size={14}/></button>
            </div>
         </div>
         
         <div className="p-3 shrink-0 flex gap-2 border-b border-neutral-100">
            <div className="relative flex-1">
               <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
               <input type="text" placeholder={filesTab === 'project' ? "搜索项目资源..." : "搜索全局资产..."} className="w-full bg-neutral-0 border border-neutral-200 rounded-md py-1.5 pl-7 pr-2 text-[11px] focus:outline-none focus:border-primary-500 transition-colors" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar select-none">
            {filesTab === 'project' ? (
               <>
                  <div className="px-2 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1 mt-2">本项目文档</div>
                  {UNIFIED_FILE_TREE.map((node: any, i: number) => (
                    <div key={'pf-'+i}>
                       <div 
                         className="flex items-center gap-1.5 px-2 py-1.5 text-[13px] font-bold text-neutral-700 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors"
                         onClick={() => setActiveDoc(null)}
                       >
                          <ChevronDown size={14} className="text-neutral-400"/>
                          <FolderOpen size={14} className="text-primary-500/80" /> {node.name}
                       </div>
                       <div className="flex flex-col ml-[22px] mt-0.5 border-l border-neutral-200 pl-1">
                          {node.children.map((child: any, j: number) => (
                             <div 
                                key={'pc-'+j} 
                                onClick={() => child.name.endsWith('.rag') || child.name.endsWith('.md') ? setActiveDoc(child.name) : null}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium transition-all ${activeDoc === child.name ? 'bg-primary-50 text-primary-500 font-bold shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
                             >
                                {child.type === 'RAG' || child.name.endsWith('.md') ? (
                                   <FileText size={13} className={activeDoc === child.name ? "text-primary-500" : "text-neutral-400"} />
                                ) : (
                                   <ImageIcon size={13} className="text-success-500/70" />
                                )}
                                <span className="truncate">{child.name}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </>
            ) : (
               <>
                  <div className="px-2 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1 mt-2">全局知识与资产</div>
                  <div className="flex flex-col ml-1">
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <FolderOpen size={14} className="text-neutral-400" /> <span className="truncate">企业标准SOP库</span>
                     </div>
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <FolderOpen size={14} className="text-neutral-400" /> <span className="truncate">跨项目通用语料</span>
                     </div>
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <FolderOpen size={14} className="text-neutral-400" /> <span className="truncate">公共视觉资产包</span>
                     </div>
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <Brain size={14} className="text-primary-500/80" /> <span className="truncate">公司统一敏感词库</span>
                     </div>
                  </div>
               </>
            )}
         </div>

         <div className="p-3 border-t border-neutral-200 shrink-0 bg-neutral-0">
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 mb-2">
               <span className="flex items-center gap-1"><GitBranch size={12}/> 本地 Git 守护</span>
               <span className="text-success-600 font-bold bg-success-50 px-1.5 py-0.5 rounded border border-success-100">实时同步</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
               <span className="flex items-center gap-1"><Database size={12}/> LanceDB 索引</span>
               <span className="text-success-600 font-bold bg-success-50 px-1.5 py-0.5 rounded border border-success-100">832 个块</span>
            </div>
         </div>
       </div>
       
       {/* Right Pane: Editor or Dashboard or Knowledge Center Detail */}
       <div className="flex-1 flex flex-col min-w-0 bg-neutral-0 relative">
          {filesTab === 'knowledge' ? (
             <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-14 border-b border-neutral-100 flex items-center px-6 shrink-0 bg-neutral-0">
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setKnowledgeSubTab('merchant')}
                        className={`text-[14px] font-bold py-4 relative transition-colors ${knowledgeSubTab === 'merchant' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                      >
                         商家知识库 (Shared)
                      </button>
                      <button 
                        onClick={() => setKnowledgeSubTab('personal')}
                        className={`text-[14px] font-bold py-4 relative transition-colors ${knowledgeSubTab === 'personal' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                      >
                         操盘手个人库 (Private)
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                    <div className="max-w-4xl space-y-6">
                       {/* LanceDB Overview Card */}
                       <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <h3 className="text-[15px] font-black text-neutral-900">LanceDB | {knowledgeSubTab === 'merchant' ? '共享资产集群' : '个人私有切片'}</h3>
                                <ChevronDown size={14} className="text-neutral-400" />
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded uppercase">Serverless Vector Index</span>
                             </div>
                          </div>
                          <p className="text-[13px] text-neutral-500 font-medium leading-relaxed mb-6">
                             {knowledgeSubTab === 'merchant' ? '商户级别共享的私域文档、话术库及品牌调性手册。' : '仅限当前操盘手可见的个人创作草稿、历史灵感及学习记忆。'}
                             <button className="text-primary-500 font-bold ml-1 hover:underline">架构说明</button>
                          </p>
                          <div className="flex items-center justify-between bg-neutral-0 border border-neutral-100 rounded-lg p-3">
                             <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-neutral-700">实时向量同步</span>
                                <Info size={14} className="text-neutral-300" />
                             </div>
                             <button 
                               onClick={() => setAutoGenerate(!autoGenerate)}
                               className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-1 ${autoGenerate ? 'bg-success-500' : 'bg-neutral-200'}`}
                             >
                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${autoGenerate ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                              </button>
                          </div>
                       </div>

                       {/* Search & Filter */}
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                             <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input 
                                  type="text" 
                                  placeholder={knowledgeSubTab === 'merchant' ? "搜索商户文档..." : "搜索个人灵感..."} 
                                  className="w-full bg-neutral-0 border border-neutral-200 rounded-lg py-2.5 pl-10 pr-4 text-[14px] focus:outline-none focus:border-primary-500 transition-all font-medium" 
                                />
                             </div>
                             <button className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors relative">
                                <SlidersHorizontal size={18} />
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-success-500 rounded-full border border-white"></div>
                             </button>
                          </div>

                          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                             <div className="flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-md text-[13px] font-bold text-neutral-700 shrink-0">
                                成熟度 <span className="text-neutral-400 font-normal ml-2">高</span> <X size={14} className="text-neutral-300 ml-1 cursor-pointer" />
                             </div>
                             <button className="text-[13px] font-bold text-neutral-400 hover:text-neutral-600 shrink-0">清除筛选</button>
                          </div>
                       </div>

                       {/* Knowledge Items */}
                       <div className="space-y-4 pt-2">
                          {['官方画册', '直播话术', '竞品情报'].map((cat, i) => (
                            <div key={i} className="border-b border-neutral-100 last:border-0 pb-2">
                               <div className="flex items-center justify-between py-2 group cursor-pointer mb-1">
                                  <h4 className="text-[12px] font-black text-neutral-400 uppercase tracking-tight">{cat}</h4>
                                  <ChevronDown size={14} className="text-neutral-300 group-hover:text-neutral-600" />
                                </div>
                                {i === 0 && (
                                   <div className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer group">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-sm border-dashed">
                                            <FileText size={16} />
                                         </div>
                                         <span className="text-[14px] font-bold text-neutral-700">2024夏季新品SOP</span>
                                      </div>
                                      <div className="text-[12px] font-bold text-neutral-400 text-right">
                                         <p>83% 相关度</p>
                                         <p className="text-[10px] text-neutral-300">昨天 14:20</p>
                                      </div>
                                   </div>
                                )}
                            </div>
                          ))}
                       </div>
                    </div>
                </div>
             </div>
          ) : !activeDoc ? (
             // DASHBOARD
             <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                   <div className="mb-10">
                      <h1 className="text-3xl font-black text-neutral-900 mb-3 flex items-center gap-3">
                         LanceDB 向量集群 <span className="text-[12px] font-bold text-success-600 bg-success-50 px-2 py-1 rounded border border-success-100 uppercase tracking-wider align-middle">实时检索</span>
                      </h1>
                      <p className="text-[14px] text-neutral-500 font-medium leading-relaxed max-w-2xl">
                          基于极速向量数据库 LanceDB 构建，支持结构化与非结构化混合查询。商户知识库确保全员行动一致，个人知识库赋能操盘手私域创作力。
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-primary-500/40 hover:shadow-md transition-all cursor-pointer group">
                         <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Import size={20} />
                         </div>
                         <h3 className="text-[15px] font-bold text-neutral-900 mb-1">挂载本地文件夹同步</h3>
                         <p className="text-[12px] text-neutral-500">自动实时静默扫描本地文件变更，3秒完成语义切片与向量建库同步，实现无感融合。</p>
                      </div>
                      <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-primary-500/40 hover:shadow-md transition-all cursor-pointer group">
                         <div className="w-10 h-10 bg-neutral-50 text-neutral-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <DownloadCloud size={20} />
                         </div>
                         <h3 className="text-[15px] font-bold text-neutral-900 mb-1">导入外部归档数据集</h3>
                         <p className="text-[12px] text-neutral-500">支持 HTML/PDF/Markdown 等外部来源压缩包，系统将自动清洗排版噪音，转换为标准原生大模型语料格式。</p>
                      </div>
                   </div>

                   <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">最近同步机制日志</h3>
                   <div className="space-y-3 pb-8">
                      {[
                               {action: '自动构建索引', target: '防敏感词过滤包.rag', time: '10分钟前', status: '完成' },
                               {action: 'Git 自动提交', target: '~/智策系统-工作区/商家A', time: '1 小时前', status: '成功' },
                               {action: '向量库更新', target: '+ 42 数据块', time: '3 小时前', status: '成功' }
                      ].map((log, i) => (
                         <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-neutral-50/50 rounded-lg border border-neutral-100 text-[13px]">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded bg-neutral-0 flex items-center justify-center text-neutral-400 border border-neutral-100 shadow-sm"><GitBranch size={14}/></div>
                               <div>
                                  <div className="font-bold text-neutral-900">{log.action} <span className="font-normal text-neutral-400 mx-1">/</span> <span className="text-primary-500">{log.target}</span></div>
                                  <div className="text-[11px] text-neutral-400 mt-0.5">{log.time}</div>
                               </div>
                            </div>
                            <div className="text-success-600 font-bold flex items-center gap-1.5 mt-2 sm:mt-0"><div className="w-1.5 h-1.5 rounded-full bg-success-500"></div> {log.status}</div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col h-full bg-neutral-0">
               <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6 shrink-0 bg-neutral-0/80 backdrop-blur-sm z-10 sticky top-0">
                  <div className="flex items-center gap-2">
                     <FileText size={16} className="text-primary-500" />
                     <span className="text-[14px] font-bold text-neutral-900">{activeDoc}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[11px] text-neutral-400 font-bold">最后编辑: 刚刚</span>
                     <button className="px-3 py-1 bg-primary-500 text-white text-[12px] font-bold rounded-lg shadow-sm hover:bg-primary-600 transition-colors">保 存</button>
                  </div>
               </div>
               <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-neutral-0">
                  <div className="max-w-3xl mx-auto prose prose-neutral prose-sm">
                     <p className="text-neutral-400 italic">编辑器加载中 (本地离线 RAG 文本)...</p>
                  </div>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};
