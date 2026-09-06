import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Store, Target, AlertCircle, ArrowRight, Search, Maximize2, Minimize2, Edit2, Sparkles, Check
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

  // Diagnosis States
  const [activeStage, setActiveStage] = useState<string>('搜到不点');
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>(['首图不吸睛', '标题无痛点']);
  const [isEditingDiagnosis, setIsEditingDiagnosis] = useState(false);

  const FUNNELS = ['搜索卡位', '种草认知', '有效咨询', '进店转化', '账号涨粉'];
  
  const FUNNELS_STAGES: Record<string, string[]> = {
    '搜索卡位': ['用户搜不到', '搜到不点', '点开不留', '看完不收藏', '收录后排名差'],
    '种草认知': ['用户刷不到', '刷到不点', '看完无感', '有印象不搜你', '搜你不咨询'],
    '有效咨询': ['曝光够但互动少', '互动高但无人问', '有人问但回复流失', '咨询无法转留资'],
    '进店转化': ['咨询多但到店少', '到店但核销差', '老客不复购', '核销后无传播'],
    '账号涨粉': ['曝光高但关注低', '涨粉但互动弱', '粉丝画像偏差', '粉丝涨但变现差']
  };

  const SYMPTOMS: Record<string, string[]> = {
    '用户搜不到': ['关键词未覆盖', '收录率低', '无下拉词卡位', '竞品挤压'],
    '搜到不点': ['首图不吸睛', '标题无痛点', '缺乏利益点', '封面同质化'],
    '点开不留': ['开头太拖沓', '画质不清晰', '人设不讨喜', '无信息增量'],
    '看完不收藏': ['缺乏干货', '没有实操步骤', '场景不匹配', '未提供情绪价值'],
    '收录后排名差': ['互动量偏低', '账号权重低', '更新不规律', '缺乏相关性'],
  };

  const currentSymptomsOptions = SYMPTOMS[activeStage] || ['数据转化偏低', '缺乏有效互动', '内容同质化严重', '用户流失率高'];
  const generatedDiagnosis = `当前运营在【${activeStage}】环节存在明显瓶颈。具体表现为：${activeSymptoms.join('、')}，导致整体转化率偏低，需要重点优化。`;


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-btn-main/40 backdrop-blur-[2px] z-[100]"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className={`absolute top-0 right-0 bottom-0 ${isFullScreen ? 'w-full' : 'w-[420px]'} bg-surface-1 shadow-2xl z-[101] flex flex-col border-l border-border-default transition-all duration-300`}
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-5 border-b border-border-default flex items-center justify-between bg-surface-1 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-btn-main text-white rounded-xl flex items-center justify-center shadow-md">
                  <Target size={20} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-text-main">商家画像与资产</h2>
                  <div className="text-[13px] text-text-tertiary font-medium flex items-center gap-1.5 mt-0.5">
                    <Store size={12} /> {projectName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="p-6 border-b border-border-default bg-page-bg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-text-main">画像完整度</span>
                <span className="text-[16px] font-bold text-text-main">92%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-btn-main w-[92%] rounded-full relative">
                  <div className="absolute inset-0 bg-surface-1/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)' }}></div>
                </div>
              </div>
              <p className="text-[13px] text-text-tertiary leading-relaxed mb-4">
                商家画像由知识库自动抽取生成。当前仍有部分信息未对齐，补充后将进一步提升策略生成的准确性。
              </p>
              
              <div className="space-y-3">
                 <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-bold text-text-tertiary">品牌心智</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-surface-1 border border-border-default rounded-md text-[13px] text-text-secondary font-medium">专业严谨</span>
                      <span className="px-2 py-1 bg-surface-1 border border-border-default rounded-md text-[13px] text-text-secondary font-medium">配方透明</span>
                      <span className="px-2 py-1 bg-surface-1 border border-border-default rounded-md text-[13px] text-text-secondary font-medium">新手友好</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-bold text-text-tertiary">核心受众</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-surface-1 border border-border-default rounded-md text-[13px] text-text-secondary font-medium">精致养宠女性</span>
                      <span className="px-2 py-1 bg-surface-1 border border-border-default rounded-md text-[13px] text-text-secondary font-medium">成分党</span>
                      <span className="px-2 py-1 bg-surface-1 border border-border-default rounded-md text-[13px] text-text-secondary font-medium">高客单价</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-bold text-text-tertiary">主推品优势</span>
                    <p className="text-[13px] text-text-main font-medium bg-surface-1 p-2.5 rounded-lg border border-border-default">
                      80%鲜肉含量，0谷物添加，特别添加益生菌呵护幼犬玻璃胃。
                    </p>
                 </div>
                 
                 <div className="flex flex-col gap-1.5 pt-3 border-t border-border-default mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-text-main flex items-center gap-1.5"><Sparkles size={14} className="text-brand-logo"/>核心问题诊断 (全局)</span>
                      {!isEditingDiagnosis && (
                        <button onClick={() => setIsEditingDiagnosis(true)} className="text-[12px] text-brand-logo hover:underline flex items-center gap-1">
                          <Edit2 size={12}/> 重新诊断
                        </button>
                      )}
                    </div>
                    
                    {!isEditingDiagnosis ? (
                      <div className="bg-brand-logo/5 border border-brand-logo/30 rounded-lg p-3">
                        <p className="text-[13px] text-text-main leading-relaxed">
                          {generatedDiagnosis}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-surface-1 border border-border-default rounded-lg p-4 space-y-4 shadow-sm relative">
                        <div>
                          <div className="text-[12px] font-medium text-text-secondary mb-2">1. 当前最核心的漏斗卡点是？</div>
                          <div className="flex flex-wrap gap-2">
                            {FUNNELS_STAGES['搜索卡位'].map(opt => (
                              <button
                                key={opt}
                                onClick={() => {
                                  setActiveStage(opt);
                                  setActiveSymptoms([]);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[12px] transition-colors border ${activeStage === opt ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-surface-subtle border-border-default text-text-secondary hover:bg-surface-2'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {activeStage && (
                          <div className="pt-3 border-t border-border-default">
                            <div className="text-[12px] font-medium text-text-secondary mb-2">2. 典型的表现现象有哪些？(多选)</div>
                            <div className="flex flex-wrap gap-2">
                              {currentSymptomsOptions.map(sym => {
                                const isSelected = activeSymptoms.includes(sym);
                                return (
                                  <button
                                    key={sym}
                                    onClick={() => {
                                      setActiveSymptoms(prev => 
                                        prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
                                      );
                                    }}
                                    className={`px-2 py-1 rounded-md text-[12px] transition-colors border ${isSelected ? 'bg-brand-logo/10 border-brand-logo text-brand-logo font-medium' : 'bg-surface-subtle border-border-default text-text-secondary hover:bg-surface-2'}`}
                                  >
                                    {sym}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t border-border-default flex justify-end">
                          <button 
                            onClick={() => setIsEditingDiagnosis(false)}
                            className="bg-neutral-900 text-white text-[12px] px-4 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-neutral-800"
                          >
                            <Check size={14}/> 保存诊断至知识库
                          </button>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Missing Gaps List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                  <AlertCircle size={16} className="text-brand-logo" />
                  关键资产待补齐
                </h3>
                <span className="text-[13px] font-medium bg-hover-bg text-text-tertiary px-2 py-0.5 rounded-md">
                  4 项建议
                </span>
              </div>
              
              <div className="space-y-4">
                {missingItems.map((item, idx) => (
                  <div key={item.id} className="bg-surface-1 border border-border-default rounded-xl p-4 shadow-sm hover:border-neutral-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-hover-bg flex items-center justify-center text-[13px] font-bold text-text-tertiary shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-bold text-text-main mb-1">{item.text}</h4>
                        <p className="text-[13px] text-text-tertiary mb-3">{item.desc}</p>
                        
                        <div className="bg-page-bg p-2.5 rounded-lg border border-border-default mb-3">
                          <div className="text-[13px] font-bold text-text-tertiary mb-1 flex items-center gap-1">
                            <Search size={12} /> 知识库状态索引
                          </div>
                          <div className="text-[13px] text-text-secondary font-medium">
                            {item.sourceDoc}
                          </div>
                        </div>
                        
                        <button 
                          className="w-full text-[13px] font-bold text-text-secondary bg-hover-bg hover:bg-selected-bg px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('switch-to-knowledge'));
                            onClose();
                          }}
                        >
                          前往「知识与记忆」链接本地资料 <ArrowRight size={14} />
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
