import React from "react";
import { Lightbulb, Hash, FolderKanban } from "lucide-react";

export function TopicStrategy() {
  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfc] overflow-hidden">
      <div className="px-8 py-6 border-b border-neutral-200 shrink-0 bg-white">
        <h1 className="text-[20px] font-bold text-neutral-900">话题与策略库</h1>
        <p className="text-[13px] text-neutral-500 mt-1">全局管理营销话题和标准化策略模板。</p>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
           <div>
             <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><Hash size={18} /> 热门话题追踪</h3>
             <div className="grid grid-cols-4 gap-4">
               {["#新手养狗", "#幼犬肠胃调理", "#狗狗神仙好物", "#双11囤货清单"].map((t, i) => (
                 <div key={i} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-shadow">
                   <div className="text-[14px] font-bold text-primary-600 mb-2">{t}</div>
                   <div className="text-[12px] text-neutral-500">关联项目：2 个</div>
                 </div>
               ))}
             </div>
           </div>
           
           <div>
             <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><Lightbulb size={18} /> 策略模板库</h3>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { title: "痛点搜索卡位策略", desc: "高密度长尾词覆盖，直接解答用户疑问，引流私域转化。" },
                 { title: "KOS人设打造", desc: "店长真实第一人称视角分享，拉近距离，提供情绪价值。" }
               ].map((t, i) => (
                 <div key={i} className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <FolderKanban size={18} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-neutral-900 mb-1">{t.title}</h4>
                      <p className="text-[13px] text-neutral-500 mb-3">{t.desc}</p>
                      <button className="text-[12px] font-bold text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50">套用此策略</button>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
