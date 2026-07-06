import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Store, Target, CheckCircle2, AlertCircle, Clock, Database, 
  Send, MessageSquare, Plus, ChevronRight, HelpCircle, Edit3 
} from 'lucide-react';

interface MerchantProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onboardingData?: any;
}

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pendingWrite?: {
    items: { label: string; value: string; status: 'pending' | 'confirmed' | 'rejected' }[];
  };
};

export function MerchantProfileDrawer({
  isOpen,
  onClose,
  projectName,
}: MerchantProfileDrawerProps) {
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [missingItems, setMissingItems] = useState([
    { id: 1, text: "私域承接方式不完整", action: "询问私域承接", completed: false },
    { id: 2, text: "目标用户顾虑缺少证据", action: "追问用户顾虑", completed: false },
    { id: 3, text: "内容禁区未确认", action: "确认内容禁区", completed: false },
    { id: 4, text: "本月运营目标缺少量化指标", action: "补充本月目标", completed: false }
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue("");

    // Simulate AI extraction
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "已从您的描述中提取关键信息，请确认是否写入商家画像：",
        pendingWrite: {
          items: [
            { label: "目标用户", value: "刚养狗的新手主人", status: 'pending' },
            { label: "核心痛点", value: "担心幼犬软便、不吃饭", status: 'pending' },
            { label: "私域承接", value: "引导添加企微领取换粮表", status: 'pending' },
            { label: "内容禁区", value: "不能承诺治疗效果", status: 'pending' }
          ]
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const confirmPendingWrite = (msgId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.pendingWrite) {
        return {
          ...msg,
          pendingWrite: {
            ...msg.pendingWrite,
            items: msg.pendingWrite.items.map(item => ({ ...item, status: 'confirmed' }))
          }
        };
      }
      return msg;
    }));

    // Simulate ticking off missing items
    setMissingItems(prev => prev.map(item => ({ ...item, completed: true })));
  };

  const handleMissingAction = (item: { id: number, text: string, action: string, completed: boolean }) => {
    if (item.completed) return;
    const topic = item.action.replace('询问', '').replace('确认', '').replace('补充', '').replace('追问', '');
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `关于【${item.text}】，请补充一下${topic}的信息。您可以直接告诉我，我会自动提取并更新画像。`
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-[100]"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[540px] bg-[#fdfdfd] shadow-2xl z-[101] flex flex-col border-l border-neutral-200"
          >
            {/* 1. 顶部：画像状态 */}
            <div className="shrink-0 bg-white border-b border-neutral-100 p-6 z-10 relative flex flex-col gap-4">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-xl text-white flex items-center justify-center shadow-sm">
                  <Database size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-neutral-900">商家画像补齐</h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">{projectName}</p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[13px] font-bold text-neutral-700">画像完整度 72%</span>
                  <div className="flex gap-3 text-[12px] font-medium">
                    <span className="text-emerald-600">已确认 18</span>
                    <span className="text-amber-600">待确认 5</span>
                    <span className="text-rose-600">缺失 {missingItems.filter(i => !i.completed).length}</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mb-4 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: "60%" }}></div>
                  <div className="bg-amber-400 h-full" style={{ width: "12%" }}></div>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> 最近更新：今天 14:20</span>
                  <span className="flex items-center gap-1"><Database size={12} /> 来源：初始化访谈、商家资料</span>
                </div>
              </div>

              {/* 缺失项 */}
              {missingItems.length > 0 && (
                <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
                  <h3 className="text-[12px] font-bold text-rose-900 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <AlertCircle size={14} className="text-rose-600" />
                    关键缺口待补齐
                  </h3>
                  <div className="space-y-2.5">
                    {missingItems.map((item, idx) => (
                      <div key={item.id} className={`flex items-center justify-between group ${item.completed ? 'opacity-50' : ''}`}>
                        <div className={`flex items-center gap-2 text-[13px] font-medium ${item.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                          <span className={`${item.completed ? 'text-neutral-400' : 'text-rose-400'} font-bold`}>{idx + 1}.</span> {item.text}
                        </div>
                        {item.completed ? (
                          <div className="text-[12px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={14} /> 已补全
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleMissingAction(item)}
                            className="text-[12px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                          >
                            {item.action} <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 中部：滚动区域 (对话) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* 聊天记录 */}
              <div className="space-y-6 pt-2">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                    <MessageSquare size={32} className="text-neutral-300 mb-3" />
                    <p className="text-[13px] text-neutral-500 max-w-[280px] leading-relaxed">
                      您可以直接描述商家的情况，我会自动整理成结构化画像并标记为待确认项。
                    </p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                            <Store size={12} />
                          </div>
                          <span className="text-[12px] font-bold text-neutral-500">画像副手</span>
                        </div>
                      )}
                      
                      <div className={`
                        max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm
                        ${msg.role === 'user' 
                          ? 'bg-neutral-900 text-white rounded-tr-sm' 
                          : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm'}
                      `}>
                        {msg.content}
                      </div>

                      {/* 待写入卡片 */}
                      {msg.pendingWrite && (
                        <div className="mt-3 w-full max-w-[90%] bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden">
                          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
                            <span className="text-[12px] font-bold text-neutral-900 flex items-center gap-1.5">
                              <Database size={14} /> 待写入画像 ({msg.pendingWrite.items.length}项)
                            </span>
                          </div>
                          <div className="p-4 space-y-3">
                            {msg.pendingWrite.items.map((item, i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-neutral-400 uppercase">{item.label}</span>
                                <div className="text-[13px] text-neutral-800 font-medium bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100 flex justify-between items-center">
                                  <span>{item.value}</span>
                                  {item.status === 'confirmed' ? (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                  ) : null}
                                </div>
                              </div>
                            ))}
                            
                            {msg.pendingWrite.items.some(i => i.status === 'pending') && (
                              <div className="pt-3 flex flex-wrap gap-2 border-t border-neutral-100 mt-2">
                                <button 
                                  onClick={() => confirmPendingWrite(msg.id)}
                                  className="flex-1 bg-neutral-900 text-white text-[12px] font-bold py-2 rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle2 size={16} /> 确认写入商家画像
                                </button>
                                <button className="px-4 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold py-2 rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5">
                                  <Edit3 size={14} /> 修改
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* 3. 底部：操盘副手对话输入 */}
            <div className="shrink-0 p-5 bg-white border-t border-neutral-100">
              <div className="relative flex items-center">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="输入信息，如：他们主要卖幼犬粮，客群是刚养狗的新手..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-4 pr-12 py-3.5 text-[14px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-500/20 resize-none min-h-[52px] max-h-[120px]"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`absolute right-2 p-2 rounded-xl transition-all ${
                    inputValue.trim() 
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm' 
                      : 'bg-transparent text-neutral-300'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-400 font-medium">
                <span className="flex items-center gap-1"><HelpCircle size={12} /> 直接描述商家情况</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="flex items-center gap-1"><Database size={12} /> 自动抽取特征</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

