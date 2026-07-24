import React, { useState } from "react";
import { LayoutGrid, PenTool, Image, Send, MessageSquare, AlertTriangle, CheckCircle2, ChevronRight, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ExecutionCenter() {
  const [activeTaskType, setActiveTaskType] = useState<string | null>(null);

  const taskCategories = [
    {
      id: "content",
      title: "内容审核",
      icon: PenTool,
      pending: 15,
      impactToday: 15,
      projects: 2,
      topException: "3篇涉及违禁词",
    },
    {
      id: "assets",
      title: "素材与回传",
      icon: Image,
      pending: 8,
      impactToday: 3,
      projects: 1,
      topException: "2个素材质量不达标",
    },
    {
      id: "publish",
      title: "发布调度",
      icon: Send,
      pending: 12,
      impactToday: 12,
      projects: 3,
      topException: "1个账号异常限流",
    },
    {
      id: "interaction",
      title: "互动承接",
      icon: MessageSquare,
      pending: 25,
      impactToday: 5,
      projects: 4,
      topException: "2条高意向咨询未回复",
    }
  ];

  if (activeTaskType) {
    return (
      <div className="h-full w-full bg-[#fcfcfc] flex flex-col">
        <div className="h-16 border-b border-neutral-200 bg-white flex items-center px-6 shrink-0">
          <button onClick={() => setActiveTaskType(null)} className="text-[14px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-2">
            &larr; 返回执行中心
          </button>
          <div className="w-px h-4 bg-neutral-300 mx-4" />
          <h1 className="text-[16px] font-bold text-neutral-900">
            {taskCategories.find(c => c.id === activeTaskType)?.title}
          </h1>
        </div>
        <div className="flex-1 overflow-hidden">
          {activeTaskType === "content" && <ContentReviewWorkbench />}
          {activeTaskType === "assets" && <div className="p-8 text-neutral-500 text-center mt-20">素材与回传工作台（开发中）</div>}
          {activeTaskType === "publish" && <div className="p-8 text-neutral-500 text-center mt-20">发布调度工作台（开发中）</div>}
          {activeTaskType === "interaction" && <div className="p-8 text-neutral-500 text-center mt-20">互动承接工作台（开发中）</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#fcfcfc] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-[24px] font-extrabold text-neutral-900 mb-2">执行中心</h1>
          <p className="text-[14px] text-neutral-500">跨项目行动队列，处理所有需要人工介入的执行任务</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {taskCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group" onClick={() => setActiveTaskType(cat.id)}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center border border-neutral-100 group-hover:bg-primary-50 transition-colors">
                  <cat.icon size={24} className="text-neutral-700 group-hover:text-primary-600" />
                </div>
                <div className="text-right">
                   <div className="text-[32px] font-extrabold text-neutral-900 leading-none mb-1">{cat.pending}</div>
                   <div className="text-[12px] text-neutral-500">待处理</div>
                </div>
              </div>
              <h2 className="text-[18px] font-bold text-neutral-900 mb-4">{cat.title}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-[13px]">
                   <span className="text-neutral-500">今日影响推进数</span>
                   <span className="font-bold">{cat.impactToday}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                   <span className="text-neutral-500">涉及项目数</span>
                   <span className="font-bold">{cat.projects}</span>
                </div>
                {cat.topException && (
                  <div className="p-2 bg-red-50 rounded text-red-600 text-[12px] flex items-center gap-1 font-medium">
                    <AlertTriangle size={12} /> {cat.topException}
                  </div>
                )}
              </div>
              <button className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold group-hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
                进入处理 <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentReviewWorkbench() {
  return (
    <div className="h-full flex text-neutral-900">
      {/* Left: Queue */}
      <div className="w-[300px] border-r border-neutral-200 bg-white flex flex-col shrink-0">
         <div className="p-4 border-b border-neutral-100 font-bold text-[14px]">待审稿件 (15)</div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-3 rounded-xl border cursor-pointer ${i === 1 ? 'bg-white border-neutral-900 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}>
                <div className="text-[11px] text-neutral-500 mb-1">幼犬换粮搜索卡位第三轮 - 批次A</div>
                <div className="text-[13px] font-bold mb-2 line-clamp-1">幼犬换粮总是拉肚子？试试这招！</div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded">含风险词</span>
                  <span className="text-[11px] text-neutral-400">张三</span>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Center: Content Editor */}
      <div className="flex-1 bg-[#fcfcfc] flex flex-col">
         <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-neutral-100">
                 <input className="w-full text-[20px] font-bold outline-none mb-2" defaultValue="幼犬换粮总是拉肚子？试试这招！" />
                 <div className="flex gap-2">
                   <span className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded">小红书图文</span>
                   <span className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded">243 字</span>
                 </div>
               </div>
               <div className="p-6 h-[400px]">
                 <textarea className="w-full h-full resize-none outline-none text-[15px] leading-relaxed text-neutral-700" defaultValue="我家金毛3个月大，最近换粮总是软便，愁死我了。后来听医生建议尝试了【品牌X】，发现它含有益生菌，吃了一周肠胃明显变好了！强烈推荐给各位新手铲屎官！这绝对是包治百病的神器！" />
               </div>
            </div>
         </div>
         <div className="p-4 bg-white border-t border-neutral-200 flex justify-end gap-3 shrink-0">
           <button className="px-6 py-2.5 bg-white border border-neutral-200 rounded-xl text-[14px] font-bold hover:bg-neutral-50 text-neutral-600">退回重写</button>
           <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800">保存修改并通过</button>
         </div>
      </div>

      {/* Right: AI Checks */}
      <div className="w-[320px] border-l border-neutral-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-neutral-100 font-bold text-[14px]">AI 预审结果</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
             <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-[13px]">
               <AlertTriangle size={14} /> 发现违禁表达
             </div>
             <div className="text-[12px] text-red-600 leading-relaxed mb-2">
               内容中包含“包治百病”，违反了项目策略中的【禁止表达】规则。
             </div>
             <button className="text-[12px] bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg w-full font-bold">
               一键删除风险词
             </button>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
             <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-[13px]">
               <CheckCircle2 size={14} /> 事实核查通过
             </div>
             <div className="text-[12px] text-emerald-600 leading-relaxed">
               “含有益生菌”符合【产品成分库】中确认的商家事实。
             </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
             <div className="font-bold text-[13px] mb-2 text-neutral-900">内容包匹配度: 95%</div>
             <div className="text-[12px] text-neutral-500 leading-relaxed">
               很好地覆盖了“真实痛点”和“给出解决方案”的结构要求。
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
