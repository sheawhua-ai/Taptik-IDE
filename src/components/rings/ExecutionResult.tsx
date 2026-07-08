import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Image as ImageIcon,
  CheckCircle2,
  X,
  FileText,
  User,
  History,
  ShieldAlert,
  Zap,
  ArrowRight,
  Database,
  Filter,
  Check,
  Sparkles
} from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low";
type Stage = "发布前" | "发布中" | "发布后";
type AutoBoundary = "可一键处理" | "需确认" | "需负责人介入" | "仅记录不处理";

interface Task {
  id: string;
  type: string;
  priority: Priority;
  title: string;
  reason: string;
  impact: string;
  recommendation: string;
  source: string;
  stage: Stage;
  autoBoundary: AutoBoundary;
}

const TASKS: Task[] = [
  {
    id: "t1",
    type: "负面风险",
    priority: "critical",
    title: "评论区出现严重负面舆情",
    reason: "用户投诉产品质量，已引发 3 条跟评附和。",
    impact: "可能影响该爆款笔记后续 30% 转化率及品牌口碑",
    recommendation: "隐藏该评论 / 官方致歉回复 / 内部核实",
    source: "「幼犬换粮避坑第 6 篇」 / A02 避坑号",
    stage: "发布后",
    autoBoundary: "需负责人介入",
  },
  {
    id: "t2",
    type: "发布异常",
    priority: "critical",
    title: "两篇核心引流笔记发布失败",
    reason: "平台提示：账号存在违规风险，内容含营销词违规。",
    impact: "直接影响今日 40% 的排期发布及整体线索获客量",
    recommendation: "一键修改违规词并重发 / 申诉 / 延期排期",
    source: "「双十一平替清单」 / 矩阵号 C, D",
    stage: "发布中",
    autoBoundary: "需确认",
  },
  {
    id: "t3",
    type: "高意向线索",
    priority: "high",
    title: "用户咨询线下门店地址",
    reason: "用户明确询问：“北京朝阳区有店吗？周末想带狗去看看”",
    impact: "极高意向转化机会，预计客单价 ¥500+",
    recommendation: "回复门店位置 + 引导加企微领取换粮表",
    source: "「幼犬换粮避坑第 6 篇」 / A02 避坑号",
    stage: "发布后",
    autoBoundary: "需确认",
  },
  {
    id: "t4",
    type: "素材补齐",
    priority: "high",
    title: "3 篇笔记缺乏产品白底图",
    reason: "AI 编排策略要求在图 3 加入白底对比图，但库中无合适素材",
    impact: "影响 3 篇笔记的完整度，导致排期阻塞",
    recommendation: "一键派发拍摄任务给【设计部】 / 从历史素材库调取",
    source: "项目：双十一冲刺企划",
    stage: "发布前",
    autoBoundary: "需确认",
  },
  {
    id: "t5",
    type: "评论待回复",
    priority: "medium",
    title: "批量处理 15 条普通评论 (已合并)",
    reason: "同一篇笔记下产生多条相似询问（如：多少钱、怎么买）",
    impact: "互动率维护，提升笔记权重",
    recommendation: "批量发送 AI 拟人的价格引导回复",
    source: "「秋冬新品首发」 / 主账号",
    stage: "发布后",
    autoBoundary: "可一键处理",
  },
  {
    id: "t6",
    type: "内容确认",
    priority: "medium",
    title: "5 篇 AI 撰写的种草笔记待确认",
    reason: "已按照最新的【幼犬避坑】人设生成，需确认语气",
    impact: "影响明日发布排期 25% 进度",
    recommendation: "批量通过并排期 / 抽取 1 篇细调",
    source: "项目：秋冬种草矩阵",
    stage: "发布前",
    autoBoundary: "需确认",
  },
  {
    id: "t7",
    type: "复盘沉淀",
    priority: "low",
    title: "沉淀：高转化话术库",
    reason: "客服 A 使用的话术昨日转化率提升 40%，建议沉淀为通用规则",
    impact: "提升全团队私域转化率",
    recommendation: "加入知识与规则层，供 AI 学习应用",
    source: "客服聊天记录",
    stage: "发布后",
    autoBoundary: "仅记录不处理",
  },
];

const priorityColors = {
  critical: "bg-rose-50 text-rose-700 border-rose-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  low: "bg-neutral-50 text-neutral-600 border-neutral-200",
};

const priorityLabels = {
  critical: "极高优",
  high: "高优",
  medium: "中优",
  low: "低优",
};

const boundaryColors = {
  "可一键处理": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "需确认": "bg-amber-50 text-amber-700 border-amber-200",
  "需负责人介入": "bg-rose-50 text-rose-700 border-rose-200",
  "仅记录不处理": "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export function ExecutionResult() {
  const [activeTab, setActiveTab] = useState<Stage | "全部">("全部");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("set-custom-greeting", {
        detail: {
          greeting:
            "执行中心已升级为统一任务流。\n\nAI 已自动去重并合并了 15 条相似评论。当前有 2 个极高优风险需要您立即处理，否则将影响今日分发排期。\n\n您可以对我说：\n“一键处理所有中优任务”\n“把高优线索分给小李”\n“处理违规异常”",
          expert: "执行中心助手",
        },
      }),
    );
  }, []);

  const filteredTasks = TASKS.filter(
    (t) => activeTab === "全部" || t.stage === activeTab
  );

  return (
    <div className="space-y-6 relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[20px] font-semibold text-neutral-900">
            执行中心 (统一任务流)
          </h3>
          <p className="text-[14px] text-neutral-500 mt-1">
            聚合发布前后所有人工节点，按商业价值排序，处理后自动沉淀资产与规则。
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg">
          <Zap size={16} /> AI 已过滤合并 23 条重复事件
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {["全部", "发布前", "发布中", "发布后"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeTab === tab
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4 pb-20">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedTask(task)}
              className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
            >
              {/* Priority Bar Indicator */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  task.priority === "critical"
                    ? "bg-rose-500"
                    : task.priority === "high"
                    ? "bg-amber-500"
                    : task.priority === "medium"
                    ? "bg-blue-500"
                    : "bg-neutral-400"
                }`}
              />

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                    <span className="text-[13px] font-bold text-neutral-900">
                      {task.type}
                    </span>
                    <span className="text-neutral-300 mx-1">|</span>
                    <span className="text-[12px] text-neutral-500">
                      阶段: {task.stage}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        boundaryColors[task.autoBoundary]
                      }`}
                    >
                      {task.autoBoundary}
                    </span>
                  </div>
                  <h4 className="text-[16px] font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {task.title}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle size={12} className="text-neutral-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 mb-0.5">为什么要处理</div>
                        <div className="text-[13px] text-neutral-700 leading-snug">{task.reason}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap size={12} className="text-neutral-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 mb-0.5">影响范围</div>
                        <div className="text-[13px] text-neutral-700 leading-snug">{task.impact}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={12} className="text-primary-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-primary-600 mb-0.5">AI 推荐动作</div>
                        <div className="text-[13px] text-neutral-900 font-medium leading-snug">{task.recommendation}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Database size={12} className="text-neutral-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 mb-0.5">来源上下文</div>
                        <div className="text-[13px] text-neutral-600 leading-snug">{task.source}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pl-6 flex flex-col items-end gap-2 border-l border-neutral-100 ml-6 min-w-[140px]">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                    }}
                    className="w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    处理任务
                  </button>
                  {task.autoBoundary === "可一键处理" && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm"
                    >
                      AI 一键执行
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Task Context Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-4 right-4 bottom-4 w-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-neutral-200 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        priorityColors[selectedTask.priority]
                      }`}
                    >
                      {priorityLabels[selectedTask.priority]}
                    </span>
                    <span className="text-[13px] font-medium text-neutral-500">
                      {selectedTask.type}
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

              {/* Context Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* 1. Context Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <div className="text-[11px] font-bold text-neutral-400 mb-3 flex items-center gap-1.5">
                      <Database size={14} /> 所属上下文
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-neutral-400">所属项目</div>
                        <div className="text-[13px] font-medium text-neutral-900">双十一冲刺企划</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400">发布账号</div>
                        <div className="text-[13px] font-medium text-neutral-900">A02 避坑号</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400">来源</div>
                        <div className="text-[13px] font-medium text-neutral-900">{selectedTask.source}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <div className="text-[11px] font-bold text-neutral-400 mb-3 flex items-center gap-1.5">
                      <User size={14} /> 用户画像与历史
                    </div>
                    {selectedTask.priority === "high" || selectedTask.priority === "critical" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0" />
                          <div>
                            <div className="text-[13px] font-bold text-neutral-900">@狗子妈妈</div>
                            <div className="text-[10px] text-neutral-500">活跃高净值客户</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-neutral-400">历史沟通</div>
                          <div className="text-[12px] text-neutral-700 mt-1">2 个月前曾咨询过夏季换粮，未成交。当前具有极高复粉可能。</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20 text-[12px] text-neutral-400">
                        暂无强关联用户画像
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Detail Content */}
                <div>
                  <h4 className="text-[14px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-neutral-500" /> 相关正文/素材
                  </h4>
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-[13px] text-neutral-700 leading-relaxed">
                    {selectedTask.type === "素材补齐" ? (
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-400">无封面</div>
                        <div className="flex-1">
                          <p className="font-bold mb-1">排期阻塞</p>
                          <p>大纲要求展示产品颗粒度细节，但图库中未找到。建议立刻使用手机实拍补齐。</p>
                        </div>
                      </div>
                    ) : selectedTask.type.includes("评论") || selectedTask.type.includes("线索") || selectedTask.priority === "critical" ? (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-neutral-100">
                          <span className="text-primary-600 font-bold mr-2">@用户:</span>
                          {selectedTask.reason}
                        </div>
                        {selectedTask.priority === "critical" && (
                          <div className="bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-100 flex items-start gap-2">
                            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                            <span className="font-medium text-[12px]">系统判定：涉及违禁词或品牌声誉风险，已触发阻断，建议人工快速核查。</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>这里是笔记的完整正文预览。如果需要确认内容，可直接在此处查看并编辑。</p>
                    )}
                  </div>
                </div>

                {/* 3. AI Recommendation & Writeback */}
                <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
                  <h4 className="text-[14px] font-bold text-primary-900 mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-primary-600" /> AI 建议处理动作
                  </h4>
                  <p className="text-[13px] text-primary-800 font-medium mb-4 leading-relaxed">
                    {selectedTask.recommendation}
                  </p>
                  
                  <div className="h-px bg-primary-100 w-full my-4" />
                  
                  <div className="flex items-start gap-2">
                    <History size={14} className="text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[12px] font-bold text-primary-700">处理后回写机制</div>
                      <div className="text-[11px] text-primary-600 mt-1 leading-snug">
                        完成本任务后，AI 将自动把处理结果沉淀至：<br/>
                        <span className="font-medium">1. 知识与规则层</span> (更新商家记忆)<br/>
                        <span className="font-medium">2. 客户档案</span> (若涉及用户)<br/>
                        <span className="font-medium">3. 数据复盘</span> (修正分析基线)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-end gap-3 shrink-0">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors"
                >
                  暂不处理
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                  }}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-md"
                >
                  {selectedTask.autoBoundary === "可一键处理" ? "授权 AI 执行并沉淀" : "确认处理并沉淀到资产库"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
