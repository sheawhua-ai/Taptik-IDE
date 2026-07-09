import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle, AlertCircle, MessageSquare, Image as ImageIcon,
  CheckCircle2, X, FileText, User, History, ShieldAlert,
  Zap, ArrowRight, Database, Filter, Check, Sparkles, Clock, Pause, RefreshCw, ChevronDown, FolderOpen, UserPlus, Maximize2, Minimize2, PlayCircle, BookOpen, Send, LayoutList, Layers, Network, ZapOff, CheckCircle, RotateCcw, AlertOctagon, Eye, Plus
} from "lucide-react";

type QueueState = "全部" | "发布前" | "发布中" | "发布后" | "等待外部" | "已完成";

interface Task {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  reason: string;
  impact: string;
  recommendation: string;
  source: string;
  queue: string;
  statusText: string;
}

const TASKS: Task[] = [
  {
    id: "t1", type: "内容确认", priority: "high", title: "12 篇笔记待快速过目",
    reason: "AI 已按「幼犬换粮避坑」人设完成撰写，待人工审核确认。", impact: "影响 12 篇排期无法进入发布",
    recommendation: "批量确认无误并授权排期发布", source: "幼犬换粮避坑搜索卡位", queue: "发布前", statusText: "需要确认"
  },
  {
    id: "t2", type: "高意向线索", priority: "critical", title: "18 条高意向私信待分流",
    reason: "笔记发布后产生多条类似“求链接”、“具体在哪买”的私信。", impact: "可能影响私信转化",
    recommendation: "采用 AI 推荐回复话术，批量响应", source: "双十一冲刺企划", queue: "发布后", statusText: "可直接处理"
  },
  {
    id: "t3", type: "发布异常", priority: "high", title: "2 篇发布失败需处理",
    reason: "平台提示：网络波动导致发布超时，或包含潜在营销敏感词。", impact: "影响今日发布节奏",
    recommendation: "延期发布，或让 AI 微调敏感词后重发", source: "幼犬换粮避坑搜索卡位", queue: "发布中", statusText: "网络/本地暂停"
  },
  {
    id: "t4", type: "素材补齐", priority: "high", title: "3 篇笔记缺产品底图",
    reason: "当前笔记需要真实的产品喂食场景图作为底图进行成图合成。", impact: "3 篇笔记处于阻塞状态",
    recommendation: "从本地素材池匹配，缺口转员工补拍", source: "幼犬换粮避坑搜索卡位", queue: "发布前", statusText: "可直接处理"
  },
  {
    id: "t5", type: "外部回传", priority: "medium", title: "店长 A 已回传 5 张场景图",
    reason: "派发给门店店长的补拍任务已完成提交，等待验收确认。", impact: "审核通过后可推进 2 篇阻塞笔记",
    recommendation: "验收素材并应用到阻塞笔记", source: "门店KOC矩阵", queue: "等待外部", statusText: "需要确认"
  }
];

export function ExecutionResult() {
  const [activeTab, setActiveTab] = useState<QueueState>("全部");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [queuePaused, setQueuePaused] = useState(false);
  const [editTitle, setEditTitle] = useState("别再乱喂幼犬了！换粮避坑指南");
  const [editBody, setEditBody] = useState("新手养狗真的很容易在换粮上踩坑！今天分享一下我家狗狗的换粮血泪史...\n\n📌 核心原则：七日换粮法千万别省事\n📌 注意点：观察便便情况\n\n特唯普这款幼犬粮真的是救星...");
  const [editTopics, setEditTopics] = useState(["#幼犬换粮", "#新手养狗", "#宠物健康"]);
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState(0);
  const [showTitleAiOptions, setShowTitleAiOptions] = useState(false);
  const [showBodyAiOptions, setShowBodyAiOptions] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const filteredTasks = TASKS.filter((t) => activeTab === "全部" || t.queue === activeTab);

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case "critical": return "极高优";
      case "high": return "高优";
      case "medium": return "中优";
      case "low": return "低优";
      default: return "普通";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "critical": return "text-rose-700 bg-rose-50 border-rose-200";
      case "high": return "text-orange-700 bg-orange-50 border-orange-200";
      case "medium": return "text-blue-700 bg-blue-50 border-blue-200";
      default: return "text-neutral-700 bg-neutral-50 border-neutral-200";
    }
  };

  const getTabCount = (tab: QueueState) => {
    if (tab === "全部") return TASKS.length;
    return TASKS.filter((t) => t.queue === tab).length;
  };

  const getTabBadgeStyles = (tab: QueueState, isActive: boolean) => {
    if (!isActive) {
      switch (tab) {
        case "全部": return "bg-neutral-100 text-neutral-500";
        case "发布前": return "bg-primary-50 text-primary-600";
        case "发布中": return "bg-orange-50 text-orange-600";
        case "发布后": return "bg-rose-50 text-rose-600";
        case "等待外部": return "bg-blue-50 text-blue-600";
        default: return "bg-neutral-100 text-neutral-400";
      }
    } else {
      switch (tab) {
        case "全部": return "bg-neutral-200 text-neutral-800";
        case "发布前": return "bg-primary-100 text-primary-700";
        case "发布中": return "bg-orange-100 text-orange-700";
        case "发布后": return "bg-rose-100 text-rose-700";
        case "等待外部": return "bg-blue-100 text-blue-700";
        default: return "bg-neutral-200 text-neutral-600";
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-neutral-900 rounded-2xl border border-neutral-100 shadow-sm relative">
      {/* 顶部标题区 */}
      <div className="px-8 py-5 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
              <Zap size={20} className="text-primary-500" />
              执行中心
            </h2>
            <p className="text-[12px] text-neutral-500 mt-1">系统已按影响程度整理好今天要处理的事项，电脑在线时可继续推进。</p>
          </div>
          <button 
            onClick={() => {}}
            className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm border border-neutral-200 active:scale-95 flex items-center gap-2 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900`}
          >
            <RefreshCw size={16} /> 扫描新事项
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-4 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center gap-6">
          {(["全部", "发布前", "发布中", "发布后", "等待外部", "已完成"] as QueueState[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold transition-colors relative flex items-center gap-1.5 group ${activeTab === tab ? "text-primary-600" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              <span>{tab}</span>
              <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full transition-all ${getTabBadgeStyles(tab, activeTab === tab)}`}>
                {getTabCount(tab)}
              </span>
              {activeTab === tab && (
                <motion.div layoutId="exec-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer relative group flex gap-6"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded font-bold border ${getPriorityColor(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                  <span className="text-[12px] font-bold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded">
                    {task.type}
                  </span>
                  <span className="text-[12px] text-neutral-400 font-medium ml-auto flex items-center gap-1">
                    <FolderOpen size={14} /> 项目：{task.source}
                  </span>
                </div>
                
                <h3 className="text-[16px] font-bold text-neutral-900 mb-2">{task.title}</h3>
                <p className="text-[13px] text-neutral-500 mb-4">{task.impact}</p>

                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100 text-[12px] text-neutral-600 w-fit">
                  <Sparkles size={14} className="text-primary-500" />
                  <span className="font-bold text-neutral-700">建议：</span>
                  {task.recommendation}
                </div>
              </div>
              <div className="shrink-0 flex items-center border-l border-neutral-100 pl-6">
                 <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                   处理任务
                 </button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
              <CheckCircle size={48} className="mb-4 text-neutral-300" />
              <p className="text-[15px] font-medium">该分类下没有待处理任务</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className={`${isFullScreen ? 'w-full' : 'w-[800px]'} bg-white shadow-2xl relative z-10 flex flex-col border-l border-neutral-200 transition-all duration-300 h-full`}
            >
              {/* Header */}
              <div className="shrink-0 border-b border-neutral-100 px-8 py-6 relative bg-neutral-50/50">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded font-bold border ${getPriorityColor(selectedTask.priority)}`}>
                    {getPriorityLabel(selectedTask.priority)}
                  </span>
                  <span className="text-[12px] font-bold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">
                    {selectedTask.type}
                  </span>
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded border ${selectedTask.statusText === '需要确认' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                    {selectedTask.statusText}
                  </span>
                </div>
                <h2 className="text-[20px] font-bold text-neutral-900 mb-2">{selectedTask.title}</h2>
                <div className="text-[13px] text-neutral-500 font-medium flex items-center gap-1">
                  <FolderOpen size={14} /> 所属项目：{selectedTask.source}
                </div>
              </div>

              {/* Body */}
              <div className={`flex-1 ${selectedTask.type === '内容确认' ? 'flex flex-col min-h-0 overflow-hidden' : 'overflow-y-auto p-8 space-y-8'} custom-scrollbar`}>
                {selectedTask.type === '内容确认' && (
                  <div className="flex-1 flex flex-col h-full">
                    <div className="flex h-full">
                       <div className="w-1/3 border-r border-neutral-200 bg-neutral-50/50 p-4 overflow-y-auto custom-scrollbar">
                          <div className="text-[13px] font-bold text-neutral-900 mb-3 px-1">待确认笔记 (12)</div>
                          <div className="space-y-2">
                            <div onClick={() => setActiveNoteIdx(0)} className={`p-3 bg-white border ${activeNoteIdx === 0 ? 'border-primary-400 shadow-sm' : 'border-neutral-200 hover:border-neutral-300 text-neutral-500'} rounded-xl cursor-pointer relative overflow-hidden transition-all`}>
                               {activeNoteIdx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                               <div className={`text-[12px] font-bold truncate ${activeNoteIdx === 0 ? 'text-neutral-900' : ''}`}>别再乱喂幼犬了！换粮避坑...</div>
                               <div className="text-[11px] mt-1 opacity-80">账号类型：达人种草</div>
                            </div>
                            <div onClick={() => setActiveNoteIdx(1)} className={`p-3 bg-white border ${activeNoteIdx === 1 ? 'border-primary-400 shadow-sm' : 'border-neutral-200 hover:border-neutral-300 text-neutral-500'} rounded-xl cursor-pointer relative overflow-hidden transition-all`}>
                               {activeNoteIdx === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                               <div className={`text-[12px] font-bold truncate ${activeNoteIdx === 1 ? 'text-neutral-900' : ''}`}>新手铲屎官必修课：幼犬...</div>
                               <div className="text-[11px] mt-1 opacity-80">账号类型：专业科普</div>
                            </div>
                          </div>
                       </div>
                       <div className="w-2/3 p-6 bg-white flex flex-col h-full overflow-y-auto custom-scrollbar relative">
                          <div className="flex items-center justify-between mb-4 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] rounded font-bold">达人种草</span>
                              <span className="px-2 py-1 bg-green-50 text-green-600 text-[11px] rounded border border-green-100 font-bold">无违规词风险</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="px-5 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-[13px] font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
                                 <Check size={14} /> 确认并进入发布池
                               </button>
                            </div>
                          </div>
                          
                          <div className="space-y-4 flex-1 flex flex-col min-h-[400px]">
                            <div className="shrink-0 relative">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[12px] font-bold text-neutral-500 block">标题</label>
                                <button 
                                  onClick={() => setShowTitleAiOptions(!showTitleAiOptions)}
                                  className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-2 py-0.5 rounded"
                                >
                                  <Sparkles size={12}/> AI生成爆款标题
                                </button>
                              </div>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full text-[16px] font-bold text-neutral-900 p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
                              />
                              {showTitleAiOptions && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white shadow-xl border border-neutral-100 rounded-xl p-2 z-10">
                                  <div className="text-[11px] font-bold text-neutral-400 px-2 pt-1 pb-2">AI 生成的方向</div>
                                  <div className="space-y-1">
                                    <button onClick={() => {setEditTitle("【重磅】幼犬换粮必看！千万别踩这些坑"); setShowTitleAiOptions(false)}} className="w-full text-left p-2.5 text-[13px] text-neutral-800 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                                      【痛点向】幼犬换粮必看！千万别踩这些坑
                                    </button>
                                    <button onClick={() => {setEditTitle("新手养狗：玻璃胃幼犬是怎么被救回来的？"); setShowTitleAiOptions(false)}} className="w-full text-left p-2.5 text-[13px] text-neutral-800 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                                      【干货向】新手养狗：玻璃胃幼犬是怎么被救回来的？
                                    </button>
                                    <button onClick={() => {setEditTitle("别再乱喂了！幼犬7日换粮法实操全纪录"); setShowTitleAiOptions(false)}} className="w-full text-left p-2.5 text-[13px] text-neutral-800 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                                      【吸睛向】别再乱喂了！幼犬7日换粮法实操全纪录
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col min-h-0 relative">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[12px] font-bold text-neutral-500 block">正文</label>
                                {selectedText && (
                                  <button 
                                    onClick={() => {
                                      setIsAiRewriting(true);
                                      setTimeout(() => {
                                        const trimmed = selectedText.trim();
                                        let polished = "";
                                        if (trimmed.includes("血泪史") || trimmed.includes("分享一下")) {
                                          polished = "！作为过来人，今天就和大家盘盘我家毛孩子换粮时的辛酸史和避坑指南，全是掏心窝子的干货...";
                                        } else if (trimmed.includes("踩坑") || trimmed.includes("新手养狗")) {
                                          polished = "刚带小家伙回家的家长们，千万别在幼犬换粮期翻车了！";
                                        } else if (trimmed.includes("七日换粮")) {
                                          polished = "📌 黄金法则：建议严格执行「七日换粮过渡法」，肠胃娇嫩马虎不得";
                                        } else if (trimmed.includes("便便")) {
                                          polished = "📌 核心细节：期间务必密切观察便便形态，稍有软便及时调理";
                                        } else if (trimmed.includes("特唯普")) {
                                          polished = "换上特唯普这款鲜肉无谷低敏幼犬粮，简直是玻璃胃宝宝的救星！配方干净，便便成型超好看，吃得非常放心。";
                                        } else {
                                          polished = `${trimmed}，真的很推荐大家试试，成分纯净低敏，换粮过渡期安全感拉满！`;
                                        }
                                        
                                        setEditBody(editBody.replace(selectedText, polished));
                                        setSelectedText("");
                                        setIsAiRewriting(false);
                                      }, 800);
                                    }}
                                    className="text-[11px] font-bold text-white bg-neutral-800 hover:bg-neutral-900 flex items-center gap-1 px-3 py-1 rounded-full shadow-md animate-in fade-in zoom-in duration-200"
                                  >
                                    {isAiRewriting ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12}/>} 
                                    对选中文案进行润色
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                onSelect={(e) => {
                                  const text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
                                  setSelectedText(text.trim());
                                }}
                                spellCheck="false"
                                data-enable-grammarly="false"
                                className="w-full flex-1 min-h-[240px] text-[14px] text-neutral-700 leading-relaxed p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 focus:bg-white transition-colors resize-none custom-scrollbar"
                              />
                            </div>
                            <div className="shrink-0">
                              <label className="text-[12px] font-bold text-neutral-500 mb-1.5 block">话题标签</label>
                              <div className="flex flex-wrap items-center gap-2">
                                {editTopics.map((topic, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] font-medium rounded-lg flex items-center gap-1">
                                    {topic} <button onClick={() => setEditTopics(editTopics.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X size={12} /></button>
                                  </span>
                                ))}
                                <button className="px-2 py-1 border border-dashed border-neutral-300 text-neutral-400 text-[12px] font-medium rounded-lg hover:border-primary-400 hover:text-primary-500 flex items-center gap-1 transition-colors">
                                  <Plus size={12} /> 添加
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
                
                {selectedTask.type === '素材补齐' && (
                  <div className="space-y-6">
                    <div className="bg-neutral-50 border border-neutral-100 p-5 rounded-2xl flex items-start gap-4">
                       <AlertOctagon className="text-orange-500 shrink-0" size={24} />
                       <div>
                         <h4 className="text-[14px] font-bold text-neutral-900 mb-1">素材缺口</h4>
                         <p className="text-[13px] text-neutral-600">{selectedTask.reason}</p>
                       </div>
                    </div>
                    
                    <div>
                      <h4 className="text-[14px] font-bold text-neutral-900 mb-3">系统推荐本地素材</h4>
                      <div className="grid grid-cols-4 gap-4">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="aspect-square bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center relative cursor-pointer hover:border-primary-400 group">
                              <ImageIcon className="text-neutral-300" size={24} />
                              <div className="absolute inset-0 bg-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                <button className="px-3 py-1.5 bg-white text-neutral-900 text-[11px] font-bold rounded-lg shadow-sm">应用素材</button>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Task Types ... fallback layout */}
                {selectedTask.type !== '内容确认' && selectedTask.type !== '素材补齐' && (
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-2">为什么要处理</h4>
                          <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-[13px] text-neutral-700 leading-relaxed">
                            {selectedTask.reason}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-neutral-900 mb-2">影响范围</h4>
                          <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-[13px] text-neutral-700 leading-relaxed">
                            {selectedTask.impact}
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary-50 border border-primary-100 p-5 rounded-2xl">
                         <h4 className="text-[14px] font-bold text-primary-900 flex items-center gap-2 mb-3">
                           <Sparkles size={16} className="text-primary-600" /> 推荐处理
                         </h4>
                         <div className="text-[13px] text-primary-800 font-bold">{selectedTask.recommendation}</div>
                      </div>
                    </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-5 border-t border-neutral-100 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  {selectedTask.type !== '内容确认' && (
                    <>
                      <button className="px-5 py-3 text-neutral-500 text-[13px] font-bold hover:bg-neutral-50 rounded-xl transition-colors">
                        退回方向
                      </button>
                      <button className="px-5 py-3 text-neutral-500 text-[13px] font-bold hover:bg-neutral-50 rounded-xl transition-colors">
                        让 AI 改一版
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors"
                  >
                    下一篇
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-md"
                  >
                    确认通过
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
