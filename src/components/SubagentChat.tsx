import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, Sparkles, Zap, MessageSquare, 
  Terminal, History, Settings, MoreVertical, Check, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

interface SubagentChatProps {
  moduleId: string;
  moduleName: string;
}

export const SubagentChat: React.FC<SubagentChatProps> = ({ moduleId, moduleName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `已收到指令：${inputValue}。正在调动相关子智能体模块执行，稍后会显现在右侧画布中。`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-100 w-[380px] shrink-0 overflow-hidden relative shadow-sm">
      {/* Header */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-5 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Cpu size={16} />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-neutral-900 leading-none">{moduleName} 助手</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Subagent Online</p>
            </div>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-neutral-100/50"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-neutral-900 text-white rounded-tr-none' 
                : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
            }`}>
              {msg.content}
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
      <div className="p-4 bg-white border-t border-neutral-100">
        <div className="relative flex items-center">
          <textarea 
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={`给 ${moduleName} 助手下达具体指令...`}
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
