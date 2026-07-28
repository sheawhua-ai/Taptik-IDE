import React, { useState } from "react";
import { LayoutGrid, PenTool, Image as ImageIcon, Send, MessageSquare, AlertTriangle, CheckCircle2, ChevronRight, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContentReviewWorkbench } from "../rings/ContentReviewWorkbench";
import { ShootingAndUploadWorkbench } from "../rings/ShootingAndUploadWorkbench";
import { PublishExceptionWorkbench } from "../rings/PublishExceptionWorkbench";
import { InteractionWorkbench } from "../rings/InteractionWorkbench";

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
      icon: ImageIcon,
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
    if (activeTaskType === "content") {
      return <ContentReviewWorkbench onClose={() => setActiveTaskType(null)} />;
    }
    if (activeTaskType === "assets") {
      return <ShootingAndUploadWorkbench onClose={() => setActiveTaskType(null)} />;
    }
    if (activeTaskType === "publish") {
      return <PublishExceptionWorkbench onClose={() => setActiveTaskType(null)} />;
    }
    if (activeTaskType === "interaction") {
      return <InteractionWorkbench onClose={() => setActiveTaskType(null)} />;
    }
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
