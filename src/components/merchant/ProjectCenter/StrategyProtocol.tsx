import React, { useState } from "react";
import { CheckCircle2, FlaskConical, ShieldAlert, Cpu, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StrategyProtocol({ project }: { project: any }) {
  const [drawerOpen, setDrawerOpen] = useState<"capability" | "source" | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative">
      <div className="flex justify-end absolute -top-12 right-0">
         <button onClick={() => setDrawerOpen("capability")} className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2">
           <Cpu size={16} /> 查看能力方案
         </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <h2 className="text-[16px] font-bold mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-primary-500" /> 已确认事实
        </h2>
        <div className="space-y-4">
          {[
            { id: 1, fact: "幼犬换粮期容易出现软便问题，是用户核心痛点", source: "历史评论区分析", updated: "2024-03-01", expired: false },
            { id: 2, fact: "当前产品含有益生菌配方，能有效缓解肠胃不适", source: "产品成分库", updated: "2024-02-15", expired: false }
          ].map(item => (
            <div key={item.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex justify-between items-center">
               <div>
                 <div className="text-[14px] font-bold text-neutral-900 mb-1">{item.fact}</div>
                 <div className="text-[12px] text-neutral-500 flex items-center gap-4">
                   <span>更新于 {item.updated}</span>
                   {item.expired && <span className="text-red-500">已过期</span>}
                 </div>
               </div>
               <button onClick={() => setDrawerOpen("source")} className="text-[13px] text-primary-600 font-bold hover:underline flex items-center gap-1">
                 查看来源 <ExternalLink size={14} />
               </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <h2 className="text-[16px] font-bold mb-6 flex items-center gap-2">
          <FlaskConical size={18} className="text-primary-500" /> 待验证假设
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
             <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">假设</div>
                 <div className="text-[14px] font-bold text-neutral-900">放大“真实换粮软便”场景的KOC内容，能提升搜素结果的点击和线索转化</div>
               </div>
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">采用原因</div>
                 <div className="text-[14px] font-medium text-neutral-700">竞品该词包下多为官方宣发，缺乏真实测评</div>
               </div>
             </div>
             <div className="grid grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">验证方法</div>
                 <div className="text-[13px] font-bold">搜索卡位 + KOC铺量</div>
               </div>
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">样本量 / 窗口期</div>
                 <div className="text-[13px] font-bold">20篇 / 发布后7天</div>
               </div>
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">继续条件</div>
                 <div className="text-[13px] font-bold text-emerald-600">有效评论数提升 &gt; 20%</div>
               </div>
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">停止或调整条件</div>
                 <div className="text-[13px] font-bold text-red-600">无明显转化且互动率低</div>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <h2 className="text-[16px] font-bold mb-6 flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-500" /> 执行边界
        </h2>
        <div className="grid grid-cols-2 gap-6">
           <div className="space-y-3">
             <div className="text-[14px] font-bold text-neutral-900 border-b pb-2">禁止表达</div>
             <ul className="list-disc pl-5 text-[13px] text-neutral-600 space-y-1">
               <li>禁止使用“包治百病”、“药到病除”等绝对化医疗用语</li>
               <li>禁止贬低其他品牌</li>
             </ul>
           </div>
           <div className="space-y-3">
             <div className="text-[14px] font-bold text-neutral-900 border-b pb-2">限制条件</div>
             <ul className="list-disc pl-5 text-[13px] text-neutral-600 space-y-1">
               <li>预算限制：本轮内容成本不超过 2000 元</li>
               <li>时间限制：必须在 4月20日 前完成复盘</li>
               <li>自动执行：笔记自动生成、素材初审可系统自动完成</li>
               <li>人工确认：发布内容前必须人工二审，外部消息发送必须人工确认</li>
             </ul>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen === "capability" && (
           <div className="fixed inset-0 z-50 flex justify-end">
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setDrawerOpen(null)} />
             <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               className="w-[600px] bg-white h-full shadow-2xl flex flex-col relative z-10"
             >
               <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-[#fcfcfc]">
                 <h2 className="text-[18px] font-bold">能力调用方案</h2>
                 <button onClick={() => setDrawerOpen(null)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
                   <X size={20} />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {[
                    { node: "生成内容草稿", skill: "小红书爆款文案生成器 v2.1", type: "系统自带", auto: "自动执行" },
                    { node: "素材预检", skill: "图文合规性审查插件", type: "商家专用", auto: "自动执行" },
                    { node: "发送消息", tool: "微信企微接口", type: "系统接口", auto: "人工确认" }
                  ].map((cap, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-neutral-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-[14px]">{cap.node}</div>
                        <div className={`text-[11px] px-2 py-0.5 rounded-full ${cap.auto === '自动执行' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {cap.auto}
                        </div>
                      </div>
                      <div className="text-[13px] text-neutral-600 mb-2">
                        <span className="font-medium">使用能力:</span> {cap.skill || cap.tool} ({cap.type})
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="text-[12px] px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded font-medium">更换能力</button>
                        <button className="text-[12px] px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded font-medium">转为人工</button>
                      </div>
                    </div>
                  ))}
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
