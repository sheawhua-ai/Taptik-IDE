import React from 'react';
import { 
  Search, Plus, ChevronDown, FolderOpen, FileText, ImageIcon, 
  Brain, GitBranch, Database, Import, DownloadCloud
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

  return (
    <div className="flex-1 flex h-full bg-white overflow-hidden">
       {/* Left Sidebar: Generic Local RAG File Tree */}
       <div className="w-[240px] xl:w-[260px] border-r border-zinc-200 bg-[#FAFAFA] flex flex-col shrink-0">
         <div className="h-14 border-b border-zinc-200 shrink-0 flex flex-col justify-end px-4 relative">
            <div className="flex items-center gap-5 text-[13px] font-bold text-zinc-500">
               <button onClick={() => setFilesTab('project')} className={`pb-3 border-b-2 relative top-[1px] transition-colors ${filesTab === 'project' ? 'border-[#685FAB] text-[#685FAB]' : 'border-transparent hover:text-zinc-800'}`}>项目资源目录</button>
               <button onClick={() => setFilesTab('knowledge')} className={`pb-3 border-b-2 relative top-[1px] transition-colors ${filesTab === 'knowledge' ? 'border-[#685FAB] text-[#685FAB]' : 'border-transparent hover:text-zinc-800'}`}>全局资产库</button>
            </div>
            <div className="absolute right-4 top-3 flex items-center gap-1">
               <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition-colors"><Plus size={14}/></button>
            </div>
         </div>
         
         <div className="p-3 shrink-0 flex gap-2 border-b border-zinc-100">
            <div className="relative flex-1">
               <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
               <input type="text" placeholder={filesTab === 'project' ? "搜索项目资源..." : "搜索全局资产..."} className="w-full bg-white border border-zinc-200 rounded-md py-1.5 pl-7 pr-2 text-[11px] focus:outline-none focus:border-[#685FAB] transition-colors" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar select-none">
            {filesTab === 'project' ? (
               <>
                  <div className="px-2 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1 mt-2">本项目文档</div>
                  {UNIFIED_FILE_TREE.map((node: any, i: number) => (
                    <div key={'pf-'+i}>
                       <div 
                         className="flex items-center gap-1.5 px-2 py-1.5 text-[13px] font-bold text-zinc-700 hover:bg-zinc-200 rounded-md cursor-pointer transition-colors"
                         onClick={() => setActiveDoc(null)}
                       >
                          <ChevronDown size={14} className="text-zinc-400"/>
                          <FolderOpen size={14} className="text-[#685FAB]/80" /> {node.name}
                       </div>
                       <div className="flex flex-col ml-[22px] mt-0.5 border-l border-zinc-200 pl-1">
                          {node.children.map((child: any, j: number) => (
                             <div 
                               key={'pc-'+j} 
                               onClick={() => child.name.endsWith('.rag') || child.name.endsWith('.md') ? setActiveDoc(child.name) : null}
                               className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium transition-colors ${activeDoc === child.name ? 'bg-[#685FAB]/10 text-[#685FAB] font-bold' : 'text-zinc-600 hover:bg-zinc-200'}`}
                             >
                                {child.type === 'RAG' || child.name.endsWith('.md') ? (
                                   <FileText size={13} className={activeDoc === child.name ? "text-[#685FAB]" : "text-zinc-400"} />
                                ) : (
                                   <ImageIcon size={13} className="text-emerald-500/70" />
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
                  <div className="px-2 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1 mt-2">全局知识与资产</div>
                  <div className="flex flex-col ml-1">
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-zinc-600 hover:bg-zinc-200 transition-colors">
                        <FolderOpen size={14} className="text-zinc-400" /> <span className="truncate">企业标准SOP库</span>
                     </div>
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-zinc-600 hover:bg-zinc-200 transition-colors">
                        <FolderOpen size={14} className="text-zinc-400" /> <span className="truncate">跨项目通用语料</span>
                     </div>
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-zinc-600 hover:bg-zinc-200 transition-colors">
                        <FolderOpen size={14} className="text-zinc-400" /> <span className="truncate">公共视觉资产包</span>
                     </div>
                     <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12px] font-medium text-zinc-600 hover:bg-zinc-200 transition-colors">
                        <Brain size={14} className="text-[#685FAB]/80" /> <span className="truncate">公司统一敏感词库</span>
                     </div>
                  </div>
               </>
            )}
         </div>

         <div className="p-3 border-t border-zinc-200 shrink-0 bg-white">
            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-500 mb-2">
               <span className="flex items-center gap-1"><GitBranch size={12}/> 本地 Git 守护</span>
               <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">实时同步</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-500">
               <span className="flex items-center gap-1"><Database size={12}/> LanceDB 索引</span>
               <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">832 个块</span>
            </div>
         </div>
       </div>
       
       {/* Right Pane: Editor or Dashboard */}
       <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          {!activeDoc ? (
             // DASHBOARD
             <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                   <div className="mb-10">
                      <h1 className="text-3xl font-black text-zinc-900 mb-3 flex items-center gap-3">
                         本地知识库 <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wider align-middle">离线优先</span>
                      </h1>
                      <p className="text-[14px] text-zinc-500 font-medium leading-relaxed max-w-2xl">
                         基于 Tauri 的物理级离线存储，内置 LanceDB Serverless 向量引擎。无需上传云端，本地毫秒级索引。文件变更自动 Git 提交，并实时注入到 AI 工作台的 RAG 知识检索范围。
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-[#685FAB]/40 hover:shadow-md transition-all cursor-pointer group">
                         <div className="w-10 h-10 bg-purple-50 text-[#685FAB] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Import size={20} />
                         </div>
                         <h3 className="text-[15px] font-bold text-zinc-900 mb-1">挂载本地文件夹同步</h3>
                         <p className="text-[12px] text-zinc-500">自动实时静默扫描本地文件变更，3秒完成语义切片与向量建库同步，实现无感融合。</p>
                      </div>
                      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-[#685FAB]/40 hover:shadow-md transition-all cursor-pointer group">
                         <div className="w-10 h-10 bg-zinc-50 text-zinc-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <DownloadCloud size={20} />
                         </div>
                         <h3 className="text-[15px] font-bold text-zinc-900 mb-1">导入外部归档数据集</h3>
                         <p className="text-[12px] text-zinc-500">支持 HTML/PDF/Markdown 等外部来源压缩包，系统将自动清洗排版噪音，转换为标准原生大模型语料格式。</p>
                      </div>
                   </div>

                   <h3 className="text-[16px] font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">最近同步机制日志</h3>
                   <div className="space-y-3 pb-8">
                      {[
                          { action: '自动构建索引', target: '防敏感词过滤包.rag', time: '10分钟前', status: '完成' },
                          { action: 'Git Auto-Commit', target: '~/TapTik-Workspace/商家A', time: '1 小时前', status: '成功' },
                          { action: 'LanceDB 更新', target: '+ 42 Blocks', time: '3 小时前', status: '成功' }
                      ].map((log, i) => (
                         <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-50/50 rounded-lg border border-zinc-100 text-[13px]">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-zinc-400 border border-zinc-100 shadow-sm"><GitBranch size={14}/></div>
                               <div>
                                  <div className="font-bold text-zinc-900">{log.action} <span className="font-normal text-zinc-400 mx-1">/</span> <span className="text-[#685FAB]">{log.target}</span></div>
                                  <div className="text-[11px] text-zinc-400 mt-0.5">{log.time}</div>
                               </div>
                            </div>
                            <div className="text-emerald-600 font-bold flex items-center gap-1.5 mt-2 sm:mt-0"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {log.status}</div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col h-full bg-white">
               <div className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
                  <div className="flex items-center gap-2">
                     <FileText size={16} className="text-[#685FAB]" />
                     <span className="text-[14px] font-bold text-zinc-900">{activeDoc}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[11px] text-zinc-400 font-bold">最后编辑: 刚刚</span>
                     <button className="px-3 py-1 bg-[#685FAB] text-white text-[12px] font-bold rounded-lg shadow-sm">保 存</button>
                  </div>
               </div>
               <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
                  <div className="max-w-3xl mx-auto prose prose-zinc prose-sm">
                     <p className="text-zinc-400 italic">编辑器加载中 (本地离线 RAG 文本)...</p>
                  </div>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};
