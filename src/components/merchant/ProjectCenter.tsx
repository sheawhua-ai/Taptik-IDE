import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Filter, MessageSquare, Target, Calendar, 
  Activity, History, Check, X, Compass, Eye, ShieldAlert,
  ChevronRight, AlertTriangle, Info, ArrowRight, BrainCircuit,
  FileText, CheckCircle2, ListTodo, Zap, ShieldCheck, Layers, FileBox, BarChart2, Download, ExternalLink
} from "lucide-react";
import { CreateProjectWorkstation } from "./CreateProjectWorkstation";

export interface ProjectCenterProps {
  hasData?: boolean;
  activeProjectId?: string;
  setWorkflowTab?: (tab: string) => void;
}

const MOCK_PROJECTS = [
  {
    id: "d1",
    name: "幼犬换粮搜索卡位第三轮",
    status: "立项草案",
    target: "验证“换粮软便”内容能否提升收藏、有效评论和人工登记的咨询线索",
    stage: "等待确认本轮策略",
    blocker: "AI已形成3个策略假设，待确认1项并定义验证标准",
    pendingCount: 1,
    primaryActionText: "查看策略假设",
    recommendedAction: "confirm_strategy",
    period: "未定",
    aiJudgment: "当前已接入15篇历史笔记数据，但缺少近30天的竞品痛点评论样本。建议先确认核心假设，再决定是否补充样本。",
    recentChanges: [
      { time: "10分钟前", user: "AI助手", action: "生成策略草案", desc: "基于历史项目“幼犬换粮搜索卡位第一轮”生成了3个差异化方案。" }
    ],
    batches: []
  },
  {
    id: "p1",
    name: "幼犬换粮避坑搜索卡位",
    status: "执行",
    target: "验证首图视觉改进能否降低搜索卡位词的跳出率",
    stage: "第一批内容草稿生成中",
    blocker: "首批执行单元仍缺少1个可用发布账号",
    pendingCount: 1,
    primaryActionText: "检查首批执行单元",
    recommendedAction: "check_batch",
    period: "2026-07-01 至 2026-07-20",
    aiJudgment: "本轮策略方向已确认，系统正在生成内容草稿，但首批执行单元仍缺少1个可用发布账号。建议先确认账号和发布人，再启动批次。",
    recentChanges: [
      { time: "2小时前", user: "系统", action: "开始生成内容", desc: "正在根据确认的策略基线生成15篇笔记草稿。" },
      { time: "昨天 18:00", user: "张操盘", action: "启动项目", desc: "AI生成策略草案v1.0；张操盘确认后，项目进入筹备状态。" }
    ],
    batches: [
      { id: "b1", name: "第一批：核心痛点分发", stage: "内容筹备中", readiness: "70%", progress: "0/15", anomaly: "缺少1个可用发布账号", nextCheck: "内容审核与账号确认" }
    ]
  },
  {
    id: "p2",
    name: "618防软便粮爆文打法",
    status: "完成",
    target: "验证爆文种草能否拉动品牌词搜索指数上升",
    stage: "AI初步复盘已生成",
    blocker: "初步复盘已生成，将在观察窗口结束后更新",
    pendingCount: 0,
    primaryActionText: "发起AI复盘",
    recommendedAction: "view_review",
    period: "2026-05-20 至 2026-06-25",
    aiJudgment: "项目已完成执行阶段，初步复盘表明爆文产出率达标，但线索转化率偏低，等待观察窗口结束以补充长尾数据。",
    recentChanges: [
      { time: "3天前", user: "系统", action: "生成初步复盘", desc: "基于发布后7天数据生成了初步复盘报告。" }
    ],
    batches: [
      { id: "b1", name: "预热期铺量", stage: "已完成", readiness: "100%", progress: "50/50", anomaly: "无", nextCheck: "无" }
    ]
  }
];

export function ProjectCenter({
  hasData = true,
  activeProjectId = "d1",
  setWorkflowTab
}: ProjectCenterProps) {
  const [statusFilter, setStatusFilter] = useState<string>("需要我处理");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjectId);
  const [detailTab, setDetailTab] = useState<"总览" | "策略基线" | "执行批次" | "结果与复盘" | "变更记录">("总览");
  const [isRecentChangesExpanded, setIsRecentChangesExpanded] = useState(false);

  const [drawerType, setDrawerType] = useState<string | null>(null);

  // Create Project States
  const [createStep, setCreateStep] = useState(1);
  const [createProjectName, setCreateProjectName] = useState("");
  const [createProjectTarget, setCreateProjectTarget] = useState("");

  const [projects, setProjects] = useState<any[]>(MOCK_PROJECTS);
  
  const filteredProjects = projects.filter(p => {
    if (statusFilter === "全部") return true;
    if (statusFilter === "需要我处理") {
      return p.pendingCount > 0 || p.status === "立项草案";
    }
    return p.status === statusFilter;
  });

  const drafts = filteredProjects.filter(p => p.status === "立项草案");
  const formals = filteredProjects.filter(p => p.status !== "立项草案");

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "筹备": return "text-blue-700 bg-blue-50 border-blue-200";
      case "执行": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "暂停": return "text-amber-700 bg-amber-50 border-amber-200";
      case "完成": return "text-purple-700 bg-purple-50 border-purple-200";
      case "归档": return "text-neutral-500 bg-neutral-100 border-neutral-300";
      case "立项草案": return "text-primary-700 bg-primary-50 border-primary-200";
      default: return "text-neutral-700 bg-neutral-50 border-neutral-200";
    }
  };

  const handleAction = (action: string) => {
    if (!action || action === "none") return;
    setDrawerType(action);
  };

  const renderDrawerContent = () => {
    switch (drawerType) {
      case "confirm_strategy":
        return (
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-[16px] text-neutral-900">查看策略假设</h3>
              <button onClick={() => setDrawerType(null)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-6">
              <p className="text-[13px] text-neutral-600 leading-relaxed bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                基于当前已接入资料生成策略草案，无法验证的信息已标记为假设。
              </p>
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                 <div>
                   <div className="text-[13px] font-bold text-neutral-900 mb-1">核心假设</div>
                   <div className="text-[12px] text-neutral-600">专业育宠师人设可提升咨询转化率</div>
                 </div>
                 <div className="border-t border-neutral-100 pt-4">
                   <div className="text-[13px] font-bold text-neutral-900 mb-1">验证标准</div>
                   <div className="text-[12px] text-neutral-600">评论区有效咨询占比 &gt; 10%</div>
                 </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3">
              <button onClick={() => setDrawerType(null)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50 transition-colors">取消</button>
              <button onClick={() => {
                setProjects(projects.map(p => p.id === currentProject.id ? { ...p, status: "筹备", stage: "筹备中", blocker: "策略已确认", pendingCount: 0, recommendedAction: "none" } : p));
                setDrawerType(null);
              }} className="flex-[2] py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm">确认策略，进入筹备</button>
            </div>
          </div>
        );
      case "check_batch":
        return (
           <div className="h-full flex flex-col">
             <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
               <h3 className="font-bold text-[16px] text-neutral-900">检查首批执行单元</h3>
               <button onClick={() => setDrawerType(null)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                   <div className="text-[14px] font-bold text-neutral-900 mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> 缺少可用发布账号</div>
                   <p className="text-[13px] text-neutral-600 mb-4">计划需要3个店长号，当前只有2个处于可用状态。</p>
                   <button className="w-full text-[13px] font-bold text-primary-700 border border-primary-200 bg-primary-50 py-2.5 rounded-xl hover:bg-primary-100 transition-colors">前往执行中心处理</button>
                </div>
             </div>
           </div>
        );
      case "view_review":
         return (
           <div className="h-full flex flex-col">
             <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
               <h3 className="font-bold text-[16px] text-neutral-900">AI初步复盘</h3>
               <button onClick={() => setDrawerType(null)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                   <p className="text-[13px] text-neutral-600">已生成初步复盘。需等待7天观察窗口结束，以补充长尾互动数据进行深度复盘。</p>
                </div>
             </div>
           </div>
         );
      default:
        return (
          <div className="p-6">
             <h3 className="font-bold text-[16px] text-neutral-900 mb-4">操作：{drawerType}</h3>
             <button onClick={() => setDrawerType(null)} className="text-[13px] bg-neutral-100 px-4 py-2 rounded-lg font-bold">关闭</button>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-[#fcfcfc] text-neutral-900 font-sans relative">
      {drawerType === "create_project" && (
        <div className="absolute inset-0 z-50 bg-[#fcfcfc]">
          <CreateProjectWorkstation 
            onClose={() => setDrawerType(null)} 
            onCreate={(proj) => {
              setProjects([proj, ...projects]);
              setSelectedProjectId(proj.id);
              setDrawerType(null);
            }} 
          />
        </div>
      )}
      <div className="w-[320px] shrink-0 border-r border-neutral-200 flex flex-col bg-[#fcfcfc] z-10 relative">
        <div className="p-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[18px] font-bold text-neutral-900 tracking-tight">项目中心</h1>
            <button onClick={() => setDrawerType("create_project")} className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="新建项目">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[ "需要我处理", "筹备", "执行", "暂停", "完成", "归档", "全部" ].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  statusFilter === f
                    ? f === "需要我处理" ? "bg-primary-50 text-primary-700 border border-primary-200 shadow-sm" : "bg-neutral-900 text-white border border-neutral-900 shadow-sm"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-3">
            {filteredProjects.length === 0 && (
              <div className="text-center text-neutral-400 text-[12px] py-4">当前没有符合条件的项目</div>
            )}
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`group relative p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedProjectId === proj.id
                    ? "bg-white border-neutral-400 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200"
                    : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                }`}
              >
                {true && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const newProjects = projects.filter(p => p.id !== proj.id);
                      setProjects(newProjects);
                      if (selectedProjectId === proj.id && newProjects.length > 0) {
                        setSelectedProjectId(newProjects[0].id);
                      }
                    }} 
                    className="absolute right-3 top-3 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="删除项目"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="flex items-center gap-2 mb-2 pr-6">
                  <div className={`w-2 h-2 rounded-full ${proj.status === '完成' ? 'bg-purple-500' : proj.status === '执行' ? 'bg-emerald-500' : proj.status === '筹备' ? 'bg-blue-500' : 'bg-primary-500'}`}></div>
                  <div className="text-[14px] font-bold text-neutral-900 leading-snug line-clamp-1">{proj.name}</div>
                </div>
                <div className="text-[12px] font-bold text-neutral-700 mb-1.5">{proj.stage}</div>
                <div className="text-[11px] text-neutral-500 mb-3 line-clamp-1">{proj.blocker}</div>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getStatusColor(proj.status)}`}>
                    {proj.status}
                  </span>
                  {proj.pendingCount > 0 && (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertTriangle size={12}/> 待处理 {proj.pendingCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-0 min-w-0">
        <div className="p-8 pb-0 border-b border-neutral-100 bg-white shrink-0">
          <div className="max-w-5xl mx-auto flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[28px] font-bold text-neutral-900 tracking-tight">{currentProject.name}</h2>
                <span className={`px-2.5 py-1 rounded-md text-[13px] font-bold border ${getStatusColor(currentProject.status)}`}>
                  {currentProject.status}
                </span>
              </div>
              <p className="text-[15px] text-neutral-600 max-w-3xl font-medium mt-1 leading-relaxed"><span className="font-bold text-neutral-900 mr-2">本轮目标</span> {currentProject.target}</p>
              {currentProject.period && currentProject.period !== "未定" && (
                <div className="flex items-center gap-2 mt-4 text-[13px] text-neutral-500 font-medium">
                  <Calendar size={16} className="text-neutral-400"/> 周期：{currentProject.period}
                </div>
              )}
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto flex gap-8">
            {["总览", "策略基线", "执行批次", "结果与复盘", "变更记录"].map(tab => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab as any)}
                className={`text-[15px] font-bold pb-3 transition-all relative ${
                  detailTab === tab 
                    ? "text-neutral-900" 
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {tab}
                {detailTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-[#fcfcfc]">
          {detailTab === "总览" && (
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
                             <span className={`font-medium flex items-center gap-1.5 ${currentProject.batches[0].anomaly !== '无' ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100' : 'text-neutral-900'}`}>
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
          )}

          {detailTab === "策略基线" && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                 <div className="flex items-start gap-3 mb-8 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                    <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-blue-800 leading-relaxed font-medium">
                      基于当前已接入资料生成策略草案，无法验证的信息已标记为假设。
                    </p>
                 </div>
                 
                 <div className="space-y-8">
                    <div>
                      <h4 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500"/> 已确认事实</h4>
                      <ul className="text-[14px] text-neutral-700 space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></span>
                          <div>
                            <div>品牌过往爆文多以开箱测评形式呈现</div>
                            <div className="text-[11px] text-neutral-400 mt-1 font-medium bg-neutral-50 inline-block px-2 py-0.5 rounded border border-neutral-100 cursor-pointer hover:bg-neutral-100 transition-colors">来源: 历史项目</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2"></span>
                          <div>
                            <div>干货科普能够有效降低退货率</div>
                            <div className="text-[11px] text-neutral-400 mt-1 font-medium bg-neutral-50 inline-block px-2 py-0.5 rounded border border-neutral-100 cursor-pointer hover:bg-neutral-100 transition-colors">来源: 商家知识库</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-t border-neutral-100 pt-8">
                      <h4 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><BrainCircuit size={18} className="text-primary-500"/> AI 推断</h4>
                      <ul className="text-[14px] text-neutral-700 space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0 mt-2"></span>
                          <div>
                            <div>幼犬换粮期用户更关注“软便”痛点</div>
                            <div className="text-[11px] text-neutral-400 mt-1 font-medium bg-neutral-50 inline-block px-2 py-0.5 rounded border border-neutral-100 cursor-pointer hover:bg-neutral-100 transition-colors">来源: 竞品评论样本分析</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-t border-neutral-100 pt-8">
                      <h4 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><Compass size={18} className="text-blue-500"/> 待验证假设</h4>
                      <ul className="text-[14px] text-neutral-700 space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2"></span>
                          <div>
                            <div className="font-bold text-neutral-900">专业育宠师人设可提升私信咨询转化率</div>
                            <div className="text-[11px] text-blue-600 mt-1 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-100">本轮核心验证</div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-neutral-100 pt-8">
                      <h4 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500"/> 缺少的信息</h4>
                      <ul className="text-[14px] text-amber-800 space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2"></span>
                          <div>
                            <div>近30天的竞品痛点评论样本</div>
                            <div className="text-[11px] text-amber-700 mt-1 font-bold bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">补充资料</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                 </div>
                 
                 {currentProject.status === "立项草案" && (
                   <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-end">
                     <button 
                       onClick={() => handleAction("confirm_strategy")}
                       className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 rounded-xl text-[14px] font-bold shadow-sm transition-all flex items-center gap-2"
                     >
                       确认策略，进入筹备 <ArrowRight size={16} />
                     </button>
                   </div>
                 )}
               </div>
            </div>
          )}

          {detailTab === "执行批次" && (
            <div className="max-w-5xl mx-auto space-y-6">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[18px] font-bold text-neutral-900">批次摘要</h3>
               </div>
               
               {currentProject.batches && currentProject.batches.length > 0 ? (
                 <div className="space-y-4">
                   {currentProject.batches.map((batch: any) => (
                     <div key={batch.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
                         <div className="flex items-center gap-3">
                           <h4 className="text-[16px] font-bold text-neutral-900">{batch.name}</h4>
                           <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-[12px] font-bold rounded-md">{batch.stage}</span>
                         </div>
                         <button className="text-[13px] font-bold text-primary-700 bg-primary-50 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors flex items-center gap-2">前往执行中心处理 <ExternalLink size={14}/></button>
                       </div>
                       <div className="grid grid-cols-4 gap-6">
                         <div>
                           <div className="text-[12px] text-neutral-500 font-bold mb-2">准备度</div>
                           <div className="text-[18px] font-bold text-neutral-900">{batch.readiness}</div>
                         </div>
                         <div>
                           <div className="text-[12px] text-neutral-500 font-bold mb-2">完成数/目标数</div>
                           <div className="text-[18px] font-bold text-neutral-900">{batch.progress}</div>
                         </div>
                         <div>
                           <div className="text-[12px] text-neutral-500 font-bold mb-2">主要异常</div>
                           <div className={`text-[15px] font-bold flex items-center gap-1.5 ${batch.anomaly !== '无' ? 'text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 inline-flex' : 'text-neutral-900'}`}>
                             {batch.anomaly !== '无' && <AlertTriangle size={14}/>}
                             {batch.anomaly}
                           </div>
                         </div>
                         <div>
                           <div className="text-[12px] text-neutral-500 font-bold mb-2">下一检查点</div>
                           <div className="text-[15px] font-bold text-neutral-900">{batch.nextCheck}</div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="bg-white border border-neutral-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                     <Layers size={24} className="text-neutral-400" />
                   </div>
                   <h4 className="text-[16px] font-bold text-neutral-900 mb-2">暂无执行批次</h4>
                   <p className="text-[14px] text-neutral-500">确认策略并完成筹备后，系统将自动生成执行批次。</p>
                 </div>
               )}
            </div>
          )}

          {detailTab === "结果与复盘" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                   <BarChart2 size={24} className="text-neutral-400" />
                 </div>
                 <h4 className="text-[16px] font-bold text-neutral-900 mb-2">数据观察中</h4>
                 <p className="text-[14px] text-neutral-500">将在观察窗口结束后生成完整复盘报告。</p>
              </div>
            </div>
          )}
          
          {detailTab === "变更记录" && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                     {currentProject.recentChanges && currentProject.recentChanges.map((change: any, idx: number) => (
                       <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-neutral-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 mt-1 relative z-10" />
                         <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-4">
                           <div className="flex flex-col mb-1.5">
                             <div className="text-[15px] font-bold text-neutral-900">{change.action}</div>
                             <time className="text-[12px] text-neutral-400 font-medium mt-0.5">{change.time} • {change.user}</time>
                           </div>
                           <div className="text-[13px] text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 mt-2">{change.desc}</div>
                         </div>
                       </div>
                     ))}
                     {(!currentProject.recentChanges || currentProject.recentChanges.length === 0) && (
                       <div className="text-[14px] text-neutral-400 pl-8">暂无变化记录</div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* RIGHT DRAWER */}
        <AnimatePresence>
          {drawerType && drawerType !== "create_project" && (
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute right-0 top-0 bottom-0 ${drawerType === 'create_project' ? 'w-[calc(100%-300px)]' : 'w-[440px]'} bg-white shadow-[calc(-10px)_0_40px_rgba(0,0,0,0.1)] border-l border-neutral-200 z-50 flex flex-col`}
            >
              {renderDrawerContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
