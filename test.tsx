import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wand2 } from 'lucide-react';

export const Test = () => {
  const [showAIModify, setShowAIModify] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  
  return (
    <div>
        <AnimatePresence>
          {showAIModify && selectedText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-indigo-100 p-4 z-50 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Wand2 size={16} />
                  <span className="text-[13px] font-bold">AI 辅助修改</span>
                </div>
                <button onClick={() => setShowAIModify(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={16} />
                </button>
              </div>
              <div className="text-[12px] text-neutral-500 bg-neutral-50 p-2 rounded-lg line-clamp-2">
                "{selectedText}"
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="输入修改指令，例如：'语气更激动一些'、'加入商家设定的蓝海词'..."
                  className="flex-1 text-[13px] border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-indigo-700 transition-colors shrink-0">
                  开始修改
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-4 text-[12px] text-neutral-600 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
                  <span className="font-bold text-indigo-700">AI 生成依赖条件：</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-indigo-600" /> 遵循账号人设
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-indigo-600" /> 融入蓝海词与话题
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-indigo-600" /> 结合商家画像
                  </label>
                </div>
                <div className="flex gap-2">
                  <button className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded-md transition-colors" onClick={() => setAiPrompt('语气更激动一些')}>语气更激动一些</button>
                  <button className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded-md transition-colors" onClick={() => setAiPrompt('融入商家设定的成分科普')}>融入成分科普</button>
                  <button className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded-md transition-colors" onClick={() => setAiPrompt('修改为适合小红书的爆款标题格式')}>改写为爆款标题</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};