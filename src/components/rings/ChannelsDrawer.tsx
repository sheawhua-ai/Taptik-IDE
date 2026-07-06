import React from 'react';
import { motion } from 'motion/react';
import { X, Users, Box, Target, CheckCircle2 } from 'lucide-react';

export const ChannelsDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-neutral-700" />
            <h3 className="font-bold text-[16px] text-neutral-900">账号组合拆分详情</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-[14px] font-bold text-neutral-900">当前拆分策略</span>
              <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">总数：45 篇</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                  <span className="text-[13px] font-medium text-neutral-700">官方号 (A01/A05)</span>
                </div>
                <div className="text-[13px] font-bold text-neutral-900">3 篇</div>
              </div>
              <p className="text-[12px] text-neutral-500 ml-4">执行方向：品牌宣发、深度科普。需要运营精细打磨。</p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-[13px] font-medium text-neutral-700">员工 KOS</span>
                </div>
                <div className="text-[13px] font-bold text-neutral-900">4 篇</div>
              </div>
              <p className="text-[12px] text-neutral-500 ml-4">执行方向：探店、日常。需系统下发实拍任务。</p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-[13px] font-medium text-neutral-700">泛素人分发</span>
                </div>
                <div className="text-[13px] font-bold text-neutral-900">8 篇</div>
              </div>
              <p className="text-[12px] text-neutral-500 ml-4">执行方向：达人真实反馈。目前需预设泛素人人设，需3天体验期。</p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-[13px] font-medium text-neutral-700">真实客户快发</span>
                </div>
                <div className="text-[13px] font-bold text-neutral-900">30 篇</div>
              </div>
              <p className="text-[12px] text-neutral-500 ml-4">执行方向：现场扫码发布。目前已有 25 个名额完成扫码，5 个待确认。</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
             <div className="flex items-start gap-2">
                <Target size={16} className="text-indigo-600 mt-0.5" />
                <div>
                   <h4 className="text-[13px] font-bold text-indigo-900 mb-1">执行建议</h4>
                   <p className="text-[12px] text-indigo-800 leading-relaxed">
                     由于真实客户占比极高（30篇），建议优先跟进门店台卡码的扫码进度。泛素人 8 篇需要优先预设人设，以防项目延期。
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-white">
          <button onClick={onClose} className="w-full py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-medium hover:bg-neutral-800 transition-colors">
            确认并关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
};
