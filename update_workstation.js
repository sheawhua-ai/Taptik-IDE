import fs from 'fs';

const content = `import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Sparkles, Target, Compass, ListTodo, AlertTriangle, 
  CheckCircle2, Info, ArrowRight, BrainCircuit, ShieldCheck,
  MessageSquare, FileText, ChevronRight, Save, History, Users, Database,
  Settings, ChevronDown, Plus
} from "lucide-react";

export interface CreateProjectWorkstationProps {
  onClose: () => void;
  onCreate: (project: any) => void;
}

export function CreateProjectWorkstation({ onClose, onCreate }: CreateProjectWorkstationProps) {
  const [step, setStep] = useState(1);
  const [aiState, setAiState] = useState<'initial' | 'processing' | 'draft_ready'>('initial');
  const [rightTab, setRightTab] = useState<'chat' | 'basis' | 'execution'>('chat');
  
  const [draft, setDraft] = useState({
    name: "验证换粮痛点与专业人设转化",
    problem: "换粮内容有收藏，但没有产生有效咨询",
    judge: "发布后7天内的收藏数、有效问题评论数，以及人工登记的咨询线索",
    limit: "暂无特殊限制，使用现有店长号"
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showParams, setShowParams] = useState(false);
  
  // AI Adjustment state
  const [showAdjustment, setShowAdjustment] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("存在未保存的修改，是否要保存为草案并关闭？")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleCreate = () => {
    const newProject = {
      id: \`new-\${Date.now()}\`,
      name: draft.name,
      status: "筹备",
      target: draft.problem,
      stage: "筹备中",
      blocker: "阻断项：缺少1组必要素材；无发布方式。待确认项：1个账号发布人等。",
      aiActionCard: null,
      recommendedAction: "none",
      pendingCount: 0,
      period: "未定",
      aiJudgment: "已根据策略生成内部草稿与待办任务，需要补充素材与发布人方能进入执行单元。",
      recentChanges: [],
      batches: []
    };
    onCreate(newProject);
  };

  return (
    <div className="w-full h-full bg-[#fcfcfc] flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-neutral-200 bg-white flex items-center justify-between px-6 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
           <button onClick={handleClose} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors">
             <X size={20}/>
           </button>
           <div className="flex items-center gap-3">
             <span className="text-[16px] font-bold text-neutral-900">新建项目工作台</span>
             {aiState !== 'initial' && (
               <span className="text-[12px] text-neutral-500 font-bold px-2.5 py-1 bg-neutral-100 rounded-md">检查点 {step} / 3</span>
             )}
             <span className="text-[12px] text-amber-600 font-bold px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-md">存在未保存修改</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-4 py-2 hover:bg-neutral-100 rounded-lg transition-colors">
             <Save size={16}/> 保存草案
           </button>
           <button onClick={handleClose} className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-4 py-2 hover:bg-neutral-100 rounded-lg transition-colors">
             退出
           </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Main */}
        <div className="flex-1 overflow-y-auto bg-[#fcfcfc] p-8 pb-32">
           
           {step === 1 && aiState === 'initial' && (
             <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-[28px] font-bold text-neutral-900 mb-8 tracking-tight">这轮运营，你最想解决什么？</h2>
               <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all">
                 <textarea 
                   rows={6}
                   placeholder="可以描述当前问题、已有想法、希望看到的变化或不能突破的限制。例如：换粮内容有收藏，但没有产生有效咨询，希望用现有店长号验证专业测评方向。"
                   className="w-full p-6 outline-none text-[15px] resize-none leading-relaxed text-neutral-800 placeholder:text-neutral-400 font-medium"
                 ></textarea>
                 <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto">
                    <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"><History size={14}/> @历史项目</button>
                    <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"><Users size={14}/> @账号</button>
                    <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"><Database size={14}/> @商家知识</button>
                    <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"><BrainCircuit size={14}/> @操盘手经验</button>
                    <div className="w-px h-4 bg-neutral-200 mx-1"></div>
                    <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"><Plus size={14}/> 添加资料</button>
                 </div>
               </div>
               <div className="mt-8 flex justify-end">
                 <button onClick={() => {
                   setAiState('processing');
                   setTimeout(() => setAiState('draft_ready'), 800);
                 }} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2">
                   <Sparkles size={18}/> 让AI整理项目意图
                 </button>
               </div>
             </div>
           )}

           {step === 1 && aiState === 'processing' && (
             <div className="max-w-2xl mx-auto mt-20 flex flex-col items-center justify-center text-neutral-400">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                 <Sparkles size={32} className="text-primary-500 mb-6"/>
               </motion.div>
               <p className="text-[14px] font-bold text-neutral-600">正在重构逻辑并提取关键信息...</p>
             </div>
           )}

           {step === 1 && aiState === 'draft_ready' && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
                 <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shadow-sm"><Target size={20}/></div>
                 <h3 className="text-[20px] font-bold text-neutral-900 tracking-tight">检查点 1：定义本轮问题</h3>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="block text-[13px] font-bold text-neutral-700 mb-2">项目名称</label>
                   <input type="text" value={draft.name} onChange={e=>setDraft({...draft, name: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-[14px] font-bold outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-[13px] font-bold text-neutral-700 mb-2">本轮要验证或改善什么</label>
                   <textarea rows={3} value={draft.problem} onChange={e=>setDraft({...draft, problem: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm resize-none font-medium"></textarea>
                 </div>
                 <div>
                   <label className="block text-[13px] font-bold text-neutral-700 mb-2">如何判断本轮值得继续</label>
                   <textarea rows={3} value={draft.judge} onChange={e=>setDraft({...draft, judge: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm resize-none font-medium"></textarea>
                 </div>
                 <div>
                   <label className="block text-[13px] font-bold text-neutral-700 mb-2">不能突破的限制</label>
                   <input type="text" value={draft.limit} onChange={e=>setDraft({...draft, limit: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm font-medium" />
                 </div>
               </div>
             </div>
           )}

           {step === 2 && (
             <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm"><Compass size={20}/></div>
                    <h3 className="text-[20px] font-bold text-neutral-900 tracking-tight">检查点 2：选择验证方案</h3>
                  </div>
               </div>

               <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-primary-500 shrink-0" />
                    <span className="text-[14px] font-medium text-neutral-800">已找到4项事实、2条操盘手经验和1个相关历史项目；存在1项非阻断资料缺口。</span>
                 </div>
                 <button onClick={()=>setRightTab('basis')} className="shrink-0 text-[13px] font-bold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors">查看依据</button>
               </div>

               {/* Main Strategy Card */}
               <div className="space-y-6 pt-2">
                 <div className="bg-primary-50/20 border-2 border-primary-400 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">AI建议优先验证</div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shadow-inner"><BrainCircuit size={16}/></div>
                      <h4 className="text-[18px] font-bold text-primary-900 tracking-tight">专业经验与真实换粮过程验证</h4>
                    </div>

                    <div className="bg-white border border-primary-100 rounded-xl overflow-hidden text-[13px] shadow-sm">
                       <div className="grid grid-cols-1 divide-y divide-neutral-100">
                         <div className="flex p-4.5">
                           <span className="w-28 shrink-0 font-bold text-primary-800 mt-0.5">核心假设</span>
                           <span className="text-neutral-800 font-medium leading-relaxed">相比单纯放大焦虑，真实换粮过程配合专业解释，更容易产生收藏和明确问题评论。</span>
                         </div>
                         <div className="flex p-4.5 bg-neutral-50/50">
                           <span className="w-28 shrink-0 font-bold text-neutral-500 mt-0.5">为什么值得验证</span>
                           <span className="text-neutral-700 leading-relaxed">近期单纯痛点刺激类内容曝光转化率下滑，用户对常规话术免疫，需要建立更高专业信任。</span>
                         </div>
                         <div className="flex p-4.5">
                           <span className="w-28 shrink-0 font-bold text-neutral-500 mt-0.5">依据与不确定性</span>
                           <span className="text-neutral-700 leading-relaxed">该判断参考了操盘手经验和历史内容表现，但当前商家缺少同类内容的近期对照数据，因此仍属于待验证假设。</span>
                         </div>
                         <div className="flex p-4.5 bg-neutral-50/50">
                           <span className="w-28 shrink-0 font-bold text-neutral-500 mt-0.5">首批验证</span>
                           <span className="text-neutral-700 leading-relaxed">使用2个可用店长号发布4篇内容，其中2篇强调专业解释，2篇强调真实过程。</span>
                         </div>
                         <div className="flex p-4.5">
                           <span className="w-28 shrink-0 font-bold text-neutral-500 mt-0.5">可观测指标</span>
                           <span className="text-neutral-700 leading-relaxed">收藏数、明确问题评论数、人工登记的咨询线索，以及相较账号同龄笔记基线的变化。</span>
                         </div>
                         <div className="flex p-4.5 bg-emerald-50/30">
                           <span className="w-28 shrink-0 font-bold text-emerald-700 mt-0.5">继续条件</span>
                           <span className="text-emerald-800 font-medium leading-relaxed">上述指标中位数相较基线有明显提升。</span>
                         </div>
                         <div className="flex p-4.5 bg-amber-50/30">
                           <span className="w-28 shrink-0 font-bold text-amber-700 mt-0.5">停止或调整</span>
                           <span className="text-amber-800 font-medium leading-relaxed">内容有互动但没有出现明确问题评论，或专业表达导致审核风险上升。</span>
                         </div>
                         <div className="flex p-4.5">
                           <span className="w-28 shrink-0 font-bold text-neutral-500 mt-0.5">所需资源</span>
                           <span className="text-neutral-600 leading-relaxed">带狗狗真实出镜素材、专业营养成分对照图、熟悉产品特性的员工。</span>
                         </div>
                         <div className="flex p-4.5 bg-neutral-50/50">
                           <span className="w-28 shrink-0 font-bold text-neutral-500 mt-0.5">主要风险</span>
                           <span className="text-neutral-600 leading-relaxed">专业内容制作门槛高，容易引发平台医疗相关词汇限流。</span>
                         </div>
                       </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button onClick={()=>setShowAdjustment(true)} className="text-[13px] font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
                        <MessageSquare size={16}/> 和AI调整方案
                      </button>
                    </div>

                    {showAdjustment && (
                      <div className="mt-4 p-5 bg-white border border-primary-200 rounded-xl shadow-sm">
                         <div className="text-[13px] font-bold text-neutral-900 mb-3">提出调整要求</div>
                         <div className="flex items-center gap-2 mb-4">
                           <input type="text" placeholder="例如：预算控制在5000元以内，不要使用KOC..." className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary-400" />
                           <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-[13px] font-bold">让AI修改</button>
                         </div>
                         {/* Mock Diff */}
                         <div className="border-t border-neutral-100 pt-4">
                            <div className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-2"><Sparkles size={14} className="text-primary-500"/> 方案修改差异</div>
                            <div className="space-y-2 text-[12px]">
                               <div className="flex gap-2"><span className="text-neutral-500 w-24 shrink-0">修改了什么</span><span className="text-neutral-800 font-medium">首批验证由4篇改为2篇，仅测试真实过程。</span></div>
                               <div className="flex gap-2"><span className="text-neutral-500 w-24 shrink-0">修改原因</span><span className="text-neutral-800">响应“预算减半且先小范围测试”的要求。</span></div>
                               <div className="flex gap-2"><span className="text-neutral-500 w-24 shrink-0">对规模的影响</span><span className="text-amber-700">首批测试样本减少，验证可信度可能降低。</span></div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                               <button onClick={()=>setShowAdjustment(false)} className="px-4 py-2 text-[12px] font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">取消</button>
                               <button onClick={()=>setShowAdjustment(false)} className="px-4 py-2 text-[12px] font-bold bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 rounded-lg transition-colors">接受调整</button>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Alternatives */}
                 <div>
                    <button 
                      onClick={() => setShowAlternatives(!showAlternatives)}
                      className="flex items-center gap-2 text-[14px] font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <ChevronRight size={16} className={\`transition-transform \${showAlternatives ? 'rotate-90' : ''}\`} />
                      其他可验证方案（2）
                    </button>
                    
                    <AnimatePresence>
                      {showAlternatives && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4 space-y-4"
                        >
                           {/* Alternative 1 */}
                           <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                              <h5 className="font-bold text-neutral-900 mb-4 text-[15px]">情感共鸣与痛点探讨</h5>
                              <div className="grid grid-cols-1 gap-3 text-[13px]">
                                <div className="flex"><span className="w-28 shrink-0 text-neutral-500 font-bold">核心假设</span><span className="text-neutral-800">通过用户真实困扰建立共鸣，但不做直接推荐。</span></div>
                                <div className="flex"><span className="w-28 shrink-0 text-neutral-500 font-bold">适用条件</span><span className="text-neutral-800">真实场景素材充足，并且有适合表达生活经验的账号。</span></div>
                                <div className="flex"><span className="w-28 shrink-0 text-neutral-500 font-bold">当前为何不优先</span><span className="text-neutral-800">现有素材不足以支撑完整真实过程表达。</span></div>
                                <div className="flex"><span className="w-28 shrink-0 text-neutral-500 font-bold">建议切换信号</span><span className="text-neutral-800">专业解释内容有收藏但没有形成有效问题评论时，建议切换。</span></div>
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               </div>
             </div>
           )}

           {step === 3 && (
             <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm"><ListTodo size={20}/></div>
                 <h3 className="text-[20px] font-bold text-neutral-900 tracking-tight">检查点 3：审阅筹备协议</h3>
               </div>

               {/* 首批验证单元 */}
               <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm relative overflow-hidden flex gap-8">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                  
                  <div className="flex-1">
                    <h4 className="text-[16px] font-bold text-neutral-900 mb-6 flex items-center gap-2"><Target size={18} className="text-emerald-600"/> 首批验证单元</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-[13px]">
                       <div><div className="text-neutral-500 font-bold mb-1.5">首批内容数量</div><div className="text-neutral-900 font-medium">3 — 5 篇</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">内容变量</div><div className="text-neutral-900 font-medium">专业解释与真实换粮对照</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">建议账号</div><div className="text-neutral-900 font-medium">建议2个，全部可用</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">发布人</div><div className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">1个待确认</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">发布方式</div><div className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block">无可用方式</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">素材要求</div><div className="text-neutral-900 font-medium">真实场景视频截图</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">素材满足情况</div><div className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block">缺少必要素材1组</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">计划时间</div><div className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">待确认</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">链接回填方式</div><div className="text-neutral-900 font-medium">人工回填</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">数据观察方式</div><div className="text-neutral-900 font-medium">系统自动采集互动数据</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">观察窗口</div><div className="text-neutral-900 font-medium">7 天</div></div>
                       <div><div className="text-neutral-500 font-bold mb-1.5">复盘检查点</div><div className="text-neutral-900 font-medium">完成观察窗口后</div></div>
                    </div>
                  </div>

                  <div className="w-[300px] shrink-0 border-l border-neutral-100 pl-8">
                     <button 
                       onClick={() => setShowParams(!showParams)}
                       className="flex items-center justify-between w-full text-[14px] font-bold text-neutral-900 mb-6 group"
                     >
                        <span className="flex items-center gap-2"><Settings size={16} className="text-neutral-500 group-hover:text-neutral-900 transition-colors"/> 调整首批验证参数</span>
                        <ChevronDown size={16} className={\`text-neutral-400 transition-transform \${showParams ? 'rotate-180' : ''}\`} />
                     </button>
                     
                     <AnimatePresence>
                       {showParams && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden space-y-4 text-[13px]"
                         >
                            <div>
                              <label className="block text-neutral-500 font-bold mb-1.5">内容数量</label>
                              <select className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 outline-none">
                                <option>4篇 (推荐)</option>
                                <option>8篇</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-neutral-500 font-bold mb-1.5">观察天数</label>
                              <select className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 outline-none">
                                <option>7天 (推荐)</option>
                                <option>14天</option>
                              </select>
                            </div>
                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mt-4">
                               <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5"><Sparkles size={14}/> 调整影响</div>
                               <div className="text-blue-800 font-medium leading-relaxed">内容数量增加到8篇后，需要新增8组细节素材，并增加一次批量内容审核；能够覆盖更多内容变量，但首轮验证周期预计延长。</div>
                            </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </div>
               </div>

               {/* 执行准备度检查 */}
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm shadow-emerald-50 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                     <h5 className="text-[14px] font-bold text-emerald-800 flex items-center gap-2 mb-4"><CheckCircle2 size={18}/> 已具备</h5>
                     <ul className="text-[13px] text-emerald-700/80 space-y-3 list-disc pl-5 font-medium">
                       <li>商家知识可用</li>
                       <li>首批策略已确认</li>
                       <li>2个账号可用</li>
                       <li>现有素材满足3篇内容</li>
                     </ul>
                  </div>
                  <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm shadow-amber-50 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                     <h5 className="text-[14px] font-bold text-amber-800 flex items-center gap-2 mb-4"><AlertTriangle size={18}/> 待确认</h5>
                     <ul className="text-[13px] text-amber-700/80 space-y-3 list-disc pl-5 font-medium">
                       <li>1个账号发布人</li>
                       <li>首批发布时间</li>
                       <li>内容审核负责人</li>
                     </ul>
                  </div>
                  <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm shadow-red-50 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
                     <h5 className="text-[14px] font-bold text-red-800 flex items-center gap-2 mb-4"><X size={18}/> 阻断项</h5>
                     <ul className="text-[13px] text-red-700/80 space-y-3 list-disc pl-5 font-medium mb-5">
                       <li>必要素材无法取得 (1组)</li>
                       <li>无发布方式</li>
                     </ul>
                     <div className="flex flex-col gap-2 mt-auto">
                        <button className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 text-[12px] font-bold rounded-lg transition-colors">创建补足任务</button>
                     </div>
                  </div>
               </div>

               {/* 受控工作流 */}
               <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[16px] font-bold text-neutral-900">受控工作流步骤</h4>
                    <button onClick={()=>setRightTab('execution')} className="text-[13px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck size={16}/> 查看后台执行依据
                    </button>
                  </div>
                  <div className="space-y-6 text-[14px] text-neutral-700 relative before:absolute before:inset-0 before:left-[13px] before:w-0.5 before:bg-neutral-100">
                     {[
                       { text: "检索商家知识与历史项目", tag: "自动分析", type: "auto" },
                       { text: "生成首批选题和内部草稿", tag: "自动生成内部产物", type: "auto" },
                       { text: "内容与合规审核", tag: "人工确认", type: "manual" },
                       { text: "匹配已有素材", tag: "自动匹配", type: "auto" },
                       { text: "为素材缺口创建任务", tag: "批次确认", type: "batch" },
                       { text: "确认账号、发布人和发布方式", tag: "人工确认", type: "manual" },
                       { text: "创建发布任务", tag: "批次确认", type: "batch" },
                       { text: "员工手机发布并回填笔记链接", tag: "人工执行", type: "execute" },
                       { text: "按已接入能力采集公开互动数据", tag: "链接回填后运行", type: "auto" },
                       { text: "到达观察窗口后生成AI初步复盘", tag: "AI生成，操盘手确认", type: "auto" },
                     ].map((flow, i) => (
                        <div key={i} className="flex items-start gap-5 relative z-10">
                           <div className={\`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold border-2 bg-white shrink-0 shadow-sm \${flow.type === 'manual' || flow.type === 'execute' ? 'border-amber-400 text-amber-600' : flow.type === 'batch' ? 'border-purple-400 text-purple-600' : 'border-blue-400 text-blue-600'}\`}>
                             {i+1}
                           </div>
                           <div className="flex-1 mt-1 font-medium">{flow.text}</div>
                           <div className={\`text-[12px] font-bold px-3 py-1 rounded-md mt-0.5 border \${flow.type === 'manual' || flow.type === 'execute' ? 'bg-amber-50 text-amber-800 border-amber-200' : flow.type === 'batch' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-neutral-50 text-neutral-600 border-neutral-200'}\`}>
                             {flow.tag}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             </div>
           )}

        </div>
        
        {/* Right AI / Info Panel */}
        <div className="w-[420px] shrink-0 border-l border-neutral-200 bg-white flex flex-col z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
           {rightTab === 'chat' && (
             <>
               <div className="p-5 border-b border-neutral-100 font-bold text-[15px] text-neutral-900 bg-white flex items-center gap-2 shadow-sm relative z-10">
                  <Sparkles size={18} className="text-primary-500"/> AI 协作助手
               </div>
               <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-neutral-50/30">
                  {aiState === 'draft_ready' && step === 1 && (
                    <div className="bg-white p-5 rounded-2xl text-[13px] text-neutral-700 leading-relaxed border border-neutral-200 shadow-sm">
                       <p className="mb-4 font-medium text-neutral-900">我已经为你整理了项目草案。为了让后续方案更精准，还需要你补充几个细节：</p>
                       <ul className="space-y-3 font-medium">
                         <li className="flex gap-2"><span className="text-primary-500 shrink-0">1.</span> 此次验证的具体产品是哪款（全期犬粮还是幼犬专用）？</li>
                         <li className="flex gap-2"><span className="text-primary-500 shrink-0">2.</span> “有效咨询”的具体定义是什么（比如问价格、问成分、还是求推荐）？</li>
                         <li className="flex gap-2"><span className="text-primary-500 shrink-0">3.</span> 目前能参与互动的员工大概有多少人？</li>
                       </ul>
                    </div>
                  )}
               </div>
               <div className="p-5 border-t border-neutral-100 bg-white shrink-0">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl flex items-center px-4 py-3 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all shadow-sm">
                     <input type="text" placeholder="回复AI补充细节或提出修改..." className="flex-1 bg-transparent text-[13px] outline-none font-medium placeholder:text-neutral-400" />
                     <button className="text-primary-600 p-1.5 hover:bg-primary-50 rounded-lg transition-colors"><ArrowRight size={18}/></button>
                  </div>
               </div>
             </>
           )}

           {rightTab === 'basis' && (
             <>
               <div className="p-5 border-b border-neutral-100 font-bold text-[15px] text-neutral-900 bg-white flex justify-between items-center shadow-sm relative z-10">
                  <span className="flex items-center gap-2"><Compass size={18} className="text-blue-600"/> 资料库检查结果</span>
                  <button onClick={()=>setRightTab('chat')} className="text-neutral-400 hover:text-neutral-700 bg-neutral-50 p-1.5 rounded-lg transition-colors"><X size={16}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-neutral-50/30">
                  {/* 已确认事实 */}
                  <div>
                    <h5 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500"/> 已确认事实</h5>
                    <ul className="space-y-4 text-[13px]">
                      <li className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                        <div className="font-bold text-neutral-900 mb-1.5">品牌过往爆文多以开箱测评形式呈现</div>
                        <div className="text-neutral-500 font-medium text-[11px] bg-neutral-50 inline-block px-2 py-0.5 rounded border border-neutral-100">来源：历史项目复盘 • 自动确认</div>
                      </li>
                    </ul>
                  </div>
                  
                  {/* 资料缺口 */}
                  <div>
                    <h5 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500"/> 缺少的信息</h5>
                    <ul className="space-y-4 text-[13px]">
                      <li className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                        <div className="font-bold text-amber-900 mb-2">近30天的竞品痛点评论样本</div>
                        <div className="text-amber-800 font-medium mb-3">非阻断缺口：允许带假设继续，但必须进入验证计划。</div>
                        <div className="flex gap-3 mt-4">
                          <button className="flex-1 py-2 bg-white border border-amber-300 text-amber-800 rounded-lg font-bold hover:bg-amber-50 transition-colors shadow-sm text-[12px]">添加已有资料</button>
                          <button className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-sm text-[12px]">创建人工采集</button>
                        </div>
                        <button className="w-full mt-2 py-2 bg-transparent text-amber-800 hover:bg-amber-100/50 rounded-lg font-bold transition-colors text-[12px]">带假设继续</button>
                      </li>
                    </ul>
                  </div>
               </div>
             </>
           )}

           {rightTab === 'execution' && (
             <>
               <div className="p-5 border-b border-neutral-100 font-bold text-[15px] text-neutral-900 bg-white flex justify-between items-center shadow-sm relative z-10">
                  <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> 执行依据</span>
                  <button onClick={()=>setRightTab('chat')} className="text-neutral-400 hover:text-neutral-700 bg-neutral-50 p-1.5 rounded-lg transition-colors"><X size={16}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-8 text-[13px] bg-neutral-50/30">
                  <div>
                    <h5 className="font-bold text-neutral-900 mb-3 text-[14px]">使用的商家知识</h5>
                    <div className="bg-white border border-neutral-200 p-4 rounded-xl text-neutral-700 font-medium shadow-sm">《品牌视觉规范2026版》《幼犬粮成分表与卖点话术》</div>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 mb-3 text-[14px]">后台需要调用的能力</h5>
                    <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl text-blue-900 space-y-3 shadow-sm">
                      <div className="font-bold flex items-center gap-2"><Sparkles size={16} className="text-blue-600"/> 笔记草稿生成能力 (LLM API)</div>
                      <div className="font-bold flex items-center gap-2"><Database size={16} className="text-blue-600"/> 现有资产查询系统</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-900 mb-3 text-[14px]">审批规则</h5>
                    <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl text-amber-900 font-medium shadow-sm leading-relaxed">
                      所有发布账号变更和对外内容输出，均需主理人人工确认后方可执行。
                    </div>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-[420px] p-5 border-t border-neutral-200 bg-white flex justify-between items-center z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
         <button 
           onClick={() => setStep(s => Math.max(1, s-1))} 
           disabled={step === 1} 
           className={\`w-[120px] py-3 border border-neutral-200 text-[14px] font-bold rounded-xl transition-colors \${step === 1 ? 'opacity-50 text-neutral-400 bg-neutral-50 cursor-not-allowed' : 'text-neutral-700 bg-white hover:bg-neutral-50 shadow-sm'}\`}
         >
           上一步
         </button>
         
         {step < 3 ? (
            <button 
              onClick={() => setStep(s => s+1)} 
              disabled={aiState !== 'draft_ready'}
              className={\`w-[200px] py-3 text-[14px] font-bold rounded-xl transition-all shadow-sm \${aiState !== 'draft_ready' ? 'opacity-50 text-white bg-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-800'}\`}
            >
              下一步
            </button>
         ) : (
            <div className="flex flex-col items-end gap-2">
              {/* Has blockers -> change button text */}
              <button 
                onClick={handleCreate}
                className="w-[260px] py-3 bg-neutral-900 text-white text-[14px] font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
              >
                保存草案并处理阻断项
              </button>
              <span className="text-[11px] text-neutral-400 font-medium">创建后只会生成项目记录、内部草稿和待办任务，不会自动发布、派发员工任务或产生预算支出。</span>
            </div>
         )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/merchant/CreateProjectWorkstation.tsx', content);
console.log("Updated workstation successfully.");
