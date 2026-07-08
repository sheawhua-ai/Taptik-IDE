import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, MessageCircle, ShieldCheck, Zap, Search, Upload, CheckCircle2, ChevronRight,
  Database, Users, Image as ImageIcon, Plus, FileText, Link as LinkIcon, MessageSquare,
  Clock, Settings, History, Info, Activity, AlertCircle, AlertTriangle, BookOpen, X,
  Check, Edit3, Trash2, GitMerge, Eye, FileCode2, PieChart, Sparkles, Folder, Download,
  Send, PenTool, LayoutTemplate, Network, Layout, ShieldAlert
} from "lucide-react";

type SpaceType = "merchant" | "strategy";
type TabType = "overview" | "memory" | "source";
type MemoryStatus = "已确认" | "待确认" | "有冲突" | "已过期" | "缺失";
type MemoryCredibility = "高" | "中" | "低";

interface Memory {
  id: string;
  content: string;
  category: string;
  subCategory: string;
  applicableScope: string[];
  usableFor: string[];
  source: string;
  status: MemoryStatus;
  credibility: MemoryCredibility;
  lastUpdated: string;
  isCustom?: boolean;
  constraintStrength?: "强约束" | "已启用" | "可参考" | "不调用";
}

const SPACES = [
  { id: 'merchant', label: '商家记忆' },
  { id: 'strategy', label: '我的记忆' }
];

const CATEGORIES = [
  { id: "brand", label: "品牌与产品", icon: BookOpen, desc: "品牌定位、产品池、价格体系、核心卖点" },
  { id: "account", label: "账号矩阵", icon: Layout, desc: "账号定位、KOS 人设、引流路径" },
  { id: "customer", label: "客户与痛点", icon: Users, desc: "目标客户画像、需求痛点、购买顾虑、真实反馈" },
  { id: "content", label: "内容与图文", icon: FileText, desc: "标题规则、沟通风格、图文/视频规范、首图要求" },
  { id: "rules", label: "禁区与流转", icon: ShieldAlert, desc: "禁用表达、价格红线、品牌禁区、流转规则" },
  { id: "reply", label: "话术与承接", icon: MessageSquare, desc: "常见问题(FAQ)、私域承接、评论回复、高意向特征" },
  { id: "material", label: "素材偏好", icon: ImageIcon, desc: "高点击封面、可用素材类型、禁用素材、拍摄要求" },
  { id: "review", label: "打法复盘", icon: Activity, desc: "有效选题、失败案例、转化经验、运营动作" },
];

const CUSTOM_COLLECTIONS = [
  { id: 'c_competitor', label: '竞品分析', icon: Search },
  { id: 'c_ideas', label: '个人创意', icon: Zap },
  { id: 'c_teardown', label: '爆文拆解', icon: FileCode2 },
  { id: 'c_quotes', label: '客户原话', icon: MessageCircle },
];

const MOCK_MEMORIES: Memory[] = [
  {
    id: "m1",
    content: "不能承诺治疗软便，只能表达“帮助肠胃适应”或“换粮过渡建议”。",
    category: "content",
    subCategory: "禁用表达",
    applicableScope: ["当前商家", "宠物食品品类", "私信回复", "笔记正文"],
    usableFor: ["内容生成", "发布审核", "评论回复"],
    source: "2026-07-03 私信记录",
    status: "已确认",
    credibility: "高",
    lastUpdated: "2026-07-08",
    constraintStrength: "强约束",
  },
  {
    id: "m2",
    content: "新手养狗客户最担心软便和不吃粮。",
    category: "customer",
    subCategory: "常见问题",
    applicableScope: ["当前商家", "内容策划"],
    usableFor: ["操盘建议", "内容生成"],
    source: "最近 28 条评论和 6 条私信",
    status: "待确认",
    credibility: "中",
    lastUpdated: "2026-07-08",
    constraintStrength: "可参考",
  },
  {
    id: "m3",
    content: "618 期间购买送冻干试吃装。",
    category: "merchant",
    subCategory: "价格与促销",
    applicableScope: ["当前商家", "私信回复", "评论回复"],
    usableFor: ["评论回复", "私信回复"],
    source: "2026-06 运营计划",
    status: "已过期",
    credibility: "高",
    lastUpdated: "2026-06-20",
    constraintStrength: "不调用",
  },
  {
    id: "m4",
    content: "KOS 店长号人设：3年宠物营养师，家里养了2只金毛，说话直率专业。",
    category: "merchant",
    subCategory: "账号人设",
    applicableScope: ["当前商家", "KOS 店长号"],
    usableFor: ["内容生成", "发布审核"],
    source: "操盘手初始化访谈",
    status: "缺失",
    credibility: "低",
    lastUpdated: "2026-07-01",
  },
  {
    id: "m5",
    content: "竞品A最近主打“低敏低敏”，评论区反馈普遍不错，值得跟进验证。",
    category: "c_competitor",
    subCategory: "营销观察",
    applicableScope: ["跨商家适用"],
    usableFor: ["内容策划参考"],
    source: "2026-07-07 操盘手记录",
    status: "已确认",
    credibility: "高",
    lastUpdated: "2026-07-07",
    isCustom: true
  }
];

function StrategyView() {
  const [inputText, setInputText] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("全部");
  const [selectedMemory, setSelectedMemory] = React.useState<any>(null);
  const [actionConfirm, setActionConfirm] = React.useState<{type: string, title: string, desc: string, confirmText: string} | null>(null);
  const [activeStrategyTab, setActiveStrategyTab] = React.useState<"memories" | "strategies">("memories");
  const [isEditingDetail, setIsEditingDetail] = React.useState(false);
  const [isStrategyFormOpen, setIsStrategyFormOpen] = React.useState(false);

  const filters = ["全部", "随笔", "创意", "客户原话", "竞品分析", "素材判断", "话术模板", "打法", "待验证"];

  const myMemories = [
    { 
      id: "sm1",
      content: "发现宠物食品类目下，第一人称开箱视频点击率高 20%", 
      tags: ["素材判断", "跨商家"],
      callStatus: "可参考", 
      scope: "宠物食品 / 开箱视频",
      usableFor: "操盘建议、内容分配",
      usage: "已在 5 个项目中使用", 
      result: "点击率提升 15%",
      date: "今天 10:30",
      source: "我的观察"
    },
    { 
      id: "sm2",
      content: "下次尝试把所有干粮的包装都做成深色系，看起来更高端一点，待验证。", 
      tags: ["创意", "包装设计"],
      callStatus: "不调用", 
      scope: "全部商家",
      usableFor: "无",
      usage: "暂未使用",
      result: "待观察",
      date: "昨天 16:45",
      source: "我的随笔"
    }
  ];

  const myStrategies = [
    { 
      id: "st1",
      name: "宠物食品小红书起号打法 v2.0", 
      tags: ["操盘打法", "冷启动"], 
      callStatus: "已启用", 
      scope: "宠物食品 / 冷启动 / 搜索卡位",
      usableFor: "操盘建议、账号组合、内容分配、素材任务",
      source: "导入文件 (起号SOP.docx)", 
      attachments: [{ name: "宠物食品起号SOP_v2.docx", type: "word", size: "2.4 MB" }],
      structuredContent: [
         { title: "一、人设搭建", desc: "建议采用'前大厂营养师'或'资深繁育人'人设，强调专业与真实性。避开同质化的'铲屎官'人设。" },
         { title: "二、首月30篇SOP", desc: "前10篇侧重干货与测评铺垫，中间10篇引入软植入，最后10篇配合活动强转化。" },
         { title: "三、客服承接话术", desc: "遇到软便问题，统一回复'换粮过渡期常见现象，建议搭配益生菌'，严禁承诺治疗效果。" }
      ],
      usage: "5 个项目",
      result: "平均内容通过率 82%",
      date: "更新于 2周前" 
    },
    { 
      id: "st2",
      name: "高转化单品测评图文框架", 
      tags: ["写法模板", "日常种草"], 
      callStatus: "已启用", 
      scope: "宠物食品 / 日常种草",
      usableFor: "内容生成、素材生成",
      source: "我的验证沉淀", 
      usage: "12 个项目",
      result: "点击率提升 20%",
      date: "更新于 1个月前" 
    }
  ];

  const handleActionClick = (type: string) => {
    switch(type) {
      case 'edit':
        setActionConfirm({
          type,
          title: "编辑",
          desc: "在此处您可以直接修改记忆的文本内容、调整标签分类，或重新定义打法的结构化规则。",
          confirmText: "确认编辑"
        });
        break;
      case 'export':
        setActionConfirm({
          type,
          title: "导出",
          desc: "将当前的打法或模板导出为 JSON/Markdown 格式文件，方便在其他项目中使用或备份到本地。",
          confirmText: "确认导出"
        });
        break;
      case 'reference':
        setActionConfirm({
          type,
          title: "设为可参考",
          desc: "设置后，AI 在进行相关商家的内容生成或提供操盘建议时，会将其作为辅助参考，但不会作为强规则强制执行。常用于经验、灵感和非决定性的洞察。",
          confirmText: "确认设为参考"
        });
        break;
      case 'strategy':
        setIsStrategyFormOpen(true);
        break;
      case 'merchant':
        setActionConfirm({
          type,
          title: "转为商家待确认记忆",
          desc: "这将把该记忆复制到当前选中商家的专属记忆库中，并标记为“待确认”状态，作为该商家的特定规则。原个人记忆将不受影响。",
          confirmText: "确认转移"
        });
        break;
      case 'disable':
        setActionConfirm({
          type,
          title: "停用",
          desc: "停用后，此记忆将不再参与任何 AI 生成和分析，退回“不调用”状态，但仍保留在您的个人记忆列表中。",
          confirmText: "确认停用"
        });
        break;
      case 'delete':
        setActionConfirm({
          type,
          title: "归档记忆",
          desc: "此操作将归档该记忆，避免影响审计链。已调用的记录不会被硬删除，仍可追溯。",
          confirmText: "确认归档"
        });
        break;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === '已启用' || status === '已启用') return 'text-emerald-600';
    if (status === '强约束') return 'text-amber-600';
    if (status === '可参考') return 'text-blue-600';
    if (status === '不调用') return 'text-neutral-500';
    return 'text-neutral-500';
  };

  const getStatusBg = (status: string) => {
    if (status === '已启用' || status === '已启用') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (status === '强约束') return 'bg-amber-50 border-amber-100 text-amber-700';
    if (status === '可参考') return 'bg-blue-50 border-blue-100 text-blue-700';
    if (status === '不调用') return 'bg-neutral-100 border-neutral-200 text-neutral-600';
    return 'bg-neutral-100 border-neutral-200 text-neutral-600';
  };

  return (
    <div className="flex-1 flex min-h-0 bg-[#fafafa] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* 顶部输入 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <PenTool size={18} className="text-primary-500" />
              随手记一条
            </h2>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="记录一个选题想法、客户原话、素材判断、竞品动作、常用话术或自己的运营习惯..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 pb-12 text-[14px] text-neutral-900 focus:outline-none focus:border-primary-500 min-h-[120px] resize-none custom-scrollbar"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 transition-colors text-[13px] font-medium">
                    <LinkIcon size={14} /> 解析链接
                  </button>
                  <button className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 transition-colors text-[13px] font-medium">
                    <Upload size={14} /> 导入文件
                  </button>
                </div>
                {!inputText && (
                  <div className="flex items-center gap-1.5 text-[12px] text-neutral-400 font-medium">
                    <ShieldCheck size={14} /> 默认只保存到我的记忆，不会影响商家生成结果。
                  </div>
                )}
              </div>
            </div>
            <AnimatePresence>
              {inputText && (
                <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="mt-4 flex items-start justify-between overflow-hidden">
                  <div className="flex gap-3">
                    <span className="text-[12px] font-bold text-neutral-400 mt-1.5 whitespace-nowrap flex items-center gap-1">AI 动态打标 <div className="text-neutral-300 cursor-help" title="AI 基于语义动态生成的标签，可交叉组合"><Info size={12}/></div>:</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[12px] font-medium border border-neutral-200">随笔</span>
                      <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[12px] font-medium border border-neutral-200">待完善</span>
                      <button className="px-2.5 py-1 bg-white text-neutral-400 hover:text-neutral-600 rounded-md text-[12px] font-medium border border-dashed border-neutral-300 hover:border-neutral-400 flex items-center gap-1">
                        <Plus size={12}/> 添加标签
                      </button>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold shadow-md hover:bg-neutral-800 transition-colors" onClick={() => setInputText("")}>
                    保存记忆
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-neutral-200">
             <button 
               onClick={() => setActiveStrategyTab("memories")}
               className={"pb-3 text-[15px] font-bold transition-colors relative " + (activeStrategyTab === "memories" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
             >
                <div className="flex items-center gap-2">
                   <Database size={18} />
                   我的记忆
                   <span className="ml-1 bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[11px]">{myMemories.length}</span>
                </div>
                {activeStrategyTab === "memories" && (
                   <motion.div layoutId="strategyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
             </button>
             <button 
               onClick={() => setActiveStrategyTab("strategies")}
               className={"pb-3 text-[15px] font-bold transition-colors relative " + (activeStrategyTab === "strategies" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
             >
                <div className="flex items-center gap-2">
                   <LayoutTemplate size={18} />
                   已启用的打法与模板
                   <span className="ml-1 bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[11px]">{myStrategies.length}</span>
                </div>
                {activeStrategyTab === "strategies" && (
                   <motion.div layoutId="strategyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
             </button>
          </div>

          {activeStrategyTab === "memories" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {filters.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={"px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border " + (activeFilter === f ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50')}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {myMemories.map((note) => (
                  <div key={note.id} onClick={() => {setSelectedMemory(note); setActionConfirm(null); setIsEditingDetail(false);}} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-primary-300 transition-colors group cursor-pointer flex flex-col h-full">
                    <p className="text-[14px] text-neutral-900 font-bold mb-4 leading-relaxed line-clamp-3">{note.content}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {note.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded text-[11px] text-neutral-600">{tag}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-neutral-100 text-[12px]">
                       <div className="col-span-2">
                         <span className="text-neutral-400">调用策略: </span>
                         <span className={"font-bold " + getStatusColor(note.callStatus)}>{note.callStatus}</span>
                       </div>
                       <div className="col-span-2"><span className="text-neutral-400">适用: </span><span className="text-neutral-700">{note.scope}</span></div>
                       <div className="col-span-2"><span className="text-neutral-400">用于: </span><span className="text-neutral-700 truncate block">{note.usableFor}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeStrategyTab === "strategies" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myStrategies.map((pack) => (
                    <div key={pack.id} onClick={() => {setSelectedMemory(pack); setActionConfirm(null); setIsEditingDetail(false);}} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-primary-300 transition-colors group cursor-pointer relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-4">
                          <span className={"px-2.5 py-1 rounded-md text-[11px] font-bold border " + getStatusBg(pack.callStatus)}>
                            {pack.callStatus}
                          </span>
                      </div>
                      <div className="flex items-center gap-3 mb-4 pr-16">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-600 border border-neutral-100 shrink-0">
                          {pack.tags.includes('操盘打法') ? <Network size={20}/> : <LayoutTemplate size={20}/>}
                        </div>
                        <div>
                          <h3 className="font-bold text-[15px] text-neutral-900 group-hover:text-primary-700 transition-colors leading-snug">{pack.name}</h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {pack.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded text-[11px] text-neutral-600">{tag}</span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-3 mb-4 text-[12px] mt-auto">
                         <div className="col-span-2"><span className="text-neutral-400">适用: </span><span className="text-neutral-700">{pack.scope}</span></div>
                         <div className="col-span-2"><span className="text-neutral-400">来源: </span><span className="text-neutral-700">{pack.source}</span></div>
                         <div className="col-span-2"><span className="text-neutral-400">使用效果: </span><span className="text-emerald-600 font-bold">{pack.result}</span></div>
                      </div>

                      <div className="space-y-2 mb-4 pt-3 border-t border-neutral-100">
                        <div className="flex items-start gap-2 text-[12px]">
                          <span className="text-neutral-400 shrink-0 mt-0.5">会影响:</span>
                          <span className="text-primary-700 font-medium bg-primary-50 px-1.5 py-0.5 rounded leading-relaxed line-clamp-2">{pack.usableFor}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-auto pt-4 border-t border-neutral-100" onClick={(e) => e.stopPropagation()}>
                         
                         <button onClick={() => {setSelectedMemory(pack); handleActionClick('disable');}} className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">停用</button>
                         <button onClick={() => {setSelectedMemory(pack); handleActionClick('export');}} className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">导出</button>
                      </div>
                    </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 记忆详情抽屉 */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-50"
          >
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                <Database size={18} className="text-neutral-500" />
                记忆详情
              </h3>
              <button onClick={() => {setSelectedMemory(null); setIsEditingDetail(false);}} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
               <AnimatePresence mode="wait">
                 {actionConfirm ? (
                   <motion.div 
                     key="confirm"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center h-full"
                   >
                     <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
                       <Info size={24} />
                     </div>
                     <h4 className="text-[16px] font-bold text-neutral-900 mb-3">{actionConfirm.title}</h4>
                     <p className="text-[14px] text-neutral-600 leading-relaxed mb-8">{actionConfirm.desc}</p>
                     
                     <div className="flex flex-col gap-3 w-full max-w-[240px]">
                       <button 
                         className={"py-2.5 rounded-xl text-[14px] font-bold transition-colors shadow-sm " + 
                           (actionConfirm.type === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-neutral-900 text-white hover:bg-neutral-800')
                         }
                         onClick={() => setActionConfirm(null)}
                       >
                         {actionConfirm.confirmText}
                       </button>
                       <button 
                         className="py-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors"
                         onClick={() => setActionConfirm(null)}
                       >
                         取消
                       </button>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="content"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="space-y-6"
                   >
                     <div>
                        <h4 className="text-[12px] font-bold text-neutral-400 mb-2 uppercase tracking-wider">内容与结构</h4>
                        
                        {selectedMemory.attachments && selectedMemory.attachments.length > 0 && (
                          <div className="mb-4 space-y-2">
                             {selectedMemory.attachments.map((file: any, idx: number) => (
                               <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FileText size={20} />
                                     </div>
                                     <div>
                                        <div className="text-[13px] font-bold text-neutral-900">{file.name}</div>
                                        <div className="text-[11px] text-neutral-400">{file.size}</div>
                                     </div>
                                  </div>
                                  
                               </div>
                             ))}
                          </div>
                        )}

                        {selectedMemory.structuredContent ? (
                           <div className="space-y-3">
                             {selectedMemory.structuredContent.map((section: any, idx: number) => (
                               <div key={idx} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 relative group">
                                  {isEditingDetail ? (
                                    <>
                                      <input className="w-full bg-white border border-neutral-200 focus:border-primary-500 focus:outline-none rounded p-1.5 mb-2 text-[13px] font-bold text-neutral-900" value={section.title} onChange={e => { const nc = [...selectedMemory.structuredContent]; nc[idx] = {...nc[idx], title: e.target.value}; setSelectedMemory({...selectedMemory, structuredContent: nc}); }} />
                                      <textarea className="w-full bg-white border border-neutral-200 focus:border-primary-500 focus:outline-none rounded p-1.5 text-[13px] text-neutral-700 resize-none min-h-[60px]" value={section.desc} onChange={e => { const nc = [...selectedMemory.structuredContent]; nc[idx] = {...nc[idx], desc: e.target.value}; setSelectedMemory({...selectedMemory, structuredContent: nc}); }} />
                                      <button onClick={() => { const nc = selectedMemory.structuredContent.filter((_, i) => i !== idx); setSelectedMemory({...selectedMemory, structuredContent: nc}); }} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-[13px] font-bold text-neutral-900 mb-1">{section.title}</div>
                                      <div className="text-[13px] text-neutral-700 leading-relaxed">{section.desc}</div>
                                    </>
                                  )}
                               </div>
                             ))}
                             {isEditingDetail && (
                               <button onClick={() => setSelectedMemory({...selectedMemory, structuredContent: [...selectedMemory.structuredContent, {title: "新条目", desc: "点击编辑内容"}]})} className="w-full py-2 bg-white border border-dashed border-neutral-300 rounded-xl text-neutral-500 font-bold text-[12px] hover:text-neutral-700 hover:border-neutral-400 flex items-center justify-center gap-1">
                                 <Plus size={14} /> 添加条目
                               </button>
                             )}
                           </div>
                        ) : (
                          <div className="text-[14px] text-neutral-900 font-medium leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                            {isEditingDetail ? (
                               <textarea className="w-full bg-white border border-neutral-200 focus:border-primary-500 focus:outline-none rounded p-3 min-h-[100px] resize-none" value={selectedMemory.content || selectedMemory.name} onChange={e => setSelectedMemory({...selectedMemory, [selectedMemory.content ? 'content' : 'name']: e.target.value})} />
                            ) : (
                               selectedMemory.content || selectedMemory.name
                            )}
                          </div>
                        )}
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <h4 className="text-[11px] font-bold text-neutral-400 mb-2">动态标签</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedMemory.tags?.map((tag: string) => (
                              <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[12px]">{tag}</span>
                            ))}
                            <button className="px-2 py-0.5 bg-white text-neutral-400 hover:text-neutral-600 rounded border border-dashed border-neutral-300 hover:border-neutral-400 text-[12px] flex items-center gap-1">
                              <Plus size={10}/> 添加
                            </button>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-neutral-400 mb-1">调用策略</h4>
                          <div className="flex items-center gap-1.5">
                            <span className={"text-[13px] font-bold " + getStatusColor(selectedMemory.callStatus)}>
                              {selectedMemory.callStatus}
                            </span>
                            <div className="text-neutral-400 cursor-help" title={
                              selectedMemory.callStatus === '已启用' ? "作为强规则执行" : 
                              selectedMemory.callStatus === '可参考' ? "作为AI弱参考" : "不调用不调用"
                            }>
                              <Info size={14}/>
                            </div>
                          </div>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-neutral-100">
                        <div>
                          <h4 className="text-[11px] font-bold text-neutral-400 mb-1">适用范围</h4>
                          <div className="text-[13px] text-neutral-900">{selectedMemory.scope}</div>
                        </div>
                        {selectedMemory.usableFor && (
                          <div>
                            <h4 className="text-[11px] font-bold text-neutral-400 mb-1">可用于</h4>
                            <div className="text-[13px] text-neutral-900">{selectedMemory.usableFor}</div>
                          </div>
                        )}
                        <div>
                          <h4 className="text-[11px] font-bold text-neutral-400 mb-1">来源</h4>
                          <div className="text-[13px] text-neutral-900 flex items-center gap-1.5"><Users size={14} className="text-neutral-400" />{selectedMemory.source}</div>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-neutral-100">
                        <div>
                          <h4 className="text-[11px] font-bold text-neutral-400 mb-1">被引用记录</h4>
                          <div className="text-[13px] text-neutral-900">{selectedMemory.usage}</div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-neutral-400 mb-1">最近效果</h4>
                          <div className={"text-[13px] font-bold " + (selectedMemory.result.includes('提升') ? 'text-emerald-600' : 'text-neutral-700')}>{selectedMemory.result}</div>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50 grid grid-cols-2 gap-2 relative z-20">
              {isEditingDetail ? (
                 <button onClick={() => setIsEditingDetail(false)} className="col-span-2 py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Check size={16} /> 保存修改
                 </button>
              ) : (
                 <>
                    <button onClick={() => setIsEditingDetail(true)} className="col-span-2 py-2.5 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm">
                       编辑
                    </button>
                    <button onClick={() => handleActionClick('reference')} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                       设为可参考
                    </button>
                    <button onClick={() => handleActionClick('strategy')} className="py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                       启用为打法
                    </button>
                    <button onClick={() => handleActionClick('merchant')} className="col-span-2 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                       转为商家待确认记忆
                    </button>
                    <button onClick={() => handleActionClick('disable')} className="py-2 bg-white border border-neutral-200 text-neutral-500 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                       停用
                    </button>
                    <button onClick={() => handleActionClick('delete')} className="py-2 bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-colors shadow-sm">
                       归档
                    </button>
                 </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategy Form Modal */}
      <AnimatePresence>
        {isStrategyFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStrategyFormOpen(false)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-neutral-200"
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-neutral-900">配置打法调用规则</h3>
                <button onClick={() => setIsStrategyFormOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">适用品类 (多个以逗号分隔)</label>
                  <input type="text" defaultValue="宠物食品" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">适用阶段</label>
                  <input type="text" defaultValue="冷启动" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">适用业务动作</label>
                  <input type="text" defaultValue="操盘建议、账号组合、内容分配" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">输入条件 (满足什么条件时调用)</label>
                    <textarea rows={3} placeholder="例如：当询问起号规划时..." className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">输出结果 (应当输出的结构)</label>
                    <textarea rows={3} placeholder="例如：必须包含阶段时间表..." className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500 resize-none"></textarea>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">禁用场景</label>
                  <input type="text" placeholder="例如：当预算低于 1W 时禁用" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="default-enable" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="default-enable" className="text-[13px] font-medium text-neutral-700">对所有新项目默认启用</label>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 bg-[#fafafa] rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setIsStrategyFormOpen(false)} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 font-bold text-[13px] rounded-xl hover:bg-neutral-50 transition-colors">
                  取消
                </button>
                <button onClick={() => setIsStrategyFormOpen(false)} className="px-4 py-2 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5">
                   确认启用
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function KnowledgeMemory() {
  const [activeSpace, setActiveSpace] = useState<SpaceType>("merchant");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeTarget, setMergeTarget] = useState<Memory | null>(null);
  const [mergeFields, setMergeFields] = useState({ content: 'primary', scope: 'both' });
  const [editedMemory, setEditedMemory] = useState<Memory | null>(null);
  const [editScopeString, setEditScopeString] = useState("");
  const [editUsableForString, setEditUsableForString] = useState("");

  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [selectedSourceFile, setSelectedSourceFile] = useState<any>(null);
  const [selectedGap, setSelectedGap] = useState<{label: string, type: string} | null>(null);
  const [collectionPerms, setCollectionPerms] = useState<Record<string, string>>({
    'c_competitor': '可作为操盘建议参考',
    'c_ideas': '仅存档',
    'c_teardown': '仅存档',
    'c_quotes': '可作为内容生成参考'
  });

  useEffect(() => {
    setIsMerging(false);
    setMergeTarget(null);
    if (selectedMemory) {
      setEditedMemory({ ...selectedMemory });
      setEditScopeString(selectedMemory.applicableScope.join(", "));
      setEditUsableForString(selectedMemory.usableFor.join(", "));
      if (selectedMemory.status === '待确认') {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  }, [selectedMemory]);

  useEffect(() => {
    if (activeSpace === "merchant") {
      window.dispatchEvent(
        new CustomEvent("set-custom-greeting", {
          detail: {
            greeting:
              "欢迎来到商家知识与记忆库。AI 已从最近的 28 条评论和 6 条私信中提取了新的客户反馈（待确认）。当前运营资料完整度 82%，影响运营的最大缺口是「KOS 店长号人设」。",
            expert: "知识流转助手",
          },
        })
      );
    } else {
      window.dispatchEvent(new CustomEvent("clear-custom-greeting"));
    }
  }, [activeSpace]);

  const filteredMemories = MOCK_MEMORIES.filter(m => activeCategory === "all" || m.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      <div className="px-8 flex items-end border-b border-neutral-200 bg-[#fafafa] shrink-0 pt-6">
        <div className="flex items-center gap-8">
          {SPACES.map(space => (
            <button
              key={space.id}
              onClick={() => setActiveSpace(space.id as SpaceType)}
              className={"text-[15px] font-bold pb-4 transition-colors relative flex items-center gap-2 " + (activeSpace === space.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
            >
              {space.id === 'merchant' && <Database size={16} className={activeSpace === space.id ? "text-primary-500" : ""} />}
              {space.id === 'strategy' && <LayoutTemplate size={16} className={activeSpace === space.id ? "text-primary-500" : ""} />}
              {space.label}
              {activeSpace === space.id && (
                <motion.div layoutId="space_indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeSpace === 'strategy' && <StrategyView />}
      
      {activeSpace === 'merchant' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-8 py-6 border-b border-neutral-100 bg-[#fcfcfc] shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-[20px] font-bold text-neutral-900">当前商家记忆</h1>
                  <div className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-[12px] font-bold flex items-center gap-1.5">
                    <Activity size={12} /> 运营资料完整度 82%
                  </div>
                </div>
                
                <div className="mt-4 flex gap-8">
                  <div className="flex-1 max-w-xl">
                    <div className="text-[12px] font-bold text-neutral-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" /> 当前影响运营的缺口：
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-600 text-[12px] rounded-md font-medium shadow-sm">缺私域承接话术 (影响私信流转)</span>
                      <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-600 text-[12px] rounded-md font-medium shadow-sm">缺 KOS 店长号人设 (影响内容生成)</span>
                      <span className="px-2.5 py-1 bg-white border border-amber-200 text-amber-600 text-[12px] rounded-md font-medium shadow-sm">缺真实客户常见反馈 (影响素材判断)</span>
                      <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-500 text-[12px] rounded-md font-medium shadow-sm line-through decoration-neutral-400">618 优惠信息已过期</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-48 shrink-0">
                <button onClick={() => setIsCompletingProfile(true)} className="w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-neutral-800 transition-colors">补齐资料</button>
                <button 
                  onClick={() => { setActiveTab('memory'); setActiveCategory('all'); }}
                  className="w-full py-2 bg-primary-50 text-primary-700 border border-primary-100 rounded-lg text-[13px] font-bold hover:bg-primary-100 transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <CheckCircle2 size={14} /> 确认待处理记忆 (6)
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 border-b border-neutral-100 flex gap-6 bg-white shrink-0">
            {[
              { id: "overview", label: "总览" },
              { id: "memory", label: "记忆条目" },
              { id: "source", label: "本地资料库" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={"py-4 text-[14px] font-bold transition-all relative " + (activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600")}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="knowledgetab" className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfc] p-8">
            
            {activeTab === "overview" && (
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {CATEGORIES.map(cat => {
                    const pendingCount = cat.id === 'customer' ? 6 : 0;
                    const missingCount = cat.id === 'account' ? 4 : (cat.id === 'reply' ? 2 : 0);
                    const confirmedCount = cat.id === 'brand' ? 25 : (cat.id === 'account' ? 7 : 12);

                    return (
                      <div key={cat.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-neutral-300 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-600 border border-neutral-100">
                            <cat.icon size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-[16px] text-neutral-900">{cat.label}</h3>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[11px] text-neutral-500 font-medium">已确认 {confirmedCount}</span>
                              {pendingCount > 0 && <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 rounded border border-amber-200">待确认 {pendingCount}</span>}
                              {missingCount > 0 && <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-1.5 rounded border border-rose-200">缺失 {missingCount}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="text-[12px] flex items-start gap-2">
                            <span className="font-bold text-neutral-400 shrink-0 w-12">影响：</span>
                            <span className="text-neutral-600 leading-snug">{['brand', 'account'].includes(cat.id) ? '操盘建议、内容生成、发布审核、私域回复' : '内容策划、素材匹配、话术策略'}</span>
                          </div>
                          {missingCount > 0 && (
                            <div className="text-[12px] flex items-start gap-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
                              <span className="font-bold text-rose-600 shrink-0">当前最重要：</span>
                              <span className="text-rose-700 leading-snug">
                                {cat.id === 'account' ? 'KOS 店长号人设缺失，影响 4 篇员工号内容生成' : '缺乏高意向线索承接话术，容易流失客户。'}
                              </span>
                            </div>
                          )}
                          {pendingCount > 0 && (
                            <div className="text-[12px] flex items-start gap-2 bg-amber-50 p-2 rounded-lg border border-amber-100">
                              <span className="font-bold text-amber-700 shrink-0">最新发现：</span>
                              <span className="text-amber-800 leading-snug">
                                AI 从最新私信中提取了 6 条客户常见问题，待确认。
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="max-w-6xl mx-auto mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[18px] font-bold text-neutral-900">记忆流转与调用记录</h2>
                      <p className="text-[13px] text-neutral-500 mt-1">追踪知识条目从哪里来、用到哪里、结果如何。</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      {
                        date: "2026-07-08 14:30",
                        action: "AI 内容生成调用了记忆",
                        memory: "不能承诺治疗软便...",
                        target: "生成「幼犬换粮避坑」正文",
                        result: "规避了 2 处潜在医疗化违规词"
                      },
                      {
                        date: "2026-07-08 10:15",
                        action: "AI 提取了新记忆",
                        memory: "新手养狗客户最担心软便...",
                        target: "写入「客户与需求」",
                        result: "操盘手已确认"
                      },
                      {
                        date: "2026-07-07 16:45",
                        action: "评论自动回复调用了记忆",
                        memory: "618 期间购买送冻干试吃装",
                        target: "回复 15 条价格咨询评论",
                        result: "带来 3 条高意向线索"
                      }
                    ].map((log, i) => (
                      <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-3">
                          <div className="flex items-center gap-2">
                            <Activity size={16} className="text-primary-500" />
                            <span className="font-bold text-[14px] text-neutral-900">{log.action}</span>
                          </div>
                          <span className="text-[12px] text-neutral-400 font-medium">{log.date}</span>
                        </div>
                        <div className="space-y-2 text-[13px]">
                          <div className="flex items-start gap-2">
                            <span className="w-16 shrink-0 font-bold text-neutral-400">调用记忆:</span>
                            <span className="font-medium text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200 truncate">"{log.memory}"</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-16 shrink-0 font-bold text-neutral-400">目标动作:</span>
                            <span className="text-neutral-700 truncate">{log.target}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-16 shrink-0 font-bold text-neutral-400">最终结果:</span>
                            <span className="text-emerald-600 font-bold truncate">{log.result}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "memory" && (
              <div className="flex gap-6 h-full max-w-[1400px] mx-auto">
                <div className="w-56 shrink-0 space-y-6">
                  <div>
                    <div className="text-[11px] font-bold text-neutral-400 mb-2 px-2">核心记忆</div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => setActiveCategory('all')}
                        className={"w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors " + (activeCategory === 'all' ? "bg-neutral-900 text-white font-bold shadow-sm" : "text-neutral-600 hover:bg-neutral-100")}
                      >
                        全部记忆
                      </button>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={"w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 " + (activeCategory === cat.id ? "bg-neutral-900 text-white font-bold shadow-sm" : "text-neutral-600 hover:bg-neutral-100")}
                        >
                          <cat.icon size={14} className={activeCategory === cat.id ? "text-neutral-400" : "text-neutral-400"} />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-neutral-400 mb-2 px-2 flex items-center justify-between">
                      自定义集合
                      <button className="text-neutral-400 hover:text-neutral-900 transition-colors"><Plus size={14}/></button>
                    </div>
                    <div className="space-y-0.5">
                      {CUSTOM_COLLECTIONS.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={"w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 " + (activeCategory === cat.id ? "bg-neutral-900 text-white font-bold shadow-sm" : "text-neutral-600 hover:bg-neutral-100")}
                        >
                          <cat.icon size={14} className={activeCategory === cat.id ? "text-neutral-400" : "text-neutral-400"} />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] font-bold text-neutral-700">筛选状态：</span>
                      <div className="flex gap-2">
                        {["全部", "已确认", "待确认", "缺失", "已过期", "有冲突"].map(s => (
                          <button key={s} className={"px-3 py-1 rounded-full text-[12px] font-bold transition-colors " + (s === '待确认' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200' : s === '全部' ? 'bg-neutral-800 text-white border border-neutral-800' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50')}>
                            {s} {s === '待确认' && '(6)'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {CUSTOM_COLLECTIONS.find(c => c.id === activeCategory) && (
                        <div className="flex items-center gap-2 border-r border-neutral-200 pr-4">
                          <span className="text-[12px] font-bold text-neutral-500">调用权限:</span>
                          <select 
                            value={collectionPerms[activeCategory] || '仅存档'}
                            onChange={e => setCollectionPerms({...collectionPerms, [activeCategory]: e.target.value})}
                            className="bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded p-1 focus:outline-none focus:border-primary-500"
                          >
                            <option value="仅存档">仅存档 (默认)</option>
                            <option value="可作为操盘建议参考">可作为操盘建议参考</option>
                            <option value="可作为内容生成参考">可作为内容生成参考</option>
                            <option value="需人工确认后可用">需人工确认后可用</option>
                          </select>
                        </div>
                      )}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" placeholder="搜索记忆..." className="pl-8 pr-4 py-1.5 text-[12px] bg-white border border-neutral-200 rounded-lg w-64 focus:outline-none focus:border-neutral-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {filteredMemories.map(memory => (
                      <div 
                        key={memory.id} 
                        onClick={() => setSelectedMemory(memory)}
                        className="p-4 border border-neutral-100 rounded-xl hover:border-primary-300 hover:shadow-md transition-all cursor-pointer bg-white group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={"px-2 py-0.5 rounded text-[11px] font-bold " + (memory.status === '已确认' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : memory.status === '待确认' ? 'bg-amber-50 text-amber-700 border border-amber-100' : memory.status === '已过期' ? 'bg-neutral-100 text-neutral-500 border border-neutral-200' : 'bg-rose-50 text-rose-700 border border-rose-100')}>
                              {memory.status}
                            </span>
                            {memory.constraintStrength && (
                              <span className={"flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold " + (
                                memory.constraintStrength === '强约束' ? 'text-amber-700 bg-amber-50 border border-amber-100' :
                                memory.constraintStrength === '已启用' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' :
                                memory.constraintStrength === '可参考' ? 'text-blue-700 bg-blue-50 border border-blue-100' :
                                'text-neutral-600 bg-neutral-100 border border-neutral-200'
                              )}>
                                {memory.constraintStrength === '强约束' ? <AlertTriangle size={12}/> :
                                 memory.constraintStrength === '已启用' ? <Check size={12}/> :
                                 memory.constraintStrength === '可参考' ? <MessageCircle size={12}/> :
                                 <Folder size={12}/>}
                                {memory.constraintStrength}
                              </span>
                            )}
                            <span className="text-[12px] font-bold text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                              {[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === memory.category)?.label} · {memory.subCategory}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-400">更新于 {memory.lastUpdated}</span>
                        </div>
                        
                        <p className="text-[14px] text-neutral-900 font-medium mb-3 group-hover:text-primary-700 transition-colors leading-relaxed">
                          {memory.content}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-[12px] text-neutral-500">
                          <div className="flex items-center gap-1.5">
                            <Database size={12} className="text-neutral-400" /> 
                            <span className="truncate max-w-[200px]">来源：{memory.source}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Activity size={12} className="text-neutral-400" />
                            <span>被 {memory.usableFor.length} 个场景调用</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredMemories.length === 0 && (
                       <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-2">
                          <Folder size={32} className="text-neutral-300" />
                          <span className="text-[13px] font-medium">该分类下暂无记忆条目</span>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "source" && (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[18px] font-bold text-neutral-900">本地资料库</h2>
                    <p className="text-[13px] text-neutral-500 mt-1">上传原始资料，AI 会自动解析并提取商家候选记忆条目。</p>
                  </div>
                  <button className="py-2 px-4 bg-neutral-900 text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-neutral-800 transition-colors flex items-center gap-2">
                    <Upload size={16} /> 导入新资料
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "品牌话术规范2026.pdf", type: "pdf", status: "已入库", count: 12, pending: 0, time: "2天前", memories: ["软便不能承诺治疗", "KOS 店长号人设"] },
                    { name: "6月客服聊天记录_导出.xlsx", type: "excel", status: "待确认", count: 28, pending: 6, time: "1小时前", memories: ["新手养狗顾虑：软便/不吃", "618赠品客诉处理"] },
                    { name: "幼犬换粮项目_复盘文档.docx", type: "word", status: "解析中", count: 0, pending: 0, time: "15分钟前", memories: [] },
                    { name: "旧版品牌白皮书.pdf", type: "pdf", status: "未解析", count: 0, pending: 0, time: "1个月前", memories: [] },
                    { name: "无效的链接格式.csv", type: "excel", status: "解析失败", count: 0, pending: 0, time: "昨天", memories: [] },
                  ].map((file, i) => (
                    <div key={i} onClick={() => setSelectedSourceFile(file)} className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center justify-between hover:border-neutral-300 transition-colors cursor-pointer shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className={"w-10 h-10 rounded-lg flex items-center justify-center border " + (file.type === 'pdf' ? 'bg-rose-50 border-rose-100 text-rose-500' : file.type === 'excel' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-blue-50 border-blue-100 text-blue-500')}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-neutral-900 group-hover:text-primary-700 transition-colors">{file.name}</h4>
                          <div className="text-[12px] text-neutral-500 mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1.5"><Clock size={12} /> {file.time}上传</span>
                            <span className="flex items-center gap-1.5"><Database size={12} /> 提取了 {file.count} 条记忆</span>
                            {file.pending > 0 && <span className="text-amber-700 font-bold bg-amber-50 px-1.5 rounded border border-amber-200">{file.pending} 条待确认</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={"px-2.5 py-1 rounded-md text-[12px] font-bold " + (
                            file.status === '已入库' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            file.status === '待确认' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            file.status === '未解析' ? 'bg-neutral-50 text-neutral-500 border border-neutral-200' :
                            file.status === '解析失败' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                        )}>
                          {file.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Completion Drawer */}
      <AnimatePresence>
        {isCompletingProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompletingProfile(false)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-1/2 bottom-0 w-[600px] -translate-x-1/2 bg-white rounded-t-2xl shadow-2xl z-50 flex flex-col border border-neutral-200"
              style={{ maxHeight: '80vh' }}
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#fafafa] rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-primary-500" />
                  <h3 className="text-[16px] font-bold text-neutral-900">补齐资料</h3>
                </div>
                <button
                  onClick={() => setIsCompletingProfile(false)}
                  className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[14px] font-bold text-rose-800">发现 3 项关键资料缺失</h4>
                    <p className="text-[12px] text-rose-600 mt-1">这些信息的缺失正在影响当前的运营动作，建议优先补齐。</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "KOS 店长号人设", desc: "影响 KOS 内容生成。缺乏人设背景，导致员工号内容生成时口吻不一致。", type: "merchant" },
                    { title: "私域承接话术", desc: "影响私信承接。高意向客户进粉后，缺乏标准话术承接流转。", type: "reply" },
                    { title: "真实客户常见反馈", desc: "影响素材判断。未能覆盖新手养宠用户的最新顾虑。", type: "customer" }
                  ].map((missing, i) => (
                    <div key={i} className="border border-neutral-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] font-bold text-neutral-900">{missing.title}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded border border-neutral-200">
                          {CATEGORIES.find(c => c.id === missing.type)?.label}
                        </span>
                      </div>
                      <p className="text-[12px] text-neutral-500 mb-4">{missing.desc}</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-neutral-900 text-white text-[12px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5">
                          <Sparkles size={14} /> 开启 AI 访谈
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                          手动填写
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Source File Drawer */}
      <AnimatePresence>
        {selectedSourceFile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSourceFile(null)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200"
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#fafafa]">
                <h3 className="text-[16px] font-bold text-neutral-900">资料库文件详情</h3>
                <button
                  onClick={() => setSelectedSourceFile(null)}
                  className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="flex items-start gap-4">
                  <div className={"w-12 h-12 rounded-xl flex items-center justify-center border text-[24px] " + (
                    selectedSourceFile.type === 'pdf' ? 'bg-rose-50 border-rose-100 text-rose-500' :
                    selectedSourceFile.type === 'excel' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-blue-50 border-blue-100 text-blue-500'
                  )}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] text-neutral-900">{selectedSourceFile.name}</h4>
                    <div className="text-[12px] text-neutral-500 mt-1 flex items-center gap-3">
                      <span>{selectedSourceFile.time}上传</span>
                      <span>·</span>
                      <span className={"font-bold px-1.5 py-0.5 rounded " + (
                            selectedSourceFile.status === '已入库' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            selectedSourceFile.status === '待确认' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            selectedSourceFile.status === '未解析' ? 'bg-neutral-50 text-neutral-500 border border-neutral-200' :
                            selectedSourceFile.status === '解析失败' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                        )}>{selectedSourceFile.status}</span>
                    </div>
                  </div>
                </div>
                
                {selectedSourceFile.memories && selectedSourceFile.memories.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                       <Database size={16} className="text-primary-500" /> 已确认的记忆结果 ({selectedSourceFile.memories.length})
                    </h4>
                    <div className="space-y-2">
                       {selectedSourceFile.memories.map((mem, idx) => (
                         <div key={idx} className="p-3 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-between group">
                            <span className="text-[13px] text-neutral-700 font-medium">{mem}</span>
                            <button className="text-[12px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">查看详情</button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}



                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[14px] font-bold text-amber-700">AI 提取的待确认候选 ({selectedSourceFile.pending})</h5>
                    {selectedSourceFile.pending > 0 && (
                      <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {selectedSourceFile.pending} 条待确认
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="p-3 border border-neutral-200 rounded-lg bg-neutral-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[11px] font-bold text-neutral-500 px-1.5 py-0.5 bg-white rounded border border-neutral-200">客户反馈</span>
                          {idx === 0 && selectedSourceFile.pending > 0 ? (
                            <span className="text-[10px] text-amber-600 font-bold">待确认</span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold">已确认</span>
                          )}
                        </div>
                        <p className="text-[13px] text-neutral-800 font-medium line-clamp-2">提取自该文件的一条非常有价值的知识片段，可能涉及客服话术或者常见问题记录...</p>
                      </div>
                    ))}
                    {selectedSourceFile.count > 3 && (
                      <button className="w-full py-2 text-[12px] font-bold text-neutral-500 hover:text-neutral-700 transition-colors">
                        查看全部 {selectedSourceFile.count} 条记录...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMemory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMemory(null)}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200"
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#fafafa]">
                <h3 className="text-[16px] font-bold text-neutral-900">记忆详情</h3>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 mb-2 block">记忆内容</label>
                      <textarea
                        value={editedMemory?.content || ""}
                        onChange={(e) => setEditedMemory(prev => prev ? { ...prev, content: e.target.value } : null)}
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500 min-h-[100px] custom-scrollbar"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 mb-2 block">分类</label>
                        <select
                          value={editedMemory?.category || ""}
                          onChange={(e) => setEditedMemory(prev => prev ? { ...prev, category: e.target.value } : null)}
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                        >
                          {[...CATEGORIES, ...CUSTOM_COLLECTIONS].map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 mb-2 block">子分类</label>
                        <input
                          type="text"
                          value={editedMemory?.subCategory || ""}
                          onChange={(e) => setEditedMemory(prev => prev ? { ...prev, subCategory: e.target.value } : null)}
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 mb-2 block">调用策略</label>
                      <select
                        value={editedMemory?.constraintStrength || "不调用"}
                        onChange={(e) => setEditedMemory(prev => prev ? { ...prev, constraintStrength: e.target.value as any } : null)}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                      >
                        <option value="强约束">强约束 (必须遵守，违背即报错)</option>
                        <option value="已启用">已启用 (AI主动应用的标准动作)</option>
                        <option value="可参考">可参考 (作为背景信息辅助决策)</option>
                        <option value="不调用">不调用 (仅存档，不参与主流程业务判定)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 mb-2 block">适用范围 (用逗号分隔)</label>
                      <input
                        type="text"
                        value={editScopeString}
                        onChange={(e) => setEditScopeString(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 mb-2 block">用于业务动作 (用逗号分隔)</label>
                      <input
                        type="text"
                        value={editUsableForString}
                        onChange={(e) => setEditUsableForString(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                ) : isMerging ? (
                  <div className="space-y-4">
                    {!mergeTarget ? (
                      <>
                        <div className="text-[14px] font-bold text-neutral-900">选择要合并的记忆条目</div>
                        <p className="text-[12px] text-neutral-500 mb-4">选择另一条相关记忆进行合并。</p>
                        
                        <div className="relative mb-4">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input type="text" placeholder="搜索相关记忆..." className="w-full pl-8 pr-4 py-2 text-[13px] bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400" />
                        </div>
                        
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                          {MOCK_MEMORIES.filter(m => m.id !== selectedMemory.id).map(m => (
                            <div key={m.id} onClick={() => setMergeTarget(m)} className="p-3 border border-neutral-200 rounded-lg hover:border-primary-400 cursor-pointer transition-colors bg-white group flex items-start gap-3 shadow-sm">
                              <div className="mt-0.5 text-neutral-300 group-hover:text-primary-500">
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <div className="text-[13px] text-neutral-900 font-medium mb-1 line-clamp-2">{m.content}</div>
                                <div className={"text-[11px] " + (m.category !== selectedMemory.category ? 'text-rose-500 font-bold' : 'text-neutral-400')}>
                                  {m.category !== selectedMemory.category && <AlertTriangle size={12} className="inline mr-1 -mt-0.5"/>}
                                  {[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === m.category)?.label} · {m.subCategory}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-[14px] font-bold text-neutral-900 mb-2">
                          <button onClick={() => setMergeTarget(null)} className="p-1 hover:bg-neutral-100 rounded text-neutral-500"><ChevronRight size={16} className="rotate-180"/></button>
                          合并设置
                        </div>
                        
                        {mergeTarget.category !== selectedMemory.category && (
                          <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-[12px] text-rose-700 flex items-start gap-2 mb-4">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            跨分类合并警告：目标记忆属于「{[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === mergeTarget.category)?.label}」，当前属于「{[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === selectedMemory.category)?.label}」。请确认是否继续。
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label className="text-[11px] font-bold text-neutral-400 mb-2 block">主干内容保留</label>
                            <div className="flex gap-2">
                              <button onClick={() => setMergeFields({...mergeFields, content: 'primary'})} className={"flex-1 p-2 rounded border text-[12px] text-left " + (mergeFields.content === 'primary' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600')}>当前: {selectedMemory.content.substring(0, 10)}...</button>
                              <button onClick={() => setMergeFields({...mergeFields, content: 'target'})} className={"flex-1 p-2 rounded border text-[12px] text-left " + (mergeFields.content === 'target' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600')}>目标: {mergeTarget.content.substring(0, 10)}...</button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-400 mb-2 block">适用范围</label>
                            <div className="flex gap-2">
                              <button onClick={() => setMergeFields({...mergeFields, scope: 'both'})} className={"flex-1 p-2 rounded border text-[12px] text-center " + (mergeFields.scope === 'both' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600')}>融合两者</button>
                              <button onClick={() => setMergeFields({...mergeFields, scope: 'primary'})} className={"flex-1 p-2 rounded border text-[12px] text-center " + (mergeFields.scope === 'primary' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600')}>仅保留当前</button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>

                    
                    {selectedMemory.status === '已过期' && (
                      <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <History size={16} className="text-neutral-500" />
                          <span className="font-bold text-[13px] text-neutral-700">此记忆已过期</span>
                        </div>
                        <p className="text-[12px] text-neutral-600 leading-relaxed">
                          此策略或信息已不再适用。AI 在执行内容生成、审核等业务时将默认忽略该条目，但作为上下文历史保留。
                        </p>
                      </div>
                    )}

                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 mb-2">记忆内容</div>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[14px] text-neutral-900 font-medium leading-relaxed">
                        {selectedMemory.content}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 mb-2">分类</div>
                        <div className="text-[13px] text-neutral-700 flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-neutral-500">
                            {(() => {
                              const Icon = [...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === selectedMemory.category)?.icon || Database;
                              return <Icon size={14} />;
                            })()}
                          </div>
                          {[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === selectedMemory.category)?.label}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 mb-2">子分类</div>
                        <div className="text-[13px] text-neutral-700">{selectedMemory.subCategory}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-[11px] font-bold text-neutral-400 mb-2">调用策略</div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            {selectedMemory.constraintStrength === '强约束' ? (
                               <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold"><AlertTriangle size={14}/> 强约束</span>
                            ) : selectedMemory.constraintStrength === '已启用' ? (
                               <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold"><Check size={14}/> 已启用</span>
                            ) : selectedMemory.constraintStrength === '参考' || selectedMemory.constraintStrength === '可参考' ? (
                               <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold"><MessageCircle size={14}/> 可参考</span>
                            ) : (
                               <span className="flex items-center gap-1 text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-bold"><Folder size={14}/> 不调用</span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {selectedMemory.constraintStrength === '强约束' ? '必须遵守，违背即报错。' : 
                             selectedMemory.constraintStrength === '已启用' ? 'AI 主动应用的标准动作。' : 
                             selectedMemory.constraintStrength === '参考' || selectedMemory.constraintStrength === '可参考' ? '作为背景信息辅助决策。' : 
                             '不参与主流程业务判定。'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 mb-2 mt-4">适用范围</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedMemory.applicableScope.map(scope => (
                          <span key={scope} className="px-2 py-1 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded text-[12px] font-medium">{scope}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 mb-2">用于业务动作</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedMemory.usableFor.map(action => (
                          <span key={action} className="px-2 py-1 bg-primary-50 border border-primary-100 text-primary-700 rounded text-[12px] font-medium">{action}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 mb-2">证据来源</div>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex items-center justify-between hover:bg-neutral-100 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-neutral-500" />
                          <span className="text-[13px] font-medium text-neutral-900">{selectedMemory.source}</span>
                        </div>
                        <span className="text-[11px] text-primary-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">查看原对话 <ChevronRight size={14}/></span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-bold text-neutral-400">最近调用记录</div>
                        <button className="text-[11px] text-primary-600 font-bold hover:text-primary-700 flex items-center gap-0.5">查看全部 <ChevronRight size={12}/></button>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                          <div>
                            <div className="text-[12px] text-neutral-900 leading-snug">被 <span className="font-bold">内容生成</span> 调用 3 次，最近一次规避了 2 处禁用表达。</div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">2 小时前</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
                          <div>
                            <div className="text-[12px] text-neutral-900 leading-snug">被 <span className="font-bold">发布审核</span> 调用，未发现违规项。</div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">昨天 16:45</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-[12px] text-neutral-500">
                        <span>更新于: {selectedMemory.lastUpdated}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-neutral-100 bg-[#fafafa] flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                      取消
                    </button>
                    <button onClick={() => { 
                      if (editedMemory) {
                        setSelectedMemory({
                          ...editedMemory,
                          status: selectedMemory.status === '待确认' ? '已确认' : editedMemory.status,
                          applicableScope: editScopeString.split(',').map(s => s.trim()).filter(Boolean),
                          usableFor: editUsableForString.split(',').map(s => s.trim()).filter(Boolean)
                        });
                      }
                      setIsEditing(false); 
                    }} className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                      {selectedMemory.status === '待确认' ? '确认写入' : '保存修改'}
                    </button>
                  </>
                ) : isMerging ? (
                  <>
                    <button onClick={() => { setIsMerging(false); setMergeTarget(null); }} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                      取消
                    </button>
                    <button 
                      onClick={() => { setIsMerging(false); setMergeTarget(null); }} 
                      disabled={!mergeTarget}
                      className={"flex-1 py-2 rounded-lg text-[13px] font-bold transition-colors shadow-sm " + (mergeTarget ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed')}
                    >
                      确认合并
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <Edit3 size={14} /> 编辑
                    </button>
                    <button onClick={() => setIsMerging(true)} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <GitMerge size={14} /> 合并
                    </button>
                    
                    {selectedMemory.isCustom ? (
                      <div className="w-full flex gap-2 mt-1">
                        <button className="flex-1 py-2 bg-primary-50 text-primary-700 border border-primary-100 rounded-lg text-[13px] font-bold hover:bg-primary-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={14} /> 转为商家候选记忆
                        </button>
                        <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                          <LinkIcon size={14} /> 关联当前项目
                        </button>
                      </div>
                    ) : selectedMemory.status !== '已过期' ? (
                      <button onClick={() => setSelectedMemory({...selectedMemory, status: '已过期'})} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                        <AlertTriangle size={14} /> 标为过期
                      </button>
                    ) : (
                      <button onClick={() => setSelectedMemory({...selectedMemory, status: '已确认'})} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                        <Activity size={14} /> 重新激活
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
