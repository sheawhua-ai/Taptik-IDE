import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Clock, Target, Users, Calendar, ArrowRight, Check, X,
  Edit2, AlertTriangle, Plus, Trash2, ChevronDown, ChevronRight, MessageSquare, HelpCircle,
  FileText, Image as ImageIcon
} from "lucide-react";

export interface CreateProjectWorkstationProps {
  onClose: () => void;
  onCreate: (projectData: any) => void;
}

export function CreateProjectWorkstation({ onClose, onCreate }: CreateProjectWorkstationProps) {
  const [mode, setMode] = useState<'input' | 'generating' | 'review'>('input');
  const [intent, setIntent] = useState("");
  
  // Interactive State
  const [projectData, setProjectData] = useState({
    name: "幼犬换粮搜索卡位第一批",
    goal: "针对幼犬换粮搜索流量，铺设高质量真实评测内容",
    prepStart: "2023-10-24",
    reviewDate: "2023-10-26",
    totalPosts: 4,
    budget: 1000,
    accounts: [
      { id: 1, type: "店长号", name: "店长号A", posts: 2, method: "主设备直接发布", publisher: "张三" },
      { id: 2, type: "KOC", name: "待认领KOC", posts: 2, method: "代发", publisher: "李四" }
    ],
    missingItems: [
      { id: 'm1', text: '确认手机发布人', resolved: false },
      { id: 'm2', text: '1组真实换粮素材', resolved: false }
    ],
    strategyBasis: "依据竞品词包数据，当前【幼犬换粮】搜索结果页前10名有4个空缺位置，竞争压力小，适合用KOC与自营号矩阵组合抢位。",
    initialContent: [
      { id: 'c1', title: '为什么幼犬换粮容易拉肚子？', type: '图文' },
      { id: 'c2', title: '我家金毛3个月换粮实录', type: '图文' }
    ]
  });

  // UI States
  const [editingDate, setEditingDate] = useState<'prep' | 'review' | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'adjust' | 'diff'>('adjust');
  const [chatInput, setChatInput] = useState('');
  const [expandedSections, setExpandedSections] = useState({ basis: true, content: true });

  const assignedPosts = projectData.accounts.reduce((sum, acc) => sum + acc.posts, 0);
  const isPostMismatch = assignedPosts !== projectData.totalPosts;

  const handleGenerate = () => {
    setMode('generating');
    setTimeout(() => {
      setMode('review');
    }, 2000);
  };

  const handleCreate = () => {
    const newProject = {
      id: `new-${Date.now()}`,
      name: projectData.name,
      status: "筹备",
      nextAction: "提交首批草稿",
      deadline: projectData.reviewDate,
      owner: "当前用户",
      avatar: "https://i.pravatar.cc/150?u=current",
      progress: 0,
      tags: ["图文", "搜索卡位"],
      priority: "high",
      type: "routine",
      risk: "无风险",
      budget: `¥${projectData.budget}`,
      roi: "--",
      spent: "¥0",
      contentStrategy: "信息差抓取",
      targetAudience: "精准",
      recommendedAction: "none",
      pendingCount: projectData.missingItems.filter(i => !i.resolved).length,
      period: `${projectData.prepStart} - ${projectData.reviewDate}`,
      aiJudgment: "项目草案已确认，正在进行首批验证单元的筹备工作。",
      recentChanges: []
    };
    onCreate(newProject);
  };

  const updateAccount = (id: number, field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc)
    }));
  };

  const addAccount = () => {
    setProjectData(prev => ({
      ...prev,
      accounts: [...prev.accounts, { id: Date.now(), type: "新账号", name: "未选择", posts: 1, method: "主设备直接发布", publisher: "未定" }]
    }));
  };

  const removeAccount = (id: number) => {
    setProjectData(prev => ({
      ...prev,
      accounts: prev.accounts.filter(acc => acc.id !== id)
    }));
  };

  const toggleMissingItem = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      missingItems: prev.missingItems.map(item => item.id === id ? { ...item, resolved: !item.resolved } : item)
    }));
  };

  const handleSimulateAdjustment = () => {
    setDrawerMode('diff');
  };

  const acceptAdjustment = () => {
    setProjectData(prev => ({
      ...prev,
      totalPosts: 3,
      budget: 800,
      accounts: prev.accounts.map(acc => acc.id === 1 ? { ...acc, posts: 1 } : acc)
    }));
    setDrawerOpen(false);
    setDrawerMode('adjust');
  };

  const renderInput = () => (
    <div className="flex-1 flex flex-col justify-center items-center p-8 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white pointer-events-none opacity-60"></div>
      
      <div className="w-full max-w-3xl z-10 flex flex-col items-center">
         <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
           <Sparkles size={32} />
         </div>
         <h2 className="text-[32px] font-bold text-neutral-900 tracking-tight mb-4">你好，今天想开启什么项目？</h2>
         <p className="text-[16px] text-neutral-500 font-medium mb-10 text-center max-w-xl">
           直接描述你的运营意图。比如目标人群、内容方向或具体账号安排，AI 会自动为你生成包含时间线、账号分配和任务排期的完整方案。
         </p>

         <div className="w-full bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-neutral-200 overflow-hidden focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-400 transition-all">
            <textarea 
               value={intent}
               onChange={(e) => setIntent(e.target.value)}
               placeholder="输入意图，例如：要做一波幼犬换粮搜索卡位，首批上4篇图文，用2个店长号和2个KOC号..."
               className="w-full h-40 bg-transparent resize-none outline-none text-[16px] text-neutral-800 placeholder:text-neutral-400 p-6 font-medium"
            />
            <div className="flex justify-between items-center p-4 bg-neutral-50/50 border-t border-neutral-100">
               <div className="flex gap-2 overflow-x-auto">
                 <button onClick={() => setIntent("幼犬换粮搜索卡位，首批上4篇图文，用2个店长号和2个KOC号，预算控制在1500内")} className="text-[13px] font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors whitespace-nowrap">🔥 幼犬换粮搜索卡位</button>
                 <button onClick={() => setIntent("大促蓄水池建设，调用所有蓝V号发一遍种草清单")} className="text-[13px] font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 px-4 py-2 rounded-xl transition-colors whitespace-nowrap">📦 大促蓄水铺量</button>
               </div>
               <button 
                 onClick={handleGenerate} 
                 disabled={!intent.trim()}
                 className={`px-8 py-3 rounded-xl text-[15px] font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 ${intent.trim() ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)]' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
               >
                 生成项目方案 <ArrowRight size={16}/>
               </button>
            </div>
         </div>
      </div>
    </div>
  );

  const renderGenerating = () => (
    <div className="flex-1 flex flex-col justify-center items-center bg-white relative overflow-hidden">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-50 via-white to-white pointer-events-none opacity-40"></div>
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
         className="w-24 h-24 rounded-full border-4 border-neutral-100 border-t-primary-500 mb-8"
       />
       <h3 className="text-[20px] font-bold text-neutral-900 mb-3">AI 正在编排项目方案</h3>
       <div className="space-y-3 w-64">
         <div className="flex items-center gap-3 text-neutral-500 text-[14px] font-medium"><Check size={16} className="text-emerald-500"/> 分析意图与目标</div>
         <div className="flex items-center gap-3 text-neutral-500 text-[14px] font-medium"><Check size={16} className="text-emerald-500"/> 匹配闲置账号资源</div>
         <div className="flex items-center gap-3 text-neutral-900 text-[14px] font-bold"><motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"/> 生成时间线与待办</div>
       </div>
    </div>
  );

  const renderReview = () => (
    <div className="flex-1 flex bg-neutral-50 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto py-10 px-8">
           
           {/* Header Info */}
           <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="text-primary-600 font-bold text-[13px] flex items-center gap-2 mb-2">
                  <Sparkles size={14}/> AI 生成方案已就绪
                </div>
                <h1 className="text-[28px] font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
                  <input 
                    type="text" 
                    value={projectData.name} 
                    onChange={e => setProjectData({...projectData, name: e.target.value})}
                    className="bg-transparent border-none outline-none hover:bg-neutral-200/50 focus:bg-white focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1 -ml-2 transition-all"
                  />
                  <Edit2 size={16} className="text-neutral-400"/>
                </h1>
                <p className="text-neutral-500 font-medium text-[15px] mt-2 px-1">{projectData.goal}</p>
              </div>
              <button 
                onClick={() => { setDrawerOpen(true); setDrawerMode('adjust'); }}
                className="bg-white border border-neutral-200 shadow-sm hover:shadow text-neutral-700 px-4 py-2 rounded-xl text-[14px] font-bold flex items-center gap-2 transition-all"
              >
                <MessageSquare size={16} className="text-primary-600"/> 调整方案
              </button>
           </div>

           {/* Cards Container */}
           <div className="space-y-6">
              
              {/* Timeline & Basic Settings */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                 <h2 className="text-[16px] font-bold text-neutral-900 mb-6 flex items-center gap-2">
                   <Calendar size={18} className="text-neutral-400"/> 时间线与目标
                 </h2>
                 <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-[13px] text-neutral-500 font-bold mb-2">筹备开始日</div>
                      {editingDate === 'prep' ? (
                        <input 
                          type="date" 
                          value={projectData.prepStart}
                          onChange={e => setProjectData({...projectData, prepStart: e.target.value})}
                          onBlur={() => setEditingDate(null)}
                          autoFocus
                          className="border border-neutral-300 rounded-lg px-3 py-1.5 text-[15px] font-bold w-full"
                        />
                      ) : (
                        <div 
                          className="text-[16px] font-bold text-neutral-900 cursor-pointer hover:bg-neutral-50 p-2 -ml-2 rounded-lg transition-colors flex items-center gap-2 group"
                          onClick={() => setEditingDate('prep')}
                        >
                          {projectData.prepStart} <Edit2 size={14} className="text-neutral-300 group-hover:text-neutral-500"/>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] text-neutral-500 font-bold mb-2">初审目标日</div>
                      {editingDate === 'review' ? (
                        <input 
                          type="date" 
                          value={projectData.reviewDate}
                          onChange={e => setProjectData({...projectData, reviewDate: e.target.value})}
                          onBlur={() => setEditingDate(null)}
                          autoFocus
                          className="border border-neutral-300 rounded-lg px-3 py-1.5 text-[15px] font-bold w-full"
                        />
                      ) : (
                        <div 
                          className="text-[16px] font-bold text-neutral-900 cursor-pointer hover:bg-neutral-50 p-2 -ml-2 rounded-lg transition-colors flex items-center gap-2 group"
                          onClick={() => setEditingDate('review')}
                        >
                          {projectData.reviewDate} <Edit2 size={14} className="text-neutral-300 group-hover:text-neutral-500"/>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] text-neutral-500 font-bold mb-2">项目预算</div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-neutral-500 font-medium">¥</span>
                        <input 
                          type="number" 
                          value={projectData.budget}
                          onChange={e => setProjectData({...projectData, budget: Number(e.target.value)})}
                          className="bg-transparent border-none outline-none font-bold text-[16px] text-neutral-900 w-24 focus:bg-neutral-50 rounded px-1"
                        />
                      </div>
                    </div>
                 </div>
              </div>

              {/* Strategy Basis (Collapsible) */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                 <div 
                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
                   onClick={() => setExpandedSections(prev => ({...prev, basis: !prev.basis}))}
                 >
                    <h2 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                      <HelpCircle size={16} className="text-primary-500"/> 方案依据
                    </h2>
                    {expandedSections.basis ? <ChevronDown size={18} className="text-neutral-400"/> : <ChevronRight size={18} className="text-neutral-400"/>}
                 </div>
                 <AnimatePresence>
                   {expandedSections.basis && (
                     <motion.div 
                       initial={{ height: 0 }} 
                       animate={{ height: "auto" }} 
                       exit={{ height: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="p-5 pt-0 text-[14px] text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                         {projectData.strategyBasis}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Accounts & Distribution */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/30">
                    <div>
                      <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                        <Users size={18} className="text-neutral-400"/> 账号与发文分配
                      </h2>
                      <div className="text-[13px] text-neutral-500 mt-1">计划总发文: {projectData.totalPosts} 篇</div>
                    </div>
                    {isPostMismatch && (
                       <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2">
                         <AlertTriangle size={14}/> 
                         已分配 {assignedPosts} 篇，与计划 {projectData.totalPosts} 篇不符
                       </div>
                    )}
                 </div>
                 
                 <div className="p-0">
                    <table className="w-full text-left">
                       <thead className="bg-neutral-50 border-b border-neutral-200 text-[13px] text-neutral-500 font-bold">
                          <tr>
                             <th className="px-6 py-3 font-bold">账号类型</th>
                             <th className="px-6 py-3 font-bold">选用账号</th>
                             <th className="px-6 py-3 font-bold">发文量</th>
                             <th className="px-6 py-3 font-bold">发布方式</th>
                             <th className="px-6 py-3 font-bold">发布人</th>
                             <th className="px-6 py-3"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-100 text-[14px] text-neutral-900 font-medium">
                          {projectData.accounts.map(acc => (
                             <tr key={acc.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <select 
                                    value={acc.type}
                                    onChange={(e) => updateAccount(acc.id, 'type', e.target.value)}
                                    className="bg-transparent outline-none cursor-pointer"
                                  >
                                    <option value="店长号">店长号</option>
                                    <option value="KOC">KOC</option>
                                    <option value="蓝V">蓝V</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  <input 
                                    type="text" 
                                    value={acc.name}
                                    onChange={(e) => updateAccount(acc.id, 'name', e.target.value)}
                                    className="bg-transparent outline-none w-24 hover:bg-white px-1 py-0.5 rounded focus:ring-2 focus:ring-primary-500"
                                  />
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                  <button onClick={() => updateAccount(acc.id, 'posts', Math.max(0, acc.posts - 1))} className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">-</button>
                                  <span className="w-4 text-center font-bold">{acc.posts}</span>
                                  <button onClick={() => updateAccount(acc.id, 'posts', acc.posts + 1)} className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">+</button>
                                </td>
                                <td className="px-6 py-4 text-[13px]">
                                  <select 
                                    value={acc.method}
                                    onChange={(e) => updateAccount(acc.id, 'method', e.target.value)}
                                    className="bg-transparent outline-none cursor-pointer text-neutral-600"
                                  >
                                    <option value="主设备直接发布">主设备直接发布</option>
                                    <option value="代发">代发</option>
                                    <option value="扫码发布">扫码发布</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  <input 
                                    type="text" 
                                    value={acc.publisher}
                                    onChange={(e) => updateAccount(acc.id, 'publisher', e.target.value)}
                                    className="bg-transparent outline-none w-16 hover:bg-white px-1 py-0.5 rounded focus:ring-2 focus:ring-primary-500 text-neutral-600"
                                  />
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => removeAccount(acc.id)} className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
                                    <Trash2 size={16}/>
                                  </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                    <div className="p-4 border-t border-neutral-100">
                      <button onClick={addAccount} className="text-[13px] font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                        <Plus size={14}/> 添加账号
                      </button>
                    </div>
                 </div>
              </div>

              {/* Initial Content & Assets (Collapsible) */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                 <div 
                   className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
                   onClick={() => setExpandedSections(prev => ({...prev, content: !prev.content}))}
                 >
                    <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                      <FileText size={18} className="text-neutral-400"/> 首批内容规划
                    </h2>
                    {expandedSections.content ? <ChevronDown size={20} className="text-neutral-400"/> : <ChevronRight size={20} className="text-neutral-400"/>}
                 </div>
                 <AnimatePresence>
                   {expandedSections.content && (
                     <motion.div 
                       initial={{ height: 0 }} 
                       animate={{ height: "auto" }} 
                       exit={{ height: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="p-6 pt-0 border-t border-neutral-100 bg-neutral-50/30">
                         <div className="grid grid-cols-2 gap-4 mt-4">
                           {projectData.initialContent.map(item => (
                             <div key={item.id} className="bg-white border border-neutral-200 rounded-xl p-4 flex gap-3 shadow-sm">
                               <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                 <ImageIcon size={20}/>
                               </div>
                               <div>
                                 <div className="text-[14px] font-bold text-neutral-900 line-clamp-1">{item.title}</div>
                                 <div className="text-[12px] text-neutral-500 mt-1">{item.type} • 待生成草稿</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Pre-start Checklist */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                 <h2 className="text-[16px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                   <AlertTriangle size={18} className="text-red-500"/> 开工前缺失项
                 </h2>
                 <p className="text-[13px] text-neutral-500 mb-5">创建项目后，以下项将作为待办任务分配，或你现在可以直接处理补充。</p>
                 
                 <div className="space-y-3">
                   {projectData.missingItems.map(item => (
                     <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.resolved ? 'bg-emerald-50/50 border-emerald-100' : 'bg-neutral-50 border-neutral-200'}`}>
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleMissingItem(item.id)} className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${item.resolved ? 'bg-emerald-500 text-white' : 'border-2 border-neutral-300 text-transparent hover:border-emerald-500'}`}>
                            <Check size={14}/>
                          </button>
                          <span className={`text-[14px] font-bold ${item.resolved ? 'text-emerald-700 line-through opacity-70' : 'text-neutral-900'}`}>{item.text}</span>
                        </div>
                        {!item.resolved && (
                          <button onClick={() => toggleMissingItem(item.id)} className="text-[12px] font-bold text-neutral-700 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-100 shadow-sm">
                            现在补充
                          </button>
                        )}
                     </div>
                   ))}
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 440, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-neutral-200 bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.04)] flex flex-col z-20 shrink-0"
          >
             <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-2 font-bold text-[16px] text-neutral-900">
                  <Sparkles size={18} className="text-primary-500"/> 项目助手
                </div>
                <button onClick={() => setDrawerOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"><X size={18}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto bg-neutral-50/50 p-5 flex flex-col gap-5">
                {drawerMode === 'adjust' ? (
                  <>
                    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                       <p className="text-neutral-900 font-bold text-[14px] leading-relaxed mb-2">你想怎么调整方案？</p>
                       <p className="text-[13px] text-neutral-500 mb-4">可以直接用自然语言告诉我，例如：“把总量改成3篇，减少KOC的数量，预算压到800”。</p>
                       <textarea 
                         value={chatInput}
                         onChange={e => setChatInput(e.target.value)}
                         placeholder="输入你的要求..." 
                         className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[14px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 resize-none h-24 mb-3"
                       />
                       <button onClick={handleSimulateAdjustment} disabled={!chatInput.trim()} className="w-full py-2.5 bg-neutral-900 text-white rounded-xl font-bold text-[14px] hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                         提交要求
                       </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                       <p className="text-neutral-900 font-bold text-[14px] mb-4">我已根据你的要求调整方案，差异如下：</p>
                       
                       <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                             <span className="text-[13px] text-neutral-500 font-bold">总发文量</span>
                             <div className="flex items-center gap-2 text-[14px] font-bold">
                               <span className="text-neutral-400 line-through">4篇</span>
                               <ArrowRight size={14} className="text-neutral-400"/>
                               <span className="text-primary-600">3篇</span>
                             </div>
                          </div>
                          <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                             <span className="text-[13px] text-neutral-500 font-bold">项目预算</span>
                             <div className="flex items-center gap-2 text-[14px] font-bold">
                               <span className="text-neutral-400 line-through">¥1000</span>
                               <ArrowRight size={14} className="text-neutral-400"/>
                               <span className="text-primary-600">¥800</span>
                             </div>
                          </div>
                          <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                             <span className="text-[13px] text-neutral-500 font-bold">店长号A任务</span>
                             <div className="flex items-center gap-2 text-[14px] font-bold">
                               <span className="text-neutral-400 line-through">2篇</span>
                               <ArrowRight size={14} className="text-neutral-400"/>
                               <span className="text-primary-600">1篇</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex flex-col gap-2">
                         <button onClick={acceptAdjustment} className="py-2.5 bg-primary-600 text-white font-bold text-[14px] rounded-xl hover:bg-primary-700 transition-colors shadow-sm">接受并更新视图</button>
                         <button onClick={() => setDrawerMode('adjust')} className="py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[14px] rounded-xl hover:bg-neutral-50 transition-colors">取消修改</button>
                       </div>
                    </div>
                  </>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sticky Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-neutral-200/50 flex justify-between items-center px-8 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
         <div className="flex items-center gap-3">
           <button onClick={onClose} className="px-6 py-3 text-neutral-500 text-[14px] font-bold rounded-xl hover:bg-neutral-100 transition-colors">放弃</button>
           <button className="px-6 py-3 border border-neutral-200 text-neutral-700 text-[14px] font-bold rounded-xl hover:bg-neutral-50 transition-colors bg-white shadow-sm">保存为草稿</button>
         </div>
         
         <div className="flex flex-col items-end gap-1">
           <button 
             onClick={handleCreate}
             className="px-10 py-3.5 bg-neutral-900 text-white text-[15px] font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] flex items-center gap-2"
           >
             确认并创建项目 <ArrowRight size={16}/>
           </button>
           <span className="text-[12px] text-neutral-400 font-medium mt-1">创建后进入「筹备」状态，不会立即产生费用或外发任务</span>
         </div>
      </div>
    </div>
  );

  return mode === 'input' ? renderInput() : mode === 'generating' ? renderGenerating() : renderReview();
}
