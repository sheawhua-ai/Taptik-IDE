import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  Settings2,
  User,
  Users,
  ChevronDown,
  Check,
  Sparkles,
  Target,
  Layers,
  FileText,
} from "lucide-react";

interface ExecutionPreviewProps {
  onStart: () => void;
  onBack: () => void;
}

export function ExecutionPreview({ onStart, onBack }: ExecutionPreviewProps) {
  // Toggle states for adjustments
  const [showGroupAdjust, setShowGroupAdjust] = useState(false);

  // States for confirmations
  const [confirmDirection, setConfirmDirection] = useState("幼犬换粮避坑");
  const [confirmGroup, setConfirmGroup] = useState("素人 8 / 专业 4");
  const [confirmDist, setConfirmDist] =
    useState("自有号定向承接 + 外部随机领取池");
  const [confirmSync, setConfirmSync] =
    useState("进入待审核队列，并同步飞书项目群");

  const getSubAgentContent = (type: string) => {
    switch (type) {
      case "direction":
        return {
          title: "主方向",
          current: "幼犬换粮避坑",
          reason: "低粉爆款信号增强，评论需求聚集，适合当前商家自然流切入",
          alternatives: [
            { name: "软便过渡期清单", desc: "更适合自然流" },
            { name: "换粮失败案例复盘", desc: "话题更具冲突感" },
            { name: "幼犬冻干平替测评", desc: "更适合测评号，不适合官方号" },
          ],
        };
      case "group":
        return {
          title: "内容分组",
          current: "素人 8 / 专业 4",
          reason: "先拿自然流测试，再用专业号补充信任背书",
          alternatives: [
            {
              name: "素人 10 / 专业 2",
              desc: "优先追求自然流起量，减少专业号占比",
            },
            {
              name: "素人 6 / 专业 6",
              desc: "品牌信任要求更高，想更快建立官方背书",
            },
            {
              name: "仅素人组",
              desc: "当前阶段只做低成本自然流测试，不强调官方信任",
            },
          ],
        };
      case "dist":
        return {
          title: "分发方式",
          current: "自有号定向承接 + 外部随机领取池",
          reason: "自有号可精确控制内容匹配，外部号适合后续随机扩散",
          alternatives: [
            {
              name: "仅用自有号",
              desc: "所有内容都将绑定自有号。更可控，但覆盖范围变小",
            },
            {
              name: "先自有号，次轮再开放外部池",
              desc: "分阶段放量，风险更低",
            },
            { name: "外部池只允许领取素人口吻内容", desc: "精细化管控口吻" },
          ],
        };
      case "sync":
        return {
          title: "协同方式",
          current: "进入待审核队列，并同步飞书项目群",
          reason: "确保内容先审后发，团队成员可以在飞书同步跟进",
          alternatives: [
            { name: "只生成不入队", desc: "供内部提前审阅" },
            { name: "进入审核但不同步飞书", desc: "减少打扰" },
            { name: "只同步内部，不同步客户群", desc: "内部确认优先" },
          ],
        };
      default:
        return null;
    }
  };

  const handleCollaborate = (adjustType: string) => {
    const content = getSubAgentContent(adjustType);
    if (!content) return;

    let contextString = `【当前方案】
${content.current}
理由：${content.reason}

【可替代方案】
`;
    content.alternatives.forEach((alt, idx) => {
      contextString += `${idx + 1}. ${alt.name}（适合：${alt.desc}）
`;
    });

    window.dispatchEvent(
      new CustomEvent("open-expert", {
        detail: {
          expert: "操盘副手",
          context: contextString,
        },
      }),
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative items-start w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#fcfcfc] rounded-3xl border border-neutral-200 shadow-xl overflow-hidden transition-all duration-300 w-full"
      >
        {/* 1. 执行摘要卡 */}
        <div className="bg-white p-8 border-b border-neutral-100 relative">
          <div className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-medium border border-emerald-100">
            <Sparkles size={14} /> AI 已完成方案规划
          </div>
          <h3 className="text-[24px] font-bold text-neutral-900 tracking-tight mb-2">
            执行预览
          </h3>
          <p className="text-[14px] text-neutral-500 mb-6">
            这是我准备为该商家推进的操盘方案，请确认关键判断。
          </p>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <p className="text-[15px] text-neutral-800 leading-relaxed font-medium">
              我将启动一个{" "}
              <strong className="text-neutral-900">7 天搜索卡位</strong> 项目：
              <br />
              围绕「<strong className="text-neutral-900">幼犬换粮避坑</strong>
              」生成 <strong className="text-neutral-900">12</strong> 篇内容，
              <br />
              其中 8 篇优先分配给自有账号，4 篇进入外部素人领取池。
            </p>
            <div className="mt-3 pt-3 border-t border-neutral-200/60 text-[13px] text-neutral-500">
              当前自然流机会更强，因此优先采用素人避坑口吻切入，专业号内容用于建立信任背书。
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* 2. AI 方案拆解 */}
          <div>
            <h4 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Layers className="text-indigo-500" size={18} /> AI 方案拆解
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 卡 1：项目计划 */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                <div className="text-[12px] font-semibold text-neutral-400 tracking-wider uppercase mb-3">
                  项目计划
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[12px] text-neutral-500 mb-1">
                      项目名称
                    </div>
                    <div className="text-[14px] font-medium text-neutral-900">
                      幼犬换粮避坑 7 天搜索卡位
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-500 mb-1">
                      目标
                    </div>
                    <div className="text-[14px] font-medium text-neutral-900">
                      搜索覆盖 + 自然流起量
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-500 mb-1">
                      本轮内容规模
                    </div>
                    <div className="text-[18px] font-bold text-neutral-900">
                      12{" "}
                      <span className="text-[13px] font-normal text-neutral-500">
                        篇
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
                  这是基于当前商家阶段目标、低粉爆款信号和账号承接能力计算出的建议规模。
                </div>
              </div>

              {/* 卡 2：内容分组 */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm md:col-span-2 relative group">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[12px] font-semibold text-neutral-400 tracking-wider uppercase">
                    内容分组
                  </div>
                  <button
                    onClick={() => handleCollaborate("group")}
                    className="flex items-center gap-1 text-[12px] text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                  >
                    <Settings2 size={14} /> 协同调整
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                    <div className="text-[13px] font-bold text-neutral-900 mb-1">
                      素人避坑组{" "}
                      <span className="ml-1 text-indigo-600">8 篇</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 leading-relaxed">
                      用于自然流测试，强调避坑经验、真实场景、评论钩子
                    </div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                    <div className="text-[13px] font-bold text-neutral-900 mb-1">
                      专业科普组{" "}
                      <span className="ml-1 text-indigo-600">4 篇</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 leading-relaxed">
                      用于专业背书，承接信任建立和品牌表达
                    </div>
                  </div>
                </div>

                <div className="text-[12px] text-neutral-500 leading-relaxed bg-[#f8f9fa] p-3 rounded-xl">
                  <strong className="text-neutral-700">为什么这样分：</strong>
                  当前自然流机会强，素人口吻更容易起量；专业号内容用于增强可信度，避免纯素人内容缺少品牌背书。
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 自有账号定向承接 */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                <div className="text-[12px] font-semibold text-neutral-400 tracking-wider uppercase mb-4">
                  自有账号定向承接
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-bold text-neutral-900">
                          A01 测评号
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        建议承接：测评 / 对比 / 使用体验
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-bold text-indigo-600 mb-1">
                        预计 3 篇
                      </div>
                      <button className="text-[11px] text-neutral-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                        调整分配
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-bold text-neutral-900">
                          A02 避坑号 (KOS)
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        建议承接：避坑 / 经验 / 过渡期内容
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-bold text-indigo-600 mb-1">
                        预计 3 篇
                      </div>
                      <button className="text-[11px] text-neutral-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                        调整分配
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-bold text-neutral-900">
                          A05 专业科普号
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        建议承接：科普 / 成分 / 信任背书
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-bold text-indigo-600 mb-1">
                        预计 2 篇
                      </div>
                      <button className="text-[11px] text-neutral-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                        调整分配
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 外部随机领取池 */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="text-[12px] font-semibold text-neutral-400 tracking-wider uppercase mb-4">
                  外部随机领取池
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 p-6 text-center">
                  <Users size={32} className="text-neutral-300 mb-3" />
                  <div className="text-[15px] font-bold text-neutral-800 mb-1">
                    剩余 4 篇内容
                  </div>
                  <div className="text-[13px] text-neutral-500 leading-relaxed max-w-sm">
                    将进入外部素人任务大厅。
                    <br />
                    外部素人可随机领取并使用自带真实口吻进行发布，形成长尾自然流。
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 请确认的关键判断 */}
          <div>
            <h4 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={18} />{" "}
              请确认以下关键判断
            </h4>
            <div className="space-y-3">
              {/* 判断 1 */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-[14px] font-bold text-neutral-900 mb-1">
                    主方向：{confirmDirection}
                  </div>
                  <div className="text-[12px] text-neutral-500">
                    <span className="text-neutral-700 font-medium">理由：</span>
                    低粉爆款信号增强，评论需求聚集，适合当前商家自然流切入
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">
                    接受
                  </button>
                  <button
                    onClick={() => handleCollaborate("direction")}
                    className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={14} className="text-indigo-500" /> 协同调整
                  </button>
                </div>
              </div>

              {/* 判断 2 */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-[14px] font-bold text-neutral-900 mb-1">
                    内容分组：{confirmGroup}
                  </div>
                  <div className="text-[12px] text-neutral-500">
                    <span className="text-neutral-700 font-medium">理由：</span>
                    先拿自然流测试，再用专业号补充信任背书
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">
                    接受
                  </button>
                  <button
                    onClick={() => handleCollaborate("group")}
                    className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={14} className="text-indigo-500" /> 协同调整
                  </button>
                </div>
              </div>

              {/* 判断 3 */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-[14px] font-bold text-neutral-900 mb-1">
                    分发方式：{confirmDist}
                  </div>
                  <div className="text-[12px] text-neutral-500">
                    <span className="text-neutral-700 font-medium">理由：</span>
                    自有号可精确控制内容匹配，外部号适合后续随机扩散
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">
                    接受
                  </button>
                  <button
                    onClick={() => handleCollaborate("dist")}
                    className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={14} className="text-indigo-500" /> 协同调整
                  </button>
                </div>
              </div>

              {/* 判断 4 */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-[14px] font-bold text-neutral-900 mb-1">
                    协同方式：{confirmSync}
                  </div>
                  <div className="text-[12px] text-neutral-500">
                    <span className="text-neutral-700 font-medium">理由：</span>
                    确保内容先审后发，团队成员可以在飞书同步跟进
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">
                    接受
                  </button>
                  <button
                    onClick={() => handleCollaborate("sync")}
                    className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={14} className="text-indigo-500" /> 协同调整
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 执行边界与启动 */}
          <div className="border-t border-neutral-200 pt-8 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-[13px]">
              <div>
                <div className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check size={12} />
                  </div>
                  确认后会执行
                </div>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span> 创建项目
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span> 生成 12
                    篇内容草稿
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    按内容组分配到自有号和外部领取池
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    写入当前商家项目
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    进入待审核队列
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    可同步飞书项目群
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                    <XIcon size={12} />
                  </div>
                  确认后不会执行
                </div>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    不会直接发布
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    不会跳过人工审核
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    不会为外部账号预绑定具体内容
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">-</span>{" "}
                    不会自动通知客户确认，除非你下一步要求
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-neutral-900/20 flex items-center gap-2 transition-all active:scale-95"
              >
                确认方案并开始生成 <ArrowRight size={16} />
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[14px] font-medium transition-colors"
              >
                返回调整建议
              </button>
              <button className="px-6 py-3.5 text-neutral-500 hover:text-neutral-900 text-[14px] font-medium transition-colors ml-auto flex items-center gap-2">
                <FileText size={16} /> 导出为项目摘要
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const XIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
