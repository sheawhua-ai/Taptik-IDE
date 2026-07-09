import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle, AlertCircle, MessageSquare, Image as ImageIcon,
  CheckCircle2, X, FileText, User, History, ShieldAlert,
  Zap, ArrowRight, Database, Filter, Check, Sparkles, Clock, Pause, RefreshCw, ChevronDown, FolderOpen, UserPlus, Maximize2, Minimize2, PlayCircle, BookOpen, Send, LayoutList, Layers, Network, ZapOff, CheckCircle, RotateCcw, AlertOctagon, Eye, Plus, MoreHorizontal
} from "lucide-react";
import { NoteEditor, TextSelection } from "./NoteEditor";

type Section = "优先处理" | "连续处理" | "等待中";

interface Task {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  projects: string[];
  reason: string;
  aiRecommendation: string;
  aiReasoning: string;
  section: Section;
  mainAction: string;
}

const TASKS: Task[] = [
  {
    id: "t1", type: "内容审核", priority: "high", title: "12 篇笔记待审核",
    projects: ["幼犬换粮避坑搜索卡位", "日常种草A组"],
    reason: "通过后才能进入素材匹配和排期。",
    aiRecommendation: "建议先通过 8 篇低风险稿，剩下 4 篇逐篇调整。",
    aiReasoning: "口吻符合 KOS 人设，无禁用表达，素材要求明确。",
    section: "连续处理",
    mainAction: "按建议过稿"
  },
  {
    id: "t2", type: "互动承接", priority: "critical", title: "18 条高意向私信待分流",
    projects: ["双十一冲刺企划", "门店KOC矩阵"],
    reason: "笔记发布后产生多条求链接私信，影响私信转化。",
    aiRecommendation: "建议先回复 6 条高意向咨询，普通互动可批量延后。",
    aiReasoning: "已根据知识库匹配最佳回复话术，意向度高建议立即响应。",
    section: "连续处理",
    mainAction: "先处理高意向"
  },
  {
    id: "t3", type: "发布异常", priority: "high", title: "2 篇发布失败需处理",
    projects: ["日常种草A组"],
    reason: "网络波动或包含潜在营销敏感词导致发布阻塞。",
    aiRecommendation: "建议 1 篇网络恢复后重试，1 篇先弱化营销表达再发。",
    aiReasoning: "平台风控升级，营销词可能导致限流，弱化表达更安全。",
    section: "优先处理",
    mainAction: "按建议处理"
  },
  {
    id: "t4", type: "素材匹配", priority: "high", title: "3 篇笔记缺产品底图",
    projects: ["双十一冲刺企划", "爆款返场项目"],
    reason: "当前笔记需要真实的产品喂食场景图作为底图进行成图合成。",
    aiRecommendation: "建议 2 篇可用本地素材，1 篇需要补拍。",
    aiReasoning: "本地图库找到相似场景，直接合成效率最高；余下 1 篇无合适图需补拍。",
    section: "优先处理",
    mainAction: "按建议配图"
  },
  {
    id: "t5", type: "回传验收", priority: "medium", title: "店长 A 已回传 5 张场景图",
    projects: ["门店KOC矩阵"],
    reason: "门店店长的补拍任务已完成提交，等待验收确认。",
    aiRecommendation: "建议 4 张可用，2 张需要重拍。",
    aiReasoning: "4 张构图光线符合要求，2 张轻微模糊不建议用于首图。",
    section: "等待中",
    mainAction: "采用可用素材"
  },
  {
    id: "t6", type: "风险处理", priority: "critical", title: "1 条高风险负面评论",
    projects: ["幼犬换粮避坑搜索卡位"],
    reason: "触发品牌声誉风险词库，需要紧急响应。",
    aiRecommendation: "建议先隐藏该评论，并准备官方回复，等待内部确认。",
    aiReasoning: "涉及产品质量投诉，盲目回复可能引发公关危机，先隔离处理。",
    section: "优先处理",
    mainAction: "查看并确认"
  }
];

export function ExecutionResult() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [completedFlow, setCompletedFlow] = useState<{message: string, isClosing: boolean} | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
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

  const sections: Section[] = ["优先处理", "连续处理", "等待中"];

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-neutral-900 rounded-2xl border border-neutral-100 shadow-sm relative">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[18px] font-bold text-neutral-900">
            执行中心
          </h2>
          <button 
            onClick={handleExplore}
            disabled={isExploring}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm hover:bg-neutral-800 active:scale-95 flex items-center gap-2 disabled:opacity-80"
          >
            <RefreshCw size={14} className={isExploring ? "animate-spin" : ""} /> 
            {isExploring ? "Agent 探索中..." : "让 Agent 发现新任务"}
          </button>
        </div>
        <p className="text-[14px] text-neutral-500 font-medium">
          当前有 6 件事项需要处理，其中 3 件会影响今天推进。
        </p>
      </div>

      {/* Main Flow List */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto space-y-10">
          {sections.map(section => {
            const tasksInSection = TASKS.filter(t => t.section === section);
            if (tasksInSection.length === 0) return null;

            return (
              <div key={section} className="space-y-4">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                  {section === '优先处理' && <AlertOctagon size={16} className="text-rose-500" />}
                  {section === '连续处理' && <Layers size={16} className="text-primary-500" />}
                  {section === '等待中' && <Clock size={16} className="text-neutral-400" />}
                  {section}
                  <span className="text-[12px] font-medium text-neutral-400 ml-1">{tasksInSection.length}</span>
                </h3>
                
                <div className="space-y-4">
                  {tasksInSection.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="group bg-white border border-neutral-100 hover:border-primary-500/30 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex gap-6"
                    >
                      {/* Left: Task Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold text-neutral-600 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">
                              {task.type}
                            </span>
                            {task.priority === 'critical' && (
                              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                紧急
                              </span>
                            )}
                          </div>
                          <h4 className="text-[16px] font-bold text-neutral-900 mb-1">{task.title}</h4>
                          <div className="text-[12px] text-neutral-500 font-medium mb-3 flex items-center gap-1">
                            <FolderOpen size={14} /> 涉及：{task.projects.join("、")}
                          </div>
                          <p className="text-[13px] text-neutral-600 bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                            <span className="font-semibold text-neutral-700">原因：</span>{task.reason}
                          </p>
                        </div>
                      </div>

                      {/* Right: AI Suggestion & Actions */}
                      <div className="w-[320px] bg-primary-50/30 border border-primary-100/50 rounded-xl p-4 flex flex-col justify-between shrink-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                          <Sparkles size={48} className="text-primary-500" />
                        </div>
                        <div className="relative z-10">
                           <div className="text-[11px] font-bold text-primary-600 mb-1 flex items-center gap-1">
                             <Sparkles size={12} /> AI 建议
                           </div>
                           <p className="text-[14px] text-neutral-900 font-medium leading-relaxed">
                             {task.aiRecommendation}
                           </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 relative z-10">
                           <button className="flex-1 bg-neutral-900 text-white text-[13px] font-bold py-2.5 rounded-lg hover:bg-neutral-800 transition-colors">
                             {task.mainAction}
                           </button>
                           <button className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors">
                             查看明细
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Panel Overlay */}
      <AnimatePresence>
        {selectedTask && (
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
                      {selectedTask.type}
                    </span>
                    <span className="text-[12px] text-neutral-400 font-medium flex items-center gap-1">
                      <FolderOpen size={14} /> 涉及项目：{selectedTask.projects.join("、")}
                    </span>
                  </div>
                  <h2 className="text-[22px] font-bold text-neutral-900">{selectedTask.title}</h2>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto flex">
                 {/* Left: Preview/Content */}
                 <div className="flex-1 p-8 border-r border-neutral-100 bg-[#fcfcfc] overflow-y-auto">
                    {/* Placeholder for content preview based on task type */}
                    {selectedTask.type === '内容审核' && (
                       <NoteEditor onSelectionChange={setTextSelection} replacementCommand={replacementCommand} />
                    )}
                    
                    {selectedTask.type === '互动承接' && (
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

                    {selectedTask.type === '发布异常' && (
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

                    {selectedTask.type === '素材匹配' && (
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

                    {selectedTask.type === '回传验收' && (
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

                    {selectedTask.type === '风险处理' && (
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
                             {selectedTask.aiRecommendation}
                           </div>
                           
                           <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                             <p className="text-[13px] font-bold text-neutral-700 mb-1">处理理由：</p>
                             <p className="text-[13px] text-neutral-600 leading-relaxed">
                               {selectedTask.aiReasoning}
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
                         {selectedTask.type === '内容审核' && (
                           <>
                             <button onClick={() => handleComplete('已进入编辑模式，请在左侧编辑', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">手动编辑</button>
                             <button onClick={() => handleComplete('查看生成依据', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">查看生成依据</button>
                           </>
                         )}
                         {selectedTask.type === '素材匹配' && (
                           <>
                             <button onClick={() => handleComplete('查看原图', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">查看原图</button>
                             <button onClick={() => handleComplete('标记不可用')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">标记不可用</button>
                             <button onClick={() => handleComplete('进入素材库', false)} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">进入素材库</button>
                           </>
                         )}
                         {selectedTask.type === '发布异常' && (
                           <>
                             <button onClick={() => handleComplete('重新发布')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">重新发布</button>
                             <button onClick={() => handleComplete('调整发布时间')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">调整发布时间</button>
                             <button onClick={() => handleComplete('标记人工处理')} className="text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">标记人工处理</button>
                           </>
                         )}
                         {selectedTask.type === '风险处理' && (
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
                   {selectedTask.type === '内容审核' && <button onClick={() => handleComplete('请在左侧直接编辑内容', false)} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">调整一下</button>}
                   {selectedTask.type === '素材匹配' && <button onClick={() => handleComplete('已为您重新匹配素材', false)} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">换一组</button>}
                   {selectedTask.type === '发布异常' && <button onClick={() => handleComplete('已进入修改流程', false)} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">调整处理方式</button>}
                   {selectedTask.type === '风险处理' && <button onClick={() => handleComplete('已暂缓处理')} className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">暂不处理</button>}
                   
                   <button 
                     onClick={() => handleComplete(selectedTask.type === '风险处理' ? '确认处理成功' : '采纳建议，处理成功')} 
                     className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2"
                   >
                     {selectedTask.type === '风险处理' ? '确认处理' : '采纳建议'}
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
