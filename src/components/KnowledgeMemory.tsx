import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, MessageCircle, ShieldCheck, Zap, Search, Upload, CheckCircle2, ChevronRight,
  Database, Users, Image as ImageIcon, Plus, FileText, Link as LinkIcon, MessageSquare,
  Clock, Settings, History, Info, Activity, AlertCircle, AlertTriangle, BookOpen, X,
  Check, Edit3, Trash2, GitMerge, Eye, FileCode2, PieChart, Sparkles, Folder, Download,
  Send, PenTool, LayoutTemplate, Network, Layout, ShieldAlert, FolderOpen, Maximize2, Minimize2, Save, FileWarning, CheckCircle, Ban, ChevronDown, MoreHorizontal, RefreshCw
} from "lucide-react";

export function KnowledgeMemory() {
  const [activeSpace, setActiveSpace] = useState<"merchant" | "personal">("merchant");
  const [merchantTab, setMerchantTab] = useState<"overview" | "critical" | "source">("overview");
  const [personalTab, setPersonalTab] = useState<"quick" | "experiences">("quick");

  // Merchant State
  const [criticalFilter, setCriticalFilter] = useState("需要处理");
  const [selectedCritical, setSelectedCritical] = useState<any>(null);
  const [isEditingCritical, setIsEditingCritical] = useState(false);
  const [editingCriticalText, setEditingCriticalText] = useState("");
  const [selectedSource, setSelectedSource] = useState<any>(null);
  
  // Personal State
  const [expFilter, setExpFilter] = useState("全部");
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [editingExpContent, setEditingExpContent] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [quickNoteStatus, setQuickNoteStatus] = useState<"idle" | "saving" | "saved_normal" | "saved_skill">("idle");
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [criticalSearch, setCriticalSearch] = useState("");
  
  const [activeSubAgentTask, setActiveSubAgentTask] = useState<string | null>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Mock Data
  const merchantBlocked = [
    { id: 1, scenario: "商家诊断", missing: "产品利润和价格依据", reason: "无法推算合理的ROI目标和预算分配比例。", action: "补充资料" },
    { id: 2, scenario: "私域承接", missing: "承接话术", reason: "AI无法自动生成符合品牌调性的客服回复策略。", action: "补充承接规则" },
    { id: 3, scenario: "账号内容生成", missing: "KOS店长号人设", reason: "缺少第一人称视角的表达规范和背景设定。", action: "确认账号人设" },
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
    { id: "s2", type: "folder", name: "历史客服聊天记录", path: "/Volumes/Data/MerchantData/CS_Logs", count: 128, time: "2小时前", status: "内容有变化", statusDetail: "3个文件发生变化" },
    { id: "s3", type: "file", name: "2026Q3产品价格表.xlsx", path: "/Volumes/Data/MerchantData/2026Q3产品价格表.xlsx", count: 1, time: "刚刚", status: "处理中" },
    { id: "s4", type: "file", name: "旧版包装规范.pdf", path: "/Volumes/Data/MerchantData/旧版包装规范.pdf", count: 1, time: "昨天", status: "需要处理", statusDetail: "3条知识待确认" },
    { id: "s5", type: "archive", name: "损坏的备份包", path: "/Volumes/Data/MerchantData/Backup", count: 0, time: "昨天", status: "无法读取" },
  ];

  const experiencesData = [
    { id: "e1", title: "发现宠物食品类目下，第一人称开箱视频点击率高 20%", expType: "运营结论", scope: "宠物食品 / 开箱视频", valStatus: "已验证", callStatus: "可参考", date: "今天 10:30", source: "我的观察", content: "通过对比3个宠物粮项目，第一人称视角的开箱不仅点击率高，且评论区关于产品颗粒大小的疑问明显减少。", sample: "3个项目", metric: "点击率", result: "平均提升20%", relatedSkill: null },
    { id: "e2", title: "尝试把所有干粮的包装都做成深色系", expType: "待验证假设", scope: "宠物食品", valStatus: "待验证", callStatus: "仅保存", date: "昨天 16:45", source: "灵感随笔", content: "看到竞品黑色包装质感很好，下次向客户提议。", sample: null, relatedSkill: null },
    { id: "e3", title: "遇到软便问题，统一回复'换粮过渡期常见现象，建议搭配益生菌'", expType: "客户原话", scope: "当前商家", valStatus: "已验证", callStatus: "限定范围参考", date: "3天前", source: "客户反馈总结", content: "由于产品高蛋白，极易引起肠胃敏感犬只软便，必须准备标准话术防御。", riskWarning: "存在功效表达风险，应用前需检查", sample: null, relatedSkill: null },
    { id: "m1", title: "宠物食品小红书起号打法 v2.0", expType: "方法", scope: "宠物食品 / 冷启动", valStatus: "已验证", callStatus: "可参考", date: "5天前", source: "经验沉淀", content: "一、人设搭建\n建议采用'前大厂营养师'或'资深繁育人'人设，强调专业与真实性。避开同质化的'铲屎官'人设。\n\n二、首月30篇SOP\n前10篇侧重干货与测评铺垫，中间10篇引入软植入，最后10篇配合活动强转化。", applicable: "宠物食品类目", inapplicable: "成熟期大品牌，预算充足直接投流", relatedSkill: "宠物食品起号Skill v1.0", steps: [{title: "一、人设搭建", desc: "建议采用'前大厂营养师'..."}] },
    { id: "m2", title: "高转化单品测评图文框架", expType: "模板", scope: "宠物食品 / 日常种草", valStatus: "有依据", callStatus: "可参考", date: "1周前", source: "爆款拆解", content: "封面：产品高清特写 + 核心痛点大字报\n正文第一段：抛出铲屎官常见痛点引发共鸣\n正文第二段：成分解析，数据支撑背书", applicable: "所有功能性宠物食品", inapplicable: "纯外观零食", relatedSkill: null }
  ];

  // Actions for Drawer
  const closeDrawers = () => {
    setSelectedCritical(null);
    setIsEditingCritical(false);
    setSelectedSource(null);
    setSelectedExp(null);
    setIsEditingExp(false);
  };

  // Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "可用": case "已采用": case "已验证": case "已启用": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "待确认": case "内容有变化": case "需要处理": case "待验证": return "text-amber-600 bg-amber-50 border-amber-200";
      case "有依据": return "text-blue-600 bg-blue-50 border-blue-200";
      case "有冲突": case "无法读取": return "text-red-600 bg-red-50 border-red-200";
      case "处理中": return "text-blue-600 bg-blue-50 border-blue-200";
      case "已失效": case "仅保存": return "text-neutral-500 bg-neutral-100 border-neutral-200";
      case "可参考": return "text-blue-600 bg-blue-50 border-blue-200";
      case "限定范围参考": return "text-purple-600 bg-purple-50 border-purple-200";
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
                      {["品牌号内容生成", "通用内容审核", "素材判断", "日常发文规划"].map(item => (
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
                            <button 
                              onClick={() => {
                                setActiveSubAgentTask(b.action || '去处理');
                              }}
                              className="px-3 py-1.5 bg-primary-50 text-primary-600 border border-primary-200 rounded-lg text-[12px] font-bold hover:bg-primary-100 transition-colors shadow-sm flex items-center gap-1.5"
                            >
                              <Sparkles size={14} /> {b.action || '去处理'}
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
                  <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
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
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input 
                        type="text" 
                        value={criticalSearch}
                        onChange={e => setCriticalSearch(e.target.value)}
                        placeholder="搜索知识或来源" 
                        className="pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-primary-500 w-48"
                      />
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
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-24">类型</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-24">包含内容</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-32">最近检查</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-48">状态</th>
                          <th className="px-6 py-3 text-[12px] font-bold text-neutral-500 w-32 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px]">
                        {sourcesData.map((s: any) => (
                          <tr key={s.id} onClick={() => setSelectedSource(s)} className="border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer group transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {s.type === 'folder' ? <Folder className="text-blue-500 shrink-0" size={18}/> : s.type === 'archive' ? <FolderOpen className="text-amber-500 shrink-0" size={18}/> : <FileText className="text-neutral-400 shrink-0" size={18}/>}
                                <div className="overflow-hidden">
                                  <div className="font-bold text-neutral-900 truncate">{s.name}</div>
                                  <div className="text-[11px] text-neutral-400 truncate max-w-[250px]" title={s.path}>{s.path}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-neutral-700 font-medium">
                              {s.type === 'folder' ? '本地文件夹' : s.type === 'archive' ? '压缩包' : '单个文件'}
                            </td>
                            <td className="px-6 py-4 text-neutral-500">
                              {s.status === '无法读取' ? '无法读取' : `${s.count}个文件`}
                            </td>
                            <td className="px-6 py-4 text-neutral-400">{s.time}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col items-start gap-1">
                                <span className={"px-2.5 py-1 rounded text-[12px] font-bold border " + getStatusColor(s.status)}>{s.status}</span>
                                {s.statusDetail && <span className="text-[11px] text-neutral-500">{s.statusDetail}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded bg-white border border-neutral-200" title="检查更新"><RefreshCw size={14}/></button>
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
                {["quick", "experiences"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {setPersonalTab(tab as any); closeDrawers();}}
                    className={"px-4 py-2 rounded-xl text-[14px] font-bold transition-colors " + (personalTab === tab ? "bg-white text-neutral-900 border border-neutral-200 shadow-sm" : "text-neutral-500 hover:bg-neutral-100")}
                  >
                    {tab === "quick" ? "快速记录" : "经验库"}
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
                  <div className="relative mb-3">
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
                      <div className="relative">
                        <button 
                          onClick={() => { 
                            setQuickNoteStatus("saving"); 
                            setTimeout(() => setQuickNoteStatus(quickNote.includes("SOP") || quickNote.includes("步骤") ? "saved_skill" : "saved_normal"), 1500); 
                          }} 
                          disabled={quickNoteStatus === "saving"}
                          className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold shadow-sm hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {quickNoteStatus === "saving" ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 处理中...</>
                          ) : (
                            <>保存并由AI整理 <Sparkles size={14} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {quickNoteStatus === "idle" && (
                     <div className="text-[12px] text-neutral-400">默认只保存在我的经验中，不会直接影响任何商家结果。</div>
                  )}
                  
                  {quickNoteStatus === "saved_normal" && (
                    <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-3 mt-4">
                       <div className="flex items-center gap-2 text-[13px] font-bold text-blue-800">
                         <CheckCircle2 size={16} className="text-blue-600" /> 已保存为待验证经验。
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => {setQuickNote(""); setQuickNoteStatus("idle");}} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-[12px] font-bold hover:bg-blue-50 transition-colors shadow-sm">设为可参考</button>
                         <button onClick={() => {setQuickNote(""); setQuickNoteStatus("idle");}} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-[12px] font-bold hover:bg-blue-50 transition-colors shadow-sm">在下次相关任务中验证</button>
                       </div>
                    </motion.div>
                  )}
                  
                  {quickNoteStatus === "saved_skill" && (
                    <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex flex-col gap-3 mt-4">
                       <div className="flex items-center gap-2 text-[13px] font-bold text-primary-800">
                         <CheckCircle2 size={16} className="text-primary-600" /> 已保存。这条经验包含稳定步骤，验证后可蒸馏为Skill。
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => {setQuickNote(""); setQuickNoteStatus("idle");}} className="px-3 py-1.5 bg-white border border-primary-200 text-primary-700 rounded-lg text-[12px] font-bold hover:bg-primary-50 transition-colors shadow-sm">设为可参考</button>
                         <button onClick={() => {setQuickNote(""); setQuickNoteStatus("idle");}} className="px-3 py-1.5 bg-white border border-primary-200 text-primary-700 rounded-lg text-[12px] font-bold hover:bg-primary-50 transition-colors shadow-sm">在下次相关任务中验证</button>
                       </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Experiences */}
              {personalTab === "experiences" && (
                <div className="space-y-6">
                  <div className="flex gap-2">
                     {["全部", "待验证", "可参考", "已蒸馏"].map(f => (
                       <button key={f} onClick={() => setExpFilter(f)} className={"px-4 py-2 rounded-full text-[13px] font-bold transition-colors border " + (expFilter === f ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50")}>
                         {f}
                       </button>
                     ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiencesData.filter(e => expFilter === "全部" || (expFilter === "已蒸馏" ? e.relatedSkill !== null : e.valStatus === expFilter || e.callStatus === expFilter)).map(exp => (
                      <div key={exp.id} onClick={() => setSelectedExp(exp)} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-primary-300 transition-all cursor-pointer flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-3">
                          <span className={"px-2 py-0.5 rounded text-[11px] font-bold border " + getStatusColor(exp.valStatus)}>{exp.valStatus}</span>
                          <span className={"px-2 py-0.5 rounded text-[11px] font-bold border " + getStatusColor(exp.callStatus)}>{exp.callStatus}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-neutral-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">{exp.title}</h3>
                        {exp.relatedSkill && (
                          <div className="mb-2 text-[12px] text-primary-600 bg-primary-50 px-2 py-1 rounded inline-block font-medium">
                            已蒸馏为：{exp.relatedSkill}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                          <span className="text-[11px] text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100">{exp.expType}</span>
                          <span className="text-[11px] text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 truncate max-w-[150px]">{exp.scope}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  {isEditingCritical ? (
                    <textarea 
                      value={editingCriticalText}
                      onChange={e => setEditingCriticalText(e.target.value)}
                      className="w-full text-[14px] font-medium text-neutral-900 leading-relaxed bg-white p-4 rounded-xl border border-primary-500 focus:outline-none min-h-[120px]"
                    />
                  ) : (
                    <div className="text-[14px] font-medium text-neutral-900 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      {selectedCritical.summary}
                    </div>
                  )}
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
                {isEditingCritical ? (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingCritical(false)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">取消</button>
                    <button onClick={() => {
                       // Save action here
                       closeDrawers();
                    }} className="flex-1 py-2.5 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors shadow-sm text-center flex items-center justify-center gap-1"><Check size={16}/> 保存并采用</button>
                  </div>
                ) : (
                  <>
                    {selectedCritical.status === '待确认' && (
                      <>
                        <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">采用</button>
                        <button onClick={() => {
                          setEditingCriticalText(selectedCritical.summary);
                          setIsEditingCritical(true);
                        }} className="py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">修改后采用</button>
                        <button onClick={closeDrawers} className="py-2 bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm text-center">忽略</button>
                      </>
                    )}
                    {selectedCritical.status === '已采用' && (
                      <>
                        <button onClick={() => {
                          setEditingCriticalText(selectedCritical.summary);
                          setIsEditingCritical(true);
                        }} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">修改</button>
                        <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-red-50 transition-colors shadow-sm text-center">标记失效</button>
                      </>
                    )}
                    {selectedCritical.status === '有冲突' && (
                      <button onClick={closeDrawers} className="py-2.5 bg-amber-500 text-white font-bold text-[13px] rounded-xl hover:bg-amber-600 transition-colors shadow-sm text-center">查看冲突来源</button>
                    )}
                  </>
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
                  <h4 className="text-[13px] font-bold text-neutral-900 flex items-center gap-2"><Brain size={14} className="text-primary-500"/> 关联关键知识</h4>
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
                {(selectedSource.status === "需要处理" || selectedSource.status === "内容有变化") && (
                   <button onClick={closeDrawers} className="py-2.5 bg-amber-500 text-white font-bold text-[13px] rounded-xl hover:bg-amber-600 transition-colors shadow-sm text-center">处理4项知识问题</button>
                )}
                <div className="grid grid-cols-3 gap-2">
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">查看原文件</button>
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">检查更新</button>
                   <button onClick={closeDrawers} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">重新读取</button>
                </div>
                <div className="text-center mt-2">
                   <button onClick={closeDrawers} className="text-red-600 font-bold text-[12px] hover:underline">从资料来源移除</button>
                </div>
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
                   {isEditingExp ? (
                     <textarea 
                       value={editingExpContent}
                       onChange={e => setEditingExpContent(e.target.value)}
                       className="w-full text-[14px] text-neutral-900 leading-relaxed bg-white p-4 rounded-xl border border-primary-500 focus:outline-none min-h-[160px]"
                     />
                   ) : (
                     <div className="text-[14px] text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 whitespace-pre-line">
                       {selectedExp.content}
                     </div>
                   )}
                </div>
                
                {selectedExp.steps && (
                  <div>
                     <h4 className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">内容与步骤</h4>
                     <div className="space-y-3">
                       {selectedExp.steps.map((s:any, idx:number) => (
                          <div key={idx} className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl">
                            <div className="text-[13px] font-bold text-neutral-900 mb-1">{s.title}</div>
                            <div className="text-[13px] text-neutral-700 leading-relaxed">{s.desc}</div>
                          </div>
                       ))}
                     </div>
                  </div>
                )}
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
                  {selectedExp.valStatus === "已验证" && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-3">
                      <h4 className="text-[13px] font-bold text-emerald-800 flex items-center gap-1.5"><CheckCircle2 size={14}/> 验证依据</h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div><span className="text-[11px] text-emerald-600/70 block">样本</span><span className="text-[12px] font-medium text-emerald-900">{selectedExp.sample || "-"}</span></div>
                         <div><span className="text-[11px] text-emerald-600/70 block">指标</span><span className="text-[12px] font-medium text-emerald-900">{selectedExp.metric || "-"}</span></div>
                      </div>
                      <div>
                         <span className="text-[11px] text-emerald-600/70 block">观察结果</span>
                         <span className="text-[12px] font-medium text-emerald-900">{selectedExp.result || "-"}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700/80 mt-2 bg-emerald-100/50 p-2 rounded">该结论仅在当前样本范围内成立。</div>
                    </div>
                  )}
                  {selectedExp.riskWarning && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2">
                       <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                       <div className="text-[12px] font-medium text-amber-800">{selectedExp.riskWarning}</div>
                    </div>
                  )}
                  <div>
                     <h4 className="text-[11px] font-bold text-neutral-400 mb-1">经验类型</h4>
                     <span className="text-[13px] font-medium text-neutral-800 bg-neutral-100 px-2 py-1 rounded">{selectedExp.expType}</span>
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
                {isEditingExp ? (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingExp(false)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">取消</button>
                    <button onClick={() => {
                       // Save action here
                       closeDrawers();
                    }} className="flex-1 py-2.5 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors shadow-sm text-center flex items-center justify-center gap-1"><Check size={16}/> 保存修改</button>
                  </div>
                ) : (
                  <>
                    {(selectedExp.expType === "方法" || selectedExp.expType === "模板" || selectedExp.expType === "SOP") ? (
                      <button onClick={() => { closeDrawers(); window.dispatchEvent(new CustomEvent("nav-to-skill-create")); }} className="py-2.5 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors shadow-sm text-center flex items-center justify-center gap-2">
                        <Sparkles size={16} /> 蒸馏为 Skill
                      </button>
                    ) : selectedExp.expType === "客户原话" || selectedExp.expType === "运营结论" ? (
                      <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">提交为商家待确认知识</button>
                    ) : (
                      <button onClick={closeDrawers} className="py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm text-center">本次作为参考</button>
                    )}
                    
                    <div className="flex gap-2">
                       <button onClick={() => {
                         setEditingExpContent(selectedExp.content);
                         setIsEditingExp(true);
                       }} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">编辑</button>
                       <button onClick={closeDrawers} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">设为可参考</button>
                       <button onClick={closeDrawers} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center">限定参考范围</button>
                       
                       <div className="relative">
                         <button onClick={(e) => {
                           const menu = e.currentTarget.nextElementSibling;
                           if (menu) menu.classList.toggle('hidden');
                         }} className="px-3 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm text-center flex items-center justify-center">
                           <MoreHorizontal size={16} />
                         </button>
                         <div className="hidden absolute bottom-full right-0 mb-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 flex flex-col z-10">
                           <button onClick={closeDrawers} className="text-left px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg">归档</button>
                         </div>
                       </div>
                    </div>
                  </>
                )}
             </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* SubAgent Drawer */}
      <AnimatePresence>
        {activeSubAgentTask && (
          <motion.div initial={{x:400, opacity:0}} animate={{x:0, opacity:1}} exit={{x:400, opacity:0}} className="absolute top-0 right-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50">
             <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Sparkles size={16} />
                 </div>
                 <div>
                   <h3 className="text-[14px] font-bold text-neutral-900">AI Agent 协同</h3>
                   <div className="text-[11px] text-neutral-500">正在协助处理: {activeSubAgentTask}</div>
                 </div>
               </div>
               <button onClick={() => setActiveSubAgentTask(null)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"><X size={18} /></button>
             </div>
             
             <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-neutral-50/30">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                    <Brain size={16} className="text-primary-600" />
                  </div>
                  <div className="bg-white border border-neutral-100 p-4 rounded-2xl rounded-tl-sm shadow-sm text-[13px] text-neutral-800 leading-relaxed max-w-[85%]">
                     <p className="mb-2">你好，为了完成<span className="font-bold text-primary-600">「{activeSubAgentTask}」</span>，我们需要生成一份本地规范文件作为持久化知识源。</p>
                     <p className="mb-2">在生成文件之前，我需要向你确认几个关键信息：</p>
                     <ul className="list-disc pl-5 space-y-1 text-neutral-600 mb-3">
                       <li>目标客户群体的核心诉求是什么？</li>
                       <li>是否有特定的语气或风格要求（例如：专业、活泼、亲切）？</li>
                       <li>可以提供一个历史的优秀案例或片段作为参考吗？</li>
                     </ul>
                     <p>请在下方输入你的想法，或者直接点击“由AI自动推导并生成”让我帮你起草一份初稿。</p>
                  </div>
                </div>
                
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    <Users size={16} className="text-neutral-500" />
                  </div>
                  <div className="bg-primary-500 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm text-[13px] leading-relaxed max-w-[85%]">
                     专业、活泼，参考我上个月发给运营团队的那份文档。
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                    <Brain size={16} className="text-primary-600" />
                  </div>
                  <div className="bg-white border border-neutral-100 p-4 rounded-2xl rounded-tl-sm shadow-sm text-[13px] text-neutral-800 leading-relaxed max-w-[85%] w-full">
                     <p className="mb-3">好的，我已根据你的要求起草了规范文件，并准备将其保存到项目本地：</p>
                     <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-3 flex items-start gap-3">
                        <FileCode2 size={24} className="text-blue-500 shrink-0 mt-1" />
                        <div>
                          <div className="font-bold text-neutral-900 mb-1">brand_persona_guidelines.md</div>
                          <div className="text-[12px] text-neutral-500 mb-2">/knowledge/merchant_001/brand_persona_guidelines.md</div>
                          <div className="text-[12px] text-neutral-700 bg-white p-2 rounded border border-neutral-100 font-mono">
                            # 账号人设与内容生成规范<br/>
                            ## 1. 核心定位<br/>
                            ... (已根据“专业、活泼”要求生成内容)
                          </div>
                        </div>
                     </div>
                     <p className="text-[12px] text-amber-600 font-medium flex items-center gap-1"><AlertCircle size={12} /> 确认生成后，该文件将作为持久化知识源，并自动更新商家的可用状态。</p>
                  </div>
                </div>
             </div>

             <div className="p-4 border-t border-neutral-200 bg-white">
                <div className="relative mb-3">
                  <textarea 
                    placeholder="输入指令 (如: '/save 保存并生成本地文件')..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-primary-500 resize-none h-[80px]"
                  />
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <Send size={14} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveSubAgentTask(null)} className="flex-1 py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors text-center flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> 确认生成本地文件
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default KnowledgeMemory;
