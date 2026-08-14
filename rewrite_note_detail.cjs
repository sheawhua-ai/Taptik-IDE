const fs = require('fs');

let code = fs.readFileSync('src/components/merchant/ProjectCenter/NoteDetailDrawer.tsx', 'utf8');

const replacement = `import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, CheckCircle2, ChevronRight, FileText, Image as ImageIcon,
  MessageSquare, User, Clock, AlertCircle, Sparkles, ExternalLink
} from "lucide-react";

interface NoteDetailDrawerProps {
  note: any;
  projectId?: string;
  onClose: () => void;
  onActionClick?: () => void;
  onOpenInExecutionCenter?: () => void;
}

export function NoteDetailDrawer({ note, projectId, onClose, onActionClick, onOpenInExecutionCenter }: NoteDetailDrawerProps) {
  // If it's a consumer content pack, we use the vertical layout without tabs.
  const isConsumer = note.isConsumer || note.type?.includes("KOC") || note.type?.includes("消费者");

  // Legacy tab state for non-consumer notes
  const [activeTab, setActiveTab] = useState<"内容" | "素材" | "发布" | "观察">("内容");

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div 
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-[480px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col z-10"
      >
        <div className="p-5 border-b border-neutral-200 bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-[16px] font-extrabold text-neutral-900">{isConsumer ? "消费者内容包详情" : "笔记详情"}</h2>
            <div className="text-[12px] text-neutral-500 mt-0.5">{note.pack || note.title || "未命名"}</div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isConsumer ? (
            <div className="p-6 space-y-6">
              {/* 1. 内容包概况 */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <div className="w-1 h-3.5 bg-neutral-900 rounded-full" />
                  内容包概况
                </h3>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">当前状态</span>
                    <span className={\`text-[12px] font-bold px-2 py-1 rounded-lg \${note.status === '待领取' ? 'bg-neutral-100 text-neutral-600' : 'bg-emerald-50 text-emerald-700'}\`}>
                      {note.status || "待领取"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">当前领取者</span>
                    <span className="text-[12px] font-bold text-neutral-900">{note.status === '待领取' ? "待匹配消费者" : note.account}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">项目问卷版本</span>
                    <span className="text-[12px] font-medium text-neutral-700">v1.2 (最新)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">创建时间</span>
                    <span className="text-[12px] font-medium text-neutral-700">2026-08-13 14:00</span>
                  </div>
                </div>
              </div>

              {/* 2. 笔记生成要求 */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <div className="w-1 h-3.5 bg-neutral-900 rounded-full" />
                  笔记生成要求
                </h3>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-4 shadow-2xs text-[12px]">
                  <div>
                    <div className="text-neutral-500 mb-1">主题方向</div>
                    <div className="font-medium text-neutral-900">幼犬换粮体验、软便缓解心得与真实避坑建议。</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 mb-1">必须覆盖的信息</div>
                    <div className="font-medium text-neutral-900">说明狗狗品种与月龄，体现专利益生菌的辅助作用。</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 mb-1">禁用表达</div>
                    <div className="font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block">禁止出现“绝对不拉肚子”、“处方粮”、“治百病”等绝对化或医疗用词。</div>
                  </div>
                </div>
              </div>

              {/* 3. 个性化生成依据 */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <div className="w-1 h-3.5 bg-neutral-900 rounded-full" />
                  个性化生成依据
                </h3>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
                  {note.status === '待领取' ? (
                    <div className="text-[12px] text-neutral-500 text-center py-4">
                      <Sparkles size={20} className="mx-auto mb-2 opacity-50" />
                      消费者填写项目问卷后，<br />系统将根据其真实经历、使用场景和表达偏好<br />生成专属笔记。
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div className="text-[12px] text-neutral-500">消费者回答快照</div>
                        <button className="text-[12px] font-bold text-neutral-700 hover:text-neutral-900 flex items-center gap-1">
                          查看完整回答 <ChevronRight size={14} />
                        </button>
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex gap-2">
                          <span className="text-neutral-400 shrink-0">提取重点:</span>
                          <span className="font-medium text-neutral-900">3个月金毛幼犬，近期软便严重，希望解决肠胃脆弱问题。</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-neutral-400 shrink-0">采用角度:</span>
                          <span className="font-medium text-neutral-900">新手铲屎官焦虑求助转为经验分享。</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-neutral-400 shrink-0">采用语气:</span>
                          <span className="font-medium text-neutral-900">高口语化，真实亲切。</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. 照片拍摄要求 */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <div className="w-1 h-3.5 bg-neutral-900 rounded-full" />
                  照片拍摄要求
                </h3>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-4">
                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[13px] font-bold text-neutral-900">场景一：狗狗进食中</div>
                      <div className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">建议 1 张 · 必拍</div>
                    </div>
                    <div className="text-[12px] text-neutral-600 mb-2">要求：自然光线，狗狗吃粮的特写或半身照，需露出包装袋一角。</div>
                    <div className="text-[12px] text-rose-600">禁忌：画面杂乱，有其他品牌狗粮入镜。</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[13px] font-bold text-neutral-900">场景二：狗狗便便状态</div>
                      <div className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">建议 1 张 · 可选</div>
                    </div>
                    <div className="text-[12px] text-neutral-600">要求：便便成型后的远景或打码处理，证明换粮效果。</div>
                  </div>
                </div>
              </div>

              {/* 5. 执行状态 */}
              <div className="space-y-3 pb-8">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <div className="w-1 h-3.5 bg-neutral-900 rounded-full" />
                  执行时间线
                </h3>
                <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
                  {note.status === '待领取' ? (
                    <div className="text-[12px] text-neutral-500 text-center py-2">
                      暂无执行记录
                    </div>
                  ) : (
                    <div className="relative pl-4 space-y-5 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-neutral-100">
                      <div className="relative">
                        <div className="absolute w-3 h-3 bg-neutral-300 rounded-full -left-[9px] top-1 border-2 border-white" />
                        <div className="pl-4">
                          <div className="text-[12px] font-bold text-neutral-900">消费者已领取</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">08-13 15:30</div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute w-3 h-3 bg-neutral-300 rounded-full -left-[9px] top-1 border-2 border-white" />
                        <div className="pl-4">
                          <div className="text-[12px] font-bold text-neutral-900">问卷已提交，AI生成完毕</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">08-13 15:35</div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[9px] top-1 border-2 border-white" />
                        <div className="pl-4">
                          <div className="text-[12px] font-bold text-emerald-700">照片已上传并检查通过</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">08-13 16:10</div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute w-3 h-3 bg-white border-2 border-neutral-200 rounded-full -left-[9px] top-1" />
                        <div className="pl-4">
                          <div className="text-[12px] font-bold text-neutral-400">等待进入小红书发布与自动识别</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            // Legacy Tabs for non-consumer notes
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <div className="flex items-center gap-6 px-6 border-b border-neutral-200 shrink-0">
                {["内容", "素材", "发布", "观察"].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={\`py-4 text-[13px] font-bold border-b-2 transition-colors \${activeTab === tab ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-700"}\`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="text-center text-neutral-400 text-[13px] py-12">
                  自有账号功能在此略过...
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/merchant/ProjectCenter/NoteDetailDrawer.tsx', replacement);
console.log('Rewrite NoteDetailDrawer complete!');
