import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Bot, CheckCircle, ChevronDown, Check, Smartphone, Info, ArrowRight } from "lucide-react";

export const CustomerConfigDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planAmount: number;
}> = ({ isOpen, onClose, onConfirm, planAmount }) => {
  const [activeTab, setActiveTab] = useState<'first' | 'repurchase' | 'average' | 'unqualified'>('first');
  const [aiInput, setAiInput] = useState('');
  const [aiDiff, setAiDiff] = useState('');
  
  const handleAiCommand = (cmd: string) => {
    setAiInput(cmd);
    setTimeout(() => {
      setAiInput('');
      setAiDiff('删除1个无关身份问题；增加真实使用校验；复购客户进入长期体验分支。');
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 bg-neutral-100 z-[200] flex flex-col"
        >
          {/* Header */}
          <div className="bg-white border-b border-neutral-200 h-14 shrink-0 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[16px] font-bold text-neutral-900">客户参与配置</h1>
              <div className="w-[1px] h-4 bg-neutral-300"></div>
              <span className="text-[14px] text-neutral-600">真实客户发布{planAmount}篇</span>
              <div className="w-[1px] h-4 bg-neutral-300"></div>
              <span className="text-[12px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">待确认</span>
            </div>
            <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left side: Mobile preview */}
            <div className="w-[400px] border-r border-neutral-200 bg-neutral-50 flex flex-col">
              <div className="p-4 border-b border-neutral-200 bg-white">
                <div className="text-[13px] font-bold text-neutral-700 mb-2">回答分支切换</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'first', label: '首次体验' },
                    { id: 'repurchase', label: '复购客户' },
                    { id: 'average', label: '体验一般' },
                    { id: 'unqualified', label: '不符合条件' }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-3 py-1.5 text-[12px] rounded-full font-medium transition-colors ${activeTab === t.id ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar">
                {/* Phone mockup */}
                <div className="w-[320px] h-[650px] bg-white rounded-[40px] shadow-2xl border-[8px] border-neutral-800 overflow-hidden relative flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-6 bg-neutral-800 rounded-b-3xl mx-16 z-10"></div>
                  
                  <div className="bg-primary-600 text-white p-6 pb-8 text-center shrink-0">
                    <h2 className="text-[18px] font-bold mb-1">幼犬换粮体验官</h2>
                    <p className="text-[12px] opacity-80">回答问题 · 自动生成笔记 · 发布领奖</p>
                  </div>
                  
                  <div className="flex-1 bg-neutral-50 p-4 -mt-4 rounded-t-2xl overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                        <div className="text-[13px] font-bold text-neutral-900 mb-2">1. 狗狗当前的年龄是？</div>
                        <div className="space-y-2">
                          <button className="w-full text-left px-4 py-2 border border-primary-500 bg-primary-50 text-primary-700 rounded-lg text-[13px] font-medium flex justify-between items-center">
                            3-6个月
                            <CheckCircle size={16} />
                          </button>
                          <button className="w-full text-left px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-[13px]">6个月以上</button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                        <div className="text-[13px] font-bold text-neutral-900 mb-2">2. 换粮过程中遇到了什么问题？</div>
                        <textarea className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-[13px]" rows={3} placeholder="例如：便便变软，或者挑食不吃..."></textarea>
                      </div>
                      
                      <button className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold">
                        生成我的专属笔记
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: AI Config */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* AI Generated Config Blocks */}
                  <div>
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <Bot size={18} className="text-primary-600" /> 动态问题
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['狗狗年龄与品种', '换粮前的核心痛点', '使用本品后的排便情况', '真实的复购意愿'].map((q, i) => (
                        <div 
                          key={i} 
                          className="p-4 border border-neutral-200 rounded-xl hover:border-primary-400 cursor-pointer transition-colors"
                          onClick={() => setAiInput(`告诉操盘副手，关于"${q}"这个问题需要怎么调整……`)}
                        >
                          <div className="text-[14px] font-bold text-neutral-800 mb-1">{i+1}. {q}</div>
                          <div className="text-[12px] text-neutral-500">点击调整此问题</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-4">领取规则</h3>
                    <div className="flex items-center gap-2">
                      {['每人1次', '同产品排他', '活动有效7天'].map((r, i) => (
                        <span key={i} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-md text-[13px] font-medium">{r}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-4">奖励与完成条件</h3>
                    <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 text-[13px] leading-relaxed">
                      完成问答、图片通过并成功发布后获得奖励。奖励不要求好评。
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[16px] font-bold text-neutral-900">笔记包生成规则</h3>
                      <button className="text-[13px] text-primary-600 font-medium flex items-center gap-1">查看生成逻辑 <ChevronDown size={14} /></button>
                    </div>
                    <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                      <div className="flex items-center justify-between text-[13px] font-bold text-neutral-700">
                        <span>回答形成发布画像</span>
                        <ArrowRight size={14} className="text-neutral-400" />
                        <span>匹配真实内容角度</span>
                        <ArrowRight size={14} className="text-neutral-400" />
                        <span>生成1篇正文</span>
                        <ArrowRight size={14} className="text-neutral-400" />
                        <span>生成拍摄要求</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Chat Box */}
              <div className="shrink-0 border-t border-neutral-200 bg-white p-6 pb-24">
                <div className="max-w-2xl mx-auto">
                  {aiDiff && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-[13px]">
                      <div className="flex gap-2 text-blue-800 mb-3">
                        <Bot size={16} className="mt-0.5 shrink-0" />
                        <p>{aiDiff}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setAiDiff('')} className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-bold text-[12px]">应用这版</button>
                        <button onClick={() => setAiDiff('')} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-md font-bold text-[12px]">保留原版</button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {['减少问题', '加强真实使用校验', '调整领取规则', '修改奖励说明'].map(cmd => (
                      <button 
                        key={cmd}
                        onClick={() => handleAiCommand(cmd)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-[12px] transition-colors"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="告诉操盘副手需要怎么改，例如：问题控制在4个，只面向已使用过的复购客户..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
                    />
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Bar */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-neutral-200 flex items-center justify-between px-8 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="text-[13px] text-neutral-500 flex items-center gap-2">
              <Info size={16} /> 确认配置后将生成{planAmount}个待领取名额和1个消费者H5入口
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[14px] font-bold hover:bg-neutral-50 transition-colors">
                保存项目草稿
              </button>
              <button 
                onClick={onConfirm}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                确认配置并创建项目
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
