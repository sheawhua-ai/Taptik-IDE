import React, { useState } from "react";
import { Layers, Calendar, QrCode, PlayCircle, Clock, AlertTriangle, X, Check, Search, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectOrchestration({ project }: { project: any }) {
  const [view, setView] = useState<"stage" | "batch">("batch");
  const [activeBatch, setActiveBatch] = useState<any>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const batches = [
    { 
      id: "b1", name: "首轮内测铺量", pack: "幼犬换粮体验包 v1", targetNotes: 20, 
      kocCount: 15, kosCount: 5, dateRange: "03.01 - 03.07",
      readiness: "100%", generated: 15, published: 5, exceptions: 3, nextCheck: "发布结果回收"
    },
    { 
      id: "b2", name: "词包扩展测试", pack: "幼犬肠胃调理包 v2", targetNotes: 10, 
      kocCount: 10, kosCount: 0, dateRange: "03.08 - 03.15",
      readiness: "60%", generated: 0, published: 0, exceptions: 0, nextCheck: "KOC招募"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12 relative">
      {!activeBatch ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button onClick={() => setView("stage")} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${view === "stage" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>阶段视图</button>
              <button onClick={() => setView("batch")} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${view === "batch" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>批次视图</button>
            </div>
            <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">
              + 新增批次
            </button>
          </div>

          {view === "batch" ? (
            <div className="space-y-4">
              {batches.map(b => (
                <div key={b.id} onClick={() => setActiveBatch(b)} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm cursor-pointer hover:border-neutral-300 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[16px] font-bold text-neutral-900 mb-1">{b.name}</h3>
                      <div className="text-[12px] text-neutral-500 flex items-center gap-3">
                         <span className="flex items-center gap-1"><Layers size={12}/> {b.pack}</span>
                         <span className="flex items-center gap-1"><Calendar size={12}/> {b.dateRange}</span>
                      </div>
                    </div>
                    <div className="text-[12px] bg-neutral-100 px-2 py-1 rounded text-neutral-600 font-medium">
                      下步: {b.nextCheck}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">目标篇数</div>
                       <div className="text-[15px] font-bold">{b.targetNotes}</div>
                     </div>
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">参与人数</div>
                       <div className="text-[15px] font-bold">{b.kocCount} KOC / {b.kosCount} 品牌号</div>
                     </div>
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">已生成/已发布</div>
                       <div className="text-[15px] font-bold">{b.generated} / {b.published}</div>
                     </div>
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">异常</div>
                       <div className={`text-[15px] font-bold ${b.exceptions > 0 ? "text-red-600" : ""}`}>{b.exceptions}</div>
                     </div>
                     <div className="flex justify-end items-center">
                       <button className="text-[13px] font-bold text-primary-600">查看详情 &rarr;</button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {["策略确认", "筹备就绪", "内容与素材", "发布执行"].map((stage, i) => (
                <div key={stage} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-[15px] font-bold text-neutral-900">{i+1}. {stage}</h3>
                     {i === 2 && <span className="text-[12px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">进行中</span>}
                   </div>
                   <div className="text-[13px] text-neutral-500 mb-4">目标：完成KOC素材收集与审核</div>
                   <div className="flex justify-between items-center bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                     <div className="flex gap-8">
                       <div>
                         <div className="text-[11px] text-neutral-500 mb-1">当前进度</div>
                         <div className="text-[14px] font-bold">15/20</div>
                       </div>
                       <div>
                         <div className="text-[11px] text-neutral-500 mb-1">阻断项</div>
                         <div className="text-[14px] font-bold text-red-600">2个素材不合格</div>
                       </div>
                     </div>
                     <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">
                       去执行中心处理
                     </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <BatchDetail batch={activeBatch} onBack={() => setActiveBatch(null)} onQrClick={() => setQrOpen(true)} />
      )}

      {/* QR Code Drawer */}
      <AnimatePresence>
        {qrOpen && (
           <div className="fixed inset-0 z-50 flex justify-end">
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setQrOpen(false)} />
             <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               className="w-[450px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
             >
               <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
                 <h2 className="text-[18px] font-bold">KOC 参与二维码</h2>
                 <button onClick={() => setQrOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
                   <X size={20} />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                  <div className="w-48 h-48 bg-white border-2 border-neutral-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <QrCode size={120} className="text-neutral-900" />
                  </div>
                  <div className="flex gap-3 mb-8">
                    <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold">下载图片</button>
                    <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold">复制链接</button>
                  </div>
                  
                  <div className="w-full space-y-4">
                     <div className="bg-white p-4 rounded-xl border border-neutral-200">
                       <div className="text-[12px] text-neutral-500 mb-2">当前配置</div>
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-[13px] font-bold text-neutral-900">使用内容包</span>
                         <span className="text-[13px] text-primary-600">幼犬换粮体验包 v1</span>
                       </div>
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-[13px] font-bold text-neutral-900">每日开放名额</span>
                         <span className="text-[13px]">5 人</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] font-bold text-neutral-900">有效期</span>
                         <span className="text-[13px]">至 2024-03-07</span>
                       </div>
                     </div>
                     <div className="flex gap-3">
                       <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold">暂停领取</button>
                       <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold">修改配额</button>
                     </div>
                  </div>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BatchDetail({ batch, onBack, onQrClick }: { batch: any, onBack: () => void, onQrClick: () => void }) {
  return (
    <div className="space-y-6">
       <button onClick={onBack} className="text-[13px] font-bold text-neutral-500 hover:text-neutral-900 mb-4 inline-block">&larr; 返回列表</button>
       
       <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
         <div className="flex justify-between items-start mb-6">
           <div>
             <h2 className="text-[20px] font-bold text-neutral-900 mb-2">{batch.name}</h2>
             <p className="text-[13px] text-neutral-500">日期：{batch.dateRange} · 负责人：张三</p>
           </div>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold hover:bg-neutral-50">暂停批次</button>
             <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">去执行中心</button>
           </div>
         </div>
       </div>

       <div className="grid grid-cols-2 gap-6">
         {/* KOC */}
         <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[16px] font-bold">KOC 参与安排</h3>
             <button onClick={onQrClick} className="text-[13px] text-primary-600 font-bold flex items-center gap-1 hover:underline">
               <QrCode size={14} /> 查看二维码
             </button>
           </div>
           <div className="space-y-4">
             <div className="grid grid-cols-3 gap-4 mb-4">
               <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                 <div className="text-[11px] text-neutral-500 mb-1">每日名额</div>
                 <div className="text-[18px] font-bold">5</div>
               </div>
               <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                 <div className="text-[11px] text-neutral-500 mb-1">已完成</div>
                 <div className="text-[18px] font-bold text-emerald-600">10</div>
               </div>
               <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                 <div className="text-[11px] text-neutral-500 mb-1">剩余</div>
                 <div className="text-[18px] font-bold">5</div>
               </div>
             </div>
             <div className="text-[13px] text-neutral-600 flex justify-between items-center py-2 border-b border-neutral-100">
               <span>已提交素材人数</span> <strong>12 人</strong>
             </div>
             <div className="text-[13px] text-neutral-600 flex justify-between items-center py-2 border-b border-neutral-100">
               <span>已获取AI笔记人数</span> <strong>11 人</strong>
             </div>
           </div>
         </div>

         {/* Dependencies */}
         <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
           <h3 className="text-[16px] font-bold mb-6">批次依赖项</h3>
           <div className="space-y-3">
             {[
               { name: "内容包", val: "幼犬换粮体验包 v1", ok: true },
               { name: "问卷", val: "换粮基本情况调研", ok: true },
               { name: "素材模板", val: "狗粮实拍要求", ok: true },
               { name: "审核人", val: "张三", ok: true },
             ].map((dep, i) => (
               <div key={i} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl border border-neutral-100 cursor-pointer hover:border-primary-200">
                 <span className="text-[13px] text-neutral-500">{dep.name}</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[13px] font-bold text-neutral-900">{dep.val}</span>
                   {dep.ok ? <Check size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-red-500" />}
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
    </div>
  )
}
