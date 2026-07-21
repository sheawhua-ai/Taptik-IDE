const fs = require('fs');

const content = `import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, MessageCircle, ShieldCheck, Zap, Search, Upload, CheckCircle2, ChevronRight,
  Database, Users, Image as ImageIcon, Plus, FileText, Link as LinkIcon, MessageSquare,
  Clock, Settings, History, Info, Activity, AlertCircle, AlertTriangle, BookOpen, X,
  Check, Edit3, Trash2, GitMerge, Eye, FileCode2, PieChart, Sparkles, Folder, Download,
  Send, PenTool, LayoutTemplate, Network, Layout, ShieldAlert, FolderOpen, Maximize2, Minimize2, Save, FileWarning, CheckCircle, Ban
} from "lucide-react";

export function KnowledgeMemory() {
  const [activeSpace, setActiveSpace] = useState<"merchant" | "personal">("merchant");
  const [merchantTab, setMerchantTab] = useState<"overview" | "critical" | "source">("overview");
  const [personalTab, setPersonalTab] = useState<"quick" | "experiences" | "methods">("quick");

  // Merchant State
  const [criticalFilter, setCriticalFilter] = useState("需要处理");
  const [selectedCritical, setSelectedCritical] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  
  // Personal State
  const [expFilter, setExpFilter] = useState("全部");
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [quickNote, setQuickNote] = useState("");

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Mock Data
  const merchantBlocked = [
    { id: 1, scenario: "商家诊断", missing: "产品利润和价格依据", reason: "无法推算合理的ROI目标和预算分配比例。" },
    { id: 2, scenario: "私域承接", missing: "承接话术", reason: "AI无法自动生成符合品牌调性的客服回复策略。" },
    { id: 3, scenario: "账号内容生成", missing: "KOS店长号人设", reason: "缺少第一人称视角的表达规范和背景设定。" },
  ];

  const criticalKnowledge = [
    { id: "c1", summary: "不能承诺治疗软便，只能表达“帮助肠胃适应”或“换粮过渡建议”。", theme: "禁区与合规", source: "2026-07-03 私信记录", status: "待确认", time: "2026-07-08", credibility: "AI归纳" },
    { id: "c2", summary: "618 期间购买送冻干试吃装。", theme: "品牌与产品", source: "2026-06 运营计划", status: "已失效", time: "2026-06-20", credibility: "来源支持" },
    { id: "c3", summary: "幼犬主粮毛利约 45%，最高可接受 150 元获客成本。", theme: "品牌与产品", source: "操盘手初始化访谈", status: "待确认", time: "2026-07-08", credibility: "人工确认" },
    { id: "c4", summary: "KOS店长号人设：3年宠物营养师，家里养了2只金毛，说话直率专业。", theme: "账号与人设", source: "最新业务会议纪要", status: "已采用", time: "2026-07-01", credibility: "人工确认" },
    { id: "c5", summary: "原包材已停产，新批次采用密封拉链袋。", theme: "品牌与产品", source: "供应链同步文档", status: "有冲突", time: "2026-07-09", credibility: "来源支持", conflictReason: "与历史资料库中的'罐装包装'描述冲突" },
  ];

  const sourcesData = [
    { id: "s1", type: "folder", name: "商家核心资料", path: "/Volumes/Data/MerchantData/Core", count: 12, time: "10分钟前", status: "可用" },
    { id: "s2", type: "folder", name: "历史客服聊天记录", path: "/Volumes/Data/MerchantData/CS_Logs", count: 128, time: "2小时前", status: "内容有变化" },
    { id: "s3", type: "file", name: "2026Q3产品价格表.xlsx", path: "/Volumes/Data/MerchantData/2026Q3产品价格表.xlsx", count: 1, time: "刚刚", status: "处理中" },
    { id: "s4", type: "file", name: "旧版包装规范.pdf", path: "/Volumes/Data/MerchantData/旧版包装规范.pdf", count: 1, time: "昨天", status: "需要处理" },
    { id: "s5", type: "folder", name: "损坏的备份包", path: "/Volumes/Data/MerchantData/Backup", count: 0, time: "昨天", status: "无法读取" },
  ];

  const experiencesData = [
    { id: "e1", title: "发现宠物食品类目下，第一人称开箱视频点击率高 20%", type: "通用经验", scope: "宠物食品 / 开箱视频", valStatus: "已验证", callStatus: "可参考", date: "今天 10:30", source: "我的观察", content: "通过对比3个宠物粮项目，第一人称视角的开箱不仅点击率高，且评论区关于产品颗粒大小的疑问明显减少。" },
    { id: "e2", title: "下次尝试把所有干粮的包装都做成深色系，看起来更高端一点", type: "待验证想法", scope: "宠物食品", valStatus: "待验证", callStatus: "不调用", date: "昨天 16:45", source: "灵感随笔", content: "看到竞品黑色包装质感很好，下次向客户提议。" },
    { id: "e3", title: "遇到软便问题，统一回复'换粮过渡期常见现象，建议搭配益生菌'", type: "指定商家经验", scope: "当前商家", valStatus: "已验证", callStatus: "已应用", date: "3天前", source: "客户反馈总结", content: "由于产品高蛋白，极易引起肠胃敏感犬只软便，必须准备标准话术防御。" }
  ];

  const methodsData = [
    { id: "m1", name: "宠物食品小红书起号打法 v2.0", type: "操盘打法", scope: "宠物食品 / 冷启动 / 搜索卡位", callStatus: "已启用", valStatus: "已验证", steps: [{title: "一、人设搭建", desc: "建议采用'前大厂营养师'或'资深繁育人'人设，强调专业与真实性。避开同质化的'铲屎官'人设。"}, {title: "二、首月30篇SOP", desc: "前10篇侧重干货与测评铺垫，中间10篇引入软植入，最后10篇配合活动强转化。"}], applicable: "宠物食品类目", inapplicable: "成熟期大品牌，预算充足直接投流", needsConfirm: true },
    { id: "m2", name: "高转化单品测评图文框架", type: "写作框架", scope: "宠物食品 / 日常种草", callStatus: "已启用", valStatus: "已验证", steps: [{title: "封面", desc: "产品高清特写 + 核心痛点大字报"}, {title: "正文第一段", desc: "抛出铲屎官常见痛点引发共鸣"}, {title: "正文第二段", desc: "成分解析，数据支撑背书"}], applicable: "所有功能性宠物食品", inapplicable: "纯外观零食", needsConfirm: false }
  ];

  // Actions for Drawer
  const closeDrawers = () => {
    setSelectedCritical(null);
    setSelectedSource(null);
    setSelectedExp(null);
    setSelectedMethod(null);
  };

  // Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "可用": case "已采用": case "已应用": case "已验证": case "已启用": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "待确认": case "内容有变化": case "需要处理": case "待验证": return "text-amber-600 bg-amber-50 border-amber-200";
      case "有冲突": case "无法读取": return "text-red-600 bg-red-50 border-red-200";
      case "处理中": return "text-blue-600 bg-blue-50 border-blue-200";
      case "已失效": case "不调用": return "text-neutral-500 bg-neutral-100 border-neutral-200";
      case "可参考": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-neutral-600 bg-neutral-100 border-neutral-200";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fafafa] relative overflow-hidden">
      {/* Top Header - Space Switcher */}
      <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-8 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          <button
            onClick={() => {setActiveSpace("merchant"); closeDrawers();}}
            className={"text-[15px] font-bold py-4 relative transition-colors " + (activeSpace === "merchant" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
          >
            商家知识
            {activeSpace === "merchant" && <motion.div layoutId="spaceTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />}
          </button>
          <button
            onClick={() => {setActiveSpace("personal"); closeDrawers();}}
            className={"text-[15px] font-bold py-4 relative transition-colors " + (activeSpace === "personal" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
          >
            我的经验
            {activeSpace === "personal" && <motion.div layoutId="spaceTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1200px] mx-auto p-8">
          
          {/* Merchant Space */}
          {activeSpace === "merchant" && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-6">
              {/* Secondary Tabs */}
              <div className="flex gap-2">
                {["overview", "critical", "source"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {setMerchantTab(tab as any); closeDrawers();}}
                    className={"px-4 py-2 rounded-xl text-[14px] font-bold transition-colors " + (merchantTab === tab ? "bg-white text-neutral-900 border border-neutral-200 shadow-sm" : "text-neutral-500 hover:bg-neutral-100")}
                  >
                    {tab === "overview" ? "总览" : tab === "critical" ? "关键知识" : "资料来源"}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {merchantTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Area 1: Currently Executable */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={18} /> 当前可开展</h3>
                    <div className="space-y-3">
                      {["内容生成", "内容审核", "素材判断", "日常发文规划"].map(item => (
                        <div key={item} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-[14px] font-bold text-neutral-800">{item}</span>
                          <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">可开展</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Area 2: Currently Blocked */}
                  <div className="col-span-1 md:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><Ban className="text-red-500" size={18} /> 当前阻断</h3>
                    <div className="space-y-4">
                      {merchantBlocked.map(b => (
                        <div key={b.id} className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex gap-4 items-start">
                          <AlertTriangle className="text-red-500 mt-1 shrink-0" size={20} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[14px] font-bold text-red-900">{b.scenario}</span>
                              <span className="text-[12px] text-red-600 bg-red-100 px-2 py-0.5 rounded">阻断</span>
                            </div>
                            <div className="text-[13px] text-red-800 mb-1"><span className="font-bold opacity-70">缺少:</span> {b.missing}</div>
                            <div className="text-[13px] text-red-700/80 mb-3"><span className="font-bold opacity-70">影响:</span> {b.reason}</div>
                            <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[12px] font-bold hover:bg-red-700 transition-colors shadow-sm">
                              去处理
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Area 3: Needs Processing */}
                  <div className="col-span-1 md:col-span-3 bg-white border border-amber-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                        <FileWarning size={24} />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-neutral-900 mb-1">5 项关键知识或资料来源需要处理</h3>
                        <p className="text-[13px] text-neutral-500">包含 2 个待确认事实、1 个知识冲突、1 个文件变化、1 个无法读取</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                        添加资料
                      </button>
                      <button onClick={() => setMerchantTab("critical")} className="px-5 py-2 bg-amber-500 text-white rounded-xl text-[14px] font-bold hover:bg-amber-600 transition-colors shadow-sm">
                        处理 5 项待办
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Critical Knowledge Tab */}
              {merchantTab === "critical" && (
                <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  <div className="p-4 border-b border-neutral-100 flex items-center gap-6">
                    <div className="flex gap-2">
                      {["需要处理", "已采用", "全部"].map(f => (
                        <button key={f} onClick={() => setCriticalFilter(f)} className={"px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors " + (criticalFilter === f ? "bg-neutral-100 text-neutral-900" : "text-neutral-500 hover:text-neutral-800")}>
                          {f}
                        </button>
                      ))}
                    </div>
                    <div className="h-6 w-px bg-neutral-200"></div>
                    <div className="flex gap-2">
                      {["品牌与产品", "账号与人设", "客户与痛点", "内容规范", "禁区与合规", "话术与承接", "运营复盘"].map(t => (
                         <button key={t} className="px-2 py-1 rounded text-[12px] font-medium text-neutral-500 hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-colors">{t}</button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-100">
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500">摘要</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-32">所属主题</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-48">来源</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-32">更新时间</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-24">状态</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px]">
                        {criticalKnowledge.filter(k => criticalFilter === "全部" || (criticalFilter === "需要处理" && ["待确认", "有冲突", "已失效"].includes(k.status)) || (criticalFilter === "已采用" && k.status === "已采用")).map((k) => (
                          <tr key={k.id} onClick={() => setSelectedCritical(k)} className="border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer group transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-neutral-900 truncate max-w-[400px]">{k.summary}</div>
                            </td>
                            <td className="px-6 py-4 text-neutral-500">{k.theme}</td>
                            <td className="px-6 py-4 text-neutral-500 truncate max-w-[200px]" title={k.source}>{k.source}</td>
                            <td className="px-6 py-4 text-neutral-400">{k.time}</td>
                            <td className="px-6 py-4">
                              <span className={"px-2.5 py-1 rounded text-[12px] font-bold border " + getStatusColor(k.status)}>{k.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {criticalKnowledge.filter(k => criticalFilter === "全部" || (criticalFilter === "需要处理" && ["待确认", "有冲突", "已失效"].includes(k.status)) || (criticalFilter === "已采用" && k.status === "已采用")).length === 0 && (
                      <div className="p-12 text-center text-neutral-400 text-[14px]">没有匹配的记录</div>
                    )}
                  </div>
                </div>
              )}

              {/* Sources Tab */}
              {merchantTab === "source" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-neutral-900">资料来源</h3>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-2">
                        <FolderOpen size={16}/> 连接本地文件夹
                      </button>
                      <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                        <FileText size={16}/> 添加单个文件
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-100">
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-[300px]">名称与路径</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-24">文件数</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-32">最近检查</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-24">状态</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-32 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px]">
                        {sourcesData.map((s) => (
                          <tr key={s.id} onClick={() => setSelectedSource(s)} className="border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer group transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {s.type === 'folder' ? <Folder className="text-blue-500 shrink-0" size={18}/> : <FileText className="text-neutral-400 shrink-0" size={18}/>}
                                <div className="overflow-hidden">
                                  <div className="font-bold text-neutral-900 truncate">{s.name}</div>
                                  <div className="text-[11px] text-neutral-400 truncate max-w-[250px]" title={s.path}>{s.path}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-neutral-500">{s.count > 0 ? `${s.count} 项` : '-'}</td>
                            <td className="px-6 py-4 text-neutral-400">{s.time}</td>
                            <td className="px-6 py-4">
                              <span className={"px-2.5 py-1 rounded text-[12px] font-bold border " + getStatusColor(s.status)}>{s.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded bg-white border border-neutral-200" title="检查更新"><Activity size={14}/></button>
                                <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded bg-white border border-neutral-200" title="断开连接/移除"><Trash2 size={14}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Personal Space */}
          {activeSpace === "personal" && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-6">
              <div className="flex gap-2">
                {["quick", "experiences", "methods"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {setPersonalTab(tab as any); closeDrawers();}}
                    className={"px-4 py-2 rounded-xl text-[14px] font-bold transition-colors " + (personalTab === tab ? "bg-white text-neutral-900 border border-neutral-200 shadow-sm" : "text-neutral-500 hover:bg-neutral-100")}
                  >
                    {tab === "quick" ? "快速记录" : tab === "experiences" ? "经验库" : "方法与模板"}
                  </button>
                ))}
              </div>

              {/* Quick Note */}
              {personalTab === "quick" && (
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm max-w-[800px]">
                  <h2 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <PenTool size={18} className="text-primary-500" />
                    随手记一条
                  </h2>
                  <div className="relative">
                    <textarea
                      value={quickNote}
                      onChange={e => setQuickNote(e.target.value)}
                      placeholder="记录选题想法、客户原话、素材判断、竞品观察、复盘或待验证假设..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 pb-12 text-[14px] text-neutral-900 focus:outline-none focus:border-primary-500 min-h-[160px] resize-none custom-scrollbar"
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 transition-colors text-[13px] font-medium">
                          <LinkIcon size={14} /> 解析链接
                        </button>
                        <button className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 transition-colors text-[13px] font-medium">
                          <FolderOpen size={14} /> 选择本地文件
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-neutral-400 font-medium bg-white px-2 py-1 rounded shadow-sm border border-neutral-100">
                        <ShieldCheck size={14} className="text-emerald-500"/> 默认只保存在我的经验中，不会直接影响任何商家结果。
                      </div>
                    </div>
                  </div>
                  {quickNote && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:"auto"}} className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <span className="text-[13px] font-bold text-neutral-700">保存为：</span>
                         <select className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary-500">
                           <option>通用经验</option>
                           <option>行业经验</option>
                           <option>指定商家经验</option>
                           <option>待验证想法</option>
                         </select>
                      </div>
                      <button onClick={() => setQuickNote("")} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold shadow-sm hover:bg-neutral-800 transition-colors">
                        保存到我的经验
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Experiences */}
              {personalTab === "experiences" && (
                <div className="space-y-6">
                  <div className="flex gap-2">
                     {["全部", "待验证", "已验证", "已应用"].map(f => (
                       <button key={f} onClick={() => setExpFilter(f)} className={"px-4 py-2 rounded-full text-[13px] font-bold transition-colors border " + (expFilter === f ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50")}>
                         {f}
                       </button>
                     ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiencesData.filter(e => expFilter === "全部" || e.valStatus === expFilter || e.callStatus === expFilter).map(exp => (
                      <div key={exp.id} onClick={() => setSelectedExp(exp)} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-primary-300 transition-all cursor-pointer flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-3">
                          <span className={"px-2 py-0.5 rounded text-[11px] font-bold border " + getStatusColor(exp.valStatus)}>{exp.valStatus}</span>
                          <span className={"px-2 py-0.5 rounded text-[11px] font-bold border " + getStatusColor(exp.callStatus)}>{exp.callStatus}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-neutral-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">{exp.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                          <span className="text-[11px] text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100">{exp.type}</span>
                          <span className="text-[11px] text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 truncate max-w-[150px]">{exp.scope}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Methods */}
              {personalTab === "methods" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {methodsData.map(m => (
                    <div key={m.id} onClick={() => setSelectedMethod(m)} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:border-primary-300 transition-all cursor-pointer flex flex-col h-full group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                            {m.type.includes("模板") || m.type.includes("框架") ? <LayoutTemplate size={20}/> : <Network size={20}/>}
                          </div>
                          <div>
                            <h3 className="text-[16px] font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">{m.name}</h3>
                            <span className="text-[12px] text-neutral-500">{m.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <span className={"px-2 py-0.5 rounded text-[11px] font-bold border " + getStatusColor(m.valStatus)}>{m.valStatus}</span>
                           <span className={"px-2 py-0.5 rounded text-[11px] font-bold border " + getStatusColor(m.callStatus)}>{m.callStatus}</span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4 mb-4 text-[13px] text-neutral-700">
                        <span className="font-bold text-neutral-900 mb-1 block">适用范围：</span>
                        {m.scope}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                         {m.needsConfirm && <span className="text-[12px] text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded font-medium"><AlertCircle size={12}/> 执行需人工确认</span>}
                         {!m.needsConfirm && <span className="text-[12px] text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded font-medium"><CheckCircle size={12}/> 自动执行</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {/* Critical Knowledge Drawer */}
        {selectedCritical && (
          <motion.div initial={{x:400, opacity:0}} animate={{x:0, opacity:1}} exit={{x:400, opacity:0}} className="absolute top-0 right-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50">
             <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
               <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Database size={18} className="text-neutral-500" /> 知识详情</h3>
               <button onClick={closeDrawers} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-[12px] font-bold text-neutral-400 mb-2">内容摘要</h4>
                  <div className="text-[14px] font-medium text-neutral-900 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    {selectedCritical.summary}
                  </div>
                </div>
                {selectedCritical.conflictReason && (
                   <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                      <div className="text-[13px] font-bold text-red-800 mb-1 flex items-center gap-1"><AlertTriangle size={14}/> 存在冲突</div>
                      <div className="text-[13px] text-red-700/80">{selectedCritical.conflictReason}</div>
                   </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">所属主题</h4>
                     <span className="text-[13px] font-medium text-neutral-800 bg-neutral-100 px-2 py-1 rounded">{selectedCritical.theme}</span>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">当前状态</h4>
                     <span className={"px-2 py-1 rounded text-[12px] font-bold border " + getStatusColor(selectedCritical.status)}>{selectedCritical.status}</span>
                   </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">可信度 / AI识别依据</h4>
                     <div className="flex items-center gap-2 text-[13px] text-neutral-800">
                       {selectedCritical.credibility === '人工确认' && <CheckCircle size={14} className="text-emerald-500"/>}
                       {selectedCritical.credibility === '来源支持' && <FolderOpen size={14} className="text-blue-500"/>}
                       {selectedCritical.credibility === 'AI归纳' && <Brain size={14} className="text-amber-500"/>}
                       {selectedCritical.credibility}
                     </div>
                     <p className="text-[12px] text-neutral-500 mt-2 bg-white border border-neutral-100 p-3 rounded-lg">AI从源文件中多次提取到高度相关的表达，判断此为长期影响运营的关键规则，建议沉淀为正式知识。</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-400 mb-1">来源类型与文件</h4>
                    <div className="text-[13px] text-neutral-800 flex items-center gap-2 break-all bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                      <FileText size={14} className="shrink-0 text-neutral-400"/> {selectedCritical.source}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-400 mb-1">可能影响的业务场景</h4>
                    <div className="text-[13px] text-neutral-800">内容生成、评论回复、客服私信</div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-400 mb-1">更新时间</h4>
                    <div className="text-[13px] text-neutral-800">{selectedCritical.time}</div>
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-2">
                {selectedCritical.status === '待确认' && (
                  <>
                    <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">采用</button>
                    <button onClick={closeDrawers} className="py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">修改后采用</button>
                    <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center">忽略</button>
                  </>
                )}
                {selectedCritical.status === '已采用' && (
                  <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-red-50 transition-colors shadow-sm text-center">标记失效</button>
                )}
                {selectedCritical.status === '有冲突' && (
                  <button onClick={closeDrawers} className="py-2.5 bg-amber-500 text-white font-bold text-[13px] rounded-xl hover:bg-amber-600 transition-colors shadow-sm text-center">查看冲突来源</button>
                )}
             </div>
          </motion.div>
        )}

        {/* Source Drawer */}
        {selectedSource && (
          <motion.div initial={{x:400, opacity:0}} animate={{x:0, opacity:1}} exit={{x:400, opacity:0}} className="absolute top-0 right-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50">
             <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
               <h3 className="font-bold text-neutral-900 flex items-center gap-2"><FolderOpen size={18} className="text-neutral-500" /> 资料来源详情</h3>
               <button onClick={closeDrawers} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                   <h4 className="text-[16px] font-bold text-neutral-900 break-all">{selectedSource.name}</h4>
                   <p className="text-[12px] text-neutral-500 mt-1 break-all bg-neutral-50 p-2 rounded-lg border border-neutral-100 mt-2 font-mono">{selectedSource.path}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100">
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">最近检查时间</h4>
                     <span className="text-[13px] text-neutral-800">{selectedSource.time}</span>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">读取状态</h4>
                     <span className={"px-2 py-1 rounded text-[12px] font-bold border " + getStatusColor(selectedSource.status)}>{selectedSource.status}</span>
                   </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[13px] font-bold text-neutral-900 flex items-center gap-2"><Brain size={14} className="text-primary-500"/> AI 识别统计</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center justify-between">
                       <span className="text-[12px] font-bold text-emerald-800">已采用知识</span>
                       <span className="text-[16px] font-bold text-emerald-600">12</span>
                     </div>
                     <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center justify-between">
                       <span className="text-[12px] font-bold text-amber-800">待确认知识</span>
                       <span className="text-[16px] font-bold text-amber-600">3</span>
                     </div>
                     <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center justify-between">
                       <span className="text-[12px] font-bold text-red-800">冲突知识</span>
                       <span className="text-[16px] font-bold text-red-600">1</span>
                     </div>
                     <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl flex items-center justify-between">
                       <span className="text-[12px] font-bold text-neutral-700">已失效知识</span>
                       <span className="text-[16px] font-bold text-neutral-500">4</span>
                     </div>
                  </div>
                  {selectedSource.status === "内容有变化" && (
                     <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="text-[13px] font-bold text-amber-800 mb-1">文件发生变化后的影响</div>
                        <p className="text-[12px] text-amber-700/80">AI检测到该目录下的 2 个文件被修改，可能需要重新提取 3 条关键知识并进行确认。</p>
                     </div>
                  )}
                </div>
             </div>
             <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-2">
                <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">查看原文件</button>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">检查更新</button>
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">重新读取</button>
                </div>
                {(selectedSource.status === "需要处理" || selectedSource.status === "内容有变化") && (
                   <button onClick={closeDrawers} className="py-2.5 bg-amber-500 text-white font-bold text-[13px] rounded-xl hover:bg-amber-600 transition-colors shadow-sm text-center">处理候选知识</button>
                )}
                <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center mt-2">从资料来源移除</button>
             </div>
          </motion.div>
        )}

        {/* Experience Drawer */}
        {selectedExp && (
          <motion.div initial={{x:400, opacity:0}} animate={{x:0, opacity:1}} exit={{x:400, opacity:0}} className="absolute top-0 right-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50">
             <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
               <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Brain size={18} className="text-neutral-500" /> 经验详情</h3>
               <button onClick={closeDrawers} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                   <h4 className="text-[16px] font-bold text-neutral-900 mb-4">{selectedExp.title}</h4>
                   <div className="text-[14px] text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                     {selectedExp.content}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100">
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">验证状态</h4>
                     <span className={"px-2 py-1 rounded text-[12px] font-bold border " + getStatusColor(selectedExp.valStatus)}>{selectedExp.valStatus}</span>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">调用状态</h4>
                     <span className={"px-2 py-1 rounded text-[12px] font-bold border " + getStatusColor(selectedExp.callStatus)}>{selectedExp.callStatus}</span>
                   </div>
                </div>
                <div className="space-y-4">
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">经验类型</h4>
                     <span className="text-[13px] font-medium text-neutral-800 bg-neutral-100 px-2 py-1 rounded">{selectedExp.type}</span>
                  </div>
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">适用范围</h4>
                     <div className="text-[13px] text-neutral-800 bg-neutral-50 p-2 rounded-lg border border-neutral-100">{selectedExp.scope}</div>
                  </div>
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">来源</h4>
                     <div className="text-[13px] text-neutral-800 flex items-center gap-1.5"><FolderOpen size={14} className="text-neutral-400"/> {selectedExp.source}</div>
                  </div>
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">创建时间</h4>
                     <div className="text-[13px] text-neutral-800">{selectedExp.date}</div>
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-2">
                <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">编辑</button>
                
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">设为可参考</button>
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">应用于当前商家</button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                   {selectedExp.valStatus === "待验证" ? (
                     <button onClick={closeDrawers} className="py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[13px] rounded-xl hover:bg-emerald-100 transition-colors shadow-sm text-center">标记为已验证</button>
                   ) : (
                     <button onClick={closeDrawers} className="py-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[13px] rounded-xl hover:bg-amber-100 transition-colors shadow-sm text-center">退回待验证</button>
                   )}
                   <button onClick={closeDrawers} className="py-2 bg-primary-50 border border-primary-200 text-primary-700 font-bold text-[13px] rounded-xl hover:bg-primary-100 transition-colors shadow-sm text-center">升级为方法或模板</button>
                </div>
                
                {selectedExp.type === "指定商家经验" && (
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-primary-600 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center mt-2 border-dashed">提交为商家待确认知识</button>
                )}
                
                <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center mt-2">归档</button>
             </div>
          </motion.div>
        )}

        {/* Method Drawer */}
        {selectedMethod && (
          <motion.div initial={{x:400, opacity:0}} animate={{x:0, opacity:1}} exit={{x:400, opacity:0}} className="absolute top-0 right-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50">
             <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
               <h3 className="font-bold text-neutral-900 flex items-center gap-2"><LayoutTemplate size={18} className="text-neutral-500" /> 方法详情</h3>
               <button onClick={closeDrawers} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                   <h4 className="text-[16px] font-bold text-neutral-900 mb-2">{selectedMethod.name}</h4>
                   <span className="text-[12px] font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded inline-block">{selectedMethod.type}</span>
                </div>
                
                <div>
                   <h4 className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">内容与步骤</h4>
                   <div className="space-y-3">
                     {selectedMethod.steps.map((s:any, idx:number) => (
                        <div key={idx} className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl">
                          <div className="text-[13px] font-bold text-neutral-900 mb-1">{s.title}</div>
                          <div className="text-[13px] text-neutral-700 leading-relaxed">{s.desc}</div>
                        </div>
                     ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100">
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">验证状态</h4>
                     <span className={"px-2 py-1 rounded text-[12px] font-bold border " + getStatusColor(selectedMethod.valStatus)}>{selectedMethod.valStatus}</span>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">当前调用状态</h4>
                     <span className={"px-2 py-1 rounded text-[12px] font-bold border " + getStatusColor(selectedMethod.callStatus)}>{selectedMethod.callStatus}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">适用范围</h4>
                     <div className="text-[13px] text-neutral-800 bg-neutral-50 p-2 rounded-lg border border-neutral-100">{selectedMethod.scope}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <h4 className="text-[11px] font-bold text-neutral-400 mb-1">适用条件</h4>
                       <div className="text-[13px] text-neutral-800">{selectedMethod.applicable}</div>
                     </div>
                     <div>
                       <h4 className="text-[11px] font-bold text-neutral-400 mb-1">不适用条件</h4>
                       <div className="text-[13px] text-red-600">{selectedMethod.inapplicable}</div>
                     </div>
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-2">
                <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">编辑</button>
                
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">应用于商家</button>
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">设为可参考</button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center">停止应用</button>
                   <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center">导出</button>
                </div>
                
                <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center mt-2">归档</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default KnowledgeMemory;
`
fs.writeFileSync('src/components/KnowledgeMemory.tsx', content, 'utf8');
console.log("Successfully wrote KnowledgeMemory.tsx");
