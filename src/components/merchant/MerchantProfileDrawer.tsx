import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Store, Target, AlertCircle, ArrowRight, Search, Maximize2, Minimize2
} from 'lucide-react';

interface MerchantProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onboardingData?: any;
}

export function MerchantProfileDrawer({
  isOpen,
  onClose,
  projectName,
}: MerchantProfileDrawerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [missingItems] = useState([
    { id: 1, text: "私域承接流程不完整", desc: "缺少用户添加企微后的标准SOP", sourceDoc: "知识库未收录 / 需补充《私域SOP操作手册》", completed: false },
    { id: 2, text: "核心卖点支撑证据不足", desc: "主推款产品缺少专利证明或权威背书资料", sourceDoc: "需补充至知识库文件夹《产品资质与背书》", completed: false },
    { id: 3, text: "内容合规禁区未更新", desc: "近期小红书平台规则变化，需补充最新广告法禁词", sourceDoc: "需上传最新《小红书禁词清单》", completed: false },
    { id: 4, text: "历史爆款案例缺失", desc: "缺少可供 AI 拆解的同类目历史高转化素材", sourceDoc: "建议在知识库添加《历史高转化笔记汇总》", completed: false }
  ]);

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
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className={`absolute top-0 right-0 bottom-0 ${isFullScreen ? 'w-full' : 'w-[420px]'} bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200 transition-all duration-300`}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center shadow-md">
                  <Target size={20} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900">商家画像与缺口</h2>
                  <div className="text-[12px] text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                    <Store size={12} /> {projectName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-neutral-900">画像完整度</span>
                <span className="text-[16px] font-bold text-neutral-900">92%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-neutral-900 w-[92%] rounded-full relative">
                  <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)' }}></div>
                </div>
              </div>
              <p className="text-[12px] text-neutral-500 leading-relaxed mb-4">
                商家画像由知识库自动抽取生成。当前仍有部分信息未对齐，补充后将进一步提升策略生成的准确性。
              </p>
              
              <div className="space-y-3">
                 <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-neutral-400">品牌心智</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[12px] text-neutral-700 font-medium">专业严谨</span>
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[12px] text-neutral-700 font-medium">配方透明</span>
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[12px] text-neutral-700 font-medium">新手友好</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-neutral-400">核心受众</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[12px] text-neutral-700 font-medium">精致养宠女性</span>
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[12px] text-neutral-700 font-medium">成分党</span>
                      <span className="px-2 py-1 bg-white border border-neutral-200 rounded-md text-[12px] text-neutral-700 font-medium">高客单价</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-neutral-400">主推品优势</span>
                    <p className="text-[12px] text-neutral-800 font-medium bg-white p-2.5 rounded-lg border border-neutral-200">
                      80%鲜肉含量，0谷物添加，特别添加益生菌呵护幼犬玻璃胃。
                    </p>
                 </div>
              </div>
            </div>

            {/* Missing Gaps List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                  <AlertCircle size={16} className="text-primary-600" />
                  关键缺口待补齐
                </h3>
                <span className="text-[11px] font-medium bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md">
                  4 项建议
                </span>
              </div>
              
              <div className="space-y-4">
                {missingItems.map((item, idx) => (
                  <div key={item.id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:border-neutral-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[12px] font-bold text-neutral-500 shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-bold text-neutral-900 mb-1">{item.text}</h4>
                        <p className="text-[12px] text-neutral-500 mb-3">{item.desc}</p>
                        
                        <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 mb-3">
                          <div className="text-[11px] font-bold text-neutral-400 mb-1 flex items-center gap-1">
                            <Search size={12} /> 知识库状态索引
                          </div>
                          <div className="text-[12px] text-neutral-700 font-medium">
                            {item.sourceDoc}
                          </div>
                        </div>
                        
                        <button 
                          className="w-full text-[12px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('switch-to-knowledge'));
                            onClose();
                          }}
                        >
                          前往「商家知识库」上传 <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
