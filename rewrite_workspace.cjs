const fs = require('fs');
const content = fs.readFileSync('src/components/merchant/CreateProjectWorkstation.tsx', 'utf8');

const splitIndex = content.indexOf('function DraftWorkspace(');
const topPart = content.substring(0, splitIndex);

const newContent = topPart + `function DraftWorkspace({ onBack, onCreate }: any) {
  const [activeStep, setActiveStep] = useState<"plan" | "schedule" | "check">("plan");
  const [planConfirmed, setPlanConfirmed] = useState(false);
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false);
  
  const [drawer, setDrawer] = useState<"ai_adjust" | "basis" | "schedule_adjust" | "check_blocker" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [draft, setDraft] = useState({
    name: "高频提问「换粮」应对专场",
    problem: "换粮内容有收藏，但咨询很少。准备做一轮店长号和消费者共创，两周内完成，预算5000元。希望验证真实换粮过程和专业解释能不能提升有效咨询。",
    cycle: "12-16天",
    budget: 5000,
    expectedResults: {
      delivery: "23篇",
      content: "300+ 收藏",
      conversion: "15+ 有效私信咨询"
    },
    recommendedStrategy: {
      coreAssumption: "真实的换粮日记 + 店长的干货背书，能解决用户的最后顾虑",
      path: "KOC真实换粮记录 (产生共鸣) -> 店长号专业答疑 (解除顾虑) -> 引导后台咨询 (促转化)",
      validationMethod: "先用5位KOC发布内容，如果在3天内单篇收藏均突破10，或总共带来3次有效咨询，即视为验证成功，继续铺满20人。",
      risks: "KOC如果家里的猫本身肠胃不好，可能在换粮期间出现应激，导致负面素材。"
    },
    schedule: {
      prepStart: "10月24日",
      firstPublish: "10月27日",
      execEnd: "11月10日",
      obsWindow: "至11月15日"
    },
    koc: {
      planCount: 20,
      dailyRecruit: 5,
      firstBatch: 5,
      contentPack: "换粮记录模板包",
      form: "宠物肠胃状况问卷",
      assetTask: "换粮3天实拍任务"
    },
    kos: [
      { name: "店长号A", notes: 2, date: "10月29日", direction: "科学换粮指南", method: "人工下发", owner: "张三", hasDevice: false }
    ],
    brand: [
      { name: "官方主号", notes: 1, date: "10月30日", direction: "活动宣发", method: "自动发布", owner: "品牌组" }
    ],
    check: {
      blockers: 1,
      pending: 2
    }
  });

  const handleConfirmPlan = () => {
    setPlanConfirmed(true);
    setActiveStep("schedule");
  };

  const handleConfirmSchedule = () => {
    setScheduleConfirmed(true);
    setActiveStep("check");
  };

  const handleApplyPlanAdjustment = () => {
    setPlanConfirmed(false);
    setScheduleConfirmed(false);
    setDrawer(null);
  };
  
  const handleApplyScheduleAdjustment = () => {
    setScheduleConfirmed(false);
    setDrawer(null);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      {/* 顶部导航 */}
      <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
             <h1 className="font-bold text-[15px] text-neutral-900">{draft.name}</h1>
             <span className="text-[12px] text-neutral-400">刚刚已保存</span>
          </div>
        </div>
        
        {/* 三段式进度指示器 */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button 
            onClick={() => setActiveStep("plan")}
            className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors \${activeStep === "plan" ? 'bg-neutral-900 text-white' : planConfirmed ? 'text-emerald-600 bg-emerald-50' : 'text-neutral-500 hover:bg-neutral-100'}\`}
          >
            {planConfirmed ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            方案：{planConfirmed ? '已确认' : '待确认'}
          </button>
          <div className="w-4 h-px bg-neutral-300" />
          <button 
            onClick={() => setActiveStep("schedule")}
            className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors \${activeStep === "schedule" ? 'bg-neutral-900 text-white' : scheduleConfirmed ? 'text-emerald-600 bg-emerald-50' : planConfirmed ? 'text-neutral-500 hover:bg-neutral-100' : 'text-neutral-300'}\`}
          >
            {scheduleConfirmed ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            排期与分配：{scheduleConfirmed ? '已确认' : '待确认'}
          </button>
          <div className="w-4 h-px bg-neutral-300" />
          <button 
            onClick={() => setActiveStep("check")}
            className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors \${activeStep === "check" ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}\`}
          >
            <AlertTriangle size={14} className={activeStep === "check" ? 'text-amber-300' : 'text-amber-500'} />
            开工检查：1项阻断, 2项待办
          </button>
        </div>

        <div>
           <button onClick={onBack} className="text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-100">
             保存并退出
           </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto relative bg-neutral-50/50">
         <div className="max-w-4xl mx-auto py-8 px-6 pb-32">
            {activeStep === "plan" && (
              <PlanTab 
                draft={draft} 
                onOpenAI={() => setDrawer("ai_adjust")} 
                onOpenBasis={() => setDrawer("basis")} 
              />
            )}
            {activeStep === "schedule" && (
              <ScheduleTab 
                draft={draft} 
              />
            )}
            {activeStep === "check" && (
              <CheckTab 
                draft={draft} 
                onOpenBlocker={() => setDrawer("check_blocker")}
              />
            )}
         </div>
      </div>

      {/* 底部固定操作栏 */}
      <div className="h-16 bg-white border-t border-neutral-200 fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex justify-center">
        <div className="max-w-4xl w-full px-6 flex items-center justify-between">
          {activeStep === "plan" && (
            <>
              <button 
                onClick={() => setDrawer("ai_adjust")}
                className="text-[14px] font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                调整
              </button>
              <button 
                onClick={handleConfirmPlan}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                确认方案并继续 <ArrowRight size={16} />
              </button>
            </>
          )}

          {activeStep === "schedule" && (
            <>
              <button 
                onClick={() => setActiveStep("plan")}
                className="text-[14px] font-bold text-neutral-500 hover:text-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={16}/> 返回方案
              </button>
              <button 
                onClick={() => setDrawer("schedule_adjust")}
                className="text-[14px] font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                调整排期
              </button>
              <button 
                onClick={handleConfirmSchedule}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                确认排期并检查开工条件 <ArrowRight size={16} />
              </button>
            </>
          )}

          {activeStep === "check" && (
            <>
              <button 
                onClick={() => setActiveStep("schedule")}
                className="text-[14px] font-bold text-neutral-500 hover:text-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={16}/> 返回排期
              </button>
              <div />
              {draft.check.blockers > 0 ? (
                <button 
                  onClick={() => setDrawer("check_blocker")}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  处理1项阻断
                </button>
              ) : draft.check.pending > 0 ? (
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  确认待办并创建项目 <Sparkles size={16} />
                </button>
              ) : (
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  创建项目 <Sparkles size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 弹窗/抽屉区 */}
      {drawer === "ai_adjust" && <AIAdjustDrawer onClose={() => setDrawer(null)} onApply={handleApplyPlanAdjustment} />}
      {drawer === "basis" && <BasisDrawer onClose={() => setDrawer(null)} />}
      {drawer === "schedule_adjust" && <ScheduleAdjustDrawer onClose={() => setDrawer(null)} onApply={handleApplyScheduleAdjustment} draft={draft} />}
      {drawer === "check_blocker" && <CheckBlockerDrawer onClose={() => setDrawer(null)} />}
      
      {showConfirm && <CreateConfirmModal draft={draft} onClose={() => setShowConfirm(false)} onConfirm={onCreate} />}
    </div>
  );
}

function PlanTab({ draft, onOpenAI, onOpenBasis }: any) {
  const [showOtherPlans, setShowOtherPlans] = useState(false);
  const [showGenProcess, setShowGenProcess] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
         <h2 className="text-[20px] font-extrabold text-neutral-900 mb-2">{draft.name}</h2>
         <p className="text-[14px] text-neutral-600 mb-6 pb-6 border-b border-neutral-100">{draft.problem}</p>

         <div className="flex items-start gap-8 text-[13px] mb-8 bg-neutral-50/50 rounded-xl px-6 py-4 border border-neutral-100 w-fit">
             <div>
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">建议周期：{draft.cycle}</div>
               <div className="text-neutral-500 text-[12px]">依据：近2个同类项目平均12–16天</div>
             </div>
             <div className="w-px h-8 bg-neutral-200" />
             <div>
               <div className="flex items-center gap-1 font-bold text-neutral-900 mb-1">建议预算：¥ {draft.budget}</div>
               <div className="text-neutral-500 text-[12px]">依据：20位KOC激励+素材准备+预留10%</div>
             </div>
             <div className="w-px h-8 bg-neutral-200" />
             <div>
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">预计 {draft.expectedResults.delivery}</div>
               <div className="text-neutral-500 text-[12px]">KOC 20篇 + 店长号2篇 + 品牌主号1篇</div>
             </div>
         </div>

         <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-primary-600 mb-2">
                 核心假设
                 <button onClick={onOpenBasis} className="text-primary-500 hover:text-primary-700 underline text-[12px] flex items-center gap-1"><Search size={12}/>依据</button>
              </div>
              <div className="text-[14px] font-bold text-primary-900 bg-primary-50 p-4 rounded-xl border border-primary-100">{draft.recommendedStrategy.coreAssumption}</div>
            </div>
            <div>
              <div className="text-[12px] font-bold text-neutral-500 mb-2">推荐运营路径</div>
              <div className="flex flex-col gap-2 text-[13px] font-bold text-neutral-900 mt-3">
                {draft.recommendedStrategy.path.split(' -> ').map((p:string, i:number, arr:any[]) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-500">{i+1}</div>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-2 mt-4 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-8">
              <div>
                <div className="text-[12px] font-bold text-neutral-500 mb-2">验证方式</div>
                <div className="text-[14px] font-medium text-neutral-800">{draft.recommendedStrategy.validationMethod}</div>
              </div>
              <div>
                <div className="text-[12px] font-bold text-neutral-500 mb-2">主要风险</div>
                <div className="text-[14px] font-medium text-amber-700 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                  {draft.recommendedStrategy.risks}
                </div>
              </div>
            </div>
         </div>
      </div>

      {/* 折叠区：其他可选方案 */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowOtherPlans(!showOtherPlans)}
          className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
        >
          <span className="text-[14px] font-bold text-neutral-700 flex items-center gap-2">
            其他可选方案 (2个)
          </span>
          {showOtherPlans ? <ChevronUp size={16} className="text-neutral-400"/> : <ChevronDown size={16} className="text-neutral-400"/>}
        </button>
        {showOtherPlans && (
          <div className="p-6 border-t border-neutral-100 space-y-4">
            <div className="p-4 bg-white border border-neutral-200 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                 <div className="font-bold text-[14px] text-neutral-900">重型干货路线</div>
                 <button className="text-[12px] font-bold text-primary-600 hover:underline">切换为此方案</button>
              </div>
              <div className="text-[12px] text-neutral-500 mb-2">适用条件：需有极强的医生/专家背书素材。</div>
              <div className="text-[13px] text-neutral-700"><span className="font-bold">最大差异：</span>跳过KOC铺量，直接用3-5个高粉专业宠物医生号做深度科普。</div>
            </div>
            <div className="p-4 bg-white border border-neutral-200 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                 <div className="font-bold text-[14px] text-neutral-900">促销转化路线</div>
                 <button className="text-[12px] font-bold text-primary-600 hover:underline">切换为此方案</button>
              </div>
              <div className="text-[12px] text-neutral-500 mb-2">适用条件：配合大促节点，有极强价格优势。</div>
              <div className="text-[13px] text-neutral-700"><span className="font-bold">最大差异：</span>不强调科学过程，全靠达人发放专属优惠券，短平快转化。</div>
            </div>
          </div>
        )}
      </div>

      {/* 折叠区：生成过程 */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowGenProcess(!showGenProcess)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <span className="text-[13px] font-bold text-neutral-500 flex items-center gap-2">
            <Cpu size={14}/> 这版方案如何生成
          </span>
          {showGenProcess ? <ChevronUp size={14} className="text-neutral-400"/> : <ChevronDown size={14} className="text-neutral-400"/>}
        </button>
        {showGenProcess && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 text-[12px] text-neutral-600 space-y-3">
             <div><span className="font-bold text-neutral-800">调用能力：</span>需求分析、历史项目总结、策略生成、开工条件推导</div>
             <div><span className="font-bold text-neutral-800">数据范围：</span>3个同类KOC项目、20条产品知识库、当前资产余额</div>
             <div><span className="font-bold text-neutral-800">推理摘要：</span>由于当前目标是提升转化，且之前已有一定收藏基础，说明存在“信任临界点”。采用KOC真实感+店长专业度双管齐下是转化率最高的路径。</div>
             <div><span className="font-bold text-neutral-800">未采用信息：</span>用户提交了一份关于“包装设计”的文档，因与本次传播目标无关，已忽略。</div>
             <div className="pt-2 text-neutral-400">版本生成时间：2026-07-27 21:15</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleTab({ draft }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-8">
             <div><div className="text-neutral-500 mb-1">筹备开始日</div><div className="font-bold text-[15px]">{draft.schedule.prepStart}</div></div>
             <div className="w-12 h-px bg-neutral-200 relative"><ChevronRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-300"/></div>
             <div><div className="text-neutral-500 mb-1">首批发布日期</div><div className="font-bold text-primary-600 text-[15px]">{draft.schedule.firstPublish}</div></div>
             <div className="w-12 h-px bg-neutral-200 relative"><ChevronRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-300"/></div>
             <div><div className="text-neutral-500 mb-1">执行结束日</div><div className="font-bold text-[15px]">{draft.schedule.execEnd}</div></div>
          </div>
          <div className="text-right">
             <div className="text-neutral-500 mb-1">观察窗口</div>
             <div className="font-bold text-[15px]">{draft.schedule.obsWindow}</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[13px] pt-6 border-t border-neutral-100">
           <div className="flex items-center gap-2"><span className="text-neutral-500">总预算:</span> <span className="font-bold text-[14px]">¥{draft.budget}</span></div>
           <div className="flex items-center gap-2"><span className="text-neutral-500">预计笔记:</span> <span className="font-bold text-[14px]">{draft.expectedResults.delivery}</span></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* KOC */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[15px] text-neutral-900"><Users size={16} className="text-neutral-500"/> KOC消费者共创</div>
            <div className="text-[13px] font-bold bg-white border border-neutral-200 px-3 py-1 rounded-lg">计划 {draft.koc.planCount} 人</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 text-[13px] mb-6">
               <div><div className="text-neutral-500 mb-1">每日招募</div><div className="font-bold text-neutral-900">{draft.koc.dailyRecruit} 人</div></div>
               <div><div className="text-neutral-500 mb-1">首批验证</div><div className="font-bold text-neutral-900">{draft.koc.firstBatch} 人</div></div>
               <div><div className="text-neutral-500 mb-1">执行日期</div><div className="font-bold text-neutral-900">{draft.schedule.firstPublish}起</div></div>
            </div>
            <div className="flex flex-wrap gap-3 text-[13px]">
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-neutral-700">
                <FileText size={14} className="text-neutral-400"/> 内容包：{draft.koc.contentPack}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-neutral-700">
                <ClipboardList size={14} className="text-neutral-400"/> 问卷：{draft.koc.form}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-neutral-700">
                <Camera size={14} className="text-neutral-400"/> 素材任务：{draft.koc.assetTask}
              </div>
            </div>
          </div>
        </div>

        {/* 店长号 & 品牌号合集展示，紧凑列表 */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
            <div className="flex items-center gap-2 font-bold text-[15px] text-neutral-900"><CheckCircle2 size={16} className="text-neutral-500"/> 自有号矩阵</div>
          </div>
          <div className="divide-y divide-neutral-100">
            {draft.kos.map((acc:any, i:number) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[14px]">KOS</div>
                   <div>
                     <div className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                       {acc.name} 
                       <span className="text-[12px] font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">所有者: {acc.owner}</span>
                     </div>
                     <div className="text-[12px] text-neutral-500 mt-1">{acc.direction} · {acc.notes}篇 · {acc.method}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-[13px] font-bold text-neutral-900">{acc.date}发布</div>
                   {!acc.hasDevice && <div className="text-[12px] text-amber-600 mt-1 flex items-center gap-1 justify-end"><AlertTriangle size={12}/>缺执行设备</div>}
                 </div>
              </div>
            ))}
            {draft.brand.map((acc:any, i:number) => (
              <div key={'brand'+i} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[14px]">B</div>
                   <div>
                     <div className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                       {acc.name}
                       <span className="text-[12px] font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">所有者: {acc.owner}</span>
                     </div>
                     <div className="text-[12px] text-neutral-500 mt-1">{acc.direction} · {acc.notes}篇 · {acc.method}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-[13px] font-bold text-neutral-900">{acc.date}发布</div>
                   <div className="text-[12px] text-emerald-600 mt-1 flex items-center gap-1 justify-end"><Check size={12}/>可自动分发</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckTab({ draft, onOpenBlocker }: any) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
            <th className="font-bold py-4 px-6 w-[120px]">状态</th>
            <th className="font-bold py-4 px-6">检查事项</th>
            <th className="font-bold py-4 px-6">影响</th>
            <th className="font-bold py-4 px-6 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg border border-red-100 flex items-center w-fit gap-1.5"><AlertTriangle size={14}/> 阻断</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">店长号A 缺少执行设备</td>
            <td className="py-4 px-6 text-neutral-500">无法下发发布任务</td>
            <td className="py-4 px-6 text-right"><button onClick={onOpenBlocker} className="text-[13px] font-bold text-primary-600 hover:underline">去完善</button></td>
          </tr>
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-100 flex items-center w-fit gap-1.5"><Clock size={14}/> 待办</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">首发内容图文素材不足</td>
            <td className="py-4 px-6 text-neutral-500">将自动生成【素材筹备】任务</td>
            <td className="py-4 px-6 text-right"><span className="text-[13px] text-neutral-400">建项后生成</span></td>
          </tr>
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-100 flex items-center w-fit gap-1.5"><Clock size={14}/> 待办</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">KOC 招募表单未最终确认</td>
            <td className="py-4 px-6 text-neutral-500">将自动生成【问卷配置】任务</td>
            <td className="py-4 px-6 text-right"><span className="text-[13px] text-neutral-400">建项后生成</span></td>
          </tr>
          <tr className="hover:bg-neutral-50 opacity-70 transition-colors">
            <td className="py-4 px-6"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-100 flex items-center w-fit gap-1.5"><Check size={14}/> 已准备</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">项目可用资金余额充足</td>
            <td className="py-4 px-6 text-neutral-500">-</td>
            <td className="py-4 px-6 text-right">-</td>
          </tr>
          <tr className="hover:bg-neutral-50 opacity-70 transition-colors">
            <td className="py-4 px-6"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-100 flex items-center w-fit gap-1.5"><Check size={14}/> 已准备</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">商家知识与合规词库可用</td>
            <td className="py-4 px-6 text-neutral-500">-</td>
            <td className="py-4 px-6 text-right">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function AIAdjustDrawer({ onClose, onApply }: any) {
  const [val, setVal] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold text-neutral-900">调整方案</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all">
             <textarea 
               value={val}
               onChange={e => setVal(e.target.value)}
               placeholder="想怎么改？例如：预算改为6000元，或者不要用店长号..."
               className="w-full h-[120px] bg-transparent resize-none outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400"
             />
             <div className="flex justify-end mt-2">
                <button className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800"><ArrowUp size={16}/></button>
             </div>
          </div>
          
          <div>
            <div className="text-[12px] font-bold text-neutral-500 mb-3">常用建议</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] text-neutral-700 hover:bg-neutral-50">预算减半，先试水</button>
              <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] text-neutral-700 hover:bg-neutral-50">时间太长了，压缩到1周内</button>
              <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] text-neutral-700 hover:bg-neutral-50">只做KOC，不用自有号</button>
            </div>
          </div>

          <div className="opacity-50 pointer-events-none mt-8 border-t border-neutral-100 pt-8">
             <div className="text-[13px] text-neutral-500 text-center">输入修改意图后，这里将展示AI评估的方案差异与连带影响</div>
          </div>
        </div>
        <div className="p-6 border-t border-neutral-200 bg-neutral-50/50">
          <button 
            onClick={onApply}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            应用调整
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function ScheduleAdjustDrawer({ onClose, onApply, draft }: any) {
  const [val, setVal] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold text-neutral-900">调整排期与分配</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all">
             <textarea 
               value={val}
               onChange={e => setVal(e.target.value)}
               placeholder="自然语言修改排期，例如：KOC每天招募10人，首发日期推迟3天..."
               className="w-full h-[100px] bg-transparent resize-none outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400"
             />
             <div className="flex justify-end mt-2">
                <button className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800"><ArrowUp size={16}/></button>
             </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-[14px] font-bold text-neutral-900 pb-2 border-b border-neutral-100">关键指标确认</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-neutral-500 mb-1">首发日期</label>
                <input type="text" defaultValue={draft.schedule.firstPublish} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium outline-none focus:border-primary-400" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-neutral-500 mb-1">总预算</label>
                <input type="number" defaultValue={draft.budget} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium outline-none focus:border-primary-400" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-neutral-500 mb-1">KOC 总人数</label>
                <input type="number" defaultValue={draft.koc.planCount} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium outline-none focus:border-primary-400" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-neutral-500 mb-1">KOC 日招募量</label>
                <input type="number" defaultValue={draft.koc.dailyRecruit} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium outline-none focus:border-primary-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-neutral-200 bg-neutral-50/50">
          <button 
            onClick={onApply}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            应用调整
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function BasisDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[400px] bg-white h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-neutral-900">决策依据</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
             <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2"><Database size={16} className="text-primary-600"/> 已确认事实</div>
               <div className="text-[13px] text-neutral-600">引用了《烘焙猫粮核心配方说明》、《肠胃敏感期喂养手册》等12份知识文档，确保话术不越界。</div>
             </div>
             <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2"><History size={16} className="text-primary-600"/> 历史相似项目</div>
               <div className="text-[13px] text-neutral-600">对比了上月“新手养猫专场”，发现纯KOC铺量转化率仅0.8%，引入店长号跟评后转化率升至3.5%。</div>
             </div>
             <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2"><TrendingUp size={16} className="text-primary-600"/> 操盘手偏好</div>
               <div className="text-[13px] text-neutral-600">检测到你在近期项目中偏好使用“小步快跑”的验证逻辑（先发5篇看数据再铺量），已默认应用。</div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CheckBlockerDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[400px] bg-white h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-neutral-900">处理阻断项</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
           <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
             <div className="font-bold text-red-900 text-[14px] mb-1">店长号A 缺少执行设备</div>
             <div className="text-[13px] text-red-700">该账号需要人工下发发布任务，但目前未绑定具体的测试机或员工手机。</div>
           </div>

           <div className="space-y-4">
             <div className="text-[14px] font-bold text-neutral-900">选择接收任务的设备：</div>
             <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <input type="radio" name="device" className="mt-1" defaultChecked />
               <div>
                 <div className="font-bold text-[14px] text-neutral-900">iPhone 13 (运营部测试机)</div>
                 <div className="text-[12px] text-neutral-500 mt-1">设备所有者: 张三</div>
               </div>
             </label>
             <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <input type="radio" name="device" className="mt-1" />
               <div>
                 <div className="font-bold text-[14px] text-neutral-900">华为 Mate 50 (张三个人机)</div>
                 <div className="text-[12px] text-neutral-500 mt-1">需下发至张三微信小程序</div>
               </div>
             </label>
           </div>
        </div>
        <div className="p-6 border-t border-neutral-200 bg-neutral-50/50">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            保存配置并解除阻断
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function CreateConfirmModal({ draft, onClose, onConfirm }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-[500px] bg-white rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
          <div>
            <h2 className="text-[20px] font-extrabold text-neutral-900 mb-1">确认创建项目</h2>
            <div className="text-[13px] text-neutral-500">{draft.name}</div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 -mt-2 -mr-2">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-y-6 text-[13px]">
            <div><span className="text-neutral-500 block mb-1">项目周期</span><span className="font-bold text-[15px]">{draft.cycle}</span></div>
            <div><span className="text-neutral-500 block mb-1">总预算</span><span className="font-bold text-[15px]">¥{draft.budget}</span></div>
            <div className="col-span-2 w-full h-px bg-neutral-100" />
            <div><span className="text-neutral-500 block mb-1">笔记总量</span><span className="font-bold text-[14px]">{draft.expectedResults.delivery}</span></div>
            <div><span className="text-neutral-500 block mb-1">参与主体</span><span className="font-bold text-[14px]">{draft.koc.planCount}位KOC, {draft.kos.length + draft.brand.length}个自有号</span></div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-[14px] mb-2">
              <Sparkles size={16} /> 即将生成 3 个首批任务
            </div>
            <ul className="mt-2 text-[12px] font-medium text-emerald-700 leading-relaxed list-disc list-inside space-y-1">
              <li>生成素材筹备任务 (图文素材)</li>
              <li>生成KOC问卷配置任务</li>
              <li>进入筹备状态，等待条件全满足</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 rounded-b-2xl">
          <button 
            onClick={onConfirm}
            className="w-full py-3 rounded-xl text-[15px] font-bold transition-colors bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm flex items-center justify-center gap-2"
          >
            创建项目并生成首批任务 <ArrowRight size={16}/>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
`;

fs.writeFileSync('src/components/merchant/CreateProjectWorkstation.tsx', newContent);
