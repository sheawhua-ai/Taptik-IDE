import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle, AlertCircle, MessageSquare, Image as ImageIcon,
  CheckCircle2, X, FileText, User, History, ShieldAlert,
  Zap, ArrowRight, Database, Filter, Check, Sparkles, Clock, Pause, RefreshCw, ChevronDown, FolderOpen, UserPlus, PlayCircle, BookOpen, Send
} from "lucide-react";

type QueueState = "可直接处理" | "需要确认" | "等待外部" | "网络暂停" | "已完成";

interface Task {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  reason: string;
  impact: string;
  recommendation: string;
  source: string;
  queue: QueueState;
  backendState: "ready" | "running" | "paused" | "waiting_human" | "waiting_network" | "waiting_local_file" | "waiting_external_upload" | "completed" | "failed" | "cancelled";
}

const TASKS: Task[] = [
  {
    id: "t1", type: "批量处理", priority: "medium", title: "内容确认：12 篇待快速过目",
    reason: "包含 8 篇达人种草笔记和 4 篇品牌背书笔记，AI 已按「幼犬换粮避坑」人设完成撰写。", impact: "确认后将自动排期进入明日发布队列",
    recommendation: "批量确认无误并授权排期发布", source: "项目：幼犬换粮避坑搜索卡位", queue: "需要确认", backendState: "waiting_human"
  },
  {
    id: "t2", type: "需要确认", priority: "high", title: "线索承接：18 条高意向私信待分流",
    reason: "笔记发布后产生多条类似“求链接”、“具体在哪买”的私信。", impact: "及时互动可大幅提升首单转化率及笔记流量权重",
    recommendation: "AI 已拟定个性化回复话术，建议批量授权发送", source: "项目：双十一冲刺企划", queue: "可直接处理", backendState: "ready"
  },
  {
    id: "t3", type: "网络暂停", priority: "critical", title: "发布异常：2 篇发布失败需处理",
    reason: "平台提示：网络波动导致发布超时，或包含潜在营销敏感词。", impact: "影响核心种草矩阵的更新节奏",
    recommendation: "等待网络恢复后一键重试，或授权 AI 微调敏感词后重发", source: "A02 避坑号 / 矩阵号 C", queue: "需要确认", backendState: "waiting_human"
  },
  {
    id: "t4", type: "等待外部", priority: "high", title: "素材补齐：3 个方向缺 8 组图",
    reason: "内容编排要求展示产品颗粒度细节和对比图，当前素材库中无合适素材。", impact: "阻塞相关 8 篇笔记的最终生成与排期",
    recommendation: "已通过企微通知前端员工实拍回传，等待中...", source: "项目：双十一冲刺企划", queue: "等待外部", backendState: "waiting_external_upload"
  }
];

export function ExecutionResult() {
  const [activeQueue, setActiveQueue] = useState<QueueState>("需要确认");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const filteredTasks = TASKS.filter(t => t.queue === activeQueue);

  const stats = {
    today: TASKS.filter(t => t.queue !== '已完成').length,
    ready: TASKS.filter(t => t.queue === '可直接处理').length,
    confirm: TASKS.filter(t => t.queue === '需要确认').length,
    waiting: TASKS.filter(t => t.queue === '等待外部').length,
    paused: TASKS.filter(t => t.queue === '网络暂停').length
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical": return "bg-rose-50 text-rose-700 border-rose-200";
      case "high": return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium": return "bg-blue-50 text-blue-700 border-blue-200";
      case "low": return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical": return "最高优";
      case "high": return "高优";
      case "medium": return "中优";
      case "low": return "低优";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-neutral-900 rounded-2xl shadow-sm border border-neutral-100 relative">
      {/* 顶部统计区 */}
      <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
              <Zap className="text-primary-600" />
              执行队列
            </h2>
            <div className="text-[13px] text-neutral-500 mt-1 font-medium">系统按优先级批量推进，电脑在线时自动处理队列。</div>
          </div>
          <button className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
            <PlayCircle size={18} /> 继续处理 {stats.today} 项
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-sm flex items-center gap-2">
            <span className="text-[12px] font-medium text-neutral-500">今日待处理</span>
            <span className="text-[16px] font-bold text-neutral-900">{stats.today}</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-sm flex items-center gap-2">
            <span className="text-[12px] font-medium text-neutral-500">可继续</span>
            <span className="text-[16px] font-bold text-neutral-900">{stats.ready}</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-sm flex items-center gap-2">
            <span className="text-[12px] font-medium text-neutral-500">需确认</span>
            <span className="text-[16px] font-bold text-neutral-900">{stats.confirm}</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-sm flex items-center gap-2">
            <span className="text-[12px] font-medium text-neutral-500">等待外部</span>
            <span className="text-[16px] font-bold text-neutral-900">{stats.waiting}</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-sm flex items-center gap-2">
            <span className="text-[12px] font-medium text-neutral-500">网络/离线暂停</span>
            <span className="text-[16px] font-bold text-neutral-900">{stats.paused}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-2 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-6">
          {(["可直接处理", "需要确认", "等待外部", "网络暂停", "已完成"] as QueueState[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveQueue(tab)}
              className={`pb-3 flex items-center gap-2 text-[14px] font-bold border-b-2 transition-colors ${
                activeQueue === tab 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeQueue === tab ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-100 text-neutral-500'
              }`}>{TASKS.filter(t => t.queue === tab).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-neutral-50/50">
        <div className="max-w-[800px] mx-auto space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <CheckCircle2 size={48} className="text-neutral-300 mb-4" />
              <h3 className="text-[16px] font-bold text-neutral-900 mb-2">队列已清空</h3>
              <p className="text-[13px] text-neutral-500">当前没有需要处理的任务</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex gap-4 items-start"
              >
                {/* 状态图标 */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  task.queue === "可直接处理" ? "bg-primary-50 text-primary-600" :
                  task.queue === "需要确认" ? "bg-amber-50 text-amber-600" :
                  "bg-neutral-100 text-neutral-500"
                }`}>
                  {task.queue === "可直接处理" && <Zap size={20} />}
                  {task.queue === "需要确认" && <User size={20} />}
                  {task.queue === "等待外部" && <Clock size={20} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold border ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span className="text-[12px] font-medium text-neutral-500 flex items-center gap-1">
                      <FolderOpen size={12} /> {task.source}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-neutral-900 mb-1">{task.title}</h3>
                  <p className="text-[13px] text-neutral-500 mb-3 line-clamp-2">{task.reason}</p>
                  
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 flex items-start gap-2">
                    <Sparkles size={14} className="text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[12px] font-bold text-neutral-700">推荐动作</div>
                      <div className="text-[12px] text-neutral-600">{task.recommendation}</div>
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center h-full">
                  <button className="text-neutral-400 hover:text-neutral-900">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-40"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="absolute bottom-0 left-[10%] right-[10%] top-[10%] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col border border-neutral-200 overflow-hidden"
            >
              {/* Header */}
              <div className="px-8 py-5 border-b border-neutral-100 flex items-center justify-between bg-white relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold border ${getPriorityColor(selectedTask.priority)}`}>
                      {getPriorityLabel(selectedTask.priority)}
                    </span>
                    <span className="text-[12px] text-neutral-500 font-medium bg-neutral-100 px-2 py-0.5 rounded-md">
                      所属项目: {selectedTask.source}
                    </span>
                    <span className="text-[12px] text-neutral-500 font-medium bg-neutral-100 px-2 py-0.5 rounded-md">
                      状态: {selectedTask.backendState}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-bold text-neutral-900">
                    {selectedTask.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {selectedTask.title.includes("内容确认：12 篇待快速过目") ? (
                  <div className="space-y-6">
                    <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-[14px] font-bold text-primary-900 mb-1 flex items-center gap-2">
                          <Sparkles size={16} className="text-primary-600" /> AI 已按「幼犬换粮避坑」人设完成撰写
                        </h4>
                        <p className="text-[12px] text-primary-700">
                          包含 8 篇达人种草笔记和 4 篇品牌背书笔记，确认后将自动排期进入明日发布队列
                        </p>
                      </div>
                      <div className="text-[13px] font-bold text-primary-600 bg-white px-3 py-1.5 rounded-lg border border-primary-100">
                        覆盖 12 个长尾搜索词
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[14px] font-bold text-neutral-900">生成的内容预览</h4>
                        <span className="text-[12px] text-neutral-500">已默认全选</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { title: "别再乱喂幼犬了！换粮避坑指南", cover: "bg-orange-100", author: "养宠小助手", tag: "达人种草" },
                          { title: "三个月泰迪换粮日记，肠胃脆弱必看", cover: "bg-blue-100", author: "泰迪麻麻", tag: "达人种草" },
                          { title: "新手铲屎官必修课：幼犬怎么挑选狗粮？", cover: "bg-green-100", author: "汪星研究所", tag: "专业科普" },
                          { title: "特唯普幼犬粮测评，到底值不值得买？", cover: "bg-purple-100", author: "萌宠评测局", tag: "专业测评" }
                        ].map((note, idx) => (
                          <div key={idx} className="border border-neutral-200 rounded-xl p-3 flex gap-3 bg-white hover:border-primary-300 transition-colors cursor-pointer group shadow-sm">
                            <div className={`w-20 h-24 rounded-lg shrink-0 ${note.cover} flex items-center justify-center`}>
                              <ImageIcon className="text-black/10" size={24} />
                            </div>
                            <div className="flex flex-col justify-between flex-1 py-1">
                              <div>
                                <div className="text-[13px] font-bold text-neutral-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">{note.title}</div>
                                <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                                  <span>{note.author}</span>
                                  <span className="px-1 py-0.5 bg-neutral-100 rounded text-[9px]">{note.tag}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100">已符合人设</span>
                                <div className="w-4 h-4 rounded flex items-center justify-center bg-primary-600 text-white shadow-sm">
                                  <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center text-[12px] text-neutral-500 mt-4 font-medium flex items-center justify-center gap-2 cursor-pointer hover:text-neutral-700">
                        查看其余 8 篇
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[14px] font-bold text-neutral-900 mb-2">为什么要处理</h4>
                        <p className="text-[13px] text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 h-full">
                          {selectedTask.reason}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-neutral-900 mb-2">影响范围</h4>
                        <p className="text-[13px] text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 h-full">
                          {selectedTask.impact}
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                      <h4 className="text-[14px] font-bold text-primary-900 mb-2 flex items-center gap-2">
                        <Sparkles size={16} className="text-primary-600" /> 推荐动作
                      </h4>
                      <p className="text-[14px] text-primary-800 font-medium mb-4 leading-relaxed">
                        {selectedTask.recommendation}
                      </p>
                    </div>

                    {selectedTask.queue === "等待外部" && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                        <Clock className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                          <div className="text-[13px] font-bold text-amber-900">当前阻塞原因</div>
                          <div className="text-[12px] text-amber-700 mt-1">
                            外部系统或人工处理未完成。任务已挂起 (Paused)，等待外部回调恢复。
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
              </div>

              {/* Actions */}
              <div className="p-5 border-t border-neutral-100 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button className="px-5 py-3 text-neutral-600 text-[13px] font-bold hover:bg-neutral-50 rounded-xl transition-colors">
                    查看项目档案
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {selectedTask.title.includes("内容确认") ? (
                    <>
                      <button className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2">
                        <BookOpen size={16} /> 转为知识记忆
                      </button>
                      <button className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2">
                        <UserPlus size={16} /> 改派
                      </button>
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md"
                      >
                        <Send size={16} /> 确认并排期发布
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">
                        暂不处理
                      </button>
                      <button className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2">
                        <UserPlus size={16} /> 改派
                      </button>
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-md"
                      >
                        确认处理并归档
                        <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
