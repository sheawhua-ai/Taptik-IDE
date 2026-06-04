import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, Sparkles, Zap, MessageSquare, 
  Terminal, History, Settings, MoreVertical, Check, Cpu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'plan' | 'report';
  status?: 'pending' | 'running' | 'completed' | 'error';
  subtasks?: { id: string; name: string; status: 'pending' | 'running' | 'completed'; agent: string }[];
}

interface SubagentChatProps {
  moduleId: string;
  moduleName: string;
  onNavigate?: (tabId: 'strategy' | 'content' | 'execution' | 'interaction' | 'metrics') => void;
  onClose?: () => void;
}

export const SubagentChat: React.FC<SubagentChatProps> = ({ moduleId, moduleName, onNavigate, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const COMMANDS = [
    { cmd: '/开启全域巡航', desc: '启动当前商家的蓝海关键词扫描任务', module: 'data' },
    { cmd: '/导出数据', desc: '将当前模块分析结果导出为 Excel/PDF', module: 'data' },
    { cmd: '/停止当前流水线', desc: '紧急终止编排中心所有正在运行的任务', module: 'exec' },
    { cmd: '/查看日志', desc: '调取该模块数字员工的详细操作日志', module: 'exec' },
  ];

  useEffect(() => {
    // Initial greeting based on module - only reset if moduleId changes
    const greetings: Record<string, string> = {
      'strategy': `您好！我是全域巡航数字员工。我正在为您监测「${moduleName}」相关的行业蓝海机会。您可以问我关于市场趋势或竞品策略的问题。`,
      'content': `智造工场数字员工已就绪。正在为您解析最近的爆款笔记逻辑。您可以下达改写、生成或润色内容指令。`,
      'execution': `编排中心数字员工在线。正在管理您的自动化任务流。需要我调整执行顺序或增加监控节点吗？`,
      'interaction': `触达转化助手已连接。正在分析意图私信。您可以让我自动回复或导出高潜线索。`,
      'metrics': `归因复盘专家已就绪。正在分析 ROI 与爆文率。需要我生成本周的运营对比报表吗？`
    };

    setMessages([
      {
        id: '1',
        role: 'agent',
        content: greetings[moduleId] || `您好，我是 ${moduleName} 模块的数字员工，请问有什么可以帮您？`,
        timestamp: new Date()
      }
    ]);
  }, [moduleId]); // Only reset when changing modules, not when moduleName (object lookup result) might be unstable

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (inputValue.startsWith('/')) {
        // Handle command locally or send as command
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      // If prompt contains keywords for planning
      if (inputValue.includes('策划') || inputValue.includes('任务') || inputValue.includes('方案')) {
        const planMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: '识别到复杂任务需求，正在调动子智能体群组构建执行流水线...',
          timestamp: new Date(),
          type: 'plan',
          status: 'running',
          subtasks: [
            { id: 't1', name: '全域需求对齐', status: 'completed', agent: '主控助手' },
            { id: 't2', name: '外部竞品词库抓取', status: 'running', agent: '巡航助手' },
            { id: 't3', name: '小红书笔记脚本产出', status: 'pending', agent: '智造助手' },
            { id: 't4', name: '投放节点编排', status: 'pending', agent: '编排助手' },
          ]
        };
        setMessages(prev => [...prev, planMsg]);
        setIsTyping(false);

        // Simulate plan progression
        setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === planMsg.id ? {
            ...m,
            subtasks: m.subtasks?.map(st => st.id === 't2' ? { ...st, status: 'completed' } : st.id === 't3' ? { ...st, status: 'running' } : st)
          } : m));
        }, 3000);
      } else {
        const agentMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: `已收到指令：${inputValue}。正在调动相关子智能体模块执行，稍后会显现在右侧画布中。`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMsg]);
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === '/') {
      setShowCommandMenu(true);
    } else if (!val.includes('/')) {
      setShowCommandMenu(false);
    }
  };

  const selectCommand = (cmd: string) => {
    setInputValue(cmd + ' ');
    setShowCommandMenu(false);
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'plan') {
      return (
        <div className="space-y-4">
          <p className="text-[13px] font-bold text-neutral-600 mb-4">{msg.content}</p>
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-3">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2 py-0.5 bg-neutral-100 rounded">Orchestration Plan v1.0</span>
               <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-black text-primary-500 uppercase tracking-tighter">Running</span>
               </div>
            </div>
            {msg.subtasks?.map((sub, idx) => (
              <div key={sub.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${sub.status === 'completed' ? 'bg-emerald-500 text-white' : sub.status === 'running' ? 'bg-neutral-900 text-white animate-pulse' : 'bg-white border border-neutral-200 text-neutral-300'}`}>
                    {sub.status === 'completed' ? <Check size={12} strokeWidth={4} /> : <div className="text-[10px] font-black">{idx + 1}</div>}
                  </div>
                  <div>
                    <div className="text-[12px] font-black text-neutral-900 leading-tight">{sub.name}</div>
                    <div className="text-[9px] font-bold text-neutral-400">{sub.agent} 执行中</div>
                  </div>
                </div>
                {sub.status === 'completed' && (
                  <button 
                    onClick={() => {
                        const tabMap: Record<string, 'strategy' | 'content' | 'execution' | 'interaction' | 'metrics'> = {
                            '巡航助手': 'strategy',
                            '智造助手': 'content',
                            '编排助手': 'execution'
                        };
                        const target = tabMap[sub.agent];
                        if (target && onNavigate) onNavigate(target);
                    }}
                    className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[9px] font-black text-neutral-400 hover:text-primary-500 hover:border-primary-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
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
    return <p className="text-[13px] font-bold leading-relaxed">{msg.content}</p>;
  };

  return (
    <div className="flex flex-col h-full bg-white w-full overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-5 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm ring-1 ring-neutral-800">
            <Cpu size={16} />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-neutral-900 leading-none">{moduleName} 助手</h3>
            <div className="flex items-center gap-1.5 mt-1.2">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Agent Logic Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-1 px-2 text-[10px] font-black text-neutral-400 bg-neutral-50 rounded-md border border-neutral-100 uppercase tracking-tighter">Clear Memory</button>
           {onClose && (
             <button 
               onClick={onClose}
               className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
             >
               <X size={18} />
             </button>
           )}
           <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
              <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-neutral-100/50"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-neutral-900 text-white rounded-tr-none' 
                : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
            }`}>
              {renderMessageContent(msg)}
            </div>
            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest mt-1.5 px-1">
              {msg.role === 'agent' ? 'Digital Employee' : 'Admin'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        <AnimatePresence>
          {showCommandMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
            >
              <div className="px-3 py-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-50 mb-1 flex items-center justify-between">
                 <span>快捷指令菜单</span>
                 <span className="text-[8px] bg-neutral-100 px-1 rounded">ESC</span>
              </div>
              <div className="space-y-1">
                {COMMANDS.map((c, i) => (
                  <button 
                    key={i} 
                    onClick={() => selectCommand(c.cmd)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-neutral-50 rounded-xl transition-all group text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-neutral-900 group-hover:text-primary-500 transition-colors">{c.cmd}</span>
                      <span className="text-[10px] font-bold text-neutral-400">{c.desc}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap size={14} className="text-primary-500" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center">
          <textarea 
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === 'Escape') {
                setShowCommandMenu(false);
              }
            }}
            placeholder={`输入指令，或键入 "/" 唤出动作菜单...`}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 pl-4 pr-12 text-[13px] font-bold outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all resize-none overflow-hidden placeholder:text-neutral-300"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-[10px] font-black text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest bg-neutral-100/50 px-2 py-1 rounded">
                    <History size={11} /> 历史
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest bg-neutral-100/50 px-2 py-1 rounded">
                    <Terminal size={11} /> 脚本
                </button>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-neutral-300 uppercase tracking-[0.2em]">
                Auto-Scheduling Active
            </div>
        </div>
      </div>
    </div>
  );
};
