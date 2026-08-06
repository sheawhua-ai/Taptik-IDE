import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, FileText, Image as ImageIcon, Calendar, Tag, History, CheckCircle2, AlertTriangle, Send, Copy, Camera, Check } from "lucide-react";
import { Note } from "../../../data/projectStore";

interface NoteDetailDrawerProps {
  note: Note | null;
  onClose: () => void;
  onActionClick: (note: Note) => void;
  onOpenInExecutionCenter: (note: Note) => void;
}

export function NoteDetailDrawer({ note, onClose, onActionClick, onOpenInExecutionCenter }: NoteDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"内容" | "素材" | "发布" | "观察">("内容");
  
  // Fake state for copy actions
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  if (!note) return null;

  const handleCopy = (type: 'title' | 'body') => {
    if (type === 'title') { setCopiedTitle(true); setTimeout(() => setCopiedTitle(false), 2000); }
    if (type === 'body') { setCopiedBody(true); setTimeout(() => setCopiedBody(false), 2000); }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-[600px] bg-white h-full shadow-2xl flex flex-col relative z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#EAECF0] flex flex-col gap-4 bg-[#F7F8FA] shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[18px] font-bold text-[#111827] leading-snug">{note.title || "未命名笔记"}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[12px] text-[#667085] bg-white px-2 py-0.5 border border-[#EAECF0] rounded-md">{note.type}</span>
                  <span className="text-[12px] text-[#667085] bg-white px-2 py-0.5 border border-[#EAECF0] rounded-md">{note.publishStatus === '未安排' ? note.contentStatus : note.publishStatus}</span>
                  <span className="text-[12px] text-[#667085]">参与者：{note.participant || "未分配"}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-neutral-400 hover:text-[#111827] rounded-lg hover:bg-neutral-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex gap-4 border-b border-[#EAECF0] mt-2">
              {(["内容", "素材", "发布", "观察"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-[13px] font-medium relative ${activeTab === tab ? "text-primary-600 font-bold" : "text-[#667085] hover:text-[#111827]"}`}
                >
                  {tab}
                  {activeTab === tab && <motion.div layoutId="drawerTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "内容" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[13px] text-[#667085] mb-1">内容方向</div>
                  <div className="text-[13px] text-[#111827]">{note.contentDirection || "暂无方向设定"}</div>
                </div>
                
                <div>
                  <div className="text-[13px] text-[#667085] mb-2 flex justify-between">
                    <span>正文内容</span>
                    <button onClick={() => handleCopy('body')} className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      {copiedBody ? <Check size={14}/> : <Copy size={14}/>} {copiedBody ? "已复制" : "复制"}
                    </button>
                  </div>
                  <div className="bg-[#F7F8FA] p-4 rounded-xl text-[13px] text-[#111827] leading-relaxed whitespace-pre-wrap border border-[#EAECF0]">
                    {note.publishStatus === "已发布" ? (
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-neutral-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                          <Check size={24} className="text-emerald-500" />
                        </div>
                        <div className="text-[#111827] font-bold mb-1">线上快照已存档</div>
                        <a href={note.publishLink || "#"} target="_blank" className="text-primary-600 hover:underline text-[12px]">点击查看小红书原文</a>
                      </div>
                    ) : (note.contentPackage?.body || "内容正在生成或暂无内容...")}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-[#EAECF0] rounded-xl">
                    <div className="text-[13px] font-bold text-[#111827] mb-2">商家知识库引用</div>
                    <div className="text-[12px] text-[#667085]">
                      · 幼犬换粮七日法则<br/>
                      · 敏感肠胃益生菌组合推荐
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-[#EAECF0] rounded-xl">
                    <div className="text-[13px] font-bold text-[#111827] mb-2">事实依据</div>
                    <div className="text-[12px] text-[#667085]">
                      · 2024用户满意度调研数据<br/>
                      · 换粮成功率95%以上
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="text-[13px] font-bold text-blue-900 mb-2">AI 检查与优化</div>
                  <div className="text-[12px] text-blue-800 mb-2">
                    已使用：品牌内容结构、口语化改写、首图标题优化、合规检查
                  </div>
                  {note.contentStatus === "待确认" && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100 flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] font-bold text-[#111827]">“七日换粮法”表述需要确认</div>
                        <div className="text-[12px] text-[#667085] mt-1">该表达可能被理解为固定周期承诺，AI建议改为“建议逐步过渡”。</div>
                        <button className="mt-2 px-4 py-1.5 bg-primary-600 text-white text-[12px] font-bold rounded-lg hover:bg-primary-700">确认修改</button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-[13px] text-[#667085] mb-2">修改记录</div>
                  <div className="text-[12px] text-[#111827] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#667085]">今天 10:00</span>
                      <span>AI 生成初稿</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "素材" && (
              <div className="space-y-6">
                <div className="text-[13px] text-[#667085] bg-[#F7F8FA] p-3 rounded-xl border border-[#EAECF0]">
                  AI已自动匹配当前项目及商家可复用素材池。
                </div>
                
                <div>
                  <h4 className="text-[14px] font-bold text-[#111827] mb-3">推荐匹配</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-[#EAECF0] rounded-xl p-2">
                      <div className="aspect-square bg-neutral-100 rounded-lg mb-2 flex items-center justify-center">
                        <ImageIcon size={24} className="text-neutral-300"/>
                      </div>
                      <div className="text-[12px] text-[#111827] font-medium">产品正面图</div>
                      <div className="text-[11px] text-[#667085] mt-1">推荐：产品正面清晰，适合作为第二张产品说明图。</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[14px] font-bold text-[#111827] mb-3">素材缺口</h4>
                  <div className="p-4 border border-red-100 bg-red-50 rounded-xl">
                    <div className="text-[13px] font-bold text-red-800 mb-1">还缺2项：</div>
                    <div className="text-[13px] text-red-700 mb-3">领口细节图、门店试穿场景图</div>
                    <button className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700">向门店下发拍摄任务</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "发布" && (
              <div className="space-y-6">
                <div className="text-[14px] font-bold text-[#111827]">发布流程 ({note.type})</div>
                
                {note.type === "店长号/KOS" ? (
                  <div className="space-y-3">
                    <div className="text-[13px] text-[#667085] space-y-2">
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 内容已确认</div>
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 图片已准备</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-primary-600" /> 生成员工定向任务</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-neutral-300" /> 员工H5复制标题</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-neutral-300" /> 员工H5复制正文</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-neutral-300" /> 图片带入并跳转小红书</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-neutral-300" /> 等待系统识别</div>
                    </div>
                    <div className="mt-4 p-4 bg-[#F7F8FA] border border-[#EAECF0] rounded-xl text-[13px] text-[#667085]">
                      员工KOS发布任务将自动推送到对应企业微信或飞书，点击下方按钮也可预览。
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-[13px] text-[#667085] space-y-2">
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 生成消费者二维码</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-primary-600" /> 微信扫码进入独立H5</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">可选填写问卷</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">获取图片</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">分别复制标题、正文</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">跳转小红书</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-neutral-300" /> 等待系统识别</div>
                    </div>
                    <div className="p-4 border border-[#EAECF0] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-[#111827]">消费者发布入口</div>
                        <div className="text-[12px] text-[#667085] mt-1">引导消费者扫描二维码或点击链接开始发布</div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700">查看二维码</button>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-neutral-50 rounded-xl border border-[#EAECF0]">
                  <div className="text-[13px] font-bold text-[#111827] mb-2">识别状态</div>
                  <div className="text-[12px] text-[#667085]">
                    发布完成后无需回传链接，系统将自动识别笔记ID、发布账号和发布时间。超时未识别将自动转入异常。
                  </div>
                </div>
              </div>
            )}

            {activeTab === "观察" && (
              <div className="space-y-6">
                <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#EAECF0]">
                  <div className="text-[14px] font-bold text-[#111827] mb-3 flex items-center justify-between">
                    <span>当前状态：观察中</span>
                    <button className="text-[12px] text-primary-600 font-medium">调整观察策略</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[12px] text-[#667085] mb-1">已观察时间</div>
                      <div className="text-[13px] text-[#111827] font-medium">18小时</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#667085] mb-1">下次数据更新</div>
                      <div className="text-[13px] text-[#111827] font-medium">6小时后</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[12px] text-[#667085] mb-1">预计观察结束时间</div>
                      <div className="text-[13px] text-[#111827] font-medium">8月12日 18:00 (7天周期)</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[14px] font-bold text-[#111827] mb-3">检查点记录 (7天周期)</h4>
                  <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-[#EAECF0]">
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-[#111827]">发布成功及首次识别</div>
                        <div className="text-[12px] text-[#667085] mt-1">今天 09:00</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-primary-600 rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-[#111827]">24小时检查点</div>
                        <div className="text-[12px] text-[#667085] mt-1">等待执行...</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-[#EAECF0] rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-neutral-400">3天检查点</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-[#EAECF0] rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-neutral-400">7天检查点</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#EAECF0] rounded-xl text-[12px] text-[#667085]">
                  <span className="font-bold text-[#111827]">异常监控中：</span>
                  系统正在持续监控笔记可访问性、账号匹配度及数据更新状态，如有异常将自动推送到执行中心。
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
