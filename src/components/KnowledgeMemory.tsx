import React, { useState } from "react";
import {
  Brain,
  MessageCircle,
  ShieldCheck,
  Zap,
  Search,
  Upload,
  CheckCircle2,
  ChevronRight,
  Database,
  Users,
  Image as ImageIcon,
  Plus,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Clock,
  Settings,
  History,
  Info,
  Activity,
  AlertCircle,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface KnowledgeMemoryProps {
  activeProject: any;
}

const SPACES = [
  { id: 'merchant', label: '商家记忆', desc: '只服务当前商家，优先级高于团队经验和行业知识。' },
  { id: 'personal', label: '我的打法', desc: '个人的通用运营经验，跨商家复用。' },
  { id: 'team', label: '团队经验', desc: '团队共享的最佳实践与排坑指南。' },
  { id: 'industry', label: '行业知识', desc: '宠物行业的通用知识与大盘数据。' },
];

const MODULES = [
  {
    id: 'facts', title: '商家事实', icon: ShieldCheck, color: 'blue',
    desc: '品牌、产品、价格、活动、禁用表达。',
    stats: { total: 124, highConf: 108, pending: 5, recent: 24, gaps: 2 },
    examples: [
      { title: '禁用医疗化表达', meta: '规则｜客户确认｜适用：笔记/评论/私信/企微', tags: ['客户确认', '高可信', '禁止自动回复'], tagColors: ['bg-emerald-50 text-emerald-700', 'bg-indigo-50 text-indigo-700', 'bg-rose-50 text-rose-700'], refs: 12 },
      { title: '618 优惠底价', meta: '事实｜文档提取｜适用：私信/企微', tags: ['需人工确认', '即将过期'], tagColors: ['bg-amber-50 text-amber-700', 'bg-orange-50 text-orange-700'], refs: 4 }
    ]
  },
  {
    id: 'audience', title: '客群图谱', icon: Users, color: 'rose',
    desc: '目标客户、痛点、常见问题、购买顾虑、情绪反馈。',
    stats: { total: 86, highConf: 62, pending: 12, recent: 45, gaps: 4 },
    examples: [
      { title: '新手养狗人群痛点', meta: '画像｜AI 推断｜适用：笔记/内容审核', tags: ['已同步 Skill', '高可信'], tagColors: ['bg-purple-50 text-purple-700', 'bg-indigo-50 text-indigo-700'], refs: 28 }
    ]
  },
  {
    id: 'rules', title: '内容规则', icon: Zap, color: 'purple',
    desc: '标题、口吻、图文规范、自然流/投流差异、客户审核偏好。',
    stats: { total: 54, highConf: 40, pending: 8, recent: 120, gaps: 1 },
    examples: [
      { title: '首图必须带大字报', meta: '规则｜团队经验｜适用：笔记', tags: ['高可信'], tagColors: ['bg-indigo-50 text-indigo-700'], refs: 86 }
    ]
  },
  {
    id: 'reply', title: '话术回复', icon: MessageCircle, color: 'emerald',
    desc: '评论、私信、企微、客服 FAQ、高意向跟进。',
    stats: { total: 210, highConf: 180, pending: 15, recent: 350, gaps: 8 },
    examples: [
      { title: '幼犬软便怎么回复', meta: '话术｜私信沉淀｜适用：私信/企微', tags: ['需人工确认'], tagColors: ['bg-amber-50 text-amber-700'], refs: 0 }
    ]
  },
  {
    id: 'experience', title: '运营经验', icon: Brain, color: 'amber',
    desc: '爆款复盘、失败案例、素材偏好、账号适配、Skill 沉淀。',
    stats: { total: 32, highConf: 28, pending: 2, recent: 18, gaps: 0 },
    examples: [
      { title: '换粮避坑打法复盘', meta: '经验｜项目复盘｜适用：操盘建议', tags: ['高可信'], tagColors: ['bg-indigo-50 text-indigo-700'], refs: 5 }
    ]
  }
];

export const KnowledgeMemory: React.FC<KnowledgeMemoryProps> = ({
  activeProject,
}) => {
  const [activeSpace, setActiveSpace] = useState('merchant');
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const currentSpace = SPACES.find(s => s.id === activeSpace);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 relative">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Brain size={18} />
            </div>
            <h2 className="text-[16px] font-bold tracking-tight text-neutral-900">
              知识与记忆
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
          {SPACES.map(space => (
            <button
              key={space.id}
              onClick={() => setActiveSpace(space.id)}
              className={`px-4 py-1.5 text-[13px] font-bold rounded-md transition-all ${
                activeSpace === space.id 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {space.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setActiveDrawer('import_data')} className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Upload size={14} />
            导入资料
          </button>
          <button onClick={() => setActiveDrawer('memory_diagnosis')} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={14} />
            补齐关键记忆
          </button>
        </div>
      </div>

      <div className="bg-indigo-50/50 border-b border-indigo-100 px-8 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-[12px] text-indigo-800 font-medium">
          <Info size={14} className="text-indigo-500" />
          {currentSpace?.desc}
        </div>
        <button onClick={() => setActiveDrawer('citation_audit')} className="text-[12px] font-bold text-neutral-500 hover:text-neutral-700 flex items-center gap-1">
          <History size={14} /> 最近调用
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Layer 1: AI Memory Diagnosis */}
          <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="shrink-0 w-48 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-amber-500" />
                <h3 className="text-[15px] font-bold text-neutral-900">AI 记忆诊断</h3>
              </div>
              <p className="text-[13px] text-neutral-500">当前最影响运营的 3 个记忆缺口</p>
              
              <div className="mt-6 flex flex-col gap-2">
                <button onClick={() => setActiveDrawer('memory_diagnosis')} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold rounded-xl shadow-sm transition-colors">
                  补齐关键记忆
                </button>
                <button className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[13px] font-bold rounded-xl transition-colors">
                  问记忆
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                <div className="text-[14px] font-bold text-amber-900 mb-2">缺幼犬软便 FAQ</div>
                <div className="text-[12px] text-amber-700/80 leading-relaxed">
                  <span className="font-bold text-amber-800">影响：</span>私信自动回复、评论回复、换粮内容生成
                </div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                <div className="text-[14px] font-bold text-amber-900 mb-2">缺夏季活动话术</div>
                <div className="text-[12px] text-amber-700/80 leading-relaxed">
                  <span className="font-bold text-amber-800">影响：</span>企微转化、评论引导、客户审核
                </div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                <div className="text-[14px] font-bold text-amber-900 mb-2">缺客户审核偏好</div>
                <div className="text-[12px] text-amber-700/80 leading-relaxed">
                  <span className="font-bold text-amber-800">影响：</span>内容出稿通过率、AI 改稿方向
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input 
              type="text" 
              placeholder="问记忆，例如：幼犬软便怎么回复？这个商家有哪些禁用表达？" 
              className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl text-[14px] shadow-sm focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Main Body: 5 Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {MODULES.map(mod => {
              const Icon = mod.icon;
              return (
                <div key={mod.id} className="bg-white border border-neutral-200 rounded-[20px] p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${mod.color}-50 text-${mod.color}-600`}>
                      <Icon size={16} />
                    </div>
                    <h3 className="text-[16px] font-bold text-neutral-900">{mod.title}</h3>
                  </div>
                  <p className="text-[12px] text-neutral-500 mb-4 h-8">{mod.desc}</p>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-neutral-50 p-2 rounded-lg text-center">
                      <div className="text-[16px] font-bold text-neutral-900">{mod.stats.total}</div>
                      <div className="text-[10px] text-neutral-500">总量</div>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg text-center">
                      <div className="text-[16px] font-bold text-emerald-700">{mod.stats.highConf}</div>
                      <div className="text-[10px] text-emerald-600">高可信</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg text-center">
                      <div className="text-[16px] font-bold text-amber-700">{mod.stats.pending}</div>
                      <div className="text-[10px] text-amber-600">待确认</div>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-lg text-center relative">
                      {mod.stats.gaps > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />}
                      <div className="text-[16px] font-bold text-indigo-700">{mod.stats.gaps}</div>
                      <div className="text-[10px] text-indigo-600">缺口</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 mb-4">
                    {mod.examples.map((ex, i) => (
                      <div key={i} onClick={() => setActiveDrawer('memory_detail')} className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[13px] font-bold text-neutral-900 truncate pr-2">{ex.title}</h4>
                          <span className="text-[11px] text-neutral-400 shrink-0">引用 {ex.refs}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mb-2 truncate">{ex.meta}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {ex.tags.map((tag, j) => (
                            <span key={j} className={`px-1.5 py-0.5 rounded text-[10px] font-bold border border-current/10 ${ex.tagColors[j]}`}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full py-2 bg-neutral-50 text-neutral-600 text-[12px] font-bold rounded-lg hover:bg-neutral-100 transition-colors">
                    查看全部 {mod.stats.total} 条
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-20"
              onClick={() => setActiveDrawer(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute right-0 top-0 bottom-0 bg-white border-l border-neutral-200 z-30 shadow-2xl flex flex-col ${
                activeDrawer === 'memory_diagnosis' || activeDrawer === 'import_data' || activeDrawer === 'citation_audit' ? 'w-[800px]' : 'w-[480px]'
              }`}
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-white">
                <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                  {activeDrawer === 'import_data' && <><Upload size={18} className="text-indigo-500" /> 导入与入库审核</>}
                  {activeDrawer === 'memory_detail' && <><Brain size={18} className="text-purple-500" /> 记忆详情</>}
                  {activeDrawer === 'memory_diagnosis' && <><AlertTriangle size={18} className="text-amber-500" /> 记忆诊断与补齐</>}
                  {activeDrawer === 'citation_audit' && <><History size={18} className="text-neutral-500" /> 调用审计</>}
                </h3>
                <button onClick={() => setActiveDrawer(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#fafafa]">
                {/* 1. Import Data & Audit */}
                {activeDrawer === 'import_data' && (
                  <div className="p-8 space-y-8">
                    <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm">
                       <h4 className="text-[16px] font-bold text-neutral-900 mb-4">导入资料</h4>
                       <div className="grid grid-cols-4 gap-4 mb-6">
                         {[
                           { icon: FileText, label: '文档 PDF/Word', color: 'blue' },
                           { icon: LinkIcon, label: '网页链接', color: 'emerald' },
                           { icon: MessageSquare, label: '聊天记录', color: 'purple' },
                           { icon: Database, label: '表格数据', color: 'amber' }
                         ].map((item, i) => (
                           <button key={i} className={`p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-${item.color}-50 hover:border-${item.color}-200 flex flex-col items-center justify-center gap-2 transition-colors`}>
                             <item.icon size={24} className={`text-${item.color}-500`} />
                             <span className="text-[13px] font-bold text-neutral-700">{item.label}</span>
                           </button>
                         ))}
                       </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[18px] font-bold text-neutral-900">AI 从「2024幼犬喂养指南.pdf」提取 15 条记忆</h4>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[12px] font-bold rounded-lg">商家事实 5</span>
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[12px] font-bold rounded-lg">内容规则 3</span>
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[12px] font-bold rounded-lg">话术回复 4</span>
                          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[12px] font-bold rounded-lg">运营经验 2</span>
                          <span className="px-2 py-1 bg-rose-50 text-rose-700 text-[12px] font-bold rounded-lg">待确认 1</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="text-[15px] font-bold text-neutral-900 mb-2">禁用医疗化表达</div>
                                <div className="text-[13px] text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                  <span className="font-bold text-neutral-400 mr-2">提取内容:</span>
                                  不能使用“治疗软便、根治肠胃病、包治挑食”等表达。
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-[13px]">
                               <div>
                                 <div className="text-neutral-500 mb-1">AI 建议分类</div>
                                 <select className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium outline-none">
                                   <option>内容规则</option>
                                 </select>
                               </div>
                               <div>
                                 <div className="text-neutral-500 mb-1">来源分级</div>
                                 <select className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium outline-none">
                                   <option>文档提取 (中可信)</option>
                                   <option>客户确认 (最高)</option>
                                 </select>
                               </div>
                               <div>
                                 <div className="text-neutral-500 mb-1">自动回复安全</div>
                                 <select className="w-full p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-medium outline-none">
                                   <option>需人工确认</option>
                                   <option>禁止自动回复</option>
                                 </select>
                               </div>
                               <div>
                                 <div className="text-neutral-500 mb-1">有效期</div>
                                 <select className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium outline-none">
                                   <option>长期有效</option>
                                 </select>
                               </div>
                            </div>

                            <div className="flex gap-2 border-t border-neutral-100 pt-4">
                              <button className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800">确认入库</button>
                              <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50">修改</button>
                              <button className="px-4 py-2 bg-white border border-neutral-200 text-amber-600 text-[13px] font-bold rounded-lg hover:bg-amber-50">设为待客户确认</button>
                              <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-500 text-[13px] font-bold rounded-lg hover:bg-neutral-50 ml-auto">丢弃</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Memory Detail */}
                {activeDrawer === 'memory_detail' && (
                  <div className="p-8 space-y-6">
                    <div>
                      <h2 className="text-[24px] font-bold text-neutral-900 mb-4">禁用医疗化表达</h2>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[14px] text-neutral-800 leading-relaxed shadow-inner">
                        不能使用“治疗软便、根治肠胃病、包治挑食”等表达。
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500">类型</span>
                          <span className="font-bold text-neutral-900">内容规则</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500">来源</span>
                          <span className="font-bold text-neutral-900">客户确认</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500">可信度</span>
                          <span className="font-bold text-emerald-600">高</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500">自动回复安全</span>
                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">需人工确认</span>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500">权限</span>
                          <span className="font-bold text-neutral-900">当前商家可用</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500">有效期</span>
                          <span className="font-bold text-neutral-900">长期</span>
                        </div>
                        <div className="flex flex-col gap-1 text-[13px] pt-1">
                          <span className="text-neutral-500 mb-1">适用场景</span>
                          <div className="flex flex-wrap gap-1">
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-medium">笔记</span>
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-medium">评论</span>
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-medium">私信</span>
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-medium">企微</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm space-y-3">
                       <h4 className="text-[14px] font-bold text-neutral-900 mb-2">关联信息</h4>
                       <div className="flex justify-between items-center text-[13px] p-2 bg-neutral-50 rounded-lg">
                          <span className="text-neutral-500">关联项目</span>
                          <span className="font-medium text-neutral-900">幼犬换粮、肠胃敏感</span>
                       </div>
                       <div className="flex justify-between items-center text-[13px] p-2 bg-neutral-50 rounded-lg">
                          <span className="text-neutral-500">最近引用</span>
                          <span className="font-medium text-neutral-900">12 次</span>
                       </div>
                       <div className="flex justify-between items-center text-[13px] p-2 bg-neutral-50 rounded-lg">
                          <span className="text-neutral-500">同步状态</span>
                          <span className="font-medium text-purple-600">已同步内容 Skill</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200">
                      <button className="py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 shadow-sm">修改记忆</button>
                      <button className="py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50 shadow-sm">限制使用场景</button>
                      <button className="py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50 shadow-sm">调整自动回复等级</button>
                      <button className="py-2.5 bg-purple-50 border border-purple-200 text-purple-700 text-[13px] font-bold rounded-xl hover:bg-purple-100 shadow-sm">同步到 Skill</button>
                      <button className="py-2.5 bg-white border border-neutral-200 text-neutral-500 text-[13px] font-bold rounded-xl hover:bg-neutral-50 shadow-sm col-span-2">查看引用记录</button>
                    </div>
                  </div>
                )}

                {/* 3. Memory Diagnosis */}
                {activeDrawer === 'memory_diagnosis' && (
                  <div className="p-8 space-y-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-[13px] text-amber-900 leading-relaxed">
                        <strong className="font-bold">AI 已根据当前项目、自动回复、内容审核和历史反馈识别关键缺口。</strong> 把“缺知识”变成可执行任务，优先补齐影响面大的记忆。
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[16px] font-bold text-neutral-900">亟需补齐</h4>
                      
                      <div className="bg-white border border-rose-200 rounded-[20px] p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-bl-lg">优先级 高</div>
                        <h5 className="text-[18px] font-bold text-neutral-900 mb-4">缺幼犬软便 FAQ</h5>
                        
                        <div className="space-y-3 mb-6">
                          <div className="text-[13px]">
                            <span className="font-bold text-neutral-500 w-16 inline-block">影响：</span>
                            <span className="font-medium text-neutral-900">私信自动回复 / 评论回复 / 换粮内容生成 / 企微客服话术</span>
                          </div>
                          <div className="text-[13px]">
                            <span className="font-bold text-neutral-500 w-16 inline-block">风险：</span>
                            <span className="font-medium text-rose-600">当前 AI 容易回答过泛，且有医疗化表达风险。</span>
                          </div>
                          <div className="text-[13px]">
                            <span className="font-bold text-neutral-500 w-16 inline-block">状态：</span>
                            <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[12px] font-bold border border-neutral-200">待补齐</span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-neutral-100">
                          <div className="text-[12px] font-bold text-neutral-500">推荐补齐方式</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-700 hover:bg-neutral-100 flex flex-col items-center gap-1.5 transition-colors">
                              <FileText size={16} /> 从资料提取
                            </button>
                            <button className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-[12px] font-bold text-indigo-700 hover:bg-indigo-100 flex flex-col items-center gap-1.5 transition-colors">
                              <MessageSquare size={16} /> 发给客户补充
                            </button>
                            <button className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[12px] font-bold text-purple-700 hover:bg-purple-100 flex flex-col items-center gap-1.5 transition-colors text-center">
                              <Brain size={16} /> 让 AI 根据历史记录草拟
                            </button>
                            <button className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-700 hover:bg-neutral-100 flex flex-col items-center gap-1.5 transition-colors">
                              <Database size={16} /> 从团队经验复用
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 4. Citation Audit */}
                {activeDrawer === 'citation_audit' && (
                  <div className="p-8 space-y-6">
                    <div className="flex gap-2 border-b border-neutral-200 pb-4">
                      {['全部场景', '内容生成', '私信回复', '内容审核', '操盘建议'].map((tab, i) => (
                        <button key={i} className={`px-4 py-2 text-[13px] font-bold rounded-lg ${i === 0 ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-100">
                            <div className="flex items-center gap-2">
                              {i === 1 ? <ShieldCheck size={16} className="text-rose-500"/> : <MessageCircle size={16} className="text-indigo-500"/>}
                              <span className="text-[14px] font-bold text-neutral-900">{i === 1 ? '内容审核拦截' : '私信自动回复'}</span>
                            </div>
                            <span className="text-[12px] text-neutral-400">10分钟前</span>
                          </div>
                          
                          <div className="space-y-3 text-[13px]">
                            <div className="flex">
                              <span className="w-20 shrink-0 font-bold text-neutral-500">使用记忆：</span>
                              <span className="font-medium text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">禁用医疗化表达</span>
                            </div>
                            <div className="flex">
                              <span className="w-20 shrink-0 font-bold text-neutral-500">输出结果：</span>
                              <span className={`font-medium ${i === 1 ? 'text-rose-600' : 'text-neutral-700'}`}>
                                {i === 1 ? '拦截失败：笔记中包含“改善软便”，存在风险。' : '“亲亲，我们这款狗粮是无谷低敏配方哦...”'}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="w-20 shrink-0 font-bold text-neutral-500">用户反馈：</span>
                              <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
                                采纳 / 未修改
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
