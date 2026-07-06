const fs = require('fs');

const code = `import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, CheckCircle2, Send, QrCode, Smartphone, ExternalLink, Calendar, Users
} from 'lucide-react';

export const PublishDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[600px] bg-white h-full shadow-2xl flex flex-col relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Send size={18} className="text-indigo-600" />
            <h3 className="font-bold text-neutral-900 text-[16px]">发布包详情与分发</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
            <X size={18} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-neutral-50/30">
          
          <div className="text-[13px] text-neutral-500 mb-2">
            系统已将内容和素材打包。不同账号通道支持不同的发布方式。
          </div>

          {/* 官方号 */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-blue-50/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h4 className="font-bold text-[14px] text-neutral-900">官方号发布包</h4>
              </div>
              <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">3 篇，账号已确认，可排期</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">发布方式：直连草稿箱 / 扫码发布</span>
                <span className="text-neutral-700 font-medium">3 篇笔记就绪</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-2 text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                  <Calendar size={14} /> 加入系统排期
                </button>
                <button className="flex-1 py-2 text-[12px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                  <QrCode size={14} /> 扫码预览并发布
                </button>
              </div>
            </div>
          </div>

          {/* KOS */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-indigo-50/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <h4 className="font-bold text-[14px] text-neutral-900">KOS 发布包</h4>
              </div>
              <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">4 篇，2 篇待员工确认</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">发布方式：发送至企微员工助手</span>
                <span className="text-neutral-700 font-medium">2 篇可发，2 篇待定</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-2 text-[12px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-indigo-100">
                  <ExternalLink size={14} /> 下发给门店导购
                </button>
              </div>
            </div>
          </div>

          {/* 真实客户 KOC */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-amber-50/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <h4 className="font-bold text-[14px] text-neutral-900">真实客户快发 (即时生成)</h4>
              </div>
              <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">5 个扫码名额</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">发布方式：客户现场扫码，即时生成与发布</span>
                <span className="text-neutral-700 font-medium">等待扫码</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-2 text-[12px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-amber-100">
                  <QrCode size={14} /> 生成门店台卡二维码
                </button>
                <button className="flex-1 py-2 text-[12px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-amber-100">
                  <Smartphone size={14} /> 复制客服发送链接
                </button>
              </div>
            </div>
          </div>

          {/* 泛素人 KOC */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-emerald-50/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="font-bold text-[14px] text-neutral-900">泛素人分发 (人工审核)</h4>
              </div>
              <span className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">8 篇，待预设人设</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">发布方式：审核后发给外部群/通告达人</span>
                <span className="text-neutral-700 font-medium">需人工审核</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-2 text-[12px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-emerald-100">
                  <Users size={14} /> 前往人设与审核工作台
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
`
fs.writeFileSync('src/components/rings/PublishDrawer.tsx', code);
