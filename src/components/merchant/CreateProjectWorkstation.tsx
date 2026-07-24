import React, { useState } from "react";
import { CheckCircle2, FlaskConical, ShieldAlert, Cpu, ExternalLink, Sparkles, Target, Calendar, AlertTriangle, Users, Trash2, LayoutGrid, Check, Settings, X, Search, BookOpen, Clock, Activity, MessageSquare, ChevronRight, PenTool, Image, FileText, Bot, List, Send, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CreateProjectWorkstation({ onClose, onCreate }: { onClose: () => void, onCreate: (project: any) => void }) {
  const [step, setStep] = useState<"initial" | "draft">("initial");
  const [intent, setIntent] = useState("");
  const [sources, setSources] = useState({
    knowledge: true, history: false, assets: true, materials: false, experience: false, skills: false
  });
  
  // Drawer states
  const [drawer, setDrawer] = useState<"ai_adjust" | "basis" | "koc_pack" | "koc_form" | "koc_task" | "employee" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Draft Data
  const [draft, setDraft] = useState<any>({
    name: "幼犬换粮体验优化及搜素卡位",
    goal: "换粮内容有收藏，但咨询很少。准备做一轮店长号和消费者共创",
    cycle: "2024-03-01 至 2024-03-15",
    budget: 5000,
    
    // Module 1
    problem: "换粮相关内容能获得收藏（说明有痛点），但有效咨询极少（缺乏信任或没有明确CTA）",
    hypothesis: "在真实换粮场景中，通过产品细节图配合KOC的真实反馈，能大幅提高信任度，进而转化为咨询。",
    expectedResults: ["有效问题评论", "人工登记咨询线索", "笔记链接回收率"],
    observationWindow: "发布后14天内",
    constraints: "不使用极限词，不承诺医疗效果",

    // Module 2
    strategies: [
      { id: 1, text: "加大KOC真实体验铺量，主打‘软便’痛点，评论区预埋钩子", source: "商家知识", type: "recommendation" },
      { id: 2, text: "店长号作为官方背书，发布‘科学换粮指南’进行搜索卡位", source: "操盘手经验", type: "recommendation" }
    ],

    // Module 3
    koc: {
      planCount: 20, notes: 20, dailyRecruit: 5, recruitDates: "03.01 - 03.04", publishDates: "03.05 - 03.10",
      contentPack: "幼犬换粮体验包 v2", form: "换粮基本情况调研", assetTask: "产品实拍与喂食记录"
    },
    kos: [
      { id: "kos1", name: "店长号A", type: "品牌号", pic: "张三", notes: 2, date: "03.05", publishType: "人工下发", direction: "科学换粮指南", assets: "已齐" }
    ],
    brand: [
      { id: "b1", name: "官方主号", notes: 1, time: "03.08", direction: "换粮季活动宣发", pic: "李四", publishType: "系统代发", dataRecovery: "自动追踪" }
    ],

    // Module 4
    calendarView: true,

    // Module 5
    skills: [
      { name: "小红书爆款文案生成器 v2.1", stage: "内容与素材", input: "商家知识+产品卖点", output: "小红书图文文案", manualConfirm: true, fallback: "使用基础模板生成" }
    ],
    tools: [
      { name: "KOC任务分发中心", purpose: "下发体验任务并追踪进度", permission: "读写执行", externalImpact: true }
    ],
    forbidden: ["对外发布", "大批量覆盖原草稿", "改变预算和周期"],

    // Module 6
    blockers: [
      { id: 1, text: "未确定店长号发布人", reason: "无法下发品牌主号发布任务", impact: "店长号执行环节", pic: "张三", status: "阻断执行", btn: "选择负责人" },
      { id: 2, text: "缺少1组真实换粮素材", reason: "品牌号首篇内容需要实拍图", impact: "内容生成环节", pic: "李四", status: "待确认", btn: "创建素材任务" },
      { id: 3, text: "产品知识库已就绪", reason: "AI可提取准确产品信息", impact: "全局", pic: "系统", status: "已具备", btn: "" }
    ]
  });

  const handleGenerate = () => {
    if (!intent) return;
    setStep("draft");
  };

  const handleCreate = () => {
    onCreate({
      id: Date.now().toString(),
      name: draft.name,
      currentCheckpoint: "筹备就绪",
      lastActive: "刚刚",
      kocCount: draft.koc.planCount
    });
  };

  return (
    <div className="h-full w-full bg-[#fcfcfc] flex flex-col relative">
      {/* Top Header */}
      <div className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 transition-colors">
            <X size={20} />
          </button>
          <div className="h-4 w-px bg-neutral-300" />
          <h1 className="text-[16px] font-bold text-neutral-900">新建项目</h1>
        </div>
        {step === "draft" && (
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
               保存草案
             </button>
             <button onClick={() => setShowConfirmModal(true)} className="px-4 py-2 text-[13px] font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800">
               创建为筹备项目
             </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {step === "initial" ? (
          <InitialView 
             intent={intent} setIntent={setIntent}
             sources={sources} setSources={setSources}
             onGenerate={handleGenerate}
          />
        ) : (
          <DraftWorkspace 
             draft={draft} setDraft={setDraft}
             onOpenAI={() => setDrawer("ai_adjust")}
             onOpenBasis={() => setDrawer("basis")} setDrawer={setDrawer}
          />
        )}
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {drawer === "ai_adjust" && <AIAdjustDrawer draft={draft} onClose={() => setDrawer(null)} />}
        {drawer === "basis" && <BasisDrawer onClose={() => setDrawer(null)} />}
        {drawer === "employee" && <EmployeeDrawer onClose={() => setDrawer(null)} />}
        {(drawer === "koc_pack" || drawer === "koc_form" || drawer === "koc_task") && <KOCConfigDrawer type={drawer} onClose={() => setDrawer(null)} />}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showConfirmModal && <CreateConfirmModal draft={draft} onClose={() => setShowConfirmModal(false)} onConfirm={handleCreate} />}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 1. Initial View
// ==========================================
function InitialView({ intent, setIntent, sources, setSources, onGenerate }: any) {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="text-center mb-10">
        <h1 className="text-[32px] font-extrabold text-neutral-900 mb-4 tracking-tight">这轮运营准备解决什么？</h1>
        <p className="text-[15px] text-neutral-500">
          说清问题、目标和限制即可，具体安排会根据商家资料与现有资源生成。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-6 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all">
        <textarea
          value={intent}
          onChange={e => setIntent(e.target.value)}
          placeholder="例如：换粮内容有收藏，但咨询很少。准备做一轮店长号和消费者共创，预算5000元，两周内完成..."
          className="w-full h-40 resize-none outline-none p-6 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-300"
        />
        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'knowledge', label: '商家知识' },
              { id: 'history', label: '历史项目' },
              { id: 'assets', label: '账号资产' },
              { id: 'materials', label: '已有素材' },
              { id: 'experience', label: '我的经验' },
              { id: 'skills', label: '已启用的Skill' }
            ].map(src => (
              <label key={src.id} className="flex items-center gap-1.5 cursor-pointer text-[12px] text-neutral-600 hover:text-neutral-900">
                <input 
                  type="checkbox" 
                  checked={sources[src.id]} 
                  onChange={e => setSources({...sources, [src.id]: e.target.checked})}
                  className="rounded text-primary-600 focus:ring-primary-500 w-3.5 h-3.5 border-neutral-300"
                />
                {src.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">
          保存稍后继续
        </button>
        <button 
          onClick={onGenerate}
          disabled={!intent.trim()}
          className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          生成项目草案 <Sparkles size={16} />
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 2. Draft Workspace
// ==========================================
function DraftWorkspace({ draft, setDraft, onOpenAI, onOpenBasis, setDrawer }: any) {
  return (
    <div className="pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1360px] mx-auto px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">草案</span>
            <input 
               value={draft.name} 
               onChange={e => setDraft({...draft, name: e.target.value})}
               className="text-[24px] font-extrabold text-neutral-900 bg-transparent outline-none hover:bg-neutral-50 focus:bg-neutral-50 px-2 -ml-2 rounded flex-1"
            />
          </div>
          <div className="flex gap-8 text-[13px] text-neutral-600 items-center px-2">
             <div className="flex items-center gap-2">
               <Target size={14} className="text-neutral-400" /> 
               <input value={draft.goal} onChange={e => setDraft({...draft, goal: e.target.value})} className="bg-transparent outline-none w-[300px]" />
             </div>
             <div className="flex items-center gap-2">
               <Calendar size={14} className="text-neutral-400" />
               <input value={draft.cycle} onChange={e => setDraft({...draft, cycle: e.target.value})} className="bg-transparent outline-none w-[180px]" />
             </div>
             <div className="flex items-center gap-2">
               <span className="font-medium text-neutral-500">预算:</span>
               <span>¥ <input type="number" value={draft.budget} onChange={e => setDraft({...draft, budget: Number(e.target.value)})} className="bg-transparent outline-none w-20 font-bold text-neutral-900" /></span>
             </div>
             
             <div className="flex-1 flex justify-end">
                <button onClick={onOpenAI} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 font-bold transition-colors">
                  <Bot size={14} /> 方案调整
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-8 py-8 space-y-12">
        {/* Module 1: Validation & Constraints */}
        <section>
           <h2 className="text-[18px] font-extrabold text-neutral-900 mb-6 flex items-center gap-2">
             <FlaskConical size={18} className="text-neutral-400" /> 本次项目目标
           </h2>
           <div className="grid grid-cols-5 gap-6">
             <div className="col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm grid grid-cols-2 gap-6">
              <div>
               <div className="text-[12px] text-neutral-500 mb-2 font-bold">当前面临的问题</div>
               <textarea value={draft.problem} onChange={e => setDraft({...draft, problem: e.target.value})} className="w-full text-[14px] text-neutral-900 bg-transparent outline-none resize-none h-16 leading-relaxed" />
               </div>
              <div>
               <div className="text-[12px] text-neutral-500 mb-2 font-bold">预期执行效果</div>
               <textarea value={draft.hypothesis} onChange={e => setDraft({...draft, hypothesis: e.target.value})} className="w-full text-[14px] font-bold text-primary-900 bg-transparent outline-none resize-none h-16 leading-relaxed" />
             </div>
             
          </div>
           </div>
        </section>

        {/* Module 2: Strategy & Basis */}
        <section>
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-[18px] font-extrabold text-neutral-900 flex items-center gap-2">
               <BookOpen size={18} className="text-neutral-400" /> 策略与依据
             </h2>
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setDraft({...draft, strategies: [...draft.strategies, { id: Date.now(), text: "新策略描述...", source: "手动添加", type: "recommendation" }]})}
                 className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900"
               >
                 + 添加策略
               </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent("nav-to-search-explorer"))} className="text-[13px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-2 py-1 rounded"><Search size={14} /> 探索搜索词</button>
               <button onClick={onOpenBasis} className="text-[13px] font-bold text-primary-600 hover:underline flex items-center gap-1">
                 查看全部依据 <ChevronRight size={14} />
               </button>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             {draft.strategies.map((s:any) => (
               <div key={s.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                   <Target size={14} className="text-neutral-600" />
                 </div>
                 <div className="flex-1 w-full">
                   <textarea 
                     value={s.text}
                     onChange={e => setDraft({...draft, strategies: draft.strategies.map((x:any) => x.id === s.id ? {...x, text: e.target.value} : x)})}
                     className="w-full text-[14px] font-bold text-neutral-900 mb-2 leading-relaxed bg-transparent outline-none border-b border-transparent focus:border-neutral-200 resize-none overflow-hidden" 
                     rows={2}
                   />
                   <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[11px] font-medium border border-neutral-100">
                     <FileText size={10} /> 来源: {s.source}
                   </div>
                 </div>
                 <button 
                   onClick={() => setDraft({...draft, strategies: draft.strategies.filter((x:any) => x.id !== s.id)})}
                   className="text-neutral-400 hover:text-red-500 p-1"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
             ))}
           </div>
        </section>

        {/* Module 3: Execution Channels */}
        <section>
           <h2 className="text-[18px] font-extrabold text-neutral-900 mb-6 flex items-center gap-2">
             <Activity size={18} className="text-neutral-400" /> 执行通道
           </h2>
           <div className="space-y-6">
             {/* KOC Channel */}
             <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
               <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                 <div className="flex items-center gap-2 font-bold text-[15px]">
                   <Users size={16} className="text-neutral-500" /> KOC消费者共创
                 </div>
                 <div className="text-[12px] text-neutral-500">默认1参与者=1笔记，不固定绑定账号</div>
               </div>
               <div className="p-6 grid grid-cols-3 gap-8">
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-[13px] text-neutral-500">计划参与人数</span>
                     <input type="number" value={draft.koc.planCount} onChange={e => setDraft({...draft, koc: {...draft.koc, planCount: Number(e.target.value)}})} className="w-16 bg-transparent outline-none border-b border-transparent focus:border-neutral-300 font-bold text-right" />
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[13px] text-neutral-500">预计形成笔记</span>
                     <input type="number" value={draft.koc.notes} onChange={e => setDraft({...draft, koc: {...draft.koc, notes: Number(e.target.value)}})} className="w-16 bg-transparent outline-none border-b border-transparent focus:border-neutral-300 font-bold text-right" />
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[13px] text-neutral-500">每日招募配额</span>
                     <div className="flex items-center gap-1 font-bold">
                       <input type="number" value={draft.koc.dailyRecruit} onChange={e => setDraft({...draft, koc: {...draft.koc, dailyRecruit: Number(e.target.value)}})} className="w-12 bg-transparent outline-none border-b border-transparent focus:border-neutral-300 text-right" />
                       <span className="text-neutral-500 font-normal">/ 天</span>
                     </div>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[13px] text-neutral-500">执行时间</span>
                     <input type="date" value={draft.koc.recruitDates} onChange={e => setDraft({...draft, koc: {...draft.koc, recruitDates: e.target.value}})} className="w-[120px] bg-transparent outline-none border-b border-transparent focus:border-neutral-300 font-bold text-right" />
                   </div>
                 </div>
                 <div className="space-y-3 col-span-2">
                   <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">使用内容包</div>
                       <div className="text-[13px] font-bold">{draft.koc.contentPack}</div>
                     </div>
                     <button onClick={() => setDrawer("koc_pack")} className="text-[12px] font-bold text-primary-600 hover:underline">编辑内容包</button>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">参与者信息采集表</div>
                       <div className="text-[13px] font-bold">{draft.koc.form}</div>
                     </div>
                     <button onClick={() => setDrawer("koc_form")} className="text-[12px] font-bold text-primary-600 hover:underline">配置问卷</button>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                     <div>
                       <div className="text-[11px] text-neutral-500 mb-1">素材任务</div>
                       <div className="text-[13px] font-bold">{draft.koc.assetTask}</div>
                     </div>
                     <button onClick={() => setDrawer("koc_task")} className="text-[12px] font-bold text-primary-600 hover:underline">配置任务</button>
                   </div>
                 </div>
               </div>
               <div className="bg-neutral-50 p-3 border-t border-neutral-100 flex justify-between items-center px-6">
                 <span className="text-[12px] text-neutral-500">任务页面准备就绪</span>
                 <div className="flex gap-3">
                   <button className="text-[12px] font-bold px-3 py-1.5 bg-white border border-neutral-200 rounded shadow-sm hover:bg-neutral-50">预览页面</button>
                   <button className="text-[12px] font-bold px-3 py-1.5 bg-neutral-900 text-white rounded shadow-sm hover:bg-neutral-800">生成招募入口</button>
                 </div>
               </div>
             </div>

             {/* KOS Channel */}
             <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
               <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-2 font-bold text-[15px]">
                 <CheckCircle2 size={16} className="text-neutral-500" /> 店长号 / KOS
               </div>
               <div className="p-4 overflow-x-auto">
                 <table className="w-full text-left border-collapse text-[13px]">
                   <thead>
                     <tr className="text-neutral-500 border-b border-neutral-100">
                       <th className="font-medium pb-2 pr-4">具体账号</th>
                       <th className="font-medium pb-2 pr-4">指定员工</th>
                       <th className="font-medium pb-2 pr-4">计划发文</th>
                       <th className="font-medium pb-2 pr-4">执行时间</th>
                       
                       <th className="font-medium pb-2 pr-4">内容方向</th>
                       <th className="font-medium pb-2">素材状态</th>
                     </tr>
                   </thead>
                   <tbody>
                     {draft.kos.map((k:any) => (
                       <tr key={k.id} className="border-b border-neutral-50 last:border-0">
                         <td className="py-3 pr-4 font-bold">{k.name}</td>
                         <td className="py-3 pr-4">
                           <button onClick={() => setDrawer("employee")} className="text-primary-600 hover:underline">{k.pic}</button>
                         </td>
                         <td className="py-3 pr-4"><input type="number" value={k.notes} onChange={e => setDraft({...draft, kos: draft.kos.map((x:any) => x.id === k.id ? {...x, notes: Number(e.target.value)} : x)})} className="w-12 bg-neutral-100 rounded px-2 py-1 outline-none text-center" /></td>
                         <td className="py-3 pr-4"><input type="date" value={k.date} onChange={e => setDraft({...draft, kos: draft.kos.map((x:any) => x.id === k.id ? {...x, date: e.target.value} : x)})} className="w-[120px] bg-transparent outline-none border-b border-transparent focus:border-neutral-300" /></td>
                         <td className="py-3 pr-4">
                           <select value={k.direction} onChange={e => setDraft({...draft, kos: draft.kos.map((x:any) => x.id === k.id ? {...x, direction: e.target.value} : x)})} className="bg-transparent outline-none cursor-pointer max-w-[150px] truncate">
                             <option>科学换粮指南</option>
                             <option>真实体验分享</option>
                             <option>换粮季活动宣发</option>
                           </select>
                         </td>
                         <td className="py-3">
                           <span className={`px-2 py-1 rounded text-[11px] ${k.assets==='已齐'?'bg-emerald-50 text-emerald-600':'bg-amber-50 text-amber-600'}`}>{k.assets}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
             
             {/* Brand Channel */}
             <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
               <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-2 font-bold text-[15px]">
                 <CheckCircle2 size={16} className="text-neutral-500" /> 品牌主号
               </div>
               <div className="p-4 overflow-x-auto">
                 <table className="w-full text-left border-collapse text-[13px]">
                   <thead>
                     <tr className="text-neutral-500 border-b border-neutral-100">
                       <th className="font-medium pb-2 pr-4">具体账号</th>
                       <th className="font-medium pb-2 pr-4">指定员工</th>
                       <th className="font-medium pb-2 pr-4">计划发文</th>
                       <th className="font-medium pb-2 pr-4">执行时间</th>
                       
                       <th className="font-medium pb-2 pr-4">内容方向</th>
                       <th className="font-medium pb-2">数据回收</th>
                     </tr>
                   </thead>
                   <tbody>
                     {draft.brand.map((b:any) => (
                       <tr key={b.id} className="border-b border-neutral-50 last:border-0">
                         <td className="py-3 pr-4 font-bold">{b.name}</td>
                         <td className="py-3 pr-4">
                           <button onClick={() => setDrawer("employee")} className="text-primary-600 hover:underline">{b.pic}</button>
                         </td>
                         <td className="py-3 pr-4"><input type="number" value={b.notes} onChange={e => setDraft({...draft, brand: draft.brand.map((x:any) => x.id === b.id ? {...x, notes: Number(e.target.value)} : x)})} className="w-12 bg-neutral-100 rounded px-2 py-1 outline-none text-center" /></td>
                         <td className="py-3 pr-4"><input type="date" value={b.time} onChange={e => setDraft({...draft, brand: draft.brand.map((x:any) => x.id === b.id ? {...x, time: e.target.value} : x)})} className="w-[120px] bg-transparent outline-none border-b border-transparent focus:border-neutral-300" /></td>
                         
                         <td className="py-3 pr-4">
                           <select value={b.direction} onChange={e => setDraft({...draft, brand: draft.brand.map((x:any) => x.id === b.id ? {...x, direction: e.target.value} : x)})} className="bg-transparent outline-none cursor-pointer max-w-[150px] truncate">
                             <option>换粮季活动宣发</option>
                             <option>科学换粮指南</option>
                             <option>真实体验分享</option>
                           </select>
                         </td>
                         <td className="py-3 text-neutral-600">
                           <select value={b.dataRecovery} onChange={e => setDraft({...draft, brand: draft.brand.map((x:any) => x.id === b.id ? {...x, dataRecovery: e.target.value} : x)})} className="bg-transparent outline-none cursor-pointer">
                             <option>自动追踪</option>
                             <option>人工回填</option>
                           </select>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           </div>
        </section>

        {/* Module 4: Calendar & Plans */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-extrabold text-neutral-900 flex items-center gap-2">
              <Calendar size={18} className="text-neutral-400" /> 日历与笔记计划
            </h2>
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button onClick={() => setDraft({...draft, calendarView: true})} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${draft.calendarView ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>日历视图</button>
              <button onClick={() => setDraft({...draft, calendarView: false})} className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${!draft.calendarView ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>笔记列表</button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 min-h-[300px] flex items-center justify-center">
            {draft.calendarView ? (
              <div className="text-center text-neutral-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>日历视图加载中... (按天展示招募、发布、审核任务)</p>
              </div>
            ) : (
              <div className="text-center text-neutral-400">
                <List size={48} className="mx-auto mb-4 opacity-50" />
                <p>笔记列表加载中... (以笔记为最小单位跟踪执行状态)</p>
              </div>
            )}
          </div>
        </section>

        {/* Module 5: Workflow & Skills */}
        <section>
           <h2 className="text-[18px] font-extrabold text-neutral-900 mb-6 flex items-center gap-2">
             <Cpu size={18} className="text-neutral-400" /> 工作流与能力调用
           </h2>
           <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
               <h3 className="text-[14px] font-bold text-neutral-900 border-b border-neutral-100 pb-2">已启用 Skill & 工具</h3>
               {draft.skills.map((s:any, i:number) => (
                 <div key={i} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                   <div className="font-bold text-[14px] mb-2">{s.name}</div>
                   <div className="text-[12px] text-neutral-500 space-y-1">
                     <div><span className="w-16 inline-block">用于环节:</span> {s.stage}</div>
                     <div><span className="w-16 inline-block">输入输出:</span> {s.input} &rarr; {s.output}</div>
                     <div className="text-amber-600 mt-2 flex items-center gap-1"><AlertTriangle size={12}/> 需要人工确认</div>
                   </div>
                 </div>
               ))}
               {draft.tools.map((t:any, i:number) => (
                 <div key={i} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                   <div className="font-bold text-[14px] mb-2">{t.name}</div>
                   <div className="text-[12px] text-neutral-500 space-y-1">
                     <div><span className="w-16 inline-block">调用目的:</span> {t.purpose}</div>
                     <div><span className="w-16 inline-block">系统权限:</span> {t.permission}</div>
                   </div>
                 </div>
               ))}
             </div>
             <div>
               <h3 className="text-[14px] font-bold text-neutral-900 border-b border-neutral-100 pb-2 mb-4">禁止自动执行的动作</h3>
               <div className="space-y-2">
                 {draft.forbidden.map((f:string, i:number) => (
                   <div key={i} className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-[13px] font-bold flex items-center gap-2 border border-red-100">
                     <X size={14} /> {f}
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </section>

        {/* Module 6: Blockers & Actions */}
        <section>
           <h2 className="text-[18px] font-extrabold text-neutral-900 mb-6 flex items-center gap-2">
             <ShieldAlert size={18} className="text-neutral-400" /> 开始执行前需完成
           </h2>
           <div className="grid grid-cols-3 gap-4">
             {draft.blockers.map((b:any) => (
               <div key={b.id} className={`p-5 rounded-2xl border flex flex-col ${
                 b.status === '阻断执行' ? 'bg-red-50 border-red-200' :
                 b.status === '待确认' ? 'bg-amber-50 border-amber-200' :
                 'bg-emerald-50 border-emerald-200'
               }`}>
                 <div className="flex-1 mb-4">
                   <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mb-3 ${
                     b.status === '阻断执行' ? 'bg-red-100 text-red-700' :
                     b.status === '待确认' ? 'bg-amber-100 text-amber-700' :
                     'bg-emerald-100 text-emerald-700'
                   }`}>{b.status}</div>
                   <div className="text-[14px] font-bold text-neutral-900 mb-2">{b.text}</div>
                   <div className="text-[12px] text-neutral-600 mb-1">原因: {b.reason}</div>
                   <div className="text-[12px] text-neutral-600">影响: {b.impact}</div>
                 </div>
                 {b.btn && (
                   <button className="w-full py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold hover:bg-neutral-50 shadow-sm transition-colors">
                     {b.btn}
                   </button>
                 )}
               </div>
             ))}
           </div>
        </section>

      </div>
    </div>
  )
}

// ==========================================
// Drawers
// ==========================================
function AIAdjustDrawer({ draft, onClose }: any) {
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
          <h2 className="text-[18px] font-bold flex items-center gap-2"><Bot size={20} /> 方案调整</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
           <div className="text-[13px] text-neutral-500">你可以用自然语言让我修改项目草案中的任何配置。修改前我会展示差异，由你确认。</div>
           <div className="space-y-2">
             {["预算改成 6000 元", "KOC每天招募10人，持续5天", "不使用KOC，只保留店长号", "不要调用我的开箱评测Skill"].map((s,i) => (
               <button key={i} className="block w-full text-left px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors">
                 "{s}"
               </button>
             ))}
           </div>
        </div>
        <div className="p-4 bg-white border-t border-neutral-200">
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus-within:bg-white focus-within:border-primary-500 transition-colors">
            <input placeholder="输入修改指令..." className="flex-1 bg-transparent outline-none text-[14px] px-2" />
            <button className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors">
              <Send size={14} />
            </button>
          </div>
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
        className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold">查看依据</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           <div className="text-[13px] text-neutral-500 mb-6">以下是生成当前项目草案所采纳的实际上下文信息。</div>
           {[
             { title: "商家知识：换粮期核心痛点", src: "商家知识", time: "2天前更新", use: "推荐策略：主打软便痛点" },
             { title: "历史数据：官方宣发转化低", src: "历史项目", time: "上月结案", use: "缩小品牌主号比例，加大KOC共创" }
           ].map((b,i) => (
             <div key={i} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm relative group">
               <button className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 hidden group-hover:block" title="取消此依据并重新生成">
                 <X size={16} />
               </button>
               <div className="font-bold text-[14px] text-neutral-900 mb-2 pr-6">{b.title}</div>
               <div className="text-[12px] text-neutral-500 space-y-1">
                 <div>来源：{b.src} · {b.time}</div>
                 <div className="text-primary-700 font-medium mt-2">影响判断：{b.use}</div>
               </div>
             </div>
           ))}
        </div>
      </motion.div>
    </div>
  )
}

function CreateConfirmModal({ draft, onClose, onConfirm }: any) {
  const hasBlockers = draft.blockers.some((b:any) => b.status === "阻断执行");

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
            <h2 className="text-[20px] font-extrabold text-neutral-900 mb-1">确认创建筹备项目</h2>
            <div className="text-[13px] text-neutral-500">{draft.name}</div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 -mt-2 -mr-2">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-y-4 text-[13px]">
            <div><span className="text-neutral-500 block mb-1">项目周期</span><span className="font-bold">{draft.cycle}</span></div>
            <div><span className="text-neutral-500 block mb-1">总预算</span><span className="font-bold">¥{draft.budget}</span></div>
            <div><span className="text-neutral-500 block mb-1">总笔记计划</span><span className="font-bold">{draft.koc.notes + draft.kos[0].notes + draft.brand[0].notes} 篇</span></div>
            <div><span className="text-neutral-500 block mb-1">参与主体</span><span className="font-bold">{draft.koc.planCount}位KOC, 2个自有号</span></div>
          </div>

          {hasBlockers && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-bold text-[14px] mb-2">
                <AlertTriangle size={16} /> 存在阻断事项
              </div>
              <ul className="list-disc pl-5 text-[13px] text-red-600 space-y-1">
                {draft.blockers.filter((b:any)=>b.status==="阻断执行").map((b:any, i:number) => (
                  <li key={i}>{b.text}</li>
                ))}
              </ul>
              <div className="mt-3 text-[12px] font-medium text-red-700">
                项目可以创建，但在解决以上问题前，系统不会生成发布任务。
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 rounded-b-2xl">
          <button 
            onClick={onConfirm}
            className={`w-full py-3 rounded-xl text-[15px] font-bold transition-colors ${
              hasBlockers 
                ? "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200" 
                : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm"
            }`}
          >
            {hasBlockers ? "创建为筹备项目 (待补齐条件)" : "创建项目并生成首批任务"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function EmployeeDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[400px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold">指定员工</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           <div className="text-[13px] text-neutral-500 mb-4">请选择要负责该账号内容或审核的员工：</div>
           <div className="relative mb-6">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
             <input placeholder="搜索员工姓名或岗位..." className="w-full text-[13px] bg-white border border-neutral-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-primary-500" />
           </div>
           <div className="space-y-2">
             {[
               { name: "张三", role: "店长", dept: "运营部" },
               { name: "李四", role: "内容策划", dept: "市场部" },
               { name: "王五", role: "客服专员", dept: "客户服务部" },
             ].map((emp,i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200 cursor-pointer hover:border-primary-400 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
                     {emp.name[0]}
                   </div>
                   <div>
                     <div className="font-bold text-[14px] text-neutral-900">{emp.name}</div>
                     <div className="text-[12px] text-neutral-500">{emp.dept} · {emp.role}</div>
                   </div>
                 </div>
                 <button className="text-primary-600 hover:bg-primary-50 p-2 rounded-full">
                   <CheckCircle2 size={20} />
                 </button>
               </div>
             ))}
           </div>
        </div>
      </motion.div>
    </div>
  )
}

function KOCConfigDrawer({ type, onClose }: any) {
  const titles = {
    koc_pack: "编辑内容包",
    koc_form: "配置信息采集表",
    koc_task: "配置素材任务"
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold">{(titles as any)[type]}</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center text-neutral-400">
           <div className="text-center">
             <Settings size={48} className="mx-auto mb-4 opacity-50" />
             <p>配置表单组件加载中...</p>
             <p className="text-[12px] mt-2">在这里进行具体的 {(titles as any)[type]} 设置</p>
           </div>
        </div>
        <div className="p-6 bg-white border-t border-neutral-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">取消</button>
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800">保存设置</button>
        </div>
      </motion.div>
    </div>
  )
}
