import fs from 'fs';

const fileContent = `import React, { useState } from "react";
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

export function ProjectCenter({
  hasData = true,
  activeProjectId = "p1",
  setWorkflowTab
}: ProjectCenterProps) {
  // Main view state: "list" | "detail" | "wizard"
  const [viewState, setViewState] = useState<"list" | "detail" | "wizard">("list");
  
  // Filtering & Selection
  const [statusFilter, setStatusFilter] = useState<string>("需要我处理");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("p1");
  const [detailTab, setDetailTab] = useState<
    "总览" | "策略与计划" | "内容与素材" | "发布与互动" | "变更记录"
  >("总览");

  // Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showLinkMethodModal, setShowLinkMethodModal] = useState(false);
  const [showStartExecModal, setShowStartExecModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showStrategyChangeModal, setShowStrategyChangeModal] = useState(false);
  const [aiChatInput, setAiChatInput] = useState("");

  const [projects, setProjects] = useState([
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
      pic: "未定"
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
      pic: "张操盘"
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
      pic: "李营销"
    },
    {
      id: "p3",
      name: "618防软便粮爆文打法",
      status: "完成",
      target: "爆文种草 + 品牌认知爆破",
      stage: "等待7天观察窗口",
      keyProgress: "已发布50篇笔记",
      blocker: "AI复盘已生成",
      primaryActionText: "查看AI复盘",
      recommendedAction: "view_ai_review",
      period: "2026-06-01 至 2026-06-20",
      pic: "张操盘"
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
      pic: "李营销"
    }
  ]);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(p => {
    if (statusFilter === "全部") return true;
    if (statusFilter === "需要我处理") {
      return ["confirm_strategy", "confirm_publish", "handle_material_gap", "review_content", "handle_anomaly", "view_resume_conditions", "answer_background", "view_ai_review"].includes(p.recommendedAction);
    }
    return p.status === statusFilter;
  });

  const handleCardPrimaryAction = (proj: any) => {
    setSelectedProjectId(proj.id);
    if (proj.status === "立项草案") {
      setViewState("wizard");
      setWizardStep(2);
    } else {
      setViewState("detail");
      setDetailTab("总览");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] text-neutral-900 overflow-hidden font-sans">
      {/* 1. PROJECT CENTER LANDING VIEW */}
      {viewState === "list" && (
        <div className="h-full flex flex-col overflow-y-auto px-8 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">
                项目中心
              </h1>
              <p className="text-[13px] text-neutral-500 mt-1">
                从AI立项到执行复盘，持续管理商家的每一轮运营项目。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button
                  onClick={() => {
                    setWizardStep(1);
                    setViewState("wizard");
                  }}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  开启新一轮
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-1">
                    <button className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg">
                      从模板创建
                    </button>
                    <button className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg">
                      创建空白草案
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-[12px] font-bold text-neutral-400 w-16">智能视图</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter("需要我处理")}
                  className={\`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all \${
                    statusFilter === "需要我处理" ? "bg-primary-50 text-primary-700 border border-primary-200" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }\`}
                >
                  需要我处理 <span className="ml-1 px-1.5 py-0.5 bg-primary-100 text-primary-800 rounded text-[10px]">3</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[12px] font-bold text-neutral-400 w-16">项目状态</div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {["筹备", "执行", "暂停", "完成", "归档", "全部"].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={\`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all \${
                      statusFilter === st ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }\`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                className="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden relative cursor-pointer"
                onClick={() => handleCardPrimaryAction(proj)}
              >
                {/* State line */}
                <div className={\`h-1 w-full \${proj.status === "立项草案" ? "bg-primary-400" : proj.status === "筹备" ? "bg-blue-400" : proj.status === "执行" ? "bg-emerald-500" : proj.status === "暂停" ? "bg-amber-500" : "bg-neutral-400"}\`} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-[16px] font-bold text-neutral-900 leading-snug truncate">
                      {proj.name}
                    </h3>
                    <span className={\`px-2.5 py-0.5 text-[11px] font-bold rounded-md border shrink-0 \${proj.status === "立项草案" ? "bg-primary-50 text-primary-700 border-primary-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"}\`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4 flex-1">
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-0.5">本轮目标</div>
                      <div className="text-[13px] text-neutral-800 font-medium truncate">{proj.target}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-0.5">当前阶段</div>
                      <div className="text-[13px] text-neutral-800 font-medium">{proj.stage}</div>
                    </div>
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span className="text-[12px] font-bold text-neutral-700 truncate">{proj.keyProgress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle size={13} className={\`\${proj.status === "执行" && proj.blocker.includes("异常") ? "text-red-600" : "text-amber-600"}\`} />
                        <span className="text-[12px] font-bold text-neutral-700 truncate">{proj.blocker}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      周期：{proj.period}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCardPrimaryAction(proj); }}
                      className={\`px-4 py-2 rounded-xl text-[12px] font-bold transition-colors flex items-center gap-1.5 shadow-sm \${
                        proj.recommendedAction === "handle_anomaly"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : proj.status === "立项草案"
                          ? "bg-primary-600 hover:bg-primary-700 text-white"
                          : "bg-neutral-900 hover:bg-neutral-800 text-white"
                      }\`}
                    >
                      {proj.primaryActionText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WIZARD: AI 协同立项 */}
      {viewState === "wizard" && (
        <div className="h-full flex flex-col bg-white overflow-hidden">
          <div className="px-8 py-4 border-b border-neutral-100 flex flex-col shrink-0 bg-neutral-50/50">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setViewState("list")}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-[16px] font-bold text-neutral-900">AI 协同立项</h2>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-bold">
              <span className={\`\${wizardStep >= 1 ? "text-neutral-900" : "text-neutral-400"}\`}>本轮问题{wizardStep > 1 ? "已确认" : "待确认"}</span>
              <span className="text-neutral-300">|</span>
              <span className={\`\${wizardStep >= 2 ? "text-neutral-900" : "text-neutral-400"}\`}>策略{wizardStep > 2 ? "已确认" : "待确认"}</span>
              <span className="text-neutral-300">|</span>
              <span className={\`\${wizardStep >= 3 ? "text-neutral-900" : "text-neutral-400"}\`}>执行条件待检查</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            {wizardStep === 1 && (
              <div className="max-w-3xl mx-auto space-y-6 pb-24">
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <div className="text-[13px] font-bold text-primary-700 mb-2">建议本轮优先解决</div>
                  <h3 className="text-[18px] font-bold text-neutral-900 mb-6">幼犬人群渗透率较低，缺少高质量KOS测评案例与标准化客服承接话术</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="text-[12px] font-bold text-neutral-400">判断依据</div>
                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="text-[13px] text-neutral-800 flex-1">近30天小红书平台幼犬换粮搜索量上升45%，但本品在该词下的曝光环比下降。</div>
                      <div className="text-[10px] text-neutral-500 bg-neutral-200/50 px-2 py-1 rounded flex items-center gap-1">
                        <Activity size={10} /> 系统持续采集
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="text-[13px] text-amber-900 flex-1">近期收到的高意向私信中，超过60%的用户提问"能否防软便"，但店长号缺乏第一人称视角的开箱测评作为信任背书。</div>
                      <div className="text-[10px] text-amber-700 bg-amber-200/50 px-2 py-1 rounded flex items-center gap-1 font-bold">
                        <Sparkles size={10} /> AI推断 · 待验证
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-neutral-200 rounded-xl">
                      <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-600" /> 已具备的关键事实</div>
                      <ul className="list-disc pl-4 text-[12px] text-neutral-700 space-y-1">
                        <li>基础软便原理解析笔记已有3篇</li>
                        <li>已关联3个店长账号</li>
                      </ul>
                    </div>
                    <div className="p-4 border border-red-100 bg-red-50/50 rounded-xl">
                      <div className="text-[12px] font-bold text-red-600 mb-2 flex items-center gap-1"><AlertCircle size={14} /> 缺少的关键事实</div>
                      <ul className="list-disc pl-4 text-[12px] text-red-700 space-y-1">
                        <li>店长个人真实养宠背景信息</li>
                        <li>具体可用于投放的赠品/试吃装政策</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <button className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50 transition-colors">
                      确认问题，稍后补充
                    </button>
                    <button onClick={() => setShowSupplyModal(true)} className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors">
                      补充关键资料
                    </button>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="max-w-3xl mx-auto space-y-6 pb-24">
                <div className="bg-white border border-primary-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary-100 text-primary-800 px-3 py-1 text-[11px] font-bold rounded-bl-lg">推荐策略</div>
                  <h3 className="text-[18px] font-bold text-neutral-900 mb-2">KOS真实开箱与评论区痛点答疑</h3>
                  <p className="text-[13px] text-neutral-600 mb-6">以店长第一人称视角拍摄从收货到开箱的真实过程，在评论区直接挂出"3天试吃不满意退货"政策，降低决策门槛。</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-[12px]">
                    <div className="space-y-1">
                      <div className="text-neutral-400 font-bold">账号角色安排</div>
                      <div className="text-neutral-900 font-medium">3个主理人店长号（第一人称）</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-neutral-400 font-bold">预计内容规模</div>
                      <div className="text-neutral-900 font-medium">15 篇图文（5套模版×3账号）</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-neutral-400 font-bold">素材最低要求</div>
                      <div className="text-neutral-900 font-medium">需真实室内背景实拍原图 12 张</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-neutral-400 font-bold">周期与预算</div>
                      <div className="text-neutral-900 font-medium">14天 / ¥0 (纯人工自然流)</div>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-xl mb-6">
                    <div className="text-[12px] font-bold text-neutral-900 mb-2">本轮验证方法</div>
                    <ul className="list-disc pl-4 text-[12px] text-neutral-700 space-y-1">
                      <li>发布后7天的收藏、评论和分享，相对该账号历史同类内容的变化。</li>
                      <li>评论区是否出现目标用户主动询问试吃政策。</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <button className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors" onClick={() => setWizardStep(3)}>
                      确认策略并检查准备条件
                    </button>
                  </div>
                </div>

                {/* Collapsed Alternative */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                  <div>
                    <div className="text-[11px] font-bold text-neutral-400 mb-1">备选策略 A</div>
                    <div className="text-[14px] font-bold text-neutral-900">头部KOC评测混剪</div>
                  </div>
                  <ChevronDown size={20} className="text-neutral-400" />
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="max-w-4xl mx-auto space-y-6 pb-24">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[14px] font-bold text-neutral-900">立项条件已全部满足</div>
                    <div className="text-[12px] text-neutral-500 mt-0.5">本轮问题已确认，目标已明确，策略基线 v1.0 已生成，可以创建项目并进入筹备。</div>
                  </div>
                  <button className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800" onClick={() => {
                    alert("项目创建成功，进入筹备阶段！策略基线v1.0已保存。");
                    setViewState("list");
                  }}>
                    创建项目并进入筹备
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-[16px] font-bold text-neutral-900">执行准备项检查</div>
                  
                  {/* Hard Blockers */}
                  <div className="border border-red-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-red-50/50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-600" />
                      <span className="text-[13px] font-bold text-red-900">硬阻碍 (1)</span>
                      <span className="text-[12px] text-red-600 ml-2">必须处理才能开始执行首批单元</span>
                    </div>
                    <div className="bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[14px] font-bold text-neutral-900">发布账号与方式未确认</div>
                          <div className="text-[12px] text-neutral-500 mt-1">策略要求使用3个店长号，但目前未指定实际执行人和发布方式。</div>
                        </div>
                        <button onClick={() => setShowLinkMethodModal(true)} className="px-4 py-2 bg-neutral-100 text-neutral-800 text-[12px] font-bold rounded-xl hover:bg-neutral-200">
                          确认发布安排
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Exec Unit preview */}
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-100">
                      <span className="text-[13px] font-bold text-neutral-900">首批执行单元概览</span>
                    </div>
                    <div className="bg-white p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                        <div className="space-y-1">
                          <div className="text-[14px] font-bold text-neutral-900">首批执行单元｜小红书-A02</div>
                          <div className="text-[12px] text-neutral-500 flex gap-4">
                            <span>内容：幼犬换粮软便别慌</span>
                            <span>素材：<span className="text-emerald-600 font-bold">4/4已验收</span></span>
                          </div>
                          <div className="text-[12px] text-neutral-500 flex gap-4 mt-1">
                            <span>发布人：待定</span>
                            <span>发布方式：待定</span>
                            <span>数据回填：发布后提交笔记链接</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[13px] font-bold text-amber-600 mb-1">缺少发布配置</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-sm flex items-center justify-between opacity-70 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-[13px] font-bold text-neutral-700">已满足 4 项条件</span>
                    </div>
                    <ChevronDown size={16} className="text-neutral-400" />
                  </div>
                </div>
              </div>
            )}

            {/* AI Floating Input at bottom of Wizard */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-neutral-100 p-4 z-10 flex justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
               <div className="w-full max-w-3xl relative">
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    placeholder="告诉AI你的判断、限制或调整要求，例如：预算改成6000元，或 不考虑搜索排名..."
                    className="w-full bg-neutral-100 border-none rounded-xl py-3.5 pl-4 pr-12 text-[13px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500/20"
                    onKeyDown={e => {
                      if(e.key === 'Enter') {
                         setWizardStep(2);
                         setAiChatInput("");
                      }
                    }}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
                    <Send size={14} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROJECT DETAIL VIEW */}
      {viewState === "detail" && (
        <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden relative">
           {/* Detail Header */}
           <div className="bg-white px-8 py-5 border-b border-neutral-200 shrink-0">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <button onClick={() => setViewState("list")} className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors">
                   <ChevronLeft size={20} />
                 </button>
                 <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
                   {currentProject.name}
                   <span className={\`px-2 py-0.5 text-[11px] font-bold rounded border \${currentProject.status === "执行" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-700 border-neutral-200"}\`}>
                     {currentProject.status}
                   </span>
                 </h2>
               </div>
               <div className="flex items-center gap-2">
                 <button className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg"><ExternalLink size={18} /></button>
                 
                 {/* Main Action based on state */}
                 {currentProject.status === "筹备" && (
                   <button className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors">处理当前准备项</button>
                 )}
                 {currentProject.status === "执行" && (
                   <button className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors">查看当前执行事项</button>
                 )}
                 {currentProject.status === "完成" && (
                   <button onClick={() => setShowAiReviewModal(true)} className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1.5"><Sparkles size={14}/>查看AI复盘</button>
                 )}

                 {/* More menu */}
                 <div className="relative group">
                   <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">更多</button>
                   <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-neutral-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                     <button onClick={() => setShowStartExecModal(true)} className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg">开始执行</button>
                     <button onClick={() => setShowPauseModal(true)} className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg">暂停项目</button>
                     <button onClick={() => setShowEndModal(true)} className="w-full text-left px-3 py-2 text-[12px] text-neutral-700 hover:bg-neutral-50 rounded-lg text-amber-600">结束本轮</button>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Key Info row */}
             <div className="flex gap-6 text-[12px] text-neutral-600 mb-4">
               <div><span className="text-neutral-400">本轮目标：</span><strong className="text-neutral-800">{currentProject.target}</strong></div>
               <div><span className="text-neutral-400">当前阶段：</span><strong className="text-neutral-800">{currentProject.stage}</strong></div>
               <div><span className="text-neutral-400">负责人：</span><strong className="text-neutral-800">{currentProject.pic}</strong></div>
               <div><span className="text-neutral-400">周期：</span><strong className="text-neutral-800">{currentProject.period}</strong></div>
               <div><span className="text-neutral-400">策略版本：</span><strong className="text-neutral-800">v1.0</strong></div>
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

           {/* Detail Body */}
           <div className="flex-1 overflow-y-auto px-8 py-6">
             {detailTab === "总览" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Next Step / Blocker */}
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <div>
                       <div className="text-[14px] font-bold text-red-900 mb-1">存在硬阻碍：发布账号未配置</div>
                       <div className="text-[12px] text-red-700 mb-3">必须配置首批执行单元的发布方式才能继续。</div>
                       <button className="px-4 py-2 bg-red-600 text-white text-[12px] font-bold rounded-lg hover:bg-red-700">配置发布安排</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
                       <div className="text-[14px] font-bold text-neutral-900 flex justify-between">
                         <span>正在执行的批次</span>
                         <span className="text-[12px] text-primary-600 cursor-pointer">查看全部单元</span>
                       </div>
                       <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                         <div className="text-[13px] font-bold text-neutral-800">首批 4 篇图文</div>
                         <div className="flex justify-between text-[12px] text-neutral-600">
                           <span>素材：已验收 4/4</span>
                           <span>发布：已登记 2/4</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
                       <div className="text-[14px] font-bold text-neutral-900 flex justify-between">
                         <span>下一批准备情况</span>
                       </div>
                       <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                         <div className="text-[13px] font-bold text-neutral-800">第二批 6 篇图文</div>
                         <div className="flex justify-between text-[12px] text-neutral-600">
                           <span>草稿：已审核 0/6</span>
                           <span>素材缺口：缺 12 张</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-[14px] font-bold text-neutral-900 mb-4">最近项目动态</div>
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
                       <div className="relative">
                         <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-300 ring-4 ring-white" />
                         <div className="text-[12px] text-neutral-400 mb-0.5">前天 09:00 • AI建议</div>
                         <div className="text-[13px] font-medium text-neutral-800">策略确认：生成基线 v1.0 并进入筹备</div>
                       </div>
                    </div>
                  </div>
                </div>
             )}

             {detailTab === "策略与计划" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm relative">
                    <div className="absolute top-4 right-4">
                      <button onClick={() => setShowStrategyChangeModal(true)} className="px-4 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-xl hover:bg-neutral-800">和AI讨论调整</button>
                    </div>
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-6">策略基线 v1.0</h3>
                    
                    <div className="space-y-4 text-[13px] text-neutral-800">
                       <div className="grid grid-cols-3 border-b border-neutral-100 pb-4">
                         <div className="text-neutral-500 font-bold">项目目标</div>
                         <div className="col-span-2">{currentProject.target}</div>
                       </div>
                       <div className="grid grid-cols-3 border-b border-neutral-100 pb-4">
                         <div className="text-neutral-500 font-bold">内容与账号计划</div>
                         <div className="col-span-2">使用 3 个店长号，分 3 批发布共 15 篇笔记。</div>
                       </div>
                       <div className="grid grid-cols-3 border-b border-neutral-100 pb-4">
                         <div className="text-neutral-500 font-bold">素材最低要求</div>
                         <div className="col-span-2">需补充室内实拍原图 12 张。</div>
                       </div>
                       <div className="grid grid-cols-3 border-b border-neutral-100 pb-4">
                         <div className="text-neutral-500 font-bold">周期与预算</div>
                         <div className="col-span-2">14天 / ¥0</div>
                       </div>
                       <div className="grid grid-cols-3">
                         <div className="text-neutral-500 font-bold">验证标准</div>
                         <div className="col-span-2">
                           <ul className="list-disc pl-4 space-y-1">
                             <li>发布后7天的收藏、评论相对历史内容增长。</li>
                             <li>出现高意向线索评论。</li>
                           </ul>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
             )}

             {detailTab === "内容与素材" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-100 flex justify-between items-center">
                      <div className="font-bold text-[14px] text-neutral-900">执行批次：第一批 (已就绪)</div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-4 mb-4 text-[12px]">
                        <div className="p-3 border border-neutral-100 rounded-xl bg-white text-center">
                          <div className="text-neutral-400 mb-1">内容</div>
                          <div className="font-bold text-[14px] text-neutral-900">4 篇草稿 (4已审)</div>
                        </div>
                        <div className="p-3 border border-neutral-100 rounded-xl bg-white text-center">
                          <div className="text-neutral-400 mb-1">素材位</div>
                          <div className="font-bold text-[14px] text-emerald-600">全部满足</div>
                        </div>
                        <div className="p-3 border border-neutral-100 rounded-xl bg-white text-center">
                          <div className="text-neutral-400 mb-1">任务进度</div>
                          <div className="font-bold text-[14px] text-neutral-900">已回传完成</div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-50">查看内容</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-100 flex justify-between items-center">
                      <div className="font-bold text-[14px] text-neutral-900">执行批次：第二批 (筹备中)</div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-4 mb-4 text-[12px]">
                        <div className="p-3 border border-neutral-100 rounded-xl bg-white text-center">
                          <div className="text-neutral-400 mb-1">内容</div>
                          <div className="font-bold text-[14px] text-amber-600">6 篇草稿 (0已审)</div>
                        </div>
                        <div className="p-3 border border-red-100 rounded-xl bg-red-50 text-center">
                          <div className="text-red-400 mb-1">素材位</div>
                          <div className="font-bold text-[14px] text-red-600">缺 12 张图</div>
                        </div>
                        <div className="p-3 border border-neutral-100 rounded-xl bg-white text-center">
                          <div className="text-neutral-400 mb-1">任务进度</div>
                          <div className="font-bold text-[14px] text-neutral-900">未分发</div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-50">审核内容</button>
                        <button className="px-4 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-lg hover:bg-neutral-800" onClick={() => {
                          alert("已携带项目上下文，即将跳转至素材中心");
                          if(setWorkflowTab) setWorkflowTab("assets");
                        }}>处理素材缺口</button>
                      </div>
                    </div>
                  </div>
                </div>
             )}

             {detailTab === "发布与互动" && (
                <div className="max-w-5xl mx-auto">
                  <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-[12px]">
                      <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">目标账号</th>
                          <th className="px-4 py-3 font-medium">发布人</th>
                          <th className="px-4 py-3 font-medium">内容摘要</th>
                          <th className="px-4 py-3 font-medium">发布方式</th>
                          <th className="px-4 py-3 font-medium">状态</th>
                          <th className="px-4 py-3 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-800">
                        <tr>
                          <td className="px-4 py-3 font-bold">小红书-店长A</td>
                          <td className="px-4 py-3">王美丽</td>
                          <td className="px-4 py-3">幼犬换粮避坑指南...</td>
                          <td className="px-4 py-3">员工手机人工发布</td>
                          <td className="px-4 py-3"><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">观察中</span></td>
                          <td className="px-4 py-3">
                            <button className="text-primary-600 font-bold hover:underline">查看互动</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold">小红书-店长B</td>
                          <td className="px-4 py-3">李大俊</td>
                          <td className="px-4 py-3">3天解决软便烦恼...</td>
                          <td className="px-4 py-3">员工手机人工发布</td>
                          <td className="px-4 py-3"><span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">等待回填链接</span></td>
                          <td className="px-4 py-3">
                            <button className="text-neutral-900 border border-neutral-200 px-2 py-1 rounded bg-white font-bold shadow-sm">登记笔记链接</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
             )}

             {detailTab === "变更记录" && (
                <div className="max-w-3xl mx-auto bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <div className="space-y-6 border-l-2 border-neutral-100 ml-4 pl-6 relative">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-neutral-900 ring-4 ring-white" />
                      <div className="text-[12px] text-neutral-400 mb-1">2026-07-02 10:00 • 张操盘 (IDE端)</div>
                      <div className="text-[14px] font-bold text-neutral-900 mb-1">项目状态变更：进入筹备</div>
                      <div className="text-[12px] text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        创建项目并进入筹备阶段，生成了策略基线 v1.0。
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-neutral-300 ring-4 ring-white" />
                      <div className="text-[12px] text-neutral-400 mb-1">2026-07-01 14:00 • AI建议</div>
                      <div className="text-[14px] font-bold text-neutral-900 mb-1">生成立项草案</div>
                      <div className="text-[12px] text-neutral-600">根据平台数据识别到幼犬换粮搜索卡位机会。</div>
                    </div>
                  </div>
                </div>
             )}
           </div>
        </div>
      )}

      {/* Modals placeholders */}
      {showSupplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-[16px] mb-4">补充关键资料</h3>
            <p className="text-[12px] text-neutral-600 mb-4">缺少影响策略判断的关键资料：店长个人真实养宠背景信息。</p>
            <div className="space-y-2 mb-6">
               <button className="w-full p-3 border border-neutral-200 rounded-xl text-left text-[13px] font-bold hover:bg-neutral-50">从商家知识库选择</button>
               <button className="w-full p-3 border border-neutral-200 rounded-xl text-left text-[13px] font-bold hover:bg-neutral-50">操盘手手动填写</button>
               <button className="w-full p-3 border border-neutral-200 rounded-xl text-left text-[13px] font-bold text-amber-600 hover:bg-amber-50">标记为暂时无法提供</button>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSupplyModal(false)} className="px-4 py-2 border border-neutral-200 rounded-xl text-[12px] font-bold">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Change Panel Modal */}
      {showStrategyChangeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[80vh]">
            <h3 className="font-bold text-[18px] mb-2 text-neutral-900">和AI讨论策略调整</h3>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl">
                 <div className="text-[13px] font-bold text-primary-900 mb-2">AI 策略变更草案 v1.1 已生成</div>
                 <div className="text-[12px] text-primary-800 space-y-2">
                    <div><strong>调整原因：</strong>根据对话指令，增加了预算。</div>
                    <div><strong>修改字段：</strong>预算由 ¥0 增加至 ¥6000。</div>
                    <div><strong>影响评估：</strong>可以补充投流动作，加速数据回收，不需要暂停已有执行任务。</div>
                 </div>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-2">
               <input type="text" placeholder="继续提出修改意见..." className="flex-1 bg-neutral-100 border-none rounded-xl py-2.5 px-4 text-[13px]" />
               <button className="p-2.5 bg-neutral-200 text-neutral-700 rounded-xl"><Send size={16}/></button>
            </div>
            <div className="pt-4 flex justify-end gap-2">
               <button onClick={() => setShowStrategyChangeModal(false)} className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600">放弃调整</button>
               <button className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold" onClick={() => {
                 alert("策略基线已更新！");
                 setShowStrategyChangeModal(false);
               }}>确认应用新版本</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
\`;

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', fileContent);
