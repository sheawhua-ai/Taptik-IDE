import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, FlaskConical, ShieldAlert, Target, Users, Calendar, Eye, Activity } from "lucide-react";
import { Project } from "../../../data/projectStore";

interface StrategyProtocolDrawerProps {
  project: Project;
  onClose: () => void;
}

export function StrategyProtocolDrawer({ project, onClose }: StrategyProtocolDrawerProps) {
  const protocol = project.strategyProtocol;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-[560px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-extrabold text-neutral-900">
                本轮运营方案完整详情
              </h2>
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-md">
                项目方案
              </span>
            </div>
            <div className="text-[12px] text-neutral-500 mt-0.5 truncate max-w-[420px]">
              {project.name}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. 核心目标与用户 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <Target size={16} className="text-primary-600" />
              核心问题与目标用户
            </h3>
            
            <div className="space-y-3 text-[13px]">
              <div>
                <div className="text-[12px] text-neutral-500 font-medium mb-1">解决的核心问题</div>
                <div className="font-bold text-neutral-900 bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed">
                  {protocol?.coreProblem || project.goal || "验证真实换粮过程与店长专业解答能否增加有效问题评论与搜索咨询，建立幼犬换粮搜索卡位。"}
                </div>
              </div>

              <div>
                <div className="text-[12px] text-neutral-500 font-medium mb-1">目标受众与客群</div>
                <div className="text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed">
                  {protocol?.targetAudience || "3-6个月幼犬初次换粮且对软便、挑食焦虑的精致宠主与新手养宠人群"}
                </div>
              </div>
            </div>
          </div>

          {/* 2. 内容策略与发布主体组合 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <Users size={16} className="text-primary-600" />
              内容方法与主体组合
            </h3>
            
            <div className="space-y-3 text-[13px]">
              <div>
                <div className="text-[12px] text-neutral-500 font-medium mb-1">内容方法概要</div>
                <div className="text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed">
                  {protocol?.solutionSummary || "KOC真实体验测评 + 店长号专业科普指导 + 品牌号承接与评论区私信引导"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="text-[11.5px] text-neutral-500 font-medium">计划总篇数</div>
                  <div className="text-[15px] font-extrabold text-neutral-900 mt-0.5">
                    {project.notes?.length || 20} 篇
                  </div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="text-[11.5px] text-neutral-500 font-medium">默认观察周期</div>
                  <div className="text-[15px] font-extrabold text-neutral-900 mt-0.5">
                    发布后 14 天
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[12px] text-neutral-500 font-medium mb-1.5">发布主体结构</div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="font-medium text-neutral-800">品牌官方号</span>
                    <span className="font-bold text-neutral-900">2 篇 · 信任承接与官方答疑</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="font-medium text-neutral-800">店长号 / KOS</span>
                    <span className="font-bold text-neutral-900">5 篇 · 门店实景科普与避坑指导</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="font-medium text-neutral-800">消费者 KOC (笔记包)</span>
                    <span className="font-bold text-neutral-900">10-13 篇 · 真实测评体验与场景种草</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 假设验证与成功/停止条件 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <FlaskConical size={16} className="text-primary-600" />
              验证假设与继续/停止条件
            </h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <div className="text-[12px] text-neutral-500 font-medium mb-1">待验证假设</div>
                <div className="text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed">
                  {protocol?.verifyHypothesis || "在幼犬换粮搜索词下，通过真实痛点KOC测评与店长科普能够显著提升有效咨询与收藏率。"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
                  <div className="text-[11.5px] font-bold text-emerald-800 mb-1">继续推进条件</div>
                  <div className="text-[12px] text-emerald-900 font-medium leading-relaxed">
                    {protocol?.continueCondition || "有效评论数 > 20% 且搜索卡位进入前10"}
                  </div>
                </div>

                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/70">
                  <div className="text-[11.5px] font-bold text-rose-800 mb-1">停止或调整条件</div>
                  <div className="text-[12px] text-rose-900 font-medium leading-relaxed">
                    {protocol?.stopCondition || "连续5篇互动率 < 1.5% 或出现合规争议"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 执行边界与红线规则 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-600" />
              执行边界与合规红线
            </h3>

            <div className="space-y-2.5 text-[12.5px]">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="font-bold text-neutral-900 mb-1">禁止表达</div>
                <div className="text-neutral-600 leading-relaxed">
                  禁止出现“100%治愈腹泻”、“处方药级疗效”、“全网最好”等绝对化、医疗化违规用词；禁止直接贬低竞品。
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="font-bold text-neutral-900 mb-1">执行控制要求</div>
                <div className="text-neutral-600 leading-relaxed">
                  AI根据问卷动态生成个性化笔记；自有账号经H5定向下发，发布后由系统自动识别笔记ID进入观察，无需手动粘链。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors"
          >
            完成查看
          </button>
        </div>
      </motion.div>
    </div>
  );
}
