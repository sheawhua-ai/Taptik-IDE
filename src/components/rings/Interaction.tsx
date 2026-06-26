import React, { useState } from "react";
import {
  MessageSquare,
  Flame,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Smartphone,
  Bot,
  Send,
  Clock,
  User,
  Link as LinkIcon,
  Image as ImageIcon,
  QrCode,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

type TaskTab = "todo" | "risk" | "opportunity" | "acceptance";

interface TaskItem {
  id: string;
  tab: TaskTab;
  objectType: "内容" | "账号" | "评论" | "私信" | "素材" | "客户";
  event: "待审核" | "异常" | "机会" | "驳回" | "超时" | "内部派发" | "外部领取";
  title: string;
  priority: "高" | "中" | "低";
  assignee: string;
  deadline: string;
  aiSuggestion: string;
  details?: string;
}

const MOCK_TASKS: TaskItem[] = [
  {
    id: "1",
    tab: "opportunity",
    objectType: "私信",
    event: "机会",
    title: "高意向私信：询问二线城市代理保护",
    priority: "高",
    assignee: "未分配",
    deadline: "今天 12:00",
    aiSuggestion:
      "AI 已判定意向极高，已提取微信号 wx_827364，建议立即分配商务跟进。",
    details:
      "“请问如果在二线城市开线下店，有区域代理保护吗？我的微信号是 wx_827364，能否发一份详细的资料？”",
  },
  {
    id: "2",
    tab: "risk",
    objectType: "评论",
    event: "异常",
    title: "高热度负面评论发酵风险",
    priority: "高",
    assignee: "李店长",
    deadline: "今天 10:30",
    aiSuggestion: "建议立即回复安抚，AI 已起草包含无门槛换新承诺的回复模版。",
    details:
      "“这是我第三次买了，这次的包装真的太敷衍了，瓶子都瘪了，太失望了直接粉转黑。”",
  },
  {
    id: "3",
    tab: "todo",
    objectType: "素材",
    event: "内部派发",
    title: "幼犬到家实拍补充任务",
    priority: "高",
    assignee: "李店长",
    deadline: "今天 18:00",
    aiSuggestion: "需要 3 段狗狗吃粮的真实短视频，建议推送到企微全员群。",
  },
  {
    id: "4",
    tab: "todo",
    objectType: "内容",
    event: "待审核",
    title: "幼犬挑食其实是你的锅",
    priority: "中",
    assignee: "我",
    deadline: "明天 12:00",
    aiSuggestion: "AI 建议将开头调整为更情绪化的“吐槽向”。",
  },
  {
    id: "5",
    tab: "todo",
    objectType: "内容",
    event: "外部领取",
    title: "3 个任务适合外部账号分发",
    priority: "低",
    assignee: "未分配",
    deadline: "本周五",
    aiSuggestion: "已准备好扫码即发布与真实体验领取的入口码，建议生成并分发。",
  },
];

export const Interaction: React.FC<{ hasData?: boolean }> = ({
  hasData = true,
}) => {
  const [activeTab, setActiveTab] = useState<TaskTab>("todo");

  const filteredTasks = MOCK_TASKS.filter((t) => t.tab === activeTab);

  if (!hasData) {
    return (
      <div className="flex h-full w-full bg-white overflow-hidden items-center justify-center">
        <div className="max-w-md w-full p-12 bg-white rounded-[64px] border border-neutral-100 shadow-2xl shadow-neutral-200/50 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center text-blue-500 mb-10 group hover:rotate-12 transition-transform">
            <MessageSquare size={48} className="fill-current" />
          </div>
          <h3 className="text-2xl font-semibold text-neutral-900 mb-4 italic tracking-tight">
            协同任务模块已上线
          </h3>
          <p className="text-[14px] text-neutral-400 leading-relaxed mb-10">
            统一收口内部派发、外部领取、客户审核与高优异常。所有需要人介入的环节，都在这里流转。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa] overflow-hidden">
      {/* 头部标题区 */}
      <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 w-full mb-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">
              协同任务
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              需要人处理的任务、需要关注的异常、需要抓住的机会，统一收口。
            </p>
          </div>
        </div>
      </div>

      {/* 顶部三个切换 */}
      <div className="px-8 py-4 bg-white border-b border-neutral-100 flex gap-4 shrink-0">
        {[
          {
            id: "todo",
            name: "待我处理",
            count: 3,
            icon: Clock,
            color: "text-blue-600",
          },
          {
            id: "acceptance",
            name: "素材验收池",
            count: 2,
            icon: ImageIcon,
            color: "text-emerald-600",
          },
          {
            id: "risk",
            name: "异常风险",
            count: 1,
            icon: ShieldAlert,
            color: "text-red-600",
          },
          {
            id: "opportunity",
            name: "高价值机会",
            count: 1,
            icon: Flame,
            color: "text-amber-600",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TaskTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white shadow-md"
                : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-100"
            }`}
          >
            <tab.icon
              size={16}
              className={activeTab === tab.id ? "text-white" : tab.color}
            />
            {tab.name}
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-white border border-neutral-200"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 任务列表区 */}

      {activeTab === "acceptance" ? (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-[18px] font-bold text-neutral-900">
                  外部与协同素材验收
                </h3>
                <p className="text-[13px] text-neutral-500 mt-1">
                  处理内部派发与外部体验任务回传的素材
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      内部协同
                    </span>
                    <span className="text-[13px] font-bold text-neutral-900">
                      幼犬实拍补充
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    李店长提交于 10 分钟前
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">
                      视频 1
                    </div>
                    <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">
                      视频 2
                    </div>
                    <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">
                      视频 3
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 p-2 rounded text-[11px] mb-3 border border-emerald-100">
                    <strong>AI 预检：</strong>
                    光线充足，满足「狗狗吃粮」动作要求，未发现违规元素。
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-neutral-900 text-white text-[12px] font-medium py-2 rounded hover:bg-neutral-800">
                      入库并装填
                    </button>
                    <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium py-2 rounded hover:bg-neutral-50">
                      退回重拍
                    </button>
                    <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium py-2 rounded hover:bg-neutral-50">
                      AI 增强处理
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[10px] text-neutral-400">
                      入库后将沉淀到「幼犬场景库」并在待发布池自动装填
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                      真实体验领取
                    </span>
                    <span className="text-[13px] font-bold text-neutral-900">
                      软便换粮打卡
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    体验用户A 提交于 1 小时前
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">
                      照片 1
                    </div>
                    <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">
                      照片 2
                    </div>
                  </div>
                  <div className="bg-red-50 text-red-700 p-2 rounded text-[11px] mb-3 border border-red-100">
                    <strong>AI 预检：</strong>光线过暗，且照片中出现了竞品包装。
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-red-200 text-red-600 text-[12px] font-medium py-2 rounded hover:bg-red-50">
                      一键驳回要求重传
                    </button>
                    <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium py-2 rounded hover:bg-neutral-50">
                      AI 消除竞品并提亮
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[10px] text-neutral-400">
                      处理后将沉淀到「用户反馈库」并在待发布池自动装填
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-4 max-w-5xl mx-auto pb-20">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-20 text-neutral-400 text-[14px]">
                当前队列无任务
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:border-neutral-300 transition-colors relative overflow-hidden group"
                >
                  {task.priority === "高" && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] font-medium rounded uppercase">
                          {task.objectType}
                        </span>
                        <span
                          className={`px-2 py-1 text-[11px] font-medium rounded ${
                            task.event === "异常"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : task.event === "机会"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : task.event === "待审核"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {task.event}
                        </span>
                      </div>
                      <h3 className="text-[16px] font-bold text-neutral-900">
                        {task.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-[12px] text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <User size={14} /> {task.assignee}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={14}
                          className={
                            task.priority === "高" ? "text-red-500" : ""
                          }
                        />
                        <span
                          className={
                            task.priority === "高"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {task.details && (
                    <div className="bg-neutral-50 p-4 rounded-xl text-[13px] text-neutral-700 leading-relaxed mb-4 border border-neutral-100">
                      {task.details}
                    </div>
                  )}

                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-5 flex gap-3 items-start">
                    <Bot size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[12px] font-bold text-blue-900 mb-1">
                        AI 建议动作
                      </h4>
                      <p className="text-[13px] text-blue-800/80">
                        {task.aiSuggestion}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-neutral-100 pt-5">
                    <button className="px-4 py-2 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                      忽略
                    </button>
                    <button className="px-4 py-2 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                      转成规则
                    </button>
                    <button className="px-4 py-2 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50">
                      催办
                    </button>
                    <button className="px-4 py-2 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100">
                      派发
                    </button>
                    <button className="px-4 py-2 text-[13px] font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 shadow-md">
                      立即处理
                    </button>
                    <button className="px-4 py-2 text-[13px] font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md flex items-center gap-1.5">
                      让 AI 先处理 <Send size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
