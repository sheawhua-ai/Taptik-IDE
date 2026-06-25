import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { X, Store, Target, CheckCircle2, Bell, Plus, BookOpen, UserPlus, Send, Users, FileText, Lightbulb } from 'lucide-react';

interface MerchantProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onboardingData: any;
}

export function MerchantProfileDrawer({
  isOpen,
  onClose,
  projectName,
  onboardingData,
}: MerchantProfileDrawerProps) {
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[600px] bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200 rounded-l-3xl overflow-hidden"
          >
            {/* Header: 画像总览 */}
            <div className="p-8 shrink-0 relative border-b border-neutral-100 bg-white">
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-900 rounded-2xl shadow-sm text-white flex items-center justify-center">
                  <Store size={24} />
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight leading-tight">
                    商家画像档案
                  </h2>
                  <p className="text-[13px] text-neutral-500 mt-1">
                    {projectName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Target size={14} /> 当前阶段目标
                  </div>
                  <div className="text-[14px] font-medium text-neutral-900">
                    {onboardingData?.target || "搜索卡位 + 自然流起量"}
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                  <div className="text-[11px] text-neutral-500 mb-2 flex items-center justify-between uppercase tracking-wider font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> 画像完整度
                    </span>
                    <span className="text-neutral-900 font-bold">68%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1 mt-2.5">
                    <div
                      className="bg-neutral-900 h-1"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] pt-1">
                <div className="text-neutral-400">最近更新：今天 09:42</div>
                <div className="flex items-center gap-1.5 text-neutral-900 font-medium border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50">
                  <Bell size={14} />
                  发现 3 项建议补全
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10 bg-[#fafafa]">
              {/* 建议优先补全 */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-neutral-900"></span>
                  建议优先补全
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-[15px] font-semibold text-neutral-900 mb-1.5">
                          竞品名单
                        </h4>
                        <p className="text-[13px] text-neutral-600 leading-relaxed">
                          <span className="font-semibold text-neutral-900">
                            缺失影响：
                          </span>{" "}
                          会降低竞品动态巡航和爆文拆解质量。
                        </p>
                      </div>
                      <span className="px-2 py-1 border border-neutral-200 rounded-lg text-neutral-600 text-[11px] font-medium tracking-wide uppercase">
                        高优先
                      </span>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 mb-4 text-[13px] text-neutral-700 border border-neutral-200">
                      <strong>建议行动：</strong> 补充 3-5 个对标账号或竞品品牌
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                        <Plus size={14} /> 现在补充
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                        <BookOpen size={14} /> 从知识库提取
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-[15px] font-semibold text-neutral-900 mb-1.5">
                          账号人设定位
                        </h4>
                        <p className="text-[13px] text-neutral-600 leading-relaxed">
                          <span className="font-semibold text-neutral-900">
                            缺失影响：
                          </span>{" "}
                          会降低内容口吻匹配度。
                        </p>
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 mb-4 text-[13px] text-neutral-700 border border-neutral-200">
                      <strong>建议行动：</strong> 为 A01/A02/A05 补充账号定位
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex-1 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                        <UserPlus size={14} /> 创建补充任务
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-white border border-neutral-900 text-neutral-900 hover:bg-neutral-50 text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                        <Send size={14} /> 发到企微
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-[15px] font-semibold text-neutral-900 mb-1.5">
                          禁用表达规则
                        </h4>
                        <p className="text-[13px] text-neutral-600 leading-relaxed">
                          <span className="font-semibold text-neutral-900">
                            缺失影响：
                          </span>{" "}
                          会增加审核返工和合规风险。
                        </p>
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 mb-4 text-[13px] text-neutral-700 border border-neutral-200">
                      <strong>建议行动：</strong> 上传客户品牌规范或补充常见禁区
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex-1 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                        <BookOpen size={14} /> 从知识库提取
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-white border border-neutral-900 text-neutral-900 hover:bg-neutral-50 text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                        <Send size={14} /> 发到企微
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 现有模块总览 */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2 mb-4 pt-4 border-t border-neutral-200">
                  <span className="w-1.5 h-1.5 bg-neutral-300"></span>
                  按模块状态总览
                </h3>
                <div className="space-y-4">
                  {/* 目标客群 */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h4 className="text-[15px] font-bold text-neutral-900 mb-5 flex items-center gap-2">
                      <Users size={16} />
                      目标客群
                    </h4>

                    <div className="space-y-5">
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3 border-b border-neutral-100 pb-2">
                          已确认
                        </div>
                        <ul className="space-y-2.5">
                          <li className="text-[14px] text-neutral-800 flex items-start gap-2.5">
                            <div className="mt-1 text-neutral-400">
                              <CheckCircle2 size={14} />
                            </div>
                            新手养狗人群
                          </li>
                          <li className="text-[14px] text-neutral-800 flex items-start gap-2.5">
                            <div className="mt-1 text-neutral-400">
                              <CheckCircle2 size={14} />
                            </div>
                            幼犬换粮场景
                          </li>
                          <li className="text-[14px] text-neutral-800 flex items-start gap-2.5">
                            <div className="mt-1 text-neutral-400">
                              <CheckCircle2 size={14} />
                            </div>
                            肠胃敏感关注人群
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                          <Lightbulb size={14} /> 系统推断 (来自近期互动)
                        </div>
                        <ul className="space-y-2.5">
                          <li className="text-[14px] text-neutral-600 flex items-start gap-2.5">
                            <span className="w-1 h-1 rounded-full bg-neutral-900 mt-2 shrink-0"></span>
                            用户更关注“软便/拉稀/过渡期”
                          </li>
                          <li className="text-[14px] text-neutral-600 flex items-start gap-2.5">
                            <span className="w-1 h-1 rounded-full bg-neutral-900 mt-2 shrink-0"></span>
                            偏好避坑式内容，而非专业硬科普
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 品牌与产品 */}
                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 opacity-80 hover:opacity-100 transition-opacity">
                    <h4 className="text-[15px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                      <Target size={14} />
                      品牌与产品
                    </h4>
                    <div className="text-[14px] text-neutral-600">
                      已确认核心卖点，缺乏差异化叙事。
                    </div>
                  </div>

                  {/* 内容与风格 */}
                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 opacity-80 hover:opacity-100 transition-opacity">
                    <h4 className="text-[15px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                      <FileText size={16} />
                      内容与风格
                    </h4>
                    <div className="text-[14px] text-neutral-600">
                      系统推断风格偏向“真实评测”，待确认。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
