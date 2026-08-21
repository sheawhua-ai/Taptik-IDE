import React from "react";
import { Compass, Search, TrendingUp, Filter } from "lucide-react";

export function BlueOcean() {
  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfc] overflow-hidden">
      <div className="px-8 py-6 border-b border-border-default shrink-0 bg-surface-1">
        <h1 className="text-[20px] font-bold text-text-main">蓝海词发掘</h1>
        <p className="text-[13px] text-text-tertiary mt-1">发掘高转化、低竞争的搜索词，辅助制定内容策略。</p>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex gap-4">
             <div className="flex-1 relative">
               <input type="text" placeholder="输入品类或痛点，如：幼犬 软便" className="w-full bg-surface-1 border border-border-default rounded-xl py-3 pl-10 pr-4 text-[14px] outline-none focus:border-primary-500 shadow-sm" />
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
             </div>
             <button className="px-6 py-3 bg-btn-main text-white rounded-xl text-[14px] font-bold hover:bg-btn-main-hover flex items-center gap-2">
               开始挖掘 <TrendingUp size={16} />
             </button>
          </div>
          
          <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 border-b border-border-default flex justify-between items-center">
               <h3 className="text-[15px] font-bold text-text-main">本周高潜力蓝海词</h3>
               <button className="flex items-center gap-1.5 text-[12px] font-bold text-text-tertiary hover:text-text-main"><Filter size={14} /> 筛选</button>
             </div>
             <table className="w-full text-left text-[13px]">
               <thead className="bg-page-bg text-text-tertiary border-b border-border-default">
                 <tr>
                   <th className="px-4 py-3 font-medium">搜索词</th>
                   <th className="px-4 py-3 font-medium">搜索热度指数</th>
                   <th className="px-4 py-3 font-medium">笔记数量</th>
                   <th className="px-4 py-3 font-medium">竞争蓝海值</th>
                   <th className="px-4 py-3 font-medium text-right">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-100">
                 {[
                   { word: "幼犬换粮拉稀怎么办", heat: "8,432", notes: "125", score: "92", color: "text-emerald-600" },
                   { word: "益生菌狗粮哪个好", heat: "12,100", notes: "430", score: "85", color: "text-emerald-600" },
                   { word: "小型犬护胃狗粮推荐", heat: "5,300", notes: "89", score: "94", color: "text-brand-logo" },
                 ].map((item, i) => (
                   <tr key={i} className="hover:bg-page-bg">
                     <td className="px-4 py-3 font-bold text-text-main">{item.word}</td>
                     <td className="px-4 py-3 text-text-secondary">{item.heat}</td>
                     <td className="px-4 py-3 text-text-secondary">{item.notes}</td>
                     <td className="px-4 py-3 font-bold"><span className={item.color}>{item.score}</span></td>
                     <td className="px-4 py-3 text-right"><button className="text-brand-logo font-bold hover:underline">去建项目</button></td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}
