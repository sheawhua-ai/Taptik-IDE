import React, { useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Camera,
  Trash2,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  MessageSquare,
  Package,
  HardDrive,
  Cloud,
  FolderOpen,
  FileVideo,
  ChevronRight,
  Database,
  Link,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MaterialStationProps {
  activeProject: any;
}

export const MaterialStation: React.FC<MaterialStationProps> = ({
  activeProject,
}) => {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [scope, setScope] = useState('all_projects');
  const [filter, setFilter] = useState('all');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 relative">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm">
              <ImageIcon size={18} />
            </div>
            <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">
              素材作战台
            </h2>
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[11px] font-medium ml-2">
              Taptik Desktop
            </span>
          </div>
          <div className="text-[12px] text-neutral-400 mt-0.5 ml-11">
            管理本地素材源、云端回传和项目可用素材，按需同步原文件。
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setActiveDrawer('source_detail')} className="px-3 py-1.5 flex items-center gap-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] hover:bg-neutral-50 transition-colors shadow-sm font-medium">
            <HardDrive size={14} className="text-neutral-400" />
            <span>添加本地素材源</span>
          </button>
          <button onClick={() => setActiveDrawer('cloud_manager')} className="px-3 py-1.5 flex items-center gap-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] hover:bg-neutral-50 transition-colors shadow-sm font-medium">
            <Cloud size={14} className="text-neutral-400" />
            <span>云端空间管家</span>
          </button>
          <button onClick={() => setActiveDrawer('gap_processing')} className="px-4 py-1.5 flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg text-[13px] hover:bg-neutral-800 transition-colors shadow-sm font-bold">
            <Zap size={14} />
            <span>处理素材卡点</span>
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-neutral-200 px-8 py-2 flex items-center gap-6 z-10 shrink-0">
        {[
          { id: 'all_projects', label: '全部项目' },
          { id: 'current_project', label: '当前项目' },
          { id: 'specified_project', label: '指定项目' },
          { id: 'long_term', label: '商家长期素材' },
          { id: 'pending_review', label: '待验收回传' },
          { id: 'consumed', label: '已消耗素材' }
        ].map(s => (
          <button 
            key={s.id}
            onClick={() => setScope(s.id)}
            className={`text-[13px] font-medium transition-colors relative py-2 ${scope === s.id ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            {s.label}
            {scope === s.id && (
              <motion.div layoutId="scope_indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
            
            {/* Layer 1: Material Asset Status Bar */}
            <div className="bg-white border border-neutral-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-5 text-[13px] flex-wrap">
                <div className="flex items-center gap-2">
                  <HardDrive size={15} className="text-indigo-500" />
                  <span className="text-neutral-600">已连接 <strong className="text-neutral-900">3</strong> 个本地源</span>
                </div>
                <div className="w-px h-4 bg-neutral-200 hidden md:block" />
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-indigo-500" />
                  <span className="text-neutral-600">索引 <strong className="text-neutral-900">18,240</strong> 个</span>
                </div>
                <div className="w-px h-4 bg-neutral-200 hidden md:block" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-neutral-600">未使用 <strong className="text-neutral-900">6,420</strong></span>
                </div>
                <div className="w-px h-4 bg-neutral-200 hidden md:block" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span className="text-neutral-600">已消耗 <strong className="text-neutral-900">1,280</strong></span>
                </div>
                <div className="w-px h-4 bg-neutral-200 hidden md:block" />
                <div className="flex items-center gap-2">
                  <ShieldAlert size={15} className="text-rose-500" />
                  <span className="text-neutral-600">疑似重复 <strong className="text-neutral-900">386</strong></span>
                </div>
                <div className="w-px h-4 bg-neutral-200 hidden lg:block" />
                <div className="flex items-center gap-2">
                  <Cloud size={15} className="text-emerald-500" />
                  <span className="text-neutral-600">云端回传 <strong className="text-neutral-900">126</strong></span>
                </div>
                <div className="w-px h-4 bg-neutral-200 hidden lg:block" />
                <div className="flex items-center gap-2 text-neutral-500">
                  <span>云端占用 8.2GB</span>
                </div>
              </div>
            </div>

            {/* Layer 2: Cross-Project Diagnostics */}
            {scope === 'all_projects' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-50/50 border border-primary-100 rounded-[20px] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
                  <Zap size={24} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-[16px] font-bold text-neutral-900">
                      当前 4 个进行中项目里，2 个项目存在素材卡点，影响 17 篇待发布内容。
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-3 py-1 bg-white border border-primary-200 rounded-lg text-[13px] font-medium text-primary-800 shadow-sm">封面缺口 6</span>
                    <span className="px-3 py-1 bg-white border border-primary-200 rounded-lg text-[13px] font-medium text-primary-800 shadow-sm">真实场景缺口 9</span>
                    <span className="px-3 py-1 bg-white border border-primary-200 rounded-lg text-[13px] font-medium text-primary-800 shadow-sm">短视频缺口 4</span>
                    <span className="px-3 py-1 bg-white border border-amber-200 rounded-lg text-[13px] font-medium text-amber-800 shadow-sm">待验收 12</span>
                    <span className="px-3 py-1 bg-white border border-rose-200 rounded-lg text-[13px] font-medium text-rose-800 shadow-sm">已用风险 5</span>
                  </div>
                  <p className="text-[13px] text-primary-900/80 font-medium">
                    <strong className="text-primary-900">AI 建议：</strong>建议先处理「幼犬换粮」和「成人肠胃调理」的封面缺口，可释放 9 篇可排期内容。
                  </p>
                </div>
                <button 
                  onClick={() => setActiveDrawer('gap_processing')}
                  className="px-6 py-3 bg-primary-600 text-white text-[14px] font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-md flex items-center gap-2 shrink-0 active:scale-95"
                >
                  处理跨项目素材卡点 <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-white border border-amber-200 rounded-[16px] p-5 shadow-sm">
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h4 className="font-bold text-[15px] text-neutral-900 mb-1">幼犬换粮避坑</h4>
                       <div className="text-[12px] text-neutral-500">覆盖度 62%｜影响 12 篇</div>
                     </div>
                     <button onClick={() => setActiveDrawer('gap_processing')} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-bold rounded-lg border border-amber-200 hover:bg-amber-100">处理缺口</button>
                   </div>
                   <div className="flex flex-wrap gap-2 text-[12px]">
                     <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">封面缺 2</span>
                     <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">真实场景缺 4</span>
                     <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">短视频缺 3</span>
                     <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100">已用风险 2</span>
                   </div>
                 </div>
                 <div className="bg-white border border-amber-200 rounded-[16px] p-5 shadow-sm">
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h4 className="font-bold text-[15px] text-neutral-900 mb-1">成人肠胃调理</h4>
                       <div className="text-[12px] text-neutral-500">覆盖度 74%｜影响 8 篇</div>
                     </div>
                     <button onClick={() => setActiveDrawer('gap_processing')} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-bold rounded-lg border border-amber-200 hover:bg-amber-100">处理缺口</button>
                   </div>
                   <div className="flex flex-wrap gap-2 text-[12px]">
                     <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">用户反馈缺 2</span>
                     <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">真实场景缺 3</span>
                   </div>
                 </div>
               </div>
            )}

            {/* Layer 3: Material Sources Area */}
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                素材来源库
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. 本地素材源 */}
                <div className="bg-white border border-neutral-200 rounded-[20px] p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                      <HardDrive size={16} className="text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-neutral-900">本地素材源</h4>
                      <p className="text-[12px] text-neutral-500">LanceDB 索引与缩略图</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-5 flex-1">
                    <div onClick={() => setActiveDrawer('source_detail')} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">商家素材文件夹</span>
                      </div>
                      <div className="text-[12px] text-neutral-500">12.5k</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">历史项目文件夹</span>
                      </div>
                      <div className="text-[12px] text-neutral-500">4.2k</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">下载素材文件夹</span>
                      </div>
                      <div className="text-[12px] text-amber-600 font-bold bg-amber-50 px-1.5 rounded">+86 待识别</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5">
                      <RefreshCw size={12} /> 重新扫描
                    </button>
                    <button onClick={() => setActiveDrawer('source_detail')} className="flex-1 py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-100 transition-colors">
                      查看源详情
                    </button>
                  </div>
                </div>

                {/* 2. 云端回传 */}
                <div className="bg-white border border-neutral-200 rounded-[20px] p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Cloud size={16} className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-neutral-900">云端回传池</h4>
                      <p className="text-[12px] text-neutral-500">外部收集与协作素材</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-5 flex-1">
                    <div onClick={() => setActiveDrawer('review_queue')} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50">
                      <div className="flex items-center gap-2">
                        <Camera size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">拍摄任务回传</span>
                      </div>
                      <div className="text-[12px] text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded border border-emerald-100">2 待验收</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cloud size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">外部领取回传</span>
                      </div>
                      <div className="text-[12px] text-neutral-500">12 份</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">客户上传反馈</span>
                      </div>
                      <div className="text-[12px] text-neutral-500">45 份</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => setActiveDrawer('review_queue')} className="flex-1 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={12} /> 验收素材
                    </button>
                    <button onClick={() => setActiveDrawer('cloud_manager')} className="flex-1 py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-100 transition-colors">
                      清理低质
                    </button>
                  </div>
                </div>

                {/* 3. 项目引用关系 */}
                <div className="bg-white border border-neutral-200 rounded-[20px] p-5 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                      <Link size={16} className="text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-neutral-900">多项目引用调度</h4>
                      <p className="text-[12px] text-neutral-500">已使用与复用管理</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-5 flex-1 relative z-10">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">已用于封面</span>
                      </div>
                      <div className="text-[12px] text-neutral-900 font-bold">18</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">已发布消耗</span>
                      </div>
                      <div className="text-[12px] text-neutral-900 font-bold">1,280</div>
                    </div>
                    <div onClick={() => setActiveDrawer('duplicate_check')} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between relative overflow-hidden cursor-pointer hover:bg-rose-50/50">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-400" />
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={16} className="text-neutral-400" />
                        <span className="text-[13px] font-bold text-neutral-800">跨项目复用风险</span>
                      </div>
                      <div className="text-[12px] text-rose-600 font-bold">36 需检查</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 relative z-10">
                    <button onClick={() => setActiveDrawer('duplicate_check')} className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm">
                      检查重复使用风险
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 4: Material Inventory Area */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2 shrink-0">
                  素材库存区
                </h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                  {[
                    {id: 'all', label: '全部'},
                    {id: 'unused', label: '未使用'},
                    {id: 'cover', label: '可做封面'},
                    {id: 'scene', label: '真实场景'},
                    {id: 'detail', label: '产品细节'},
                    {id: 'feedback', label: '用户反馈'},
                    {id: 'video', label: '短视频'},
                    {id: 'pending', label: '待验收'},
                    {id: 'consumed', label: '已消耗'},
                    {id: 'duplicate', label: '疑似重复'},
                  ].map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setFilter(t.id)}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors border ${filter === t.id ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-neutral-500 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                <AlertCircle size={14} className="text-indigo-500" />
                小红书规则：<strong className="text-neutral-700">已发布使用过的图片默认不再推荐给新笔记，系统将自动对疑似重复图片进行提示。</strong>
              </div>

              {/* Material Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
                  <div key={i} onClick={() => setActiveDrawer('material_detail')} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col">
                    <div className="aspect-square bg-neutral-100 relative">
                       {/* Mock Image Placeholder */}
                       <div className="absolute inset-0 flex items-center justify-center text-neutral-300 group-hover:scale-105 transition-transform duration-500">
                         <ImageIcon size={32} />
                       </div>
                       
                       {/* Top Left: Usage Status */}
                       <div className="absolute top-2 left-2 flex gap-1">
                          {i % 3 === 0 ? (
                            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-medium border border-white/20">未使用</span>
                          ) : i % 3 === 1 ? (
                            <span className="bg-neutral-800/80 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-medium border border-white/20">草稿引用</span>
                          ) : (
                            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-medium border border-white/20">已消耗</span>
                          )}
                       </div>

                       {/* Top Right: Sync Status */}
                       <div className="absolute top-2 right-2 flex gap-1">
                          {i % 2 === 0 ? (
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-medium border border-white/20" title="仅本地"><HardDrive size={10} /></span>
                          ) : (
                            <span className="bg-indigo-500/80 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-medium border border-white/20" title="原文件已同步"><Cloud size={10} /></span>
                          )}
                       </div>

                       {/* Bottom Left: Risk Status */}
                       <div className="absolute bottom-2 left-2 flex gap-1">
                         {i === 2 && (
                           <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm flex items-center gap-1">
                             <ShieldAlert size={10} /> 高风险复用
                           </span>
                         )}
                       </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <span className="bg-neutral-100 text-neutral-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-neutral-200">可做封面</span>
                          <span className="bg-neutral-50 text-neutral-500 text-[10px] px-1.5 py-0.5 rounded font-medium border border-neutral-100">换粮</span>
                        </div>
                        <div className="text-[12px] font-bold text-neutral-900 mb-1 truncate" title="IMG_8923_幼犬进食.HEIC">
                          IMG_8923...
                        </div>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        已用于 {i % 3 === 0 ? '0' : i % 3 === 1 ? '1' : '3'} 篇
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Drawer Overlays */}
        <AnimatePresence>
          {activeDrawer && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-20"
                onClick={() => setActiveDrawer(null)}
              />
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 z-30 shadow-2xl flex flex-col"
              >
                <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-white">
                  <h3 className="text-[16px] font-bold text-neutral-900">
                    {activeDrawer === 'source_detail' && '素材源详情'}
                    {activeDrawer === 'gap_processing' && '素材卡点处理'}
                    {activeDrawer === 'material_detail' && '素材详情'}
                    {activeDrawer === 'cloud_manager' && '云端空间管家'}
                    {activeDrawer === 'review_queue' && '待验收素材'}
                    {activeDrawer === 'duplicate_check' && '相似度诊断与去重'}
                  </h3>
                  <button onClick={() => setActiveDrawer(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa]">
                  {/* 1. 素材卡点处理 Drawer (Queue Style) */}
                  {activeDrawer === 'gap_processing' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-[13px] font-bold text-neutral-500 mb-2">
                         <span>第 1/5 个重点</span>
                         <button className="text-primary-600 hover:text-primary-700">跳过本条</button>
                      </div>
                      
                      <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded text-[12px] font-bold border border-rose-100">封面弱</span>
                           <span className="text-[14px] font-bold text-neutral-900">幼犬挑食其实是你的锅</span>
                        </div>
                        
                        <div className="aspect-video bg-neutral-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                           <ImageIcon size={48} className="text-neutral-300" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                             <div className="text-white text-[12px] font-medium">当前封面：吸引力诊断得分 45/100</div>
                           </div>
                        </div>

                        <p className="text-[13px] text-neutral-600 mb-6 leading-relaxed">
                          当前笔记选用的封面视觉冲击力不足，且与标题「挑食」的关联度较弱。AI 建议从图库中重新选择一张能清晰展示狗狗拒绝进食或挑食行为的真实场景图片。
                        </p>

                        <div className="space-y-3 border-t border-neutral-100 pt-5">
                           <h4 className="text-[13px] font-bold text-neutral-900">下一步链路建议：</h4>
                           <button className="w-full py-3 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                             去素材库重新选封面 <ChevronRight size={16} />
                           </button>
                           <button className="w-full py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                             派发新实拍任务 <ChevronRight size={16} />
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. 素材详情 Drawer */}
                  {activeDrawer === 'material_detail' && (
                    <div className="space-y-6">
                      <div className="aspect-square bg-neutral-100 rounded-[20px] flex items-center justify-center mb-6 relative overflow-hidden group border border-neutral-200">
                         <ImageIcon size={64} className="text-neutral-300" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-900 hover:scale-110 transition-transform">
                              <Search size={18} />
                            </button>
                         </div>
                      </div>

                      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                         <div className="flex justify-between items-start">
                            <h4 className="text-[15px] font-bold text-neutral-900 truncate">IMG_8923_幼犬进食.HEIC</h4>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[11px] font-bold border border-emerald-100 shrink-0">未使用</span>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 text-[13px]">
                           <div>
                             <div className="text-neutral-500 mb-1">文件大小</div>
                             <div className="font-medium text-neutral-900">4.2 MB</div>
                           </div>
                           <div>
                             <div className="text-neutral-500 mb-1">素材来源</div>
                             <div className="font-medium text-neutral-900 flex items-center gap-1"><FolderOpen size={14} className="text-neutral-400"/> 商家素材库</div>
                           </div>
                           <div>
                             <div className="text-neutral-500 mb-1">同步状态</div>
                             <div className="font-medium text-indigo-600 flex items-center gap-1"><Cloud size={14}/> 原文件已同步</div>
                           </div>
                           <div>
                             <div className="text-neutral-500 mb-1">AI 标签</div>
                             <div className="flex gap-1 flex-wrap">
                               <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">可做封面</span>
                               <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">换粮</span>
                             </div>
                           </div>
                         </div>
                      </div>

                      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-[14px] font-bold text-neutral-900 mb-3">使用历史 (已用于 3 篇)</h4>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between text-[13px] p-2 bg-neutral-50 border border-neutral-100 rounded-lg">
                              <span className="text-neutral-700 font-medium truncate pr-4">幼犬换粮期怎么度过</span>
                              <span className="text-neutral-400 shrink-0">2024-05-12</span>
                           </div>
                           <div className="flex items-center justify-between text-[13px] p-2 bg-neutral-50 border border-neutral-100 rounded-lg">
                              <span className="text-neutral-700 font-medium truncate pr-4">新手养狗必看</span>
                              <span className="text-neutral-400 shrink-0">2024-04-28</span>
                           </div>
                           <div className="flex items-center justify-between text-[13px] p-2 bg-neutral-50 border border-neutral-100 rounded-lg">
                              <span className="text-neutral-700 font-medium truncate pr-4">这款狗粮到底好不好</span>
                              <span className="text-neutral-400 shrink-0">2024-03-15</span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <button className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                          插入当前项目
                        </button>
                        <button className="px-4 py-3 bg-white border border-neutral-200 text-rose-600 rounded-xl text-[13px] font-bold hover:bg-rose-50 transition-colors shadow-sm">
                          删除
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. 素材源详情 Drawer */}
                  {activeDrawer === 'source_detail' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <FolderOpen size={24} className="text-indigo-500" />
                          </div>
                          <div>
                            <h4 className="text-[16px] font-bold text-neutral-900">商家原始素材库</h4>
                            <p className="text-[13px] text-neutral-500">/Users/admin/Documents/Taptik/Assets</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
                             <div className="text-[12px] text-neutral-500 mb-1">本地文件数</div>
                             <div className="text-[20px] font-bold text-neutral-900">12,542</div>
                           </div>
                           <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
                             <div className="text-[12px] text-neutral-500 mb-1">LanceDB 索引量</div>
                             <div className="text-[20px] font-bold text-indigo-600">12,542</div>
                           </div>
                           <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
                             <div className="text-[12px] text-neutral-500 mb-1">已同步原文件</div>
                             <div className="text-[20px] font-bold text-emerald-600">420</div>
                           </div>
                           <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
                             <div className="text-[12px] text-neutral-500 mb-1">最后扫描时间</div>
                             <div className="text-[14px] font-bold text-neutral-900 mt-1">10 分钟前</div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <h5 className="text-[13px] font-bold text-neutral-900">自动同步策略</h5>
                           <label className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                              <div>
                                <div className="text-[13px] font-bold text-neutral-900">仅本地索引与缩略图 (推荐)</div>
                                <div className="text-[11px] text-neutral-500 mt-0.5">使用 LanceDB 本地检索，仅使用时上传原文件</div>
                              </div>
                              <input type="radio" name="syncStrategy" defaultChecked className="w-4 h-4 text-primary-600" />
                           </label>
                           <label className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                              <div>
                                <div className="text-[13px] font-bold text-neutral-900">全量同步原文件到云端</div>
                                <div className="text-[11px] text-neutral-500 mt-0.5">适合多设备协作，消耗较多云端空间</div>
                              </div>
                              <input type="radio" name="syncStrategy" className="w-4 h-4 text-primary-600" />
                           </label>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                          <RefreshCw size={16} /> 立即强制重新扫描
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. 云端空间管家 Drawer */}
                  {activeDrawer === 'cloud_manager' && (
                    <div className="space-y-6">
                       <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm text-center">
                          <Cloud size={48} className="text-indigo-500 mx-auto mb-4" />
                          <h4 className="text-[18px] font-bold text-neutral-900 mb-1">云端存储空间</h4>
                          <div className="text-[13px] text-neutral-500 mb-4">已使用 8.2GB / 总计 50GB</div>
                          
                          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-indigo-500 w-[15%]" title="原文件 1.2GB" />
                            <div className="h-full bg-emerald-500 w-[5%]" title="回传素材 400MB" />
                            <div className="h-full bg-amber-500 w-[2%]" title="待清理垃圾 150MB" />
                          </div>
                          
                          <div className="flex justify-center gap-4 mt-4 text-[12px]">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"/> 项目引用原文件</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/> 回传池素材</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"/> 可清理内容</div>
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <h5 className="text-[14px] font-bold text-neutral-900">存储优化建议</h5>
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                            <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-[13px] font-bold text-amber-900">有 150MB 低质或重复素材可清理</div>
                              <div className="text-[12px] text-amber-700 mt-1 mb-3">包含外部回传中被标记为废片的素材，以及长期未使用的相似素材。</div>
                              <button className="px-4 py-2 bg-white text-amber-700 border border-amber-200 rounded-lg text-[12px] font-bold hover:bg-amber-100 transition-colors shadow-sm">一键清理</button>
                            </div>
                          </div>
                          <div className="p-4 bg-white border border-neutral-200 rounded-xl flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-neutral-400 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-[13px] font-bold text-neutral-900">历史项目归档建议</div>
                              <div className="text-[12px] text-neutral-500 mt-1">「618大促」项目已结束 3 个月，建议将云端原文件降级为仅保留本地及缩略图，可释放 2.4GB 空间。</div>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* 5. 待验收素材 Drawer */}
                  {activeDrawer === 'review_queue' && (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between text-[13px] font-bold text-neutral-500 mb-2">
                          <span>待验收 2 份素材</span>
                       </div>
                       
                       {[1, 2].map((item, i) => (
                         <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                           <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                             <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                               <Camera size={16} className="text-neutral-500" />
                             </div>
                             <div>
                               <div className="text-[14px] font-bold text-neutral-900">达人实拍任务回传</div>
                               <div className="text-[12px] text-neutral-500">2024-05-18 14:30</div>
                             </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                             <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center"><ImageIcon size={24} className="text-neutral-300"/></div>
                             <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center"><ImageIcon size={24} className="text-neutral-300"/></div>
                           </div>
                           <div className="flex gap-2 pt-2">
                             <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[13px] font-bold hover:bg-emerald-100 transition-colors">通过并入库</button>
                             <button className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-[13px] font-bold hover:bg-rose-100 transition-colors">驳回重拍</button>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}

                  {/* 6. 相似度诊断与去重 Drawer */}
                  {activeDrawer === 'duplicate_check' && (
                    <div className="space-y-6">
                       <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
                          <ShieldAlert size={18} className="text-rose-600 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[13px] font-bold text-rose-900">发现 36 组疑似重复或过度复用的素材</div>
                            <div className="text-[12px] text-rose-700 mt-1">小红书对高频重复使用的图片会限流，建议您确认并处理以下高度相似的素材组。</div>
                          </div>
                       </div>

                       {[1, 2, 3].map((group, i) => (
                         <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                           <div className="flex items-center justify-between text-[13px]">
                             <span className="font-bold text-neutral-900">相似组 {i + 1} <span className="text-neutral-500 font-normal">相似度 98%</span></span>
                             <button className="text-primary-600 font-bold hover:text-primary-700">仅保留最优</button>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center relative border-2 border-emerald-500">
                                  <ImageIcon size={24} className="text-neutral-300"/>
                                  <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">建议保留</div>
                                </div>
                                <div className="text-[11px] text-neutral-500 text-center">高清原图 / 4.2MB</div>
                              </div>
                              <div className="space-y-2">
                                <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center relative">
                                  <ImageIcon size={24} className="text-neutral-300"/>
                                  <div className="absolute top-1 left-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">压缩版</div>
                                </div>
                                <div className="text-[11px] text-neutral-500 text-center">压缩图 / 800KB</div>
                              </div>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

