import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ContentReviewWorkbench } from './ContentReviewWorkbench';
import { InteractionWorkbench } from './InteractionWorkbench';
import { ShootingAndUploadWorkbench } from './ShootingAndUploadWorkbench';
import { PublishExceptionWorkbench } from './PublishExceptionWorkbench';

import {
  AlertTriangle, AlertCircle, MessageSquare, Image as ImageIcon,
  CheckCircle2, X, FileText, User, History, ShieldAlert,
  Zap, ArrowRight, Database, Filter, Check, Sparkles, Clock, Pause, RefreshCw, ChevronDown, FolderOpen, UserPlus, Maximize2, Minimize2, PlayCircle, BookOpen, Send, LayoutList, Layers, Network, ZapOff, CheckCircle, RotateCcw, AlertOctagon, Eye, Plus, MoreHorizontal, Info, Camera
} from "lucide-react";
import { NoteEditor, TextSelection } from "./NoteEditor";

interface Task {
  id: string;
  moduleName: string;
  importantResult: string;
  statusQuick: number;
  statusAction: number;
  statusWait: number;
  projectsDesc: string;
  aiWork: string;
  mainAction: string;
}

const TASKS: Task[] = [
  {
    id: "t1", moduleName: "内容审核", importantResult: "12 篇笔记需要处理",
    statusQuick: 8, statusAction: 4, statusWait: 6,
    projectsDesc: "幼犬换粮等 3 个项目",
    aiWork: "已完成事实检查和同质化检查",
    mainAction: "进入内容审核"
  },
  {
    id: "t2", moduleName: "素材与回传", importantResult: "16 项拍摄回传待处理",
    statusQuick: 4, statusAction: 12, statusWait: 5,
    projectsDesc: "门店KOC矩阵等 2 个项目",
    aiWork: "已智能分拆场景和素材需求",
    mainAction: "进入素材与回传"
  },
  {
    id: "t3", moduleName: "发布与账号", importantResult: "2 篇发布失败需处理",
    statusQuick: 0, statusAction: 2, statusWait: 1,
    projectsDesc: "日常种草A组",
    aiWork: "已定位发布异常及风控原因",
    mainAction: "进入发布与账号"
  },
  {
    id: "t4", moduleName: "互动承接", importantResult: "18 条互动待处理",
    statusQuick: 12, statusAction: 6, statusWait: 2,
    projectsDesc: "双十一冲刺企划",
    aiWork: "已匹配高优话术并识别意图",
    mainAction: "进入互动承接"
  },
  {
    id: "t5", moduleName: "异常与风险", importantResult: "1 条高风险负面评论",
    statusQuick: 0, statusAction: 1, statusWait: 0,
    projectsDesc: "幼犬换粮搜索卡位",
    aiWork: "已阻断发酵并生成应急话术草稿",
    mainAction: "进入异常与风险"
  }
];

export function ExecutionResult() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [completedFlow, setCompletedFlow] = useState<{message: string, isClosing: boolean} | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [refreshingCategory, setRefreshingCategory] = useState<Record<string, boolean>>({});
  
  const handleRefreshCategory = (category: string) => {
    setRefreshingCategory(prev => ({ ...prev, [category]: true }));
    setTimeout(() => {
      setRefreshingCategory(prev => ({ ...prev, [category]: false }));
    }, 1500);
  };
  const handleExplore = () => {
    setIsExploring(true);
    setTimeout(() => {
      setIsExploring(false);
    }, 1500);
  };
  const [textSelection, setTextSelection] = useState<TextSelection | null>(null);
  const [replacementCommand, setReplacementCommand] = useState<{ newText: string; start: number; end: number; id: number } | null>(null);
  const [agentInput, setAgentInput] = useState("");
  const [isAgentModifying, setIsAgentModifying] = useState(false);

  const handleComplete = (flow: string, closeTask: boolean = true) => {
    setCompletedFlow({ message: flow, isClosing: closeTask });
    setShowMoreActions(false);
    
    if (closeTask) {
      setTimeout(() => {
        setCompletedFlow(null);
        setSelectedTask(null);
      }, 1500);
    } else {
      setTimeout(() => {
        setCompletedFlow(null);
      }, 2500);
    }
  };

  const categories = ["内容审核", "互动承接", "发布异常", "素材匹配", "风险处理"];

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-neutral-900 rounded-2xl border border-neutral-100 shadow-sm relative">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[18px] font-bold text-neutral-900">
            执行中心
          </h2>
        </div>
        <p className="text-[14px] text-neutral-500 font-medium">
          当前有 6 件事项需要处理，其中 3 件会影响今天推进。
        </p>
      </div>

      {/* Main Flow List */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {TASKS.map(task => (
            <div 
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="group bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col min-h-[320px]"
            >
               {/* Card Header: Type & Refresh */}
               <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100 shrink-0">
                  <div className="flex items-center gap-2">
                    {task.moduleName === '内容审核' && <FileText size={16} className="text-primary-500" />}
                    {task.moduleName === '互动承接' && <User size={16} className="text-blue-500" />}
                    {task.moduleName === '发布与账号' && <AlertOctagon size={16} className="text-rose-500" />}
                    {task.moduleName === '素材与回传' && <Camera size={16} className="text-emerald-500" />}
                    {task.moduleName === '回传验收' && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {task.moduleName === '异常与风险' && <ShieldAlert size={16} className="text-rose-600" />}
                    <span className="text-[14px] font-bold text-neutral-900">{task.moduleName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleRefreshCategory(task.moduleName); }}
                       className="hover:text-neutral-700 flex items-center gap-1"
                     >
                       <RefreshCw size={12} className={refreshingCategory[task.moduleName] ? "animate-spin" : ""} /> 
                     </button>
                  </div>
               </div>
               
               {/* Card Body */}
               <div className="flex-1 flex flex-col">
                  <h3 className="text-[18px] font-bold text-neutral-900 mb-4">{task.importantResult}</h3>
                  
                  <div className="flex items-center gap-3 text-[12px] mb-4">
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">快速确认 {task.statusQuick}</span>
                    <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded">需要处理 {task.statusAction}</span>
                    <span className="text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100">等待推进 {task.statusWait}</span>
                  </div>
                  
                  <div className="text-[13px] text-neutral-500 mb-4 flex items-start gap-1.5">
                    <FolderOpen size={14} className="mt-0.5 shrink-0" />
                    <span>涉及项目：{task.projectsDesc}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-50">
                    <div className="flex items-start gap-2 text-[12px] text-primary-700 bg-primary-50 p-3 rounded-lg">
                      <Sparkles size={14} className="shrink-0 mt-0.5" />
                      <span>{task.aiWork}</span>
                    </div>
                  </div>
               </div>
               
               <button className="w-full mt-4 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                 {task.mainAction}
               </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task Detail Panel Overlay */}
      <AnimatePresence>
        {selectedTask && selectedTask.moduleName === '内容审核' && (
          <ContentReviewWorkbench onClose={() => setSelectedTask(null)} />
        )}
        {selectedTask && selectedTask.moduleName === '互动承接' && (
          <InteractionWorkbench onClose={() => setSelectedTask(null)} />
        )}
        {selectedTask && selectedTask.moduleName === '素材与回传' && (
          <ShootingAndUploadWorkbench 
            initialTab={'exception'}
            onClose={() => setSelectedTask(null)} 
          />
        )}
      
        {selectedTask && (selectedTask.moduleName === '发布与账号' || selectedTask.moduleName === '发布异常') && (
          <PublishExceptionWorkbench onClose={() => setSelectedTask(null)} />
        )}
        {selectedTask && (selectedTask.moduleName === '异常与风险' || selectedTask.moduleName === '风险处理') && (
          <InteractionWorkbench onClose={() => setSelectedTask(null)} />
        )}

      </AnimatePresence>
      
      <AnimatePresence>
        {selectedTask && selectedTask.moduleName !== '内容审核' && selectedTask.moduleName !== '互动承接' && selectedTask.moduleName !== '素材与回传' && selectedTask.moduleName !== '发布与账号' && selectedTask.moduleName !== '发布异常' && selectedTask.moduleName !== '异常与风险' && selectedTask.moduleName !== '风险处理' && (
          <div className="absolute inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
              onClick={() => setSelectedTask(null)}
            />
            
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className={`${isFullScreen ? 'w-full' : 'w-[900px]'} bg-[#fcfcfc] shadow-2xl relative z-10 flex flex-col border-l border-neutral-200 h-full`}
            >
              <AnimatePresence>
                {completedFlow && completedFlow.isClosing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center bg-white border border-neutral-200 shadow-xl p-8 rounded-2xl"
                    >
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-[18px] font-bold text-neutral-900 mb-1">已执行操作</h3>
                      <p className="text-[14px] text-neutral-500 font-medium">{completedFlow.message}</p>
                    </motion.div>
                  </motion.div>
                )}
                
                {completedFlow && !completedFlow.isClosing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className="absolute bottom-24 left-1/2 z-50 bg-neutral-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-[13px]"
                  >
                    <Sparkles size={16} className="text-emerald-400" />
                    {completedFlow.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="shrink-0 border-b border-neutral-100 px-8 py-6 relative bg-white">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors">
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="pr-20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[12px] font-bold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">
                      {selectedTask.moduleName}
                    </span>
                    <span className="text-[12px] text-neutral-400 font-medium flex items-center gap-1 mr-4">
                      <FolderOpen size={14} /> 涉及项目：{selectedTask.projectsDesc}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">快速确认 ({selectedTask.statusQuick})</span>
                      <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors">需要处理 ({selectedTask.statusAction})</span>
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">等待推进 ({selectedTask.statusWait})</span>
                    </div>
                  </div>
                  <h2 className="text-[22px] font-bold text-neutral-900">{selectedTask.importantResult}</h2>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto flex">
                 {/* Left: Preview/Content */}
                 <div className="flex-1 p-8 border-r border-neutral-100 bg-[#fcfcfc] overflow-y-auto">
                    {/* Placeholder for content preview based on task type */}
                    {selectedTask.moduleName === '内容审核' && (
                       <NoteEditor onSelectionChange={setTextSelection} replacementCommand={replacementCommand} />
                    )}
                    
                    {selectedTask.moduleName === '互动承接' && (
                       <div className="space-y-4">
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-4">高意向私信列表</h4>
                          {[1, 2, 3].map(i => (
                             <div key={i} className="p-4 bg-white border border-neutral-200 rounded-xl flex gap-3 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                  <User size={20} className="text-neutral-400" />
                                </div>
                                <div>
                                   <div className="text-[13px] font-bold text-neutral-900 mb-1">@养基大户</div>
                                   <p className="text-[13px] text-neutral-600 mb-2">请问幼犬那款现在拍有送试吃装吗？链接在哪？</p>
                                   <div className="bg-primary-50/50 border border-primary-100 p-3 rounded-lg text-[13px] text-neutral-800 font-medium">
                                      <span className="text-primary-600 font-bold mr-1">拟定回复:</span>
                                      亲亲，幼犬款现在下单送 3 包试吃装哦！链接在这边：[商品卡片]，有任何不清楚随时问我~
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}

                    {selectedTask.moduleName === '发布异常' && (
                       <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-4">异常详情</h4>
                          <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-[13px] text-rose-800 font-medium flex gap-3">
                             <AlertOctagon size={18} className="shrink-0 mt-0.5" />
                             <div>
                                <p className="mb-1 font-bold">小红书发布失败</p>
                                <p className="text-rose-600 opacity-80">接口返回：疑似包含过度营销词汇，请修改后重试。</p>
                             </div>
                          </div>
                          <div className="mt-4 p-4 border border-neutral-200 rounded-lg">
                             <p className="text-[13px] text-neutral-600">原内容段落：</p>
                             <p className="text-[13px] text-neutral-800 font-medium mt-2 bg-neutral-50 p-3 rounded">
                                "这款<span className="text-rose-500 font-bold bg-rose-100 px-1 mx-0.5 rounded">绝对是全网最低价</span>，<span className="text-rose-500 font-bold bg-rose-100 px-1 mx-0.5 rounded">买到就是赚到</span>，赶紧冲！"
                             </p>
                          </div>
                       </div>
                    )}

                    {selectedTask.moduleName === '素材匹配' && (
                       <div className="space-y-4">
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-4">匹配结果预览</h4>
                          <div className="grid grid-cols-3 gap-4">
                             {[1, 2].map(i => (
                                <div key={i} className="aspect-square bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center relative overflow-hidden group">
                                   <ImageIcon className="text-neutral-300" size={32} />
                                   <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold shadow-sm">图库提取</div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {selectedTask.moduleName === '回传验收' && (
                       <div className="space-y-4">
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-4">回传素材 (5)</h4>
                          <div className="grid grid-cols-3 gap-4">
                             {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="aspect-square bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center relative group">
                                   <ImageIcon className="text-neutral-300" size={32} />
                                   {i > 3 && (
                                     <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md">
                                       <X size={12} />
                                     </div>
                                   )}
                                   {i <= 3 && (
                                     <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                                       <Check size={12} />
                                     </div>
                                   )}
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {selectedTask.moduleName === '风险处理' && (
                       <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-4">高风险互动</h4>
                          <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex gap-3">
                             <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center shrink-0 text-rose-600">
                               <User size={20} />
                             </div>
                             <div>
                                <div className="text-[13px] font-bold text-rose-900 mb-1">@用户778899</div>
                                <p className="text-[13px] text-rose-800 mb-3">你们家狗粮吃完我家狗直接吐了，品控太差了吧！！</p>
                                <div className="bg-white border border-rose-200 p-3 rounded-lg text-[13px] text-neutral-800">
                                   <span className="text-primary-600 font-bold mr-1 mb-1 block">拟定官方回复 (待审):</span>
                                   非常抱歉给您带来不好的体验！狗狗换粮期间肠胃比较敏感，我们非常重视您的情况。专属售后客服已通过私信联系您，请您留意，我们会负责到底！
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Right: AI Suggestion Card or Agent Panel */}
                 <div className="w-[380px] shrink-0 p-8 bg-neutral-50 flex flex-col relative z-20">
                    {textSelection ? (
                      <div className="bg-white border border-primary-200 shadow-xl rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                            <Sparkles size={16} />
                          </div>
                          <h3 className="text-[16px] font-bold text-neutral-900">内容优化 Agent</h3>
                          <button onClick={() => setTextSelection(null)} className="ml-auto text-neutral-400 hover:text-neutral-600 p-1">
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-[13px] text-neutral-600 leading-relaxed italic relative">
                            <div className="absolute -left-2 top-4 w-1 h-8 bg-neutral-300 rounded-full"></div>
                            "{textSelection.text}"
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {['去 AI 味', '更活泼', '更专业', '精简字数'].map(tag => (
                              <button 
                                key={tag} 
                                onClick={() => setAgentInput(tag)}
                                className="px-3 py-1.5 bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-neutral-600 rounded-lg text-[12px] transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-neutral-100">
                          <div className="flex gap-2">
                            <textarea 
                              value={agentInput}
                              onChange={(e) => setAgentInput(e.target.value)}
                              placeholder="告诉 Agent 如何修改这段话..."
                              className="flex-1 border border-neutral-200 rounded-lg p-2.5 text-[13px] text-neutral-700 resize-none h-[80px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              if (textSelection && agentInput.trim()) {
                                setIsAgentModifying(true);
                                setTimeout(() => {
                                  setReplacementCommand({
                                    newText: `${textSelection.text} (${agentInput} 修改)`,
                                    start: textSelection.start,
                                    end: textSelection.end,
                                    id: Date.now()
                                  });
                                  setIsAgentModifying(false);
                                  setAgentInput("");
                                  setTextSelection(null);
                                }, 1000);
                              }
                            }}
                            disabled={isAgentModifying || !agentInput.trim()}
                            className="mt-3 w-full bg-neutral-900 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
                          >
                            {isAgentModifying ? <RefreshCw size={16} className="animate-spin" /> : '发送指令'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-primary-200 shadow-xl rounded-2xl p-6 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                         <div className="absolute top-4 right-4 opacity-10">
                            <Sparkles size={64} className="text-primary-500" />
                         </div>
                         
                         <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-4">
                             <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                               <Sparkles size={16} />
                             </div>
                             <h3 className="text-[16px] font-bold text-neutral-900">建议处理方案</h3>
                           </div>
                           
                           <div className="text-[18px] font-bold text-neutral-900 mb-3">
                             {selectedTask.mainAction}
                           </div>
                           
                           <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                             <p className="text-[13px] font-bold text-neutral-700 mb-1">处理理由：</p>
                             <p className="text-[13px] text-neutral-600 leading-relaxed">
                               {selectedTask.aiWork}
                             </p>
                           </div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
              {/* Actions Footer */}
              <div className="p-6 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0 relative z-30">
                <div className="flex items-center gap-3 relative">
                   {/* "More" dropdown placeholder */}
                   <button 
                     onClick={() => setShowMoreActions(!showMoreActions)}
                     className="px-5 py-3 text-neutral-500 border border-neutral-200 text-[13px] font-bold hover:bg-neutral-50 rounded-xl transition-colors flex items-center gap-2"
                   >
                     <MoreHorizontal size={16} /> 更多
                   </button>
                   
                   <AnimatePresence>
                     {showMoreActions && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-neutral-200 shadow-2xl rounded-xl py-2 z-50 flex flex-col"
                       >
                         {selectedTask.moduleName === '内容审核' && (
                           <>
                             <button onClick={() => handleComplete('已进入编辑模式，请在左侧编辑', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">手动编辑</button>
                             <button onClick={() => handleComplete('查看生成依据', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">查看生成依据</button>
                           </>
                         )}
                         {selectedTask.moduleName === '素材匹配' && (
                           <>
                             <button onClick={() => handleComplete('查看原图', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">查看原图</button>
                             <button onClick={() => handleComplete('标记不可用')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">标记不可用</button>
                             <button onClick={() => handleComplete('进入素材库', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">进入素材库</button>
                           </>
                         )}
                         {selectedTask.moduleName === '发布异常' && (
                           <>
                             <button onClick={() => handleComplete('重新发布')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">重新发布</button>
                             <button onClick={() => handleComplete('标记人工处理')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">标记人工处理</button>
                           </>
                         )}
                         {selectedTask.moduleName === '风险处理' && (
                           <>
                           </>
                         )}
                         <div className="h-px bg-neutral-100 my-1 w-full" />
                         <button onClick={() => handleComplete('进入项目档案', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">进入项目档案</button>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <button onClick={() => handleComplete('跳过当前事项')} className="px-5 py-3 text-neutral-500 text-[13px] font-bold hover:bg-neutral-50 rounded-xl transition-colors">
                     跳过
                   </button>
                </div>

                <div className="flex items-center gap-3">
                   {selectedTask.moduleName === '内容审核' && <button onClick={() => handleComplete('请在左侧直接编辑内容', false)} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">调整一下</button>}
                   {selectedTask.moduleName === '素材匹配' && <button onClick={() => handleComplete('已为您重新匹配素材', false)} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">换一组</button>}
                   {selectedTask.moduleName === '发布异常' && <button onClick={() => handleComplete('已进入修改流程', false)} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">调整处理方式</button>}
                   {selectedTask.moduleName === '风险处理' && <button onClick={() => handleComplete('已暂缓处理')} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">暂不处理</button>}
                   
                   <button 
                     onClick={() => handleComplete(selectedTask.moduleName === '风险处理' ? '确认处理成功' : '采纳建议，处理成功')} 
                     className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2"
                   >
                     {selectedTask.moduleName === '风险处理' ? '确认处理' : '采纳建议'}
                     <Check size={16} />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
