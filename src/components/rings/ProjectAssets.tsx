import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderOpen, Target, Calendar, LayoutTemplate, FileText, Image as ImageIcon, Users, MessageSquare, AlertCircle, ArrowRight, Activity, BarChart2, Archive, CheckCircle2, X, Link, Play, ChevronLeft, AlertOctagon, Zap, ShieldCheck, Info, User, Clock, Check, MoreHorizontal, Plus, Trash2, MessageCircle, Send, CheckCircle
} from "lucide-react";

type MainTab = "项目" | "账号资产";
type ProjectStatus = "进行中" | "待启动" | "已暂停" | "已完成" | "已归档";
type DetailTab = "项目总览" | "内容包" | "素材与拍摄" | "发布与账号" | "互动与线索" | "消费者参与" | "调整与复盘";

export function ProjectAssets() {
  const [mainTab, setMainTab] = useState<MainTab>("项目");
  const [activeTab, setActiveTab] = useState<ProjectStatus>("进行中");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("项目总览");
  const [publishSubTab, setPublishSubTab] = useState<"发布进度" | "参与账号">("发布进度");
  const [accountView, setAccountView] = useState<"list" | "add" | "remove">("list");
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const MOCK_PROJECTS = [
    {
      id: "p1",
      name: "幼犬换粮避坑搜索卡位",
      status: "进行中",
      target: "搜索卡位 + 私域承接",
      period: "2026-07-01 至 2026-07-07",
      strategy: "美妆搜索种草打法",
      contentProgress: "42 / 50", // 已生成 / 计划
      publishProgress: "38 / 42", // 已核验发布 / 已生成内容
      materialProgress: "缺 8 组场景图",
      accountStats: "可调度账号：专业号1、KOS 3｜消费者名额30，已识别发布账号7",
      leadStats: "18 个高意向 / 6 条待处理",
      blocker: "真实喂食素材不足，影响 12 篇排期"
    },
    {
      id: "p2",
      name: "双十一大促种草企划",
      status: "待启动",
      target: "大促转化 + 曝光",
      period: "2026-10-15 至 2026-11-11",
      strategy: "大促蓄水打法",
      prepStatus: ["方案已确认", "账号组合待确认", "消费者领取规则待确认", "内容包待生成"],
      blocker: "账号组合待确认"
    }
  ];

  const MOCK_ACCOUNTS = [
    {
      id: "a1", name: "小红书-A02", type: "KOS", group: "自有及可调度账号", relation: "员工", employee: "张三",
      persona: "成分党评测", projects: 3, verified: 45, lastUse: "10分钟前", status: "待观察"
    },
    {
      id: "a2", name: "品牌官方账号", type: "专业号", group: "自有及可调度账号", relation: "自有", employee: "品牌组",
      persona: "官方发布", projects: 12, verified: 128, lastUse: "昨天", status: "正常"
    },
    {
      id: "a3", name: "野生评测家", type: "达人号", group: "外部合作账号", relation: "合作", employee: "李四",
      persona: "客观评测", projects: 2, verified: 2, lastUse: "1周前", status: "正常"
    },
    {
      id: "a4", name: "一只小柯基", type: "消费者号", group: "发布后识别账号", relation: "一次性消费者", employee: "-",
      persona: "-", projects: 1, verified: 1, lastUse: "2小时前", status: "正常"
    }
  ];

  if (selectedProject) {
    return (
      <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-text-main rounded-xl border border-border-default shadow-sm relative">
        {/* Detail Header */}
        <div className="px-8 py-5 border-b border-border-default bg-surface-1 shrink-0">
           <div className="flex items-center gap-4 mb-5">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-main font-bold transition-colors"
              >
                <ChevronLeft size={16} /> 返回方案列表
              </button>
              <div className="w-px h-4 bg-neutral-200" />
              <h2 className="text-[18px] font-bold text-text-main flex items-center gap-2">
                {selectedProject.name}
              </h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-bold rounded border border-green-200">
                {selectedProject.status}
              </span>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-[12px] text-text-secondary font-medium bg-page-bg/80 px-4 py-2.5 rounded-xl border border-border-default">
                 <div className="flex items-center gap-1.5"><Target size={14} className="text-text-tertiary" /> 目标：{selectedProject.target}</div>
                 <div className="flex items-center gap-1.5"><Calendar size={14} className="text-text-tertiary" /> 周期：{selectedProject.period}</div>
                 <div className="flex items-center gap-1.5"><FileText size={14} className="text-text-tertiary" /> 内容：{selectedProject.contentProgress || '-'}</div>
                 <div className="flex items-center gap-1.5"><Send size={14} className="text-text-tertiary" /> 发布：{selectedProject.publishProgress || '-'}</div>
                 <div className="flex items-center gap-1.5"><ImageIcon size={14} className="text-text-tertiary" /> 素材缺口：{selectedProject.materialProgress || '-'}</div>
                 <div className="flex items-center gap-1.5"><MessageSquare size={14} className="text-text-tertiary" /> 线索：{selectedProject.leadStats || '-'}</div>
                 {selectedProject.blocker !== "暂无" && (
                   <div className="flex items-center gap-1.5 text-danger"><AlertOctagon size={14} /> 卡点：{selectedProject.blocker}</div>
                 )}
              </div>
              <div className="flex items-center gap-2">
                 {(selectedProject?.status !== "已完成" && selectedProject?.status !== "已归档") && (
                   <button className="px-4 py-2 bg-btn-main text-white rounded-xl text-[12px] font-bold hover:bg-btn-main-hover transition-colors shadow-sm flex items-center gap-1.5">
                     <Zap size={14} /> 查看相关执行事项
                   </button>
                 )}
                 <button className="px-4 py-2 bg-surface-1 border border-border-default text-text-secondary rounded-xl text-[12px] font-bold hover:bg-page-bg transition-colors shadow-sm">
                   生成复盘
                 </button>
                 {(selectedProject?.status === "已完成" || selectedProject?.status === "已暂停") && (
                   <button className="p-2 bg-surface-1 border border-border-default text-text-tertiary rounded-xl hover:text-text-secondary hover:bg-page-bg transition-colors shadow-sm">
                     <Archive size={16} /> 归档
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* Detail Tabs */}
        <div className="h-12 px-8 border-b border-border-default bg-surface-1 shrink-0 flex items-center">
          <div className="flex items-center gap-8 h-full overflow-x-auto">
            {(["项目总览", "内容包", "素材与拍摄", "发布与账号", "互动与线索", "消费者参与", "调整与复盘"] as DetailTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                className={`relative h-full flex items-center gap-2 px-1 text-[13.5px] transition-all whitespace-nowrap cursor-pointer ${
                  detailTab === tab
                    ? "font-semibold text-text-main"
                    : "font-medium text-text-secondary hover:text-text-main"
                }`}
              >
                <span>{tab}</span>
                {detailTab === tab && (
                  <motion.div
                    layoutId="projectDetailTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-page-bg custom-scrollbar relative">
           
           {detailTab === "项目总览" && (
             <div className="max-w-5xl mx-auto space-y-8">
                {/* 紧凑项目流程 */}
                <div className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm">
                   <h3 className="text-[14px] font-bold text-text-main mb-6 flex items-center gap-2">
                     <Activity size={16} className="text-text-tertiary" /> 项目流程
                   </h3>
                   <div className="flex items-center justify-between">
                     {[
                       {name: '策略确认', count: '1/1', wait: '0', block: false},
                       {name: '内容生成', count: '42', wait: '8', block: false},
                       {name: '内容审核', count: '40', wait: '2', block: false},
                       {name: '素材完成', count: '30', wait: '12', block: true},
                       {name: '移动端发布', count: '25', wait: '5', block: false},
                       {name: '发布核验', count: '20', wait: '5', block: false},
                       {name: '互动承接', count: '18', wait: '6', block: false},
                       {name: '复盘', count: '0', wait: '1', block: false},
                     ].map((step, i, arr) => (
                       <React.Fragment key={i}>
                         <div className="flex flex-col items-center cursor-pointer group">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-colors
                             ${step.block ? 'border-danger-light bg-rose-50 text-danger' : 
                               step.wait === '0' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-blue-200 bg-blue-50 text-blue-600'}`}
                           >
                              {step.block ? <AlertOctagon size={16} /> : (step.wait === '0' ? <Check size={16} /> : <Clock size={16} />)}
                           </div>
                           <div className="text-[12px] font-bold text-text-secondary group-hover:text-brand-logo transition-colors">{step.name}</div>
                           <div className="text-[10px] text-text-tertiary mt-1">完成 {step.count}</div>
                           {step.wait !== '0' && <div className={`text-[10px] ${step.block ? 'text-brand-logo font-bold' : 'text-amber-500'}`}>等待 {step.wait}</div>}
                         </div>
                         {i < arr.length - 1 && (
                           <div className="flex-1 h-px bg-neutral-200 -mt-8 mx-2" />
                         )}
                       </React.Fragment>
                     ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-surface-1 border border-danger-light rounded-xl p-6 shadow-sm">
                      <h3 className="text-[14px] font-bold text-danger flex items-center gap-2 mb-4">
                        <AlertOctagon size={16} /> 当前关键卡点
                      </h3>
                      <div className="bg-rose-50 border border-danger-light rounded-xl p-4">
                         <h4 className="text-[14px] font-bold text-rose-900 mb-2">缺真实喂食场景图</h4>
                         <p className="text-[12px] text-danger mb-4">影响：12 篇笔记无法排期</p>
                         <div className="flex items-center justify-between">
                           <button className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700 transition-colors shadow-sm">
                             去处理
                           </button>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm">
                      <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-text-tertiary" /> 最近项目动态
                      </h3>
                      <div className="space-y-4">
                         <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-btn-main mt-2 shrink-0" />
                            <div>
                              <p className="text-[13px] text-text-secondary font-medium">消费者 U8372 已领取内容包 #82</p>
                              <span className="text-[11px] text-text-tertiary">10分钟前</span>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                            <div>
                              <p className="text-[13px] text-text-secondary font-medium">产生 3 条新高意向线索</p>
                              <span className="text-[11px] text-text-tertiary">2小时前</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {detailTab === "内容包" && (
             <div className="max-w-5xl mx-auto space-y-6">
               <div className="flex items-center gap-2">
                 {["全部", "待审核", "待素材", "待派发", "已领取", "待发布", "待回收笔记ID", "发布后核查", "已发布并观察", "有异常"].map(t => (
                   <button key={t} className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-surface-1 border border-border-default text-text-secondary hover:bg-page-bg">
                     {t}
                   </button>
                 ))}
               </div>
               <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                         <th className="p-4 font-bold w-[25%]">标题 / 编号</th>
                         <th className="p-4 font-bold">类型 / 角度</th>
                         <th className="p-4 font-bold">计划账号 / 当前归属</th>
                         <th className="p-4 font-bold">素材 / 发布状态</th>
                         <th className="p-4 font-bold">操作</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                         <td className="p-4">
                           <div className="text-[13px] font-bold text-text-main mb-1">幼犬换粮必看！新手...</div>
                           <div className="text-[11px] text-text-tertiary font-mono">内容包 #45</div>
                         </td>
                         <td className="p-4">
                           <div className="text-[12px] text-text-secondary">知识科普</div>
                           <div className="text-[11px] text-text-tertiary mt-1">干货分享</div>
                         </td>
                         <td className="p-4">
                           <div className="text-[12px] text-text-secondary">员工 KOS</div>
                           <div className="text-[11px] font-bold text-brand-logo mt-1">小红书-A02</div>
                         </td>
                         <td className="p-4">
                           <div className="flex flex-col gap-1.5 items-start">
                             <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">素材已齐</span>
                             <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">待回收笔记ID</span>
                           </div>
                         </td>
                         <td className="p-4">
                            <button className="text-[12px] font-bold bg-btn-main text-white px-3 py-1.5 rounded-lg hover:bg-btn-main-hover transition-colors">前往发布调度</button>
                         </td>
                       </tr>
                       <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                         <td className="p-4">
                           <div className="text-[13px] font-bold text-text-main mb-1">沉浸式拆箱新狗粮...</div>
                           <div className="text-[11px] text-text-tertiary font-mono">内容包 #82</div>
                         </td>
                         <td className="p-4">
                           <div className="text-[12px] text-text-secondary">好物分享</div>
                           <div className="text-[11px] text-text-tertiary mt-1">开箱体验</div>
                         </td>
                         <td className="p-4">
                           <div className="text-[12px] text-text-secondary">消费者 KOC</div>
                           <div className="text-[11px] text-blue-600 font-bold mt-1">消费者领取池</div>
                         </td>
                         <td className="p-4">
                           <div className="flex flex-col gap-1.5 items-start">
                             <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">缺素材(需消费者上传)</span>
                             <span className="text-[11px] font-bold text-text-tertiary bg-hover-bg px-2 py-0.5 rounded border border-border-default">待领取</span>
                           </div>
                         </td>
                         <td className="p-4">
                            <button className="text-[12px] font-bold bg-surface-1 border border-border-default text-text-secondary px-3 py-1.5 rounded-lg hover:bg-page-bg transition-colors">查看详情</button>
                         </td>
                       </tr>
                     </tbody>
                  </table>
               </div>
             </div>
           )}

           {detailTab === "素材与拍摄" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                         <th className="p-4 font-bold">内容包 / 标题</th>
                         <th className="p-4 font-bold">所需图片数</th>
                         <th className="p-4 font-bold">可用图片数</th>
                         <th className="p-4 font-bold">素材来源</th>
                         <th className="p-4 font-bold">当前缺口</th>
                         <th className="p-4 font-bold">状态</th>
                         <th className="p-4 font-bold">操作</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                         <td className="p-4">
                           <div className="text-[11px] text-text-tertiary font-mono mb-1">内容包 #45</div>
                           <div className="text-[13px] font-bold text-text-main">幼犬换粮必看！...</div>
                         </td>
                         <td className="p-4 text-[13px] font-bold text-text-secondary">4</td>
                         <td className="p-4 text-[13px] font-bold text-emerald-600">4</td>
                         <td className="p-4 text-[12px] text-text-secondary">员工拍摄 + 本地</td>
                         <td className="p-4 text-[12px] text-text-tertiary">-</td>
                         <td className="p-4">
                           <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">已进入发布准备</span>
                         </td>
                         <td className="p-4">
                            <button className="text-[12px] font-bold text-text-secondary hover:text-text-main">查看素材</button>
                         </td>
                       </tr>
                       <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                         <td className="p-4">
                           <div className="text-[11px] text-text-tertiary font-mono mb-1">内容包 #83</div>
                           <div className="text-[13px] font-bold text-text-main">幼犬不能乱吃...</div>
                         </td>
                         <td className="p-4 text-[13px] font-bold text-text-secondary">3</td>
                         <td className="p-4 text-[13px] font-bold text-danger">1</td>
                         <td className="p-4 text-[12px] text-text-secondary">本地素材</td>
                         <td className="p-4 text-[12px] font-bold text-danger">缺 2 张喂食场景</td>
                         <td className="p-4">
                           <span className="text-[11px] font-bold text-danger bg-rose-50 px-2 py-0.5 rounded border border-danger-light">待补充素材</span>
                         </td>
                         <td className="p-4">
                            <button className="text-[12px] font-bold bg-btn-main text-white px-3 py-1.5 rounded-lg hover:bg-btn-main-hover transition-colors">前往拍摄与回传</button>
                         </td>
                       </tr>
                     </tbody>
                  </table>
                </div>
             </div>
           )}

           {detailTab === "发布与账号" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex bg-hover-bg p-1 rounded-lg w-max mb-6">
                   <button 
                     onClick={() => setPublishSubTab('发布进度')}
                     className={`px-6 py-1.5 text-[13px] font-bold rounded-md transition-colors ${publishSubTab === '发布进度' ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                   >
                     发布进度
                   </button>
                   <button 
                     onClick={() => setPublishSubTab('参与账号')}
                     className={`px-6 py-1.5 text-[13px] font-bold rounded-md transition-colors ${publishSubTab === '参与账号' ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                   >
                     参与账号
                   </button>
                </div>

                {publishSubTab === "发布进度" && (
                  <div className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm">
                     <div className="space-y-6">
                        {/* Task Item */}
                        <div className="border border-border-default rounded-xl p-5 bg-page-bg hover:bg-page-bg transition-colors">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h4 className="text-[14px] font-bold text-text-main">内容包 #45</h4>
                                 <div className="text-[12px] text-text-tertiary mt-1">发布方式：员工H5 | 分配给：小红书-A02 (张三)</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-[13px] font-bold text-emerald-600">发布成功 · 观察中</div>
                                 <div className="text-[11px] text-text-tertiary mt-1">最近动作：已回传真实ID</div>
                              </div>
                           </div>
                           
                           <div className="flex items-center text-[12px] text-text-tertiary font-medium whitespace-nowrap overflow-x-auto pb-2 custom-scrollbar">
                              <span className="text-emerald-600">已派发</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">已送达</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">已领取</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">准备中</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">已唤起小红书</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">已回收 ID</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">发布核验通过</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-brand-logo font-bold bg-brand-light px-2 py-0.5 rounded">已进入观察</span>
                           </div>
                           
                           <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between">
                              <div className="flex items-center gap-6 text-[12px]">
                                 <div>笔记ID：<span className="font-mono font-bold text-text-secondary">xhs_9921k</span></div>
                                 <div>评论数据观察：<span className="font-bold text-emerald-600">正常监控中</span></div>
                              </div>
                              <button className="text-[12px] font-bold text-text-secondary hover:text-text-main border border-border-default px-3 py-1.5 rounded-lg bg-surface-1">前往发布调度</button>
                           </div>
                        </div>

                        {/* Blocked Task Item */}
                        <div className="border border-danger-light rounded-xl p-5 bg-rose-50/30">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h4 className="text-[14px] font-bold text-text-main">内容包 #12</h4>
                                 <div className="text-[12px] text-text-tertiary mt-1">发布方式：员工H5 | 分配给：小红书-A05 (李四)</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-[13px] font-bold text-danger">发布核查异常</div>
                                 <div className="text-[11px] text-text-tertiary mt-1">最近动作：核查发现无法访问</div>
                              </div>
                           </div>
                           
                           <div className="flex items-center text-[12px] text-text-tertiary font-medium whitespace-nowrap overflow-x-auto pb-2 custom-scrollbar">
                              <span className="text-emerald-600">已唤起小红书</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-emerald-600">已回收 ID</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span className="text-danger font-bold bg-rose-50 px-2 py-0.5 rounded">发布核验失败</span>
                              <ChevronLeft size={14} className="mx-1 rotate-180 text-neutral-300" />
                              <span>未进入观察</span>
                           </div>
                           
                           <div className="mt-4 pt-4 border-t border-danger-light flex items-center justify-between">
                              <div className="flex items-center gap-6 text-[12px]">
                                 <div>笔记ID：<span className="font-mono font-bold text-text-secondary">xhs_4518m</span></div>
                                 <div className="text-danger font-bold">笔记链接失效或正在审核</div>
                              </div>
                              <button className="text-[12px] font-bold text-white hover:bg-rose-700 bg-rose-600 px-3 py-1.5 rounded-lg">前往发布调度</button>
                           </div>
                        </div>

                     </div>
                  </div>
                )}

                {publishSubTab === "参与账号" && (
                  <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
                     <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                            <th className="p-4 font-bold">账号</th>
                            <th className="p-4 font-bold">关系类型</th>
                            <th className="p-4 font-bold">本项目内容数</th>
                            <th className="p-4 font-bold">已核验发布数</th>
                            <th className="p-4 font-bold">状态</th>
                            <th className="p-4 font-bold">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                            <td className="p-4">
                              <div className="text-[13px] font-bold text-text-main">小红书-A02</div>
                              <div className="text-[11px] text-text-tertiary mt-1">KOS员工号</div>
                            </td>
                            <td className="p-4 text-[12px] text-text-secondary">自有员工</td>
                            <td className="p-4 text-[13px] font-bold text-text-secondary">15</td>
                            <td className="p-4 text-[13px] font-bold text-emerald-600">15</td>
                            <td className="p-4">
                              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">正常</span>
                            </td>
                            <td className="p-4">
                               <button className="text-[12px] text-brand-logo font-bold hover:text-primary-700">查看详情</button>
                            </td>
                          </tr>
                          <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                            <td className="p-4">
                              <div className="text-[13px] font-bold text-text-main">一只小柯基</div>
                              <div className="text-[11px] text-text-tertiary mt-1">发布后识别消费者号</div>
                            </td>
                            <td className="p-4 text-[12px] text-text-secondary">一次性消费者</td>
                            <td className="p-4 text-[13px] font-bold text-text-secondary">1</td>
                            <td className="p-4 text-[13px] font-bold text-emerald-600">1</td>
                            <td className="p-4">
                              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">正常</span>
                            </td>
                            <td className="p-4">
                               <button className="text-[12px] text-brand-logo font-bold hover:text-primary-700">查看详情</button>
                            </td>
                          </tr>
                          <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                            <td className="p-4">
                              <div className="text-[13px] font-bold text-text-main">小红书-A05</div>
                              <div className="text-[11px] text-text-tertiary mt-1">KOS员工号</div>
                            </td>
                            <td className="p-4 text-[12px] text-text-secondary">自有员工</td>
                            <td className="p-4 text-[13px] font-bold text-text-secondary">8</td>
                            <td className="p-4 text-[13px] font-bold text-danger">5</td>
                            <td className="p-4">
                              <span className="text-[11px] font-bold text-danger bg-rose-50 px-2 py-0.5 rounded border border-danger-light">需核验 / 暂停派发</span>
                            </td>
                            <td className="p-4">
                               <button className="text-[12px] text-danger font-bold hover:text-danger">查看异常证据</button>
                            </td>
                          </tr>
                        </tbody>
                     </table>
                  </div>
                )}
             </div>
           )}

           {detailTab === "消费者参与" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm">
                   {/* Funnel */}
                   <div className="flex justify-between items-center mb-8 bg-page-bg p-4 rounded-xl border border-border-default">
                      {[
                        {label: '名额', val: '30'},
                        {label: '已领取', val: '12'},
                        {label: '问卷完成', val: '12'},
                        {label: '内容包生成', val: '10'},
                        {label: '素材完成', val: '6'},
                        {label: '已核验发布', val: '4'}
                      ].map((f, i, arr) => (
                         <React.Fragment key={i}>
                           <div className="flex flex-col items-center cursor-pointer group">
                             <div className="text-[20px] font-bold text-text-main group-hover:text-brand-logo">{f.val}</div>
                             <div className="text-[12px] text-text-tertiary font-medium">{f.label}</div>
                           </div>
                           {i < arr.length - 1 && <ChevronLeft size={16} className="rotate-180 text-neutral-300" />}
                         </React.Fragment>
                      ))}
                   </div>
                   
                   <div className="flex justify-end mb-4">
                      <button className="text-[12px] font-bold bg-btn-main text-white px-4 py-2 rounded-lg shadow-sm hover:bg-btn-main-hover">
                        前往消费者参与执行中心
                      </button>
                   </div>

                   <div className="border border-border-default rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                             <th className="p-4 font-bold">领取编号 / 时间</th>
                             <th className="p-4 font-bold">问卷摘要</th>
                             <th className="p-4 font-bold">内容包 / 素材</th>
                             <th className="p-4 font-bold">发布状态 / 识别账号</th>
                           </tr>
                         </thead>
                         <tbody>
                           <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                             <td className="p-4">
                               <div className="text-[13px] font-bold text-text-main font-mono mb-1">R-9921</div>
                               <div className="text-[11px] text-text-tertiary">2026-07-15 10:20</div>
                             </td>
                             <td className="p-4">
                               <div className="text-[12px] text-text-secondary line-clamp-2">养狗3个月，平时吃某牌粮，最近软便想换粮...</div>
                             </td>
                             <td className="p-4">
                               <div className="text-[12px] text-text-secondary font-mono mb-1">内容包 #82</div>
                               <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">素材已齐</span>
                             </td>
                             <td className="p-4">
                               <div className="text-[12px] font-bold text-emerald-600 mb-1">已发布</div>
                               <div className="text-[11px] font-bold text-brand-logo">已识别：@一只小柯基</div>
                             </td>
                           </tr>
                           <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                             <td className="p-4">
                               <div className="text-[13px] font-bold text-text-main font-mono mb-1">R-9922</div>
                               <div className="text-[11px] text-text-tertiary">2026-07-15 11:05</div>
                             </td>
                             <td className="p-4">
                               <div className="text-[12px] text-text-secondary line-clamp-2">刚接回家，想选一款适口性好的幼犬粮...</div>
                             </td>
                             <td className="p-4">
                               <div className="text-[12px] text-text-secondary font-mono mb-1">内容包 #85</div>
                               <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">待上传配图</span>
                             </td>
                             <td className="p-4">
                               <div className="text-[12px] font-bold text-text-tertiary mb-1">准备中</div>
                               <div className="text-[11px] text-text-tertiary">账号待发布后识别</div>
                             </td>
                           </tr>
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
           )}

           {detailTab === "互动与线索" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                   <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-sm flex flex-col items-center justify-center">
                      <div className="text-[24px] font-bold text-text-main">128</div>
                      <div className="text-[12px] font-medium text-text-tertiary mt-1">评论总量</div>
                   </div>
                   <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-sm flex flex-col items-center justify-center">
                      <div className="text-[24px] font-bold text-text-main">45</div>
                      <div className="text-[12px] font-medium text-text-tertiary mt-1">私信总量</div>
                   </div>
                   <div className="bg-surface-1 p-5 rounded-xl border border-primary-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-btn-main"></div>
                      <div className="text-[24px] font-bold text-brand-logo">18</div>
                      <div className="text-[12px] font-bold text-primary-700 mt-1">高意向线索</div>
                   </div>
                   <div className="bg-surface-1 p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                      <div className="text-[24px] font-bold text-amber-600">6</div>
                      <div className="text-[12px] font-bold text-amber-700 mt-1">待跟进线索</div>
                   </div>
                </div>

                <div className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[15px] font-bold text-text-main">互动追踪列表</h3>
                      <button className="text-[12px] font-bold bg-btn-main text-white px-4 py-2 rounded-lg shadow-sm hover:bg-btn-main-hover">
                        前往互动承接
                      </button>
                   </div>
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                          <th className="p-4 font-bold">来源账号 / 笔记</th>
                          <th className="p-4 font-bold">互动类型</th>
                          <th className="p-4 font-bold">用户意图</th>
                          <th className="p-4 font-bold">当前承接结果</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border-default hover:bg-page-bg transition-colors">
                          <td className="p-4">
                            <div className="text-[12px] font-bold text-text-main mb-1">@小红书-A02</div>
                            <div className="text-[11px] text-text-tertiary">笔记：幼犬换粮必看！...</div>
                          </td>
                          <td className="p-4">
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">评论求购</span>
                          </td>
                          <td className="p-4 text-[12px] text-text-secondary">"求链接，我家狗子刚好3个月"</td>
                          <td className="p-4">
                             <div className="text-[12px] font-bold text-emerald-600 mb-1">已转私信发链</div>
                             <div className="text-[11px] text-text-tertiary">2小时前</div>
                          </td>
                        </tr>
                      </tbody>
                   </table>
                </div>
             </div>
           )}

           {detailTab === "调整与复盘" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm">
                   <h3 className="text-[15px] font-bold text-text-main mb-4 flex items-center gap-2">
                     <Archive size={16} className="text-text-tertiary" /> 已确认的复盘与经验沉淀
                   </h3>
                   <div className="text-[13px] text-text-tertiary mb-6 bg-page-bg p-3 rounded-lg border border-border-default">
                     <Info size={14} className="inline mr-1 -mt-0.5" />
                     此处保存的是经操盘手确认沉淀的商家记忆和策略调整。需要汇总分析请点击右上角“生成复盘”。
                   </div>
                   
                   <div className="space-y-6">
                      <div className="border border-border-default rounded-xl p-5 relative">
                         <div className="absolute -top-3 left-4 bg-surface-1 px-2 text-[12px] font-bold text-brand-logo">素材经验沉淀</div>
                         <p className="text-[13px] text-text-main leading-relaxed font-medium">
                           实测发现，包含“真实喂食场景+狗狗舔嘴巴”动图的笔记，点击率平均提升 45%。已沉淀至商家通用素材规范。
                         </p>
                         <div className="mt-3 text-[11px] text-text-tertiary flex justify-between">
                            <span>确认人：主理人</span>
                            <span>2026-07-12</span>
                         </div>
                      </div>

                      <div className="border border-border-default rounded-xl p-5 relative">
                         <div className="absolute -top-3 left-4 bg-surface-1 px-2 text-[12px] font-bold text-brand-logo">高表现内容总结</div>
                         <p className="text-[13px] text-text-main leading-relaxed font-medium">
                           “七日换粮法”科普卡片的留存率最好，大量用户收藏。后续项目可将此图文模板作为标配。
                         </p>
                         <div className="mt-3 text-[11px] text-text-tertiary flex justify-between">
                            <span>确认人：主理人</span>
                            <span>2026-07-10</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    );
  }

  // --- 项目与资产列表 (List View) ---
  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-text-main rounded-xl border border-border-default shadow-sm relative">
      {/* 顶部标题区 */}
      <div className="px-8 pt-6 border-b border-border-default bg-surface-1 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-main">
              项目档案
            </h2>
            <p className="text-[13px] text-text-tertiary mt-1">长期保存项目沉淀、发布记录、账号资产与互动线索结果。卡点处理请前往执行中心。</p>
          </div>
        </div>

        {/* Main Tabs (项目 / 账号资产) */}
        <div className="h-12 flex items-center gap-8 border-b border-transparent">
           {(["项目", "账号资产"] as MainTab[]).map(tab => (
             <button
               key={tab}
               onClick={() => { setMainTab(tab); setSelectedAccount(null); }}
               className={`relative h-full flex items-center gap-2 px-1 text-[15px] transition-all whitespace-nowrap cursor-pointer ${
                 mainTab === tab
                   ? "font-semibold text-text-main"
                   : "font-medium text-text-secondary hover:text-text-main"
               }`}
             >
               <span>{tab}</span>
               {mainTab === tab && (
                 <motion.div
                   layoutId="projectMainTab"
                   className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                   transition={{ type: "spring", stiffness: 500, damping: 35 }}
                 />
               )}
             </button>
           ))}
        </div>
      </div>

      {mainTab === "项目" && (
        <>
          {/* Project Status Tabs */}
          <div className="h-12 px-8 border-b border-border-default bg-surface-1 shrink-0 flex items-center">
            <div className="flex items-center gap-8 h-full">
              {(["进行中", "待启动", "已暂停", "已完成", "已归档"] as ProjectStatus[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative h-full flex items-center gap-2 px-1 text-[13.5px] transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? "font-semibold text-text-main"
                      : "font-medium text-text-secondary hover:text-text-main"
                  }`}
                >
                  <span>{tab}</span>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="projectStatusTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards */}
          <div className="flex-1 overflow-y-auto p-8 bg-page-bg custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-4">
              {MOCK_PROJECTS.filter(p => activeTab === "进行中" ? p.status === "进行中" : p.status === activeTab).map(project => (
                 <div key={project.id} className="bg-surface-1 border border-border-default rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <h3 className="text-[18px] font-bold text-text-main">{project.name}</h3>
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${
                             project.status === '待启动' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {project.status}
                          </span>
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedProject(project)}
                            className="px-4 py-2 bg-btn-main text-white text-[12px] font-bold rounded-xl hover:bg-btn-main-hover transition-colors shadow-sm"
                          >
                            打开项目
                          </button>
                          <button className="px-4 py-2 bg-surface-1 border border-border-default text-text-secondary text-[12px] font-bold rounded-xl hover:bg-page-bg transition-colors shadow-sm">
                            查看待办
                          </button>
                       </div>
                    </div>

                    {project.status === "待启动" ? (
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                         <h4 className="text-[13px] font-bold text-amber-900 mb-3 flex items-center gap-1.5">
                           <Clock size={16} /> 启动准备
                         </h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {project.prepStatus?.map((prep, idx) => (
                             <div key={idx} className="flex items-center gap-2">
                               {prep.includes('已确认') ? <CheckCircle2 size={16} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-amber-300 bg-surface-1" />}
                               <span className={`text-[12px] font-medium ${prep.includes('已确认') ? 'text-text-tertiary line-through' : 'text-text-main'}`}>{prep}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><Target size={12}/> 目标</div>
                            <div className="text-[13px] font-bold text-text-main">{project.target}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><Calendar size={12}/> 执行周期</div>
                            <div className="text-[13px] font-bold text-text-main">{project.period}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><LayoutTemplate size={12}/> 当前采用的打法</div>
                            <div className="text-[13px] font-bold text-text-main">{project.strategy}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><FileText size={12}/> 内容 (生成/计划)</div>
                            <div className="text-[13px] font-bold text-text-main">{project.contentProgress}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><Send size={12}/> 发布 (核验/生成)</div>
                            <div className="text-[13px] font-bold text-text-main">{project.publishProgress}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><ImageIcon size={12}/> 素材缺口</div>
                            <div className="text-[13px] font-bold text-danger">{project.materialProgress}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><Users size={12}/> 账号使用概况</div>
                            <div className="text-[13px] font-bold text-text-main line-clamp-1" title={project.accountStats}>{project.accountStats}</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[12px] text-text-tertiary font-bold flex items-center gap-1.5"><MessageSquare size={12}/> 互动线索</div>
                            <div className="text-[13px] font-bold text-brand-logo">{project.leadStats}</div>
                         </div>
                      </div>
                    )}

                    {project.blocker !== "暂无" && (
                      <div className="bg-rose-50 border border-danger-light px-4 py-3 rounded-xl flex items-center justify-between mt-4">
                         <div className="flex items-center gap-2">
                           <AlertCircle size={16} className="text-brand-logo shrink-0" />
                           <span className="text-[12px] font-bold text-danger">当前卡点：</span>
                           <span className="text-[12px] text-danger">{project.blocker}</span>
                         </div>
                         <button className="text-[11px] font-bold bg-surface-1 px-3 py-1 rounded-lg border border-danger-light text-danger hover:bg-danger-light">查看详情</button>
                      </div>
                    )}
                 </div>
              ))}
              {MOCK_PROJECTS.filter(p => activeTab === "进行中" ? p.status === "进行中" : p.status === activeTab).length === 0 && (
                 <div className="py-20 flex flex-col items-center justify-center text-text-tertiary">
                   <Archive size={48} className="mb-4 text-neutral-300" />
                   <p className="text-[15px] font-medium">暂无{activeTab}的项目</p>
                 </div>
              )}
            </div>
          </div>
        </>
      )}

      {mainTab === "账号资产" && accountView === 'list' && (
        <div className="flex-1 overflow-hidden flex relative">
           {/* Account List */}
           <div className="flex-1 overflow-y-auto p-8 bg-page-bg custom-scrollbar">
             <div className="max-w-6xl mx-auto space-y-8">
               <div className="flex justify-between items-center">
                 <h2 className="text-[20px] font-bold text-text-main">账号资产管理</h2>
                 <div className="flex gap-3">
                   <button onClick={() => setAccountView('add')} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-[13px] font-bold hover:bg-primary-700 transition-colors flex items-center gap-2">
                     <Plus size={16} /> 新增账号
                   </button>
                   <button onClick={() => setAccountView('remove')} className="px-4 py-2 bg-surface-1 border border-border-default text-text-secondary rounded-lg text-[13px] font-bold hover:bg-page-bg transition-colors flex items-center gap-2">
                     <Trash2 size={16} /> 移除账号
                   </button>
                 </div>
               </div>
               
               {["自有及可调度账号", "外部合作账号", "发布后识别账号"].map(group => {
                 const accounts = MOCK_ACCOUNTS.filter(a => a.group === group);
                 if (accounts.length === 0) return null;
                 return (
                   <div key={group}>
                      <h3 className="text-[15px] font-bold text-text-main mb-4">{group}</h3>
                      <div className="bg-surface-1 border border-border-default rounded-xl overflow-hidden shadow-sm">
                         <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                                <th className="p-4 font-bold">小红书昵称 / 状态</th>
                                <th className="p-4 font-bold">账号类型</th>
                                <th className="p-4 font-bold">关系 / 关联员工</th>
                                <th className="p-4 font-bold">人设状态</th>
                                <th className="p-4 font-bold">项目数 / 笔记数</th>
                                <th className="p-4 font-bold">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {accounts.map(acc => (
                                <tr key={acc.id} className="border-b border-border-default hover:bg-page-bg transition-colors">
                                  <td className="p-4 cursor-pointer" onClick={() => setSelectedAccount(acc)}>
                                    <div className="text-[13px] font-bold text-text-main mb-1 flex items-center gap-1.5">
                                      <User size={14} className="text-text-tertiary" /> {acc.name}
                                    </div>
                                    <div className={`text-[11px] font-bold inline-block px-2 py-0.5 rounded border ${
                                       acc.status === '正常' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                       acc.status === '待观察' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                       acc.status === '需核验' ? 'bg-rose-50 text-danger border-danger-light' :
                                       'bg-hover-bg text-text-tertiary border-border-default'
                                    }`}>
                                      {acc.status}
                                    </div>
                                  </td>
                                  <td className="p-4 text-[12px] text-text-secondary">{acc.type}</td>
                                  <td className="p-4">
                                    <div className="text-[12px] text-text-secondary mb-1">{acc.relation}</div>
                                    <div className="text-[11px] text-text-tertiary">{acc.employee}</div>
                                  </td>
                                  <td className="p-4 text-[12px] text-text-secondary">{acc.persona}</td>
                                  <td className="p-4 text-[12px] text-text-secondary font-mono">
                                    <span className="font-bold">{acc.projects}</span> / <span className="font-bold text-emerald-600">{acc.verified}</span>
                                  </td>
                                  <td className="p-4">
                                    <button 
                                      onClick={() => setSelectedAccount(acc)}
                                      className="text-[12px] font-bold text-brand-logo hover:text-primary-700 bg-brand-light px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                      详情
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                 )
               })}
             </div>
           </div>

           {/* Account Drawer */}
           <AnimatePresence>
             {selectedAccount && (
               <>
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setSelectedAccount(null)}
                   className="absolute inset-0 bg-btn-main/20 z-20"
                 />
                 <motion.div 
                   initial={{ x: 500, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: 500, opacity: 0 }}
                   className="absolute inset-y-0 right-0 w-[500px] bg-surface-1 border-l border-border-default shadow-2xl flex flex-col z-30 shrink-0"
                 >
                  <div className="p-5 border-b border-border-default flex justify-between items-center bg-page-bg">
                     <h3 className="text-[16px] font-bold text-text-main flex items-center gap-2">
                       <User size={18} className="text-brand-logo" />
                       账号详情
                     </h3>
                     <button onClick={() => setSelectedAccount(null)} className="p-1.5 hover:bg-selected-bg rounded-lg text-text-tertiary transition-colors">
                       <X size={18} />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                     <div>
                        <div className="text-[18px] font-bold text-text-main mb-1">{selectedAccount.name}</div>
                        <div className="text-[12px] text-text-tertiary font-mono mb-3">ID: xhs_id_placeholder</div>
                        <div className={`text-[12px] font-bold inline-block px-2 py-0.5 rounded border ${
                             selectedAccount.status === '正常' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                             selectedAccount.status === '待观察' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                             selectedAccount.status === '需核验' ? 'bg-rose-50 text-danger border-danger-light' :
                             'bg-hover-bg text-text-tertiary border-border-default'
                          }`}>
                          当前状态：{selectedAccount.status}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-[13px]">
                        <div>
                           <div className="text-text-tertiary mb-1">账号类型及关系</div>
                           <div className="font-bold text-text-main">{selectedAccount.type} ({selectedAccount.relation})</div>
                        </div>
                        <div>
                           <div className="text-text-tertiary mb-1">绑定员工/联系人</div>
                           <div className="font-bold text-text-main">{selectedAccount.employee}</div>
                        </div>
                        <div className="col-span-2">
                           <div className="text-text-tertiary mb-1">固定人设和表达身份</div>
                           <div className="font-bold text-text-main">{selectedAccount.persona}</div>
                        </div>
                        <div className="col-span-2 h-px bg-hover-bg"></div>
                        <div>
                           <div className="text-text-tertiary mb-1">授权状态</div>
                           <div className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14}/> 已授权 (数据拉取)</div>
                        </div>
                        <div>
                           <div className="text-text-tertiary mb-1">最近一次使用</div>
                           <div className="font-bold text-text-main">{selectedAccount.lastUse}</div>
                        </div>
                        <div className="col-span-2 h-px bg-hover-bg"></div>
                        <div>
                           <div className="text-text-tertiary mb-1">参与项目数</div>
                           <div className="font-bold text-brand-logo text-[18px]">{selectedAccount.projects}</div>
                        </div>
                        <div>
                           <div className="text-text-tertiary mb-1">已发布笔记数</div>
                           <div className="font-bold text-emerald-600 text-[18px]">{selectedAccount.verified}</div>
                        </div>
                     </div>

                     {selectedAccount.status !== '正常' && (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mt-4">
                           <h4 className="text-[13px] font-bold text-amber-900 mb-2 flex items-center gap-1.5"><AlertCircle size={14}/> 最近异常证据</h4>
                           <ul className="list-disc pl-5 text-[12px] text-amber-800 space-y-1">
                             <li>连续 2 篇笔记审核时间超过 4 小时</li>
                             <li>近期有 1 篇笔记被平台下架</li>
                           </ul>
                        </div>
                     )}
                     
                     {selectedAccount.group === "发布后识别账号" && (
                        <div className="bg-page-bg border border-border-default p-4 rounded-xl mt-4">
                           <h4 className="text-[13px] font-bold text-text-secondary mb-2 flex items-center gap-1.5"><Info size={14}/> 消费者账号分配规则</h4>
                           <p className="text-[12px] text-text-secondary">发布后识别的真实消费者账号默认不可继续派发新任务，若需长期合作请先转入外部合作库。</p>
                        </div>
                     )}
                  </div>

                  <div className="p-4 border-t border-border-default bg-surface-1 grid grid-cols-2 gap-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                     <button className="py-2 text-[12px] font-bold bg-page-bg text-text-secondary rounded-lg border border-border-default hover:bg-hover-bg transition-colors col-span-2">查看参与项目与发布笔记</button>
                     <button className="py-2 text-[12px] font-bold bg-page-bg text-text-secondary rounded-lg border border-border-default hover:bg-hover-bg transition-colors">修改员工绑定</button>
                     {selectedAccount.group !== "发布后识别账号" && selectedAccount.status !== '暂停派发' ? (
                       <button className="py-2 text-[12px] font-bold bg-rose-50 text-danger rounded-lg border border-danger-light hover:bg-danger-light transition-colors">暂停后续派发</button>
                     ) : (
                       <button className="py-2 text-[12px] font-bold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors" disabled={selectedAccount.group === "发布后识别账号"}>恢复派发</button>
                     )}
                  </div>
               </motion.div>
               </>
             )}
           </AnimatePresence>
        </div>
      )}
      
      {/* Add Account View */}
      {mainTab === "账号资产" && accountView === 'add' && (
        <div className="flex-1 overflow-y-auto p-8 bg-page-bg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setAccountView('list')} className="p-2 hover:bg-selected-bg rounded-lg text-text-tertiary transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-[20px] font-bold text-text-main">新增账号</h2>
            </div>
            
            <div className="bg-surface-1 border border-border-default rounded-xl shadow-sm p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-text-secondary">小红书昵称</label>
                  <input type="text" className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-primary-500" placeholder="请输入小红书昵称" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-text-secondary">主页链接 / 小红书号</label>
                  <input type="text" className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-primary-500" placeholder="请输入链接或ID" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-text-secondary">账号类型</label>
                  <select className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-primary-500 bg-surface-1">
                    <option>KOS</option>
                    <option>专业号</option>
                    <option>KOC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-text-secondary">人设方向</label>
                  <input type="text" className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-primary-500" placeholder="例如：成分党评测" />
                </div>
              </div>
              <div className="pt-6 border-t border-border-default flex justify-end gap-3">
                <button onClick={() => setAccountView('list')} className="px-6 py-2 bg-surface-1 border border-border-default text-text-secondary font-bold rounded-xl text-[13px] hover:bg-page-bg transition-colors">取消</button>
                <button onClick={() => setAccountView('list')} className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl text-[13px] hover:bg-primary-700 transition-colors">确认新增</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Account View */}
      {mainTab === "账号资产" && accountView === 'remove' && (
        <div className="flex-1 overflow-y-auto p-8 bg-page-bg">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setAccountView('list')} className="p-2 hover:bg-selected-bg rounded-lg text-text-tertiary transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-[20px] font-bold text-text-main">移除账号</h2>
            </div>
            
            <div className="bg-surface-1 border border-border-default rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[15px] font-bold text-text-main">选择要移除的账号</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="搜索账号名称..." className="border border-neutral-300 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-primary-500" />
                  <button className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-[13px] hover:bg-rose-700 transition-colors">批量移除</button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-page-bg border-b border-border-default text-[12px] text-text-tertiary font-bold">
                    <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="p-3">账号名称</th>
                    <th className="p-3">类型</th>
                    <th className="p-3">状态</th>
                    <th className="p-3">关联项目数</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="border-b border-border-default hover:bg-page-bg">
                      <td className="p-3"><input type="checkbox" className="rounded" /></td>
                      <td className="p-3 font-medium text-[13px]">小红书-A0{i}</td>
                      <td className="p-3 text-[13px] text-text-tertiary">KOS</td>
                      <td className="p-3 text-[13px]">
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded">正常</span>
                      </td>
                      <td className="p-3 text-[13px] text-text-tertiary">3个</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
