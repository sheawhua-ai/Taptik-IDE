// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  MessageSquare,
  Terminal,
  History,
  Settings,
  MoreVertical,
  Check,
  Cpu,
  X,
  FileText,
  Trash2,
  Compass,
  PenTool,
  Calendar,
  Users,
  BarChart,
  Workflow,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SmartInput } from "./SmartInput";

interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  type?: "text" | "plan" | "report" | "alternatives";
  alternativesData?: {
    title: string;
    current: string;
    reason: string;
    alternatives: { name: string; desc: string }[];
  };
  status?: "pending" | "running" | "completed" | "error";
  subtasks?: {
    id: string;
    name: string;
    status: "pending" | "running" | "completed";
    agent: string;
  }[];
  contextPill?: { type: string; text: string };
}

interface SubagentChatProps {
  moduleId: string;
  moduleName: string;
  onNavigate?: (
    tabId: "strategy" | "content" | "execution" | "interaction" | "metrics",
  ) => void;
  onClose?: () => void;
  initialExpert?: string;
  initialContext?: string;
  }

export const SubagentChat: React.FC<SubagentChatProps> = ({
  moduleId,
  moduleName,
  onNavigate,
  onClose,
  initialExpert,
  initialContext,
  }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [contextPill, setContextPill] = useState<{
    type: string;
    text: string;
  } | null>(null);
  const [customGreeting, setCustomGreeting] = useState<string | null>(null);
  const [currentExpert, setCurrentExpert] = useState<string>(
    moduleName + " 助手",
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [alternativesModeData, setAlternativesModeData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getExpertIcon = (name: string) => {
    if (name.includes("策略")) return <Compass size={16} />;
    if (name.includes("内容")) return <PenTool size={16} />;
    if (name.includes("排期")) return <Calendar size={16} />;
    if (name.includes("客资")) return <Users size={16} />;
    if (name.includes("数据")) return <BarChart size={16} />;
    if (name.includes("编排")) return <Workflow size={16} />;
    return <Bot size={16} />;
  };

  const COMMANDS = [
    {
      cmd: "/催办进度",
      desc: "检查哪些 KOS 员工未完成本周期发文任务",
      module: "matrix",
    },
    {
      cmd: "/批量派单",
      desc: "给选中的自有账号批量下发指定 SOP 任务",
      module: "matrix",
    },
    {
      cmd: "/巡检风控",
      desc: "扫描监控的账号是否有被限流或违规封禁风险",
      module: "matrix",
    },
    {
      cmd: "/开启全域巡航",
      desc: "启动当前商家的蓝海关键词扫描任务",
      module: "data",
    },
    {
      cmd: "/导出数据",
      desc: "将当前模块分析结果导出为 Excel/PDF",
      module: "data",
    },
    {
      cmd: "/停止当前流水线",
      desc: "紧急终止编排中心所有正在运行的任务",
      module: "exec",
    },
    {
      cmd: "/查看日志",
      desc: "调取该模块数字员工的详细操作日志",
      module: "exec",
    },
  ];

  useEffect(() => {
    setCurrentExpert(
      moduleId === "strategy" ? "操盘副手" : moduleName + " 助手",
    );
    // Initial greeting based on module - only reset if moduleId changes
    const greetings: Record<string, string> = {
      strategy: `我已经完成这个商家的今日巡航。\n\n当前最值得优先处理的是「幼犬换粮避坑」方向。它适合用自然流内容先测试，不建议一开始直接做硬广投流。\n\n你可以直接说：\n“开始操盘”\n“继续深挖低粉爆款”\n“换成专业号方向”\n“只用 A01 和 A02”`,
      matrix: `矩阵调度数字员工已就绪。正在为您监控自有 KOS 账号与外部素人发文状态。您可以让我下发任务或排查账号异常。`,
      content: `内容助手已就绪。正在为您解析最近的爆款笔记逻辑。您可以下达改写、生成或润色内容指令。`,
      execution: `编排中心数字员工在线。正在管理您的自动化任务流。需要我调整执行顺序或增加监控节点吗？`,
      interaction: `触达转化助手已连接。正在分析意图私信。您可以让我自动回复或导出高潜线索。`,
      metrics: `归因复盘专家已就绪。正在分析 ROI 与爆文率。需要我生成本周的运营对比报表吗？`,
    };

    setMessages([
      {
        id: "1",
        role: "agent",
        content:
          customGreeting ||
          greetings[moduleId] ||
          `您好，我是 ${moduleName} 模块的数字员工，请问有什么可以帮您？`,
        timestamp: new Date(),
      },
    ]);
  }, [moduleId, customGreeting, moduleName]);

  const handleCustomGreeting = (e: any) => {
    if (e.detail?.greeting) {
      setCustomGreeting(e.detail.greeting);
    }
    if (e.detail?.expert) {
      setCurrentExpert(e.detail.expert);
    }
  };

  useEffect(() => {
    window.addEventListener("set-custom-greeting", handleCustomGreeting);
    return () =>
      window.removeEventListener("set-custom-greeting", handleCustomGreeting);
  }, []);

  useEffect(() => {
    const handleOpenExpert = (e: any) => {
      const { expert, context, alternativesData } = e.detail || {};
      if (expert) {
        setCurrentExpert(expert);
      }
      if (alternativesData) {
        setAlternativesModeData(alternativesData);
        return;
      } else {
        setAlternativesModeData(null);
        if (context) {
          setContextPill({ type: expert || "参考内容", text: context });
          setInputValue((prev) => prev || `请分析这个`);
        }
      }
    };
    window.addEventListener("open-expert", handleOpenExpert);
    return () => window.removeEventListener("open-expert", handleOpenExpert);
  }, [moduleId, customGreeting]); // Only reset when changing modules, not when moduleName (object lookup result) might be unstable

  useEffect(() => {
    if (initialExpert) setCurrentExpert(initialExpert);
    {
      setAlternativesModeData(null);
      if (initialContext) {
        setContextPill({
          type: initialExpert || "参考内容",
          text: initialContext,
        });
        setInputValue((prev) => prev || `请分析这个`);
      }
    }
  }, [initialExpert, initialContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() && !contextPill) return;
    sendDirectMessage(inputValue, contextPill);
    setInputValue("");
    setContextPill(null);
  };

  const sendDirectMessage = (text: string, contextObj: any = null) => {
    if (text.startsWith("/")) {
      // Handle command locally or send as command
    }

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2),
      role: "user",
      content: text,
      timestamp: new Date(),
      contextPill: contextObj,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      // If prompt contains keywords for full-link (Direction 4)
      if (
        text.includes("发 5 条") || text.includes("下周") || text.includes("笔记")
      ) {
        const planMsg: Message = {
          id: Math.random().toString(36).substring(2),
          role: "agent",
          content: "收到！已为您自动编排全链路任务，正在套用「夏季护肤爆款模板」并匹配素材...",
          timestamp: new Date(),
          type: "plan",
          status: "running",
          subtasks: [
            {
              id: "t1",
              name: "1. 知识库检索选题 (夏季护肤)",
              status: "completed",
              agent: "分析助手",
            },
            {
              id: "t2",
              name: "2. 生成 5 篇文案 (爆款模板)",
              status: "running",
              agent: "内容助手",
            },
            {
              id: "t3",
              name: "3. 匹配上周拍摄素材库",
              status: "pending",
              agent: "资产助手",
            },
            {
              id: "t4",
              name: "4. 排期到内容日历 (下周三)",
              status: "pending",
              agent: "调度助手",
            },
          ],
        };
        setMessages((prev) => [...prev, planMsg]);
        setIsTyping(false);

        // Simulate plan progression
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === planMsg.id
                ? {
                    ...m,
                    subtasks: m.subtasks?.map((st) =>
                      st.id === "t2"
                        ? { ...st, status: "completed" }
                        : st.id === "t3"
                          ? { ...st, status: "running" }
                          : st,
                    ),
                  }
                : m,
            ),
          );
          
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === planMsg.id
                  ? {
                      ...m,
                      status: "completed",
                      content: "✅ 全链路任务准备完毕！已生成 5 篇笔记并匹配素材。排期在下周三。请确认预览或微调。",
                      subtasks: m.subtasks?.map((st) => ({ ...st, status: "completed" })),
                    }
                  : m,
              ),
            );
          }, 1500);
        }, 1500);
      } else if (
        text.includes("策划") ||
        text.includes("任务") ||
        text.includes("方案")
      ) {
        const planMsg: Message = {
          id: Math.random().toString(36).substring(2),
          role: "agent",
          content: "识别到复杂任务需求，正在调动子智能体群组构建执行流水线...",
          timestamp: new Date(),
          type: "plan",
          status: "running",
          subtasks: [
            {
              id: "t1",
              name: "全域需求对齐",
              status: "completed",
              agent: "主控助手",
            },
            {
              id: "t2",
              name: "外部竞品词库抓取",
              status: "running",
              agent: "巡航助手",
            },
            {
              id: "t3",
              name: "小红书笔记脚本产出",
              status: "pending",
              agent: "内容助手",
            },
            {
              id: "t4",
              name: "投放节点编排",
              status: "pending",
              agent: "编排助手",
            },
          ],
        };
        setMessages((prev) => [...prev, planMsg]);
        setIsTyping(false);

        // Simulate plan progression
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === planMsg.id
                ? {
                    ...m,
                    subtasks: m.subtasks?.map((st) =>
                      st.id === "t2"
                        ? { ...st, status: "completed" }
                        : st.id === "t3"
                          ? { ...st, status: "running" }
                          : st,
                    ),
                  }
                : m,
            ),
          );
        }, 3000);
      } else {
        const agentMsg: Message = {
          id: Math.random().toString(36).substring(2),
          role: "agent",
          content: `已收到指令：${text}。正在调动相关子智能体模块执行，稍后会显现在右侧画布中。`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
  };

  const selectCommand = (cmd: string) => {
    setInputValue(cmd + " ");
    setShowCommandMenu(false);
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === "plan") {
      return (
        <div className="space-y-4">
          <p className="text-[13px] text-neutral-600 mb-4">{msg.content}</p>
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded">
                编排计划 v1.0
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping" />
                <span className="text-[10px] text-primary-500">执行中</span>
              </div>
            </div>
            {msg.subtasks?.map((sub, idx) => (
              <div
                key={sub.id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${sub.status === "completed" ? "bg-neutral-900 text-white" : sub.status === "running" ? "bg-neutral-900 text-white animate-pulse" : "bg-white border border-neutral-200 text-neutral-300"}`}
                  >
                    {sub.status === "completed" ? (
                      <Check size={12} strokeWidth={4} />
                    ) : (
                      <div className="text-[10px] ">{idx + 1}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-900 leading-tight">
                      {sub.name}
                    </div>
                    <div className="text-[9px] text-neutral-400">
                      {sub.agent} 执行中
                    </div>
                  </div>
                </div>
                {sub.status === "completed" && (
                  <button
                    onClick={() => {
                      const tabMap: Record<
                        string,
                        | "strategy"
                        | "content"
                        | "execution"
                        | "interaction"
                        | "metrics"
                      > = {
                        巡航助手: "strategy",
                        内容助手: "content",
                        编排助手: "execution",
                      };
                      const target = tabMap[sub.agent];
                      if (target && onNavigate) onNavigate(target);
                    }}
                    className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[9px] text-neutral-400 hover:text-primary-500 hover:border-primary-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    定位模块
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
        {msg.content}
      </p>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white w-full overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-5 bg-white shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm ring-1 ring-neutral-800">
            {getExpertIcon(currentExpert)}
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-neutral-900 leading-none">
              {currentExpert}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.2">
              <div className="w-1 h-1 rounded-full bg-neutral-900 animate-pulse" />
              <p className="text-[10px] text-neutral-500">在线监控中</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
              title="收起助手"
            >
              <X size={18} />
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            {showOptions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowOptions(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-neutral-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  <button
                    onClick={() => {
                      setMessages([]);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[12px] text-primary-500 hover:bg-primary-50 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={14} /> 清除会话记录
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-neutral-100/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            {msg.role === "user" && msg.contextPill && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white text-primary-600 rounded-xl text-[12px] shadow-sm mb-2 max-w-[90%] border border-primary-100">
                <FileText size={14} className="shrink-0" />
                <span className="shrink-0 text-primary-800">
                  {msg.contextPill.type}
                </span>
                <span className="text-neutral-400 px-1">|</span>
                <span className="truncate text-neutral-600">
                  {msg.contextPill.text}
                </span>
              </div>
            )}
            <div
              className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-neutral-900 text-white rounded-tr-none"
                  : "bg-white text-neutral-800 border border-neutral-100 rounded-tl-none"
              }`}
            >
              {renderMessageContent(msg)}
            </div>
            <span className="text-[10px] text-neutral-400 mt-1.5 px-1">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start scale-90 origin-left opacity-70">
            <div className="bg-white border border-neutral-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-neutral-100 relative">
        <div className="relative bg-neutral-50 border border-neutral-200 rounded-2xl p-1.5 focus-within:border-primary-500/50 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all">
          {contextPill && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary-600 rounded-xl text-[12px] shadow-sm mb-1 ml-1 mt-1 max-w-[90%] border border-primary-100 w-max">
              <FileText size={14} className="shrink-0" />
              <span className="shrink-0 text-primary-800">{contextPill.type}</span>
              <span className="text-neutral-400 px-1">|</span>
              <span className="truncate text-neutral-600 max-w-[200px]">
                {contextPill.text}
              </span>
              <button
                onClick={() => setContextPill(null)}
                className="ml-2 text-neutral-400 hover:text-primary-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex items-end h-full">
            <SmartInput
              rows={1}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`输入指令，或键入 "@" "/" 唤出动作菜单...`}
              className="w-full bg-transparent py-2.5 pl-3 pr-2 text-[13px] outline-none resize-none overflow-y-auto placeholder:text-neutral-300 min-h-[40px] max-h-[160px]"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && !contextPill}
              className="shrink-0 mb-0.5 mr-0.5 w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
