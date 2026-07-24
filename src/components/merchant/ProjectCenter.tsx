import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderKanban, Plus, Search, Calendar, Users, FileText, Check, X,
  AlertTriangle, Trash2, Edit2, Play, Bot, User, ArrowRight, Activity,
  Settings, ExternalLink, Target, CheckCircle2, History, Orbit, MoreHorizontal, PauseCircle
} from "lucide-react";
import { CreateProjectWorkstation } from "./CreateProjectWorkstation";
import { StrategyProtocol } from "./ProjectCenter/StrategyProtocol";
import { ProjectOrchestration } from "./ProjectCenter/ProjectOrchestration";
import { NoteLedger } from "./ProjectCenter/NoteLedger";
import { RunLogDrawer } from "./ProjectCenter/RunLogDrawer";

// Types
export interface Project {
  id: string;
  name: string;
  status: "筹备" | "执行" | "暂停" | "完成" | "归档";
  target: string;
  period: string;
  currentCheckpoint: string;
  importantException: string;
  pendingCount: number;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "幼犬换粮搜索卡位第三轮",
    status: "执行",
    target: "验证“换粮软便”内容能否提升收藏、有效评论和人工登记的咨询线索",
    period: "2024-03-01 - 2024-03-15",
    currentCheckpoint: "发布与观察",
    importantException: "3篇笔记待审核",
    pendingCount: 3,
  },
  {
    id: "p2",
    name: "春季换新用户共创",
    status: "筹备",
    target: "招募KOC体验春季新品并输出真实测评",
    period: "2024-04-01 - 2024-04-20",
    currentCheckpoint: "素材收集",
    importantException: "缺2组真实测评素材",
    pendingCount: 2,
  },
];

export function ProjectCenter() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("全部");
  const [detailTab, setDetailTab] = useState<"总览" | "策略协议" | "项目编排" | "笔记台账">("总览");
  const [drawerType, setDrawerType] = useState<"create_project" | "run_log" | null>(null);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(p => {
    if (searchQuery && !p.name.includes(searchQuery)) return false;
    if (filterStatus !== "全部" && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="h-full w-full flex bg-[#fcfcfc] text-neutral-900 relative">
      {/* Left: Project List */}
      <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-neutral-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[16px] font-bold">项目列表</h2>
            <button 
              onClick={() => setDrawerType("create_project")}
              className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-lg text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["全部", "筹备", "执行", "暂停", "完成", "归档"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-[12px] rounded-full font-medium transition-colors ${
                  filterStatus === status 
                    ? "bg-neutral-900 text-white" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProjects.map(proj => (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedProjectId === proj.id
                  ? "bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900"
                  : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[14px] line-clamp-1 flex-1 pr-2">{proj.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                  proj.status === "执行" ? "bg-emerald-100 text-emerald-700" :
                  proj.status === "筹备" ? "bg-amber-100 text-amber-700" :
                  "bg-neutral-100 text-neutral-600"
                }`}>
                  {proj.status}
                </span>
              </div>
              <div className="text-[12px] text-neutral-500 mb-2 flex items-center gap-1">
                <Target size={12} /> {proj.currentCheckpoint}
              </div>
              {proj.importantException && (
                <div className="text-[12px] text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1 mt-2">
                  <AlertTriangle size={12} /> {proj.importantException}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentProject ? (
          <>
            {/* Workspace Header */}
            <div className="px-8 py-6 bg-white border-b border-neutral-200 shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-[24px] font-extrabold">{currentProject.name}</h1>
                    <span className={`text-[12px] px-2.5 py-1 rounded-full font-bold ${
                      currentProject.status === "执行" ? "bg-emerald-100 text-emerald-700" :
                      currentProject.status === "筹备" ? "bg-amber-100 text-amber-700" :
                      "bg-neutral-100 text-neutral-600"
                    }`}>
                      {currentProject.status}
                    </span>
                  </div>
                  <p className="text-[14px] text-neutral-600 max-w-3xl flex items-center gap-2">
                    <Target size={16} className="text-neutral-400" /> {currentProject.target}
                  </p>
                  <p className="text-[13px] text-neutral-500 mt-2 flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-400" /> {currentProject.period}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setDrawerType("run_log")}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold transition-colors"
                  >
                    <History size={16} /> 运行记录
                  </button>
                  <button className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-8">
                {(["总览", "策略协议", "项目编排", "笔记台账"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`text-[15px] font-bold pb-3 transition-all relative ${
                      detailTab === tab 
                        ? "text-neutral-900" 
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {tab}
                    {detailTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900 rounded-t-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {detailTab === "总览" && (
                <ProjectOverviewTab 
                  project={currentProject} 
                  onNavigate={setDetailTab}
                />
              )}
              {detailTab === "策略协议" && <StrategyProtocol project={currentProject} />}
              {detailTab === "项目编排" && <ProjectOrchestration project={currentProject} />}
              {detailTab === "笔记台账" && <NoteLedger project={currentProject} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
            <Orbit size={48} className="mb-4 text-neutral-200" />
            <p>请选择左侧项目或新建项目</p>
          </div>
        )}
      </div>

      {/* Drawers & Modals */}
      <AnimatePresence>
        {drawerType === "create_project" && (
          <div className="absolute inset-0 z-50 bg-[#fcfcfc] flex flex-col">
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
        
        {drawerType === "run_log" && (
          <RunLogDrawer onClose={() => setDrawerType(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub Components ---

function ProjectOverviewTab({ project, onNavigate }: { project: Project, onNavigate: (tab: any) => void }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Current Checkpoint */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <h2 className="text-[16px] font-bold mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-primary-500" /> 当前检查点
        </h2>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-[13px] text-neutral-500 mb-1">当前阶段</div>
            <div className="text-[15px] font-bold text-neutral-900">{project.currentCheckpoint}</div>
          </div>
          <div>
            <div className="text-[13px] text-neutral-500 mb-1">已完成事项</div>
            <div className="text-[15px] font-medium text-neutral-700">素材收集完成, 稿件已生成</div>
          </div>
          <div>
            <div className="text-[13px] text-neutral-500 mb-1">当前阻断</div>
            <div className="text-[15px] font-bold text-red-600 flex items-center gap-1">
              <AlertTriangle size={14} /> 缺2组真实评测素材
            </div>
          </div>
          <div className="flex flex-col justify-end">
             <button onClick={() => onNavigate("项目编排")} className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-[13px] font-bold w-full">
               去补齐开工条件
             </button>
          </div>
        </div>
      </div>

      {/* Project Process */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <h2 className="text-[16px] font-bold mb-6">项目进程</h2>
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-neutral-100 -z-10" />
          
          {["策略确认", "筹备就绪", "内容与素材", "发布执行", "观察", "复盘", "完成"].map((step, idx) => {
            const isActive = idx === 2;
            const isPast = idx < 2;
            return (
              <div key={step} className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => onNavigate("项目编排")}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] transition-colors ${
                  isActive ? "bg-neutral-900 text-white ring-4 ring-neutral-100" :
                  isPast ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"
                }`}>
                  {isPast ? <Check size={14} /> : idx + 1}
                </div>
                <div className={`text-[13px] font-bold ${isActive ? "text-neutral-900" : isPast ? "text-neutral-700" : "text-neutral-400"}`}>
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Note Progress */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-[16px] font-bold">笔记进度摘要</h2>
             <button onClick={() => onNavigate("笔记台账")} className="text-[13px] text-primary-600 font-bold hover:underline">查看台账 &rarr;</button>
           </div>
           <div className="grid grid-cols-3 gap-y-6 gap-x-4">
             <div className="cursor-pointer group" onClick={() => onNavigate("笔记台账")}>
               <div className="text-[12px] text-neutral-500 mb-1">计划笔记数</div>
               <div className="text-[24px] font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors">20</div>
             </div>
             <div className="cursor-pointer group" onClick={() => onNavigate("笔记台账")}>
               <div className="text-[12px] text-neutral-500 mb-1">已生成</div>
               <div className="text-[24px] font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors">15</div>
             </div>
             <div className="cursor-pointer group" onClick={() => onNavigate("笔记台账")}>
               <div className="text-[12px] text-neutral-500 mb-1">已发布</div>
               <div className="text-[24px] font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors">5</div>
             </div>
             <div className="cursor-pointer group" onClick={() => onNavigate("笔记台账")}>
               <div className="text-[12px] text-neutral-500 mb-1">观察中</div>
               <div className="text-[24px] font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors">5</div>
             </div>
             <div className="cursor-pointer group" onClick={() => onNavigate("笔记台账")}>
               <div className="text-[12px] text-red-500 mb-1">异常数</div>
               <div className="text-[24px] font-extrabold text-red-600 group-hover:text-red-700 transition-colors">3</div>
             </div>
           </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
           <h2 className="text-[16px] font-bold mb-6 flex items-center gap-2">
             <AlertTriangle size={18} className="text-amber-500" /> 需要操盘手处理
           </h2>
           <div className="space-y-4">
             {[
               { id: 1, event: "3篇生成稿件等待审核", impact: "延迟发布进度", btnText: "去审核" },
               { id: 2, event: "KOC素材验收不合格", impact: "2个发布位空缺", btnText: "处理素材" }
             ].map(item => (
               <div key={item.id} className="p-4 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
                 <div>
                   <div className="text-[14px] font-bold text-neutral-900 mb-1">{item.event}</div>
                   <div className="text-[12px] text-neutral-500">影响: {item.impact}</div>
                 </div>
                 <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold hover:bg-neutral-50 shadow-sm transition-colors">
                   {item.btnText}
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>

    </div>
  );
}
