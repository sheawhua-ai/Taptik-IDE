import fs from 'fs';

const content = `import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Sparkles, AlertCircle, ArrowRight, CheckCircle2,
  ChevronLeft, MessageSquare, Target, Calendar, FileText,
  Send, Users, Clock, ShieldCheck, Activity,
  Edit3, History, Check, X, Layers, FileBox,
  Compass, BarChart2, Eye, ShieldAlert,
  Download, ExternalLink, Zap, ChevronRight, ListTodo, ChevronDown
} from "lucide-react";

export interface ProjectCenterProps {
  hasData?: boolean;
  activeProjectId?: string;
  setWorkflowTab?: (tab: string) => void;
}

// Mock Data
const MOCK_PROJECTS = [
  {
    id: "d1",
    name: "幼犬换粮搜索卡位第二轮",
    status: "立项草案",
    target: "解决幼犬人群渗透率低，补齐高质量KOS测评",
    stage: "等待确认本轮策略",
    keyProgress: "问题与目标已确认",
    blocker: "AI推荐了3个备选策略等待选择",
    primaryActionText: "确认本轮策略",
    recommendedAction: "confirm_strategy",
    period: "未定",
    pic: "未定",
    pendingCount: 1,
    aiActionCard: {
      title: "策略草案待确认",
      reason: "幼犬人群渗透率较低，缺少高质量KOS测评案例与标准化客服承接话术",
      impact: "不确认策略将无法进入筹备阶段"
    }
  },
  {
    id: "p1",
    name: "幼犬换粮避坑搜索卡位",
    status: "执行",
    target: "搜索卡位 + 私域线索承接",
    stage: "第一批内容发布中",
    keyProgress: "首批4篇笔记已领取任务",
    blocker: "存在2篇发布异常",
    primaryActionText: "处理当前异常",
    recommendedAction: "handle_anomaly",
    period: "2026-07-01 至 2026-07-20",
    pic: "张操盘",
    pendingCount: 2,
    aiActionCard: {
      title: "2篇内容发布异常",
      reason: "目标账号异常或员工端未响应，已影响首批内容铺设进度。",
      impact: "不处理将导致搜索卡位目标无法如期达成。"
    }
  },
  {
    id: "p2",
    name: "KOS店长号第一人称开箱SOP",
    status: "筹备",
    target: "建构专业人设与高转化私信链路",
    stage: "准备首批执行单元",
    keyProgress: "内容草稿与素材已齐备",
    blocker: "发布账号与方式未确认",
    primaryActionText: "确认发布安排",
    recommendedAction: "confirm_publish",
    period: "2026-07-25 至 2026-08-10",
    pic: "李营销",
    pendingCount: 1,
    aiActionCard: {
      title: "发布方式尚未确认",
      reason: "首批内容和素材已经准备完成，但KOS店长号的实际发布人和发布方式尚未确认。",
      impact: "项目暂时不能进入执行。"
    }
  },
  {
    id: "p3",
    name: "618防软便粮爆文打法",
    status: "完成",
    target: "爆文种草 + 品牌认知爆破",
    stage: "等待7天观察窗口",
    keyProgress: "已发布50篇笔记",
    blocker: "初步复盘已生成，将在观察窗口结束后更新",
    primaryActionText: "查看观察进度",
    recommendedAction: "view_observation",
    period: "2026-06-01 至 2026-06-20",
    pic: "张操盘",
    pendingCount: 1,
    aiActionCard: {
      title: "等待观察窗口成熟",
      reason: "最后一批内容发布不足7天，数据尚未完全稳定。",
      impact: "提前复盘可能导致长尾流量归因不准确。"
    }
  },
  {
    id: "p4",
    name: "肠胃敏感犬粮大促蓄水企划",
    status: "归档",
    target: "大促预热 + 试吃装引流",
    stage: "项目已归档",
    keyProgress: "知识与资产已沉淀",
    blocker: "无",
    primaryActionText: "查看项目档案",
    recommendedAction: "view_archive",
    period: "2026-05-01 至 2026-05-20",
    pic: "李营销",
    pendingCount: 0,
    aiActionCard: null
  }
];

export function ProjectCenter({
  hasData = true,
  activeProjectId = "d1",
  setWorkflowTab
}: ProjectCenterProps) {
  const [statusFilter, setStatusFilter] = useState<string>("需要我处理");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjectId);
  const [detailTab, setDetailTab] = useState<"总览" | "策略与计划" | "内容与素材" | "发布与互动" | "变更记录">("总览");

  const [drawerType, setDrawerType] = useState<string | null>(null); // confirm_strategy, confirm_publish, handle_anomaly, pause_project, etc.
  const [aiChatInput, setAiChatInput] = useState("");

  const projects = MOCK_PROJECTS;
  
  const filteredProjects = projects.filter(p => {
    if (statusFilter === "全部") return true;
    if (statusFilter === "需要我处理") {
      return ["confirm_strategy", "confirm_publish", "handle_anomaly", "view_observation", "handle_material_gap", "review_content"].includes(p.recommendedAction);
    }
    return p.status === statusFilter;
  });

  // Grouping for "需要我处理"
  const drafts = filteredProjects.filter(p => p.status === "立项草案");
  const formals = filteredProjects.filter(p => p.status !== "立项草案");

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "筹备": return "text-blue-700 bg-blue-50 border-blue-200";
      case "执行": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "暂停": return "text-amber-700 bg-amber-50 border-amber-200";
      case "完成": return "text-purple-700 bg-purple-50 border-purple-200";
      case "归档": return "text-neutral-600 bg-neutral-100 border-neutral-200";
      case "立项草案": return "text-primary-700 bg-primary-50 border-primary-200";
      default: return "text-neutral-700 bg-neutral-100 border-neutral-200";
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "confirm_strategy") setDrawerType("confirm_strategy");
    else if (action === "confirm_publish") setDrawerType("confirm_publish");
    else if (action === "handle_anomaly") setDrawerType("handle_anomaly");
    else if (action === "pause_project") setDrawerType("pause_project");
    else if (action === "resume_project") setDrawerType("resume_project");
    else if (action === "end_project") setDrawerType("end_project");
    else if (action === "view_observation") alert("带入项目上下文，打开观察进度或AI复盘工作区 (全屏)");
    else if (action === "archive_project") setDrawerType("archive_project");
    else alert(\`Triggering action: \${action}\`);
  };

  const renderDrawerContent = () => {
    switch (drawerType) {
      case "confirm_strategy":
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="p-5 border-b border-neutral-100 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[16px] text-neutral-900">确认本轮策略</h3>
                <div className="text-[12px] text-neutral-500 mt-0.5">{currentProject.name}</div>
              </div>
              <button onClick={() => setDrawerType(null)} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-4 text-[13px]">
                <div className="bg-primary-50/50 p-3 rounded-xl border border-primary-100/50">
                  <div className="text-[12px] font-bold text-primary-700 mb-1">AI 推荐策略</div>
                  <div className="text-[14px] font-bold text-neutral-900 mb-1">KOS真实开箱与评论区痛点答疑</div>
                  <div className="text-neutral-600">以店长第一人称视角拍摄从收货到开箱的真实过程，在评论区直接挂出政策，降低决策门槛。</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-neutral-400 font-bold mb-1">内容规模</div><div className="font-medium text-neutral-900">15 篇图文</div></div>
                  <div><div className="text-neutral-400 font-bold mb-1">账号安排</div><div className="font-medium text-neutral-900">3个主理人店长号</div></div>
                  <div><div className="text-neutral-400 font-bold mb-1">素材要求</div><div className="font-medium text-neutral-900">12张室内实拍原图</div></div>
                  <div><div className="text-neutral-400 font-bold mb-1">周期预算</div><div className="font-medium text-neutral-900">14天 / ¥0</div></div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <div className="text-neutral-400 font-bold mb-2">验证方式</div>
                  <ul className="list-disc pl-4 text-neutral-700 space-y-1">
                    <li>发布后7天的收藏、评论相对该账号历史同类内容的变化。</li>
                    <li>评论区是否出现目标用户主动询问试吃政策。</li>
                  </ul>
                </div>
              </div>

              {/* Chat Input for adjustment */}
              <div className="mt-4">
                <div className="text-[12px] font-bold text-neutral-500 mb-2">告诉AI你的调整要求</div>
                <div className="relative">
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={e => setAiChatInput(e.target.value)}
                    placeholder="例如：不考虑搜索排名..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-3 pr-10 text-[12px] outline-none focus:border-primary-500"
                    onKeyDown={e => e.key === 'Enter' && setAiChatInput("")}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3">
              <button onClick={() => setDrawerType(null)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">稍后决定</button>
              <button onClick={() => { alert("向后端请求创建项目..."); setDrawerType(null); }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">确认并创建项目</button>
            </div>
          </div>
        );
      case "confirm_publish":
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="p-5 border-b border-neutral-100 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[16px] text-neutral-900">确认发布安排</h3>
                <div className="text-[12px] text-neutral-500 mt-0.5">{currentProject.name}</div>
              </div>
              <button onClick={() => setDrawerType(null)} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="text-[12px] text-neutral-500 mb-1">目标账号</div>
                <div className="text-[14px] font-bold text-neutral-900">小红书-店长A号</div>
                <div className="text-[12px] text-neutral-500 mt-2 mb-1">账号角色</div>
                <div className="text-[13px] font-medium text-neutral-800">主理人 / 专家人设</div>
              </div>
              
              <div>
                <label className="text-[12px] font-bold text-neutral-700 block mb-1.5">实际发布人</label>
                <select className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-primary-500">
                  <option>王美丽 (员工)</option>
                  <option>张操盘 (操盘手)</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-bold text-neutral-700 block mb-1.5">发布方式</label>
                <select className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-primary-500">
                  <option>员工手机人工发布</option>
                  <option>操盘手人工发布</option>
                  <option>已接入的合法自动发布</option>
                </select>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="text-[12px] font-bold text-blue-900 mb-1">当前可触达状态：在线</div>
                <div className="text-[11px] text-blue-800">任务链接将自动推送到员工客户端。</div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3">
              <button onClick={() => setDrawerType(null)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">取消</button>
              <button onClick={() => { alert("向后端请求更新状态..."); setDrawerType(null); }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">确认发布安排</button>
            </div>
          </div>
        );
      case "handle_anomaly":
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="p-5 border-b border-neutral-100 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[16px] text-neutral-900">处理当前异常</h3>
                <div className="text-[12px] text-neutral-500 mt-0.5">2篇内容发布异常</div>
              </div>
              <button onClick={() => setDrawerType(null)} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="border border-red-100 bg-red-50/30 rounded-xl p-4">
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">幼犬换粮避坑指南 (图文)</div>
                    <div className="text-[12px] text-neutral-600 mb-3 flex items-center gap-3">
                      <span>王美丽</span>
                      <span>小红书-店长A</span>
                    </div>
                    <div className="text-[12px] text-red-700 bg-red-100/50 p-2 rounded mb-3">
                      失败原因：员工客户端超时未响应 (超24小时)
                    </div>
                    <select className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-[12px] outline-none">
                      <option>重新下发提醒</option>
                      <option>更换发布人</option>
                      <option>标记暂不发布</option>
                    </select>
                 </div>
               ))}
            </div>
            <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3">
              <button onClick={() => setDrawerType(null)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">取消</button>
              <button onClick={() => { alert("处理方案已提交"); setDrawerType(null); }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">确认处理方案</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-5">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold">通用抽屉</h3>
               <button onClick={() => setDrawerType(null)}><X size={18} /></button>
             </div>
             <p>Drawer Content: {drawerType}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-[#fcfcfc] text-neutral-900 font-sans relative">
      
      {/* LEFT SIDEBAR: Project List */}
      <div className="w-[300px] shrink-0 border-r border-neutral-200 flex flex-col bg-[#fcfcfc] z-10 relative">
        <div className="p-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[18px] font-bold text-neutral-900 tracking-tight">项目中心</h1>
            <button className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="开启新一轮">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="搜索项目" 
              className="w-full bg-white border border-neutral-200 rounded-xl py-2 pl-3 pr-8 text-[12px] outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "需要我处理", isSmart: true },
              { label: "筹备", isSmart: false },
              { label: "执行", isSmart: false },
              { label: "暂停", isSmart: false },
              { label: "完成", isSmart: false },
              { label: "归档", isSmart: false },
              { label: "全部", isSmart: false }
            ].map(f => (
              <button
                key={f.label}
                onClick={() => setStatusFilter(f.label)}
                className={\`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all \${
                  statusFilter === f.label
                    ? f.isSmart ? "bg-primary-50 text-primary-700 border border-primary-200" : "bg-neutral-900 text-white border border-neutral-900"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }\`}
              >
                {f.label} {f.isSmart && statusFilter !== f.label && <span className="ml-1 opacity-60">3</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {statusFilter === "需要我处理" && drafts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-neutral-400 px-2 mb-2 uppercase tracking-wide">立项草案</div>
              <div className="space-y-2">
                {drafts.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                      selectedProjectId === proj.id
                        ? "bg-white border-primary-300 shadow-sm ring-1 ring-primary-100"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }\`}
                  >
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 leading-snug">{proj.name}</div>
                    <div className="text-[11px] text-neutral-500 mb-2 truncate">{proj.blocker}</div>
                    <div className="flex items-center justify-between">
                      <span className={\`px-1.5 py-0.5 rounded text-[10px] font-bold border \${getStatusColor(proj.status)}\`}>
                        {proj.status}
                      </span>
                      {proj.pendingCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">待处理 {proj.pendingCount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            {statusFilter === "需要我处理" && formals.length > 0 && (
              <div className="text-[11px] font-bold text-neutral-400 px-2 mb-2 mt-2 uppercase tracking-wide">正式项目</div>
            )}
            <div className="space-y-2">
              {formals.length === 0 && drafts.length === 0 ? (
                <div className="p-4 text-center text-neutral-400 text-[12px]">
                  当前没有符合条件的项目
                </div>
              ) : (
                formals.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                      selectedProjectId === proj.id
                        ? "bg-white border-neutral-400 shadow-sm ring-1 ring-neutral-200"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }\`}
                  >
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 leading-snug">{proj.name}</div>
                    <div className="text-[11px] text-neutral-500 mb-2 truncate">{proj.stage}</div>
                    <div className="text-[11px] text-neutral-600 mb-2 truncate flex items-center gap-1">
                      <AlertCircle size={10} className={proj.pendingCount > 0 ? "text-amber-500" : "text-neutral-400"} />
                      {proj.blocker}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={\`px-1.5 py-0.5 rounded text-[10px] font-bold border \${getStatusColor(proj.status)}\`}>
                        {proj.status}
                      </span>
                      {proj.pendingCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">待处理 {proj.pendingCount}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Workspace Header */}
        <div className="px-8 py-5 border-b border-neutral-200 shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
                {currentProject.name}
                <span className={\`px-2 py-0.5 text-[11px] font-bold rounded border \${getStatusColor(currentProject.status)}\`}>
                  {currentProject.status}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg"><ExternalLink size={18} /></button>
              
              <div className="relative group">
                <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-xl hover:bg-neutral-50">更多操作</button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-neutral-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                  <button onClick={() => handleActionClick("pause_project")} className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg">暂停项目</button>
                  <button onClick={() => handleActionClick("end_project")} className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg text-amber-600">结束本轮</button>
                  <button className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg">导出项目</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-neutral-600 mb-5">
            <div><span className="text-neutral-400">本轮目标：</span><strong className="text-neutral-800">{currentProject.target}</strong></div>
            <div><span className="text-neutral-400">负责人：</span><strong className="text-neutral-800">{currentProject.pic}</strong></div>
            <div><span className="text-neutral-400">周期：</span><strong className="text-neutral-800">{currentProject.period}</strong></div>
            {currentProject.status !== "立项草案" && (
              <div><span className="text-neutral-400">策略版本：</span><strong className="text-neutral-800">v1.0</strong></div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6">
            {["总览", "策略与计划", "内容与素材", "发布与互动", "变更记录"].map(tab => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab as any)}
                className={\`pb-3 text-[14px] font-bold transition-all relative \${detailTab === tab ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}\`}
              >
                {tab}
                {detailTab === tab && (
                  <motion.div layoutId="detail-tab-indicator" className="absolute bottom-0 left-0 w-full h-[3px] bg-neutral-900 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#fcfcfc]">
          {detailTab === "总览" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* AI Action Card */}
              {currentProject.aiActionCard ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-primary-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide mb-1">现在最值得处理</div>
                      <h3 className="text-[16px] font-bold text-neutral-900 mb-2">{currentProject.aiActionCard.title}</h3>
                      <p className="text-[13px] text-neutral-600 mb-1">{currentProject.aiActionCard.reason}</p>
                      <p className="text-[12px] font-medium text-amber-700 mb-4">{currentProject.aiActionCard.impact}</p>
                      <button 
                        onClick={() => handleActionClick(currentProject.recommendedAction)}
                        className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                      >
                        {currentProject.primaryActionText}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-emerald-800 text-[13px] font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} /> 当前阶段无卡点，项目运转正常。
                </div>
              )}

              {/* Execution Batches */}
              {currentProject.status !== "立项草案" && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-neutral-900">当前执行批次</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Example Batch Card */}
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-[14px] font-bold text-neutral-900">第一批分发</div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">发布中</span>
                        </div>
                        <div className="space-y-1.5 text-[12px]">
                          <div className="flex justify-between"><span className="text-neutral-500">内容数量</span><span className="font-medium">4 篇图文</span></div>
                          <div className="flex justify-between"><span className="text-neutral-500">目标账号</span><span className="font-medium">店长A/B</span></div>
                          <div className="flex justify-between"><span className="text-neutral-500">素材状态</span><span className="font-medium text-emerald-600">已验收 4/4</span></div>
                        </div>
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-70">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-[14px] font-bold text-neutral-900">第二批分发</div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">准备中</span>
                        </div>
                        <div className="space-y-1.5 text-[12px]">
                          <div className="flex justify-between"><span className="text-neutral-500">内容数量</span><span className="font-medium">6 篇图文</span></div>
                          <div className="flex justify-between"><span className="text-neutral-500">草稿状态</span><span className="font-medium text-amber-600">待审 6</span></div>
                          <div className="flex justify-between"><span className="text-neutral-500">素材状态</span><span className="font-medium text-amber-600">缺 12</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-[14px] font-bold text-neutral-900 mb-4">最近三条项目动态</div>
                    <div className="space-y-4 border-l-2 border-neutral-100 ml-2 pl-4 py-1">
                       <div className="relative">
                         <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-300 ring-4 ring-white" />
                         <div className="text-[12px] text-neutral-400 mb-0.5">今天 10:30 • 张操盘 (IDE)</div>
                         <div className="text-[13px] font-medium text-neutral-800">处理异常：重新关联了2篇笔记链接</div>
                       </div>
                       <div className="relative">
                         <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-white" />
                         <div className="text-[12px] text-neutral-400 mb-0.5">昨天 15:20 • 王店长 (员工端)</div>
                         <div className="text-[13px] font-medium text-neutral-800">回传素材：上传了 4 张场景实拍图</div>
                       </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {detailTab === "策略与计划" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               策略与计划详细内容
            </div>
          )}
          {detailTab === "内容与素材" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               按执行批次展示内容草稿与素材缺口
            </div>
          )}
          {detailTab === "发布与互动" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               展示项目内发布任务和笔记结果
            </div>
          )}
          {detailTab === "变更记录" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               按时间轴展示操作记录
            </div>
          )}
        </div>

        {/* RIGHT DRAWER */}
        <AnimatePresence>
          {drawerType && (
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[420px] bg-white shadow-[calc(-10px)_0_30px_rgba(0,0,0,0.05)] border-l border-neutral-200 z-50 flex flex-col"
            >
              {renderDrawerContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
