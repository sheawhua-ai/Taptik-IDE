import React, { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, X, BarChart2, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AIReview() {
  const [drawerType, setDrawerType] = useState<"basis" | "adjust_draft" | "deposit" | null>(null);
  
  const decisions = [
    {
      id: 1,
      type: "continue",
      title: "建议继续",
      discovery: "“真实换粮软便”内容的有效评论率高出基线 35%",
      basis: "基于幼犬换粮搜索卡位第二轮 20 篇笔记的公开评论和咨询线索分析。",
      other: "也可能是近期官方活动带来的自然流量溢出。",
      action: "在接下来的批次中增加此类内容的产出比例。",
      impact: "影响 幼犬换粮项目 下一阶段的内容包配置。"
    },
    {
      id: 2,
      type: "adjust",
      title: "建议调整",
      discovery: "KOC 素材“宠物与产品合照”通过率仅 40%",
      basis: "基于素材验收记录，多为光线暗、产品不清晰导致。",
      other: "KOC对摄影要求理解存在偏差。",
      action: "优化素材任务模板，增加防错示例，降低拍摄门槛。",
      impact: "将更新所有正在使用的“换粮体验包”素材模板。"
    },
    {
      id: 3,
      type: "verify",
      title: "下一轮验证",
      discovery: "发现部分用户提及“挑食”问题",
      basis: "在最新5篇笔记的评论区中，“挑食”、“不爱吃”关键词出现频率上升。",
      other: "可能是偶发样本，需进一步验证。",
      action: "发起新一轮小规模测试，针对“挑食”场景进行搜索卡位。",
      impact: "需新建项目或测试批次。"
    }
  ];

  return (
    <div className="h-full w-full bg-[#fcfcfc] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-12 relative">
        <div className="mb-8">
          <h1 className="text-[24px] font-extrabold text-neutral-900 mb-2 flex items-center gap-2">
            <Sparkles size={24} className="text-primary-500" /> AI 复盘决策
          </h1>
          <p className="text-[14px] text-neutral-500">
            基于运行中和历史项目数据，提供策略调整建议。所有调整均需你确认后才会生效。
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {decisions.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
              <div className="p-6 border-b border-neutral-100 flex-1">
                 <div className="flex items-center gap-2 mb-4">
                   <span className={`text-[12px] px-2.5 py-1 rounded-full font-bold ${
                     d.type === 'continue' ? 'bg-emerald-100 text-emerald-700' :
                     d.type === 'adjust' ? 'bg-amber-100 text-amber-700' :
                     'bg-blue-100 text-blue-700'
                   }`}>
                     {d.title}
                   </span>
                 </div>
                 <div className="text-[16px] font-bold text-neutral-900 mb-4">{d.discovery}</div>
                 
                 <div className="space-y-4 text-[13px]">
                   <div>
                     <div className="text-neutral-500 mb-1 font-medium">依据摘要</div>
                     <div className="text-neutral-700">{d.basis}</div>
                   </div>
                   <div>
                     <div className="text-neutral-500 mb-1 font-medium">其他可能性</div>
                     <div className="text-neutral-700">{d.other}</div>
                   </div>
                   <div>
                     <div className="text-neutral-500 mb-1 font-medium">建议动作</div>
                     <div className="font-bold text-neutral-900">{d.action}</div>
                   </div>
                   <div className="p-3 bg-neutral-50 rounded-lg text-neutral-600">
                     影响范围：{d.impact}
                   </div>
                 </div>
              </div>
              <div className="p-4 bg-neutral-50/50 rounded-b-2xl flex flex-col gap-2 shrink-0">
                 <button onClick={() => setDrawerType("basis")} className="w-full py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors">
                   查看完整依据
                 </button>
                 <button onClick={() => setDrawerType("adjust_draft")} className="w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">
                   生成调整草案
                 </button>
                 <button onClick={() => setDrawerType("deposit")} className="w-full py-2 bg-white border border-primary-200 text-primary-700 rounded-lg text-[13px] font-bold hover:bg-primary-50 transition-colors">
                   沉淀为经验/知识
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {drawerType === "basis" && <BasisDrawer onClose={() => setDrawerType(null)} />}
        {drawerType === "adjust_draft" && <AdjustDraftDrawer onClose={() => setDrawerType(null)} />}
        {drawerType === "deposit" && <DepositDrawer onClose={() => setDrawerType(null)} />}
      </AnimatePresence>
    </div>
  );
}

function BasisDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold">决策依据</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="bg-white p-4 rounded-xl border border-neutral-200">
             <div className="text-[14px] font-bold text-neutral-900 mb-4 border-b pb-2">数据覆盖范围</div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">使用笔记数</div>
                 <div className="text-[14px] font-bold">20 篇</div>
               </div>
               <div>
                 <div className="text-[12px] text-neutral-500 mb-1">时间范围</div>
                 <div className="text-[14px] font-bold">近 15 天</div>
               </div>
               <div className="col-span-2">
                 <div className="text-[12px] text-neutral-500 mb-1">包含数据源</div>
                 <div className="text-[13px] font-medium text-neutral-700">公开互动数据 (赞藏评)、公开评论区文本抽样。</div>
               </div>
             </div>
           </div>

           <div className="bg-white p-4 rounded-xl border border-neutral-200">
             <div className="text-[14px] font-bold text-neutral-900 mb-4 border-b pb-2">不能确定的部分</div>
             <div className="text-[13px] text-neutral-600 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100">
               <AlertTriangle size={14} className="inline mr-1 text-amber-500 mb-0.5" />
               由于未接入曝光量和点击率数据，无法确定转化率的绝对提升，当前结论仅基于“有效互动量/发布量”的相对对比。
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

function AdjustDraftDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[600px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold">项目调整差异草案</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           
           <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
             <div className="text-[15px] font-bold text-neutral-900 mb-4">内容包模板更新</div>
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                 <div className="text-[12px] text-red-600 font-bold mb-2 flex items-center gap-1"><X size={14}/> 修改前</div>
                 <div className="text-[13px] text-neutral-700 line-through">要求拍摄宠物与产品合照。</div>
               </div>
               <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                 <div className="text-[12px] text-emerald-600 font-bold mb-2 flex items-center gap-1"><CheckCircle2 size={14}/> 修改后</div>
                 <div className="text-[13px] text-neutral-700">要求拍摄产品细节图，宠物出镜即可，无需强求合影。附反面示例图。</div>
               </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
             <div className="text-[15px] font-bold text-neutral-900 border-b pb-2">影响范围评估</div>
             <div className="flex justify-between items-center text-[13px] border-b border-neutral-100 py-2">
               <span className="text-neutral-500">影响的批次</span>
               <span className="font-bold">幼犬换粮搜索卡位第三轮 - 批次B</span>
             </div>
             <div className="flex justify-between items-center text-[13px] border-b border-neutral-100 py-2">
               <span className="text-neutral-500">影响已领任务的KOC?</span>
               <span className="font-bold text-red-500">是 (有3人需重新通知)</span>
             </div>
             <div className="flex justify-between items-center text-[13px] py-2">
               <span className="text-neutral-500">是否需要重新生成内容?</span>
               <span className="font-bold">否</span>
             </div>
           </div>

        </div>
        <div className="p-6 bg-white border-t border-neutral-200 shrink-0">
          <button className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors">
            确认并写入项目版本
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function DepositDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[400px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold">沉淀知识与经验</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           <div className="p-4 bg-white rounded-xl border border-neutral-200 cursor-pointer hover:border-primary-500 transition-colors">
             <div className="font-bold text-[14px] text-neutral-900 mb-1">沉淀为商家知识</div>
             <div className="text-[12px] text-neutral-500 mb-3">将经过验证的商家事实补充到品牌库中。</div>
             <textarea className="w-full h-20 p-2 text-[13px] border border-neutral-200 rounded resize-none" defaultValue="KOC对于宠物与产品强行合照的执行难度较高，建议后续项目降低合影要求。" />
             <button className="mt-3 w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold">确认沉淀</button>
           </div>
           
           <div className="p-4 bg-white rounded-xl border border-neutral-200 cursor-pointer hover:border-primary-500 transition-colors">
             <div className="font-bold text-[14px] text-neutral-900 mb-1">沉淀为我的经验</div>
             <div className="text-[12px] text-neutral-500 mb-3">更新操盘手的个人项目偏好。</div>
             <textarea className="w-full h-20 p-2 text-[13px] border border-neutral-200 rounded resize-none" defaultValue="此类低单价宠粮铺量项目，素材模板需要提供2个以上的错误示范图。" />
             <button className="mt-3 w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold">确认沉淀</button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
