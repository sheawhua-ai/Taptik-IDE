import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Target, ArrowUpRight, CheckCircle2, Activity, Send, 
  Package, X, Calendar, ArrowRight, PenTool, Play, Camera, CalendarClock,
  Image as ImageIcon, Sparkles, CheckSquare, Settings, ChevronLeft,
  Users, MoreVertical, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BatchProject {
  id: string;
  project: string;
  target: string;
  totalCount: number;
  completedCount: number;
}

interface NoteDraft {
  id: string;
  title: string;
  content: string;
  imageType: 'official' | 'real_shoot' | 'pending';
  status: 'drafting' | 'review' | 'dispatched' | 'scheduled';
  selected?: boolean;
}

export default function MerchantMatrix() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [activeBatch, setActiveBatch] = useState<BatchProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drafts, setDrafts] = useState<NoteDraft[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'collaboration'>('content');

  useEffect(() => {
    const handleOpenCreate = () => {
      setActiveProject(null);
      setIsCreatingProject(true);
    };
    window.addEventListener('nav-to-create-project', handleOpenCreate);
    return () => window.removeEventListener('nav-to-create-project', handleOpenCreate);
  }, []);

  const MOCK_PROJECTS = [
    { 
      id: 'p1', 
      name: '蕉下 - 夏日防晒种草季', 
      status: '进行中',
      progress: 65,
      stages: [
        { name: '定调企划', status: 'completed', value: '12组内容方向已锁定' },
        { name: '素材生成', status: 'active', value: '45/100 篇初稿已产出' },
        { name: '矩阵发布', status: 'pending', value: '预计明日开启' },
        { name: '沉淀与复盘', status: 'pending', value: '-' },
        { name: '数据归因', status: 'pending', value: '-' },
      ],
      kpis: { views: '124k', engagement: '8.2k', leads: '¥3.20' }
    },
    { 
      id: 'p2', 
      name: '花西子 - 七夕礼盒首发', 
      status: '已完成',
      progress: 100,
      stages: [
        { name: '定调企划', status: 'completed', value: '完成' },
        { name: '素材生成', status: 'completed', value: '完成' },
        { name: '矩阵发布', status: 'completed', value: '120 KOC覆盖' },
        { name: '沉淀与复盘', status: 'completed', value: '长尾流量收录占比89%' },
        { name: '数据归因', status: 'completed', value: 'CPE降至 ¥1.27' },
      ],
      kpis: { views: '890k', engagement: '45k', leads: '¥1.27' }
    }
  ];

  const pendingBatches: BatchProject[] = [
    { id: 'B1', project: '阶段一：冷启动', target: '跑通账号防晒标签，提升基础社区收录率', totalCount: 25, completedCount: 0 },
    { id: 'B2', project: '阶段二：心智种草期', target: '测试垂直穿搭/美妆流量池，沉淀转化素材', totalCount: 40, completedCount: 0 },
    { id: 'B3', project: '阶段三：搜索卡位期', target: '集中占据防晒推荐搜索占位，获取长尾流量', totalCount: 60, completedCount: 0 },
  ];

  const handleStartBatch = (batch: BatchProject) => {
    setActiveBatch(batch);
    setIsGenerating(true);
    setProgress(0);
    setDrafts([]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 12;
      if (currentProgress >= 100) {
        clearInterval(interval);
        generateMocks(batch);
        setIsGenerating(false);
        setProgress(100);
      } else {
        setProgress(currentProgress);
      }
    }, 400);
  };

  const generateMocks = (batch: BatchProject) => {
    const mocks: NoteDraft[] = Array.from({ length: 6 }).map((_, i) => ({
      id: `ND-${i + 1}`,
      title: i % 2 === 0 ? '一秒入夏必备！通勤挖到的防晒神仙单品☀️' : '早八党福音，清爽不油腻的防晒测评来了！',
      content: '夏天真的不能没有它！最近挖到的宝藏神器，不仅肤感清爽不拔干，而且力度也是绝绝子！\n\n测试了一周，平时通勤或者周末出去玩完全够用...',
      imageType: 'pending',
      status: 'review',
      selected: false
    }));
    setDrafts(mocks);
  };

  const toggleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setDrafts(drafts.map(d => ({ ...d, selected: newState })));
  };

  const toggleSelect = (id: string) => {
    setDrafts(drafts.map(d => d.id === id ? { ...d, selected: !d.selected } : d));
  };

  const handleBulkDispatch = () => {
    setDrafts(drafts.map(d => d.selected ? { ...d, imageType: 'real_shoot', status: 'dispatched', selected: false } : d));
    setSelectAll(false);
  };

  const handleBulkSchedule = () => {
    setDrafts(drafts.map(d => d.selected ? { ...d, status: 'scheduled', selected: false } : d));
    setSelectAll(false);
  };

  const selectedCount = drafts.filter(d => d.selected).length;

  if (activeProject) {
    const project = MOCK_PROJECTS.find(p => p.id === activeProject) || MOCK_PROJECTS[0];
    return (
      <div className="flex flex-col h-full bg-neutral-50/50 overflow-hidden">
        {/* Project Generation Header */}
        <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => { setActiveProject(null); setActiveBatch(null); }}
                className="w-10 h-10 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                 <ChevronLeft size={20} />
              </button>
              <div>
                 <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">{project.name}</h2>
                 <p className="text-[11px] font-bold text-neutral-400 mt-0.5">项目内容生产车间</p>
              </div>
           </div>
           
           {activeBatch && !isGenerating && drafts.length > 0 && (
             <button 
               onClick={() => setActiveBatch(null)} 
               className="px-5 py-2 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-[13px] font-black text-neutral-500 transition-colors bg-white shadow-sm"
             >
               返回待生产批次
             </button>
           )}
        </div>

         {/* Tab Navigation */}
         {!activeBatch && (
            <div className="px-8 pt-4 pb-0 bg-white border-b border-neutral-100 flex items-center gap-8 z-10 shrink-0">
               <button 
                  onClick={() => setActiveTab('content')}
                  className={`pb-4 text-[13px] font-black transition-all relative ${activeTab === 'content' ? 'text-neutral-900 border-b-2 border-primary-500' : 'text-neutral-400 hover:text-neutral-600'}`}
               >
                  批量成稿批次
               </button>
               <button 
                  onClick={() => setActiveTab('collaboration')}
                  className={`pb-4 text-[13px] font-black transition-all relative ${activeTab === 'collaboration' ? 'text-neutral-900 border-b-2 border-primary-500' : 'text-neutral-400 hover:text-neutral-600'}`}
               >
                  项目全景日历与协同
               </button>
            </div>
         )}
         <div className="flex-1 flex overflow-hidden">
           {activeTab === 'collaboration' && !activeBatch ? (
             <div className="flex-1 flex flex-col p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-5xl mx-auto w-full space-y-8">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-2xl font-black text-neutral-900 tracking-tight">日历排期与团队协作</h3>
                       <p className="text-[13px] font-bold text-neutral-400 mt-2">打通小红书内容生产全链路节点，分配团队撰稿、美工与投放人员。</p>
                     </div>
                     <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-black shadow-lg hover:bg-neutral-800 transition-colors">
                        + 添加成员
                     </button>
                   </div>

                   <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      <div className="xl:col-span-2 space-y-6">
                         <div className="bg-white p-8 rounded-[24px] border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                            <div className="flex items-center justify-between mb-8">
                               <h4 className="text-[16px] font-black text-neutral-900 flex items-center gap-2">
                                  <CalendarDays size={18} className="text-primary-500" /> 
                                  当月行动排期 (主线进度)
                               </h4>
                            </div>
                            <div className="grid grid-cols-7 gap-3 mb-6">
                               {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map((d, i) => (
                                 <div key={i} className="text-center text-[12px] font-black text-neutral-400 mb-2">{d}</div>
                               ))}
                               {[...Array(35)].map((_, i) => {
                                 const isEvent = i % 8 === 0 && i !== 0;
                                 return (
                                   <div key={i} className={`aspect-square rounded-[16px] border flex flex-col items-start justify-between p-3 relative cursor-pointer group ${isEvent ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-neutral-100 bg-white hover:border-neutral-300 transition-colors'}`}>
                                     <span className={`text-[12px] font-black ${isEvent ? 'text-primary-600' : 'text-neutral-600'}`}>{i + 1 > 31 ? i - 31 : i + 1}</span>
                                     {isEvent && <div className="text-[10px] font-bold text-primary-500 leading-tight">首批素材<br/>验收</div>}
                                   </div>
                                 );
                               })}
                            </div>
                         </div>
                      </div>
                      
                      <div className="space-y-6">
                         <div className="bg-white p-8 rounded-[24px] border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                            <h4 className="text-[13px] font-black text-neutral-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                               <Users size={16} className="text-neutral-400" />
                               项目参与人员与分工
                            </h4>
                            <div className="space-y-5">
                               {[
                                 { role: '内容编导 / 主责', name: '王梦 (AI辅助)', av: 'W', id: '@wm_01' },
                                 { role: '小红书投手 / 投放', name: '张强', av: 'Z', id: '@zq_ops' },
                                 { role: '商务对接 / 审核', name: '李静', av: 'L', id: '@lj_sales' }
                               ].map((u, i) => (
                                 <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-neutral-50 p-2 -mx-2 rounded-xl transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center font-black text-[13px] shrink-0 border-2 border-white shadow-sm group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">{u.av}</div>
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center gap-2">
                                          <div className="text-[14px] font-black text-neutral-900 group-hover:text-primary-500 transition-colors truncate">{u.name}</div>
                                          {i === 0 && <span className="bg-primary-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black">Owner</span>}
                                       </div>
                                       <div className="text-[11px] font-bold text-neutral-400 truncate mt-0.5">{u.role}</div>
                                    </div>
                                    <button className="text-neutral-300 hover:text-neutral-900 p-1"><MoreVertical size={16} /></button>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ) : !activeBatch && activeTab === 'content' ? (
              <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                 <div className="max-w-4xl mx-auto w-full space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-neutral-900 tracking-tight">待处理生产批次</h3>
                      <p className="text-[12px] font-bold text-neutral-400 mt-1.5">系统已根据 {project.name} 的排期日历，为您汇总需要生成内容的批次任务。</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                       {pendingBatches.map((batch, index) => (
                          <div key={batch.id} className="bg-white p-4 lg:p-5 rounded-[16px] border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between hover:border-primary-500/30 hover:shadow-md transition-all group gap-4">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex flex-col items-center justify-center text-neutral-500 border border-neutral-100 shrink-0">
                                  <span className="font-black text-[15px] leading-none">{batch.totalCount}</span>
                                  <span className="text-[9px] uppercase tracking-widest mt-0.5">篇</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                   <div className="flex items-center gap-2 mb-1.5">
                                      <span className="text-[9px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-md tracking-widest uppercase">阶段批次 {index + 1}</span>
                                      <h4 className="text-[14px] font-black text-neutral-900 truncate">{batch.project}</h4>
                                   </div>
                                   <p className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5 truncate">
                                      <Target size={12} className="shrink-0" /> 目标：{batch.target}
                                   </p>
                                </div>
                             </div>
                             <button onClick={() => handleStartBatch(batch)} className="w-full md:w-auto px-5 py-2.5 bg-neutral-900 text-white text-[12px] font-black rounded-xl hover:bg-primary-500 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2 shrink-0">
                                <Play size={14} fill="currentColor" /> 启动生产
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
                 {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                       <div className="relative w-24 h-24 mb-8">
                          <svg className="animate-spin w-full h-full text-neutral-100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" />
                          </svg>
                          <svg className="absolute inset-0 w-full h-full text-primary-500 origin-center -rotate-90" viewBox="0 0 100 100">
                            <circle 
                              cx="50" cy="50" r="45" fill="none" strokeWidth="8" 
                              strokeDasharray="283" 
                              strokeDashoffset={283 - (progress / 100) * 283} 
                              className="transition-all duration-300 ease-out" 
                              strokeLinecap="round" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Sparkles size={28} className="text-primary-500 animate-pulse" />
                          </div>
                       </div>
                       <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">正在批量构建笔记初稿...</h3>
                       <p className="text-[14px] font-bold text-neutral-400 mt-3 text-center">
                         进度 {progress.toFixed(0)}% <br/>
                         <span className="text-[12px] opacity-70">正在调用知识库防查重与敏感词过滤引擎</span>
                       </p>
                    </div>
                 ) : (
                    <div className="flex flex-col h-full">
                       <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                          <div className="flex items-center gap-4">
                             <button 
                               onClick={toggleSelectAll}
                               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm ${selectAll ? 'bg-primary-500 text-white' : 'bg-white border text-neutral-400 hover:bg-neutral-50'}`}
                             >
                                <CheckSquare size={18} />
                             </button>
                             <div>
                                <p className="text-[14px] font-black text-neutral-900">
                                   已选中 {selectedCount} 篇
                                </p>
                                <p className="text-[11px] font-bold text-neutral-400 mt-0.5">
                                   共 {activeBatch.totalCount} 篇已完成撰写，请确认配图并分配到待分发素材库。
                                </p>
                             </div>
                          </div>

                          <div className="flex items-center gap-3">
                             <button 
                               onClick={handleBulkDispatch}
                               disabled={selectedCount === 0}
                               className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-black hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                             >
                                <Camera size={16} /> 批量下发导购实拍 ({selectedCount})
                             </button>
                             <button 
                               onClick={handleBulkSchedule}
                               disabled={selectedCount === 0}
                               className="px-5 py-3 bg-neutral-900 text-white rounded-xl text-[13px] font-black hover:bg-primary-500 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
                             >
                                <CalendarClock size={16} /> 入库至待分发列队 ({selectedCount})
                             </button>
                          </div>
                       </div>

                       <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-neutral-50/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                             {drafts.map((draft, i) => (
                                <div 
                                  key={draft.id} 
                                  onClick={() => toggleSelect(draft.id)}
                                  className={`bg-white rounded-[16px] border-2 transition-all cursor-pointer relative flex flex-col h-[260px] ${draft.selected ? 'border-primary-500 ring-4 ring-primary-500/10 shadow-lg' : 'border-neutral-200 hover:border-neutral-300'}`}
                                >
                                   <div className="p-3 lg:p-4 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/30 rounded-t-[14px]">
                                      <div className="flex-1 min-w-0 pr-3">
                                         <div className="flex items-center gap-1.5 mb-1.5">
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest bg-neutral-200 text-neutral-600">
                                              #{i + 1}
                                            </span>
                                            {draft.status === 'scheduled' && (
                                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest bg-primary-100 text-primary-600 flex items-center gap-1">
                                                 <CalendarClock size={10} /> 已入库
                                              </span>
                                            )}
                                            {draft.status === 'dispatched' && (
                                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest bg-emerald-100 text-emerald-600 flex items-center gap-1">
                                                 <Camera size={10} /> 待回传
                                              </span>
                                            )}
                                         </div>
                                         <h4 className="text-[13px] font-black text-neutral-900 leading-snug line-clamp-2">
                                            {draft.title}
                                         </h4>
                                      </div>
                                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${draft.selected ? 'bg-primary-500 text-white' : 'border border-neutral-300 text-transparent'}`}>
                                         <CheckCircle2 size={12} className={draft.selected ? 'opacity-100' : 'opacity-0'} />
                                      </div>
                                   </div>
                                   
                                   <div className="p-3 lg:p-4 flex-1 flex flex-col justify-between overflow-hidden">
                                      <div>
                                         <p className="text-[11px] font-bold text-neutral-500 leading-relaxed line-clamp-4">
                                            {draft.content}
                                         </p>
                                      </div>
                                      <div className="mt-3 flex items-center gap-2">
                                         <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-400">
                                            {draft.imageType === 'pending' ? <ImageIcon size={12} /> : draft.imageType === 'real_shoot' ? <Camera size={12} className="text-emerald-500" /> : <ImageIcon size={12} className="text-primary-500" />}
                                         </span>
                                         <span className="text-[10px] font-bold text-neutral-400">
                                            {draft.imageType === 'pending' ? '未分配素材' : draft.imageType === 'real_shoot' ? '实拍中' : '已匹配图片'}
                                         </span>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar pb-24">
      <div className="max-w-6xl mx-auto space-y-6 p-6 lg:p-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">项目运营与团队协作</h2>
          <p className="text-[13px] text-neutral-400 font-bold">跟踪小红书运营项目的全链路进展、日历排期，并在项目中指派任务进行内容的批量成稿</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_PROJECTS.map(project => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 flex flex-col xl:flex-row bg-white border border-neutral-100 rounded-[20px] hover:shadow-xl transition-all group overflow-hidden relative gap-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 xl:w-2/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-neutral-900 mb-1">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${project.status === '进行中' ? 'bg-primary-50 text-primary-500' : 'bg-success-50 text-success-600'}`}>
                        {project.status}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-bold">进度 {project.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-4 border-l-2 border-neutral-50 shrink-0">
                   <div className="flex items-center justify-between gap-6">
                     <span className="text-[10px] font-black text-neutral-400 tracking-widest">曝光</span>
                     <span className="text-[13px] font-black text-neutral-900">{project.kpis.views}</span>
                   </div>
                   <div className="flex items-center justify-between gap-6">
                     <span className="text-[10px] font-black text-neutral-400 tracking-widest">互动</span>
                     <span className="text-[13px] font-black text-neutral-900">{project.kpis.engagement}</span>
                   </div>
                   <div className="flex items-center justify-between gap-6">
                     <span className="text-[10px] font-black text-neutral-400 tracking-widest">CPE</span>
                     <span className="text-[13px] font-black text-primary-500">{project.kpis.leads}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-stretch -mx-1 flex-1 min-w-0">
                {project.stages.map((stage, idx) => (
                  <React.Fragment key={idx}>
                     <div className={`p-3 flex-1 rounded-[16px] border transition-all flex flex-col justify-center min-w-0 ${stage.status === 'completed' ? 'bg-success-50/30 border-success-100' : stage.status === 'active' ? 'bg-white border-primary-500 shadow-sm' : 'bg-neutral-50/50 border-neutral-100 opacity-60'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                           <div className={`text-[9px] font-black uppercase tracking-widest ${stage.status === 'completed' ? 'text-success-600' : stage.status === 'active' ? 'text-primary-500' : 'text-neutral-400'}`}>
                           STG {idx + 1}
                           </div>
                           {stage.status === 'completed' && <CheckCircle2 size={12} className="text-success-500 shrink-0 ml-1" />}
                           {stage.status === 'active' && <Activity size={12} className="text-primary-500 animate-pulse shrink-0 ml-1" />}
                        </div>
                        <div className="text-[12px] font-black text-neutral-900 truncate mb-0.5">{stage.name}</div>
                        <div className="text-[9px] font-bold text-neutral-400 truncate w-full">{stage.value}</div>
                     </div>
                     {idx < project.stages.length - 1 && (
                        <div className="flex items-center justify-center -mx-2.5 z-10 w-5 shrink-0">
                           <button 
                             title="触发指令串联"
                             className={`w-5 h-5 rounded-full bg-white border shadow-sm flex items-center justify-center transition-all group ${stage.status === 'completed' ? 'border-primary-200 text-primary-500 hover:scale-110 hover:bg-primary-50' : 'border-neutral-200 text-neutral-300 hover:text-neutral-600'}`}
                           >
                              <Send size={8} className="group-hover:translate-x-0.5 transition-transform" />
                           </button>
                        </div>
                     )}
                  </React.Fragment>
                ))}
              </div>
              
               <div className="flex items-center justify-end xl:w-auto xl:pl-4">
                   <button 
                     onClick={() => setActiveProject(project.id)}
                     className="w-full xl:w-auto px-5 py-2.5 bg-neutral-900 text-white rounded-[14px] text-[12px] font-black transition-all flex items-center justify-center gap-2 hover:bg-primary-500 shadow-lg active:scale-95 whitespace-nowrap"
                   >
                     <PenTool size={14} />
                     成稿车间
                   </button>
               </div>
            </motion.div>
          ))}
        </div>

        <button 
           onClick={() => setIsCreatingProject(true)}
           className="w-full py-4 bg-white border border-dashed border-neutral-200 rounded-[20px] text-[13px] font-black text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2"
        >
           <PlusCircle size={18} /> 启动新项目
        </button>

        {/* Create Project Overlay Modal */}
        <AnimatePresence>
          {isCreatingProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex justify-end p-4"
            >
              <motion.div 
                 initial={{ x: '100%', opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: '100%', opacity: 0 }}
                 transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                 className="w-full max-w-3xl bg-white h-full rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
              >
                 <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
                          <Package size={20} />
                       </div>
                       <h2 className="text-xl font-black text-neutral-900 tracking-tight">创建新项目</h2>
                    </div>
                    <button onClick={() => setIsCreatingProject(false)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors">
                       <X size={20} />
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/30 custom-scrollbar space-y-10">
                    <div className="space-y-6">
                       <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                          <Target size={18} className="text-neutral-400" /> 1. 项目与目标立项
                       </h3>
                       <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                             <label className="text-[11px] font-bold text-neutral-400 uppercase">关联客户/项目主账号</label>
                             <select className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] font-black outline-none focus:border-primary-500 transition-colors">
                               <option>奈雪的茶 (NX-001)</option>
                               <option>霸王茶姬 (BW-022)</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-bold text-neutral-400 uppercase">项目名称</label>
                             <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] font-black outline-none focus:border-primary-500 transition-colors" />
                          </div>
                          <div className="col-span-2 space-y-2">
                             <label className="text-[11px] font-bold text-neutral-400 uppercase">核心运营目标</label>
                             <textarea 
                               rows={2} 
                               placeholder="描述您的期望，例如：'想在下个月提升防晒品类的搜索占位，需要大批量真实素人测评'..." 
                               className="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-[14px] font-bold outline-none focus:border-primary-500 transition-colors resize-none"
                             />
                          </div>
                          <div className="col-span-2 mt-1">
                             <button className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-[13px] font-black flex items-center gap-2 hover:bg-primary-500 transition-all shadow-lg active:scale-95 group border-0">
                                <Sparkles size={16} className="text-primary-400 group-hover:text-white transition-colors" /> 智能排期助手分析目标
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-neutral-200/50">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                             <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={18} className="text-neutral-400" /> 2. 阶段性周期排期与指标任务
                             </h3>
                             <span className="text-[10px] font-black text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-md shadow-sm">可手动微调</span>
                          </div>
                          <p className="text-[12px] font-bold text-neutral-400 ml-6">系统已根据目标智能规划出最优发布节奏与所需的笔记规模。</p>
                       </div>
                       
                       <div className="space-y-4">
                          {[
                             { period: '冷启动与收录期', notes: '25 篇', target: '跑通账号防晒标签，提升基础社区收录率' },
                             { period: '心智种草与互动期', notes: '40 篇', target: '测试垂直穿搭/美妆流量池，沉淀转化素材' },
                             { period: '搜索卡位与爆发期', notes: '60 篇', target: '集中占据防晒推荐搜索占位，获取长尾流量' }
                          ].map((m, i) => (
                             <div key={i} className="bg-white p-6 rounded-[24px] border border-neutral-200 hover:border-primary-500/30 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center gap-5">
                                <div className="w-10 h-10 bg-neutral-100 rounded-[12px] flex items-center justify-center text-neutral-500 font-black text-[15px] shrink-0">
                                   {i + 1}
                                </div>
                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                                   <div className="md:col-span-1">
                                     <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 block">阶段定义</label>
                                     <input defaultValue={m.period} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] font-black outline-none focus:bg-white focus:border-primary-500 transition-colors" />
                                   </div>
                                   <div className="md:col-span-1">
                                     <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 block">目标产量</label>
                                     <input defaultValue={m.notes} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] font-black outline-none focus:bg-white focus:border-primary-500 transition-colors" />
                                   </div>
                                   <div className="md:col-span-2">
                                     <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 block">阶段核心目标 (KPI)</label>
                                     <input defaultValue={m.target} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] font-black outline-none focus:bg-white focus:border-primary-500 transition-colors" />
                                   </div>
                                </div>
                             </div>
                          ))}
                          <button className="w-full py-5 border-2 border-dashed border-neutral-200 rounded-[24px] text-[13px] font-black text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50 transition-colors">
                             + 手动增加周期排期
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="h-24 border-t border-neutral-100 bg-white flex items-center justify-between px-8 shrink-0">
                    <div className="text-[12px] font-bold text-neutral-400 flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl">
                       <div className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </div>
                       已默认关联当前商家 IP规范与敏感词拦截库
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={() => setIsCreatingProject(false)} className="px-6 py-3.5 rounded-xl text-[14px] font-black text-neutral-500 hover:bg-neutral-100 transition-colors">
                          取消
                       </button>
                       <button onClick={() => setIsCreatingProject(false)} className="px-8 py-3.5 bg-primary-500 text-white rounded-xl text-[14px] font-black hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2">
                          确认创建并生成排期任务 <ArrowRight size={16} />
                       </button>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
