import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// Add the state
if (!content.includes('isRecentChangesExpanded')) {
  content = content.replace(
    '  const [detailTab, setDetailTab] = useState<"总览" | "策略基线" | "执行批次" | "结果与复盘" | "变更记录">("总览");',
    '  const [detailTab, setDetailTab] = useState<"总览" | "策略基线" | "执行批次" | "结果与复盘" | "变更记录">("总览");\n  const [isRecentChangesExpanded, setIsRecentChangesExpanded] = useState(false);'
  );
}

// Replace the specific layout
const oldLayout = `{detailTab === "总览" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                   <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                         <BrainCircuit size={18} className="text-primary-600"/> AI 当前判断
                      </h3>
                      <p className="text-[14px] text-neutral-700 leading-relaxed bg-blue-50/40 p-5 rounded-xl border border-blue-100/50">
                        {currentProject.aiJudgment || "项目运转正常，暂无特殊判断。"}
                      </p>
                      
                      {currentProject.primaryActionText && (
                        <div className="mt-5 pt-5 border-t border-neutral-100 flex justify-end">
                           <button 
                             onClick={() => handleAction(currentProject.recommendedAction)}
                             className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-xl text-[14px] font-bold shadow-sm transition-all flex items-center gap-2"
                           >
                              {currentProject.primaryActionText} <ArrowRight size={16} />
                           </button>
                        </div>
                      )}
                   </div>

                   {currentProject.batches && currentProject.batches.length > 0 && (
                     <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:border-neutral-300 transition-colors cursor-pointer" onClick={() => setDetailTab("执行批次")}>
                        <div className="flex justify-between items-center mb-5">
                          <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                             <Layers size={18} className="text-blue-600"/> 当前批次：{currentProject.batches[0].name}
                          </h3>
                          <ChevronRight size={18} className="text-neutral-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-5">
                           <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                             <div className="text-[12px] text-neutral-500 font-bold mb-1.5">准备度</div>
                             <div className="text-[16px] font-bold text-neutral-900">{currentProject.batches[0].readiness}</div>
                           </div>
                           <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                             <div className="text-[12px] text-neutral-500 font-bold mb-1.5">已完成</div>
                             <div className="text-[16px] font-bold text-neutral-900">{currentProject.batches[0].progress}</div>
                           </div>
                        </div>
                        <div className="space-y-3 text-[13px]">
                           <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                             <span className="text-neutral-500">阻碍项</span>
                             <span className={\`font-medium flex items-center gap-1.5 \${currentProject.batches[0].anomaly !== '无' ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100' : 'text-neutral-900'}\`}>
                               {currentProject.batches[0].anomaly !== '无' && <AlertTriangle size={14}/>}
                               {currentProject.batches[0].anomaly}
                             </span>
                           </div>
                           <div className="flex justify-between items-center py-2">
                             <span className="text-neutral-500">下一检查点</span>
                             <span className="font-bold text-neutral-900">{currentProject.batches[0].nextCheck}</span>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                <div className="col-span-1">
                   <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm h-full">
                      <h3 className="text-[15px] font-bold text-neutral-900 mb-5 flex items-center gap-2">
                         <History size={18} className="text-neutral-400"/> 最近变化
                      </h3>
                      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                         {currentProject.recentChanges && currentProject.recentChanges.map((change: any, idx: number) => (
                           <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                             <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-neutral-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 mt-1 relative z-10" />
                             <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-3">
                               <div className="flex flex-col mb-1">
                                 <div className="text-[13px] font-bold text-neutral-900">{change.action}</div>
                                 <time className="text-[11px] text-neutral-400 font-medium">{change.time} • {change.user}</time>
                               </div>
                               <div className="text-[12px] text-neutral-600 leading-relaxed bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 mt-1">{change.desc}</div>
                             </div>
                           </div>
                         ))}
                         {(!currentProject.recentChanges || currentProject.recentChanges.length === 0) && (
                           <div className="text-[13px] text-neutral-400 pl-6">暂无变化记录</div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}`;

const newLayout = `{detailTab === "总览" && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="space-y-6">
                   <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                         <BrainCircuit size={18} className="text-primary-600"/> AI 当前判断
                      </h3>
                      <p className="text-[14px] text-neutral-700 leading-relaxed bg-blue-50/40 p-5 rounded-xl border border-blue-100/50">
                        {currentProject.aiJudgment || "项目运转正常，暂无特殊判断。"}
                      </p>
                      
                      {currentProject.primaryActionText && (
                        <div className="mt-5 pt-5 border-t border-neutral-100 flex justify-end">
                           <button 
                             onClick={() => handleAction(currentProject.recommendedAction)}
                             className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-xl text-[14px] font-bold shadow-sm transition-all flex items-center gap-2"
                           >
                              {currentProject.primaryActionText} <ArrowRight size={16} />
                           </button>
                        </div>
                      )}
                   </div>

                   {currentProject.batches && currentProject.batches.length > 0 && (
                     <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:border-neutral-300 transition-colors cursor-pointer" onClick={() => setDetailTab("执行批次")}>
                        <div className="flex justify-between items-center mb-5">
                          <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                             <Layers size={18} className="text-blue-600"/> 当前批次：{currentProject.batches[0].name}
                          </h3>
                          <ChevronRight size={18} className="text-neutral-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-5">
                           <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                             <div className="text-[12px] text-neutral-500 font-bold mb-1.5">准备度</div>
                             <div className="text-[16px] font-bold text-neutral-900">{currentProject.batches[0].readiness}</div>
                           </div>
                           <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                             <div className="text-[12px] text-neutral-500 font-bold mb-1.5">已完成</div>
                             <div className="text-[16px] font-bold text-neutral-900">{currentProject.batches[0].progress}</div>
                           </div>
                        </div>
                        <div className="space-y-3 text-[13px]">
                           <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                             <span className="text-neutral-500">阻碍项</span>
                             <span className={\`font-medium flex items-center gap-1.5 \${currentProject.batches[0].anomaly !== '无' ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100' : 'text-neutral-900'}\`}>
                               {currentProject.batches[0].anomaly !== '无' && <AlertTriangle size={14}/>}
                               {currentProject.batches[0].anomaly}
                             </span>
                           </div>
                           <div className="flex justify-between items-center py-2">
                             <span className="text-neutral-500">下一检查点</span>
                             <span className="font-bold text-neutral-900">{currentProject.batches[0].nextCheck}</span>
                           </div>
                        </div>
                     </div>
                   )}
               </div>

               <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setIsRecentChangesExpanded(!isRecentChangesExpanded)}
                    className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                  >
                    <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                       <History size={18} className="text-neutral-400"/> 最近变化进程
                    </h3>
                    <motion.div
                      animate={{ rotate: isRecentChangesExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={18} className="text-neutral-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isRecentChangesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                         <div className="p-6 pt-2 border-t border-neutral-100">
                           <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                             {currentProject.recentChanges && currentProject.recentChanges.map((change: any, idx: number) => (
                               <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                 <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-neutral-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 mt-1 relative z-10" />
                                 <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-4">
                                   <div className="flex flex-col mb-1.5">
                                     <div className="text-[14px] font-bold text-neutral-900">{change.action}</div>
                                     <time className="text-[12px] text-neutral-400 font-medium">{change.time} • {change.user}</time>
                                   </div>
                                   <div className="text-[13px] text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100 mt-2">{change.desc}</div>
                                 </div>
                               </div>
                             ))}
                             {(!currentProject.recentChanges || currentProject.recentChanges.length === 0) && (
                               <div className="text-[13px] text-neutral-400 pl-8">暂无变化记录</div>
                             )}
                           </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          )}`;

if (content.indexOf(oldLayout) !== -1) {
  content = content.replace(oldLayout, newLayout);
  fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
  console.log("Successfully patched ProjectCenter.tsx");
} else {
  console.log("Could not find the target layout in ProjectCenter.tsx");
}
