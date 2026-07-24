import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const newTarget = `      case "create_project":
        return (
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-[16px] text-neutral-900">新建营销项目</h3>
                {createProjectStep === 2 && (
                  <span className="text-[12px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-medium">第 2 步: 策略确认</span>
                )}
              </div>
              <button onClick={() => {
                setDrawerType(null);
                setCreateProjectStep(1);
                setCreateKbStatus("idle");
              }} className="text-neutral-400 hover:text-neutral-700 transition-colors"><X size={18} /></button>
            </div>
            
            {createProjectStep === 1 ? (
              <>
                <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-6">
                  
                  <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><Target size={16} className="text-primary-600"/> 1. 明确营销意图</h4>
                    <div>
                      <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">项目名称</label>
                      <input type="text" id="new-project-name" defaultValue="幼犬换粮搜索卡位第三轮" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">核心目标</label>
                      <textarea id="new-project-target" rows={2} defaultValue="提升幼犬肠胃敏感人群的转化率" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm resize-none"></textarea>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><Sparkles size={16} className="text-primary-600"/> 2. 策略生成方式</h4>
                      <button className="text-[12px] font-bold text-primary-600 flex items-center gap-1 hover:bg-primary-50 px-2 py-1 rounded-md transition-colors" title="和策略专家探讨">
                        <MessageSquare size={14} /> 探讨
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => {
                          setCreateStrategyType("auto");
                          setCreateKbStatus("checking");
                          setTimeout(() => setCreateKbStatus("missing"), 1000);
                        }}
                        className={\`border rounded-xl p-4 cursor-pointer transition-all \${createStrategyType === "auto" ? "border-primary-200 bg-primary-50/50 ring-1 ring-primary-100 shadow-sm" : "border-neutral-200 bg-white hover:bg-neutral-50"}\`}
                      >
                         <div className="font-bold text-[13px] text-neutral-900 mb-1">AI自动策略</div>
                         <p className="text-[11px] text-neutral-500">基于全网数据与画像自动生成最佳策略</p>
                      </div>
                      <div 
                        onClick={() => {
                           setCreateStrategyType("history");
                           setCreateKbStatus("idle");
                        }}
                        className={\`border rounded-xl p-4 cursor-pointer transition-all \${createStrategyType === "history" ? "border-primary-200 bg-primary-50/50 ring-1 ring-primary-100 shadow-sm" : "border-neutral-200 bg-white hover:bg-neutral-50"}\`}
                      >
                         <div className="font-bold text-[13px] text-neutral-900 mb-1">复用历史策略</div>
                         <p className="text-[11px] text-neutral-500">选择过往表现优秀的策略模板套用</p>
                      </div>
                    </div>
                    
                    {createStrategyType === "auto" && createKbStatus === "checking" && (
                      <div className="text-[12px] text-neutral-500 flex items-center gap-2 mt-2">
                        <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        正在检查所需知识库内容...
                      </div>
                    )}
                    
                    {createStrategyType === "auto" && createKbStatus === "missing" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col gap-2 mt-2">
                        <div className="flex items-start gap-2">
                           <ShieldAlert size={14} className="text-amber-600 shrink-0 mt-0.5" />
                           <div className="text-[12px] text-amber-800 font-medium">知识库不完整，可能影响策略生成质量</div>
                        </div>
                        <p className="text-[11px] text-amber-700 pl-6">系统检测到缺少「最新竞品评测数据」与「敏感期用户常见问答」。</p>
                        <div className="pl-6">
                           <button onClick={() => setCreateKbStatus("ok")} className="text-[11px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors">去补充知识库素材</button>
                        </div>
                      </div>
                    )}
                    
                    {createStrategyType === "auto" && createKbStatus === "ok" && (
                      <div className="text-[12px] text-emerald-600 flex items-center gap-1.5 mt-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                        <Check size={14} /> 知识库素材就绪，可生成高质量策略。
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><Activity size={16} className="text-primary-600"/> 3. 执行设置</h4>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3 text-[13px]">
                       <div className="flex justify-between items-center">
                         <span className="font-medium text-neutral-600">内容生产方式</span>
                         <span className="font-bold text-neutral-900">AI批量生成</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="font-medium text-neutral-600">异常处理机制</span>
                         <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">卡点需人工确认</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="font-medium text-neutral-600">目标账号</span>
                         <span className="font-bold text-neutral-900">全量店长号 (3个)</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-neutral-100 shrink-0 bg-white">
                   <div className="flex gap-3">
                     <button onClick={() => {
                        setDrawerType(null);
                        setCreateProjectStep(1);
                        setCreateKbStatus("idle");
                     }} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">取消</button>
                     <button onClick={() => { 
                       setCreateProjectStep(2);
                     }} className="flex-[2] py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">
                       生成项目策略
                     </button>
                   </div>
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Confirm Strategy */}
                <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                       <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2"><Sparkles size={16} className="text-primary-600"/> AI生成的策略草案</h4>
                       <span className="text-[11px] text-neutral-500">可手动修改内容</span>
                    </div>
                    <textarea 
                      value={createGeneratedStrategy}
                      onChange={(e) => setCreateGeneratedStrategy(e.target.value)}
                      rows={10} 
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-primary-500 shadow-sm resize-none leading-relaxed text-neutral-700"
                    />
                  </div>
                  
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                     <h4 className="text-[13px] font-bold text-blue-900 mb-2">下一步计划预览</h4>
                     <ul className="text-[12px] text-blue-800 space-y-1.5 list-disc pl-4">
                        <li>AI 将根据此策略生成 <strong>15篇</strong> 笔记内容草稿。</li>
                        <li>分配至 <strong>3个</strong> 店长号进行审核。</li>
                        <li>预计 2小时 内完成草稿生成，届时将提示您确认。</li>
                     </ul>
                  </div>
                </div>
                
                <div className="p-4 border-t border-neutral-100 shrink-0 bg-white">
                   <div className="flex gap-3">
                     <button onClick={() => setCreateProjectStep(1)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">返回修改</button>
                     <button onClick={() => { 
                      const name = (document.getElementById("new-project-name") as HTMLInputElement)?.value || "新营销项目";
                      const target = (document.getElementById("new-project-target") as HTMLTextAreaElement)?.value || "设定目标...";
                      const newId = \`new-\${Date.now()}\`;
                      setProjects([{
                        id: newId,
                        name: name,
                        status: "执行",
                        target: target,
                        blocker: "AI策略已确认，正在生成第一批内容草稿",
                        aiActionCard: null,
                        recommendedAction: "none",
                        pendingCount: 0
                      } as any, ...projects]);
                      setSelectedProjectId(newId);
                      setDrawerType(null);
                      setCreateProjectStep(1);
                      setCreateKbStatus("idle");
                     }} className="flex-[2] py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">
                       确认策略，开始自动执行
                     </button>
                   </div>
                </div>
              </>
            )}
          </div>
        );`;

if(content.includes('case "create_project":')) {
    const regex = /case "create_project":[\s\S]*?确认策略，创建并执行\s*<\/button>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*/;
    content = content.replace(regex, newTarget + "\n");
}
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
