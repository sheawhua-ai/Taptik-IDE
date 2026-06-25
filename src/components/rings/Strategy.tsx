import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Activity,
  Target,
  BarChart2,
  Bot,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Play,
  Hash,
  Users,
  Layers,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExecutionPreview } from "./ExecutionPreview";

export const Strategy: React.FC<{
  hasData?: boolean;
  strategyData?: { word: string; rate: string }[];
}> = ({ hasData = true, strategyData = [] }) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [flowState, setFlowState] = useState<
    "suggestion" | "confirming" | "generating" | "running"
  >("suggestion");
  const [generateProgress, setGenerateProgress] = useState(0);

  const startGenerating = () => {
    setFlowState("generating");
    setGenerateProgress(0);
    const interval = setInterval(() => {
      setGenerateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFlowState("running");
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50/40 overflow-hidden relative">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <Compass size={20} />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-neutral-900 tracking-tight">
              今日操盘建议
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-neutral-400">
                基于商家画像、知识库、目标客群、竞品与历史数据生成
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 2. 中间核心：今日操盘建议卡 */}
          {flowState === "suggestion" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-primary-100 p-8 shadow-xl shadow-primary-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Target size={200} />
              </div>

              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 text-primary-600 font-semibold mb-4 text-[14px]">
                  <Bot size={18} /> 今日建议优先操盘方向
                </div>

                <h3 className="text-[28px] font-bold text-neutral-900 mb-4 tracking-tight">
                  建议从「幼犬换粮避坑」开始
                </h3>

                <p className="text-[14px] text-neutral-600 leading-relaxed mb-6">
                  这是当前最适合该商家的自然流切入点。低粉爆款信号正在增强，且品牌卖点可以自然植入。建议直接做内容矩阵铺设，先不进行硬广投流。
                </p>

                <div className="bg-neutral-50/80 rounded-2xl p-5 mb-6 border border-neutral-100">
                  <h4 className="text-[13px] font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Layers size={14} className="text-primary-500" /> 建议打法
                  </h4>
                  <ul className="space-y-2 text-[13px] text-neutral-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />{" "}
                      创建一个 <strong>7 天搜索卡位项目</strong>，生成 12
                      篇自然流笔记。
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />{" "}
                      内容结构：
                      <strong>
                        70% 素人避坑口吻为主，30% 专业号科普口吻辅助
                      </strong>
                      。
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />{" "}
                      影响范围：将调用 A01 测评号、A02 避坑号、A05
                      专业号的本周排期。
                    </li>
                  </ul>
                </div>

                {/* 证据展开 */}
                <div className="mb-8">
                  <button
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-primary-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm"
                  >
                    {showEvidence ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                    {showEvidence ? "收起 AI 决策依据" : "展开 AI 决策依据"}
                  </button>
                  <AnimatePresence>
                    {showEvidence && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                            <div className="text-[12px] font-semibold text-neutral-800 mb-2 flex items-center gap-1.5">
                              <Activity size={14} className="text-rose-500" />{" "}
                              低粉爆款信号
                            </div>
                            <div className="text-[12px] text-neutral-500 leading-relaxed">
                              发现 3 篇赞藏比 &gt; 5% 的低粉爆款（均 &lt; 500
                              粉），核心切入点均为“换粮拉稀”。说明目前该切入点处于流量红利期。
                            </div>
                          </div>
                          <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                            <div className="text-[12px] font-semibold text-neutral-800 mb-2 flex items-center gap-1.5">
                              <Users size={14} className="text-blue-500" />{" "}
                              评论区痛点提取
                            </div>
                            <div className="text-[12px] text-neutral-500 leading-relaxed">
                              近 30
                              天竞品热门笔记下，高频出现“幼犬拉稀、软便、怎么过渡”等真实用户提问，需求强烈。
                            </div>
                          </div>
                          <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                            <div className="text-[12px] font-semibold text-neutral-800 mb-2 flex items-center gap-1.5">
                              <Hash size={14} className="text-emerald-500" />{" "}
                              账号矩阵匹配度
                            </div>
                            <div className="text-[12px] text-neutral-500 leading-relaxed">
                              当前商户资产库中，【A01 测评号】和【A02
                              避坑号】的历史表现良好，粉丝画像与该话题高度重合，适合立刻执行。
                            </div>
                          </div>
                          <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                            <div className="text-[12px] font-semibold text-neutral-800 mb-2 flex items-center gap-1.5">
                              <ShieldCheck
                                size={14}
                                className="text-indigo-500"
                              />{" "}
                              品牌知识库依据
                            </div>
                            <div className="text-[12px] text-neutral-500 leading-relaxed">
                              本次生成将自动规避品牌设定的 12
                              个医疗化违禁词，并提取“低敏、易消化”等合规核心卖点。
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setFlowState("confirming")}
                    className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-primary-600 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <Play size={16} /> 开始操盘
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("open-expert", {
                          detail: {
                            expert: "操盘副手",
                            context: `我想继续深挖一下「幼犬换粮避坑」这个方向，再给我一些变体`,
                          },
                        }),
                      )
                    }
                    className="px-6 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-medium hover:bg-neutral-50 transition-colors shadow-sm"
                  >
                    继续深挖
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("open-expert", {
                          detail: {
                            expert: "操盘副手",
                            context: `除了幼犬换粮避坑，今天还有没有其他适合测试的方向？`,
                          },
                        }),
                      )
                    }
                    className="px-6 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-medium hover:bg-neutral-50 transition-colors shadow-sm"
                  >
                    换个方向
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. 执行预览 */}
          {flowState === "confirming" && (
            <ExecutionPreview 
              onStart={startGenerating}
              onBack={() => setFlowState("suggestion")}
            />
          )}

          {/* 4. 生成中 / 生成完成 */}
          {(flowState === "generating" || flowState === "running") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-primary-200 p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[20px] font-semibold text-neutral-900 flex items-center gap-2">
                    {flowState === "generating" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                    ) : (
                      <CheckCircle2 className="text-emerald-500" />
                    )}
                    {flowState === "generating"
                      ? "AI 正在执行项目初始化..."
                      : "当前操盘中：幼犬换粮避坑 7 天搜索卡位"}
                  </h3>
                </div>
              </div>

              {flowState === "generating" ? (
                <div className="space-y-5">
                  <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${generateProgress}%` }}
                    />
                  </div>
                  <div className="text-[13px] text-neutral-500 font-mono space-y-2">
                    <div
                      className={
                        generateProgress > 0
                          ? "text-neutral-700"
                          : "text-neutral-300"
                      }
                    >
                      {generateProgress > 0 && "> "}正在分析 12
                      篇内容的阶段发布目标...
                    </div>
                    <div
                      className={
                        generateProgress > 20
                          ? "text-neutral-700"
                          : "text-neutral-300"
                      }
                    >
                      {generateProgress > 20 && "> "}
                      正在调用品牌知识库提取卖点与规避禁忌词...
                    </div>
                    <div
                      className={
                        generateProgress > 50
                          ? "text-neutral-700"
                          : "text-neutral-300"
                      }
                    >
                      {generateProgress > 50 && "> "}
                      正在生成第一批图文与视频分镜脚本...
                    </div>
                    <div
                      className={
                        generateProgress > 80
                          ? "text-neutral-700"
                          : "text-neutral-300"
                      }
                    >
                      {generateProgress > 80 && "> "}正在将草稿分配至
                      A01、A02、A05 账号排期队列...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-50 p-5 rounded-2xl">
                      <div className="text-[12px] text-neutral-500 mb-1">
                        已生成图文脚本
                      </div>
                      <div className="text-[28px] font-bold text-neutral-900">
                        8
                        <span className="text-[14px] text-neutral-400 font-normal">
                          /12
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-5 rounded-2xl">
                      <div className="text-[12px] text-amber-600 mb-1">
                        待人工确认方向
                      </div>
                      <div className="text-[28px] font-bold text-amber-700">
                        2
                      </div>
                    </div>
                    <div className="bg-blue-50 p-5 rounded-2xl">
                      <div className="text-[12px] text-blue-600 mb-1">
                        待客户审核素材
                      </div>
                      <div className="text-[28px] font-bold text-blue-700">
                        5
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-5 rounded-2xl">
                      <div className="text-[12px] text-emerald-600 mb-1">
                        建议今日发布
                      </div>
                      <div className="text-[28px] font-bold text-emerald-700">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="text-[13px] text-neutral-500 flex items-center gap-1.5 bg-neutral-50 p-3 rounded-lg">
                    <Activity size={14} className="text-primary-500" />{" "}
                    数据巡检将在首篇笔记发布后自动开启，请随时关注【深度数据看板】。
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
                    <button
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "matrix" },
                          }),
                        )
                      }
                      className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[13px] hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2"
                    >
                      进入项目台查看笔记 <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "content" },
                          }),
                        )
                      }
                      className="px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] hover:bg-neutral-50 transition-colors"
                    >
                      进入账号排期与发布
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 备选方向 */}
          {flowState === "suggestion" && (
            <div className="mt-12 pt-6 border-t border-neutral-100">
              <h4 className="text-[15px] font-semibold text-neutral-900 mb-4 px-1">
                其他备选方向
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-primary-300 transition-colors cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold text-neutral-900 text-[15px]">
                      平价猫粮红黑榜测评
                    </h5>
                    <span className="text-[11px] font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">
                      建议调用：A01 测评号
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-500 mb-5 leading-relaxed">
                    搜索量大但竞争激烈，需以极高专业度切入，建议作为长线防御动作。
                  </p>
                  <div className="text-[13px] font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    查看方案明细 <ArrowRight size={14} />
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-primary-300 transition-colors cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold text-neutral-900 text-[15px]">
                      宠物肠胃保护 Vlog
                    </h5>
                    <span className="text-[11px] font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">
                      建议调用：KOS矩阵号
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-500 mb-5 leading-relaxed">
                    高转化率视频类型，但素材回收成本较高，建议走内部员工 KOS
                    账号执行。
                  </p>
                  <div className="text-[13px] font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    查看方案明细 <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
