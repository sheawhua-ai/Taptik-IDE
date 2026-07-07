import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, Send, Sparkles, Wand2, Compass, Layers, FileText } from 'lucide-react';

export const StrategyCopilotDrawer: React.FC<{ onClose: () => void, isNewProject?: boolean }> = ({ onClose, isNewProject = false }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: isNewProject ? '新建项目流，请明确以下核心要素：\n\n1. 这次战役的【主攻目标】是什么？（搜索卡位 / 爆文起量 / 线索转化 / 账号养成）\n2. 【内容风格偏好】是什么？\n3. 【预算 / 账号资源】情况如何？' : '请提供起盘思路。例如：“需要主攻自然流起量，并且加大客户现场扫码发布的比例。”' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [slotsFilled, setSlotsFilled] = useState(0); // 0 to 3

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      
      const newSlots = Math.min(slotsFilled + 1, 3);
      setSlotsFilled(newSlots);

      if (newSlots < 3) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: '好的，已记录要求。对于本次打法，您希望在【内容口吻】上，素人和专业的比例大约是多少？（例如：偏素人种草，或者偏专业医生背书）' 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: '核心要素已收集完毕。系统已生成相应的【账号组合】与【内容策略】。\n\n点击右下角的“生成方案”按钮，以输出具体的执行计划和排期安排。' 
        }]);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[800px] bg-neutral-50 h-full shadow-2xl flex flex-col relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-16 border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-indigo-600" />
            <h3 className="font-bold text-[18px] text-neutral-900">
              {isNewProject ? '新建项目流 · 操盘副手' : '新建项目流 · 操盘副手'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white border-r border-neutral-200 relative">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-[14px] leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-neutral-900 text-white rounded-br-none' 
                      : 'bg-indigo-50/80 border border-indigo-100/50 text-indigo-900 rounded-bl-none'
                  }`}>
                    {m.role === 'ai' && (
                       <div className="flex items-center gap-1.5 mb-2 text-indigo-600 font-bold text-[12px]">
                         <Sparkles size={14} /> 操盘副手
                       </div>
                    )}
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-indigo-50/80 border border-indigo-100/50 text-indigo-900 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-neutral-100">
              <div className="relative flex items-end bg-neutral-50 border border-neutral-200 rounded-2xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all shadow-inner">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="告诉副手您的想法..."
                  className="w-full bg-transparent p-4 text-[14px] text-neutral-900 resize-none outline-none max-h-[120px] min-h-[60px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isThinking}
                  className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-neutral-300 transition-colors shadow-sm"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Slots / Context Area */}
          <div className="w-[280px] bg-neutral-50 flex flex-col shrink-0">
            <div className="p-5 border-b border-neutral-200 bg-neutral-100/50">
              <h4 className="text-[14px] font-bold text-neutral-800 flex items-center gap-2">
                <Layers size={16} /> 项目流必备要素
              </h4>
              <p className="text-[12px] text-neutral-500 mt-1">
                副手将通过沟通为您补齐以下信息，以生成最合适的打法策略。
              </p>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              <div className={`p-4 rounded-xl border transition-all ${slotsFilled >= 1 ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-neutral-200 text-neutral-400'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Compass size={14} className={slotsFilled >= 1 ? 'text-emerald-600' : ''} />
                    <span className="text-[13px] font-bold">主攻目标</span>
                  </div>
                  {slotsFilled >= 1 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">已明确</span>}
                </div>
                <div className={`text-[12px] mt-2 font-medium ${slotsFilled >= 1 ? 'text-emerald-800' : ''}`}>
                  {slotsFilled >= 1 ? '偏向自然流起量，搜索卡位辅助' : '待确认...'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${slotsFilled >= 2 ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-neutral-200 text-neutral-400'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} className={slotsFilled >= 2 ? 'text-emerald-600' : ''} />
                    <span className="text-[13px] font-bold">内容风格</span>
                  </div>
                  {slotsFilled >= 2 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">已明确</span>}
                </div>
                <div className={`text-[12px] mt-2 font-medium ${slotsFilled >= 2 ? 'text-emerald-800' : ''}`}>
                  {slotsFilled >= 2 ? '侧重素人真实体验，低营销感' : '待确认...'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${slotsFilled >= 3 ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-neutral-200 text-neutral-400'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className={slotsFilled >= 3 ? 'text-emerald-600' : ''} />
                    <span className="text-[13px] font-bold">账号配比</span>
                  </div>
                  {slotsFilled >= 3 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">已明确</span>}
                </div>
                <div className={`text-[12px] mt-2 font-medium ${slotsFilled >= 3 ? 'text-emerald-800' : ''}`}>
                  {slotsFilled >= 3 ? '加大客户快发比例，减少KOS' : '待确认...'}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-200 bg-white">
              <button
                onClick={() => {
                  onClose();
                  // Simulate navigation to Strategy tab or refreshing it
                  if (isNewProject) {
                     window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'strategy' } }));
                  }
                }}
                disabled={slotsFilled < 3}
                className="w-full py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:bg-neutral-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <Wand2 size={16} /> 生成方案
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
