import React, { useState } from "react";
import { Filter, Calendar, LayoutList, MoreHorizontal, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NoteLedger({ project }: { project: any }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activeNote, setActiveNote] = useState<any>(null);

  const notes = [
    { id: "n1", pack: "消费者体验招募内容包", account: "小红薯_抹茶狗", type: "消费者/KOC", date: "-", status: "照片检查中", assignee: "待填写问卷", error: "", pic: "-", isConsumer: true },
    { id: "n2", pack: "消费者体验招募内容包", account: "待匹配消费者", type: "消费者/KOC", date: "-", status: "待领取", assignee: "等待消费者领取后生成个性化笔记", error: "", pic: "-", isConsumer: true },
    { id: "n3", pack: "官方宣发包", account: "小红书-宠粮精选店长", type: "自有账号", date: "2026-08-15", status: "已完成", assignee: "已生成并发布", error: "", pic: "运营-王强", isConsumer: false },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-hover-bg rounded-lg p-1">
          <button onClick={() => setView("list")} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${view === "list" ? "bg-surface-1  text-text-main" : "text-text-tertiary hover:text-text-secondary"}`}>列表视图</button>
          <button onClick={() => setView("calendar")} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${view === "calendar" ? "bg-surface-1  text-text-main" : "text-text-tertiary hover:text-text-secondary"}`}>日历视图</button>
        </div>
        <button className="p-2 bg-surface-1 border border-border-default rounded-lg text-text-secondary hover:bg-surface-2">
          <Filter size={16} />
        </button>
      </div>

      {view === "list" ? (
        <div className="bg-surface-1 rounded-xl border border-border-default  overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-2 border-b border-border-default text-[12px] text-text-tertiary">
                <th className="p-4 font-medium">内容包名称 / 占位情况</th>
                <th className="p-4 font-medium">类型</th>
                <th className="p-4 font-medium">当前状态</th>
                <th className="p-4 font-medium">当前说明</th>
                <th className="p-4 font-medium">异常/卡点</th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n, i) => {
                const getStatusStyle = (status) => {
                  if (status === '待领取') return 'bg-hover-bg text-text-secondary border border-border-default';
                  if (status === '照片检查中' || status === 'AI 生成中' || status === '待确认笔记' || status === '待拍照片') return 'bg-amber-50 text-amber-700 border border-amber-200';
                  if (status === '已完成' || status === '观察中') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  return 'bg-hover-bg text-text-secondary border border-border-default';
                };
                return (
                <tr key={i} className="border-b border-border-default hover:bg-surface-2 transition-colors text-[13px]">
                  <td className="p-4">
                    <div className="font-bold text-text-main">{n.pack}</div>
                    <div className="text-[11.5px] text-text-tertiary mt-1.5 flex items-center gap-1.5">
                      <span className="shrink-0">{n.isConsumer && n.status === '待领取' ? '未关联' : '已领取:'}</span>
                      <span className="font-medium text-text-secondary truncate max-w-[120px]">{n.account}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary font-medium">
                    {n.type}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold ${getStatusStyle(n.status)}`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="p-4 text-[12px] text-text-secondary max-w-[200px]">
                    {n.assignee}
                  </td>
                  <td className="p-4">
                    {n.error ? <span className="text-danger font-bold bg-danger-light px-2 py-1 rounded border border-danger-light">{n.error}</span> : <span className="text-text-tertiary">-</span>}
                  </td>
                  <td className="p-4">
                    <button onClick={() => setActiveNote(n)} className="px-3.5 py-1.5 bg-surface-1 border border-border-default rounded-xl text-[12px] font-bold text-text-secondary hover:bg-surface-2 hover:text-text-main  transition-all">
                      查看要求
                    </button>
                  </td>
                </tr>
              )})}

            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface-1 rounded-xl border border-border-default  p-6 flex items-center justify-center h-64 text-text-tertiary">
          <Calendar size={32} className="mb-2" />
          <p>日历视图</p>
        </div>
      )}

      {/* Note Detail Drawer */}
      <AnimatePresence>
        {activeNote && (
           <div className="fixed inset-0 z-50 flex justify-end">
             <div className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm" onClick={() => setActiveNote(null)} />
             <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
             >
               <div className="p-6 border-b border-border-default flex justify-between items-center bg-surface-1">
                 <h2 className="text-[18px] font-bold">笔记详情</h2>
                 <button onClick={() => setActiveNote(null)} className="p-2 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg">
                   <X size={20} />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  <div className="bg-surface-1 p-4 rounded-xl border border-border-default">
                    <div className="text-[14px] font-bold text-text-main mb-4 border-b pb-2">基本信息</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] text-text-tertiary mb-1">参与者/账号</div>
                        <div className="text-[13px] font-bold">{activeNote.account}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-text-tertiary mb-1">计划发布日</div>
                        <div className="text-[13px] font-bold">{activeNote.date}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[11px] text-text-tertiary mb-1">使用内容包</div>
                        <div className="text-[13px] font-bold text-brand-logo">{activeNote.pack}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-1 p-4 rounded-xl border border-border-default">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <div className="text-[14px] font-bold text-text-main">内容稿件</div>
                      <span className={`text-[11px] px-2 py-0.5 rounded ${activeNote.contentStatus === '待审核' ? 'bg-amber-100 text-amber-700' : 'bg-hover-bg text-text-secondary'}`}>{activeNote.contentStatus}</span>
                    </div>
                    {activeNote.contentStatus === '待审核' ? (
                      <div className="text-[13px] text-text-secondary">
                        <p className="mb-2"><strong>[标题]</strong> 幼犬换粮总是拉肚子？试试这招！</p>
                        <p className="line-clamp-3">我家金毛3个月大，最近换粮总是软便，愁死我了。后来听医生建议尝试了...</p>
                        <button className="mt-4 w-full py-2 bg-btn-main text-white rounded-lg text-[13px] font-bold hover:bg-btn-main-hover">
                          去执行中心审核
                        </button>
                      </div>
                    ) : (
                      <div className="text-[13px] text-text-tertiary">暂无内容</div>
                    )}
                  </div>

                  {activeNote.publishStatus === '已发布' && (
                    <div className="bg-surface-1 p-4 rounded-xl border border-border-default">
                      <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <div className="text-[14px] font-bold text-text-main">发布数据</div>
                        <a href="#" className="text-[12px] text-brand-logo flex items-center gap-1 hover:underline"><ExternalLink size={12}/> 查看小红书</a>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                         <div>
                           <div className="text-[11px] text-text-tertiary mb-1">阅读</div>
                           <div className="text-[16px] font-bold">1.2k</div>
                         </div>
                         <div>
                           <div className="text-[11px] text-text-tertiary mb-1">点赞</div>
                           <div className="text-[16px] font-bold">45</div>
                         </div>
                         <div>
                           <div className="text-[11px] text-text-tertiary mb-1">收藏</div>
                           <div className="text-[16px] font-bold">12</div>
                         </div>
                         <div>
                           <div className="text-[11px] text-text-tertiary mb-1">评论</div>
                           <div className="text-[16px] font-bold">8</div>
                         </div>
                      </div>
                    </div>
                  )}

               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
