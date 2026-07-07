import {
  CheckCircle2,
  Check,
  ArrowRight,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Users,
  QrCode,
  Sparkles,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ExecutionResult() {
  const [activeDrawer, setActiveDrawer] = useState<
    "review" | "material" | "external" | "internal" | null
  >(null);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("set-custom-greeting", {
        detail: {
          greeting:
            "当前最影响推进的是素材补齐。我可以帮你自动匹配素材、生成拍摄任务，或调整内容包分流方式。\n\n您可以直接说：\n“为什么这样分流”\n“先处理可发布的”\n“减少外部领取”\n“把更多内容转成素材库装填”\n“生成商家拍摄清单”",
          expert: "操盘结果助手",
        },
      }),
    );
  }, []);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[20px] font-semibold text-neutral-900">
            内容任务已编排
          </h3>
          <p className="text-[14px] text-neutral-500 mt-1">
            系统已完成项目拆解，下一步请处理内容完整度、素材缺口与任务分发。
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <CheckCircle2 size={16} /> 已保存到商家知识库
        </div>
      </div>

      {/* 顶部主判断 */}
      <div className="bg-neutral-50 border border-neutral-100 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check size={12} />
            </div>
            <span className="font-bold text-neutral-900 text-[15px]">
              本轮已拆出 12 个内容任务包，当前最大阻塞是素材补齐
            </span>
          </div>
          <div className="text-[13px] text-neutral-500 ml-7">
            3 个可直接审核，4 个需素材库装填，3 个需外部真实拍摄，2
            个需内部员工补拍。
          </div>
        </div>
      </div>

      {/* 4 个处理队列卡 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4">
        {/* 卡片 1 */}
        <div
          className="border border-emerald-200 rounded-2xl p-5 hover:border-emerald-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer"
          onClick={() => setActiveDrawer("review")}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">
                1
              </span>
              内容确认
            </h4>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
              待处理 3
            </span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">前置条件：</span>
                文案生成完毕
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">当前状态：</span>
                3个已进人工快速检查队列
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-emerald-700">
                  处理后流向：
                </span>
                通过后进入素材补齐或直接派发
              </div>
            </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-emerald-50 text-emerald-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-emerald-200">
            开始确认
          </button>
        </div>

        {/* 卡片 2 */}
        <div
          className="border border-neutral-200 rounded-2xl p-5 hover:border-amber-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer"
          onClick={() => setActiveDrawer("material")}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-amber-400 transition-colors"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">
                2
              </span>
              素材补齐
            </h4>
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
              待处理 4
            </span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">前置条件：</span>
                确认后的图文/视频脚本
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">当前状态：</span>
                缺封面、缺喂食片段
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-amber-700">处理后流向：</span>
                装填完毕进入待发布池
              </div>
            </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-amber-50 text-amber-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-amber-200">
            自动装配素材
          </button>
        </div>

        {/* 卡片 3 */}
        <div
          className="border border-neutral-200 rounded-2xl p-5 hover:border-indigo-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer"
          onClick={() => setActiveDrawer("internal")}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-indigo-400 transition-colors"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">
                3
              </span>
              任务派发
            </h4>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
              待派发 2
            </span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">前置条件：</span>
                无匹配素材，转实拍需求
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">当前状态：</span>
                已锁定责任人及工期
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-indigo-700">处理后流向：</span>
                提交后进入素材验收池
              </div>
            </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-neutral-900 text-neutral-900 group-hover:text-white rounded-lg text-[13px] font-medium transition-colors border border-transparent">
            一键派发任务
          </button>
        </div>

        {/* 卡片 4 */}
        <div
          className="border border-neutral-200 rounded-2xl p-5 hover:border-indigo-400 transition-colors bg-white shadow-sm flex flex-col relative overflow-hidden group cursor-pointer"
          onClick={() => setActiveDrawer("external")}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-indigo-400 transition-colors"></div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-[10px] flex items-center justify-center font-bold text-neutral-500">
                4
              </span>
              外部入口
            </h4>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
              待生成 3
            </span>
          </div>

          <div className="space-y-2 mb-4 mt-2 flex-1">
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">前置条件：</span>
                确认面向外部账号分发的内容
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-neutral-700">当前状态：</span>
                包含纯分发、体验等多种模式
              </div>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0"></div>
              <div>
                <span className="font-medium text-indigo-700">
                  处理后流向：
                </span>
                外部领取后按规则回传或发布
              </div>
            </div>
          </div>

          <button className="w-full py-2 bg-neutral-50 group-hover:bg-indigo-50 text-indigo-700 rounded-lg text-[13px] font-medium transition-colors border border-transparent group-hover:border-indigo-200">
            生成接单入口
          </button>
        </div>
      </div>

      {/* 主行动区 */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-t border-neutral-100">
        <button
          onClick={() => setActiveDrawer("review")}
          className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2 mb-2"
        >
          开始处理可处理队列 <ArrowRight size={16} />
        </button>
        <div className="text-[12px] text-neutral-500 mb-5 flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100">
          <span className="text-neutral-400">将按依赖顺序处理：</span>
          <span className="text-neutral-700 font-medium">内容确认</span>
          <ArrowRight size={12} className="text-neutral-400" />
          <span className="text-neutral-700 font-medium">素材补齐</span>
          <ArrowRight size={12} className="text-neutral-400" />
          <span className="text-neutral-700 font-medium">任务派发</span>
          <ArrowRight size={12} className="text-neutral-400" />
          <span className="text-neutral-700 font-medium">外部入口</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("nav-to-tab", { detail: { tab: "content" } }),
              )
            }
            className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            查看全部内容包
          </button>
          <button
            onClick={() => setActiveDrawer("internal")}
            className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            管理协同任务
          </button>
        </div>
      </div>

      {/* 次级提示 */}
      <div className="text-center text-[12px] text-neutral-400">
        首篇内容发布后，数据巡航将自动跟踪互动率、账号健康和低粉爆款信号。
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/20 z-50 flex justify-end"
            onClick={() => setActiveDrawer(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-1/2 bg-white h-full shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {activeDrawer === "review" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-emerald-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        内容包快速审核
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        当前：3 个待审核 |{" "}
                        <span className="text-emerald-600">
                          已沉淀到「宠物食品自然流笔记」能力中
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <div className="flex-shrink-0 px-3 py-1.5 bg-neutral-900 text-white text-[12px] rounded-lg">
                        #1 幼犬挑食
                      </div>
                      <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] rounded-lg">
                        #2 肠胃敏感
                      </div>
                      <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] rounded-lg">
                        #3 换粮误区
                      </div>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm relative group">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded">
                          图文
                        </span>
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded">
                          素人口吻
                        </span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] rounded">
                          缺实拍图
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] rounded">
                          建议外部体验领取
                        </span>
                      </div>
                      <h4 className="font-bold text-[14px] text-neutral-900 mb-2">
                        #1 幼犬挑食其实是你的锅
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded">
                        <div>
                          <span className="font-medium">内容形态：</span>
                          单图文笔记
                        </div>
                        <div>
                          <span className="font-medium">素材来源：</span>
                          需外部真实体验拍摄
                        </div>
                        <div>
                          <span className="font-medium">执行路径：</span>
                          外部领取
                        </div>
                        <div>
                          <span className="font-medium">当前状态：</span>
                          待内容审核确认
                        </div>
                      </div>

                      <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-[12px] text-neutral-700 leading-relaxed mb-4">
                        "很多新手铲屎官遇到狗子不吃饭，第一反应就是饿它一顿！其实幼犬挑食很可能是换粮方式不对..."
                      </div>

                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 mb-4 relative">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} className="text-indigo-500" />
                          <span className="text-[12px] font-bold text-indigo-900">
                            智能修正中
                          </span>
                        </div>
                        <div className="bg-white p-2 border border-indigo-100 rounded text-[11px] text-neutral-700 mb-2 line-through opacity-70">
                          原版：很多新手铲屎官遇到狗子不吃饭...
                        </div>
                        <div className="bg-white p-2 border border-indigo-200 rounded text-[11px] text-indigo-900 font-medium mb-3 shadow-sm">
                          修改后：别再饿狗子了！幼犬挑食 90% 是你换粮的锅...
                        </div>

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-indigo-100">
                          <input
                            type="text"
                            placeholder="不满意？输入修改要求..."
                            className="flex-1 text-[11px] bg-white border border-indigo-100 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300"
                          />
                          <button className="px-3 py-1.5 bg-neutral-900 text-white text-[11px] rounded hover:bg-neutral-800 shadow-sm transition-colors">
                            提交修改
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                        <button className="flex-1 min-w-[70px] py-2 bg-emerald-500 text-white text-[11px] font-medium rounded-lg hover:bg-emerald-600">
                          采用
                        </button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg hover:bg-neutral-50">
                          继续改
                        </button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg hover:bg-neutral-50">
                          口吻不自然
                        </button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-lg hover:bg-neutral-50">
                          保留原版
                        </button>
                        <button className="flex-1 min-w-[70px] py-2 bg-white border border-red-200 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-50">
                          批注退回
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "content" },
                          }),
                        );
                      }}
                      className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      进入账号与发布模块做深度处理 <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}

              {activeDrawer === "material" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-amber-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        内容需求素材匹配
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        当前内容包：图文｜缺封面图、喂食片段
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50 flex flex-col">
                    {/* Item 1 */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-[14px] text-neutral-900 mb-1">
                        幼犬软便必看指南
                      </h4>
                      <div className="flex gap-2 mb-3">
                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          缺封面图
                        </span>
                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          缺场景图
                        </span>
                        <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          缺对比图
                        </span>
                        <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          缺视频片段
                        </span>
                      </div>

                      <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-700">
                            <ImageIcon size={14} className="text-primary-500" />{" "}
                            系统推荐素材
                          </div>
                          <span className="text-[10px] text-neutral-400">
                            来源：历史回传库
                          </span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          <div className="w-24 shrink-0 flex flex-col gap-1">
                            <div className="w-24 h-24 bg-neutral-200 rounded object-cover flex items-center justify-center text-[10px] text-neutral-400 relative">
                              封面_01.jpg
                              <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] px-1 rounded shadow">
                                85%匹配
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[8px] px-1 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded">
                                适合封面
                              </span>
                              <span className="text-[8px] px-1 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded">
                                重复度低
                              </span>
                            </div>
                          </div>

                          <div className="w-24 shrink-0 flex flex-col gap-1">
                            <div className="w-24 h-24 bg-neutral-200 rounded object-cover flex items-center justify-center text-[10px] text-neutral-400 relative">
                              场景_03.mp4
                              <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded shadow">
                                70%匹配
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[8px] px-1 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 rounded">
                                适合正文
                              </span>
                              <span className="text-[8px] px-1 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded">
                                真人感弱
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">
                          采用匹配，下一篇
                        </button>
                        <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          换一组
                        </button>
                      </div>
                      <button className="w-full mt-2 py-1.5 text-[12px] text-neutral-500 hover:text-neutral-800">
                        标记缺素材转拍摄任务
                      </button>
                    </div>

                    <div className="mt-auto text-center text-[11px] text-amber-600 bg-amber-50 py-2 rounded-lg border border-amber-100">
                      本项目素材库覆盖度 70%，仍缺幼犬真实喂食场景
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white flex justify-center">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "matrix" },
                          }),
                        );
                      }}
                      className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 underline underline-offset-2"
                    >
                      进入项目与内容模块做深度处理 <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              )}

              {activeDrawer === "external" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-indigo-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        外部领取与分发
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        3 个任务适合外部账号分发
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <QrCode size={14} />
                          </div>
                          <h4 className="font-bold text-[14px] text-neutral-900">
                            扫码即发布包
                          </h4>
                        </div>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          未生成
                        </span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">适用对象</span>
                          <span className="text-neutral-800">
                            门店客户、KOC
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">当前数量</span>
                          <span className="text-neutral-800 font-medium">
                            10 份
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">领取限制</span>
                          <span className="text-neutral-800">每人限领1次</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">回传要求</span>
                          <span className="text-neutral-800">
                            发布后回传链接免审
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">
                          生成入口
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看规则
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看回传
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <ImageIcon size={14} />
                          </div>
                          <h4 className="font-bold text-[14px] text-neutral-900">
                            真实体验领取
                          </h4>
                        </div>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          已有2人领取
                        </span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">适用对象</span>
                          <span className="text-neutral-800">样品体验用户</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">当前数量</span>
                          <span className="text-neutral-800 font-medium">
                            5 份
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">领取限制</span>
                          <span className="text-neutral-800">截至今日24点</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">回传要求</span>
                          <span className="text-neutral-800">
                            需传素材，需审核
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">
                          生成入口
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看规则
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看回传
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <LinkIcon size={14} />
                          </div>
                          <h4 className="font-bold text-[14px] text-neutral-900">
                            单篇发布链接
                          </h4>
                        </div>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          已生成
                        </span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">适用对象</span>
                          <span className="text-neutral-800">内部合作达人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">当前数量</span>
                          <span className="text-neutral-800 font-medium">
                            1 份
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">领取限制</span>
                          <span className="text-neutral-800">特定账号</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">回传要求</span>
                          <span className="text-neutral-800">直发免审</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">
                          复制指定账号发布链接
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看规则
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white flex justify-center">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "interaction" },
                          }),
                        );
                      }}
                      className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 underline underline-offset-2"
                    >
                      进入协同任务模块做深度处理 <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              )}

              {activeDrawer === "internal" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-indigo-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        内部任务派发
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        2 个协同任务待内部员工处理
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveDrawer(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[14px] text-neutral-900">
                          幼犬到家实拍补充
                        </h4>
                        <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          高优
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        未发送
                      </div>

                      <div className="space-y-1.5 mb-4 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">通知渠道</span>
                          <span className="text-neutral-700">
                            企微 / 飞书{" "}
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded ml-1">
                              身份已绑定
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-2.5 rounded text-[11px] text-neutral-600 mb-3 border border-neutral-100">
                        <strong>任务说明：</strong> 需要 3
                        段狗狗吃粮的真实短视频，背景要明亮，尽量体现狗子开心。
                      </div>
                      <div className="text-[10px] text-neutral-500 space-y-1 mb-4">
                        <div className="flex items-start gap-1">
                          <div className="mt-0.5">•</div>
                          <div>
                            <span className="text-neutral-700">
                              处理后流向：
                            </span>
                            提交后进入素材验收池
                          </div>
                        </div>
                        <div className="flex items-start gap-1">
                          <div className="mt-0.5">•</div>
                          <div>
                            <span className="text-neutral-700">不合格时：</span>
                            重拍 / 调整拍摄要求 / 素材库替代
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">
                          发送通知，下一条
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          改派
                        </button>
                        <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">
                          查看提交规则
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white flex justify-center">
                    <button
                      onClick={() => {
                        setActiveDrawer(null);
                        window.dispatchEvent(
                          new CustomEvent("nav-to-tab", {
                            detail: { tab: "interaction" },
                          }),
                        );
                      }}
                      className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 underline underline-offset-2"
                    >
                      进入协同任务模块做深度处理 <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
