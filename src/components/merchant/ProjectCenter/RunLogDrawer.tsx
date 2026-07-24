import React from "react";
import { X, History, Bot, User, Check, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export function RunLogDrawer({ onClose }: { onClose: () => void }) {
  const logs = [
    { id: 1, time: "今天 10:30", type: "user", text: "操盘手 张三 确认了 批次【首轮内测铺量】的执行，任务已下发" },
    { id: 2, time: "今天 10:25", type: "ai", text: "Agent 生成了内容草稿，共 15 篇，等待审核" },
    { id: 3, time: "昨天 18:00", type: "system", text: "调用能力: 小红书爆款文案生成器 v2.1 成功" },
    { id: 4, time: "昨天 17:50", type: "user", text: "操盘手 张三 调整了【待验证假设】，将验证周期从 3 天延长至 7 天" },
    { id: 5, time: "昨天 15:30", type: "ai", text: "根据竞品分析报告，建议增加 KOC 铺量数量。操盘手 拒绝了 该建议" },
    { id: 6, time: "03-01 10:00", type: "system", text: "项目创建成功，进入筹备阶段" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[450px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold flex items-center gap-2"><History size={20} /> 运行记录</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
           <div className="relative border-l-2 border-neutral-200 ml-4 space-y-8 pb-8">
             {logs.map((log) => (
               <div key={log.id} className="relative pl-6">
                 <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                   log.type === 'ai' ? 'bg-primary-500' : log.type === 'user' ? 'bg-neutral-900' : 'bg-neutral-400'
                 }`}>
                   {log.type === 'ai' && <Bot size={10} className="text-white" />}
                   {log.type === 'user' && <User size={10} className="text-white" />}
                   {log.type === 'system' && <GitBranch size={10} className="text-white" />}
                 </div>
                 <div className="text-[12px] text-neutral-500 mb-1">{log.time}</div>
                 <div className="text-[13px] text-neutral-800 leading-relaxed bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                   {log.text}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </motion.div>
    </div>
  );
}
