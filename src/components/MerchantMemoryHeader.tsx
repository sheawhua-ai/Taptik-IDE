import React, { useState } from "react";
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
  const [isEscortExpanded, setIsEscortExpanded] = useState(false);

  if (!hasData) return null;

  return (
    <>
      <div className="bg-[#fbfbfb] border-b border-neutral-100 flex flex-col shrink-0 relative z-30 shadow-sm">
        <div className="px-8 py-3 flex items-center justify-between">
          <button
            className="flex items-center gap-2 shrink-0 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors -ml-3"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            <span className="text-[14px] font-semibold text-neutral-900 tracking-tight">
              商家画像
            </span>
            <span className="text-[12px] text-neutral-500 font-normal ml-1">
              ({projectName})
            </span>
          </button>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsEscortExpanded(!isEscortExpanded)}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100 px-3 py-1.5 rounded-full text-[12px] text-indigo-600 font-medium"
            >
              <Sparkles size={14} />
              今日巡航：发现 6 项动态
              <ChevronDown
                size={14}
                className={`ml-1 transition-transform ${isEscortExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isEscortExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border-t border-neutral-100 absolute top-full left-0 right-0 shadow-lg z-40"
            >
              <div className="px-8 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
                  {/* 1. 市场机会 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-neutral-900 mb-0.5">
                        1. 市场机会
                      </h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        发现 2
                        个可执行方向，其中「幼犬换粮避坑」最适合今天启动。
                      </p>
                    </div>
                  </div>

                  {/* 2. 竞品动态 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Target size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-neutral-900 mb-0.5">
                        2. 竞品动态
                      </h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        品牌 X 新增 1 篇换粮避坑笔记，收藏增长较快。
                      </p>
                    </div>
                  </div>

                  {/* 3. 账号状态 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-neutral-900 mb-0.5">
                        3. 账号状态
                      </h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        A01、A02 可正常承接，A03 互动下滑。
                      </p>
                    </div>
                  </div>

                  {/* 4. 内容进度 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-neutral-900 mb-0.5">
                        4. 内容进度
                      </h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        当前 5 篇待审核，3 篇可在今日发布。
                      </p>
                    </div>
                  </div>

                  {/* 5. 数据异常 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-neutral-900 mb-0.5">
                        5. 数据异常
                      </h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        昨日 1 篇内容收藏率显著高于均值。
                      </p>
                    </div>
                  </div>

                  {/* 6. 协同状态 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-neutral-900 mb-0.5">
                        6. 协同状态
                      </h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        私信新增 1 条客户反馈。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      setWorkflowTab("strategy");
                      setIsEscortExpanded(false);
                    }}
                    className="px-5 py-2 rounded-[12px] text-[13px] font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    生成操盘建议
                  </button>
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("nav-to-strategy-start"),
                      );
                      setIsEscortExpanded(false);
                    }}
                    className="px-5 py-2 rounded-[12px] text-[13px] font-medium bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
                  >
                    查看主动护航事件
                  </button>
                </div>
              </div>
            </motion.div>
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
