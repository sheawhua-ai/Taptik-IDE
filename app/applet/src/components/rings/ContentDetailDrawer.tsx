import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Wand2, ArrowRight, User, CheckCircle2, MessageSquare, Plus } from 'lucide-react';

export const ContentDetailDrawer = ({ onClose }: { onClose: () => void }) => {
  const [selectedText, setSelectedText] = useState('');
  const [showAIModify, setShowAIModify] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      setShowAIModify(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-[800px] bg-neutral-50 h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-[16px]">发布包详情：美妆搜索种草战役</h3>
              <p className="text-[12px] text-neutral-500 mt-0.5">已规划 12 篇笔记 · 包含素人笔记与科普笔记</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Note 1 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[11px] font-bold">素人种草</span>
                  <span className="text-[12px] text-neutral-500 font-medium">账号：@一只小法斗</span>
                </div>
                <button className="text-indigo-600 text-[12px] font-bold hover:text-indigo-700">编辑</button>
              </div>
              <h4 className="font-bold text-[14px] text-neutral-900 mb-2">换粮踩坑无数次，终于遇到本命狗粮！</h4>
              <div className="text-[13px] text-neutral-700 leading-relaxed space-y-2 selection:bg-indigo-100 selection:text-indigo-900">
                <p>家人们谁懂啊！我家崽子从小就是玻璃胃，稍微吃不对就软便，换粮简直像是在拆盲盒😭。</p>
                <p>试过好几种进口粮，要么太油黑下巴，要么就是根本不吃。前几天在宠物展上被种草了这个牌子的幼犬粮，看成分表第一位就是鲜肉，而且没有谷物，抱着试试看的心态买了一小袋。</p>
                <p>没想到崽子超爱吃！而且这两天便便成型了，颜色也很健康。真的是感动哭！如果你家也有同款玻璃胃小狗，一定要试试这款！</p>
                <p className="text-indigo-600">#幼犬换粮 #新手养狗 #狗粮推荐</p>
              </div>
            </div>

            {/* Note 2 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-bold">专业科普</span>
                  <span className="text-[12px] text-neutral-500 font-medium">账号：@宠物医生老王</span>
                </div>
                <button className="text-indigo-600 text-[12px] font-bold hover:text-indigo-700">编辑</button>
              </div>
              <h4 className="font-bold text-[14px] text-neutral-900 mb-2">幼犬软便怎么办？这3个换粮误区你中招了吗？</h4>
              <div className="text-[13px] text-neutral-700 leading-relaxed space-y-2 selection:bg-indigo-100 selection:text-indigo-900">
                <p>作为一名从医5年的宠物医生，接诊过太多因为换粮不当导致肠胃炎的幼犬。今天就来科普一下正确的换粮姿势👇</p>
                <p>❌ 误区一：一次性全部换新粮。幼犬肠胃脆弱，需要7天过渡期（俗称7日换粮法）。</p>
                <p>❌ 误区二：只看包装不看成分。一定要学会看配料表，首选鲜肉配方，避开肉粉和诱食剂。</p>
                <p>选粮建议：推荐肠胃敏感的幼犬选择含有益生菌、无谷低敏配方的狗粮。最近测评的一款国产粮，鲜肉含量高达70%，且添加了枯草芽孢杆菌，对幼犬肠胃非常友好。</p>
                <p className="text-indigo-600">#宠物科普 #狗狗软便 #健康养宠</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Modification Popover */}
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

      </motion.div>
    </div>
  );
};
