import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Sparkles,
  ChevronDown,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { MerchantProfileDrawer } from "./merchant/MerchantProfileDrawer";

interface MerchantMemoryHeaderProps {
  hasData: boolean;
  onboardingData: any;
  activeProjectId: string;
  projectName: string;
  setWorkflowTab: (tab: any) => void;
}

export function MerchantMemoryHeader({
  hasData,
  onboardingData,
  activeProjectId,
  projectName,
  setWorkflowTab,
}: MerchantMemoryHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEscortLoading, setIsEscortLoading] = useState(false);
  const [escortDataLoaded, setEscortDataLoaded] = useState(false);

  const runEscortTask = () => {
    setIsEscortLoading(true);
    setTimeout(() => {
      setIsEscortLoading(false);
      setEscortDataLoaded(true);
    }, 2000); // Simulate agent execution
  };
  const [isEscortExpanded, setIsEscortExpanded] = useState(false);

  useEffect(() => {
    const handleOpenDrawer = () => setIsDrawerOpen(true);
    window.addEventListener('open-merchant-profile-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-merchant-profile-drawer', handleOpenDrawer);
  }, []);

  if (!hasData) return null;

  return (
    <>
      <div className="bg-[#fbfbfb] border-b border-neutral-100 flex flex-col shrink-0 relative z-30 shadow-sm">
        <div className="px-8 py-3 flex items-center justify-between">
          <button
            className="flex items-center gap-2 shrink-0 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors -ml-3"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            <span className="text-[14px] font-semibold text-neutral-900 tracking-tight">
              商家画像
            </span>
            <span className="text-[12px] text-neutral-500 font-normal ml-1">
              ({projectName})
            </span>
          </button>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsEscortExpanded(true)}
              className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 transition-colors border border-primary-100 px-4 py-2 rounded-full text-[13px] text-primary-700 font-medium"
            >
              <Sparkles size={16} />
              <span>今日巡航</span>
              {escortDataLoaded ? (
                <>
                  <span className="w-1 h-1 bg-primary-300 rounded-full mx-1"></span>
                  <span className="text-primary-600 font-normal">6 项动态 / 9 个待处理 / 3 个卡点</span>
                </>
              ) : (
                <>
                  <span className="w-1 h-1 bg-primary-300 rounded-full mx-1"></span>
                  <span className="text-primary-600 font-normal">待执行巡航</span>
                </>
              )}
              <ChevronDown size={14} className="ml-1 opacity-60" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isEscortExpanded && (
            <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setIsEscortExpanded(false)}>
              <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-[420px] bg-white h-full shadow-2xl flex flex-col relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary-600" />
                    <h3 className="font-bold text-neutral-900 text-[16px]">今日巡航</h3>
                  </div>
                  <button onClick={() => setIsEscortExpanded(false)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                    <X size={18} className="text-neutral-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {!escortDataLoaded ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                       <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-2">
                         <Sparkles size={32} />
                       </div>
                       <div>
                         <h4 className="text-[16px] font-bold text-neutral-900 mb-2">今日巡航需要 IDE 在线执行</h4>
                         <p className="text-[13px] text-neutral-500 max-w-[280px]">点击下方按钮，触发 Agent 巡查当前商家的所有运营数据、物料状态和待办事项。</p>
                       </div>
                       <button
                         onClick={runEscortTask}
                         disabled={isEscortLoading}
                         className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                       >
                         {isEscortLoading ? (
                           <>
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             Agent 正在巡航...
                           </>
                         ) : (
                           <>
                             <Sparkles size={18} />
                             开始今日巡航
                           </>
                         )}
                       </button>
                    </div>
                  ) : (
                    <>
                      {/* Summary */}
                      <div>
                        <h4 className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-3">当前商家运营流摘要</h4>
                        <p className="text-[14px] text-neutral-800 leading-relaxed font-medium">
                          正在推进 <span className="text-primary-600 font-bold">2</span> 个核心战役，累积 <span className="text-neutral-900 font-bold">6</span> 项动态更新，当前存在 <span className="text-primary-600 font-bold">3</span> 个关键卡点影响发布节奏。
                        </p>
                      </div>
                      {/* Bottlenecks */}
                      <div>
                        <h4 className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertCircle size={16} /> 最关键卡点
                        </h4>
                        <div className="space-y-3">
                          <div 
                            className="bg-primary-50 border border-primary-100 p-3 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-primary-100 transition-colors"
                            onClick={() => { setWorkflowTab('matrix'); setIsEscortExpanded(false); }}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</div>
                            <div>
                              <div className="text-[13px] font-bold text-primary-900 mb-0.5">幼犬换粮战役</div>
                              <div className="text-[12px] text-primary-700 leading-relaxed">缺 8 个素材，影响 12 篇排期</div>
                            </div>
                          </div>
                          <div 
                            className="bg-primary-50 border border-primary-100 p-3 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-primary-100 transition-colors"
                            onClick={() => { setWorkflowTab('matrix'); setIsEscortExpanded(false); }}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</div>
                            <div>
                              <div className="text-[13px] font-bold text-primary-900 mb-0.5">成犬肠胃项目</div>
                              <div className="text-[12px] text-primary-700 leading-relaxed">5 条达人素材待回传</div>
                            </div>
                          </div>
                          <div 
                            className="bg-primary-50 border border-primary-100 p-3 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-primary-100 transition-colors"
                            onClick={() => { setWorkflowTab('interaction'); setIsEscortExpanded(false); }}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</div>
                            <div>
                              <div className="text-[13px] font-bold text-primary-900 mb-0.5">日常粉丝运维</div>
                              <div className="text-[12px] text-primary-700 leading-relaxed">有 18 条高意向私信未分流</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 智能 Suggestion Chain */}
                      <div>
                        <h4 className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Sparkles size={16} /> 智能 建议链路
                        </h4>
                        <div className="relative pl-3 space-y-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-100">
                          {[
                            { step: '补素材', mod: 'matrix', highlight: true },
                            { step: '审内容', mod: 'matrix' },
                            { step: '推发布池', mod: 'content' },
                            { step: '分流私信', mod: 'interaction' },
                            { step: '写入复盘', mod: 'metrics' },
                          ].map((node, i) => (
                            <div 
                              key={i} 
                              onClick={() => { setWorkflowTab(node.mod as any); setIsEscortExpanded(false); }}
                              className={`relative flex items-center gap-4 cursor-pointer group ${node.highlight ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 transition-colors ${node.highlight ? 'bg-primary-500' : 'bg-neutral-300 group-hover:bg-primary-400'}`} />
                              <div className="flex-1 bg-white border border-neutral-200 p-3 rounded-xl shadow-sm group-hover:border-primary-300 group-hover:shadow transition-all flex items-center justify-between">
                                <span className="text-[13px] font-bold text-neutral-900">{node.step}</span>
                                <ArrowRight size={14} className="text-neutral-400 group-hover:text-primary-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <MerchantProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projectName={projectName}
        onboardingData={onboardingData}
      />
    </>
  );
}
