import re

with open("src/components/merchant/MerchantProfileDrawer.tsx", "r") as f:
    code = f.read()

# Replace the imports
new_imports = """import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Store, Target, AlertCircle, ArrowRight, Search, Maximize2, Minimize2, Edit2, Sparkles, Check
} from 'lucide-react';"""
code = re.sub(r'import React.*lucide-react\';', new_imports, code, flags=re.DOTALL)


# Add states
state_insertion = """  const [missingItems] = useState([
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
"""

code = re.sub(r'  const \[missingItems\] = useState\(\[.*?\]\);', state_insertion, code, flags=re.DOTALL)

# Add the UI for Diagnosis
ui_insertion = """                 <div className="flex flex-col gap-1.5">
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
              </div>"""

code = re.sub(r'                 <div className="flex flex-col gap-1.5">\s*<span className="text-\[13px\] font-bold text-text-tertiary">主推品优势</span>.*?</div>\s*</div>', ui_insertion, code, flags=re.DOTALL)


with open("src/components/merchant/MerchantProfileDrawer.tsx", "w") as f:
    f.write(code)
