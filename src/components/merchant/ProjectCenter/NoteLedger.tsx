import React, { useState } from "react";
import { Filter, Calendar, LayoutList, MoreHorizontal, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NoteLedger({ project }: { project: any }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activeNote, setActiveNote] = useState<any>(null);

  const notes = [
    { id: "n1", pack: "幼犬换粮体验包 v1", account: "小红薯582", type: "KOC", date: "2024-03-05", assetStatus: "已验收", contentStatus: "待审核", publishStatus: "待下发", dataStatus: "-", error: "待审核", pic: "张三" },
    { id: "n2", pack: "幼犬换粮体验包 v1", account: "待参与者领取", type: "KOC", date: "2024-03-06", assetStatus: "-", contentStatus: "-", publishStatus: "-", dataStatus: "-", error: "", pic: "-" },
    { id: "n3", pack: "官方宣发包", account: "店长号A", type: "品牌号", date: "2024-03-05", assetStatus: "无需", contentStatus: "已生成", publishStatus: "已发布", dataStatus: "观察中", error: "", pic: "李四" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-neutral-100 rounded-lg p-1">
          <button onClick={() => setView("list")} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${view === "list" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>列表视图</button>
          <button onClick={() => setView("calendar")} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${view === "calendar" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>日历视图</button>
        </div>
        <button className="p-2 bg-white border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
          <Filter size={16} />
        </button>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] text-neutral-500">
                <th className="p-4 font-medium">账号/参与者</th>
                <th className="p-4 font-medium">类型</th>
                <th className="p-4 font-medium">计划日期</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">异常</th>
                <th className="p-4 font-medium">负责人</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n, i) => (
                <tr key={i} onClick={() => setActiveNote(n)} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors text-[13px]">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{n.account}</div>
                    <div className="text-[11px] text-neutral-500 mt-1">{n.pack}</div>
                  </td>
                  <td className="p-4 text-neutral-600">{n.type}</td>
                  <td className="p-4 font-medium">{n.date}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[11px] text-neutral-400">素材</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded ${n.assetStatus === '已验收' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'}`}>{n.assetStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[11px] text-neutral-400">内容</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded ${n.contentStatus === '已生成' ? 'bg-emerald-100 text-emerald-700' : n.contentStatus === '待审核' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'}`}>{n.contentStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[11px] text-neutral-400">发布</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded ${n.publishStatus === '已发布' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'}`}>{n.publishStatus}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {n.error ? <span className="text-red-500 font-bold">{n.error}</span> : <span className="text-neutral-400">-</span>}
                  </td>
                  <td className="p-4 text-neutral-600">{n.pic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex items-center justify-center h-64 text-neutral-400">
          <Calendar size={32} className="mb-2" />
          <p>日历视图</p>
        </div>
      )}

      {/* Note Detail Drawer */}
      <AnimatePresence>
        {activeNote && (
           <div className="fixed inset-0 z-50 flex justify-end">
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setActiveNote(null)} />
             <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
             >
               <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
                 <h2 className="text-[18px] font-bold">笔记详情</h2>
                 <button onClick={() => setActiveNote(null)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
                   <X size={20} />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  <div className="bg-white p-4 rounded-xl border border-neutral-200">
                    <div className="text-[14px] font-bold text-neutral-900 mb-4 border-b pb-2">基本信息</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] text-neutral-500 mb-1">参与者/账号</div>
                        <div className="text-[13px] font-bold">{activeNote.account}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-neutral-500 mb-1">计划发布日</div>
                        <div className="text-[13px] font-bold">{activeNote.date}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[11px] text-neutral-500 mb-1">使用内容包</div>
                        <div className="text-[13px] font-bold text-primary-600">{activeNote.pack}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-neutral-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <div className="text-[14px] font-bold text-neutral-900">内容稿件</div>
                      <span className={`text-[11px] px-2 py-0.5 rounded ${activeNote.contentStatus === '待审核' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'}`}>{activeNote.contentStatus}</span>
                    </div>
                    {activeNote.contentStatus === '待审核' ? (
                      <div className="text-[13px] text-neutral-600">
                        <p className="mb-2"><strong>[标题]</strong> 幼犬换粮总是拉肚子？试试这招！</p>
                        <p className="line-clamp-3">我家金毛3个月大，最近换粮总是软便，愁死我了。后来听医生建议尝试了...</p>
                        <button className="mt-4 w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">
                          去执行中心审核
                        </button>
                      </div>
                    ) : (
                      <div className="text-[13px] text-neutral-400">暂无内容</div>
                    )}
                  </div>

                  {activeNote.publishStatus === '已发布' && (
                    <div className="bg-white p-4 rounded-xl border border-neutral-200">
                      <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <div className="text-[14px] font-bold text-neutral-900">发布数据</div>
                        <a href="#" className="text-[12px] text-primary-600 flex items-center gap-1 hover:underline"><ExternalLink size={12}/> 查看小红书</a>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                         <div>
                           <div className="text-[11px] text-neutral-500 mb-1">阅读</div>
                           <div className="text-[16px] font-bold">1.2k</div>
                         </div>
                         <div>
                           <div className="text-[11px] text-neutral-500 mb-1">点赞</div>
                           <div className="text-[16px] font-bold">45</div>
                         </div>
                         <div>
                           <div className="text-[11px] text-neutral-500 mb-1">收藏</div>
                           <div className="text-[16px] font-bold">12</div>
                         </div>
                         <div>
                           <div className="text-[11px] text-neutral-500 mb-1">评论</div>
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
