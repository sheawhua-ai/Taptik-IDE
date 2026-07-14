import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderOpen, Target, Calendar, LayoutTemplate, FileText, Image as ImageIcon, Users, MessageSquare, AlertCircle, ArrowRight, Activity, BarChart2, Archive, CheckCircle2, X, Link, Play, ChevronLeft, AlertOctagon, Zap, ShieldCheck, Info
} from "lucide-react";

type ProjectStatus = "进行中" | "待启动" | "已暂停" | "已完成" | "已归档";
type DetailTab = "项目总览" | "内容包" | "素材与拍摄" | "发布与账号" | "互动与线索" | "消费者参与" | "调整与复盘";

export function ProjectAssets() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>("进行中");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("项目总览");

  const MOCK_PROJECTS = [
    {
      id: "p1",
      name: "幼犬换粮避坑搜索卡位",
      status: "进行中",
      target: "搜索卡位 + 私域承接",
      period: "2026-07-01 至 2026-07-07",
      strategy: "美妆搜索种草打法",
      contentProgress: "42 篇笔记 / 38 篇已发布",
      materialProgress: "缺 8 组场景图",
      accountStats: "主账号 1 / KOS 3 / 素人 30",
      leadStats: "18 条线索 / 6 条待处理",
      blocker: "真实喂食素材不足，影响 12 篇排期"
    },
    {
      id: "p2",
      name: "双十一大促种草企划",
      status: "待启动",
      target: "大促转化 + 曝光",
      period: "2026-10-15 至 2026-11-11",
      strategy: "自定义打法",
      contentProgress: "0 篇笔记 / 0 篇已发布",
      materialProgress: "待分配",
      accountStats: "未分配",
      leadStats: "0",
      blocker: "暂无"
    }
  ];

  if (selectedProject) {
    return (
      <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-neutral-900 rounded-2xl border border-neutral-100 shadow-sm relative">
        {/* Detail Header */}
        <div className="px-8 py-5 border-b border-neutral-100 bg-white shrink-0">
           <div className="flex items-center gap-4 mb-5">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-900 font-bold transition-colors"
              >
                <ChevronLeft size={16} /> 返回项目列表
              </button>
              <div className="w-px h-4 bg-neutral-200" />
              <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
                项目：{selectedProject.name}
              </h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-bold rounded border border-green-200">
                状态：{selectedProject.status}
              </span>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-[12px] text-neutral-600 font-medium bg-neutral-50/80 px-4 py-2.5 rounded-xl border border-neutral-100">
                 <div className="flex items-center gap-1.5"><Target size={14} className="text-neutral-400" /> 目标：{selectedProject.target}</div>
                 <div className="flex items-center gap-1.5"><Calendar size={14} className="text-neutral-400" /> 周期：7 天</div>
                 <div className="flex items-center gap-1.5"><FileText size={14} className="text-neutral-400" /> 内容：42 / 50</div>
                 <div className="flex items-center gap-1.5"><ImageIcon size={14} className="text-neutral-400" /> 待传素材：8</div>
                 <div className="flex items-center gap-1.5"><MessageSquare size={14} className="text-neutral-400" /> 线索：18</div>
                 <div className="flex items-center gap-1.5 text-rose-600"><AlertOctagon size={14} /> 当前卡点：3 个</div>
              </div>
              <div className="flex items-center gap-2">
                 {(selectedProject?.status !== "已完成" && selectedProject?.status !== "已归档") && (
                   <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5">
                     <Zap size={14} /> 查看相关执行事项
                   </button>
                 )}
                 <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[12px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                   生成复盘
                 </button>
                 <button className="p-2 bg-white border border-neutral-200 text-neutral-400 rounded-xl hover:text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm">
                   <Archive size={16} />
                 </button>
              </div>
           </div>
        </div>

        {/* Detail Tabs */}
        <div className="px-8 pt-4 border-b border-neutral-100 bg-white shrink-0">
          <div className="flex items-center gap-6">
            {(["项目总览", "内容包", "素材与拍摄", "发布与账号", "互动与线索", "消费者参与", "调整与复盘"] as DetailTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                className={`pb-4 text-[14px] font-bold transition-colors relative ${detailTab === tab ? "text-primary-600" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                {tab}
                {detailTab === tab && (
                  <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50 custom-scrollbar">
           {detailTab === "项目总览" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-3 gap-6">
                   <div className="col-span-2 space-y-6">
                      <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm">
                         <h3 className="text-[14px] font-bold text-rose-700 flex items-center gap-2 mb-4">
                           <AlertOctagon size={16} /> 关键卡点
                         </h3>
                         <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                            <h4 className="text-[14px] font-bold text-rose-900 mb-2">缺真实喂食场景图</h4>
                            <p className="text-[12px] text-rose-700 mb-4">影响：12 篇笔记无法排期</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-bold text-rose-800">建议：派发员工补拍，或使用历史素材替代</span>
                              <button className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700 transition-colors shadow-sm">
                                去处理
                              </button>
                            </div>
                         </div>
                      </div>
                      
                      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                         <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2 mb-4">
                           <Target size={16} className="text-neutral-400" /> 项目目标与进度
                         </h3>
                         <div className="h-32 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center text-neutral-400 text-[13px] font-medium">
                            进度图表占位
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                         <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2 mb-4">
                           <Activity size={16} className="text-neutral-400" /> 最近动态
                         </h3>
                         <div className="space-y-4">
                            <div className="flex gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                               <div>
                                 <p className="text-[13px] text-neutral-700 font-medium">达人 A 已发布体验笔记</p>
                                 <span className="text-[11px] text-neutral-400">10分钟前</span>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                               <div>
                                 <p className="text-[13px] text-neutral-700 font-medium">产生 3 条新购买意向线索</p>
                                 <span className="text-[11px] text-neutral-400">2小时前</span>
                               </div>
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
                 {["全部", "待派发", "已派发", "素材已齐", "等待审核", "准备发布", "已发布"].map(t => (
                   <button key={t} className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                     {t}
                   </button>
                 ))}
               </div>
               <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-neutral-50 border-b border-neutral-100 text-[12px] text-neutral-500 font-bold">
                         <th className="p-4 font-bold">内容标题</th>
                         <th className="p-4 font-bold">类型</th>
                         <th className="p-4 font-bold">账号属性</th>
                         <th className="p-4 font-bold">状态</th>
                         <th className="p-4 font-bold">操作</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                         <td className="p-4">
                           <div className="text-[13px] font-bold text-neutral-900">幼犬换粮必看！新手...</div>
                         </td>
                         <td className="p-4"><span className="text-[12px] text-neutral-600 font-medium">正式笔记</span></td>
                         <td className="p-4"><span className="text-[12px] text-neutral-600 font-medium">KOS / 店长</span></td>
                         <td className="p-4"><span className="text-[12px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">等待审核</span></td>
                         <td className="p-4">
                            <button className="text-[12px] text-primary-600 font-bold hover:text-primary-700">查看详情</button>
                         </td>
                       </tr>
                     </tbody>
                  </table>
               </div>
             </div>
           )}
           
           {detailTab === "消费者参与" && (
             <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-100">
                     <div className="flex items-center gap-4 text-[14px] font-bold text-neutral-900">
                       <span className="text-primary-700 bg-primary-50 px-3 py-1 rounded-lg">30个名额</span>
                       <span className="text-neutral-500">已领取 12</span>
                       <span className="text-neutral-500">已生成笔记包 10</span>
                       <span className="text-neutral-500">素材已齐 6</span>
                       <span className="text-neutral-500">已发布 4</span>
                       <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">需协助 2</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">展示二维码</button>
                       <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">复制参与链接</button>
                       <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">预览客户H5</button>
                       <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">对话调整入口</button>
                       <button className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-[13px] font-bold hover:bg-rose-100 transition-colors">暂停领取</button>
                     </div>
                   </div>
                   
                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-[13px] text-blue-800 flex items-center gap-2 mb-6">
                     <Info size={16} /> 新设置只影响之后领取的客户，不修改已经生成的笔记包。
                   </div>

                   {/* List of generated packages or participating customers could go here */}
                   <div className="text-center py-10 text-neutral-400">
                      <CheckCircle2 size={48} className="mx-auto mb-4 text-neutral-300" />
                      <p className="text-[14px] font-medium">当前已有 12 位客户参与，可前往进行中心查看异常事项。</p>
                   </div>
                </div>
             </div>
           )}
           
           {/* Fallback for other tabs */}
           {detailTab !== "总览" && detailTab !== "内容资产" && detailTab !== "客户参与" && (
             <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                <CheckCircle2 size={48} className="mb-4 text-neutral-300" />
                <p className="text-[15px] font-medium">{detailTab}模块数据为空或建设中</p>
             </div>
           )}
        </div>
      </div>
    );
  }

  // --- 项目列表 (List View) ---
  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-neutral-900 rounded-2xl border border-neutral-100 shadow-sm relative">
      {/* 顶部标题区 */}
      <div className="px-8 py-6 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
              <FolderOpen size={24} className="text-primary-500" />
              项目档案
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1">查看每个项目的内容、素材、发布、线索和沉淀结果。需要处理的事项会进入进行中心。</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-4 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center gap-6">
          {(["进行中", "待启动", "已暂停", "已完成", "已归档"] as ProjectStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold transition-colors relative ${activeTab === tab ? "text-primary-600" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="project-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-4">
          {MOCK_PROJECTS.filter(p => activeTab === "进行中" ? p.status === "进行中" : p.status === activeTab).map(project => (
             <div key={project.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <h3 className="text-[18px] font-bold text-neutral-900">{project.name}</h3>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-bold rounded border border-green-200">
                        {project.status}
                      </span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
                      >
                        查看项目档案
                      </button>
                      <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                        进入执行队列
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><Target size={12}/> 目标</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.target}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><Calendar size={12}/> 周期</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.period}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><LayoutTemplate size={12}/> 当前打法</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.strategy}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><FileText size={12}/> 内容进度</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.contentProgress}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><ImageIcon size={12}/> 素材进度</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.materialProgress}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><Users size={12}/> 账号参与</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.accountStats}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] text-neutral-500 font-bold flex items-center gap-1.5"><MessageSquare size={12}/> 线索结果</div>
                      <div className="text-[13px] font-bold text-neutral-800">{project.leadStats}</div>
                   </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl flex items-center gap-2">
                   <AlertCircle size={16} className="text-rose-500 shrink-0" />
                   <span className="text-[12px] font-bold text-rose-800">当前卡点：</span>
                   <span className="text-[12px] text-rose-700">{project.blocker}</span>
                </div>
             </div>
          ))}
          {MOCK_PROJECTS.filter(p => activeTab === "进行中" ? p.status === "进行中" : p.status === activeTab).length === 0 && (
             <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
               <Archive size={48} className="mb-4 text-neutral-300" />
               <p className="text-[15px] font-medium">暂无{activeTab}的项目</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
