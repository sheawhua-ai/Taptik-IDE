import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, MessageCircle, ShieldCheck, Zap, Search, Upload, CheckCircle2, ChevronRight,
  Database, Users, Image as ImageIcon, Plus, FileText, Link as LinkIcon, MessageSquare,
  Clock, Settings, History, Info, Activity, AlertCircle, AlertTriangle, BookOpen, X,
  Check, Edit3, Trash2, GitMerge, Eye, FileCode2, PieChart, Sparkles, Folder, Download,
  Send, PenTool, LayoutTemplate, Network
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
}

const SPACES = [
  { id: 'merchant', label: '商家记忆' },
  { id: 'strategy', label: '我的打法' }
];

const CATEGORIES = [
  { id: "merchant", label: "商家画像", icon: BookOpen, desc: "品牌、产品、价格、账号、私域承接、禁区" },
  { id: "customer", label: "客户与需求", icon: Users, desc: "目标客户、痛点、购买顾虑、常见问题、真实反馈" },
  { id: "content", label: "内容规则", icon: FileText, desc: "标题规则、口吻、图文规范、禁用表达、审核偏好" },
  { id: "reply", label: "话术回复", icon: MessageSquare, desc: "评论、私信、企微、客服 FAQ、高意向跟进" },
  { id: "material", label: "素材偏好", icon: ImageIcon, desc: "高点击封面、可用素材类型、禁用素材、拍摄要求" },
  { id: "review", label: "打法复盘", icon: Activity, desc: "有效选题、失败案例、账号适配、转化经验" },
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

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fafafa]">
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <PenTool size={18} className="text-primary-500" />
              随时记录打法与洞察
            </h2>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="随时记录跨商家的观察、个人创意、业务模型或通用判断..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[14px] text-neutral-900 focus:outline-none focus:border-primary-500 min-h-[100px] resize-none custom-scrollbar"
            />
            <AnimatePresence>
              {inputText && (
                <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="mt-4 flex items-start justify-between overflow-hidden">
                  <div className="flex gap-3">
                    <span className="text-[12px] font-bold text-neutral-400 mt-1.5 whitespace-nowrap">AI 建议动作:</span>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-neutral-800 transition-colors">保存为历史随笔</button>
                      <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-lg text-[12px] font-medium shadow-sm transition-colors">转为待确认商家记忆</button>
                      <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-lg text-[12px] font-medium shadow-sm transition-colors">整理为本地打法草稿</button>
                    </div>
                  </div>
                  <button className="w-10 h-10 shrink-0 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 shadow-md transition-colors ml-4">
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                  <History size={18} className="text-neutral-500" />
                  历史随笔与洞察
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { content: "发现宠物食品类目下，用第一人称视角的开箱视频点击率普遍高20%。", tag: "跨商家观察", date: "今天 10:30", usage: "已在 5 个项目中被引用" },
                  { content: "下次尝试把所有干粮的包装都做成深色系，看起来更高端一点，待验证。", tag: "待验证假设", date: "昨天 16:45", usage: "暂无引用" }
                ].map((note, i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-neutral-300 transition-colors">
                    <p className="text-[14px] text-neutral-900 font-medium mb-4 leading-relaxed">{note.content}</p>
                    <div className="flex flex-wrap items-center justify-between text-[12px] gap-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded font-bold border border-neutral-200">{note.tag}</span>
                          <span className="text-neutral-400 font-medium">{note.date}</span>
                        </div>
                        {note.usage.includes('5') ? (
                          <div className="flex items-center gap-4">
                            <span className="text-neutral-500">{note.usage}</span>
                            <button className="text-primary-600 font-bold flex items-center gap-1.5 hover:text-primary-700 transition-colors bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                              <Sparkles size={14}/> 升华提取
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-400">{note.usage}</span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                    <LayoutTemplate size={18} className="text-neutral-500" />
                    本地打法包
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 text-neutral-700 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors">
                    <Download size={14} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-neutral-900 text-white rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "宠物食品小红书起号打法 v2.0", type: "行业打法", status: "已启用", desc: "包含人设搭建、首月30篇内容SOP、以及客服承接话术模板。", author: "官方提供", date: "更新于 2周前" },
                  { name: "幼犬换粮私域承接SOP", type: "转化流程", status: "已启用", desc: "从引流到首单转化的话术树与常见Q&A应对策略。", author: "我的沉淀", date: "更新于 1天前" },
                  { name: "高转化单品测评图文模板", type: "写法模板", status: "已启用", desc: "结构化的测评图文框架，含标题结构和画面分镜要求。", author: "团队共享", date: "更新于 1个月前" },
                  { name: "猫砂品类除臭卖点验证", type: "待验证打法", status: "草稿", desc: "试图验证除臭卖点是否比结团卖点转化率更高。", author: "我的沉淀", date: "刚刚" },
                ].map((pack, i) => (
                    <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-primary-300 transition-colors group cursor-pointer relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-4">
                          <span className={"px-2.5 py-1 rounded-md text-[11px] font-bold " + (pack.status === '已启用' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-neutral-100 text-neutral-500 border border-neutral-200')}>
                            {pack.status}
                          </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-600 border border-neutral-100">
                          {pack.type === '行业打法' ? <Network size={18}/> : pack.type === '写法模板' ? <LayoutTemplate size={18}/> : <Folder size={18}/>}
                        </div>
                        <div>
                          <h3 className="font-bold text-[14px] text-neutral-900 group-hover:text-primary-700 transition-colors">{pack.name}</h3>
                          <span className="text-[11px] text-neutral-500 font-medium px-2 py-0.5 bg-neutral-50 rounded border border-neutral-200 mt-1 inline-block">{pack.type}</span>
                        </div>
                      </div>
                      <p className="text-[13px] text-neutral-600 leading-relaxed mb-4 flex-1 pr-8">{pack.desc}</p>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium pt-3 border-t border-neutral-100 mt-auto">
                        <span className="flex items-center gap-1.5"><Users size={12}/> {pack.author}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {pack.date}</span>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
  const [editedMemory, setEditedMemory] = useState<Memory | null>(null);

  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [selectedSourceFile, setSelectedSourceFile] = useState<any>(null);

  useEffect(() => {
    setIsEditing(false);
    setIsMerging(false);
    if (selectedMemory) {
      setEditedMemory({ ...selectedMemory });
    }
  }, [selectedMemory]);

  useEffect(() => {
    if (activeSpace === "merchant") {
      window.dispatchEvent(
        new CustomEvent("set-custom-greeting", {
          detail: {
            greeting:
              "欢迎来到商家知识与记忆库。AI 已从最近的 28 条评论和 6 条私信中提取了新的客户反馈（待确认）。当前画像完整度 82%，影响运营的最大缺口是「KOS 店长号人设」。",
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
                    <Activity size={12} /> 画像完整度 82%
                  </div>
                </div>
                
                <div className="mt-4 flex gap-8">
                  <div className="flex-1 max-w-xl">
                    <div className="text-[12px] font-bold text-neutral-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" /> 当前影响运营的缺口：
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-600 text-[12px] rounded-md font-medium shadow-sm">缺私域承接话术</span>
                      <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-600 text-[12px] rounded-md font-medium shadow-sm">缺 KOS 店长号人设</span>
                      <span className="px-2.5 py-1 bg-white border border-amber-200 text-amber-600 text-[12px] rounded-md font-medium shadow-sm">缺真实客户常见反馈</span>
                      <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-500 text-[12px] rounded-md font-medium shadow-sm line-through decoration-neutral-400">618 优惠信息已过期</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-48 shrink-0">
                <button onClick={() => setIsCompletingProfile(true)} className="w-full py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-neutral-800 transition-colors">补齐画像</button>
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
                    const missingCount = cat.id === 'merchant' ? 4 : (cat.id === 'reply' ? 2 : 0);
                    const confirmedCount = cat.id === 'merchant' ? 32 : 12;

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
                            <span className="text-neutral-600 leading-snug">{cat.id === 'merchant' ? '操盘建议、内容生成、发布审核、私域回复' : '内容策划、素材匹配、话术策略'}</span>
                          </div>
                          {missingCount > 0 && (
                            <div className="text-[12px] flex items-start gap-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
                              <span className="font-bold text-rose-600 shrink-0">当前最重要：</span>
                              <span className="text-rose-700 leading-snug">
                                {cat.id === 'merchant' ? 'KOS 店长号人设缺失，影响 4 篇员工号内容生成' : '缺乏高意向线索承接话术，容易流失客户。'}
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
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input type="text" placeholder="搜索记忆..." className="pl-8 pr-4 py-1.5 text-[12px] bg-white border border-neutral-200 rounded-lg w-64 focus:outline-none focus:border-neutral-400" />
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
                    { name: "品牌话术规范2026.pdf", type: "pdf", status: "已解析", count: 12, pending: 0, time: "2天前" },
                    { name: "6月客服聊天记录_导出.xlsx", type: "excel", status: "提取中", count: 28, pending: 6, time: "1小时前" },
                    { name: "幼犬换粮项目_复盘文档.docx", type: "word", status: "已解析", count: 5, pending: 0, time: "1周前" },
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
                        <span className={"px-2.5 py-1 rounded-md text-[12px] font-bold " + (file.status === '已解析' ? 'bg-neutral-100 text-neutral-600 border border-neutral-200' : 'bg-blue-50 text-blue-700 border border-blue-200')}>
                          {file.status}
                        </span>
                        <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-600" />
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
                  <h3 className="text-[16px] font-bold text-neutral-900">补齐画像</h3>
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
                    <h4 className="text-[14px] font-bold text-rose-800">发现 3 项关键画像缺失</h4>
                    <p className="text-[12px] text-rose-600 mt-1">这些信息的缺失正在影响当前的运营动作，建议优先补齐。</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "KOS 店长号人设", desc: "缺乏人设背景，导致员工号内容生成时口吻不一致。", type: "merchant" },
                    { title: "私域承接话术", desc: "高意向客户进粉后，缺乏标准话术承接流转。", type: "reply" },
                    { title: "真实客户常见反馈", desc: "未能覆盖新手养宠用户的最新顾虑。", type: "customer" }
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
                      <span className="font-bold text-neutral-700">{selectedSourceFile.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Eye size={16} /> 预览原文件
                  </button>
                  <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Download size={16} /> 下载本地
                  </button>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[14px] font-bold text-neutral-900">AI 提取的记忆条目 ({selectedSourceFile.count})</h5>
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
                      <label className="text-[11px] font-bold text-neutral-400 mb-2 block">适用范围 (用逗号分隔)</label>
                      <input
                        type="text"
                        value={editedMemory?.applicableScope.join(", ") || ""}
                        onChange={(e) => setEditedMemory(prev => prev ? { ...prev, applicableScope: e.target.value.split(",").map(s => s.trim()) } : null)}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 mb-2 block">用于业务动作 (用逗号分隔)</label>
                      <input
                        type="text"
                        value={editedMemory?.usableFor.join(", ") || ""}
                        onChange={(e) => setEditedMemory(prev => prev ? { ...prev, usableFor: e.target.value.split(",").map(s => s.trim()) } : null)}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[13px] text-neutral-900 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                ) : isMerging ? (
                  <div className="space-y-4">
                    <div className="text-[14px] font-bold text-neutral-900">选择要合并的记忆条目</div>
                    <p className="text-[12px] text-neutral-500 mb-4">将当前记忆与另一条记忆合并，合并后保留当前记忆的更新时间与来源，并融合业务适用范围。</p>
                    
                    <div className="relative mb-4">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input type="text" placeholder="搜索相关记忆..." className="w-full pl-8 pr-4 py-2 text-[13px] bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400" />
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                      {MOCK_MEMORIES.filter(m => m.id !== selectedMemory.id).map(m => (
                        <div key={m.id} className="p-3 border border-neutral-200 rounded-lg hover:border-primary-400 cursor-pointer transition-colors bg-white group flex items-start gap-3 shadow-sm">
                          <div className="mt-0.5 text-neutral-300 group-hover:text-primary-500">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <div className="text-[13px] text-neutral-900 font-medium mb-1 line-clamp-2">{m.content}</div>
                            <div className="text-[11px] text-neutral-400">{[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === m.category)?.label} · {m.subCategory}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedMemory.status === '待确认' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-amber-600" />
                          <span className="font-bold text-[13px] text-amber-800">AI 从资料/记录中提取的新发现</span>
                        </div>
                        <p className="text-[12px] text-amber-700 leading-relaxed mb-3">
                          AI 整理发现：“{selectedMemory.content}”
                          <br />建议归类为：<span className="font-bold">{[...CATEGORIES, ...CUSTOM_COLLECTIONS].find(c => c.id === selectedMemory.category)?.label} / {selectedMemory.subCategory}</span>
                        </p>
                        <div className="flex gap-2">
                           <button onClick={() => setSelectedMemory({...selectedMemory, status: '已确认'})} className="px-3 py-1.5 bg-amber-600 text-white text-[12px] font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm">确认写入</button>
                           <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 text-[12px] font-bold rounded-lg hover:bg-amber-100 transition-colors shadow-sm">修改后写入</button>
                           <button onClick={() => setSelectedMemory(null)} className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">忽略</button>
                        </div>
                      </div>
                    )}
                    
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

                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 mb-2">适用范围</div>
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
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-[12px] text-neutral-500">
                        <span className="flex items-center gap-1.5"><Database size={14} /> 来源: {selectedMemory.source}</span>
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
                    <button onClick={() => { setSelectedMemory(editedMemory); setIsEditing(false); }} className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                      保存修改
                    </button>
                  </>
                ) : isMerging ? (
                  <>
                    <button onClick={() => setIsMerging(false)} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                      取消
                    </button>
                    <button onClick={() => setIsMerging(false)} className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
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
                          <CheckCircle2 size={14} /> 转为商家记忆
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
