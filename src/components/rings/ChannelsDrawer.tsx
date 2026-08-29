import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Users, CheckCircle2, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

export const ChannelsDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        className={`${isFullScreen ? 'w-full' : 'w-[600px]'} transition-all duration-300 bg-hover-bg h-full shadow-2xl flex flex-col relative z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-16 border-b border-border-default flex items-center justify-between px-6 shrink-0 bg-surface-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-text-secondary" />
            <h3 className="font-bold text-[16px] text-text-main">账号通道与条件确认</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors">
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={onClose} className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-brand-light border border-primary-100 rounded-xl p-4 flex gap-3">
             <div className="mt-0.5"><Sparkles size={18} className="text-brand-logo" /></div>
             <div>
               <h4 className="text-[14px] font-bold text-primary-900 mb-1">条件已就绪</h4>
               <p className="text-[13px] text-primary-800 leading-relaxed">
                 所有账号和泛素人人设已在策划阶段确认完毕，可直接进入内容生成。真实客户部分将生成扫码入口。
               </p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-surface-1 p-4 rounded-xl border border-border-default flex flex-col gap-1 shadow-sm">
              <span className="text-[13px] font-medium text-text-tertiary">可直接生成正文</span>
              <span className="text-[20px] font-bold text-text-main">15 <span className="text-[13px] font-normal text-text-main/80">篇</span></span>
            </div>
            <div className="bg-surface-1 p-4 rounded-xl border border-border-default flex flex-col gap-1 shadow-sm">
              <span className="text-[13px] font-medium text-text-tertiary">待生成现场快发码</span>
              <span className="text-[20px] font-bold text-brand-logo">30 <span className="text-[13px] font-normal text-brand-logo/80">个</span></span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-text-tertiary mb-2 px-1">固定人设组 (直接生成正文)</h4>
            
            {/* 官方号 */}
            <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-btn-main" />
                  <span className="text-[14px] font-bold text-text-main">专业号 · 3 篇</span>
                </div>
                <span className="text-[13px] font-bold text-text-main bg-hover-bg border border-border-default px-2 py-0.5 rounded">可生成</span>
              </div>
              <div className="p-4 grid grid-cols-[60px_1fr] gap-y-2 text-[13px]">
                <div className="text-text-tertiary font-medium">人设</div>
                <div className="text-text-main font-medium">品牌科普号 / 宠物医生号</div>
                <div className="text-text-tertiary font-medium">口吻</div>
                <div className="text-text-main">可信、克制、解释型</div>
              </div>
            </div>

            {/* 员工 KOS */}
            <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-btn-main" />
                  <span className="text-[14px] font-bold text-text-main">员工号 · 4 篇</span>
                </div>
                <span className="text-[13px] font-bold text-text-main bg-hover-bg border border-border-default px-2 py-0.5 rounded">可生成</span>
              </div>
              <div className="p-4 grid grid-cols-[60px_1fr] gap-y-2 text-[13px]">
                <div className="text-text-tertiary font-medium">人设</div>
                <div className="text-text-main font-medium">门店店长 / 接待顾问</div>
                <div className="text-text-tertiary font-medium">口吻</div>
                <div className="text-text-main">接待客户、经验建议、半专业</div>
              </div>
            </div>

            {/* 泛素人分发 */}
            <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-btn-main" />
                  <span className="text-[14px] font-bold text-text-main">KOC矩阵 · 8 篇</span>
                </div>
                <span className="text-[13px] font-bold text-text-main bg-hover-bg border border-border-default px-2 py-0.5 rounded">智能已分配人设，可生成</span>
              </div>
              <div className="p-4 grid grid-cols-[60px_1fr] gap-y-2 text-[13px]">
                <div className="text-text-tertiary font-medium">人设群</div>
                <div className="text-text-main font-medium">宝妈 (3) / 大学生 (2) / 养宠新手 (3)</div>
                <div className="text-text-tertiary font-medium">口吻</div>
                <div className="text-text-main">轻推荐、低营销感</div>
              </div>
            </div>

            <h4 className="text-[13px] font-bold text-text-tertiary mb-2 px-1 mt-6">客户生成条件 (临时人设)</h4>

            {/* 真实客户快发 */}
            <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-btn-main" />
                  <span className="text-[14px] font-bold text-text-main">客户号 · 30 篇</span>
                </div>
                <span className="text-[13px] font-bold text-primary-700 bg-brand-light border border-primary-100 px-2 py-0.5 rounded">可生成快发入口</span>
              </div>
              <div className="p-4 grid grid-cols-[70px_1fr] gap-y-3 text-[13px]">
                <div className="text-text-tertiary font-medium">生成方式</div>
                <div className="text-text-main font-medium">扫码后即时生成</div>
                <div className="text-text-tertiary font-medium">采集字段</div>
                <div className="text-text-main">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-hover-bg text-text-secondary px-2 py-0.5 rounded text-[13px]">身份标签</span>
                    <span className="bg-hover-bg text-text-secondary px-2 py-0.5 rounded text-[13px]">体验场景</span>
                    <span className="bg-hover-bg text-text-secondary px-2 py-0.5 rounded text-[13px]">关注点</span>
                    <span className="bg-hover-bg text-text-secondary px-2 py-0.5 rounded text-[13px]">一句真实感受</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border-default bg-surface-1 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] flex flex-col gap-3">
          <button onClick={onClose} className="w-full py-3 bg-btn-main text-white rounded-lg text-[14px] font-bold hover:bg-btn-main-hover transition-colors flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> 确认条件并开始生成 (15篇预生成 + 4个分发入口)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
